import assert from "node:assert/strict";
import test from "node:test";
import { growthSites } from "../../../../superspec/tools/kowloon-export/vines/layout.mjs";

const post = { id: "pier", lo: [-0.25, 4.75, 0], hi: [0.25, 5.25, 3.25] };
const slab = { id: "pavement", lo: [-3, -5, -0.25], hi: [4, 6, 0] };
const beam = { id: "beam", lo: [-0.13, -4, 2.74], hi: [0.237, 4.85, 3.25] };
const structure = { boxes: [post, slab], beams: [beam] };
const body = { id: "planter-west-body-solid", lo: [-1.76, -0.7, 3.5], hi: [-1.5, 1.78, 4.72] };
const cap = { id: "planter-west-coping-solid", lo: [-1.795, -0.735, 4.72], hi: [-1.5, 1.815, 4.805] };
const bed = { lo: [-1.35, -1.85, 4.26], hi: [1.35, 1.85, 4.26] };

test("runner follows both surfaces and tapers into several distinct shoots", () => {
  const [site] = growthSites(structure);
  assert.deepEqual(site, growthSites(structure)[0]);
  const points = site.paths[0].points.map((s) => s.p);
  assert.ok(points[0][2] < 0.02);
  assert.ok(points.at(-1)[1] < 2);
  assert.ok(Math.abs(points.at(-1)[0] - beam.hi[0]) < 0.022);
  assert.ok(site.paths.some((p) => p.points.some((s) => s.n[1] < -0.9)));
  assert.ok(site.paths.every((p) => p.points.every((s) => s.p[2] >= 0 && s.p[2] < 3.25)));
});
test("same beam rotated 90 degrees and reversed accepts the physical bearing", () => {
  const rotate = (b) => ({ id: b.id, lo: [-b.hi[1], b.lo[0], b.lo[2]], hi: [-b.lo[1], b.hi[0], b.hi[2]] });
  const [site] = growthSites({ boxes: [post, slab].map(rotate), beams: [rotate(beam)] });
  assert.ok(site);
  assert.ok(site.paths[0].points[0].n.every((v, i) => v === [0, 1, 0][i]));
});
test("reject a separated bearing, missing ground or occupied growth envelope", () => {
  assert.deepEqual(growthSites({ boxes: [post], beams: [beam] }), []);
  assert.deepEqual(growthSites({ ...structure, beams: [{ ...beam, hi: [0.237, 4.65, 3.25] }] }), []);
  assert.deepEqual(
    growthSites({
      ...structure,
      boxes: [post, slab, { id: "obstruction", lo: [0.25, 4.73, 0.1], hi: [0.49, 5.26, 2.9] }],
    }),
    [],
  );
  assert.deepEqual(growthSites({}), []);
});
test("drape stays anchored in real soil and only crosses the paired coping", () => {
  const [site] = growthSites({ boxes: [body, cap], beds: [bed] });
  const trunks = site.paths.filter((p) => p.role === "root");
  assert.equal(trunks.length, 2);
  for (const path of trunks) {
    const first = path.points[0].p,
      last = path.points.at(-1).p;
    assert.ok(first[0] >= bed.lo[0] && first[0] <= bed.hi[0]);
    assert.ok(first[1] >= bed.lo[1] && first[1] <= bed.hi[1]);
    assert.ok(last[0] < body.lo[0]);
    assert.ok(last[2] < cap.lo[2] && last[2] > body.lo[2]);
  }
  assert.deepEqual(growthSites({ boxes: [body], beds: [bed] }), []);
  assert.deepEqual(
    growthSites({ boxes: [body, cap], beds: [{ lo: [-1.35, 6, 4.26], hi: [1.35, 8, 4.26] }] }),
    [],
  );
  assert.deepEqual(
    growthSites({ boxes: [body, cap], beds: [{ lo: [-0.2, -1.85, 4.26], hi: [1.35, 1.85, 4.26] }] }),
    [],
  );
});

test("forks meet resting runners and crowns rise inside the bed", () => {
  const [site] = growthSites({ boxes: [body, cap], beds: [bed] });
  const trunks = site.paths.filter((p) => p.role === "root");
  for (const shoot of site.paths.filter((p) => p.role !== "root")) {
    assert.ok(trunks.some((trunk) => trunk.points.some((s) => s.p === shoot.points[0].p)));
    if (shoot.role === "crown") {
      const tip = shoot.points.at(-1).p;
      assert.ok(tip[0] > bed.lo[0] && tip[2] > cap.hi[2] && tip[2] < cap.hi[2] + 0.12);
    }
  }
  for (const trunk of trunks) {
    const alongTop = trunk.points.slice(0, trunk.points.findIndex(({ p }) => p[0] < cap.lo[0]));
    const resting = alongTop.filter(({ p }) => p[0] < cap.hi[0] - 0.02 && p[0] > cap.lo[0] + 0.02);
    assert.ok(resting.length >= 4);
    assert.ok(resting.every(({ p }) => p[2] > cap.hi[2] && p[2] < cap.hi[2] + 0.009));
    assert.ok(
      trunk.points
        .filter(({ p }) => p[2] < cap.lo[2] - 0.1 && p[0] < body.lo[0])
        .every(({ p }) => body.lo[0] - p[0] < 0.04),
    );
  }
});
