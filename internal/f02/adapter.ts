import { Matrix4, Mesh, DoubleSide, MeshStandardMaterial, BufferGeometry } from 'three';
import type { Instance, Mode, Rows } from './contract.ts';
// Explicit row -> column storage conversion. No geometric basis conversion.
export function matrix(rows:Rows):Matrix4 {
 const columnMajor:number[]=[];
 for(let col=0;col<4;col++)for(let row=0;row<4;row++)columnMajor.push(rows[row][col]);
 return new Matrix4().fromArray(columnMajor);
}
export function placedRows(instance:Instance,mode:Mode):Rows {return mode==='COMBINED_EXPLODED_NONOCCLUSAL'?instance.display:instance.candidate;}
export function visibleInMode(i:Instance,mode:Mode):boolean{return mode==='COMBINED_EXPLODED_NONOCCLUSAL'||mode.startsWith(i.arch.toUpperCase());}
export function makeActor(geometry:BufferGeometry,instance:Instance,material:MeshStandardMaterial):Mesh<BufferGeometry,MeshStandardMaterial> {
 // Separate objects share original arrays. No InstancedMesh, baking, winding changes, or node parenting.
 material.side=DoubleSide;
 const actor=new Mesh(geometry,material);actor.matrixAutoUpdate=false;
 actor.name=instance.id;actor.userData.instanceId=instance.id;
 applyMode(actor,instance,'COMBINED_EXPLODED_NONOCCLUSAL');return actor;
}
export function applyMode(actor:Mesh,instance:Instance,mode:Mode):void {
 const m=matrix(placedRows(instance,mode));
 if(Math.sign(m.determinant())!==instance.expectedParity)throw new Error('Reflection parity mismatch');
 actor.matrix.copy(m);actor.matrixWorldNeedsUpdate=true;actor.visible=visibleInMode(instance,mode);
}
