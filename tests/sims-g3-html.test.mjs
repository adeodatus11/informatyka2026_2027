import test from 'node:test';import assert from 'node:assert/strict';
import {analyze,runChecks,passMap,labResult,buildDocument,lint} from '../content/sims/htmlLab.js';
import {lessonScore} from '../content/scoring.js';
import l91,{SOLUTION_HTML,SOLUTION_CSS} from '../content/lessons/91-website-stages-g3.js';
import l108,{SOLUTION_CSS as CANARY_CSS} from '../content/lessons/108-canary-css-g3.js';
const acts=l=>l.sections.flatMap(s=>s.activities);
for(const l of [l91,l108]){
 test(`${l.id}:45min,karta i wszystkie kryteria sprawdzają rozwiązanie`,()=>{
  assert.equal(l.grade,3);assert.equal(l.duration,45);assert.equal(l.sections.reduce((sum,s)=>sum+s.duration,0),45);assert.ok(l.sections.length>=4&&l.sections.length<=7);const answers={};
  for(const a of acts(l)){
   if(a.type==='htmlLab'&&a.mode!=='show'){const html=l===l91?SOLUTION_HTML:a.html;const css=l===l91?SOLUTION_CSS:CANARY_CSS;const results=runChecks(a.checks,analyze(html,css),a.keep);assert.ok(Object.values(results).every(r=>r.ok),`${a.id}: ${JSON.stringify(results)}`);const r=labResult(a,{res:passMap(results)});assert.equal(r.score,r.max);assert.equal(r.done,true);answers[a.stateKey]={...(answers[a.stateKey]||{}),html,css,modes:{...(answers[a.stateKey]?.modes||{}),[a.mode]:{...r,res:passMap(results)}}};
   }else if(a.type==='choice')answers[a.id]={done:true,first:true,selected:a.correct[0]};else answers[a.id]={done:true};
  }
  const card=acts(l).find(a=>a.type==='resultCard');assert.equal(lessonScore(l,card,{}).score,0);const r=lessonScore(l,card,answers);assert.equal(r.score,r.max);for(const id of card.sources)assert.ok(acts(l).some(a=>a.id===id));
 });
}
test('91: pusty szablon nie zalicza treści; guard zachowuje listę i tabelę',()=>{
 const a=acts(l91).find(a=>a.id==='g3-91-html');assert.ok(Object.values(runChecks(a.checks,analyze(a.html))).some(r=>!r.ok));const css=acts(l91).find(a=>a.id==='g3-91-css');assert.ok(Object.values(runChecks(css.checks,analyze(a.html,SOLUTION_CSS),css.keep)).every(r=>!r.ok));assert.deepEqual(lint(analyze(SOLUTION_HTML,SOLUTION_CSS)),[]);
});
test('108:HTML jest zablokowany,brzydkiCSS nie zalicza układu,SVG i podpisy zostają w eksporcie',()=>{
 const labs=acts(l108).filter(a=>a.type==='htmlLab'&&a.mode!=='show');for(const a of labs){assert.equal(a.lockHtml,true);assert.equal(a.html,labs[0].html);assert.ok(Object.values(runChecks(a.checks,analyze(a.html,a.css))).some(r=>!r.ok));}
 const result=buildDocument(labs[0].html,CANARY_CSS,{download:true});assert.equal((result.doc.match(/<svg /g)||[]).length,3);assert.equal((result.doc.match(/<figcaption>/g)||[]).length,3);assert.match(result.doc,/display:grid/);assert.match(result.doc,/Wyspy Kanaryjskie/);assert.deepEqual(lint(analyze(labs[0].html,CANARY_CSS)),[]);
});
