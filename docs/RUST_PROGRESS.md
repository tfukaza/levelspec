# Rust migration implementation evidence

Updated November 13, 2026. The user authorized continuing phases 3–6 after phase 2.
This is a progress record, not a declaration of completion or performance attainment.

## Current ownership boundary

The user clarified that Rust owns AML parsing, geometry/model generation,
material compilation and related compiler work. Viewer interaction belongs to
TypeScript. Walking, jumping, crouching and camera controls now run in the UI
worker against generated collision data. The temporary Rust movement API has
been removed. Native and both Wasm builds pass, and the browser exercised
walking, jumping, landing, crouching and standing without loading Wasm movement. Compiler-side standing admission remains internal to validation.

The additional component ports provide native OBJ/MTL and SVG-plan exports,
parallel architectural boundary/enclosure checks and geometry-bound review
acknowledgments. These changes are functional rewrite work. The performance
measurements below describe the earlier frozen build; no additional benchmark
run is being used as a gate for this work.
## Cutover checkpoint

The six planned implementation phases have native/Wasm PoC paths. Rust owns
compilation, procedural geometry and materials, validation/navigation, export,
the CLI, file watching, producers, tracing, migration, reconstruction and bake
orchestration. The browser retains Three.js, input and presentation.

The old Node backend, its CLI hook, backend workers and superseded tests were
moved out of the maintained source tree. This worktree preserves 520 files under
`generated/legacy-node-source` for recovery. Source assets, authored projects
and reference evidence remain in place. The package now contains UI tooling and
UI verification dependencies.

Current verification includes native/Wasm compilation, UI type checking, five
packet/update checks, four native process checks, the core source/RNG checks and
focused compiler review checks and TypeScript movement smoke checks. The actual browser editor passed editing,
error recovery and asset/export checks. The native file reviewer passed source
watching, obsolete-result rejection, service restart and delivery recovery.
GLB output passed the independent validator and Three.js loader.

Four historical migration fixtures were converted and validated again. A GLB
was imported, compiled and exported. The native capture helper recorded matching
source hashes and perspective/orthographic cameras. Browser standing inspection
entered a supported floor and exited cleanly. Viewer movement now runs in TypeScript.

The native visibility command covers supported samples, protected pairs/areas
and entry-angle observations. A generated-map smoke produced 47 samples and
2,030 queries. A second configuration exercised all three report groups, stopped
with an explicit incomplete result at 10,000 queries, and completed with 12,002
queries under a larger allowance. These are tool checks, not map gameplay review.

Earlier phase-six checks also exercised all seven generator families with pickup
and enemy placement, native tracing, a real Blender 5.2 bake, Quake BSP2 tool
delivery and the model-revision HTTP transport against a local fixture server.
Remote CI, a paid model call and destination-engine gameplay remain unverified.

The packaged executable, reviewer and materials are under
`generated/rust-phase6/ownership-release`. Packaged native validation passed with
an empty PATH. Browser capture evidence is under `generated/rust-phase6/final-capture`;
walking evidence is under `generated/rust-phase6/walk-smoke`.

### Remaining acceptance scope

The user selected a PoC-first pace. Full legacy feature parity, broad
architectural warning heuristics, tighter intra-area route bounds and an
exhaustive cross-platform/browser matrix remain deferred. The former graph
exploration lab and illustrated-viewer extras are outside
the current browser PoC. See [the current capability boundary](IMPLEMENTATION.md).

### Final performance run

The default courtyard uses building texture density 16. The material character,
roof equipment, facade detail and shops were reviewed in overview and close
views. This deliberately lowers texture detail from the density-32 baseline.

The first full-scene binding-cache run exposed eviction at its 128 MiB limit.
It recorded zero binding hits despite the smaller fixture passing. The limit
was raised to a bounded 384 MiB to accommodate the actual courtyard working set.
The frozen native run took 41.71 s cold, 1.46 s warm-full and 3.07/3.15 s for the two building-height edits. It reused 17 of 20 bindings on each edit. The frozen browser run took 44.69 s cold, 3.64 s warm-full and 5.25/5.33 s for those edits, with about 4 s in Rust compilation and packet copying. A global seed edit took 40.66 s. These are individual observations from the prior build, stored under generated/rust-phase5/final-preview.json and courtyard-final/results.json. The one-second goal remains unmet.

## Earlier implementation evidence

The sections below describe their original checkpoints and measurements.
The cutover checkpoint above supersedes statements that phases five or six
have not started or that model/placement integration is still pending.

## Continuing implementation checkpoint

Native `trace` now decodes PNG/JPEG images, segments bounded raster observations,
and publishes validated AML with optional raster evidence. Native `generate`
implements the seven existing layout families and theme data. One candidate in
each family passed the native CLI smoke with seed `smoke`, depth four and two
required routes. Pickup/enemy placement integration remains open.

Native `migrate` translates historical SVGX XML into a new project and copies
its local companions. The maintained starter, Dust II, showcase and rooftop
reference fixtures converted and then passed native validation. GLB visual mesh
imports now use a bounded Rust geometry decoder. Imported collision uses an
explicit native proxy.

Native `reconstruct` evaluates independent landmarks, masks, silhouettes and
structural strokes and writes reference renders. The rooftop smoke produced
three views and correctly reported zero verified views without independent
annotations. Model-assisted revision orchestration remains open.

Native `bake` owns input preparation, UV charts, source-image hashes, external
Cycles calibration, process limits and output publication. A one-sample, 128-pixel
smoke completed with the installed Blender 5.2. Its Blender-side adapter retains
the existing calibration and linear EXR implementation. `game-export` uses the
native build delivery path with a Y-up game manifest. Evidence lives under
`generated/rust-phase6/`.

The standalone packaging helper is `tools/package-rust.ps1`. A package containing
the executable, reviewer and materials passed native validation with an empty
PATH. A small Windows/Linux native CI workflow and browser build job were added.
The new CI jobs have not run remotely.

The browser worker supports threaded Wasm in isolated pages and serial Wasm on
ordinary hosts. A focused two-host run matched packet bytes between one and four
workers. The pinned threaded build currently uses `RUSTC_BOOTSTRAP` to rebuild
the standard library with atomics, which the toolchain reports as experimental.

Scene updates now carry complete metadata with changed buffers and exact reuse
references. The native delta smoke and browser decoder checks passed. Retained
image identities allow texture reuse across updates. On-demand drawing replaces
the continuous idle render loop. The complete browser edit/recovery smoke passed
after retaining diagnostic codes in update errors.

With incremental transport and on-demand drawing, the same threaded browser
scene reached a visible preview in 58.23 seconds cold. Local height edits took
5.49/5.43 seconds including 4.26/4.20 seconds of Rust compilation and copying.
The benchmark uses a single input replacement per edit. Evidence is under
`generated/rust-phase5/courtyard-updates/`. The previous browser run included
slower automation input handling, so the end-to-end difference also includes
that measurement correction.

The final native control at density 32 took 64.02 seconds cold, 1.49 seconds
warm-full and 3.72/3.57 seconds for local edits. A lower-density variant is being
evaluated with proportional metal receiver minimums. It has not yet completed
visual or performance acceptance.

Before incremental transport and on-demand drawing, the threaded browser
courtyard took 141.9 seconds cold to become visible. Two height edits took
35.9/37.8 seconds to become visible, including 8.1/6.7 seconds of Rust compilation
and packet copying. They retained 3,649/3,656 uploaded meshes. These are individual
observations, with captures under `generated/rust-phase5/courtyard-threaded/`.
The one-second edit target remains unmet. The complete backend removal, reviewer
feature integration and remaining ownership cutover are still open.

The user subsequently requested a PoC-first pace and less testing. New integration
work now uses compile checks, a small smoke check and visual inspection; exhaustive
source parity and edge-case coverage are deferred. Earlier parity evidence below
still describes the revisions at which it was collected.

Current PoC integration adds patched AML ground, finite physical contact seams,
authored ground plans, base-wall attachments, wall finishes and optional windows.
The wall integration uses the existing finite tiled/plaster fields over exposed
triangles; it is not a claim of exact source wall-decoration parity. The courtyard
button in the Wasm editor supplies its local textures, while the worker preloads
shipped material images in a batch. The example currently uses building texture
density 32 instead of 64, with overview and closer views inspected. The original default source
remains unchanged under `generated/dressing-demo/presets/kowloon/`.

