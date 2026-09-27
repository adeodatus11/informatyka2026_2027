import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import * as S from '../../content/sims/schemaDesigner.js';
import './schemaDesigner.css';

// Projektant bazy (lekcja 24). data.mode = 'z1' | 'z2' | 'z3' (wspólny stateKey, mastery ≥70%).
const pts=n=>String(n).replace('.',',');
const CHECKLIST=['Każda tabela opisuje jeden rodzaj rzeczy (osoby, przedmioty, zdarzenia).','Każda tabela ma 🔑 klucz główny id_…','Każde pole ze zlecenia jest w jednej, właściwej tabeli.','Typy: daty → Data/Godzina, pieniądze → Waluta, tak/nie → Tak/Nie, telefon → Krótki tekst.','Tabela „zdarzeń” ma klucze obce (Liczba) połączone relacją 1–∞.','Żadne dane się nie powtarzają, brak pól do policzenia i pól-pułapek.'];

function Locked({o}){const i=S.orders.indexOf(o);return <section className="sd sd-locked" aria-label={`Zlecenie ${i+1} — zablokowane`}><Icon name="lock" size={40}/><div><h4>Zlecenie {i+1} jest jeszcze zamknięte</h4><p>Najpierw zalicz zlecenie {i} („{S.orders[i-1].title}”) na co najmniej <b>70%</b>. Tak działa „mastery”: pewny fundament, potem trudniejszy projekt.</p></div></section>;}

function Tryout({o,st,save}){
 const t=st.tryout||S.initTryout(o);
 const [msg,setMsg]=useState(null);
 const [inputs,setInputs]=useState({});
 const cols=tb=>{const def=o.tables.find(x=>x.name===tb);return [def.pk,...o.fks.filter(k=>k.table===tb).map(k=>k.field),...Object.keys(def.fields)];};
 const typeOf=(tb,f)=>{const def=o.tables.find(x=>x.name===tb);if(f===def.pk)return 'auto';if(o.fks.some(k=>k.table===tb&&k.field===f))return 'num';return def.fields[f];};
 function apply(r){save({...st,tryout:r.t});setMsg(r);}
 function insert(tb){const r=S.tryInsert(o,t,tb,inputs[tb]||{});apply(r);if(r.ok)setInputs({...inputs,[tb]:{}});}
 const show=(v,ty)=>ty==='bool'?(v?'☑':'☐'):ty==='money'?`${Number(v).toFixed(2).replace('.',',')} zł`:v;
 return <div className="sd-try"><h4><Icon name="play" size={20}/>Wypróbuj swoją bazę (+1 pkt)</h4>
  <p className="small">{o.tryHint} Zadanie: <b>dodaj 2 rekordy</b> i <b>wywołaj 1 odrzucenie</b> przez relację. Postęp: rekordy {Math.min(t.added,2)}/2 · odrzucenia {Math.min(t.rejected,1)}/1 {S.tryoutDone(t)&&<b className="sd-okchip">✓ zaliczone</b>}</p>
  <div className="sd-trygrid">{o.tables.map(def=>{const tb=def.name;const cs=cols(tb);return <div key={tb} className="sd-tsheet"><div className="sd-tstitle"><Icon name="table" size={16}/>{tb}</div>
   <div className="sd-tscroll" role="region" aria-label={`Arkusz danych ${tb}`} tabIndex={0}><table><thead><tr>{cs.map(c=><th key={c} scope="col">{c}</th>)}<th scope="col"><span className="sr-only">Akcje</span></th></tr></thead><tbody>
    {(t.rows[tb]||[]).map(r=><tr key={r[def.pk]}>{cs.map(c=><td key={c}>{show(r[c],typeOf(tb,c))}</td>)}<td><button type="button" className="sd-x" aria-label={`Usuń rekord ${tb} ${r[def.pk]}`} onClick={()=>apply(S.tryDelete(o,t,tb,r[def.pk]))}>✕</button></td></tr>)}
    <tr className="sd-newrow">{cs.map(c=>{const ty=typeOf(tb,c);const val=inputs[tb]?.[c];const set=v=>setInputs({...inputs,[tb]:{...inputs[tb],[c]:v}});
     return <td key={c}>{ty==='auto'?<span className="muted">(Nowy)</span>:ty==='bool'?<input type="checkbox" aria-label={`${tb}: ${c}`} checked={!!val} onChange={e=>set(e.target.checked)}/>:<input type={ty==='date'?'date':'text'} inputMode={ty==='num'||ty==='money'?'decimal':undefined} aria-label={`${tb}: ${c}`} value={val||''} onChange={e=>set(e.target.value.slice(0,40))}/>}</td>;})}<td><button type="button" className="sd-btn is-default" onClick={()=>insert(tb)}>Zapisz</button></td></tr>
   </tbody></table></div></div>;})}</div>
  <div role="status">{msg&&(msg.access?<div className="sd-msgbox"><div className="sd-mtitle">Access (symulacja)</div><div className="sd-mbody"><Icon name="warning" size={26}/><div><p>{msg.msg}</p>{msg.hint&&<p className="sd-hint">{msg.hint}</p>}</div></div></div>:<div className={`feedback ${msg.ok?'':'retry'}`}><Icon name={msg.ok?'check':'warning'}/><div><strong>{msg.msg}</strong>{msg.hint&&<p className="sd-hint">{msg.hint}</p>}</div></div>)}</div>
 </div>;
}

