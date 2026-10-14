import React,{useEffect,useState} from 'react';
import {Icon} from '../icons.jsx';
import './textLab.css';
import {orderOptions,optionKey} from './optionOrder.js';
import {show,code,attempt,taskPoints,checkAnswer,compareFrames,COMPARE_DEMO,COMPARE_QUESTIONS,CONTACTS,CONTACTS_QUESTION,codeSort,plSort,compareResult,
 DETECTIVE,detectiveFrames,detectiveResult,PATTERN_DEMO,PATTERN_RUNS,PATTERN_QUESTIONS,patternFrames,patternTrace,patternRows,ACTIONS,runStep,runResult,patternResult} from '../../content/sims/textLab.js';

const pts=n=>String(n).replace('.',',');
function Msg({m}){if(!m)return null;return <div className={`tl-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><span>{m.text}</span></div>;}
function Window({title,score,max,children}){
 return <section className="tl" aria-label={title}>
  <header className="tl-bar"><span className="tl-dots" aria-hidden="true"><i/><i/><i/></span><Icon name="search" size={18}/><strong>{title}</strong><span className="tl-sim">symulacja</span>
   <span className="tl-score" aria-label={`Punkty: ${pts(score)} na ${max}`}><Icon name="trophy" size={16}/>{pts(score)}/{max} pkt</span></header>
  <div className="tl-body">{children}</div>
 </section>;
}

/* Taśma: wiersze kratek ze znakami. Znak w kratce + symbol (= ≠ ✓) — kolor nie jest jedynym nośnikiem informacji. */
const MARK_LABEL={eq:'równe',ne:'różne',hit:'trafienie',cur:'porównywany teraz'};
function Tape({rows,label}){
 const n=Math.max(...rows.map(r=>r.cells.length));
 return <div className="tl-tape-scroll"><div className="tl-tape" role="img" aria-label={label||rows.map(r=>`${r.label}: ${r.cells.filter(c=>c.ch!=null).map(c=>show(c.ch)).join(' ')}`).join('; ')} style={{'--n':n}}>
  {rows.map((r,ri)=><div className="tl-row" key={ri}>
   <span className="tl-row-label">{r.label}</span>
   <div className="tl-cells">{r.cells.map((c,i)=>c.ch==null?<span key={i} className="tl-cell is-gap"/>:<span key={i} className={`tl-cell ${c.mark?`is-${c.mark}`:''} ${c.ch===' '?'is-space':''}`} title={MARK_LABEL[c.mark]||undefined}>
    <small className="tl-tag">{c.tag||''}</small><b>{show(c.ch)}</b><small className="tl-idx">{r.numbers||ri===0?c.idx:''}</small>
    <span className="tl-sym" aria-hidden="true">{c.mark==='eq'?'=':c.mark==='ne'?'≠':c.mark==='hit'?'✓':''}</span></span>)}</div>
  </div>)}
 </div></div>;
}
function Legend(){return <p className="tl-legend small"><span className="tl-sw is-cur"/>porównywany teraz <span className="tl-sw is-eq"/>= równe <span className="tl-sw is-ne"/>≠ różne <span className="tl-sw is-hit"/>✓ trafienie</p>;}

/* Odtwarzacz klatek: Dalej / Wstecz / Auto */
function Player({frames,start=0}){
 const [k,setK]=useState(start);const [auto,setAuto]=useState(false);const last=frames.length-1;
 useEffect(()=>{if(!auto)return;if(k>=last){setAuto(false);return;}const t=setTimeout(()=>setK(x=>Math.min(x+1,last)),900);return ()=>clearTimeout(t);},[auto,k,last]);
 const f=frames[Math.min(k,last)];
 return <div className="tl-player">
  <div className="tl-hud">{f.hud.map(([l,v])=><span key={l}>{l}: <b>{v}</b></span>)}<span className="tl-hud-step">krok {k}/{last}</span></div>
  <Tape rows={f.rows}/>
  <p className="tl-say" aria-live="polite">{f.say}</p>
  <div className="tl-controls">
   <button type="button" className="btn secondary tl-small" onClick={()=>{setAuto(false);setK(0);}} disabled={k===0}><Icon name="reset" size={18}/>Od początku</button>
   <button type="button" className="btn secondary tl-small" onClick={()=>{setAuto(false);setK(Math.max(0,k-1));}} disabled={k===0}><Icon name="left" size={18}/>Wstecz</button>
   <button type="button" className="btn tl-small" onClick={()=>{setAuto(false);setK(Math.min(last,k+1));}} disabled={k>=last}>Dalej<Icon name="right" size={18}/></button>
   <button type="button" className="btn secondary tl-small" aria-pressed={auto} onClick={()=>{if(k>=last)setK(0);setAuto(!auto);}}><Icon name="play" size={18}/>{auto?'Pauza':'Auto'}</button>
  </div>
 </div>;
}

/* Pytanie: wybór albo liczba. 2 pkt za pierwszą próbę, 1 pkt po poprawce. */
function Question({q,st={},onAnswer,n}){
 const [draft,setDraft]=useState('');const id=`tl-${q.id}`;
 return <div className={`tl-q ${st.solved?'is-solved':''}`}>
  <p className="tl-q-title" id={`${id}-t`}><span className="tl-num" aria-hidden="true">{st.solved?<Icon name="check" size={16}/>:n}</span><span className="tl-prompt">{q.prompt}</span>{st.solved&&<em>+{pts(taskPoints(st.solvedAt))} pkt</em>}</p>
  {q.options?<div className="choices tl-choices" role="group" aria-labelledby={`${id}-t`}>{orderOptions(optionKey('textLab',q.id,q.options),q.options).map(([i,o],pos)=><button type="button" key={o} data-option={i} className={`choice ${st.pick===i?'selected':''}`} aria-pressed={st.pick===i} disabled={st.solved} onClick={()=>onAnswer(q,i)}><span className="choice-letter">{String.fromCharCode(65+pos)}</span><span>{o}</span></button>)}</div>
   :<form className="tl-q-text" onSubmit={e=>{e.preventDefault();if(draft.trim())onAnswer(q,draft);}}>
    <label htmlFor={id}>{q.inputLabel||'Odpowiedź'}</label>
    <input id={id} inputMode="numeric" autoComplete="off" disabled={st.solved} value={st.solved?st.pick:draft} onChange={e=>setDraft(e.target.value)}/>
    {!st.solved&&<button type="submit" className="btn secondary tl-small" disabled={!draft.trim()}>Sprawdź</button>}
   </form>}
  {st.last&&<Msg m={{ok:st.solved,text:st.solved?`${st.solvedAt===1?'Trafione za pierwszym razem: +2 pkt.':'Poprawione: +1 pkt.'} ${q.explain}`:`Jeszcze nie. ${q.tip}`}}/>}
 </div>;
}
function useAnswers(value,onChange,result){
 const q=value?.q||{};
 const save=next=>onChange({...next,...result(next)});
 const answer=(item,ans)=>{const prev=q[item.id]||{};if(prev.solved)return;const pick=item.options?ans:String(ans).trim();save({...(value||{}),q:{...q,[item.id]:attempt(prev,checkAnswer(item,ans),pick)}});};
 return {q,answer,save};
}

/* ───────── tryb compare: lista kontaktów ───────── */
function Compare({value,onChange}){
 const {q,answer}=useAnswers(value,onChange,compareResult);const res=compareResult(value);
 const fixed=q[CONTACTS_QUESTION.id]?.tries>0;
 return <Window title="Kontakty · porównywanie tekstów" score={res.score} max={res.max}>
  <p><b>Przykład rozwiązany.</b> Telefon musi ustalić, czy „{COMPARE_DEMO[0]}” jest przed „{COMPARE_DEMO[1]}”. Komputer porównuje znaki od lewej, aż trafi na pierwszą różnicę. Wygrywa mniejszy kod znaku. Klikaj „Dalej”.</p>
  <Player frames={compareFrames(...COMPARE_DEMO)}/>
  <Legend/>
  <h4 className="tl-h">Twoja kolej: przewiduj <span className="muted small">— po odpowiedzi zobaczysz porównanie krok po kroku</span></h4>
  {COMPARE_QUESTIONS.map((item,i)=>{const st=q[item.id]||{};return <div className="tl-card" key={item.id}>
   <Question q={item} st={st} onAnswer={answer} n={i+1}/>
   {st.tries>0&&<details className="tl-replay" open={!st.solved}><summary>Krok po kroku: „{item.a}” kontra „{item.b}”</summary><Player frames={compareFrames(item.a,item.b)}/></details>}
  </div>;})}
  <div className="tl-card">
   <div className="tl-lists">
    <div><p className="tl-list-title">Sortowanie po kodach (jak <code>sorted()</code> w Pythonie)</p><ol className="tl-list">{codeSort(CONTACTS).map(c=><li key={c}>{c} <small className="muted">(kod „{c[0]}” = {code(c[0])})</small></li>)}</ol></div>
    {fixed&&<div><p className="tl-list-title">Alfabet polski, bez względu na wielkość liter (jak w telefonie)</p><ol className="tl-list is-ok">{plSort(CONTACTS).map(c=><li key={c}>{c}</li>)}</ol></div>}
   </div>
   <Question q={CONTACTS_QUESTION} st={q[CONTACTS_QUESTION.id]} onAnswer={answer} n={COMPARE_QUESTIONS.length+1}/>
  </div>
  {res.done&&<p className="tl-done" role="status"><Icon name="trophy" size={22}/>Porównywanie rozgryzione: {pts(res.score)}/{res.max} pkt. Zapamiętaj: decyduje pierwsza różnica, a przy zgodnym początku — krótszy tekst.</p>}
 </Window>;
}

/* ───────── tryb detective: zliczanie, palindrom, anagram ───────── */
function Detective({value,onChange}){
 const {q,answer}=useAnswers(value,onChange,detectiveResult);const res=detectiveResult(value);
 let group='';
 return <Window title="Detektyw tekstów · 7 zagadek" score={res.score} max={res.max}>
  <p>Każda zagadka to jeden algorytm. Najpierw przewidź wynik, potem obejrzyj, jak liczy komputer — krok po kroku, z licznikiem porównań.</p>
  <Legend/>
  {DETECTIVE.map((p,i)=>{const st=q[p.id]||{};const frames=detectiveFrames(p);const head=p.group!==group;group=p.group;
   return <React.Fragment key={p.id}>{head&&<h4 className="tl-h">{p.group}</h4>}<div className="tl-card">
    {!st.tries&&<Tape rows={frames[0].rows}/>}
    <Question q={p} st={st} onAnswer={answer} n={i+1}/>
    {st.tries>0&&<Player key={`${p.id}-${st.solved}`} frames={frames}/>}
   </div></React.Fragment>;})}
  {res.done&&<p className="tl-done" role="status"><Icon name="trophy" size={22}/>Wszystkie zagadki rozwiązane: {pts(res.score)}/{res.max} pkt.</p>}
 </Window>;
}

/* ───────── tryb pattern: okno wzorca przesuwane po tekście ───────── */
function Run({run,st={},onAct,locked}){
 const tr=patternTrace(run.text,run.pattern);const k=st.k||0;const step=tr.steps[Math.min(k,tr.steps.length-1)];
 const found=k>0?tr.steps[k-1].found:[];
 const rows=st.done?patternRows(run.text,run.pattern,null,0,{found:tr.found}):patternRows(run.text,run.pattern,step.s,step.j,{found});
 const cmp=k;const score=runResult(run,st);
 if(locked)return <div className="tl-card tl-locked"><p><Icon name="lock" size={18}/> <b>{run.title}</b> — odblokujesz po rundzie 1.</p></div>;
 return <div className={`tl-card ${st.done?'is-solved':''}`}>
  <p className="tl-q-title"><span className="tl-num" aria-hidden="true">{st.done?<Icon name="check" size={16}/>:<Icon name="search" size={16}/>}</span><span className="tl-prompt">{run.title}</span>{st.done&&<em>+{pts(score)} pkt</em>}</p>
  <p className="small">{run.context} Szukasz „<b>{run.pattern}</b>”.</p>
  <div className="tl-hud"><span>Okno: <b>{st.done?'—':step.s}</b></span><span>Porównania: <b>{cmp}</b></span><span>Trafienia: <b>{(st.done?tr.found:found).join(', ')||'—'}</b></span><span>Błędne kroki: <b>{st.errors||0}</b></span></div>
  <Tape rows={rows}/>
  {!st.done&&<>
   <p className="tl-say">Porównujesz znak tekstu „{show(step.ct)}” (pozycja {step.s+step.j}) ze znakiem wzorca „{show(step.cp)}” (pozycja {step.j} we wzorcu). Co robi algorytm?</p>
   <div className="tl-actions" role="group" aria-label="Następny krok algorytmu">{ACTIONS.map(a=><button type="button" key={a.id} className="btn secondary" onClick={()=>onAct(run,a.id)}>{a.id==='next'?'=':a.id==='shift'?'≠':'✓'} {a.label}</button>)}</div>
  </>}
  {st.last&&<Msg m={st.last}/>}
 </div>;
}
function Pattern({value,onChange}){
 const v=value||{};const runs=v.runs||{};const res=patternResult(v);
 const save=next=>onChange({...next,...patternResult(next)});
 const {q,answer}=useAnswers(v,onChange,patternResult);
 const act=(run,a)=>save({...v,runs:{...runs,[run.id]:runStep(run,runs[run.id],a)}});
 return <Window title="Ctrl+F · wyszukiwanie wzorca" score={res.score} max={res.max}>
  <p><b>Przykład rozwiązany.</b> {PATTERN_DEMO.context} Wzorzec „{PATTERN_DEMO.pattern}” przykładamy do tekstu jak pasek papieru. W każdym oknie porównujemy znaki od lewej. Różnica — przesuwamy pasek o jedno miejsce w prawo.</p>
  <Player frames={patternFrames(PATTERN_DEMO.text,PATTERN_DEMO.pattern)}/>
  <Legend/>
  <h4 className="tl-h">Teraz Ty jesteś algorytmem</h4>
  {PATTERN_RUNS.map(r=><Run key={r.id} run={r} st={runs[r.id]} onAct={act} locked={r.requires&&!runs[r.requires]?.done}/>)}
  <h4 className="tl-h">Ile to kosztuje?</h4>
  {PATTERN_QUESTIONS.map((item,i)=><div className="tl-card" key={item.id}><Question q={item} st={q[item.id]} onAnswer={answer} n={i+1}/></div>)}
  {res.done&&<p className="tl-done" role="status"><Icon name="trophy" size={22}/>Wyszukiwanie naiwne opanowane: {pts(res.score)}/{res.max} pkt. Liczba okien = n − m + 1.</p>}
 </Window>;
}

export default function TextLab(props){
 const m=props.data.mode;
 if(m==='compare')return <Compare {...props}/>;
 if(m==='detective')return <Detective {...props}/>;
 return <Pattern {...props}/>;
}
