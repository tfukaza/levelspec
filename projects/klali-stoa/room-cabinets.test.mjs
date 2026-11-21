import assert from "node:assert/strict";
import test from "node:test";
import {roomCabinets} from "./room-cabinets.mjs";

test("cabinet mounts clear open glazing and occupied risers", () => {
  const options = {floorId:"floor", roomId:"workshop", seed:22};
  const floor = {id:"floor", rect:[0,0,8,8], base:-0.25, top:0};
  const wall = (id, x0, x1, base, top) => ({id, rect:[x0,7.75,x1,8], base, top, wall:true});
  const sill = wall("sill", 3,5, 0,0.8);
  const lintel = wall("lintel", 3,5, 2.2,3);
  const left = wall("left-pier", 1,3, 0,3);
  const right = wall("right-pier", 5,7, 0,3);
  const pipe = {kind:"pipe-run", points:[[2,7.62,0.15],[2,7.62,2.7]]};
  const boxes = [floor, sill, lintel, left, right];
  const expected = roomCabinets(boxes, [pipe], options);
  assert.equal(expected.length, 1);
  assert.match(expected[0], /id="workshop-cabinet-north"/);
  assert.match(expected[0], /position="6 7.75 0.92"/);
  assert.deepEqual(roomCabinets(boxes.toReversed(), [pipe], options), expected);

  // Without the last available mounting panel, leave the window and riser accessible.
  assert.deepEqual(roomCabinets([floor, sill, lintel, left], [pipe], options), []);
});
