// Czysta logika symulatora „Kreator importu tekstu” (Access, symulacja). Bez Reacta i DOM.
import {pacjenci,fieldTypes,isValidISODate} from './stomatolog-data.js';

// ---------- Pliki źródłowe ----------
const q=v=>`"${String(v).replace(/"/g,'""')}"`;
export const zapisyHeader=['Imię','Nazwisko','Płeć','Data ur.','Telefon','E-mail','Miejscowość','Zgoda RODO'];
// 12 zgłoszeń z formularza + 1 pusty (przypadkowo wysłany) formularz. Błędy są celowe.
export const zapisyRows=[
 ['Igor','Nowak','M','14.05.2007','721400101','igor.nowak@example.com','Wrocław','Tak; zgoda na SMS'],
 ['Lena','Adamczyk','K','02.11.1998','721400102','lena.adamczyk@example.com','Oława','Tak'],
 ['Jan','Przykładowy','M','03.11.1985','602345602','jan.przykladowy@example.com','Oława','Tak'],
 ['Hanna','Kurek','K','31.02.2009','721400104','hanna.kurek@example.com','Wrocław','Tak; zgoda na SMS'],
 ['Dawid','Michalak','M','19.07.1991','72140O105','dawid.michalak@example.com','Trzebnica','Tak'],
 ['','','','','','','',''],
 ['Emilia','Stępień','K','25.12.2004','721400107','emilia.stepienexample.com','Oleśnica','Tak'],
 ['Marcel','Kozłowski','M','08.03.2012','721400108','','Wrocław','Tak; zgoda na SMS'],
 ['Alicja','Wieczorek','K','30.09.1979','721400109','alicja.wieczorek@example.com','Wrocław','Tak'],
 ['Kamil','Jasiński','M','11.06.2000','721400110','kamil.jasinski@example.com','Oleśnica','Tak'],
 ['Zuzanna','Kalinowska','K','17.01.2010','721400111','','Trzebnica','Tak; zgoda na SMS'],
 ['Oskar','Pietrzak','M','05.08.1996','721400112','oskar.pietrzak@example.com','Wrocław','Tak'],
 ['Natalia','Szymańska','K','22.04.1989','721400113','natalia.szymanska@example.com','Oława','Tak']
];
const line=r=>r.every(v=>v==='')?r.map(()=>'').join(';'):r.map(q).join(';');
export const zapisyCsv=[zapisyHeader,...zapisyRows].map(line).join('\r\n')+'\r\n';
export const lekarzeCsv='imie;nazwisko;specjalizacja\r\nMarta;Zębowska;stomatolog zachowawczy\r\nPiotr;Korona;ortodonta\r\n';

// Poprawne mapowanie kolumn pliku zapisów na pola tabeli Pacjenci (null = „Nie importuj pola (pomiń)”).
export const zapisyTargets=['imie','nazwisko','plec','data_urodzenia','telefon','email','miasto',null];
export const pacjenciFields=Object.keys(fieldTypes.Pacjenci).filter(f=>f!=='id_pacjenta');
// Notatka z recepcji — źródło poprawnych wartości w etapie poprawiania.
export const receptionNote=[
 {row:3,text:'Pan Jan Przykładowy już jest naszym pacjentem (nr 2, ten sam telefon). Nie dopisujemy go drugi raz.'},
 {row:4,text:'Pani Hanna Kurek urodziła się 28.02.2009 — w formularzu pomyliła dzień.',field:4,value:'28.02.2009'},
 {row:5,text:'Pan Dawid Michalak: telefon 721400105 (w formularzu wpisał literę O zamiast zera).',field:5,value:'721400105'},
 {row:6,text:'Wiersz 6 to pusty, przypadkowo wysłany formularz.'},
 {row:7,text:'Pani Emilia Stępień: e-mail emilia.stepien@example.com (zgubiła @).',field:6,value:'emilia.stepien@example.com'}
];

export const files={
 demo:{name:'lekarze.csv',path:'C:\\Gabinet\\lekarze.csv',text:lekarzeCsv,table:'Lekarze',targets:['imie','nazwisko','specjalizacja'],startId:1},
 guided:{name:'zapisy_formularz.csv',path:'C:\\Gabinet\\zapisy_formularz.csv',text:zapisyCsv,table:'Pacjenci',targets:zapisyTargets,startId:21}
};

