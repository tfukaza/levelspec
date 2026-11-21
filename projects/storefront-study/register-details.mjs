/** Applies repeatable, component-local repairs to the inspected Tripo register, in bottom-centered Z-up meters. */
export function repairRegister(sourceFaces){
  const groups=components(sourceFaces),removed=[];
  const faces=groups.flatMap(group=>{
    const {min,max}=group;
    const keys=min[2]>.08 && max[1]<-.015 && min[0]>-.105 && max[0]<.115;
    const receipt=min[0]>-.09 && max[0]<-.045 && min[1]>-.01 && max[1]<.025 && min[2]>.125;
    if(keys || receipt){removed.push({kind:keys?'keys':'receipt',triangles:group.faces.length,min,max});return [];}
    return group.faces;
  });
  if(removed.filter(item=>item.kind==='keys').length!==26 || removed.filter(item=>item.kind==='receipt').length!==1)
    throw new Error('Source component layout changed: review the surgery selection before rebaking.');
  const paintedFaces=[];
  const emit=(points,color,hint)=>polygon(paintedFaces,points,color,hint);
  keyboard(emit);
  receiptPaper(emit);
  customerDisplay(emit,faces);
  operatorReadout(emit,faces);
  return {faces,paintedFaces,repairs:{removed,retainedTriangles:faces.length,authoredTriangles:paintedFaces.length,
    note:'Detached generated keys/receipt removed; housing, printer, feet and their original UVs/maps retained. Rear display follows the actual shell.'}};
}

/** Position-connected source islands preserve all housing triangles while identifying detached generated controls. */
function components(faces){
  const parent=faces.map((_,index)=>index),owner=new Map();
  const find=index=>parent[index]===index?index:parent[index]=find(parent[index]);
  for(const [index,face] of faces.entries())for(const vertex of face){
    const key=vertex.slice(0,3).join(',');
    if(owner.has(key))parent[find(index)]=find(owner.get(key));else owner.set(key,index);
  }
  const groups=new Map();
  for(const [index,face] of faces.entries()){
    const root=find(index);
    if(!groups.has(root))groups.set(root,{faces:[],min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]});
    const group=groups.get(root);group.faces.push(face);
    for(const vertex of face)for(let axis=0;axis<3;axis++){
      group.min[axis]=Math.min(group.min[axis],vertex[axis]);group.max[axis]=Math.max(group.max[axis],vertex[axis]);
    }
  }
  return [...groups.values()];
}

/** Converts a hexadecimal sRGB surface color to the asset's linear vertex-color convention. */
function color(hex){
  return [0,1,2].map(axis=>{
    const value=parseInt(hex.slice(1+axis*2,3+axis*2),16)/255;
    return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;
  });
}

/** Triangulates a convex surface with outward normals, skipping only numerical zero-area triangles. */
function polygon(faces,points,tint,hint){
  for(let index=1;index+1<points.length;index++){
    const triangle=[points[0],points[index],points[index+1]];
    const a=triangle[1].map((value,axis)=>value-triangle[0][axis]);
    const b=triangle[2].map((value,axis)=>value-triangle[0][axis]);
    let normal=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const length=Math.hypot(...normal);
    if(length<1e-12)continue;
    normal=normal.map(value=>value/length);
    if(normal.reduce((sum,value,axis)=>sum+value*hint[axis],0)<0){
      [triangle[1],triangle[2]]=[triangle[2],triangle[1]];normal=normal.map(value=>-value);
    }
    faces.push(triangle.map(point=>[...point,...normal,0,0,...tint].map(value=>Math.round(value*1e8)/1e8)));
  }
}

const SEGMENTS={
  a:[.12,.87,.88,1],b:[.83,.52,.96,.90],c:[.83,.10,.96,.48],d:[.12,0,.88,.13],
  e:[.04,.10,.17,.48],f:[.04,.52,.17,.90],g:[.12,.435,.88,.565],
};
const GLYPHS={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg',
  '6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg','C':'adef','F':'aefg','E':'adefg','-':'g','=':'dg'};

