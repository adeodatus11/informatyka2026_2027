import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {minuteStats,guessVerdict,guessPoints,minuteResult,feedPosts,topics,feedShares,oppositeReactions,topTopics,hiddenTopics,bubbleResult} from '../../content/sims/internetOcean.js';
import './internetOcean.css';

const fmt=n=>String(n).replace('.',',');

function Minute({value={},onChange}){
 const guesses=value.guesses||{};
 const firstOpen=minuteStats.findIndex(s=>guesses[s.id]===undefined);
 const [idx,setIdx]=useState(firstOpen<0?0:firstOpen);
 const stat=minuteStats[idx],guess=guesses[stat.id],res=minuteResult(guesses);
 function pick(i){if(guess!==undefined)return;const g={...guesses,[stat.id]:i};onChange({...value,guesses:g,...minuteResult(g)});}
 return <div className="io-sim">
  <div className="io-top"><span className="io-tag">Gra: szacowanie</span><span className="io-score" aria-live="polite">Punkty: <b>{fmt(res.score)}</b>/{res.max}</span></div>
  <nav className="io-dots" aria-label="Statystyki do oszacowania">{minuteStats.map((s,i)=><button key={s.id} className={`${i===idx?'current':''} ${guesses[s.id]!==undefined?(guessPoints(s,guesses[s.id])===1?'hit':'miss'):''}`} aria-current={i===idx?'step':undefined} onClick={()=>setIdx(i)} aria-label={`Pytanie ${i+1}${guesses[s.id]!==undefined?`, zdobyte punkty: ${fmt(guessPoints(s,guesses[s.id]))}`:''}`}>{i+1}</button>)}</nav>
  <div className="io-card">
   <p className="io-scope"><Icon name={stat.scope.startsWith('Polska')?'location':'globe'} size={18}/>{stat.scope}</p>
   <h3>{stat.question}</h3>
   <p className="muted small">Wybierz rząd wielkości. Za trafienie 1 pkt, za pomyłkę o jedno zero 0,5 pkt.</p>
   <div className="io-options" role="group" aria-label="Twoje oszacowanie">{stat.options.map((o,i)=>{const state=guess===undefined?'':i===stat.correct?'correct':i===guess?'wrong':'';return <button key={o} className={`io-option ${state} ${guess===i?'picked':''}`} aria-pressed={guess===i} disabled={guess!==undefined&&guess!==i&&i!==stat.correct} onClick={()=>pick(i)}><span className="io-bar" aria-hidden="true" style={{width:`${25+i*25}%`}}/><span className="io-option-label">{o}</span>{state==='correct'&&<span className="io-mark">prawidłowo</span>}{state==='wrong'&&<span className="io-mark">Twój wybór</span>}</button>;})}</div>
   {guess!==undefined&&<div className={`io-reveal ${guessPoints(stat,guess)===1?'ok':''}`} role="status">
    <strong>{guessVerdict(stat,guess).text}</strong>
    <p>Wartość: <b>{stat.value}</b>. {stat.comment}</p>
    <p className="small muted">Źródło: {stat.source}</p>
   </div>}
   <div className="inline-actions">
    {idx<minuteStats.length-1&&<button className="btn" disabled={guess===undefined} onClick={()=>setIdx(idx+1)}>Następna liczba <Icon name="right" size={18}/></button>}
    {idx===minuteStats.length-1&&guess!==undefined&&!res.done&&<button className="btn secondary" onClick={()=>setIdx(minuteStats.findIndex(s=>guesses[s.id]===undefined))}>Wróć do pominiętej</button>}
   </div>
  </div>
  {res.done&&<div className="io-final" role="status"><Icon name="globe" size={28}/><div><strong>Wynik: {fmt(res.score)}/5.</strong> <span>W minutę powstaje więcej treści, niż obejrzysz przez całe życie. Twój feed to kropla w tym oceanie — a kroplę wybiera za Ciebie algorytm.</span></div></div>}
 </div>;
}

function Bars({title,shares,highlight}){
 return <figure className="io-chart"><figcaption>{title}</figcaption><ul>{shares.map(s=><li key={s.id} className={highlight.includes(s.id)?'top':''}><span className="io-chart-label">{s.label}</span><span className="io-chart-track" aria-hidden="true"><span style={{width:`${Math.max(s.share,1)}%`}}/></span><b>{s.share}%</b></li>)}</ul></figure>;
}

