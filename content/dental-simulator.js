// A small relational teaching model, not an SQL interpreter. No network or files.
export const dentalSchema = {
 Pacjenci:{key:'id_pacjenta',fields:{id_pacjenta:'integer',imie:'text',nazwisko:'text'}},
 Wizyty:{key:'id_wizyty',fields:{id_wizyty:'integer',id_pacjenta:'integer',termin:'datetime',cel:'text'}}
};
export const examplePatients = [
 {id_pacjenta:1,imie:'Ada',nazwisko:'Testowa'},
 {id_pacjenta:2,imie:'Jan',nazwisko:'Przykładowy'},
 {id_pacjenta:3,imie:'Ewa',nazwisko:'Modelowa'}
];
export const exampleVisits = [
 {id_wizyty:1,id_pacjenta:1,termin:'2026-09-21 09:00',cel:'przegląd'},
 {id_wizyty:2,id_pacjenta:2,termin:'2026-09-21 09:30',cel:'kontrola'},
 {id_wizyty:3,id_pacjenta:1,termin:'2026-09-22 11:00',cel:'kontrola'},
 {id_wizyty:4,id_pacjenta:3,termin:'2026-09-21 10:00',cel:'przegląd'}
];
export const targetVisit = {id_wizyty:5,id_pacjenta:1,termin:'2026-09-23 10:00',cel:'kontrola'};
export function dentalState(value={}) {
 return {tables:{},relation:false,patients:[],visits:[],drafts:{},solved:{},query:{kind:'day',day:'',patient:'',order:'asc'},...value};
}
const sameRecord=(a,b)=>Object.keys(b).every(k=>a[k]===b[k]);
export function dentalProgress(value) {
 const s=dentalState(value);
 const tables=Object.keys(dentalSchema).every(t=>s.tables[t]);
 const patients=examplePatients.every(p=>s.patients.some(x=>sameRecord(x,p)));
 const visits=[...exampleVisits,targetVisit].every(v=>s.visits.some(x=>sameRecord(x,v)));
 const create=tables&&s.relation&&patients&&visits;
 return {tables,relation:s.relation,patients,visits,create,query:create&&!!s.solved.day&&!!s.solved.patient};
}
function changed(s,patch) {return {...s,...patch,solved:{},executed:null};}
function integer(value,label) {
 if(!/^\d+$/.test(String(value))||!Number.isSafeInteger(Number(value))||Number(value)<1)throw Error(`${label}: wpisz dodatnią liczbę całkowitą.`);
 return Number(value);
}
function text(value,label) {
 const result=String(value??'').trim();
 if(!result||result.length>60)throw Error(`${label}: wpisz od 1 do 60 znaków.`);
 return result;
}
export function validDay(value) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const d=new Date(`${value}T00:00:00Z`);
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;
}
export function createDentalTable(value,name,design) {
 const s=dentalState(value),schema=dentalSchema[name];
 if(!schema)throw Error('W tym ćwiczeniu tworzymy tabele Pacjenci i Wizyty.');
 if(s.tables[name])throw Error(`Tabela ${name} już istnieje.`);
 if(design.key!==schema.key)throw Error(`Wybierz klucz jednoznacznie identyfikujący ${name==='Pacjenci'?'pacjenta':'wizytę'}. Nazwisko lub identyfikator pacjenta w wizytach mogą się powtarzać.`);
 for(const [field,type] of Object.entries(schema.fields))if(design.fields?.[field]!==type)throw Error(`Sprawdź typ pola ${field}: ${type==='integer'?'identyfikator jest liczbą całkowitą':type==='datetime'?'termin zawiera datę i godzinę':'to wartość tekstowa'}.`);
 return changed(s,{tables:{...s.tables,[name]:true}});
}
export function connectDentalTables(value,source,target) {
 const s=dentalState(value);
 if(!s.tables.Pacjenci||!s.tables.Wizyty)throw Error('Najpierw utwórz obie tabele.');
 if(source!=='id_pacjenta'||target!=='id_pacjenta')throw Error('Połącz Wizyty.id_pacjenta z Pacjenci.id_pacjenta. Numer wizyty nie wskazuje osoby.');
 return changed(s,{relation:true});
}
export function saveDentalPatient(value,input,editing=false) {
 const s=dentalState(value);
 if(!s.tables.Pacjenci)throw Error('Najpierw utwórz tabelę Pacjenci.');
 const p={id_pacjenta:integer(input.id_pacjenta,'ID pacjenta'),imie:text(input.imie,'Imię'),nazwisko:text(input.nazwisko,'Nazwisko')};
 const exists=s.patients.some(x=>x.id_pacjenta===p.id_pacjenta);
 if(exists&&!editing)throw Error('Ten ID pacjenta już istnieje. Klucz główny musi być unikalny.');
 if(!exists&&editing)throw Error('Nie znaleziono pacjenta do poprawienia.');
 return changed(s,{patients:editing?s.patients.map(x=>x.id_pacjenta===p.id_pacjenta?p:x):[...s.patients,p]});
}
export function saveDentalVisit(value,input,editing=false) {
 const s=dentalState(value);
 if(!s.tables.Wizyty||!s.relation)throw Error('Najpierw utwórz tabelę Wizyty i połącz ją z Pacjenci.');
 const id=integer(input.id_wizyty,'ID wizyty'),patient=integer(input.id_pacjenta,'ID pacjenta');
 if(!s.patients.some(p=>p.id_pacjenta===patient))throw Error(`Nie ma pacjenta o ID ${patient}. Klucz obcy musi wskazywać istniejącą osobę.`);
 const [day,time]=String(input.termin).split(' ');
 if(!validDay(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||input.termin!==`${day} ${time}`)throw Error('Wpisz prawidłową datę i godzinę wizyty.');
 const v={id_wizyty:id,id_pacjenta:patient,termin:input.termin,cel:text(input.cel,'Cel wizyty')};
 const exists=s.visits.some(x=>x.id_wizyty===id);
 if(exists&&!editing)throw Error('Ten ID wizyty już istnieje. Każda wizyta potrzebuje własnego klucza głównego.');
 if(!exists&&editing)throw Error('Nie znaleziono wizyty do poprawienia.');
 return changed(s,{visits:editing?s.visits.map(x=>x.id_wizyty===id?v:x):[...s.visits,v]});
}
export function loadExampleVisits(value) {
 let s=dentalState(value);
 if(!dentalProgress(s).patients)throw Error('Najpierw wpisz trzech pacjentów dokładnie według wzoru. Błędne dane popraw przyciskiem przy rekordzie.');
 for(const visit of exampleVisits) {
  const existing=s.visits.find(v=>v.id_wizyty===visit.id_wizyty);
  if(existing&&!sameRecord(existing,visit))throw Error(`Wizyta ${visit.id_wizyty} ma inne dane. Popraw ją według wzoru przed wczytaniem przykładów.`);
  if(!existing)s=saveDentalVisit(s,visit);
 }
 return s;
}
export function queryDentalRows(value,query) {
 const s=dentalState(value);
 return s.visits.filter(v=>query.kind==='day'?v.termin.startsWith(query.day+' '):v.id_pacjenta===Number(query.patient))
  .map(v=>({...v,...s.patients.find(p=>p.id_pacjenta===v.id_pacjenta)}))
  .sort((a,b)=>(a.termin.localeCompare(b.termin)||a.id_wizyty-b.id_wizyty)*(query.order==='desc'?-1:1));
}
export function runDentalQuery(value,query) {
 const s=dentalState(value);
 if(!s.relation)throw Error('Najpierw utwórz tabele i relację w zakładce Projekt.');
 if(!['day','patient'].includes(query.kind)||!['asc','desc'].includes(query.order))throw Error('Wybierz filtr i kolejność.');
 if(query.kind==='day'&&!validDay(query.day))throw Error('Wybierz prawidłowy dzień.');
 if(query.kind==='patient'&&!s.patients.some(p=>p.id_pacjenta===Number(query.patient)))throw Error('Wybierz pacjenta z tabeli.');
 const solved={...s.solved};
 if(dentalProgress(s).create&&query.order==='asc') {
  if(query.kind==='day'&&query.day==='2026-09-21')solved.day=true;
  if(query.kind==='patient'&&Number(query.patient)===1)solved.patient=true;
 }
 return {...s,query:{...query},executed:{...query},solved};
}
export function dentalQuerySQL(q) {
 return `SELECT w.termin, p.imie, p.nazwisko, w.cel\nFROM Wizyty AS w\nJOIN Pacjenci AS p ON w.id_pacjenta = p.id_pacjenta\nWHERE ${q.kind==='day'?`w.termin LIKE '${q.day}%'`:`p.id_pacjenta = ${Number(q.patient)}`}\nORDER BY w.termin ${q.order==='desc'?'DESC':'ASC'};`;
}
