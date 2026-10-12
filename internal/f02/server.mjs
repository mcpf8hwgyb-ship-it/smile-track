// Controlled loopback harness, deliberately separate from Next routes and export.
import {createServer} from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {fileURLToPath,URL} from 'node:url';
import {randomBytes,createHash} from 'node:crypto';
import {build} from 'esbuild';
const repo=fileURLToPath(new URL('../../',import.meta.url));
if(!process.env.F02_DATA_DIR)throw new Error('F02_DATA_DIR must point outside repository');
const data=await realpath(process.env.F02_DATA_DIR);if(!relative(repo,data).startsWith('../'))throw new Error('Restricted data inside repository');
const manifestBytes=await readFile(resolve(data,'manifest.json'));const manifest=JSON.parse(manifestBytes);
const bundle=await build({entryPoints:[fileURLToPath(new URL('./main.tsx',import.meta.url))],bundle:true,write:false,format:'esm',platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const token=randomBytes(24).toString('hex'),prefix='/'+token+'/';
const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>F02 internal only</title><style>body{font:16px system-ui;margin:1rem}button,select{min-height:44px;margin:4px}pre{white-space:pre-wrap;overflow-wrap:anywhere}canvas{touch-action:none}</style><div id="root"></div><script type="module" src="bundle.js"></script></html>';
const server=createServer(async(req,res)=>{
 const origin='http://127.0.0.1:4174';
 if(req.headers.host!=='127.0.0.1:4174'||(req.headers.origin&&req.headers.origin!==origin)||req.method!=='GET'||!req.url.startsWith(prefix)){res.writeHead(404).end();return;}
 try{const path=new URL(req.url,origin).pathname.slice(prefix.length);let body,type;
 if(path===''){body=html;type='text/html';}
 else if(path==='bundle.js'){body=bundle.outputFiles[0].contents;type='text/javascript';}
 else if(path==='manifest.json'){body=manifestBytes;type='application/json';}
 else {const s=manifest.sources.find(s=>path==='assets/'+s.id+'.glb');if(!s){res.writeHead(404).end();return;}body=await readFile(resolve(data,'assets',s.id+'.glb'));if(createHash('sha256').update(body).digest('hex')!==s.sha256)throw new Error('Asset integrity');type='model/gltf-binary';}
 res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self' blob:; img-src blob: data:; base-uri 'none'; frame-ancestors 'none'"});res.end(body);
 }catch{res.writeHead(404).end();}
});server.listen(4174,'127.0.0.1',()=>process.stdout.write('F02_URL=http://127.0.0.1:4174'+prefix+'\n'));
