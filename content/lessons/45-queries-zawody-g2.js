// Klasa 2: ponowne użycie lekcji 25 (klasa 3) — ta sama treść i projektant kwerend z bazą „Zawody”.
// Pliku 25 nie zmieniamy. Zmiany dla klasy 2: pytania powtórkowe z lekcji 44 (zawody pływackie),
// opis dla nauczyciela (w klasie 2 to pierwsze spotkanie z projektantem kwerend),
// praca domyślnie samodzielna bez sprawdzania w parach (decyzja nauczyciela 14.10.2026).
import base from './25-queries-zawody.js';

const sections=base.sections.map(s=>{
 if(s.id==='start')return {...s,
  teacherNotes:'Hak: spiker czeka, wyników 61. Trzy krótkie pytania na start — samodzielnie, bez notatek: ranking (rosnąco czy malejąco) i dwie powtórki z poprzedniej lekcji o bazie Zawody (klucz obcy, typ pola czas).',
  activities:s.activities.map(a=>a.id==='zq-type'?{...a,question:'Powtórka z lekcji o zawodach: jakiego typu jest pole czas, skoro wpisujemy 32,46?'}:a)};
 if(s.id==='l2')return {...s,
  teacherNotes:'Po zaliczeniu 2 z 3 zleceń uczniowie otwierają Widok SQL podium i porównują go z modelem z etapu 2: czy jest INNER JOIN i warunek na dyskwalifikacji? Zapytaj klasę, kto „wpadł” na Alicję Kaczmarek.'};
 if(s.id==='l3')return {...s,grouping:'solo',
  teacherNotes:'Zanim uczeń kliknie „Uruchom”, czyta Podsumowanie i sam przewiduje liczbę wierszy („8 — tyle jest konkurencji”, „10 — tyle klas startowało”), potem sprawdza. Kto chce, może porównać przewidywanie z sąsiadem. Zbierz przy jednym ekranie osoby, którym wychodzi za dużo wierszy.'};
 return s;
});

export default {
 ...base,
 id:'45',grade:2,order:9,
 format:{...base.format,
  grouping:'Praca samodzielna. Na poziomie 3 każdy przed uruchomieniem przewiduje liczbę wierszy; porównanie z sąsiadem jest opcją, nie obowiązkiem.'},
 teacherGuide:{...base.teacherGuide,
  preparation:'Otwórz etap 2 na projektorze. W klasie 2 to pierwsze spotkanie z projektantem kwerend (ten sam wróci przy bazie Stomatolog). Baza „Zawody” z poprzedniej lekcji: Zawodnicy 1–∞ Wyniki ∞–1 Konkurencje. Czas to Liczba w sekundach z setnymi (32,46); dyskwalifikacja to Krótki tekst „tak”/„nie”. Pułapki zleceń: w podium 50 m dowolnym dziewcząt najlepszy czas ma zdyskwalifikowana Alicja Kaczmarek (trzeba <> "tak"); w rekordach konkurencji — Min, nie Maks, i warunek Gdzie na dyskwalifikacji; Dawid Baran jest w 2C, ale ma rocznik 2009.',
  summary:'Karta wyniku: maks. 22 pkt (4 pytania + 3 poziomy po 6 pkt). Poproś ucznia o Widok SQL podium (zlecenie 2A) i wskazanie ORDER BY oraz warunku na dyskwalifikacji. Kto zaliczył poziom 3, może — jeśli chce — podpowiedzieć innym pytaniem, bez klikania za nich. Produkt lekcji to „Oficjalne wyniki zawodów” na karcie wyniku.'},
 sections
};
