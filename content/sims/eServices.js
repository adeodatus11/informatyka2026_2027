// Logika symulatora „e-Sprawy (symulacja)” (lekcja 09). Czysty JS.
// Wszystkie dane osobowe są fikcyjne; PESEL jest przykładowy (poprawna suma kontrolna, nieprzypisany do osoby).

export const profile={name:'Kuba Przykładowy',pesel:'10231405673',born:'14.03.2010',age:16};

// ---------- Logowanie i phishing ----------
export const loginMethods=[
 {id:'password',label:'Login i hasło',text:'Wpisujesz login i hasło, a potem kod z SMS-a. Dwa kroki = dwa zamki.'},
 {id:'bank',label:'Bankowość elektroniczna',text:'Logujesz się przez swój bank (symulacja: „Bank Przykładowy”). Bank też poprosi o potwierdzenie.'},
 {id:'app',label:'Aplikacja w telefonie',text:'Potwierdzasz logowanie w aplikacji. W symulacji dostaniesz kod w powiadomieniu.'}
];
export function makeCode(rand=Math.random){let c='';for(let i=0;i<6;i++)c+=Math.floor(rand()*10);return c[0]==='0'?'7'+c.slice(1):c;}
export function checkCode(expected,typed){return String(typed||'').replace(/\s|-/g,'')===expected;}

export const phishing=[
 {id:'real',kind:'browser',url:'https://e-sprawy.gov.pl/logowanie',lock:true,title:'Logowanie do e-Sprawy',body:'Zaloguj się, aby zobaczyć swoje sprawy.',safe:true,
  explain:'Bezpieczna: https, kłódka, a domena kończy się dokładnie na „.gov.pl” (ostatnia część przed pierwszym „/”).',
  actions:['Loguję się — adres i kłódka się zgadzają','Przekazuję stronę na 8080','Zamykam i nigdy tu nie wracam'],action:0,
  actionWhy:['Dobrze. Przy okazji: najbezpieczniej wpisywać adres ręcznie lub mieć go w zakładkach.','8080 służy do przekazywania podejrzanych SMS-ów, a ta strona jest prawdziwa.','Nie ma potrzeby — to prawdziwa strona.']},
 {id:'suffix',kind:'browser',url:'https://e-sprawy.gov.pl.login-check.xyz/logowanie',lock:true,title:'Logowanie do e-Sprawy',body:'Twoja sesja wygasła. Zaloguj się ponownie i podaj kod SMS.',safe:false,
  explain:'Phishing! Czytaj adres od końca, do pierwszego „/”: domena to „login-check.xyz”. „e-sprawy.gov.pl” to tylko przynęta na początku. Kłódka oznacza szyfrowanie, a nie uczciwość strony.',
  actions:['Loguję się, bo jest kłódka','Zamykam kartę, zgłaszam adres na incydent.cert.pl, wpisuję e-sprawy.gov.pl ręcznie','Wpisuję tylko login, bez hasła — dla testu'],action:1,
  actionWhy:['Kłódka ma też strona oszusta. Liczy się domena.','','Nawet sam login pomaga oszustom. Nie wpisuj niczego.']},
 {id:'dash',kind:'browser',url:'http://e-sprawy-gov.pl/logowanie',lock:false,title:'e-Sprawy — logowanie',body:'Zaloguj się, aby odebrać pismo.',safe:false,
  explain:'Phishing! Myślnik zamiast kropki: „e-sprawy-gov.pl” to zwykła domena .pl, którą każdy może kupić. Do tego http bez kłódki — dane lecą bez szyfrowania.',
  actions:['Zamykam kartę i zgłaszam adres na incydent.cert.pl','Loguję się szybko, zanim ktoś zauważy','Przekazuję stronę na 8080'],action:0,
  actionWhy:['','Nie! Ta strona zbiera loginy i hasła.','8080 przyjmuje SMS-y. Strony zgłaszasz na incydent.cert.pl.']},
 {id:'sms',kind:'sms',from:'mDokumenty',url:'https://e-5prawy.pl/odnow',text:'Twoj mDokument wygasa DZIS. Odnow go teraz, inaczej zostanie zablokowany: https://e-5prawy.pl/odnow',safe:false,
  explain:'Phishing! Zamiast „s” jest cyfra „5”, domena to zwykłe „.pl”, a presja czasu („DZIŚ”, „zablokowany”) ma Cię przestraszyć. Ważność dokumentów sprawdzasz w aplikacji, nie przez link z SMS-a.',
  actions:['Klikam, bo nie chcę blokady','Nie klikam, przekazuję SMS na 8080 i usuwam','Odpisuję „STOP”'],action:1,
  actionWhy:['Właśnie na to liczą oszuści.','','Odpowiedź potwierdza, że numer jest aktywny — dostaniesz więcej spamu.']}
];

