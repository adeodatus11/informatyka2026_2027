import React,{useEffect,useRef,useState} from 'react';
import {Icon} from '../icons.jsx';
import './sortLab.css';
import {isSorted,bubbleTrace,insertionTrace,WORKED,attempt,taskPoints,bubbleQuestions,insertionQuestions,raceQuestions,bubbleResult,insertionResult,raceResult,
 RACE_SIZES,RACE_KINDS,raceRun,fmtNum,humanTime,MANUAL_ROUNDS,CARD_IDS,orderValues,startOrder,roundBench,swapAdjacent,compareCards,CHECK_COST,roundScore,manualResult,
 PSEUDO_STEPS,PSEUDO_SHUFFLED,checkPseudo,pseudoResult} from '../../content/sims/sortLab.js';

const pts=n=>String(n).replace('.',',');
function Msg({m}){if(!m)return null;return <div className={`sl-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><span>{m.text}</span></div>;}
function Window({title,score,max,children,sub}){
 return <section className="sl" aria-label={title}>
  <header className="sl-bar"><span className="sl-dots" aria-hidden="true"><i/><i/><i/></span><Icon name="sort" size={18}/><strong>{title}</strong><span className="sl-sim">symulacja</span>{sub}
   {max!=null&&<span className="sl-score" aria-label={`Punkty: ${pts(score)} na ${max}`}><Icon name="trophy" size={16}/>{pts(score)}/{max} pkt</span>}</header>
  <div className="sl-body">{children}</div>
 </section>;
}

/* Pytania z przewidywaniem — 2 pkt za pierwszą próbę, 1 pkt po poprawce */
function Questions({qs,state={},onAnswer}){
 return <ol className="sl-qs">{qs.map((q,n)=>{const st=state[q.id]||{};return <li key={q.id} className={st.solved?'is-solved':''}>
  <p className="sl-q-title"><span className="sl-num" aria-hidden="true">{st.solved?<Icon name="check" size={16}/>:n+1}</span><span className="sl-prompt">{q.prompt}</span>{st.solved&&<em>+{pts(taskPoints(st.solvedAt))} pkt</em>}</p>
  <div className="choices sl-choices" role="group" aria-label={q.prompt}>{q.options.map((o,i)=><button type="button" key={o} className={`choice ${st.pick===i?'selected':''}`} aria-pressed={st.pick===i} disabled={st.solved} onClick={()=>onAnswer(q,i)}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{o}</span></button>)}</div>
  {st.last&&<Msg m={{ok:st.solved,text:st.solved?`${st.solvedAt===1?'Trafione za pierwszym razem: +2 pkt.':'Poprawione: +1 pkt.'} ${q.explain}`:`Jeszcze nie. ${q.tip}`}}/>}
 </li>;})}</ol>;
}
function useQuestions(value,onChange,qs,result){
 const q=value?.q||{};
 const save=next=>onChange({...next,...result(next)});
 const answer=(item,i)=>{const prev=q[item.id]||{};if(prev.solved)return;save({...value,q:{...q,[item.id]:{...attempt(prev,i===item.correct),pick:i}}});};
 return {q,answer,save};
}

/* ───────── odtwarzacz krok po kroku ───────── */
function Player({kind,data}){
 const trace=kind==='bubble'?bubbleTrace(data):insertionTrace(data);const steps=trace.steps;const last=steps.length;
 const [s,setS]=useState(0);const [auto,setAuto]=useState(false);
 useEffect(()=>{if(!auto)return;if(s>=last){setAuto(false);return;}const t=setTimeout(()=>setS(x=>Math.min(x+1,last)),900);return ()=>clearTimeout(t);},[auto,s,last]);
 const st=steps[s];const arr=st?st.before:trace.result;const max=Math.max(...data);
 const done=s>=last;const prev=steps[s-1];
 const cmp=prev?prev.comparisons:0,sw=prev?prev.swaps:0;
 let msg,inHand=-1,sortedFrom=data.length;
 if(kind==='bubble'){
  if(done)msg=`Gotowe! ${trace.comparisons} porównań i ${trace.swaps} zamian. Każde przejście „wypychało” największą z pozostałych liczb na koniec.`;
  else{const [i,j]=st.pair;msg=`Przejście ${st.pass}: porównuję ${arr[i]} i ${arr[j]}. ${st.swap?`${arr[i]} > ${arr[j]}, więc zamieniam.`:`${arr[i]} ≤ ${arr[j]}, zostawiam.`}${st.endOfPass?` To ostatnia para w tym przejściu — ${Math.max(...arr.slice(0,j+1))} wypłynie na koniec.`:''}`;}
  sortedFrom=done?0:data.length-(st.pass-1);
 }else{
  if(done)msg=`Gotowe! ${trace.comparisons} porównań i ${trace.swaps} przesunięć. Wszystkie karty są w ręce, ułożone.`;
  else{const [i,j]=st.pair;msg=`Wstawiam kartę ${arr[j]} (runda ${st.round}). Porównuję z ${arr[i]}: ${st.swap?`${arr[j]} < ${arr[i]}, przesuwam ją w lewo.`:`${arr[j]} ≥ ${arr[i]}, stop — karta jest na miejscu.`}`;inHand=st.hand;}
 }
 return <div className="sl-player">
  <div className="sl-hud"><span>Porównania: <b>{cmp}</b></span><span>{kind==='bubble'?'Zamiany':'Przesunięcia'}: <b>{sw}</b></span><span className="sl-hud-step">krok {Math.min(s,last)}/{last}</span></div>
  <div className={`sl-bars ${kind==='insertion'?'is-ins':''}`} role="img" aria-label={`Lista: ${arr.join(', ')}`}>
   {arr.map((v,i)=>{const isCmp=st&&st.pair.includes(i);const isKey=kind==='insertion'&&st&&i===st.pair[1];const sorted=kind==='bubble'&&(done||i>=sortedFrom);const hand=kind==='insertion'&&(done||i<=inHand);
    return <div key={i} className={`sl-barcol ${isCmp?'is-cmp':''} ${isKey?'is-key':''} ${sorted?'is-sorted':''} ${hand?'is-hand':''} ${isCmp&&st.swap?'is-swap':''}`}>
     <span className="sl-barlabel">{isCmp?'▼':sorted?'✓':''}</span>
     <span className="sl-barfill" style={{height:`${22+v/max*110}px`}}><b>{v}</b></span>
    </div>;})}
  </div>
  {kind==='insertion'&&<p className="sl-legend small"><span className="sl-sw is-hand"/>w ręce (posortowane) <span className="sl-sw is-key"/>wstawiana karta <span className="sl-sw"/>jeszcze na stole</p>}
  {kind==='bubble'&&<p className="sl-legend small"><span className="sl-sw is-cmp"/>porównywana para <span className="sl-sw is-key"/>para do zamiany <span className="sl-sw is-sorted"/>✓ już na swoim miejscu</p>}
  <p className="sl-say" aria-live="polite">{msg}</p>
  <div className="sl-controls">
   <button type="button" className="btn secondary sl-small" onClick={()=>{setAuto(false);setS(0);}} disabled={s===0}><Icon name="reset" size={18}/>Od początku</button>
   <button type="button" className="btn secondary sl-small" onClick={()=>{setAuto(false);setS(Math.max(0,s-1));}} disabled={s===0} aria-label="Krok wstecz"><Icon name="left" size={18}/>Wstecz</button>
   <button type="button" className="btn sl-small" onClick={()=>{setAuto(false);setS(Math.min(last,s+1));}} disabled={done}>Dalej<Icon name="right" size={18}/></button>
   <button type="button" className="btn secondary sl-small" aria-pressed={auto} onClick={()=>{if(done)setS(0);setAuto(!auto);}}><Icon name="play" size={18}/>{auto?'Pauza':'Auto'}</button>
  </div>
 </div>;
}

function Bubble({value,onChange}){
 const {q,answer}=useQuestions(value,onChange,bubbleQuestions,bubbleResult);const res=bubbleResult(value);
 return <Window title="Sortowanie bąbelkowe · krok po kroku" score={res.score} max={res.max}>
  <p><b>Przykład rozwiązany.</b> Idziesz od lewej po parach sąsiadów. Jeśli lewa liczba jest większa — zamiana. Jedno przejście przez całą listę wypycha największą liczbę na koniec, jak bąbel powietrza w wodzie.</p>
  <Player kind="bubble" data={WORKED}/>
  <h4 className="sl-h">Twoja kolej: przewiduj <span className="muted small">— inne liczby niż w przykładzie</span></h4>
  <Questions qs={bubbleQuestions} state={q} onAnswer={answer}/>
  {res.done&&<p className="sl-done" role="status"><Icon name="trophy" size={22}/>Bąbelkowe rozgryzione: {pts(res.score)}/{res.max} pkt. Zapamiętaj wzór: n(n − 1)/2 porównań.</p>}
 </Window>;
}
function Insertion({value,onChange}){
 const {q,answer}=useQuestions(value,onChange,insertionQuestions,insertionResult);const res=insertionResult(value);
 return <Window title="Sortowanie przez wstawianie · karty w ręce" score={res.score} max={res.max}>
  <p><b>Przykład rozwiązany.</b> Tak układasz karty w grze: bierzesz kolejną kartę ze stołu i przesuwasz ją w lewo, aż trafi na mniejszą. Karty w ręce są zawsze posortowane. Te same liczby co w bąbelkowym — porównaj liczniki na końcu.</p>
  <Player kind="insertion" data={WORKED}/>
  <h4 className="sl-h">Twoja kolej: przewiduj</h4>
  <Questions qs={insertionQuestions} state={q} onAnswer={answer}/>
  {res.done&&<p className="sl-done" role="status"><Icon name="trophy" size={22}/>Wstawianie opanowane: {pts(res.score)}/{res.max} pkt. Na tych samych danych: bąbelkowe 15 porównań, wstawianie 12.</p>}
 </Window>;
}

/* ───────── Pokonaj algorytm ───────── */
function Manual({value={},onChange}){
 const cur=value.round||'open';const rounds=value.rounds||{};const [sel,setSel]=useState([]);const [flash,setFlash]=useState(null);
 const round=MANUAL_ROUNDS.find(r=>r.id===cur);const st=rounds[cur]||{};const order=st.order||startOrder(round);
 const res=manualResult(value);const bench=roundBench(round);const vals=orderValues(round,order);
 function save(nextRound){const next={...value,round:cur,rounds:{...rounds,[cur]:{...st,order,swaps:st.swaps||0,comparisons:st.comparisons||0,...nextRound}}};onChange({...next,...manualResult(next)});}
 function toggle(id){if(st.sorted)return;setFlash(null);setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s.slice(-1),id]);}
 const pos=sel.map(id=>order.indexOf(id)).sort((a,b)=>a-b);const adjacent=sel.length===2&&pos[1]-pos[0]===1;
 function doSwap(){if(!adjacent)return;const o=swapAdjacent(order,pos[0],pos[1]);const sorted=!round.hidden&&isSorted(orderValues(round,o));save({order:o,swaps:(st.swaps||0)+1,sorted,log:st.log});setFlash({type:'swap',text:`Zamiana ${order[pos[0]]} ↔ ${order[pos[1]]}.`});if(sorted)setSel([]);}
 function doCompare(){if(sel.length!==2)return;const [a,b]=[order[pos[0]],order[pos[1]]];const r=compareCards(round,a,b);const entry=`${a} ${r} ${b}`;save({comparisons:(st.comparisons||0)+1,log:[entry,...(st.log||[])].slice(0,12)});setFlash({type:'cmp',text:`Waga mówi: ${a} ${r==='<'?'jest lżejsza niż':'jest cięższa niż'} ${b}  (${entry}).`});}
 function doCheck(){const ok=isSorted(vals);if(ok){save({sorted:true});setSel([]);setFlash(null);}else{save({comparisons:(st.comparisons||0)+CHECK_COST,checks:(st.checks||0)+1});setFlash({type:'bad',text:`Jeszcze nie posortowane. Sprawdzenie całej listy kosztowało ${CHECK_COST} porównań (tyle jest par sąsiadów).`});}}
 function reset(){save({order:startOrder(round),swaps:0,comparisons:0,log:[],checks:0,sorted:false});setSel([]);setFlash(null);}
 const r1done=!!rounds.open?.sorted;
 return <Window title="Pokonaj algorytm · 8 kart" score={res.score} max={res.max}>
  <div className="sl-tabs" role="tablist" aria-label="Rundy">
   {MANUAL_ROUNDS.map((r,i)=>{const s=rounds[r.id]||{};const locked=i===1&&!r1done;return <button type="button" role="tab" key={r.id} aria-selected={cur===r.id} disabled={locked} className={cur===r.id?'is-on':''} onClick={()=>{setSel([]);setFlash(null);onChange({...value,round:r.id,...manualResult(value)});}}>
    <b>{locked&&<Icon name="lock" size={15}/>}{r.title}</b><small>{s.sorted?`✓ ${roundScore(r,s)}/3 pkt`:locked?'odblokujesz po rundzie 1':'0/3 pkt'}</small></button>;})}
  </div>
  <p className="sl-goal">{round.hidden?<><b>Cel:</b> posortuj rosnąco karty, których <b>nie widzisz</b> — jak komputer. „Porównaj” działa jak waga: pokazuje, która z dwóch kart jest większa. Bąbelkowe potrzebuje tu <b>{bench.bubble.comparisons}</b> porównań. Zrób mniej, a pokonasz algorytm (+1 pkt).</>:<><b>Cel:</b> ułóż karty rosnąco (od najmniejszej). Zaznacz dwie <b>sąsiednie</b> karty i kliknij „Zamień”. Za ułożenie 2 pkt, za najmniejszą możliwą liczbę zamian +1 pkt.</>}</p>
  <div className="sl-hud"><span>Zamiany: <b>{st.swaps||0}</b></span>{round.hidden&&<span>Porównania: <b>{st.comparisons||0}</b> <small className="muted">(bąbelkowe: {bench.bubble.comparisons})</small></span>}{!round.hidden&&<span className="muted small">porównujesz wzrokiem — nie liczymy</span>}</div>
  <div className="sl-cards" role="group" aria-label="Karty — wybierz dwie">
   {order.map((id,i)=>{const v=round.values[CARD_IDS.indexOf(id)];const show=!round.hidden||st.sorted;const on=sel.includes(id);
    return <button type="button" key={id} className={`sl-card ${show?'':'is-hidden'} ${on?'is-sel':''} ${st.sorted?'is-done':''}`} aria-pressed={on} disabled={st.sorted} aria-label={`Karta ${id}${show?`, wartość ${v}`:', zakryta'}, pozycja ${i+1}`} onClick={()=>toggle(id)}>
     <small>{id}</small><b>{show?v:'?'}</b>
    </button>;})}
  </div>
  {!st.sorted&&<div className="sl-controls">
   {round.hidden&&<button type="button" className="btn" disabled={sel.length!==2} onClick={doCompare}><Icon name="search" size={18}/>Porównaj</button>}
   <button type="button" className={round.hidden?'btn secondary':'btn'} disabled={!adjacent} onClick={doSwap}><span aria-hidden="true">⇄</span>Zamień sąsiednie</button>
   {round.hidden&&<button type="button" className="btn secondary" onClick={doCheck}><Icon name="check" size={18}/>Gotowe — sprawdź</button>}
   <button type="button" className="btn secondary sl-small" onClick={reset}><Icon name="reset" size={18}/>Od nowa</button>
  </div>}
  {!st.sorted&&<p className="small muted" aria-live="polite">{sel.length===0?'Wybierz dwie karty.':sel.length===1?`Wybrana karta ${sel[0]}. Wybierz drugą.`:adjacent?`Wybrane: ${sel.join(' i ')} — sąsiednie.`:`Wybrane: ${sel.join(' i ')} — nie są sąsiednie, więc możesz je tylko porównać.`}</p>}
  {flash&&<div className={`sl-flash is-${flash.type}`} role="status">{flash.text}</div>}
  {round.hidden&&!st.sorted&&(st.log||[]).length>0&&<div className="sl-log"><b>Twoje notatki z wagi:</b> {(st.log||[]).map((l,i)=><code key={i}>{l}</code>)}</div>}
  {st.sorted&&<Verdict round={round} st={st} bench={bench}/>}
  {r1done&&cur==='open'&&!rounds.blind?.sorted&&<button type="button" className="btn" onClick={()=>{setSel([]);setFlash(null);onChange({...value,round:'blind',...manualResult(value)});}}>Runda 2: jak komputer <Icon name="right" size={18}/></button>}
 </Window>;
}
function Verdict({round,st,bench}){
 const rows=round.hidden?[['Ty',st.comparisons,st.swaps],['Bąbelkowe',bench.bubble.comparisons,bench.bubble.swaps],['Przez wstawianie',bench.insertion.comparisons,bench.insertion.swaps]]:[['Ty','—',st.swaps],['Bąbelkowe',bench.bubble.comparisons,bench.bubble.swaps],['Przez wstawianie',bench.insertion.comparisons,bench.insertion.swaps]];
 const s=roundScore(round,st);
 const text=round.hidden?(st.comparisons<bench.insertion.comparisons?`Wow: ${st.comparisons} porównań — lepiej niż bąbelkowe i niż wstawianie! Masz głowę do algorytmów.`:st.comparisons<bench.bubble.comparisons?`Pokonałeś bąbelkowe (${st.comparisons} < ${bench.bubble.comparisons})! Wstawianie zrobiło ${bench.insertion.comparisons} — to rekord do pobicia.`:`Tym razem algorytm wygrał: ${bench.bubble.comparisons} porównań kontra Twoje ${st.comparisons}. Za chwilę zobaczysz, jak on to robi.`)
  :(st.swaps===bench.minSwaps?`Remis z komputerem: ${st.swaps} zamian — mniej się nie da! Ale Ty porównywałeś „wzrokiem”, a komputer musi porównywać parami: bąbelkowe zrobiło ${bench.bubble.comparisons} porównań.`:`Ułożone! Zrobiłeś ${st.swaps} zamian, a minimum to ${bench.minSwaps}. Zamieniałeś czasem pary, które już stały dobrze.`);
 return <div className="sl-verdict" role="status">
  <p><Icon name="trophy" size={22}/><b>+{s} pkt.</b> {text}</p>
  <table className="sl-table"><caption className="sr-only">Porównanie z algorytmami na tych samych kartach</caption><thead><tr><th scope="col">Kto</th><th scope="col">Porównania</th><th scope="col">Zamiany</th></tr></thead>
   <tbody>{rows.map(([w,c,z])=><tr key={w} className={w==='Ty'?'is-you':''}><th scope="row">{w}</th><td>{c}</td><td>{z}</td></tr>)}</tbody></table>
 </div>;
}

/* ───────── Wyścig ───────── */
function useCountUp(target,key){
 const [v,setV]=useState(target);const raf=useRef();
 useEffect(()=>{const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce||!target){setV(target);return;}
  const t0=performance.now(),dur=1400;const tick=t=>{const p=Math.min(1,(t-t0)/dur);setV(Math.round(target*p*p));if(p<1)raf.current=requestAnimationFrame(tick);};setV(0);raf.current=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(raf.current);},[target,key]);
 return v;
}
function Lane({name,count,max,runKey,win}){
 const v=useCountUp(count,runKey);
 return <div className={`sl-lane ${win?'is-win':''}`}><span className="sl-lane-name">{name}{win&&<span className="sl-win"><Icon name="trophy" size={15}/>mniej pracy</span>}</span>
  <span className="sl-lane-track"><span style={{width:`${Math.max(0.6,v/max*100)}%`}}/></span><b className="sl-lane-n">{fmtNum(v)}</b></div>;
}
function Race({value={},onChange}){
 const {q,answer,save}=useQuestions(value,onChange,raceQuestions,raceResult);const res=raceResult(value);
 const n=value.n||10,kind=value.kind||'random';const runs=value.runs||{};const k=`${kind}-${n}`;const run=runs[k]?raceRun(n,kind):null;
 const start=()=>save({...value,runs:{...runs,[k]:(runs[k]||0)+1}});
 const max=run?Math.max(run.bubble.comparisons,run.insertion.comparisons):1;
 return <Window title="Wyścig algorytmów" score={res.score} max={res.max}>
  <p>Ustaw liczbę danych i ich rodzaj, potem <b>Start</b>. Liczymy porównania — to one zajmują najwięcej czasu.</p>
  <div className="sl-race-set">
   <div className="sl-seg" role="group" aria-label="Liczba danych">{RACE_SIZES.map(x=><button type="button" key={x} aria-pressed={n===x} onClick={()=>save({...value,n:x})}>{fmtNum(x)} liczb</button>)}</div>
   <div className="sl-seg" role="group" aria-label="Rodzaj danych">{RACE_KINDS.map(x=><button type="button" key={x.id} aria-pressed={kind===x.id} onClick={()=>save({...value,kind:x.id})}>{x.label}</button>)}</div>
   <button type="button" className="btn" onClick={start}><Icon name="play" size={18}/>Start wyścigu</button>
  </div>
  <div className="sl-track" aria-live="polite">
   {run?<><Lane name="Bąbelkowe" count={run.bubble.comparisons} max={max} runKey={`${k}-${runs[k]}`} win={run.bubble.comparisons<run.insertion.comparisons}/>
    <Lane name="Przez wstawianie" count={run.insertion.comparisons} max={max} runKey={`${k}-${runs[k]}`} win={run.insertion.comparisons<run.bubble.comparisons}/>
    <p className="small muted">Gdyby człowiek robił 1 porównanie na sekundę: bąbelkowe — {humanTime(run.bubble.comparisons)}, wstawianie — {humanTime(run.insertion.comparisons)}. Zamian/przesunięć obie metody robią tyle samo: {fmtNum(run.bubble.swaps)}.</p></>
   :<p className="muted">Wybierz ustawienia i kliknij Start.</p>}
  </div>
  <div className="sl-scroll" role="region" aria-label="Tabela wyników wyścigów" tabIndex={0}>
   <table className="sl-table sl-race-table"><caption>Twoje wyścigi — liczba porównań</caption><thead><tr><th scope="col">Dane</th>{RACE_SIZES.map(x=><th scope="col" key={x}>{fmtNum(x)}</th>)}</tr></thead>
    <tbody>{RACE_KINDS.flatMap(kd=>[['Bąbelkowe','bubble'],['Wstawianie','insertion']].map(([lab,alg])=><tr key={kd.id+alg}><th scope="row">{lab} · {kd.label.toLowerCase()}</th>{RACE_SIZES.map(x=>{const r=runs[`${kd.id}-${x}`]?raceRun(x,kd.id):null;return <td key={x}>{r?fmtNum(r[alg].comparisons):'—'}</td>;})}</tr>))}</tbody></table>
  </div>
  <p className="small muted">Uruchom kilka wyścigów, aby uzupełnić tabelę. Dane losowe i „prawie posortowane” (ok. 3% liczb nie na miejscu) są takie same u wszystkich.</p>
  <h4 className="sl-h">Wnioski</h4>
  <Questions qs={raceQuestions} state={q} onAnswer={answer}/>
  {res.done&&<p className="sl-done" role="status"><Icon name="trophy" size={22}/>Zapamiętaj: n² — 10 razy więcej danych to około 100 razy więcej pracy.</p>}
 </Window>;
}

/* ───────── Pseudokod ───────── */
function Pseudo({value={},onChange}){
 const order=value.order||[];const res=pseudoResult(value);const byId=id=>PSEUDO_STEPS.find(s=>s.id===id);
 const save=next=>onChange({...next,...pseudoResult(next)});
 const toggle=id=>{if(value.solved)return;save({...value,order:order.includes(id)?order.filter(x=>x!==id):[...order,id],check:null});};
 function check(){const r=checkPseudo(order);const tries=(value.tries||0)+1;save({...value,tries,solved:r.ok,solvedAt:r.ok?tries:undefined,check:r});}
 const wrong=new Set(value.check&&!value.check.ok?value.check.wrong:[]);
 return <Window title="Pseudokod · sortowanie bąbelkowe" score={res.score} max={res.max}>
  <p>Ułóż kroki algorytmu we właściwej kolejności — klikaj od pierwszego do ostatniego. Tak zaczyna się każdy program: najpierw plan po polsku.</p>
  <div className="sl-pseudo">
   <div className="choices sl-choices" role="group" aria-label="Kroki do ułożenia">{PSEUDO_SHUFFLED.map(id=>{const p=order.indexOf(id);return <button type="button" key={id} className={`choice ${p>=0?'selected':''}`} aria-pressed={p>=0} disabled={value.solved} onClick={()=>toggle(id)}><span className="choice-letter">{p>=0?p+1:'+'}</span><span>{byId(id).text}</span></button>;})}</div>
   <ol className={`sl-code ${value.solved?'is-solved':''}`} aria-label="Twój algorytm">{order.length?order.map((id,i)=><li key={id} className={wrong.has(i)?'is-bad':''} style={{paddingLeft:value.solved?`${byId(id).indent*1.6+0.6}em`:undefined}}>{byId(id).text}{wrong.has(i)&&<span className="sl-badmark"> ← zła pozycja</span>}</li>):<li className="muted">Kliknij pierwszy krok…</li>}</ol>
  </div>
  <div className="sl-controls"><button type="button" className="btn" disabled={order.length!==PSEUDO_STEPS.length||value.solved} onClick={check}>Sprawdź kolejność</button>{order.length>0&&!value.solved&&<button type="button" className="btn secondary sl-small" onClick={()=>save({...value,order:[],check:null})}><Icon name="reset" size={18}/>Wyczyść</button>}</div>
  {value.check&&<Msg m={{ok:value.check.ok,text:value.check.ok?`${value.solvedAt===1?'+2 pkt.':'+1 pkt.'} ${value.check.message}`:`${value.check.message} Kliknij kroki, aby je odznaczyć i ułożyć ponownie.`}}/>}
 </Window>;
}

export default function SortLab(props){
 const m=props.data.mode;
 if(m==='bubble')return <Bubble {...props}/>;
 if(m==='insertion')return <Insertion {...props}/>;
 if(m==='race')return <Race {...props}/>;
 if(m==='pseudocode')return <Pseudo {...props}/>;
 return <Manual {...props}/>;
}
