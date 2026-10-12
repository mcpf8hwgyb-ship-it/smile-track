"""Read-only archive verification and restricted local metadata preparation (Python + numpy)."""
import argparse, ast, hashlib, json, struct, zipfile
from pathlib import Path
import numpy as np

PINS = {
 'original': 'a473b9850447295136a6f4abce952836728ee19053b83f56df1da001a8e9cafa',
 'scene': '5276e4be6ce01bcbcf92996192dd76339e768026dec49f024548f4a9ac1231c0',
 'evidence': 'f1f187092a1ca23697abc4ba77f3adfe912665bfe1a571161f166ad40e736252',
 'closure': '418f9978a5abc32e9fca6e1df918ce2b7029464a62250bfb464e602f774ebb10',
}
def sha(b): return hashlib.sha256(b).hexdigest()
def dump(p, d): p.write_text(json.dumps(d, indent=2, allow_nan=False)+'\n')
def verified(path, expected):
 raw=path.read_bytes(); assert sha(raw)==expected, f'Archive identity mismatch: {path.name}'
 z=zipfile.ZipFile(path); assert z.testzip() is None
 names=z.namelist(); assert len(names)==len(set(names))
 assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in names)
 manifest=next(n for n in names if n.endswith('/SHA256SUMS.txt') or n.endswith('/HANDOFF_SHA256SUMS.txt'))
 root=manifest.rsplit('/',1)[0]+'/'
 entries={}
 for line in z.read(manifest).decode().splitlines():
  if not line.strip(): continue
  h, rel=line.split(None,1); rel=rel.lstrip('*'); name=root+rel
  if name not in names and rel in names: name=rel
  assert name not in entries and sha(z.read(name))==h, f'Member integrity: {name}'
  entries[name]=h
 assert set(entries)=={n for n in names if not n.endswith('/') and n!=manifest}, 'Unmanifested members'
 return z,root,{'filename':path.name,'sha256':sha(raw),'bytes':len(raw),'manifestEntries':len(entries),'crc':'PASS'}
