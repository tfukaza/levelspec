# Rust / Wasm stage one

The same Rust source compiles a strict AML subset natively and in a browser Web
Worker. Three.js consumes packed geometry and authored material values. The
editor holds AML in memory, updates the mesh after edits, reports source errors,
retains the last valid scene, and provides an explicit AML download. It does not
write project files. The existing read-only reviewer is unchanged.

This slice establishes the editing/transport boundary, not the one-second
detailed-courtyard target. The new sample is `tests/fixtures/aml/rust-stage1.aml`;
it is not a replacement for `projects/dressing-demo/level.aml`. General boolean
solids, navigation and UV portability decisions remain outstanding from stage zero.

## Run

Use Rust 1.100.0, the `wasm32-unknown-unknown` target and **wasm-bindgen-cli 0.2.130**.
Node 24 is needed only for UI builds/development and browser test drivers.

```powershell
./tools/rust.ps1 test
./tools/rust.ps1 build
./tools/rust.ps1 wasm
npm run build:rust-ui
npm run dev:rust
```

The PowerShell helper uses this worktree's ignored local toolchain when present,
otherwise the tools on PATH. It does not install packages or change system PATH.
On this Windows GNU setup, bundled GCC links the Rust executable and a portable
LLVM-MinGW `dlltool` supplies import libraries; LLVM's GCC alias cannot substitute
for GCC when linking this Rust GNU standard library. Local downloaded tools live
under `generated/rust-toolchain/`. Other machines need their normal Rust linker.

Equivalent portable build commands:

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.130 --locked
cargo test --workspace --locked
cargo build -p superspec-cli --release --locked
cargo build -p superspec-wasm --target wasm32-unknown-unknown --release --locked
wasm-bindgen --target web --out-dir generated/wasm target/wasm32-unknown-unknown/release/superspec_wasm.wasm
npm run build:rust-ui
```

Host `generated/rust-editor/` with any static HTTP server using
`application/wasm` for Wasm files. Browser compilation needs neither Node nor a
compiler server, and works without cross-origin isolation or shared memory.
The Vite command is a UI development server only. A production native preview
server belongs to stage four.

`target/release/superspec[.exe] scene <file.aml>` emits one binary `LSP1` packet to
stdout, with source revision zero. Success exits 0; source/compiler failures
produce a diagnostic packet and exit 1. File-loading failures go to stderr;
usage errors exit 2. `--json` is not supported for this binary command. Use a
binary-safe redirect or process stdout capture. `init` and `inspect --json`
retain their existing foundation contracts. Build/validate/export commands are
still explicitly unsupported; `scene` does not claim full validation.

## Supported AML

- Root: `architecture version="1"`, required `id`, optional `name`,
  `units="meters"`, and `validation="premap|playable"`. Both validation modes
  report geometry and navigation audits as **not run**.
- `material`: `id`, `color="#rrggbb"`, `roughness`, `metalness`. Omitted material
  uses the authored `default` material or the existing built-in default.
- `box`: `id`, `width`, `depth`, `height`, `position="x y z"`,
  `anchor="corner|bottom-center"`, `material`, `visible`, `collidable`.
- `path`: `id`, `points="x y z; x y z"`, with two distinct horizontal points.
  Arbitrary XY direction and base elevation are supported.
- `wall`: `id`, `path`, `height`, `thickness`, `alignment="center"`, `material`,
  `visible`, `collidable`.
- `opening`: `id`, `host`, `center="station elevation"`, `width`, `height`,
  `shape="rectangle"`, `mode="through"`. Center values are the aperture center
  in wall-local station/height coordinates. One opening per wall; it must remain
  inside both ends and below the top. Its bottom may meet the wall base.

Defaults follow existing AML for these supported attributes. Unsupported
elements, attributes, nesting, transforms, opening configurations and references
fail explicitly with UTF-16 source ranges. Stage-one limits are 9999 declarations,
positive sizes/lengths of 0.001–10000 meters and coordinates within ±10000 meters.
F32 storage collapse is rejected. These are admission limits for this slice,
not newly imposed restrictions on the old compiler.

Rust computes boundary surfaces for boxes and a rectangular wall grid around an
aperture. It emits no internal partition faces; opening reveals are real faces.
This intentionally narrow algorithm is not a general boolean-kernel decision.
Render visibility and collision membership remain separate. Collision references
the canonical mesh ranges; no navigation sampling, gameplay reachability or
structural overlap audit is claimed.

## Scene and editing ownership

`superspec-aml` owns typed source data and diagnostics; `superspec-engine`
owns geometry, material resolution and scene packaging; `superspec-wasm` exposes
one coarse `compile_packet` call. The native `scene` command invokes the same
compiler. There is no TypeScript compiler fallback or Node subprocess.

`LSP1` contains magic bytes, a little-endian u32 padded JSON byte count, a small
UTF-8 manifest padded to four bytes, then contiguous XYZ f32 positions, XYZ f32
normals, and u32 triangle indices. Indices are local to each mesh's vertex range.
The manifest includes version/revision, source identity, materials, mesh ranges,
bounds, collision membership, opening provenance and actual audit status.
Normals/positions use meters and right-handed Z-up; material colors are sRGB.
UVs, textures and tangents are not present in this slice. Failures carry no mesh
buffers. The renderer checks schema, lengths, finite values, ranges, references
and indices before allocating GPU geometry.

Wasm output is copied into a JS-owned buffer before worker transfer. This is not
zero-copy transport. Typing is coalesced for 150 ms; busy workers are terminated
when superseded, idle initialized workers are reused, and revision checks reject
stale delivery. Restart explicitly discards the worker. Full scene replacements
release previous geometry/material resources; camera and surviving selection
are retained. Dependency caching, scene patches, threaded Wasm, and measured
memory/cancellation latency belong to later phases.

## Acceptance

```powershell
./tools/rust.ps1 test
./tools/rust.ps1 check
npm run check
npm run test:rust:packet
npm run test:rust:browser
```

The last two commands require a release native executable and a current production
UI build. Browser acceptance also needs an installed Playwright Chromium. This
worktree uses `PLAYWRIGHT_BROWSERS_PATH=generated/playwright-browsers` and
`SOFTWARE_RENDERING=1`. These tests are separate from the legacy backend suite.

Native tests cover geometry bounds/volume/winding, rays through apertures, source
failures, deterministic framing, defaults and native process execution with empty
PATH. Browser acceptance compares native and actual Wasm packet bytes, observes
uploaded bounds after edits, malformed-input retention and recovery, obsolete
worker closure during gated initialization, latest revision, explicit restart,
recovery after a failed Wasm fetch, repeated edits and AML download.
Packet tests exercise corruption rejection before GPU allocation. Screenshots and
machine-readable acceptance evidence are written under
`generated/rust-stage1-acceptance/`.

This acceptance targets Windows native and Chromium without shared-memory
hosting. Firefox/WebKit, other native platforms, memory plateau measurement and
full detailed-scene visual parity are not established by this slice.

Verified in this worktree: 22 Rust tests, two packet tests, strict Clippy, full
TypeScript checking, release native/Wasm builds and the production editor build.
Chromium acceptance uses a static-only server and compares all 6,552 bytes of
the native and Wasm fixture packets. The screenshot was visually inspected for
the actual wall aperture. Independent test and implementation reviews were
completed with their material findings addressed.
