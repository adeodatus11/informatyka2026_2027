import React,{useState,useRef,useEffect} from 'react';
import {Icon} from '../icons.jsx';
import {pacjenci,lekarze,fieldTypes,typeLabels} from '../../content/sims/stomatolog-data.js';
import * as W from '../../content/sims/importWizard.js';
import './importWizard.css';

const ITEMS={
 guided:[['source','Źródło: dołącz do tabeli Pacjenci'],['format','Format rozdzielany i ogranicznik'],['header','Nagłówki i kwalifikator tekstu'],['fields','Nazwy pól i „Pomiń”'],['dates','Kolejność dat DMR']],
 demo:[['source','Luka 1: co zrobić z danymi'],['format','Luka 2: ogranicznik']]
};
const pts=it=>it?.ok?(it.first?1:0.5):0;
const fmt=n=>String(n).replace('.',',');
function mark(items={},key,ok){const p=items[key]||{attempts:0};if(p.ok)return items;return {...items,[key]:{attempts:p.attempts+1,ok,first:ok&&p.attempts===0}};}

// ---------- Wspólne elementy okna Accessa ----------
function Ribbon({active='Dane zewnętrzne',children}){
 return <div className="iw-ribbon">
  <div className="iw-tabs" role="presentation">{['Plik','Narzędzia główne','Tworzenie','Dane zewnętrzne','Narzędzia bazy danych','Pomoc'].map(t=><span key={t} className={t===active?'is-active':''}>{t}</span>)}</div>
  <div className="iw-groups">{children}</div>
 </div>;
}
function Group({label,children}){return <div className="iw-group"><div className="iw-group-body">{children}</div><span className="iw-group-label">{label}</span></div>;}
function NavPane({tables}){
 return <aside className="iw-nav" aria-label="Okienko nawigacji"><p className="iw-nav-head">Wszystkie obiekty…</p><p className="iw-nav-sub">Tabele</p><ul>{tables.map(t=><li key={t} className={t.includes('ImportErrors')?'is-new':''}><Icon name="table" size={16}/>{t}</li>)}</ul></aside>;
}
function Datasheet({caption,columns,rows,highlightFrom,max=400}){
 return <div className="iw-sheet"><div className="iw-sheet-scroll" role="region" aria-label={caption} tabIndex={0} style={{maxHeight:max}}><table><caption>{caption}</caption><thead><tr>{columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i} className={highlightFrom!=null&&i>=highlightFrom?'is-new':''}>{columns.map(c=><td key={c}>{r[c]??''}</td>)}</tr>):<tr><td colSpan={columns.length} className="iw-empty">(Tabela jest pusta)</td></tr>}</tbody></table></div><p className="iw-recbar">Rekord: {rows.length?1:0} z {rows.length}</p></div>;
}
function Dialog({title,children,buttons,dref}){
 return <div className="iw-dialog" role="group" aria-label={title} ref={dref} tabIndex={-1}><div className="iw-dialog-title"><span>{title}</span><span aria-hidden="true" className="iw-x">✕</span></div><div className="iw-dialog-body">{children}</div>{buttons&&<div className="iw-dialog-buttons">{buttons}</div>}</div>;
}
function MessageBox({text,onOk}){
 return <div className="iw-msgbox" role="alertdialog" aria-label="Komunikat programu Access"><div className="iw-dialog-title"><span>Microsoft Access (symulacja)</span></div><div className="iw-msg-body"><Icon name="warning" size={32}/><p>{text}</p></div><div className="iw-dialog-buttons"><button type="button" className="iw-btn is-default" onClick={onOk}>OK</button></div></div>;
}
function Feedback({msg}){if(!msg)return <div role="status" className="iw-status-empty"/>;return <div role="status" className={`feedback ${msg.ok?'':'retry'} iw-feedback`}><Icon name={msg.ok?'check':'warning'}/><div>{msg.title&&<strong>{msg.title} </strong>}{msg.text}</div></div>;}
function Score({items,mode,score,max}){
 return <div className="iw-score" aria-label="Postęp i punkty"><div className="iw-points"><Icon name="trophy" size={22}/><strong>{fmt(score)}</strong><span>/ {max} pkt</span></div><ul>{ITEMS[mode].map(([k,l])=>{const it=items?.[k];return <li key={k} className={it?.ok?'is-ok':it?.attempts?'is-retry':''}><span aria-hidden="true">{it?.ok?'✓':it?.attempts?'↻':'○'}</span>{l}<span className="sr-only">{it?.ok?` — zaliczone, ${fmt(pts(it))} pkt`:it?.attempts?' — do poprawy':' — jeszcze nie sprawdzone'}</span></li>;})}</ul></div>;
}

