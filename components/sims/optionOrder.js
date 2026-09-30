// Kolejność wyświetlania opcji w symulatorach (tylko widok — stan i ocena zostają na oryginalnych indeksach).
// Opcje tekstowe mieszamy (content/shuffle.js: stałe do przeładowania strony).
// Skali liczbowej (np. 6/12/24/48, 37%/49%/51%) nie mieszamy — rosnący porządek nie zdradza odpowiedzi.
import {shuffled} from '../../content/shuffle.js';

const lead=s=>{const m=String(s).trim().match(/^(?:około|ok\.|~)?\s*(\d[\d\s]*(?:[.,]\d+)?)/i);return m?Number(m[1].replace(/\s/g,'').replace(',','.')):NaN;};
// Skala liczbowa: każda opcja zaczyna się od liczby (dopuszczalny tekstowy „koniec skali” na ostatniej pozycji,
// np. „nieskończenie wiele”), liczby rosną, a opcja nie jest listą liczb („10, 25, 35…”).
export function isNumericScale(items){
 if(items.length<2||items.some(o=>typeof o!=='string'||/\d,\s+\d/.test(o)))return false;
 const nums=items.map(lead);const head=Number.isNaN(nums.at(-1))?nums.slice(0,-1):nums;
 if(head.length<2||head.some(Number.isNaN))return false;
 return head.every((n,i)=>i===0||n>head[i-1]);
}
// Zwraca pary [indeksOryginalny, element] w kolejności wyświetlania.
export function orderOptions(key,items){return isNumericScale(items)?items.map((o,i)=>[i,o]):shuffled(key,items);}
export const optionKey=(sim,id,texts)=>`sim:${sim}:${id}:${texts.join('|')}`;
