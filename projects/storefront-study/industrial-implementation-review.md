# Industrial shop implementation review

Reviewed the production ceiling services, study facade, fixture-bound preview lighting, kitchen-metal material cutover, and focused test changes. This is an implementation review, not visual acceptance of the new concepts.

## Findings resolved

- The drain's first attempted wall-entry segment was too short for `PipeSystem.run`'s minimum elbow radius. The final endpoint at Y=.10 gives a .052 m setback, above the .0357 m required radius. The compile-time rejection was valid. The new grate receives the lower outlet; junction boxes now contain the previously exposed conduit ends.
- The curved roaster still derived its explicit UV repeat from `brushed-metal` after adopting `kitchen-metal`. The lookup now follows `kitchen-metal`, so authored material overrides cannot silently use the wrong scale.

## Current assessment

No unresolved implementation blocker found. Ceiling services stay within the declared upper/perimeter strip and use an independent random stream. The new test checks transformed containment, winding and unchanged physical geometry, including the low-ceiling threshold. Study facade additions use the existing header/pier area without changing floor circulation.

Each grocer tube and produce pendant now has an individual part name, preventing emitter discovery from combining separate lamps into one oversized bound. The viewer removes the hidden point-light grid and derives task sources from actual bulb/tube meshes for all three trades. The current study's fixture count remains small; this is a study preview lighting setup, not embedded GLB illumination or a general unbounded lighting budget.

Kitchen metal uses its own albedo/normal/properties maps. The physical-UV adapter retains the selected role through moves, naming and orientation, while the general brushed-metal finish remains the default for other consumers. The recipe has isotropic low-amplitude color/roughness variation and nearly flat normals, with no directional scratch field or baked lighting. Tests compare actual emitted geometry, UVs, normals and colors across finish roles and verify independently embedded PBR maps.

## Remaining visual review

Inspect the frozen render at shop scale and close-up: warm practical light against blue shadow fill, readable metal roughness without stripes, sign legibility, actual attachment contact, and fixture highlights. Code and test success do not establish that the current rectangular layouts match the fresh concept art; the new concepts introduce separate layout opportunities not implemented by this decorative pass.

## Walk-in produce and final detail follow-up

Reviewed `greengrocer.ts`, `market-backstock.ts`, their focused circulation tests, the split-canopy study envelope, and `industrial-r04/greengrocer.png`. The new layout is selected only at width >=3.6 m and depth >=4.6 m; smaller shops retain the previous arrangement. Two wall-side produce banks leave a continuous central passage, a 0.93 m rear crossover, and a connected staff space behind the front-left checkout. Actual rendered stock is grounded and the central approach reads clearly.

The route tests inspect actual triangle intersections under rotation/reflection, then shrink corridor rectangles by a 0.30 m body radius before checking connections. This is meaningful architectural clearance evidence. It is not physical navigation validation, because dressing does not add collision; the frozen build retains the preceding physical hash.

The kitchen material tests now additionally measure the actual roaster barrel at an authored 3.5 cycles/m, catching the prior stale-role lookup. The restaurant budget test isolates the accepted 2,870-triangle register while preserving the original ordinary-furniture allowance less the old 308-triangle register; this is a scoped budget change, not a blanket relaxation.

One final attachment correction was requested: the grocer's +0.14 m projecting-sign shift places the upper wall-end rail at Z=3.78 m, above the study header's Z=3.70 m top. Keep that rail inside the header or add an explicitly anchored backplate. The lower diagonal remains attached, but the upper connection is currently absent. Also update the greengrocer furnishing comment to describe both layout branches.

Follow-up: the grocer hanger offset is now +0.03 m; the upper rail fits below the header top. Attachment finding resolved.

## Room and shelf patina review

The initial add-only vertex-color approach had a demonstrated blocker: the appearance compiler replaces source vertex colors for raster/displaced receivers. Room wall patina and weathered-metal shelf shading therefore vanished during the final bake. The independent test reviewer added real `stainedPanel` and weathered-shelf compilation coverage, reproduced the failure, and verified the new integration passes.