def main():
 ap=argparse.ArgumentParser();[ap.add_argument('--'+k,type=Path,required=True) for k in PINS];ap.add_argument('--out',type=Path,required=True);a=ap.parse_args()
 out=a.out.resolve(); repo=Path(__file__).resolve().parents[2]
 assert not out.is_relative_to(repo), 'Controlled data must remain outside repository'
 packs={k:verified(getattr(a,k),v) for k,v in PINS.items()}
 scene,sr,_=packs['scene']; evidence,er,_=packs['evidence']; closure,cr,_=packs['closure']; original,orr,_=packs['original']
 frozen=json.loads(scene.read(sr+'scene_manifest.json')); transforms=json.loads(scene.read(sr+'stage09c_06_transforms_32.json')); decision=json.loads(closure.read(cr+'stage09c_closure_baseline.json')); limits=json.loads(scene.read(sr+'scientific_limitations.json'))
 assert frozen['candidate']==decision['accepted_candidate']=='OUTWARD_PROVISIONAL_V1'
 assert decision['baseline_freeze']['scene_zip_sha256']==PINS['scene'] and decision['baseline_freeze']['evidence_zip_sha256']==PINS['evidence']
 assert frozen['instances']==transforms
 for name in ['scene_manifest.json','scientific_limitations.json','stage09c_06_transforms_32.json','attribution_records.json','review_triggers.json']:
  assert scene.read(sr+name)==evidence.read(er+'scene_metadata/'+name), name
 assert limits['statuses']==decision['unchanged_inherited_scientific_statuses'] and len(limits['statuses'])==15
 assert len(limits['inherited_16_review_flags'])==16
 assert sha(scene.read(sr+'scientific_limitations.json'))==decision['baseline_freeze']['scientific_limitations_sha256']
 # Import only the two reviewed frozen decoder functions for an independent numeric oracle.
 code=scene.read(sr+'accepted_decoder.py').decode(); assert sha(code.encode())==frozen['decoder_sha256']
 tree=ast.parse(code); module=ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['node_matrix','decode']],type_ignores=[])
 ns={'np':np,'struct':struct,'json':json};exec(compile(module,'frozen_decoder','exec'),ns)
 out.mkdir(parents=True,exist_ok=True); (out/'assets').mkdir(exist_ok=True)
 sources=[];refs={};image_bytes=0;triangles=0;vertices=0;image_count=0
 for s in frozen['sources']:
  b=scene.read(sr+s['path']); assert sha(b)==s['source_sha256']
  assert b==original.read(orr+'01_DUNDEE_ORIGINAL_16/'+s['original_filename'])
  prims,M,_=ns['decode'](b); assert np.array_equal(M,np.array(s['original_scene_M']))
  assert len(prims)==len(s['primitives']); geometry=[]
  for i,(p,f,desc) in enumerate(prims):
   assert desc==s['primitives'][i]
   ids=[v for c in s['components'][i]['components'] for v in c['_ids']]; assert sorted(ids)==list(range(len(f)))
   geometry.append({'positionSHA256':sha(p.astype('<f4').tobytes()),'indexSHA256':sha(f.astype('<u4').tobytes()),'positions':len(p),'triangles':len(f),'components':len(s['components'][i]['components']),'samples':[{'index':int(n),'point':p[n].tolist()} for n in sorted(set([0,len(p)//3,len(p)//2,len(p)-1]))]})
   vertices+=len(p);triangles+=len(f)
  j=json.loads(b[20:20+struct.unpack_from('<I',b,12)[0]]);off=20+struct.unpack_from('<I',b,12)[0]+8;images=[]
  for image in j.get('images',[]):
   assert image.get('mimeType')=='image/png' and 'uri' not in image
   view=j['bufferViews'][image['bufferView']];start=off+view.get('byteOffset',0);png=b[start:start+view['byteLength']];assert png[:8]==b'\x89PNG\r\n\x1a\n';w,h=struct.unpack_from('>II',png,16);images.append({'width':w,'height':h,'compressedBytes':len(png)});image_bytes+=w*h*4;image_count+=1
  sources.append({'id':s['type_id'],'originalFilename':s['original_filename'],'originalReference':'01_DUNDEE_ORIGINAL_16/'+s['original_filename'],'sha256':s['source_sha256'],'format':'glTF 2.0 GLB','immutable':True,'bytes':len(b),'attribution':s['attribution'],'inheritedNodeMatrix':s['original_scene_M'],'primitives':[{k:v for k,v in x.items() if k!='samples'} for x in geometry],'images':images})
  refs[s['type_id']]={'geometry':geometry}; (out/'assets'/f"{s['type_id']}.glb").write_bytes(b)
 instances=[]
 for t in transforms:
  instances.append({'id':t['slot_id'],'sourceId':t['type_id'],'arch':t['arch'],'orientation':t['orientation'],'expectedParity':t['expected_parity'],'candidate':t['source_local_to_candidate'],'display':t['source_local_to_display']})
  ref=[]
  for g in refs[t['type_id']]['geometry']:
   points=np.array([s['point'] for s in g['samples']]);hom=np.column_stack([points,np.ones(len(points))]);ref.append({k:(hom@np.array(t['source_local_to_'+k]).T)[:,:3].tolist() for k in ['candidate','display']})
  refs[t['slot_id']]=ref
 assert len(sources)==len({s['id'] for s in sources})==16 and len(instances)==len({i['id'] for i in instances})==32
 m={'schemaVersion':'f02-manifest-1','baseline':frozen['candidate'],'authorization':'INTERNAL_ONLY','certification':'NOT_CERTIFIED','publicRelease':'NOT_ESTABLISHED','coordinates':{'geometry':'RAW_MESH_LOCAL','matrixStorage':'ROW_MAJOR_ROWS','vectors':'COLUMN','composition':'APPROVED_MATRIX_TIMES_RAW_POSITION_ONCE','units':'UNCALIBRATED_SOURCE_LOCAL_DEVELOPMENT_UNITS','basisConversion':'IDENTITY'},'sources':sources,'instances':instances,'modes':frozen['modes'],'bounds':frozen['fixed_mode_bounds'],'scientificRegistry':limits,'provenance':{k:v[2] for k,v in packs.items()},'sourceManifestSHA256':sha(scene.read(sr+'scene_manifest.json')),'transformRecordSHA256':sha(scene.read(sr+'stage09c_06_transforms_32.json')),'cameraReference':'Stage09C07 PRESENTATION_CONVENTIONS: orthographic, +Z up, oblique (1,-1,1); fixed mode bounds'}
 dump(out/'manifest.json',m);dump(out/'oracle.json',refs)
 (out/'frozen-transforms.json').write_bytes(scene.read(sr+'stage09c_06_transforms_32.json'));(out/'closure.json').write_bytes(closure.read(cr+'stage09c_closure_baseline.json'))
 report={'archives':{k:v[2] for k,v in packs.items()},'sourceCount':len(sources),'instanceCount':len(instances),'sourceBytes':sum(s['bytes'] for s in sources),'verticesUnique':vertices,'trianglesUnique':triangles,'imageCount':image_count,'estimatedRGBABytes':image_bytes,'estimatedRGBAWithMipmapsBytes':image_bytes*4/3,'sourceIdentityAndHash':[{'id':s['id'],'filename':s['originalFilename'],'sha256Before':s['sha256'],'sha256After':sha((out/'assets'/f"{s['id']}.glb").read_bytes())} for s in sources],'instanceIds':[i['id'] for i in instances],'status':'PASS','scope':'Four archives independently verified; historical ten-archive review is closure-record evidence, not reexecuted here.'}
 dump(out/'integrity.json',report);print(json.dumps({k:v for k,v in report.items() if k not in ['sourceIdentityAndHash','instanceIds']}))
if __name__=='__main__':main()
