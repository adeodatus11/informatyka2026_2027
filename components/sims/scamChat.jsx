import React,{useEffect,useRef,useState} from 'react';
import {Icon} from '../icons.jsx';
import * as S from '../../content/sims/scamChat.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './scamChat.css';

const fmt=n=>String(n).replace('.',',');
const reduced=()=>typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const TYPE_MS=650,STEP_MS=220;

function status(sc,st){
 if(!st)return 'Nowa';
 if(st.done)return 'Przerwana';
 return `W toku: ${st.path.length}/${S.DECISIONS}`;
}

function Bubble({m,sc}){
 if(m.who==='them')return <li className="sch-row them"><span className="sch-ava" aria-hidden="true">{sc.contact.initials}</span><p className="sch-bubble"><span className="sr-only">{sc.contact.name}: </span>{m.text}</p></li>;
 if(m.who==='me')return <li className="sch-row me"><p className="sch-bubble"><span className="sr-only">Ty: </span>{m.text}</p></li>;
 if(m.who==='act')return <li className="sch-row act"><p><Icon name="right" size={16}/><span><b>Twoja decyzja:</b> {m.text}</span></p></li>;
 if(m.who==='sms')return <li className="sch-row note"><div className="sch-sms"><Icon name="phone" size={18}/><p><b>SMS od: {m.from}</b>{m.text}</p></div></li>;
 if(m.who==='call')return <li className="sch-row note"><div className="sch-sms sch-call"><Icon name="phone" size={18}/><p><b>{m.from}</b>{m.text}</p></div></li>;
 if(m.who==='flag')return <li className="sch-row note"><div className={`sch-flag ${m.first?'first':'late'}`}><Icon name="warning" size={20}/><p><b>Czerwona flaga: {m.flag.name}</b> <span className="sch-flag-pts">{m.first?'wykryta od razu, +1 pkt':'wykryta po cofnięciu, +0,5 pkt'}</span><br/>{m.flag.text}</p></div></li>;
 return <li className="sch-row note"><p className="sch-sys"><Icon name="search" size={16}/><span>{m.text}</span></p></li>;
}

function Outcome({sc,st,onUndo,headRef}){
 const node=sc.nodes[st.fail.node],o=node.options[st.fail.opt],e=o.end;
 return <section className="sch-outcome" aria-labelledby="sch-out-h">
  <h4 id="sch-out-h" tabIndex={-1} ref={headRef}><Icon name="warning" size={22}/>Tak by się to skończyło</h4>
  <p className="sch-loss"><span>Strata:</span> <b>{e.loss}</b></p>
  <p>{e.did}</p>
  <p className="sch-missed"><b>Przegapiona flaga:</b> {e.missed}</p>
  <div className="sch-out-actions"><button className="btn" onClick={onUndo}><Icon name="reset" size={18}/>Cofnij do tej decyzji</button>
   <span className="small">Za tę decyzję dostaniesz już najwyżej 0,5 pkt.</span></div>
 </section>;
}

function Summary({sc,st,next,onNext,headRef}){
 const r=S.scenarioScore(sc,st);
 return <section className="sch-summary" aria-labelledby="sch-sum-h">
  <h4 id="sch-sum-h" tabIndex={-1} ref={headRef}><Icon name="shield" size={22}/>Rozmowa przerwana. Oszust nic nie dostał.</h4>
  <p className="sch-sum-score">Punkty: <b>{fmt(r.score)}</b>/{r.max} · czerwone flagi wykryte od razu: <b>{r.flags}</b>/{S.DECISIONS}</p>
  <dl>
   <div><dt>Gdzie było ostatnie miejsce, by przerwać?</dt><dd>{sc.lastChance}</dd></div>
   <div><dt>Jaki przepis mógł złamać oszust?</dt><dd>{sc.law}</dd></div>
   <div><dt>A gdyby się udało?</dt><dd>Najpierw bank, potem dowody i zgłoszenie. Co dokładnie i w jakiej kolejności, ustalisz w etapie „Pomóż Mai”.</dd></div>
  </dl>
  {next&&<button className="btn" onClick={onNext}>Następna rozmowa: {next.title}<Icon name="right" size={18}/></button>}
 </section>;
}

