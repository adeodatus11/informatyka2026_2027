import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {profile,loginMethods,makeCode,checkCode,phishing,classify,chooseAction,loginResult,modules,moduleById,checkStep,attempt,moduleScore,moduleDone,expertResult} from '../../content/sims/eServices.js';
import './eServices.css';

const fmt=n=>String(n).replace('.',',');
function Lock({open}){return <span className={`es-lock ${open?'open':''}`} aria-hidden="true"/>;}
function Browser({url,secure=true,children,label}){return <div className="es-browser" role="group" aria-label={label||'Okno przeglądarki (symulacja)'}><div className="es-bar"><span className="es-dots" aria-hidden="true"><i/><i/><i/></span><span className={`es-address ${secure?'':'insecure'}`}>{secure?<Lock/>:<span className="es-insecure">Niezabezpieczona</span>}<span className="es-url">{url}</span></span></div><div className="es-page">{children}</div></div>;}
function Feedback({ok,children}){return <div className={`es-feedback ${ok?'ok':'retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;}
function Phone({title,children}){return <div className="es-phone" aria-label={title}><div className="es-phone-notch" aria-hidden="true"/>{children}</div>;}

// ---------------- Logowanie + phishing ----------------
function Login({value={},onChange}){
 const [typed,setTyped]=useState('');const [err,setErr]=useState('');
 const [idx,setIdx]=useState(()=>{const i=phishing.findIndex(p=>!value.phishing?.[p.id]?.act?.ok);return i<0?0:i;});
 const res=loginResult(value);
 function save(next){onChange({...next,...loginResult(next)});}
 function pickMethod(id){save({...value,method:id,stage:'form',code:value.code||makeCode()});setErr('');}
 function verify(e){e.preventDefault();if(checkCode(value.code,typed)){save({...value,loggedIn:true,stage:'done'});setErr('');}else setErr('Kod się nie zgadza. Przepisz 6 cyfr z SMS-a w telefonie (bez spacji).');}
 const method=loginMethods.find(m=>m.id===value.method);
 const ph=value.phishing||{};const item=phishing[idx],st=ph[item.id]||{};
 function savePh(next){save({...value,phishing:{...ph,[item.id]:next}});}
 return <div className="es-sim">
  <div className="es-top"><span className="es-brand"><Icon name="idcard" size={22}/>e-Sprawy <small>(symulacja)</small></span><span className="es-score" aria-live="polite">Punkty: <b>{fmt(res.score)}</b>/{res.max}</span></div>
  <section className="es-block" aria-labelledby="es-login-h">
   <h3 id="es-login-h">1. Zaloguj się z kodem SMS {value.loggedIn&&<span className="es-chip ok">+1 pkt</span>}</h3>
   <div className="es-login-grid">
    <Browser url="https://wezel-logowania.gov.pl/e-sprawy" label="Węzeł logowania (symulacja)">
     <p className="es-page-title">Węzeł logowania <small>(symulacja)</small></p>
     {!value.loggedIn&&!value.method&&<><p>Wybierz sposób logowania:</p><div className="es-methods">{loginMethods.map(m=><button key={m.id} className="btn secondary" onClick={()=>pickMethod(m.id)}>{m.label}</button>)}</div></>}
     {!value.loggedIn&&method&&<>
      <p className="small muted">Metoda: <b>{method.label}</b>. {method.text} <button className="text-button" onClick={()=>save({...value,method:null,stage:null})}>zmień</button></p>
      {value.stage==='form'&&<div className="es-form">{method.id==='password'&&<><label>Login<input readOnly value="kuba.przykladowy"/></label><label>Hasło<input type="password" readOnly value="nieprawdziwe-haslo"/></label></>}{method.id==='bank'&&<p>Przekierowanie do: <b>Bank Przykładowy (symulacja)</b>. Logujesz się tam jak zwykle.</p>}{method.id==='app'&&<p>Wyślemy prośbę o potwierdzenie do aplikacji w Twoim telefonie.</p>}<button className="btn" onClick={()=>save({...value,stage:'sms'})}>{method.id==='app'?'Wyślij powiadomienie':'Dalej'}<Icon name="right" size={18}/></button></div>}
      {value.stage==='sms'&&<form className="es-form" onSubmit={verify}><label htmlFor="es-sms-code">Kod z SMS-a (6 cyfr)</label><input id="es-sms-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={typed} onChange={e=>{setTyped(e.target.value);setErr('');}}/><button className="btn" type="submit">Potwierdź</button>{err&&<Feedback ok={false}>{err}</Feedback>}</form>}
     </>}
     {value.loggedIn&&<Feedback ok>Zalogowano jako <b>{profile.name}</b>. Dwa kroki: coś, co <b>wiesz</b> (hasło/bank) + coś, co <b>masz</b> (telefon z kodem). Ukradzione hasło samo nie wystarczy.</Feedback>}
    </Browser>
    {value.stage==='sms'&&!value.loggedIn&&<Phone title="Telefon z SMS-em"><div className="es-sms"><b>Węzeł logowania</b><p>Kod logowania do e-Sprawy: <strong className="es-code">{value.code}</strong>. Nikomu go nie podawaj — także „konsultantowi” przez telefon.</p></div></Phone>}
   </div>
  </section>
  <section className="es-block" aria-labelledby="es-ph-h">
   <h3 id="es-ph-h">2. Prawdziwa strona czy pułapka?</h3>
   <nav className="es-dots-nav" aria-label="Sytuacje">{phishing.map((p,i)=>{const s=ph[p.id];const ok=s?.act?.ok;return <button key={p.id} className={`${i===idx?'current':''} ${ok?'done':''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)}>{ok?<Icon name="check" size={16}/>:null}Sytuacja {i+1}</button>;})}</nav>
   {item.kind==='browser'?<Browser url={item.url} secure={item.lock} label={`Sytuacja ${idx+1}: strona w przeglądarce`}><p className="es-page-title">{item.title}</p><p>{item.body}</p><div className="es-fake-form" aria-hidden="true"><span>Login</span><span>Hasło</span></div></Browser>
    :<Phone title={`Sytuacja ${idx+1}: SMS`}><div className="es-sms"><b>{item.from}</b><p>{item.text}</p></div></Phone>}
   <p className="small muted">Wskazówka: czytaj adres od końca do pierwszego „/”. Liczy się to, co stoi tuż przed „/”.</p>
   <div className="es-choice-row" role="group" aria-label="Ocena">{[[true,'Bezpieczna'],[false,'Phishing (pułapka)']].map(([safe,label])=><button key={label} className={`es-judge ${safe?'safe':'bad'} ${st.cls?.choice===safe?'picked':''}`} aria-pressed={st.cls?.choice===safe} disabled={st.cls?.ok&&st.cls.choice!==safe} onClick={()=>savePh(classify(item,st,safe))}>{safe?<Icon name="shield" size={20}/>:<Icon name="warning" size={20}/>}{label}</button>)}</div>
   {st.cls&&<Feedback ok={st.cls.ok}>{st.cls.ok?<><b>{st.cls.tries===1?'Dobrze! +1 pkt.':'Teraz dobrze: +0,5 pkt.'}</b> {item.explain}</>:<>Przyjrzyj się jeszcze raz: końcówce domeny, znakom (s czy 5? kropka czy myślnik?), kłódce i presji czasu.</>}</Feedback>}
   {st.cls?.ok&&<fieldset className="es-fieldset"><legend>Co robisz?</legend><div className="choices">{item.actions.map((a,i)=><button key={a} className={`choice ${st.act?.choice===i?'selected':''}`} aria-pressed={st.act?.choice===i} disabled={st.act?.ok&&st.act.choice!==i} onClick={()=>savePh(chooseAction(item,st,i))}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{a}</span></button>)}</div>
    {st.act&&<Feedback ok={st.act.ok}>{st.act.ok?(item.actionWhy[item.action]||'Dokładnie tak. SMS-y przekazujesz na 8080, podejrzane strony zgłaszasz na incydent.cert.pl.'):item.actionWhy[st.act.choice]}</Feedback>}
    {st.act?.ok&&idx<phishing.length-1&&<button className="btn" onClick={()=>setIdx(idx+1)}>Następna sytuacja <Icon name="right" size={18}/></button>}
   </fieldset>}
  </section>
  {res.done&&<div className="es-final" role="status"><Icon name="trophy" size={26}/><p><b>Wynik: {fmt(res.score)}/5.</b> {res.summary}.</p></div>}
 </div>;
}

