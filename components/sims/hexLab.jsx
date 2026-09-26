import React,{useEffect,useState} from 'react';
import {Icon} from '../icons.jsx';
import {Lock,LockOpen} from '@phosphor-icons/react';
import './hexLab.css';
import {HEX_DIGITS,bitsToByte,nibbles,decToHex,groupBin,hexTable,nibbleTasks,checkNibbleTask,taskPoints,
 powerFields,checkPower,colorLock,parseColor,colorToHex,checkColor,macLock,checkMac,asciiLock,asciiTable,checkAscii,
 escapeLocks,escapeResult,lockOpen,lockPoints,formatTime,normHex,isHex,hexToDec,colorRound,COLOR_ROUNDS,colorDistance,roundPointsFor,colorGameResult} from '../../content/sims/hexLab.js';

const pts=n=>String(n).replace('.',',');
function Msg({m}){if(!m)return null;return <div className={`hexlab-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><span>{m.text}</span></div>;}
function Window({title,children,right,dark}){return <section className={`hexlab ${dark?'hexlab-dark':''}`} aria-label={title}><header className="hexlab-bar"><span className="hexlab-dots" aria-hidden="true"><i/><i/><i/></span><strong>{title}</strong><span className="hexlab-sim">symulacja</span>{right}</header>{children}</section>;}

/* ───────── Etap 2: konwerter czwórek ───────── */
function Nibble({value={},onChange}){
 const bits=value.bits||[0,0,0,0,0,0,0,0];const byte=bitsToByte(bits);const tasks=value.tasks||{};const [hi,lo]=nibbles(byte);
 function save(next){const t=next.tasks||{};const solved=nibbleTasks.filter(k=>t[k.id]?.solved);const score=solved.reduce((s,k)=>s+taskPoints(t[k.id].solvedAt),0);
  onChange({...next,done:solved.length===nibbleTasks.length,score,max:nibbleTasks.length,summary:solved.length?`Konwerter: ${solved.length}/${nibbleTasks.length} zadań`:undefined});}
 function toggle(i){const b=[...bits];b[i]=b[i]?0:1;save({...value,bits:b});}
 function setInput(id,v){save({...value,tasks:{...tasks,[id]:{...tasks[id],input:v}}});}
 function check(task){const t=tasks[task.id]||{};if(t.solved)return;const attempts=(t.attempts||0)+1;const r=checkNibbleTask(task,task.kind==='bits'?byte:t.input,attempts);
  save({...value,tasks:{...tasks,[task.id]:{...t,attempts,solved:r.ok,solvedAt:r.ok?attempts:undefined,msg:{ok:r.ok,text:r.message}}}});}
 const score=nibbleTasks.reduce((s,k)=>s+(tasks[k.id]?.solved?taskPoints(tasks[k.id].solvedAt):0),0);
 return <Window title="hexLab · konwerter czwórek" right={<span className="hexlab-score">{pts(score)}/4 pkt</span>}>
  <div className="hexlab-body">
   <div className="hexlab-byte" role="group" aria-label="Osiem przełączników bitów">
    {[0,1].map(g=><div className="hexlab-nibble" key={g}>
     <div className="hexlab-bits">{[0,1,2,3].map(j=>{const i=g*4+j;return <button type="button" key={i} className="hexlab-bit" aria-pressed={!!bits[i]} aria-label={`Bit o wadze ${[8,4,2,1][j]} w ${g?'prawej':'lewej'} czwórce: ${bits[i]}`} onClick={()=>toggle(i)}><small>{[8,4,2,1][j]}</small><b>{bits[i]}</b></button>;})}</div>
     <div className="hexlab-digit"><span>{g?lo:hi}₁₀ →</span><b>{HEX_DIGITS[g?lo:hi]}</b></div>
    </div>)}
   </div>
   <p className="hexlab-readout" aria-live="polite"><span>{groupBin(byte)}₂</span><span>=</span><b>0x{decToHex(byte,2)}</b><span>=</span><span>{byte}₁₀</span></p>
   <details className="hexlab-table"><summary><Icon name="table" size={20}/>Ściąga: tabela 0–F</summary><div className="hexlab-table-grid">{hexTable.map(r=><span key={r.hex}><b>{r.hex}</b><small>{r.bin}</small><small>{r.dec}</small></span>)}</div><p className="small muted">Kolumny: cyfra hex · 4 bity · wartość dziesiętna. 1 cyfra hex = 4 bity (tzw. nibble), 2 cyfry = 1 bajt.</p></details>
   <ol className="hexlab-tasks">{nibbleTasks.map((task,n)=>{const t=tasks[task.id]||{};return <li key={task.id} className={t.solved?'is-solved':''}>
    <p className="hexlab-task-title"><span className="hexlab-num">{t.solved?<Icon name="check" size={16}/>:n+1}</span><span className="hexlab-prompt">{task.prompt}</span>{t.solved&&<em>+{pts(taskPoints(t.solvedAt))} pkt</em>}</p>
    {!t.solved&&<div className="hexlab-row">{task.kind==='bits'?<span className="small muted">Użyj przełączników powyżej (teraz: 0x{decToHex(byte,2)}).</span>:<label className="hexlab-field"><span>{task.kind==='dec'?'Wynik dziesiętnie':'Wynik hex'}</span><span className="hexlab-input">{task.kind==='hex'&&<i>0x</i>}<input value={t.input||''} inputMode={task.kind==='dec'?'numeric':'text'} autoComplete="off" spellCheck={false} maxLength={6} onChange={e=>setInput(task.id,e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check(task);}}/></span></label>}
     <button type="button" className="btn" onClick={()=>check(task)}>Sprawdź</button></div>}
    <Msg m={t.msg}/>
   </li>;})}</ol>
  </div>
 </Window>;
}

/* ───────── Etap 3: ucieczka z serwerowni ───────── */
function Confetti(){return <div className="hexlab-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}%`,'--d':`${(i%6)*0.15}s`,'--c':['#f0b429','#16a36a','#2f6fdb','#d64545'][i%4]}}/>)}</div>;}
function PowerLock({st,set,check}){const inp=st.inputs||{};const fb=st.fields||{};
 return <div className="hexlab-lock-body"><p>Panel zasilania szafy przyjmuje kod złożony z trzech bajtów. Zamień liczby na hex i wpisz je po kolei. Kod = połączone cyfry.</p>
  <div className="hexlab-power">{powerFields.map(f=><label key={f.id} className="hexlab-field"><span>{f.label} →</span><span className="hexlab-input"><i>0x</i><input value={inp[f.id]||''} maxLength={4} autoComplete="off" spellCheck={false} disabled={st.solved} aria-invalid={fb[f.id]&&!fb[f.id].ok?true:undefined} onChange={e=>set({inputs:{...inp,[f.id]:e.target.value}})} onKeyDown={e=>{if(e.key==='Enter')check();}}/></span>{fb[f.id]&&!st.solved&&<small className={fb[f.id].ok?'hexlab-ok':'hexlab-bad'}>{fb[f.id].ok?'✓ dobrze':`✗ ${fb[f.id].message}`}</small>}</label>)}</div>
  <p className="hexlab-code" aria-label="Kod na wyświetlaczu">KOD: {powerFields.map(f=><b key={f.id}>{isHex(inp[f.id])?normHex(inp[f.id]).slice(0,2).padStart(2,'_'):'__'}</b>)}</p>
 </div>;}
