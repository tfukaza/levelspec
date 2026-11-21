import {readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';

const revision=process.argv[2];
if(!revision || !/^[a-z0-9-]+$/.test(revision))throw new Error('Supply a frozen revision.');
const output=`generated/storefront-study/${revision}`;
const manifest=JSON.parse(await readFile(`${output}/build.json`,'utf8'));
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,watch:null}});
await server.listen();
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html?trade=roast`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(element=>element.style.display='none');
  const state=await page.evaluate(()=>window.studyState);
  if(state.sha256!==manifest.shops.roast.sha256)throw new Error('Wrong frozen model.');
  const evidence=[];
  for(const view of ['operator']){
    const cameraState=await page.evaluate(async view=>{
      const THREE=await import('/node_modules/three/build/three.module.js');
      const {scene,camera,controls}=window.study;
      scene.updateMatrixWorld(true);
      const bounds=new THREE.Box3(),point=new THREE.Vector3();
      scene.traverse(object=>{
        if(!object.isMesh || !object.name.includes('checkoutregister'))return;
        const {index,attributes}=object.geometry;
        for(let vertex=0,count=index?.count??attributes.position.count;vertex<count;vertex++){
          point.fromBufferAttribute(attributes.position,index?index.getX(vertex):vertex).applyMatrix4(object.matrixWorld);
          bounds.expandByPoint(point);
        }
      });
      if(bounds.isEmpty())throw new Error('No register geometry');
      const center=bounds.getCenter(new THREE.Vector3());
      // Stable framing uses the common footprint and support plane, not each revision's upper silhouette.
      center.y=bounds.min.y+.115;
      camera.position.copy(center).add(new THREE.Vector3(view==='customer'?.48:.33,.34,view==='customer'?.66:-.60));
      controls.target.copy(center);camera.fov=35;camera.near=.015;camera.updateProjectionMatrix();controls.update();
      return {view,position:camera.position.toArray(),target:controls.target.toArray(),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    },view);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    
    for(const mode of ['unlit','flat-normal','no-shadows','only-self-shadow','only-scene-shadow','no-ao']){
      await page.evaluate(async mode=>{
        const THREE=await import('/node_modules/three/build/three.module.js');
        const {scene,ao}=window.study;ao.enabled=false;
        scene.traverse(object=>{
          if(!object.isMesh)return;
          const register=object.name.includes('checkoutregister');
          object.receiveShadow=!['unlit','flat-normal','no-shadows'].includes(mode);
          object.castShadow=mode==='only-self-shadow'?register:mode==='only-scene-shadow'?!register:mode==='no-ao'?!object.material.transparent:false;
          if(!object.name.includes('checkoutregister'))return;
          object.userData.originalMaterial??=object.material;
          const original=object.userData.originalMaterial;
          const convert=material=>{
            if(mode==='unlit')return new THREE.MeshBasicMaterial({map:material.map,vertexColors:material.vertexColors,side:material.side,color:material.color});
            const copy=material.clone();if(mode==='flat-normal')copy.normalMap=null;return copy;
          };
          object.material=Array.isArray(original)?original.map(convert):convert(original);
        });
      },mode);
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await page.locator('canvas').screenshot({path:`${output}/diagnostic-${mode}.png`});
    }
    evidence.push(cameraState);
  }
  if(errors.length)throw new Error(errors.join('\n'));
  await writeFile(`${output}/diagnostic-captures.json`,JSON.stringify({sha256:state.sha256,evidence,errors},null,2));
  console.log(JSON.stringify({revision,errors}));
}finally{await browser.close();await server.close();}
