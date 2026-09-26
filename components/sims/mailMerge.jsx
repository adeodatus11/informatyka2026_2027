import React,{useState,useRef,useEffect} from 'react';
import {Icon} from '../icons.jsx';
import * as M from '../../content/sims/mailMerge.js';
import './mailMerge.css';

const PROJECT_DOC={projectA:'Przypomnienie.docx',projectB:'List_praktyki.docx',demo:'Przypomnienie_wzor.docx'};
const DEMO_Q={q:'W rekordzie 2 (Michał Krawczyk) Word napisał „Szanowny Panie”, a w rekordzie 1 „Szanowna Pani”. Skąd to wie?',options:['Word zgaduje płeć po imieniu','Reguła JEŻELI sprawdza pole plec: dla „K” wstawia pierwszy tekst, dla innych wartości — drugi','Recepcja poprawiła każdy list ręcznie'],correct:1,explanation:'Tak. Reguła {JEŻELI plec = "K" "Szanowna Pani" "Szanowny Panie"} działa jak w Excelu JEŻELI: warunek → tekst 1, inaczej → tekst 2. Word niczego nie zgaduje — bierze dane z kolumny plec.',hint:'Spójrz na pierwszą linię szablonu (wyłącz Podgląd wyników): tam jest reguła, która czyta jedno z pól.'};

function initial(data){
 if(data.mode==='demo')return {docType:'letters',source:{file:'Stomatolog.accdb',table:'Przypomnienia_jutro'},template:M.demoTemplate,preview:true,rec:0,seen:[0]};
 return {docType:'normal',source:null,unchecked:[],filters:[],sort:null,template:data.mode==='projectB'?M.starterB:M.starterA,preview:false,rec:0};
}
function Rb({icon,label,onClick,disabled,pressed,menu,hint,sym}){
 return <button type="button" className={`mm-rbtn ${hint?'is-hint':''}`} onClick={onClick} disabled={disabled} aria-pressed={pressed} aria-haspopup={menu?'true':undefined}>{sym?<span className="mm-sym" aria-hidden="true">{sym}</span>:<Icon name={icon} size={20}/>}<span>{label}{menu&&' ▾'}</span></button>;
}
function Dlg({title,children,onOk,onCancel,okLabel='OK',okDisabled,wide}){
 const ref=useRef();useEffect(()=>{ref.current?.focus();},[]);
 return <div className={`mm-dialog ${wide?'is-wide':''}`} role="group" aria-label={title} tabIndex={-1} ref={ref}><div className="mm-dtitle"><span>{title}</span><button type="button" className="mm-x" aria-label="Zamknij okno" onClick={onCancel}>✕</button></div><div className="mm-dbody">{children}</div><div className="mm-dbtns">{onOk&&<button type="button" className="mm-btn is-default" onClick={onOk} disabled={okDisabled}>{okLabel}</button>}<button type="button" className="mm-btn" onClick={onCancel}>{onOk?'Anuluj':'Zamknij'}</button></div></div>;
}

