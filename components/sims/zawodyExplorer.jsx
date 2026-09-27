import React,{useState,useRef,useEffect} from 'react';
import {Icon} from '../icons.jsx';
import * as D from '../../content/sims/zawody-data.js';
import * as Z from '../../content/sims/zawodyExplorer.js';
import './zawodyExplorer.css';

// Symulator „Zawody” (lekcja 22). Tryby: problem (arkusz), explore (Relacje + arkusze danych), board (tablica wyników).
// Wspólny stateKey: value = {problem:{…}, explore:{…}, board:{…}, modes:{problem,explore,board}}.

function Points({score,max,children}){
 return <div className="zx-top"><div className="zx-points"><Icon name="trophy" size={22}/><strong>{Z.pts(score)}</strong><span>/ {max} pkt</span></div><p className="zx-progress">{children}</p></div>;
}
function Feedback({msg}){
 return <div role="status" className="zx-status">{msg&&<div className={`feedback ${msg.ok?'':'retry'}`}><Icon name={msg.ok?'check':'warning'}/><div><strong>{msg.text}</strong>{msg.hint&&<p className="zx-hint">{msg.hint}</p>}{msg.gain&&<p className="zx-gain">{msg.gain}</p>}</div></div>}</div>;
}
function TaskTabs({tasks,state,active,onPick,label}){
 return <div className="zx-tasks" role="group" aria-label={label}>{tasks.map((t,i)=>{const st=state[t.id];return <button type="button" key={t.id} aria-pressed={t.id===active} className={st?.passed?'is-ok':''} onClick={()=>onPick(t.id)}><span className="zx-tnum" aria-hidden="true">{st?.passed?'✓':i+1}</span><span>{t.title}{st?.passed?<small>zaliczone · {st.firstTry===false?'1 pkt':'2 pkt'}</small>:st?.attempts>0?<small>próby: {st.attempts}</small>:null}</span></button>;})}</div>;
}
const plural=(n,one,few,many)=>{if(n===1)return one;const d=n%10,t=n%100;return d>=2&&d<=4&&(t<12||t>14)?few:many;};
const gainText=(prev,now)=>prev?.passed?'(już zaliczone wcześniej)':now?.passed?(now.firstTry?'+2 pkt — za pierwszym razem!':'+1 pkt po poprawce.'):'';

