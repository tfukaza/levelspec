import { readFileSync } from "node:fs";
import { serviceVolumes } from "../room-structure.mjs";

const layout = JSON.parse(
  readFileSync(new URL("./passage-layout.json", import.meta.url)),
);
const round = (n) => Number(n.toFixed(4));

/** Survey the complete fixture over the sign's wall-local centreline. */
export function passageLamp(boxes, downstands = [], runs = []) {
  const wall = boxes.find((b) => b.id === layout.host && b.wall);
  if (!wall) return [];
  const [x0, y0, x1, face] = wall.rect;
  const x = (x0 + x1) * 0.5,
    z = wall.base + layout.lampCenterHeight;
  const lo = [x - 0.23, face - 0.001, z - 0.115],
    hi = [x + 0.23, face + 0.19, z + 0.115];
  const floor = boxes.some(
    (b) =>
      b.ground &&
      Math.abs(wall.base - b.top) < 0.005 &&
      b.rect[0] <= lo[0] &&
      b.rect[2] >= hi[0] &&
      b.rect[1] <= face &&
      b.rect[3] >= hi[1],
  );
  if (
    !floor ||
    x1 - x0 < layout.stencilWidth + 0.2 ||
    face - y0 < 0.1 ||
    hi[2] + 0.1 > wall.top ||
    lo[2] - wall.base < 2.05 ||
    lo[2] -
      (wall.base +
        layout.stencilCenterHeight +
        (layout.stencilWidth * 384) / 1024 / 2) <
      0.12
  )
    return [];
  const intersects = (a, b) =>
    a.every((v, i) => v < hi[i] + 0.04 && b[i] > lo[i] - 0.04);
  if (
    boxes.some(
      (b) =>
        b !== wall &&
        intersects(
          [...b.rect.slice(0, 2), b.base],
          [...b.rect.slice(2), b.top],
        ),
    ) ||
    serviceVolumes(runs).some(({ lo, hi }) => intersects(lo, hi))
  )
    return [];
  for (const beam of downstands) {
    const { axis, lane, width, depth, position, end } = beam;
    const a = [lane - width / 2, lane - width / 2, position[2] - depth],
      b = [lane + width / 2, lane + width / 2, position[2]];
    a[axis] = position[axis];
    b[axis] = end[axis];
    if (intersects(a, b)) return [];
    // A wall bearing projects up to 840 mm from its host and hangs at
    // most 300 mm below the beam. Reserve its envelope at the actual joint.
    if (beam.wall === wall.id) {
      a[2] -= 0.3;
      const lowEnd = wall.rect[axis + 2] <= position[axis] + 0.11;
      if (lowEnd) b[axis] = a[axis] + 0.95;
      else a[axis] = b[axis] - 0.95;
      if (intersects(a, b)) return [];
    }
  }
  return [
    `    <passage-sign-lamp id="arcade-passage-sign-lamp" position="${round(x)} ${round(face - 0.001)} ${round(z)}" heading="180"/>`,
  ];
}
