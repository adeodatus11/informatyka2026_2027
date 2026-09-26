// Czysta logika symulatora korespondencji seryjnej (Word, symulacja): źródła danych, szablon
// z polami «pole», reguły {JEŻELI …} i {POMIŃ JEŻELI …}, filtr adresatów, scalanie i kontroler jakości.
import {pacjenci,wizyty,lekarze,joinVisit,TOMORROW} from './stomatolog-data.js';

// ---------- Źródła danych ----------
const visitRec=v=>{const j=joinVisit(v);return {_id:`w${v.id_wizyty}`,id_wizyty:v.id_wizyty,imie:j.imie,nazwisko:j.nazwisko,plec:j.plec,email:j.email,telefon:j.telefon,termin:j.termin,cel:j.cel,lekarz:j.lekarz};};
const visitFields=[['imie','text'],['nazwisko','text'],['plec','text'],['email','text'],['telefon','text'],['termin','datetime'],['cel','text'],['lekarz','text']];
export const firmy=[
 {id:1,nazwa:'Serwis Bajt s.c.',osoba_kontaktowa:'Anna Wróbel',plec_osoby:'K',branza:'informatyka',miasto:'Wrocław',email:'biuro@serwisbajt.example',data_wyslania:'2026-10-07'},
 {id:2,nazwa:'NetKabel Sp. z o.o.',osoba_kontaktowa:'Marek Sowa',plec_osoby:'M',branza:'informatyka',miasto:'Oława',email:'praktyki@netkabel.example',data_wyslania:'2026-10-07'},
 {id:3,nazwa:'Piksel Studio',osoba_kontaktowa:'Katarzyna Mróz',plec_osoby:'K',branza:'informatyka',miasto:'Wrocław',email:'kontakt@pikselstudio.example',data_wyslania:'2026-10-07'},
 {id:4,nazwa:'Kod i Kawa Software',osoba_kontaktowa:'Tomasz Rak',plec_osoby:'M',branza:'informatyka',miasto:'Oleśnica',email:'hr@kodikawa.example',data_wyslania:'2026-10-07'},
 {id:5,nazwa:'Auto-Serwis Zając',osoba_kontaktowa:'Robert Zając',plec_osoby:'M',branza:'motoryzacja',miasto:'Trzebnica',email:'warsztat@autozajac.example',data_wyslania:'2026-10-07'},
 {id:6,nazwa:'Chmura24 IT',osoba_kontaktowa:'Ewelina Grab',plec_osoby:'K',branza:'informatyka',miasto:'Wrocław',email:'rekrutacja@chmura24.example',data_wyslania:'2026-10-07'}
];
export const sources={
 'Stomatolog.accdb':{label:'Stomatolog.accdb',kind:'Baza danych programu Access',tables:{
  Lekarze:{type:'TABELA',fields:[['imie','text'],['nazwisko','text'],['specjalizacja','text']],records:()=>lekarze.map(l=>({_id:`l${l.id_lekarza}`,...l}))},
  Pacjenci:{type:'TABELA',fields:[['imie','text'],['nazwisko','text'],['plec','text'],['data_urodzenia','date'],['telefon','text'],['email','text'],['miasto','text']],records:()=>pacjenci.map(p=>({_id:`p${p.id_pacjenta}`,...p}))},
  Wizyty:{type:'TABELA',fields:[['id_pacjenta','text'],['id_lekarza','text'],['termin','datetime'],['cel','text'],['koszt','text']],records:()=>wizyty.map(v=>({_id:`w${v.id_wizyty}`,...v}))},
  Przypomnienia_jutro:{type:'KWERENDA',fields:visitFields,records:()=>wizyty.filter(v=>v.termin.startsWith(TOMORROW)).map(visitRec)},
  Wizyty_z_pacjentami:{type:'KWERENDA',fields:visitFields,records:()=>wizyty.map(visitRec)}
 }},
 'firmy_praktyki.xlsx':{label:'firmy_praktyki.xlsx',kind:'Skoroszyt programu Excel',tables:{
  'Arkusz1$':{type:'ARKUSZ',fields:[['nazwa','text'],['osoba_kontaktowa','text'],['plec_osoby','text'],['branza','text'],['miasto','text'],['email','text'],['data_wyslania','exceldate']],records:()=>firmy.map(f=>({_id:`f${f.id}`,...f}))}
 }}
};
export function getSource(sel){const t=sel&&sources[sel.file]?.tables[sel.table];return t?{...t,records:t.records()}:null;}

