import React from 'react';
import {Icon} from '../icons.jsx';
import {offer,badMail,badCount,toggleMark,checkSpot,spotSolved,spotResult,senders,attachments,skeleton,criteria,checkMail,mailReady,composeResult,chat,firstMove,chooseMove,toneCriteria,checkTone,toneSolved,toneResult} from '../../content/sims/proMail.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './proMail.css';

const fmt=n=>String(n).replace('.',',');

function Window({title,score,max,children,extra}){
 return <div className="pm-sim">
  <div className="pm-titlebar"><span className="pm-dots" aria-hidden="true"><i/><i/><i/></span><b>{title}</b><span className="pm-badge">symulacja</span>
   <span className="pm-score" aria-live="polite">Punkty: <b>{fmt(score)}</b>/{max}</span>{extra}</div>
  {children}
 </div>;
}

function Report({items,report,dirty}){
 if(!report)return null;
 return <div className={`pm-report ${dirty?'stale':''}`} role="status">
  {dirty&&<p className="pm-stale"><Icon name="reset" size={18}/>Zmieniłeś tekst. Kliknij „Sprawdź” jeszcze raz.</p>}
  <ul>{items.map(c=>{const r=report[c.id];return <li key={c.id} className={r.ok?'ok':'bad'}><Icon name={r.ok?'check':'close'} size={18}/><span><b>{c.label}{r.ok?'':' (do poprawy)'}:</b> {r.msg}</span></li>;})}</ul>
 </div>;
}

// ---------- Tryb 'spot' ----------
function Spot({value={},onChange}){
 const marked=value.marked||[],res=spotResult(value),solved=spotSolved(value),last=value.last;
 const save=next=>onChange({...next,...spotResult(next)});
 const frag=f=>{const on=marked.includes(f.id),checked=last&&!value.dirty;const found=checked&&on&&f.bad,wrong=checked&&on&&!f.bad;
  return <span className="pm-frag-wrap" key={f.id}><button className={`pm-frag ${on?'marked':''} ${found?'found':''} ${wrong?'wrong':''}`} aria-pressed={on} disabled={solved} onClick={()=>save({...toggleMark(value,f.id),dirty:true})}>
   {f.text}{on&&<span className="pm-flag">{found?'błąd ✓':wrong?'to nie błąd':'błąd?'}</span>}</button>
   {(found||wrong||solved&&f.bad)&&<small className={`pm-why ${wrong?'warn':''}`}>{f.why}</small>}</span>;};
 const byArea=a=>badMail.filter(f=>f.area===a);
 return <Window title="Poczta · Wiadomość od ucznia" score={res.score} max={res.max}>
  <p className="pm-help">Ten e-mail dostała pani Zielińska z firmy BitSerwis. Kliknij każdy fragment, który trzeba poprawić. Szukasz {badCount} błędów, a kilka fragmentów jest w porządku.</p>
  <div className="pm-mail">
   <div className="pm-row"><span>Od:</span>{byArea('Od').map(frag)}</div>
   <div className="pm-row"><span>Do:</span>{byArea('Do').map(frag)}</div>
   <div className="pm-row"><span>Temat:</span>{byArea('Temat').map(frag)}</div>
   <div className="pm-body">{byArea('Treść').map(frag)}<div className="pm-sign">{byArea('Podpis').map(frag)}</div></div>
   <div className="pm-row pm-att"><span><Icon name="file" size={18}/> Załącznik:</span>{byArea('Załącznik').map(frag)}</div>
  </div>
  <div className="inline-actions"><button className="btn" disabled={!marked.length||solved} onClick={()=>save(checkSpot(value))}>Sprawdź zaznaczenia <Icon name="right" size={18}/></button><span className="muted small">Zaznaczono: {marked.length}</span></div>
  {last&&!value.dirty&&<div className={`pm-feedback ${solved?'ok':'retry'}`} role="status"><Icon name={solved?'check':'warning'} size={20}/><p>{solved?`Wszystkie ${badCount} błędów znalezione. ${value.checks===1?'Bez pomyłki: pełna pula punktów.':'Po poprawkach: część punktów za drugą próbę.'} Poniżej poprawiona wersja: przykład, z którego skorzystasz za chwilę.`:`Znalezione błędy: ${badCount-last.missing}/${badCount}.${last.wrong.length?` ${last.wrong.length} ${last.wrong.length===1?'zaznaczenie nie jest błędem':'zaznaczenia nie są błędami'}: odznacz je (wyjaśnienie pod fragmentem).`:''}${last.missing?` Brakuje jeszcze ${last.missing}. Sprawdź adres nadawcy, temat, powitanie, podpis i załącznik.`:''}`}</p></div>}
  {solved&&<div className="pm-model"><h4><Icon name="check" size={20}/> Wzór: ten sam e-mail po poprawkach</h4>
   <dl><dt>Od</dt><dd>jan.kowalski.2010@poczta-przyklad.pl <small>(imię i nazwisko w adresie)</small></dd><dt>Do</dt><dd>{offer.email}</dd><dt>Temat</dt><dd>Zgłoszenie na praktyki zawodowe, Jan Kowalski, kl. 1 <small>(kto i w jakiej sprawie)</small></dd></dl>
   <p className="pm-model-body">Dzień dobry, <small>(powitanie)</small><br/><br/>jestem uczniem 1 klasy technikum informatycznego w Zielonkowie. <small>(kim jestem)</small> Chciałbym odbyć u Państwa praktyki zawodowe w maju i czerwcu 2027 r. <small>(o co proszę i kiedy)</small> Znam podstawy Worda i lubię naprawiać komputery. <small>(dlaczego ja)</small> W załączniku przesyłam CV. Będę wdzięczny za odpowiedź. <small>(załącznik, uprzejmość)</small><br/><br/>Z poważaniem<br/>Jan Kowalski <small>(podpis)</small></p>
   <p className="pm-att-ok"><Icon name="file" size={18}/> CV_Jan_Kowalski.pdf</p></div>}
 </Window>;
}

