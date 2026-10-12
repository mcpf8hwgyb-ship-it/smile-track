// Controlled local measurements only. No screenshots, traces, scientific data uploads, or CI artifacts.
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {URL} from 'node:url';
import {setTimeout,clearTimeout} from 'node:timers';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
if(!process.env.F02_DATA_DIR)throw new Error('F02_DATA_DIR required');
const server=spawn(process.execPath,['internal/f02/server.mjs'],{env:process.env,stdio:['ignore','pipe','pipe']});
let output='';server.stderr.on('data',b=>process.stderr.write(b));
const url=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Harness start timeout')),20000);server.on('exit',c=>{clearTimeout(timer);reject(Error('Harness exit '+c));});server.stdout.on('data',b=>{output+=b;const m=output.match(/F02_URL=(\S+)/);if(m){clearTimeout(timer);resolve(m[1]);}});});
const results=[];
try{
 const browser=await chromium.launch({executablePath:process.env.F02_CHROMIUM_PATH||undefined,args:process.env.F02_SOFTWARE_GL?['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']:[],env:process.env});
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
   const page=await ctx.newPage();const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>{if(new URL(r.url()).origin!=='http://127.0.0.1:4174')external.push(r.url());});
   if(mobile){const cdp=await ctx.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});}
   await page.goto(url);
   for(const presentation of ['solid','original']){
    await page.getByRole('button',{name:presentation==='solid'?'Load solid override':'Load original textures',exact:true}).click();
    let failed=null;
    try{await page.waitForFunction(()=>window.f02?.sample().ready||/FAILED|MISMATCH|LOST|UNAVAILABLE/.test(document.querySelector('[role=status]').textContent),{},{timeout:120000});}catch(e){failed=e.message;}
    const status=await page.getByRole('status').textContent();
    if(failed||!status.startsWith('Ready')){results.push({mobile,presentation,status,failed});throw Error('STOP: unstable/failed full-model loading');}
    const before=await page.evaluate(()=>window.f02.sample());assert.equal(before.renderedInstances,32);assert.equal(before.sourceTextureObjects,presentation==='solid'?0:24);
    const canvas=page.locator('canvas'),box=await canvas.boundingBox();await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();for(let n=0;n<20;n++)await page.mouse.move(box.x+box.width*(.5+n*.005),box.y+box.height*.55);await page.mouse.up();await page.mouse.wheel(0,120);
    await page.waitForTimeout(1200);
    const after=await page.evaluate(()=>window.f02.sample());assert.deepEqual(after.matrices,before.matrices);assert.equal(after.webglError,0);assert.equal(after.contextLost,false);
    for(const mode of ['MAXILLARY_ARCH_LOCAL','MANDIBULAR_ARCH_LOCAL','COMBINED_EXPLODED_NONOCCLUSAL']){await page.getByLabel('Accepted scene mode').selectOption(mode);const state=await page.evaluate(()=>window.f02.sample());assert.equal(state.matrices.filter(i=>i.visible).length,mode.startsWith('COMBINED')?32:16);}
    await page.getByLabel('Isolate instance').selectOption(before.matrices[0].id);assert.equal((await page.evaluate(()=>window.f02.sample())).matrices.filter(i=>i.visible).length,1);await page.getByLabel('Isolate instance').selectOption('');
    const visiblePixelCounts=await page.evaluate(()=>{
     const v=window.f02,gl=v.renderer.getContext(),counts=[];
     for(const orientation of ['A','B']){
      v.isolate(v.actors.find(a=>a.name.endsWith('_'+orientation)).name);v.renderer.render(v.scene,v.camera);
      const pixels=new Uint8Array(gl.drawingBufferWidth*gl.drawingBufferHeight*4);gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let count=0;for(let i=4;i<pixels.length;i+=4)if(pixels[i]!==pixels[0]||pixels[i+1]!==pixels[1]||pixels[i+2]!==pixels[2])count++;
      counts.push({orientation,nonBackgroundPixels:count});
     }v.isolate('');return counts;
    });assert.ok(visiblePixelCounts.every(x=>x.nonBackgroundPixels>0));
    await page.getByRole('button',{name:'Release resources',exact:true}).click();
    const release=await page.evaluate(()=>window.f02.metrics.release);process.stdout.write('RELEASE '+JSON.stringify(release)+'\n');assert.equal(release.actorReferences,0);assert.equal(release.afterDisposal.geometries,0);assert.equal(release.textureReferences,0);
    const {matrices,...metrics}=after;assert.equal(matrices.length,32);
    results.push({environment:mobile?'desktop Chromium mobile emulation + 4x CPU throttling':'desktop Chromium',viewport:mobile?'390x844':'1440x1000',browser:browser.version(),...metrics,release,visiblePixelCounts,errors:[...errors],externalRequests:[...external]});
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   }
   await ctx.close();
  }
  // Explicitly controlled loading and capability failures on fresh pages.
  const ctx=await browser.newContext();const page=await ctx.newPage();
  for(const malformed of [false,true]){let assetRequests=0;await page.route('**/assets/*.glb',route=>++assetRequests<3?route.continue():malformed?route.fulfill({body:'not a GLB',contentType:'model/gltf-binary'}):route.fulfill({status:404,body:''}));await page.goto(url);await page.getByRole('button',{name:'Load solid override',exact:true}).click();await page.waitForFunction(()=>/FAILED|MISMATCH/.test(document.querySelector('[role=status]').textContent));results.push({failureCase:malformed?'malformed/hash mismatch':'missing asset',status:await page.getByRole('status').textContent(),release:await page.evaluate(()=>window.f02.metrics.release)});await page.unroute('**/assets/*.glb');}
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args);};});await page.goto(url);await page.getByRole('button',{name:'Load solid override',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role=status]').textContent==='WEBGL2_UNAVAILABLE');results.push({failureCase:'WebGL2 unavailable',status:await page.getByRole('status').textContent()});await ctx.close();
 }finally{await browser.close();}
}finally{
 server.kill('SIGTERM');await writeFile(resolve(process.env.F02_DATA_DIR,'browser-results.json'),JSON.stringify(results,null,2)+'\n');process.stdout.write(JSON.stringify(results,null,2)+'\n');
}