The opt-in `SurfaceChart.postBakeTint(worldPoint, worldNormal)` hook resolves that source boundary. It multiplies the finished material color at final displaced vertices, preserved UV vertices, and receiver junction samples. Missing callbacks retain the prior exact color behavior; invalid RGB multipliers are rejected. Intrinsic raster maps and cache keys are unchanged. Seam bridges inherit already shaded owner colors, avoiding another multiplier application.

Room and shelf receiver wrappers compose existing post-bake callbacks and distinguish merge groups by placement and field settings. Direct geometry still receives one vertex tint at append time, while material receivers receive that tint once after baking replaces their input colors. Shelf stock shading replaces a nested shelf-frame approximation while retaining upstream room shading. Transparent/luminous kit roles and emitter parts bypass append shading.

Broad room triangles are split without changing their plane, winding, affine UV mapping, part ownership, or collision. Receiver ranges use the actual appended triangle count. Only the shop shell and furnishing pens carry the room proxy; exterior fascia, threshold framing and street displays continue through the original facade pen. New upper produce storage has wall-side cleats and diagonal brackets and remains outside the central circulation volume.

Implementation review found no remaining functional blocker after the callback fix. Final render review must judge the intended strong illustrated occlusion separately from physical AO and verify that shelf labels remain readable. The focused 11-test AO/integration suite and TypeScript passed according to the independent test reviewer; broader default receiver and explicit displaced-path regressions were requested after the core hook change.

Final validation follow-up: the independent test reviewer reports 28/28 passing across AO/furniture and existing reusable-material, receiver-binding, and raster-integration suites, plus the targeted displaced post-bake case and TypeScript. Reviewed the new displaced regression: it measures actual final positions/normals, proves multiplication exactly once over existing appearance tint, and asserts unchanged geometry, UVs and ownership. The real receiver integration additionally verifies identical generated raster hashes with and without placement shading. No unresolved functional blocker remains.

## Patina R04 independent implementation follow-up

Reviewed the broader room deposits and finer 0.25 m plain-shell interpolation, corrected greengrocer furnishing documentation, and the existing shop/post-bake integration. The new fields localize broad warm discoloration at an irregular tide height, sparse upper runoff, and base/ceiling accumulation. Exposed floor remains distinct from wall-adjacent floor. These are explicitly authored illustrative dirt/occlusion fields, not physically solved indirect lighting.

No new functional blocker was found. The change retains the copied-attribute subdivision contract, caller ownership, transformed room frame, excluded transparent/emissive append paths, survey bypass, and once-only composition through final material baking. Greengrocer documentation now describes both deep walk-in and compact frontage layouts. The opt-in compiler callback still leaves shared raster identity and the no-callback path unchanged.

The measured R04 study costs are 137,590 / 138,572 / 137,056 triangles for provisions / produce / roast. Relative to R03, finer interpolation adds 7,208 / 6,128 / 26,860 triangles; roast has many long narrow concrete grout strips as well as broad room planes. All three physical hashes remain unchanged. This is an explicit visual-quality cost in the art fixture, not evidence of a runtime speedup or a whole-building budget pass. Retain only if the visual comparison supports it; thin-strip sampling could be optimized separately after measuring its visual effect. Final darkness, stain character, and readability remain the fresh visual reviewer's responsibility. The independent test reviewer is rerunning the focused contracts on this field revision.

R05 follow-up resolves the narrow-strip cost: triangles with an altitude below 12 mm retain the previous 0.55 m spacing, while broad surfaces keep 0.25 m. The actual roast export falls to 117,940 triangles (19,116 fewer than R04); other trades retain their R04 counts, and all physical hashes remain unchanged. The altitude criterion recognizes slivers after splitting without relying on their longest side orientation. Existing midpoint interpolation continues to preserve winding, coverage and affine UVs.

The former hard wall-distance classification also becomes a smooth 20–120 mm transition, avoiding a visible tint jump where finish relief crosses the old 25 mm boundary. The independent regression reproduces the old failure and checks small depth changes across three wall normals, four heights and two seeds without prescribing the blend equation. The added narrow grout fixture verifies its area, bounds, winding and affine UVs under reflected placement without fixing subdivision counts. Reviewed both changes and tests; no remaining functional blocker. The independent test reviewer reports 7/7 focused room/shelf tests and TypeScript passing on R05. Final visual acceptance remains separate.
