/** Builds a small undressed-host study of the reusable duct assembly; outputs stay under generated/. */
import { mkdir, writeFile } from 'node:fs/promises';
import { Matrix4 } from 'three';
import { compile, parseAml, validateForRuntime } from '../../../../src/architecture/index.ts';
import { hash } from '../../../../src/vector/geometry.ts';
import { meshParts } from '../../../../src/vector/mesh.ts';
import { KitMesh } from '../../../../src/dressing/kit-mesh.ts';
import { kitMaterials, kitFinishes } from '../../../../src/dressing/kit.ts';
import { Pen } from '../../../../src/dressing/pen.ts';
import { drawDuct } from '../../../../src/dressing/props/duct.ts';

const variants = [
  { name: 'compact', x: 0, width: .58, depth: .38, standOff: .2, height: 3.2, supports: [1.2, 2.3], variant: 0 },
  { name: 'standard', x: 3.4, width: .78, depth: .62, standOff: .32, height: 5.2, supports: [1.18, 4.3], variant: 1 },
  { name: 'wide', x: 7, width: 1.2, depth: .9, standOff: .55, height: 7.5, supports: [1.2, 6.6], variant: 2 },
  { name: 'custom-bends', x: 11, width: .9, depth: .7, standOff: .4, height: 6.4,
    lowerBendHeight: 1.3, upperBendHeight: .9, sections: 4, supports: [1.5, 5.3], variant: 3 },
];
const source = `<architecture version="1" id="duct-modules"><material id="wall" color="#9caba9"/>
${variants.map(v => `<box id="${v.name}" width="2.6" depth=".4" height="${v.height + .6}" position="${v.x - 1.3} -.4 0" material="wall"/>`).join('\n')}
</architecture>`;
const level = await compile(parseAml(source), { navigation: false });
kitMaterials(level);
level.mesh.colors = Array(level.mesh.positions.length).fill(1);
const materials = kitFinishes(level, undefined, 'wall').materials;
for (const {name, x, ...options} of variants) {
  const mesh = new KitMesh(level, name, 'duct', materials, { maximumTriangles: 20000 });
  drawDuct(new Pen(mesh, 'duct', new Matrix4().makeTranslation(x, 0, .3), false), options);
}
level.parts = meshParts(level.mesh, level.surfaces);
level.renderHash = await hash({ mesh: level.mesh, materials: level.document.materials, surfaceAppearance: level.surfaceAppearance });
const report = await validateForRuntime(level, { sealed: true });
if (!report.passed) throw new Error(JSON.stringify(report.diagnostics));
const output = 'generated/dressing-demo/art-review/duct-module-preview';
await mkdir(`${output}/kowloon`, { recursive: true });
await writeFile(`${output}/kowloon/level.aml`, source);
await writeFile(`${output}/kowloon/preview.json`, JSON.stringify({ version: 2, level, report, generatedImages: {} }));
await writeFile(`${output}/manifest.json`, JSON.stringify({ previews: [{ id: 'kowloon', renderHash: level.renderHash, physicalHash: level.physicalHash }], variants }, null, 2));
console.log(output, level.renderHash);
