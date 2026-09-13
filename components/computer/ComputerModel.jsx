import React,{createContext,useContext,useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {computerComponents,motherboardSlots,computerModelAsset} from '../../content/computer.js';

const MaterialState=createContext({dim:false,selected:false});
function Surface({color='#929b9c',metalness=.45,roughness=.52}){const {dim,selected}=useContext(MaterialState);return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={dim} opacity={dim?.2:1} depthWrite={!dim}/>;}
function Box({position=[0,0,0],size=[1,1,1],color,rotation,metalness,roughness}){return <mesh position={position} rotation={rotation} castShadow receiveShadow><boxGeometry args={size}/><Surface color={color} metalness={metalness} roughness={roughness}/></mesh>;}
function Disc({position=[0,0,0],radius=.2,depth=.05,color,rotation=[Math.PI/2,0,0]}){return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={[radius,radius,depth,24]}/><Surface color={color}/></mesh>;}
function Fan({radius=.4,position=[0,0,0],rotation=[0,0,0]}){return <group position={position} rotation={rotation}><mesh><torusGeometry args={[radius,.045,6,32]}/><Surface color="#666e70"/></mesh>{Array.from({length:7},(_,i)=><group key={i} rotation={[0,0,i*Math.PI*2/7]}><Box position={[0,radius*.5,0]} size={[radius*.27,radius*.75,.035]} rotation={[0,0,.38]} color="#343e43"/></group>)}<Disc radius={radius*.23} depth={.1} color="#9da5a6"/></group>;}
function Screw({position}){return <Disc position={position} radius={.035} depth={.04} color="#bdc2bf"/>;}


function Wire({points,color='#b58b50',radius=.025}){const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[points]);return <mesh castShadow><tubeGeometry args={[curve,20,radius,6,false]}/><Surface color={color} metalness={.65} roughness={.35}/></mesh>;}
function PartDetails({id}){
 if(id==='cpu')return <group>{Array.from({length:10},(_,i)=>Array.from({length:10},(_,j)=><Box key={`${i}-${j}`} position={[-.31+i*.068,-.31+j*.068,-.038]} size={[.04,.04,.008]} color="#c3ad69"/>))}<Box position={[0,.11,.09]} size={[.25,.015,.008]} color="#7e8585"/><Box position={[0,.06,.09]} size={[.37,.012,.008]} color="#7e8585"/>{[-.33,.33].map(x=><Box key={x} position={[x,.29,.04]} size={[.04,.08,.025]} color="#b3c0af"/>)}</group>;
 if(id==='ram')return <group>{[-.16,.16].map((x,index)=><group key={x} position={[x,0,index*.02]}>{Array.from({length:24},(_,i)=><Box key={i} position={[.034,-.68+i*.057,-.2]} size={[.008,.031,.065]} color="#d4b776"/>)}<Box position={[.058,.05,.03]} size={[.006,.46,.18]} color="#e2e5da"/>{[-.77,.77].map(y=><Box key={y} position={[0,y,-.15]} size={[.1,.09,.15]} color="#e2e2d5"/>)}</group>)}</group>;
 if(id==='ssd')return <group>{Array.from({length:9},(_,i)=><Box key={i} position={[-.604,-.12+i*.028,.03]} size={[.065,.017,.012]} color="#d9bb75"/>)}<Box position={[-.11,0,.121]} size={[.47,.21,.009]} color="#e2e5db"/>{Array.from({length:8},(_,i)=><Box key={i} position={[-.3+i*.05,-.045,.129]} size={[.015,.05,.004]} color="#4b5759"/>)}{[-.42,.22,.45].map(x=><Box key={x} position={[x,-.135,.04]} size={[.035,.022,.025]} color="#ac9f7f"/>)}</group>;
 if(id==='gpu')return <group>{[-.8,-.35,.15].map(x=><group key={x} position={[-1.39,.1,x]}><Box size={[.025,.17,.3]} color="#242d32"/><Box position={[-.02,0,0]} size={[.015,.07,.21]} color="#899397"/></group>)}<Box position={[1.13,.2,-.23]} size={[.28,.18,.2]} color="#1f292d"/>{Array.from({length:8},(_,i)=><Box key={i} position={[1.03+(i%4)*.065,.18+Math.floor(i/4)*.06,-.338]} size={[.04,.035,.012]} color="#a2a18b"/>)}{[-1.17,1.17].flatMap(x=>[-.16,.75].map(z=><group key={`${x}-${z}`} position={[x,.31,z]} rotation={[-Math.PI/2,0,0]}><Screw position={[0,0,0]}/></group>))}</group>;
 if(id==='cooling')return <group>{[-.3,0,.3].map(x=><Wire key={x} points={[[x,-.5,-.25],[x,-.6,.03],[x,-.3,.16],[x,.48,.16]]} color="#be9468" radius={.038}/>)}</group>;
 if(id==='psu')return <group><Box position={[0,0,.835]} size={[.78,.46,.015]} color="#202a2f"/>{Array.from({length:3},(_,i)=><Box key={i} position={[-.23+i*.23,0,.85]} size={[.08,.19,.035]} color="#929c9e"/>)}<Box position={[-.64,.02,.84]} size={[.19,.28,.03]} color="#111b20"/>{Array.from({length:5},(_,i)=><Wire key={i} color={i%2?'#373c40':'#6b6455'} radius={.024} points={[[.86,-.14+i*.05,-.5],[1.1,-.2+i*.04,-.6],[1.28,.08+i*.04,-.4],[1.4,.14+i*.04,-.2]]}/>)}<Box position={[1.4,.24,-.2]} size={[.2,.34,.18]} color="#242d30"/></group>;
 if(id==='case')return <group><Box position={[1.79,2.1,.35]} size={[.11,.8,2.25]} color="#758083"/>{Array.from({length:12},(_,i)=><Box key={i} position={[1.86,1.85+i*.041,.35]} size={[.018,.018,1.5]} color="#263236"/>)}<Box position={[.96,2.67,.1]} size={[.35,.035,.17]} color="#253137"/><Disc position={[1.4,2.67,.1]} rotation={[0,0,0]} radius={.1} depth={.025} color="#263b40"/></group>;
 if(id==='motherboard')return <group>{Array.from({length:12},(_,i)=><group key={i}><Box position={[-1.06+i*.16,-.93,.059]} size={[.008,1.2,.008]} color="#829482"/><Box position={[-.9+i*.12,-1.55+i*.028,.06]} size={[.8,.008,.008]} color="#829482"/></group>)}{[-.95,-.6,-.25].map(x=><Box key={x} position={[x,.43,.12]} size={[.21,.19,.12]} color="#333f43"/>)}<Disc position={[-.85,-1.2,.11]} radius={.19} depth={.05} color="#c0c7c6"/>{Array.from({length:4},(_,i)=><Box key={i} position={[1.17,-.72-i*.18,.14]} size={[.3,.12,.18]} color="#303c40"/>)}{Array.from({length:12},(_,i)=><Box key={i} position={[1.33,-.22+i*.054,.245]} size={[.075,.026,.018]} color="#7e8173"/>)}</group>;
 return null;
}

