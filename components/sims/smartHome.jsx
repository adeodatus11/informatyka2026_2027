import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import './smartHome.css';
import {orderOptions,optionKey} from './optionOrder.js';
import {PRICE,TARGET_SAVINGS,devices,measures,deviceKwh,formula,energyPlan,routerQuestion,checkRouterCost,fmt,zl,
 fixes,traps,iotDevices,securityAudit,triggers,conditions,actions,classifyRule,ruleText,sameRule,MAX_RULES,rulesScore,rulesWord,smartHomeResult} from '../../content/sims/smartHome.js';

const pts=n=>String(n).replace('.',',');
function Msg({m}){if(!m)return null;return <div className={`sh-msg ${m.ok?'is-ok':'is-retry'}`} role="status"><Icon name={m.ok?'check':'warning'} size={20}/><div>{m.text}</div></div>;}
const kindLabel={energy:['Energia','energy'],safety:['Bezpieczeństwo','shield'],comfort:['Wygoda','house'],weak:['Bez jasnego sensu','circle'],risky:['RYZYKO','warning']};
const roles=[['all','Wszystkie (solo)'],['energy','Energetyk'],['security','Strażnik'],['auto','Automatyk']];
const payText=p=>p.cost===0?(p.savings>0?'od razu (koszt 0 zł)':'—'):p.payback===Infinity?'nigdy':p.payback<1?'poniżej miesiąca':`ok. ${fmt(Math.ceil(p.payback))} mies.${p.payback>24?` (${fmt(p.payback/12,0,1)} lat)`:''}`;

function Energy({v,save}){
 const chosen=v.measures||[];const p=energyPlan(chosen);const after=Object.fromEntries(p.afterDevs.map(d=>[d.id,d]));const q=v.routerQ||{};
 const toggle=id=>save({...v,measures:chosen.includes(id)?chosen.filter(x=>x!==id):[...chosen,id]});
 function checkQ(){if(q.solved)return;const attempts=(q.attempts||0)+1;const r=checkRouterCost(q.input,attempts);save({...v,routerQ:{...q,attempts,solved:r.ok,solvedAt:r.ok?attempts:undefined,msg:{ok:r.ok,text:r.message}}});}
 const pct=Math.min(100,Math.round(100*p.savings/TARGET_SAVINGS));
 return <div className="sh-panel">
  <p className="sh-assume"><Icon name="energy" size={20}/><span><b>Założenie:</b> 1 kWh = {fmt(PRICE,2)} zł (taryfa G11 z dystrybucją, 2026 r.). <b>Wzór:</b> W × h × 365 / 1000 = kWh na rok; kWh × {fmt(PRICE,2)} zł = koszt.</span></p>
  <div className="sh-kpis" aria-live="polite">
   <div><small>Przed</small><b>{fmt(p.zlBefore)} zł/rok</b><span>{fmt(p.kwhBefore)} kWh</span></div>
   <div><small>Po zmianach</small><b>{fmt(p.zlAfter)} zł/rok</b><span>{fmt(p.kwhAfter)} kWh</span></div>
   <div className={p.savings>=TARGET_SAVINGS?'is-good':''}><small>Oszczędność (cel {TARGET_SAVINGS} zł)</small><b>−{fmt(p.savings)} zł/rok</b><span>koszt wdrożenia {fmt(p.cost)} zł · zwrot {payText(p)}</span></div>
  </div>
  <div className="sh-meter" role="img" aria-label={`Cel oszczędności osiągnięty w ${pct}%`}><span style={{width:`${pct}%`}}/></div>
  <p className="small muted">{p.savings>=TARGET_SAVINGS?'Cel osiągnięty. Sprawdź jeszcze, czy koszt wdrożenia zwraca się w rozsądnym czasie (do 12 miesięcy).':`Brakuje ${fmt(TARGET_SAVINGS-p.savings)} zł do celu.`}</p>
  <h4>Urządzenia Nowaków (wybrane)</h4>
  <ul className="sh-devices">{devices.map(d=>{const a=after[d.id];const b=deviceKwh(d),k=deviceKwh(a);const changed=Math.abs(b-k)>0.001;return <li key={d.id} className={changed?'is-changed':''}>
   <Icon name={d.icon} size={22}/><div className="sh-dev-main"><b>{a.name}</b>{d.note&&<small className="sh-note">{d.note}</small>}<small className="sh-formula">{formula(a)}</small></div>
   <div className="sh-dev-num">{changed&&<s aria-label={`przed: ${fmt(zl(b))} zł`}>{fmt(zl(b))} zł</s>}<b>{fmt(zl(k))} zł</b><small>{fmt(k,0,1)} kWh</small></div></li>;})}</ul>
  <fieldset className="sh-measures"><legend>Co zmieniacie? (efekt zobaczysz w podsumowaniu)</legend>{measures.map(m=><label key={m.id} className={chosen.includes(m.id)?'is-on':''}><input type="checkbox" checked={chosen.includes(m.id)} onChange={()=>toggle(m.id)}/><span>{m.name}<small>Koszt: {m.cost?`${fmt(m.cost)} zł`:'0 zł'}{m.warn&&<> · <b>Uwaga:</b> {m.warn}</>}</small></span></label>)}</fieldset>
  <section className="sh-q"><h4>Policz sam: ile rocznie kosztuje praca routera ({routerQuestion.w} W, {routerQuestion.h} h na dobę, przed zmianami)?</h4>
   {!q.solved&&<div className="sh-row"><label className="sh-field"><span>Koszt w zł/rok</span><input inputMode="decimal" autoComplete="off" value={q.input||''} onChange={e=>save({...v,routerQ:{...q,input:e.target.value}})} onKeyDown={e=>{if(e.key==='Enter')checkQ();}}/></label><button type="button" className="btn" onClick={checkQ}>Sprawdź</button></div>}
   <Msg m={q.msg}/></section>
 </div>;
}

