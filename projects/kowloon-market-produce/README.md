# Hong Kong wet-market produce study

The concepts show complete loaded crates and trays for single-image 3D reconstruction. Each vegetable has three distinct packings. The small crates show some exposed floorboards and the large crates carry more produce at comparable item size. Damp patches, chipped slats, repaired boards, loose stems and occasional overhang give the stock a handled appearance.

| Load | Small | Medium | Large |
| --- | --- | --- | --- |
| Baby bok choy | [Small](concepts/bok-choy-small.png) | [Medium](concepts/bok-choy-medium.png) | [Large](concepts/bok-choy-large.png) |
| Chinese eggplant | [Small](concepts/eggplant-small.png) | [Medium](concepts/eggplant-medium.png) | [Large](concepts/eggplant-large.png) |
| Bitter melon | [Small](concepts/bitter-melon-small.png) | [Medium](concepts/bitter-melon-medium.png) | [Large](concepts/bitter-melon-large.png) |
| Flowering choy sum | [Small](concepts/choy-sum-small.png) | [Medium](concepts/choy-sum-medium.png) | [Large](concepts/choy-sum-large.png) |

[Whole fish on ice](concepts/fish.png) and [butcher’s pork cuts](concepts/pork.png) use shallow, scuffed steel trays. These are concepts for fishmonger and butcher displays. ImageGen inputs and image hashes are recorded in [prompts.json](concepts/prompts.json) and [provenance.json](concepts/provenance.json).

## Photo references

