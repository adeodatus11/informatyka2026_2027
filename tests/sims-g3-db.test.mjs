// Testy logiki symulatorów baz danych klasy 3 (lekcje 22–27): node --test tests/sims-g3-db.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../content/sims/zawody-data.js';
import * as Q from '../content/sims/queryDesigner.js';
import * as Z from '../content/sims/zawodyExplorer.js';
import * as S from '../content/sims/schemaDesigner.js';
import {lessonScore} from '../content/scoring.js';

const clone=x=>JSON.parse(JSON.stringify(x));

test('Dane Zawody: spójne klucze, fikcyjne osoby, pułapki dydaktyczne na miejscu',()=>{
 assert.equal(D.zawodnicy.length,30);assert.equal(D.konkurencje.length,8);assert.equal(D.wyniki.length,61);
 assert.equal(new Set(D.wyniki.map(w=>w.id_wyniku)).size,61);
 for(const w of D.wyniki){const z=D.swimmerById(w.id_zawodnika),k=D.eventById(w.id_konkurencji);assert.ok(z&&k);assert.equal(z.plec,k.plec,'dziewczęta startują w konkurencjach dziewcząt');assert.ok(['tak','nie'].includes(w.dyskwalifikacja));}
 assert.equal(D.wyniki.filter(w=>w.dyskwalifikacja==='tak').length,4);
 const byClass={1:2011,2:2010,3:2009,4:2008};
 assert.deepEqual(D.zawodnicy.filter(z=>byClass[z.klasa[0]]!==z.rocznik).map(z=>z.nazwisko),['Baran']);
 assert.equal(D.wyniki.filter(w=>w.id_zawodnika===11).length,3,'Emilia Pietrzak ma 3 starty');
 const w=D.winner(1);assert.equal(D.fullName(D.swimmerById(w.id_zawodnika)),'Emilia Pietrzak');
 const fastest=[...D.wyniki.filter(x=>x.id_konkurencji===1)].sort((a,b)=>a.czas-b.czas)[0];
 assert.equal(fastest.dyskwalifikacja,'tak','najszybsza w 50 m dow. K jest zdyskwalifikowana');
 assert.equal(D.fmtTime(38.9),'38,90');assert.equal(D.parseTime('38,41'),38.41);assert.equal(D.parseTime('38.41 s'),null);
 const r=D.ranking(1);assert.equal(r.at(-1).miejsce,null);assert.equal(r[0].miejsce,1);
});

