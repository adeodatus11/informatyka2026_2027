// debateLab — czysta logika (bez Reacta i DOM). Lekcja 42: szanse i zagrożenia rozwoju informatyki i TIK.
// Tryby: 'day' (mój dzień online — bez oceniania), 'evidence' (dowód, opinia czy brak dowodu),
// 'poster' (kreator stanowiska: teza, argumenty z dowodami, kontrargument, odpowiedź, zasada → plakat albo Word).
// Liczby z raportów oznaczone jako „do weryfikacji” — nauczyciel sprawdza je u źródła przed lekcją.

export const fmt=n=>String(Math.round(n*10)/10).replace('.',',');
const award=(ok,tries)=>ok?(tries===1?1:0.5):0;

// ---------- 1. Mój dzień online ----------
export const AVG_HOURS=5; // NASK „Nastolatki 2025” (badanie 2024): ok. 5 h dziennie online — do weryfikacji w raporcie.
export const AVG_SOURCE='NASK, raport „Nastolatki 2025” (badanie z 2024 r.) — wartość przybliżona, do weryfikacji';
export const dayCategories=[
 {id:'learn',label:'Nauka i szkoła',hint:'e-dziennik, lekcje, wyszukiwanie, tłumacz'},
 {id:'social',label:'Media społecznościowe',hint:'przewijanie, relacje, krótkie filmy'},
 {id:'chat',label:'Komunikatory i rozmowy',hint:'czaty, wiadomości, rozmowy głosowe'},
 {id:'video',label:'Filmy, seriale, streamy',hint:'platformy wideo i streamingowe'},
 {id:'games',label:'Gry',hint:'na telefonie, konsoli i komputerze'},
 {id:'other',label:'Inne',hint:'muzyka, zakupy, czat z AI, mapy'}
];
export const exampleDay={learn:1,social:2,chat:1,video:1.5,games:1,other:0.5};
export const feelings=[['plus','Daje mi coś (wiedza, kontakt, odpoczynek)'],['neutral','Obojętne'],['less','Chcę mniej']];
export const experiments=[
 'Wyciszam powiadomienia na czas nauki',
 'Telefon poza łóżkiem — budzik zamiast telefonu',
 'Sprawdzam w ustawieniach prawdziwy czas przed ekranem i porównuję z moim szacunkiem',
 'Jedna aplikacja dostaje dzienny limit czasu',
 'Nic nie zmieniam — mój czas online mi odpowiada'
];
export const MAX_HOURS=12;
export function setHours(value={},cat,h){const n=Math.max(0,Math.min(MAX_HOURS,Math.round(Number(h)*2)/2||0));return {...value,hours:{...(value.hours||{}),[cat]:n}};}
export function dayTotal(hours={}){return dayCategories.reduce((s,c)=>s+(Number(hours[c.id])||0),0);}
export function compareText(total){
 if(!total)return 'Ustaw godziny w kategoriach, żeby zobaczyć porównanie.';
 const d=Math.round((total-AVG_HOURS)*10)/10;
 if(Math.abs(d)<0.5)return `Twój szacunek jest zbliżony do średniej z badania (ok. ${AVG_HOURS} h).`;
 return d>0?`Twój szacunek jest o ${fmt(d)} h większy niż średnia z badania.`:`Twój szacunek jest o ${fmt(-d)} h mniejszy niż średnia z badania.`;
}
export function dayResult(value={}){
 const hours=value.hours||{};const total=dayTotal(hours);const used=dayCategories.filter(c=>hours[c.id]>0);
 const felt=used.every(c=>value.feel?.[c.id]);const exp=Number.isInteger(value.experiment)?experiments[value.experiment]:null;
 return {done:total>0&&felt&&!!exp,total,summary:exp?`Eksperyment na tydzień: ${exp}`:''};
}

