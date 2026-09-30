// Testy logiki symulatorów klasy 3 (lekcje 13–15): hexLab, schoolNetwork, helpdesk, smartHome.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as hex from '../content/sims/hexLab.js';
import * as net from '../content/sims/schoolNetwork.js';
import * as hd from '../content/sims/helpdesk.js';
import * as sh from '../content/sims/smartHome.js';
import {lessonScore, activityValue} from '../content/scoring.js';
import l13 from '../content/lessons/13-hexadecimal.js';
import l14 from '../content/lessons/14-school-devices.js';
import l15 from '../content/lessons/15-home-devices.js';

/* ───────── hexLab ───────── */
test('hex: konwersje dec ↔ bin ↔ hex i normalizacja zapisu', () => {
  assert.equal(hex.hexToDec('FF'), 255);
  assert.equal(hex.hexToDec('0x2F'), 47);
  assert.equal(hex.hexToDec('#a7'), 167);
  assert.equal(hex.decToHex(192, 2), 'C0');
  assert.equal(hex.decToHex(238, 2), 'EE');
  assert.equal(hex.decToHex(10, 2), '0A');
  assert.equal(hex.binToDec('0011 1100'), 0x3C);
  assert.equal(hex.binToDec('00101101'), 45);
  assert.equal(hex.groupBin(0xA7), '1010 0111');
  assert.deepEqual(hex.byteToBits(0xA7), [1, 0, 1, 0, 0, 1, 1, 1]);
  assert.equal(hex.bitsToByte([1, 0, 1, 0, 0, 1, 1, 1]), 0xA7);
  assert.deepEqual(hex.nibbles(0x3C), [3, 12]);
  assert.equal(hex.isHex('G1'), false);
  assert.ok(Number.isNaN(hex.hexToDec('xyz')));
  for (let n = 0; n < 256; n++) assert.equal(hex.hexToDec(hex.decToHex(n, 2)), n);
  assert.equal(hex.hexTable[12].hex, 'C');
  assert.equal(hex.hexTable[12].bin, '1100');
});

test('hex: kolory — skrót #RGB, 16 777 216 kolorów, odległość', () => {
  assert.deepEqual(hex.parseColor('#FB0'), hex.parseColor('#FFBB00'));
  assert.deepEqual(hex.parseColor('#FF8800'), {r: 255, g: 136, b: 0});
  assert.equal(hex.parseColor('#12345'), null);
  assert.equal(hex.colorToHex({r: 255, g: 136, b: 0}), '#FF8800');
  assert.equal(256 ** 3, 16777216);
  assert.equal(hex.colorDistance({r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}), 765);
  // najciemniejszy z opcji kłódki jest rzeczywiście najciemniejszy
  const lum = hex.colorLock.darkest.options.map(o => hex.luminance(hex.parseColor(o)));
  assert.equal(lum.indexOf(Math.min(...lum)), hex.colorLock.darkest.correct);
});

test('hex: zadania konwertera sprawdzają odpowiedzi i dają wskazówki', () => {
  const [set, read, ff, dec] = hex.nibbleTasks;
  assert.equal(hex.checkNibbleTask(set, 0xA7).ok, true);
  assert.match(hex.checkNibbleTask(set, 0xA6).message, /prawa czwórka/);
  assert.equal(hex.checkNibbleTask(read, '3c').ok, true);
  assert.equal(hex.checkNibbleTask(read, '0x3C').ok, true);
  assert.match(hex.checkNibbleTask(read, '60').message, /dziesiętna/);
  assert.equal(hex.checkNibbleTask(ff, 'ff').ok, true);
  assert.equal(hex.checkNibbleTask(dec, '47').ok, true);
  assert.match(hex.checkNibbleTask(dec, '35').message, /wagę 10/);
  assert.equal(parseInt(read.answer, 16), 0b00111100);
  assert.equal(parseInt(ff.answer, 16), 255);
  assert.equal(0x2F, dec.answer);
  // wskazówki robią się mocniejsze
  assert.notEqual(hex.checkNibbleTask(ff, '1', 1).message, hex.checkNibbleTask(ff, '1', 3).message);
  assert.equal(hex.taskPoints(1), 1);
  assert.equal(hex.taskPoints(2), 0.5);
});

