import test from 'node:test';
import assert from 'node:assert/strict';
import * as ocean from '../content/sims/internetOcean.js';
import * as fc from '../content/sims/factCheck.js';
import * as sl from '../content/sims/searchLab.js';
import * as es from '../content/sims/eServices.js';

// ---------- internetOcean ----------
test('internetOcean: rząd wielkości daje 1 pkt, pomyłka o jeden rząd 0,5 pkt', () => {
 const s = ocean.minuteStats[0];
 assert.equal(ocean.guessPoints(s, s.correct), 1);
 assert.equal(ocean.guessPoints(s, s.correct > 0 ? s.correct - 1 : s.correct + 1), 0.5);
 assert.equal(ocean.guessPoints(s, s.correct < 2 ? s.correct + 2 : s.correct - 2), 0);
 // poprawne odpowiedzi nie mogą stać zawsze na tej samej pozycji
 assert.ok(new Set(ocean.minuteStats.map(x => x.correct)).size >= 3);
 assert.equal(ocean.minuteResult({}).done, false);
 assert.equal(ocean.minuteResult({}).max, 5);
 const all = Object.fromEntries(ocean.minuteStats.map(x => [x.id, x.correct]));
 const r = ocean.minuteResult(all);
 assert.equal(r.done, true); assert.equal(r.score, 5); assert.match(r.summary, /5\/5/);
 for (const st of ocean.minuteStats) { assert.equal(st.options.length, 4); assert.ok(st.source.length > 5); }
});
test('internetOcean: bańka — udziały sumują się do 100, polubienia zwiększają udział tematu', () => {
 const none = ocean.feedShares({});
 assert.equal(none.reduce((s, r) => s + r.share, 0), 100);
 const likes = Object.fromEntries(ocean.feedPosts.map(p => [p.id, p.topic === 'gry' ? 'like' : 'skip']));
 const mine = ocean.feedShares(likes), other = ocean.feedShares(ocean.oppositeReactions(likes));
 assert.equal(mine.reduce((s, r) => s + r.share, 0), 100);
 assert.equal(other.reduce((s, r) => s + r.share, 0), 100);
 assert.equal(ocean.topTopics(mine, 1)[0].id, 'gry');
 assert.ok(mine.find(r => r.id === 'gry').share > 40);
 assert.ok(other.find(r => r.id === 'gry').share < 5);
 const res = ocean.bubbleResult(likes);
 assert.equal(res.done, true); assert.equal(res.score, 1); assert.match(res.summary, /Gry/);
 assert.equal(ocean.bubbleResult({p1: 'like'}).done, false);
});

// ---------- factCheck ----------
test('factCheck: 6 przypadków, 4 oszustwa, każdy ma dokładnie jeden mocny dowód i 4 wskazówki SIFT', () => {
 assert.equal(fc.cases.length, 6); assert.equal(fc.scamTotal, 4);
 assert.ok(fc.cases.some(c => c.answer === 'true')); assert.ok(fc.cases.some(c => c.answer === 'fake'));
 for (const c of fc.cases) {
  assert.equal(c.evidence.filter(e => e.ok).length, 1, c.id);
  assert.equal(c.evidence.length, 3);
  for (const e of c.evidence) if (!e.ok) assert.ok(e.why.length > 20, c.id);
  for (const t of fc.tools) assert.ok(c.clues[t.id].length > 20, `${c.id} ${t.id}`);
  assert.ok(c.action.length > 20);
 }
});
test('factCheck: pełne punkty za pierwszą próbę, połowa po poprawce, dowód dopiero po werdykcie', () => {
 const c = fc.cases[1];
 let st = fc.chooseEvidence(c, {}, 0); assert.equal(st.evidence, undefined, 'dowód zablokowany przed werdyktem');
 st = fc.chooseVerdict(c, {}, 'fake'); assert.equal(st.verdict.ok, false);
 assert.match(fc.verdictFeedback(c, 'fake'), /pieniędzy lub danych/);
 st = fc.chooseVerdict(c, st, 'scam'); assert.equal(st.verdict.ok, true); assert.equal(st.verdict.tries, 2);
 st = fc.chooseEvidence(c, st, c.evidence.findIndex(e => e.ok));
 assert.equal(fc.caseScore(st), 1.5); assert.ok(fc.caseSolved(st));
 const perfect = {cases: Object.fromEntries(fc.cases.map(k => {let s = fc.chooseVerdict(k, {}, k.answer); s = fc.chooseEvidence(k, s, k.evidence.findIndex(e => e.ok)); return [k.id, s];}))};
 const r = fc.factCheckResult(perfect);
 assert.equal(r.score, 12); assert.equal(r.max, 12); assert.equal(r.done, true); assert.match(r.summary, /4\/4/);
 assert.equal(fc.factCheckResult({}).done, false);
 assert.deepEqual(fc.addTool(fc.addTool({}, 'who'), 'who').tools, ['who']);
});

