# Word na komputerze i platforma z instrukcją

Lekcje 28–33 (klasa 1, kolejne numery 8–13) zakładają zainstalowany Word dla Windows. Instrukcje są przeznaczone do współczesnych wersji stacjonarnych; rozbieżności nazw poleceń można sprawdzić przez wyszukiwarkę poleceń Worda. Wersja przeglądarkowa nie jest środowiskiem docelowym.

Uczeń pobiera samodzielny plik startowy, zapisuje własną kopię i wykonuje zadania w Wordzie. Nie musi mieć gotowej pracy z poprzednich zajęć. **Zmiana zasady (październik 2026): platforma czyta DOCX ucznia lokalnie, w przeglądarce, i niczego nie wysyła** — patrz [Sprawdzarka pliku `docxCheck`](#sprawdzarka-pliku-docxcheck). Automat mierzy to, co da się odczytać z OOXML (style, pola, sekcje, recenzja); rubryka `wordRubric` zostaje samooceną tego, czego automat nie zmierzy. Materiały i źródło generatora: [opis paczek](word-materials.md).

## Wspólne aktywności

```js
{type:'wordSteps', id:'w28-steps', title:'Wykonaj w Wordzie', steps:[
  {title:'Nadaj styl', instruction:'Pełna instrukcja z menu i czynnością.',
   check:'Widoczny rezultat, który uczeń może sprawdzić.',
   help:'Diagnoza najczęstszego błędu i sposób poprawy.'}
]}
{type:'wordRubric', id:'w28-rubric', title:'Sprawdź swój dokument', filename:'28-nazwisko.docx', criteria:[
  {label:'Automatyczny numer strony', points:2,
   description:'0 pkt: brak; 1 pkt: pole jest, lecz ma błędne położenie; 2 pkt: poprawne pole w stopce.'}
]}
```

`wordSteps` nie ma punktów. `wordRubric` przechowuje tylko `ratings` i `done`; wszystkie kryteria wymagają wyboru, również „0 pkt” jest uczciwą odpowiedzią. Wynik jest samooceną pliku i nie trafia do wyniku quizu. Zmiana wyboru aktualizuje sumę; odświeżenie strony zeruje wybory zgodnie z zachowaniem całej aplikacji.

Karta quizu używa `hideGrade:true`. Nie podaje proponowanej oceny szkolnej za dokument. Instrukcje, linki do plików i kryteria są również widoczne w planie nauczyciela.

## Sprawdzarka pliku `docxCheck`

Uczeń wgrywa swój plik (przycisk albo przeciągnij-upuść). Przeglądarka rozpakowuje DOCX własnym czytnikiem ZIP (metody 0 i 8, `DecompressionStream('deflate-raw')`) i małym parserem XML w czystym JS — bez zależności i bez żadnego żądania sieciowego. Komunikat na ekranie: „Plik nie opuszcza Twojego komputera — sprawdza go przeglądarka”. Przez `onChange` trafiają do stanu lekcji wyłącznie: wyniki sprawdzeń (tak/nie), nazwa pliku, data, liczba prób, `score/max/done/summary`. Treść dokumentu, obrazy i podgląd żyją tylko w pamięci komponentu; po zmianie etapu lub odświeżeniu zostaje wynik, a podgląd wymaga ponownego wgrania.

- Wynik: suma punktów zaliczonych sprawdzeń z ostatniego wgrania; `max` = `points` aktywności (stałe). `done` po pierwszym sprawdzeniu, niezależnie od wyniku. Ponowne wgrania nie obniżają punktów — liczy się ostatnia wersja pliku (to realny produkt). `summary`: „Plik lesson-28-nowak.docx: 8/11 pkt”.
- Każde sprawdzenie pokazuje ✓/✗ z napisem „Zaliczone”/„Do poprawy”, opis tego, co znaleziono, i wskazówkę „Jak poprawić w Wordzie” (menu i polecenie). Przycisk „Pokaż w podglądzie” podświetla miejsca, których dotyczy błąd.
- Podgląd: uproszczona „kartka” — nazwa stylu przy akapicie, nagłówek i stopka w ramkach, granice sekcji i stron jako opisane linie, sekcje poziome i kolumny, tabele, obrazy z `word/media`, wynik pól (numer strony jako [nr strony], wpisy spisów), komentarze K1… pod dokumentem, wstawienia podkreślone, usunięcia przekreślone. Obok „Konspekt” jak okienko nawigacji Worda.
- Nierozpoznany plik (.doc, PDF, RTF, ODT, XLSX/PPTX, plik tymczasowy `~$`, obcięty/uszkodzony ZIP, pusty) daje czytelny komunikat z instrukcją zapisu jako .docx. `expect` (tekst z pliku startowego) ostrzega, gdy uczeń wgra plik z innej lekcji.

```js
{type:'docxCheck', id:'w28-docx', title:'Sprawdź swój plik', filename:'lesson-28-nazwisko.docx', expect:['Szkolny klub gier'], points:11, checks:[
  {id:'h1', label:'Trzy rozdziały w stylu Nagłówek 1', points:2, kind:'styleCount', style:'heading 1', min:3, max:3, texts:['Po co zakładamy klub', …]},
  {id:'footer', label:'Stopka z automatycznym numerem', points:2, kind:'footerPage', text:'Poradnik', hint:'opcjonalnie własna wskazówka'}
]}
```

Aktywność stoi w etapie z `wordRubric`, przed rubryką, a jej `id` jest w `sources` karty wyniku. `points` musi równać się sumie `points` sprawdzeń (pilnuje tego test). Style podaje się kluczem angielskim jak w XML Worda (`normal`, `title`, `heading 1`, `caption`, `toc 1`…); rozpoznawanie działa po nazwie stylu — także polskiej („Nagłówek 1”, „Tytuł”, „Legenda”) i po okrojonym identyfikatorze („Nagwek1”).

| `kind` | Parametry | Sprawdza |
|---|---|---|
| `styleCount` | `style, min?, max?, texts?` | liczba niepustych akapitów w stylu; wymagane teksty i gdzie są (z jakim stylem) |
| `styleProp` | `style, size?, color?:'dark'\|'RRGGBB', bold?` | definicja stylu z dziedziczeniem; wykrywa ręczne nadpisanie rozmiaru w akapitach |
| `headerText` | `text` | napis w nagłówku każdej sekcji (z „Połącz z poprzednim”), też pierwszej strony przy `titlePg` |
| `footerPage` | `text?` | pole PAGE w stopce każdej strony; ręcznie wpisane cyfry, pole w nagłówku lub w treści |
| `toc` | `levels?` | pole TOC (bez `\c`) z wpisami; obejmuje wskazane poziomy |
| `tocCurrent` | — | wpisy wyniku TOC = bieżące nagłówki (tekst, poziom, kolejność); wykryje zmieniony tytuł i nowy rozdział bez aktualizacji |
| `captions` | `seq, min, position?:'above'\|'below', texts?` | podpisy z polem SEQ etykiety, z opisem, nad tabelą / pod obiektem; ręcznie wpisany numer |
| `figureList` | `seq, min?` | spis TOC `\c "etykieta"` zgodny z bieżącymi podpisami |
| `ref` | `min, text?` | odsyłacze REF do istniejących zakładek, bez „Błąd! Nie można odnaleźć…” |
| `sections` | `min, max?` | liczba sekcji |
| `landscapeSection` | `contains, name?, only?` | sekcja z tekstem jest pozioma; pozostałe pionowe |
| `columnsSection` | `contains, cols, outside?, continuous?` | fragment w kolumnach, inne teksty w jednej, granice Ciągłe |
| `sectionHeaders` | `contains, text, othersText` | inny nagłówek tylko w sekcji z tekstem |
| `comments` | `min, anchor?` | komentarze z treścią; komentarz przy fragmencie |
| `trackedChanges` | `min` | liczba zmian śledzonych (w:ins, w:del, przeniesienia, formatowanie) |
| `trackedEdit` | `edits:[{before?, after?}], from?` | poprawka wykonana ze śledzeniem (wersja pierwotna vs po zmianach) |
| `cleanCopy` | — | brak komentarzy i zmian śledzonych (kopia publikacyjna) |
| `noManualPageNumbers` | — | brak ręcznie wpisanych numerów stron w nagłówkach, stopkach i treści |
| `noFakeHeadings` | — | brak krótkich pogrubionych/powiększonych akapitów Normalny udających tytuły |
| `text` | `contains?, absent?, from?` | tekst (widok po zmianach); wzorzec: tekst, `{word:'sie'}`, `{any:[…]}` |
| `paragraphStyle` | `text, style` | akapit z tekstem ma styl |
| `breakBefore` | `text` | tytuł zaczyna się na nowej stronie (podział strony, „Podział strony przed”, sekcja Następna strona) |

**Jak dodać sprawdzenie:** gdy wystarczy istniejący rodzaj — dopisz obiekt do `checks` i popraw `points`. Nowy rodzaj: funkcja `run(model,c)→{ok,detail,targets}` i `hint(c)` w `KINDS` (`content/sims/docxCheck.js`); model dokumentu jest w `content/sims/docx/model.js`. Dodaj przypadek do `scripts/build-docx-fixtures.py`, wygeneruj pliki do `tests/fixtures/docx/` i test w `tests/sims-docx.test.mjs` (plik startowy nie zalicza, rozwiązany zalicza).

**Czego automat nie sprawdzi:** numerów stron w spisach i liczby stron (DOCX nie zawiera składu stron — liczy je dopiero Word), wyglądu po wydruku, pustych stron, sensu opisów podpisów i komentarzy, trafności decyzji recenzenckich poza wskazanymi frazami, PDF z lekcji 33, czy plik zapisano w uzgodnionym miejscu. Kryteria te zostają w `wordRubric` i w ocenie nauczyciela.

## Kontrakt materiałów

- Źródłowe DOCX w `public/materials/word/`; kopie publikacyjne powstają przez build.
- Nazwy `lesson-28-start.docx` … `lesson-33-start.docx` są stałe, podobnie jak linki z treści.
- Materiały są autorskie i zawierają fikcyjne dane szkolne. Nie kopiujemy rozdziałów podręczników.
- Plik startowy ma być czytelny, ale pozostawia celowo niewykonane operacje ćwiczenia. Brak spisu, podpisu lub stylu, który ma dodać uczeń, nie jest błędem renderowania.
- Pola spisów i podpisów muszą być prawdziwymi polami Worda, jeżeli plik ma je zawierać; nie zastępuj ich wyglądającym podobnie tekstem.
- Przy recenzji sprawdzaj OOXML zmian i komentarzy, a nie tylko wygląd akapitu.
- Po utworzeniu materiałów renderuj wszystkie strony i obejrzyj PNG; zapisz wyniki kontroli w dokumentacji materiałów.

## Przygotowanie nauczyciela

Sprawdź pobranie i otwarcie plików w szkolnym Wordzie, dostępność menu Odwołania i Recenzja, miejsce zapisu prac oraz tryb chroniony dla pobranych plików. Uczeń włącza edycję tylko dla zaufanego pobranego materiału. Ustal sposób odbioru prac zgodny z praktyką szkoły, np. pokaz na ekranie lub szkolny folder, bez obietnicy, że strona prześle je automatycznie.
