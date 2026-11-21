/** Regenerate editable AML from the author-owned layout, including its split visual/clip stairs. */
import { writeFileSync } from "node:fs";

import { district, exposedPieces, houses, laneTrees, planterRecess } from "./district.mjs";
import { weedContacts } from "./weed-contacts.mjs";
import { planterCover } from "./planter-cover.mjs";
import { planterWindows } from "./planter-windows.mjs";
import { roomCabinets } from "./room-cabinets.mjs";
import { roomServices, servicePlacement } from "./room-services.mjs";
import { passageGrille } from "./room-grille.mjs";
import { passageLamp } from "./wayfinding/lamp.mjs";
import { roomStructure, structurePlacement } from "./room-structure.mjs";
import { roomDownstand, downstandElements, downstandMaterial, wallBearingHaunch } from "./room-downstand.mjs";
import map from "./layout.json" with { type: "json" };
const lines = [
  '<architecture version="1" id="klali-stoa" units="meters" validation="premap">',
];
const roles = new Set("white shell floor pave concrete dark orange red blue sky teal yellow green wood lamp roof".split(" "));
for (const role of roles) lines.push(`  <material id="m-${role}"/>`);
const n = (x) => Number(x.toFixed(4));
const visibleBoxes = [];
const grassBeds = [];
// MapKit's soil caps sit above solid masonry. Open the visible basin while
// retaining its original collision volume.
const soilBrushes = map.brushes.filter(b => b.deco && b.mat === "green" && n(b.maxY - b.minY) === 0.22);
const basins = new Map();
for (const soil of soilBrushes) {
  const host = map.brushes.find(b => !b.deco && !b.clip && !b.backdrop &&
    n(b.maxY - soil.minY) === 0 &&
    n(soil.minX - b.minX) === 0.15 && n(b.maxX - soil.maxX) === 0.15 &&
    n(soil.minZ - b.minZ) === 0.15 && n(b.maxZ - soil.maxZ) === 0.15);
  if (!host || basins.has(host)) throw Error("Planter soil requires a unique masonry basin");
  basins.set(host, soil);
}
const masonry = new Set(["concrete", "shell", "white", "teal", "blue", "orange", "yellow"]);
// Dress the two west panels and the north return of the raised planter arcade.
const planterWalls = new Map([
  [100, { heading: 90, seed: 21 }],
  [101, { heading: 90, seed: 45 }],
  [390, { heading: 0, seed: 69 }],
]);
const wallPlacements = [];
const lightPlacements = [];
const lowerArcadeLights = new Set([88, 89, 402, 703]);
for (const [i, b] of map.brushes.entries()) {
  // MapKit represents a visual tree with three boxes about the same trunk axis.
  if (b.deco && (b.mat === "wood" || b.mat === "green") && laneTrees.some(([x, y, z]) =>
    Math.abs((b.minX + b.maxX)/2 - x) < 0.001 && Math.abs((b.minZ + b.maxZ)/2 + y) < 0.001 &&
    b.minY >= z - 0.001 && b.maxX - b.minX <= 1.801 && b.maxZ - b.minZ <= 1.801)) continue;
  // Replace the original skyline, retaining all four ground aprons.
  if (b.backdrop && b.maxY > 0) continue;
  // These thin graphic panels belonged to Stoa's original storefront dressing.
  if (
    b.deco &&
    b.mat === "dark" &&
    b.minY >= 4 &&
    Math.min(b.maxX - b.minX, b.maxZ - b.minZ) < 0.15 &&
    Math.max(b.maxX - b.minX, b.maxZ - b.minZ) >= 3
  )
    continue;
  if (!roles.has(b.mat) || (b.top && !roles.has(b.top)))
    throw Error("Unknown brush material: " + b.mat);
  const id = "brush-" + i;
  const rect = [b.minX, -b.maxZ, b.maxX, -b.minZ];
  // Bring the exterior apron up to the street datum.
  const top = b.backdrop ? 0 : b.maxY;
  const pieces =
    !b.clip && !b.backdrop && b.maxY > 0 ? exposedPieces(rect) : [rect];
  const cut = pieces.length !== 1 || pieces[0].some((v, j) => v !== rect[j]);
  const wall = planterWalls.get(i);
  // Retain the source lamp envelopes in the service clearance survey.
  const lowerLamp = lowerArcadeLights.has(i);
  const lampBay = lowerLamp || i === 403 || i === 704;
  if (lampBay) {
    if (cut || !b.deco || b.mat !== "lamp") throw Error("Expected a ceiling lamp at " + id);
    const x = (rect[0] + rect[2]) / 2, y = (rect[1] + rect[3]) / 2;
    if (lowerLamp) {
      const width = n(rect[2] - rect[0]), depth = n(rect[3] - rect[1]);
      if (n(top) !== 3.25 || Math.min(width, depth) !== 1.2 || Math.max(width, depth) !== 4)
        throw Error("Expected the lower arcade lamp envelope at " + id);
      const heading = width > depth ? 0 : 90;
      lightPlacements.push(`    <ceiling-twin-strip id="arcade-lower-light-${i}" position="${n(x)} ${n(y)} ${n(top)}" heading="${heading}" length="2.4" enclosed="true"/>`);
    } else {
      const kind = i === 403 ? "ceiling-twin-strip" : "ceiling-bulkhead";
      const dimensions = kind === "ceiling-twin-strip" ? ' length="1.5"' : "";
      for (const [index, offset] of [-1, 1].entries()) {
        lightPlacements.push(`    <${kind} id="arcade-light-${i}-${index}" position="${n(x + offset)} ${n(y)} ${n(top)}"${dimensions}/>`);
      }
    }
  }
  if (wall) {
    if (cut || b.clip || b.deco || b.backdrop || b.top) {
      throw Error("The planter wall requires a full solid brush: " + id);
    }
    const [x, y, maxX, maxY] = rect;
    const turns = wall.heading === 90;
    const position = [turns ? maxX : x, y, b.minY].map(n).join(" ");
    const width = n(turns ? maxY - y : maxX - x);
    const depth = n(turns ? maxX - x : maxY - y);
    wallPlacements.push(`    <procedural-wall id="planter-wall-${i}" position="${position}" heading="${wall.heading}" width="${width}" depth="${depth}" height="${n(top - b.minY)}" seed="${wall.seed}"/>`);
  }
  function box(name, [x, y, X, Y], visible, collidable) {
    const emit = (id, x0, y0, x1, y1, z0, z1, material, draw, solid) =>
      lines.push(`  <box id="${id}" position="${n(x0)} ${n(y0)} ${n(z0)}" width="${n(x1-x0)}" depth="${n(y1-y0)}" height="${n(z1-z0)}" material="m-${material}" collidable="${solid}" visible="${draw}"/>`);
    if (soilBrushes.includes(b) && visible) {
      grassBeds.push({id: name, x, y, top: n(b.minY-planterRecess), width: n(X-x), depth: n(Y-y)});
      return;
    }
    const soil = basins.get(b);
    if (soil && visible) {
      const bedTop = top - planterRecess;
      emit(name, x,y,X,Y,b.minY,top,b.mat,false,collidable);
      emit(name+"-base", x,y,X,Y,b.minY,bedTop,b.mat,true,false);
      for (const [side,x0,y0,x1,y1] of [
        ["south",x,y,X,-soil.maxZ], ["north",x,-soil.minZ,X,Y],
        ["west",x,-soil.maxZ,soil.minX,-soil.minZ], ["east",soil.maxX,-soil.maxZ,X,-soil.minZ],
      ]) emit(name+"-"+side,x0,y0,x1,y1,bedTop,top,b.mat,true,false);
    } else {
      if (!lampBay) emit(name,x,y,X,Y,b.minY,top,b.mat,visible && !wall,collidable);
    }
    if (!visible) return;
    const topMaterial = b.top ?? b.mat;
    // Street-level masonry and the sunken court stand on deep foundations.
    visibleBoxes.push({ id: name, rect: [x, y, X, Y], base: b.minY, top,
      ceiling: !b.deco && !b.backdrop && top - b.minY <= 0.6 && Math.min(X-x, Y-y) > 1,
      wall: !b.deco && !b.backdrop && masonry.has(b.mat) && top - b.minY >= 0.65,
      ground: b.minY < -2 && top <= 0.25 && ["floor", "pave"].includes(topMaterial),
      jointSpacing: topMaterial === "floor" ? 0.4 : 0 });
    if (b.top)
      lines.push(
        `  <face-material id="top-${name.slice(6)}" host="${name}" face="top" material="m-${b.top}"/>`,
      );
  }
  box(id, rect, !b.clip && !cut, !b.deco && !b.backdrop);
  if (cut)
    pieces.forEach((piece, j) => box(`${id}-finish-${j}`, piece, true, false));
}
for (const [team, points] of [
  ["attacker", map.tSpawns],
  ["defender", map.ctSpawns],
]) {
  for (const [i, p] of points.entries()) {
    const support = map.brushes.findIndex(
      (b) =>
        !b.deco &&
        !b.backdrop &&
        p.x >= b.minX &&
        p.x <= b.maxX &&
        p.z >= b.minZ &&
        p.z <= b.maxZ &&
        Math.abs(p.y - b.maxY) < 0.05,
    );
    if (support < 0)
      throw Error("Spawn without supporting brush: " + JSON.stringify(p));
    lines.push(
      `  <marker id="${team}-${i}" kind="${team}_spawn" team="${team === "attacker" ? "attack" : "defend"}" element="brush-${support}" position="${p.x} ${n(-p.z)} ${p.y}"/>`,
    );
  }
}
const weeds = weedContacts({boxes: visibleBoxes, excluded: houses.filter(h => h.solid).map(h => h.rect)});
const fields = [];
for (const {id, x, y, top, width, depth} of grassBeds) {
  const src = `planting/lawn-${width}x${depth}.glb`;
  fields.push(`    <grass-field id="lawn-${id}" position="${x} ${y} ${n(top)}" src="${src}"/>`);
}
const centralBasin = visibleBoxes.find(box => box.id === "brush-76");
const cover = planterCover(centralBasin);
const services = roomServices(visibleBoxes, "brush-63");
const girders = roomStructure(visibleBoxes, "brush-63", services);
const downstands = roomDownstand(visibleBoxes, "brush-63", services, girders);
for (const line of district) {
  if (line === "  </city>") {
    for (const {id, position, heading, scale, variant} of weeds)
      lines.push(`    <weed id="${id}" position="${position.map(n).join(" ")}" heading="${n(heading)}" scale="${n(scale)}"${variant === "seam" ? ' variant="seam"' : ""}/>`);
    lines.push(...fields);
    lines.push(...wallPlacements);
    lines.push(...services.map(servicePlacement));
    lines.push(...roomCabinets(visibleBoxes, services, {floorId:"brush-63", roomId:"arcade", seed:22}));
    lines.push(...cover.props);
    lines.push(...lightPlacements, ...passageLamp(visibleBoxes, downstands, services));
    lines.push(...passageGrille(visibleBoxes, services, downstands));
    lines.push(...girders.map(structurePlacement));
  }
  lines.push(line);
}
if (downstands.length) lines.push(downstandMaterial, ...downstands.flatMap(downstandElements),
  ...downstands.flatMap(beam => wallBearingHaunch(visibleBoxes, beam, services)));
lines.push(...cover.solid, ...planterWindows(visibleBoxes), "</architecture>");
writeFileSync(process.argv[2] ?? new URL("scene.aml", import.meta.url), lines.join("\n") + "\n");