export default function MailMerge({data,value,onChange}){
 const mode=data.mode||'projectA',demo=mode==='demo',project=mode==='projectB'?'B':'A';
 const st={...initial(data),...value};
 const [menu,setMenu]=useState(null),[dlg,setDlg]=useState(null),[draft,setDraft]=useState({}),[msg,setMsg]=useState(null);
 const taRef=useRef(),sel=useRef(null),caret=useRef(null);
 useEffect(()=>{if(caret.current!=null&&taRef.current){taRef.current.focus();taRef.current.setSelectionRange(caret.current,caret.current);caret.current=null;}});
 const src=M.getSource(st.source);
 const fields=src?.fields||[];
 const recs=src?M.recipients(st):[];
 const listRecs=src?M.listRecords(st):[];
 const recIdx=Math.min(st.rec||0,Math.max(recs.length-1,0));
 const cur=recs[recIdx];

 function save(patch){
  const n={...st,...patch};
  if(demo){const seen=n.seen||[];const ok=n.answer===DEMO_Q.correct;onChange({...n,done:ok,score:ok?(n.first?1:0.5):0,max:1,summary:ok?'Rozumiesz regułę JEŻELI (Pani/Pan)':undefined});return;}
  onChange({...n,max:6,score:n.merged?.score||0,done:!!n.merged&&n.merged.score>=4,summary:n.merged?.summary});
 }
 function insert(token){
  const t=st.template||'';const s=sel.current??{start:t.length,end:t.length};
  const next=t.slice(0,s.start)+token+t.slice(s.end);caret.current=s.start+token.length;sel.current={start:caret.current,end:caret.current};
  save({template:next,preview:false});setMenu(null);
 }
 function trackSel(e){sel.current={start:e.target.selectionStart,end:e.target.selectionEnd};}
 function chooseSource(file,table){save({source:{file,table},unchecked:[],filters:[],sort:null,rec:0,docType:st.docType==='normal'?'letters':st.docType});setDlg(null);setMsg({ok:true,text:`Źródło danych: ${file} → ${table}. Teraz możesz wstawiać pola i edytować listę adresatów.`});}
 function merge(kind,opts={}){
  const r=M.mergeResult(project,st);const docs=M.mergeDocs(st).slice(0,40).map(d=>({text:d.text,to:kind==='email'?(d.rec[opts.to]||'(brak adresu)'):null,label:[d.rec.imie,d.rec.nazwisko].filter(Boolean).join(' ')||d.rec.nazwa}));
  save({merged:{kind,subject:opts.subject||'',checks:r.checks,score:r.score,summary:r.summary,docs,count:r.count},runs:(st.runs||0)+1});
  setDlg(null);setMenu(null);
  setMsg(r.score===6?{ok:true,text:`Kontroler jakości: 6/6. ${r.summary}.`}:{ok:false,text:`Kontroler jakości: ${r.score}/6. Popraw punkty oznaczone ✗ i scal ponownie.`});
 }
 const toggleMenu=m=>setMenu(menu===m?null:m);
 const disabledNoSrc=!src||demo;

 // ---------- Wstążka ----------
 const ribbon=<div className="mm-ribbon">
  <div className="mm-rtabs">{['Plik','Narzędzia główne','Wstawianie','Projektowanie','Układ','Odwołania','Korespondencja','Recenzja','Widok'].map(t=><span key={t} className={t==='Korespondencja'?'is-active':''}>{t}</span>)}</div>
  <div className="mm-groups">
   <div className="mm-group"><div>
    <div className="mm-mwrap"><Rb icon="mail" label="Rozpocznij korespondencję seryjną" menu disabled={demo} onClick={()=>toggleMenu('start')} hint={!demo&&st.docType==='normal'}/>
     {menu==='start'&&<div className="mm-menu" role="menu">{M.docTypes.map(([k,l])=><button key={k} type="button" role="menuitemradio" aria-checked={st.docType===k} onClick={()=>{save({docType:k});setMenu(null);setMsg({ok:true,text:`Typ dokumentu: ${l}.`});}}>{st.docType===k?'● ':''}{l}</button>)}<button type="button" role="menuitem" disabled>Kreator korespondencji seryjnej krok po kroku…</button></div>}</div>
    <div className="mm-mwrap"><Rb icon="group" label="Wybierz adresatów" menu disabled={demo} onClick={()=>toggleMenu('recip')} hint={!demo&&st.docType!=='normal'&&!src}/>
     {menu==='recip'&&<div className="mm-menu" role="menu"><button type="button" role="menuitem" onClick={()=>{setMenu(null);setMsg({ok:false,text:'„Wpisz nową listę” tworzy listę od zera. Nasze dane już są w bazie i w arkuszu — użyj istniejącej listy.'});}}>Wpisz nową listę…</button><button type="button" role="menuitem" onClick={()=>{setMenu(null);setDlg('file');}}>Użyj istniejącej listy…</button><button type="button" role="menuitem" disabled>Wybierz z kontaktów programu Outlook…</button></div>}</div>
    <Rb icon="list" label="Edytuj listę adresatów" disabled={disabledNoSrc} onClick={()=>setDlg('list')}/>
   </div><span>Rozpocznij korespondencję seryjną</span></div>
   <div className="mm-group"><div>
    <span className="mm-rbtn is-dim"><Icon name="palette" size={20}/><span>Wyróżnij pola scalania</span></span>
    <div className="mm-mwrap"><Rb icon="hash" label="Wstaw pole scalania" menu disabled={disabledNoSrc} onClick={()=>toggleMenu('field')}/>
     {menu==='field'&&<div className="mm-menu is-fields" role="menu">{fields.map(([f,t])=>['date','datetime','exceldate'].includes(t)?<React.Fragment key={f}><button type="button" role="menuitem" onClick={()=>insert(M.fieldToken(f))}>{f} <small>(bez formatu)</small></button><button type="button" role="menuitem" onClick={()=>insert(M.fieldToken(f,'dd.MM.yyyy'))}>{f} <small>\@ "dd.MM.yyyy"</small></button>{t==='datetime'&&<button type="button" role="menuitem" onClick={()=>insert(M.fieldToken(f,'HH:mm'))}>{f} <small>\@ "HH:mm"</small></button>}</React.Fragment>:<button key={f} type="button" role="menuitem" onClick={()=>insert(M.fieldToken(f))}>{f}</button>)}</div>}</div>
    <div className="mm-mwrap"><Rb icon="settings" label="Reguły" menu disabled={disabledNoSrc} onClick={()=>toggleMenu('rules')}/>
     {menu==='rules'&&<div className="mm-menu" role="menu">{['Zapytaj…','Wypełnij…'].map(x=><button key={x} type="button" role="menuitem" disabled>{x}</button>)}<button type="button" role="menuitem" onClick={()=>{setMenu(null);setDraft({field:fields[0]?.[0],op:'=',value:'',yes:'',no:''});setDlg('if');}}>Jeżeli…To…Inaczej…</button>{['Numer scalanego rekordu','Następny rekord'].map(x=><button key={x} type="button" role="menuitem" disabled>{x}</button>)}<button type="button" role="menuitem" onClick={()=>{setMenu(null);setDraft({field:fields[0]?.[0],op:'jest puste',value:''});setDlg('skip');}}>Pomiń rekord jeżeli…</button></div>}</div>
   </div><span>Wpisywanie i wstawianie pól</span></div>
   <div className="mm-group"><div>
    <Rb icon="search" label="Podgląd wyników" pressed={!!st.preview} disabled={!src} hint={demo&&!st.preview} onClick={()=>save({preview:!st.preview})}/>
    <div className="mm-nav"><button type="button" aria-label="Poprzedni rekord" disabled={!st.preview||recIdx<=0} onClick={()=>save({rec:recIdx-1,seen:[...new Set([...(st.seen||[]),recIdx-1])]})}>◀</button><span aria-live="polite" aria-label={`Rekord ${recIdx+1} z ${recs.length}`}>{recs.length?recIdx+1:0}</span><button type="button" aria-label="Następny rekord" className={demo&&(st.seen||[]).length<3&&st.preview?'is-hint':''} disabled={!st.preview||recIdx>=recs.length-1} onClick={()=>save({rec:recIdx+1,seen:[...new Set([...(st.seen||[]),recIdx+1])]})}>▶</button></div>
   </div><span>Podgląd wyników</span></div>
   <div className="mm-group"><div>
    <div className="mm-mwrap"><Rb icon="check" label="Zakończ i scal" menu disabled={disabledNoSrc} onClick={()=>toggleMenu('finish')}/>
     {menu==='finish'&&<div className="mm-menu is-right" role="menu"><button type="button" role="menuitem" onClick={()=>{setMenu(null);setDlg('edit');}}>Edytuj poszczególne dokumenty…</button><button type="button" role="menuitem" onClick={()=>{setMenu(null);setDlg('print');}}>Drukuj dokumenty…</button><button type="button" role="menuitem" disabled={st.docType!=='email'} onClick={()=>{setMenu(null);setDraft({to:'email',subject:project==='A'?'Przypomnienie o wizycie':'Praktyki zawodowe — prośba'});setDlg('email');}}>Wyślij wiadomości e-mail…</button></div>}</div>
   </div><span>Zakończ</span></div>
  </div>
 </div>;

 // ---------- Okna dialogowe ----------
 let dialog=null;
 const types=Object.fromEntries(fields);
 if(dlg==='file')dialog=<Dlg title="Wybieranie źródła danych" onCancel={()=>setDlg(null)}><p className="mm-cap">Dokumenty › Gabinet</p><ul className="mm-files">{Object.entries(M.sources).map(([k,s])=><li key={k}><button type="button" onClick={()=>{setDraft({file:k,table:''});setDlg('table');}}><Icon name={k.endsWith('xlsx')?'table':'drive'} size={22}/><span><b>{k}</b><small>{s.kind}</small></span></button></li>)}</ul></Dlg>;
 if(dlg==='table'){const s=M.sources[draft.file];dialog=<Dlg title="Wybieranie tabeli" onCancel={()=>setDlg(null)} onOk={()=>chooseSource(draft.file,draft.table)} okDisabled={!draft.table}><div className="mm-scroll" role="region" aria-label="Tabele i kwerendy" tabIndex={0}><table className="mm-ttable"><thead><tr><th scope="col">Nazwa</th><th scope="col">Typ</th><th scope="col">Rekordy</th></tr></thead><tbody>{Object.entries(s.tables).map(([t,d])=><tr key={t} className={draft.table===t?'is-sel':''}><td><label><input type="radio" name={`${data.id}-tbl`} checked={draft.table===t} onChange={()=>setDraft({...draft,table:t})}/>{t}</label></td><td>{d.type}</td><td>{d.records().length}</td></tr>)}</tbody></table></div>{draft.file.endsWith('xlsx')&&<label className="mm-check"><input type="checkbox" checked readOnly/>Pierwszy wiersz danych zawiera nagłówki kolumn</label>}</Dlg>;}
 if(dlg==='list')dialog=<Dlg wide title="Adresaci korespondencji seryjnej" onCancel={()=>setDlg(null)} onOk={()=>setDlg(null)}><p className="mm-cap">To jest lista adresatów, która zostanie użyta w korespondencji seryjnej. Użyj pól wyboru, aby dodać lub usunąć adresatów. Zaznaczonych: <b>{listRecs.filter(r=>!(st.unchecked||[]).includes(r._id)).length}</b> z {listRecs.length}{(st.filters||[]).some(f=>f.field)?' (działa filtr)':''}.</p>
  <div className="mm-scroll" role="region" aria-label="Lista adresatów" tabIndex={0}><table className="mm-ltable"><thead><tr><th scope="col"><span className="sr-only">Uwzględnij</span>✓</th>{fields.map(([f])=><th key={f} scope="col">{f}</th>)}</tr></thead><tbody>{listRecs.map(r=>{const on=!(st.unchecked||[]).includes(r._id);return <tr key={r._id}><td><input type="checkbox" aria-label={`Uwzględnij ${r.imie||r.nazwa} ${r.nazwisko||''}`} checked={on} onChange={()=>save({unchecked:on?[...(st.unchecked||[]),r._id]:(st.unchecked||[]).filter(x=>x!==r._id),rec:0})}/></td>{fields.map(([f,t])=><td key={f}>{M.rawValue(r[f],t)}</td>)}</tr>;})}</tbody></table></div>
  <p className="mm-cap"><b>Uściślij listę adresatów:</b></p><div className="mm-refine"><button type="button" className="mm-link" onClick={()=>{setDraft({tab:'sort',filters:[...(st.filters||[]),{},{}].slice(0,2),sort:st.sort||{field:'',dir:'asc'}});setDlg('filter');}}>Sortuj…</button><button type="button" className="mm-link" onClick={()=>{setDraft({tab:'filter',filters:[...(st.filters||[]),{},{}].slice(0,2),sort:st.sort||{field:'',dir:'asc'}});setDlg('filter');}}>Filtruj…</button><span className="mm-link is-dim">Znajdź duplikaty…</span><span className="mm-link is-dim">Weryfikuj adresy…</span></div></Dlg>;
 if(dlg==='filter'){const setF=(i,p)=>{const f=draft.filters.map((x,j)=>j===i?{...x,...p}:x);setDraft({...draft,filters:f});};
  dialog=<Dlg title="Filtruj i sortuj" onCancel={()=>setDlg('list')} onOk={()=>{save({filters:draft.filters.filter(f=>f.field&&f.op),sort:draft.sort.field?draft.sort:null,rec:0});setDlg('list');}}>
   <div className="mm-dtabs" role="group" aria-label="Karta">{[['filter','Filtruj rekordy'],['sort','Sortuj rekordy']].map(([k,l])=><button key={k} type="button" aria-pressed={draft.tab===k} onClick={()=>setDraft({...draft,tab:k})}>{l}</button>)}</div>
   {draft.tab==='filter'?<div className="mm-frows">{draft.filters.map((f,i)=><div key={i} className="mm-frow"><span className="mm-and">{i?'I':''}</span><label>Pole<select value={f.field||''} onChange={e=>setF(i,{field:e.target.value,op:f.op||'eq'})}><option value="">(brak)</option>{fields.map(([x])=><option key={x}>{x}</option>)}</select></label><label>Porównanie<select value={f.op||'eq'} disabled={!f.field} onChange={e=>setF(i,{op:e.target.value})}>{M.filterOps.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label><label>Porównaj z<input value={f.value||''} disabled={!f.field||['empty','notempty'].includes(f.op)} onChange={e=>setF(i,{value:e.target.value.slice(0,40)})}/></label></div>)}<button type="button" className="mm-link" onClick={()=>setDraft({...draft,filters:[{},{}]})}>Wyczyść wszystko</button></div>
   :<div className="mm-frow"><label>Sortuj według<select value={draft.sort.field} onChange={e=>setDraft({...draft,sort:{...draft.sort,field:e.target.value}})}><option value="">(brak)</option>{fields.map(([x])=><option key={x}>{x}</option>)}</select></label><fieldset className="mm-radios"><legend className="sr-only">Kierunek</legend>{[['asc','Rosnąco'],['desc','Malejąco']].map(([k,l])=><label key={k}><input type="radio" name={`${data.id}-dir`} checked={draft.sort.dir===k} onChange={()=>setDraft({...draft,sort:{...draft.sort,dir:k}})}/>{l}</label>)}</fieldset></div>}
  </Dlg>;}
 if(dlg==='if')dialog=<Dlg title="Wstawianie pola programu Word: IF" onCancel={()=>setDlg(null)} okDisabled={!draft.field||!draft.yes&&!draft.no} onOk={()=>{insert(M.ifToken(draft.field,draft.op,draft.value,draft.yes,draft.no));setDlg(null);}}>
  <p className="mm-cap"><b>Jeżeli</b></p><div className="mm-frow"><label>Nazwa pola<select value={draft.field||''} onChange={e=>setDraft({...draft,field:e.target.value})}>{fields.map(([x])=><option key={x}>{x}</option>)}</select></label><label>Porównanie<select value={draft.op} onChange={e=>setDraft({...draft,op:e.target.value})}>{M.compareOps.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label><label>Porównaj z<input value={draft.value} disabled={!['=','<>'].includes(draft.op)} onChange={e=>setDraft({...draft,value:e.target.value.slice(0,40)})}/></label></div>
  <label className="mm-block">Wstaw ten tekst:<textarea rows={2} value={draft.yes} onChange={e=>setDraft({...draft,yes:e.target.value.slice(0,80)})}/></label>
  <label className="mm-block">W przeciwnym razie wstaw ten tekst:<textarea rows={2} value={draft.no} onChange={e=>setDraft({...draft,no:e.target.value.slice(0,80)})}/></label></Dlg>;
 if(dlg==='skip')dialog=<Dlg title="Wstawianie pola programu Word: Pomiń rekord jeżeli" onCancel={()=>setDlg(null)} okDisabled={!draft.field} onOk={()=>{insert(M.skipToken(draft.field,draft.op,draft.value));setDlg(null);setMsg({ok:true,text:'Reguła „Pomiń rekord jeżeli” wstawiona. Rekordy spełniające warunek nie dostaną dokumentu.'});}}>
  <div className="mm-frow"><label>Nazwa pola<select value={draft.field||''} onChange={e=>setDraft({...draft,field:e.target.value})}>{fields.map(([x])=><option key={x}>{x}</option>)}</select></label><label>Porównanie<select value={draft.op} onChange={e=>setDraft({...draft,op:e.target.value})}>{M.compareOps.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label><label>Porównaj z<input value={draft.value} disabled={!['=','<>'].includes(draft.op)} onChange={e=>setDraft({...draft,value:e.target.value.slice(0,40)})}/></label></div></Dlg>;
 if(dlg==='edit'||dlg==='print')dialog=<Dlg title={dlg==='edit'?'Scal do nowego dokumentu':'Scal do drukarki'} onCancel={()=>setDlg(null)} onOk={()=>merge(dlg==='edit'?'docs':'print')}><fieldset className="mm-radios"><legend>Scal rekordy</legend><label><input type="radio" checked readOnly name={`${data.id}-all`}/>Wszystkie ({recs.length})</label><label className="is-dim"><input type="radio" disabled name={`${data.id}-all`}/>Bieżący rekord</label></fieldset>{dlg==='print'&&<p className="mm-cap">W symulacji nic nie zostanie wydrukowane — zobaczysz dokumenty na ekranie.</p>}</Dlg>;
 if(dlg==='email')dialog=<Dlg title="Scalanie do wiadomości e-mail" onCancel={()=>setDlg(null)} okDisabled={!types[draft.to]} onOk={()=>{if(draft.to!=='email'){setMsg({ok:false,text:`Pole „${draft.to}” nie zawiera adresów e-mail. W polu „Do:” wybierz email.`});return;}merge('email',{to:draft.to,subject:draft.subject});}}>
  <p className="mm-cap"><b>Opcje wiadomości</b></p><label className="mm-block">Do:<select value={draft.to} onChange={e=>setDraft({...draft,to:e.target.value})}>{fields.map(([x])=><option key={x}>{x}</option>)}</select></label><label className="mm-block">Wiersz tematu:<input value={draft.subject} onChange={e=>setDraft({...draft,subject:e.target.value.slice(0,80)})}/></label><label className="mm-block">Format poczty:<select disabled><option>HTML</option></select></label><p className="mm-cap">Symulacja: wiadomości trafią do „Skrzynki nadawczej” na ekranie — nic nie zostanie wysłane.</p></Dlg>;

 // ---------- Dokument ----------
 const rendered=st.preview&&cur&&src?M.renderRecord(st.template,cur,fields).text:null;
 const checks=st.merged?.checks;
 const allChecks=demo?null:(checks||M.qualityChecks(project,{...st,source:null}).map(c=>({...c,ok:null})));
 const seen=(st.seen||[]).length;

 return <section className="mm" aria-label="Symulator korespondencji seryjnej w programie Word" onKeyDown={e=>{if(e.key==='Escape')setMenu(null);}}>
  {!demo&&<div className="mm-top"><div className="mm-points"><Icon name="trophy" size={22}/><strong>{st.merged?.score||0}</strong><span>/ 6 pkt</span></div><div className="mm-roles"><span><b>A · Dane:</b> Rozpocznij, Wybierz adresatów, Edytuj listę</span><span><b>B · Szablon:</b> treść, pola, reguły</span></div></div>}
  {!demo&&<div className="mm-criteria"><h4>Kryteria sukcesu {checks?`— kontroler: ${st.merged.score}/6`:'(sprawdzi je kontroler po scaleniu)'}</h4><ul>{allChecks.map(c=><li key={c.id} className={c.ok===true?'is-ok':c.ok===false?'is-bad':''}><span aria-hidden="true">{c.ok===true?'✓':c.ok===false?'✗':'○'}</span><span>{c.label}{c.ok===false&&<small>{c.hint}</small>}</span><span className="sr-only">{c.ok===true?' — spełnione':c.ok===false?' — niespełnione':''}</span></li>)}</ul></div>}
  <div className="mm-window">
   <div className="mm-titlebar"><span>{PROJECT_DOC[mode]} — Word</span><span className="mm-sim">symulacja</span></div>
   {ribbon}
   <div className="mm-stage">
    {dialog&&<div key={dlg} className="mm-dwrap">{dialog}</div>}
    <div className="mm-page" aria-label="Dokument główny">
     {st.docType==='email'&&!demo&&<p className="mm-mailhead">Wiadomość e-mail · Do: «email»</p>}
     {rendered!=null?<div className="mm-rendered" aria-live="polite">{rendered}</div>:<label className="mm-edit"><span className="sr-only">Treść dokumentu głównego (szablon)</span><textarea ref={taRef} value={st.template} readOnly={demo} spellCheck={false} onSelect={trackSel} onKeyUp={trackSel} onClick={trackSel} onChange={e=>{trackSel(e);save({template:e.target.value.slice(0,1500)});}} rows={demo?6:14}/></label>}
    </div>
   </div>
   <p className="mm-statusbar">{src?`Źródło: ${st.source.file} › ${st.source.table} · adresatów: ${recs.length}`:'Brak źródła danych'} · Typ: {M.docTypes.find(([k])=>k===st.docType)?.[1]}{st.preview?` · Podgląd: rekord ${recIdx+1}`:''}</p>
  </div>
  {!demo&&<p className="small muted mm-tip">Tip: zaznacz myszką np. <code>[imię]</code> i kliknij pole we „Wstaw pole scalania” — pole zastąpi zaznaczenie. W prawdziwym Wordzie reguły wyglądają tak samo po naciśnięciu Alt+F9 (kody pól: IF, SKIPIF, MERGEFIELD).</p>}
  <div role="status">{msg&&<div className={`feedback ${msg.ok?'':'retry'}`}><Icon name={msg.ok?'check':'warning'}/><div>{msg.text}</div></div>}</div>
  {demo&&<fieldset className="mm-demo-q"><legend>{seen<3?`Włącz Podgląd wyników i przejdź strzałką ▶ przez co najmniej 3 rekordy (obejrzane: ${Math.min(seen,3)}/3).`:DEMO_Q.q}</legend>
   {seen>=3&&<div className="choices">{DEMO_Q.options.map((o,i)=><button key={o} type="button" aria-pressed={st.answer===i} className={`choice ${st.answer===i?'selected':''}`} onClick={()=>save({answer:i,first:st.first??i===DEMO_Q.correct})}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span>{o}</span></button>)}</div>}
   {st.answer!=null&&<div className={`feedback ${st.answer===DEMO_Q.correct?'':'retry'}`}><Icon name={st.answer===DEMO_Q.correct?'check':'book'}/><div>{st.answer===DEMO_Q.correct?DEMO_Q.explanation:`Spróbuj jeszcze raz. ${DEMO_Q.hint}`}</div></div>}
  </fieldset>}
  {st.merged&&!demo&&<div className="mm-out"><h4>{st.merged.kind==='email'?`Skrzynka nadawcza (symulacja) — ${st.merged.count} wiadomości`:`Listy1 — ${st.merged.count} ${st.merged.count===1?'dokument':'dokumentów'}`}</h4>{st.merged.count===0&&<p>Brak dokumentów — lista adresatów jest pusta.</p>}
   <div className="mm-docs">{st.merged.docs.map((d,i)=><article key={i} className="mm-doc" aria-label={`Dokument ${i+1}: ${d.label}`}><header>{d.to?<><b>Do:</b> {d.to}<br/><b>Temat:</b> {st.merged.subject}</>:<b>Dokument {i+1} · {d.label}</b>}</header><p>{d.text}</p></article>)}</div></div>}
 </section>;
}
