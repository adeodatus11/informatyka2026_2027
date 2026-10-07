// Punktacja do karty wyniku. Działa w przeglądarce i w testach Node.
const display=new Set(['wordSteps','wordRubric','reveal','flow','video','download','fileCloud','filename','connection','diagram','phone','ports','hardwareReference','computerExplorer','resultCard','reportGuide','text','checklist','appNeeds','hardware','dentalSimulator']);
export const defaultGrades=[[0.9,'bardzo dobra (5)'],[0.75,'dobra (4)'],[0.55,'dostateczna (3)'],[0.35,'dopuszczająca (2)'],[0,'jeszcze do poprawy — wróć do zadań']];
export function activityScore(activity,value){
 if(value&&Number(value.max)>0)return {score:Math.max(0,Math.min(Number(value.score)||0,Number(value.max))),max:Number(value.max)};
 const max=activity.points||1;
 if(activity.type==='choice')return {score:value?.first?max:value?.done?max/2:0,max};
 return {score:value?.done?max:0,max};
}
// Aktywności ze wspólnym stateKey i własnym mode zapisują wynik w value.modes[mode].
export function activityValue(a,answers={}){const v=answers[a.stateKey||a.id];return a.stateKey&&a.mode&&v?.modes?.[a.mode]?v.modes[a.mode]:v;}
export function lessonActivities(lesson){return lesson.sections.flatMap(s=>s.activities);}
export function resultSources(lesson,card){
 const all=lessonActivities(lesson);
 if(card.sources)return card.sources.map(id=>{const a=all.find(x=>x.id===id||x.stateKey===id);if(!a)throw new Error(`Brak aktywności ${id}`);return a;});
 return all.filter(a=>!display.has(a.type));
}
export function lessonScore(lesson,card,answers={}){
 const rows=resultSources(lesson,card).map(a=>{const v=activityValue(a,answers);return {id:a.id,label:a.label||a.question||a.title||a.id,summary:v?.summary,...activityScore(a,v)};});
 const score=Math.round(rows.reduce((s,r)=>s+r.score,0)*10)/10,max=rows.reduce((s,r)=>s+r.max,0),ratio=max?score/max:0;
 const badges=[...(card.badges||[])].sort((a,b)=>b.min-a.min);const badge=badges.find(b=>ratio>=b.min)||null;
 const grade=(card.grades||defaultGrades).find(([min])=>ratio>=min)?.[1];
 return {rows,score,max,ratio,badge,grade};
}
