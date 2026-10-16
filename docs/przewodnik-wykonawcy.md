# Przewodnik wykonawcy lekcji

Dla osoby lub agenta budującego nowe lekcje. Uzupełnia `AGENTS.md`, `docs/lesson-blueprint.md`, `docs/metodyka-cove.md` i `docs/profil-ucznia.md`. Tematy i kolejność: `docs/rozklad-2026-2027.md`; pomysły i decyzje do tematów: `docs/notatki-realizacji/`.

Serwis: React + Vite, lekcje jako dane. Adresaci: uczniowie technikum 15–18 lat, NISKA motywacja do nauki i informatyki.
Język treści: polski, krótkie zdania, konkretnie, bez infantylizmu, bez "wodolejstwa". Mów do ucznia na "Ty".
Każda lekcja pokazuje REALNĄ korzyść dla ucznia (pieniądze, czas, bezpieczeństwo, praca/praktyki).

## Twarde ograniczenia
- 30–45 min w klasie. BRAK pracy domowej (nie planuj nic "przed lekcją"/"w domu").
- Wszystko w przeglądarce, bez logowania, bez zewnętrznych serwisów, bez żądań sieciowych z platformy. Wyjątki ustalone z nauczycielem: lekcje Worda (Word stacjonarny, `docs/word-desktop.md`), wiersz poleceń Windows 11 Pro (`ping`, `tracert`, `nslookup`, `ipconfig`) — platforma prowadzi krok po kroku, uczeń wpisuje odczyty.
- Praca w parach — tak, ale nie na każdej lekcji (orientacyjnie co trzecia) i tylko gdy naturalnie coś daje; **pary zamiast trójek**; bez sztywnych ról i ocen koleżeńskich „dla metody”; zawsze wariant solo (decyzje nauczyciela 14.10 i 16.10.2026).
- **Nie budujemy na platformie edytorów grafiki** (rastrowej, wektorowej, 3D). Tematy GIMP/Inkscape/SketchUp realizujemy w gotowych edytorach online; platforma prowadzi krok po kroku i zbiera wynik (jak lekcje Worda) — decyzja nauczyciela 14.10.2026.
- Bez sztucznych produktów: żadnych „generatorów” plakatów, komiksów, stanowisk na platformie. Jeśli potrzebny plakat/grafika — w Canvie albo przez prompt do ChatGPT z nauką pisania promptu i oznaczania grafik z AI (`docs/profil-ucznia.md`, 6a).
- Realne usługi publiczne nazywaj prawdziwie (decyzja nauczyciela, lekcja 09: login.gov.pl, IKP, mObywatel, CERT Polska, 8080), ale bez ich logo i kolorystyki; każdy ekran symulatora ma dopisek „symulacja” i fikcyjne dane. Firmy prywatne w symulatorach — fikcyjne nazwy. Przykłady phishingu mogą być podróbkami prawdziwych adresów (`login-gov.pl`) — to cel ćwiczenia.
- Dane osobowe w zadaniach fikcyjne (PESEL fikcyjny, oznaczony jako przykład).
- Dostępność: przyciski <button>, etykiety <label>, focus widoczny, działa klawiaturą, kolor nie jest jedynym nośnikiem informacji, PRIORYTET: komputer w pracowni (1366×768 i 1280×720 na projektorze). Telefon to rzadkość: przy 390 px strona nie może mieć poziomego przewijania (sprawdza to test), ale nie dopracowuj układu mobilnego. Komunikaty zwrotne w elemencie z role="status".
- Stan zapisuje się tylko przez onChange (localStorage czyszczony przy każdym załadowaniu strony — to celowe).

## Pliki, które TWORZYSZ (tylko nowe; nie edytuj wspólnych plików, gdy kilku wykonawców pracuje równolegle)
- `content/lessons/NN-nazwa.js` — lekcja (format poniżej).
- `components/sims/<typ>.jsx` — komponent symulatora, `export default function`. Typ = nazwa pliku (camelCase), używany jako `type` aktywności. Rejestracja automatyczna (import.meta.glob w components/sims/index.jsx). CSS: `components/sims/<typ>.css` importowany w komponencie. Prefiksuj klasy CSS nazwą symulatora.
- `content/sims/<typ>.js` — CZYSTA logika (bez Reacta, bez DOM), testowalna w Node.
- `tests/sims-<zakres>.test.mjs` — testy node:test logiki (`node --test tests/sims-<zakres>.test.mjs`).
Jeśli koniecznie potrzebujesz zmiany we wspólnym pliku (app/, components/activities.jsx, icons.jsx, style.css, content/scoring.js, testy istniejące) — NIE rób jej, opisz ją w raporcie końcowym.

