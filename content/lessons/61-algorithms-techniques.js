import {note, choice} from '../schema.js';

// Schemat 1: skarbonka na telefon (sekwencja + warunek + powtarzanie) — śledzenie krok po kroku.
const SKARBONKA = {blocks:[
 {id:'s',kind:'start',text:'Start',pos:[0,0],next:'in'},
 {id:'in',kind:'io',text:'Wczytaj cena, kwota',pos:[0,1],next:'init'},
 {id:'init',kind:'op',text:'suma ← 0\nmiesiące ← 0',pos:[0,2],next:'if'},
 {id:'if',kind:'if',text:'suma < cena',pos:[0,3],yes:'add',no:'out'},
 {id:'add',kind:'op',text:'suma ← suma + kwota\nmiesiące ← miesiące + 1',pos:[0,4],next:'if'},
 {id:'out',kind:'io',text:'Wypisz miesiące',pos:[1,4],next:'e'},
 {id:'e',kind:'end',text:'Stop',pos:[1,5]}
]};

// Schemat 2: darmowa dostawa od 100 zł — dwa puste pola do uzupełnienia, sprawdzane testami.
const DOSTAWA = {blocks:[
 {id:'s',kind:'start',text:'Start',pos:[0,0],next:'in'},
 {id:'in',kind:'io',text:'Wczytaj koszyk',pos:[0,1],next:'if'},
 {id:'if',kind:'if',text:'',blank:{options:['koszyk ≥ 100','koszyk > 100','koszyk < 100','dostawa ≥ 100'],answer:0},pos:[0,2],yes:'free',no:'paid'},
 {id:'free',kind:'op',text:'dostawa ← 0',pos:[0,3],next:'sum'},
 {id:'paid',kind:'op',text:'dostawa ← 15',pos:[1,3],next:'sum'},
 {id:'sum',kind:'op',text:'',blank:{options:['razem ← koszyk + dostawa','razem ← koszyk - dostawa','razem ← dostawa'],answer:0},pos:[0,4],next:'out'},
 {id:'out',kind:'io',text:'Wypisz razem',pos:[0,5],next:'e'},
 {id:'e',kind:'end',text:'Stop',pos:[0,6]}
]};

const DOSTAWA_PY = `koszyk = 80
if koszyk >= 100:
    dostawa = 0
else:
    dostawa = 15
razem = koszyk + dostawa
print("Do zapłaty:", razem, "zł")
`;

