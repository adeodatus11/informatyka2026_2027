# Klasa 2 — notatki do realizacji: dokończenie algorytmów, liczby, ułamki

Status: **notatki robocze (12.10.2026)**, przed opracowaniem lekcji. Tematy według `docs/rozklad-2026-2027.md` (cykl 2-letni technikum). Lekcje budujemy w `pythonLab` (kod + testy, układanka Parsonsa, śledzenie, „co wypisze”) i — dla tematów bez kodu — w nowym symulatorze krok po kroku.
Źródła z kwerendy są na dole. WebFetch był zablokowany: opisy zasobów pochodzą z wyników wyszukiwania, **linki trzeba otworzyć i sprawdzić przed użyciem** (część materiałów ZPE jest na poziomie rozszerzonym).

## Zasady wspólne dla bloku

- **„Pokonaj bibliotekę”**: uczeń pisze własny algorytm, a testy porównują wynik z funkcją Pythona (`math.gcd`, `math.lcm`, `fractions.Fraction`, `int(s, b)`). Zielone testy = mierzalny efekt; przypadki brzegowe jako „boss level”.
- **Od kartki do kodu**: najpierw krótka aktywność „unplugged”/symulacja (kafelki, sito, paski ułamków), potem Parsons, potem własny kod.
- **Konteksty zawodowe**: płytki i kafelki (budowlanka), proporcje mieszanek (fryzjer, lakiernik, gastronomia), przepisy, rabaty, PIN-y i hasła.
- **Spójna „biblioteka ucznia”**: funkcje `nwd`, `nww`, `skroc` z lekcji 22–24 wracają w ułamkach — te same nazwy i testy w klasie 3 (tematy 26–27).
- Metody COVE do rotacji: przykłady rozwiązane z wygaszaniem, mastery (poziomy), „znajdź błąd” jako feedback-poprawa, retrieval na starcie, praca w parach driver–navigator.

## Temat 20 — Programowanie algorytmów iteracyjnych (I.2.d, I.3, II.1)

**Nie dublować lekcji 21** (skarbonka, lokata, Fibonacci, złota proporcja są już zrobione). Ta lekcja = **inne iteracje i warunek stopu**.
- **Hak:** „Ile kombinacji ma 4-cyfrowy PIN? A hasło z 8 znaków? Ile tygodni promocji −10%, zanim buty będą poniżej 200 zł?”
- **Zadania (poziomy):** P1 silnia i potęga w pętli `for` (PIN-y, hasła: 10⁴, 62⁸ — wynik w miliardach robi wrażenie); P2 pętla `while` z warunkiem stopu: przecena co tydzień, HP postaci w grze do zera, suma cyfr liczby, liczba cyfr; P3 (szybcy) problem Collatza — licznik kroków, „czy zawsze dochodzi do 1?”.
- **Śledzenie:** tabela zmiennych krok po kroku (trace) — uczeń przewiduje wartości przed kliknięciem „dalej”.
- **Pułapki do testów:** przesunięcie o 1 (`range(n)` vs `range(1, n+1)`), brak inicjalizacji, zła kolejność przypisań, brak `i += 1` → pętla nieskończona (nasz limit 3 s pokazuje to „na żywo”), n = 0 i n = 1, n ujemne (ustalona decyzja: komunikat).
- **Znajdź błąd:** silnia od 0 (`wynik = 0`), `while` bez zmiany zmiennej.
- **Produkt:** „kalkulator siły hasła/PIN-u” — liczba kombinacji i czas łamania przy 1 mld prób/s (łączy z lekcjami o bezpieczeństwie).

## Temat 21 — Wybrane algorytmy na liczbach (koncepcja, bez kodu) (I.2.a, I.2.d, I.3)

- **Hak:** „Łazienka 240 × 180 cm — jakie największe kwadratowe płytki położysz bez docinania?” (NWD), „Dlaczego 1 nie jest liczbą pierwszą, a szyfry w banku opierają się na wielkich liczbach pierwszych?”
- **Nowy symulator (proponowana nazwa `numberLab`, tryby):**
  - `tiles` — Euklides na prostokącie: odcinanie największych kwadratów (wersja z odejmowaniem), potem skok „resztą” (wersja z modulo); licznik kroków obu wersji (NWD(1000000, 3) — odejmowanie trwa „wieczność”).
  - `sieve` — sito Eratostenesa na planszy 1–100: uczeń sam wykreśla wielokrotności (kolory), pytania: „do jakiej liczby wystarczy sprawdzać?” (pierwiastek — pary dzielników 36 = 1·36, 2·18, 3·12, 4·9, 6·6).
  - `factor` — drzewko rozkładu na czynniki (360 = 2³·3²·5), wyścig w parach.
  - `steps` — układanie kroków Euklidesa dla 48 i 18 z jednym „kłamliwym” krokiem (Parsons bez kodu).
