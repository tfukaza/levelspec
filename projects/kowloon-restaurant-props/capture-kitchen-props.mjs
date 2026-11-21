import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createServer } from "vite";
import { validateBytes } from "gltf-validator";

const output = "generated/kowloon-restaurant-props/kitchen-props";
const manifest = JSON.parse(await readFile(new URL("./kitchen-props.json", import.meta.url), "utf8"));
const ids = process.argv.length > 2 ? process.argv.slice(2) : [...Object.keys(manifest), "menu"];
const report = {};
const server = await createServer({ configFile: false, server: { host: "127.0.0.1", port: 0, watch: null, hmr: false } });
await server.listen();
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 620 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const id of ids) {
    const spec = manifest[id];
    assert.ok(spec || id === "menu");
    const url = new URL("projects/kowloon-restaurant-props/kitchen-review.html", server.resolvedUrls.local[0]);
    url.searchParams.set("asset", id);
    await page.goto(url.href);
    await page.locator("body[data-ready=true]").waitFor({ timeout: 15000 });
    const fits = await page.evaluate(() => window.kitchenPropFit);
    for (const view of id === "menu" ? ["wall"] : ["oblique", "high", "rear", "reverse-light"]) {
      await page.evaluate(view => window.showKitchenProp(view), view);
      await page.locator("canvas").screenshot({ path: `${output}/${id}-${view}.png` });
    }
    const paths = spec ? [
      ...(spec.baseline ? [`${output}/${id}-baseline.glb`] : []),
      `${output}/tripo-out/${spec.folder}/model.glb`,
    ] : [];
    const meshes = await Promise.all(paths.map(async (path, index) => {
      const bytes = await readFile(path);
      const { info, issues } = await validateBytes(bytes);
      assert.equal(issues.numErrors, 0, JSON.stringify(issues.messages));
      return { path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"),
        triangles: info.totalTriangleCount, materials: info.materialCount,
        textures: info.resources.filter(resource => resource.image).map(resource => resource.image),
        warnings: issues.numWarnings, fit: fits[index] };
    }));
    report[id] = { meshes, fits };
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/review-${ids.join("-")}.json`, JSON.stringify(report, null, 2) + "\n");
} finally {
  await browser.close();
  await server.close();
}