export default {
 id:'61',grade:1,order:23,title:'Techniki algorytmiczne i programowanie',
 subtitle:'Algorytm to przepis, który wykona każdy — nawet komputer. Zapiszesz go listą kroków, schematem blokowym i pseudokodem, a na koniec uruchomisz swój pierwszy program w Pythonie.',
 topic:'Algorytm: lista kroków, schemat blokowy, pseudokod; sekwencja, warunek, iteracja; śledzenie; pierwszy program w Pythonie',icon:'list',tags:['schemat blokowy','pseudokod','pierwszy program'],duration:45,
 curriculum:'Informatyka – liceum/technikum (PP 2024) · I.1 (od specyfikacji do algorytmu: lista kroków, schemat blokowy, pseudokod), I.3 (sprawdzanie algorytmu na przykładowych danych — śledzenie i testy), II.2 (uruchomienie programu w środowisku Python)',
 format:{
  name:'Jeden algorytm, cztery zapisy',
  student:'Ten sam pomysł zapiszesz na cztery sposoby: listą kroków, schematem blokowym, pseudokodem i w Pythonie. Najpierw prześledzisz gotowy schemat krok po kroku, potem uzupełnisz brakujące pola, a na końcu uruchomisz gotowy program. Efekt: schemat, który przechodzi testy, i pierwszy uruchomiony program.',
  teacher:'Nauczanie jawne: w etapie 3 pokazujesz na projektorze pierwsze 4 kroki śledzenia skarbonki i mówisz na głos, co robi komputer („romb: suma 0 < cena 600 — TAK, idziemy w dół”). Potem uczniowie przechodzą schemat sami i przy każdym rombie przewidują odpowiedź TAK/NIE. Etap 4 odblokowuje się dopiero po prześledzeniu skarbonki (mastery learning): uczeń uzupełnia dwa puste pola, a platforma uruchamia schemat na danych testowych. Etap 5 to pierwszy kontakt z Pythonem: przewidywanie, uruchomienie i zmiana jednej liczby — bez pisania od zera.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie przy śledzeniu skarbonki dwie osoby mogą na głos przewidywać odpowiedzi rombu — ale każda klika u siebie.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Wyjaśniam, czym jest algorytm, i rozpoznaję trzy techniki: sekwencję, warunek i powtarzanie.','Czytam schemat blokowy i śledzę go krok po kroku, zapisując wartości zmiennych.','Uzupełniam schemat blokowy tak, żeby przechodził testy, także na granicy warunku.','Uruchamiam gotowy program w Pythonie i wskazuję, która linia odpowiada rombowi ze schematu.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor do pokazania pierwszych kroków śledzenia (etap 3).'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 5 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB) i zapamięta go. Klucz: automat biletowy — wybór rodzaju, cena, wrzucanie monet (pętla), reszta (warunek), wydruk. Skarbonka (cena 600, kwota 250): romb TAK, TAK, TAK, NIE; dodawanie 3 razy; wynik 3. Dla 500 i 250 wynik 2 (500 < 500 to fałsz). Dostawa: pole 1 „koszyk ≥ 100”, pole 2 „razem ← koszyk + dostawa”; testy 60 → 75, 100 → 100, 140 → 140. Python: koszyk 80 → „Do zapłaty: 95 zł”, po zmianie na 120 → „Do zapłaty: 120 zł”. Sklep i automat są fikcyjne.',
  summary:'Uczeń układa algorytm jako listę kroków, rozpoznaje sekwencję, warunek i powtarzanie, śledzi schemat z pętlą, uzupełnia schemat z warunkiem tak, by przechodził testy, i uruchamia pierwszy program w Pythonie. Karta wyniku: maks. 24 pkt. Pytanie na wyjście: jak zapisać romb w Pythonie? Następna lekcja: zmienne, print i input w Pythonie.'
 },
 sections:[
  {id:'start',label:'Start',title:'Instrukcja, która nie działa',grouping:'class',
   intro:'Oglądałeś kiedyś poradnik „jak zrobić…”, w którym autor pominął jeden krok? Nie wychodzi. Komputer ma tak samo — tylko że on nie domyśli się brakującego kroku. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Od specyfikacji do algorytmu',paragraphs:['Na poprzedniej lekcji ustaliłeś, CO program ma zrobić: dane wejściowe, wynik i warunki. Dziś ustalisz, JAK: w jakich krokach z danych powstaje wynik. Taki przepis to algorytm.','Ten sam algorytm można zapisać na kilka sposobów: listą kroków, schematem blokowym, pseudokodem albo w języku programowania. Na koniec lekcji uruchomisz algorytm zapisany w Pythonie.']},
   ...note(4,'Hak: zapytaj o poradnik, w którym brakowało kroku (przepis, montaż, ustawienia telefonu). Potem dwa pytania powtórkowe z lekcji o specyfikacji — samodzielnie, bez notatek; omów tylko błędne odpowiedzi. Powiedz: dziś z „co” robimy „jak”.','Czym różni się specyfikacja od algorytmu?','Specyfikacja mówi, co ma wejść i wyjść, a algorytm — w jakich krokach z danych zrobić wynik.','Uczniowie utożsamiają algorytm z programem komputerowym. Algorytm to przepis — program to jego zapis w języku, który rozumie komputer.','Zapytaj, kto w domu „wykonuje algorytm” bez komputera (przepis na ciasto, instrukcja prania, procedura w pracy rodzica).'),
   activities:[
    choice('al-r1','Powtórka: w specyfikacji „Czy zdążę na autobus?” co jest danymi wejściowymi?',['Minuty do odjazdu i minuty dojścia na przystanek','Odpowiedź TAK albo NIE','Zasada „równe czasy = zdążysz”','Kolor autobusu'],[0],'Dane wejściowe to to, co program dostaje. TAK/NIE to wynik, a „równe czasy = zdążysz” — warunek.','Co program musi dostać, żeby cokolwiek policzyć?'),
    choice('al-r2','Powtórka: „darmowa dostawa od 100 zł”. Który przypadek testowy jest brzegowy?',['Koszyk za 100 zł','Koszyk za 40 zł','Koszyk za 500 zł','Koszyk za „sto” zł'],[0],'100 zł leży dokładnie na granicy warunku. Dziś zobaczysz, jak ten test łapie błąd w schemacie.','Który przypadek leży dokładnie na granicy warunku?')
   ]},
  {id:'lista',label:'Lista kroków',title:'Algorytm = przepis, który wykona każdy',grouping:'solo',
   intro:'Automat biletowy wykonuje algorytm za każdym razem, gdy ktoś kupuje bilet. Ułóż jego kroki, a potem rozpoznaj trzy techniki, z których zbudowany jest każdy algorytm.',
   reading:{title:'Algorytm i trzy techniki',paragraphs:['Algorytm to skończony ciąg jednoznacznych kroków, który z danych wejściowych robi wynik. Przepis na naleśniki, instrukcja montażu szafki i program w telefonie to algorytmy — różnią się tylko tym, kto je wykonuje.','Kroki łączy się na trzy sposoby: po kolei (sekwencja), z wyborem drogi („jeżeli…, to…, w przeciwnym razie…” — warunek) i z powtarzaniem („dopóki…, powtarzaj…” — iteracja, czyli pętla). Z tych trzech klocków zbudowany jest każdy program.']},
   ...note(7,'Uczniowie samodzielnie układają kroki automatu i przypisują techniki. Po 5 minutach zapytaj: „Który krok się powtarza i do kiedy?”. Jeśli ktoś pomyli warunek z powtarzaniem — pokaż różnicę: warunek wybiera drogę raz, pętla wraca do tego samego miejsca wiele razy.','Który krok automatu jest powtarzaniem i kiedy się kończy?','Wrzucanie monet — powtarza się, dopóki wrzucona kwota jest mniejsza od ceny. Kończy się, gdy kwota jest równa cenie albo większa.','Wydawanie reszty przed wrzuceniem monet; mylenie „jeżeli” (raz) z „dopóki” (wiele razy).','Szybsi: zapisz listę kroków algorytmu „ładowanie telefonu do 100%” z jednym powtarzaniem i jednym warunkiem.'),
   activities:[
    {type:'sequence',id:'al-ticket',question:'Fikcyjny automat biletowy. Ułóż kroki algorytmu kupowania biletu.',options:['Wydrukuj bilet','Odczytaj cenę biletu z ekranu','Jeżeli wrzucono więcej niż cena, wydaj resztę','Wybierz rodzaj biletu: normalny albo ulgowy','Dopóki wrzucona kwota jest mniejsza od ceny, wrzucaj kolejną monetę'],correct:[3,1,4,2,0],explanation:'Wybór → cena → wrzucanie monet (powtarzane) → reszta (tylko jeśli trzeba) → bilet. Każdy krok jest jednoznaczny, a algorytm zawsze się kończy.',hint:'Automat nie wyda reszty, zanim nie dostanie pieniędzy, i nie zna ceny, zanim nie wybierzesz biletu.'},
    {type:'matching',id:'al-kinds',points:2,question:'Do której techniki należy każdy krok automatu?',options:['Sekwencja (zwykły krok po kolei)','Warunek (wybór drogi)','Iteracja (powtarzanie)'],
     rows:[
      {label:'Odczytaj cenę biletu z ekranu',correct:[0],explanation:'Zwykły krok — wykonuje się raz, po poprzednim.'},
      {label:'Dopóki wrzucona kwota jest mniejsza od ceny, wrzucaj kolejną monetę',correct:[2],explanation:'„Dopóki… wrzucaj” — krok wraca, aż warunek przestanie być spełniony. To pętla.'},
      {label:'Jeżeli wrzucono więcej niż cena, wydaj resztę',correct:[1],explanation:'„Jeżeli” wybiera drogę raz: reszta jest albo jej nie ma.'},
      {label:'Wydrukuj bilet',correct:[0],explanation:'Zwykły krok na końcu sekwencji.'}
     ]}
   ]},
  {id:'schemat',label:'Schemat',title:'Schemat blokowy: prześledź skarbonkę',grouping:'solo',
   intro:'Algorytm z poprzedniej lekcji: po ilu miesiącach uzbierasz na telefon? Tym razem jako schemat blokowy. Klikaj „Wykonaj blok”, obserwuj zmienne, a przy każdym rombie zdecyduj: TAK czy NIE.',
   reading:{title:'Kształty schematu blokowego',paragraphs:['Owal to start i stop. Równoległobok to wczytanie danych albo wypisanie wyniku. Prostokąt to obliczenie — strzałka ← znaczy „wpisz do zmiennej”: suma ← 0. Romb to warunek: wychodzą z niego dwie strzałki, TAK i NIE.','Zmienna to pudełko z nazwą, w którym algorytm trzyma liczbę, np. suma. Strzałka wracająca w górę oznacza powtarzanie: algorytm wraca do rombu, dopóki warunek jest spełniony.']},
   ...note(10,'Nauczanie jawne: pokaż na projektorze pierwsze 4 kroki (start, wczytanie, ustawienie zmiennych, pierwszy romb) i mów na głos, co robi komputer. Potem uczniowie idą sami. Kto pomyli się przy rombie, dostaje podpowiedź z podstawionymi liczbami. Pytania odblokują się po dojściu do „Stop”. Zatrzymaj klasę przy pytaniu o 500 zł — to przypadek brzegowy z poprzedniej lekcji.','Dlaczego pętla kończy się, gdy suma = 750?','Bo romb pyta, czy suma < cena, a 750 < 600 to fałsz. Algorytm idzie strzałką NIE i wypisuje wynik.','Odpowiadanie TAK „z rozpędu” przy ostatnim rombie; mylenie suma (pieniądze) z miesiące (licznik).','Szybsi: zmień w głowie kwotę na 200 zł — ile razy romb odpowie TAK? (3 razy: 200, 400, 600, potem 600 < 600 to NIE).'),
   activities:[
    {type:'flowLab',id:'al-trace',mode:'trace',points:3,file:'skarbonka',title:'Skarbonka na telefon: śledzenie krok po kroku',chart:SKARBONKA,input:{cena:600,kwota:250},
     prompt:'Dane: telefon kosztuje 600 zł, odkładasz 250 zł miesięcznie. Żółty, pogrubiony blok wykona się teraz — jego treść widzisz też obok schematu. Przy rombie spójrz na tabelę zmiennych i zdecyduj, czy warunek jest spełniony.',
     questions:[
      {q:'Ile razy wykonał się blok z dodawaniem (suma ← suma + kwota)?',answer:'3',inputLabel:'Liczba powtórzeń',explain:'Po 3 dodaniach suma = 750, a 750 < 600 to fałsz — pętla się kończy. Wynik: 3 miesiące.',hint:'Policz, ile razy romb odpowiedział TAK.'},
      {q:'Telefon za 500 zł, odkładasz 250 zł. Co wypisze ten algorytm?',answer:'2',inputLabel:'Wynik',explain:'0 → 250 → 500. Warunek 500 < 500 jest fałszywy, więc algorytm wypisuje 2. To przypadek brzegowy: dzieli się bez reszty.',hint:'Prześledź w głowie: suma 0, potem 250, potem 500. Czy 500 < 500?'},
      {q:'Co oznacza strzałka, która wraca z prostokąta do rombu?',options:['Powtarzanie (iterację): algorytm wraca do warunku','Błąd w schemacie','Koniec algorytmu','Wczytanie nowych danych'],correct:[0],explain:'Strzałka w górę tworzy pętlę: dodawanie powtarza się, dopóki suma < cena.',hint:'Co by się działo, gdyby tej strzałki nie było?'}
     ]}
   ]},
  {id:'uzupelnij',label:'Uzupełnij',title:'Pseudokod i schemat do uzupełnienia',grouping:'solo',
   intro:'Najpierw połącz linie pseudokodu z kształtami. Potem uzupełnij schemat „darmowa dostawa od 100 zł”: wybierz treść dwóch pustych pól. Platforma uruchomi schemat na trzech testach — z poprzedniej lekcji wiesz, który jest najważniejszy.',
   reading:{title:'Pseudokod — algorytm słowami',paragraphs:['Pseudokod to zapis algorytmu słowami podobnymi do programu, ale bez ścisłych reguł języka. Skarbonka w pseudokodzie: wczytaj cena, kwota; suma ← 0; miesiące ← 0; dopóki suma < cena: suma ← suma + kwota, miesiące ← miesiące + 1; wypisz miesiące.','Lista kroków, schemat, pseudokod i program to cztery zapisy tego samego algorytmu. Zmienia się zapis, kroki zostają. Czy algorytm jest poprawny, sprawdzasz testami — także na granicy warunku.']},
   ...note(9,'Najpierw dopasowanie kształtów (2 minuty), potem schemat dostawy. Nie podpowiadaj, które pole jest złe — każ czytać tabelę testów: „dla jakich danych wyszło źle?”. Większość uczniów najpierw wybierze „koszyk > 100” — test 100 zł to wykryje. To ten sam błąd granicy, o którym była mowa na lekcji o specyfikacji.','Który test wykrył pomyłkę „koszyk > 100” i dlaczego?','Test z koszykiem 100 zł: przy „>” wychodzi 115 zł zamiast 100 zł, bo 100 > 100 to fałsz i algorytm dolicza dostawę.','Wybór „dostawa ≥ 100” w rombie — zmienna dostawa nie ma jeszcze wartości, więc algorytm się zatrzymuje (platforma to opisze).','Szybsi: zapisz pseudokod schematu dostawy w zeszycie albo w notatniku — tak, jak w przykładzie ze skarbonką.'),
   activities:[
    {type:'matching',id:'al-shapes',points:2,question:'Pseudokod skarbonki. Jaki kształt ma w schemacie blok z każdą linią?',options:['Owal','Równoległobok','Prostokąt','Romb'],
     rows:[
      {label:'wczytaj cena, kwota',correct:[1],explanation:'Wczytywanie i wypisywanie to równoległobok.'},
      {label:'suma ← suma + kwota',correct:[2],explanation:'Obliczenie i wpisanie do zmiennej to prostokąt.'},
      {label:'dopóki suma < cena',correct:[3],explanation:'Warunek (TAK/NIE) to romb.'},
      {label:'wypisz miesiące',correct:[1],explanation:'Wypisanie wyniku to też równoległobok.'},
      {label:'koniec',correct:[0],explanation:'Start i stop to owal.'}
     ]},
    {type:'flowLab',id:'al-fill',mode:'fill',points:4,file:'dostawa',title:'Uzupełnij schemat: darmowa dostawa od 100 zł',chart:DOSTAWA,requires:'al-trace',requiresTitle:'Skarbonka na telefon',
     prompt:'Sklep (fikcyjny): dostawa kosztuje 15 zł, a od 100 zł jest darmowa. Wybierz treść pól 1 i 2, potem kliknij „Sprawdź na danych testowych”.',
     tests:[{input:{koszyk:60},output:'75'},{input:{koszyk:100},output:'100'},{input:{koszyk:140},output:'140'}],
     hint:'Spójrz na test 100 zł: „od 100 zł” znaczy, że przy 100 zł dostawa też jest darmowa.',
     summary:'Schemat dostawy przechodzi 3/3 testy'}
   ]},
  {id:'python',label:'Python',title:'To samo w Pythonie: pierwszy program',grouping:'solo',
   intro:'Ten sam algorytm dostawy zapisany w języku Python. Najpierw przewidź, co wypisze, potem uruchom. Na koniec zmień jedną liczbę — i masz swój pierwszy uruchomiony program.',
   reading:{title:'Schemat → Python',paragraphs:['Romb ze schematu to w Pythonie linia if koszyk >= 100: — znak ≥ zapisuje się jako >=, a na końcu jest dwukropek. Linie „w środku” warunku są przesunięte o 4 spacje (wcięcie). else: to strzałka NIE.','Strzałka ← to w Pythonie znak =: dostawa = 15 znaczy „wpisz 15 do zmiennej dostawa”. print(…) wypisuje wynik na ekran. Python wykonuje linie od góry do dołu — tak jak Ty szedłeś po strzałkach.']},
   ...note(10,'Pierwszy kontakt z Pythonem. Poproś, żeby wszyscy weszli na ten etap od razu — ładowanie Pythona trwa chwilę. Najpierw każdy wpisuje przewidywanie, dopiero potem uruchamia. Przy zmianie programu chodź po sali: najczęstszy problem to przypadkowe skasowanie cudzysłowu albo wcięcia — wtedy platforma pokaże błąd po polsku. Powiedz wprost: błąd to normalna część programowania, nie porażka.','Która linia Pythona to romb ze schematu, a która strzałka NIE?','Romb to if koszyk >= 100:, strzałka NIE to else:. Wcięte linie pod nimi to bloki „dostawa ← 0” i „dostawa ← 15”.','Przewidywanie „Do zapłaty: razem zł” — uczniowie nie odróżniają tekstu w cudzysłowie od zmiennej. Wyjaśnij: tekst w cudzysłowie wypisuje się dosłownie, zmienna — swoją wartością.','Szybsi: zmień koszyk na 100 i przewidź wynik przed uruchomieniem (100 zł — granica!).'),
   activities:[
    {type:'pythonLab',id:'al-predict',mode:'predict',points:2,file:'dostawa.py',title:'Co wypisze ten program?',
     prompt:'Przeczytaj program linia po linii — to schemat dostawy zapisany w Pythonie. Wpisz, co pojawi się na ekranie, zaznacz, jak bardzo jesteś pewny, i uruchom.',
     code:DOSTAWA_PY,predictRows:2,
     explain:'koszyk = 80, a 80 >= 100 to fałsz, więc Python wykonał gałąź else: dostawa = 15. razem = 80 + 15 = 95. print wypisuje tekst z cudzysłowów dosłownie, a zmienną razem jej wartością, oddzielając elementy spacją: „Do zapłaty: 95 zł”.'},
    {type:'pythonLab',id:'al-run',mode:'code',points:2,file:'dostawa.py',title:'Twój pierwszy program: zmień jedną liczbę',
     prompt:'Zmień w pierwszej linii `koszyk = 80` na `koszyk = 120`. Kliknij „Uruchom” i zobacz wynik, a potem „Sprawdź”.',
     starter:DOSTAWA_PY,solution:DOSTAWA_PY.replace('koszyk = 80','koszyk = 120'),
     tests:[{output:'Do zapłaty: 120 zł',label:'Koszyk 120 zł — program wypisuje „Do zapłaty: 120 zł”'},{call:'dostawa',expected:'0',label:'Dostawa gratis (dostawa = 0)'}],
     hints:['Zmień tylko liczbę 80 w pierwszej linii na 120. Reszty nie ruszaj.','Pierwsza linia ma wyglądać tak: `koszyk = 120`'],
     successText:'Twój pierwszy program działa. Od tego zaczynał każdy programista.',
     questions:[
      {q:'Która linia Pythona odpowiada rombowi ze schematu?',options:['`if koszyk >= 100:`','`razem = koszyk + dostawa`','`print("Do zapłaty:", razem, "zł")`','`koszyk = 80`'],correct:[0],explain:'if to romb: sprawdza warunek i wybiera drogę. else: to strzałka NIE.',hint:'Szukaj linii, która zadaje pytanie TAK/NIE.'},
      {q:'W schemacie był blok „Wczytaj koszyk”. Co w tym programie go zastępuje?',options:['Linia koszyk = 80 — wartość jest wpisana w kod na stałe','Linia print(…)','Linia else:','Nic — program sam zgaduje koszyk'],correct:[0],explain:'Tu koszyk jest wpisany w kod. Na następnej lekcji poznasz input() — program zapyta użytkownika, jak „Wczytaj” w schemacie.',hint:'Skąd program bierze wartość koszyka?'}
     ]}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: algorytm pod kontrolą?',grouping:'solo',
   intro:'Ostatnie pytanie, samoocena i karta wyniku do pokazania nauczycielowi.',
   ...note(5,'Pytanie wyjściowe łączy schemat z Pythonem. Zbierz odpowiedzi: jak zapisać „wiek ≥ 18” w Pythonie. Zapowiedź: na następnej lekcji program zapyta użytkownika o dane (input) i wypisze ładny wynik.','Jak w Pythonie zapiszesz romb „wiek ≥ 18”?','if wiek >= 18: — z dwukropkiem na końcu i wcięciem w następnej linii.','Zapis ≥ zamiast >= albo brak dwukropka — Python tego nie zrozumie i pokaże błąd.','Zapytaj, jaki algorytm z codziennego życia ma pętlę (np. „dopóki bateria < 100%, ładuj”).'),
   activities:[
    choice('al-exit','Jak w Pythonie zapiszesz romb „wiek ≥ 18”?',['if wiek >= 18:','if wiek ≥ 18','wiek = 18','print(wiek >= 18)'],[0],'if + warunek z >= + dwukropek. Znak ≥ z matematyki zapisuje się w Pythonie jako >=.','Przypomnij sobie linię if z programu dostawy.'),
    {type:'resultCard',id:'result',title:'Algorytmy i pierwszy program — wynik',sources:['al-r1','al-r2','al-ticket','al-kinds','al-trace','al-shapes','al-fill','al-predict','al-run','al-exit'],badges:[
     {min:0,name:'Przepis bez kroków',text:'Algorytm jeszcze się sypie. Wróć do skarbonki i przejdź ją jeszcze raz, patrząc na tabelę zmiennych.'},
     {min:0.5,name:'Kucharz algorytmów',text:'Czytasz schematy i śledzisz pętlę. Jeszcze trochę i napiszesz własny przepis dla komputera.'},
     {min:0.85,name:'Architekt schematów',text:'Lista kroków, schemat, pseudokod i Python — ogarniasz wszystkie cztery zapisy. Pierwszy program już działa.'}
    ]}
   ]}
 ],
 exitTicket:'Wiesz, że algorytm to skończony przepis z krokami po kolei, warunkami i powtarzaniem. Czytasz i śledzisz schemat blokowy, uzupełniasz go tak, by przechodził testy, i uruchomiłeś pierwszy program w Pythonie. Następnym razem: zmienne, print i input.'
};
