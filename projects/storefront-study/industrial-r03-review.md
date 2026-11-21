# Industrial R03 independent visual review

Reviewed 2026-11-12 against the actual frozen `industrial-r03` model captures. No production source was edited by this reviewer.

## Brief clarification and evidence

During this review the user clarified that **blue hue does not mean night**. Blue shadow color is the requirement; a dark blue background, dusk exposure, or night lighting is not. The `concepts/industrial-blue-fresh/{grocer,greengrocer,roast}.png` images remain useful layout/industrial-design exploration, but their blue-hour treatment is superseded as a lighting requirement. The next light pass should preserve readable neutral daylight while giving shaded planes a restrained cool hue.

Inspected the three concepts first, then `generated/storefront-study/industrial-r03/{grocer,greengrocer,roast,register-operator}.png`, and the corresponding R02 views. R02 and R03 use matching model cameras. The concepts are newly invented spaces with different cameras and layouts; this is an inspiration comparison, not a pixel-alignment test.

Three full-image comparison boards were produced and inspected:

- `generated/storefront-study/industrial-r03/grocer-reference-comparison.png`
- `generated/storefront-study/industrial-r03/greengrocer-reference-comparison.png`
- `generated/storefront-study/industrial-r03/roast-reference-comparison.png`

The script `generated/storefront-study/industrial-r03/compare-critical.mjs` resizes and labels reference/R02/R03 without repainting their content.

## Decision

**Retain R03's material and facade progress, but do not accept it as completion of the new shop brief.** The cool color now reaches real shop surfaces, and the exterior variations are no longer just different signs on an identical arrangement. The large remaining issues are the overly coarse finish scale on small industrial pieces, light distribution, and the unresolved layout/architectural depth difference. The pending produce central-passage change is not present in these captures and is not certified here.

## Visible progress

- Blue/slate coloring now reaches the roast shop's left tiled wall, jambs and pavement rather than existing only in the empty background. Food and wood retain warm local colors.
- Offset canopy segments, the produce sign moved to the opposite side, and the liquor shop's louver box instead of the common right duct give the trades distinct silhouettes. This is a real improvement over R02.
- The new counter finish removes the previous directional streaks. The close-up has a smooth, handled stainless surface rather than the old scratch field. No return to directional noise is recommended.
- Register/counter contact, hanging food, wall shelf support and the visible main fixture locations remain legible. Screenshot evidence is sufficient for appearance comparison; it does not establish circulation or physical validity.

## Required improvements

1. **Correct the finish scale on small industrial parts and sign faces.** The upper-right roast/produce duct and utility boxes have large pale raised-looking chips, comparable in size to their seams and flanges. The larger signs also show coarse pixel steps at letter/wear edges. Those cues make the new industrial assembly look like a low-resolution large-wall material applied to a small object. Use finer, shallower corrosion concentrated at seams, fasteners and lower edges; keep larger intact painted areas. Give sign lettering and its weathering enough texel density for this frontage distance. Do not solve this by adding more general noise.

2. **Use the user's daylight clarification to improve tonal hierarchy, not just the backdrop.** R03's left-wall and pavement cool fill is a successful direction. However, the liquor shop still has a disproportionately bright amber patch on the upper middle/rear shelf while the left stock receives little warm coverage; the produce front band remains brighter than the upper tiers. Neutral daylight can brighten the exterior and shaded entry while local fixtures provide broad, modest warm coverage across their intended stock. Keep a visible shadow hierarchy and avoid either crushed interiors or an even blue wash. The current dark background should not be treated as required art direction.

3. **Verify the countertop weathering in one useful material diagnostic.** The R03 register close-up is still dominated by broad cream/gray reflection and reads extremely clean. The absence of stripes is clear; the stronger liquid-tideline/roughness variation cannot be confidently separated from lighting in this single view. A second grazing or neutral-light view should establish the subtle reflectance breakup before further map amplitude changes. Keep normals nearly flat and the marks quiet. This is not a recommendation to make stainless look like concrete or to exaggerate dirt until it is obvious at full-shop scale.

4. **The new concepts' usable depth and irregular architecture remain a substantial gap.** All three implemented shops still sit in one shallow rectangular outer frame, despite improved attachments. Produce is still a wall of tiers, rather than two groups around a central route. The liquor view retains its flat broad entry and centered gondola, while the roast view has the older straight glass line and left dining strip. The produce route is already being revised separately; inspect that later capture independently. Subsequent structural variation should introduce actual recesses, different pier/entry proportions or deeper upper service volumes, rather than only more small boxes on the same fascia.

## Limitations

The study isolates each shop and omits neighboring buildings, so it cannot demonstrate the concepts' full layered urban setting. I did not infer exact dimensions, airflow, accessibility, or gameplay behavior from images. No new visible geometry collision was established in R03; physical tests and implementation review remain separate. The user's later daylight correction takes precedence over the earlier concept prompts and dark-background captures.
