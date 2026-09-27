// Czysta logika symulatora „Projektant bazy” (lekcja 24): trzy zlecenia, projekt tabel, pól, typów,
// kluczy i relacji, automatyczna ocena wg reguł, mastery (≥70%) i „Wypróbuj” (więzy integralności).
// Tryby (wspólny stateKey): 'z1', 'z2', 'z3' — wynik w value.modes[mode].

export const TYPES=[['auto','Autonumerowanie'],['num','Liczba'],['text','Krótki tekst'],['date','Data/Godzina'],['money','Waluta'],['bool','Tak/Nie']];
export const typeLabel=t=>TYPES.find(x=>x[0]===t)?.[1]||t;
export const PASS=0.7;
const T=(name,pk,fields)=>({name,pk,fields});

export const orders=[
 {id:'z1',title:'Wypożyczalnia sprzętu „Na Fali”',short:'Wypożyczalnia',icon:'swim',
  story:'Pan Marek wypożycza nad jeziorem kajaki, deski SUP i rowery. Wszystko pisze w zeszycie: kto, co, kiedy wziął i czy oddał. Ci sami klienci wracają kilka razy w sezonie, a zeszyt puchnie od przepisywanych nazwisk. Zaprojektuj mu bazę: klienci, sprzęt z ceną za dobę i wypożyczenia.',
  sample:{title:'Zeszyt pana Marka',columns:['Data','Klient','Telefon','Sprzęt','Cena/doba','Zwrot'],rows:[['2026-07-03','Ola Nowak','600 100 200','Kajak K2','60,00 zł','2026-07-04 ✓'],['2026-07-05','Ola Nowak','600 100 200','SUP Air','80,00 zł','—'],['2026-07-05','Kuba Lis','601 200 300','Rower trekkingowy','45,00 zł','2026-07-05 ✓']]},
  tables:[T('Klienci','id_klienta',{imie:'text',nazwisko:'text',telefon:'text'}),T('Sprzęt','id_sprzetu',{nazwa:'text',cena_za_dobe:'money'}),T('Wypożyczenia','id_wypozyczenia',{data_wypozyczenia:'date',data_zwrotu:'date',zwrocono:'bool'})],
  fks:[{table:'Wypożyczenia',field:'id_klienta',ref:'Klienci'},{table:'Wypożyczenia',field:'id_sprzetu',ref:'Sprzęt'}],
  distractors:['Zeszyt'],
  pool:['id_klienta','imie','nazwisko','wiek','telefon','id_sprzetu','nazwa','cena_za_dobe','id_wypozyczenia','data_wypozyczenia','nazwisko_klienta','data_zwrotu','zwrocono','wartosc_wypozyczenia'],
  traps:{wiek:'Pole „wiek” to pułapka: wiek zmienia się co roku, a wypożyczalni nie jest potrzebny. Nie dodawaj pól, których zlecenie nie wymaga.',nazwisko_klienta:'„nazwisko_klienta” w wypożyczeniu to redundancja — klienta wskazuje id_klienta, a nazwisko jest raz, w tabeli Klienci.',wartosc_wypozyczenia:'„wartosc_wypozyczenia” da się policzyć (cena × liczba dni). Pól wyliczanych nie przechowujemy — policzy je kwerenda.'},
  distractorMsg:'Tabela „Zeszyt” = jedna tabela na wszystko, czyli arkusz z przepisywanymi nazwiskami. Usuń ją.',
  sampleData:{Klienci:[{id_klienta:1,imie:'Ola',nazwisko:'Nowak',telefon:'600100200'},{id_klienta:2,imie:'Kuba',nazwisko:'Lis',telefon:'601200300'}],'Sprzęt':[{id_sprzetu:1,nazwa:'Kajak K2',cena_za_dobe:60},{id_sprzetu:2,nazwa:'SUP Air',cena_za_dobe:80},{id_sprzetu:3,nazwa:'Rower trekkingowy',cena_za_dobe:45}],'Wypożyczenia':[{id_wypozyczenia:1,id_klienta:1,id_sprzetu:1,data_wypozyczenia:'2026-07-03',data_zwrotu:'2026-07-04',zwrocono:true}]},
  tryHint:'Dodaj nowego klienta i jego wypożyczenie. Potem spróbuj wypożyczenia dla klienta nr 99 albo usuń klienta, który ma wypożyczenie.'},
 {id:'z2',title:'Warsztat samochodowy „Tłok”',short:'Warsztat',icon:'settings',
  story:'Warsztat pani Ewy naprawia auta klientów. Klient może mieć kilka samochodów, a każdy samochód wraca na kilka napraw. Pani Ewa chce wiedzieć: czyje to auto, co naprawiono, ile kosztowało i czy zapłacono. Uwaga: naprawa dotyczy samochodu, a samochód należy do klienta — to dwie relacje.',
  sample:{title:'Karta przyjęć warsztatu',columns:['Klient','Telefon','Auto','Nr rej.','Rok','Przyjęcie','Usterka','Koszt','Zapłacono'],rows:[['Adam Wrona','602 300 400','Opel Astra','DW 12345','2015','2026-09-14','wymiana klocków','420,00 zł','tak'],['Adam Wrona','602 300 400','Skoda Fabia','DW 7K812','2011','2026-09-20','olej i filtry','260,00 zł','nie'],['Ewa Sowa','603 400 500','Toyota Yaris','DWR 55AB','2019','2026-09-21','diagnostyka','150,00 zł','tak']]},
  tables:[T('Klienci','id_klienta',{imie:'text',nazwisko:'text',telefon:'text'}),T('Samochody','id_samochodu',{nr_rejestracyjny:'text',marka:'text',model:'text',rok_produkcji:'num'}),T('Naprawy','id_naprawy',{data_przyjecia:'date',opis_usterki:'text',koszt:'money',oplacono:'bool'})],
  fks:[{table:'Samochody',field:'id_klienta',ref:'Klienci'},{table:'Naprawy',field:'id_samochodu',ref:'Samochody'}],
  distractors:['Auta_klientów'],
  pool:['id_klienta','imie','nazwisko','telefon','id_samochodu','nr_rejestracyjny','marka','model','wiek_auta','rok_produkcji','id_naprawy','data_przyjecia','opis_usterki','nazwisko_wlasciciela','koszt','oplacono'],
  traps:{wiek_auta:'„wiek_auta” zmienia się co roku — zapisz rok_produkcji, a wiek policzy kwerenda.',nazwisko_wlasciciela:'„nazwisko_wlasciciela” to redundancja — właściciela wskazuje id_klienta w tabeli Samochody.'},
  stray:{'Naprawy.id_klienta':'id_klienta w Naprawy to zbędny skrót: naprawa wskazuje samochód, a samochód — właściciela. Po sprzedaży auta taki skrót pokaże złą osobę.'},
  distractorMsg:'Tabela „Auta_klientów” miesza klientów z samochodami — dane klienta powtórzą się przy każdym aucie. Usuń ją.',
  sampleData:{Klienci:[{id_klienta:1,imie:'Adam',nazwisko:'Wrona',telefon:'602300400'},{id_klienta:2,imie:'Ewa',nazwisko:'Sowa',telefon:'603400500'}],Samochody:[{id_samochodu:1,nr_rejestracyjny:'DW 12345',marka:'Opel',model:'Astra',rok_produkcji:2015,id_klienta:1},{id_samochodu:2,nr_rejestracyjny:'DW 7K812',marka:'Skoda',model:'Fabia',rok_produkcji:2011,id_klienta:1}],Naprawy:[{id_naprawy:1,id_samochodu:1,data_przyjecia:'2026-09-14',opis_usterki:'wymiana klocków',koszt:420,oplacono:true}]},
  tryHint:'Dodaj samochód Ewy Sowy (id_klienta = 2) i naprawę tego auta. Potem spróbuj naprawy dla samochodu nr 50 albo usuń klienta, który ma samochód.'},
 {id:'z3',title:'Biblioteka szkolna',short:'Biblioteka',icon:'book',
  story:'Pani z biblioteki prowadzi kartoteki na papierze: kto wypożyczył jaką książkę, kiedy i do kiedy ma oddać. Chce wiedzieć też, czy książka wróciła. Zaprojektuj bazę: uczniowie, książki, wypożyczenia. Bonus dla ambitnych: tabela Pracownicy i zapis, kto wydał książkę.',
  sample:{title:'Kartoteka biblioteki',columns:['Uczeń','Klasa','Tytuł','Autor','ISBN','Rok wyd.','Wypożyczono','Zwrot do','Oddana'],rows:[['Iga Kruk','3B','Lalka','Bolesław Prus','978-83-00-00000-X','2019','2026-09-10','2026-10-10','nie'],['Iga Kruk','3B','Ferdydurke','Witold Gombrowicz','978-83-00-00001-8','2020','2026-09-10','2026-10-10','tak'],['Olek Mróz','1A','Kamienie na szaniec','Aleksander Kamiński','978-83-00-00002-6','2021','2026-09-15','2026-10-15','nie']]},
  tables:[T('Uczniowie','id_ucznia',{imie:'text',nazwisko:'text',klasa:'text'}),T('Książki','id_ksiazki',{tytul:'text',autor:'text',isbn:'text',rok_wydania:'num'}),T('Wypożyczenia','id_wypozyczenia',{data_wypozyczenia:'date',termin_zwrotu:'date',zwrocona:'bool'})],
  fks:[{table:'Wypożyczenia',field:'id_ucznia',ref:'Uczniowie'},{table:'Wypożyczenia',field:'id_ksiazki',ref:'Książki'}],
  bonus:{tables:[T('Pracownicy','id_pracownika',{imie:'text',nazwisko:'text'})],fks:[{table:'Wypożyczenia',field:'id_pracownika',ref:'Pracownicy'}]},
  distractors:['Kartoteka'],
  pool:['id_ucznia','imie','nazwisko','klasa','wiek_ucznia','id_ksiazki','tytul','autor','isbn','rok_wydania','id_wypozyczenia','data_wypozyczenia','termin_zwrotu','zwrocona','klasa_ucznia','dni_spoznienia','id_pracownika'],
  traps:{wiek_ucznia:'„wiek_ucznia” nie jest potrzebny bibliotece i zmienia się co roku.',klasa_ucznia:'„klasa_ucznia” w wypożyczeniu to redundancja — klasa jest raz, w tabeli Uczniowie.',dni_spoznienia:'„dni_spoznienia” wylicza się z terminu zwrotu i dzisiejszej daty — nie przechowujemy pól wyliczanych.'},
  distractorMsg:'Tabela „Kartoteka” to jedna tabela na wszystko — nazwiska i tytuły powtórzą się przy każdym wypożyczeniu. Usuń ją.',
  typeHints:{isbn:'ISBN ma myślniki i może kończyć się literą X (978-83-00-00000-X) — to Krótki tekst, nie Liczba.'},
  sampleData:{Uczniowie:[{id_ucznia:1,imie:'Iga',nazwisko:'Kruk',klasa:'3B'},{id_ucznia:2,imie:'Olek',nazwisko:'Mróz',klasa:'1A'}],'Książki':[{id_ksiazki:1,tytul:'Lalka',autor:'Bolesław Prus',isbn:'978-83-00-00000-X',rok_wydania:2019},{id_ksiazki:2,tytul:'Ferdydurke',autor:'Witold Gombrowicz',isbn:'978-83-00-00001-8',rok_wydania:2020}],'Wypożyczenia':[{id_wypozyczenia:1,id_ucznia:1,id_ksiazki:1,data_wypozyczenia:'2026-09-10',termin_zwrotu:'2026-10-10',zwrocona:false}]},
  tryHint:'Dodaj książkę i jej wypożyczenie dla Olka (id_ucznia = 2). Potem spróbuj wypożyczenia dla ucznia nr 99 albo usuń ucznia, który ma wypożyczenie.'}
];
export const orderById=id=>orders.find(o=>o.id===id);
export const allTableNames=o=>[...o.tables.map(t=>t.name),...(o.bonus?.tables||[]).map(t=>t.name),...o.distractors];
const typeHints={telefon:'Telefon to Krótki tekst: spacje, +48, zero na początku — na numerze telefonu nic nie liczysz.',cena_za_dobe:'Pieniądze = Waluta (dokładne grosze, format zł).',koszt:'Pieniądze = Waluta (dokładne grosze, format zł).',nr_rejestracyjny:'Numer rejestracyjny ma litery i spacje — Krótki tekst.',rok_produkcji:'Rok to liczba — Liczba (da się sortować i liczyć wiek auta).',rok_wydania:'Rok to liczba — Liczba.',klasa:'Klasa (3B) to Krótki tekst.'};
const byType={date:'Daty = Data/Godzina (można sortować i liczyć dni).',bool:'Odpowiedź „tak/nie” = typ Tak/Nie (pole wyboru).',text:'To zwykły tekst — Krótki tekst.',money:'Pieniądze = Waluta.',num:'To liczba — Liczba.'};

