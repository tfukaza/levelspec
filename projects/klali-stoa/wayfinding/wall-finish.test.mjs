import assert from "node:assert/strict";
import test from "node:test";
import { Document, TextureInfo } from "@gltf-transform/core";
import { BoxGeometry } from "three";
import { finishPassageWall } from "../../../../superspec/crates/engine/src/worldspec/themes/kowloon/authoring/wayfinding/wall-finish.mjs";

test("only the passage brush receives a full-height paint chart while the six original surfaces stay intact", async () => {
  const doc = new Document();
  const scene = doc.createScene(),
    buffer = doc.createBuffer(),
    yellow = doc.createMaterial("m-yellow");
  function brush(id) {
    const g = new BoxGeometry(6.5, 0.3, 3.25).translate(-3.25, -3.55, 1.625);
    const part = doc.createPrimitive().setMaterial(yellow);
    for (const [slot, key] of [
      ["POSITION", "position"],
      ["NORMAL", "normal"],
      ["TEXCOORD_0", "uv"],
    ]) {
      part.setAttribute(
        slot,
        doc
          .createAccessor()
          .setBuffer(buffer)
          .setType(key === "uv" ? "VEC2" : "VEC3")
          .setArray(g.getAttribute(key).array),
      );
    }
    part.setAttribute(
      "TANGENT",
      doc
        .createAccessor()
        .setBuffer(buffer)
        .setType("VEC4")
        .setArray(
          new Float32Array(
            Array.from({ length: g.getAttribute("position").count }, () => [
              1, 0, 0, 1,
            ]).flat(),
          ),
        ),
    );
    part.setIndices(
      doc
        .createAccessor()
        .setBuffer(buffer)
        .setType("SCALAR")
        .setArray(g.index.array),
    );
    scene.addChild(
      doc
        .createNode(id)
        .setExtras({ objectId: id })
        .setMesh(doc.createMesh().addPrimitive(part)),
    );
    return part;
  }
  const wall = brush("brush-78"),
    adjacent = brush("brush-79");
  const adjacentUv = adjacent.getAttribute("TEXCOORD_0"),
    indices = wall.getIndices();
  const positions = wall.getAttribute("POSITION"),
    normals = wall.getAttribute("NORMAL");
  const maps = await finishPassageWall(doc, "brush-78", TextureInfo);
  assert.equal(maps.length, 3);
  assert.deepEqual(wall.getMaterial().getBaseColorFactor(), [1, 1, 1, 1]);
  assert.equal(wall.getMaterial().getExtras().worldSpecSmoothBounce, true);
  assert.equal(wall.getMaterial().getNormalTexture(), maps[1]);
  assert.equal(wall.getMaterial().getMetallicRoughnessTexture(), maps[2]);
  assert.equal(
    wall.getMaterial().getBaseColorTextureInfo().getWrapS(),
    TextureInfo.WrapMode.CLAMP_TO_EDGE,
  );
  assert.equal(wall.getAttribute("TANGENT"), null);
  assert(adjacent.getAttribute("TANGENT"));
  assert.equal(wall.getIndices(), indices);
  assert.equal(wall.getAttribute("POSITION"), positions);
  assert.equal(wall.getAttribute("NORMAL"), normals);
  assert.equal(adjacent.getMaterial(), yellow);
  assert.equal(adjacent.getAttribute("TEXCOORD_0"), adjacentUv);
  const uv = wall.getAttribute("TEXCOORD_0");
  for (let i = 0; i < positions.getCount(); i++) {
    const [x, , z] = positions.getElement(i, []),
      [u, v] = uv.getElement(i, []);
    const [nx, ny, nz] = normals.getElement(i, []);
    assert(u >= 0 && u <= 1 && v >= 0 && v <= 1);
    if (Math.abs(ny) > 0.99) {
      assert.equal(u, Math.abs(x) / 6.5);
      assert.equal(v, 1 - z / 3.25);
    } else if (Math.abs(nx) > 0.99) {
      assert(Math.min(u, 1 - u) < 0.047);
    } else {
      assert(Math.abs(nz) > 0.99 && Math.min(v, 1 - v) < 0.093);
    }
  }
});
