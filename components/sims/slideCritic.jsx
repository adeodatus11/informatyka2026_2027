import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {orderOptions,optionKey} from './optionOrder.js';
import {pts,issues,sets,slideDataUrl,toggleIssue,checkSlide,slidePoints,feedbackFor,errorsResult,layouts,layoutTasks,chooseLayout,layoutResult,layoutFeedback} from '../../content/sims/slideCritic.js';
import './slideCritic.css';

// Krytyk slajdów: tryb "errors" (data.set: basics | chopin) i tryb "layout" (dobór układu).
export default function SlideCritic(props){return props.data.mode==='layout'?<LayoutPicker {...props}/>:<ErrorHunt {...props}/>;}

function Top({tag,children}){
 return <div className="slc-top"><div><span className="slc-tag">{tag}</span><small>symulacja — miniatury odtworzone, firmy i dane fikcyjne</small></div><div className="slc-counters" aria-live="polite">{children}</div></div>;
}
function Feedback({ok,children}){return <div className={`slc-feedback ${ok?'ok':'retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;}

function ErrorHunt({data,value={},onChange}){
 const set=sets[data.set||'basics'];const st=value.slides||{};
 const firstOpen=set.slides.findIndex(s=>!st[s.id]?.ok);
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const slide=set.slides[idx],cur=st[slide.id]||{},sel=cur.sel||[];
 const res=errorsResult(data.set||'basics',value);
 function save(next){const v={...value,slides:{...st,[slide.id]:next}};onChange({...v,...errorsResult(data.set||'basics',v)});}
 const offer=orderOptions(optionKey('slideCritic',data.id,set.offer),set.offer.filter(i=>i!=='ok'));
 const nextOpen=set.slides.findIndex((s,i)=>i>idx&&!st[s.id]?.ok);
 const fb=feedbackFor(slide,cur);
 return <div className="slc-sim">
  <Top tag="Krytyk slajdów"><span>Punkty: <b>{pts(res.score)}</b>/{res.max}</span><span>Slajdy: <b>{res.solved}</b>/{set.slides.length}</span></Top>
  <p className="slc-instr">{set.title}. Zaznacz <b>wszystkie</b> problemy na slajdzie albo „w porządku”. 2 pkt za pierwszą próbę, 1 pkt po poprawce.</p>
  <nav className="slc-tabs" aria-label="Slajdy do oceny">{set.slides.map((s,i)=><button key={s.id} className={`${i===idx?'current':''} ${st[s.id]?.ok?'solved':''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)}>{st[s.id]?.ok&&<Icon name="check" size={16}/>}{s.name}{st[s.id]?.ok&&<span className="sr-only"> — sprawdzony</span>}</button>)}</nav>
  <div className="slc-work">
   <figure className="slc-slide">
    <img src={slideDataUrl(slide)} alt={slide.alt} width="960" height="540"/>
    <figcaption>{slide.name} · podgląd w trybie edycji</figcaption>
    <div className="slc-anim"><p className="slc-label"><Icon name="play" size={16}/>Okienko animacji</p>{slide.anim?.length?<ol>{slide.anim.map(a=><li key={a}>{a}</li>)}</ol>:<p className="slc-muted">Brak animacji na tym slajdzie.</p>}</div>
   </figure>
   <fieldset className="slc-issues" disabled={cur.ok}>
    <legend>Co jest nie tak na slajdzie? <span>(wybrano: {sel.length})</span></legend>
    {offer.map(([i,id])=><button key={id} data-option={i} className={`slc-issue ${sel.includes(id)?'picked':''}`} aria-pressed={sel.includes(id)} onClick={()=>save({...cur,sel:toggleIssue(sel,id),checked:false})}>
     <span className="slc-box" aria-hidden="true">{sel.includes(id)&&<Icon name="check" size={14}/>}</span><span><b>{issues[id].label}</b><small>{issues[id].short}</small></span></button>)}
    <button className={`slc-issue slc-ok ${sel.includes('ok')?'picked':''}`} aria-pressed={sel.includes('ok')} onClick={()=>save({...cur,sel:toggleIssue(sel,'ok'),checked:false})}>
     <span className="slc-box" aria-hidden="true">{sel.includes('ok')&&<Icon name="check" size={14}/>}</span><span><b>{issues.ok.label}</b><small>{issues.ok.short}</small></span></button>
    <div className="inline-actions"><button className="btn" disabled={!sel.length||cur.ok} onClick={()=>save(checkSlide(cur,slide))}>Sprawdź slajd <Icon name="right" size={18}/></button></div>
   </fieldset>
  </div>
  {cur.checked&&!cur.ok&&<Feedback ok={false}><p><b>Jeszcze nie.</b> Popraw zaznaczenie i sprawdź ponownie.</p><ul>{fb.map(t=><li key={t}>{t}</li>)}</ul></Feedback>}
  {cur.ok&&<Feedback ok><p><b>{slidePoints(cur)===2?'Trafione za pierwszym razem: +2 pkt.':'Poprawione: +1 pkt.'}</b></p>
   {slide.issues.length?<ul>{slide.issues.map(i=><li key={i}><b>{issues[i].label}:</b> {slide.why[i]}</li>)}</ul>:<p>Ten slajd nie ma błędów.</p>}
   <p className="slc-fix"><b>Jak to naprawić w PowerPoincie:</b> {slide.fix}</p></Feedback>}
  {cur.ok&&(nextOpen>=0||firstOpen>=0?<div className="inline-actions"><button className="btn secondary" onClick={()=>setIdx(nextOpen>=0?nextOpen:firstOpen)}>Następny slajd <Icon name="right" size={18}/></button></div>
   :<p className="slc-done" role="status"><Icon name="trophy" size={22}/>Wszystkie slajdy ocenione. {res.summary}.</p>)}
 </div>;
}

