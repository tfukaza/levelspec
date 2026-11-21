import initialize from "../../superspec/generated/wasm/superspec_wasm.js";
import wasmUrl from "../../superspec/generated/wasm/superspec_wasm_bg.wasm?url";

await initialize({ module_or_path: wasmUrl });

export { concrete_study_shader, metal_study_shader } from "../../superspec/generated/wasm/superspec_wasm.js";
