import React,{useEffect,useRef,useState} from 'react';
import {Icon} from '../icons.jsx';
import {checkDocx,resultValue,savedResults,docxMax,outline,tocs} from '../../content/sims/docxCheck.js';
import {styleProp} from '../../content/sims/docx/model.js';
import './docxCheck.css';

// Sprawdzarka pliku DOCX: uczeń wgrywa plik z Worda, przeglądarka czyta go lokalnie (nic nie wysyła),
// pokazuje uproszczony podgląd „kartki” z konspektem i od razu ocenia zadania z danych lekcji.
// Do stanu lekcji (onChange) trafiają tylko: wyniki sprawdzeń (tak/nie), nazwa pliku, data i liczba prób.

const fmt=n=>String(Math.round(n*10)/10).replace('.',',');
const ACCEPT='.docx,.docm,.dotx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const slug=s=>s.replace(/[^a-z0-9]+/g,'-');
const PL_START={nextPage:'od nowej strony',continuous:'ciągły (ta sama strona)',evenPage:'od strony parzystej',oddPage:'od strony nieparzystej',nextColumn:'od nowej kolumny'};

// Kontrast koloru stylu z białym tłem — jasnych kolorów nie przenosimy do podglądu (czytelność, WCAG).
function readable(hex){if(!/^[0-9a-f]{6}$/i.test(hex||''))return null;const l=[0,2,4].map(i=>{const c=parseInt(hex.slice(i,i+2),16)/255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;});const L=0.2126*l[0]+0.7152*l[1]+0.0722*l[2];return 1.05/(L+0.05)>=4.6?'#'+hex:null;}
const px=pt=>`${Math.max(12,Math.min(30,pt*1.2))}px`;

function Seg({g,ctx}){
 const {model,urls,done}=ctx;
 const innermost=g.fids?.length?model.fieldById[g.fids[g.fids.length-1]]:null;
 if(g.t==='text'&&innermost&&(innermost.type==='PAGE'||innermost.type==='NUMPAGES')){
  if(done.has(innermost.id))return null;done.add(innermost.id);
  return <span className="dxc-chip">{innermost.type==='PAGE'?'[nr strony]':'[liczba stron]'}</span>;
 }
 let el;
 if(g.t==='text'){
  if(g.v==='\t')el=<span className="dxc-tab"> </span>;
  else{const st={};if(g.bold)st.fontWeight=700;if(g.italic)st.fontStyle='italic';if(g.underline)st.textDecoration='underline';if(g.size)st.fontSize=px(g.size);if(g.caps)st.textTransform='uppercase';
   el=<span style={st} className={innermost&&['SEQ','REF','PAGEREF'].includes(innermost.type)?'dxc-field':undefined}>{g.v}</span>;}
 }else if(g.t==='br')el=g.kind==='page'?<span className="dxc-pb" role="separator" aria-label="Podział strony">podział strony</span>:g.kind==='column'?<span className="dxc-pb dxc-colbr">podział kolumny</span>:<br/>;
 else if(g.t==='img'){
  const w=g.w?Math.round(g.w*30):null;
  el=g.target&&urls[g.target]?<img className="dxc-img" src={urls[g.target]} alt={g.alt||'Obraz z dokumentu (bez tekstu alternatywnego)'} style={w?{width:`${w}px`}:undefined}/>
   :<span className="dxc-obj">{g.chart?'[wykres Worda]':g.object?'[obiekt osadzony]':'[obraz]'}{g.alt?` ${g.alt}`:''}</span>;
 }else if(g.t==='box')el=<span className="dxc-box"><span className="dxc-box-label">pole tekstowe</span>{g.ids.map(id=>model.byId[id]).filter(Boolean).map(p=><span key={p.id} className="dxc-box-p">{p.segs.map((x,i)=><Seg key={i} g={x} ctx={ctx}/>)}</span>)}</span>;
 else if(g.t==='cref'){const n=model.comments.findIndex(c=>c.id===g.id);el=<sup className="dxc-cref">K{n+1}</sup>;}
 else return null;
 if(g.cm&&g.t==='text')el=<mark className="dxc-cm">{el}</mark>;
 if(g.ins)el=<ins className="dxc-ins"><span className="sr-only">[wstawiono: </span>{el}<span className="sr-only">]</span></ins>;
 if(g.del)el=<del className="dxc-del"><span className="sr-only">[usunięto: </span>{el}<span className="sr-only">]</span></del>;
 return el;
}

