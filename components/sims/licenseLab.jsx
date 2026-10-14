import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {pts,categories,programs,chooseShelf,shelfResult,visibleQuestions,licenses,licenseFrom,briefs,checkBrief,setBriefAnswer,photo,footerParts,footerPreview,checkFooter,footerPoints,cardComplete,cardFooter,cardText,galleries,creatorResult,keys,cases,setCase,checkCase,checkResult} from '../../content/sims/licenseLab.js';
import {orderOptions,optionKey} from './optionOrder.js';
import './licenseLab.css';

const rightLabel={ok:'Wolno',no:'Nie wolno',warn:'Warunek'};
const rightIcon={ok:'check',no:'close',warn:'warning'};

function Top({tag,note,children}){
 return <div className="lic-top"><div><span className="lic-tag">{tag}</span><small>{note}</small></div><div className="lic-counters" aria-live="polite">{children}</div></div>;
}
function Feedback({ok,children}){
 return <div className={`lic-feedback ${ok?'ok':'retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;
}
function Rights({id}){
 const l=licenses[id];if(!l)return null;
 return <ul className="lic-rights">{l.rights.map(([k,t])=><li key={t} className={`lic-right lic-right-${k}`}><Icon name={rightIcon[k]} size={18}/><span><b>{rightLabel[k]}:</b> {t}</span></li>)}</ul>;
}
async function copyText(text,setMsg){
 try{await navigator.clipboard.writeText(text);setMsg('Skopiowano. Wklej tekst w Wordzie skrótem Ctrl+V.');}
 catch{setMsg('Przeglądarka zablokowała schowek. Zaznacz tekst karty myszką i naciśnij Ctrl+C.');}
}

// ---------- Półka licencji ----------
function Shelf({value={},onChange}){
 const shelf=value.shelf||{};const res=shelfResult(value);
 function pick(pid,cat){const s=chooseShelf(shelf,pid,cat);onChange({...value,shelf:s,...shelfResult({shelf:s})});}
 return <div className="lic-sim">
  <Top tag="Półka licencji" note="symulacja — fakty o licencjach: stan na 2026 r."><span>Punkty: <b>{pts(res.score)}</b>/{res.max}</span><span>Na półkach: <b>{res.solved}</b>/{programs.length}</span></Top>
  <div className="lic-shelves" aria-label="Półki z rodzajami licencji">{categories.map(c=>{const on=programs.filter(p=>p.cat===c.id&&shelf[p.id]?.ok);return <section key={c.id} className={`lic-shelf lic-cat-${c.id}`} aria-label={`Półka: ${c.label}`}>
   <h3>{c.label}</h3><p className="lic-shelf-short">{c.short}</p><p className="lic-shelf-text">{c.text}</p>
   <p className="lic-shelf-items">{on.length?on.map(p=><span key={p.id}>{p.name}</span>):<em>pusto</em>}</p>
  </section>;})}</div>
  <p className="lic-instr">Dla każdego programu wybierz półkę. Pełny punkt za pierwszą próbę, 0,5 pkt po poprawce.</p>
  <div className="lic-programs">{programs.map(p=>{const st=shelf[p.id]||{};return <fieldset key={p.id} className={`lic-program ${st.ok?'solved':''}`}>
   <legend><b>{p.name}</b> <span>— {p.what}</span>{st.ok&&<span className="lic-ok-mark"><Icon name="check" size={16}/>na półce</span>}</legend>
   <div className="lic-cat-buttons">{categories.map(c=><button key={c.id} className={`lic-cat-btn lic-cat-${c.id} ${st.choice===c.id?'picked':''}`} aria-pressed={st.choice===c.id} disabled={st.ok&&st.choice!==c.id} onClick={()=>pick(p.id,c.id)}>{c.label}</button>)}</div>
   {st.choice&&<Feedback ok={st.ok}>{st.ok?<>{st.tries===1?'Dobrze: +1 pkt. ':'Poprawione: +0,5 pkt. '}{p.fact}</>:<>Nie ta półka. {p.hint}</>}</Feedback>}
  </fieldset>;})}</div>
  {res.done&&<p className="lic-done" role="status"><Icon name="trophy" size={22}/>Wszystkie programy na półkach. {res.summary}.</p>}
 </div>;
}

// ---------- Kreator ----------
function Questions({answers={},onAnswer,disabled,idPrefix}){
 return <div className="lic-questions">{visibleQuestions(answers).map((q,i)=><fieldset key={q.id} className="lic-question">
  <legend><span className="lic-qnum" aria-hidden="true">{i+1}</span>{q.label}</legend>
  <div className="lic-qopts">{q.options.map(([v,label])=><button key={v} id={`${idPrefix}-${q.id}-${v}`} className={`lic-opt ${answers[q.id]===v?'picked':''}`} aria-pressed={answers[q.id]===v} disabled={disabled} onClick={()=>onAnswer(q.id,v)}>{answers[q.id]===v&&<Icon name="check" size={16}/>}{label}</button>)}</div>
 </fieldset>)}</div>;
}
function Briefs({value,save}){
 const b=value.briefs||{};
 const firstOpen=briefs.findIndex(x=>!b[x.id]?.ok);
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const br=briefs[idx],st=b[br.id]||{},answers=st.answers||{};const got=licenseFrom(answers);
 const nextOpen=briefs.findIndex((x,i)=>i>idx&&!b[x.id]?.ok);
 return <div className="lic-panel">
  <nav className="lic-brief-tabs" aria-label="Zlecenia">{briefs.map((x,i)=><button key={x.id} className={`${i===idx?'current':''} ${b[x.id]?.ok?'solved':''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)}><Icon name={b[x.id]?.ok?'check':x.icon} size={18}/><span><small>{x.tag}</small>{x.title}</span>{b[x.id]?.ok&&<span className="sr-only"> — gotowe</span>}</button>)}</nav>
  <div className="lic-brief"><p className="lic-label">Zlecenie {idx+1}: {br.tag}</p><h3>{br.title}</h3><p>{br.text}</p></div>
  <Questions answers={answers} disabled={st.ok} idPrefix={`lic-${br.id}`} onAnswer={(q,v)=>save({briefs:setBriefAnswer(b,br.id,q,v)})}/>
  <div className="inline-actions"><button className="btn" disabled={!got||st.ok} onClick={()=>save({briefs:checkBrief(b,br.id)})}>Sprawdź licencję <Icon name="right" size={18}/></button>{got&&!st.ok&&<span className="lic-pending">Kreator proponuje: <b>{licenses[got].name}</b></span>}</div>
  {st.msg&&<Feedback ok={st.ok}>{st.ok?<>{st.tries===1?'+1 pkt. ':'+0,5 pkt. '}{st.msg}</>:st.msg}</Feedback>}
  {st.ok&&<div className="lic-license-card"><p className="lic-license-name"><Icon name="shield" size={22}/>{licenses[br.expect].name}</p><Rights id={br.expect}/>{licenses[br.expect].url&&<p className="small lic-url">Treść licencji: {licenses[br.expect].url}</p>}</div>}
  {st.ok&&<div className="inline-actions">{nextOpen>=0||firstOpen>=0?<button className="btn secondary" onClick={()=>setIdx(nextOpen>=0?nextOpen:firstOpen)}>Następne zlecenie <Icon name="right" size={18}/></button>:<p className="lic-done" role="status"><Icon name="trophy" size={20}/>Wszystkie zlecenia gotowe. Teraz stopka cudzego zdjęcia.</p>}</div>}
 </div>;
}
function Footer({value,save}){
 const f=value.footer||{};const sel=f.sel||[];
 const parts=orderOptions(optionKey('licenseLab','footer',footerParts.map(p=>p.text)),footerParts);
 function toggle(id){if(f.ok)return;save({footer:{...f,sel:sel.includes(id)?sel.filter(x=>x!==id):[...sel,id],checked:false}});}
 const byId=id=>footerParts.find(p=>p.id===id);
 return <div className="lic-panel">
  <div className="lic-photo">
   <div className="lic-photo-frame" aria-label="Strona zdjęcia w galerii — symulacja"><div className="lic-address"><span className="lic-lock" aria-hidden="true"/>{photo.source}</div>
    <div className="lic-photo-body"><div className="lic-photo-img" aria-hidden="true"><span className="lic-sun"/></div>
     <dl><div><dt>Tytuł</dt><dd>{photo.title}</dd></div><div><dt>Autor</dt><dd>{photo.author}</dd></div><div><dt>Licencja</dt><dd>{photo.license}</dd></div></dl></div>
   </div>
   <div className="lic-photo-task"><p className="lic-label">Sytuacja</p><p>Do plakatu Waszej aplikacji bierzecie to zdjęcie z galerii CC (symulacja, fikcyjny adres). {photo.change}</p><p>Ułóż stopkę z uznaniem autorstwa: wybierz wszystkie potrzebne elementy i żadnego zbędnego. <b>TASL</b> = Tytuł, Autor, Źródło, Licencja (+ zmiany).</p></div>
  </div>
  <fieldset className="lic-parts"><legend>Elementy stopki (wybrano: {sel.length})</legend>
   <div className="lic-part-list">{parts.map(([i,p])=><button key={p.id} data-option={i} className={`lic-part ${sel.includes(p.id)?'picked':''}`} aria-pressed={sel.includes(p.id)} disabled={f.ok} onClick={()=>toggle(p.id)}><span className="lic-box" aria-hidden="true">{sel.includes(p.id)&&<Icon name="check" size={14}/>}</span>{p.text}</button>)}</div>
  </fieldset>
  <div className="lic-preview"><p className="lic-label">Podgląd stopki pod plakatem</p><p className="lic-preview-text">{footerPreview(sel)||<em>Wybierz elementy powyżej.</em>}</p></div>
  <div className="inline-actions"><button className="btn" disabled={!sel.length||f.ok} onClick={()=>save({footer:{...checkFooter(f),checked:true}})}>Sprawdź stopkę <Icon name="right" size={18}/></button></div>
  {f.checked&&(f.ok?<Feedback ok>{f.tries===1?'Bezbłędnie: +2 pkt.':'Poprawione: +1 pkt.'} Stopka spełnia warunki CC BY-SA 4.0: autor, źródło, licencja, zaznaczona zmiana i ta sama licencja dla przeróbki.</Feedback>
   :<Feedback ok={false}><p>Jeszcze nie. {f.missing?.length?`Brakuje ${f.missing.length} elem.:`:''}</p><ul>{f.missing?.map(id=><li key={id}><b>Brak:</b> {byId(id).why}</li>)}{f.wrong?.map(id=><li key={id}><b>Zbędne „{byId(id).text}”:</b> {byId(id).why}</li>)}</ul></Feedback>)}
  <aside className="lic-galleries"><p className="lic-label"><Icon name="search" size={18}/>Gdzie szukać grafik na licencjach CC (wskazówka, nie musisz teraz wchodzić)</p><ul>{galleries.map(g=><li key={g.name}><a href={g.url} target="_blank" rel="noopener noreferrer">{g.name}</a> — {g.tip}</li>)}</ul></aside>
 </div>;
}
function Card({value,save}){
 const card=value.card||{};const id=licenseFrom(card.answers||{});const ok=cardComplete(card);const [msg,setMsg]=useState('');
 const set=(k,v)=>save({card:{...card,[k]:v}});
 const text=cardText(card,!!value.footer?.ok);
 return <div className="lic-panel">
  <p className="lic-instr">Teraz Wasz projekt: aplikacja, grafika, zdjęcia albo strona z lekcji o WWW. Odpowiedzcie na pytania kreatora — licencja i stopka powstaną same. Wydawca dopisuje uzasadnienie.</p>
  <div className="lic-card-grid">
   <div className="lic-card-form">
    <label htmlFor="lic-card-name">Nazwa projektu</label><input id="lic-card-name" maxLength={60} value={card.name||''} placeholder="np. Plan lekcji 1C" onChange={e=>set('name',e.target.value)}/>
    <label htmlFor="lic-card-team">Autorzy (imiona lub nazwa trójki)</label><input id="lic-card-team" maxLength={60} value={card.team||''} placeholder="np. Ola, Kuba, Wiktor" onChange={e=>set('team',e.target.value)}/>
    <Questions answers={card.answers||{}} idPrefix="lic-card" onAnswer={(q,v)=>{const a={...(card.answers||{}),[q]:v};const vis=new Set(visibleQuestions(a).map(x=>x.id));for(const k of Object.keys(a))if(!vis.has(k))delete a[k];save({card:{...card,answers:a}});}}/>
    <label htmlFor="lic-card-reason">Dlaczego ta licencja? Co odbiorca może, a czego nie? (min. 15 znaków)</label><textarea id="lic-card-reason" rows={3} maxLength={300} value={card.reason||''} placeholder="np. Chcemy, żeby klasa mogła poprawiać aplikację, ale poprawki mają zostać otwarte." onChange={e=>set('reason',e.target.value)}/>
   </div>
   <article className="lic-card-preview" aria-label="Podgląd karty licencyjnej">
    <p className="lic-card-kicker">Karta licencyjna projektu</p>
    <h3>{(card.name||'').trim()||'Nazwa projektu'}</h3>
    <p className="small">Autorzy: {(card.team||'').trim()||'…'}</p>
    {id?<><p className="lic-license-name"><Icon name="shield" size={22}/>{licenses[id].name}</p><Rights id={id}/></>:<p className="muted">Odpowiedz na pytania kreatora, żeby zobaczyć licencję.</p>}
    {(card.reason||'').trim()&&<p><b>Dlaczego:</b> {card.reason.trim()}</p>}
    {id&&<p className="lic-footer-line"><b>Stopka:</b> {cardFooter(card)}</p>}
    {value.footer?.ok&&<p className="lic-footer-line"><b>Cudze materiały:</b> {footerPreview(footerParts.filter(p=>p.required).map(p=>p.id))}</p>}
   </article>
  </div>
  <div className="inline-actions"><button className="btn secondary" disabled={!id} onClick={()=>copyText(text,setMsg)}><Icon name="file" size={18}/>Kopiuj kartę</button>{msg&&<span className="lic-pending" role="status">{msg}</span>}</div>
  {ok?<Feedback ok>Karta kompletna. Pokażcie ją trójce, która będzie Was oceniać.{!value.footer?.ok&&' Brakuje jeszcze poprawnej stopki cudzego zdjęcia (zakładka Stopka).'}</Feedback>:<p className="muted small">Karta jest kompletna, gdy ma nazwę, autorów, odpowiedzi kreatora i uzasadnienie.</p>}
 </div>;
}
function Creator({value={},onChange}){
 const [tab,setTab]=useState('briefs');
 const res=creatorResult(value);const b=value.briefs||{};
 function save(patch){const next={...value,...patch};onChange({...next,...creatorResult(next)});}
 const tabs=[['briefs',`Zlecenia (${res.solved}/${briefs.length})`,'list'],['footer',`Stopka${value.footer?.ok?' ✓':''}`,'camera'],['card',`Karta${cardComplete(value.card)?' ✓':''}`,'idcard']];
 return <div className="lic-sim">
  <Top tag="Kreator licencji" note="symulacja — fikcyjne zlecenia, galeria i klient"><span>Punkty: <b>{pts(res.score)}</b>/{res.max}</span><span>Zlecenia: <b>{res.solved}</b>/{briefs.length}</span><span>Stopka: <b>{footerPoints(value.footer)}</b>/2</span></Top>
  <div className="lic-tabs" role="group" aria-label="Części projektu">{tabs.map(([id,label,icon])=><button key={id} className={tab===id?'current':''} aria-pressed={tab===id} onClick={()=>setTab(id)}><Icon name={icon} size={18}/>{label}</button>)}</div>
  {tab==='briefs'&&<Briefs value={value} save={save}/>}
  {tab==='footer'&&<Footer value={value} save={save}/>}
  {tab==='card'&&<Card value={value} save={save}/>}
  {res.done?<p className="lic-done" role="status"><Icon name="trophy" size={22}/>Projekt wydany: {res.summary}.</p>:<p className="muted small">Do zaliczenia: 4 zlecenia, poprawna stopka i kompletna karta. Zlecenie: 1 pkt (0,5 po poprawce), stopka: 2 pkt (1 po poprawce).{Object.keys(b).length===0?' Zacznijcie od zlecenia 1.':''}</p>}
 </div>;
}

