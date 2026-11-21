# Kowloon building polish

This study exercises the production building generator and shared material library.
The default source has no copied material declarations: structural concrete and
plaster are library references, while hardware/wood/ceramic roles inherit defaults.
All lighting is real time; exported intrinsic textures contain no scene lighting.

```sh
npm run levelspec -- preview projects/kowloon-building-polish/study.aml
npm run levelspec -- build projects/kowloon-building-polish/study.aml --out generated/building-polish/current --json
```

The former `build.mjs` wrapper used the retired TypeScript compiler and has been
removed. The pinned native commands above compile the unchanged authored source.
To try another seed, edit the dressing seed in `study.aml` or an authored variant.

Historical outputs under `generated/building-polish/` contain `building.glb`,
the study's custom static lighting viewer and fixed overview/roof/base/balcony/AC
captures. `package-preview.mjs`, `preview.mjs` and `capture.mjs` remain with those
records; the native commands do not reproduce that historical packaging. The `before`
and `structure` directories retain earlier comparisons; `final` is the integrated
material pass. `balcony` uses a second seed to expose the splayed-balcony branch.
`soot-posters` is the subsequent review with the approved printed poster library
and opening-dependent soot, including balcony companion windows and the roof door.
Its additional `Posters` camera makes the paper artwork directly inspectable.
The flat laundry now uses the existing plain cloth atlas cell and muted linen
tints; its cuts, folds, supports and placement streams are unchanged.

## Reference study

- [Hong Kong tong lau street panoramas](https://www.jiemian.com/article/2273641.html),
  Stefan Irvine / Jörg Dietrich: recessed shops, horizontal floor bands, dense
  signage and small owner-added projections.
- [Michael Wolf's Hong Kong back alleys](https://zolimacitymag.com/michael-wolf-collecting-hong-kong/):
  mixed split condensers, multiple fan guards, mounting beams and line sets.
- [Sheung Wan rooftop tank](https://commons.wikimedia.org/wiki/File:HK_Sheung_Wan_Old_House_Roof_Water_Tank.JPG):
  sectional bolted tank panels, support beams and connected service pipes.
- [Panasonic CW-SU70AA](https://www.panasonic.hk/en/item/6861--cw-su70aa):
  a real window-unit enclosure for proportion and case/grille comparison.

Cross-referenced existing `projects/kowloon-art-direction/` window, balcony and
building concepts. Three AI-generated modeling reference sheets are retained in
`concepts/`, with the exact input prompts in `prompts/`: whole-building construction,
rooftop/AC assemblies and fictional signage. These are art-direction concepts,
not documentary evidence or engineering drawings. Their original generation
provenance and hashes are in `concepts/provenance.json`.

## Implemented construction

Above-grade concrete plinths stop at entrances. Chamfered bands wrap visible
corners. Splayed lower balconies share slab/rail outlines and fit their doors to
the narrower back edge. Doorway gaps interrupt trim. A detailed closed roof-access
bulkhead and supported tanks replace rough roof props; AC cases, guards, mounting
hardware and condenser rotors have more complete geometry. Concrete trim uses
meter-scale face/profile UVs; explicit AC/sign atlas charts remain intact.

These are visual background buildings, not playable interior stair systems.
Independent architectural review accepted the inspected roof, foundation,
balcony and AC assemblies. Material binding and loading contracts are documented
in [the material library guide](../../docs/MATERIALS.md).
