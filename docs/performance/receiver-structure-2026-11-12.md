# Receiver structure without appearance sampling

Controlled metal producers now supply the receiver structure needed for raster
validation and planning without evaluating patina or pipe runoff. The declaration
contains height, ordered layer materials and weights, optional layer roughness,
and ordered coating materials. Metal always has zero geometric height and one
full-coverage layer; its coating presence still reads late assembly contacts when
queried, after construction. Registration does not eagerly resolve those inputs.

The optional `sampleStructure` callback is a **trusted producer declaration**:
it must agree with the corresponding projection of `sample` at every queried
coordinate. Only raster planning uses it; non-raster geometry retains actual
sampling. Local raster baking compares the declaration with its independently
owned actual reference sample before resolving sources, then retains the existing
pixel sampling and validation. That comparison is a diagnostic guard, not proof
over every coordinate, warm cache hit, grouped alias, or external executor.

The three participating producers are weathered metal components, pipes, and
water-tank shells. The declaration derives coating presence from the same rule
as full sampling. Deposit wrapping, reusable-recipe replacement and height-normal
rebinding clear stale declarations. Reusable eligibility still validates the
original receiver through an actual sample before replacing it.

## Controlled measurement

Four fresh Node 24.11.1 processes compile the detailed courtyard with one isolate
and both caches warm. Runs are ordered full sampling, declarations, declarations,
full sampling. A generated loader makes the structural-read helper call the full
sampler only for controls. The cache namespaces remain constant; measurement
records explicitly identify this loaded substitution because disk fingerprints
do not include it.

| Planning input | Compile runs | Compile median | Receiver-validation median |
| --- | --- | ---: | ---: |
| Full appearance samples | 10.497 / 10.316 s | 10.406 s | 1.263 s |
| Declared structure | 9.954 / 9.414 s | 9.684 s | 0.553 s |

Receiver-validation median falls 56.2%, or 710 ms. Total compile median falls
6.9%, or 723 ms. Other stages vary; in particular, this comparison does not
establish a reduction in the combined material-planning/cache stage.

## Ordinary production runs

Both caches were archived before the cold run. These four runs use ordinary
production code without a loader.

| Run | Compile | Receiver validation | Material stage | Peak RSS |
| --- | ---: | ---: | ---: | ---: |
| Cold | 132.674 s | 0.532 s | 124.085 s | 3,307,984 KiB |
| Warm 1 | 9.227 s | 0.538 s | 2.083 s | 2,758,860 KiB |
| Warm 2 | 11.985 s | 0.693 s | 2.693 s | 2,295,900 KiB |
| Warm 3 | 11.943 s | 0.787 s | 2.718 s | 2,462,108 KiB |

The ordinary warm median is 11.943 seconds, with substantial variation also in
unchanged stages. The controlled comparison above better isolates the change;
the fastest ordinary observation is not presented as typical performance. Cold
work still evaluates the appearance when rasterization needs it. No general cold
speedup or memory improvement is claimed.

Timing includes compilation, material-source resolution and navigation. It
excludes source reads before the compile call, fingerprinting, process startup,
browser GPU upload/first frame and downloadable export packaging. **The
one-second compiled-and-ready-for-preview target remains unmet.**

## Output and validation

All eight full runs match the preceding physical/render hashes, 753,396 triangles,
1,672,716 vertices, complete diagnostics and appearance records, including all
18,666 generated image hashes. Source fingerprints remain stable within each
run, with controlled loaded overrides recorded separately. Geometry, texture
resolution, normal maps and shadows are unchanged.

Fifty-six tests across metal fields, raster output, material caching, kit plans,
and real replay workers pass, as does typechecking. Added coverage independently
projects actual metal samples across kinds, coordinates and exposure cases;
checks lazy contacts and no appearance evaluation during structural sampling;
compares exact raster channels and diagnoses inconsistent declarations; protects
owned reference samples against callback reentry; verifies zero full-field
evaluations during an honest warm-cache compile; and checks wrapper invalidation,
height rebinding and non-raster fallback. Independent preimplementation test
review and final implementation review approve the contract and implementation.
Previously documented unrelated suite failures remain; no full-suite or browser
acceptance is claimed.

The `structure-*` and `structure-control-*` entries in the
[measurement record](isolated-demo-2026-11-12.json) retain the full-run evidence.
Raw reports, the control loader and logs remain under
`generated/isolated-performance/`.
