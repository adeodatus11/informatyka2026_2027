import React from 'react';
import {RoundedBox} from '@react-three/drei';
import {ExplodedViewController} from './ComputerModel.jsx';
import {phoneParts} from '../../content/phone.js';
function Block({size,position=[0,0,0],color='#29373b',radius=.035,metalness=.35}){return <RoundedBox args={size} radius={radius} smoothness={2} position={position} castShadow receiveShadow><meshStandardMaterial color={color} metalness={metalness} roughness={.4}/></RoundedBox>}
function Lens({x,y}){return <group position={[x,y,.14]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.25,.25,.15,32]}/><meshStandardMaterial color="#777e85" metalness={.85} roughness={.25}/></mesh><mesh position={[0,0,.085]}><circleGeometry args={[.19,32]}/><meshStandardMaterial color="#142b3e" metalness={.7} roughness={.15}/></mesh><mesh position={[-.05,.06,.09]}><circleGeometry args={[.055,20]}/><meshStandardMaterial color="#698599"/></mesh></group>}
function Geometry({id}){
 switch(id){
 case 'shell':return <group><Block size={[2.25,4.6,.18]} radius={.17} color="#9da8ad"/><Block size={[2.07,4.4,.03]} position={[0,0,.105]} radius={.14} color="#b8c1c4"/>{[-1.1,1.1].map(x=><Block key={x} size={[.08,.48,.13]} position={[x,.65,.08]} color="#6f7a7e"/>)}</group>;
 case 'display':return <group><Block size={[2.23,4.57,.09]} radius={.16} color="#161c22"/><Block size={[2.07,4.4,.02]} position={[0,0,.058]} radius={.14} color="#365f70"/><Block size={[.58,.14,.025]} position={[0,1.96,.075]} radius={.06} color="#10171c"/><Block size={[.6,.035,.025]} position={[0,-2.02,.075]} radius={.012} color="#d7e4e5"/>{Array.from({length:12},(_,i)=><Block key={i} size={[.33,.33,.025]} position={[-.65+(i%3)*.65,1.1-Math.floor(i/3)*.66,.08]} radius={.06} color={['#7c9b94','#b9c6b2','#a8b9ca'][i%3]}/>)}</group>;
 case 'board':return <group><Block size={[.65,3,.08]} color="#365348"/>{Array.from({length:16},(_,i)=><Block key={i} size={[.12,.08,.04]} position={[i%2?.2:-.2,-1.3+Math.floor(i/2)*.35,.065]} radius={.008} color="#b4ada0"/>)}</group>;
 case 'soc':return <group><Block size={[.5,.55,.07]} color="#2e343c"/><Block size={[.25,.25,.008]} position={[0,0,.041]} radius={.015} color="#879197"/></group>;
 case 'ram':return <Block size={[.48,.5,.035]} color="#41474f"/>;
 case 'flash':return <group><Block size={[.44,.44,.07]} color="#252c32"/>{[-.16,-.08,0,.08,.16].map(x=><Block key={x} size={[.025,.035,.025]} position={[x,-.23,0]} radius={.003} color="#b7aa74"/>)}</group>;
 case 'battery':return <group><Block size={[1.12,2.62,.16]} radius={.1} color="#34383b"/><Block size={[.62,.65,.015]} position={[0,.2,.09]} color="#7a8384"/>{[-.7,-.82,-.94].map(y=><Block key={y} size={[.65,.035,.012]} position={[0,y,.09]} radius={.009} color="#abb2b0"/>)}<Block size={[.25,.26,.025]} position={[.35,1.39,0]} color="#bd9553"/></group>;
 case 'cameras':return <group><Block size={[1.1,.8,.12]} radius={.12} color="#535f65"/><Lens x={-.28} y={0}/><Lens x={.28} y={0}/></group>;
 case 'thermal':return <Block size={[1.65,3.3,.018]} radius={.06} color="#52595b" metalness={.05}/>;
 case 'audio':return <group><Block size={[1.6,.35,.18]} color="#313a40"/><Block size={[.32,.14,.08]} position={[0,-.2,0]} radius={.05} color="#a9b4b6"/>{Array.from({length:6},(_,i)=><Block key={i} size={[.055,.13,.02]} position={[-.65+i*.11,0,.105]} radius={.015} color="#899396"/>)}</group>;
 }
}
export default function PhoneModel({exploded,selected,isolated,onSelect,reduced}){return <group>{phoneParts.filter(p=>!isolated||p.id===selected).map(p=><ExplodedViewController key={p.id} component={p} exploded={exploded} selected={p.id===selected} dim={false} onSelect={onSelect} reduced={reduced}><Geometry id={p.id}/></ExplodedViewController>)}</group>}