test('hex: kłódki escape roomu — poprawne odpowiedzi i informacja zwrotna', () => {
  // 1. panel zasilania
  for (const f of hex.powerFields) {
    const val = f.from === 'bin' ? hex.binToDec(f.label.replace('₂', '')) : Number(f.label.replace('₁₀', ''));
    assert.equal(hex.decToHex(val, 2), f.answer, f.label);
  }
  assert.equal(hex.powerCode, 'C0FFEE');
  assert.equal(hex.checkPower({a: 'c0', b: 'FF', c: '0xee'}).ok, true);
  const bad = hex.checkPower({a: 'C', b: '255', c: 'EE'});
  assert.equal(bad.ok, false);
  assert.match(bad.fields.a.message, /zera/);
  assert.match(bad.fields.b.message, /dziesiętny/);
  // 2. kolor alarmu z tolerancją ±0x10
  assert.equal(hex.checkColor({r: 'FF', g: '88', b: '00', darkest: 1}).ok, true);
  assert.equal(hex.checkColor({r: 'F0', g: '80', b: '10', darkest: 1}).ok, true);
  assert.equal(hex.checkColor({r: 'FF', g: '88', b: '00', darkest: 0}).ok, false);
  assert.match(hex.checkColor({r: 'FF', g: '55', b: '00', darkest: 1}).message, /zielony \(G\): za mało/);
  assert.match(hex.checkColor({r: 'FF', g: '55', b: '00', darkest: 1}, 3).message, /136 = 8 · 16 \+ 8 = 88/);
  // 3. MAC — producent z pierwszych 3 par, 48 bitów
  assert.equal(hex.macLock.ouis[hex.macLock.maker].oui, hex.ouiOf(hex.macLock.sticker.mac));
  assert.equal(hex.macLock.bits.options[hex.macLock.bits.correct], String(hex.macLock.sticker.mac.split(':').length * 8));
  assert.equal(hex.checkMac({maker: 1, bits: 3}).ok, true);
  assert.equal(hex.checkMac({maker: 0, bits: 3}).ok, false);
  assert.equal(hex.checkMac({maker: 1, bits: 1}).ok, false);
  // 4. ASCII
  assert.equal(hex.decodeAscii(hex.asciiLock.bytes), 'WOLNOSC');
  assert.equal(hex.checkAscii('wolność').ok, true);
  assert.match(hex.checkAscii('WOLMOSC').message, /Pierwsze 3 znaki się zgadzają, 4\. znak/);
  assert.equal(hex.asciiTable.find(r => r.hex === '41').ch, 'A');
  assert.equal(hex.asciiTable.find(r => r.hex === '5A').ch, 'Z');
});

test('hex: punktacja escape roomu, blokada kolejnych kłódek, czas', () => {
  assert.equal(hex.lockPoints(1), 3);
  assert.equal(hex.lockPoints(2), 2);
  assert.equal(hex.lockPoints(3), 2);
  assert.equal(hex.lockPoints(4), 1);
  assert.equal(hex.lockOpen({}, 0), true);
  assert.equal(hex.lockOpen({}, 1), false);
  assert.equal(hex.lockOpen({locks: {power: {solved: true}}}, 1), true);
  const all = {startedAt: 1000, finishedAt: 755000, locks: {power: {solved: true, solvedAt: 1}, color: {solved: true, solvedAt: 2}, mac: {solved: true, solvedAt: 1}, ascii: {solved: true, solvedAt: 5}}};
  const r = hex.escapeResult(all);
  assert.equal(r.score, 3 + 2 + 3 + 1);
  assert.equal(r.max, 12);
  assert.equal(r.done, true);
  assert.equal(r.summary, 'Ucieczka z serwerowni: 4/4 kłódek, czas 12:34');
  assert.equal(hex.escapeResult({}).score, 0);
  assert.equal(hex.escapeResult({}).summary, undefined);
  assert.equal(hex.formatTime(65000), '01:05');
});

