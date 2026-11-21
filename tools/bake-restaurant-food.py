"""Import the two approved food GLBs at uniform scale, preserving UVs and smooth normals. Run in Blender."""
import hashlib
import json
import math
import subprocess
import os
import shutil
import tempfile
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

ROOT = Path.cwd()
SUPERSPEC = Path(os.environ.get("SUPERSPEC_ROOT", ROOT.parent / "superspec")).resolve()
os.environ["SUPERSPEC_ROOT"] = str(SUPERSPEC)
material_tool = os.environ.get("SUPERSPEC_MATERIALS", str(
    SUPERSPEC / "target/release" / ("superspec-materials.exe" if os.name == "nt" else "superspec-materials")))
PROJECT = ROOT / 'projects/kowloon-restaurant-props'
OUTPUT = ROOT / 'generated/restaurant-props/food-bake'
OUTPUT.mkdir(parents=True, exist_ok=True)
SPECS = [('chicken', 'chicken-result.json', [.235,.21,.49], 900),
         ('slices', 'slices-result.json', [.30,.21,.075], 500)]
catalog, report = {}, []


for name, result, envelope, budget in SPECS:
    task = json.loads((PROJECT / 'source-models' / result).read_text())
    path = ROOT / task['model_file']
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    bpy.ops.import_scene.gltf(filepath=str(path))
    objects = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
    rotation = Matrix.Rotation(-math.pi/2, 4, 'Z')
    points = [rotation @ obj.matrix_world @ vertex.co for obj in objects for vertex in obj.data.vertices]
    low = Vector([min(p[i] for p in points) for i in range(3)])
    high = Vector([max(p[i] for p in points) for i in range(3)])
    span = high-low
    scale = min(envelope[i]/span[i] for i in range(3))
    origin = Vector([(low.x+high.x)/2,(low.y+high.y)/2,low.z])
    anchor = (max(points, key=lambda p:p.z)-origin)*scale
    faces = []
    for obj in objects:
        mesh = obj.data
        mesh.calc_loop_triangles()
        transform = rotation @ obj.matrix_world
        normal_transform = transform.to_3x3().inverted().transposed()
        uv = mesh.uv_layers.active.data
        for triangle in mesh.loop_triangles:
            corners = []
            for loop, index in zip(triangle.loops, triangle.vertices):
                point = (transform @ mesh.vertices[index].co-origin)*scale
                normal = (normal_transform @ mesh.corner_normals[loop].vector).normalized()
                geometric = (normal_transform @ triangle.normal).normalized()
                if normal.dot(geometric) < .15:
                    normal = geometric
                corners.append([*point,*normal,*uv[loop].uv])
            faces.append(corners)
    assert len(faces) <= budget, (name, len(faces), budget)
    subprocess.run([material_tool, "extract-glb-maps", str(path), name, str(OUTPUT)], check=True)
    catalog[name] = {'size':list(span*scale),'anchor':list(anchor),'faces':faces}
    report.append({'name':name,'source':str(path.relative_to(ROOT)),'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),
                   'triangles':len(faces),'budget':budget,'size':list(span*scale),'uniformScale':scale,'task':task})
(OUTPUT/'catalog.json').write_text(json.dumps(catalog))
(PROJECT/'food-bake.json').write_text(json.dumps(report,indent=2)+'\n')
with tempfile.TemporaryDirectory(prefix='levelspec-food-') as temporary:
    packed = Path(temporary) / 'packed'
    subprocess.run([material_tool,
                    'pack-restaurant-food', str(OUTPUT), str(packed)], check=True)
    outputs = {}
    for name in ('restaurant-food.json', 'restaurant-food.png', 'restaurant-food-normal.png',
                 'restaurant-food-properties.png'):
        destination = (SUPERSPEC / 'crates/engine/src/worldspec/themes/kowloon/shop/assets' if name.endswith('.json')
                       else ROOT / 'projects/dressing-demo/textures') / name
        shutil.copyfile(packed / name, destination)
        output_id = ('superspec/' + destination.relative_to(SUPERSPEC).as_posix()
                     if name.endswith('.json') else destination.relative_to(ROOT).as_posix())
        outputs[output_id] = hashlib.sha256(destination.read_bytes()).hexdigest()
    (PROJECT / 'food-production.json').write_text(json.dumps({
        'outputs': outputs, 'textureSize': [1024, 1024], 'padding': 4,
        'variants': ['amber', 'golden', 'mahogany'], 'metalness': 0, 'minimumRoughness': 125 / 255,
    }, indent=2) + '\n')
