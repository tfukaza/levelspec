"""Import approved Tripo props into a meter-based Z-up catalog. Run with Blender."""
import hashlib
import json
import math
import subprocess
import os
import shutil
import tempfile
from pathlib import Path

import bpy
import bmesh
from mathutils import Matrix, Vector

ROOT = Path.cwd()
SUPERSPEC = Path(os.environ.get("SUPERSPEC_ROOT", ROOT.parent / "superspec")).resolve()
os.environ["SUPERSPEC_ROOT"] = str(SUPERSPEC)
material_tool = os.environ.get("SUPERSPEC_MATERIALS", str(
    SUPERSPEC / "target/release" / ("superspec-materials.exe" if os.name == "nt" else "superspec-materials")))
PROJECT = ROOT / "projects/kowloon-liquor-props"
OUTPUT = ROOT / "generated/liquor-props/bake"
OUTPUT.mkdir(parents=True, exist_ok=True)
SPECS = [spec for spec in json.loads((PROJECT / "assets.json").read_text()) if "adoption" not in spec]
for spec in SPECS:
    spec["budget"] = spec.get("productionBudget", spec["budget"])
SPECS.append({"name": "seasoning-jar", "budget": 96, "size": [.14, .14, .23]})
MODELS = json.loads((PROJECT / "models.json").read_text())
CATALOG = {}
REPORT = []


