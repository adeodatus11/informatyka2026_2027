# Wzorzec kolejnej lekcji

Ten dokument opisuje istniejący layout i kontrakt treści. Nowa lekcja rozszerza platformę; nie wymaga nowej strony od zera. Przykłady odniesienia: `content/lessons/07-internet-ocean.js` oraz `13-hexadecimal.js`.

## Warstwy

- `content/lessons/NN-nazwa.js`: temat, klasa, czas, cele, materiały, metody, etapy i aktywności.
- `app/main.jsx`: karta w klasie, nawigacja etapów i stan odpowiedzi. Automatycznie znajduje lekcje przez `content/lessons/index.js`.
- `components/lesson-reading.jsx`: wyjaśnienia `reading` w etapie.
- `components/activities.jsx`: quiz, pary, kolejność, pliki do pobrania, instrukcje i pozostałe aktywności.
- `components/ResultCard.jsx`: punktacja ćwiczeń na stronie i samoocena celów.
- `components/teacher.jsx`: panel prowadzącego i plan do druku.
- `public/materials/`: źródłowe pliki ucznia. `scripts/static-pages.mjs` tworzy adresy lekcji i kopię publikacyjną.

## Obowiązkowe elementy treści

1. Konkretny problem, odbiorca i rezultat; cele napisane językiem ucznia.
2. Krótkie przypomnienie potrzebnej wiedzy, z informacją zwrotną po odpowiedzi.
3. Wyjaśnienia niezbędnych pojęć i demonstracja decyzji, nie tylko lista kliknięć.
4. Zadanie samodzielne z danymi, instrukcją, kontrolą wyniku i pomocą przy błędach.
5. Przeniesienie umiejętności na zmieniony przypadek, ocenę koleżeńską lub poprawę.
6. Sprawdzenie wiedzy, ocena produktu według jawnych kryteriów oraz krótka refleksja końcowa.

Etapy mogą mieć różne nazwy i organizację. Ich czasy muszą sumować się do `duration`. Standardem jest 45 minut. Projekt 90 minut wymaga `sessions: [45,45]`, jawnej przerwy po pierwszej części i bezpiecznego punktu zapisu pracy. Nie ukrywaj pracochłonnych czynności pod „5 minut”.

Każdy etap ma `id`, `label`, `title`, `intro`, `duration`, `teacherNotes`, `askStudents`, `expectedAnswers`, `commonMistakes`, `optionalExtension`, `skipIfShortOnTime`, `activities`. Użyj funkcji `note()` z `content/schema.js`. Wyjaśnienia na platformie dodawaj w `reading: {title, paragraphs, example}` albo w aktywnościach instruktażowych, nie wyłącznie w panelu nauczyciela.

## Metody i organizacja

`format` zawiera `name`, `student`, `teacher`, `grouping`, `methods:[{name,url}]`. Wybieraj metody na podstawie [biblioteki COVE](metodyka-cove.md). W pracy w parach ustal role, moment zamiany i wariant samodzielny. Opisz decyzję nauczyciela po błędnych odpowiedziach: co wyjaśnia ponownie, a kiedy przechodzi dalej.

## Ocena i uczciwe komunikaty

- Quizy mają jednoznaczne klucze, wyjaśnienia i podpowiedzi. Nie punktuj samego otwarcia instrukcji.
- `resultCard.sources` wskazuje tylko faktycznie oceniane zadania. W lekcjach pracy w zewnętrznym programie ustaw `hideGrade:true`, aby quiz nie proponował oceny za nieobejrzany plik.
- Checklista oznacza deklarację ucznia; nie jest automatycznym sprawdzeniem pliku.
- Kryteria produktu opisują zachowania możliwe do obejrzenia i rozróżniają brak, częściowe oraz pełne wykonanie. Nauczyciel ustala ocenę po obejrzeniu produktu.
- Nie deklaruj wysyłania wyników do nauczyciela. Postęp tej wersji aplikacji jest zerowany po odświeżeniu; uczeń zachowuje pracę w pliku.

## Wzorzec Worda

Ustaw `workspace:'desktop-word'`. Komponenty `WordWorkspaceNotice`, `wordSteps` i `wordRubric` są wspólne dla wszystkich lekcji. Ich kontrakt i zasady plików opisuje [Word desktop](word-desktop.md).

## Kontrola przed publikacją

Sprawdź liczbę tematów w klasach, sumy minut, unikalne ID aktywności, zgodność instrukcji z plikami i działanie wszystkich pobrań. Uruchom walidację mapy, testy treści, build i kontrolę w przeglądarce. Wykonaj co najmniej jedno przejście poprawne oraz poprawienie błędu; obejrzyj widok mobilny i plan nauczyciela. Wyniki budowy trafiają do katalogu głównego repo, bo stamtąd publikuje GitHub Pages.
