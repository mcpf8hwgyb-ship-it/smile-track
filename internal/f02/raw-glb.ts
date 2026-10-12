import { BufferAttribute, BufferGeometry, Matrix4, Quaternion, Vector3 } from 'three';
interface Accessor {bufferView:number;byteOffset?:number;componentType:number;count:number;type:string;normalized?:boolean;sparse?:unknown}
interface View {buffer:number;byteOffset?:number;byteLength:number;byteStride?:number}
interface Primitive {attributes:Record<string,number>;indices:number;mode?:number;targets?:unknown;extensions?:unknown;material?:number}
interface Node {matrix?:number[];translation?:number[];rotation?:number[];scale?:number[];children?:number[];mesh?:number;skin?:number;weights?:unknown}
interface Doc {asset:{version:string};buffers:{uri?:string;byteLength:number}[];bufferViews:View[];accessors:Accessor[];meshes:{primitives:Primitive[]}[];nodes:Node[];scenes:{nodes:number[]}[];scene:number;extensionsRequired?:string[];images?:{uri?:string}[]}
export function rawGLB(raw:ArrayBuffer):{geometries:BufferGeometry[];inherited:Matrix4;document:Doc} {
 const dv=new DataView(raw);
 if(raw.byteLength<20||dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2||dv.getUint32(8,true)!==raw.byteLength)throw new Error('Invalid GLB header');
 let doc:Doc|undefined,bin:ArrayBuffer|undefined;
 for(let offset=12;offset<raw.byteLength;){if(offset+8>raw.byteLength)throw new Error('Truncated GLB');const size=dv.getUint32(offset,true),kind=dv.getUint32(offset+4,true);offset+=8;if(offset+size>raw.byteLength)throw new Error('Truncated GLB chunk');const b=raw.slice(offset,offset+size);if(kind===0x4e4f534a)doc=JSON.parse(new TextDecoder().decode(b)) as Doc;else if(kind===0x004e4942)bin=b;else throw new Error('Unsupported GLB chunk');offset+=size;}
 if(!doc||!bin||doc.asset.version!=='2.0'||doc.buffers.length!==1||doc.buffers[0].uri||doc.extensionsRequired?.length||doc.images?.some(i=>i.uri))throw new Error('Unsupported/external GLB representation');
 const j=doc,binary=bin;
 function accessor(id:number):BufferAttribute {
  const ac=j.accessors[id];if(!ac||ac.sparse)throw new Error('Unsupported accessor');
  const width:Record<string,number>={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};const w=width[ac.type];const sizes:Record<number,number>={5121:1,5123:2,5125:4,5126:4};const size=sizes[ac.componentType];const v=j.bufferViews[ac.bufferView];
  if(!w||!size||!v||v.buffer!==0||!Number.isSafeInteger(ac.count)||ac.count<=0)throw new Error('Invalid accessor');
  const start=(v.byteOffset??0)+(ac.byteOffset??0),stride=v.byteStride??size*w,end=start+(ac.count-1)*stride+w*size;
  if(stride<size*w||start<0||end>(v.byteOffset??0)+v.byteLength||end>binary.byteLength)throw new Error('Accessor out of bounds');
  const values=ac.componentType===5126?new Float32Array(ac.count*w):new Uint32Array(ac.count*w);const data=new DataView(binary);
  for(let i=0;i<ac.count;i++)for(let k=0;k<w;k++){const o=start+i*stride+k*size;const n=ac.componentType===5126?data.getFloat32(o,true):size===4?data.getUint32(o,true):size===2?data.getUint16(o,true):data.getUint8(o);if(!Number.isFinite(n))throw new Error('Nonfinite attribute');values[i*w+k]=n;}
  if(ac.normalized)throw new Error('Normalized attributes need separately reviewed handling');
  return new BufferAttribute(values,w);
 }
 const occurrences:{mesh:number;world:Matrix4}[]=[];const seen=new Set<number>();
 function walk(id:number,parent:Matrix4){if(seen.has(id))throw new Error('Repeated/cyclic node');seen.add(id);const n=j.nodes[id];if(!n||n.skin!==undefined||n.weights)throw new Error('Unsupported node');if(n.matrix&&(n.translation||n.rotation||n.scale))throw new Error('Matrix/TRS ambiguity');const local=n.matrix?new Matrix4().fromArray(n.matrix):new Matrix4().compose(new Vector3().fromArray(n.translation??[0,0,0]),new Quaternion().fromArray(n.rotation??[0,0,0,1]),new Vector3().fromArray(n.scale??[1,1,1]));const world=parent.clone().multiply(local);if(n.mesh!==undefined)occurrences.push({mesh:n.mesh,world});for(const child of n.children??[])walk(child,world);}
 if(!Number.isInteger(j.scene)||!j.scenes[j.scene])throw new Error('Default scene required');
 for(const root of j.scenes[j.scene].nodes)walk(root,new Matrix4());if(occurrences.length!==1)throw new Error('Expected exactly one frozen mesh occurrence');
 const geometries:BufferGeometry[]=[];
 try {
  for(const p of j.meshes[occurrences[0].mesh].primitives){if((p.mode??4)!==4||p.targets||p.extensions||p.indices===undefined)throw new Error('Unsupported primitive');const g=new BufferGeometry();geometries.push(g);const names:Record<string,string>={POSITION:'position',NORMAL:'normal',TANGENT:'tangent',TEXCOORD_0:'uv',COLOR_0:'color'};for(const [name,id] of Object.entries(p.attributes)){if(!names[name])throw new Error('Unsupported attribute');g.setAttribute(names[name],accessor(id));}g.setIndex(accessor(p.indices));const position=g.getAttribute('position');const index=g.getIndex()!;if(!position||position.itemSize!==3||index.itemSize!==1||index.count%3||j.accessors[p.indices].componentType===5126)throw new Error('Invalid triangle representation');for(const i of index.array)if(i>=position.count)throw new Error('Index out of range');g.computeBoundingSphere();}
  return {geometries,inherited:occurrences[0].world,document:j};
 }catch(error){for(const g of geometries)g.dispose();throw error;}
}
