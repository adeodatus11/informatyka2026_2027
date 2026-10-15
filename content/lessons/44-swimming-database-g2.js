// Klasa 2: ponowne użycie lekcji 22 (klasa 3) — ta sama treść i symulator bazy „Zawody”.
// Pliku 22 nie zmieniamy. Zmiany dla klasy 2: tytuł wg rozkładu klasy 2, pytanie powtórkowe z klasy 1
// (filtr w arkuszu zamiast systemu dwójkowego, którego ta klasa jeszcze nie miała przed bazami),
// praca domyślnie samodzielna (decyzja nauczyciela 14.10.2026 — bez ról w parach).
import base from './22-swimming-database.js';
import {choice} from '../schema.js';

const TITLE='Podstawowe pojęcia i przykłady bazy danych – obsługa szkolnych zawodów pływackich';
const recall=choice('zw2-filter','Powtórka z arkusza (klasa 1): masz w arkuszu tabelę 61 startów. Jak najszybciej pokazać tylko starty dziewcząt, niczego nie kasując?',['Włączyć filtr (Autofiltr) i w kolumnie płeć zostawić tylko „K”','Usunąć ręcznie wiersze chłopców','Posortować tabelę po nazwisku'],[0],'Filtr ukrywa wiersze, które nie spełniają warunku, i niczego nie usuwa. W bazie danych tę samą robotę wykonuje kryterium kwerendy — tylko że kwerendę można zapisać i użyć za rok.','Szukasz narzędzia, które ukrywa wiersze, a nie je kasuje.');

const sections=base.sections.map(s=>{
 if(s.id==='start')return {...s,activities:s.activities.map(a=>a.id==='zw-byte'?recall:a),
  teacherNotes:'Rzuć hak: dyrektor czeka przy mikrofonie, a wyniki są w arkuszu. Uczniowie odpowiadają na pytanie o najszybszą metodę. Drugie pytanie to powtórka z arkusza z klasy 1 (filtr) — przyda się za chwilę, bo filtr w arkuszu i kryterium w bazie robią to samo. To pierwsza lekcja o bazach w klasie 2: nie zakładaj, że uczniowie znają Accessa.'};
 if(s.id==='explore')return {...s,grouping:'solo',
  teacherNotes:'Uczniowie pracują samodzielnie, każdy w swoim symulatorze. Kto chce, może po zadaniu 2 porównać z sąsiadem, gdzie zaznaczył klucze — bez dzielenia się klawiaturą. W zadaniu 4 nie zdradzaj pułapki — niech symulator powie o dyskwalifikacji. Osoby, które utknęły na kluczach, zbierz na 2 minuty przy jednym ekranie.'};
 if(s.id==='result')return {...s,activities:s.activities.map(a=>a.type==='resultCard'?{...a,sources:a.sources.map(id=>id==='zw-byte'?'zw2-filter':id)}:a)};
 return s;
});

export default {
 ...base,
 id:'44',grade:2,order:8,title:TITLE,topic:TITLE,
 format:{...base.format,
  grouping:'Samodzielnie przy komputerze — każdy ma swój symulator i swój wynik. Para jest tylko opcją: w etapie „Relacje” można porównać odpowiedzi z sąsiadem, ale każdy klika u siebie.'},
 sections
};
