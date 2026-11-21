# Finish R03 — independent visual review

## Decision

Keep this scoped pass. The wall shelf has a solid visible front and dark supported underside, the metal rack has clearer contact bands, cans/bottles/jars retain quieter colors, and the practical lights remain pale without losing daylight readability. R03 also resolves the conspicuous blunt wall-runoff starts from R01 and makes floor wear visible in the shop overviews. This is progress on the requested surface treatment, not an exact match to the concept art.

Inspected the frozen `generated/storefront-study/finish-r03/{grocer,greengrocer,roast,shelf-wall,shelf-metal,register-customer}.png` captures, the corresponding R01 views, and the three active `concepts/industrial-daylight` references. Reference/render and matched overview comparisons are saved beside the captures.

## Concrete remaining improvements

1. **Floor residue needs more material variation.** The larger marks are now visible at the liquor and restaurant thresholds, but several filled stains read as flat opaque beige cutouts. The liquor front-center patch is especially conspicuous against an otherwise smooth floor. Break up the fill and its edge with fine mottling or partially retained underlying floor color; on the restaurant floor, retain some tile/grout continuity through a dried spill. Keep the current wider distribution rather than returning all dirt beneath fixtures. The customer closeup now includes residue in the aisle, although most visible tile tops are still relatively uniform.

2. **Dining furniture contact remains weaker than the register contact.** In the customer closeup, the register sits in a strong local shadow while stool and table feet have softer, less specific grounding. Small contact darkening at actual foot locations would improve this more than another room-wide darkness increase. This should be localized and should not turn each stool into a large black puddle.

3. **Metal front rails still have a regular finish rhythm.** The closeup shows darker intersections and underside depth without hiding labels. Longer rail midspans remain fairly uniform. A few asymmetrical rubbed sections or short deposits beside selected joints would add handling history; retain brighter exposed edges and avoid darkening the entire frame again.

## Improvements verified visually

- Wall runoff in the upper produce shelf view is narrower, interrupted, and tapered. The former obvious rectangular starts above the jars and bananas are no longer the dominant detail. Broad wall stains, small traces, and worn notices now provide several scales of wear.
- The restored wall-board front reads as a real plank, and the brackets visibly connect beneath it. No new floating paper edge or obvious decal seam appears in the inspected views.
- Floor spills and tracked marks now extend into visible threshold and aisle-edge areas. R01's nearly spotless floor impression is reduced; the center remains clearly navigable as an image, without implying tested physical navigation.
- Bottle/jar/tin colors remain restrained while printed designs and pale labels remain identifiable. The brighter tea-carton blues and greens were outside the clarified recoloring scope.
- Pale lamp pools and cool exterior shadows remain consistent across all three shops. The revision has not become a nighttime treatment.

## Broader limits

The concepts have richer irregular architecture, more varied stock heights, and denser incidental detail. The current model remains an isolated rectangular bay. These are inspiration comparisons, not calibrated reconstructions, and code tests do not establish visual fidelity.

Evidence: `generated/storefront-study/finish-r03/{grocer,greengrocer,roast}-reference-comparison.png` and `*-before-after.png`; reproducible Sharp helpers `compare-daylight.mjs` and `compare-before.mjs` are stored in that directory. This reviewer changed no production source.