| Reference | Detail used in the study |
| --- | --- |
| [Kowloon City Market fruit and vegetable gallery](https://www.dchamberlinarchitect.com/travel-asia-china-hong%20kong-wet%20markets-KOWLOON%20CITY%20MARKET-FRUITS%20%26%20VEGETABLES.htm) | One crop per tray, packed across tiered stalls with individual price signs |
| [Mong Kok vegetable stalls, HK01](https://www.hk01.com/%E7%A4%BE%E6%9C%83%E6%96%B0%E8%81%9E/236584/%E9%A2%B1%E9%A2%A8%E5%B1%B1%E7%AB%B9-%E6%97%BA%E8%A7%92%E8%A1%97%E5%B8%82%E7%94%9F%E6%84%8F%E6%B7%A1%E8%96%84-%E5%B8%82%E6%B0%91%E6%89%93%E9%A2%A8%E5%89%8D%E5%BE%8C%E6%8D%B1%E8%B2%B4%E8%8F%9C%E5%83%B9) | Glossy purple eggplants next to dense leafy greens on tiered displays |
| [Mong Kok vegetable stalls, Wen Wei Po](https://www.wenweipo.com/a/202202/08/AP62022799e4b03103e0c8e720.html) | Plain crates, red lamps and a mechanical scale within reach of the stock |
| [Wan Chai, Hung Hom and Ngau Tau Kok vegetables](https://www.jdonline.com.hk/content_82248.html) | Varied plastic bins used closely together over larger supports |
| [Hong Kong market greens, Sing Tao](https://www.stheadline.com/food/3455436/%E6%B8%85%E7%82%92%E8%8F%9C%E5%BF%83%E6%84%8F%E5%A4%96%E6%8E%80%E6%B8%AF%E5%8F%B0%E5%A4%A7%E6%88%B0-%E5%8F%B0%E6%97%85%E5%AE%A2%E9%A6%96%E5%98%97%E8%AE%9A%E9%A9%9A%E7%82%BA%E5%A4%A9%E4%BA%BA-%E6%B8%AF%E4%BA%BA%E6%80%A5%E6%BE%84%E6%B8%85%E6%98%AF%E5%85%A9%E7%A8%AE%E8%8F%9C) | Distinct choy sum and other leafy bunches, priced by tray |
| [Yau Ma Tei vegetable stall, SBS/Getty](https://www.sbs.com.au/news/article/what-is-a-wet-market-and-why-are-they-allowed-to-continue-amid-the-coronavirus-crisis/llmmnzo0s) | Customers handle stock directly at the front edge |
| [Shek Kip Mei market aisle](https://lepetitjournal.com/hong-kong/histoire-hong-kong-shek-kip-mei-buildings-reservoir-bishop-hill-293710) | Cardboard and shallow trays share the frontage at different levels |
| [Chun Yeung Street Market, North Point](https://had18.huluhk.org/article-detail.php?id=150&lang=en) | Street-facing displays and dense stall rhythm |
| [Graham Street Market photo set](https://hungryhongkong.net/2014/05/graham-street-market-central-hong-kong.html) | Compact street frontage with distinct food displays |
| [Bowrington Road Market photo set](https://hungryhongkong.net/2014/05/bowrington-road-market-wan-chai-hong.html) | Fish and butcher displays within the wet-market frontage |
| [Kowloon City Market seafood gallery](https://www.dchamberlinarchitect.com/travel-asia-china-hong%20kong-wet%20markets-KOWLOON%20CITY%20MARKET-SEAFOOD.htm) | Whole fish, shallow displays and cool, wet surfaces |
| [Hong Kong wet markets, Zolima](https://zolimacitymag.com/inside-wet-markets-the-heart-of-neighbourhood-life-in-hong-kong/) | Unwrapped butcher cuts and closely packed counters |

The local market photographs inform the arrangement and contents. The wood finish takes its cue from the [existing crate study](../storefront-containers/README.md). No source photograph is used as a texture.

## Procedural rack

The produce-focused greengrocer shuffles three crate sizes across supports from 0.60 to 1.25 m above the shop floor. The front trays sit on stacked transport crates, with timber benches behind. Pairing a small and large crate uses the same shelf length as two mediums. The rack can fit an extra small crate or widen a tray when there is spare shelf length. Each tray has a seeded setback and a cleat under its raised rear edge. The existing procedural produce uses the tray's interior dimensions, with tighter fruit packing and more layered greens.

The [full storefront comparison](../../generated/storefront-study/produce-rack/greengrocer-comparison.png) shows the raised rack under the same camera and beside the concept. The captured whole storefront has 95,580 triangles and the same physical hash as [the first comparison](../../generated/storefront-study/r01/greengrocer-comparison.png). These snapshots contain different stock mixes and other ongoing storefront edits. Focused checks cover repeatability, crate height, occupied width, and spacing across four room sizes.

## Tripo pilot

Tripo CLI 0.7.2 validated the dry run for `concepts/bok-choy-large.png`. It specifies one P1 image-to-model task at `/v3/generation/image-to-model` using `tripo-p1` (`P1-20260311`), `face_limit=1200`, `texture=true`, and `pbr=true`. The generation command saves a textured GLB, preview PNG, and task JSON under `generated/kowloon-market-produce/tripo-out/`. The [estimated charge](https://docs.tripo3d.ai/get-started/pricing.html) is 50 credits. Tripo releases reserved credits on failed tasks.

### Large bok choy result

Task `579b7a79-9bff-4dbb-8afc-be9ddf9177e1` succeeded and used 50 credits. The [GLB](../../generated/kowloon-market-produce/tripo-out/bok-choy-large-579b7a79/model.glb) contains 888 triangles, one material, and three 2048 × 2048 texture maps (base color, normal, and metallic/roughness). It is 3,675,900 bytes with SHA-256 `477a85ae659209132fe501c5343296c7e733d3a9cd0bfcb141c376e9a5cfd5bc`. glTF Validator reported zero errors and one warning about runtime-generated tangent space.

The crate retained the repaired plank, damp stains, and recognizable bok choy colors. The [tilted view](../../generated/kowloon-market-produce/bok-choy-large-tipped.png) shows a prominent lattice of invented dividers and upright, regularly spaced plants. The [underside](../../generated/kowloon-market-produce/bok-choy-large-underside.png) exposes leaves through the base. The [rear view](../../generated/kowloon-market-produce/bok-choy-large-rear.png) confirms the slats and corner blocks are modeled around the box. Review used one uniform scale for a 0.66 m overall width, yielding an approximately 0.40 m depth and 0.21 m height.

Keep this candidate as a pilot. Its lattice and open base would be visible on a stepped rack.

### Next inputs

The [revised large bok choy tray](concepts/bok-choy-large-solid-tray.png) uses plain single-board walls, one exposed patch of solid floor, and leaves overlapping in one continuous heap. [Small ginger](concepts/ginger-small.png) and [medium daikon](concepts/daikon-medium.png) add root vegetables with the same visible floor and more irregular packing. Their prompts are recorded in [next-prompts.json](concepts/next-prompts.json).

### Production trays and model review

Eight new P1 image-to-model tasks used 50 credits each, 400 credits total. The original 888-triangle pilot was a separate 50-credit task. Each result has a textured GLB, provider preview, and task record in `generated/kowloon-market-produce/tripo-out/`.

| Asset | Requested | Actual | Decision |
| --- | ---: | ---: | --- |
| [Small ginger](../../generated/kowloon-market-produce/tripo-out/ginger-small-5aa0f4ba/model.glb) | 850 | 859 | Rack. Solid base and naturally uneven fill. |
| [Medium daikon](../../generated/kowloon-market-produce/tripo-out/daikon-medium-4b794cce/model.glb) | 1,100 | 739 | Rack. Solid base and leafy overhang. Uniform fitting makes the square source tray narrower than the allotted medium slot. |
| [Medium eggplant](../../generated/kowloon-market-produce/tripo-out/eggplant-medium-d381b298/model.glb) | 1,100 | 1,074 | Rack. Recognizable purple crop and slatted support. |
| [Large bok choy](../../generated/kowloon-market-produce/tripo-out/bok-choy-solid-tray-97a4aacc/model.glb) | 1,200 | 1,224 | Rack. Overlapping leaves, no dividers, and a solid bottom. |
| [Medium bitter melon](../../generated/kowloon-market-produce/tripo-out/bitter-melon-medium-339cd0e7/model.glb) | 1,100 | 1,055 | Study. Floating fruit and broken interior. |
| [Large choy sum](../../generated/kowloon-market-produce/tripo-out/choy-sum-large-5bf538a6/model.glb) | 1,250 | 1,147 | Study. A flat green underside shows through the slats. |
| [Fish](../../generated/kowloon-market-produce/tripo-out/fish-1daf5637/model.glb) | 1,200 | 1,035 | Standalone fishmonger tray. The crushed ice reads as a largely smooth bed. |
| [Pork](../../generated/kowloon-market-produce/tripo-out/pork-8af311e8/model.glb) | 1,050 | 983 | Standalone butcher tray. Recognizable cuts in a complete steel pan. |

The rack selects complete loaded trays by slot size on an independent seed stream. It cycles through each size's seeded assortment before repeating a crop of that size. Two fitted timber cleats support the bases. Procedural produce still fills other slots. The scale hangs over the rack, and deep shops keep the watermelons on a low pallet behind the display, outside the right entry.

The historical regeneration used `repair-tray.mjs bitter-melon` followed by
`bake-trays.mjs` with the saved GLBs. The bake requires the retired `jpeg-js`
dependency and writes the former TypeScript asset paths; it is not a supported
current regeneration command. No matching native tray-atlas recipe has replaced
its project-specific repairs and packing, so the scripts and source art remain
as evidence. The approved runtime catalog now lives in SuperSpec's
`crates/engine/src/worldspec/themes/kowloon/shop/assets/market-trays.json`.
[The source manifest](trays.json) records task IDs and face targets. [The bake
report](tray-bake.json) records hashes, output sizes, and GLB validation results.

### Repairs and additional stock

Eight P1 image-to-model tasks used 50 credits each, 400 credits total. ImageGen source prompts are in [variation-prompts.json](concepts/variation-prompts.json).

| Asset | Triangles | Decision |
| --- | ---: | --- |
| [Bitter melon](../../generated/kowloon-market-produce/tripo-out/bitter-melon-repair-c65e9583/model-repaired.glb) | 1,064 | Rack. Used the replacement tray, lifted five fruit pieces out of the floor, and repaired the underside color, normal, and roughness maps. [Tilted](../../generated/kowloon-market-produce/bitter-melon-fixed-tipped.png), [underside](../../generated/kowloon-market-produce/bitter-melon-fixed-underside.png). |
| [Choy sum](../../generated/kowloon-market-produce/tripo-out/choy-sum-repair-3cca7a52/model.glb) | 1,133 | Rack. Reconstructed with an uninterrupted wooden base. [Tilted](../../generated/kowloon-market-produce/choy-sum-repair-3cca7a52-tipped.png), [underside](../../generated/kowloon-market-produce/choy-sum-repair-3cca7a52-underside.png). |
| [Lotus root](../../generated/kowloon-market-produce/tripo-out/lotus-root-b862228d/model.glb) | 918 | Rack. Distinct cut ends and an enclosed bottom. |
| [Yardlong beans](../../generated/kowloon-market-produce/tripo-out/long-beans-5db7cc28/model.glb) | 1,249 | Study. Tripo fused the thin beans into solid blocks. |
| [Silver pomfret](../../generated/kowloon-market-produce/tripo-out/fish-pomfret-4ee22678/model.glb) | 1,141 | Standalone fishmonger tray. Broad fish silhouettes on a smooth ice bed. |
| [Red snapper](../../generated/kowloon-market-produce/tripo-out/fish-red-snapper-44a59fda/model.glb) | 1,286 | Standalone fishmonger tray. Distinct red color. Fin and ice detail is simplified. |
| [Pork ribs](../../generated/kowloon-market-produce/tripo-out/pork-ribs-fe2654f0/model-repaired.glb) | 1,146 | Standalone butcher tray. Raised four cuts to the pan floor and removed baked red marks from the underside. Rebuild with `repair-tray.mjs pork-ribs`. |
| [Beef shank](../../generated/kowloon-market-produce/tripo-out/beef-shank-8c8b8457/model.glb) | 1,018 | Standalone butcher tray. Dark beef and connective tissue contrast with the pork. |

### Carrots, red radishes, pineapples, and oranges

Four textured Tripo P1 conversions used 200 credits. The [ImageGen prompts](concepts/fruit-and-root-prompts.json) and underside and tilted renders document the added stock.

| Loaded tray | Triangles | Rack slot |
| --- | ---: | --- |
| [Carrots](../../generated/kowloon-market-produce/carrot-tray-0355b29d-tipped.png) | 1,048 | Small |
| [Red radishes](../../generated/kowloon-market-produce/radish-tray-ab3f668d-tipped.png) | 1,002 | Medium |
| [Pineapples](../../generated/kowloon-market-produce/pineapple-tray-61d4304f-tipped.png) | 1,351 | Large |
| [Oranges](../../generated/kowloon-market-produce/oranges-tray-626637ea-tipped.png) | 1,021 | Medium |

The front display mixes wooden crates and molded plastic transport stacks. Each plastic stand has two levels and a support board. Wide trays use two stacks side by side. A separate seeded selection picks the stands and their plastic color variants. [Storefront render](../../generated/storefront-study/fruit-and-crates/greengrocer.png).

Molded crates use dusty abrasion on their upper rails, drag scratches, and grime around the feet. The original red and four alternate colors use the same mesh with individual PBR charts in the existing grocer atlas. Run `node tools/bake-crate-wear.ts` to refresh the charts, texture-free colors, and built-in maps. The stock appearance bake runs this step after the carton bake.