test('Kwerendy Zawody: 9 wzorcowych rozwiązań, liczności i typowe błędy z konkretną wskazówką',()=>{
 const ds=Q.dataset('zawody');
 for(const t of ds.tasks)assert.equal(Q.checkTask(t,t.solution).ok,true,t.id);
 assert.deepEqual(Object.fromEntries(ds.tasks.map(t=>[t.id,Q.expectedRows(t).length])),{z1a:4,z1b:9,z1c:17,z2a:7,z2b:4,z2c:15,z3a:8,z3b:10,z3c:6});
 const [a1,b1,c1,a2,,c2,a3,b3,c3]=ds.tasks;
 const noDq=clone(a2.solution);noDq.cols.pop();assert.match(Q.checkTask(a2,noDq).hint,/dyskwalifikacja/);
 const desc=clone(a2.solution);desc.cols[3].sort='desc';assert.match(Q.checkTask(a2,desc).msg,/kolejność/);
 const byId={tables:['Zawodnicy','Wyniki'],totals:false,cols:[...a2.solution.cols.slice(0,4),{...Q.emptyColumn(),field:'Wyniki.id_konkurencji',show:false,crit:['1','','']},{...Q.emptyColumn(),field:'Wyniki.dyskwalifikacja',show:false,crit:['"nie"','','']}]};
 assert.equal(Q.checkTask(a2,byId).ok,true,'id_konkurencji = 1 zamiast warunków na Konkurencje też jest poprawne');
 const orRow=clone(a1.solution);orRow.cols[4].crit=['','2008',''];assert.match(Q.checkTask(a1,orRow).msg,/za dużo/);
 const two=clone(b1.solution);two.cols[2].crit[0]='"2"';assert.match(Q.checkTask(b1,two).hint,/Jak "2\*"/);
 const gt=clone(c1.solution);gt.cols[2].crit[0]='>2009 I <=2010';assert.match(Q.checkTask(c1,gt).msg,/Brakuje/);
 const le=clone(c1.solution);le.cols[2].crit[0]='>=2009 I <=2010';assert.equal(Q.checkTask(c1,le).ok,true);
 const with25=clone(c2.solution);with25.cols.splice(3,1);assert.match(Q.checkTask(c2,with25).msg,/za dużo/);
 const comma=clone(c2.solution);comma.cols[2].crit[0]='<35,00';assert.equal(Q.checkTask(c2,comma).ok,true,'setne po przecinku');
 const maxi=clone(a3.solution);maxi.cols[3].total='max';assert.match(Q.checkTask(a3,maxi).hint,/Min/);
 const noWhere=clone(a3.solution);noWhere.cols.pop();assert.equal(Q.checkTask(a3,noWhere).ok,false,'rekord bez wykluczenia dyskwalifikacji jest zły');
 const cntZ=clone(b3.solution);cntZ.cols[1].field='Zawodnicy.id_zawodnika';assert.equal(Q.checkTask(b3,cntZ).ok,true,'Policz na dowolnym polu po złączeniu');
 const onlyZ={tables:['Zawodnicy'],totals:true,cols:[{...Q.emptyColumn(),field:'Zawodnicy.klasa'},{...Q.emptyColumn(),field:'Zawodnicy.id_zawodnika',total:'count'}]};
 assert.match(Q.checkTask(b3,onlyZ).hint,/Wyniki/);
 const hard=clone(c3.solution);hard.cols[2].crit[0]='"2B"';assert.match(Q.checkTask(c3,hard).msg,/o klasę/);
 const listWithResults={...a1.solution,tables:['Zawodnicy','Wyniki']};assert.match(Q.checkTask(a1,listWithResults).hint,/ile ma startów/);
 assert.throws(()=>Q.runQuery({tables:['Wyniki'],totals:false,cols:[{...Q.emptyColumn(),field:'Wyniki.czas',crit:['<35 s','','']}]},{},'zawody'),e=>e.message===Q.MISMATCH||e.message===Q.SYNTAX);
});

test('Kwerendy: zbiór danych nie zmienia zachowania Stomatologu; SQL i ostrzeżenia są ogólne',()=>{
 assert.equal(Q.dataset().id,'stomatolog');assert.equal(Q.dataset('nieznany').id,'stomatolog');
 assert.equal(Q.fromClause(['Pacjenci','Wizyty','Lekarze']),'Lekarze INNER JOIN (Pacjenci INNER JOIN Wizyty ON Pacjenci.id_pacjenta = Wizyty.id_pacjenta) ON Lekarze.id_lekarza = Wizyty.id_lekarza');
 assert.equal(Q.fromClause(['Wizyty','Lekarze']),'Lekarze INNER JOIN Wizyty ON Lekarze.id_lekarza = Wizyty.id_lekarza');
 assert.equal(Q.fromClause(['Zawodnicy','Wyniki','Konkurencje'],'zawody'),'Konkurencje INNER JOIN (Zawodnicy INNER JOIN Wyniki ON Zawodnicy.id_zawodnika = Wyniki.id_zawodnika) ON Konkurencje.id_konkurencji = Wyniki.id_konkurencji');
 const q=cols=>({tables:['Pacjenci','Lekarze'],totals:false,cols});
 assert.deepEqual(Q.runQuery(q([{...Q.emptyColumn(),field:'Pacjenci.imie'}])).warnings,['Tabele Pacjenci i Lekarze nie są ze sobą bezpośrednio powiązane — bez tabeli Wizyty Access łączy każdy rekord z każdym.']);
 assert.match(Q.runQuery({tables:['Zawodnicy','Konkurencje'],totals:false,cols:[{...Q.emptyColumn(),field:'Zawodnicy.imie'}]},{},'zawody').warnings[0],/bez tabeli Wyniki/);
 assert.equal(Q.levelTasks(1).length,3);assert.equal(Q.levelTasks(1,'zawody')[0].id,'z1a');
 let s={};const [t1,t2]=Q.levelTasks(1,'zawody');
 s=Q.recordCheck(s,t1,t1.solution).state;s=Q.recordCheck(s,t2,t2.solution).state;
 assert.equal(s.modes.l1.score,4);assert.match(s.modes.l1.summary,/Listy startowe: 2\/3/);assert.equal(Q.levelUnlocked(2,s,'zawody'),true);
 assert.equal(Q.dataset('zawody').format('min:Wyniki.czas',26.9),'26,90');
});

