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
md+='## Realizacja i kontrola\n\nGrafika 3D: Tinkercad online, autorskie tematy dopasowane do II.3.a, lokalny druk wybranych prac na H2C. Pierwotne tytuły rozkładu pozostają w polu originalTitle JSON. Gotowość scenariusza nie oznacza zaliczenia umiejętności przez ucznia; nauczyciel ocenia model i eksport. Projekt e-usług pominięty, dwa sprawdziany poza platformą.\n';
fs.writeFileSync('docs/rozklad-2026-2027.md',md);
let table='# Mapa lekcji — PP 2024 LO/technikum\n\nStan 6.11.2026. Pozycja w klasie liczy istniejące lekcje; order oznacza temat rozkładu.\n\n';
for(const grade of [1,2,3]){table+='## Klasa '+grade+'\n\n| Pozycja / ID | Temat | Lekcja | PP | Dowód | Ograniczenia |\n|---|---|---|---|---|---|\n';for(const l of lessons.filter(l=>l.grade===grade)){const m=map.lessons.find(m=>m.lessonId===l.id);table+=`| ${m.numberInGrade} / ${l.id} | ${l.order} | [${l.title}](../../${l.file}) | ${m.requirements.join(', ')} | ${m.evidence.replaceAll('|','/')} | ${m.limitations.replaceAll('|','/')} |\n`;}table+='\n';}
fs.writeFileSync('docs/podstawa-programowa/mapa-lekcji.md',table);
console.log(counts);
const readme='docs/podstawa-programowa/README.md';
fs.writeFileSync(readme,fs.readFileSync(readme,'utf8').replace(/Mapa ćwiczeń zaktualizowana [^\n]*?lekcji \(klasy 1\/2\/3: [^)]*\)\./,`Mapa ćwiczeń zaktualizowana 6.11.2026: ${lessons.length} lekcji (klasy 1/2/3: ${counts[1]}/${counts[2]}/${counts[3]}).`));
let coverage=`# Pokrycie PP — stan 6.11.2026\n\n${lessons.length} lekcji: klasy ${counts[1]}/${counts[2]}/${counts[3]}. Poniżej wskazano dowody ćwiczeń; przypisanie nie oznacza pełnej realizacji całego wymagania ani zaliczenia umiejętności przez ucznia. Szczegółowe ograniczenia każdej lekcji zawiera [mapa lekcji](mapa-lekcji.md).\n\n| Punkt PP | ID lekcji z dowodami |\n|---|---|\n`;
const req=JSON.parse(fs.readFileSync('docs/podstawa-programowa/wymagania.json'));
for(const r of req.requirements)coverage+=`| ${r.id} | ${map.lessons.filter(l=>l.requirements.includes(r.id)).map(l=>l.lessonId).join(', ')||'Brak'} |\n`;
coverage+='\n## Otwarte ograniczenia\n\nModele 2D/3D i dokumenty wymagają oceny rzeczywistych prac; wersje alfa ArtCraft wymagają próby w pracowni. Tinkercad wymaga dostępu do usługi i chmury; eksport STL nie potwierdza fizycznego wydruku. RobotLab to model edukacyjny, bez weryfikacji fizycznego montażu. Strony uczniów działają lokalnie, bez publikacji w internecie. Praktyczna obsługa urządzeń i różnych systemów operacyjnych wymaga potwierdzenia na sprzęcie. Kurs Demagoga jest zewnętrzny i jego ukończenie nie jest śledzone.\n';
fs.writeFileSync('docs/podstawa-programowa/pokrycie-i-python.md',coverage);
