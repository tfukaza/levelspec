import {writeFile,readFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import sharp from 'sharp';

const revision=process.argv[2];
if(!revision || !/^[a-z0-9-]+$/.test(revision))throw new Error('Supply a simple frozen revision name.');
const output=`generated/storefront-study/${revision}`, manifest=JSON.parse(await readFile(`${output}/build.json`,'utf8'));
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,watch:null}});await server.listen();
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
  const page=await browser.newPage({viewport:{width:1200,height:900}}), errors=[];
  await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html?trade=roast`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(element=>element.style.display='none');
  const state=await page.evaluate(()=>window.studyState);
  if(state.sha256!==manifest.shops.roast.sha256)throw new Error('Wrong model loaded.');
  await page.evaluate(()=>{
    const {camera,controls}=window.study;
    camera.position.set(1.75,1.4,-.25);controls.target.set(.65,.55,-2.45);camera.fov=65;
    camera.updateProjectionMatrix();controls.update();
  });
  for(const mode of ['unshadowed','shadows','combined']) {
    await page.evaluate(mode=>{
      const {scene,renderer,ao}=window.study;
      renderer.shadowMap.enabled=mode!=='unshadowed';renderer.shadowMap.needsUpdate=true;
      ao.enabled=mode==='combined';
      scene.traverse(object=>{
        if(!object.isMesh)return;
        for(const material of Array.isArray(object.material)?object.material:[object.material])material.needsUpdate=true;
      });
    },mode);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('canvas').screenshot({path:`${output}/lighting-${mode}.png`});
  }
  if(errors.length)throw new Error(errors.join('\n'));
  const buffers=await Promise.all(['unshadowed','combined'].map(mode=>sharp(`${output}/lighting-${mode}.png`).raw().toBuffer()));
  const difference=buffers[0].reduce((sum,value,index)=>sum+Math.abs(value-buffers[1][index]),0)/buffers[0].length;
  if(difference<.25)throw new Error('Shadow/AO toggle has no meaningful rendered effect.');
  const header=Buffer.from('<svg width="2400" height="48"><rect width="100%" height="100%" fill="#252923"/><g fill="#eee6d5" font-family="Arial" font-size="23"><text x="20" y="32">SAME MODEL · SHADOWS / SCREEN AO OFF</text><text x="1220" y="32">SHADOWS + SCREEN AO · BAKED PROP SHADING RETAINED</text></g></svg>');
  await sharp({create:{width:2400,height:948,channels:3,background:'#252923'}})
    .composite([{input:header,left:0,top:0},{input:`${output}/lighting-unshadowed.png`,left:0,top:48},
      {input:`${output}/lighting-combined.png`,left:1200,top:48}]).png().toFile(`${output}/lighting-comparison.png`);
  await writeFile(`${output}/lighting-check.json`,JSON.stringify({sha256:state.sha256,meanAbsolutePixelDifference:difference,
    camera:[1.75,1.4,-.25],target:[.65,.55,-2.45],note:'Identical baked vertex shading in all panels; only real-time shadows and AO toggle.'},null,2));
  console.log(JSON.stringify({difference,errors}));
}finally{await browser.close();await server.close();}
