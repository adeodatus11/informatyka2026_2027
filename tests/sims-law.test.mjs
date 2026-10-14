import test from 'node:test';
import assert from 'node:assert/strict';
import * as lc from '../content/sims/lawCourt.js';
import * as pm from '../content/sims/proMail.js';
import * as sc from '../content/sims/scamComic.js';
import lesson39 from '../content/lessons/39-tech-law.js';
import lesson41 from '../content/lessons/41-online-communication.js';
import lesson43 from '../content/lessons/43-computer-crime-project.js';
import {lessonScore,resultSources} from '../content/scoring.js';

// ---------- lawCourt ----------
test('lawCourt: każda sprawa ma jeden poprawny przepis i uzasadnienie, podpowiedzi przy błędach', () => {
 assert.equal(lc.cases.length, 7);
 const verdictIds = lc.verdicts.map(v => v.id);
 for (const c of lc.cases) {
  assert.ok(verdictIds.includes(c.verdict), c.id);
  assert.equal(c.laws.filter(l => l.ok).length, 1, `${c.id}: jeden przepis`);
  assert.equal(c.reasons.filter(r => r.ok).length, 1, `${c.id}: jedno uzasadnienie`);
  for (const x of [...c.laws, ...c.reasons].filter(x => !x.ok)) assert.ok(x.why?.length > 20, `${c.id}: wyjaśnienie błędu`);
  for (const k of ['story', 'prosecutor', 'defense', 'verdictHint', 'explain', 'action']) assert.ok(c[k]?.length > 20, `${c.id}.${k}`);
  for (const v of verdictIds.filter(v => v !== c.verdict)) assert.ok(lc.verdictFeedback(c, v).length > 40);
 }
 // werdykty są zróżnicowane: każda odpowiedź występuje
 for (const v of verdictIds) assert.ok(lc.cases.some(c => c.verdict === v), v);
 assert.deepEqual(lc.rolesFor(0), ['Sędzia', 'Prokurator', 'Obrońca']);
 assert.deepEqual(lc.rolesFor(1), ['Prokurator', 'Obrońca', 'Sędzia']);
});

test('lawCourt: kroki po kolei, pełne punkty za pierwszą próbę, 0,5 po poprawce, done od 5 spraw', () => {
 const c = lc.cases[0];
 let st = lc.chooseLaw(c, {}, c.laws.findIndex(l => l.ok));
 assert.equal(st.law, undefined, 'przepis dopiero po werdykcie');
 const wrongV = lc.verdicts.find(v => v.id !== c.verdict).id;
 st = lc.chooseVerdict(c, {}, wrongV);
 assert.equal(st.verdict.ok, false);
 st = lc.chooseVerdict(c, st, c.verdict);
 assert.equal(st.verdict.ok, true);
 assert.equal(lc.chooseVerdict(c, st, wrongV), st, 'zamknięty po trafieniu');
 st = lc.chooseLaw(c, st, c.laws.findIndex(l => l.ok));
 st = lc.chooseReason(c, st, c.reasons.findIndex(r => r.ok));
 assert.equal(lc.caseScore(st), 2.5);
 assert.ok(lc.caseSolved(st));
 const cases = {};
 for (const k of lc.cases) {
  let s = lc.chooseVerdict(k, {}, k.verdict);
  s = lc.chooseLaw(k, s, k.laws.findIndex(l => l.ok));
  cases[k.id] = lc.chooseReason(k, s, k.reasons.findIndex(r => r.ok));
 }
 const r = lc.courtResult({cases});
 assert.equal(r.score, 21); assert.equal(r.max, 21); assert.equal(r.done, true);
 assert.match(r.summary, /7\/7/);
 const four = Object.fromEntries(Object.entries(cases).slice(0, 4));
 assert.equal(lc.courtResult({cases: four}).done, false);
 assert.equal(lc.courtResult({}).max, 21);
});

