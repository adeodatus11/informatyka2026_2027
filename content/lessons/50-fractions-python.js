import {note, choice} from '../schema.js';

const NWD = `def nwd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
`;
const SKROC = `def skroc(licznik, mianownik):
    if mianownik == 0:
        return None          # ułamek z zerem w mianowniku nie istnieje
    if mianownik < 0:
        licznik = -licznik
        mianownik = -mianownik
    d = nwd(abs(licznik), mianownik)
    return (licznik // d, mianownik // d)
`;
const DODAJ = `from math import gcd, lcm
def dodaj(a, b):
    m = lcm(a[1], b[1])
    l = a[0] * (m // a[1]) + b[0] * (m // b[1])
    d = gcd(l, m)
    return (l // d, m // d)
`;
const ODEJMIJ = `def odejmij(a, b):
    return dodaj(a, (-b[0], b[1]))
`;
const KALK = `def kalkulator(a, znak, b):
    if znak == "+":
        wynik = dodaj(a, b)
    elif znak == "-":
        wynik = odejmij(a, b)
    elif znak == "*":
        wynik = pomnoz(a, b)
    elif znak == ":":
        wynik = podziel(a, b)
    else:
        return "nieznane działanie"
    if wynik is None:
        return "błąd: dzielenie przez zero"
    return str(wynik[0]) + "/" + str(wynik[1])
`;
const BASE = `${NWD}\n\n${SKROC}\n\n${DODAJ}\n\n${ODEJMIJ}\n\n`;
const FR = '(F := __import__("fractions").Fraction)';
const SKROC_ALL = `${FR} and all(skroc(a, b) == (F(a, b).numerator, F(a, b).denominator) for a in range(-12, 13) for b in range(-12, 13) if b != 0)`;
const MUL_ALL = `${FR} and all(pomnoz((a, b), (c, d)) == (F(a * c, b * d).numerator, F(a * c, b * d).denominator) for a in range(-4, 5) for b in range(1, 5) for c in range(-4, 5) for d in range(1, 5))`;

