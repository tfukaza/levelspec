import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';

const revision=process.argv[2]??'r11';
if(!/^[a-z0-9-]+$/.test(revision))throw new Error('Use a simple revision name.');
const output=`generated/storefront-study/${revision}`;
const references='projects/storefront-study/concepts/research-r10';
const pairs={grocer:'provisions',greengrocer:'produce',roast:'roast-v2'};
const width=1280,height=854,header=46,provenance=[];
for(const [trade,reference] of Object.entries(pairs)) {
  const leftPath=`${references}/${reference}.png`,rightPath=`${output}/${trade}.png`;
  const panels=await Promise.all([leftPath,rightPath].map(path=>sharp(path)
    .resize(width,height,{fit:'contain',background:'#ded7ca'}).png().toBuffer()));
  const title=Buffer.from(`<svg width="${width*2}" height="${header}"><rect width="100%" height="100%" fill="#302e29"/><g font-family="Arial" font-size="23" fill="#eee9dd"><text x="18" y="31">AI RESEARCH CONCEPT · ${trade}</text><text x="${width+18}" y="31">ACTUAL PROCEDURAL · ${revision} · ${trade}</text></g></svg>`);
  const comparison=`${output}/${trade}-research-comparison.png`;
  await sharp({create:{width:width*2,height:height+header,channels:3,background:'#ded7ca'}})
    .composite([{input:title,top:0,left:0},{input:panels[0],top:header,left:0},{input:panels[1],top:header,left:width}])
    .png().toFile(comparison);
  provenance.push({trade,reference:leftPath,render:rightPath,comparison,
    operation:'Equal panels; complete images, preserved aspect, no cropping or retouching. Concept cameras are not matched.'});
}
await writeFile(`${output}/research-comparisons.json`,JSON.stringify(provenance,null,2));
console.log(JSON.stringify(provenance));
