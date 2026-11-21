import sharp from 'sharp';
import {mkdir, writeFile} from 'node:fs/promises';

const revision = process.argv[2] ?? 'r01';
if (!/^[a-z0-9-]+$/.test(revision)) throw new Error('Use a simple revision name.');
const output = `generated/storefront-study/${revision}`;
const references = 'projects/kowloon-reference-building/concepts/storefronts';
const pairs = {grocer:'reference-storefront', greengrocer:'produce-grocer', roast:'beijing-roast-duck'};
const width = 1280, height = 854, header = 46;
await mkdir(output, {recursive:true});
const provenance = [];
for (const [trade, reference] of Object.entries(pairs)) {
  const leftPath = `${references}/${reference}.png`, rightPath = `${output}/${trade}.png`;
  const [left, right] = await Promise.all([leftPath, rightPath].map(path => sharp(path)
    .resize(width,height,{fit:'contain',background:'#ded7ca'}).png().toBuffer()));
  const title = Buffer.from(`<svg width="${width*2}" height="${header}"><rect width="100%" height="100%" fill="#302e29"/><g font-family="Arial" font-size="23" fill="#eee9dd"><text x="18" y="31">REFERENCE · ${trade}</text><text x="${width+18}" y="31">PROCEDURAL · ${revision} · ${trade}</text></g></svg>`);
  const destination = `${output}/${trade}-comparison.png`;
  await sharp({create:{width:width*2,height:height+header,channels:3,background:'#ded7ca'}})
    .composite([{input:title,top:0,left:0},{input:left,top:header,left:0},{input:right,top:header,left:width}])
    .png().toFile(destination);
  provenance.push({trade,reference:leftPath,render:rightPath,comparison:destination,operation:'Equal panel size; aspect preserved, full images, no crop or retouch.'});
}
await writeFile(`${output}/comparisons.json`,JSON.stringify(provenance,null,2));
console.log(JSON.stringify(provenance));
