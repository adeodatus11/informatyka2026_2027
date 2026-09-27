// Czysta logika symulatora „Zawody” (lekcja 22): arkusz z problemami, widok relacji i tablica wyników.
// Tryby (wspólny stateKey, wynik w value.modes[mode]): 'problem', 'explore', 'board'.
import * as D from './zawody-data.js';

export const pts=n=>String(n).replace('.',',');
const taskPoints=t=>t?.passed?(t.firstTry?2:1):0;
function record(prev={attempts:0},ok){if(prev.passed)return prev;return {...prev,attempts:prev.attempts+1,passed:ok,firstTry:ok&&prev.attempts===0};}

// ───────── Tryb 'problem': jedna płaska tabela „jak w Excelu” ─────────
export const sheetColumns=['Imię','Nazwisko','Klasa','Konkurencja','Czas'];
const R=(imie,nazwisko,klasa,konk,czas)=>[imie,nazwisko,klasa,konk,czas];
// Wiersze 1..12 (w arkuszu wiersz 1 to nagłówek, więc dane są w wierszach 2..13).
export const sheetRows=[
 R('Emilia','Pietrzak','4A','50 m dowolny K','32,46'),
 R('Laura','Grabowska','4B','50 m dowolny K','33,05'),
 R('Kacper','Woźniak','2B','50 m dowolny M','30,62'),
 R('Lena','Wójcik','1B','50 m klasyczny K','47,35'),
 R('Emilia','Pietrzek','4A','50 m grzbietowy K','38,20'),
 R('Julia','Wieczorek','3A','50 m dowolny K','33,87'),
 R('Igor','Pawlak','4A','50 m dowolny M','26,93'),
 R('Kacper','Woźniak','2C','50 m klasyczny M','40,58'),
 R('Lena','Wójcik','1B','25 m motylkowy K','18,93'),
 R('Emilia','Pietrzek','4A','25 m motylkowy K','17,38'),
 R('Igor','Pawlak','4A','25 m motylkowy M','13,64'),
 R('Laura','Grabowska','4B','25 m motylkowy K','16,71')
];
export const cellId=(row,col)=>`${row}:${col}`; // row: indeks danych od 0, col: indeks kolumny od 0
export const cellName=id=>{const [r,c]=id.split(':').map(Number);return `${'ABCDE'[c]}${r+2}`;};
export const problemTasks=[
 {id:'typo',kind:'Niespójność zapisu',title:'Gdzie „zniknęła” Emilia?',
  text:'Filtr „Nazwisko = Pietrzak” pokazuje tylko 1 start Emilii, a płynęła 3 razy. Kliknij komórki, przez które filtr jej nie widzi.',
  answer:['4:1','9:1'],
  hintMissing:'Przejrzyj kolumnę Nazwisko we wszystkich wierszach Emilii (4A). Szukaj innej pisowni.',
  hintExtra:'Zaznacz tylko komórki z błędną pisownią nazwiska — imię i klasa są dobrze.',
  lesson:'Ta sama osoba zapisana na dwa sposoby. Komputer nie zgaduje, że „Pietrzek” to „Pietrzak” — filtr, suma i ranking ją zgubią.'},
 {id:'conflict',kind:'Sprzeczne dane',title:'W której klasie jest Kacper?',
  text:'Kacper Woźniak startował dwa razy. Kliknij dwie komórki, które sobie przeczą.',
  answer:['2:2','7:2'],
  hintMissing:'Porównaj kolumnę Klasa w obu wierszach Kacpra Woźniaka. Zaznacz obie komórki — nie wiesz, która jest prawdziwa.',
  hintExtra:'Zaznacz tylko dwie komórki z klasą Kacpra.',
  lesson:'Ta sama informacja zapisana w dwóch miejscach rozjechała się: 2B czy 2C? Arkusz nie powie, która wersja jest prawdziwa.'},
 {id:'update',kind:'Trudna aktualizacja',title:'Lena zmienia klasę',
  text:'Lena Wójcik przeniosła się do klasy 1A. Kliknij wszystkie komórki, które trzeba teraz poprawić.',
  answer:['3:2','8:2'],
  hintMissing:'Lena ma więcej niż jeden start. Każdy jej wiersz ma własną kopię klasy.',
  hintExtra:'Zmienia się tylko klasa — imię, nazwisko i czasy zostają.',
  lesson:'Jedna zmiana = poprawki w każdym wierszu tej osoby. Przy 120 wynikach łatwo coś pominąć — i mamy kolejną sprzeczność.'}
];
export function checkProblem(taskId,selected=[]){
 const t=problemTasks.find(x=>x.id===taskId);
 const sel=new Set(selected),ans=new Set(t.answer);
 const missing=t.answer.filter(a=>!sel.has(a)),extra=[...sel].filter(a=>!ans.has(a));
 if(!sel.size)return {ok:false,msg:'Nie zaznaczono żadnej komórki.',hint:'Kliknij komórkę w arkuszu — zaznaczy się na niebiesko. Kliknij ponownie, aby odznaczyć.'};
 if(!missing.length&&!extra.length)return {ok:true,msg:`Trafione: ${t.answer.map(cellName).join(' i ')}. To ${t.kind.toLowerCase()}.`,hint:t.lesson};
 if(extra.length&&!missing.length)return {ok:false,msg:`Za dużo: ${extra.length} ${extra.length===1?'komórka nie pasuje':'komórki nie pasują'}.`,hint:t.hintExtra};
 return {ok:false,msg:`Brakuje ${missing.length} z ${t.answer.length} komórek${extra.length?`, a ${extra.length} zaznaczono niepotrzebnie`:''}.`,hint:t.hintMissing};
}
export function problemResult(p={}){
 const ts=p.tasks||{};const solved=problemTasks.filter(t=>ts[t.id]?.passed);
 const score=problemTasks.reduce((s,t)=>s+taskPoints(ts[t.id]),0);
 return {done:solved.length===problemTasks.length,score,max:6,summary:solved.length?`Arkusz: znaleziono ${solved.length}/3 problemy`:undefined};
}
export function applyProblemCheck(p={},taskId){
 const r=checkProblem(taskId,p.sel?.[taskId]||[]);
 return {state:{...p,tasks:{...p.tasks,[taskId]:record(p.tasks?.[taskId],r.ok)}},result:r};
}

