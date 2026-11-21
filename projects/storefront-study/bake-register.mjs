import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {repairRegister} from './register-details.mjs';

const source=process.argv[2]??'projects/storefront-study/register/source/model.glb';
const assetPath='src/dressing/kowloon/shop/assets/shop-register.json';
const library='src/materials/library';
const evidence='projects/storefront-study/register';
const envelope=[.30,.28,.27],textureSize=1024;
const bytes=await readFile(source);
if(bytes.readUInt32LE(0)!==0x46546c67 || bytes.readUInt32LE(4)!==2)throw new Error('Expected glTF 2 binary.');
const jsonLength=bytes.readUInt32LE(12),document=JSON.parse(bytes.subarray(20,20+jsonLength));
const binaryStart=20+jsonLength+8,binary=bytes.subarray(binaryStart);
if(document.nodes.length!==1 || document.meshes.length!==1 || document.meshes[0].primitives.length!==1)
  throw new Error('This bake expects the inspected single-node, single-primitive source.');
const node=document.nodes[0];
if(node.matrix || node.translation || node.rotation || node.scale)throw new Error('Unexpected source node transform.');
const primitive=document.meshes[0].primitives[0];
if(primitive.mode!==4)throw new Error('Expected indexed triangles.');

/** Reads tightly packed or interleaved scalar/float attributes without changing source ordering. */
function accessor(index){
  const value=document.accessors[index],view=document.bufferViews[value.bufferView];
  if(value.sparse || value.normalized)throw new Error('Unsupported sparse/normalized source accessor.');
  const width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[value.type];
  const componentBytes={5123:2,5125:4,5126:4}[value.componentType];
  if(!width || !componentBytes)throw new Error('Unsupported accessor component type.');
  const read={5123:'readUInt16LE',5125:'readUInt32LE',5126:'readFloatLE'}[value.componentType];
  const offset=(view.byteOffset??0)+(value.byteOffset??0),stride=view.byteStride??width*componentBytes;
  return Array.from({length:value.count},(_,row)=>Array.from({length:width},(_,column)=>
    binary[read](offset+row*stride+column*componentBytes)));
}

/** Returns an embedded image referenced by a glTF texture index. */
function textureBytes(index){
  const image=document.images[document.textures[index].source],view=document.bufferViews[image.bufferView];
  if(!view)throw new Error('Expected embedded material image.');
  return binary.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength);
}

/** Converts an sRGB byte to a linear fallback color used only without the registered material. */
function linear(byte){
  const value=byte/255;
  return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;
}

const material=document.materials[primitive.material],pbr=material.pbrMetallicRoughness;
const maps={color:textureBytes(pbr.baseColorTexture.index),
  properties:textureBytes(pbr.metallicRoughnessTexture.index),normal:textureBytes(material.normalTexture.index)};
const sourceImages={};
await mkdir(evidence,{recursive:true});
await mkdir(join(evidence,'textures'),{recursive:true});
await mkdir(dirname(assetPath),{recursive:true});
for(const [channel,input] of Object.entries(maps)){
  const metadata=await sharp(input).metadata();
  sourceImages[channel]={width:metadata.width,height:metadata.height,sha256:createHash('sha256').update(input).digest('hex')};
  let output;
  if(channel==='normal'){
    const {data,info}=await sharp(input).removeAlpha().resize(textureSize,textureSize).raw().toBuffer({resolveWithObject:true});
    for(let pixel=0;pixel<data.length;pixel+=info.channels){
      const vector=[data[pixel],data[pixel+1],data[pixel+2]].map(value=>value/127.5-1);
      // Domain V is reversed while the exporter preserves its tangent frame: compensate the imported bitangent.
      vector[1]*=-1;
      const length=Math.hypot(...vector)||1;
      for(let axis=0;axis<3;axis++)data[pixel+axis]=Math.round((vector[axis]/length+1)*127.5);
    }
    output=await sharp(data,{raw:info}).png().toBuffer();
  }else output=await sharp(input).removeAlpha().resize(textureSize,textureSize).png().toBuffer();
  const suffix=channel==='color'?'':`-${channel}`;
  const filename=`shop-register${suffix}.png`;
  await writeFile(join(library,filename),output);
  await writeFile(join(evidence,'textures',filename),output);
}

