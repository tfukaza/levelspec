# Register R02 independent review — pre-hybrid

Inspected the concept first, then frozen R02 operator/customer close-ups and the full roast storefront. Created and inspected `generated/storefront-study/register-r02/register-reference-comparison.png` with Sharp: untouched images, aspect-preserving resize and labels only. The sheet includes the R18 procedural operator capture. This review does not cover the hybrid mesh now being built.

Reference: `projects/kowloon-restaurant-props/concepts/kitchen-props/register.png`.
Renders: `generated/storefront-study/register-r02/{register-operator,register-customer,roast}.png`.
Baseline: `generated/storefront-study/r18/register-operator.png`.

## Visual judgment

R02 is substantially closer in silhouette, rounded printer housing, sloped keyboard deck, drawer seam, faded cream color and localized wear. It now reads as an old electronic till instead of an upright screen on stacked blocks. It sits convincingly on the counter and casts a visible contact/cast shadow. In the full storefront its lower silhouette is appropriate and no longer dominates the checkout.

It is not yet satisfactory at close range:

1. **Central keypad, operator close-up (roughly x560–750, y440–615):** several numeral keys are bulged, folded or wedge-shaped. The reference has manufactured rounded rectangular caps with narrow consistent gaps. Replace the disconnected generated key islands with coherent beveled keys aligned to the deck, retaining three distinct banks and restrained colored function keys. This is the highest-priority hybrid repair.
2. **Receipt slot (roughly x445–520, y392–443):** the white part resembles a crumpled plug or roller. The reference has a short flat paper strip curling out of a dark slit. Remove the generated paper component and build a thin short strip with a restrained curl, visible thickness and dark printed lines.
3. **Lower operator readout (roughly x570–745, y326–402):** the large dark insert is entirely blank, while the concept has visible green digits. Add a legible dim numeric readout here. The tiny digits on the upper strip do not compensate for the empty principal display.
4. **Customer-facing rear shell (roughly x305–580, y335–580):** the large blank cream panel lacks identifying detail and reads as a smooth molded cover. A small inset customer display, subtle seam or restrained service label would help, preserving the low silhouette; avoid reinstating the old oversized upright monitor. The reference does not show this rear view, so this is a plausibility/detail recommendation, not a direct reference discrepancy.
5. **Printer side lighting:** an unusually sharp large dark triangular region appears on both side captures. It may be a real cast shadow from surrounding frame/light geometry rather than the material. Before changing the housing texture or normals, compare a neutral-light prop capture or temporarily move the directional light. If the boundary is baked/faceted, repair it at source; if live, preserve physically consistent shadowing. Current screenshots alone do not establish the cause.

The reference has finer grime, scratches and key-edge wear than R02, especially across the cream shell. Avoid replacing manual keys with uniformly pristine black slabs; retain modest cap-to-cap wear/color differences while keeping their geometry manufactured. The storefront remains sparse/dark in places, but this register-scoped review does not certify the broader shop density or lighting work.

## Implementation review

Reviewed `checkout.ts`, the dedicated material role in `kit.ts`/`kit-mesh.ts`, `catalog.ts`/`images.ts`, `bake-register.mjs`, and the new register regression/export checks. The initial placement/material review found no issue; a subsequent tangent-frame audit found one local normal-map convention bug (see correction below). Other R02 integration contracts:

- The single offline asset owns its geometry. The obsolete procedural register has been removed rather than retained as a competing design.
- The baker applies a proper source-to-Z-up rotation, a uniform fit into the checkout envelope, and bottom-centered placement. The runtime scales positions explicitly and leaves normalized directions unit length.
- Reflection compensation is centered on the asset and transforms normals with positions. UVs remain attached to corners; the bake/export V flips cancel. The caller-owned placement matrix is not mutated.
- Albedo is white-multiplied in the textured path; sampled linear colors are only the untextured fallback. Normal and ORM maps have dedicated bindings and one shared material identity. The original normal green-channel convention needs the correction documented below. Current source factors are unity, matching the runtime material factors.
- Tests cover grounding, envelope, both used scales, transformed/reflected hosts, source corner/UV/normal/color correspondence, winding, embedded maps and material/image reuse. They provide contract evidence, not visual acceptance. Separate test reviewer owns execution/results.

The forthcoming `paintedFaces` path and mesh surgery require a follow-up review of their actual output. Optional readability cleanup: the tightly packed tuple/nested-loop body in `cashRegister` could use explicit grouping/braces when the hybrid path becomes final. It is not a correctness blocker.

## Follow-up correction: imported normal-map green channel

`materialTangents` computes its frame from domain UV before `export.ts` flips UV V back to glTF. A source glTF UV becomes domain `[u,1-v]`, which leaves tangent T unchanged and negates bitangent B (handedness w). The exporter deliberately preserves that authored frame. Therefore the adopted source tangent-space normal must become `[nx,-ny,nz]`: invert G locally in the register bake while retaining the image orientation. Merely round-tripping UVs is insufficient. Numerical verification on the current retained hybrid body found identical tangent XYZ and opposite handedness at all 3546 corners. The model author is correcting the local bake; this review does not request a global exporter change.

## Final hybrid implementation follow-up

Reviewed the completed `register-details.mjs`, `bake-register.mjs`, runtime `paintedFaces` adapter and updated tests after the model author reported completion. The final artifact contains 1182 retained body triangles plus 1664 authored triangles (2846 total). The local normal-G correction is present. An independent full-image byte check reconstructed expected normalized `[nx,-ny,nz]` output from the embedded original glTF normal image: all 1,048,576 output pixels matched, zero differing channel bytes. Provenance now documents the conversion correctly, and the raw GLB/task record are retained under `projects/storefront-study/register/source/`.

No unresolved implementation blocker found. Whole detached components are removed with explicit expected component-count guards, retained geometry and UVs remain separate from authored colors, and the surface-projected operator/customer digits respect the retained shell. Manual glyph/key colors use the same linear-color contract as the runtime plain-paint path. Updated tests distinguish textured white multipliers from authored color values with the existing mesh color quantization tolerance.

Visual follow-up still required on final captures: check cap wear/integration, receipt silhouette and the dark printer-side region. The receipt emits coincident opposite-normal faces with different front/back colors; the live reviewer uses DoubleSide on opaque materials, so specifically inspect for depth/color artifacts. That is a potential presentation issue, not a proven failure from code alone. This follow-up is code/convention verification, not visual acceptance of the new revision.
