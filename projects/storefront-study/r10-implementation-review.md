# R10 implementation review

Independent source review of the shelf material, thicker shelving, checkout furniture and shop-layout changes. This does not review unrelated concurrent asset or performance changes in the working tree. The inspected source includes the follow-up kitchen-width cap and prep peninsula, which postdate the frozen R10 renders.

## Assessment

No blocking source defect found in the reviewed shelf material, shelf families, register, provisions layout, revised restaurant furniture, or follow-up produce checkout. The separate test reviewer continues the broader procedural-layout regression checks; visual acceptance of the post-R10 changes requires a fresh capture.

- **Shelf material ownership:** `shelf-patina.ts` is an isolated recipe with millimeter-scale edge wear, small joint spots, short gravity trails, retained paint and normal-only relief. `componentPatina` dispatches it explicitly. The architectural frame/cage/pipe/sheet algorithm is unchanged. `createMetalSurface` requires physical-meter UVs, so the shelf recipe's fixed physical scales are appropriate. Cache identity includes the shelf recipe version, and adapter reuse checks finish kind; an inherited cage adapter cannot silently override the requested shelf finish.
- **Shelving:** closed and open timber decks are 4 cm thick. Open timber posts lie outside the returned stock-depth interval, including intermediate bay posts. Steel and wire preserve their distinct construction and use the new shelf recipe. Deep-room stock uses existing shared goods placement rather than introducing a competing asset system.
- **Provisions checkout:** the register is a coherent small procedural prop with explicit scale/orientation/base semantics. Layouts now reserve staff and customer standing regions, move hanging packets out of approaches, and omit crates/sacks when they would obstruct minimum-room access. Source-only corrections move the left bank behind the counter crossover and gate rear sacks by that same crossover depth.
- **Restaurant:** dining activates only where seating plus a separate kitchen and at least a 0.9 m aisle fit. The kitchen width is capped at 2.45 m. Its replacement prep/storage peninsula faces cabinet doors into the working side, ends 5 mm inside the kitchen boundary, and leaves front and rear crossings. The narrowest dining room has approximately 1.17 m between the left prep bench and peninsula; the default has approximately 1.27 m. Two explicit woks fit the minimum 1.37 m stove, including handles. One named sink and grounded tables/stools are present. Register placement retains the chopping station.
- **Produce checkout:** `planMarketCheckout` owns both payment-counter placement and the display extent that must give way to it. Deep rooms retain rear payment and staff space; shallow rooms reserve a 0.65 m strip beside the aisle for a 0.60 m front counter. The shared register fits the 0.45 m worktop depth, while the larger scale is omitted on small counters. Production minimum interior width is 1.8 m (2.4 m bay minus two 0.3 m piers), which still leaves a valid single-crate tier and 0.7 m aisle in the shallow arrangement. Normal-width rooms retain 0.95 m aisles. This is an intentional density tradeoff for an actual payment position, not a reason to retain obsolete full-width crate assertions.

The code follows existing local geometry conventions and introduces focused responsibilities (`checkout`, `restaurant-dining`, `shelf-patina`) rather than a new generic layout framework. Optional fixtures replace obstructing mandatory placements directly. There is no compatibility mode or duplicate old shelf finish left active for the revised shelves.

## Verification

Independently ran:

```powershell
node --test tests/surface-metal.test.ts tests/aml-shop-shelves.test.ts
node --test tests/aml-shop-function.test.ts
```

All 9 tests passed. These cover actual shelf support, family differences, dedicated cache identity, inherited-adapter replacement, PBR ownership, zero geometric displacement, bounded shelf corrosion, supported registers under transformed hosts, dining fit boundaries, a clear dining aisle, grounded seating, and one sink/two nonintersecting wok assemblies.

The separate test reviewer owns expanded layout, dining and continuous fixture-access coverage. R10 frozen exports establish actual rendering and unchanged physical hashes; the subsequent peninsula requires the next frozen capture for visual assessment. Decorative fixture clearance does not establish collision navigation or gameplay reachability.

## Limits and follow-up

The original R10 produce checkout only appeared for sufficiently deep rooms; the reviewed follow-up now includes a front checkout in shallow variants. The test reviewer was notified that the old produce tier test assumes the superseded display extent and at least two crates per row; minimum rooms now intentionally trade one crate position for payment and access. That coverage should assert the revised independent fit contract while retaining density, support and overlap checks. Broader art gaps (floor texture, tile weathering and light distribution) remain in the independent visual review rather than being conflated with source correctness.

## R12 scoped follow-up

Reviewed the final two production changes against their callers and surrounding geometry:

- Eat-in restaurants omit the floor-standing gas cylinder. Its previous position was beside the rear wok approach; removing that decorative obstacle preserves the working clearance without relocating it into dining or another route. Takeaway variants retain their existing cylinder condition. The omitted random draws do not affect subsequent furnishings because the remainder uses independent named streams or deterministic tile geometry.
- Produce lighting now has a minimum of one pendant rather than two. Placement still follows the actual reduced display width. The 1.8 m shallow-shop case can center a single shade over its narrow produce tier instead of forcing two shades across the checkout edge; wider displays retain their width-derived lamp counts.

Both are direct local corrections with no new APIs or compatibility branches. No blocking implementation finding. Root reports R12 default/boundary architecture acceptance, passing TypeScript validation and eight depth/shelf/metal checks; the independent test reviewer is completing actual triangle-clearance coverage. Those reported results are distinct from the nine checks independently run above.
