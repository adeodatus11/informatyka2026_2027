import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {lessonScore} from '../content/scoring.js';
import {desktopApp} from '../content/desktop-apps.js';
const files=(await readdir(new URL('../content/lessons/',import.meta.url))).filter(f=>/^(11[0-9]|12[01])-/.test(f));
const lessons=await Promise.all(files.map(async f=>(await import('../content/lessons/'+f)).default));
test('Wszystkie luki 3D mają lekcje, z rzeczywistą praktyką i rozdzieloną punktacją',()=>{
 assert.equal(lessons.length,12);assert.equal(lessons.filter(l=>l.grade===2).length,7);assert.equal(lessons.filter(l=>l.grade===3).length,5);
 for(const l of lessons){
  assert.equal(desktopApp(l.workspace).online,true);
  const acts=l.sections.flatMap(s=>s.activities);const card=acts.find(a=>a.type==='resultCard');const rubric=acts.find(a=>a.type==='wordRubric');
  assert.equal(card.hideGrade,true);assert.ok(!card.sources.includes(rubric.id));
  assert.ok(acts.find(a=>a.id===`m${l.id}-build`).steps.length>=4);
  assert.ok(rubric.criteria.every(c=>c.description.includes('0:')&&c.description.includes('1:')&&c.description.includes('2:')));
  const answers=Object.fromEntries(acts.filter(a=>a.type==='choice').map(a=>[a.id,{done:true,selected:a.correct[0],first:true}]));
  const score=lessonScore(l,card,answers);assert.equal(score.score,3);assert.equal(score.max,3);
 }
});
test('Karta projektu jest samodzielnym SVG bez zewnętrznych zasobów i skryptów',async()=>{
 const svg=await readFile(new URL('../public/materials/model3d/karta-projektu.svg',import.meta.url),'utf8');
 assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<script|<image|<foreignObject|(?:href|src)=["']https?:/i);
});
