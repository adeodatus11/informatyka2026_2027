import {note, choice} from '../schema.js';

// Klasa 1, temat 29. Pętla w pętli: wzorki z gwiazdek, tabliczka, terminarz turnieju, licznik wykonań.
// Bez funkcji (def) i bez list — dane z input(), testy podają różne dane wejściowe.

const KRATKA = `for wiersz in range(3):
    for kolumna in range(4):
        print("*", end="")
    print()
`;

const TABLICZKA_3 = `licznik = 0
for a in range(1, 4):
    for b in range(1, 4):
        licznik = licznik + 1
        print(a, "x", b, "=", a * b)
print("Wewnętrzna pętla wykonała się", licznik, "razy")
`;

const SCHODY = `wysokosc = 4
for wiersz in range(1, wysokosc + 1):
    for i in range(wiersz):
        print("*", end="")
    print()
print("Schody gotowe!")
`;

const TURNIEJ_BUG = `n = int(input("Ile drużyn? "))
mecze = 0
for a in range(1, n + 1):
    for b in range(1, n + 1):
        print(f"Drużyna {a} vs Drużyna {b}")
        mecze = mecze + 1
print("Liczba meczów:", mecze)
`;
const TURNIEJ = `n = int(input("Ile drużyn? "))
mecze = 0
for a in range(1, n + 1):
    for b in range(a + 1, n + 1):
        print(f"Drużyna {a} vs Drużyna {b}")
        mecze = mecze + 1
print("Liczba meczów:", mecze)
`;

const PROSTOKAT_START = `wys = int(input("Wysokość: "))
szer = int(input("Szerokość: "))
# ← tu: pętla w pętli, która rysuje prostokąt ze znaków #
#   (wys wierszy, w każdym szer znaków)
`;
const PROSTOKAT = `wys = int(input("Wysokość: "))
szer = int(input("Szerokość: "))
for w in range(wys):
    for k in range(szer):
        print("#", end="")
    print()
`;

const TABLICZKA_START = `n = int(input("Do ilu? "))
for a in range(1, n + 1):
    # ← tu: wewnętrzna pętla po b od 1 do n,
    #   która wypisuje a * b w jednym wierszu (end=" ")
    print()
`;
const TABLICZKA = `n = int(input("Do ilu? "))
for a in range(1, n + 1):
    for b in range(1, n + 1):
        print(a * b, end=" ")
    print()
`;

