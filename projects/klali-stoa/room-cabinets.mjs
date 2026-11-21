// Fit switchgear on full-height wall panels, clear of openings and the room's utility runs.
export function roomCabinets(boxes, services, {floorId, roomId, seed}) {
  const floor = boxes.find(box => box.id === floorId);
  if (!floor) throw Error("Missing cabinet room floor: " + floorId);
  const placements = [];
  for (const [side, across, alongFraction, mountHeight, heading, variantOffset] of [
    ["north", 1, 0.50, 0.92, 0, 0],
    ["east", 0, 0.65, 1.12, -90, 45],
  ]) {
    const along = 1 - across;
    const target = floor.rect[along] + alongFraction * (floor.rect[along + 2] - floor.rect[along]);
    const z = floor.top + mountHeight;
    const center = box => (box.rect[along] + box.rect[along + 2]) / 2;
    const candidates = boxes.filter(box => box.wall &&
      Math.abs(box.rect[across + 2] - floor.rect[across + 2]) < 0.001 &&
      Math.abs(box.base - floor.top) < 0.001 && box.top >= z + 1.09 &&
      box.rect[along] >= floor.rect[along] && box.rect[along + 2] <= floor.rect[along + 2] &&
      box.rect[across + 2] - box.rect[across] <= 1 &&
      box.rect[along + 2] - box.rect[along] >= 1.08);
    candidates.sort((a, b) => Math.abs(center(a) - target) - Math.abs(center(b) - target) || a.id.localeCompare(b.id));
    for (const wall of candidates) {
      const p = [0, 0, z];
      p[across] = wall.rect[across];
      p[along] = center(wall);
      const low = p.slice(), high = p.slice();
      low[across] -= 0.25;
      low[along] -= 0.49;
      high[along] += 0.49;
      low[2] -= 0.43;
      high[2] += 1.04;
      const intersects = (lo, hi) => low.every((v, axis) => v < hi[axis] && lo[axis] < high[axis]);
      const blocked = boxes.some(b => b !== wall &&
        intersects([b.rect[0], b.rect[1], b.base], [b.rect[2], b.rect[3], b.top]));
      const routed = services.some(({kind, points}) => {
        const clearance = kind === "duct-run" ? 0.30 : 0.13;
        return points.slice(1).some((b, i) => intersects(
          b.map((v, j) => Math.min(v, points[i][j]) - clearance),
          b.map((v, j) => Math.max(v, points[i][j]) + clearance)));
      });
      if (blocked || routed) continue;
      const position = p.map(v => Number(v.toFixed(4))).join(" ");
      placements.push(`    <utility-cabinet id="${roomId}-cabinet-${side}" position="${position}" heading="${heading}" seed="${seed + variantOffset}"/>`);
      break;
    }
  }
  return placements;
}
