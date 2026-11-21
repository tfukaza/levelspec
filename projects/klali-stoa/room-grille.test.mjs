import assert from "node:assert/strict";
import test from "node:test";
import { passageGrille } from "./room-grille.mjs";

const wall = {
  id: "brush-91",
  rect: [-7, -8.5, -6.5, -1.5],
  base: 0,
  top: 3.25,
  wall: true,
};
const returnWall = {
  id: "brush-78",
  rect: [-6.5, -3.7, 0, -3.4],
  base: 0,
  top: 3.25,
  wall: true,
};
const floor = {
  id: "brush-0",
  rect: [-7, -9, 7, 9],
  base: -4,
  top: 0,
  ground: true,
};
const scene = [wall, returnWall, floor];
test("centres one service grille in the bounded return wall bay above standing height", () => {
  assert.deepEqual(passageGrille(scene), [
    '    <wall-extraction-grille id="arcade-wall-grille" position="-6.501 -2.45 2.28" heading="90"/>',
  ]);
});
test("missing masonry, an interrupted junction, too little backing, or missing floor rejects the fitting", () => {
  for (const boxes of [
    [floor, returnWall],
    [wall, returnWall],
    [{ ...wall, top: 2.38 }, returnWall, floor],
    [wall, { ...returnWall, rect: [-6, -3.7, 0, -3.4] }, floor],
    [{ ...wall, rect: [-7, -8.5, -6.5, -2.75] }, returnWall, floor],
  ])
    assert.deepEqual(passageGrille(boxes), []);
});
test("checks both the actual fixture footprint and a clear approach with service and beam clearance", () => {
  const box = {
    id: "adjacent",
    rect: [-6.47, -2.5, -6.43, -2.3],
    base: 2.2,
    top: 2.33,
  };
  assert.deepEqual(passageGrille([...scene, box]), []);
  assert.deepEqual(
    passageGrille([
      ...scene,
      { ...box, rect: [-5.8, -2.6, -5.5, -2.3], base: 0.3, top: 1.6 },
    ]),
    [],
  );
  const pipe = {
    kind: "pipe-run",
    axis: 1,
    wallOffset: 0.08,
    ceilingOffset: 0.09,
    points: [
      [-6.4, -3.6, 2.4],
      [-6.4, -1.25, 2.4],
    ],
  };
  assert.deepEqual(passageGrille(scene, [pipe]), []);
  assert.deepEqual(
    passageGrille(
      scene,
      [],
      [
        {
          axis: 0,
          lane: -2.45,
          width: 0.4,
          position: [-6.5, -2.45, 3],
          end: [-4, -2.45, 3],
          depth: 0.6,
        },
      ],
    ),
    [],
  );
});
