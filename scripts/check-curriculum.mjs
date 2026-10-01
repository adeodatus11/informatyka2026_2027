import {compareLessons} from '../content/lesson-order.js';
import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=async name=>JSON.parse(await readFile(new URL(name,root),'utf8'));
const requirements=await read('docs/podstawa-programowa/wymagania.json');
const mapping=await read('docs/podstawa-programowa/mapowanie.json');
const reqIds=new Set(requirements.requirements.map(r=>r.id));
assert.equal(reqIds.size,requirements.requirements.length,'Powtórzone wymaganie');
const files=(await readdir(new URL('content/lessons/',root))).filter(f=>/^\d.*\.js$/.test(f));
const lessons=await Promise.all(files.map(async file=>({file:'content/lessons/'+file,...(await import(new URL('content/lessons/'+file,root))).default})));
lessons.sort(compareLessons);
assert.equal(new Set(mapping.lessons.map(l=>l.lessonId)).size,mapping.lessons.length,'Powtórzone ID w mapie');
assert.deepEqual(mapping.lessons.map(l=>l.lessonId).sort(),lessons.map(l=>l.id).sort(),'Mapa nie obejmuje dokładnie wszystkich aktualnych lekcji');
const counts={};
for(const lesson of lessons){
 const item=mapping.lessons.find(l=>l.lessonId===lesson.id);
 counts[lesson.grade]=(counts[lesson.grade]||0)+1;
 assert.equal(item.grade,lesson.grade,`${lesson.id}: klasa`);
 assert.equal(item.numberInGrade,counts[lesson.grade],`${lesson.id}: numer w klasie`);
 assert.equal(item.title,lesson.title,`${lesson.id}: tytuł`);
 assert.equal(item.file,lesson.file,`${lesson.id}: plik`);
 assert.ok(item.requirements.length&&(lesson.externalUrl||item.activityIds.length)&&item.evidence&&item.limitations,`${lesson.id}: brak dowodów lub ograniczeń`);
 for(const ref of item.requirements)assert.ok(reqIds.has(ref),`${lesson.id}: nieznany punkt ${ref}`);
 const activities=lesson.sections.flatMap(s=>s.activities).map(a=>a.id);
 for(const id of item.activityIds)assert.ok(activities.includes(id),`${lesson.id}: brak ćwiczenia ${id}`);
}
console.log(`Mapa poprawna: ${lessons.length} lekcji; klasy: ${JSON.stringify(counts)}; ${reqIds.size} punktów PP.`);