def import_asset(spec, tile):
    """Retain proportions, fit the declared envelope uniformly, and remap to an atlas tile."""
    name = spec["name"]
    path = ROOT / MODELS[name]
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.ops.import_scene.gltf(filepath=str(path))
    objects = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
    source_triangles = 0
    for obj in objects:
        mesh_edit = bmesh.new()
        mesh_edit.from_mesh(obj.data)
        bmesh.ops.remove_doubles(mesh_edit, verts=list(mesh_edit.verts), dist=1e-6)
        mesh_edit.to_mesh(obj.data)
        mesh_edit.free()
        obj.data.update()
        obj.data.calc_loop_triangles()
        source_triangles += len(obj.data.loop_triangles)
    for obj in objects:
        if source_triangles <= spec["budget"]:
            continue
        bpy.context.view_layer.objects.active = obj
        modifier = obj.modifiers.new("Production budget", "DECIMATE")
        modifier.ratio = max(0.01, (spec["budget"] - 2) / source_triangles)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    # Tripo's front is +X after Blender's Y-up conversion; the shop faces -Y.
    orientation = Matrix.Rotation(-math.pi / 2, 4, "Z")
    if "alignNormal" in spec:
        orientation = Vector(spec["alignNormal"]).rotation_difference(Vector((0, 0, 1))).to_matrix().to_4x4() @ orientation
    if "rotation" in spec:
        for axis, degrees in zip("XYZ", spec["rotation"]):
            orientation = Matrix.Rotation(math.radians(degrees), 4, axis) @ orientation
    world = [orientation @ obj.matrix_world @ vertex.co for obj in objects for vertex in obj.data.vertices]
    low = Vector([min(point[i] for point in world) for i in range(3)])
    high = Vector([max(point[i] for point in world) for i in range(3)])
    span = high - low
    factor = min(spec["size"][i] / span[i] for i in range(3))
    origin = Vector([(low.x + high.x) / 2, (low.y + high.y) / 2, low.z])
    size = list(span * factor)
    faces = []
    subprocess.run([material_tool,
                    "extract-glb-maps", str(path), name, str(OUTPUT)], check=True)
    for obj in objects:
        mesh = obj.data
        mesh.calc_loop_triangles()
        uv = mesh.uv_layers.active.data
        transform = orientation @ obj.matrix_world
        normal_transform = transform.to_3x3().inverted().transposed()
        for triangle in mesh.loop_triangles:
            face = []
            for loop, index in zip(triangle.loops, triangle.vertices):
                point = (transform @ mesh.vertices[index].co - origin) * factor
                if name == "shop-counter" and point.z > size[2] - .015:
                    point.z = size[2]
                normal = (normal_transform @ mesh.corner_normals[loop].vector).normalized()
                geometric = (normal_transform @ triangle.normal).normalized()
                if normal.dot(geometric) <= .15:
                    normal = geometric
                u, v = uv[loop].uv
                # Four-pixel gutters protect adjacent asset tiles at small mip levels.
                atlas_uv = [(tile % 5 * 512 + 4 + u * 504) / 2560,
                            ((3 - tile // 5) * 512 + 4 + v * 504) / 2048]
                face.append([*point, *normal, *atlas_uv, u, v])
            faces.append(face)
    if name == "drinks-cooler":
        # Retain the cabinet skin; replace fused stock and shelves in its cavity.
        faces = [face for face in faces if not (
            abs(sum(v[0] for v in face)/3) < size[0]*.42
            and -size[1]*.48 < sum(v[1] for v in face)/3 < size[1]*.40
            and size[2]*.20 < sum(v[2] for v in face)/3 < size[2]*.86)]
    CATALOG[name] = {"size": size, "faces": faces, "tile": tile}
    REPORT.append({"name": name, "source": str(path.relative_to(ROOT)),
                   "sourceSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                   "sourceTriangles": source_triangles, "triangles": len(faces),
                   "budget": spec["budget"], "size": size, "uniformScale": factor})
    print(name, len(faces), size)


for tile, spec in enumerate(SPECS):
    import_asset(spec, tile)
MODELS["dry-goods-bag"] = MODELS["rice-sack"]
import_asset({"name": "dry-goods-bag", "budget": 96, "size": [.12, .12, .17]}, 0)
bottle = next(spec for spec in SPECS if spec["name"] == "drink-bottle")
full = CATALOG["drink-bottle"]
import_asset({**bottle, "budget": 80}, SPECS.index(bottle))
CATALOG["bottle-load-source"] = CATALOG["drink-bottle"]
CATALOG["drink-bottle"] = full
with tempfile.TemporaryDirectory(prefix="levelspec-liquor-") as temporary:
    workspace = Path(temporary)
    source = workspace / "catalog.json"
    source.write_text(json.dumps(CATALOG), encoding="utf-8")
    subprocess.run([material_tool, "prepare-liquor-meshes", str(source), str(OUTPUT / "catalog.json")], check=True)
    prepared = json.loads((OUTPUT / "catalog.json").read_text(encoding="utf-8"))
    next(entry for entry in REPORT if entry["name"] == "bottle-crate")["triangles"] = len(prepared["bottle-crate"]["faces"])
    (PROJECT / "bake-report.json").write_text(json.dumps(REPORT, indent=2) + "\n", encoding="utf-8")
    packed = workspace / "packed"
    subprocess.run([material_tool, "pack-liquor", str(OUTPUT), str(packed)], check=True)
    finished = workspace / "grocer-props.json"
    subprocess.run([material_tool, "finish-liquor-meshes", str(packed / "grocer-props.json"), str(finished)], check=True)
    shutil.copyfile(finished, SUPERSPEC / "crates/engine/src/worldspec/themes/kowloon/shop/assets/grocer-props.json")
    for name in ("grocer-props.png", "grocer-props-normal.png", "grocer-props-properties.png"):
        shutil.copyfile(packed / name, ROOT / "projects/dressing-demo/textures" / name)
assets = SUPERSPEC / "crates/engine/src/worldspec/themes/kowloon/shop/assets"
textures = ROOT / "projects/dressing-demo/textures"
with tempfile.TemporaryDirectory(prefix="levelspec-stock-") as temporary:
    workspace = Path(temporary)
    refined = workspace / "refined"
    subprocess.run([material_tool, "refine-stock", str(ROOT), str(OUTPUT / "catalog.json"), str(refined)], check=True)
    for file in refined.iterdir():
        shutil.copyfile(file, (assets if file.suffix == ".json" else textures) / file.name)
    for recipe in ("stock-appearances", "clean-stock", "shop-cartons", "crate-wear"):
        packed = workspace / recipe
        subprocess.run([material_tool, recipe, str(ROOT), str(textures), str(packed)], check=True)
        for file in packed.iterdir():
            if file.suffix == ".json":
                destinations = [assets]
            elif file.name.startswith("grocer-props") or file.name == "snack-packet.png":
                destinations = [textures, SUPERSPEC / "assets/materials"]
            else:
                destinations = [PROJECT / "materials/clean-stock"]
            for destination in destinations:
                shutil.copyfile(file, destination / file.name)
    bags = workspace / "bag-clusters.json"
    subprocess.run([material_tool, "bag-clusters", str(assets / "grocer-props.json"), str(bags)], check=True)
    shutil.copyfile(bags, assets / bags.name)
provenance_path = SUPERSPEC / "assets/materials/provenance.json"
provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
for name in ["grocer-props.png", "grocer-props-normal.png", "grocer-props-properties.png", "snack-packet.png"]:
    if name in provenance["assets"]:
        provenance["assets"][name]["sha256"] = hashlib.sha256((textures / name).read_bytes()).hexdigest()
provenance_path.write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
CATALOG = json.loads((assets / "grocer-props.json").read_text())

production = []
for name, asset in CATALOG.items():
    production.append({"name": name, "texturedTriangles": len(asset["faces"]),
                       "paintedTriangles": len(asset.get("paintedFaces", [])),
                       "triangles": len(asset["faces"]) + len(asset.get("paintedFaces", [])),
                       "size": asset["size"]})
(PROJECT / "production-metrics.json").write_text(json.dumps(production, indent=2) + "\n")
