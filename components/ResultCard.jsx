import React from 'react';
import {Icon} from './icons.jsx';
import {lessonScore} from '../content/scoring.js';
const levels=[['yes','Umiem'],['almost','Prawie'],['no','Jeszcze nie']];
export function ResultCard({data,value={},onChange,answers={},lesson}){
 const r=lessonScore(lesson,data,answers);const self=value.self||{};const items=data.selfCheck||lesson.objectives;
 return <section className="result-card activity" aria-labelledby={`${data.id}-title`}>
  <div className="result-top"><div><p className="eyebrow">Karta wyniku · {lesson.title}</p><h3 id={`${data.id}-title`}>{data.title||'Twój wynik'}</h3></div><div className="result-score" aria-label={`Wynik ${r.score} na ${r.max} punktów`}><strong>{String(r.score).replace('.',',')}</strong><span>/ {r.max} pkt</span></div></div>
  <div className="result-meter" aria-hidden="true"><span style={{width:`${Math.round(r.ratio*100)}%`}}/></div>
  {r.badge&&<div className="result-badge"><Icon name="complete" size={34}/><div><strong>{r.badge.name}</strong>{r.badge.text&&<p>{r.badge.text}</p>}</div></div>}
  {r.rows.some(x=>x.summary)&&<ul className="result-products">{r.rows.filter(x=>x.summary).map(x=><li key={x.id}>{x.summary}</li>)}</ul>}
  <details className="result-rows"><summary>Skąd te punkty?</summary><ul>{r.rows.map(x=><li key={x.id}><span>{x.label}</span><b>{String(x.score).replace('.',',')}/{x.max}</b></li>)}</ul><p className="small muted">Pytania wyboru: pełny punkt za trafienie za pierwszym razem, połowa za poprawkę.</p></details>
  <fieldset className="self-check"><legend>Samoocena: jak Ci poszło?</legend>{items.map((o,i)=><div key={o} className="self-row"><span>{o}</span><div role="group" aria-label={o}>{levels.map(([k,l])=><button key={k} className={`self-${k} ${self[i]===k?'selected':''}`} aria-pressed={self[i]===k} onClick={()=>onChange({...value,self:{...self,[i]:k}})}>{l}</button>)}</div></div>)}</fieldset>
  <label className="result-name">Podpis do zdjęcia karty (imię i pierwsza litera nazwiska, opcjonalnie)<input maxLength={40} autoComplete="off" value={value.name||''} onChange={e=>onChange({...value,name:e.target.value})}/></label>
  <footer className="result-teacher">{data.hideGrade?<span><Icon name="school" size={18}/>Wynik sprawdzenia wiedzy. Dokument ocenia osobno nauczyciel.</span>:<span><Icon name="school" size={18}/>Dla nauczyciela: proponowana ocena <b>{r.grade}</b></span>}<span>{value.name&&<b>{value.name} · </b>}{new Date().toLocaleDateString('pl-PL')}</span></footer>
  <p className="small muted">{data.note||'Pokaż kartę nauczycielowi albo zrób jej zdjęcie. Wynik nie jest nigdzie wysyłany i zniknie po odświeżeniu strony.'}</p>
 </section>;
}
