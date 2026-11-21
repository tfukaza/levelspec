# R13 independent implementation review

Scope: production restaurant finish and timber modules, the dining/roast changes relative to frozen R12 source, and the study viewer/capture changes. This is a source/geometry review, not visual acceptance against the AI paintover.

## Findings

1. **Capture material cloning dropped the interior-lighting shader hooks.** The first selective-cutaway implementation cloned materials after `InteriorLighting` installed its `onBeforeCompile` and `customProgramCacheKey`. Three.js material cloning does not copy those hooks, so the cutaway and subsequent interior capture could lose the room-depth attenuation while the frontage retained it. Root has restored both hooks on the capture clones. Capture-clone ownership must also restore original installed materials and dispose the temporary clones before the next trade unload; otherwise the lighting owner cannot restore its original GLTF bindings cleanly.
2. **Dining pantry top stock could exceed low ceilings.** The first pantry used 1.95 m supports plus 0.28 m above, while dining eligibility depended only on width/depth. Root now uses `min(1.95, room.height - .31)`, retaining 3 cm ceiling clearance. The test reviewer was notified to include an eligible low-ceiling variant rather than relying only on minimum-width/depth cases at a tall ceiling.

## Source assessment

- The new timber bench has a concrete responsibility: stock existing lower support decks and return the 0.82 m worktop height. It reuses the existing shelf stock/support contract rather than drawing unsupported piles. The raised shelf's top is reserved for its steamer stack; it is not also automatically filled with generic stock.
- Dining accessories and back storage remain within the room-side occupied modules and preserve the original movement footprint. The new upper storage remains on the kitchen side of the partition. Actual stock contact and table usability are independently checked by the test reviewer; their result should remain separate from visual density.
- The room finish is local to the restaurant, uses existing material bindings, and does not modify collision. Its floor is an explicitly documented flat 1 mm visual overlay; tile/grout tessellation remains coplanar rather than creating arbitrary walking bumps. Paint chips cluster near edges, and upper tiles no longer repeat the whole-wall brown band.
- Smaller hanging birds retain the existing hook and display-clearance construction. Independent visual review still needs to determine whether their scale and density actually match the paintover.
- Task lighting is confined to the study viewer. The display lights derive their positions from emitted lamp bounds; the fixed cook light is study-specific. These lighting changes are not exported production lights and should not be described as such.
- Selective cutaway clipping preserves furnishings and names its clipping policy in capture evidence. The shader-hook/ownership fix is necessary so the revised view does not silently change unrelated material response.

## Validation

Independently ran `node --test tests/aml-shop-depth.test.ts tests/aml-shop-shelves.test.ts`: **3 passed, 0 failed**. The test reviewer is running the expanded actual furniture, stock-support, occupied-table and low-ceiling checks. No production code was edited for this review.

## Final shading and capture follow-up

The capture now restores each original installed material and disposes its temporary clones after the two views, before the next trade unload. Both shader hooks remain preserved. The pantry height is bounded by room height, and the test reviewer reports that the eligible 4.4 × 5.2 × 2.08 m case passes.

Reviewed `furniture-occlusion.ts` and its bench/table/stool integrations. The wrapper copies occluder bounds and color multipliers, samples a short-range cosine-weighted hemisphere in assembly coordinates, and retains the existing geometry/UV/map path. Its present callers use rigid/reflected assembly frames, with scaled stock geometry emitted downstream into that frame. The proxy delegates non-append methods to their actual owner and does not replace collision. The approximation is explicitly base-color shading, not an exported physical AO texture. This limitation should stay visible in the handoff; it is not a reason to claim full baked global illumination.

Reviewed `ShopOcclusion`, the study-only GTAO normal pass. It uses material-specific clipping planes instead of the stock full-scene override, excludes transparent glazing from normal/depth evidence, and restores replaced materials, temporary visibility, scene override, renderer clear state and auto-clear in `finally`. Receiver materials are disposed between shop loads and on pass disposal. An independent synthetic render-failure probe verified those restoration paths and receiver cleanup. The real browser capture still remains necessary to judge actual AO/shadow quality.