function Security({v,save}){
 const sel=v.sec||{};const c=v.secCheck;const show=!!c;const audit=c?securityAudit(c.sel||sel):null;
 const toggle=(dev,f)=>{const cur=sel[dev]||[];save({...v,sec:{...sel,[dev]:cur.includes(f)?cur.filter(x=>x!==f):[...cur,f]}});};
 function check(){const a=securityAudit(sel);save({...v,secCheck:{pct:a.pct,traps:a.traps,attempts:((c?.attempts)||0)+1,sel}});}
 const per=audit?Object.fromEntries(audit.perDevice.map(x=>[x.id,x])):{};
 return <div className="sh-panel">
  <details className="sh-fact"><summary><Icon name="warning" size={20}/>Dlaczego to ważne? (Mirai i nowe prawo UE)</summary><p>W 2016 r. botnet <b>Mirai</b> przejął ponad 600 tys. kamer, rejestratorów i routerów. Nie łamał niczego wyrafinowanego — próbował ok. 60 fabrycznych par login/hasło, np. admin/admin. Przejętymi urządzeniami zablokował potem duże serwisy internetowe.</p><p>Od 1 sierpnia 2025 r. urządzenia radiowe sprzedawane w UE muszą spełniać wymagania cyberbezpieczeństwa dyrektywy RED (m.in. koniec z domyślnymi hasłami bez wymuszenia zmiany). Od 2027 r. dochodzi akt o cyberodporności (Cyber Resilience Act). Ale sprzęt kupiony wcześniej — jak u Nowaków — musisz zabezpieczyć sam.</p></details>
  <p className="small muted">{c&&JSON.stringify(c.sel)!==JSON.stringify(sel)?<b>Zmieniono zaznaczenia od ostatniego sprawdzenia. </b>:null}Dla każdego urządzenia zaznacz poprawki, które usuwają wypisane problemy. Uwaga na pułapki. Wynik zobaczysz po sprawdzeniu audytu.</p>
  <div className="sh-iot">{iotDevices.map(d=>{const chosen=sel[d.id]||[];const r=per[d.id];return <fieldset key={d.id} className={`sh-iot-card ${show&&r?(r.ok?'is-ok':'is-bad'):''}`}>
   <legend><Icon name={d.icon} size={20}/>{d.name}</legend>
   <ul className="sh-issues">{d.issues.map(i=><li key={i.text}><Icon name="warning" size={16}/>{i.text}</li>)}</ul>
   <div className="sh-fixes">{orderOptions(optionKey('smartHome',`${d.id}:fixes`,d.options),d.options).map(([i,f])=><label key={f} data-option={i} className={chosen.includes(f)?'is-on':''}><input type="checkbox" checked={chosen.includes(f)} onChange={()=>toggle(d.id,f)}/><span>{fixes[f]}</span></label>)}</div>
   {show&&r&&<p className={`sh-verdict ${r.ok?'is-ok':'is-bad'}`}>{r.ok?'✓ Zabezpieczone.':<>{r.missing.length>0&&<span>Brakuje {r.missing.length} {r.missing.length===1?'poprawki':'poprawek'}: {r.missing.map(m=>m.hint).join(' ')}</span>}{r.traps.map(t=><span key={t}> Pułapka! {traps[t]}</span>)}</>}</p>}
  </fieldset>;})}</div>
  <button type="button" className="btn" onClick={check}>Sprawdź audyt <Icon name="shield" size={18}/></button>
  {c&&<div className={`sh-msg ${c.pct>=70&&!c.traps?'is-ok':'is-retry'}`} role="status"><Icon name="shield" size={20}/><div><b>Bezpieczeństwo domu: {c.pct}%</b>{c.traps?` · pułapki: ${c.traps} (−20 pkt proc. każda)`:''}. {c.pct>=100&&!c.traps?'Wzorowo — boty odbiją się od tego domu.':'Popraw zaznaczone urządzenia i sprawdź ponownie (za poprawkę maks. 3/4 pkt).'}</div></div>}
 </div>;
}

