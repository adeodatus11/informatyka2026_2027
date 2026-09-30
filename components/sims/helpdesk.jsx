import React from 'react';
import {Icon} from '../icons.jsx';
import './helpdesk.css';
import {orderOptions,optionKey} from './optionOrder.js';
import {tickets,MAX_QUESTIONS,questionFeedback,checkSolution,checkReply,ticketResult,helpdeskResult} from '../../content/sims/helpdesk.js';

function Msg({m}){if(!m)return null;return <div className={`hd-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><span>{m.text}</span></div>;}
function Seg({label,options,value,onPick}){return <div className="hd-seg" role="group" aria-label={label}><span>{label}</span>{options.map(([k,l])=><button type="button" key={k} aria-pressed={value===k} onClick={()=>onPick(k)}>{l}</button>)}</div>;}

export default function Helpdesk({value,onChange}){
 const v=value||{};const mode=v.mode||'solo';const role=mode==='pair'?(v.role||'tech'):'tech';const tk=v.tickets||{};
 const cur=Math.min(v.current??0,tickets.length-1);const t=tickets[cur];const st=tk[t.id]||{};const res=helpdeskResult(v);
 function save(next){const r=helpdeskResult(next);onChange({...next,done:r.done,score:r.score,max:r.max,summary:r.summary});}
 function set(patch){save({...v,tickets:{...tk,[t.id]:{...st,...patch}}});}
 const asked=st.asked||[];const hidden=mode==='pair'&&role==='tech'&&!st.partnerAnswered;const revealed=st.askedLocked&&!hidden;
 function toggleQ(i){if(st.askedLocked)return;set({asked:asked.includes(i)?asked.filter(x=>x!==i):asked.length>=MAX_QUESTIONS?asked:[...asked,i]});}
 function lockQ(){if(!asked.length)return;const fb=questionFeedback(t,asked);set({askedLocked:true,partnerAnswered:mode!=='pair'||role!=='tech'?true:st.partnerAnswered,qMsg:{ok:fb.ok,text:fb.message}});}
 function submitSol(){if(st.solved||st.solSelected===undefined)return;const attempts=(st.solAttempts||0)+1;const r=checkSolution(t,st.solSelected);set({solAttempts:attempts,solved:r.ok,solMsg:{ok:r.ok,text:r.message}});}
 function pickReply(i){if(st.replyOk)return;const r=checkReply(t,i);set({replySelected:i,replyOk:r.ok,replyMsg:{ok:r.ok,text:r.message}});}
 const tr=ticketResult(t,st);const closed=tr.closed;
 return <section className="hd" aria-label="System zgłoszeń helpdesku">
  <header className="hd-bar"><Icon name="settings" size={20}/><strong>HelpDesk ZS · zgłoszenia</strong><span className="hd-sim">symulacja</span><span className="hd-stats"><span>Zamknięte {res.closed}/6</span><b>{res.score}/18 pkt</b></span></header>
  <div className="hd-settings">
   <Seg label="Pracuję" options={[['solo','Sam(a)'],['pair','W parze']]} value={mode} onPick={k=>save({...v,mode:k})}/>
   {mode==='pair'&&<Seg label="Jestem" options={[['tech','Technikiem'],['reporter','Zgłaszającym']]} value={role} onPick={k=>save({...v,role:k})}/>}
  </div>
  {mode==='pair'&&<p className="hd-pairnote"><Icon name="group" size={18}/><span>{role==='tech'?'Zadajesz pytania na głos. Partner czyta odpowiedzi ze swojej karty zgłaszającego. Po 3 zgłoszeniach zamieńcie się rolami.':'Odgrywasz osobę zgłaszającą: czytaj opis, odpowiadaj tylko na zadane pytania i nie podpowiadaj. Po rozmowie rozwiąż to zgłoszenie u siebie — punkty liczą się tak samo.'}</span></p>}
  {mode==='pair'&&res.closed===3&&<p className="hd-swap" role="status"><Icon name="reset" size={18}/>3 zgłoszenia za Wami — czas na zamianę ról!</p>}
  <ol className="hd-queue" aria-label="Kolejka zgłoszeń">{tickets.map((x,i)=>{const s=tk[x.id]||{};const r=ticketResult(x,s);return <li key={x.id}><button type="button" aria-current={i===cur?'true':undefined} className={`${i===cur?'is-current':''} ${r.closed?'is-closed':''}`} onClick={()=>save({...v,current:i})}>
   <Icon name={x.icon} size={20}/><span><small>#{x.id} · {x.urgency}</small><b>{x.title}</b><em>{r.closed?`Zamknięte · ${r.score}/3 pkt`:s.askedLocked?'W toku':'Nowe'}</em></span></button></li>;})}</ol>
  <article className="hd-ticket" aria-labelledby={`hd-t-${t.id}`}>
   <header><p className="hd-meta">Zgłoszenie #{t.id} · {t.from} · <b>{t.urgency}</b></p><h3 id={`hd-t-${t.id}`}>{t.title}</h3><blockquote>{t.symptom}</blockquote></header>
   {role==='reporter'&&<section className="hd-card"><h4><Icon name="idcard" size={20}/>Karta zgłaszającego — tylko dla Ciebie</h4><p>{t.reporter}</p><details><summary>Odpowiedzi na możliwe pytania technika</summary><dl>{t.questions.map(q=><div key={q.q}><dt>{q.q}</dt><dd>{q.a}</dd></div>)}</dl></details></section>}
   <section className="hd-step"><h4><span>1</span>Zadaj pytania <small>(maks. {MAX_QUESTIONS})</small></h4>
    {!st.askedLocked?<><div className="hd-questions">{orderOptions(optionKey('helpdesk',`${t.id}:q`,t.questions.map(q=>q.q)),t.questions).map(([i,q])=><button type="button" key={q.q} data-option={i} aria-pressed={asked.includes(i)} disabled={!asked.includes(i)&&asked.length>=MAX_QUESTIONS} onClick={()=>toggleQ(i)}><Icon name={asked.includes(i)?'check':'circle'} size={18}/><span>{q.q}</span></button>)}</div>
     <div className="hd-row"><span className="small muted">Wybrano: {asked.length}/{MAX_QUESTIONS}</span><button type="button" className="btn" disabled={!asked.length} onClick={lockQ}>{mode==='pair'&&role==='tech'?'Zadaję te pytania':'Zadaj pytania'} <Icon name="right" size={18}/></button></div></>:
    <><ul className="hd-answers">{asked.map(i=><li key={i}><b>{t.questions[i].q}</b><span>{revealed?t.questions[i].a:'Czekam na odpowiedź partnera…'}</span></li>)}</ul>
     {hidden&&<button type="button" className="btn secondary" onClick={()=>set({partnerAnswered:true})}>Partner odpowiedział — pokaż kontrolę <Icon name="check" size={18}/></button>}
     {revealed&&<Msg m={st.qMsg}/>}</>}
   </section>
   <section className={`hd-step ${revealed?'':'is-locked'}`} aria-disabled={!revealed||undefined}><h4><span>2</span>Twoja diagnoza i działanie</h4>
    {revealed?<><div className="hd-options" role="group" aria-label="Rozwiązanie">{orderOptions(optionKey('helpdesk',`${t.id}:sol`,t.solutions.map(x=>x.text)),t.solutions).map(([i,s],pos)=><button type="button" key={s.text} data-option={i} aria-pressed={st.solSelected===i} disabled={st.solved} onClick={()=>set({solSelected:i,solMsg:null})}><span className="hd-letter">{String.fromCharCode(65+pos)}</span><span>{s.text}</span></button>)}</div>
     {!st.solved&&<button type="button" className="btn" disabled={st.solSelected===undefined} onClick={submitSol}>Zatwierdź diagnozę <Icon name="right" size={18}/></button>}
     <Msg m={st.solMsg}/></>:<p className="small muted">Najpierw zadaj pytania{hidden?' i poczekaj na odpowiedzi':''}.</p>}
   </section>
   <section className={`hd-step ${st.solved?'':'is-locked'}`}><h4><span>3</span>Co powiesz zgłaszającemu?</h4>
    {st.solved?<><div className="hd-options" role="group" aria-label="Odpowiedź dla zgłaszającego">{orderOptions(optionKey('helpdesk',`${t.id}:reply`,t.replies.map(x=>x.text)),t.replies).map(([i,r])=><button type="button" key={r.text} data-option={i} aria-pressed={st.replySelected===i} disabled={st.replyOk} onClick={()=>pickReply(i)}><Icon name="mail" size={18}/><span>{r.text}</span></button>)}</div><Msg m={st.replyMsg}/></>:<p className="small muted">Dostępne po trafnej diagnozie.</p>}
   </section>
   {closed&&<div className="hd-closed" role="status"><Icon name="complete" size={28}/><div><b>Zgłoszenie #{t.id} zamknięte · {tr.score}/3 pkt</b><small>Diagnoza: {tr.s}/2 · pytania: {tr.q}/1</small></div>{cur<tickets.length-1&&<button type="button" className="btn" onClick={()=>save({...v,current:cur+1})}>Następne zgłoszenie <Icon name="right" size={18}/></button>}</div>}
   {res.done&&<p className="hd-final" role="status"><Icon name="trophy" size={22}/>Kolejka pusta: 6/6. Tak wygląda dzień pracy w helpdesku — i tak zdobywa się zaufanie zespołu.</p>}
  </article>
 </section>;
}
