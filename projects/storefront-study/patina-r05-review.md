# Patina R05 — independent visual review

## Decision

**Keep this revision as a substantive improvement to the whole-room grime and fake-AO pass.** Unlike R04, the restaurant's left tiled wall now has visible brown deposits at ordinary storefront distance, and the produce checkout wall no longer reads as a uniformly clean gray plane. Shelf recesses remain strong, product fronts remain readable, and the scene still reads as daylight. This is progress toward the requested illustrated interior treatment, not a complete match to the concepts.

The new room treatment is visibly localized: darker room edges, ceiling junctions and lower walls coexist with lighter walking areas and merchandise. It is not merely a uniform reduction in exposure. The current strength is sufficient to evaluate the dirt pattern itself; increasing global darkness further would be counterproductive.

## Concrete improvements still needed

1. **Medium — break up the airbrushed wall deposits.** On the roast left wall above the green dado, particularly the broad brown patch between the menu sheets and rear pantry cabinet, the new staining reads partly as a soft smoky shadow. The produce wall below the upper shelf has the same broad cloudy quality. Preserve the present broad underlayer, but add a small number of narrower vertical runoff trails and irregular broken tide edges. Keep some exposed cream/gray patches between deposits. This would make the dirt read as water and accumulated residue rather than simply shaded paint; another blanket darkening would not address it.

2. **Medium — strengthen selected floor contacts.** In `register-customer.png`, the register has convincing local contact shading, but several stool and table feet in the dining area sit on relatively uniform tiles with weaker contact. Small localized contact deposits beneath those supports would better connect the furniture to the now-dirtier room. Avoid a continuous black band under the entire dining area and keep the walking passage lighter.

3. **Remaining broader art gap — stock and light rhythm.** The liquor rear bank still has a concentrated warm hotspot while the long left bank is comparatively subdued and regularly spaced. The references have more variation in group heights and more distributed readable product fronts. Do not deepen shelf AO further to pursue the reference: vary supported stock groups and tune only lights associated with modeled fixtures in a subsequent composition pass.

## What holds up

- The restaurant wall staining is clearly stronger than R04 while the cream tile grid remains legible. The counter skirt no longer feels like the only dirty large surface in the room.
- Produce retains fuller side banks and an open central passage. Red, jade and pale-green crate families remain distinct; room shading has not flattened those colors.
- Shelf backs and undersides are convincingly recessed in both retail shops. Front labels and exposed deck edges remain identifiable. The treatment is intentionally illustrated rather than a claim of physical global illumination.
- The ceiling and room corners read darker without making the exterior scene nocturnal. Blue-gray daylight and localized warm practical lights remain visible.
- Neither inspected closeup shows a newly obvious wall classification seam or a broken grout strip. Screenshots establish appearance, not proof that every procedural placement is seam-free.
- The metal counter remains quiet and subtly varied in the closeups; it does not return to the objectionable directional noise texture. Its reflections still depend strongly on the broad environment, so these angles do not establish the full roughness behavior.

## Evidence and limits

Inspected actual R05 whole-shop renders for `grocer`, `greengrocer`, and `roast`, the two register views, R04 restaurant/produce views, and all three active daylight concepts. A quick Sharp script composed complete concept/render pairs without retouching either image:

- `generated/storefront-study/patina-r05/grocer-reference-comparison.png`
- `generated/storefront-study/patina-r05/greengrocer-reference-comparison.png`
- `generated/storefront-study/patina-r05/roast-reference-comparison.png`
- `generated/storefront-study/patina-r05/compare-daylight.mjs`
- Detail captures: `generated/storefront-study/patina-r05/register-{operator,customer}.png`

The concepts remain layout and atmosphere inspiration. Their corner sites, surrounding buildings, architectural layering and cameras differ from the isolated procedural bay, so this is not a pixel-fidelity comparison. No framing or clipping issue prevents the scoped material review. Circulation, collision, export persistence and performance require their separate recorded checks. No production source was edited by this reviewer.
