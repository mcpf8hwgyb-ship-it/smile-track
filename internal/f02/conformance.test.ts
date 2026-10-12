import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { BufferGeometry, Float32BufferAttribute, MeshStandardMaterial, Vector3, Matrix3, Matrix4 } from 'three';
import { matrix, makeActor, applyMode } from './adapter.ts';
import { parseManifest, modes } from './contract.ts';
import type { Rows, Instance } from './contract.ts';
import { rawGLB } from './raw-glb.ts';
const rows:Rows=[[0,-1,0,7],[1,0,0,-3],[0,0,1,2],[0,0,0,1]];
const point=new Vector3(2,3,4);
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<=1e-11+1e-12*Math.abs(b),`${a} != ${b}`);
const hash=(b:ArrayBufferView|Uint8Array)=>createHash('sha256').update(new Uint8Array(b.buffer,b.byteOffset,b.byteLength)).digest('hex');
test('explicit storage conversion; transpose and double-transform negative controls',()=>{
 assert.deepEqual(point.clone().applyMatrix4(matrix(rows)).toArray(),[4,-1,6]);
 assert.notDeepEqual(point.clone().applyMatrix4(new Matrix4().fromArray(rows.flat())).toArray(),[4,-1,6]);
 assert.notDeepEqual(point.clone().applyMatrix4(new Matrix4().makeScale(.45,.45,.45)).applyMatrix4(matrix(rows)).toArray(),[4,-1,6]);
});
test('reflected actor shares untouched geometry, preserves parity and normal relation',()=>{
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3));g.setIndex([0,1,2]);
 const reflected:Rows=[[-1,0,0,4],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
 const i:Instance={id:'synthetic_B',sourceId:'synthetic',arch:'maxillary',orientation:'B',expectedParity:-1,candidate:reflected,display:reflected};
 const a=makeActor(g,i,new MeshStandardMaterial());const before=Array.from(g.getIndex()!.array);
 assert.equal(a.geometry,g);assert.equal(a.matrix.determinant(),-1);assert.equal(a.matrixAutoUpdate,false);
 const n=new Vector3(0,0,1).applyMatrix3(new Matrix3().getNormalMatrix(a.matrix));
 const p0=new Vector3().applyMatrix4(a.matrix),p1=new Vector3(1,0,0).applyMatrix4(a.matrix),p2=new Vector3(0,1,0).applyMatrix4(a.matrix);
 assert.equal(p1.sub(p0).cross(p2.sub(p0)).dot(n),-1); // original winding + reflection; no index rewrite
 a.visible=false;applyMode(a,i,modes[1]);assert.deepEqual(a.matrix.elements,matrix(reflected).elements);assert.deepEqual(Array.from(g.getIndex()!.array),before);
 assert.throws(()=>makeActor(g,{...i,expectedParity:1},new MeshStandardMaterial()),/parity/);
 g.dispose();a.material.dispose();
});
test('malformed GLB and invalid manifest fail closed',()=>{assert.throws(()=>rawGLB(new ArrayBuffer(20)));assert.throws(()=>parseManifest({}));});
const root=process.env.F02_DATA_DIR;
test('restricted frozen baseline: full arrays, all 32 maps/matrices, independent oracle', {skip:!root},()=>{
 const dir=resolve(root!);const m=parseManifest(JSON.parse(readFileSync(resolve(dir,'manifest.json'),'utf8')));
 type Frozen={slot_id:string;type_id:string;source_sha256:string;arch:string;orientation:string;source_local_to_candidate:Rows;source_local_to_display:Rows};
 const closure=JSON.parse(readFileSync(resolve(dir,'closure.json'),'utf8'));assert.deepEqual(m.scientificRegistry.statuses,closure.unchanged_inherited_scientific_statuses);assert.equal(m.scientificRegistry.inherited_16_review_flags.length,16);
 const frozen=JSON.parse(readFileSync(resolve(dir,'frozen-transforms.json'),'utf8')) as Frozen[];
 type G={positions:number;triangles:number;samples:{index:number;point:number[]}[]};
 const oracle=JSON.parse(readFileSync(resolve(dir,'oracle.json'),'utf8')) as Record<string, {geometry:G[]}|{candidate:number[][];display:number[][]}[]>;
 const decoded=new Map<string,ReturnType<typeof rawGLB>>();
 for(const s of m.sources){const raw=readFileSync(resolve(dir,'assets',s.id+'.glb'));assert.equal(hash(raw),s.sha256);const d=rawGLB(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));decoded.set(s.id,d);d.inherited.elements.forEach((v,k)=>close(v,matrix(s.inheritedNodeMatrix).elements[k]));assert.equal(d.geometries.length,s.primitives.length);
  d.geometries.forEach((g,k)=>{assert.equal(hash(g.getAttribute('position').array),s.primitives[k].positionSHA256);assert.equal(hash(g.getIndex()!.array),s.primitives[k].indexSHA256);assert.equal(g.getIndex()!.count,s.primitives[k].triangles*3);});
 }
 let tested=0,maxError=0;
 for(const i of m.instances){const f=frozen.find(f=>f.slot_id===i.id)!;assert.ok(f);assert.equal(i.sourceId,f.type_id);assert.equal(i.arch,f.arch);assert.equal(i.orientation,f.orientation);assert.equal(m.sources.find(s=>s.id===i.sourceId)!.sha256,f.source_sha256);assert.deepEqual(i.candidate,f.source_local_to_candidate);assert.deepEqual(i.display,f.source_local_to_display);
  const d=decoded.get(i.sourceId)!;const sr=oracle[i.sourceId] as {geometry:G[]};const ir=oracle[i.id] as {candidate:number[][];display:number[][]}[];
  for(const mode of modes){const r=mode===modes[0]?i.display:i.candidate;d.geometries.forEach((g,k)=>{const a=makeActor(g,i,new MeshStandardMaterial());applyMode(a,i,mode);a.updateMatrixWorld(true);assert.deepEqual(a.matrixWorld.elements,matrix(r).elements);assert.equal(Math.sign(a.matrixWorld.determinant()),i.expectedParity);const ps=g.getAttribute('position');
   for(let n=0;n<ps.count;n++){const xyz=[ps.getX(n),ps.getY(n),ps.getZ(n)];const actual=new Vector3(...xyz).applyMatrix4(a.matrixWorld).toArray();for(let axis=0;axis<3;axis++){const expected=r[axis][0]*xyz[0]+r[axis][1]*xyz[1]+r[axis][2]*xyz[2]+r[axis][3];close(actual[axis],expected);maxError=Math.max(maxError,Math.abs(actual[axis]-expected));}tested++;}
   sr.geometry[k].samples.forEach((p,n)=>{const actual=new Vector3(...p.point).applyMatrix4(a.matrixWorld).toArray();actual.forEach((v,axis)=>close(v,ir[k][mode===modes[0]?'display':'candidate'][n][axis]));});
   // Both deliberate errors must disagree with the independent scientific result for each instance.
   const p=sr.geometry[k].samples[0].point,correct=new Vector3(...p).applyMatrix4(matrix(r));
   assert.ok(correct.distanceTo(new Vector3(...p).applyMatrix4(d.inherited).applyMatrix4(matrix(r)))>1e-6);
   assert.ok(correct.distanceTo(new Vector3(...p).applyMatrix4(new Matrix4().fromArray(r.flat())))>1e-6);
   a.material.dispose();
  });}
 }
 assert.equal(m.instances.length,32);assert.equal(m.sources.length,16);
 for(const d of decoded.values())for(const g of d.geometries)g.dispose();
 console.log(JSON.stringify({coordinateEvaluations:tested,maxError,oracleTolerance:'abs 1e-11 + rel 1e-12',matrices:'exact JSON numeric equality',sources:16,instances:32}));
});
