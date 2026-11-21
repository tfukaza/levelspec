/** Compare two finished prototype GLBs, allowing image encoding and texture storage order to differ. */
import assert from "node:assert/strict";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import sharp from "sharp";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const [reference, candidate] = await Promise.all(process.argv.slice(2).map(path => io.read(path)));
if (!reference || !candidate) throw Error("Expected reference.glb and candidate.glb");
const roots = [reference, candidate].map(doc => doc.getRoot());
const [expected, actual] = roots.map(root => root.listMeshes());
assert.equal(actual.length, expected.length);
for (const [i, mesh] of expected.entries()) {
  const peer = actual[i];
  assert.equal(peer.getName(), mesh.getName());
  const primitives = peer.listPrimitives();
  assert.equal(primitives.length, mesh.listPrimitives().length);
  for (const [j, prim] of mesh.listPrimitives().entries()) {
    const other = primitives[j];
    assert.deepEqual(other.listSemantics().sort(), prim.listSemantics().sort());
    assert.equal(other.getMode(), prim.getMode());
    assert.equal(roots[1].listMaterials().indexOf(other.getMaterial()), roots[0].listMaterials().indexOf(prim.getMaterial()));
    for (const semantic of [...prim.listSemantics(), "indices"]) {
      const attr = p => semantic === "indices" ? p.getIndices() : p.getAttribute(semantic);
      const a = attr(prim), b = attr(other);
      if (!a) { assert.equal(b, null); continue; }
      assert.equal(b.getNormalized(), a.getNormalized());
      assert.equal(b.getType(), a.getType());
      const bytes = v => Buffer.from(v.buffer, v.byteOffset, v.byteLength);
      const left = a.getArray(), right = b.getArray();
      assert.equal(left.constructor, right.constructor);
      assert.equal(left.length, right.length);
      // A normal may carry either IEEE sign for zero after the coordinate transform.
      assert.ok(bytes(left).equals(bytes(right)) || left.every((value, k) => value === right[k]),
        mesh.getName() + "/" + j + "/" + semantic);
    }
  }
}
const nodeRecords = root => root.listNodes().map(n => [n.getName(), n.getMatrix(), n.listChildren().map(c => c.getName()), n.getMesh()?.getName()]);
assert.deepEqual(nodeRecords(roots[0]), nodeRecords(roots[1]));
const [a, b] = roots.map(root => root.listMaterials());
assert.equal(a.length, b.length);
const seen = new Map();
let samples = 0, total = 0, largestMean = 0, maximum = 0;
for (const [i, mat] of a.entries()) {
  for (const prop of ["BaseColorFactor","MetallicFactor","RoughnessFactor","EmissiveFactor","AlphaMode","AlphaCutoff","NormalScale","OcclusionStrength","DoubleSided","Extras"])
    assert.deepEqual(b[i]["get" + prop](), mat["get" + prop](), "material " + i + " " + prop);
  const strength = m => m.getExtension("KHR_materials_emissive_strength")?.getEmissiveStrength();
  assert.equal(strength(b[i]), strength(mat));
  for (const slot of ["BaseColor","Normal","MetallicRoughness","Emissive","Occlusion"]) {
    const get = m => m["get" + slot + "Texture"]();
    const x = get(mat), y = get(b[i]);
    if (!x) { assert.equal(y, null); continue; }
    if (seen.has(x)) { assert.equal(seen.get(x), y); continue; }
    seen.set(x, y);
    assert.deepEqual(y.getSize(), x.getSize());
    const [p, q] = await Promise.all([x,y].map(t => sharp(t.getImage()).ensureAlpha().raw().toBuffer()));
    let sum = 0;
    for (let j = 0; j < p.length; j++) {
      const d = Math.abs(p[j] - q[j]);
      maximum = Math.max(maximum, d);
      sum += d;
    }
    largestMean = Math.max(largestMean, sum / p.length);
    assert.ok(sum / p.length < 1, "Mean decoded error exceeds one 8-bit level on material " + i + " " + slot + ": " + sum / p.length);
    samples += p.length;
    total += sum;
  }
}
console.log({ textures: seen.size, meanRGBA8: total / samples, largestTextureMean: largestMean, maximum });