// ---------------- Moduły eksperta ----------------
function StepChoice({step,st,onTry}){return <><div className="choices">{step.options.map((o,i)=><button key={o} className={`choice ${st.choice===i?'selected':''}`} aria-pressed={st.choice===i} disabled={st.ok&&st.choice!==i} onClick={()=>onTry(i===step.correct,{choice:i})}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{o}</span></button>)}</div>{st.choice!==undefined&&!st.ok&&<Feedback ok={false}>{step.why[st.choice]}</Feedback>}</>;}
function StepInput({step,st,onTry,label,inputMode='numeric'}){const [v,setV]=useState('');return <form className="es-form inline" onSubmit={e=>{e.preventDefault();onTry(checkStep(step,v),{last:v});}}><label htmlFor={`es-${step.id}`}>{label}</label><div className="es-input-row"><input id={`es-${step.id}`} inputMode={inputMode} autoComplete="off" value={v} onChange={e=>setV(e.target.value)} disabled={st.ok}/>{step.unit&&<span>{step.unit}</span>}<button className="btn" type="submit" disabled={st.ok||!v.trim()}>Sprawdź</button></div>{st.tries>0&&!st.ok&&<Feedback ok={false}>Jeszcze nie. {step.hint}</Feedback>}</form>;}

function Health({mod,ms,tryStep,cur}){
 const [openMsg,setOpenMsg]=useState('rx');const [ph,setPh]=useState({pesel:'',code:''});const [ref,setRef]=useState({code:'',slot:''});
 const msg=mod.inbox.find(m=>m.id===openMsg);
 const s1=mod.steps[1],s3=mod.steps[3];
 return <div className="es-module-body">
  <Browser url="https://konto-zdrowia.gov.pl/skrzynka" label="Konto Zdrowia (symulacja)">
   <p className="es-page-title">Konto Zdrowia <small>(symulacja, podobne do IKP)</small></p>
   <div className="es-inbox"><ul>{mod.inbox.map(m=><li key={m.id}><button className={openMsg===m.id?'current':''} aria-pressed={openMsg===m.id} onClick={()=>setOpenMsg(m.id)}><b>{m.subject}</b><small>{m.from} · {m.date}</small></button></li>)}</ul>
    <article className="es-message" aria-live="polite"><h4>{msg.subject}</h4><p>{msg.body}</p><dl>{msg.fields.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></article></div>
  </Browser>
  {cur===1&&<Browser url="https://apteka-przyklad.pl/realizacja" label="Apteka (symulacja)"><p className="es-page-title">Apteka „Pod Przykładem” <small>(symulacja)</small></p><form className="es-form" onSubmit={e=>{e.preventDefault();tryStep(s1,checkStep(s1,ph));}}><label>PESEL pacjenta<input inputMode="numeric" autoComplete="off" value={ph.pesel} onChange={e=>setPh({...ph,pesel:e.target.value})}/></label><label>Kod recepty (4 cyfry)<input inputMode="numeric" autoComplete="off" value={ph.code} onChange={e=>setPh({...ph,code:e.target.value})}/></label><button className="btn" type="submit">Zrealizuj receptę</button>{ms[s1.id]?.tries>0&&!ms[s1.id]?.ok&&<Feedback ok={false}>Farmaceutka: „System nie znajduje recepty”. {s1.hint}</Feedback>}</form></Browser>}
  {cur===3&&<Browser url="https://rejestracja-przychodni.pl/ortopeda" label="Rejestracja (symulacja)"><p className="es-page-title">Rejestracja do poradni ortopedycznej <small>(symulacja)</small></p><form className="es-form" onSubmit={e=>{e.preventDefault();tryStep(s3,checkStep(s3,ref));}}><label>Kod e-skierowania (4 cyfry)<input inputMode="numeric" autoComplete="off" value={ref.code} onChange={e=>setRef({...ref,code:e.target.value})}/></label><fieldset className="es-fieldset"><legend>Termin</legend>{['wt 14.10, 15:30','czw 23.10, 16:00','pn 3.11, 15:00'].map(t=><label className="es-radio" key={t}><input type="radio" name="slot" checked={ref.slot===t} onChange={()=>setRef({...ref,slot:t})}/>{t}</label>)}</fieldset><p className="small muted">PESEL uzupełniony z profilu: {profile.pesel} (przykład)</p><button className="btn" type="submit">Zapisz się</button>{ms[s3.id]?.tries>0&&!ms[s3.id]?.ok&&<Feedback ok={false}>{!ref.slot?'Wybierz termin. ':''}{s3.hint}</Feedback>}</form></Browser>}
 </div>;
}
function Travel({mod,ms}){const d=ms.discount?.ok?37:null;return <div className="es-module-body"><Browser url="https://kolejsim.pl/bilet" label="KolejSim (symulacja)"><p className="es-page-title">KolejSim <small>(fikcyjny przewoźnik, symulacja)</small></p><div className="es-ticket"><div><small>Trasa</small><b>{mod.trip.from} → {mod.trip.to}</b></div><div><small>Bilet</small><b>jednorazowy, 2 klasa</b></div><div><small>Normalny</small><b>42,00 zł</b></div><div><small>Ulga</small><b>{d?`${d}% (uczeń)`:'—'}</b></div><div><small>Dokument</small><b>{ms.doc?.ok?'mLegitymacja / legitymacja':'—'}</b></div><div><small>Do zapłaty</small><b>{ms.price?.ok?'26,46 zł':'?'}</b></div></div></Browser></div>;}
function Money({mod,ms,cur,tryStep}){const [relief,setRelief]=useState(!!ms.relief?.ok);const on=ms.relief?.ok;const s0=mod.steps[0];return <div className="es-module-body"><Browser url="https://e-urzad-skarbowy.gov.pl/zeznanie" label="e-Urząd Skarbowy (symulacja)"><p className="es-page-title">Twoje zeznanie za 2026 r. <small>(symulacja, gotowe od 15 lutego)</small></p><table className="es-pit"><tbody><tr><th scope="row">Przychód (umowa zlecenie, z PIT-11)</th><td>{mod.pit.income.toLocaleString('pl-PL')} zł</td></tr><tr><th scope="row">Koszty uzyskania przychodu (20%)</th><td>{mod.pit.costs} zł</td></tr><tr><th scope="row">Dochód</th><td>{on?'0 zł (zwolniony)':`${mod.pit.income-mod.pit.costs} zł`}</td></tr><tr><th scope="row">Zaliczki pobrane przez płatnika</th><td>{mod.pit.tax} zł</td></tr><tr><th scope="row">Podatek należny</th><td>{on?'0 zł':`${mod.pit.tax} zł`}</td></tr><tr className="es-sum"><th scope="row">Nadpłata (zwrot)</th><td>{on?`${mod.pit.tax} zł`:'0 zł'}</td></tr></tbody></table>
  {cur===0&&<div className="es-form"><label className="es-check"><input type="checkbox" checked={relief} onChange={e=>setRelief(e.target.checked)}/>Ulga dla młodych (PIT-0) — mam mniej niż 26 lat</label><button className="btn" onClick={()=>tryStep(s0,checkStep(s0,relief))}>Przelicz</button>{ms.relief?.tries>0&&!ms.relief?.ok&&<Feedback ok={false}>Bez ulgi państwo zatrzyma Twoje 230 zł. {s0.hint}</Feedback>}</div>}
 </Browser></div>;}

function Module({mod,ms,save,onBack}){
 const cur=mod.steps.findIndex(s=>!ms[s.id]?.ok);const done=cur<0;
 function tryStep(step,ok,extra={}){save({...ms,[step.id]:{...attempt(ms[step.id],ok),...extra}});}
 const step=done?null:mod.steps[cur];
 return <div className="es-module">
  <div className="es-module-head"><span className="es-letter">{mod.letter}</span><div><h3>{mod.title}</h3><p className="muted small">{mod.lead}</p></div><span className="es-chip">Moduł: {fmt(moduleScore(ms,mod))}/4 pkt</span></div>
  <p className="es-profile"><Icon name="idcard" size={18}/><span>Profil: <b>{profile.name}</b>, ur. {profile.born} ({profile.age} lat) · PESEL <b>{profile.pesel}</b></span><span className="es-example">fikcyjny, przykład</span></p>
  <ol className="es-steps">{mod.steps.map((s,i)=><li key={s.id} className={ms[s.id]?.ok?'ok':i===cur?'current':'todo'}><span className="es-step-num">{ms[s.id]?.ok?<Icon name="check" size={16}/>:i+1}</span><span>{s.title}{ms[s.id]?.ok&&<small> · +{fmt(ms[s.id].tries===1?1:0.5)} pkt</small>}</span></li>)}</ol>
  {cur>0&&!done&&<Feedback ok>Krok {cur}: zaliczony (+{fmt(ms[mod.steps[cur-1].id].tries===1?1:0.5)} pkt). Działaj dalej!</Feedback>}
  {step&&<section className="es-task" aria-labelledby={`es-task-${step.id}`}><h4 id={`es-task-${step.id}`}>Krok {cur+1}: {step.title}</h4><p>{step.task}</p>
   {step.kind==='choice'&&<StepChoice step={step} st={ms[step.id]||{}} onTry={(ok,extra)=>tryStep(step,ok,extra)}/>}
   {(step.kind==='code'||step.kind==='number')&&<StepInput key={step.id} step={step} st={ms[step.id]||{}} onTry={(ok,extra)=>tryStep(step,ok,extra)} label={step.kind==='code'?'Kod (4 cyfry)':'Twoja odpowiedź'} inputMode={step.kind==='number'?'decimal':'numeric'}/>}
   {(step.kind==='pharmacy'||step.kind==='referral'||step.kind==='toggle')&&<p className="small muted">Uzupełnij formularz w oknie poniżej.</p>}
  </section>}
  {mod.id==='health'&&<Health mod={mod} ms={ms} tryStep={tryStep} cur={cur}/>}
  {mod.id==='travel'&&<Travel mod={mod} ms={ms}/>}
  {mod.id==='money'&&<Money mod={mod} ms={ms} cur={cur} tryStep={tryStep}/>}
  {done&&<section className="es-expert" aria-labelledby={`es-exp-${mod.id}`}><h4 id={`es-exp-${mod.id}`}><Icon name="trophy" size={22}/>Karta eksperta: {mod.title}</h4><p className="small">Te 3 zdania przekażesz swojej trójce. Zapamiętaj je albo przepisz.</p><ol>{mod.expert.map(x=><li key={x}>{x}</li>)}</ol><button className="btn secondary" onClick={onBack}><Icon name="left" size={18}/>Wróć do wyboru modułów</button></section>}
 </div>;
}

function Expert({value={},onChange}){
 const [active,setActive]=useState(value.active||null);
 const mods=value.modules||{};const res=expertResult(value);
 function save(modId,ms){const all={...mods,[modId]:ms};onChange({...value,active:modId,modules:all,...expertResult({modules:all})});}
 const mod=active&&moduleById(active);
 return <div className="es-sim">
  <div className="es-top"><span className="es-brand"><Icon name="idcard" size={22}/>e-Sprawy <small>(symulacja)</small></span><span className="es-score" aria-live="polite">Najlepszy moduł: <b>{fmt(res.score)}</b>/4</span></div>
  {!mod?<><p className="es-jigsaw"><Icon name="group" size={22}/><span><b>W trójce każdy bierze inny moduł</b> (A, B albo C). W parze jedna osoba robi dwa. Pracujesz sam? Zrób wszystkie trzy — liczy się najlepszy.</span></p>
   <div className="es-module-grid">{modules.map(m=>{const ms=mods[m.id]||{};const d=moduleDone(ms,m);return <button key={m.id} className={`es-module-card ${d?'done':''}`} onClick={()=>setActive(m.id)}><span className="es-letter">{m.letter}</span><b>{m.title}</b><small>{m.lead}</small><span className="es-chip">{d?`Ukończony · ${fmt(moduleScore(ms,m))}/4`:Object.keys(ms).length?`W trakcie · ${fmt(moduleScore(ms,m))}/4`:'4 kroki · ok. 8 min'}</span></button>;})}</div></>
  :<><button className="text-button" onClick={()=>setActive(null)}><Icon name="left" size={18}/>Wszystkie moduły</button><Module key={mod.id} mod={mod} ms={mods[mod.id]||{}} save={ms=>save(mod.id,ms)} onBack={()=>setActive(null)}/></>}
 </div>;
}

export default function EServices(props){return props.data.mode==='expert'?<Expert {...props}/>:<Login {...props}/>;}
