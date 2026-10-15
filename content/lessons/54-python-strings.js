import {note, choice} from '../schema.js';

export default {
 id:'54',grade:3,order:18,title:'Praca z danymi tekstowymi w języku Python',
 subtitle:'Napiszesz kawałki kodu, które działają w każdej aplikacji: maskowanie karty „**** 1234”, poprawianie imion z formularza, inicjały i sprawdzanie nicku.',
 topic:'Napisy w Pythonie',icon:'idcard',tags:['indeksy','wycinki','metody str'],duration:45,
 curriculum:'Informatyka – liceum/technikum, zakres podstawowy (PP 2024): II.1 — programowanie w Pythonie (wejście/wyjście, warunki, pętle, funkcje) na danych tekstowych; I.2.b — przygotowanie do algorytmów na tekstach; I.3 — sprawdzanie programu na przykładowych danych (testy); II.2 — środowisko Python w przeglądarce.',
 format:{
  name:'Szybkie sukcesy: przewidź → uruchom → popraw',
  student:'Pracujesz sam. Każde zadanie jest krótkie: najpierw przewidujesz, co wypisze program, potem uruchamiasz i porównujesz, a potem dopisujesz 1–3 linie, aż testy zaświecą się na zielono. Pierwszy działający program napiszesz w 3 minuty. Efekt: maskowanie karty, poprawianie imion, inicjały i walidator nicku — działające i przetestowane.',
  teacher:'Lekcja dla klasy, która nie programowała od dłuższego czasu. Każdy etap ma ten sam rytm: przykład rozwiązany w czytance → przewidywanie wyniku (pythonLab „predict”) → małe zadanie z kodem i testami. Informacja zwrotna jest natychmiastowa: testy pokazują, co było oczekiwane, a co zwrócił kod, a błędy Pythona są tłumaczone na polski — uczeń poprawia i sprawdza ponownie (feedback prowadzący do poprawy). Twoja rola: odsyłasz do testu z ✗ zamiast podawać kod („co było oczekiwane? co dostałeś?”). Po etapie 3 zbierz na forum najczęstszy błąd z indeksami (liczenie od 1).',
  grouping:'Samodzielnie, każdy na swoim komputerze. Kto skończy wcześniej, może pomóc sąsiadowi pytaniem (bez przejmowania klawiatury) albo zrobić zadanie bonusowe.',
  methods:[
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'UDL',url:'https://metodyka.covepolska.pl/metoda-udl.html'}
  ]
 },
 objectives:['Odczytuję znaki i fragmenty napisu przez indeksy i wycinki, także ujemne.','Używam len, upper, lower, strip, split, find, count i replace i wiem, co zwracają.','Przechodzę pętlą for po znakach napisu i zamieniam znaki na kody (ord, chr).','Piszę funkcje do maskowania numeru, poprawiania imion i sprawdzania nicku, które przechodzą testy.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i logowania (pierwsze uruchomienie pobiera ok. 13 MB).','Projektor do pokazania pierwszego zadania','Opcjonalnie: ściąga z metodami napisów na tablicy (upper, lower, strip, split, find, count, replace)'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz lekcję na komputerze z projektorem i wejdź do etapu 2 — przeglądarka pobierze Pythona i zapamięta go. Uczniowie od razu po wejściu otwierają etap 2 (Python ładuje się, gdy robicie pytania powtórkowe). Klucz: przewidywanie 1 — 11, K, KOT_FILEMON; przewidywanie 2 — „i a”, „form”, „inka”, „akytamrofni”; "kot".find("x") = −1; ord("A") = 65, ord("a") = 97, chr(66) = "B". Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe; uczeń, który utknie, może je odsłonić po podpowiedziach (¼ punktów).',
  summary:'Uczeń odczytuje znaki i wycinki napisu, używa podstawowych metod str, przechodzi pętlą po znakach i pisze cztery krótkie funkcje z testami (maskowanie, poprawianie imienia, inicjały, walidacja nicku). Karta wyniku zbiera pytania powtórkowe i zadania pythonLab. Pytanie na wyjście: dlaczego s.upper() nie zmienia napisu s?'
 },
 sections:[
  {id:'start',label:'Start',title:'Formularz, nick i „**** 1234”',grouping:'class',
   intro:'Każda aplikacja obrabia tekst: poprawia „aNNa noWAK” na „Anna Nowak”, chowa numer karty za gwiazdkami, odrzuca nick ze spacją. Dziś napiszesz to w Pythonie — po kilka linii. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Napis = ciąg znaków z numerami',paragraphs:[
    'W Pythonie tekst to napis (typ str), zapisany w cudzysłowie: "Kot_Filemon". Każdy znak ma numer pozycji — indeks. Liczymy od zera: pierwszy znak ma indeks 0, drugi 1. Długość napisu daje len(napis).',
    'Napisu nie da się zmienić literka po literce. Metody takie jak upper() czy replace() tworzą NOWY napis — trzeba go wypisać albo zapisać w zmiennej: nick = nick.upper().'
   ],example:{question:'Ile wynosi len("ok, jutro")?',answer:'9 — spacja i przecinek też są znakami.'}},
   ...note(4,'Hak: pokaż na projektorze dwa ekrany z życia — formularz z „aNNa noWAK” i płatność z „**** 1234”. Zapytaj, kto napisał kod, który to poprawia. Potem 2 minuty na pytania powtórkowe z lekcji o algorytmach na tekstach (bez notatek). Na koniec wszyscy przechodzą do etapu 2, żeby Python zaczął się ładować.','Skąd sklep internetowy wie, że „ANNA” i „anna” to ta sama osoba w bazie klientów?','Przed porównaniem zamienia tekst na jedną postać, np. małe litery — sam komputer uważa A i a za różne znaki (inne kody).','Uczniowie myślą, że komputer sam „rozumie” wielkie i małe litery. Pamiętają też indeksy od 1, a nie od 0.','Zapytaj, gdzie jeszcze widzieli zamaskowane dane (numer telefonu przy weryfikacji, e-mail „j***@…”).'),
   activities:[
    choice('ps-r1','Powtórka: dlaczego program porównujący kody znaków stawia „Zosia” przed „adam”?',['Bo wielkie Z ma mniejszy kod (90) niż małe a (97)','Bo Zosia jest dłuższa','Bo komputer sortuje od końca alfabetu','Bo „adam” zaczyna się od samogłoski'],[0],'Wielkie litery A–Z mają kody 65–90, małe a–z 97–122. Dlatego przed porównaniem często zamieniamy tekst na małe litery — dziś zrobisz to metodą lower().','Przypomnij sobie kody wielkich i małych liter.'),
    choice('ps-r2','Tekst ma 10 znaków, wzorzec 3. Ile okien sprawdzi wyszukiwanie metodą naiwną?',['3','7','8','10'],[2],'10 − 3 + 1 = 8 okien: pozycje od 0 do 7.','Ostatnie okno musi zmieścić cały wzorzec.')
   ]},
  {id:'first',label:'Pierwszy program',title:'Pierwszy program w 3 minuty',grouping:'solo',
   intro:'Przewidź, co wypisze program, i sprawdź jednym kliknięciem. Potem dopisz dwie linie. Błędy są OK — Python powie po polsku, co poprawić.',
   reading:{title:'print, len i upper',paragraphs:[
    'print(…) wypisuje wartość. len(nick) to liczba znaków, nick[0] — pierwszy znak, a nick.upper() — nowy napis wielkimi literami. Kropka oznacza „wywołaj metodę tego napisu”.',
    'Zmienna to podpisane pudełko: imie = "Kuba" wkłada napis Kuba do pudełka imie. Później piszesz samo imie, bez cudzysłowu — wtedy Python bierze zawartość pudełka.'
   ],example:{question:'Co wypisze print("Ola".lower())?',answer:'ola — nowy napis małymi literami. Oryginalne "Ola" się nie zmienia.'}},
   ...note(5,'Pokaż na projektorze, gdzie wpisać przewidywanie i przycisk „Uruchom i porównaj”. Daj minutę na przewidywanie bez uruchamiania. Potem zadanie z dwiema liniami — to ma być pierwszy sukces dla każdego. Krąż po sali i sprawdzaj cudzysłowy i nawiasy.','Dlaczego len("Kot_Filemon") to 11, a nie 10?','Bo liczy się każdy znak, także podkreślnik _. K-o-t-_-F-i-l-e-m-o-n = 11.','Pisanie print("imie") w cudzysłowie (wypisuje słowo imie zamiast zawartości zmiennej), brak nawiasów po upper.','Dla szybkich: wypisz pierwszą i ostatnią literę imienia: print(imie[0], imie[-1]).'),
   activities:[
    {type:'pythonLab',id:'ps-predict1',mode:'predict',points:2,file:'nick.py',title:'Co wypisze ten program?',
     prompt:'Przeczytaj kod linia po linii i wpisz, co pojawi się na ekranie — każda linia osobno. Potem uruchom i porównaj.',
     code:'nick = "Kot_Filemon"\nprint(len(nick))\nprint(nick[0])\nprint(nick.upper())\n',predictRows:3,
     explain:'`len(nick)` liczy wszystkie znaki, razem z `_` — 11. `nick[0]` to pierwszy znak, bo indeksy zaczynają się od 0. `upper()` daje nowy napis wielkimi literami; podkreślnik się nie zmienia.'},
    {type:'pythonLab',id:'ps-first',mode:'code',points:2,file:'imie.py',title:'Imię wielkimi literami i jego długość',
     prompt:'Dopisz dwie linie: pierwsza wypisze imię wielkimi literami, druga — liczbę jego znaków. Kliknij „Uruchom”, potem „Sprawdź”.',
     starter:'imie = "Kuba"\n# 1) wypisz imię wielkimi literami\n# 2) wypisz liczbę znaków imienia\n',
     solution:'imie = "Kuba"\nprint(imie.upper())\nprint(len(imie))\n',
     tests:[{output:'KUBA\n4',label:'Wypisuje KUBA, a pod spodem 4'}],
     hints:['Pierwsza linia: `print(imie.upper())`','Druga linia: `print(len(imie))`'],
     successText:'Pierwszy program dzisiaj działa.'}
   ]},
  {id:'slices',label:'Indeksy',title:'Indeksy i wycinki: „**** 1234”',grouping:'solo',
   intro:'Bank, sklep i operator pokazują tylko końcówkę numeru. To jeden wycinek napisu. Najpierw przewidź wyniki, potem napisz maskowanie numeru karty.',
   reading:{title:'Indeks i wycinek',paragraphs:[
    'napis[i] to znak o indeksie i. Indeksy ujemne liczą od końca: napis[-1] to ostatni znak, napis[-4:] — cztery ostatnie. Indeks spoza napisu, np. napis[len(napis)], kończy się błędem IndexError.',
    'Wycinek napis[a:b] to znaki od a do b − 1 (koniec nie wchodzi). Brak liczby oznacza „od początku” albo „do końca”, a napis[::-1] czyta napis od tyłu. Napisy skleja się znakiem +, a "*" * 4 daje "****".'
   ],example:{question:'Przykład rozwiązany: numer = "48600123456". Jak pokazać tylko 3 ostatnie cyfry?',answer:'numer[-3:] daje "456". "*" * (len(numer) - 3) + numer[-3:] daje "********456".'}},
   ...note(8,'Najpierw przewidywanie wycinków (3 min) — zbierz na forum odpowiedź dla t[2:6]. Większość klasy wpisze „forma” albo „orma”: wyjaśnij, że indeks końcowy nie wchodzi i liczymy od 0. Potem funkcja maskuj — krótka, ale uczy return. Krąż i pytaj: „ile znaków daje numer[-4:]?”.','Dlaczego t[2:6] daje 4 znaki, a nie 5?','Bo wycinek bierze indeksy 2, 3, 4, 5 — koniec (6) nie wchodzi. Długość wycinka to 6 − 2 = 4.','Liczenie indeksów od 1; numer[4:] zamiast numer[-4:] (bierze wszystko od piątego znaku); print zamiast return w funkcji (test dostaje None).','Dla szybkich: maskowanie e-maila — pierwsza litera, „***” i część od @ (np. j***@szkola.pl) z użyciem find("@").'),
   activities:[
    {type:'pythonLab',id:'ps-predict2',mode:'predict',points:2,file:'wycinki.py',title:'Przewidź: indeksy i wycinki',
     prompt:'Indeksy słowa „informatyka”: i=0, n=1, f=2, o=3, r=4, m=5, a=6, t=7, y=8, k=9, a=10. Co wypisze program?',
     code:'t = "informatyka"\nprint(t[0], t[-1])\nprint(t[2:6])\nprint(t[:2] + t[-2:])\nprint(t[::-1])\n',predictRows:4,
     explain:'`t[0]` i `t[-1]` to pierwszy i ostatni znak. `t[2:6]` to indeksy 2–5: „form” (6 nie wchodzi). `t[:2]` = „in”, `t[-2:]` = „ka”, razem „inka”. `t[::-1]` czyta napis od tyłu.'},
    {type:'pythonLab',id:'ps-mask',mode:'code',points:3,file:'karta.py',title:'Maskowanie numeru karty',
     prompt:'Uzupełnij funkcję `maskuj(numer)`: ma zwrócić cztery gwiazdki, spację i 4 ostatnie znaki numeru, np. `"**** 1234"`. Użyj wycinka z indeksem ujemnym i `return`.',
     starter:'def maskuj(numer):\n    # zwróć "**** " i 4 ostatnie znaki numeru\n    return numer\n\n\nprint(maskuj("4000123412341234"))\n',
     solution:'def maskuj(numer):\n    return "**** " + numer[-4:]\n\n\nprint(maskuj("4000123412341234"))\n',
     tests:[
      {call:'maskuj("4000123412341234")',expected:"'**** 1234'"},
      {call:'maskuj("5500000000000004")',expected:"'**** 0004'",label:'Zera na początku końcówki zostają'},
      {call:'maskuj("4000 1234 5678 9010")',expected:"'**** 9010'",label:'Numer ze spacjami'},
      {call:'maskuj("1234")',expected:"'**** 1234'",label:'Krótki numer'}
     ],
     hints:['4 ostatnie znaki to `numer[-4:]`.','Sklej napisy znakiem +: `return "**** " + numer[-4:]`'],
     questions:[{q:'Co wypisze print("informatyka"[4:])?',answer:'rmatyka',inputLabel:'Wynik',explain:'Od indeksu 4 (litera r) do końca: „rmatyka”.',hint:'Indeks 4 to piąta litera — policz od zera.'}],
     summary:'Maskowanie karty: {passed}/{total} testów'}
   ]},
  {id:'methods',label:'Metody',title:'Metody napisów: porządek w danych z formularza',grouping:'solo',
   intro:'Ludzie wpisują imiona na różne sposoby: „  aNNa   NOWAK ”. Program musi to poprawić, zanim zapisze dane w bazie albo wydrukuje identyfikator. Napiszesz funkcję poprawiającą imię i nazwisko, a potem ułożysz z klocków funkcję robiącą inicjały.',
   reading:{title:'Najważniejsze metody str',paragraphs:[
    'strip() usuwa spacje z początku i końca, lower() i upper() zmieniają wielkość liter, capitalize() robi wielką tylko pierwszą literę. split() tnie napis na listę słów po spacjach (także wielokrotnych): "jan  kowalski".split() → ["jan", "kowalski"].',
    'find("x") zwraca indeks pierwszego wystąpienia albo −1, gdy go nie ma. count("a") liczy wystąpienia, replace("ą", "a") zamienia fragmenty. Uwaga: −1 z find to nie „ostatni znak” — zawsze sprawdź, czy wynik nie jest −1, zanim użyjesz go jako indeksu.'
   ],example:{question:'Przykład rozwiązany: "  kOT  ".strip().capitalize()',answer:'strip() daje "kOT", a capitalize() — "Kot". Metody można łączyć kropkami, wykonują się od lewej.'}},
   ...note(9,'Najpierw krótko pokaż na projektorze przykład z czytanki (strip + capitalize). Zadanie 1 piszą sami — podpowiedź prowadzi przez split. Układanka z inicjałami jest dla wszystkich: po zaliczeniu zapytaj, która linia była pułapką i co by zrobiła (zostawiłaby tylko ostatnią literę).','Co zwróci "kot".find("x") i dlaczego to niebezpieczne?','−1. Jeśli użyjesz tego jako indeksu, napis[-1] da ostatni znak — program nie zgłosi błędu, tylko po cichu zrobi coś złego.','Wywołanie tekst.upper() bez przypisania (napis się nie zmienia); title() zamiast split — działa, ale nie usuwa podwójnych spacji; w inicjałach wynik = … zamiast wynik = wynik + ….','Dla szybkich: login w formacie „pierwsza litera imienia + nazwisko” małymi literami, z zamianą polskich znaków przez replace (np. „Łukasz Żak” → „lzak”).'),
   activities:[
    {type:'pythonLab',id:'ps-name',mode:'code',points:3,file:'formularz.py',title:'Poprawianie imienia i nazwiska',
     prompt:'Funkcja `popraw(tekst)` dostaje imię i nazwisko wpisane byle jak. Ma zwrócić „Imię Nazwisko”: każde słowo z wielkiej litery, reszta małymi, dokładnie jedna spacja, bez spacji na brzegach.',
     starter:'def popraw(tekst):\n    czesci = tekst.split()      # lista słów, np. ["aNNa", "NOWAK"]\n    imie = czesci[0]\n    nazwisko = czesci[1]\n    # popraw wielkość liter w imie i nazwisko, potem je sklej\n    return imie + " " + nazwisko\n\n\nprint(popraw("  aNNa   NOWAK "))\n',
     solution:'def popraw(tekst):\n    czesci = tekst.split()      # lista słów, np. ["aNNa", "NOWAK"]\n    imie = czesci[0].capitalize()\n    nazwisko = czesci[1].capitalize()\n    return imie + " " + nazwisko\n\n\nprint(popraw("  aNNa   NOWAK "))\n',
     tests:[
      {call:'popraw("  aNNa   NOWAK ")',expected:"'Anna Nowak'"},
      {call:'popraw("JAN KOWALSKI")',expected:"'Jan Kowalski'"},
      {call:'popraw("ola lis")',expected:"'Ola Lis'"},
      {call:'popraw("łukasz żak")',expected:"'Łukasz Żak'",label:'Polskie litery'}
     ],
     hints:['split() już usunął zbędne spacje. Zostało poprawić wielkość liter.','`czesci[0].capitalize()` zamienia „aNNa” na „Anna”. Zrób to samo z nazwiskiem.'],
     questions:[{q:'Co zwróci "kot".find("x")?',answer:'-1',accept:['−1'],inputLabel:'Wynik',explain:'find zwraca −1, gdy nie znajdzie fragmentu. Nie używaj tego wyniku jako indeksu bez sprawdzenia.',hint:'find zwraca indeks albo specjalną wartość „nie ma”.'}],
     summary:'Poprawianie imion: {passed}/{total} testów'},
    {type:'pythonLab',id:'ps-initials',mode:'parsons',points:3,file:'inicjaly.py',title:'Układanka: inicjały „J.K.”',
     prompt:'Ułóż funkcję, która z „jan kowalski” zrobi „J.K.”. Klikaj linie, strzałkami ↑ ↓ zmieniaj kolejność, a ← → wcięcie. Jedna linia to pułapka.',
     solution:'def inicjaly(imie_nazwisko):\n    wynik = ""\n    for slowo in imie_nazwisko.split():\n        wynik = wynik + slowo[0].upper() + "."\n    return wynik\n',
     distractors:['wynik = slowo[0].upper() + "."'],
     tests:[
      {call:'inicjaly("jan kowalski")',expected:"'J.K.'"},
      {call:'inicjaly("Anna Maria Nowak")',expected:"'A.M.N.'",label:'Trzy słowa'},
      {call:'inicjaly("  ola   lis ")',expected:"'O.L.'",label:'Nadmiarowe spacje'}
     ],
     hints:['Kolejność: def, potem pusty wynik, potem pętla po słowach, w pętli doklejanie, na końcu return.','W pętli wynik musi ROSNĄĆ: `wynik = wynik + …`. Linia bez `wynik +` zostawi tylko ostatnią literę.']}
   ]},
  {id:'loop',label:'Pętla i kody',title:'Pętla po znakach i kody liter',grouping:'solo',
   intro:'Siła hasła, liczba cyfr w numerze, szyfr Cezara — wszystko to pętla po znakach. Prześledź program, potem napisz licznik cyfr w haśle.',
   reading:{title:'for znak in napis',paragraphs:[
    'Pętla for znak in haslo: wykonuje wcięty blok raz dla każdego znaku, od lewej. Warunek "0" <= znak <= "9" sprawdza, czy znak jest cyfrą — działa, bo cyfry mają kolejne kody 48–57. To samo robi metoda znak.isdigit().',
    'ord(znak) zwraca kod znaku: ord("A") = 65, ord("a") = 97. chr(liczba) robi odwrotnie: chr(66) = "B". Różnica między wielką a małą literą to zawsze 32 — tak działały pierwsze programy zamieniające wielkość liter. Te dwie funkcje przydadzą się przy szyfrze Cezara.'
   ],example:{question:'Co wypisze print(chr(ord("a") + 1))?',answer:'b — kod a (97) + 1 = 98, a chr(98) to „b”.'}},
   ...note(8,'Śledzenie 2 minuty na projektorze: zatrzymaj się na kroku, w którym licznik rośnie, i zapytaj „dlaczego teraz?”. Potem uczniowie piszą funkcję sami. Zwróć uwagę na miejsce return — po pętli, nie w środku.','Dlaczego "0" <= znak <= "9" działa dla cyfr, skoro to napisy, a nie liczby?','Bo napisy porównuje się kodami znaków, a cyfry mają kolejne kody od 48 („0”) do 57 („9”).','licznik = 0 wewnątrz pętli (licznik ciągle się zeruje), return w środku pętli (funkcja kończy się po pierwszym znaku), porównanie znak == 0 (liczba zamiast napisu "0").','Dla szybkich: funkcja ile_wielkich(haslo) — warunek "A" <= znak <= "Z".'),
   activities:[
    {type:'pythonLab',id:'ps-trace',mode:'trace',points:0,file:'cyfry.py',title:'Przykład rozwiązany: liczę cyfry w haśle',
     prompt:'Klikaj „Krok dalej” i obserwuj zmienne znak i licznik. Odpowiedz na pytania.',
     code:'haslo = "Kot7!2"\nlicznik = 0\nfor znak in haslo:\n    if "0" <= znak <= "9":\n        licznik = licznik + 1\nprint("Cyfr:", licznik)\nprint(ord("A"), ord("a"), chr(66))\n',
     questions:[
      {q:'Ile razy wykona się linia 5 (licznik = licznik + 1)?',answer:'2',inputLabel:'Razy',explain:'Tylko dla znaków 7 i 2 — dwie cyfry w haśle.',hint:'Policz cyfry w „Kot7!2”.'},
      {q:'Co wypisze ostatnia linia?',options:['`65 97 B`','`A a 66`','`65 65 B`','`1 1 2`'],correct:[0],explain:'ord("A") = 65, ord("a") = 97, chr(66) = „B”. Małe litery mają kody o 32 większe niż wielkie.',hint:'Przejdź do ostatniego kroku i spójrz na konsolę.'}
     ]},
    {type:'pythonLab',id:'ps-digits',mode:'code',points:3,file:'haslo.py',title:'Ile cyfr ma hasło?',
     prompt:'Uzupełnij funkcję `ile_cyfr(haslo)`: przejdź pętlą po znakach i zlicz cyfry. Nie używaj `count` — ma działać pętla.',
     starter:'def ile_cyfr(haslo):\n    licznik = 0\n    # pętla po znakach: jeśli znak jest cyfrą, zwiększ licznik\n\n    return licznik\n\n\nprint(ile_cyfr("Kot2024!"))\n',
     solution:'def ile_cyfr(haslo):\n    licznik = 0\n    for znak in haslo:\n        if "0" <= znak <= "9":\n            licznik = licznik + 1\n    return licznik\n\n\nprint(ile_cyfr("Kot2024!"))\n',
     tests:[
      {call:'ile_cyfr("Kot2024!")',expected:'4'},
      {call:'ile_cyfr("haslo")',expected:'0',label:'Brak cyfr'},
      {call:'ile_cyfr("")',expected:'0',label:'Puste hasło'},
      {call:'ile_cyfr("123456")',expected:'6'}
     ],
     sourceChecks:[{pattern:'\\bfor\\b',label:'Kod używa pętli for',hint:'Przejdź po znakach pętlą for znak in haslo:'}],
     hints:['Pętla: `for znak in haslo:` (z dwukropkiem), w środku warunek z wcięciem.','Warunek: `if "0" <= znak <= "9":`, a pod nim `licznik = licznik + 1`. `return` zostaje poza pętlą.']}
   ]},
  {id:'nick',label:'Walidator',title:'Twój walidator nicku',grouping:'solo',
   intro:'Na koniec połącz wszystko: funkcja nick_ok(nick) sprawdza reguły serwera gry. Zwraca True, gdy nick jest dobry, i False, gdy łamie którąś regułę. Sześć testów sprawdzi przypadki brzegowe.',
   reading:{title:'Funkcja, która mówi tak albo nie',paragraphs:[
    'Reguły: od 3 do 16 znaków, bez spacji, bez słowa „admin” pisanego jakkolwiek (Admin, ADMIN). Każdą regułę sprawdzasz osobnym if. Gdy reguła jest złamana — return False i koniec funkcji. Jeśli żadna nie zadziałała, na końcu return True.',
    'Operator in sprawdza, czy fragment jest w napisie: " " in nick. Żeby nie zależało od wielkości liter, porównuj wersję małymi literami: "admin" in nick.lower(). Pamiętaj z poprzedniej lekcji: taki filtr odrzuci też „badminton”.'
   ]},
   ...note(7,'Praca samodzielna. Odsyłaj do testów: „który przypadek nie przechodzi?”. Najczęściej nie przechodzi „Admin123” (brak lower) albo nick o długości 16 (zły znak < zamiast <=). Kto skończy, robi bonus z etapu 4 albo pomaga sąsiadowi pytaniami.','Dlaczego test „16 znaków” jest ważny, skoro działa nick z 10 znakami?','To przypadek brzegowy — błąd w warunku (< zamiast <=) wychodzi tylko na granicy. Dobre testy sprawdzają granice: 2, 3, 16, 17 znaków.','Odwrócone warunki (return True przy złamaniu reguły), sprawdzanie "admin" in nick bez lower, sprawdzenie długości przez len(nick) > 3 (odrzuca nick 3-znakowy).','Dodaj regułę: nick nie może zaczynać się od cyfry (nick[0] i "0" <= … <= "9") i dopisz własny test w print.'),
   activities:[
    {type:'pythonLab',id:'ps-nick',mode:'code',points:4,file:'nick_ok.py',title:'Walidator nicku: nick_ok(nick)',
     prompt:'Uzupełnij funkcję. Reguły: długość od 3 do 16 znaków, bez spacji, bez słowa „admin” (bez względu na wielkość liter). Pierwsza reguła jest już napisana.',
     starter:'def nick_ok(nick):\n    if len(nick) < 3 or len(nick) > 16:\n        return False\n    # reguła 2: spacja w nicku → False\n\n    # reguła 3: słowo admin (bez względu na wielkość liter) → False\n\n    return False\n\n\nprint(nick_ok("Kot_Filemon"), nick_ok("Admin123"))\n',
     solution:'def nick_ok(nick):\n    if len(nick) < 3 or len(nick) > 16:\n        return False\n    if " " in nick:\n        return False\n    if "admin" in nick.lower():\n        return False\n    return True\n\n\nprint(nick_ok("Kot_Filemon"), nick_ok("Admin123"))\n',
     tests:[
      {call:'nick_ok("Kot_Filemon")',expected:'True'},
      {call:'nick_ok("ab")',expected:'False',label:'Za krótki (2 znaki)'},
      {call:'nick_ok("Ola")',expected:'True',label:'Dokładnie 3 znaki'},
      {call:'nick_ok("x" * 17)',expected:'False',label:'Za długi (17 znaków)'},
      {call:'nick_ok("ala ma kota")',expected:'False',label:'Spacja'},
      {call:'nick_ok("SuperADMIN")',expected:'False',label:'„admin” wielkimi literami'}
     ],
     hints:['Reguła 2: `if " " in nick:` i pod spodem `return False`.','Reguła 3: `if "admin" in nick.lower():` i `return False`.','Ostatnia linia funkcji ma zwracać True — nick przeszedł wszystkie reguły.'],
     summary:'Walidator nicku: {passed}/{total} testów'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań i zadań w Pythonie. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Zbierz wnioski: która metoda była najbardziej przydatna i co zaskoczyło (zwykle −1 z find albo indeks od 0). Pytanie na wyjście. Zapowiedz: następnym razem napiszecie własne zliczanie, palindrom i porównywanie — bez gotowych metod.','Dlaczego samo s.upper() w osobnej linii nie zmienia napisu s?','Bo napisy są niezmienne — upper() tworzy nowy napis. Trzeba go zapisać: s = s.upper() albo od razu wypisać.','Przekonanie, że metoda „poprawia” zmienną w miejscu, jak w edytorze tekstu.','Zapytaj: które z dzisiejszych funkcji widzieliście w prawdziwych aplikacjach?'),
   activities:[{type:'resultCard',id:'result',title:'Napisy w Pythonie — wynik',sources:['ps-r1','ps-r2','ps-predict1','ps-first','ps-predict2','ps-mask','ps-name','ps-initials','ps-trace','ps-digits','ps-nick'],badges:[
    {min:0,name:'print("Hello")',text:'Python znowu w grze. Wróć do zadań z ✗ — podpowiedzi naprawdę pomagają.'},
    {min:0.5,name:'Obrabiacz napisów',text:'Wycinki, metody i pętle już działają. Jeszcze trochę pewności przy testach brzegowych.'},
    {min:0.85,name:'**** 1234',text:'Maskujesz, poprawiasz i walidujesz jak backend dużej aplikacji. Bank by Cię zatrudnił.'}
   ]}]}
 ],
 exitTicket:'Napis to ciąg znaków z indeksami od 0. Wycinki [a:b] nie biorą końca, ujemne indeksy liczą od końca. Metody str tworzą nowe napisy, find zwraca −1, gdy nie znajdzie fragmentu, a pętla for przechodzi po znakach — tak liczysz cyfry, sprawdzasz nick i (wkrótce) szyfrujesz.'
};
