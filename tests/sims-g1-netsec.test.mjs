import test from 'node:test';
import assert from 'node:assert/strict';
import * as N from '../content/sims/netLab.js';
import * as S from '../content/sims/securityCheck.js';
import lesson58 from '../content/lessons/58-computer-networks.js';
import lesson59 from '../content/lessons/59-security-data-protection.js';
import {lessonScore} from '../content/scoring.js';

// ---------- netLab: adresy ----------
test('netLab: rozpoznaje IPv4 i pule prywatne (z brzegami zakresu 172.16–31)', () => {
 assert.deepEqual(N.parseIPv4('192.168.1.23'), [192, 168, 1, 23]);
 for (const bad of ['192.168.1.256', '192.168.1', '1.2.3.4.5', 'abc', '', '192.168.01a.1', ' . . . ']) assert.equal(N.parseIPv4(bad), null, bad);
 const k = N.ipKind;
 assert.equal(k('10.0.0.1'), 'private'); assert.equal(k('172.16.0.1'), 'private'); assert.equal(k('172.31.255.254'), 'private');
 assert.equal(k('172.15.0.1'), 'public'); assert.equal(k('172.32.0.1'), 'public'); assert.equal(k('192.168.10.57'), 'private');
 assert.equal(k('203.0.113.77'), 'public'); assert.equal(k('127.0.0.1'), 'loopback'); assert.equal(k('169.254.3.4'), 'apipa');
 assert.equal(k('224.0.0.1'), 'special'); assert.equal(k('300.1.1.1'), 'invalid');
 assert.equal(N.IPV4_COUNT, 4294967296);
 for (const it of N.classifyItems) assert.equal(k(it.ip), it.kind, it.ip);
 assert.ok(new Set(N.classifyItems.map(i => i.kind)).size === 3, 'wszystkie trzy kategorie w zadaniu');
});

test('netLab address: klasyfikacja i pytanie NAT — pełne punkty za pierwszą próbę, połowa po poprawce', () => {
 let cls = N.checkClassify({picks: {0: 'private'}});
 assert.equal(cls.checks, undefined, 'niekompletne zaznaczenia nie zużywają próby');
 const good = Object.fromEntries(N.classifyItems.map((it, i) => [i, it.kind]));
 cls = N.checkClassify({picks: good});
 assert.equal(cls.solved, true);
 let st = {classify: cls, nat: N.answerQuiz(N.natQuiz, {}, N.natQuiz.correct)};
 assert.deepEqual(N.addressResult(st), {done: true, score: 3, max: 3, summary: N.addressResult(st).summary});
 const wrongPicks = {...good, 4: 'private'};
 let c2 = N.checkClassify({picks: wrongPicks});
 assert.equal(c2.solved, false); assert.deepEqual(c2.wrong, [4]);
 c2 = N.checkClassify({...c2, picks: good});
 let q = N.answerQuiz(N.natQuiz, {}, 0); q = N.answerQuiz(N.natQuiz, q, N.natQuiz.correct);
 assert.equal(N.addressResult({classify: c2, nat: q}).score, 1.5);
 assert.equal(N.addressResult({}).max, 3);
 assert.equal(N.answerQuiz(N.natQuiz, q, 0), q, 'po trafieniu odpowiedź zamknięta');
});