function pts(p){return p?.ok?(p.tries===1?1:0.5):0;}
export function classify(item,st={},safe){if(st.cls?.ok)return st;const tries=(st.cls?.tries||0)+1;return {...st,cls:{choice:safe,tries,ok:safe===item.safe}};}
export function chooseAction(item,st={},i){if(!st.cls?.ok||st.act?.ok)return st;return {...st,act:{choice:i,ok:i===item.action}};}
export function loginResult(state={}){
 const ph=state.phishing||{};const logged=!!state.loggedIn;
 const recognized=phishing.filter(p=>ph[p.id]?.cls?.ok&&ph[p.id]?.act?.ok);
 const score=(logged?1:0)+phishing.reduce((s,p)=>s+(ph[p.id]?.act?.ok?pts(ph[p.id].cls):0),0);
 const traps=phishing.filter(p=>!p.safe&&ph[p.id]?.cls?.ok&&ph[p.id].cls.tries===1).length;
 const any=logged||recognized.length;
 return {done:logged&&recognized.length===phishing.length,score,max:1+phishing.length,summary:any?`Logowanie z kodem SMS: ${logged?'tak':'jeszcze nie'} · pułapki rozpoznane od razu: ${traps}/${phishing.filter(p=>!p.safe).length}`:undefined};
}

