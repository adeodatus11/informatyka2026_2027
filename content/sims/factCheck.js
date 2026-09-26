// Logika symulatora „Śledztwo SIFT” (lekcja 07). Czysty JS.
// Wszystkie nazwy, profile i adresy są fikcyjne.

export const verdicts=[
 {id:'true',label:'Prawda',short:'Informacja się zgadza'},
 {id:'fake',label:'Fałsz lub manipulacja',short:'Ktoś przekręcił fakty'},
 {id:'scam',label:'Oszustwo',short:'Chcą Twoich pieniędzy lub danych'}
];
export const tools=[
 {id:'who',step:'I',label:'Kto to napisał?',help:'Sprawdź źródło: kto stoi za profilem lub numerem?'},
 {id:'lateral',step:'F',label:'Co piszą inni?',help:'Czytanie lateralne: otwórz nową kartę i sprawdź w innych, niezależnych miejscach.'},
 {id:'address',step:'I',label:'Sprawdź adres i datę',help:'Domena, data publikacji, wiek strony.'},
 {id:'origin',step:'T',label:'Znajdź oryginał',help:'Prześledź cytat, zdjęcie lub nagranie do pierwszego źródła.'}
];

export const cases=[
 {id:'scooter',kind:'post',title:'Viral o hulajnogach',
  frame:{app:'Społecznościówka',author:'Ciekawostki Bez Cenzury',handle:'@ciekawostki.bez.cenzury',time:'2 godz.',text:'PILNE!!! Od poniedziałku CAŁKOWITY ZAKAZ jazdy hulajnogą dla wszystkich poniżej 18 lat! Mandat 1000 zł! Udostępnij, zanim usuną!!!',stats:'18 tys. udostępnień · 4,2 tys. komentarzy'},
  clues:{
   who:'Profil założony 3 tygodnie temu. Publikuje wyłącznie „PILNE” posty, żaden nie jest podpisany ani nie podaje źródła.',
   lateral:'W serwisach informacyjnych i na stronach rządowych (.gov.pl) nie ma ani słowa o takim zakazie. Fikcyjny serwis fact-checkingowy „SprawdzamTo” opisał post jako manipulację.',
   address:'Post to zrzut ekranu bez linku. Brak daty oryginalnej informacji — „od poniedziałku”, czyli właściwie kiedy?',
   origin:'Oryginał: komunikat urzędu miasta Zielonkowo sprzed 2 lat — „zakaz PARKOWANIA hulajnóg na placu przy dworcu”. Nic o wieku ani o jeździe.'},
  answer:'fake',
  evidence:[
   {text:'Oryginalny komunikat mówi o zakazie parkowania w jednym mieście, nie o zakazie jazdy dla nastolatków.',ok:true},
   {text:'Post ma 18 tys. udostępnień, więc ktoś na pewno by go sprawdził.',why:'Liczba udostępnień nie jest dowodem. Fałsz rozchodzi się szybciej niż sprostowanie.'},
   {text:'Post jest napisany wielkimi literami i ma dużo wykrzykników.',why:'To sygnał ostrzegawczy, ale nie dowód. Dowodem jest dopiero oryginał, który mówi coś innego.'}],
  verdictHint:'Nikt tu nie chce Twoich pieniędzy ani danych. Sprawdź, czy informacja zgadza się z oryginałem.',
  explain:'Klasyczna manipulacja: prawdziwa informacja (lokalny zakaz parkowania) przekręcona w sensację o zakazie jazdy. Emocje („PILNE”, „zanim usuną”) mają sprawić, że udostępnisz bez sprawdzania.',
  action:'Nie udostępniaj. Jeśli znajomi już to wrzucili — podeślij im link do oryginału. Post możesz zgłosić jako fałszywą informację.'},
 {id:'parcel',kind:'sms',title:'SMS o dopłacie',
  frame:{app:'Wiadomości',author:'+48 732 118 904',time:'dziś, 14:12',text:'PaczkoPunkt: Twoja przesylka zostala wstrzymana. Brak doplaty 1,99 zl. Oplac w ciagu 24h, inaczej paczka wroci do nadawcy: https://paczkopunkt-dopłata.xyz/p/48213'},
  clues:{
   who:'Nadawca to zwykły numer telefonu, nie nazwa firmy. A Ty… nic ostatnio nie zamawiałeś.',
   lateral:'CERT Polska regularnie ostrzega przed SMS-ami o „dopłacie do przesyłki”. To jeden z najczęstszych przekrętów w Polsce — zmienia się tylko nazwa firmy.',
   address:'Adres kończy się na .xyz i został zarejestrowany wczoraj. Fikcyjna firma PaczkoPunkt ma stronę paczkopunkt.pl. Strona z linku prosi o numer karty, datę ważności i kod CVC.',
   origin:'Identyczna treść krąży z nazwami kilku różnych firm kurierskich — to szablon oszustów.'},
  answer:'scam',
  evidence:[
   {text:'Link prowadzi do obcej domeny .xyz, a strona chce pełnych danych karty.',ok:true},
   {text:'Kwota jest mała (1,99 zł), więc nie ma ryzyka.',why:'Właśnie o to chodzi! Mała kwota usypia czujność, a oszust dostaje dane karty i wyciąga dużo więcej.'},
   {text:'W SMS-ie brakuje polskich znaków.',why:'To tylko poszlaka — prawdziwe SMS-y też często nie mają polskich znaków. Kluczowy jest adres linku i to, czego chce strona.'}],
  verdictHint:'Zadaj sobie pytanie: czy ta wiadomość chce ode mnie pieniędzy albo danych?',
  explain:'Oszustwo „na dopłatę”. Mała kwota, presja czasu (24h) i link do podobnie brzmiącej domeny. Po wpisaniu danych karty oszuści robią przelewy lub zakupy.',
  action:'Nie klikaj. Przekaż SMS na numer 8080 (bezpłatnie) — CERT Polska zablokuje stronę. Potem usuń wiadomość. Jeśli już podałeś dane karty: od razu zadzwoń do banku i zastrzeż kartę.'},
 {id:'deepfake',kind:'ad',title:'Reklama z youtuberem',
  frame:{app:'Społecznościówka',author:'Finanse-Szybko-2931',handle:'Sponsorowane',time:'',text:'„Siema, tu Kuba Tech! Wpłaciłem 800 zł na platformę AI i po miesiącu wypłaciłem 12 000 zł. Gwarancja zysku, zostały ostatnie miejsca!”',media:'Nagranie wideo: Kuba Tech w swoim pokoju, mówi do kamery',stats:'Link: inwestuj-kuba-ai.top'},
  clues:{
   who:'Reklamę wykupił profil „Finanse-Szybko-2931”, a nie kanał Kuby Tech. Sam Kuba w najnowszym filmie ostrzega: „nie reklamuję żadnych inwestycji, to fejk”.',
   lateral:'NASK wykrył ok. 13 200 takich reklam z wizerunkiem 380 znanych osób. CSIRT KNF w 2025 r. zgłosił do blokady ponad 41 tys. fałszywych domen — 96% udawało „inwestycje”.',
   address:'Domena .top, założona tydzień temu. Formularz chce numeru telefonu — potem dzwoni „doradca” i namawia na przelew albo instalację aplikacji do „pomocy zdalnej”.',
   origin:'Obraz pochodzi ze starego filmu Kuby o grach. Ruch ust nie pasuje do głosu — to deepfake, czyli nagranie podrobione przez AI.'},
  answer:'scam',
  evidence:[
   {text:'Obiecują gwarantowany zysk 1400% w miesiąc, a reklamę publikuje obce konto, nie youtuber.',ok:true},
   {text:'Film wygląda profesjonalnie i to na pewno jego twarz.',why:'Deepfake potrafi wyglądać bardzo dobrze. Twarz na filmie nie jest dowodem, że ta osoba to powiedziała.'},
   {text:'Reklama ma dużo polubień.',why:'Polubienia da się kupić. To nie mówi nic o tym, czy obietnica jest prawdziwa.'}],
  verdictHint:'Ktoś prosi o wpłatę 800 zł z obietnicą ogromnego zysku. Co to oznacza?',
  explain:'Oszustwo „inwestycyjne” z deepfake’iem. Nikt uczciwy nie gwarantuje zysku, a zwłaszcza 1400% w miesiąc. Znana twarz ma wyłączyć Twoje myślenie.',
  action:'Nie wpłacaj i nie zostawiaj numeru telefonu. Zgłoś reklamę w serwisie („Zgłoś reklamę”), a stronę na incydent.cert.pl. Pokaż to rodzicom lub dziadkom — oni też są celem.'},
 {id:'shop',kind:'shop',title:'Sklep −70%',
  frame:{app:'Przeglądarka',url:'https://sneakeroutlet-sklep.shop/runner-pro',author:'SneakerOutlet',text:'Buty Runner Pro — 699 zł  →  199 zł (−70%)! Promocja tylko dziś, zostały 3 pary. Płatność: wyłącznie przelew lub BLIK z góry.',stats:'★★★★★ 4,9 (2 318 opinii)'},
  clues:{
   who:'Na stronie brak nazwy firmy, NIP-u, adresu i regulaminu. „Kontakt” to tylko formularz bez telefonu.',
   lateral:'Wpisujesz w wyszukiwarkę nazwę sklepu i słowo „opinie”: na forach wpisy „zapłaciłem, paczka nie doszła”, „oszustwo”. Opinie na samej stronie są wszystkie 5-gwiazdkowe i podobnie napisane.',
   address:'Domena zarejestrowana 5 dni temu, końcówka .shop. Jedyna forma płatności to przedpłata — brak płatności przy odbiorze i kartą z ochroną kupującego.',
   origin:'Wyszukiwanie obrazem pokazuje, że zdjęcia butów skopiowano z innego sklepu.'},
  answer:'scam',
  evidence:[
   {text:'Domena ma 5 dni, brak danych firmy, a płacić można tylko z góry.',ok:true},
   {text:'Cena jest niska, bo to wyprzedaż końcówki kolekcji.',why:'Tak twierdzi sklep — ale sprawdziłeś, kto za nim stoi? Brak danych firmy i 5-dniowa domena mówią co innego.'},
   {text:'Strona ma ładne zdjęcia i 2318 opinii.',why:'Zdjęcia są skradzione, a opinie na własnej stronie sklep może napisać sobie sam.'}],
  verdictHint:'Czy sklep chce Twoich pieniędzy, nie dając nic w zamian? Sprawdź, kto za nim stoi.',
  explain:'Fałszywy sklep. Znaki rozpoznawcze: cena „za dobra”, presja („tylko dziś”, „3 pary”), świeża domena, brak danych firmy, tylko przedpłata.',
  action:'Nie płać. Kupuj tam, gdzie są dane firmy i opinie spoza jej strony. Zgłoś stronę na incydent.cert.pl. Jeśli już zapłaciłeś: bank (przy karcie można próbować odzyskać pieniądze) i policja.'},
 {id:'job',kind:'post',title:'Praca za lajki',
  frame:{app:'Komunikator',author:'Ania — Rekrutacja',handle:'nowy kontakt',time:'wczoraj',text:'Hej! Praca zdalna dla uczniów: 300 zł/h, tylko lajkowanie filmików. Bez doświadczenia! Żeby dostać pierwsze zadania, opłać wpisowe 49 zł. Potem podeślę link do „panelu wypłat” — zalogujesz się tam swoim bankiem.',stats:'Wysłano do 14 osób z Twojej grupy'},
  clues:{
   who:'Konto założone wczoraj, bez nazwy firmy. „Ania” nie podaje ani nazwy pracodawcy, ani umowy.',
   lateral:'Legalny pracodawca nigdy nie pobiera opłat za przyjęcie do pracy. Ostrzeżenia CERT Polska opisują „zadania z lajkami” jako oszustwo — najpierw małe wypłaty, potem coraz większe „wpłaty”.',
   address:'„Panel wypłat” to strona udająca logowanie do banku. Oszuści chcą Twojego loginu, a Twoje konto może posłużyć do przepuszczania cudzych pieniędzy.',
   origin:'Ta sama treść pojawia się w wielu grupach, za każdym razem z innym imieniem „rekruterki”.'},
  answer:'scam',
  evidence:[
   {text:'Musisz najpierw zapłacić 49 zł, a potem zalogować się do banku przez ich link.',ok:true},
   {text:'Ogłoszenie jest napisane bez błędów, więc to firma.',why:'Oszuści też umieją pisać poprawnie — często z pomocą AI. Liczy się to, czego od Ciebie chcą.'},
   {text:'Każda praca zdalna to oszustwo.',why:'Nieprawda — jest dużo uczciwej pracy zdalnej. Alarmem jest opłata wstępna i prośba o dane do banku.'}],
  verdictHint:'Przeczytaj jeszcze raz: kto komu ma zapłacić na starcie?',
  explain:'Fałszywa oferta pracy. Nierealna stawka za nic, opłata wstępna i prośba o logowanie do banku. Czasem stawką są też Twoje konto i dane — możesz zostać „słupem”, a to przestępstwo.',
  action:'Nie płać, nie podawaj loginu do banku ani zdjęcia dowodu. Zablokuj i zgłoś profil, ostrzeż grupę i powiedz dorosłemu.'},
 {id:'rail',kind:'post',title:'Zniżka, która brzmi za dobrze',
  frame:{app:'Społecznościówka',author:'Samorząd Uczniowski ZS Przykład',handle:'@su.zs.przyklad',time:'3 dni',text:'SERIO?! Uczniowie do 24. roku życia płacą za jednorazowy bilet na pociąg o 37% mniej. Wystarczy legitymacja albo mLegitymacja. Mało kto o tym wie!',stats:'Link: przejazdy-info.gov.pl/ulgi'},
  clues:{
   who:'Profil samorządu uczniowskiego szkoły, działa od 6 lat, podpisany przez opiekuna. W poście jest link do źródła.',
   lateral:'To samo mówią oficjalne cenniki przewoźników i strona rządowa o ulgach: uczniowie szkół ponadpodstawowych do 24 lat — 37% na bilety jednorazowe, 49% na miesięczne imienne.',
   address:'Link prowadzi do domeny .gov.pl — to końcówka zarezerwowana dla instytucji publicznych. Data: aktualna.',
   origin:'Informacja pochodzi z ustawy o ulgach w przejazdach — jej tekst jest publiczny.'},
  answer:'true',
  evidence:[
   {text:'Niezależne, oficjalne źródła (.gov.pl, cenniki przewoźników) potwierdzają dokładnie to samo.',ok:true},
   {text:'Brzmi zbyt dobrze, więc to musi być fałsz.',why:'„Zbyt dobre” to powód, żeby sprawdzić — nie dowód fałszu. Tutaj sprawdzenie potwierdza informację.'},
   {text:'Post ma dużo komentarzy.',why:'Liczba komentarzy nic nie dowodzi. Liczy się to, co mówią niezależne źródła.'}],
  verdictHint:'Wykrzyknik „SERIO?!” to jeszcze nie dowód fałszu. Co mówią niezależne źródła?',
  explain:'Prawda! Zaskakujące informacje też bywają prawdziwe. Sceptycyzm nie polega na „nie wierzę w nic”, tylko na „sprawdzam, zanim uwierzę albo odrzucę”.',
  action:'Możesz udostępnić — najlepiej z linkiem do oficjalnego źródła. I kupuj bilety z ulgą: przy trasie za 42 zł oszczędzasz 15,54 zł na jednym przejeździe.'}
];