// ---------- netLab: pakiety ----------
test('netLab packets: inna kolejność, zgubiony pakiet 5, awaria Łodzi omijana', () => {
 assert.deepEqual(N.arrivalOrder(N.round1), [2, 1, 4, 6, 3]);
 assert.deepEqual(N.lostPackets(N.round1), [5]);
 assert.equal(N.missingQuiz.options[N.missingQuiz.correct], '5');
 assert.ok(!N.resend.route.includes('lodz'));
 assert.equal(N.lostPackets(N.round2).length, 0);
 assert.ok(N.round2.every(p => !p.route.includes('lodz')), 'w rundzie 2 nikt nie idzie przez Łódź');
 assert.equal(N.routeText(N.round1[0].route), 'Ty → Router → Operator → Warszawa → Serwer → Kolega');
 for (const p of [...N.round1, ...N.round2]) for (let i = 1; i < p.route.length; i++) assert.ok(N.edges.some(([a, b]) => (a === p.route[i - 1] && b === p.route[i]) || (b === p.route[i - 1] && a === p.route[i])), `krawędź ${p.route[i - 1]}-${p.route[i]}`);
 const all = {};
 for (const k of ['order', 'reroute', 'game']) all[k] = N.answerQuiz(N.packetQuizzes[k], {}, N.packetQuizzes[k].correct);
 all.missing = N.answerQuiz(N.missingQuiz, {}, 4);
 assert.deepEqual([N.packetsResult(all).score, N.packetsResult(all).done], [4, true]);
 assert.equal(N.packetsResult({...all, game: undefined}).done, false);
});

// ---------- netLab: wiersz poleceń ----------
test('netLab cmd: tryb zastępczy — dokładne odczyty z przykładowych wyników i podpowiedzi przy typowych błędach', () => {
 assert.ok(N.sampleOutputs.ipconfig.includes(`Adres IPv4. . . . . . . . . . . . : ${N.sample.ipv4}`));
 assert.ok(N.sampleOutputs.ipconfig.includes(`Brama domyślna. . . . . . . . . . : ${N.sample.gateway}`));
 assert.ok(N.sampleOutputs.ping.includes(`Czas średni = ${N.sample.pingAvg}ms`));
 const times = [...N.sampleOutputs.ping.matchAll(/czas=(\d+)ms/g)].map(m => +m[1]);
 assert.equal(Math.round(times.reduce((a, b) => a + b) / times.length), N.sample.pingAvg, 'średnia zgodna z odpowiedziami');
 const hopLines = N.sampleOutputs.tracert.split('\n').filter(l => /^\s+\d+\s/.test(l));
 assert.equal(hopLines.length, N.sample.hops);
 assert.equal(N.sampleOutputs.tracert.split('\n').filter(l => l.includes(N.answerLines.hops)).length, 1, 'podświetlenie trafia w jeden wiersz');
 assert.equal(N.checkIPv4('192.168.10.57', 'sample').ok, true);
 assert.match(N.checkIPv4('255.255.255.0', 'sample').text, /maska/);
 assert.match(N.checkIPv4('fe80::5d2a:91c4:7b3e:1f08%12', 'sample').text, /IPv6/);
 assert.match(N.checkIPv4('192.168.10.1', 'sample').text, /brama/i);
 assert.equal(N.checkGateway('192.168.10.1', '', 'sample').ok, true);
 assert.match(N.checkPing('32', '', 'sample').text, /bajtów/);
 assert.match(N.checkPing('57', '', 'sample').text, /TTL/);
 assert.match(N.checkPing('14', '', 'sample').text, /średni/);
 assert.equal(N.checkPing('12 ms', '', 'sample').ok, true);
 assert.match(N.checkHops('30', 'sample').text, /maksimum/);
 assert.match(N.checkHops('7', 'sample').text, /gwiazdkami/);
 assert.equal(N.checkHops('8', 'sample').ok, true);
});

