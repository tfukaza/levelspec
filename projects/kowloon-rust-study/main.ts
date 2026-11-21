import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import materialCatalog from "../../../superspec/crates/catalog/src/material_catalog.json";
import { metal_study_shader } from "../study-wasm.ts";

type Point = [number, number, number];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#c4c9c5");
const environment = new RoomEnvironment();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(environment, 0.04).texture;
scene.environmentIntensity = 0.65;
environment.dispose();
pmrem.dispose();

const sunlight = new THREE.DirectionalLight("#fff2e0", 2.4);
sunlight.position.set(-4, 8, 5);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
Object.assign(sunlight.shadow.camera, { left: -7, right: 7, bottom: -6, top: 6, far: 22 });
sunlight.shadow.camera.updateProjectionMatrix();
sunlight.shadow.normalBias = 0.012;
scene.add(sunlight, new THREE.HemisphereLight("#edf3f6", "#aba396", 0.7));

const concreteTexture = await new THREE.TextureLoader().loadAsync(
  new URL("../../src/materials/concrete/textures/concrete-plain.png", import.meta.url).href,
);
concreteTexture.colorSpace = THREE.SRGBColorSpace;
concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping;
concreteTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
const concrete = new THREE.MeshStandardMaterial({ map: concreteTexture, roughness: 0.92 });
const steel = new THREE.MeshStandardMaterial({ color: "#566368", metalness: 0.92, roughness: 0.26 });
const largePipeSteel = steel.clone();
const galvanized = new THREE.MeshStandardMaterial({ color: "#8b989b", metalness: 0.85, roughness: 0.33 });
const paintedSteel = new THREE.MeshStandardMaterial({ color: "#3a5752", metalness: 0.16, roughness: 0.29 });
const rustDefinition = materialCatalog.rust;
const rustTexture = await new THREE.TextureLoader().loadAsync(
  new URL("../../../superspec/assets/materials/rust.png", import.meta.url).href,
);
rustTexture.colorSpace = THREE.SRGBColorSpace;
rustTexture.wrapS = rustTexture.wrapT = THREE.RepeatWrapping;
rustTexture.anisotropy = concreteTexture.anisotropy;
const rustPatterns = { edge: { value: 1 }, surface: { value: 1 }, rain: { value: 1 } };
const polishedEdges = { value: 1 };
const bandedGloss = { value: 1 };
const paintedValues = { value: 1 };
const silhouetteHighlight = { value: 1 };

/** Layers brown oxide over the substrate using independent coverage in world-space meters. */
function applyMetalFinish(material: THREE.MeshStandardMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.studyEdgeRust = rustPatterns.edge;
    shader.uniforms.studySurfaceRust = rustPatterns.surface;
    shader.uniforms.studyRainRust = rustPatterns.rain;
    shader.uniforms.studyPolishedEdges = polishedEdges;
    shader.uniforms.studyBandedGloss = bandedGloss;
    shader.uniforms.studyPaintedValues = material === largePipeSteel ? paintedValues : { value: 0 };
    shader.uniforms.studySilhouetteHighlight = silhouetteHighlight;
    shader.uniforms.studyRustMap = { value: rustTexture };
    shader.uniforms.studyRustRepeat = { value: rustDefinition.repeat };
    shader.uniforms.studyRustRoughness = { value: rustDefinition.roughness };
    shader.uniforms.studyOxideDark = { value: new THREE.Color("#281811") };
    shader.uniforms.studyOxideLight = { value: new THREE.Color("#805232") };
    shader.vertexShader = metal_study_shader(true, shader.vertexShader, "");
    shader.fragmentShader = metal_study_shader(
      false, shader.fragmentShader, THREE.ShaderChunk.envmap_physical_pars_fragment,
    );
  };
}

[steel, largePipeSteel, galvanized, paintedSteel].forEach(applyMetalFinish);
const paintedValuesButton = document.querySelector<HTMLButtonElement>("#painted-values")!;
paintedValuesButton.addEventListener("click", () => {
  paintedValues.value = 1 - paintedValues.value;
  paintedValuesButton.setAttribute("aria-pressed", String(paintedValues.value === 1));
});
const silhouetteButton = document.querySelector<HTMLButtonElement>("#silhouette-highlight")!;
silhouetteButton.addEventListener("click", () => {
  silhouetteHighlight.value = 1 - silhouetteHighlight.value;
  silhouetteButton.setAttribute("aria-pressed", String(silhouetteHighlight.value === 1));
});
const glossButton = document.querySelector<HTMLButtonElement>("#banded-gloss")!;
glossButton.addEventListener("click", () => {
  bandedGloss.value = 1 - bandedGloss.value;
  glossButton.setAttribute("aria-pressed", String(bandedGloss.value === 1));
});
const polishedEdgesButton = document.querySelector<HTMLButtonElement>("#polished-edges")!;
polishedEdgesButton.addEventListener("click", () => {
  polishedEdges.value = 1 - polishedEdges.value;
  polishedEdgesButton.setAttribute("aria-pressed", String(polishedEdges.value === 1));
});
for (const [pattern, enabled] of Object.entries(rustPatterns)) {
  const button = document.querySelector<HTMLButtonElement>(`#rust-${pattern}`)!;
  button.addEventListener("click", () => {
    enabled.value = 1 - enabled.value;
    button.setAttribute("aria-pressed", String(enabled.value === 1));
  });
}

