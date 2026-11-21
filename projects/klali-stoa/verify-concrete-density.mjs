/** Verify native metre-to-texel mapping from the authored GLB, independent of the chart planner. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import sharp from "sharp";

const directory = resolve(process.argv[2]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const arena = await io.read(resolve(directory, "arena-concrete.glb"));
const sizes = new Map();

async function dimensions(texture) {
  if (!sizes.has(texture)) sizes.set(texture, await sharp(texture.getImage()).metadata());
  return sizes.get(texture);
}
for (const id of ["brush-106", "brush-109", "brush-737"]) {
  const node = arena.getRoot().listNodes().find(n => (n.getExtras().objectId ?? n.getName()) === id);
  assert(node?.getMesh(), id);
  let measured = 0;
  for (const part of node.getMesh().listPrimitives()) {
    const material = part.getMaterial();
    if (!material.getName().startsWith("Arena concrete ")) continue;
    const positions = part.getAttribute("POSITION"), normals = part.getAttribute("NORMAL"), index = part.getIndices();
    const uv = part.getAttribute("TEXCOORD_0");
    const color = await dimensions(material.getBaseColorTexture());
    const normal = await dimensions(material.getNormalTexture());
    const roughness = await dimensions(material.getMetallicRoughnessTexture());
    for (let i=0; i<(index ?? positions).getCount(); i+=3) {
      const ids = [0,1,2].map(k => index?.getScalar(i+k) ?? i+k);
      if (Math.abs(normals.getElement(ids[0],[])[2]) > 0.1) continue;
      const [a,b,c] = ids.map(k => positions.getElement(k,[])), [u,v,w] = ids.map(k => uv.getElement(k,[]));
      const e = b.map((x,k)=>x-a[k]), f = c.map((x,k)=>x-a[k]);
      const area = Math.hypot(e[1]*f[2]-e[2]*f[1], e[2]*f[0]-e[0]*f[2], e[0]*f[1]-e[1]*f[0]);
      const uvArea = Math.abs((v[0]-u[0])*(w[1]-u[1]) - (w[0]-u[0])*(v[1]-u[1]));
      if (area < 1e-8) continue;
      const density = image => Math.sqrt(uvArea * image.width * image.height / area);
      assert(density(color) > 120, id + " upright texels per metre: " + density(color));
      assert.equal(density(normal), density(color), id + " close normal density");
      assert.equal(density(roughness), density(color) / 2, id + " close roughness density");
      measured++;
    }
  }
  assert(measured >= 8, id + " must keep its four upright faces");
}

if (process.argv[3]) {
  const path = resolve(process.argv[3]), bytes = await readFile(path);
  const json = JSON.parse(bytes.toString("utf8", 20, 20 + bytes.readUInt32LE(12)));
  const record = json.scenes[json.scene ?? 0].extras.worldSpecConcreteDetail;
  assert.equal(record.version, 1);
  assert(record.mean > .49 && record.mean < .51);
  const texture = json.textures[record.texture], image = json.images[texture.source], view = json.bufferViews[image.bufferView];
  const buffer = await readFile(resolve(dirname(path),json.buffers[view.buffer].uri));
  const encoded = buffer.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
  const pixels = await sharp(encoded).metadata();
  const data = await sharp(encoded).greyscale().raw().toBuffer();
  const mean = data.reduce((sum, value) => sum + value, 0) / (255 * data.length);
  const variance = data.reduce((sum, value) => sum + (value / 255 - mean) ** 2, 0) / data.length;
  assert(Math.abs(record.mean - mean) < 1e-6);
  assert(record.strength > 0 && Math.sqrt(variance) * record.strength > .01);
  assert.deepEqual(json.samplers[texture.sampler], {magFilter:9729, minFilter:9987, wrapS:10497, wrapT:10497});
  const marked = json.materials.filter(m => m.extras?.worldSpecConcrete);
  assert(marked.length >= 6);
  assert(marked.every(m => m.pbrMetallicRoughness?.baseColorTexture && m.normalTexture));
  assert.equal(pixels.width / record.metersPerTile, 1024);
  assert.equal(pixels.width / record.micro.metersPerTile, 8192);
  assert(record.micro.strength > 0 && record.micro.strength < record.strength);
  const paving = json.materials.filter(m => m.pbrMetallicRoughness?.baseColorTexture &&
    json.images[json.textures[m.pbrMetallicRoughness.baseColorTexture.index].source].name === "Laid stone paving");
  assert(paving.length > 0 && paving.every(m => m.extras?.worldSpecAggregate === true),
    "walkable paving must receive the inspection-distance aggregate");
  assert.equal(pixels.width, pixels.height);
  // A 2048px file obtained by enlarging the previous tile cannot restore
  // aggregate above its old Nyquist frequency. Measure that band after encoding.
  const half = await sharp(encoded).resize(pixels.width / 2, pixels.height / 2).png().toBuffer();
  const low = await sharp(half).resize(pixels.width, pixels.height).greyscale().raw().toBuffer();
  const fineEnergy = data.reduce((sum, value, i) => sum + (value - low[i]) ** 2, 0) / data.length;
  assert(Math.sqrt(fineEnergy) > 5, "published aggregate must carry resolved sub-2mm structure");
  assert(json.materials.filter(m => m.name?.startsWith("Arena concrete ")).every(m => m.extras.worldSpecConcrete === true));
  const balconies = json.meshes.filter(m => /^building-[0-5]$/.test(m.name));
  assert.equal(balconies.length, 6);
  for (const mesh of balconies) {
    const faces = mesh.primitives.filter(p => json.materials[p.material].extras?.worldSpecConcrete);
    assert.equal(faces.reduce((n,p)=>n+json.accessors[p.indices ?? p.attributes.POSITION].count/3,0), 80);
  }
}
console.log("Verified concrete chart texel density" + (process.argv[3] ? " and shared packed material" : ""));
