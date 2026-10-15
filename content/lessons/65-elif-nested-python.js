import {note, choice} from '../schema.js';

// Klasa 1, temat 27. Uczniowie znają: print, zmienne, input/int, f-stringi, if/else, prostą walidację danych (lekcje 60–64).
// Bez funkcji (def) i bez pętli — programy czytają dane przez input(), a testy podają różne dane wejściowe.

const DRABINKA = `punkty = 92
if punkty >= 90:
    print("Ocena 5")
if punkty >= 75:
    print("Ocena 4")
if punkty >= 50:
    print("Ocena 3")
print("Koniec")
`;

const BATERIA = `bateria = 15
if bateria >= 80:
    print("Pełna — graj dalej")
elif bateria >= 20:
    print("Wystarczy na mecz")
elif bateria >= 5:
    print("Podłącz ładowarkę")
else:
    print("Telefon zaraz zgaśnie")
print("Sprawdzono baterię")
`;

const OCENY_OK = `punkty = int(input("Ile masz punktów na 100? "))
if punkty >= 90:
    print("Ocena: 5")
elif punkty >= 75:
    print("Ocena: 4")
elif punkty >= 50:
    print("Ocena: 3")
elif punkty >= 30:
    print("Ocena: 2")
else:
    print("Ocena: 1")
`;
const OCENY_BUG = `punkty = int(input("Ile masz punktów na 100? "))
if punkty >= 30:
    print("Ocena: 2")
elif punkty >= 50:
    print("Ocena: 3")
elif punkty >= 75:
    print("Ocena: 4")
elif punkty >= 90:
    print("Ocena: 5")
else:
    print("Ocena: 1")
`;

const KOD_OK = `kod = input("Kod rabatowy: ")
cena = 120
if kod == "LATO10":
    cena = cena - 12
elif kod == "KLASA1":
    cena = cena - 20
else:
    print("Nie ma takiego kodu")
print("Do zapłaty:", cena, "zł")
`;
const KOD_BUG = `kod = input("Kod rabatowy: ")
cena = 120
if kod = "LATO10":
    cena = cena - 12
elif kod == "KLASA1":
cena = cena - 20
else:
    print("Nie ma takiego kodu")
print("Do zapłaty:", cena, "zł")
`;

const KLUB_START = `karta = input("Masz kartę klubu? (tak/nie) ")
kwota = int(input("Kwota zakupów (zł): "))

if karta == "tak":
    # ← tu wstaw if w if: kwota >= 100 → rabat 15 zł,
    #   inaczej → ile trzeba dobrać do 100 zł
    print("Tu wstaw wewnętrzny if")
else:
    print(f"Do zapłaty: {kwota} zł")
`;
const KLUB = `karta = input("Masz kartę klubu? (tak/nie) ")
kwota = int(input("Kwota zakupów (zł): "))

if karta == "tak":
    if kwota >= 100:
        print(f"Rabat 15 zł! Do zapłaty: {kwota - 15} zł")
    else:
        print(f"Do zapłaty: {kwota} zł. Dobierz za {100 - kwota} zł, a dostaniesz rabat.")
else:
    print(f"Do zapłaty: {kwota} zł")
`;

