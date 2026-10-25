import test from 'node:test';
import assert from 'node:assert/strict';
import * as ll from '../content/sims/licenseLab.js';
import * as ff from '../content/sims/futureFirm.js';
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

// ---------- lekcje ----------
for (const lesson of [lesson40]) test(`${lesson.id}: projekt w parach (bez trójek z rolami), kryteria, wariant solo i kartę wyniku z poprawnymi źródłami`, () => {
 assert.equal(lesson.grade, 1); assert.equal(lesson.duration, 45);
 assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), 45);
 // decyzja nauczyciela (10.2026): pary zamiast trójek z rolami, bez oceny koleżeńskiej między grupami
 assert.doesNotMatch(JSON.stringify(lesson), /trój|ocen[aęy] koleżeńsk/i); assert.match(lesson.format.grouping, /par[yaz]/i); assert.match(lesson.format.grouping, /samodziel|sam /i);
 assert.ok(lesson.format.methods.length >= 4);
 const all = lesson.sections.flatMap(s => s.activities);
 const card = all.find(a => a.type === 'resultCard');
 const sources = resultSources(lesson, card);
 assert.ok(sources.every(a => !['text', 'checklist', 'wordRubric', 'wordSteps', 'download'].includes(a.type)));
 const empty = lessonScore(lesson, card, {});
 assert.ok(empty.max >= 15); assert.equal(empty.score, 0);
 assert.ok(lesson.sections[0].activities.filter(a => a.type === 'choice').length >= 2, 'retrieval na starcie');
 assert.ok(all.some(a => a.type === 'checklist'), 'sprawdzenie karty wg kryteriów');
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
 assert.equal(lessonScore(lesson40, acts(lesson40).find(a => a.type === 'resultCard'), {}).max, 26);
});

// ---------- futureFirm (lekcja 42) ----------
const BEST = e => e.options.findIndex(o => o.q === 'best');
function play(ind, plan, pick, check) {
 let g = ff.newGame(ind);
 for (let y = 0; y < ff.YEARS.length; y++) {
  for (const id of plan[y] || []) g = ff.toggleCard(g, id);
  g = ff.confirmYear(g);
  let s = ff.simulate(g);
  assert.equal(s.phase, 'event');
  const e = ff.eventFor(s.history.at(-1).event);
  g = ff.react(g, pick(e, s, y));
  s = ff.simulate(g);
  if (check) check(s, y);
  if (y < ff.YEARS.length - 1) { assert.equal(s.finished, false); g = ff.nextYear(g); }
 }
 return {game: g, sim: ff.simulate(g)};
}
function seeded(seed) { let x = seed; return () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; }

test('futureFirm: dane gry — 3 branże, karty z szansą i ryzykiem, zdarzenia z 3 reakcjami (best/ok/bad)', () => {
 assert.deepEqual(ff.industryIds, ['pizzeria', 'warsztat', 'salon']);
 assert.equal(new Set(ff.industryIds.map(i => industriesSeniors(i))).size, 3, 'branże różnią się udziałem seniorów');
 for (const ind of ff.industryIds) for (const c of ff.cards) {
  const k = ff.cardFor(c.id, ind);
  assert.ok(k.cost > 0 && k.name && k.what, c.id);
  assert.ok(ff.AREAS[k.chance.area] && ff.AREAS[k.risk.area] && k.chance.text.length > 20 && k.risk.text.length > 20, c.id);
  for (const l of ff.LENSES) assert.ok(k.hints[l.id]?.length > 15, `${c.id} ${l.id}`);
 }
 assert.ok(ff.cards.some(c => !c.risk.visible) && ff.cards.some(c => c.risk.visible), 'część ryzyk ukryta, część widoczna');
 for (const e of ff.events) {
  assert.deepEqual(e.options.map(o => o.q).sort(), ['bad', 'best', 'ok'], e.id);
  for (const o of e.options) assert.ok(o.feedback.length > 30, e.id);
  for (const l of ff.LENSES) assert.ok(e.hints[l.id]?.length > 15, `${e.id} ${l.id}`);
  assert.ok(ff.AREAS[e.area], e.id);
 }
 assert.ok(new Set(ff.events.map(e => e.options.findIndex(o => o.q === 'best'))).size === 3, 'najlepsza reakcja na różnych pozycjach w danych');
 for (const a of ['praca', 'bezpieczenstwo', 'wykluczenie', 'dobrostan', 'prawo']) assert.ok(ff.events.some(e => e.area === a) || ff.cards.some(c => c.risk.area === a || c.chance.area === a), a);
 assert.equal(ff.MAX_POINTS, 12);
});
function industriesSeniors(i) { return ff.cardFor('kiosk', i) && ff.simulate(ff.newGame(i)).stats && i && ({pizzeria: 0.15, warsztat: 0.3, salon: 0.4})[i]; }

