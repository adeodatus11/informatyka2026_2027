import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {lessonNotes} from '../content/lesson-notes.js';
import {dentalState,dentalSchema,dentalProgress,createDentalTable,connectDentalTables,saveDentalPatient,saveDentalVisit,loadExampleVisits,runDentalQuery,queryDentalRows,examplePatients,targetVisit,validDay} from '../content/dental-simulator.js';
const files=(await readdir(new URL('../content/lessons/',import.meta.url))).filter(f=>/^\d.*\.js$/.test(f));
const lessons=await Promise.all(files.map(async f=>(await import(new URL('../content/lessons/'+f,import.meta.url))).default));
test('Four lessons keep the exact subject axis supplied by the teacher',()=>assert.deepEqual(lessons.filter(l=>l.grade===1).map(l=>l.title),['Komputer','System i oprogramowanie','Urządzenia w szkole','Urządzenia w domu']));
for(const l of lessons)test(`${l.id}: activities, answer keys, teacher metadata and declared time budget`,()=>{
 assert.equal(l.sections.length,6);assert.equal(l.sections.reduce((s,x)=>s+x.duration,0),l.duration);const ids=new Set();
 for(const s of l.sections){for(const k of ['teacherNotes','askStudents','expectedAnswers','commonMistakes','optionalExtension'])assert.ok(s[k]?.length>10,`${s.id} ${k}`);assert.equal(typeof s.skipIfShortOnTime,'boolean');
 for(const a of s.activities){assert.ok(!ids.has(a.id),'Duplicate id');ids.add(a.id);if(a.correct)for(const i of a.correct)assert.ok(Number.isInteger(i)&&i>=0&&i<a.options.length);if(a.rows)for(const r of a.rows)assert.ok(r.correct.every(i=>i>=0&&i<a.options.length));if(a.type==='video'){assert.equal(a.file,null);assert.ok(a.duration);} }
 }
});
test('New lessons have the requested grades, curriculum references and reading for every stage',()=>{
 for(const [id,grade,refs] of [['05',2,['I.1','II.2','II.3.d']],['06',3,['I.2.a']]]){
  const lesson=lessons.find(l=>l.id===id);
  assert.equal(lesson.grade,grade);
  for(const ref of refs)assert.ok(lesson.curriculum.includes(ref));
  for(const s of lesson.sections)assert.ok(lessonNotes[id][s.id].paragraphs.length>=2);
 }
});
function simulatedBase(){
 let s=dentalState();
 for(const [name,design] of Object.entries(dentalSchema))s=createDentalTable(s,name,design);
 s=connectDentalTables(s,'id_pacjenta','id_pacjenta');
 for(const p of examplePatients)s=saveDentalPatient(s,p);
 return loadExampleVisits(s);
}
test('Browser simulation rejects incorrect schemas, duplicate keys, orphans and invalid dates',()=>{
 assert.throws(()=>createDentalTable({},'Pacjenci',{key:'nazwisko',fields:dentalSchema.Pacjenci.fields}),/klucz/);
 assert.throws(()=>createDentalTable({},'Pacjenci',{key:'id_pacjenta',fields:{...dentalSchema.Pacjenci.fields,id_pacjenta:'text'}}),/typ pola/);
 assert.throws(()=>connectDentalTables({},'id_pacjenta','id_pacjenta'),/obie tabele/);
 const s=simulatedBase();
 assert.throws(()=>connectDentalTables(s,'id_wizyty','id_pacjenta'),/Połącz/);
 assert.throws(()=>saveDentalPatient(s,examplePatients[0]),/unikalny/);
 assert.throws(()=>saveDentalPatient(s,{id_pacjenta:4,imie:'  ',nazwisko:'Test'}),/Imię/);
 assert.throws(()=>saveDentalVisit(s,{...targetVisit,id_pacjenta:99}),/Klucz obcy/);
 assert.throws(()=>saveDentalVisit(s,{...targetVisit,id_wizyty:1}),/już istnieje/);
 assert.throws(()=>saveDentalVisit(s,{...targetVisit,termin:'2026-02-30 10:00'}),/prawidłową datę/);
 assert.throws(()=>saveDentalVisit(s,{...targetVisit,termin:'2026-09-23 25:00'}),/prawidłową datę/);
 assert.equal(validDay('2024-02-29'),true);assert.equal(validDay('2026-02-29'),false);
 assert.equal(s.visits.length,4);
 assert.equal(dentalProgress(s).create,false);
});
test('Simulation joins actual records, checks both tasks and invalidates queries when data changes',()=>{
 let s=simulatedBase();
 const day={kind:'day',day:'2026-09-21',order:'asc'};
 s=runDentalQuery(s,day);assert.equal(dentalProgress(s).query,false);
 s=saveDentalVisit(s,targetVisit);assert.equal(dentalProgress(s).create,true);
 s=runDentalQuery(s,{...day,order:'desc'});assert.equal(s.solved.day,undefined);
 s=runDentalQuery(s,day);
 assert.deepEqual(queryDentalRows(s,day).map(r=>r.imie),['Ada','Jan','Ewa']);
 assert.equal(dentalProgress(s).query,false);
 s=runDentalQuery(s,{kind:'patient',patient:'1',order:'asc'});
 assert.equal(dentalProgress(s).query,true);
 assert.equal(queryDentalRows(s,s.executed).length,3);
 assert.equal(queryDentalRows(s,{...day,day:'2026-10-01'}).length,0);
 s=saveDentalPatient(s,{...examplePatients[0],nazwisko:'Zmieniona'},true);
 assert.equal(dentalProgress(s).query,false);
 assert.equal(s.executed,null);
 assert.ok(queryDentalRows(s,{kind:'patient',patient:1,order:'asc'}).every(r=>r.nazwisko==='Zmieniona'));
 assert.equal(dentalProgress(dentalState()).create,false);
});
test('Dental SQL creates the intended data, joins visits and enforces keys',()=>{
 const db=new DatabaseSync(':memory:');
 try{
  const sql=readFileSync(new URL('../public/materials/gabinet-start.sql',import.meta.url),'utf8');
  db.exec(sql.split('-- B.')[0]);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM Pacjenci').get().n,3);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM Wizyty').get().n,4);
  db.exec("INSERT INTO Wizyty VALUES (5,1,'2026-09-23 10:00','kontrola')");
  assert.equal(db.prepare('SELECT COUNT(*) n FROM Wizyty WHERE id_pacjenta=1').get().n,3);
  const query=sql.slice(sql.indexOf('SELECT w.termin'),sql.indexOf('-- Wynik:'));
  assert.deepEqual(db.prepare(query).all().map(r=>[r.termin,r.imie]),[['2026-09-21 09:00','Ada'],['2026-09-21 09:30','Jan'],['2026-09-21 10:00','Ewa']]);
  assert.throws(()=>db.exec("INSERT INTO Wizyty VALUES (6,99,'2026-09-24 10:00','kontrola')"),/FOREIGN KEY/);
  assert.throws(()=>db.exec("INSERT INTO Wizyty VALUES (5,1,'2026-09-24 10:00','kontrola')"),/UNIQUE/);
 }finally{db.close();}
});
