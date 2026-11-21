# Bounded concurrent material-cache reads

Caches that explicitly support independently owned concurrent read results now
admit up to sixteen unconsumed reads, up from four. Completed results retain their
slots until consumed in source order. The existing estimated image-memory
headroom still limits admission; an oversized first artifact runs alone. Caches
without the capability remain serial. Cancellation and failed reads retain the
existing settlement and recovery behavior.

## Controlled comparison

Fresh Node 24.11.1 processes compiled the detailed courtyard with one isolate and
the same warm material cache. A generated module loader changed only the read
window, leaving the compiler fingerprint and cache namespace stable. The recorded
disk source fingerprint therefore does not describe this substituted literal;
each experimental record explicitly identifies its loaded override.

| Window | Compile runs | Compile median | Material-stage median |
| --- | --- | ---: | ---: |
| 4 | 12.399 / 12.906 s | 12.653 s | 2.521 s |
| 16 | 11.720 / 11.883 s | 11.801 s | 2.026 s |
| 64 | 11.839 s | One observation | 2.044 s |

Runs were interleaved in the order 4, 16, 64, 16, 4. The sixteen-read window
reduces the observed material-stage median by 19.7% and whole compilation by
6.7%. Sixty-four gives no additional benefit in this experiment. These are small
cohorts, and unchanged stages vary.

## Ordinary production compilation

After changing production code, the preceding material cache was archived and a
new cold run populated the new compiler namespace. These runs use no loader.

| Run | Compile | Material stage | Peak RSS |
| --- | ---: | ---: | ---: |
| Cold | 130.481 s | 120.800 s | 3,570,472 KiB |
| Warm 1 | 11.892 s | 2.147 s | 2,375,512 KiB |
| Warm 2 | 11.858 s | 2.005 s | 2,817,980 KiB |
| Warm 3 | 11.454 s | 1.990 s | 2,833,028 KiB |

The warm compile median is **11.858 seconds**, compared with the preceding
binary-hash cohort's 13.372 seconds. The controlled comparison above better
isolates the read-window effect. Warm peak RSS median rises from 2,496,016 to
2,817,980 KiB between these cohorts. Memory admission uses an estimate rather
than a strict process-memory limit; no memory reduction is claimed.

The timer includes compilation and navigation, excluding source reads,
fingerprinting, process startup, browser GPU upload/first frame, and export
packaging. The user's target is compiled and ready for preview within one
second. **The target remains unmet for both cold and warm compilation.**

## Output and validation

All five controlled runs and all four ordinary runs retain the complete prior
output and appearance records: 753,396 triangles, 1,672,716 vertices, 96,623
charts, 94,961,643 channel texels and all 18,666 generated image hashes. Render
and physical hashes match exactly. Source fingerprints remain stable within
every run. Texture and shadow resolution are unchanged.

The cache and raster-executor selection passes all eighteen tests. Updated
fixtures cover the sixteen-result window, reversed completion, corrupt entries,
ordered publication, cancellation and late-error settlement. Existing tests
retain byte-headroom admission and serial borrowed-buffer behavior. TypeScript
checking passes. Independent test review preceded the production change, and
independent implementation review found no blockers. This is focused validation,
not a claim that the repository's full suite passes; previously documented
unrelated failures remain.

The complete measurement records and a subsequent CPU profile are retained in
[the isolated measurement record](isolated-demo-2026-11-12.json), under
`cache-fanout-*`, `cache-read16-*` and `cacheRead16Profile`. Local logs, loader,
recording script and raw profiles remain in `generated/isolated-performance/`.
The profile points to procedural mesh assembly, pipe-runoff preparation during
receiver validation, PNG decoding and receiver binding as remaining CPU work.
Stage sample attribution is approximate because profiler and compiler timers
start at slightly different points.