// ---------- Tryb 'compose' ----------
function Compose({data,value={},onChange}){
 const m=value.mail||{},res=composeResult(value),ready=mailReady(value),id=data.id;
 const save=next=>onChange({...next,...composeResult(next)});
 const set=(k,v)=>save({...value,mail:{...m,[k]:v},dirty:!!value.report,sent:false});
 if(value.sent)return <Window title="Poczta · Wysłane" score={res.score} max={res.max}>
  <div className="pm-sent" role="status"><Icon name="mail" size={40}/><div><h4>Wysłano (w symulacji)</h4><p>Nic nie wyszło z tego komputera. W prawdziwym życiu taki e-mail ma dużo większą szansę na odpowiedź niż „siema, chcę praktyki”.</p><p className="small">Temat: <b>{m.subject}</b> · Załącznik: CV_Jan_Kowalski.pdf</p></div></div>
  <p className="small muted">{res.summary}.</p>
  <button className="text-button" onClick={()=>save({...value,sent:false})}><Icon name="left" size={18}/>Wróć do wiadomości</button>
 </Window>;
 return <Window title="Poczta · Nowa wiadomość" score={res.score} max={res.max}>
  <div className="pm-compose-grid">
   <aside className="pm-offer"><p className="pm-offer-tag"><Icon name="board" size={18}/> Ogłoszenie (fikcyjne)</p><h4>Praktyki zawodowe: serwis komputerowy</h4><p>{offer.text}</p><p className="small"><b>Firma:</b> {offer.company}, {offer.city}<br/><b>Kontakt:</b> {offer.contact}<br/><b>E-mail:</b> <span className="pm-mono">{offer.email}</span></p>
    <details className="pm-tips"><summary>Ściąga: 7 rzeczy, które sprawdzi skrzynka</summary><ol>{criteria.map(c=><li key={c.id}><b>{c.label}:</b> {c.goal}</li>)}</ol></details></aside>
   <div className="pm-form">
    <label htmlFor={`${id}-from`}>Od</label>
    <select id={`${id}-from`} value={m.from||''} onChange={e=>set('from',e.target.value)}><option value="" disabled>Wybierz swój adres</option>{orderOptions(optionKey('proMail','from',senders.map(s=>s.text)),senders).map(([i,s])=><option key={s.id} value={s.id} data-option={i}>{s.text}</option>)}</select>
    <label htmlFor={`${id}-to`}>Do</label>
    <input id={`${id}-to`} type="email" autoComplete="off" spellCheck={false} value={m.to||''} placeholder="adres z ogłoszenia" onChange={e=>set('to',e.target.value)}/>
    <label htmlFor={`${id}-subject`}>Temat</label>
    <input id={`${id}-subject`} autoComplete="off" maxLength={120} value={m.subject||''} placeholder="O co chodzi w tej wiadomości?" onChange={e=>set('subject',e.target.value)}/>
    <label htmlFor={`${id}-body`}>Treść <span className="muted small">(możesz użyć wymyślonego imienia i nazwiska)</span></label>
    <textarea id={`${id}-body`} rows={11} maxLength={2000} value={m.body||''} onChange={e=>set('body',e.target.value)}/>
    {!(m.body||'').trim()&&<button className="text-button" onClick={()=>set('body',skeleton)}><Icon name="list" size={18}/>Pomoc: wstaw szkielet wiadomości</button>}
    <label htmlFor={`${id}-att`}><Icon name="file" size={16}/> Załącznik</label>
    <select id={`${id}-att`} value={m.attachment||'none'} onChange={e=>set('attachment',e.target.value)}>{attachments.map(a=><option key={a.id} value={a.id}>{a.text}</option>)}</select>
    <div className="inline-actions"><button className="btn" onClick={()=>save(checkMail(value))}>Sprawdź przed wysłaniem <Icon name="search" size={18}/></button>
     <button className="btn secondary" disabled={!ready} onClick={()=>save({...value,sent:true})}><Icon name="mail" size={18}/>Wyślij</button>
     {value.checks>0&&<span className="muted small">Sprawdzenia: {value.checks}</span>}</div>
    {!ready&&value.report&&!value.dirty&&<p className="small muted">„Wyślij” odblokuje się, gdy wszystkie 7 kryteriów będzie spełnionych.</p>}
    <Report items={criteria} report={value.report} dirty={value.dirty}/>
   </div>
  </div>
  <p className="muted small">Punkty: 1 za kryterium spełnione przy pierwszym sprawdzeniu, 0,5 za poprawione później. Najważniejsze, żeby wysłać poprawną wersję.</p>
 </Window>;
}

