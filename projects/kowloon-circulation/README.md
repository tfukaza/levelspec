# Rain Cut

A compact Kowloon-inspired circulation demo built as editable LevelSpec AML. From the lower tiled plaza, take the two-flight stair alley through its quarter-turn landing or climb the circular-grip lane to the west terrace. The opposite branch crosses the stormwater canal on a short flat bridge. Two curbside stair flights connect the 4.62 m pedestrian overpass, with a marked two-way road and 3.99 m of clear height under its beams.

The artwork uses Sheung Wan proportions, Rokutenzaka's impressed grip rings, Kwun Tong footbridge structure, and a Tokyo canal crossing. The scene brings those references together in an invented block. The compact context facades and abrupt street ends are study boundaries.

## Open and build

```sh
npm run --silent levelspec -- preview projects/kowloon-circulation/level.aml
npm run --silent levelspec -- validate projects/kowloon-circulation/level.aml --json
npm run --silent levelspec -- build projects/kowloon-circulation/level.aml --out generated/kowloon-circulation/demo --json
```

The original `capture.mjs`/`render-scene.mjs` art workflow depends on the retired
TypeScript review-lighting module. It remains as historical code with its frozen
images; the native commands above use the common SuperSpec reviewer and exporter.
The former `--formats` and `--no-uv` options do not apply to the native build command.

The historical GLB build retained base material UVs. Its optional lightmap atlas was disabled because the old dressing pipeline generated overlapping charts on several fixtures and paving edges. The art capture loaded that GLB and added a cool fill, warm utility lamps and fog. This remains a distinct lighting treatment, not the current shared review pipeline. The stormwater surface is static, and the traction rings use color and normal textures over the continuous physical ramp. The project-local source texture generator is `bake-textures.mjs`.

## References and comparison

