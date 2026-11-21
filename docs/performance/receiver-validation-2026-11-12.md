# Receiver coordinate validation

Receiver validation now reads triangle indices and coordinates directly. UV
receivers pass their finite-coordinate and bounds checks once. Preserved world
receivers project coordinates with scalar arithmetic in the original accumulation
order. This removes per-corner slices and callbacks and the duplicate preserved
UV traversal. UV tolerance remains 1e-6 and world-coordinate tolerance remains
1e-5. Repeating UVs must still be complete and finite. Sparse UV holes now fail
validation, closing a gap in the previous array iteration checks.

## Measurements

Windows x64, AMD Ryzen 5 9600X, Node 24.22.1. The isolated fixture contains 96,000
one-triangle receivers, 90% preserved UV and 10% preserved world coordinates,
with static samples. Frozen copies of the original and updated validation
functions run in one process in before/after/after/before order, four rounds.
The functions are extracted and type-stripped from the actual source. The real
cooperative work-slice implementation remains active.

Excluding the first warm-up round, median validation elapsed time is **102.13 ms
before and 74.81 ms after**, a 26.8% reduction in this synthetic workload. Including
the first round gives 108.73 ms and 76.93 ms. Separate-process experiments were
variable and reversed direction on repetition. The interleaved measurement
reduces ordering effects but does not control external machine load or establish
a full-scene speedup.

The baseline full Kowloon compile completed cold in 168.973 s with CPU profiling
and warm in 24.873 s without profiling. Baseline warm receiver validation took
1.524 s. The updated cold compile completed in 434.700 s, with validation taking
1.480 s. Its render hash, physical hash, triangle/vertex counts, complete appearance
record including generated-image hashes, and diagnostics matched baseline.

Other work changed shop source and texture assets during the updated run. Its
fingerprint changed, and a subsequent intended warm run started another cache
namespace and was stopped. These runs cannot establish causal timing improvement
or a frozen full-scene comparison. The updated cold run also overlapped brief test
and typecheck execution. No full-compile speedup is claimed.

The disk cache reached its 256 MiB quota during rebuilding. Its over-quota write
path sorts the complete inventory on each write. This warrants a separate profile
with frozen source and controlled cache state. Its contribution to the slowdown
has not been measured.

## Verification

All 30 targeted tests pass across receiver binding, raster integration, raster
groups and raster sampling. TypeScript checking passes. New receiver tests cover
UV and world tolerances, translated/rotated frames, repeating coordinates,
truncated/nonfinite/sparse UVs, failure atomicity and source-linked diagnostics.
Independent test and implementation reviews approved the change. The final
sparse-UV extension passed in the targeted run.

Texture density, shadow settings and geometry algorithms retain their previous
settings. No browser acceptance or full-suite pass is claimed. The subsecond demo
target remains unmet.

Raw measurements are in [the measurement record](receiver-validation-2026-11-12.json).
Local full profiles, source snapshots and the isolated benchmark driver are under
`generated/optimization-resume/` and are excluded from Git.