export default function ScamChat({data,value,onChange}){
 const v=value||{},res=S.chatResult(v);
 const active=v.active||S.scenarios[0].id,sc=S.scenarioById(active),st=v.scen?.[active];
 const items=S.transcript(sc,st);
 const [shown,setShown]=useState(()=>({[active]:items.length}));
 const n=Math.min(shown[active]??items.length,items.length);
 const logRef=useRef(null),optRef=useRef(null),outRef=useRef(null),sumRef=useRef(null),focusNext=useRef(null);
 const save=next=>onChange({...next,...S.chatResult(next)});

 // Kolejne wiadomości pojawiają się po krótkim „pisze…” (bez animacji przy prefers-reduced-motion).
 useEffect(()=>{
  if(n>=items.length)return;
  if(reduced()){setShown(s=>({...s,[active]:items.length}));return;}
  const t=setTimeout(()=>setShown(s=>({...s,[active]:Math.min((s[active]??0)+1,items.length)})),items[n].who==='them'?TYPE_MS:STEP_MS);
  return ()=>clearTimeout(t);
 },[active,n,items.length]);
 const typing=n<items.length&&items[n].who==='them';
 const ready=n>=items.length;
 useEffect(()=>{const el=logRef.current;if(el)el.scrollTop=el.scrollHeight;},[n,active,typing,st?.fail]);
 useEffect(()=>{if(!ready||!focusNext.current)return;const f=focusNext.current;focusNext.current=null;
  ({opts:optRef,out:outRef,sum:sumRef})[f]?.current?.focus({preventScroll:false});},[ready,st?.fail,st?.done,st?.path?.length]);

 const open=id=>{const next=S.openScenario(v,id);if(!v.scen?.[id])setShown(s=>({...s,[id]:0}));save(next);};
 const pick=i=>{const ns=S.choose(sc,st,i);focusNext.current=ns.fail?'out':ns.done?'sum':'opts';save({...v,scen:{...v.scen,[active]:ns}});};
 const back=()=>{focusNext.current='opts';const ns=S.undo(st);setShown(s=>({...s,[active]:S.transcript(sc,ns).length}));save({...v,scen:{...v.scen,[active]:ns}});};
 const node=S.currentNode(sc,st),r=node&&st.res[st.node];
 const nextSc=S.scenarios.find(x=>!v.scen?.[x.id]?.done&&x.id!==active);

 return <div className="sch-sim">
  <div className="sch-top"><div><span className="sch-tag">Rozmowa z oszustem</span><small>symulacja: aplikacje, osoby, numery i adresy są fikcyjne</small></div>
   <div className="sch-counters" aria-live="polite"><span>Punkty: <b>{fmt(res.score)}</b>/{res.max}</span><span>Wykryte flagi: <b>{res.flagsFound}</b>/{res.flagsSeen}</span><span>Przerwane: <b>{Math.min(res.finished,S.REQUIRED)}</b>/{S.REQUIRED}{res.finished>S.REQUIRED?' + bonus':''}</span></div></div>
  <p className="sch-help">Przejdź <b>co najmniej 2 rozmowy</b> (trzecia to bonus: liczą się 2 najlepsze). Wybieraj odpowiedzi tak, jak naprawdę byś zrobił. Za bezpieczny wybór od razu dostajesz 1 pkt, po cofnięciu 0,5 pkt.</p>
  <div className="sch-tabs" role="group" aria-label="Wybór rozmowy">{S.scenarios.map((x,i)=>{const xs=v.scen?.[x.id];
   return <button key={x.id} className={`sch-tab ${x.id===active?'on':''} ${xs?.done?'done':''}`} aria-pressed={x.id===active} onClick={()=>save({...v,active:x.id})}>
    <Icon name={xs?.done?'check':x.icon} size={22}/><span><b>{i+1}. {x.title}</b><small>{x.short}{i===2?' · bonus':''} · {status(x,xs)}</small></span></button>;})}</div>

  <div className="sch-layout">
   <div className={`sch-phone sch-theme-${sc.app.theme}`}>
    <div className="sch-appbar"><span className="sch-app"><b>{sc.app.name}</b><span className="sch-badge">symulacja</span></span><small>{sc.app.sub}</small></div>
    <div className="sch-contact"><span className="sch-ava big" aria-hidden="true">{sc.contact.initials}</span><span><b>{sc.contact.name}</b><small>{sc.contact.note}</small></span></div>
    {!st?<div className="sch-start"><p>{sc.setup}</p><button className="btn" onClick={()=>open(sc.id)}><Icon name="mail" size={18}/>Zacznij rozmowę</button></div>:<>
     <ol className="sch-log" ref={logRef} tabIndex={0} role="log" aria-label={`Rozmowa: ${sc.contact.name}`}>
      <li className="sch-row note"><p className="sch-setup">{sc.setup}</p></li>
      {items.slice(0,n).map(m=><Bubble key={m.key} m={m} sc={sc}/>)}
      {typing&&<li className="sch-row them" aria-hidden="true"><span className="sch-ava">{sc.contact.initials}</span><p className="sch-bubble sch-typing"><span/><span/><span/></p></li>}
     </ol>
     <div className="sch-compose">
      {!ready?<p className="sch-wait" role="status">{typing?`${sc.contact.name} pisze…`:'…'}</p>
      :st.fail?<Outcome sc={sc} st={st} onUndo={back} headRef={outRef}/>
      :st.done?<Summary sc={sc} st={st} next={nextSc} onNext={()=>save({...v,active:nextSc.id})} headRef={sumRef}/>
      :<fieldset className="sch-options"><legend tabIndex={-1} ref={optRef}>Decyzja {st.path.length+1}/{S.DECISIONS}: co robisz?</legend>
        {orderOptions(optionKey('scamChat',`${sc.id}:${st.node}`,node.options.map(o=>o.text)),node.options).map(([i,o])=>{const tried=r?.wrong.includes(i);
         return <button key={i} data-option={i} className={`sch-opt ${tried?'tried':''}`} disabled={tried} onClick={()=>pick(i)}>
          <span>{o.text}</span>{tried&&<em>Już wiesz, jak to się kończy</em>}</button>;})}
       </fieldset>}
     </div></>}
   </div>

   <aside className="sch-side" aria-label="Czerwone flagi w tej rozmowie">
    <h4><Icon name="warning" size={20}/>Czerwone flagi: {sc.title}</h4>
    {st?.path.length?<ol className="sch-flags">{st.path.map(p=>{const nd=sc.nodes[p.node],rr=st.res[p.node];
     return <li key={p.node} className={rr.tries===1?'first':'late'}><b>{nd.flag.name}</b><small>{rr.tries===1?'od razu · 1 pkt':'po cofnięciu · 0,5 pkt'}</small></li>;})}</ol>
     :<p className="small muted">Po każdej decyzji pojawi się tu sygnał ostrzegawczy, który oszust próbował ukryć.</p>}
    <p className="small sch-left">Do wykrycia w tej rozmowie: {S.DECISIONS-(st?.path.length||0)}</p>
    {res.done&&<p className="sch-done" role="status"><Icon name="trophy" size={20}/>{res.summary}</p>}
   </aside>
  </div>
 </div>;
}
