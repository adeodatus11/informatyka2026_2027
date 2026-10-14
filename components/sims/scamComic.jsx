import React from 'react';
import {Icon} from '../icons.jsx';
import * as S from '../../content/sims/scamComic.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './scamComic.css';

const fmt=n=>String(n).replace('.',',');

function Bar({tag,note,score,max,extra}){
 return <div className="sc-top"><div><span className="sc-tag">{tag}</span><small>{note}</small></div>
  <div className="sc-counters" aria-live="polite">{score!==undefined&&<span>Punkty: <b>{fmt(score)}</b>/{max}</span>}{extra}</div></div>;
}

// ---------- Domeny i Lista Ostrzeżeń ----------
function Domains({value={},onChange}){
 const judged=value.judged||{},res=S.domainsResult(value);
 const save=j=>{const next={...value,judged:j};onChange({...next,...S.domainsResult(next)});};
 return <div className="sc-sim">
  <Bar tag="Sprawdzarka adresów" note="symulacja: domeny fikcyjne (poza incydent.cert.pl), nic nie jest otwierane" score={res.score} max={res.max} extra={<span>Ocenione: <b>{res.solved}</b>/{S.domains.length}</span>}/>
  <p className="sc-help">Dla każdego adresu zdecyduj: wchodzisz czy nie? Czytaj domenę <b>od końca do pierwszego „/”</b>. Potem zobaczysz, co pokazałaby przeglądarka u operatora, który korzysta z Listy Ostrzeżeń CERT Polska.</p>
  <ol className="sc-domains">{S.domains.map((d,n)=>{const st=judged[d.id],chk=st?.ok?S.listCheck(d):null;
   return <li key={d.id} className="sc-domain">
    <p className="sc-from"><Icon name="mail" size={18}/> Skąd: {d.from}</p>
    <p className="sc-url" aria-label={`Adres ${n+1}`}><span className="sc-lock" aria-hidden="true"/>{d.url}</p>
    <div className="sc-vbtns" role="group" aria-label={`Decyzja dla adresu ${n+1}`}>{S.domainVerdicts.map(v=><button key={v.id} className={`sc-v sc-v-${v.id} ${st?.choice===v.id?'picked':''}`} aria-pressed={st?.choice===v.id} disabled={st?.ok&&st.choice!==v.id} onClick={()=>save(S.judgeDomain(judged,d.id,v.id))}><b>{v.label}</b><small>{v.short}</small></button>)}</div>
    {st&&<div className={`sc-feedback ${st.ok?'ok':'retry'}`} role="status"><Icon name={st.ok?'check':'warning'} size={20}/><p>{st.ok?`${st.tries===1?'+1 pkt':'+0,5 pkt'}. ${d.why}`:'Jeszcze raz. Znajdź pierwszy „/” po „https://” i przeczytaj, co stoi tuż przed nim. Czy to adres, który znasz, czy tylko podobny?'}</p></div>}
    {chk&&<div className={`sc-list ${chk.blocked?'blocked':'open'}`}><Icon name={chk.blocked?'shield':'globe'} size={22}/><p><b>{chk.blocked?'Lista Ostrzeżeń: zablokowano':'Lista Ostrzeżeń: brak wpisu'}</b><br/>{chk.text}</p></div>}
   </li>;})}</ol>
  {res.done&&<p className="sc-done" role="status"><Icon name="trophy" size={22}/>Wszystkie adresy ocenione. Zapamiętaj adres nr 5: brak na liście nie znaczy, że strona jest bezpieczna.</p>}
 </div>;
}

// ---------- Plakat (podgląd) ----------
export function Poster({c}){
 const sc=S.scenarioById(c.scenario);if(!sc)return null;
 return <figure className="sc-poster" aria-label={`Plakat: ${c.title||sc.title}`}>
  <figcaption><span className="sc-poster-title">{(c.title||'').trim()||'(tu pojawi się tytuł plakatu)'}</span><small>{sc.title}. {sc.hero} Historia fikcyjna.</small></figcaption>
  <ol className="sc-poster-grid">{sc.panels.map((p,i)=><li key={p.id} className={p.stop&&S.stopsSolved(c)?'stop':''}><span className="sc-pn">{i+1}</span><p>{p.text}</p>
   {p.stop&&S.stopsSolved(c)&&<p className="sc-bubble"><b>STOP:</b> {(c.bubbles?.[p.id]||'').trim()||'…'}</p>}</li>)}</ol>
  <div className="sc-poster-foot"><p><Icon name="book" size={18}/><span><b>Przepis:</b> {sc.law}</span></p>
   <p><Icon name="shield" size={18}/><span><b>Gdy to już się stało:</b> bank i blokada, dowody (zrzuty ekranu), policja z opiekunem, zgłoszenie na incydent.cert.pl lub SMS na 8080.</span></p></div>
 </figure>;
}

