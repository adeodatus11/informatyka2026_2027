import React,{useEffect,useState} from 'react';
import {Icon} from '../icons.jsx';
import './cipherLab.css';
import {ALPHABET,PL_PAIRS,normalize,lettersOnly,letterCount,mod26,caesar,caesarTable,gaderypoluki,GADERY_PAIRS,attempt,taskPoints,
 caesarTasks,caesarTaskCipher,checkCaesarTask,caesarResult,gaderyTasks,checkGaderyTask,gaderyResult,
 encryptWith,validateMessage,matchCipher,allShifts,soloPuzzles,formatTime,duelResult,MIN_LETTERS,
 crackCipher,crackFreq,PL_FREQ,applyGuess,duplicates,crackProgress,hintLetter,FREE_TIPS,checkPassword,crackResult,CRACK_KEY} from '../../content/sims/cipherLab.js';

const pts=n=>String(n).replace('.',',');
const hasPolish=s=>/[ąćęłńóśźż]/i.test(s||'');

function Msg({m}){if(!m)return null;return <div className={`cl-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><span>{m.text}</span></div>;}
function Window({title,score,max,children,sub}){
 return <section className="cl" aria-label={title}>
  <header className="cl-bar"><span className="cl-dots" aria-hidden="true"><i/><i/><i/></span><Icon name="lock" size={18}/><strong>{title}</strong><span className="cl-sim">symulacja</span>{sub}
   {max!=null&&<span className="cl-score" aria-label={`Punkty: ${pts(score)} na ${max}`}><Icon name="trophy" size={16}/>{pts(score)}/{max} pkt</span>}</header>
  <div className="cl-body">{children}</div>
 </section>;
}
function PlNote({text}){if(!hasPolish(text))return null;return <p className="cl-plnote small"><Icon name="warning" size={16}/>Polskie litery zamieniono na łacińskie ({PL_PAIRS.filter(([p])=>text.toLowerCase().includes(p)).map(([p,l])=>`${p}→${l}`).join(', ')}). Alfabet szyfru ma 26 liter A–Z.</p>;}

/* Zadanie: wpisz tekst albo wybierz odpowiedź */
function Task({n,task,st={},onInput,onCheck,cipher,disabled}){
 const solved=st.solved;
 return <li className={`cl-task ${solved?'is-solved':''}`}>
  <p className="cl-task-title"><span className="cl-num" aria-hidden="true">{solved?<Icon name="check" size={16}/>:n}</span><span className="cl-prompt">{task.prompt}</span>{solved&&<em>+{pts(taskPoints(st.solvedAt))} pkt</em>}</p>
  {cipher&&<p className="cl-cipher-line" aria-label={`Szyfrogram: ${cipher}`}>{cipher}</p>}
  {task.kind==='choice'?<div className="choices cl-choices" role="group" aria-label={task.prompt}>{task.options.map((o,i)=><button type="button" key={o} className={`choice ${st.pick===i?'selected':''}`} aria-pressed={st.pick===i} disabled={solved||disabled} onClick={()=>onCheck(i)}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{o}</span></button>)}</div>
  :!solved&&<div className="cl-row"><label className="cl-field"><span>{task.kind==='encrypt'?'Szyfrogram':'Tekst jawny'}</span><input className="cl-input" value={st.input||''} disabled={disabled} autoComplete="off" spellCheck={false} maxLength={80} onChange={e=>onInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')onCheck(st.input||'');}}/></label><button type="button" className="btn" disabled={disabled} onClick={()=>onCheck(st.input||'')}>Sprawdź</button></div>}
  <Msg m={st.msg}/>
 </li>;
}
function useTasks(value,onChange,tasks,check,result){
 const state=value?.tasks||{};
 function save(next){onChange({...next,...result(next)});}
 const setInput=(id,input)=>save({...value,tasks:{...state,[id]:{...state[id],input}}});
 function run(task,input){const prev=state[task.id]||{};if(prev.solved)return;const r=check(task,input);const st={...attempt(prev,r.ok),input:task.kind==='choice'?prev.input:input,pick:task.kind==='choice'?input:prev.pick,msg:{ok:r.ok,text:r.ok?`${(prev.tries||0)===0?'Za pierwszym razem: +2 pkt.':'Poprawione: +1 pkt.'} ${r.message}`:r.message}};save({...value,tasks:{...state,[task.id]:st}});}
 return {state,setInput,run,save};
}

/* ───────── Tarcza Cezara ───────── */
function Wheel({shift}){
 const step=360/26,R1=118,R2=86;
 const pos=(i,r)=>{const a=i*step*Math.PI/180;return [r*Math.sin(a),-r*Math.cos(a)];};
 return <svg className="cl-wheel" viewBox="-140 -140 280 280" role="img" aria-label={`Tarcza szyfru: litera A przechodzi w ${ALPHABET[mod26(shift)]}, przesunięcie o ${mod26(shift)}`}>
  <circle r="134" className="cl-wheel-outer"/><circle r="102" className="cl-wheel-inner"/><circle r="70" className="cl-wheel-hub"/>
  <path d="M-11,-136 L11,-136 L6,-66 L-6,-66 Z" className="cl-wheel-window"/>
  {[...ALPHABET].map((ch,i)=>{const [x,y]=pos(i,R1);return <text key={ch} x={x} y={y} transform={`rotate(${i*step} ${x} ${y})`} className={`cl-wheel-plain ${i===0?'is-top':''}`}>{ch}</text>;})}
  <g className="cl-wheel-rot" style={{transform:`rotate(${-mod26(shift)*step}deg)`}}>
   {[...ALPHABET].map((ch,i)=>{const [x,y]=pos(i,R2);return <text key={ch} x={x} y={y} transform={`rotate(${i*step} ${x} ${y})`} className={`cl-wheel-cipher ${i===mod26(shift)?'is-top':''}`}>{ch}</text>;})}
  </g>
  <text y="-8" className="cl-wheel-key">klucz</text><text y="22" className="cl-wheel-keyn">{mod26(shift)}</text>
 </svg>;
}
function SubTable({pairs,used,caption}){
 return <div className="cl-table-wrap" role="region" aria-label={caption} tabIndex={0}><table className="cl-table"><caption className="sr-only">{caption}</caption><tbody>
  <tr><th scope="row">jawny</th>{pairs.map(p=><td key={p.plain} className={used.has(p.plain)?'is-used':''}>{p.plain}</td>)}</tr>
  <tr><th scope="row">szyfr</th>{pairs.map(p=><td key={p.plain} className={used.has(p.plain)?'is-used':''}>{p.cipher}</td>)}</tr>
 </tbody></table></div>;
}

function Caesar({value,onChange}){
 const tool=value?.tool||{text:'Hej, to tajne!',key:3,dir:'enc'};
 const {state,setInput,run,save}=useTasks(value,onChange,caesarTasks,checkCaesarTask,caesarResult);
 const setTool=t=>save({...value,tool:{...tool,...t}});
 const res=caesarResult(value);
 const shift=tool.dir==='dec'?-tool.key:tool.key;
 const out=caesar(tool.text,shift);
 const used=new Set(lettersOnly(tool.dir==='dec'?caesar(tool.text,-tool.key):tool.text));
 return <Window title="Szyfrator Cezara" score={res.score} max={res.max}>
  <div className="cl-caesar">
   <div className="cl-wheel-box">
    <Wheel shift={tool.key}/>
    <p className="small muted cl-center">Zewnętrzny pierścień: tekst jawny. Wewnętrzny: szyfrogram. Obracasz o klucz.</p>
   </div>
   <div className="cl-tool">
    <div className="cl-seg" role="group" aria-label="Kierunek">
     <button type="button" aria-pressed={tool.dir!=='dec'} onClick={()=>setTool({dir:'enc'})}>Szyfruj →</button>
     <button type="button" aria-pressed={tool.dir==='dec'} onClick={()=>setTool({dir:'dec'})}>← Deszyfruj</button>
    </div>
    <div className="cl-keyrow">
     <button type="button" className="cl-step" aria-label="Klucz o jeden mniej" onClick={()=>setTool({key:mod26(tool.key-1)})}><Icon name="left" size={20}/></button>
     <label className="cl-range-label">Klucz: <b>{tool.key}</b><input className="cl-range" type="range" min="0" max="25" value={tool.key} onChange={e=>setTool({key:Number(e.target.value)})}/></label>
     <button type="button" className="cl-step" aria-label="Klucz o jeden więcej" onClick={()=>setTool({key:mod26(tool.key+1)})}><Icon name="right" size={20}/></button>
    </div>
    <label className="cl-field"><span>{tool.dir==='dec'?'Szyfrogram (wejście)':'Tekst jawny (wejście)'}</span><textarea className="cl-textarea" rows={2} maxLength={120} value={tool.text} spellCheck={false} onChange={e=>setTool({text:e.target.value})}/></label>
    <div className="cl-output" aria-live="polite"><span>{tool.dir==='dec'?'Tekst jawny':'Szyfrogram'}</span><b>{out||'—'}</b></div>
    <PlNote text={tool.text}/>
   </div>
  </div>
  <SubTable pairs={caesarTable(tool.key)} used={used} caption={`Tabela podstawień dla klucza ${tool.key}`}/>
  <h4 className="cl-h">Zadania <span className="muted small">— 2 pkt za pierwszą próbę, 1 pkt po poprawce</span></h4>
  <ol className="cl-tasks">{caesarTasks.map((t,i)=><Task key={t.id} n={i+1} task={t} st={state[t.id]} cipher={caesarTaskCipher(t)} onInput={v=>setInput(t.id,v)} onCheck={v=>run(t,v)}/>)}</ol>
  {res.done&&<p className="cl-done" role="status"><Icon name="trophy" size={22}/>Cezar opanowany: {pts(res.score)}/{res.max} pkt. Ciekawostka: Juliusz Cezar według Swetoniusza używał właśnie klucza 3.</p>}
 </Window>;
}

/* ───────── GA-DE-RY-PO-LU-KI ───────── */
function Gadery({value,onChange}){
 const {state,setInput,run,save}=useTasks(value,onChange,gaderyTasks,checkGaderyTask,gaderyResult);
 const res=gaderyResult(value);const unlocked=!!state.word?.solved;const text=value?.machine??'';
 return <Window title="Maszyna harcerska GA-DE-RY-PO-LU-KI" score={res.score} max={res.max}>
  <div className="cl-pairs" aria-label="Klucz: pary liter zamieniane miejscami">{GADERY_PAIRS.map(([a,b])=><span key={a} className="cl-pair"><b>{a}</b><span aria-hidden="true">↔</span><b>{b}</b></span>)}</div>
  <p className="small muted">Litera z pary zamienia się na drugą literę tej pary (G ↔ A, D ↔ E…). Litery spoza par zostają bez zmian. Harcerze znali też klucz PO-LI-TY-KA-RE-NU.</p>
  <div className={`cl-machine ${unlocked?'':'is-locked'}`}>
   {!unlocked&&<p className="cl-lockmsg"><Icon name="lock" size={20}/>Maszyna odblokuje się po zadaniu 1 — najpierw ręcznie, jak na biwaku bez telefonu.</p>}
   <label className="cl-field"><span>Wpisz tekst</span><textarea className="cl-textarea" rows={2} maxLength={120} disabled={!unlocked} value={text} spellCheck={false} onChange={e=>save({...value,machine:e.target.value})}/></label>
   <div className="cl-output" aria-live="polite"><span>Po zamianie par</span><b>{unlocked&&text?gaderypoluki(text):'—'}</b></div>
   <p className="cl-machine-note small muted">Jest tylko jeden przycisk-mechanizm: zamiana par. Nie ma osobnego „deszyfruj”.</p>
  </div>
  <h4 className="cl-h">Zadania</h4>
  <ol className="cl-tasks">{gaderyTasks.map((t,i)=><Task key={t.id} n={i+1} task={t} st={state[t.id]} cipher={t.cipher} disabled={i>0&&!unlocked} onInput={v=>setInput(t.id,v)} onCheck={v=>run(t,v)}/>)}</ol>
  {res.done&&<p className="cl-done" role="status"><Icon name="trophy" size={22}/>Szyfr harcerski rozpracowany. Ale uwaga: skoro każdy harcerz zna klucz, to nie jest tajemnica — to raczej zabawa.</p>}
 </Window>;
}

/* ───────── Pojedynek: szyfrant i łamacz ───────── */
function useTick(active){const [,set]=useState(0);useEffect(()=>{if(!active)return;const t=setInterval(()=>set(x=>x+1),1000);return ()=>clearInterval(t);},[active]);}
function Breaker({cipher,st,set,solvedLabel}){
 const k=st.key??0,mode=st.mode||'caesar';const started=st.startedAt&&!st.done;useTick(!!started);
 const shown=mode==='gadery'?gaderypoluki(cipher):caesar(cipher,-k);
 function tryKey(next,m='caesar'){set({key:next,mode:m,keyTries:(st.keyTries||0)+1,startedAt:st.startedAt||Date.now()});}
 const elapsed=st.done?st.ms:st.startedAt?Date.now()-st.startedAt:0;
 return <div className="cl-breaker">
  <div className="cl-hud" aria-live="off"><span><Icon name="search" size={16}/>Próby kluczy: <b>{st.keyTries||0}</b></span><span><Icon name="clock" size={16}/>{formatTime(elapsed)}</span>{st.done&&<span className="cl-hud-ok"><Icon name="check" size={16}/>{solvedLabel}</span>}</div>
  <div className="cl-crackline">
   <button type="button" className="cl-step" aria-label="Poprzedni klucz" disabled={st.done} onClick={()=>tryKey(mod26(k-1))}><Icon name="left" size={22}/></button>
   <div className="cl-try" aria-live="polite"><small>{mode==='gadery'?'GA-DE-RY-PO-LU-KI':`Cezar, klucz ${k}`}</small><b>{shown}</b></div>
   <button type="button" className="cl-step" aria-label="Następny klucz" disabled={st.done} onClick={()=>tryKey(mod26(k+1))}><Icon name="right" size={22}/></button>
  </div>
  <div className="inline-actions"><button type="button" className="btn secondary cl-small" disabled={st.done} onClick={()=>tryKey(k,'gadery')}>Spróbuj GA-DE-RY-PO-LU-KI</button>
   <button type="button" className="btn secondary cl-small" aria-expanded={!!st.all} onClick={()=>set({all:!st.all,usedAll:true,keyTries:(st.keyTries||0)+(st.usedAll||st.done?0:25),startedAt:st.startedAt||Date.now()})}><Icon name="laptop" size={18}/>{st.all?'Ukryj':'Pokaż'} wszystkie 25 kluczy (jak komputer{st.usedAll?'':', +25 prób'})</button></div>
  {st.all&&<div className="cl-all" role="region" aria-label="Wszystkie klucze Cezara" tabIndex={0}><p className="small muted">Komputer sprawdza wszystkie klucze w ułamku sekundy. Znajdź wiersz, który ma sens.</p><ol>{allShifts(cipher).map(r=><li key={r.key}><span>{r.key}</span><code>{r.text}</code></li>)}</ol></div>}
 </div>;
}
function Duel({value={},onChange}){
 const role=value.role||'A';const a=value.a||{method:'caesar',key:5,text:''};const b=value.b||{};const s=value.solo||{puzzle:0};
 const res=duelResult(value);
 function save(next){onChange({...next,...duelResult(next)});}
 const setA=x=>save({...value,a:{...a,...x}}),setB=x=>save({...value,b:{...b,...x}}),setS=x=>save({...value,solo:{...s,...x}});
 const vm=validateMessage(a.text);const aCipher=encryptWith(a.method,a.text,a.key);
 const bCipher=normalize(b.cipher||'');const bValid=letterCount(bCipher)>=MIN_LETTERS;
 const puzzle=soloPuzzles[s.puzzle%soloPuzzles.length];
 function checkB(){const m=matchCipher(bCipher,b.answer||'');const now=Date.now();
  if(m.ok)setB({match:m,checked:true,msg:{ok:true,text:`Twój tekst pasuje do szyfrogramu (${m.method==='gadery'?'GA-DE-RY-PO-LU-KI':`Cezar, klucz ${m.key}`}). Teraz partner potwierdza, czy to jego wiadomość.`},ms:b.ms||(b.startedAt?now-b.startedAt:0)});
  else setB({fails:(b.fails||0)+1,match:null,checked:true,msg:{ok:false,text:'Ten tekst nie pasuje do szyfrogramu przy żadnym kluczu. Sprawdź literówki albo szukaj dalej strzałkami. Liczba liter musi się zgadzać.'}});}
 function checkS(){const ok=lettersOnly(s.answer)===lettersOnly(puzzle.plain);const st={...s,...attempt(s,ok)};
  if(ok){st.done=true;st.ms=s.startedAt?Date.now()-s.startedAt:0;if(s.recTries==null){st.recTries=s.keyTries||0;st.recMs=st.ms;}st.msg={ok:true,text:`Złamane w ${s.keyTries||0} próbach (${formatTime(st.ms)})! Klucz to ${puzzle.key}. ${s.recTries!=null?'Zagadka bonusowa — bez punktów, tylko rekord.':st.solvedAt===1?'+4 pkt.':'+3 pkt.'} Komputer zrobiłby to w ułamek sekundy — 25 kluczy to nic.`};}
  else st.msg={ok:false,text:'To nie ta wiadomość. Szukaj klucza, przy którym wszystkie słowa mają sens, i przepisz tekst dokładnie.'};
  save({...value,solo:st});}
 return <Window title="Pojedynek: szyfrant i łamacz" score={res.score} max={res.max}>
  <div className="cl-roles" role="tablist" aria-label="Wybierz rolę">
   {[['A','Szyfrant (osoba A)',`${res.aPts}/2`],['B','Łamacz (osoba B)',`${res.bPts}/4`],['solo','Gram sam: zagadka',`${res.bPts}/4`]].map(([id,l,p])=><button type="button" role="tab" key={id} aria-selected={role===id} className={role===id?'is-on':''} onClick={()=>save({...value,role:id})}><b>{l}</b><small>{p} pkt</small></button>)}
  </div>
  {role==='A'&&<div className="cl-panel" role="tabpanel" aria-label="Szyfrant">
   <p><b>Twoje zadanie:</b> zaszyfruj krótką wiadomość dla partnera (min. {MIN_LETTERS} liter). Nie zdradzaj klucza! Potem zamieńcie się rolami.</p>
   <div className="cl-seg" role="group" aria-label="Metoda">
    <button type="button" aria-pressed={a.method==='caesar'} disabled={a.locked} onClick={()=>setA({method:'caesar'})}>Cezar</button>
    <button type="button" aria-pressed={a.method==='gadery'} disabled={a.locked} onClick={()=>setA({method:'gadery'})}>GA-DE-RY-PO-LU-KI</button>
   </div>
   {a.method==='caesar'&&<label className="cl-range-label">Tajny klucz: <b>{a.key}</b><input className="cl-range" type="range" min="1" max="25" value={a.key} disabled={a.locked} onChange={e=>setA({key:Number(e.target.value)})}/></label>}
   <label className="cl-field"><span>Wiadomość (tekst jawny)</span><textarea className="cl-textarea" rows={2} maxLength={100} disabled={a.locked} value={a.text} placeholder="Np. Spotkajmy się przy automacie z kawą" onChange={e=>setA({text:e.target.value})}/></label>
   {a.text&&<p className={`small ${vm.ok?'cl-okc':'cl-badc'}`} role="status">{vm.ok?'✓ ':'✗ '}{vm.message}</p>}
   <div className="cl-output cl-output-big"><span>Szyfrogram do podyktowania</span><b>{a.text?aCipher:'—'}</b></div>
   <PlNote text={a.text}/>
   {!a.locked?<button type="button" className="btn" disabled={!vm.ok} onClick={()=>setA({locked:true})}>Gotowe — przekazuję szyfrogram partnerowi (+2 pkt)</button>
   :<div className="cl-msg is-ok" role="status"><Icon name="check" size={20}/><span>Szyfrogram gotowy (+2 pkt). Podyktuj go albo pokaż ekran. Partner wpisuje go u siebie w roli „Łamacz”. {a.method==='gadery'?'Uwaga: GA-DE-RY-PO-LU-KI zna każdy harcerz — ciekawe, jak szybko padnie.':'Klucz zostaje w Twojej głowie.'} <button type="button" className="cl-link" onClick={()=>setA({locked:false})}>Zmień wiadomość</button></span></div>}
  </div>}
  {role==='B'&&<div className="cl-panel" role="tabpanel" aria-label="Łamacz">
   <p><b>Twoje zadanie:</b> przepisz szyfrogram od partnera i złam go bez klucza. Klikaj strzałki — każda to kolejny klucz. Stoper rusza przy pierwszej próbie.</p>
   <label className="cl-field"><span>Szyfrogram od partnera</span><input className="cl-input cl-input-wide" value={b.cipher||''} disabled={b.confirmed} maxLength={100} autoComplete="off" spellCheck={false} onChange={e=>setB({cipher:e.target.value,checked:false,msg:null})}/></label>
   {b.cipher&&!bValid&&<p className="small cl-badc" role="status">✗ Szyfrogram ma {letterCount(bCipher)} liter — potrzeba co najmniej {MIN_LETTERS}. Poproś partnera o dłuższą wiadomość.</p>}
   {bValid&&<>
    <Breaker cipher={bCipher} st={b} set={setB} solvedLabel="potwierdzone"/>
    <div className="cl-row"><label className="cl-field cl-grow"><span>Odczytana wiadomość</span><input className="cl-input cl-input-wide" value={b.answer||''} disabled={b.confirmed} autoComplete="off" spellCheck={false} maxLength={100} onChange={e=>setB({answer:e.target.value,checked:false,match:null,msg:null})} onKeyDown={e=>{if(e.key==='Enter')checkB();}}/></label><button type="button" className="btn" disabled={b.confirmed} onClick={checkB}>Sprawdź</button></div>
    <Msg m={b.msg}/>
    {b.match&&!b.confirmed&&<div className="cl-confirm" role="group" aria-label="Potwierdzenie partnera"><p><Icon name="group" size={20}/><b>Partner (osoba A):</b> czy to Twoja wiadomość?</p><div className="inline-actions"><button type="button" className="btn" onClick={()=>setB({confirmed:true,done:true})}>Zgadza się ✓</button><button type="button" className="btn secondary" onClick={()=>setB({fails:(b.fails||0)+1,match:null,msg:{ok:false,text:'Partner mówi: to nie to. Tekst pasuje do szyfru, ale ma inny sens? Sprawdź inny klucz.'}})}>Nie zgadza się</button></div></div>}
    {b.confirmed&&<p className="cl-done" role="status"><Icon name="trophy" size={22}/>Złamane w {b.keyTries||0} próbach ({formatTime(b.ms)}). +{b.fails?3:4} pkt. Porównajcie czasy z innymi parami!</p>}
   </>}
  </div>}
  {role==='solo'&&<div className="cl-panel" role="tabpanel" aria-label="Zagadka">
   <p><b>Nie masz pary?</b> Przechwyciłeś szyfrogram zapisany szyfrem Cezara. Klucza nie znasz. Złam go i wpisz treść.</p>
   <p className="cl-cipher-line">{puzzle.cipher}</p>
   <Breaker cipher={puzzle.cipher} st={s} set={setS} solvedLabel={`klucz ${puzzle.key}`}/>
   {!s.done?<div className="cl-row"><label className="cl-field cl-grow"><span>Odczytana wiadomość</span><input className="cl-input cl-input-wide" value={s.answer||''} autoComplete="off" spellCheck={false} maxLength={100} onChange={e=>setS({answer:e.target.value})} onKeyDown={e=>{if(e.key==='Enter')checkS();}}/></label><button type="button" className="btn" onClick={checkS}>Sprawdź</button></div>
   :<button type="button" className="btn secondary cl-small" onClick={()=>setS({puzzle:(s.puzzle||0)+1,key:0,mode:'caesar',keyTries:0,startedAt:null,done:false,answer:'',msg:null,all:false})}>Następna zagadka (na rekord czasu, bez punktów)</button>}
   <Msg m={s.msg}/>
  </div>}
  <p className="small muted">Punkty: szyfrant 2 pkt (poprawna wiadomość) + łamacz 4 pkt (3 pkt, jeśli była pomyłka). W parze zamieńcie się rolami — każdy zdobywa punkty u siebie.</p>
 </Window>;
}

/* ───────── Łamanie: analiza częstości ───────── */
function Crack({value={},onChange}){
 const guess=value.guess||{};const [focus,setFocus]=useState(null);
 const res=crackResult(value);const dup=duplicates(guess);const dupSet=new Set(Object.values(dup).flat());
 const prog=crackProgress(guess);const tips=value.tips||0;
 function save(next){onChange({...next,...crackResult(next)});}
 const setGuess=(c,p)=>save({...value,guess:{...guess,[c]:p||undefined}});
 function hint(){const h=hintLetter(guess);if(!h)return;const g={...guess};for(const [c,p] of Object.entries(g))if(p===h.plain&&c!==h.cipher)delete g[c];g[h.cipher]=h.plain;save({...value,guess:g,hints:(value.hints||0)+1,revealed:[...(value.revealed||[]),h.cipher]});}
 function check(){if(value.solved)return;const r=checkPassword(value.password);save({...value,solved:r.ok,wrong:(value.wrong||0)+(r.ok||!lettersOnly(value.password).length?0:1),msg:{ok:r.ok,text:r.message}});}
 const cells=applyGuess(crackCipher,guess);const words=[];let cur=[];cells.forEach((c,i)=>{if(c.ch===' '){words.push(cur);cur=[];}else cur.push({...c,i});});words.push(cur);
 const maxPct=Math.max(crackFreq[0].pct,PL_FREQ[0][1]);
 return <Window title="Łamacz szyfrów · analiza częstości" score={res.score} max={res.max} sub={<span className="cl-sub">przypisane litery: {prog.assigned}/{prog.total}</span>}>
  <p>Przechwycona wiadomość. Każda litera zastąpiona <b>zawsze tą samą</b> inną literą — ale nie przesunięciem, tylko dowolnie. 25 kluczy już nie wystarczy: możliwych kluczy jest 26! ≈ 4 · 10²⁶, więcej niż ziaren piasku na Ziemi. Pomoże statystyka.</p>
  <div className="cl-crypto" aria-label="Szyfrogram z Twoimi przypisaniami">
   {words.map((w,wi)=><span className="cl-word" key={wi}>{w.map(c=>c.letter?<span key={c.i} className={`cl-cell ${c.plain?'is-set':''} ${focus===c.ch?'is-focus':''} ${dupSet.has(c.ch)?'is-dup':''}`} onClick={()=>{setFocus(c.ch);document.getElementById(`cl-sel-${c.ch}`)?.focus();}}><small>{c.ch}</small><b>{c.plain||'_'}</b></span>:<span key={c.i} className="cl-cell cl-punct"><small>&nbsp;</small><b>{c.ch}</b></span>)}</span>)}
  </div>
  <p className="small muted">Górny rząd: litera szyfrogramu. Dolny: Twoje przypuszczenie (_ = jeszcze nie wiesz). Kliknij literę w tekście, by przejść do jej pola.</p>
  <div className="cl-freq">
   <div className="cl-freq-main">
    <h4 className="cl-h">Litery szyfrogramu — od najczęstszej. Przypisz, co oznaczają:</h4>
    <ul className="cl-map">{crackFreq.map(f=><li key={f.letter} className={`${guess[f.letter]?'is-set':''} ${dupSet.has(f.letter)?'is-dup':''} ${focus===f.letter?'is-focus':''}`}>
     <span className="cl-map-l">{f.letter}</span>
     <span className="cl-bar-track" aria-hidden="true"><span style={{width:`${f.pct/maxPct*100}%`}}/></span>
     <span className="cl-map-p">{String(f.pct).replace('.',',')}%</span>
     <label className="cl-map-sel"><span className="sr-only">Litera szyfrogramu {f.letter} ({String(f.pct).replace('.',',')}%) oznacza</span>
      <select id={`cl-sel-${f.letter}`} value={guess[f.letter]||''} disabled={value.solved} onFocus={()=>setFocus(f.letter)} onChange={e=>setGuess(f.letter,e.target.value)}><option value="">?</option>{[...ALPHABET].map(l=><option key={l} value={l}>{l}</option>)}</select></label>
    </li>)}</ul>
   </div>
   <aside className="cl-freq-ref" aria-label="Typowa częstość liter w języku polskim">
    <h4 className="cl-h">Typowo po polsku <small className="muted">(przybliżone)</small></h4>
    <ul>{PL_FREQ.slice(0,14).map(([l,p])=><li key={l}><b>{l}</b><span className="cl-bar-track is-ref" aria-hidden="true"><span style={{width:`${p/maxPct*100}%`}}/></span><small>{String(p).replace('.',',')}%</small></li>)}</ul>
    <p className="small muted">Zestawienia z korpusów tekstów; ą liczone jako a, ę jako e, ż i ź jako z itd. W krótkim tekście kolejność może się trochę różnić.</p>
   </aside>
  </div>
  {Object.keys(dup).length>0&&<div className="cl-msg is-retry" role="status"><Icon name="warning" size={20}/><span>Konflikt: {Object.entries(dup).map(([p,cs])=>`${p} przypisane do ${cs.join(' i ')}`).join('; ')}. W szyfrze podstawieniowym każda litera ma jeden zamiennik — jedno z przypisań jest błędne.</span></div>}
  <div className="cl-tips">
   <h4 className="cl-h">Podpowiedzi</h4>
   <ol>{FREE_TIPS.slice(0,tips).map(t=><li key={t}>{t}</li>)}</ol>
   <div className="inline-actions">
    {tips<FREE_TIPS.length&&<button type="button" className="btn secondary cl-small" onClick={()=>save({...value,tips:tips+1})}><Icon name="book" size={18}/>Wskazówka {tips+1}/{FREE_TIPS.length} (za darmo)</button>}
    <button type="button" className="btn secondary cl-small" disabled={value.solved||!hintLetter(guess)} onClick={hint}><Icon name="search" size={18}/>Odkryj jedną literę (−1 pkt)</button>
    {Object.keys(guess).length>0&&!value.solved&&<button type="button" className="btn secondary cl-small" onClick={()=>save({...value,guess:{}})}><Icon name="reset" size={18}/>Wyczyść przypisania</button>}
   </div>
   {value.revealed?.length>0&&<p className="small muted">Odkryte przez podpowiedź: {value.revealed.join(', ')} (−{value.hints} pkt).</p>}
  </div>
  <div className="cl-final">
   {!value.solved&&<div className="cl-row"><label className="cl-field"><span>Hasło końcowe (ostatnie słowo wiadomości)</span><input className="cl-input" value={value.password||''} autoComplete="off" spellCheck={false} maxLength={20} onChange={e=>onChange({...value,password:e.target.value})} onKeyDown={e=>{if(e.key==='Enter')check();}}/></label><button type="button" className="btn" onClick={check}>Sprawdź hasło</button></div>}
   <Msg m={value.msg}/>
   {value.solved&&<p className="cl-done" role="status"><Icon name="trophy" size={22}/>Szyfr złamany: {res.score}/8 pkt. A klucz? Spójrz na klawiaturę: A→{CRACK_KEY[0]}, B→{CRACK_KEY[1]}, C→{CRACK_KEY[2]}… to rząd QWERTY czytany po kolei.</p>}
   <p className="small muted">Pula: 8 pkt. −1 za każdą odkrytą literę i każde błędne hasło (minimum 3 pkt za złamanie).</p>
  </div>
 </Window>;
}

export default function CipherLab(props){
 const m=props.data.mode;
 if(m==='gaderypoluki')return <Gadery {...props}/>;
 if(m==='duel')return <Duel {...props}/>;
 if(m==='crack')return <Crack {...props}/>;
 return <Caesar {...props}/>;
}
