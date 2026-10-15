import React from 'react';
import {Icon} from '../icons.jsx';
import * as S from '../../content/sims/scamComic.js';
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

// Po rezygnacji z plakatu (lekcja 43) został tylko tryb 'domains'; rozmowa z oszustem to symulator scamChat.
export default function ScamComic({value,onChange}){return <Domains value={value} onChange={onChange}/>;}
