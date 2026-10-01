# Word na komputerze i platforma z instrukcją

Lekcje 28–33 (klasa 1, kolejne numery 8–13) zakładają zainstalowany Word dla Windows. Instrukcje są przeznaczone do współczesnych wersji stacjonarnych; rozbieżności nazw poleceń można sprawdzić przez wyszukiwarkę poleceń Worda. Wersja przeglądarkowa nie jest środowiskiem docelowym.

Uczeń pobiera samodzielny plik startowy, zapisuje własną kopię i wykonuje zadania w Wordzie. Nie musi mieć gotowej pracy z poprzednich zajęć. Platforma nie odczytuje ani nie wysyła DOCX, dlatego samodzielne potwierdzenie nie jest dowodem automatycznej weryfikacji. Materiały i źródło generatora: [opis paczek](word-materials.md).

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