/* ───────── Tryb 1: arkusz z problemami ───────── */
function Problem({sub,save}){
 const tasks=sub.tasks||{};
 const [active,setActive]=useState((Z.problemTasks.find(t=>!tasks[t.id]?.passed)||Z.problemTasks[0]).id);
 const [msg,setMsg]=useState(null);
 const [cell,setCell]=useState('0:0');
 const task=Z.problemTasks.find(t=>t.id===active);
 const sel=sub.sel?.[active]||[];
 const res=Z.problemResult(sub);
 const solvedOf=id=>Z.problemTasks.findIndex(t=>tasks[t.id]?.passed&&t.answer.includes(id));
 function toggle(id){setCell(id);if(tasks[active]?.passed)return;const next=sel.includes(id)?sel.filter(x=>x!==id):[...sel,id];save({...sub,sel:{...sub.sel,[active]:next}});setMsg(null);}
 function check(){const {state,result}=Z.applyProblemCheck(sub,active);save(state);setMsg({ok:result.ok,text:result.msg,hint:result.hint,gain:gainText(tasks[active],state.tasks[active])});}
 const [cr,cc]=cell.split(':').map(Number);
 return <section className="zx" aria-label="Arkusz wyników zawodów — szukanie problemów">
  <Points score={res.score} max={res.max}>Znalezione problemy arkusza: <b>{Object.values(tasks).filter(t=>t.passed).length}/3</b> · pierwsze trafienie 2 pkt, po poprawce 1 pkt</Points>
  <TaskTabs tasks={Z.problemTasks} state={tasks} active={active} onPick={id=>{setActive(id);setMsg(null);}} label="Problemy do znalezienia"/>
  <div className="zx-brief"><p className="eyebrow">Problem {Z.problemTasks.indexOf(task)+1} z 3{tasks[active]?.passed?` · ${task.kind}`:''}</p><p>{task.text}</p></div>
  <div className="zx-window zx-sheetwin">
   <div className="zx-titlebar zx-green"><span>wyniki_zawodow.xlsx — arkusz kalkulacyjny</span><span className="zx-sim">symulacja</span></div>
   <div className="zx-formula"><span className="zx-addr">{Z.cellName(cell)}</span><span className="zx-fx" aria-hidden="true">fx</span><span className="zx-fval">{Z.sheetRows[cr]?.[cc]}</span></div>
   <div className="zx-sheet" role="region" aria-label="Arkusz: kliknij komórki" tabIndex={0}><table>
    <thead><tr><th aria-hidden="true"></th>{'ABCDE'.split('').map(l=><th key={l} scope="col" aria-hidden="true">{l}</th>)}</tr></thead>
    <tbody><tr className="zx-hrow"><th scope="row">1</th>{Z.sheetColumns.map(c=><td key={c}><b>{c}</b></td>)}</tr>
     {Z.sheetRows.map((r,ri)=><tr key={ri}><th scope="row">{ri+2}</th>{r.map((v,ci)=>{const id=Z.cellId(ri,ci);const on=sel.includes(id);const found=solvedOf(id);
      return <td key={ci} className={`${ci===4?'zx-num':''}`}><button type="button" className={`zx-cell ${on?'is-sel':''} ${found>=0?`is-found f${found}`:''}`} aria-pressed={on} aria-label={`${Z.cellName(id)}: ${v}${found>=0?` — znaleziony problem ${found+1}`:''}`} onClick={()=>toggle(id)}>{v}{found>=0&&<i className="zx-mark" aria-hidden="true">{found+1}</i>}</button></td>;})}</tr>)}
    </tbody></table></div>
   <div className="zx-sheettabs" aria-hidden="true"><span className="is-active">Wyniki</span><span>+</span></div>
  </div>
  <div className="zx-actions"><button type="button" className="btn" onClick={check} disabled={tasks[active]?.passed}><Icon name="check" size={20}/>Sprawdź zaznaczenie</button><button type="button" className="text-button" onClick={()=>{save({...sub,sel:{...sub.sel,[active]:[]}});setMsg(null);}} disabled={!sel.length||tasks[active]?.passed}><Icon name="reset" size={18}/>Wyczyść</button><span className="small muted">Zaznaczone: {sel.length}</span></div>
  <Feedback msg={msg}/>
  {res.done&&<div className="zx-diagnosis"><h4><Icon name="warning" size={20}/> Diagnoza: redundancja</h4><p>Wszystkie trzy problemy mają wspólną przyczynę: <b>dane zawodnika przepisano do każdego wiersza</b>. Stąd literówki (1), sprzeczności (2) i żmudne poprawki (3). W bazie danych imię, nazwisko i klasę zapisujesz <b>raz</b> — w tabeli Zawodnicy — a wynik tylko wskazuje zawodnika numerem.</p></div>}
 </section>;
}

