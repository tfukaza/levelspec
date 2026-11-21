import { writeFile, mkdir } from "node:fs/promises";
import { Matrix4 } from "three";
import { compile, parseAml } from "../../src/architecture/index.ts";
import { KitMesh } from "../../src/dressing/kit-mesh.ts";
import { kitMaterials, kitFinishes } from "../../src/dressing/kit.ts";
import { Pen } from "../../src/dressing/pen.ts";
import { crate } from "../../src/dressing/kowloon/shop/fittings.ts";
import { grocerProp } from "../../src/dressing/kowloon/shop/grocer-props.ts";
import { srgb } from "../../src/dressing/kowloon/palette.ts";
import { Rng } from "../../src/generate/rng.ts";
import { greengrocer } from "../../src/dressing/kowloon/shop/greengrocer.ts";
import { Kit } from "../../src/dressing/kowloon/kit.ts";

const texture = "/projects/dressing-demo/textures/";
const level = await compile(parseAml(`<architecture version="1" id="containers">
  <material id="plain" color="#ffffff"/>
  ${["shop-timber", "grocer-props"].map(name => `<material id="study-${name}" color="#ffffff" roughness="1" metalness="1" texture="${texture}${name}.png" normal-texture="${texture}${name}-normal.png" metallic-roughness-texture="${texture}${name}-properties.png"/>`).join("")}
  ${["timber", "metal", "market-apple", "snack-packet"].map(name=>`<material id="study-${name}" color="#ffffff" roughness="0.9" texture="${texture}${name}.png"/>`).join("")}
</architecture>`), { navigation: false });
level.mesh.colors = [];
kitMaterials(level);
const mesh = new KitMesh(level, "study", "props", kitFinishes(level, "study", "plain").materials, { maximumTriangles: 100000 });
const pen = new Pen(mesh, "containers", new Matrix4(), false);
if (process.argv[2] === "store") {
  greengrocer.furnish({ pen, width:3.1, depth:3.2, height:2.6, key:"container-review", kit:new Kit("containers",2,.6,.3,false,false) });
} else for (let i = 0; i < 3; i++) {
  crate(pen.into(`crate-${i}`).move(i * .68, .12, 0), .54, .38, .29, srgb("#8a6847"), new Rng(`crate-${i}`));
  grocerProp(pen.into(`box-${i}`), "stock-box", [i * .68 + .27, -.35, 0], [.48, .32, .29], 0, { variant: i + 1 });
}
await mkdir("generated/storefront-containers", { recursive: true });
await writeFile(`generated/storefront-containers/${process.argv[2] ?? "after"}.json`, JSON.stringify({ mesh: level.mesh, surfaces: level.surfaces, materials: level.document.materials }));
console.log({ triangles: level.mesh.indices.length / 3 });
