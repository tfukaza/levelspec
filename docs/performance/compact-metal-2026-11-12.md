# Compact metal finishes

The user authorized intentional visual changes in pursuit of the one-second
preview-ready target, judged through rendered comparisons. Thin frame and cage
members now use a shared nonmetallic paint material and a deterministic aged tint
instead of a separate procedural material receiver for every face. Existing
texture and shadow resolutions are retained; this change removes selected finish
maps rather than shrinking them.

Eligibility belongs to the whole member, up to four centimeters across, using a
conservative bound on the current world transform. Large tubes cannot qualify
because their individual facets are narrow. Broad members, continuous mapped
assemblies, sheets and pipe finishes retain their detailed maps. Existing tiny
bevel-strip shortcuts remain separate. Members still register with the assembly
contact collector, so a simplified crossing bar can weather a neighboring broad
member. Nested adapters now honor their requested finish kind while sharing the
compatible assembly collector; previously kind changes could reuse the old kind.

## Measurement

Fresh Node 24.11.1 processes compiled the unchanged default Kowloon courtyard in
the isolated worktree. Serial comparisons use one isolate and warm material and
decoded-image caches. An ABBA comparison loads the complete preceding weathered
metal module for controls, including its former kind-reuse behavior, while
retaining the same cache namespaces. The loaded substitution is explicitly
recorded because disk fingerprints cannot describe loader overrides. Both
variants were primed before comparison; source fingerprints stayed stable.

| Finish policy | Warm compile runs | Median | Receiver validation | Material planning/cache |
| --- | --- | ---: | ---: | ---: |
| Previous full maps | 9.650 / 9.142 s | 9.396 s | 0.525 s | 2.041 s |
| Compact members | 7.445 / 7.008 s | 7.227 s | 0.248 s | 0.971 s |

The controlled whole-compile reduction is 2.169 seconds, or 23.1%.
Ordinary candidate warm runs are 6.914 / 7.122 / 7.610 seconds (median 7.122).
The candidate with both caches initially empty takes 120.778 seconds. The previous
cold observation was 132.674 seconds, but these were not an interleaved cold
comparison and should not establish a general cold speedup.

Separate warm checks using the normal auto-worker setting take
9.187 / 9.862 / 10.974 seconds (median 9.862). Their output matches the candidate
exactly and no raster jobs need replay workers. These were later observations,
not an interleaved worker-setting comparison; their difference from serial runs
does not establish worker overhead. They remain part of the result rather than
being replaced by the faster controlled observations.

| Work item | Before | After |
| --- | ---: | ---: |
| Surface receivers | 96,623 | 34,599 |
| Channel texels | 94,961,643 | 92,113,107 |
| Encoded generated-image bytes | 94,497,137 | 89,346,488 |
| Triangles | 753,396 | 753,396 |
| Vertices | 1,672,716 | 1,672,716 |

Compilation includes material-source resolution and navigation. It excludes
source reads before the compile call, fingerprints, process startup, browser
upload/first frame and downloadable export packaging. **The one-second target
remains unmet.** Cold rasterization still takes about 114 seconds; warm procedural
generation and preserved-geometry binding remain significant costs.

## Visual acceptance

The delivered browser reviewer rendered both compiled snapshots at a 1440×1100
viewport, device scale 1, full-render daytime appearance and identical lighting.
Four cameras cover an orthographic overview, courtyard, street and cage close-up.
The capture driver waits until the applied camera matches the requested camera;
all four actual view records match between versions and both browser-error arrays
are empty. Early captures with stale camera state were excluded.

Evidence is under `generated/isolated-performance/`:

- `visual-baseline-verified/`: previous screenshots, `capture.json`, and snapshot.
- `visual-compact-verified/`: candidate screenshots and `capture.json`.
- `compact-preview/preview.json`: candidate compiled snapshot.
- `compact-geometry-verification.json`: full-scene geometry comparison.

The overview retains the scene identity. Courtyard and street views preserve
silhouettes, openings, cage bars, dark window recesses, broad weathering and
shadows. Close-up thin blue mullions and green cage rails are visibly cleaner and
flatter, losing chipped highlights while wider members remain mottled. Both the
primary inspection and an independent appearance critic accept this tradeoff for
the measured improvement. This is acceptance of the captured static daytime
views, not exhaustive night, animation or mobile testing.

Baseline render identity:
`fcfeeae383384eb4272d37103e4f5fa1598521a5fb3c1e65503969eb90101e56`.
Candidate render identity:
`dcf41c26a110f55650ee0665bac649bf72e7c9cb967453d4980b254f8e8aa176`.
The changed render identity is intentional.

## Validation

Expanded positions, normals, triangle winding and object ownership match across
every full-scene triangle. Physical meshes, source-image hashes, diagnostics,
triangle/vertex counts and physical identity remain unchanged. Candidate runs
match each other's complete appearance records; controls match the baseline.
The physical hash remains
`03d781e884449cf89d04a16e4890af8bc28fbdad7d4593897ee9f04df09bd8a3`.

Twenty-nine tests pass across compact metal, material caching, building surveys
and real replay workers, plus typechecking. Coverage protects whole-member
eligibility, transforms including later mutation and shear, smooth geometry,
paint UV repeat, callback/material preservation, nested requested finishes, late
contacts across adapters, failure recovery, cache replay and worker cancellation.
Independent test and implementation reviews approved the final change after the
transform and nested-kind findings were fixed.

No production renderer or export-packaging code changed. Candidate capture used
a separately compiled snapshot; the original complete demo bundle was restored
after capture. The normal demo build will regenerate a consistent package from
the new compiler. All edits remain in `codex/demo-build-optimization`.
