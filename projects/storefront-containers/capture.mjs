import { chromium } from "playwright";
import { createServer } from "vite";
const stage = process.argv[2] ?? "after";
const server = await createServer({configFile:false,root:process.cwd(),server:{host:"127.0.0.1",port:5191,strictPort:true,watch:null},optimizeDeps:{include:["three","three/addons/controls/OrbitControls.js"]}});
await server.listen();
const browser = await chromium.launch({headless:true,channel:"chrome"});
try {
  const page = await browser.newPage({ viewport:{width:1400,height:950},deviceScaleFactor:1 });
  page.on("pageerror",error=>console.error(error));
  for (const view of ["wide","close","rear"]) {
    await page.goto(`http://127.0.0.1:5191/projects/storefront-containers/index.html?stage=${stage}&view=${view}`);
    await page.waitForSelector('body[data-ready="true"]');
    await page.screenshot({path:`generated/storefront-containers/${stage}-${view}.png`});
  }
} finally { await browser.close(); await server.close(); }
