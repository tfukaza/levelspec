# Isolated default-demo benchmarks

The one-second target is the detailed Kowloon courtyard compiled and ready for
preview, including appearance and navigation. Downloadable export packaging is
outside this target. These measurements cover the compiler call. Process startup,
source reading, fingerprinting, browser upload and first-frame presentation are
excluded, so they do not establish end-to-end preview readiness.

## Isolation and method

The managed worktree is `C:/Users/tomok/.codex/worktrees/demo-build-optimization/levelspec`,
on `codex/demo-build-optimization`, based on `14ae270`. The scene and assets come
from that checkpoint. The earlier receiver-validation change was copied into this
worktree. Concurrent shop work in the original checkout is excluded.

Each variant ran once with an empty material cache, followed by three fresh-process
warm compiles. Cache directories were archived between variants, preventing quota
eviction across variants. One earlier comparison was stopped after discovering
shared-quota interference and is excluded. All completed measurements used one
JavaScript isolate, the default detailed preset, unchanged texture/shadow settings,
and navigation enabled. No tests ran alongside these measurements. Other work on
the same computer can still affect CPU and filesystem timing.

Environment is Windows x64, AMD Ryzen 5 9600X, Node 24.11.1. Each of the twelve
completed runs has stable source fingerprints. Physical/render hashes, triangle
and vertex counts, complete appearance records including generated-image hashes,
and diagnostics match across all twelve runs.

## Results

| Variant | Cold compile | Warm runs | Warm median | Material-stage median |
| --- | ---: | --- | ---: | ---: |
| Checkpoint | 157.536 s | 19.363 / 19.717 / 20.368 s | 19.717 s | 3.711 s |
| Receiver validation | 155.669 s | 17.986 / 17.524 / 17.175 s | 17.524 s | 3.206 s |
| Validation plus concurrent cache reads | 146.885 s | 18.252 / 17.704 / 18.238 s | 18.238 s | 2.043 s |

The material stage falls 36.3% relative to validation alone. Whole-compile median
increases 4.1% for that comparison. Unchanged dressing and binding stages also
slow down, so these runs establish neither a whole-compile improvement nor a
causal regression from concurrent reads. The final median is 7.5% below the
checkpoint observation, with the same attribution limitation. Cold observations
have one sample per variant. The one-second target remains unmet.

## Cache-read change

The compiler can overlap up to four cache operations when the host explicitly
sets `supportsConcurrentReads`. Ordinary custom caches keep serial behavior,
including adapters that reuse borrowed storage. The disk cache opts in because
its reads own independent buffers.

The window includes completed results awaiting ordered consumption. Admission
also considers two raw-image equivalents per job against remaining image
headroom. This is an estimate, not a hard bound on PNG, JSON/base64 or host
allocations. A single oversized job retains serial progress. Publication remains
in source order, and corruption regenerates the original job. Rejections are
handled when work starts, cancellation prevents late publication, and staging
failures retain the owning receiver's diagnostic context.

## Validation and limitations

Twenty-three targeted cache, raster-executor and receiver-binding tests pass,
including ordered mixed hits/misses, bounded completed lookahead, shared-buffer
serial adapters, cancellation with late failures, and low-headroom serial
progress. TypeScript checking passes. Independent test and implementation
reviews approved the change after correcting staging error attribution and
clarifying the memory estimate.

The separate three-test disk-cache suite passes two tests and intermittently
fails atomic replacement on Windows with `EPERM` during concurrent writes.
Removing the sole disk-cache change reproduces the same failure on five repeat
runs, after one passing baseline run. This pre-existing Windows replacement issue
remains unresolved. No full-suite or browser acceptance is claimed.

## Next work toward one second

The final warm compile still spends several seconds constructing dressing and
rebuilding preserved geometry buffers. Receiver binding, geometry allocation,
source-image decoding and finalization need fresh CPU/allocation profiling before
further representation changes. Cold generation also evaluates approximately
95 million channel-texels. Achieving one second requires substantial reductions
in repeated geometry and material work. The cache-read experiment alone cannot
meet that target.

[Machine-readable measurements](isolated-demo-2026-11-12.json) retain stage timings,
source identities, memory observations and output digests. Full local reports,
logs and archived caches are under `generated/isolated-performance/`.