function Case(){return <group><PartDetails id="case"/>
 <Box position={[0,-2.55,.35]} size={[3.7,.12,2.4]} color="#a2a9aa"/>
 <Box position={[0,2.6,-.35]} size={[3.7,.1,1]} color="#a2a9aa"/>
 {[-1.8,1.8].map(x=><group key={x}><Box position={[x,0,-.82]} size={[.1,5.1,.12]} color="#a2a9aa"/><Box position={[x,0,1.47]} size={[.08,5.1,.08]} color="#a2a9aa"/><Box position={[x,2.6,.35]} size={[.1,.1,2.4]} color="#a2a9aa"/></group>)}
 <Box position={[0,-2.48,-.82]} size={[3.7,.08,.06]} color="#596165"/>
 {[-1.2,1.2].map(x=><Box key={x} position={[x,-2.68,.25]} size={[.45,.2,1.6]} color="#41494e"/>)}
 <Box position={[-1.8,-.15,.3]} size={[.05,1.25,2.3]} color="#949d9f"/>
 </group>;}
function Motherboard(){return <group><PartDetails id="motherboard"/><Box size={[2.95,3.65,.095]} color="#3f5550" metalness={.15}/>
 {/* Trace-like copper tracks, connectors and chips, no external textures. */}
 {Array.from({length:7},(_,i)=><Box key={i} position={[-.94+i*.26,-1.47,.055]} size={[.015,.4,.012]} color="#9a9e86"/>)}
 <Box position={[-1.23,.9,.14]} size={[.3,1.4,.23]} color="#a8aeb0"/>
 {Array.from({length:5},(_,i)=><Box key={i} position={[-1.39,.45+i*.21,.28]} size={[.06,.1,.12]} color="#273339"/>)}
 <Box position={[-.7,1.45,.14]} size={[.7,.25,.18]} color="#6a7476"/>
 <Box position={[.65,-1.34,.13]} size={[.7,.5,.16]} color="#889291"/>
 {Array.from({length:6},(_,i)=><Box key={i} position={[.37+i*.105,-1.34,.22]} size={[.03,.47,.035]} color="#bdc2bf"/>)}
 {[-1.3,1.3].flatMap(x=>[-1.6,1.6].map(y=><Screw key={`${x}${y}`} position={[x,y,.08]}/>))}
 {Array.from({length:5},(_,i)=><Disc key={i} position={[-.98+i*.23,.15,.14]} radius={.065} depth={.18} color="#adb4b2"/>)}
 <Box position={[1.32,.1,.13]} size={[.14,.72,.2]} color="#d0d2c6"/>
 </group>;}