function Thumb({id}){
 const b='#9aa7b8',d='#4a5a6b';
 const box={title:<><rect x="14" y="20" width="72" height="12" fill={d}/><rect x="26" y="38" width="48" height="6" fill={b}/></>,
  obj:<><rect x="8" y="6" width="84" height="9" fill={d}/>{[22,32,42].map(y=><rect key={y} x="12" y={y} width="60" height="5" fill={b}/>)}</>,
  twoObj:<><rect x="8" y="6" width="84" height="9" fill={d}/><rect x="8" y="20" width="40" height="32" fill={b}/><rect x="52" y="20" width="40" height="32" fill={b}/></>,
  comparison:<><rect x="8" y="6" width="84" height="9" fill={d}/><rect x="8" y="20" width="40" height="6" fill={d}/><rect x="52" y="20" width="40" height="6" fill={d}/><rect x="8" y="29" width="40" height="23" fill={b}/><rect x="52" y="29" width="40" height="23" fill={b}/></>,
  secHead:<><rect x="10" y="26" width="76" height="12" fill={d}/><rect x="10" y="42" width="50" height="5" fill={b}/></>,
  picTx:<><rect x="8" y="8" width="34" height="9" fill={d}/>{[22,30,38].map(y=><rect key={y} x="8" y={y} width="32" height="4" fill={b}/>)}<rect x="48" y="6" width="44" height="46" fill={b}/><circle cx="62" cy="20" r="5" fill="#fff"/><polygon points="50,50 66,30 80,50" fill="#fff"/></>}[id];
 return <svg viewBox="0 0 100 58" aria-hidden="true" focusable="false"><rect x="0.5" y="0.5" width="99" height="57" fill="#fff" stroke="#c3cdd9"/>{box}</svg>;
}

function LayoutPicker({value={},onChange}){
 const st=value.tasks||{};const res=layoutResult(value);
 function pick(t,l){const v=chooseLayout(value,t,l);onChange({...v,...layoutResult(v)});}
 return <div className="slc-sim">
  <Top tag="Układ slajdu"><span>Punkty: <b>{pts(res.score)}</b>/{res.max}</span><span>Dobrane: <b>{res.solved}</b>/{layoutTasks.length}</span></Top>
  <p className="slc-instr">W PowerPoincie: <b>Narzędzia główne → Układ</b>. Do każdej treści wybierz układ z galerii. 1 pkt za pierwszą próbę, 0,5 pkt po poprawce.</p>
  <ol className="slc-tasks">{layoutTasks.map((t,n)=>{const s=st[t.id]||{};return <li key={t.id} className={s.ok?'solved':''}>
   <fieldset><legend><span className="slc-num" aria-hidden="true">{n+1}</span>{t.text}{s.ok&&<span className="slc-ok-mark"><Icon name="check" size={16}/>dobrane</span>}</legend>
    <div className="slc-layouts">{layouts.map(l=><button key={l.id} className={`slc-layout ${s.choice===l.id?'picked':''}`} aria-pressed={s.choice===l.id} disabled={s.ok&&s.choice!==l.id} onClick={()=>pick(t.id,l.id)}><Thumb id={l.id}/><span>{l.name}</span></button>)}</div>
    {s.choice&&<Feedback ok={s.ok}>{s.ok?<>{s.tries===1?'+1 pkt. ':'+0,5 pkt. '}{layoutFeedback(t.id,s.choice)}</>:layoutFeedback(t.id,s.choice)}</Feedback>}
   </fieldset></li>;})}</ol>
  {res.done&&<p className="slc-done" role="status"><Icon name="trophy" size={22}/>Wszystkie układy dobrane. W PowerPoincie zmienisz układ jednym kliknięciem, bez przesuwania pól.</p>}
 </div>;
}
