// Testy sprawdzarki DOCX (docxCheck) dla lekcji Worda 28–33.
// Pliki „rozwiązane” i błędne: tests/fixtures/docx/ (generator: scripts/build-docx-fixtures.py).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {checkDocx, evaluate, KINDS, resultValue, savedResults, docxMax, has, outline, DocxError} from '../content/sims/docxCheck.js';
import {readDocx, styleKey, styleLabel} from '../content/sims/docx/model.js';
import {parseXml, kids} from '../content/sims/docx/xml.js';

const root = new URL('../', import.meta.url);
const fx = name => readFile(new URL('tests/fixtures/docx/' + name, root));
const starter = n => readFile(new URL(`public/materials/word/lesson-${n}-start.docx`, root));
const files = {28: '28-word-styles', 29: '29-word-toc', 30: '30-word-captions', 31: '31-word-sections', 32: '32-word-review', 33: '33-word-guide'};
const lessons = {};
const acts = {};
for (const [n, f] of Object.entries(files)) {
 lessons[n] = (await import(`../content/lessons/${f}.js`)).default;
 for (const a of lessons[n].sections.flatMap(s => s.activities)) if (a.type === 'docxCheck') acts[a.id] = {...a, lesson: n};
}
const run = async (id, bytes, name = 'plik.docx') => checkDocx(bytes, acts[id], name);
const passed = r => r.results.filter(x => x.ok).map(x => x.id).sort();
const failed = r => r.results.filter(x => !x.ok).map(x => x.id).sort();

// ——— Dane lekcji ———
test('Każda lekcja 28–33 ma sprawdzarkę pliku przed rubryką i w źródłach karty wyniku', () => {
 for (const [n, l] of Object.entries(lessons)) {
  const all = l.sections.flatMap(s => s.activities);
  const checks = all.filter(a => a.type === 'docxCheck');
  assert.ok(checks.length >= 1, `lekcja ${n}`);
  const card = all.find(a => a.type === 'resultCard');
  for (const a of checks) {
   const sec = l.sections.find(s => s.activities.includes(a));
   const rubric = sec.activities.findIndex(x => x.type === 'wordRubric');
   assert.ok(rubric > sec.activities.indexOf(a), `${a.id}: przed wordRubric w tym samym etapie`);
   assert.ok(card.sources.includes(a.id), `${a.id} w sources`);
   assert.equal(a.points, docxMax(a), `${a.id}: points = suma punktów sprawdzeń`);
   assert.equal(new Set(a.checks.map(c => c.id)).size, a.checks.length);
   for (const c of a.checks) {
    assert.ok(KINDS[c.kind], `${a.id}/${c.id}: znany rodzaj ${c.kind}`);
    assert.ok(c.label.length > 8 && c.points > 0);
    assert.ok((c.hint || KINDS[c.kind].hint(c)).length > 20, 'wskazówka po polsku');
   }
  }
 }
});

// ——— Pliki startowe nie zaliczają (poza tym, co już w nich jest), rozwiązane zaliczają wszystko ———
const START_OK = {'w28-docx': ['normal-style', 'title'], 'w33-docx': ['clean', 'manual', 'no-fake', 'title']};
const SOLVED = {'w28-docx': ['28-solved.docx', '28-solved-pl.docx'], 'w29-docx': ['29-solved.docx'], 'w30-docx': ['30-solved.docx'], 'w31-docx': ['31-solved.docx'],
 'w32-docx': ['32-recenzja.docx'], 'w32-docx-pub': ['32-publikacja.docx'], 'w33-docx-review': ['33-recenzja.docx'], 'w33-docx': ['33-solved.docx']};