test('netLab cmd: pomiar własny — sprawdzamy sensowność formatu, nie konkretne wartości', () => {
 assert.equal(N.checkIPv4('10.20.30.40').ok, true);
 assert.equal(N.checkIPv4('192.168.0.15').ok, true);
 assert.equal(N.checkIPv4('83.1.2.3').ok, true, 'publiczny przyjęty z uwagą');
 assert.match(N.checkIPv4('83.1.2.3').text, /publiczny/);
 for (const bad of ['169.254.10.2', '127.0.0.1', '192.168.1', '255.255.0.0', 'fe80::1', '999.1.1.1']) assert.equal(N.checkIPv4(bad).ok, false, bad);
 assert.equal(N.checkGateway('10.20.30.1', '10.20.30.40').ok, true);
 assert.equal(N.checkGateway('10.20.0.1', '10.20.30.40').ok, true, 'duża sieć szkolna: przyjęte z uwagą');
 assert.equal(N.checkGateway('192.168.1.1', '10.20.30.40').ok, false, 'brama z innej sieci');
 assert.equal(N.checkGateway('10.20.30.40', '10.20.30.40').ok, false, 'brama = własny adres');
 assert.equal(N.checkPing('25', '').ok, false, 'bez celu');
 assert.equal(N.checkPing('25', 'nazwa-strony.pl').ok, true);
 assert.equal(N.checkPing('<1', 'nazwa-strony.pl').ok, false);
 assert.equal(N.checkPing('5000', 'nazwa-strony.pl').ok, false);
 assert.equal(N.checkPing('abc', 'nazwa-strony.pl').ok, false);
 assert.equal(N.checkPing('31', '203.0.113.5').ok, true, 'cel jako adres IP');
 assert.equal(N.checkHops('12').ok, true);
 for (const bad of ['1', '30', '0', '45', 'x']) assert.equal(N.checkHops(bad).ok, false, bad);
});

test('netLab cmd: punkty, próby i paszport połączenia', () => {
 let st = {mode: 'live', inputs: {gateway: '10.1.1.1'}};
 st = N.checkField(st, 'gateway');
 assert.equal(st.checks.gateway.tries, 0, 'brama przed adresem nie zużywa próby');
 st = {...st, inputs: {...st.inputs, ipv4: '255.255.255.0'}};
 st = N.checkField(st, 'ipv4');
 assert.equal(st.checks.ipv4.ok, false); assert.equal(st.checks.ipv4.tries, 1);
 st = N.checkField({...st, inputs: {...st.inputs, ipv4: '10.1.1.57'}}, 'ipv4');
 assert.equal(st.checks.ipv4.pts, 0.5);
 st = N.checkField(st, 'gateway');
 assert.equal(st.checks.gateway.pts, 1);
 st = N.checkField({...st, inputs: {...st.inputs, pingTarget: 'nazwa-strony.pl', ping: '23', prediction: '50'}}, 'ping');
 st = {...st, src: {hops: 'sample'}, inputs: {...st.inputs, hops: '8'}};
 st = N.checkField(st, 'hops');
 const r = N.cmdResult(st);
 assert.deepEqual([r.done, r.score, r.max], [true, 3.5, 4]);
 assert.equal(r.summary, 'Paszport połączenia: IPv4 10.1.1.57 (prywatny) · brama 10.1.1.1 · ping nazwa-strony.pl 23 ms · tracert 8 przeskoków (przykład)');
 assert.equal(N.passport(st).prediction, 50);
 assert.equal(N.checkField(st, 'ping'), st, 'ponowne sprawdzenie tej samej wartości nic nie zmienia');
 assert.equal(N.passportResult(st, {conclusion: 'krótko'}).done, false);
 assert.equal(N.passportResult(st, {conclusion: 'Najpierw ping do bramy, potem serwer w Europie.'}).done, true);
 assert.equal(N.passportResult({}, {conclusion: 'Najpierw ping do bramy, potem serwer w Europie.'}).done, false, 'paszport wymaga odczytów');
 // Cały tryb zastępczy: pełne punkty.
 let s2 = {mode: 'sample', inputs: {ipv4: '192.168.10.57', gateway: '192.168.10.1', ping: '12', hops: '8'}};
 for (const f of N.CMD_FIELDS) s2 = N.checkField(s2, f);
 assert.equal(N.cmdResult(s2).score, 4);
 assert.match(N.cmdResult(s2).summary, /przyklad-gry\.pl 12 ms \(przykład\)/);
 assert.equal(N.minPingMs(6900), 69);
 const all = N.netResult({});
 assert.deepEqual(Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v.max])), N.MAX);
});

