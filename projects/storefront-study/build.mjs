import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'vite';
import {compile,parseAml,toGLB,resolveExportAssets} from '../../src/architecture/index.ts';
import {compileSurfaceAppearance} from '../../src/dressing/surface/compile.ts';
import {localMaterialImages} from '../../src/cli/material-images.ts';
import {meshParts} from '../../src/vector/mesh.ts';
import {hash} from '../../src/vector/geometry.ts';
import {collisionMesh} from '../../src/vector/collision.ts';
import {createDiskMaterialCache} from '../../tools/dressing-demo/material-cache.ts';
import {rasterCodeHash} from '../../tools/dressing-demo/raster-protocol.ts';
import {dressStorefront,SIZE,TRADES} from './scene.ts';

const revision=process.argv[2]??'r01';
const profile=process.argv[3]??'default';
const profiles={default:{size:SIZE,trades:Object.keys(TRADES)},
  'small-dining':{size:{...SIZE,width:4.4,depth:5.2},trades:['roast']},
  'small-produce':{size:{...SIZE,width:1.8,depth:2.4,height:2.08},trades:['greengrocer']}};
if(!profiles[profile])throw new Error('Unknown study profile.');
const {size,trades}=profiles[profile];
if(!/^[a-z0-9-]+$/.test(revision))throw new Error('Use a simple revision name.');
const output=`generated/storefront-study/${revision}`;
await mkdir('generated/storefront-study',{recursive:true});await mkdir(output);
const source='projects/storefront-study/level.aml',sourceBytes=await readFile(source);
const images=localMaterialImages(source),manifest={revision,profile,size,shops:{}};
const cache=createDiskMaterialCache(resolve('generated/material-cache'),await rasterCodeHash());
for(const trade of trades){
  const started=performance.now();
  const level=await compile(parseAml(sourceBytes.toString()),{navigation:false,resolveMaterialImage:images.load});
  const physical=await hash(collisionMesh(level,true));
  level.mesh=structuredClone(level.mesh);level.mesh.colors??=level.mesh.positions.map(()=>1);
  dressStorefront(level,trade,size);
  await compileSurfaceAppearance(level,{navigation:false,resolveMaterialImage:images.load,materialCache:cache,
    appearance:{maximumTexels:32*1024*1024,maximumBytes:256*1024*1024,maximumCharts:65536},
    onProgress:stage=>console.error(`${trade}: ${stage}`)},600000);
  if(await hash(collisionMesh(level,true))!==physical)throw new Error('Dressing changed collision.');
  if(level.diagnostics.some(d=>d.severity==='error'))throw new Error(JSON.stringify(level.diagnostics));
  for(const values of [level.mesh.positions,level.mesh.normals,level.mesh.uv])if(!values.every(Number.isFinite))throw new Error('Non-finite mesh.');
  level.parts=meshParts(level.mesh,level.surfaces);
  const bytes=toGLB(level,{assets:await resolveExportAssets(level,images.load)});
  await writeFile(`${output}/${trade}.glb`,bytes);
  manifest.shops[trade]={sha256:createHash('sha256').update(bytes).digest('hex'),triangles:level.mesh.indices.length/3,physicalHash:physical,bytes:bytes.length,seconds:(performance.now()-started)/1000};
}
await writeFile(`${output}/build.json`,JSON.stringify(manifest,null,2));
await cp('projects/storefront-study/scene.ts',`${output}/scene-source.ts`);
for (const file of ['industrial-facade.ts','viewer.mjs','restaurant-lighting.mjs'])
  await cp(`projects/storefront-study/${file}`,`${output}/${file}.source`);
await cp('src/dressing/kowloon/shop',`${output}/shop-source`,{recursive:true});
await build({configFile:false,logLevel:'warn',build:{outDir:resolve(output),emptyOutDir:false,lib:{entry:resolve('projects/storefront-study/viewer.mjs'),formats:['es'],fileName:()=> 'viewer.js'}}});
await cp('projects/storefront-study/index.html',`${output}/index.html`);
console.log(JSON.stringify(manifest));