function CPU(){return <group><PartDetails id="cpu"/><Box size={[.78,.78,.065]} color="#426450"/><Box position={[0,0,.055]} size={[.66,.66,.06]} color="#c8cbca" metalness={.85} roughness={.32}/><Box position={[0,-.17,.092]} size={[.28,.018,.005]} color="#747e7c"/></group>;}
function RAM(){return <group><PartDetails id="ram"/>{[-.16,.16].map((x,index)=><group key={x} position={[x,0,index*.02]}><Box size={[.055,1.5,.42]} color="#345446"/><Box position={[0,0,-.2]} size={[.061,1.42,.055]} color="#b7a266"/>{Array.from({length:5},(_,i)=><Box key={i} position={[.04,-.56+i*.28,.025]} size={[.025,.2,.25]} color="#293237"/>)}<Box position={[-.04,0,.1]} size={[.04,1.3,.2]} color="#5f6a6e"/></group>)}</group>;}
function GPU(){return <group><PartDetails id="gpu"/><Box position={[0,-.03,.3]} size={[2.65,.055,1.18]} color="#3d554b"/><Box position={[0,.15,.3]} size={[2.65,.3,1.12]} color="#333e44"/><Box position={[0,-.03,-.28]} size={[1.9,.09,.07]} color="#b9a56c"/>
 {[-.71,.71].map(x=><Fan key={x} position={[x,.32,.3]} rotation={[-Math.PI/2,0,0]} radius={.43}/>)}
 {Array.from({length:16},(_,i)=><Box key={i} position={[-1.18+i*.155,.08,.87]} size={[.025,.2,.08]} color="#a0a7a7"/>)}
 <Box position={[-1.35,.1,.28]} size={[.06,.5,1.35]} color="#adb4b3"/>
 </group>;}
function SSD(){return <group><PartDetails id="ssd"/><Box size={[1.15,.32,.035]} color="#335548"/><Box position={[-.1,0,.07]} size={[.6,.27,.09]} color="#293539"/><Box position={[.34,0,.06]} size={[.2,.25,.07]} color="#445153"/><Box position={[-.56,0,0]} size={[.085,.28,.044]} color="#c0ac72"/><Screw position={[.54,0,.04]}/></group>;}
function PSU(){return <group><PartDetails id="psu"/><Box size={[1.85,.85,1.65]} color="#465157"/><Fan radius={.52} position={[0,.45,0]} rotation={[-Math.PI/2,0,0]}/>{Array.from({length:8},(_,i)=><Box key={i} position={[-.7+i*.2,0,.84]} size={[.035,.55,.018]} color="#222d32"/>)}<Box position={[.75,.1,.845]} size={[.15,.17,.025]} color="#aeb4b4"/></group>;}
function Cooling(){return <group><PartDetails id="cooling"/><Box position={[0,0,-.23]} size={[.76,.76,.09]} color="#b9bdb6"/>{Array.from({length:12},(_,i)=><Box key={i} position={[0,-.43+i*.078,0]} size={[.95,.025,.5]} color="#aeb5b7"/>)}<Fan position={[0,0,.3]} radius={.47}/></group>;}
function Fans(){return <group>{[-.64,.64].map(y=><group key={y} position={[0,y,0]} rotation={[0,Math.PI/2,0]}><Box size={[1.02,1.02,.055]} color="#858f91"/><Fan position={[0,0,.045]} radius={.43}/></group>)}</group>;}
const geometry={case:Case,motherboard:Motherboard,cpu:CPU,ram:RAM,gpu:GPU,ssd:SSD,psu:PSU,cooling:Cooling,fans:Fans};

