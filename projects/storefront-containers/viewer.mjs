import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const params = new URLSearchParams(location.search), stage = params.get("stage") ?? "after";
document.querySelector("#stage").textContent = stage;
const study = await fetch(`/generated/storefront-containers/${stage}.json`).then(response => response.json());
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; document.body.append(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color("#dedbd2");
scene.add(new THREE.HemisphereLight("#edf2ff", "#9d907d", 2));
const key = new THREE.DirectionalLight("#fff1dd", 3); key.position.set(-2,-3,5); key.castShadow = true;
key.shadow.mapSize.set(2048,2048); key.shadow.normalBias = .001;
Object.assign(key.shadow.camera, {left:-3,right:3,top:3,bottom:-3,near:.1,far:15});scene.add(key);
const loader = new THREE.TextureLoader();
/** Loads aligned production maps without baking scene illumination into them. */
async function texture(path, color = false) {
  if (!path) return null;
  if (stage === "before") path = path.replace("/projects/dressing-demo/textures/","/generated/storefront-containers/baseline-textures/");
  const map = await loader.loadAsync(path); if (color) map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = 8; return map;
}
for (const [index, surface] of study.surfaces.entries()) {
  const def = study.materials.find(material => material.id === surface.material);
  const ids = study.mesh.surfaces.flatMap((s,t) => s === index ? study.mesh.indices.slice(t*3,t*3+3) : []);
  const geometry = new THREE.BufferGeometry();
  for (const [name, field, size] of [["position","positions",3],["normal","normals",3],["uv","uv",2],["color","colors",3]])
    geometry.setAttribute(name, new THREE.Float32BufferAttribute(ids.flatMap(i => study.mesh[field].slice(i*size,i*size+size)),size));
  const [map, normalMap, properties] = await Promise.all([texture(def.texture,true),texture(def.normalTexture),texture(def.metallicRoughnessTexture)]);
  const object = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({ color:def.color,vertexColors:true,map,normalMap,roughnessMap:properties,metalnessMap:properties,roughness:def.roughness,metalness:def.metalness }));
  object.castShadow = object.receiveShadow = true; scene.add(object);
}
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:"#b3afa3",roughness:1}));
ground.position.z = -.002;ground.receiveShadow = true;scene.add(ground);
const camera = new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.01,100);camera.up.set(0,0,1);
const close = params.get("view") === "close", rear = params.get("view") === "rear", store = stage === "store";
camera.position.set(...(store ? (close ? [3.5,.3,2.1] : [4,-5,3.9]) : close ? [.72,-1.12,.8] : rear ? [2.4,2.4,1.7] : [2,-2.9,2]));
const controls = new OrbitControls(camera,renderer.domElement);controls.target.set(...(store ? (close ? [1.8,2.3,.6] : [1.5,1.5,.9]) : close ? [.29,-.05,.16] : [.94,0,.13]));controls.update();
/** Redraws the static study on interaction, preserving identical before/after exposure. */
function draw(){renderer.render(scene,camera);}
controls.addEventListener("change",draw);draw();document.body.dataset.ready = "true";
