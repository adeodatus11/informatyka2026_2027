import React,{useEffect,useRef} from 'react';
import {Icon} from '../icons.jsx';
import './futureFirm.css';
import {orderOptions,optionKey} from './optionOrder.js';
import {YEARS,THRESHOLDS,MAX_POINTS,QUALITY_LABEL,AREAS,LENSES,industries,industryIds,cards,cardFor,eventFor,simulate,canAdd,toggleCard,confirmYear,react,nextYear,newGame,cartCost,cartOrder,timeline,summaryText,futureFirmResult,REFLECTION_MIN,INVEST_SHARE,fmt,signed} from '../../content/sims/futureFirm.js';

const FX_LABEL={profit:'Wynik',clients:'Klienci',security:'Bezpieczeństwo',team:'Zespół',cash:'Kasa',staff:'Osób w zespole'};
const fxText=(k,v)=>k==='profit'?`${FX_LABEL[k]} ${signed(v)} zł/mies.`:k==='cash'?`${FX_LABEL[k]} ${signed(v)} zł`:k==='staff'?`${FX_LABEL[k]} ${signed(v)}`:`${FX_LABEL[k]} ${signed(v)}`;
function Chips({list,label}){if(!list||!list.length)return null;return <ul className="ff-chips" aria-label={label}>{list.map(([k,v],i)=><li key={k+i} className={v>0?'is-up':'is-down'}><span aria-hidden="true">{v>0?'▲':'▼'}</span>{fxText(k,v)}</li>)}</ul>;}
const fxList=fx=>Object.entries(fx||{}).filter(([,v])=>v);
const modes=[['solo','Samodzielnie'],['pair','W parze'],['trio','W trójce']];

function Lenses({hints,title='Spójrz oczami…'}){
 return <div className="ff-lenses"><b>{title}</b><ul>{LENSES.map(l=><li key={l.id}><span className={`ff-lens ff-lens-${l.id}`}>{l.short}</span>{hints[l.id]}</li>)}</ul></div>;
}

function Kpis({sim}){
 const s=sim.stats;const base=industries[sim.ind].profit;const target=base+THRESHOLDS.profitGain;
 const tiles=[
  ['profit','Wynik finansowy',`${fmt(s.profit)} zł`,'/mies.',Math.min(100,Math.round(100*s.profit/(target*1.4))),Math.round(100*target/(target*1.4)),s.profit>=target,`cel ${fmt(target)} zł`],
  ['clients','Zadowolenie klientów',`${s.clients}%`,'',s.clients,THRESHOLDS.clients,s.clients>=THRESHOLDS.clients,`cel ${THRESHOLDS.clients}%`],
  ['security','Bezpieczeństwo danych',`${s.security}%`,'',s.security,THRESHOLDS.security,s.security>=THRESHOLDS.security,`cel ${THRESHOLDS.security}%`],
  ['team','Zespół',`${s.team}%`,` · ${s.staff} os.`,s.team,THRESHOLDS.team,s.team>=THRESHOLDS.team,`cel ${THRESHOLDS.team}%`],
 ];
 return <div className="ff-kpis" aria-label="Wskaźniki firmy">
  {tiles.map(([id,label,val,extra,pct,goal,ok,goalText])=><div key={id} className={`ff-kpi ${ok?'is-ok':''}`}>
   <small>{label}</small><b>{val}<span>{extra}</span></b>
   <div className="ff-meter" aria-hidden="true"><span style={{width:`${pct}%`}}/><i style={{left:`${goal}%`}}/></div>
   <em><Icon name={ok?'check':'circle'} size={14}/>{goalText}{ok?' — osiągnięty':''}</em>
  </div>)}
  <div className={`ff-kpi ff-cash ${s.cash<0?'is-debt':''}`}><small>Kasa na technologie</small><b>{fmt(s.cash)} zł</b><em>{s.cash<0?'debet w banku':`co rok +${Math.round(INVEST_SHARE*100)}% rocznego wyniku`}</em></div>
 </div>;
}

