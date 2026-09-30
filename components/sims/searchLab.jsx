import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {search,docs,PAGE_SIZE,formatDate,missionsForLevels,missionComplete,missionScore,missionPoints,levelResult,completedCount,isTarget,missionTrap,demoExamples} from '../../content/sims/searchLab.js';
import './searchLab.css';
import {orderOptions,optionKey} from './optionOrder.js';

const fmt=n=>String(n).replace('.',',');
const typeLabel={pdf:'PDF',docx:'DOCX',xlsx:'XLSX'};
export const cheatSheet=[
 ['"dokładna fraza"','Tylko strony z dokładnie tym zdaniem, w tej kolejności.','"praca sezonowa"'],
 ['-słowo','Wyklucza strony z tym słowem.','słuchawki -sklep -cena'],
 ['site:','Szuka tylko na jednej stronie lub w domenie.','site:gov.pl · site:zs-przyklad.edu.pl'],
 ['filetype:','Tylko pliki danego typu.','filetype:pdf'],
 ['OR','Jedno albo drugie (wielkimi literami!).','"praca wakacyjna" OR "praca sezonowa"'],
 ['intitle:','Słowo musi być w tytule strony.','intitle:regulamin'],
 ['after: / before:','Strony nowsze / starsze niż data.','after:2026-09-01']
];

export function CheatSheet(){return <details className="sl-cheat"><summary><Icon name="list" size={20}/>Ściąga operatorów</summary><table><thead><tr><th scope="col">Operator</th><th scope="col">Co robi</th><th scope="col">Przykład</th></tr></thead><tbody>{cheatSheet.map(([o,t,e])=><tr key={o}><th scope="row"><code>{o}</code></th><td>{t}</td><td><code>{e}</code></td></tr>)}</tbody></table><p className="small"><b>Nie działają już:</b> <code>+słowo</code> (od 2011 r. — zamiast tego użyj cudzysłowu), <code>~słowo</code> (od 2013 r.), <code>cache:</code> (od 2024 r.).</p></details>;}

function Chrome({children,query}){return <div className="sl-window"><div className="sl-bar"><span className="sl-dots" aria-hidden="true"><i/><i/><i/></span><span className="sl-url">szukajka.example/?q={query?encodeURIComponent(query).slice(0,40):''}</span><span className="sl-badge">symulacja — fikcyjne strony</span></div><div className="sl-body">{children}</div></div>;}

