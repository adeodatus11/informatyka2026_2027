import fs from 'node:fs';
const mappingPath='docs/podstawa-programowa/mapowanie.json';
const rowsPath='docs/rozklad-2026-2027.json';
const map=JSON.parse(fs.readFileSync(mappingPath));
const rows=JSON.parse(fs.readFileSync(rowsPath));
for(const f of fs.readdirSync('content/lessons').filter(f=>/^(11[0-9]|12[01])-/.test(f))){
 const l=(await import('../content/lessons/'+f)).default;
 const row=rows.find(r=>r.klasa===l.grade&&r.lp===l.order);
 row.originalTitle??=row.temat;
 row.temat=l.title;row.status='jest';row.ids=[l.id];
 row.note='Autorska realizacja II.3.a w Tinkercad zamiast wcześniejszego tematu SketchUp; zmiana zaakceptowana przez nauczyciela 6.11.2026. Model i eksport sprawdza nauczyciel.';
 const item={lessonId:l.id,grade:l.grade,numberInGrade:0,title:l.title,file:'content/lessons/'+f,requirements:['II.2','II.3.a'],activityIds:[`m${l.id}-build`,`m${l.id}-transfer`,`m${l.id}-rubric`],evidence:l.objectives.join(' ')+' Praktyka: model w edytorze, własna zmiana i eksport STL.',limitations:'Quiz sprawdza pojęcia; rubryka jest samooceną. Model, wymiary i podgląd warstw ocenia nauczyciel. Nie potwierdzono wydruku na fizycznej H2C ani działania Classroom w szkolnej sieci.'};
 const i=map.lessons.findIndex(m=>m.lessonId===l.id);if(i<0)map.lessons.push(item);else map.lessons[i]=item;
}
map.reviewedOn='2026-11-06';
fs.writeFileSync(mappingPath,JSON.stringify(map,null,2)+'\n');
fs.writeFileSync(rowsPath,JSON.stringify(rows,null,2)+'\n');
await import('./reconcile-integration.mjs');
