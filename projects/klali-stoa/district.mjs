/** Grounded shop houses. The four playable islands and the rim use square corners
 * for Klali's box collision. Beyond them, survey points define a winding back street. */
const round = (x) => Number(x.toFixed(4));
const radians = (degrees) => (degrees * Math.PI) / 180;
function offset([x, y], heading, along, across) {
  const a = radians(heading);
  return [
    round(x + along * Math.cos(a) - across * Math.sin(a)),
    round(y + along * Math.sin(a) + across * Math.cos(a)),
  ];
}
export const houses = [];
const masonry = [];
const street = [];
function house(id, origin, heading, floors, solid = false) {
  const corners = [
    [0, 0],
    [9.8, 0],
    [9.8, 7],
    [0, 7],
  ].map(([u, v]) => offset(origin, heading, u, v));
  const xs = corners.map((p) => p[0]),
    ys = corners.map((p) => p[1]);
  houses.push({
    id,
    origin,
    heading,
    floors,
    solid,
    corners,
    rect: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
  });
  if (solid)
    masonry.push(
      `  <box id="masonry-${id}-shell" position="${origin.join(" ")} 0" rotation="0 0 ${heading}" width="9.8" depth="7" height="${round(3.35 + 3 * (floors - 1))}" visible="false" material="m-white"/>`,
    );
}
// The exposed frontage replaces a section of the original island. Its shorter
// adjoining masonry wing still follows the lane and forms a stepped building.
house("inner-west-north", [-10, 2], 90, 5, true);
house("inner-east-north", [19, 2], 90, 4, true);
house("inner-west-south", [-19, -3], 270, 6, true);
house("inner-east-south", [19, -14], 90, 5, true);

const heights = [4, 6, 3, 5, 7, 4];
for (let side = 0; side < 4; side++) {
  const heading = side * 90;
  let frontage = -31;
  for (let i = 0; i < 6; i++) {
    const endOn = (i + side) % 3 === 1;
    const depth = [31, 31.35, 31.05, 31.75, 31.15, 31.45][(i + 2 * side) % 6];
    const origin = offset([0, 0], heading, frontage + (endOn ? 7 : 0), depth);
    house(
      `rim-${side}-${i}`,
      origin,
      heading + (endOn ? 90 : 0),
      heights[(i + side) % 6],
      true,
    );
    frontage +=
      (endOn ? 7 : 9.8) + [0.65, 2.35, 1.1, 2.9, 1.75][(i + side) % 5];
  }
}