export default function SchemaDesigner({data,value,onChange}){
 const mode=data.mode||'z1';
 const o=S.orderById(mode);
 const v=value||{};
 const st=v[mode]||{};
 const d=st.design||S.emptyDesign();
 const res=S.orderResult(st,o);
 const [chip,setChip]=useState(null);
 const [newTable,setNewTable]=useState(false);
 const [rel,setRel]=useState({field:'',ref:''});
 const [relMsg,setRelMsg]=useState(null);
 const [ev,setEv]=useState(null);
 const [stale,setStale]=useState(false);
 const [gain,setGain]=useState('');
 if(!S.unlocked(mode,v))return <Locked o={o}/>;
 function save(next){onChange({...v,[mode]:next,modes:{...v.modes,[mode]:S.orderResult(next,o)}});}
 function setDesign(nd){save({...st,design:nd});if(ev)setStale(true);}
 function check(){const before=S.orderResult(st,o).score;const {state,ev:e}=S.recordCheck({...st,design:d},o);save(state);setEv(e);setStale(false);const after=S.orderResult(state,o).score;setGain(after>before?`+${pts(after-before)} pkt`:'');}
 const used=new Set(d.tables.flatMap(t=>t.fields.map(f=>f.name)));
 const nonPk=d.tables.flatMap(t=>t.fields.filter(f=>!f.pk).map(f=>`${t.name}.${f.name}`));
 function createRel(){const [table,field]=rel.field.split('.');const r=S.addRel(d,table,field,rel.ref);if(r.ok){setDesign(r.design);setRel({field:'',ref:''});}setRelMsg(r);}
 const perfect=!!st.perfectAt;
 const idx=S.orders.indexOf(o);
 return <section className="sd" aria-label={`Projektant bazy — zlecenie ${idx+1}`}>
  <div className="sd-top"><div className="sd-points"><Icon name="trophy" size={22}/><strong>{pts(res.score)}</strong><span>/ {res.max} pkt</span></div>
   <p className="sd-pass">{res.done?<><Icon name="check" size={18}/> Zlecenie zaliczone ({Math.round((st.best||0)*100)}%){idx<2?' — następne odblokowane':''}</>:<>Zalicz na <b>70%</b> (każda grupa reguł co najmniej w połowie){idx<2?`, aby odblokować zlecenie ${idx+2}`:''}{st.checks?` · najlepszy wynik: ${Math.round((st.best||0)*100)}%`:''}</>}</p>
   <p className="sd-rule small muted">100% za 1. razem: 3 pkt · za 2.–3.: 2 pkt · później: 1,5 · tylko ≥70%: 1 pkt · Wypróbuj: +1</p></div>
  <div className="sd-brief"><p className="eyebrow">Zlecenie {idx+1} z 3 · {o.title}</p><p>{o.story}</p>
   <div className="sd-sample"><p className="sd-stitle"><Icon name="book" size={16}/>{o.sample.title} (dane od klienta)</p><div className="sd-sscroll" role="region" aria-label={o.sample.title} tabIndex={0}><table><thead><tr>{o.sample.columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{o.sample.rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div></div>
   {data.criteria&&<div className="sd-criteria"><b>Kryteria sukcesu:</b><ul>{data.criteria.map(c=><li key={c}>{c}</li>)}</ul></div>}</div>
  <div className="sd-pool" role="group" aria-label="Pula pól"><p className="sd-plabel"><b>Pula pól</b> — kliknij pole, potem „+ Wstaw” w tabeli. Uwaga: nie wszystkie pola są potrzebne.</p>
   <div className="sd-chips">{o.pool.map(f=><button key={f} type="button" className={`sd-chip ${used.has(f)?'is-used':''}`} aria-pressed={chip===f} onClick={()=>setChip(chip===f?null:f)}>{f}{used.has(f)&&<span aria-label=" (użyte)"> ✓</span>}</button>)}</div></div>
  <div className="sd-window">
   <div className="sd-titlebar"><span>{o.short}.accdb — Access — Projekt bazy</span><span className="sd-sim">symulacja</span></div>
   <div className="sd-ribbon"><div className="sd-rtabs" aria-hidden="true"><span>Plik</span><span>Narzędzia główne</span><span className="is-active">Tworzenie</span><span>Narzędzia bazy danych</span></div>
    <div className="sd-groups"><button type="button" className="sd-rbtn" aria-expanded={newTable} onClick={()=>setNewTable(!newTable)}><Icon name="table" size={20}/>Utwórz tabelę</button>{chip&&<span className="sd-chipinfo">Wybrane pole: <b>{chip}</b> — kliknij „+ Wstaw” w tabeli</span>}</div></div>
   {newTable&&<div className="sd-newtable" role="group" aria-label="Nazwa nowej tabeli"><p className="small">Wybierz nazwę tabeli:</p><div className="sd-names">{S.allTableNames(o).slice().sort((a,b)=>a.localeCompare(b,'pl')).map(n=><button key={n} type="button" className="sd-btn" disabled={d.tables.some(t=>t.name===n)} onClick={()=>{setDesign(S.addTable(d,n));setNewTable(false);}}>{n}</button>)}<button type="button" className="sd-btn" onClick={()=>setNewTable(false)}>Anuluj</button></div></div>}
   <div className="sd-tables">{d.tables.length?d.tables.map(t=><div key={t.name} className="sd-table"><div className="sd-thead"><span>{t.name}</span><button type="button" className="sd-x" aria-label={`Usuń tabelę ${t.name}`} onClick={()=>setDesign(S.removeTable(d,t.name))}>✕</button></div>
     <table><thead><tr><th scope="col"><span className="sr-only">Klucz</span></th><th scope="col">Nazwa pola</th><th scope="col">Typ danych</th><th scope="col"><span className="sr-only">Usuń</span></th></tr></thead><tbody>
      {t.fields.map(f=>{const fk=d.rels.find(r=>r.table===t.name&&r.field===f.name);return <tr key={f.name}><td><button type="button" className={`sd-key ${f.pk?'is-on':''}`} aria-pressed={f.pk} aria-label={`Klucz główny: ${t.name}.${f.name}`} onClick={()=>setDesign(S.togglePK(d,t.name,f.name))}>{f.pk?'🔑':'·'}</button></td><td className="sd-fname">{f.name}{fk&&<small className="sd-fk">→ {fk.ref}</small>}</td><td><select aria-label={`Typ danych: ${t.name}.${f.name}`} value={f.type} onChange={e=>setDesign(S.setType(d,t.name,f.name,e.target.value))}>{S.TYPES.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></td><td><button type="button" className="sd-x" aria-label={`Usuń pole ${t.name}.${f.name}`} onClick={()=>setDesign(S.removeField(d,t.name,f.name))}>✕</button></td></tr>;})}
      {!t.fields.length&&<tr><td colSpan={4} className="sd-empty">Pusta tabela — wybierz pole z puli.</td></tr>}
     </tbody></table>
     <button type="button" className="sd-insert" disabled={!chip||t.fields.some(f=>f.name===chip)} onClick={()=>setDesign(S.addField(d,t.name,chip))}>+ Wstaw {chip?`„${chip}”`:'pole'} do {t.name}</button></div>)
    :<p className="sd-cap">Brak tabel. Kliknij „Utwórz tabelę” na wstążce.</p>}</div>
   <div className="sd-rels"><h4><Icon name="right" size={18}/>Relacje (1 — ∞)</h4>
    {d.rels.length?<ul>{d.rels.map((r,i)=><li key={i}><span><b>{r.ref}</b>.{S.pkOf(d,r.ref)||'?'} <span className="sd-one">1</span> —— <span className="sd-many">∞</span> <b>{r.table}</b>.{r.field}</span><button type="button" className="sd-x" aria-label={`Usuń relację ${r.ref} — ${r.table}.${r.field}`} onClick={()=>setDesign(S.removeRel(d,i))}>✕</button></li>)}</ul>:<p className="small muted">Brak relacji. Klucz obcy (strona ∞) łączysz z tabelą, na którą wskazuje (strona 1).</p>}
    <div className="sd-relform"><label>Klucz obcy (strona ∞)<select value={rel.field} onChange={e=>setRel({...rel,field:e.target.value})}><option value="">(wybierz pole)</option>{nonPk.map(f=><option key={f} value={f}>{f}</option>)}</select></label>
     <label>wskazuje tabelę (strona 1)<select value={rel.ref} onChange={e=>setRel({...rel,ref:e.target.value})}><option value="">(wybierz tabelę)</option>{d.tables.map(t=><option key={t.name} value={t.name}>{t.name}{S.pkOf(d,t.name)?` (${S.pkOf(d,t.name)})`:''}</option>)}</select></label>
     <button type="button" className="sd-btn is-default" onClick={createRel}>Utwórz relację</button></div>
    <div role="status" className="sd-relmsg">{relMsg&&<p className={relMsg.ok?'is-ok':'is-bad'}>{relMsg.ok?'✓ ':'✗ '}{relMsg.msg}</p>}</div>
   </div>
  </div>
  <details className="sd-checklist"><summary>Lista kontrolna sprawdzającego (para: druga osoba czyta przed „Sprawdź”)</summary><ul>{CHECKLIST.map(c=><li key={c}><label><input type="checkbox"/>{c}</label></li>)}</ul></details>
  <div className="sd-actions"><button type="button" className="btn" onClick={check}><Icon name="check" size={20}/>Sprawdź projekt</button><span className="small muted">Sprawdzenia: {st.checks||0}</span></div>
  <div role="status" className="sd-status">{ev&&<div className={`sd-report ${ev.ratio===1?'is-perfect':ev.pass?'is-pass':''}`}>
   <div className="sd-score"><strong>{Math.round(ev.ratio*100)}%</strong><span>{ev.passed}/{ev.total} kontroli · {ev.ratio===1?'projekt bez błędów!':ev.pass?'zaliczone — dopracuj resztę':ev.ratio>=S.PASS?`jeszcze nie zaliczone: grupa „${ev.weak[0].label}” musi być spełniona co najmniej w połowie`:'poniżej 70% — popraw i sprawdź ponownie'}</span>{gain&&<b className="sd-gain">{gain}</b>}<div className="sd-bar" aria-hidden="true"><i style={{width:`${Math.round(ev.ratio*100)}%`}}/></div></div>
   {stale&&<p className="sd-stale small">Projekt zmieniony po sprawdzeniu — kliknij „Sprawdź projekt” ponownie.</p>}
   <ul className="sd-groupsum">{ev.groups.map(g=><li key={g.id} className={g.ok?'is-ok':'is-bad'}><span className="sd-gicon" aria-hidden="true">{g.ok?'✓':'✗'}</span><div><b>{g.label}</b> <span className="small muted">{g.passed}/{g.total}</span><span className="sr-only">{g.ok?' — w porządku':' — do poprawy'}</span>{!g.ok&&<><p>{g.issues[0].msg}</p><p className="sd-hint">{g.issues[0].hint}</p>{g.issues.length>1&&<p className="small muted">…i jeszcze {g.issues.length-1} w tej grupie.</p>}</>}</div></li>)}</ul>
   {ev.bonus&&<p className={`sd-bonus ${ev.bonus.ok?'is-ok':''}`}>{ev.bonus.msg}</p>}
  </div>}</div>
  {perfect&&<Tryout o={o} st={st} save={save}/>}
 </section>;
}
