// Testy logiki symulatorów klasy 2 (lekcje 10–12, baza „Stomatolog”): node --test tests/sims-grade2.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as D from '../content/sims/stomatolog-data.js';
import * as W from '../content/sims/importWizard.js';
import * as Q from '../content/sims/queryDesigner.js';
import * as M from '../content/sims/mailMerge.js';
import {lessonScore} from '../content/scoring.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/^﻿/,'');

test('Dane Stomatolog: spójne z lekcją 05, deterministyczne i zgodne ze specyfikacją',()=>{
 assert.equal(D.lekarze.length,2);
 assert.equal(D.pacjenci.length,20);
 assert.deepEqual(D.pacjenci.slice(0,3).map(p=>`${p.imie} ${p.nazwisko}`),['Ada Testowa','Jan Przykładowy','Ewa Modelowa']);
 assert.equal(D.wizyty.length,40);
 assert.ok(D.wizyty.every(v=>v.termin>='2026-10-05'&&v.termin<'2026-10-17'));
 const tomorrow=D.visitsOn(D.TOMORROW);
 assert.equal(tomorrow.length,6);
 assert.equal(tomorrow.filter(v=>!v.email).length,2);
 assert.ok(D.pacjenci.every(p=>/^\d{9}$/.test(p.telefon)&&D.isValidISODate(p.data_urodzenia)&&['K','M'].includes(p.plec)));
 assert.ok(D.pacjenci.filter(p=>!p.email).length>=3);
 assert.ok(D.pacjenci.filter(p=>p.data_urodzenia>'2008-10-07').length>=3,'kilku niepełnoletnich');
 const names=D.pacjenci.map(p=>p.nazwisko);assert.ok(names.some((n,i)=>names.indexOf(n)!==i),'dwie osoby o tym samym nazwisku');
 assert.deepEqual([...new Set(D.pacjenci.map(p=>p.miasto))].sort(),['Oleśnica','Oława','Trzebnica','Wrocław'].sort());
 for(const v of D.wizyty){assert.ok(D.patientById(v.id_pacjenta));assert.ok(D.doctorById(v.id_lekarza));assert.ok(['przegląd','kontrola','leczenie','higienizacja','aparat'].includes(v.cel));}
 assert.equal(new Set(D.wizyty.map(v=>v.id_wizyty)).size,40);
});

test('Import: parser CSV z kwalifikatorem, podgląd i materiał do pobrania',()=>{
 assert.equal(read('public/materials/zapisy_formularz.csv'),W.zapisyCsv);
 const s={...W.defaultSettings('guided'),delimiter:'semicolon',qualifier:'"',firstRow:true};
 const p=W.previewTable(W.zapisyCsv,s);
 assert.equal(p.width,8);assert.equal(p.data.length,13);assert.deepEqual(p.header,W.zapisyHeader);
 assert.equal(p.data[0][7],'Tak; zgoda na SMS');
 assert.equal(W.previewTable(W.zapisyCsv,{...s,qualifier:'none'}).width,9,'bez kwalifikatora średnik w tekście rozbija kolumnę');
 assert.equal(W.previewTable(W.zapisyCsv,{...s,delimiter:'comma'}).width,1);
 assert.deepEqual(W.parseLine('"a""b";c',';','"'),['a"b','c']);
});