/* ───────── Tryb 2: widok Relacje + arkusze danych ───────── */
const ROW_H=32,HEAD_H=34;
const yOf=i=>HEAD_H+i*ROW_H+ROW_H/2;
function TableBox({name,e,active,onField}){
 const fields=Object.keys(D.fieldTypes[name]);
 const pkDone=e.tasks?.pk?.passed,fkDone=e.tasks?.fk?.passed;
 return <div className="zx-tbox" style={{height:HEAD_H+fields.length*ROW_H+6}}><div className="zx-tbox-head">{name}</div>
  <ul>{fields.map(f=>{const key=`${name}.${f}`;const pk=(e.pk||[]).includes(key),fk=(e.fk||[]).includes(key);const pressable=(active==='pk'&&!pkDone)||(active==='fk'&&!fkDone);
   return <li key={f}><button type="button" className={`${pk?'is-pk':''} ${fk?'is-fk':''}`} aria-pressed={active==='pk'?pk:active==='fk'?fk:undefined} onClick={()=>onField(name,key)} aria-label={`${name}.${f}${pk?', klucz główny':''}${fk?', klucz obcy':''}${pressable?'':' — pokaż dane tabeli'}`}><span className="zx-ficon" aria-hidden="true">{pk?'🔑':fk?'🔗':''}</span>{f}</button></li>;})}</ul></div>;
}
function Connector({line,leftTable,rightTable,y1,y2,ends,editable,onEnd,h}){
 const a=Z.relEnds.find(x=>x.line===line&&x.table===leftTable&&x.id.endsWith('a')),b=Z.relEnds.find(x=>x.line===line&&x.id.endsWith('b'));
 const lab=v=>v==='1'?'jeden':v==='∞'?'wiele':'nieustawione';
 return <div className="zx-conn" style={{height:h}}>
  <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true"><path d={`M0 ${y1} H14 L86 ${y2} H100`} fill="none" stroke="#333" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
  {[a,b].map((x,i)=><button key={x.id} type="button" className={`zx-end ${i?'is-right':'is-left'} ${ends[x.id]&&ends[x.id]!=='?'?'is-set':''}`} style={{top:(i?y2:y1)-30}} disabled={!editable} onClick={()=>onEnd(x.id)} aria-label={`Koniec relacji przy tabeli ${i?rightTable:leftTable}: ${lab(ends[x.id])}${editable?' — kliknij, aby zmienić':''}`}>{ends[x.id]||'?'}</button>)}
 </div>;
}
const dsCols={Zawodnicy:['id_zawodnika','imie','nazwisko','plec','klasa','rocznik'],Wyniki:['id_wyniku','id_zawodnika','id_konkurencji','czas','dyskwalifikacja'],Konkurencje:['id_konkurencji','styl','dystans','plec']};
const cellFmt=(f,v)=>f==='czas'?D.fmtTime(v):v;
function Explore({sub,save}){
 const e=sub,tasks=e.tasks||{};
 const [active,setActive]=useState((Z.exploreTasks.find(t=>!tasks[t.id]?.passed)||Z.exploreTasks[0]).id);
 const [tab,setTab]=useState('Konkurencje');
 const [focus,setFocus]=useState(null); // {table,id}
 const [sortTime,setSortTime]=useState(false);
 const [msg,setMsg]=useState(null);
 const res=Z.exploreResult(e);
 const task=Z.exploreTasks.find(t=>t.id===active);
 const ends=e.ends||{};
 function pick(id){setActive(id);setMsg(null);}
 function onField(table,key){
  if(active==='pk'&&!tasks.pk?.passed){const s=e.pk||[];save({...e,pk:s.includes(key)?s.filter(x=>x!==key):[...s,key]});setMsg(null);return;}
  if(active==='fk'&&!tasks.fk?.passed){const s=e.fk||[];save({...e,fk:s.includes(key)?s.filter(x=>x!==key):[...s,key]});setMsg(null);return;}
  setTab(table);
 }
 function onEnd(id){save({...e,ends:{...ends,[id]:Z.cycleEnd(ends[id])}});setMsg(null);}
 function check(){const {state,result}=Z.applyExploreCheck(e,active);save(state);setMsg({ok:result.ok,text:result.msg,hint:result.hint,gain:gainText(tasks[active],state.tasks[active])});}
 function select(table,id){setFocus({table,id});if(table==='Zawodnicy'&&active==='winner'&&!tasks.winner?.passed)save({...e,pick:id});}
 function jump(table,id){setTab(table);select(table,id);}
 let rows=D.tables[tab];
 if(tab==='Wyniki'&&sortTime)rows=[...rows].sort((a,b)=>a.czas-b.czas);
 const keyOf=r=>r[dsCols[tab][0]];
 const rel=focus?Z.related(focus.table,focus.id):{};
 const relRows=rel.results?(sortTime?[...rel.results].sort((a,b)=>a.czas-b.czas):rel.results):null;
 const picked=e.pick!=null?D.swimmerById(e.pick):null;
 const hZ=HEAD_H+6*ROW_H+6;
 return <section className="zx" aria-label="Baza Zawody — relacje i dane">
  <Points score={res.score} max={res.max}>Zadania: <b>{Object.values(tasks).filter(t=>t.passed).length}/4</b> · pierwsze trafienie 2 pkt, po poprawce 1 pkt</Points>
  <TaskTabs tasks={Z.exploreTasks} state={tasks} active={active} onPick={pick} label="Zadania w bazie Zawody"/>
  <div className="zx-brief"><p className="eyebrow">Zadanie {Z.exploreTasks.indexOf(task)+1} z 4</p><p>{task.text}</p>
   {active==='winner'&&<p className="zx-pick">Zaznaczona w tabeli Zawodnicy: <b>{picked?`${D.fullName(picked)} (${picked.klasa})`:'— nikt —'}</b></p>}</div>
  <div className="zx-window">
   <div className="zx-titlebar"><span>Zawody — Access — Relacje</span><span className="zx-sim">symulacja</span></div>
   <div className="zx-ribbon" aria-hidden="true"><span>Plik</span><span>Narzędzia główne</span><span>Tworzenie</span><span className="is-active">Narzędzia bazy danych</span></div>
   <div className="zx-diagram" aria-label="Widok relacji: trzy tabele połączone liniami">
    <TableBox name="Zawodnicy" e={e} active={active} onField={onField}/>
    <Connector line="zw" leftTable="Zawodnicy" rightTable="Wyniki" y1={yOf(0)} y2={yOf(1)} ends={ends} editable={active==='rel'&&!tasks.rel?.passed} onEnd={onEnd} h={hZ}/>
    <TableBox name="Wyniki" e={e} active={active} onField={onField}/>
    <Connector line="wk" leftTable="Wyniki" rightTable="Konkurencje" y1={yOf(2)} y2={yOf(0)} ends={ends} editable={active==='rel'&&!tasks.rel?.passed} onEnd={onEnd} h={hZ}/>
    <TableBox name="Konkurencje" e={e} active={active} onField={onField}/>
   </div>
   <p className="zx-cap">{active==='pk'||active==='fk'?'Kliknij pola w okienkach tabel, aby je zaznaczyć (🔑 klucz główny, 🔗 klucz obcy).':active==='rel'?'Kliknij kwadraty na końcach linii: ? → 1 → ∞.':'Kliknij pole w okienku tabeli, aby otworzyć jej dane poniżej.'}</p>
   <div className="zx-data">
    <div className="zx-dtabs" role="group" aria-label="Arkusz danych tabeli">{['Zawodnicy','Wyniki','Konkurencje'].map(t=><button key={t} type="button" aria-pressed={tab===t} onClick={()=>setTab(t)}><Icon name="table" size={16}/>{t} <small>({D.tables[t].length})</small></button>)}
     {tab==='Wyniki'&&<button type="button" className="zx-sortbtn" aria-pressed={sortTime} onClick={()=>setSortTime(!sortTime)}><Icon name="sort" size={16}/>{sortTime?'Usuń sortowanie':'Sortuj czas rosnąco'}</button>}</div>
    <div className="zx-datagrid">
     <div className="zx-datasheet" role="region" aria-label={`Arkusz danych: ${tab}`} tabIndex={0}><table><thead><tr><th scope="col"><span className="sr-only">Zaznacz</span></th>{dsCols[tab].map(c=><th key={c} scope="col">{c}</th>)}</tr></thead>
      <tbody>{rows.map(r=>{const id=keyOf(r);const on=focus?.table===tab&&focus.id===id;
       const linked=focus&&focus.table!==tab&&(focus.table==='Wyniki'?(tab==='Zawodnicy'?rel.swimmer?.id_zawodnika===id:rel.event?.id_konkurencji===id):tab==='Wyniki'&&rel.results?.some(x=>x.id_wyniku===id));
       return <tr key={id} className={`${on?'is-on':''} ${linked?'is-linked':''} ${r.dyskwalifikacja==='tak'?'is-dq':''}`} onClick={()=>select(tab,id)}><td><button type="button" className="zx-recsel" aria-pressed={on} aria-label={`Zaznacz rekord ${tab} ${id}`} onClick={ev=>{ev.stopPropagation();select(tab,id);}}>{on?'▶':linked?'↔':''}</button></td>{dsCols[tab].map(c=><td key={c} className={typeof r[c]==='number'?'zx-num':''}>{cellFmt(c,r[c])}</td>)}</tr>;})}</tbody></table></div>
     <aside className="zx-related" aria-label="Rekordy powiązane"><h4><Icon name="right" size={16}/>Rekordy powiązane</h4>
      {!focus?<p className="small muted">Zaznacz rekord w arkuszu (przycisk na początku wiersza), a tu zobaczysz, z czym łączy go relacja.</p>
      :focus.table==='Wyniki'?<><p className="small">Wynik #{focus.id} wskazuje:</p><ul className="zx-rellist">
        <li><span>id_zawodnika = {rel.swimmer?.id_zawodnika} →</span><button type="button" className="text-button" onClick={()=>jump('Zawodnicy',rel.swimmer.id_zawodnika)}>Zawodnicy: {D.fullName(rel.swimmer)} ({rel.swimmer?.klasa})</button></li>
        <li><span>id_konkurencji = {rel.event?.id_konkurencji} →</span><button type="button" className="text-button" onClick={()=>jump('Konkurencje',rel.event.id_konkurencji)}>Konkurencje: {D.eventShort(rel.event)}</button></li></ul></>
      :<><p className="small">{focus.table==='Zawodnicy'?`Zawodnik #${focus.id} ma w tabeli Wyniki`:`Konkurencja #${focus.id} ma w tabeli Wyniki`} <b>{relRows.length}</b> {plural(relRows.length,'rekord','rekordy','rekordów')} (strona „wiele”):</p>
       <div className="zx-subsheet"><table><thead><tr><th scope="col">id_wyniku</th><th scope="col">{focus.table==='Zawodnicy'?'id_konkurencji':'id_zawodnika'}</th><th scope="col">czas</th><th scope="col">dyskw.</th></tr></thead><tbody>{relRows.map(r=><tr key={r.id_wyniku} className={r.dyskwalifikacja==='tak'?'is-dq':''}><td><button type="button" className="text-button" onClick={()=>jump('Wyniki',r.id_wyniku)} aria-label={`Przejdź do wyniku ${r.id_wyniku}`}>{r.id_wyniku}</button></td><td className="zx-num">{focus.table==='Zawodnicy'?r.id_konkurencji:r.id_zawodnika}</td><td className="zx-num">{D.fmtTime(r.czas)}</td><td>{r.dyskwalifikacja}</td></tr>)}</tbody></table></div>
       {tab!=='Wyniki'&&<button type="button" className="zx-sortbtn" aria-pressed={sortTime} onClick={()=>setSortTime(!sortTime)}><Icon name="sort" size={16}/>{sortTime?'Usuń sortowanie':'Sortuj czas rosnąco'}</button>}</>}
     </aside>
    </div>
   </div>
  </div>
  <div className="zx-actions"><button type="button" className="btn" onClick={check} disabled={tasks[active]?.passed}><Icon name={active==='winner'?'trophy':'check'} size={20}/>{active==='winner'?'Zgłoś zwyciężczynię':'Sprawdź'}</button>{tasks[active]?.passed&&<span className="small muted">To zadanie jest zaliczone — wybierz następne.</span>}</div>
  <Feedback msg={msg}/>
 </section>;
}

