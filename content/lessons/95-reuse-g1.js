// Ponowne użycie bez zmiany lekcji bazowej. Powtórka z właściwej ścieżki klasy 1.
import base from './56-pattern-search-python.js';
import {choice} from '../schema.js';
const adapt = value => typeof value === 'string' ? value.replace(/klas(?:a|ie|y) 3/g, 'klasie 1').replace(/lekcj[aię] (?:53|54|55|56|57)\b/g, 'poprzedniej lekcji').replace(/tematy 18–20/g,'następne tematy o tekstach') : Array.isArray(value) ? value.map(adapt) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,adapt(v)])) : value;
const lesson=adapt(base);
const start=lesson.sections[0];
const oldIds=start.activities.filter(a=>a.type==='choice').map(a=>a.id);
const recall=choice('95-recall',"Z lekcji 94: Ile okien dla tekstu 4-znakowego i wzorca 2-znakowego?",["2","4","3"],[2],"4 − 2 + 1 = 3. Przesuwamy wzorzec o jedną pozycję.");
start.activities=[recall,...start.activities.filter(a=>a.type!=='choice')];
start.teacherNotes='Powtórka bez notatek z lekcji 94. Po błędzie uczeń czyta wyjaśnienie i poprawia odpowiedź. '+start.teacherNotes;
for(const s of lesson.sections) for(const a of s.activities) if(a.type==='resultCard') a.sources=[...a.sources.filter(x=>!oldIds.includes(x)),recall.id];

lesson.teacherGuide.summary='Karta wyniku obejmuje powtórkę z klasy 1 i zadania wymienione na karcie; bonus pozostaje opcjonalny. '+lesson.objectives.join(' ');
export default {...lesson,id:'95',grade:1,order:57,title:"Programowanie algorytmu wyszukiwania wzorca w tekście metodą naiwną"};
