# Study implementation disposition

This review distinguishes superseded generation code from authored project
sources and distinct historical effects. It does not classify every broken old
import as a duplicate or remove project art to make an import scan pass.

## Removed after replacement proof

`projects/kowloon-building-polish/build.mjs` wrapped the retired TypeScript AML
compiler, GLB exporter and timing report, then packaged a static study viewer.
Its only repository callers were three commands in that project's README; no
maintained package script, tool or source module imported it.

The unchanged `study.aml` compiles through the supported native CLI with no
diagnostics, 160,722 vertices and 910 mesh records. The README now uses the pinned
native build and preview commands. The old wrapper was copied to the ignored
verification baseline before deletion. Its optional seed examples remain part of
the recorded study; current authoring changes the seed in AML. The distinct
static viewer, packaging helper, capture code, authored source and images remain.
The replacement native `build --out ... --json` also completed successfully and
published scene/collision GLBs, packet, glTF and report artifacts. Its JSON result
is retained as `building-polish-build.json` in the verification directory.

The larger implementation duplicates were already removed during extraction:
LevelSpec's Rust crate tree and shared reviewer modules now have one owner in
SuperSpec, and maintained package/tool consumers dispatch through the explicit
pin. The earlier TypeScript compiler and material implementation had already
been retired before this extraction. Their absence is not evidence that every
old project adapter has a matching native workflow.

## Retained with accurate status

| Study code | Why it remains | Current entry-point status |
| --- | --- | --- |
| `kowloon-posters/build-gallery.mjs` | Generates the explicit poster placement gallery from its design list | Native compilation of the saved gallery reports `AML_CHILD` for `<poster>`; no equivalent supported command is claimed. Artwork packing and saved sources remain. |
| `kowloon-market-produce/repair-tray.mjs` and `bake-trays.mjs` | Project-specific mesh repairs and atlas packing | Require the retired `jpeg-js` dependency and old publication paths. Native stock recipes do not replace this particular tray pipeline. |
| `storefront-study/bake-register.mjs` and `register-details.mjs` | Register-specific mesh repair, normal convention and texture processing | The bake needs retired `sharp` and old publication paths. The approved runtime catalog/maps are in SuperSpec. |
| `kowloon-tarps/material.mjs` | Intrinsic canvas micro-relief derived from its original artwork | Requires retired `sharp`; no matching native canvas recipe exists. The Blender model source and static study remain. |
| `dressing-demo/generate-ground-texture.mjs` | Generates the distinct local concrete images still used by studies and the sign demo | Preserved source art generator; these pixels differ from the registered common concrete maps. |
| Concrete and metal shader studies | Live shader controls backed by the existing Rust/Wasm study exports | Distinct supported effects, not duplicate AML editors or replacement MaterialSpec language work. |
| Ground, circulation and storefront custom viewers | Different transfer shaders, night lighting, room effects and recorded cameras | Historical dependencies/status are identified where their READMEs implied a maintained entry point. They are not silently replaced by a different lighting result. |

A read-only import inventory found 82 project scripts with 305 unresolved
relative imports into retired modules. None were in the maintained `tools/`
tree. These include gameplay probes, authoring helpers and frozen camera studies;
their incomplete old environment does not justify arbitrary deletion. The exact
inventory and replacement compilation evidence are retained under SuperSpec's
`generated/verification/demo-reorganization/`.

No source images, authored map geometry, saved model repairs or dated review
records were removed. Remaining product-language/editor proposals and performance
work are separate from this existing-code ownership pass.