test('Zawody — arkusz: trzy problemy klikane w komórkach, punkty za pierwsze trafienie',()=>{
 assert.match(Z.checkProblem('typo',[]).msg,/Nie zaznaczono/);
 assert.match(Z.checkProblem('typo',['4:1']).msg,/Brakuje 1/);
 assert.match(Z.checkProblem('typo',['4:1','9:1','0:1']).msg,/Za dużo/);
 for(const t of Z.problemTasks)assert.equal(Z.checkProblem(t.id,t.answer).ok,true);
 let p={sel:{typo:['4:1']}};p=Z.applyProblemCheck(p,'typo').state;p={...p,sel:{typo:['4:1','9:1'],conflict:['2:2','7:2'],update:['3:2','8:2']}};
 for(const id of ['typo','conflict','update'])p=Z.applyProblemCheck(p,id).state;
 assert.deepEqual(Z.problemResult(p),{done:true,score:5,max:6,summary:'Arkusz: znaleziono 3/3 problemy'});
 for(const [r,c] of [[4,1],[9,1]])assert.equal(Z.sheetRows[r][c],'Pietrzek');
 assert.notEqual(Z.sheetRows[2][2],Z.sheetRows[7][2]);
});

test('Zawody — relacje: klucze, końce linii 1/∞ i zwyciężczyni z pułapką dyskwalifikacji',()=>{
 assert.match(Z.checkPK(['Wyniki.id_zawodnika']).hint,/powtarza/);
 assert.match(Z.checkPK(['Zawodnicy.id_zawodnika']).msg,/Brakuje/);
 assert.equal(Z.checkPK(Z.PK).ok,true);
 assert.match(Z.checkFK(['Zawodnicy.id_zawodnika']).msg,/klucz główny/);assert.equal(Z.checkFK(Z.FK).ok,true);
 assert.equal(Z.checkRel({}).ok,false);
 assert.equal(Z.checkRel(Object.fromEntries(Z.relEnds.map(e=>[e.id,e.correct]))).ok,true);
 assert.match(Z.checkRel({'zw-a':'1','zw-b':'1','wk-a':'∞','wk-b':'1'}).hint,/wiele/);
 assert.equal(Z.cycleEnd(undefined),'1');assert.equal(Z.cycleEnd('1'),'∞');assert.equal(Z.cycleEnd('∞'),'?');
 assert.match(Z.checkWinner(10).msg,/dyskwalifikacja/);assert.match(Z.checkWinner(16).msg,/nie startował/);assert.equal(Z.checkWinner(11).ok,true);
 let e={pk:Z.PK,fk:Z.FK,ends:Object.fromEntries(Z.relEnds.map(x=>[x.id,x.correct])),pick:11};
 for(const t of Z.exploreTasks)e=Z.applyExploreCheck(e,t.id).state;
 assert.deepEqual(Z.exploreResult(e),{done:true,score:8,max:8,summary:'Zwyciężczyni 50 m dow.: Emilia Pietrzak'});
 assert.equal(Z.related('Konkurencje',1).results.length,8);assert.equal(Z.related('Wyniki',2).swimmer.nazwisko,'Kaczmarek');
});

test('Zawody — tablica wyników: jedna zmiana w jednym miejscu i więzy integralności',()=>{
 let b={};
 let r=Z.addResult(b,{id_zawodnika:7,id_konkurencji:3,czas:'38,41'});assert.equal(r.ok,true);b=r.state;
 const {results,swimmers}=Z.boardData(b);
 assert.equal(D.ranking(3,results,swimmers).find(x=>x.id_wyniku===r.rec.id_wyniku).miejsce,3);
 r=Z.editClass(b,2,'1a');assert.equal(r.ok,true);b=r.state;
 assert.ok(D.ranking(7,Z.boardData(b).results,Z.boardData(b).swimmers).filter(x=>x.id_zawodnika===2).every(x=>x.klasa==='1A'));
 r=Z.addResult(b,{id_zawodnika:31,id_konkurencji:2,czas:'35,20'},'sheet');assert.equal(r.ok,false);assert.equal(r.msg,Z.ACCESS_FK_ERROR);b=r.state;
 assert.equal(Z.addResult(b,{id_zawodnika:7,id_konkurencji:3,czas:'38.41 s'}).ok,false,'zły format czasu');
 assert.equal(Z.addResult(b,{id_zawodnika:7,id_konkurencji:9,czas:'30'}).ok,false,'nieistniejąca konkurencja');
 r=Z.addSwimmer(b,{imie:'Tomasz',nazwisko:'Lis',plec:'M',klasa:'1c',rocznik:'2011'});assert.equal(r.rec.id_zawodnika,31);b=r.state;
 r=Z.addResult(b,{id_zawodnika:31,id_konkurencji:2,czas:'35,20'},'sheet');assert.equal(r.ok,true);b=r.state;
 assert.deepEqual(Z.boardResult(b),{done:true,score:6,max:6,summary:'Tablica wyników: +2 wyniki, 1 poprawka klasy, zapis-widmo odrzucony'});
 let w=Z.addResult({},{id_zawodnika:7,id_konkurencji:3,czas:'38,14'}).state;w=Z.addResult(w,{id_zawodnika:7,id_konkurencji:3,czas:'38,41'}).state;
 assert.deepEqual(Z.boardTaskStatus(w).add,{passed:true,firstTry:false});
 assert.equal(Z.boardResult({}).score,0);
});

