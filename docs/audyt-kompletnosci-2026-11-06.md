# Audyt kompletności całej platformy — 6.11.2026

Zakres: 120 pozycji katalogu, 119 lekcji wewnętrznych, 698 etapów, plany nauczyciela, nawigacja, strona projektu i 29 różnych plików do pobrania. Archiwum starej wersji nie jest aktywnym kursem i nie jest częścią deklaracji gotowości. Nie dodano żadnych kont ani nie przesyłano prac uczniów.

## Wynik i poprawki

- Struktura: wszystkie aktywne typy ćwiczeń mają komponenty; brak brakujących plików pobierania, powtórzonych ID, niepoprawnych sum czasu i źródeł punktów bez zadania. Karty wyników istnieją w każdej lekcji wewnętrznej.
- Pary: 25 lekcji i ich wariantów ma spójną pracę solo. Usunięto naprzemienne wykonywanie zadania i obowiązek powtarzania go u drugiej osoby, również z treści symulatorów. Dotyczy 08, 09, 13, 14, 16, 17, 32, 33, 35, 36, 41, 51, 52, 55, 59, 62, 67, 72, 76, 93, 97, 112, 115, 119 i 121.
- Zachowano rzeczywistą rozmowę lub wspólny produkt, np. śledztwo 07 i sąd 39; nie zamieniano matematycznych par liter i liczb na instrukcje solo.
- E-usługi: do zaliczenia wymagane są trzy samodzielnie wykonane moduły, stałe maksimum 12 pkt, 18 minut praktyki i 3 minuty samokontroli. Odróżniono fikcyjny przykład podatkowy osoby pełnoletniej od profilu nastolatka. Zastrzeżenie PESEL dotyczy pełnoletnich, ulga dla młodych co do zasady jest stosowana przez płatnika automatycznie.
- Pięć zapowiedzi filmów bez nagrań zastąpiono dostępnymi instrukcjami tekstowymi; nie wymagano od ucznia oczekiwania na przyszły materiał.
- Odwołania do innych lekcji wskazują tytuły tematów zamiast numerów produkcyjnych. Przejrzano wszystkie 120 definicji, usunięto 95 mylących odwołań i poprawiono zapis „Z projektu107”. Przykład: „Z lekcji «Skracanie i działania arytmetyczne na ułamkach»” zamiast „Z lekcji 90”. Zachowano ID, adresy i nazwy plików.
- Naprawiono sześć testów Pyodide używających zakodowanej ścieżki ze spacjami. Testy błędnych klocków algorytmów mają limit wykonania, więc celowo zła pętla nie zawiesza zestawu.
- Test bazy danych uwzględnia celowe czyszczenie postępu po odświeżeniu na współdzielonych komputerach. Naprawiono wychodzenie obszaru tabeli arkusza poza ekran telefonu; mobilne układy są oceniane po załadowaniu CSS symulatora.

## Weryfikacja

Testy Node: **448/448** (treści, punktacja, logika symulatorów, rzeczywisty Pyodide i struktura materiałów). Testy przeglądarkowe: **271/271** — wszystkie etapy 119 lekcji przy szerokościach 390, 768 i 1280 px, widoki nauczyciela, kontrola axe, pobrania i scenariusze interakcji. Mapa: 120 lekcji, klasy 60/30/30, 28 punktów PP. Budowa produkcyjna przechodzi.

Automatyczna inspekcja wyłapuje brak osobnej sekcji reading w 173 etapach; nie jest to 173 brakujących lekcji. Wyjaśnienia są tam w kartach, instrukcjach lub symulatorach, a start i podsumowanie mogą być krótkimi pytaniami. Oznaczenia TODO w celowo błędnym kodzie startowym i polecenia „do uzupełnienia” są zadaniami ucznia, nie obietnicą dopisania treści później.

## Źródła i granice

