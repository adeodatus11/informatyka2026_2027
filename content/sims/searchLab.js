// Logika symulatora „Szukajka” (lekcja 08): fikcyjny indeks stron, parser operatorów, ranking i misje.
// Czysty JS — bez Reacta i DOM. Wszystkie strony, firmy i domeny są wymyślone.

const PL={'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z'};
export function normalize(s=''){return String(s).toLowerCase().replace(/[ąćęłńóśźż]/g,c=>PL[c]).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
export function tokenize(s){const n=normalize(s);return n?n.split(' '):[];}
// Prosty „stemmer”: dopasowanie początku słowa, żeby „słuchawki” znalazło „słuchawek”.
export function stem(w){if(w.length<4||/^\d+$/.test(w))return w;const cut=w.length<=5?1:w.length<=7?2:3;return w.slice(0,Math.max(3,w.length-cut));}
const ALIASES={uczen:'uczn',uczniowie:'uczni',uczniow:'uczni',mieso:'mies',miesa:'mies'};
// Słowa pomijane w zwykłym wyszukiwaniu (ale liczą się wewnątrz frazy w cudzysłowie).
export const STOP=new Set(['i','w','z','o','a','u','do','na','dla','sie','nie','ile','jak','kto','co','czy','jest','ma','to','po','od','ze','za','mi','mnie','moge','gdzie','jaki','jaka','jakie','the']);
function tokenMatches(tokens,w){const s=stem(w),a=ALIASES[w];return tokens.some(t=>t===w||(s!==w&&t.startsWith(s))||(a&&t.startsWith(a)));}
function phraseIn(tokens,phrase){const p=tokenize(phrase);if(!p.length)return false;outer:for(let i=0;i<=tokens.length-p.length;i++){for(let j=0;j<p.length;j++)if(tokens[i+j]!==p[j])continue outer;return true;}return false;}

const OPS=['site','filetype','intitle','inurl','before','after','cache','related'];
// Parser zapytania. Zwraca listę klauzul (AND), alternatywy OR, filtry i ostrzeżenia.
export function parseQuery(q=''){
 const raw=[];let i=0;const s=String(q);
 while(i<s.length){
  if(/\s/.test(s[i])){i++;continue;}
  let neg=false,op=null,start=i;
  if(s[i]==='-'&&i+1<s.length&&!/\s/.test(s[i+1])){neg=true;i++;}
  let pref='';
  if(s[i]==='+'||s[i]==='~'){pref=s[i];i++;}
  const opMatch=/^([a-zA-Z]+):/.exec(s.slice(i));
  if(opMatch&&OPS.includes(opMatch[1].toLowerCase())){op=opMatch[1].toLowerCase();i+=opMatch[0].length;}
  let value='',phrase=false;
  if(s[i]==='"'||s[i]==='„'||s[i]==='”'){phrase=true;i++;const end=s.slice(i).search(/["”“]/);value=end<0?s.slice(i):s.slice(i,i+end);i=end<0?s.length:i+end+1;}
  else{const end=s.slice(i).search(/\s/);value=end<0?s.slice(i):s.slice(i,i+end);i=end<0?s.length:i+end;}
  raw.push({neg,op,value,phrase,pref,text:s.slice(start,i)});
 }
 const warnings=[],filters={site:[],filetype:[],inurl:[],before:null,after:null},clauses=[],negatives=[];
 let pendingOr=false;
 for(const t of raw){
  if(!t.phrase&&!t.op&&!t.neg&&(t.value==='OR'||t.value==='|')){if(clauses.length)pendingOr=true;continue;}
  if(!t.phrase&&!t.op&&t.value==='or'&&!t.neg){warnings.push('„or” małymi literami to zwykłe słowo. Operator piszemy wielkimi literami: OR.');}
  if(t.pref==='+')warnings.push(`Operator + (w „${t.text}”) nie działa od 2011 r. Szukam „${t.value}” jak zwykłego słowa. Chcesz wymusić słowo? Weź je w cudzysłów.`);
  if(t.pref==='~')warnings.push(`Operator ~ (synonimy) wycofano w 2013 r. Szukam „${t.value}” jak zwykłego słowa.`);
  if(t.op==='cache'||t.op==='related'){warnings.push(`Operator ${t.op}: nie działa (wycofany). Pomijam go.`);continue;}
  if(t.op==='site'){const d=t.value.toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/^\./,'').replace(/\/.*$/,'');if(d)filters.site.push({domain:d,neg:t.neg});continue;}
  if(t.op==='filetype'){const f=t.value.toLowerCase().replace(/^\./,'');if(f)filters.filetype.push({type:f,neg:t.neg});continue;}
  if(t.op==='inurl'){if(t.value)filters.inurl.push({value:normalize(t.value),neg:t.neg});continue;}
  if(t.op==='before'||t.op==='after'){const d=parseDate(t.value);if(d)filters[t.op]=d;else warnings.push(`Nie rozumiem daty w „${t.text}”. Użyj formatu RRRR-MM-DD, np. after:2026-09-01.`);continue;}
  const term={kind:t.phrase?'phrase':'word',value:t.phrase?normalize(t.value):normalize(t.value).split(' ')[0]||'',field:t.op==='intitle'?'title':'any',label:t.text};
  if(t.phrase===false&&normalize(t.value).includes(' ')){// np. „Wi-Fi” → dwa słowa
   const parts=normalize(t.value).split(' ');term.kind='phrase';term.value=parts.join(' ');}
  if(!term.value){continue;}
  if(t.neg){negatives.push(term);continue;}
  if(term.kind==='word'&&term.field==='any'&&STOP.has(term.value)&&!pendingOr){term.stop=true;}
  if(pendingOr&&clauses.length){clauses[clauses.length-1].push(term);pendingOr=false;}else clauses.push([term]);
 }
 return {clauses,negatives,filters,warnings};
}
function parseDate(v){const m=/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/.exec(v.trim());if(!m)return null;return `${m[1]}-${String(m[2]||1).padStart(2,'0')}-${String(m[3]||1).padStart(2,'0')}`;}

function docTokens(d){if(!d._t){d._t={title:tokenize(d.title),body:tokenize(`${d.title} ${d.snippet||''} ${d.text} ${d.url}`)};}return d._t;}
function termScore(d,term){
 const t=docTokens(d);const inTitle=term.kind==='phrase'?phraseIn(t.title,term.value):tokenMatches(t.title,term.value);
 if(term.field==='title')return inTitle?3:0;
 const inBody=term.kind==='phrase'?phraseIn(t.body,term.value):tokenMatches(t.body,term.value);
 if(!inBody)return 0;return term.kind==='phrase'?(inTitle?6:3):(inTitle?3:1);
}
function passFilters(d,f){
 for(const s of f.site){const ok=d.domain===s.domain||d.domain.endsWith('.'+s.domain);if(ok===s.neg)return false;}
 for(const ft of f.filetype){const ok=d.type===ft.type;if(ok===ft.neg)return false;}
 for(const u of f.inurl){const ok=normalize(d.url).includes(u.value);if(ok===u.neg)return false;}
 if(f.after&&d.date<=f.after)return false;
 if(f.before&&d.date>=f.before)return false;
 return true;
}
export function hasOperators(p){return p.negatives.length>0||p.clauses.some(c=>c.length>1||c.some(t=>t.kind==='phrase'||t.field==='title'))||p.filters.site.length+p.filters.filetype.length+p.filters.inurl.length>0||!!p.filters.before||!!p.filters.after;}

export const PAGE_SIZE=5;
// Wyszukiwanie: zwraca wyniki organiczne (posortowane), reklamy, pole AI i ostrzeżenia.
export function search(query,index=docs,ai=aiAnswers){
 const p=parseQuery(query);
 if(!p.clauses.some(c=>!(c.length===1&&c[0].stop)))return {parsed:p,organic:[],total:0,ads:[],ai:null,warnings:[...p.warnings,...(query.trim()?['Dodaj przynajmniej jedno słowo, którego szukasz — same operatory to za mało.']:[])]};
 const scored=[];
 index.forEach((d,order)=>{
  if(d.ad)return;
  if(!passFilters(d,p.filters))return;
  if(p.negatives.some(n=>termScore(d,{...n,field:'any'})>0))return;
  // Zwykłe słowa są „miękkie” (wystarczy większość), fraza w cudzysłowie, intitle: i OR — obowiązkowe.
  let rel=0,soft=0,softHit=0;
  for(const clause of p.clauses){
   if(clause.length===1&&clause[0].stop)continue;
   const best=Math.max(...clause.map(t=>termScore(d,t)));
   const isSoft=clause.length===1&&clause[0].kind==='word'&&clause[0].field==='any';
   if(isSoft){soft++;if(best>0)softHit++;}else if(best<=0)return;
   rel+=best;
  }
  if(soft&&softHit<Math.max(1,Math.ceil(soft*0.6)))return;
  if(rel<=0)return;
  scored.push({doc:d,rank:rel+(d.pop||0),order});
 });
 scored.sort((a,b)=>b.rank-a.rank||a.order-b.order);
 const words=p.clauses.flat();
 const adWords=words.filter(t=>!t.stop).flatMap(t=>t.value.split(' ')).filter(w=>!STOP.has(w));
 const adNeed=Math.max(1,Math.ceil(adWords.length/2));
 const ads=p.filters.site.length||p.filters.filetype.length?[]:index.filter(d=>d.ad&&adWords.filter(w=>termScore(d,{kind:'word',value:w,field:'any'})>0).length>=adNeed&&!p.negatives.some(n=>termScore(d,{...n,field:'any'})>0)).slice(0,2);
 const qt=tokenize(query);
 const box=ai.find(a=>a.triggers.every(group=>group.some(w=>qt.some(t=>t.startsWith(w)))))||null;
 return {parsed:p,organic:scored.map(s=>s.doc),total:scored.length,ads,ai:box,warnings:p.warnings};
}
export function formatDate(d){const [y,m,day]=d.split('-');return `${day}.${m}.${y}`;}

// Punkty za misję: 3 — zapytań ≤ par, 2 — ≤ par+2, 1 — więcej. Pomyłka w pytaniu kontrolnym: −1 (min. 1).
export function missionPoints(queries,par,checkMistakes=0){const base=queries<=par?3:queries<=par+2?2:1;return Math.max(1,base-checkMistakes);}

// ---------------- Indeks fikcyjnych stron ----------------
const D=(id,title,url,type,date,text,extra={})=>({id,title,url,domain:url.replace(/^https?:\/\//,'').split('/')[0],type,date,text,snippet:extra.snippet||text.slice(0,170)+(text.length>170?'…':''),pop:0,...extra});
export const docs=[
 // --- Przykłady (tryb demo) ---
 D('bus-12','Linia 12 — rozkład jazdy, przystanek Technikum','https://mzk-zielonkowo.pl/rozklad/linia-12','html','2026-09-01','Miejski Zakład Komunikacji Zielonkowo. Linia 12: Dworzec — Technikum — Osiedle Słoneczne. Autobus odjeżdża z przystanku Technikum w dni nauki o 14:05, 14:35 i 15:20. Rozkład ważny od 1 września 2026.'),
 D('bus-gta','12 najdziwniejszych autobusów świata. Numer 7 cię zaskoczy!','https://news-szok24.pl/autobusy-swiata','html','2025-06-11','Autobus-basen, autobus-kino i autobus, który jeździ po wodzie. Zobacz 12 niesamowitych pojazdów. Linia 12 w Tokio ma nawet autobus z kuchnią. Rozkład? Kto by się przejmował!',{pop:4,why:'Clickbait — ciekawostki zamiast rozkładu jazdy.'}),
 D('bus-tech','Autobus miejski 12 m — dane techniczne i wyposażenie','https://pojazdy-katalog.pl/autobus-12m','html','2024-02-20','Autobus 12-metrowy mieści do 90 pasażerów. Dane techniczne: silnik, pojemność, wyposażenie. Wersja elektryczna ma zasięg do 300 km. Rozkład jazdy zależy od przewoźnika.',{pop:3,why:'To katalog pojazdów, a nie rozkład jazdy.'}),
 D('bus-game','Symulator Autobusu — poziom 12: linia nocna','https://gry-poradniki.pl/symulator-autobusu-12','html','2025-11-03','Poradnik do gry: jak przejść poziom 12 i nie spóźnić się na przystanek. Rozkład jazdy w grze jest bardzo wymagający — autobus musi być punktualnie.',{pop:3,why:'To poradnik do gry, nie prawdziwy rozkład.'}),
 D('bus-forum','Autobus 12 znowu się spóźnił — forum mieszkańców','https://forum-zielonkowo.pl/watek/autobus-12','html','2025-01-14','Czy tylko mi autobus 12 spóźnia się pod szkołę? Ktoś wie, jaki jest rozkład? Chyba co pół godziny, ale nie jestem pewien.',{pop:2,why:'Forum — ludzie zgadują. Rozkład sprawdzisz u przewoźnika.'}),
 D('work-forum','Ile godzin może pracować 16-latek? Pomocy!','https://forum-mlodziezowe.pl/praca-16-latek-godziny','html','2024-06-18','Mój kolega pracuje po 12 godzin jak dorośli i jest ok. 16 latek może pracować ile chce, jak rodzice się zgodzą. Tak mi mówił szef.',{pop:4,why:'Forum z błędną informacją. Młodociani mają ograniczony czas pracy.'}),
 D('work-blog','Praca dla 16-latka: ile możesz zarobić i ile godzin pracować','https://blog-kasa-na-start.pl/praca-16-latek','html','2025-05-02','Chcesz zarobić w wakacje? Sprawdź, gdzie szukać pracy. Ile godzin? To zależy od pracodawcy — zwykle tyle, ile się dogadacie. Może pracować nawet w nocy!',{pop:4,why:'Blog bez źródeł i z błędem: młodocianym nie wolno pracować w nocy.'}),
 D('work-news','16-latek pracował 14 godzin dziennie. Szok w wakacje','https://news-szok24.pl/16-latek-praca','html','2025-07-22','Nastolatek może pracować w wakacje, ale czy aż tyle godzin? Pracodawca ukarany. Ile godzin jest legalne? Sprawdź w urzędzie.',{pop:3,why:'Sensacyjny artykuł, bez konkretnej odpowiedzi.'}),
 D('work-gov','Czas pracy młodocianych — zasady','https://prawa-pracy-info.gov.pl/mlodociani/czas-pracy','html','2026-03-10','Młodociany to osoba w wieku 15–18 lat. Czas pracy młodocianych: do 16 lat — najwyżej 6 godzin na dobę, powyżej 16 lat — najwyżej 8 godzin na dobę (Kodeks pracy, art. 202). Młodocianych nie wolno zatrudniać w nocy ani w godzinach nadliczbowych. Ile godzin może pracować 16-latek? Najwyżej 8 dziennie.'),
 D('math-pdf','Funkcja liniowa — karta pracy do druku (PDF)','https://matma-karty.pl/funkcja-liniowa-karta.pdf','pdf','2025-09-15','Karta pracy: funkcja liniowa. 12 zadań z odpowiedziami, wykresy do uzupełnienia. Gotowa do wydruku na A4.'),
 D('math-quiz','Funkcja liniowa — karta pracy online (quiz)','https://matma-karty.pl/funkcja-liniowa-quiz','html','2025-09-15','Interaktywna karta pracy: funkcja liniowa. Rozwiąż quiz w przeglądarce i sprawdź wynik. Nie do druku.',{pop:3,why:'To quiz online, a potrzebujesz PDF do wydruku.'}),
 D('math-video','Funkcja liniowa w 10 minut — wideo + karta pracy','https://nauka-wideo.pl/funkcja-liniowa','html','2024-10-01','Obejrzyj lekcję wideo o funkcji liniowej. Karta pracy do filmu w opisie (link do zakupu).',{pop:3,why:'To strona z filmem, nie plik PDF.'}),
 // --- Poziom 1: cytat ---
 D('lit-romantycznosc','Adam Mickiewicz — Romantyczność (pełny tekst ballady)','https://lekturownia.pl/mickiewicz/romantycznosc','html','2023-05-10','Ballada Adama Mickiewicza z tomu „Ballady i romanse” (1822). Fragment: „Czucie i wiara silniej mówi do mnie / Niż mędrca szkiełko i oko”. Utwór uznaje się za manifest polskiego romantyzmu.'),
 D('lit-forum','Z jakiej lektury jest „czucie i wiara”? Pilne!!!','https://forumlekcyjne.pl/watek/czucie-i-wiara','html','2024-11-05','Czucie i wiara silniej mówi do mnie — to chyba z Pana Tadeusza? Mówi mi to coś, ale nie jestem pewna. Do mnie pani mówi, że to ważne na kartkówkę.',{pop:4,why:'Forum, na którym ktoś zgaduje — i się myli. To nie jest „Pan Tadeusz”.'}),
 D('lit-song','Czucie i wiara — nowy singiel zespołu Szkiełko (tekst)','https://teksty-piosenek-pl.pl/szkielko/czucie-i-wiara','html','2026-04-02','Tekst piosenki: „Czucie i wiara, mówi do mnie noc, silniej niż ty…”. Zespół Szkiełko inspirował się romantyzmem. Mówi do mnie ta piosenka!',{pop:4,why:'Tekst piosenki, która tylko inspiruje się cytatem.'}),
 D('lit-selfhelp','Wiara w siebie: 7 kroków do pewności siebie','https://poradnik-motywacja.pl/wiara-w-siebie','html','2025-02-14','Czucie spokoju i wiara w siebie działają silniej niż motywacyjne filmiki. Coś mówi do mnie: „dasz radę”? Posłuchaj tego głosu. Krok 1: zapisz swoje sukcesy.',{pop:4,why:'Poradnik motywacyjny, nie lektura.'}),
 D('lit-health','Czucie w palcach po treningu — kiedy do lekarza?','https://zdrowie-bez-stresu.pl/czucie-w-palcach','html','2025-08-30','Mrowienie i słabsze czucie w palcach? Wiara, że samo przejdzie, to błąd. Jeśli objawy mówią do mnie silniej niż ból — idę do lekarza. Mówi o tym fizjoterapeuta.',{pop:3,why:'Artykuł o zdrowiu — przypadkowe dopasowanie słów.'}),
 D('lit-epoch','Romantyzm w pigułce — ściąga przed sprawdzianem','https://sciagi-24.pl/romantyzm','html','2024-01-20','Najważniejsze cechy epoki: uczucia ponad rozum. Cytat: „Czucie i wiara silniej mówi do mnie niż mędrca szkiełko i oko” (autor? zajrzyj do tekstu). Mówi do mnie ta epoka!',{pop:3,why:'Ściąga o epoce bez autora i pełnego tekstu. Szukasz utworu, z którego pochodzi cytat.'}),
 D('lit-ad','Perfumy „Czucie & Wiara” — nowy zapach -30%','https://perfumeria-przyklad.pl/czucie-wiara','html','2026-09-01','Poczuj to. Perfumy Czucie & Wiara — mówią więcej niż słowa. Silniej, dłużej, intensywniej.',{ad:true,why:'To reklama perfum.'}),
 // --- Poziom 1: słuchawki ---
 D('fix-b20','Słuchawki nie łączą się przez Bluetooth? 6 kroków naprawy','https://serwisowo.pl/poradniki/sluchawki-bluetooth-nie-lacza','html','2026-02-11','Słuchawki bluetooth nie łączą się z telefonem? Zanim oddasz je do serwisu: 1) naładuj je, 2) usuń je z listy urządzeń w telefonie, 3) zresetuj słuchawki (np. Dźwiękon B20: przytrzymaj przycisk zasilania 10 s), 4) sparuj od nowa. Działa w 8 na 10 przypadków.'),
 D('fix-b20-pdf','Dźwiękon B20 — instrukcja obsługi: parowanie i reset (PDF)','https://dzwiekon.pl/pliki/b20-instrukcja.pdf','pdf','2025-03-01','Instrukcja słuchawek Dźwiękon B20. Parowanie przez Bluetooth: przytrzymaj przycisk 5 s, aż dioda zamiga. Słuchawki nie łączą się? Wykonaj reset: przytrzymaj przycisk 10 s.'),
 D('shop-audiomax','Słuchawki Bluetooth — sklep AudioMax: cena, dostawa 24h','https://sklep-audiomax.pl/sluchawki-bluetooth','html','2026-09-10','Twoje słuchawki nie łączą się już z telefonem? Wymień je na nowe! Słuchawki bluetooth w najlepszej cenie w sklepie AudioMax. Dźwiękon B20 i inne modele.',{pop:4,why:'To sklep — chce sprzedać nowe słuchawki, a nie naprawić Twoje.'}),
 D('shop-ranking','Ranking słuchawek Bluetooth 2026 — które kupić? Ceny','https://ranking-sluchawek.pl/2026','html','2026-01-05','Stare słuchawki nie łączą się z telefonem? Czas na nowe! Porównanie cen w sklepach: Dźwiękon B20, B30 i inne słuchawki bluetooth.',{pop:4,why:'Ranking zakupowy z linkami do sklepów, bez naprawy.'}),
 D('shop-compare','Dźwiękon B20 — cena od 129 zł w 14 sklepach','https://porownaj-ceny-przyklad.pl/dzwiekon-b20','html','2026-09-01','Porównaj ceny słuchawek bluetooth Dźwiękon B20. Opinie: „nie łączą się z laptopem”, „super bas”. Kup w sklepie z darmową dostawą.',{pop:4,why:'Porównywarka cen — służy do kupowania.'}),
 D('shop-bazar','Elektroniczny Bazar: słuchawki bluetooth — promocja','https://elektroniczny-bazar.pl/sluchawki','html','2026-08-20','Słuchawki bluetooth w promocji! Nie łączą się stare? Sklep Elektroniczny Bazar poleca nowe modele. Niska cena, raty 0%.',{pop:4,why:'Kolejny sklep.'}),
 D('fix-clickbait','5 powodów, dla których Twoje słuchawki Cię nienawidzą','https://news-szok24.pl/sluchawki-nienawidza','html','2025-12-12','Słuchawki bluetooth nie łączą się? Może to zemsta za rzucanie nimi o biurko! Zobacz galerię 30 zdjęć. Powód nr 3 zaskoczy każdego.',{pop:4,why:'Clickbait — galeria zdjęć zamiast rozwiązania.'}),
 D('fix-forum','Słuchawki bluetooth nie łączą się — co robić?','https://forum-techniczne-przyklad.pl/sluchawki-nie-lacza','html','2024-07-03','Moje słuchawki bluetooth nie łączą się z telefonem. Odpowiedź: wyrzuć i kup nowe w sklepie, szkoda czasu.',{pop:3,why:'Forum bez konkretnej naprawy — „wyrzuć i kup” to nie rozwiązanie.'}),
 D('shop-producer','Dźwiękon B20 — kup w sklepie producenta','https://dzwiekon.pl/sklep/b20','html','2026-06-01','Słuchawki bluetooth Dźwiękon B20. Cena 149 zł. Twoje stare nie łączą się? Wymień je w programie „stare za nowe”.',{pop:3,why:'Sklep producenta — sprzedaż, nie naprawa.'}),
 D('shop-promo','Słuchawki bluetooth — promocje tygodnia do −40%','https://sklep-audiomax.pl/promocje/sluchawki','html','2026-09-15','Promocja: słuchawki bluetooth taniej o 40%. Twoje nie łączą się z telefonem? Nie naprawiaj — kup nowe w sklepie, cena od 59 zł.',{pop:5,why:'Promocja w sklepie — nadal sprzedaż, nie naprawa.'}),
 D('shop-guide','Jak wybrać słuchawki bluetooth? Poradnik zakupowy','https://ranking-sluchawek.pl/jak-wybrac','html','2026-03-20','Słuchawki bluetooth nie łączą się dobrze z Twoim telefonem? Sprawdź kodeki, zanim kupisz nowe. Ceny i linki do sklepów.',{pop:5,why:'Poradnik zakupowy — o wyborze nowych, a nie naprawie Twoich.'}),
 D('fix-ad','Słuchawki Bluetooth od 49 zł — kup teraz!','https://tanie-sluchawki-przyklad.pl','html','2026-09-01','Nowe słuchawki bluetooth od 49 zł. Stare nie łączą się? Kup nowe z dostawą jutro.',{ad:true,why:'To reklama.'}),
 // --- Poziom 1: burrito ---
 D('burrito-wege','Wege burrito z fasolą i ryżem — 4 porcje za 14 zł (przepis)','https://tanie-gotowanie.pl/wege-burrito','html','2026-03-03','Tanie burrito bez mięsa na obiad dla 4 osób: fasola, ryż, kukurydza, papryka i ser. Przepis krok po kroku, koszt ok. 14 zł. Wegetariańskie, sycące i gotowe w 25 minut.'),
 D('burrito-kurczak','Burrito z kurczakiem — tanie i szybkie (przepis)','https://przepisy-z-garow.pl/burrito-kurczak','html','2025-10-10','Tanie burrito z kurczakiem, ryżem i fasolą. Przepis na 4 porcje. Burrito bez mięsa? Nie w tym domu! Kurczak to podstawa.',{pop:4,why:'Przepis z kurczakiem — Twój znajomy nie je mięsa.'}),
 D('burrito-wolowina','Burrito wołowe jak z food trucka — przepis','https://kuchnia-na-bogato.pl/burrito-wolowe','html','2025-05-19','Soczysta wołowina, fasola i salsa. Przepis na tanie burrito jak z food trucka. Bez mięsa to już nie to samo.',{pop:4,why:'Przepis z wołowiną.'}),
 D('burrito-mielone','Tanie burrito z mielonym na imprezę','https://przepisy-z-garow.pl/burrito-mielone','html','2024-09-09','Przepis na tanie burrito z mięsem mielonym dla 6 osób. Burrito bez mięsa? Spróbuj, ale nasza wersja z mielonym wygrywa.',{pop:4,why:'Przepis z mięsem mielonym.'}),
 D('burrito-wieprz','Burrito z szarpaną wieprzowiną — przepis weekendowy','https://kuchnia-na-bogato.pl/burrito-wieprzowina','html','2025-01-25','Szarpana wieprzowina z 6 godzin pieczenia. Tanie? Niekoniecznie. Przepis na burrito dla cierpliwych. Wersja bez mięsa to inna historia.',{pop:3,why:'Wieprzowina to też mięso.'}),
 D('burrito-krewetki','Burrito z krewetkami — przepis na specjalną okazję','https://kuchnia-na-bogato.pl/burrito-krewetki','html','2025-07-07','Krewetki, awokado i limonka. Wcale nie tanie, ale pyszne burrito. Przepis dla 2 osób. Nie jest bez mięsa — krewetki to owoce morza.',{pop:3,why:'Krewetki odpadają (i budżet 15 zł też).'}),
 D('burrito-historia','Burrito — skąd się wzięło? Historia potrawy','https://jedzenie-historia.pl/burrito','html','2023-03-15','Burrito pochodzi z północnego Meksyku. Dawniej było tanie i proste: bez mięsa, z fasolą. Przepis? Ten artykuł go nie zawiera.',{pop:3,why:'Artykuł o historii, bez przepisu.'}),
 D('burrito-ad','Zamów burrito z dostawą w 20 minut','https://dostawa-jedzenia-przyklad.pl/burrito','html','2026-09-01','Burrito z mięsem lub bez mięsa, dostawa gratis od 50 zł. Tanie jedzenie na wynos.',{ad:true,why:'Reklama dostawy — a miałeś ugotować sam za 15 zł.'}),
 // --- Poziom 2: regulamin praktyk ---
 D('reg-2026','Regulamin praktyk zawodowych 2026/2027','https://zs-przyklad.edu.pl/dokumenty/regulamin-praktyk-2026.pdf','pdf','2026-08-28','Zespół Szkół Przykład. Regulamin praktyk zawodowych obowiązujący od 1 września 2026. Obowiązki praktykanta, dzienniczek praktyk, zasady zaliczenia, obecność.'),
 D('reg-2019','Regulamin praktyk zawodowych 2019/2020 (archiwum)','https://zs-przyklad.edu.pl/archiwum/regulamin-praktyk-2019.pdf','pdf','2019-09-02','Zespół Szkół Przykład. Regulamin praktyk zawodowych — wersja archiwalna z 2019 r. Nieobowiązujący.',{why:'To wersja z 2019 r. — archiwalna. Szukasz aktualnej.'}),
 D('reg-news','Praktyki zawodowe: spotkanie informacyjne dla klas II','https://zs-przyklad.edu.pl/aktualnosci/praktyki-spotkanie','html','2026-09-02','Aktualności. Zapraszamy na spotkanie o praktykach zawodowych. Regulamin praktyk znajdziecie w zakładce Dokumenty (PDF).',{pop:2,why:'To ogłoszenie o spotkaniu. Sam regulamin jest w PDF.'}),
 D('reg-inna','Regulamin praktyk zawodowych — ZS nr 2 w Borowie','https://zs-inna.edu.pl/regulamin-praktyk','html','2026-06-15','Regulamin praktyk zawodowych Zespołu Szkół nr 2 w Borowie. Uczniowie odbywają praktyki w firmach partnerskich.',{pop:4,why:'Regulamin innej szkoły — u Ciebie mogą być inne zasady.'}),
 D('reg-wzor','Regulamin praktyk zawodowych — wzór do pobrania (DOCX)','https://wzory-dokumentow.pl/regulamin-praktyk.docx','docx','2024-04-04','Gotowy wzór: regulamin praktyk zawodowych do edycji. Pobierz i wpisz nazwę swojej szkoły.',{pop:4,why:'Pusty wzór dokumentu, a nie regulamin Twojej szkoły.'}),
 D('reg-uczelnia','Regulamin studenckich praktyk zawodowych','https://uczelnia-przyklad.edu.pl/dokumenty/regulamin-praktyk.pdf','pdf','2025-10-01','Regulamin praktyk zawodowych dla studentów. Dotyczy studiów pierwszego stopnia.',{pop:3,why:'Regulamin uczelni — dotyczy studentów.'}),
 D('reg-firma','Regulamin praktyk w naszej firmie — dla praktykantów','https://firma-przyklad.pl/praktyki/regulamin','html','2025-02-12','Regulamin praktyk zawodowych w firmie Przykład sp. z o.o. Zasady BHP, godziny pracy praktykantów.',{pop:3,why:'Regulamin jednej firmy, nie Twojej szkoły.'}),
 D('reg-clickbait','Praktyki zawodowe: 10 rzeczy, których nikt Ci nie powie','https://news-szok24.pl/praktyki-10-rzeczy','html','2025-09-01','Regulamin praktyk to nudy? Te 10 rzeczy musisz wiedzieć o praktykach zawodowych. Nr 6 to hit!',{pop:4,why:'Clickbait.'}),
 // --- Poziom 2: ulgi (z pułapką AI) ---
 D('ulgi-gov','Ulgi ustawowe w przejazdach kolejowych — kto i ile','https://przejazdy-info.gov.pl/ulgi','html','2026-05-12','Ulgi ustawowe: uczniowie szkół ponadpodstawowych do 24 lat — 37% na bilety jednorazowe i 49% na bilety miesięczne imienne. Studenci do 26 lat — 51%. Dokument: legitymacja szkolna lub mLegitymacja. Zniżka dla ucznia w pociągu obowiązuje we wszystkich pociągach krajowych.'),
 D('ulgi-forum','Ile ulgi ma uczeń na pociąg? 51% jak student?','https://forum-podroznika.pl/ulga-uczen-pociag','html','2024-03-08','Uczeń ma chyba 51% ulgi na pociąg, tak jak student. Zniżka na każdy bilet. Tak mi się wydaje, jeżdżę tak od roku i nikt nie sprawdzał.',{pop:4,why:'Forum z błędem: 51% to ulga studencka.'}),
 D('ulgi-blog','Jak jeździć pociągiem taniej? 10 trików dla ucznia','https://blog-oszczedny-student.pl/pociag-taniej','html','2025-08-14','Zniżka dla ucznia na pociąg, bilety grupowe, promocje. Ulga? Około połowy ceny, dokładnie nie pamiętam. Bilet kupuj w aplikacji.',{pop:4,why:'Blog bez dokładnej liczby i bez źródła.'}),
 D('ulgi-carrier','KolejSim — cennik i ulgi','https://kolejsim.pl/cennik','html','2026-01-02','Cennik przewoźnika KolejSim. Uczeń: ulga 37% na bilet jednorazowy. Zniżka dla ucznia w pociągu na podstawie legitymacji.',{pop:2,why:'Strona przewoźnika — dobra wskazówka, ale misja wymaga źródła rządowego (.gov.pl).'}),
 D('ulgi-fake','Ulgi na przejazdy — sprawdź i odbierz zwrot za bilety','https://przejazdy-info-gov.pl/zwrot','html','2026-09-20','Uczeń? Należy Ci się zwrot za bilety na pociąg! Zniżka do 100%. Podaj dane karty, aby otrzymać zwrot ulgi.',{pop:3,why:'Pułapka! Adres kończy się na „-gov.pl”, a nie „.gov.pl”. Strona chce danych karty — to phishing.'}),
 D('ulgi-szok','Uczniowie jeżdżą pociągiem za darmo?! Sprawdź','https://news-szok24.pl/uczniowie-za-darmo','html','2025-09-10','Ulga dla ucznia na pociąg — czy naprawdę 100%? Zniżka, o której mówi cała Polska. Kliknij, żeby się dowiedzieć!',{pop:4,why:'Clickbait bez konkretów.'}),
 D('ulgi-student','Ulga studencka 51% — kto może z niej korzystać','https://uczelnia-przyklad.edu.pl/ulga-studencka','html','2026-02-01','Ulga studencka na pociąg: 51% zniżki dla studentów do 26 lat. Uczeń szkoły średniej nie jest studentem.',{pop:2,why:'Dotyczy studentów, nie uczniów.'}),
 D('ulgi-ad','Tanie bilety autokarowe od 9 zł','https://autokary-przyklad.pl','html','2026-09-01','Bilety autokarowe zamiast pociągu. Zniżka dla ucznia 10%.',{ad:true,why:'Reklama przewoźnika autokarowego.'}),
 // --- Poziom 2: praca OR ---
 D('job-lody','Praca sezonowa — lodziarnia, Zielonkowo, od 16 lat','https://pracuj-lokalnie.pl/oferta/lodziarnia-zielonkowo','html','2026-05-20','Praca sezonowa na lato w Zielonkowie: lodziarnia przy rynku. Przyjmujemy osoby od 16 lat (zgoda rodzica). Umowa zlecenie, 26 zł/h brutto, zmiany do 6 godzin, w dzień.'),
 D('job-sklep','Praca wakacyjna — sklep spożywczy, Zielonkowo','https://pracuj-lokalnie.pl/oferta/sklep-zielonkowo','html','2026-05-25','Praca wakacyjna w Zielonkowie: kasa i wykładanie towaru. Tylko osoby pełnoletnie (18+). Umowa zlecenie.',{why:'Tylko 18+ — masz 16 lat.'}),
 D('job-nocna','Praca sezonowa — magazyn, Zielonkowo, zmiany nocne','https://pracuj-lokalnie.pl/oferta/magazyn-nocny','html','2026-06-01','Praca sezonowa w Zielonkowie od 16 lat: pakowanie paczek, zmiany nocne 22:00–6:00, dobra stawka.',{why:'Pracy w nocy osoby poniżej 18 lat wykonywać nie mogą (Kodeks pracy). Uczciwy pracodawca by tego nie proponował.'}),
 D('job-scam','Łatwa praca wakacyjna 300 zł/h — tylko lajkowanie!','https://latwa-kasa-teraz.xyz/praca','html','2026-06-10','Praca wakacyjna zdalna, Zielonkowo i cała Polska. 300 zł/h za lajkowanie filmików. Wpisowe 49 zł. Od 16 lat.',{pop:4,why:'Oszustwo: nierealna stawka i opłata wstępna.'}),
 D('job-morze','Praca sezonowa nad morzem — Morskowo','https://pracuj-lokalnie.pl/oferta/morskowo','html','2026-04-30','Praca sezonowa w smażalni w Morskowie. Zakwaterowanie. Od 18 lat.',{pop:2,why:'Inne miasto i tylko 18+.'}),
 D('job-porady','Praca wakacyjna dla nastolatka — 10 porad','https://blog-kasa-na-start.pl/praca-wakacyjna','html','2026-05-05','Gdzie szukać: praca wakacyjna, praca sezonowa, Zielonkowo i inne miasta. Umowa zlecenie czy o pracę? Poradnik.',{pop:4,why:'Poradnik, a nie oferta pracy.'}),
 D('job-news','Rynek pracy sezonowej w Zielonkowie rośnie','https://gazeta-zielonkowo.pl/praca-sezonowa-2026','html','2026-04-12','Coraz więcej ofert: praca sezonowa i praca wakacyjna w Zielonkowie. Pracodawcy szukają młodych osób.',{pop:3,why:'Artykuł o rynku pracy, bez konkretnej oferty.'}),
 // --- Boss A: instrukcja hulajnogi ---
 D('volt-s3-pdf','Voltino S3 — instrukcja obsługi (PDF, język polski)','https://voltino.pl/pliki/instrukcja-s3-pl.pdf','pdf','2025-04-01','Instrukcja obsługi hulajnogi elektrycznej Voltino S3: ładowanie, hamulce, ciśnienie w oponach, kody błędów. Wersja polska.'),
 D('volt-s2-pdf','Voltino S2 — instrukcja obsługi (PDF)','https://voltino.pl/pliki/instrukcja-s2-pl.pdf','pdf','2023-03-01','Instrukcja obsługi hulajnogi elektrycznej Voltino S2 (starszy model, nie S3). Ładowanie, hamulce.',{why:'To instrukcja modelu S2, a masz S3.'}),
 D('volt-s3-xyz','Voltino S3 instrukcja PDF — pobierz za darmo!!!','https://pdf-darmowe.xyz/voltino-s3-instrukcja.pdf','pdf','2026-07-07','Voltino S3 instrukcja obsługi PDF, pobierz za darmo. Kliknij POBIERZ, zainstaluj menedżer pobierania.',{pop:3,why:'Plik z nieznanej strony — może zawierać wirusa. Instrukcję bierz od producenta.'}),
 D('volt-s3-shop','Voltino S3 — cena 1899 zł, instrukcja w zestawie','https://hulajnogi-sklep.pl/voltino-s3','html','2026-08-01','Hulajnoga Voltino S3 w sklepie. Instrukcja obsługi w zestawie. Darmowa dostawa.',{pop:4,why:'Sklep — instrukcji tu nie przeczytasz.'}),
 D('volt-s3-test','Test Voltino S3 po 1000 km — czy warto?','https://jednoslad-testy.pl/voltino-s3','html','2026-05-15','Recenzja Voltino S3. Instrukcja obsługi? Krótka, ale jest PDF u producenta.',{pop:4,why:'Recenzja, a nie instrukcja.'}),
 D('volt-s3-used','Voltino S3 używana — sprzedam, bez instrukcji','https://elektroniczny-bazar.pl/ogloszenie/voltino-s3','html','2026-09-05','Sprzedam hulajnogę Voltino S3, instrukcja zgubiona. Cena do negocjacji.',{pop:3,why:'Ogłoszenie sprzedaży.'}),
 D('volt-home','Voltino — hulajnogi elektryczne: sklep producenta','https://voltino.pl','html','2026-01-01','Hulajnogi elektryczne Voltino S2, S3, S5. Kup w sklepie producenta. Instrukcje obsługi w zakładce Pliki.',{pop:3,why:'Strona główna ze sklepem — szukasz konkretnego pliku PDF.'}),
 D('volt-s3-parts','Voltino S3 — części zamienne i instrukcja montażu błotnika','https://hulajnogi-sklep.pl/czesci/voltino-s3','html','2026-06-20','Części do Voltino S3: opony, klocki, błotnik. Instrukcja montażu błotnika w opisie produktu. Sklep z dostawą 24h.',{pop:4,why:'Sklep z częściami — to nie instrukcja obsługi hulajnogi.'}),
 D('volt-s3-forum','Voltino S3 nie włącza się — instrukcja nic nie mówi?','https://forum-techniczne-przyklad.pl/voltino-s3','html','2025-11-11','Mam Voltino S3, instrukcja gdzieś zginęła, hulajnoga nie włącza się. Ktoś pomoże? Odp.: naładuj do pełna.',{pop:4,why:'Wątek na forum, a nie instrukcja producenta.'}),
 // --- Boss B: praktyki po 1 września ---
 D('prak-2026','Oferta praktyk: technik informatyk — serwis komputerowy','https://up-zielonkowo.gov.pl/oferty/praktyki-informatyk-2026-09','html','2026-09-14','Powiatowy Urząd Pracy w Zielonkowie. Praktyki zawodowe dla ucznia technikum, zawód technik informatyk. Serwis komputerowy „Bajt”, Zielonkowo. Oferta aktualna.'),
 D('prak-2025a','Oferta praktyk: technik informatyk — biuro rachunkowe','https://up-zielonkowo.gov.pl/oferty/praktyki-informatyk-2025-03','html','2025-03-10','Powiatowy Urząd Pracy w Zielonkowie. Praktyki dla ucznia: technik informatyk. Biuro rachunkowe, Zielonkowo. Oferta archiwalna.',{why:'Oferta z marca 2025 r. — nieaktualna.'}),
 D('prak-2025b','Oferta praktyk: technik informatyk — sklep komputerowy','https://up-zielonkowo.gov.pl/oferty/praktyki-informatyk-2025-10','html','2025-10-02','Powiatowy Urząd Pracy w Zielonkowie. Praktyki zawodowe: technik informatyk, sklep komputerowy, Zielonkowo. Rekrutacja zakończona.',{why:'Oferta z 2025 r., rekrutacja zakończona.'}),
 D('prak-portal','Praktyki technik informatyk Zielonkowo — 5 ofert','https://pracuj-lokalnie.pl/praktyki/informatyk-zielonkowo','html','2026-09-15','Praktyki dla ucznia: technik informatyk, Zielonkowo. Oferty firm prywatnych.',{pop:4,why:'Prywatny portal — misja: oferta z urzędu pracy (.gov.pl).'}),
 D('prak-borowo','Oferta praktyk: technik informatyk — Borowo','https://up-borowo.gov.pl/oferty/praktyki-informatyk','html','2026-09-20','Powiatowy Urząd Pracy w Borowie. Praktyki: technik informatyk. Firma w Borowie (40 km od Zielonkowa).',{pop:1,why:'To Borowo, nie Zielonkowo.'}),
 D('prak-blog','Praktyki dla technika informatyka — jak znaleźć dobre miejsce?','https://blog-kasa-na-start.pl/praktyki-informatyk','html','2026-02-02','Technik informatyk szuka praktyk? Zacznij od urzędu pracy w swoim mieście, np. w Zielonkowie. 7 porad, jak napisać maila do firmy.',{pop:4,why:'Poradnik, a nie oferta praktyk.'}),
 D('prak-gazeta','Zielonkowo: firma IT szuka praktykantów','https://gazeta-zielonkowo.pl/praktyki-it-2024','html','2024-05-06','Firma z Zielonkowa szuka praktykantów — technik informatyk mile widziany. Artykuł z 2024 r.',{pop:4,why:'Artykuł z 2024 r., a nie aktualna oferta z urzędu.'}),
 D('prak-portal2','Technik informatyk — praktyki w wakacje, oferty z całej Polski','https://oferty-praktyk-przyklad.pl/technik-informatyk','html','2026-06-30','Praktyki dla ucznia: technik informatyk. Zielonkowo, Borowo, Morskowo i inne miasta. Zobacz oferty firm.',{pop:4,why:'Prywatny portal z ofertami z całej Polski — misja: oferta z urzędu pracy (.gov.pl).'}),
 D('prak-scam','Płatne praktyki IT dla ucznia — gwarancja zatrudnienia!','https://kariera-it-szybko.xyz/praktyki','html','2026-09-18','Praktyki technik informatyk, Zielonkowo i online. Opłata za kurs przygotowujący 999 zł. Gwarancja pracy!',{pop:4,why:'Praktyki za opłatą 999 zł „z gwarancją” — typowa pułapka.'})
];

export const aiAnswers=[
 {id:'ai-ulga',triggers:[['ulg','znizk'],['uczn','pociag','kolej','bilet']],text:'Uczniowie szkół średnich mają 51% ulgi na wszystkie bilety kolejowe — jednorazowe i miesięczne.',source:'ulgi-forum',wrong:true},
 {id:'ai-bt',triggers:[['sluchaw'],['bluetooth','lacz','parow']],text:'Jeśli słuchawki nie łączą się przez Bluetooth: naładuj je, usuń z listy sparowanych urządzeń, zresetuj i sparuj ponownie.',source:'fix-b20',wrong:false}
];

// ---------------- Misje ----------------
export const missions=[
 {id:'m-quote',level:1,title:'Cytat na kartkówkę',prompt:'Polonistka: „Kto napisał: Czucie i wiara silniej mówi do mnie niż mędrca szkiełko i oko? Za 5 minut kartkówka”. Znajdź stronę z pełnym tekstem utworu, z którego pochodzi cytat.',targetIds:['lit-romantycznosc'],par:1,hint:'Wpisz fragment cytatu w cudzysłowie — wyszukiwarka pokaże tylko strony z dokładnie tym zdaniem.',operatorHint:'"czucie i wiara silniej mówi do mnie"',check:{question:'Z jakiego utworu pochodzi cytat?',options:['„Pan Tadeusz” Adama Mickiewicza','„Romantyczność” Adama Mickiewicza','Piosenka zespołu Szkiełko'],correct:1,explanation:'„Romantyczność” (1822) — ballada, uznawana za manifest polskiego romantyzmu. Forum się myliło!'}},
 {id:'m-headphones',level:1,title:'Słuchawki bez sklepów',prompt:'Twoje słuchawki Dźwiękon B20 nie łączą się z telefonem przez Bluetooth. Nie chcesz wydawać 150 zł na nowe. Znajdź poradnik lub instrukcję naprawy — nie sklep.',targetIds:['fix-b20','fix-b20-pdf'],par:2,hint:'Wyniki zaśmiecają sklepy. Wyklucz słowa, które pojawiają się na stronach sklepów, np. -sklep -cena.',operatorHint:'słuchawki bluetooth nie łączą się -sklep -cena'},
 {id:'m-burrito',level:1,title:'Obiad za 15 zł, bez mięsa',prompt:'Robisz obiad dla czterech osób za maks. 15 zł. Jedna osoba nie je mięsa. Znajdź przepis na tanie burrito bez mięsa.',targetIds:['burrito-wege'],par:2,hint:'Słowa „bez mięsa” pojawiają się też w przepisach z mięsem („bez mięsa to nie to samo”). Wyklucz konkretne mięsa minusem: -kurczak -wołowina…',operatorHint:'tanie burrito przepis -kurczak -wołowina -mielonym -wieprzowina',traps:[{pattern:'-mies',text:'Uwaga: -mięso wycina też strony z napisem „bez mięsa” — czyli także ten przepis, którego szukasz! Wykluczaj konkretne składniki: -kurczak -wołowina.'}]},
 {id:'m-rules',level:2,title:'Regulamin praktyk',prompt:'Za tydzień praktyki. Wychowawczyni: „Regulamin jest na stronie szkoły w PDF — przeczytajcie”. Strona szkoły: zs-przyklad.edu.pl. Znajdź AKTUALNY regulamin.',targetIds:['reg-2026'],par:2,hint:'Ogranicz wyniki do strony szkoły (site:) i do plików PDF (filetype:). Potem sprawdź datę!',operatorHint:'regulamin praktyk site:zs-przyklad.edu.pl filetype:pdf'},
 {id:'m-discount',level:2,title:'Ile zniżki na pociąg?',prompt:'Kolega twierdzi, że uczniowie mają 51% zniżki na pociąg. Sprawdź w oficjalnym źródle rządowym (domena .gov.pl), ile zniżki masz na bilet jednorazowy. Uwaga na odpowiedź AI!',targetIds:['ulgi-gov'],par:2,hint:'Oficjalne strony instytucji publicznych w Polsce kończą się na .gov.pl. Użyj site:gov.pl.',operatorHint:'ulga uczeń pociąg site:gov.pl',check:{question:'Ile zniżki na bilet jednorazowy ma uczeń według oficjalnego źródła?',options:['37%','49%','51%'],correct:0,explanation:'37% na jednorazowy. 49% dotyczy biletów miesięcznych imiennych, a 51% — studentów. Odpowiedź AI pomyliła uczniów ze studentami, bo wzięła informację z forum.'}},
 {id:'m-job',level:2,title:'Praca na wakacje',prompt:'Masz 16 lat i chcesz zarobić w wakacje w Zielonkowie. Ogłoszenia nazywają to różnie: „praca wakacyjna” albo „praca sezonowa”. Znajdź uczciwą ofertę, którą możesz przyjąć.',targetIds:['job-lody'],par:2,hint:'Połącz dwie nazwy operatorem OR (wielkimi literami), a frazy weź w cudzysłów. Potem czytaj warunki: wiek, godziny, opłaty.',operatorHint:'"praca wakacyjna" OR "praca sezonowa" Zielonkowo'},
 {id:'m-manual',level:'boss',title:'Boss A: instrukcja hulajnogi',prompt:'Kupiłeś używaną hulajnogę Voltino S3 bez instrukcji. Znajdź oficjalną instrukcję w PDF ze strony producenta voltino.pl — nie sklep i nie przypadkowy plik z sieci.',targetIds:['volt-s3-pdf'],par:2,hint:'Połącz operatory: model w cudzysłowie, site: producenta i filetype:pdf.',operatorHint:'"voltino s3" instrukcja site:voltino.pl filetype:pdf'},
 {id:'m-internship',level:'boss',title:'Boss B: świeże praktyki',prompt:'Szukasz praktyk dla technika informatyka w Zielonkowie. Znajdź ofertę z urzędu pracy (domena .gov.pl) opublikowaną po 1 września 2026 — starsze są nieaktualne.',targetIds:['prak-2026'],par:2,hint:'site:gov.pl zostawi urzędy. after:2026-09-01 pokaże tylko nowsze strony. Sprawdź też miasto!',operatorHint:'praktyki technik informatyk Zielonkowo site:gov.pl after:2026-09-01'}
];

export const demoExamples=[
 {id:'ex-bus',goal:'Kiedy odjeżdża autobus linii 12 spod szkoły?',steps:[
  {query:'autobus 12',comment:'Za ogólne. „Autobus” i „12” pasują do ciekawostek, katalogów i gier. Wyszukiwarka nie wie, że chodzi o rozkład w Twoim mieście.'},
  {query:'"linia 12" rozkład Zielonkowo',comment:'Lepiej: dokładna fraza „linia 12” w cudzysłowie + słowo „rozkład” + nazwa miasta. Pierwszy wynik to strona przewoźnika.'}]},
 {id:'ex-work',goal:'Ile godzin dziennie może legalnie pracować 16-latek w wakacje? Chcesz oficjalnego źródła.',steps:[
  {query:'ile godzin może pracować 16 latek',comment:'Na górze forum i blog — z błędami („może pracować ile chce”, „nawet w nocy”). Popularne nie znaczy prawdziwe.'},
  {query:'czas pracy młodocianych site:gov.pl',comment:'Fachowe hasło („młodociani”) + site:gov.pl zostawia tylko strony instytucji publicznych. Odpowiedź: powyżej 16 lat — maks. 8 godzin na dobę, bez pracy w nocy.'}]},
 {id:'ex-math',goal:'Potrzebujesz karty pracy z funkcji liniowej — tylko plik PDF do wydruku.',gap:{before:'karta pracy funkcja liniowa ',after:'pdf',options:['filetype:','site:','intitle:'],correct:0,explanation:'filetype:pdf zostawia tylko pliki PDF. site: ogranicza do strony, a intitle: szuka słowa w tytule.'}}
];

export function missionById(id){return missions.find(m=>m.id===id);}
export function isTarget(mission,docId){return mission.targetIds.includes(docId);}
export function missionTrap(mission,query){const n=String(query).toLowerCase().replace(/[ąćęłńóśźż]/g,c=>PL[c]);return (mission.traps||[]).find(t=>n.includes(t.pattern))||null;}

// Stan misji: {queries:[...], clicks:[docId], found:bool, checkMistakes, checked:bool, done}
export function missionComplete(ms,mission){return !!ms?.found&&(!mission.check||!!ms.checked);}
export function missionScore(ms,mission){return missionComplete(ms,mission)?missionPoints(ms.foundAfter??ms.queries.length,mission.par,ms.checkMistakes||0):0;}

export function levelResult(state={},levelMissions,{bossMode=false,label='Misje'}={}){
 const ms=state.missions||{};const doneList=levelMissions.filter(m=>missionComplete(ms[m.id],m));
 const scores=levelMissions.map(m=>missionScore(ms[m.id],m));
 const avg=doneList.length?doneList.reduce((s,m)=>s+(ms[m.id].foundAfter??ms[m.id].queries.length),0)/doneList.length:0;
 const avgText=String(Math.round(avg*10)/10).replace('.',',');
 let score,max;
 if(bossMode){max=3;const best=Math.max(0,...scores);score=Math.min(max,best+(doneList.length>1?1:0));}
 else{max=levelMissions.length*3;score=scores.reduce((a,b)=>a+b,0);}
 const need=bossMode?1:Math.min(2,levelMissions.length);
 return {done:doneList.length>=need,score,max,completed:doneList.length,summary:doneList.length?`${label}: ${doneList.length}/${levelMissions.length}, średnio ${avgText} zapytania na misję`:undefined};
}
export function missionsForLevels(levels){return missions.filter(m=>levels.map(String).includes(String(m.level)));}
export function completedCount(state,levels){const ms=state?.missions||{};return missionsForLevels(levels).filter(m=>missionComplete(ms[m.id],m)).length;}