// ---------- Moduły ekspertów ----------
// Każdy krok: {id,title,task,kind:'code'|'choice'|'number'|'toggle', ...}. 1 pkt za pierwszą poprawną próbę, 0,5 po poprawce.
export const modules=[
 {id:'health',letter:'A',title:'Zdrowie',icon:'shield',lead:'E-recepta i e-skierowanie: bez papierów, bez zgubionych kartek.',
  inbox:[
   {id:'rx',from:'lek. Anna Fikcyjna',subject:'E-recepta wystawiona',date:'dziś, 10:14',body:'Wystawiono e-receptę. Lek: Nosowin 10 mg (lek fikcyjny), 1 opakowanie.',fields:[['Klucz recepty (22 cyfry)','0842 1734 5561 0098 1234 56'],['Kod dostępowy','4827'],['Ważna do','30 dni od wystawienia']]},
   {id:'ref',from:'lek. Anna Fikcyjna',subject:'E-skierowanie do poradni ortopedycznej',date:'dziś, 10:16',body:'Skierowanie do poradni ortopedycznej (ból kolana po treningu).',fields:[['Klucz skierowania','0841 2203 7719 4410 2201 77'],['Kod dostępowy','7315']]},
   {id:'lab',from:'Laboratorium Przykład',subject:'Wynik badania krwi',date:'wczoraj',body:'Wynik morfologii jest dostępny. Wszystkie parametry w normie.',fields:[['Nr zlecenia','2026/0913']]}
  ],
  steps:[
   {id:'code',kind:'code',title:'Znajdź kod recepty',task:'W skrzynce Konta Zdrowia (symulacja) otwórz e-receptę i wpisz 4-cyfrowy kod, który podasz w aptece.',answer:'4827',hint:'Szukasz 4 cyfr opisanych jako „Kod dostępowy” w wiadomości o e-recepcie — nie 22-cyfrowego klucza.'},
   {id:'pharmacy',kind:'pharmacy',title:'Apteka (symulacja)',task:'Farmaceutka prosi o PESEL i kod. Wpisz dane z profilu i kod recepty.',hint:'PESEL jest w profilu na górze (11 cyfr). Kod recepty znalazłeś w poprzednim kroku.'},
   {id:'who',kind:'choice',title:'Komu wolno podać kod?',task:'Kolega pisze na grupie klasowej: „Wrzuć kod, wykupię Ci lek po drodze”. Komu możesz podać kod recepty?',options:['Wrzucę na grupę klasową — tak będzie szybciej','Farmaceucie w aptece albo zaufanej osobie, która realizuje receptę za mnie (np. rodzicowi) — prywatnie','Każdemu, kto napisze, że dzwoni z przychodni'],correct:1,
    why:['Na grupie kod zobaczy 30 osób — z PESEL-em ktoś może wykupić Twój lek albo poznać Twoje dane zdrowotne.','','Przychodnia nie prosi o kod recepty przez telefon. To klasyczna próba wyłudzenia.']},
   {id:'referral',kind:'referral',title:'Zapis z e-skierowaniem',task:'Zapisz się do ortopedy w Rejestracji (symulacja). Podaj kod e-skierowania ze skrzynki i wybierz termin.',answer:'7315',hint:'Kod skierowania to 4 cyfry w wiadomości o e-skierowaniu (nie ten sam co kod recepty).'}
  ],
  expert:['E-receptę realizujesz w aptece: podajesz PESEL i 4-cyfrowy kod (z SMS-a, e-maila albo Internetowego Konta Pacjenta).','Kod to klucz do Twoich leków — dajesz go farmaceucie albo zaufanej osobie, nigdy na grupie.','Od 16 lat sam logujesz się do IKP. E-skierowania nie zgubisz: w rejestracji wystarczą kod i PESEL.']},
 {id:'travel',letter:'B',title:'Dojazdy',icon:'location',lead:'Bilet ze zniżką na praktyki i do szkoły. Pomyłka = opłata dodatkowa.',
  trip:{from:'Zielonkowo',to:'Borowo',price:42},
  steps:[
   {id:'discount',kind:'choice',title:'Wybierz ulgę',task:'Kupujesz jednorazowy bilet KolejSim (symulacja): Zielonkowo → Borowo, normalny 42,00 zł. Masz 16 lat i chodzisz do technikum. Którą ulgę wybierasz?',options:['0% — bilet normalny','37% — uczeń szkoły ponadpodstawowej','49% — uczeń, bilet miesięczny imienny','51% — student'],correct:1,
    why:['Przepłacasz! Jako uczeń do 24 lat masz ulgę.','','49% dotyczy tylko biletów miesięcznych imiennych, a Ty kupujesz jednorazowy.','51% to ulga studencka. W pociągu konduktor poprosi o legitymację studencką — a jej nie masz: zapłacisz różnicę i opłatę dodatkową.']},
   {id:'doc',kind:'choice',title:'Dokument do ulgi',task:'Czym udowodnisz prawo do ulgi podczas kontroli?',options:['Legitymacją szkolną albo mLegitymacją w aplikacji mObywatel','Zdjęciem legitymacji w galerii telefonu','Dowodem osobistym — jest tam data urodzenia'],correct:0,
    why:['','Zdjęcie w galerii to nie dokument — każdy może je podrobić. mLegitymacja w aplikacji ma zabezpieczenia i kod QR.','Dowód osobisty nie potwierdza, że się uczysz. Ulga jest dla ucznia, nie dla wieku.']},
   {id:'price',kind:'number',title:'Policz cenę',task:'Ile zapłacisz za bilet z ulgą 37%? (normalny: 42,00 zł)',answer:26.46,hint:'Płacisz 100% − 37% = 63% ceny: 42,00 × 0,63.',unit:'zł'},
   {id:'monthly',kind:'choice',title:'Kontrola biletów',task:'Konduktor sprawdził mLegitymację — wszystko się zgadza. Pyta: „A na dojazdy do szkoły codziennie? Weź miesięczny imienny”. Jaka ulga przysługuje Ci na taki bilet?',options:['37%','49%','51%','100%'],correct:1,
    why:['37% to ulga na bilety jednorazowe.','','51% jest dla studentów.','Nie ma takiej ulgi dla uczniów szkół ponadpodstawowych.']}
  ],
  expert:['Uczeń szkoły ponadpodstawowej do 24 lat: 37% na bilety jednorazowe, 49% na miesięczne imienne. 51% jest dla studentów — nie dla nas.','Dokument: legitymacja szkolna albo mLegitymacja w mObywatelu (zdjęcie w galerii się nie liczy).','Cena z ulgą = cena normalna × (1 − ulga): 42 zł × 0,63 = 26,46 zł.']},
 {id:'money',letter:'C',title:'Pieniądze i praca',icon:'energy',lead:'Wakacyjna praca, podatek i zwrot na Twoje konto.',
  pit:{income:2400,costs:480,tax:230},
  steps:[
   {id:'relief',kind:'toggle',title:'Twoje zeznanie (symulacja)',task:'W wakacje pracowałeś na umowie zlecenie: 2400 zł brutto. Nie złożyłeś pracodawcy oświadczenia o uldze, więc pobrał 230 zł zaliczki na podatek. Masz 16 lat. Uzupełnij gotowe zeznanie i kliknij „Przelicz”.',hint:'Masz mniej niż 26 lat — przysługuje Ci ulga dla młodych (PIT-0).'},
   {id:'refund',kind:'number',title:'Ile wróci?',task:'Po zaznaczeniu ulgi Twój podatek wynosi 0 zł. Ile pieniędzy odzyskasz?',answer:230,hint:'Państwo odda całą pobraną zaliczkę — sprawdź kwotę w polu „Zaliczki pobrane przez płatnika”.',unit:'zł'},
   {id:'account',kind:'choice',title:'Jak odbierzesz zwrot?',task:'Zeznanie gotowe. Jak bezpiecznie odebrać zwrot?',options:['Wpisuję numer swojego konta w zeznaniu i je akceptuję','Czekam na SMS „Urząd: potwierdź zwrot, zaloguj się do banku” i klikam link','Podaję numer konta w komentarzu pod postem „Zwroty podatku 2026 — pomagamy”'],correct:0,
    why:['','Urząd nie wysyła linków do logowania w banku. To phishing „na zwrot podatku”.','Obcy „pomocnicy” w komentarzach to często oszuści. Numer konta podajesz tylko w zeznaniu.']},
   {id:'pesel',kind:'choice',title:'Zastrzeż PESEL',task:'Na koniec: w aplikacji możesz bezpłatnie zastrzec PESEL. Po co?',options:['Żeby nikt nie wziął kredytu ani nie założył konta na moje dane — bank musi to sprawdzić','Żeby nie płacić podatku','Żeby nikt nie mógł wysłać mi SMS-a'],correct:0,
    why:['','Zastrzeżenie PESEL nie ma nic wspólnego z podatkami.','SMS-y dalej będą przychodzić. Zastrzeżenie chroni przed kredytem lub umową na Twoje dane.']}
  ],
  expert:['Do 26 lat masz ulgę dla młodych (PIT-0): przychody z pracy do 85 528 zł rocznie bez podatku. Złóż pracodawcy oświadczenie, to nie pobierze zaliczki.','Jeśli pobrał — odzyskasz ją w zeznaniu (Twój e-PIT, od 15 lutego): zaznacz ulgę, podaj swój numer konta. Zwrot do 45 dni.','Zastrzeż PESEL w mObywatelu (bezpłatnie, możesz czasowo cofnąć) — oszust nie weźmie kredytu na Ciebie.']}
];

