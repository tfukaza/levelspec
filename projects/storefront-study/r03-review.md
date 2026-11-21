# R03 reference review

Status: changes required. R03 is a meaningful improvement, but still clearly short of the concepts' crowded, aged street-shop character. This review inspected the frozen rendered PNGs, not a generated image of an improved shop.

## Evidence

`node projects/storefront-study/compare.mjs r03` produced the three paired images in `generated/storefront-study/r03/`. Each pair preserves the full reference and render, equal panel dimensions and image aspect, without cropping or retouching. The corresponding build and capture manifests identify the frozen models and cameras.

References: `projects/kowloon-reference-building/concepts/storefronts/reference-storefront.png`, `produce-grocer.png`, and `beijing-roast-duck.png`.

The references fill almost the entire frame with storefronts. R03 still presents a detached shop vignette with visible background around the roof and pavement; this reduces apparent scale and detail density. That camera/presentation difference is separate from the actual sparse or clean areas below.

## Progress observed

- The produce shop now has substantial front crate supports and a stocked rear wall. It reads as a shop, rather than a set of low trays in an empty room.
- The roast shop's entrance is now on the reference's left side, and ivory tiles replace the earlier aqua bands. Its cabinet spans the correct broad display zone.
- Provisions shelves contain many recognizable small retail facings. Awning folds are much less corrugated than R01.

## Priorities for the deeper revision

The user's deeper-shop direction should become visible through repeated side shelving, ceiling fittings, floor lines and diminishing light, with an unobstructed view down an entrance aisle. Moving only the rear wall will not establish the reference's sense of depth.

Keep the shallow layout supported as a separate bounded case. For deep layouts, place secondary storage against the sides and rear rather than across the entrance or central throat. This is a visual/architectural observation, not navigation certification.

The preview currently hardcodes the lighting region to 4.8 by 3.15 by 2.65 meters, and places its two point lights only 0.8m inside. Read frozen dimensions for deeper revisions and distribute actual ceiling-light stations along their depth. Otherwise geometry beyond 3.15m can leave the interior attenuation region and become artificially bright.

## Provisions

1. Raise the foreground stock mass. The reference has dense worn crate/carton stacks around waist/chest height on the left and a tall, open wire stock rack at the right threshold. R03's foreground is dominated by low crates and two isolated box stands. The narrow right rack exists but does not form the strong frontage silhouette of the reference.
2. Keep a clear, visible path into the deeper room. The side-counter seed reintroduces a visually continuous low sack row across the near rear floor; deeper placement may make this a credible distant stock grouping, but check the entrance view after extension. Side shelving should run toward the street and continue into the back to avoid a flat wall-of-stock reading.
3. Reduce uniformity in the prominent shelf facings and hanging packets. Retain tight groupings, but use taller bottles/jars and irregular partially empty stacks to interrupt the horizontal grid. The reference also has large hanging bags/cloths, which break the upper silhouette more effectively than many equally spaced tiny packets.

## Produce

1. Preserve an unmistakable right-side aisle into the deep room. In R03, the frontage and the viewing angle almost hide it; a perspective view should read a continuous strip of floor, not another blocked edge.
2. Produce is still too miniature and regular relative to the crate mouths. Reference heaps protrude, overlap and hide most of the upper crate rim. R03 has small separated faceted goods and regular planted rows. The planned grocery-model work is directly relevant, but do not stretch whole piles nonuniformly to fill larger crates.
3. Enlarge and vary the prominent hanging produce/scale and lower their visual emphasis away from the repeated bright red lamps. The reference's banana bunches are substantial forms over the display, with a larger readable hanging scale. R03's overhead bunches are tiny and its saturated lamps dominate the upper display.

## Roast duck

1. The current bird asset still reads as a plucked chicken: compact body, short neck and stubby feet. Larger scale helped, but the target has long-necked, elongated roasted ducks with a much glossier amber-brown skin. This needs a silhouette/material correction or replacement asset, not just another increase in scale.
2. Make the left entrance read as a working shop. The target has a weathered open green glazed door, closely fitted shelves of stacked bowls/steamers and utensils visible beyond it. R03 exposes a broad largely blank tiled side wall and small bucket. Extend a credible supported storage/work sequence into the deeper interior.
3. Give the cabinet a stronger metal sill/frame, warm reflected highlights and visible stacked crockery near the front counter. R03's black horizontal worktop and thin dark frame dominate while the glazing is barely legible. The ivory tile color is closer, but staining reads as repeated broad blotches rather than concentrated dirty grout, damaged lower corners and handled counter edges.

## Shared grime, lighting and color

- Grime remains concentrated on the upper beam and selected tiles. Reference wear is distributed over awning hems, gate joints, lower piers, thresholds, side reveals and pavement edges. Add medium/small localized wear and brown deposit transitions at those contacts; simply increasing giant plaster-loss patches will not fix the clean impression.
- The awning is still too evenly colored, with clean straight bands. Use uneven sun fading, brown water deposits along the lower edge and selected frayed/abraded spots. Keep the new restrained folds.
- Pavement now has joints, but the broad uniform brown slab is still much cleaner than the reference. Uneven wear around the threshold and curb/joint dirt will be more valuable than additional random surface noise.
- The interior should recede into a darker, less uniformly lit depth with local warm/cool fluorescent sources. Preserve readable merchandise; avoid flattening every surface with the same ambient light.

No production code was modified by this review.
