import * as THREE from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';

/** Normal/depth evidence follows visible opaque geometry, including each cutaway material's clipping planes. */
export class ShopOcclusion extends GTAOPass {
  constructor(...args){super(...args);this.receivers=new Map();}

  /** Uses per-material normal receivers so transparent glazing and hidden cutaway ceilings cannot occlude props. */
  _renderOverride(renderer,overrideMaterial,renderTarget,clearColor,clearAlpha){
    const bindings=[],hidden=[],previousOverride=this.scene.overrideMaterial;
    const background=renderer.getClearColor(new THREE.Color()),alpha=renderer.getClearAlpha(),autoClear=renderer.autoClear;
    this.scene.traverse(object=>{
      if(!object.isMesh || !object.visible)return;
      const original=object.material, materials=Array.isArray(original)?original:[original];
      if(materials.some(material=>material.transparent || !material.depthTest)){
        hidden.push(object);object.visible=false;return;
      }
      const replacements=materials.map(source=>{
        let normal=this.receivers.get(source);
        if(!normal){normal=new THREE.MeshNormalMaterial();this.receivers.set(source,normal);}
        normal.side=source.side;
        normal.clippingPlanes=source.clippingPlanes;
        normal.clipIntersection=source.clipIntersection;
        return normal;
      });
      bindings.push([object,original]);object.material=Array.isArray(original)?replacements:replacements[0];
    });
    try{
      renderer.setRenderTarget(renderTarget);renderer.autoClear=false;
      renderer.setClearColor(clearColor,clearAlpha);renderer.clear();
      this.scene.overrideMaterial=null;renderer.render(this.scene,this.camera);
    }finally{
      for(const [object,material] of bindings)object.material=material;
      for(const object of hidden)object.visible=true;
      this.scene.overrideMaterial=previousOverride;
      renderer.autoClear=autoClear;renderer.setClearColor(background,alpha);
    }
  }

  /** Releases receivers between shop loads as well as when disposing the complete post stack. */
  clearReceivers(){for(const material of this.receivers.values())material.dispose();this.receivers.clear();}
  dispose(){this.clearReceivers();super.dispose();}
}