// ---------- proMail: spot ----------
test('proMail spot: wszystkie błędy, bez fałszywych zaznaczeń; poprawka daje 0,5', () => {
 assert.equal(pm.badCount, 6);
 let s = {};
 for (const f of pm.badMail.filter(f => f.bad)) s = pm.toggleMark(s, f.id);
 s = pm.checkSpot(s);
 assert.ok(pm.spotSolved(s));
 assert.deepEqual(pm.spotResult(s), {done: true, score: 6, max: 6, summary: 'Znalezione błędy w e-mailu: 6/6'});
 let w = pm.toggleMark(pm.toggleMark({}, 'from'), 'who');
 w = pm.checkSpot(w);
 assert.equal(pm.spotSolved(w), false);
 assert.deepEqual(w.last.wrong, ['who']);
 assert.equal(w.last.missing, 5);
 w = pm.toggleMark(w, 'who');
 for (const f of pm.badMail.filter(f => f.bad && f.id !== 'from')) w = pm.toggleMark(w, f.id);
 w = pm.checkSpot(w);
 assert.ok(pm.spotSolved(w));
 assert.equal(pm.spotResult(w).score, 1 + 5 * 0.5);
});

// ---------- proMail: compose ----------
const good = {from: 'pro', to: 'rekrutacja@bitserwis-przyklad.pl', subject: 'Zgłoszenie na praktyki zawodowe, Jan Kowalski, kl. 1', attachment: 'cv-pdf',
 body: 'Dzień dobry,\n\njestem uczniem 1 klasy technikum informatycznego w Zielonkowie. Chciałbym odbyć u Państwa praktyki zawodowe w maju i czerwcu 2027 r. Lubię naprawiać komputery i znam podstawy Worda. W załączniku przesyłam CV.\n\nZ poważaniem\nJan Kowalski'};
test('proMail compose: poprawny e-mail spełnia 7 kryteriów', () => {
 const r = pm.evaluateMail(good);
 for (const c of pm.criteria) assert.equal(r[c.id].ok, true, `${c.id}: ${r[c.id].msg}`);
 let s = pm.checkMail({mail: good});
 assert.ok(pm.mailReady(s));
 assert.equal(pm.composeResult(s).score, 7);
 assert.equal(pm.composeResult(s).done, false, 'done dopiero po wysłaniu');
 s = {...s, sent: true};
 assert.equal(pm.composeResult(s).done, true);
 assert.match(pm.composeResult(s).summary, /7\/7/);
});
test('proMail compose: typowe błędy dostają konkretną uwagę, a poprawka 0,5 pkt', () => {
 const bad = {...good, from: 'nick', subject: 'PILNE', body: 'siema 😎\nszukam praktyk odpiszcie szybko\nnara', attachment: 'photo'};
 const r = pm.evaluateMail(bad);
 for (const c of pm.criteria) assert.equal(r[c.id].ok, false, c.id);
 assert.match(r.address.msg, /sniper/);
 assert.match(r.greeting.msg, /siema/i);
 assert.equal(pm.evaluateMail({...good, body: pm.skeleton}).body.ok, false, 'szkielet z nawiasami');
 assert.equal(pm.evaluateMail({...good, to: 'rekrutacja@bitserwis.pl'}).address.ok, false);
 assert.equal(pm.evaluateMail({...good, body: good.body.replace('Jan Kowalski', 'jan')}).signature.ok, false);
 assert.equal(pm.evaluateMail({...good, body: good.body.replace(' W załączniku przesyłam CV.', '')}).attachment.ok, false);
 assert.equal(pm.evaluateMail({...good, body: good.body.replace('Dzień dobry', 'Witam')}).greeting.ok, true, '„Witam” z uwagą, ale zaliczone');
 let s = pm.checkMail({mail: bad});
 s = pm.checkMail({...s, mail: good});
 assert.equal(pm.composeResult(s).score, 3.5);
 assert.ok(pm.mailReady(s));
 assert.equal(pm.mailReady({...s, dirty: true}), false);
});

// ---------- proMail: tone ----------
test('proMail tone: agresja odrzucona, wiadomość asertywna zaliczona', () => {
 const angry = pm.evaluateTone('BARTEK ZNOWU OLAŁEŚ, TY LENIU!!!');
 assert.equal(angry.calm.ok, false); assert.equal(angry.general.ok, false); assert.equal(angry.ask.ok, false);
 const ok = pm.evaluateTone('Bartek, martwię się o jutrzejszą prezentację, bo slajdów 5–8 jeszcze nie ma. Czy możesz wysłać je dziś do 20:00? Jak potrzebujesz pomocy, daj znać.');
 for (const c of pm.toneCriteria) assert.equal(ok[c.id].ok, true, `${c.id}: ${ok[c.id].msg}`);
 const right = pm.firstMove.findIndex(m => m.ok);
 let s = pm.chooseMove({}, (right + 1) % 3);
 assert.equal(s.move.ok, false);
 s = pm.chooseMove(s, right);
 s = pm.checkTone({...s, text: 'Bartek, znowu nic nie zrobiłeś.'});
 assert.equal(pm.toneSolved(s), false);
 s = pm.checkTone({...s, text: 'Bartek, martwię się o jutro. Czy możesz wysłać slajdy 5–8 dziś do 20:00?'});
 assert.ok(pm.toneSolved(s));
 const r = pm.toneResult(s);
 assert.equal(r.done, true); assert.equal(r.max, 5);
 assert.ok(r.score < 5 && r.score >= 2.5);
});

