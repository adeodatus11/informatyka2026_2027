import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readableReference} from '../content/lesson-references.js';
const files=fs.readdirSync(new URL('../content/lessons/',import.meta.url)).filter(f=>/^\d.*\.js$/.test(f));
const lessons=await Promise.all(files.map(async f=>(await import('../content/lessons/'+f)).default));
test('W treści żadnej lekcji nie widać numeru produkcyjnego innej lekcji',()=>{
 const issues=[];
 function walk(v,p,id){if(typeof v==='string'&&/\blekcj(?:ach|ami|om|a|i|ę|ą|e)\s+(?:nr\.?\s*)?\d{1,3}/iu.test(v))issues.push(`${id}${p}: ${v}`);else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))walk(x,p+'.'+k,id);}
 for(const l of lessons)walk(l,'',l.id);
 assert.deepEqual(issues,[]);
});
test('Odwołania zachowują temat, bez zmiany technicznych nazw plików i ID',()=>{
 const l=lessons.find(l=>l.id==='106');assert.equal(l.id,'106');assert.match(l.sections[0].activities[0].question,/Skracanie i działania arytmetyczne na ułamkach/);assert.doesNotMatch(l.sections[0].activities[0].question,/90/);
 assert.equal(readableReference('plik lesson-90-start.xlsx, ID 90', '106'),'plik lesson-90-start.xlsx, ID 90');
 assert.match(readableReference('lekcji 19. tematu (Fibonacci)','46'),/Fibonacciego/);
 assert.match(readableReference('lekcję 47','75'),/Chopin/);
});
