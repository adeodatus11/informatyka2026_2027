import test from 'node:test';
import assert from 'node:assert/strict';
import * as ll from '../content/sims/licenseLab.js';
import * as dl from '../content/sims/debateLab.js';
import lesson40 from '../content/lessons/40-license-project.js';
import lesson42 from '../content/lessons/42-tech-future-project.js';
import {lessonScore,resultSources} from '../content/scoring.js';

// ---------- licenseLab: półka ----------
test('licenseLab półka: pełne punkty za pierwszą próbę, 0,5 po poprawce, wszystkie kategorie w użyciu', () => {
 assert.equal(ll.shelfResult({}).max, ll.programs.length);
 assert.equal(ll.shelfResult({}).done, false);
 for (const c of ll.categories) assert.ok(ll.programs.some(p => p.cat === c.id), `kategoria ${c.id} bez programu`);
 let s = {};
 for (const p of ll.programs) s = ll.chooseShelf(s, p.id, p.cat);
 assert.deepEqual(ll.shelfResult({shelf: s}), {done: true, score: 10, max: 10, solved: 10, summary: 'Półka licencji: 10/10 programów'});
 let w = ll.chooseShelf({}, 'vlc', 'free');
 assert.equal(w.vlc.ok, false);
 w = ll.chooseShelf(w, 'vlc', 'oss');
 assert.equal(ll.shelfResult({shelf: w}).score, 0.5);
 assert.equal(ll.chooseShelf(w, 'vlc', 'eula'), w, 'rozwiązany program jest zablokowany');
 for (const p of ll.programs) { assert.ok(p.hint.length > 20 && p.fact.length > 20); }
});

