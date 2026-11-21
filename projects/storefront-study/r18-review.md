# R18 independent visual review

## Evidence

Inspected the complete AI paintover target first: `projects/storefront-study/concepts/paintover-r13/roast-cutaway.png`. It is concept art, not a production render. Then inspected actual frozen R18 `roast-cutaway.png`, `roast.png`, `sources-combined.png`, and the daylight/fixture/combined source comparison under `generated/storefront-study/r18/`. The saved paired comparison is `generated/storefront-study/r18/roast-paintover-comparison.png`; no image retouching or color grading was applied. The source audit records model SHA `0f0e75a647c96bf9a1ca34fa49ffe89d4e53c2492b771a15359f2dfdc3a46dec`, six fixture sources, and no browser errors.

## Lighting verdict

The specific unmotivated center-counter issue is resolved in the diagnostic evidence: the countertop loses its strong pool in the daylight-only image, regains it in the fixture-only image, and the full interior visibly contains ceiling battens above that region. The lowered central lighting and reduced hood spill establish a more plausible hierarchy than an unexplained central key light. The center top is still conspicuous in the cutaway partly because it is a long light-wood surface with little interruption. That remaining compositional dominance is not proof of an invisible source.

The overall concept aesthetic is still not matched. R18 now has recognizable source causality and contact/cast shadows, but a limited point-light approximation to broad lamps and low ambient fill is not physically accurate global illumination. The almost black ceiling, shadowed shelf faces and sharp transitions remain much harsher than the target's warm, readable interior.

## Required concrete areas for improvement

1. **Front hanging ducks: shoulder highlights versus body midtones.** The street image and close interior show warm shoulders and necks with nearly white peaks, while torsos and legs remain dark brown. The target reads as continuous amber, glossy roast skin across the whole hanging row. The raised lamps give broader shoulder coverage, but do not yet reproduce that relationship. Next, evaluate a visibly modeled broader diffuser/reflector or area-emitter approximation for the display, keeping peak output low enough to preserve skin detail. Check the duck albedo and roughness under neutral illumination before trying to solve every dark body region with more light; material contribution is an inference, not verified by this screenshot review.
2. **Upper room and storage faces: missing readable indirect light.** In the full interior, the ceiling and large pantry faces fall into nearly featureless black while exposed horizontal worktops stay bright. Introduce bounded indirect-bounce treatment associated with the real fixtures and receiving surfaces, preferably baked or otherwise spatially constrained, then retain AO/contact at joints. Increasing an unoccluded global fill or adding hidden direct spots would not address this discrepancy cleanly. The target preserves dark corners while allowing shelf contents and equipment surfaces to read.
3. **Central peninsula: long bright empty strip.** Its top dominates the cutaway because the stock/small upper fixture occupy little of its long volume. Preserve practical chopping/plating space, but increase useful vertical storage and grouped supplies on the designated storage end so the wood strip is broken into working zones. This is primarily a density/layout refinement, not a remaining source-location bug.

Other conspicuous art gaps remain: the hood is a thin black box rather than a substantial sloped extractor; wall wear is sparse/repetitive against an even tile grid; the dark floor lacks the target's localized rubbed/reflected response. These are not hidden by passing lighting or geometry tests.

## Scope and capture caveats

The cutaway hides ceiling fixtures for inspection, so it must be paired with the unclipped interior/source images when assessing whether light is motivated. It also uses a more distant framing than the target; framing explains some apparent scale difference but not the observed empty surfaces or material/lighting gaps. Fixture counts and code tests are functional evidence only. This review accepts the correction of the unexplained center light, not whole-scene visual completion or full physical-light-transport accuracy.
