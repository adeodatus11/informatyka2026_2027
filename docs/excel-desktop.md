# Excel na komputerze i kontrola wyniku z komórki

Lekcje 69–74 (klasa 1, tematy 40–45 rozkładu) zakładają **Excel stacjonarny dla Windows** (2019/2021/2024 lub Microsoft 365) w pracowni. Wzorzec jest ten sam co w lekcjach Worda ([word-desktop.md](word-desktop.md)): platforma daje instrukcje krok po kroku (`wordSteps`), wyjaśnienia, krótkie ćwiczenia, plik startowy (`download`) i kryteria (`wordRubric`, samoocena bez wpływu na wynik quizu). Produkt ucznia powstaje w pliku XLSX. Lekcja ma `workspace:'desktop-excel'` — aplikacja pokazuje wtedy komunikat „Przeglądarka obok Excela” i materiały w planie nauczyciela. Karta wyniku ma `hideGrade:true`.

| Lekcja | Temat | Plik startowy | Kontekst |
|---|---|---|---|
| 69 | 40 · Formuły, formaty danych, formatowanie tabeli | `lesson-69-start.xlsx` (Wypłata) | praca wakacyjna: godziny × stawka, plan wydatków |
| 70 | 41 · Funkcje | `lesson-70-start.xlsx` (Turniej, Prąd) | statystyki turnieju; rachunek za prąd z `$B$4` |
| 71 | 42 · Wykresy | `lesson-71-start.xlsx` (Abonamenty, Wydatki, Kanał) | abonamenty, kieszonkowe, wykres z osią nie od zera |
| 72 | 43 · Projekt z geografii | `lesson-72-start.xlsx` (Klimat, Województwa) | klimatogram Warszawy (IMGW, normy 1991–2020) |
| 73 | 44 · Filtry, tabele i wykresy przestawne | `lesson-73-start.xlsx` (Zamówienia) | praktyki w sklepie internetowym, 40 zamówień |
| 74 | 45 · Filtr w tabeli przestawnej i poradnik | `lesson-74-start.xlsx` (Wydatki, Poradnik) | rozliczenie wyjazdu klasowego |

## Kontrakt materiałów

- Pliki w `public/materials/excel/`, nazwy `lesson-NN-start.xlsx` są stałe (linki w lekcjach i w teście). Build kopiuje je do publikacji.
- Generator: `scripts/build-excel-materials.py` — tylko biblioteka standardowa Pythona (zipfile + XML, bez openpyxl, bez internetu). Uruchomienie: `python3 scripts/build-excel-materials.py`. Wynik jest powtarzalny (stała data w ZIP). Tworzy też `manifest.json` z opisem arkuszy.
- Dane są fikcyjne, z wyjątkiem lekcji 72 (dane publiczne ze źródłem i okresem w pliku; wartości przybliżone — **do weryfikacji** z IMGW i GUS BDL przed lekcją, opis w `teacherGuide`).
- Starter **nie zawiera formuł**, które uczeń ma wpisać. Komórki do uzupełnienia są puste i żółte. Celowe „pułapki” w danych są częścią zadania i są sprawdzane w teście: liczba zapisana jako tekst (69, C13), data bez formatu (69, kolumna A), puste pole i zero (70), pusta komórka i liczba pod ceną kWh, które bez `$` dają 0 i 720 zł (70).
- Nagłówek tabeli jest w wierszu 4, a wiersz 3 jest pusty — Ctrl+T, filtr i tabela przestawna same rozpoznają zakres danych.
- `workbook.xml` ma `fullCalcOnLoad="1"`; style z formatami daty, waluty (`# ##0,00 zł`) i procentu. Pakiety przeszły walidację części `xl/*.xml` względem schematu SpreadsheetML (ISO/IEC 29500, transitional) oraz kontrolę w teście. W tym środowisku nie było LibreOffice Calc ani Excela — **przed pierwszą lekcją otwórz każdy plik w Excelu w pracowni**.

## Kontrola „wpisz wynik z komórki” (`sheetCheck`)

Platforma nie odczytuje pliku ucznia. Ponieważ plik startowy ma znane dane, wynik poprawnie wykonanego zadania jest znany. Uczeń wykonuje zadanie w Excelu, odczytuje wartość (komórka, wiersz sumy, filtr, tabela przestawna, etykieta wykresu) i wpisuje ją na stronie. Symulator `sheetCheck` porównuje ją z oczekiwaną wartością, daje punkty i natychmiastową podpowiedź.

```js
import {sheetCheck} from '../sims/sheetCheck.js';
sheetCheck('x70-power', {phase:'excel', file:'lesson-70-start.xlsx', sheet:'Prąd', title:'Wpisz wyniki z arkusza Prąd', tasks:[
 {id:'e11', prompt:'Ile kosztuje miesięcznie router Wi-Fi?', cell:'E11', answer:7.92, unit:'zł',
  traps:[{value:720, feedback:'720 zł za router? Adres ceny przesunął się przy kopiowaniu. Użyj $B$4.'}],
  hint:'w E11 musi być …*$B$4.', explain:'10 W × 24 h × 30 dni = 7,2 kWh × 1,10 zł = 7,92 zł.'}]})
```

- `phase:'predict'` — ćwiczenie przed Excelem na stronie (fragment arkusza `grid` z paskiem formuły albo prosty wykres `charts`), `phase:'excel'` — odczyt z pliku ucznia.
- Rodzaje zadań: liczba (domyślnie; tolerancja `tol`, alternatywy `alt`, np. 62 lub 0,62), `kind:'formula'` (normalizacja: wielkie litery, bez spacji, `,` → `;`; wymagany znak `=`; `accept` z równoważnymi zapisami) i `kind:'text'` (bez wielkości liter i polskich znaków, `accept`).
- `traps` to typowe błędy z diagnozą (np. dzielenie przez 4 zamiast ŚREDNIA, `>` zamiast `>=`, brak `$`, suma z nagłówkiem). Wartości pułapek wynikają z tych samych danych.
- Punkty: 1 za pierwszą poprawną próbę, 0,5 po poprawce. Po 2 błędnych próbach można odsłonić rozwiązanie (0 pkt za zadanie) — uczeń nie utknie. `done`, gdy wszystkie zadania są zamknięte. Pole `points` = liczba zadań (pusty stan na karcie wyniku).
- To potwierdza **wartość**, nie sposób zapisu (formuła czy wpisana liczba). Dlatego rubryka i obejrzenie pliku przez nauczyciela pozostają osobną oceną.

## Testy

`node --test tests/sims-g1-excel.test.mjs` czyta pliki XLSX własnym czytnikiem (ZIP + XML), liczy z danych wszystkie wartości oczekiwane w lekcjach (sumy, średnie z pustymi polami, filtry, tabele przestawne, procent na wykresie kołowym) i porównuje je z `answer` w lekcjach. Sprawdza też, że każda pułapka jest rozpoznawana jako pułapka, a nie jako poprawna odpowiedź. Po zmianie danych w generatorze uruchom generator i test — test wskaże liczby do poprawy w lekcjach.

## Przygotowanie nauczyciela

Otwórz pliki w szkolnym Excelu, włącz edytowanie, sprawdź nazwy kart (Microsoft 365: Projekt tabeli, Analiza tabeli przestawnej; starsze wersje: Projektowanie, Analiza/Opcje), okno wykresu kombi i fragmentator. Polski Excel oddziela argumenty średnikiem, błąd wartości to `#ARG!`. Ustal sposób odbioru plików (pokaz na ekranie lub folder szkolny) — strona niczego nie przesyła.