// ---------- securityCheck: hasła ----------
test('securityCheck: SHA-1 zgodny ze wzorcem, k-anonimowość wysyła 5 znaków', () => {
 assert.equal(S.sha1(''), 'DA39A3EE5E6B4B0D3255BFEF95601890AFD80709');
 assert.equal(S.sha1('abc'), 'A9993E364706816ABA3E25717850C26C9CD0D89D');
 assert.equal(S.sha1('123456'), '7C4A8D09CA3762AF61E59520943DC26494F8941B');
 assert.equal(S.sha1('zażółć'), S.sha1('zażółć'));
 const k = S.kanonDemo('Kocham12');
 assert.equal(k.prefix.length, 5); assert.equal(k.prefix + k.suffix, k.hash);
 assert.equal(k.list[k.matchIndex], k.suffix);
 assert.equal(new Set(k.list).size, k.list.length);
 assert.equal(S.kanonQuiz.options[S.kanonQuiz.correct].includes('5 pierwszych'), true);
});

test('securityCheck: miernik — popularne i przewidywalne hasła padają od razu, długość bije złożoność', () => {
 const a = Object.fromEntries(S.samples.map(p => [p, S.analyzePassword(p)]));
 assert.equal(a['Kocham12'].level, 0); assert.equal(a['zaq1@WSX'].level, 0); assert.equal(a['P@ssw0rd!'].level, 0);
 assert.ok(a['P@ssw0rd!'].findings.some(f => f.includes('zamiana')), 'wykrywa zamiany typu @ za a');
 assert.equal(a['Xk9#mP2q'].level, 2, '8 losowych znaków: średnie');
 assert.ok(a['rower-kubek-chmura-sanki'].level >= 3);
 const strongest = S.samples.reduce((best, p, i) => a[p].guesses > a[S.samples[best]].guesses ? i : best, 0);
 assert.equal(strongest, S.STRONGEST);
 assert.equal(S.analyzePassword('Kuba2009!').level, 0);
 assert.ok(S.analyzePassword('Kuba2009!').findings.some(f => f.includes('2009')));
 assert.ok(S.analyzePassword('qwertyuiopasdfgh').findings.some(f => f.includes('klawiatury')));
 assert.equal(S.analyzePassword('aaaaaaaaaaaaaaaa').level, 0);
 assert.equal(S.analyzePassword('').level, 0);
 // ostrożnie: ciąg liter wyglądający jak słowo traktujemy jak słowo ze słownika
 assert.ok(S.analyzePassword('zielony').guesses <= S.BIG_DICT);
 assert.ok(S.analyzePassword('Tr0mb0n-Kaktus-Wiadro-7').level >= 3);
 assert.equal(S.humanTime(0.5), 'natychmiast (poniżej sekundy)');
 assert.equal(S.humanTime(7.7 * 86400), 'ok. 8 dni');
 assert.equal(S.znaki(1), 'znak'); assert.equal(S.znaki(4), 'znaki'); assert.equal(S.znaki(12), 'znaków'); assert.equal(S.znaki(22), 'znaki');
});

test('securityCheck: fraza treningowa — cel, podpowiedzi, wynik bez zapisu frazy', () => {
 assert.equal(S.checkPhrase('rower-kubek').ok, false);
 assert.match(S.checkPhrase('rower-kubek').text, /Za krótko/);
 assert.equal(S.checkPhrase('rower-kubek-chmura-sanki').ok, false, 'przykład nie może być własną frazą');
 assert.match(S.checkPhrase('kasia2009kasia2009').text, /przewidywalne/);
 const ok = S.checkPhrase('Trombon-kaktus-wiadro-tango');
 assert.equal(ok.ok, true);
 const st = {strongest: S.answerQuiz({}, S.STRONGEST, S.STRONGEST), phrase: {ok: true, tries: 2, length: ok.a.length, time: ok.a.time}, kanon: S.answerQuiz({}, S.kanonQuiz.correct, S.kanonQuiz.correct)};
 const r = S.passwordResult(st);
 assert.deepEqual([r.done, r.score, r.max], [true, 2.5, 3]);
 assert.ok(!r.summary.includes('Trombon'), 'podsumowanie nie zawiera frazy');
});

