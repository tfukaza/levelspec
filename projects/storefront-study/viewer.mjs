import * as THREE from 'three';
import {createGltfLoader} from '../../src/viewer/gltf-loader.mjs';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShopOcclusion} from './shop-occlusion.mjs';
import {restaurantLighting} from './restaurant-lighting.mjs';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;document.body.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#a6b5c3');
const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.03,60);
const controls=new OrbitControls(camera,renderer.domElement);
camera.position.set(4.45,2.02,7.65);controls.target.set(2.2,1.65,-.25);controls.update();
const environment=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(environment,.1).texture;scene.environmentIntensity=.2;environment.dispose();pmrem.dispose();
const daylight=new THREE.HemisphereLight('#8daee2','#526981',1.4);scene.add(daylight);
const sun=new THREE.DirectionalLight('#e2eaf2',2.3);sun.position.set(-3,8,5);sun.target.position.set(2,0,-1);
sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.1,far:25});sun.shadow.normalBias=.003;scene.add(sun,sun.target);
const manifest=await fetch('./build.json').then(r=>r.json()),size=manifest.size;
const target=new THREE.WebGLRenderTarget(innerWidth,innerHeight,{type:THREE.HalfFloatType,samples:4});
const composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));
const ao=new ShopOcclusion(scene,camera,innerWidth,innerHeight);
ao.updateGtaoMaterial({radius:.32,thickness:.22,distanceExponent:1.3,scale:1.4,samples:16,screenSpaceRadius:false});
ao.updatePdMaterial({lumaPhi:10,depthPhi:.2,normalPhi:3,radius:2,rings:2,samples:8});
ao.blendIntensity=1;composer.addPass(ao);composer.addPass(new OutputPass());
let root;
const taskLights=new THREE.Group();scene.add(taskLights);
/** Releases each decoded texture once; packed channels often share the same GPU allocation. */
function disposeShop(group){
  const textures=new Set();
  group.traverse(object=>{
    object.geometry?.dispose();
    for(const material of object.material?(Array.isArray(object.material)?object.material:[object.material]):[]){
      for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
      material.dispose();
    }
  });
  for(const texture of textures)texture.dispose();
}
/** Loads only frozen production geometry; lighting and camera are shared by all trades. */
window.setTrade=async trade=>{
  window.ready=false;
  ao.clearReceivers();
  if(root){scene.remove(root);disposeShop(root);}
  taskLights.traverse(object=>{if(object.isLight)object.dispose();});taskLights.clear();
  const bytes=await fetch(`./${trade}.glb`).then(r=>r.arrayBuffer());
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  const gltf=await createGltfLoader(renderer).parseAsync(bytes,location.href);root=gltf.scene;
  root.traverse(o=>{if(o.isMesh){o.castShadow=!o.material.transparent;o.receiveShadow=true;}});scene.add(root);
  taskLights.add(restaurantLighting(root));
  window.setLightingMode('combined');
  window.studyState={trade,sha256:[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join(''),camera:camera.position.toArray(),target:controls.target.toArray()};
  composer.render();window.ready=true;
};
/** Isolates source groups without changing exposure, camera, AO or material reflectance. */
window.setLightingMode=mode=>{
  const fixtureOnly=mode==='fixtures', daylightOnly=mode==='daylight';
  sun.visible=!fixtureOnly;daylight.visible=!fixtureOnly;taskLights.visible=!daylightOnly;
  scene.environmentIntensity=fixtureOnly?0:.12;
};
window.study={scene,camera,controls,renderer,composer,ao,taskLights,sun,daylight};
for(const button of document.querySelectorAll('button'))button.onclick=()=>window.setTrade(button.dataset.trade);
await window.setTrade(new URLSearchParams(location.search).get('trade')??Object.keys(manifest.shops)[0]);
renderer.setAnimationLoop(()=>{controls.update();composer.render();});
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
