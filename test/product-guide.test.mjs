import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const guide=read('../magnet/definition.json'), taxonomy=read('../public/assets/categories.json');
const steps=guide.mag_macro_steps, byId=new Map(steps.map(s=>[s.id,s]));
const leaves=[];
function visit(n){const kids=(n.itemListElement||[]).map(x=>x.item);if(kids.length)kids.forEach(visit);else leaves.push(n.url)}
visit(taxonomy);
test('every taxonomy leaf has exactly one reachable, correctly linked destination',()=>{
 assert.equal(byId.size,steps.length);
 const seen=new Set();function walk(id,path=new Set()){
  assert.ok(!path.has(id),'cycle: '+id); if(seen.has(id))return;
  const s=byId.get(id);assert.ok(s,'missing route: '+id);seen.add(id);
  if(s.step_config.terminal)return;
  assert.ok(s.step_options.length>0&&s.step_options.length<=6);
  for(const o of s.step_options)walk(o.goto,new Set([...path,id]));
 }
 walk('welcome');assert.equal(seen.size,steps.length,'unreachable step');
 const urls=steps.filter(s=>s.step_config.terminal&&s.id!=='part-number').map(s=>s.step_config.cta.url);
 assert.deepEqual(urls.sort(),leaves.sort());assert.equal(urls.length,141);
});
test('browsing never asks for or saves a lead; terminal links stay on Blackhawk',()=>{
 for(const s of steps){assert.deepEqual(s.step_columns,[]);assert.ok(['message','single_select'].includes(s.step_type));
  if(s.step_config.terminal){const u=new URL(s.step_config.cta.url);assert.equal(u.protocol,'https:');assert.equal(u.hostname,'blackhawksupply.com');}
 }
 assert.equal(guide.mag_display_mode,'inline');assert.equal(guide.mag_presentation_style,'assistant');
});
