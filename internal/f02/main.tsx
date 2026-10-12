import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Viewer } from './viewer.ts';
import type { Presentation } from './viewer.ts';
import { modes } from './contract.ts';
import type { Mode } from './contract.ts';
declare global { interface Window { f02?:Viewer; } }
function App(){
 const canvas=useRef<HTMLCanvasElement>(null),viewer=useRef<Viewer|null>(null);
 const [status,setStatus]=useState('Not loaded'),[busy,setBusy]=useState(false),[ids,setIds]=useState<string[]>([]),[mode,setMode]=useState<Mode>(modes[0]);
 useEffect(()=>()=>{viewer.current?.dispose();delete window.f02;},[]);
 async function load(p:Presentation){setBusy(true);setIds([]);setStatus('Loading verified originals…');viewer.current?.dispose();try{const v=new Viewer(canvas.current!);viewer.current=v;window.f02=v;await v.load(p);setIds(v.manifest!.instances.map(i=>i.id));setStatus(p==='solid'?'Ready — runtime solid material override; source textures not decoded':'Ready — original GLB texture/material presentation');setMode(modes[0]);}catch(error){setStatus(error instanceof Error?error.message:'LOAD_FAILED');}finally{setBusy(false);}}
 return <main><h1>F02 internal engineering harness</h1><p><strong>OUTWARD_PROVISIONAL_V1 — provisional, uncalibrated, nonocclusal, NOT_CERTIFIED. Public release NOT_ESTABLISHED.</strong></p><p>A/B are computational reflection labels. Identity, laterality, facing, CEJ, relative scale, contacts, and occlusion remain unresolved or uncertified.</p><button disabled={busy} onClick={()=>void load('solid')}>Load solid override</button><button disabled={busy} onClick={()=>void load('original')}>Load original textures</button><button disabled={busy} onClick={()=>{viewer.current?.dispose();setIds([]);setStatus('Released');}}>Release resources</button><p role="status">{status}</p><label>Accepted scene mode <select disabled={!ids.length} value={mode} onChange={e=>{const m=e.target.value as Mode;setMode(m);viewer.current?.setMode(m);}}>{modes.map(m=><option key={m}>{m}</option>)}</select></label><label> Isolate instance <select disabled={!ids.length} onChange={e=>viewer.current?.isolate(e.target.value)}><option value="">All in mode</option>{ids.map(id=><option key={id}>{id}</option>)}</select></label><canvas ref={canvas} aria-label="Internal provisional dentition" style={{display:'block',width:'100%',height:'60vh'}}/><p>Orbit: drag. Pan: right-drag. Zoom: wheel/pinch. Camera and visibility never change scientific placement.</p><details><summary>Provenance and unchanged scientific registry</summary><pre>{viewer.current?.manifest?JSON.stringify({sources:viewer.current.manifest.sources.map(s=>({id:s.id,attribution:s.attribution,sha256:s.sha256})),registry:viewer.current.manifest.scientificRegistry},null,2):'Available after verified load.'}</pre></details></main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
