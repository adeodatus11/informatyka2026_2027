// Klasa 3: ponowne użycie lekcji 16 (klasa 2) — szyfr Cezara, GA-DE-RY-PO-LU-KI i analiza częstości (cipherLab).
// Pliku 16 nie zmieniamy. Dostosowujemy: tytuł wg rozkładu klasy 3, kolejność, pytanie powtórkowe
// (w klasie 3 poprzedni temat to wyszukiwanie wzorca w Pythonie, lekcja 56 — zamiast korespondencji seryjnej)
// i organizację pracy: domyślnie samodzielnie, pojedynek w parze jako opcja (tryb „Gram sam” daje pełne punkty).
import base from './16-substitution-cipher.js';
import {choice} from '../schema.js';

const recall = choice('l51-r1','Powtórka z wyszukiwania wzorca: ile wystąpień „aa” w tekście „aaaa” znajdzie Twoja funkcja znajdz_wszystkie (metoda naiwna)?',['3 — na pozycjach 0, 1 i 2','2 — tyle, ile podaje "aaaa".count("aa")','1','4'],[0],'Algorytm naiwny sprawdza każde okno i po trafieniu przesuwa wzorzec o 1, więc znajduje też wystąpienia nakładające się. count liczy tylko rozłączne (2). Dziś też będziemy szukać wzorców — w szyfrogramach.','Ile okien ma tekst 4-znakowy dla wzorca 2-znakowego i w których pasuje „aa”?');

const fixNotes = s => typeof s === 'string' ? s
 .replace('Ustal pary i role.', 'Domyślnie każdy gra sam (zakładki „Szyfrant” i „Gram sam: zagadka” dają komplet punktów). Kto chce, może zagrać w parze z sąsiadem — bez przydzielania ról na siłę.')
 .replace('Po potwierdzeniu partnera zamiana ról.', 'W parze: po potwierdzeniu partnera zamiana ról.') : s;

const sections = base.sections.map(s => {
 const copy = {...s, activities: s.activities.map(a => a.id === 'l16-r1' ? recall : a.type === 'resultCard' ? {...a, sources: a.sources.map(id => id === 'l16-r1' ? 'l51-r1' : id)} : a)};
 if (s.id === 'duel') {
  copy.grouping = 'solo';
  copy.intro = 'Najpierw zaszyfruj własną wiadomość (zakładka „Szyfrant”), potem złam zagadkę na czas („Gram sam”). Chcesz pojedynku? Usiądź z sąsiadem: jedna osoba szyfruje i dyktuje szyfrogram, druga łamie go na swoim komputerze — potem zamiana.';
  copy.teacherNotes = fixNotes(s.teacherNotes);
 }
 if (s.id === 'start') copy.teacherNotes = s.teacherNotes + ' W klasie 3 pierwsze pytanie powtórkowe dotyczy wyszukiwania wzorca (lekcja w Pythonie) — dobry pomost: łamacz też szuka wzorców w szyfrogramie.';
 return copy;
});

export default {
 ...base,
 id:'51',grade:3,order:21,
 title:'Podstawowe pojęcia dotyczące szyfrowania i szyfrowanie tekstu metodą podstawieniową',
 format:{
  ...base.format,
  name:'Szyfrant i łamacz + nauczanie dialogowe',
  student:'Najpierw poznajesz dwa szyfry na tarczy i w maszynie harcerskiej. Potem szyfrujesz własną wiadomość i łamiesz zagadkę na czas — sam albo, jeśli chcesz, w pojedynku z sąsiadem. Na koniec łamiesz szyfr, przy którym 25 kluczy już nie wystarczy. Efekt: złamane hasło i punkty na karcie wyniku.',
  teacher:'Start: hak (harcerze, Cezar, WhatsApp) i dwa pytania powtórkowe bez notatek — pierwsze z wyszukiwania wzorca w Pythonie. Etap Cezara to nauczanie jawne: pokazujesz na projektorze tarczę (klucz 3, słowo KOT → NRW), uczniowie robią 3 zadania sami. GA-DE-RY-PO-LU-KI to szybkie odkrycie „szyfrowanie = deszyfrowanie”. W etapie pojedynku każdy szyfruje własną wiadomość i łamie zagadkę na czas; chętni grają w parze z sąsiadem (opcja). Ranking czasów łamania na tablicy jest dobrowolny. Potem łamanie szyfru analizą częstości z podpowiedziami stopniowanymi. Kończysz rozmową dialogową: dlaczego szyfr podstawieniowy nie chroni haseł — uczniowie uzasadniają na podstawie tego, co sami złamali.',
  methods:base.format.methods.filter(m=>!/kooperacyjne/.test(m.url)).concat([{name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}]),
  grouping:'Domyślnie samodzielnie, każdy na swoim komputerze. Pojedynek szyfrant–łamacz w parze to opcja (kto chce, gra z sąsiadem); tryb „Gram sam” daje te same punkty. Bez przydzielania ról na siłę.'
 },
 exitTicket:base.exitTicket.replace('Na lekcji 17 napiszesz szyfrator Cezara w Pythonie.', 'Na następnej lekcji napiszesz szyfrator Cezara w Pythonie.'),
 sections
};
