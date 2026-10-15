import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {orderOptions,optionKey} from './optionOrder.js';
import './netLab.css';
import {MAX,home,natSteps,natQuiz,classifyItems,classifyOptions,checkClassify,answerQuiz,kindLabel,
 nodes,edges,round1,round2,resend,arrivalOrder,routeText,packetQuizzes,missingQuiz,
 sample,sampleOutputs,answerLines,checkField,passport,CONCLUSION_MIN,minPingMs,netResult} from '../../content/sims/netLab.js';

const pts=n=>String(n).replace('.',',');
const titles={address:'Adresy w Twojej sieci',packets:'Pakiety w drodze',cmd:'Wiersz poleceń — odczyty',passport:'Paszport połączenia'};

function Msg({ok,children}){if(!children)return null;return <div className={`nlab-msg ${ok?'is-ok':'is-retry'}`} role="status"><Icon name={ok?'check':'warning'} size={20}/><div>{children}</div></div>;}

function Quiz({q,state={},onAnswer,name}){
 const order=orderOptions(optionKey('netLab',q.id,q.options),q.options);
 return <fieldset className="nlab-quiz"><legend>{q.question}</legend>
  <div className="nlab-options">{order.map(([i,o],pos)=><button type="button" key={o} data-option={i} className={`choice ${state.picked===i?'selected':''}`} aria-pressed={state.picked===i} disabled={state.solved&&state.picked!==i} onClick={()=>onAnswer(i)}><span className="choice-letter">{name?o:String.fromCharCode(65+pos)}</span>{!name&&<span>{o}</span>}</button>)}</div>
  {state.tries>0&&<Msg ok={state.solved}>{state.solved?<><b>{state.tries===1?'Dobrze — pełny punkt.':'Dobrze — za poprawkę połowa punktu.'}</b> {q.explain}</>:<>Jeszcze nie. {q.hint}</>}</Msg>}
 </fieldset>;
}

// ---------- address ----------
function Address({st,set}){
 const [step,setStep]=useState(-1);const s=natSteps[step];const here=s?.at;
 const cls=st.classify||{};const picks=cls.picks||{};
 const pick=(i,k)=>set({...st,classify:{...cls,picks:{...picks,[i]:k},msg:null,wrong:(cls.wrong||[]).filter(x=>x!==i)}});
 return <div className="nlab-panel">
  <div className="nlab-home" aria-label="Schemat: sieć domowa, router i internet">
   <section className={`nlab-lan ${here==='console'?'is-here':''}`}><h4><Icon name="house" size={18}/>Twój dom — sieć lokalna (LAN)</h4>
    <ul>{home.devices.map(d=><li key={d.id} className={here==='console'&&d.id==='console'?'is-here':''}><Icon name={d.icon} size={20}/><span>{d.name}</span><code>{d.ip}</code></li>)}</ul>
    <p className="small">Adresy prywatne: działają tylko w domu.</p></section>
   <section className={`nlab-router ${here==='router'?'is-here':''}`}><h4><Icon name="wifi" size={18}/>Router = brama</h4>
    <dl><div><dt>od strony domu</dt><dd><code>{home.routerLan}</code></dd></div><div><dt>od strony internetu</dt><dd><code>{home.routerWan}</code><small>publiczny, od operatora</small></dd></div></dl></section>
   <section className={`nlab-wan ${here==='server'?'is-here':''}`}><h4><Icon name="globe" size={18}/>Internet (WAN)</h4>
    <p><b>{home.server.name}</b><code>{home.server.ip}</code></p><p className="small">Sieć rozległa: łączy miasta i kraje.</p></section>
  </div>
  <div className="nlab-worked">
   <div className="nlab-worked-head"><b>Przykład rozwiązany: konsola pyta serwer gry</b><span className="small muted">Krok {Math.max(0,step+1)}/{natSteps.length}</span></div>
   {s?<div className="nlab-packet" role="status"><div className="nlab-header"><span>Od: <code>{s.from}</code></span><span>Do: <code>{s.to}</code></span></div><p>{s.text}</p></div>:<p className="small muted">Kliknij, żeby zobaczyć, co dzieje się z adresami w pakiecie po drodze.</p>}
   <div className="inline-actions"><button type="button" className="btn secondary" onClick={()=>setStep(step+1>=natSteps.length?0:step+1)}>{step<0?'Pokaż pierwszy krok':step+1>=natSteps.length?'Od początku':'Następny krok'}<Icon name="right" size={18}/></button></div>
  </div>
  <Quiz q={natQuiz} state={st.nat} onAnswer={i=>set({...st,nat:answerQuiz(natQuiz,st.nat,i)})}/>
  <fieldset className="nlab-classify"><legend>Prywatny, publiczny czy błędny? Oceń 6 adresów IPv4.</legend>
   <p className="small muted">Pule prywatne: <code>10.x.x.x</code>, <code>172.16.x.x–172.31.x.x</code>, <code>192.168.x.x</code>. Każda z 4 liczb: od 0 do 255.</p>
   <ul>{classifyItems.map((it,i)=>{const bad=(cls.wrong||[]).includes(i);const good=cls.solved;return <li key={it.ip} className={bad?'is-bad':good?'is-ok':''}>
    <code>{it.ip}</code><div role="group" aria-label={`Adres ${it.ip}`}>{classifyOptions.map(([k,l])=><button type="button" key={k} aria-pressed={picks[i]===k} disabled={cls.solved} onClick={()=>pick(i,k)}>{l}</button>)}</div>
    {(bad||good)&&<small>{bad?'Do poprawy. ':''}{it.why}</small>}</li>;})}</ul>
   <div className="inline-actions"><button type="button" className="btn" disabled={cls.solved} onClick={()=>set({...st,classify:checkClassify(cls)})}>Sprawdź adresy<Icon name="check" size={18}/></button></div>
   {cls.msg&&<Msg ok={cls.msg.ok}>{cls.msg.text}</Msg>}
  </fieldset>
 </div>;
}

