import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import * as sc from '../content/sims/slideCritic.js';
import lesson75 from '../content/lessons/75-presentation-rules.js';
import lesson76 from '../content/lessons/76-chopin-presentation.js';
import {lessonScore,resultSources} from '../content/scoring.js';

// ---------- slideCritic: błędy na slajdach ----------
test('slideCritic: każdy slajd ma poprawny zestaw problemów z wyjaśnieniem i naprawą', () => {
 for (const [id, set] of Object.entries(sc.sets)) {
  assert.ok(set.offer.includes('ok'), `${id}: opcja „w porządku”`);
  assert.ok(set.slides.some(s => !s.issues.length), `${id}: co najmniej jeden dobry slajd`);
  const ids = new Set();
  for (const s of set.slides) {
   assert.ok(!ids.has(s.id)); ids.add(s.id);
   for (const i of s.issues) { assert.ok(set.offer.includes(i), `${s.id}: ${i} w ofercie`); assert.ok(s.why[i]?.length > 30, `${s.id}: wyjaśnienie ${i}`); }
   assert.ok(s.alt.length > 40 && s.fix.length > 30, `${s.id}: alt i naprawa`);
   const svg = sc.slideSvg(s);
   assert.match(svg, /^<svg [^>]*viewBox="0 0 960 540"/);
   assert.ok(!/undefined|NaN/.test(svg), `${s.id}: SVG bez undefined/NaN`);
   assert.ok(sc.slideDataUrl(s).startsWith('data:image/svg+xml'));
  }
  // w zestawie podstawowym każdy problem z oferty występuje na jakimś slajdzie; w „chopin” kontrast jest dystraktorem
  for (const i of set.offer.filter(i => i !== 'ok' && !(id === 'chopin' && i === 'contrast'))) assert.ok(set.slides.some(s => s.issues.includes(i)), `${id}: ${i} używany`);
 }
 assert.deepEqual(sc.sets.basics.slides.map(s => s.issues.length), [2, 2, 2, 0, 1]);
});

test('slideCritic: „w porządku” wyklucza inne zaznaczenia', () => {
 assert.deepEqual(sc.toggleIssue(['wall'], 'ok'), ['ok']);
 assert.deepEqual(sc.toggleIssue(['ok'], 'wall'), ['wall']);
 assert.deepEqual(sc.toggleIssue(['wall', 'small'], 'wall'), ['small']);
});

test('slideCritic: 2 pkt za pierwszą próbę, 1 po poprawce, podpowiedzi przy brakach i nadmiarze', () => {
 const set = sc.sets.basics, wifi = set.slides[0], pass = set.slides[3];
 let st = sc.checkSlide({sel: ['wall']}, wifi);
 assert.equal(st.ok, false); assert.deepEqual(st.missing, ['small']);
 assert.ok(sc.feedbackFor(wifi, st).some(t => t.includes('Brakuje')));
 st = sc.checkSlide({...st, sel: ['wall', 'small', 'anim']}, wifi);
 assert.deepEqual(st.extra, ['anim']); assert.ok(sc.feedbackFor(wifi, st)[0].includes('Za dużo animacji'));
 st = sc.checkSlide({...st, sel: ['wall', 'small']}, wifi);
 assert.equal(st.ok, true); assert.equal(st.tries, 3); assert.equal(sc.slidePoints(st), 1);
 assert.equal(sc.checkSlide(st, wifi), st, 'po zaliczeniu stan się nie zmienia');
 const good = sc.checkSlide({sel: ['ok']}, pass);
 assert.equal(sc.slidePoints(good), 2);
 const bad = sc.checkSlide({sel: ['contrast']}, pass);
 assert.ok(sc.feedbackFor(pass, bad).some(t => t.includes('dobry')));
 // pełne rozwiązanie
 const slides = Object.fromEntries(set.slides.map(s => [s.id, sc.checkSlide({sel: s.issues.length ? s.issues : ['ok']}, s)]));
 const r = sc.errorsResult('basics', {slides});
 assert.deepEqual([r.score, r.max, r.done], [10, 10, true]);
 assert.match(r.summary, /5\/5.*7\/7/);
 assert.equal(sc.errorsResult('chopin', {}).max, 8);
 assert.equal(sc.errorsResult('basics', {}).done, false);
});

test('slideCritic: dobór układu — 1 pkt za pierwszą próbę, 0,5 po poprawce', () => {
 assert.equal(new Set(sc.layoutTasks.map(t => t.answer)).size, sc.layouts.length, 'każdy układ jest odpowiedzią dokładnie raz');
 let v = {};
 v = sc.chooseLayout(v, 'firms', 'twoObj');
 assert.equal(v.tasks.firms.ok, false);
 assert.match(sc.layoutFeedback('firms', 'twoObj'), /nie pasuje/);
 v = sc.chooseLayout(v, 'firms', 'comparison');
 for (const t of sc.layoutTasks.filter(t => t.id !== 'firms')) v = sc.chooseLayout(v, t.id, t.answer);
 const r = sc.layoutResult(v);
 assert.deepEqual([r.score, r.max, r.done], [5.5, 6, true]);
 assert.equal(sc.chooseLayout(v, 'firms', 'title'), v, 'zaliczone zadanie jest zablokowane');
});