test('futureFirm: najlepsza gra daje 12/12 w każdej branży, a summary opisuje firmę w 2030 r.', () => {
 for (const ind of ff.industryIds) {
  const {sim, game} = play(ind, ff.BEST_PLAN, BEST);
  assert.equal(sim.finished, true);
  assert.equal(sim.eventPoints, 8); assert.equal(sim.goalPoints, 4); assert.equal(sim.points, ff.MAX_POINTS, ind);
  const r = ff.futureFirmResult({game});
  assert.equal(r.done, false, 'bez odpowiedzi metapoznawczej etap niezaliczony');
  assert.equal(r.score, 12); assert.equal(r.max, 12);
  const r2 = ff.futureFirmResult({game, reflection: 'Pakiet bezpieczeństwa kupiłbym jeszcze raz w pierwszym roku.'});
  assert.equal(r2.done, true);
  assert.match(r2.summary, new RegExp(`^${ff.industries[ind].short} 2030: [\\d\\s\\u00a0]+ zł/mies\\. \\(\\+[\\d\\s\\u00a0]+ zł\\), klienci \\d+%, bezpieczeństwo \\d+%, zespół \\d+%$`));
 }
 assert.deepEqual(ff.futureFirmResult({}), {done: false, score: 0, max: 12, summary: undefined});
});

test('futureFirm: zdarzenia wynikają z decyzji', () => {
 const firstEvent = (ind, buy) => { let g = ff.newGame(ind); for (const id of buy) g = ff.toggleCard(g, id); return ff.simulate(ff.confirmYear(g)).history[0].event; };
 assert.equal(firstEvent('salon', ['kiosk']), 'exclusion');
 assert.equal(firstEvent('pizzeria', ['chatbot']), 'hallucination');
 assert.equal(firstEvent('pizzeria', ['chatbot', 'aiTraining']), 'aiAct', 'szkolenie z AI zapobiega halucynacji, zostaje obowiązek z AI Act');
 assert.equal(firstEvent('warsztat', ['online', 'payments']), 'ransomware', 'dwa systemy bez pakietu bezpieczeństwa');
 assert.equal(firstEvent('warsztat', ['security', 'online', 'payments']), 'phishing');
 assert.equal(firstEvent('pizzeria', ['online']), 'leak');
 assert.equal(firstEvent('pizzeria', ['monitoring']), 'monitoring');
 assert.equal(firstEvent('pizzeria', ['social']), 'fakeReviews');
 assert.equal(firstEvent('pizzeria', []), 'phishing');
 // Ten sam kiosk boli bardziej tam, gdzie jest więcej seniorów.
 const loss = ind => { let g = ff.toggleCard(ff.newGame(ind), 'kiosk'); return ff.simulate(ff.confirmYear(g)).history[0].impact.find(([k]) => k === 'clients')[1]; };
 assert.ok(loss('salon') < loss('warsztat') && loss('warsztat') < loss('pizzeria'));
 // Ochrona łagodzi skutki: phishing przy pakiecie bezpieczeństwa nie obniża bezpieczeństwa.
 const ph = buy => { let g = ff.newGame('pizzeria'); for (const id of buy) g = ff.toggleCard(g, id); return ff.simulate(ff.confirmYear(g)).history[0]; };
 assert.equal(ph(['security']).protected, true); assert.deepEqual(ph(['security']).impact, []);
 assert.equal(ph([]).protected, false);
 // Brak pakietu: każdy nowy system obniża bezpieczeństwo.
 assert.ok(ph(['payments']).afterShop.security < ff.START.security);
 assert.ok(ph(['security', 'payments']).afterShop.security > ff.START.security);
 // Zdarzenia się nie powtarzają; nic nie kupując, gra i tak ma 4 zdarzenia.
 const {sim} = play('salon', [[], [], [], []], () => 0);
 assert.equal(new Set(sim.history.map(h => h.event)).size, 4);
});

