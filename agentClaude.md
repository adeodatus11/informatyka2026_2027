# Przekazanie pracy i audyt dla Claude’a — 26.10.2026

## Najpierw przeczytaj

**Audyt wykazał problemy do poprawy. Nie jest to potwierdzenie pełnej zgodności ani gotowości nowych lekcji do publikacji.** Struktura kursu, zarezerwowane ID i zasadnicza kolejność nauczania odpowiadają zleceniu, ale są błędy w poleceniach, ocenianiu, testach i adaptacji starszych lekcji. Konkretne ustalenia i sposób ich odtworzenia są poniżej.

Użytkownik zlecił A1 → A2 → B → C → D, osobny PR na każdy punkt, bez samodzielnego scalania; potem osobny przegląd numeracji. Następnie poprosił o audyt względem poprzednich lekcji i produkcji oraz o ten plik **bezpośrednio na `main`**. Podczas audytu nie zmieniano kodu lekcji ani gałęzi PR. Na `main` trafia wyłącznie ten raport. **Wszystkie ustalenia F01–F20 pozostają otwarte w wersjach wskazanych w tabeli.**

Kolejność lektury: [AGENTS.md](AGENTS.md), [zlecenie](docs/zlecenie-codex.md), [profil ucznia](docs/profil-ucznia.md), [przewodnik](docs/przewodnik-wykonawcy.md), [blueprint](docs/lesson-blueprint.md), [COVE](docs/metodyka-cove.md), [rozkład](docs/rozklad-2026-2027.md), [mapowanie PP](docs/podstawa-programowa/README.md). Ten raport ułatwia kontrolę; nie zastępuje tych dokumentów.

## Co rzeczywiście jest na produkcji

Punktem odniesienia audytu jest `main` **`9507c8bbde974157556e6547d47e631b98a5bbaf`**, po PR #23. Stan zdalny sprawdzono przez ponowne pobranie referencji GitHuba 26.10.2026. Późniejszy commit z tym raportem nie zmienia aplikacji.