// ---------- packets ----------
function NetMap({round,highlight,down}){
 const pos=Object.fromEntries(nodes.map(n=>[n.id,n]));
 const routeEdges=new Set();if(highlight)for(let i=1;i<highlight.length;i++)routeEdges.add([highlight[i-1],highlight[i]].sort().join('|'));
 return <svg className="nlab-map" viewBox="0 0 670 220" role="img" aria-label={`Mapa sieci: ${nodes.map(n=>n.label).join(', ')}${down?`. Węzeł ${down} nie działa.`:''}${highlight?` Zaznaczona trasa: ${routeText(highlight)}.`:''}`}>
  {edges.map(([a,b])=>{const on=routeEdges.has([a,b].sort().join('|'));const off=down&&(a==='lodz'||b==='lodz');return <line key={a+b} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} className={`${on?'is-on':''} ${off?'is-down':''}`}/>;})}
  {nodes.map(n=>{const off=down&&n.id==='lodz';return <g key={n.id} className={`nlab-node ${off?'is-down':''} ${highlight?.includes(n.id)?'is-on':''}`} transform={`translate(${n.x} ${n.y})`}>
   <circle r="20"/>{off&&<path d="M-11 -11 L11 11 M11 -11 L-11 11" className="nlab-x"/>}
   <text y="36" textAnchor="middle" className="nlab-label">{n.label}</text><text y="50" textAnchor="middle" className="nlab-sub">{off?'AWARIA':n.sub}</text></g>;})}
 </svg>;
}
function Photo({have,label}){
 return <figure className="nlab-photo"><div className="nlab-tiles">{[1,2,3,4,5,6].map(n=><span key={n} className={`nlab-tile t${n} ${have.includes(n)?'':'is-missing'}`}><b>{n}</b>{!have.includes(n)&&<small>brak</small>}</span>)}</div><figcaption>{label}</figcaption></figure>;
}
function RoundTable({round,extra,sel,setSel,caption}){
 const order=arrivalOrder(round);const rowsData=[...round,...(extra?[{...extra,again:true}]:[])];
 return <div className="nlab-table-wrap"><table className="nlab-table"><caption>{caption}</caption><thead><tr><th scope="col">Pakiet</th><th scope="col">Trasa</th><th scope="col">Czas</th><th scope="col">Status</th></tr></thead>
  <tbody>{rowsData.map(p=>{const key=p.n+(p.again?'r':'');return <tr key={key} className={`${p.lost?'is-lost':''} ${sel===key?'is-sel':''}`}>
   <th scope="row"><button type="button" className="nlab-pk" aria-pressed={sel===key} onClick={()=>setSel(sel===key?null:key)} aria-label={`Pokaż trasę pakietu ${p.n}${p.again?' (wysłany ponownie)':''}`}>{p.n}{p.again?' ↻':''}</button></th>
   <td>{routeText(p.route)}</td><td>{p.lost?'—':`${p.ms} ms`}</td>
   <td>{p.lost?<span className="nlab-lost"><Icon name="close" size={16}/>zgubiony</span>:p.again?<span className="nlab-okk"><Icon name="check" size={16}/>wysłany ponownie, dotarł</span>:<span className="nlab-okk"><Icon name="check" size={16}/>dotarł jako {order.indexOf(p.n)+1}.</span>}</td></tr>;})}</tbody></table>
  {round.some(p=>p.lost)&&<p className="small nlab-why"><Icon name="warning" size={16}/>{round.find(p=>p.lost).lost}</p>}</div>;
}
function Packets({st,set}){
 const [sel,setSel]=useState(null);const [sel2,setSel2]=useState(null);
 const sent=!!st.sent,resent=!!st.missing?.solved,failSent=!!st.failSent;
 const have1=resent?[1,2,3,4,5,6]:sent?arrivalOrder(round1):[];
 const q=(k,i)=>set({...st,[k]:answerQuiz(k==='missing'?missingQuiz:packetQuizzes[k],st[k],i)});
 const routeFor=(round,key,extra)=>{if(!key)return null;const again=key.endsWith('r');const n=parseInt(key,10);return (again?extra:round.find(p=>p.n===n))?.route;};
 return <div className="nlab-panel">
  <div className="nlab-send">
   <Photo have={[1,2,3,4,5,6]} label="Na Twoim telefonie: zdjęcie podzielone na 6 pakietów"/>
   <div><p>Wysyłasz koledze w Gdańsku zdjęcie z wycieczki. Telefon dzieli je na <b>pakiety</b> — małe porcje z numerem, adresem nadawcy i odbiorcy. W rzeczywistości pakietów byłyby tysiące, tu jest 6, żeby było widać.</p>
    {!sent&&<button type="button" className="btn" onClick={()=>set({...st,sent:true})}>Wyślij zdjęcie<Icon name="right" size={18}/></button>}</div>
  </div>
  {sent&&<>
   <NetMap round={round1} highlight={routeFor(round1,sel,resend)}/>
   <RoundTable round={round1} extra={resent?resend:null} sel={sel} setSel={setSel} caption="Wysyłka 1. Kliknij numer pakietu, żeby zobaczyć jego trasę na mapie."/>
   <Photo have={have1} label={resent?'U kolegi: zdjęcie złożone w całość':`U kolegi: dotarły pakiety w kolejności ${arrivalOrder(round1).join(', ')}`}/>
   <Quiz q={packetQuizzes.order} state={st.order} onAnswer={i=>q('order',i)}/>
   <Quiz q={missingQuiz} state={st.missing} onAnswer={i=>q('missing',i)} name/>
  </>}
  {resent&&<section className="nlab-fail"><h4><Icon name="warning" size={20}/>Awaria: ktoś przeciął kabel w Łodzi</h4>
   <p>Węzeł w Łodzi nie działa. Wysyłasz drugie zdjęcie. Czy dojdzie?</p>
   {!failSent&&<button type="button" className="btn" onClick={()=>set({...st,failSent:true})}>Wyślij drugie zdjęcie<Icon name="right" size={18}/></button>}
   {failSent&&<><NetMap round={round2} down="Łódź" highlight={routeFor(round2,sel2)}/>
    <RoundTable round={round2} sel={sel2} setSel={setSel2} caption="Wysyłka 2 (awaria w Łodzi). Kliknij numer pakietu, żeby zobaczyć trasę."/>
    <Quiz q={packetQuizzes.reroute} state={st.reroute} onAnswer={i=>q('reroute',i)}/></>}
  </section>}
  {st.reroute?.solved&&<section className="nlab-game"><h4><Icon name="play" size={20}/>A w grze?</h4><p>Zdjęcie musi dojść w całości. W grze co kilkadziesiąt milisekund leci nowa pozycja Twojej postaci.</p><Quiz q={packetQuizzes.game} state={st.game} onAnswer={i=>q('game',i)}/></section>}
 </div>;
}

