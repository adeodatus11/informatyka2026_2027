import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {WordSteps,WordRubric} from '../WordWorkshop.jsx';
import {fmt,AVG_HOURS,AVG_SOURCE,dayCategories,feelings,experiments,MAX_HOURS,setHours,dayTotal,compareText,dayResult,evidenceTypes,statements,chooseEvidence,evidenceResult,TOPIC,stances,roles,bank,tips,posterLicenses,byId,toggleArg,setCounter,posterMissing,posterCriteria,checkPoster,posterSig,posterScore,posterAllOk,posterResult,posterText,POSTER_MAX,peerCriteria,PEER_MAX,ratePeer,setPeer,peerResult} from '../../content/sims/debateLab.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './debateLab.css';

const roleIcon={student:'school',teacher:'board',employer:'laptop',parent:'house'};
function Top({tag,note,children}){return <div className="deb-top"><div><span className="deb-tag">{tag}</span><small>{note}</small></div>{children&&<div className="deb-counters" aria-live="polite">{children}</div>}</div>;}
function Feedback({ok,children}){return <div className={`deb-feedback ${ok?'ok':'retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;}
function RoleTag({role}){return <span className={`deb-role deb-role-${role}`}><Icon name={roleIcon[role]} size={15}/>{roles[role]}</span>;}

// ---------- Mój dzień online ----------
function Day({value={},onChange}){
 const hours=value.hours||{};const total=dayTotal(hours);const res=dayResult(value);
 const save=next=>onChange({...next,...dayResult(next)});
 const used=dayCategories.filter(c=>hours[c.id]>0);
 const scale=Math.max(total,AVG_HOURS,1);
 return <div className="deb-sim">
  <Top tag="Mój dzień online" note="tylko dla Ciebie — bez oceniania, znika po odświeżeniu strony"/>
  <p className="deb-instr">Oszacuj zwykły dzień nauki w tygodniu (w godzinach, co pół godziny). Nie ma dobrych ani złych wyników.</p>
  <div className="deb-day-grid">{dayCategories.map(c=><div key={c.id} className="deb-day-row">
   <label htmlFor={`deb-h-${c.id}`}><b>{c.label}</b><small>{c.hint}</small></label>
   <div className="deb-stepper"><button aria-label={`Mniej: ${c.label}`} onClick={()=>save(setHours(value,c.id,(hours[c.id]||0)-0.5))}>−</button><input id={`deb-h-${c.id}`} type="number" min={0} max={MAX_HOURS} step={0.5} inputMode="decimal" value={hours[c.id]??0} onChange={e=>save(setHours(value,c.id,e.target.value))}/><span aria-hidden="true">h</span><button aria-label={`Więcej: ${c.label}`} onClick={()=>save(setHours(value,c.id,(hours[c.id]||0)+0.5))}>+</button></div>
  </div>)}</div>
  <figure className="deb-compare" aria-label="Porównanie z badaniem">
   <div className="deb-bar-row"><span>Twój szacunek</span><div className="deb-bar"><i className="deb-bar-you" style={{width:`${total/scale*100}%`}}/></div><b>{fmt(total)} h</b></div>
   <div className="deb-bar-row"><span>Średnia z badania</span><div className="deb-bar"><i className="deb-bar-avg" style={{width:`${AVG_HOURS/scale*100}%`}}/></div><b>ok. {AVG_HOURS} h</b></div>
   <figcaption><span role="status">{compareText(total)}</span> <small>Źródło: {AVG_SOURCE}.</small></figcaption>
  </figure>
  {used.length>0&&<div className="deb-feel"><p className="deb-label">Co Ci to daje? Zaznacz przy każdej kategorii z czasem.</p>{used.map(c=><fieldset key={c.id} className="deb-fs"><legend>{c.label} — {fmt(hours[c.id])} h</legend><div className="deb-radios">{feelings.map(([id,label])=><label key={id} className={value.feel?.[c.id]===id?'picked':''}><input type="radio" name={`deb-feel-${c.id}`} checked={value.feel?.[c.id]===id} onChange={()=>save({...value,feel:{...(value.feel||{}),[c.id]:id}})}/>{label}</label>)}</div></fieldset>)}</div>}
  <fieldset className="deb-fs"><legend>Mój eksperyment na najbliższy tydzień</legend><div className="deb-radios deb-col">{experiments.map((t,i)=><label key={t} className={value.experiment===i?'picked':''}><input type="radio" name="deb-exp" checked={value.experiment===i} onChange={()=>save({...value,experiment:i})}/>{t}</label>)}</div></fieldset>
  {res.done?<Feedback ok>Gotowe. {res.summary}. Za tydzień sprawdź, czy coś się zmieniło — tylko dla siebie.</Feedback>:<p className="muted small">Do zaliczenia: szacunek, odpowiedź „co mi to daje” przy każdej kategorii z czasem i jeden eksperyment.</p>}
 </div>;
}

// ---------- Dowód, opinia czy brak dowodu ----------
function Evidence({value={},onChange}){
 const items=value.items||{};const res=evidenceResult(value);
 function pick(id,t){const s=chooseEvidence(items,id,t);onChange({...value,items:s,...evidenceResult({items:s})});}
 return <div className="deb-sim">
  <Top tag="Dowód czy opinia?" note="kto zbadał · kiedy · na kim — liczby z raportów do weryfikacji"><span>Punkty: <b>{fmt(res.score)}</b>/{res.max}</span><span>Rozpoznane: <b>{res.solved}</b>/{statements.length}</span></Top>
  <ul className="deb-types">{evidenceTypes.map(t=><li key={t.id} className={`deb-type-${t.id}`}><b>{t.label}</b> — {t.short}</li>)}</ul>
  <div className="deb-statements">{statements.map((s,i)=>{const st=items[s.id]||{};return <fieldset key={s.id} className={`deb-statement ${st.ok?'solved':''}`}>
   <legend>Wypowiedź {i+1}{st.ok&&<span className="deb-okmark"><Icon name="check" size={15}/>rozpoznana</span>}</legend>
   <p className="deb-quote">„{s.text}”</p>
   <div className="deb-type-buttons">{evidenceTypes.map(t=><button key={t.id} className={`deb-type-btn deb-type-${t.id} ${st.choice===t.id?'picked':''}`} aria-pressed={st.choice===t.id} disabled={st.ok&&st.choice!==t.id} onClick={()=>pick(s.id,t.id)}>{t.label}</button>)}</div>
   {st.choice&&<Feedback ok={st.ok}>{st.ok?<>{st.tries===1?'+1 pkt. ':'+0,5 pkt. '}{s.why}</>:<>Jeszcze nie. Zadaj trzy pytania: kto to zbadał? kiedy? na kim? A może to czyjś pogląd?</>}</Feedback>}
  </fieldset>;})}</div>
  {res.done&&<p className="deb-done" role="status"><Icon name="trophy" size={22}/>{res.summary}. Teraz wiesz, czego szukać w debacie.</p>}
 </div>;
}

// ---------- Plakat / stanowisko ----------
function PosterView({p}){
 const st=stances.find(s=>s.id===p.stance);const args=(p.args||[]).map(byId).filter(Boolean);const c=byId(p.counter);
 return <article className={`deb-poster deb-poster-${p.stance||'none'}`} aria-label="Podgląd plakatu">
  <header><p className="deb-poster-topic">{TOPIC}</p><h3>{(p.title||'').trim()||'Tytuł plakatu'}</h3>{st?<p className="deb-thesis"><span>Nasza teza: {st.label}</span>{st.thesis}</p>:<p className="deb-thesis deb-empty">Wybierzcie tezę.</p>}</header>
  <div className="deb-poster-args">{[0,1].map(i=>{const a=args[i];return a?<section key={a.id}><RoleTag role={a.role}/><p>{a.text}</p><p className="deb-proof"><b>Dowód:</b> {a.source}</p></section>:<section key={i} className="deb-empty"><p>Argument {i+1}</p></section>;})}</div>
  <div className="deb-poster-other">
   <section className="deb-them"><p className="deb-mini">Druga strona mówi</p>{c?<><p>{c.text}</p><p className="deb-proof"><b>Dowód:</b> {c.source}</p></>:<p className="deb-empty">Kontrargument</p>}</section>
   <section className="deb-us"><p className="deb-mini">Nasza odpowiedź</p><p>{c&&Number.isInteger(p.reply)?c.replies[p.reply][0]:<span className="deb-empty">Odpowiedź</span>}</p></section>
  </div>
  <div className="deb-poster-rule"><p className="deb-mini">Nasza zasada</p><p>{(p.rule||'').trim()||<span className="deb-empty">Zasada, którą da się sprawdzić</span>}</p></div>
  {Number.isInteger(p.tip)&&<p className="deb-poster-tip"><Icon name="clock" size={18}/><b>Dbaj o siebie:</b> {tips[p.tip]}</p>}
  <footer>Autorzy: {(p.team||'').trim()||'…'} · Licencja: {p.license||posterLicenses[0]} · Dane „do weryfikacji” sprawdzamy u źródła przed publikacją.</footer>
 </article>;
}
async function copy(text,setMsg){try{await navigator.clipboard.writeText(text);setMsg('Skopiowano. Wklej w Wordzie: prawy przycisk → Zachowaj tylko tekst.');}catch{setMsg('Przeglądarka zablokowała schowek. Zaznacz tekst w podglądzie i naciśnij Ctrl+C.');}}
function Poster({data,value={},onChange}){
 const p=value.poster||{};const [role,setRole]=useState('all');const [msg,setMsg]=useState('');
 function save(patch){const next={...p,...patch};onChange({...value,poster:next,...posterResult({poster:next})});}
 const res=posterResult(value);const missing=posterMissing(p);const crit=p.last?posterCriteria(p):null;const stale=p.checkedSig&&p.checkedSig!==posterSig(p);const allOk=posterAllOk(p);
 const args=p.args||[];const counter=byId(p.counter);
 const shown=bank.filter(b=>role==='all'||b.role===role||(role==='work'&&(b.role==='employer'||b.role==='parent')));
 const replies=counter?orderOptions(optionKey('debateLab',`reply:${counter.id}`,counter.replies.map(r=>r[0])),counter.replies):[];
 const word=data.word;
 return <div className="deb-sim">
  <Top tag="Kreator stanowiska" note="symulacja — argumenty i źródła do weryfikacji przed publikacją"><span>Kryteria: <b>{fmt(posterScore(p))}</b>/{POSTER_MAX}</span><span>{res.done?'Wydane ✓':'Nie wydane'}</span></Top>
  <p className="deb-topic"><Icon name="board" size={20}/><b>Temat debaty:</b> {TOPIC}</p>
  <section className="deb-step" aria-labelledby="deb-s1"><h3 id="deb-s1"><span>1</span>Role: każdy czyta argumenty swojej perspektywy</h3>
   <div className="deb-role-tabs" role="group" aria-label="Pokaż argumenty roli">{[['all','Wszystkie'],['student','Uczeń'],['teacher','Nauczyciel'],['work','Pracodawca lub rodzic']].map(([id,label])=><button key={id} aria-pressed={role===id} className={role===id?'current':''} onClick={()=>setRole(id)}>{label}</button>)}</div>
   <p className="muted small">Minuta na rolę: przedstawcie trójce najmocniejszy argument z dowodem. Potem wybierzcie dwa argumenty dla Waszej tezy i jeden — najmocniejszy — drugiej strony.</p>
   <div className="deb-bank">{shown.map(b=>{const isArg=args.includes(b.id),isCounter=p.counter===b.id;return <div key={b.id} className={`deb-card ${isArg?'arg':''} ${isCounter?'counter':''}`}>
    <RoleTag role={b.role}/><p>{b.text}</p><p className="deb-proof"><b>Dowód:</b> {b.source}</p>
    <div className="deb-card-actions"><button className={`deb-pick ${isArg?'picked':''}`} aria-pressed={isArg} disabled={isCounter||(!isArg&&args.length>=2)} onClick={()=>save(toggleArg(p,b.id))}>{isArg&&<Icon name="check" size={15}/>}Nasz argument</button><button className={`deb-pick ${isCounter?'picked':''}`} aria-pressed={isCounter} disabled={isArg} onClick={()=>save(setCounter(p,isCounter?undefined:b.id))}>{isCounter&&<Icon name="check" size={15}/>}Druga strona</button></div>
   </div>;})}</div>
   <p className="small deb-count">Wybrane argumenty: {args.length}/2 · kontrargument: {counter?'wybrany':'brak'}</p>
  </section>
  <section className="deb-step" aria-labelledby="deb-s2"><h3 id="deb-s2"><span>2</span>Teza i odpowiedź drugiej stronie</h3>
   <fieldset className="deb-fs"><legend>Nasza teza</legend><div className="deb-stances">{stances.map(s=><button key={s.id} className={`deb-stance ${p.stance===s.id?'picked':''}`} aria-pressed={p.stance===s.id} onClick={()=>save({stance:s.id})}><b>{s.label}</b><small>{s.thesis}</small></button>)}</div></fieldset>
   {counter?<fieldset className="deb-fs"><legend>Nasza odpowiedź na: „{counter.text}”</legend><div className="deb-radios deb-col">{replies.map(([i,[t]])=><label key={t} data-option={i} className={p.reply===i?'picked':''}><input type="radio" name="deb-reply" checked={p.reply===i} onChange={()=>save({reply:i})}/>{t}</label>)}</div></fieldset>:<p className="muted small">Wybierzcie w kroku 1 argument drugiej strony, żeby na niego odpowiedzieć.</p>}
  </section>
  <section className="deb-step" aria-labelledby="deb-s3"><h3 id="deb-s3"><span>3</span>Tytuł, zasada i podpis</h3>
   <div className="deb-form">
    <label htmlFor="deb-title">Tytuł plakatu (min. 5 znaków)</label><input id="deb-title" maxLength={70} value={p.title||''} placeholder="np. AI? Tak — z głową i z przypisem" onChange={e=>save({title:e.target.value})}/>
    <label htmlFor="deb-rule">Nasza zasada: kto, co i kiedy robi (min. 15 znaków)</label><textarea id="deb-rule" rows={2} maxLength={220} value={p.rule||''} placeholder="np. Pracę z pomocą AI oznaczamy przypisem, a fakty sprawdzamy w dwóch źródłach." onChange={e=>save({rule:e.target.value})}/>
    <label htmlFor="deb-tip">Dbaj o siebie — wskazówka dobrostanu</label><select id="deb-tip" value={Number.isInteger(p.tip)?p.tip:''} onChange={e=>save({tip:e.target.value===''?undefined:Number(e.target.value)})}><option value="">Wybierz wskazówkę</option>{tips.map((t,i)=><option key={t} value={i}>{t}</option>)}</select>
    <div className="deb-form-row"><div><label htmlFor="deb-team">Autorzy</label><input id="deb-team" maxLength={60} value={p.team||''} placeholder="np. Ola, Kuba, Wiktor" onChange={e=>save({team:e.target.value})}/></div>
    <div><label htmlFor="deb-license">Licencja plakatu</label><select id="deb-license" value={p.license||posterLicenses[0]} onChange={e=>save({license:e.target.value})}>{posterLicenses.map(l=><option key={l}>{l}</option>)}</select></div></div>
   </div>
  </section>
  <section className="deb-step" aria-labelledby="deb-s4"><h3 id="deb-s4"><span>4</span>Sprawdźcie z kryteriami</h3>
   {missing.length>0&&<p className="small deb-missing">Do uzupełnienia: {missing.join(', ')}.</p>}
   <div className="inline-actions"><button className="btn" disabled={missing.length>0} onClick={()=>save(checkPoster(p))}>Sprawdź z kryteriami <Icon name="right" size={18}/></button>{stale&&<span className="deb-missing small" role="status">Zmieniliście argumenty lub odpowiedź — sprawdźcie ponownie.</span>}</div>
   {crit&&!stale&&<div role="status"><ul className="deb-criteria">{crit.map(c=><li key={c.id} className={c.ok?'ok':'no'}><Icon name={c.ok?'check':'close'} size={18}/><span><b>{c.label}:</b> {c.ok?(p.first?.[c.id]===1?'spełnione (+1 pkt)':'spełnione po poprawce (+0,5 pkt)'):c.hint}</span></li>)}</ul></div>}
  </section>
  <PosterView p={p}/>
  <section className="deb-step" aria-labelledby="deb-s5"><h3 id="deb-s5"><span>5</span>Wydanie</h3>
   <fieldset className="deb-fs"><legend>Jak wydajecie stanowisko?</legend><div className="deb-radios">{[['platform','Plakat na platformie'],['word','Stanowisko w Wordzie (1 strona)']].map(([id,label])=><label key={id} className={p.variant===id?'picked':''}><input type="radio" name="deb-variant" checked={p.variant===id} onChange={()=>save({variant:id})}/>{label}</label>)}</div></fieldset>
   <div className="inline-actions"><button className="btn secondary" disabled={!p.stance} onClick={()=>copy(posterText(p),setMsg)}><Icon name="file" size={18}/>Kopiuj tekst stanowiska</button>{msg&&<span className="small deb-msg" role="status">{msg}</span>}</div>
   {p.variant==='platform'&&<div className="inline-actions"><button className="btn" disabled={!allOk||p.published} onClick={()=>save({published:true})}><Icon name="trophy" size={18}/>{p.published?'Plakat wydany':'Wydaj plakat'}</button>{!allOk&&<span className="small muted">Najpierw wszystkie kryteria muszą być spełnione.</span>}</div>}
   {p.variant==='word'&&word&&<div className="deb-word">
    <div className="deb-download"><Icon name="doc" size={34}/><div><a className="btn" download href={(data.base||'')+word.file}>{word.label}<Icon name="download" size={18}/></a><p className="small">{word.description}</p></div></div>
    <WordSteps data={word.steps}/>
    <WordRubric data={word.rubric} value={p.rubric} onChange={r=>save({rubric:r})}/>
    {!allOk&&<p className="small deb-missing">Stanowisko zostanie wydane, gdy kryteria w kroku 4 będą spełnione, a samoocena pliku — uzupełniona.</p>}
   </div>}
   {res.done&&<Feedback ok>Wydane: {res.summary}. Pokażcie je trójce, która będzie Was oceniać.</Feedback>}
  </section>
 </div>;
}
function PosterWithBase(props){return <Poster {...props} data={{...props.data,base:props.base}}/>;}

// ---------- Ocena koleżeńska ----------
function Peer({data,value={},onChange,answers={}}){
 const poster=answers[data.posterId]?.poster;const res=peerResult(value);
 const save=next=>onChange({...next,...peerResult(next)});
 return <div className="deb-sim">
  <Top tag="Ocena koleżeńska" note="oceniacie pracę, nie osoby — bez punktów do karty wyniku"><span>Ocena: <b>{res.total}</b>/{PEER_MAX}</span><span>Kryteria: <b>{res.rated}</b>/{peerCriteria.length}</span></Top>
  {poster?.stance?<details className="deb-peer-poster" open><summary>Stanowisko ocenianej trójki{poster.variant==='word'?' (wydanie w Wordzie — zajrzyjcie też do pliku)':''}</summary><PosterView p={poster}/></details>:<p className="deb-instr">Na tym komputerze nie ma stanowiska z kreatora. Oceniajcie dokument w Wordzie albo to, co pokaże oceniana trójka.</p>}
  <div className="deb-peer-criteria">{peerCriteria.map(c=><fieldset key={c.id} className="deb-fs"><legend>{c.label}</legend><div className="deb-levels">{c.levels.map((l,n)=><label key={n} className={value.ratings?.[c.id]===n?'picked':''}><input type="radio" name={`deb-peer-${c.id}`} checked={value.ratings?.[c.id]===n} onChange={()=>save(ratePeer(value,c.id,n))}/><b>{n} pkt</b><span>{l}</span></label>)}</div></fieldset>)}</div>
  <div className="deb-form">
   <label htmlFor="deb-stars">Dwie gwiazdy: co jest mocne (konkretnie, min. 15 znaków)</label><textarea id="deb-stars" rows={2} maxLength={300} value={value.stars||''} placeholder="★ Każdy argument ma źródło. ★ Uczciwie pokazana druga strona." onChange={e=>save(setPeer(value,'stars',e.target.value))}/>
   <label htmlFor="deb-wish">Życzenie: jedna rzecz do poprawy (min. 10 znaków)</label><textarea id="deb-wish" rows={2} maxLength={300} value={value.wish||''} placeholder="Dopiszcie, kto pilnuje Waszej zasady." onChange={e=>save(setPeer(value,'wish',e.target.value))}/>
  </div>
  {res.done?<Feedback ok>Ocena zapisana na tym komputerze: {res.total}/{PEER_MAX} pkt. Wróćcie na swoje miejsca — oceniana trójka przeczyta ją i wprowadzi poprawkę.</Feedback>:<p className="muted small">Uzupełnijcie wszystkie kryteria, dwie gwiazdy i życzenie.</p>}
 </div>;
}

export default function DebateLab(props){
 const m=props.data.mode;
 return m==='evidence'?<Evidence {...props}/>:m==='poster'?<PosterWithBase {...props}/>:m==='peer'?<Peer {...props}/>:<Day {...props}/>;
}