// ---------- Parsowanie pliku tekstowego ----------
export const delimiters={tab:'\t',semicolon:';',comma:',',space:' '};
export const delimiterLabels=[['tab','Tabulator'],['semicolon','Średnik'],['comma','Przecinek'],['space','Spacja'],['other','Inny:']];
export function delimiterChar(s){return s.delimiter==='other'?(s.other||'').slice(0,1):delimiters[s.delimiter]||'';}
export function parseLine(text,delim,qual){
 if(!delim)return [text];
 const out=[];let cur='',inQ=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(qual&&c===qual){
   if(inQ&&text[i+1]===qual){cur+=qual;i++;continue;}
   if(inQ||cur===''){inQ=!inQ;continue;}
  }
  if(!inQ&&c===delim){out.push(cur);cur='';continue;}
  cur+=c;
 }
 out.push(cur);return out;
}
export function parseText(text,s){
 const qual=s.qualifier==='none'?'':s.qualifier;
 return text.split(/\r?\n/).filter(l=>l.length>0).map(l=>parseLine(l,delimiterChar(s),qual));
}
export function previewTable(text,s){
 const rows=parseText(text,s);
 const width=Math.max(...rows.map(r=>r.length));
 const header=s.firstRow?rows[0]:Array.from({length:width},(_,i)=>`Pole${i+1}`);
 const data=s.firstRow?rows.slice(1):rows;
 return {header:Array.from({length:width},(_,i)=>header[i]??`Pole${i+1}`),data,width};
}

// ---------- Ustawienia kreatora ----------
// Komputer w gabinecie ma daty w ustawieniach regionalnych zapisane jako RRRR-MM-DD,
// więc kreator proponuje kolejność RMD i ogranicznik „-”.
export function defaultSettings(mode){
 return {menu:'',option:'new',table:'',format:'delimited',delimiter:'comma',other:'',firstRow:false,qualifier:'none',fields:null,dateOrder:'RMD',dateDelim:'-',fourDigitYears:true,leadingZeros:false,saveSteps:false,stepsName:mode==='demo'?'Import-lekarze':'Import-zapisy_formularz'};
}
export function fieldSpecs(file,s){
 const {header,width}=previewTable(file.text,s);
 return Array.from({length:width},(_,i)=>({name:s.fields?.[i]?.name??header[i],skip:!!s.fields?.[i]?.skip}));
}
export const dateOrders=['RMD','DMR','MDR','RDM','DRM','MRD'];