export default {
 id:'50',grade:2,order:24,title:'Programowanie działań na ułamkach z wykorzystaniem NWD i NWW',
 subtitle:'Python liczy 1/2 + 1/3 jako 0.8333333333333333. Przepis potrzebuje 5/6. Zbudujesz kalkulator ułamków zwykłych z własnym nwd — i sprawdzisz go biblioteką fractions.',
 topic:'Ułamki jako krotki (licznik, mianownik): skroc, dodaj, odejmij, pomnoz, podziel, kalkulator',icon:'code',tags:['krotki','kalkulator','Fraction'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.2.a (działania na ułamkach z wykorzystaniem NWD i NWW), I.3 (sprawdzanie poprawności: mianownik 0, liczby ujemne, porównanie z fractions.Fraction), II.1 (funkcje z parametrami, warunki, pętle, testowanie), II.2 (Python w przeglądarce, moduły math i fractions)',
 format:{
  name:'Mini-projekt: kalkulator ułamków funkcja po funkcji',
  student:'Budujesz jeden produkt: kalkulator ułamków zwykłych. Każdy etap dokłada funkcję — skroc, dodaj, odejmij, pomnoz, podziel — a testy sprawdzają ją od razu, także dla mianownika 0 i liczb ujemnych. Na końcu kalkulator(a, znak, b) liczy przepisy i rabaty, a biblioteka fractions potwierdza, że się nie mylisz.',
  teacher:'Mini-projekt (problem, projekt, przypadek): produktem jest działający kalkulator, a każdy etap dodaje do niego kolejną funkcję. Powtórki rozłożone w czasie: nwd z lekcji 22. tematu i algorytm dodawania z poprzedniej lekcji wracają jako gotowe klocki — uczeń najpierw przypomina sobie algorytm (pytania na starcie), potem go używa. Metapoznanie: przed uruchomieniem testów brzegowych uczeń przewiduje wynik (np. skroc(1, -2)), a po teście porównuje. Twoja rola: pytasz „co ma zwrócić funkcja dla mianownika 0?” i „skąd wiesz, że wynik jest dobry?” (odpowiedź: test z Fraction).',
  grouping:'Samodzielnie, każdy buduje swój kalkulator. Para tylko jako opcja przy testowaniu gotowego kalkulatora (etap 5): podajcie sobie nawzajem działanie do sprawdzenia.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Powtórki rozłożone w czasie',url:'https://metodyka.covepolska.pl/metoda-powtorki-rozlozone.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Zapisuję ułamek jako krotkę (licznik, mianownik) i odczytuję jej elementy.','Programuję skroc z nwd, dbając o mianownik 0 i znak minus (zawsze w liczniku).','Programuję dodawanie, odejmowanie (przez NWW), mnożenie i dzielenie ułamków.','Sprawdzam swój kalkulator testami i porównaniem z fractions.Fraction.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Wyniki z poprzedniej lekcji (ułamki na paskach) — do sprawdzania kalkulatora'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na projektorze (pobranie Pythona ok. 13 MB). Klucz: krotka (6, 8) → wydruk 6, 8, „8 / 6”; 1/2 + 1/3 jako float = 0.8333333333333333, 0.1 + 0.2 = 0.30000000000000004, Fraction(1, 2) + Fraction(1, 3) = 5/6, Fraction(6, 8) = 3/4; skroc(1, -2) = (-1, 2), skroc(5, 0) = None, skroc(0, 5) = (0, 1); dodaj((1, 2), (1, 3)) = (5, 6); odejmij((3, 4), (1, 6)) = (7, 12); podziel((1, 2), (0, 5)) = None; kalkulator((3, 4), "*", (3, 2)) = "9/8". Testy „boss” porównują funkcje z fractions.Fraction dla kilkuset par.',
  summary:'Uczeń buduje kalkulator ułamków zwykłych na krotkach i sprawdza go testami brzegowymi oraz biblioteką fractions. Karta wyniku: maks. 25 pkt, produkt: „Kalkulator ułamków działa”. Pytanie na wyjście: po co skroc zwraca None dla mianownika 0, zamiast liczyć dalej?'
 },
 sections:[
  {id:'start',label:'Start',title:'0.8333333333333333 szklanki mleka?',grouping:'class',
   intro:'Wpisz w Pythonie 1/2 + 1/3, a dostaniesz 0.8333333333333333. Żaden przepis tak nie wygląda — chcesz 5/6. Dziś zbudujesz kalkulator ułamków zwykłych. Najpierw dwa pytania z poprzedniej lekcji.',
   reading:{title:'Ułamek jako para liczb',paragraphs:['Komputer zapisuje 1/3 w przybliżeniu (0.333…), bo działa w systemie dwójkowym. Ułamek zwykły zapiszemy dokładnie: jako parę (licznik, mianownik), w Pythonie — krotkę (1, 3).','Kalkulator to kilka małych funkcji: skroc (z nwd), dodaj i odejmij (ze wspólnym mianownikiem = NWW), pomnoz, podziel. Każdą sprawdzisz testami od razu po napisaniu.']},
   ...note(4,'Hak: pokaż na projektorze print(1 / 2 + 1 / 3) w pythonLab. Zapytaj, ile to w przepisie. Dwa pytania powtórkowe z lekcji o ułamkach — samodzielnie, bez notatek. To będą dokładnie te kroki, które za chwilę zapiszesz w kodzie.','Jakie kroki wykonuje algorytm dodawania ułamków?','NWW mianowników → rozszerz oba ułamki → dodaj liczniki → skróć wynik przez NWD.','Dodawanie liczników i mianowników osobno (2/5).','Zapytaj: gdzie komputer powinien liczyć dokładnie, a nie w przybliżeniu? (pieniądze, przepisy, proporcje).'),
   activities:[
    choice('fp-r1','Powtórka z ułamków: 3/4 − 1/6 = ?',['7/12','2/2','1/2','2/12'],[0],'NWW(4, 6) = 12: 9/12 − 2/12 = 7/12. Te kroki zapiszesz dziś w funkcji.','Najpierw wspólny mianownik.'),
    choice('fp-r2','Powtórka: skracasz 18/24. Przez jaką liczbę podzielisz licznik i mianownik, żeby skończyć w jednym kroku?',['Przez NWD(18, 24) = 6','Przez 2','Przez NWW(18, 24) = 72','Przez 18'],[0],'Przez NWD — od razu 3/4. Skracanie przez 2 wymaga jeszcze jednego kroku (9/12 → 3/4).','Największy wspólny dzielnik.')
   ]},
  {id:'tuples',label:'Krotki',title:'Krotka (licznik, mianownik) i biblioteka fractions',grouping:'solo',
   intro:'Najpierw przewidź, co wypisze program z krotką. Potem uruchom porównanie liczb zmiennoprzecinkowych z ułamkami z biblioteki fractions — tej samej, którą na końcu sprawdzisz swój kalkulator.',
   reading:{title:'u[0], u[1] i rozpakowanie',paragraphs:['Krotka u = (6, 8) przechowuje dwie liczby. u[0] to licznik (6), u[1] — mianownik (8). Zapis licznik, mianownik = u rozpakowuje krotkę do dwóch zmiennych naraz.','fractions.Fraction to gotowy ułamek w Pythonie: sam skraca i liczy dokładnie. Użyjemy go jak sędziego — Twój kalkulator ma dawać te same wyniki.']},
   ...note(6,'Przewidywanie samodzielnie, z zaznaczeniem pewności. Typowy błąd: „6 / 8” w ostatniej linii zamiast „8 / 6” (zamienione miejsca w print). Potem wszyscy uruchamiają porównanie float i Fraction — zatrzymaj klasę przy 0.30000000000000004: dlaczego bank nie liczy pieniędzy na float?','Dlaczego 0.1 + 0.2 nie daje dokładnie 0.3?','Komputer zapisuje ułamki dziesiętne w systemie dwójkowym. 0,1 nie da się zapisać dokładnie (jak 1/3 dziesiętnie), więc zostaje mały błąd.','Mylenie u[1] z pierwszym elementem (indeksy od 0).','Sprawdź Fraction(1, 3) * 3 i 1 / 3 * 3 — co wychodzi?'),
   activities:[
    {type:'pythonLab',id:'fp-predict',mode:'predict',points:2,file:'krotka.py',title:'Co wypisze program z krotką?',
     prompt:'Przewidź wydruk: trzy linie.',
     code:'u = (6, 8)\nprint(u[0])\nprint(u[1])\nlicznik, mianownik = u\nprint(mianownik, "/", licznik)\n',predictRows:3,
     explain:'u[0] = 6, u[1] = 8 (indeksy od 0). Rozpakowanie licznik, mianownik = u daje licznik = 6, mianownik = 8, a print wypisuje je w odwrotnej kolejności: „8 / 6”.'},
    {type:'pythonLab',id:'fp-float',mode:'code',points:1,file:'dokladnie.py',title:'float kontra Fraction',
     prompt:'Uruchom program i porównaj cztery linie wyniku.',
     starter:'from fractions import Fraction\n\nprint(1 / 2 + 1 / 3)                      # liczba zmiennoprzecinkowa\nprint(0.1 + 0.2)                          # niespodzianka!\nprint(Fraction(1, 2) + Fraction(1, 3))    # ułamek zwykły\nprint(Fraction(6, 8))                     # Fraction sam skraca\n',
     questions:[
      {q:'Co wypisał Fraction(1, 2) + Fraction(1, 3)?',answer:'5/6',inputLabel:'Wynik',explain:'5/6 — dokładnie, jak na paskach z poprzedniej lekcji.',hint:'Trzecia linia wydruku.'},
      {q:'Dlaczego 0.1 + 0.2 dało 0.30000000000000004?',options:['Komputer zapisuje ułamki dziesiętne w systemie dwójkowym w przybliżeniu','Python ma błąd w dodawaniu','Tak wychodzi w matematyce','Bo zabrakło nawiasów'],correct:[0],explain:'0,1 w systemie dwójkowym ma nieskończone rozwinięcie — zapis jest przybliżony. Dlatego do pieniędzy i przepisów lepsze są liczby całkowite albo ułamki zwykłe.',hint:'Pomyśl o 1/3 = 0,333… w systemie dziesiętnym.'}
     ]}
   ]},
  {id:'skroc',label:'skroc',title:'Klocek 1: skroc(licznik, mianownik)',grouping:'solo',
   intro:'Pierwsza funkcja kalkulatora. nwd masz gotowe z lekcji o algorytmach na liczbach. Dopisz trzy brakujące kroki: znak minus do licznika, NWD, dzielenie. Przed sprawdzeniem przewidź, co zwróci skroc(1, -2).',
   reading:{title:'Trzy przypadki brzegowe',paragraphs:['Mianownik 0: taki ułamek nie istnieje, więc funkcja zwraca None (w Pythonie: „nic”) zamiast dzielić przez zero i wywracać program.','Minus trzymamy w liczniku: 1/−2 zapisujemy jako −1/2. Dlatego gdy mianownik jest ujemny, zmieniamy znak obu liczb. NWD liczymy z abs(licznik) — wartości bez minusa. Dla licznika 0 wynik to (0, 1).']},
   ...note(8,'Metapoznanie: zanim uczeń kliknie „Sprawdź”, niech zapisze na boku przewidywania dla skroc(1, -2) i skroc(0, 5). Po testach: zgodne? Najczęstszy błąd: nwd(licznik, mianownik) z ujemnym licznikiem — działa, ale bez abs łatwo o ujemne NWD w innych miejscach; test „boss” porównuje z Fraction dla 600 par.','Co zwraca skroc(0, 5) i dlaczego?','(0, 1): nwd(0, 5) = 5, 0 // 5 = 0, 5 // 5 = 1. Zero to zero niezależnie od mianownika.','Dzielenie / zamiast // (wynik 3.0 zamiast 3); zmiana znaku tylko mianownika; return wewnątrz if.','Dopisz funkcję jako_tekst(u), która zwraca "3/4" albo samo "2", gdy mianownik = 1.'),
   activities:[
    {type:'pythonLab',id:'fp-skroc',mode:'code',points:4,file:'skroc.py',title:'skroc(licznik, mianownik)',
     prompt:'Uzupełnij `skroc` według komentarzy. Funkcja zwraca krotkę `(licznik, mianownik)` po skróceniu albo `None`, gdy mianownik to 0.',
     starter:NWD+'\n\ndef skroc(licznik, mianownik):\n    if mianownik == 0:\n        return None          # ułamek z zerem w mianowniku nie istnieje\n    # 1. Jeśli mianownik < 0: zmień znak licznika i mianownika (minus trzymamy w liczniku).\n    # 2. d = nwd(abs(licznik), mianownik)\n    # 3. Zwróć krotkę (licznik // d, mianownik // d)\n    return (licznik, mianownik)\n\n\nprint(skroc(18, 24))    # powinno być (3, 4)\n',
     solution:NWD+'\n\n'+SKROC+'\n\nprint(skroc(18, 24))    # powinno być (3, 4)\n',
     tests:[
      {call:'skroc(18, 24)',expected:'(3, 4)'},
      {call:'skroc(45, 60)',expected:'(3, 4)',label:'45 minut = 3/4 h'},
      {call:'skroc(40, 100)',expected:'(2, 5)',label:'Rabat 40%'},
      {call:'skroc(5, 0)',expected:'None',label:'Mianownik 0'},
      {call:'skroc(1, -2)',expected:'(-1, 2)',label:'Minus przechodzi do licznika'},
      {call:'skroc(-4, -6)',expected:'(2, 3)',label:'Dwa minusy'},
      {call:'skroc(0, 5)',expected:'(0, 1)',label:'Zero w liczniku'},
      {call:SKROC_ALL,expected:'True',label:'Boss: 600 ułamków zgodnych z fractions.Fraction'}
     ],
     sourceChecks:[{pattern:'(?<!def )\\bnwd\\(',label:'skroc korzysta z nwd',hint:'Policz NWD funkcją nwd, którą masz wyżej.'}],
     hints:['Krok 1: `if mianownik < 0:` i pod nim `licznik = -licznik` oraz `mianownik = -mianownik`.','Krok 2: `d = nwd(abs(licznik), mianownik)`.','Krok 3: zamień ostatnią linię na `return (licznik // d, mianownik // d)`.'],
     questions:[
      {q:'Dlaczego dla mianownika 0 funkcja zwraca None, zamiast liczyć dalej?',options:['Bo taki ułamek nie istnieje, a dzielenie przez 0 wywróciłoby program (ZeroDivisionError)','Bo None oznacza zero','Bo Python nie umie zapisać zera w krotce','Bez powodu — można zwrócić (0, 0)'],correct:[0],explain:'None to umówiony sygnał „brak wyniku”. Kalkulator sprawdzi go i wypisze komunikat zamiast się wysypać.',hint:'Co się dzieje, gdy dzielisz przez 0?'}
     ]}
   ]},
  {id:'add',label:'dodaj',title:'Klocek 2: dodaj i odejmij przez NWW',grouping:'solo',
   intro:'Ułóż dodawanie z rozsypanych linii — dwie linie to „szkolne” błędy (dodawanie mianowników). Tym razem pożyczasz gcd i lcm z biblioteki math: liczą to samo co Twoje nwd i nww. Potem odejmij w jednej linii.',
   reading:{title:'Algorytm w czterech linijkach',paragraphs:['m = lcm(b, d) — wspólny mianownik. l = a · (m // b) + c · (m // d) — rozszerzone liczniki dodane. d = gcd(l, m) i zwracasz (l // d, m // d) — skrócony wynik. Ułamek a to krotka: a[0] licznik, a[1] mianownik.','Odejmowanie to dodawanie liczby przeciwnej: 3/4 − 1/6 = 3/4 + (−1/6). Funkcja odejmij nie musi więc liczyć wszystkiego od nowa — wywołuje dodaj z minusem w liczniku drugiego ułamka.']},
   ...note(9,'Układanka: pułapki to l = a[0] + b[0] i m = a[1] + b[1] — dokładnie błąd 1/2 + 1/3 = 2/5. Kto je wstawi, zobaczy czerwony test. odejmij: jedna linia — jeśli ktoś pisze całość od nowa, też dobrze, byle testy przeszły (pochwal reużycie funkcji).','Dlaczego odejmij może wywołać dodaj?','Bo a − b = a + (−b). Zmieniamy znak licznika b i korzystamy z gotowej, przetestowanej funkcji.','Zmiana znaku mianownika zamiast licznika w odejmij (działa, ale łamie umowę „minus w liczniku”).','Napisz porownaj(a, b), która mówi, który ułamek jest większy (np. kto zjadł więcej pizzy).'),
   activities:[
    {type:'pythonLab',id:'fp-add',mode:'parsons',points:4,file:'dodaj.py',title:'Układanka: dodaj(a, b)',
     prompt:'Ułóż funkcję dodającą ułamki `a = (licznik, mianownik)` i `b`. Pierwsza linia importuje gcd i lcm. Dwie linie to pułapki.',
     solution:DODAJ,distractors:['l = a[0] + b[0]','m = a[1] + b[1]'],
     tests:[
      {call:'dodaj((1, 2), (1, 3))',expected:'(5, 6)',label:'Naleśniki: 1/2 + 1/3'},
      {call:'dodaj((1, 2), (1, 2))',expected:'(1, 1)',label:'Dwie połówki = całość'},
      {call:'dodaj((0, 3), (2, 5))',expected:'(2, 5)',label:'Zero + ułamek'},
      {call:'dodaj((-1, 2), (1, 2))',expected:'(0, 1)',label:'Liczby przeciwne'},
      {call:'dodaj((1, 4), (1, 12))',expected:'(1, 3)',label:'Wynik do skrócenia'},
      {call:'dodaj((5, 6), (1, 4))',expected:'(13, 12)',label:'Wynik większy od 1'}
     ],
     hints:['Kolejność: import → def → m = lcm(…) → l = … → d = gcd(…) → return.','Wspólny mianownik to NWW, a nie suma mianowników.','Linie w funkcji mają po jednym poziomie wcięcia.']},
    {type:'pythonLab',id:'fp-sub',mode:'code',points:2,file:'odejmij.py',title:'odejmij(a, b) w jednej linii',requires:'fp-add',requiresTitle:'Układanka: dodaj',
     prompt:'Napisz `odejmij`, korzystając z `dodaj`: odjąć `b` to dodać `b` z przeciwnym znakiem licznika.',
     starter:DODAJ+'\n\ndef odejmij(a, b):\n    # Zwróć dodaj(a, (minus licznik b, mianownik b))\n    return (0, 1)\n\n\nprint(odejmij((3, 4), (1, 6)))    # powinno być (7, 12)\n',
     solution:DODAJ+'\n\n'+ODEJMIJ+'\n\nprint(odejmij((3, 4), (1, 6)))    # powinno być (7, 12)\n',
     tests:[
      {call:'odejmij((3, 4), (1, 6))',expected:'(7, 12)',label:'Pizza: 3/4 − 1/6'},
      {call:'odejmij((1, 2), (1, 2))',expected:'(0, 1)',label:'Wynik zero'},
      {call:'odejmij((1, 3), (1, 2))',expected:'(-1, 6)',label:'Wynik ujemny'},
      {call:'odejmij((2, 3), (1, 4))',expected:'(5, 12)'}
     ],
     hints:['Licznik ułamka b to `b[0]`, mianownik `b[1]`. Ułamek przeciwny: `(-b[0], b[1])`.','`return dodaj(a, (-b[0], b[1]))`']}
   ]},
  {id:'calc',label:'Kalkulator',title:'Klocek 3: pomnoz, podziel i cały kalkulator',grouping:'solo',
   intro:'Ostatnie dwie funkcje i kalkulator, który wybiera działanie po znaku: +, -, *, :. Testy sprawdzą przepisy, rabaty, dzielenie przez zero i porównają mnożenie z fractions.Fraction.',
   reading:{title:'Mnożenie i dzielenie',paragraphs:['Mnożenie: (a[0] · b[0], a[1] · b[1]), potem skroc. Dzielenie to mnożenie przez odwrotność: (a[0] · b[1], a[1] · b[0]). Ale uwaga: gdy licznik b to 0, dzielisz przez zero — zwróć None.','kalkulator(a, znak, b) wybiera funkcję przez if/elif i zamienia wynik na tekst "licznik/mianownik". skroc sam przesunie minus do licznika, gdy dzielisz przez ułamek ujemny.']},
   ...note(13,'Samodzielnie. Najczęstsze: brak elif dla "*" i ":" w kalkulatorze oraz odwrotność złego ułamka w podziel. Zauważ: podziel bez jawnego sprawdzenia zera też zwróci None (skroc dostanie mianownik 0), ale jawny warunek czyta się łatwiej. Opcja dla chętnych par: jedna osoba podaje działanie z poprzedniej lekcji, druga sprawdza je swoim kalkulatorem. Na koniec każdy wpisuje odpowiedź na pytanie o przepis.','Jak sprawdzisz, że Twój kalkulator liczy dobrze, skoro nie znasz wszystkich wyników?','Porównując go z biblioteką, której ufamy (fractions.Fraction), dla setek przypadków — to robi test „boss”.','Odwrotność całego ułamka a zamiast b przy dzieleniu; zwracanie tekstu z pomnoz (kalkulator robi to sam).','Dodaj do kalkulatora działanie "^" (potęga ułamka) — przyda się pętla z lekcji o iteracjach.'),
   activities:[
    {type:'pythonLab',id:'fp-calc',mode:'code',points:5,file:'kalkulator.py',title:'Kalkulator ułamków',requires:'fp-sub',requiresTitle:'odejmij',
     prompt:'Napisz `pomnoz` i `podziel` według komentarzy, a w `kalkulator` dopisz gałęzie dla `"*"` i `":"`. Funkcje skroc, dodaj i odejmij są gotowe (z poprzednich etapów).',
     starter:BASE+'def pomnoz(a, b):\n    # licznik · licznik, mianownik · mianownik, potem skroc(…)\n    return (0, 1)\n\n\ndef podziel(a, b):\n    # Gdy b[0] == 0: zwróć None (dzielenie przez zero).\n    # W przeciwnym razie: skroc(a[0] * b[1], a[1] * b[0])\n    return (0, 1)\n\n\ndef kalkulator(a, znak, b):\n    if znak == "+":\n        wynik = dodaj(a, b)\n    elif znak == "-":\n        wynik = odejmij(a, b)\n    # ← dopisz elif dla "*" (pomnoz) i ":" (podziel)\n    else:\n        return "nieznane działanie"\n    if wynik is None:\n        return "błąd: dzielenie przez zero"\n    return str(wynik[0]) + "/" + str(wynik[1])\n\n\nprint(kalkulator((1, 2), "+", (1, 3)))\nprint(kalkulator((3, 4), "*", (4, 5)))\n',
     solution:BASE+'def pomnoz(a, b):\n    return skroc(a[0] * b[0], a[1] * b[1])\n\n\ndef podziel(a, b):\n    if b[0] == 0:\n        return None\n    return skroc(a[0] * b[1], a[1] * b[0])\n\n\n'+KALK+'\n\nprint(kalkulator((1, 2), "+", (1, 3)))\nprint(kalkulator((3, 4), "*", (4, 5)))\n',
     tests:[
      {call:'pomnoz((2, 3), (3, 2))',expected:'(1, 1)',label:'Przepis: 2/3 · 3/2'},
      {call:'pomnoz((3, 4), (4, 5))',expected:'(3, 5)',label:'Rabat na rabat: 3/4 · 4/5'},
      {call:'pomnoz((-1, 2), (2, 3))',expected:'(-1, 3)',label:'Ujemny ułamek'},
      {call:'podziel((1, 2), (1, 4))',expected:'(2, 1)',label:'Ile ćwiartek w połówce'},
      {call:'podziel((3, 4), (-3, 8))',expected:'(-2, 1)',label:'Dzielenie przez ujemny'},
      {call:'podziel((1, 2), (0, 5))',expected:'None',label:'Dzielenie przez zero'},
      {call:'kalkulator((1, 2), "+", (1, 3))',expected:'"5/6"'},
      {call:'kalkulator((3, 4), "-", (1, 6))',expected:'"7/12"'},
      {call:'kalkulator((3, 4), "*", (4, 5))',expected:'"3/5"'},
      {call:'kalkulator((1, 2), ":", (0, 3))',expected:'"błąd: dzielenie przez zero"'},
      {call:MUL_ALL,expected:'True',label:'Boss: 1296 iloczynów zgodnych z fractions.Fraction'}
     ],
     hints:['pomnoz: `return skroc(a[0] * b[0], a[1] * b[1])`.','podziel: najpierw `if b[0] == 0:` → `return None`, potem `return skroc(a[0] * b[1], a[1] * b[0])`.','W kalkulatorze przed `else:` dopisz `elif znak == "*":` z `wynik = pomnoz(a, b)` oraz `elif znak == ":":` z `wynik = podziel(a, b)`.'],
     questions:[
      {q:'Przepis na 4 osoby: 3/4 szklanki cukru. Gości 6, więc mnożysz przez 3/2. Co zwraca kalkulator((3, 4), "*", (3, 2))?',answer:'9/8',inputLabel:'Wynik',explain:'9/8 szklanki, czyli 1 i 1/8 szklanki cukru.',hint:'Dopisz print(kalkulator((3, 4), "*", (3, 2))) i uruchom.'}
     ],
     summary:'Kalkulator ułamków działa: {passed}/{total} testów'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: kalkulator gotowy?',grouping:'solo',
   intro:'Odpowiedz na pytanie końcowe, zaznacz samoocenę i pokaż kartę nauczycielowi — razem z zielonymi testami kalkulatora.',
   ...note(5,'Pytanie końcowe o testowanie. Podsumuj drogę: nwd (lekcja o liczbach) → skroc → dodaj (NWW) → kalkulator. Pochwal tych, którzy dopisali własne testy.','Po co porównywać kalkulator z fractions.Fraction, skoro testy z przykładami przechodzą?','Przykłady sprawdzają kilka przypadków, a porównanie z zaufaną biblioteką — setki, także ujemne i brzegowe. Tak programiści wyłapują błędy, o których nie pomyśleli.','„Skoro Fraction istnieje, po co mój kalkulator?” — odpowiedź: rozumiesz algorytm, umiesz go sprawdzić i napisać tam, gdzie biblioteki nie ma.','Dodaj do kalkulatora wypisywanie części całkowitej: 9/8 = 1 i 1/8.'),
   activities:[
    choice('fp-exit','Kalkulator kolegi dla kalkulator((1, 2), ":", (0, 3)) wysypuje się błędem ZeroDivisionError. Co poprawiasz?',['W podziel sprawdzam, czy licznik b to 0, i zwracam None, a kalkulator zamienia None na komunikat','Usuwam test z dzieleniem przez zero','Zamieniam // na /','Nic — użytkownik nie powinien tak liczyć'],[0],'Przypadek brzegowy obsługujemy w kodzie, a nie udajemy, że go nie ma. None → czytelny komunikat zamiast awarii programu.','Gdzie w kodzie następuje dzielenie przez licznik b?'),
    {type:'resultCard',id:'result',title:'Kalkulator ułamków — wynik',sources:['fp-r1','fp-r2','fp-predict','fp-float','fp-skroc','fp-add','fp-sub','fp-calc','fp-exit'],badges:[
     {min:0,name:'0.8333333333333333',text:'Na razie wynik w przybliżeniu. Wróć do klocka skroc — od niego wszystko się zaczyna.'},
     {min:0.5,name:'Ułamkowy mechanik',text:'Skracasz i dodajesz w kodzie. Jeszcze mnożenie i dzielenie, i kalkulator ruszy.'},
     {min:0.85,name:'5/6 co do okruszka',text:'Twój kalkulator zgadza się z fractions.Fraction. Przepisy, rabaty i mieszanki — policzone dokładnie.'}
    ]}
   ]}
 ],
 exitTicket:'Masz własny kalkulator ułamków zwykłych na krotkach: skroc z nwd, dodaj i odejmij przez NWW, pomnoz i podziel — z obsługą mianownika 0 i minusa, sprawdzony biblioteką fractions.'
};
