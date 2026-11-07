import fs from 'node:fs';
import path from 'node:path';
import {lessonNotes} from '../content/lesson-notes.js';
import {lessonScore} from '../content/scoring.js';
const lessons=await Promise.all(fs.readdirSync('content/lessons').filter(f=>/^\d.*\.js$/.test(f)).map(async f=>({file:f,...(await import('../content/lessons/'+f)).default})));
const builtin=new Set(['choice','multi','matching','sort','hardware','scenarios','text','sequence','appNeeds','checklist','computerChallenge','dentalSimulator','wordSteps','wordRubric','reveal','flow','video','download','fileCloud','filename','connection','diagram','phone','ports','hardwareReference','computerExplorer','resultCard','reportGuide']);
for(const f of fs.readdirSync('components/sims').filter(f=>f.endsWith('.jsx')))builtin.add(f.slice(0,-4));
const issues=[],materials=new Map(),links=new Set(),types={};
function walk(v,fn,p=''){if(typeof v==='string')fn(v,p);else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))walk(x,fn,p+'.'+k);}
for(const l of lessons){
 const row={id:l.id,grade:l.grade,title:l.title,sections:l.sections.length,activities:0,downloads:[],issues:[]};
 const issue=(kind,detail)=>{row.issues.push(kind);issues.push({id:l.id,kind,detail});};
 walk(l,(s,p)=>{for(const m of s.matchAll(/https?:\/\/[^\s"'<>]+/g))links.add(m[0].replace(/[),.;]+$/,''));if(/DO UZUPEŁNIENIA|TODO|lorem ipsum/i.test(s))issue('placeholder',p+': '+s);});
 if(!l.externalUrl){
  if(l.sections.reduce((n,s)=>n+s.duration,0)!==l.duration)issue('time','Suma minut');
  const acts=l.sections.flatMap(s=>s.activities),ids=new Set(acts.map(a=>a.id));row.activities=acts.length;
  if(ids.size!==acts.length)issue('ids','Powtórzone ID');
  for(const s of l.sections){if(!s.reading&&!lessonNotes[l.id]?.[s.id])issue('reading',s.id);if(!s.activities.length)issue('empty-stage',s.id);}
  for(const a of acts){types[a.type]=(types[a.type]||0)+1;if(!builtin.has(a.type))issue('renderer',a.type);
   if(a.type==='download'){const f=String(a.file||'');row.downloads.push(f);materials.set(f,true);if(!f||!fs.existsSync(path.join('public',f)))issue('download',f);}
   if(a.type==='resultCard'){for(const id of a.sources||[])if(!ids.has(id))issue('score-source',id);const score=lessonScore(l,a,{});if(!Number.isFinite(score.max)||score.max<=0)issue('score','Brak maksimum');if(l.workspace&&!a.hideGrade)issue('grade','Quiz proponuje ocenę nieobejrzanego pliku');}
  }
 }
 if(!globalThis.rows)globalThis.rows=[];globalThis.rows.push(row);
}
const report={lessons:lessons.length,internal:lessons.filter(l=>!l.externalUrl).length,sections:lessons.reduce((n,l)=>n+l.sections.length,0),types,materials:[...materials.keys()],links:[...links],issues,rows:globalThis.rows.sort((a,b)=>Number(a.id)-Number(b.id))};
fs.mkdirSync('tmp',{recursive:true});fs.writeFileSync('tmp/completeness.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,rows:undefined,links:report.links.length,materials:report.materials.length},null,2));