Sessions now cache completed material bakes using exact source-image identities,
material definitions, recipes, density and host/job identity. Binding and edge
conformance still run against current geometry. Fully cached hosts skip source
image decoding. The cache is bounded to 256 MiB of accounted encoded output;
the exact-byte image identity registry has a separate 128 MiB bound. This is
material reuse, not a finished-scene or structural-geometry cache. It has compiled
natively and in Wasm. A native local-edit observation is recorded below; the
one-second target has not been met.

The first complete courtyard attempt reached publication with 76,071,426 baked
channel pixels, 98,272,701 encoded bytes, 4,568 material definitions and 13,446
images. It hit the 8 MiB identity-metadata allowance (10,641,611 accounted bytes),
not the pixel or encoded-image bounds. That metadata allowance is now 16 MiB.
This failed release attempt took 57.3 seconds including cold compilation; it is
diagnostic evidence, not a successful preview benchmark. The large image/material
count remains a practical optimization target after the prototype renders.
Adding the original source textures then exceeded the old 128 MiB combined
delivery allowance; generated and source images now share a 256 MiB encoded
allowance. Individual source images and transient decoding remain separately
bounded. Preview status includes material-cache counts to make reuse observable.

The native courtyard now compiles and renders in the Three.js prototype. The
overview shows the complete building cluster, roof services, balconies, shops,
street spans and patched courtyard. This is PoC visual acceptance, not matched
fidelity acceptance against the old renderer. Evidence is in
`generated/rust-poc/courtyard.png`. The successful cold run took 58,476 ms with
other implementation/build activity on the machine, so it is not a controlled
benchmark. After that work finished, changing the isolated partition height from
1.4 to 1.5 m took 1,848 ms through native compilation and packet creation, with
4,482 material cache hits and no new misses. This is one observed real geometry
edit, not a finished-scene cache hit or a statistically established performance
result. Geometry/planning still rebuilds, and the one-second target remains open.

The native `build` PoC smoke produced all four artifacts from `rust-stage1.aml`
with an empty executable PATH. No broad suite or parity matrix was rerun for this
integration, following the user's PoC-first instruction.

Phase three's detailed courtyard now also compiles and renders in Chromium using
the browser Wasm worker. The captured run reported 132,586 ms for cold compilation
and packet copying, followed by 4,429 ms for an AML edit with the existing worker.
Both rendered successfully with 4,704 scene meshes and no compiler diagnostics.
The browser timing includes library loading in the cold case. These are individual
PoC observations on a software-rendered browser. Evidence lives in
`generated/rust-poc/browser-results.json` and `courtyard-wasm.png`.

The Three.js adapter indexes materials and assets once per replacement and decodes
up to eight textures concurrently. All decoding tasks settle before failed or
cancelled replacements release their resources. The native and browser examples
now share `editor/courtyard.aml` and its `assets/courtyard/` companion paths.
The building density of 32 has been visually inspected in overview and a closer
view. Further visual matching and comprehensive parity coverage remain deferred
under the PoC-first scope.

## Current runnable boundary

Phase four adds `superspec validate <source.aml> --json`, which compiles physical
geometry without procedural texture baking and returns source-linked findings,
the standing navigation mesh, route polylines and sampled floor coverage. The
browser editor's **Validate** action uses the same Rust code and overlays its
navigation surface and route paths in Three.js.

The next phase-four increment adds enabled, directed traversal links and physical
entrance capacity. Navigation is clipped to authored floor ownership before
counting connected components. Overlapping or contiguous doorway declarations
share one resource, and coincident traversal declarations share one resource.
The count remains a witnessed lower bound, so insufficient sampled evidence
produces a review warning. Native checks cover two doorways, an alias of one
doorway, closing one doorway, a one-way ladder and its disabled ability.

Water navigation now uses boat radius, draft and headroom. Submerged ground is
excluded from land support. Boat surfaces are clipped to known seabed support and
closed-solid projections through the hull's vertical envelope. This working
geometry leaves canonical collision and rendered water unchanged. Native checks
cover a traversable pond, insufficient draft, and a low bridge that blocks passage.
Native and Chromium/Wasm runs agree on the focused cases. Two separate doors
provide two witnessed routes, a duplicate declaration adds no capacity, the
one-way ladder works only in its enabled direction, and the pond supports the
boat route while excluding a submerged walking route.

Large surfaces now use overlapping Recast tiles and clipped output cores.
Boundary portals preserve matching seams and respect the agent's step limit.
A focused native check crosses three tiles, rejects a real two-meter gap, and
rejects a height jump for a zero-step agent. Closed-solid sections also establish
complete obstruction of flat declared mouths when a common standing-body plane
can be established. Ambiguous or unsampled cases retain review warnings.
The four Chromium/Wasm smoke cases also pass through the editor's normal
validation action, including a route across the three-tile floor. Captures and
results are under `generated/rust-phase4/movement/`. Four focused native cases
cover doorway capacity, directed abilities, boat clearance and tile boundaries.
The final native release build and workspace all-target check pass. Revalidating
the default courtyard finds two witnessed entrance routes and a 26.34 m path.
It retains one non-blocking sampled coverage warning for `back-street`.
The report is `generated/rust-phase4/final-courtyard-validation.json`.

Route reports now include an optional `maximumRoutes` for the declared entrance
network. The optimistic graph keeps every unverified mouth, removes only mouths
with closed-solid obstruction proofs, groups aliases, and preserves enabled-link
direction. Internal connectivity within each authored area stays unrestricted.
Missing mouth spans, ambiguous endpoint ownership and same-area endpoints leave
the bound unset. A request above the bound emits `ROUTE_CAPACITY`; a request
between the witnessed count and the bound retains its review warning. This bound
describes declared entrance resources. Continuous gameplay reachability remains
a separate verification task.
Independent closed-solid partitions inside one area remain a hardening task.
The shared flow calculation now has cancellation and a bounded work allowance.
Four focused native tests pass, including capacity rejection, uncertain mouths,
incomplete declarations and one-way traversal. The native CLI returns exit 1 and
source-linked `ROUTE_CAPACITY` evidence when three routes require two doors.
The default courtyard still validates with two witnessed routes and a maximum
of two. Chromium/Wasm smoke results and inspected captures are retained under
`generated/rust-phase4/route-bounds/`.

