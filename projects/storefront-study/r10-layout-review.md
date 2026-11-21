# R10 shop layout review

Independent architecture and circulation review. Inspected the R10 cutaway and interior captures for all three shops and their layout sources. This assesses visible arrangement and plausible use; these objects remain decorative, and this review does not establish collision-aware navigation or building-code compliance.

## Changes required in the captured revision

1. **Roast shop: turn the large empty kitchen center into a working galley.** In `generated/storefront-study/r10/roast-cutaway.png` and `roast-interior.png`, the front display and rear wok line leave a broad, largely unassigned floor area. The small wall prep bench and low dining rail do not make this read as a compact working kitchen. The two woks and single sink are now clearly present, but the user's size concern remains valid in these captures.

   The subsequent source repair in `restaurant-dining.ts` is a coherent response: cap the kitchen width at 2.45 m and replace the rail with a 0.575 m deep plating/storage peninsula, starting at least 0.75 m behind the front counter and ending at `min(depth - 1.55, 4.65)`. At 4.8 × 6.2 m this leaves approximately 1.27 m between the left prep bench and the peninsula, 0.91 m to turn at the rear wok line, and a 1.20 m dining aisle. At the 4.4 × 5.2 m eligibility threshold, the kitchen passage remains about 1.17 m and the dining aisle 0.90 m. Keep the peninsula for plating, packaging, bowls and closed storage; adding another sink or floor clutter would undo the functional improvement. **Source repair reviewed; fresh compiled views still required.**

2. **Small produce shops need an explicit payment location.** The captured/default arrangement puts the register at the rear right, with a customer approach along the right side and clerk space behind it. The earlier conditional implementation omitted it from shallow/narrow rooms. The subsequent `planMarketCheckout` repair now selects a compact front payment counter and reduces the produce bank accordingly. **Source repair reviewed; inspect an actual shallow/narrow capture** to confirm the register fits its reduced counter and both the adjacent customer passage and clerk approach remain legible. The compact variant is counter service, not a full walk-through supermarket.

3. **Recapture the grocer crossover after its source-only repair.** The latest front/recessed layout starts the left shelf at `counterY + 1.25` and omits sacks when they would occupy that crossover. This addresses the previously pinched way around the counter. Verify the front and recessed small-room variants, not only the roomy side-counter study seed. Keep the entry end free of hanging packs, crates and low bags at body height.

## Unaffected arrangement supported by the inspected views

- The default grocer has a readable customer route around its low central bank and an actual clerk side to its freestanding register counter. The right wall shelf starts behind that station rather than filling the clerk's standing space.
- The default produce shop has a continuous approximately 0.95 m right-side customer passage to its rear checkout. The melon pallet sits beyond the staff crossover behind the front display bank.
- Roast dining is a small wall-side eat-in area, with tables and occupied stool envelopes kept outside the continuous aisle. The default has two tables; reduced depth yields one before dining is omitted entirely. The front crossover must remain open when the peninsula replaces the rail.

## Return inspection

Use the refreshed roast cutaway and an interior view through the dining entrance to inspect both ends of the peninsula, the visible galley, and register access. Inspect one minimum eligible dining room and one shallow produce checkout. Reuse the accepted default grocer/produce evidence except where changed sources affect their interfaces. Do not describe source dimensions alone as completed visual verification.

## R11 return assessment — actual default captures

Inspected `generated/storefront-study/r11/roast-cutaway.png`, `roast-interior.png`, and `roast.png`, plus both grocer and produce cutaways. **The default kitchen compaction repair is accepted visually.** The central storage/plating counter now creates a defined working galley between the side prep bench and rear cooking line. The two wall tables have an independent approach; entering diners do not need to pass through that galley. The front crossover remains visible around the end of the peninsula, and the register stays at the display's entry end. Two woks, one sink, a separate roaster, closed storage and a small plating surface give the working area distinct functions. The normal front and interior confirm an enclosed shop, rather than a roof omitted to expose the plan.

One local repair remains: the gas cylinder at `[kitchenWidth - .25, depth - .89]` in `roast.ts` occupies the rear turning strip immediately ahead of the right-hand wok. It is visible in the R11 cutaway beside the rear end of the peninsula. The nominal 0.91 m rear crossover therefore is not completely clear. Omit that loose cylinder in dining layouts, or relocate it outside both the cook's standing envelope and the route around the peninsula. Do not add more floor storage there. This does not require changing the accepted galley/table arrangement.

The R11 default grocer retains clear routes around its central shelving and both sides of the register counter. The R11 default produce layout retains its right-side route to the checkout and the crossover behind the front produce bank. No new consequential defect is visible in these default arrangements. Shallow produce payment and minimum dining layouts remain outside this capture assessment; their source logic has been reviewed, and separate boundary fixtures/captures are still needed. Visual acceptance does not certify collision or navigation.

## R12 final scoped assessment — accepted

Inspected the actual default roast cutaway in `generated/storefront-study/r12`, the roast cutaway/interior in `r12-small-dining`, and the produce cutaway/interior in `r12-small-produce`. Build manifests identify the boundary studies as 4.4 × 5.2 m dining and 1.8 × 2.4 m produce. The source now omits the loose gas cylinder whenever dining is present, and the default and small-room captures visibly confirm its removal. The rear end of the plating peninsula and the approach to both woks are clear. This resolves the outstanding R11 local finding.

The minimum dining study reduces seating to one table with two stools and shortens the plating counter, while preserving the separate dining aisle, front staff crossover and rear turn. The side prep bench, one sink, roaster and two-wok bench retain legible functions without spilling into that aisle. The normal interior confirms this relationship under the ceiling, rather than relying solely on the cutaway.

The small produce study now has an actual front payment counter with a register. Its reduced produce stands occupy the wall side and leave an approach beside the counter, including space behind it for the clerk. The rear stock shelves remain reachable from that shared narrow space. This reads as a small counter-service shop; it should not be described as a two-way customer aisle. The previously missing payment location is resolved in actual geometry.

**No consequential architecture/circulation finding remains in the inspected default and boundary arrangements.** Acceptance is scoped to these compiled visual arrangements and the repaired source interfaces. Existing default grocer/produce acceptance is reused. The separate triangle/clearance fixture results belong in the implementation's validation record; this review neither substitutes for those results nor establishes gameplay navigation, collision behavior, universal procedural-seed coverage, or code compliance.
