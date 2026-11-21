import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { bakeLeaves } from "../../../../superspec/crates/engine/src/worldspec/themes/kowloon/authoring/vines/bake-leaves.mjs";

const destination = process.argv[2];
if (!destination) throw new Error("Specify a generated output directory for the leaf atlases.");
await mkdir(destination, { recursive: true });
await bakeLeaves(sharp, destination);
