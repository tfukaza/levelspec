import assert from "node:assert/strict";
import test from "node:test";
import { roomServices, servicePlacement } from "./room-services.mjs";

function room() {
  const box = (id, rect, base, top, role) => ({id, rect, base, top, [role]: true});
  return [
    box("floor", [-7,-9,7,9], 3.25, 3.5, "ground"),
    box("north", [-7,8.5,7,9], 3.5, 6.8, "wall"),
    box("south", [-7,-9,7,-8.5], 3.5, 6.8, "wall"),
    box("west", [-7,-9,-6.5,9], 3.5, 6.8, "wall"),
    box("east", [6.5,-9,7,9], 3.5, 6.8, "wall"),
    box("soffit-south", [-7,-9,7,-4], 6.8, 7, "ceiling"),
    box("soffit-north", [-7,4,7,9], 6.8, 7, "ceiling"),
    box("soffit-west", [-7,-4,-3,4], 6.8, 7, "ceiling"),
    box("soffit-east", [3,-4,7,4], 6.8, 7, "ceiling"),
  ];
}

test("services turn from wall to soffit across panel seams, clearing the open skylight", () => {
  const boxes = room(), runs = roomServices(boxes, "floor");
  assert.equal(runs.length, 4);
  for (const run of runs) {
    const [a,b] = run.points.slice(-4, -2);
    assert.equal(a[2], b[2]);
    assert.ok(Math.abs(a[run.axis] - b[run.axis]) > 12);
    assert.ok(run.axis === 1 ? Math.abs(a[0]) > 3 : Math.abs(a[1]) > 4);
    assert.ok(run.points[0][2] < a[2] - 1);
    assert.ok(run.points.at(-1)[2] < b[2] - 1);
    const host = run.axis === 1 ? 8.5 : 6.5;
    assert.ok(run.points[0][run.axis] < -host);
    assert.ok(run.points.at(-1)[run.axis] > host);
    const xml = servicePlacement(run);
    const mounts = xml.match(/supports="([^"]+)"/)[1].split("; ").map(p => p.split(" ").map(Number));
    assert.equal(mounts.length, run.points.length - 1);
    for (const [i, offset] of mounts.entries()) {
      const delta = run.points[i+1].map((v,j) => v - run.points[i][j]);
      assert.ok(Math.abs(delta.reduce((sum, v, j) => sum + v * offset[j], 0)) < 1e-6);
      if (i === 0 || i === mounts.length - 1) assert.deepEqual(offset, [0,0,0]);
      else if (offset[2]) assert.ok(Math.abs(run.points[i][2] + offset[2] - 6.8) < 1e-6);
      else assert.ok(Math.abs(Math.abs(run.points[i][run.axis] + offset[run.axis]) - host) < 1e-6);
    }
  }
  assert.deepEqual(roomServices(boxes.slice().reverse(), "floor"), runs);
});

test("a missing overhead panel or end wall breaks its route", () => {
  for (const missing of ["soffit-west", "north"]) {
    const runs = roomServices(room().filter(b => b.id !== missing), "floor");
    assert.ok(!runs.some(run => run.id === "planter-service-west"));
    assert.ok(runs.some(run => run.id === "planter-service-south"));
  }
});
