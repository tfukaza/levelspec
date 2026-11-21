// Two low lengths of cast concrete along the central arcade basin. The little
// coping overhang faces the walkway; its inner edge stays flush with the basin.
export function planterCover(basin) {
  const {
    rect: [west, south, east, north],
    base,
  } = basin;
  const sections = [
    { id: "west", x: west - 0.26, y: north - 2.7, w: 0.26, d: 2.48, h: 1.22, seed: 81 },
    { id: "south", x: east - 1.84, y: south - 0.26, w: 1.64, d: 0.26, h: 1.04, seed: 93 },
  ];
  const solid = [],
    props = [];
  const n = (x) => Number(x.toFixed(4));
  for (const { id, x, y, w, d, h, seed } of sections) {
    const alongY = id === "west";
    const lip = 0.035;
    const courses = [
      ["body", x, y, base, w, d, h],
      [
        "coping",
        x - lip,
        y - lip,
        base + h,
        w + (alongY ? lip : 2 * lip),
        d + (alongY ? 2 * lip : lip),
        0.085,
      ],
    ];
    for (const [part, X, Y, Z, W, D, H] of courses) {
      const key = "arcade-planter-" + id + "-" + part;
      solid.push(
        `  <box id="masonry-${key}-solid" position="${[X, Y, Z].map(n).join(" ")}" width="${n(W)}" depth="${n(D)}" height="${n(H)}" material="m-concrete" collidable="true" visible="false"/>`,
      );
      const origin = [alongY ? X + W : X, Y, Z].map(n).join(" ");
      props.push(
        `    <procedural-wall id="${key}" position="${origin}" heading="${alongY ? 90 : 0}" width="${n(alongY ? D : W)}" depth="${n(alongY ? W : D)}" height="${n(H)}" dressing="false" seed="${part === "body" ? seed : seed + 1}"/>`,
      );
    }
  }
  return { solid, props };
}