function Para({p,ctx}){
 const {model,hl,tocStart,inToc,pid}=ctx;
 const st={};
 const size=styleProp(model.styles,p.styleId,'size');
 if(p.styleKey!=='normal'&&size)st.fontSize=px(size);
 if(styleProp(model.styles,p.styleId,'bold'))st.fontWeight=700;
 const col=readable(styleProp(model.styles,p.styleId,'color'));if(col&&p.styleKey!=='normal')st.color=col;
 if(p.align==='center')st.textAlign='center';else if(p.align==='right')st.textAlign='right';
 const label=p.styleKey==='normal'?null:p.styleName;
 const toc=inToc.has(p.id);
 return <>
  {tocStart.has(p.id)&&<div className="dxc-toc-label">{tocStart.get(p.id)}</div>}
  {p.pageBreakBefore&&<span className="dxc-pb" role="separator" aria-label="Podział strony przed akapitem">podział strony</span>}
  <div id={pid(p.id)} tabIndex={-1} className={`dxc-p dxc-s-${slug(p.styleKey)} ${p.level?'is-heading':''} ${toc?'dxc-in-toc':''} ${hl.has(p.id)?'is-hl':''}`} style={st}>
   {label&&<span className="dxc-style">{label}</span>}
   {p.list&&<span className="dxc-list">{p.list} </span>}
   {p.segs.map((g,i)=><Seg key={i} g={g} ctx={ctx}/>)}
   {!p.segs.length&&<span className="dxc-empty" aria-hidden="true">¶</span>}
  </div>
 </>;
}

function Block({b,ctx}){
 if(b.kind==='p')return <Para p={b} ctx={ctx}/>;
 return <div id={ctx.pid(b.id)} className={`dxc-tablewrap ${ctx.hl.has(b.id)?'is-hl':''}`} tabIndex={0} role="region" aria-label="Tabela z dokumentu">
  <table className="dxc-table"><tbody>{b.rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} colSpan={c.span>1?c.span:undefined}>{c.blocks.map(x=><Block key={x.id} b={x} ctx={ctx}/>)}</td>)}</tr>)}</tbody></table>
 </div>;
}

function HeaderFooter({kind,sec,i,ctx}){
 const path=sec.eff[kind].default;const part=path&&ctx.model.parts[path];
 const name=kind==='header'?'Nagłówek strony':'Stopka';
 const linked=i>0&&sec.linked[kind].default&&path;
 const hl=ctx.hl.has(kind);
 return <div id={i===0?ctx.pid(kind):undefined} tabIndex={-1} className={`dxc-hf dxc-hf-${kind} ${hl?'is-hl':''}`}>
  <span className="dxc-hf-label">{name}{linked?' · połączony z poprzednim':''}{sec.titlePg?' · inna pierwsza strona':''}</span>
  {part&&part.blocks.some(b=>b.kind==='table'||b.text.trim()||b.segs.length)?part.blocks.map(b=><Block key={b.id} b={b} ctx={ctx}/>):<span className="dxc-none">{name.toLowerCase()} — pusta</span>}
 </div>;
}

function Preview({model,urls,hl,pid}){
 const t=tocs(model);
 const inToc=new Set(t.flatMap(x=>[...x.paraIds]));
 const tocStart=new Map(t.map(x=>[x.field.paras.find(id=>model.byId[id]?.kind==='p'),x.figures?`Pole: spis z etykietą „${x.label}” (wynik z ostatniej aktualizacji)`:'Pole: spis treści (wynik z ostatniej aktualizacji)']).filter(([k])=>k));
 const ctx={model,urls,hl,pid,inToc,tocStart,done:new Set()};
 const many=model.sections.length>1;
 return <div className="dxc-doc">
  {model.sections.map((s,i)=><React.Fragment key={i}>
   {i>0&&<div className="dxc-secbreak" role="separator">Podział sekcji · sekcja {i+1} zaczyna się {PL_START[s.start]||s.start}</div>}
   <div id={pid('section-'+i)} tabIndex={-1} className={`dxc-page ${s.landscape?'is-landscape':''} ${hl.has('section-'+i)||hl.has('sections')?'is-hl':''}`}>
    {(many||s.landscape||s.cols>1)&&<p className="dxc-secinfo">{many?`Sekcja ${i+1} · `:''}{s.landscape?'pozioma':'pionowa'}{s.cols>1?` · ${s.cols} kolumny`:''}</p>}
    <HeaderFooter kind="header" sec={s} i={i} ctx={ctx}/>
    <div className="dxc-content" style={s.cols>1?{columnCount:s.cols}:undefined}>{model.blocks.filter(b=>b.section===i).map(b=><Block key={b.id} b={b} ctx={ctx}/>)}</div>
    <HeaderFooter kind="footer" sec={s} i={i} ctx={ctx}/>
   </div>
  </React.Fragment>)}
  {(model.comments.length>0||model.revisions.length>0)&&<div id={pid('comments')} tabIndex={-1} className={`dxc-review ${hl.has('comments')||hl.has('revisions')?'is-hl':''}`}>
   {model.revisions.length>0&&<p><b>Zmiany śledzone: {model.revisions.length}.</b> <ins className="dxc-ins">Wstawienia są podkreślone</ins>, <del className="dxc-del">usunięcia przekreślone</del>.{model.trackRevisions?' Śledzenie zmian jest włączone.':''}</p>}
   {model.comments.length>0&&<><p><b>Komentarze ({model.comments.length})</b> — w tekście oznaczone kolorem i numerem K.</p><ol className="dxc-comments">{model.comments.map((c,i)=><li key={c.id}><b>K{i+1}{c.author?` · ${c.author}`:''}:</b> {c.text||<i>(pusty)</i>}{c.anchor&&<span className="dxc-anchor"> — dotyczy: „{c.anchor.length>60?c.anchor.slice(0,57)+'…':c.anchor}”</span>}</li>)}</ol></>}
  </div>}
 </div>;
}