test('Projektant bazy: wzorcowe projekty 100%, pułapki, relacje i mastery',()=>{
 for(const o of S.orders){const e=S.evaluate(o,S.solutionDesign(o));assert.equal(e.ratio,1,o.id);assert.equal(e.pass,true);assert.ok(o.pool.every(f=>/^[a-z_]+$/.test(f)));}
 const [o1,o2,o3]=S.orders;
 const noRel={...S.solutionDesign(o1),rels:[]};const e0=S.evaluate(o1,noRel);
 assert.ok(e0.ratio>=0.7);assert.equal(e0.pass,false,'bez relacji nie ma zaliczenia mimo ≥70%');
 const trap=clone(S.solutionDesign(o1));trap.tables[2].fields.push({name:'nazwisko_klienta',type:'text',pk:false});
 assert.match(S.evaluate(o1,trap).groups.find(g=>g.id==='clean').issues[0].msg,/redundancja/);
 const autoFk=clone(S.solutionDesign(o1));autoFk.tables[2].fields.find(f=>f.name==='id_klienta').type='auto';
 assert.match(S.evaluate(o1,autoFk).checks.find(c=>!c.ok).hint,/Autonumerowaniem/);
 const phone=clone(S.solutionDesign(o1));phone.tables[0].fields.find(f=>f.name==='telefon').type='num';
 assert.match(S.evaluate(o1,phone).checks.find(c=>!c.ok).hint,/Krótki tekst/);
 const shortcut=clone(S.solutionDesign(o2));shortcut.tables[2].fields.push({name:'id_klienta',type:'num',pk:false});
 assert.match(S.evaluate(o2,shortcut).groups.find(g=>g.id==='clean').issues[0].msg,/zbędny skrót/);
 const isbn=clone(S.solutionDesign(o3));isbn.tables[1].fields.find(f=>f.name==='isbn').type='num';
 assert.match(S.evaluate(o3,isbn).checks.find(c=>!c.ok).hint,/myślniki/);
 assert.equal(S.evaluate(o3,S.solutionDesign(o3,true)).bonus.ok,true);
 const oneTable={tables:[{name:'Zeszyt',fields:[{name:'imie',type:'text',pk:false}]}],rels:[]};
 assert.ok(S.evaluate(o1,oneTable).ratio<0.3);
 // Relacje i edycja
 let d=S.addTable(S.addTable(S.emptyDesign(),'Klienci'),'Wypożyczenia');d=S.addField(d,'Klienci','id_klienta');d=S.addField(d,'Wypożyczenia','id_klienta');
 assert.match(S.addRel(d,'Wypożyczenia','id_klienta','Klienci').msg,/nie ma klucza głównego/);
 d=S.togglePK(d,'Klienci','id_klienta');const r=S.addRel(d,'Wypożyczenia','id_klienta','Klienci');assert.equal(r.ok,true);
 assert.equal(S.removeTable(r.design,'Klienci').rels.length,0);
 // Punkty, mastery
 let s={design:noRel};s=S.recordCheck(s,o1).state;assert.equal(S.orderResult(s,o1).score,0);assert.equal(S.unlocked('z2',{z1:s}),false);
 s={...s,design:S.solutionDesign(o1)};s=S.recordCheck(s,o1).state;
 assert.deepEqual(S.orderResult(s,o1),{done:true,score:2,max:4,summary:'Wypożyczalnia: 100%'});
 assert.equal(S.unlocked('z2',{z1:s}),true);assert.equal(S.unlocked('z3',{z1:s}),false);
 const first=S.recordCheck({design:S.solutionDesign(o2)},o2).state;assert.equal(S.orderResult(first,o2).score,3);
});