function Years({sim}){
 return <ol className="ff-years" aria-label="Lata gry">{YEARS.map((y,i)=>{const h=sim.history[i];const state=h&&h.reaction!==undefined?'done':i===sim.yearIndex?'now':'next';
  return <li key={y} className={`is-${state}`} aria-current={state==='now'?'step':undefined}><span>{y}</span><small>{state==='done'?`${h.points} pkt`:state==='now'?'teraz':'—'}</small></li>;})}</ol>;
}

function Shop({game,sim,onGame,focusRef}){
 const y=game.years.at(-1);const year=YEARS[sim.yearIndex];const cart=cartOrder(y.cart);const cost=cartCost(cart,game.ind);const left=sim.stats.cash-cost;
 const owned=cards.filter(c=>sim.owned[c.id]!==undefined);const offer=cards.filter(c=>sim.owned[c.id]===undefined);
 return <section className="ff-phase" aria-labelledby="ff-shop-h">
  <h4 id="ff-shop-h" tabIndex={-1} ref={focusRef}>Rok {year}: w co inwestuje firma?</h4>
  <p className="ff-budget" role="status"><Icon name="energy" size={18}/><span>Kasa: <b>{fmt(sim.stats.cash)} zł</b> · w planie: <b>{fmt(cost)} zł</b> · zostaje: <b>{fmt(left)} zł</b>{cart.length?` · wybrane: ${cart.length}`:''}</span></p>
  <p className="small muted">Każda karta pokazuje szansę. Ryzyko — nie zawsze. Koszt to jednorazowe wdrożenie; abonament jest już odjęty w zmianie wyniku. Możesz też nic nie kupić i oszczędzać na następny rok.</p>
  {owned.length>0&&<p className="ff-owned"><b>Już działa w firmie:</b> {owned.map(c=>`${cardFor(c.id,game.ind).name} (od ${YEARS[sim.owned[c.id]]})`).join(' · ')}</p>}
  <ul className="ff-cards">{offer.map(base=>{const c=cardFor(base.id,game.ind);const on=cart.includes(c.id);const why=on?null:canAdd(game,c.id);
   const gains=fxList(c.fx).filter(([k,v])=>v>0&&k!=='staff');
   return <li key={c.id} className={`ff-card ${on?'is-on':''}`}>
    <header><Icon name={c.icon} size={22}/><h5>{c.name}</h5></header>
    <p className="ff-what">{c.what}</p>
    <p className="ff-cost"><b>{fmt(c.cost)} zł</b> jednorazowo{c.monthly?` · abonament ${fmt(c.monthly)} zł/mies.`:''}</p>
    <p className="ff-chance"><span className="ff-tag ff-tag-chance"><Icon name="check" size={13}/>Szansa</span>{c.chance.text}</p>
    <Chips list={gains} label={`Efekty: ${c.name}`}/>
    {c.risk.visible&&<p className="ff-risk"><span className="ff-tag ff-tag-risk"><Icon name="warning" size={13}/>Uwaga</span>{c.risk.text}</p>}
    <details className="ff-hints"><summary>Spójrz oczami… <Icon name="down" size={16}/></summary><Lenses hints={c.hints} title=""/></details>
    <button type="button" className={on?'btn':'btn secondary'} aria-pressed={on} disabled={!on&&!!why} onClick={()=>onGame(toggleCard(game,c.id))}>{on?<><Icon name="check" size={18}/>W planie — usuń</>:<>Dodaj do planu</>}</button>
    {!on&&why&&<small className="ff-why">{why}</small>}
   </li>;})}</ul>
  <div className="ff-actions"><button type="button" className="btn" onClick={()=>onGame(confirmYear(game))}>{cart.length?`Wdrażamy (${cart.length}) i zamykamy rok ${year}`:`Nic nie kupujemy w ${year}`}<Icon name="right" size={18}/></button></div>
 </section>;
}

