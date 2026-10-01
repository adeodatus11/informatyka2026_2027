import React from 'react';
import {Icon} from './icons.jsx';
import './word-workshop.css';

// Instrukcje dotyczą dokumentu otwartego w Wordzie, nie imitacji edytora w przeglądarce.
export function WordSteps({data}){
 return <section className="word-workshop" aria-labelledby={`${data.id}-title`}>
  <div className="word-workshop-heading"><Icon name="file" size={28}/><div><p>Praca w Wordzie na komputerze</p><h3 id={`${data.id}-title`}>{data.title||'Instrukcja krok po kroku'}</h3></div></div>
  <ol className="word-steps">{data.steps.map((step,i)=><li key={`${data.id}-${i}`}>
   <div className="word-step-heading"><span aria-hidden="true">{i+1}</span><h4>{step.title}</h4></div>
   <p className="word-instruction">{step.instruction}</p>
   {step.check&&<p className="word-check"><Icon name="check" size={18}/><span><b>Sprawdź efekt:</b> {step.check}</span></p>}
   {step.help&&<details className="word-help"><summary>Gdy coś nie działa</summary><p>{step.help}</p></details>}
  </li>)}</ol>
 </section>;
}

export function WordRubric({data,value={},onChange}){
 const ratings=value.ratings||{};
 const complete=data.criteria.every((c,i)=>Number.isInteger(ratings[i])&&ratings[i]>=0&&ratings[i]<=c.points);
 const total=data.criteria.reduce((sum,c,i)=>sum+(Number.isInteger(ratings[i])?Math.max(0,Math.min(c.points,ratings[i])):0),0);
 const max=data.criteria.reduce((sum,c)=>sum+c.points,0);
 function update(i,n){const next={...ratings};if(n==='')delete next[i];else next[i]=Number(n);onChange({ratings:next,done:data.criteria.every((c,j)=>Number.isInteger(next[j])&&next[j]>=0&&next[j]<=c.points)});}
 return <section className="word-rubric activity" aria-labelledby={`${data.id}-title`}>
  <p className="word-rubric-kicker">Dokument do obejrzenia w Wordzie</p>
  <h3 id={`${data.id}-title`}>{data.title||'Kryteria pracy praktycznej'}</h3>
  <p>Otwórz swój plik i sprawdź każde kryterium. To Twoja samoocena. Strona nie odczytuje dokumentu i nie potwierdza, że wykonano czynności w Wordzie. Ocenę pracy ustala nauczyciel po obejrzeniu pliku.</p>
  {data.filename&&<p className="word-filename">Zapisz pracę jako <strong>{data.filename}</strong></p>}
  <div className="word-criteria">{data.criteria.map((c,i)=><div className="word-criterion" key={`${data.id}-${i}`}>
   <div><label htmlFor={`${data.id}-criterion-${i}`}>{c.label}<span>0–{c.points} pkt</span></label><p id={`${data.id}-description-${i}`}>{c.description}</p></div>
   <select id={`${data.id}-criterion-${i}`} aria-describedby={`${data.id}-description-${i}`} value={ratings[i]??''} onChange={e=>update(i,e.target.value)}><option value="">Oceń swój plik</option>{Array.from({length:c.points+1},(_,n)=><option key={n} value={n}>{n} pkt</option>)}</select>
  </div>)}</div>
  <p className="word-rubric-total" role="status">{complete?`Twoja samoocena: ${total}/${max} pkt. Pokaż dokument nauczycielowi.`:`Sprawdzone kryteria: ${data.criteria.filter((_,i)=>Number.isInteger(ratings[i])).length}/${data.criteria.length}. Maksymalnie ${max} pkt za dokument.`}</p>
  <p className="small muted">Punkty z tej listy nie są doliczane do quizu. Zaznaczenia znikną po odświeżeniu strony; plik zapisany na komputerze pozostanie.</p>
 </section>;
}

export function WordWorkspaceNotice(){return <aside className="word-workspace-notice"><Icon name="desktop" size={27}/><div><strong>Przeglądarka obok Worda</strong><p>Pobierz dokument startowy, zapisz własną kopię i otwórz ją w zainstalowanym Wordzie. Przełączaj okna skrótem Alt+Tab lub ustaw je obok siebie. Instrukcje opisują Worda dla Windows; nazwy poleceń mogą się nieznacznie różnić między wersjami. Zapisuj pracę Ctrl+S. Strona nie przesyła pliku nauczycielowi.</p></div></aside>;}