## Kontrakt symulatora
Props: `{data, value, onChange, answers, lesson, base}`. `data` = obiekt aktywności z pliku lekcji (dowolne pola: mode, stateKey, zadania...).
Zapis: `onChange({...stan, done, score, max, summary})`
- `done` (bool): minimum wykonane → etap uznany za ukończony.
- `score`/`max` (liczby): punkty do karty wyniku (max stałe od początku, np. 12). Dopuszczalne połówki.
- `summary` (string, opcjonalnie): krótki "produkt" pracy ucznia, np. "Odszyfrowano: HEJ KLASO", "Oszczędność: 312 zł/rok". Pokazuje się na karcie wyniku.
- Kilka aktywności (różne etapy) może współdzielić dane przez wspólny `stateKey` + własny `mode`. Wtedy value/onChange dotyczą wspólnego obiektu, a wynik każdego trybu zapisuj w `value.modes[mode] = {done, score, max, summary}` — silnik (zaliczenie etapu i karta wyniku) czyta właśnie `modes[mode]` dla aktywności ze stateKey+mode. Bez stateKey: wynik na górnym poziomie value. Stan innej aktywności możesz odczytać (tylko do odczytu) z `answers[id]`.
- Komponent MUSI działać z `value` = undefined (pierwsze wejście).
- Zadania dawaj z informacją zwrotną prowadzącą do poprawy (co jest źle + wskazówka), możliwość ponownej próby; pełne punkty za pierwszą poprawną próbę, mniej po poprawce.
- Mierzalny efekt: licznik punktów/postępu widoczny w symulatorze.

## Format lekcji (content/lessons/NN-*.js) — wzoruj się na content/lessons/06-binary-computer.js
```js
import {note, choice, reveal} from '../schema.js';
export default {
 id:'NN', grade:1|2|3, order:<numer tematu w rozkładzie danej klasy — ustala kolejność w klasie>, title:'…dokładnie jak w temacie…', subtitle:'…1 zdanie z korzyścią…', topic:'…', icon:'<nazwa z components/icons.jsx>',
 tags:['3 krótkie','etykiety','na kartę'], duration:<suma czasów etapów, 30–45>,
 curriculum:'…opcjonalnie…',
 format:{name:'Nazwa schematu', student:'1–2 zdania dla ucznia: jak dziś pracujemy i co będzie efektem', teacher:'3–5 zdań dla nauczyciela: przebieg schematu, rola nauczyciela', grouping:'kto z kim, co gdy nieparzysta liczba', methods:[{name:'…',url:'https://metodyka.covepolska.pl/metoda-….html'}]},
 objectives:['3–4 cele w 1. os.: "Rozpoznaję…"'], materials:[…], teacherGuide:{preparation:'…', summary:'…'},
 sections:[ {id, label:'krótka', title, intro, grouping:'solo'|'pair'|'trio'|'group'|'class', reading?:{title, paragraphs:[2 krótkie akapity], example?:{question, answer}}, ...note(min, teacherNotes, askStudents, expectedAnswers, commonMistakes, optionalExtension, skipIfShortOnTime), activities:[…]} ],
 exitTicket:'…'
};
```
- 4–7 etapów; suma `duration` etapów == `duration` lekcji. Każde pole note() > 10 znaków.
- Ids aktywności unikalne w lekcji. `choice(id, pytanie, opcje, [indeksPoprawnej], wyjaśnienie, wskazówka)`.
- Dostępne typy wbudowane: choice, multi({question,options,correct,min,max,explanation}), matching({question,options,rows:[{label,correct:[i],explanation}]}), sequence({question,options,correct:[kolejność indeksów],explanation}), reveal, flow({nodes:[{title,text}]}), text({question,minLength,explanation} — samoocena, nie punktowane), checklist({items,explanation}), download({title,file,description} — plik w public/materials/).
- Kolejność odpowiedzi w pytaniach jest losowana automatycznie (`content/shuffle.js`); w symulatorach używaj `orderOptions` z `components/sims/optionOrder.js` i `data-option={indeksOryginalny}`. Nie układaj poprawnych odpowiedzi zawsze na tej samej pozycji w danych.
- Ostatni etap: karta wyniku:
```js
{type:'resultCard', id:'result', title:'…', sources:['id1','id2',…], badges:[{min:0,name:'…',text:'…'},{min:0.5,…},{min:0.85,…}], selfCheck:[…opcjonalnie, domyślnie objectives…]}
```
 Źródła: aktywności punktowane (choice → 1 pkt, poprawka 0,5; symulatory → value.score/max; inne typy → done?1:0). Odznaki z humorem, językiem młodzieży, bez obciachu. Proponowana ocena liczy się automatycznie.