- Sheung Wan, Hong Kong. A tight stair slot uses contrasting tiled and concrete walls. AC units, visible conduits, and small breaks in the enclosing walls give the short flights their scale. [Hong Kong in Transition](https://arthistory.hku.hk/HKinTransition/image_detail.php?id=72248) · [Sheung Wan stair photographs](https://ameblo.jp/love--myself/entry-12888821231.html)
- Rokutenzaka, Tokyo. Impressed rings repeat in the concrete plane between retaining walls, alongside a gutter and a curve in the downhill view. [坂の回廊](https://sakamichisanpo.com/entry/2025/07/29/181636)
- Kwun Tong, Hong Kong. Road lanes continue below a pedestrian deck, with its approach stairs aligned along the curb. [Kwun Tong Station Urban Approach](https://www.exit-a1.com/exit-a1/kwun-tong-line/kwun-tong/)
- Kanda Bridge, Tokyo. Closely spaced metal rails mark the crossing, with the road and houses continuing beyond it. [Kanda River photo walk](https://hideki-sansho.hatenablog.com/entry/2022/12/05/094307)
- Blake Garden, Hong Kong. Compact open space, surrounding retaining edges and neighborhood-scale paving inform the plaza. [iDiscover Blake Garden](https://i-discoverasia.com/walks/sheung-wan/locations/blake-garden/)

ImageGen style-transferred the stair, slope, overpass, and canal photos into two concept sheets. [Stairs and ramp](concepts/stairs-and-ramp.png) · [Road and canal](concepts/road-and-canal.png)

The first 3D pass established the route geometry. The render comparison led to closer camera framing, stained wall finishes, tighter rail spacing, tile and concrete variation, and less lamp glare. A collision-aware review also caught a pier projecting into a stair tread and a pinched turn between the ramp mouth and the overpass stair. The pier now has a sloped cap below the treads, and the stair foot sits farther east to leave a wider turn.

## Verification

The GLB built successfully. The seven captures in `generated/kowloon-circulation/renders/` match that GLB by SHA-256 and completed without browser page errors. `concept-comparison.png` pairs the concept panels on the left with the scene renders on the right.

Independent review replayed all ten declared routes using LevelSpec's standing inspection capsule (0.25 m radius, 2 m tall, movement advances of at most 0.04 m). It also completed round trips along the turning stair, full plaza-to-terrace ramp, both flights of the road overpass, and canal bridge. This checks the intended paths through the demo. The build still reports advisory wall/rail alignments, small edge gaps and disconnected sampled navigation patches.

## Lower stair finish study

The concrete finish is the default on the lower stair and its turn landing. Six steps have segmented, bevelled nosings that project roughly 2–3.4 cm. Individual pieces vary in projection and setback, with an isolated warmer repair. The treads use interrupted grip lines, while the risers show pour joints and fine surface pits. The handrail, return guard and landing guard share chipped green paint. Collars, base plates and bolt heads carry stronger rust.

The alternate source uses roughly 5 cm olive mosaic on the approach floor, treads, risers and turn landing, with separate projecting nosings. Both versions share the existing physical stair.

- The irregular concrete arrises and wall-side wear come from Michael Wolf’s back-alley photos. [Scavenger Lanes](https://www.creativeboom.com/inspiration/scavenger-lanes-photographer-captures-the-back-alleys-of-hong-kong/)
- The small mosaic, worn step edges and landing come from the photographed Hong Kong tenement stair. [Kowloon tenement stair](https://note.com/boris5/n/n28f582451e09)
- The turquoise paint and oxide on the rail use Wah Fu Estate as a color and wear reference. [Wah Fu Estate stairs](https://www.greenpeace.org/hongkong/issues/health/update/43414/%E8%87%AA%E7%84%B6%E6%95%A3%E6%AD%A5%E7%B7%B4%E7%BF%92%E2%80%A7%E8%B7%AF%E7%B7%9A12%EF%BD%9C%E5%B9%B3%E6%B0%91%E8%B1%AA%E5%AE%85%E7%8F%8D%E6%83%9C%E6%9C%89%E6%99%82-%E8%8F%AF%E5%AF%8C%E9%82%A8%E6%93%81%E6%8A%B1%E5%B1%B1%E5%9F%8E%E5%A4%A7%E6%B5%B7/)

```sh
node projects/kowloon-circulation/bake-stair-textures.mjs
node projects/kowloon-circulation/update-stair-study.mjs
npm run --silent levelspec -- preview generated/kowloon-circulation/stair-study/tiled.aml
```

Use `--update-source` with the second command when editing the nosing, seam or rail hardware generator. The comparison board in `generated/kowloon-circulation/stair-study/comparison.png` uses matched cameras, with the previous stair on the left, the concrete revision in the middle, and the tiled variant on the right.

### Round handrails and close-up maps

The lower flight, turn landing and return flight use a 52 mm round handrail profile. The stair concrete, mosaic, painted steel and rusted hardware each use 1024 × 1024 color, normal and roughness/metalness maps. The bake adds fine grit and paint flakes at the higher resolution while retaining the original texture scale in the scene.

The ImageGen paintovers use the matching screenshots as the composition reference and the original stair concept for atmosphere. The concrete and tiled scenes both built successfully and passed all ten authored route checks after the rail profile change. The matched three-view geometry captures are in `generated/kowloon-circulation/stair-study/round-rail-comparison.png`.

The aspirational [stair concept](concepts/stair-art-direction.png) uses the existing finishes as a starting point and explores taller enclosure, a deeper second flight, continuous pipe bends, stronger wall runoff, and wet amber reflections. The [concrete](concepts/stair-concrete-paintover.png) and [tiled](concepts/stair-tiled-paintover.png) paintovers give closer comparisons with the game cameras.

## Material reference

Use the stair at its existing scale to judge weathering and surface response. The night view shows the finishes in context. The raking-light views make it easier to compare concrete relief, ceramic glaze, grout, and oxide with the same geometry and camera.

| Finish | What to carry forward | Texture scale |
| --- | --- | --- |
| Poured concrete | Keep dry cement diffuse. Use mineral chips and recessed pinholes in the normal map. Darken damp patches and lower roughness using the same coverage mask. Keep the tread's construction joints and segmented nosings in the model. | 1024² maps at 0.88 repeats/m on treads, about 900 texels/m |
| Olive ceramic | Vary tile batches gently. Use the same edge mask for softened tile edges, recessed rough grout, and chipped corners. Keep ceramic and grout dielectric. | 1024² maps at 1.65 repeats/m, about 1690 texels/m with 50 mm tiles |
| Painted rail and rust | Use a thin brown film over the paint, then primer, exposed steel and oxide at deeper chips. Reserve metallic response for exposed steel. Use a more corroded version on collars, bolts, and shoes. | 1024² maps at 2.35 repeats/m on the rail and 4.2 repeats/m on hardware before surface projection |
| Wall tiles | Existing seeded wall finish with a finer raster for the stair cheeks. | 128 texels/m on each stair cheek |

The material maps are generated by `bake-stair-textures.mjs` and use the same UVs for color, normal, and packed roughness/metalness. Current rail UVs use the native planar projection, which can foreshorten marks around the tube. Treat the stair as a visual reference when transferring the recipe to round stock with a wrapped UV chart.

`material-views.json` contains the night framing and the two close-ups under the neutral raking light. Pass it as the third argument to `capture.mjs`, after the model and output directory.