// ---------- Sprawdzanie kroków (informacja zwrotna prowadząca do poprawy) ----------
export function checkSource(mode,s){
 const file=files[mode==='demo'?'demo':'guided'],target=file.table;
 const persons=target==='Pacjenci';
 if(s.option==='new')return {ok:false,msg:persons?'Powstałaby druga tabela z pacjentami (np. „zapisy_formularz”). Wizyty są powiązane z tabelą Pacjenci, więc z nowymi osobami nie połączysz żadnej wizyty — relacje nie zadziałają. Dołącz rekordy do istniejącej tabeli.':'Tabela Lekarze już istnieje i ma ustawione typy pól. Nowa tabela byłaby jej kopią bez relacji z Wizytami. Dołącz rekordy do istniejącej tabeli.'};
 if(s.option==='link')return {ok:false,msg:'Tabela połączona tylko wskazuje plik — dane zostają w pliku CSV. Gdy ktoś przeniesie albo usunie plik, rekordy znikną z bazy. Chcemy mieć je na stałe w tabeli.'};
 if(!s.table)return {ok:false,msg:'Wybierz z listy tabelę, do której dołączysz kopię rekordów.'};
 if(s.table!==target)return {ok:false,msg:persons?`W pliku są dane osób (imię, telefon, e-mail), a tabela ${s.table} opisuje ${s.table==='Wizyty'?'terminy wizyt':'lekarzy'}. Wybierz tabelę Pacjenci.`:`W pliku są lekarze. Wybierz tabelę Lekarze, nie ${s.table}.`};
 return {ok:true,msg:`Dobrze: rekordy trafią do istniejącej tabeli ${target}, a relacje z wizytami będą działać.`};
}
export function checkFormat(s){
 return s.format==='delimited'?{ok:true}:{ok:false,msg:'Spójrz na surowy plik: wartości oddzielają średniki, a nie wyrównanie spacjami. Wybierz „Rozdzielany”.'};
}
export function checkDelimiter(s){
 const d=delimiterChar(s);
 if(d===';')return {ok:true,msg:'Średnik pasuje — podgląd ma osobne kolumny.'};
 if(!d)return {ok:false,msg:'Przy opcji „Inny” wpisz jeden znak ogranicznika.'};
 return {ok:false,msg:`Podgląd pokazuje dane w złych kolumnach — w tym pliku ${d===','?'przecinka':d===' '?'spacji':'tego znaku'} nie ma między polami. Spójrz na surowy plik: jaki znak powtarza się między wartościami?`};
}
export function checkHeader(mode,s){
 const msgs=[];
 if(!s.firstRow)msgs.push('Pierwszy wiersz to nagłówki kolumn. Bez opcji „Pierwszy wiersz zawiera nazwy pól” Access potraktuje je jak dane i doda „rekord” o imieniu „Imię”.');
 if(mode!=='demo'&&s.qualifier!=='"')msgs.push('W podglądzie widać cudzysłowy w danych, a zgoda „Tak; zgoda na SMS” rozpadła się na dwie kolumny (średnik w środku tekstu!). Ustaw „Kwalifikator tekstu” na ".');
 return msgs.length?{ok:false,msg:msgs.join(' ')}:{ok:true,msg:'Nagłówki i cudzysłowy ustawione poprawnie.'};
}
export function checkFields(mode,s){
 const file=files[mode==='demo'?'demo':'guided'],specs=fieldSpecs(file,s),allowed=Object.keys(fieldTypes[file.table]);
 const used=specs.filter(f=>!f.skip).map(f=>f.name);
 const unknown=specs.find(f=>!f.skip&&!allowed.includes(f.name));
 if(unknown)return {ok:false,access:`Pole „${unknown.name}” nie istnieje w tabeli docelowej „${file.table}”.`,msg:`Nagłówki pliku różnią się od nazw pól tabeli ${file.table}. Kliknij „Zaawansowane…” i w „Informacje o polach” nadaj każdej kolumnie nazwę pola z tabeli${mode==='demo'?'':' (np. Imię → imie, Data ur. → data_urodzenia). Kolumnę „Zgoda RODO” oznacz „Pomiń” — tabela nie ma takiego pola'}.`};
 const dup=used.find((n,i)=>used.indexOf(n)!==i);
 if(dup)return {ok:false,access:`Pole „${dup}” występuje więcej niż raz.`,msg:`Dwie kolumny pliku mają nazwę ${dup}. Każda kolumna musi trafić do innego pola.`};
 const wrong=specs.map((f,i)=>({f,i})).find(({f,i})=>(file.targets[i]??null)!==(f.skip?null:f.name));
 if(wrong){const col=previewTable(file.text,s).header[wrong.i];const want=file.targets[wrong.i];
  return {ok:false,msg:want===null?`Kolumna „${col}” nie pasuje do żadnego pola tabeli — zaznacz przy niej „Pomiń”.`:wrong.f.skip?`Kolumna „${col}” jest potrzebna — odznacz „Pomiń” i nadaj jej nazwę ${want}.`:`Kolumna „${col}” trafiłaby do pola ${wrong.f.name} — dane wylądują w złej kolumnie tabeli. Nadaj jej nazwę ${want}.`};}
 return {ok:true,msg:'Każda kolumna trafia do właściwego pola, a „Zgoda RODO” jest pomijana.'};
}
export function checkDates(s){
 const ok=s.dateOrder==='DMR'&&s.dateDelim==='.';
 return ok?{ok:true,msg:'Daty DD.MM.RRRR zostaną odczytane poprawnie.'}:{ok:false,msg:`Daty w pliku mają postać 14.05.2007 (dzień.miesiąc.rok), a ustawiono kolejność ${s.dateOrder} z ogranicznikiem „${s.dateDelim}”. W „Zaawansowane…” ustaw Kolejność dat: DMR i Ogranicznik daty: „.”.`};
}

// ---------- Import ----------
export function parseDateBy(value,order,delim){
 const parts=String(value).split(delim);if(parts.length!==3||parts.some(p=>!/^\d+$/.test(p)))return null;
 const m={};order.split('').forEach((k,i)=>{m[k]=parts[i];});
 if(m.R.length!==4)return null;
 const iso=`${m.R}-${m.M.padStart(2,'0')}-${m.D.padStart(2,'0')}`;
 return isValidISODate(iso)?iso:null;
}
// Importuje wiersze danych (tablice wartości) według specyfikacji pól. Zwraca rekordy i tabelę błędów.
export function importRows(rows,specs,s,table,startId){
 const key=Object.keys(fieldTypes[table])[0],types=fieldTypes[table];
 const records=[],errors=[];
 rows.forEach((r,ri)=>{
  const rec={[key]:startId+records.length};
  specs.forEach((f,i)=>{if(f.skip)return;const raw=(r[i]??'').trim();
   if(raw===''){rec[f.name]=null;return;}
   if(types[f.name]==='date'){const d=parseDateBy(raw,s.dateOrder,s.dateDelim);if(!d){errors.push({blad:'Błąd konwersji typu',pole:f.name,wiersz:ri+1});rec[f.name]=null;}else rec[f.name]=d;}
   else rec[f.name]=raw;});
  records.push(rec);
 });
 return {records,errors};
}
export function runImport(mode,s){
 const file=files[mode==='demo'?'demo':'guided'];const {data}=previewTable(file.text,s);
 return importRows(data,fieldSpecs(file,s),s,file.table,file.startId);
}