function ColorLock({st,set,check}){const inp=st.inputs||{};const t=colorLock.target;
 const val=k=>isHex(inp[k])&&normHex(inp[k]).length<=2?hexToDec(inp[k]):0;const mine={r:val('r'),g:val('g'),b:val('b')};
 return <div className="hexlab-lock-body"><p>Lampa alarmowa świeci złym kolorem. Czujnik podaje, jaki ma być: <b className="hexlab-mono">R = {t.r}, G = {t.g}, B = {t.b}</b> (dziesiętnie). Ustaw kolor w zapisie <b>#RRGGBB</b>. Tolerancja: ±0x10 na kanał.</p>
  <div className="hexlab-swatches"><figure><span style={{background:colorToHex(t)}}/><figcaption>Cel (z czujnika)</figcaption></figure><figure><span style={{background:colorToHex(mine)}}/><figcaption>Twój: <b className="hexlab-mono">{colorToHex(mine)}</b></figcaption></figure></div>
  <div className="hexlab-rgb">{[['r','R — czerwony'],['g','G — zielony'],['b','B — niebieski']].map(([k,l])=><label key={k} className="hexlab-field"><span>{l}</span><span className="hexlab-input"><i>{k==='r'?'#':''}</i><input value={inp[k]||''} maxLength={2} autoComplete="off" spellCheck={false} disabled={st.solved} onChange={e=>set({inputs:{...inp,[k]:e.target.value}})}/></span></label>)}</div>
  <fieldset className="hexlab-pick"><legend>Który kod oznacza najciemniejszy kolor?</legend><div>{colorLock.darkest.options.map((o,i)=><button type="button" key={o} disabled={st.solved} aria-pressed={inp.darkest===i} className="hexlab-opt" onClick={()=>set({inputs:{...inp,darkest:i}})}><span className="hexlab-chip" style={{background:colorToHex(parseColor(o))}} aria-hidden="true"/><b className="hexlab-mono">{o}</b></button>)}</div></fieldset>
 </div>;}