function Outline({model,jump}){
 const items=outline(model);
 return <nav className="dxc-outline" aria-label="Konspekt dokumentu">
  <h4>Konspekt</h4>
  <p className="dxc-outline-note">Tak jak Widok → Okienko nawigacji w Wordzie.</p>
  {items.length?<ul>{items.map(h=><li key={h.id} style={{paddingLeft:`${(h.level-1)*14}px`}}><button type="button" onClick={()=>jump(h.id)}><span className="sr-only">Poziom {h.level}: </span>{h.text}</button></li>)}</ul>
   :<p className="dxc-none">Brak nagłówków. Okienko nawigacji w Wordzie też będzie puste — nadaj tytułom style Nagłówek 1 i 2.</p>}
 </nav>;
}

function CheckList({results,live,onShow,shown}){
 return <ol className="dxc-checks">{results.map(r=><li key={r.id} className={r.ok?'is-ok':'is-bad'}>
  <span className="dxc-mark" aria-hidden="true"><Icon name={r.ok?'check':'close'} size={18}/></span>
  <div className="dxc-check-body">
   <p className="dxc-check-head"><b>{r.label}</b><span className="dxc-tag">{r.ok?`Zaliczone · ${fmt(r.points)} pkt`:`Do poprawy · 0/${fmt(r.points)} pkt`}</span></p>
   {r.detail&&<p className="dxc-detail">{r.detail}</p>}
   {!r.ok&&r.hint&&<p className="dxc-hint"><b>Jak poprawić w Wordzie:</b> {r.hint}</p>}
   {!r.ok&&live&&r.targets.length>0&&<button type="button" className="text-button dxc-show" aria-pressed={shown===r.id} onClick={()=>onShow(r)}><Icon name="search" size={16}/>{shown===r.id?'Podświetlone w podglądzie':'Pokaż w podglądzie'}</button>}
  </div>
 </li>)}</ol>;
}