Sprawdzono 17 różnych odnośników do metod COVE, źródła geograficznego i kursu zewnętrznego. 16 odpowiedziało HTTP 200; bezpośredni odczyt serwera Demagoga zwrócił 403 dla klienta skryptowego, ale przeglądarkowy odczyt źródła potwierdził stronę kursu. To zależność zewnętrzna do próby w szkolnej sieci, bez gwarancji logowania lub ukończenia kursu. Pozorne adresy w zadaniach o phishingu i fikcyjne domeny przykładów nie są traktowane jako niedziałające linki platformy.

Źródła korekt: [Ministerstwo Finansów — ulga dla młodych](https://podatki.gov.pl/ulgi-i-odliczenia/ulga-dla-mlodych-pit), [MF — automatyczne uwzględnianie ulgi](https://podatki.gov.pl/twoj-e-pit-rozlicz-roczny-pit-online/pytania-i-odpowiedzi/ulgi-i-odliczenia/96-czy-rozliczenie-w-usludze-twoj-e-pit-bedzie-uwzgledniac-ulge-dla-mlodych), [Ministerstwo Cyfryzacji — zastrzeżenie PESEL](https://www.gov.pl/web/cyfryzacja/zastrzez-pesel-i-zabezpiecz-sie-przed-oszustami-nowe-przepisy-od-1-czerwca-br). Odczytano metody COVE modelowania i oceniania kształtującego.

Gotowość materiału nie oznacza potwierdzenia wszystkich praktycznych umiejętności PP. Otwarta pozostaje próba edytorów ArtCraft i programów Office na szkolnych komputerach, wejścia do Classroom oraz rzeczywistego wydruku H2C. RobotLab nie potwierdza fizycznego montażu. Publikacja strony ucznia w internecie (II.3.f) jest omówiona, lecz zgodnie z dotychczasowym ustaleniem produkt pozostaje lokalny; nie deklarujemy wykonania tej czynności. Praca w różnych systemach operacyjnych i praktyczna obsługa urządzeń wymagają zajęć na rzeczywistym sprzęcie. Nie przeprowadzono walidacji każdej kombinacji samodzielnie napisanego kodu, wszystkich technologii wspomagających ani każdego zewnętrznego serwisu.

## Macierz sprawdzonych lekcji

| Klasa | ID | Tytuł | Etapy | Aktywności | Pobrania |
|---|---|---|---:|---:|---:|
| 1 | 01 | Komputer | 6 | 11 | 0 |
| 1 | 02 | System i oprogramowanie | 6 | 16 | 2 |
| 1 | 03 | Urządzenia w szkole | 6 | 13 | 0 |
| 1 | 04 | Urządzenia w domu | 6 | 11 | 0 |
| 1 | 07 | Internet jako ocean informacji | 5 | 10 | 0 |
| 1 | 08 | Przykłady wyszukiwania informacji | 6 | 9 | 0 |
| 1 | 09 | Korzystanie z wybranych e-usług | 6 | 14 | 0 |
| 1 | 28 | Nagłówek, stopka i standardowe style tekstu | 6 | 12 | 1 |
| 1 | 29 | Odwołania w dokumencie tekstowym – tworzenie spisu treści | 6 | 14 | 1 |
| 1 | 30 | Odwołania w dokumencie tekstowym – spis ilustracji, tabel i wykresów | 6 | 13 | 1 |
| 1 | 31 | Dzielenie dokumentu tekstowego | 5 | 11 | 1 |
| 1 | 32 | Praca w trybie recenzji | 5 | 12 | 1 |
| 1 | 33 | Praktyczny poradnik | 6 | 16 | 1 |
| 1 | 34 | Uodpornij się na fake news — kurs Demagoga | 0 | 0 | 0 |
| 1 | 35 | Tworzenie stron WWW – podstawowe informacje | 7 | 13 | 0 |
| 1 | 36 | Stosowanie wybranych znaczników języka HTML | 6 | 9 | 0 |
| 1 | 37 | Kaskadowe arkusze stylów CSS | 6 | 9 | 0 |
| 1 | 38 | Publikowanie i promowanie stron WWW w Internecie | 6 | 11 | 0 |
| 1 | 39 | Wybrane przepisy prawa dotyczące technologii informacyjno-komunikacyjnych | 6 | 11 | 0 |
| 1 | 40 | Zasady rozpowszechniania programów komputerowych – projekt | 7 | 12 | 0 |
| 1 | 41 | Komunikacja i wymiana informacji w Internecie | 7 | 9 | 0 |
| 1 | 42 | Szanse i zagrożenia związane z rozwojem informatyki i technologii informacyjno-komunikacyjnych – projekt | 5 | 10 | 0 |
| 1 | 43 | Przestępczość komputerowa – projekt | 6 | 13 | 0 |
| 1 | 58 | Sieci komputerowe | 6 | 11 | 0 |
| 1 | 59 | Bezpieczeństwo i ochrona danych w komputerach i sieciach komputerowych | 5 | 10 | 0 |
| 1 | 60 | Sytuacje problemowe i określanie specyfikacji zadania | 6 | 13 | 0 |
| 1 | 61 | Techniki algorytmiczne i programowanie | 6 | 11 | 0 |
| 1 | 62 | Środowisko programistyczne języka Python, stosowanie zmiennych i wyprowadzanie wyników | 6 | 11 | 0 |
| 1 | 63 | Algorytmy z warunkami w języku Python | 6 | 12 | 0 |
| 1 | 64 | Sprawdzanie poprawności danych i zapisywanie rozwiązania problemu w języku Python | 6 | 10 | 0 |
| 1 | 65 | Instrukcje warunkowe zagnieżdżone i z klauzulą elif w języku Python | 6 | 11 | 0 |
| 1 | 66 | Algorytmy iteracyjne w języku Python | 5 | 10 | 0 |
| 1 | 67 | Instrukcje iteracyjne zagnieżdżone w języku Python | 6 | 10 | 0 |
| 1 | 68 | Stosowanie instrukcji iteracyjnych for i while w języku Python | 7 | 10 | 0 |
| 1 | 69 | Tworzenie formuł, formaty danych i formatowanie tabeli arkusza | 5 | 13 | 1 |
| 1 | 70 | Stosowanie funkcji arkusza kalkulacyjnego | 5 | 14 | 1 |
| 1 | 71 | Przedstawianie danych w postaci wykresu | 5 | 14 | 1 |
| 1 | 72 | Tworzenie wykresu – projekt z geografii | 6 | 14 | 1 |
| 1 | 73 | Korzystanie z filtrów, tabele i wykresy przestawne | 5 | 13 | 1 |
| 1 | 74 | Stosowanie filtru w tabeli przestawnej i praktyczny poradnik | 5 | 13 | 1 |
| 1 | 75 | Zasady tworzenia prezentacji multimedialnej | 6 | 15 | 2 |
| 1 | 76 | Tworzymy prezentację multimedialną o Fryderyku Chopinie – projekt | 6 | 15 | 1 |
| 1 | 77 | Funkcje zwracające wartość w języku Python | 6 | 7 | 0 |
| 1 | 78 | Funkcje niezwracające wartości w języku Python | 6 | 7 | 0 |
| 1 | 79 | Definiowanie i stosowanie listy w języku Python | 6 | 7 | 0 |
| 1 | 80 | Wykonywanie operacji na elementach listy w języku Python | 6 | 7 | 0 |
| 1 | 81 | Dane tekstowe w języku Python | 7 | 11 | 0 |
| 1 | 92 | Wybrane algorytmy na tekstach | 6 | 7 | 0 |
| 1 | 93 | Programowanie wybranych algorytmów na tekstach | 6 | 9 | 0 |
| 1 | 94 | Wyszukiwanie wzorca w tekście metodą naiwną | 4 | 6 | 0 |
| 1 | 95 | Programowanie algorytmu wyszukiwania wzorca w tekście metodą naiwną | 6 | 8 | 0 |
| 1 | 96 | System dwójkowy | 4 | 10 | 0 |
| 1 | 97 | System szesnastkowy | 5 | 6 | 0 |
| 1 | 98 | Programowanie zamiany reprezentacji liczb między pozycyjnymi systemami liczbowymi | 6 | 7 | 0 |
| 1 | 99 | Tworzenie obrazu i praca z warstwami w programie GIMP | 6 | 10 | 2 |
| 1 | 100 | Stosowanie narzędzi selekcji w programie GIMP | 6 | 10 | 2 |
| 1 | 101 | Edycja zdjęć w programie GIMP | 6 | 9 | 1 |
| 1 | 102 | Tworzenie rysunków w grafice wektorowej | 6 | 11 | 3 |
| 1 | 103 | Rysowanie figur i ścieżek w programie Inkscape | 6 | 9 | 1 |
| 1 | 104 | Rysowanie przestrzenne, przekształcenia i warstwy w programie Inkscape | 6 | 9 | 1 |
| 2 | 05 | Tworzenie bazy danych – obsługa gabinetu stomatologicznego | 6 | 10 | 0 |
| 2 | 10 | Importowanie danych z innych dokumentów do tabeli bazy danych | 6 | 11 | 1 |
| 2 | 11 | Przygotowanie kwerend w bazie Stomatolog | 6 | 10 | 0 |
| 2 | 12 | Przygotowanie korespondencji seryjnej | 6 | 11 | 1 |
| 2 | 16 | Szyfrowanie tekstu metodą podstawieniową | 6 | 9 | 0 |
| 2 | 17 | Programowanie algorytmu szyfrowania tekstu metodą podstawieniową | 7 | 10 | 0 |
| 2 | 18 | Algorytmy porządkowania liczb | 6 | 9 | 0 |
| 2 | 19 | Programowanie algorytmów porządkowania metodą bąbelkową | 7 | 9 | 0 |
| 2 | 20 | Programowanie algorytmów porządkowania przez wstawianie | 6 | 9 | 0 |
| 2 | 21 | Obliczanie wartości elementów ciągu metodą iteracyjną, w tym wartości elementów ciągu Fibonacciego | 7 | 11 | 0 |
| 2 | 44 | Podstawowe pojęcia i przykłady bazy danych – obsługa szkolnych zawodów pływackich | 6 | 10 | 0 |
| 2 | 45 | Zasady tworzenia kwerend na przykładzie bazy Zawody | 6 | 10 | 0 |
| 2 | 46 | Programowanie algorytmów iteracyjnych | 6 | 11 | 0 |
| 2 | 47 | Wybrane algorytmy na liczbach | 6 | 8 | 0 |
| 2 | 48 | Programowanie wybranych algorytmów na liczbach | 6 | 12 | 0 |
| 2 | 49 | Działania na ułamkach zwykłych z wykorzystaniem NWD i NWW | 6 | 8 | 0 |
| 2 | 50 | Programowanie działań na ułamkach z wykorzystaniem NWD i NWW | 6 | 10 | 0 |
| 2 | 82 | Sterowanie nawadnianiem ogrodu – wprowadzenie do robotyki i zadanie projektowe | 5 | 5 | 0 |
| 2 | 83 | Sterowanie nawadnianiem ogrodu – zadania szczegółowe | 5 | 5 | 0 |
| 2 | 84 | Projekt „Zamknij okno” | 5 | 5 | 0 |
| 2 | 85 | Projekt „Wycisz radio” | 5 | 5 | 0 |
| 2 | 86 | Budowanie robota – przygotowanie pomocy i montowanie układu | 5 | 5 | 0 |
| 2 | 105 | Budowanie robota – tworzenie oprogramowania | 5 | 5 | 0 |
| 2 | 110 | Od bryły do breloka — pierwszy model 3D | 6 | 9 | 1 |
| 2 | 111 | Mała ławka — kopiowanie, wyrównanie i połączenia | 6 | 9 | 1 |
| 2 | 112 | Ogród na planie — skala i wymagania projektu | 6 | 9 | 1 |
| 2 | 113 | Ogród w miniaturze — od planu 2D do modelu 3D | 6 | 9 | 1 |
| 2 | 114 | Mój pokój w skali — przestrzeń, której nie zabiera kamera | 6 | 9 | 1 |
| 2 | 115 | Własny mebel — moduł z bryły i otworu | 6 | 9 | 1 |
| 2 | 116 | Od modelu do wydruku — poprawa, STL i podgląd warstw | 6 | 9 | 1 |
| 3 | 06 | Logiczny model komputera i system dwójkowy | 6 | 15 | 0 |
| 3 | 13 | System szesnastkowy | 5 | 8 | 0 |
| 3 | 14 | Urządzenia cyfrowe w szkole | 5 | 10 | 0 |
| 3 | 15 | Urządzenia cyfrowe w domu i inne | 6 | 10 | 0 |
| 3 | 22 | Podstawowe pojęcia i przykład bazy danych – obsługa szkolnych zawodów pływackich | 6 | 10 | 0 |
| 3 | 23 | Tworzenie bazy danych – obsługa gabinetu stomatologicznego | 6 | 11 | 0 |
| 3 | 24 | Tworzenie bazy danych – zadania | 6 | 8 | 0 |
| 3 | 25 | Zasady tworzenia kwerend na przykładzie bazy Zawody | 6 | 10 | 0 |
| 3 | 26 | Importowanie danych i przygotowywanie kwerend w bazie Stomatolog | 6 | 7 | 0 |
| 3 | 27 | Przygotowanie korespondencji seryjnej | 6 | 11 | 1 |
| 3 | 51 | Podstawowe pojęcia dotyczące szyfrowania i szyfrowanie tekstu metodą podstawieniową | 6 | 9 | 0 |
| 3 | 52 | Programowanie algorytmu szyfrowania podstawieniowego | 7 | 10 | 0 |
| 3 | 53 | Wybrane algorytmy na tekstach | 6 | 8 | 0 |
| 3 | 54 | Praca z danymi tekstowymi w języku Python | 7 | 12 | 0 |
| 3 | 55 | Programowanie algorytmów na tekstach w języku Python – porównywanie tekstów i zliczanie znaku w tekście | 6 | 10 | 0 |
| 3 | 56 | Programowanie algorytmów na tekstach w języku Python – wyszukiwanie wzorca w tekście | 6 | 9 | 0 |
| 3 | 57 | Programowanie zamiany liczby dwójkowej na dziesiętną | 6 | 10 | 0 |
| 3 | 87 | Programowanie zamiany liczby dziesiętnej na dwójkową | 6 | 8 | 0 |
| 3 | 88 | Zamiana liczb między systemami pozycyjnymi | 6 | 7 | 0 |
| 3 | 89 | Działania na ułamkach z wykorzystaniem NWD i NWW | 6 | 8 | 0 |
| 3 | 90 | Skracanie i działania arytmetyczne na ułamkach | 6 | 10 | 0 |
| 3 | 91 | Etapy tworzenia strony internetowej | 6 | 8 | 0 |
| 3 | 106 | Projekt sterowania nawadnianiem ogrodu | 5 | 5 | 0 |
| 3 | 107 | Budowanie robota i inne zadania projektowe | 5 | 5 | 0 |
| 3 | 108 | Nowy wygląd strony internetowej o Wyspach Kanaryjskich | 6 | 7 | 0 |
| 3 | 117 | Pierwszy model 3D: tabliczka z otworem | 6 | 9 | 1 |
| 3 | 118 | Mała ławka: powtarzalne bryły i połączenia | 6 | 9 | 1 |
| 3 | 119 | Ogród w miniaturze: od planu 2D do modelu 3D | 6 | 9 | 1 |
| 3 | 120 | Pokój w skali: własny mebel zamiast gotowca | 6 | 9 | 1 |
| 3 | 121 | Od pomysłu do pliku: mały projekt do druku 3D | 6 | 9 | 1 |
