# Sign weathering

Open this folder with SuperSpec's **Open AML folder** control, or run
`npm run levelspec -- preview demos/sign-weathering/scene.aml` from LevelSpec.

The facade studies generated signs, atlas lettering, paint loss and corrosion.
It retains the original study's geometry, scene IDs and material parameters.
The three distinct companion images live under `textures/`; six byte-identical
common images use registered `superspec-material:` references. Copy this entire
folder to keep local companions beside the source.

[Provenance](provenance.json) records source and image hashes. The original
[sign study](../../projects/kowloon-signs/README.md) retains the design notes,
frozen review evidence and `material-views.json` cameras.
