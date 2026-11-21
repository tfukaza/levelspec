# Duct material and runoff study

Current v33 shadow evidence: [concept/before/after](review-shadows/comparison.png),
[support close-up](review-shadows/ventSupport.png), and [review record](review-shadows/acceptance.json).
Short directional casts below collars and offset shadows behind bolt heads add
depth beyond symmetric contact AO. Bolt shadows fade into the receiving metal's
exact tint and metric UV phase. Their direction is artistic and local to the
module, so it rotates or reflects with placement rather than tracking runtime lights.
The default module adds 252 triangles (3,692 to 3,944) with no new textures,
materials or surface receivers. Collar casts reuse existing vertices. The v32
pilot's hidden shadow subdivisions were rejected for unnecessary geometry.
Independent code and visual reviews accepted v33; 23 focused tests and type
checking passed. Individual bolt shadows read in close-up; collar depth remains
the visible improvement at street scale.

Earlier v31 evidence: [concept/before/after](review-refined/comparison.png),
[support close-up](review-refined/ventSupport.png), [four module sizes](review-refined/modules.png),
and [review record](review-refined/acceptance.json).
The zinc is darker blue-green, with charcoal supports, thinner fractal oxide,
tighter gray-green wall contact and smoothly varied edge polish. The shaft uses
a 24 mm, four-facet bevel with continuous radial normals. A soft silver center
fades toward darker shoulders and under collars to suggest rounded metal.
Diagonal folded seams divide both return sides. Up to two procedural vertex-color
washes sit below real shaft joints and decline placements that overlap contact
bands or the inspection hatch. They share the body's physical UVs and material.

Edge variation is sampled in local meters rather than normalized panel space.
Sampling is bounded; nearly coincident cuts merge before mesh quantization.
The hatch halo follows the backing plate's actual interpolation. The default
module now uses 3,692 triangles versus 2,196 in v24, with the same materials and
three shared maps. Bevel sampling is separate from flat-panel contact cuts,
making the rounder v31 cheaper than v29's 3,868 triangles. Independent visual and
implementation reviews accepted v31;
21 focused tests and type checking passed. Residuals include a bluer upper boot,
a more olive underside and a smoother lower profile than the concept. At building
scale, wall runoff carries most of the visible weathering.

Earlier v24 edge adjustment: [matched before/after](review-edge/comparison.png),
[grazing view](review-edge/ventGrazing.png), and [review record](review-edge/acceptance.json).
The shared rounded-edge finish is brighter and more reflective, with roughness
reduced from 0.30 to 0.20 and metalness raised from 0.65 to 0.80. Broad plates,
fractal rust, geometry and texture density are unchanged; no new maps or geometry
were added. The baseline was recaptured after a concurrent lighting edit, so the
two edge comparisons use identical lighting and actual camera states.

Metric rust evidence: [concept and before/after comparison](review-metric/comparison.png),
[four module sizes](review-metric/modules.png), and [surface close-up](review-metric/ventSupport.png).
The earlier `review/` directory retains the v14 wall-runoff and lighting study.

Independent visual review accepted the v23 fractal finish: smaller lobes and gaps
break up larger translucent patches while the zinc remains calm. It is still
slightly warmer and softer than the concept. Implementation review, type checking,
23 focused tests and the prop skill validator passed. Default duct positions,
normals and indices match the pre-modular assembly exactly; only surface mapping
and finish assignments changed. The [current review record](review-metric/acceptance.json)
retains full-scene build, browser and publication evidence.

The built-in ImageGen tool produced [clean metal pigment](metal-base-ai.png)
and an [eight-shape grime study](grime-atlas-ai.png). Exact prompts and reference
paths are retained in [prompts.json](prompts.json); hashes and production uses
are recorded in [provenance.json](provenance.json).

