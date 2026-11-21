import assert from "node:assert/strict";
import test from "node:test";
import { roomStructure, structurePlacement } from "./room-structure.mjs";

const box = (id, rect, base, top, kind) => ({ id, rect, base, top, [kind]: true });
function room() {
  return [
    box("floor", [0, 0, 8, 7], -0.25, 0, "ground"),
    box("bearing-a", [0, 2, 0.3, 2.4], 0, 3.5, "wall"),
    box("bearing-b", [7.7, 2, 8, 2.4], 0, 3.5, "wall"),
    box("roof-a", [0, 0, 4, 7], 3.5, 3.75, "ceiling"),
    box("roof-b", [4, 0, 8, 7], 3.5, 3.75, "ceiling"),
  ];
}
function route(kind, x = 4.1) {
  return {
    kind,
    axis: 1,
    ceilingOffset: 0.2,
    wallOffset: 0.12,
    points: [
      [x, -0.12, 0.7],
      [x, 0.12, 0.7],
      [x, 0.12, 3.3],
      [x, 5.2, 3.3],
      [x, 5.2, 0.7],
      [x, 5.4, 0.7],
    ],
  };
}
test("full-height opposing bearings and a tiled continuous roof seat one flush girder", () => {
  const boxes = room(),
    [beam] = roomStructure(boxes, "floor");
  assert.equal(beam.position[0], 0.299);
  assert.equal(beam.length, 7.402);
  assert(beam.position[1] - 0.115 > 2 && beam.position[1] + 0.115 < 2.4);
  assert.equal(beam.position[2], 3.5);
  assert.equal(beam.heading, 0);
  assert.equal(beam.soffitGap, 0);
  assert.deepEqual(beam.hangerStations, []);
  assert(!structurePlacement(beam).includes("hangerStations"));
  assert.deepEqual(roomStructure([...boxes].reverse(), "floor"), [beam]);
  const rotated = boxes.map((s) => ({ ...s, rect: [s.rect[1], s.rect[0], s.rect[3], s.rect[2]] }));
  const [other] = roomStructure(rotated, "floor");
  assert.equal(other.heading, 90);
  assert.deepEqual(other.position, [beam.position[1], beam.position[0], beam.position[2]]);
});
test("rejects a missing bearing, window lintel, roof slit and insufficient headroom", () => {
  for (const change of [
    (b) => b.splice(2, 1),
    (b) => {
      b[2].base = 2.7;
    },
    (b) => {
      b[3].rect[2] -= 0.03;
    },
    (b) => {
      for (const s of b.slice(1)) {
        if (s.wall) s.top = 2.5;
        else {
          s.base = 2.5;
          s.top = 2.75;
        }
      }
    },
  ]) {
    const b = room();
    change(b);
    assert.deepEqual(roomStructure(b, "floor"), []);
  }
});
test("suspended girder clears the service barrel, mounting space and other ceiling penetrations", () => {
  const boxes = room();
  boxes.push(box("overhead-box", [2.4, 1.8, 3.0, 2.6], 3.3, 3.5, "fixture"));
  const [b] = roomStructure(boxes, "floor", [route("pipe-run")]);
  assert.equal(b.position[2], 3.19);
  assert.equal(b.soffitGap, 0.31);
  const stations = [0, ...b.hangerStations, b.length];
  assert(stations.length > 2);
  for (let i = 1; i < stations.length; i++) assert(stations[i] - stations[i - 1] <= 3.002);
  for (const t of b.hangerStations) {
    const x = t + b.position[0];
    assert(x + 0.085 <= 2.4 || x - 0.085 >= 3);
    assert(Math.abs(x - 4.1) >= 0.07 + 0.04 + 0.085);
  }
  assert(structurePlacement(b).includes('soffitGap="0.31" hangerStations="'));
  boxes.push(box("blocked-hanger-zone", [1.8, 1.8, 6.2, 2.6], 3.24, 3.5, "fixture"));
  assert.deepEqual(roomStructure(boxes, "floor", [route("pipe-run")]), []);
});
test("reserves the smaller downturned ventilation branch and its suspension", () => {
  const b = room();
  for (const i of [1, 2]) {
    b[i].rect[1] = 3.0;
    b[i].rect[3] = 3.4;
  }
  const [beam] = roomStructure(b, "floor", [route("duct-run", 2.6)]);
  assert.equal(beam.position[2], 2.92);
  for (const t of beam.hangerStations) {
    const x = t + beam.position[0];
    assert(x + 0.085 <= 2.6 - 0.19 - 0.04 || x - 0.085 >= 2.6 + 1.6 + 0.04);
  }
});
