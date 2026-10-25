# Zlecenie dla wykonawcy zewnętrznego (Codex) — październik 2026

Ten plik opisuje, **które lekcje budujesz** i **jak**. Najpierw przeczytaj `AGENTS.md` (zasady ogólne i skrót decyzji nauczyciela), potem dokumenty wskazane niżej. Pisz po polsku.

## 1. Co budujesz

### Zadanie A — klasa 1, Python cz. 2: funkcje i listy (tematy 49–52)

| ID (zarezerwowane) | `order` | Tytuł (dokładnie jak w rozkładzie) |
|---|---|---|
| `77` | 49 | Funkcje zwracające wartość w języku Python |
| `78` | 50 | Funkcje niezwracające wartości w języku Python |
| `79` | 51 | Definiowanie i stosowanie listy w języku Python |
| `80` | 52 | Wykonywanie operacji na elementach listy w języku Python |

- `grade:1`, pliki `content/lessons/77-*.js` … `80-*.js`. ID są zarezerwowane — nie używaj innych.
- Poprzednia lekcja w rozkładzie to **68** („Stosowanie instrukcji iteracyjnych for i while”) — retrieval na starcie 77 z pętli for/while; każda następna z poprzedniej. Uczniowie znają z lekcji 60–68: specyfikację zadania, schemat blokowy, `print`, zmienne, `input`/`int`/`float`, f-stringi, `if/elif/else`, walidację (`isdigit`), `for`/`while`, `break`, pętle zagnieżdżone. **Nie znają jeszcze `def`, `return`, list.**
- Środowisko: istniejący symulator `pythonLab` (Pyodide w przeglądarce; tryby `predict`, `trace`, `parsons`, `code`). Opis: `docs/python-w-przegladarce.md`. Nie zmieniaj pythonLab — potrzebne zmiany opisz w PR.
- Pomysły na konteksty (dobierz sam): kalkulator rabatu/raty jako funkcja, `czy_pelnoletni(wiek)`, `cena_biletu(wiek)`, formatowanie nicku, „ramka” z gwiazdek jako funkcja bez `return` (różnica `print` vs `return` — typowy błąd: `None`), lista ocen → średnia/min/max, lista zakupów, ranking graczy, playlista, lista wyników meczu; `append`, `len`, indeksy, wycinki, `in`, `sum`, `max`, `sorted`, pętla po liście, pułapki (indeks poza zakresem, modyfikacja listy w pętli).
- Testy: `tests/sims-g1-python-c.test.mjs` — w prawdziwym Pyodide (wzór: `tests/sims-g1-python-a.test.mjs`, `tests/sims-g1-python-b.test.mjs`): rozwiązania wzorcowe przechodzą testy zadań, kod startowy nie, pułapki w układankach psują testy, przewidywania zgadzają się z wydrukiem.

### Zadanie B — grafika (dopiero po decyzji nauczyciela)

Klasa 1: tematy 15–17 (GIMP: warstwy, selekcja, edycja zdjęć) i 37–39 (grafika wektorowa, Inkscape).
**Najpierw tylko propozycja**, bez budowania lekcji: `docs/notatki-realizacji/grafika-edytory-online.md` — 2–3 edytory online (raster i wektor), które działają **bez konta** i w przeglądarce, z oceną: konto wymagane?, wiek, reklamy, polski interfejs, zapis/eksport pliku bez logowania, odpowiedniki narzędzi GIMP/Inkscape (warstwy, selekcja, ścieżki), ryzyka (blokady sieci szkolnej, zmiany regulaminu). Decyzja nauczyciela: **nie budujemy edytora grafiki na platformie**. Lekcje powstaną po akceptacji edytora przez nauczyciela.

### Nie ruszaj (robi inny wykonawca albo czeka na decyzje)