/* ───────── Tryb 3: tablica wyników ───────── */
const evShort=k=>`${k.dystans} ${k.styl.slice(0,4)}. ${k.plec}`;
function Board({sub,save}){
 const b=sub;
 const {swimmers,results}=Z.boardData(b);
 const st=Z.boardTaskStatus(b);
 const res=Z.boardResult(b);
 const [event,setEvent]=useState(1);
 const [msg,setMsg]=useState(null);
 const [form,setForm]=useState({z:'',k:'',czas:'',dq:false});
 const [raw,setRaw]=useState({z:'',k:'',czas:'',dq:false});
 const [zTab,setZTab]=useState('edit');
 const [edit,setEdit]=useState({id:'',klasa:''});
 const [nz,setNz]=useState({imie:'',nazwisko:'',plec:'',klasa:'',rocznik:''});
 const statusRef=useRef();
 useEffect(()=>{if(msg)statusRef.current?.scrollIntoView({block:'nearest'});},[msg]);
 const addedIds=new Set((b.added||[]).map(r=>r.id_wyniku));
 const editedIds=new Set(Object.keys(b.edits||{}).map(Number));
 const board=D.ranking(event,results,swimmers);
 const sorted=[...swimmers].sort((a,c)=>a.nazwisko.localeCompare(c.nazwisko,'pl')||a.imie.localeCompare(c.imie,'pl'));
 function apply(r,okText){
  if(r.ok){save(r.state);if(r.rec?.id_konkurencji)setEvent(r.rec.id_konkurencji);setMsg({ok:true,text:r.msg,hint:okText});}
  else{if(r.state!==b)save(r.state);setMsg({ok:false,text:r.msg,hint:r.hint,access:r.error});}
 }
 function saveForm(ev){ev.preventDefault();if(!form.z||!form.k){setMsg({ok:false,text:'Wybierz zawodnika i konkurencję z list.'});return;}
  const r=Z.addResult(b,{id_zawodnika:form.z,id_konkurencji:form.k,czas:form.czas,dq:form.dq},'form');
  if(r.ok){const place=D.ranking(r.rec.id_konkurencji,Z.boardData(r.state).results,Z.boardData(r.state).swimmers).find(x=>x.id_wyniku===r.rec.id_wyniku);apply(r,`Tablica przeliczyła się sama: ${place?.miejsce?`${place.miejsce}. miejsce`:'DSQ'}. Nazwiska nie przepisywałeś/-aś — wynik wskazuje zawodnika numerem ${r.rec.id_zawodnika}.`);setForm({z:'',k:'',czas:'',dq:false});}
  else apply(r);}
 function saveRaw(ev){ev.preventDefault();const r=Z.addResult(b,{id_zawodnika:raw.z,id_konkurencji:raw.k,czas:raw.czas,dq:raw.dq},'sheet');if(r.ok){apply(r,'Rekord zapisany wprost w tabeli Wyniki. Tablica pokazuje go od razu.');setRaw({z:'',k:'',czas:'',dq:false});}else apply(r);}
 function saveEdit(ev){ev.preventDefault();const r=Z.editClass(b,edit.id,edit.klasa);if(r.ok){save(r.state);setMsg({ok:true,text:r.msg,hint:'Sprawdź tablicę w konkurencjach tej osoby — klasa zmieniła się wszędzie naraz.'});}else setMsg({ok:false,text:r.msg});}
 function saveNew(ev){ev.preventDefault();const r=Z.addSwimmer(b,nz);if(r.ok){save(r.state);setMsg({ok:true,text:r.msg,hint:`Teraz rekord Wyniki może wskazywać id_zawodnika = ${r.rec.id_zawodnika}. Dopisz wynik jeszcze raz.`});setNz({imie:'',nazwisko:'',plec:'',klasa:'',rocznik:''});}else setMsg({ok:false,text:r.msg});}
 const cur=edit.id?swimmers.find(z=>z.id_zawodnika===Number(edit.id)):null;
 const status=k=>st[k].passed;
 return <section className="zx" aria-label="Tablica wyników zawodów liczona z bazy">
  <Points score={res.score} max={res.max}>Zadania: <b>{['add','edit','fk'].filter(status).length}/3</b> · wynik Julii i klasa Leny: 2 pkt za pierwszym razem · zawodnik-widmo: 1 pkt za odrzucony zapis + 1 pkt za naprawę</Points>
  <ol className="zx-btasks">{Z.boardTasks.map((t,i)=><li key={t.id} className={status(t.id)?'is-ok':''}><span className="zx-tnum" aria-hidden="true">{status(t.id)?'✓':i+1}</span><div><b>{t.title}</b>{status(t.id)&&<span className="sr-only"> — zaliczone</span>}<p>{t.text}</p>{t.id==='fk'&&st.fk.rejected&&!st.fk.fixed&&<p className="zx-step">Krok 1 ✓ — baza odmówiła. Teraz krok 2: dodaj zawodnika.</p>}</div></li>)}</ol>
  <div className="zx-boardgrid">
   <div className="zx-forms">
    <form className="zx-form" onSubmit={saveForm} aria-labelledby="zx-f1"><div className="zx-ftitle" id="zx-f1"><Icon name="file" size={16}/>Formularz: Nowy wynik</div>
     <div className="zx-fbody">
      <label>Zawodnik<select value={form.z} onChange={e=>setForm({...form,z:e.target.value})}><option value="">(wybierz z listy)</option>{sorted.map(z=><option key={z.id_zawodnika} value={z.id_zawodnika}>{z.nazwisko} {z.imie} ({z.klasa})</option>)}</select></label>
      <label>Konkurencja<select value={form.k} onChange={e=>setForm({...form,k:e.target.value})}><option value="">(wybierz z listy)</option>{D.konkurencje.map(k=><option key={k.id_konkurencji} value={k.id_konkurencji}>{D.eventLabel(k)}</option>)}</select></label>
      <label>Czas (s)<input inputMode="decimal" placeholder="np. 38,41" value={form.czas} onChange={e=>setForm({...form,czas:e.target.value.slice(0,8)})}/></label>
      <label className="zx-check"><input type="checkbox" checked={form.dq} onChange={e=>setForm({...form,dq:e.target.checked})}/>Dyskwalifikacja</label>
     </div>
     <div className="zx-fnav"><span aria-hidden="true">Rekord: ◂ {results.length+1} z {results.length+1} ▸</span><button type="submit" className="zx-btn is-default">Zapisz rekord</button></div>
    </form>
    <form className="zx-form" onSubmit={saveRaw} aria-labelledby="zx-f2"><div className="zx-ftitle" id="zx-f2"><Icon name="table" size={16}/>Arkusz danych: Wyniki (wpis bez formularza)</div>
     <div className="zx-rawwrap"><table className="zx-raw"><thead><tr><th scope="col">id_wyniku</th><th scope="col">id_zawodnika</th><th scope="col">id_konkurencji</th><th scope="col">czas</th><th scope="col">dyskw.</th></tr></thead>
      <tbody>{results.slice(-2).map(r=><tr key={r.id_wyniku}><td>{r.id_wyniku}</td><td className="zx-num">{r.id_zawodnika}</td><td className="zx-num">{r.id_konkurencji}</td><td className="zx-num">{D.fmtTime(r.czas)}</td><td>{r.dyskwalifikacja}</td></tr>)}
       <tr className="zx-newrow"><td>(Nowy)</td><td><input aria-label="id_zawodnika" inputMode="numeric" value={raw.z} onChange={e=>setRaw({...raw,z:e.target.value.slice(0,4)})}/></td><td><input aria-label="id_konkurencji" inputMode="numeric" value={raw.k} onChange={e=>setRaw({...raw,k:e.target.value.slice(0,3)})}/></td><td><input aria-label="czas" inputMode="decimal" value={raw.czas} onChange={e=>setRaw({...raw,czas:e.target.value.slice(0,8)})}/></td><td><input type="checkbox" aria-label="dyskwalifikacja" checked={raw.dq} onChange={e=>setRaw({...raw,dq:e.target.checked})}/></td></tr></tbody></table></div>
     <div className="zx-fnav"><span className="small muted">Tu nie ma list — wpisujesz numery.</span><button type="submit" className="zx-btn is-default">Zapisz rekord</button></div>
    </form>
    <div className="zx-form"><div className="zx-ftitle"><Icon name="idcard" size={16}/>Formularz: Zawodnicy</div>
     <div className="zx-ztabs" role="group" aria-label="Tryb formularza Zawodnicy"><button type="button" aria-pressed={zTab==='edit'} onClick={()=>setZTab('edit')}>Popraw rekord</button><button type="button" aria-pressed={zTab==='new'} onClick={()=>setZTab('new')}>Nowy rekord</button></div>
     {zTab==='edit'?<form onSubmit={saveEdit}><div className="zx-fbody">
       <label>Zawodnik<select value={edit.id} onChange={e=>{const z=swimmers.find(x=>x.id_zawodnika===Number(e.target.value));setEdit({id:e.target.value,klasa:z?.klasa||''});}}><option value="">(wybierz z listy)</option>{sorted.map(z=><option key={z.id_zawodnika} value={z.id_zawodnika}>{z.nazwisko} {z.imie}</option>)}</select></label>
       {cur&&<p className="zx-ro small">id_zawodnika: <b>{cur.id_zawodnika}</b> · rocznik: <b>{cur.rocznik}</b> · płeć: <b>{cur.plec}</b></p>}
       <label>Klasa<input value={edit.klasa} disabled={!cur} onChange={e=>setEdit({...edit,klasa:e.target.value.slice(0,3)})}/></label></div>
      <div className="zx-fnav"><span/><button type="submit" className="zx-btn is-default" disabled={!cur}>Zapisz zmianę</button></div></form>
     :<form onSubmit={saveNew}><div className="zx-fbody">
       <p className="zx-ro small">id_zawodnika: <b>(Nowy) → {Z.nextSwimmerId(b)}</b> — Autonumerowanie</p>
       <label>Imię<input value={nz.imie} onChange={e=>setNz({...nz,imie:e.target.value.slice(0,30)})}/></label>
       <label>Nazwisko<input value={nz.nazwisko} onChange={e=>setNz({...nz,nazwisko:e.target.value.slice(0,40)})}/></label>
       <label>Płeć<select value={nz.plec} onChange={e=>setNz({...nz,plec:e.target.value})}><option value="">(wybierz)</option><option value="K">K</option><option value="M">M</option></select></label>
       <label>Klasa<input value={nz.klasa} onChange={e=>setNz({...nz,klasa:e.target.value.slice(0,3)})}/></label>
       <label>Rocznik<input inputMode="numeric" value={nz.rocznik} onChange={e=>setNz({...nz,rocznik:e.target.value.slice(0,4)})}/></label></div>
      <div className="zx-fnav"><span/><button type="submit" className="zx-btn is-default">Dodaj zawodnika</button></div></form>}
    </div>
    <div className="zx-log"><h4>Dziennik bazy</h4>{(b.log||[]).length?<ul>{[...(b.log||[])].reverse().slice(0,6).map((l,i)=><li key={i} className={l.type==='reject'?'is-bad':''}>{l.type==='add'?`+ Wyniki #${l.id_wyniku}: ${D.fullName(swimmers.find(z=>z.id_zawodnika===l.rec?.id_zawodnika))}, ${D.fmtTime(l.rec?.czas)} s`:l.type==='edit'?`✎ Zawodnicy #${l.id_zawodnika}: klasa ${l.from} → ${l.to} (1 komórka)`:l.type==='swimmer'?`+ Zawodnicy #${l.id_zawodnika}`:`✖ Odrzucono: id_zawodnika = ${l.id_zawodnika} nie istnieje`}{l.type==='add'&&addedIds.has(l.id_wyniku)&&<button type="button" className="zx-x" aria-label={`Usuń rekord Wyniki ${l.id_wyniku}`} onClick={()=>{save(Z.removeAdded(b,l.id_wyniku));setMsg({ok:true,text:`Usunięto rekord Wyniki #${l.id_wyniku}.`});}}>✕</button>}</li>)}</ul>:<p className="small muted">Na razie bez zmian.</p>}</div>
   </div>
   <div className="zx-boardcol">
    <div className="zx-board"><div className="zx-bhead"><span>TABLICA WYNIKÓW</span><span className="zx-sim">symulacja</span></div>
     <p className="zx-bevent">{D.eventLabel(D.eventById(event))}</p>
     <div className="zx-bevents" role="group" aria-label="Wybierz konkurencję">{D.konkurencje.map(k=><button key={k.id_konkurencji} type="button" aria-pressed={event===k.id_konkurencji} onClick={()=>setEvent(k.id_konkurencji)} aria-label={D.eventLabel(k)}>{evShort(k)}</button>)}</div>
     <table className="zx-btable"><caption className="sr-only">Ranking: {D.eventLabel(D.eventById(event))}</caption><thead><tr><th scope="col">M.</th><th scope="col">Zawodnik</th><th scope="col">Klasa</th><th scope="col">Czas</th></tr></thead>
      <tbody>{board.map(r=><tr key={r.id_wyniku} className={`${addedIds.has(r.id_wyniku)?'is-new':''} ${r.miejsce&&r.miejsce<=3?'is-podium':''}`}><td>{r.miejsce?`${r.miejsce}.`:'DSQ'}</td><td>{r.imie} {r.nazwisko}{addedIds.has(r.id_wyniku)&&<em className="zx-tag">NOWY</em>}</td><td>{r.klasa}{editedIds.has(r.id_zawodnika)&&<em className="zx-tag is-edit">ZMIENIONO</em>}</td><td className="zx-num">{D.fmtTime(r.czas)}</td></tr>)}</tbody></table>
     <p className="zx-bsrc">Źródło: kwerenda Ranking (Wyniki + Zawodnicy + Konkurencje), czas rosnąco, DSQ bez miejsca.</p>
    </div>
    <div role="status" className="zx-status" ref={statusRef}>{msg&&(msg.access?<div className="zx-msgbox"><div className="zx-mtitle">Access (symulacja)</div><div className="zx-mbody"><Icon name="warning" size={28}/><div><p>{msg.text}</p>{msg.hint&&<p className="zx-hint"><b>Co to znaczy:</b> {msg.hint}</p>}</div></div><div className="zx-mbtns"><button type="button" className="zx-btn is-default" onClick={()=>setMsg(null)}>OK</button></div></div>
    :<div className={`feedback ${msg.ok?'':'retry'}`}><Icon name={msg.ok?'check':'warning'}/><div><strong>{msg.text}</strong>{msg.hint&&<p className="zx-hint">{msg.hint}</p>}</div></div>)}</div>
   </div>
  </div>
  {res.done&&<div className="zx-diagnosis is-ok"><h4><Icon name="check" size={20}/> Jedna zmiana — jedno miejsce</h4><p>Dopisałeś/-aś wynik bez przepisywania nazwiska, zmieniłeś/-aś klasę w jednej komórce, a baza nie wpuściła wyniku zawodnika-widma. Tak działają wyniki na zawodach, ligi e-sportowe i dziennik elektroniczny.</p></div>}
 </section>;
}

export default function ZawodyExplorer({data,value,onChange}){
 const mode=data.mode||'problem';
 const v=value||{};
 const results={problem:Z.problemResult,explore:Z.exploreResult,board:Z.boardResult};
 function save(sub){onChange({...v,[mode]:sub,modes:{...v.modes,[mode]:results[mode](sub)}});}
 const sub=v[mode]||{};
 if(mode==='explore')return <Explore sub={sub} save={save}/>;
 if(mode==='board')return <Board sub={sub} save={save}/>;
 return <Problem sub={sub} save={save}/>;
}
