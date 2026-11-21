import {readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import sharp from 'sharp';

const revision=process.argv[2];
const trade=process.argv[3]??'roast';
if(!revision || !/^[a-z0-9-]+$/.test(revision))throw new Error('Supply a frozen revision.');
if(!['roast','grocer','greengrocer'].includes(trade))throw new Error('Unknown shop trade.');
const prefix=trade==='roast'?'':`${trade}-`;
const output=`generated/storefront-study/${revision}`;
const manifest=JSON.parse(await readFile(`${output}/build.json`,'utf8'));
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,watch:null}});
await server.listen();
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
  await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html?trade=${trade}`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(element=>element.style.display='none');
  const state=await page.evaluate(()=>window.studyState);
  if(state.sha256!==manifest.shops[trade].sha256)throw new Error('Wrong frozen model.');
  const audit=await page.evaluate(async ()=>{
    const THREE=await import('/node_modules/three/build/three.module.js');
    const {scene,camera,controls,taskLights}=window.study;
    camera.position.set(2.1,1.65,.30);controls.target.set(2.4,1.35,-3.1);camera.fov=72;
    camera.updateProjectionMatrix();controls.update();
    const sources=taskLights.children.flatMap(rig=>rig.userData.sources??[]);
    if(!sources.length)throw new Error('No modeled fixture lights found');
    for(const source of sources){
      const light=taskLights.getObjectByName(source.fixture);
      if(!light?.isSpotLight || !light.castShadow || light.decay!==2 || light.shadow.camera.near>.05
        || light.position.distanceTo(new THREE.Vector3(...source.position))>.0001)
        throw new Error('Actual light disagrees with fixture inventory');
      const objects=[];scene.traverse(object=>{if(object.isMesh && object.name.replace(/_(\d+)$/,'')===source.fixture)objects.push(object);});
      if(!objects.length)throw new Error(`Missing emitter ${source.fixture}`);
      const points=[];
      for(const object of objects){
        const geometry=object.geometry,vertices=geometry.index?.array??Array.from({length:geometry.attributes.position.count},(_,index)=>index);
        for(const vertex of vertices)points.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,vertex).applyMatrix4(object.matrixWorld));
      }
      const bounds=new THREE.Box3().setFromPoints(points),extent=bounds.getSize(new THREE.Vector3());
      if(extent.y>.09 || extent.z>.07 || extent.x>1.23)throw new Error('Emitter locator includes unrelated geometry');
      const position=new THREE.Vector3(...source.position);
      if(position.x<bounds.min.x || position.x>bounds.max.x || Math.abs(position.z-bounds.getCenter(new THREE.Vector3()).z)>.001
        || Math.abs(position.y-(bounds.min.y-.008))>.001)throw new Error('Light detached from emitter');
      if(source.decay!==2 || source.shadowNear>.05)throw new Error('Incorrect falloff/shadow near plane');
    }
    scene.traverse(object=>{
      if(!object.isLight || !object.visible || object.isDirectionalLight || object.isHemisphereLight)return;
      if(!sources.some(source=>source.fixture===object.name))throw new Error(`Unmotivated artificial light: ${object.name}`);
    });
    return {sources,camera:camera.position.toArray(),target:controls.target.toArray(),fov:camera.fov};
  });
  for(const mode of ['daylight','fixtures','combined']){
    await page.evaluate(mode=>{
      window.setLightingMode(mode);
      const {scene,sun,daylight,taskLights}=window.study;
      if(mode==='fixtures' && (sun.visible || daylight.visible || scene.environmentIntensity!==0))throw new Error('Fixture isolation leaked ambient');
      if(mode==='daylight' && taskLights.visible)throw new Error('Daylight isolation leaked artificial lighting');
    },mode);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('canvas').screenshot({path:`${output}/${prefix}sources-${mode}.png`});
  }
  const panels=await Promise.all(['daylight','fixtures','combined'].map(mode=>sharp(`${output}/${prefix}sources-${mode}.png`).resize(800,600).toBuffer()));
  const header=Buffer.from('<svg width="2400" height="42"><rect width="100%" height="100%" fill="#292a25"/><g fill="#eee6d5" font-family="Arial" font-size="20"><text x="20" y="28">DAYLIGHT + LOW AMBIENT APPROXIMATION</text><text x="820" y="28">MODELED FIXTURES ONLY · NO AMBIENT</text><text x="1620" y="28">COMBINED · SAME EXPOSURE</text></g></svg>');
  await sharp({create:{width:2400,height:642,channels:3,background:'#292a25'}}).composite([
    {input:header,left:0,top:0},...panels.map((input,index)=>({input,left:index*800,top:42}))]).png().toFile(`${output}/${prefix}source-comparison.png`);
  if(errors.length)throw new Error(errors.join('\n'));
  await writeFile(`${output}/${prefix}source-audit.json`,JSON.stringify({trade,sha256:state.sha256,...audit,errors},null,2));
  console.log(JSON.stringify({trade,fixtures:audit.sources.length,errors}));
}finally{await browser.close();await server.close();}