export function moduleById(id){return modules.find(m=>m.id===id);}
export function checkNumber(expected,typed){const n=Number(String(typed||'').replace(/\s|zł/g,'').replace(',','.'));return Number.isFinite(n)&&Math.abs(n-expected)<0.005;}
export function checkStep(step,input,extra={}){
 switch(step.kind){
  case 'code':return String(input||'').trim()===step.answer;
  case 'choice':return input===step.correct;
  case 'number':return checkNumber(step.answer,input);
  case 'pharmacy':return String(input?.pesel||'').replace(/\s/g,'')===profile.pesel&&String(input?.code||'').trim()===(extra.rxCode||'4827');
  case 'referral':return String(input?.code||'').trim()===step.answer&&!!input?.slot;
  case 'toggle':return input===true;
  default:return false;
 }
}
// Stan kroku: {tries, ok}. Zwraca nowy stan kroku po próbie.
export function attempt(st={},ok){if(st.ok)return st;return {tries:(st.tries||0)+1,ok};}
export function moduleScore(ms={},mod){return mod.steps.reduce((s,st)=>s+pts(ms[st.id]),0);}
export function moduleDone(ms={},mod){return mod.steps.every(st=>ms[st.id]?.ok);}
export function expertResult(state={}){
 const mods=state.modules||{};
 const finished=modules.filter(m=>moduleDone(mods[m.id],m));
 const best=Math.max(0,...modules.map(m=>moduleDone(mods[m.id],m)?moduleScore(mods[m.id],m):0));
 const bestMod=modules.find(m=>moduleDone(mods[m.id],m)&&moduleScore(mods[m.id],m)===best);
 return {done:finished.length>=1,score:best,max:4,summary:finished.length?`Ekspert: ${bestMod.title} (${String(best).replace('.',',')}/4)${finished.length>1?` · ukończone moduły: ${finished.map(m=>m.title).join(', ')}`:''}`:undefined};
}
