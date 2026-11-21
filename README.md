# LevelSpec

Author and evaluate architectural levels in AML XML. LevelSpec produces AML;
SuperSpec reads it and builds the scene with physical geometry, procedural
materials, exports and shared preview. LevelSpec owns the authoring harnesses,
demos, projects and reference evidence.

The [sample map index](projects/README.md#sample-maps) links the retained AML
maps. The [Klali Stoa project](projects/klali-stoa/README.md) shows how an AML
level passes through SuperSpec and into a game.

## Run

Keep this checkout beside `superspec/`. The implementation is selected by
`superspec.lock.json`; `tools/superspec.mjs` verifies its complete source and asset
fingerprint before launching it. See [SuperSpec setup](../superspec/README.md).

```powershell
npm ci
npm --prefix ../superspec ci
./tools/rust.ps1 build
./tools/rust.ps1 wasm
npm run build:rust-ui
npm run levelspec -- init projects/my-level
npm run levelspec -- validate projects/my-level/level.aml --json
npm run levelspec -- preview projects/my-level/level.aml
npm run test:engine
```

On any platform, `npm run levelspec -- <arguments>` forwards arguments and paths
from the current directory to SuperSpec's native CLI. `RUST_CLI` can select an
explicit built executable. Packaged native preview requires no Node installation.
`npm run dev` opens the shared Wasm editor. Use **Open AML and companions** or
**Open AML folder** to load a scene; the [demo library](demos/README.md) contains the courtyard, sign-weathering study and Dust II map.

`./tools/rust.ps1 wasm-threads` builds the experimental shared-memory variant.
The threaded toolchain still requires rebuilding Rust's standard library with
experimental atomics support. Source pins must be updated together with the
SuperSpec distribution manifest after reviewed implementation changes.

## Native workflows

`superspec --help` lists `init`, `inspect`, `validate`, `scene`, `build`, `glb`, `preview`, `generate`, `trace`, `migrate`, `reconstruct`, `bake`, `game-export` and `benchmark`. Finite `--json` commands emit one stdout result. Progress uses stderr. Exit codes are 0 for success, 1 for failure, 2 for usage, and 130 for cancellation.

The browser editor supports AML editing, companion assets, validation, source inspection and GLB downloads. Both browser surfaces provide orbit and standing inspection. Click **Walk**, then a supported floor. WASD moves, mouse capture controls looking, and Escape exits. TypeScript controls check standing support and collision against the generated model.

Use `tools/capture-level.mjs` for named browser captures. It launches the native preview and records accepted source/asset hashes and camera state. Node runs the browser automation. `tools/package-rust.ps1` packages the native executable, reviewer and material library together. Blender and Quake build tools are optional external programs for their corresponding export workflows.

## Sources and checks

Keep authoring sources and references under `projects/`. Generated products belong under ignored `generated/`. Domain coordinates are right-handed Z-up meters. Render visibility, collision and navigation have separate representations. Navigation checks and inspection walking provide sampled evidence.

```powershell
npm run check
npm test
./tools/rust.ps1 check
```

The Rust PoC replaces the former Node backend. Maintained native tests and focused fixtures live in SuperSpec. LevelSpec's `tests/engine` owns acceptance of Daiban and Dust II through that dependency. Historical evidence remains under `docs/` and authored projects; generated recovery snapshots are not required dependencies.

See [current capabilities and limitations](docs/IMPLEMENTATION.md), [implementation evidence](docs/RUST_PROGRESS.md), and [the documentation index](docs/README.md). The one-second incremental preview goal remains under measurement. The accepted demo uses building texture density 16, with overview and close views inspected.