// ---------- 2. Dowód, opinia czy brak dowodu? ----------
export const evidenceTypes=[
 {id:'proof',label:'Dowód',short:'kto zbadał, kiedy, na kim — da się sprawdzić'},
 {id:'opinion',label:'Opinia',short:'pogląd lub odczucie — ważne, ale to nie dowód'},
 {id:'noproof',label:'Brak dowodu',short:'anegdota, „wszyscy wiedzą”, „badania pokazują” bez źródła'}
];
export const statements=[
 {id:'nask-ai',text:'Według raportu NASK „Nastolatki 2025” (badanie z 2024 r., ok. 3,7 tys. uczniów) około 7 na 10 nastolatków korzysta z narzędzi AI.',type:'proof',why:'Jest instytucja, rok, liczba badanych i wynik. Możesz to sprawdzić w raporcie.'},
 {id:'cousin',text:'Mój kuzyn napisał wypracowanie w czacie z AI i dostał piątkę, więc AI zawsze pomaga w nauce.',type:'noproof',why:'To jedna historia (anegdota), a wniosek „zawsze” jest za szeroki. Jeden przypadek nie dowodzi reguły.'},
 {id:'ban',text:'Uważam, że całkowity zakaz telefonów w szkole to przesada.',type:'opinion',why:'„Uważam” — to pogląd. Może być dobrze uzasadniony, ale potrzebuje dowodów, żeby przekonać innych.'},
 {id:'twelve',text:'Wszyscy wiedzą, że nastolatki siedzą w telefonie po 12 godzin dziennie.',type:'noproof',why:'„Wszyscy wiedzą” to nie źródło. Badanie NASK mówi o ok. 5 h online dziennie — liczba z sufitu przegrałaby debatę.'},
 {id:'cert',text:'CERT Polska w raporcie za 2025 r. podał, że zdecydowana większość obsłużonych incydentów to oszustwa komputerowe.',type:'proof',why:'Jest instytucja, okres i konkretny wynik. Raport jest publiczny — da się to sprawdzić.'},
 {id:'should',text:'Moim zdaniem AI powinno pomagać w nauce, a nie odrabiać zadania za ucznia.',type:'opinion',why:'„Moim zdaniem” i „powinno” — to stanowisko (opinia). Dobra teza do debaty, ale nie dowód.'},
 {id:'studies',text:'Badania pokazują, że AI niszczy mózg młodych ludzi.',type:'noproof',why:'Jakie badania? Kto, kiedy, na kim? Bez źródła to tylko efektowne hasło — i bardzo mocna teza bez pokrycia.'}
];
export function chooseEvidence(state={},id,type){const st=statements.find(s=>s.id===id);const cur=state[id]||{};if(!st||cur.ok)return state;const tries=(cur.tries||0)+1;return {...state,[id]:{choice:type,tries,ok:type===st.type}};}
export function evidenceResult(value={}){
 const s=value.items||{};const solved=statements.filter(x=>s[x.id]?.ok).length;
 return {done:solved===statements.length,score:statements.reduce((sum,x)=>sum+award(s[x.id]?.ok,s[x.id]?.tries),0),max:statements.length,solved,summary:`Dowody: ${solved}/${statements.length} rozpoznanych`};
}

