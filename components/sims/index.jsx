import {lazy} from 'react';
// Każdy plik components/sims/<typ>.jsx jest symulatorem dla aktywności {type:'<typ>'}.
// Kontrakt: komponent dostaje {data,value,onChange,answers,lesson,base}; wartość zapisuje przez
// onChange({...stan,done,score,max,summary}). done = minimum wykonane, score/max = punkty do karty wyniku,
// summary = krótki opis efektu pracy (np. „Oszczędność: 312 zł/rok”). Logika powinna być w content/sims/<typ>.js.
const loaders=import.meta.glob(['./*.jsx','!./index.jsx']);
export const simComponents=Object.fromEntries(Object.entries(loaders).map(([path,load])=>[path.slice(2,-4),lazy(load)]));
export const simTypes=Object.keys(simComponents);
