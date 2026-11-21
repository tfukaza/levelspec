"""Bake the approved pilot GLBs into normalized storefront meshes. Run with Blender."""
import json
import math
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import bpy
import bmesh
import sys
from mathutils import Matrix, Vector

ROOT = Path.cwd()
SUPERSPEC = Path(os.environ.get("SUPERSPEC_ROOT", ROOT.parent / "superspec")).resolve()
os.environ["SUPERSPEC_ROOT"] = str(SUPERSPEC)
MODELS = json.loads((ROOT / "projects/kowloon-asset-pilot/models.json").read_text())
ASSETS = SUPERSPEC / "crates/engine/src/worldspec/themes/kowloon/shop/assets"
TEXTURES = ROOT / "projects/dressing-demo/textures"
material_tool = os.environ.get("SUPERSPEC_MATERIALS", str(
    SUPERSPEC / "target/release" / ("superspec-materials.exe" if os.name == "nt" else "superspec-materials")))


def load_stock(asset, budget, texture_size):
    """Return triangles in a Z-up frame facing -Y, with base at zero and unit spans."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.ops.import_scene.gltf(filepath=str(ROOT / MODELS[asset]))
    obj, = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
    bpy.context.view_layer.objects.active = obj
    # GLB UV seams duplicate positions; weld geometry before decimation while keeping loop UVs.
    welded = bmesh.new()
    welded.from_mesh(obj.data)
    bmesh.ops.remove_doubles(welded, verts=list(welded.verts), dist=0.00001)
    welded.to_mesh(obj.data)
    welded.free()
    obj.data.calc_loop_triangles()
    modifier = obj.modifiers.new("Stock triangle budget", "DECIMATE")
    modifier.ratio = budget / len(obj.data.loop_triangles)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    mesh = obj.data
    mesh.calc_loop_triangles()
    world = [obj.matrix_world @ vertex.co for vertex in mesh.vertices]
    points = [(p.y, -p.x, p.z) for p in world]
    lo = [min(p[i] for p in points) for i in range(3)]
    hi = [max(p[i] for p in points) for i in range(3)]
    origin = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, lo[2]]
    uv = mesh.uv_layers.active.data
    rotation = obj.matrix_world.to_quaternion()
    faces = []
    for tri in mesh.loop_triangles:
        face = []
        for loop, index in zip(tri.loops, tri.vertices):
            p = [(points[index][i] - origin[i]) / (hi[i] - lo[i]) for i in range(3)]
            normal = rotation @ mesh.corner_normals[loop].vector
            components = (normal.y, -normal.x, normal.z)
            normalized = [components[i] * (hi[i] - lo[i]) for i in range(3)]
            face.append([*p, *normalized, *uv[loop].uv])
        faces.append(face)
    material = mesh.materials[0]
    base = next(node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    image = base.inputs["Base Color"].links[0].from_node.image
    with tempfile.TemporaryDirectory() as directory:
        packed = image.packed_file
        source = Path(directory) / "color-image"
        source.write_bytes(packed.data)
        subprocess.run([material_tool, "resize-stock-texture", str(source), str(texture_size),
                        str(TEXTURES / f"{asset}.png")], check=True)
    return faces


def render_packet(output_path):
    """Render the source label without lighting for the native pouch baker."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.ops.import_scene.gltf(filepath=str(ROOT / MODELS["snack-packet"]))
    obj, = [obj for obj in bpy.context.selected_objects if obj.type == "MESH"]
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    points = [Vector((point.y, -point.x, point.z)) for point in points]
    low = Vector([min(point[i] for point in points) for i in range(3)])
    high = Vector([max(point[i] for point in points) for i in range(3)])
    span = high-low
    origin = Vector(((low.x+high.x)/2, (low.y+high.y)/2, low.z))
    for vertex, point in zip(obj.data.vertices, points):
        vertex.co = point-origin
    obj.matrix_world = Matrix.Identity(4)
    material = obj.data.materials[0]
    nodes = material.node_tree.nodes
    base = next(node for node in nodes if node.type == "BSDF_PRINCIPLED")
    color = base.inputs["Base Color"].links[0].from_socket
    emission = nodes.new("ShaderNodeEmission")
    material.node_tree.links.new(color, emission.inputs["Color"])
    output = next(node for node in nodes if node.type == "OUTPUT_MATERIAL")
    material.node_tree.links.new(emission.outputs[0], output.inputs["Surface"])
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 8
    scene.render.resolution_x = scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0
    scale = span.z*1.02
    bpy.ops.object.camera_add(location=(0, -span.y-2, span.z/2), rotation=(math.pi/2, 0, 0))
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = scale
    scene.camera = camera
    scene.world.color = (.57, .45, .28)
    scene.render.film_transparent = True
    scene.render.filepath = str(output_path)
    bpy.ops.render.render(write_still=True)
    return span.x / span.z


# A targeted rebake keeps unrelated accepted geometry and textures byte-for-byte stable.
selected = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
if not selected or "apple" in selected:
    apple = load_stock("market-apple", 64, 256)
    with tempfile.TemporaryDirectory(prefix="levelspec-apple-") as temporary:
        source = Path(temporary) / "apple.json"
        source.write_text(json.dumps(apple), encoding="utf-8")
        subprocess.run([material_tool, "apple-pile", str(source), str(ASSETS / "apple-pile.json")], check=True)
if not selected or "packet" in selected:
    with tempfile.TemporaryDirectory(prefix="levelspec-pouches-") as temporary:
        workspace = Path(temporary)
        source = workspace / "label.png"
        aspect = render_packet(source)
        repaired = workspace / "repaired"
        subprocess.run([material_tool, "repair-snack-packet", str(source), str(aspect), str(repaired)], check=True)
        shutil.copyfile(repaired / "snack-packet.json", ASSETS / "snack-packet.json")
        shutil.copyfile(repaired / "snack-packet-base.png",
                        ROOT / "projects/kowloon-liquor-props/materials/snack-packet-base.png")
        packed = workspace / "packed"
        subprocess.run([material_tool, "snack-packets", str(ROOT), str(TEXTURES), str(packed)], check=True)
        shutil.copyfile(packed / "snack-packet.png", TEXTURES / "snack-packet.png")
