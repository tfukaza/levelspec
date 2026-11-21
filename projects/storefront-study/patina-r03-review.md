# Patina R03 — independent visual review

## Decision

The new shelf shading and denser produce banks improve the shops, but **the whole-room grime request is not yet visually satisfied**. The roast shop's broad tiled walls still look much cleaner than its counter skirt, and the produce shop's left wall remains a largely smooth gray plane. Keep the shelf changes and produce density. Make a targeted room-surface pass before treating this as visual completion.

This review compares the actual frozen `generated/storefront-study/patina-r03/{grocer,greengrocer,roast}.png` captures with the active from-scratch `concepts/industrial-daylight/` references and actual `industrial-r04` captures. It also inspects `patina-r03/register-operator.png`. Appearance is assessed separately from circulation/collision tests.

## Prioritized improvements

1. **High — distribute grime across the restaurant room.** In the roast capture, the left wall above the green dado (roughly x390–690, y365–565) and rear cream tiles behind the ducks remain a broad, regular, lightly shaded grid. The counter's front has conspicuous brown/gray staining, so the clean walls now stand out more. Add irregular brown/gray tide deposits and occasional vertical runoff to the tile field; add localized grease/soot above and around the rear cooking work zone, plus stronger dirt where the wall meets the floor and ceiling. Preserve the cream tile color in exposed areas. A uniform darkening would reduce readability without creating the accumulated grime visible in the concept.

2. **Medium — give the produce left wall purposeful surface wear.** The added upper shelf and fuller side bank fix much of R04's empty volume. Between the checkout and hanging scale, however, the wall still reads as a smooth gray panel. Add broad low-contrast water staining, dirt below the shelf/brackets, and stronger corner/base buildup. Keep a lighter worn central walking path; do not recover density by filling that passage.

3. **Medium — check floor transition quality at closer range.** Liquor and produce still show abrupt planar-looking floor regions at the threshold and beneath the fixtures. Some are legitimate cast shadows and some already appear in industrial-r04; these screenshots do not prove that the new AO tessellation caused them. Inspect the room field in isolation or under diffuse light before changing it. Any AO transition should be smooth over its intended falloff, with irregular deposits layered separately. Do not blur the real cast shadows to hide the distinction.

4. **Remaining art gap — rear liquor practical hotspot and repeated stock rhythm.** The rear top shelf is a concentrated warm patch while the long left bank is subdued. The concept has more distributed readable stock and a richer rhythm of package heights. Keep the strong shelf cavities, but avoid further global blackening. A future local light/stock pass should redistribute warmth through modeled fixtures and vary product groups. This is secondary to the current room-grime requirement.

## What improved

- Shelf backs and the contact beneath stock now read much darker, particularly in the liquor rear bank and produce rear shelves. Front edges and label colors remain distinguishable. The open island retains more light than closed-backed shelves, which is a useful distinction.
- Produce now has fuller stepped banks, supported upper storage, and a visible central route. The broad empty volume criticized in R04 is substantially reduced. It is still less saturated with merchandise than the concept, but the density/circulation tradeoff is better.
- Daylight and blue-gray exterior shadows remain legible. The pass has not turned the scene into night. Warm practical light remains concentrated on merchandise and work areas.
- The kitchen counter closeup no longer reads as a strongly directional brushed-noise surface. Its color is quiet and the register is grounded by contact shading. Subtle weathering is not especially prominent in this single reflection angle, so this image supports removal of the old streakiness more strongly than it proves nuanced roughness variation.
- Room edges are darker than R04, but the change is more visible as shading than as brown liquid dirt. That distinction matters for the latest user request.

## Scope and limitations

No clipping or broken framing prevents review. Concept and model layouts/cameras differ, so these are art-direction comparisons, not pixel matches. The model remains an isolated rectangular bay, whereas the concepts include layered surrounding architecture. That broader gap is real but should not distract from finishing the current room treatment. No production source was changed by this reviewer.

## Evidence

- `generated/storefront-study/patina-r03/grocer-reference-comparison.png`
- `generated/storefront-study/patina-r03/greengrocer-reference-comparison.png`
- `generated/storefront-study/patina-r03/roast-reference-comparison.png`
- Reproducible composition helper: `generated/storefront-study/patina-r03/compare-daylight.mjs`
- Before captures: `generated/storefront-study/industrial-r04/{grocer,greengrocer,roast}.png`
- Counter closeup: `generated/storefront-study/patina-r03/register-operator.png`
