import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { bakeMarkings } from "../../../../superspec/crates/engine/src/worldspec/themes/kowloon/authoring/maintenance/markings-art.mjs";

const destination = process.argv[2];
if (!destination) throw new Error("Specify the generated output directory.");
await mkdir(destination, { recursive: true });
await bakeMarkings(sharp, destination);
