import assert from "node:assert/strict";
import test from "node:test";
import { passageLamp } from "./lamp.mjs";
import { passageLampLight } from "../../../../superspec/crates/engine/src/worldspec/themes/kowloon/materials/arcade-lighting.mjs";

const wall = {
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
const beam = {
  axis: 1,
  lane: -3.9472,
  width: 0.37,
  depth: 0.516,
  position: [-3.9472, -3.5, 3.25],
  end: [-3.9472, 4.85, 3.25],
  wall: "brush-78",
};
test("the light rotates and scales with the fixture in the packed Y-up scene", () => {
  const { position, target } = passageLampLight({
    position: [7, 3, 2],
    heading: 90,
    scale: 2,
  });
  assert.deepEqual(position, [7.23, 1.9, -3]);
  assert.deepEqual(target, [7, 1, -3]);
});
test("backplate sits on the signed wall above standing height while its haunch clears the housing", () => {
  assert.deepEqual(passageLamp([wall, floor], [beam]), [
    '    <passage-sign-lamp id="arcade-passage-sign-lamp" position="-3.25 -3.401 2.2" heading="180"/>',
  ]);
});
test("missing floor or wall, poor headroom, and equipment occupying the seat prevent placement", () => {
  assert.deepEqual(passageLamp([floor]), []);
  assert.deepEqual(passageLamp([wall]), []);
  assert.deepEqual(passageLamp([{ ...wall, top: 2.3 }, floor]), []);
  assert.deepEqual(
    passageLamp([
      wall,
      floor,
      { id: "conduit", rect: [-3.3, -3.4, -3.2, -3.29], base: 2.15, top: 2.22 },
    ]),
    [],
  );
  assert.deepEqual(
    passageLamp([wall, floor], [{ ...beam, lane: -3.25, depth: 0.85 }]),
    [],
  );
});
