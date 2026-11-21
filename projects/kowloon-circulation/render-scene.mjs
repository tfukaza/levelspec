import * as THREE from 'three';
import {createGltfLoader} from '../../src/viewer/gltf-loader.mjs';
import {ReviewLighting} from '../../review/lighting.ts';

const renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);
document.body.style.margin = '0';
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
const lighting = new ReviewLighting(
 renderer, scene, new THREE.Plane(new THREE.Vector3(0,0,-1), 1000),
 new THREE.Color(0.99, 0.94, 0.80),
);
lighting.setAppearance('full-render');
lighting.setTimeOfDay('night');
const {scene:model} = await createGltfLoader(renderer).loadAsync('/model.glb');
model.rotation.x = Math.PI / 2;
model.traverse(object => {
 if (!object.isMesh) return;
 object.castShadow = object.receiveShadow = true;
 const materials = Array.isArray(object.material) ? object.material : [object.material];
 for (const material of materials) {
  for (const map of [material.map, material.normalMap, material.roughnessMap]) {
   if (map) map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  }
 }
});
scene.add(model);
model.updateMatrixWorld(true);
lighting.fit(new THREE.Box3().setFromObject(model));
const lights = [[-9.4,7.5,2.5,2.6],[-9.5,8.9,2.9,2.3],[5.6,-2.1,3.86,10],[5.6,0.8,3.86,10],[5.6,3.2,3.86,7],[10.55,11.3,2.05,4],[-13.1,5.56,2.65,3]];
for(const [x,y,z,power] of lights){
 const light=new THREE.PointLight(0xffba76,power,9,2);
 light.position.set(x,y,z);
 scene.add(light);
}
const fill = new THREE.HemisphereLight(0xb1d3db,0x787662,1.22);
scene.add(fill);
const sky = new THREE.DirectionalLight(0xb3c9e3,2.1);
sky.position.set(-8,-10,24);
scene.add(sky);
const inspectionLight = new THREE.DirectionalLight(0xfff7eb, 1.55);
inspectionLight.position.set(-11, 10.8, 1.8);
inspectionLight.target.position.set(-9.8, 7.7, 0.55);
scene.add(inspectionLight, inspectionLight.target);
scene.background = new THREE.Color('#526273');
scene.fog = new THREE.FogExp2(0x526273,0.010);
window.captureView = view => {
 const inspect = view.lighting === 'raking';
 inspectionLight.visible = inspect;
 sky.intensity = inspect ? 0.55 : 2.1;
 fill.intensity = inspect ? 0.95 : 1.22;
 for (const light of scene.children.filter(object => object.isPointLight)) light.visible = !inspect;
 const width=1100;
 const aspect=view.frameAspect ?? 1.25;
 const height=Math.round(width/aspect);
 renderer.setSize(width,height);
 lighting.resize(width,height);
 const h=view.viewHeight ?? 20;
 const camera=view.projection==='orthographic'
  ? new THREE.OrthographicCamera(-h*aspect/2,h*aspect/2,h/2,-h/2,0.05,220)
  : new THREE.PerspectiveCamera(view.fov ?? 55,aspect,0.05,220);
 camera.up.set(0,0,1);
 camera.position.set(...view.position);
 camera.lookAt(...view.target);
 lighting.render(camera);
};
document.body.dataset.ready='true';
