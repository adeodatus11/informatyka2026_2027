import {note, choice} from '../schema.js';

const SORTUJ = `def sortuj(lista):
    n = len(lista)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
    return lista
`;

export default {
 id:'19',grade:2,title:'Programowanie algorytmów porządkowania metodą bąbelkową',
 subtitle:'Ranking graczy, ceny od najtańszej, tabela wyników — napiszesz sortowanie, które robi to za Ciebie.',
 topic:'Sortowanie bąbelkowe w Pythonie',icon:'sort',tags:['for w for','zamiana','flaga'],duration:45,
 curriculum:'Informatyka – liceum/technikum · algorytmy porządkowania (sortowanie bąbelkowe), programowanie rozwiązań w wybranym języku (Python)',
 format:{
  name:'Modelowanie z śledzeniem + układanka + poziomy (mastery)',
  student:'Najpierw razem śledzimy krok po kroku, jak sortowanie bąbelkowe przestawia liczby. Potem układasz ten kod z klocków, dopisujesz brakującą zamianę i przechodzisz na wyższe poziomy: ranking graczy malejąco, a dla najszybszych — sortowanie z flagą. Efekt: działający ranking i punkty za każdy poziom.',
  teacher:'Nauczanie jawne: w etapie 2 modelujesz na projektorze — klikasz „Krok dalej” i mówisz na głos, co porównuje komputer (i, j, lista[j] i lista[j + 1]). Uczniowie przewidują listę po 1. przejściu, zanim ją zobaczą. Potem praca z rosnącą samodzielnością: układanka (cały kod podany), dopisanie jednej linii (zamiana), modyfikacja (malejąco + licznik). Poziomy odblokowują się dopiero po zaliczeniu poprzedniego — to mastery learning. Twoja rola: krążysz i pytasz „który test nie przechodzi i dlaczego?”, zamiast poprawiać kod.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Można naradzać się z sąsiadem przy układance. Poziom 3 jest dla chętnych — nie wlicza się do oceny.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:['Śledzę sortowanie bąbelkowe krok po kroku i przewiduję, jak wygląda lista po każdym przejściu.','Zamieniam dwie wartości miejscami jedną linią: a, b = b, a.','Piszę sortowanie bąbelkowe w Pythonie i przerabiam je na sortowanie malejące z licznikiem zamian.','Wyjaśniam, po co jest pętla w pętli i skąd bierze się n - 1 - i.'],
 materials:['Komputer z aktualną przeglądarką (Chrome, Edge lub Firefox) — jeden na osobę. Python działa w przeglądarce, bez instalacji.','Projektor do modelowania w etapie 2','Opcjonalnie: 5 kartek z liczbami 5, 1, 4, 2, 8 do pokazania zamian „na żywo”'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz lekcję na komputerze z projektorem i wejdź do etapu 2 — przeglądarka pobierze Pythona (ok. 13 MB). Poproś uczniów, żeby od razu po pytaniach powtórkowych weszli do etapu 2. Klucz: lista po 1. przejściu [1, 4, 2, 5, 8], 3 zamiany; zamiana: ceny[j], ceny[j + 1] = ceny[j + 1], ceny[j]; ranking malejąco: znak < i zamiany += 1; flaga: 9 porównań zamiast 15 na liście [1, 2, 3, 4, 6, 5]. Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe; kto utknie, może je odsłonić po podpowiedziach (za ¼ punktów).',
  summary:'Uczeń przewiduje wynik przejścia bąbelkowego, układa algorytm z klocków, dopisuje zamianę a, b = b, a i przerabia sortowanie na malejące z licznikiem zamian. Na karcie wyniku: pytania powtórkowe, śledzenie, układanka, zamiana i ranking (maks. 17 pkt). Pytanie na wyjście: ile porównań wykona sortowanie bąbelkowe dla 10 liczb i dlaczego?'
 },
 sections:[
  {id:'start',label:'Start',title:'Kto jest na szczycie rankingu?',grouping:'class',
   intro:'Ranking w grze, ceny od najtańszej, playlista od najnowszej — za każdym sortowaniem stoi algorytm. Na poprzedniej lekcji sortowałeś karty ręcznie. Dziś napiszesz sortowanie bąbelkowe w Pythonie. Najpierw dwa pytania bez notatek.',
   ...note(4,'Hak: pokaż (albo opisz) tabelę wyników gry, w której nowy wynik trafia od razu na właściwe miejsce — „ktoś to zaprogramował”. Dwa pytania powtórkowe z lekcji o algorytmach porządkowania, bez notatek. Omów tylko błędne odpowiedzi. Potem wszyscy wchodzą do etapu 2 — Python ładuje się w tle.','Dlaczego po pierwszym przejściu sortowania bąbelkowego największa liczba jest na końcu?','Bo przy każdym porównaniu większa liczba idzie w prawo — największa „wypływa” jak bąbelek aż na koniec listy.','Uczniowie liczą porównania jako n zamiast n - 1 (6 liczb to 5 par sąsiadów).','Zapytaj, gdzie sami sortują dane (ceny w sklepie internetowym, oceny w dzienniku, filtr „od najnowszych”).'),
   activities:[
    choice('cb-r1','Sortujesz bąbelkowo 6 liczb. Ile porównań wykona pierwsze przejście?',['5','6','15','36'],[0],'Porównujesz sąsiednie pary: 1.–2., 2.–3., 3.–4., 4.–5. i 5.–6. liczba — to 5 porównań. Ogólnie: n - 1.','Policz pary sąsiadów, a nie same liczby.'),
    choice('cb-r2','Co na pewno wiesz po pierwszym przejściu sortowania bąbelkowego (rosnąco)?',['Największa liczba jest na końcu listy','Najmniejsza liczba jest na początku','Lista jest już posortowana','Połowa listy jest posortowana'],[0],'Największa liczba wygrywa każde porównanie, więc przesuwa się w prawo aż na koniec. O najmniejszej nic jeszcze nie wiadomo — mogła przesunąć się tylko o jedno miejsce.','Pomyśl, która liczba wygrywa każde porównanie.')
   ]},
  {id:'model',label:'Modelowanie',title:'Bąbelki krok po kroku',grouping:'class',
   intro:'Nauczyciel pokaże na projektorze, jak komputer sortuje listę [5, 1, 4, 2, 8]. Zanim zobaczysz wynik, odpowiedz na pierwsze pytanie — przewidywanie. Potem przejdź kroki u siebie. Niebieskie pola na liście to para porównywana w tej chwili: j i j + 1.',
   reading:{title:'Pętla w pętli',paragraphs:[
    'Zewnętrzna pętla for i in range(n - 1) liczy przejścia. Wewnętrzna for j in range(n - 1 - i) idzie po parach sąsiadów: lista[j] i lista[j + 1]. Gdy lewa liczba jest większa od prawej, zamieniamy je miejscami.',
    'Po każdym przejściu kolejna największa liczba stoi już na swoim miejscu na końcu. Dlatego wewnętrzna pętla z każdym przejściem jest krótsza o jeden: n - 1 - i. Dla 5 liczb to 4 + 3 + 2 + 1 = 10 porównań.'
   ],example:{question:'Przykład rozwiązany: jedno przejście po [3, 1, 2].',answer:'j = 0: 3 > 1, zamiana → [1, 3, 2]. j = 1: 3 > 2, zamiana → [1, 2, 3]. Największa (3) jest na końcu.'}},
   ...note(8,'Modelowanie na projektorze: najpierw uczniowie zaznaczają odpowiedź na pytanie 1 (przewidywanie) — bez klikania kroków. Potem klikasz „Krok dalej” i mówisz na głos: „j = 0, porównuję 5 i 1, 5 jest większe, zamieniam”. Zatrzymaj się, gdy i zmieni się z 0 na 1 — sprawdźcie przewidywanie. Następnie uczniowie przechodzą kroki sami i odpowiadają na pytania 2 i 3.','Dlaczego w drugim przejściu nie porównujemy już 5 i 8?','Bo po pierwszym przejściu 8 (największa) jest na końcu na pewno — porównywanie jej to strata czasu. Stąd n - 1 - i.','Uczniowie myślą, że w jednym przejściu liczba może przesunąć się w lewo o kilka miejsc. W lewo przesuwa się najwyżej o jedno miejsce na przejście.','Zmień listę w kodzie (przycisk pod programem) na [8, 5, 4, 2, 1] — ile teraz jest zamian? (10 — każde porównanie kończy się zamianą).'),
   activities:[
    {type:'pythonLab',id:'cb-trace',mode:'trace',points:0,file:'babelki.py',title:'Sortowanie bąbelkowe [5, 1, 4, 2, 8]',
     prompt:'Odpowiedz na pytanie 1, zanim zaczniesz klikać. Potem przechodź kroki: podświetlona linia ➜ wykona się teraz, a tabela pokazuje zmienne w tej chwili.',
     code:'lista = [5, 1, 4, 2, 8]\nn = len(lista)\nfor i in range(n - 1):             # przejścia\n    for j in range(n - 1 - i):     # pary sąsiadów\n        if lista[j] > lista[j + 1]:\n            lista[j], lista[j + 1] = lista[j + 1], lista[j]\nprint(lista)\n',
     listVars:['lista'],pointers:[{var:'j',span:2}],
     questions:[
      {q:'Przewidź, zanim klikniesz: jak wygląda lista po 1. przejściu (gdy i zmienia się z 0 na 1)?',options:['`[1, 4, 2, 5, 8]`','`[1, 2, 4, 5, 8]`','`[1, 5, 4, 2, 8]`','`[5, 4, 2, 1, 8]`'],correct:[0],explain:'5 zamienia się kolejno z 1, 4 i 2, a przy 8 zostaje: [1, 4, 2, 5, 8]. Lista nie jest jeszcze posortowana — 4 i 2 stoją źle.',hint:'Przejdź w myślach 4 porównania: 5 z 1, potem 5 z 4, 5 z 2, 5 z 8. Sprawdź krokami.'},
      {q:'Ile zamian wykonało 1. przejście?',answer:'3',inputLabel:'Liczba zamian',explain:'Trzy zamiany: 5↔1, 5↔4, 5↔2. Porównanie 5 z 8 nie skończyło się zamianą.',hint:'Policz kroki, w których wykonała się linia 6 (zamiana), zanim i zmieniło się na 1.'},
      {q:'Dlaczego wewnętrzna pętla to range(n - 1 - i), a nie range(n - 1)?',options:['Bo ostatnie i liczb stoi już na swoich miejscach — nie trzeba ich porównywać','Bo Python nie pozwala napisać range(n - 1)','Żeby lista była posortowana malejąco','Żeby pętla wykonała się zawsze tyle samo razy'],correct:[0],explain:'Po każdym przejściu kolejna największa liczba jest na końcu. Z range(n - 1) program też by działał, ale robiłby niepotrzebne porównania.',hint:'Co wiemy o końcu listy po każdym przejściu?'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Ułóż sortowanie bąbelkowe',grouping:'solo',
   intro:'Cały kod już znasz — teraz ułóż go w funkcję sortuj(lista). Pilnuj wcięć: pętla w pętli, a w środku if. Jedna linia to pułapka.',
   ...note(8,'Uczniowie pracują samodzielnie, mogą się naradzać z sąsiadem. Gdy ktoś ma IndentationError, pokaż mu komunikat po polsku i zapytaj: „która linia kończy się dwukropkiem?”. Pułapka: for j in range(n) — powoduje IndexError, bo lista[j + 1] wychodzi poza listę.','Która linia jest pułapką i jaki błąd spowoduje?','for j in range(n): — dla ostatniego j program sięga po lista[j + 1], którego nie ma: IndexError (indeks poza zakresem).','Return w złym miejscu (wcięty w pętli — funkcja kończy się po pierwszym przejściu). Zamiana z wcięciem na poziomie if zamiast pod nim.','Zapytaj: co zwróci sortuj([]) i sortuj([7])? (pustą listę i [7] — pętle nie wykonają się ani razu).'),
   activities:[
    {type:'pythonLab',id:'cb-parsons',mode:'parsons',points:4,file:'sortuj.py',title:'Układanka: sortuj(lista)',
     prompt:'Ułóż funkcję sortującą rosnąco. Klikaj linie, żeby dodać je do programu; ↑ ↓ zmieniają kolejność, ← → wcięcie. Testy sprawdzą też listę pustą i jednoelementową.',
     solution:SORTUJ,distractors:['for j in range(n):'],
     tests:[
      {call:'sortuj([5, 1, 4, 2, 8])',expected:'[1, 2, 4, 5, 8]'},
      {call:'sortuj([3, 2, 1])',expected:'[1, 2, 3]'},
      {call:'sortuj([9, -3, 0])',expected:'[-3, 0, 9]',label:'Liczby ujemne'},
      {call:'sortuj([2, 2, 1])',expected:'[1, 2, 2]',label:'Powtórzone liczby'},
      {call:'sortuj([])',expected:'[]',label:'Pusta lista'},
      {call:'sortuj([7])',expected:'[7]',label:'Jedna liczba'}
     ],
     hints:['Zacznij od `def sortuj(lista):`, potem `n = len(lista)`. Obie pętle for są w środku funkcji.','Kolejność od zewnątrz: for i → for j → if → zamiana. Każda kolejna linia ma o jeden poziom wcięcia więcej.','`return lista` ma 1 poziom wcięcia — wykonuje się po obu pętlach, na samym końcu.']}
   ]},
  {id:'swap',label:'Zamiana',title:'Brakująca linia: zamiana miejscami',grouping:'solo',
   intro:'Sklep internetowy ma posortować ceny od najtańszej, ale w kodzie brakuje najważniejszej linii — zamiany. Najpierw krótkie przewidywanie: dlaczego zamiany nie robi się dwiema liniami?',
   reading:{title:'Zamiana w jednej linii',paragraphs:[
    'Żeby zamienić zawartość dwóch szklanek, potrzebujesz trzeciej, pustej. W wielu językach programowania robi się tak samo: pom = a, a = b, b = pom.',
    'W Pythonie wystarczy jedna linia: a, b = b, a. Python najpierw oblicza prawą stronę (stare wartości b i a), a dopiero potem wpisuje obie naraz. Dla listy: lista[j], lista[j + 1] = lista[j + 1], lista[j].'
   ]},
   ...note(7,'Najpierw przewidywanie (1 minuta) — większość uczniów wpisze „9 5”. Wynik „9 9” to dobry moment na pytanie: „gdzie zniknęła piątka?”. Potem zadanie z cenami. Chodź po sali i sprawdzaj wcięcie linii zamiany (tyle samo co pass).','Dlaczego a = b, a potem b = a nie zamienia wartości?','Bo po a = b stara wartość a (5) przepada — obie zmienne mają 9. Potrzebna jest zmienna pomocnicza albo zamiana jednoczesna a, b = b, a.','Zostawienie pass obok nowej linii (działa, ale jest zbędne), złe wcięcie zamiany, zamiana ceny[i] zamiast ceny[j].','Zapytaj: jak posortować ceny od najdroższej? (zmienić > na <) — to będzie następny poziom.'),
   activities:[
    {type:'pythonLab',id:'cb-predict',mode:'predict',points:1,file:'zamiana.py',title:'Co wypisze ta „zamiana”?',
     prompt:'Przewidź wynik, potem uruchom.',
     code:'a = 5\nb = 9\na = b\nb = a\nprint(a, b)\n',predictRows:1,
     explain:'Wynik to `9 9`. Po `a = b` stara wartość a (5) przepadła, więc `b = a` wpisało do b znowu 9. Poprawna zamiana w Pythonie: `a, b = b, a`.'},
    {type:'pythonLab',id:'cb-swap',mode:'code',points:3,file:'ceny.py',title:'Ceny od najtańszej',
     prompt:'Zamień `pass` na linię, która zamienia miejscami `ceny[j]` i `ceny[j + 1]`. Uruchom, a potem sprawdź testami.',
     starter:'def sortuj_ceny(ceny):\n    n = len(ceny)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if ceny[j] > ceny[j + 1]:\n                pass  # ← tu zamień miejscami ceny[j] i ceny[j + 1]\n    return ceny\n\n\nprint(sortuj_ceny([49.99, 19.99, 89.0, 5.5, 24.5]))\n',
     solution:'def sortuj_ceny(ceny):\n    n = len(ceny)\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if ceny[j] > ceny[j + 1]:\n                ceny[j], ceny[j + 1] = ceny[j + 1], ceny[j]\n    return ceny\n\n\nprint(sortuj_ceny([49.99, 19.99, 89.0, 5.5, 24.5]))\n',
     tests:[
      {call:'sortuj_ceny([49.99, 19.99, 89.0, 5.5, 24.5])',expected:'[5.5, 19.99, 24.5, 49.99, 89.0]',label:'Ceny w sklepie'},
      {call:'sortuj_ceny([3, 1, 2])',expected:'[1, 2, 3]'},
      {call:'sortuj_ceny([10, 10, 1])',expected:'[1, 10, 10]'},
      {call:'sortuj_ceny([1, 2, 3])',expected:'[1, 2, 3]',label:'Już posortowane'}
     ],
     hints:['W Pythonie zamienisz dwie wartości jedną linią: `a, b = b, a`.','Tu zamiast a i b masz `ceny[j]` i `ceny[j + 1]`.','Cała linia: `ceny[j], ceny[j + 1] = ceny[j + 1], ceny[j]` — w miejscu pass, z tym samym wcięciem.']}
   ]},
  {id:'level2',label:'Poziom 2',title:'Poziom 2: ranking graczy',grouping:'solo',
   intro:'Tabela wyników w grze: najlepszy na górze. Przerób sortowanie tak, żeby układało punkty malejąco i liczyło, ile zamian wykonało. Poziom odblokuje się po zaliczeniu cen.',
   reading:{title:'Mała zmiana, inny porządek',paragraphs:[
    'Sortowanie malejące różni się jednym znakiem: zamieniamy, gdy lewa liczba jest MNIEJSZA od prawej (<). Wtedy w prawo „wypływają” małe liczby, a na początku zostają największe.',
    'Licznik to zmienna, która startuje od zera i rośnie o 1 przy każdym zdarzeniu: zamiany = 0 przed pętlami, zamiany += 1 przy każdej zamianie. Funkcja może zwrócić dwie wartości naraz: return punkty, zamiany.'
   ]},
   ...note(8,'Mastery learning: poziom odblokowuje się po zaliczeniu zadania z cenami. Uczniowie, którzy skończyli, pomagają sąsiadom pytaniami, a nie gotowym kodem. Zwróć uwagę na miejsce licznika: musi być wewnątrz if, pod zamianą (liczymy zamiany, nie porównania).','Gdzie dokładnie trzeba wstawić zamiany += 1 i dlaczego?','W bloku if, obok zamiany (to samo wcięcie). Gdyby było poza if, liczyłoby porównania, a nie zamiany.','Licznik ustawiany na 0 wewnątrz pętli (zeruje się co przejście), zamiany += 1 z wcięciem pętli for, zapomnienie o zmianie znaku.','Zapytaj: ile zamian wykona ranking dla listy już posortowanej malejąco? (0) A rosnąco? (najwięcej: n · (n − 1) / 2).'),
   activities:[
    {type:'pythonLab',id:'cb-rank',mode:'code',points:4,file:'ranking.py',title:'Ranking malejąco + licznik zamian',requires:'cb-swap',requiresTitle:'Ceny od najtańszej',
     prompt:'Zmień kod tak, żeby punkty były posortowane od największych, a zmienna `zamiany` liczyła wykonane zamiany. Funkcja zwraca parę: posortowaną listę i liczbę zamian.',
     starter:'def ranking(punkty):\n    n = len(punkty)\n    zamiany = 0\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if punkty[j] > punkty[j + 1]:          # ← zmień tak, żeby sortować malejąco\n                punkty[j], punkty[j + 1] = punkty[j + 1], punkty[j]\n                # ← tu policz zamianę\n    return punkty, zamiany\n\n\nprint(ranking([1200, 3400, 900, 2750, 3400]))\n',
     solution:'def ranking(punkty):\n    n = len(punkty)\n    zamiany = 0\n    for i in range(n - 1):\n        for j in range(n - 1 - i):\n            if punkty[j] < punkty[j + 1]:\n                punkty[j], punkty[j + 1] = punkty[j + 1], punkty[j]\n                zamiany += 1\n    return punkty, zamiany\n\n\nprint(ranking([1200, 3400, 900, 2750, 3400]))\n',
     tests:[
      {call:'ranking([60, 90, 75])',expected:'([90, 75, 60], 2)'},
      {call:'ranking([3, 2, 1])',expected:'([3, 2, 1], 0)',label:'Już malejąco: 0 zamian'},
      {call:'ranking([1, 2, 3])',expected:'([3, 2, 1], 3)',label:'Odwrotnie: 3 zamiany'},
      {call:'ranking([1200, 3400, 900, 2750, 3400])',expected:'([3400, 3400, 2750, 1200, 900], 6)',label:'Wyniki z gry'}
     ],
     hints:['Malejąco: zamieniamy, gdy lewa liczba jest mniejsza — zmień `>` na `<`.','Pod linią zamiany, z tym samym wcięciem, dopisz `zamiany += 1` (to samo co zamiany = zamiany + 1).'],
     summary:'Ranking graczy działa: {passed}/{total} testów'}
   ]},
  {id:'level3',label:'Poziom 3',title:'Poziom 3 (dla szybkich): flaga „nic nie zamieniłem”',grouping:'solo',
   intro:'Na liście prawie posortowanej zwykłe sortowanie bąbelkowe robi dużo niepotrzebnych porównań. Dodaj flagę: jeśli całe przejście nie zrobiło żadnej zamiany, lista jest gotowa i można przerwać pętlę. Zadanie dla chętnych — nie wlicza się do oceny.',
   reading:{title:'Flaga',paragraphs:[
    'Flaga to zmienna True/False, która zapamiętuje, czy coś się wydarzyło. Na początku każdego przejścia: zamiana = False. Przy każdej zamianie: zamiana = True.',
    'Po przejściu sprawdzasz: if not zamiana: break. Polecenie break natychmiast przerywa pętlę. Na liście [1, 2, 3, 4, 6, 5] wystarczą 2 przejścia zamiast 5.'
   ]},
   ...note(6,'Etap dla szybszych uczniów; pozostali kończą poziom 2. Zwróć uwagę na miejsce if not zamiana: break — w pętli for i, ale po pętli for j (wcięcie 8 spacji).','Na jakiej liście flaga nic nie pomaga, choć lista jest „prawie posortowana”?','[2, 3, 4, 5, 6, 1] — mała liczba na końcu przesuwa się w lewo tylko o jedno miejsce na przejście, więc potrzeba wszystkich przejść (tzw. żółw).','break wcięty w pętli for j (przerywa tylko porównania, nie przejścia) albo zamiana = False ustawione raz przed obiema pętlami.','Zapytaj: jak ulepszyć algorytm dla „żółwi”? (sortowanie koktajlowe — przejścia na zmianę w prawo i w lewo).',true),
   activities:[
    {type:'pythonLab',id:'cb-flag',mode:'code',points:3,file:'flaga.py',title:'Sortowanie z flagą',requires:'cb-rank',requiresTitle:'Ranking malejąco',
     prompt:'Uzupełnij dwa miejsca oznaczone ←. Funkcja zwraca posortowaną listę i liczbę porównań. Porównaj wynik z wersją bez flagi (15 porównań dla 6 liczb).',
     starter:'def sortuj_z_flaga(lista):\n    n = len(lista)\n    porownania = 0\n    for i in range(n - 1):\n        zamiana = False\n        for j in range(n - 1 - i):\n            porownania += 1\n            if lista[j] > lista[j + 1]:\n                lista[j], lista[j + 1] = lista[j + 1], lista[j]\n                # ← zapamiętaj, że była zamiana\n        # ← jeśli w tym przejściu nie było zamiany, przerwij pętlę\n    return lista, porownania\n\n\nprint(sortuj_z_flaga([1, 2, 3, 4, 6, 5]))\nprint(sortuj_z_flaga([2, 3, 4, 5, 6, 1]))\n',
     solution:'def sortuj_z_flaga(lista):\n    n = len(lista)\n    porownania = 0\n    for i in range(n - 1):\n        zamiana = False\n        for j in range(n - 1 - i):\n            porownania += 1\n            if lista[j] > lista[j + 1]:\n                lista[j], lista[j + 1] = lista[j + 1], lista[j]\n                zamiana = True\n        if not zamiana:\n            break\n    return lista, porownania\n\n\nprint(sortuj_z_flaga([1, 2, 3, 4, 6, 5]))\nprint(sortuj_z_flaga([2, 3, 4, 5, 6, 1]))\n',
     tests:[
      {call:'sortuj_z_flaga([1, 2, 3, 4, 6, 5])',expected:'([1, 2, 3, 4, 5, 6], 9)',label:'Prawie posortowana: 9 porównań'},
      {call:'sortuj_z_flaga([1, 2, 3])',expected:'([1, 2, 3], 2)',label:'Posortowana: 1 przejście'},
      {call:'sortuj_z_flaga([3, 2, 1])',expected:'([1, 2, 3], 3)'},
      {call:'sortuj_z_flaga([2, 3, 4, 5, 6, 1])',expected:'([1, 2, 3, 4, 5, 6], 15)',label:'„Żółw” na końcu'}
     ],
     hints:['Pod zamianą, z tym samym wcięciem: `zamiana = True`.','Po pętli for j (wcięcie 8 spacji): `if not zamiana:` i pod spodem `break`.'],
     questions:[
      {q:'Ile porównań oszczędziła flaga na liście [1, 2, 3, 4, 6, 5] (bez flagi było 15)?',answer:'6',inputLabel:'Oszczędzone porównania',explain:'15 − 9 = 6. Drugie przejście nie zrobiło żadnej zamiany, więc program zakończył pracę.',hint:'Odejmij wynik z flagą od 15.'}
     ]}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań, śledzenia, układanki i poziomów. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Podsumuj: sortowanie bąbelkowe to pętla w pętli, a liczba porównań rośnie jak n². Zadaj pytanie na wyjście. Zapowiedz następną lekcję: sortowanie przez wstawianie — jak układanie kart w ręce.','Ile porównań wykona sortowanie bąbelkowe (bez flagi) dla 10 liczb?','9 + 8 + … + 1 = 45, czyli n · (n − 1) / 2. Dla 1000 liczb już prawie 500 tysięcy — dlatego duże serwisy używają szybszych algorytmów.','Odpowiedź 10 lub 100 — uczniowie mylą liczbę porównań w jednym przejściu z całym sortowaniem.','Powiedz, że w Pythonie na co dzień używa się sorted(lista) albo lista.sort() — to szybki, gotowy algorytm (Timsort).'),
   activities:[{type:'resultCard',id:'result',title:'Sortowanie bąbelkowe — wynik',sources:['cb-r1','cb-r2','cb-trace','cb-parsons','cb-predict','cb-swap','cb-rank'],badges:[
    {min:0,name:'Bąbelek w drodze',text:'Jeszcze nie na szczycie, ale już wypływasz. Jedna zamiana więcej i będzie.'},
    {min:0.5,name:'Sortownik',text:'Twoja lista wie, gdzie jest jej miejsce. Ceny ułożone, ranking prawie gotowy.'},
    {min:0.85,name:'Król rankingu',text:'Pętla w pętli nie robi na Tobie wrażenia. Tabela wyników właśnie ustawiła Cię na pierwszym miejscu.'}
   ]}]}
 ],
 exitTicket:'Umiesz napisać sortowanie bąbelkowe: pętla w pętli, porównanie sąsiadów i zamiana a, b = b, a. Wiesz też, dlaczego dla dużych danych potrzebne są szybsze algorytmy — liczba porównań rośnie jak n².'
};