// ---------- searchLab ----------
test('searchLab: normalizacja polskich znaków i parser operatorów', () => {
 assert.equal(sl.normalize('Słuchawki ŁĄCZĄ się!'), 'sluchawki lacza sie');
 const p = sl.parseQuery('"praca wakacyjna" OR "praca sezonowa" Zielonkowo -nocne site:gov.pl filetype:PDF intitle:oferta after:2026-09-01');
 assert.equal(p.clauses.length, 3);
 assert.equal(p.clauses[0].length, 2);
 assert.equal(p.negatives[0].value, 'nocne');
 assert.deepEqual(p.filters.site, [{domain: 'gov.pl', neg: false}]);
 assert.deepEqual(p.filters.filetype, [{type: 'pdf', neg: false}]);
 assert.equal(p.clauses[2][0].field, 'title');
 assert.equal(p.filters.after, '2026-09-01');
 assert.equal(sl.parseQuery('+sklep ~tani cache:x').warnings.length, 3);
 assert.ok(sl.parseQuery('praca or dom').warnings.some(w => /OR/.test(w)));
});
test('searchLab: site:, filetype:, fraza, wykluczenia i OR działają', () => {
 assert.ok(sl.search('regulamin site:gov.pl').organic.every(d => d.domain.endsWith('.gov.pl')));
 assert.ok(sl.search('regulamin praktyk filetype:pdf').organic.every(d => d.type === 'pdf'));
 assert.ok(sl.search('ulga site:gov.pl').organic.every(d => d.id !== 'ulgi-fake'), 'podróbka -gov.pl nie przechodzi przez site:gov.pl');
 assert.ok(sl.search('"czucie i wiara silniej mówi do mnie"').organic.every(d => sl.normalize(d.text).includes('czucie i wiara silniej mowi do mnie')));
 assert.ok(sl.search('burrito -kurczak').organic.every(d => !/kurczak/i.test(d.text)));
 const or = sl.search('"praca wakacyjna" OR "praca sezonowa" Zielonkowo').organic.map(d => d.id);
 assert.ok(or.includes('job-lody') && or.includes('job-sklep'));
 assert.equal(sl.search('praktyki informatyk site:gov.pl after:2026-09-01').organic.some(d => d.date <= '2026-09-01'), false);
 assert.ok(sl.search('regulamin site:zs-przyklad.edu.pl').organic.length >= 2);
 assert.equal(sl.search('site:gov.pl').total, 0);
 assert.equal(sl.search('slucHAWKI bluetooth').total, sl.search('Słuchawki Bluetooth').total, 'bez polskich znaków też znajduje');
 assert.ok(sl.search('słuchawki bluetooth').ads.length > 0);
 assert.equal(sl.search('słuchawki site:serwisowo.pl').ads.length, 0);
});
test('searchLab: każda misja wymaga operatora — naiwne zapytanie nie daje celu na 1. stronie, wzorcowe daje', () => {
 const naive = {'m-quote': 'czucie i wiara', 'm-headphones': 'słuchawki bluetooth nie łączą się', 'm-burrito': 'tanie burrito bez mięsa', 'm-rules': 'regulamin praktyk', 'm-discount': 'ulga uczeń pociąg', 'm-job': 'praca wakacyjna Zielonkowo', 'm-manual': 'voltino s3 instrukcja', 'm-internship': 'praktyki technik informatyk Zielonkowo'};
 for (const m of sl.missions) {
  const top = q => sl.search(q).organic.slice(0, sl.PAGE_SIZE).map(d => d.id);
  assert.ok(!top(naive[m.id]).some(id => m.targetIds.includes(id)), `${m.id}: naiwne zapytanie za łatwe`);
  assert.ok(top(m.operatorHint).some(id => m.targetIds.includes(id)), `${m.id}: wzorcowe zapytanie nie działa`);
  for (const id of m.targetIds) assert.ok(sl.docs.some(d => d.id === id));
 }
 assert.equal(sl.search('burrito -mięso').organic.some(d => d.id === 'burrito-wege'), false);
 assert.ok(sl.missionTrap(sl.missionById('m-burrito'), 'burrito -mięso'));
});
test('searchLab: pole AI z błędem pojawia się w misji o ulgach, a źródło mówi co innego', () => {
 const r = sl.search('ulga uczeń pociąg');
 assert.equal(r.ai?.id, 'ai-ulga'); assert.equal(r.ai.wrong, true); assert.match(r.ai.text, /51%/);
 assert.match(sl.docs.find(d => d.id === 'ulgi-gov').text, /37%/);
 const m = sl.missionById('m-discount'); assert.equal(m.check.options[m.check.correct], '37%');
});
test('searchLab: punkty za misję i wynik poziomu, boss: jedna misja wystarcza', () => {
 assert.equal(sl.missionPoints(1, 1), 3); assert.equal(sl.missionPoints(3, 1), 2); assert.equal(sl.missionPoints(9, 1), 1); assert.equal(sl.missionPoints(1, 1, 5), 1);
 const l1 = sl.missionsForLevels([1]);
 assert.equal(l1.length, 3); assert.equal(sl.missionsForLevels([2]).length, 3); assert.equal(sl.missionsForLevels(['boss']).length, 2);
 const st = {missions: {'m-headphones': {queries: ['a', 'b'], found: true, foundAfter: 2}, 'm-quote': {queries: ['x'], found: true, foundAfter: 1, checked: false}}};
 let r = sl.levelResult(st, l1);
 assert.equal(r.max, 9); assert.equal(r.score, 3); assert.equal(r.done, false, 'misja z pytaniem kontrolnym bez odpowiedzi nie jest zaliczona');
 st.missions['m-quote'].checked = true; r = sl.levelResult(st, l1);
 assert.equal(r.score, 6); assert.equal(r.done, true); assert.match(r.summary, /2\/3/);
 assert.equal(sl.completedCount(st, [1]), 2);
 const boss = sl.levelResult({missions: {'m-manual': {queries: ['a'], found: true, foundAfter: 1}}}, sl.missionsForLevels(['boss']), {bossMode: true});
 assert.equal(boss.max, 3); assert.equal(boss.done, true); assert.equal(boss.score, 3);
 assert.equal(sl.levelResult({}, l1).done, false);
});
test('searchLab: indeks — unikalne id, wymyślone domeny, poprawne typy i daty', () => {
 const ids = new Set();
 for (const d of sl.docs) {
  assert.ok(!ids.has(d.id), d.id); ids.add(d.id);
  assert.ok(['html', 'pdf', 'docx', 'xlsx'].includes(d.type));
  assert.match(d.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(d.url.startsWith('http'));
  assert.ok(!/google|facebook|allegro|olx|inpost|pkp|mobywatel|youtube/i.test(d.domain), d.domain);
 }
 assert.ok(sl.docs.length >= 40);
});

// ---------- eServices ----------
test('eServices: kod SMS, rozpoznawanie phishingu i wynik logowania', () => {
 const code = es.makeCode(() => 0.42); assert.equal(code.length, 6); assert.ok(es.checkCode(code, code.slice(0, 3) + ' ' + code.slice(3)));
 assert.equal(es.checkCode(code, '000000'), false);
 assert.equal(es.phishing.filter(p => p.safe).length, 1);
 let ph = {};
 for (const p of es.phishing) { let s = es.classify(p, {}, p.safe); s = es.chooseAction(p, s, p.action); ph[p.id] = s; }
 const r = es.loginResult({loggedIn: true, phishing: ph});
 assert.equal(r.score, 5); assert.equal(r.max, 5); assert.equal(r.done, true); assert.match(r.summary, /3\/3/);
 const wrong = es.classify(es.phishing[1], {}, true); assert.equal(wrong.cls.ok, false);
 const fixed = es.chooseAction(es.phishing[1], es.classify(es.phishing[1], wrong, false), 1);
 assert.equal(es.loginResult({phishing: {suffix: fixed}}).score, 0.5);
 assert.equal(es.loginResult({}).done, false);
});
test('eServices: PESEL przykładowy ma poprawną sumę kontrolną, obliczenia w modułach się zgadzają', () => {
 const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3], p = es.profile.pesel;
 assert.equal((10 - [...p.slice(0, 10)].reduce((s, d, i) => s + w[i] * d, 0) % 10) % 10, Number(p[10]));
 const travel = es.moduleById('travel');
 assert.ok(es.checkStep(travel.steps[2], '26,46')); assert.ok(es.checkStep(travel.steps[2], '26.46 zł')); assert.equal(es.checkStep(travel.steps[2], '21,42'), false);
 assert.equal(Math.round(travel.trip.price * 0.63 * 100) / 100, 26.46);
 const money = es.moduleById('money');
 assert.equal(money.pit.income - money.pit.costs, 1920);
 assert.ok(es.checkStep(money.steps[1], '230'));
 const health = es.moduleById('health');
 assert.ok(es.checkStep(health.steps[1], {pesel: es.profile.pesel, code: '4827'}));
 assert.equal(es.checkStep(health.steps[1], {pesel: es.profile.pesel, code: '7315'}), false);
 assert.ok(es.checkStep(health.steps[3], {code: '7315', slot: 'x'}));
 assert.equal(es.checkStep(health.steps[3], {code: '7315'}), false);
});
test('eServices: moduł eksperta — najlepszy moduł liczy się do wyniku (maks. 4)', () => {
 const solve = (mod, firstTry = true) => Object.fromEntries(mod.steps.map(s => [s.id, firstTry ? es.attempt({}, true) : es.attempt(es.attempt({}, false), true)]));
 const [a, b, c] = es.modules;
 assert.equal(es.modules.length, 3);
 for (const m of es.modules) { assert.equal(m.steps.length, 4); assert.equal(m.expert.length, 3); }
 let r = es.expertResult({modules: {[b.id]: solve(b, false)}});
 assert.equal(r.score, 2); assert.equal(r.max, 4); assert.equal(r.done, true);
 r = es.expertResult({modules: {[b.id]: solve(b, false), [a.id]: solve(a)}});
 assert.equal(r.score, 4); assert.match(r.summary, /Zdrowie/); assert.match(r.summary, /Dojazdy/);
 assert.equal(es.expertResult({}).done, false);
 for (const m of es.modules) for (const s of m.steps) if (s.kind === 'choice') { assert.ok(s.correct < s.options.length); assert.equal(s.why.length, s.options.length); }
 assert.ok(c);
});
test('factCheck: tryb SIFT — poprawna kolejność S, I, F, T; wskazuje złe pozycje', () => {
 assert.deepEqual(fc.siftSteps.map(s => s.id), ['S', 'I', 'F', 'T']);
 assert.equal(fc.checkSiftOrder(['S', 'I', 'F', 'T']).ok, true);
 const r = fc.checkSiftOrder(['S', 'F', 'I', 'T']); assert.equal(r.ok, false); assert.deepEqual(r.wrong, [1, 2]);
 assert.equal(fc.siftResult({ok: true, tries: 1}).score, 1);
 assert.equal(fc.siftResult({ok: true, tries: 2}).score, 0.5);
 assert.equal(fc.siftResult({}).done, false);
 assert.deepEqual([...fc.siftShuffled].sort(), ['F', 'I', 'S', 'T']);
});
test('Lekcje 07–09: aktywności symulatorów mają points równe max z logiki', async () => {
 const lessons = await Promise.all(['07-internet-ocean', '08-search', '09-e-services'].map(async f => (await import(`../content/lessons/${f}.js`)).default));
 const maxOf = a => a.type === 'internetOcean' ? (a.mode === 'bubble' ? 1 : 5) : a.type === 'factCheck' ? (a.mode === 'sift' ? 1 : 12) : a.type === 'eServices' ? (a.mode === 'expert' ? 4 : 5) : a.type === 'searchLab' ? (a.mode === 'demo' ? 1 : a.levels.includes('boss') ? 3 : 9) : null;
 for (const l of lessons) for (const s of l.sections) for (const a of s.activities) { const m = maxOf(a); if (m !== null) assert.equal(a.points, m, `${l.id} ${a.id}`); if (a.requires) assert.ok(s && l.sections.some(x => x.activities.some(y => y.id === a.requires.id)), a.requires.id); }
 assert.deepEqual(lessons.map(l => l.duration), [35, 43, 44]);
});
