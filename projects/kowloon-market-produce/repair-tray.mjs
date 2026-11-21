import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import { validateBytes } from "gltf-validator";

const repairs = {
  "bitter-melon": { folder: "bitter-melon-repair-c65e9583", floor: -0.13, mask: -0.115, moved: 5, color: [105, 73, 50], properties: [255, 205, 0] },
  "pork-ribs": { folder: "pork-ribs-fe2654f0", floor: -0.076, mask: -0.071, moved: 4, color: [122, 116, 104], properties: [255, 179, 165] },
};
const repair = repairs[process.argv[2] ?? "bitter-melon"];
assert.ok(repair, "Unknown tray repair");
const folder = new URL(`../../generated/kowloon-market-produce/tripo-out/${repair.folder}/`, import.meta.url);
const bytes = await readFile(new URL("model.glb", folder));
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.toString("utf8", 20, 20 + jsonLength));
let bin = bytes.subarray(28 + jsonLength);
const [primitive] = gltf.meshes[0].primitives;
const positions = gltf.accessors[primitive.attributes.POSITION];
const indices = gltf.accessors[primitive.indices];
assert.equal(positions.componentType, 5126);
assert.equal(indices.componentType, 5125);
const offset = accessor => (gltf.bufferViews[accessor.bufferView].byteOffset ?? 0) + (accessor.byteOffset ?? 0);
const vertices = Array.from({ length: positions.count }, (_, index) => [0, 1, 2].map(axis =>
  bin.readFloatLE(offset(positions) + index * 12 + axis * 4)));
const keys = vertices.map(point => point.join(","));
const adjacency = new Map(keys.map(key => [key, new Set()]));
for (let index = 0; index < indices.count; index += 3) {
  const corners = [0, 1, 2].map(corner => keys[bin.readUInt32LE(offset(indices) + (index + corner) * 4)]);
  for (const key of corners) for (const neighbor of corners) adjacency.get(key).add(neighbor);
}
const adjustments = new Map();
const crate = new Set();
let crateCount = 0;
let moved = 0;
while (adjacency.size) {
  const pending = [adjacency.keys().next().value];
  const component = [];
  while (pending.length) {
    const key = pending.pop();
    if (!adjacency.has(key)) continue;
    pending.push(...adjacency.get(key));
    adjacency.delete(key);
    component.push(key);
  }
  const points = component.map(key => key.split(",").map(Number));
  const left = Math.min(...points.map(point => point[2]));
  const right = Math.max(...points.map(point => point[2]));
  if (right - left > 0.9) {
    crateCount++;
    for (const key of component) crate.add(key);
    continue;
  }
  // Measured interior floor in this source GLB's Y-up units.
  const bottom = Math.min(...points.map(point => point[1]));
  if (bottom < repair.floor) {
    for (const key of component) adjustments.set(key, repair.floor - bottom);
    moved++;
  }
}
assert.equal(crateCount, 1);
assert.equal(moved, repair.moved);
for (const [index, point] of vertices.entries()) {
  point[1] = Math.fround(point[1] + (adjustments.get(keys[index]) ?? 0));
  bin.writeFloatLE(point[1], offset(positions) + index * 12 + 4);
}
positions.min[1] = Math.min(...vertices.map(point => point[1]));
positions.max[1] = Math.max(...vertices.map(point => point[1]));

// Mask only underside triangles of the container to remove baked food silhouettes.
const uv = gltf.accessors[primitive.attributes.TEXCOORD_0];
const material = gltf.materials[primitive.material];
const pbr = material.pbrMetallicRoughness;
const maps = [pbr.baseColorTexture, material.normalTexture, pbr.metallicRoughnessTexture].map(texture => {
  const image = gltf.images[gltf.textures[texture.index].source];
  const view = gltf.bufferViews[image.bufferView];
  const source = bin.subarray(view.byteOffset, view.byteOffset + view.byteLength);
  const pixels = image.mimeType === "image/jpeg" ? jpeg.decode(source) : PNG.sync.read(source);
  return { image, pixels };
});
const { width, height } = maps[0].pixels;
assert.ok(maps.every(({ pixels }) => pixels.width === width && pixels.height === height));
const edge = (a, b, x, y) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
let repainted = 0;
for (let index = 0; index < indices.count; index += 3) {
  const corners = [0, 1, 2].map(corner => bin.readUInt32LE(offset(indices) + (index + corner) * 4));
  if (!corners.every(corner => crate.has(keys[corner]) && vertices[corner][1] < repair.mask)) continue;
  const [a, b, c] = corners.map(corner => vertices[corner]);
  const normalY = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
  if (normalY >= -1e-7) continue;
  const [u, v, w] = corners.map(corner => [width, height].map((size, axis) =>
    bin.readFloatLE(offset(uv) + corner * 8 + axis * 4) * size));
  const area = edge(u, v, ...w);
  if (Math.abs(area) < 1e-7) continue;
  const left = Math.max(0, Math.floor(Math.min(u[0], v[0], w[0])));
  const right = Math.min(width, Math.ceil(Math.max(u[0], v[0], w[0])));
  const top = Math.max(0, Math.floor(Math.min(u[1], v[1], w[1])));
  const bottom = Math.min(height, Math.ceil(Math.max(u[1], v[1], w[1])));
  for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
    if ([[u, v], [v, w], [w, u]].some(([start, end]) => edge(start, end, x + 0.5, y + 0.5) / area < 0)) continue;
    const pixel = (y * width + x) * 4;
    const grain = Math.round(3 * Math.sin(x * 0.54 + y * 0.018) + 2 * Math.sin(x * 0.18 + y * 0.013));
    maps[0].pixels.data.set(repair.color.map(channel => channel + grain), pixel);
    maps[1].pixels.data.set([128, 128, 255], pixel);
    maps[2].pixels.data.set(repair.properties, pixel);
    repainted++;
  }
}
assert.ok(repainted > 1000);
for (const { image, pixels } of maps) {
  const texture = PNG.sync.write(pixels, { colorType: 2 });
  gltf.bufferViews.push({ buffer: 0, byteOffset: bin.length, byteLength: texture.length });
  image.bufferView = gltf.bufferViews.length - 1;
  image.mimeType = "image/png";
  bin = Buffer.concat([bin, texture, Buffer.alloc((4 - texture.length % 4) % 4)]);
}
gltf.buffers[0].byteLength = bin.length;

const json = Buffer.from(JSON.stringify(gltf));
const jsonPadded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32);
json.copy(jsonPadded);
const header = Buffer.from(bytes.subarray(0, 20));
header.writeUInt32LE(28 + jsonPadded.length + bin.length, 8);
header.writeUInt32LE(jsonPadded.length, 12);
const binHeader = Buffer.from(bytes.subarray(20 + jsonLength, 28 + jsonLength));
binHeader.writeUInt32LE(bin.length, 0);
const fixed = Buffer.concat([header, jsonPadded, binHeader, bin]);
assert.equal((await validateBytes(fixed)).issues.numErrors, 0);
await writeFile(new URL("model-repaired.glb", folder), fixed);