// ───────── Tryb 'explore': widok Relacje + arkusze danych ─────────
export const PK=['Zawodnicy.id_zawodnika','Wyniki.id_wyniku','Konkurencje.id_konkurencji'];
export const FK=['Wyniki.id_zawodnika','Wyniki.id_konkurencji'];
// Końce linii relacji w widoku Relacje: lewa linia Zawodnicy–Wyniki, prawa Wyniki–Konkurencje.
export const relEnds=[
 {id:'zw-a',table:'Zawodnicy',line:'zw',correct:'1'},
 {id:'zw-b',table:'Wyniki',line:'zw',correct:'∞'},
 {id:'wk-a',table:'Wyniki',line:'wk',correct:'∞'},
 {id:'wk-b',table:'Konkurencje',line:'wk',correct:'1'}
];
export const cycleEnd=v=>v==='1'?'∞':v==='∞'?'?':'1';
export const exploreTasks=[
 {id:'pk',title:'Klucze główne',text:'W każdej tabeli kliknij pole, które jest kluczem głównym (jednoznacznie wskazuje rekord). Ikony kluczy są ukryte — to Twoje zadanie.'},
 {id:'fk',title:'Klucze obce',text:'Kliknij pola, które są kluczami obcymi — wskazują rekord w innej tabeli.'},
 {id:'rel',title:'Relacje 1–∞',text:'Kliknij końce obu linii relacji i ustaw na każdym „1” albo „∞” (wiele). Podpowiedź: ile startów może mieć jeden zawodnik?'},
 {id:'winner',title:'Kto wygrał?',text:'Znajdź zwyciężczynię 50 m stylem dowolnym dziewcząt, idąc po relacjach: Konkurencje → Wyniki → Zawodnicy. Zaznacz ją w tabeli Zawodnicy i kliknij „Zgłoś zwyciężczynię”.'}
];
const tableOf=f=>f.split('.')[0];
export function checkPK(sel=[]){
 const s=new Set(sel);
 const wrong=[...s].filter(f=>!PK.includes(f));
 if(wrong.length){const f=wrong[0];
  if(FK.includes(f))return {ok:false,msg:`${f} nie jest kluczem głównym.`,hint:`Wartość ${f.split('.')[1]} powtarza się w tabeli Wyniki (Emilia Pietrzak ma 3 starty). Klucz główny nie może się powtarzać.`};
  if(/nazwisko|imie/.test(f))return {ok:false,msg:`${f} nie jest kluczem głównym.`,hint:'Nazwiska się powtarzają — w bazie są Maja i Tymon Król. Klucz główny musi być unikalny.'};
  return {ok:false,msg:`${f} nie jest kluczem głównym.`,hint:'Szukaj pola, którego wartość jest inna w każdym rekordzie i nigdy się nie zmienia.'};}
 const missing=['Zawodnicy','Wyniki','Konkurencje'].filter(t=>![...s].some(f=>tableOf(f)===t));
 if(missing.length)return {ok:false,msg:`Brakuje klucza głównego w tabeli ${missing.join(', ')}.`,hint:'Każda tabela ma swój klucz główny — zaznacz po jednym polu w każdej.'};
 return {ok:true,msg:'Trzy klucze główne: id_zawodnika, id_wyniku, id_konkurencji. Każdy numer występuje w swojej tabeli tylko raz.'};
}
export function checkFK(sel=[]){
 const s=new Set(sel);
 const pk=[...s].filter(f=>PK.includes(f));
 if(pk.length)return {ok:false,msg:`${pk[0]} to klucz główny, a nie obcy.`,hint:'Klucz główny jest wskazywany. Klucz obcy wskazuje — stoi w tabeli, która „łączy” pozostałe.'};
 const other=[...s].filter(f=>!FK.includes(f));
 if(other.length)return {ok:false,msg:`${other[0]} nie wskazuje innej tabeli.`,hint:'Klucze obce to pola id_… w tabeli Wyniki, które nie są jej kluczem głównym.'};
 if(s.size<FK.length)return {ok:false,msg:`Znaleziono ${s.size} z ${FK.length} kluczy obcych.`,hint:'Wynik mówi, KTO płynął i W CZYM. Każda z tych informacji to osobny klucz obcy.'};
 return {ok:true,msg:'Wyniki.id_zawodnika wskazuje zawodnika, a Wyniki.id_konkurencji — konkurencję. Dlatego wynik nie przechowuje nazwiska ani stylu.'};
}
export function checkRel(ends={}){
 const bad=relEnds.filter(e=>ends[e.id]!==e.correct);
 if(!bad.length)return {ok:true,msg:'Zawodnicy 1–∞ Wyniki i Konkurencje 1–∞ Wyniki. Jeden zawodnik ma wiele startów, ale każdy start należy do jednego zawodnika.'};
 if(bad.some(e=>ends[e.id]==null||ends[e.id]==='?'))return {ok:false,msg:'Nie wszystkie końce linii są ustawione.',hint:'Kliknij każdy koniec obu linii, aż pokaże „1” albo „∞”.'};
 const e=bad[0];
 return {ok:false,msg:`Sprawdź koniec linii przy tabeli ${e.table}.`,hint:e.table==='Wyniki'?'Emilia Pietrzak ma 3 rekordy w Wyniki, a konkurencja nr 1 — 8. Po stronie Wyniki jest „wiele” (∞).':'Jeden wynik dotyczy dokładnie jednego zawodnika i jednej konkurencji — po tej stronie jest „1”.'};
}
export const WINNER_EVENT=1;
export function checkWinner(id){
 if(id==null)return {ok:false,msg:'Najpierw zaznacz zawodniczkę w tabeli Zawodnicy.',hint:'Kliknij wiersz w arkuszu Zawodnicy, a potem „Zgłoś zwyciężczynię”.'};
 const w=D.winner(WINNER_EVENT);const z=D.swimmerById(id);
 if(Number(id)===w.id_zawodnika)return {ok:true,msg:`Tak! ${D.fullName(z)} (${z.klasa}), czas ${D.fmtTime(w.czas)} s. Przeszedłeś/-aś tę samą drogę co kwerenda: Konkurencje → Wyniki → Zawodnicy.`};
 const starts=D.wyniki.filter(r=>r.id_konkurencji===WINNER_EVENT&&r.id_zawodnika===Number(id));
 if(!starts.length)return {ok:false,msg:`${D.fullName(z)} nie startował(a) w 50 m dowolnym dziewcząt.`,hint:'W Konkurencje sprawdź id tej konkurencji, a w Wyniki szukaj rekordów z tym id_konkurencji.'};
 if(starts.some(r=>r.dyskwalifikacja==='tak'))return {ok:false,msg:`${D.fullName(z)} ma najlepszy czas (${D.fmtTime(starts[0].czas)}), ale dyskwalifikacja = tak.`,hint:'Zdyskwalifikowana zawodniczka nie jest klasyfikowana. Szukaj najlepszego czasu z dyskwalifikacja = nie.'};
 return {ok:false,msg:`${D.fullName(z)} startowała, ale to nie najlepszy czas.`,hint:'Porównaj czasy wszystkich wyników z id_konkurencji = 1. Najmniejszy czas wygrywa.'};
}
const exploreCheckers={pk:s=>checkPK(s.pk),fk:s=>checkFK(s.fk),rel:s=>checkRel(s.ends),winner:s=>checkWinner(s.pick)};
export function applyExploreCheck(e={},taskId){
 const r=exploreCheckers[taskId](e);
 return {state:{...e,tasks:{...e.tasks,[taskId]:record(e.tasks?.[taskId],r.ok)}},result:r};
}
export function exploreResult(e={}){
 const ts=e.tasks||{};const solved=exploreTasks.filter(t=>ts[t.id]?.passed);
 const score=exploreTasks.reduce((s,t)=>s+taskPoints(ts[t.id]),0);
 const w=D.winner(WINNER_EVENT),z=D.swimmerById(w.id_zawodnika);
 return {done:solved.length===exploreTasks.length,score,max:8,summary:ts.winner?.passed?`Zwyciężczyni 50 m dow.: ${D.fullName(z)}`:solved.length?`Relacje: ${solved.length}/4 zadania`:undefined};
}
// Rekordy powiązane z zaznaczonym rekordem (nawigacja po relacjach).
export function related(table,id,swimmers=D.zawodnicy,results=D.wyniki){
 id=Number(id);
 if(table==='Wyniki'){const w=results.find(r=>r.id_wyniku===id);return w?{swimmer:D.swimmerById(w.id_zawodnika,swimmers),event:D.eventById(w.id_konkurencji)}:{};}
 if(table==='Zawodnicy')return {results:results.filter(r=>r.id_zawodnika===id)};
 if(table==='Konkurencje')return {results:results.filter(r=>r.id_konkurencji===id)};
 return {};
}

