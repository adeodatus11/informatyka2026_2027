// Klasa 3: ponowne użycie lekcji 12 (klasa 2) — ta sama treść i symulator korespondencji seryjnej.
// Pliku 12 nie zmieniamy. Dostosowujemy tylko odwołania do „lekcji 11”: w klasie 3 poprzednia lekcja
// to „Importowanie danych i przygotowywanie kwerend w bazie Stomatolog” (kwerenda z 7 października nadal pasuje).
import base from './12-mail-merge.js';

const fix=s=>typeof s==='string'?s.replace('Dwa pytania powtórkowe z lekcji 11','Dwa pytania powtórkowe z poprzednich lekcji (kwerendy w bazie Stomatolog i Zawody)').replace('Powtórka z lekcji 11:','Powtórka z poprzedniej lekcji:'):s;

const sections=base.sections.map(s=>({...s,teacherNotes:fix(s.teacherNotes),activities:s.activities.map(a=>a.id==='m-crit'?{...a,question:fix(a.question)}:a.id==='m-param'?{...a,question:'Powtórka z kwerend (baza Zawody: [Podaj klasę:]): co robi kwerenda parametryczna?'}:a)}));

export default {...base,id:'27',grade:3,sections};