// ---------- Audyt ----------
function Check({value={},onChange}){
 const all=value.cases||{};const res=checkResult(value);
 const firstOpen=cases.findIndex(c=>!all[c.id]?.ok);
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const c=cases[idx],st=all[c.id]||{};
 function save(s){onChange({...value,cases:s,...checkResult({cases:s})});}
 const nextOpen=cases.findIndex((k,i)=>i>idx&&!all[k.id]?.ok);
 return <div className="lic-sim">
  <Top tag="Audyt licencji" note="symulacja — fikcyjne osoby i firmy"><span>Punkty: <b>{pts(res.score)}</b>/{res.max}</span><span>Sprawdzone: <b>{res.solved}</b>/{cases.length}</span></Top>
  <nav className="lic-case-tabs" aria-label="Przypadki">{cases.map((k,i)=><button key={k.id} className={`${i===idx?'current':''} ${all[k.id]?.ok?'solved':''}`} aria-current={i===idx?'step':undefined} aria-label={`Przypadek ${i+1}: ${k.who}${all[k.id]?.ok?' — rozwiązany':''}`} onClick={()=>setIdx(i)}>{all[k.id]?.ok?<Icon name="check" size={16}/>:i+1}</button>)}</nav>
  <div className="lic-case">
   <p className="lic-label">Przypadek {idx+1}: {c.who}</p>
   <p className="lic-case-license">Licencja zdjęcia: <b>{c.license}</b></p>
   <p className="lic-case-usage">{c.usage}</p>
  </div>
  <fieldset className="lic-fs"><legend>1. Werdykt</legend><div className="lic-verdicts">{[['ok','Zgodne z licencją','check'],['bad','Niezgodne z licencją','close']].map(([v,label,icon])=><button key={v} className={`lic-verdict lic-verdict-${v} ${st.verdict===v?'picked':''}`} aria-pressed={st.verdict===v} disabled={st.ok} onClick={()=>save(setCase(all,c.id,'verdict',v))}><Icon name={icon} size={18}/>{label}</button>)}</div></fieldset>
  <fieldset className="lic-fs"><legend>2. Co rozstrzyga sprawę?</legend><div className="lic-keys">{keys.map(k=><button key={k.id} className={`lic-opt ${st.key===k.id?'picked':''}`} aria-pressed={st.key===k.id} disabled={st.ok} onClick={()=>save(setCase(all,c.id,'key',k.id))}>{st.key===k.id&&<Icon name="check" size={16}/>}{k.label}</button>)}</div></fieldset>
  <div className="inline-actions"><button className="btn" disabled={!st.verdict||!st.key||st.ok} onClick={()=>save(checkCase(all,c.id))}>Sprawdź <Icon name="right" size={18}/></button>{st.ok&&(nextOpen>=0||firstOpen>=0)&&<button className="btn secondary" onClick={()=>setIdx(nextOpen>=0?nextOpen:firstOpen)}>Następny przypadek <Icon name="right" size={18}/></button>}</div>
  {st.msg&&<Feedback ok={st.ok}>{st.ok?<>{st.tries===1?'+1 pkt. ':'+0,5 pkt. '}{st.msg}</>:st.msg}</Feedback>}
  {res.solved===cases.length?<p className="lic-done" role="status"><Icon name="trophy" size={22}/>Audyt zakończony. {res.summary}.</p>:<p className="muted small">Minimum: 5 przypadków. Wszystkie 7 = pełna pula. 1 pkt za pierwszą próbę, 0,5 pkt po poprawce.</p>}
 </div>;
}

export default function LicenseLab(props){
 const m=props.data.mode;
 return m==='creator'?<Creator {...props}/>:m==='check'?<Check {...props}/>:<Shelf {...props}/>;
}
