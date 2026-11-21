import type { LoadingManager, WebGLRenderer } from 'three';
import type { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

/** Returns the renderer's shared KTX2 loader. */
export function ktx2Loader(renderer: WebGLRenderer): KTX2Loader;
/** A GLTFLoader that also reads KTX2 textures; use it for every GLB a viewer renders. */
export function createGltfLoader(renderer: WebGLRenderer, manager?: LoadingManager): GLTFLoader;
