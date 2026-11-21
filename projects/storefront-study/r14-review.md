# R14 independent visual review

Status: **Does not yet match the active visual brief.** The new shadow/AO treatment makes a visible difference, but the rear-wall artifact, sparse work area, and broad lighting/material mismatch remain conspicuous required work, not optional polish.

Reviewed the active reference first, followed by complete frozen captures and the generated pair:

- Target: `projects/storefront-study/concepts/paintover-r13/roast-cutaway.png` (AI paintover, not a model screenshot).
- Actual: `generated/storefront-study/r14/roast-cutaway.png` and `roast.png`, each 1536 × 1024.
- Lighting evidence: `generated/storefront-study/r14/lighting-comparison.png`, 2400 × 948.
- Reference/render pair: `generated/storefront-study/r14/roast-paintover-comparison.png`, generated using `generated/storefront-study/r14/create-review-comparison.mjs` with Sharp. Full images, equal panels, preserved aspect, no crop/retouch/relighting. Provenance is in `paintover-comparison.json` beside the pair.

The cutaway camera is steeper and the shop occupies less of its frame than the target. The pair is therefore diagnostic, not a registered geometric comparison. This does not explain the missing objects or different material/light behavior below.

## Required improvements, in priority order

1. **P1 — Rear tiled wall: remove the large triangular black corruption before visual acceptance.** In `roast.png`, repeated black triangular wedges cover much of the tile wall behind the central shelf, ducks, and cooker. Smaller wedges are also visible near the top of the cutaway wall. Their regular sliced form reads as a rendering/geometry defect rather than grime or cast shadow and dominates the front image. Inspect overlapping wall/shell faces and shadow/depth behavior in isolation; eliminate duplicate/coplanar surfaces if demonstrated, then verify both front and cutaway captures. The screenshot demonstrates corruption, but cannot establish its underlying cause.

2. **P1 — Central work island and storage: restore the target's occupied volume and useful clutter.** The actual central worktop is a long, nearly empty brown surface; the raised shelf has one modest steamer stack and largely empty cubbies. The target has multiple tall bamboo steamer stacks, densely stacked dishes, tins, bottles, work trays, and larger countertop equipment. The actual right-side tall shelf also presents a large flat wooden back that hides the work side rather than the target's readable stocked edge. This leaves the model visibly sparse and changes the composition even after accounting for the camera. Add grouped steamer stacks at different heights, dish stacks in the open shelf bays, and a coherent prep cluster with metal containers/trays on the island. Give the right shelf a readable stocked face from the review camera, or choose a matching camera before deciding whether its geometry must change. Preserve actual circulation; this review is not a navigation finding.

3. **P1 — Lighting/material hierarchy: replace white wall hotspots with warm task illumination that actually reaches food and work surfaces.** The target concentrates amber highlights on the ducks, front chopping block, steamers, hood edges, and cooking area, with dark warm recesses. R14 instead shows large pale circular wall pools, an almost uniformly pale tiled wall, gray front worktop/food area, and broad dull floor shading. The front display has lamps, but it does not visibly carry the target's warm focal emphasis. Aim the task lights at the duck row and counter, tune warmth/intensity against the actual camera, and reduce broad fill only enough to retain shadow separation. Verify that the food remains legible through glass. Add localized grease/darkening and appropriately rough metallic highlights to the hood/cooking equipment; increasing AO globally will not reproduce these surface responses.

4. **P2 — Wear scale and floor response: replace isolated large paint chips and broad sidewalk streaks with smaller, spatially motivated wear.** The target has dense edge wear and grease around work zones, dark joints, and restrained warm worn/wet floor reflections. Actual green wall wear is sparse and fairly uniform, while the exterior floor reads as large blurred dark strips. Add finer clustered wear around lower edges, openings, and cooking locations, and vary floor roughness locally so task-light reflections have a plausible surface to reveal. Do not blanket the wall with noise or use the current black triangles as a dirt effect.

## Shadow and AO assessment from visible evidence

The lighting A/B demonstrates real improvement. On the right, table tops project recognizable shadows onto the green wall and floor; stools have darker grounding at their feet; the rear shelf sits more firmly against the wall; and small condiment groups are less disconnected from their tabletops. These effects are visible, not inferred from enabled flags.

The combined treatment still has relatively hard, block-like table shadows and broad dark floor regions. The paintover has more varied local light, smaller contact creases, deeper stocked recesses, and brighter warm highlights adjoining those shadows. Match that distribution by tuning light size/shadow softness and adding the missing loaded shelf surfaces before raising AO strength. Keep tight prop contact shading at feet, plate contacts and shelf junctions, and use real wall/floor receivers for changing scene shadows, consistent with the requested hybrid direction.

Both A/B panels retain baked prop shading, so this comparison cannot establish how much of the improvement comes from the baked component or whether that component is physically baked AO versus another vertex/contact approximation. A camera orbit and isolated baked-on/off diagnostic would be needed to assess stability and separate those contributions. The provided stills support visible grounding improvement, not a claim that the full baking approach is complete or physically verified.

Composition, recognizable shop organization, tile scale, stool/table silhouettes and roast display are established. Density, warm material response, grounded details and coherent wall rendering remain below the target. Functional tests, asset counts, and circulation evidence are separate from this visual judgment.