export default {
 id:'67',grade:1,order:29,title:'Instrukcje iteracyjne zagnieżdżone w języku Python',
 subtitle:'Terminarz turnieju „każdy z każdym”, tabliczka mnożenia i wzorki w terminalu: pętla w pętli robi całą tabelę jednym ruchem.',
 topic:'Pętla w pętli: wiersze i kolumny, end="", licznik wykonań, pary meczów',icon:'table',tags:['pętla w pętli','wzorki z *','turniej'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.1 (rozkład problemu na wiersze i kolumny), I.3 (sprawdzanie poprawności dla przykładowych danych, liczenie wykonań), II.1 (zagnieżdżone pętle for, wejście/wyjście), II.2 (Python w przeglądarce)',
 format:{
  name:'Poziomy do zaliczenia: kratka → schody → turniej → tabliczka',
  student:'Każdy poziom to jeden program. Najpierw zgadujesz, co narysuje gotowy kod, potem śledzisz tabliczkę krok po kroku, układasz schody z gwiazdek, naprawiasz terminarz turnieju i piszesz dwa własne programy. Turniej odblokuje się po układance, a tabliczka — po prostokącie.',
  teacher:'Mastery learning: turniej odblokowuje się po układance, a tabliczka po prostokącie; każde zadanie ma testy, podpowiedzi i — po dwóch nieudanych próbach — rozwiązanie wzorcowe za ¼ punktów, więc nikt nie utknie na amen. Przykład rozwiązany na start: kratka 3 × 4 i śledzenie tabliczki pokazują regułę „zewnętrzna pętla = wiersze, wewnętrzna = kolumny”. UDL: ten sam pomysł w trzech postaciach — rysunek z gwiazdek, tabela zmiennych w śledzeniu i liczba (licznik wykonań); kto potrzebuje, rysuje kratkę na kartce. Twoja rola: przy każdym zadaniu pytaj „ile razy wykona się wewnętrzna pętla?”, zanim uczeń kliknie „Uruchom”.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie para przy turnieju (etap 4): jedna osoba rozpisuje mecze na kartce, druga porównuje z wynikiem programu — kod każdy poprawia u siebie.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'UDL',url:'https://metodyka.covepolska.pl/metoda-udl.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Przewiduję, co narysuje pętla w pętli, i liczę, ile razy wykona się wewnętrzna pętla (wiersze × kolumny).','Używam print(…, end="") i pustego print(), żeby pisać w jednym wierszu i przechodzić do nowego.','Naprawiam terminarz turnieju, żeby każda para grała dokładnie raz (range(a + 1, …)).','Piszę pętlę w pętli: prostokąt ze znaków i tabliczkę mnożenia.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor do śledzenia tabliczki (etap 2).','Kartka w kratkę (opcjonalnie) — do rozpisania kratki i meczów turnieju.'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: kratka — 3 wiersze po 4 gwiazdki; tabliczka 3 × 3 — 2 x 3 = 6, licznik 9, przy range(1, 11) w środku 30 linii; schody — 1, 2, 3, 4 gwiazdki; turniej — 3 drużyny: 3 mecze, 4: 6, 5: 10, 8 osób: 28 meczów; tabliczka n = 10 — 100 wykonań print.',
  summary:'Uczeń przewiduje i śledzi pętlę w pętli, układa schody, naprawia turniej i pisze prostokąt oraz tabliczkę. Karta wyniku: maks. 25 pkt. Pytanie na wyjście: ile razy wykona się wewnętrzna pętla przy 5 wierszach i 7 kolumnach?'
 },
 sections:[
  {id:'start',label:'Start',title:'Turniej FIFA w klasie: ile meczów?',grouping:'class',
   intro:'Czterech kumpli gra turniej „każdy z każdym”. Ile meczów trzeba rozegrać? A przy całej klasie? Rozpisanie tego ręcznie zajmie przerwę — program zrobi to w ułamku sekundy. Najpierw dwa pytania z lekcji o pętli for, bez notatek.',
   reading:{title:'Pętla w pętli = wiersze i kolumny',paragraphs:['Tabela ma wiersze, a w każdym wierszu kilka kolumn. Zewnętrzna pętla przechodzi po wierszach, a wewnętrzna — po kolumnach w jednym wierszu.','Wewnętrzna pętla wykonuje się od początku w KAŻDYM obrocie zewnętrznej. 3 wiersze × 4 kolumny = 12 wykonań linii w środku.']},
   ...note(5,'Hak: zapytaj, ile meczów ma turniej „każdy z każdym” dla 4 osób — niech zgadną (6). Dwa pytania powtórkowe z lekcji o pętli for (temat 28) — samodzielnie, bez notatek. Omów to, które sprawiło więcej kłopotu.','Ile liczb daje range(1, 4), a ile range(4)?','range(1, 4) daje 3 liczby: 1, 2, 3. range(4) daje 4 liczby: 0, 1, 2, 3 — zaczyna od 0.','Uczniowie myślą, że range(4) zaczyna się od 1.','Zapytaj: ile meczów ma turniej dla 5 osób? (10).'),
   activities:[
    choice('nl-r1','Powtórka z lekcji o pętli for: co wypisze for i in range(1, 4): print(i)?',['1, 2, 3 — każda liczba w osobnej linii','1, 2, 3, 4','0, 1, 2, 3','Tylko 4'],[0],'range(1, 4) zaczyna od 1 i kończy PRZED 4. Każdy print to nowa linia.','Druga liczba w range nie wchodzi do wyniku.'),
    choice('nl-r2','Powtórka: kalkulator średniej ocen zerował sumę w każdym obrocie. Gdzie powinno stać suma = 0?',['Przed pętlą, bez wcięcia','W pętli, pod for','Po pętli','Nigdzie — suma sama zaczyna od 0'],[0],'Start sumy ustawiasz raz, przed pętlą. W pętli tylko dodajesz, a po pętli wypisujesz wynik.','Ile razy suma ma się wyzerować — raz czy w każdym obrocie?')
   ]},
  {id:'predict',label:'Przewiduj',title:'Kratka z gwiazdek i tabliczka krok po kroku',grouping:'solo',
   intro:'Najpierw zgadnij, co narysuje program, i zaznacz, jak jesteś pewna/pewny. Potem prześledź tabliczkę mnożenia 3 × 3 i zobacz, jak zmieniają się a, b i licznik.',
   reading:{title:'print w jednym wierszu: end=""',paragraphs:['Zwykły print kończy linię. print("*", end="") wypisuje gwiazdkę i NIE przechodzi do nowej linii — następna gwiazdka stanie obok.','Pusty print() po wewnętrznej pętli kończy wiersz. Ma mniejsze wcięcie niż wewnętrzna pętla, więc wykona się raz na wiersz, a nie raz na gwiazdkę.'],example:{question:'Przykład rozwiązany: ile gwiazdek narysuje kratka z range(3) i range(4)?',answer:'Zewnętrzna pętla: 3 obroty (wiersze). W każdym wewnętrzna: 4 gwiazdki. Razem 3 · 4 = 12 gwiazdek w 3 wierszach.'}},
   ...note(10,'Najpierw wszyscy wpisują przewidywanie, potem uruchamiają. Przy śledzeniu pokaż na projektorze moment, gdy b wraca do 1, a a rośnie do 2 — to klucz do zrozumienia pętli w pętli. Zapytaj: „ile razy wewnętrzna pętla zaczęła się od nowa?” (3).','Dlaczego b zaczyna od 1 za każdym razem, gdy a rośnie?','Bo wewnętrzna pętla startuje od nowa w każdym obrocie zewnętrznej — range(1, 4) liczy od początku.','Przewidywanie 12 gwiazdek w jednej linii (pominięcie print()) albo 4 wierszy po 3 (zamiana wierszy z kolumnami).','W śledzeniu „Zmień kod”: range(1, 4) w środku zamień na range(1, 6). Ile razy wykona się wewnętrzna pętla?'),
   activities:[
    {type:'pythonLab',id:'nl-predict',mode:'predict',points:2,file:'kratka.py',title:'Kratka z gwiazdek',
     prompt:'Co narysuje ten program? Wpisz gwiazdki linia po linii.',
     code:KRATKA,predictRows:3,
     explain:'Zewnętrzna pętla: 3 wiersze. Wewnętrzna: 4 gwiazdki obok siebie (`end=""`). Pusty `print()` kończy wiersz. Wynik: 3 wiersze po 4 gwiazdki.'},
    {type:'pythonLab',id:'nl-trace',mode:'trace',points:0,file:'tabliczka.py',title:'Tabliczka 3 × 3 krok po kroku',
     prompt:'Klikaj „Krok dalej”. Obserwuj: `b` przebiega 1, 2, 3, potem `a` rośnie, a `b` znów zaczyna od 1.',
     code:TABLICZKA_3,
     questions:[
      {q:'Jaką linię wypisze program, gdy a = 2 i b = 3?',answer:'2 x 3 = 6',accept:['2x3=6','6'],inputLabel:'Linia z konsoli',explain:'print(a, "x", b, "=", a * b) → „2 x 3 = 6”. To szósta linia, bo przed nią są 3 linie dla a = 1 i 2 dla a = 2.',hint:'Idź krokami, aż w tabeli zmiennych będzie a = 2 i b = 3, i spójrz na konsolę.'},
      {q:'Ile wynosi licznik na końcu programu?',answer:'9',inputLabel:'licznik =',explain:'3 obroty zewnętrznej × 3 obroty wewnętrznej = 9 wykonań linii w środku.',hint:'Kliknij „Koniec” i odczytaj licznik albo ostatnią linię konsoli.'},
      {q:'Gdyby zewnętrzna pętla miała range(1, 4), a wewnętrzna range(1, 11), ile linii z mnożeniem wypisze program?',options:['30','13','14','11'],correct:[0],explain:'3 wiersze × 10 kolumn = 30. Przy pętli w pętli liczby obrotów się MNOŻY, a nie dodaje.',hint:'Ile obrotów ma każda pętla? Pomnóż.'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Schody z gwiazdek',grouping:'solo',
   intro:'Ułóż program, który rysuje schody: w 1. wierszu jedna gwiazdka, w 2. — dwie, i tak do 4. Sztuczka: wewnętrzna pętla zależy od numeru wiersza.',
   reading:{title:'Wewnętrzna pętla może zależeć od zewnętrznej',paragraphs:['W kratce każdy wiersz miał tyle samo gwiazdek. W schodach wiersz nr 3 ma 3 gwiazdki — dlatego wewnętrzna pętla to range(wiersz).','Tak samo działa turniej: drużyna 1 gra z 2, 3, 4; drużyna 2 już tylko z 3 i 4 — każdy kolejny „wiersz” jest krótszy.']},
   ...note(7,'Samodzielnie. Dwie pułapki: print("*") bez end="" (gwiazdki w słupku) i for i in range(4): (kratka zamiast schodów). Jeśli ktoś utknie na wcięciach: pusty print() ma tyle spacji co wewnętrzny for — należy do wiersza, nie do gwiazdki.','Dlaczego wewnętrzna pętla to range(wiersz), a nie range(4)?','Bo liczba gwiazdek w wierszu równa się numerowi wiersza: 1, 2, 3, 4. range(4) dałoby zawsze 4 gwiazdki — kratkę.','print() z wcięciem 8 spacji (każda gwiazdka w nowej linii) albo 0 spacji (jedna długa linia).','Zmień schody, żeby szły w dół: od 4 gwiazdek do 1 (range(wysokosc, 0, -1)).'),
   activities:[
    {type:'pythonLab',id:'nl-parsons',mode:'parsons',points:4,file:'schody.py',title:'Układanka: schody z gwiazdek',
     prompt:'Ułóż program z linii. Oczekiwany wynik:\n\n`*`\n\n`**`\n\n`***`\n\n`****`\n\na pod spodem „Schody gotowe!”. ↑ ↓ zmieniają kolejność, ← → wcięcie. Dwie linie to pułapki.',
     solution:SCHODY,distractors:['for i in range(4):','print("*")'],
     tests:[{output:'*\n**\n***\n****\nSchody gotowe!',label:'Schody 1–4 i napis'}],
     hints:['Kolejność: `wysokosc = 4`, zewnętrzny `for wiersz…`, wewnętrzny `for i in range(wiersz):`, potem dwa print, na końcu „Schody gotowe!”.','`print("*", end="")` ma 2 poziomy wcięcia, pusty `print()` — 1 poziom (jak wewnętrzny for), „Schody gotowe!” — 0.']}
   ]},
  {id:'fix',label:'Napraw',title:'Terminarz turnieju: każdy z każdym, ale raz',grouping:'solo',
   intro:'Program ma wypisać wszystkie mecze turnieju „każdy z każdym”. Coś jest nie tak: drużyna gra sama ze sobą, a każdy mecz pojawia się dwa razy. Odblokuje się po układance.',
   reading:{title:'Pary bez powtórek',paragraphs:['Mecz „1 vs 2” to ten sam mecz co „2 vs 1”, a „1 vs 1” nie ma sensu. Wystarczy, że druga drużyna ma zawsze WIĘKSZY numer niż pierwsza.','Dlatego wewnętrzna pętla zaczyna od a + 1: dla a = 1 → b = 2, 3, 4; dla a = 2 → b = 3, 4; dla a = 3 → b = 4. Razem 3 + 2 + 1 = 6 meczów.']},
   ...note(9,'Samodzielnie albo opcjonalnie w parze z kartką (jedna osoba rozpisuje mecze, druga porównuje z programem). Niech uczniowie najpierw uruchomią kod startowy i policzą błędne mecze — 3 drużyny dają 9 linii zamiast 3. Pytanie do klasy: „które linie są zbędne?”.','Dlaczego wewnętrzna pętla zaczyna się od a + 1?','Żeby druga drużyna miała zawsze większy numer: nie ma meczów z samym sobą ani powtórek odwróconych (2 vs 1).','range(a, n + 1) — zostają mecze „1 vs 1”; range(a + 1, n) — gubi ostatnią drużynę.','Dopisz numer kolejki przed każdym meczem, np. „Mecz 1: Drużyna 1 vs Drużyna 2” (użyj zmiennej mecze).'),
   activities:[
    {type:'pythonLab',id:'nl-fix-tour',mode:'code',points:4,file:'turniej.py',title:'Napraw: terminarz turnieju',input:true,stdin:['3'],requires:'nl-parsons',requiresTitle:'Układanka: schody z gwiazdek',
     prompt:'Dla 3 drużyn powinny być 3 mecze: 1 vs 2, 1 vs 3, 2 vs 3. Program wypisuje 9. Zmień jedną liczbę w jednej linii i kliknij „Sprawdź”.',
     starter:TURNIEJ_BUG,solution:TURNIEJ,
     tests:[
      {stdin:['3'],output:'Ile drużyn? 3\nDrużyna 1 vs Drużyna 2\nDrużyna 1 vs Drużyna 3\nDrużyna 2 vs Drużyna 3\nLiczba meczów: 3',label:'3 drużyny'},
      {stdin:['4'],contains:['Drużyna 3 vs Drużyna 4','Liczba meczów: 6'],label:'4 drużyny'},
      {stdin:['5'],contains:['Liczba meczów: 10'],label:'5 drużyn'},
      {stdin:['2'],output:'Ile drużyn? 2\nDrużyna 1 vs Drużyna 2\nLiczba meczów: 1',label:'2 drużyny'}
     ],
     hints:['Uruchom dla 3 drużyn i zobacz, które linie są złe: „1 vs 1”, „2 vs 1”… Druga drużyna powinna mieć większy numer niż pierwsza.','Wewnętrzna pętla ma zaczynać od numeru o 1 większego niż a: `for b in range(a + 1, n + 1):`.'],
     questions:[
      {q:'Turniej FIFA w klasie: 8 osób, każdy z każdym raz. Ile meczów? (sprawdź programem)',answer:'28',inputLabel:'Liczba meczów',explain:'7 + 6 + 5 + 4 + 3 + 2 + 1 = 28. Przy 16 osobach byłoby już 120 meczów — dlatego duże turnieje mają grupy.',hint:'Wpisz 8 w pole „Dane wejściowe” i uruchom.'}
     ],
     summary:'Terminarz turnieju bez powtórek: {passed}/{total} testów',successText:'Każda para gra dokładnie raz.'}
   ]},
  {id:'write',label:'Napisz',title:'Twoje programy: prostokąt i tabliczka',grouping:'solo',
   intro:'Dwa ostatnie poziomy. Najpierw prostokąt ze znaków # o podanych wymiarach. Potem (odblokuje się) tabliczka mnożenia do n — ten sam schemat liczy cennik: liczba sztuk × cena.',
   reading:{title:'Schemat do skopiowania w głowie',paragraphs:['for wiersz … : → for kolumna … : → print(coś, end="") → print() pod wewnętrznym for. Zmieniasz tylko range i to, co wypisujesz.','W tabliczce wewnętrzny print wypisuje a * b i spację (end=" "). Spacja na końcu wiersza nie przeszkadza testom.']},
   ...note(9,'Samodzielnie. Prostokąt to szybki sukces, tabliczka wymaga dopisania wewnętrznej pętli w gotowy szkielet. Jeśli ktoś napisze print("#" * szer) — pochwal pomysł, ale poproś o wersję z pętlą (to ćwiczymy). Kto skończy: odpowiada na pytanie o 100 wykonań i rysuje „szachownicę” z # i . (bonus, bez punktów).','Ile razy wykona się wewnętrzny print w tabliczce do 10?','100 razy: 10 wierszy × 10 kolumn.','Pusty print() z wcięciem 8 (każda liczba w nowej linii) albo brak end=" " (liczby w słupku).','Szachownica: if (w + k) % 2 == 0: print("#", end="") else: print(".", end="").'),
   activities:[
    {type:'pythonLab',id:'nl-rect',mode:'code',points:3,file:'prostokat.py',title:'Prostokąt ze znaków #',input:true,stdin:['3','5'],
     prompt:'Program pyta o wysokość i szerokość. Dopisz pętlę w pętli, która narysuje prostokąt ze znaków `#`. Dla 2 i 5: dwa wiersze po 5 znaków.',
     starter:PROSTOKAT_START,solution:PROSTOKAT,
     tests:[
      {stdin:['2','5'],output:'Wysokość: 2\nSzerokość: 5\n#####\n#####',label:'2 × 5'},
      {stdin:['3','1'],output:'Wysokość: 3\nSzerokość: 1\n#\n#\n#',label:'3 × 1'},
      {stdin:['1','4'],output:'Wysokość: 1\nSzerokość: 4\n####',label:'1 × 4'}
     ],
     sourceChecks:[{pattern:'^\\s+for\\b',label:'Kod ma pętlę w pętli',hint:'Wersja z "#" * szer też działa — brawo za pomysł! Ale tu ćwiczymy pętlę w pętli: wewnętrzny for z wcięciem 4 spacji.'}],
     hints:['Zewnętrzna pętla po wierszach: `for w in range(wys):`. Wewnętrzna (wcięcie 4): `for k in range(szer):`.','W środku (wcięcie 8): `print("#", end="")`. Pod wewnętrznym for (wcięcie 4): pusty `print()`.'],
     successText:'Prostokąt rysuje się dla dowolnych wymiarów.'},
    {type:'pythonLab',id:'nl-table',mode:'code',points:4,file:'tabliczka_n.py',title:'Tabliczka mnożenia do n',input:true,stdin:['5'],requires:'nl-rect',requiresTitle:'Prostokąt ze znaków #',
     prompt:'Szkielet jest gotowy. Dopisz wewnętrzną pętlę po `b` od 1 do n, która wypisze `a * b` w jednym wierszu, oddzielone spacjami. Dla n = 3: `1 2 3`, `2 4 6`, `3 6 9`.',
     starter:TABLICZKA_START,solution:TABLICZKA,
     tests:[
      {stdin:['3'],output:'Do ilu? 3\n1 2 3\n2 4 6\n3 6 9',label:'Do 3'},
      {stdin:['5'],contains:['5 10 15 20 25'],label:'Do 5: ostatni wiersz'},
      {stdin:['1'],output:'Do ilu? 1\n1',label:'Do 1'}
     ],
     hints:['Pod `for a…` (wcięcie 4) dopisz: `for b in range(1, n + 1):`.','W wewnętrznej pętli (wcięcie 8): `print(a * b, end=" ")`. Pusty `print()` zostaje z wcięciem 4.'],
     questions:[
      {q:'Ile razy wykona się print(a * b, end=" ") dla n = 10?',answer:'100',inputLabel:'Liczba wykonań',explain:'10 wierszy × 10 kolumn = 100. Pętla w pętli mnoży liczbę powtórzeń — przy n = 1000 byłby to już milion.',hint:'Ile obrotów ma zewnętrzna pętla, a ile wewnętrzna? Pomnóż.'}
     ],
     summary:'Tabliczka mnożenia działa: {passed}/{total} testów',successText:'Tabliczka gotowa — ten sam schemat policzy każdy cennik.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: pętla w pętli opanowana?',grouping:'solo',
   intro:'Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(5,'Pytanie końcowe: mnożenie liczby obrotów. Zbierz przykłady z życia, gdzie jest „tabela” (plan lekcji: dni × godziny, kino: rzędy × miejsca, gra: plansza). Zapowiedź: na następnej lekcji pętla while — PIN z 3 próbami i gra w zgadywanie.','Ile razy wykona się wewnętrzna pętla przy 5 wierszach i 7 kolumnach?','35 razy — 5 · 7.','Dodawanie zamiast mnożenia (12).','Ile miejsc ma sala kinowa z 12 rzędami po 18 miejsc? Napisz pętlę, która to policzy licznikiem.'),
   activities:[
    choice('nl-exit','Kino ma 5 rzędów po 7 miejsc. Program wypisuje każde miejsce pętlą w pętli. Ile razy wykona się wewnętrzna pętla (linia w środku)?',['35','12','7','5'],[0],'Zewnętrzna pętla: 5 rzędów. W każdym wewnętrzna: 7 miejsc. 5 · 7 = 35.','Przy pętli w pętli liczby obrotów się mnoży.'),
    {type:'resultCard',id:'result',title:'Pętla w pętli — wynik',sources:['nl-r1','nl-r2','nl-predict','nl-trace','nl-parsons','nl-fix-tour','nl-rect','nl-table','nl-exit'],badges:[
     {min:0,name:'Pierwszy wiersz',text:'Gwiazdki jeszcze się rozjeżdżają. Wróć do kratki: zewnętrzna pętla — wiersze, wewnętrzna — kolumny.'},
     {min:0.5,name:'Organizator turnieju',text:'Mecze rozpisane, schody stoją. Jeszcze tabliczka i żadna tabela Cię nie zaskoczy.'},
     {min:0.85,name:'Architekt siatki',text:'Wzorki, turniej, tabliczka — wszystko jednym ruchem. Rozpiszesz terminarz każdej ligi.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz zbudować pętlę w pętli: zewnętrzna przechodzi po wierszach, wewnętrzna po kolumnach. Liczysz wykonania (wiersze × kolumny), piszesz w jednym wierszu przez end="", a pary bez powtórek robisz przez range(a + 1, …).'
};
