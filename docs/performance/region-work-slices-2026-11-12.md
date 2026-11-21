# Shared work slices during region construction

Displaced receiver generation now uses the compile-owned `SurfaceWorkSlice` at
the three existing yield locations. Each chart, yielded subdivision checkpoint
and batch of 1,024 region records checks the shared eight-millisecond budget.
Only an expired slice yields a host turn. Existing abort checks, geometry order,
sampling order, triangle budgets and detached publication remain intact.

This removes unconditional zero-delay timer waits. Cancellation stays
cooperative; synchronous work between checkpoints can exceed eight milliseconds.
The existing work-slice implementation uses `setImmediate` in Node and
`MessageChannel` in browser hosts.

## Captured default-scene replay

A normal default compilation captured the real region-building inputs, including
live samplers and raster bindings. The scene has 96,623 charts, of which 116 use
displaced region generation. Each replay owns independent staging arrays while
retaining the same input geometry and callbacks. Complete output hashing happens
outside the timer.

| Replay order | Time |
| --- | ---: |
| Before | 5.038 s |
| After | 3.646 s |
| After | 2.672 s |
| Before | 5.070 s |

The two-sample medians are 5.054 and 3.159 seconds, an observed 37.5% reduction.
All complete mesh, surface and material JSON digests match. This replay includes
region construction, preserved-geometry binding and seam closure. It is a
same-process comparison, not an independent full-build benchmark.

## Full compilation

Node 24.11.1, one isolate, unchanged source, texture density, shadow resolution
and navigation match the preceding measurements. An empty material cache is
followed by three fresh warm processes.

| Measure | Result |
| --- | ---: |
| Cold compile | 135.738 s |
| Warm compiles | 14.410 / 14.420 / 13.888 s |
| Warm median | 14.410 s |
| Receiver-generation interval median | 0.107 s |
| Warm peak RSS median | 2,890,652 KiB |

The preceding ordinary warm runs took 21.515 and 18.994 seconds, with receiver
generation around 1.9 seconds. Other stages also vary, so the full-build decrease
cannot be attributed entirely to scheduling. The captured replay isolates the
phase benefit. All four new full compiles have stable source fingerprints and
match the previous physical/render hashes, triangle and vertex counts, complete
appearance manifest, generated texture hashes, diagnostics and source digest.

Compilation includes navigation but excludes source reads, fingerprinting,
browser upload/first frame and downloadable export packaging. The one-second
compiled-and-ready-for-preview target remains unmet.

## Verification

Twenty-two selected receiver, appearance and scheduler tests pass. The one other
selected test fails during recovery on the previously documented
`levelspec-material:metal.png` resolver expectation; it is not a new scheduling
failure. TypeScript checking passes. Independent test and implementation reviews
approved the change.

The strengthened large-receiver test queues cancellation during actual region
sampling. A second test queues cancellation while processing a series of small
displaced receivers. Both verify interruption before generation completes,
unchanged published state and a successful fresh build. Both passed before and
after implementation. Existing tests cover Node and MessageChannel work-slice
yielding, immediate abort checks, geometry ownership and exact output behavior.

Compact full-run and replay evidence is in
[the isolated measurement record](isolated-demo-2026-11-12.json). Local source
snapshots, replay driver and logs remain under `generated/isolated-performance/`.

## Next measured opportunity

A separate experiment hashes the current complete render state after an ordinary
warm compile. Three interleaved JSON-hash runs take 835.990/836.341/835.001 ms.
A binary numeric-array prototype takes 117.947/110.502/101.602 ms. Each variant
returns a stable digest, and the JSON result matches the compiler's render hash.
Garbage collection runs outside each timed section.

The prototype is not production code. It intentionally changes the identity
format and currently assumes a little-endian machine. Adoption requires a
versioned portable encoding, complete mesh/material/appearance dependency
coverage, snapshot ownership checks and an audit of artifact invalidation.
The experiment and source fingerprints are retained under
`renderHashExperiment` in the measurement record.
