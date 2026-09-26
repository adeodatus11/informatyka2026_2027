import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {cases,tools,verdicts,chooseVerdict,chooseEvidence,addTool,verdictFeedback,caseScore,caseSolved,factCheckResult} from '../../content/sims/factCheck.js';
import './factCheck.css';

const fmt=n=>String(n).replace('.',',');

function Frame({c}){
 const f=c.frame;
 if(c.kind==='sms')return <div className="fc-frame fc-sms" aria-label="Wiadomość SMS"><div className="fc-sms-head"><Icon name="phone" size={18}/><b>{f.author}</b><small>{f.time}</small></div><p className="fc-bubble">{f.text}</p></div>;
 if(c.kind==='shop')return <div className="fc-frame fc-browser" aria-label="Strona internetowa"><div className="fc-address"><span className="fc-lock" aria-hidden="true"/><span>{f.url}</span></div><div className="fc-shop"><div className="fc-shoe" aria-hidden="true"><Icon name="trophy" size={46}/></div><div><b>{f.author}</b><p>{f.text}</p><small>{f.stats}</small></div></div></div>;
 return <div className={`fc-frame fc-post ${c.kind==='ad'?'fc-ad':''}`} aria-label={`Post: ${f.app}`}>
  <div className="fc-post-head"><span className="fc-avatar" aria-hidden="true">{f.author[0]}</span><div><b>{f.author}</b><small>{f.handle}{f.time?` · ${f.time}`:''}</small></div><span className="fc-app">{f.app}</span></div>
  <p>{f.text}</p>
  {f.media&&<div className="fc-media"><Icon name="play" size={30}/><span>{f.media}</span></div>}
  {f.stats&&<small className="fc-stats">{f.stats}</small>}
 </div>;
}

export default function FactCheck({data,value={},onChange}){
 const all=value.cases||{};
 const firstOpen=cases.findIndex(c=>!caseSolved(all[c.id]));
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const c=cases[idx],st=all[c.id]||{},used=st.tools||[];
 const res=factCheckResult(value);
 function save(next){const cs={...all,[c.id]:next};onChange({...value,cases:cs,...factCheckResult({cases:cs})});}
 const verdictOk=st.verdict?.ok,evOk=st.evidence?.ok;
 return <div className="fc-sim">
  <div className="fc-top"><div><span className="fc-tag">Śledztwo SIFT</span><small>symulacja — fikcyjne profile, sklepy i adresy</small></div><div className="fc-counters" aria-live="polite"><span>Punkty: <b>{fmt(res.score)}</b>/{res.max}</span><span>Rozwiązane: <b>{res.solved}</b>/6</span></div></div>
  <nav className="fc-tabs" aria-label="Przypadki">{cases.map((k,i)=>{const s=all[k.id];return <button key={k.id} className={`${i===idx?'current':''} ${caseSolved(s)?'solved':''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)}><span className="fc-num">{caseSolved(s)?<Icon name="check" size={16}/>:i+1}</span><span>{k.title}</span>{caseSolved(s)&&<span className="sr-only"> — rozwiązany, {fmt(caseScore(s))} pkt</span>}</button>;})}</nav>
  <div className="fc-case">
   <div className="fc-evidence">
    <p className="fc-label">Przypadek {idx+1}: {c.title}</p>
    <Frame c={c}/>
    <p className="fc-stop"><b>S — Stop.</b> Zanim klikniesz lub udostępnisz: jakie emocje to w Tobie wywołuje? Pośpiech i strach to narzędzia manipulacji.</p>
   </div>
   <div className="fc-tools">
    <p className="fc-label">Narzędzia detektywa <span className="muted">(użyte: {used.length}/4)</span></p>
    <div className="fc-tool-list">{tools.map(t=>{const open=used.includes(t.id);return <div key={t.id} className={`fc-tool ${open?'open':''}`}><button aria-expanded={open} onClick={()=>save(addTool(st,t.id))}><span className="fc-step" aria-hidden="true">{t.step}</span><span><b>{t.label}</b><small>{t.help}</small></span><Icon name={open?'check':'search'} size={18}/></button>{open&&<p>{c.clues[t.id]}</p>}</div>;})}</div>
    {data.pairMode&&!verdictOk&&<div className="fc-pair"><Icon name="group" size={22}/><p><b>Adwokat vs prokurator (30 s + 30 s):</b> jedna osoba broni tezy „to prawda”, druga szuka dziury. Potem wspólnie wybierzcie werdykt. Pracujesz sam? Zrób obie role.</p></div>}
   </div>
  </div>
  <fieldset className="fc-verdict">
   <legend>1. Twój werdykt</legend>
   {!used.length&&<p className="muted small">Najpierw użyj co najmniej jednego narzędzia — detektyw nie zgaduje.</p>}
   <div className="fc-verdict-buttons">{verdicts.map(v=><button key={v.id} className={`fc-v fc-v-${v.id} ${st.verdict?.choice===v.id?'picked':''}`} aria-pressed={st.verdict?.choice===v.id} disabled={!used.length||(verdictOk&&st.verdict.choice!==v.id)} onClick={()=>save(chooseVerdict(c,st,v.id))}><b>{v.label}</b><small>{v.short}</small></button>)}</div>
   {st.verdict&&<div className={`fc-feedback ${verdictOk?'ok':'retry'}`} role="status"><Icon name={verdictOk?'check':'warning'} size={20}/><p>{verdictOk?(st.verdict.tries===1?'Trafny werdykt za pierwszym razem: +1 pkt. ':'Teraz dobrze: +0,5 pkt. '):'Jeszcze nie. '}{verdictFeedback(c,st.verdict.choice)}</p></div>}
  </fieldset>
  {verdictOk&&<fieldset className="fc-verdict">
   <legend>2. Najmocniejszy dowód</legend>
   <div className="choices">{c.evidence.map((e,i)=><button key={e.text} className={`choice ${st.evidence?.choice===i?'selected':''}`} aria-pressed={st.evidence?.choice===i} disabled={evOk&&st.evidence.choice!==i} onClick={()=>save(chooseEvidence(c,st,i))}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{e.text}</span></button>)}</div>
   {st.evidence&&<div className={`fc-feedback ${evOk?'ok':'retry'}`} role="status"><Icon name={evOk?'check':'warning'} size={20}/><p>{evOk?`${st.evidence.tries===1?'Mocny dowód: +1 pkt.':'Dobrze: +0,5 pkt.'} ${c.explain}`:`Słaby dowód. ${c.evidence[st.evidence.choice].why}`}</p></div>}
  </fieldset>}
  {evOk&&<div className="fc-action"><Icon name="shield" size={26}/><div><b>Co zrobić?</b><p>{c.action}</p></div></div>}
  {evOk&&<div className="inline-actions">{firstOpen>=0?<button className="btn" onClick={()=>setIdx(cases.findIndex((k,i)=>i>idx&&!caseSolved(all[k.id]))>=0?cases.findIndex((k,i)=>i>idx&&!caseSolved(all[k.id])):firstOpen)}>Następny przypadek <Icon name="right" size={18}/></button>:<p className="fc-done" role="status"><Icon name="trophy" size={22}/>Wszystkie przypadki rozwiązane! {res.summary}.</p>}</div>}
  <p className="muted small">Minimum: 4 przypadki. Wszystkie 6 = pełna pula punktów. Werdykt i dowód: 1 pkt za pierwszą próbę, 0,5 pkt po poprawce.</p>
 </div>;
}
