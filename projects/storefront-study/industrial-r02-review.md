# Industrial R02 critical visual review

Reviewed 2026-11-12 by a fresh independent visual reviewer. This is a review of the actual frozen `industrial-r02` renders, not generated art presented as implementation.

## Evidence and decision

Active inspiration: `concepts/industrial-blue-fresh/{grocer,greengrocer,roast}.png`. These were generated from scratch to explore layout and mood; they are not dimensioned reconstruction targets. Actual captures: `generated/storefront-study/industrial-r02/{grocer,greengrocer,roast,register-operator}.png`.

**Do not accept R02 as matching the new atmosphere/layout brief.** It is a useful first material and industrial-detail pass. New signs, connected services, brackets, and cooler painted metal visibly improve the formerly blank fascia. The kitchen countertop no longer has the objectionable directional streaks. The decisive remaining gaps are the distribution of light, weak blue coloring on actual shadowed surfaces, and the unchanged common shop composition. Passing clearance and material-binding checks does not resolve those visible gaps.

Paired evidence, composed without image-content edits or crops:

- `generated/storefront-study/industrial-r02/grocer-reference-comparison.png`
- `generated/storefront-study/industrial-r02/greengrocer-reference-comparison.png`
- `generated/storefront-study/industrial-r02/roast-reference-comparison.png`
- Reproducible comparison script: `generated/storefront-study/industrial-r02/compare-critical.mjs`.

## Prioritized improvements

1. **Lighting needs broad illumination and cooler shadow surfaces.** In the liquor shop, the upper central rear shelving has a narrow bright amber patch while the left stock and fascia remain murky. In produce, a bright horizontal front-fruit band and the oval on the left wall contrast with dark upper tiers. The concepts show gradual warm pools across shelves, readable depths, and cooler side/recess/floor planes. The blue empty background is not evidence that the shop shadows are blue. Broaden the real fixture distributions, reduce local peak intensity, and rebalance blue skylight so underside/side/pavement planes acquire a restrained slate-blue tint without flattening contact shadows. Keep warm goods warm. This is the immediate required iteration.

2. **The quiet metal finish is better, but the weathering is not yet visibly established.** The register close-up shows an almost uniform ivory-gray counter with a broad soft highlight. Directional streak removal succeeds, but the requested slight stained/handled character cannot be identified in this capture. Add faint broad discoloration or a few irregular liquid tidelines, primarily in roughness, with a little stronger color modulation; keep normals nearly flat. Inspect under both the current grazing reflection and a neutral-light diagnostic. Do not restore scratch stripes or turn the surface into concrete. This is a refinement to the new finish, not a reason to revert it.

3. **The architectural variation is still largely a single kit arrangement.** All three renders share the same rectangular fascia, left hanging sign, top conduit line, upper-right rectangular duct, canopy profile, and jamb boxes. Their colors and lettering differ, but the reference set's offset entrances, unequal canopy heights, and different service silhouettes do not. The upper-right duct is especially boxlike compared with the concept's folded transition/elbow. Introduce at least two coherent exterior assembly variants: change sign and duct location/scale, split canopy heights, and vary a pier/recess/side attachment. Keep real brackets and termination details. This is a remaining architecture gap, not merely an extra-small-prop request.

4. **The fresh layout exploration has not been implemented, most clearly in produce.** Its current tiered stock mass occupies nearly the entire visible frontage, with only a narrow right-side aisle. The fresh concept makes a large inviting central route between two stock groups, revealing a rear door and useful depth. The liquor model likewise retains a broad open bay and centered gondola instead of the concept's recessed entry and asymmetric front sales area. The roast model retains the straight full counter and left-side dining strip instead of the new corner/angled case arrangement. These are separate layout decisions requiring measured circulation review; do not imply this pass has already adopted them.

5. **Surface age is too evenly coarse in places.** The signs and upper-right metal pieces have large, similarly sized pale chips, while the restaurant front tiles read as a soft uniform cloudy field. The reference concentrates darker runoff below seams, hardware, and sill edges with more quiet intact surfaces between. A later finish pass should localize wear to construction/use, reduce repeated coarse patches on small metal boxes, and preserve a little crisp staining at wet joints. More overall noise would worsen this discrepancy.

## Progress that should be retained

- Supported, readable trade signs add identity and useful vertical hierarchy.
- Pipe and conduit groups read as attached building services rather than loose decorative debris.
- Warm food highlights and colored crates retain their local color; there is no blanket blue albedo tint.
- Register and nearby counter contact remain legible; removed metal streaks are a clear improvement.
- Current screenshots are unobstructed and sufficiently matched for judging this pass. Differences from the fresh concepts are mostly actual arrangement/material/lighting differences, not camera defects. The isolated study lacks neighboring architecture and street context, so it cannot yet demonstrate the concepts' full urban atmosphere.

## Scope and uncertainty

This review does not certify circulation, fixture safety, or gameplay behavior from screenshots. No production source was edited. It identifies visible issues; attribution of the soft matte metal appearance specifically to map values versus environment lighting needs the suggested neutral/grazing diagnostic. The primary next capture should address lighting and metal before expanding all three room layouts simultaneously.