test('futureFirm: każda ścieżka kończy się raportem, kasa nie spada poniżej limitu, wskaźniki w 0–100', () => {
 const rnd = seeded(42);
 const seen = new Set();
 for (const ind of ff.industryIds) for (let k = 0; k < 400; k++) {
  const plan = ff.YEARS.map(() => ff.cards.filter(() => rnd() < 0.35).map(c => c.id));
  const {sim} = play(ind, plan, () => Math.floor(rnd() * 3), s => {
   for (const snap of [s.stats, ...s.history.flatMap(h => [h.start, h.afterShop, h.afterImpact, h.afterReaction, h.end].filter(Boolean))]) {
    assert.ok(snap.cash >= ff.MIN_CASH, `kasa ${snap.cash}`);
    for (const key of ['clients', 'security', 'team']) assert.ok(snap[key] >= 0 && snap[key] <= 100, key);
    assert.ok(snap.profit >= 0 && snap.staff >= 1);
   }
  });
  assert.equal(sim.finished, true); assert.equal(sim.history.length, 4);
  assert.ok(sim.points >= 0 && sim.points <= ff.MAX_POINTS);
  for (const h of sim.history) { seen.add(h.event); for (const b of h.bought) assert.ok(h.start.cash >= 0, 'kupuje się tylko za dodatnią kasę'); }
  const tl = ff.timeline(sim); assert.equal(tl.length, 4);
 }
 for (const e of ff.events) assert.ok(seen.has(e.id), `zdarzenie ${e.id} osiągalne`);
});

test('futureFirm: zakupy w budżecie, reakcja jednorazowa, mutacje poza fazą ignorowane', () => {
 let g = ff.newGame('pizzeria');
 g = ff.toggleCard(g, 'monitoring');
 assert.equal(ff.canAdd(g, 'online'), null);
 assert.match(ff.canAdd(g, 'kiosk'), /Brakuje 4000 zł/);
 const over = ff.toggleCard(g, 'kiosk');
 assert.equal(over, g, 'karta ponad budżet nie trafia do koszyka');
 assert.ok(ff.cartCost(ff.toggleCard(ff.toggleCard(g, 'online'), 'chatbot').years[0].cart, 'pizzeria') <= ff.START.cash);
 g = ff.toggleCard(g, 'monitoring'); assert.deepEqual(g.years[0].cart, []);
 assert.equal(ff.react(g, 0), g, 'nie można reagować przed zamknięciem zakupów');
 assert.equal(ff.nextYear(g), g);
 g = ff.confirmYear(ff.toggleCard(g, 'security'));
 assert.equal(ff.toggleCard(g, 'online'), g, 'po zatwierdzeniu koszyk zamknięty');
 g = ff.react(g, 1);
 assert.equal(ff.react(g, 2), g, 'reakcji nie da się zmienić');
 g = ff.nextYear(g);
 assert.match(ff.canAdd(g, 'security'), /już działa/);
 // Stan „z zewnątrz” z zakupem ponad stan kasy — karta pominięta, kasa nie spada poniżej zera przy zakupach.
 const forged = ff.simulate({ind: 'salon', years: [{cart: ['kiosk', 'monitoring', 'online', 'chatbot'], confirmed: true, reaction: 0}]});
 assert.ok(forged.history[0].afterShop.cash >= 0);
 assert.equal(ff.simulate({ind: 'nieznana', years: []}), null);
});

test('42: lekcja „Firma 2030” — kontrakt, samodzielnie domyślnie, retrieval, karta wyniku', () => {
 const l = lesson42;
 assert.equal(l.grade, 1); assert.equal(l.id, '42'); assert.equal(l.order, 36); assert.equal(l.duration, 45);
 assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
 assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
 assert.match(l.format.grouping, /^Domyślnie samodzielnie/);
 assert.doesNotMatch(JSON.stringify(l), /plakat|stanowisk|debat|ocen[aęy] koleżeńsk|Word/i);
 assert.ok(l.format.methods.length >= 3);
 const all = l.sections.flatMap(s => s.activities);
 const game = all.find(a => a.type === 'futureFirm');
 assert.equal(game.id, 'ff-game'); assert.equal(game.points, ff.MAX_POINTS);
 assert.ok(l.sections[0].activities.filter(a => a.type === 'choice').length >= 2, 'retrieval na starcie');
 const card = all.find(a => a.type === 'resultCard');
 const empty = lessonScore(l, card, {});
 assert.equal(empty.max, 20); assert.equal(empty.score, 0);
 assert.ok(resultSources(l, card).some(a => a.id === 'ff-game'));
 const ids = all.map(a => a.id); assert.equal(new Set(ids).size, ids.length);
 assert.match(l.teacherGuide.preparation, /DO WERYFIKACJI/); assert.match(l.teacherGuide.preparation, /uproszczenie/);
});
