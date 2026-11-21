# Shelf patina R01 — independent visual review

## Decision

The wall brackets are visibly better grounded and the metal rack is slightly darker, with readable stock and useful underside depth. **The wall board's missing visible front face prevents acceptance of that shelf, and the metal rack's grime remains too subtle on the exposed frame.** Keep the localized direction, correct the board face, and strengthen selected metal joint deposits rather than dimming the entire fixture again.

This review inspected actual `shelf-patina-r01` produce/liquor overview captures, matched wall/metal closeups from `patina-r05` and `shelf-patina-r01`, and the active `industrial-daylight/greengrocer.png` concept. The matched captures retain viewpoint and lighting, so local material changes can be distinguished from exposure changes. Functional test results are separate evidence.

## Concrete improvements

1. **High — restore the wall shelf's visible board face.** In `shelf-wall.png`, the long support under the jars reads as a nearly paper-thin horizontal line. The brackets appear to support a sheet rather than the intended substantial timber plank. Restore the front-facing surface, then verify its grain, depth, and darker underside in the same camera. The parent identified an omitted face in the source; the image independently supports the thin/incomplete appearance.

2. **Medium — make metal connection grime legible.** The upper exposed horizontal rails and central upright in `shelf-metal.png` remain long, unusually uniform blue-gray bands. Compared with the baseline, they are a little darker, but brown deposits and short runoff near the intersections are difficult to read even at close range. Increase the contrast of selected rail/post contact collars and a few short gravity streaks, preserving cleaner midspans. Do not use broad orange rust, all-over speckling, or another uniform neutral darkening. The reference's worn metal reads through localized material breakup and accumulated joints.

3. **Capture improvement — expose the lower rack for a diagnostic view.** The bright foreground fruit tray hides much of the lower metal shelf. It is legitimate scene content, so the overview should retain it, but an additional side or higher closeup would better verify lower feet and base contact shading. This occlusion does not invalidate the visible upper-frame findings.

## What works

- Wall brackets and rear cleats are noticeably darker than the baseline, especially their wallward portions and underside joints. They now read more attached to the room.
- Metal shelf undersides have strong depth without blackening the product labels. The rear wall remains visible through the open rack, unlike a solid cabinet.
- Stock colors, the warm produce lights, and daylight balance remain intact. No new seam or obvious shading discontinuity is visible in these captures.
- The changes are subtle at full shop scale, which is preferable to indiscriminately darkening the whole interior, but it means the remaining visible frame wear needs to be more purposeful.

## Evidence

- `generated/storefront-study/shelf-patina-r01/shelf-wall-comparison.png`
- `generated/storefront-study/shelf-patina-r01/shelf-metal-comparison.png`
- `generated/storefront-study/shelf-patina-r01/greengrocer-reference-comparison.png`
- Reproducible composition script: `generated/storefront-study/shelf-patina-r01/compare-shelves.mjs`

The concept remains art-direction inspiration, not a pixel-aligned reconstruction target. This review does not assert physical AO accuracy, collision changes, or runtime performance.
