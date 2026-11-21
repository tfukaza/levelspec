# SuperSpec demo ownership

The following source moves were reviewed before implementation. They complete the
maintained AML demo inventory without duplicating authored scenes or moving active
project sources and frozen review evidence indiscriminately.

| Source | Canonical demo | Disposition |
| --- | --- | --- |
| Former editor courtyard | `demos/courtyard/scene.aml` | Already moved with its original three companions. |
| `examples/dust2.aml` | `demos/dust2/scene.aml` | Byte-identical complete sample map; no companions. Update maintained sample acceptance and reference commands. |
| `projects/kowloon-signs/material-study.aml` | `demos/sign-weathering/scene.aml` | Preserve IDs, geometry and material parameters. Change only companion references as listed below. |

The sign study's signboard, rust, timber, metal, lettering and roofing images
match the registered SuperSpec catalog bytes exactly, so they use their normal
`levelspec-material:` identities. Its repaired concrete, plaster and ground
concrete remain distinct images under the demo's `textures/`. Their original
shared project art remains available to other historical studies. The demo's
`provenance.json` records every source image and hash.

Daiban remains a maintained bounded reference study under `examples/`. The
standalone concrete and metal shader studies retain their distinct live shading
behavior and evidence; they are not ordinary AML scenes and are not presented as
MaterialSpec editors. The former ground-transfer page depends on retired
TypeScript modules, and its README identifies it as historical. The dressing
project retains its source and evidence, with current opening instructions
pointing to the canonical courtyard demo.

Historical project scripts that imported the retired TypeScript compiler are
preserved as evidence, not restored as supported entry points. A read-only scan
found 82 such project scripts with 305 missing relative imports and none in the
maintained `tools/` tree. This is an inventory, not permission to remove unrelated
project code. Supported commands use the pinned SuperSpec native/browser boundary.

Verification compares the frozen native output with the moved sources, then
opens copied demo folders through the common browser flow. Dust II must retain
its complete packet; the sign study may change only source ranges and companion
identities corresponding to its explicitly rewritten paths. Geometry, pixels,
material values, generated names, collision and validation must remain intact.

## Verified result

- Dust II's complete native packet is byte-identical before and after the move:
  4,123,672 bytes, SHA-256 `cb897b828854a876fca46c99b9747088ab21444213184a3c6f86e7f9bfaf7048`.
- The sign study's entire geometry and image payload is byte-identical. Every
  manifest field matches after applying only the nine companion identity changes
  (ten source occurrences) and their computed source-range deltas. It retains
  90,679 vertices, 502 mesh records and 1,454 image records.
- Copying the sign folder to a different path preserves the complete native packet.
- Both relocated folders open in the built shared editor. Removing a required local
  companion reports its path while retaining the prior source, scene and camera;
  restoring it and selecting the same folder succeeds.
- Each relocated source produces the same complete packet in native Rust and the
  actual browser Wasm worker. No browser page errors were observed; the facade
  screenshot was inspected for complete materials and usable controls.

Local verification artifacts are retained under SuperSpec's ignored
`generated/verification/demo-reorganization/`. These are correctness comparisons,
not performance measurements.