test('hex: gra w kolory jest deterministyczna i punktuje 0–2', () => {
  assert.deepEqual(hex.colorRound(0, 0), hex.colorRound(0, 0));
  const c = hex.colorRound(0, 1);
  for (const k of ['r', 'g', 'b']) { assert.ok(c[k] >= 0 && c[k] <= 255); assert.equal(c[k] % 17, 0); }
  assert.equal(hex.roundPointsFor(0), 2);
  assert.equal(hex.roundPointsFor(150), 1);
  assert.equal(hex.roundPointsFor(400), 0);
  const game = {rounds: Array.from({length: 5}, () => ({points: 2}))};
  const res = hex.colorGameResult({games: [game, {rounds: [{points: 1}]}]});
  assert.equal(res.best, 10);
  assert.equal(res.done, true);
  assert.equal(res.summary, 'Najlepszy wynik w grze kolorów: 10/10');
});

/* ───────── schoolNetwork ───────── */
test('sieć szkoły: odpowiedzi w awariach wynikają z topologii', () => {
  const ends = Object.keys(net.netNodes).filter(id => net.netNodes[id].kind === 'end');
  for (const inc of net.incidents) {
    let expected;
    if (inc.id === 'router') expected = net.pathBetween('labpc', 'printer').slice(1);
    else if (inc.invert) expected = ends.filter(id => !net.losesNetwork(id, inc.broken));
    else expected = ends.filter(id => net.losesNetwork(id, inc.broken));
    assert.deepEqual([...expected].sort(), [...inc.correct].sort(), inc.id);
    assert.ok(!inc.correct.includes(inc.broken));
    for (const id of inc.correct) assert.ok(net.netNodes[id], id);
  }
  assert.ok(!net.pathBetween('labpc', 'printer').includes('router'), 'wydruk nie idzie przez router');
  assert.equal(net.losesNetwork('printer3d', 'core'), false);
  assert.equal(net.losesNetwork('cloud', 'router'), false);
  // każdy węzeł z mapy jest w układzie
  const placed = [...net.netLayout.top, ...net.netLayout.chain, ...net.netLayout.zones.flatMap(z => z.nodes), ...net.netLayout.offline];
  assert.deepEqual([...placed].sort(), Object.keys(net.netNodes).sort());
});

test('sieć szkoły: sprawdzanie zaznaczeń i punktacja', () => {
  const ap = net.incidents[0];
  assert.equal(net.checkIncident(ap, ['laptop21', 'tablets2']).ok, true);
  const r = net.checkIncident(ap, ['laptop21', 'labpc']);
  assert.equal(r.ok, false);
  assert.deepEqual(r.missing, ['tablets2']);
  assert.deepEqual(r.extra, ['labpc']);
  assert.match(net.checkIncident(ap, ['ap2', 'laptop21', 'tablets2']).message, /zepsuł/);
  const st = {incidents: {ap2: {solved: true, solvedAt: 1}, labsw: {solved: true, solvedAt: 3}, core: {solved: true, solvedAt: 1}, router: {solved: true, solvedAt: 1}}};
  const res = net.mapResult(st);
  assert.equal(res.score, 3.5);
  assert.equal(res.max, 4);
  assert.equal(res.done, true);
  assert.equal(net.mapResult({}).done, false);
});

/* ───────── helpdesk ───────── */
test('helpdesk: 6 zgłoszeń, każde z 3 kluczowymi pytaniami, 1 dobrym rozwiązaniem i 1 dobrą odpowiedzią', () => {
  assert.equal(hd.tickets.length, 6);
  for (const t of hd.tickets) {
    assert.equal(t.questions.length, 6, t.id);
    assert.equal(t.questions.filter(q => q.key).length, 3, t.id);
    assert.equal(t.solutions.length, 4, t.id);
    assert.equal(t.solutions.filter(s => s.ok).length, 1, t.id);
    assert.equal(t.replies.filter(r => r.ok).length, 1, t.id);
    for (const s of [...t.solutions, ...t.replies]) assert.ok(s.why.length > 20, `${t.id}: uzasadnienie`);
    assert.ok(t.reporter.length > 80);
  }
  // Poprawne rozwiązania nie stoją zawsze na tej samej pozycji
  assert.ok(new Set(hd.tickets.map(t => t.solutions.findIndex(s => s.ok))).size >= 3);
  // Bezpieczeństwo: VPN i obejście filtra nigdy nie są poprawną odpowiedzią
  for (const t of hd.tickets) for (const s of t.solutions) if (/VPN|DNS|zaporę/.test(s.text)) assert.ok(!s.ok);
});