// ---------- Kreator komiksu ----------
function Comic({data,c,save}){
 const sc=S.scenarioById(c.scenario),res=S.comicResult(c),id=data.id;
 const o=c.orderCheck,sk=c.stopCheck,r=c.reactCheck,order=c.order||[];
 const download=()=>{const url=URL.createObjectURL(new Blob([S.posterHtml(c)],{type:'text/html'}));const a=document.createElement('a');a.href=url;a.download='plakat-oszustwo.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 return <div className="sc-sim">
  <Bar tag="Kreator plakatu" note="symulacja: historie, osoby i firmy fikcyjne" score={res.score} max={res.max}/>
  <ul className="sc-roles" aria-label="Role w trójce">{S.comicRoles.map((ro,i)=><li key={ro.id}><b>Osoba {i+1}: {ro.name}</b><small>{ro.task}</small></li>)}</ul>
  <p className="small muted sc-solo">Pracujesz sam albo w parze? Przejdź wszystkie role po kolei. Klawiaturę przejmuje osoba, której rola jest teraz potrzebna.</p>

  <fieldset className="sc-step"><legend>1. Wybierzcie historię</legend>
   <div className="sc-scen">{S.scenarios.map(s=><button key={s.id} className={`sc-scen-btn ${c.scenario===s.id?'picked':''}`} aria-pressed={c.scenario===s.id} disabled={!!o?.ok&&c.scenario!==s.id} onClick={()=>save(S.chooseScenario(c,s.id))}><Icon name={s.icon} size={24}/><span><b>{s.title}</b><small>{s.short}</small></span></button>)}</div>
   {sc&&!o?.ok&&<p className="small muted">Zmiana historii zaczyna komiks od nowa. Po ułożeniu kadrów historia się zablokuje.</p>}
  </fieldset>

  {sc&&<fieldset className="sc-step"><legend>2. Scenarzysta: ułóż kadry po kolei</legend>
   <p className="small">{sc.hero} Klikaj kadry w kolejności, w jakiej działo się oszustwo. Kliknięcie numeru cofa wybór.</p>
   <div className="sc-pick">{orderOptions(optionKey('scamComic',sc.id,sc.panels.map(p=>p.text)),sc.panels).map(([i,p])=>{const pos=order.indexOf(p.id),bad=o&&!o.ok&&!o.stale&&o.wrong.includes(pos);
    return <button key={p.id} data-option={i} className={`sc-card ${pos>=0?'placed':''} ${bad?'bad':''}`} aria-pressed={pos>=0} disabled={o?.ok} onClick={()=>save(S.togglePanel(c,p.id))}>
     <span className="sc-pos" aria-hidden="true">{pos>=0?pos+1:'?'}</span><span>{p.text}{pos>=0&&<span className="sr-only"> (pozycja {pos+1})</span>}{bad&&<em className="sc-bad"> nie to miejsce</em>}</span></button>;})}</div>
   <div className="inline-actions"><button className="btn" disabled={order.length!==sc.panels.length||o?.ok} onClick={()=>save(S.checkOrder(c))}>Sprawdź kolejność <Icon name="right" size={18}/></button>
    {order.length>0&&!o?.ok&&<button className="text-button" onClick={()=>save(S.resetOrder(c))}><Icon name="reset" size={18}/>Wyczyść kolejność</button>}
    <span className="muted small">Ułożone: {order.length}/{sc.panels.length}</span></div>
   {o&&!o.stale&&<div className={`sc-feedback ${o.ok?'ok':'retry'}`} role="status"><Icon name={o.ok?'check':'warning'} size={20}/><p>{o.ok?`${o.tries===1?'+2 pkt':'+1 pkt'}. Historia ma sens. Teraz Strażnik szuka sygnałów ostrzegawczych.`:`Kadry na złych miejscach: ${o.wrong.length}. Zastanów się: co musiało się stać najpierw, żeby oszust w ogóle mógł wysłać link albo poprosić o kod? Wyczyść i ułóż jeszcze raz.`}</p></div>}
  </fieldset>}

  {o?.ok&&<fieldset className="sc-step"><legend>3. Strażnik: gdzie można było przerwać?</legend>
   <p className="small">Oznacz STOP każdy kadr, w którym pojawia się <b>nowy sygnał ostrzegawczy</b>. Skutek oszustwa to już nie punkt przerwania.</p>
   <ol className="sc-strip">{sc.panels.map((p,i)=>{const on=(c.stops||[]).includes(p.id),checked=sk&&!sk.stale,wrong=checked&&sk.wrong.includes(p.id),ok=checked&&on&&p.stop;
    return <li key={p.id} className={`${on?'on':''} ${wrong?'wrong':''} ${ok?'ok':''}`}><span className="sc-pn">{i+1}</span><p>{p.text}</p>
     <button className="sc-stop-btn" aria-pressed={on} disabled={S.stopsSolved(c)} onClick={()=>save(S.toggleStop(c,p.id))}><Icon name={on?'warning':'circle'} size={18}/>{on?'STOP':'Oznacz STOP'}<span className="sr-only"> w kadrze {i+1}</span></button>
     {(wrong||S.stopsSolved(c)&&p.stop)&&<small className={wrong?'sc-why warn':'sc-why'}>{p.why}</small>}</li>;})}</ol>
   <div className="inline-actions"><button className="btn" disabled={!(c.stops||[]).length||S.stopsSolved(c)} onClick={()=>save(S.checkStops(c))}>Sprawdź punkty przerwania <Icon name="right" size={18}/></button></div>
   {sk&&!sk.stale&&<div className={`sc-feedback ${S.stopsSolved(c)?'ok':'retry'}`} role="status"><Icon name={S.stopsSolved(c)?'check':'warning'} size={20}/><p>{S.stopsSolved(c)?'Wszystkie punkty przerwania znalezione. Teraz dopiszcie dymki: co konkretnie zrobić w tym momencie?':`${sk.wrong.length?`Zaznaczenia, które nie są punktem przerwania: ${sk.wrong.length} (wyjaśnienie pod kadrem). `:''}${sk.missing.length?`Brakuje jeszcze ${sk.missing.length}. Szukaj: pośpiechu, prośby o kod lub dane karty, dziwnej domeny, zbyt dobrej ceny, przeniesienia rozmowy gdzie indziej.`:''}`}</p></div>}
  </fieldset>}

  {S.stopsSolved(c)&&<fieldset className="sc-step"><legend>4. Dymki STOP: co bohater robi w tym momencie?</legend>
   <p className="small">Jedno konkretne zdanie, np. „Nie podaję CVV. Żeby dostać pieniądze, wystarczy numer konta”. Unikaj ogólnego „uważaj”.</p>
   <div className="sc-bubbles">{sc.panels.map((p,i)=>p.stop&&<div key={p.id}><label htmlFor={`${id}-b-${p.id}`}>Kadr {i+1}: {p.text}</label>
    <textarea id={`${id}-b-${p.id}`} rows={2} maxLength={160} value={c.bubbles?.[p.id]||''} onChange={e=>save(S.setBubble(c,p.id,e.target.value))}/>
    <small className="muted">{(c.bubbles?.[p.id]||'').trim().length<S.bubbleMin?`Jeszcze co najmniej ${S.bubbleMin-(c.bubbles?.[p.id]||'').trim().length} znaków`:'Gotowe'}</small></div>)}</div>
  </fieldset>}

  {S.bubblesDone(c)&&<fieldset className="sc-step"><legend>5. Ratownik: oszustwo się udało. Co robisz?</legend>
   <p className="small">Zaznacz wszystko, co trzeba zrobić. Kilka odpowiedzi to pułapki.</p>
   <div className="choices">{orderOptions(optionKey('scamComic','react',S.reactions.map(x=>x.text)),S.reactions).map(([i,x])=>{const on=(c.reactions||[]).includes(x.id),wrong=r&&!r.stale&&r.wrong.includes(x.id);
    return <button key={x.id} data-option={i} className={`choice ${on?'selected':''}`} aria-pressed={on} disabled={r?.ok} onClick={()=>save(S.toggleReaction(c,x.id))}><span className="choice-letter" aria-hidden="true">{on?'✓':''}</span><span>{x.text}{wrong&&<em className="sc-bad"> {x.why}</em>}</span></button>;})}</div>
   <div className="inline-actions"><button className="btn" disabled={!(c.reactions||[]).length||r?.ok} onClick={()=>save(S.checkReactions(c))}>Sprawdź reakcję <Icon name="right" size={18}/></button></div>
   {r&&!r.stale&&<div className={`sc-feedback ${r.ok?'ok':'retry'}`} role="status"><Icon name={r.ok?'check':'warning'} size={20}/><p>{r.ok?`${r.tries===1?'+2 pkt':'+1 pkt'}. Najpierw bank (liczą się minuty), potem dowody, policja i zgłoszenie. Instrukcję zgłoszenia na 8080 i incydent.cert.pl masz w następnym etapie.`:`${r.wrong.length?'Wśród zaznaczonych są pułapki: wyjaśnienie przy odpowiedzi. ':''}${r.missing.length?`Brakuje jeszcze ${r.missing.length} ${r.missing.length===1?'kroku':'kroków'}.`:''}`}</p></div>}
  </fieldset>}

  {r?.ok&&<fieldset className="sc-step"><legend>6. Tytuł i gotowy plakat</legend>
   <label htmlFor={`${id}-title`}>Tytuł plakatu (dla młodszych uczniów, max 60 znaków)</label>
   <input id={`${id}-title`} maxLength={60} autoComplete="off" value={c.title||''} placeholder="Np. 120 zł za bluzę, 2400 zł straty" onChange={e=>save({...c,title:e.target.value})}/>
   <Poster c={c}/>
   <div className="inline-actions"><button className="btn secondary" disabled={!res.done} onClick={download}><Icon name="download" size={18}/>Zapisz plakat jako plik .html</button>
    {res.done?<p className="sc-done" role="status"><Icon name="trophy" size={22}/>Plakat gotowy. {fmt(res.score)}/{res.max} pkt.</p>:<span className="muted small">Wpisz tytuł (min. 5 znaków), żeby zakończyć.</span>}</div>
  </fieldset>}
 </div>;
}

// ---------- Ocena koleżeńska ----------
function Peer({data,c,p,save}){
 const res=S.peerResult(p),id=data.id,comic=S.comicResult(c);
 return <div className="sc-sim">
  <Bar tag="Ocena koleżeńska" note="oceniacie plakat innej trójki na jej komputerze; to nie są punkty do karty wyniku" extra={<span>Ocena: <b>{res.total}</b>/{res.top}</span>}/>
  {!comic.done&&<div className="sc-feedback retry" role="status"><Icon name="warning" size={20}/><p>Plakat na tym komputerze nie jest jeszcze skończony. Wróćcie do etapu „Plakat” albo oceńcie to, co już jest.</p></div>}
  {c.scenario?<Poster c={c}/>:<p className="muted">Brak plakatu: najpierw wybierzcie historię w etapie „Plakat”.</p>}
  <div className="sc-peer">{S.peerCriteria.map(cr=><fieldset key={cr.id} className="sc-crit"><legend>{cr.label}</legend>
   {cr.levels.map((l,n)=><label key={n} className={p.ratings?.[cr.id]===n?'on':''}><input type="radio" name={`${id}-${cr.id}`} checked={p.ratings?.[cr.id]===n} onChange={()=>save(S.ratePeer(p,cr.id,n))}/><span><b>{n} pkt</b> {l}</span></label>)}
  </fieldset>)}</div>
  <label htmlFor={`${id}-tip`} className="sc-lbl">Jedna konkretna wskazówka: co autorzy mają poprawić?</label>
  <textarea id={`${id}-tip`} rows={2} maxLength={200} value={p.tip||''} placeholder="Np. Dymek w kadrze 3 mówi tylko „uważaj”. Napiszcie, co zrobić z linkiem." onChange={e=>save({...p,tip:e.target.value})}/>
  <label className="sc-fixed"><input type="checkbox" checked={!!p.fixed} disabled={(p.tip||'').trim().length<15} onChange={e=>save({...p,fixed:e.target.checked})}/>Autorzy wrócili do kreatora i poprawili wskazaną rzecz</label>
  <p className="sc-status" role="status">{res.done?`Ocena zapisana: ${res.total}/${res.top}. Poprawka wprowadzona.`:`Oceniono kryteria: ${res.rated}/${S.peerCriteria.length}. ${(p.tip||'').trim().length<15?'Dopisz wskazówkę (min. 15 znaków).':'Po poprawce zaznacz pole wyżej.'}`}</p>
 </div>;
}

export default function ScamComic(props){
 const {data,value,onChange}=props;
 if(data.mode==='domains')return <Domains value={value} onChange={onChange}/>;
 const v=value||{},c=v.comic||{},p=v.peer||{};
 const results={comic:S.comicResult,peer:S.peerResult};
 const save=(mode,sub)=>{const next={...v,[mode]:sub};onChange({...next,modes:{...v.modes,comic:S.comicResult(next.comic||{}),peer:S.peerResult(next.peer||{}),[mode]:results[mode](sub)}});};
 if(data.mode==='peer')return <Peer data={data} c={c} p={p} save={sub=>save('peer',sub)}/>;
 return <Comic data={data} c={c} save={sub=>save('comic',sub)}/>;
}
