# Finish R01 — independent visual review

## Decision

Keep the restored wall shelf, stronger shelf contact shading, muted bottles/jars/tins, and paler practical lights. The requested floor dirt is **not yet sufficiently visible**, particularly in the restaurant interaction view. Refine the new wall runoff as well: several strips read as blunt painted bars rather than accumulated liquid residue. These are current-pass corrections, not evidence that the whole concept match is complete.

Inspected the actual frozen `generated/storefront-study/finish-r01/{grocer,greengrocer,roast,shelf-wall,shelf-metal,register-customer}.png` captures. Compared the three full views with matched `patina-r05` captures and the active `concepts/industrial-daylight` references. Shelf closeup cameras differ from the earlier revision, so closeups establish local appearance rather than an exact pixel comparison.

## Required refinements

1. **Floor dirt is too inconspicuous.** The liquor center aisle still reads as a large smooth light-gray region, and the restaurant customer view shows uniform gray tile tops around the stools, tables, pantry, and service aisle. Fine broken rings are present near the restaurant threshold, but are either small, low-contrast, or hidden by fixtures at useful viewing distance. Add a limited number of larger irregular gray-brown spills and tracked scuffs at aisle edges and around dining-furniture feet. Keep a lighter worn path through the middle, but avoid leaving every exposed tile pristine. Small localized contact darkening beneath feet would also connect the furniture to this floor; the register has substantially stronger contact than the dining furniture.

2. **Wall runoff needs less geometric starts.** In `shelf-wall.png`, several trails above and behind the jars/bananas start as opaque rectangular brown bars with straight tops. They are visible detail, but read like applied polygons instead of liquid deposits. Taper their starts, break the outer edge, and vary local strength along the trail. A few broader faded origins feeding narrow broken tails would sit more naturally over the existing broad stains. Do not increase global wall darkness.

## What improved

- The wall shelf now has a visible front face and credible thickness. The dark underside and brackets make its support legible; the old paper-thin line is resolved. Exposed wood remains readable.
- Metal rack undersides and rail/post intersections have greater depth. Local dark contact bands are visible in the unobscured closeup, with stock labels still readable. Long front rails remain somewhat uniform, so future refinement could add a few asymmetrical worn patches or short dirt trails rather than darkening the entire rack again.
- Bottle and jar lids/labels and tin colors are visibly more restrained. The labels retain their designs and contrast. Saturated blue/green tea cartons remain a stronger color accent, but those were outside the clarified bottle/jar/tin request.
- Practical-light pools are paler and less orange, particularly the liquor aisle and produce checkout area. Daytime readability and cool exterior shadows survive; the scene has not become a nighttime treatment.
- Worn notices add a useful scale of wall detail, particularly near the produce checkout. No obvious floating paper edge, flickering overlap, or broken capture framing was visible in these images.

## Remaining concept gap

The concepts have richer changes of stock height, denser small objects, and more varied urban enclosure. The model remains an isolated rectangular shop bay. Those broad differences persist, but they do not justify ignoring the narrower floor/runoff corrections above. Tests and asset hashes establish implementation mechanics separately from this visual assessment.

## Evidence

- `generated/storefront-study/finish-r01/{grocer,greengrocer,roast}-reference-comparison.png`
- `generated/storefront-study/finish-r01/{grocer,greengrocer,roast}-before-after.png`
- `generated/storefront-study/finish-r01/roast-floor-detail.png` — enlarged crop of the actual overview, showing the faint threshold rings; no retouching.
- Reproducible composition helpers: `compare-daylight.mjs`, `compare-before.mjs` in the frozen output folder.

No production code was changed by this reviewer.
