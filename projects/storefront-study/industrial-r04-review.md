# Industrial R04 — independent visual review

Reviewed the three frozen `generated/storefront-study/industrial-r04/{grocer,greengrocer,roast}.png` renders against the new **from-scratch daytime** concepts in `concepts/industrial-daylight/`. The user's latest instruction governs: blue is a hue/shadow direction, not a requirement for night. `VISUAL-REVIEW.md` still names the preceding blue-hour concept folder; this review intentionally uses the later daylight set supplied by the user-facing iteration.

## Decision

The daylight palette, quieter small metal parts, and newly visible produce-shop access are genuine improvements. **R04 does not yet meet the full density and accumulated-architecture brief.** In particular, the produce revision trades the previous obstructive wall of stock for too much empty display volume. Accept the circulation direction, then restore a dense shop around it; do not put the old cross-front barrier back.

These screenshots establish appearance. They do not establish collision or navigation reachability; those are separate from the root's geometry and circulation tests.

## Prioritized improvements

1. **Restore produce density beside the route.** The new center opening reads clearly from the street, but mid-depth floor is broad and the upper-left wall is almost bare (approximately x380–690, y340–560 in the 1536×1024 actual render). The reference frames its path with thick banks and stock at several heights; R04 has thin side bands and a conspicuous void behind the checkout. Add a third low inward-facing tier or supported sidecar bins toward the protected 1.10 m passage, with shallow storage/produce staging above the existing wall bank. Keep checkout staff access, the center strip, and the rear crossover clear. Use a few fuller assemblies rather than scattered loose crates. This is the most consequential next art change.

2. **Make floor and wall wear less uniform.** Across all three actual shops, the pavement is a dark repeating square field and broad interior planes remain simple. The daytime concepts have quiet but readable slabs, seams, worn paths, low-wall dirt, and irregular runoff. Add restrained broad color/roughness variation and localized dirt at thresholds, wall bases, and counter feet. Avoid another high-frequency noisy texture or uniformly wet mirror finish. Produce's bare left wall particularly needs purposeful storage, notices, or a localized surface treatment rather than extra random stains everywhere.

3. **Improve sign face resolution and wear scale.** The new horizontal and projecting signs now identify the trades, but character edges and large pale wear islands are visibly block-stepped at the overview scale. The source concepts use worn but coherent brush-letter silhouettes. Preserve the existing words and structure; increase the effective resolution of these hero sign faces, and reduce coarse square-edged loss through the letters. More grime will not solve this.

4. **Balance the remaining rear liquor-shop hot spot.** Its upper rear bottles are the dominant amber patch, while the tall left wall stock receives much less practical illumination. The reference has a more distributed hierarchy of warm shelf edges and cooler gaps. Check the modeled front/mid fittings' orientation and reach before raising all light intensities. Retain the cool daylight on jambs and shade; do not revert to invisible point-light grids.

## What improved and what remains uncertain

- The pale neutral-blue background and readable surfaces no longer imply a night scene. Cool tones are visible on shaded jambs, small metal, and pavement while merchandise retains its local colors. The result is still darker and more muted than the bright reference, but the hue direction is now correct.
- The new produce entrance exposes the room's depth, payment counter, and rear stock. The central route is legible in the image. The reference's central island is an inspiration, not a demand to block this route.
- Utility boxes and the roast/produce header duct no longer have the exaggerated raised pale blisters visible in R03. Their scale is more credible. Fine seam/edge staining could be added later without restoring the inflated bump treatment.
- Split canopies, different sign widths/positions, and the liquor vent variant reduce the identical-facade problem. The enclosing bay remains a simple rectangular strip; the concepts' corner volumes, upper-storey layers and adjoining street context have not been reproduced. This is an unresolved breadth-of-environment gap, not a capture error.
- Kitchen metal looks quieter in the roast overview. This view is too distant to establish subtle roughness breakup or tidelines convincingly; use the same counter close-up under daylight to confirm the requested weathering. Do not claim the specular change is proven solely by material values.
- No screenshot clipping or hash/camera problem is evident. The concept and model viewpoints/layouts differ; these pairs assess art direction, not pixel fidelity.

## Evidence

- `generated/storefront-study/industrial-r04/greengrocer-reference-comparison.png`
- `generated/storefront-study/industrial-r04/grocer-reference-comparison.png`
- `generated/storefront-study/industrial-r04/roast-reference-comparison.png`
- Reproducible composition helper: `generated/storefront-study/industrial-r04/compare-daylight.mjs`

No production source was changed by this reviewer.
