import fs from 'node:fs';
import {compareLessons} from '../content/lesson-order.js';
const lessons=await Promise.all(fs.readdirSync('content/lessons').filter(f=>/^\d.*\.js$/.test(f)).map(async f=>({... (await import('../content/lessons/'+f)).default,file:'content/lessons/'+f})));
lessons.sort(compareLessons);
const path='docs/podstawa-programowa/mapowanie.json';
const map=JSON.parse(fs.readFileSync(path));const counts={};
for(const l of lessons){const m=map.lessons.find(m=>m.lessonId===l.id);m.numberInGrade=counts[l.grade]=(counts[l.grade]||0)+1;}
fs.writeFileSync(path,JSON.stringify(map,null,2)+'\n');
const rows=JSON.parse(fs.readFileSync('docs/rozklad-2026-2027.json'));
const skipped=rows.find(r=>r.klasa===1&&r.lp===8);skipped.note='Decyzja nauczyciela 6.11.2026: pomijamy osobną lekcję projektu; e-usługi w lekcji 09.';
fs.writeFileSync('docs/rozklad-2026-2027.json',JSON.stringify(rows,null,2)+'\n');
let md='# Rozkład tematów 2026/2027 — stan po integracji 6.11.2026\n\nŹródło: szkolny rozkład MIGRA klas 1–2 i dziennik VULCAN klasy 3, PP 2024 LO/technikum, Python. Tematy są zachowane w danych JSON. Projekt e-usług klasy 1 pomijamy decyzją nauczyciela. Sprawdziany pozostają poza platformą.\n\n';
for(const grade of [1,2,3]){md+='## Klasa '+grade+'\n\n| Temat | Tytuł | Stan | ID / uwagi |\n|---|---|---|---|\n';for(const r of rows.filter(r=>r.klasa===grade))md+=`| ${r.lp} | ${r.temat} | ${grade===1&&r.lp===8?'pominięty':r.status} | ${(r.ids||[]).join(', ')} ${r.note||''} |\n`;md+='\n';}
md+='## Kolejne prace\n\nPozostaje grafika 3D: klasa 2 tematy 1–7, klasa 3 tematy 11–15. Nowa preferencja nauczyciela: proste modelowanie online i eksport do druku 3D; narzędzie oraz zadania wymagają nowego opracowania.\n';
fs.writeFileSync('docs/rozklad-2026-2027.md',md);
let table='# Mapa lekcji — PP 2024 LO/technikum\n\nStan 6.11.2026. Pozycja w klasie liczy istniejące lekcje; order oznacza temat rozkładu.\n\n';
for(const grade of [1,2,3]){table+='## Klasa '+grade+'\n\n| Pozycja / ID | Temat | Lekcja | PP | Dowód | Ograniczenia |\n|---|---|---|---|---|---|\n';for(const l of lessons.filter(l=>l.grade===grade)){const m=map.lessons.find(m=>m.lessonId===l.id);table+=`| ${m.numberInGrade} / ${l.id} | ${l.order} | [${l.title}](../../${l.file}) | ${m.requirements.join(', ')} | ${m.evidence.replaceAll('|','/')} | ${m.limitations.replaceAll('|','/')} |\n`;}table+='\n';}
fs.writeFileSync('docs/podstawa-programowa/mapa-lekcji.md',table);
console.log(counts);
const readme='docs/podstawa-programowa/README.md';
fs.writeFileSync(readme,fs.readFileSync(readme,'utf8').replace('25.10.2026: 88 lekcji (klasy 1/2/3: 54/17/17)','6.11.2026: 108 lekcji (klasy 1/2/3: 60/23/25)'));
let coverage='# Pokrycie PP — stan 6.11.2026\n\n108 lekcji: klasy 60/23/25. Poniżej wskazano dowody ćwiczeń; przypisanie nie oznacza pełnej realizacji całego wymagania ani zaliczenia umiejętności przez ucznia. Szczegółowe ograniczenia każdej lekcji zawiera [mapa lekcji](mapa-lekcji.md).\n\n| Punkt PP | ID lekcji z dowodami |\n|---|---|\n';
const req=JSON.parse(fs.readFileSync('docs/podstawa-programowa/wymagania.json'));
for(const r of req.requirements)coverage+=`| ${r.id} | ${map.lessons.filter(l=>l.requirements.includes(r.id)).map(l=>l.lessonId).join(', ')||'Brak'} |\n`;
coverage+='\n## Otwarte ograniczenia\n\nGrafika 3D pozostaje nieopracowana. Grafika 2D i dokumenty wymagają oceny rzeczywistych plików; wersje alfa ArtCraft wymagają próby w pracowni. RobotLab to model edukacyjny, bez weryfikacji fizycznego montażu. Strony uczniów działają lokalnie, bez publikacji w internecie. Praktyczna obsługa urządzeń i różnych systemów operacyjnych wymaga potwierdzenia na sprzęcie. Kurs Demagoga jest zewnętrzny i jego ukończenie nie jest śledzone.\n';
fs.writeFileSync('docs/podstawa-programowa/pokrycie-i-python.md',coverage);
