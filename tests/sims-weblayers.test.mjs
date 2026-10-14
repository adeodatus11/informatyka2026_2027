import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,toggle,add,result,LAYERS} from '../content/sims/webLayers.js';

test('na starcie nic nie jest odkryte, koszyk działa przy włączonym JS',()=>{
 const s=add(initial(),28);
 assert.equal(s.cart,28);assert.equal(result(s).done,false);
});
test('wyłączenie CSS i HTML odkrywa warstwy, kliknięcie bez JS nie zmienia koszyka',()=>{
 let s=toggle(initial(),'css');s=toggle(s,'css');s=toggle(s,'html');
 assert.equal(add(s,28).cart,0,'bez HTML nie ma przycisku');
 s=toggle(s,'html');s=toggle(s,'js');
 assert.equal(result(s).done,false,'samo wyłączenie JS nie wystarczy — trzeba kliknąć');
 s=add(s,34);assert.equal(s.cart,0);assert.ok(s.deadClick);
 assert.deepEqual(result(s),{done:true,summary:`Odkryte warstwy: ${LAYERS.length}/${LAYERS.length}`});
});
