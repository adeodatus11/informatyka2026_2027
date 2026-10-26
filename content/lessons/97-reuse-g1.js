// Ponowne użycie bez zmiany lekcji bazowej. Powtórka z właściwej ścieżki klasy 1.
import base from './13-hexadecimal.js';
import {choice} from '../schema.js';
const adapt = value => typeof value === 'string' ? value.replace(/klas(?:a|ie|y) 3/g, 'klasie 1').replace(/lekcj[aię] (?:53|54|55|56|57)\b/g, 'poprzedniej lekcji').replace(/tematy 18–20/g,'następne tematy o tekstach') : Array.isArray(value) ? value.map(adapt) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,adapt(v)])) : value;
const lesson=adapt(base);
const start=lesson.sections[0];
const oldIds=start.activities.filter(a=>a.type==='choice').map(a=>a.id);
const recall=choice('97-recall',"Z lekcji 96: Ile dziesiętnie wynosi 1010 w systemie dwójkowym?",["10","5","1010"],[0],"8 + 2 = 10. Jedna cyfra hex zastępuje cztery bity.");
start.activities=[recall,...start.activities.filter(a=>a.type!=='choice')];
start.teacherNotes='Powtórka bez notatek z lekcji 96. Po błędzie uczeń czyta wyjaśnienie i poprawia odpowiedź. '+start.teacherNotes;
for(const s of lesson.sections) for(const a of s.activities) if(a.type==='resultCard') a.sources=[...a.sources.filter(x=>!oldIds.includes(x)),recall.id];
lesson.sections[1].duration += 3; lesson.duration=45; lesson.sections[2].grouping='solo'; lesson.sections[2].intro='Otwórz cztery kłódki z kodami hex. Możesz porównać tok rozumowania z sąsiadem; zadanie wykonasz także sam.';
lesson.curriculum='PP 2024, liceum/technikum: I.2.a, I.3 — zapis szesnastkowy, grupowanie bitów i sprawdzanie reprezentacji tej samej wartości.';
start.teacherNotes='Powtórka bez notatek z 96: 1010 to 10. Potem pokaż kolory FF0000 i 00FF00 oraz wyjaśnij, że jedna cyfra hex zastępuje cztery bity. Omów jedną błędną odpowiedź, zanim otworzysz konwerter.';
lesson.teacherGuide.summary='Karta wyniku obejmuje powtórkę z klasy 1 i zadania wymienione na karcie; bonus pozostaje opcjonalny. '+lesson.objectives.join(' ');
export default {...lesson,id:'97',grade:1,order:59,title:"System szesnastkowy"};
