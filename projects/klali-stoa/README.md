# Stoa · Old Hong Kong

Open the **Stoa · Old Hong Kong** map in Klali's play menu, or use `/?map=stoacity` on its local game server. The map lab at `/maps.html?map=stoacity` also works without a match.

## Source and scale

`scene.aml` is the editable AML v1 map. Its base is Klali's 64 × 64 m Stoa at `5b22b3f8ae390a7f52ce54951e4fb2df0f7ccd81`. X/Y/Z in Klali become X/−Z/Y in AML. The port carries both the fine invisible stair colliders and the larger visible treads. Klali retains spawn yaw, team respawn rules and the bot graph.

All 85 shop houses begin at street level. Four replace part of an island wall inside the arena and 24 form the rim. End-on houses alternate with wider frontages and narrow alleys. Beyond the rim, 57 houses and return wings follow both sides of an eight-segment service street. The frontages meet along party walls and open onto paved courts at the bends. The road, pavement, lamps and frontages use the same survey. The procedural ItemSpec generator supplies six base designs and a seventh prototype for the chicken storefront. Storeys, shop trades, awnings, service ducts, tiled spandrels, laundry, windows, stock and roof fittings retain their source geometry. The shared WorldSpec preview supplies the GPU-baked MaterialSpec surfaces.

Four illustrated street trees stand on the original lane and courtyard planting beds. Sixteen more follow the backstreet pavement. Their AML placements share a TreeSpec scene packet. The packer uses WorldSpec's painted foliage cards, middle-distance bark mesh and foliage palette. Each card carries a small sprig. Overlapping sprigs in the occluded part of the crown use a softer paint stamp. The exporter fixes the card orientations for the game's lighting and shadow passes. All 20 trees share one canopy material and one bark material.

Regenerating the AML also scatters weed clumps along exposed wall and pillar bases and in the mortar courses of the paved floors. The contact sampler in `weed-contacts.mjs` uses visible receiving geometry, pavement spacing and reserved building footprints. Each root becomes an editable `<weed>` placement with a heading and scale. Wall and pillar bases use a broad asymmetric mound. Paving joints use the shorter, broken seam variant. Both share painted leaf and normal textures. Translucent cards supply soft undergrowth, and grass blades catch the light and cast shadows.

Eight masonry planters carry TreeSpec painted lawns on four shared footprints. Their soil baseline sits 14 cm below the rim, with rolling relief above it. The exported cards sample their root color, height and normal from the turf triangle underneath. The game reads the same seeded tuft sampler and 24-cell brush atlas as the TreeSpec lawn. Each of the four reusable templates carries upright fuzz, a separate layer of short sunlit dashes and a layer of taller highlight blades. At eye level their rectangular brush stamps face the camera. At steep angles they settle into seeded directions. Each blade takes pigment and a growth normal from the turf at its root. The game blends the turf and its soft growth within two screen pixels. Scattered narrow blades keep a sharper contour. Looking down lifts the dark pigment between strokes, while masonry and tree shadows still follow the scene lights. The relief is baked into the terrain mesh, and standard glTF viewers show the fixed cards and baked paint. The original collision brushes still support the player.

The original map retains its 503 collision brushes and 30 spawn positions. Klali adds 28 rectangular collision shells from AML for the playable houses. The 57 exterior houses are scenery. Klali's map tests rebuild the navigation graph against the combined brushes and check spawn routes.

Three panels around the raised central planter use the standalone Kowloon `procedural-wall` ItemSpec. Each placement seeds the service pipes, wires, and poster cluster. The wall's concrete is baked at metric scale, with localized grime at the head and foot. The corresponding map brushes remain as the collision surfaces.

`room-services.mjs` surveys the upper arcade from its floor brush. The port looks for opposed full-height wall faces joined by a continuous strip of ceiling, shifts the route past obstructions, and checks clearance from previously routed services. It emits editable `pipe-run` and `duct-run` placements with a mounting offset for each straight section. The center skylight stays open. Run `node --test room-services.test.mjs` for the surface coverage and missing-host checks.

### Planter room

The east bay has two AML casements between its existing sill and lintel. The northern sash is closed and the southern sash swings into the room. Each window takes its dimensions from its wall opening. The map build converts the frame and posed sash into separate collision brushes so the open aperture stays clear.