// ---------- securityCheck: audyt ----------
test('securityCheck audyt: dane spójne — jedna najlepsza opcja na lukę, stan wyjściowy to luka, opisy przy każdej opcji', () => {
 assert.equal(S.rows.length, S.MAX.audit);
 for (const r of S.rows) {
  assert.equal(r.options.filter(o => o.verdict === 'best').length, 1, r.id);
  assert.equal(r.options[0].verdict, 'bad', `${r.id}: zaczyna od luki`);
  for (const o of r.options) assert.ok(o.fb.length > 30, `${r.id}/${o.id}`);
 }
 for (const d of S.devices) assert.ok(S.rows.some(r => r.device === d.id), d.id);
 assert.equal(S.riskOf({}), 100);
 assert.equal(S.riskLevel(100), 'wysokie');
});

test('securityCheck audyt: poprawki obniżają ryzyko, pułapki je podnoszą, punkty za pierwszy wybór', () => {
 let st = {};
 for (const r of S.rows) st = S.setOption(st, r.id, r.options.find(o => o.verdict === 'best').id);
 let res = S.auditResult(st);
 assert.deepEqual([res.done, res.score, res.risk, res.fixed], [true, 12, 0, 12]);
 assert.match(res.summary, /100 → 0\/100 \(niskie\), naprawione 12\/12/);
 const trapped = S.setOption(st, 'firewall', 'off');
 assert.ok(S.auditResult(trapped).risk > 0, 'wyłączona zapora podnosi ryzyko');
 assert.equal(S.auditResult(trapped).score, 12, 'ustawienia w porządku nie dają ani nie zabierają punktów');
 let s2 = S.setOption({}, 'crack', 'exclude');
 assert.equal(S.auditResult(s2).risk, 100, 'pułapka nie obniża ryzyka');
 s2 = S.setOption(s2, 'crack', 'clean');
 assert.equal(S.auditResult(s2).score, 0.5);
 assert.ok(S.auditResult(s2).risk < 100);
 const wpa2 = S.setOption({}, 'wifi', 'wpa2');
 assert.equal(S.auditResult(wpa2).score, 1, 'WPA2 z długim hasłem też zaliczone');
 assert.equal(S.setOption({}, 'nope', 'x').sel, undefined);
 assert.equal(S.auditResult({}).summary, undefined);
});

test('securityCheck plan: maks. 5 rzeczy na dziś, „już mam” zmniejsza wymaganie, bez punktów', () => {
 let st = {};
 for (const it of S.planItems.slice(0, 5)) st = S.setPlan(st, it.id, 'today');
 assert.equal(S.planResult(st).done, true);
 assert.equal(S.planResult(st).max, 0);
 const six = S.setPlan(st, S.planItems[5].id, 'today');
 assert.match(six.msg, /5 rzeczy/);
 assert.equal(S.planResult(six).today.length, 5);
 st = S.setPlan(st, S.planItems[0].id, null);
 assert.equal(S.planResult(st).done, false);
 let many = {};
 for (const it of S.planItems.slice(0, 9)) many = S.setPlan(many, it.id, 'have');
 for (const it of S.planItems.slice(9)) many = S.setPlan(many, it.id, 'today');
 assert.equal(S.planResult(many).need, 3); assert.equal(S.planResult(many).done, true);
 assert.match(S.planResult(many).summary, /^Mój plan na dziś:/);
});