// ---------- cmd ----------
function Console({text,hl=[],label}){
 return <pre className="nlab-console" tabIndex={0} aria-label={label}>{text.split('\n').map((l,i)=><span key={i} className={hl.some(h=>h&&l.includes(h))?'is-hl':undefined}>{l}{'\n'}</span>)}</pre>;
}
function Field({id,label,value,onChange,hint,mono=true,inputMode}){
 return <label className="nlab-field" htmlFor={id}><span>{label}</span><input id={id} className={mono?'nlab-mono':''} value={value||''} onChange={e=>onChange(e.target.value)} autoComplete="off" spellCheck={false} inputMode={inputMode} placeholder={hint}/></label>;
}
function SourceToggle({st,set,step,label}){
 const src=st.src?.[step]||st.mode||'live';
 return <label className="nlab-src"><input type="checkbox" checked={src==='sample'} onChange={e=>set({...st,src:{...st.src,[step]:e.target.checked?'sample':'live'}})}/><span>{label}</span></label>;
}
function Cmd({st,set}){
 const inp=st.inputs||{};const c=st.checks||{};
 const setIn=(k,v)=>set({...st,inputs:{...inp,[k]:v}});
 const check=f=>set(checkField(st,f));
 const res=(f)=>c[f]&&<Msg ok={c[f].ok}>{c[f].text}{c[f].ok&&c[f].pts!==undefined?` (${pts(c[f].pts)} pkt)`:''}</Msg>;
 const isSample=step=>(st.src?.[step]||st.mode||'live')==='sample';
 const mode=st.mode||'live';
 return <div className="nlab-panel">
  <div className="nlab-modes" role="group" aria-label="Sposób pracy">
   <button type="button" aria-pressed={mode==='live'} onClick={()=>set({...st,mode:'live',src:{}})}><Icon name="desktop" size={22}/><span><b>Mierzę na tym komputerze</b><small>Wiersz poleceń działa. Platforma sprawdza, czy odczyt ma sensowny format.</small></span></button>
   <button type="button" aria-pressed={mode==='sample'} onClick={()=>set({...st,mode:'sample',src:{}})}><Icon name="file" size={22}/><span><b>CMD zablokowane — czytam przykład</b><small>Tryb zastępczy: przechwycone wyniki z innego komputera (symulacja).</small></span></button>
  </div>
  <ol className="nlab-steps">
   <li><h4>Otwórz wiersz poleceń</h4>
    {mode==='live'?<p>Naciśnij klawisz <kbd>Windows</kbd>, wpisz <kbd>cmd</kbd> i naciśnij <kbd>Enter</kbd>. Otworzy się czarne okno z tekstem <code>C:\Users\…&gt;</code>. Ustaw je obok przeglądarki. <span className="muted">Nie działa? Spróbuj <kbd>Windows</kbd> + <kbd>R</kbd>, wpisz <kbd>cmd</kbd>, <kbd>OK</kbd>. Dalej nic — włącz tryb przykładowy powyżej.</span></p>
     :<p>W trybie zastępczym czytasz wyniki, które ktoś zapisał na komputerze w innej pracowni. Zasada jest ta sama: szukasz właściwej linii.</p>}</li>
   <li><h4>Twój adres i brama: <code>ipconfig</code></h4>
    <p>{mode==='live'&&!isSample('ipv4')?<>Wpisz <kbd>ipconfig</kbd> i <kbd>Enter</kbd>. Znajdź kartę, która jest połączona (Ethernet albo Wi-Fi — nie ta z napisem „Nośnik odłączony”). Przepisz dwie linie.</>:<>Znajdź w wyniku kartę, która jest połączona, i przepisz dwie linie.</>}</p>
    {mode==='live'&&<SourceToggle st={st} set={set} step="ipv4" label="ipconfig nie działa — w tym kroku czytam przykład"/>}
    {isSample('ipv4')&&<Console text={sampleOutputs.ipconfig} label="Przykładowy wynik polecenia ipconfig" hl={[c.ipv4?.ok&&c.ipv4.src==='sample'&&answerLines.ipv4,c.gateway?.ok&&c.gateway.src==='sample'&&answerLines.gateway]}/>}
    <div className="nlab-row"><Field id="nl-ipv4" label="Adres IPv4" value={inp.ipv4} onChange={v=>setIn('ipv4',v)} hint="np. 192.168.0.15"/><button type="button" className="btn secondary" onClick={()=>check('ipv4')}>Sprawdź</button></div>
    {res('ipv4')}
    <div className="nlab-row"><Field id="nl-gw" label="Brama domyślna" value={inp.gateway} onChange={v=>setIn('gateway',v)} hint="np. 192.168.0.1"/><button type="button" className="btn secondary" onClick={()=>check('gateway')}>Sprawdź</button></div>
    {res('gateway')}</li>
   <li><h4>Opóźnienie: <code>ping</code></h4>
    <div className="nlab-row"><Field id="nl-pred" label="Najpierw zgadnij: ile ms (milisekund)?" value={inp.prediction} onChange={v=>setIn('prediction',v)} hint="np. 50" mono={false} inputMode="numeric"/><p className="small muted nlab-predhint">Bez punktów. Porównasz w paszporcie.</p></div>
    <p>{mode==='live'&&!isSample('ping')?<>Wpisz <kbd>ping</kbd>, spację i adres strony, którą znasz (np. strony szkoły albo gry), np. <code>ping nazwa-strony.pl</code>. Poczekaj na 4 odpowiedzi. Na dole, w statystyce, znajdź <b>„Czas średni”</b>.</>:<>W statystyce na dole znajdź <b>„Czas średni”</b>.</>}</p>
    {mode==='live'&&<SourceToggle st={st} set={set} step="ping" label="Widzę „Upłynął limit czasu żądania” — w tym kroku czytam przykład"/>}
    {isSample('ping')&&<Console text={sampleOutputs.ping} label="Przykładowy wynik polecenia ping" hl={[c.ping?.ok&&c.ping.src==='sample'&&answerLines.ping]}/>}
    <div className="nlab-row">{!isSample('ping')&&<Field id="nl-target" label="Do czego robiłeś ping?" value={inp.pingTarget} onChange={v=>setIn('pingTarget',v)} hint="np. nazwa-strony.pl"/>}<Field id="nl-ping" label="Czas średni (ms)" value={inp.ping} onChange={v=>setIn('ping',v)} hint="np. 25" inputMode="numeric"/><button type="button" className="btn secondary" onClick={()=>check('ping')}>Sprawdź</button></div>
    {res('ping')}</li>
   <li><h4>Trasa: <code>tracert</code></h4>
    <p>{mode==='live'&&!isSample('hops')?<>Wpisz <kbd>tracert</kbd> i ten sam adres co przy ping, np. <code>tracert nazwa-strony.pl</code>. Trwa to do minuty. Każdy wiersz z numerem to jeden <b>przeskok</b> — router po drodze. Gwiazdki <code>*</code> to router, który nie odpowiedział — też się liczy.</>:<>Każdy wiersz z numerem to jeden <b>przeskok</b> — router po drodze. Gwiazdki <code>*</code> to router, który nie odpowiedział — też się liczy.</>}</p>
    {mode==='live'&&<SourceToggle st={st} set={set} step="hops" label="Tracert zatrzymuje się na zaporze (same gwiazdki) — w tym kroku czytam przykład"/>}
    {isSample('hops')&&<Console text={sampleOutputs.tracert} label="Przykładowy wynik polecenia tracert" hl={[c.hops?.ok&&c.hops.src==='sample'&&answerLines.hops]}/>}
    <div className="nlab-row"><Field id="nl-hops" label="Liczba przeskoków (numer ostatniego wiersza)" value={inp.hops} onChange={v=>setIn('hops',v)} hint="np. 9" inputMode="numeric"/><button type="button" className="btn secondary" onClick={()=>check('hops')}>Sprawdź</button></div>
    {res('hops')}</li>
  </ol>
 </div>;
}

