# Steel and rust study

This standalone Three.js scene uses a concrete corner, caps, floor, and raised
pad as a backdrop for bare, galvanized, and painted steel. The pipe bends,
flanges, wall clamps, and open wire cages expose curved surfaces, joints, and
concrete contact points. The underlying metals have a specular finish with
faint diffuse texture. The oxide is matte brown. Rotated and offset
samples of the catalog texture blend to vary its tone.

- **Edge rust** follows the box creases, flange rims, and open pipe ends in broken bands.
- **Surface rust** uses fractal noise to scatter larger patches across metal surfaces.
- **Raindrop rust** adds small, irregular dots. It samples in three dimensions so the marks also appear on vertical surfaces.

Each pattern can be enabled independently. Turn all three off to inspect the underlying finish.
**Polished edges** rounds shading normals within an 8 mm band on exposed
metal rims and creases, with a narrower band on thin box sections. The same
band sharpens reflections and adds a restrained brightness lift to exposed
metal in dark reflections.
**Banded gloss** uses a small directional Kuwahara filter on the environment
reflection of exposed metal, then steps the filtered brightness into bands.
Toggle it to compare against ordinary gloss.
**Painted values** lifts and softens the darker reflection bands on the large
steel pipe and keeps bright bands crisp. It works
with **Banded gloss**.
**Silhouette highlight** boosts grazing reflections and adds a small light
lift where exposed metal turns away from the camera. It follows the camera
independently of **Polished edges**, which follows the geometry.

Run from the repository root:

```powershell
./tools/rust.ps1 wasm
node node_modules/vite/bin/vite.js --port 5193
```

Open `http://127.0.0.1:5193/@fs/<absolute-repo-path>/projects/kowloon-rust-study/index.html`
using forward slashes in the repo path and omitting the extra slash if the
absolute path already starts with one. Use **Overview**, **Pipes**, and
**Cages** to switch camera positions. Drag to orbit and scroll to zoom.
