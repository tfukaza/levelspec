import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { planterCover } from "./planter-cover.mjs";

test("central planter coping and body render against the same bounds used by game collision", () => {
  const scene = readFileSync(new URL("scene.aml", import.meta.url), "utf8");
  const { solid, props } = planterCover({ rect: [-1.5, -2, 1.5, 2], base: 3.5 });
  const attrs = (line) =>
    Object.fromEntries(
      [...line.matchAll(/([\w-]+)="([^"]+)"/g)].map(([, key, value]) => [key, value]),
    );
  assert.equal(solid.length, 4);
  assert.equal(props.length, solid.length);
  for (let i = 0; i < solid.length; i++) {
    assert.ok(scene.includes(solid[i]) && scene.includes(props[i]));
    const shape = attrs(props[i]),
      collider = attrs(solid[i]);
    assert.equal(collider.id, "masonry-" + shape.id + "-solid");
    assert.equal(collider.visible, "false");
    assert.equal(collider.collidable, "true");
    const [x, y, z] = shape.position.split(" ").map(Number);
    const west = shape.heading === "90";
    const w = Number(shape.width),
      d = Number(shape.depth),
      h = Number(shape.height);
    const projected = west ? [x - d, y, z, d, w, h] : [x, y, z, w, d, h];
    const physical = [
      ...collider.position.split(" "),
      collider.width,
      collider.depth,
      collider.height,
    ].map(Number);
    assert.deepEqual(
      projected.map((v) => +v.toFixed(4)),
      physical,
    );
    assert.ok(z >= 3.5 && z + h <= 4.81);
    // Retain the full northern and eastern approaches to the raised bed.
    assert.ok(physical[0] + physical[3] <= 1.5 && physical[1] + physical[4] < 2);
  }
});