The metal bake averages the clean pigment into a 32×32 field before smooth
sampling and broad tonal variation. This removes fine generated grain. Separate
procedural corrosion combines thin, spread-out oxidation films, diffuse seam
accumulation and a few denser localized marks. Three shared 1024×1024 maps cover
a periodic two-meter square: 512 texels per meter, independent of panel size.
They provide albedo, broad normal variation and metallic/roughness response.
The shared maps occupy about 12 MiB decoded, or 16 MiB including mipmaps; this
is shared once across ducts. There are no per-duct textures; the v23 metric texture
pass added no triangles. The later folds and shading subdivisions are budgeted above.
An additional shared scalar edge finish gives the physical rounded corners and
folds stronger highlights without tying polish to normalized texture borders.
The rust mask uses six metric fractal octaves with low-frequency domain warping:
large oxidation fields break into smaller irregular boundaries down to roughly
centimeter scale. This detail changes the rust coverage, not the base metal grain.

The generated grime sheet is a visual study only. Production runoff is fully
procedural: width and length in meters, coarseness, spread, source density,
strength, linear pigment and independent hue/value variation. Zero density
leaves a diffuse wash. Narrow channels vary in width and pigment, break along
their length, and occasionally fork. All sampling is deterministic and cached;
deposits modify existing wall receivers without individual decal meshes or maps.

Orthonormal surface-distance UVs preserve physical scale on straight plates and
sloped bends. Assembly variants shift phase rather than stretching the pattern;
section joints do not restart it, and hatch contact shading samples the backing
plate's exact metric coordinates. Maps wrap smoothly in all three channels.
The shaft corners use two segments with continuous radial normals, and folded
lips use rounded metal profiles. Daylight in cool scenes splits a small portion
of the main light into a parallel shadowless fill: sun-facing surfaces retain
form inside shadows while unblocked illumination stays the same. This is an
intentional stylization. The measured lit patch stayed identical, the occluded
patch increased by 19 RGB levels on average, and the shadow-map count stayed four.

The initial [concept/before/after comparison](review/comparison.png) and
[procedural control study](review/procedural-controls.png) show the accepted v14
finish. Control settings, component capture metadata and the WebGL lighting
measurement are retained in `review/`. Full-resolution working captures remain
under `generated/dressing-demo/art-review/duct-v14/`.

For the earlier v14 pass, independent visual review accepted the matte plate, rounded highlights and
distinct runoff shapes. Seam corrosion remains slightly cleaner and warmer
than the concept. Independent implementation review passed all 17 focused tests;
type checking also passed. Rounded metal adds 416 triangles to the duct metal
geometry, retains three shared maps, and adds no decal meshes or shadow maps.

The v14 integrated [street](review/street.png), [courtyard](review/courtyard.png)
and [corner](review/corner.png) views were also accepted. The default demo bundle
was rebuilt and published with the unchanged blockout collision hash. See the
[review record](review/acceptance.json) for validation and remaining differences.

## Reusable duct assembly

`src/dressing/props/duct.ts` owns the two-return wall-mounted duct, independent of
any building or Kowloon style kit. It assembles straight plate sections, rounded
corners, folded wall returns, ring joints, cantilever supports and an inspection
hatch. `planDuct` validates dimensions and returns bounds and attachment locations;
`drawDuct` validates before appending render-only geometry. Building code owns the
clear mounting area and wall runoff. The Kowloon adapter now calls this module.

```ts
const duct = drawDuct(wallPen.move(bayCenter, 0, mountingHeight), {
  width: .78, depth: .62, standOff: .32, height: 5.2,
  lowerBendHeight: 1.05, upperBendHeight: .72, sections: 3,
  supports: [1.18, 4.3], variant: 0,
});
// duct.bounds is local to this mounting point; all dimensions are meters.
```

X runs across the wall, Y outward, Z upward from the lower boot. Use a rigid or
reflected `Pen` frame; nonuniform scaling is unsupported. Width, depth, standoff,
height, return heights, section count and support elevations are independent.
The planner rejects combinations too small for the real hatch and hardware, or
supports that leave no clear hatch section. Empty supports mean the caller
supplies structural support. Four metric phase offsets vary corrosion without
per-instance material maps. This is an assembly of wall-mounted riser modules,
not a general-purpose duct-network router.

Run `node projects/dressing-demo/concepts/duct-material-study/build-modules.mjs`
to reproduce four sizes on generic undressed hosts under
`generated/dressing-demo/art-review/duct-module-preview/`.
