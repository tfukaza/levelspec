# Cooperative work during seam closure

Seam closure now shares the appearance compiler's existing eight-millisecond
cooperative work budget. Its three loops retain their original checkpoints every
4,096 entries, but await a host turn only when the budget has elapsed. Explicit
checks of the closure's own abort signal remain at each checkpoint and at the
end. Direct callers receive a fresh work budget by default.

This removes unconditional zero-delay timers, whose actual delay depends on the
host. Geometry, inspection order, source ownership and triangle limits are
unchanged. The budget is a checkpoint target, not a hard preemption guarantee:
one synchronous bridge or cap operation can run longer than eight milliseconds.

## Controlled comparison

Four fresh Node 24.11.1 processes compiled the detailed courtyard using one
isolate and the same warm material and decoded-image caches. Runs were ordered
timers, work slices, work slices, timers. A generated loader substitutes the
original `junctions.ts` only for timer controls; the new implementation runs
without a loader. Measurement records identify this loaded override explicitly,
because disk fingerprints do not include it.

| Closure scheduling | Compile runs | Compile median | Closure median |
| --- | --- | ---: | ---: |
| Unconditional timers | 11.166 / 10.613 s | 10.889 s | 780.689 ms |
| Shared work slices | 10.358 / 9.811 s | 10.084 s | 16.892 ms |

The observed closure-stage reduction is 97.8%. Whole-compile median falls 7.4%,
or 805 ms. The original timers primarily delayed the host rather than performing
geometry work. Unchanged stages still vary, so their differences are not
attributed to this change.

## Ordinary production runs

Both caches were archived before an ordinary cold run, followed by three fresh
warm processes. No loader was used for these runs.

| Run | Compile | Seam closure | Peak RSS |
| --- | ---: | ---: | ---: |
| Cold | 140.313 s | 18.946 ms | 3,371,560 KiB |
| Warm 1 | 10.059 s | 16.974 ms | 2,499,468 KiB |
| Warm 2 | 10.931 s | 26.643 ms | 2,667,432 KiB |
| Warm 3 | 10.734 s | 16.458 ms | 2,819,644 KiB |

The ordinary warm median is **10.734 seconds**, higher than the preceding
decoded-image-cache cohort's 10.316 seconds despite the reduced seam stage.
Cold compilation is also slower than its preceding 129.400-second observation;
material generation dominates that variation. The interleaved comparison better
isolates this change. No general memory improvement or cold-build speedup is
claimed.

The timer includes compilation, material-source resolution and navigation;
it excludes source reads before the compile call, fingerprinting, process startup,
browser GPU upload/first frame and export packaging. **The one-second
compiled-and-ready-for-preview target remains unmet.**

## Verification

All eight full runs match the prior physical/render hashes, 753,396 triangles,
1,672,716 vertices, complete diagnostics and appearance records, including all
18,666 generated image hashes. Disk source fingerprints remain stable within
each run, with the controlled loader substitution separately identified.
Texture and shadow resolution are unchanged.

Thirty-two tests across seam layers, receiver bindings and texture preservation
pass, as does typechecking. A new test queues host cancellation during 1,024
independent paired gaps, verifies interruption without changing source faces,
and confirms a fresh attempt produces all 2,048 expected closure triangles.
It controls elapsed work without asserting exact timer counts or wall time.
Independent preimplementation test review and final implementation review approve
the change. Previously documented unrelated suite failures remain; no full-suite
or browser acceptance is claimed.

The `junction-slices-*` and `junction-control-*` entries in the
[measurement record](isolated-demo-2026-11-12.json) retain all full-run evidence.
Raw reports, the original source snapshot, control loader and logs remain under
`generated/isolated-performance/`.
