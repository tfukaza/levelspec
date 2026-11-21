const inside = (x, y, [l, b, r, t]) => x >= l && x <= r && y >= b && y <= t;

// Each potential station has its own sequence so editing a distant wall cannot move it.
function randomAt(key) {
  let state = 2166136261;
  for (const c of key) state = Math.imul(state ^ c.charCodeAt(0), 16777619);
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Sample decorative roots on exposed axis-aligned receivers in Z-up metres.
 * Each visible box supplies id, rect [minX,minY,maxX,maxY], base, top, and
 * optional roles wall or ground. Ground receivers can supply jointSpacing and
 * jointOriginY for horizontal mortar courses. All boxes occlude, independently
 * of their role. Excluded rectangles reserve the footprint of other props.
 */
export function weedContacts({boxes, excluded = []}) {
  const grounds = boxes.filter(b => b.ground);
  const walls = boxes.filter(b => b.wall);
  const growth = [];
  const exposed = (x, y, z) => !excluded.some(rect => inside(x, y, rect)) &&
    !boxes.some(b => inside(x, y, b.rect) && b.base < z + 0.18 && b.top > z + 0.012);
  function place(id, x, y, surface, heading, scale, variant = "mound") {
    if (!surface || !exposed(x, y, surface.top)) return;
    if (growth.some(p => Math.abs(p.position[2] - surface.top) < 0.15 &&
      Math.hypot(p.position[0] - x, p.position[1] - y) < 0.28)) return;
    growth.push({ id, position: [x, y, surface.top], heading, scale, variant });
  }
  for (const wall of walls) {
    const [l, b, r, t] = wall.rect;
    // Walk each face in order. The tuft's long axis follows its receiving edge.
    const edges = [[l, b, r - l, 1, 0], [r, b, t - b, 0, 1],
      [r, t, r - l, -1, 0], [l, t, t - b, 0, -1]];
    for (const [side, [x, y, length, dx, dy]] of edges.entries()) {
      if (length < 0.32) continue;
      const stations = Math.ceil(length / 2.3);
      for (let i = 0; i < stations; i++) {
        const id = `weed-${wall.id}-${side}-${i}`, rng = randomAt(id);
        if (rng() > (length < 1 ? 0.38 : 0.7)) continue;
        const along = (i + 0.2 + 0.6 * rng()) * length / stations;
        const outward = 0.04 + 0.026 * rng();
        const u = x + along * dx + outward * dy, v = y + along * dy - outward * dx;
        const support = grounds.find(f => inside(u, v, f.rect) &&
          wall.base <= f.top + 0.008 && wall.top >= f.top + 0.45);
        place(id, u, v, support, Math.atan2(dy, dx) * 180 / Math.PI + (rng() - 0.5) * 16,
          0.65 + rng() * 0.65);
      }
    }
  }
  for (const floor of grounds.filter(f => f.jointSpacing > 0)) {
    const [l, b, r, t] = floor.rect;
    const spacing = floor.jointSpacing, origin = floor.jointOriginY ?? 0;
    for (let i = Math.floor(l / 2.4); i <= Math.floor(r / 2.4); i++) {
      for (let j = Math.ceil((b + 0.12 - origin) / spacing); j <= Math.floor((t - 0.12 - origin) / spacing); j++) {
        const id = `weed-joint-${floor.id}-${i}-${j}`, rng = randomAt(id);
        if (rng() > 0.028) continue;
        const x = (i + rng()) * 2.4, y = origin + j * spacing;
        if (x <= l + 0.16 || x >= r - 0.16) continue;
        place(id, x, y, floor, (rng() - 0.5) * 12, 0.48 + rng() * 0.49, "seam");
      }
    }
  }
  return growth;
}