// Future GLB contract: each named node is centred around the part origin in content/computer.js.
function GLBPart({url,node}){const {nodes}=useGLTF(url);const copy=useMemo(()=>nodes[node]?.clone(true),[nodes,node]);if(!copy)throw Error(`Missing model node: ${node}`);return <primitive object={copy}/>;}
export function ExplodedViewController({component,exploded,selected,dim,onSelect,reduced,children}){
 const ref=useRef(),from=useRef(new THREE.Vector3(...component.position)),target=useRef(new THREE.Vector3(...component.position)),elapsed=useRef(2);const invalidate=useThree(s=>s.invalidate);
 useEffect(()=>{if(!ref.current)return;from.current.copy(ref.current.position);target.current.set(...(exploded?component.explodedPosition:component.position));if(selected){target.current.z+=.2;}if(component.id==='cooling'&&!exploded&&selected===false&&dim){target.current.y+=1.35;target.current.z+=.7;}elapsed.current=0;if(reduced)ref.current.position.copy(target.current);invalidate();},[exploded,selected,dim,reduced,component,invalidate]);
 useFrame((_,dt)=>{if(!ref.current||elapsed.current>=1.45||reduced)return;elapsed.current+=Math.min(dt,.05);const t=Math.min(elapsed.current/1.45,1);const eased=t*t*(3-2*t);ref.current.position.lerpVectors(from.current,target.current,eased);invalidate();});
 return <group ref={ref} position={component.position} name={component.modelNode} userData={{partId:component.id}} onClick={e=>{if(e.delta>6)return;e.stopPropagation();onSelect(component.id);}}><MaterialState.Provider value={{dim,selected}}>{children}</MaterialState.Provider></group>;
}
export default function ComputerModel({isolated,exploded,selected,onSelect,reduced,slot,onSlot}){return <group>
 {selected==='screen'&&<group position={[2.85,.65,1.2]}><Box size={[1.8,1.15,.12]} color="#35413f"/><Box position={[0,0,.07]} size={[1.65,.98,.02]} color="#87a591"/><Box position={[0,-.82,0]} size={[.12,.55,.12]} color="#7b8581"/><Box position={[0,-1.12,.12]} size={[.9,.07,.55]} color="#7b8581"/></group>}
 {computerComponents.filter(c=>!isolated||c.id===selected).map(c=>{const Geometry=geometry[c.id];return <ExplodedViewController key={c.id} component={c} exploded={exploded} selected={selected===c.id} dim={!!selected&&selected!==c.id} onSelect={onSelect} reduced={reduced}>{computerModelAsset.url?<GLBPart url={computerModelAsset.url} node={c.modelNode}/>:<Geometry/>}</ExplodedViewController>})}
 {motherboardSlots.filter(()=>!isolated||selected==='motherboard').map(s=><group key={s.id} position={[s.position[0],s.position[1],s.position[2]+(selected==='motherboard'?.2:0)]} onClick={e=>{if(e.delta>6)return;e.stopPropagation();onSlot(s.id);}} userData={{slotId:s.id}}><MaterialState.Provider value={{selected:slot===s.id,dim:!!selected&&selected!=='motherboard'}}><Box size={s.size} color={slot===s.id?'#608471':'#242f33'}/>{s.id==='socket'?<group><Box position={[0,0,s.size[2]/2+.012]} size={[s.size[0]*.76,s.size[1]*.76,.022]} color="#939d98"/><Wire points={[[.48,-.38,.07],[.48,.25,.07],[.43,.43,.07]]} color="#bec6c3" radius={.018}/></group>:<group><Box position={[0,0,s.size[2]/2+.005]} size={[s.size[0]*.72,s.size[1]*.85,.013]} color="#9b9c7d"/><Box position={[0,0,s.size[2]/2+.014]} size={[s.size[0]*.35,s.size[1]*.78,.014]} color="#151f24"/></group>}</MaterialState.Provider></group>)}
 </group>;}
