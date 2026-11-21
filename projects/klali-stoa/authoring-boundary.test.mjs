import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("the AML author can regenerate Stoa with access only to authoring inputs", async () => {
  const project = fileURLToPath(new URL(".", import.meta.url));
  const directory = await mkdtemp(join(tmpdir(), "stoa-aml-"));
  const output = join(directory, "scene.aml");
  try {
    execFileSync(process.execPath, [
      "--permission", "--allow-fs-read=" + project, "--allow-fs-write=" + output,
      "port.mjs", output,
    ], { cwd: project });
    const expected = await readFile(join(project, "scene.aml"), "utf8");
    assert.equal(await readFile(output, "utf8"), expected.replaceAll("\r\n", "\n"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
