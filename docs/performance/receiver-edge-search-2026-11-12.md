# Conservative receiver-edge search

The spatial search for existing vertices on receiver edges now rejects cells
whose expanded bounds cannot intersect the complete edge segment. The original
station and neighbor traversal order remains intact. The exact collinearity,
endpoint, ordering and duplicate rules are unchanged. Four times the existing
collinearity tolerance pads reconstructed cell bounds and slab calculations.

The warm CPU profile identified 1.414 seconds in candidate enumeration and
0.861 seconds in exact point checks. Capturing and replaying the real scene gave
2,218,984 input vertices and 59,550 face queries. All three before/after replays
produce the same raw Float64 triangulation digest, including per-query counts.
Median construction plus replay time falls from 2.941 seconds to 1.148 seconds,
a 61.0% reduction. Replay timings include output collection, exclude hashing,
and run on Node 24.22.1. JSON input capture does not preserve signed zero, which
is separately checked by analytic tests.

Full compiles use pinned Node 24.11.1 to match preceding isolated measurements,
an empty cache followed by three fresh warm processes, and one isolate. An
initial run using the shell's different Node version was stopped and excluded.

| Measure | Previous cache-read version | Edge search |
| --- | ---: | ---: |
| Cold compile, one run | 146.885 s | 141.418 s |
| Warm compile median | 18.238 s | 17.654 s |
| Warm range | 17.704–18.252 s | 16.503–18.341 s |
| Preserved-geometry binding median | 3.894 s | 2.439 s |

Binding falls 37.4% in these observations. The whole-compile difference is 3.2%,
with overlapping ranges and substantial variation in unchanged material work.
No precise causal whole-build speedup is established. All four new runs retain
stable source fingerprints and match every prior full-compile output record,
including physical/render hashes, appearance/image records and diagnostics.
The one-second preview-ready target remains unmet.

The surface-material suite passes 23 of 28 cases. The five failures concern
material-loader assumptions and dependent expectations. All five also fail with
the original edge implementation. Three receiver-conformance cases pass, including
new analytic coverage for cell-plane ties, accepted/rejected tolerances, endpoint
exclusion, reversed edges, translation by 1e8 meters, signed-zero ownership and
degenerate edges. TypeScript checking passes. Independent test and implementation
reviews approved the change. No full-suite or browser acceptance is claimed.

The full-compile evidence and replay measurements are retained in
[the isolated measurement record](isolated-demo-2026-11-12.json). Captured inputs,
original source, replay driver and logs are under `generated/isolated-performance/`.
