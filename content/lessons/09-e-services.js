import {note, choice, reveal} from '../schema.js';

export default {
 id:'09',grade:1,title:'Korzystanie z wybranych e-usług',
 subtitle:'Załatwisz receptę, bilet ze zniżką i zwrot podatku z wakacyjnej pracy bez kolejki — i nie dasz się okraść po drodze.',
 topic:'Korzystanie z wybranych e-usług',icon:'idcard',tags:['e-recepta','ulga 37%','PIT-0'],duration:44,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): korzystanie z usług i zasobów sieciowych, bezpieczeństwo danych',
 format:{
  name:'Układanka (jigsaw) w trójkach + tutoring rówieśniczy',
  student:'Każdy w trójce zostaje ekspertem jednej sprawy: zdrowie, dojazdy albo pieniądze z pracy. Potem uczysz pozostałych, a oni uczą Ciebie. Na koniec test — każdy odpowiada sam, więc słuchaj uważnie. Efekt: wiesz, jak załatwić receptę, bilet ze zniżką i zwrot podatku bez kolejki.',
  teacher:'Najpierw wszyscy uczą się bezpiecznego logowania i rozpoznawania fałszywych stron. Potem układanka: w każdej trójce uczniowie dzielą się modułami A, B, C i samodzielnie przechodzą swój moduł w symulatorze, kończąc „Kartą eksperta”. W etapie uczenia każdy ekspert w 2–3 minuty uczy pozostałych według ramy z checklisty, a słuchacze zadają pytania z kart. Test sprawdza wiedzę ze wszystkich modułów indywidualnie — to buduje odpowiedzialność za uczenie innych. Twoja rola: pilnować czasu, podchodzić do ekspertów tego samego modułu i sprawdzać, czy ich 3 zdania są poprawne.',
  grouping:'Trójki (A — Zdrowie, B — Dojazdy, C — Pieniądze i praca). Przy parze jedna osoba bierze dwa moduły. Uczeń sam: przechodzi wszystkie trzy moduły w skrócie (ok. 4 min każdy) i czyta karty eksperta zamiast etapu uczenia.',
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
  preparation:'Przed etapem 3 podziel klasę na trójki i przydziel litery A, B, C (np. według kolejności w dzienniku). Portal „e-Sprawy”, apteka, KolejSim i e-Urząd to fikcyjne symulacje — nie używają prawdziwych danych. W tekstach wymieniamy realne usługi (mObywatel, IKP, Twój e-PIT, 8080, incydent.cert.pl) jako fakty do zapamiętania.',
  summary:'Uczeń loguje się z kodem SMS, odróżnia domenę kończącą się na .gov.pl od podróbek (np. .gov.pl.login-check.xyz, -gov.pl, e-5prawy). Realizuje e-receptę PESEL + 4-cyfrowy kod, wybiera ulgę 37% na bilet jednorazowy (49% — miesięczny imienny, 51% — tylko studenci), liczy 42 zł × 0,63 = 26,46 zł, odzyskuje zaliczkę 230 zł dzięki uldze dla młodych i wie, po co zastrzec PESEL. Pytanie dodatkowe: dlaczego kłódka w przeglądarce nie gwarantuje, że strona jest prawdziwa?'
 },
 sections:[
  {id:'start',label:'Start',title:'Okienko czy aplikacja?',grouping:'class',
   intro:'Pani w okienku jest miła, ale kolejka ma 40 osób. Sprawdź, ile czasu oszczędza e-usługa — i szybka powtórka z wyszukiwania.',
   ...note(4,'Zapytaj, kto załatwiał już coś online sam (np. mLegitymacja, e-recepta, bilet). Pierwsze pytanie to hak, drugie — powtórka z poprzedniej lekcji. Zapowiedz, że dziś każdy zostanie ekspertem jednej sprawy i będzie uczył innych.','Jaką sprawę Ty albo Twoja rodzina ostatnio załatwialiście w urzędzie lub przychodni osobiście?','Np. recepta, legitymacja, zaświadczenie, bilet miesięczny. Wiele z nich da się dziś załatwić online.','Uczniowie myślą, że e-usługi są „dla dorosłych”. Tymczasem mLegitymację, bilet z ulgą czy e-receptę obsługują sami, a od 16 lat logują się do swojego konta pacjenta.','Zapytaj, kto ma już mLegitymację w telefonie i czy konduktor ją kiedyś sprawdzał.'),
   activities:[
    choice('l09-time','Chcesz zastrzec swój PESEL, żeby nikt nie wziął kredytu na Twoje dane. Ile to zajmie?',['Pół dnia: urząd gminy, kolejka, wniosek','Około minuty w aplikacji mObywatel — bezpłatnie','Tydzień, bo trzeba wysłać list'],[1],'W aplikacji to kilka kliknięć i jest bezpłatne. W urzędzie gminy też się da, ale z dojazdem i kolejką to zwykle godziny. Zastrzeżenie można czasowo cofnąć, np. przy braniu kredytu.','Pomyśl o aplikacji, którą masz w telefonie do dokumentów.'),
    choice('l09-pdf','Powtórka: który operator pokaże tylko pliki PDF?',['site:pdf','filetype:pdf','"pdf"'],[1],'filetype:pdf zostawia tylko pliki PDF — idealne do regulaminów, cenników i formularzy urzędowych.','site: ogranicza stronę, a nie typ pliku.')
   ]},
  {id:'login',label:'Logowanie',title:'Wejście bez wpadki',grouping:'solo',
   intro:'Zaloguj się do e-Spraw (symulacja) z kodem SMS. Potem cztery sytuacje: prawdziwa strona czy pułapka? Jeden błąd tutaj to przejęte konto.',
   reading:{title:'Dwa zamki i czytanie adresu',paragraphs:['Do e-usług państwa logujesz się przez węzeł logowania (w rzeczywistości login.gov.pl): profilem zaufanym (login i hasło), przez bank albo aplikacją mObywatel. Po haśle przychodzi kod SMS — to drugi zamek, czyli weryfikacja dwuetapowa.','Oszuści podrabiają strony logowania. Czytaj adres od końca: tuż przed pierwszym „/” musi stać dokładnie .gov.pl. Podejrzany SMS przekaż na 8080 (bezpłatnie), podejrzaną stronę zgłoś na incydent.cert.pl.'],example:{question:'Kłódka przy adresie = bezpieczna strona?',answer:'Nie. Kłódka oznacza tylko, że połączenie jest szyfrowane. Oszust też może mieć kłódkę — liczy się domena.'}},
   ...note(7,'Uczniowie pracują sami. Po 4 minutach zatrzymaj klasę na sytuacji 2 (adres z .gov.pl na początku i .xyz na końcu) i zapytaj, kto dał się złapać. Pokaż na tablicy, jak czytać adres od końca do pierwszego „/”.','Który fragment adresu decyduje o tym, do kogo należy strona?','Domena tuż przed pierwszym „/”, czytana od końca: np. …login-check.xyz należy do właściciela login-check.xyz, a nie do e-sprawy.gov.pl.','Uczniowie ufają kłódce i temu, że adres „zaczyna się od” znanej nazwy. Nie zauważają cyfry 5 zamiast litery s ani myślnika zamiast kropki.','Poproś uczniów o sprawdzenie w swoim telefonie, czy mają włączone powiadomienia z aplikacji banku albo mObywatela i jak wygląda prawdziwy SMS z kodem.'),
   activities:[
    {type:'eServices',id:'es-login',mode:'login',points:5,label:'Logowanie z kodem SMS i 4 pułapki'}
   ]},
  {id:'expert',label:'Ekspert',title:'Zostań ekspertem jednej sprawy',grouping:'trio',
   intro:'W trójce każdy wybiera inny moduł: A — Zdrowie, B — Dojazdy, C — Pieniądze i praca. Przejdź 4 kroki i zapamiętaj 3 zdania z Karty eksperta — za chwilę będziesz uczyć innych.',
   reading:{title:'Trzy sprawy, które załatwisz sam',paragraphs:['A — Zdrowie: e-receptę i e-skierowanie realizujesz na PESEL i 4-cyfrowy kod. B — Dojazdy: uczniowie do 24 lat mają 37% ulgi na bilety jednorazowe i 49% na miesięczne imienne; dokument to legitymacja lub mLegitymacja.','C — Pieniądze: do 26 lat przychody z pracy do 85 528 zł rocznie są zwolnione z PIT (ulga dla młodych). Jeśli pracodawca pobrał zaliczkę, odzyskasz ją w zeznaniu Twój e-PIT — gotowym od 15 lutego, ze zwrotem do 45 dni.']},
   ...note(12,'Sprawdź, czy w każdej trójce litery się nie powtarzają. Po 8 minutach poproś ekspertów tego samego modułu (np. wszystkie „A”) o 1-minutowe porównanie Kart eksperta w małej grupie — czy ich 3 zdania się zgadzają. Uczniowie solo robią wszystkie moduły szybciej, bez czytania całych treści.','Jakie jedno zdanie z Twojej karty eksperta jest najważniejsze dla kogoś w Twoim wieku?','A: kodu recepty nie wrzucasz na grupę. B: 37% na jednorazowy, 51% to nie dla uczniów. C: zaznacz ulgę dla młodych i odzyskasz zaliczkę.','Moduł B: wybór ulgi 51% (studencka). Moduł A: wpisanie 22-cyfrowego klucza zamiast 4-cyfrowego kodu. Moduł C: przekonanie, że zaliczka podatku przepada.','Szybsi uczniowie przechodzą drugi moduł — liczy się najlepszy, ale zdobyta wiedza przyda się w teście.'),
   activities:[
    {type:'eServices',id:'es-expert',mode:'expert',points:4,label:'Moduł eksperta (A, B lub C)'}
   ]},
  {id:'teach',label:'Uczę',title:'Naucz swoją trójkę',grouping:'trio',
   intro:'Każdy ekspert ma 2–3 minuty. Pokaż na ekranie swój moduł, przekaż 3 zdania z karty i sprawdź, czy słuchacze zrozumieli. Słuchacze: pytajcie — test za chwilę rozwiązujecie sami.',
   ...note(9,'Mierz czas głośno: 3 × 3 minuty. Po każdej turze powiedz „zmiana eksperta”. Chodź między trójkami i słuchaj, czy eksperci zadają pytania sprawdzające, a nie tylko czytają. Uczniowie pracujący solo w tym czasie czytają trzy Karty eksperta i odpowiadają sobie na pytania z kart poniżej.','Jak sprawdzisz, że kolega naprawdę zrozumiał Twoją sprawę, a nie tylko kiwa głową?','Zadam pytanie, np. „ile zapłacisz za bilet za 30 zł z ulgą?” albo „komu możesz podać kod recepty?”, i poproszę, żeby powtórzył najważniejszy krok własnymi słowami.','Ekspert czyta kartę na głos i nie sprawdza zrozumienia. Słuchacze nie zadają pytań, bo „i tak wiedzą”.','Poproś każdą trójkę o wymyślenie jednego podchwytliwego pytania do testu dla innej trójki.'),
   activities:[
    {type:'checklist',id:'teach-check',items:['Pokazałem/am na ekranie, gdzie jest najważniejsza informacja (kod recepty, wybór ulgi albo pole ulgi w zeznaniu)','Zadałem/am słuchaczom co najmniej jedno pytanie sprawdzające','Słuchacze powtórzyli najważniejszy krok własnymi słowami'],explanation:'Świetnie. Kto uczy innych, sam zapamiętuje najlepiej. Teraz słuchasz kolejnych ekspertów — zadawaj pytania z kart poniżej.'},
    reveal('teach-questions',[
     {title:'Pytania do eksperta A',icon:'shield',short:'Zdrowie: e-recepta i e-skierowanie',text:'Co dokładnie podaję w aptece? Czym różni się kod od 22-cyfrowego klucza recepty? Czy mama może wykupić mój lek? Czy e-skierowanie można zgubić?'},
     {title:'Pytania do eksperta B',icon:'location',short:'Dojazdy: ulga i bilet',text:'Ile procent zniżki mam na bilet jednorazowy, a ile na miesięczny? Czy zdjęcie legitymacji wystarczy? Co się stanie, jeśli kupię bilet z ulgą 51%? Ile zapłacę za bilet za 30 zł?'},
     {title:'Pytania do eksperta C',icon:'energy',short:'Pieniądze: PIT-0 i PESEL',text:'Do ilu lat mam ulgę dla młodych? Co zrobić, żeby pracodawca w ogóle nie pobierał zaliczki? Jak odebrać zwrot? Po co zastrzegać PESEL i ile to kosztuje?'}
    ])
   ]},
  {id:'test',label:'Test',title:'Test drużyny — każdy odpowiada sam',grouping:'solo',
   intro:'Sześć pytań: po dwa z każdego modułu. Nie zaglądasz do partnerów — sprawdzasz, jak dobrze Cię nauczyli (i jak dobrze Ty nauczyłeś ich).',
   ...note(8,'Poproś o ciszę i samodzielną pracę. Po teście zapytaj trójki, które pytanie sprawiło najwięcej kłopotu — to sygnał, który ekspert musi coś doprecyzować. Omów krótko pytanie z najniższą liczbą poprawnych odpowiedzi.','Które pytanie z testu było z modułu, którego nie robiłeś — i skąd wiedziałeś odpowiedź?','Od eksperta z mojej trójki: z jego karty, pokazu na ekranie albo pytania, które mu zadałem.','Mylenie ulg 37%/49%/51%. Liczenie ceny jako 37% ceny zamiast 63%. Przekonanie, że zastrzeżenie PESEL chroni przed spamem.','Każdy uczeń dopisuje do swojej karty eksperta jedno zdanie z innego modułu.'),
   activities:[
    choice('test-rx-code','A · Realizujesz e-receptę w aptece. Co podajesz farmaceucie?',['Tylko imię i nazwisko','PESEL i 4-cyfrowy kod recepty','Zdjęcie recepty wrzucone na grupę klasową'],[1],'PESEL i 4-cyfrowy kod (z SMS-a, e-maila albo konta pacjenta). Kod dajesz tylko farmaceucie lub zaufanej osobie, która wykupuje lek za Ciebie.','Ekspert A mówił o dwóch rzeczach, które podajesz w aptece.'),
    choice('test-ikp','A · Od ilu lat możesz sam logować się do swojego Internetowego Konta Pacjenta?',['Od 13 lat','Od 16 lat','Dopiero od 18 lat'],[1],'Od 16 lat logujesz się samodzielnie (z ograniczonymi uprawnieniami). Do 18. roku życia dostęp do Twojego konta mają też rodzice.','To wiek, który część z Was już ma.'),
    choice('test-37','B · Jaką ulgę masz jako uczeń technikum na jednorazowy bilet kolejowy?',['37%','49%','51%'],[0],'37% na bilety jednorazowe. 49% dotyczy miesięcznych imiennych, a 51% — studentów.','51% to pułapka z modułu B.'),
    choice('test-price','B · Bilet normalny kosztuje 30 zł. Ile zapłacisz z ulgą 37%?',['11,10 zł','18,90 zł','14,70 zł'],[1],'Płacisz 63% ceny: 30 zł × 0,63 = 18,90 zł. 11,10 zł to wysokość zniżki, a 14,70 zł to cena z ulgą studencką 51%.','Płacisz 100% − 37% = 63% ceny.'),
    choice('test-pit0','C · Masz 17 lat. Pracodawca pobrał 150 zł zaliczki na podatek z wakacyjnego zlecenia. Co robisz?',['Nic — te pieniądze przepadły','W zeznaniu Twój e-PIT zaznaczam ulgę dla młodych i odzyskuję 150 zł','Dopłacam 150 zł kary'],[1],'Do 26 lat przychody z pracy (do 85 528 zł rocznie) są zwolnione z PIT. Zaliczka wraca w zwrocie podatku — do 45 dni od złożenia zeznania online.','Ekspert C mówił o zwrocie, nie o karze.'),
    choice('test-pesel','C · Po co zastrzegać PESEL?',['Żeby nikt nie wziął kredytu ani nie założył konta na moje dane','Żeby nie dostawać spamu','Żeby nie płacić podatku'],[0],'Od czerwca 2024 r. banki muszą sprawdzać, czy PESEL jest zastrzeżony. Zastrzeżenie jest bezpłatne i można je czasowo cofnąć.','Chodzi o ochronę przed kimś, kto podszywa się pod Ciebie.')
   ]},
  {id:'result',label:'Wynik',title:'Twoja karta obywatela online',grouping:'solo',
   intro:'Punkty z logowania, modułu eksperta i testu. Najważniejsze: wiesz, gdzie kliknąć, a gdzie nie klikać nigdy.',
   ...note(4,'Uczniowie uzupełniają samoocenę i pokazują kartę. Zapytaj trójki, czy ich średni wynik z testu jest podobny — jeśli jedna osoba ma dużo mniej, to znak, że jej moduł trzeba było lepiej wyjaśnić. Zakończ pytaniem wyjściowym.','Którą z dzisiejszych spraw załatwisz jako pierwszą w prawdziwym życiu?','Np. mLegitymacja i bilet z ulgą 37%, oświadczenie o uldze dla młodych u pracodawcy w wakacje, zastrzeżenie PESEL.','Uczniowie myślą, że e-usługi to „nuda dla dorosłych”. Pokaż, że chodzi o konkretne pieniądze: 15,54 zł na jednym bilecie, 230 zł zwrotu podatku.','Zapytaj, kto chce na następnej lekcji pokazać klasie, jak dodać mLegitymację do mObywatela (na własnym telefonie, dobrowolnie).'),
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
