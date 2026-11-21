# Wall and metal shelf patina — independent implementation review

## Decision

No functional blocker found in the scoped `shelf-patina-r01` implementation. The wall-mounted board, cleats, and brackets now receive the shelf frame treatment, while its merchandise retains the separate stock-contact shading. Steel and wire rack supports opt into the new brown frame deposits without changing the existing timber-family defaults or blackening product labels through a frame multiplier.

## Implementation findings

- `shelfFrameOcclusionPen` now returns RGB multipliers rather than one neutral scalar. Optional grime adds warm, assembly-local deposits; absent or zero grime preserves the existing frame values. Stock shading returns the prior neutral amount in all three channels. Placement transforms, copied input colors, excluded glass/emitters, survey bypass, and nested frame/stock behavior remain intact.
- The final material-bake callback composes the prior tint exactly once. Changing a profile participates in the placement merge identity. The intrinsic shelf-material recipe has its own `shelf-paint/v2` cache identity, so revised contact dirt cannot reuse stale v1 raster maps.
- The metal finish derives its added occlusion and dirt from actual detector contacts. The broader 26–32 mm contact falloff is distinct from the unchanged small rust footprint; the effect can remain visible when rust is zero. Short runoff follows projected gravity, while remote paint retains clean regions. Roughness changes accompany dirt without introducing larger relief or new displacement.
- Weathered metal receiver objects keep the nested raster getters and sampling closures by reference through the shelf adapter. The adapter does not read the lazy contact list while the assembly is still being emitted. The new wall shelf uses the same room-relative coordinates and existing deck/support extents; only its finish path changes.

## Evidence and limits

The frozen R01 build contains 137,590 provisions, 138,602 produce, and 117,940 roast triangles. Provisions and roast counts match the preceding `patina-r05`; produce adds 30 triangles from the bracket finish. All physical hashes remain `259ecb55f42378a590e3f76ace2d96d61bd50cbba18a91eb3eadcf8826a9c88c`.

Reviewed the independent test changes: optional grime checks warm normalized RGB attenuation, exposed-edge readability, unchanged geometry/UV/ownership, zero-grime identity, and reflected placement; the material test compares the same coordinate with and without a contact at rust zero. Existing remote-paint, gravity, relief, and compiled receiver/cache tests remain in place. The independent test reviewer reports 15/15 focused tests and TypeScript passing for this material/frame pass.

Visual acceptance remains separate: inspect the actual upper wall shelf and right-hand metal rack at both storefront and close-up scale. The code establishes where the shading survives export; it does not prove the grime is visible enough or aesthetically balanced in the delivered lighting.

## Visible wall-shelf face follow-up

The close-up exposed a preexisting orientation mistake: ordinary boxes omit local `-Y` (`b`) by default, but the upper shelf's local `+Y` points into the wall. Explicitly omitting `f` on the board and wooden cleats restores their aisle-facing surfaces and omits only their wall-contact faces. Their authored dimensions and support positions remain unchanged. Confirmed the final source correction and reviewed its actual front-face triangle-ray coverage: three samples along the plank must hit the outward plane, with cleat fronts checked separately across the existing deep-shop size, seed, and mirrored-host cases. The independent reviewer reports this follow-up and TypeScript passing. This particular geometry assertion was first run after the fix, so no pre-fix failing run is claimed for it.

The new `capture-shelves.mjs` helper checks the frozen GLB SHA against the revision manifest, derives target bounds from referenced indexed vertices transformed into world space, sets the camera and target, and waits for rendered frames before saving each screenshot. It hides only navigation UI, not scene geometry. This avoids the earlier shared-buffer bounds error and preserves the actual surrounding shop in the detail captures.
