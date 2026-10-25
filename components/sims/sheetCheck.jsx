import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {answerTask,revealTask,setTask,sheetResult,answerText,REVEAL_AFTER} from '../../content/sims/sheetCheck.js';
import './sheetCheck.css';

const fmt=n=>String(Math.round(n*10)/10).replace('.',',');

// Fragment arkusza tylko do odczytu: nagłówki kolumn, numery wierszy, pasek formuły.
function Grid({grid,id}){
 const first=grid.firstRow??1;
 return <figure className="sc-sheet">
  {grid.active&&<div className="sc-fx" aria-label="Pasek formuły"><span className="sc-name">{grid.active}</span><span className="sc-fx-label" aria-hidden="true">fx</span><code>{grid.formula??''}</code></div>}
  <div className="sc-grid-wrap" tabIndex={0} role="region" aria-label={grid.caption||'Fragment arkusza'}>
   <table className="sc-grid">
    <caption className="sr-only">{grid.caption||'Fragment arkusza'}{grid.active?`. Zaznaczona komórka ${grid.active}${grid.formula?`, formuła ${grid.formula}`:''}.`:''}</caption>
    <thead><tr><td className="sc-corner" aria-hidden="true"/>{grid.cols.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead>
    <tbody>{grid.rows.map((row,r)=><tr key={`${id}-r${r}`}><th scope="row">{first+r}</th>{grid.cols.map((c,ci)=>{const ref=`${c}${first+r}`;const v=row[ci];const active=grid.active===ref;const mark=grid.marks?.[ref];return <td key={ref} className={`${active?'is-active':''} ${mark?'is-mark':''} ${typeof v==='number'?'is-num':''}`}>{mark??(typeof v==='number'?String(v).replace('.',','):v)}{active&&<span className="sr-only"> (zaznaczona)</span>}</td>;})}</tr>)}</tbody>
   </table>
  </div>
  {grid.note&&<figcaption className="small muted">{grid.note}</figcaption>}
 </figure>;
}

// Prosty wykres kolumnowy (SVG) do porównania osi — nie edytor wykresów.
function Bars({chart}){
 const W=300,H=190,L=46,B=30,T=26;const min=chart.min??0;const max=chart.max??Math.max(...chart.values);
 const y=v=>T+(H-T-B)*(1-(v-min)/(max-min));const bw=(W-L-10)/chart.values.length;
 const ticks=[min,min+(max-min)/2,max];
 const desc=`${chart.title}. Oś pionowa od ${chart.min??0} do ${max}. `+chart.labels.map((l,i)=>`${l}: ${chart.values[i]}`).join(', ');
 return <figure className="sc-chart"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={desc}>
  <text x={L} y={14} className="sc-chart-title">{chart.title}</text>
  {ticks.map(t=><g key={t}><line x1={L} x2={W-6} y1={y(t)} y2={y(t)} className="sc-tick"/><text x={L-6} y={y(t)+4} textAnchor="end" className="sc-axis">{Math.round(t)}</text></g>)}
  {chart.values.map((v,i)=><g key={chart.labels[i]}><rect x={L+i*bw+bw*0.18} width={bw*0.64} y={y(v)} height={Math.max(0,y(min)-y(v))} className={`sc-bar sc-bar-${i}`}/><text x={L+i*bw+bw/2} y={y(v)-5} textAnchor="middle" className="sc-val">{v}</text><text x={L+i*bw+bw/2} y={H-10} textAnchor="middle" className="sc-axis">{chart.labels[i]}</text></g>)}
 </svg>{chart.caption&&<figcaption className="small muted">{chart.caption}</figcaption>}</figure>;
}

function Task({task,index,st={},onAnswer,onReveal}){
 const [draft,setDraft]=useState(st.input??'');
 const closed=st.solved||st.revealed;const inputId=`sc-${task.id}`;
 const formula=task.kind==='formula';
 return <li className={`sc-task ${st.solved?'is-solved':st.revealed?'is-revealed':''}`}>
  <div className="sc-task-head"><span className="sc-num" aria-hidden="true">{st.solved?<Icon name="check" size={16}/>:index+1}</span>
   <div className="sc-task-text"><label htmlFor={inputId}>{task.prompt}</label>{task.cell&&<span className="sc-cell">komórka {task.cell}</span>}</div></div>
  {task.grid&&<Grid grid={task.grid} id={task.id}/>}
  {task.charts&&<div className="sc-charts">{task.charts.map(c=><Bars key={c.title} chart={c}/>)}</div>}
  <form className="sc-answer" onSubmit={e=>{e.preventDefault();onAnswer(draft);}}>
   <input id={inputId} type="text" autoComplete="off" spellCheck={false} inputMode={task.kind==='number'||!task.kind?'decimal':'text'} className={formula?'sc-mono':''} value={draft} disabled={closed} placeholder={task.placeholder||(formula?'=…':task.kind==='text'?'odpowiedź':'liczba, np. 12,5')} onChange={e=>setDraft(e.target.value)} aria-describedby={`${inputId}-fb`}/>
   {task.unit&&<span className="sc-unit">{task.unit}</span>}
   <button className="btn" type="submit" disabled={closed}>Sprawdź</button>
  </form>
  <div id={`${inputId}-fb`} role="status" className="sc-fb-slot">
   {st.solved&&<p className="sc-msg is-ok"><Icon name="check" size={18}/><span><b>{st.first?'Dobrze za pierwszym razem (+1 pkt).':'Poprawione (+0,5 pkt).'}</b> {st.last?.message} {task.explain}</span></p>}
   {st.revealed&&<p className="sc-msg is-reveal"><Icon name="book" size={18}/><span><b>Rozwiązanie: {answerText(task)}.</b> {task.explain} Popraw to w swoim pliku — za to zadanie 0 pkt, ale możesz iść dalej.</span></p>}
   {!closed&&st.last&&<p className={`sc-msg ${st.last.kind==='invalid'?'is-info':'is-retry'}`}><Icon name={st.last.kind==='trap'?'warning':'book'} size={18}/><span>{st.last.kind==='trap'||st.last.kind==='wrong'?<b>Jeszcze nie. </b>:null}{st.last.message}{st.last.kind!=='invalid'&&task.hint?<> <b>Sprawdź:</b> {task.hint}</>:null}</span></p>}
  </div>
  {!closed&&(st.tries||0)>=REVEAL_AFTER&&<button type="button" className="text-button sc-reveal" onClick={onReveal}>Pokaż rozwiązanie (0 pkt za to zadanie)</button>}
 </li>;
}

export default function SheetCheck({data,value,onChange}){
 const v=value||{};const res=sheetResult(data,v);const tasks=v.tasks||{};
 const predict=data.phase==='predict';
 const save=(task,next)=>onChange(setTask(data,v,task.id,next));
 return <section className="sc activity" aria-labelledby={`${data.id}-title`}>
  <div className="sc-bar"><Icon name="table" size={20}/><span className="sc-app">{predict?'Zanim otworzysz Excela':'Kontrola wyniku z Excela'}</span>{data.file&&<span className="sc-file">{data.file}{data.sheet?` · arkusz ${data.sheet}`:''}</span>}<span className="sc-score">Punkty: {fmt(res.score)}/{res.max}</span></div>
  <div className="sc-body">
   <h3 id={`${data.id}-title`}>{data.title}</h3>
   {data.intro&&<p className="sc-intro">{data.intro}</p>}
   {!predict&&<p className="sc-how small"><Icon name="search" size={16}/> Wykonaj zadanie w swoim pliku, odczytaj wartość z komórki i wpisz ją tutaj. Strona nie otwiera Twojego pliku — porównuje tylko wpisany wynik.</p>}
   {data.grid&&<Grid grid={data.grid} id={data.id}/>}
   <ol className="sc-tasks">{data.tasks.map((t,i)=><Task key={t.id} task={t} index={i} st={tasks[t.id]} onAnswer={raw=>save(t,answerTask(tasks[t.id],t,raw))} onReveal={()=>save(t,revealTask(tasks[t.id]))}/>)}</ol>
   <p className="sc-progress small">{res.done?`Gotowe: ${data.tasks.filter(t=>tasks[t.id]?.solved).length} z ${res.max} poprawnie, ${fmt(res.score)} pkt.`:`Sprawdzone: ${data.tasks.filter(t=>tasks[t.id]?.solved||tasks[t.id]?.revealed).length}/${res.max}. Pełny punkt za pierwszą próbę, pół — po poprawce.`}</p>
  </div>
 </section>;
}