// Projekt ucznia: {tables:[{name, fields:[{name,type,pk}]}], rels:[{table,field,ref}]}
export const emptyDesign=()=>({tables:[],rels:[]});
export const defaultType=f=>/^id_/.test(f)?'num':'text';
export function addTable(d,name){if(d.tables.some(t=>t.name===name))return d;return {...d,tables:[...d.tables,{name,fields:[]}]};}
export function removeTable(d,name){return {...d,tables:d.tables.filter(t=>t.name!==name),rels:d.rels.filter(r=>r.table!==name&&r.ref!==name)};}
export function addField(d,table,field){return {...d,tables:d.tables.map(t=>t.name!==table||t.fields.some(f=>f.name===field)?t:{...t,fields:[...t.fields,{name:field,type:defaultType(field),pk:false}]})};}
export function removeField(d,table,field){return {...d,tables:d.tables.map(t=>t.name!==table?t:{...t,fields:t.fields.filter(f=>f.name!==field)}),rels:d.rels.filter(r=>!(r.table===table&&r.field===field)&&!(r.ref===table&&pkOf(d,table)===field))};}
export function setType(d,table,field,type){return {...d,tables:d.tables.map(t=>t.name!==table?t:{...t,fields:t.fields.map(f=>f.name===field?{...f,type}:f)})};}
export function togglePK(d,table,field){return {...d,tables:d.tables.map(t=>t.name!==table?t:{...t,fields:t.fields.map(f=>f.name===field?{...f,pk:!f.pk}:f)})};}
export const pkOf=(d,table)=>d.tables.find(t=>t.name===table)?.fields.find(f=>f.pk)?.name;
export function addRel(d,table,field,ref){
 if(!table||!field||!ref)return {ok:false,msg:'Wybierz pole po stronie „wiele” i tabelę po stronie „jeden”.'};
 if(table===ref)return {ok:false,msg:'Relacja łączy dwie różne tabele.'};
 const pk=pkOf(d,ref);
 if(!pk)return {ok:false,msg:`Tabela ${ref} nie ma klucza głównego — relacja musi wskazywać klucz główny. Najpierw ustaw 🔑.`};
 if(pkOf(d,table)===field)return {ok:false,msg:`${table}.${field} to klucz główny tej tabeli — po stronie „wiele” stoi klucz obcy.`};
 if(d.rels.some(r=>r.table===table&&r.field===field))return {ok:false,msg:`Pole ${table}.${field} już jest kluczem obcym w innej relacji.`};
 return {ok:true,design:{...d,rels:[...d.rels,{table,field,ref}]},msg:`Utworzono relację: ${ref}.${pk} 1 — ∞ ${table}.${field}. Więzy integralności: włączone.`};
}
export const removeRel=(d,i)=>({...d,rels:d.rels.filter((_,j)=>j!==i)});

