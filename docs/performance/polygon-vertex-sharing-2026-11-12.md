# Polygon-local vertex sharing

`Pen.face` now shares matching fan corners within one polygon. `KitMesh.add`
compares every emitted position, normal, UV and color component at the existing
output precision before reusing an index. `Object.is` preserves signed-zero
distinctions. Different polygons retain independent ownership, and survey
collection retains its original triangle-corner stream. Triangle budgets and
cancellation still apply before collector mutation.

Pen tint callbacks retain their per-corner order. Downstream appearance callbacks
already operate per unique input vertex, so sharing reduces those callback counts.
Built-in coordinate-based tint output is verified on the complete default scene.
This is an intentional indexed-representation change. The render hash changes,
invalidating artifacts bound to the old representation.

## Full-scene preservation

Before and after compiles independently hash the expanded indexed triangle-corner
positions, normals, UVs and colors as raw Float64 bytes. All four digests match.
The physical hash, complete surfaces, triangle assignments, material definitions,
appearance manifest, diagnostics, navigation and mesh parts also match. The
753,396 triangles are unchanged. Final vertices fall from 2,217,828 to 1,672,716,
removing 545,112 duplicates (24.6%). Texture and shadow resolution are unchanged.

Both inspections have stable source fingerprints within their runs. Three fresh
warm-process profiles match the new render hash and vertex count, and retain the
prior complete appearance manifest and empty diagnostics.

## Measurements

The default detailed Kowloon courtyard uses Node 24.11.1 and one isolate, matching
the preceding isolated benchmark. The new version receives an empty material
cache, followed by three fresh warm processes. The timer surrounds compilation,
including navigation. Source reads, fingerprinting, inspection hashes, browser
upload/first frame, and downloadable export packaging are excluded.

| Measure | Dense bindings | Polygon sharing |
| --- | ---: | ---: |
| Cold compile, one run | 150.499 s | 150.562 s |
| Warm compile median | 15.839 s | 15.398 s |
| Warm range | 15.094–17.941 s | 15.135–15.884 s |
| Preserved-geometry binding median | 1.999 s | 1.597 s |
| Peak RSS median across warm processes | 3,070,132 KiB | 2,855,736 KiB |

The observed binding reduction is 20.1%, while whole-compile median falls 2.8%.
Whole-process ranges overlap and unaffected stages vary. RSS is a process
high-water mark, not an isolated allocation measurement. The original worktree
checkpoint warm median was 19.717 seconds, making the cumulative observed median
reduction 21.9%. Cold compilation remains about 150 seconds. The one-second
compiled-and-ready-for-preview target remains unmet, even before browser work.

## Verification

Twenty focused Pen emission, building survey, building job and receiver-binding
tests pass, along with TypeScript checking. Tests compare expanded corner streams
and cover matching quad sharing, separate polygon ownership, stateful tint
callbacks, mutable UV and normal seams, surveys and receiver ownership.
Independent test and implementation reviews approved the change. The
implementation reviewer confirmed approval after the full-scene comparison.

The previously recorded material-loader and Windows atomic-cache-replacement
failures remain outside this change. No full-suite or browser acceptance is
claimed. Inspection digests and compact warm reports are retained in
[the isolated measurement record](isolated-demo-2026-11-12.json), under
`polygonSharing` and the `polygon-warm-*` entries. Local snapshots, inspection
driver and logs remain under `generated/isolated-performance/`.