// ---------- 3. Kreator stanowiska ----------
export const TOPIC='AI i nowe technologie w szkole i w pracy: więcej szans czy zagrożeń?';
export const stances=[
 {id:'pro',label:'Więcej szans',thesis:'Więcej szans niż zagrożeń — AI w szkole i pracy tak, ale z jasnymi zasadami.'},
 {id:'contra',label:'Więcej zagrożeń',thesis:'Więcej zagrożeń niż szans — korzystanie z AI w szkole trzeba wyraźnie ograniczać.'}
];
export const roles={student:'Uczeń',teacher:'Nauczyciel',employer:'Pracodawca',parent:'Rodzic'};
// side: pro = szansa, contra = zagrożenie; proof: czy argument ma sprawdzalny dowód.
export const bank=[
 {id:'p-use',side:'pro',role:'student',proof:true,text:'Większość nastolatków już korzysta z AI — lepiej uczyć mądrego korzystania, niż udawać, że go nie ma.',source:'NASK, „Nastolatki 2025”: ok. 7 na 10 nastolatków używa narzędzi AI (do weryfikacji).',
  replies:[['Skoro korzysta większość, tym bardziej potrzebne są granice: AI nie na sprawdzianach, a każdą pomoc AI oznaczamy.',true],['Nastolatki i tak kłamią w ankietach.',false],['Nie interesuje nas, co robią inni.',false]]},
 {id:'p-skills',side:'pro',role:'employer',proof:true,text:'Pracodawcy szukają ludzi, którzy umieją pracować z AI — szkoła powinna tego uczyć.',source:'World Economic Forum, „Future of Jobs Report 2025”: AI i big data to najszybciej rosnące umiejętności do 2030 r. (do weryfikacji).',
  replies:[['Pracodawcy zawsze czegoś chcą.',false],['Zgoda — ale najpierw podstawy: kto nie umie sprawdzić odpowiedzi AI, nie wykorzysta tej umiejętności w pracy.',true],['To tylko jakaś zagraniczna organizacja.',false]]},
 {id:'p-jobs',side:'pro',role:'parent',proof:true,text:'Technologia tworzy więcej miejsc pracy, niż zabiera — trzeba tylko się przygotować.',source:'World Economic Forum, „Future of Jobs Report 2025”: do 2030 r. ok. 170 mln nowych miejsc pracy i ok. 92 mln zlikwidowanych (do weryfikacji).',
  replies:[['Do 2030 r. to jeszcze daleko.',false],['Raporty zawsze przesadzają.',false],['Nowe miejsca pracy wymagają nowych kwalifikacji — bez nauki z głową ten bilans nie zadziała dla każdego.',true]]},
 {id:'p-access',side:'pro',role:'teacher',proof:true,text:'Technologia włącza: pomaga uczyć się i pracować osobom z niepełnosprawnościami.',source:'Wbudowane ułatwienia dostępu: Windows 11 ma Narratora (czytnik ekranu) i napisy na żywo; telefony opisują zdjęcia osobom niewidomym.',
  replies:[['To prawda, ale te narzędzia działają bez ściągania z AI na sprawdzianach — zasady mogą chronić jedno i drugie.',true],['To dotyczy niewielu osób.',false],['To nie nasz temat.',false]]},
 {id:'p-anecdote',side:'pro',role:'student',proof:false,text:'Kolega zrobił referat z AI w 5 minut i dostał piątkę, więc AI jest super.',source:'Brak źródła — jedna historia.',
  replies:[['Kolega pewnie ściągał.',false],['Jedna piątka nie dowodzi, że się czegoś nauczył — liczy się, co umie bez AI.',true],['Piątki nic nie znaczą.',false]]},
 {id:'c-errors',side:'contra',role:'teacher',proof:true,text:'AI popełnia błędy i zmyśla — uczeń, który mu ślepo ufa, uczy się nieprawdy.',source:'Ostrzeżenia samych twórców: pod oknem czatów z AI (np. ChatGPT) stoi informacja, że model może popełniać błędy i trzeba sprawdzać ważne informacje.',
  replies:[['Nauczyciele po prostu nie lubią nowości.',false],['Ludzie też się mylą, więc to bez znaczenia.',false],['Dlatego zasada: AI tylko z weryfikacją — sprawdzamy fakty w dwóch źródłach (SIFT) i oznaczamy pracę z AI.',true]]},
 {id:'c-deepfake',side:'contra',role:'parent',proof:true,text:'Fałszywe nagrania i zdjęcia z AI są tak realne, że łatwo kogoś skrzywdzić lub oszukać.',source:'Rozporządzenie UE o AI (AI Act): od 2.08.2026 r. obowiązek oznaczania treści wygenerowanych przez AI i deepfake\'ów (do weryfikacji).',
  replies:[['Właśnie dlatego szkoła powinna uczyć rozpoznawania i oznaczania treści AI — sam zakaz tego nie nauczy.',true],['Deepfake\'i to problem dorosłych, nie nasz.',false],['Każdy rozpozna fałszywkę.',false]]},
 {id:'c-exclusion',side:'contra',role:'parent',proof:true,text:'Szybki rozwój technologii wyklucza tych, którzy za nim nie nadążają — np. dziadków przy e-usługach.',source:'Eurostat, 2023: ok. 44% dorosłych Polaków (16–74 lata) ma co najmniej podstawowe umiejętności cyfrowe; średnia UE ok. 56% (do weryfikacji).',
  replies:[['To nie jest problem szkoły.',false],['Dlatego technologia w szkole musi iść w parze z pomocą innym — np. uczniowie uczą dziadków bezpiecznych e-usług.',true],['Kiedyś wszyscy się nauczą.',false]]},
 {id:'c-fraud',side:'contra',role:'employer',proof:true,text:'Technologia daje też narzędzia oszustom — liczba incydentów rośnie.',source:'CERT Polska, raport za 2025 r.: ok. 260 tys. obsłużonych incydentów, w większości oszustwa (do weryfikacji).',
  replies:[['Dlatego w nauce TIK musi być cyberbezpieczeństwo: 2FA, weryfikacja, zgłaszanie oszustw — to też szansa na zawód.',true],['Oszuści byli zawsze.',false],['Mnie to nie dotyczy.',false]]},
 {id:'c-brain',side:'contra',role:'parent',proof:false,text:'AI ogłupia młodzież — każdy to widzi.',source:'Brak źródła — „każdy to widzi”.',
  replies:[['Dorośli też siedzą w telefonach.',false],['To nieprawda i tyle.',false],['Jeśli AI odrabia zadania za ucznia, to faktycznie się nie uczy — dlatego zasady, a nie zakaz.',true]]}
];
export const tips=[
 'Wyciszone powiadomienia w czasie nauki i snu',
 'Telefon poza łóżkiem — budzik zamiast telefonu',
 'Zasada 20-20-20: co 20 minut patrz przez 20 sekund na coś oddalonego o ok. 6 m',
 'Limit czasu w jednej aplikacji, która „zjada” najwięcej',
 'Trudne sprawy omawiamy na żywo, nie na czacie'
];
export const posterLicenses=['CC BY 4.0','CC BY-NC 4.0','CC BY-SA 4.0','Wszystkie prawa zastrzeżone'];
export const byId=id=>bank.find(b=>b.id===id);
export function toggleArg(p={},id){const args=p.args||[];return {...p,args:args.includes(id)?args.filter(x=>x!==id):args.length>=2?args:[...args,id]};}
export function setCounter(p={},id){return {...p,counter:id,reply:undefined};}
export function posterMissing(p={}){
 const m=[];
 if(!p.stance)m.push('teza');if((p.args||[]).length<2)m.push('2 argumenty');if(!p.counter)m.push('kontrargument');if(!Number.isInteger(p.reply))m.push('odpowiedź');
 if((p.title||'').trim().length<5)m.push('tytuł');if((p.rule||'').trim().length<15)m.push('nasza zasada');if(!Number.isInteger(p.tip))m.push('wskazówka dobrostanu');if((p.team||'').trim().length<2)m.push('autorzy');
 return m;
}
export function posterCriteria(p={}){
 const args=(p.args||[]).map(byId).filter(Boolean);const counter=byId(p.counter);
 return [
  {id:'side',label:'Argumenty wspierają tezę',ok:args.length===2&&args.every(a=>a.side===p.stance),hint:'Co najmniej jeden argument mówi o drugiej stronie. Argument ma wspierać Waszą tezę.'},
  {id:'roles',label:'Dwie różne perspektywy',ok:args.length===2&&args[0].role!==args[1].role,hint:'Oba argumenty mówią z tej samej perspektywy. Wykorzystajcie role w trójce: weźcie argument innej osoby (uczeń, nauczyciel, pracodawca lub rodzic).'},
  {id:'proof',label:'Argumenty mają dowody',ok:args.length===2&&args.every(a=>a.proof),hint:'Jeden z argumentów to anegdota albo hasło bez źródła. Wybierzcie argument z dowodem.'},
  {id:'counter',label:'Najmocniejszy głos drugiej strony',ok:!!counter&&counter.side!==p.stance&&counter.proof,hint:counter&&counter.side===p.stance?'Kontrargument ma pochodzić od drugiej strony sporu.':'Wybraliście najsłabszy argument drugiej strony (chochoł). Uczciwa debata mierzy się z argumentem z dowodem.'},
  {id:'reply',label:'Rzeczowa odpowiedź',ok:!!counter&&Number.isInteger(p.reply)&&counter.replies[p.reply]?.[1]===true,hint:'Odpowiedź atakuje osobę albo zbywa temat. Dobra odpowiedź przyznaje, co trafne, i proponuje rozwiązanie.'}
 ];
}
export function checkPoster(p={}){
 if(posterMissing(p).length)return p;
 const attempts=(p.attempts||0)+1;const first={...(p.first||{})};const crit=posterCriteria(p);
 for(const c of crit)if(c.ok&&!first[c.id])first[c.id]=attempts;
 return {...p,attempts,first,last:Object.fromEntries(crit.map(c=>[c.id,c.ok])),checkedSig:posterSig(p)};
}
export const posterSig=p=>JSON.stringify([p.stance,p.args,p.counter,p.reply]);
export function posterScore(p={}){const last=p.last||{};const first=p.first||{};return Object.keys(last).reduce((s,k)=>s+(last[k]?(first[k]===1?1:0.5):0),0);}
export const POSTER_MAX=5;
export function posterAllOk(p={}){const l=p.last||{};return ['side','roles','proof','counter','reply'].every(k=>l[k])&&p.checkedSig===posterSig(p);}
// Wariant 'word': uczeń kończy samooceną pliku (wordRubric zapisany w p.rubric); 'platform': przycisk „Wydaj plakat”.
export function posterResult(value={}){
 const p=value.poster||{};const ok=posterAllOk(p)&&!posterMissing(p).length;
 const published=p.variant==='word'?ok&&!!p.rubric?.done:p.variant==='platform'&&ok&&!!p.published;
 const st=stances.find(s=>s.id===p.stance);
 return {done:published,score:posterScore(p),max:POSTER_MAX,summary:published?`${p.variant==='word'?'Stanowisko (Word)':'Plakat'}: „${(p.title||'').trim()}” — ${st?.label||''}`:''};
}
export function posterText(p={}){
 const st=stances.find(s=>s.id===p.stance);const args=(p.args||[]).map(byId).filter(Boolean);const c=byId(p.counter);
 const lines=[(p.title||'').trim(),`Temat: ${TOPIC}`,'',`NASZA TEZA: ${st?st.thesis:'…'}`,''];
 args.forEach((a,i)=>lines.push(`ARGUMENT ${i+1} (${roles[a.role]}): ${a.text}`,`Dowód: ${a.source}`,''));
 if(c){lines.push(`DRUGA STRONA MÓWI: ${c.text}`,`Dowód: ${c.source}`);if(Number.isInteger(p.reply))lines.push(`NASZA ODPOWIEDŹ: ${c.replies[p.reply][0]}`);lines.push('');}
 lines.push(`NASZA ZASADA: ${(p.rule||'').trim()}`,`DBAJ O SIEBIE: ${Number.isInteger(p.tip)?tips[p.tip]:''}`,'',`Autorzy: ${(p.team||'').trim()} · Licencja: ${p.license||posterLicenses[0]}`,'Dane oznaczone „do weryfikacji” sprawdzamy u źródła przed publikacją.');
 return lines.join('\n');
}

