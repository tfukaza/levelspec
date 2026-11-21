import { readFile, realpath, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = fileURLToPath(new URL("../", import.meta.url));

/** Verifies source and distribution identity before selecting any implementation artifact. */
export async function verifyEngine({ allowOverride = true } = {}) {
  const pinPath = resolve(repository, "superspec.lock.json");
  let pin;
  try {
    pin = JSON.parse(await readFile(pinPath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read SuperSpec pin ${pinPath}: ${error.message}`);
  }
  if (pin?.schemaVersion !== 1 || typeof pin.path !== "string" || !pin.path
      || typeof pin.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(pin.sha256)) {
    throw new Error(`Invalid SuperSpec pin ${pinPath}.`);
  }
  const root = resolve(repository, allowOverride && process.env.SUPERSPEC_ROOT || pin.path);
  let distribution;
  let actual;
  try {
    distribution = JSON.parse(await readFile(resolve(root, "superspec.manifest.json"), "utf8"));
    const { sourceManifest } = await import(pathToFileURL(resolve(root, "tools/source-manifest.mjs")).href);
    actual = await sourceManifest();
  } catch (error) {
    throw new Error(`Cannot verify SuperSpec at ${root}: ${error.message}`);
  }
  if (distribution?.schemaVersion !== 1 || distribution.sha256 !== pin.sha256
      || actual?.sha256 !== pin.sha256) {
    throw new Error(`SuperSpec at ${root} differs from the pinned source distribution. Review the source changes and update the distribution manifest and LevelSpec pin together.`);
  }
  return { root, sha256: actual.sha256 };
}

/** Selects the pinned SuperSpec native executable. */
export async function nativeCommand() {
  const engine = await verifyEngine();
  const executable = process.env.RUST_CLI
    ? resolve(process.env.RUST_CLI)
    : resolve(engine.root, `target/release/superspec${process.platform === "win32" ? ".exe" : ""}`);
  await requireFile(executable, "Build the SuperSpec native CLI before running this command.");
  return { ...engine, executable };
}

/** Selects the same distribution's authoring CLI while allowing an explicit built artifact. */
export async function studioCommand() {
  const engine = await verifyEngine();
  const directory = process.env.RUST_CLI ? dirname(resolve(process.env.RUST_CLI)) : resolve(engine.root, "target/release");
  const executable = process.env.STUDIO_CLI ? resolve(process.env.STUDIO_CLI)
    : resolve(directory, `superspec-studio${process.platform === "win32" ? ".exe" : ""}`);
  await requireFile(executable, "Build the SuperSpec authoring CLI before running this command.");
  return { ...engine, executable };
}

/** Rejects an absent artifact before starting its consumer. */
async function requireFile(path, instruction) {
  let available = false;
  try {
    available = (await stat(path)).isFile();
  } catch (error) {
    if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
  }
  if (!available) throw new Error(`Missing SuperSpec artifact ${path}. ${instruction}`);
}

/** Preserves argument boundaries, terminal ownership and the child command's exit status. */
async function execute(command, args, cwd) {
  return await new Promise((accept, reject) => {
    const env = { ...process.env };
    if (env.RUST_CLI) env.RUST_CLI = resolve(env.RUST_CLI);
    if (env.STUDIO_CLI) env.STUDIO_CLI = resolve(env.STUDIO_CLI);
    const child = spawn(command, args, { cwd, env, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code, signal) => accept(code ?? (signal === "SIGINT" ? 130 : 1)));
  });
}

/** Routes harness commands through the verified implementation without an implicit local fallback. */
async function main([command, ...args]) {
  if (command === "run" || command === "studio") {
    const { executable } = await (command === "studio" ? studioCommand() : nativeCommand());
    return await execute(executable, args, process.cwd());
  }
  const engine = await verifyEngine({ allowOverride: command !== "test-harness" });
  if (command === "verify") {
    console.log(`SuperSpec ${engine.sha256}`);
    return 0;
  }
  if (command === "root") {
    console.log(engine.root);
    return 0;
  }
  if (command === "test-harness") {
    if (await realpath(engine.root) !== await realpath(resolve(repository, "../superspec"))) {
      throw new Error("The Cargo harness requires the pinned engine at sibling ../superspec, matching its path dependencies.");
    }
    return await execute(process.env.CARGO || "cargo", ["test", "--manifest-path", resolve(repository, "Cargo.toml"), "--locked", ...args], repository);
  }
  if (command === "npm") {
    const [script, ...forwarded] = args;
    const supported = new Set(["dev", "dev:rust", "check", "test", "build:viewer", "build:rust-ui", "test:rust:packet", "test:rust:browser", "test:preview:browser", "test:export:browser", "test:studio:browser"]);
    if (!supported.has(script)) throw new Error(`Unsupported SuperSpec npm script ${script ?? "(missing)"}.`);
    if (["dev", "dev:rust", "check", "build:viewer", "build:rust-ui", "test:export:browser"].includes(script)) {
      await requireFile(resolve(engine.root, "generated/wasm/superspec_wasm.js"), "Build SuperSpec Wasm first.");
      await requireFile(resolve(engine.root, "generated/wasm/superspec_wasm_bg.wasm"), "Build SuperSpec Wasm first.");
    }
    if (["test", "test:rust:packet", "test:rust:browser", "test:preview:browser", "test:export:browser", "test:studio:browser"].includes(script)) {
      await nativeCommand();
    }
    if (script === "test:studio:browser") {
      await studioCommand();
      for (const page of ["material.html", "item.html"]) {
        await requireFile(resolve(engine.root, "generated/rust-editor", page), "Build the SuperSpec studios first.");
      }
    }
    if (["test:rust:browser", "test:preview:browser"].includes(script)) {
      await requireFile(resolve(engine.root, "generated/rust-editor/preview.html"), "Build the SuperSpec reviewer first.");
    }
    const npmArgs = ["run", script];
    if (forwarded.length) npmArgs.push("--", ...forwarded);
    if (process.env.npm_execpath) {
      return await execute(process.execPath, [process.env.npm_execpath, ...npmArgs], engine.root);
    }
    if (process.platform === "win32") {
      throw new Error("Invoke this script through LevelSpec's npm commands so npm's executable is explicit.");
    }
    return await execute("npm", npmArgs, engine.root);
  }
  throw new Error("Usage: node tools/superspec.mjs verify|root|run|studio <CLI arguments>|npm <script>|test-harness");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