test('helpdesk: punktacja 3 na zgłoszenie, 18 razem', () => {
  const t = hd.tickets[0];
  const key = t.questions.map((q, i) => (q.key ? i : -1)).filter(i => i >= 0);
  const weak = t.questions.map((q, i) => (q.key ? -1 : i)).filter(i => i >= 0);
  const good = t.solutions.findIndex(s => s.ok);
  assert.equal(hd.checkSolution(t, good).ok, true);
  assert.equal(hd.checkSolution(t, (good + 1) % 4).ok, false);
  assert.equal(hd.questionFeedback(t, [key[0], key[1], weak[0]]).points, 1);
  assert.equal(hd.questionFeedback(t, [key[0], weak[0], weak[1]]).points, 0);
  assert.deepEqual(hd.ticketResult(t, {asked: key, askedLocked: true, solved: true, solAttempts: 1, replyOk: true}), {q: 1, s: 2, score: 3, max: 3, closed: true});
  assert.equal(hd.ticketResult(t, {asked: key, askedLocked: true, solved: true, solAttempts: 3}).score, 2);
  assert.equal(hd.ticketResult(t, {asked: key, askedLocked: true, solved: true, solAttempts: 1}).closed, false);
  const all = Object.fromEntries(hd.tickets.map(x => [x.id, {asked: x.questions.map((q, i) => (q.key ? i : -1)).filter(i => i >= 0), askedLocked: true, solved: true, solAttempts: 1, replyOk: true}]));
  const r = hd.helpdeskResult({tickets: all});
  assert.equal(r.score, 18);
  assert.equal(r.max, 18);
  assert.equal(r.done, true);
  assert.equal(r.summary, 'Rozwiązane zgłoszenia: 6/6 · trafna diagnoza za 1. razem: 6');
});

/* ───────── smartHome ───────── */
test('dom: rachunki kWh i zł są poprawne', () => {
  assert.equal(sh.PRICE, 1.10);
  assert.equal(sh.kwhFrom(20, 24), 175.2);
  assert.equal(sh.zl(sh.kwhFrom(20, 24)), 192.72); // dekoder z pytania na start
  assert.equal(sh.routerQuestion.answer, 77.09); // 70,08 kWh × 1,10
  assert.equal(sh.zl(sh.kwhFrom(350, 3)), 421.58); // przykład rozwiązany w lekcji
  const dev = Object.fromEntries(sh.devices.map(d => [d.id, sh.deviceKwh(d)]));
  assert.equal(Math.round(dev.decoder * 100) / 100, 182.5);
  assert.equal(Math.round(dev.console * 100) / 100, 195.64);
  assert.equal(dev.washer, 260);
  assert.equal(dev.fridge, 140);
  const base = sh.energyPlan([]);
  assert.equal(base.kwhBefore, 1706.34);
  assert.equal(base.zlBefore, 1876.97);
  assert.equal(base.savings, 0);
});

