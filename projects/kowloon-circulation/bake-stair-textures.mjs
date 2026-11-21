import {mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const size = 1024;
const root = new URL("./textures/", import.meta.url);
const clamp = (value, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(value, maximum));
const mix = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t);
const mask = (value, low, high) => clamp((value - low) / (high - low));

function random(x, y, seed) {
  let bits = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1597334677);
  bits = Math.imul(bits ^ (bits >>> 13), 1274126177);
  return (bits >>> 0) / 4294967295;
}

function noise(u, v, frequency, seed) {
  const x = Math.floor(u * frequency);
  const y = Math.floor(v * frequency);
  const t = u * frequency - x;
  const s = v * frequency - y;
  const sample = (i, j) => random((i + frequency) % frequency, (j + frequency) % frequency, seed);
  const smooth = a => a * a * (3 - 2 * a);
  const lower = sample(x, y) * (1 - smooth(t)) + sample(x + 1, y) * smooth(t);
  const upper = sample(x, y + 1) * (1 - smooth(t)) + sample(x + 1, y + 1) * smooth(t);
  return lower * (1 - smooth(s)) + upper * smooth(s);
}

function concrete(u, v) {
  const stone = noise(u, v, 123, 7);
  const aggregate = mask(stone + (noise(u, v, 245, 17) - 0.5) * 0.24, 0.57, 0.75);
  const cloud = 0.62 * noise(u, v, 7, 8) + 0.38 * noise(u, v, 21, 4);
  const grit = noise(u, v, 337, 28) - 0.5;
  const pit = mask(noise(u, v, 96, 3), 0.72, 0.95);
  const dampField = 0.7 * noise(u, v, 8, 16) + 0.3 * noise(u, v, 35, 6);
  const damp = mask(dampField, 0.54, 0.79);
  const paste = 111 + cloud * 41 + grit * 13 - pit * 28;
  const mineral = mix([92, 100, 100], [163, 155, 139], noise(u, v, 142, 31));
  const color = mix([paste, paste, paste * 0.96], mineral, aggregate * 0.67);
  return {
    color: mix(color, [70, 77, 79], damp * 0.38),
    height: 0.52 + aggregate * 0.046 + grit * 0.033 - pit * 0.19,
    rough: 0.83 - damp * 0.49 - aggregate * 0.07,
    metal: 0,
  };
}

function mosaic(u, v) {
  const x = Math.floor(u * 12);
  const y = Math.floor(v * 12);
  const localU = u * 12 - x;
  const localV = v * 12 - y;
  const seam = Math.min(localU, localV, 1 - localU, 1 - localV);
  const field = noise(u, v, 6, 19);
  const fleck = noise(u, v, 91, 8) * 0.74 + noise(u, v, 319, 22) * 0.26;
  const variation = random(x, y, 4);
  const chip = mask(noise(u, v, 58, 2), 0.75, 0.9) * 0.09;
  const face = mask(seam - chip, 0.029, 0.085);
  const worn = mask(noise(u, v, 30, 20) * 0.72 + fleck * 0.28, 0.57, 0.83);
  const clay = mix([102, 112, 84], [174, 162, 116], 0.55 * variation + field * 0.40 + fleck * 0.05);
  const grout = mix([55, 58, 47], [103, 101, 83], field * 0.62 + fleck * 0.38);
  return {
    color: mix(grout, mix(clay, [156, 144, 116], worn * 0.33), face),
    height: 0.37 + face * 0.20 + fleck * (0.04 - face * 0.023),
    rough: 0.88 * (1 - face) + (0.28 + worn * 0.39 + variation * 0.07) * face,
    metal: 0,
  };
}

function railing(u, v, concentrated = false) {
  const field = 0.57 * noise(u, v, 11, 9) + 0.28 * noise(u, v, 37, 3) + 0.15 * noise(u, v, 86, 8);
  const flakes = 0.68 * noise(u, v, 142, 14) + 0.32 * noise(u, v, 357, 32);
  const rub = noise(u, v, 14, 5);
  const threshold = concentrated ? 0.49 : 0.65;
  const loss = field + flakes * 0.1;
  const primer = mask(loss, threshold - 0.027, threshold - 0.003);
  const exposed = mask(loss, threshold, threshold + 0.027);
  const rust = exposed * mask(0.76 * noise(u, v, 28, 21) + 0.24 * flakes, 0.28, 0.56);
  const rubMark = mask(noise(u, v, 42, 25), 0.69, 0.91) * (1 - primer);
  const paint = mix([42, 81, 74], [107, 143, 121], rub * 0.69 + flakes * 0.23);
  const film = mix(paint, [102, 80, 57], mask(loss, threshold - 0.16, threshold - 0.027) * 0.30);
  const substrate = mix(mix(film, [136, 127, 98], primer), [118, 116, 105], exposed);
  const oxide = mix([68, 41, 28], [139, 77, 43], 0.55 * flakes + 0.45 * noise(u, v, 63, 12));
  return {
    color: mix(substrate, oxide, rust),
    height: 0.67 - exposed * 0.18 + rust * (0.09 + flakes * 0.18) + flakes * 0.025,
    rough: (0.44 - rubMark * 0.14 + primer * 0.16) * (1 - rust) + 0.88 * rust,
    metal: exposed * (1 - rust) * 0.86,
  };
}

async function bake(name, sample, relief) {
  const albedo = Buffer.alloc(size * size * 3);
  const normal = Buffer.alloc(albedo.length);
  const properties = Buffer.alloc(albedo.length);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = y * size + x;
      const value = sample(x / size, y / size);
      height[index] = value.height;
      albedo.set(value.color.map(channel => Math.round(channel)), index * 3);
      properties.set([255, Math.round(255 * value.rough), Math.round(255 * value.metal)], index * 3);
    }
  }
  // Preserve the physical normal slope when the sample spacing changes.
  const gradientScale = relief * size / 512;
  const at = (x, y) => height[((y + size) % size) * size + (x + size) % size];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * gradientScale;
      const dy = (at(x, y + 1) - at(x, y - 1)) * gradientScale;
      const length = Math.hypot(dx, dy, 1);
      const encoded = [dx, dy, 1].map(channel => Math.round(127.5 + channel / length * 127.5));
      normal.set(encoded, (y * size + x) * 3);
    }
  }
  await Promise.all([["", albedo], ["-normal", normal], ["-properties", properties]].map(([suffix, pixels]) =>
    sharp(pixels, {raw: {width: size, height: size, channels: 3}})
      .png().toFile(fileURLToPath(new URL(name + suffix + ".png", root)))));
}

await mkdir(root, {recursive: true});
await Promise.all([
  bake("stair-concrete", concrete, 2.7),
  bake("stair-mosaic", mosaic, 2.1),
  bake("stair-rail", railing, 1.95),
  bake("stair-rail-hardware", (u, v) => railing(u, v, true), 2.25),
]);