for (const id of Object.keys(SOLVED)) {
 test(`${id}: plik startowy nie zalicza zadań`, async () => {
  const r = await run(id, await starter(acts[id].lesson), `lesson-${acts[id].lesson}-start.docx`);
  assert.deepEqual(passed(r), START_OK[id] || []);
  assert.ok(r.score < r.max);
  assert.equal(r.warning, '');
  for (const x of r.results.filter(x => !x.ok)) { assert.ok(x.detail.length > 10, `${x.id}: opis`); assert.ok(x.hint.length > 20); }
 });
 for (const f of SOLVED[id]) test(`${id}: rozwiązany ${f} zalicza wszystko`, async () => {
  const r = await run(id, await fx(f), f);
  assert.deepEqual(failed(r), [], r.results.filter(x => !x.ok).map(x => `${x.id}: ${x.detail}`).join('\n'));
  assert.equal(r.score, r.max);
 });
}

// ——— Typowe błędy ———
test('Zmieniony tytuł rozdziału bez aktualizacji spisu → ✗ aktualność spisu (reszta zaliczona)', async () => {
 const r = await run('w29-docx', await fx('29-stale-toc.docx'));
 assert.deepEqual(failed(r), ['toc-current']);
 const d = r.results.find(x => x.id === 'toc-current').detail;
 assert.match(d, /nieaktualny wpis: „Cel wydarzenia”/);
 assert.match(d, /Brakuje w spisie: .*Kontakt do organizatora/);
 assert.match(r.results.find(x => x.id === 'toc-current').hint, /Aktualizuj cały spis/);
});
test('Ręcznie wpisany numer strony w stopce → ✗ (również w kontroli ręcznych numerów)', async () => {
 const r = await run('w28-docx', await fx('28-manual-page.docx'));
 assert.deepEqual(failed(r), ['footer']);
 assert.match(r.results.find(x => x.id === 'footer').detail, /wpisano ręcznie/);
 const m = await readDocx(await fx('28-manual-page.docx'));
 assert.equal(KINDS.noManualPageNumbers.run(m, {}).ok, false);
 assert.equal(KINDS.noManualPageNumbers.run(await readDocx(await fx('28-solved.docx')), {}).ok, true);
});
test('Pogrubiony Normalny zamiast Nagłówka 1 → ✗ nagłówki i „udawane nagłówki”', async () => {
 const r = await run('w28-docx', await fx('28-fake-heading.docx'));
 assert.deepEqual(failed(r), ['h1', 'no-fake']);
 assert.match(r.results.find(x => x.id === 'h1').detail, /„Jak sprawdzimy efekty” — ma styl Normalny/);
 assert.ok(r.results.find(x => x.id === 'no-fake').targets.length === 1, 'podświetlenie miejsca w podglądzie');
});
test('Recenzja to nie kopia publikacyjna: komentarze i zmiany → ✗ cleanCopy', async () => {
 const r = await run('w32-docx-pub', await fx('32-recenzja.docx'));
 assert.ok(failed(r).includes('clean'));
 assert.match(r.results.find(x => x.id === 'clean').detail, /4 komentarze, 11 zmian śledzonych/);
});
test('Poprawka bez śledzenia zmian jest rozpoznana (kopia publikacyjna jako recenzja)', async () => {
 const r = await run('w32-docx', await fx('32-publikacja.docx'));
 assert.match(r.results.find(x => x.id === 'free').detail, /bez śledzenia zmian/);
 assert.match(r.results.find(x => x.id === 'cert').detail, /usunięto bez śledzenia/);
});
test('Plik z innej lekcji: ostrzeżenie', async () => {
 const r = await run('w31-docx', await starter(28));
 assert.match(r.warning, /nie wygląda na dokument z tej lekcji/);
});

