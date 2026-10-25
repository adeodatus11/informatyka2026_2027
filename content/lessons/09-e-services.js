import {note, choice, reveal} from '../schema.js';

export default {
 id:'09',grade:1,order:7,title:'Korzystanie z wybranych e-usług',
 subtitle:'Załatwisz receptę, bilet ze zniżką i zwrot podatku z wakacyjnej pracy bez kolejki — i nie dasz się okraść po drodze.',
 topic:'Korzystanie z wybranych e-usług',icon:'idcard',tags:['e-recepta','ulga 37%','PIT-0'],duration:44,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): korzystanie z usług i zasobów sieciowych, bezpieczeństwo danych',
 format:{
  name:'Układanka (jigsaw) w parach + tutoring rówieśniczy',
  student:'W parze każdy zostaje ekspertem innej sprawy: zdrowie, dojazdy albo pieniądze z pracy. Potem pokazujesz swoją sprawę partnerowi, a on Tobie; trzecią przechodzicie razem. Na koniec test — każdy odpowiada sam, więc słuchaj uważnie. Bez pary? Przechodzisz wszystkie trzy sprawy sam. Efekt: wiesz, jak załatwić receptę, bilet ze zniżką i zwrot podatku bez kolejki.',
  teacher:'Najpierw wszyscy uczą się bezpiecznego logowania i rozpoznawania fałszywych stron. Potem układanka w parach: każda osoba wybiera inny moduł (A, B albo C) i samodzielnie przechodzi go w symulatorze, kończąc „Kartą eksperta”. W etapie uczenia każdy w 3 minuty pokazuje partnerowi swoją sprawę według ramy z checklisty, a partner zadaje pytania z kart; trzeci moduł para przechodzi razem (jedna osoba czyta, druga klika). Nie przydzielasz ról — pary same wybierają moduły. Test sprawdza wiedzę ze wszystkich modułów indywidualnie — to buduje odpowiedzialność za uczenie innych. Twoja rola: pilnować czasu, podchodzić do ekspertów tego samego modułu i sprawdzać, czy ich 3 zdania są poprawne.',
  grouping:'Pary: każda osoba bierze inny moduł (A — Zdrowie, B — Dojazdy albo C — Pieniądze i praca), trzeci przechodzicie razem w etapie uczenia. Moduły wybiera para, nauczyciel ich nie przydziela. Uczeń bez pary przechodzi wszystkie trzy moduły w skrócie (ok. 4–5 min każdy) i czyta karty eksperta zamiast etapu uczenia.',
  methods:[
   {name:'Uczenie kooperacyjne',url:'https://metodyka.covepolska.pl/metoda-uczenie-kooperacyjne.html'},
   {name:'Tutoring rówieśniczy',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:[
  'Loguję się do e-usług z weryfikacją dwuetapową i rozpoznaję fałszywe strony logowania po adresie.',
  'Wiem, jak zrealizować e-receptę i e-skierowanie oraz komu wolno podać kod.',
  'Wybieram właściwą ulgę na bilet (37% lub 49%) i liczę cenę biletu ze zniżką.',
  'Wyjaśniam, jak odzyskać zaliczkę podatku dzięki uldze dla młodych i po co zastrzec PESEL.'
 ],
 materials:['Komputer lub telefon z przeglądarką — każdy uczeń swój','Symulator nie wymaga logowania ani prawdziwych danych; PESEL w zadaniach jest fikcyjny (przykład)'],
 teacherGuide:{
  preparation:'Przed etapem 3 połącz uczniów w pary z sąsiadem z ławki; para sama wybiera, kto bierze który moduł. Osoba bez pary robi wszystkie trzy moduły. Ekrany login.gov.pl, IKP, apteki, PKP Intercity i e-Urzędu Skarbowego (Twój e-PIT) to symulacje z fikcyjnymi danymi — odwzorowują przebieg prawdziwych usług, ale nie łączą się z nimi. W tekstach wymieniamy realne usługi (mObywatel, IKP, Twój e-PIT, 8080, incydent.cert.pl) jako fakty do zapamiętania.',
  summary:'Uczeń loguje się z kodem SMS, odróżnia domenę kończącą się na .gov.pl od podróbek (np. login.gov.pl.login-check.xyz, login-gov.pl, m0bywatel.pl). Realizuje e-receptę PESEL + 4-cyfrowy kod, wybiera ulgę 37% na bilet jednorazowy (49% — miesięczny imienny, 51% — tylko studenci), liczy 42 zł × 0,63 = 26,46 zł, odzyskuje zaliczkę 230 zł dzięki uldze dla młodych i wie, po co zastrzec PESEL. Pytanie dodatkowe: dlaczego kłódka w przeglądarce nie gwarantuje, że strona jest prawdziwa?'
 },
 sections:[
  {id:'start',label:'Start',title:'Okienko czy aplikacja?',grouping:'class',
   intro:'Pani w okienku jest miła, ale kolejka ma 40 osób. Sprawdź, ile czasu oszczędza e-usługa — i szybka powtórka z wyszukiwania.',
   ...note(4,'Zapytaj, kto załatwiał już coś online sam (np. mLegitymacja, e-recepta, bilet). Pierwsze pytanie to hak, drugie — powtórka z poprzedniej lekcji. Zapowiedz, że dziś każdy zostanie ekspertem jednej sprawy i pokaże ją partnerowi.','Jaką sprawę Ty albo Twoja rodzina ostatnio załatwialiście w urzędzie lub przychodni osobiście?','Np. recepta, legitymacja, zaświadczenie, bilet miesięczny. Wiele z nich da się dziś załatwić online.','Uczniowie myślą, że e-usługi są „dla dorosłych”. Tymczasem mLegitymację, bilet z ulgą czy e-receptę obsługują sami, a od 16 lat logują się do swojego konta pacjenta.','Zapytaj, kto ma już mLegitymację w telefonie i czy konduktor ją kiedyś sprawdzał.'),
   activities:[
    choice('l09-time','Chcesz zastrzec swój PESEL, żeby nikt nie wziął kredytu na Twoje dane. Ile to zajmie?',['Pół dnia: urząd gminy, kolejka, wniosek','Około minuty w aplikacji mObywatel — bezpłatnie','Tydzień, bo trzeba wysłać list'],[1],'W aplikacji to kilka kliknięć i jest bezpłatne. W urzędzie gminy też się da, ale z dojazdem i kolejką to zwykle godziny. Zastrzeżenie można czasowo cofnąć, np. przy braniu kredytu.','Pomyśl o aplikacji, którą masz w telefonie do dokumentów.'),
    choice('l09-pdf','Powtórka: który operator pokaże tylko pliki PDF?',['site:pdf','filetype:pdf','"pdf"'],[1],'filetype:pdf zostawia tylko pliki PDF — idealne do regulaminów, cenników i formularzy urzędowych.','site: ogranicza stronę, a nie typ pliku.')
   ]},
  {id:'login',label:'Logowanie',title:'Wejście bez wpadki',grouping:'solo',
   intro:'Zaloguj się przez login.gov.pl (symulacja) z kodem SMS. Potem cztery sytuacje: prawdziwa strona czy pułapka? Jeden błąd tutaj to przejęte konto.',
   reading:{title:'Dwa zamki i czytanie adresu',paragraphs:['Do e-usług państwa logujesz się przez login.gov.pl: profilem zaufanym (login i hasło), przez bank albo aplikacją mObywatel. Po haśle przychodzi kod SMS — to drugi zamek, czyli weryfikacja dwuetapowa.','Oszuści podrabiają strony logowania. Czytaj adres od końca: tuż przed pierwszym „/” musi stać dokładnie .gov.pl. Podejrzany SMS przekaż na 8080 (bezpłatnie), podejrzaną stronę zgłoś na incydent.cert.pl.'],example:{question:'Kłódka przy adresie = bezpieczna strona?',answer:'Nie. Kłódka oznacza tylko, że połączenie jest szyfrowane. Oszust też może mieć kłódkę — liczy się domena.'}},
   ...note(7,'Uczniowie pracują sami. Po 4 minutach zatrzymaj klasę na sytuacji 2 (adres z .gov.pl na początku i .xyz na końcu) i zapytaj, kto dał się złapać. Pokaż na tablicy, jak czytać adres od końca do pierwszego „/”.','Który fragment adresu decyduje o tym, do kogo należy strona?','Domena tuż przed pierwszym „/”, czytana od końca: np. …login-check.xyz należy do właściciela login-check.xyz, a nie do login.gov.pl.','Uczniowie ufają kłódce i temu, że adres „zaczyna się od” znanej nazwy. Nie zauważają cyfry 5 zamiast litery s ani myślnika zamiast kropki.','Poproś uczniów o sprawdzenie w swoim telefonie, czy mają włączone powiadomienia z aplikacji banku albo mObywatela i jak wygląda prawdziwy SMS z kodem.'),
   activities:[
    {type:'eServices',id:'es-login',mode:'login',points:5,label:'Logowanie z kodem SMS i 4 pułapki'},
    {type:'reportGuide',id:'report-guide',title:'Wpadło Ci oszustwo? Zgłoś je w minutę'}
   ]},
  {id:'expert',label:'Ekspert',title:'Zostań ekspertem jednej sprawy',grouping:'pair',
   intro:'W parze każdy wybiera inny moduł: A — Zdrowie, B — Dojazdy albo C — Pieniądze i praca. Przejdź 4 kroki i zapamiętaj 3 zdania z Karty eksperta — za chwilę pokażesz swoją sprawę partnerowi. Pracujesz sam? Przejdź wszystkie trzy moduły, każdy w skrócie.',
   reading:{title:'Trzy sprawy, które załatwisz sam',paragraphs:['A — Zdrowie: e-receptę i e-skierowanie realizujesz na PESEL i 4-cyfrowy kod. B — Dojazdy: uczniowie do 24 lat mają 37% ulgi na bilety jednorazowe i 49% na miesięczne imienne; dokument to legitymacja lub mLegitymacja.','C — Pieniądze: do 26 lat przychody z pracy do 85 528 zł rocznie są zwolnione z PIT (ulga dla młodych). Jeśli pracodawca pobrał zaliczkę, odzyskasz ją w zeznaniu Twój e-PIT — gotowym od 15 lutego, ze zwrotem do 45 dni.']},
   ...note(12,'Sprawdź, czy w każdej parze moduły się nie powtarzają. Po 8 minutach poproś 2–3 osoby z tym samym modułem o przeczytanie na głos swoich 3 zdań z Karty eksperta — czy się zgadzają (szybkie sprawdzenie z całą klasą). Uczniowie solo robią wszystkie moduły szybciej, bez czytania całych treści.','Jakie jedno zdanie z Twojej karty eksperta jest najważniejsze dla kogoś w Twoim wieku?','A: kodu recepty nie wrzucasz na grupę. B: 37% na jednorazowy, 51% to nie dla uczniów. C: zaznacz ulgę dla młodych i odzyskasz zaliczkę.','Moduł B: wybór ulgi 51% (studencka). Moduł A: wpisanie 22-cyfrowego klucza zamiast 4-cyfrowego kodu. Moduł C: przekonanie, że zaliczka podatku przepada.','Szybsi uczniowie przechodzą już teraz trzeci moduł (ten, którego nie wybrała para) — liczy się najlepszy, ale zdobyta wiedza przyda się w teście.'),
   activities:[
    {type:'eServices',id:'es-expert',mode:'expert',points:4,label:'Moduł eksperta (A, B lub C)'}
   ]},
  {id:'teach',label:'Uczę',title:'Pokaż partnerowi swoją sprawę',grouping:'pair',
   intro:'W poprzednim etapie każdy z Was załatwił INNĄ sprawę. Teraz po kolei pokazujecie je sobie nawzajem, a sprawę, której nikt nie robił, przechodzicie razem. Za chwilę test ze wszystkich trzech spraw — i każdy pisze go sam.',
   reading:{title:'Jak to zrobić: 3 tury po 3 minuty',paragraphs:[
    'Tura 1 — mówi pierwsza osoba (jej sprawa). Tura 2 — mówi druga osoba. Tura 3 — trzecią sprawę przechodzicie razem w symulatorze: jedna osoba czyta polecenie, druga klika. Nauczyciel mówi „zmiana”, gdy mija czas.',
    'Gdy mówisz Ty: 1) pokaż na swoim ekranie, co klikałeś w poprzednim etapie; 2) przeczytaj 3 zdania z „Karty eksperta” (jest na dole Twojej sprawy); 3) zadaj partnerowi jedno pytanie z listy poniżej i sprawdź, czy dobrze odpowiada.',
    'Gdy słuchasz: zadaj ekspertowi co najmniej jedno pytanie z listy poniżej. W teście będą bardzo podobne pytania, więc to Twoja ściąga — tylko w głowie.'],
    example:{question:'Nie masz pary i pracujesz sam?',answer:'Wróć do etapu „Ekspert” i załatw pozostałe dwie sprawy — po każdej pojawi się jej Karta eksperta. Potem odpowiedz sobie na pytania z listy poniżej. Tak przygotujesz się do testu.'}},
   ...note(9,'Mierz czas głośno: 3 × 3 minuty. Po każdej turze powiedz „zmiana”. W trzeciej turze pary przechodzą razem moduł, którego nikt nie robił. Chodź między parami i słuchaj, czy eksperci zadają pytania sprawdzające, a nie tylko czytają. Uczniowie pracujący solo w tym czasie czytają trzy Karty eksperta i odpowiadają sobie na pytania z kart poniżej.','Jak sprawdzisz, że kolega naprawdę zrozumiał Twoją sprawę, a nie tylko kiwa głową?','Zadam pytanie, np. „ile zapłacisz za bilet za 30 zł z ulgą?” albo „komu możesz podać kod recepty?”, i poproszę, żeby powtórzył najważniejszy krok własnymi słowami.','Ekspert czyta kartę na głos i nie sprawdza zrozumienia. Słuchacz nie zadaje pytań, bo „i tak wie”.','Poproś chętne pary o wymyślenie jednego podchwytliwego pytania do testu — zadasz je całej klasie.'),
   activities:[
    {type:'checklist',id:'teach-check',items:['Pokazałem/am partnerowi na ekranie swoją sprawę (sam: przeszedłem/am wszystkie trzy)','Przeczytałem/am 3 zdania z mojej Karty eksperta','Zadałem/am jedno pytanie z listy i partner dobrze odpowiedział (sam: odpowiedziałem/am sobie)','Trzecią sprawę przeszliśmy razem i znam jej Kartę eksperta'],explanation:'Gotowe. Kto tłumaczy innym, sam zapamiętuje najlepiej. Teraz test — każdy odpowiada sam.'},
    reveal('teach-questions',[
     {title:'Pytania do osoby A',icon:'shield',short:'Recepta i skierowanie',text:'Co dokładnie podaję w aptece? Czym różni się kod od 22-cyfrowego klucza recepty? Czy mama może wykupić mój lek? Czy e-skierowanie można zgubić?'},
     {title:'Pytania do osoby B',icon:'location',short:'Bilet ze zniżką',text:'Ile procent zniżki mam na bilet jednorazowy, a ile na miesięczny? Czy zdjęcie legitymacji wystarczy? Co się stanie, jeśli kupię bilet z ulgą 51%? Ile zapłacę za bilet za 30 zł?'},
     {title:'Pytania do osoby C',icon:'energy',short:'Zwrot podatku i PESEL',text:'Do ilu lat mam ulgę dla młodych? Co zrobić, żeby pracodawca w ogóle nie pobierał zaliczki? Jak odebrać zwrot? Po co zastrzegać PESEL i ile to kosztuje?'}
    ])
   ]},
  {id:'test',label:'Test',title:'Test — każdy odpowiada sam',grouping:'solo',
   intro:'Sześć pytań: po dwa z każdego modułu. Nie zaglądasz do partnera — sprawdzasz, jak dobrze Cię nauczył (i jak dobrze Ty nauczyłeś jego).',
   ...note(8,'Poproś o ciszę i samodzielną pracę. Po teście zapytaj pary, które pytanie sprawiło najwięcej kłopotu — to sygnał, który ekspert musi coś doprecyzować. Omów krótko pytanie z najniższą liczbą poprawnych odpowiedzi.','Które pytanie z testu było z modułu, którego nie robiłeś — i skąd wiedziałeś odpowiedź?','Od partnera: z jego karty, pokazu na ekranie albo pytania, które mu zadałem — albo z modułu, który przeszliśmy razem.','Mylenie ulg 37%/49%/51%. Liczenie ceny jako 37% ceny zamiast 63%. Przekonanie, że zastrzeżenie PESEL chroni przed spamem.','Każdy uczeń dopisuje do swojej karty eksperta jedno zdanie z innego modułu.'),
   activities:[
    choice('test-rx-code','A · Realizujesz e-receptę w aptece. Co podajesz farmaceucie?',['Tylko imię i nazwisko','PESEL i 4-cyfrowy kod recepty','Zdjęcie recepty wrzucone na grupę klasową'],[1],'PESEL i 4-cyfrowy kod (z SMS-a, e-maila albo konta pacjenta). Kod dajesz tylko farmaceucie lub zaufanej osobie, która wykupuje lek za Ciebie.','Karta eksperta A mówi o dwóch rzeczach, które podajesz w aptece.'),
    choice('test-ikp','A · Od ilu lat możesz sam logować się do swojego Internetowego Konta Pacjenta?',['Od 13 lat','Od 16 lat','Dopiero od 18 lat'],[1],'Od 16 lat logujesz się samodzielnie (z ograniczonymi uprawnieniami). Do 18. roku życia dostęp do Twojego konta mają też rodzice.','To wiek, który część z Was już ma.'),
    choice('test-37','B · Jaką ulgę masz jako uczeń technikum na jednorazowy bilet kolejowy?',['37%','49%','51%'],[0],'37% na bilety jednorazowe. 49% dotyczy miesięcznych imiennych, a 51% — studentów.','51% to pułapka z modułu B.'),
    choice('test-price','B · Bilet normalny kosztuje 30 zł. Ile zapłacisz z ulgą 37%?',['11,10 zł','18,90 zł','14,70 zł'],[1],'Płacisz 63% ceny: 30 zł × 0,63 = 18,90 zł. 11,10 zł to wysokość zniżki, a 14,70 zł to cena z ulgą studencką 51%.','Płacisz 100% − 37% = 63% ceny.'),
    choice('test-pit0','C · Masz 17 lat. Pracodawca pobrał 150 zł zaliczki na podatek z wakacyjnego zlecenia. Co robisz?',['Nic — te pieniądze przepadły','W zeznaniu Twój e-PIT zaznaczam ulgę dla młodych i odzyskuję 150 zł','Dopłacam 150 zł kary'],[1],'Do 26 lat przychody z pracy (do 85 528 zł rocznie) są zwolnione z PIT. Zaliczka wraca w zwrocie podatku — do 45 dni od złożenia zeznania online.','Karta eksperta C mówi o zwrocie, nie o karze.'),
    choice('test-pesel','C · Po co zastrzegać PESEL?',['Żeby nikt nie wziął kredytu ani nie założył konta na moje dane','Żeby nie dostawać spamu','Żeby nie płacić podatku'],[0],'Od czerwca 2024 r. banki muszą sprawdzać, czy PESEL jest zastrzeżony. Zastrzeżenie jest bezpłatne i można je czasowo cofnąć.','Chodzi o ochronę przed kimś, kto podszywa się pod Ciebie.')
   ]},
  {id:'result',label:'Wynik',title:'Twoja karta obywatela online',grouping:'solo',
   intro:'Punkty z logowania, modułu eksperta i testu. Najważniejsze: wiesz, gdzie kliknąć, a gdzie nie klikać nigdy.',
   ...note(4,'Uczniowie uzupełniają samoocenę i pokazują kartę. Zapytaj pary, czy ich wyniki z testu są podobne — jeśli jedna osoba ma dużo mniej, to znak, że moduł partnera trzeba było lepiej wyjaśnić. Zakończ pytaniem wyjściowym.','Którą z dzisiejszych spraw załatwisz jako pierwszą w prawdziwym życiu?','Np. mLegitymacja i bilet z ulgą 37%, oświadczenie o uldze dla młodych u pracodawcy w wakacje, zastrzeżenie PESEL.','Uczniowie myślą, że e-usługi to „nuda dla dorosłych”. Pokaż, że chodzi o konkretne pieniądze: 15,54 zł na jednym bilecie, 230 zł zwrotu podatku.','Zapytaj, kto chce na następnej lekcji pokazać klasie, jak dodać mLegitymację do mObywatela (na własnym telefonie, dobrowolnie).'),
   activities:[
    {type:'resultCard',id:'result-card',title:'Karta obywatela online',sources:['l09-time','l09-pdf','es-login','es-expert','test-rx-code','test-ikp','test-37','test-price','test-pit0','test-pesel'],
     badges:[
      {min:0,name:'Petent w kolejce',text:'Na razie numerek 147 i krzesło pod ścianą. Wróć do modułów — każdy zajmuje kilka minut, a kolejka godziny.'},
      {min:0.5,name:'Obywatel online',text:'Logujesz się bez wpadki i wiesz, gdzie szukać. Jeszcze kilka szczegółów i urzędnik będzie potrzebny tylko do „dzień dobry”.'},
      {min:0.85,name:'Cyfrowy załatwiacz spraw',text:'Recepta, bilet ze zniżką, zwrot podatku — ogarniasz to z telefonu szybciej, niż ktoś znajdzie długopis w okienku.'}
     ]}
   ]}
 ],
 exitTicket:'Zapamiętaj: adres kończy się na .gov.pl przed pierwszym „/”; e-recepta = PESEL + 4-cyfrowy kod; uczeń = 37% (jednorazowy) i 49% (miesięczny); do 26 lat ulga dla młodych, zaliczka wraca w Twoim e-PIT; zastrzeż PESEL w mObywatelu.'
};
