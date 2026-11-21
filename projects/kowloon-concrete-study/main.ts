import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { concreteMaterial } from "./material.ts";
import { withSharpEdges } from "./sharp-edges.ts";

const edgeAngle = 35;

const status = document.querySelector<HTMLElement>("#status")!;
let cornerVisible = false;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d8dad7");
const camera = new THREE.PerspectiveCamera(39, innerWidth / innerHeight, 0.05, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 20;
controls.minDistance = 0.35;
controls.maxPolarAngle = Math.PI * 0.49;
scene.add(new THREE.HemisphereLight("#e9eff1", "#a2a09a", 2));
const light = new THREE.DirectionalLight("#fff7ed", 2.4);
light.position.set(-4, 7, 5);
light.castShadow = true;
light.shadow.mapSize.set(2048, 2048);
Object.assign(light.shadow.camera, { left: -6, right: 6, top: 5, bottom: -5, near: 0.1, far: 24 });
light.shadow.camera.updateProjectionMatrix();
light.shadow.normalBias = 0.008;
scene.add(light);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: "#c6c9c2", roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

/** Maps each face at two meters per UV unit. Grade raises both edges while keeping the wall plumb. */
function wallGeometry(width: number, grade = 0, dampEnd = 0): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, 3.2, 0.22);
  const positions = geometry.getAttribute("position"), normals = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  const faceSizes = new Float32Array(positions.count * 2);
  const topDistances = new Float32Array(positions.count);
  const groundContact = new Float32Array(positions.count * 2);
  geometry.computeBoundingBox();
  const topHeight = geometry.boundingBox!.max.y;
  for (let i = 0; i < positions.count; i++) {
    topDistances[i] = topHeight - positions.getY(i);
    const side = Math.abs(normals.getX(i)) > 0.5;
    const top = Math.abs(normals.getY(i)) > 0.5;
    // The underside has its own vertices and receives no exposed-face weathering.
    groundContact[i * 2] = normals.getY(i) < -0.5 ? 1 : positions.getY(i) - geometry.boundingBox!.min.y;
    groundContact[i * 2 + 1] = dampEnd * positions.getX(i) / width + 0.5;
    faceSizes[i * 2] = side ? 0.11 : width / 2;
    faceSizes[i * 2 + 1] = top ? 0.11 : 1.6;
    uv.setXY(i, (side ? positions.getZ(i) : positions.getX(i)) / 2,
      (top ? positions.getZ(i) : positions.getY(i)) / 2);
    // The same rise applies to the vertex and its local top, preserving their vertical separation.
    positions.setY(i, positions.getY(i) + positions.getX(i) * grade);
  }
  if (grade !== 0) {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
  }
  geometry.setAttribute("concreteTopDistance", new THREE.BufferAttribute(topDistances, 1));
  geometry.setAttribute("concreteGroundContact", new THREE.BufferAttribute(groundContact, 2));
  geometry.setAttribute("concreteFaceHalfSize", new THREE.BufferAttribute(faceSizes, 2));
  return withSharpEdges(geometry, edgeAngle);
}

/** Builds a horizontal or graded slab with two-meter UVs on its top and exposed edges. */
function slabGeometry(width: number, thickness: number, depth: number, grade: number): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, thickness, depth);
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const alongX = Math.abs(normals.getX(i)) < 0.5;
    const horizontal = Math.abs(normals.getY(i)) > 0.5;
    uv.setXY(i, (alongX ? x : z) / 2, (horizontal ? -z : y) / 2);
    positions.setY(i, y + x * grade);
  }
  if (grade !== 0) geometry.computeVertexNormals();
  return withSharpEdges(geometry, edgeAngle);
}

/** Presents the same receiver at a wide repetition-check distance or a pore-scale inspection distance. */
function view(close: boolean): void {
  if (cornerVisible) {
    camera.position.set(close ? 5.25 : 8.8, close ? 2.0 : 4.6, close ? 1.8 : 10);
    controls.target.set(close ? 3.8 : 0.9, 1.6, close ? -0.2 : -0.9);
  } else {
    camera.position.set(close ? 1.15 : 2.4, close ? 1.75 : 4.9, close ? 1.7 : 10.8);
    controls.target.set(close ? 0.55 : 0, close ? 1.55 : 1.6, 0);
  }
  controls.update();
}
view(false);