// ---------- licenseLab: kreator ----------
test('licenseLab kreator: odpowiedzi prowadzą do właściwych licencji CC, GPL, MIT, CC0 i umowy', () => {
 assert.equal(ll.licenseFrom({}), null);
 assert.equal(ll.licenseFrom({kind: 'art', audience: 'public', conditions: 'some', commercial: 'yes', changes: 'yes'}), 'by');
 assert.equal(ll.licenseFrom({kind: 'art', audience: 'public', conditions: 'some', commercial: 'no', changes: 'sa'}), 'by-nc-sa');
 assert.equal(ll.licenseFrom({kind: 'art', audience: 'public', conditions: 'some', commercial: 'yes', changes: 'no'}), 'by-nd');
 assert.equal(ll.licenseFrom({kind: 'art', audience: 'public', conditions: 'none'}), 'cc0');
 assert.equal(ll.licenseFrom({kind: 'code', audience: 'public', copyleft: 'yes'}), 'gpl');
 assert.equal(ll.licenseFrom({kind: 'code', audience: 'public', copyleft: 'no'}), 'mit');
 assert.equal(ll.licenseFrom({kind: 'code', audience: 'client'}), 'contract');
 for (const id of ['by', 'by-sa', 'by-nc', 'by-nc-sa', 'by-nd', 'by-nc-nd', 'cc0', 'gpl', 'mit', 'contract']) assert.ok(ll.licenses[id]?.rights.length >= 2, id);
 // Zmiana wcześniejszej odpowiedzi usuwa pytania, które zniknęły.
 let st = ll.setBriefAnswer({}, 'app', 'kind', 'code');
 st = ll.setBriefAnswer(st, 'app', 'audience', 'public');
 st = ll.setBriefAnswer(st, 'app', 'copyleft', 'no');
 st = ll.setBriefAnswer(st, 'app', 'kind', 'art');
 assert.equal(st.app.answers.copyleft, undefined);
});
test('licenseLab kreator: zlecenia, stopka TASL i karta licencyjna dają 6 pkt i produkt', () => {
 const empty = ll.creatorResult({});
 assert.equal(empty.max, 6); assert.equal(empty.done, false); assert.equal(empty.score, 0);
 assert.equal(new Set(ll.briefs.map(b => b.expect)).size, ll.briefs.length, 'każde zlecenie ma inną licencję');
 let b = {};
 for (const br of ll.briefs) {
  for (const [q, v] of Object.entries(br.answers)) b = ll.setBriefAnswer(b, br.id, q, v);
  b = ll.checkBrief(b, br.id);
  assert.equal(b[br.id].ok, true, br.id);
  assert.equal(ll.licenseFrom(br.answers), br.expect);
 }
 // Błędna odpowiedź → podpowiedź do pierwszego niezgodnego pytania, potem 0,5 pkt.
 let w = ll.setBriefAnswer({}, 'portfolio', 'kind', 'art');
 for (const [q, v] of Object.entries({audience: 'public', conditions: 'some', commercial: 'yes', changes: 'sa'})) w = ll.setBriefAnswer(w, 'portfolio', q, v);
 w = ll.checkBrief(w, 'portfolio');
 assert.equal(w.portfolio.ok, false); assert.match(w.portfolio.msg, /NC/);
 w = ll.checkBrief(ll.setBriefAnswer(w, 'portfolio', 'commercial', 'no'), 'portfolio');
 assert.equal(w.portfolio.ok, true); assert.equal(w.portfolio.tries, 2);
 // Stopka
 const required = ll.footerParts.filter(p => p.required).map(p => p.id);
 let f = ll.checkFooter({sel: [...required, 'google']});
 assert.equal(f.ok, false); assert.deepEqual(f.wrong, ['google']);
 f = ll.checkFooter({...f, sel: required});
 assert.equal(f.ok, true); assert.equal(ll.footerPoints(f), 1);
 assert.equal(ll.footerPoints(ll.checkFooter({sel: required})), 2);
 assert.match(ll.footerPreview(required), /^„Rower na bulwarach”, aut\. Marta Zielińska, .*CC BY-SA 4\.0.*\. Zmiany: dodano napis\. Przerobiona/);
 // Karta
 const card = {name: 'Plan lekcji', team: 'Trójka 3', reason: 'Chcemy, żeby poprawki zostały otwarte dla klasy.', answers: {kind: 'code', audience: 'public', copyleft: 'yes'}};
 assert.equal(ll.cardComplete(card), true);
 assert.match(ll.cardFooter(card, 2027), /© 2027 Trójka 3\. „Plan lekcji” .*GNU GPL v3/);
 assert.match(ll.cardFooter({...card, answers: {kind: 'art', audience: 'client'}}, 2027), /umową/);
 const txt = ll.cardText(card, true, 2027);
 assert.match(txt, /^KARTA LICENCYJNA PROJEKTU/); assert.match(txt, /WARUNEK: /); assert.match(txt, /Wykorzystane cudze materiały: „Rower na bulwarach”/);
 assert.doesNotMatch(ll.cardText(card, false, 2027), /Wykorzystane/);
 assert.equal(ll.cardText({}, true), '');
 for (const g of ll.galleries) assert.match(g.url, /^https:\/\//);
 assert.equal(ll.cardComplete({...card, reason: 'bo tak'}), false);
 const r = ll.creatorResult({briefs: b, footer: ll.checkFooter({sel: required}), card});
 assert.equal(r.done, true); assert.equal(r.score, 6); assert.match(r.summary, /Karta licencyjna: „Plan lekcji” — GNU GPL v3/);
});

// ---------- licenseLab: audyt ----------
test('licenseLab audyt: werdykt i rozstrzygający element, różne werdykty i elementy', () => {
 assert.equal(ll.checkResult({}).max, ll.cases.length);
 assert.ok(ll.cases.some(c => c.verdict === 'ok') && ll.cases.some(c => c.verdict === 'bad'));
 assert.ok(new Set(ll.cases.map(c => c.key)).size >= 5);
 for (const c of ll.cases) assert.ok(ll.keys.some(k => k.id === c.key), c.id);
 let s = ll.setCase({}, 'nails', 'verdict', 'ok');
 s = ll.checkCase(ll.setCase(s, 'nails', 'key', 'nc'), 'nails');
 assert.equal(s.nails.ok, false); assert.match(s.nails.msg, /Werdykt nie pasuje/);
 s = ll.checkCase(ll.setCase(s, 'nails', 'verdict', 'bad'), 'nails');
 assert.equal(s.nails.ok, true);
 let all = {};
 for (const c of ll.cases) { all = ll.setCase(ll.setCase(all, c.id, 'verdict', c.verdict), c.id, 'key', c.key); all = ll.checkCase(all, c.id); }
 const r = ll.checkResult({cases: all});
 assert.equal(r.done, true); assert.equal(r.score, ll.cases.length);
 // Bez odpowiedzi nic się nie sprawdza.
 assert.deepEqual(ll.checkCase({}, 'club'), {});
});

// ---------- debateLab ----------
test('debateLab dzień online: bez oceniania, wymaga refleksji i eksperymentu, porównanie neutralne', () => {
 assert.equal(dl.dayResult({}).done, false);
 let v = {};
 for (const [k, h] of Object.entries(dl.exampleDay)) v = dl.setHours(v, k, h);
 assert.equal(dl.dayTotal(v.hours), 7);
 assert.equal(dl.dayResult(v).done, false);
 v.feel = Object.fromEntries(Object.keys(dl.exampleDay).map(k => [k, 'neutral']));
 v.experiment = 2;
 const r = dl.dayResult(v);
 assert.equal(r.done, true); assert.equal(r.score, undefined, 'dzień online nie jest punktowany');
 assert.doesNotMatch(r.summary, /\d+ ?h/, 'w produkcie nie ma godzin ucznia');
 assert.match(dl.compareText(7), /o 2 h większy/);
 assert.match(dl.compareText(5.2), /zbliżony/);
 assert.equal(dl.setHours({}, 'games', 99).hours.games, dl.MAX_HOURS);
 assert.equal(dl.setHours({}, 'games', -3).hours.games, 0);
 for (const t of [dl.compareText(2), dl.compareText(9)]) assert.doesNotMatch(t, /za dużo|źle|uzależn/i);
});
test('debateLab dowody: trzy typy, punktacja 1 / 0,5', () => {
 for (const t of dl.evidenceTypes) assert.ok(dl.statements.filter(s => s.type === t.id).length >= 2, t.id);
 let s = dl.chooseEvidence({}, 'cousin', 'proof');
 s = dl.chooseEvidence(s, 'cousin', 'noproof');
 assert.equal(dl.evidenceResult({items: s}).score, 0.5);
 let all = {};
 for (const st of dl.statements) all = dl.chooseEvidence(all, st.id, st.type);
 assert.deepEqual(dl.evidenceResult({items: all}), {done: true, score: 7, max: 7, solved: 7, summary: 'Dowody: 7/7 rozpoznanych'});
});
test('debateLab kreator stanowiska: kryteria, chochoł, poprawka i dwa warianty wydania', () => {
 for (const b of dl.bank) { assert.equal(b.replies.length, 3); assert.equal(b.replies.filter(r => r[1]).length, 1, b.id); }
 assert.ok(new Set(dl.bank.map(b => b.replies.findIndex(r => r[1]))).size >= 3, 'poprawna odpowiedź nie zawsze na tej samej pozycji');
 for (const side of ['pro', 'contra']) assert.ok(dl.bank.filter(b => b.side === side && b.proof).length >= 3 && dl.bank.some(b => b.side === side && !b.proof));
 const base = {stance: 'pro', title: 'AI z głową', rule: 'Pracę z AI oznaczamy przypisem i sprawdzamy fakty.', tip: 0, team: 'Trójka A'};
 let p = {...base, args: ['p-use', 'p-anecdote'], counter: 'c-brain', reply: 2};
 assert.deepEqual(dl.posterMissing(p), []);
 p = dl.checkPoster(p);
 const crit = Object.fromEntries(dl.posterCriteria(p).map(c => [c.id, c.ok]));
 assert.deepEqual(crit, {side: true, roles: false, proof: false, counter: false, reply: true});
 assert.equal(dl.posterScore(p), 2);
 assert.equal(dl.posterCriteria({...p, args: ['p-use', 'c-errors']}).find(c => c.id === 'side').ok, false, 'argument drugiej strony nie wspiera tezy');
 p = dl.toggleArg(p, 'p-anecdote'); p = dl.toggleArg(p, 'p-skills');
 p = dl.setCounter(p, 'c-errors'); assert.equal(p.reply, undefined);
 p = dl.checkPoster({...p, reply: 2});
 assert.equal(dl.posterAllOk(p), true);
 assert.equal(dl.posterScore(p), 3.5, 'side i reply za 1. razem, roles, proof i counter po poprawce');
 assert.equal(dl.posterResult({poster: p}).max, dl.POSTER_MAX);
 assert.equal(dl.posterResult({poster: p}).done, false, 'trzeba wybrać wariant i wydać');
 assert.equal(dl.posterResult({poster: {...p, variant: 'platform'}}).done, false, 'plakat trzeba wydać');
 assert.equal(dl.posterResult({poster: {...p, variant: 'platform', published: true}}).done, true);
 assert.equal(dl.posterResult({poster: {...p, variant: 'word', published: true}}).done, false, 'wariant Word wymaga samooceny pliku');
 assert.equal(dl.posterResult({poster: {...p, variant: 'word', rubric: {ratings: {}, done: true}}}).done, true);
 assert.match(dl.posterResult({poster: {...p, variant: 'word', rubric: {done: true}}}).summary, /Stanowisko \(Word\): „AI z głową” — Więcej szans/);
 const perfect = dl.checkPoster({...base, args: ['p-use', 'p-skills'], counter: 'c-errors', reply: 2});
 assert.equal(dl.posterScore(perfect), dl.POSTER_MAX, 'wszystko za pierwszym razem = maks.');
 assert.equal(dl.posterAllOk({...p, reply: 0}), false, 'zmiana po sprawdzeniu wymaga ponownego sprawdzenia');
 assert.equal(dl.toggleArg({args: ['a', 'b']}, 'c').args.length, 2, 'maks. 2 argumenty');
 const text = dl.posterText(p);
 assert.match(text, /NASZA TEZA: Więcej szans/); assert.match(text, /DRUGA STRONA MÓWI/); assert.match(text, /Licencja: CC BY 4\.0/);
 assert.equal(dl.checkPoster({stance: 'pro'}).attempts, undefined, 'niekompletny plakat nie zużywa próby');
});

test('debateLab ocena koleżeńska: wszystkie kryteria 0–2, gwiazdy i życzenie; bez punktów do karty', () => {
 assert.equal(dl.peerResult({}).done, false);
 for (const c of dl.peerCriteria) assert.equal(c.levels.length, 3, c.id);
 let v = {};
 for (const c of dl.peerCriteria) v = dl.ratePeer(v, c.id, 2);
 assert.equal(dl.peerResult(v).done, false, 'bez gwiazd i życzenia');
 v = dl.setPeer(dl.setPeer(v, 'stars', '★ Dowody ze źródłem ★ Jasna teza'), 'wish', 'Dopiszcie, kto pilnuje zasady.');
 const r = dl.peerResult(v);
 assert.equal(r.done, true); assert.equal(r.total, dl.PEER_MAX); assert.equal(r.score, undefined);
 assert.equal(dl.peerResult(dl.ratePeer(v, 'rule', 0)).total, dl.PEER_MAX - 2);
});

// ---------- lekcje ----------
for (const lesson of [lesson40, lesson42]) test(`${lesson.id}: projekt ma role, kryteria, wariant solo i kartę wyniku z poprawnymi źródłami`, () => {
 assert.equal(lesson.grade, 1); assert.equal(lesson.duration, 45);
 assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), 45);
 assert.match(lesson.format.grouping, /trój/i); assert.match(lesson.format.grouping, /parze|parach/i); assert.match(lesson.format.grouping, /samodziel|sam /i);
 assert.ok(lesson.format.methods.length >= 4);
 const all = lesson.sections.flatMap(s => s.activities);
 const card = all.find(a => a.type === 'resultCard');
 const sources = resultSources(lesson, card);
 assert.ok(sources.every(a => !['text', 'checklist', 'wordRubric', 'wordSteps', 'download'].includes(a.type)));
 const empty = lessonScore(lesson, card, {});
 assert.ok(empty.max >= 15); assert.equal(empty.score, 0);
 assert.ok(lesson.sections[0].activities.filter(a => a.type === 'choice').length >= 2, 'retrieval na starcie');
 assert.ok(all.some(a => a.type === 'checklist' || (a.type === 'debateLab' && a.mode === 'peer')), 'ocena koleżeńska wg kryteriów');
 assert.ok(all.some(a => a.type === 'text'), 'refleksja / poprawka');
 for (const a of sources.filter(a => a.points)) assert.equal(lessonScore(lesson, card, {}).rows.find(r => r.id === a.id).max, a.points);
 const ids = all.map(a => a.id); assert.equal(new Set(ids).size, ids.length);
});
test('Tytuły i kolejność lekcji projektowych', () => {
 assert.equal(lesson40.title, 'Zasady rozpowszechniania programów komputerowych – projekt');
 assert.equal(lesson40.order, 34); assert.equal(lesson40.id, '40');
 assert.equal(lesson42.title, 'Szanse i zagrożenia związane z rozwojem informatyki i technologii informacyjno-komunikacyjnych – projekt');
 assert.equal(lesson42.order, 36); assert.equal(lesson42.id, '42');
});

