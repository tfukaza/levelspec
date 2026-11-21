import { Matrix4 } from 'three';
import type { CompiledArchitecture } from '../../src/architecture/types.ts';
import { bindLibraryMaterial } from '../../src/materials/catalog.ts';
import { kitFinishes } from '../../src/dressing/kit.ts';
import { KitMesh } from '../../src/dressing/kit-mesh.ts';
import { Pen } from '../../src/dressing/pen.ts';
import { Kit } from '../../src/dressing/kowloon/kit.ts';
import type { Facade } from '../../src/dressing/kowloon/facade.ts';
import { drawShop } from '../../src/dressing/kowloon/shop/shop.ts';
import { grocer } from '../../src/dressing/kowloon/shop/grocer.ts';
import { greengrocer } from '../../src/dressing/kowloon/shop/greengrocer.ts';
import { roast } from '../../src/dressing/kowloon/shop/roast.ts';
import { canvasAwning } from '../../src/dressing/kowloon/tarps.ts';
import { stainedPanel } from '../../src/dressing/kowloon/skin.ts';
import { securityBars } from '../../src/dressing/kowloon/windows.ts';
import { industrialFacade } from './industrial-facade.ts';
import { srgb } from '../../src/dressing/kowloon/palette.ts';
import { rotated } from '../../src/dressing/kowloon/shop/forms.ts';
import { LOT, FINISH } from '../../src/dressing/kowloon/reference-building/parts/composition.ts';

export const TRADES = { grocer, greengrocer, roast };
export type StudyTrade = keyof typeof TRADES;
export const SIZE = { width: 4.8, depth: 6.2, height: 2.65, floor: .12 };

/** Encloses the real production trade in one shared street bay, in Z-up meters. */
export function dressStorefront(level: CompiledArchitecture, trade: StudyTrade, size = SIZE): void {
  const wall = bindLibraryMaterial(level.document.materials, 'plaster');
  const finishes = kitFinishes(level, undefined, wall);
  const mesh = new KitMesh(level, 'study-host', 'default', finishes.materials, { maximumTriangles: 600000 });
  const root = new Pen(mesh, 'envelope', new Matrix4(), false);
  const front = root.facing([0,0,0], [1,0,0], [0,-1,0]);
  const kit = new Kit('storefront-study', 2, .8, .6, true, 96, .35);
  const walls = new Kit('storefront-study-walls', 2, .95, .52, true, 160, .35);
  const {width,depth,height,floor} = size;
  const facade: Facade = {
    role:'front', lot:LOT, finish:FINISH, key:'study', pen:front, width,
    shift:0, bodyU0:0, bodyU1:width, ground:[], body:[], shops:1,
    reach:(_zone,_a,_b,_c,_d,limit)=>limit, hollow:(_a,_b,_c,limit)=>Math.min(depth,limit),
    frontage:()=>true,
  };
  const shopSeed = trade === 'roast' ? 'storefront-1' : trade === 'grocer' ? 'storefront-3' : 'storefront-study';
  const shopKit = new Kit(shopSeed,2,.8,.6,true,96,.35);
  drawShop(facade,{x0:0,x1:width,floor,head:floor+height,depth,key:'study',shutterColor:srgb('#536157')},'wall',shopKit,TRADES[trade]);
  for (const [x0,x1] of [[-.35,0],[width,width+.4]]) {
    front.box('wall',[x0,-.22,0],[x1,0,3.7],srgb('#d5c6aa'),'f');
    for (const [z0,z1,color] of [[0,1.0,'#353b37'],[1,3.7,'#d1c3a7']] as const)
      stainedPanel(front,'wall',{u0:x0,u1:x1,v0:z0,v1:z1},.002,srgb(color),walls,.9,421,0,
        [{u0:0,u1:width,z0:floor,z1:floor+height}]);
  }
  front.box('concrete',[-1.3,-.2,2.79],[width+.4,.18,3.7],srgb('#b6aa92'),'f');
  stainedPanel(front,'wall',{u0:-1.3,u1:width+.4,v0:2.79,v1:3.7},.182,srgb('#d0c2a8'),walls,.95,422);
  root.box('concrete',[-1.3,-1.6,-.10],[width+.7,depth,.0],srgb('#716c60'),'');
  const pavement = rotated(root.into('pavement'),[0,0,.003],'x',Math.PI/2);
  for (let row=0;row<3;row++) for (let column=0;column<13;column++) {
    const x=-1.3+column*.52;
    stainedPanel(pavement,'concrete',{u0:x+.004,u1:x+.512,v0:row*.52+.004,v1:(row+1)*.52-.004},0,
      srgb('#888578'),walls,.6,530+column%3);
  }
  securityBars(front.move(0,-.04,0),-1.26,.12,.88,2.61,'diamond',srgb('#6f6d5e'),kit);
  front.panel('pane',-1.3,-.35,.12,2.75,-.12,srgb('#242924'));
  const canopy = trade === 'greengrocer' ? ['#8d7160','#708476']
    : trade === 'grocer' ? ['#456563','#657b74'] : ['#405f60','#6c8077'];
  const split = width*(trade==='roast'?.35:trade==='grocer'?.68:.46);
  for (const [index,x0,x1] of [[0,-.12,split-.025],[1,split+.025,width+.12]])
    canvasAwning(front.into(`striped-awning-${index}`),{x0,x1,z:3.06-index*.07,depth:index? .88:1.14,drop:index?.27:.36,valance:.19},
      srgb(canopy[index]),srgb(canopy[1-index]),`study-awning-${index}`,kit,{color:srgb('#b7b49b'),width:.22});
  industrialFacade(front,width,trade,kit);
}
