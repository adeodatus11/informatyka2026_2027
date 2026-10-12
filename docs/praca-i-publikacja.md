# Praca, testy i publikacja (ustalenia z nauczycielem)

## Jak nauczyciel chce pracować
- Lekcje 30–45 min, bez pracy domowej, młodzież o niskiej motywacji — szczegóły w `docs/profil-ucznia.md`.
- **Po sprawdzeniu publikujemy od razu na produkcję** (nauczyciel o to prosi): gałąź robocza → pull request → *squash merge* do `main` → GitHub Pages publikuje w ok. 1 min. Status wdrożenia: workflow „pages build and deployment” w Actions. Komentarz do PR i opis po polsku.
- Komputery w pracowni są współdzielone: strona czyści postęp przy wczytaniu; na stronie głównej jest przycisk „Wyczyść i zacznij od nowa”.
- Komputer szkolny: Windows 11 Pro, przeglądarka, Word stacjonarny, wiersz poleceń dostępny dla uczniów. Strony WWW uczniów: tylko podgląd w czasie lekcji (bez hostingu, bez kont) — nauczyciel ocenia przy komputerze ucznia.

## Przed publikacją
1. `git fetch origin` — zacznij od aktualnego `origin/main`; nie nadpisuj cudzych zmian.
2. `node scripts/check-curriculum.mjs`, `npm test`, testy `tests/sims-*.test.mjs` dotyczące zmienianych symulatorów.
3. `npm run build` (buduje i kopiuje cały `dist/` do katalogu głównego — wyniki budowy trzeba zatwierdzić razem ze zmianami).
4. Testy przeglądarkowe: `npx playwright test`. W środowisku chmurowym bez Chrome użyj konfiguracji z `launchOptions.executablePath` wskazującym Chromium (np. `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) i `channel: undefined`. Każda nowa lekcja (id > 06) przechodzi przez wszystkie etapy, kartę wyniku i axe (WCAG 2.1 AA).
5. Znany, starszy błąd testu: `tests/dental.spec.js:7` (przycisk „2. Dane”) — nie blokuje publikacji, do naprawy osobno.
6. Obejrzyj zrzuty ekranu kluczowych widoków (1366 i 1280 px; 390 px tylko brak poziomego przewijania).

## Po dodaniu lekcji
- Ustaw `order` = numer tematu w rozkładzie danej klasy (`content/lesson-order.js`).
- Zaktualizuj status w `docs/rozklad-2026-2027.md`/`.json` oraz mapę PP (`docs/podstawa-programowa/`).
- Lekcja wspólna dla dwóch klas: cienki plik importujący lekcję bazową (`{...base, id, grade, order}`), wzór: `23-dental-database-g3.js`, `27-mail-merge-g3.js`.
