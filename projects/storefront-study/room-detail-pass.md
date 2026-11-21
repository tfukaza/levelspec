# Room finish follow-up

The active floor implementation reuses the existing shared `TileField` / `tileSurface` system and ceramic, tile-bed, and tile-grime library materials. `shop-floor.ts` applies 0.28 m square tiles with moderate wear (0.45) and high grime (0.98), preserving each trade's ceramic color. The existing bedding tint control darkens exposed mortar locally. Dirty grout, pigment wear, chips, matte deposits, and normal relief all come from that shared recipe rather than a separate hand-drawn floor texture. R01's wear of 0.82 was rejected for excessive pale missing-tile patches.

One raster receiver covers each floor at 128 texels/m. Geometric height remains zero; relief affects the normal map only. Existing room contact shading survives the final material bake. The source plane retains its area and collision remains unchanged. The previous restaurant tile polygons and opaque spill/ring/scuff overlays have been removed.

The separate wall detail pass retains sparse tapered runoff, low-wall flecks, and torn notices from the existing poster atlas. Three notices remain inside wall attachment bands, clear of the restaurant's existing menu and calendar. No paid models or new source textures are required. Their final visibility and material balance require the parent iteration's screenshots.

TypeScript passes after integration. Independent tests and implementation review are handled by the parent iteration, including an actual compiled floor comparison and unchanged physics checks.