function MacLock({st,set}){const inp=st.inputs||{};
 return <div className="hexlab-lock-body"><p>Monitoring sieci zgłasza obce urządzenie podszywające się pod szkolny sprzęt. Pierwsze 3 bajty adresu MAC to <b>OUI</b> — numer producenta. Znajdź intruza.</p>
  <div className="hexlab-scroll" role="region" aria-label="Tabela producentów" tabIndex={0}><table className="hexlab-oui"><caption>Producenci sprzętu szkoły (tabela fikcyjna)</caption><thead><tr><th scope="col">OUI</th><th scope="col">Producent</th><th scope="col">Co robi</th></tr></thead><tbody>{macLock.ouis.map(o=><tr key={o.oui}><td className="hexlab-mono">{o.oui}</td><td>{o.maker}</td><td>{o.what}</td></tr>)}</tbody></table></div>
  <fieldset className="hexlab-pick"><legend>Które urządzenie to intruz?</legend><div className="hexlab-devices">{macLock.devices.map((d,i)=><button type="button" key={d.name} disabled={st.solved} aria-pressed={inp.device===i} className="hexlab-opt" onClick={()=>set({inputs:{...inp,device:i}})}><Icon name={d.name.startsWith('PC')?'desktop':d.name.startsWith('AP')?'wifi':'printer'} size={20}/><span><b>{d.name}</b><small className="hexlab-mono">{d.mac}</small></span></button>)}</div></fieldset>
  <fieldset className="hexlab-pick"><legend>Ile bitów ma adres MAC?</legend><div className="hexlab-inline">{macLock.bits.options.map((o,i)=><button type="button" key={o} disabled={st.solved} aria-pressed={inp.bits===i} className="hexlab-opt" onClick={()=>set({inputs:{...inp,bits:i}})}>{o}</button>)}</div></fieldset>
 </div>;}
function AsciiLock({st,set,check}){const inp=st.inputs||{};
 return <div className="hexlab-lock-body"><p>Serwer wysłał hasło do drzwi jako bajty ASCII. Każda para cyfr hex to jeden znak. Odszyfruj i wpisz hasło.</p>
  <p className="hexlab-bytes" aria-label={`Bajty: ${asciiLock.bytes.join(' ')}`}>{asciiLock.bytes.map((b,i)=><b key={i}>{b}</b>)}</p>
  <details className="hexlab-table" open><summary><Icon name="table" size={20}/>Tabela ASCII (fragment)</summary><div className="hexlab-ascii">{asciiTable.map(r=><span key={r.hex}><small className="hexlab-mono">{r.hex}</small><b>{r.ch}</b></span>)}</div></details>
  <label className="hexlab-field hexlab-wide"><span>Hasło</span><input value={inp.text||''} maxLength={20} autoComplete="off" spellCheck={false} disabled={st.solved} onChange={e=>set({inputs:{...inp,text:e.target.value}})} onKeyDown={e=>{if(e.key==='Enter')check();}}/></label>
 </div>;}
const lockViews={power:PowerLock,color:ColorLock,mac:MacLock,ascii:AsciiLock};
const checkers={power:(i,a)=>checkPower(i,a),color:(i,a)=>checkColor(i,a),mac:(i,a)=>checkMac(i,a),ascii:(i,a)=>checkAscii(i.text,a)};

