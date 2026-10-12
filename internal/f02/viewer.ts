import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { parseManifest, modes } from './contract.ts';
import type { Manifest, Mode } from './contract.ts';
import { makeActor, applyMode, visibleInMode } from './adapter.ts';
import { rawGLB } from './raw-glb.ts';
export type Presentation='solid'|'original';
export class Viewer {
 readonly renderer:THREE.WebGLRenderer;
 readonly scene=new THREE.Scene();
 readonly camera=new THREE.OrthographicCamera(-10,10,10,-10,.01,1000);
 readonly controls:OrbitControls;
 manifest?:Manifest;
 actors:THREE.Mesh[]=[];
 geometries:THREE.BufferGeometry[]=[];
 materials=new Set<THREE.Material>();
 textures=new Set<THREE.Texture>();
 mode:Mode=modes[0];
 metrics:Record<string,unknown>={};
 private frame=0;private stopped=false;private disposed=false;private ready=false;
 private times:number[]=[];private last=0;private observer:ResizeObserver;
 readonly abort=new AbortController();
 constructor(readonly canvas:HTMLCanvasElement){
  const context=canvas.getContext('webgl2',{antialias:false});if(!context)throw new Error('WEBGL2_UNAVAILABLE');
  this.renderer=new THREE.WebGLRenderer({canvas,context,antialias:false});this.renderer.setPixelRatio(1);this.scene.background=new THREE.Color('#f5f5f2');this.camera.up.set(0,0,1);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=false;
  this.scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(10,-10,20);this.scene.add(light);
  canvas.addEventListener('webglcontextlost',this.contextLost);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
 }
 private contextLost=()=>{if(!this.disposed){this.metrics.contextLost=true;this.stopped=true;this.abort.abort();cancelAnimationFrame(this.frame);}};
 private resize(){const w=Math.max(1,this.canvas.clientWidth),h=Math.max(1,this.canvas.clientHeight);this.renderer.setSize(w,h,false);const scale=this.camera.top;this.camera.left=-scale*w/h;this.camera.right=scale*w/h;this.camera.updateProjectionMatrix();}
 private async file(path:string){const r=await fetch(new URL(path,window.location.href),{signal:this.abort.signal});if(!r.ok)throw new Error(`ASSET_LOAD_FAILED ${r.status}`);return r;}
 async load(presentation:Presentation){
  const start=performance.now();const m=parseManifest(await (await this.file('manifest.json')).json());this.manifest=m;
  let bytes=0,decodeMs=0,materialsMs=0;
  try {
   for(const s of m.sources){
    const raw=await (await this.file(`assets/${s.id}.glb`)).arrayBuffer();bytes+=raw.byteLength;
    const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',raw)),b=>b.toString(16).padStart(2,'0')).join('');if(digest!==s.sha256)throw new Error('ASSET_HASH_MISMATCH');
    const t=performance.now(),d=rawGLB(raw);decodeMs+=performance.now()-t;this.geometries.push(...d.geometries);
    const originals:THREE.MeshStandardMaterial[]=[];
    if(presentation==='original'){
     const manager=new THREE.LoadingManager();manager.setURLModifier(url=>{if(!url.startsWith('blob:')&&!url.startsWith('data:'))throw new Error('External resources forbidden');return url;});
     const t=performance.now(),gltf=await new GLTFLoader(manager).parseAsync(raw,'');
     // GLTF scene transforms are never used. Only original materials are retained for this comparison.
     gltf.scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();for(const material of Array.isArray(object.material)?object.material:[object.material]){originals.push(material as THREE.MeshStandardMaterial);this.materials.add(material);for(const v of Object.values(material))if(v instanceof THREE.Texture)this.textures.add(v);}}});
     materialsMs+=performance.now()-t;
     if(this.textures.size < m.sources.slice(0,m.sources.indexOf(s)+1).reduce((n,s)=>n+s.images.length,0))throw new Error('ORIGINAL_TEXTURE_DECODE_FAILED');
     if(originals.length!==d.geometries.length)throw new Error('Original material mapping mismatch');
    }
    if(this.abort.signal.aborted)throw new Error('LOAD_ABORTED');
    for(const i of m.instances.filter(i=>i.sourceId===s.id)){
     const solid=new THREE.MeshStandardMaterial({color:i.orientation==='A'?'#466d93':'#a06e46',flatShading:true,roughness:1,metalness:0,side:THREE.DoubleSide});
     if(presentation==='solid')this.materials.add(solid);else solid.dispose();
     d.geometries.forEach((g,k)=>{const actor=makeActor(g,i,presentation==='solid'?solid:originals[k]);this.actors.push(actor);this.scene.add(actor);});
    }
    // Serial upload gives context-loss/error a chance to stop the experiment.
    this.setMode(this.mode);this.renderer.render(this.scene,this.camera);
    await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    if(this.stopped||this.renderer.getContext().isContextLost())throw new Error('WEBGL_CONTEXT_LOST');
   }
   this.renderer.render(this.scene,this.camera);this.renderer.getContext().finish();
   const gl=this.renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
   this.metrics={presentation,sourceBytes:bytes,uniqueGeometries:this.geometries.length,renderedInstances:this.actors.length,geometryDecodeMs:decodeMs,originalMaterialParseDecodeMs:materialsMs,firstUsableFrameMs:performance.now()-start,renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):'UNAVAILABLE',maxTextureSize:gl.getParameter(gl.MAX_TEXTURE_SIZE),contextLost:false,webglError:gl.getError(),gpuMemoryBytes:'UNAVAILABLE',browserMemory:this.memory(),sourceTextureObjects:this.textures.size,rendererInfo:structuredClone(this.renderer.info.memory),triangles:this.renderer.info.render.triangles,drawCalls:this.renderer.info.render.calls};
   this.ready=true;this.tick();
  }catch(e){this.dispose();throw e;}
 }
 private memory(){const p=performance as Performance & {memory?:{usedJSHeapSize:number;totalJSHeapSize:number;jsHeapSizeLimit:number}};return p.memory?{usedJSHeapSize:p.memory.usedJSHeapSize,totalJSHeapSize:p.memory.totalJSHeapSize,jsHeapSizeLimit:p.memory.jsHeapSizeLimit,scope:'Chromium JS heap only; excludes GPU and most decoded images'}:'UNAVAILABLE';}
 private tick=()=>{if(this.stopped)return;const now=performance.now();if(this.last)this.times.push(now-this.last);if(this.times.length>300)this.times.shift();this.last=now;this.controls.update();this.renderer.render(this.scene,this.camera);this.frame=requestAnimationFrame(this.tick);};
 setMode(mode:Mode){if(!this.manifest)return;this.mode=mode;for(const a of this.actors){const i=this.manifest.instances.find(i=>i.id===a.name)!;applyMode(a,i,mode);}const b=this.manifest.bounds[mode],c=new THREE.Vector3(...b.C);this.camera.position.copy(c).add(new THREE.Vector3(1,-1,1).normalize().multiplyScalar(3*b.D));this.camera.top=.65*b.D;this.camera.bottom=-.65*b.D;this.controls.target.copy(c);this.resize();this.controls.update();}
 isolate(id:string){if(!this.manifest)return;for(const a of this.actors){const i=this.manifest.instances.find(i=>i.id===a.name)!;a.visible=visibleInMode(i,this.mode)&&(!id||id===a.name);}}
 sample(){const sorted=[...this.times].sort((a,b)=>a-b);return {...this.metrics,ready:this.ready,frameIntervalMedianMs:sorted[Math.floor(sorted.length/2)]??null,frameIntervalP95Ms:sorted[Math.floor(sorted.length*.95)]??null,frameSamples:sorted.length,matrices:this.actors.map(a=>({id:a.name,elements:a.matrix.elements,visible:a.visible})),browserMemory:this.memory(),webglError:this.renderer.getContext().getError()};}
 dispose(){const already=this.disposed;this.disposed=true;this.stopped=true;this.abort.abort();cancelAnimationFrame(this.frame);this.observer.disconnect();this.controls.dispose();this.canvas.removeEventListener('webglcontextlost',this.contextLost);
  for(const a of this.actors)this.scene.remove(a);for(const g of this.geometries)g.dispose();for(const m of this.materials)m.dispose();const images=new Set<ImageBitmap>();for(const t of this.textures){t.dispose();const image=t.image as {close?:()=>void}|undefined;if(typeof image?.close==='function')images.add(image as ImageBitmap);}for(const image of images)image.close();
  this.actors=[];this.geometries=[];this.materials.clear();this.textures.clear();
  const afterDisposal=structuredClone(this.renderer.info.memory);
  if(!already&&!this.renderer.getContext().isContextLost())this.renderer.render(this.scene,this.camera);
  this.metrics.release={afterDisposal,rendererMemory:structuredClone(this.renderer.info.memory),actorReferences:0,geometryReferences:0,materialReferences:0,textureReferences:0,imagesClosed:images.size};if(!already)this.renderer.dispose();this.ready=false;
 }
}
