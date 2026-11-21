import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import { validateBytes } from "gltf-validator";

const project = new URL("./", import.meta.url);
const root = new URL("../../", project);
const tile = 256;
const border = 4;
const interior = tile - border * 2;
const columns = 4;
const manifest = JSON.parse(await readFile(new URL("trays.json", project), "utf8"));
const width = tile * columns;
const height = tile * 2 ** Math.ceil(Math.log2(Math.ceil(manifest.length / columns)));
const atlas = ["", "-normal", "-properties"].map(() => new PNG({ width, height }));
const models = [];
const evidence = [];
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const round = value => Math.round(value * 1e6) / 1e6;

function paste(target, source, left, top) {
  const image = source[0] === 0xff ? jpeg.decode(source) : PNG.sync.read(source);
  for (let y = 0; y < tile; y++) for (let x = 0; x < tile; x++) {
    const sx = Math.min(interior - 1, Math.max(0, x - border));
    const sy = Math.min(interior - 1, Math.max(0, y - border));
    const x0 = Math.floor(sx * image.width / interior);
    const y0 = Math.floor(sy * image.height / interior);
    const x1 = Math.max(x0 + 1, Math.floor((sx + 1) * image.width / interior));
    const y1 = Math.max(y0 + 1, Math.floor((sy + 1) * image.height / interior));
    const targetOffset = ((top + y) * width + left + x) * 4;
    const sum = [0, 0, 0];
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
      const sourceOffset = (yy * image.width + xx) * 4;
      for (let channel = 0; channel < 3; channel++) sum[channel] += image.data[sourceOffset + channel];
    }
    for (let channel = 0; channel < 3; channel++)
      target.data[targetOffset + channel] = Math.round(sum[channel] / ((x1 - x0) * (y1 - y0)));
    target.data[targetOffset + 3] = 255;
  }
}

for (const [index, source] of manifest.entries()) {
  const bytes = await readFile(new URL(`generated/kowloon-market-produce/tripo-out/${source.folder}/${source.file ?? "model.glb"}`, root));
  const validation = await validateBytes(bytes);
  assert.equal(validation.issues.numErrors, 0, source.id);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.toString("utf8", 20, 20 + jsonLength));
  const bin = bytes.subarray(28 + jsonLength);
  assert.equal(gltf.nodes.length, 1);
  const [node] = gltf.nodes;
  assert.ok(!node.matrix && !node.rotation && !node.translation && !node.scale);
  const primitives = gltf.meshes[node.mesh].primitives;
  assert.equal(primitives.length, 1);
  const [mesh] = primitives;
  assert.equal(mesh.mode ?? 4, 4);
  const data = view => {
    assert.equal(view.buffer, 0);
    return bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
  };
  function unpack(accessorIndex, components, types) {
    const a = gltf.accessors[accessorIndex];
    const view = gltf.bufferViews[a.bufferView];
    assert.ok(!a.sparse && !view.byteStride && types.includes(a.componentType));
    const get = a.componentType === 5126 ? "readFloatLE" : a.componentType === 5125 ? "readUInt32LE" : "readUInt16LE";
    const bytesPer = a.componentType === 5123 ? 2 : 4;
    const buffer = data(view);
    return Array.from({ length: a.count }, (_, index) => Array.from({ length: components }, (_, axis) =>
      buffer[get]((a.byteOffset ?? 0) + bytesPer * (index * components + axis))));
  }
  const indices = unpack(mesh.indices, 1, [5123, 5125]).flat();
  const orient = source.reverse ? -1 : 1;
  const toZUp = ([x, y, z]) => [orient * -z, orient * -x, y];
  const positions = unpack(mesh.attributes.POSITION, 3, [5126]).map(toZUp);
  const normals = unpack(mesh.attributes.NORMAL, 3, [5126]).map(toZUp);
  const uvs = unpack(mesh.attributes.TEXCOORD_0, 2, [5126]);
  assert.ok(uvs.every(uv => uv.every(value => value >= 0 && value <= 1)));
  const bounds = [0, 1, 2].map(axis => positions.reduce(([lo, hi], p) =>
    [Math.min(lo, p[axis]), Math.max(hi, p[axis])], [Infinity, -Infinity]));
  const [spanX, spanY, spanZ] = bounds.map(([lo, hi]) => hi - lo);
  assert.ok(Math.min(spanX, spanY, spanZ) > 0);
  const left = index % columns * tile;
  const top = Math.floor(index / columns) * tile;
  const vertices = positions.map(([x, y, z], i) => [
    (x - bounds[0][0]) / spanX, (y - bounds[1][0]) / spanY, (z - bounds[2][0]) / spanX,
    ...normals[i],
    (left + border + 0.5 + uvs[i][0] * (interior - 1)) / width,
    1 - (top + border + 0.5 + uvs[i][1] * (interior - 1)) / height,
  ].map(round));
  const material = gltf.materials[mesh.material];
  const pbr = material.pbrMetallicRoughness;
  assert.ok([pbr.metallicFactor, pbr.roughnessFactor, material.normalTexture.scale ?? 1].every(factor => factor === 1));
  assert.ok((pbr.baseColorFactor ?? [1, 1, 1, 1]).every(factor => factor === 1));
  const textures = [pbr.baseColorTexture, material.normalTexture, pbr.metallicRoughnessTexture];
  for (const [channel, texture] of textures.entries()) {
    const image = gltf.images[gltf.textures[texture.index].source];
    paste(atlas[channel], data(gltf.bufferViews[image.bufferView]), left, top);
  }
  const triangles = indices.length / 3;
  assert.ok(triangles > 0 && triangles <= 1600, `${source.id}: ${triangles} triangles`);
  models.push({ id: source.id, size: source.size, depth: round(spanY / spanX), height: round(spanZ / spanX), vertices, indices });
  evidence.push({ ...source, triangles, sha256: sha256(bytes), warnings: validation.issues.numWarnings });
}

const images = {};
for (const [index, suffix] of ["", "-normal", "-properties"].entries()) {
  const name = `market-trays${suffix}.png`;
  const bytes = PNG.sync.write(atlas[index], { colorType: 2 });
  await writeFile(new URL(`src/materials/library/${name}`, root), bytes);
  images[name] = { sha256: sha256(bytes), bytes: bytes.length };
}
await writeFile(new URL("src/dressing/kowloon/shop/assets/market-trays.json", root), JSON.stringify(models) + "\n");
await writeFile(new URL("tray-bake.json", project), JSON.stringify({ atlas: { width, height, images }, models: evidence }, null, 2) + "\n");
