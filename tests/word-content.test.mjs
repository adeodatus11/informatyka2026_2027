import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resultSources} from '../content/scoring.js';
const paths=['28-word-styles','29-word-toc','30-word-captions','31-word-sections','32-word-review','33-word-guide'];
const lessons=await Promise.all(paths.map(async f=>(await import(`../content/lessons/${f}.js`)).default));
for(const l of lessons)test(`${l.id}: Word desktop ma plik, instrukcje, osobną ocenę i kompletne quizy`,async()=>{
 assert.equal(l.grade,1);assert.equal(l.workspace,'desktop-word');
 assert.equal(l.sections.reduce((sum,s)=>sum+s.duration,0),l.duration);
 const all=l.sections.flatMap(s=>s.activities),ids=new Set(all.map(a=>a.id));assert.equal(ids.size,all.length);
 const downloads=all.filter(a=>a.type==='download');assert.ok(downloads.length);
 assert.ok(downloads.some(a=>a.file===`materials/word/lesson-${l.id}-start.docx`));
 for(const a of downloads){const file=new URL('../public/'+a.file,import.meta.url);assert.ok((await stat(file)).size>1000);const bytes=await readFile(file);if(a.file.endsWith('.docx'))assert.equal(bytes.subarray(0,2).toString(),'PK');}
 const guides=all.filter(a=>a.type==='wordSteps');assert.ok(guides.length);
 for(const g of guides){assert.ok(g.steps.length);for(const s of g.steps)for(const k of ['title','instruction','check'])assert.ok(s[k]?.length>5,`${g.id}: ${k}`);}
 const rubrics=all.filter(a=>a.type==='wordRubric');assert.ok(rubrics.length);
 for(const r of rubrics){assert.ok(r.filename?.includes('.docx'));assert.ok(r.criteria.length>=3);for(const c of r.criteria){assert.ok(Number.isInteger(c.points)&&c.points>0);assert.ok(c.description.length>30);}}
 const cards=all.filter(a=>a.type==='resultCard');assert.ok(cards.length);
 for(const c of cards){assert.equal(c.hideGrade,true);const sources=resultSources(l,c);assert.ok(sources.length>=2);for(const a of sources)assert.ok(!['wordSteps','wordRubric','checklist','download','text'].includes(a.type),`Nie punktuj deklaracji ani instrukcji: ${a.id}`);}
 assert.ok(all.some(a=>a.type==='text'),'refleksja końcowa');
});
test('Projekt poradnika ma jawny podział na dwie lekcje',()=>{assert.deepEqual(lessons.at(-1).sessions,[45,45]);assert.equal(lessons.at(-1).duration,90);let sum=0;assert.ok(lessons.at(-1).sections.some(s=>(sum+=s.duration)===45),'punkt przerwy po 45 minutach');});
test('Instrukcje i samoocena produktu nigdy nie są domyślnie punktowane jak quiz',()=>{
 const l={sections:[{activities:[{id:'s',type:'wordSteps'},{id:'r',type:'wordRubric'},{id:'q',type:'choice'}]}]};assert.deepEqual(resultSources(l,{}).map(a=>a.id),['q']);
});
