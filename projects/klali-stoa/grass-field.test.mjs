import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { Document } from "@gltf-transform/core";
import { bakeGrassField, paintedTuftLayers } from "../../../superspec/crates/engine/src/worldspec/themes/kowloon/authoring/grass-field.mjs";

// Locate a point in the actual exported turf triangles, independently of the
// generator's regular-grid lookup. Bins keep the full-size planter cheap.
function sampler(ground) {
  const p = ground.getAttribute("POSITION").getArray(),
    n = ground.getAttribute("NORMAL").getArray(),
    c = ground.getAttribute("COLOR_0").getArray();
  const ix = ground.getIndices().getArray(),
    bins = new Map(),
    bin = (t) => Math.floor(t / 0.12);
  for (let t = 0; t < ix.length; t += 3) {
    const ids = Array.from(ix.subarray(t, t + 3)),
      xs = ids.map((i) => p[3 * i]),
      ys = ids.map((i) => p[3 * i + 1]);
    for (let x = bin(Math.min(...xs)); x <= bin(Math.max(...xs)); x++)
      for (let y = bin(Math.min(...ys)); y <= bin(Math.max(...ys)); y++) {
        const key = x + "," + y;
        if (!bins.has(key)) bins.set(key, []);
        bins.get(key).push(ids);
      }
  }
  return (x, y) => {
    for (const ids of bins.get(bin(x) + "," + bin(y)) ?? []) {
      const [a, b, d] = ids.map((i) => 3 * i);
      const bx = p[b] - p[a],
        by = p[b + 1] - p[a + 1],
        dx = p[d] - p[a],
        dy = p[d + 1] - p[a + 1],
        den = bx * dy - by * dx;
      const u = ((x - p[a]) * dy - (y - p[a + 1]) * dx) / den,
        v = (bx * (y - p[a + 1]) - by * (x - p[a])) / den;
      if (Math.min(u, v, 1 - u - v) < -1e-5) continue;
      const blend = (values, channel) =>
        (1 - u - v) * values[a + channel] + u * values[b + channel] + v * values[d + channel];
      const normal = [0, 1, 2].map((k) => blend(n, k)),
        length = Math.hypot(...normal);
      return { z: blend(p, 2), colour: [0, 1, 2].map((k) => blend(c, k)), normal: normal.map((f) => f / length) };
    }
    assert.fail("A grass stem has no receiving face at " + [x, y]);
  };
}

test("every visible root band takes height, pigment, normal and PBR response from its turf", async () => {
  const doc = await bakeGrassField(3.2, 5.7, "root check", { Document, sharp });
  const [ground, ...tufts] = doc.getRoot().listMeshes()[0].listPrimitives(),
    turf = sampler(ground);
  const allTriangles = [ground, ...tufts].reduce((n, p) => n + p.getIndices().getCount() / 3, 0);
  assert.ok(allTriangles <= 250000, "must fit the stock static ItemSpec importer");
  const gm = ground.getMaterial(),
    errors = { height: 0, colour: 0, normal: 0 };
  for (const part of tufts) {
    const m = part.getMaterial();
    assert.deepEqual(m.getBaseColorFactor(), gm.getBaseColorFactor());
    assert.equal(m.getMetallicFactor(), gm.getMetallicFactor());
    assert.equal(m.getRoughnessFactor(), gm.getRoughnessFactor());
    const { data: image, info } = await sharp(m.getBaseColorTexture().getImage())
      .raw()
      .toBuffer({ resolveWithObject: true });
    const side = info.width / 4;
    for (let y = 0; y < info.height; y++)
      if (((y % side) + 0.5) / side <= 0.32)
        for (let x = 0; x < info.width; x++) {
          const k = (y * info.width + x) * 4;
          assert.equal(
            image[k] + image[k + 1] + image[k + 2],
            765,
            "root albedo multiplier must be exactly white",
          );
        }
    const pos = part.getAttribute("POSITION"),
      col = part.getAttribute("COLOR_0"),
      norm = part.getAttribute("NORMAL");
    for (let i = 0; i < pos.getCount(); i += 6) {
      const first = pos.getElement(i, []),
        last = pos.getElement(i + 3, []);
      const c1 = col.getElement(i, []),
        c2 = col.getElement(i + 3, []);
      const n1 = norm.getElement(i, []),
        n2 = norm.getElement(i + 3, []);
      for (const j of [i, i + 3]) {
        assert.deepEqual(col.getElement(j, []), col.getElement(j + 1, []));
        assert.deepEqual(norm.getElement(j, []), norm.getElement(j + 1, []));
      }
      for (const t of [0, 0.5, 1]) {
        const mix = (a, b) => a.map((x, k) => x + t * (b[k] - x));
        const [x, y, z] = mix(first, last),
          s = turf(x, y),
          c = mix(c1, c2),
          n = mix(n1, n2);
        const length = Math.hypot(...n);
        errors.height = Math.max(errors.height, Math.abs(z - s.z));
        for (let k = 0; k < 3; k++) {
          errors.colour = Math.max(errors.colour, Math.abs(c[k] - s.colour[k]));
          errors.normal = Math.max(errors.normal, Math.abs(n[k] / length - s.normal[k]));
        }
      }
    }
  }
  console.log("Largest planted field root agreement", errors, "triangles", allTriangles);
  assert.ok(errors.height < 0.000002, "roots on the exact drawn terrain");
  assert.ok(errors.colour < 0.000002, "same linear albedo on the whole root chord");
  assert.ok(errors.normal < 0.001, "same receiving normal along the root chord");
});

test("camera-facing fuzz, dashes and tips share the exported receiving paint", async () => {
  const width = 2.7, depth = 0.7;
  const doc = await bakeGrassField(width, depth, "narrow bed", { Document, sharp });
  const ground = doc.getRoot().listMeshes()[0].listPrimitives()[0];
  const sample = sampler(ground);
  const layers = paintedTuftLayers(width, depth, {
    positions: ground.getAttribute("POSITION").getArray(),
    normals: ground.getAttribute("NORMAL").getArray(),
    colors: ground.getAttribute("COLOR_0").getArray(),
  });
  for (const [kind, records] of layers.entries()) {
    assert.ok(records.length > 0);
    assert.equal(records.length % 13, 0);
    for (let i = 0; i < records.length; i += 13) {
      const [x, up, z, nx, ny, nz, r, g, b, height, span, cell] = records.subarray(i, i + 13);
      const turf = sample(x, -z);
      assert.equal(cell < 16 ? 0 : cell < 20 ? 2 : 1, kind);
      assert.ok(height > 0 && span > 0);
      const actual = [up, nx, -nz, ny, r, g, b];
      const expected = [turf.z, ...turf.normal, ...turf.colour];
      actual.forEach((v,k) => assert.ok(Math.abs(v-expected[k]) < 0.00001));
    }
  }
});
