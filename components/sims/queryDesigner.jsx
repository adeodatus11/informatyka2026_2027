import React,{useState,useRef,useEffect} from 'react';
import {Icon} from '../icons.jsx';
import * as Q from '../../content/sims/queryDesigner.js';
import './queryDesigner.css';

// Zbiór danych wybiera aktywność: data.dataset = 'stomatolog' (domyślnie) | 'zawody'.
// data.maxLevel — ostatni poziom używany w lekcji (domyślnie 3).
const rowLabels={field:'Pole:',table:'Tabela:',total:'Podsumowanie:',sort:'Sortuj:',show:'Pokaż:'};
const fmt=n=>String(n).replace('.',',');

function TableBox({name,fields,onAdd,onRemove}){
 return <div className="qd-tbox"><div className="qd-tbox-head"><span>{name}</span><button type="button" className="qd-x" aria-label={`Usuń tabelę ${name} z projektu`} onClick={onRemove}>✕</button></div>
  <ul>{Object.keys(fields).map((f,i)=><li key={f}><button type="button" onClick={()=>onAdd(`${name}.${f}`)} aria-label={`Dodaj pole ${name}.${f} do siatki`}>{i===0&&<span className="qd-key" aria-hidden="true">🔑</span>}{f}</button></li>)}</ul></div>;
}
function Relation({label,leftMany}){return <div className="qd-rel" role="img" aria-label={`Relacja ${leftMany?'wiele do jednego':'jeden do wielu'} po polu ${label}`}><span>{leftMany?'∞':'1'}</span><i/><span>{leftMany?'1':'∞'}</span><small>{label}</small></div>;}