- Pierwszy etap: krótki "hak" (sytuacja z życia ucznia) + 1–2 pytania powtórkowe z poprzedniej lekcji (retrieval practice) — podane w specyfikacji.
- Lekcja ma odnośniki do metod COVE w format.methods. Dostępne (url = https://metodyka.covepolska.pl/<plik>): metoda-feedback-poprawa.html (Feedback prowadzący do poprawy), metoda-mastery-learning.html (Mastery learning), metoda-metapoznanie.html (Metapoznanie), metoda-nauczanie-dialogowe.html (Nauczanie dialogowe), metoda-nauczanie-jawne.html (Nauczanie jawne), metoda-ocenianie-ksztaltujace.html (Ocenianie kształtujące), metoda-peer-tutoring.html (Tutoring rówieśniczy), metoda-powtorki-rozlozone.html (Powtórki rozłożone w czasie), metoda-problem-projekt-przypadek.html (Problem, projekt i przypadek), metoda-przyklady-rozwiazane.html (Przykłady rozwiązane), metoda-retrieval-practice.html (Retrieval practice), metoda-uczenie-kooperacyjne.html (Uczenie kooperacyjne), metoda-udl.html (UDL).

## Styl wizualny
Istniejący CSS: app/style.css (klasy .activity, .btn, .btn.secondary, .text-button, .choice, .feedback, .info-card, .muted, .small). Używaj ich. Kolory jasne tło, akcent #1f4fa3/#2f6fdb, zielony #16a36a, czerwony #d64545, żółty #f0b429. Ikony: `import {Icon} from '../icons.jsx'` — nazwy w components/icons.jsx (m.in. globe, search, idcard, table, funnel, mail, hash, board, house, energy, shield, palette, warning, trophy, group, check, close, right, left, reset, printer, projector, wifi, laptop, phone, camera, school, book, clock).
Symulator ma wyglądać jak "prawdziwe" narzędzie (pasek adresu, okno programu, kreator), ale ze wskazanym napisem "symulacja".

## Weryfikacja (obowiązkowa przed raportem)
Inni wykonawcy pracują RÓWNOLEGLE w tym samym katalogu — NIE uruchamiaj `npm run build` (nadpisuje pliki w katalogu głównym) ani git.
1. `node --test tests/sims-<zakres>.test.mjs` i `npm test` (npm test może chwilowo nie przejść przez cudze pliki w trakcie tworzenia — oceniaj tylko swoje lekcje).
2. `npx vite build --outDir <twój scratch>/dist --emptyOutDir` — musi się zbudować.
3. Dev server na WŁASNYM porcie: `npx vite --host 127.0.0.1 --port <port> --strictPort` (w tle) i test Playwright (chromium: `chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})`; `import {chromium} from '@playwright/test'`; skrypt trzymaj w katalogu repo `tmp/` (jest w .gitignore), inaczej import nie znajdzie pakietu) — skrypt przechodzi każdą Twoją lekcję (`http://127.0.0.1:<port>/#/lesson/NN`): rozwiązuje symulatory, sprawdza kartę wyniku z max punktów, brak błędów w konsoli, szerokości 1366 i 1280 (dopracowane) oraz 390 px (tylko brak poziomego scrolla strony). Zrób zrzuty ekranu kluczowych widoków i OBEJRZYJ je (Read na PNG) — popraw brzydkie/nieczytelne miejsca. Zabij serwer na koniec.
Raport końcowy (krótko): lista plików, typy symulatorów, co zweryfikowano, ewentualne potrzebne zmiany we wspólnych plikach, znane ograniczenia.

## Uwagi z budowy lekcji 35–43
- Podgląd strony ucznia (`htmlLab`) to `iframe sandbox=""` w zamkniętym shadow root — axe zawiesza się na ramce bez skryptów, a treści ucznia (czasem celowo zepsutej) i tak nie ocenia. Przy nowych ramkach podglądu postępuj tak samo.
- `htmlLab` (tryby `free`, `tasks`, `fix`, `serp`, `theme`, `show`) nadaje się dla klasy 3 (tematy 31–32, strona WWW).