// ——— Nierozpoznane i uszkodzone pliki ———
const code = async (bytes, name = 'x.docx') => { try { await readDocx(bytes, {fileName: name}); return 'ok'; } catch (e) { assert.ok(e instanceof DocxError); assert.ok(e.message.length > 30); return e.code; } };
test('Uszkodzony ZIP, .doc, PDF, Excel, pusty plik, plik tymczasowy ~$ → czytelny komunikat', async () => {
 assert.equal(await code(await fx('broken.docx')), 'corrupt');
 assert.equal(await code(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0, 0, 0])), 'doc');
 assert.equal(await code(new TextEncoder().encode('%PDF-1.7 …')), 'pdf');
 assert.equal(await code(new TextEncoder().encode('{\\rtf1 tekst}')), 'rtf');
 assert.equal(await code(await fx('not-word.xlsx')), 'xlsx');
 assert.equal(await code(new Uint8Array()), 'empty');
 assert.equal(await code(new TextEncoder().encode('zwykły tekst, nie docx')), 'notZip');
 assert.equal(await code(await fx('28-solved.docx'), '~$son-28.docx'), 'lock');
 // ZIP z uszkodzonym strumieniem deflate
 const bad = new Uint8Array(await fx('28-solved.docx'));
 const i = Buffer.from(bad).indexOf('word/document.xml');
 bad.fill(0x55, i + 30, i + 400);
 assert.equal(await code(bad), 'corrupt');
});

// ——— Nazwy stylów ———
test('Styl rozpoznawany po nazwie (ang. i pol.), a gdy jej brak — po identyfikatorze', async () => {
 assert.equal(styleKey('heading 1', 'Heading1'), 'heading 1');
 assert.equal(styleKey('Heading 2', 'Heading2'), 'heading 2');
 assert.equal(styleKey('Nagłówek 1', 'Nagwek1'), 'heading 1');
 assert.equal(styleKey('', 'Nagwek2'), 'heading 2');
 assert.equal(styleKey('Tytuł', 'Tytu'), 'title');
 assert.equal(styleKey('title', 'Title'), 'title');
 assert.equal(styleKey('caption', 'Caption'), 'caption');
 assert.equal(styleKey('Legenda', 'Legenda'), 'caption');
 assert.equal(styleKey('Normalny', 'Normalny'), 'normal');
 assert.equal(styleKey('toc 2', 'TOC2'), 'toc 2');
 assert.equal(styleKey('Spis treści 1', 'Spistreci1'), 'toc 1');
 assert.equal(styleKey('Mój rozdział', 'Heading1'), 'moj rozdzial', 'własna nazwa nie udaje wbudowanego stylu');
 assert.equal(styleLabel('heading 3'), 'Nagłówek 3');
 const pl = await readDocx(await fx('28-solved-pl.docx'));
 const h = pl.paragraphs.find(p => p.text === 'Zasady współpracy');
 assert.equal(h.styleId, 'Nagwek1');
 assert.equal(h.styleKey, 'heading 1');
 assert.equal(h.styleName, 'Nagłówek 1');
 assert.equal(outline(pl).length, 6);
});
test('Archiwum z metodą 0 (bez kompresji) i 8 (deflate) w jednym pliku', async () => {
 const b = Buffer.from(await fx('28-solved-pl.docx'));
 const methods = new Set();
 for (let i = b.indexOf('PK\x01\x02'); i >= 0; i = b.indexOf('PK\x01\x02', i + 4)) methods.add(b.readUInt16LE(i + 10));
 assert.deepEqual([...methods].sort(), [0, 8]);
 const m = await readDocx(b);
 assert.ok(m.parts['word/footer1.xml'].fields.some(f => f.type === 'PAGE'), 'pole proste fldSimple');
});

