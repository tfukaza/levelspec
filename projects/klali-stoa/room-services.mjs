// All coordinates and clearances are in AML metres. The floor selects the room.
// Rectangles are [minX, minY, maxX, maxY]; the boxes also include visible obstacles.
const epsilon = 0.001;
const round = value => Number(value.toFixed(4));
const pointText = p => p.map(round).join(" ");

function covered(from, to, intervals) {
  let end = from;
  for (const [lo, hi] of intervals.sort((a, b) => a[0] - b[0])) {
    if (lo > end + epsilon) break;
    end = Math.max(end, hi);
    if (end >= to - epsilon) return true;
  }
  return false;
}

function sweptBox(a, b, radius) {
  return {
    lo: a.map((v, i) => Math.min(v, b[i]) - radius),
    hi: a.map((v, i) => Math.max(v, b[i]) + radius),
  };
}

const intersects = (a, b) => a.lo.every((v, i) => v < b.hi[i] && b.lo[i] < a.hi[i]);
const withinStrip = (b, axis, lo, hi) => b.rect[axis] <= lo && b.rect[axis + 2] >= hi;

export function roomServices(boxes, floorId) {
  const floor = boxes.find(b => b.id === floorId);
  if (!floor) throw Error("Missing service room floor: " + floorId);
  const solids = boxes.map(b => ({
    host: b,
    lo: [b.rect[0], b.rect[1], b.base], hi: [b.rect[2], b.rect[3], b.top],
  }));
  const walls = boxes.filter(b => b.wall && Math.abs(b.base - floor.top) < epsilon);
  const runs = [];
  // Crossing runs occupy different heights below the soffit. The duct uses its
  // half-diagonal for clearance through turns, including the joint flange.
  for (const [kind, axis, side, envelope, wallOffset, ceilingOffset] of [
    ["duct-run", 1, 0, 0.22, 0.25, 0.44],
    ["pipe-run", 1, 1, 0.07, 0.14, 0.32],
    ["pipe-run", 0, 1, 0.07, 0.14, 0.12],
    ["pipe-run", 0, 0, 0.07, 0.14, 0.12],
  ]) {
    const cross = 1 - axis;
    const atEdge = end => walls.filter(w =>
      Math.abs(w.rect[axis + 2 * end] - floor.rect[axis + 2 * end]) < epsilon &&
      w.rect[axis + 2] - w.rect[axis] < 1.1);
    const near = atEdge(0), far = atEdge(1);
    const span = floor.rect[cross + 2] - floor.rect[cross];
    // Sample inwards from this edge until the complete run fits. This lets the
    // service follow an edited wall or move sideways around a light or opening.
    for (let inset = Math.min(1.5, span * 0.13); inset < span / 2; inset += 0.16) {
      const lane = floor.rect[cross + 2 * side] + (side ? -inset : inset);
      const fitting = w => withinStrip(w, cross, lane - envelope, lane + envelope);
      const first = near.find(fitting), last = far.find(fitting);
      if (!first || !last || Math.abs(first.top - last.top) > epsilon) continue;
      const head = first.top, start = first.rect[axis + 2], end = last.rect[axis];
      if (end - start < 2 || head - floor.top < 2.6) continue;
      const soffits = boxes.filter(b => b.ceiling && Math.abs(b.base - head) < epsilon &&
        withinStrip(b, cross, lane - envelope, lane + envelope));
      if (!covered(start, end, soffits.map(b => [b.rect[axis], b.rect[axis + 2]]))) continue;
      const point = (along, lateral, z) => axis === 0 ? [along, lateral, z] : [lateral, along, z];
      const entry = start + wallOffset, exit = end - wallOffset, high = head - ceilingOffset;
      const away = side ? -1 : 1;
      // A set-off on the inlet face gives the riser room for a fitting. Omit
      // the offset on narrow piers where it would carry the run over a window.
      const jog = lane + away * 0.72;
      const points = [];
      if (withinStrip(first, cross, Math.min(jog, lane) - envelope, Math.max(jog, lane) + envelope)) {
        points.push(point(entry, jog, floor.top + 0.58), point(entry, jog, high - 0.94),
          point(entry, lane, high - 0.94));
      } else {
        points.push(point(entry, lane, floor.top + 0.58));
      }
      points.push(point(entry, lane, high), point(exit, lane, high),
        point(exit, lane, floor.top + (kind === "duct-run" ? 1.42 : 0.78)));
      // Short wall entries give each riser an actual supply and termination.
      // End below the surface by less than the host thickness; the sleeve and
      // bend remain visible, with a finite straight after the bend.
      const embed = 0.09;
      if (first.rect[axis+2] - first.rect[axis] <= embed ||
          last.rect[axis+2] - last.rect[axis] <= embed) continue;
      points.unshift(point(start - embed, points[0][cross], points[0][2]));
      points.push(point(end + embed, lane, points.at(-1)[2]));
      const spans = points.slice(1).map((p, i) => sweptBox(points[i], p, envelope));
      if (spans.some((s, i) => solids.some(b => {
        if (i === 0 && b.host === first || i === spans.length - 1 && b.host === last) return false;
        return intersects(s, b);
      }))) continue;
      runs.push({kind, id: "planter-service-" + ["west", "east", "north", "south"][axis === 1 ? side : 3 - side],
        points, wallOffset, ceilingOffset, axis});
      solids.push(...spans);
      break;
    }
  }
  return runs;
}

export function servicePlacement({kind, id, points, axis, wallOffset, ceilingOffset}) {
  const origin = points[0];
  const local = points.map(p => pointText(p.map((v, i) => v - origin[i]))).join("; ");
  const supports = points.slice(1).map((_, i) => {
    const offset = [0, 0, 0];
    if (i === points.length - 4) offset[2] = ceilingOffset;
    else if (i > 0 && i < points.length - 2) offset[axis] = i === points.length - 3 ? wallOffset : -wallOffset;
    return pointText(offset);
  }).join("; ");
  return `    <${kind} id="${id}" position="${pointText(origin)}" points="${local}" supports="${supports}"/>`;
}