// ---------- Ocena projektu ----------
export const GROUPS=[['tables','Tabele'],['pk','Klucze główne'],['fields','Pola na swoim miejscu'],['types','Typy danych'],['fk','Klucze obce i relacje'],['clean','Bez redundancji i pułapek']];
export function evaluate(o,d){
 const checks=[];const add=(group,ok,msg,hint)=>checks.push({group,ok,msg,hint});
 const tbl=n=>d.tables.find(t=>t.name===n);
 const bonusTables=(o.bonus?.tables||[]);
 const expectedFields=name=>{const t=[...o.tables,...bonusTables].find(x=>x.name===name);if(!t)return null;return new Set([t.pk,...Object.keys(t.fields),...[...o.fks,...(o.bonus?.fks||[])].filter(f=>f.table===name&&(o.fks.includes(f)||tbl(f.ref))).map(f=>f.field)]);};
 const home={};for(const t of o.tables)for(const f of Object.keys(t.fields))home[f]=home[f]||t.name;
 // Tabele
 for(const t of o.tables)add('tables',!!tbl(t.name),tbl(t.name)?`Jest tabela ${t.name}.`:`Brakuje tabeli ${t.name}.`,`Utwórz tabelę ${t.name} przyciskiem „Utwórz tabelę”.`);
 const wrongTables=d.tables.filter(t=>o.distractors.includes(t.name));
 add('tables',!wrongTables.length,wrongTables.length?o.distractorMsg:'Brak zbędnych tabel.',o.distractorMsg);
 // Klucze główne
 for(const t of o.tables){const x=tbl(t.name);const pks=x?x.fields.filter(f=>f.pk):[];
  const ok=pks.length===1&&pks[0].name===t.pk;
  add('pk',ok,ok?`${t.name}: klucz główny ${t.pk}.`:!x?`${t.name}: brak tabeli, więc i klucza głównego.`:!pks.length?`${t.name}: brak klucza głównego.`:pks.length>1?`${t.name}: ${pks.length} pola oznaczone 🔑.`:`${t.name}: kluczem głównym jest ${pks[0].name}.`,
   !x?`Utwórz tabelę ${t.name}.`:!pks.length?`Dodaj pole ${t.pk} i kliknij przy nim 🔑.`:pks.length>1?'Jedna tabela = jeden klucz główny (w tym projekcie). Zostaw 🔑 tylko przy polu id_… tej tabeli.':`${pks[0].name} może się powtórzyć albo wskazuje inną tabelę. Klucz główny to ${t.pk} — unikalny numer rekordu.`);}
 // Pola na miejscu
 for(const t of o.tables)for(const f of Object.keys(t.fields)){
  const x=tbl(t.name);const ok=!!x?.fields.some(y=>y.name===f);const where=d.tables.find(y=>y.fields.some(z=>z.name===f));
  add('fields',ok,ok?`${t.name}.${f} ✓`:where?`Pole ${f} jest w tabeli ${where.name}.`:`Brakuje pola ${f}.`,where&&!ok?`${f} opisuje ${t.name==='Klienci'||t.name==='Uczniowie'?'osobę':'obiekt'} z tabeli ${t.name} — dodaj je tam.`:`Zlecenie wymaga pola ${f}. Wybierz je z puli i dodaj do tabeli ${t.name}.`);}
 // Typy
 const typeCheck=(table,field,want,label)=>{const x=tbl(table)?.fields.find(y=>y.name===field);if(!x)return add('types',false,`${label}: pole nie istnieje, więc typ nieustalony.`,'Najpierw dodaj pole.');
  const ok=Array.isArray(want)?want.includes(x.type):x.type===want;
  add('types',ok,ok?`${label}: ${typeLabel(x.type)} ✓`:`${label}: ${typeLabel(x.type)} to zły typ.`,ok?'':(o.typeHints?.[field]||typeHints[field]||(Array.isArray(want)?'Klucz główny: Autonumerowanie (Access nada numer sam) albo Liczba.':byType[want])));};
 for(const t of o.tables){typeCheck(t.name,t.pk,['auto','num'],`${t.name}.${t.pk}`);for(const [f,ty] of Object.entries(t.fields))typeCheck(t.name,f,ty,`${t.name}.${f}`);}
 for(const k of o.fks){const x=tbl(k.table)?.fields.find(y=>y.name===k.field);
  if(!x)add('types',false,`${k.table}.${k.field}: pole nie istnieje.`,'Najpierw dodaj pole klucza obcego.');
  else add('types',x.type==='num',x.type==='num'?`${k.table}.${k.field}: Liczba ✓`:`${k.table}.${k.field}: ${typeLabel(x.type)} to zły typ klucza obcego.`,x.type==='auto'?'Klucz obcy nie może być Autonumerowaniem — numer ma wskazywać istniejący rekord, a nie nadawać się sam. Ustaw Liczba.':'Klucz obcy musi mieć typ zgodny z kluczem głównym: Autonumerowanie ↔ Liczba.');}
 // Klucze obce
 for(const k of o.fks){const has=!!tbl(k.table)?.fields.some(y=>y.name===k.field);const r=d.rels.find(x=>x.table===k.table&&x.field===k.field);
  const ok=has&&r?.ref===k.ref;
  add('fk',ok,ok?`${k.ref} 1 — ∞ ${k.table} (${k.field}) ✓`:!has?`Brakuje klucza obcego ${k.field} w tabeli ${k.table}.`:!r?`${k.table}.${k.field} nie ma relacji.`:`${k.table}.${k.field} wskazuje tabelę ${r.ref}.`,
   !has?`Każdy rekord ${k.table} musi wiedzieć, którego rekordu ${k.ref} dotyczy. Dodaj ${k.field} do ${k.table}.`:!r?`W panelu Relacje połącz ${k.table}.${k.field} z kluczem głównym tabeli ${k.ref}.`:`${k.field} to numer z tabeli ${k.ref} — usuń relację i utwórz ją z właściwą tabelą.`);}
 // Czystość
 const issues=[];
 for(const t of d.tables){if(o.distractors.includes(t.name))continue;const exp=expectedFields(t.name);
  for(const f of t.fields){
   if(o.traps[f.name]){issues.push(o.traps[f.name]);continue;}
   if(exp&&!exp.has(f.name)){const key=`${t.name}.${f.name}`;issues.push(o.stray?.[key]||(home[f.name]?`Pole ${f.name} w tabeli ${t.name} to redundancja — należy do tabeli ${home[f.name]}; stąd wskazuje ją klucz obcy.`:/^id_/.test(f.name)?`Pole ${f.name} nie pasuje do tabeli ${t.name} — ta tabela nie wskazuje takiego rekordu.`:`Pole ${f.name} nie pasuje do tabeli ${t.name}.`));}
  }}
 const knownRel=new Set([...o.fks,...(o.bonus?.fks||[])].map(k=>`${k.table}.${k.field}>${k.ref}`));
 for(const r of d.rels)if(!knownRel.has(`${r.table}.${r.field}>${r.ref}`)&&!o.fks.some(k=>k.table===r.table&&k.field===r.field))issues.push(`Relacja ${r.ref} — ${r.table}.${r.field} jest zbędna albo odwrotna.`);
 add('clean',!issues.length,issues.length?issues[0]:'Żadne dane się nie powtarzają, nie ma pól-pułapek.',issues.length>1?`Problemów tego typu: ${issues.length}. Kolejny: ${issues[1]}`:'Każda informacja jest zapisana w jednym miejscu.');
 // Bonus
 let bonus=null;
 if(o.bonus){const bt=o.bonus.tables[0];const x=tbl(bt.name);
  if(x){const bk=o.bonus.fks[0];const ok=pkOf(d,bt.name)===bt.pk&&Object.keys(bt.fields).every(f=>x.fields.some(y=>y.name===f))&&d.rels.some(r=>r.table===bk.table&&r.field===bk.field&&r.ref===bk.ref)&&tbl(bk.table)?.fields.find(f=>f.name===bk.field)?.type==='num';
   bonus={ok,msg:ok?`Bonus ✓: ${bt.name} 1 — ∞ ${bk.table} (${bk.field}) — wiadomo, kto wydał książkę.`:`Bonus: tabela ${bt.name} potrzebuje klucza ${bt.pk}, pól imie i nazwisko oraz relacji z ${bk.table}.${bk.field} (Liczba).`};}}
 const passed=checks.filter(c=>c.ok).length,total=checks.length;
 const groups=GROUPS.map(([id,label])=>{const cs=checks.filter(c=>c.group===id);return {id,label,ok:cs.every(c=>c.ok),passed:cs.filter(c=>c.ok).length,total:cs.length,issues:cs.filter(c=>!c.ok)};});
 const ratio=total?passed/total:0;
 // Zaliczenie: ≥70% kontroli i każda z 6 grup spełniona co najmniej w połowie (np. bez relacji nie ma zaliczenia).
 const weak=groups.filter(g=>g.total&&g.passed/g.total<0.5);
 return {checks,groups,passed,total,ratio,bonus,pass:ratio>=PASS&&!weak.length,weak};
}

