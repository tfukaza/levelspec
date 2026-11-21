// Survey in native AML meters, right-handed Z-up. The ItemSpec origin is the
// top centerline of its first bearing plate. Both plates seat on the wall faces.
const halfWidth = 0.115,
  depth = 0.2,
  braceRun = 0.65,
  braceDepth = 0.58;
const serviceGap = 0.04,
  headroom = 2.05,
  epsilon = 0.0001;
const round = (n) => Number(n.toFixed(4));
const intervalOverlap = (a, b, c, d) => a < d - epsilon && c < b - epsilon;

export function coveredRoof(slabs, axis, start, end, lo, hi) {
  const cross = 1 - axis;
  const cuts = [
    lo,
    hi,
    ...slabs.flatMap((s) => [s.rect[cross], s.rect[cross + 2]]).filter((x) => x > lo && x < hi),
  ].sort((a, b) => a - b);
  for (let i = 1; i < cuts.length; i++) {
    if (cuts[i] - cuts[i - 1] < epsilon) continue;
    const mid = (cuts[i - 1] + cuts[i]) / 2;
    const strips = slabs
      .filter((s) => s.rect[cross] <= mid && mid <= s.rect[cross + 2])
      .map((s) => [s.rect[axis], s.rect[axis + 2]])
      .sort((a, b) => a[0] - b[0]);
    let at = start;
    for (const [a, b] of strips) {
      if (a > at + epsilon) break;
      at = Math.max(at, b);
    }
    if (at < end - epsilon) return false;
  }
  return true;
}

function swept(a, b, radii) {
  return {
    lo: a.map((x, i) => Math.min(x, b[i]) - radii[i]),
    hi: a.map((x, i) => Math.max(x, b[i]) + radii[i]),
  };
}

export function serviceVolumes(runs) {
  const solids = [];
  for (const run of runs) {
    const duct = run.kind === "duct-run",
      radius = duct ? 0.19 : 0.07,
      pts = run.points;
    const overhead = pts.length - 4;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i],
        b = pts[i + 1],
        vertical = Math.abs(a[2] - b[2]) > epsilon;
      const s = swept(a, b, [radius, radius, duct && !vertical ? 0.137 : radius]);
      // A continuous conservative envelope includes couplings and wall/ceiling mounting arms.
      if (i === overhead) s.hi[2] = Math.max(s.hi[2], a[2] + run.ceilingOffset);
      else if (i > 0 && i < pts.length - 2) {
        const offset = i === pts.length - 3 ? run.wallOffset : -run.wallOffset;
        s.lo[run.axis] = Math.min(s.lo[run.axis], a[run.axis] + offset, b[run.axis] + offset);
        s.hi[run.axis] = Math.max(s.hi[run.axis], a[run.axis] + offset, b[run.axis] + offset);
      }
      solids.push(s);
      if (i > 0) {
        const turn = (duct ? 0.272 : 0.138) + radius;
        solids.push(swept(a, a, [turn, turn, turn]));
      }
    }
    if (duct && overhead >= 0) {
      // The downturned branch occupies the positive-axis end bay of the duct.
      // Reserve the whole bay, including the terminal, saddle and ceiling rods.
      const a = pts[overhead],
        b = pts[overhead + 1],
        end = Math.max(a[run.axis], b[run.axis]);
      const start = Math.min(a[run.axis], b[run.axis]),
        cross = 1 - run.axis;
      const s = swept(a, b, [0, 0, 0]);
      s.lo[run.axis] = start + 0.5 * (end - start) - 0.5;
      s.hi[run.axis] = end + 0.2;
      s.lo[cross] -= radius;
      s.hi[cross] += 1.6;
      s.lo[2] -= 0.34;
      s.hi[2] += run.ceilingOffset;
      solids.push(s);
    }
  }
  return solids;
}

function suspensionStations(slabs, solids, axis, start, end, lane, z, roof) {
  if (roof - z < 0.05) return [];
  if (roof - z > 1) return null;
  const cross = 1 - axis,
    length = end - start;
  const clear = (x) =>
    !solids.some(
      (b) =>
        intervalOverlap(x - 0.085, x + 0.085, b.lo[axis], b.hi[axis]) &&
        intervalOverlap(lane - 0.13, lane + 0.13, b.lo[cross], b.hi[cross]) &&
        intervalOverlap(z, roof, b.lo[2], b.hi[2]),
    ) && coveredRoof(slabs, axis, x - 0.085, x + 0.085, lane - 0.13, lane + 0.13);
  // Find a chain of unobstructed ceiling plates, limiting every unsupported bay
  // to 3 m. Penalize uneven lengths, including both end bays.
  const stations = [0];
  const count = Math.ceil(length / 0.1);
  for (let i = 1; i < count; i++) {
    const x = (length * i) / count;
    if (x > 0.66 && length - x > 0.66 && clear(start + x)) stations.push(x);
  }
  stations.push(length);
  const costs = stations.map(() => Infinity),
    prev = stations.map(() => -1);
  const target = length / Math.max(2, Math.ceil(length / 3));
  costs[0] = 0;
  for (let i = 1; i < stations.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      const span = stations[i] - stations[j];
      if (span > 3 + epsilon) break;
      if (span < 0.6 || (j === 0 && i === stations.length - 1)) continue;
      const cost = costs[j] + 1 + (span - target) ** 2;
      if (cost < costs[i]) {
        costs[i] = cost;
        prev[i] = j;
      }
    }
  }
  if (!Number.isFinite(costs.at(-1))) return null;
  const result = [];
  for (let i = prev.at(-1); i > 0; i = prev[i]) result.push(round(stations[i] + 0.001));
  return result.reverse();
}