// ---------- Tryb 'tone' ----------
function Tone({data,value={},onChange}){
 const res=toneResult(value),mv=value.move,solved=toneSolved(value);
 const save=next=>onChange({...next,...toneResult(next)});
 return <Window title="Czat · Grupa „1TI projekt”" score={res.score} max={res.max}>
  <div className="pm-chat" aria-label="Rozmowa na grupie klasowej">{chat.map((c,i)=><div key={i} className={`pm-msg ${c.angry?'angry':''}`}><b>{c.who}</b><p>{c.text}</p></div>)}</div>
  <fieldset className="pm-step"><legend>1. Jesteś w grupie z Bartkiem. Co robisz najpierw?</legend>
   <div className="choices">{orderOptions(optionKey('proMail','move',firstMove.map(o=>o.text)),firstMove).map(([i,o],pos)=><button key={o.text} data-option={i} className={`choice ${mv?.choice===i?'selected':''}`} aria-pressed={mv?.choice===i} disabled={mv?.ok&&mv.choice!==i} onClick={()=>save(chooseMove(value,i))}><span className="choice-letter">{String.fromCharCode(65+pos)}</span><span>{o.text}</span></button>)}</div>
   {mv&&<div className={`pm-feedback ${mv.ok?'ok':'retry'}`} role="status"><Icon name={mv.ok?'check':'warning'} size={20}/><p>{mv.ok?`${mv.tries===1?'+1 pkt.':'+0,5 pkt.'} Netykieta: krytykuj prywatnie, chwal publicznie. Rozmowa w cztery oczy nie upokarza Bartka przed klasą.`:firstMove[mv.choice].why}</p></div>}
  </fieldset>
  {mv?.ok&&<fieldset className="pm-step"><legend>2. Napisz do Bartka zamiast Marka</legend>
   <p className="small">Ten sam cel: slajdy 5–8 mają być gotowe. Ale bez krzyku i obrażania. Napisz prywatną wiadomość asertywną: mówisz o problemie, swoich potrzebach i prosisz o konkret.</p>
   <label htmlFor={`${data.id}-tone`}>Twoja wiadomość do Bartka</label>
   <textarea id={`${data.id}-tone`} rows={4} maxLength={600} value={value.text||''} disabled={solved} placeholder="Bartek, …" onChange={e=>save({...value,text:e.target.value,dirty:!!value.report})}/>
   <div className="inline-actions"><button className="btn" disabled={solved||!(value.text||'').trim()} onClick={()=>save(checkTone(value))}>Sprawdź ton <Icon name="right" size={18}/></button></div>
   <Report items={toneCriteria} report={value.report} dirty={value.dirty}/>
   {solved&&<div className="pm-feedback ok" role="status"><Icon name="check" size={20}/><p>Asertywnie: jasno, z szacunkiem i z konkretem. Taka wiadomość ma szansę zadziałać, a krzyk tylko zamyka rozmowę.</p></div>}
  </fieldset>}
 </Window>;
}

export default function ProMail(props){
 const m=props.data.mode;
 return m==='spot'?<Spot {...props}/>:m==='tone'?<Tone {...props}/>:<Compose {...props}/>;
}
