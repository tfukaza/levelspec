# Architectural review findings

The Rust compiler emits non-blocking architectural warnings before procedural
material baking. Native compilation runs the boundary and enclosure reviews in
parallel. Threaded Wasm uses the shared worker pool, and plain Wasm runs them
sequentially. Every finding includes source objects, source location, spatial
bounds and an inspection target.

Current checks cover adjoining floor-edge gaps, offset continuing wall faces,
exposed roof steps and walls extending above nearby roofs. An exhausted review
budget produces an explicit incomplete-review warning. These observations
request inspection and leave authors in control of geometry changes.

Compiled manifests contain a `reviews` array. Native validation exposes the same
records through its report. Each record includes `id`, `fingerprint`, `state`,
the diagnostic fields and any acknowledgment. The web editor shows active
warnings and expandable review identities.

## Acknowledging intentional geometry

After reviewing a finding, place its exact ID and fingerprint in the AML source
with a reason for retaining the geometry.

```xml
<review-suppression suggestion="FLOOR_EDGE_GAP:lower|upper"
  fingerprint="copy-the-full-64-character-fingerprint"
  reason="Intentional separation between these storeys"/>
```

Acknowledgments require a unique finding ID, a SHA-256 fingerprint and a nonempty
reason. A matching acknowledgment suppresses the active warning while retaining
the review record. Relevant geometry changes make the acknowledgment stale and
reactivate the warning. Review that geometry before updating the acknowledgment.

Compiler validation still reports declared requirement failures as errors.
Sampled navigation and visibility checks retain their own evidence and limits.
