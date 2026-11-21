# Consuming SuperSpec

LevelSpec owns AML authoring. Its `crates/aml` emits XML from an editable draft
and checks it with SuperSpec's shared AML reader. The AML schema, native and
Wasm reader, scene assembly, physical checks and preview live in the sibling
SuperSpec repository.

`superspec.lock.json` pins a source distribution by SHA-256. The launcher verifies
the actual implementation and asset bytes against both that pin and SuperSpec's
distribution manifest before dispatch. See [SuperSpec](../../superspec/README.md)
for build commands, module ownership and known PoC limitations.

The [reorganization closeout](../../superspec/docs/plans/reorganization-status.md#verification)
records the current reviewed source, repaired test baseline and native/Wasm/browser
acceptance. Earlier extraction and rename records retain their milestone-specific
hashes and results.

Use `npm run levelspec -- <arguments>` for the native CLI, `npm run dev` for its
browser editor and `npm run test:engine` for AML source and sample-map acceptance.
`tools/rust.ps1 build` builds the pinned SuperSpec native CLI. Its `wasm` task
builds the shared browser host and writes its bindings to the generated viewer
inputs. `RUST_CLI` selects an explicit built native executable for testing.

The same development server exposes `/material.html` and `/item.html` for the
MaterialSpec and ItemSpec studios. Save their editable projects, then use
`npm run studio -- check|scene|glb <project.json>` for the pinned native authoring
path. `STUDIO_CLI` selects an explicit authoring executable; otherwise the launcher
uses `superspec-studio` beside `RUST_CLI` or in the engine's release directory.
For binary stdout redirection, invoke `node tools/superspec.mjs studio scene|glb`
directly, or use npm's `--silent` option to omit its script-status lines.
`npm run test:studio:browser` runs the production editor acceptance. See the
[authoring guide](../../superspec/docs/AUTHORING.md) for language syntax, item
definitions, bundled companions and WorldSpec placement.

To adopt a reviewed engine change, regenerate SuperSpec's distribution manifest
with `node tools/source-manifest.mjs write`, then update this repository's pin to
that SHA-256. Rebuild native/Wasm/browser artifacts from the selected source.
Source verification does not attest the provenance of an explicit binary override.

CI requires the published SuperSpec commit matching the content pin. Supply its
40-character commit SHA through the workflow input or repository `SUPERSPEC_REF`
variable after publishing. Until that revision exists remotely, CI reports the
missing prerequisite instead of selecting an arbitrary branch.

The [demo library](../demos/README.md) owns the courtyard, sign-weathering material
study and Dust II map. The courtyard retains its original companion paths. Open the whole folder, or select an AML file and
its companions together. Historical study evidence remains under `projects/`;
scripts that depended on the already-retired Node backend are not revived by this
extraction. Active Blender ingestion adapters write implementation catalogs and
images into SuperSpec and retain source art in LevelSpec.

[Demo migration](reviews/superspec-demo-migration.md) records the relocated-source,
companion and browser checks. [Study disposition](reviews/superspec-study-disposition.md)
identifies the removed build wrapper, its verified native replacement and the
distinct historical generators retained with their original art.

The material studies and standalone catalog/artwork adapters use SuperSpec's
owned catalog and image paths. Old `kowloon-market-produce/bake-trays.mjs`,
`storefront-study/bake-register.mjs`, and `kowloon-tarps/material.mjs` still depend
on `jpeg-js` or `sharp`, which were removed from the supported package during the
earlier Rust cutover. This extraction does not restore those legacy entry points
or claim that their frozen evidence is a current regeneration workflow.