function scoreOrder(a, b) {
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    if (Math.abs(diff) > epsilon) return diff;
  }
  return 0;
}

export function roomStructure(boxes, floorId, runs = []) {
  const floor = boxes.find((b) => b.id === floorId);
  if (!floor) throw Error("Missing girder room floor: " + floorId);
  const walls = boxes.filter((b) => b.wall && Math.abs(b.base - floor.top) < epsilon);
  const services = serviceVolumes(runs);
  let best;
  for (const axis of [0, 1]) {
    const cross = 1 - axis;
    const wallsAt = (side) =>
      walls.filter(
        (w) =>
          Math.abs(w.rect[axis + 2 * side] - floor.rect[axis + 2 * side]) < epsilon &&
          w.rect[axis + 2] - w.rect[axis] >= 0.12 &&
          w.rect[axis + 2] - w.rect[axis] <= 1.1,
      );
    for (const a of wallsAt(0))
      for (const b of wallsAt(1)) {
        const start = a.rect[axis + 2],
          end = b.rect[axis],
          span = end - start;
        if (span < 1.6 || span > 20 || Math.abs(a.top - b.top) > epsilon) continue;
        const roof = a.top,
          slabs = boxes.filter((s) => s.ceiling && Math.abs(s.base - roof) < epsilon);
        const lo = Math.max(floor.rect[cross], a.rect[cross], b.rect[cross]) + halfWidth + 0.025;
        const hi = Math.min(floor.rect[cross + 2], a.rect[cross + 2], b.rect[cross + 2]) - halfWidth - 0.025;
        if (hi < lo || !slabs.length) continue;
        const solids = boxes
          .filter((s) => s !== a && s !== b && s.top > floor.top + headroom && s.base < roof)
          .map((s) => ({ lo: [...s.rect.slice(0, 2), s.base], hi: [...s.rect.slice(2), s.top] }));
        const steps = Math.max(1, Math.ceil((hi - lo) / 0.12));
        for (let i = 0; i <= steps; i++) {
          const lane = lo + ((hi - lo) * i) / steps;
          if (!coveredRoof(slabs, axis, start, end, lane - halfWidth, lane + halfWidth)) continue;
          const under = (s) =>
            intervalOverlap(start, end, s.lo[axis], s.hi[axis]) &&
            intervalOverlap(lane - halfWidth, lane + halfWidth, s.lo[cross], s.hi[cross]);
          const nearServices = services.filter((s) =>
            under({ lo: s.lo.map((x) => x - serviceGap), hi: s.hi.map((x) => x + serviceGap) }),
          );
          const occupied = [
            ...solids.filter(under),
            ...nearServices.map((s) => ({
              lo: s.lo.map((x) => x - serviceGap),
              hi: s.hi.map((x) => x + serviceGap),
            })),
          ];
          // Candidate top elevations occur at the roof or the bottom of an obstacle.
          const levels = [roof, ...occupied.map((s) => s.lo[2]).filter((z) => z < roof)].sort(
            (x, y) => y - x,
          );
          for (const z of levels) {
            if (z - braceDepth < floor.top + headroom) break;
            const cut = occupied.some((s) => {
              const brace =
                intervalOverlap(start, start + braceRun, s.lo[axis], s.hi[axis]) ||
                intervalOverlap(end - braceRun, end, s.lo[axis], s.hi[axis]);
              return intervalOverlap(z - (brace ? braceDepth : depth), z, s.lo[2], s.hi[2]);
            });
            if (cut) continue;
            const coverage = nearServices.reduce(
              (sum, s) => sum + Math.max(0, Math.min(end, s.hi[axis]) - Math.max(start, s.lo[axis])),
              0,
            );
            const score = [roof - z, span, coverage, -Math.min(lane - lo, hi - lane), axis, lane];
            if (!best || scoreOrder(score, best.score) < 0) {
              const hangerSolids = [
                ...solids,
                ...services.map((s) => ({
                  lo: s.lo.map((x) => x - serviceGap),
                  hi: s.hi.map((x) => x + serviceGap),
                })),
              ];
              const hangerStations = suspensionStations(slabs, hangerSolids, axis, start, end, lane, z, roof);
              if (!hangerStations) continue;
              const p = [0, 0, z];
              p[axis] = start - 0.001;
              p[cross] = lane;
              best = {
                score,
                item: {
                  id: "room-girder-" + floor.id,
                  kind: "ceiling-girder",
                  position: p.map(round),
                  length: round(span + 0.002),
                  heading: axis * 90,
                  soffitGap: round(roof - z),
                  hangerStations,
                },
              };
            }
            break;
          }
        }
      }
  }
  return best ? [best.item] : [];
}

export function structurePlacement({ id, position, length, heading, soffitGap, hangerStations }) {
  const supports = hangerStations.length
    ? ` soffitGap="${soffitGap}" hangerStations="${hangerStations.map((x) => x + " 0 0").join("; ")}"`
    : "";
  return `    <ceiling-girder id="${id}" position="${position.join(" ")}" heading="${heading}" length="${length}"${supports}/>`;
}