// ——— Model: struktury Worda ———
test('Model: sekcje, nagłówki z dziedziczeniem, pola, komentarze, zmiany', async () => {
 const s = await readDocx(await fx('31-solved.docx'));
 assert.deepEqual(s.sections.map(x => [x.landscape, x.cols, x.start]), [[false, 1, 'nextPage'], [true, 1, 'nextPage'], [false, 1, 'nextPage'], [false, 2, 'continuous'], [false, 1, 'continuous']]);
 assert.deepEqual(s.sections.map(x => x.linked.header.default), [false, false, false, true, true]);
 assert.equal(s.parts[s.sections[4].eff.header.default].text, 'PORADNIK ORGANIZATORA');
 const t = await readDocx(await fx('33-solved.docx'));
 assert.ok(Object.values(t.parts).some(p => p.kind === 'footer' && p.fields.some(f => f.type === 'PAGE')), 'PAGE w kontrolce zawartości (sdt)');
 assert.ok(Object.keys(t.media).length >= 2, 'obrazy z word/media do podglądu');
 const c = await readDocx(await fx('30-solved.docx'));
 assert.deepEqual(c.fields.filter(f => f.type === 'SEQ').map(f => f.args[0] + f.result), ['Ilustracja1', 'Ilustracja2', 'Tabela1', 'Tabela2', 'Wykres1', 'Wykres2']);
 assert.equal(KINDS.ref.run(c, {min: 1, text: 'Tabela 1'}).ok, true, 'odsyłacz REF do zakładki');
 assert.equal(KINDS.ref.run(await readDocx(await starter(30)), {min: 1}).ok, false);
 const r = await readDocx(await fx('32-recenzja.docx'));
 assert.equal(r.comments.find(x => /materiał/i.test(x.anchor))?.author, 'Uczeń Testowy');
 assert.ok(r.paragraphs.some(p => p.segs.some(g => g.ins) && p.segs.some(g => g.del)));
});

