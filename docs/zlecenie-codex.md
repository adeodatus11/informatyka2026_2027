# Zlecenie dla wykonawcy zewnętrznego (Codex) — październik 2026

Ten plik opisuje, **które lekcje budujesz** i **jak**. Najpierw przeczytaj `AGENTS.md` (zasady ogólne i skrót decyzji nauczyciela), potem dokumenty wskazane niżej. Pisz po polsku.

## 1. Co budujesz — 15 tematów (po 5 w każdej klasie)

ID są **zarezerwowane** — używaj dokładnie tych. `order` = numer tematu w rozkładzie danej klasy. Tytuły dokładnie jak w tabelach. Grafikę (GIMP, Inkscape, SketchUp) pomijamy.

### Klasa 1 — Python cz. 2: funkcje, listy, teksty (tematy 49–53)

| ID | `order` | Tytuł |
|---|---|---|
| `77` | 49 | Funkcje zwracające wartość w języku Python |
| `78` | 50 | Funkcje niezwracające wartości w języku Python |
| `79` | 51 | Definiowanie i stosowanie listy w języku Python |
| `80` | 52 | Wykonywanie operacji na elementach listy w języku Python |
| `81` | 53 | Dane tekstowe w języku Python |

- `grade:1`. Poprzednia lekcja w rozkładzie: **68** (for/while) — retrieval na starcie 77; każda następna z poprzedniej.
- Uczniowie znają z lekcji 60–68: specyfikację zadania, schemat blokowy, `print`, zmienne, `input`/`int`/`float`, f-stringi, `if/elif/else`, walidację (`isdigit`), `for`/`while`, `break`, pętle zagnieżdżone. **Nie znają jeszcze `def`, `return`, list, metod napisów.**
- Konteksty (dobierz sam): rabat/rata jako funkcja, `cena_biletu(wiek)`, różnica `print` vs `return` (typowy błąd: `None`), lista ocen → średnia/min/max, lista zakupów, ranking graczy, playlista; `append`, `len`, indeksy, wycinki, `in`, `sum`, `max`, `sorted`, pętla po liście, pułapki (indeks poza zakresem). 81: nick, hasło, maskowanie numeru karty — **klasa 3 ma podobną lekcję 54** (`content/lessons/54-python-strings.js`): możesz ją podpiąć cienkim plikiem (wzór: `23-dental-database-g3.js`, `51-substitution-cipher-g3.js`) z retrievalem z 80, jeśli poziom pasuje — albo zrobić własną, prostszą.

### Klasa 2 — robotyka (tematy 25–29)

| ID | `order` | Tytuł |
|---|---|---|
| `82` | 25 | Sterowanie nawadnianiem ogrodu – wprowadzenie do robotyki i zadanie projektowe |
| `83` | 26 | Sterowanie nawadnianiem ogrodu – zadania szczegółowe |
| `84` | 27 | Projekt „Zamknij okno” |
| `85` | 28 | Projekt „Wycisz radio” |
| `86` | 29 | Budowanie robota – przygotowanie pomocy i montowanie układu |

- `grade:2`. Poprzednia lekcja: **50** (ułamki w Pythonie). Klasa 2 programowała w Pythonie (lekcje 17, 19–21, 46, 48, 50).
- **Założenie (do potwierdzenia przez nauczyciela przed startem):** nie wiemy, jaki sprzęt ma szkoła. Budujesz **symulator w przeglądarce** (`robotLab`: wirtualny mikrokontroler z czujnikami i elementami wykonawczymi — czujnik wilgotności gleby, deszczu, kontaktron okna, mikrofon/poziom dźwięku, pompa, serwo, przekaźnik, dioda, buzzer; program pisany w Pythonie w stylu MicroPython przez `pythonLab`/Pyodide z podstawionym API sprzętu albo osobny tryb symulatora; wykres odczytów w czasie; scenariusze: sucho/deszcz/noc, okno otwarte + deszcz, hałas powyżej progu). Pętla „czytaj czujnik → decyzja → działaj”, progi, histereza, opóźnienia, bezpieczeństwo (pompa nie może działać bez wody).
- W `teacherGuide` każdej lekcji: wariant „jeśli szkoła ma zestawy” (np. micro:bit/Arduino z Laboratoriów Przyszłości) — ogólnie, bez zakładania konkretnego modelu, z adnotacją „DO WERYFIKACJI ze sprzętem w pracowni”.
- 86 („montowanie układu”): w symulatorze — schemat połączeń (które wyprowadzenie do którego czujnika, zasilanie, masa), wykrywanie błędów połączeń; bez wymogu fizycznego sprzętu.

