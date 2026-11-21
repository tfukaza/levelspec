import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { NodeIO } from "@gltf-transform/core";
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from "three";

test("panel slots and lift sockets expose only the shallow trough", async (t) => {
  const folder = await mkdtemp(join(tmpdir(), "stoa-drain-"));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const path = join(folder, "drain.glb");
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("../../../../superspec/tools/kowloon-export/wayfinding/drain-build.mjs", import.meta.url)), path],
    {
      input: JSON.stringify({
        origin: [0, 0, 0],
        width: 0.224,
        count: 3,
        module: 0.8,
        floor: "test-floor",
      }),
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const doc = await new NodeIO().read(path);
  const pieces = doc
    .getRoot()
    .listMeshes()[0]
    .listPrimitives()
    .map((p) => {
      const g = new BufferGeometry();
      g.setAttribute(
        "position",
        new BufferAttribute(p.getAttribute("POSITION").getArray(), 3),
      );
      const mesh = new Mesh(g, new MeshBasicMaterial());
      mesh.name = p.getMaterial().getName();
      return mesh;
    });
  const down = new Vector3(0, 0, -1);
  function hit(x, y) {
    return new Raycaster(new Vector3(x, y, 0.1), down).intersectObjects(
      pieces,
      false,
    )[0];
  }
  for (const x of [0.4, 1.2, 2]) {
    for (const y of [-0.0645, -0.0215, 0.0215, 0.0645])
      assert.match(hit(x, y).object.name, /trough/);
    for (const s of [-1, 1])
      assert.match(hit(x + s * 0.361, s * 0.065).object.name, /trough/);
    const deck = hit(x, 0),
      bed = hit(x, 0.0215);
    assert.match(deck.object.name, /cast iron/);
    assert(Math.abs(deck.point.z - 0.01) < 0.0001);
    assert(bed.point.z > 0.003 && bed.point.z < deck.point.z - 0.003);
  }
});
