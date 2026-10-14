import {note, choice} from '../schema.js';
import {patternTrace} from '../sims/textLab.js';

const ZNAJDZ = `def znajdz_wszystkie(tekst, wzorzec):
    wynik = []
    for i in range(len(tekst) - len(wzorzec) + 1):
        j = 0
        while j < len(wzorzec) and tekst[i + j] == wzorzec[j]:
            j = j + 1
        if j == len(wzorzec):
            wynik.append(i)
    return wynik
`;

const CZAT = `czat = [
    "Ola: kto idzie na MECZ w sobotę?",
    "Kuba: ja, bilety już mam",
    "Ola: super, mecz o 18",
    "Wiktor: a ja mam trening",
    "Kuba: po meczu pizza?",
]`;

// Liczby porównań wyliczone tym samym algorytmem co w symulatorze textLab (lekcja 53).
const cmp = (t, p) => String(patternTrace(t, p).comparisons);

export default {
 id:'56',grade:3,order:20,title:'Programowanie algorytmów na tekstach w języku Python – wyszukiwanie wzorca w tekście',
 subtitle:'Zbudujesz własną wyszukiwarkę wiadomości w czacie i policzysz, ile pracy ma komputer przy każdym Ctrl+F.',
 topic:'Wyszukiwanie wzorca w Pythonie',icon:'search',tags:['metoda naiwna','Ctrl+F','licznik porównań'],duration:45,
 curriculum:'Informatyka – liceum/technikum, zakres podstawowy (PP 2024): I.2.b — wyszukiwanie wzorca w tekście metodą naiwną; II.1 — pętle zagnieżdżone, funkcje, listy, testowanie dla różnych danych; I.3 — sprawdzanie algorytmu (przypadki brzegowe, liczba porównań); II.2 — Python w przeglądarce.',
 format:{
  name:'Przypadek: wyszukiwarka czatu klasy',
  student:'Pracujesz sam nad jednym problemem: aplikacja czatu potrzebuje wyszukiwarki, która znajdzie wszystkie wiadomości ze słowem „mecz”, pisanym jakkolwiek. Najpierw śledzisz gotowy algorytm, potem układasz go z klocków, mierzysz jego koszt i porównujesz z find i count. Na końcu podłączasz go do czatu. Efekt: działająca wyszukiwarka i liczba porównań, którą umiesz wyjaśnić.',
  teacher:'Cała lekcja jest prowadzona przez jeden przypadek z jasnym odbiorcą (użytkownik czatu), danymi (lista wiadomości) i kryteriami (testy). Kolejność „przykład rozwiązany → układanka → zmiana kodu → zastosowanie” stopniowo zdejmuje wsparcie. W etapie kosztu uczeń mierzy liczbę porównań tym samym sposobem, którym liczył je ręcznie na lekcji bez kodu, i porównuje wyniki z find i count (nakładające się wystąpienia). Twoja rola: przy każdym etapie wracaj do pytania „czy to już wystarczy dla wyszukiwarki czatu?” — brak wielkości liter, nakładanie i koszt wynikają z tego przypadku.',
  grouping:'Samodzielnie, każdy na swoim komputerze. Para tylko opcjonalnie przy zadaniu bonusowym.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Śledzę algorytm naiwny i wskazuję okna, w których znaleziono wzorzec.','Układam funkcję zwracającą listę wszystkich wystąpień, także nakładających się i na końcu tekstu.','Mierzę liczbę porównań i wyjaśniam, dlaczego wyniki różnią się od count.','Wykorzystuję własne wyszukiwanie w wyszukiwarce wiadomości bez względu na wielkość liter.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i logowania.','Projektor do śledzenia algorytmu w etapie 2','Opcjonalnie: pasek papieru z wzorcem do przesuwania nad tekstem na tablicy (jak na lekcji bez kodu)'],
 teacherGuide:{
  preparation:`Otwórz przed dzwonkiem etap 2 na komputerze z projektorem (Python pobiera się raz). Klucz: śledzenie „lol” w „lol xd lol” → pozycje 0 i 7, ${cmp('lol xd lol','lol')} porównań; znajdz_wszystkie("aaaa", "aa") = [0, 1, 2]; ile_porownan("aaaa", "aa") = 6, dla 10 × „a” i „aaa” = 24; przewidywanie: 0, 4, −1, 2 ("aaaa".count("aa") = 2, bo count liczy bez nakładania). Wyszukiwarka czatu: „mecz” znajduje 3 wiadomości (MECZ, mecz, meczu). Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe.`,
  summary:'Uczeń śledzi algorytm naiwny, układa funkcję znajdz_wszystkie, liczy porównania, porównuje wyniki z find i count i buduje wyszukiwarkę czatu bez względu na wielkość liter. Pytanie na wyjście: dlaczego „aaaa”.count("aa") daje 2, a Twoja funkcja 3 wystąpienia — i która odpowiedź jest „dobra”?'
 },
 sections:[
  {id:'start',label:'Start',title:'Ctrl+F w Twoim kodzie',grouping:'class',
   intro:'Czat klasy ma 2000 wiadomości, a Ty szukasz, kto pisał o meczu. Ctrl+F znajdzie tylko to, co widać na ekranie. Dziś napiszesz wyszukiwarkę, która przeszuka wszystko — i policzysz, ile to kosztuje komputer. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Dwie pętle',paragraphs:[
    'Metoda naiwna to dwie pętle. Zewnętrzna przesuwa okno: i = 0, 1, …, len(tekst) − len(wzorzec). Wewnętrzna porównuje znaki w oknie: tekst[i + j] z wzorzec[j], dopóki są równe. Jeśli doszła do końca wzorca — trafienie na pozycji i.',
    'Górna granica jest ważna: range(len(tekst) - len(wzorzec) + 1). Z samym range(len(tekst)) okno wyjeżdża poza tekst i program kończy się błędem IndexError — ale tylko dla niektórych danych. Dlatego testujesz wzorzec na końcu tekstu.'
   ],example:{question:'Tekst „kotek”, wzorzec „ek”: jakie i sprawdzi pętla zewnętrzna?',answer:'range(5 − 2 + 1) = range(4): i = 0, 1, 2, 3. Trafienie przy i = 3.'}},
   ...note(4,'Hak: zapytaj, kto szukał kiedyś starej wiadomości w czacie i jak długo to trwało. Potem pytania powtórkowe bez notatek; po pytaniu o licznik w pętli zapytaj, czy ktoś popełnił ten błąd na poprzedniej lekcji. Wszyscy otwierają etap 2.','Ile okien sprawdzi algorytm dla tekstu 2000 znaków i wzorca „mecz”?','2000 − 4 + 1 = 1997 okien.','Liczenie okien jako 2000 albo 2000 − 4.','Zapytaj, czy wyszukiwarka w ich komunikatorze znajduje „mecz”, gdy wpiszą „MECZ”.'),
   activities:[
    choice('pw-r1','Powtórka: co zwróci Twoja funkcja mniejszy("ala", "alaska") — tak samo jak "ala" < "alaska"?',['True — przy zgodnym początku krótszy tekst jest wcześniej','False — dłuższy tekst jest wcześniej','Błąd IndexError','None'],[0],'Pętla dochodzi do końca „ala” bez różnicy, więc decyduje długość: 3 < 6.','Co się dzieje, gdy jeden tekst się skończy?'),
    choice('pw-r2','W funkcji zliczającej ktoś wpisał licznik = 0 WEWNĄTRZ pętli. Co się stanie?',['Licznik zeruje się przy każdym znaku — wynik dotyczy tylko ostatniego znaku','Program zgłosi błąd składni','Wynik będzie zawsze poprawny','Pętla się nie zakończy'],[0],'Tak jak w „banan”: zostaje 1 albo 0 w zależności od ostatniej litery. Inicjalizacja zawsze przed pętlą.','Przypomnij sobie zadanie „znajdź błąd”.')
   ]},
  {id:'trace',label:'Śledzenie',title:'Przykład rozwiązany: „lol” w czacie',grouping:'solo',
   intro:'Prześledź algorytm na krótkiej wiadomości. Obserwuj i (okno) i j (pozycja we wzorcu). Zatrzymaj się przy trafieniach.',
   reading:{title:'Co robi każda zmienna',paragraphs:[
    'i — gdzie w tekście zaczyna się okno. j — ile znaków wzorca już się zgadza. Pętla while zwiększa j, dopóki znaki są równe i wzorzec się nie skończył. Po pętli sprawdzasz: j == len(wzorzec) oznacza, że zgadzały się wszystkie znaki.',
    'Warunek while ma dwie części połączone and. Kolejność jest ważna: najpierw j < len(wzorzec), potem tekst[i + j] == wzorzec[j]. Python przy and przerywa po pierwszym False — dzięki temu nie sięgnie po wzorzec[3], gdy wzorzec ma 3 znaki.'
   ],example:{question:'Przykład: i = 3, tekst[3] = " ", wzorzec[0] = "l". Co się stanie?',answer:'Warunek while od razu fałszywy, j zostaje 0. 0 ≠ 3, więc nie ma trafienia — pętla for przechodzi do i = 4.'}},
   ...note(8,'Na projektorze przejdź pierwsze okno (i = 0) krok po kroku i powiedz na głos, co się dzieje z j. Potem uczniowie sami szukają drugiego trafienia i odpowiadają na pytania. Zwróć uwagę na kolumnę „zmiana” w tabeli zmiennych.','Dlaczego w warunku while najpierw sprawdzamy j < len(wzorzec)?','Żeby nie sięgać po znak spoza wzorca — gdy j = 3, wzorzec[3] nie istnieje. and przerywa sprawdzanie po pierwszym False.','Mylenie i z j; przekonanie, że po trafieniu okno skacze o 3 (o długość wzorca).','Zmień kod na wzorzec „ol” i sprawdź, co się zmieni (pozycje 1 i 8).'),
   activities:[
    {type:'pythonLab',id:'pw-trace',mode:'trace',points:0,file:'szukaj_lol.py',title:'Algorytm naiwny krok po kroku',
     prompt:'Klikaj „Krok dalej”. Zmienne pokazują stan PRZED wykonaniem podświetlonej linii. Odpowiedz na pytania.',
     code:'tekst = "lol xd lol"\nwzorzec = "lol"\nfor i in range(len(tekst) - len(wzorzec) + 1):\n    j = 0\n    while j < len(wzorzec) and tekst[i + j] == wzorzec[j]:\n        j = j + 1\n    if j == len(wzorzec):\n        print("znaleziono na pozycji", i)\n',
     questions:[
      {q:'Na jakiej pozycji jest drugie trafienie?',answer:'7',inputLabel:'i =',explain:'„lol xd lol”: l=0, o=1, l=2, spacja=3, x=4, d=5, spacja=6, l=7. Drugie „lol” zaczyna się na 7.',hint:'Przejdź na koniec i spójrz na konsolę.'},
      {q:'Ile wartości przyjmie i (ile okien)?',options:['8','10','3','7'],correct:[0],explain:'range(10 − 3 + 1) = range(8): i = 0…7. Okno na pozycji 8 nie zmieściłoby wzorca.',hint:'n − m + 1.'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Ułóż znajdz_wszystkie(tekst, wzorzec)',grouping:'solo',
   intro:'Ten sam algorytm, ale jako funkcja, która zwraca listę pozycji zamiast wypisywać. Ułóż linie — jedna z nich to pułapka z poprzedniego wyjaśnienia. Testy sprawdzą przypadki brzegowe.',
   reading:{title:'Lista pozycji',paragraphs:[
    'Zamiast print zapisujemy pozycje w liście: wynik = [] przed pętlą, wynik.append(i) przy trafieniu, return wynik na końcu. Pusta lista [] oznacza „nie znaleziono”.',
    'Przypadki brzegowe: wzorzec na początku i na końcu, wzorzec równy całemu tekstowi, dłuższy od tekstu (range z ujemną liczbą nie wykona się ani razu — wynik []), wystąpienia nakładające się („aaaa” i „aa” → [0, 1, 2]).'
   ]},
   ...note(8,'Po zaliczeniu zapytaj, którą linią była pułapka i który test ją wykrył (wzorzec częściowo na końcu tekstu: „lolo” i „lol” → IndexError). Kto skończy wcześniej, odpowiada na pytanie o nakładanie.','Który test wykrywa pułapkę z range(len(tekst))?','Ten, w którym na końcu tekstu jest początek wzorca: „lolo” i „lol”. Przy i = 2 algorytm porównuje l = l, o = o i sięga po tekst[4], którego nie ma.','Złe wcięcie wynik.append(i) (w pętli while albo poza for), return wewnątrz for.','Zapytaj: co zwróci funkcja dla pustego wzorca? (każdą pozycję 0…n — warto taki przypadek obsłużyć osobno).'),
   activities:[
    {type:'pythonLab',id:'pw-parsons',mode:'parsons',points:4,file:'znajdz.py',title:'Układanka: znajdz_wszystkie',
     prompt:'Ułóż funkcję zwracającą listę wszystkich pozycji, na których zaczyna się wzorzec. Klikaj linie, ↑ ↓ zmieniają kolejność, ← → wcięcie. Jedna linia to pułapka.',
     solution:ZNAJDZ,distractors:['for i in range(len(tekst)):'],
     tests:[
      {call:'znajdz_wszystkie("lol xd lol", "lol")',expected:'[0, 7]'},
      {call:'znajdz_wszystkie("aaaa", "aa")',expected:'[0, 1, 2]',label:'Nakładające się wystąpienia'},
      {call:'znajdz_wszystkie("lolo", "lol")',expected:'[0]',label:'Początek wzorca na końcu tekstu'},
      {call:'znajdz_wszystkie("xd", "xd")',expected:'[0]',label:'Wzorzec = cały tekst'},
      {call:'znajdz_wszystkie("ok", "okej")',expected:'[]',label:'Wzorzec dłuższy od tekstu'},
      {call:'znajdz_wszystkie("hahaha", "ha")',expected:'[0, 2, 4]',label:'Wzorzec na końcu'}
     ],
     hints:['Kolejność: def, wynik = [], for, j = 0, while, j = j + 1, if, wynik.append(i), return.','Wcięcia: for — 1 poziom, j = 0, while i if — 2 poziomy, j = j + 1 i wynik.append(i) — 3 poziomy, return — 1 poziom.','Pułapka to pętla for bez „- len(wzorzec) + 1”: okno wyjeżdża poza tekst.']}
   ]},
  {id:'cost',label:'Koszt',title:'Ile to kosztuje? Licznik porównań i find/count',grouping:'solo',
   intro:'Na lekcji bez kodu liczyłeś porównania ręcznie. Teraz niech policzy je program. Potem przewidź, co powiedzą wbudowane find i count — i znajdź różnicę.',
   reading:{title:'Koszt algorytmu',paragraphs:[
    'Liczymy każde porównanie znaku tekstu ze znakiem wzorca. W najgorszym razie (np. 10 × „a” i wzorzec „aaa”) każde okno porównuje cały wzorzec: (n − m + 1) · m porównań. Zwykle jest dużo mniej, bo większość okien odpada na pierwszym znaku.',
    'Wbudowane tekst.find(wzorzec) zwraca pierwszą pozycję albo −1, a tekst.count(wzorzec) — liczbę wystąpień, które na siebie NIE zachodzą. Dlatego "aaaa".count("aa") to 2, a Twoja funkcja znajdzie 3. Obie odpowiedzi są poprawne — odpowiadają na inne pytanie.'
   ],example:{question:'Najgorszy przypadek: tekst 1000 × „a”, wzorzec „aaaab”.',answer:'996 okien, w każdym 5 porównań (cztery a zgodne, b nie) = 4980 porównań.'}},
   ...note(9,'Najpierw zadanie z licznikiem (kod ma już strukturę z break — uczeń dopisuje jedną linię we właściwym miejscu). Zapytaj, gdzie postawić licznik: przed if czy po nim? Potem przewidywanie z find/count — zbierz na forum odpowiedzi dla ostatniej linii (2 czy 3?).','Dlaczego licznik musi stać PRZED if z break?','Bo porównanie, które wykryło różnicę, też jest porównaniem. Licznik po if pominąłby każde porównanie zakończone break.','Licznik poza pętlą while (liczy okna, a nie porównania), licznik po break, mylenie find z count.','Porównaj liczbę porównań dla „ok, jutro ok?” z wynikiem z symulatora z lekcji bez kodu (15).'),
   activities:[
    {type:'pythonLab',id:'pw-count',mode:'code',points:3,file:'koszt.py',title:'Licznik porównań: ile_porownan(tekst, wzorzec)',
     prompt:'Algorytm jest gotowy (wersja z `break`). Dopisz JEDNĄ linię, która zwiększy `licznik` przy każdym porównaniu znaku tekstu ze znakiem wzorca.',
     starter:'def ile_porownan(tekst, wzorzec):\n    licznik = 0\n    for i in range(len(tekst) - len(wzorzec) + 1):\n        j = 0\n        while j < len(wzorzec):\n            # tu policz porównanie\n            if tekst[i + j] != wzorzec[j]:\n                break\n            j = j + 1\n    return licznik\n\n\nprint(ile_porownan("lol xd lol", "lol"))\n',
     solution:'def ile_porownan(tekst, wzorzec):\n    licznik = 0\n    for i in range(len(tekst) - len(wzorzec) + 1):\n        j = 0\n        while j < len(wzorzec):\n            licznik = licznik + 1\n            if tekst[i + j] != wzorzec[j]:\n                break\n            j = j + 1\n    return licznik\n\n\nprint(ile_porownan("lol xd lol", "lol"))\n',
     tests:[
      {call:'ile_porownan("lol xd lol", "lol")',expected:cmp('lol xd lol','lol')},
      {call:'ile_porownan("aaaa", "aa")',expected:cmp('aaaa','aa'),label:'Każde okno pasuje w całości'},
      {call:'ile_porownan("aaaaaaaaaa", "aaa")',expected:cmp('aaaaaaaaaa','aaa'),label:'Najgorszy przypadek'},
      {call:'ile_porownan("ok, jutro ok?", "ok")',expected:cmp('ok, jutro ok?','ok'),label:'Jak w symulatorze z lekcji bez kodu'},
      {call:'ile_porownan("abc", "abcd")',expected:cmp('abc','abcd'),label:'Wzorzec dłuższy — 0 okien'}
     ],
     hints:['Każde przejście pętli while to jedno porównanie — licznik zwiększasz na początku pętli while.','Wpisz w miejscu komentarza (12 spacji wcięcia): `licznik = licznik + 1`'],
     questions:[{q:'Ile porównań w najgorszym razie dla tekstu 20 znaków „a” i wzorca „aaaa”?',answer:String((20-4+1)*4),inputLabel:'Porównań',explain:'Okien: 20 − 4 + 1 = 17, w każdym 4 porównania: 68. Możesz to sprawdzić: ile_porownan("a" * 20, "aaaa").',hint:'Liczba okien razy długość wzorca — albo zmień ostatnią linię programu.'}]},
    {type:'pythonLab',id:'pw-builtin',mode:'predict',points:2,file:'logi.py',title:'Przewidź: find i count w logach serwera',
     prompt:'Admin szuka błędów w logu. Co wypiszą wbudowane metody? Wpisz 4 linie.',
     code:'log = "ERROR ok ERROR ERRORERROR"\nprint(log.find("ERROR"))\nprint(log.count("ERROR"))\nprint(log.find("WARN"))\nprint("aaaa".count("aa"))\n',predictRows:4,
     explain:'`find` zwraca pierwszą pozycję (0) albo −1, gdy nie znajdzie („WARN”). `count` liczy 4 wystąpienia „ERROR” (także sklejone „ERRORERROR”). Ale `"aaaa".count("aa")` to 2, bo count po trafieniu przeskakuje cały wzorzec — nie liczy nakładających się. Twoja `znajdz_wszystkie` znalazła 3.'}
   ]},
  {id:'chat',label:'Wyszukiwarka',title:'Wyszukiwarka czatu: „mecz” pisane jakkolwiek',grouping:'solo',
   intro:'Czas na przypadek z początku lekcji. Funkcja szukaj(czat, fraza) zwraca wiadomości, w których jest fraza — bez względu na wielkość liter. Użyj swojej znajdz_wszystkie.',
   reading:{title:'Najpierw ujednolić, potem szukać',paragraphs:[
    'Użytkownik wpisze „mecz”, a w czacie jest „MECZ” i „Mecz”. Wyszukiwarka zamienia na małe litery i tekst, i frazę: znajdz_wszystkie(w.lower(), fraza.lower()). Oryginalną wiadomość dopisuje do wyniku bez zmian — użytkownik ma zobaczyć ją tak, jak została napisana.',
    'Wiadomość pasuje, gdy lista pozycji nie jest pusta: len(…) > 0. Zwróć uwagę: „meczu” też zawiera „mecz” — to zwykle dobrze, ale „ok” znajdzie się też w „kok” i „okno”. Prawdziwe wyszukiwarki mają opcję „całe słowa”.'
   ]},
   ...note(12,'Praca samodzielna nad przypadkiem. Odsyłaj do testów. Po zaliczeniu zapytaj, co jeszcze przydałoby się w wyszukiwarce czatu (całe słowa, polskie znaki: „szkola” vs „szkoła”, podświetlanie pozycji). Szybsi robią bonus: własne find.','Dlaczego wyszukiwarka zwraca oryginalną wiadomość, a nie w.lower()?','Bo użytkownik ma zobaczyć wiadomość tak, jak ją napisano. Małe litery służą tylko do porównania.','Dopisywanie do wyniku w.lower(); lower() tylko po jednej stronie (fraza „MECZ” nie znajdzie „mecz”); append poza if (wszystkie wiadomości trafiają do wyniku).','Bonus: moje_find(tekst, wzorzec) — pierwsza pozycja albo −1 — i porównanie z str.find.'),
   activities:[
    {type:'pythonLab',id:'pw-chat',mode:'code',points:4,file:'wyszukiwarka.py',title:'Wyszukiwarka czatu: szukaj(czat, fraza)',
     prompt:'Uzupełnij funkcję `szukaj`. Dla każdej wiadomości sprawdź `znajdz_wszystkie` na wersjach małymi literami. Jeśli lista pozycji nie jest pusta — dopisz ORYGINALNĄ wiadomość do wyniku.',
     starter:ZNAJDZ+'\n\n'+CZAT+'\n\n\ndef szukaj(czat, fraza):\n    wynik = []\n    for w in czat:\n        # jeśli fraza jest w wiadomości (bez względu na wielkość liter) → wynik.append(w)\n        pass\n    return wynik\n\n\nfor w in szukaj(czat, "mecz"):\n    print(w)\n',
     solution:ZNAJDZ+'\n\n'+CZAT+'\n\n\ndef szukaj(czat, fraza):\n    wynik = []\n    for w in czat:\n        if len(znajdz_wszystkie(w.lower(), fraza.lower())) > 0:\n            wynik.append(w)\n    return wynik\n\n\nfor w in szukaj(czat, "mecz"):\n    print(w)\n',
     tests:[
      {call:'len(szukaj(czat, "mecz"))',expected:'3',label:'„mecz” w 3 wiadomościach'},
      {call:'szukaj(czat, "MECZ")[0]',expected:"'Ola: kto idzie na MECZ w sobotę?'",label:'Fraza wielkimi literami, wiadomość bez zmian'},
      {call:'szukaj(czat, "pizza")',expected:"['Kuba: po meczu pizza?']"},
      {call:'szukaj(czat, "basen")',expected:'[]',label:'Brak wyników'},
      {call:'szukaj(["Ok", "kok", "nie"], "ok")',expected:"['Ok', 'kok']",label:'Inny czat'}
     ],
     hints:['Warunek: `if len(znajdz_wszystkie(w.lower(), fraza.lower())) > 0:`','Pod warunkiem (12 spacji): `wynik.append(w)` — oryginalna wiadomość. Linię `pass` możesz usunąć.'],
     summary:'Wyszukiwarka czatu: {passed}/{total} testów'},
    {type:'pythonLab',id:'pw-find',mode:'code',points:2,file:'moje_find.py',title:'Bonus: moje_find — pokonaj str.find',
     prompt:'Dla chętnych (nie wlicza się do oceny). Napisz `moje_find(tekst, wzorzec)`: pierwsza pozycja wzorca albo −1. Możesz użyć `znajdz_wszystkie`. Test porówna wyniki z prawdziwym `find`.',
     starter:ZNAJDZ+'\n\ndef moje_find(tekst, wzorzec):\n    # pierwsza pozycja albo -1\n    return 0\n\n\nprint(moje_find("lol xd lol", "xd"), "lol xd lol".find("xd"))\n',
     solution:ZNAJDZ+'\n\ndef moje_find(tekst, wzorzec):\n    pozycje = znajdz_wszystkie(tekst, wzorzec)\n    if len(pozycje) == 0:\n        return -1\n    return pozycje[0]\n\n\nprint(moje_find("lol xd lol", "xd"), "lol xd lol".find("xd"))\n',
     tests:[
      {call:'moje_find("lol xd lol", "xd")',expected:'4'},
      {call:'moje_find("kot", "x")',expected:'-1',label:'Nie ma — wynik −1'},
      {call:'all(moje_find(t, p) == t.find(p) for t, p in [("aaaa", "aa"), ("abc", "c"), ("ok", "okej"), ("hahaha", "ah")])',expected:'True',label:'Te same wyniki co str.find'}
     ],
     sourceChecks:[{pattern:'\\.find\\(\\s*wzorzec',absent:true,label:'Funkcja nie wywołuje gotowego find',hint:'Nie używaj tekst.find w funkcji — skorzystaj z znajdz_wszystkie.'}],
     hints:['`pozycje = znajdz_wszystkie(tekst, wzorzec)` — potem sprawdź, czy lista jest pusta.','Pusta: `return -1`. W przeciwnym razie: `return pozycje[0]`.']}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań i zadań (bez bonusu). Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Pytanie na wyjście: „aaaa”.count("aa") = 2, a znajdz_wszystkie = 3 wystąpienia — która odpowiedź jest dobra? Zbierz 2–3 opinie. Zapowiedz: następnym razem szyfrowanie — wyszukiwanie wzorca przyda się przy łamaniu szyfru.','Która odpowiedź jest dobra: 2 czy 3 wystąpienia „aa” w „aaaa”?','Obie — odpowiadają na inne pytania. count liczy wystąpienia rozłączne (np. ile razy da się wyciąć „aa”), algorytm naiwny — wszystkie początki, także nakładające się (np. motyw w DNA).','„count się myli” — nie, ma inną definicję. Warto czytać dokumentację funkcji.','Zapytaj, gdzie nakładanie ma znaczenie (DNA, analiza logów, wykrywanie powtórzeń w haśle).'),
   activities:[{type:'resultCard',id:'result',title:'Wyszukiwarka czatu — wynik',sources:['pw-r1','pw-r2','pw-trace','pw-parsons','pw-count','pw-builtin','pw-chat'],badges:[
    {min:0,name:'Ctrl+Z',text:'Algorytm jeszcze się nie składa. Wróć do śledzenia i przejdź jedno okno krok po kroku.'},
    {min:0.5,name:'Ctrl+F',text:'Znajdujesz wzorzec i liczysz porównania. Jeszcze przypadki brzegowe i wyszukiwarka gotowa.'},
    {min:0.85,name:'grep z ludzką twarzą',text:'Twoja wyszukiwarka znajduje MECZ, mecz i meczu, a Ty wiesz, ile ją to kosztuje. Admini serwerów biją brawo.'}
   ]}]}
 ],
 exitTicket:'Metoda naiwna sprawdza każde z n − m + 1 okien i porównuje znaki do pierwszej różnicy. W najgorszym razie to (n − m + 1) · m porównań. find zwraca pierwszą pozycję albo −1, count liczy wystąpienia rozłączne, a Twoja funkcja — wszystkie, także nakładające się.'
};
