import sharp from "sharp";
import { fileURLToPath } from "node:url";
// Four one-metre boards across a four-metre UV tile align lettering to AML world coordinates.
const shops = [
  ["永昌五金", "#792f26", "#e4d0a4"],
  ["南華冰室", "#33635d", "#efdeab"],
  ["金城藥房", "#be9a49", "#5e302b"],
  ["德記茶莊", "#435065", "#ffdfa3"],
];
for (const [i, [title, paint, ink]] of shops.entries()) {
  const glyphs = [...title]
    .map(
      (char, row) =>
        `<text x="48" y="${81 + row * 87}" text-anchor="middle" fill="${ink}" font-family="Microsoft YaHei, sans-serif" font-weight="bold" font-size="69">${char}</text>`,
    )
    .join("");
  const board = `<rect width="96" height="384" fill="${paint}"/><rect x="3" y="3" width="90" height="378" fill="none" stroke="${ink}" stroke-width="2"/>${glyphs}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384">${[0, 1, 2, 3].map((k) => `<g transform="translate(${k * 96} 0)">${board}</g>`).join("")}</svg>`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(fileURLToPath(new URL("board-" + i + ".png", import.meta.url)));
}