test('dom: cel 250 zł jest osiągalny, ale nie jednym działaniem; zwrot kosztów', () => {
  const single = sh.measures.map(m => sh.measureSaving(m.id));
  assert.ok(Math.max(...single) < sh.TARGET_SAVINGS, 'żadne pojedyncze działanie nie wystarcza');
  assert.equal(sh.measureSaving('strip'), 163.01);
  assert.equal(sh.measureSaving('led'), 115.63);
  assert.equal(sh.measureSaving('wash40'), 114.4);
  assert.equal(sh.measureSaving('chargers'), 9.64);
  const p = sh.energyPlan(['strip', 'led']);
  assert.equal(p.savings, 278.64);
  assert.equal(p.cost, 90);
  assert.ok(p.payback < 4);
  assert.equal(sh.energyPlan(['wash40', 'led', 'routerNight']).savings, 246.09); // blisko, ale za mało
  // nakładające się działania nie liczą oszczędności podwójnie
  assert.ok(sh.energyPlan(['strip', 'rest']).savings < sh.measureSaving('strip') + sh.measureSaving('rest'));
  const fridge = sh.energyPlan(['fridge']);
  assert.ok(fridge.payback / 12 > 50, 'lodówka zwraca się po ponad 50 latach');
  const e = sh.energyScore({measures: ['strip', 'led'], routerQ: {solved: true, solvedAt: 1}});
  assert.equal(e.score, 4);
  assert.equal(e.done, true);
  assert.equal(sh.energyScore({measures: ['strip', 'led', 'fridge']}).score, 2, 'drogi zakup psuje czas zwrotu');
  assert.equal(sh.checkRouterCost('77,09').ok, true);
  assert.equal(sh.checkRouterCost('77').ok, true);
  assert.match(sh.checkRouterCost('70,08').message, /kWh/);
  assert.equal(sh.checkRouterCost('7').ok, false);
});

test('dom: audyt bezpieczeństwa IoT', () => {
  assert.equal(sh.SEC_ISSUES, 15);
  for (const d of sh.iotDevices) for (const i of d.issues) assert.ok(d.options.includes(i.fix), `${d.id}: brak opcji ${i.fix}`);
  const perfect = Object.fromEntries(sh.iotDevices.map(d => [d.id, d.issues.map(i => i.fix)]));
  const a = sh.securityAudit(perfect);
  assert.equal(a.pct, 100);
  assert.equal(a.traps, 0);
  assert.equal(sh.securityPoints({...a, attempts: 1}), 4);
  assert.equal(sh.securityPoints({...a, attempts: 2}), 3);
  const withTrap = sh.securityAudit({...perfect, cam: [...perfect.cam, 'firewall']});
  assert.equal(withTrap.pct, 80);
  assert.equal(withTrap.traps, 1);
  assert.equal(sh.securityPoints({...withTrap, attempts: 1}), 2);
  assert.equal(sh.securityAudit({}).pct, 0);
  assert.equal(sh.securityScore({}).score, 0);
});

test('dom: reguły JEŻELI–TO — sensowne, ryzykowne i bez sensu', () => {
  assert.equal(sh.classifyRule({trigger: 'flood', action: 'valve'}).kind, 'safety');
  assert.equal(sh.classifyRule({trigger: 'time23', action: 'strip'}).kind, 'energy');
  assert.equal(sh.classifyRule({trigger: 'doorbell', action: 'unlock'}).kind, 'risky');
  assert.equal(sh.classifyRule({trigger: 'window', action: 'heatUp'}).kind, 'risky');
  assert.equal(sh.classifyRule({trigger: 'away', condition: 'home', action: 'strip'}).kind, 'weak');
  assert.equal(sh.classifyRule({trigger: 'sunset', condition: 'nobody', action: 'light'}).kind, 'safety');
  assert.equal(sh.classifyRule({trigger: 'cold', action: 'heatDown'}).kind, 'weak');
  assert.equal(sh.ruleText({trigger: 'flood', condition: 'none', action: 'valve'}), 'JEŻELI czujnik zalania wykrył wodę TO zamknij zawór wody');
  const good = [{trigger: 'flood', action: 'valve'}, {trigger: 'time23', action: 'strip'}, {trigger: 'sunset', action: 'light'}];
  assert.deepEqual(sh.rulesScore(good).score, 4);
  assert.equal(sh.rulesScore(good).done, true);
  const risky = [...good, {trigger: 'doorbell', action: 'unlock'}];
  assert.equal(sh.rulesScore(risky).score, 3);
  assert.equal(sh.rulesScore(risky).done, false);
  assert.equal(sh.rulesScore([]).score, 0);
  assert.equal(sh.rulesWord(1), 'reguła');
  assert.equal(sh.rulesWord(3), 'reguły');
  assert.equal(sh.rulesWord(5), 'reguł');
  assert.equal(sh.rulesWord(12), 'reguł');
  assert.equal(sh.rulesWord(22), 'reguły');
});