function Rules({v,save}){
 const rules=v.rules||[];const [draft,setDraft]=useState({trigger:'',condition:'none',action:''});const [msg,setMsg]=useState(null);const s=rulesScore(rules);
 function add(e){e.preventDefault();if(!draft.trigger||!draft.action){setMsg({ok:false,text:'Wybierz wyzwalacz (JEŻELI) i akcję (TO).'});return;}
  if(rules.some(r=>sameRule(r,draft))){setMsg({ok:false,text:'Taka reguła już jest na liście.'});return;}
  if(rules.length>=MAX_RULES){setMsg({ok:false,text:`Maksymalnie ${MAX_RULES} reguł — usuń którąś.`});return;}
  const c=classifyRule(draft);save({...v,rules:[...rules,{...draft}]});setMsg({ok:c.kind!=='risky'&&c.kind!=='weak',text:`Dodano: ${kindLabel[c.kind][0]}. ${c.message}`});setDraft({trigger:'',condition:'none',action:''});}
 const goals=[[s.sensible>=3,`Min. 3 sensowne reguły (${s.sensible})`],[s.energy>=1,'Min. 1 oszczędzająca energię'],[s.safety>=1,'Min. 1 dla bezpieczeństwa'],[rules.length>0&&s.risky===0,'Zero ryzykownych reguł']];
 return <div className="sh-panel">
  <ul className="sh-goals" aria-label="Cele automatyzacji">{goals.map(([ok,t])=><li key={t} className={ok?'is-ok':''}><Icon name={ok?'check':'circle'} size={18}/>{t}<span className="sr-only">{ok?' — spełnione':' — jeszcze nie'}</span></li>)}</ul>
  <form className="sh-builder" onSubmit={add}>
   <div className="sh-field"><label htmlFor="sh-trigger">JEŻELI</label><select id="sh-trigger" value={draft.trigger} onChange={e=>setDraft({...draft,trigger:e.target.value})}><option value="">— wybierz wyzwalacz —</option>{Object.entries(triggers).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></div>
   <div className="sh-field"><label htmlFor="sh-condition">I (opcjonalnie)</label><select id="sh-condition" value={draft.condition} onChange={e=>setDraft({...draft,condition:e.target.value})}>{Object.entries(conditions).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></div>
   <div className="sh-field"><label htmlFor="sh-action">TO</label><select id="sh-action" value={draft.action} onChange={e=>setDraft({...draft,action:e.target.value})}><option value="">— wybierz akcję —</option>{Object.entries(actions).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select></div>
   <button className="btn" type="submit">Dodaj regułę <Icon name="right" size={18}/></button>
  </form>
  <Msg m={msg}/>
  {rules.length>0&&<ol className="sh-rules">{rules.map((r,i)=>{const c=classifyRule(r);return <li key={i} className={`sh-rule sh-${c.kind}`}><div><span className="sh-kind"><Icon name={kindLabel[c.kind][1]} size={15}/>{kindLabel[c.kind][0]}</span><b>{ruleText(r)}</b><small>{c.message}</small></div><button type="button" className="text-button" onClick={()=>{save({...v,rules:rules.filter((_,j)=>j!==i)});setMsg(null);}} aria-label={`Usuń regułę: ${ruleText(r)}`}><Icon name="close" size={18}/>Usuń</button></li>;})}</ol>}
 </div>;
}

function Plan({v,save,r}){
 const p=r.energy.plan;const good=(v.rules||[]).filter(x=>['energy','safety','comfort'].includes(classifyRule(x).kind));
 const crit=[[p.savings>=TARGET_SAVINGS,`Oszczędność ≥ ${TARGET_SAVINGS} zł/rok z pokazanym rachunkiem`],[r.security.done,'Brak domyślnych haseł, osobna sieć IoT, zero pułapek (audyt ≥ 70%)'],[r.auto.done,'≥ 3 sensowne reguły, w tym energia i bezpieczeństwo'],[(v.planNote||'').trim().length>=20,'Najważniejsza decyzja ma uzasadnienie']];
 return <div className="sh-panel">
  <article className="sh-plan"><header><Icon name="house" size={28}/><div><small>Plan dla rodziny Nowaków · 4 osoby, 60 m²</small><h4>Mniej za prąd, spokojniej w sieci</h4></div></header>
   <dl><div><dt>Oszczędność</dt><dd>−{fmt(p.savings)} zł/rok</dd></div><div><dt>Koszt wdrożenia</dt><dd>{fmt(p.cost)} zł</dd></div><div><dt>Zwrot</dt><dd>{payText(p)}</dd></div><div><dt>Bezpieczeństwo</dt><dd>{r.security.pct===null?'nie sprawdzono':`${r.security.pct}%`}</dd></div></dl>
   <h5>Zmiany w energii</h5>{(v.measures||[]).length?<ul>{measures.filter(m=>(v.measures||[]).includes(m.id)).map(m=><li key={m.id}>{m.name}</li>)}</ul>:<p className="small muted">Brak — zakładka Energia.</p>}
   <h5>Automatyzacje ({good.length} {rulesWord(good.length)})</h5>{good.length?<ul>{good.map(x=><li key={ruleText(x)}>{ruleText(x)}</li>)}</ul>:<p className="small muted">Brak — zakładka Automatyzacje.</p>}
  </article>
  <label className="sh-field sh-note-field"><span>Najważniejsza decyzja w planie i dlaczego (1–2 zdania)</span><textarea rows={3} maxLength={400} value={v.planNote||''} onChange={e=>save({...v,planNote:e.target.value})} placeholder="Np. Listwa na RTV, bo dekoder w czuwaniu zjadał prawie 200 zł rocznie."/></label>
  <ul className="sh-goals" aria-label="Kryteria sukcesu">{crit.map(([ok,t])=><li key={t} className={ok?'is-ok':''}><Icon name={ok?'check':'circle'} size={18}/>{t}<span className="sr-only">{ok?' — spełnione':' — jeszcze nie'}</span></li>)}</ul>
  {r.done&&<p className="sh-final" role="status"><Icon name="trophy" size={22}/>Plan gotowy do oceny koleżeńskiej. Wynik: {pts(r.score)}/12 pkt.</p>}
 </div>;
}

export default function SmartHome({value,onChange}){
 const v=value||{};const r=smartHomeResult(v);const [tab,setTab]=useState(v.tab||'energy');const role=v.role||'all';
 function save(next){const res=smartHomeResult(next);onChange({...next,done:res.done,score:res.score,max:res.max,summary:res.summary});}
 const tabs=[['energy','Energia','energy',r.energy.score,'energy','Energia'],['security','Bezpieczeństwo','shield',r.security.score,'security','Ochrona'],['auto','Automatyzacje','settings',r.auto.score,'auto','Reguły'],['plan','Plan','house',null,null,'Plan']];
 const pick=t=>{setTab(t);save({...v,tab:t});};
 return <section className="sh" aria-label="Projekt: inteligentny dom Nowaków">
  <header className="sh-bar"><Icon name="house" size={20}/><strong>DomOS · dom Nowaków</strong><span className="sh-sim">symulacja</span><span className="sh-score">{pts(r.score)}/12 pkt</span></header>
  <div className="sh-roles" role="group" aria-label="Moja rola w trójce"><span>Moja rola:</span>{roles.map(([k,l])=><button type="button" key={k} aria-pressed={role===k} onClick={()=>save({...v,role:k})}>{l}</button>)}</div>
  <div className="sh-tabs" role="group" aria-label="Zakładki projektu">{tabs.map(([k,l,ic,sc,rk,sh])=><button type="button" key={k} aria-pressed={tab===k} aria-label={`${l}${sc!==null?`, ${pts(sc)} na 4 pkt`:''}${role!=='all'&&rk===role?', Twoja zakładka':''}`} onClick={()=>pick(k)}><Icon name={ic} size={18}/><span className="sh-long">{l}</span><span className="sh-short" aria-hidden="true">{sh}</span>{sc!==null&&<em>{pts(sc)}/4</em>}{role!=='all'&&rk===role&&<i className="sh-mine">Twoja</i>}</button>)}</div>
  {tab==='energy'&&<Energy v={v} save={save}/>}
  {tab==='security'&&<Security v={v} save={save}/>}
  {tab==='auto'&&<Rules v={v} save={save}/>}
  {tab==='plan'&&<Plan v={v} save={save} r={r}/>}
 </section>;
}