function Results({result,onOpen,clicked=[]}){
 if(!result)return null;
 return <div className="sl-results">
  {result.warnings.map(w=><p className="sl-warning" key={w}><Icon name="warning" size={18}/>{w}</p>)}
  {result.ai&&<aside className="sl-ai" aria-label="Odpowiedź AI"><p className="sl-ai-head"><Icon name="cpu" size={18}/>Odpowiedź AI <span>(symulacja)</span></p><p>{result.ai.text}</p><p className="small">Źródło: {onOpen?<button className="text-button" onClick={()=>onOpen(result.ai.source)}>{docs.find(d=>d.id===result.ai.source)?.domain}</button>:docs.find(d=>d.id===result.ai.source)?.domain} · AI może się mylić — sprawdź źródło.</p></aside>}
  {result.ads.map(d=><article className="sl-result sl-ad" key={d.id}><p className="sl-meta"><b>Sponsorowane</b> · {d.domain}</p><h4>{onOpen?<button onClick={()=>onOpen(d.id)}>{d.title}</button>:<span>{d.title}</span>}</h4><p className="sl-snippet">{d.snippet}</p></article>)}
  <p className="sl-count" role="status">{result.total?`Pasujące strony: ${result.total}${result.total>PAGE_SIZE?` · pokazano ${PAGE_SIZE} najlepszych`:''}`:'Brak wyników. Spróbuj mniej operatorów albo innych słów.'}</p>
  {result.organic.slice(0,PAGE_SIZE).map(d=><article className={`sl-result ${clicked.includes(d.id)?'visited':''}`} key={d.id}><p className="sl-meta">{typeLabel[d.type]&&<span className="sl-type">{typeLabel[d.type]}</span>}<span className="sl-domain">{d.url.replace(/^https?:\/\//,'')}</span></p><h4>{onOpen?<button onClick={()=>onOpen(d.id)}>{d.title}</button>:<span>{d.title}</span>}</h4><p className="sl-snippet"><span className="sl-date">{formatDate(d.date)} — </span>{d.snippet}</p></article>)}
 </div>;
}

function Preview({doc,onChoose,onBack,chosenFeedback}){
 return <div className="sl-preview" role="region" aria-label={`Podgląd strony ${doc.title}`}>
  <p className="sl-preview-url">{doc.url.startsWith('https')&&<span className="sl-lock" aria-hidden="true"/>}{doc.url}</p>
  <h4>{doc.title}</h4><p className="small muted">Opublikowano: {formatDate(doc.date)}{typeLabel[doc.type]?` · plik ${typeLabel[doc.type]}`:''}{doc.ad?' · reklama':''}</p>
  <p>{doc.text}</p>
  <div className="inline-actions">{onChoose&&<button className="btn" onClick={onChoose}><Icon name="check" size={18}/>To jest to — wybieram</button>}<button className="btn secondary" onClick={onBack}><Icon name="left" size={18}/>Wróć do wyników</button></div>
  {chosenFeedback}
 </div>;
}

function diff(prev,cur){const a=prev.split(/\s+/).filter(Boolean),b=cur.split(/\s+/).filter(Boolean);return {added:b.filter(x=>!a.includes(x)),removed:a.filter(x=>!b.includes(x))};}

function Missions({data,value={},onChange,answers={},lesson}){
 const list=missionsForLevels(data.levels||[1]);const boss=(data.levels||[]).map(String).includes('boss');
 const req=data.requires;const reqAct=req&&lesson?.sections.flatMap(s=>s.activities).find(a=>a.id===req.id);
 const reqCount=req?completedCount(answers[req.id],reqAct?.levels||[1]):0;const locked=req&&reqCount<req.min;
 const ms=value.missions||{};
 const [active,setActive]=useState(()=>list.find(m=>!missionComplete(ms[m.id],m))?.id||list[0].id);
 const m=list.find(x=>x.id===active),st=ms[m.id]||{queries:[],clicks:[]};
 const [text,setText]=useState(st.queries.at(-1)||'');
 const [open,setOpen]=useState(null);const [msg,setMsg]=useState(null);
 const res=levelResult(value,list,{bossMode:boss,label:boss?'Boss':`Poziom ${list[0].level}`});
 const lastQuery=st.queries.at(-1);const result=lastQuery?search(lastQuery):null;
 function save(next){const all={...ms,[m.id]:next};const r=levelResult({missions:all},list,{bossMode:boss,label:boss?'Boss':`Poziom ${list[0].level}`});onChange({...value,missions:all,...r});}
 function submit(e){e.preventDefault();const q=text.trim();if(!q)return;save({...st,queries:[...st.queries,q]});setOpen(null);setMsg(null);}
 function choose(id){const doc=docs.find(d=>d.id===id);const clicks=[...new Set([...(st.clicks||[]),id])];
  if(isTarget(m,id)){if(st.found){setMsg({ok:true,text:'Ta strona jest już zaliczona.'});return;}save({...st,clicks,found:true,foundAfter:st.queries.length});setMsg({ok:true,text:m.check?'Dobre źródło! Teraz sprawdź, co w nim jest — odpowiedz na pytanie poniżej.':`Mam to! Misja zaliczona po ${st.queries.length} ${st.queries.length===1?'zapytaniu':'zapytaniach'}: +${missionPoints(st.queries.length,m.par)} pkt.`});}
  else{save({...st,clicks});setMsg({ok:false,text:`To nie to. ${doc.why||'Ta strona nie odpowiada na polecenie misji — przeczytaj je jeszcze raz.'}`});}}
 function answerCheck(i){if(st.checked)return;if(i===m.check.correct){save({...st,checked:true,checkChoice:i});}else save({...st,checkMistakes:(st.checkMistakes||0)+1,checkChoice:i});}
 if(locked)return <div className="sl-sim"><div className="sl-locked" role="status"><Icon name="shield" size={32}/><div><strong>Poziom zablokowany</strong><p>{req.id==='search-l1'?'Najpierw zalicz 2 misje poziomu 1.':`Najpierw zalicz co najmniej ${req.min} ${req.min===1?'misję':'misje'} poprzedniego poziomu.`} Masz: {reqCount}/{req.min}. Wróć do poprzedniego etapu na pasku u góry.</p></div></div></div>;
 const trap=lastQuery&&missionTrap(m,lastQuery);const done=missionComplete(st,m);
 return <div className="sl-sim">
  <div className="sl-top"><span className="sl-logo" aria-hidden="true">Szukajka</span><span className="sl-score" aria-live="polite">Punkty: <b>{fmt(res.score)}</b>/{res.max} · misje: {res.completed}/{list.length}</span></div>
  {boss&&<p className="sl-pair"><Icon name="group" size={20}/>Para: każdy wybiera inną misję (A lub B). Do zaliczenia wystarczy jedna — druga to bonus +1 pkt. Na koniec wyjaśnij partnerowi swoje zapytanie.</p>}
  <nav className="sl-missions" aria-label="Misje">{list.map(x=>{const s=ms[x.id];const ok=missionComplete(s,x);return <button key={x.id} className={`${x.id===active?'current':''} ${ok?'solved':''}`} aria-current={x.id===active?'step':undefined} onClick={()=>{setActive(x.id);setText((ms[x.id]?.queries||[]).at(-1)||'');setOpen(null);setMsg(null);}}><span className="sl-mnum">{ok?<Icon name="check" size={16}/>:<Icon name="search" size={16}/>}</span><span><b>{x.title}</b><small>{ok?`${missionScore(s,x)} pkt · ${s.foundAfter} zap.`:`par: ${x.par} ${x.par===1?'zapytanie':'zapytania'}`}</small></span></button>;})}</nav>
  <div className="sl-mission"><p className="sl-prompt"><Icon name="book" size={20}/>{m.prompt}</p>
   <details className="sl-hint"><summary>Podpowiedź (bez utraty punktów)</summary><p>{m.hint}</p>{st.queries.length>=3&&!done&&<p>Przykładowe zapytanie: <code>{m.operatorHint}</code></p>}</details>
  </div>
  <Chrome query={lastQuery}>
   <form className="sl-form" onSubmit={submit} role="search"><label htmlFor={`${data.id}-q`} className="sr-only">Zapytanie do wyszukiwarki</label><input id={`${data.id}-q`} type="search" autoComplete="off" spellCheck="false" value={text} onChange={e=>setText(e.target.value)} placeholder="Wpisz zapytanie, np. słuchawki -sklep"/><button className="btn" type="submit"><Icon name="search" size={18}/>Szukaj</button></form>
   <p className="sl-counter">Zapytania w tej misji: <b>{st.queries.length}</b> · par: {m.par} (≤ par = 3 pkt, ≤ par+2 = 2 pkt, więcej = 1 pkt)</p>
   {trap&&<p className="sl-warning"><Icon name="warning" size={18}/>{trap.text}</p>}
   {open?<Preview doc={docs.find(d=>d.id===open)} onBack={()=>{setOpen(null);setMsg(null);}} onChoose={()=>choose(open)} chosenFeedback={msg&&<div className={`sl-feedback ${msg.ok?'ok':'retry'}`} role="status"><Icon name={msg.ok?'check':'warning'} size={20}/><p>{msg.text}</p></div>}/>
    :<Results result={result} clicked={st.clicks||[]} onOpen={id=>{setOpen(id);setMsg(null);}}/>}
   {!lastQuery&&<p className="muted">Wpisz pierwsze zapytanie. Wynik = kliknięcie właściwej strony.</p>}
  </Chrome>
  {st.found&&m.check&&<fieldset className="sl-check"><legend>{m.check.question}</legend><div className="choices">{orderOptions(optionKey('searchLab',`${m.id}:check`,m.check.options),m.check.options).map(([i,o],pos)=><button key={o} data-option={i} className={`choice ${st.checkChoice===i?'selected':''}`} aria-pressed={st.checkChoice===i} disabled={st.checked&&i!==m.check.correct} onClick={()=>answerCheck(i)}><span className="choice-letter">{String.fromCharCode(65+pos)}</span><span>{o}</span></button>)}</div>{st.checkChoice!==undefined&&<div className={`sl-feedback ${st.checked?'ok':'retry'}`} role="status"><Icon name={st.checked?'check':'warning'} size={20}/><p>{st.checked?`${m.check.explanation} Misja zaliczona: +${missionScore(st,m)} pkt.`:'Nie — sprawdź dokładnie tekst źródła, nie odpowiedź AI ani forum. (−1 pkt, min. 1)'}</p></div>}</fieldset>}
  {st.queries.length>0&&<section className="sl-history" aria-label="Historia zapytań"><h4>Twoje zapytania — co zmieniałeś?</h4><ol>{st.queries.map((q,i)=>{const d=i?diff(st.queries[i-1],q):null;return <li key={i}><code>{q}</code>{d&&(d.added.length||d.removed.length)?<small>{d.added.length?`dodano: ${d.added.join(' ')}`:''}{d.added.length&&d.removed.length?' · ':''}{d.removed.length?`usunięto: ${d.removed.join(' ')}`:''}</small>:null}</li>;})}</ol></section>}
  {done&&!open&&<div className="sl-feedback ok" role="status"><Icon name="trophy" size={20}/><p>Misja „{m.title}” zaliczona: {missionScore(st,m)} pkt. {list.some(x=>!missionComplete(ms[x.id],x))?'Wybierz kolejną misję powyżej.':'Wszystkie misje tego poziomu zaliczone!'}</p></div>}
  <CheatSheet/>
 </div>;
}

function Demo({data,value={},onChange}){
 const [ex,setEx]=useState(0);const steps=value.steps||{};const gap=value.gap||{};
 const e=demoExamples[ex];
 function save(next){const seen=demoExamples.every(x=>x.gap?next.gap?.ok:(next.steps?.[x.id]??0)>=x.steps.length-1);const g=next.gap;onChange({...next,done:!!seen,score:g?.ok?(g.tries===1?1:0.5):0,max:1,summary:seen?'Przykłady przeanalizowane, luka uzupełniona':undefined});}
 const step=steps[e.id]??0;
 return <div className="sl-sim">
  <div className="sl-top"><span className="sl-logo" aria-hidden="true">Szukajka</span><span className="sl-score">Przykład {ex+1}/{demoExamples.length} · luka: {gap.ok?fmt(gap.tries===1?1:0.5):0}/1 pkt</span></div>
  <nav className="sl-missions" aria-label="Przykłady rozwiązane">{demoExamples.map((x,i)=><button key={x.id} className={i===ex?'current':''} aria-current={i===ex?'step':undefined} onClick={()=>setEx(i)}><span className="sl-mnum">{i+1}</span><span><b>{x.gap?'Twoja kolej':'Przykład'}</b><small>{x.goal.slice(0,42)}…</small></span></button>)}</nav>
  <p className="sl-prompt"><Icon name="book" size={20}/><span><b>Cel:</b> {e.goal}</span></p>
  {e.steps&&<>
   <ol className="sl-steps">{e.steps.slice(0,step+1).map((s,i)=><li key={i}><Chrome query={s.query}><div className="sl-form"><span className="sl-fake-input">{s.query}</span></div><Results result={search(s.query)}/></Chrome><p className={`sl-comment ${i===e.steps.length-1?'good':'bad'}`}><b>{i===e.steps.length-1?'Poprawione zapytanie:':'Dlaczego słabo?'}</b> {s.comment}</p></li>)}</ol>
   <div className="inline-actions">{step<e.steps.length-1?<button className="btn" onClick={()=>save({...value,steps:{...steps,[e.id]:step+1}})}>Następny krok <Icon name="right" size={18}/></button>:ex<demoExamples.length-1&&<button className="btn" onClick={()=>{save({...value,steps:{...steps,[e.id]:step}});setEx(ex+1);}}>Następny przykład <Icon name="right" size={18}/></button>}</div>
  </>}
  {e.gap&&<fieldset className="sl-check"><legend>Uzupełnij lukę w zapytaniu</legend>
   <p className="sl-gap"><code>{e.gap.before}<span className="sl-blank">{gap.ok?e.gap.options[e.gap.correct]:'____'}</span>{e.gap.after}</code></p>
   <div className="sl-gap-options" role="group" aria-label="Brakujący operator">{orderOptions(optionKey('searchLab',`${e.id}:gap`,e.gap.options),e.gap.options).map(([i,o])=><button key={o} data-option={i} className={`choice ${gap.choice===i?'selected':''}`} aria-pressed={gap.choice===i} disabled={gap.ok&&i!==e.gap.correct} onClick={()=>{if(gap.ok)return;save({...value,gap:{choice:i,tries:(gap.tries||0)+1,ok:i===e.gap.correct}});}}><code>{o}</code></button>)}</div>
   {gap.choice!==undefined&&<div className={`sl-feedback ${gap.ok?'ok':'retry'}`} role="status"><Icon name={gap.ok?'check':'warning'} size={20}/><p>{gap.ok?e.gap.explanation:'Nie ten. Szukasz operatora, który wybiera typ pliku.'}</p></div>}
   {gap.ok&&<Chrome query={e.gap.before+e.gap.options[e.gap.correct]+e.gap.after}><Results result={search(e.gap.before+e.gap.options[e.gap.correct]+e.gap.after)}/></Chrome>}
  </fieldset>}
 </div>;
}

export default function SearchLab(props){return props.data.mode==='demo'?<Demo {...props}/>:<Missions {...props}/>;}