The upper arcade has two low concrete walls along the central grass bed. Their bodies and coping use the same bounds as the exported masonry colliders. Keep the compiled `stoacity-masonry.json` paired with its visual map. The overhead duct feeds a smaller branch with a downturned grille. Two twin-tube strips and two caged bulkheads occupy the original upper lamp bays.

`room-structure.mjs` surveys the authored floor, walls, roof slabs and routed services before placing a `ceiling-girder`. The end plates need opposed solid walls and the entire span needs overhead slab coverage. The survey checks the braces and service clearance separately from the beam itself.

### Square duct fabrication references

The longitudinal lock seam follows a corner of the sheet. The transverse flanges join separate lengths. A third, shallower feature is the row of stiffening beads pressed into each straight panel. Pacific Duct lists 12 in (305 mm) between beads and a half-spacing from the end of the section. [Sheet Metal Connectors fabrication catalog](https://www.smcduct.com/rectangular-duct-and-fittings-catalog/) · [Pacific Duct submittal](https://www.pacificduct.com/transitional-offset.html)

For the outlet, the Titus 272R drawing shows how a steel border overlaps the opening, with aluminum airfoil blades set behind its lip on ¾ in (19 mm) centers. The section view gives the blade depth and the front view gives their spacing. [Titus 272R grille drawing](https://www.titus-hvac.com/file/1435/272r.pdf)

## Rebuild

SuperSpec's Kowloon WorldSpec theme owns the reusable materials, lighting profiles, foliage and prop builders. This project supplies Stoa's AML, receiver and placement surveys, and referenced input assets. The publishing scripts call the theme builders and pack their output as glTF and scene metadata for Klali.

Use Node 24 and the SuperSpec toolchain. The project launchers below resolve a sibling SuperSpec checkout. Build the native tools and headless shader bundle in SuperSpec, then compile, bake and pack from this project. The GPU host needs WebGL 2 with floating-point render targets. On Windows the native binding uses ANGLE. When executables are outside the default release directory, set `STUDIO_CLI` to the native `superspec-studio` executable for the Node platform and `SUPERSPEC_GI` to the one-bounce baker.

```sh
(cd ../../../superspec && npm ci && npm ci --prefix tools/kowloon-export && npm ci --prefix tools/headless && npm run build:headless && cargo build --release --locked -p superspec-cli)
npm ci
export SUPERSPEC_GI="$(cd ../../../superspec && pwd)/target/release/superspec-gi"
python3 compile.py ../../../superspec/target/release/superspec generated
node bake-buildings.mjs generated
node --max-old-space-size=12000 pack.mjs generated generated/published/stoacity.glb
```

Compare a baked prototype with a reference using `node verify-bake-parity.mjs reference.glb candidate.glb`. The check compares geometry, material settings and decoded texture channels.

The AML compile runs up to four independent prototype exports at a time. Use `compile.py --jobs 1` to serialize them on a memory-constrained host. The building bake shares one GPU context per prototype and overlaps native atlas encoding within each page.

Supply a prototype name such as `building-0` as the second argument to bake a single building. The pack writes the map and its adjacent resources into the destination directory. For a game release, run `npx tsx tools/bake-stoa-navigation.mjs <compiled-directory>` from Klali to produce its bot graph. Ship the packed resources together and copy the matching `generated/stoacity-masonry.json` and `generated/stoacity-nav.json` into Klali's `src/net/`. Chromium is used for the optional game screenshots and benchmarks.

For an isolated arena check after `compile.py`, run `node arena-finish.mjs generated`. It writes `generated/arena-concrete.glb` with the original brush geometry, laid-stone walking surfaces, and baked concrete on structural members. Both that command and the full pack use SuperSpec's `tools/concrete-members.mjs` to bind the washroom MaterialSpec recipe. The charts sample each member's local gravity, creases and dimensions. Identical charts share texture space within each seeded variant. The packer reuses completed color, normal and material-property images under `generated/arena-surface-cache/`; changes to the recipe, source images, chart layout, GPU, headless bundle or compiler select new entries automatically. Keep this directory between builds to reuse the bake. Only the finished map and its adjacent data directory are needed by the game.

Edit the AML directly, or intentionally regenerate it from the local layout.json survey with the following command. Regeneration overwrites `scene.aml`.

```sh
node port.mjs
```

`compile.py` passes the arena to the native visual and collision exporters. It compiles each distinct city prop in local space once and records its AML placements. `bake-buildings.mjs` compiles the same WorldSpec appearance project in native Rust, bakes its receiver charts on the headless GPU, and exports its triangles with base color, normal and material-property maps. The packer keeps the original catalog stock and sign glyph UVs. It welds compatible vertices, shares geometry and textures across buildings, and groups instances into 28 m cells for frustum culling. The map carries the city lighting record with a lower-exposure afternoon sun across the market arcade, alongside the positions of the shop tubes. The game uses depth-based ambient occlusion for contact under the awning. The game uses those positions for a bounded pool of local lights. Emission comes from the authored luminous surfaces. Directional form in shadow comes from the sun record. Ship the entry GLB and its adjacent `stoacity-data/` directory together.

### Concrete detail at gameplay and inspection distances

Structural concrete bakes color, normals and roughness in metric charts. Reachable faces receive denser charts so chipped corners can catch a local light. Walking surfaces use a separate dry paving tile. Both receive a shared 2048-pixel aggregate texture with mipmaps. At a two-metre repeat it supplies 1,024 texels per metre. At inspection distance the shader samples the same tile at a rotated 25 cm repeat, giving 8,192 texels per metre without another texture allocation. The second sample fades with the projected pixel footprint. This allows close inspection to resolve grain while distant walls retain their broader painted values.

## Measure first-person performance

The packer generates two alternate index buffers for eligible building surfaces
and records the content-addressed asset in the scene. The game reuses the
original vertices, material atlases and instance transforms at every level.
Near buildings use the original geometry. Use `&lod=off` on the same map-lab
camera or add `?lod=off` to the benchmark URL to compare full detail at all
distances. To regenerate only the detail levels of an existing packed map, run
`node city-lod.mjs ../../../klali/public/maps/stoacity.glb`.

To measure the exported level, start the map lab and run the camera walk without a match or server. It follows 115 m of player-height sightlines through the planted court, cross street, market and lane. The terrace route covers another 75 m, including the bridge. Each report includes the actual drawing buffer, frame intervals, sampled GPU times and a final GPU fence confirming that the queued work completed.

~~~sh
BROWSER_ARGS="--use-angle=d3d11 --ignore-gpu-blocklist" node tools/stoa/level-walk.mjs http://127.0.0.1:5743/
BROWSER_ARGS="--use-angle=d3d11 --ignore-gpu-blocklist" node tools/stoa/level-walk.mjs http://127.0.0.1:5743/ --terrace
~~~

For storefront and small-prop art changes, include gameplay screenshots of both the provisions shop and roast-chicken shop. Run `node tools/stoa/market-shots.mjs http://127.0.0.1:5743 generated/market` from the Klali checkout. It writes the market approach (`market.png`), provisions storefront (`close.png`), and chicken counter (`chicken.png`) at fixed player-eye cameras. The chicken shop occupies the first street-facing bay of `inner-east-north`. Its AML placement uses `front-trade="roast"`. Add `--compare` for matching AO and directional shadow-fill comparisons.

Run the Klali server and Vite client, then pass the client URL to the benchmark. It joins the city match, warms up for ten seconds, and samples 30 seconds of first-person play at a 1920 × 1080 viewport. The report includes actual drawing-buffer dimensions, player count, GPU, average FPS, median and 95th-percentile frame intervals, and camera positions. Run these checks from the Klali checkout using its Playwright installation.

```sh
BROWSER_ARGS="--use-angle=d3d11 --ignore-gpu-blocklist" node tools/stoa/benchmark.mjs http://127.0.0.1:5743/
```


## Bounced sunlight and painted strokes

The final pack keeps verified atlas PNG compression results in `atlas-png-cache/` under the intermediate build directory. Keeping this directory between builds allows the packer to reuse pages with matching source bytes and encoder settings and versions. With already baked prototypes, one Stoa pack took 108.26 s to fill the cache and 43.28 s to reuse all 263 pages. The map and its 44 sidecars matched the previous pack byte for byte.

The full pack runs the WorldSpec one-bounce baker on the final game geometry. Build it with `cargo build --release --locked -p superspec-cli --bin superspec-gi` in SuperSpec, and set `SUPERSPEC_GI` to that executable or put it on PATH. To relight an already packed city after editing its sun or meshes:

```sh
node --max-old-space-size=8192 bounced-light.mjs ../../../klali/public/maps/stoacity.glb
```

Add `--theme-lighting` to pick up the current Kowloon lighting record. The city uses 0.40 hemisphere intensity, 0.16 environment intensity and 0.68 cast-shadow darkness. Bounced light uses the sun visibility measured at the reflecting surface and is added after the illustrated shadow tint.

The baker traces 64 directions per probe to the nearest opaque reflector and tests visibility to the sun and to each contributing arcade or planter-room ceiling fixture. The direct lights and the bake use the same fixture positions, color, intensity, cutoff and penumbra. It estimates the linear diffuse color of each reflector from four texture and vertex-color samples. The city uses triangles of at least 0.45 m² as reflectors, with a 32 m gather radius. The grid covers the arena and nearby streets from −48 to +48 m horizontally and −4 to +20 m vertically. Six directional RGB volumes share a 1.23 MiB buffer. Dynamic actors and moving lights are outside this static bake.

In the game, the indirect diffuse term takes the average irradiance across a surface-aligned 36 × 12 cm brush mark. Its procedural coordinates also work on instanced or untextured geometry. This averages the **light color**. Direct lighting, lettering and fine albedo detail still use the original material. Probe spacing is 1.5 m, so the marks are most visible along gradients. Light can interpolate through thin walls. Use `&gi=smooth` for continuous interpolation or `&gi=off` to compare the same view with the bounce disabled.
The daytime palette grades from a pale horizon to a muted green-gray sky. In Klali the brightest highlights spread a short halo over adjacent pixels. Add `&bloom=off` to inspect the same view without that glow.

## Painted metal finishes and reflection probes

The Stoa publisher groups material bindings by source finish and records the original chart names in `material.extras.sourceFinishes`. The human-readable label, finish, wear preset and reflection policy are in `material.extras.worldSpecSurface`. The pigment atlas, texture coordinates, normal frame and index buffer remain local to each binding. Masked and plain bindings can share a material when the plain charts sample a verified black region of the same zero-strength occlusion atlas. The shader still gates metal treatment per pixel on mixed stock pages.

The SuperSpec Kowloon theme defines the metal finishes in `crates/engine/src/worldspec/themes/kowloon/materials/metal-finishes.json`. Each finish inherits the shared `painted-metal` base, directly or through another finish. The theme binds finishes, wear presets, and reflection policies to material names. To tune one material, derive a finish in the theme and bind its ID there. `parameters` and `wearParameters` give the defaults and accepted ranges.

| Control | Effect |
| --- | --- |
| `edgeDiffuse`, `edgeSpecular` | Independent pigment and sun-glint strengths inside the crease mask. |
| `alignmentThreshold`, `alignmentFeather`, `normalPull` | Minimum cosine between normal and sun–eye half-vector, transition width, and fraction of the remaining distance to perfect reflection. |
| `edgeWidth` | Reshapes the falloff across the crease mask. |
| `brushThreshold`, `brushWidth`, `brushBrightness`, `brushScale` | Below the shadowed directional-light threshold, stable world-space noise varies edge width and value. Brush scale is in metres. |
| `skyRed`, `skyGreen`, `skyBlue`, `reflection` | Linear RGB tint of the virtual environment, and overall reflection strength. |
| `coatingResponse` | Minimum shared edge and reflection response for a dielectric coating such as fixture enamel. |
| `filterMix` | Strength of the baked Kuwahara pigment correction. Crease coverage and RGB corrections share one texture of up to 512 pixels per side. |
| `chipDepth`, `chipCoverage`, `chipScale` | Depth in metres, coverage and spatial scale of recessed edge pockets. The height gradient changes the surface normal. |
| `chipPolish`, `chipDiffuse` | Roughness reduction on the chip and optional pigment lift. A negative polish value increases roughness. |

Five reflection boxes cover the central stoa, east arcade, liquor shop, duck worktop and west passage. The authoring capture takes six views per position from the Klali map lab. The packer converts these to linear, Kuwahara-filtered panoramas. Gameplay uploads one texture array and blends the two innermost overlapping boxes at their boundaries. Small stock uses the shared tinted virtual environment. The worktop additionally projects the painted lamp and service-rail accents.

To update the probe art after a geometry or lighting change, run `node bake-reflection-probes.mjs <packed-map.glb> <probe-library.json>` from this folder. The normal pack includes the resulting capture. To reapply finish settings to a packed map and write an inventory, run `node material-library.mjs <map.glb> <inventory.json> [prototype-directory]`. The prototype directory recovers source labels for older building bakes. New bakes retain those labels directly.