export default function DocxCheck({data,value,onChange}){
 const v=value||{};
 const max=docxMax(data);
 const [check,setCheck]=useState(null);
 const [status,setStatus]=useState({kind:'idle',text:''});
 const [drag,setDrag]=useState(false);
 const [shown,setShown]=useState(null);
 const [urls,setUrls]=useState({});
 const urlsRef=useRef({});
 const busy=useRef(false);
 const pid=id=>`dxc-${data.id}-${id}`;
 const inputId=pid('file');
 useEffect(()=>()=>Object.values(urlsRef.current).forEach(u=>URL.revokeObjectURL(u)),[]);

 async function handle(file){
  if(!file||busy.current)return;
  busy.current=true;setStatus({kind:'busy',text:`Sprawdzam plik ${file.name}… (lokalnie, w tej przeglądarce)`});setShown(null);
  try{
   const bytes=new Uint8Array(await file.arrayBuffer());
   const res=await checkDocx(bytes,data,file.name);
   Object.values(urlsRef.current).forEach(u=>URL.revokeObjectURL(u));
   const next={};for(const [k,m] of Object.entries(res.model.media))next[k]=URL.createObjectURL(new Blob([m.bytes],{type:m.type}));
   urlsRef.current=next;setUrls(next);
   res.model.media={};// bajty obrazów nie są dalej potrzebne
   setCheck({...res,fileName:file.name});
   const bad=res.results.filter(r=>!r.ok).length;
   setStatus({kind:'ok',text:`Sprawdzono plik ${file.name}: ${fmt(res.score)}/${max} pkt. ${bad?`Do poprawy: ${bad}. Popraw w Wordzie, zapisz (Ctrl+S) i wgraj plik ponownie.`:'Wszystko zaliczone!'}`});
   onChange(resultValue(data,res,file.name,new Date(),v));
  }catch(e){
   setStatus({kind:'error',text:e?.code?e.message:'Nie udało się odczytać pliku. Zapisz go w Wordzie jako .docx i spróbuj ponownie.'});
  }finally{busy.current=false;}
 }
 function show(r){
  setShown(r.id);
  requestAnimationFrame(()=>{const t=r.targets[0];const id=t==='revisions'?'comments':t;const el=document.getElementById(pid(id));if(el){el.scrollIntoView({block:'center',behavior:'smooth'});el.focus({preventScroll:true});}});
 }
 function jump(id){const el=document.getElementById(pid(id));if(el){el.scrollIntoView({block:'center',behavior:'smooth'});el.focus({preventScroll:true});}}

 const live=!!check;
 const results=check?.results||savedResults(data,v);
 const score=check?check.score:(v.score||0);
 const hl=new Set(shown&&check?check.results.find(r=>r.id===shown)?.targets||[]:[]);
 const fileName=check?.fileName||v.fileName;
 const okCount=results?results.filter(r=>r.ok).length:0;
 return <section className="dxc activity" aria-labelledby={pid('title')}>
  <div className="dxc-bar"><Icon name="doc" size={20}/><span className="dxc-app">Sprawdzarka pliku Word</span>{fileName&&<span className="dxc-file">{fileName}</span>}<span className="dxc-score">Punkty: {fmt(results?score:0)}/{max}</span></div>
  <div className="dxc-body">
   <h3 id={pid('title')}>{data.title}</h3>
   <p className="dxc-privacy"><Icon name="lock" size={20}/><span><b>Plik nie opuszcza Twojego komputera — sprawdza go przeglądarka.</b> Nic nie jest wysyłane ani zapisywane. Po odświeżeniu strony zostaje tylko wynik.</span></p>
   {data.intro&&<p className="dxc-intro">{data.intro}</p>}
   <div className={`dxc-drop ${drag?'is-drag':''}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files?.[0]);}}>
    <Icon name="doc" size={34}/>
    <p className="dxc-drop-text">Przeciągnij tu swój plik{data.filename?<> <b>{data.filename}</b></>:' .docx'} albo</p>
    <input id={inputId} className="dxc-input" type="file" accept={ACCEPT} onChange={e=>{const f=e.target.files?.[0];e.target.value='';handle(f);}}/>
    <label htmlFor={inputId} className="btn dxc-pick"><Icon name="search" size={18}/>{results?'Wgraj poprawiony plik':'Wybierz plik DOCX'}</label>
    <p className="dxc-drop-note">Najpierw zapisz dokument w Wordzie (Ctrl+S). Możesz wgrywać plik wiele razy — liczy się ostatnie sprawdzenie, bez kary za poprawki.</p>
   </div>
   <div role="status" aria-live="polite" className={`dxc-status is-${status.kind}`}>{status.text&&<>{status.kind==='error'&&<Icon name="warning" size={18}/>}<span>{status.text}</span></>}</div>
   {check?.warning&&<p className="dxc-warning"><Icon name="warning" size={18}/><span>{check.warning}</span></p>}
   {results&&<>
    <p className="dxc-summary"><b>Wynik: {fmt(score)}/{max} pkt</b> · zaliczone {okCount} z {results.length}{v.checkedAt&&!live?` · sprawdzono ${new Date(v.checkedAt).toLocaleString('pl-PL',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'numeric'})}`:''}</p>
    <CheckList results={results} live={live} onShow={show} shown={shown}/>
   </>}
   {!live&&results&&<p className="dxc-note">Podgląd dokumentu jest widoczny tylko zaraz po wgraniu — plik nie jest nigdzie przechowywany. Wgraj go ponownie, aby zobaczyć podgląd i szczegóły.</p>}
   {live&&<div className="dxc-viewer">
    <Outline model={check.model} jump={jump}/>
    <div className="dxc-preview-wrap">
     <p className="dxc-legend">Podgląd uproszczony — pokazuje strukturę, nie dokładny wygląd stron. Po lewej stronie akapitu: nazwa stylu (Normalny nie jest podpisany).</p>
     <div className="dxc-preview" role="region" aria-label="Podgląd dokumentu" tabIndex={0}><Preview model={check.model} urls={urls} hl={hl} pid={pid}/></div>
    </div>
   </div>}
  </div>
 </section>;
}
