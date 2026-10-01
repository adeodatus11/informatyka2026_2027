# Pokrycie PP i dalsza ścieżka Pythona

Stan 01.10.2026, 33 lekcje (klasy: 13/10/10). Numery poniżej to **stałe ID**, a nie numery lekcji w klasie. „Jest” oznacza zestaw ćwiczeń obejmujący treść punktu, nie zaliczenie umiejętności przez każdego ucznia. „Częściowo” oznacza dowód realizacji fragmentu; „brak” — brak odpowiednich obowiązkowych zadań w aktualnym kursie. Dodatki i zadania opcjonalne nie są automatycznie traktowane jako wymagane pokrycie.

## Macierz wszystkich wymagań szczegółowych

| Punkt | Stan w materiałach | ID / czego jeszcze potrzeba |
| --- | --- | --- |
| I.1 | Jest | 17, 19–21: problem, rozwiązanie, kod i testy. Projekty 05/23/24 wspierają modelowanie, lecz nie cały cykl programistyczny. |
| I.2.a | Częściowo | 06/13: systemy liczbowe. Brak badania pierwszości i działań na ułamkach z NWD/NWW. |
| I.2.b | Częściowo | 16/17: Cezar. Brak osobnych algorytmów porównywania tekstów i naiwnego wyszukiwania wzorca. |
| I.2.c | Jest | 18–20: bąbelkowe i przez wstawianie, także implementacje. |
| I.2.d | Jest | 21: iteracyjne ciągi, w tym Fibonacci. |
| I.3 | Jest | 17, 19–21: testy i debugowanie; 06/13: sprawdzenie konwersji. |
| II.1 | Częściowo | 17, 19–21: działający Python, wejście/wyjście, warunki, pętle i funkcje z parametrami. Dopełnić wszystkie algorytmy I.2 i jawne zadanie z funkcją bez parametrów. |
| II.2 | Częściowo | 02: dobór aplikacji. Dodać uzasadniony wybór środowiska/zasobów i elementy robotyki. Symulator domu nie dowodzi pracy z robotem. |
| II.3.a | Brak | Uczeń nie projektuje grafiki rastrowej/wektorowej ani modeli 2D/3D i nie przekształca formatów. Oglądanie modelu komputera w 01 tego nie zastępuje. |
| II.3.b | Jest — zakres narzędzi | 28–33: dokumenty o rozbudowanej strukturze, sekcje, kolumny, spis treści, spisy ilustracji/tabel/wykresów i recenzja; 12/27: korespondencja seryjna. Działanie mechanizmów Worda potwierdza nauczyciel w DOCX. Dla pełnego przekroju tematycznego zaplanować także opracowanie o tematyce informatycznej. |
| II.3.c | Brak | Brak pełnego zadania w arkuszu: funkcje, dane z różnych źródeł, filtry, wykresy i tabele/wykresy przestawne. |
| II.3.d | Jest | 05+11; 22–26: co najmniej dwie tabele, relacje, filtrowanie i samodzielne kwerendy. |
| II.3.e | Brak | Uczeń nie tworzy własnej prezentacji multimedialnej. Oglądanie materiału nie wystarcza. |
| II.3.f | Brak | Brak stworzenia i opublikowania przez ucznia strony z tabelami, listami i CSS. |
| II.4 | Częściowo | 07/08: ocena źródeł i wyszukiwanie w symulatorze. Dodać obowiązkowe wyszukanie zasobów w sieci i wykorzystanie ich w rozwiązaniu. |
| III.1 | Jest | 01/04/14/15: poznawanie możliwości urządzeń i ich oprogramowania. |
| III.2 | Częściowo | 03/04/14/15: objaśnianie i symulacje; potrzebna potwierdzona praktyczna obsługa urządzeń. |
| III.3 | Częściowo | 02: pliki i system; dodać to samo zadanie w dwóch różnych systemach operacyjnych. |
| III.4 | Częściowo | 04/07/13/14: usługi, sieć, MAC. Uzupełnić spójne zadanie o ogólnej budowie Internetu oraz identyfikacji przez IP i nazwy/DNS. |
| IV.1 | Jest | 12/15/17/27/32/33: projekty rozwiązujące problem; w 15/32/33 także informacja zwrotna i poprawa. W 33 plan pracy, test czytelnika i końcowe wydanie. |
| IV.2 | Częściowo | 09 i konteksty zawodowe: e-usługi; uzupełnić społeczne skutki technologii i komunikację. |
| IV.3 | Brak | Potrzebne zadanie o wykluczeniu/włączeniu cyfrowym i korzyściach dla osób o specjalnych potrzebach. Dostępność samej strony nie wystarcza. |
| IV.4 | Brak | Potrzebne zadanie o świadomym, bezpiecznym budowaniu wizerunku w mediach. |
| IV.5 | Częściowo | Kurs jest zasobem do e-nauczania; dodać samodzielny wybór zasobu i wykazanie, czego uczeń się dzięki niemu nauczył. |
| V.1 | Częściowo | 04/07/09/14/15: dane, bezpieczeństwo i komunikacja. Dodać prawo autorskie, konsekwencje naruszeń i szerszą netykietę. |
| V.2 | Brak | Brak obowiązkowego zadania wymagającego sprawdzenia licencji oraz legalnego udostępnienia własnego/cudzego programu i dokumentu. Zachowanie informacji o źródłach w 33 jest dobrym nawykiem, lecz nie zastępuje tego zadania. |
| V.3 | Częściowo | 04/07/09/14–17: uprawnienia, phishing, 2FA, IoT i rola szyfrowania. Utrwalić praktyczną ochronę danych i systemu, odzyskiwanie dostępu/kopie. |
| V.4 | Częściowo | 07/14 pokazują ryzyka dla osoby i szkoły. Dodać jawne omówienie szkód działań pirackich dla instytucji i społeczeństwa. |