export const scamTotal=cases.filter(c=>c.answer==='scam').length;

function part(p){return p?.ok?(p.tries===1?1:0.5):0;}
export function caseScore(st){return part(st?.verdict)+part(st?.evidence);}
export function caseSolved(st){return !!(st?.verdict?.ok&&st?.evidence?.ok);}

// Zwraca nowy stan przypadku po wyborze werdyktu.
export function chooseVerdict(caseData,st={},choice){
 if(st.verdict?.ok)return st;
 const tries=(st.verdict?.tries||0)+1,ok=choice===caseData.answer;
 return {...st,verdict:{choice,tries,ok}};
}
export function chooseEvidence(caseData,st={},index){
 if(!st.verdict?.ok||st.evidence?.ok)return st;
 const tries=(st.evidence?.tries||0)+1,ok=!!caseData.evidence[index]?.ok;
 return {...st,evidence:{choice:index,tries,ok}};
}
export function addTool(st={},tool){const used=st.tools||[];return used.includes(tool)?st:{...st,tools:[...used,tool]};}

export function verdictFeedback(caseData,choice){
 if(choice===caseData.answer)return 'Dobrze! Teraz wskaż najmocniejszy dowód.';
 const hints={
  'scam>fake':'To nie jest zwykły fałsz — ktoś chce od Ciebie pieniędzy lub danych. Takie przypadki oznaczamy jako oszustwo.',
  'fake>scam':'Czy ktoś tu prosi o pieniądze lub dane? Nie. To przekręcona informacja, a nie próba wyłudzenia.',
  'true>fake':'Sprawdziłeś, co piszą inni? Niezależne źródła potwierdzają tę informację.',
  'true>scam':'Nikt nie prosi tu o pieniądze ani dane. Sprawdź, co mówią oficjalne źródła.',
  'fake>true':'Porównaj post z oryginałem — mówią o tym samym?',
  'scam>true':'Uważaj: wiadomość chce Twoich pieniędzy lub danych. Użyj narzędzia „Sprawdź adres i datę”.'
 };
 return `${hints[`${caseData.answer}>${choice}`]||''} ${caseData.verdictHint}`.trim();
}

export function factCheckResult(state={}){
 const cs=state.cases||{};
 const score=cases.reduce((s,c)=>s+caseScore(cs[c.id]),0);
 const solved=cases.filter(c=>caseSolved(cs[c.id])).length;
 const scams=cases.filter(c=>c.answer==='scam'&&cs[c.id]?.verdict?.ok&&cs[c.id].verdict.tries===1).length;
 return {done:solved>=4,score,max:cases.length*2,solved,summary:solved?`Rozpoznane oszustwa: ${scams}/${scamTotal} · rozwiązane przypadki: ${solved}/${cases.length}`:undefined};
}
