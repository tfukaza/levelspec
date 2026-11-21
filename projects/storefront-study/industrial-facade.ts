import type { V3 } from '../../src/architecture/types.ts';
import type { Pen } from '../../src/dressing/pen.ts';
import type { Kit } from '../../src/dressing/kowloon/kit.ts';
import { srgb } from '../../src/dressing/kowloon/palette.ts';
import { PipeSystem } from '../../src/dressing/kowloon/pipes.ts';
import { drawPanel, type PanelDesign } from '../../src/dressing/kowloon/signs/panel.ts';
import { bolt, member, gusset, type Steel } from '../../src/dressing/kowloon/signs/steel.ts';
import { weatheredPen } from '../../src/dressing/kowloon/weathered.ts';

const TRADES = {
  grocer: { title: '興隆酒行', short: '酒', paint: '#506d7a', ink: '#d0c6a6', patch: '#6b7b78' },
  greengrocer: { title: '永昌生果店', short: '果', paint: '#516c60', ink: '#d4caaa', patch: '#7c8978' },
  roast: { title: '燒味飯店', short: '燒味', paint: '#c0b397', ink: '#773f36', patch: '#607583' },
} as const;

/** Fits weathered trade lettering to a shallow sheet with real steel edging. */
function sign(pen: Pen, width: number, height: number, text: string, paint: string, ink: string, kit: Kit, phase: number): void {
  const design: PanelDesign = {
    width, height, depth: .045, construction: 'sheet', outline: 'rectangle',
    ground: srgb(paint), border: srgb(ink), stack: 'down', age: .82, phase,
    blocks: [{ text, face: 'brush', direction: text.length > 2 ? 'ltr' : 'ttb', ink: srgb(ink), share: 1 }],
  };
  drawPanel(pen, design, 'front', { slot: 'metal', tint: srgb('#52605e'), weathering: kit }, kit);
}

/** A repaired, bolted panel remains attached to the header; offset overlaps create a readable assembly silhouette. */
function patch(pen: Pen, kit: Kit, min: V3, max: V3, tint: V3): void {
  const small = Math.max(max[0]-min[0],max[2]-min[2]) < .8;
  (small ? pen : weatheredPen(pen,kit,'frame')).box('metal',min,max,tint);
  if (small) {
    const x=min[0]+.045,y=max[1]+.0004,z=max[2]-.012;
    pen.face('paint',[[x,y,z],[x+.038,y,z-.003],[x+.022,y,z-.009],[x-.007,y,z-.006]],
      [0,1,0],srgb('#697779'));
  }
  const steel: Steel = { slot: 'metal', tint: srgb('#454e4d') };
  for (const x of [min[0]+.035,max[0]-.035]) for (const z of [min[2]+.035,max[2]-.035])
    bolt(pen,steel,[x,max[1]+.001,z],[0,1,0],.008);
}

/** Makes an asymmetrical steel duct with folded seams and visible wall-supported brackets, entirely above the awning. */
function headerDuct(pen: Pen, width: number, kit: Kit): void {
  const x = width-.77;
  const steel: Steel = { slot: 'metal', tint: srgb('#78898d') };
  const metal = pen;
  metal.box('metal',[x,.19,3.20],[x+.35,.49,3.51],steel.tint);
  metal.box('metal',[x+.35,.19,3.28],[width+.22,.44,3.51],srgb('#697b80'));
  metal.box('metal',[width-.04,.19,3.51],[width+.22,.44,3.70],srgb('#7e8c88'));
  for (const seamX of [x+.02,x+.33,width-.06,width+.20])
    member(pen,steel,[seamX,.45,3.28],[seamX,.45,3.50],[1,0,0],.018,.022);
  for (const at of [x+.10,width+.08]) {
    member(pen,steel,[at,.19,3.16],[at,.48,3.16],[1,0,0],.035,.035);
    gusset(pen,steel,[[at,.19,3.04],[at,.19,3.16],[at,.47,3.16]],[1,0,0],.012);
  }
}