// ---------- 4. Ocena koleżeńska (bez punktów do karty wyniku) ----------
export const peerCriteria=[
 {id:'thesis',label:'Jasna teza',levels:['brak tezy albo nie wiadomo, po której stronie jest trójka','teza jest, ale tytuł jej nie pokazuje','teza i tytuł od razu mówią, co trójka myśli']},
 {id:'evidence',label:'Argumenty z dowodami',levels:['argumenty bez źródeł','jeden argument z dowodem albo dowód niepełny (brak kto/kiedy)','dwa argumenty, każdy z dowodem: kto, kiedy, co zbadał']},
 {id:'other',label:'Uczciwie o drugiej stronie',levels:['brak drugiej strony albo atak na osoby','druga strona jest, ale odpowiedź zbywa temat','mocny argument drugiej strony i rzeczowa odpowiedź']},
 {id:'rule',label:'Konkretna zasada',levels:['brak zasady albo hasło typu „bądźmy mądrzy”','zasada ogólna — nie wiadomo, kto i kiedy','wiadomo, kto, co i kiedy robi — da się ją sprawdzić']},
 {id:'clear',label:'Czytelność i podpis',levels:['nie da się tego zrozumieć w 30 sekund','czytelne, ale brakuje autorów lub licencji','czytelne w 30 sekund, są autorzy i licencja']}
];
export const PEER_MAX=peerCriteria.length*2;
export function setPeer(value={},field,val){return {...value,[field]:val};}
export function ratePeer(value={},id,n){return {...value,ratings:{...(value.ratings||{}),[id]:n}};}
export function peerResult(value={}){
 const r=value.ratings||{};const rated=peerCriteria.filter(c=>Number.isInteger(r[c.id])).length;
 const total=peerCriteria.reduce((s,c)=>s+(Number.isInteger(r[c.id])?r[c.id]:0),0);
 const done=rated===peerCriteria.length&&(value.stars||'').trim().length>=15&&(value.wish||'').trim().length>=10;
 return {done,rated,total,summary:done?`Ocena koleżeńska: ${total}/${PEER_MAX} pkt`:''};
}