// ---------- lekcje 75–76 ----------
for (const l of [lesson75, lesson76]) test(`${l.id}: PowerPoint stacjonarny — plik, instrukcje, samoocena osobno od quizu`, async () => {
 assert.equal(l.grade, 1); assert.equal(l.workspace, 'desktop-powerpoint'); assert.equal(l.duration, 45);
 assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
 assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
 const all = l.sections.flatMap(s => s.activities), ids = new Set(all.map(a => a.id));
 assert.equal(ids.size, all.length);
 const dl = all.filter(a => a.type === 'download');
 assert.ok(dl.some(a => a.file === `materials/powerpoint/lesson-${l.id}-start.pptx`));
 for (const a of dl) {
  const file = new URL('../public/' + a.file, import.meta.url);
  assert.ok((await stat(file)).size > 1000, a.file);
  const bytes = await readFile(file);
  if (a.file.endsWith('.pptx')) assert.equal(bytes.subarray(0, 2).toString(), 'PK');
  if (a.file.endsWith('.png')) assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
 }
 for (const g of all.filter(a => a.type === 'wordSteps')) for (const s of g.steps) for (const k of ['title', 'instruction', 'check', 'help']) assert.ok(s[k]?.length > 5, `${g.id}: ${k}`);
 const rub = all.filter(a => a.type === 'wordRubric');
 assert.equal(rub.length, 1); assert.ok(rub[0].filename.endsWith('.pptx'));
 for (const c of rub[0].criteria) { assert.ok(Number.isInteger(c.points) && c.points > 0); assert.match(c.description, /^0:/); }
 const card = all.find(a => a.type === 'resultCard');
 assert.equal(card.hideGrade, true);
 const src = resultSources(l, card);
 for (const a of src) assert.ok(!['wordSteps', 'wordRubric', 'checklist', 'download', 'text'].includes(a.type), a.id);
 // maksimum: choice 1 pkt, symulatory wg swoich punktów
 const max = src.reduce((n, a) => n + (a.type === 'slideCritic' ? a.points : 1), 0);
 assert.equal(lessonScore(l, card, {}).max, max);
 assert.ok(all.some(a => a.type === 'text'), 'refleksja');
 for (const m of l.format.methods) assert.match(m.url, /^https:\/\/metodyka\.covepolska\.pl\/metoda-[a-z-]+\.html$/);
});

test('75: retrieval na starcie (wykres, licencja) i tytuły zgodne z rozkładem', () => {
 assert.equal(lesson75.order, 46); assert.equal(lesson76.order, 47);
 assert.equal(lesson75.title, 'Zasady tworzenia prezentacji multimedialnej');
 assert.equal(lesson76.title, 'Tworzymy prezentację multimedialną o Fryderyku Chopinie – projekt');
 assert.deepEqual(lesson75.sections[0].activities.map(a => a.id), ['p75-chart', 'p75-license']);
 assert.match(lesson76.teacherGuide.preparation, /DO WERYFIKACJI/);
});

test('Pliki PPTX: komplet części, liczba slajdów i układów, notatki w starterze 76', async () => {
 const unzip = async f => {
  // prosty odczyt katalogu centralnego ZIP (bez zależności)
  const b = await readFile(new URL('../public/materials/powerpoint/' + f, import.meta.url));
  const eocd = b.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const n = b.readUInt16LE(eocd + 10); let off = b.readUInt32LE(eocd + 16); const names = [];
  for (let i = 0; i < n; i++) { const len = b.readUInt16LE(off + 28), extra = b.readUInt16LE(off + 30), com = b.readUInt16LE(off + 32); names.push(b.subarray(off + 46, off + 46 + len).toString()); off += 46 + len + extra + com; }
  return names;
 };
 const p75 = await unzip('lesson-75-start.pptx'), p76 = await unzip('lesson-76-start.pptx');
 for (const names of [p75, p76]) {
  assert.equal(names[0], '[Content_Types].xml');
  for (const part of ['ppt/presentation.xml', 'ppt/slideMasters/slideMaster1.xml', 'ppt/theme/theme1.xml', 'ppt/notesMasters/notesMaster1.xml', '_rels/.rels']) assert.ok(names.includes(part), part);
 }
 assert.equal(p75.filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).length, 6);
 assert.equal(p75.filter(n => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(n)).length, 8);
 assert.ok(p75.includes('ppt/media/image1.png'));
 assert.equal(p75.filter(n => n.startsWith('ppt/notesSlides/') && n.endsWith('.xml')).length, 0, 'zła prezentacja nie ma notatek');
 assert.equal(p76.filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).length, 8);
 assert.equal(p76.filter(n => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(n)).length, 15);
 assert.equal(p76.filter(n => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n)).length, 8);
});
