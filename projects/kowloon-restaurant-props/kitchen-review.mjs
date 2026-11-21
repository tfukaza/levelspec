import * as THREE from "three";
import { createGltfLoader } from "../../src/viewer/gltf-loader.mjs";
import manifest from "./kitchen-props.json";

const id = new URLSearchParams(location.search).get("asset") ?? "wok";
const spec = manifest[id];
const output = "/generated/kowloon-restaurant-props/kitchen-props";
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color("#d2c9bb");
scene.add(new THREE.HemisphereLight("#edf1ff", "#a59a89", 1.8));
const key = new THREE.DirectionalLight("#fff1de", 2.5);
scene.add(key);
const loader = createGltfLoader(renderer);
const camera = new THREE.PerspectiveCamera(39, 1, 0.01, 100);

function fit(object, baseline) {
  const group = new THREE.Group();
  group.add(object);
  if (!baseline && spec.yaw) object.rotation.y = spec.yaw;
  if (!baseline && spec.roll) object.rotation.z = spec.roll;
  const box = new THREE.Box3().setFromObject(object, true);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = baseline ? 1 : spec.width ? spec.width / size.x : (spec.drop ?? spec.height) / size.y;
  object.position.set(-center.x * scale, -(spec?.drop ? box.max.y : box.min.y) * scale, -center.z * scale);
  object.scale.setScalar(scale);
  return { group, size: size.multiplyScalar(scale).toArray(), scale };
}

const props = id === "menu"
  ? [fit(new THREE.Mesh(new THREE.PlaneGeometry(.34,.46),
    new THREE.MeshBasicMaterial({ map: await new THREE.TextureLoader().loadAsync("./kitchen-prop-menu.png") })), true)]
  : await Promise.all([
    ...(spec.baseline ? [loader.loadAsync(`${output}/${id}-baseline.glb`).then(asset => fit(asset.scene, true))] : []),
    loader.loadAsync(`${output}/tripo-out/${spec.folder}/model.glb`).then(asset => fit(asset.scene, false)),
  ]);
if (id === "menu") props[0].group.children[0].material.map.colorSpace = THREE.SRGBColorSpace;
for (const prop of props) scene.add(prop.group);
const maxSpan = Math.max(...props.flatMap(prop => prop.size));
const middle = spec?.drop ? -maxSpan * .48 : Math.max(...props.map(prop => prop.size[1])) * .46;
const views = {
  oblique: [1.1, .94, 2.05],
  high: [.15, 2.32, .75],
  rear: [-1.02, .70, -2.17],
  "reverse-light": [1.1, .94, 2.05],
  wall: [0, 0, 2.25],
};
window.showKitchenProp = name => {
  key.position.set(name === "reverse-light" ? 3 : -3, 5, 3);
  const [x,y,z] = views[name];
  camera.position.set(x * maxSpan, middle + y * maxSpan, z * maxSpan);
  camera.lookAt(0, middle, 0);
  const panel = Math.floor(innerWidth / props.length);
  camera.aspect = panel / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setScissorTest(true);
  for (const [index, prop] of props.entries()) {
    for (const item of props) item.group.visible = item === prop;
    renderer.setViewport(index * panel, 0, panel, innerHeight);
    renderer.setScissor(index * panel, 0, panel, innerHeight);
    renderer.render(scene, camera);
  }
};
window.kitchenPropFit = props.map(({ size, scale }) => ({ size, scale }));
window.showKitchenProp(id === "menu" ? "wall" : "oblique");
document.body.dataset.ready = "true";
