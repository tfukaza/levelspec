# MaterialSpec SDK and Material Editor

MaterialSpec is SuperSpec's code-first SDK for procedural materials. The first product milestone after the Rust port and SuperSpec handoff is a Material Editor where an author can open a scene or model, apply a recipe to a surface, and see code and parameter changes live. The editor and scene builds use the same material compilation and evaluation contracts. [SuperSpec modularization plan](spec-modularization.md)

## Material source and compiled contracts

Authors write versioned material modules with imports, typed public parameters, defaults, seed inputs and asset references. SDK helpers let them define and compose fields, build surface layers and produce PBR channels. Themes and projects can import common concrete, grime or metal recipes, supply presets, and author their own materials through the same interface. Saving a material preserves its source, dependencies and presets. Compiled programs and baked maps are derived artifacts.

Have the compiler expose the material's parameters, dependencies, output channels and required inputs to the host. The renderer uses that contract to evaluate the material live. A baker uses it to evaluate the same material over a texture or surface mapping. Preserve source locations for compilation and dependency errors. Leave the source language and compiled representation open until a prototype exercises both browser preview and native builds.

## Composable SDK helpers

A field evaluates a value at a sample location. Its inputs identify the coordinate space and any required seed or sampling footprint. Fields can yield scalar values, vectors or colors. Helpers can take another field as input so an author can scale, warp, combine or reuse a result without repeating the sampling logic. User-authored helpers follow the same conventions as SDK helpers.

| Helper family | Initial operations |
| --- | --- |
| Noise | Seeded gradient noise for smooth variation, cellular noise for grains and pits, and fractal noise for detail at several scales. |
| Coordinates | Scale, offset, rotate, repeat and warp coordinates. Provide UV, object-space and world-space inputs. Expose physical repeat and feature size in meters. |
| Masks | Derive coverage from noise thresholds, height and distances to features. Remap ranges, soften edges and combine masks. |
| Material channels | Blend base color, roughness and height with a shared mask. Derive normal detail from height where appropriate. Declare channel and color-space conventions. |
| Surface mapping | Supply texture coordinates and coverage for authored UVs, projection and gravity-aware edge runoff. Receivers and source edges come from the scene or the item. |

Document each helper's parameter units, output range and sampling behavior. Derive named seeds for independent effects so tuning one effect can leave unrelated patterns stable. Define the material in surface, object or world coordinates. Use object space for detail that follows a prop and world space for continuity or gravity-dependent effects. A live renderer can supply a pixel footprint for filtering. A baker supplies a texel footprint. Helpers requiring scene depth, color or other view inputs declare those dependencies explicitly.

### Reference recipe for chipped concrete

Compose a concrete base from aggregate-scale variation and fine surface detail. Use coarse noise to locate chipped patches, warp the coordinates to break up their outlines, and add fine noise near the boundary. Reuse the resulting chip mask to vary color, roughness and height together. Keep the height and chip dimensions in physical units. Add edge runoff as a separate layer using a shared grime image and the receiver's downhill mapping. The same grime image can serve multiple slopes.

Use this recipe to exercise the general-purpose helpers. Then author a painted-metal recipe using the same noise, mask and layer operations. Preview intermediate fields on the selected mesh so an author can inspect chip coverage, runoff coverage and height directly before judging the combined material under lighting.

## Opening and inspecting scenes

| Entry point | Behavior |
| --- | --- |
| **Open AML** | Build through SuperSpec's ordinary AML and asset-loading path. Preserve authored placements and bindings. Accept the same standalone files and companion folders as the Level Viewer, including scenes from LevelSpec's `demos/` library. |
| **Open 3D Model** | Import a model into the shared 3D representation with its hierarchy, transforms, meshes, UVs and material slots. Start with GLB as the first supported format and add import adapters through the same boundary. Resolve model companions when a supported format needs them. |

Both paths use the same viewport, selection and material assignment workflow. Pick a surface or a material slot, then apply a preview override to that slot or to all slots sharing the selected binding. Display the current assignment and allow the author to restore it. Preview overrides belong to the editing session. Saving a recipe writes its source and presets as reusable content. The original AML or model file remains intact during preview and recipe saves.

Provide live mapping controls alongside recipe parameters. Use existing UVs when suitable, offer object-space projection for models with missing or unsuitable UVs, and use world-space mapping for effects that need it. Preserve model dimensions through import and expose physical scale so the same recipe produces a consistent feature size on an AML wall and an imported test panel.

## Editing and hot reload

Provide source editing with location-linked diagnostics, controls from public parameter declarations, and a live lit preview. Allow channel and intermediate-field inspection on the selected surface. Use the shared asset system, generation runtime and preview renderer. Retain the current model, selection and camera during material edits. On compilation failure, keep the last valid material visible and show the error at the source location. Publish the latest successful revision when its inputs still match the editor state.

Track module source and imports, referenced textures, parameter values and any receiver inputs through the shared dependency graph. A source edit recompiles affected modules. Parameter edits reuse compatible compiled code and update bindings or bakes according to their declared dependencies. Identical effective bake requests share cached results. Camera movement changes filtering during rendering. It can reuse compiled material code, textures and receiver mappings. Exporter requests texture bakes or reports unsupported view-dependent effects through its target capability contract.

## First milestone and acceptance

1. Establish the source compilation contract and a small SDK that can express the chipped-concrete recipe. Verify seeded repeatability, physical scale and consistent material channels in live preview and baking.
2. Open a GLB test panel and a courtyard AML scene. Apply the same recipe to a selected slot in both. Exercise the same AML through the Level Viewer and check that it resolves the same authored assets and bindings.
3. Change chip scale in code and adjust a declared parameter. Inspect the chip mask and final material at close range and at a distance. Check that the physical feature size matches across both test surfaces and that filtering responds to the view.
4. Try a source error and a missing dependency, then correct both. Verify that the last valid preview remains available during failure, the corrected revision publishes, and model geometry, selection and camera survive the material edits.
5. Save and reopen the material source and use it in a WorldSpec theme. Confirm that repeated bindings reuse compatible compiled and baked artifacts. Apply one grime image across differently angled planar receivers and verify that slope edits update the mapping while reusing the image.
6. Exercise the same SDK helpers in a painted-metal recipe. Record cold compile time, edit-to-preview time and jobs reused after an appearance-only edit.

Implementation starts after the Rust port is complete. The first import format, helper set and example recipes are proposed milestone choices. Select the authoring language and compiler strategy by exercising this workflow on the native and browser paths.
