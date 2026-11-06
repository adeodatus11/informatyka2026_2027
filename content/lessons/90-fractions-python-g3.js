// Klasa 3: implementacja po koncepcyjnej lekcji 89.
import base from './50-fractions-python.js';
import {choice} from '../schema.js';
const sections=base.sections.map(s=>({...s,activities:s.activities.map(a=>({...a}))}));
const old=sections[0].activities.map(a=>a.id);
sections[0]={...sections[0],intro:'Na poprzedniej lekcji liczyłeś porcje przez NWD i NWW. Teraz zrobisz kalkulator, który sprawdzi także ujemny znak i mianownik zero.',activities:[choice('g3-90-r1','Z lekcji 89: przez co skrócisz18/24 od razu do końca?',['Przez NWD(18,24)=6','Przez sumę18+24','Tylko mianownik przez 2'],[0],'Dzielisz obie liczby przez 6:3/4.'),choice('g3-90-r2','Jak dodasz1/2+1/3?',['2/5','5/6','1/6'],[1],'NWW mianowników to 6.3/6+2/6=5/6.')],teacherNotes:'Powtórka bez notatek z 89. Po odpowiedzi uczeń czyta wyjaśnienie i poprawia. Przy błędzie2/5 wróć na chwilę do pasków ułamków.'};
for(const s of sections)for(const a of s.activities)if(a.type==='resultCard')a.sources=[...a.sources.filter(id=>!old.includes(id)),'g3-90-r1','g3-90-r2'];
export default {...base,id:'90',grade:3,order:27,title:'Skracanie i działania arytmetyczne na ułamkach',sections,teacherGuide:{...base.teacherGuide,summary:'Uczeń implementuje skracanie i działania na ułamkach; testy obejmują zero, znak i mianownik 0. Wersja klasy 3, po89. '+base.teacherGuide.summary.replace(/Na następnej lekcji[^.]*\./g,'')},exitTicket:'Który przypadek testowy ujawnia błąd, gdy skrócisz tylko licznik? Pokaż test mianownika zero.'};