The study viewer deliberately removes the blanket depth multiplier from the roast scene because that multiplier also attenuated the newly authored direct lights. Display lights remain based on actual lamp bounds; cook/dining lights are study-specific. The production change is the furniture vertex shading and named ceiling fixture grouping. The viewer lighting and postprocessing are presentation changes and do not become exported GLB lights.

Test review follow-up: the actual stock-support test's nested-shell exception originally required only a shared XY center and overlapping height. I requested XY containment/compatible lateral bounds as well so an oversized unsupported concentric object cannot bypass the contact check. The shared bowl model contains disconnected, overlapping nested shells, so a proportional exception for that actual construction is reasonable; it must not become a general floating-stock exemption.

Independent final TypeScript check passed. Source review has **no remaining blocking implementation finding** after the capture and low-ceiling corrections. Expanded AO and fixture tests are owned by the independent test reviewer. This is not an assertion of visual readiness, close reference fidelity, or completed global illumination.

## R14 fixture-lighting audit

This audit inspected the current viewer, actual pendant/tube construction, shell/finish planes, local Three.js source and the frozen R14 lighting comparison. No production or viewer code was edited.

### Findings and bounded correction

- The roast viewer still has a regular unshadowed point-light grid (1.5 cd each), plus cook/dining spots at hardcoded locations. These lights do not correspond to emitted fixtures. Their overlapping pools can brighten the central bench without a visible cause. Remove them for roast and derive task emitters from individual named fixtures.
- The global HemisphereLight (0.55) cannot cast shadows; the RoomEnvironment (0.2) also supplies unoccluded environment illumination. Neither observes room enclosure. Fixture-only evidence must disable both, along with the sun. Daylight-only evidence must disable fixture emitters. Any retained low ambient term in the combined art view is an approximation, not simulated room bounce.
- Current spot shadows retain the Three.js default near plane of 0.5 m. This excludes nearby shade/rail/shelf blockers. Start near 0.025–0.05 m, with the source outside its emitting face and far matching the meaningful light distance. Three.js updates the spot shadow far plane from nonzero light.distance.
- The current display angle 0.95 is a half-angle: about 109 degrees across. At a 1 m drop its outer pool radius is about 1.4 m. This is unnecessarily broad for the small shaded display lamps. A starting half-angle 0.55–0.70, penumbra 0.4–0.6 and distance around 3–4 m makes a more bounded pool; tune against the actual counter rather than compensating with albedo.
- The present ceiling-fixtures part also contains a fan/calendar/clock through amenities, and multiple battens share the part. Its aggregate bounds cannot locate real emitters. Name battens independently, including the first amenities batten. A tube can be approximated with one central or two low-power samples along its actual tube; the total output should stay bounded when increasing sample count.
- Use shadow-map resolution and receiver checks before increasing bias. At a 0.6 half-angle and 1 m distance, a 1024 map has roughly 1.3 mm projected texels. Start normalBias around 0.001–0.002 m and bias zero or a tiny negative value around -0.00005, then inspect direct-light-only images for acne versus detached shadows. Current sun map spans 14 m / 4096, about 3.4 mm per texel. A blanket large normal offset risks disconnecting the thin wall finish and contact shadows.

### Interpretation limits

The new room tile plane is 4 mm inside the original shell; grout is another 0.4 mm behind tile, with paint chips slightly forward. This is layered finish geometry, not evidence of coincident full wall planes. Thin layers can still expose shadow precision and sidedness issues. The installed PCF shadow renderer flips FrontSide/BackSide by default unless shadowSide is explicitly supplied, and honors local clip planes for shadows only when clipShadows is true. Preserve enclosure shadows for an inspection cutaway unless intentionally studying an open roof. Do not disable the wall's shadow casting as a blanket fix; isolate detail receivers/casters and verify the source first.

White/ivory surfaces and the ACES highlight curve contribute to washed-out bright pools but do not explain a light source. Palette hex colors are correctly converted to linear vertex values. Keep exposure fixed across isolated-light comparisons before changing material colors. The currently inspected comparison demonstrates stronger contact shadows, not a physically motivated final lighting rig.

