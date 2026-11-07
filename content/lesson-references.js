import {referenceTitles} from './lesson-reference-titles.js';
// Nie zmieniamy adresów, ID, nazw plików ani kodu. Cytujemy temat, nie numer produkcyjny.
const prose=new Set(['question','title','intro','subtitle','topic','curriculum','teacherNotes','askStudents','expectedAnswers','commonMistakes','optionalExtension','exitTicket','preparation','summary','explanation','hint','prompt','description','label','student','teacher','grouping','short','text','doneText','help','instruction','check','paragraphs','objectives','materials','options','items']);
const classroomRefs={
 '46':{19:'Obliczanie elementów ciągu Fibonacciego'},
 '50':{22:'Algorytmy NWD i NWW'},'90':{22:'Algorytmy NWD i NWW'},
 '75':{47:'Projekt prezentacji o Fryderyku Chopinie'},
 '76':{46:'Zasady tworzenia prezentacji multimedialnej'}
};
export function readableReference(text,lessonId){
 const name=n=>classroomRefs[lessonId]?.[Number(n)]||referenceTitles[Number(n)];
 return text.replace(/\b(lekcj(?:ach|ami|om|a|i|ę|ą|e))\s+(?:nr\.?\s*)?(\d{1,3})(?:\s*[–-]\s*(\d{1,3}))?(?!\d)(?:\.\s*tematu)?/giu,(all,word,a,b)=>{
  if(!name(a)||b&&!name(b))return all;
  return `${word} „${name(a)}”${b?` oraz „${name(b)}”`:''}`;
 });
}
export function normalizeLessonReferences(original){
 const l=structuredClone(original);
 function walk(v,key=''){
  if(typeof v==='string')return prose.has(key)?readableReference(v,l.id):v;
  if(Array.isArray(v))return v.map(x=>walk(x,key));
  if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,k)]));
  return v;
 }
 return walk(l);
}