Navigation uses [rerecast 0.5.1](https://docs.rs/rerecast/0.5.1/rerecast/), with
player radius, height, step and slope settings. Paths witness reachability in
the generated polygon corridor. Their lengths are upper bounds. Sample gaps,
missing sampled paths and insufficient witnessed entrance capacity produce review
warnings. Impossible straight-line distance limits and demonstrated
eye-height line-of-sight violations produce errors. Navigation status is
`sampled`; collision triangle checks use `checked`. Full equivalence with the
previous backend's advanced navigation diagnostics remains a hardening task.

Native builds now stage GLB, glTF with its binary buffer, runtime JSON with its
asset blob, collision GLB, LSP and the manifest. Lightmap UV1 generation uses
[uvunwrap 0.3.0](https://docs.rs/uvunwrap/0.3.0/uvunwrap/) with one shared 4096-wide
atlas and fast chart packing. `--no-uv` skips this export stage. UV0 and canonical
triangle positions survive seam duplication. Generic glTF viewers receive valid
clamped vertex colors, with original HDR tint in `_LEVELSPEC_HDR_COLOR`.
The full export allowance is 768 MiB, covering the separately bounded texture
bundle plus geometry expanded at lightmap seams and export metadata.

`--blender <executable>` additionally converts the Rust-generated GLB to binary
FBX. The Blender process has cancellation and a ten-minute limit. Managed build artifacts can
be replaced in an existing destination. Failed publication restores prior files,
and unrelated files stay in place. Cancellation checks now reach material baking,
navigation stages, UV generation and publication.

The initial native smoke built UV1-bearing GLB/glTF and binary FBX using Blender
5.2.2. A failed subsequent Blender launch preserved both the prior GLB bytes and
a user-owned note. The default courtyard's standing navigation produced a
26.34 m polygon-corridor path from its spawn via the ramp to the upper objective.
The browser blockout smoke completed validation in 66.9 ms, displayed the cyan
navigation overlay and yellow route, and downloaded a GLB with UV1 on all 29
visible primitives. A focused cancellation check interrupted managed-file
replacement, verified restoration of the old model and user note, and then
completed another build successfully. Broader suites remain deferred.
The complete detailed courtyard also exported successfully with lightmap seams:
1,645,071 vertices, 724,531 triangles and 150,609,392 encoded image bytes. Its
270,946,580-byte visual GLB and canonical collision GLB both passed the independent
glTF validator with zero errors and warnings. The full build produced eight
artifacts under `generated/rust-phase4/courtyard/`.

Native `build --quake-palette <palette.lmp>` also emits Valve 220 MAP, WAD2 and
BSP2 through explicitly configured `--qbsp`, `--vis` and `--light` tools. The
default tool names also honor `QBSP_PATH`, `VIS_PATH` and `LIGHT_PATH`. Closed
solids are retained only for this export. Convex partitioning preserves occupied
volume and separates face-material boundaries. Authored spawn locations receive
Quake hull clearance checks. Tool execution is bounded and cancellation-aware,
and all delivery remains inside transactional staging. The report retains
external compiler warnings and explains palette, projection and entity changes.
The focused concave-floor/arch fixture produced 21 brushes and a 61,936-byte BSP2
with ericw-tools v0.18.2-rc1. That tool run reported visibility warnings and one
unused spawn target name warning. A missing-tool retry preserved the prior BSP
and an unrelated user note. Evidence is under `generated/rust-phase4/quake/`.
Quake water, open surfaces and advanced PBR channels retain explicit export
errors, matching the optional format's restricted representation.

To try the detailed phase-three prototype, build the native executable and Wasm
module with `./tools/rust.ps1 build` and `./tools/rust.ps1 wasm`, then bundle the
web surfaces with `npm run build:rust-ui`. Run
`./target/release/superspec.exe preview editor/courtyard.aml` and open the printed
loopback URL. The `/index.html` route opens the browser AML editor; its
**Load courtyard** button installs the same source and companion textures.
The initial editor sample is deliberately small so the UI opens promptly.

`superspec-engine::compile_with_assets` is the single architectural compiler used
by the native `scene` command and browser Wasm worker. The previous rectangular
stage-one compiler was removed. Native commands still include `init`, `inspect`
and `scene`, plus binary `glb` delivery (visual or `--collision`) and a read-only
native `preview` service. The prototype `build <AML> --out <new-directory> [--json]`
compiles and stages `scene.lsp`, `scene.glb`, `collision.glb` and `manifest.json`
before publishing its managed output files. The phase-four additions above extend
this initial delivery boundary. The current editor is an additional Rust surface, not the final
replacement of the existing reviewer.

The portable core handles frames, datums, nested definitions/instances, profiles
and holes, CSG, floors, walls, openings/details, stairs/ramp undersides, enclosures,
retaining walls, terrain heightmaps/grading, spatial volumes and face materials.
Canonical collision is emitted separately from render surfaces. Structural
connection, shared-edge and clearance assertions produce source/spatial evidence.
Ordinary compilation retains `not-run` audit statuses. The explicit validation
and build workflows attach the phase-four physical and sampled navigation report.

LSP3 transports a padded JSON manifest, f32 positions/normals/UVs/linear RGB colors, local u32 indices
and bounded encoded image assets. Mesh IDs and their owning source object IDs are
separate, including material splits, collision and generated parts. Base color textures use sRGB; normal and packed
metallic/roughness channels use linear data. Height textures are compile-time
surface inputs, not runtime bump maps. PNG/JPEG decoding is owned by Rust;
browser image decoding is only for GPU realization. Collision-only objects and
unused material declarations do not trigger render texture reads.

## Verified evidence

- Native workspace tests cover physical volumes/rays, holes, stairs, wall corners,
  transforms, source findings, budgets, terrain PNGs, grading and source metadata.
- Actual Chromium/Wasm byte parity: `rust-stage1.aml`, `rust-architecture.aml`,
  Daiban, Dust II and `rust-materials.aml`. Portable trigonometry and Euclidean
  norms remove previously observed native/Wasm topology and guide differences.
- Real editor edits, invalid-edit retention, initialization cancellation, worker
  restart, failed-fetch recovery, repeated edits and explicit AML download pass.
- Browser asset imports are preflight-bounded, atomic and superseded between
  reads. Clearing resets both selectors and cancels pending imports.
- Real Three.js material/lifecycle coverage checks channel color spaces and
  decoded image identities, transparency/cutout behavior, late image completion
  and failure, close during decoding and stable GPU counts after replacement.
- Independent implementation review approved the material/import scope. This
  is not an approval of the whole architectural milestone.

Ignored browser evidence lives under `generated/rust-architecture-acceptance/`
and `generated/rust-scene-browser/`. Tests are retained in `tests/` and Rust crates.
Use the result JSON from a completed run, not diagnostic packets retained from
earlier failed parity runs. No one-second courtyard measurement has passed.

## Phase three work started

Rust owns lot subdivision, service wells, story stacking, overhang/setback plans,
building blocks and per-lot style selection. Frozen source-oracle vectors include
the three default courtyard hosts, constrained base walls, Unicode seeds, wells,
canvas/metal awnings and frontage changes. Independent checks cover contiguous
lots, positive widths, story datums, roof variation and analytic body volumes.
The sRGB byte transfer table is frozen to avoid target-specific fractional powers.
Raster kernels now cover bilinear source images, ordered coatings, reflected and
sheared normal bases, padded/repeating layouts, and owned rotating bump rows.
All sRGB quantization boundaries are checked against independent reference vectors.
PNG decoding retains explicit alpha, clears keyed transparency and rounds 16-bit
samples; PNG encoding and bounded JPEG decoding are native Rust.

The procedural drawing port covers polygon fans, boxes, sheets, bars, chamfered
members, tubes, discs, drums, curved patches and profiled molding. Thirty-nine
frozen reference cases cover identity, rotation and reflection. Geometry-only
surveys use the same shapes without evaluating appearance. Attempted facets,
surface identity storage and cancellation are bounded independently of emitted
triangles. Assembly contacts/folds are finalized before immutable metal sampling.

The metal recipe retains ordered paint/oxide/runoff coatings, periodic pipe
seams, contact/fold exposure and normal-only relief. Eight sample/raster cases
match reference decoded pixels in native and actual Chromium Wasm execution.
The test-only Wasm artifact is separate from the production compiler download.
Procedural scene assembly now preserves instanced source ancestry and keeps
collision buffers unchanged; failed groups cannot publish partial scene data.
Material identity and inherited source metadata budgets apply cumulatively across
visual appends, including long material names and repeated failed/recovered jobs.

Casement, slider and louver windows, boarded openings, curtains, hoods, fasteners
and three security-bar patterns now have Rust geometry producers. Seventy-two
frozen source cases preserve indexed attributes, slot ownership and RNG state in
native and actual browser Wasm execution. Geometry-only surveys skip appearance
lookups. Independent checks cover guard winding/bounds, invalid glazing clearance,
custom transoms/bars, cancellation and restored drawing frames. The real Three.js
fixture is captured at `generated/rust-scene-browser/windows.png`; it is fixture
QA, not courtyard acceptance. Timber windows now use the board-local atlas producer;
the close-up `generated/rust-scene-browser/timber-window.png` shows the real albedo,
normal and packed material images decoded and bound by Three.js.

The window producers now attach metal receiver scopes to frames, guards and bolts,
and apply the requested timber edge wear. Nested finishes share assembly exposure;
a changed finish kind retains only its requested material slots. The 72 cases
include 36 plain and 36 weathered variants, with frozen receiver ranges/contact
recipes for casement and timber windows. Cancellation and invalid scoped guard/bolt
draws restore their caller's frame and timber attributes. End-to-end window baking
keeps excluded glass, pane and concrete geometry/UV/color attributes identical and
retains visible glass meshes. Whole-host dressing/AML integration remains open.
Native and actual Chromium Wasm checks pass; the inspected Three.js close-up is
`generated/rust-scene-browser/weathered-window.png`. Both independent reviews
closed this window integration scope.

Timber mapping has 78 frozen native/Wasm cases covering metric atlas repeats,
end-grain banks, padding, contact wear, transformed and derived frames, fallback
materials and geometry-only surveys. Independent checks cover supporting planes,
surface area, pixel density, shared-edge wear continuity and material-specific UV
scale. Clipping charges polygon work before allocating each cell, including empty
cells. Seeds use pinned pure-Rust `ryu-js` 1.0.3 for ECMAScript number formatting;
default Rust formatting would change geometry-dependent texture selection.

The 31 shipped material definitions are Rust-owned data. Reserved builtin names
cannot be overridden; supplied callbacks remain authoritative for image bytes.
The native adapter resolves library images separately from author companion paths.
Development uses repository images; installed releases will need the sibling
`materials/` payload. The library currently occupies about 86.6 MB encoded and
must not be embedded indiscriminately into the Wasm download.

These planning/material components do not yet produce the detailed courtyard.
Building fixtures, shops, signs/spans, ground/wall recipes, receiver planning,
binding and seam closure still need their Rust ports and matched visual acceptance.
Basic unpatched `<dressing><floor .../></dressing>` is now connected to native and
Wasm compilation; other recipes and unported controls reject explicitly.

The floor path preserves collision and explicit face assignments, selects host-local
top faces, refines long edges, and emits world-space seeded UVs and weather colors.
Its producer matches all 522 frozen TS corners from the same receiver inputs plus
135 color samples. Architectural partition triangulation differs (187 Rust versus
174 TS refined triangles in the inlay fixture); integrated checks establish equal
area, preserved inlay/side/underside attributes and collision, not identical topology.
Frozen outer-corner attributes verify actual AML lowering and rule overrides.
Reflected/nonuniform instances verify local-face selection and world-space mapping.

Completed preserved-geometry rasters can now be encoded into Rust-owned PBR materials
and appended with their visual mesh transactionally. Padded UV binding preserves
positions, normals and tint; failed bindings leave UVs unchanged. Scene publication
counts authored and baked images together and rolls back staged materials/assets
when mesh admission fails. Bake delivery currently requires opaque sources and color
texels; transparent/cutout recipes reject rather than applying opacity twice.
Recipe IDs are caller-owned scene identities, not content hashes or persistent cache keys.
`generated/rust-scene-browser/baked-metal.png` is the inspected actual Wasm→PNG→Three
fixture.

Metal pens now collect receivers automatically from boxes, bars, beveled members,
tubes and affine continuously mapped sheets. Derived pens share assembly contacts
while retaining part ownership and the original mapping frame. Frame/cage members
up to four centimeters across retain the accepted compact paint treatment; broad
members and pipes retain procedural maps. Finalization freezes contacts/folds before
grouping complete recipes, and an exclusive drawing borrow prevents edits between
planning and baking. Bulk binding validates all ranges, ownership and padded UVs
before committing them in one traversal. Failed baking/binding does not publish a
partial scene. Per-drawing member, receiver, mapped-corner, identity and raster
budgets bound planning and delivery.

Twenty-six frozen source cases cover compact/broad shapes, reflections, callback
and slot bypass, derived joints, folds and roller shutters. Geometry, receiver
exposure and sampled appearance match in native and actual Chromium Wasm. Tests
also cover tilted world gravity, recipe sharing/material isolation, late binding
rollback, cancellation and aggregate raster budgets. The roller shutter producer
now uses these Rust stages end to end; its real Three.js view was inspected at
`generated/rust-scene-browser/shutter.png`. Corrugation, paint wear, rust and narrow
guides are retained, and mapped fold seams have continuous UVs. This is fixture
acceptance; general painted receivers, wall/ground binding and full courtyard
integration remain open. Independent implementation and test reviews closed this
receiver scope with no outstanding findings.

Rust now owns modular pipe barrels, tangent elbows, shouldered collars, wall straps,
standoffs and bolted plates, including complete routed assemblies. Each curved piece
uses one periodic chart; inherited member finishes cannot register overlapping charts.
World-oriented runoff uses a bounded, descending-height transport grid. Eight frozen
field cases cover straight, curved, reversed-gravity, collar, empty and maximum-grid
inputs; 42 pipe cases cover plain/weathered/zero-density finishes, reflected/tilted
frames, indexed attributes, receiver recipes, sampled PBR and geometry-only surveys.
Two upright/reflected pipe rasters compare all decoded color/normal/properties bytes
through the actual job baker. Identical translated pieces share jobs; orientation,
seams and variant changes remain distinct. Native parallel and serial output packets
match, cancellation preserves complete mesh state, and explicit recipes compact and
account for retained allocations. Both independent reviews closed this scope.
The actual Wasm/Three.js fixture was inspected at `generated/rust-scene-browser/pipes.png`:
elbows, collars, mounts and downward seam grime remain visible. Pipe fixtures are not
yet connected to complete building generation; this is not courtyard acceptance.

Round and sectional rooftop tanks now have Rust producers, including supports,
ladders, access hatches, valves, straps and connected plumbing. Shared structural
hardware covers members, angles, gussets, rods, fixing plates, turnbuckles, chain
and lattice. A brushed-metal pen supplies physical-scale planar charts and retains
explicit UVs, smooth normals and per-corner tint callbacks. Named/moved/oriented
frames retain the exact finish seed; changing finish replaces the previous scope.
Fifty-four frozen hardware/tank cases pass indexed geometry, ownership, receiver
samples, RNG and survey parity in native Rust and Chromium Wasm. Four additional
corrugated-sheet cases pass native and browser Wasm checks. Tests cover invalid frames,
NaN pigment, bounded link counts, successful finish replacement, caller restoration,
survey callback bypass and cancellation/recovery for both complete tank producers.
Native and browser tank baking uses the shipped stainless texture channels and
preserves separate collision. Independent implementation/test reviews closed the
hardware/tank and corrugated-sheet scopes.

Window air conditioners and single/double-fan condensers now retain their real atlas,
modeled grilles, louvers, fan guards, rain covers, mounting steel and routed services.
Seventeen frozen source cases cover all grille designs, wear classes, short clearance,
reflections, optional finishes and unchanged RNG advancement. Native and Chromium Wasm
match indexed attributes, atlas UVs and sampled receivers. Installation checks isolate
the corrugated cover's small rearward wave from the rest of the wall clearance.
Invalid placement does not consume RNG or emit geometry; cancelled detached jobs recover.
Both reviews closed. The actual Three.js view is `generated/rust-scene-browser/aircon.png`.

Shared painted panel fields now cover edge chipping, recessed perimeters, hand/foot grime,
pigment, roughness and normal-only relief. Six frozen rasters and twelve transformed
face/box cases pass native and Chromium Wasm, including all decoded channel bytes.
Paint and metal use one typed, bounded job runner with complete recipe identities;
mixed serial/parallel packets match and binding preserves positions, normals and colors.
Surveys retain emission order without resolving appearance. Tests cover cancellation,
sharing, combined group/slot limits and raster halos at the coordinate boundary.
JSON parsing now enables exact floating-point round trips: rounding a near-edge value
onto a panel boundary changed the reference chip coverage. Full native workspace tests
pass with this setting. Both reviews closed. The inspected actual Three.js view at
`generated/rust-scene-browser/painted.png` shows clean and worn copies with continuous
panel-edge wear and physically modeled recesses. This fixture is not a complete entrance.

Complete seeded entrances now combine painted or steel double leaves, glazed timber,
pressed recesses, beveled rails, hinges and pulls, transoms, lamp/conduit, mailbox banks
and atlas notices. Twelve frozen entrances and all sixteen poster designs in two frames
match indexed geometry, UVs, ownership, sampled PBR and RNG in native and Chromium Wasm.
Two patterned-glass goldens also match every delivered PNG pixel through actual recipe
registration, baking and scene publication. Invalid inputs preserve the design stream;
cancelled detached jobs and direct timber helpers reject invalid wear and recover.
Both reviews closed. Inspected views are `generated/rust-scene-browser/doors.png` and
`door-timber.png`, using shipped timber and poster atlases with independent collision.
General building placement and courtyard integration remain open.

Actual Three.js views are `generated/rust-scene-browser/round-tank.png` and
`box-tank.png`. Visual inspection exposed missing specular environment lighting in
the minimal reviewer: metal appeared nearly black despite correct texture bindings.
The reviewer now owns one neutral PMREM environment, oriented Z-up, with balanced
ambient illumination. Temporary lighting resources and the final GPU target are
disposed explicitly; scene edits reuse the environment. Repeated-edit GPU counts,
close during decoding and environment disposal pass browser acceptance. Model
geometry and material maps are unchanged. These fixture views do not establish
full courtyard or final reviewer acceptance.

Independent metal jobs can now use a native scoped worker pool. Requested concurrency
is capped by available CPUs, job count and a working-memory allowance; immutable
source images are shared and completed jobs bind in their original order. The
one-worker path remains the reference. Worker startup errors, worker panics,
cancellation and mixed successful/failed jobs leave drawing bindings unchanged.
Tests establish actual worker overlap, complete packet identity across worker
counts, memory-limited concurrency, joining and fresh-job recovery. This is a
per-plan native pool, not the final persistent native/Wasm scheduling system.

PNG output now streams rows through a fixed-capacity sink, avoiding whole-image
compressed/fallback temporaries. Encoding checks cancellation between rows, rejects
overflow without returning partial images, and retains exactly the encoded byte
count. Pool accounting includes raster samples, encoder rows/chunks and output
compaction. Codec tests cover high-entropy overflow, tall/wide images, exact decoded
pixels and recovery. Independent implementation/test reviews closed this scope.

An isolated native release probe builds four independent two-meter metal panels
without source textures or result caching. Four ABBA cohorts (eight runs per
condition) measured complete construction/baking/binding/LSP medians of 2.358 s
with one worker and 0.786 s with four workers. Ranges were 2.341–2.366 s and
0.607–0.835 s respectively. Every complete packet matched byte for byte, checked
outside timing. No tests or rendering ran during measurement; source and executable
SHA-256 values were stable before/after on the 12-logical-processor Windows host.
The runnable probe is `crates/engine/examples/metal_jobs_bench.rs`;
all samples/fingerprints are in `generated/rust-metal-jobs-parallel.json`.
This is a scheduling experiment, not courtyard or incremental-edit acceptance.
Process startup, peak process memory, browser pools and material cache reuse were
not measured by this probe.

## Portable delivery started

`superspec-export` owns binary glTF generation without filesystem, renderer or
JavaScript dependencies. The native CLI exposes `glb <source> [--collision]` on
binary stdout; the browser Wasm compiler exposes `export_glb`. Visual output keeps
embedded PNG/JPEG channels, linear color factors, normal-map tangents, source
ownership and instanced context. A root transform converts Z-up meters to Y-up.
Collision compilation skips visual images while retaining geometric heightmaps.
Audit statuses remain explicit `not-run`; successful export is not validation.

Native tests cover byte framing, attribute/range/bounds preservation, canonical
collision, analytic normal-map handedness under mirrored UVs, source ownership,
PBR/channel references, bounded/cancellable metadata serialization and recovery.
The real Chromium delivery fixture uses the Khronos validator and Three GLTFLoader,
checking loaded world positions and decoded texture identities. Its retained
evidence is under `generated/rust-export-browser/`.
Production Wasm GLB bytes also match native visual/collision output. The editor's
GLB download cancels obsolete revisions, retains valid previews after export
failure, and recovers after failed Wasm initialization. Each worker request installs
one complete asset snapshot after clearing the prior bundle; a tested 128 MiB
replacement cannot temporarily overflow the previous bundle. The idle worker keeps
its compiler session and bounded image admission cache, separately from asset ownership.

glTF requires vertex colors in [0,1]; HDR tints remain supported by LSP preview
and produce an explicit GLB error instead of a silent color clamp. General route
audits, lightmap UVs, external glTF/OBJ, optional exporters and transactional file
publication are still open. The current binary command emits nothing on failure.

## Intrinsic wall appearance

Rust now owns the existing wall-condition and plaster sampling equations: rising
moisture, ledge runoff, opening soot, finish tone and coarse/fine coat loss. Exposure
is snapshotted; finite-support deposits, overlapping ledges and infinite ledge ends
retain their reference behavior. Conservative whole-rectangle bounds select uniform
finish regions only when the complete interval excludes the loss boundary.
Plaster composition retains ordered coat/backing layers and receiver-owned elevation;
sample height remains zero. Precomputed condition samples can be reused explicitly.

Native and Chromium Wasm execute 650 frozen reference samples, 35 bounds, six finish
hash vectors (including non-BMP text), three fractional contour blends and exact
color/packed-channel bytes for five raster programs. Analytic tests separately cover
control independence, accumulation, finite support, infinite ends, ownership and
invalid-input recovery. Rust retains filtering of degenerate or nonpositive-flow
exposure, while rejecting nonfinite/out-of-budget settings explicitly. Material cache
identity, wall receiver geometry and detailed courtyard integration remain open.

## Native file preview

`superspec preview <source.aml> [--ui <prebuilt-directory>] [--port <0-65535>]`
serves the prebuilt Three UI on loopback, without Node on PATH. Port zero selects
an available port and the URL goes to stderr. Packaged releases find `reviewer/`
beside the executable; repository runs use `generated/rust-editor/`. Missing or
invalid source remains recoverable while the service runs. The UI is read-only.

The watcher reads source and actually requested companion bytes, including missing
dependencies, every 250 ms after the previous pass. It detects same-size edits with
unchanged timestamps and replaced files. Compilation and packet assembly run apart
from the bounded HTTP workers. Changed inputs suppress obsolete geometry and errors;
invalid input retains the last good scene. Status identifies both the latest attempted
revision and retained scene, with a process-session identity to survive restarts.
The browser independently polls status, cancels stale packet application, retains
delivery errors across retries, and recovers after disconnection or same-port restart.

Native tests cover packaged UI discovery from another cwd, exact-Origin and MIME
handling, read-only methods, malformed/oversized/stalled requests, static file limits,
and real Windows junction escapes for UI and companion roots. Deterministic watcher
tests mutate inputs before publication to verify stale success/error suppression.
Chromium acceptance and inspected screenshots are in `generated/rust-preview-browser/`.
This fixture is architectural, not the detailed courtyard acceptance scene.

Remaining service work includes cooperative cancellation inside compiler kernels,
signal/exit-130 handling, final reviewer features and more efficient dependency reads.
This watcher is content-correct but rereads dependency bytes; it does not establish
incremental geometry reuse or the one-second performance goal.

## First edit reuse boundary

Native preview and the browser worker now share `Session`, which retains successful
render-image validation metadata against exact owned encoded bytes. A hash narrows
lookup; byte equality establishes identity. The default cache is capped at 64 MiB
encoded bytes and 256 entries, with least-recently-used eviction. It retains no
decoded pixel buffers. Capacity zero disables reuse. Entries cannot cross process
or decoder-version changes. Current asset reads, missing/corrupt-image errors and
per-build pixel/asset budgets still apply on a hit.

This removes repeat render-image decoding only. It does not cache heightmap decoding,
geometry, recipes or finished materials. Source edits still execute the compiler and
produce complete packets. Busy-worker cancellation and restart drop the session.
Tests compare cached and fresh packets, changed/deleted/corrupt assets, count/byte
eviction, partial asset-install failures, recovery and actual browser worker restart.

An isolated native edit benchmark using one 3.58 MB timber PNG measured roughly
20.5 ms with image reuse disabled versus 1.65 ms with reuse. The initial cached
session build took 21.7 ms. Four ABBA cohorts change the box width for every call;
timing includes compilation and LSP packet construction, with fresh-output parity
checked outside the timer. This small fixture is not the detailed courtyard.
Raw timings and input/executable SHA-256 values are retained in
`generated/rust-image-admission-benchmark.json`; the runnable benchmark is
`crates/engine/examples/image_admission_bench.rs`.

## Facade and ceramic finishes

Intrinsic facade finishes now preserve periodic exposed plaster/concrete, all eight
source coating layers, source repeats and UV transforms. Eleven fields (1,001
samples) and five complete raster outputs match the TypeScript oracle in native
Rust and actual Chromium Wasm, including asymmetric color/normal/data source
images and noninteger repeats. Adjacent facade receivers share one material;
bound UVs and Three.js repeat wrapping are checked. Plaster and concrete browser
views were inspected without visible cell seams. The prior implementation and
test review findings for this scope are closed.

The raster plaster/concrete wall-skin producer now partitions canonical 4.8 m
cells before ordinary 0.9 m panels, respects construction marks and openings,
supports ordered rectangular wash changes, and separates shared clean finishes
from finite exposure/deposit bakes capped at 128 texels/m. Eight complete source
plans cover clean, dirty, concrete, reflected, high-density and ceramic-clad walls. Native
checks compare indexed geometry, sample fields, full selected raster pixels,
bound UVs, survey geometry, bounded admission and cancellation/rebuild behavior.
The same wall-skin checks pass in actual Chromium Wasm; the rendered two-window
wall was inspected for continuous panel finish, gravity-aligned runoff and exact
wash boundaries. The ceramic path preserves ordered repair campaigns, repair age,
gravity-driven pigment, affine source-texture mappings, bedding, filtered grout,
chipped corners and per-tile damage contours. Its field/bake budget includes the
condition snapshot, repair plans and bounded nine-blob neighborhood cache.

Nine ceramic fields (2,943 samples) and three complete standalone rasters match
the oracle in native Rust and actual Chromium Wasm. Reverse-order queries check
that the neighborhood cache cannot change results. New/worn/staggered tile
panels and the integrated two-window tiled wall were inspected in Three.js.
Relief remains normal-only; physical geometry and collision stay separate.
Fixture-applied deposits and geometric height-map wall paths are still unported;
this is not a full building or the default courtyard.

## Roof access and household components

The complete stair-access hut now emits four finished wall faces, its door opening,
plinth and cap, vent, painted leaf, fixing hardware and electrical conduit in Rust.
Six seeded assemblies match the reference geometry, finish receivers and sampled
appearance in native Rust and Chromium Wasm. Native and Wasm scene delivery retain
host collision; the front and elevated Three.js views were inspected.

The six shipped plant/garment meshes are consumed as data by Rust. Twelve plant
cases and eighteen fitted garments cover plain/textured, reflected and support
variants, with three no-fit cases. Procedural laundry adds shirts, vests, bottoms,
pinned towels, draped cloth, folds and fittings. Seventy-two fitted garments and
six complete washing/hanger rows match indexed geometry, colors, UVs, normals and
RNG continuation in native Rust and actual browser Wasm. Invalid admission and
cancelled drawing are checked with subsequent recovery. The rendered laundry
fixture retains the source cloth atlas and its normal/property maps; its three
support types were inspected in Three.js.

Window cages, planted rows, drying racks/poles and utility lamps/meters now pass
32 native and Chromium Wasm assembly comparisons, including geometry, survey,
random-stream continuation and weathered receiver coverage/samples. An integrated
scene combines stocked cages with T-post roof drying lines, shared plant/cloth
atlases and baked aging. Its Three.js material and replacement checks pass; the
rendered view was inspected. These components are not yet a full building or the
default courtyard. The new roof/laundry/household scope has not received an
independent implementation review.

Canvas awnings now fit the shipped settled cloth forms in Rust, retaining
area-weighted normals, physical weave UVs, clipped stripes with continuous phase
across modules, rolled hems, scalloped valances, fitted rails, grommets and rope
ties. Twelve assemblies match native and actual Chromium Wasm geometry and metal
receiver samples, including shallow slopes, multi-module spans and reflection.
The shared canvas PBR material and replaced-resource lifecycle pass in Three.js;
overview and close-up views were inspected. No runtime cloth simulation was added.

Convex balcony slabs, outward edge frames, mitered open-backed parapets and bolted
semicircular climbing barriers now match six native reference assemblies, including
inward/outward taper and reflection. Parapets currently use the positive-density
raster wall path; the zero-density geometric wall path remains unported. Native,
Chromium Wasm and Three.js material/replacement checks pass; the rendered slab,
parapet and barrier fixture was inspected.

Facade construction plans now place story bands, vents, outlets and threshold-aware
plinths, with wall-runoff ledges and mitered trims. Eight complete assemblies match
the source in native Rust and Chromium Wasm. Shared-corner queries match 144 source
cases covering angled and reflected neighbors, gaps, blocked projections, body
offsets and incomplete vertical coverage. The rendered facade's openings, trim,
vents and runoff were inspected. This remains a component assembly, not a complete
AML building.

Sign typography now uses the shipped atlas metrics in Rust: all glyph cells, 147
line layouts and 14 painted-face fields match native reference samples. Twenty-eight
complete panels cover rectangular, diamond and round outlines, seven construction
types, reflected placement, both reading sides, frames and fixings. Native checks
include survey geometry and every finish receiver. Complete panel bakes using the
shipped glyph atlas pass the native scene boundary and Three.js material/replacement
checks. The rendered sign fixture was inspected for Chinese/Latin readability,
vertical text, reflected reading orientation and panel aging. Typography and panel
checks also pass in actual Chromium Wasm.

Seeded copy and composition now match 192 businesses and 336 complete layouts,
including exact random-stream continuation. Thirty-two flat, painted-wall and roof
mounts preserve panel placement, brackets, posts, braces, survey geometry and finish
receiver coverage. These checks pass natively and in actual Chromium Wasm. Projecting
and hanging signs now match 64 additional native assemblies, with bounded clearance,
no-fit outcomes, wall plates, bracing, chains, power leads and cancellation/recovery.
These additional mounts also pass actual Chromium Wasm and Three.js material/lifecycle
checks. Their rendered tile string, lightbox, hanging board, braces and fixings were
inspected. Street selection now matches 36 frontages in native Rust and Wasm,
including every clearance query, nearby-shop lookup and named random choice across
three detail levels. Building integration remains unfinished.

Ground-floor bays now match 40 native assemblies: shutters, folding gates, entrances,
glazed shopfronts and service bays. Checks cover geometry, survey triangles, every
finish receiver, deferred sign proposals and random-stream continuation. Forty-eight
fascia, balcony and roof-sign callers preserve independent streams and signed
millimeter placement identities. Complete ground-bay bakes with shipped timber and
poster assets preserve host collision. These ground-floor and frontage checks also
pass actual Chromium Wasm. The ground-bay Three.js material/lifecycle checks pass;
the rendered shutters, gate, stocked glazing, louvers and utilities were inspected.
Full shop interiors remain unported.

Rooftop assembly matches 18 complete native and Chromium Wasm cases, including
reflected frames and all three detail levels. Highest-detail plot reservations
preserve equipment placement at lower detail. Access huts, tanks, shacks, washing,
plants, vents, aerials, fences and deferred roof signs compose through existing
bounded kernels. Complete baked material delivery preserves collision and passes
Three.js lifecycle checks. Front and rear rooftop views were inspected.

Upper household bays match 105 native and Chromium Wasm assemblies: punched and
ribbon windows, open/caged/glazed balconies, stair bays and service bays. Checks
cover geometry, finish receivers (including HVAC runoff), household state, deferred
signs and survey output across detail levels. The occupied glazed case is explicit;
a vacant household does not count as glazing coverage. Complete bakes with real
atlases preserve collision, pass the full Three.js material/lifecycle suite, and
have inspected overview and glazing close-up views. The browser harness keeps
large packed fixture scenes in the browser rather than expanding them into numeric
arrays through Node. This is a test-harness fix, not a default-demo performance result.

Façade planning matches 90 native and Chromium Wasm reference plans. Bay rhythm,
shared households, recesses, balcony thresholds, ground fronts, shop-room sizing,
construction details, wall exposure, clearance queries and RNG continuation are
covered. Invalid callback results, overlapping coverage and cancellation fail
explicitly and subsequent planning recovers. Eighteen envelope and ten complete
closed-front façade assemblies now match native and Chromium Wasm geometry,
household washes, recesses, fixture finishes, service pipes, deferred signs and
survey output. A three-story baked façade passes native material/collision checks
and the Three.js lifecycle suite; front and oblique views were inspected under
`generated/rust-scene-browser-facade`. Authored security-bar dimensions stay intact
to avoid floating-point endpoint subtraction flipping diagonal planar UV axes.
Stocked shop interiors and whole-building integration remain unfinished.

Shared shop components now pass native and Chromium Wasm reference checks: 54 smooth
forms, 36 furniture assemblies, 72 small fittings, 16 baked stock cases and 100
grocery props/bag arrangements. These retain physical-scale charts, timber edge wear,
label variants, supported bases, reflected normals, seeded stock-support surfaces
and touching bag geometry. The full Three.js material/lifecycle suite passes with
their real atlas companions. Inspected views include `shop-equipment.png`,
`shop-timber.png`, `shop-stock.png` and `bag-group.png` in
`generated/rust-scene-browser`.

Room reservations and amenities now match 48 layouts and 48 assembled fixtures.
Shelf stocking matches 24 cases, including rotated footprints, sold gaps, rear rows,
and label sequences. Six complete grocer interiors and 16 hanging-packet displays
pass native and Chromium Wasm comparisons. The complete grocer's triangle corners
match independently of equivalent local vertex sharing on tiny clips. The real
Three.js grocer fixture passes material/lifecycle checks; its overview and packet
close-up were inspected in `generated/rust-scene-browser-grocer`. Packet placement
uses actual pouch and clothespin bounds, preserving seam attachment and spacing.
The exact household-wash tile-boundary checks also pass in native and Wasm.

Sixty cookware and household-ware assemblies pass native geometry/UV comparisons,
with invalid-input, cancellation and recovery coverage. A nearly 45-degree pot face
exposed a chart-axis tie affected by nested two-component norms. Planar charts now
normalize all three components together with compensated summation, preserving the
source's axis choice. The full native workspace and doctest suite passes this fix.
Sixty-six produce cases also pass native reference checks, including fruit heaps,
leaf sheets and hanging provisions. The complete Chromium Wasm kernel and Three.js
material/lifecycle suites pass these latest shapes and the normalization fix.
Seventy-eight packaged-goods cases and six complete arrangements each of the
greengrocer, hardware store and herbalist pass native and Chromium Wasm comparisons.
Their material delivery, unchanged architectural collision and Three.js lifecycle
checks pass. Overviews and detail views were inspected in the respective
`generated/rust-scene-browser-{greengrocer,hardware,herbalist}` directories. The
shared carton-stack routine remains seeded and supported after extraction.
Twelve restaurant food fixtures, twelve kitchen tile/atlas fields, 54 fittings,
30 work-detail assemblies and eight complete roast restaurants pass native and
Chromium Wasm comparisons. Rendered kitchen fittings, food, tiled counters, chopping
blocks and towels were inspected. Thirty-two street-display fixtures and 40 placement
plans preserve entrance clearance, support, random streams and availability queries.
Ten complete shop shells cover all five trades, mirrored rooms, shutters, gates,
deferred sign proposals and street stock. Three open façades integrate these rooms
and pass native and Wasm comparisons. The rendered three-story façade and its shop
interior pass Three.js material/lifecycle checks and were visually inspected.
Nested room frames preserve the host's explicit reflection state independently of
frame handedness. The full native workspace and doctest suite passes this correction.
Whole-building/deck integration and the complete default courtyard remain unfinished;
these component fixtures are not the default courtyard benchmark.

Building clearance now separates physical obstacles from rendered ground support.
Native reference checks cover 250 oriented boxes, 390 closed-solid containment queries
and 250 ground-support queries. These include owner/exemption handling, rotated
foreign volumes, holes, hidden faces and raised floors. Immutable BVHs store triangles
once, with bounded work and cancellation. These checks also pass in Chromium Wasm;
successful ground sampling does not establish navigation reachability.

Pavement/deck foundations preserve construction axes, authored contacts, adjoining
floors, finish zones and seeded pour joins in 120 native and Wasm reference layouts.
Two hundred footprint partitions preserve receiving height and area; 160 finite wall
exposure queries retain unknown corridor widths when opposing owners are absent.
Forty pavement material fields match 5,920 native samples and 3,200 conservative
coverage/cut queries, including asphalt overflow, missing boards, chipped ceramic,
deposits, plate elevations and filtered PBR. These checks also pass in Chromium
Wasm. Ceramic sampling requires a positive
physical texel footprint; the original zero-footprint filter divides by zero and
is not used by the ground builder.

The ground planner preserves 159 reference pours, including 46 supported service
covers, wall-adjacent damage and damp pigment. Eleven terrain fixtures match 14,098
disjoint receiving pieces, with area conservation through access-cover ring and
tread cuts. These planning and terrain comparisons pass native and Chromium Wasm.
Eight assembled preserved-source floors also match native triangle attributes and
material receivers, including rotated frames, holes, transparent water films, closed
rims, supported paper/box litter and flush decks. Ground raster programs now enter
the bounded Rust baking queue; interpolated floor vertices retain their precision
until the render-packet boundary. Native workspace regressions and Chromium Wasm
acceptance pass; the overview and close-up retain the floor opening, worn tile
joints, asphalt, water and litter. Twelve terrace fixtures also match native
geometry and material receivers across reflected winding, larger decks and felt
overrides. Ground material resolution preserves 252 reference PBR bindings,
including authored materials and scoped color overrides; terrace and material
comparisons also pass Chromium Wasm. Floors with authored height-map displacement
still require geometric surface refinement; the preserved-source entry point does
not implement that branch.

Shared building placement matches 63 sites and 421 facades natively and in
Chromium Wasm, including aligned neighbors, polygon prism sections, ground support,
base-wall exemptions and projection/room clearances. Canonical convex footprints
retain their actual perimeter and mitered roof inset. Ten complete shell fixtures
match native and Chromium Wasm geometry, terrace samples and roof-equipment reservations.

The detached building driver now combines lot finishes, joined facade trim,
households, stocked shops, terraces, roofs and deferred signs. Eight complete
native and Chromium Wasm fixtures match 465,966 triangles and finish samples at
low, medium and high detail, including mirrored shops, rotated polygon buildings,
one-meter party edges, a multi-lot host with wells and 30-meter tall story cases.
Whole-building comparison found and fixed the 1.7 m sliding-window width boundary,
polygon-frame arithmetic used by timber seeds, per-face ceramic repair seeds and
same-facade shop lookup for sign copy. Corner-query errors propagate to the job.
Independent review found inconsistent facade/door/roof limits, which now admit
generated dimensions within the supported envelope. Polygon dressing explicitly
rejects dimensions or edges above 40 meters and stories that cannot fit 2.4 meters.
These are current Rust admission limits, not new architectural invalidity findings.
Complete hosts have bounded allowances of 32,768 receivers and 64 MiB of recipe
identity storage; deduplication keys can separately retain another 64 MiB. These
allocations are outside raster-worker memory and must enter aggregate host scheduling
budgets. The raster pixel cap remains unchanged. Full large-host baking is not yet
established by geometry/recipe comparisons alone.

Shared kit registration and semantic binding match twelve native and Chromium
Wasm cases, including distinct whole-material prefix overrides, packed PBR,
transparency/cutouts, emissive and displacement channels, day/night glazing and
repeat binding. Inputs remain owned by the caller. The first connected AML building
now passes native compilation with real shipped textures, dependency-only image
loading and full baking. Its 8,784 generated triangle positions/normals and part IDs
match the maintained TypeScript compiler exactly at the packet's f32 boundary.
Canonical collision is unchanged. An authored wall named `metal` stays separate
from the kit metal role; asymmetric-image bakes remain byte-identical through local
slot aliases and dependency filtering. Unused shop atlases are not read, and a failed
image load can be followed by a successful visual compilation in the same session.
The initial complete native/Wasm packet matches in Chromium and the Three.js
overview/close-up were inspected. Five more native full-compiler fixtures cover
mirrored/yawed placement, elevated polygon profiles and shop frontage over intact,
cut-away and hidden support. Their generated positions, normals, ownership and sign
plans match the frozen source exactly; unrelated visible geometry and canonical
collision remain unchanged. Removing frontage support removes the exterior shop
frontage, while the source-prescribed interior and signs remain. These additional
browser cases now also match native packets byte-for-byte in production Wasm.
The shop, sign and polygon overview/close-ups were inspected in Three.js.
Two connected building fixtures now pass native source equivalence, including
49,053 triangles, global sign decisions and automatic cables/laundry. The second
fixture uses a separate wall material and repeat. Raw proxy boxes are removed,
canonical collision and unrelated visible geometry remain equal, and cross-host
contributors are recorded on generated objects. Hidden recipes are validated but
excluded from placement, so they cannot obstruct visible neighbors. All ten
connected building scenes match native packets byte-for-byte in production Wasm.
The multi-building overview, washing close-up and separately blue second facade
were inspected in Three.js. Six frozen source triangle-centroid probes also match
native delivered albedo PNG pixels exactly across both distinct wall materials.
Native base-wall attachment and its rotated/reflected variant also pass source
geometry checks and native/Wasm equality; their Three.js overviews were inspected.
Broader default-courtyard visual acceptance remains open.

Flat sign receivers now conform to existing collinear boundary vertices, using
the source's scale-dependent tolerance and stable candidate order. Nearby thin
rims are not welded. Inserted attributes come from the receiver; normals are
normalized, raster colors are white and ownership stays separate. Retained scene
vertices are captured after paint and floor dressing, before f32 delivery. This
is not adaptive height/material subdivision; height-bearing sign structural
materials fail explicitly. Conformance bounds candidate work, unique points,
expanded triangles and 128 MiB of logical patch/commit payload before binding.
That allowance excludes vector capacity/reallocation and lookup overhead; it is
not a peak-memory limit. A used sign-base height map is rejected before its
image is loaded, and a corrected source succeeds in the same session.

Delivered scene images now have a shared 192 Mi-pixel allowance for authored and
generated assets. The shipped PNG library alone contains 89,608,808 pixels, so
the earlier 32 Mi-pixel delivery cap could reject an ordinary stocked shop. The
new limit equals 768 MiB of RGBA8 base images, not total process/GPU memory;
mipmaps and overlapping scene generations add overhead. Per-image, source working,
raster working and encoded-byte allowances remain separate. Collision collection
preflights repeated identity storage before cloning triangles (16 MiB), including
the final solid identity used for containment. Both budgets have rejection and
recovery coverage.

Span foundations match 150 hanging curves and 550 physical walking-height queries
on native and Chromium Wasm. Wall extraction/coverage and seeded utility/window
fixings match 41 planes, including grouping and glazing thresholds; 207 anchor
queries preserve neighbor cell traversal/insertion order. Coverage sums clipped
triangle area as the source does, and is not a union proof for overlapping triangles.
Plane geometry is immutable outside the span module. Host ordering intentionally
uses UTF-8 order rather than platform locale collation; ordinary lowercase courtyard
IDs retain their order, while mixed-case/punctuation IDs can change span selection.
Source-surface/provenance classification is connected before raster rebinding;
its 32-face fixture checks direct ownership, host-local material roles, glazing
precedence and exclusion of unrelated props. Span emission routes bodies and
endpoint fittings to their own detached host drawings with one traversal and
shared aggregate work limits. Per-host partitioning of the frozen source checks
full geometry and receiver coverage, and a distinct-repeat fixture checks another
3,688 triangles and 160 finish samples. Cancellation after both hosts emit is
followed by successful fresh output. These routed additions pass natively and in
actual Chromium Wasm.
Twenty-four span plans match natively and in Chromium Wasm, including 22 signs, 26 clotheslines and 345
cable bundles. Partial sheet reservations are owned by a planning attempt and discarded
on failure. Four complete drawings (24,051 triangles) match positions, normals, UVs,
colors, finish samples, survey positions, part IDs and contributor records on both
targets. A real-material fixture bakes signs/hardware and preserves its cloth atlas;
the Three.js overview and corrected laundry close-up were inspected. Its physical
support mesh is unchanged. The last full native regression suite passed all 315 checks
through multi-building assembly, routed materials and receiver-edge conformance; actual Chromium Wasm
kernel acceptance also passes. Focused checks cover newer admission changes. No whole-scene
performance claim follows.

Fixture stains compose onto finite coplanar receivers in insertion order, including
deposits emitted before a wall. Eight complete wall plans match native and Chromium
Wasm samples and full raster pixels. Only affected shared facade cells become finite
materials; unrelated planes and opposite faces retain sharing. Tiled repair deposits
retain their reduced staining. The rendered stained plaster and tiled walls were
inspected; fresh repairs, openings, source UVs and relief are preserved. Invalid
input, bounded deposit work, cancellation and sealed-collector rejection are checked.

The sign placement survey matches 67 native reference scenarios, including partial
occlusion, competing priorities, exact ties, two-sided faces and signs that hide
previously kept lettering. A bounded immutable BVH stores each visual triangle once;
segment, sheet-piercing and triangle-box queries match the source reference. Six
cross-host collections match nearest-shop lookup, append order, placement decisions,
reported bounds and emitted triangle counts. Work limits, malformed frames and
cancellation/recovery are checked. These survey and collection checks also pass in
actual Chromium Wasm. These visibility samples do not prove gameplay
reachability or visibility. No default-courtyard timing is implied by component checks.

## Remaining milestone gates

### Active phase-five work

The native `benchmark` command measures a cold build, a warm full build and each
supplied `--edit` source through complete packet assembly. Coarse compiler phase
timings stay outside deterministic scene packets. `--jobs 1..16` selects native
raster concurrency, with host emission capped at two simultaneous drawings.
Native host emission assembles results in source order before shared sign/span
planning. A focused two-host comparison matches serial and parallel packets.

Completed raster images now share immutable encoded bytes. Raster cache keys
use the complete recipe and input identity independently of job list positions.
Cache hits receive the current material/asset slot names after an edit. A focused
reordered-job check compares fresh bytes and bindings. Each compile revision
reads each source asset once while subsequent revisions resolve fresh bytes.

On this machine, the initial measured baseline was 65.56 s cold, 1.92 s warm, and
5.53/5.16 s for two successive building-height edits. The first updated run was
64.79 s cold, 1.91 s warm, and 3.89/3.88 s for those same edits. Local-edit cache
misses dropped from 813/764 to 131/107. These are individual release observations,
with evidence in `generated/rust-phase5/{baseline,reuse-parallel}.json`.
The one-second target remains open.

The Three.js adapter retains unchanged uploaded meshes and content-addressed
textures across coherent scene replacements. Pending replacements hold separate
texture references so cancellation preserves the visible scene. A Chromium
smoke preserved the unchanged object's visible/collision meshes after a width
edit, then replaced visible materials after source image bytes changed. Inspected
captures are in `generated/rust-phase5/preview-reuse/`.

Phase two remains open for general architectural warning audits, visual-mesh
imports, normalized default metadata, complete material provenance, retaining-wall
endpoint joins and further global complexity accounting. Touching/overlapping
profiles, outside/crossing breaklines and nonadjacent sweep intersections now
have explicit native admission checks. No unsupported feature may disappear
silently to make the maintained maps pass.

Phase four's remaining hardening includes broad geometry audits, intra-area
closed-solid partitions for tighter route bounds. Land/water navigation,
traversal links, witnessed entrance capacity, tiled navigation, UV1, portable
delivery, optional FBX and transactional publication have native implementations.

Phase five: bounded parallelism, dependency-aware edit reuse, coherent incremental
packets, cache integrity/invalidation, cancellation and controlled default-scene
benchmarks. The priority case is a local AML edit ready for preview within 1 s.

Phase six: remaining producers, tracing, explicit migration, reconstruction and
bake/game delivery, native CI/release packaging, full reviewer integration and
removal of superseded backend TS/Node. Keep the migration oracle until replacement
behavior is verified; retaining it as a permanent backend is not acceptable.

## Local checks

On this Windows checkout, the isolated toolchain is used by:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/rust.ps1 test
powershell -NoProfile -ExecutionPolicy Bypass -File tools/rust.ps1 check
powershell -NoProfile -ExecutionPolicy Bypass -File tools/rust.ps1 build
powershell -NoProfile -ExecutionPolicy Bypass -File tools/rust.ps1 wasm
powershell -NoProfile -ExecutionPolicy Bypass -File tools/rust.ps1 wasm-tests
```

UI-only Node tooling builds `vite.rust.config.ts`. Browser tests are
`tests/rust-editor-browser.mjs`, `tests/rust-scene-browser.mjs` and
`tests/rust-kernels-browser.mjs`; the latter two require `wasm-tests`.
Set `RUST_SCENE_SCOPE=ground`, `rooftop`, `cells`, `facade`, `shop-equipment` or
`shop-stock`, `grocer`, `greengrocer`, `hardware`, `herbalist`, `roast`, `shop-facade`, `pavement`, `spans` or `buildings` for focused material/lifecycle checks;
the default scope runs every procedural fixture. Scoped captures use a separate
`generated/rust-scene-browser-<scope>` directory.
Packet admission tests live in `tests/browser/rust-packet.test.ts`. The native process tests launch
with an empty PATH to establish that scene compilation does not invoke Node.
`tests/rust-export-browser.mjs` requires the release CLI and production Wasm build;
it checks GLB delivery through the independent validator and Three's actual loader.
`tests/rust-preview-browser.mjs` requires the release CLI and production UI build;
it launches the native file service with an empty PATH from another directory.
