# R04 independent storefront review

Status: changes required for reference fidelity. The deeper room direction is supported, but a longer shell alone does not yet reproduce the occupied depth of the concepts.

Inspected the three generated comparison images made with `node projects/storefront-study/compare.mjs r04`, the frozen R04 shop sources, and the study scene. Each pair preserves the full source and render at equal panel size without retouching. The supplied concepts remain art targets, not measured plans. The render camera has more isolation margin and a slightly higher view than the references; this contributes to scale differences but does not explain the stock and material gaps below.

## Highest priorities for the next revision

1. Give the extra depth a coherent sequence of occupied zones. Keep one clear, visibly continuous entrance route and add supported storage/work fixtures beside it. Do not fill the new room with random floor clutter or merely move its rear shelf farther away.
2. Restore the reference's foreground enclosure: tall stock at the provisions-store edges, an unblocked right aisle at the produce store, and a framed left service entrance at the duck store.
3. Put wear on the surfaces that currently remain clean: lower piers, threshold, pavement, awning edges and touch-height framing. Broad peeling on the upper band and mottled tiles cannot supply the reference's layered dirt by themselves.

## Liquor / provisions

The deeper side shelf run and small bottle/tin facings are real improvements. The back wall now reads as recessed rather than as a shallow stage backdrop. However, the center is a broad empty hall. In the concept, the opening is crowded from both edges and the walking strip is narrow.

- Occupy a substantial left or right interior band with a longitudinal stock fixture, bulk boxes or working counter, reserving a continuous roughly 0.9–1.1 m visual route. The current side-counter arrangement sends its counter almost to the back while shelving hugs the wall, leaving several meters of unoccupied width.
- Build the left foreground crates to varied waist/chest height, with a few cartons on supported tops. The current bottle-crate mass is short and small. Make the right front rack a visibly stocked open metal fixture with more frontage; the narrow wooden rack nearly disappears behind the scissor gate.
- Reduce the perfect horizontal product-row rhythm and overly bright hanging packet band. Use dense product groups, differing label heights and a few localized occlusions. The front wall's large cream/blue patch and evenly colored floor are still much cleaner than the target.

## Produce

The taller colored crate supports and heaped fronts are substantially closer than R01. Rear stock now exists, but the extra room depth scarcely reads from this view because the front display and obstructed right edge conceal it.

- Clear the actual right entrance. Frozen `greengrocer.ts` reserves a nominal 0.82 m edge, then places a 0.66 m-wide melon pallet at `y=0.1..0.95`, a scale in the same edge and an optional stool at `y=1.5`. This is not merely camera occlusion: these occupy the entry band. Put the melon load on a supported display or a suitable rear storage zone, and put the scale over produce rather than in the route.
- Continue a visible side stock/work sequence along the deep room, with the floor route leading to it. The existing left rear dry-goods bank is useful but mostly hidden behind the high stepped display. An interior capture through the cleared aisle should verify the new depth.
- Organic silhouettes and palette remain the limiting prop issue: oversized angular pears, repeated white spikes, tiny banana hands and uniformly smooth leafy forms differ from the broad irregular greens in the concept. Preserve the other agent's asset ownership; do not compensate by tinting all produce brown or stretching piles.

## Beijing roast duck

The left opening, broader cabinet and ivory tiles now follow the target more closely. The deeper shell is visible as a long tiled passage, but lacks the intermediate cooking/storage activity that makes the reference feel occupied.

- Add supported intermediate kitchen shelving/work storage in the left service zone and deeper side wall; use bowls, steamers, jars and pots in distinct working groups. The large empty tiled depth currently makes the shop feel less crowded as it gets deeper.
- The displayed bird still reads as a short, broad chicken. The target has long-necked, elongated roast ducks with rich amber glaze and smaller bright specular highlights. A proper duck silhouette and material adjustment will improve fidelity more than adding another bird or further uniform scaling.
- Raise the cabinet/entrance frame composition toward the opening head and add the worn green framed service door seen on the left. In the current render the front glass is barely legible, while a large open interval under the birds makes the counter feel sparse. Add supported crockery and meat trays at the sill, retaining chopping clearance.

## Shared materials, color and lighting

- The awning's new shallow folds are better. Its colors still read as even brown/tan bands; the reference has faded dusty red and dirty pale cream, uneven bleaching, darker seams and a thinner damaged hem. The entire isolated awning should not be made uniformly darker.
- Paving now has joints, but looks like a regular flat texture panel. Add a credible step/riser and limited unevenness/worn edge detail. The reference concentrates dark dirt at wall contact and around joints, with lighter exposed aggregate and rubbed walking areas.
- Interior depth attenuation is now sized from the frozen manifest, so the former 3.15 m cutoff is not present. The dim rear is helpful. Front display lamps and luminous banana/packet highlights remain too clean and bright against the broad bland wall surfaces. Warm duck case lighting should describe the glossy food and metal, rather than merely brighten the whole room.
- Green/red/orange crate identity is retained, which agrees with the user's request. Introduce wear within each finish while keeping each crate coherent.

## Architectural assessment

The ordinary render has a real ceiling, floor and three enclosing wall planes from `drawShop`; the deeper room is not a roofless cutaway. The side and rear storage banks have floor-supported shelving. The street study remains an isolated visual bay, not a fully authored building or a playable interior.

The main consequential circulation issue is the produce entrance obstruction described above. The provisions interior has generous physical-looking space but is poorly proportioned for the target's crowded shop. The duck left opening appears plausible at the front, but the deep working zone needs an interior view to assess how its fixtures relate to passage and work access. The threshold floor is raised above the pavement while its edge reads thin; a closed riser would improve construction plausibility.

No collision-aware walkthrough or navigation certification was performed. Source room dimensions and screenshots establish a deeper visual enclosure, not playable reachability. The next review should include the normal street view plus an aisle/interior capture at both shallow and deep sizes.
