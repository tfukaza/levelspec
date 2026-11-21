# Storefront crates and shipping cartons

The production wooden crate uses one timber atlas family per crate, with restrained
0.96–1.04 board brightness variation. Slats have slightly uneven edges and sparse,
seeded chips. Their grain remains continuous along the broad faces. The bottom is
closed and the original interior support reservation and stock-placement random
stream are retained.

Shipping cartons retain their rectangular envelope, grounded base and central
stacking surface. Corner compression is deliberately small. Most wear lives in
the shared PBR atlas: warm brown liquid stains with irregular drying boundaries,
muted dirt, fibers and rubbed edges. Ink multiplies the kraft paper on the front
only. Other sides are unprinted; the lid has a separate taped flap seam and spill
pattern. Four appearance variants share the existing atlas and materials. A carton
uses 48 triangles (40 when the supported underside is omitted).

## Reference observations

- [User cardboard reference](references/user-cardboard.jpg): battered seams,
  faded direct printing, warm brown stains with distinct irregular drying edges;
  broad surfaces still retain their shape. The final direction reduces generic
  smoky mottling and emphasizes absorbed liquid.
- [User crate reference](references/user-crates.jpg): related wood tones within
  each crate, longitudinal grain, rough edges, local chips, sound corner posts.
- [Used orchard crates](https://kistenkontor.de/obstkisten-elfriede-b-ware): worn
  slat ends and handled edges while retaining useful container construction.
- [Delivered packaging photographs](https://www.top-opakowania.pl/artykuly/jak-wygladaja-paczki-po-odebraniu-przez-klienta-galeria): corner compression and
  creases are localized; these informed the initial shape pass, later reduced at
  the user's request.

Reference photos guide observation only. No reference photograph is projected onto
the mesh. Printed artwork comes from the existing original packaging-label art;
its source hash and bake recipe hash are in [material-bake.json](material-bake.json).
No generation service or new paid asset was used.

## Reproduce

From the repository root, with the Rust material tool and Node 24 for the browser study:

```powershell
superspec-materials shop-cartons . generated/shop-cartons
node projects/storefront-containers/build-study.ts after
node projects/storefront-containers/build-study.ts store
node projects/storefront-containers/capture.mjs after
node projects/storefront-containers/capture.mjs store
```

Capture uses installed Chrome through Playwright and a temporary Vite server on
port 5191. Images and runtime mesh studies are written under ignored
`generated/storefront-containers/`. The browser study uses production geometry,
the actual PBR maps, fixed exposure, and matched camera/light settings. Its orbit
controls permit side/rear inspection. The original before captures and original
texture snapshots remain in that generated directory; rebuilding a `before`
study from current code is not a way to recover the old geometry.

The carton baker writes updated atlases to a new directory. The standard
`bake-liquor-props.py` Blender workflow invokes it after stock generation and
publishes the maps to the built-in material library with updated provenance hashes,
so regeneration retains the separate lid and direct-print finish. Unrelated atlas
pixels are unchanged.

## Validation

- Four focused container tests, three targeted stock-appearance/support tests,
  and three material-library tests pass; TypeScript
  checking passes. Tests cover coherent crate palettes, stock RNG preservation,
  repeatable chips, bounds, closed carton topology, outward normals under mirrored
  hosts, stable support, face-specific UV charts and built-in PBR agreement.
  Changing the printed variant preserves geometry. Support inspection recognizes
  the complete subdivided carton shell and uses the actual bound timber materials.
- Existing representative grocer triangle budgets and physical isolation checks
  pass. The captured 3.1 × 3.2 m greengrocer study uses 32,634 triangles.
- Broader timber/grocer tests retain four pre-existing failures, reproduced from an
  isolated HEAD baseline: fallback-material expectations, a built-in texture export
  resolver, and two legacy timber classification checks. The building-shop suite
  also hits a pre-existing surface appearance chart-budget failure; a representative
  case reproduces the identical diagnostic on HEAD. These unrelated issues were
  not changed as part of this prop-art pass.
- Independent test and implementation reviews checked production integration.
  The review caught the separate built-in atlas copy and stock regeneration path;
  both are updated alongside the demo material.
  Final follow-up review also verified variant invariance and the three-chart
  support inspection. No material correctness findings remain open.
