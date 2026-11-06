import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPyodide} from 'pyodide';
import * as P from '../content/sims/pythonLab.js';
import {solveMode} from '../content/sims/numberLab.js';
import {lessonScore} from '../content/scoring.js';
import l87 from '../content/lessons/87-decimal-to-binary-g3.js';
import l88 from '../content/lessons/88-positional-systems-g3.js';
import l89 from '../content/lessons/89-fractions-g3.js';
import l90 from '../content/lessons/90-fractions-python-g3.js';
const ALL=[l87,l88,l89,l90];
const acts=l=>l.sections.flatMap(s=>s.activities);
const rows=JSON.parse(readFileSync(new URL('../docs/rozklad-2026-2027.json',import.meta.url),'utf8'));
const py=await loadPyodide({indexURL:new URL('../node_modules/pyodide/',import.meta.url).pathname});py.runPython(P.RUNNER_PY);
const run=req=>JSON.parse(py.globals.get('_pl_run')(JSON.stringify(req)));
for(const l of ALL){
 test(`${l.id}: rozkład,45min,metody,powtórka i komplet źródeł`,()=>{
  const row=rows.find(r=>r.klasa===3&&r.lp===l.order);assert.equal(l.title,row.temat);assert.equal(l.grade,3);assert.equal(l.duration,45);assert.equal(l.sections.reduce((sum,s)=>sum+s.duration,0),45);assert.ok(l.sections.length>=4&&l.sections.length<=7);
  assert.ok(l.sections[0].activities.some(a=>a.type==='choice'));assert.ok(l.format.methods.length>=3);assert.equal(new Set(acts(l).map(a=>a.id)).size,acts(l).length);
  const card=acts(l).find(a=>a.type==='resultCard');const answers={};for(const a of acts(l)){if(a.type==='choice')answers[a.id]={done:true,first:true,selected:a.correct[0]};else if(a.type==='pythonLab'){const value={passedAll:true,solvedScore:a.points,ranOk:true,visitedEnd:true,bestPassed:a.tests?.length,predict:{checked:true,ok:true},q:Object.fromEntries((a.questions||[]).map((_,i)=>[i,{ok:true,first:true}]))};answers[a.id]={...value,...P.labResult(a,value)};}else if(a.type==='numberLab')answers[a.id]=solveMode(a.mode);else answers[a.id]={done:true};}
  assert.equal(lessonScore(l,card,{}).score,0);const result=lessonScore(l,card,answers);assert.equal(result.score,result.max);assert.ok(result.max>0);for(const id of card.sources)assert.ok(acts(l).some(a=>a.id===id));
 });
 test(`${l.id}: wzorcowe programy w prawdziwym Pyodide`,()=>{
  for(const a of acts(l).filter(a=>a.type==='pythonLab')){
   const code=a.solution??a.code??a.starter;const r=run({code,stdin:a.stdin||[],tests:a.tests||[],trace:a.mode==='trace',maxSteps:P.MAX_TRACE_STEPS});assert.equal(r.error,null,`${a.id}: ${JSON.stringify(r.error)}`);assert.equal(r.stop,null,a.id);assert.ok((r.tests||[]).every(t=>t.ok),`${a.id}: ${JSON.stringify(r.tests)}`);assert.ok(P.sourceChecks(code,a.sourceChecks).every(t=>t.ok),a.id);
   if(['87','88'].includes(l.id)&&a.mode==='code'){const s=run({code:a.starter,tests:a.tests});assert.ok(s.error||s.tests.some(t=>!t.ok),`${a.id}: starter nie rozwiązuje zadania`);}
   if(a.mode==='predict')assert.ok(P.outputLines(r.stdout).length<=(a.predictRows||3)+1,a.id);
  }
 });
}
test('87: dzielenie i bajt dla całego zakresu,odwrócone reszty ujawniają błąd',()=>{
 const a=acts(l87).find(a=>a.id==='g3-87-byte');const code=a.solution;const r=run({code,tests:[{call:'all(na_dwojkowy(n)==format(n,"b") for n in range(1025))',expected:'True'},{call:'all(bajt(n)==format(n,"08b") for n in range(256))',expected:'True'}]});assert.ok(r.tests.every(t=>t.ok));
 const wrong=code.replace('str(n % 2) + wynik','wynik + str(n % 2)');assert.ok(run({code:wrong,tests:a.tests}).tests.some(t=>!t.ok));
});
test('88: konwersje dla podstaw2–16 i niedozwolonych cyfr',()=>{
 const to=acts(l88).find(a=>a.id==='g3-88-to').solution;const from=acts(l88).find(a=>a.id==='g3-88-from').solution;const r=run({code:to+'\n'+from,tests:[{call:'all(z_systemu(na_system(n,p),p)==n for p in range(2,17) for n in range(100))',expected:'True'},{call:'all(z_systemu("0123456789ABCDEF"[p],p) is None for p in range(2,16))',expected:'True'}]});assert.ok(r.tests.every(t=>t.ok));
});

import l106 from '../content/lessons/106-irrigation-g3.js';
import l107 from '../content/lessons/107-rover-g3.js';
import {PROJECTS,SCENARIOS,robotProgram,parseRobotOutput,judgeRobot,robotResult,wiringResult,correctWiring} from '../content/sims/robotLab.js';
for(const l of [l106,l107])test(`${l.id}: projekt robota jest samodzielny, ma poprawny starter i pełną kartę`,()=>{
 assert.equal(l.sections.reduce((n,s)=>n+s.duration,0),45);const all=acts(l),answers={};
 for(const a of all){if(a.type==='choice')answers[a.id]={done:true,first:true};else if(a.type==='robotLab'&&a.mode==='wire')answers[a.id]=wiringResult(correctWiring(),1);else if(a.type==='robotLab'){
  const solution=PROJECTS[a.project].solution;const output=run({code:robotProgram(solution,a.project)});const parsed=parseRobotOutput(output);assert.ok(!parsed.error);assert.ok(judgeRobot(a.project,parsed.cases).every(x=>x.ok));answers[a.id]=robotResult(a.project,{cases:parsed.cases,attempts:1});
  const starter=run({code:robotProgram(a.starter||PROJECTS[a.project].starter,a.project)});const bad=parseRobotOutput(starter);assert.ok(!bad.error);assert.ok(bad.cases.every(c=>!c.error),'Kod startowy uruchamia się, a nie zawiera błędu składni');assert.ok(judgeRobot(a.project,bad.cases).some(c=>!c.ok),'Starter wymaga zmiany reguł');
 }}
 const card=all.find(a=>a.type==='resultCard');const result=lessonScore(l,card,answers);assert.equal(result.score,result.max);assert.equal(result.max,l.id==='106'?10:17);for(const id of card.sources)assert.ok(all.some(a=>a.id===id));
});
test('robotLab także w klasie 3 wyjaśnia błąd składni po polsku',()=>{
 const broken=parseRobotOutput(run({code:robotProgram('for i in range(2)\n    pass\n','garden')}));
 assert.match(broken.cases[0].error,/dwukrop|składni|programie/i);
});