## Python: wykorzystać istniejący ciąg, uzupełnić luki

Nie tworzymy ponownie lekcji, które już istnieją. Punkt startowy: 16 → 17 → 18 → 19 → 20 → 21. Testy w `pythonLab` sprawdzają wykonany kod, a nie tylko zaznaczenie odpowiedzi. Funkcje bez parametrów powinny mieć osobny dowód: użycie `print()` lub `input()` nie dowodzi napisania własnej takiej funkcji.

| Kolejny moduł do przygotowania | Powiązanie | Minimalny rezultat ucznia |
| --- | --- | --- |
| Pierwszość liczby | I.2.a, I.3, II.1 | Własna funkcja, próby dla liczb <2, liczby pierwszej i złożonej; uzasadnienie warunku końca. |
| NWD/NWW i ułamki | I.2.a, I.3, II.1 | Skracanie i dodawanie ułamków, kontrola zerowego mianownika; Euklides jako wybrany sposób obliczenia NWD. |
| Konwersje w Pythonie | I.2.a, I.3, II.1; rozwinięcie 06/13 | Własna konwersja między systemami, test dla zera, wynik porównany z funkcją biblioteczną. Samo `bin()` nie pokazuje algorytmu. |
| Porównywanie tekstów i naiwny wzorzec | I.2.b, I.3, II.1 | Porównanie znaków oraz pętla szukająca wzorca; testy braku dopasowania, dopasowania na końcu i nakładania się wystąpień. |
| Mały projekt zamykający konstrukcje języka | I.1, II.1, IV.1 | Program z własną funkcją bez parametrów, funkcją z parametrami, wejściem/wyjściem, warunkiem, iteracją i zestawem testów. |

To propozycje autorskie realizacji PP, nie dodatkowe wymagania prawne ani skopiowane scenariusze Migry. Rekurencyjny Fibonacci, GA-DE-RY-PO-LU-KI czy formalna analiza złożoności mogą zostać jako dodatki; nie zastępują obowiązkowych brakujących algorytmów.

## Pozostałe priorytety

1. Arkusz: dane z kilku źródeł, funkcje, filtrowanie, wykres i tabela/wykres przestawny — możliwy kontekst zawodów lub kosztów energii.
2. Prezentacja i transfer pracy z dokumentem: własna prezentacja multimedialna oraz zastosowanie narzędzi z 28–33 do opracowania o tematyce informatycznej. Sekcje, spisy, kolumny i recenzja mają już obowiązkowe zadania.
3. Grafika i strona: własne pliki rastrowe/wektorowe, model 2D/3D, przekształcenie formatów; następnie strona z CSS, tabelą i listą oraz publikacja.
4. Uzupełnienia przekrojowe: robotyka, różne systemy operacyjne, licencje, wizerunek cyfrowy, wykluczenie i dostępność.

Kontrolować transfer z symulatorów na rzeczywiste narzędzia. Nie wymaga to prawdziwych danych pacjentów, płatności, logowania do banku ani wysyłania korespondencji — zadania powinny wykorzystywać fikcyjne dane i bezpieczne środowiska.