- **Pułapki:** 1 nie jest pierwsza, 2 to jedyna parzysta pierwsza, 0 i ujemne; NWD(a, 0) = a; odejmujemy mniejszą od większej.
- **Produkt:** „kalkulator kafelkarza” (największa płytka i liczba płytek) — wynik na karcie.

## Temat 22 — Programowanie wybranych algorytmów na liczbach (I.2.a, I.3, II.1, II.2)

- **Zadania:** `czy_pierwsza(n)` (Parsons → kod; dystraktor `range(2, n+1)`), `nwd(a, b)` w dwóch wersjach + licznik kroków (porównanie szybkości), `rozklad(n)` dla szybkich, bonus: sito do 1000 i „ile jest liczb pierwszych mniejszych od 1000?” (168).
- **Kontekst:** „szczęśliwy numer” (koszulka, końcówka telefonu — czy pierwsza?), kalkulator kafelkarza w kodzie, proporcja mieszanki skrócona przez NWD.
- **Testy brzegowe:** 0, 1, 2, 3, 4, 17, 25, 97, 100; NWD(0, 5), NWD(5, 0), NWD(0, 0) = 0, NWD(7, 7), NWD(13, 17), ujemne (`gcd(-12, 18) = 6`). Porównanie z `math.gcd`.
- **Znajdź błąd:** `if n % i == 0: return True` (odwrócone), `else: return True` w środku pętli (za wczesny wynik), `a, b = a % b, b`.
- **Metoda:** przykład rozwiązany (Euklides z śledzeniem) → wygaszanie → samodzielnie (pierwszość).

## Temat 23 — Działania na ułamkach zwykłych z NWD i NWW (koncepcja) (I.2.a, I.3)

*Wspólny z klasą 3 (temat 26).*
- **Hak:** przepis na 4 osoby, a gości jest 6 („2/3 szklanki mąki × 1,5”); fryzjer: 1/4 farby + 1/6 utleniacza; „dwa autobusy co 12 i 18 minut — kiedy odjadą razem?” (NWW).
- **Symulator (`numberLab`, tryb `fractions`):** paski ułamków do nakładania (wspólny mianownik widać), skracanie przez „sklejanie” pasków; kroki dodawania do ułożenia (NWW → rozszerzenie → dodanie liczników → skrócenie).
- **Pułapki:** 1/2 + 1/3 = 2/5 (dodawanie liczników i mianowników — pokazać na paskach, że to absurd), brak skracania, mylenie NWD i NWW, mianownik 0. NWW = a·b / NWD(a, b).
- **Produkt:** przeliczony przepis/mieszanka (na karcie wyniku).

## Temat 24 — Programowanie działań na ułamkach z NWD i NWW (I.2.a, I.3, II.1, II.2)

*Wspólny z klasą 3 (temat 27).*
- **Zadania:** `skroc(l, m)` → `dodaj(a, b, c, d)` → `pomnoz`, porównaj (`kto zjadł więcej pizzy`), mini-gra „Ułamkowy pojedynek” (program losuje dwa ułamki, uczeń podaje skróconą sumę, program sprawdza).
- **Testy:** 1/2 + 1/3, 1/2 + 1/2 = 1/1, 0/3 + 2/5, −1/2 + 1/2, 3/6 → 1/2, 5/0 → komunikat, 1/−2 → −1/2 (znak w liczniku). Sprawdzenie przez `Fraction`.
- **Znajdź błąd:** `mianownik = b * d` bez skracania (test 1/2 + 1/2 to wyłapuje), `licznik = a + c`.
- **Produkt:** „kalkulator przepisów/mieszanek” w Pythonie.

## Do podpięcia w tej klasie (bez pisania od nowa)

Tematy 8–9 (zawody pływackie, kwerendy Zawody) ← lekcje 22 i 25 z klasy 3 (cienkie pliki jak 23/27).

## Źródła z kwerendy (do weryfikacji)

- ZPE: Euklides (odejmowanie i reszta, Python) https://zpe.gov.pl/a/wprowadzenie/DmZdnWkJw ; algorytmy na liczbach naturalnych https://zpe.gov.pl/a/algorytmy-na-liczbach-naturalnych/Df0c0zlKj ; sito https://zpe.gov.pl/pdf/P7MwVxKT0 i w Pythonie https://zpe.gov.pl/a/przeczytaj/Dv5Vw064c ; faktoryzacja (rozszerzenie) https://zpe.gov.pl/pdf/P70KLe8Hb ; ułamki https://zpe.gov.pl/a/przeczytaj/DJBegp1N6
- Python Tutor https://pythontutor.com/visualize.html ; dokumentacja `math`, `fractions` https://docs.python.org/3/library/fractions.html
- Parsons — badania B. Ericson i in.: https://strathprints.strath.ac.uk/86100/ ; Runestone `parsonsprob` https://runestone.academy/ns/books/published/authorguide/directives/parsons.html
- Zadania do inspiracji: Exercism (sieve, collatz-conjecture, rational-numbers), CodingBat Warmup-2, archiwum CKE (liczby pierwsze, sito — tylko jako kontekst, poziom rozszerzony).