test('Import: każdy krok kreatora daje informację zwrotną prowadzącą do poprawy',()=>{
 const d=W.defaultSettings('guided');
 assert.match(W.checkSource('guided',d).msg,/relacje nie zadziałają/);
 assert.match(W.checkSource('guided',{...d,option:'link'}).msg,/zostają w pliku/);
 assert.match(W.checkSource('guided',{...d,option:'append',table:'Wizyty'}).msg,/Pacjenci/);
 assert.equal(W.checkSource('guided',{...d,option:'append',table:'Pacjenci'}).ok,true);
 assert.equal(W.checkSource('demo',{...d,option:'append',table:'Lekarze'}).ok,true);
 assert.equal(W.checkFormat({...d,format:'fixed'}).ok,false);
 assert.equal(W.checkDelimiter(d).ok,false);
 assert.equal(W.checkDelimiter({...d,delimiter:'semicolon'}).ok,true);
 assert.match(W.checkHeader('guided',{...d,firstRow:true}).msg,/Kwalifikator/);
 assert.match(W.checkHeader('guided',{...d,qualifier:'"'}).msg,/Pierwszy wiersz/);
 const hdr={...d,option:'append',table:'Pacjenci',delimiter:'semicolon',firstRow:true,qualifier:'"'};
 const f=W.checkFields('guided',hdr);assert.equal(f.ok,false);assert.match(f.access,/Pole „Imię” nie istnieje w tabeli docelowej „Pacjenci”/);
 const swapped=W.correctSettings.fields.map(x=>({...x}));swapped[0].name='nazwisko';swapped[1].name='imie';
 assert.match(W.checkFields('guided',{...hdr,fields:swapped}).msg,/złej kolumnie/);
 const noSkip=W.correctSettings.fields.map(x=>({...x,skip:false}));
 assert.match(W.checkFields('guided',{...hdr,fields:noSkip}).access,/Zgoda RODO/);
 assert.equal(W.checkFields('guided',W.correctSettings).ok,true);
 assert.equal(W.checkDates(hdr).ok,false);assert.equal(W.checkDates(W.correctSettings).ok,true);
 assert.equal(W.checkFields('demo',{...W.defaultSettings('demo'),delimiter:'semicolon',firstRow:true}).ok,true);
});

test('Import: ImportErrors łapie tylko typ, kontroler — sens danych; poprawka daje 11 pacjentów',()=>{
 const r=W.runImport('guided',W.correctSettings);
 assert.equal(r.records.length,13);assert.equal(r.records[0].id_pacjenta,21);
 assert.deepEqual(r.errors,[{blad:'Błąd konwersji typu',pole:'data_urodzenia',wiersz:4}]);
 assert.equal(r.records[0].data_urodzenia,'2007-05-14');
 assert.deepEqual(W.dataProblems(r.records).map(p=>p.type).sort(),['dup','email','empty','phone']);
 const bad=W.runImport('guided',{...W.correctSettings,dateOrder:'RMD',dateDelim:'-'});
 assert.equal(bad.errors.length,12,'zła kolejność dat = błąd w każdym wierszu z datą');
 assert.equal(W.runImport('demo',{...W.defaultSettings('demo'),delimiter:'semicolon',firstRow:true}).records.length,2);
 const start=W.evaluateFix({});assert.equal(start.score,0);assert.equal(start.done,false);
 const good={deleted:[3,6],edits:{'4:3':'28.02.2009','5:4':'721400105','7:5':'emilia.stepien@example.com'}};
 const ok=W.evaluateFix(good);assert.equal(ok.done,true);assert.equal(ok.score,5);assert.equal(ok.count,11);assert.equal(ok.records[0].id_pacjenta,34);
 const isoDate=W.evaluateFix({...good,edits:{...good.edits,'4:3':'2009-02-28'}});assert.equal(isoDate.errors.length,1);assert.equal(isoDate.done,false);
 const collateral=W.evaluateFix({...good,deleted:[3,6,9]});assert.equal(collateral.done,false);assert.match(collateral.collateral[0],/Alicja Wieczorek/);
 const partial=W.evaluateFix({deleted:[3]});assert.equal(partial.score,1);
});

test('Kwerendy: parser kryteriów w składni polskiego Accessa',()=>{
 const P=Q.parseCriterion;
 assert.deepEqual(P('Jest Null'),{t:'null',neg:false});
 assert.equal(P('Nie jest Null').t,'not');
 assert.deepEqual(P('Jest Nie Null'),{t:'null',neg:true});
 assert.equal(P('Między #2026-10-05# I #2026-10-09#').t,'between');
 assert.equal(P('Jak "K*"').t,'like');assert.equal(P('K*').t,'like');
 assert.equal(P('"Wrocław" Lub "Oława"').t,'or');assert.equal(P('>100 I <300').t,'and');
 assert.deepEqual(Q.criterionParams(P('[Podaj nazwisko pacjenta:]')),['Podaj nazwisko pacjenta:']);
 assert.throws(()=>P('"Wro'),e=>e.message===Q.SYNTAX&&/cudzysłow/.test(e.hint));
 assert.throws(()=>P('Między #2026-10-05#'),e=>/„I”/.test(e.hint));
 assert.throws(()=>P('#2026-02-30#'),/nieprawidłową składnię/);
 assert.throws(()=>P('Nowa Sól'),/nieprawidłową składnię/);
 const q={tables:['Wizyty'],totals:false,cols:[{...Q.emptyColumn(),field:'Wizyty.koszt',crit:['>300 zł','','']}]};
 assert.throws(()=>Q.runQuery(q),e=>e.message===Q.MISMATCH||e.message===Q.SYNTAX);
 const q2={...q,cols:[{...Q.emptyColumn(),field:'Wizyty.koszt',crit:['>zł','','']}]};
 assert.throws(()=>Q.runQuery(q2),e=>e.message===Q.MISMATCH&&/liczbą/.test(e.hint));
});