function EventView({game,sim,onGame,focusRef}){
 const h=sim.history.at(-1);const e=eventFor(h.event);const done=h.reaction!==undefined;const last=sim.finished;
 const texts=e.options.map(o=>o.text);const order=orderOptions(optionKey('futureFirm',e.id,texts),texts);
 const opt=done?e.options[h.reaction]:null;
 return <section className="ff-phase" aria-labelledby="ff-ev-h">
  {h.bought.length>0&&<p className="ff-owned"><b>Wdrożone w {h.year}:</b> {h.bought.map(b=>cardFor(b.id,game.ind).name).join(' · ')}</p>}
  <article className={`ff-event ff-area-${e.area}`}>
   <p className="ff-eyebrow"><Icon name="warning" size={16}/>Zdarzenie roku {h.year} · {AREAS[e.area]}</p>
   <h4 id="ff-ev-h" tabIndex={-1} ref={done?undefined:focusRef}>{e.title}</h4>
   <p>{h.eventText}</p>
   {h.protected&&<p className="ff-protect"><Icon name="shield" size={16}/>{e.protectNote}</p>}
   {h.impact.length>0?<div className="ff-impact"><small>Skutki zdarzenia:</small><Chips list={h.impact} label="Skutki zdarzenia"/>{e.impactNote&&<small>{e.impactNote}</small>}</div>:<p className="small"><b>Skutki zdarzenia:</b> brak strat.</p>}
  </article>
  <Lenses hints={e.hints}/>
  <fieldset className="ff-options" disabled={done}><legend>Jak reaguje firma? (decyzja jest ostateczna)</legend>
   {order.map(([i,t],n)=><button type="button" key={t} data-option={i} className={`choice ${done&&h.reaction===i?'selected':''} ${done&&e.options[i].q==='best'?'ff-best':''}`} aria-pressed={done?h.reaction===i:undefined} onClick={()=>onGame(react(game,i))}><span className="choice-letter">{String.fromCharCode(65+n)}</span><span>{t}{done&&h.reaction===i&&<b className="ff-picked"> · Twój wybór</b>}{done&&e.options[i].q==='best'&&h.reaction!==i&&<b className="ff-picked ff-picked-best"> · najlepsza reakcja</b>}</span></button>)}
  </fieldset>
  {done&&<div className={`ff-outcome is-${opt.q}`} role="status" tabIndex={-1} ref={focusRef}>
   <p><Icon name={opt.q==='best'?'trophy':opt.q==='ok'?'check':'warning'} size={20}/><b>{QUALITY_LABEL[opt.q]} · +{h.points} pkt</b></p>
   <p>{opt.feedback}</p>
   {opt.q!=='best'&&<p className="small"><b>Najlepsza reakcja:</b> {e.options.find(o=>o.q==='best').text}</p>}
   <Chips list={h.reactionFx} label="Skutki reakcji"/>
   <p className="small">Koniec roku {h.year}: do kasy na technologie wpływa {fmt(h.inflow)} zł ({Math.round(INVEST_SHARE*100)}% rocznego wyniku).</p>
  </div>}
  {done&&<div className="ff-actions"><button type="button" className="btn" onClick={()=>onGame(last?{...game,report:true}:nextYear(game))}>{last?'Zobacz raport firmy 2030':`Przejdź do roku ${h.year+1}`}<Icon name="right" size={18}/></button></div>}
 </section>;
}

function StatsTable({sim}){
 const rows=[['profit','Wynik (zł/mies.)'],['clients','Klienci (%)'],['security','Bezpieczeństwo (%)'],['team','Zespół (%)'],['cash','Kasa (zł)']];
 const maxProfit=Math.max(...sim.snapshots.map(s=>s.profit),1);const maxCash=Math.max(...sim.snapshots.map(s=>Math.abs(s.cash)),1);
 return <div className="ff-table-wrap"><table className="ff-table"><caption>Wskaźniki rok po roku (stan na koniec roku)</caption>
  <thead><tr><th scope="col">Wskaźnik</th>{sim.snapshots.map(s=><th scope="col" key={s.label}>{s.label}</th>)}</tr></thead>
  <tbody>{rows.map(([k,l])=><tr key={k}><th scope="row">{l}</th>{sim.snapshots.map(s=>{const v=s[k];const pct=k==='profit'?100*v/maxProfit:k==='cash'?100*Math.abs(v)/maxCash:v;
   return <td key={s.label}><span className="ff-tbar" aria-hidden="true"><i className={v<0?'is-neg':''} style={{width:`${Math.max(2,Math.min(100,pct))}%`}}/></span>{fmt(v)}</td>;})}</tr>)}</tbody></table></div>;
}

