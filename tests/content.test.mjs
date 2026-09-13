import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
const files=(await readdir(new URL('../content/lessons/',import.meta.url))).filter(f=>/^\d.*\.js$/.test(f));
const lessons=await Promise.all(files.map(async f=>(await import(new URL('../content/lessons/'+f,import.meta.url))).default));
test('Four lessons keep the exact subject axis supplied by the teacher',()=>assert.deepEqual(lessons.map(l=>l.title),['Komputer','System i oprogramowanie','Urządzenia w szkole','Urządzenia w domu']));
for(const l of lessons)test(`${l.id}: activities, answer keys, teacher metadata and 30 minute budget`,()=>{
 assert.equal(l.sections.length,6);assert.equal(l.sections.reduce((s,x)=>s+x.duration,0),30);const ids=new Set();
 for(const s of l.sections){for(const k of ['teacherNotes','askStudents','expectedAnswers','commonMistakes','optionalExtension'])assert.ok(s[k]?.length>10,`${s.id} ${k}`);assert.equal(typeof s.skipIfShortOnTime,'boolean');
 for(const a of s.activities){assert.ok(!ids.has(a.id),'Duplicate id');ids.add(a.id);if(a.correct)for(const i of a.correct)assert.ok(Number.isInteger(i)&&i>=0&&i<a.options.length);if(a.rows)for(const r of a.rows)assert.ok(r.correct.every(i=>i>=0&&i<a.options.length));if(a.type==='video'){assert.equal(a.file,null);assert.ok(a.duration);} }
 }
});
