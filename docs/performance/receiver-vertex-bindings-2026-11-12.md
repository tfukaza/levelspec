# Dense receiver-vertex bindings

Preserved geometry now stores each source vertex's first receiver and output
index in two Uint32 arrays. Additional receiver ownership uses sparse maps only
where source vertices are shared. Untouched geometry uses owner zero, and output
indices are stored plus one so output vertex zero remains distinguishable from
an unbound input. The existing flat JavaScript attribute-array limits bound all
stored indices within Uint32 range.

This preserves source-order emission, independent ownership across receivers,
untouched geometry, callback order and repeated-index handling. It removes the
per-receiver maps for ordinary independent dressing vertices. The dense tables
cost eight bytes per input vertex, including unused or displaced vertices, so
this representation can consume more memory on sparse inputs with few retained
vertices.

## Captured scene comparison

A baseline compile captured the real region-building arguments, including live
samplers and raster bindings. Before/after/after/before runs used independent
staging copies and retained the same input mesh. Region construction, output
mesh copying and seam closure are timed; JSON digest computation is excluded.

The before runs took 5.268 and 6.069 seconds. The after runs took 4.949 and
5.119 seconds. The two-sample medians are 5.669 and 5.034 seconds, an observed
11.2% reduction. All four complete mesh/surface/material JSON digests match.
These runs reuse one process and captured callbacks; they are not independent
full-compilation measurements.

## Full compile

The default detailed Kowloon courtyard, texture density, shadows and navigation
remain unchanged. Node 24.11.1 and one isolate match the prior benchmark. The
variant receives an empty material-cache directory, then three fresh warm
processes. All four new runs have stable fingerprints and output records matching
the sixteen preceding isolated runs.

| Measure | Previous edge-search version | Dense bindings |
| --- | ---: | ---: |
| Cold compile, one run | 141.418 s | 150.499 s |
| Warm compile median | 17.654 s | 15.839 s |
| Warm range | 16.503–18.341 s | 15.094–17.941 s |
| Preserved-geometry binding median | 2.439 s | 1.999 s |
| Peak RSS median across warm processes | 3,226,184 KiB | 3,070,132 KiB |

The observed binding reduction is 18.0%; whole-compile median is 10.3% lower.
Other stages vary, ranges overlap and cold compilation is slower. These are
measured observations, not a precise causal full-build percentage. The RSS
observation is a whole-process high-water mark and does not isolate the binding
allocation change. The one-second preview-ready target remains unmet.

## Verification

Fifteen focused receiver-binding, raster-integration and raster-executor tests
pass, along with TypeScript checking. A new normal-entry test exercises three
interleaved owners, both receiver-first and untouched-first ordering, output
vertex zero, noncontiguous receivers and degenerate repeated indices. It checks
exact output indices, all vertex attributes, solid IDs, source roles, input and
collision ownership, and tint callback counts/order. It passes before and after
the change. Independent test and implementation reviews approved the cutover.

The previously documented material-loader and Windows atomic-cache-replacement
failures remain outside this change. No full-suite or browser acceptance is
claimed. Exact full-output and replay evidence is in
[the isolated measurement record](isolated-demo-2026-11-12.json). Local source
snapshots, live replay driver and complete logs are under
`generated/isolated-performance/`.
