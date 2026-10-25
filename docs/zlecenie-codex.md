# Zlecenie dla wykonawcy zewnętrznego (Codex) — październik 2026

Ten plik opisuje, **które lekcje budujesz** i **jak**. Najpierw przeczytaj `AGENTS.md` (zasady ogólne i skrót decyzji nauczyciela), potem dokumenty wskazane niżej. Pisz po polsku.

## 1. Co budujesz

ID są **zarezerwowane** — używaj dokładnie tych. `order` = numer tematu w rozkładzie danej klasy. Tytuły dokładnie jak w tabelach (= `docs/rozklad-2026-2027.json`). Cel zlecenia: **zamknąć cały Python w klasie 1, całą robotykę w klasach 2 i 3, cały HTML w klasie 3 oraz grafikę 2D w klasie 1**. Grafika 3D (SketchUp) — tylko propozycja narzędzia (zadanie D).

Kolejność pracy (osobny PR na każdy punkt): **A → B → C → D**, a w ramach A najpierw Python (77–81, 92–98), potem grafika (99–104).

### A. Klasa 1

**A1. Python do końca (tematy 49–60)**

| ID | `order` | Tytuł |
|---|---|---|
| `77` | 49 | Funkcje zwracające wartość w języku Python |
| `78` | 50 | Funkcje niezwracające wartości w języku Python |
| `79` | 51 | Definiowanie i stosowanie listy w języku Python |
| `80` | 52 | Wykonywanie operacji na elementach listy w języku Python |
| `81` | 53 | Dane tekstowe w języku Python |
| `92` | 54 | Wybrane algorytmy na tekstach |
| `93` | 55 | Programowanie wybranych algorytmów na tekstach |
| `94` | 56 | Wyszukiwanie wzorca w tekście metodą naiwną |
| `95` | 57 | Programowanie algorytmu wyszukiwania wzorca w tekście metodą naiwną |
| `96` | 58 | System dwójkowy |
| `97` | 59 | System szesnastkowy |
| `98` | 60 | Programowanie zamiany reprezentacji liczb między pozycyjnymi systemami liczbowymi |

- `grade:1`. Poprzednia lekcja przed 77: **68** (for/while). Uczniowie znają z lekcji 60–68: specyfikację, schemat blokowy, `print`, zmienne, `input`/`int`/`float`, f-stringi, `if/elif/else`, `isdigit`, `for`/`while`, `break`, pętle zagnieżdżone. **Nie znają jeszcze `def`, `return`, list, metod napisów.**
- 77–80: konteksty z życia (rabat/rata jako funkcja, `cena_biletu(wiek)`, `print` vs `return` — typowy błąd `None`, lista ocen → średnia/min/max, lista zakupów, ranking graczy, playlista; `append`, `len`, indeksy, wycinki, `in`, `sum`, `max`, `sorted`, pętla po liście, indeks poza zakresem).
- **Gotowe lekcje klasy 3 do ponownego użycia** (cienkie pliki — wzór: `content/lessons/51-substitution-cipher-g3.js`, `52-cipher-python-g3.js`, `44-swimming-database-g2.js`; nadpisz `id`, `grade`, `order`, `title` wg rozkładu klasy 1, retrieval na starcie z poprzedniej lekcji klasy 1, zapowiedzi i odwołania do „klasy 3”/„lekcji 57” zamień na właściwe):
  - 81 ← `54-python-strings.js` (albo własna, prostsza wersja, jeśli poziom nie pasuje),
  - 92 ← `53-text-algorithms.js`, 93 ← `55-compare-count-python.js`, 94/95 ← `56-pattern-search-python.js` (56 łączy koncepcję i program — rozdziel: 94 bez kodu z `textLab` w trybie `pattern`, 95 program),
  - 96 ← `06-binary-computer.js`, 97 ← `13-hexadecimal.js` (lekcje bez kodu; klasa 3 → klasa 1: dopasuj przykłady i retrieval),
  - 98: nowa lekcja — zamiana 2↔10↔16 w Pythonie; oprzyj się na `57-binary-to-decimal.js` oraz lekcjach 87–88 (zadanie C), unikaj dublowania 1:1.
