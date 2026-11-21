import assert from "node:assert/strict";
import test from "node:test";
import {
  roomDownstand,
  downstandElements,
  wallBearingHaunch,
} from "./room-downstand.mjs";

const box = (id, rect, base, top, role) => ({
  id,
  rect,
  base,
  top,
  [role]: true,
});
const bay = () => [
  box("roof", [0, 0, 10, 4], 3.6, 3.85, "ceiling"),
  box("pier", [1, 1.2, 1.5, 1.7], 0, 3.6, "wall"),
  box("return", [9, 0, 9.35, 3.6], 0, 3.6, "wall"),
];
test("downstand bears on both solids, below the continuous ceiling", () => {
  const boxes = bay(),
    [beam] = roomDownstand(boxes, "roof");
  assert.deepEqual(beam.position, [1.4, 1.45, 3.6]);
  assert.deepEqual(beam.end, [9.1, 1.45, 3.6]);
  assert.equal(beam.span, 7.5);
  assert(beam.width < 0.5 && beam.depth > 0.4 && 3.6 - beam.depth > 2.5);
  assert.deepEqual(roomDownstand(boxes.reverse(), "roof"), [beam]);
  assert(downstandElements(beam).at(-1).includes('collidable="true"'));
});
test("prevents spans intersecting fixture, lit opening, headroom, or uncovered ceiling", () => {
  for (const change of [
    (b) => b.push(box("overhead", [3.2, 1, 3.6, 2], 3.0, 3.6, "fixture")),
    (b) => {
      b[2].base = 2.1;
    },
    (b) => {
      b[0].rect[2] = 7;
    },
    (b) => {
      b[1].rect[1] = 3.4;
      b[1].rect[3] = 3.9;
      b[2].rect[3] = 3.1;
    },
    (b) => {
      b[1].base = b[2].base = 1;
    },
  ]) {
    const b = bay();
    change(b);
    assert.deepEqual(roomDownstand(b, "roof"), []);
  }
  const girder = {
    position: [4, 0.7, 3.45],
    heading: 90,
    length: 2,
    soffitGap: 0.15,
  };
  assert.deepEqual(roomDownstand(bay(), "roof", [], [girder]), []);
});

test("heel joins the true wall and rises into the same supported beam only with clear headroom", () => {
  const boxes = bay(),
    [beam] = roomDownstand(boxes, "roof");
  const rows = wallBearingHaunch(boxes, beam);
  assert.equal(rows.length, 3);
  const stations = [...rows[1].matchAll(/points="([^"]+)"/g)][0][1]
    .split("; ")
    .map((s) => s.split(" ").map(Number));
  assert(
    stations[0][0] > 9 && stations[1][0] < 9 && stations[2][0] < stations[1][0],
  );
  assert.equal(stations[0][2], stations[1][2]);
  assert(
    stations[0][2] > 2.4 && stations[2][2] > beam.position[2] - beam.depth,
  );
  assert(rows[2].includes('collidable="true"'));
  assert.deepEqual(
    wallBearingHaunch(
      boxes.filter((b) => b.id !== beam.pier),
      beam,
    ),
    [],
  );
  assert.deepEqual(
    wallBearingHaunch(
      [...boxes, box("lamp", [8.55, 1.44, 8.7, 1.62], 2.85, 3.55, "light")],
      beam,
    ),
    [],
  );
  assert.deepEqual(wallBearingHaunch(boxes, { ...beam, depth: 1.45 }), []);
});
