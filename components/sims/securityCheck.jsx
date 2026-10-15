import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {orderOptions,optionKey} from './optionOrder.js';
import './securityCheck.css';
import {MAX,ASSUMPTIONS,LEVELS,analyzePassword,samples,STRONGEST,checkPhrase,PHRASE_MIN_LEN,kanonQuiz,kanonDemo,answerQuiz,
 devices,rows,fineRows,allRows,optionOf,riskOf,riskLevel,resolved,setOption,auditResult,
 PLAN_SIZE,planItems,setPlan,planResult,secResult} from '../../content/sims/securityCheck.js';

const pts=n=>String(n).replace('.',',');
const titles={password:'Miernik hasła',audit:'Audyt: telefon, konta, laptop, router',plan:'Mój plan na dziś'};
function Msg({ok,children}){if(!children)return null;return <div className={`sec-msg ${ok?'is-ok':'is-retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;}

function Quiz({q,state={},onAnswer,options,correct,explain,hint,id,question}){
 const opts=options||q.options;const order=orderOptions(optionKey('securityCheck',id||q.id,opts),opts);
 return <fieldset className="sec-quiz"><legend>{question||q.question}</legend>
  <div className="sec-options">{order.map(([i,o],pos)=><button type="button" key={o} data-option={i} className={`choice ${state.picked===i?'selected':''}`} aria-pressed={state.picked===i} disabled={state.solved&&state.picked!==i} onClick={()=>onAnswer(i)}><span className="choice-letter">{String.fromCharCode(65+pos)}</span><span className="sec-opt">{o}</span></button>)}</div>
  {state.tries>0&&<Msg ok={state.solved}>{state.solved?<><b>{state.tries===1?'Dobrze — pełny punkt.':'Dobrze — za poprawkę połowa punktu.'}</b> {explain||q.explain}</>:<>Jeszcze nie. {hint||q.hint}</>}</Msg>}
 </fieldset>;
}

function Meter({a}){
 return <div className="sec-meter" aria-live="polite">
  <div className="sec-meter-bar" role="img" aria-label={`Siła: ${a.length?a.label:'brak hasła'}`}>{LEVELS.map((l,i)=><span key={l} className={a.length&&i<=a.level?`on l${a.level}`:''}/>)}</div>
  <div className="sec-meter-text"><b>{a.length?a.label:'Wpisz albo wstaw hasło'}</b>{a.length>0&&<span>Czas złamania w modelu: <b>{a.time}</b> · {a.length} zn.</span>}</div>
  {a.findings?.length>0&&<ul className="sec-findings">{a.findings.map(f=><li key={f}><Icon name="warning" size={16}/>{f}</li>)}</ul>}
 </div>;
}

function Password({st,set}){
 const [pw,setPw]=useState('');const [kan,setKan]=useState('Kocham12');
 const a=analyzePassword(pw);const k=kanonDemo(kan);const ph=st.phrase||{};
 function submitPhrase(){if(ph.ok)return;const r=checkPhrase(pw);const tries=(ph.tries||0)+1;set({...st,phrase:{ok:r.ok,tries,text:r.text,length:r.a.length,time:r.a.time,label:r.a.label}});}
 return <div className="sec-panel">
  <p className="sec-warn"><Icon name="lock" size={22}/><span><b>Nie wpisuj tu prawdziwego hasła.</b> Testuj przykłady albo frazę wymyśloną tylko na tę lekcję. Platforma nie zapisuje tego, co wpisujesz — zapamiętuje tylko wynik oceny.</span></p>
  <div className="sec-tester">
   <label className="sec-field" htmlFor="sec-pw"><span>Hasło do sprawdzenia</span><input id="sec-pw" type="text" value={pw} onChange={e=>setPw(e.target.value)} autoComplete="off" spellCheck={false} autoCapitalize="off" maxLength={64} placeholder="np. trzy-słowa-bez-sensu"/></label>
   <div className="sec-samples" role="group" aria-label="Wstaw przykładowe hasło">{samples.map(s=><button type="button" key={s} className={pw===s?'is-on':''} aria-pressed={pw===s} onClick={()=>setPw(s)}><code>{s}</code></button>)}</div>
   <Meter a={a}/>
   <details className="sec-assume"><summary><Icon name="settings" size={18}/>Założenia miernika (kliknij)</summary><ul>{ASSUMPTIONS.map(x=><li key={x}>{x}</li>)}</ul></details>
  </div>
  <Quiz q={{id:'strongest',question:'Sprawdź w mierniku wszystkie 5 przykładów. Które hasło jest najmocniejsze?',options:samples}} state={st.strongest} onAnswer={i=>set({...st,strongest:answerQuiz(st.strongest,i,STRONGEST)})}
   explain="Cztery zwykłe słowa (24 znaki) biją 8 losowych znaków. Długość działa mocniej niż złożoność, a frazę łatwiej zapamiętać. Zamiany typu @ za a i wzory z klawiatury atakujący sprawdza od razu." hint="Wstaw każde hasło do miernika i porównaj czas złamania, a nie to, jak „dziwnie” wygląda."/>
  <section className="sec-task"><h4><Icon name="lock" size={20}/>Twoja fraza treningowa</h4>
   <p>Wpisz w polu powyżej własną frazę: <b>min. {PHRASE_MIN_LEN} znaków</b>, poziom co najmniej <b>„mocne”</b>. Przepis: 4 słowa, które do siebie nie pasują (np. przedmiot, kolor, zwierzę, czynność), oddzielone myślnikiem. Nie używaj jej nigdzie — to trening.</p>
   <div className="inline-actions"><button type="button" className="btn" disabled={ph.ok||!pw} onClick={submitPhrase}>Zatwierdź frazę<Icon name="check" size={18}/></button><span className="small muted">Próby: {ph.tries||0}</span></div>
   {ph.text&&<Msg ok={ph.ok}>{ph.text}{ph.ok?` (${ph.tries===1?'1 pkt':'0,5 pkt za poprawkę'})`:''}</Msg>}
  </section>
  <section className="sec-task sec-kanon"><h4><Icon name="search" size={20}/>Jak sprawdzić, czy hasło wyciekło — i go nie zdradzić?</h4>
   <div className="sec-samples" role="group" aria-label="Hasło do sprawdzenia w wyciekach (przykład)">{samples.slice(0,3).map(s=><button type="button" key={s} aria-pressed={kan===s} className={kan===s?'is-on':''} onClick={()=>setKan(s)}><code>{s}</code></button>)}</div>
   <ol className="sec-kanon-steps">
    <li><b>Twój komputer liczy skrót (SHA-1) hasła.</b> Z hasła powstaje ciąg 40 znaków. Ze skrótu nie da się odtworzyć hasła.<code className="sec-hash"><mark>{k.prefix}</mark>{k.suffix}</code></li>
    <li><b>Do serwisu wychodzi tylko 5 pierwszych znaków:</b> <code><mark>{k.prefix}</mark></code>. Taki początek ma setki różnych haseł.</li>
    <li><b>Serwis odsyła wszystkie znane końcówki z tym początkiem</b> (tu kilka z kilkuset, przykład):<ul className="sec-suffixes">{k.list.map((s,i)=><li key={s} className={i===k.matchIndex?'is-match':''}><code>{s}</code>{i===k.matchIndex&&<b> ← pasuje</b>}</li>)}</ul></li>
    <li><b>Twój komputer sam porównuje.</b> Końcówka pasuje — to hasło jest w wyciekach. Serwis nie wie, które hasło sprawdzałeś.</li>
   </ol>
   <Quiz q={kanonQuiz} state={st.kanon} onAnswer={i=>set({...st,kanon:answerQuiz(st.kanon,i,kanonQuiz.correct)})}/>
  </section>
 </div>;
}

const verdictLabel={best:['Naprawione','check'],ok:['Naprawione — z uwagą','check'],weak:['Lepiej, ale luka zostaje','warning'],bad:['Luka','warning'],trap:['Pułapka!','warning'],fine:['W porządku','check']};
function Audit({st,set}){
 const [tab,setTab]=useState('phone');const sel=st.sel||{};const r=auditResult(st);const risk=riskOf(sel);
 const devRows=d=>allRows.filter(x=>x.device===d);
 const fixedIn=d=>rows.filter(x=>x.device===d&&resolved(x,sel[x.id])).length;
 const choose=(row,o)=>{if((sel[row.id]||row.options[0].id)===o)return;set(setOption(st,row.id,o));};
 return <div className="sec-panel">
  <div className="sec-risk" aria-live="polite">
   <div className="sec-risk-top"><b>Poziom ryzyka: {risk}/100 — {riskLevel(risk)}</b><span>Naprawione luki: {r.fixed}/{rows.length}</span></div>
   <div className="sec-risk-bar" role="img" aria-label={`Ryzyko ${risk} na 100, ${riskLevel(risk)}`}><span className={`r-${riskLevel(risk)==='wysokie'?'hi':riskLevel(risk)==='średnie'?'mid':'lo'}`} style={{width:`${Math.max(2,risk)}%`}}/></div>
   <p className="small">Kuba ma 16 lat. Przejrzyj jego ustawienia i wybierz najlepszą opcję tam, gdzie widzisz lukę. Uwaga: nie każde ustawienie jest dziurą, a niektóre „poprawki” to pułapki. Punkt za lukę naprawioną pierwszym wyborem, pół — po poprawce.</p>
  </div>
  <div className="sec-tabs" role="group" aria-label="Urządzenia i konta Kuby">{devices.map(d=>{const n=rows.filter(x=>x.device===d.id).length;return <button type="button" key={d.id} aria-pressed={tab===d.id} onClick={()=>setTab(d.id)}><Icon name={d.icon} size={20}/><span>{d.name}</span><em>{fixedIn(d.id)}/{n}</em></button>;})}</div>
  {devices.filter(d=>d.id===tab).map(d=><div key={d.id} className="sec-device">
   <p className="sec-device-note"><Icon name={d.icon} size={18}/>{d.name} · {d.note} <span className="sec-simtag">symulacja, dane fikcyjne</span></p>
   {devRows(d.id).map(row=>{const cur=optionOf(row,sel[row.id]);const touched=sel[row.id]!==undefined&&sel[row.id]!==row.options[0].id||st.changes?.[row.id]>0;const isFine=fineRows.includes(row);const v=verdictLabel[isFine&&cur.verdict!=='trap'?'fine':cur.verdict];
    return <fieldset key={row.id} className={`sec-row ${touched?`v-${cur.verdict}`:''}`}><legend>{row.label}</legend>
     <div className="sec-choices">{orderOptions(optionKey('securityCheck',row.id,row.options.map(o=>o.text)),row.options).map(([i,o])=><label key={o.id} data-option={i} className={cur.id===o.id?'is-on':''}><input type="radio" name={`sec-${row.id}`} checked={cur.id===o.id} onChange={()=>choose(row,o.id)}/><span>{o.text}{i===0&&<small> (teraz)</small>}</span></label>)}</div>
     {touched&&<p className={`sec-verdict v-${cur.verdict}`} role="status"><Icon name={v[1]} size={18}/><span><b>{v[0]}</b> {cur.fb}</span></p>}
    </fieldset>;})}
  </div>)}
  {r.done&&<Msg ok>Wszystkie luki naprawione. Ryzyko spadło ze 100 do {risk}/100. Wynik: {pts(r.score)}/{MAX.audit} pkt.</Msg>}
 </div>;
}

function Plan({value,st,set}){
 const r=planResult(st);const marks=st.marks||{};const audit=auditResult(value.audit);const today=r.today;const doneItems=st.doneItems||{};
 return <div className="sec-panel">
  <p className="small">Wybierz <b>{PLAN_SIZE} rzeczy</b>, które dziś włączysz albo sprawdzisz na swoim telefonie, koncie lub komputerze (np. na przerwie albo po lekcjach). To, co już masz, oznacz „Już mam”. Bez punktów — to Twoja lista.</p>
  <p className="sec-count" aria-live="polite">Na dziś: <b>{today.length}/{r.need}</b> · już mam: {r.have.length}</p>
  <ul className="sec-plan-list">{planItems.map(it=>{const m=marks[it.id];return <li key={it.id} className={m?`is-${m}`:''}>
   <div><b>{it.text}</b><small>{it.where}</small></div>
   <div className="sec-plan-btns" role="group" aria-label={it.text}>
    <button type="button" aria-pressed={m==='today'} onClick={()=>set(setPlan(st,it.id,m==='today'?null:'today'))}><Icon name="right" size={16}/>Dziś</button>
    <button type="button" aria-pressed={m==='have'} onClick={()=>set(setPlan(st,it.id,m==='have'?null:'have'))}><Icon name="check" size={16}/>Już mam</button>
   </div></li>;})}</ul>
  {st.msg&&<Msg ok={false}>{st.msg}</Msg>}
  {r.done&&<article className="sec-plan-card" aria-label="Mój plan bezpieczeństwa na dziś">
   <header><Icon name="shield" size={28}/><div><small>Mój plan bezpieczeństwa · samoocena, bez punktów</small><h4>{PLAN_SIZE} rzeczy, które dziś włączę lub sprawdzę</h4></div></header>
   <ol>{today.map(it=><li key={it.id}><label><input type="checkbox" checked={!!doneItems[it.id]} onChange={e=>set({...st,doneItems:{...doneItems,[it.id]:e.target.checked}})}/><span>{it.text}<small>{it.where}</small></span></label></li>)}</ol>
   <p className="small">{audit.summary||'Audyt Kuby: jeszcze niewykonany.'} {r.have.length>0&&`· Już mam: ${r.have.length}.`}</p>
  </article>}
 </div>;
}

export default function SecurityCheck({data,value,onChange}){
 const v=value||{};const mode=data.mode||'password';const r=secResult(v);const mine=r[mode];const st=v[mode]||{};
 function save(part){const next={...v,[mode]:part};const res=secResult(next);onChange({...next,modes:Object.fromEntries(Object.entries(res).map(([k,x])=>[k,{done:x.done,score:x.score,max:x.max,summary:x.summary}]))});}
 return <section className="sec" aria-label={`Bezpiecznik: ${titles[mode]}`}>
  <header className="sec-bar"><Icon name="shield" size={20}/><strong>Bezpiecznik · {titles[mode]}</strong><span className="sec-sim">symulacja</span>{MAX[mode]>0&&<span className="sec-score" aria-live="polite">{pts(mine.score)}/{MAX[mode]} pkt</span>}</header>
  {mode==='password'&&<Password st={st} set={save}/>}
  {mode==='audit'&&<Audit st={st} set={save}/>}
  {mode==='plan'&&<Plan value={v} st={st} set={save}/>}
 </section>;
}