// ——— Minimalne dokumenty budowane w teście (brak elementów, nietypowy zapis) ———
const crcTable = Array.from({length: 256}, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = b => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function zip(entries) {
 const enc = new TextEncoder(), local = [], central = [];
 let off = 0;
 for (const [name, text] of Object.entries(entries)) {
  const n = enc.encode(name), d = enc.encode(text), h = Buffer.alloc(30), c = Buffer.alloc(46);
  h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt32LE(crc32(d), 14); h.writeUInt32LE(d.length, 18); h.writeUInt32LE(d.length, 22); h.writeUInt16LE(n.length, 26);
  c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt32LE(crc32(d), 16); c.writeUInt32LE(d.length, 20); c.writeUInt32LE(d.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(off, 42);
  local.push(h, n, d); central.push(c, n); off += 30 + n.length + d.length;
 }
 const cd = Buffer.concat(central), e = Buffer.alloc(22);
 e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(central.length / 2, 8); e.writeUInt16LE(central.length / 2, 10); e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(off, 16);
 return new Uint8Array(Buffer.concat([...local, cd, e]));
}
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const doc = body => zip({'word/document.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}</w:body></w:document>`});
const P = (text, style, extra = '') => `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ''}${extra}<w:r><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;

test('Dokument bez stylów, nagłówków, pól i sekcji: każde sprawdzenie działa bez wyjątku', async () => {
 const m = await readDocx(doc(P('Jedyny akapit')));
 const all = Object.values(acts).flatMap(a => a.checks);
 const res = evaluate(m, all);
 assert.equal(res.length, all.length);
 for (const r of res) assert.doesNotMatch(r.detail, /nie udało się sprawdzić/, r.id);
 assert.ok(res.filter(r => r.ok).every(r => ['no-fake', 'manual', 'clean', 'placeholder'].includes(r.id)));
});
test('Pusty element body i brak document.xml', async () => {
 const m = await readDocx(doc(''));
 assert.equal(m.paragraphs.length, 0);
 assert.equal(m.sections.length, 1);
 await assert.rejects(readDocx(zip({'word/inny.xml': '<a/>'})), e => e.code === 'notWord');
 await assert.rejects(readDocx(zip({'word/document.xml': '<w:document><w:body><w:p></w:body>'})), e => e.code === 'xml' || e.code === 'corrupt');
});
test('Inny prefiks przestrzeni nazw, encje i spis treści bez numerów stron', async () => {
 const x = parseXml('<x:doc xmlns:x="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><x:t>A &amp; B &#x105;<![CDATA[<c>]]></x:t></x:doc>');
 assert.equal(x.name, 'w:doc');
 assert.equal(kids(x, 'w:t')[0].children.join(''), 'A & B ą<c>');
 // Spis bez \h i bez numerów (\n), wpisy w zwykłych akapitach, nagłówek 2 przeniesiony na poziom 1 bez aktualizacji
 const toc = `<w:p><w:pPr><w:pStyle w:val="TOC1"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText> TOC \\o "1-2" \\n </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>Wstęp</w:t></w:r></w:p>`
  + P('Szczegóły', 'TOC2') + `<w:p><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`;
 const styles = `<w:styles ${NS}><w:style w:type="paragraph" w:styleId="H1"><w:name w:val="heading 1"/></w:style><w:style w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/></w:style><w:style w:type="paragraph" w:styleId="TOC2"><w:name w:val="toc 2"/></w:style></w:styles>`;
 const make = body => zip({'word/document.xml': `<w:document ${NS}><w:body>${toc}${body}</w:body></w:document>`, 'word/styles.xml': styles,
  'word/_rels/document.xml.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'});
 const ok = await readDocx(make(P('Wstęp', 'H1') + P('Szczegóły', 'Heading2')));
 assert.equal(KINDS.tocCurrent.run(ok, {}).ok, true, KINDS.tocCurrent.run(ok, {}).detail);
 const moved = await readDocx(make(P('Wstęp', 'H1') + P('Szczegóły', 'H1')));
 assert.match(KINDS.tocCurrent.run(moved, {}).detail, /Inny poziom/);
 const order = await readDocx(make(P('Szczegóły', 'Heading2') + P('Wstęp', 'H1')));
 assert.match(KINDS.tocCurrent.run(order, {}).detail, /innej kolejności/);
});
test('Tekst: całe słowa i warianty (sie ≠ się, płatny ≠ bezpłatny)', () => {
 assert.equal(has('nauczysz się', {word: 'sie'}), false);
 assert.equal(has('nauczysz sie tego', {word: 'sie'}), true);
 assert.equal(has('Udział jest bezpłatny', {word: 'płatny'}), false);
 assert.equal(has('Sala 12', {any: ['sali 12', 'sala 12']}), true);
 assert.equal(has('A\u00a0–\u00a0B', 'a - b'), true);
});

// ——— Stan zapisywany w lekcji ———
test('Zapis: tylko wyniki, nazwa pliku i data; pełne punkty niezależnie od liczby prób', async () => {
 const a = acts['w28-docx'];
 const first = await run('w28-docx', await fx('28-fake-heading.docx'), 'C:\\Users\\uczen\\lesson-28-nowak.docx');
 const v1 = resultValue(a, first, 'C:\\Users\\uczen\\lesson-28-nowak.docx', new Date('2026-10-25T10:00:00Z'));
 assert.deepEqual(Object.keys(v1).sort(), ['attempts', 'checkedAt', 'done', 'fileName', 'max', 'results', 'score', 'summary']);
 assert.equal(v1.fileName, 'lesson-28-nowak.docx');
 assert.equal(v1.summary, 'Plik lesson-28-nowak.docx: 8/11 pkt');
 assert.equal(v1.done, true);
 assert.ok(Object.values(v1.results).every(x => typeof x === 'boolean'));
 assert.doesNotMatch(JSON.stringify(v1), /Jak sprawdzimy|klub/i, 'bez treści dokumentu');
 const second = await run('w28-docx', await fx('28-solved.docx'));
 const v2 = resultValue(a, second, 'lesson-28-nowak.docx', new Date(), v1);
 assert.equal(v2.attempts, 2);
 assert.equal(v2.score, v2.max);
 const shown = savedResults(a, v2);
 assert.equal(shown.length, a.checks.length);
 assert.ok(shown.every(x => x.ok && x.hint));
 assert.equal(savedResults(a, undefined), null);
});