// ---------- scamComic: domeny ----------
test('scamComic domeny: 5 adresów, zielone i czerwone, jedna świeża domena poza listą', () => {
 assert.equal(sc.domains.length, 5);
 assert.ok(sc.domains.some(d => d.safe) && sc.domains.some(d => !d.safe));
 assert.ok(sc.domains.some(d => !d.safe && !d.listed), 'brak na liście ≠ bezpieczna');
 assert.ok(sc.domains.every(d => !(d.safe && d.listed)));
 let j = {};
 const fresh = sc.domains.find(d => d.id === 'fresh');
 j = sc.judgeDomain(j, 'fresh', 'safe');
 assert.equal(j.fresh.ok, false);
 j = sc.judgeDomain(j, 'fresh', 'bad');
 assert.equal(sc.judgeDomain(j, 'fresh', 'safe'), j);
 assert.match(sc.listCheck(fresh).text, /JESZCZE/);
 for (const d of sc.domains) if (d.id !== 'fresh') j = sc.judgeDomain(j, d.id, d.safe ? 'safe' : 'bad');
 const r = sc.domainsResult({judged: j});
 assert.equal(r.done, true); assert.equal(r.score, 4.5); assert.equal(r.max, 5);
 assert.equal(sc.domainsResult({}).max, 5);
});

// ---------- scamComic: kreator ----------
function solveComic(id, {wrongOrder = false, wrongStop = false} = {}) {
 const story = sc.scenarioById(id);
 let c = sc.chooseScenario({}, id);
 if (wrongOrder) {
  for (const p of [...story.panels].reverse()) c = sc.togglePanel(c, p.id);
  c = sc.checkOrder(c);
  assert.equal(c.orderCheck.ok, false);
  c = sc.resetOrder(c);
 }
 for (const p of story.panels) c = sc.togglePanel(c, p.id);
 c = sc.checkOrder(c);
 assert.equal(c.orderCheck.ok, true);
 for (const p of story.panels.filter(p => p.stop)) c = sc.toggleStop(c, p.id);
 if (wrongStop) { c = sc.toggleStop(c, story.panels.at(-1).id); c = sc.checkStops(c); assert.equal(sc.stopsSolved(c), false); assert.equal(sc.comicResult(c).score, 1 + 2.5); c = sc.toggleStop(c, story.panels.at(-1).id); }
 c = sc.checkStops(c);
 assert.ok(sc.stopsSolved(c), id);
 for (const p of story.panels.filter(p => p.stop)) c = sc.setBubble(c, p.id, 'Nie podaję kodu, dzwonię do osoby.');
 for (const r of sc.reactions.filter(r => r.ok)) c = sc.toggleReaction(c, r.id);
 c = sc.checkReactions(c);
 return {...c, title: 'Nie dawaj się nabrać'};
}
test('scamComic kreator: każda historia ma 6 kadrów, 3–4 punkty przerwania i skutek bez STOP', () => {
 assert.equal(sc.scenarios.length, 3);
 for (const s of sc.scenarios) {
  assert.equal(s.panels.length, 6);
  const stops = s.panels.filter(p => p.stop).length;
  assert.ok(stops >= 3 && stops <= 4, s.id);
  assert.equal(s.panels.at(-1).stop, false, 'ostatni kadr to skutek');
  for (const p of s.panels) assert.ok(p.why.length > 20, p.id);
  assert.match(s.law, /art\. \d+/);
  const r = sc.comicResult(solveComic(s.id));
  assert.deepEqual([r.done, r.score, r.max], [true, 7, 7], s.id);
 }
});
test('scamComic kreator: błędy obniżają punkty, plakat wymaga dymków i tytułu', () => {
 const c = solveComic('olx', {wrongOrder: true, wrongStop: true});
 const r = sc.comicResult(c);
 assert.equal(r.done, true);
 assert.equal(r.score, 1 + 2.5 + 2);
 assert.equal(sc.comicResult({...c, title: 'abc'}).done, false);
 const story = sc.scenarioById('olx');
 assert.equal(sc.comicResult(sc.setBubble(c, story.panels.find(p => p.stop).id, 'uważaj')).done, false);
 let x = sc.chooseScenario({}, 'blik');
 assert.equal(sc.toggleStop(x, 'b2'), x, 'STOP dopiero po kolejności');
 let rr = sc.toggleReaction({}, 'delete');
 rr = sc.checkReactions(rr);
 assert.equal(rr.reactCheck.ok, false);
 assert.deepEqual(rr.reactCheck.wrong, ['delete']);
 assert.deepEqual(sc.comicResult({}), {done: false, score: 0, max: 7, summary: undefined});
 const html = sc.posterHtml(sc.setBubble({...c, title: '<b>x</b>'}, 'o2', '<script>alert(1)</script>'));
 assert.ok(!html.includes('<script>alert'), 'escapowanie tekstu ucznia');
 assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
});
test('scamComic ocena koleżeńska: komplet kryteriów, wskazówka i poprawka', () => {
 let p = {};
 for (const c of sc.peerCriteria) p = sc.ratePeer(p, c.id, 2);
 assert.equal(sc.peerResult(p).done, false);
 p = {...p, tip: 'Dymek w kadrze 3: napiszcie, co zrobić.'};
 assert.equal(sc.peerResult(p).done, false);
 p = {...p, fixed: true};
 const r = sc.peerResult(p);
 assert.equal(r.done, true); assert.equal(r.total, 8);
 assert.equal(r.max, undefined, 'ocena koleżeńska nie trafia do punktów');
 for (const c of sc.peerCriteria) assert.equal(c.levels.length, 3);
});