function Report({game,sim,practice,v,save,focusRef}){
 const tl=timeline(sim);const base=industries[sim.ind];
 return <section className="ff-phase ff-report" aria-labelledby="ff-rep-h">
  <header className="ff-rep-head"><Icon name="trophy" size={28}/><div><small>{practice?'Druga gra (trening, bez punktów)':'Raport firmy 2030'}</small><h4 id="ff-rep-h" tabIndex={-1} ref={focusRef}>{base.name}</h4><p>{summaryText(sim)}</p></div></header>
  <ul className="ff-goals" aria-label="Bilans końcowy">{sim.goals.map(g=><li key={g.id} className={g.ok?'is-ok':''}><Icon name={g.ok?'check':'circle'} size={18}/>{g.text}<b>{g.ok?'+1 pkt':'0 pkt'}</b></li>)}</ul>
  {!practice&&<p className="ff-points"><b>Punkty:</b> reakcje {sim.eventPoints}/8 + bilans {sim.goalPoints}/4 = <b>{sim.points}/{MAX_POINTS} pkt</b></p>}
  <StatsTable sim={sim}/>
  <h5>Oś czasu decyzji: co było szansą, a co zagrożeniem?</h5>
  <ol className="ff-timeline">{tl.map(t=><li key={t.year}><span className="ff-tl-year">{t.year}</span><div>
   {t.cards.length===0&&<p className="small muted">Bez nowych technologii.</p>}
   {t.cards.map(c=><div key={c.id} className="ff-tl-card"><b>{c.name}</b>
    <p><span className="ff-tag ff-tag-chance"><Icon name="check" size={13}/>Szansa · {AREAS[c.chance.area]}</span>{c.chance.text}</p>
    <p><span className="ff-tag ff-tag-risk"><Icon name="warning" size={13}/>Zagrożenie · {AREAS[c.risk.area]}</span>{c.risk.text} <em>{c.revealedBy.length?`Ujawniło się: ${c.revealedBy.join(', ')}.`:c.risk.visible?'Widoczne na karcie.':'Ukryte — tym razem się nie ujawniło.'}</em></p></div>)}
   {t.event&&<p className="ff-tl-event"><Icon name="warning" size={16}/><span><b>Zdarzenie: {t.event.title}</b> · {AREAS[t.event.area]} — {QUALITY_LABEL[t.event.quality]} ({t.event.points} pkt)</span></p>}
  </div></li>)}</ol>
  {!practice&&<label className="ff-field"><span>Co zrobiłbyś inaczej, gdybyś zaczynał od nowa? Która decyzja okazała się szansą, a która zagrożeniem — i dla kogo?</span>
   <textarea rows={3} maxLength={500} value={v.reflection||''} onChange={e=>save({...v,reflection:e.target.value})} placeholder="Np. Pakiet bezpieczeństwa kupiłbym w pierwszym roku, bo ransomware kosztował firmę…"/></label>}
  {!practice&&<p className={`ff-msg ${(v.reflection||'').trim().length>=REFLECTION_MIN?'is-ok':''}`} role="status">{(v.reflection||'').trim().length>=REFLECTION_MIN?<><Icon name="check" size={18}/>Odpowiedź zapisana. Gra zaliczona — wynik trafia na kartę wyniku.</>:<>Dokończ zdanie (min. {REFLECTION_MIN} znaków), żeby zaliczyć etap.</>}</p>}
 </section>;
}

function Game({game,onGame,practice,v,save}){
 const sim=simulate(game);const focusRef=useRef(null);const key=`${sim.yearIndex}:${sim.phase}:${game.report?1:0}`;const first=useRef(true);
 useEffect(()=>{if(first.current){first.current=false;return;}focusRef.current?.focus();},[key]);
 return <>
  <div className="ff-top"><Years sim={sim}/><Kpis sim={sim}/></div>
  {game.report&&sim.finished?<Report game={game} sim={sim} practice={practice} v={v} save={save} focusRef={focusRef}/>
   :sim.phase==='shop'?<Shop game={game} sim={sim} onGame={onGame} focusRef={focusRef}/>
   :<EventView game={game} sim={sim} onGame={onGame} focusRef={focusRef}/>}
 </>;
}