// ---------- Kontroler danych: sprawdzenie sensu, którego import NIE robi ----------
const emailOk=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export function dataProblems(records,existing=pacjenci){
 const out=[];
 for(const r of records){
  const fields=['imie','nazwisko','telefon','email','miasto','data_urodzenia','plec'];
  if(fields.every(f=>r[f]==null)){out.push({type:'empty',id:r.id_pacjenta,msg:`Rekord ${r.id_pacjenta} jest pusty — to przypadkowo wysłany formularz. Usuń ten wiersz z pliku.`});continue;}
  const twin=existing.find(p=>p.telefon===r.telefon||(p.imie===r.imie&&p.nazwisko===r.nazwisko&&p.data_urodzenia===r.data_urodzenia));
  if(twin)out.push({type:'dup',id:r.id_pacjenta,msg:`${r.imie} ${r.nazwisko} już jest w bazie jako pacjent nr ${twin.id_pacjenta} (ten sam telefon). Duplikat — usuń wiersz z pliku.`});
  if(r.telefon!=null&&!/^\d{9}$/.test(r.telefon))out.push({type:'phone',id:r.id_pacjenta,msg:`Telefon „${r.telefon}” (${r.imie} ${r.nazwisko}) nie ma 9 cyfr — SMS nie dojdzie. Popraw według notatki recepcji.`});
  if(r.email!=null&&!emailOk(r.email))out.push({type:'email',id:r.id_pacjenta,msg:`E-mail „${r.email}” (${r.imie} ${r.nazwisko}) nie ma znaku @ — wiadomość nie dojdzie. Popraw według notatki.`});
 }
 return out;
}

// ---------- Etap „Popraw i zaimportuj ponownie” ----------
export const correctSettings={...defaultSettings('guided'),option:'append',table:'Pacjenci',delimiter:'semicolon',firstRow:true,qualifier:'"',fields:zapisyTargets.map((t,i)=>({name:t??zapisyHeader[i],skip:t===null})),dateOrder:'DMR',dateDelim:'.'};
export const FIX_START_ID=34; // Autonumerowanie nie cofa się po usunięciu rekordów z pierwszego importu (21–33).
export function fixRows(fix={}){
 const deleted=new Set(fix.deleted||[]),edits=fix.edits||{};
 return zapisyRows.map((r,i)=>({row:i+1,values:r.map((v,c)=>edits[`${i+1}:${c}`]??v)})).filter(r=>!deleted.has(r.row));
}
export function evaluateFix(fix={}){
 const rows=fixRows(fix),specs=correctSettings.fields.map(f=>({...f}));
 const {records,errors}=importRows(rows.map(r=>r.values),specs,correctSettings,'Pacjenci',FIX_START_ID);
 errors.forEach(e=>{e.wiersz=rows[e.wiersz-1].row;});
 const problems=dataProblems(records);
 const byRow=n=>rows.find(r=>r.row===n);
 const resolved={
  dup:!rows.some(r=>r.values[4]==='602345602'||(r.values[0]==='Jan'&&r.values[1]==='Przykładowy')),
  empty:!rows.some(r=>r.values.slice(0,7).every(v=>v.trim()==='')),
  date:byRow(4)?.values[3].trim()==='28.02.2009',
  phone:byRow(5)?.values[4].trim()==='721400105',
  email:byRow(7)?.values[5].trim().toLowerCase()==='emilia.stepien@example.com'
 };
 const fixable={'4:3':1,'5:4':1,'7:5':1};
 const collateral=[];
 zapisyRows.forEach((orig,i)=>{const n=i+1;if(n===3||n===6)return;const r=byRow(n);
  if(!r){collateral.push(`Usunięto poprawny wiersz ${n} (${orig[0]} ${orig[1]}). Kliknij „Przywróć wiersz”.`);return;}
  orig.forEach((v,c)=>{if(c<7&&!fixable[`${n}:${c}`]&&r.values[c].trim()!==v)collateral.push(`Wiersz ${n} (${orig[0]} ${orig[1]}): zmieniono poprawną wartość „${v}” w kolumnie ${zapisyHeader[c]}. Przywróć ją.`);});
 });
 const labels={dup:'Duplikat pacjenta usunięty',empty:'Pusty wiersz usunięty',date:'Data urodzenia poprawiona',phone:'Telefon poprawiony',email:'E-mail poprawiony'};
 const score=Object.values(resolved).filter(Boolean).length;
 const done=score===5&&!collateral.length&&!errors.length&&records.length===11;
 return {records,errors,problems,resolved,labels,collateral,score,max:5,done,count:records.length};
}
