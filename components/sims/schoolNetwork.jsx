import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import './schoolNetwork.css';
import {netNodes,netLayout,incidents,checkIncident,incidentPoints,mapResult} from '../../content/sims/schoolNetwork.js';

const pts=n=>String(n).replace('.',',');
export default function SchoolNetwork({value,onChange}){
 const v=value||{};const inc=v.incidents||{};const r=mapResult(v);
 const [tab,setTab]=useState(v.tab||'explore');const [open,setOpen]=useState(null);
 const cur=Math.min(v.current??0,incidents.length-1);const incident=incidents[cur];const st=inc[incident.id]||{};const sel=st.selected||[];
 function save(next){const res=mapResult(next);onChange({...next,done:res.done,score:res.score,max:res.max,summary:res.summary});}
 function setInc(patch){save({...v,incidents:{...inc,[incident.id]:{...st,...patch}}});}
 function clickNode(id){
  if(tab==='explore'){setOpen(open===id?null:id);return;}
  if(st.solved||id===incident.broken)return;
  setInc({selected:sel.includes(id)?sel.filter(x=>x!==id):[...sel,id],msg:null});
 }
 function check(){if(st.solved)return;const attempts=(st.attempts||0)+1;const res=checkIncident(incident,sel);setInc({attempts,solved:res.ok,solvedAt:res.ok?attempts:undefined,msg:{ok:res.ok,text:res.message}});}
 function switchTab(t){setTab(t);setOpen(null);}
 const node=(id,child)=>{const n=netNodes[id];const broken=tab==='incidents'&&id===incident.broken;const picked=tab==='incidents'&&sel.includes(id);const expanded=tab==='explore'&&open===id;
  return <li key={id} className={`snet-item ${child?'snet-child':''}`}>
   <button type="button" className={`snet-node snet-${n.kind} ${broken?'is-broken':''} ${picked?'is-picked':''}`} aria-pressed={tab==='incidents'?picked:undefined} aria-expanded={tab==='explore'?expanded:undefined} aria-disabled={broken||undefined} onClick={()=>clickNode(id)}>
    <Icon name={n.icon} size={22}/><span>{n.name}</span>
    {broken&&<em className="snet-tag snet-tag-bad"><Icon name="warning" size={14}/>AWARIA</em>}
    {picked&&<em className="snet-tag snet-tag-pick"><Icon name="check" size={14}/>{incident.invert?'działa':incident.id==='router'?'na drodze':'traci sieć'}</em>}
   </button>
   {expanded&&<div className="snet-card" role="status"><p><b>Co robi:</b> {n.does}</p><p><b>Gdy padnie / zniknie sieć:</b> {n.fails}</p></div>}
  </li>;};
 const solvedCount=incidents.filter(i=>inc[i.id]?.solved).length;
 return <section className="snet" aria-label="Mapa sieci szkoły">
  <header className="snet-bar"><Icon name="school" size={20}/><strong>Mapa sieci · ZS nr 1</strong><span className="snet-sim">symulacja</span><span className="snet-score">{pts(r.score)}/4 pkt</span></header>
  <div className="snet-tabs" role="group" aria-label="Tryb mapy">
   <button type="button" aria-pressed={tab==='explore'} onClick={()=>switchTab('explore')}><Icon name="search" size={18}/>Poznaj mapę</button>
   <button type="button" aria-pressed={tab==='incidents'} onClick={()=>switchTab('incidents')}><Icon name="warning" size={18}/>Awarie ({solvedCount}/4)</button>
  </div>
  {tab==='explore'?<p className="snet-help">Kliknij dowolny element, żeby zobaczyć, co robi i co się dzieje, gdy padnie. Potem przejdź do zakładki <b>Awarie</b>.</p>:
  <div className="snet-incident">
   <ol className="snet-steps" aria-label="Awarie">{incidents.map((i,k)=><li key={i.id}><button type="button" aria-current={k===cur?'step':undefined} className={`${k===cur?'is-current':''} ${inc[i.id]?.solved?'is-solved':''}`} onClick={()=>save({...v,current:k})}>{inc[i.id]?.solved?<Icon name="check" size={16}/>:k+1}<span className="sr-only">{inc[i.id]?.solved?' — rozwiązana':''}</span></button></li>)}</ol>
   <p className="snet-alert"><Icon name="warning" size={22}/><span><b>Awaria {cur+1}: {incident.title}.</b> {incident.ask}</span></p>
  </div>}
  <div className="snet-map">
   <ul className="snet-row snet-top">{netLayout.top.map(id=>node(id))}</ul>
   <span className="snet-v" aria-hidden="true"/>
   {netLayout.chain.map((id,i)=><React.Fragment key={id}><ul className="snet-row">{node(id)}</ul><span className="snet-v" aria-hidden="true"/></React.Fragment>)}
   <div className="snet-branches">{netLayout.zones.map(z=>{const infra=netNodes[z.nodes[0]].kind==='infra';return <section className="snet-zone" key={z.id} aria-label={z.title}><h4>{z.title}</h4><ul>{z.nodes.map((id,i)=>node(id,infra&&i>0))}</ul></section>;})}</div>
   <section className="snet-zone snet-offline" aria-label="Poza siecią"><h4>Poza siecią · przez USB / kartę SD</h4><ul>{netLayout.offline.map(id=>node(id))}</ul></section>
  </div>
  {tab==='incidents'&&<div className="snet-actions">
   {!st.solved?<button type="button" className="btn" onClick={check}>Sprawdź <Icon name="right" size={18}/></button>:<p className="snet-done"><Icon name="check" size={18}/>Rozwiązana · +{pts(incidentPoints(st.solvedAt))} pkt</p>}
   {st.msg&&<div className={`snet-msg ${st.msg.ok?'is-ok':'is-retry'}`} role="status">{st.msg.text}</div>}
   {st.solved&&cur<incidents.length-1&&<button type="button" className="btn secondary" onClick={()=>save({...v,current:cur+1})}>Następna awaria <Icon name="right" size={18}/></button>}
   {r.done&&<p className="snet-final" role="status"><Icon name="trophy" size={20}/>Wszystkie 4 awarie przeanalizowane. Wniosek: awaria dotyka tylko tego, co jest „pod” zepsutym elementem.</p>}
  </div>}
 </section>;
}