### Klasa 3 — systemy liczbowe, ułamki, strona WWW (tematy 24, 25, 26, 27, 31)

| ID | `order` | Tytuł |
|---|---|---|
| `87` | 24 | Programowanie zamiany liczby dziesiętnej na dwójkową |
| `88` | 25 | Zamiana liczb między systemami pozycyjnymi |
| `89` | 26 | Działania na ułamkach z wykorzystaniem NWD i NWW |
| `90` | 27 | Skracanie i działania arytmetyczne na ułamkach |
| `91` | 31 | Etapy tworzenia strony internetowej |

- `grade:3`. Poprzednia lekcja przed 87: **57** (dwójkowy → dziesiętny w Pythonie) — kontynuuj (dzielenie przez 2 z resztą, `bin()` jako sprawdzenie; 88: dowolna podstawa 2–16, `int(x, base)`). Pomysły i pułapki: `docs/notatki-realizacji/klasa-3-teksty-systemy-ulamki.md` (tematy 24, 25).
- 89 i 90 to tematy z klasy 2, gdzie są gotowe lekcje **49** (ułamki bez kodu) i **50** (kalkulator ułamków w Pythonie) — podepnij je cienkimi plikami (wzór: `51-substitution-cipher-g3.js`, `52-cipher-python-g3.js`), z retrievalem z 88 i dopasowaniem tytułów do rozkładu klasy 3. Klasa 3 zna już Pythona (54–57).
- 91: w klasie 1 są lekcje WWW **35–38** z edytorem `htmlLab`. Zrób lekcję dla klasy 3 o etapach tworzenia strony (cel i odbiorca → plan/makieta → treść → HTML → CSS → test → publikacja), wykorzystując `htmlLab`; możesz częściowo podpiąć 35–36, ale klasa 3 nie miała WWW w tym cyklu — sprawdź w rozkładzie. Temat 32 (nowy wygląd strony o Wyspach Kanaryjskich) zostaw na później.

### Nie ruszaj

- Grafika: klasa 1 tematy 15–17 i 37–39, klasa 2 tematy 1–7, klasa 3 tematy 11–15.
- Klasa 1: 8, 54–60; klasa 3: 29–30, 32 — robi inny wykonawca albo później.

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
   Testy: klasa 1 → `tests/sims-g1-python-c.test.mjs`, klasa 2 → `tests/sims-g2-robot.test.mjs`, klasa 3 → `tests/sims-g3-numbers.test.mjs` (zadania Pythona w prawdziwym Pyodide jak w `tests/sims-g1-python-a.test.mjs`).
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

- Pracuj na własnych gałęziach — najlepiej **jeden PR na klasę** (np. `codex/kl1-python-funkcje`, `codex/kl2-robotyka`, `codex/kl3-systemy-ulamki-www`), PR do `main`. Nie scalaj sam — nauczyciel lub koordynator scala po przeglądzie.
- **Pliki zbudowane (katalog główny: `assets/`, `index.html`, `lesson/`, `teacher/`) będą kolidować z innymi PR.** Przed ostatnim `npm run build` zrób `git fetch origin main && git merge origin/main`; przy konflikcie w plikach zbudowanych weź dowolną stronę i **zbuduj ponownie** (`npm run build`), nie rozwiązuj ich ręcznie. Konflikty w `docs/rozklad-*` i `mapowanie.json` rozwiąż ręcznie, zachowując wpisy obu stron, i uruchom `node scripts/check-curriculum.mjs`.
- W opisie PR: lista lekcji, co zweryfikowano (z wynikami), fakty do weryfikacji, potrzebne zmiany wspólne.
