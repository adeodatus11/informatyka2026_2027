# Python w przeglądarce (symulator `pythonLab`)

Lekcje 17, 19, 20 i 21 (klasa 2) uczą programowania w Pythonie bez instalacji, bez logowania i bez wysyłania kodu na serwer. Uczniowie piszą i uruchamiają prawdziwy CPython 3.14 skompilowany do WebAssembly (Pyodide).

## Jak to działa

| Element | Plik | Rola |
|---|---|---|
| Pliki Pyodide | `public/pyodide/` (ok. 13 MB) | `pyodide.mjs`, `pyodide.asm.mjs`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json`. Pliki są hostowane razem ze stroną, bez CDN. Vite kopiuje je do `dist/pyodide/`. |
| Web Worker | `components/sims/python/worker.js` | Ładuje Pyodide z `<base>/pyodide/` i wykonuje kod ucznia poza wątkiem strony. |
| Menedżer | `components/sims/python/runtime.js` | Jeden worker na stronę, tworzony dopiero po wejściu na etap z Pythonem. Obsługuje kolejkę uruchomień i limit czasu (domyślnie 3 s). Po przekroczeniu limitu wywołuje `worker.terminate()`, pokazuje komunikat „Program działa za długo — może pętla się nie kończy?” i tworzy nowy worker. |
| Runner w Pythonie | `RUNNER_PY` w `content/sims/pythonLab.js` | Przechwytuje `print`, podaje `input()` z pola „Dane wejściowe” (każda linia to jedno `input()`), ogranicza wyjście do 20 000 znaków, zbiera stan zmiennych przez `sys.settrace` (maks. 400 kroków), uruchamia testy i zwraca JSON. |
| Logika (czysty JS) | `content/sims/pythonLab.js` | Polskie wyjaśnienia błędów (`explainError`), porównanie przewidywania z wynikiem, punktacja, układanka Parsonsa, obsługa klawiszy edytora i kolorowanie składni. Testowane w Node. |
| Interfejs | `components/sims/pythonLab.jsx` i `.css`, `components/sims/python/CodeEditor.jsx` | Okno „programu” z edytorem, konsolą, testami, podpowiedziami i pytaniami. |

Pierwsze uruchomienie pobiera ok. 13 MB, z czego `pyodide.asm.wasm` waży 9,6 MB. Przeglądarka zapisuje pliki w pamięci podręcznej. Nauczyciel powinien otworzyć etap z Pythonem przed dzwonkiem, a uczniowie zaraz na początku lekcji. W sali z 30 komputerami i wolnym łączem pobieranie może potrwać kilkadziesiąt sekund. Status widać nad edytorem.

### Edytor
Edytor to textarea z kolorowaną warstwą pod spodem, bez dodatkowych bibliotek.
- **Tab** wstawia 4 spacje, a przy zaznaczeniu kilku linii wcina je wszystkie. **Shift+Tab** cofa wcięcie.
- **Enter** zachowuje wcięcie bieżącej linii. Po `:` dodaje 4 spacje, a po `return`, `pass`, `break` i `continue` cofa wcięcie.
- **Backspace** w wcięciu usuwa 4 spacje naraz, a **Ctrl+Enter** uruchamia program.
- Żeby wyjść z edytora klawiaturą, naciśnij **Esc**, a potem **Tab**.
- Zmiany idą przez `document.execCommand('insertText')`, dzięki czemu działa Ctrl+Z.
- Tekst ma 16 px, a linia z błędem jest oznaczona tłem i znakiem ⚠.

### Tryby (`mode`)
- **`code`**: edytor z przyciskami „Uruchom” i „Sprawdź”, do tego podpowiedzi. Rozwiązanie wzorcowe pokazuje się po zaliczeniu zadania. Jeśli uczeń wykorzysta wszystkie podpowiedzi i 2 razy nie przejdzie testów, może odsłonić rozwiązanie i dostaje wtedy ¼ punktów. Zadanie bez `tests` jest zaliczone po jednym uruchomieniu bez błędu.
- **`parsons`** (układanka): linie rozwiązania są wymieszane, zawsze w tej samej kolejności dla danego `id`. Do tego dochodzą pułapki z `distractors`. Uczeń dodaje linię kliknięciem, zmienia kolejność przyciskami ↑ ↓ i wcięcie przyciskami ← →. Wszystko działa z klawiatury. Zadanie jest zaliczone, gdy złożony kod przejdzie testy, więc każda poprawna kolejność jest dobra. Po nieudanej próbie uczeń dostaje wskazówkę: najpierw numer linii do sprawdzenia, potem konkretną linię albo wymagane wcięcie.
- **`trace`** (śledzenie): kod wykonuje się krok po kroku. Przyciski ⏮ ◀ ▶ ⏭ i suwak przesuwają wykonanie. Linia ➜ wykona się za chwilę, linia ✓ wykonała się przed chwilą. Obok widać tabelę zmiennych z oznaczeniem „zmiana/nowa”, listy jako komórki ze wskaźnikami (`pointers:[{var:'j',span:2}]`) i konsolę do bieżącego kroku. Przycisk „Zmień kod” pozwala prześledzić własną wersję programu.
- **`predict`** (przewidź): uczeń wpisuje, co wypisze program, i zaznacza, jak jest pewny wyniku. Potem uruchamia program i porównuje wyniki linia po linii. Porównanie ignoruje spacje przy przecinkach i nawiasach. Trafienie daje pełne punkty, a pomyłka połowę.

W każdym trybie można dodać `questions`: pytania z wyborem (`options`, `correct`) albo z krótką odpowiedzią (`answer`, `accept`). Pierwsza próba daje 1 pkt, a poprawka 0,5 pkt.

### Punktacja (`labResult`)
`max = points + liczba pytań`.
- **`code`**: pełne punkty, gdy testy przejdą bez podpowiedzi. Każda podpowiedź odejmuje 20%, a każde nieudane „Sprawdź” odejmuje 10% (pierwsze nie odejmuje). Wynik nie spada poniżej 40%. Próby z błędem składni nie liczą się jako nieudane. Dopóki nie wszystkie testy przechodzą, uczeń ma częściowe punkty: połowę punktów proporcjonalnie do liczby zaliczonych testów.
- **`parsons`**: 100%, 75%, a od trzeciej próby 50% punktów.
- **Zapis**: symulator zapisuje wynik przez `onChange({..., done, score, max, summary})`. `summary` pojawia się na karcie wyniku tylko wtedy, gdy zadanie ma szablon `summary`, np. `'Szyfrownik działa: {passed}/{total} testów'`.

## Jak dodać zadanie

```js
{type:'pythonLab', id:'xx-zadanie', mode:'code', points:3, file:'program.py',
 title:'Krótki tytuł', prompt:'Polecenie. `kod` w odwrotnych apostrofach.',
 starter:'def f(n):\n    pass\n', solution:'def f(n):\n    return n * 2\n',
 tests:[
  {call:'f(2)', expected:'4'},                       // expected = literał Pythona (np. "'ABC'", '[1, 2]', '(3, 0)')
  {call:'f(0.1)', expected:'0.2', tol:0.001},        // tolerancja dla liczb zmiennoprzecinkowych
  {stdin:['5'], contains:['10'], label:'Program'},   // test całego programu z danymi wejściowymi
  {output:'S\nZ', label:'Dokładne wyjście'}
 ],
 sourceChecks:[{pattern:'\\bfor\\b', label:'Kod używa pętli for', hint:'…'}],  // opcjonalnie: sprawdzenie treści kodu
 hints:['stopniowane', 'podpowiedzi'], questions:[…],
 input:true, stdin:['50','1000'],   // pokaż pole „Dane wejściowe” z wartościami domyślnymi
 requires:'xx-poprzednie', requiresTitle:'…',   // mastery: zadanie odblokuje się po zaliczeniu innego
 timeoutMs:6000, summary:'…{passed}/{total}…', successText:'…'}
