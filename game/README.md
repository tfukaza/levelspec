# Runtime delivery fixture

The files under `public/maps/kiln/` are retained exported assets from the earlier game integration fixture.

Current native delivery uses `levelspec game-export SOURCE.aml --out generated/game --json`. It writes visual and collision GLBs plus a Y-up game manifest. Three.js consumers can load those GLBs with GLTFLoader. The maintained browser reviewer uses Rust standing-inspection queries and displays generated geometry through `review/rust/`.

The former game controller is retained in the local recovery snapshot under `generated/legacy-node-source/game/`. A destination engine must verify its own movement and gameplay against the delivered collision representation.
