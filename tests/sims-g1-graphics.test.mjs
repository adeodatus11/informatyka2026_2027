import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {lessonScore} from '../content/scoring.js';
import {desktopApp} from '../content/desktop-apps.js';
const ids=['99','100','101','102','103','104'];
const files=readdirSync(new URL('../content/lessons/',import.meta.url));
const lessons=await Promise.all(ids.map(async id=>(await import('../content/lessons/'+files.find(f=>f.startsWith(id+'-')))).default));
const rows=JSON.parse(readFileSync(new URL('../docs/rozklad-2026-2027.json',import.meta.url)));
const acts=l=>l.sections.flatMap(s=>s.activities);
const manifest=JSON.parse(readFileSync(new URL('../public/materials/grafika/manifest.json',import.meta.url)));
function crc32(buf){let n=0xffffffff;for(const b of buf){n^=b;for(let k=0;k<8;k++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function png(buf){assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');let p=8,header,data=[];while(p<buf.length){const n=buf.readUInt32BE(p),name=buf.toString('ascii',p+4,p+8),chunk=buf.subarray(p+8,p+8+n);assert.equal(crc32(buf.subarray(p+4,p+8+n)),buf.readUInt32BE(p+8+n),name+' CRC');if(name==='IHDR')header={width:chunk.readUInt32BE(0),height:chunk.readUInt32BE(4),depth:chunk[8],color:chunk[9]};if(name==='IDAT')data.push(chunk);p+=n+12;if(name==='IEND')break;}assert.equal(p,buf.length,'brak danych po IEND');return {...header,raw:inflateSync(Buffer.concat(data))};}
for(const l of lessons)test(`${l.id}: rozkład, 45 min, wykonanie w programie, metody i materiały`,()=>{
 assert.equal(l.grade,1);const expectedOrder={99:15,100:16,101:17,102:37,103:38,104:39}[l.id];assert.equal(l.order,expectedOrder);assert.equal(l.title,rows.find(r=>r.klasa===1&&r.lp===expectedOrder).temat);
 assert.equal(l.duration,45);assert.equal(l.sections.reduce((n,s)=>n+s.duration,0),45);assert.ok(l.sections.length>=4&&l.sections.length<=7);assert.match(l.workspace,/^desktop-(photo|vector)craft$/);assert.ok(desktopApp(l.workspace));assert.match(l.subtitle,Number(l.id)<102?/PhotoCraft/:/VectorCraft/);
 assert.match(l.teacherGuide.preparation,/DO WERYFIKACJI w pracowni/);assert.match(l.teacherGuide.preparation,Number(l.id)<102?/0\.16\.0/:/0\.17\.0/);assert.match(l.teacherGuide.preparation,/nie sprawdzono na Windows 11/);assert.match(l.teacherGuide.summary,/samoocena/);
 assert.ok(l.format.methods.length>=3);for(const m of l.format.methods)assert.match(m.url,/^https:\/\/metodyka\.covepolska\.pl\/metoda-[a-z-]+\.html$/);
 const all=acts(l);assert.equal(new Set(all.map(a=>a.id)).size,all.length);assert.ok(l.sections[0].activities.some(a=>a.type==='choice'&&/Z lekcji|Z poprzedniej|Z projektu/.test(a.question)));
 for(const s of l.sections){for(const name of ['teacherNotes','askStudents','expectedAnswers','commonMistakes','optionalExtension'])assert.ok(s[name].length>10);assert.ok(s.reading.paragraphs.every(p=>p.length<530));assert.notEqual(s.title,s.reading.title);}
 for(const a of all){assert.ok(['choice','download','wordSteps','wordRubric','resultCard','text'].includes(a.type),a.type);if(a.type==='wordSteps')for(const step of a.steps)assert.ok(step.instruction.length>25&&step.check.length>20&&step.help.length>20);if(a.type==='download'){const b=readFileSync(new URL('../public/'+a.file,import.meta.url));assert.ok(b.length>100);assert.ok(manifest.some(m=>a.file.endsWith('/'+m.file)));}}
 assert.equal(all.filter(a=>a.type==='wordSteps').length,2);assert.equal(all.find(a=>a.type==='wordRubric').criteria.length,4);
});
test('Karty mierzą quiz, nigdy deklaracji ani pliku graficznego',()=>{for(const l of lessons){const all=acts(l),card=all.find(a=>a.type==='resultCard'),rubric=all.find(a=>a.type==='wordRubric');assert.equal(card.hideGrade,true);assert.ok(!card.sources.includes(rubric.id));assert.deepEqual(card.sources,[...all.filter(a=>a.type==='choice').map(a=>a.id)]);const empty=lessonScore(l,card,{});assert.equal(empty.score,0);assert.equal(empty.max,3);const perfect=Object.fromEntries(all.filter(a=>a.type==='choice').map(a=>[a.id,{selected:a.correct[0],done:true,first:true}]));const full=lessonScore(l,card,perfect);assert.equal(full.score,full.max);assert.equal(full.ratio,1);const wrong={...perfect,[card.sources[1]]:{done:true,first:false}};assert.equal(lessonScore(l,card,wrong).score,2.5);}});
test('Materiały PNG/SVG są samodzielne, mają poprawne rozmiary i zgodne sumy kontrolne',()=>{
 assert.equal(manifest.length,10);for(const m of manifest){const b=readFileSync(new URL('../public/materials/grafika/'+m.file,import.meta.url));assert.equal(b.length,m.bytes,m.file);assert.equal(createHash('sha256').update(b).digest('hex'),m.sha256,m.file);assert.equal(m.license,'CC0-1.0');if(m.file.endsWith('.png')){const image=png(b);assert.equal(image.width,m.width);assert.equal(image.height,m.height);assert.equal(image.depth,8);assert.ok(image.raw.length>m.width*m.height*3);}else{const s=b.toString();assert.match(s,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);assert.match(s,new RegExp(`viewBox="0 0 ${m.width} ${m.height}"`));assert.ok(!/<script|<foreignObject|\b(?:href|src)\s*=|@import|url\(https?:/i.test(s),m.file);assert.match(s,/<title>.+<\/title>/);}}
 const pad=png(readFileSync(new URL('../public/materials/grafika/99-pad.png',import.meta.url)));assert.equal(pad.color,6,'obiekt ma kanał alfa');assert.equal(pad.raw[4],0,'górny lewy piksel jest przezroczysty');
 const path=readFileSync(new URL('../public/materials/grafika/103-sciezka.svg',import.meta.url),'utf8');assert.match(path,/M160 180L340 180L340 360L160 360"/);assert.match(path,/M560 180L740 180L740 360L560 360Z/);
 const cube=readFileSync(new URL('../public/materials/grafika/104-przestrzen.svg',import.meta.url),'utf8');assert.equal((cube.match(/<path /g)||[]).length,3);
});
test('Programy desktopowe mają odmianę nazwy i nie zmieniają kontraktu Office',()=>{assert.equal(desktopApp('desktop-photocraft').loc,'PhotoCrafcie');assert.equal(desktopApp('desktop-vectorcraft').gen,'VectorCrafta');for(const app of ['word','excel','powerpoint'])assert.ok(desktopApp('desktop-'+app));assert.equal(desktopApp('no-such-app'),null);});
