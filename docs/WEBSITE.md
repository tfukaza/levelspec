# Browser editor and native preview

Build Wasm with `./tools/rust.ps1 wasm`, install UI dependencies with `npm ci`, then use `npm run dev`. The editor compiles AML inside a Web Worker using the same Rust compiler as the native executable. Import companion files or a folder to preserve relative paths. Valid edits replace the scene coherently. Failed edits retain the previous scene and identify its older revision.

The courtyard button supplies the demo's AML and three local source images. The material library is loaded on demand. A worker retains bounded caches across completed edits. Superseding a busy build terminates its worker, releasing memory.

## File preview

Run `npm run build:rust-ui`, then `superspec preview projects/my-level/level.aml`. The native service binds to 127.0.0.1, serves the prebuilt UI, watches AML and actual asset dependencies, and publishes only a coherent accepted revision. File preview is read-only.

Drag to orbit, use the wheel to zoom, and click geometry to inspect its source. Click **Walk**, then a supported floor, to start standing inspection. WASD moves and the captured mouse controls looking. Escape returns to orbit. TypeScript controls check the standing capsule and physical support against generated collision geometry. Space jumps, Ctrl/C crouches, and the movement helper can repeat those actions. Walking is an inspection aid and does not establish gameplay reachability.

Camera URLs accept `camera=x,y,z`, `target=x,y,z`, `projection=perspective|orthographic`, `fov`, `view-height`, `roll`, and `appearance=wireframe`. Coordinates use domain Z-up meters.

The editor's **Validate** command displays source-linked findings, sampled land and water navigation and witnessed routes. Clicking a spatial finding frames its bounds. **Download GLB** uses Rust export code with the current companion snapshot.

## Captures and checks

`node tools/capture-level.mjs SOURCE.aml NEW_OUTPUT VIEWS.json` captures a list of named camera records. Each record contains `id`, `position`, `target` and `projection`, with optional `fov`, `viewHeight`, `roll`, `frameAspect` and `appearance`. The tool checks accepted source/asset identities between views and records actual camera state. Capture output belongs under `generated/`.

`npm run test:preview:browser` exercises native file watching and recovery. `npm run test:rust:browser` exercises browser Wasm editing and delivery. `npm run test:export:browser` checks native GLB output in the browser loader. These checks need the built native executable, prebuilt UI and a Playwright browser.

The optional threaded Wasm package requires cross-origin isolation and currently uses experimental Rust atomics support. The native service supplies the required headers. Plain Wasm remains available for hosts without those headers.
