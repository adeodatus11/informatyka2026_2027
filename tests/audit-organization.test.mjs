import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {expertResult,modules} from '../content/sims/eServices.js';
const lessons=await Promise.all(fs.readdirSync(new URL('../content/lessons/',import.meta.url)).filter(f=>/^\d.*\.js$/.test(f)).map(async f=>(await import('../content/lessons/'+f)).default));
const solo=['08','09','13','14','16','17','32','33','35','36','41','51','52','55','59','62','67','72','76','93','97','112','115','119','121'];
test('Zadania bez wspólnego produktu nie wymagają powtarzania pracy przy dwóch komputerach',()=>{
 for(const id of solo){const l=lessons.find(l=>l.id===id);assert.ok(l.format.grouping.startsWith('Praca samodzielna'),id);assert.ok(!l.sections.some(s=>['pair','trio','group'].includes(s.grouping)),id);assert.doesNotMatch(JSON.stringify(l),/potem zamiana ról|każdy pisze u siebie|nawigator układa funkcję u siebie|osoba B pisze kod u siebie/i,id);}
 for(const id of ['07','39'])assert.ok(lessons.find(l=>l.id===id).sections.some(s=>s.grouping==='pair'),id+': pozostaje rzeczywista dyskusja');
});
test('E-usługi solo wymagają trzech modułów, a maksimum jest stałe od początku',()=>{
 const full=Object.fromEntries(modules.map(m=>[m.id,Object.fromEntries(m.steps.map(s=>[s.id,{ok:true,tries:1}]))]));
 assert.equal(expertResult({requireAll:true}).max,12);
 assert.equal(expertResult({requireAll:true,modules:{[modules[0].id]:full[modules[0].id]}}).done,false);
 assert.deepEqual(expertResult({requireAll:true,modules:full}),{done:true,score:12,max:12,summary:'Wykonane sprawy: 3/3 · 12/12 pkt'});
 const a=lessons.find(l=>l.id==='09').sections.flatMap(s=>s.activities).find(a=>a.id==='es-expert');assert.equal(a.requireAll,true);assert.equal(a.points,12);
});
test('Aktywne lekcje nie obiecują nieistniejących filmów',()=>assert.ok(!lessons.flatMap(l=>l.sections.flatMap(s=>s.activities)).some(a=>a.type==='video'&&!a.file)));
