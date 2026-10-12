# Klasa 3 — notatki do realizacji: algorytmy na tekstach, systemy liczbowe i ułamki w Pythonie

Status: **notatki robocze (12.10.2026)**. Tematy według rozkładu klasy 3 z dziennika (`docs/rozklad-2026-2027.md`): C1 (17–20), C4 (23–27). Wszystko w `pythonLab`; tematy 17 i 21 bez kodu lub z małą ilością kodu. Klasa 3 zna już system dwójkowy i szesnastkowy z lekcji 06 i 13 (ręcznie) — teraz to samo **jako algorytm w kodzie**.
Źródła: dół pliku oraz `klasa-2-algorytmy-liczby-ulamki.md`. Linki z kwerendy — do weryfikacji (WebFetch był zablokowany).

## Wspólne zasady

- **Testy „pokonaj bibliotekę”**: własna funkcja kontra `str.count`, `str.find`, `int(s, 2)`, `bin`, `format(n, 'X')`, `Fraction`. Uwaga dydaktyczna: `"aaaa".count("aa") == 2`, a naiwne wyszukiwanie znajdzie 3 wystąpienia (nakładające się) — świetny temat do dyskusji, a nie „błąd ucznia”.
- **Od kartki do kodu**: karty z literami (anagramy), pasek papieru przesuwany nad tekstem (wzorzec), karty 1-2-4-8-16 (CS Unplugged „Count the Dots”).
- **Konteksty dla 17–18-latków**: loginy i nicki, hasła, SMS-y, Ctrl+F w regulaminie, logi serwera, kolory CSS, adresy IP i MAC, `chmod 755`, DNA (dla chętnych).
- Starsi uczniowie → więcej samodzielności: krótszy przykład rozwiązany, więcej „znajdź błąd” i zadań otwartych na poziomie 3.
- Klasa 3 szyfrowanie (21–22) = podpięte lekcje 16 i 17 — temat 18 („dane tekstowe”) przygotowuje `ord/chr` przed szyfrem.

## Temat 17 — Wybrane algorytmy na tekstach (koncepcja) (I.1, I.2.b, I.3, II.1)

- **Hak:** „Jak działa Ctrl+F? Jak Instagram sprawdza, czy nick jest zajęty? Czy »Kobyła ma mały bok« to palindrom?”
- **Symulator (`textLab`, tryby):** `compare` — porównywanie leksykograficzne znak po znaku (dwa wskaźniki, kolory: równe/różne, „krótszy wygrywa przy zgodnym początku”); `count` — zliczanie znaku z licznikiem; `palindrome` — dwa wskaźniki od końców, przełącznik „ignoruj spacje i wielkość liter”; `anagram` — sortowanie kart liter („arbuz” / „burza”); `pattern` — pasek wzorca przesuwany nad tekstem, licznik porównań (koszt).
- **Pułapki:** wielkie/małe litery, spacje i interpunkcja, pusty tekst, wzorzec dłuższy od tekstu, polskie znaki w porządku alfabetycznym (`ord('ą') > ord('z')` — świadomie pokazać).
- **Produkt:** wynik „detektywa tekstów” (5 zagadek) + wypełniona tabela porównań.

## Temat 18 — Praca z danymi tekstowymi w Pythonie (I.2.b, II.1, II.2)

- **Hak:** generator loginów `imie.nazwisko` → `jkowalski`, formatowanie numeru telefonu i kodu pocztowego.
- **Zadania:** „co wypisze” z indeksami i wycinkami (`"abcdef"[1:4]`, `[::-1]`, `[-1]`), `len`, `upper/lower`, `find` (−1!), `count`, `replace`, `split`, `ord/chr`; Parsons: zliczanie samogłosek; kod: generator loginu (bez polskich znaków — `replace`), maskowanie numeru karty „**** **** **** 1234”.
- **Pułapki (do testów i „znajdź błąd”):** `s[len(s)]` (IndexError), niezmienność napisów (`s[0] = 'x'`), `s.upper()` bez przypisania, `find` = −1 użyte jako indeks, `split()` vs `split(' ')`.
- **Produkt:** działający generator loginów dla listy klasy (fikcyjnej).

## Temat 19 — Porównywanie tekstów i zliczanie znaku (I.2.b, I.3, II.1, II.2)

- **Zadania:** `zlicz(tekst, znak)` w pętli (bez `count`), `czy_palindrom(t)` (dwa wskaźniki, wersja „zdaniowa” bez spacji i wielkości liter), `mniejszy(a, b)` — własne porównanie leksykograficzne, `czy_anagram(a, b)` (zliczanie liter albo sortowanie), ranking najczęstszej litery w SMS-ie.
- **Kontekst:** siła hasła (ile cyfr, ile wielkich liter), walidacja nicka (zakazane znaki, powtórzenia).
- **Testy:** `""`, znak nieobecny, `"aaaa"`, `("abc","abd")`, `("abc","ab")`, `("ala","alaska")`, wielkość liter. Porównanie z `count`, `<`, `==`.
- **Znajdź błąd:** licznik zerowany wewnątrz pętli; `return` w środku pętli.

## Temat 20 — Wyszukiwanie wzorca w tekście (naiwne) (I.2.b, I.3, II.1, II.2)

