import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateRawSync} from 'node:zlib';
import * as S from '../content/sims/sheetCheck.js';
import {lessonScore, resultSources} from '../content/scoring.js';

const ids = ['69', '70', '71', '72', '73', '74'];
const files = {'69':'69-excel-formulas', '70':'70-excel-functions', '71':'71-excel-charts', '72':'72-excel-geography', '73':'73-excel-pivot', '74':'74-excel-pivot-guide'};
const lessons = Object.fromEntries(await Promise.all(ids.map(async id => [id, (await import(`../content/lessons/${files[id]}.js`)).default])));

// ---------- minimalny czytnik XLSX (ZIP + XML), bez zależności ----------
function unzip(buf) {
 const out = {};
 let eocd = buf.length - 22;
 while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
 const n = buf.readUInt16LE(eocd + 10);
 let p = buf.readUInt32LE(eocd + 16);
 for (let i = 0; i < n; i++) {
  const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20), nameLen = buf.readUInt16LE(p + 28), extra = buf.readUInt16LE(p + 30), comment = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
  const name = buf.subarray(p + 46, p + 46 + nameLen).toString('utf8');
  const lh = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
  const data = buf.subarray(lh, lh + size);
  out[name] = (method === 8 ? inflateRawSync(data) : data).toString('utf8');
  p += 46 + nameLen + extra + comment;
 }
 return out;
}
const unxml = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function readBook(path) {
 const z = unzip(readFileSync(new URL(`../public/${path}`, import.meta.url)));
 const strings = [...(z['xl/sharedStrings.xml'] || '').matchAll(/<si><t[^>]*>([\s\S]*?)<\/t><\/si>/g)].map(m => unxml(m[1]));
 const names = [...z['xl/workbook.xml'].matchAll(/<sheet name="([^"]+)"/g)].map(m => unxml(m[1]));
 const book = {};
 names.forEach((name, i) => {
  const cells = {}, formulas = [];
  for (const m of z[`xl/worksheets/sheet${i + 1}.xml`].matchAll(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
   const [, ref, attrs, inner = ''] = m;
   if (/<f>/.test(inner)) formulas.push(ref);
   const v = inner.match(/<v>([^<]*)<\/v>/)?.[1];
   if (v === undefined) continue;
   cells[ref] = /t="s"/.test(attrs) ? {text:strings[Number(v)]} : {num:Number(v)};
  }
  book[name] = {cells, formulas, num:r => cells[r]?.num, text:r => cells[r]?.text, val:r => cells[r]?.num ?? cells[r]?.text};
 });
 return {book, parts:Object.keys(z), z};
}
const books = Object.fromEntries(ids.map(id => [id, readBook(`materials/excel/lesson-${id}-start.xlsx`)]));
const col = (sh, c, from, to) => Array.from({length:to - from + 1}, (_, i) => sh.val(`${c}${from + i}`));
const round = (x, d) => Math.round((x + Number.EPSILON) * 10 ** d) / 10 ** d;
const sum = a => a.reduce((s, x) => s + x, 0);

// ---------- oczekiwane wartości liczone z plików (to samo, co uczeń policzy w Excelu) ----------
function expected69() {
 const w = books['69'].book['Wypłata'];
 const hours = col(w, 'C', 5, 14).map(Number), rate = col(w, 'D', 5, 14);
 const pay = round(sum(hours.map((h, i) => h * rate[i])), 2);
 return {'x69-check':{e5:round(hours[0] * rate[0], 2), e15:pay, c15:sum(hours), h7:round(pay - w.num('H6'), 2), h8:Math.round((pay - w.num('H6')) / pay * 100)}};
}
function expected70() {
 const t = books['70'].book['Turniej'], p = books['70'].book['Prąd'];
 const rows = Array.from({length:10}, (_, i) => ['B', 'C', 'D', 'E'].map(c => t.num(`${c}${5 + i}`)).filter(v => v !== undefined));
 const sums = rows.map(sum), all = rows.flat();
 const zuza = rows[t.text('A6') === 'Zuza' ? 1 : -1];
 const price = p.num('B4');
 const cost = Array.from({length:5}, (_, i) => round(p.num(`B${7 + i}`) * p.num(`C${7 + i}`) * 30 / 1000 * price, 2));
 return {
  'x70-check':{g6:round(sum(zuza) / zuza.length, 1), k5:Math.max(...sums), k6:Math.min(...sums), k7:all.length, k8:sums.filter(s => s >= 20).length, k9:round(sum(all) / all.length, 1)},
  'x70-power':{e11:cost[4], e12:round(sum(cost), 2)}
 };
}
function expected71() {
 const b = books['71'].book, a = b['Abonamenty'], w = b['Wydatki'], k = b['Kanał'];
 const tot = [5, 6, 7].map(r => a.num(`B${r}`) * 24 + a.num(`C${r}`));
 const spend = col(w, 'B', 5, 10), ubr = spend[col(w, 'A', 5, 10).indexOf('Ubrania')];
 const fol = col(k, 'B', 5, 10), drop = fol.findIndex((v, i) => i > 0 && v < fol[i - 1]);
 return {'x71-check':{e6:tot[1], e9:Math.max(...tot) - Math.min(...tot), pie:Math.round(ubr / sum(spend) * 100), drop:k.text(`A${5 + drop}`)}, 'x71-lie':{diff:tot[2] - tot[0]}};
}
function expected72() {
 const k = books['72'].book['Klimat'];
 const temp = col(k, 'B', 5, 16), rain = col(k, 'C', 5, 16), months = col(k, 'A', 5, 16);
 return {
  'x72-check':{b18:sum(rain), b19:round(sum(temp) / 12, 1), b20:round(Math.max(...temp) - Math.min(...temp), 1), b21:temp.filter(t => t < 0).length},
  'x72-read':{wet:months[rain.indexOf(Math.max(...rain))], dry:months[rain.indexOf(Math.min(...rain))]}
 };
}
function rows73() {
 const s = books['73'].book['Zamówienia'];
 const out = [];
 for (let r = 5; s.val(`A${r}`) !== undefined; r++) out.push({nr:s.text(`A${r}`), cat:s.text(`D${r}`), qty:s.num(`E${r}`), price:s.num(`F${r}`), value:s.num(`G${r}`), city:s.text(`H${r}`), del:s.text(`I${r}`)});
 return out;
}
function expected73() {
 const o = rows73(), g = o.filter(x => x.cat === 'Gaming');
 return {
  'x73-check':{sum:sum(o.map(x => x.value)), gcount:g.length, gsum:sum(g.map(x => x.value)), big:o.filter(x => x.value > 200).length, both:g.filter(x => x.del === 'Automat paczkowy').length},
  'x73-pivot':{komp:sum(o.filter(x => x.cat === 'Komputery').map(x => x.value)), tarn:o.filter(x => x.city === 'Tarnów').length}
 };
}
function rows74() {
 const s = books['74'].book['Wydatki'];
 const out = [];
 for (let r = 5; s.val(`A${r}`) !== undefined; r++) out.push({day:s.text(`B${r}`), cat:s.text(`C${r}`), who:s.text(`E${r}`), amount:s.num(`F${r}`)});
 return out;
}
function expected74() {
 const t = rows74(), total = sum(t.map(x => x.amount)), people = books['74'].book['Poradnik'].num('B11');
 const sat = t.filter(x => x.day === 'sobota');
 return {
  'x74-check':{total, sat:sum(sat.map(x => x.amount)), satatr:sum(sat.filter(x => x.cat === 'Atrakcje').map(x => x.amount)), ania:sum(t.filter(x => x.cat === 'Jedzenie' && x.who.startsWith('Ania')).map(x => x.amount)), teach:sum(t.filter(x => x.who === 'Wychowawczyni').map(x => x.amount))},
  'x74-person':{b12:round(total / people, 2)}
 };
}
const expected = {'69':expected69(), '70':expected70(), '71':expected71(), '72':expected72(), '73':expected73(), '74':expected74()};
const sheetChecks = l => l.sections.flatMap(s => s.activities).filter(a => a.type === 'sheetCheck');

// ---------- pliki ----------
test('XLSX: pliki startowe są poprawnymi pakietami z arkuszami, bez formuł do wpisania przez ucznia', () => {
 for (const id of ids) {
  const {parts, z, book} = books[id];
  for (const p of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/styles.xml', 'xl/sharedStrings.xml', 'xl/_rels/workbook.xml.rels']) assert.ok(parts.includes(p), `${id}: ${p}`);
  assert.equal(readFileSync(new URL(`../public/materials/excel/lesson-${id}-start.xlsx`, import.meta.url)).subarray(0, 2).toString(), 'PK');
  for (const sh of Object.values(book)) assert.equal(sh.formulas.length, 0, `${id}: starter nie zawiera formuł`);
  assert.match(z['xl/workbook.xml'], /fullCalcOnLoad="1"/);
  for (const n of Object.keys(book)) assert.ok(n.length <= 31 && !/[\\/?*[\]:]/.test(n), `${id}: nazwa arkusza ${n}`);
 }
 const manifest = JSON.parse(readFileSync(new URL('../public/materials/excel/manifest.json', import.meta.url), 'utf8'));
 assert.deepEqual(manifest.files.map(f => f.lesson), ids);
});

test('XLSX: zaplanowane pułapki w danych są na miejscu', () => {
 const w = books['69'].book['Wypłata'];
 assert.equal(w.text('C13'), '6', 'C13 to liczba zapisana jako tekst');
 assert.equal(w.num('A5'), 46204, 'data jako liczba seryjna (1.07.2026) w formacie Ogólny');
 assert.equal(books['69'].book['Wypłata'].cells.E5, undefined, 'E5 puste do uzupełnienia');
 const t = books['70'].book['Turniej'];
 assert.equal(t.val('D6'), undefined, 'Zuza nie grała w meczu 3');
 assert.equal(t.num('B14'), 0, 'Igor ma 0 (liczba) w meczu 1');
 assert.equal(t.num('B6') + t.num('C6') + t.num('E6'), 20, 'Zuza ma dokładnie 20 pkt');
 const p = books['70'].book['Prąd'];
 assert.equal(p.val('B5'), undefined, 'pod ceną pusta komórka — bez $ kopiowanie daje 0');
 assert.equal(p.num('B8'), 100, 'bez $ router mnoży przez moc telewizora');
 assert.equal(round(p.num('B11') * p.num('C11') * 30 / 1000 * p.num('B8'), 2), 720, 'pułapka 720 zł w lekcji 70');
 const k = books['72'].book['Klimat'];
 assert.match(k.text('A2'), /IMGW-PIB.*1991–2020/);
 assert.match(books['72'].book['Województwa'].text('A2'), /GUS/);
 assert.equal(books['73'].book['Zamówienia'].val('A3'), undefined, 'pusty wiersz nad nagłówkiem — Ctrl+T rozpoznaje zakres');
 assert.equal(rows73().length, 40);
 for (const o of rows73()) assert.equal(o.value, o.qty * o.price, o.nr);
 assert.equal(rows74().length, 19);
});

// ---------- zgodność lekcji z plikami ----------
test('Lekcje 69–74: każda wartość „wpisz wynik z komórki” zgadza się z danymi pliku', () => {
 for (const id of ids) {
  const exp = expected[id];
  const checks = sheetChecks(lessons[id]).filter(a => a.phase === 'excel' || exp[a.id]);
  for (const [actId, tasks] of Object.entries(exp)) {
   const a = sheetChecks(lessons[id]).find(x => x.id === actId);
   assert.ok(a, `${id}: brak ${actId}`);
   for (const [taskId, value] of Object.entries(tasks)) {
    const t = a.tasks.find(x => x.id === taskId);
    assert.ok(t, `${actId}.${taskId}`);
    if (t.kind === 'text') assert.equal(S.evaluate(t, value).kind, 'ok', `${actId}.${taskId}: ${value}`);
    else assert.ok(Math.abs(t.answer - value) < 1e-9, `${actId}.${taskId}: lekcja ${t.answer}, plik ${value}`);
   }
  }
  for (const a of checks.filter(x => x.phase === 'excel')) assert.ok(exp[a.id], `${id}: ${a.id} ma wyliczenie w teście`);
 }
});

test('Lekcje 69–74: pułapki nie pokrywają się z poprawną odpowiedzią i każda daje diagnozę', () => {
 for (const id of ids) for (const a of sheetChecks(lessons[id])) {
  assert.equal(a.points, a.tasks.length);
  assert.ok(a.title && a.tasks.length >= 1);
  for (const t of a.tasks) {
   assert.equal(S.evaluate(t, S.answerText(t).replace(/ /g, ' ')).kind, 'ok', `${a.id}.${t.id}: tekst rozwiązania jest akceptowany`);
   assert.ok(t.hint && t.explain && t.prompt, `${a.id}.${t.id}: hint/explain/prompt`);
   for (const tr of t.traps || []) {
    const samples = tr.formula ? [tr.formula] : tr.text !== undefined ? [].concat(tr.text) : [].concat(tr.value).map(v => String(v).replace('.', ','));
    for (const sample of samples) {
     const r = S.evaluate(t, sample);
     assert.equal(r.kind, 'trap', `${a.id}.${t.id}: pułapka ${sample} → ${r.kind}`);
     assert.ok(r.message.length > 20);
    }
   }
  }
 }
});

// ---------- logika sheetCheck ----------
test('sheetCheck: liczby po polsku, jednostki, procenty i formuły z ; lub ,', () => {
 assert.equal(S.parseNumber('2 051,80 zł'), 2051.8);
 assert.equal(S.parseNumber('1.234,5'), 1234.5);
 assert.equal(S.parseNumber('−1,8'), -1.8);
 assert.equal(S.parseNumber('62%'), 62);
 assert.equal(S.parseNumber('6,7 °C'), 6.7);
 assert.equal(S.parseNumber('abc'), null);
 assert.equal(S.parseNumber(''), null);
 const pct = {answer:62, tol:0.5, alt:[{value:0.62, tol:0.005}]};
 for (const ok of ['62', '62%', '0,62', '61,98']) assert.equal(S.evaluate(pct, ok).kind, 'ok', ok);
 assert.equal(S.evaluate(pct, 'dużo').kind, 'invalid');
 const f = {kind:'formula', answer:'=B4*$B$1', accept:['=B4*B$1']};
 assert.equal(S.evaluate(f, '= b4 * $b$1').kind, 'ok');
 assert.equal(S.evaluate(f, 'B4*$B$1').kind, 'invalid', 'bez = to nie formuła');
 assert.equal(S.evaluate(f, '=B4*B1').kind, 'wrong');
 const round1 = {kind:'formula', answer:'=ZAOKR(G5;1)'};
 const r = S.evaluate(round1, '=zaokr(G5,1)');
 assert.equal(r.kind, 'ok');
 assert.match(r.message, /średnikiem/);
 assert.equal(S.evaluate({kind:'text', answer:'kwiecień'}, ' Kwiecien ').kind, 'ok');
 assert.equal(S.formatNumber(1271.8), '1 271,8');
});

test('sheetCheck: 1 pkt za pierwszą próbę, 0,5 po poprawce, 0 po odsłonięciu; done po zamknięciu wszystkich', () => {
 const data = S.sheetCheck('t', {phase:'excel', tasks:[{id:'a', answer:10, hint:'x', explain:'y', prompt:'p'}, {id:'b', answer:5, hint:'x', explain:'y', prompt:'p'}, {id:'c', answer:1, hint:'x', explain:'y', prompt:'p'}]});
 assert.equal(data.points, 3);
 let v = {};
 v = S.setTask(data, v, 'a', S.answerTask(undefined, data.tasks[0], '10'));
 assert.deepEqual([v.score, v.done], [1, false]);
 let b = S.answerTask(undefined, data.tasks[1], '');
 assert.equal(b.tries, undefined, 'pusta odpowiedź nie zużywa próby');
 b = S.answerTask(b, data.tasks[1], '4');
 assert.equal(S.revealTask(b), b, 'odsłonięcie dopiero po 2 błędach');
 b = S.answerTask(b, data.tasks[1], '5');
 v = S.setTask(data, v, 'b', b);
 assert.equal(v.score, 1.5);
 let c = S.answerTask(undefined, data.tasks[2], '2');
 c = S.answerTask(c, data.tasks[2], '3');
 c = S.revealTask(c);
 assert.equal(c.revealed, true);
 assert.equal(S.answerTask(c, data.tasks[2], '1'), c, 'po odsłonięciu zadanie zamknięte');
 v = S.setTask(data, v, 'c', c);
 assert.deepEqual([v.score, v.max, v.done], [1.5, 3, true]);
 assert.match(v.summary, /2\/3/);
 assert.deepEqual(S.sheetResult(data, undefined), {done:false, score:0, max:3, summary:'Wyniki z pliku: 0/3 poprawnie'});
});

// ---------- struktura lekcji ----------
test('Lekcje 69–74: klasa 1, tematy 40–45, Excel, pliki, instrukcje, samoocena i karta bez oceny', async () => {
 const titles = ['Tworzenie formuł, formaty danych i formatowanie tabeli arkusza', 'Stosowanie funkcji arkusza kalkulacyjnego', 'Przedstawianie danych w postaci wykresu', 'Tworzenie wykresu – projekt z geografii', 'Korzystanie z filtrów, tabele i wykresy przestawne', 'Stosowanie filtru w tabeli przestawnej i praktyczny poradnik'];
 const methods = new Set();
 ids.forEach((id, i) => {
  const l = lessons[id];
  assert.equal(l.id, id); assert.equal(l.grade, 1); assert.equal(l.order, 40 + i); assert.equal(l.title, titles[i]);
  assert.equal(l.workspace, 'desktop-excel'); assert.equal(l.duration, 45);
  assert.equal(sum(l.sections.map(s => s.duration)), 45);
  assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
  assert.match(l.curriculum, /II\.2/); assert.match(l.curriculum, /II\.3\.c/);
  if (id === '72') { assert.match(l.curriculum, /IV\.1/); assert.match(l.teacherGuide.preparation, /DO WERYFIKACJI/); }
  l.format.methods.forEach(m => methods.add(m.name));
  const all = l.sections.flatMap(s => s.activities);
  assert.equal(new Set(all.map(a => a.id)).size, all.length);
  assert.ok(l.sections[0].activities.some(a => a.type === 'choice'), 'retrieval na starcie');
  const dl = all.filter(a => a.type === 'download');
  assert.ok(dl.some(a => a.file === `materials/excel/lesson-${id}-start.xlsx`));
  for (const g of all.filter(a => a.type === 'wordSteps')) for (const s of g.steps) for (const k of ['title', 'instruction', 'check', 'help']) assert.ok(s[k]?.length > (k === 'title' ? 2 : 10), `${g.id} ${k}`);
  const rub = all.filter(a => a.type === 'wordRubric');
  assert.equal(rub.length, 1);
  assert.ok(rub[0].filename.endsWith('.xlsx'));
  for (const c of rub[0].criteria) { assert.ok(Number.isInteger(c.points) && c.points > 0); assert.ok(c.description.length > 30); }
  const card = all.find(a => a.type === 'resultCard');
  assert.equal(card.hideGrade, true);
  const src = resultSources(l, card);
  assert.ok(src.some(a => a.type === 'sheetCheck'), 'karta liczy kontrolę wyniku z pliku');
  for (const a of src) assert.ok(!['wordSteps', 'wordRubric', 'checklist', 'download', 'text'].includes(a.type));
  assert.ok(all.some(a => a.type === 'text'), 'refleksja');
  assert.ok(l.sections.at(-1).activities.some(a => a.type === 'resultCard'));
 });
 assert.ok(methods.size >= 7, `różne metody COVE: ${[...methods]}`);
});

test('Lekcje 69–74: przejście z poprawnymi odpowiedziami daje maksimum karty wyniku', () => {
 for (const id of ids) {
  const l = lessons[id], all = l.sections.flatMap(s => s.activities), answers = {};
  for (const a of all) {
   if (a.type === 'choice') answers[a.id] = {selected:a.correct[0], done:true, first:true};
   if (a.type === 'matching') answers[a.id] = {done:true};
   if (a.type === 'sheetCheck') {
    let v = {};
    for (const t of a.tasks) v = S.setTask(a, v, t.id, S.answerTask(undefined, t, S.answerText(t)));
    assert.equal(v.score, a.tasks.length); assert.equal(v.done, true);
    answers[a.id] = v;
   }
  }
  const card = all.find(a => a.type === 'resultCard');
  const r = lessonScore(l, card, answers);
  assert.equal(r.score, r.max, `${id}: ${r.score}/${r.max}`);
  assert.equal(lessonScore(l, card, {}).score, 0);
 }
});