test('Projektant bazy — Wypróbuj: typy, klucze obce i usuwanie rekordów z powiązaniami',()=>{
 for(const o of S.orders){
  let t=S.initTryout(o);const k=o.fks[0];
  const child=o.tables.find(x=>x.name===k.table);
  const input={};for(const [f,ty] of Object.entries(child.fields))input[f]=ty==='date'?'2026-10-01':ty==='bool'?true:ty==='num'||ty==='money'?'10':'x';
  for(const f of o.fks.filter(x=>x.table===k.table))input[f.field]='1';
  let r=S.tryInsert(o,t,k.table,{...input,[k.field]:'99'});assert.equal(r.ok,false);assert.match(r.msg,/wymagany jest rekord pokrewny/);t=r.t;
  r=S.tryDelete(o,t,k.ref,1);assert.equal(r.ok,false);assert.match(r.msg,/zawiera rekordy pokrewne/);t=r.t;
  r=S.tryInsert(o,t,k.table,input);assert.equal(r.ok,true,o.id);t=r.t;
  r=S.tryInsert(o,t,k.table,input);t=r.t;assert.equal(S.tryoutDone(t),true);
  const bad=Object.entries(child.fields).find(([,ty])=>ty==='date');if(bad)assert.match(S.tryInsert(o,t,k.table,{...input,[bad[0]]:'jutro'}).msg,/typem danych/);
 }
 let s={design:S.solutionDesign(S.orders[0]),tryout:{...S.initTryout(S.orders[0]),added:2,rejected:1}};s=S.recordCheck(s,S.orders[0]).state;
 assert.equal(S.orderResult(s,S.orders[0]).score,4);
});

test('Lekcje 22–27: klasa 3, czas, karta wyniku ze stałym maksimum, symulatory w źródłach',async()=>{
 const files=['22-swimming-database.js','23-dental-database-g3.js','24-database-tasks.js','25-queries-zawody.js','26-import-queries-g3.js','27-mail-merge-g3.js'];
 const sims=['zawodyExplorer','schemaDesigner','queryDesigner','importWizard','mailMerge'];
 for(const f of files){
  const l=(await import(new URL('../content/lessons/'+f,import.meta.url))).default;
  assert.equal(l.grade,3,f);assert.equal(l.id,f.slice(0,2));
  assert.ok(l.duration>=30&&l.duration<=45);assert.equal(l.sections.reduce((s,x)=>s+x.duration,0),l.duration,f);
  assert.ok(l.format?.methods?.length>=2);
  const card=l.sections.at(-1).activities.find(a=>a.type==='resultCard');assert.ok(card,f);
  const empty=lessonScore(l,card,{});assert.equal(empty.score,0);assert.ok(empty.max>0);
  const acts=l.sections.flatMap(s=>s.activities);
  for(const a of acts.filter(a=>sims.includes(a.type)))assert.ok(card.sources.includes(a.id),`${f}: ${a.id} w karcie`);
  assert.ok(!JSON.stringify(l).match(/prac[ay] domow|w domu/i),'bez pracy domowej');
 }
 const l23=(await import('../content/lessons/23-dental-database-g3.js')).default,l05=(await import('../content/lessons/05-dental-database.js')).default;
 assert.equal(l05.sections.flatMap(s=>s.activities).some(a=>a.type==='resultCard'),false,'lekcja 05 bez zmian');
 assert.equal(l23.sections[0].activities[0].id,'db-g3-recall');assert.equal(l05.sections[0].activities.length,1);
 assert.ok(l23.sections.every(s=>s.reading?.paragraphs?.length>=2));
 const l27=(await import('../content/lessons/27-mail-merge-g3.js')).default;
 assert.ok(!JSON.stringify(l27).includes('lekcji 11'));
 const l25=(await import('../content/lessons/25-queries-zawody.js')).default;
 assert.ok(l25.sections.flatMap(s=>s.activities).filter(a=>a.type==='queryDesigner').every(a=>a.dataset==='zawody'));
 const card=l25.sections.at(-1).activities.find(a=>a.type==='resultCard');
 assert.equal(lessonScore(l25,card,{}).max,22);
});