// Punkty zlecenia (maks. 4): projekt 100% — 3 pkt przy 1. sprawdzeniu, 2 pkt przy 2.–3., 1,5 później;
// zaliczone ≥70% (bez 100%) — 1 pkt; „Wypróbuj” (2 rekordy + odrzucona operacja) — +1 pkt.
export function recordCheck(s={},o){
 const ev=evaluate(o,s.design||emptyDesign());
 const checks=(s.checks||0)+1;
 const best=Math.max(s.best||0,ev.ratio);
 const perfectAt=s.perfectAt||(ev.ratio===1?checks:null);
 return {state:{...s,checks,best,passed:s.passed||ev.pass,perfectAt,last:Math.round(ev.ratio*100),bonus:s.bonus||!!ev.bonus?.ok},ev};
}
export function orderResult(s={},o){
 const best=s.best||0;
 const proj=s.perfectAt?(s.perfectAt===1?3:s.perfectAt<=3?2:1.5):s.passed?1:0;
 const tried=tryoutDone(s.tryout);
 const score=proj+(tried?1:0);
 const bits=[`${o.short}: ${Math.round(best*100)}%`];if(tried)bits.push('test relacji ✓');if(s.bonus)bits.push('bonus ✓');
 return {done:!!s.passed,score,max:4,summary:s.checks?bits.join(' · '):undefined};
}
export const unlocked=(mode,value={})=>{const i=orders.findIndex(o=>o.id===mode);if(i<=0)return true;const prev=orders[i-1];return !!value[prev.id]?.passed;};

