import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { bakeOchre } from "../../../../superspec/crates/engine/src/worldspec/themes/kowloon/authoring/wayfinding/bake-ochre.mjs";

const destination = process.argv[2];
if (!destination) throw new Error("Specify the generated output directory.");
await mkdir(destination, { recursive: true });
await bakeOchre(sharp, destination);