// Clockwise centreline. Mitred pavement edges and front doors follow the same
// survey, so a bend affects the neighbouring lots, lamps and street together.
const survey = [
  [-52, 48],
  [-13, 56],
  [48, 49],
  [56, 11],
  [48, -53],
  [12, -47],
  [-53, -54],
  [-47, -8],
];
const edges = survey.map((p, i) => {
  const q = survey[(i + 1) % survey.length],
    dx = q[0] - p[0],
    dy = q[1] - p[1],
    length = Math.hypot(dx, dy);
  return {
    heading: (Math.atan2(dy, dx) * 180) / Math.PI,
    length,
    normal: [-dy / length, dx / length],
  };
});
function outline(distance) {
  return survey.map(([x, y], i) => {
    const a = edges[(i + edges.length - 1) % edges.length].normal,
      b = edges[i].normal;
    const d = distance / (1 + a[0] * b[0] + a[1] * b[1]);
    return [round(x + (a[0] + b[0]) * d), round(y + (a[1] + b[1]) * d)];
  });
}
function streetBand(id, inner, outer, z, material) {
  const points = (ps) => ps.map((p) => p.join(" ")).join("; ");
  street.push(
    `  <profile id="${id}-plan" points="${points(outline(outer).reverse())}"><hole points="${points(outline(inner))}"/></profile>`,
    `  <slab id="${id}" profile="${id}-plan" position="0 0 ${z}" thickness="0.12" material="${material}" collidable="false"/>`,
  );
}
streetBand("back-street", -3, 3, 0.018, "m-pave");
streetBand("back-pavement", 3, 5, 0.15, "m-concrete");
streetBand("opposite-pavement", -5, -3, 0.15, "m-concrete");
// The inset pavement also serves the yards at bends and behind the rim houses.
streetBand("service-courts", -15, -5, 0.008, "m-floor");
const lamps = [];
// Feet coincide with the soil surface on the two lane planters and sunken court.
export const laneTrees = [
  [-25, 15.5, 1.32], [-25, -15.5, 1.32],
  [-27.25, 1.5, -0.58], [-27.25, -1.5, -0.58],
];
export const planterRecess = 0.14;
const trees = laneTrees.map((p, i) =>
  `    <tree id="bed-tree-${i}" position="${p[0]} ${p[1]} ${round(p[2] - 0.22 - planterRecess)}" heading="${i * 73}" scale="${[0.405, 0.405, 0.50, 0.54][i]}"/>`,
);
for (const [i, { heading, length }] of edges.entries()) {
  const count = Math.max(1, Math.floor((length - 3) / 9.85));
  // The crown opens over the road. The root is 0.6 m inside the pavement kerb.
  for (let j = 0; j < 2; j++) {
    const p = offset(survey[i], heading, (j ? 0.72 : 0.26) * length, j ? -3.6 : 3.6);
    const yaw = round(heading + i * 23 + j * 41), scale = [0.62, 0.72, 0.79][(i + j) % 3];
    trees.push(`    <tree id="pavement-tree-${i}-${j}" position="${p.join(" ")} 0.15" heading="${yaw}" scale="${scale}"/>`);
  }
  for (let j = 0; j < count; j++) {
    // Leave the acute bend open for the junction. The two corner lots overlap here.
    if (i === 5 && j === 0) continue;
    const u = (length - count * 9.86) / 2 + j * 9.86;
    const setback = 5.05 + [0, 0.28, 0.7, 0.18][(j + i) % 4];
    const p = offset(survey[i], heading, u, setback);
    const floors = [5, 7, 4, 8, 6, 3][(i * 3 + j) % 6];
    house(`outer-${i}-${j}`, p, round(heading), floors);
    // Pair a shorter return wing with an end wall, forming an L-shaped tenement.
    if (j === Math.floor(count / 2))
      house(
        `return-${i}`,
        offset(p, heading, 7.1, 7.04),
        round(heading + 90),
        Math.max(3, floors - 2),
      );
    if (j % 2 === 0)
      lamps.push(
        `    <lamp id="lamp-${i}-${j}" position="${offset(survey[i], heading, u + 2, 4).join(" ")} 0.15" heading="${round(heading)}" banner="true"/>`,
      );
  }
}
// Fit a facing row between the surveyed road and the playable rim. Projecting
// rotated lots onto both sets of wall normals keeps the wedges at bends open.
function overlaps(a, b) {
  for (const polygon of [a, b]) {
    for (let i = 0; i < 2; i++) {
      const [x, y] = polygon[i], [X, Y] = polygon[i + 1];
      const project = ([u, v]) => u * (Y - y) + v * (x - X);
      const left = a.map(project), right = b.map(project);
      if (Math.max(...left) <= Math.min(...right) || Math.max(...right) <= Math.min(...left)) return false;
    }
  }
  return true;
}
for (const [i, { heading, length }] of edges.entries()) {
  const count = Math.floor((length - 3) / 9.88);
  for (let j = 0; j < count; j++) {
    const u = (length - count * 9.88) / 2 + (j + 1) * 9.88;
    const origin = offset(survey[i], heading, u, -5.08);
    const facing = round(heading + 180);
    const corners = [[0, 0], [9.8, 0], [9.8, 7], [0, 7]].map(([x, y]) => offset(origin, facing, x, y));
    if (houses.some(h => overlaps(h.corners, corners))) continue;
    house(`court-${i}-${j}`, origin, facing, [3, 4, 3, 6, 5][(i + j) % 5]);
  }
}
export const district = [
  ...street,
  "  <city>",
  ...houses.map(
    ({ id, origin, heading, floors }) =>
      `    <building id="${id}" position="${origin.join(" ")} 0" heading="${heading}" floors="${floors}" seed="${floors === 5 ? 8 : floors === 3 ? 9 : floors}"${id === "inner-east-north" ? ' front-trade="roast"' : ""}/>`,
  ),
  ...lamps,
  ...trees,
  "  </city>",
  ...masonry,
];

// Keep canonical legacy collision. Only split visible brush surfaces where a
// grounded house replaces them. The rectangles below have disjoint interiors.
export function exposedPieces(rect) {
  let pieces = [rect];
  for (const house of houses) {
    if (!house.solid) continue;
    let [l, b, r, t] = house.rect;
    // The original one-metre perimeter box also runs in front of recessed lots.
    // Project each rim frontage onto its street-side face before cutting the finish.
    if (house.id.startsWith("rim-")) {
      if (b >= 31) b = 31;
      else if (t <= -31) t = -31;
      else if (l >= 31) l = 31;
      else if (r <= -31) r = -31;
    }
    pieces = pieces.flatMap(([x, y, X, Y]) => {
      const a = Math.max(x, l),
        c = Math.min(X, r),
        d = Math.max(y, b),
        e = Math.min(Y, t);
      if (a >= c || d >= e) return [[x, y, X, Y]];
      return [
        [x, y, a, Y],
        [c, y, X, Y],
        [a, y, c, d],
        [a, e, c, Y],
      ].filter(([x, y, X, Y]) => X > x && Y > y);
    });
  }
  return pieces;
}