// ---------- Wypróbuj: dane testowe i więzy integralności ----------
export function tryoutTables(o){return o.tables;}
export function initTryout(o){return {rows:JSON.parse(JSON.stringify(o.sampleData)),added:0,rejected:0,log:[]};}
export const tryoutDone=t=>!!t&&t.added>=2&&t.rejected>=1;
const fkOfTable=(o,table)=>o.fks.filter(k=>k.table===table);
export function nextId(o,t,table){const pk=o.tables.find(x=>x.name===table).pk;return Math.max(0,...(t.rows[table]||[]).map(r=>r[pk]))+1;}
export function tryInsert(o,t,table,input){
 const def=o.tables.find(x=>x.name===table);const rec={[def.pk]:nextId(o,t,table)};
 for(const [f,ty] of [...Object.entries(def.fields),...fkOfTable(o,table).map(k=>[k.field,'num'])]){
  const raw=input[f];
  if(ty==='bool'){rec[f]=!!raw;continue;}
  const v=String(raw??'').trim();
  if(!v)return {ok:false,t,msg:`Pole ${f} jest puste.`,hint:'Uzupełnij wszystkie pola nowego rekordu.'};
  if(ty==='num'||ty==='money'){const n=Number(v.replace(',','.').replace(/\s*zł$/,''));if(!Number.isFinite(n))return {ok:false,t,msg:'Wprowadzona wartość nie jest zgodna z typem danych w tej kolumnie.',hint:`Pole ${f} ma typ ${typeLabel(ty)} — wpisz liczbę.`,access:true};rec[f]=n;continue;}
  if(ty==='date'){if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return {ok:false,t,msg:'Wprowadzona wartość nie jest zgodna z typem danych w tej kolumnie.',hint:`Pole ${f} ma typ Data/Godzina — wybierz datę.`,access:true};rec[f]=v;continue;}
  rec[f]=v;
 }
 for(const k of fkOfTable(o,table)){const refPk=o.tables.find(x=>x.name===k.ref).pk;
  if(!(t.rows[k.ref]||[]).some(r=>r[refPk]===rec[k.field])){
   const nt={...t,rejected:t.rejected+1,log:[...t.log,`✖ Odrzucono: ${table}.${k.field} = ${rec[k.field]} — brak rekordu w ${k.ref}`]};
   return {ok:false,t:nt,msg:`Nie można dodać lub zmienić rekordu, ponieważ w tabeli „${k.ref}” wymagany jest rekord pokrewny.`,hint:`${k.field} = ${rec[k.field]} nie wskazuje żadnego rekordu w ${k.ref}. Więzy integralności działają — dokładnie tak miało być.`,access:true,rejected:true};}
 }
 const nt={...t,rows:{...t.rows,[table]:[...(t.rows[table]||[]),rec]},added:t.added+1,log:[...t.log,`+ ${table} #${rec[def.pk]}`]};
 return {ok:true,t:nt,msg:`Zapisano rekord ${table} #${rec[def.pk]}.`};
}
export function tryDelete(o,t,table,id){
 const def=o.tables.find(x=>x.name===table);
 for(const k of o.fks.filter(k=>k.ref===table)){
  if((t.rows[k.table]||[]).some(r=>r[k.field]===id)){
   const nt={...t,rejected:t.rejected+1,log:[...t.log,`✖ Odrzucono usunięcie: ${table} #${id} ma rekordy w ${k.table}`]};
   return {ok:false,t:nt,msg:`Nie można usunąć lub zmienić rekordu, ponieważ tabela „${k.table}” zawiera rekordy pokrewne.`,hint:`Do rekordu ${table} #${id} odwołują się rekordy w ${k.table}. Usunięcie zostawiłoby „sieroty” — baza na to nie pozwala.`,access:true,rejected:true};}
 }
 const nt={...t,rows:{...t.rows,[table]:t.rows[table].filter(r=>r[def.pk]!==id)},log:[...t.log,`− ${table} #${id}`]};
 return {ok:true,t:nt,msg:`Usunięto rekord ${table} #${id}.`};
}
// Wzorcowy projekt (do testów i podpowiedzi nauczyciela).
export function solutionDesign(o,withBonus=false){
 const all=[...o.tables,...(withBonus?o.bonus?.tables||[]:[])];const fks=[...o.fks,...(withBonus?o.bonus?.fks||[]:[])];
 return {tables:all.map(t=>({name:t.name,fields:[{name:t.pk,type:'auto',pk:true},...Object.entries(t.fields).map(([name,type])=>({name,type,pk:false})),...fks.filter(k=>k.table===t.name).map(k=>({name:k.field,type:'num',pk:false}))]})),rels:fks.map(k=>({table:k.table,field:k.field,ref:k.ref}))};
}