test('Punkty w lekcjach zgadzają się z logiką symulatorów', () => {
 const acts = l => l.sections.flatMap(s => s.activities);
 const a40 = Object.fromEntries(acts(lesson40).map(a => [a.id, a]));
 assert.equal(a40['lic-shelf'].points, ll.shelfResult({}).max);
 assert.equal(a40['lic-creator'].points, ll.creatorResult({}).max);
 assert.equal(a40['lic-check'].points, ll.checkResult({}).max);
 const a42 = Object.fromEntries(acts(lesson42).map(a => [a.id, a]));
 assert.equal(a42['deb-evidence'].points, dl.evidenceResult({}).max);
 assert.equal(a42['deb-poster'].points, dl.POSTER_MAX);
 assert.equal(a42['deb-peer'].posterId, 'deb-poster');
 const w = a42['deb-poster'].word;
 assert.match(w.file, /^materials\/lesson-42-stanowisko-start\.docx$/);
 assert.equal(w.steps.type, 'wordSteps'); assert.equal(w.rubric.type, 'wordRubric');
 assert.equal(w.rubric.criteria.reduce((s, c) => s + c.points, 0), 10);
 for (const c of w.rubric.criteria) assert.match(c.description, /0 pkt/);
 assert.equal(lessonScore(lesson40, acts(lesson40).find(a => a.type === 'resultCard'), {}).max, 26);
 assert.equal(lessonScore(lesson42, acts(lesson42).find(a => a.type === 'resultCard'), {}).max, 17);
 const card42 = acts(lesson42).find(a => a.type === 'resultCard');
 assert.ok(!card42.sources.includes('deb-day') && !card42.sources.includes('deb-peer'), 'czas online i ocena koleżeńska nie są punktowane');
});
test('Plik startowy Worda do lekcji 42 istnieje i jest archiwum DOCX', async () => {
 const {readFileSync} = await import('node:fs');
 const buf = readFileSync(new URL('../public/materials/lesson-42-stanowisko-start.docx', import.meta.url));
 assert.equal(buf.subarray(0, 2).toString(), 'PK');
 assert.ok(buf.includes(Buffer.from('word/document.xml')));
});