function Setup({v,save,onStart,practice,exclude}){
 const mode=v.mode||'solo';
 return <div className="ff-phase">
  {!practice&&<><h4>Kto gra?</h4>
  <div className="ff-modes" role="group" aria-label="Kto gra">{modes.map(([k,l])=><button type="button" key={k} aria-pressed={mode===k} onClick={()=>save({...v,mode:k})}>{l}</button>)}</div>
  <p className="small muted">{mode==='solo'?'Grasz sam i podejmujesz wszystkie decyzje (to domyślny tryb). Przy każdej karcie i zdarzeniu możesz spojrzeć na sprawę oczami właściciela, informatyka oraz klientów i pracowników.':'Gracie na jednym komputerze. Przed każdą decyzją każdy mówi, co widzi „oczami” właściciela, informatyka albo klientów i pracowników — decyzję podejmujecie razem.'}</p></>}
  <h4>{practice?'Druga gra: wybierz inną branżę (bez punktów)':'Wybierz firmę'}</h4>
  <ul className="ff-industries">{industryIds.map(id=>{const d=industries[id];return <li key={id}><button type="button" onClick={()=>onStart(id)} className={exclude===id?'is-played':''}>
   <span className="ff-ind-head"><Icon name={d.icon} size={26}/><b>{d.name}</b></span>
   <span>{d.who}</span><span className="small">{d.twist}</span>
   <span className="ff-ind-num">Wynik: {fmt(d.profit)} zł/mies. · {d.staff} os. · seniorzy: {Math.round(d.seniors*100)}%{exclude===id?' · już graliście':''}</span>
   <span className="ff-ind-go">Zakładam tę firmę <Icon name="right" size={16}/></span></button></li>;})}</ul>
  <p className="small muted">Start: kasa na technologie 10 000 zł, klienci 60%, bezpieczeństwo 35% (papierowy zeszyt i stary laptop z hasłem „firma123”), zespół 60%. 4 rundy = lata 2027–2030. Cel: na koniec wszystkie wskaźniki powyżej progów.</p>
 </div>;
}

export default function FutureFirm({value,onChange}){
 const v=value||{};const r=futureFirmResult(v);const view=v.view==='replay'&&v.replay?'replay':'main';
 function save(next){const res=futureFirmResult(next);onChange({...next,done:res.done,score:res.score,max:res.max,summary:res.summary});}
 const mainSim=simulate(v.game);
 const practice=view==='replay';const game=practice?v.replay:v.game;
 return <section className="ff" aria-label="Gra Firma 2030">
  <header className="ff-bar"><Icon name="trophy" size={20}/><strong>Firma 2030{game?.ind?` · ${industries[game.ind].name}`:''}</strong><span className="ff-sim">symulacja</span><span className="ff-score">{practice?'trening — bez punktów':`${r.score}/${MAX_POINTS} pkt`}</span></header>
  {practice&&<div className="ff-banner" role="note"><span>Druga gra — bez punktów. Wynik z pierwszej gry zostaje na karcie.</span><button type="button" className="text-button" onClick={()=>save({...v,view:'main'})}><Icon name="left" size={18}/>Wróć do raportu pierwszej gry</button></div>}
  {!game?<Setup v={v} save={save} practice={false} onStart={id=>save({...v,game:newGame(id)})}/>
   :practice&&!game.ind?<Setup v={v} save={save} practice exclude={v.game.ind} onStart={id=>save({...v,replay:newGame(id)})}/>
   :<Game game={game} practice={practice} v={v} save={save} onGame={g=>save(practice?{...v,replay:g}:{...v,game:g})}/>}
  {!practice&&mainSim?.finished&&v.game.report&&<div className="ff-replay">
   <p><b>Chcesz sprawdzić inną strategię?</b> Zagraj drugi raz — najlepiej inną branżą. Druga gra nie zmienia punktów.</p>
   <button type="button" className="btn secondary" onClick={()=>save({...v,view:'replay',replay:v.replay?.ind?v.replay:{}})}>{v.replay?.ind?'Wróć do drugiej gry':'Zagraj drugi raz (bez punktów)'}<Icon name="reset" size={18}/></button>
  </div>}
 </section>;
}