// ---------- passport ----------
function Passport({value,st,set}){
 const p=passport(value.cmd);const ready=netResult(value).cmd.done;
 const fmtMs=v=>v===0.5?'<1':v;
 const bars=[{l:'Brama (router pracowni) — przykład',v:1,n:'<1 ms'},...(p.ping!==null?[{l:`Twój ping: ${p.pingTarget}${p.sample.ping?' (przykład)':''}`,v:p.ping,n:`${fmtMs(p.ping)} ms`,me:true}]:[]),{l:`Serwer w USA: ${sample.far.target} (przykład)`,v:sample.far.avg,n:`${sample.far.avg} ms`}];
 const maxV=Math.max(...bars.map(b=>b.v),120);
 if(!ready)return <div className="nlab-panel"><Msg ok={false}>Najpierw zapisz cztery odczyty w etapie „Pomiar” (IPv4, brama, ping, tracert). Paszport wypełni się sam.</Msg></div>;
 const txt=String(st.conclusion||'');
 return <div className="nlab-panel">
  <article className="nlab-passport" aria-label="Paszport połączenia">
   <header><Icon name="idcard" size={30}/><div><small>Paszport połączenia · komputer w pracowni</small><h4>Moje połączenie z internetem</h4></div></header>
   <dl>
    <div><dt>Adres IPv4</dt><dd><code>{p.ipv4}</code><small>{kindLabel[p.ipKind]}{p.sample.ipv4?' · przykład':''}</small></dd></div>
    <div><dt>Brama (router)</dt><dd><code>{p.gateway}</code><small>tędy wychodzi wszystko poza sieć lokalną</small></dd></div>
    <div><dt>Ping</dt><dd>{fmtMs(p.ping)} ms<small>{p.pingTarget}{p.prediction!==null?` · przewidywałem: ${p.prediction} ms`:''}</small></dd></div>
    <div><dt>Tracert</dt><dd>{p.hops} przeskoków<small>{p.sample.hops?'przykład':'pomiar własny'}</small></dd></div>
   </dl>
   <div className="nlab-bars" aria-label="Porównanie opóźnień">{bars.map(b=><div key={b.l} className={`nlab-bar ${b.me?'is-me':''}`}><span className="nlab-bar-l">{b.l}</span><span className="nlab-bar-track" aria-hidden="true"><i style={{width:`${Math.max(1.5,100*b.v/maxV)}%`}}/></span><b>{b.n}</b></div>)}</div>
   <p className="small nlab-phys"><Icon name="energy" size={16}/>Fizyka laga: światło w światłowodzie robi ok. 200 km na 1 ms. Warszawa – Nowy Jork to ok. 6 900 km, więc tam i z powrotem co najmniej ok. {minPingMs(6900)} ms — bez żadnych routerów po drodze. Żadna aplikacja „do pingu” tego nie przeskoczy.</p>
  </article>
  <label className="nlab-field nlab-concl" htmlFor="nl-concl"><span>Wniosek: co sprawdzisz najpierw, gdy w grze pojawi się lag? Wykorzystaj dzisiejsze pomiary (1–2 zdania).</span>
   <textarea id="nl-concl" rows={3} maxLength={400} value={txt} onChange={e=>set({...st,conclusion:e.target.value})} placeholder="Np. Najpierw ping do bramy: jeśli już tu jest dużo ms, winne jest moje Wi-Fi. Potem wybieram serwer gry w Europie."/></label>
  <p className={`small ${txt.trim().length>=CONCLUSION_MIN?'nlab-good':'muted'}`} role="status">{txt.trim().length>=CONCLUSION_MIN?'Paszport gotowy. Pokaż go nauczycielowi razem z kartą wyniku.':`Napisz co najmniej ${CONCLUSION_MIN} znaków (masz ${txt.trim().length}).`}</p>
 </div>;
}

export default function NetLab({data,value,onChange}){
 const v=value||{};const mode=data.mode||'address';
 const r=netResult(v);const mine=r[mode];
 function save(part){const next={...v,[mode]:part};const res=netResult(next);onChange({...next,modes:Object.fromEntries(Object.entries(res).map(([k,x])=>[k,{done:x.done,score:x.score,max:x.max,summary:x.summary}]))});}
 const st=v[mode]||{};
 return <section className="nlab" aria-label={`netLab: ${titles[mode]}`}>
  <header className="nlab-bar"><Icon name="globe" size={20}/><strong>netLab · {titles[mode]}</strong><span className="nlab-sim">symulacja</span>{MAX[mode]>0&&<span className="nlab-score" aria-live="polite">{pts(mine.score)}/{MAX[mode]} pkt</span>}</header>
  {mode==='address'&&<Address st={st} set={save}/>}
  {mode==='packets'&&<Packets st={st} set={save}/>}
  {mode==='cmd'&&<Cmd st={st} set={save}/>}
  {mode==='passport'&&<Passport value={v} st={st} set={save}/>}
 </section>;
}
