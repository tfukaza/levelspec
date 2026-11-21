# Storefront fidelity review — r01

Independent source-first visual review of the frozen `generated/storefront-study/r01` renders. This is a baseline, **not accepted as a close reference match**.

## Evidence and method

Source concepts: `projects/kowloon-reference-building/concepts/storefronts/reference-storefront.png`, `produce-grocer.png`, and `beijing-roast-duck.png`.

Inspected all original concepts first, then the three full renders and paired images. Run `node projects/storefront-study/compare.mjs r01` to reproduce the comparison images. Each comparison preserves the complete images at equal panel dimensions, without cropping or retouching. `comparisons.json` records input paths and operation; the frozen build/capture manifests identify actual geometry.

## Source-only observations

- All three references show a street-height shop embedded in a continuous heavy building. A low faded red/cream awning, narrow dark-green framing, exposed conduits, charcoal lower plaster, rubbed threshold, and a left neighboring accordion gate form the common shell. Dirt occurs at contacts, lower walls, drips and handled surfaces; the cream field remains visibly aged between larger areas of peeling.
- Provisions: narrow center-right entry; stacked crates and cartons at left; a tall open wire rack at right; several deep banks of densely packed bottles, tins and small packages. Bulk cartons occupy upper/deeper storage rather than dominating every shelf. Small fluorescent fittings illuminate a generally dim interior.
- Produce: relatively few broad, overfilled vegetable groups on an irregular stepped display; tall front support crates; loose leafy silhouettes; banana bunches, a hanging scale, stocked shelves behind and along the aisle. The right aisle remains readable.
- Duck: a left service doorway and a broad glazed case on the right, nearly reaching the shop head. Large glossy amber ducks occupy much of the glass height. The serving sill carries chopping block, trays and stacked crockery; shelves and cookware remain layered behind. Warm lamps establish localized amber highlights.
- Exact dimensions and hidden back rooms are unknown. The concepts establish visible composition and material character, not surveyed architecture.

## Shared repairs, in priority order

1. **Match framing before judging fine detail.** In r01 the shell is a small isolated diorama with substantial beige margins, while the reference storefront nearly fills the image. The current camera also exposes a noticeably larger side/perspective effect. Move closer and slightly more frontal; crop at the upper building continuation and include only enough pavement for the curb. Preserve a repeatable camera after calibration. This is a camera/context mismatch, not evidence that every prop needs enlargement.
2. **Rebuild the awning's reading.** The current deeply repeated corrugations and thick folded skirt resemble stiff brown sheet material. References show a shallow, sagging canvas sheet with flatter red/cream bands, a thin scalloped hem, restrained random rippling, support rods, and localized abrasion. Reduce fold amplitude/depth and valance bulk; make the stripe pigments faded dusty red and dirty cream. The dominant brown must not come from a wood-like material field.
3. **Replace uniformly pristine fields with layered wear.** Large peeling patches occur on the outer beam, but walls inside, lower plinth, and pavement remain unusually uniform. Add small/medium stains between large flakes, lower-wall dark tide marks, greasy joins, scuffs at openings, jointed pavement/curb and worn threshold. Avoid simply increasing giant peel coverage. The references are dirty across several scales, not only dramatically peeled on one top strip. Darken broad interior bounce and use localized fluorescent/task light so depth remains legible.

## Provisions / liquor: three highest-impact repairs

1. **Change the frontage silhouette and entrance.** The long low row of evenly spaced sacks across the opening reads as a barrier; the broad counter dominates the right half and the fridge dominates the left. Replace some front floor sacks with left-side tall red/green crate/carton stacks and a tall narrow stocked rack at the right jamb; retain a narrow visible entry and layer side shelving deeper into the room. A few sacks are appropriate, but the target is a crowded bottle/tin shop.
2. **Change shelf content ratios and packing.** R01 is primarily a tidy brown grid of shipping cartons with occasional tins. The reference is predominantly many small bottle/tin facings, stacked packs and jars with small uneven gaps; cartons are concentrated at top/back. Fill vertical space between boards, increase bottle/tin groups, and break long identical-height shelf runs with a few supported stacks. Dense clutter should retain sensible product groupings.
3. **Move the brightest colors into small labels and aged fixtures.** R01's red pendant, bright hanging packet band, shiny brown counter and pale fridge separate as clean hero assets. Desaturate these large accents, add dark-green/rust frame wear, reduce the packet band to selected front zones, and let warm fluorescent highlights pick out small stock against darker recesses. Add the left hanging cloth/bag cluster and handtruck only after these larger composition changes.

## Produce: three highest-impact repairs

1. **Increase product mass and reduce the miniature tray-grid effect.** R01 has many small shallow trays with modest contents on a continuous polished timber staircase. The reference has fewer broad displays that are heaped high, with tall stacked crates supporting the front edge and leaf/root silhouettes overlapping their rims. Retain coherent per-crate colors but mute their saturation and add produce that occupies the available volume. Coordinate these changes with the produce-model agent.
2. **Fill the upper/back room with meaningful storage.** The empty cream side/back wall above boxes is a major density gap. Add tightly stocked back/side pantry shelves, upper cartons, and a few suspended dried goods. Preserve the right aisle and deepen its occlusion. The scale should sit prominently at the display/aisle junction; the current small blue wall-edge dial has weak presence.
3. **Correct overhead hierarchy and material age.** The reference has substantial banana bunches and modest fluorescent fittings, whereas r01 shows tiny separated bunches and four vivid red lamps spanning the opening. Enlarge/group bananas realistically, reduce the dominance of pendants, stain the aisle floor, and give support crates/boards the same dirty, rubbed character as the front containers. Do not darken fresh produce uniformly to create grime.

## Roast duck: three highest-impact repairs

1. **Correct case composition and doorway side.** R01 puts a low partial case over the left/center counter and an opening on the right. The reference has a clear left doorway and a high broad glazed display on the right, integrated under the opening head. For this reference study select the mirrored arrangement, extend case frame/glass upward and across the serving counter, and provide a worn green door/frame to anchor the entrance. The current open wall gap over the case undermines the enclosed display reading.
2. **Make the hanging birds the focal mass.** R01's many small birds occupy a narrow strip and read closer to small chickens. The reference has fewer, substantially taller whole ducks with visible necks, wings and dangling legs, deep amber skin and glossy highlights. Increase actual silhouette length/body mass, not only count; fit hooks above and trays below without intersections. The reference birds span roughly half the useful glass height, while r01 leaves much of that band empty.
3. **Build the counter/workroom layering and warm contrast.** Large dark oven shapes compete with the birds and the long counter surface looks thinly dressed. Prioritize block, shallow meat trays, stacked bowls/plates and small sauce jars along the sill; place larger cookware behind. Shift the clean aqua tile stripe toward aged ivory with brown grease at grout/base, rubbed stainless edges and warmer localized display lights. The reference contains amber reflections against a shaded room; current diffuse illumination flattens this contrast.

## Acceptance status and next comparison

The silhouettes, stock ratios, and shell material scale remain too far from the concepts for acceptance. Next pass should fix the common camera/awning/wear treatment and one principal layout defect per shop, then repeat the frozen render/pair/review cycle. Fine labels or extra loose objects alone will not close the present gap. This review assesses the supplied front view only; it does not certify hidden support, other elevations, collision, navigation, or runtime cost.
