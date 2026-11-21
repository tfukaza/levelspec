// Compatibility entry point for existing Stoa builds.
import { fileURLToPath } from "node:url";
const tool = new URL("../../../superspec/tools/kowloon-export/bounced-light.mjs", import.meta.url);
process.argv[1] = fileURLToPath(tool);
await import(tool.href);
