# Portable binary render identity

Render finalization now hashes numeric mesh attributes as owned little-endian
binary64 snapshots. JSON metadata binds each field name, length and position to
its digest and retains all nonnumeric mesh fields, material definitions and the
complete surface appearance manifest. The root digest uses the
`levelspec-render/v2` domain. All snapshots precede asynchronous hashing.

Finite precision is unchanged. Positive and negative zero remain equivalent;
nonfinite values, null entries and holes share a canonical quiet-NaN marker,
preserving their former JSON-null equivalence. Optional absent and undefined
fields remain equivalent, while empty arrays remain distinct. The metadata
dictionary has no prototype, so own metadata keys cannot alter its structure.

This deliberately replaces every old render identity. There is no legacy mode.
Consumers treat `renderHash` as opaque and publish or compare it. Anything keyed
by the old render hash must regenerate. Physical and geometry hashes retain their
existing calculation. Geometry, material generation, texture and shadow
resolution, navigation and export payloads are unchanged.

## Hashing and full compilation

The real default scene contains 21,413,460 numeric mesh values. Interleaved
same-scene comparisons use the former JSON calculation and the production v2
helper, with garbage collection outside each timed section.

| Hash calculation | Three runs | Median |
| --- | --- | ---: |
| JSON | 835.293 / 825.038 / 827.891 ms | 827.891 ms |
| Binary v2 | 127.837 / 133.774 / 127.053 ms | 127.837 ms |

The observed hash-time reduction is 84.6%, or about 700 ms. Each format is stable
across its three runs. Their digests intentionally differ.

Full compilation uses Node 24.11.1 and one isolate, with an empty material cache
followed by three fresh warm processes. The cold inspection enables `--expose-gc`
for the later replay; explicit collection occurs only after compilation and
inspection, outside the compile timer.

| Measure | Shared work slices | Binary hash |
| --- | ---: | ---: |
| Cold compile, one run | 135.738 s | 134.005 s |
| Warm compile median | 14.410 s | 13.372 s |
| Warm range | 13.888–14.420 s | 12.462–13.719 s |
| Mesh parts and finalization median | 1.130 s | 0.416 s |
| Warm peak RSS median | 2,890,652 KiB | 2,496,016 KiB |
| Cold compile peak RSS | 3,316,304 KiB | 3,615,148 KiB |

Finalization falls 63.2%; whole warm compilation falls 7.2% in these cohorts.
Unchanged stages still vary. RSS is a process high-water observation: warm values
decrease while the cold value increases, so no universal memory reduction is
claimed. Binary snapshots and WebCrypto's input copies can coexist.

The timer includes navigation and excludes source reads, fingerprinting,
inspection/replay work, browser upload/first frame and downloadable exports.
The one-second compiled-and-ready-for-preview target remains unmet.

## Exact output verification

The cold inspection recomputes the former JSON render digest from the complete
new mesh, materials and appearance manifest. It matches the prior production
digest exactly. Independent raw Float64 expanded triangle-corner digests also
match for positions, normals, UVs and colors. Complete surfaces, triangle
assignments, materials, appearance, diagnostics, navigation, parts, physical hash,
triangle count and vertex count remain unchanged.

The three warm runs match the new render hash and the prior complete appearance
manifest, including all 18,666 generated image hashes. All source fingerprints
remain stable within each run. The comparison separates the intentional identity
format change from unchanged render content.

## Tests and review

All five new identity tests and TypeScript checking pass. An independent oracle
uses literal little-endian bytes and Node SHA-256. Coverage includes each numeric
channel, field boundaries and lengths, all supplied material and appearance
metadata, one-ULP distinctions, canonical numeric equivalence, optional fields,
input ownership and mutation after asynchronous hashing begins. Compiler-entry
tests verify finalization uses the helper and retains separate physical identity.

The integration selection has 32 passes, six failures and one skip. All six
polygon-building failures reproduce with the original JSON hash and exceed a
texture budget before finalization. The skip is the unavailable optional
`xmllint` schema validator. These are retained limitations; no full-suite or
browser acceptance is claimed. Independent test and implementation reviews
approve the change.

Inspection, direct timing and warm-run records are retained in
[the isolated measurement record](isolated-demo-2026-11-12.json) under
`renderHashImplementation` and `render-hash-warm-*`. Local inspection/replay
drivers, snapshots and logs remain under `generated/isolated-performance/`.

The remaining warm profile includes about 3.4 seconds of procedural assembly,
1.5 seconds of receiver validation, 1.6 seconds of source image loading/decoding,
and 3.1 seconds of material preparation/cache reads. The current material cache
contains 9,527 artifact files, providing a concrete next I/O investigation.
