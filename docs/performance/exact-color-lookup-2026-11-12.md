# Exact quantized color lookup

Raster RGB encoding now uses an 8 KiB table of constant-byte intervals. Both
endpoints must map to the same output byte under the existing sRGB formula.
Intervals containing a byte transition, values outside `[0, 1)`, and nonfinite
values retain the original scalar calculation. Power-of-two interval scaling
avoids extra rounding when choosing the interval. Alpha, packed material maps,
normal maps and image dimensions retain their existing paths.

This changes no public API or sampling contract. It approximates neither color
values nor texture resolution. Independent test and implementation reviews
approved the change.

## Local evidence

A cold default-scene CPU profile before this change sampled 1.624 seconds in
`srgb`, 2.941 seconds in `writePixel`, 14.393 seconds in `rasterizeSurface`,
10.955 seconds in `sourcePixel`, and 8.793 seconds in `fractalNoise`. These are
sampled self times, not additive inclusive stage timers. The full profiled
compile took 150.759 seconds. Material evaluation remains the much larger cost.

Ten million seeded scalar conversions took 236–258 ms before and 68–70 ms after,
with matching sums and two million individual comparisons. A separate public
raster replay bakes 524,288 pixels with varying linear tint and compares every
output channel by digest. The interleaved before/after/after/before/before/after
runs took 192.835/139.105/135.123/161.049/161.010/133.581 ms. Three-sample medians
are 161.049 and 135.123 ms, an observed 16.1% reduction for this simple raster.
This is a synthetic material, not the complete courtyard workload.

## Full-scene result and limits

The detailed default courtyard was rebuilt from an empty material cache with
Node 24.11.1 and one isolate, then compiled in a fresh warm process. Physical and
render hashes, triangle and vertex counts, diagnostics and the complete appearance
manifest match the preceding polygon-sharing version. Every generated texture
hash matches. Source fingerprints remain stable within the ordinary runs.

| Run | Compile time |
| --- | ---: |
| Previous polygon-sharing cold inspection | 150.562 s |
| Color lookup, cold | 175.395 s |
| Color lookup, warm | 21.515 s |
| Original color code, subsequent warm control | 17.023 s |
| Color lookup, subsequent warm control | 18.994 s |

These full-build results do **not** establish an overall speedup. Several
unchanged stages slowed too, including validation and input-image decoding. The
warm control loads the saved original `raster.ts` through a loader while keeping
the current disk fingerprint and cache namespace. Its output matches, but that
fingerprint does not describe its overridden module. Warm cache hits bypass pixel
conversion, so the local optimization primarily targets material-cache misses.
The exact cause of whole-process timing variation is unresolved. The local
benefit is established separately from any full-build claim.

The timer includes compilation and navigation, and excludes source reads,
fingerprinting, browser upload/first frame and downloadable export packaging.
The one-second compiled-and-ready-for-preview target remains unmet.

## Verification

Thirty-eight focused raster, ground-raster, group and material-cache tests pass,
as does TypeScript checking. New public-raster tests compare every output RGBA
byte with the original scalar formula through both preserved and independent
layer paths. Inputs include every lookup boundary, byte-transition inverse
threshold and adjacent doubles, interval midpoints, the sRGB branch junction,
signed zero, subnormal values, one and finite over-range tints. Negative and
nonfinite tint rejection remains covered. All twenty-one raster tests also passed
before production implementation.

The existing Windows atomic-cache-replacement and material-loader failures remain
documented separately. No full-suite or browser acceptance is claimed. Compact
full-scene reports, replay results and the cold profile's top self samples are in
[the isolated measurement record](isolated-demo-2026-11-12.json). Local snapshots,
loaders and logs are under `generated/isolated-performance/`.
