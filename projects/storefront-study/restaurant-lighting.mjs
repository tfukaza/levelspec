import * as THREE from 'three';

/** GLB parts share a position buffer: only indexed vertices belong to a given emitting surface. */
function emitterBounds(object) {
  const bounds=new THREE.Box3(),point=new THREE.Vector3();
  const {index,attributes}=object.geometry;
  const count=index?.count??attributes.position.count;
  for(let vertex=0;vertex<count;vertex++){
    point.fromBufferAttribute(attributes.position,index?index.getX(vertex):vertex).applyMatrix4(object.matrixWorld);
    bounds.expandByPoint(point);
  }
  return bounds;
}

/** Builds shadowed direct lights from named bulb/tube meshes in the exported model, in world meters. */
export function restaurantLighting(root) {
  const rig=new THREE.Group();
  rig.name='restaurant-fixture-lights';
  const emitters=new Map();
  root.updateMatrixWorld(true);
  root.traverse(object=>{
    if(!object.isMesh || !/bulb-emitter|tube-emitter/.test(object.name))return;
    const key=object.name.replace(/_(\d+)$/,'');
    const bounds=emitterBounds(object);
    if(emitters.has(key))emitters.get(key).union(bounds);else emitters.set(key,bounds);
    // Only the luminous glass is emissive; the fitting and furniture retain their material response.
    object.material=object.material.clone();
    object.material.emissive.set(object.name.includes('bulb-emitter')?'#fff1d7':object.name.includes('hood-light')?'#fff0dc':'#f5f0e5');
    object.material.emissiveIntensity=.8;
    object.castShadow=false;
  });
  const sources=[];
  for(const [name,bounds] of emitters){
    const tube=name.includes('tube-emitter'),hood=name.includes('hood-light');
    const center=bounds.getCenter(new THREE.Vector3());
    // One shadow sample per fitting keeps PBR material samplers below WebGL's 16-unit floor.
    {
      const light=new THREE.SpotLight(hood?'#fff0dc':tube?'#f5f0e5':'#fff1d7',tube?(hood?5:16):9,
        tube?5.5:3.5,hood?.75:tube?1.28:1.12,.9,2);
      light.name=name;
      light.position.set(center.x,bounds.min.y-.008,center.z);
      light.target.position.copy(light.position).add(new THREE.Vector3(0,-1,0));
      light.castShadow=true;light.shadow.mapSize.set(1024,1024);
      light.shadow.camera.near=.03;light.shadow.camera.far=light.distance;
      light.shadow.normalBias=.001;light.shadow.bias=-.00002;
      rig.add(light,light.target);
      sources.push({fixture:name,position:light.position.toArray(),candela:light.intensity,
        halfAngle:light.angle,range:light.distance,decay:light.decay,shadowNear:light.shadow.camera.near});
    }
  }
  if(!sources.length)throw new Error('No named restaurant emitters found.');
  rig.userData.sources=sources;
  return rig;
}
