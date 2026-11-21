# AML demos

Open a demo's `scene.aml` together with its companions, or select its folder using
SuperSpec's **Open AML folder** control. Relative paths are interpreted from the
entry file's directory, so copying the entire folder preserves its assets.

| Demo | Purpose | Companions |
| --- | --- | --- |
| [Courtyard](courtyard/scene.aml) | Density-16 Kowloon scene previously embedded in the editor | Original three images |
| [Sign weathering](sign-weathering/README.md) | Close facade study of lettering, paint and corrosion | Three local images; six registered catalog images |
| [Dust II](dust2/README.md) | Complete approximate playable map with elevation, collision and route contracts | None |

Common catalog images resolve through SuperSpec's `superspec-material:` namespace.
Each scene has one canonical authored source here; project review evidence stays
with its original study. [Migration provenance](../docs/reviews/superspec-demo-migration.md)
records the source moves and verification.

Daiban remains a maintained bounded reference study under `examples/`. Focused
implementation fixtures are owned by SuperSpec.
