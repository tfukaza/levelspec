# Simulated Kowloon tarps

Canvas awnings use four settled Blender Cloth meshes, a shared weathered textile
material, and procedural fittings. The metal canopy branch remains independent.
The saved Blender file retains the editable simulation cages; runtime compilation
loads small shipped mesh data and never starts Blender. Cloth is static; lighting,
normal response, and shadows render in real time. No illumination/AO is baked.

`model.py`, `construction.md`, and `layout.svg` describe construction. Run the
script with Blender 5.1 in background mode to regenerate the simulation study.
The source mesh bank is `assets/cloth-forms.json`; its approved runtime copy lives
in SuperSpec's `crates/engine/src/worldspec/themes/kowloon/assets/cloth-forms.json`.

The historical `material.mjs` published the generated base color and derived
fiber-scale tangent normals and packed roughness/metalness. It requires the
retired `sharp` dependency and writes former TypeScript asset paths; no matching
native canvas recipe has replaced it. The script and source image remain as
provenance for the approved maps in SuperSpec's `assets/materials/`. These are
approximate intrinsic surface maps, not a measured material scan. Broad stains
are excluded from normal reconstruction; folds come from the simulated mesh.
The 1254-square maps are shared by every canvas awning. Runtime UVs preserve a
1.5 m material period, with stable offsets and restrained color variation; hem
soiling uses mesh-local intrinsic tint rather than unique generated textures.

The historical `build.mjs` exported a production-emitter gallery to
`generated/tarp-study/` through the retired TypeScript emitter. Its static viewer
and `capture.mjs` remain with the recorded GLB views; this is not a maintained
build entry point. The common editor displays current canvas awnings in AML scenes.

## Reference and generation record

- [Fa Yuen Street market stalls](https://commons.wikimedia.org/wiki/File:202311_Market_stalls_in_Fa_Yuen_Street,_Mong_Kok.jpg), Jonashtand, 18 November 2023, CC BY-SA 4.0. Unmodified study photograph retained in `references/fa-yuen-street.jpg`. Observation: lightweight projecting stall roofs, shallow slopes, varied covers, and short front drops; not exact dimensional evidence.
- [Hong Kong green awning](https://unsplash.com/de/fotos/ein-geschaft-mit-einer-grunen-markise-daneben-L-URG6lT1U8), Jimmy Woo, Unsplash. Viewed for study, copy only in ignored `generated/tarp-study/green-awning-reference.jpg`. Observation: broad tensioned fabric, heavy dark runoff at front hem, subtler dirt in the main canopy, retractable rolls and mixed metal/canvas assemblies. No photo pixels are used in shipped materials.
- Existing AI concept: `projects/kowloon-art-direction/components/10-balconies.png`; useful support and valance ideas, not physical evidence.
- `concepts/awning-forms.png`: built-in image generation, 12 November 2026, exact prompt in `prompts/awning-concept-used.txt`. Generic design reference, not a reconstructed photograph. The source images were not supplied to generation.
- `assets/tarp-color-source.png`: built-in image generation, 12 November 2026, exact prompt in `prompts/tarp-material.txt`; copied unchanged to `src/materials/library/tarp.png`. No external photographic pixels or baked scene lighting.

The study is themed invention, not a measurement or reconstruction of a specific
market. The concept's deeper skirt and dangling ropes are deliberately bounded by
the existing procedural building clearance reservation. Materials are registered
as `builtin:tarp`; a complete `<prefix>-tarp` AML material overrides that role.
