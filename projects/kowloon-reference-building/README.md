# Kowloon reference building

An explicit four-story corner shop house composed from LevelSpec's shared procedural architecture, props and PBR materials. The target is the primary building in `reference/target.png`; the complete concept, including its detail insets, is retained unchanged. Metric dimensions and unseen rear/interior conditions are estimates. This is an exterior art study, not a playable apartment building.

`level.aml` places the `reference-corner` model on its host box. The
[Rust composition](../../../superspec/crates/engine/src/worldspec/themes/kowloon/building/reference_corner.rs)
also supplies the corner house in the expanded courtyard project. It uses the
shared wall finish, window, and stocked shop emitters.

## Iterate

From the repository root, choose a fresh revision name:

```sh
npm run levelspec -- build projects/kowloon-reference-building/level.aml --out generated/reference-building/r13 --json
npm run levelspec -- preview projects/kowloon-reference-building/level.aml
```

The build writes GLB, glTF, a scene packet, and validation data. Prior captures
and comparison scripts describe the earlier study revisions.

## Review

`review/source-inventory.md` was established independently before viewing the candidate. Each `review/critic-r*.md` records a critical comparison against the corresponding immutable render. A successful build is not visual acceptance. Review addresses silhouette, facade hierarchy, weathering scale, assembly connections, shop density and key props; it does not lock colors or prop placement into test cases.

The GLB is the authority for each captured revision. Project composition snapshots help inspect decisions; they are not a complete archive of every shared production module. Hidden rear surfaces and shop circulation are invented completion and are not claimed to reproduce unseen source geometry.

## Surface and shop detail

Wall deposits are sampled into cached PBR maps at up to 128 texels per meter (about 8 mm), rather than interpolated across a dense vertex grid. Clean walls reuse the common intrinsic finish. Weathered walls retain that same finish and its normal maps, with local runoff and soot composed once in wall coordinates. Finite maps split at the intrinsic finish's repeat boundaries; later pipe/sign deposits can use the same prepared fallback. These are surface properties, not baked lighting.

Cornices, parapet caps and balcony upstands have small two-segment fillets with smooth edge normals; broad faces stay flat and retain meter-scaled UVs. The main clipped vertical corner remains part of the building's architectural shape.

Counters and wooden crates use the shelf timber atlas, grain orientation, board variation and worn edges. Cartons use the existing stock-box PBR library. Crates return their actual interior support surface; bottle loads sit on it, stacked crates touch, and cartons above a crate rest on a wooden lid.

## Shop lighting

The preview's **Day view / Night view** toggle uses the same model and material maps. A runtime room-volume effect darkens opaque interior surfaces progressively with depth during the day, and adds a warm diffuse lift at night. Real-time shop lights supply the exterior spill. Glass and emissive fittings retain their own material response.

`interiors.json` declares the two shop volumes in right-handed Z-up meters: origin is the front-left floor point, across runs along the storefront, and inward points into the shop. The build exports these as `lighting.json`; the Three.js preview converts the frames once to the GLB viewer's Y-up coordinates. The neutral GLB does not contain this runtime lighting effect. Reuse `review/interior-lighting.ts` with the companion volume definitions when reproducing the treatment in another viewer.