// ---------- Lekcje 58 i 59 ----------
test('Lekcje 58 i 59: tytuły z rozkładu, kolejność, czas, maksymalny wynik na karcie', () => {
 assert.deepEqual([lesson58.id, lesson58.grade, lesson58.order, lesson58.title], ['58', 1, 31, 'Sieci komputerowe']);
 assert.deepEqual([lesson59.id, lesson59.grade, lesson59.order, lesson59.title], ['59', 1, 32, 'Bezpieczeństwo i ochrona danych w komputerach i sieciach komputerowych']);
 for (const l of [lesson58, lesson59]) {
  assert.equal(l.duration, 45);
  assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
  assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
  assert.equal(l.sections[0].id, 'start');
  for (const a of l.sections.flatMap(s => s.activities)) if (a.type === 'netLab' || a.type === 'securityCheck') {
   const max = (a.type === 'netLab' ? N.MAX : S.MAX)[a.mode];
   assert.equal(a.points || 0, max, `${a.id}: points = max trybu`);
  }
 }
 // Pełne rozwiązanie lekcji 58.
 const net = (() => {
  const good = Object.fromEntries(N.classifyItems.map((it, i) => [i, it.kind]));
  const v = {address: {classify: N.checkClassify({picks: good}), nat: N.answerQuiz(N.natQuiz, {}, N.natQuiz.correct)}, packets: {}, cmd: {mode: 'sample', inputs: {ipv4: '192.168.10.57', gateway: '192.168.10.1', ping: '12', hops: '8'}}, passport: {conclusion: 'Najpierw ping do bramy, potem do serwera gry w Europie.'}};
  for (const k of ['order', 'reroute', 'game']) v.packets[k] = N.answerQuiz(N.packetQuizzes[k], {}, N.packetQuizzes[k].correct);
  v.packets.missing = N.answerQuiz(N.missingQuiz, {}, N.missingQuiz.correct);
  for (const f of N.CMD_FIELDS) v.cmd = N.checkField(v.cmd, f);
  const r = N.netResult(v);
  return {...v, modes: Object.fromEntries(Object.entries(r).map(([k, x]) => [k, {done: x.done, score: x.score, max: x.max, summary: x.summary}]))};
 })();
 const solveChoices = l => Object.fromEntries(l.sections.flatMap(s => s.activities).filter(a => a.type === 'choice').map(a => [a.id, {selected: a.correct[0], done: true, first: true}]));
 const solveMatching = l => Object.fromEntries(l.sections.flatMap(s => s.activities).filter(a => a.type === 'matching').map(a => [a.id, {answers: Object.fromEntries(a.rows.map((r, i) => [i, r.correct[0]])), done: true}]));
 const card58 = lesson58.sections.at(-1).activities.find(a => a.type === 'resultCard');
 const r58 = lessonScore(lesson58, card58, {...solveChoices(lesson58), ...solveMatching(lesson58), net});
 assert.equal(r58.max, 17); assert.equal(r58.score, 17);
 assert.ok(r58.rows.some(x => x.summary?.startsWith('Paszport połączenia')));
 assert.equal(lessonScore(lesson58, card58, {}).max, 17);
 // Pełne rozwiązanie lekcji 59.
 let audit = {};
 for (const r of S.rows) audit = S.setOption(audit, r.id, r.options.find(o => o.verdict === 'best').id);
 const ph = S.checkPhrase('Trombon-kaktus-wiadro-tango');
 const secV = {password: {strongest: S.answerQuiz({}, S.STRONGEST, S.STRONGEST), phrase: {ok: true, tries: 1, length: ph.a.length, time: ph.a.time}, kanon: S.answerQuiz({}, S.kanonQuiz.correct, S.kanonQuiz.correct)}, audit};
 const sr = S.secResult(secV);
 const sec = {...secV, modes: Object.fromEntries(Object.entries(sr).map(([k, x]) => [k, {done: x.done, score: x.score, max: x.max, summary: x.summary}]))};
 const card59 = lesson59.sections.at(-1).activities.find(a => a.type === 'resultCard');
 const r59 = lessonScore(lesson59, card59, {...solveChoices(lesson59), ...solveMatching(lesson59), sec});
 assert.equal(r59.max, 21); assert.equal(r59.score, 21);
 assert.ok(r59.rows.some(x => x.summary?.startsWith('Audyt Kuby')));
 assert.equal(lessonScore(lesson59, card59, {}).max, 21);
});
