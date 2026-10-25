import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {cases,verdicts,chooseVerdict,chooseLaw,chooseReason,verdictFeedback,caseScore,caseSolved,courtResult} from '../../content/sims/lawCourt.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './lawCourt.css';

const fmt=n=>String(n).replace('.',',');
const pts=p=>p.tries===1?'+1 pkt':'+0,5 pkt';

function Options({c,kind,items,state,onPick,disabled}){
 return <div className="choices">{orderOptions(optionKey('lawCourt',`${c.id}:${kind}`,items.map(x=>x.text)),items).map(([i,o],pos)=>
  <button key={o.text} data-option={i} className={`choice ${state?.choice===i?'selected':''}`} aria-pressed={state?.choice===i} disabled={disabled||(state?.ok&&state.choice!==i)} onClick={()=>onPick(i)}>
   <span className="choice-letter">{String.fromCharCode(65+pos)}</span><span>{o.text}</span></button>)}</div>;
}

export default function LawCourt({data,value={},onChange}){
 const all=value.cases||{};
 const firstOpen=cases.findIndex(c=>!caseSolved(all[c.id]));
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const c=cases[idx],st=all[c.id]||{};
 const res=courtResult(value);
 function save(next){const cs={...all,[c.id]:next};onChange({...value,cases:cs,...courtResult({cases:cs})});}
 const nextOpen=cases.findIndex((k,i)=>i>idx&&!caseSolved(all[k.id]));
 return <div className="lc-sim">
  <div className="lc-top"><div><span className="lc-tag">Sąd klasowy</span><small>symulacja: fikcyjne osoby, prawdziwe przepisy opisane po ludzku</small></div>
   <div className="lc-counters" aria-live="polite"><span>Punkty: <b>{fmt(res.score)}</b>/{res.max}</span><span>Sprawy: <b>{res.solved}</b>/{cases.length}</span></div></div>
  <nav className="lc-tabs" aria-label="Sprawy w sądzie klasowym">{cases.map((k,i)=>{const s=all[k.id];return <button key={k.id} className={`${i===idx?'current':''} ${caseSolved(s)?'solved':''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)}>
   <span className="lc-num">{caseSolved(s)?<Icon name="check" size={16}/>:i+1}</span><span>{k.title}</span>{caseSolved(s)&&<span className="sr-only"> (rozstrzygnięta, {fmt(caseScore(s))} pkt)</span>}</button>;})}</nav>
  <div className="lc-case">
   <article className="lc-file" aria-labelledby="lc-file-title">
    <p className="lc-file-head"><Icon name={c.icon} size={22}/><span>Akta sprawy nr {idx+1}/{cases.length}</span></p>
    <h3 id="lc-file-title">{c.title}</h3>
    <p className="lc-story">{c.story}</p>
   </article>
   <aside className="lc-roles" aria-label="Pytania przed werdyktem">
    <p className="lc-label"><Icon name="group" size={20}/> Zanim wydacie werdykt</p>
    <ul><li><b>Pytanie oskarżenia</b><small>{c.prosecutor}</small></li><li><b>Pytanie obrony</b><small>{c.defense}</small></li></ul>
    <p className="small muted">W parze: jedna osoba zadaje pytanie oskarżenia, druga obrony; przy następnej sprawie zamiana. Pracujesz sam? Odpowiedz sobie na oba pytania, zanim klikniesz.</p>
   </aside>
  </div>
  <fieldset className="lc-step">
   <legend>1. Werdykt</legend>
   <div className="lc-verdicts">{verdicts.map(v=><button key={v.id} className={`lc-v lc-v-${v.id} ${st.verdict?.choice===v.id?'picked':''}`} aria-pressed={st.verdict?.choice===v.id} disabled={st.verdict?.ok&&st.verdict.choice!==v.id} onClick={()=>save(chooseVerdict(c,st,v.id))}><b>{v.label}</b><small>{v.short}</small></button>)}</div>
   {st.verdict&&<div className={`lc-feedback ${st.verdict.ok?'ok':'retry'}`} role="status"><Icon name={st.verdict.ok?'check':'warning'} size={20}/><p>{st.verdict.ok?`${pts(st.verdict)}. `:'Sąd odrzuca ten werdykt. '}{verdictFeedback(c,st.verdict.choice)}</p></div>}
  </fieldset>
  {st.verdict?.ok&&<fieldset className="lc-step">
   <legend>2. Który przepis tu działa?</legend>
   <Options c={c} kind="law" items={c.laws} state={st.law} onPick={i=>save(chooseLaw(c,st,i))}/>
   {st.law&&<div className={`lc-feedback ${st.law.ok?'ok':'retry'}`} role="status"><Icon name={st.law.ok?'check':'warning'} size={20}/><p>{st.law.ok?`${pts(st.law)}. Dobry przepis. Teraz uzasadnienie wyroku.`:`Nie ten przepis. ${c.laws[st.law.choice].why}`}</p></div>}
  </fieldset>}
  {st.law?.ok&&<fieldset className="lc-step">
   <legend>3. Uzasadnienie wyroku</legend>
   <Options c={c} kind="reason" items={c.reasons} state={st.reason} onPick={i=>save(chooseReason(c,st,i))}/>
   {st.reason&&<div className={`lc-feedback ${st.reason.ok?'ok':'retry'}`} role="status"><Icon name={st.reason.ok?'check':'warning'} size={20}/><p>{st.reason.ok?`${pts(st.reason)}. ${c.explain}`:`Słabe uzasadnienie. ${c.reasons[st.reason.choice].why}`}</p></div>}
  </fieldset>}
  {caseSolved(st)&&<div className="lc-action"><Icon name="shield" size={26}/><div><b>Co zrobić w prawdziwym życiu?</b><p>{c.action}</p></div></div>}
  {caseSolved(st)&&<div className="inline-actions">{firstOpen>=0?<button className="btn" onClick={()=>setIdx(nextOpen>=0?nextOpen:firstOpen)}>Następna sprawa <Icon name="right" size={18}/></button>:<p className="lc-done" role="status"><Icon name="trophy" size={22}/>Wszystkie sprawy rozstrzygnięte. {res.summary}.</p>}</div>}
  <p className="muted small">Minimum: 5 spraw. Każdy krok (werdykt, przepis, uzasadnienie): 1 pkt za pierwszą próbę, 0,5 pkt po poprawce.</p>
 </div>;
}