function Escape({value={},onChange}){
 const locks=value.locks||{};const r=escapeResult(value);const [now,setNow]=useState(Date.now());
 const firstOpen=escapeLocks.findIndex(l=>!locks[l.id]?.solved);const active=Math.min(value.active??Math.max(firstOpen,0),escapeLocks.length-1);
 useEffect(()=>{if(!value.startedAt||value.finishedAt)return;const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t);},[value.startedAt,value.finishedAt]);
 function save(next){const res=escapeResult(next);onChange({...next,done:res.done,score:res.score,max:res.max,summary:res.summary});}
 const lock=escapeLocks[active];const st=locks[lock.id]||{};
 function set(patch){save({...value,locks:{...locks,[lock.id]:{...st,...patch}}});}
 function check(){if(st.solved)return;const attempts=(st.attempts||0)+1;const res=checkers[lock.id](st.inputs||{},attempts);
  const nextLocks={...locks,[lock.id]:{...st,attempts,solved:res.ok,solvedAt:res.ok?attempts:undefined,fields:res.fields,msg:{ok:res.ok,text:res.message}}};
  const all=escapeLocks.every(l=>nextLocks[l.id]?.solved);save({...value,locks:nextLocks,finishedAt:all?Date.now():value.finishedAt});}
 const elapsed=value.startedAt?(value.finishedAt||now)-value.startedAt:0;const View=lockViews[lock.id];
 const header=<span className="hexlab-hud"><span><Icon name="clock" size={16}/><b aria-label="Czas">{formatTime(elapsed)}</b></span><span className="hexlab-score">{r.score}/12 pkt</span></span>;
 if(!value.startedAt)return <Window dark title="SERWEROWNIA · zamek elektroniczny" right={header}><div className="hexlab-body hexlab-intro">
  <Icon name="shield" size={44}/><h3>Drzwi serwerowni właśnie się zatrzasnęły.</h3>
  <p>System zamka ma 4 kłódki. Każda otwiera się dopiero po rozwiązaniu poprzedniej. Fabularnie macie 30 minut, zanim klimatyzacja się wyłączy i serwery zaczną się przegrzewać.</p>
  <ul className="hexlab-rules"><li><b>3 pkt</b> za kłódkę otwartą za 1. razem</li><li><b>2 pkt</b> za 2.–3. próbę</li><li><b>1 pkt</b> później — każda błędna próba daje mocniejszą podpowiedź</li></ul>
  <button type="button" className="btn" onClick={()=>save({...value,startedAt:Date.now(),active:0})}>Start — zegar rusza <Icon name="right" size={18}/></button></div></Window>;
 return <Window dark title="SERWEROWNIA · zamek elektroniczny" right={header}>
  <ol className="hexlab-locks" aria-label="Kłódki">{escapeLocks.map((l,i)=>{const s=locks[l.id]||{};const open=lockOpen(value,i);return <li key={l.id}><button type="button" disabled={!open} aria-current={i===active?'step':undefined} className={`${i===active?'is-active':''} ${s.solved?'is-solved':''}`} onClick={()=>save({...value,active:i})}>
   <span className="hexlab-lockicon" aria-hidden="true">{s.solved?<LockOpen size={22}/>:<Lock size={22}/>}</span><span><small>Kłódka {i+1}</small><b>{l.title}</b><em>{s.solved?`Otwarta · +${lockPoints(s.solvedAt)} pkt`:open?(s.attempts?`Próby: ${s.attempts}`:'Do otwarcia'):'Zablokowana'}</em></span></button></li>;})}</ol>
  <div className="hexlab-body">
   <h3 className="hexlab-lock-title">Kłódka {active+1}: {lock.title}</h3>
   <View st={st} set={set} check={check}/>
   {!st.solved&&<button type="button" className="btn" onClick={check}>Spróbuj otworzyć <Icon name="right" size={18}/></button>}
   <Msg m={st.msg}/>
   {st.solved&&active<escapeLocks.length-1&&<button type="button" className="btn" onClick={()=>save({...value,active:active+1})}>Następna kłódka <Icon name="right" size={18}/></button>}
   {r.done&&<div className="hexlab-win" role="status"><Confetti/><Icon name="trophy" size={42}/><h3>Drzwi otwarte! Jesteście wolni.</h3><p>4/4 kłódek w czasie <b>{formatTime(value.finishedAt-value.startedAt)}</b>. Wynik: <b>{r.score}/12 pkt</b>.</p><p className="small">Szybcy? Przejdź do etapu „Trafisz kolor?” i zmierz się z grą.</p></div>}
  </div>
 </Window>;
}