test('Kwerendy: wzorcowe rozwiązania zaliczają wszystkie 9 zleceń, a typowe błędy dostają konkretny feedback',()=>{
 for(const t of Q.tasks)assert.equal(Q.checkTask(t,t.solution).ok,true,t.id);
 const counts=Object.fromEntries(Q.tasks.map(t=>[t.id,Q.expectedRows(t).length]));
 assert.deepEqual(counts,{'1a':10,'1b':5,'1c':5,'2a':6,'2b':8,'2c':14,'3a':2,'3b':5,'3c':2});
 const [t1a,t1b,,t2a,t2b,t2c,t3a,t3b,t3c]=Q.tasks;
 const noCrit=JSON.parse(JSON.stringify(t1a.solution));noCrit.cols[3].crit[0]='';
 assert.match(Q.checkTask(t1a,noCrit).msg,/za dużo/);
 const shown=JSON.parse(JSON.stringify(t1a.solution));shown.cols[3].show=true;
 assert.match(Q.checkTask(t1a,shown).msg,/Zbędna kolumna/);
 const unsorted=JSON.parse(JSON.stringify(t1a.solution));unsorted.cols[1].sort='desc';
 assert.match(Q.checkTask(t1a,unsorted).msg,/kolejność/);
 const noPhone=JSON.parse(JSON.stringify(t1b.solution));noPhone.cols.splice(2,1);
 assert.match(Q.checkTask(t1b,noPhone).msg,/Brakuje kolumny: telefon/);
 const withVisits={...t1b.solution,tables:['Pacjenci','Wizyty']};
 assert.match(Q.checkTask(t1b,withVisits).hint,/tyle razy, ile ma wizyt/);
 const orRow=JSON.parse(JSON.stringify(t2b.solution));orRow.cols[4].crit=['','"Korona"',''];
 assert.match(Q.checkTask(t2b,orRow).msg,/za dużo/);
 const byId={tables:['Pacjenci','Wizyty'],totals:false,cols:[...t2b.solution.cols.slice(0,4),{...Q.emptyColumn(),field:'Wizyty.id_lekarza',show:false,crit:['2','','']}]};
 assert.equal(Q.checkTask(t2b,byId).ok,true,'kryterium po id_lekarza też jest poprawne');
 const alt={...t2a.solution,cols:t2a.solution.cols.map((c,i)=>i===3?{...c,crit:['Jak "2026-10-07*"','','']}:c)};
 assert.equal(Q.checkTask(t2a,alt).ok,true);
 const tomorrow={...t2a.solution,cols:t2a.solution.cols.map((c,i)=>i===3?{...c,crit:['Date()+1','','']}:c)};
 assert.equal(Q.checkTask(t2a,tomorrow).ok,true);
 const ge=JSON.parse(JSON.stringify(t2c.solution));ge.cols[2].crit[0]='>=300';
 assert.match(Q.checkTask(t2c,ge).msg,/za dużo/);
 const countWrong=JSON.parse(JSON.stringify(t3b.solution));countWrong.cols[1].total='count';
 assert.match(Q.checkTask(t3b,countWrong).msg,/Brakuje kolumny/);
 const countOther=JSON.parse(JSON.stringify(t3a.solution));countOther.cols[1].field='Wizyty.termin';
 assert.equal(Q.checkTask(t3a,countOther).ok,true,'Policz na dowolnym polu Wizyty');
 const hard=JSON.parse(JSON.stringify(t3c.solution));hard.cols[0].crit[0]='"Wiśniewska"';
 assert.match(Q.checkTask(t3c,hard).msg,/parametryczna/);
 assert.deepEqual(Q.runQuery(t3a.solution).rows,[['Zębowska',27],['Korona',13]]);
});

