import assert from "node:assert/strict";
import test from "node:test";
import { maintenanceStations } from "../../../../superspec/tools/kowloon-export/maintenance/layout.mjs";

const pipe = {
  id: "riser",
  radius: 0.055,
  points: [
    [0.14, 0, 0.35],
    [0.14, 0, 2.4],
  ],
  supports: [[-0.14, 0, 0]],
};
const wall = { id: "support", low: [-0.4, -1.2, 0], high: [0, 1.2, 3] };

test("maintenance marks fit the supporting face and move away from a cabinet", () => {
  const layout = { pipes: [pipe], walls: [wall], cabinets: [] };
  const [station] = maintenanceStations(layout);
  assert.equal(station.normal[0], 1);
  assert.equal(station.ink[0], 0);
  assert.equal(station.center[0], 0.14);
  assert(station.ink[1] > 0 && station.ink[1] + 0.34 < wall.high[1]);
  layout.cabinets.push({ normal: [1, 0, 0], position: [0, 0.73, station.ink[2] - 0.4] });
  const [shifted] = maintenanceStations(layout);
  assert(shifted.ink[1] < 0);
  layout.walls = [{ ...wall, low: [-0.4, -0.25, 0], high: [0, 0.25, 3] }];
  assert.deepEqual(maintenanceStations(layout), []);
});

test("openings and unrelated surfaces cannot receive a clamp or its label", () => {
  assert.deepEqual(maintenanceStations({pipes: [pipe], walls: [], cabinets: []}), []);
  const recess = {...wall, high: [-.25, 1.2, 3]};
  assert.deepEqual(maintenanceStations({pipes: [pipe], walls: [recess], cabinets: []}), []);
});