/** Draws street-facing services and layered signs in the study's existing header/pier space, leaving the shop opening clear. */
export function industrialFacade(front: Pen, width: number, trade: keyof typeof TRADES, kit: Kit): void {
  const pen = front.into('industrial-facade');
  const look = TRADES[trade];
  const steel: Steel = { slot: 'metal', tint: srgb('#4c5a59'), weathering: kit };
  const mainX = Math.max(.06,width*(trade==='grocer'?.14:.08));
  const mainWidth = Math.max(.85,width*(trade==='greengrocer'?.54:trade==='grocer'?.74:.66));
  patch(pen,kit,[-1.16,.19,3.13],[-.65,.26,3.66],srgb('#677d87'));
  patch(pen,kit,[mainX-.06,.19,3.15],[mainX+mainWidth+.06,.24,3.66],srgb(look.patch));
  sign(pen.move(mainX,.30,3.16),mainWidth,.43,look.title,look.paint,look.ink,kit,621);
  for (const x of [-.54,width*.37,width*.73])
    patch(pen,kit,[x,.185,3.65],[x+.34,.235,3.70],srgb(look.patch));
  if (width >= 2.7 && trade!=='grocer') headerDuct(pen.into('industrial-facade/duct'),width,kit);
  if (trade==='grocer') {
    patch(pen,kit,[-1.13,.19,3.20],[-.35,.43,3.64],srgb('#5c6d71'));
    for (let slat=0;slat<6;slat++)
      pen.box('metal',[-1.07,.435,3.24+slat*.056],[-.41,.48,3.26+slat*.056],srgb('#35474b'));
  }

  const pipe = new PipeSystem(pen.into('industrial-facade/drain'),{radius:.034,sides:8,color:srgb('#607876'),kit,variant:'shop-header-drain'});
  pipe.run([[width+.27,.23,.025],[width+.27,.23,3.60],[width-.30,.23,3.60],[width-.30,.10,3.60]],0);
  pen.box('paint',[width+.15,.11,.002],[width+.39,.35,.012],srgb('#252f33'));
  for (let rung=0;rung<5;rung++)
    member(pen,steel,[width+.16,.135+rung*.043,.017],[width+.38,.135+rung*.043,.017],[0,0,1],.012,.012);
  for (let line=0;line<3;line++) {
    const x=-.28+line*.048,y=.055+line*.018;
    const headerY=.26+line*.018;
    const path: V3[]=[[x,y,.25],[x,y,2.70],[x,headerY,2.85],[x,headerY,3.58],
      [x+.22,headerY,3.63],[width*.46,headerY,3.63]];
    pen.tube('metal',path,.011,srgb('#3c4c4e'),8);
    for (const z of [.6,1.35,2.1,2.88])
      member(pen,steel,[x-.02,0,z],[x-.02,y+.022,z],[1,0,0],.05,.018);
  }
  patch(pen,kit,[-.31,.04,2.24],[-.08,.15,2.55],srgb('#7d8276'));
  patch(pen,kit,[-.32,.025,.19],[-.12,.14,.38],srgb('#63736e'));
  patch(pen,kit,[width*.46-.09,.18,3.57],[width*.46+.10,.34,3.70],srgb('#677976'));
  patch(pen,kit,[width+.04,.02,2.15],[width+.34,.16,2.48],srgb(look.patch));

  const hanger = pen.into('industrial-facade/projecting-sign').move(trade==='greengrocer'?width+.15:0,0,trade==='grocer'?.03:0);
  for (const x of [-.93,-.44]) {
    member(hanger,steel,[x,.19,3.64],[x,.82,3.64],[1,0,0],.035,.035);
    member(hanger,steel,[x,.19,3.42],[x,.63,3.64],[1,0,0],.025,.025);
    member(hanger,steel,[x,.78,3.50],[x,.78,3.64],[1,0,0],.016,.016);
  }
  sign(hanger.move(-1.02,.80,2.83),.66,.67,look.short,look.ink,look.paint,kit,663);
}