// ---------- Formatowanie wartości ----------
export function rawValue(v,type){
 if(v==null)return '';
 if(type==='exceldate'){const [y,m,d]=v.split('-').map(Number);return `${m}/${d}/${y}`;} // Excel → Word: format amerykański
 return String(v);
}
export function formatPicture(v,type,pic){
 if(v==null)return '';
 if(!['date','datetime','exceldate'].includes(type))return rawValue(v,type);
 const [date,time='00:00']=String(v).split(' ');const [y,m,d]=date.split('-');const [H,mi]=time.split(':');
 const map={yyyy:y,yy:y.slice(2),MM:m,M:String(+m),dd:d,d:String(+d),HH:H,H:String(+H),mm:mi};
 return pic.replace(/yyyy|yy|MM|M|dd|d|HH|H|mm/g,k=>map[k]);
}

// ---------- Szablon ----------
export const compareOps=[['=','równa się'],['<>','nie równa się'],['jest puste','jest puste'],['nie jest puste','nie jest puste']];
const FIELD_RE=/«([^«»\\]+?)(?:\s*\\@\s*"([^"]*)")?»/g;
const RULE_RE=/\{(JEŻELI|POMIŃ JEŻELI)\s+([\p{L}_0-9]+)\s+(=|<>|jest puste|nie jest puste)((?:\s*"[^"]*")*)\s*\}/gu;
export const fieldToken=(name,pic)=>pic?`«${name} \\@ "${pic}"»`:`«${name}»`;
const clean=s=>String(s).replace(/"/g,'”');
export const ifToken=(field,op,value,yes,no)=>`{JEŻELI ${field} ${op}${op==='='||op==='<>'?` "${clean(value)}"`:''} "${clean(yes)}" "${clean(no)}"}`;
export const skipToken=(field,op,value)=>`{POMIŃ JEŻELI ${field} ${op}${op==='='||op==='<>'?` "${clean(value)}"`:''}}`;
function test(op,a,b){const v=a==null?'':String(a);if(op==='jest puste')return v.trim()==='';if(op==='nie jest puste')return v.trim()!=='';if(op==='=')return v===b;return v!==b;}
function ruleParts(m){const strs=[...m[4].matchAll(/"([^"]*)"/g)].map(x=>x[1]);const needs=m[3]==='='||m[3]==='<>';return {kind:m[1],field:m[2],op:m[3],value:needs?strs[0]:undefined,yes:needs?strs[1]:strs[0],no:needs?strs[2]:strs[1],ok:m[1]==='POMIŃ JEŻELI'?strs.length===(needs?1:0):strs.length===(needs?3:2)};}
export function templateFields(tpl){return [...String(tpl).matchAll(FIELD_RE)].map(m=>m[1].trim());}
export function templateRules(tpl){return [...String(tpl).matchAll(RULE_RE)].map(ruleParts);}

// Scala jeden rekord. Zwraca tekst i listę problemów (nieznane pole, pusta wartość).
export function renderRecord(tpl,rec,fields){
 const types=Object.fromEntries(fields),issues=[];
 let text=String(tpl).replace(RULE_RE,(...m)=>{const r=ruleParts(m);
  if(!(r.field in types)){issues.push({type:'unknown',field:r.field});return 'Błąd! Nieznane pole scalania.';}
  if(r.kind==='POMIŃ JEŻELI')return '';
  if(!r.ok){issues.push({type:'rule'});return 'Błąd! Niepełna reguła.';}
  return test(r.op,rec[r.field],r.value)?r.yes:r.no;});
 text=text.replace(FIELD_RE,(_,name,pic)=>{name=name.trim();
  if(!(name in types)){issues.push({type:'unknown',field:name});return 'Błąd! Nieznane pole scalania.';}
  const v=pic?formatPicture(rec[name],types[name],pic):rawValue(rec[name],types[name]);
  if(v==='')issues.push({type:'empty',field:name});
  return v;});
 return {text,issues};
}
export function skipped(tpl,rec){return templateRules(tpl).filter(r=>r.kind==='POMIŃ JEŻELI').some(r=>test(r.op,rec[r.field],r.value));}

// ---------- Adresaci: pola wyboru, filtr, sortowanie ----------
export const filterOps=[['eq','Równa się'],['ne','Nie równa się'],['lt','Mniejsze niż'],['gt','Większe niż'],['empty','Jest puste'],['notempty','Nie jest puste'],['has','Zawiera'],['hasnot','Nie zawiera']];
export function passFilter(rec,f,types){
 if(!f?.field)return true;const v=rawValue(rec[f.field],types[f.field]),w=f.value??'';
 const c=v.localeCompare(w,'pl',{numeric:true,sensitivity:'accent'});
 return {eq:c===0,ne:c!==0,lt:c<0,gt:c>0,empty:v.trim()==='',notempty:v.trim()!=='',has:v.toLowerCase().includes(w.toLowerCase()),hasnot:!v.toLowerCase().includes(w.toLowerCase())}[f.op]??true;
}
export function listRecords(state){
 const src=getSource(state.source);if(!src)return [];
 const types=Object.fromEntries(src.fields);
 let recs=src.records.filter(r=>(state.filters||[]).every(f=>passFilter(r,f,types)));
 if(state.sort?.field){const k=state.sort.field;recs=[...recs].sort((a,b)=>rawValue(a[k],types[k]).localeCompare(rawValue(b[k],types[k]),'pl',{numeric:true})*(state.sort.dir==='desc'?-1:1));}
 return recs;
}
export function recipients(state){
 const off=new Set(state.unchecked||[]);
 return listRecords(state).filter(r=>!off.has(r._id)&&!skipped(state.template||'',r));
}

// ---------- Projekty i kontroler jakości ----------
export const starterA=`[powitanie],

przypominamy o wizycie w gabinecie stomatologicznym:
Pacjent: [imię] [nazwisko]
Termin: [data], godz. [godzina]
Lekarz: dr [lekarz]

W razie zmiany planów prosimy o telefon: 71 000 00 00.
Recepcja gabinetu`;
export const starterB=`[osoba kontaktowa]
[nazwa firmy]
[miasto]

Wrocław, [data wysłania]

[powitanie],

nazywam się [Twoje imię i nazwisko] i uczę się w technikum w zawodzie technik informatyk. Szukam miejsca na praktyki zawodowe (4 tygodnie, maj–czerwiec 2027). Chętnie pomogę w firmie [nazwa firmy] przy [napisz, co umiesz: np. konfiguracji komputerów, obsłudze klienta].

Czy mogę przyjść na krótką rozmowę?

Z poważaniem
[Twoje imię i nazwisko]`;
export const demoTemplate=`{JEŻELI plec = "K" "Szanowna Pani" "Szanowny Panie"},
przypominamy o wizycie «termin \\@ "dd.MM.yyyy"» o godz. «termin \\@ "HH:mm"».
Lekarz: dr «lekarz»
Recepcja gabinetu`;
export const docTypes=[['letters','Listy'],['email','Wiadomości e-mail'],['envelopes','Koperty'],['labels','Etykiety'],['directory','Katalog'],['normal','Normalny dokument programu Word']];

const TARGET_A=wizyty.filter(v=>v.termin.startsWith(TOMORROW)&&pacjenci.find(p=>p.id_pacjenta===v.id_pacjenta).email).map(v=>`w${v.id_wizyty}`);
const TARGET_B=firmy.filter(f=>f.branza==='informatyka').map(f=>`f${f.id}`);
export const phoneInstead=()=>wizyty.filter(v=>v.termin.startsWith(TOMORROW)).map(joinVisit).filter(v=>!v.email).map(v=>`${v.imie} ${v.nazwisko}`);
const FEM=/\bPani\b/,MASC=/\bPan(ie|a|u)?\b/;
const sameSet=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));

export function mergeDocs(state){
 const src=getSource(state.source);if(!src)return [];
 return recipients(state).map(r=>({rec:r,...renderRecord(state.template||'',r,src.fields)}));
}
export function qualityChecks(project,state){
 const src=getSource(state.source),docs=mergeDocs(state),tpl=state.template||'';
 const fieldsUsed=new Set(templateFields(tpl)),ids=docs.map(d=>d.rec._id);
 const leftovers=/[«»\[\]]|Błąd!/;
 const bad=docs.find(d=>leftovers.test(d.text)||d.issues.some(i=>i.type==='unknown'||i.type==='rule'));
 const out=[];
 const add=(id,label,ok,hint)=>out.push({id,label,ok,hint:ok?'':hint});
 const minFields=project==='B'?3:2;
 add('fields',project==='B'?'Wszystkie pola podstawione (brak «», [ ], błędów) i co najmniej 3 różne pola':'Wszystkie pola podstawione — brak «», [ ] i błędów pól',
  docs.length>0&&!bad&&fieldsUsed.size>=minFields,
  !docs.length?'Brak dokumentów — sprawdź listę adresatów.':bad?(/\[/.test(bad.text)?'W tekście zostały miejsca w nawiasach [ ]. Zaznacz każde i wstaw w to miejsce pole scalania (lub wpisz własny tekst).':'Któreś pole ma błąd — nazwa pola musi istnieć w źródle danych. Wstawiaj pola przyciskiem „Wstaw pole scalania”.'):`Użyj co najmniej ${minFields} różnych pól scalania (teraz: ${fieldsUsed.size}).`);
 if(project==='A'){
  const why=!state.source||state.source.table!=='Przypomnienia_jutro'&&state.source.table!=='Wizyty_z_pacjentami'?'Wybierz adresatów z bazy Stomatolog.accdb — najprościej kwerendę Przypomnienia_jutro (zrobiłeś ją na poprzedniej lekcji).':
   state.docType!=='email'?'Rozpocznij korespondencję seryjną → Wiadomości e-mail. Przypomnienia idą e-mailem.':
   ids.length>TARGET_A.length&&ids.some(id=>!TARGET_A.includes(id))&&docs.some(d=>!d.rec.email)?'Na liście są osoby bez e-maila — e-mail do nich nie dojdzie. Edytuj listę adresatów → Filtruj: email „Nie jest puste” albo Reguły → Pomiń rekord jeżeli… email jest puste.':
   ids.some(id=>!TARGET_A.includes(id))?'Na liście są wizyty z innych dni. Tylko 7.10.2026 — użyj kwerendy Przypomnienia_jutro albo filtru.':
   'Brakuje kogoś z jutrzejszych pacjentów z e-mailem. Sprawdź pola wyboru w Edytuj listę adresatów.';
  add('recipients','Wiadomości e-mail tylko do 4 osób z wizytą 7.10.2026, które mają e-mail',state.docType==='email'&&sameSet(ids,TARGET_A),why);
  add('salutation','Zwrot zgodny z płcią: Pani / Pan',docs.length>0&&docs.every(d=>d.rec.plec==='K'?FEM.test(d.text)&&!MASC.test(d.text):MASC.test(d.text)&&!FEM.test(d.text)),
   'Reguły → Jeżeli…To…Inaczej…: plec równa się K → „Szanowna Pani”, w przeciwnym razie „Szanowny Panie”. Sprawdź wielką literę K.');
  add('dates','Data jako dd.MM.yyyy i godzina jako HH:mm',docs.length>0&&docs.every(d=>{const [day,time]=d.rec.termin.split(' ');return d.text.includes(formatPicture(d.rec.termin,'datetime','dd.MM.yyyy'))&&d.text.includes(time)&&!d.text.includes(day);}),
   'Wstaw pole termin z formatem dd.MM.yyyy (data) i drugi raz z formatem HH:mm (godzina). Bez formatu Word pokaże „2026-10-07 09:30”.');
 }else{
  const why=!state.source||state.source.file!=='firmy_praktyki.xlsx'?'Wybierz adresatów → Użyj istniejącej listy… → firmy_praktyki.xlsx.':
   ids.some(id=>!TARGET_B.includes(id))?'Na liście jest firma spoza branży informatyka. Filtruj: branza „Równa się” informatyka (albo odznacz ją).':'Brakuje którejś firmy z branży informatyka — sprawdź pola wyboru i filtr.';
  add('recipients','Tylko 5 firm z branży informatyka',sameSet(ids,TARGET_B),why);
  add('salutation','Powitanie z regułą: Szanowna Pani / Szanowny Panie',docs.length>0&&templateRules(tpl).some(r=>r.kind==='JEŻELI')&&docs.every(d=>d.rec.plec_osoby==='K'?d.text.includes('Szanowna Pani')&&!d.text.includes('Szanowny Pan'):d.text.includes('Szanowny Panie')&&!d.text.includes('Szanowna Pani')),
   'Reguły → Jeżeli…To…Inaczej…: plec_osoby równa się K → „Szanowna Pani”, inaczej „Szanowny Panie”.');
  add('dates','Data wysłania w formacie dd.MM.yyyy',docs.length>0&&fieldsUsed.has('data_wyslania')&&docs.every(d=>d.text.includes(formatPicture(d.rec.data_wyslania,'exceldate','dd.MM.yyyy'))&&!d.text.includes(rawValue(d.rec.data_wyslania,'exceldate'))),
   fieldsUsed.has('data_wyslania')?'Excel przekazał datę jako 10/7/2026 (format amerykański). Wstaw pole data_wyslania z formatem dd.MM.yyyy.':'Wstaw pole data_wyslania (z formatem dd.MM.yyyy) w miejsce [data wysłania].');
 }
 const glued=/»«|»\{|\}«/.test(tpl);
 const empty=docs.find(d=>d.issues.some(i=>i.type==='empty'));
 const gluedHint='Dwa pola stoją obok siebie bez spacji (np. «imie»«nazwisko» → „AdaTestowa”). Wstaw spację między nimi.';
 const emptyHint=empty?`Pole ${empty.issues.find(i=>i.type==='empty').field} jest puste u adresata ${[empty.rec.imie||empty.rec.nazwa,empty.rec.nazwisko].filter(Boolean).join(' ')}. Usuń to pole z treści albo odfiltruj takie rekordy.`:'Brak dokumentów do sprawdzenia.';
 if(project==='A'){
  add('spaces','Spacje między polami (bez „AdaTestowa”)',docs.length>0&&!glued,glued?gluedHint:'Brak dokumentów do sprawdzenia.');
  add('empty','Brak pustych wartości w treści',docs.length>0&&!empty,emptyHint);
 }else add('clean','Spacje między polami i brak pustych wartości',docs.length>0&&!glued&&!empty,glued?gluedHint:emptyHint);
 if(project==='B'){
  const lines=tpl.split('\n').map(l=>l.trim()).filter(Boolean),last=lines[lines.length-1]||'';
  const ok=last.length>=3&&!/[«»{}\[\]]/.test(last)&&!/^z poważaniem/i.test(last);
  add('signature','Podpis ucznia pod listem',ok,'W ostatniej linii wpisz swoje imię i nazwisko (zamiast [Twoje imię i nazwisko]).');
 }
 return out;
}
export function mergeResult(project,state){
 const checks=qualityChecks(project,state),score=checks.filter(c=>c.ok).length,docs=mergeDocs(state);
 const n=docs.length,few=n%10>=2&&n%10<=4&&(n%100<12||n%100>14);
 const summary=project==='A'?`${n} ${n===1?'przypomnienie e-mail gotowe':few?'przypomnienia e-mail gotowe':'przypomnień e-mail gotowych'}; recepcja dzwoni do osób bez e-maila: ${phoneInstead().join(', ')}`:`${n} ${n===1?'list o praktyki gotowy':few?'listy o praktyki gotowe':'listów o praktyki gotowych'}`;
 return {checks,score,max:6,done:score>=4,summary,count:docs.length};
}
