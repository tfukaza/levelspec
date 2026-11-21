import { serviceVolumes } from "./room-structure.mjs";

const halfWidth = 0.348,
  halfHeight = 0.195;
const round = (value) => Number(value.toFixed(4));

/** Place the shallow grille on the inside of the return beside the passage mouth. */
export function passageGrille(boxes, runs = [], downstands = []) {
  const host = boxes.find((b) => b.id === "brush-91" && b.wall);
  const passage = boxes.find((b) => b.id === "brush-78" && b.wall);
  if (!host || !passage || Math.abs(host.base - passage.base) > 0.002)
    return [];
  const [outside, lower, face, upper] = host.rect;
  const bayStart = passage.rect[3];
  if (
    Math.abs(passage.rect[0] - face) > 0.003 ||
    face - outside < 0.16 ||
    lower > passage.rect[1] ||
    upper - bayStart < 2 * halfWidth + 0.6
  )
    return [];
  const y = (bayStart + upper) / 2,
    z = host.base + 2.28;
  if (z - halfHeight < host.base + 2.05 || z + halfHeight + 0.16 > host.top)
    return [];
  const floor = boxes.some(
    (b) =>
      b.ground &&
      Math.abs(b.top - host.base) < 0.003 &&
      b.rect[0] <= face &&
      b.rect[2] >= face + 1.15 &&
      b.rect[1] <= y - 0.45 &&
      b.rect[3] >= y + 0.45,
  );
  if (!floor) return [];
  // Reserve the casing and a clear standing/inspection position. The mounting
  // surface itself remains unbroken, right through the recessed blade chamber.
  const lo = [face - 0.001, y - halfWidth - 0.08, host.base + 0.04],
    hi = [face + 1.15, y + halfWidth + 0.08, z + halfHeight + 0.08];
  const blocked = (a, b) => a.every((v, i) => v < hi[i] && b[i] > lo[i]);
  if (
    boxes.some(
      (b) =>
        b !== host &&
        blocked([...b.rect.slice(0, 2), b.base], [...b.rect.slice(2), b.top]),
    ) ||
    serviceVolumes(runs).some((b) => blocked(b.lo, b.hi))
  )
    return [];
  for (const beam of downstands) {
    const a = [
      beam.lane - beam.width / 2,
      beam.lane - beam.width / 2,
      beam.position[2] - beam.depth - 0.3,
    ];
    const b = [
      beam.lane + beam.width / 2,
      beam.lane + beam.width / 2,
      beam.position[2],
    ];
    a[beam.axis] = beam.position[beam.axis];
    b[beam.axis] = beam.end[beam.axis];
    if (blocked(a, b)) return [];
  }
  return [
    `    <wall-extraction-grille id="arcade-wall-grille" position="${round(face - 0.001)} ${round(y)} ${round(z)}" heading="90"/>`,
  ];
}
