# R12 independent visual review

## Evidence and scope

Reviewed the three actual R12 frontages paired with the current AI research concepts; the default shop cutaways; the roast interior; the 4.4 × 5.2 m dining boundary cutaway; and the 1.8 × 2.4 m produce boundary cutaway and interior. The actual GLB hashes and camera states are retained in each revision's `build.json`, `captures.json`, and `layout-captures.json`. Default roast hash: `dabdb9fa3024ad9b8ce58fd6fb667a6712147c00a90f43bc7646975ecb0c4075`.

Ran `node projects/storefront-study/compare-research.mjs r12`. The three `*-research-comparison.png` files and `r12-research-comparisons.json` are under `generated/storefront-study/r12/`. Panels preserve complete images and aspect ratios without retouching. Concept and render cameras are not matched; the generated concepts are inspiration rather than measured reconstruction evidence. Cutaways deliberately clip the ceiling and high geometry for inspection; the normal interiors show enclosure.

## Latest duck-shop correction: accepted visually

The kitchen now reads as a working galley rather than an oversized empty room. The substantial peninsula establishes a preparation and packaging surface, with closed storage below, across from the wall equipment. It gives the open center a clear purpose without filling the walking space with miscellaneous props. The front crossover remains readable beside the register; the working aisle continues to the rear cooking line.

Two black woks are clearly distinguishable on the rear hob. There is one open sink beside the cylindrical roaster. The loose cylinder that previously intruded into the rear working position is absent. The remaining circular vessel is visibly the roasting oven, not another sink. The default layout has two tables and four stools along the opposite wall, with a separate continuous dining approach. The register is grounded on the service counter beside this entrance.

The kitchen remains longitudinally deep, consistent with the earlier request for deep shops, but its narrower width and preparation/storage organization resolve the most consequential oversized-kitchen impression. Moving the full cooking line forward or adding further partitions is not necessary for this correction. The long steel peninsula is somewhat visually austere; that is a surface/detail refinement, not a reason to rearrange the room again.

The small dining boundary sensibly reduces to one table and two stools while retaining both woks, the sink, the plating counter, and visibly distinct dining and staff spaces. No new obvious furniture intersection or blocked approach is evident in that capture. Exact body-volume clearance is a separate geometry-test result, not established by these images alone.

## Other shops and narrow fallback

The default provisions shop has a legible stock-lined path, open timber center shelf, and cashier position. Thick predominantly timber construction reads clearly, with the steel and wire racks providing restrained variety. The new shelf finish avoids the conspicuous large white peeling patches associated with the earlier architectural material. Frontage screenshots cannot establish millimeter-scale texture quality.

The default produce shop retains a clear right-side route to the till and distinct staff space behind the display. In the 1.8 m boundary variant, the smaller produce bank gives up capacity to a real front payment counter and right-side entry. That is a sensible procedural tradeoff. The register is visible and supported, and the single red lamp fits inside the narrow room. The cutaway makes some higher produce disappear because of its clipping height; the ordinary interior confirms that the upper display is stocked.

## Remaining broader art limitations

- The roast floor is still a largely unpatterned dark red field, and the other shop floors have little visible physical scale. Tile divisions and restrained traffic/contact wear would improve the next material pass.
- Restaurant wall grime remains broad and cloudy, with a dominant horizontal dark band. The concepts have more localized dirty joints, chips, and deposits associated with equipment.
- The default produce composition is more regular and less organic than the concept: repeated red shades, thin hanging bunches, and separated tray-sized heaps. Preserve its clear movement route while refining those silhouettes through the ongoing produce-asset work.
- Lighting is comparatively even, with broad ceiling pools. More localized warm emphasis at the duck case, checkout and produce would improve depth and tactile detail.
- The isolated shared facade is cleaner at small contact points and coarser in its large peel patches than the concepts. This is separate from the now appropriately finer shelf finish.

These are honest visual gaps to the richer concepts, not newly discovered blockers for the latest kitchen and circulation correction. No production source was changed for this review. Visual acceptance does not certify collision, navigation, or complete photorealistic fidelity.
