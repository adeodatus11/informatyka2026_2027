// Ponowne użycie bez zmiany lekcji bazowej. Powtórka z właściwej ścieżki klasy 1.
import base from './55-compare-count-python.js';
import {choice} from '../schema.js';
const adapt = value => typeof value === 'string' ? value.replace(/klas(?:a|ie|y) 3/g, 'klasie 1').replace(/lekcj[aię] (?:53|54|55|56|57)\b/g, 'poprzedniej lekcji').replace(/tematy 18–20/g,'następne tematy o tekstach') : Array.isArray(value) ? value.map(adapt) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,adapt(v)])) : value;
const lesson=adapt(base);
const start=lesson.sections[0];
const oldIds=start.activities.filter(a=>a.type==='choice').map(a=>a.id);
const recall=choice('93-recall',"Z lekcji 92: Jak sprawdzasz palindrom?",["Porównuję znaki od obu końców","Sprawdzam tylko długość","Szukam cyfr"],[0],"Porównujemy pary znaków od końców, aż do środka.");
start.activities=[recall,...start.activities.filter(a=>a.type!=='choice')];
start.teacherNotes='Powtórka bez notatek z lekcji 92. Po błędzie uczeń czyta wyjaśnienie i poprawia odpowiedź. '+start.teacherNotes;
for(const s of lesson.sections) for(const a of s.activities) if(a.type==='resultCard') a.sources=[...a.sources.filter(x=>!oldIds.includes(x)),recall.id];

lesson.teacherGuide.summary='Karta wyniku obejmuje powtórkę z klasy 1 i zadania wymienione na karcie; bonus pozostaje opcjonalny. '+lesson.objectives.join(' ');
export default {...lesson,id:'93',grade:1,order:55,title:"Programowanie wybranych algorytmów na tekstach"};
