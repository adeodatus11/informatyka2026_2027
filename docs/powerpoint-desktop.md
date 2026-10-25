# PowerPoint na komputerze i platforma z instrukcją

Lekcje 75–76 (klasa 1, tematy 46–47 rozkładu) zakładają zainstalowany PowerPoint dla Windows (2019/2021/2024 lub Microsoft 365), tak jak lekcje Worda zakładają Worda (`docs/word-desktop.md`). Lekcje mają `workspace:'desktop-powerpoint'`. Platforma daje instrukcje, krótkie ćwiczenia i kryteria; produkt — plik PPTX — powstaje w PowerPoincie. Strona nie odczytuje ani nie wysyła pliku.

## Aktywności

- `download` — plik startowy i (w 75) legalna ilustracja do podmiany.
- `wordSteps` — kroki w PowerPoincie (instrukcja, „Sprawdź efekt”, „Gdy coś nie działa”). Bez punktów.
- `wordRubric` — samoocena pliku (`filename` z `.pptx`). Nie trafia do wyniku quizu.
- `slideCritic` (symulator, `components/sims/slideCritic.jsx`, logika `content/sims/slideCritic.js`, testy `tests/sims-g1-slides.test.mjs`):
  - `mode:'errors'`, `set:'basics'` (75) lub `set:'chopin'` (76) — miniatury slajdów jako obrazy SVG; uczeń zaznacza wszystkie problemy (ściana tekstu, mała czcionka, kontrast, animacje, znak wodny, brak źródła, błąd w faktach, grafika z AI udająca zdjęcie) albo „w porządku”. 2 pkt za pierwszą próbę, 1 pkt po poprawce. Miniatury są w `<img>` z opisem `alt`, bo celowo zły kontrast nie może być tekstem strony (axe).
  - `mode:'layout'` — dobór układu slajdu do treści (6 zadań, każdy układ raz). 1 pkt / 0,5 pkt.
- Karta wyniku: `hideGrade:true`; źródła to tylko pytania i symulator.

## Materiały (`public/materials/powerpoint/`)

Generator: `python3 scripts/build-powerpoint-materials.py` — tylko biblioteka standardowa Pythona (XML PresentationML + `zipfile`, PNG przez `zlib`). Wynik jest deterministyczny. `manifest.json` opisuje stan początkowy i oczekiwane operacje.

| Plik | Zawartość | Cel pracy |
|---|---|---|
| `lesson-75-start.pptx` | „Praktyki zawodowe”, 6 slajdów, 8 standardowych układów (polskie nazwy), motyw Office, bez notatek | Celowo zła prezentacja: ręczne formatowanie w polach układu (Impact, Comic Sans, Times, kolory), ręczne tła slajdów 1 i 6, ściana tekstu 16 pt, jasnożółty tekst + 3 ozdobniki + 5 animacji (wirowanie, wlatywanie, wymazywanie, zanikanie, pojawianie), rozciągnięte zdjęcie fikcyjnego fotobanku ze znakiem wodnym i bez źródła, tabela 8×4 w 11 pt, czerwony na zielonym, efektowne przejścia, brak slajdu Źródła. Naprawa: Resetuj + Resetuj tło na wszystkich slajdach, motyw i wzorzec, usunięcie animacji, podmiana grafiki z podpisem, slajd Źródła, notatki. |
| `lesson-75-grafika.png` | Autorska ilustracja stanowiska pracy 1200×800, bez znaku wodnego (CC0, materiał lekcji) | Legalny zamiennik zdjęcia ze slajdu 4. |
| `lesson-76-start.pptx` | „Chopin”, 8 pustych slajdów, motyw kremowo-granatowy (Georgia/Calibri), 15 układów: 8 „Chopin – …” z własnymi podpowiedziami (`hasCustomPrompt`) + 7 standardowych | Struktura: tytuł, hak, życie w 3 faktach, Warszawa i Paryż, muzyka (pole obrazu na QR), ciekawostka, Chopin dziś (opcjonalny), źródła. Każdy slajd ma notatkę prelegenta ze wskazówką do zastąpienia. |

## Kontrola wydania (16.10.2026)

- XML wszystkich części poprawny składniowo; ZIP bez błędów; pierwsza część `[Content_Types].xml`.
- Odczyt w python-pptx 1.0.2 (środowisko testowe, nie zależność generatora): 75 — 6 slajdów, 8 układów, obraz, tabela i kształty; 76 — 8 slajdów, 15 układów, każdy symbol zastępczy powiązany z podpowiedzią układu, 8 notatek.
- Render LibreOffice Impress 24.2 do PDF i obejrzenie wszystkich stron (75: 6, 76: 8; dla 76 dodatkowo kopia z wpisanym tekstem podpowiedzi, bo puste pola nie są drukowane). Polskie znaki poprawne, brak obcięć poza zamierzonymi. Czcionki Impact/Comic Sans/Monotype Corsiva w renderze były podstawione — w Windows wyglądają „gorzej”, zgodnie z celem.
- Do sprawdzenia w szkolnym PowerPoincie (nie było dostępu do Microsoft PowerPoint): otwarcie bez komunikatu o naprawie, nazwy efektów w okienku animacji, działanie Resetuj tło przy wielu zaznaczonych slajdach, podpowiedzi w pustych polach 76, skrót Alt+F5.

## Przygotowanie nauczyciela

Jak w lekcjach Worda: pobranie, widok chroniony (Włącz edytowanie), miejsce zapisu, sposób oddania prac (pokaz przy komputerze lub szkolny folder). AI i Canva w lekcji 76 są opcją — zawsze jest wariant bez konta (Wikimedia Commons, własne zdjęcia, ikony PowerPointa). Fakty o Chopinie: lista DO WERYFIKACJI w `teacherGuide.preparation` lekcji 76.