function B({children,onClick,disabled,primary}){return <button type="button" className={`iw-btn ${primary?'is-default':''}`} onClick={onClick} disabled={disabled}>{children}</button>;}
// ---------- Kreator (tryb demo i samodzielny) ----------
function Wizard({data,value,onChange}){
 const mode=data.mode==='demo'?'demo':'guided';const file=W.files[mode];const demo=mode==='demo';
 const v={step:'ribbon',s:{...W.defaultSettings(mode),...(demo?{firstRow:true}:{})},items:{},...value};
 const s=v.s;
 const [msg,setMsg]=useState(null),[menu,setMenu]=useState(false),[adv,setAdv]=useState(null),[box,setBox]=useState(null);
 const dref=useRef(),touched=useRef(false);
 useEffect(()=>{if(touched.current)dref.current?.focus({preventScroll:false});},[v.step,adv]);
 const keys=ITEMS[mode].map(([k])=>k),max=keys.length;
 function save(patch,feedback){touched.current=true;const n={...v,...patch};const items=n.items;const score=keys.reduce((a,k)=>a+pts(items[k]),0);
  const done=n.step==='done';
  onChange({...n,score,max,done,summary:done?(demo?'Demo: zaimportowano 2 lekarzy':`Import: ${n.result?.records.length??0} wierszy, ${n.result?.errors.length??0} błąd w Pacjenci_ImportErrors`):undefined});
  if(feedback!==undefined)setMsg(feedback);}
 const set=patch=>save({s:{...s,...patch}});
 const gap=k=>demo&&(k==='source'||k==='delimiter');
 const lock=k=>demo&&!gap(k);
 const preview=W.previewTable(file.text,s);
 const specs=W.fieldSpecs(file,s);

 function pickMenu(kind){setMenu(false);
  if(kind==='text'){save({step:'source'},demo?{ok:true,text:'Otworzyło się okno „Pobieranie danych zewnętrznych — Plik tekstowy”.'}:null);return;}
  setMsg({ok:false,text:kind==='excel'?`Plik ${file.name} ma rozszerzenie .csv — to plik tekstowy (wartości oddzielone znakami), a nie skoroszyt Excela. Wybierz „Plik tekstowy”.`:'To nie ten rodzaj pliku. Plik .csv to plik tekstowy.'});
 }
 function okSource(){const r=W.checkSource(mode,s);save({items:mark(v.items,'source',r.ok),...(r.ok?{step:'format'}:{})},{ok:r.ok,title:r.ok?'Dobrze.':'Jeszcze nie.',text:r.msg});}
 function nextFormat(){const r=W.checkFormat(s);if(!r.ok){save({items:mark(v.items,'format',false)},{ok:false,text:r.msg});return;}save({step:'delimiter'},null);}
 function nextDelimiter(){
  const d=W.checkDelimiter(s);let items=mark(v.items,'format',d.ok);
  if(!d.ok){save({items},{ok:false,title:'Ogranicznik:',text:d.msg});return;}
  const h=W.checkHeader(mode,s);if(!demo)items=mark(items,'header',h.ok);
  if(!h.ok){save({items},{ok:false,text:h.msg});return;}
  save({items,step:'finish'},{ok:true,text:demo?'Średnik pasuje — każda wartość jest w swojej kolumnie.':'Podgląd wygląda dobrze: osobne kolumny, bez cudzysłowów, nagłówki jako nazwy pól.'});
 }
 function finish(){
  const f=W.checkFields(mode,s);
  if(!f.ok){save({items:demo?v.items:mark(v.items,'fields',false)},{ok:false,title:'Import przerwany.',text:f.msg});if(f.access)setBox(f.access);return;}
  let items=demo?v.items:mark(v.items,'fields',true);
  if(!demo){const d=W.checkDates(s);
   if(!d.ok){items=mark(items,'dates',false);const bad=W.runImport(mode,s);save({items,step:'dateFail',result:bad},{ok:false,title:`${bad.errors.length} błędów konwersji.`,text:d.msg});return;}
   items=mark(items,'dates',true);}
  const result=W.runImport(mode,s);
  save({items,step:'saved',result},{ok:true,title:'Import zakończony.',text:demo?'Access dołączył 2 rekordy do tabeli Lekarze.':`Access dołączył ${result.records.length} wierszy do tabeli Pacjenci. ${result.errors.length} ${result.errors.length===1?'wiersz miał błąd':'wiersze miały błędy'} — szczegóły w tabeli Pacjenci_ImportErrors.`});
  if(result.errors.length)setBox(`Nie wszystkie dane zostały zaimportowane. Błędy zostały zapisane w tabeli „Pacjenci_ImportErrors” (${result.errors.length}).`);
 }
 const wizardButtons=(stepKey)=><>
  <B onClick={()=>setAdv({...s})} disabled={demo}>Zaawansowane…</B>
  <B onClick={()=>save({step:'ribbon'},{ok:false,text:'Kreator zamknięty. Zacznij od „Nowe źródło danych”.'})} disabled={demo}>Anuluj</B>
  <B onClick={()=>save({step:stepKey==='format'?'source':stepKey==='delimiter'?'format':'delimiter'},null)}>&lt; Wstecz</B>
  <B primary onClick={stepKey==='format'?nextFormat:stepKey==='delimiter'?nextDelimiter:undefined} disabled={stepKey==='finish'}>Dalej &gt;</B>
  <B primary={stepKey==='finish'} onClick={finish} disabled={stepKey!=='finish'}>Zakończ</B>
 </>;
 const target=file.table,targetRows=(target==='Lekarze'?[]:pacjenci);
 const imported=v.result?.records||[];
 const tableCols=Object.keys(fieldTypes[target]);
 const tablesInNav=['Lekarze','Pacjenci','Wizyty',...(v.result?.errors.length?[`${target}_ImportErrors`]:[])];
 const comment=demo&&DEMO_NOTES[v.step];

 let dialog=null;
 if(v.step==='source')dialog=<Dialog dref={dref} title={`Pobieranie danych zewnętrznych — Plik tekstowy`} buttons={<><B primary onClick={okSource}>OK</B><B onClick={()=>save({step:'ribbon'},null)} disabled={demo}>Anuluj</B></>}>
  <h4 className="iw-h">Wybierz źródło i miejsce docelowe danych</h4>
  <label className="iw-file">Nazwa pliku:<span><input readOnly value={file.path}/><button type="button" className="iw-btn" disabled>Przeglądaj…</button></span></label>
  <fieldset className={`iw-options ${gap('source')?'is-gap':''}`} disabled={lock('source')}><legend>Określ, jak i gdzie mają być przechowywane dane w bieżącej bazie danych.</legend>
   {[['new','Importuj dane źródłowe do nowej tabeli w bieżącej bazie danych.','Jeśli określona tabela nie istnieje, program Access utworzy ją. Jeśli istnieje, program Access może zastąpić jej zawartość.'],['append','Dołącz kopię rekordów do tabeli:','Jeśli określona tabela istnieje, program Access doda do niej rekordy. Zmiany w pliku źródłowym nie będą widoczne w bazie danych.'],['link','Połącz ze źródłem danych, tworząc tabelę połączoną.','Program Access utworzy tabelę, która będzie zawierała łącze do danych źródłowych. Dane zostają w pliku.']].map(([k,l,d])=><div key={k} className="iw-option"><label><input type="radio" name={`${data.id}-opt`} checked={s.option===k} onChange={()=>set({option:k})}/><span>{l}</span></label>{k==='append'&&<select aria-label="Tabela, do której dołączyć rekordy" value={s.table} onChange={e=>set({table:e.target.value,option:'append'})}><option value="">(wybierz tabelę)</option>{['Lekarze','Pacjenci','Wizyty'].map(t=><option key={t}>{t}</option>)}</select>}<small>{d}</small></div>)}
  </fieldset>
 </Dialog>;
 if(v.step==='format')dialog=<Dialog dref={dref} title="Kreator importu tekstu" buttons={wizardButtons('format')}>
  <p>Kreator stwierdził, że dane są w formacie rozdzielanym. Jeśli nie jest to prawidłowe, wybierz format, który lepiej opisuje dane.</p>
  <fieldset className="iw-options" disabled={lock('format')}><legend className="sr-only">Format danych</legend>{[['delimited','Rozdzielany','Znaki, takie jak przecinek lub tabulator, rozdzielają poszczególne pola'],['fixed','Stała szerokość','Pola są wyrównane w kolumnach, a między nimi są spacje']].map(([k,l,d])=><label key={k} className="iw-option-inline"><input type="radio" name={`${data.id}-fmt`} checked={s.format===k} onChange={()=>set({format:k})}/><span><b>{l}</b> — {d}</span></label>)}</fieldset>
  <p className="iw-caption">Przykładowe dane z pliku: {file.path}</p>
  <pre className="iw-raw" tabIndex={0} aria-label="Surowa zawartość pliku">{file.text.split(/\r?\n/).filter(Boolean).map((l,i)=>`${i+1}  ${l}`).join('\n')}</pre>
 </Dialog>;
 if(v.step==='delimiter')dialog=<Dialog dref={dref} title="Kreator importu tekstu" buttons={wizardButtons('delimiter')}>
  <p>Wybierz ogranicznik rozdzielający pola. Zaznacz odpowiedni ogranicznik i zobacz, jak zmieni się tekst w poniższym podglądzie.</p>
  <fieldset className={`iw-delims ${gap('delimiter')?'is-gap':''}`}><legend>Wybierz ogranicznik rozdzielający pola:</legend>{W.delimiterLabels.map(([k,l])=><label key={k}><input type="radio" name={`${data.id}-del`} checked={s.delimiter===k} onChange={()=>set({delimiter:k})}/>{l}</label>)}{s.delimiter==='other'&&<input className="iw-other" aria-label="Inny ogranicznik" maxLength={1} value={s.other} onChange={e=>set({other:e.target.value})}/>}</fieldset>
  <div className="iw-row">
   <label className="iw-check"><input type="checkbox" checked={s.firstRow} disabled={demo} onChange={e=>set({firstRow:e.target.checked,fields:null})}/>Pierwszy wiersz zawiera nazwy pól</label>
   <label className="iw-inline">Kwalifikator tekstu:<select value={s.qualifier} disabled={demo} onChange={e=>set({qualifier:e.target.value})}><option value="none">{'{brak}'}</option><option value={'"'}>"</option><option value="'">'</option></select></label>
  </div>
  <div className="iw-preview" role="region" aria-label="Podgląd podziału na kolumny" tabIndex={0}><table><thead><tr>{preview.header.map((h,i)=><th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{preview.data.map((r,i)=><tr key={i}>{preview.header.map((_,j)=><td key={j}>{r[j]??''}</td>)}</tr>)}</tbody></table></div>
  <p className="iw-caption">Kolumn w podglądzie: <b>{preview.width}</b>{mode==='guided'&&' · w pliku jest 8 kolumn danych'}</p>
 </Dialog>;
 if(v.step==='finish')dialog=<Dialog dref={dref} title="Kreator importu tekstu" buttons={wizardButtons('finish')}>
  <label className="iw-inline iw-target">Importuj do tabeli:<input readOnly value={target}/></label>
  <label className="iw-check"><input type="checkbox" disabled/>Chcę, aby kreator przeanalizował tabelę po zaimportowaniu danych.</label>
  <p>Kreator zakończył analizę danych. Kliknij <b>Zakończ</b>, aby zaimportować dane.</p>
  <p className="iw-caption">Pole {Object.keys(fieldTypes[target])[0]} ma typ Autonumerowanie — Access sam nada kolejne numery.</p>
  {!demo&&<div className="iw-map"><p className="iw-caption">Nazwy pól, które odczyta Access (z nagłówka pliku lub z „Zaawansowane…”):</p><ul>{specs.map((f,i)=><li key={i} className={f.skip?'is-skip':Object.keys(fieldTypes[target]).includes(f.name)?'is-ok':'is-bad'}>{preview.header[i]} → <b>{f.skip?'(pomiń)':f.name}</b></li>)}</ul></div>}
 </Dialog>;
 if(v.step==='saved')dialog=<Dialog dref={dref} title="Pobieranie danych zewnętrznych — Plik tekstowy" buttons={<><B primary onClick={()=>save({step:'done'},{ok:true,title:demo?'Koniec pokazu.':'Import gotowy.',text:demo?'Teraz Twoja kolej: 13 zgłoszeń z formularza w następnym etapie.':'Zobacz poniżej tabelę Pacjenci i raport. Czy wszystko jest w porządku?'})}>{s.saveSteps?'Zapisz import':'Zamknij'}</B></>}>
  <h4 className="iw-h">Zapisz kroki importu</h4>
  <p>Zakończono importowanie pliku „{file.path}” do tabeli „{target}”.</p>
  <p>Czy chcesz zapisać te kroki importu? Pozwoli to na szybkie powtórzenie operacji bez używania kreatora.</p>
  <label className="iw-check"><input type="checkbox" checked={s.saveSteps} onChange={e=>set({saveSteps:e.target.checked})}/>Zapisz kroki importu</label>
  {s.saveSteps&&<label className="iw-inline">Zapisz jako:<input value={s.stepsName} onChange={e=>set({stepsName:e.target.value.slice(0,40)})}/></label>}
 </Dialog>;
 if(v.step==='dateFail')dialog=<Dialog dref={dref} title="Pacjenci_ImportErrors : Tabela" buttons={<B primary onClick={()=>save({step:'finish',result:null},{ok:false,text:'Zaimportowane rekordy usunięto. Otwórz „Zaawansowane…” i ustaw Kolejność dat: DMR oraz Ogranicznik daty: „.”. Potem Zakończ.'})}>Usuń zaimportowane rekordy i popraw ustawienia</B>}>
  <p>Access dołączył wiersze, ale <b>żadnej daty urodzenia</b> nie umiał odczytać — pole zostało puste. Tak wygląda tabela błędów:</p>
  <ErrorsTable errors={v.result.errors} max={180}/>
 </Dialog>;

 const done=v.step==='done';
 const score=keys.reduce((a,k)=>a+pts(v.items[k]),0);
 const problems=done&&!demo?W.dataProblems(imported):[];
 return <div className="iw-wrap">
  <Score items={v.items} mode={mode} score={score} max={max}/>
  <div className="iw-window">
   <div className="iw-titlebar"><span>Stomatolog : Baza danych — Microsoft Access</span><span className="iw-sim">symulacja</span></div>
   <Ribbon><Group label="Importuj i połącz"><div className="iw-menu-wrap"><button type="button" className={`iw-rbtn ${v.step==='ribbon'?'is-hint':''}`} aria-expanded={menu} aria-haspopup="true" onClick={()=>{setMenu(!menu);touched.current=true;}} disabled={v.step!=='ribbon'}><Icon name="table" size={22}/>Nowe źródło danych ▾</button>
    {menu&&<div className="iw-menu" role="menu"><p className="iw-menu-head">Z pliku</p>{[['excel','Excel'],['html','Dokument HTML'],['xml','Plik XML'],['text','Plik tekstowy']].map(([k,l])=><button key={k} type="button" role="menuitem" className={demo&&k==='text'?'is-hint':''} onClick={()=>pickMenu(k)}>{l}</button>)}<p className="iw-menu-head is-dim">Z bazy danych ▸</p><p className="iw-menu-head is-dim">Z innych źródeł ▸</p></div>}</div>
    <span className="iw-rbtn is-dim"><Icon name="download" size={20}/>Zapisane importy</span><span className="iw-rbtn is-dim"><Icon name="external" size={20}/>Menedżer tabel połączonych</span></Group>
    <Group label="Eksportuj"><span className="iw-rbtn is-dim"><Icon name="table" size={20}/>Excel</span><span className="iw-rbtn is-dim"><Icon name="file" size={20}/>Plik tekstowy</span></Group>
   </Ribbon>
   <div className="iw-body">
    <NavPane tables={tablesInNav}/>
    <div className="iw-main">
     {box&&<MessageBox text={box} onOk={()=>setBox(null)}/>}
     {adv&&<Advanced file={file} s={s} onCancel={()=>setAdv(null)} onChange={p=>set(p)} onOk={()=>{setAdv(null);setMsg({ok:true,text:'Specyfikacja zapisana. Sprawdź listę pól w ostatnim kroku kreatora.'});}} revert={()=>{set(adv);setAdv(null);}}/>}
     {!adv&&dialog}
     {!dialog&&!adv&&<Datasheet caption={`${target} : Tabela`} columns={tableCols} rows={[...(target==='Lekarze'?lekarze.filter(()=>done):targetRows),...(done&&!demo?imported:[])].map(r=>r)} highlightFrom={done&&!demo?targetRows.length:null} max={done?320:220}/>}
    </div>
   </div>
   <p className="iw-statusbar">{v.step==='ribbon'?'Gotowy':'Kreator importu'} · {target}: {done?(demo?2:targetRows.length+imported.length):targetRows.length} rekordów</p>
  </div>
  {comment&&<aside className="iw-comment" aria-label="Komentarz do kroku"><strong>{comment[0]}</strong><p>{comment[1]}</p></aside>}
  <Feedback msg={msg}/>
  {done&&!demo&&<div className="iw-report"><h4>Raport z importu</h4><p>Zaimportowano <b>{imported.length}</b> wierszy (Pacjenci: 20 → {20+imported.length}). Błędy importu: <b>{v.result.errors.length}</b> — tabela <b>Pacjenci_ImportErrors</b>:</p><ErrorsTable errors={v.result.errors}/>
   <p><b>Ale to nie wszystko.</b> Kontroler danych (człowiek!) znalazł jeszcze {problems.length} problemy, których import <b>nie sprawdza</b> — Access przyjmie każdy tekst, nawet bez sensu:</p><ul className="iw-problems">{problems.map((p,i)=><li key={i}><Icon name="warning" size={18}/>{p.msg}</li>)}</ul><p className="small muted">Poprawisz to w następnym etapie.</p></div>}
 </div>;
}
function ErrorsTable({errors,max=240}){return <div className="iw-sheet-scroll" role="region" aria-label="Tabela Pacjenci_ImportErrors" tabIndex={0} style={{maxHeight:max}}><table className="iw-errors"><thead><tr><th scope="col">Błąd</th><th scope="col">Pole</th><th scope="col">Wiersz</th></tr></thead><tbody>{errors.length?errors.map((e,i)=><tr key={i}><td>{e.blad}</td><td>{e.pole}</td><td>{e.wiersz}</td></tr>):<tr><td colSpan={3}>(brak błędów)</td></tr>}</tbody></table></div>;}

function Advanced({file,s,onChange,onOk,revert}){
 const specs=W.fieldSpecs(file,s),header=W.previewTable(file.text,s).header,targetFields=Object.keys(fieldTypes[file.table]).slice(1);
 const setField=(i,patch)=>{const f=specs.map(x=>({...x}));f[i]={...f[i],...patch};onChange({fields:f});};
 return <div className="iw-dialog iw-adv" role="group" aria-label="Specyfikacja importu"><div className="iw-dialog-title"><span>Specyfikacja importu: {file.name.replace('.csv','')}</span></div><div className="iw-dialog-body">
  <div className="iw-adv-grid">
   <fieldset><legend>Format pliku</legend><p className="iw-caption">{s.format==='delimited'?'Rozdzielany':'Stała szerokość'} · ogranicznik: {W.delimiterLabels.find(([k])=>k===s.delimiter)?.[1]} · kwalifikator: {s.qualifier==='none'?'{brak}':s.qualifier}</p><p className="iw-caption">Język: Polski · Strona kodowa: Unicode (UTF-8)</p></fieldset>
   <fieldset><legend>Daty, godziny i liczby</legend>
    <label className="iw-inline">Kolejność dat:<select value={s.dateOrder} onChange={e=>onChange({dateOrder:e.target.value})}>{W.dateOrders.map(o=><option key={o}>{o}</option>)}</select></label>
    <label className="iw-inline">Ogranicznik daty:<input className="iw-other" maxLength={1} value={s.dateDelim} onChange={e=>onChange({dateDelim:e.target.value})}/></label>
    <label className="iw-inline">Separator godziny:<input className="iw-other" readOnly value=":"/></label>
    <label className="iw-check"><input type="checkbox" checked={s.fourDigitYears} onChange={e=>onChange({fourDigitYears:e.target.checked})}/>Czterocyfrowe lata</label>
    <label className="iw-check"><input type="checkbox" checked={s.leadingZeros} onChange={e=>onChange({leadingZeros:e.target.checked})}/>Wiodące zera w datach</label>
   </fieldset>
  </div>
  <p className="iw-h">Informacje o polach:</p>
  <div className="iw-sheet-scroll" role="region" aria-label="Informacje o polach" tabIndex={0}><table className="iw-fields"><thead><tr><th scope="col">Kolumna w pliku</th><th scope="col">Nazwa pola</th><th scope="col">Typ danych</th><th scope="col">Indeksowane</th><th scope="col">Pomiń</th></tr></thead><tbody>{specs.map((f,i)=><tr key={i}><td>{header[i]}</td><td><select aria-label={`Nazwa pola dla kolumny ${header[i]}`} value={f.name} disabled={f.skip} onChange={e=>setField(i,{name:e.target.value})}>{[...new Set([header[i],...targetFields])].map(n=><option key={n}>{n}</option>)}</select></td><td>{typeLabels[fieldTypes[file.table][f.name]]||'Krótki tekst'}</td><td>Nie</td><td><input type="checkbox" aria-label={`Pomiń kolumnę ${header[i]}`} checked={f.skip} onChange={e=>setField(i,{skip:e.target.checked})}/></td></tr>)}</tbody></table></div>
  <p className="iw-caption">W prawdziwym Accessie nazwę pola wpisujesz z klawiatury — tu wybierasz ją z listy, żeby uniknąć literówek.</p>
 </div><div className="iw-dialog-buttons"><button type="button" className="iw-btn is-default" onClick={onOk}>OK</button><button type="button" className="iw-btn" onClick={revert}>Anuluj</button></div></div>;
}

const DEMO_NOTES={
 ribbon:['Krok 1. Skąd dane?','Karta „Dane zewnętrzne” → „Nowe źródło danych” → „Z pliku” → „Plik tekstowy”. Plik .csv to zwykły tekst: wartości oddzielone znakiem. Kliknij podświetlony przycisk.'],
 source:['Krok 2 — LUKA: Twoja decyzja','Tabela Lekarze już istnieje: ma pola, typy i relację z Wizytami, ale jest pusta. Co zrobić z danymi z pliku? Wybierz opcję i kliknij OK.'],
 format:['Krok 3. Format','Kreator sam rozpoznał format „Rozdzielany”: między wartościami stoją średniki. „Stała szerokość” jest dla plików, w których kolumny wyrównano spacjami (np. wydruki ze starych systemów). Kliknij „Dalej”.'],
 delimiter:['Krok 4 — LUKA: ogranicznik','Wybierz znak, który rozdziela pola — dobry ogranicznik daje równe kolumny w podglądzie. Podpowiedź: polski Excel zapisuje CSV ze średnikiem, bo przecinek jest u nas w liczbach (350,50 zł). „Pierwszy wiersz zawiera nazwy pól” jest zaznaczone, bo w wierszu 1 są nazwy: imie, nazwisko, specjalizacja — takie same jak w tabeli.'],
 finish:['Krok 5. Gdzie trafią dane?','Importuj do tabeli: Lekarze. Pole id_lekarza ma typ Autonumerowanie — Access sam nada numery 1 i 2. Kliknij „Zakończ”.'],
 saved:['Krok 6. Zapisz kroki importu','Zaznacz, gdy ten sam plik będzie wracał co tydzień (np. zapisy z formularza). Potem import to jedno kliknięcie w „Zapisane importy”.'],
 done:['Gotowe','2 rekordy w tabeli Lekarze, 0 błędów, 30 sekund. Ręcznie: 6 pól do przepisania i ryzyko literówki w nazwisku.']
};

// ---------- Etap poprawy ----------
function Fix({data,value,onChange,answers}){
 const v={deleted:[],edits:{},runs:0,...value};
 const [msg,setMsg]=useState(null);
 const guided=answers?.[data.source||'import-guided'];
 const base=W.evaluateFix({deleted:[],edits:{}});
 const report=W.importRows(W.zapisyRows,W.correctSettings.fields,W.correctSettings,'Pacjenci',21);
 const problems=W.dataProblems(report.records);
 const rows=W.zapisyRows.map((r,i)=>({n:i+1,orig:r}));
 const last=v.last;
 function save(patch){onChange({...v,...patch});}
 function edit(n,c,val){save({edits:{...v.edits,[`${n}:${c}`]:val}});}
 function toggle(n){const d=v.deleted.includes(n)?v.deleted.filter(x=>x!==n):[...v.deleted,n];save({deleted:d});}
 function run(){const r=W.evaluateFix(v);
  const lastR={score:r.score,resolved:r.resolved,errors:r.errors,problems:r.problems.map(p=>p.msg),collateral:r.collateral,count:r.count,records:r.records};
  onChange({...v,runs:v.runs+1,last:lastR,done:r.done,score:r.score,max:5,summary:r.done?`Zaimportowano ${r.count} pacjentów, 0 błędów`:`Poprawiono ${r.score}/5 typów problemów`});
  setMsg(r.done?{ok:true,title:'Czysto!',text:`Zaimportowano ${r.count} pacjentów, 0 błędów importu, kontroler nie ma uwag. Tabela Pacjenci: 20 → ${20+r.count}.`}:{ok:false,title:`Import: ${r.count} wierszy, błędy: ${r.errors.length}.`,text:[...r.collateral,...r.errors.map(e=>`Pacjenci_ImportErrors: ${e.blad} w polu ${e.pole}, wiersz ${e.wiersz}. Sprawdź zapis daty: DD.MM.RRRR.`),...r.problems.map(p=>p.msg)].slice(0,3).join(' ')||'Sprawdź listę problemów.'});}
 const resolved=last?.resolved||{};
 const labels=base.labels;
 return <div className="iw-wrap">
  <div className="iw-score" aria-label="Postęp i punkty"><div className="iw-points"><Icon name="trophy" size={22}/><strong>{last?last.score:0}</strong><span>/ 5 pkt</span></div><ul>{Object.entries(labels).map(([k,l])=><li key={k} className={resolved[k]?'is-ok':''}><span aria-hidden="true">{resolved[k]?'✓':'○'}</span>{l}<span className="sr-only">{resolved[k]?' — gotowe':' — do zrobienia'}</span></li>)}</ul><p className="small">Cel: <b>11</b> nowych pacjentów, <b>0</b> błędów (20 → 31).</p></div>
  <div className="iw-fix-grid">
   <section className="iw-report" aria-labelledby={`${data.id}-rep`}><h4 id={`${data.id}-rep`}>{guided?.done?'Twój import z poprzedniego etapu':'Raport z wczorajszego importu'}</h4>
    <p>Zaimportowano {report.records.length} wierszy, błędy: {report.errors.length}. Rekordy z tego importu usunięto — tabela Pacjenci ma znów 20 rekordów.</p>
    <ErrorsTable errors={report.errors} max={120}/>
    <p className="iw-caption"><b>Kontroler danych</b> (tego import nie sprawdza):</p>
    <ul className="iw-problems">{problems.map((p,i)=><li key={i}><Icon name="warning" size={18}/>{p.msg}</li>)}</ul>
   </section>
   <aside className="iw-note" aria-labelledby={`${data.id}-note`}><h4 id={`${data.id}-note`}>Notatka z recepcji</h4><ul>{W.receptionNote.map(n=><li key={n.row}><b>Wiersz {n.row}:</b> {n.text}</li>)}</ul></aside>
  </div>
  <div className="iw-window">
   <div className="iw-titlebar"><span>zapisy_formularz.csv — edycja pliku źródłowego</span><span className="iw-sim">symulacja</span></div>
   <div className="iw-sheet-scroll iw-edit" role="region" aria-label="Edycja pliku zapisy_formularz.csv" tabIndex={0}><table><thead><tr><th scope="col">Wiersz</th>{W.zapisyHeader.slice(0,7).map(h=><th key={h} scope="col">{h}</th>)}<th scope="col">Działanie</th></tr></thead>
    <tbody>{rows.map(({n,orig})=>{const del=v.deleted.includes(n);return <tr key={n} className={del?'is-deleted':''}><th scope="row">{n}</th>{orig.slice(0,7).map((o,c)=>{const val=v.edits[`${n}:${c}`]??o;return <td key={c}><input aria-label={`Wiersz ${n}, ${W.zapisyHeader[c]}`} value={val} disabled={del} className={val!==o?'is-changed':''} onChange={e=>edit(n,c,e.target.value.slice(0,60))}/></td>;})}<td><button type="button" className="iw-btn" onClick={()=>toggle(n)}>{del?'Przywróć wiersz':'Usuń wiersz'}</button></td></tr>;})}</tbody></table></div>
   <div className="iw-actions"><button type="button" className="btn" onClick={run}><Icon name="download" size={20}/>Zapisane importy → Import-zapisy_formularz</button><button type="button" className="text-button" onClick={()=>{onChange({deleted:[],edits:{},runs:v.runs,last:v.last,done:v.done,score:v.score,max:5,summary:v.summary});setMsg({ok:true,text:'Przywrócono oryginalny plik.'});}}>Przywróć oryginalny plik</button></div>
  </div>
  <Feedback msg={msg}/>
  {last&&<div className="iw-report"><h4>Wynik importu nr {v.runs}</h4><p>Tabela Pacjenci: 20 → <b>{20+last.count}</b> rekordów · błędy importu: <b>{last.errors.length}</b> · uwagi kontrolera: <b>{last.problems.length}</b></p>
   {last.collateral.length>0&&<ul className="iw-problems">{last.collateral.map((c,i)=><li key={i}><Icon name="warning" size={18}/>{c}</li>)}</ul>}
   {last.problems.length>0&&<ul className="iw-problems">{last.problems.map((c,i)=><li key={i}><Icon name="warning" size={18}/>{c}</li>)}</ul>}
   <Datasheet caption="Pacjenci : Tabela — nowe rekordy" columns={Object.keys(fieldTypes.Pacjenci)} rows={last.records} max={260}/>
   <p className="iw-caption">Numery zaczynają się od 34: Autonumerowanie nie cofa się po usunięciu rekordów z pierwszego importu (21–33). To normalne — numer ma być unikalny, a nie „bez dziur”.</p></div>}
 </div>;
}

export default function ImportWizard(props){
 return <section className="iw" aria-label="Symulator importu danych w programie Access">{props.data.mode==='fix'?<Fix {...props}/>:<Wizard {...props}/>}</section>;
}