const positions=accessor(primitive.attributes.POSITION),normals=accessor(primitive.attributes.NORMAL);
const uv=accessor(primitive.attributes.TEXCOORD_0),indices=accessor(primitive.indices).flat();
const minimum=[0,1,2].map(axis=>Math.min(...positions.map(point=>point[axis])));
const maximum=[0,1,2].map(axis=>Math.max(...positions.map(point=>point[axis])));
const rawSize=[maximum[2]-minimum[2],maximum[0]-minimum[0],maximum[1]-minimum[1]];
const scale=Math.min(...rawSize.map((value,axis)=>envelope[axis]/value));
const size=rawSize.map(value=>value*scale);
const center=[(minimum[0]+maximum[0])/2,(minimum[2]+maximum[2])/2];
const {data:color,info:colorInfo}=await sharp(maps.color).removeAlpha().raw().toBuffer({resolveWithObject:true});
const factor=pbr.baseColorFactor??[1,1,1,1];
const round=value=>Math.round(value*1e8)/1e8;
const vertices=positions.map(([x,y,z],index)=>{
  const [nx,ny,nz]=normals[index],length=Math.hypot(nx,ny,nz);
  if(length<1e-8)throw new Error('Zero source normal.');
  const [u,v]=uv[index],px=Math.max(0,Math.min(colorInfo.width-1,Math.round(u*(colorInfo.width-1))));
  const py=Math.max(0,Math.min(colorInfo.height-1,Math.round(v*(colorInfo.height-1))));
  const offset=(py*colorInfo.width+px)*colorInfo.channels;
  return [(-z+center[1])*scale,(-x+center[0])*scale,(y-minimum[1])*scale,
    -nz/length,-nx/length,ny/length,u,1-v,
    ...[0,1,2].map(axis=>linear(color[offset+axis])*factor[axis])].map(round);
});
const faces=[];
let degenerate=0,opposedNormals=0,repairedCornerNormals=0,maximumUvRoundtripError=0;
for(let corner=0;corner<indices.length;corner+=3){
  const face=indices.slice(corner,corner+3).map(index=>[...vertices[index]]);
  const [a,b,c]=face;
  const ab=b.slice(0,3).map((value,axis)=>value-a[axis]),ac=c.slice(0,3).map((value,axis)=>value-a[axis]);
  const cross=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
  const areaScale=Math.hypot(...cross);
  if(areaScale<1e-12)degenerate++;
  const normal=[0,1,2].map(axis=>a[axis+3]+b[axis+3]+c[axis+3]);
  if(cross.reduce((sum,value,axis)=>sum+value*normal[axis],0)<0)opposedNormals++;
  if(areaScale>1e-12)for(const vertex of face){
    const facing=cross.reduce((sum,value,axis)=>sum+value/areaScale*vertex[axis+3],0);
    if(facing<.15){
      for(let axis=0;axis<3;axis++)vertex[axis+3]=round(cross[axis]/areaScale);
      repairedCornerNormals++;
    }
  }
  faces.push(face);
}
for(let index=0;index<vertices.length;index++){
  maximumUvRoundtripError=Math.max(maximumUvRoundtripError,Math.abs(vertices[index][6]-uv[index][0]),
    Math.abs(1-vertices[index][7]-uv[index][1]));
}
if(!vertices.flat().every(Number.isFinite) || degenerate)throw new Error(`Invalid baked geometry: ${degenerate} degenerate triangles.`);
const repaired=repairRegister(faces);
const asset={size:size.map(round),faces:repaired.faces,paintedFaces:repaired.paintedFaces};
await writeFile(assetPath,JSON.stringify(asset));
const task=JSON.parse(await readFile(join(dirname(source),'task.json'),'utf8'));
const provenance={source,sourceSha256:createHash('sha256').update(bytes).digest('hex'),
  task:{id:task.task_id,model:task.input?.model_version,creditsConsumed:task.credits_consumed},
  triangleCount:asset.faces.length+asset.paintedFaces.length,sourceTriangleCount:faces.length,
  sourceVertexCount:positions.length,size:asset.size,uniformScale:scale,
  origin:'Bottom centered in XY; Z=0 at lowest source vertex; meters, right-handed Z-up.',
  axes:'Source glTF [x,y,z] -> domain [-z,-x,y]; inspected source +X/front becomes domain -Y. Proper rotation, determinant +1.',
  uv:'Source glTF [u,v] -> domain [u,1-v]; export returns [u,v]. Images keep original orientation.',
  maps:'RGB albedo sRGB; properties RGB preserves original ORM channels (G roughness, B metallic). Normal green is inverted locally to compensate the imported domain-V tangent reversal.',
  normalResampling:'Resized vectors have green inverted and are renormalized; no global exporter or source image is modified.',
  edit:'Retained source positions/triangles/UVs unchanged, uniformly fitted. Corner normals pointing nearly tangent or backward to their face (dot < .15) use the geometric face normal. Detached keys/receipt replaced by authored geometry; a conforming rear display is added.',
  repairs:repaired.repairs,
  sourceImages,outputTextureSize:textureSize,maximumUvRoundtripError,sourceOpposedMeanNormals:opposedNormals,repairedCornerNormals,
  materialFactors:{baseColor:factor,roughness:pbr.roughnessFactor,metallic:pbr.metallicFactor,normalScale:material.normalTexture.scale}};
await writeFile(join(evidence,'bake.json'),JSON.stringify(provenance,null,2));
console.log(JSON.stringify({assetPath,triangles:asset.faces.length+asset.paintedFaces.length,
  retained:asset.faces.length,authored:asset.paintedFaces.length,size:asset.size,maximumUvRoundtripError,
  sourceOpposedMeanNormals:opposedNormals,repairedCornerNormals}));
