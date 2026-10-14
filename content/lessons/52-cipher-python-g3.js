// Klasa 3: ponowne użycie lekcji 17 (klasa 2) — ten sam szyfrownik Cezara w Pythonie (pythonLab).
// Pliku 17 nie zmieniamy. Dostosowujemy: tytuł wg rozkładu klasy 3, kolejność, pracę domyślnie samodzielną
// (decyzja nauczyciela 14.10.2026: bez ról kierowca–nawigator na siłę), zapowiedź kolejnej lekcji
// (w klasie 3 po szyfrach jest zamiana liczby dwójkowej na dziesiętną). Pytania powtórkowe cp-r1, cp-r2
// dotyczą szyfru Cezara, czyli lekcji 51 (poprzedni temat w klasie 3) — zostają.
import base from './17-cipher-python.js';

const REPLACE = [
 [' W parze: kierowca klika, nawigator czyta testy i pilnuje wcięć.', ' Klasa uczyła się już napisów w Pythonie — dziś to samo w służbie szyfru.'],
 ['Pilnuj ról w parach: kierowca klika, nawigator czyta na głos wynik testów („test zawijanie po Z nie przechodzi — sprawdź % 26”). Po zaliczeniu nawigator układa funkcję u siebie i tłumaczy każdą linię, kierowca sprawdza.', 'Uczniowie pracują samodzielnie; zamiast podpowiadać kod, każ przeczytać na głos test z ✗ („test zawijanie po Z nie przechodzi — sprawdź % 26”). Po zaliczeniu zapytaj losową osobę, co robi każda linia.'],
 ['Zamiana ról w parze. Funkcja szyfruj_litere', 'Funkcja szyfruj_litere'],
 ['Praca samodzielna w parach z zamienionymi rolami.', 'Praca samodzielna.'],
 ['Gdy para utknie na deszyfruj', 'Gdy ktoś utknie na deszyfruj'],
 [' Po zaliczeniu nawigator przepisuje rozwiązanie u siebie.', ''],
 ['Pokaż klasie jedną parę, która napisała', 'Pokaż klasie rozwiązanie ucznia, który napisał'],
 ['Przechwyciliście wiadomość, ale nie znacie klucza. Komputer może po prostu sprawdzić wszystkie. Dopiszcie pętlę, uruchomcie program i znajdźcie jedyną linię, która ma sens.', 'Przechwyciłeś wiadomość, ale nie znasz klucza. Komputer może po prostu sprawdzić wszystkie. Dopisz pętlę, uruchom program i znajdź jedyną linię, która ma sens.'],
 ['Znowu zamiana ról. Pierwsza para, która poda hasło,', 'Pierwsza osoba, która poda hasło,'],
 ['Szybsze pary robią bonus', 'Szybsi uczniowie robią bonus'],
 ['Zapowiedz: następnym razem algorytmy porządkowania — bez kodu, a potem napiszemy je w Pythonie.', 'Zapowiedz: następnym razem zamiana liczby dwójkowej na dziesiętną w Pythonie — ord i chr z dzisiejszej lekcji też wrócą.'],
 [' Ustal pary przed lekcją.', ''],
];
const fix = s => typeof s === 'string' ? REPLACE.reduce((t, [a, b]) => t.split(a).join(b), s) : s;

const sections = base.sections.map(s => ({
 ...s,
 grouping: s.grouping === 'pair' ? 'solo' : s.grouping,
 intro: fix(s.intro),
 teacherNotes: fix(s.teacherNotes),
}));

export default {
 ...base,
 id:'52',grade:3,order:22,
 title:'Programowanie algorytmu szyfrowania podstawieniowego',
 format:{
  ...base.format,
  name:'Przykłady rozwiązane z wygaszaniem',
  student:'Pracujesz sam, na swoim komputerze. Najpierw przewidujesz i uruchamiasz gotowe programy, potem układasz kod z klocków, a na końcu piszesz szyfrownik od zera. Efekt: działający szyfrownik i złamana tajna wiadomość.',
  teacher:'Schemat „wygaszania”: od przykładu rozwiązanego (etap 3 — śledzisz kod na projektorze i mówisz na głos, co robi każda linia) przez częściowo gotowe rozwiązanie (etap 4 — układanka z linii) do pracy samodzielnej (etap 5 — pusta funkcja i testy). Klasa 3 zna już napisy, pętle i ord/chr z lekcji 18–20, więc etap 2 może pójść szybciej. Twoja rola: odsyłasz do testów z ✗ i zadajesz pytania („co zwraca ta funkcja dla Z?”) zamiast podawać kod.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Para tylko jako opcja (np. przy łamaniu szyfru) — bez przydzielania ról; każdy ma własną kartę wyniku.',
  methods:base.format.methods.filter(m => !/kooperacyjne/.test(m.url)).concat([{name:'Powtórki rozłożone w czasie',url:'https://metodyka.covepolska.pl/metoda-powtorki-rozlozone.html'}])
 },
 teacherGuide:{...base.teacherGuide, preparation:fix(base.teacherGuide.preparation)},
 sections
};