Local source references: node_modules/three/src/lights/SpotLight.js documents candela intensity and its power = intensity * PI lumen convention; PointLight.js uses power = intensity * 4 * PI. Neither value is electrical watts. lights_pars_begin.glsl.js uses inverse-square decay at decay=2 and a smooth fourth-power cutoff for nonzero distance. LightShadow.js distinguishes normalized depth bias from world-normal displacement. SpotLightShadow.js defines the default 0.5 m near plane and twice-angle field of view. HemisphereLight.js explicitly states that it cannot cast shadows. tonemapping_pars_fragment.glsl.js applies exposure/0.6 before the ACES fit.

### AO test follow-up

Reviewed the three new furniture-occlusion tests. They exercise meaningful local hemisphere behavior, actual table joint versus exposed surface, color-only identity, immutable inputs, deterministic rigid/reflected placement, unwrapped-neighbor isolation, and survey/budget behavior. No blocking test finding. The test reviewer confirmed that nested stock now also requires lateral containment, closing the prior oversized concentric-object exception.

## R15/R16 emitter and cutaway bounds correction

Independent review found a blocking locator error in the first fixture-driven rig. Exported GLB parts share a complete scene POSITION accessor. Three.js GLTFLoader stores that accessor's global min/max as each primitive's geometry bounding box; Box3.setFromObject therefore reported whole-scene bounds for every emitter. Its precise option also iterates the whole attribute, so that option would not fix the issue. The first source audit repeated the same bounds operation and could accept detached lights.

I independently decoded R15 primitive indices: the two bulb centers are approximately domain (4.1475, .655, 2.32) and (2.9625, .655, 2.32); hood tube center is (3.2, 5.82, 2.064); ceiling tube centers are (2.4, .9, 2.704), (2.4, 2.8, 2.704), (2.4, 4.6, 2.704). These differ sharply from the shared accessor's global bounds. Root corrected the rig to transform only each primitive's referenced vertices, and the audit independently gathers referenced points and checks actual thin emitter extents. Console-error capture now catches shader compilation errors such as the sampler overflow seen with the first two-samples-per-tube rig.

The same mistake affected camera-near wall classification in capture-layouts.mjs. Parent assigned that one file to this reviewer. I replaced its whole-attribute bounds with transformed indexed-part bounds, retained the x-thin / high-x camera-near rule, updated world matrices first, and added actual per-wall bounds and clipping heights to capture evidence. The inspection cutaway continues to preserve enclosure shadows, with ceiling fixtures and high openings hidden only from the camera. Syntax check passed. Independent parent/test review and the frozen R16 capture are pending.

The new production bulb-emitter/tube-emitter child parts preserve the existing mesh shape while making actual luminous surfaces inspectable; each rear batten receives a unique parent and the hood receives an attached batten. Current rig uses one shadow sample per fitting, near .03 m and inverse-square falloff. This is a bounded point approximation of a tube, not an area-light simulation. The global low ambient approximation is labeled in the comparison, and fixture-only mode removes it. Source review does not certify final visual lighting.

Also reviewed the four focused stale restaurant-prop test corrections: actual choppingBlock atlas receiver; builtin-image reader; resolved brushed-metal selectors for ducts/cleaver; explicit untextured shop-timber override distinguished from generic timber's dedicated builtin-atlas fallback. These match existing supported material contracts without relaxing the geometry assertions. No blocking finding in those four changes; budget adjustments remain separately reviewed.

R16 live-browser follow-up: independently loaded the frozen GLB and verified all six actual world-space source positions: bulbs (4.1475, 2.276, -.655) and (2.9625, 2.276, -.655); hood (3.2, 2.04214, -5.82); ceiling tubes (2.4, 2.68214, -.9 / -2.8 / -4.6). These match the separately decoded primitive indices. No shader sampler/link error appeared. The console reported one resource 404, which root was asked to identify rather than silently ignore; shader precision and duplicate Three import messages were warnings.

Independently inspected the actual indexed wall positions: camera-near wall is named room-wall-left because the room frame is reflected, but lies at world X 4.794–4.797 and correctly selects the 0.35 m clip. The opposite wall at X .003–.006 selects 2.40 m, as does the full-width rear wall. This validates the geometric classification rather than relying on wall-name conventions. Capture pipeline evidence should still finish successfully before treating the new screenshots as accepted output.
