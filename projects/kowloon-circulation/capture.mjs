import {createHash} from "node:crypto";
import {readFile, mkdir, writeFile} from "node:fs/promises";
import {join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {rolldown} from "rolldown";
import {chromium} from "playwright";

const project = new URL("./", import.meta.url);
const generated = "generated/kowloon-circulation";
const model = resolve(process.argv[2] ?? join(generated, "demo/kowloon-circulation.glb"));
const output = resolve(process.argv[3] ?? join(generated, "renders"));
const views = JSON.parse(await readFile(new URL(process.argv[4] ?? "views.json", project), "utf8"));
const bytes = await readFile(model);
const digest = createHash("sha256").update(bytes).digest("hex");

const bundle = await rolldown({
  input: fileURLToPath(new URL("render-scene.mjs", project)),
  platform: "browser",
});
const {output: [{code}]} = await bundle.generate({format: "esm", codeSplitting: false});
await bundle.close();

await mkdir(output, {recursive: true});
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-proxy-server"],
});
const errors = [];
try {
  const page = await browser.newPage({viewport: {width: 1150, height: 960}, deviceScaleFactor: 1});
  page.on("pageerror", error => errors.push(error.message));
  const resources = new Map([
    ["/", ["text/html", "<meta charset=utf-8><script type=module src=/render.js></script>"]],
    ["/render.js", ["text/javascript", code]],
    ["/model.glb", ["model/gltf-binary", bytes]],
  ]);
  await page.route("http://render.test/**", async route => {
    const resource = resources.get(new URL(route.request().url()).pathname);
    if (!resource) return route.fulfill({status: 404});
    const [contentType, body] = resource;
    return route.fulfill({contentType, body});
  });
  await page.goto("http://render.test/");
  await page.waitForSelector("body[data-ready=true]", {timeout: 60000});
  for (const view of views) {
    await page.evaluate(view => window.captureView(view), view);
    await page.locator("canvas").screenshot({path: join(output, view.id + ".png")});
  }
  await writeFile(join(output, "capture.json"), JSON.stringify({model, sha256: digest, views, errors}, null, 2) + "\n");
  if (errors.length) throw new Error(errors.join("\n"));
} finally {
  await browser.close();
}

