import React,{useState} from 'react';
import {Icon} from '../icons.jsx';
import {LAYERS,MENU,initial,toggle,add,result} from '../../content/sims/webLayers.js';
import './webLayers.css';

function Page({on,cart,onAdd,deadClick}){
 if(!on.html)return <div className="wl-page wl-empty"><p>(pusta strona)</p></div>;
 const styled=on.css;
 return <div className={`wl-page ${styled?'wl-styled':'wl-raw'}`}>
  <h4 className="wl-h1">Pizzeria u Bartka</h4>
  <p className="wl-lead">Na wynos i na miejscu.</p>
  <ul className="wl-menu">{MENU.map(p=><li key={p.name}><span>{p.name} – {p.price} zł</span> <button type="button" className="wl-add" onClick={()=>onAdd(p.price)} aria-label={`Dodaj ${p.name} do koszyka`}>Dodaj</button></li>)}</ul>
  <p className="wl-cart">Koszyk: {cart} zł</p>
  {deadClick&&<p className="wl-dead">Kliknięcie nic nie zrobiło — nikt nie „słucha” przycisku.</p>}
 </div>;
}

export default function WebLayers({data={},value,onChange}){
 const st=value?.on?value:initial();
 const [tab,setTab]=useState('html');
 const save=next=>onChange({...next,...result(next)});
 const res=result(st);
 const layer=LAYERS.find(l=>l.id===tab);
 return <div className="wl">
  <p className="wl-progress" role="status"><Icon name="check" size={18}/>{res.summary}{res.done?' — świetnie, znasz już wszystkie trzy warstwy.':''}</p>
  <div className="wl-grid">
   <fieldset className="wl-switches">
    <legend>Warstwy strony</legend>
    {LAYERS.map(l=><div key={l.id} className={`wl-switch ${st.on[l.id]?'is-on':'is-off'}`}>
     <label><input type="checkbox" checked={st.on[l.id]} onChange={()=>save({...toggle(st,l.id),deadClick:false})}/> <b>{l.name}</b> — {l.role} <span className="wl-state">{st.on[l.id]?'włączony':'wyłączony'}</span></label>
     <p className="small">{st.seen[l.id]?<><Icon name="check" size={16}/> {l.off}</>:l.task}</p>
    </div>)}
   </fieldset>
   <div className="wl-window">
    <div className="wl-bar"><span className="wl-dots" aria-hidden="true"><i/><i/><i/></span><span className="wl-url">pizzeria-bartka.example/menu.html</span><span className="wl-badge">symulacja</span></div>
    <Page on={st.on} cart={st.cart} deadClick={st.deadClick} onAdd={price=>save(add(st,price))}/>
   </div>
  </div>
  <div className="wl-code">
   <div className="wl-tabs" role="tablist" aria-label="Pliki strony">{LAYERS.map(l=><button key={l.id} type="button" role="tab" aria-selected={tab===l.id} className={tab===l.id?'active':''} onClick={()=>setTab(l.id)}>{l.file}</button>)}</div>
   <div role="tabpanel" aria-label={layer.file} className={st.on[layer.id]?'':'wl-code-off'}>
    {!st.on[layer.id]&&<p className="small"><b>Plik wyłączony</b> — przeglądarka go teraz nie wczytuje.</p>}
    <pre tabIndex={0}><code>{layer.code}</code></pre>
   </div>
  </div>
  {data.note&&<p className="small muted">{data.note}</p>}
 </div>;
}
