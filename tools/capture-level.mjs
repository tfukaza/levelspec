/** Captures browser views from the Rust preview service and its accepted input fingerprints. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { launchBrowser, waitForFrames } from "../../superspec/tools/browser.mjs";
import { nativeCommand } from "./superspec.mjs";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");

/** Checks named cameras before starting a native service or claiming an output directory. */
export function validateViews(views) {
  assert.ok(Array.isArray(views) && views.length, "Provide a nonempty array of named views");
  const names = new Set();
  for (const view of views) {
    assert.match(view.id ?? "", /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, "Unsafe view id");
    assert.ok(!names.has(view.id), "Duplicate view id");
    names.add(view.id);
    for (const key of ["position", "target"]) assert.ok(Array.isArray(view[key]) && view[key].length === 3 && view[key].every(Number.isFinite), `Invalid ${key}`);
    assert.notDeepEqual(view.position, view.target, "Camera must differ from target");
    assert.ok(["perspective", "orthographic"].includes(view.projection), "Specify projection");
    for (const key of ["fov", "viewHeight", "roll", "frameAspect"]) if (view[key] !== undefined) assert.ok(Number.isFinite(view[key]), `Invalid ${key}`);
    if (view.fov !== undefined) assert.ok(view.fov > 0 && view.fov < 180, "Invalid fov");
    for (const key of ["viewHeight", "frameAspect"]) if (view[key] !== undefined) assert.ok(view[key] > 0, `Invalid ${key}`);
    if (view.appearance !== undefined) assert.ok(["wireframe", "materials", "full-render"].includes(view.appearance), "Invalid appearance");
  }
}

/** Starts the native compiler while JavaScript owns browser automation only. */
async function startPreview(source) {
  const { executable } = await nativeCommand();
  const child = spawn(executable, ["preview", source], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
  let messages = "";
  let failure;
  child.stderr.on("data", bytes => { messages = (messages + bytes).slice(-16000); });
  child.on("error", error => { failure = error; });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const address = /Preview listening at (http:\/\/127\.0\.0\.1:\d+\/)/.exec(messages)?.[1];
    if (address) return { child, url: address };
    if (failure || child.exitCode !== null) throw failure ?? new Error(messages || "Native preview exited.");
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  child.kill();
  throw new Error(`Native preview startup timed out. ${messages}`);
}

/** Records captures only while the same accepted source and companion snapshot remains loaded. */
export async function captureLevel(source, output, views, options = {}) {
  validateViews(views);
  if (options.navigationCell !== undefined) throw new Error("Configure navigation sampling during native validation. Capture uses the compiled visual preview.");
  const file = resolve(source);
  const directory = resolve(output);
  const bytes = await readFile(file);
  await mkdir(resolve(directory, ".."), { recursive: true });
  await mkdir(directory);
  let server;
  let browser;
  const errors = [];
  const evidence = [];
  let identity;
  try {
    server = await startPreview(file);
    browser = await launchBrowser();
    const page = await browser.newPage({ viewport: { width: 1280, height: 1088 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    page.on("pageerror", error => errors.push(error.message));
    for (const view of views) {
      const aspect = view.frameAspect ?? 1.25;
      await page.setViewportSize({ width: 1280, height: 64 + Math.round(1280 / aspect) });
      const url = new URL(server.url);
      const settings = { camera: view.position.join(" "), target: view.target.join(" "), projection: view.projection, fov: view.fov ?? 55, "view-height": view.viewHeight ?? 20, roll: view.roll ?? 0, appearance: view.appearance ?? "full-render" };
      for (const [key, value] of Object.entries(settings)) url.searchParams.set(key, String(value));
      await page.goto(url.href);
      await page.waitForFunction(() => ["ready", "error"].includes(document.querySelector("#status")?.dataset.state), {}, { timeout: options.timeoutMs ?? 300000 });
      assert.equal(await page.locator("#status").getAttribute("data-state"), "ready", await page.locator("#diagnostics").innerText());
      await waitForFrames(page, 2);
      const response = await fetch(new URL("api/status", server.url));
      assert.ok(response.ok, "Native status is available");
      const status = await response.json();
      assert.equal(status.state, "ready", "Capture uses an accepted source revision");
      assert.equal(status.sceneSourceHash, hash(bytes), "Native preview compiled the requested source bytes");
      const accepted = JSON.stringify({ source: status.sceneSourceHash, companions: status.sceneAssetHashes });
      if (identity !== undefined) assert.equal(accepted, identity, "Inputs changed between captures");
      identity = accepted;
      assert.deepEqual(errors, [], "Browser errors during capture");
      const canvas = page.locator("#viewport canvas");
      await canvas.screenshot({ path: join(directory, `${view.id}.png`) });
      const state = await page.locator("#viewport").evaluate(element => ({ ...element.dataset }));
      assert.equal(Number(state.revision), status.sceneRevision, "Captured scene matches the accepted revision");
      evidence.push({ id: view.id, settings: view, url: url.href, state, canvas: await canvas.boundingBox() });
    }
    assert.equal(hash(await readFile(file)), hash(bytes), "Source changed during capture");
    await writeFile(join(directory, "loaded.aml"), bytes);
    const result = { ...JSON.parse(identity), sourceFile: file, views: evidence, errors };
    await writeFile(join(directory, "capture.json"), JSON.stringify(result, null, 2) + "\n");
    return result;
  } catch (error) {
    await writeFile(join(directory, "failure.json"), JSON.stringify({ message: String(error), errors }, null, 2));
    throw error;
  } finally {
    await browser?.close();
    server?.child.kill();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [source, output, manifest] = process.argv.slice(2);
  if (!source || !output || !manifest) throw new Error("Usage: node tools/capture-level.mjs SOURCE.aml NEW_OUTPUT VIEWS.json");
  const result = await captureLevel(source, output, JSON.parse(await readFile(manifest, "utf8")));
  console.log(JSON.stringify({ output: resolve(output), source: result.source, views: result.views.map(view => view.id) }));
}