- Testy: `tests/sims-g1-python-c.test.mjs` (zadania Pythona w prawdziwym Pyodide, wzór: `tests/sims-g1-python-a.test.mjs`); w wrapperach sprawdź, że karta wyniku = max i że w tekstach nie zostały odwołania do klasy 3.

**A2. Grafika 2D w ArtCraft (tematy 15–17, 37–39)**

Decyzja nauczyciela: **darmowe aplikacje open source z pakietu ArtCraft** (https://getartcraft.com/download): **PhotoCraft** (grafika rastrowa, odpowiednik Photoshopa/GIMP-a: warstwy, maski, warstwy dopasowania, pędzle, tekst) i **VectorCraft** (grafika wektorowa, odpowiednik Illustratora/Inkscape). Instalowane na Windows (x64 `.msi`), bez konta i subskrypcji, licencja MIT/Apache-2.0. **Uwaga: stan alfa** (PhotoCraft „early alpha”, VectorCraft „in development” — stan na 10.2026), więc:
- najpierw **sprawdź aktualną wersję i funkcje** (repozytorium/strona projektu) i opisz je w `docs/artcraft-desktop.md`: wersja, co działa (warstwy, selekcje, maski, eksport PNG/JPG/SVG), czego brakuje, znane błędy; instrukcja instalacji dla administratora pracowni;
- zadania układaj tak, by wymagały tylko funkcji, które działają; uczeń pracuje na **kopii** pliku i eksportuje wynik do PNG/JPG (albo SVG); w `teacherGuide` wariant awaryjny (np. GIMP/Inkscape, jeśli są zainstalowane), oznaczony „DO WERYFIKACJI w pracowni”;
- wzorzec lekcji z programem na komputerze: lekcje Worda/Excela/PowerPointa (`workspace`, `wordSteps`, `wordRubric`, `download`; `docs/word-desktop.md`, `docs/excel-desktop.md`). Możesz rozszerzyć `content/desktop-apps.js` o `desktop-photocraft` i `desktop-vectorcraft` (nazwa w dopełniaczu i miejscowniku) — to jedyny wspólny plik, który tu wolno zmienić;
- materiały startowe (zdjęcia/obrazy na licencji wolnej lub własne, fikcyjne) w `public/materials/grafika/`; tytuły z rozkładu zawierają nazwy GIMP/Inkscape — **zostaw tytuły bez zmian** (to rozkład szkoły), a w `subtitle`/`format` napisz, że pracujemy w PhotoCraft/VectorCraft (te same pojęcia).

| ID | `order` | Tytuł | Program |
|---|---|---|---|
| `99` | 15 | Tworzenie obrazu i praca z warstwami w programie GIMP | PhotoCraft |
| `100` | 16 | Stosowanie narzędzi selekcji w programie GIMP | PhotoCraft |
| `101` | 17 | Edycja zdjęć w programie GIMP | PhotoCraft |
| `102` | 37 | Tworzenie rysunków w grafice wektorowej | VectorCraft |
| `103` | 38 | Rysowanie figur i ścieżek w programie Inkscape | VectorCraft |
| `104` | 39 | Rysowanie przestrzenne, przekształcenia i warstwy w programie Inkscape | VectorCraft |

Pomysły: miniatura/okładka z warstw (tło, zdjęcie, tekst), wycięcie obiektu i zamiana tła (+ rozmowa o manipulacji obrazem, most do lekcji 07 o fake newsach), retusz i przygotowanie zdjęcia do internetu i druku (rozdzielczość, format, waga pliku), raster vs wektor na powiększeniu, logo/ikona z figur i ścieżek, przekształcenia i warstwy. Produkt: plik PNG/SVG pokazany nauczycielowi; samoocena wg kryteriów.

### B. Klasa 2 — robotyka do końca (tematy 25–30)

| ID | `order` | Tytuł |
|---|---|---|
| `82` | 25 | Sterowanie nawadnianiem ogrodu – wprowadzenie do robotyki i zadanie projektowe |
| `83` | 26 | Sterowanie nawadnianiem ogrodu – zadania szczegółowe |
| `84` | 27 | Projekt „Zamknij okno” |
| `85` | 28 | Projekt „Wycisz radio” |
| `86` | 29 | Budowanie robota – przygotowanie pomocy i montowanie układu |
| `105` | 30 | Budowanie robota – tworzenie oprogramowania |

- `grade:2`. Poprzednia lekcja: **50** (ułamki w Pythonie). Klasa 2 programowała w Pythonie (17, 19–21, 46, 48, 50).
- **Symulator w przeglądarce** `robotLab` (nie wiemy, jaki sprzęt ma szkoła): wirtualny mikrokontroler z czujnikami i elementami wykonawczymi — czujnik wilgotności gleby, deszczu, kontaktron okna, poziom dźwięku, odległości, przyciski; pompa, serwo, przekaźnik, dioda, buzzer, silniki (robot). Program w Pythonie w stylu MicroPython przez Pyodide z podstawionym API sprzętu (wzór uruchamiania i testów: `components/sims/pythonLab.jsx`, `components/sims/python/`); wykres odczytów w czasie; scenariusze (sucho/deszcz/noc; okno otwarte + deszcz; hałas powyżej progu; robot omija przeszkodę / jedzie po linii). Pętla „czytaj → decyduj → działaj”, progi, histereza, opóźnienia, bezpieczeństwo (pompa nie działa bez wody).
- 86: montowanie układu w symulatorze (schemat połączeń: wyprowadzenia, zasilanie, masa; wykrywanie błędów połączeń); 105: oprogramowanie robota z 86 (ten sam model robota, `stateKey` lub zapis konfiguracji).
- W `teacherGuide` każdej lekcji: wariant „jeśli szkoła ma zestawy” (micro:bit/Arduino z Laboratoriów Przyszłości — ogólnie, „DO WERYFIKACJI ze sprzętem w pracowni”).
- Testy: `tests/sims-g2-robot.test.mjs` (logika symulatora; zadania Pythona w Pyodide).

### C. Klasa 3 — systemy, ułamki, robotyka i cały HTML (tematy 24–27, 29–32)

| ID | `order` | Tytuł |
|---|---|---|
| `87` | 24 | Programowanie zamiany liczby dziesiętnej na dwójkową |
| `88` | 25 | Zamiana liczb między systemami pozycyjnymi |
| `89` | 26 | Działania na ułamkach z wykorzystaniem NWD i NWW |
| `90` | 27 | Skracanie i działania arytmetyczne na ułamkach |
| `106` | 29 | Projekt sterowania nawadnianiem ogrodu |
| `107` | 30 | Budowanie robota i inne zadania projektowe |
| `91` | 31 | Etapy tworzenia strony internetowej |
| `108` | 32 | Nowy wygląd strony internetowej o Wyspach Kanaryjskich |

- `grade:3`. Przed 87: lekcja **57** (dwójkowy → dziesiętny w Pythonie). Pomysły i pułapki: `docs/notatki-realizacji/klasa-3-teksty-systemy-ulamki.md` (tematy 24, 25).
- 89 ← lekcja **49**, 90 ← lekcja **50** (klasa 2) — cienkie pliki z retrievalem z 88, tytuły wg rozkładu klasy 3.
- 106, 107: oprzyj na `robotLab` z zadania B (klasa 3 ma tylko 2 godziny robotyki → zwięzły projekt: nawadnianie + robot; możesz łączyć wrappery 82/83 i 86/105). Rób **po** zadaniu B.
- 91, 108: z `htmlLab` (lekcje klasy 1: 35–38). 91 — etapy tworzenia strony (cel i odbiorca → makieta → treść → HTML → CSS → test → publikacja); 108 — nowy wygląd strony o Wyspach Kanaryjskich: przygotuj gotową, „brzydką” stronę o Wyspach Kanaryjskich (treść autorska, zdjęcia z wolną licencją lub ilustracje SVG, podpisane), uczeń zmienia tylko CSS (motyw, układ flex/grid, kontrast, typografia, responsywność). Klasa 3 nie miała WWW w tym cyklu — zacznij od podstaw w skrócie.
- Testy: `tests/sims-g3-numbers.test.mjs` (87–90), testy `htmlLab` dla nowych zadań (91, 108).

### D. Grafika 3D (SketchUp: klasa 2 tematy 1–7, klasa 3 tematy 11–15) — tylko propozycja

Pakiet ArtCraft **nie ma programu do modelowania 3D** (aplikacja ArtCraft ma tylko układanie scen 3D pod generowanie obrazów przez AI — nie nadaje się do projektu ławki, ogrodu czy pokoju). Przygotuj `docs/notatki-realizacji/grafika-3d-propozycja.md`: 2–3 darmowe programy bez konta (np. Sweet Home 3D — pokój i rzut 2D/3D; FreeCAD lub Blender — modele brył; sprawdź też SketchUp Free/for Web i Tinkercad pod kątem konta i wieku), z oceną: konto?, wiek, instalacja/przeglądarka, polski interfejs, wymagania sprzętowe, dopasowanie do tematów (ławka, rzut 2D ogrodu, projekt ogrodu, pokój, meble 3D). **Lekcji 3D nie buduj** — nauczyciel wybierze narzędzie.

### Nie ruszaj

- Klasa 1, temat 8 (e-usługi — projekt): do decyzji nauczyciela (pokrywa go lekcja 09).
- Istniejące lekcje 01–76 zmieniaj tylko punktowo, gdy wymaga tego wrapper (lepiej: nie zmieniaj, nadpisuj w cienkim pliku).

## 2. Grupa docelowa i decyzje nauczyciela (wiążące)

Pełna wersja: `docs/profil-ucznia.md` (zwłaszcza pkt 6 i 6a).

- Uczniowie technikum 15–16 lat, **niska motywacja**, słabsi z matematyki, często boją się kodu. Krótkie zdania, mówisz do ucznia na „Ty”, bez infantylizmu i moralizowania. Każda lekcja pokazuje **realną korzyść** (pieniądze, czas, gra, praca, praktyki).
- **Szybkie sukcesy**: pierwszy działający program w 3 minuty. Kolejność: przewiduj → uruchom → zmień → ułóż (Parsons) → napraw błąd → napisz sam. Błędy wyjaśniane po polsku, bez wstydu.
- **45 min, 4–7 etapów**, suma czasów etapów = `duration`. Start: hak + 1–2 pytania powtórkowe. Koniec: karta wyniku (`resultCard`) z odznakami.
- **Bez pracy domowej. Bez logowania. Wszystko w przeglądarce.**
- **Praca w parach — nie na siłę i nie na każdej lekcji** (orientacyjnie co trzecia); pary zamiast trójek; bez sztywnych ról i ocen koleżeńskich „dla metody”; zawsze wariant dla osoby bez pary. W bloku Pythona domyślnie praca samodzielna; w projektach robotyki para może mieć sens (np. jedna osoba programuje, druga testuje scenariusze) — z wariantem solo.
- **Bez sztucznych produktów** („generatory” plakatów, kreatory slajdów na platformie). Plakat/grafika — tylko w Canvie albo przez prompt do AI (z nauką pisania promptu), jako opcja.
- Kolejność odpowiedzi w pytaniach jest losowana (`content/shuffle.js`, w symulatorach `components/sims/optionOrder.js` + `data-option`). Nie stawiaj poprawnej odpowiedzi zawsze na tej samej pozycji.
- Metody COVE: https://metodyka.covepolska.pl/ — linki w `format.methods`, różne zestawy w kolejnych lekcjach. Gdy serwis jest niedostępny, korzystaj z `docs/metodyka-cove.md` i napisz o tym w PR.

## 3. Jak budować

1. Przeczytaj: `AGENTS.md`, `docs/przewodnik-wykonawcy.md` (format lekcji, kontrakt symulatora, weryfikacja), `docs/lesson-blueprint.md`, `docs/metodyka-cove.md`, `docs/profil-ucznia.md`, `docs/python-w-przegladarce.md`, `docs/rozklad-2026-2027.md`.
2. Wzorce do naśladowania (format, ton, rytm etapów): `content/lessons/62-python-variables-output.js`, `65-elif-nested-python.js`, `68-for-while-python.js`, `46-iterative-python.js`; symulator z czujnikami i budżetem decyzji: `15-home-devices.js` + `components/sims/smartHome.jsx`; strona WWW: `35-www-basics.js` + `components/sims/htmlLab.jsx`.
   Testy: klasa 1 → `tests/sims-g1-python-c.test.mjs` (+ `tests/sims-g1-graphics.test.mjs` dla 99–104), klasa 2 → `tests/sims-g2-robot.test.mjs`, klasa 3 → `tests/sims-g3-numbers.test.mjs` (zadania Pythona w prawdziwym Pyodide jak w `tests/sims-g1-python-a.test.mjs`).
3. Nie projektuj nowego layoutu. Używaj istniejących typów aktywności i symulatorów. Nowy symulator tylko wtedy, gdy naprawdę potrzebny (`components/sims/<typ>.jsx` + logika w `content/sims/<typ>.js` + testy). Wspólnych plików (`app/`, `components/activities.jsx`, `content/scoring.js`, `pythonLab`) nie zmieniaj bez potrzeby — jeśli musisz, opisz to w PR osobno.
4. Fakty i liczby z życia (ceny, stawki, przepisy) — ze źródłem i rokiem albo z dopiskiem „DO WERYFIKACJI” w `teacherGuide`.
5. Po dodaniu lekcji zaktualizuj: `docs/rozklad-2026-2027.md` i `.json` (status ✅, ID lekcji, liczniki), `docs/podstawa-programowa/mapowanie.json` (wpis z `requirements`, `activityIds`, `evidence`, `limitations`; `numberInGrade` przelicz — robi to porządek z `content/lesson-order.js`).

## 4. Weryfikacja przed PR

- `npm test`, `node --test tests/sims-*.test.mjs`, `node scripts/check-curriculum.mjs`.
- `npm run build` (buduje i kopiuje wynik do katalogu głównego — to jest publikowane przez GitHub Pages).
- Playwright: `npx playwright test` (konfiguracja w `playwright.config.js`; w chmurze bez Chrome ustaw `channel: undefined` i `launchOptions.executablePath` na Chromium). Każda nowa lekcja: wszystkie etapy, karta wyniku, axe WCAG 2.1 AA bez naruszeń. Dodatkowo własny skrypt: przejście lekcji z rozwiązaniem zadań → karta wyniku = maksimum, brak błędów konsoli, 1366 i 1280 px dopracowane, 390 px bez poziomego przewijania, zrzuty obejrzane.
- Podgląd zbudowanej strony: `node scripts/serve.mjs` (port 4174) — obsługuje `.mjs`/`.wasm`, więc Python działa także na buildzie.
- Znany, niezwiązany błąd: `tests/dental.spec.js:7` — nie naprawiaj w tym PR, nie wliczaj.

## 5. Git i publikacja

- Pracuj na własnych gałęziach — **jeden PR na punkt zlecenia**: `codex/kl1-python`, `codex/kl1-grafika-artcraft`, `codex/kl2-robotyka`, `codex/kl3-systemy-robotyka-www`, `codex/grafika-3d-propozycja`; PR do `main`. Nie scalaj sam — nauczyciel lub koordynator scala po przeglądzie.
- **Pliki zbudowane (katalog główny: `assets/`, `index.html`, `lesson/`, `teacher/`) będą kolidować z innymi PR.** Przed ostatnim `npm run build` zrób `git fetch origin main && git merge origin/main`; przy konflikcie w plikach zbudowanych weź dowolną stronę i **zbuduj ponownie** (`npm run build`), nie rozwiązuj ich ręcznie. Konflikty w `docs/rozklad-*` i `mapowanie.json` rozwiąż ręcznie, zachowując wpisy obu stron, i uruchom `node scripts/check-curriculum.mjs`.
- W opisie PR: lista lekcji, co zweryfikowano (z wynikami), fakty do weryfikacji, potrzebne zmiany wspólne.
