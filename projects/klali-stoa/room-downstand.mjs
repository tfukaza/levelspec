import { coveredRoof, serviceVolumes } from "./room-structure.mjs";

const eps = 0.001;
const round = (n) => Number(n.toFixed(4));
const widthOf = (b, axis) => b.rect[axis + 2] - b.rect[axis];
const overlap = (a, b, c, d) => a < d - eps && c < b - eps;

/** Pick an uninterrupted slab bay with a free-standing pier and an opposing
 * full-height wall. The selected slab is the ceiling of the lower room. */
export function roomDownstand(boxes, ceilingId, runs = [], girders = []) {
  const slab = boxes.find((b) => b.id === ceilingId && b.ceiling);
  if (!slab) return [];
  const roof = slab.base;
  const supports = boxes.filter(
    (b) =>
      b.wall &&
      Math.abs(b.top - roof) < eps &&
      b.top - b.base >= 2.7 &&
      overlap(b.rect[0], b.rect[2], slab.rect[0], slab.rect[2]) &&
      overlap(b.rect[1], b.rect[3], slab.rect[1], slab.rect[3]),
  );
  const piers = supports.filter((b) =>
    [0, 1].every((axis) => widthOf(b, axis) >= 0.34 && widthOf(b, axis) <= 0.9),
  );
  const obstacles = serviceVolumes(runs);
  for (const g of girders) {
    const [x, y, z] = g.position,
      axis = g.heading === 90 ? 1 : 0;
    obstacles.push({
      lo: [x - 0.13, y - 0.13, z - 0.58],
      hi: [
        x + 0.13 + (1 - axis) * g.length,
        y + 0.13 + axis * g.length,
        z + g.soffitGap,
      ],
    });
  }
  const candidates = [];
  for (const pier of piers)
    for (const axis of [0, 1]) {
      const cross = 1 - axis,
        center = (pier.rect[cross] + pier.rect[cross + 2]) / 2;
      for (const wall of supports) {
        if (
          wall === pier ||
          Math.abs(pier.base - wall.base) > eps ||
          widthOf(wall, cross) < 1.4 ||
          widthOf(wall, axis) > 1.1
        )
          continue;
        const [a, b] = [pier, wall].sort((p, q) => p.rect[axis] - q.rect[axis]);
        const start = a.rect[axis + 2],
          end = b.rect[axis],
          span = end - start;
        if (span < 5.5 || span > 9) continue;
        const width = round(Math.max(0.3, Math.min(0.44, span / 22))),
          depth = round(span / 15.8);
        const travel = (widthOf(pier, cross) - width) / 2 - 0.012;
        for (const lane of [center, center - travel, center + travel]) {
          if (
            roof - depth - pier.base < 2.4 ||
            [wall, pier].some(
              (s) =>
                s.rect[cross] > lane - width / 2 - 0.01 ||
                s.rect[cross + 2] < lane + width / 2 + 0.01,
            ) ||
            !coveredRoof(
              [slab],
              axis,
              start,
              end,
              lane - width / 2,
              lane + width / 2,
            )
          )
            continue;
          const intersects = (lo, hi) =>
            overlap(start, end, lo[axis], hi[axis]) &&
            overlap(
              lane - width / 2 - 0.04,
              lane + width / 2 + 0.04,
              lo[cross],
              hi[cross],
            ) &&
            overlap(roof - depth - 0.04, roof, lo[2], hi[2]);
          if (
            boxes.some(
              (s) =>
                s !== a &&
                s !== b &&
                intersects(
                  [s.rect[0], s.rect[1], s.base],
                  [s.rect[2], s.rect[3], s.top],
                ),
            ) ||
            obstacles.some((o) => intersects(o.lo, o.hi))
          )
            continue;
          // Both ends sit 100 mm into their supports. Keep the chamfered soffit
          // in the native physical mesh, independent of the packed material.
          const position = [0, 0, roof],
            finish = [0, 0, roof];
          position[axis] = start - 0.1;
          finish[axis] = end + 0.1;
          position[cross] = finish[cross] = lane;
          candidates.push({
            id: "masonry-downstand-" + ceilingId,
            ceiling: ceilingId,
            pier: pier.id,
            wall: wall.id,
            axis,
            lane,
            position: position.map(round),
            end: finish.map(round),
            span: round(span),
            width,
            depth,
          });
          break;
        }
      }
    }
  candidates.sort(
    (a, b) =>
      b.span - a.span ||
      a.lane - b.lane ||
      a.axis - b.axis ||
      a.pier.localeCompare(b.pier),
  );
  return candidates.slice(0, 1);
}