test('Kwerendy: SQL poglądowy, mastery i punktacja poziomów',()=>{
 const sql=Q.toSQL(Q.tasks[4].solution);
 assert.match(sql,/INNER JOIN \(Pacjenci INNER JOIN Wizyty/);assert.match(sql,/Between #2026-10-05# And #2026-10-09#/);
 assert.match(Q.toSQL(Q.tasks[6].solution),/Count\(Wizyty\.id_wizyty\) AS Policzid_wizyty[\s\S]*GROUP BY Lekarze\.nazwisko/);
 assert.match(Q.toSQL(Q.tasks[1].solution),/Is Null/);
 let s={};
 assert.equal(Q.levelUnlocked(2,s),false);
 const [a,b,c]=Q.levelTasks(1);
 const wrong={...a.solution,cols:a.solution.cols.slice(0,3)};
 s=Q.recordCheck(s,a,wrong).state;s=Q.recordCheck(s,a,a.solution).state;
 s=Q.recordCheck(s,b,b.solution).state;
 assert.deepEqual(Q.levelResult(1,s),{done:true,score:3,max:6,passed:2,summary:'Poziom 1: 2/3 zleceń'});
 assert.equal(s.modes.l1.score,3);assert.equal(Q.levelUnlocked(2,s),true);assert.equal(Q.levelUnlocked(3,s),false);
 const again=Q.recordCheck(s,b,wrong).state;assert.equal(again.tasks[b.id].passed,true,'zaliczone zostaje zaliczone');
});

test('Korespondencja seryjna: pola, formaty dat, reguły i kontroler jakości',()=>{
 assert.equal(M.formatPicture('2026-10-07 09:30','datetime','dd.MM.yyyy'),'07.10.2026');
 assert.equal(M.formatPicture('2026-10-07 09:30','datetime','HH:mm'),'09:30');
 assert.equal(M.rawValue('2026-10-07','exceldate'),'10/7/2026');
 const rec={imie:'Ada',plec:'K',email:null};const f=[['imie','text'],['plec','text'],['email','text']];
 assert.equal(M.renderRecord('{JEŻELI plec = "K" "Szanowna Pani" "Szanowny Panie"}, «imie»',rec,f).text,'Szanowna Pani, Ada');
 assert.equal(M.renderRecord('«nieznane»',rec,f).issues[0].type,'unknown');
 assert.equal(M.renderRecord('«email»',rec,f).issues[0].type,'empty');
 assert.equal(M.skipped('{POMIŃ JEŻELI email jest puste}',rec),true);
 const goodA=`{JEŻELI plec = "K" "Szanowna Pani" "Szanowny Panie"},\nPacjent: «imie» «nazwisko»\nTermin: «termin \\@ "dd.MM.yyyy"», godz. «termin \\@ "HH:mm"»\nLekarz: dr «lekarz»`;
 const A={docType:'email',source:{file:'Stomatolog.accdb',table:'Przypomnienia_jutro'},template:goodA,filters:[{field:'email',op:'notempty'}]};
 const ra=M.mergeResult('A',A);assert.equal(ra.score,6);assert.equal(ra.count,4);assert.match(ra.summary,/Ewa Modelowa, Tomasz Nowicki/);
 const noFilter=M.qualityChecks('A',{...A,filters:[]});assert.match(noFilter.find(c=>c.id==='recipients').hint,/bez e-maila/);
 assert.equal(M.mergeResult('A',{...A,filters:[],template:goodA+'\n{POMIŃ JEŻELI email jest puste}'}).score,6,'reguła Pomiń zamiast filtra');
 const starter=M.mergeResult('A',{...A,template:M.starterA});assert.equal(starter.checks.find(c=>c.id==='fields').ok,false);
 const glued=M.qualityChecks('A',{...A,template:goodA.replace('«imie» «nazwisko»','«imie»«nazwisko»')});assert.equal(glued.find(c=>c.id==='spaces').ok,false);
 const raw=M.qualityChecks('A',{...A,template:goodA.replace(' \\@ "dd.MM.yyyy"','')});assert.equal(raw.find(c=>c.id==='dates').ok,false);
 const lower=M.qualityChecks('A',{...A,template:goodA.replace('"K"','"k"')});assert.equal(lower.find(c=>c.id==='salutation').ok,false);
 const allVisits=M.qualityChecks('A',{...A,source:{file:'Stomatolog.accdb',table:'Wizyty_z_pacjentami'}});assert.equal(allVisits.find(c=>c.id==='recipients').ok,false);
 const dayFilter=M.mergeResult('A',{...A,source:{file:'Stomatolog.accdb',table:'Wizyty_z_pacjentami'},filters:[{field:'termin',op:'has',value:'2026-10-07'},{field:'email',op:'notempty'}]});assert.equal(dayFilter.score,6);
 const goodB=`«osoba_kontaktowa»\n«nazwa»\n«miasto»\n\nWrocław, «data_wyslania \\@ "dd.MM.yyyy"»\n\n{JEŻELI plec_osoby = "K" "Szanowna Pani" "Szanowny Panie"},\n\nszukam praktyk.\n\nZ poważaniem\nJan Kowal`;
 const B={docType:'letters',source:{file:'firmy_praktyki.xlsx',table:'Arkusz1$'},template:goodB,filters:[{field:'branza',op:'eq',value:'informatyka'}]};
 const rb=M.mergeResult('B',B);assert.equal(rb.score,6);assert.equal(rb.count,5);
 assert.equal(M.qualityChecks('B',{...B,template:goodB.replace('Jan Kowal','[Twoje imię i nazwisko]')}).find(c=>c.id==='signature').ok,false);
 assert.equal(M.qualityChecks('B',{...B,filters:[]}).find(c=>c.id==='recipients').ok,false);
 assert.equal(M.qualityChecks('B',{...B,template:goodB.replace(' \\@ "dd.MM.yyyy"','')}).find(c=>c.id==='dates').ok,false);
 assert.equal(M.mergeResult('B',{...B,template:M.starterB}).done,false);
 const csv=read('public/materials/firmy_praktyki.csv').trim().split(/\r?\n/);
 assert.equal(csv.length,7);assert.deepEqual(csv.slice(1).map(l=>l.split(';')[0]),M.firmy.map(f=>f.nazwa));
});

test('Lekcje 10–12: format, czas, ids aktywności, karta wyniku ze stałym maksimum',async()=>{
 for(const [file,id,dur] of [['10-data-import.js','10',40],['11-queries.js','11',44],['12-mail-merge.js','12',44]]){
  const l=(await import(new URL('../content/lessons/'+file,import.meta.url))).default;
  assert.equal(l.id,id);assert.equal(l.grade,2);assert.equal(l.duration,dur);
  assert.equal(l.sections.reduce((s,x)=>s+x.duration,0),dur);
  const card=l.sections.at(-1).activities.find(a=>a.type==='resultCard');
  const empty=lessonScore(l,card,{});
  assert.equal(empty.score,0);
  const sims=l.sections.flatMap(s=>s.activities).filter(a=>['importWizard','queryDesigner','mailMerge'].includes(a.type));
  assert.ok(sims.every(a=>a.points>0&&card.sources.includes(a.id)));
  assert.ok(!JSON.stringify(l).match(/prac[ay] domow|w domu/i),'bez pracy domowej');
 }
});

test('Korespondencja: nietknięty szablon startowy nie dostaje punktów',()=>{
 for(const [p,src,tpl] of [['A',{file:'Stomatolog.accdb',table:'Przypomnienia_jutro'},M.starterA],['B',{file:'firmy_praktyki.xlsx',table:'Arkusz1$'},M.starterB]]){
  const r=M.mergeResult(p,{docType:'email',source:src,template:tpl});
  assert.equal(r.checks.filter(c=>c.ok&&['spaces','empty','clean'].includes(c.id)).length,0,p);
 }
});
