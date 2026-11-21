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
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html?trade=greengrocer`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(element=>element.style.display='none');
  const state=await page.evaluate(()=>window.studyState);
  if(state.sha256!==manifest.shops.greengrocer.sha256)throw new Error('Wrong frozen model.');
  const evidence=[];
  for(const view of ['wall','metal']){
    const cameraState=await page.evaluate(async view=>{
      const THREE=await import('/node_modules/three/build/three.module.js');
      const {scene,camera,controls}=window.study;
      scene.updateMatrixWorld(true);
      const bounds=new THREE.Box3(),point=new THREE.Vector3();
      const match=view==='wall'?'upperstorageleft':'shelffixturesrearsteel';
      scene.traverse(object=>{
        if(!object.isMesh || !object.name.replace(/[^a-z0-9]/gi,'').toLowerCase().includes(match))return;
        const {index,attributes}=object.geometry;
        for(let vertex=0,count=index?.count??attributes.position.count;vertex<count;vertex++){
          point.fromBufferAttribute(attributes.position,index?index.getX(vertex):vertex).applyMatrix4(object.matrixWorld);
          bounds.expandByPoint(point);
        }
      });
      if(bounds.isEmpty())throw new Error(`No ${view} shelf geometry`);
      const center=bounds.getCenter(new THREE.Vector3());
      if(view==='metal')center.y+=.30;
      camera.position.copy(center).add(new THREE.Vector3(...(view==='wall'?[1.65,-.17,1.10]:[-.28,.14,1.45])));
      controls.target.copy(center);camera.fov=48;camera.near=.015;camera.updateProjectionMatrix();controls.update();
      return {view,position:camera.position.toArray(),target:controls.target.toArray(),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    },view);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('canvas').screenshot({path:`${output}/shelf-${view}.png`});
    evidence.push(cameraState);
  }
  if(errors.length)throw new Error(errors.join('\n'));
  await writeFile(`${output}/shelf-captures.json`,JSON.stringify({sha256:state.sha256,evidence,errors},null,2));
  console.log(JSON.stringify({revision,errors}));
}finally{await browser.close();await server.close();}
