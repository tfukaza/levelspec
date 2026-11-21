# Finish follow-up — independent implementation review

## Scope and decision

Reviewed the current room detail layer, floor patina, targeted stock recoloring, pale practical lights, shelf-paint v3, and the previously reviewed upper shelf front-face correction. No functional blocker was found. Visual acceptance remains separate from this review.

## Implementation

`room-details.ts` emits flat visual dressing through the existing room pen: broken runoff and small base deposits on side walls, worn notices using the existing poster atlas, and irregular floor rings/scuffs concentrated near the perimeter and threshold. The named random streams do not consume furniture-placement streams. Side-wall frames face into the room, use separate plaster/tile offsets, and leave the physical room untouched. Poster layering uses explicit small depth separations; its actual stand-off against relief should still be checked in captures. The notices remain outside the known restaurant menu location. The integration is limited to the three requested shop trades.

The floor field strengthens dirt without changing its geometry contract or introducing new material raster identities. Existing room/shelf post-bake tint composition, transparent/emitter exclusions, and continuous relief-depth blending remain intact.

The stock bake derives colors from stable source artwork, then applies the saturation adjustment before packing and sampling fallback colors. Repeating it does not fade already-faded output again. The atomic image writer retains exact bytes for unchanged maps; it does not bypass PBR-channel alignment. Procedural tins, bottles, and jars use a separate equal-luminance color adjustment without mutating caller colors or recoloring furniture.

Practical light colors and visible emitter colors change together. Intensities, source positions, decay, range, shadow settings, and daylight fill are unchanged. These lights belong to the study viewer; this pass does not embed punctual lights into exported props.

Shelf-paint v3 broadens contact-local darkening and accumulated dirt while retaining the small rust footprint and short projected-gravity trails. Its changed recipe carries a new cache identity. The wall board/cleat front faces remain explicitly present; their dimensions and support locations are unchanged.

## Evidence

The independently recorded asset comparison reports mean chroma ratios of 0.5802 for food tins, 0.5781 for seasoning jars, and 0.5800 for drink bottles. Normal and property maps are byte-identical; no pixels outside the targeted padded atlas regions change; catalog geometry and UVs remain identical. Evidence is retained in `generated/finish-followup-validation/asset-comparison.json`.

`finish-r01` contains 139,238 provisions, 140,240 produce, and 119,570 roast triangles. The added room layer costs about 1.6k triangles per trade. All three physical hashes remain `259ecb55f42378a590e3f76ace2d96d61bd50cbba18a91eb3eadcf8826a9c88c`.

Reviewed the new room-detail regression: it checks real emitted triangles for finite attributes, positive area, inward-facing wall normals, upward floor normals, narrow receiving-surface bands, unchanged collision, mirrored point/area equivalence, and deterministic named seeds. It correctly avoids assuming identical reflected fan triangulation. The independent test reviewer reports **23/23 focused tests and TypeScript passing**, covering wall wear, room patina, stock appearances, shelf occlusion, shelf material behavior, and shelf production geometry. The isolated room-detail fixture emits 1,634 triangles. Catalog geometry comparison normalizes signed zero only; it does not permit real position/normal/UV changes.

## Visual limitations

The authored AO is an illustrative approximation, not a physically solved light transport bake. Inspect the finished images for decal stand-off, narrow runoff edges, visible metal joint dirt, and floor pattern repetition. Tests establish attachment and export mechanics, not how convincing the weathering appears.

## Room detail follow-up

Reviewed the corrections prompted by the R01 visual critique. Wall runoff is narrower, shorter, less frequent, broken at its starts, and tapered at both ends. Floor wear now includes larger irregular filled spills with broken outer residue and longer scuffs, distributed farther into the edge of the walking area rather than entirely beneath fixtures. The central area remains less covered than the sides. These changes retain the same surface-attachment, room-bounds, seeded-placement, and visual-only contracts.

Each floor patch has a distinct elevation within the existing narrow floor band. A requested follow-up raises each scuff another 0.5 mm above its own patch, resolving coplanar overlap when boundary clamping brings them together and giving more robust depth separation at the study camera. All resulting details stay below 3.4 mm above the room floor, within the tested 4 mm attachment band. The independent tester reports 7/7 room-detail/patina checks and TypeScript passing for the refined shapes, with 1,338 isolated detail triangles instead of 1,634; the final scuff separation is a bounded offset-only correction. Confirmed the frozen source uses that 0.5 mm value. No remaining implementation blocker was found. Final stain character and visible floor dirt still require the next actual render review.

## Shared tile floor replacement — current implementation

The preceding opaque floor-spill experiment was visually rejected and is removed. The user's instruction to reuse existing materials is implemented through `drawShopFloor`: one horizontal preserved raster receiver uses the existing `TileField` and `tileSurface` ceramic, bedding, brown grime, and normal-relief recipe, with high wear and grime. No custom puddle polygons or manually generated quarry-tile/grout geometry remain. The room patina's floor branch now supplies edge AO only; the shared material owns floor dirt and tile weathering.

The three requested shop trades replace their plain floor with this receiver on the same room-floor plane. Other trades retain their previous floor. The receiver has zero geometric height and routes tile relief exclusively through `bump`; sampling uses local meters and the shared materials' physical repeats and roughness. The ceramic alone receives the shop's floor pigment, while bedding and grime retain their material colors. The pigment is copied before deferred sampling, and the versioned raster key includes its recipe controls, source material settings, bounds, and color. Room AO still composes after baking without changing the intrinsic tile maps.

Semantic `ceramic`, `tile-bed`, and `tile-grime` kit slots bind these existing materials through the normal library/prefix mechanism. The prior matte brown grime definition is promoted to the shared catalog and reused by wall-material registration with the same color, repeat, roughness, and metalness; there is no duplicate competing grime recipe or new texture asset.

Reviewed the real receiver integration test. It requires one sparse chart, shared ceramic/bed/grime participation, complete exported PBR maps, zero floor displacement, unchanged covered area/bounds/geometric normals/collision, surviving room AO, identical intrinsic maps with AO enabled or disabled, and mirrored/rotated map invariance. Removing the old floor-decal expectations from the wall-detail test is appropriate because that geometry no longer exists; its wall attachment and physics assertions remain. The test reviewer confirms **11/11 shared-floor, shared-tile, wall-detail, and room-patina checks plus TypeScript passing on the final frozen source**, including the tint copy and edge-AO-only cleanup. No implementation blocker remains; the actual shared-material render is the visual acceptance target.

## Shared-floor R02 parameter tuning

Reviewed the visual follow-up: local tile wear is reduced from 0.82 to 0.45, while grime remains 0.98. The shared material's existing bedding-tint argument receives `[0.5, 0.47, 0.42]`, reducing the brightness of exposed bedding and joints. Ceramic trade pigments and the shared tile shader remain unchanged. The bedding tint is included in the complete raster material key, so cached R01 appearance cannot be reused incorrectly. The receiver plane, layer ownership, normal-only relief, and collision contracts are unaffected.

Independently ran `shop-floor`, `shared-tile-surface`, `room-patina`, and `aml-shop-wall-wear`: **11/11 pass**. Independently ran TypeScript with no errors. No new tests are warranted for these art parameters beyond the existing real compiler/geometry/cache checks and the required visual comparison. R02 source is reviewed and ready for final render assessment.