/* ───────── Etap 4: gra kolorów ───────── */
function ColorGame({value={},onChange}){
 const games=value.games?.length?value.games:[{rounds:[]}];const gi=games.length-1;const game=games[gi];const round=game.rounds.length;const finished=round>=COLOR_ROUNDS;
 const [guess,setGuess]=useState('');const [err,setErr]=useState('');const [hint,setHint]=useState(false);const last=game.rounds[round-1];const [showLast,setShowLast]=useState(false);
 const target=colorRound(gi,finished?COLOR_ROUNDS-1:round);const res=colorGameResult({games});
 function save(g){const r=colorGameResult({games:g});onChange({...value,games:g,done:r.done,score:r.score,max:r.max,summary:r.summary});}
 function shoot(e){e.preventDefault();const c=parseColor(guess);if(!c){setErr('Wpisz kod #RRGGBB (6 cyfr hex) albo skrót #RGB, np. #F80.');return;}setErr('');const dist=colorDistance(c,target);const rounds=[...game.rounds,{guess:colorToHex(c),target:colorToHex(target),dist,points:roundPointsFor(dist)}];save(games.map((g,i)=>i===gi?{rounds}:g));setGuess('');setHint(false);setShowLast(true);}
 const total=game.rounds.reduce((s,r)=>s+r.points,0);const strongest=['czerwony (R)','zielony (G)','niebieski (B)'][[target.r,target.g,target.b].indexOf(Math.max(target.r,target.g,target.b))];
 return <Window title="Trafisz kolor? · gra" right={<span className="hexlab-score">Runda {Math.min(round+1,COLOR_ROUNDS)}/{COLOR_ROUNDS} · {total} pkt · rekord {res.best}/10</span>}>
  <div className="hexlab-body">
   {showLast&&last&&<div className="hexlab-result" role="status"><div className="hexlab-swatches"><figure><span style={{background:last.target}}/><figcaption>Był: <b className="hexlab-mono">{last.target}</b></figcaption></figure><figure><span style={{background:last.guess}}/><figcaption>Twój: <b className="hexlab-mono">{last.guess}</b></figcaption></figure></div><p><b>+{last.points} pkt</b> · różnica kanałów: {last.dist} {last.points===2?'— snajper!':last.points===1?'— blisko.':'— następnym razem.'}</p></div>}
   {!finished?<form onSubmit={shoot} className="hexlab-game">
    <div className="hexlab-target" style={{background:colorToHex(target)}} role="img" aria-label={`Kolor do odgadnięcia, runda ${round+1}`}/>
    <label className="hexlab-field hexlab-wide"><span>Twój kod koloru</span><span className="hexlab-input"><i>#</i><input value={guess} maxLength={7} autoComplete="off" spellCheck={false} placeholder="np. 3A9 lub 33AA99" onChange={e=>setGuess(e.target.value)}/></span></label>
    {err&&<p className="hexlab-bad" role="status">{err}</p>}
    <div className="hexlab-row"><button className="btn" type="submit">Strzelam <Icon name="right" size={18}/></button><button type="button" className="text-button" onClick={()=>setHint(true)}>Podpowiedź</button></div>
    {hint&&<p className="small muted" role="status">Najsilniejszy kanał: {strongest}. Ciemny kolor = małe liczby, jasny = duże.</p>}
    <p className="small muted">Punkty: różnica kanałów do 96 → 2 pkt, do 192 → 1 pkt. Gra jest dla chętnych i nie wlicza się do oceny.</p>
   </form>:<div className="hexlab-intro" role="status"><Icon name="palette" size={40}/><h3>Koniec gry: {total}/10 pkt</h3><p>Rekord: {res.best}/10. {total>=8?'Oko grafika. Serio.':total>=5?'Nieźle — kanały RGB już Cię słuchają.':'Kolory w hex to kwestia wprawy. Spróbuj jeszcze raz.'}</p><button type="button" className="btn secondary" onClick={()=>{save([...games,{rounds:[]}]);setShowLast(false);}}>Zagraj jeszcze raz (nowe kolory) <Icon name="reset" size={18}/></button></div>}
  </div>
 </Window>;
}

export default function HexLab({data,value,onChange}){
 if(data.mode==='escape')return <Escape value={value||{}} onChange={onChange}/>;
 if(data.mode==='color')return <ColorGame value={value||{}} onChange={onChange}/>;
 return <Nibble value={value||{}} onChange={onChange}/>;
}
