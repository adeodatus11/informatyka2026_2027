import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPyodide} from 'pyodide';
import {RUNNER_PY} from '../content/sims/pythonLab.js';
import {PROJECTS,SCENARIOS,ROBOT_MODEL,ROBOT_WIRING,PINS,correctWiring,checkWiring,wiringResult,reference,robotProgram,parseRobotOutput,judgeRobot,robotResult} from '../content/sims/robotLab.js';
import {lessonScore} from '../content/scoring.js';
const IDS=['82','83','84','85','86','105'];
const lessons=await Promise.all(IDS.map(async id=>(await import(`../content/lessons/${id}-robotics-g2.js`)).default));
const rows=JSON.parse(readFileSync(new URL('../docs/rozklad-2026-2027.json',import.meta.url)));
const py=await loadPyodide();py.runPython(RUNNER_PY);const run=req=>JSON.parse(py.globals.get('_pl_run')(JSON.stringify(req)));
for(const project of Object.keys(PROJECTS))test(`${project}: prawdziwy Python, wszystkie scenariusze, starter wykryty`,()=>{
 const result=parseRobotOutput(run({code:robotProgram(PROJECTS[project].solution,project)}));assert.ok(!result.error,result.error);assert.ok(judgeRobot(project,result.cases).every(x=>x.ok),JSON.stringify(judgeRobot(project,result.cases)));assert.equal(robotResult(project,{cases:result.cases,attempts:1}).score,8);
 const broken=parseRobotOutput(run({code:robotProgram(PROJECTS[project].starter,project)}));assert.ok(!broken.error,broken.error);assert.ok(judgeRobot(project,broken.cases).some(x=>!x.ok));assert.equal(robotResult(project,{cases:broken.cases}).done,false);
});
test('histereza: pamięć i zabezpieczenia, radio: ścisłe granice',()=>{
 const garden=reference('gardenHysteresis',SCENARIOS.gardenHysteresis[0].frames).map(x=>x.pompa);assert.deepEqual(garden,[true,true,true,true,false,false,true]);
 const radio=reference('radio',SCENARIOS.radio[0].frames).map(x=>x.przekaznik);assert.deepEqual(radio,[true,false,false,false,false,true,true]);
 const frames=[{wilgotnosc:20,woda:1,deszcz:0,noc:0},{wilgotnosc:35,woda:1,deszcz:1,noc:0},{wilgotnosc:35,woda:1,deszcz:0,noc:0}];assert.deepEqual(reference('gardenHysteresis',frames).map(x=>x.pompa),[true,false,false]);
});
test('montaż: wszystkie błędne piny wykrywane, zgodny zapis i stały max',()=>{
 const good=correctWiring();assert.equal(checkWiring(good).filter(x=>x.ok).length,ROBOT_WIRING.length);assert.equal(wiringResult(good,1).score,8);assert.equal(wiringResult({},1).max,8);assert.equal(wiringResult({},1).done,false);
 for(const wire of ROBOT_WIRING)for(const pin of PINS.filter(p=>p!==wire.pin)){const bad={...good,[wire.id]:pin};assert.equal(checkWiring(bad).find(x=>x.id===wire.id).ok,false);assert.equal(wiringResult(bad,1).done,false);}
 assert.equal(wiringResult(good,5).score,5);assert.equal(ROBOT_MODEL,'Rover-2');
});
test('bezpieczeństwo: polecenie pompy bez wody, zły pin i brak próbek nie zaliczają',()=>{
 const unsafe=parseRobotOutput(run({code:robotProgram('for _ in range(liczba_prob()):\n    write("pompa", True)\n    sleep_ms(1000)\n','garden')}));assert.ok(unsafe.cases.some(c=>c.unsafe.length));assert.ok(judgeRobot('garden',unsafe.cases).some(x=>/bez wody/.test(x.message)));
 const bad=parseRobotOutput(run({code:robotProgram('write("nieznane", True)','garden')}));assert.match(bad.cases[0].error,/Nieznany element/);assert.equal(robotResult('garden',{cases:bad.cases}).done,false);
 const missing=parseRobotOutput(run({code:robotProgram('pass','garden')}));assert.ok(judgeRobot('garden',missing.cases).every(x=>!x.ok));assert.match(parseRobotOutput({timeout:true}).error,/za długo/);
 const fast=parseRobotOutput(run({code:robotProgram(PROJECTS.garden.solution.replace('sleep_ms(1000)','sleep_ms(100)'),'garden')}));assert.ok(judgeRobot('garden',fast.cases).some(x=>/1000 ms/.test(x.message)));
});
test('Python API: read, sleep, zakres serwa i silnika, czas wirtualny',()=>{
 for(const code of ['read("brak")','sleep_ms(0)','write("serwo", 45)','write("lewy", 101)']){const r=parseRobotOutput(run({code:robotProgram(code,'rover')}));assert.ok(r.cases.every(c=>c.error),code);}
 const r=parseRobotOutput(run({code:robotProgram(PROJECTS.rover.solution,'rover')}));assert.deepEqual(r.cases[0].log.map(x=>x.ms),[1000,2000,3000,4000,5000]);
});
test('lekcje: tematy, 45 min, retrieval, odrębne zadania, maksimum karty',()=>{
 for(const l of lessons){const row=rows.find(x=>x.klasa===2&&x.lp===l.order);assert.equal(l.title,row.temat);assert.equal(l.duration,45);assert.equal(l.sections.reduce((s,x)=>s+x.duration,0),45);assert.ok(l.sections.length>=4&&l.sections.length<=7);assert.ok(l.sections[0].activities.some(a=>a.type==='choice'));assert.match(l.teacherGuide.preparation,/DO WERYFIKACJI ze sprzętem w pracowni/);const acts=l.sections.flatMap(s=>s.activities);assert.equal(new Set(acts.map(a=>a.id)).size,acts.length);const lab=acts.find(a=>a.type==='robotLab');assert.ok(lab);assert.equal(lab.points,8);const card=acts.find(a=>a.type==='resultCard');const answers=Object.fromEntries(acts.map(a=>[a.id,a.type==='choice'?{done:true,first:true}:{done:true,score:8,max:8}]));const score=lessonScore(l,card,answers);assert.equal(score.score,10);assert.equal(score.max,10);assert.equal(lessonScore(l,card,{}).score,0);assert.ok(!card.sources.includes(acts[0].id));}
 const robot=lessons.at(-1).sections.flatMap(s=>s.activities).find(a=>a.type==='robotLab');assert.equal(robot.requiresWiring,true);
});


test('Rzeczywisty błąd składni i nazwy dostaje wskazówkę po polsku',()=>{
 const execute=(code,project)=>parseRobotOutput(run({code:robotProgram(code,project)}));
 const syntax=execute('for i in range(2)\n    pass\n','garden');
 assert.match(syntax.cases[0].error,/dwukrop|składni|programie/i);
 const name=execute('nieznana_funkcja()','garden');
 assert.match(name.cases[0].error,/nazw|zmienn|zdefiniowan|programie/i);
});
