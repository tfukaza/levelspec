import { MeshStandardMaterial, Vector3, type Texture } from "three";
import { concrete_study_shader } from "../study-wasm.ts";
import { topGrimeMask } from "./grime.ts";

const SOURCE_MEAN = new Vector3(0.37286770477657405, 0.3662141145046476, 0.3582086447939772);
export function concreteMaterial(texture: Texture, textureB: Texture, plasterTexture: Texture, surface: "wall" | "ground" = "wall"): {
  material: MeshStandardMaterial;
  setPlaster(enabled: boolean): void;
  setChips(enabled: boolean): void;
  setVariation(enabled: boolean): void;
  setCutouts(enabled: boolean): void;
  setHoles(enabled: boolean): void;
  setGrime(enabled: boolean): void;
  setGroundWeathering(enabled: boolean): void;
  setEdgeWidth(meters: number): void;
  setPigment(darkness: number, hue: number, degrees: number): void;
  setBlend(darknessB: number, scale: number, contrast: number, jaggedness: number): void;
  setConcreteChips(settings: { scaleMeters: number; amount: number; intactSmoothness: number;
    chippedSmoothness: number; reliefMeters: number }): void;
} {
  const plaster = { value: 0 };
  const chips = { value: 1 };
  const variation = { value: 1 };
  const cutouts = { value: surface === "wall" ? 1 : 0 };
  const holes = { value: surface === "wall" ? 1 : 0 };
  const grime = { value: surface === "wall" ? 1 : 0 };
  const groundWeathering = { value: 0 };
  const edgeWidth = { value: 0 };
  const darkness = { value: 0.10 }, hue = { value: 0.05 }, angle = { value: Math.PI / 3 };
  const darknessB = { value: 0.13 }, scale = { value: 9 }, contrast = { value: 1.0 }, jaggedness = { value: 0.8 };
  const chipPattern = { value: [0.24, 0] };
  const chipFinish = { value: [0.96, 0.96, 0] };
  const chipFinishEnabled = { value: 0 };
  const material = new MeshStandardMaterial({ map: texture, roughness: 0.96, metalness: 0 });
  material.onBeforeCompile = shader => {
    shader.vertexShader = concrete_study_shader(true, shader.vertexShader);
    shader.uniforms.plasterEnabled = plaster;
    shader.uniforms.plasterChips = chips;
    shader.uniforms.plasterMap = { value: plasterTexture };
    shader.uniforms.concreteVariation = variation;
    shader.uniforms.concreteCutouts = cutouts;
    shader.uniforms.concreteHoles = holes;
    shader.uniforms.concreteGrime = grime;
    shader.uniforms.concreteGroundWeathering = groundWeathering;
    shader.uniforms.concreteEdgeWidth = edgeWidth;
    shader.uniforms.concreteGround = { value: surface === "ground" ? 1 : 0 };
    shader.uniforms.concreteGrimeMask = { value: topGrimeMask() };
    shader.uniforms.darknessAmount = darkness;
    shader.uniforms.darknessAmountB = darknessB;
    shader.uniforms.blendScale = scale;
    shader.uniforms.edgeJaggedness = jaggedness;
    shader.uniforms.blendContrast = contrast;
    shader.uniforms.concreteMapB = { value: textureB };
    shader.uniforms.concreteMeanB = { value: new Vector3(0.20798059217157364, 0.20320214220777086, 0.18970546072187944) };
    shader.uniforms.hueAmount = hue;
    shader.uniforms.hueAngle = angle;
    shader.uniforms.concreteMean = { value: SOURCE_MEAN };
    shader.uniforms.concreteChipPattern = chipPattern;
    shader.uniforms.concreteChipFinish = chipFinish;
    shader.uniforms.concreteChipFinishEnabled = chipFinishEnabled;
    shader.fragmentShader = concrete_study_shader(false, shader.fragmentShader);
  };
  material.customProgramCacheKey = () => "shared-concrete-v1";
  return {
    material,
    /** Sets the chip noise scale and relief in meters and finish controls in [0, 1]. */
    setConcreteChips({ scaleMeters, amount, intactSmoothness, chippedSmoothness, reliefMeters }) {
      if (![scaleMeters, amount, intactSmoothness, chippedSmoothness, reliefMeters].every(Number.isFinite)) return;
      chipPattern.value = [Math.max(0.02, scaleMeters), Math.max(0, Math.min(1, amount))];
      chipFinish.value = [
        1 - Math.max(0, Math.min(1, intactSmoothness)),
        1 - Math.max(0, Math.min(1, chippedSmoothness)),
        Math.max(0, reliefMeters),
      ];
      chipFinishEnabled.value = 1;
    },
    /** Switches the coating without reallocating shared source textures. */
    setPlaster(enabled) { plaster.value = enabled ? 1 : 0; },
    /** Toggles plaster loss; intact plaster hides substrate relief and color. */
    setChips(enabled) { chips.value = enabled ? 1 : 0; },
    setVariation(enabled) { variation.value = enabled ? 1 : 0; },
    /** Toggles filled repair patches and their seams without reallocating textures. */
    setCutouts(enabled) { cutouts.value = enabled ? 1 : 0; },
    /** Toggles regular form-tie recess shading without changing geometry or textures. */
    setHoles(enabled) { holes.value = enabled ? 1 : 0; },
    /** Changes coverage only; the shared mask stays cached. */
    setGrime(enabled) { grime.value = enabled ? 1 : 0; },
    /** Sets the round-over width in meters on geometry with detected crease planes. */
    setEdgeWidth(meters) { edgeWidth.value = Number.isFinite(meters) ? Math.max(0, meters) : 0; },
    /** Enables contact weathering on wall geometry carrying local ground distance and dampness. */
    setGroundWeathering(enabled) { groundWeathering.value = enabled && surface === "wall" ? 1 : 0; },
    /** Controls the second layer and the independent blend field without recompiling. */
    setBlend(strength, frequency, sharpness, edges) {
      if (![strength, frequency, sharpness, edges].every(Number.isFinite)) return;
      darknessB.value = Math.max(0, Math.min(0.8, strength));
      scale.value = Math.max(0.2, Math.min(16, frequency));
      jaggedness.value = Math.max(0, Math.min(2, edges));
      contrast.value = Math.max(1, Math.min(8, sharpness));
    },
    /** Updates bounded pigment strengths and a hue direction in degrees without recompiling the shader. */
    setPigment(darknessStrength, hueStrength, degrees) {
      if (![darknessStrength, hueStrength, degrees].every(Number.isFinite)) return;
      darkness.value = Math.max(0, Math.min(0.8, darknessStrength));
      hue.value = Math.max(0, Math.min(0.3, hueStrength));
      angle.value = degrees * Math.PI / 180;
    },
  };
}
