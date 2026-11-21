# Continuing on another computer

The active migration branch is `codex/demo-build-optimization`. Commit and push the worktree before transferring it. Generated binaries, recovery snapshots and local benchmark/capture evidence are ignored by Git.

Transfer both LevelSpec and its pinned sibling SuperSpec checkout. Follow [consumer setup](SUPERSPEC.md), verify with `npm run engine:verify`, and install the pinned Rust toolchain and Node 24. Build through `tools/rust.ps1 build` and `tools/rust.ps1 wasm`, or use the native build commands in SuperSpec. Install npm dependencies in both repositories, then use `npm run build:rust-ui` from this harness.

The native executable can compile, validate and export without Node. For a portable local bundle, run `tools/package-rust.ps1`. Keep its executable, `reviewer/` and `materials/` together. Optional Blender and Quake tools must be installed separately for those output workflows.

Keep project AML, declared companions, references and review notes. Regenerate Wasm, UI bundles, binaries and benchmark outputs on the destination machine. The former Node source snapshot under `generated/legacy-node-source` is local recovery evidence. It is excluded from the native distribution.

Read [implementation evidence](RUST_PROGRESS.md) for measured timings and remaining PoC hardening. The one-second edit goal has not been established across local edits.