test('dom: wynik całego projektu i podsumowanie planu', () => {
  const perfect = Object.fromEntries(sh.iotDevices.map(d => [d.id, d.issues.map(i => i.fix)]));
  const state = {measures: ['strip', 'led'], routerQ: {solved: true, solvedAt: 1}, secCheck: {...sh.securityAudit(perfect), attempts: 1},
    rules: [{trigger: 'flood', action: 'valve'}, {trigger: 'time23', action: 'strip'}, {trigger: 'sunset', action: 'light'}]};
  const r = sh.smartHomeResult(state);
  assert.equal(r.score, 12);
  assert.equal(r.max, 12);
  assert.equal(r.done, true);
  assert.equal(r.summary, 'Plan dla Nowaków: −279 zł/rok, bezpieczeństwo 100%, 3 reguły');
  assert.equal(sh.smartHomeResult({}).summary, undefined);
  assert.equal(sh.smartHomeResult({}).score, 0);
});

/* ───────── lekcje ───────── */
for (const [lesson, maxPts] of [[l13, 19], [l14, 26], [l15, 16]]) {
  test(`lekcja ${lesson.id}: struktura, czas, karta wyniku`, () => {
    assert.equal(lesson.grade, 3);
    assert.ok(lesson.sections.length >= 4 && lesson.sections.length <= 7);
    assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), lesson.duration);
    assert.ok(lesson.duration >= 30 && lesson.duration <= 45);
    assert.equal(lesson.tags.length, 3);
    assert.ok(lesson.format.methods.length >= 3);
    const card = lesson.sections.at(-1).activities.find(a => a.type === 'resultCard');
    assert.ok(card, 'karta wyniku w ostatnim etapie');
    const empty = lessonScore(lesson, card, {});
    assert.equal(empty.max, maxPts);
    assert.equal(empty.score, 0);
    assert.equal(card.badges.length, 3);
    const ids = lesson.sections.flatMap(s => s.activities.map(a => a.id));
    assert.equal(new Set(ids).size, ids.length);
    // unikalne teksty opcji (używane jako klucze Reacta)
    for (const a of lesson.sections.flatMap(s => s.activities)) {
      if (a.options) assert.equal(new Set(a.options).size, a.options.length, a.id);
      if (a.cards) assert.equal(new Set(a.cards.map(c => c.title)).size, a.cards.length, a.id);
      if (a.rows) assert.equal(new Set(a.rows.map(r => r.label)).size, a.rows.length, a.id);
      if (['hexLab', 'schoolNetwork', 'helpdesk', 'smartHome'].includes(a.type)) { assert.ok(a.label, `${a.id}: etykieta do karty wyniku`); assert.ok(a.points > 1, `${a.id}: points = stałe max przed pierwszym wejściem`); }
    }
    const text = JSON.stringify(lesson);
    assert.doesNotMatch(text, /prac[ay] domow|zadanie domowe|przed lekcją/i);
  });
}

test('lekcja 13: pełny wynik = 19/19 pkt i odznaka mistrza', () => {
  const card = l13.sections.at(-1).activities[0];
  const answers = {'hex-r1': {first: true, done: true}, 'hex-r2': {first: true, done: true}, 'hex-r3': {first: true, done: true}, 'hex-nibble': {score: 4, max: 4, done: true}, 'hex-escape': {score: 12, max: 12, done: true, summary: 'Ucieczka z serwerowni: 4/4 kłódek, czas 10:00'}};
  const r = lessonScore(l13, card, answers);
  assert.equal(r.score, 19);
  assert.equal(r.badge.name, '0xC0DE MASTER');
  assert.ok(r.rows.some(x => x.summary?.startsWith('Ucieczka')));
  // bonusowa gra nie wpływa na kartę
  assert.ok(!card.sources.includes('hex-color'));
  assert.equal(activityValue({id: 'x'}, {x: {done: true}}).done, true);
});