- **Hak:** „Ile razy w regulaminie sklepu występuje słowo »zwrot«?”, filtr słowa „spoiler”, szukanie błędu w logu serwera, motyw w DNA.
- **Zadania:** śledzenie dwóch pętli (pozycja × znak wzorca) → Parsons (dystraktor: zła górna granica `range(len(t))`) → `znajdz_wszystkie(tekst, wzorzec)` zwracające listę pozycji → licznik porównań (koszt) → bonus: zamiana wzorca (prosty „cenzor”).
- **Testy brzegowe:** wzorzec na początku, na końcu, równy całemu tekstowi, dłuższy od tekstu, pusty, **nakładające się wystąpienia** (`"aaa"`, `"aa"` → [0, 1]), wiele wystąpień.
- **Dyskusja:** dlaczego wynik różni się od `str.count` (nakładanie się); porównanie z `find` dla pierwszego wystąpienia.

## Temat 23 — Programowanie zamiany liczby dwójkowej na dziesiętną (I.2.a, II.1, II.2)

- **Rozgrzewka (retrieval z lekcji 06):** karty 1-2-4-8-16 — ułóż 13; pytanie o wagi.
- **Zadania:** dwie metody — suma wag (`cyfra * 2 ** potęga`) i schemat Hornera (`wynik = wynik * 2 + cyfra`, śledzenie); walidacja (tylko 0 i 1); kontekst: oktety IP (`11000000` = 192), bajty kolorów, `01000001` = 'A'.
- **Testy:** `"0"`, `"1"`, `"10"`, `"101"`, `"11111111"` = 255, `"00101"`, `""` (decyzja: błąd), znak `"2"` (błąd). Sprawdzenie `int(s, 2)`.
- **Znajdź błąd:** `wynik + cyfra * 2` zamiast `wynik * 2 + cyfra`; potęgi liczone od lewej.

## Temat 24 — Programowanie zamiany liczby dziesiętnej na dwójkową (I.2.a, II.1, II.2)

- **Zadania:** dzielenie przez 2 z resztami (śledzenie, reszty „od dołu”), Parsons z dystraktorem `n = n / 2` (float), funkcja `na_dwojkowy(n)` z uzupełnieniem do 8 bitów; „ile bitów potrzeba na liczbę 0–100 / 0–1000?”; maska podsieci.
- **Testy:** 0 (pętla się nie wykona — wynik musi być `"0"`), 1, 2, 5, 8, 255, 256. Sprawdzenie `format(n, 'b')`.
- **Znajdź błąd:** brak odwrócenia (`wynik + str(reszta)`).

## Temat 25 — Zamiana liczb między systemami pozycyjnymi (2–16) (I.2.a, II.1, II.2)

- **Hak:** kolory CSS `#FF8800` (nawiązanie do escape roomu z lekcji 13), `chmod 755`, adresy MAC.
- **Zadania:** uogólnienie: `na_system(n, p)` z tablicą cyfr `"0123456789ABCDEF"` i `z_systemu(s, p)`; zamiana przez dziesiętny jako pośrednik; konwerter kolorów hex ↔ RGB; walidacja cyfr powyżej podstawy.
- **Testy:** 255 → `FF` / `377` / `11111111`; 0; `"G"` w hex (błąd); małe litery `ff`; podstawa 1 i 17 (poza zakresem). Sprawdzenie `int(s, p)`, `format`.
- **Znajdź błąd:** tablica cyfr bez `F`; `cyfry[n // p]` zamiast `cyfry[n % p]`.
- **Produkt:** „konwerter kolorów” — wpisany kod hex daje RGB i odwrotnie (podgląd koloru na stronie).

## Tematy 26–27 — Ułamki z NWD i NWW; skracanie i działania arytmetyczne

*Wspólne z klasą 2 (tematy 23–24) — szczegóły i testy w `klasa-2-algorytmy-liczby-ulamki.md`.* Różnice dla klasy 3: krótsze wprowadzenie (NWD/Euklides jako przypomnienie w 10 minut, bez osobnej lekcji koncepcyjnej o liczbach), od razu biblioteka funkcji `nwd`, `nww`, `skroc`, `dodaj`, `odejmij`, `pomnoz`, `podziel`; temat 27 dokłada mnożenie i dzielenie (dzielenie przez 0/x), znak ułamka, wynik całkowity; kontekst: dawki leków (3/4 tabletki), przepisy, proporcje. Sprawdzenie `Fraction`.

## Źródła z kwerendy (do weryfikacji)

- CS Unplugged „Count the Dots” https://classic.csunplugged.org/activities/binary-numbers/ ; wersja z Pythonem https://www.csunplugged.org/es/plugging-it-in/binary-numbers/how-binary-digits-work/dots-right-left/python/
- ZPE: dwójkowy → dziesiętny https://zpe.gov.pl/a/wprowadzenie/D7wqy2szs i https://zpe.gov.pl/a/wprowadzenie/Dl2lVEHb2 ; dziesiętny → dwójkowy https://zpe.gov.pl/a/wprowadzenie/D6RIQbLh2 ; wzorzec metodą naiwną https://zpe.gov.pl/watek/LPAT886K9Q/191/a/jak-znalezc-wzorzec-w-tekscie/D2T4JFX74 i implementacja https://zpe.gov.pl/watek/LPAT886K9Q/191/a/implementacja-algorytmu-w-jezyku-python/DE3P1D9TT ; palindromy w genetyce https://zpe.gov.pl/watek/LPAT886K9Q/192/a/palindromy-w-genetyce/D5H5EVFFH ; anagramy i palindromy (dla nauczyciela) https://zpe.gov.pl/a/dla-nauczyciela/DSbUWDAUJ
- Python Tutor https://pythontutor.com/visualize.html ; metody `str` https://docs.python.org/3/library/stdtypes.html#string-methods
- Inspiracje zadań: CodingBat String-1/String-2 (count_hi, xyz_there, end_other), Exercism (anagram, isogram, pangram, hamming), CKE (zadanie „Anagramy cyfrowe” 2015 — tylko kontekst).
