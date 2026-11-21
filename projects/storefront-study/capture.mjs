import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
const revision=process.argv[2]??'r01',output=`generated/storefront-study/${revision}`;
const manifest=JSON.parse(await readFile(`${output}/build.json`,'utf8'));
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,watch:null}});await server.listen();
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  const page=await browser.newPage({viewport:{width:1536,height:1024}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
  await page.goto(`${server.resolvedUrls.local[0]}${output}/index.html`);
  await page.waitForFunction(()=>window.ready,{},{timeout:180000});
  await page.locator('nav').evaluate(e=>e.style.display='none');
  const evidence={};
  for(const trade of ['grocer','greengrocer','roast']){
    await page.evaluate(trade=>window.setTrade(trade),trade);
    await page.waitForFunction(()=>window.ready);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const state=await page.evaluate(()=>window.studyState);
    if(state.sha256!==manifest.shops[trade].sha256)throw new Error('Capture model hash mismatch.');
    await page.locator('canvas').screenshot({path:`${output}/${trade}.png`});evidence[trade]=state;
  }
  if(errors.length)throw new Error(errors.join('\n'));
  await writeFile(`${output}/captures.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
}finally{await browser.close();await server.close();}
