# Procedural storefront reference study

## Current entry-point status

This project retains authored AML, original art, model repair code and frozen
visual reviews. Its `build.mjs` and scene adapters depend on the retired
TypeScript compiler. The custom lighting, room effects and capture scripts are
historical study behavior; they are not the common SuperSpec preview pipeline.

`bake-register.mjs` requires the retired `sharp` dependency and writes the old
TypeScript catalog/image paths. Its register-specific mesh repair and texture
processing have no matching native authoring command, so that script and its
source model remain as provenance. The approved runtime copy belongs to
SuperSpec's `crates/engine/src/worldspec/themes/kowloon/shop/assets/shop-register.json`
and `assets/materials/`.

Use [the maintained demo library](../../demos/README.md) for current editor
entry points. The dated review documents in this directory describe the outputs
and implementation that existed when they were recorded.

## Original study record

This study renders the real production provisions (`grocer`), produce (`greengrocer`), and roast-duck (`roast`) furnishings inside a shared street bay. It is a visual art fixture, not a playable map. AML is the source format; `scene.ts` adds the production dressing to its invisible host.

The active concept targets are `concepts/industrial-daylight/{grocer,greengrocer,roast}.png`. These were generated from scratch with the built-in image tool; exact prompts and the empty reference-image list are retained in `concepts/industrial-daylight/prompts.json`. They explore daytime industrial anime atmosphere and new layouts, rather than documenting the implemented models. Earlier supplied targets remain in `projects/kowloon-reference-building/concepts/storefronts`. Each revision review critiques a frozen reference/render pair.

## Reproduce a revision

From the repository root, choose a new revision name; existing revisions are deliberately not overwritten:

```powershell
node projects/storefront-study/build.mjs r13
node projects/storefront-study/capture.mjs r13
node projects/storefront-study/capture-layouts.mjs r13
node projects/storefront-study/compare-research.mjs r13
```

The build writes GLBs, source snapshots, a browser viewer, and geometry/hash metadata under ignored `generated/storefront-study/<revision>`. Capture uses installed Chrome through Playwright, checks the loaded GLB hash against the build manifest, and records the camera. The comparison script places complete reference and capture images side by side without retouching them. To inspect a frozen revision interactively:

```powershell
node node_modules/vite/bin/vite.js generated/storefront-study/r12 --host 127.0.0.1 --port 48219
```

## Current implementation

- Shops use 2.4–7.2 m of available host depth. Most seeds select the upper portion of that range; occasional shallow shops remain. Rear obstructions shorten a useful front room instead of discarding the bay. The study bay is 4.8 m wide, 6.2 m deep and 2.65 m high.
- Provisions fixtures primarily use solid-backed timber cabinets and a low open timber aisle unit, retaining steel banks and wire entrance/wall racks. Timber decks are 4 cm thick and main banks are 0.46–0.50 m deep. Lower or visible stock can occupy two rows. Produce back stock also leans toward timber; the roast pantry uses timber.
- Shelf metal has a dedicated physical-scale finish and cache identity: millimeter-scale handling wear, small brown oxidation spots and short joint trails. It does not reuse the window/cage corrosion recipe. Existing architectural metal sampling remains unchanged.
- Shelf support and stock have separate named parts. The fixture families return measured usable deck regions, with posts and braces outside those stock regions. Layout reservations retain the entrance and working gaps.
- Crates are taller at the provisions entrance, and its street displays carry packaged goods. Produce displays retain fruit and vegetables. The produce agent owns the foreground produce models and crate arrangement.
- Shared improvements include aged canvas, interior wall deposits, dirty ivory restaurant tiles, a glazed service door, deeper preparation/storage, and amber hanging birds. R09 adds localized soot around actual entrance apertures and larger birds fitted to the display's glass and work clearances. Container art retains per-crate color families and separately mapped, liquid-stained cardboard lids and sides.
- Every provisions and produce arrangement includes a supported register. The current deep produce layout reserves a front-left payment counter and staff space, a 1.10 m central passage, and a 0.93 m rear crossover. Tiered side banks fill the remaining display footprint; compact shops retain their frontage layout.
- Roast shops at least 4.4 m wide and 5.2 m deep include a small dining area. The 4.8 × 6.2 m study has two tables/four stools; the smallest eligible variant has one table/two stools. A kitchen width capped at 2.45 m and a plating/storage peninsula create a bounded working galley. It contains two woks and one open sink; loose gas cylinders are omitted from the dining layout's rear approach.
- The default dining passage is 1.20 m wide, with at least 0.90 m in the smallest eligible variant. The galley is approximately 1.17–1.27 m wide, with front and rear crossovers. These are decorative fixture clearances, not a collision/navigation certification.

