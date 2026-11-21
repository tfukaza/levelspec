import assert from "node:assert/strict";
import test from "node:test";
import { weedContacts } from "./weed-contacts.mjs";

test("roots use exposed masonry contacts and the receiver's actual paving datum", () => {
  const grounds = { id: "floor", rect: [0, 0, 22, 12], base: 1, top: 1.25,
    ground: true, jointSpacing: 0.45, jointOriginY: 0.19 };
  const base = {id: "wall", rect: [0, 4, 20, 5], base: 1.25, top: 3.5, wall: true};
  const suspended = {...base, id: "beam", base: 2.5, rect: [0, 8, 20, 9]};
  const options = {boxes: [grounds, base, suspended], excluded: [[3, 0, 7, 12]]};
  const roots = weedContacts(options);
  assert.deepEqual(weedContacts(options), roots);
  assert.ok(roots.some(p => p.id.startsWith("weed-wall-")));
  assert.ok(roots.some(p => p.id.startsWith("weed-joint-")));
  for (const root of roots) {
    const [x, y, z] = root.position;
    assert.equal(z, 1.25);
    assert.ok(x < 3 || x > 7);
    assert.ok(!root.id.startsWith("weed-beam-"));
    assert.ok(x > 20 || y < 4 || y > 5);
    if (root.id.startsWith("weed-joint-")) {
      const row = (y - 0.19) / 0.45;
      assert.ok(Math.abs(row - Math.round(row)) < 1e-8);
    } else {
      const distance = Math.hypot(Math.max(-x, x - 20, 0), Math.max(4 - y, y - 5, 0));
      assert.ok(distance >= 0.0399 && distance < 0.0661);
    }
  }
  assert.deepEqual(weedContacts({boxes: [base]}), []);
});
