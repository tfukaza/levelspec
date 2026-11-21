# Rejected immediate raster shading experiment

The cold CPU profile attributed about 6.8 seconds of sampled self time to copying
material samples into three temporary rows. An experiment composed each output
sample immediately, wrote color and metallic/roughness channels into unpublished
output images, and retained only Float64 heights and unperturbed normals for the
later central-difference normal pass. Texture dimensions, composition arithmetic
and conservative admission allowances were retained.

The experiment is **not in production**. The original raster implementation and
its warm material cache were restored after measurement.

## Measurements

A 516 by 516 metal raster with three coatings was run in one Node 24.11.1 process,
interleaving original and experimental implementations. Garbage collection ran
outside each timed call. All six complete image digests matched.

| Implementation | Three runs | Median |
| --- | --- | ---: |
| Original | 412.465 / 382.306 / 362.214 ms | 382.306 ms |
| Experiment | 362.125 / 373.448 / 366.315 ms | 366.315 ms |

This small local gain did not carry through to ordinary full-scene compilation.
The experiment used a fresh material-cache namespace and one isolate, without a
module loader. The preceding production result is a separate cold cohort rather
than an interleaved control.

| Measure | Prior production | Experiment |
| --- | ---: | ---: |
| Cold compile | 130.481 s | 131.204 s |
| Material preparation/rasterization | 120.800 s | 121.302 s |
| Peak process RSS | 3,570,472 KiB | 3,970,128 KiB |

The complete output and appearance records match, including physical/render
hashes, triangle/vertex counts and all 18,666 generated image hashes. Source
fingerprints were stable within the experiment. No full-build speedup or memory
reduction is established. One observation cannot establish a regression either;
the evidence is insufficient to retain this additional implementation complexity.

## Review and retained coverage

Independent review found a supported callback case that the experiment failed
to preserve: deterministic `appearanceTint` may reenter a scratch-reusing
sampler. The borrowed sample then changes during composition. The original
implementation owns its saved samples and handles this correctly. The prototype
was removed rather than adding an exception to an unproven optimization.

Four tests remain because they protect existing behavior independently of this
implementation: exact layered output against the callback-bump path, derivative
halo semantics and tint visitation, iterator cleanup/recovery, and reentrant
scratch ownership. All 35 raster and texture-preservation tests pass after
restoration, as does typechecking. Independent test and implementation review
approve the retained coverage. The restored production file was verified to
match its pre-experiment snapshot exactly.

The current production benchmark remains the
[sixteen-read cache window](cache-read-window-2026-11-12.md): **11.858 seconds
warm and 130.481 seconds cold**. The one-second preview-ready target remains
unmet. Further raster work needs a representative full-scene benefit, not only
a faster synthetic material.

The `shading-cold` record and `immediateShadingReplay` in the
[measurement record](isolated-demo-2026-11-12.json) retain this rejected
experiment's evidence. Raw logs, both source snapshots, and the replay driver
remain under ignored `generated/isolated-performance/`.
