# Persistent decoded source images

The demo compiler and replay workers now reuse decoded PNG pixels in a bounded
disk cache. Entries identify the exact encoded byte view and loaded compiler/
decoder namespace. A fixed binary header binds dimensions and source identity;
SHA-256 covers the dimensions and complete RGBA payload. Reads allocate only
within the existing image-size limit and reject truncated, trailing, mismatched
or corrupted entries.

Missing or damaged entries use the same native PNG decoder. Its errors still
propagate. Successful results are stored through atomic replacement, and cache
I/O failures do not prevent compilation. Hits own their pixel buffers; the core
compiler retains its existing ownership copy and image admission checks. JPEG
handling, the browser decoder and ordinary CLI decoder are unchanged.

The cache lives in ignored `generated/material-image-cache`, with a separate
256 MiB best-effort quota across namespaces. Concurrent writers may temporarily
exceed the quota. The detailed demo stores seventeen entries totaling
147,843,616 bytes, about 141 MiB. No decoded images remain retained by the cache
between calls. Texture dimensions, filtering and shadow resolution are unchanged.

## Direct and controlled measurements

The seventeen real source PNGs contain 37,702,144 encoded bytes and 147,842,256
RGBA bytes. An interleaved replay in Node 24.11.1 includes the real cache's reads,
integrity checks and compiler ownership copies. Output digests are checked after
timing, and explicit garbage collection occurs outside timing.

| Decoder | Three runs | Median |
| --- | --- | ---: |
| Native PNG | 703.034 / 700.499 / 699.526 ms | 700.499 ms |
| Warm disk cache | 117.385 / 116.472 / 116.519 ms | 116.519 ms |

All pixels match, and warm factories make zero delegated decoder calls. This is
an 83.4% reduction in this source-image replay, not in whole compilation.

A separate full-scene comparison holds the encoded-material cache namespace
constant. A generated loader substitutes the original native decoder only for
the control runs; cached runs use ordinary production code. Disk fingerprints
do not describe that loaded substitution, so measurement records explicitly
identify it. Runs are ordered native, cached, cached, native.

| Decoder | Compile runs | Compile median | Decode-stage median |
| --- | --- | ---: | ---: |
| Native PNG | 10.698 / 11.191 s | 10.944 s | 1.274 s |
| Warm disk cache | 10.397 / 10.327 s | 10.362 s | 0.294 s |

The controlled decode-stage median falls 77.0%, while total compile median falls
5.3%, or 582 ms. Other stages vary, so their differences are not attributed to
this cache. Decode-stage measurements also include source resolution and related
compiler work, unlike the direct replay.

## Ordinary cold and warm builds

Both material caches were archived before the cold run. All four following runs
use ordinary production code, one isolate, and fresh Node 24.11.1 processes.

| Run | Compile | Decode stage | Peak RSS |
| --- | ---: | ---: | ---: |
| Cold | 129.400 s | 1.555 s | 3,337,552 KiB |
| Warm 1 | 10.599 s | 0.282 s | 2,604,916 KiB |
| Warm 2 | 10.234 s | 0.278 s | 2,806,768 KiB |
| Warm 3 | 10.316 s | 0.310 s | 2,808,932 KiB |

The warm median is **10.316 seconds**, compared with the prior production
cohort's 11.858 seconds. The controlled comparison above better isolates the
change. Cold compilation still performs PNG decoding and now writes decoded
artifacts; its small whole-run difference is not evidence of a cold speedup.
RSS varies across cohorts and controlled runs; no general memory improvement is
claimed. Cold persistence temporarily copies an RGBA image for the atomic write.

Timing includes compilation and navigation, excluding source reads before the
compile call, fingerprinting, process startup, browser GPU upload/first frame,
and export packaging. Material-source resolution during compilation is included.
**The one-second compiled-and-ready-for-preview target remains unmet.**

## Verification

All eight full runs retain the prior physical/render hashes, 753,396 triangles,
1,672,716 vertices, complete diagnostics and appearance records, and all 18,666
generated image hashes. Source fingerprints stay stable within each run. The
controlled native loader substitution is separately recorded as described above.

Five new disk-cache tests pass, covering persistent reuse, exact byte views,
namespaces, corruption and dimension integrity, quota eviction, filesystem
failures/recovery, decoder errors and ownership. The filesystem tests required
execution outside the sandbox because its temporary directory rejected atomic
renames; a separate worktree-directory rename probe succeeded. Eleven codec and
real-worker tests also pass, including serial/parallel equality, partial material
cache replay, changed-manifest rejection and cancellation/recovery. Typechecking
and independent preimplementation test and final implementation reviews pass.
Previously documented unrelated suite failures remain; this is not a full-suite
or browser acceptance claim.

Full-run entries `decoded-images-*` and `decoded-control-*`, plus
`decodedImageCache`, are retained in the
[measurement record](isolated-demo-2026-11-12.json). Raw reports, replay scripts,
the control loader and logs remain under `generated/isolated-performance/`.
