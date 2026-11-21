# LevelSpec repository guidance

## Skills

- For optional prop art and procedural-versus-AI asset comparisons, apply [level-prop-assets](.agents/skills/level-prop-assets/SKILL.md). This does not require AI generation for ordinary map authoring.
- For TypeScript creation/refactoring/review, apply [write-readable-typescript](.agents/skills/write-readable-typescript/SKILL.md).
- For test design, review or consolidation, apply [maintain-tests](.agents/skills/maintain-tests/SKILL.md).
- For map layout, topology and circulation authoring/review, apply [level-authoring](.agents/skills/level-authoring/SKILL.md).
- For FPS map creation or gameplay-relevant geometry revisions, including cover repairs, follow [fps-map-workflow](.agents/skills/fps-map-workflow/SKILL.md), the authority for phases and review progression. Keep local repairs local.
- For FPS territory, objectives, information and rotations, apply [fps-strategy-design](.agents/skills/fps-strategy-design/SKILL.md); for corridors, cover, obstacles, vantage points and sightlines, apply [fps-combat-geometry](.agents/skills/fps-combat-geometry/SKILL.md).
- For FPS gameplay critique, population scenarios or playtest analysis, apply [fps-map-review](.agents/skills/fps-map-review/SKILL.md). Architectural-only and presentation-only work does not require FPS review.
- For real-image study informing themed invention or for source-constrained maps, apply [reference-level-authoring](.agents/skills/reference-level-authoring/SKILL.md), selecting inspiration or fidelity as appropriate.
- For illustrated preview rendering/review, apply [level-preview-art](.agents/skills/level-preview-art/SKILL.md).
- For architectural plausibility, enclosure, roofs/ceilings and environmental completeness, apply [level-architecture-review](.agents/skills/level-architecture-review/SKILL.md), distinct from renderer styling and gameplay review.

## Current contracts

AML XML (`.aml`, or identical `.xml`) is the authoring and interchange format. LevelSpec's `crates/aml` publishes AML drafts as XML. SuperSpec reads that XML, builds the scene and delivers it. The sibling SuperSpec distribution is selected by `superspec.lock.json`.
Build the pinned SuperSpec native CLI with `tools/rust.ps1 build`. Use `npm run levelspec -- <arguments>` to verify the pin and invoke it. The commands below use `superspec` for the packaged executable.
The experimental portable bundle includes the executable, reviewer and material assets. Public release publishing remains manual.
Runtime JSON, reports and bake manifests are legitimate outputs.

Use meters and right-handed Z-up in domain code; exporters own axis conversion.
Keep render visibility, collision and navigation separate. Navigation sampling is
not continuous proof; static premap success does not verify gameplay reachability.

Emit errors for definite invalid input or demonstrated violations of declared
requirements. Emit non-blocking warnings for geometry that may be wrong but could
be intentional; missing architectural intent is not a reason to omit a warning.
Make findings immediately inspectable with source objects/locations, spatial
bounds and an inspection target, plus the evidence and reason for concern.
Distinguish an inconclusive sampled check from a demonstrated failure. Warnings
request review; they do not authorize automatic geometry changes.

## Existing commands

- `superspec init projects/my-level` creates XML and working directories.
- `superspec validate projects/my-level/level.aml --json` validates without writing.
- `superspec preview projects/my-level/level.aml` starts read-only live review.
- `superspec build projects/my-level/level.aml --out generated/my-level --json` publishes validated artifacts.
- CLI progress goes to stderr; finite --json commands emit one stdout result. Exit codes are 0/1/2/130 for success/failure/usage/cancel.

- `superspec reconstruct --source <file.aml> --evidence <annotations.json> --out generated/<new-run>` evaluates frozen candidates against independent image evidence. `--model` enables the optional model-assisted revision loop. Historical SVGX inputs require explicit migration; reconstruction is optional for ordinary AML authoring.

- `superspec generate`, `superspec trace`, `superspec bake` and `superspec game-export` own the corresponding native workflows.
- `npm run dev` starts the Rust/Wasm web editor.
- Its `/material.html` and `/item.html` routes edit versioned MaterialSpec and ItemSpec projects. `npm run studio -- check|scene|glb <source>` runs the pinned authoring CLI; `STUDIO_CLI` selects an explicitly built binary. See SuperSpec's `docs/AUTHORING.md` for saved bundles and native world composition.
- `npm run check` and `npm test` validate UI types and scene transport. Native checks use Cargo.
- `npm run test:preview:browser` verifies live-preview file watching in a real browser.
- `npm run build:viewer` and `npm run build:rust-ui` build the browser surface.
- `npm run test:rust:browser` runs the editor smoke with an installed Playwright browser.

Node 24 is used for web UI tooling. Rust 1.100 is pinned for native and Wasm builds. Native exporters/bakers have optional prerequisites;
report unavailable checks explicitly. Keep generated outputs under ignored
`generated/` and retain source/reference/review evidence separately. Follow user
project layout choices; `projects/<name>/` is the supported project convention.

Normal level CLI/reviewer inputs accept AML. Use `superspec migrate <source.level.svgx> --out <new-project>` for explicit mechanical source translation. SVGX authoring APIs are retired; only the explicit migration decoder remains. Legacy ASCII/JSON level authoring remains retired. Versioned ItemSpec definitions, studio project bundles and runtime JSON remain supported.
Start with [current documentation](docs/README.md), not historical plans.

## Repository map

- `crates/aml`: AML draft authoring and XML output.
- `../superspec/crates`: AML reader, geometry, scene builds, materials, validation, exports and native/Wasm hosts.
- `../superspec/editor`, `../superspec/browser`, `../superspec/assets/materials`: UI, shared browser infrastructure and catalog images.
- `examples`: maintained Daiban source. `tests/engine` checks Daiban and the Dust II demo against the pinned SuperSpec dependency.
- `demos`: courtyard, sign-weathering material study and Dust II complete-map AML folders with their companions. Open them through SuperSpec's Open AML controls.
- `tools/fixtures/courtyard`: native source variants for bake tooling and compiler acceptance, not a second interactive site.
- `../superspec/crates/*/tests` and `../superspec/tests`: focused native, Wasm and browser contracts.
- `docs`: current guides; `docs/archive`, `docs/plans`, `docs/reviews`: historical evidence/plans.
- `examples`, `projects`, `reference`: supported sources and reference evidence.

Never infer supported examples from untracked conversion/scratch directories such
as `maps/vector`. Preserve user-owned files unless their cleanup is requested.