export function downstandElements(beam) {
  const { id, position, end, width, depth } = beam,
    half = round(width / 2),
    bevel = 0.018;
  const section = [
    [-half, 0],
    [-half, -depth + bevel],
    [-half + bevel, -depth],
    [half - bevel, -depth],
    [half, -depth + bevel],
    [half, 0],
  ];
  return [
    `  <profile id="${id}-section" points="${section.map((p) => p.map(round).join(" ")).join("; ")}"/>`,
    `  <path id="${id}-axis" points="${position.join(" ")}; ${end.join(" ")}"/>`,
    `  <sweep id="${id}" path="${id}-axis" profile="${id}-section" material="m-boardformed-concrete" collidable="true"/>`,
  ];
}
export const downstandMaterial =
  '  <material id="m-boardformed-concrete"/>';

/** Cast the beam deeper at the represented wall bearing. The haunch's top is
 * buried inside the downstand, so only the flat heel and inclined soffit show. */
export function wallBearingHaunch(boxes, beam, runs = []) {
  const wall = boxes.find((b) => b.id === beam.wall && b.wall);
  const pier = boxes.find((b) => b.id === beam.pier && b.wall);
  const roof = boxes.find((b) => b.id === beam.ceiling && b.ceiling);
  if (!wall || !pier || !roof) return [];
  const { axis, lane } = beam,
    cross = 1 - axis;
  const [start, end] = [beam.position[axis], beam.end[axis]];
  const left = wall.rect[axis] < pier.rect[axis];
  const face = wall.rect[axis + (left ? 2 : 0)],
    direction = left ? 1 : -1;
  const bearing = left ? start : end,
    farBearing = left ? end : start;
  if (
    bearing < wall.rect[axis] ||
    bearing > wall.rect[axis + 2] ||
    farBearing < pier.rect[axis] ||
    farBearing > pier.rect[axis + 2] ||
    Math.abs(wall.top - roof.base) > eps ||
    Math.abs(wall.top - pier.top) > eps
  )
    return [];
  const half = round(beam.width / 2 - 0.023),
    soffit = round(roof.base - beam.depth);
  const drop = round(Math.min(0.3, beam.depth * 0.57)),
    reach = round(Math.min(0.84, beam.span * 0.1));
  const z = round(soffit - drop),
    tip = round(face + direction * reach);
  if (
    half < 0.1 ||
    z - wall.base < 2.4 ||
    wall.rect[cross] > lane - half ||
    wall.rect[cross + 2] < lane + half ||
    !coveredRoof(
      [roof],
      axis,
      Math.min(face, tip),
      Math.max(face, tip),
      lane - half,
      lane + half,
    )
  )
    return [];
  const lo = [0, 0, z - 0.045],
    hi = [0, 0, soffit + 0.045];
  lo[axis] = Math.min(face, tip) - 0.04;
  hi[axis] = Math.max(face, tip) + 0.04;
  lo[cross] = lane - half - 0.045;
  hi[cross] = lane + half + 0.045;
  const blocked = (a, b) => a.every((v, i) => overlap(v, b[i], lo[i], hi[i]));
  if (
    boxes.some(
      (b) =>
        b !== wall &&
        blocked([...b.rect.slice(0, 2), b.base], [...b.rect.slice(2), b.top]),
    ) ||
    serviceVolumes(runs).some((b) => blocked(b.lo, b.hi))
  )
    return [];
  const path = [
    [-0.075, z],
    [0.125, z],
    [reach, soffit + 0.055],
  ].map(([offset, elev]) => {
    const p = [lane, lane, elev];
    p[axis] = round(face + direction * offset);
    return p;
  });
  const id = "masonry-bearing-" + wall.id + "-" + beam.ceiling,
    height = round(drop + 0.1),
    eased = 0.012;
  const section = [
    [-half, height],
    [-half, eased],
    [-half + eased, 0],
    [half - eased, 0],
    [half, eased],
    [half, height],
  ];
  return [
    `  <profile id="${id}-section" points="${section.map((p) => p.map(round).join(" ")).join("; ")}"/>`,
    `  <path id="${id}-axis" points="${path.map((p) => p.join(" ")).join("; ")}"/>`,
    `  <sweep id="${id}" path="${id}-axis" profile="${id}-section" material="m-boardformed-concrete" collidable="true"/>`,
  ];
}