// ---------- lekcje ----------
for (const [lesson, order, types] of [[lesson39, 33, ['lawCourt']], [lesson41, 35, ['proMail']], [lesson43, 48, ['scamComic', 'reportGuide']]]) {
 test(`Lekcja ${lesson.id}: klasa 1, kolejność ${order}, 45 min, karta wyniku z punktami`, () => {
  assert.equal(lesson.grade, 1); assert.equal(lesson.order, order); assert.equal(lesson.duration, 45);
  assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), 45);
  const acts = lesson.sections.flatMap(s => s.activities);
  for (const t of types) assert.ok(acts.some(a => a.type === t), t);
  assert.equal(lesson.sections.at(-1).activities.at(-1).type, 'resultCard');
  assert.equal(lesson.sections[0].activities.filter(a => a.type === 'choice').length >= 2, true, 'retrieval na starcie');
  const card = lesson.sections.at(-1).activities.at(-1);
  assert.ok(resultSources(lesson, card).length >= 6);
  assert.equal(lessonScore(lesson, card, {}).score, 0);
  const titles = lesson.sections.map(s => s.title);
  assert.equal(new Set(titles).size, titles.length);
  for (const m of lesson.format.methods) assert.match(m.url, /^https:\/\/metodyka\.covepolska\.pl\/metoda-[a-z-]+\.html$/);
 });
}
test('Lekcje 39, 41, 43: różne metody główne i dokładne tytuły z rozkładu', () => {
 assert.equal(lesson39.title, 'Wybrane przepisy prawa dotyczące technologii informacyjno-komunikacyjnych');
 assert.equal(lesson41.title, 'Komunikacja i wymiana informacji w Internecie');
 assert.equal(lesson43.title, 'Przestępczość komputerowa – projekt');
 const first = [lesson39, lesson41, lesson43].map(l => l.format.methods[0].name);
 assert.equal(new Set(first).size, 3);
 const card = lesson43.sections.at(-1).activities.at(-1);
 const all = {domains: sc.domainsResult({judged: Object.fromEntries(sc.domains.map(d => [d.id, {ok: true, tries: 1}]))}), 'scam-project': {modes: {comic: sc.comicResult(solveComic('shop'))}}};
 const r = lessonScore(lesson43, card, all);
 assert.equal(r.score, 12); assert.equal(r.max, 18);
});
test('proMail spot: sprawdzenie zeruje flagę edycji, żeby pokazać informację zwrotną', () => {
 let s = pm.toggleMark({}, 'from');
 s = pm.checkSpot({...s, dirty: true});
 assert.equal(s.dirty, false);
});