- Klasa 1: 53–60 (teksty, wzorzec, systemy liczbowe — będą podpięte z gotowych lekcji klasy 3), temat 8.
- Klasa 3: 24–27, 31–32.
- Klasa 2: 1–7 i klasa 3: 11–15 (SketchUp) — czeka na wybór edytora 3D; klasa 2: 25–30 i klasa 3: 29–30 (robotyka) — czeka na informację o sprzęcie.

## 2. Grupa docelowa i decyzje nauczyciela (wiążące)

Pełna wersja: `docs/profil-ucznia.md` (zwłaszcza pkt 6 i 6a).

- Uczniowie technikum 15–16 lat, **niska motywacja**, słabsi z matematyki, często boją się kodu. Krótkie zdania, mówisz do ucznia na „Ty”, bez infantylizmu i moralizowania. Każda lekcja pokazuje **realną korzyść** (pieniądze, czas, gra, praca, praktyki).
- **Szybkie sukcesy**: pierwszy działający program w 3 minuty. Kolejność: przewiduj → uruchom → zmień → ułóż (Parsons) → napraw błąd → napisz sam. Błędy wyjaśniane po polsku, bez wstydu.
- **45 min, 4–7 etapów**, suma czasów etapów = `duration`. Start: hak + 1–2 pytania powtórkowe. Koniec: karta wyniku (`resultCard`) z odznakami.
- **Bez pracy domowej. Bez logowania. Wszystko w przeglądarce.**
- **Praca w parach — nie na siłę i nie na każdej lekcji** (orientacyjnie co trzecia); pary zamiast trójek; bez sztywnych ról i ocen koleżeńskich „dla metody”; zawsze wariant dla osoby bez pary. W bloku Pythona domyślnie praca samodzielna.
- **Bez sztucznych produktów** („generatory” plakatów, kreatory slajdów na platformie). Plakat/grafika — tylko w Canvie albo przez prompt do AI (z nauką pisania promptu), jako opcja.
- Kolejność odpowiedzi w pytaniach jest losowana (`content/shuffle.js`, w symulatorach `components/sims/optionOrder.js` + `data-option`). Nie stawiaj poprawnej odpowiedzi zawsze na tej samej pozycji.
- Metody COVE: https://metodyka.covepolska.pl/ — linki w `format.methods`, różne zestawy w kolejnych lekcjach. Gdy serwis jest niedostępny, korzystaj z `docs/metodyka-cove.md` i napisz o tym w PR.

## 3. Jak budować

1. Przeczytaj: `AGENTS.md`, `docs/przewodnik-wykonawcy.md` (format lekcji, kontrakt symulatora, weryfikacja), `docs/lesson-blueprint.md`, `docs/metodyka-cove.md`, `docs/profil-ucznia.md`, `docs/python-w-przegladarce.md`, `docs/rozklad-2026-2027.md`.
2. Wzorce do naśladowania (format, ton, rytm etapów): `content/lessons/62-python-variables-output.js`, `65-elif-nested-python.js`, `68-for-while-python.js`, `46-iterative-python.js`.
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

- Pracuj na własnej gałęzi (np. `codex/kl1-python-funkcje-listy`), PR do `main`. Nie scalaj sam — nauczyciel lub koordynator scala po przeglądzie.
- **Pliki zbudowane (katalog główny: `assets/`, `index.html`, `lesson/`, `teacher/`) będą kolidować z innymi PR.** Przed ostatnim `npm run build` zrób `git fetch origin main && git merge origin/main`; przy konflikcie w plikach zbudowanych weź dowolną stronę i **zbuduj ponownie** (`npm run build`), nie rozwiązuj ich ręcznie. Konflikty w `docs/rozklad-*` i `mapowanie.json` rozwiąż ręcznie, zachowując wpisy obu stron, i uruchom `node scripts/check-curriculum.mjs`.
- W opisie PR: lista lekcji, co zweryfikowano (z wynikami), fakty do weryfikacji, potrzebne zmiany wspólne.