export default {
 id:'65',grade:1,order:27,title:'Instrukcje warunkowe zagnieżdżone i z klauzulą elif w języku Python',
 subtitle:'Program sam wystawi ocenę za punkty, policzy cenę biletu i rabat w sklepie. Wystarczy, że ułożysz warunki w dobrej kolejności.',
 topic:'if – elif – else, kolejność warunków, if w if, = i ==, wcięcia',icon:'sort',tags:['elif','if w if','progi'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.1 (kolejne kroki rozwiązania: progi i przypadki), I.3 (sprawdzanie poprawności dla danych granicznych), II.1 (instrukcje warunkowe if–elif–else i zagnieżdżone, wejście/wyjście), II.2 (Python w przeglądarce)',
 format:{
  name:'Drabinka decyzji: przewiduj → ułóż → napraw → napisz',
  student:'Najpierw zgadujesz, co wypisze gotowy program, i sprawdzasz się. Potem układasz warunki w dobrej kolejności, naprawiasz dwa zepsute programy i piszesz własny: rabat w sklepie tylko dla klubowiczów. Każdy zielony test to punkty na karcie wyniku.',
  teacher:'Przykład rozwiązany na start: drabinka trzech osobnych if wypisuje trzy oceny naraz — to zderzenie z problemem, po którym elif ma sens. Śledzenie programu z baterią pokazuje, że Python sprawdza warunki od góry i zatrzymuje się na pierwszym prawdziwym. Etap „Kolejność” to pytanie diagnostyczne (ocenianie kształtujące): jeśli więcej niż co trzecia osoba odpowie źle, pokaż na projektorze 10-latka w złej kolejności warunków i dopiero wtedy przejdź dalej. Etapy „Napraw” i „Napisz” to feedback prowadzący do poprawy: testy podają dane graniczne (75, 90, 100 zł), a uczeń poprawia i sprawdza ponownie. Błędy Pythona są tłumaczone na polski — powiedz wprost, że czerwony komunikat to wskazówka, nie ocena.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie para przy etapie „Kolejność”: najpierw każdy odpowiada sam, potem porównujecie odpowiedzi.',
  methods:[
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Wyjaśniam, czym elif różni się od kilku osobnych if.','Układam warunki w dobrej kolejności i sprawdzam program na wartościach granicznych (np. 75, 90).','Piszę if w if: rabat tylko dla osób z kartą i tylko od 100 zł.','Poprawiam typowe błędy: = zamiast ==, brak wcięcia, zła kolejność warunków.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor do pokazania śledzenia programu z baterią (etap 2).','Tablica: rysunek „drabinki” — warunki od góry, pierwszy prawdziwy wygrywa.'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB, potem działa z pamięci). Klucz: przewidywanie — Ocena 5, Ocena 4, Ocena 3, Koniec; bateria 15 → „Podłącz ładowarkę”, 3 sprawdzone warunki, przy 80 → „Pełna — graj dalej”; kolejność: < 7, < 18, < 65, else; oceny: 95 → 5, 90 → 5, 75 → 4, 60 → 3, 40 → 2, 10 → 1; kody: LATO10 → 108 zł, KLASA1 → 100 zł, lato10 → nieznany kod i 120 zł; klub: tak/120 → 105 zł, tak/100 → 85 zł, tak/70 → dobierz 30 zł, nie → bez rabatu. Progi ocen i ceny biletów są przykładowe, fikcyjne — progi w szkole ustala statut i nauczyciel.',
  summary:'Uczeń przewiduje i śledzi elif, układa warunki, naprawia dwa programy (kolejność; = i wcięcie) i pisze if w if. Karta wyniku: maks. 22 pkt. Pytanie na wyjście: dlaczego 10-latek dostał bilet normalny, gdy warunek wiek < 65 stał pierwszy?'
 },
 sections:[
  {id:'start',label:'Start',title:'Ile punktów do czwórki?',grouping:'class',
   intro:'Masz 74 punkty na 100. Czwórka jest od 75. Program, który wystawia ocenę, musi sprawdzić kilka progów po kolei — i nie może się pomylić o jeden punkt. Twój kalkulator rabatu z poprzedniej lekcji też umiał powiedzieć tylko „dobrze” albo „błąd”. Dziś więcej dróg niż dwie. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Jeden if to dwie drogi. A gdy dróg jest pięć?',paragraphs:['if/else wybiera jedną z dwóch dróg: dane poprawne albo błędne, pełnoletni albo nie. Oceny mają pięć dróg, bilety do kina — cztery, bateria w telefonie — cztery komunikaty.','Dziś poznasz elif („else if”, czyli „a jeśli nie, to sprawdź…”) i if w if. Na końcu lekcji napiszesz program z rabatem, który działa jak kasa w sklepie.']},
   ...note(5,'Hak: zapytaj, kto kiedyś zabrakło jednego punktu do wyższej oceny — i czy na pewno ktoś dobrze policzył. Dwa pytania powtórkowe z lekcji o sprawdzaniu danych (temat 26) — samodzielnie, bez notatek. Omów tylko to pytanie, które sprawiło najwięcej kłopotu. Nawiąż do pytania na wyjście z tamtej lekcji: kalkulator ma mówić „to nie liczba” albo „rabat za duży” — to trzy drogi, a if/else ma dwie.','Czym różni się wiek = 18 od wiek == 18?','Pojedyncze = wpisuje wartość do zmiennej. Podwójne == porównuje i daje True albo False — używamy go w warunku.','Uczniowie mylą >= z > i gubią wartość graniczną (0, 18, 75); stawiają int() przed isdigit().','Zapytaj: jakie dane wpisałbyś, żeby sprawdzić program z biletem dla pełnoletnich? (17, 18, 19 — wokół progu).'),
   activities:[
    choice('el-r1','Powtórka z lekcji o sprawdzaniu danych: dlaczego w warunku if tekst.isdigit() and int(tekst) <= 50: sprawdzenie isdigit() stoi PRZED int()?',['Gdy tekst to „abc”, isdigit() daje False, and kończy sprawdzanie i int() się nie wykona — program się nie wysypie','Bo Python czyta warunki od prawej do lewej','Kolejność nie ma znaczenia','Bo int() działa tylko po isdigit()'],[0],'and sprawdza od lewej i staje na pierwszym False. Najpierw upewniasz się, że to cyfry, dopiero potem zamieniasz na liczbę. Odwrotnie int("abc") wysypałby program.','Co zrobi int("abc")? I kiedy and przestaje sprawdzać?'),
    choice('el-r2','Powtórka: która linia SPRAWDZA, czy ocena to 5?',['if ocena == 5:','if ocena = 5:','ocena = 5','if ocena => 5:'],[0],'W warunku porównujesz dwoma znakami ==. Pojedyncze = to przypisanie (wpisanie wartości), a => nie istnieje w Pythonie (jest >=).','W warunku potrzebne jest porównanie, nie wpisanie wartości.')
   ]},
  {id:'predict',label:'Przewiduj',title:'Trzy oceny naraz? Przewiduj, potem śledź',grouping:'solo',
   intro:'Ktoś napisał program do ocen z samych if. Wpisz, co wypisze, i zaznacz, jak bardzo jesteś pewna/pewny. Potem prześledzisz krok po kroku wersję z elif.',
   reading:{title:'if, if, if kontra if, elif, else',paragraphs:['Każdy osobny if jest sprawdzany zawsze. Dla 92 punktów prawdziwe są trzy warunki naraz (≥ 90, ≥ 75, ≥ 50), więc program wypisze trzy oceny.','elif sprawdza się tylko wtedy, gdy wszystko nad nim było fałszywe. Python idzie od góry i zatrzymuje się na PIERWSZYM prawdziwym warunku. Pozostałe pomija. else łapie wszystko, co zostało.'],example:{question:'Przykład rozwiązany: bateria = 50. Który komunikat wypisze program z elif (obok)?',answer:'50 >= 80? Nie. 50 >= 20? Tak → „Wystarczy na mecz”. Dalszych warunków Python już nie sprawdza.'}},
   ...note(8,'Najpierw wszyscy wpisują przewidywanie, dopiero potem uruchamiają. Zapytaj, kto zaznaczył „Na pewno” i się pomylił — to najlepszy moment lekcji, nie wstyd. Śledzenie baterii pokaż na projektorze: przy każdym kroku zapytaj „czy ten warunek jest prawdziwy?”. Po pytaniach kliknij „Zmień kod” i wpisz bateria = 80 — granica.','Dlaczego w programie z elif dla baterii 15 Python nie sprawdza już else?','Bo warunek bateria >= 5 był prawdziwy. Python wykonał tę gałąź i przeskoczył resztę drabinki.','Uczniowie myślą, że elif „sprawdza wszystko jeszcze raz” albo że else wykona się zawsze.','Zmień bateria na 0, potem na 20. Ile warunków sprawdzi Python w każdym przypadku?'),
   activities:[
    {type:'pythonLab',id:'el-predict',mode:'predict',points:2,file:'oceny_if.py',title:'Program z samych if',
     prompt:'Co wypisze ten program? Każdy `print` to osobna linia.',
     code:DRABINKA,predictRows:4,
     explain:'Każdy `if` jest sprawdzany osobno. 92 ≥ 90, 92 ≥ 75 i 92 ≥ 50 — trzy warunki prawdziwe, więc trzy oceny. Uczeń z 92 punktami dostałby „5, 4 i 3”. Naprawa: drugi i trzeci `if` zamień na `elif`.'},
    {type:'pythonLab',id:'el-trace',mode:'trace',points:0,file:'bateria.py',title:'elif krok po kroku: bateria w telefonie',
     prompt:'Klikaj „Krok dalej”. Strzałka ➜ pokazuje linię, która wykona się za chwilę. Zobacz, które linie Python pomija.',
     code:BATERIA,
     questions:[
      {q:'Co wypisze program dla bateria = 15?',options:['Podłącz ładowarkę','Wystarczy na mecz','Telefon zaraz zgaśnie','Podłącz ładowarkę i Telefon zaraz zgaśnie'],correct:[0],explain:'15 ≥ 80? Nie. 15 ≥ 20? Nie. 15 ≥ 5? Tak → „Podłącz ładowarkę”. else już się nie wykonuje.',hint:'Idź krokami i zobacz, przy której linii z print zatrzyma się strzałka.'},
      {q:'Ile warunków (linii z if albo elif) sprawdził Python dla bateria = 15?',answer:'3',inputLabel:'Liczba warunków',explain:'if bateria >= 80, elif bateria >= 20, elif bateria >= 5 — trzeci był prawdziwy, więc sprawdzanie się skończyło.',hint:'Policz linie 2, 4 i 6 — przez które z nich przeszła strzałka?'},
      {q:'Kliknij „Zmień kod”, wpisz bateria = 80 i prześledź. Co wypisze program?',options:['Pełna — graj dalej','Wystarczy na mecz','Nic','Pełna — graj dalej i Wystarczy na mecz'],correct:[0],explain:'80 >= 80 to prawda (>= znaczy „większe lub równe”). Wartość graniczna trafia do pierwszej gałęzi.',hint:'>= to „większe LUB RÓWNE”. Czy 80 jest równe 80?'}
     ]}
   ]},
  {id:'order',label:'Kolejność',title:'Kino: ułóż warunki w dobrej kolejności',grouping:'solo',
   intro:'Fikcyjne kino „Ekran 7”: dzieci do 6 lat wchodzą za darmo, osoby poniżej 18 lat i od 65 lat płacą 15 zł, pozostali 25 zł. Ułóż warunki tak, żeby każdy dostał właściwy bilet.',
   reading:{title:'Pierwszy prawdziwy wygrywa',paragraphs:['W drabince elif liczy się kolejność. Gdy warunki mają postać wiek < …, zaczynasz od najmniejszej granicy. Gdy mają postać punkty >= …, zaczynasz od największej.','Sprawdzaj program na granicach: 6 i 7 lat, 17 i 18, 64 i 65. To tam programy mylą się najczęściej.']},
   ...note(7,'To pytanie diagnostyczne. Daj 2 minuty na układankę i pytanie, potem zobacz wyniki (np. kciuk w górę). Jeśli więcej niż co trzecia osoba źle odpowiedziała na pytanie o 10-latka, pokaż na tablicy: wiek < 65 stoi pierwszy → 10 < 65 prawda → bilet normalny. Dopiero potem przejdź dalej.','Ile zapłaci 10-latek, jeśli pierwszy warunek to wiek < 65?','25 zł — bo 10 < 65 jest prawdą, Python zatrzymuje się na pierwszym prawdziwym warunku i nie dochodzi do wiek < 18.','Układanie warunków „od najważniejszego” albo w kolejności z treści zadania zamiast od najmniejszej granicy.','Zapytaj: jak trzeba by zmienić warunki, żeby zacząć od seniorów? (if wiek >= 65 … elif wiek >= 18 … — wtedy od największej).'),
   activities:[
    {type:'sequence',id:'el-seq',question:'Kliknij warunki w kolejności, w jakiej powinny stać w programie (od góry).',options:['if wiek < 7:  → bilet 0 zł','elif wiek < 18:  → ulgowy 15 zł','elif wiek < 65:  → normalny 25 zł','else:  → senior 15 zł'],correct:[0,1,2,3],explanation:'Od najmniejszej granicy: < 7, < 18, < 65, a na końcu else dla osób od 65 lat. Każdy wiek trafia do pierwszego prawdziwego warunku.',hint:'Pierwszy prawdziwy warunek wygrywa. Przy znaku < zacznij od najmniejszej liczby; else zawsze stoi na końcu.'},
    choice('el-wrong','Ktoś ułożył: if wiek < 65 → 25 zł, elif wiek < 18 → 15 zł, elif wiek < 7 → 0 zł, else → 15 zł. Ile zapłaci 10-latek?',['25 zł — warunek wiek < 65 jest prawdziwy jako pierwszy','15 zł — bo ma mniej niż 18 lat','0 zł — bo jest dzieckiem','Program zgłosi błąd'],[0],'10 < 65 to prawda, więc Python wykonuje pierwszą gałąź i dalej nie patrzy. Warunki wiek < 18 i wiek < 7 nigdy się nie wykonają — każdy, kto jest od nich młodszy, wpadnie wcześniej w wiek < 65.','Sprawdzaj od góry: który warunek jest pierwszym prawdziwym dla 10?')
   ]},
  {id:'fix',label:'Napraw',title:'Napraw dwa programy: oceny i kody rabatowe',grouping:'solo',
   intro:'Dwa programy mają typowe błędy. Uruchom, przeczytaj komunikat po polsku albo wynik testów i popraw. Pole „Dane wejściowe” to odpowiedzi, które program dostanie z input().',
   reading:{title:'Trzy najczęstsze błędy w warunkach',paragraphs:['1. Zła kolejność: warunek ogólny (punkty >= 30) stoi przed szczegółowym (punkty >= 90) i „zjada” wszystkie wyniki. 2. Pojedyncze = w warunku — Python od razu zgłasza błąd składni.','3. Brak wcięcia: linie wewnątrz if/elif/else muszą być przesunięte o 4 spacje (klawisz Tab). Bez wcięcia Python nie wie, co należy do której gałęzi.']},
   ...note(10,'Samodzielnie. Nie mów, gdzie są błędy — każ najpierw kliknąć „Uruchom” i przeczytać komunikat (oceny: wynik dla 95 to 2; kody: „Pojedyncze = w warunku”, potem „Brakuje wcięcia”). W kodach rabatowych zwróć uwagę na test z „lato10” małymi literami — dla komputera to inny tekst niż „LATO10”.','Dlaczego 95 punktów dawało ocenę 2?','Bo pierwszy warunek punkty >= 30 jest prawdziwy dla 95 i Python dalej nie sprawdza. Progi trzeba ułożyć od największego.','Zmiana >= na > (wtedy 90 i 75 przestają przechodzić) albo poprawianie tylko jednego błędu w kodach rabatowych i zdziwienie, że pojawia się drugi.','Dodaj do kodów rabatowych trzeci kod, np. „PROMO5” za 5 zł, i sprawdź go w polu „Dane wejściowe”.'),
   activities:[
    {type:'pythonLab',id:'el-fix-grades',mode:'code',points:3,file:'oceny.py',title:'Napraw: program daje dwóję za 95 punktów',input:true,stdin:['95'],
     prompt:'Progi: 90 → 5, 75 → 4, 50 → 3, 30 → 2, poniżej → 1. Uruchom dla 95 — wychodzi 2! Popraw kolejność warunków. Kliknij „Sprawdź”, a testy sprawdzą także wartości graniczne.',
     starter:OCENY_BUG,solution:OCENY_OK,
     tests:[
      {stdin:['95'],contains:['Ocena: 5'],label:'95 punktów'},
      {stdin:['90'],contains:['Ocena: 5'],label:'Granica: 90'},
      {stdin:['75'],contains:['Ocena: 4'],label:'Granica: 75'},
      {stdin:['60'],contains:['Ocena: 3'],label:'60 punktów'},
      {stdin:['40'],contains:['Ocena: 2'],label:'40 punktów'},
      {stdin:['10'],contains:['Ocena: 1'],label:'10 punktów'}
     ],
     hints:['Python zatrzymuje się na pierwszym prawdziwym warunku. Czy 95 >= 30? Tak — i to jest pierwszy warunek. Który próg powinien być sprawdzony najpierw?','Ułóż od największego: `if punkty >= 90:` … `elif punkty >= 75:` … `elif punkty >= 50:` … `elif punkty >= 30:` … `else:`. Pamiętaj, że print należy do swojego warunku (wcięcie).'],
     successText:'Teraz każdy próg działa — także 75 i 90.'},
    {type:'pythonLab',id:'el-fix-code',mode:'code',points:3,file:'kody.py',title:'Napraw: kody rabatowe w sklepie z grami',input:true,stdin:['LATO10'],
     prompt:'Gra kosztuje 120 zł. Kod `LATO10` obniża cenę o 12 zł, a kod `KLASA1` — o 20 zł. Inny kod: komunikat „Nie ma takiego kodu”. W programie są dwa błędy. Uruchom, przeczytaj komunikat, popraw i uruchom ponownie.',
     starter:KOD_BUG,solution:KOD_OK,
     tests:[
      {stdin:['LATO10'],contains:['Do zapłaty: 108 zł'],label:'Kod LATO10'},
      {stdin:['KLASA1'],contains:['Do zapłaty: 100 zł'],label:'Kod KLASA1'},
      {stdin:['lato10'],contains:['Nie ma takiego kodu','Do zapłaty: 120 zł'],label:'Małe litery to inny kod'},
      {stdin:['XYZ'],contains:['Nie ma takiego kodu','Do zapłaty: 120 zł'],label:'Nieznany kod'}
     ],
     hints:['Błąd 1 (linia 3): w warunku porównujesz dwoma znakami: `if kod == "LATO10":`.','Błąd 2 (linia 6): `cena = cena - 20` należy do `elif`, więc musi mieć wcięcie 4 spacji (Tab na początku linii).'],
     questions:[
      {q:'Ile zapłacisz z kodem KLASA1?',answer:'100',accept:['100zł','100 zł'],inputLabel:'Kwota (zł)',explain:'120 − 20 = 100 zł. Z LATO10: 120 − 12 = 108 zł — KLASA1 jest korzystniejszy.',hint:'Wpisz KLASA1 w pole „Dane wejściowe” i uruchom.'}
     ]}
   ]},
  {id:'write',label:'Napisz',title:'Twój program: rabat tylko dla klubowiczów',grouping:'solo',
   intro:'Sklep daje rabat 15 zł, ale tylko osobom z kartą klubu i tylko przy zakupach od 100 zł. Klubowicz z mniejszym koszykiem dostaje podpowiedź, ile brakuje. To dwa pytania jedno w drugim — if w if.',
   reading:{title:'if w if (zagnieżdżony)',paragraphs:['Wewnętrzny if sprawdza się tylko wtedy, gdy zewnętrzny warunek był prawdziwy. Najpierw pytasz „czy ma kartę?”, a dopiero potem „czy kwota >= 100?”.','Wewnętrzny if ma wcięcie 4 spacje, a print pod nim — 8 spacji. Każdy else stoi dokładnie pod swoim if.'],example:{question:'Przykład rozwiązany: karta = "tak", kwota = 80. Co wypisze program?',answer:'Karta „tak” → wchodzimy do środka. 80 >= 100? Nie → wewnętrzny else: „Do zapłaty: 80 zł. Dobierz za 20 zł, a dostaniesz rabat.”'}},
   ...note(10,'Samodzielnie. Kod startowy już działa dla osób bez karty — część testów jest zielona od razu (to celowo, szybki sukces). Uczeń zastępuje tylko linię „Tu wstaw wewnętrzny if”. Kto skończy wcześniej, odpowiada na pytanie o dobieranie produktu i dopisuje walidację z poprzedniej lekcji (kwota ujemna → komunikat).','Dlaczego klient bez karty nie dostanie rabatu nawet przy 500 zł?','Bo wewnętrzny if (kwota >= 100) leży wewnątrz if karta == "tak". Bez karty Python idzie od razu do zewnętrznego else.','else z wcięciem 4 zamiast 8 (albo odwrotnie) — Python łączy go z innym if; zapomniany f przed cudzysłowem (w wyniku widać {kwota}).','Dopisz trzeci próg: od 200 zł rabat 40 zł (elif wewnątrz klubowego if). Albo wróć do kalkulatora rabatu z poprzedniej lekcji i dodaj osobny komunikat „rabat za duży” przez elif.'),
   activities:[
    {type:'pythonLab',id:'el-club',mode:'code',points:4,file:'klub.py',title:'Rabat klubowy: if w if',input:true,stdin:['tak','120'],
     prompt:'W miejsce linii `print("Tu wstaw wewnętrzny if")` wstaw if w if:\n\n• kwota od 100 zł → `Rabat 15 zł! Do zapłaty: … zł` (kwota − 15),\n\n• mniej niż 100 zł → `Do zapłaty: … zł. Dobierz za … zł, a dostaniesz rabat.`\n\nDane wejściowe: pierwsza linia „tak” albo „nie”, druga — kwota.',
     starter:KLUB_START,solution:KLUB,
     tests:[
      {stdin:['tak','120'],contains:['Do zapłaty: 105 zł'],label:'Karta, 120 zł'},
      {stdin:['tak','100'],contains:['Do zapłaty: 85 zł'],label:'Granica: karta, 100 zł'},
      {stdin:['tak','70'],contains:['Do zapłaty: 70 zł','Dobierz za 30 zł'],label:'Karta, 70 zł'},
      {stdin:['nie','150'],contains:['Do zapłaty: 150 zł'],label:'Bez karty, 150 zł'},
      {stdin:['nie','50'],contains:['Do zapłaty: 50 zł'],label:'Bez karty, 50 zł'}
     ],
     sourceChecks:[{pattern:'^\\s{4,}if\\b',label:'W kodzie jest if wewnątrz if',hint:'To zadanie ćwiczy if w if. Wewnętrzny if zaczyna się od 4 spacji: `    if kwota >= 100:`.'}],
     hints:['Zamiast linii z print wpisz (wcięcie 4 spacje): `if kwota >= 100:`, a pod nim (8 spacji) print z rabatem: `print(f"Rabat 15 zł! Do zapłaty: {kwota - 15} zł")`.','Potem `else:` dokładnie pod wewnętrznym if (4 spacje), a pod nim (8 spacji): `print(f"Do zapłaty: {kwota} zł. Dobierz za {100 - kwota} zł, a dostaniesz rabat.")`.'],
     questions:[
      {q:'Masz kartę i koszyk za 95 zł. Opłaca się dorzucić skarpetki za 5 zł?',options:['Tak — zapłacisz 85 zł zamiast 95 zł i masz skarpetki','Nie — zapłacisz 100 zł','Nie — rabat jest tylko od 120 zł','To bez różnicy'],correct:[0],explain:'95 + 5 = 100 zł, a od 100 zł jest rabat 15 zł: 100 − 15 = 85 zł. Taniej niż bez skarpetek. Sklepy robią progi właśnie po to, żebyś dorzucił coś do koszyka.',hint:'Wpisz tak i 100 w pole „Dane wejściowe” i uruchom.'}
     ],
     summary:'Kasa z rabatem klubowym działa: {passed}/{total} testów',successText:'Twoja kasa liczy rabat poprawnie — także na granicy 100 zł.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: decyzje pod kontrolą?',grouping:'solo',
   intro:'Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(5,'Pytanie końcowe sprawdza, czy uczeń rozróżnia elif od osobnych if. Zbierz 2–3 przykłady z życia, gdzie jest „drabinka” (taryfa za bagaż, progi rabatowe, poziomy w grze). Przypomnij: sprawdzaj granice.','Kiedy użyjesz elif, a kiedy osobnych if?','elif — gdy ma się wykonać tylko jedna gałąź (jedna ocena, jeden bilet). Osobne if — gdy kilka rzeczy może być prawdą naraz i każda ma swój efekt (np. osobne odznaki).','„elif i if to to samo” — różnica wychodzi dopiero przy danych, które spełniają kilka warunków.','Napisz program „poziom XP”: 0–99 Nowicjusz, 100–499 Gracz, 500–999 Weteran, od 1000 Legenda.'),
   activities:[
    choice('el-exit','Gra daje rangę za XP: od 1000 „Legenda”, od 500 „Weteran”, od 100 „Gracz”, mniej — „Nowicjusz”. Który początek programu jest poprawny?',['if xp >= 1000: … elif xp >= 500: … elif xp >= 100: … else: …','if xp >= 100: … elif xp >= 500: … elif xp >= 1000: … else: …','if xp >= 1000: … if xp >= 500: … if xp >= 100: … else: …','if xp = 1000: … elif xp = 500: … else: …'],[0],'Przy >= zaczynasz od największego progu i używasz elif, żeby gracz dostał jedną rangę. Kolejność od 100 dałaby każdemu „Gracza”, a osobne if — kilka rang naraz.','Dwie rzeczy: kolejność progów przy >= i to, ile rang może dostać jeden gracz.'),
    {type:'resultCard',id:'result',title:'Warunki elif i if w if — wynik',sources:['el-r1','el-r2','el-predict','el-trace','el-seq','el-wrong','el-fix-grades','el-fix-code','el-club','el-exit'],badges:[
     {min:0,name:'Drabinka w budowie',text:'Kilka szczebli jeszcze się chwieje. Wróć do śledzenia baterii — tam widać, który warunek wygrywa.'},
     {min:0.5,name:'Sędzia progów',text:'Oceny, bilety i kody działają. Jeszcze kilka zielonych testów i żaden próg Cię nie zaskoczy.'},
     {min:0.85,name:'Kasjer bez pomyłek',text:'Rabat, bilet, ocena — wszystko co do złotówki i punktu. Sklep może Ci powierzyć kasę.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz zbudować drabinkę if – elif – else, ułożyć progi w dobrej kolejności, wstawić if w if i poprawić = na ==. Każdy program sprawdzasz na granicach: 75, 90, 100 zł.'
};