/** Places compact printed seven-segment glyphs on a supplied surface, without adding a label slab. */
function glyph(emit,text,x,y,width,height,surface,tint){
  for(const [index,letter] of [...text].entries()){
    const start=x+index*width*1.30;
    const rectangles=letter==='.'?[[.04,0,.18,.14]]:(GLYPHS[letter]??'').split('').map(segment=>SEGMENTS[segment]);
    for(const [x0,y0,x1,y1] of rectangles)
      emit([[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([u,v])=>surface(start+u*width,y+v*height)),tint,surface.normal);
  }
}

/** Rebuilds the three original key banks with consistent caps, preserving their measured sloped seating planes. */
function keyboard(emit){
  const graphite=color('#52564f'),ivory=color('#c7c5ad'),green=color('#687e69'),red=color('#a36454');
  const ink=color('#d8d6bd'),darkInk=color('#3b3e37');
  const banks=[
    {x:-.0874,columns:2,step:.0219,y:-.1080,pitch:.0188,width:.0180,depth:.0157,plane:[.135868,0,.370192]},
    {x:-.0293,columns:3,step:.0205,y:-.1120,pitch:.0200,width:.0177,depth:.0165,plane:[.135916,.002347,.368454]},
    {x:.0488,columns:3,step:.0238,y:-.1120,pitch:.0220,width:.0190,depth:.0180,plane:[.135811,0,.365385]},
  ];
  const digits=[['0','00','.'],['1','2','3'],['4','5','6'],['7','8','9'],['C','F','-']];
  for(const [bankIndex,bank] of banks.entries())for(let row=0;row<5;row++)for(let column=0;column<bank.columns;column++){
    if(bankIndex===2 && column===2 && row===1)continue;
    const tall=bankIndex===2 && column===2 && row===0;
    const x=bank.x+column*bank.step,y=bank.y+row*bank.pitch+(tall?bank.pitch/2:0);
    const depth=bank.depth+(tall?bank.pitch:0);
    let tint=graphite;
    if(bankIndex===1)tint=ivory;
    if(bankIndex===2 && column===2)tint=row<2?red:green;
    const top=keycap(emit,x,y,bank.width,depth,bank.plane,tint);
    const text=bankIndex===1?digits[row][column]:bankIndex===0?String((row*2+column+1)%10):['=','-','C','F','E'][row];
    const width=.0037,height=.0062,start=x-(text.length===2?width*1.15:width*.5);
    glyph(emit,text,start,y-height/2,width,height,top,bankIndex===1?darkInk:ink);
  }
}

/** A closed, tapered cap sits just into the measured deck; its top follows the same plane. */
function keycap(emit,x,y,width,depth,plane,tint){
  const profile=[[-1,-.8],[-.8,-1],[.8,-1],[1,-.8],[1,.8],[.8,1],[-.8,1],[-1,.8]];
  const base=profile.map(([u,v])=>{
    const px=x+u*width/2,py=y+v*depth/2;
    return [px,py,plane[0]+plane[1]*px+plane[2]*py-.00035];
  });
  const rim=profile.map(([u,v])=>{
    const px=x+u*(width/2-.0011),py=y+v*(depth/2-.0011);
    return [px,py,plane[0]+plane[1]*px+plane[2]*py+.0049];
  });
  for(let edge=0;edge<profile.length;edge++){
    const next=(edge+1)%profile.length,normal=[base[next][1]-base[edge][1],base[edge][0]-base[next][0],0];
    emit([base[edge],base[next],rim[next],rim[edge]],tint.map(value=>value*.70),normal);
  }
  emit(base,tint.map(value=>value*.5),[0,0,-1]);emit(rim,tint,[0,0,1]);
  const surface=(px,py)=>[px,py,plane[0]+plane[1]*px+plane[2]*py+.00512];
  surface.normal=[-plane[1],-plane[2],1];
  return surface;
}

/** A short connected paper strip curls out from the retained printer slot, with printed receipt lines. */
function receiptPaper(emit){
  const paper=color('#ddd8bf'),back=color('#bbb6a2'),ink=color('#68695d');
  const path=[[.017,.150],[.007,.157],[-.008,.164],[-.022,.168],[-.035,.167],[-.048,.160]];
  const left=-.082,right=-.053;
  for(let row=0;row+1<path.length;row++){
    const [y0,z0]=path[row],[y1,z1]=path[row+1],normal=[0,z1-z0,y0-y1];
    const points=[[left,y0,z0],[right,y0,z0],[right,y1,z1],[left,y1,z1]];
    const underside=points.map(([x,y,z])=>[x,y,z-.0002]);
    emit(points,paper,normal);emit(underside,back,normal.map(value=>-value));
    emit([points[0],points[3],underside[3],underside[0]],back,[-1,0,0]);
    emit([points[1],points[2],underside[2],underside[1]],back,[1,0,0]);
    if(row===0)emit([points[0],points[1],underside[1],underside[0]],back,[0,1,0]);
    if(row===path.length-2)emit([points[3],points[2],underside[2],underside[3]],back,[0,-1,0]);
  }
  for(let row=0;row<7;row++){
    const y=-.011-row*.0045;
    let index=path.findIndex((point,i)=>i+1<path.length && point[0]>=y && path[i+1][0]<=y);
    if(index<0)index=path.length-2;
    const [y0,z0]=path[index],[y1,z1]=path[index+1];
    const surface=py=>z0+(py-y0)/(y1-y0)*(z1-z0)+.00018;
    const x0=left+.004,x1=row%3===0?right-.004:right-.010;
    emit([[x0,y,surface(y)],[x1,y,surface(y)],[x1,y+.00065,surface(y+.00065)],
      [x0,y+.00065,surface(y+.00065)]],ink,[0,0,1]);
  }
}

/** Samples the rear shell along +Y so the shallow customer display follows its real molded surface. */
function rearSurface(faces,x,z){
  let maximum=-Infinity;
  for(const [a,b,c] of faces){
    const determinant=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
    if(Math.abs(determinant)<1e-12)continue;
    const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/determinant;
    const v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/determinant;
    if(u<-.00001 || v<-.00001 || u+v>1.00001)continue;
    maximum=Math.max(maximum,u*a[1]+v*b[1]+(1-u-v)*c[1]);
  }
  if(!Number.isFinite(maximum))throw new Error('Customer display leaves the retained housing.');
  return maximum;
}

/** Adds a low-profile rear readout with real printed segments, not a freestanding monitor slab. */
function customerDisplay(emit,faces){
  const panel=(x0,x1,z0,z1,offset,tint)=>{
    for(let column=0;column<10;column++)for(let row=0;row<3;row++){
      const x=x0+(x1-x0)*column/10,nextX=x0+(x1-x0)*(column+1)/10;
      const z=z0+(z1-z0)*row/3,nextZ=z0+(z1-z0)*(row+1)/3;
      emit([[x,z],[nextX,z],[nextX,nextZ],[x,nextZ]].map(([px,pz])=>[px,rearSurface(faces,px,pz)+offset,pz]),tint,[0,1,0]);
    }
  };
  panel(-.025,.070,.118,.144,.00025,color('#4b4d42'));
  panel(-.022,.067,.121,.141,.00048,color('#182c27'));
  const screen=(u,z)=>[-u,rearSurface(faces,-u,z)+.00072,z];screen.normal=[0,1,0];
  glyph(emit,'12.80',-.048,.125,.008,.012,screen,color('#afc090'));
}

/** Prints a subdued readout onto the retained lower operator display, following its generated recess. */
function operatorReadout(emit,faces){
  const screen=(x,y)=>{
    let maximum=-Infinity;
    for(const [a,b,c] of faces){
      const determinant=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
      if(Math.abs(determinant)<1e-12)continue;
      const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/determinant;
      const v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/determinant;
      if(u<-.00001 || v<-.00001 || u+v>1.00001)continue;
      maximum=Math.max(maximum,u*a[2]+v*b[2]+(1-u-v)*c[2]);
    }
    if(!Number.isFinite(maximum))throw new Error('Operator readout leaves the retained display.');
    return [x,y,maximum+.00018];
  };
  screen.normal=[0,0,1];
  glyph(emit,'12.80',.035,.014,.0075,.010,screen,color('#8b9872'));
}