/** Supplies local edge dimensions in meters for the study's metal primitives. */
function setRustDimensions(geometry: THREE.BufferGeometry): void {
  const dimensions = new THREE.Vector4();
  if (geometry instanceof THREE.BoxGeometry) {
    const { width, height, depth } = geometry.parameters;
    dimensions.set(width / 2, height / 2, depth / 2, 1);
  } else if (geometry instanceof THREE.CylinderGeometry) {
    const { radiusTop, height } = geometry.parameters;
    dimensions.set(radiusTop, height / 2, 0, 2);
  } else if (geometry instanceof THREE.TubeGeometry) {
    dimensions.set(geometry.parameters.path.getLength(), 0, 0, 3);
  } else {
    throw new Error("Unsupported rust study geometry.");
  }
  const values = new Float32Array(geometry.getAttribute("position").count * 4);
  for (let offset = 0; offset < values.length; offset += 4) dimensions.toArray(values, offset);
  geometry.setAttribute("rustDimensions", new THREE.BufferAttribute(values, 4));
}

/** Adds a shadow-casting receiver or fixture to its parent in Three.js Y-up meters. */
function addMesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry,
  material: THREE.Material, position: Point): THREE.Mesh {
  if (material !== concrete && !geometry.hasAttribute("rustDimensions")) setRustDimensions(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Adds a wall or slab with two-meter concrete tiling on every face. */
function addConcrete(size: Point, position: Point): void {
  const geometry = new THREE.BoxGeometry(...size);
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  for (let index = 0; index < uv.count; index++) {
    const u = normals.getX(index) ? positions.getZ(index) : positions.getX(index);
    const v = normals.getY(index) ? positions.getZ(index) : positions.getY(index);
    uv.setXY(index, u / 2, v / 2);
  }
  addMesh(scene, geometry, concrete, position);
}

const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: "#a4aba5", roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

addConcrete([8.5, 0.17, 4.7], [0, 0.085, 0]);
addConcrete([8.5, 2.75, 0.25], [0, 1.545, -2.225]);
addConcrete([0.25, 2.75, 2.05], [-4.125, 1.545, -1.075]);
addConcrete([8.65, 0.15, 0.46], [0, 2.995, -2.225]);
addConcrete([0.46, 0.15, 1.939], [-4.125, 2.995, -1.0255]);
addConcrete([4.4, 0.2, 1.9], [1.65, 0.27, -1.15]);

/** Adds a flanged pipe or a narrower return line with a smooth wall-plane elbow. */
function addPipe(startX: number, elbowX: number, lowY: number, topY: number, z: number,
  radius: number, material: THREE.Material): void {
  const bend = radius * 2.8;
  const path = new THREE.CurvePath<THREE.Vector3>();
  const bendStart = new THREE.Vector3(elbowX - bend, topY, z);
  const bendEnd = new THREE.Vector3(elbowX, topY - bend, z);
  path.add(new THREE.LineCurve3(new THREE.Vector3(startX, topY, z), bendStart));
  path.add(new THREE.QuadraticBezierCurve3(bendStart, new THREE.Vector3(elbowX, topY, z), bendEnd));
  path.add(new THREE.LineCurve3(bendEnd, new THREE.Vector3(elbowX, lowY, z)));
  addMesh(scene, new THREE.TubeGeometry(path, 96, radius, 32), material, [0, 0, 0]);

  const flange = new THREE.CylinderGeometry(radius * 1.48, radius * 1.48, radius * 0.56, 32);
  const horizontalFlange = addMesh(scene, flange, material, [startX + 0.45, topY, z]);
  horizontalFlange.rotation.z = Math.PI / 2;
  addMesh(scene, flange, material, [elbowX, lowY + 0.18, z]);
  addMesh(scene, flange, material, [elbowX, lowY + radius * 0.28, z]);

  const wallZ = -2.1;
  for (const x of [startX + 0.7, elbowX - bend - 0.22]) {
    addMesh(scene, new THREE.BoxGeometry(radius * 1.9, radius * 2.6, 0.035),
      galvanized, [x, topY, wallZ + 0.0175]);
    addMesh(scene, new THREE.BoxGeometry(radius * 0.5, radius * 0.8, z - wallZ),
      galvanized, [x, topY, (z + wallZ) / 2]);
    const collar = addMesh(scene, flange, galvanized, [x, topY, z]);
    collar.rotation.z = Math.PI / 2;
  }
}

addPipe(-3.99, 0.55, 0.37, 2.22, -1.84, 0.13, largePipeSteel);
addPipe(-3.99, -0.2, 0.37, 1.64, -1.88, 0.072, paintedSteel);

/** Builds an open wire cage with box-section frames and instanced square steel wires. */
function addCage(position: Point, size: Point, frameMaterial: THREE.Material,
  rotation: number, pitch: number): void {
  const cage = new THREE.Group();
  cage.position.set(...position);
  cage.rotation.y = rotation;
  scene.add(cage);
  const [width, height, depth] = size;
  const rail = 0.045;
  const sides = [-1, 1];
  for (const x of sides) {
    for (const z of sides) {
      addMesh(cage, new THREE.BoxGeometry(rail, height, rail), frameMaterial, [x * width / 2, height / 2, z * depth / 2]);
    }
  }
  for (const y of [rail / 2, height - rail / 2]) {
    for (const side of sides) {
      addMesh(cage, new THREE.BoxGeometry(width, rail, rail), frameMaterial, [0, y, side * depth / 2]);
      addMesh(cage, new THREE.BoxGeometry(rail, rail, depth), frameMaterial, [side * width / 2, y, 0]);
    }
  }

  const wires: { position: Point; scale: Point }[] = [];
  const wire = 0.011;
  for (const side of sides) {
    for (let y = pitch; y < height - rail; y += pitch) {
      wires.push({ position: [0, y, side * depth / 2], scale: [width, wire, wire] });
      wires.push({ position: [side * width / 2, y, 0], scale: [wire, wire, depth] });
    }
    for (let x = pitch - width / 2; x < width / 2 - rail; x += pitch) {
      wires.push({ position: [x, height / 2, side * (depth / 2 - wire)], scale: [wire, height, wire] });
    }
    for (let z = pitch - depth / 2; z < depth / 2 - rail; z += pitch) {
      wires.push({ position: [side * (width / 2 - wire), height / 2, z], scale: [wire, height, wire] });
    }
  }
  for (let z = pitch - depth / 2; z < depth / 2 - rail; z += pitch) {
    wires.push({ position: [0, rail / 2 - wire / 2, z], scale: [width, wire, wire] });
  }

  for (let x = pitch - width / 2; x < width / 2 - rail; x += pitch) {
    wires.push({ position: [x, rail / 2 + wire / 2, 0], scale: [wire, wire, depth] });
  }

  const wireGeometry = new THREE.BoxGeometry();
  setRustDimensions(wireGeometry);
  const mesh = new THREE.InstancedMesh(wireGeometry, galvanized, wires.length);
  const matrix = new THREE.Matrix4();
  wires.forEach(({ position: [x, y, z], scale }, index) => {
    matrix.makeScale(...scale).setPosition(x, y, z);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.castShadow = mesh.receiveShadow = true;
  cage.add(mesh);
}

addCage([2.73, 0.37, -0.97], [1.28, 1.69, 0.89], paintedSteel, 0, 0.155);
addCage([0.04, 0.17, 0.72], [1.35, 0.92, 0.94], steel, -0.12, 0.14);
addCage([-2.04, 0.17, 0.61], [1.12, 1.17, 0.88], galvanized, 0.14, 0.17);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.03, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.3;
controls.maxDistance = 24;
controls.maxPolarAngle = Math.PI * 0.49;
const views = new Map<string, { position: Point; target: Point }>([
  ["overview", { position: [5.4, 5.45, 10.9], target: [0, 1.1, -0.18] }],
  ["pipes", { position: [0.45, 2.65, 3.5], target: [-1.64, 1.72, -1.75] }],
  ["cages", { position: [5.45, 3.3, 3.45], target: [0.9, 0.94, -0.05] }],
]);
const buttons = document.querySelectorAll<HTMLButtonElement>("button[data-view]");

/** Moves the orbit camera and marks the selected inspection preset. */
function setView(name: string): void {
  const view = views.get(name);
  if (!view) return;
  camera.position.set(...view.position);
  controls.target.set(...view.target);
  controls.update();
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === name)));
}

buttons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view!)));
setView("overview");
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
  document.body.dataset.ready ??= "true";
});


