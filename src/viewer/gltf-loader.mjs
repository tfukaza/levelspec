/**
 * glTF loading for LevelSpec viewers, including SuperSpec's default KTX2 (`KHR_texture_basisu`)
 * textures. It mirrors SuperSpec's `browser/renderer/ktx2.ts` but uses LevelSpec's own Three.js,
 * so viewers never mix two Three instances.
 *
 * Three's Basis transcoder is imported as Vite asset URLs instead of a served directory, so the
 * same code works in the dev server under any root, in bundled builds (where library builds
 * inline both files) and in packaged static previews.
 */
import { LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import transcoderScript from 'three/examples/jsm/libs/basis/basis_transcoder.js?url';
import transcoderModule from 'three/examples/jsm/libs/basis/basis_transcoder.wasm?url';

const transcoder = new LoadingManager();
// KTX2Loader requests `basis_transcoder.{js,wasm}` relative to its own module, which breaks once
// Vite pre-bundles Three into `.vite/deps`; serve both from the imported URLs instead.
transcoder.setURLModifier(url => url.endsWith('basis_transcoder.js') ? transcoderScript
  : url.endsWith('basis_transcoder.wasm') ? transcoderModule : url);

/** One KTX2 loader per renderer: it owns a transcoder worker pool and the renderer's formats. */
const loaders = new WeakMap();

/** Returns the renderer's shared KTX2 loader. */
export function ktx2Loader(renderer) {
  let loader = loaders.get(renderer);
  if (!loader) {
    loader = new KTX2Loader(transcoder).detectSupport(renderer);
    loaders.set(renderer, loader);
  }
  return loader;
}

/** A GLTFLoader that also reads KTX2 textures; use it for every GLB a viewer renders. */
export function createGltfLoader(renderer, manager) {
  return new GLTFLoader(manager).setKTX2Loader(ktx2Loader(renderer));
}
