import {writeFile,readFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';

const revision=process.argv[2]??'r10';
if(!/^[a-z0-9-]+$/.test(revision))throw new Error('Use a simple revision name.');
const output=`generated/storefront-study/${revision}`;
const manifest=JSON.parse(await readFile(`${output}/build.json`,'utf8'));
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,watch:null}});
await server.listen();
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
  const page=await browser.newPage({viewport:{width:1536,height:1024}}), errors=[], evidence=[];
  await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(element=>element.style.display='none');
  for(const trade of Object.keys(manifest.shops)) {
    await page.evaluate(trade=>window.setTrade(trade),trade);
    const state=await page.evaluate(()=>window.studyState);
    if(state.sha256!==manifest.shops[trade].sha256)throw new Error('Capture model hash mismatch.');
    for(const view of ['cutaway','interior']) {
      const camera=await page.evaluate(async ({view,size})=>{
        const THREE=await import('/node_modules/three/build/three.module.js');
        const {camera,controls,renderer,scene}=window.study;
        /** Shared GLB position buffers require selecting this part's indexed vertices. */
        function partBounds(object){
          const bounds=new THREE.Box3(),point=new THREE.Vector3();
          const {index,attributes}=object.geometry;
          for(let vertex=0,count=index?.count??attributes.position.count;vertex<count;vertex++){
            point.fromBufferAttribute(attributes.position,index?index.getX(vertex):vertex).applyMatrix4(object.matrixWorld);
            bounds.expandByPoint(point);
          }
          return bounds;
        }
        scene.updateMatrixWorld(true);
        const wallClips=[];
        renderer.clippingPlanes=[];renderer.localClippingEnabled=true;
        scene.traverse(object=>{
          if(!object.isMesh)return;
          if(!object.userData.captureMaterials){
            object.userData.captureOriginalMaterial=object.material;
            const original=Array.isArray(object.material)?object.material:[object.material];
            object.userData.captureMaterials=original.map(material=>{
              const clone=material.clone();
              clone.onBeforeCompile=material.onBeforeCompile;
              clone.customProgramCacheKey=material.customProgramCacheKey;
              return clone;
            });
            object.material=Array.isArray(object.material)?object.userData.captureMaterials:object.userData.captureMaterials[0];
          }
          const envelope=object.name.includes('envelope') || object.name.includes('striped-awning');
          const roomWall=object.name.includes('room-wall-');
          const bounds=roomWall?partBounds(object):null;
          const nearWall=bounds && bounds.max.x-bounds.min.x<.15 && bounds.getCenter(new THREE.Vector3()).x>size.width*.5;
          const ceiling=object.name.includes('ceiling-fixtures');
          const opening=object.name.includes('openings');
          const height=ceiling?0:envelope?.32:opening?2.05:nearWall?.35:roomWall?2.40:null;
          if(roomWall)wallClips.push({part:object.name,min:bounds.min.toArray(),max:bounds.max.toArray(),
            height:view==='cutaway'?height:null});
          for(const material of object.userData.captureMaterials)
            material.clippingPlanes=view==='cutaway' && height!==null?[new THREE.Plane(new THREE.Vector3(0,-1,0),height)]:[];
        });
        const scale=Math.max(size.width,size.depth)/6.2;
        camera.position.set(...(view==='cutaway'
          ?[size.width/2+5.6*scale,12*scale,-size.depth/2+8*scale]
          :[size.width*.44,Math.min(1.75,size.height-.1),.65]));
        controls.target.set(...(view==='cutaway'
          ?[size.width/2,0,-size.depth/2]
          :[size.width*.52,1.2,-Math.min(size.depth-.3,4.2)]));
        camera.fov=view==='cutaway'?38:65;
        camera.updateProjectionMatrix();controls.update();
        return {position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov,wallClips,
          cutaway:view==='cutaway'?'Envelope above .32m; near wall above .35m; far walls above 2.40m; ceiling fixtures hidden; openings above 2.05m; furnishings and enclosure shadows retained':null};
      },{view,size:manifest.size});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const path=`${output}/${trade}-${view}.png`;
      await page.locator('canvas').screenshot({path});
      evidence.push({trade,view,path,sha256:state.sha256,camera});
    }
    await page.evaluate(()=>{
      window.study.scene.traverse(object=>{
        if(!object.userData.captureMaterials)return;
        for(const material of object.userData.captureMaterials)material.dispose();
        object.material=object.userData.captureOriginalMaterial;
        delete object.userData.captureMaterials;
        delete object.userData.captureOriginalMaterial;
      });
      window.study.renderer.localClippingEnabled=false;
    });
  }
  if(errors.length)throw new Error(errors.join('\n'));
  await writeFile(`${output}/layout-captures.json`,JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence));
} finally {await browser.close();await server.close();}