export default function QueryDesigner({data,value,onChange}){
 const level=data.level||Number(String(data.mode||'l1').slice(1));
 const ds=Q.dataset(data.dataset),ORDER=ds.order,L=ds.labels,maxLevel=data.maxLevel||ds.levels||3;
 const state={tasks:{},drafts:{},modes:{},...value};
 const tasks=Q.levelTasks(level,ds);
 const unlocked=Q.levelUnlocked(level,state,ds);
 const res=Q.levelResult(level,state,ds);
 const firstOpen=tasks.find(t=>!state.tasks[t.id]?.passed)||tasks[0];
 const [taskId,setTaskId]=useState(firstOpen.id);
 const task=tasks.find(t=>t.id===taskId)||tasks[0];
 const q=state.drafts[task.id]||Q.emptyQuery();
 const [showTables,setShowTables]=useState(!q.tables.length);
 const [pick,setPick]=useState([]);
 const [sql,setSql]=useState(false);
 const [result,setResult]=useState(null);
 const [error,setError]=useState(null);
 const [param,setParam]=useState(null); // {names, i, values, forCheck}
 const [msg,setMsg]=useState(null);
 const paramRef=useRef(),errRef=useRef();
 useEffect(()=>{if(param)paramRef.current?.focus();},[param]);
 useEffect(()=>{if(error)errRef.current?.scrollIntoView({block:'nearest'});},[error]);

 function save(nq){onChange({...state,drafts:{...state.drafts,[task.id]:nq},modes:{...state.modes,[`l${level}`]:Q.levelResult(level,state,ds)}});setResult(null);setError(null);}
 function selectTask(id){setTaskId(id);const d=state.drafts[id];setShowTables(!d?.tables?.length);setResult(null);setError(null);setMsg(null);setSql(false);}
 function addTables(names){const t=[...new Set([...q.tables,...names])].sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));save({...q,tables:t});setShowTables(false);setPick([]);}
 function removeTable(name){save({...q,tables:q.tables.filter(t=>t!==name),cols:q.cols.filter(c=>!c.field.startsWith(name+'.'))});}
 function addField(field){save({...q,cols:[...q.cols,{...Q.emptyColumn(),field}]});}
 function setCol(i,patch){const cols=q.cols.map((c,j)=>j===i?{...c,...patch}:c);save({...q,cols});}
 function setCrit(i,r,val){setCol(i,{crit:q.cols[i].crit.map((x,j)=>j===r?val:x)});}
 function removeCol(i){save({...q,cols:q.cols.filter((_,j)=>j!==i)});}
 function execute(params){
  try{const r=Q.runQuery(q,params,ds);setResult(r);setError(null);}
  catch(e){setResult(null);setError({message:e.message,hint:e.hint,where:e.where});}
 }
 function run(){
  setMsg(null);
  let names=[];try{Q.validateQuery(q);names=Q.queryParams(q);}catch(e){setError({message:e.message,hint:e.hint});setResult(null);return;}
  if(names.length){setParam({names,i:0,values:{},text:''});return;}
  execute({});
 }
 function paramOk(e){e.preventDefault();const values={...param.values,[param.names[param.i]]:param.text};
  if(param.i+1<param.names.length){setParam({...param,i:param.i+1,values,text:''});return;}
  setParam(null);execute(values);}
 function check(){
  const {state:next,result:r}=Q.recordCheck(state,task,q);
  onChange({...next,drafts:{...next.drafts,[task.id]:q}});
  const t=next.tasks[task.id];
  setMsg(r.ok?{ok:true,text:`${r.msg} ${state.tasks[task.id]?.passed?'(już zaliczone wcześniej)':t.firstTry?'+2 pkt — za pierwszym razem!':'+1 pkt po poprawce.'}`}:{ok:false,text:r.msg,hint:r.hint});
  if(task.param){try{setResult(Q.runQuery(q,Object.fromEntries(Q.queryParams(q).map(p=>[p,task.param])),ds));setError(null);}catch(e){}}
  else{try{setResult(Q.runQuery(q,{},ds));setError(null);}catch(e){setError({message:e.message,hint:e.hint,where:e.where});setResult(null);}}
 }
 const fieldsFor=q.tables.flatMap(t=>Object.keys(ds.fieldTypes[t]).map(f=>`${t}.${f}`));
 const relBetween=(a,b)=>ds.relations.find(r=>(r.one===a&&r.many===b)||(r.one===b&&r.many===a));
 const fmtCell=(key,v)=>ds.format?ds.format(key,v):v;
 const colsShown=[...q.cols,null];
 const critRows=['Kryteria:','lub:',''];
 const cellErr=(i,r)=>error?.where&&error.where.col===i&&error.where.row===r;

 if(!unlocked){const prev=Q.levelResult(level-1,state,ds);
  return <section className="qd qd-locked" aria-label={`Poziom ${level} — zablokowany`}><Icon name="shield" size={40}/><div><h4>Poziom {level} jest jeszcze zamknięty</h4><p>Zalicz co najmniej <b>2 z 3</b> zleceń na poziomie {level-1} (masz: {prev.passed}/3). Wróć do poprzedniego etapu — tak działa „mastery”: najpierw pewny fundament, potem trudniejsze kwerendy.</p></div></section>;}

 return <section className="qd" aria-label={`Projektant kwerend — poziom ${level}`}>
  <div className="qd-top">
   <div className="qd-points"><Icon name="trophy" size={22}/><strong>{res.score}</strong><span>/ {res.max} pkt</span></div>
   <p className="qd-pass">{res.passed>=2?<><Icon name="check" size={18}/> Poziom zaliczony ({res.passed}/3){level<maxLevel?' — następny poziom odblokowany':''}</>:<>Zalicz <b>2 z 3</b> zleceń, aby {level<maxLevel?'odblokować poziom '+(level+1):'zaliczyć poziom'} ({res.passed}/3)</>}</p>
  </div>
  <div className="qd-tasks" role="group" aria-label={L.tasks}>{tasks.map((t,i)=>{const st=state.tasks[t.id];return <button type="button" key={t.id} aria-pressed={t.id===task.id} className={st?.passed?'is-ok':''} onClick={()=>selectTask(t.id)}><span className="qd-tnum">{st?.passed?'✓':String.fromCharCode(65+i)}</span><span>{t.title}{st?.passed&&<small>{st.firstTry?'2 pkt':'1 pkt'}</small>}{!st?.passed&&st?.attempts>0&&<small>próby: {st.attempts}</small>}</span></button>;})}</div>
  <div className="qd-brief"><p className="eyebrow">{L.brief}</p><p>{task.brief}</p><p className="qd-need">Kolumny w wyniku: {task.need.map(n=><span key={n.key}>{n.label}</span>)}{task.order&&<em>posortowane</em>}</p></div>

  <div className="qd-window">
   <div className="qd-titlebar"><span>{ds.title} — Access — Kwerenda{level}{task.id.slice(-1).toUpperCase()}: Kwerenda {task.param?'parametryczna':q.totals?'podsumowująca':'wybierająca'}</span><span className="qd-sim">symulacja</span></div>
   <div className="qd-ribbon"><div className="qd-rtabs" tabIndex={0} aria-label="Karty wstążki programu (podgląd)"><span>Plik</span><span>Narzędzia główne</span><span>Tworzenie</span><span className="is-active">Projektowanie kwerendy</span></div>
    <div className="qd-groups">
     <div className="qd-group"><div><button type="button" className="qd-rbtn" aria-pressed={sql} onClick={()=>setSql(!sql)}><Icon name={sql?'table':'file'} size={20}/>{sql?'Widok projektu':'Widok SQL'}</button><button type="button" className="qd-rbtn is-run" onClick={run}><span className="qd-bang" aria-hidden="true">!</span>Uruchom</button></div><span>Wyniki</span></div>
     <div className="qd-group qd-hide-sm"><div><span className="qd-rbtn is-on">Wybierająca</span><span className="qd-rbtn is-dim">Krzyżowa</span><span className="qd-rbtn is-dim">Aktualizująca</span><span className="qd-rbtn is-dim">Usuwająca</span></div><span>Typ kwerendy</span></div>
     <div className="qd-group"><div><button type="button" className="qd-rbtn" onClick={()=>setShowTables(true)}><Icon name="table" size={20}/>Pokaż tabelę</button></div><span>Konfiguracja kwerendy</span></div>
     <div className="qd-group"><div><button type="button" className="qd-rbtn" aria-pressed={q.totals} onClick={()=>save({...q,totals:!q.totals,cols:q.cols.map(c=>({...c,total:c.total||'group'}))})}><span className="qd-sigma" aria-hidden="true">Σ</span>Sumy</button></div><span>Pokazywanie/ukrywanie</span></div>
    </div>
   </div>
   {showTables&&<div className="qd-dialog" role="group" aria-label="Pokazywanie tabeli"><div className="qd-dtitle">Pokazywanie tabeli</div><div className="qd-dbody"><div className="qd-dtabs"><span className="is-active">Tabele</span><span>Kwerendy</span><span>Oba</span></div>
    <ul className="qd-tlist">{ORDER.map(t=><li key={t}><label><input type="checkbox" checked={pick.includes(t)||q.tables.includes(t)} disabled={q.tables.includes(t)} onChange={e=>setPick(e.target.checked?[...pick,t]:pick.filter(x=>x!==t))}/>{t}{q.tables.includes(t)&&<small> (już w projekcie)</small>}</label></li>)}</ul>
    <p className="qd-cap">Zaznacz tabele, z których bierzesz pola{level>1?` — ${L.tablesHint}`:''}.</p></div>
    <div className="qd-dbtns"><button type="button" className="qd-btn is-default" disabled={!pick.length} onClick={()=>addTables(pick)}>Dodaj wybrane tabele</button><button type="button" className="qd-btn" onClick={()=>{setShowTables(false);setPick([]);}}>Zamknij</button></div></div>}
   {sql?<div className="qd-sql"><label htmlFor={`${data.id}-sql`}>Widok SQL (tylko do odczytu — generowany z siatki; Access zapisuje SQL po angielsku):</label><textarea id={`${data.id}-sql`} readOnly value={Q.toSQL(q,ds)} rows={7}/></div>:<>
    <div className="qd-tables" aria-label="Tabele w projekcie">{q.tables.length?q.tables.map((t,i)=><React.Fragment key={t}>{i>0&&(()=>{const r=relBetween(q.tables[i-1],t);return r?<Relation label={r.field} leftMany={r.many===q.tables[i-1]}/>:<div className="qd-norel">brak relacji</div>;})()}<TableBox name={t} fields={ds.fieldTypes[t]} onAdd={addField} onRemove={()=>removeTable(t)}/></React.Fragment>):<p className="qd-cap">Brak tabel. Kliknij „Pokaż tabelę”.</p>}</div>
    <p className="qd-cap qd-tip">Kliknij pole w okienku tabeli, aby dodać je do siatki (w Accessie: dwuklik).</p>
    <div className="qd-grid" role="region" aria-label="Siatka projektu kwerendy" tabIndex={0}><table><tbody>
     <tr><th scope="row">{rowLabels.field}</th>{colsShown.map((c,i)=><td key={i}>{c?<div className="qd-fieldcell"><select aria-label={`Pole, kolumna ${i+1}`} value={c.field} onChange={e=>setCol(i,{field:e.target.value})}>{fieldsFor.map(f=><option key={f} value={f}>{f.split('.')[1]}</option>)}</select><button type="button" className="qd-x" aria-label={`Usuń kolumnę ${i+1}`} onClick={()=>removeCol(i)}>✕</button></div>:<select aria-label="Pole, nowa kolumna" value="" onChange={e=>e.target.value&&addField(e.target.value)} disabled={!q.tables.length}><option value="">(dodaj pole)</option>{q.tables.map(t=><optgroup key={t} label={t}>{Object.keys(ds.fieldTypes[t]).map(f=><option key={f} value={`${t}.${f}`}>{f}</option>)}</optgroup>)}</select>}</td>)}</tr>
     <tr><th scope="row">{rowLabels.table}</th>{colsShown.map((c,i)=><td key={i} className="qd-tname">{c?.field.split('.')[0]||''}</td>)}</tr>
     {q.totals&&<tr className="qd-totals"><th scope="row">{rowLabels.total}</th>{colsShown.map((c,i)=><td key={i}>{c&&<select aria-label={`Podsumowanie, kolumna ${i+1}`} value={c.total||'group'} onChange={e=>setCol(i,{total:e.target.value,...(e.target.value==='where'?{show:false}:{})})}>{Q.totalsOptions.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select>}</td>)}</tr>}
     <tr><th scope="row">{rowLabels.sort}</th>{colsShown.map((c,i)=><td key={i}>{c&&<select aria-label={`Sortuj, kolumna ${i+1}`} value={c.sort} onChange={e=>setCol(i,{sort:e.target.value})}><option value="">(nieposortowane)</option><option value="asc">Rosnąco</option><option value="desc">Malejąco</option></select>}</td>)}</tr>
     <tr><th scope="row">{rowLabels.show}</th>{colsShown.map((c,i)=><td key={i} className="qd-center">{c&&<input type="checkbox" aria-label={`Pokaż, kolumna ${i+1}`} checked={c.show} onChange={e=>setCol(i,{show:e.target.checked})}/>}</td>)}</tr>
     {critRows.map((label,r)=><tr key={r}><th scope="row">{label}</th>{colsShown.map((c,i)=><td key={i}>{c&&<input type="text" className={cellErr(i,r)?'is-err':''} aria-label={`${r===0?'Kryteria':'lub'}${r===2?' (drugi wiersz)':''}, kolumna ${i+1} (${c.field.split('.')[1]})`} value={c.crit[r]} spellCheck={false} autoComplete="off" onChange={e=>setCrit(i,r,e.target.value.slice(0,80))}/>}</td>)}</tr>)}
    </tbody></table></div></>}
   {param&&<form className="qd-dialog qd-param" onSubmit={paramOk} aria-label="Wprowadzanie wartości parametru"><div className="qd-dtitle">Wprowadzanie wartości parametru</div><div className="qd-dbody"><label>{param.names[param.i]}<input ref={paramRef} value={param.text} onChange={e=>setParam({...param,text:e.target.value.slice(0,40)})}/></label></div><div className="qd-dbtns"><button type="submit" className="qd-btn is-default">OK</button><button type="button" className="qd-btn" onClick={()=>setParam(null)}>Anuluj</button></div></form>}
   {error&&<div className="qd-msgbox" role="alert" ref={errRef}><div className="qd-dtitle">Microsoft Access (symulacja)</div><div className="qd-mbody"><Icon name="warning" size={28}/><div><p>{error.message}</p>{error.hint&&<p className="qd-hint"><b>Wskazówka:</b> {error.hint}</p>}</div></div><div className="qd-dbtns"><button type="button" className="qd-btn is-default" onClick={()=>setError(null)}>OK</button></div></div>}
   {result&&<div className="qd-result"><div className="qd-rhead"><Icon name="table" size={18}/>Arkusz danych — wynik kwerendy</div>{result.warnings.map(w=><p key={w} className="qd-warn">{w}</p>)}
    <div className="qd-sheet" role="region" aria-label="Wynik kwerendy" tabIndex={0}><table><thead><tr>{result.columns.map((c,i)=><th key={i} scope="col">{c.label}</th>)}</tr></thead><tbody>{result.rows.length?result.rows.slice(0,60).map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j} className={result.columns[j].type==='number'?'qd-num':''}>{fmtCell(result.columns[j].key,v)??''}</td>)}</tr>):<tr><td colSpan={result.columns.length} className="qd-empty">(brak rekordów spełniających kryteria)</td></tr>}</tbody></table></div>
    <p className="qd-recbar">Rekordy: {result.rows.length}</p></div>}
  </div>
  <div className="qd-actions"><button type="button" className="btn" onClick={check}><Icon name="check" size={20}/>Sprawdź zlecenie</button><span className="small muted">Pierwsze trafienie: 2 pkt · po poprawce: 1 pkt</span></div>
  <div role="status">{msg&&<div className={`feedback ${msg.ok?'':'retry'}`}><Icon name={msg.ok?'check':'warning'}/><div><strong>{msg.text}</strong>{msg.hint&&<p className="qd-hint">{msg.hint}</p>}</div></div>}</div>
  {data.criteria&&<div className="qd-criteria"><h4>Kryteria sukcesu (NaCoBeZu)</h4><ul>{data.criteria.map(c=><li key={c}>{c}</li>)}</ul></div>}
  <details className="qd-cheat"><summary>Ściąga: kryteria w Accessie</summary><dl>
   {ds.cheat.map(([a,b])=><div key={a}><dt><code>{a}</code></dt><dd>{b}</dd></div>)}
  </dl>{ds.cheatNote&&<p className="small muted">{ds.cheatNote}</p>}</details>
 </section>;
}