The new photograph and AI concept study is recorded in [concepts/research-r10/README.md](concepts/research-r10/README.md). R10 and R11 critiques prompted the kitchen peninsula and removal of a rear obstruction. R12 retains those corrections. Boundary builds use `build.mjs <new-revision> small-dining` or `small-produce`, followed by `capture-layouts.mjs <new-revision>`; the cutaway removes the envelope, near wall and ceiling fixtures for inspection while retaining their shadow casters. Full interior captures retain the ceiling and all fixtures.

## Validation and cost

Focused checks cover seeded fixture reservations, stock resting on actual decks, shallow/deep room bounds, mirrored and rotated hosts, overhead clearances, deterministic geometry, and unchanged collision. Independent test and implementation reviewers reviewed the shelf changes and their follow-up corrections. Visual acceptance is separate from those geometric checks.

R12 passed 37 focused function, produce, layout, material, shelf, stock and frontage results, plus TypeScript checking. The five-trade depth regression also passed. Dining tests inspect all emitted triangles against connected empty corridor volumes and shrink those volumes by a 0.30 m body radius to check both turns. This establishes clearance in the decorative fixtures for the tested variants; it does not add their collision or certify gameplay navigation. Independent implementation, circulation and fresh visual reviews accepted the scoped R12 corrections. Logs are retained under `generated/storefront-study/r12-tests-*.txt` and `r12-validation-summary.txt`.

The R12 study exports approximately 121k provisions, 116k produce, and 51k roast triangles including the shared facade and surface appearance. Embedded GLBs are approximately 73.5, 72.2 and 64.8 MB respectively. These are dense art-review exports; this work does not establish a whole-scene frame-rate budget. Fixture test limits were deliberately revised for deeper stock, with measured maxima and aisle/depth scaling rather than disabling budget checks.

Relevant focused commands:

```powershell
node node_modules/typescript/bin/tsc --noEmit
node --test tests/aml-shop-shelves.test.ts tests/aml-grocer-layout.test.ts tests/aml-shop-depth.test.ts tests/aml-shop-containers.test.ts
node --test tests/aml-shop-function.test.ts tests/aml-greengrocer.test.ts tests/fixture-access.test.ts
node --test tests/aml-shop-wall-wear.test.ts
node --test --test-name-pattern='production stock' tests/aml-stock-appearances.test.ts
node --test --test-name-pattern='restaurant stock fits|restaurant seeds|roast ducks|counter work|restaurant display' tests/aml-restaurant-props.test.ts
node --test --test-name-pattern='shop rooms use the available building depth' tests/aml-shop-dressing.test.ts
```

R12 is a substantially denser procedural interpretation, not a completed photoreal reconstruction. Remaining art gaps include floor surface detail, more localized tile grime, irregular organic food silhouettes, and the reference's warm focal lighting. The isolated review bay also omits the surrounding building context. Review notes preserve these limitations rather than treating a passing support test as visual approval.

## R18 lighting audit

The roast study now derives every artificial direct light from the named bulb or fluorescent tube geometry. GLB primitives share a position buffer, so fixture bounds must use referenced indices, not the full position accessor. This also fixes the near-wall cutaway selection. The old regular point-light grid and unmodeled cook/dining spots are disabled for roast. A modeled under-hood batten supplies the cooking light.

Display lights use a 0.85-radian half-angle, inverse-square decay and a 3 cm shadow near plane; each tube uses one shadowed center sample to remain within WebGL sampler limits. These are real-time approximations to extended emitters, not a full area-light or global-illumination solution. Low hemisphere/environment fill approximates indirect bounce (0.12 / 0.06 intensity); fixture-only captures disable both. Furniture uses baked vertex contact shading plus screen-space AO and real-time shadows. This is not an AO texture bake.

Run `node projects/storefront-study/capture-sources.mjs r18` for fixed-exposure daylight, fixture and combined captures plus an actual-light/emitter audit. The capture rejects detached emitters, missing sources and browser shader errors. The lighting rig belongs to this study viewer; exported props retain their named fixture geometry but do not yet embed punctual lights.

R18 used [the R13 paintover](concepts/paintover-r13/roast-cutaway.png), not a production screenshot. R13/R14 visual reviews rejected the overall art match despite functional improvements; see [the mandatory critical review contract](VISUAL-REVIEW.md). Every subsequent review must identify at least one concrete area for improvement.

R18 balances the six sources at 8 cd per amber display lamp, 9 cd per ceiling tube and 4 cd for the warm under-hood tube. Display heads move forward inside the case footprint and, when ceiling height permits, rise above the glass roof on modeled risers. Shallow-height variants retain the original enclosed mounting. Focused tests check shade/glass crossings as well as room/ceiling bounds. R18 exports 90,966 roast triangles; collision hash is unchanged.

