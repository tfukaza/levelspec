// Fit a pair of casements between the existing sill and lintel in the east bay.
// The wall path runs toward -Y, so the opening faces into the arcade.
export function planterWindows(boxes) {
  const sill = boxes.find(box => box.id === "brush-93");
  const lintel = boxes.find(box => box.id === "brush-94");
  if (!sill || !lintel || sill.rect.some((value, i) => value !== lintel.rect[i])) {
    throw Error("Missing coincident sill and lintel for the arcade windows");
  }
  const [x0, y0, x1, y1] = sill.rect;
  const round = value => Number(value.toFixed(4));
  const x = round((x0 + x1) / 2);
  const span = y1 - y0, height = round(lintel.base - sill.top);
  const jamb = 0.08, rail = 0.06, depth = 0.18;
  const width = round((span - 3 * jamb) / 2);
  const wall = "masonry-arcade-window-wall";
  const surround = "builtin:casement-surround";
  const lines = [
    `  <path id="arcade-window-axis" points="${x} ${y1} ${sill.top}; ${x} ${y0} ${sill.top}"/>`,
    `  <wall id="${wall}" path="arcade-window-axis" thickness="${depth}" height="${height}" material="${surround}"/>`,
  ];
  for (const [i, state] of ["closed", "open"].entries()) {
    const center = round(jamb + width / 2 + i * (width + jamb));
    const opening = `arcade-aperture-${state}`;
    lines.push(
      `  <opening id="${opening}" host="${wall}" shape="rectangle" center="${center} ${round(height / 2)}" width="${width}" height="${round(height - 2 * rail)}"/>`,
      `  <window id="masonry-arcade-window-${state}" opening="${opening}" open="${i === 1}"/>`,
    );
  }
  // Separate snap-on covers leave a narrow joint around each folded member. Their
  // chamfers catch light on both faces of the opening; the original wall owns collision.
  for (const [face, sign] of [["inside", -1], ["outside", 1]]) {
    const faceX = round(x + sign * depth / 2);
    for (const [member, gauge] of [["rail", rail], ["post", jamb]]) {
      const half = round(gauge / 2 - 0.002);
      const shoulder = round(half - 0.004);
      const section = `surround-${face}-${member}-fold`;
      const fold = [
        [-0.001, -half], [0.002, -half], [0.006, -shoulder],
        [0.006, shoulder], [0.002, half], [-0.001, half],
      ].map(([depth, side]) => `${round(sign * depth)} ${side}`).join("; ");
      lines.push(`  <profile id="${section}" points="${fold}"/>`);
      const positions = member === "rail"
        ? [sill.top + rail / 2, lintel.base - rail / 2].map(z => [faceX, y0 + 0.002, z])
        : [y0 + jamb / 2, (y0 + y1) / 2, y1 - jamb / 2].map(y => [faceX, y, sill.top + rail]);
      for (const [index, position] of positions.entries()) {
        const id = `masonry-arcade-window-surround-${face}-${member}-${index}`;
        const rotation = member === "rail" ? ' rotation="-90 0 0"' : "";
        const distance = round(member === "rail" ? span - 0.004 : height - 2 * rail);
        lines.push(`  <extrusion id="${id}" profile="${section}" position="${position.map(round).join(" ")}"${rotation} distance="${distance}" material="${surround}" collidable="false"/>`);
      }
    }
  }
  return lines;
}
