import { mkdir, writeFile } from "node:fs/promises";
import { Matrix4 } from "three";
import { compile, createArchitecture, resolveExportAssets, toGLB } from "../../src/architecture/index.ts";
import { KitMesh } from "../../src/dressing/kit-mesh.ts";
import { kitFinishes, kitMaterials } from "../../src/dressing/kit.ts";
import { srgb } from "../../src/dressing/kowloon/palette.ts";
import { bowlStack } from "../../src/dressing/kowloon/shop/restaurant-fittings.ts";
import { ladles, wok } from "../../src/dressing/kowloon/shop/wares.ts";
import { Pen } from "../../src/dressing/pen.ts";
import { Rng } from "../../src/generate/rng.ts";

const output = "generated/kowloon-restaurant-props/kitchen-props";
const assets: Record<string, (pen: Pen) => void> = {
  "bowl-stack": pen => bowlStack(pen, [0, 0, 0], 6, 0.09, srgb("#476781")),
  wok: pen => wok(pen, [0, 0, 0], 0.23, srgb("#353430")),
  ladle: pen => ladles(pen, [0, 0, 0], new Rng("kitchen-prop-ladles")),
};

await mkdir(output, { recursive: true });
for (const [name, draw] of Object.entries(assets)) {
  const level = await compile(createArchitecture(`kitchen-${name}`), { navigation: false });
  level.mesh.colors = [];
  kitMaterials(level);
  const mesh = new KitMesh(level, name, "study", kitFinishes(level, undefined, "$kowloon/paint").materials,
    { maximumTriangles: 10000 });
  draw(new Pen(mesh, name, new Matrix4(), false));
  await writeFile(`${output}/${name}-baseline.glb`, toGLB(level, { assets: await resolveExportAssets(level) }));
}