- Produkcja: [informatyka.szkolamistrzow.info](https://informatyka.szkolamistrzow.info/), GitHub Pages z katalogu głównego `main`.
- Źródła produkcji: **76 lekcji**, klasy **42 / 17 / 17**. Liczniki obejmują także dodatkowy kurs Demagoga, a nie wyłącznie szkolne tematy.
- Pobrany produkcyjny `index.html` i wskazany przez niego `assets/index-DELbIPZl.js` były **bajtowo identyczne** z plikami tego `main`. SHA-256: HTML `376ebd1fae5aa7886f658a262b063be7a07ef5e0e4fa7ec2eeebb02703f7aa1a`; JS `bea0471ea88524a9a0fe8bc13762c220791aeb10ca573bc3926a515bd0f1408c`.
- Produkcyjny adres `/lesson/77/` zwrócił HTTP 404. Nowe lekcje nie zostały wdrożone. Porównanie HTML i głównego JS nie jest pełnym audytem wszystkich zasobów witryny.
- Robocza kopia łącząca zmiany sześciu PR ma **108 lekcji**, klasy **60 / 23 / 25**: przyrost **32**, czyli A1 12 + A2 6 + B 6 + C 8. Ta kopia służyła kontroli integracji; nie została scalona do `main`.
- Po połączeniu: klasa 1 ma 59 gotowych tematów i 1 pozostawiony do decyzji (temat 8, e-usługi); klasa 2 ma 23 gotowe i 7 brakujących tematów 3D; klasa 3 ma 25 gotowych, 5 brakujących 3D i 2 sprawdziany poza platformą. D nie zalicza tematów 3D jako wykonanych.

## PR-y i dokładne wersje audytu

26.10.2026 wszystkie poniższe PR-y były **otwarte, niescalone, skierowane do `main`**. Wspólna baza: powyższe `9507c8b`. Nie myl numeru PR, trwałego ID lekcji i numeru tematu w klasie.

| Punkt | PR | Gałąź | Audytowany HEAD | Lekcje / tematy |
|---|---|---|---|---|
| A1 | [#24](https://github.com/adeodatus11/informatyka2026_2027/pull/24) | `codex/kl1-python` | `ccc3aab718085714a9d187ff57c50c6e820ee4b7` | ID 77–81, 92–98; kl. 1, tematy 49–60 |
| A2 | [#25](https://github.com/adeodatus11/informatyka2026_2027/pull/25) | `codex/kl1-grafika-artcraft` | `dffdac4f34915736461248bd54d2ee3aa5e8e352` | ID 99–104; kl. 1, tematy 15–17 i 37–39 |
| B | [#26](https://github.com/adeodatus11/informatyka2026_2027/pull/26) | `codex/kl2-robotyka` | `e21392edd946134cc20c98d6532c86254e9b195d` | ID 82–86, 105; kl. 2, tematy 25–30 |
| C | [#27](https://github.com/adeodatus11/informatyka2026_2027/pull/27) | `codex/kl3-systemy-robotyka-www` | `46d8c5802dae80dc7f0b8ae4583743c19cd3a96e` | ID 87–91, 106–108; kl. 3, tematy 24–27 i 29–32 |
| D | [#28](https://github.com/adeodatus11/informatyka2026_2027/pull/28) | `codex/grafika-3d-propozycja` | `c5f33ddce556e28058b78f7f300af9d3e5104dd4` | Wyłącznie propozycja, bez lekcji |
| Numeracja | [#29](https://github.com/adeodatus11/informatyka2026_2027/pull/29) | `codex/poprawa-numeracji` | `4c8b2ea635fdaa8be6e2020652b51c4e0d8d731c` | Wspólne etykiety tematów, bez nowych ID |

## Co Codex przygotował

**A1:** nowe funkcje i listy w `77–80-python-g1.js`, adaptacje tekstów `81/92/93/95-reuse-g1.js`, osobne wyszukiwanie bez kodu `94-pattern-concept-g1.js`, systemy `96-binary-g1.js`, `97-reuse-g1.js`, konwersje `98-python-g1.js`. Wykorzystano istniejący `pythonLab`, bez zmiany jego wspólnego kodu. Dodano `tests/sims-g1-python-c.test.mjs` i zaktualizowano rozkład, mapy oraz pliki publikacji. W końcowej korekcie poprawiono wskazówki nauczyciela w 94/96 i przypisanie PP lekcji 97 do I.2.a/I.3. Audyt poniżej ujawnia dalsze braki adaptacji.

**A2:** sześć lekcji `99–101-photocraft.js`, `102–104-vectorcraft.js` oraz małe, autorskie materiały PNG/SVG CC0 w `public/materials/grafika/`. Generator materiałów: `scripts/build-graphics-materials.mjs`; testy: `tests/sims-g1-graphics.test.mjs`. Zachowano szkolne tytuły z GIMP/Inkscape, a faktyczne aplikacje wskazano w podtytułach i instrukcjach. Jedyna zmiana we wspólnym źródle aplikacji tego punktu: dwa wpisy w `content/desktop-apps.js`. Użyto istniejących `wordSteps` i `wordRubric`; samoocena nie udaje automatycznej oceny obrazu, karta ma `hideGrade:true`.

Najpierw sprawdzono wydania i dokumentację PhotoCraft **0.16.0** oraz VectorCraft **0.17.0**; opis źródeł, instalacji i ograniczeń jest w `docs/artcraft-desktop.md` na gałęzi A2. Chodzi o samodzielne programy desktopowe, bez konta i usług AI; strona pobierania innego produktu ArtCraft nie jest właściwą instrukcją instalacji. Wskazano zgłoszone błędy i wariant GIMP/Inkscape. **Nie testowano szkolnego Windows 11.** Konieczna jest próba otwarcia, edycji, ponownego zapisu i eksportu na rzeczywistym stanowisku.

**B:** sześć lekcji `82–86-robotics-g2.js`, `105-robotics-g2.js`; nowy symulator w `components/sims/robotLab.jsx`, `robotLab.css`, `content/sims/robotLab.js`. Programy uruchamiają prawdziwy Python w Pyodide, z edukacyjnym API `read/write/sleep_ms`, scenariuszami, wykresem i tabelą. Montaż Rover-2 eksportuje lokalny JSON do następnej lekcji. Dodano `tests/sims-g2-robot.test.mjs` i `tests/robot-config.spec.js`. Poprawiono wyścig przy asynchronicznym **imporcie JSON**, używając najnowszego stanu; **nie rozwiązuje to F02 przy uruchamianiu programu**. Błędy składni i nazw mają polskie objaśnienia.

**C:** osiem lekcji: `87-decimal-to-binary-g3.js`, `88-positional-systems-g3.js`, `89-fractions-g3.js`, `90-fractions-python-g3.js`, `106-irrigation-g3.js`, `107-rover-g3.js`, `91-website-stages-g3.js`, `108-canary-css-g3.js`. 89/90 adaptują 49/50; 91 zaczyna HTML od podstaw, 108 daje gotową treść i pozwala edytować CSS. Ilustracje SVG są autorskie, podpisane jako ilustracje. Publikacja strony w internecie jest omawiana; uczeń faktycznie pobiera plik i ogląda lokalny podgląd. Testy: `sims-g3-numbers.test.mjs`, `sims-g3-html.test.mjs`.

C zawiera również **te same trzy pliki robotLab i test importu co B**, aby samodzielny PR do `main` dało się zbudować. Nie dodaje ponownie sześciu lekcji klasy 2. Przy integracji należy zachować jedną wersję wspólnego symulatora, z poprawkami zastosowanymi spójnie w obu PR.

**D:** tylko `docs/notatki-realizacji/grafika-3d-propozycja.md`. Porównanie Sweet Home 3D, FreeCAD i Blendera oraz osobne ograniczenia kont/wieku SketchUp for Web i Tinkercad, ze źródłami. Propozycja: Sweet Home 3D do aranżacji, FreeCAD do własnych modeli; decyzja pozostaje nauczycielowi. Brak nowych lekcji, ID, materiałów ćwiczeń i zmian kodu.

**Numeracja:** `content/lesson-numbering.js` oblicza etykietę z `order` szkolnego rozkładu: „Temat N”. Kurs dodatkowy otrzymuje „Materiał dodatkowy”. Zmieniono katalog i nagłówki w `app/main.jsx`, widoki nauczyciela i druk w `components/teacher.jsx`, dodano `tests/lesson-numbering.test.mjs`, doprecyzowano AGENTS i README mapowania. Przykłady: ID 09 → temat 7, 35 → 18, 44 → 8, 53 → 17. Trwałe ID, adresy i ciągły indeks `numberInGrade` w mapie PP pozostają osobnymi pojęciami. **Odsyłacze w treści nie zostały w pełni naprawione: F12.**

A1, A2, B i C aktualizują własne wersje `docs/rozklad-2026-2027.{md,json}`, mapowania, czytelnej mapy PP i macierzy pokrycia. PR-y z kodem zawierają także wygenerowane pliki Pages. Ich dokumentacji i pakietów wynikowych nie można po prostu nadpisywać kolejno bez integracji.

## Założenia zgodne i granice oceny

- Główna ścieżka klasy 1: 60–68 (podstawy i pętle) → 77 `def/return` → 78 `print/None` → 79 listy → 80 operacje → 81 napisy → 92 koncepcje algorytmów → 93 programowanie → 94 koncepcja wyszukiwania → 95 implementacja → 96/97 zapis liczb → 98 konwersje. Podział 94 bez kodu / 95 z kodem zachowano. Szczegółowe luki przygotowania: F07–F11.
- Klasa 2: 50 (ułamki w Pythonie) → 82–85 sterowanie → 86 montaż → 105 program tego samego Rover-2. Klasa 3: 57 → 87 → 88 → 89 → 90; następnie, po szkolnym sprawdzianie z rozkładu, 106 → 107 → 91 → 108. 89 jawnie wprowadza NWD/NWW. Import konfiguracji albo jawnie opisane odtworzenie wzorcowego modelu zachowuje ciągłość robota.
- Wszystkie 32 nowe lekcje mają sumę czasów **45 min**, **4–7 etapów**, powtórkę i kartę wyniku. Zgodność sum nie dowodzi realnego tempa pracy słabszej grupy; F08/F11 wymagają korekty lub próby dydaktycznej.
- Zachowano istniejący układ React i typy aktywności. Samodzielna ścieżka jest dostępna; pary nie wymagają sztywnych ról. Nie dodano kont ani pracy domowej. Zwykłe odpowiedzi w aplikacji znikają po odświeżeniu; ręcznie pobrane pliki i konfiguracja JSON są osobnym zapisem.
- Praca desktopowa w A2 jest wyraźnym wyjątkiem ze zlecenia i decyzji nauczyciela. Starszego ogólnego „wszystko w przeglądarce” nie należy używać do usunięcia tego wyjątku. Podobnie nowsze „bez sztywnych ról” oraz „nie scalaj sam” mają pierwszeństwo przed starszymi, ogólnymi wskazówkami dokumentacji.
- Metody COVE mają wskazane aktualne adresy i czynności w scenariuszach, a nie tylko nazwy. W A2 rytm sześciu lekcji jest bardzo podobny; warto ocenić go w klasie. Test struktury nie potwierdza skuteczności dydaktycznej.
- Mapa dotyczy PP 2024 liceum/technikum, zakres podstawowy. 28 punktów PP to liczba różnych punktów w mapie, **nie dowód ich pełnej realizacji**. Symulator nie potwierdza obsługi fizycznego zestawu; ilustracja w 101 nie dowodzi jeszcze edycji rzeczywistej fotografii. Tytuły rozkładu zachowano zgodnie ze zleceniem.

## Otwarte ustalenia audytu — najpierw zachowanie aplikacji

Priorytety: **P1** — polecenie prowadzi do niedziałającego obowiązkowego przebiegu; **P2** — błąd wyniku, nauczania lub istotne niespełnienie zlecenia; **P3** — metadane, standard albo pozostała niespójność opisu. Priorytety są oceną audytu. Linki prowadzą do dokładnych commitów z tabeli, więc późniejsze poprawki nie zmienią dowodu.

### F01 — P1, A1: połączenie funkcji w 98 nie działa

[98-python-g1.js:259–280][src98]: instrukcja każe wykonać `zapis(odczyt("ff", 16), 2)`, lecz edytor `98-own` zawiera tylko `zapis`. Każdy program `pythonLab` ma osobną przestrzeń nazw (`content/sims/pythonLab.js:112–132`); definicja z poprzedniego edytora nie przechodzi dalej. **Odtworzono w prawdziwym Pyodide:** rozwiązanie `98-own` + wskazane wywołanie daje `NameError: name 'odczyt' is not defined`. Dostarczyć `odczyt` w tym samym pliku lub jawnie poprowadzić połączenie obu definicji; dodać test całego polecenia, nie tylko osobnych funkcji.

### F02 — P2, B/C: spóźniony wynik nadpisuje nowszy kod

[components/sims/robotLab.jsx:18–29][robot-ui]: `run()` przechowuje wcześniejsze `v` i `code`, czeka na `runPython`, potem zapisuje je ponownie. Edytor, wybór scenariusza i konfiguracja pozostają aktywne. Pisanie podczas ładowania/wykonania może przywrócić wcześniejszy kod i przypisać mu wynik. To ustalenie analizy przepływu stanu; potrzebna jest kontrolowana regresja interfejsu z opóźnionym wykonaniem. Zachować nowe dane i odrzucać wynik dla nieaktualnej wersji programu albo świadomie zablokować edycję na czas wykonania. Istniejący test importu JSON tego nie sprawdza.

### F03 — P2, B/C: powtórzenie poprawnego sprawdzenia obniża ocenę

[robotLab.jsx:13,20,30][robot-ui] i [content/sims/robotLab.js:21,54][robot-logic]: licznik rośnie po każdym sprawdzeniu, a nie tylko po błędzie. **Odtworzono:** to samo poprawne rozwiązanie dostaje kolejno **8/8, 7/8, 6/8**. Dotyczy programu i montażu. Komunikat obiecuje obniżkę „po błędzie”. Liczyć błędy albo zachować najlepszy wynik niezmienionego rozwiązania; sprawdzić wielokrotne kliknięcie w interfejsie.

### F04 — P2, B/C: testy Rover-2 nie rozstrzygają priorytetu STOP

[content/sims/robotLab.js:29,36,53][robot-logic], lekcje 105/107. Żadna próbka nie łączy STOP z przeszkodą ≤20 cm ani utratą linii. **Odtworzono w Pyodide:** zamiana kolejności warunków tak, aby przeszkoda była przed STOP, nadal przechodzi oba scenariusze i daje **8/8**. To przeczy deklarowanemu sprawdzaniu priorytetu w 107. Dodać STOP + przeszkoda oraz STOP + brak linii i testy odrzucające błędne warianty.

### F05 — P2, B/C: granice histerezy sprawdzane w nierozstrzygającym stanie

[content/sims/robotLab.js:26,28,33,35][robot-logic]. **Odtworzono w Pyodide:** `wilgotnosc <= 30` zamiast `< 30` w `gardenHysteresis` oraz `halas >= 70` zamiast `> 70` w `radio` przechodzą wszystkie aktualne scenariusze i dają **8/8**. Dodać 30% przy wyłączonej pompie i dokładnie 70 przy grającym radiu. Samo wystąpienie liczby granicznej w scenariuszu nie wystarcza, gdy poprzedni stan ukrywa różnicę.

### F06 — P2, C: 108 uznaje interlinię 1,4 px za czytelną

[108-canary-css-g3.js:187–196 i 263–272][src108]: kryterium `line-height` używa `test:"minPx", value:1.4`. **Odtworzono przez rzeczywisty `analyze/runChecks`:** `body {font-size:18px; line-height:1.4px; color:#182f38; background-color:#fff;}` zalicza wszystkie trzy kryteria typografii. Rozróżnić mnożnik bez jednostki od długości; dla długości porównywać interlinię z rozmiarem pisma. Dodać kontrprzykład 1,4 px i poprawne przykłady z różnymi jednostkami.

## Otwarte ustalenia — ciągłość nauczania i numeracja

### F07 — P2, A1: 96 traci wyjaśnienia lekcji bazowej

[96-binary-g1.js:8–10][src96] kopiuje etapy `read/write/summary` z 06, ale ich notatki są w `lessonNotes['06']`, nie bezpośrednio w etapach. `components/lesson-reading.jsx:4` szuka notatek po nowym ID 96, dla którego nie ma wpisu. Brakuje m.in. pełnego pokazu dzielenia 26 przez 2 i rozumowania 256 układów / największa wartość 255. Skopiować potrzebne wyjaśnienia jako `reading` do wrappera i sprawdzić ich widoczność na stronie ucznia, także po nieobecności.

### F08 — P2, A1: zbyt duży skok w 98

[98-python-g1.js:95–153][src98]. Po pokazie wbudowanych `int/format` uczeń ma w 10-minutowym etapie „Przewiduj i zmień” napisać z `return 0` kompletny odczyt metodą Hornera z walidacją, `upper` i `find`. Są dwa zdania reguły, brak przejścia liczbowego krok po kroku; podpowiedź odsyła do przykładu, którego nie ma. Dla opisanej grupy to nowe zadanie bez dostatecznego modelu. Dodać pokaz odczytu kilku cyfr i kod z lukami przed samodzielną wersją. Ocena tempa jest oceną dydaktyczną, nie wynikiem pomiaru w klasie.

### F09 — P2, A1: `sum` użyte przed wyjaśnieniem

[79-python-g1.js:170][src79] wymaga w układance `sum(oceny)/len(oceny)`, ale wcześniejsze 60–68 ani poprzedzające etapy 79 nie wprowadzają `sum`. Wyjaśnienie jest dopiero w `80-python-g1.js:92–93`. Dodać przed układanką krótkie objaśnienie i przykład `sum([3,4,5]) == 12`.

### F10 — P2, A1: adaptacja tekstów nie dostosowała wszystkich zapowiedzi

[81-reuse-g1.js:4][src81] podmienia numery i klasy, ale dziedziczy z [54-python-strings.js:148,169,176][src54] „z poprzedniej lekcji” o filtrze `badminton`, zapowiedź pisania algorytmów już na następnej lekcji i „wkrótce szyfrujesz”. Poprzednia 80 dotyczy list; następna 92 jest koncepcyjna; szyfr nie należy do tego bloku klasy 1. 93 dziedziczy z 55:173 zapowiedź „Ctrl+F w Twoim kodzie”, podczas gdy następna 94 celowo jest bez kodu. Poprawić konkretne teksty w wrapperach, zamiast ufać samej zamianie numerów wyrażeniem regularnym.

### F11 — P2, A1/B/C: „program w 3 minuty” nie oznacza 3 minut od początku etapu

Zlecenie wymaga pierwszego działającego programu w 3 minuty. W 81/93/95 etap z Pythonem zaczyna się po 4 minutach; podobnie 87/88/90. W 82–85/105/106 laboratorium zaczyna się po **4 + 7 = 11 min**, a w 107 po **17 min**. Notatki np. 82:140 mówią o pierwszych trzech minutach **etapu**. Dodać uruchamiany od razu miniaturowy przykład albo zmienić kolejność/czasy; nie zaliczać wymogu samym zdaniem w notatkach. 77–80/98 mają start 2-minutowy. Wymóg nie dotyczy lekcji celowo bez programowania, np. 94/96/97 i montażu 86.

### F12 — P2, A1/A2/B/C i #29: poprawione nagłówki, nadal mylące odsyłacze

PR #29 poprawia wyświetlany numer, ale w uczniowskich tekstach nadal widnieją trwałe ID jako „lekcja N”. Przykłady:

| Miejsce | Obecny odsyłacz | Rzeczywisty temat |
|---|---|---|
| A2 `99-photocraft.js:13` | lekcja 33 | kl. 1, temat 14 |
| A2 `101-photocraft.js:13,30` | lekcja 100 | kl. 1, temat 16 |
| A2 `102-vectorcraft.js:13` | lekcja 42 | kl. 1, temat 36 |
| A2 `103-vectorcraft.js:13,30` | lekcja 102 | kl. 1, temat 37 |
| A2 `104-vectorcraft.js:20,30` | lekcja 103 | kl. 1, temat 38 |
| B `84-robotics-g2.js:74` | lekcja 83 | kl. 2, temat 26 |
| C `88-positional-systems-g3.js:70` | lekcja 87 | kl. 3, temat 24 |
| C `108-canary-css-g3.js:70` | lekcja 91 | kl. 3, temat 31 |

Podobne odwołania są w retrievalach A1 oraz 87/89/90/106. Najczytelniej wskazywać **nazwę poprzedniego tematu**, ewentualnie jego numer z rozkładu i klasę. W technicznych notatkach można pisać wyraźnie „ID 83”. Nie zmieniać trwałych ID i adresów. Po poprawie sprawdzić wszystkie nowe teksty, a nie tylko katalog i nagłówki.

### F13 — P2, A2: 104 nie prowadzi do rozdzielenia tła na warstwę

[104-vectorcraft.js:122,172,228][src104]. Polecenie tworzy `Tło`, `Pudełka`, `Opisy` i przenosi grupę pudełka; nie każe przenieść prostokąta tła. W startowym `104-przestrzen.svg` prostokąt jest poza grupą. Późniejsza kontrola i rubryka wymagają niezależnego działania trzech warstw. Utworzenie warstwy jej nie wypełnia — potwierdza to [implementacja `layer.new` w VectorCraft 0.17.0](https://github.com/storytold/vectorcraft/blob/v0.17.0/crates/engine/src/cmd/layer.rs#L469). Dopisać przeniesienie prostokąta na `Tło`, kolejność warstw i sprawdzenie ukrycia; następnie wykonać próbę w aplikacji.

## Problemy odziedziczone z produkcji

### F14 — P2, 54 → nowa 81: różnica kodów liter nie zawsze wynosi 32

[54-python-strings.js:120][src54] mówi, że różnica kodów małej i wielkiej litery to „zawsze 32”. Wrapper 81 przenosi ten błąd do klasy 1. **Pyodide potwierdza:** `ord("ł") - ord("Ł") == 1`. Ograniczyć twierdzenie do par ASCII A–Z/a–z; do ogólnej zmiany wielkości stosować metody napisów. Błąd istniał w bazowej lekcji na `main`; nie powstał przy dodawaniu 81.

### F15 — P2, 50 → nowa 90: niepełna obsługa mianownika zero

[50-fractions-python.js:17–22][src50], wrapper [90-fractions-python-g3.js:6–8][src90]. **Pyodide potwierdza:** `kalkulator((1,0), "+", (1,2))` oraz odwrotne ustawienie ułamków wywołuje `ZeroDivisionError`. Wrapper obiecuje sprawdzanie mianownika zero ogólnie, lecz testowane funkcje nie chronią wszystkich działań. Walidować oba wejściowe ułamki przed obliczeniami i sprawdzić cztery działania. Plik bazowy 50 pozostał identyczny z produkcją; audyt ujawnił odziedziczoną lukę, nie regresję zmienionego algorytmu.

## Pozostałe otwarte niespójności

- **F16 — P3, C:** [108:168 i 244][src108] ma sześć deklaracji `xmlns="http://www.w 3.org/2000/svg"` zamiast `http://www.w3.org/2000/svg`: trzy ilustracje powielono w danych dwóch aktywności. Parser HTML nadal tworzy widoczne SVG, dlatego same zrzuty nie wykazały błędu. Poprawić URI i dodać kontrolę wszystkich deklaracji przestrzeni nazw. Nie twierdzimy, że obecnie ilustracje znikają z podglądu.
- **F17 — P3, B/C:** wszystkie **14** nowych wpisów klas 2/3 w `docs/podstawa-programowa/mapowanie.json` ma `migraReference:"M1"`. Według `docs/podstawa-programowa/migra.md` M1/M2/M3 oznaczają materiał porównawczy dla poziomu klasy. Ustawić właściwe M2/M3 lub uzasadnić inne odwołanie; nie traktować tego pola jako numeru wymagania PP.
- **F18 — P3, B:** `docs/podstawa-programowa/mapowanie.json:1311` przypisuje 86 do **II.1 (programowanie)**, choć czynności tej lekcji obejmują montaż w symulatorze i pytania, bez tworzenia programu. Usunąć nadmiarowe przypisanie albo wskazać rzeczywistą wykonywaną czynność, zgodnie z zasadą mapowania dowodów. Sam tytuł „robot” nie wystarcza.
- **F19 — P3, A1:** 96 dziedziczy z 06 odznaki „pewność przy cyklu instrukcji” oraz „Pobierz, zdekoduj, wykonaj”, choć etapy CPU usunięto. Dostosować kartę wyniku do zapisu dwójkowego; źródła punktów są już ograniczone do właściwych zadań.
- **F20 — P3, C:** 90 dziedziczy `format.teacher` o „nwd z lekcji 22. tematu”; temat 22 klasy 3 dotyczy szyfrowania. Skierować do poprzedniej lekcji o NWD/NWW (ID 89, temat 26). Wzór NWD jest dostarczony, więc nie jest to blokada wykonania programu.

## Co sprawdzono i czego testy nie dowodzą

Wyniki wcześniejszego wykonania, sprzed niniejszego audytu:

| Kontrola | Wynik | Znaczenie i ograniczenie |
|---|---|---|
| `npm test` na kopii łączącej zmiany | **114/114** | Struktura i kontrakty treści; nie dowodzi całej poprawności dydaktycznej |
| Nowe testy logiki/Pythona/numeracji | **65/65** | A1 25, A2 9, B 11, C 17, numeracja 3; ponownie uruchomione podczas audytu, nadal 65/65 mimo kontrprzykładów |
| Pełny Playwright na połączonej kopii | **122 zaliczone, 1 znany błąd** | `tests/dental.spec.js:7`, oczekiwanie na „2. Dane” po odświeżeniu; poza zakresem zlecenia |
| Pełny zestaw `tests/sims-*.test.mjs` | **298 zaliczonych, 1 nieukończony plik** | Niezmieniony `sims-g2-numbers.test.mjs` zawiesza się po 9 testach; proces przerwano. Całego zestawu nie przedstawiać jako zielonego |
| Kontrola po ostatnich poprawkach | **4/4** | Celowane przejścia 94/96/97 i regresja importu konfiguracji |
| Własne rozwiązane przejścia nowych lekcji | Karty = maksimum | Sprawdzono poprawną ścieżkę, widoki nauczyciela, pobrania i eksporty; nie wszystkie powtórzenia, wyścigi i błędne rozwiązania |
| Interfejs i dostępność | axe WCAG 2.1 AA: brak naruszeń na sprawdzonych etapach | Szerokości 1366/1280/390 px, bez poziomego przewijania strony, zrzuty obejrzane. To nie zastępuje oceny treści ani pilotażu desktopowego |

Podczas audytu ponownie: `check-curriculum` na produkcyjnym źródle **76 / 42,17,17 / 28 punktów PP**, `npm test` **82/82**; na połączonej kopii mapa **108 / 60,23,25 / 28 punktów PP**, nowe testy **65/65**. W prawdziwym Pyodide osobno odtworzono F01, F04/F05 (z oceną przez `judgeRobot`), F14 i F15; F03 w logice punktacji JavaScript, F06 w analizatorze HTML. F02 wynika z analizy kodu i wymaga celowanego testu interfejsu.

Wniosek dla audytora: testy poprawnych wzorców są potrzebne, ale obecne testy nie obejmują wszystkich poleceń ucznia ani rozstrzygających błędnych wariantów. Przejście do maksimum punktów nie wykrywa np. późniejszego spadku oceny przy ponownym kliknięciu.

## Jak szybko odtworzyć kluczowe problemy

Pracuj na świeżo pobranych gałęziach lub dokładnych SHA z tabeli; zachowaj cudze zmiany. Poniższe polecenia uruchamiaj w kopii A1, gdzie wykonano `npm ci`. Nie jest potrzebny serwer WWW:

```sh
node --input-type=module <<'JS'
import {loadPyodide} from 'pyodide';
import {RUNNER_PY} from './content/sims/pythonLab.js';
import lesson from './content/lessons/98-python-g1.js';
const py = await loadPyodide();
py.runPython(RUNNER_PY);
const own = lesson.sections.flatMap(s => s.activities).find(a => a.id === '98-own');
const result = JSON.parse(py.globals.get('_pl_run')(JSON.stringify({
  code: own.solution + '\nprint(zapis(odczyt("ff", 16), 2))'
})));
console.log(result.error); // NameError: odczyt is not defined
JS
```

W B/C: uruchom `PROJECTS.rover.solution` przez `robotProgram` → `runPython`/runner Pyodide → `parseRobotOutput`; wynik `robotResult('rover', {cases, attempts:1/2/3})` wynosi kolejno 8/7/6. Następnie przestaw warunki przeszkody i STOP w rozwiązaniu i sprawdź `judgeRobot`: nadal dwa zielone scenariusze. Zamień `<30` na `<=30` w `gardenHysteresis`, `>70` na `>=70` w `radio`: nadal pełne zaliczenie. Po poprawie scenariuszy te błędne warianty muszą przestać przechodzić.

W C: odszukaj aktywność 108 z kryterium `id:'line'`; podaj do `runChecks(activity.checks, analyze(activity.html, css), activity.keep)` CSS z F06. Dla F02 w przeglądarce opóźnij wykonanie, uruchom program A, wpisz program B przed końcem oczekiwania i sprawdź, czy B pozostaje w edytorze, a wynik A nie zalicza B. Istniejący `robot-config.spec.js` sprawdza inną operację.

## Kolejność dalszego przeglądu i integracji

1. Potwierdź stan `main` i HEAD-y PR. Ten raport opisuje konkretne wersje z tabeli, nie przyszłe poprawki. Nie scalaj lekcji bez odrębnego polecenia nauczyciela/koordynatora.
2. Najpierw F01–F06: niedziałające polecenie, utrata kodu, ocenianie i błędne zaliczenia. Poprawki robotLab muszą pozostać spójne w B i C. Dodaj testy rzeczywistych kontrprzykładów.
3. Sprawdź samodzielny przebieg słabszego ucznia względem 60–68, 50 i 57: F07–F11. Uruchamianie gotowego rozwiązania przez autora nie wystarcza do oceny stopniowania trudności.
4. Dokończ numerację w tekstach (F12), instrukcję warstw (F13), problemy dziedziczone i metadane (F14–F20). W starszych lekcjach 01–76 wprowadzaj tylko uzasadnione, punktowe poprawki; jawnie opisz ich szerszy wpływ.
5. A2 sprawdź w szkolnym PhotoCraft/VectorCraft, ze wszystkimi pobranymi plikami i eksportami. 3D pozostaw propozycją do wyboru nauczyciela; nie dodawaj lekcji w ramach D.
6. Przy późniejszym łączeniu PR zachowaj **sumę wpisów** rozkładu, mapowania i materiałów. Przelicz `numberInGrade`, liczniki i mapy po integracji. Zachowaj numer widoczny z `order` oraz osobne ID. Aktualnie każdy PR ma własny stan dokumentacji oparty na tych samych 76 lekcjach.
7. **Zbuduj wynik ze wszystkich połączonych źródeł.** `assets/`, `index.html`, `lesson/`, `teacher/` i inne generowane strony z niezależnych PR kolidują. Przyjęcie ostatniego pakietu jednego PR może ukryć lekcje pozostałych. Konfliktów wygenerowanych plików nie rozwiązuj ręcznie; po rozwiązaniu źródeł i JSON wykonaj nowy build.
8. W zintegrowanej kopii: `node scripts/check-curriculum.mjs`, `npm test`, nowe testy podane poniżej, testy zmienionych komponentów, `npm run build`, Playwright i własne przejścia ucznia/nauczyciela. Jawnie oddziel znany dental i zawieszający się stary test od nowych regresji. Po publikacji porównaj rzeczywisty pakiet produkcji i sprawdź nowe adresy.

```sh
node --test tests/sims-g1-python-c.test.mjs tests/sims-g1-graphics.test.mjs tests/sims-g2-robot.test.mjs tests/sims-g3-numbers.test.mjs tests/sims-g3-html.test.mjs tests/lesson-numbering.test.mjs
```

Polecenie powyżej wymaga kopii ze wszystkimi zmianami; pojedynczy PR nie zawiera wszystkich tych plików. Obecny raport i zielone wyniki wcześniejszych testów **nie zamykają** ustaleń F01–F20. Po poprawkach dopisz datę, nowe SHA i wynik ponownego sprawdzenia każdego ustalenia.

[src98]: https://github.com/adeodatus11/informatyka2026_2027/blob/ccc3aab718085714a9d187ff57c50c6e820ee4b7/content/lessons/98-python-g1.js#L259
[src96]: https://github.com/adeodatus11/informatyka2026_2027/blob/ccc3aab718085714a9d187ff57c50c6e820ee4b7/content/lessons/96-binary-g1.js#L8
[src79]: https://github.com/adeodatus11/informatyka2026_2027/blob/ccc3aab718085714a9d187ff57c50c6e820ee4b7/content/lessons/79-python-g1.js#L170
[src81]: https://github.com/adeodatus11/informatyka2026_2027/blob/ccc3aab718085714a9d187ff57c50c6e820ee4b7/content/lessons/81-reuse-g1.js#L4
[src54]: https://github.com/adeodatus11/informatyka2026_2027/blob/9507c8bbde974157556e6547d47e631b98a5bbaf/content/lessons/54-python-strings.js#L120
[src50]: https://github.com/adeodatus11/informatyka2026_2027/blob/9507c8bbde974157556e6547d47e631b98a5bbaf/content/lessons/50-fractions-python.js#L17
[src90]: https://github.com/adeodatus11/informatyka2026_2027/blob/46d8c5802dae80dc7f0b8ae4583743c19cd3a96e/content/lessons/90-fractions-python-g3.js#L6
[src104]: https://github.com/adeodatus11/informatyka2026_2027/blob/dffdac4f34915736461248bd54d2ee3aa5e8e352/content/lessons/104-vectorcraft.js#L122
[src108]: https://github.com/adeodatus11/informatyka2026_2027/blob/46d8c5802dae80dc7f0b8ae4583743c19cd3a96e/content/lessons/108-canary-css-g3.js#L168
[robot-ui]: https://github.com/adeodatus11/informatyka2026_2027/blob/e21392edd946134cc20c98d6532c86254e9b195d/components/sims/robotLab.jsx#L18
[robot-logic]: https://github.com/adeodatus11/informatyka2026_2027/blob/e21392edd946134cc20c98d6532c86254e9b195d/content/sims/robotLab.js#L24
