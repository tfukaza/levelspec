# Register R03 independent visual review

Reviewed the generated concept first, then frozen R02 and R03 operator/customer captures. This review evaluates the actual register in the roast-duck shop, not the concept as if it were a model. The comparison is `generated/storefront-study/register-r03/register-reference-comparison.png`.

**Verdict:** the hybrid repair substantially improves the controls and receipt, but R03 is not ready to accept unchanged: its customer display visibly crosses a molded housing seam.

## Required improvement

The rear display spans both the broad rear panel and the narrower printer shell (`register-customer.png`, approximately x365–550, y440–550). The light-colored seam cuts through its right side. This reads as a pasted graphic across two removable parts, rather than a fitted display. Shrink and recenter the entire dark surround, glass and digits onto the broad rear panel with a visible margin before the seam. The panel should continue to conform to the actual shell.

## Secondary improvement

The replacement keys now have regular spacing, plausible bevels and legible numerals, but their cap colors and printed legends are uniformly clean compared with the worn housing and concept. A small amount of edge wear and selective legend fading would better unify the hybrid parts. Keep the clean geometry and accurate key spacing; do not reintroduce the R02 inflated key shapes. The function bank repeats E/F/C labels mechanically, so a future close-up polish pass should use a believable compact set of register functions.

## Shading diagnosis

The sharp dark triangle on the printer side is **a shadow cast by another scene object**, not a broken register albedo, a normal-map defect or register self-shadow. Evidence captured with the same frozen R03 GLB, camera and lighting:

- `diagnostic-unlit.png`: the side's base color is continuous; no dark triangle.
- `diagnostic-no-shadows.png`: full PBR and normal map retained, AO and shadows disabled; no triangle.
- `diagnostic-only-self-shadow.png`: only register geometry casts shadows; no triangle.
- `diagnostic-only-scene-shadow.png`: only other shop objects cast shadows; the triangle returns.
- `diagnostic-no-ao.png`: triangle remains with AO disabled.

The precise external caster was not isolated. The evidence is sufficient to reject painting this shadow out of the register texture. Its edge is harsh under the current small-source/direct lighting, but changing the register material would conceal a lighting effect instead of repairing an asset defect. Reproduction utility: `projects/storefront-study/register-diagnostic.mjs register-r03`.

## What now works

The old malformed central key bank is gone. Keycaps sit on the sloped deck and their numeric layout is readable. The receipt reads as paper issuing from a slot instead of the R02 plug. The low cream housing, muted colored function keys and grimy cash drawer preserve the intended older small-shop equipment character. The base sits on the real counter and receives grounded contact shading. The operator and customer cameras expose both faces without hiding geometry or introducing inspection-only lights.

## Inspected evidence

- Reference: `projects/kowloon-restaurant-props/concepts/kitchen-props/register.png`
- Prior: `generated/storefront-study/register-r02/register-operator.png`
- Current: `generated/storefront-study/register-r03/register-operator.png`
- Current: `generated/storefront-study/register-r03/register-customer.png`
- Atlas: `src/materials/library/shop-register.png`
- Frozen roast GLB SHA-256: `27a9313a3da8d6cc44a7b2757e4e73377feb1806c25d487483fd6c93498f6f6d`

This is visual evidence only. It does not replace the separate placement, envelope, mesh and export tests. Root has reported a subsequent R04 correction to the rear-display fit and receipt thickness; those changes require a fresh reviewer and are not accepted by this R03 report.