try {
  const texture = await new THREE.TextureLoader().loadAsync(new URL("./textures/concrete-plain.png", import.meta.url).href);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const textureB = await new THREE.TextureLoader().loadAsync(new URL("./textures/concrete-fine-sand.png", import.meta.url).href);
  textureB.colorSpace = THREE.SRGBColorSpace;
  textureB.wrapS = textureB.wrapT = THREE.RepeatWrapping;
  textureB.anisotropy = texture.anisotropy;
  const plasterTexture = await new THREE.TextureLoader().loadAsync(new URL("./textures/plaster-plain.png", import.meta.url).href);
  plasterTexture.colorSpace = THREE.SRGBColorSpace;
  plasterTexture.wrapS = plasterTexture.wrapT = THREE.RepeatWrapping;
  plasterTexture.anisotropy = texture.anisotropy;
  const finish = concreteMaterial(texture, textureB, plasterTexture);
  const slabFinish = concreteMaterial(texture, textureB, plasterTexture, "ground");
  const edgeButton = document.querySelector<HTMLButtonElement>("#edge-wear")!;
  /** Sets edge shading on both the wall and slab materials for direct comparison. */
  function setEdgeWear(enabled: boolean): void {
    finish.setEdgeWidth(enabled ? 0.014 : 0);
    slabFinish.setEdgeWidth(enabled ? 0.014 : 0);
    edgeButton.setAttribute("aria-pressed", String(enabled));
    edgeButton.textContent = `Edge wear: ${enabled ? "on" : "off"}`;
  }
  edgeButton.onclick = () => setEdgeWear(edgeButton.getAttribute("aria-pressed") !== "true");
  setEdgeWear(true);
  const materialSelect = document.querySelector<HTMLSelectElement>("#wall-type")!;
  /** Selects the coating while preserving substrate controls and cached textures. */
  function selectMaterial(): void {
    const plaster = materialSelect.value === "plaster";
    finish.setPlaster(plaster);
    document.querySelector("h1")!.textContent = plaster ? "Plaster over concrete" : "Concrete / base material";
    document.querySelector<HTMLButtonElement>("#chips")!.disabled = !plaster;
    document.querySelector<HTMLAnchorElement>("#base-texture")!.href = plaster
      ? "./textures/plaster-plain.png" : "./textures/concrete-plain.png";
    document.body.dataset.material = materialSelect.value;
  }
  materialSelect.onchange = selectMaterial;
  if (new URLSearchParams(location.search).get("material") === "plaster") materialSelect.value = "plaster";
  selectMaterial();
  const chipButton = document.querySelector<HTMLButtonElement>("#chips")!;
  chipButton.onclick = () => {
    const enabled = chipButton.getAttribute("aria-pressed") !== "true";
    finish.setChips(enabled);
    chipButton.setAttribute("aria-pressed", String(enabled));
    chipButton.textContent = `Chipped plaster: ${enabled ? "on" : "off"}`;
  };
  const wall = new THREE.Mesh(wallGeometry(8), finish.material);
  wall.position.y = 1.6;
  wall.castShadow = wall.receiveShadow = true;
  scene.add(wall);
  const returnWall = new THREE.Mesh(wallGeometry(3.4, 0, -1), finish.material);
  returnWall.rotation.y = Math.PI / 2;
  returnWall.position.set(3.89, 1.6, -1.81);
  returnWall.castShadow = returnWall.receiveShadow = true;
  returnWall.visible = false;
  scene.add(returnWall);
  const cornerButton = document.querySelector<HTMLButtonElement>("#corner")!;
  const slopeButton = document.querySelector<HTMLButtonElement>("#slope")!;
  const flatGeometry = wall.geometry;
  const grade = 0.28;
  const slopedGeometry = wallGeometry(8, grade, -1);
  const cornerGeometry = wallGeometry(8, 0, 1);
  const slabs = { flat: new THREE.Group(), corner: new THREE.Group(), slope: new THREE.Group() };
  /** Adds a concrete slab to the matching receiver preset. */
  function addSlab(receiver: keyof typeof slabs, size: [number, number, number],
    position: [number, number, number]): void {
    const mesh = new THREE.Mesh(slabGeometry(...size, receiver === "slope" ? grade : 0), slabFinish.material);
    mesh.position.set(...position);
    mesh.castShadow = mesh.receiveShadow = true;
    slabs[receiver].add(mesh);
  }
  for (const receiver of ["flat", "corner", "slope"] as const) {
    addSlab(receiver, [8.12, 0.13, 0.36], [0, 3.265, 0]);
    const cornerExtension = receiver === "corner" ? 2 : 0;
    addSlab(receiver, [8 + cornerExtension, 0.10, 2], [cornerExtension / 2, -0.03, 1.11]);
    slabs[receiver].visible = receiver === "flat";
    scene.add(slabs[receiver]);
  }
  addSlab("corner", [0.36, 0.13, 3.38], [3.88, 3.265, -1.87]);
  addSlab("corner", [2, 0.10, 3.62], [5, -0.03, -1.70]);
  /** Switches receivers and keeps the terrain flush with the wall base. */
  function selectReceiver(receiver: "flat" | "corner" | "slope"): void {
    const sloped = receiver === "slope";
    cornerVisible = receiver === "corner";
    returnWall.visible = cornerVisible;
    wall.geometry = sloped ? slopedGeometry : cornerVisible ? cornerGeometry : flatGeometry;
    slabs.flat.visible = receiver === "flat";
    slabs.corner.visible = receiver === "corner";
    slabs.slope.visible = sloped;
    ground.rotation.set(-Math.PI / 2, 0, sloped ? Math.atan(grade) : 0, "ZYX");
    cornerButton.setAttribute("aria-pressed", String(cornerVisible));
    slopeButton.setAttribute("aria-pressed", String(sloped));
    view(false);
  }
  cornerButton.onclick = () => {
    selectReceiver(cornerVisible ? "flat" : "corner");
  };
  slopeButton.onclick = () => {
    selectReceiver(wall.geometry === slopedGeometry ? "flat" : "slope");
  };

  const chipControls = {
    scale: document.querySelector<HTMLInputElement>("#chip-scale")!,
    amount: document.querySelector<HTMLInputElement>("#chip-amount")!,
    intact: document.querySelector<HTMLInputElement>("#intact-smoothness")!,
    chipped: document.querySelector<HTMLInputElement>("#chipped-smoothness")!,
    relief: document.querySelector<HTMLInputElement>("#chip-relief")!,
  };
  /** Applies the chip settings and reflects their current values in the controls. */
  function updateConcreteChips(): void {
    finish.setConcreteChips({
      scaleMeters: chipControls.scale.valueAsNumber / 100,
      amount: chipControls.amount.valueAsNumber / 100,
      intactSmoothness: chipControls.intact.valueAsNumber / 100,
      chippedSmoothness: chipControls.chipped.valueAsNumber / 100,
      reliefMeters: chipControls.relief.valueAsNumber / 1000,
    });
    for (const input of Object.values(chipControls)) {
      input.labels?.[0]?.querySelector("output")?.replaceChildren(input.value + input.dataset.unit);
    }
  }
  for (const input of Object.values(chipControls)) input.addEventListener("input", updateConcreteChips);
  updateConcreteChips();

  /** Changes sampling only; receiver geometry, texture scale and lighting stay directly comparable. */
  function variation(enabled: boolean): void {
    finish.setVariation(enabled);
    slabFinish.setVariation(enabled);
    document.querySelector("#varied")!.setAttribute("aria-pressed", String(enabled));
    document.querySelector("#regular")!.setAttribute("aria-pressed", String(!enabled));
    document.body.dataset.tiling = enabled ? "varied" : "regular";
  }
  document.querySelector<HTMLButtonElement>("#varied")!.onclick = () => variation(true);
  document.querySelector<HTMLButtonElement>("#regular")!.onclick = () => variation(false);
  document.querySelector<HTMLButtonElement>("#front")!.onclick = () => view(false);
  document.querySelector<HTMLButtonElement>("#detail")!.onclick = () => view(true);
  document.querySelector<HTMLButtonElement>("#light")!.onclick = () => { light.position.x = -light.position.x; };
  const cutoutButton = document.querySelector<HTMLButtonElement>("#cutouts")!;
  cutoutButton.onclick = () => {
    const enabled = cutoutButton.getAttribute("aria-pressed") !== "true";
    finish.setCutouts(enabled);
    cutoutButton.setAttribute("aria-pressed", String(enabled));
    cutoutButton.textContent = `Concrete cutouts: ${enabled ? "on" : "off"}`;
  };
  const holeButton = document.querySelector<HTMLButtonElement>("#holes")!;
  holeButton.onclick = () => {
    const enabled = holeButton.getAttribute("aria-pressed") !== "true";
    finish.setHoles(enabled);
    holeButton.setAttribute("aria-pressed", String(enabled));
    holeButton.textContent = `Form-tie holes: ${enabled ? "on" : "off"}`;
  };
  const grimeButton = document.querySelector<HTMLButtonElement>("#grime")!;
  grimeButton.onclick = () => {
    const enabled = grimeButton.getAttribute("aria-pressed") !== "true";
    finish.setGrime(enabled);
    grimeButton.setAttribute("aria-pressed", String(enabled));
    grimeButton.textContent = `Top grime: ${enabled ? "on" : "off"}`;
  };
  const groundWeatheringButton = document.querySelector<HTMLButtonElement>("#ground-weathering")!;
  finish.setGroundWeathering(true);
  groundWeatheringButton.onclick = () => {
    const enabled = groundWeatheringButton.getAttribute("aria-pressed") !== "true";
    finish.setGroundWeathering(enabled);
    groundWeatheringButton.setAttribute("aria-pressed", String(enabled));
    groundWeatheringButton.textContent = `Ground weathering: ${enabled ? "on" : "off"}`;
  };
  /** Keeps live shader strengths and their displayed values in sync with the controls. */
  function updatePigment(): void {
    const darkness = document.querySelector<HTMLInputElement>("#darkness")!.valueAsNumber;
    const hue = document.querySelector<HTMLInputElement>("#hue-amount")!.valueAsNumber;
    const angle = document.querySelector<HTMLInputElement>("#hue-angle")!.valueAsNumber;
    finish.setPigment(darkness / 100, hue / 100, angle);
    slabFinish.setPigment(darkness / 100, hue / 100, angle);
    const b = document.querySelector<HTMLInputElement>("#darkness-b")!.valueAsNumber;
    const scale = document.querySelector<HTMLInputElement>("#blend-scale")!.valueAsNumber;
    const contrast = document.querySelector<HTMLInputElement>("#blend-contrast")!.valueAsNumber;
    const jaggedness = document.querySelector<HTMLInputElement>("#jaggedness")!.valueAsNumber;
    finish.setBlend(b / 100, scale, contrast, jaggedness);
    slabFinish.setBlend(b / 100, scale, contrast, jaggedness);
    document.querySelector("#jaggedness-value")!.textContent = `${jaggedness.toFixed(1)}×`;
    document.querySelector("#darkness-b-value")!.textContent = `${b}%`;
    document.querySelector("#blend-scale-value")!.textContent = `${scale.toFixed(1)}×`;
    document.querySelector("#blend-contrast-value")!.textContent = `${contrast.toFixed(1)}×`;
    document.querySelector("#darkness-value")!.textContent = `${darkness}%`;
    document.querySelector("#hue-amount-value")!.textContent = `${hue}%`;
    document.querySelector("#hue-angle-value")!.textContent = `${angle}°`;
  }
  for (const id of ["darkness", "hue-amount", "hue-angle", "darkness-b", "blend-scale", "blend-contrast", "jaggedness"])
    document.querySelector<HTMLInputElement>(`#${id}`)!.addEventListener("input", updatePigment);
  updatePigment();
  variation(true);
  status.textContent = "Drag to orbit · Scroll to inspect · Wall 8 × 3.2 m";
  document.body.dataset.ready = "true";
} catch (error) {
  status.textContent = `Unable to load wall materials: ${error instanceof Error ? error.message : String(error)}`;
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