## Daylight industrial and room-patina pass

The `patina-r05` captures introduced the fresh `industrial-daylight` concept set. Daylight and cool sky fill preserve blue-gray shadows without implying nighttime. All three shops now use artificial lights anchored to modeled fixtures; the study rig remains a real-time approximation and is not embedded as punctual lights in exported GLBs. Split canopies, trade-specific faded signs, attached ducts, conduit junctions, and interior services add industrial layers to the isolated study bay.

Kitchen stainless has a separate `kitchen-metal` material with broad low-amplitude discoloration, liquid tidelines, and roughness variation. Shared architectural brushed metal is unchanged. The new material's source maps, generation script, and manifest are retained in `kitchen-metal/` and `tools/bake-kitchen-metal.ts`.

Shelves carry strong authored contact shading at backs, undersides, joints, and stock bases, retaining lighter exposed edges and labels. Room shading adds base/corner/ceiling occlusion, brown tide deposits, sparse runoff, and floor dirt. This is persistent vertex shading in the exported model, not a physically solved AO bake. A placement-specific post-bake color hook keeps the shading intact when the material compiler replaces source vertex colors, without changing intrinsic material textures or cache identity. Wall proximity fades continuously across displaced finishes; broad plain surfaces gain interpolation vertices while narrow grout strips retain coarser sampling.

R05 exports 137,590 provisions, 138,572 produce, and 117,940 roast triangles, with approximately 81 MB embedded GLBs each. All three physical hashes remain unchanged. These are dense art-review assets, not a whole-scene performance certification. The latest focused room/shelf suite passes 7/7 plus TypeScript; earlier compiler and displaced-tint regressions also passed. Independent implementation review is recorded in `industrial-implementation-review.md`, with visual findings in each `patina-rNN-review.md`. Earlier whole-building appearance-budget failures remain outside this pass; no full-suite success is claimed.

Reproduce with `node projects/storefront-study/build.mjs <new-revision>`, followed by `capture.mjs <new-revision>` and `capture-register.mjs <new-revision>`. The concepts remain inspiration: their surrounding urban architecture and irregular building volumes are not reproduced by this isolated rectangular shop fixture.

## Shelf and surface follow-up

The upper produce wall shelf now receives frame shading, aged wood, and shelf-scale metal weathering on its brackets. Its formerly omitted visible board and cleat fronts are restored. Steel and wire racks receive warmer recess dirt and contact-local material shading, while stock keeps its separate contact shading. The shelf finish uses a versioned material recipe so old cached surfaces cannot hide the change. `capture-shelves.mjs <revision>` records indexed-geometry bounds, the loaded model hash, and actual interior views of the wall shelf and metal rack.

The can, bottle, and jar bake retains approximately 58% of the previous chroma. It regenerates from stable source artwork, updates fallback colors, and leaves other atlas regions, geometry, UVs, normal maps, and material-property maps unchanged. Procedural tins/bottles/jars use a corresponding color adjustment. Practical lights use paler warm colors with their intensity and source positions retained. Room detail adds existing torn poster art and finer runoff. See `finish-implementation-review.md` and per-revision visual reviews for validation and outstanding art findings.

Material direction: reuse existing materials and their wear/grime controls, or derive a material from an established recipe. Avoid inventing separate flat-color texture approximations. The opaque floor-spill experiment in `finish-r01` through `finish-r03` is superseded by the shared ceramic floor material; retain those captures only as review history.

The current `shared-floor-r02` build uses the existing `TileField` / `tileSurface` ceramic, bedding, grime, and normal maps for all three shop floors. Tiles are 0.28 m square with grime 0.98, wear 0.45, and a darker local bedding tint. R01's wear 0.82 produced excessive pale missing-tile patches; R02 reduces tile loss while retaining the material's weathering. No separate floor spill geometry or custom floor dirt field remains. Room shading supplies floor-edge AO only. Each trade keeps its original floor pigment, including red quarry tile in the restaurant.

R02 exports 138,210 provisions, 139,254 produce, and 111,280 restaurant triangles, with embedded files of approximately 85, 85, and 80 MB. Physics hashes are unchanged. Independent test and implementation reviews passed; 11/11 focused floor, shared-tile, wall-detail, and room-patina checks plus TypeScript pass. Actual overview and restaurant close-up captures use recorded model hashes and matched cameras. See `shared-floor-r01-review.md` and `shared-floor-r02-review.md` for visual findings; this material correction does not establish full concept-art fidelity or whole-scene performance.
