import React,{createContext,useContext,useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {computerComponents,motherboardSlots,computerModelAsset} from '../../content/computer.js';

const MaterialState=createContext({dim:false,selected:false});
function Surface({color='#929b9c',metalness=.45,roughness=.52}){const {dim,selected}=useContext(MaterialState);return <meshStandardMaterial color={selected?'#557969':color} metalness={metalness} roughness={roughness} transparent={dim} opacity={dim?.2:1} depthWrite={!dim}/>;}
function Box({position=[0,0,0],size=[1,1,1],color,rotation,metalness,roughness}){return <mesh position={position} rotation={rotation} castShadow receiveShadow><boxGeometry args={size}/><Surface color={color} metalness={metalness} roughness={roughness}/></mesh>;}
function Disc({position=[0,0,0],radius=.2,depth=.05,color,rotation=[Math.PI/2,0,0]}){return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={[radius,radius,depth,24]}/><Surface color={color}/></mesh>;}
function Fan({radius=.4,position=[0,0,0],rotation=[0,0,0]}){return <group position={position} rotation={rotation}><mesh><torusGeometry args={[radius,.045,6,32]}/><Surface color="#666e70"/></mesh>{Array.from({length:7},(_,i)=><group key={i} rotation={[0,0,i*Math.PI*2/7]}><Box position={[0,radius*.5,0]} size={[radius*.27,radius*.75,.035]} rotation={[0,0,.38]} color="#343e43"/></group>)}<Disc radius={radius*.23} depth={.1} color="#9da5a6"/></group>;}
function Screw({position}){return <Disc position={position} radius={.035} depth={.04} color="#bdc2bf"/>;}

function Case(){return <group>
 <Box position={[0,-2.55,.35]} size={[3.7,.12,2.4]} color="#a2a9aa"/>
 <Box position={[0,2.6,-.35]} size={[3.7,.1,1]} color="#a2a9aa"/>
 {[-1.8,1.8].map(x=><group key={x}><Box position={[x,0,-.82]} size={[.1,5.1,.12]} color="#a2a9aa"/><Box position={[x,0,1.47]} size={[.08,5.1,.08]} color="#a2a9aa"/><Box position={[x,2.6,.35]} size={[.1,.1,2.4]} color="#a2a9aa"/></group>)}
 <Box position={[0,-2.48,-.82]} size={[3.7,.08,.06]} color="#596165"/>
 {[-1.2,1.2].map(x=><Box key={x} position={[x,-2.68,.25]} size={[.45,.2,1.6]} color="#41494e"/>)}
 <Box position={[-1.8,-.15,.3]} size={[.05,1.25,2.3]} color="#949d9f"/>
 </group>;}
function Motherboard(){return <group><Box size={[2.95,3.65,.095]} color="#3f5550" metalness={.15}/>
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
function CPU(){return <group><Box size={[.78,.78,.065]} color="#426450"/><Box position={[0,0,.055]} size={[.66,.66,.06]} color="#c8cbca" metalness={.85} roughness={.32}/><Box position={[0,-.17,.092]} size={[.28,.018,.005]} color="#747e7c"/></group>;}
function RAM(){return <group>{[-.16,.16].map((x,index)=><group key={x} position={[x,0,index*.02]}><Box size={[.055,1.5,.42]} color="#345446"/><Box position={[0,0,-.2]} size={[.061,1.42,.055]} color="#b7a266"/>{Array.from({length:5},(_,i)=><Box key={i} position={[.04,-.56+i*.28,.025]} size={[.025,.2,.25]} color="#293237"/>)}<Box position={[-.04,0,.1]} size={[.04,1.3,.2]} color="#5f6a6e"/></group>)}</group>;}
function GPU(){return <group><Box position={[0,-.03,.3]} size={[2.65,.055,1.18]} color="#3d554b"/><Box position={[0,.15,.3]} size={[2.65,.3,1.12]} color="#333e44"/><Box position={[0,-.03,-.28]} size={[1.9,.09,.07]} color="#b9a56c"/>
 {[-.71,.71].map(x=><Fan key={x} position={[x,.32,.3]} rotation={[-Math.PI/2,0,0]} radius={.43}/>)}
 {Array.from({length:16},(_,i)=><Box key={i} position={[-1.18+i*.155,.08,.87]} size={[.025,.2,.08]} color="#a0a7a7"/>)}
 <Box position={[-1.35,.1,.28]} size={[.06,.5,1.35]} color="#adb4b3"/>
 </group>;}
function SSD(){return <group><Box size={[1.15,.32,.035]} color="#335548"/><Box position={[-.1,0,.07]} size={[.6,.27,.09]} color="#293539"/><Box position={[.34,0,.06]} size={[.2,.25,.07]} color="#445153"/><Box position={[-.56,0,0]} size={[.085,.28,.044]} color="#c0ac72"/><Screw position={[.54,0,.04]}/></group>;}
function PSU(){return <group><Box size={[1.85,.85,1.65]} color="#465157"/><Fan radius={.52} position={[0,.45,0]} rotation={[-Math.PI/2,0,0]}/>{Array.from({length:8},(_,i)=><Box key={i} position={[-.7+i*.2,0,.84]} size={[.035,.55,.018]} color="#222d32"/>)}<Box position={[.75,.1,.845]} size={[.15,.17,.025]} color="#aeb4b4"/></group>;}
function Cooling(){return <group><Box position={[0,0,-.23]} size={[.76,.76,.09]} color="#b9bdb6"/>{Array.from({length:12},(_,i)=><Box key={i} position={[0,-.43+i*.078,0]} size={[.95,.025,.5]} color="#aeb5b7"/>)}<Fan position={[0,0,.3]} radius={.47}/></group>;}
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
export default function ComputerModel({exploded,selected,onSelect,reduced,slot,onSlot}){return <group>
 {selected==='screen'&&<group position={[2.85,.65,1.2]}><Box size={[1.8,1.15,.12]} color="#35413f"/><Box position={[0,0,.07]} size={[1.65,.98,.02]} color="#87a591"/><Box position={[0,-.82,0]} size={[.12,.55,.12]} color="#7b8581"/><Box position={[0,-1.12,.12]} size={[.9,.07,.55]} color="#7b8581"/></group>}
 {computerComponents.map(c=>{const Geometry=geometry[c.id];return <ExplodedViewController key={c.id} component={c} exploded={exploded} selected={selected===c.id} dim={!!selected&&selected!==c.id} onSelect={onSelect} reduced={reduced}>{computerModelAsset.url?<GLBPart url={computerModelAsset.url} node={c.modelNode}/>:<Geometry/>}</ExplodedViewController>})}
 {motherboardSlots.map(s=><group key={s.id} position={s.position} onClick={e=>{if(e.delta>6)return;e.stopPropagation();onSlot(s.id);}} userData={{slotId:s.id}}><MaterialState.Provider value={{selected:slot===s.id,dim:!!selected&&selected!=='motherboard'}}><Box size={s.size} color={slot===s.id?'#608471':'#242f33'}/></MaterialState.Provider></group>)}
 </group>;}