```
- **`parsons`**: podaj `solution` (wcięcia po 4 spacje), `distractors` i `tests`.
- **`trace`**: podaj `code` i opcjonalnie `listVars`, `pointers`, `questions` oraz `editable:false`.
- **`predict`**: podaj `code`, `predictRows` (wysokość pola) i `explain`.
- **`loops:true`**: oznacza zadanie, w którym kod startowy ma celowo pętlę nieskończoną. Test sprawdza to przez limit kroków.

Po dodaniu zadania uruchom `node --test tests/sims-python.test.mjs`. Test w prawdziwym Pyodide (z `node_modules`) sprawdza:
- czy `solution` przechodzi wszystkie testy;
- czy `starter` ich nie przechodzi;
- czy układanka ułożona według rozwiązania działa, a każda pułapka psuje testy;
- czy programy do śledzenia mieszczą się w limicie kroków;
- czy odpowiedzi do pytań zgadzają się z tym, co naprawdę wypisuje program.

## Ograniczenia
- Brak `import` bibliotek spoza biblioteki standardowej: nie ma numpy ani micropip, a pakiety nie są dołączone. Moduły `random` i `math` działają.
- `input()` nie jest interaktywne. Wartości trzeba wpisać wcześniej w pole „Dane wejściowe”. Jeśli ich brakuje, program kończy się czytelnym komunikatem.
- Pętli nieskończonej nie da się przerwać bez zabicia workera, bo `SharedArrayBuffer` wymagałby nagłówków COOP/COEP, a GitHub Pages ich nie wysyła. Restart Pyodide trwa 2–3 s i używa plików z pamięci podręcznej.
- Śledzenie zatrzymuje się po 400 krokach. Wartości zmiennych są skracane do 80 znaków, a listy pokazywane jako komórki mają najwyżej 16 elementów.
- `print` jest przechwytywany w całości i pokazywany po zakończeniu programu, a nie na bieżąco.
- Kolorowanie składni jest uproszczone (jedna linia, bez napisów wieloliniowych).
- Kod i postęp ucznia żyją tylko w bieżącej sesji strony, zgodnie z zasadą całego serwisu.

## Wdrożenie
- `npm run build` kopiuje `public/pyodide/` do `dist/pyodide/`, bo Vite przenosi cały katalog `public`. Worker trafia do `dist/assets/worker-*.js`.
- **Wymagana zmiana:** `scripts/static-pages.mjs` kopiuje z `dist` do katalogu głównego tylko wybrane wpisy. Trzeba dopisać `'pyodide'` do listy w pętli `for(const entry of [...])`, inaczej GitHub Pages (z gałęzi) nie dostanie plików Pyodide.
- **Aktualizacja Pyodide:** uruchom `npm i pyodide@<wersja> --save-exact` i skopiuj 5 plików z `node_modules/pyodide/` do `public/pyodide/`. Test sprawdza, czy obie kopie są zgodne.