function Bubble({value={},onChange}){
 const reactions=value.reactions||{};
 const answered=feedPosts.filter(p=>reactions[p.id]).length;
 const [pos,setPos]=useState(Math.min(answered,feedPosts.length-1));
 const done=answered===feedPosts.length;
 const [showFeed,setShowFeed]=useState(done);
 const post=feedPosts[pos];
 function react(r){const next={...reactions,[post.id]:r};onChange({...value,reactions:next,...bubbleResult(next)});if(pos<feedPosts.length-1)setPos(pos+1);else if(feedPosts.every(p=>next[p.id]))setShowFeed(true);}
 function reset(){onChange({reactions:{},...bubbleResult({})});setPos(0);setShowFeed(false);}
 const topicLabel=id=>topics.find(t=>t.id===id).label;
 if(showFeed&&done){
  const mine=feedShares(reactions),other=feedShares(oppositeReactions(reactions));const top=topTopics(mine,2),otherTop=topTopics(other,2);const gone=hiddenTopics(mine);
  const likes=feedPosts.filter(p=>reactions[p.id]==='like').length;
  return <div className="io-sim">
   <div className="io-top"><span className="io-tag">Symulacja algorytmu</span><span className="io-score">Ukończono: <b>1</b>/1</span></div>
   {likes===0&&<p className="io-note" role="status">Nic nie polubiłeś — algorytm i tak się uczy: z tego, co pomijasz, i jak długo patrzysz na post.</p>}
   <div className="io-charts">
    <Bars title="Twój feed po tygodniu (100 postów)" shares={mine} highlight={top.map(t=>t.id)}/>
    <Bars title="Feed osoby, która polubiła to, co Ty pominąłeś" shares={other} highlight={otherTop.map(t=>t.id)}/>
   </div>
   <div className="io-reveal ok" role="status"><strong>Wasze feedy się rozjechały.</strong><p>U Ciebie {top.map(t=>`${t.label} (${t.share}%)`).join(' i ')} zajmują {top.reduce((s,t)=>s+t.share,0)}% ekranu. {gone.length?`Tematy prawie zniknęły (poniżej 5%): ${gone.map(g=>g.label).join(', ')}.`:''} Ta druga osoba widzi głównie: {otherTop.map(t=>t.label).join(' i ')}. Każde z Was myśli, że „wszyscy o tym mówią”. To jest <b>bańka filtrująca</b>.</p><p className="small">Jak z niej wyjść? Sam wyszukuj tematy, obserwuj różne źródła, klikaj „Nie interesuje mnie” świadomie, a newsy sprawdzaj poza aplikacją.</p></div>
   <button className="text-button" onClick={reset}><Icon name="reset" size={18}/>Przewiń jeszcze raz, inaczej</button>
  </div>;
 }
 return <div className="io-sim">
  <div className="io-top"><span className="io-tag">Feed · symulacja, fikcyjne profile</span><span className="io-score" aria-live="polite">Post {pos+1}/{feedPosts.length}</span></div>
  <div className="io-phone">
   <article className="io-post" aria-label={`Post ${pos+1} z ${feedPosts.length}`}>
    <header><span className="io-avatar" aria-hidden="true">{post.author[1].toUpperCase()}</span><div><b>{post.author}</b><small>Temat: {topicLabel(post.topic)}</small></div></header>
    <p>{post.text}</p>
    {reactions[post.id]&&<p className="small muted">Twoja reakcja: {reactions[post.id]==='like'?'lubię to':'pominięty'} (możesz zmienić)</p>}
   </article>
   <div className="io-react" role="group" aria-label="Twoja reakcja">
    <button className={`btn ${reactions[post.id]==='like'?'':'secondary'}`} aria-pressed={reactions[post.id]==='like'} onClick={()=>react('like')}><Icon name="check" size={18}/>Lubię to</button>
    <button className={`btn secondary ${reactions[post.id]==='skip'?'selected':''}`} aria-pressed={reactions[post.id]==='skip'} onClick={()=>react('skip')}>Przewiń dalej <Icon name="down" size={18}/></button>
   </div>
   <div className="io-pager"><button className="text-button" disabled={pos===0} onClick={()=>setPos(pos-1)}><Icon name="left" size={18}/>Poprzedni</button><span>Ocenione: {answered}/{feedPosts.length}</span>{done&&<button className="text-button" onClick={()=>setShowFeed(true)}>Pokaż mój feed <Icon name="right" size={18}/></button>}</div>
  </div>
  <p className="muted small">Reaguj szczerze — tak jak na swoim telefonie. Po 10 postach zobaczysz, co algorytm pokaże Ci za tydzień.</p>
 </div>;
}

export default function InternetOcean(props){return props.data.mode==='bubble'?<Bubble {...props}/>:<Minute {...props}/>;}