// ───────── Tryb 'board': tablica wyników liczona z bazy ─────────
export const JULIA={id_zawodnika:7,id_konkurencji:3,czas:38.41};
export const LENA={id_zawodnika:2,klasa:'1A'};
export const NEW_SWIMMER={imie:'Tomasz',nazwisko:'Lis',plec:'M',klasa:'1C',rocznik:2011,id_konkurencji:2,czas:35.2};
export const boardTasks=[
 {id:'add',title:'Spóźniony wynik',text:'Kartka od sędziego: Julia Wieczorek (3A), 50 m grzbietowym dziewcząt, 38,41 s. Dopisz ją w formularzu „Nowy wynik” i patrz na tablicę.'},
 {id:'edit',title:'Zmiana klasy',text:'Lena Wójcik przeszła do 1A (pamiętasz arkusz?). Popraw klasę raz — w formularzu Zawodnicy — i sprawdź tablicę.'},
 {id:'fk',title:'Zawodnik-widmo',text:'Tomasz Lis (M, 1C, rocznik 2011): 50 m dowolnym, 35,20 s — ale nie ma go w Zawodnicy. 1) Wpisz wynik w arkuszu Wyniki z id_zawodnika = 31. 2) Gdy baza odmówi: dodaj Tomka i zapisz wynik ponownie.'}
];
export const ACCESS_FK_ERROR='Nie można dodać lub zmienić rekordu, ponieważ w tabeli „Zawodnicy” wymagany jest rekord pokrewny.';
export function boardData(b={}){
 const swimmers=D.zawodnicy.map(z=>({...z,...(b.edits?.[z.id_zawodnika]||{})})).concat(b.newSwimmers||[]);
 const results=D.wyniki.concat(b.added||[]);
 return {swimmers,results};
}
export const nextResultId=b=>D.wyniki.length+(b.added?.length||0)+1;
export const nextSwimmerId=b=>D.zawodnicy.length+(b.newSwimmers?.length||0)+1;
export const normClass=s=>String(s||'').trim().toUpperCase().replace(/\s+/g,'');
// Próba zapisu wyniku. Zwraca {ok, state, msg, hint, error} — error = komunikat Accessa przy naruszeniu relacji.
export function addResult(b={},{id_zawodnika,id_konkurencji,czas,dq},source='form'){
 const {swimmers}=boardData(b);
 const zid=Number(id_zawodnika),kid=Number(id_konkurencji);
 const log=b.log||[];
 if(!String(id_zawodnika??'').trim()||!Number.isInteger(zid))return {ok:false,state:b,msg:'Podaj id_zawodnika (liczba całkowita).',hint:'Pole id_zawodnika jest typu Liczba.'};
 if(!Number.isInteger(kid)||!D.eventById(kid))return {ok:false,state:b,msg:'Nie można dodać lub zmienić rekordu, ponieważ w tabeli „Konkurencje” wymagany jest rekord pokrewny.',hint:'id_konkurencji musi wskazywać istniejącą konkurencję (1–8).',error:true};
 const t=D.parseTime(czas);
 if(t==null)return {ok:false,state:b,msg:'Wprowadzona wartość nie jest zgodna z typem danych Liczba w tej kolumnie.',hint:'Czas wpisz w sekundach z setnymi, np. 38,41.',error:true};
 if(!swimmers.some(z=>z.id_zawodnika===zid)){
  return {ok:false,state:{...b,log:[...log,{type:'reject',id_zawodnika:zid,source}],rejected:[...(b.rejected||[]),zid]},msg:ACCESS_FK_ERROR,hint:`W tabeli Zawodnicy nie ma rekordu o id_zawodnika = ${zid}. Klucz obcy musi wskazywać istniejący rekord — tak działają więzy integralności.`,error:true};
 }
 const rec={id_wyniku:nextResultId(b),id_zawodnika:zid,id_konkurencji:kid,czas:t,dyskwalifikacja:dq?'tak':'nie'};
 const next={...b,added:[...(b.added||[]),rec],log:[...log,{type:'add',id_wyniku:rec.id_wyniku,source,rec}]};
 return {ok:true,state:next,rec,msg:`Zapisano rekord Wyniki #${rec.id_wyniku}.`};
}
export function editClass(b={},id,klasa){
 const k=normClass(klasa);
 if(!/^[1-5][A-Z]$/.test(k))return {ok:false,state:b,msg:'Klasa ma postać cyfra + litera, np. 1A.'};
 const z=D.swimmerById(id)||b.newSwimmers?.find(x=>x.id_zawodnika===Number(id));if(!z)return {ok:false,state:b,msg:'Wybierz zawodnika.'};
 const old=(b.edits?.[z.id_zawodnika]?.klasa)||z.klasa;
 const next={...b,edits:{...b.edits,[z.id_zawodnika]:{...(b.edits?.[z.id_zawodnika]||{}),klasa:k}},log:[...(b.log||[]),{type:'edit',id_zawodnika:z.id_zawodnika,from:old,to:k}]};
 return {ok:true,state:next,msg:`Zapisano: ${D.fullName(z)} — klasa ${old} → ${k}. Zmieniono 1 komórkę.`};
}
export function addSwimmer(b={},{imie,nazwisko,plec,klasa,rocznik}){
 const k=normClass(klasa),r=Number(rocznik);
 if(!String(imie||'').trim()||!String(nazwisko||'').trim())return {ok:false,state:b,msg:'Uzupełnij imię i nazwisko.'};
 if(!['K','M'].includes(plec))return {ok:false,state:b,msg:'Wybierz płeć: K albo M.'};
 if(!/^[1-5][A-Z]$/.test(k))return {ok:false,state:b,msg:'Klasa ma postać cyfra + litera, np. 1C.'};
 if(!Number.isInteger(r)||r<2000||r>2015)return {ok:false,state:b,msg:'Rocznik to liczba, np. 2011.'};
 const z={id_zawodnika:nextSwimmerId(b),imie:imie.trim(),nazwisko:nazwisko.trim(),plec,klasa:k,rocznik:r};
 return {ok:true,state:{...b,newSwimmers:[...(b.newSwimmers||[]),z],log:[...(b.log||[]),{type:'swimmer',id_zawodnika:z.id_zawodnika}]},rec:z,msg:`Dodano rekord Zawodnicy #${z.id_zawodnika}: ${D.fullName(z)}.`};
}
export function removeAdded(b={},id){return {...b,added:(b.added||[]).filter(r=>r.id_wyniku!==id),removedAny:true};}
const same=(r,t)=>r.id_zawodnika===t.id_zawodnika&&r.id_konkurencji===t.id_konkurencji&&Math.abs(r.czas-t.czas)<0.001&&r.dyskwalifikacja==='nie';
export function boardTaskStatus(b={}){
 const added=b.added||[];
 const add=added.some(r=>same(r,JULIA));
 // Pierwsza próba = pierwszy zapisany rekord dotyczący Julii albo jej konkurencji.
 const firstAdd=(b.log||[]).find(l=>l.type==='add'&&(l.rec?.id_zawodnika===JULIA.id_zawodnika||l.rec?.id_konkurencji===JULIA.id_konkurencji));
 const addFirst=add&&!!firstAdd&&same(firstAdd.rec,JULIA);
 const lena=normClass(b.edits?.[LENA.id_zawodnika]?.klasa);
 const edit=lena===LENA.klasa;
 const edits=(b.log||[]).filter(l=>l.type==='edit');
 const editFirst=edit&&edits.length>0&&edits[0].id_zawodnika===LENA.id_zawodnika&&edits[0].to===LENA.klasa;
 const rejected=(b.rejected||[]).length>0;
 const fixed=(b.newSwimmers||[]).some(z=>added.some(r=>r.id_zawodnika===z.id_zawodnika));
 return {add:{passed:add,firstTry:addFirst},edit:{passed:edit,firstTry:editFirst},fk:{passed:rejected&&fixed,rejected,fixed,firstTry:true}};
}
export function boardResult(b={}){
 const st=boardTaskStatus(b);
 const score=taskPoints(st.add)+taskPoints(st.edit)+(st.fk.rejected?1:0)+(st.fk.fixed&&st.fk.rejected?1:0);
 const solved=['add','edit','fk'].filter(k=>st[k].passed).length;
 const bits=[];if(b.added?.length)bits.push(`+${b.added.length} ${b.added.length===1?'wynik':'wyniki'}`);if(st.edit.passed)bits.push('1 poprawka klasy');if(b.rejected?.length)bits.push('zapis-widmo odrzucony');
 return {done:solved===3,score,max:6,summary:bits.length?`Tablica wyników: ${bits.join(', ')}`:undefined};
}
