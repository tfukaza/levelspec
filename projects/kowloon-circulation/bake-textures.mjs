import {fileURLToPath} from "node:url";
import sharp from "sharp";

const size = 512;
const tau = 2 * Math.PI;
const output = new URL("./textures/", import.meta.url);
const albedo = Buffer.alloc(size * size * 3);
const normal = Buffer.alloc(size * size * 3);
const water = Buffer.alloc(size * size * 3);
const concrete = Buffer.alloc(size * size * 3);

function grain(x, y) {
  const bits = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  return ((Math.imul(bits ^ (bits >>> 13), 1274126177) >>> 16) & 255) / 255;
}

function groove(x, y) {
  const row = Math.floor(y * 2);
  const u = x + (row % 2) * 0.25;
  const dx = u - (Math.floor(u * 2) + 0.5) / 2;
  const dy = y - (row + 0.5) / 2;
  return Math.exp(-(((Math.hypot(dx, dy) - 0.125) / 0.014) ** 2));
}

function write(buffer, index, color) {
  for (let channel = 0; channel < 3; channel++) {
    buffer[index + channel] = Math.max(0, Math.min(255, Math.round(color[channel])));
  }
}

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const u = x / size;
    const v = y / size;
    const index = (y * size + x) * 3;
    const fleck = grain(x, y) - 0.5;
    const stain = 6 * Math.sin(tau * (u + v)) + 5 * Math.cos(tau * (2 * u - v));
    const shade = 100 + 25 * fleck + stain - 52 * groove(u, v);
    write(albedo, index, [shade * 0.98, shade, shade * 0.94]);
    const dx = 0.004 * size * (groove(u + 1 / size, v) - groove(u - 1 / size, v)) / 2;
    const dy = 0.004 * size * (groove(u, v + 1 / size) - groove(u, v - 1 / size)) / 2;
    const magnitude = Math.hypot(dx, dy, 1);
    write(normal, index, [128 + dx * 127 / magnitude, 128 - dy * 127 / magnitude, 128 + 127 / magnitude]);
    const coarse = Math.sin(tau * (3 * u + v)) * Math.sin(tau * (2 * u - 3 * v));
    const runoff = Math.pow(Math.max(0, Math.sin(tau * (11 * u + 0.18 * Math.sin(tau * v))) * 0.56 +
      Math.cos(tau * (5 * u - v)) * 0.44), 2);
    const pores = fleck * 22 + 6 * coarse;
    const block = Math.sin(tau * (2 * u + 2 * v)) * 4;
    const seam = Math.min(v % 0.5, 0.5 - v % 0.5) < 0.004 ? 12 : 0;
    const wall = 123 + pores + block - runoff * (25 + 18 * Math.sin(tau * v) ** 2) - seam;
    write(concrete, index, [wall * 0.96, wall, wall * 0.92]);
    const ripple = Math.sin(tau * (10 * v + 0.43 * Math.sin(tau * (u - v)) + 0.20 * Math.sin(tau * (3 * u + v))));
    const swell = Math.sin(tau * (5 * v + u)) * 0.5 + 0.5;
    const reflection = Math.pow(Math.max(0, ripple), 6) * swell * 23;
    write(water, index, [26 + reflection + fleck * 3, 40 + reflection + fleck * 3, 37 + reflection * 1.35 + fleck * 3]);
  }
}

await Promise.all([
  ["ramp-rings", albedo],
  ["ramp-rings-normal", normal],
  ["stormwater", water],
  ["streaked-concrete", concrete],
].map(([name, pixels]) => sharp(pixels, {raw: {width: size, height: size, channels: 3}})
  .png().toFile(fileURLToPath(new URL(name + ".png", output)))));
