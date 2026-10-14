// Testy lekcji 44–50 klasy 2 (bazy Zawody, iteracje, algorytmy na liczbach, ułamki) i symulatora numberLab.
// Uruchom: node --test tests/sims-g2-numbers.test.mjs
// Zadania pythonLab są wykonywane w prawdziwym Pyodide (node_modules) tym samym RUNNER_PY co w przeglądarce.
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPyodide} from 'pyodide';
import * as N from '../content/sims/numberLab.js';
import * as P from '../content/sims/pythonLab.js';
import {lessonScore} from '../content/scoring.js';
import l22 from '../content/lessons/22-swimming-database.js';
import l25 from '../content/lessons/25-queries-zawody.js';
import l44 from '../content/lessons/44-swimming-database-g2.js';
import l45 from '../content/lessons/45-queries-zawody-g2.js';
import l46 from '../content/lessons/46-iterative-python.js';
import l47 from '../content/lessons/47-number-algorithms.js';
import l48 from '../content/lessons/48-number-algorithms-python.js';
import l49 from '../content/lessons/49-fractions.js';
import l50 from '../content/lessons/50-fractions-python.js';

const ALL = [l44, l45, l46, l47, l48, l49, l50];
const acts = l => l.sections.flatMap(s => s.activities);
const labs = l => acts(l).filter(a => a.type === 'pythonLab');

/* ───────── Algorytmy (wartości z lekcji 47 i 49) ───────── */
test('NWD: obie wersje Euklidesa, liczniki kroków i przykłady z lekcji', () => {
  for (let a = 1; a < 60; a++) for (let b = 1; b < 60; b++) {
    const s = N.gcdSubSteps(a, b), m = N.gcdModSteps(a, b);
    assert.equal(s.gcd, N.gcd(a, b)); assert.equal(m.gcd, N.gcd(a, b));
    assert.equal(N.gcdSubCount(a, b), s.steps.length, `${a},${b}`);
  }
  assert.equal(N.gcd(240, 180), 60); assert.equal(N.gcd(84, 36), 12); assert.equal(N.gcd(0, 5), 5); assert.equal(N.gcd(0, 0), 0); assert.equal(N.gcd(-12, 18), 6);
  assert.deepEqual(N.raceRow(240, 180), {a: 240, b: 180, gcd: 60, sub: 3, mod: 2});
  assert.deepEqual(N.raceRow(100, 7), {a: 100, b: 7, gcd: 1, sub: 18, mod: 3});
  assert.deepEqual(N.raceRow(1000000, 3), {a: 1000000, b: 3, gcd: 1, sub: 333335, mod: 2});
  assert.equal(N.gcdSubSteps(48, 18).steps.length, 4); assert.equal(N.gcdModSteps(48, 18).steps.length, 3);
  assert.equal(N.lcm(12, 18), 36); assert.equal(N.lcm(4, 6), 12); assert.equal(N.lcm(30, 20), 60); assert.equal(N.lcm(0, 5), 0);
});

test('Pierwszość i rozkład: sprawdzanie do pierwiastka, słupek, zapis potęgami', () => {
  const primes = [];
  for (let n = 0; n < 1000; n++) if (N.isPrime(n)) primes.push(n);
  assert.equal(primes.length, 168);
  assert.equal(N.isPrime(1), false); assert.equal(N.isPrime(2), true); assert.equal(N.isPrime(91), false);
  assert.deepEqual(N.primeSteps(91).steps.map(s => s.d), [2, 3, 4, 5, 6, 7]);
  assert.equal(N.primeSteps(91).divisor, 7);
  const p97 = N.primeSteps(97); assert.equal(p97.prime, true); assert.equal(p97.steps.length, 8); assert.equal(p97.steps.at(-1).d, 9);
  assert.deepEqual(N.factorSteps(360).map(s => s.p), [2, 2, 2, 3, 3, 5]);
  assert.equal(N.factorString(360), '2³ · 3² · 5'); assert.equal(N.factorString(1001), '7 · 11 · 13'); assert.equal(N.factorString(221), '13 · 17');
  for (let n = 2; n < 400; n++) assert.equal(N.factorSteps(n).reduce((p, s) => p * s.p, 1), n);
});

test('Ułamki: skracanie, działania i porównanie z wartością dziesiętną', () => {
  assert.deepEqual(N.simplify(18, 24), [3, 4]); assert.deepEqual(N.simplify(1, -2), [-1, 2]); assert.deepEqual(N.simplify(0, 5), [0, 1]); assert.equal(N.simplify(5, 0), null);
  assert.deepEqual(N.addF([1, 2], [1, 3]), [5, 6]); assert.deepEqual(N.subF([3, 4], [1, 6]), [7, 12]); assert.deepEqual(N.addF([1, 4], [1, 12]), [1, 3]);
  assert.deepEqual(N.mulF([3, 4], [4, 5]), [3, 5]); assert.deepEqual(N.mulF([2, 3], [3, 2]), [1, 1]); assert.deepEqual(N.addF([2, 3], [1, 4]), [11, 12]);
  for (let a = -5; a <= 5; a++) for (let b = 1; b <= 6; b++) for (let c = -5; c <= 5; c++) for (let d = 1; d <= 6; d++) {
    const s = N.addF([a, b], [c, d]); assert.ok(Math.abs(s[0] / s[1] - (a / b + c / d)) < 1e-12); assert.equal(N.gcd(s[0], s[1]), 1); assert.ok(s[1] > 0);
    const m = N.mulF([a, b], [c, d]); assert.ok(Math.abs(m[0] / m[1] - (a / b) * (c / d)) < 1e-12);
  }
});

test('Geometria Euklidesa: kwadraty wypełniają prostokąt, ostatni ma bok NWD', () => {
  for (const [a, b] of [[240, 180], [84, 36], [100, 7]]) for (const method of ['sub', 'mod']) {
    const g = N.rectCuts(a, b, method);
    const area = g.flatMap(x => x.squares).reduce((s, q) => s + q.s * q.s, 0);
    const rest = g.at(-1).rest;
    assert.equal(area + rest.w * rest.h, a * b, `${a}×${b} ${method}`);
    if (method === 'sub') { assert.equal(rest.w, N.gcd(a, b)); assert.equal(rest.h, N.gcd(a, b)); assert.equal(g.length, N.gcdSubCount(a, b)); }
    else { assert.equal(g.length, N.gcdModSteps(a, b).steps.length); assert.equal(g.at(-1).squares.at(-1).s, N.gcd(a, b)); }
  }
});

/* ───────── Symulator numberLab: zadania, odpowiedzi, punktacja ───────── */
test('numberLab: każdy krok ma poprawny klucz, a pełne rozwiązanie = komplet punktów', () => {
  for (const [mode, meta] of Object.entries(N.MODES)) {
    assert.ok(meta.tasks.length >= 3, mode);
    for (const t of meta.tasks) {
      assert.ok(t.title && t.story && t.points > 0 && t.steps.length, `${mode}/${t.id}`);
      for (const s of t.steps) {
        assert.ok(s.prompt && s.hint, `${t.id}: prompt i wskazówka`);
        const input = s.kind === 'frac' ? s.answer.map(String) : s.kind === 'num' ? String(s.answer) : s.answer;
        assert.equal(N.checkStep(s, input).ok, true, `${t.id}: ${s.prompt}`);
        if (s.kind === 'choice' || s.kind === 'yesno') assert.ok(s.answer >= 0 && s.answer < s.options.length);
        if (s.kind === 'frac') assert.equal(N.gcd(s.answer[0], s.answer[1]), 1, `${t.id}: wynik skrócony`);
      }
    }
    const full = N.solveMode(mode);
    assert.equal(full.done, true); assert.equal(full.score, full.max, mode); assert.ok(full.summary);
    const withError = N.solveMode(mode, 1);
    assert.ok(withError.score < full.max && withError.score >= full.max / 2, `${mode}: pomyłka obniża punkty, ale nie zeruje`);
  }
  assert.deepEqual(N.modeResult('prime', undefined), {done: false, score: 0, max: 6, summary: undefined});
});

test('numberLab: informacja zwrotna rozpoznaje typowe błędy i nie karze za literówki', () => {
  const add = N.MODES.addsub.tasks[0];
  const res = add.steps.find(s => s.kind === 'frac');
  const naive = N.checkStep(res, ['2', '5']);
  assert.equal(naive.ok, false); assert.match(naive.text, /liczników i mianowników osobno/); assert.deepEqual(naive.frac, [2, 5]);
  const train = N.MODES.addsub.tasks[2].steps.find(s => s.kind === 'frac');
  const near = N.checkStep(train, ['4', '12']);
  assert.equal(near.near, true); assert.match(near.text, /nie jest skrócony/);
  assert.equal(N.checkStep(res, ['1', '0']).ok, false);
  const nwd = N.MODES.simplify.tasks[0].steps[0];
  assert.match(N.checkStep(nwd, '2').text, /nie jest NWD/);
  assert.equal(N.checkStep(nwd, 'abc').invalid, true);
  const fuel = N.MODES.mix.tasks[0].steps[1];
  assert.match(N.checkStep(fuel, ['1', '50']).text, /51 części/);
  const fac = N.MODES.factor.tasks[0].steps[0];
  assert.match(N.checkStep(fac, '7').text, /reszta/); assert.match(N.checkStep(fac, '4').text, /mniejszy dzielnik/);
  const mod = N.MODES.euclid.tasks[1].steps[0];
  assert.match(N.checkStep(mod, '1').text, /iloraz/);
  // literówka (tekst) i wynik nieskrócony nie zwiększają licznika pomyłek
  let st = N.answerStep(N.MODES.simplify.tasks[0], {}, 'x').st;
  assert.equal(st.errors, 0); assert.equal(st.step, 0);
  st = N.answerStep(N.MODES.simplify.tasks[0], st, '3').st;
  assert.equal(st.errors, 1);
  st = N.answerStep(N.MODES.simplify.tasks[0], st, '6').st;
  assert.equal(st.step, 1);
  let tr = {};
  const tt = N.MODES.addsub.tasks[2];
  for (const s of tt.steps.slice(0, 3)) tr = N.answerStep(tt, tr, String(s.answer)).st;
  tr = N.answerStep(tt, tr, ['4', '12']).st;
  assert.equal(tr.errors, 0); assert.equal(tr.done, undefined);
  tr = N.answerStep(tt, tr, ['1', '3']).st;
  assert.equal(tr.done, true); assert.equal(N.taskScore(tt, tr), tt.points);
  assert.equal(N.taskUnlocked('prime', {}, 1), false); assert.equal(N.taskUnlocked('prime', {}, 0), true);
});

/* ───────── Lekcje: rozkład, czasy, karty wyniku ───────── */
const ROZKLAD = {
  '44': [8, 'Podstawowe pojęcia i przykłady bazy danych – obsługa szkolnych zawodów pływackich'],
  '45': [9, 'Zasady tworzenia kwerend na przykładzie bazy Zawody'],
  '46': [20, 'Programowanie algorytmów iteracyjnych'],
  '47': [21, 'Wybrane algorytmy na liczbach'],
  '48': [22, 'Programowanie wybranych algorytmów na liczbach'],
  '49': [23, 'Działania na ułamkach zwykłych z wykorzystaniem NWD i NWW'],
  '50': [24, 'Programowanie działań na ułamkach z wykorzystaniem NWD i NWW']
};
test('Lekcje 44–50: klasa 2, numer i tytuł z rozkładu, 45 minut, 4–7 etapów, metody COVE, bez pracy domowej', () => {
  for (const l of ALL) {
    const [order, title] = ROZKLAD[l.id];
    assert.equal(l.grade, 2); assert.equal(l.order, order); assert.equal(l.title, title);
    assert.equal(l.duration, 45); assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
    assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
    assert.ok(l.format.methods.length >= 3);
    assert.ok(!/w domu|praca domowa|przed lekcją/i.test(JSON.stringify(l.sections.map(s => [s.intro, s.title]))), l.id);
    assert.ok(acts(l).some(a => a.type === 'resultCard'));
    assert.equal(l.sections[0].id, 'start');
    assert.ok(l.sections[0].activities.filter(a => a.type === 'choice').length >= 2, `${l.id}: retrieval na starcie`);
  }
  // metody różnią się między nowymi lekcjami (różne zestawy)
  const sets = [l46, l47, l48, l49, l50].map(l => l.format.methods.map(m => m.name).sort().join('|'));
  assert.equal(new Set(sets).size, sets.length);
  // domyślnie praca samodzielna: brak etapów „pair”/„trio” w nowych lekcjach i wrapperach
  for (const l of ALL) assert.ok(l.sections.every(s => !['pair', 'trio', 'group'].includes(s.grouping)), l.id);
});

test('Wrappery 44 i 45: bazują na 22 i 25, zmieniają tylko start, organizację i ID', () => {
  assert.equal(l44.sections.length, l22.sections.length);
  assert.ok(!acts(l44).some(a => a.id === 'zw-byte'));
  assert.ok(acts(l44).some(a => a.id === 'zw2-filter'));
  assert.deepEqual(acts(l44).filter(a => a.type === 'zawodyExplorer'), acts(l22).filter(a => a.type === 'zawodyExplorer'));
  assert.deepEqual(acts(l45).filter(a => a.type === 'queryDesigner'), acts(l25).filter(a => a.type === 'queryDesigner'));
  assert.match(acts(l45).find(a => a.id === 'zq-type').question, /lekcji o zawodach/);
  assert.equal(l22.id, '22'); assert.equal(l22.grade, 3); assert.equal(l25.id, '25'); assert.equal(l25.grade, 3);
});

test('Karty wyniku: pełne odpowiedzi = 100% i najwyższa odznaka; pusto = 0', () => {
  for (const l of ALL) {
    const card = acts(l).find(a => a.type === 'resultCard');
    assert.equal(lessonScore(l, card, {}).score, 0);
    const answers = {};
    for (const a of acts(l)) {
      if (a.type === 'choice') answers[a.id] = {selected: a.correct[0], done: true, first: true};
      else if (a.type === 'matching') answers[a.id] = {done: true};
      else if (a.type === 'numberLab') answers[a.id] = N.solveMode(a.mode);
      else if (a.type === 'pythonLab') {
        const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
        const v = {q, passedAll: true, solvedScore: a.points, ranOk: true, visitedEnd: true, bestPassed: a.tests?.length, predict: {checked: true, ok: true}};
        answers[a.id] = {...v, ...P.labResult(a, v)};
      } else if (a.points && a.type !== 'resultCard') answers[a.stateKey || a.id] = {...(answers[a.stateKey || a.id] || {}), modes: {...(answers[a.stateKey || a.id]?.modes || {}), [a.mode]: {done: true, score: a.points, max: a.points}}};
    }
    const r = lessonScore(l, card, answers);
    assert.equal(r.score, r.max, l.id); assert.ok(r.max >= 15, l.id);
    assert.equal(r.badge.name, [...card.badges].sort((a, b) => b.min - a.min)[0].name);
    for (const id of card.sources) assert.ok(acts(l).some(a => a.id === id || a.stateKey === id), `${l.id}: ${id}`);
  }
});

/* ───────── Zadania pythonLab w prawdziwym Pythonie ───────── */
const py = await loadPyodide({indexURL: new URL('../node_modules/pyodide/', import.meta.url).pathname});
py.runPython(P.RUNNER_PY);
const runFn = py.globals.get('_pl_run');
const run = req => JSON.parse(runFn(JSON.stringify(req)));

for (const lesson of [l46, l48, l50]) {
  test(`${lesson.id}: rozwiązania wzorcowe przechodzą wszystkie testy, kod startowy nie, pułapki układanek psują testy`, () => {
    const ids = new Set();
    for (const a of labs(lesson)) {
      assert.ok(!ids.has(a.id)); ids.add(a.id);
      assert.ok(['code', 'parsons', 'trace', 'predict'].includes(a.mode) && a.title && a.prompt, a.id);
      if (a.mode === 'code' && a.tests?.length) {
        const r = run({code: a.solution, stdin: a.stdin || [], tests: a.tests});
        assert.equal(r.error, null, `${a.id}: rozwiązanie bez błędu ${JSON.stringify(r.error)}`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: ${JSON.stringify(r.tests.filter(t => !t.ok))}`);
        assert.ok(P.sourceChecks(a.solution, a.sourceChecks).every(t => t.ok), `${a.id}: sprawdzenia kodu`);
        const s = a.loops ? run({code: a.starter, trace: true, maxSteps: 3000}) : run({code: a.starter, stdin: a.stdin || [], tests: a.tests});
        if (a.loops) assert.equal(s.stop, 'steps', `${a.id}: start z pętlą nieskończoną`);
        const passes = !s.error && !s.stop && s.tests?.every(t => t.ok) && P.sourceChecks(a.starter, a.sourceChecks).every(t => t.ok);
        assert.ok(!passes, `${a.id}: kod startowy nie może przechodzić testów`);
        assert.ok(a.hints?.length >= 1);
      } else if (a.mode === 'code') {
        const r = run({code: a.starter, stdin: a.stdin || []});
        assert.equal(r.error, null, a.id); assert.equal(r.stop, null, a.id);
      }
      if (a.mode === 'parsons') {
        const blocks = P.parsonsBlocks(a).filter(b => !b.distractor);
        const r = run({code: P.parsonsCode(a, blocks.map(b => ({id: b.id, indent: b.indent}))), tests: a.tests});
        assert.equal(r.error, null, a.id); assert.ok(r.tests.every(t => t.ok), a.id);
        for (const [i, d] of (a.distractors || []).entries()) {
          const similar = blocks.findIndex(b => b.text.split(/[ (=]/)[0] === d.split(/[ (=]/)[0]);
          assert.ok(similar >= 0, `${a.id}: pułapka „${d}” ma podobną linię`);
          const prog = blocks.map(b => ({id: b.id, indent: b.indent}));
          prog[similar] = {id: `d${i}`, indent: blocks[similar].indent};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests});
          assert.ok(rr.error || rr.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” powinna oblać testy`);
        }
      }
      if (a.mode === 'predict') {
        const r = run({code: a.code});
        assert.equal(r.error, null); assert.ok(P.outputLines(r.stdout).length <= (a.predictRows || 3) + 1, a.id);
      }
      if (a.mode === 'trace') {
        const r = run({code: a.code, trace: true, maxSteps: P.MAX_TRACE_STEPS});
        assert.equal(r.error, null); assert.equal(r.stop, null, `${a.id}: w limicie kroków`);
      }
      for (const q of a.questions || []) {
        assert.ok(q.q && q.explain && q.hint, `${a.id}: pytanie z wyjaśnieniem i wskazówką`);
        if (q.options) assert.ok(q.correct.every(i => i >= 0 && i < q.options.length)); else assert.ok(P.checkQuestion(q, q.answer));
      }
      if (a.requires) assert.ok(labs(lesson).some(b => b.id === a.requires), `${a.id}: requires`);
    }
  });
}

test('Odpowiedzi do pytań i przewidywań wynikają z tego, co naprawdę liczy program', () => {
  const act = id => [l46, l48, l50].flatMap(labs).find(a => a.id === id);
  const out = (id, extra = '') => run({code: (act(id).solution || act(id).starter || act(id).code) + extra}).stdout;
  const val = (id, expr) => run({code: act(id).solution, tests: [{call: expr, expected: '0'}]}).tests[0].got;
  // 46
  assert.equal(out('it-predict').trim(), '1 3\n2 9\n3 27\n4 81');
  assert.ok(run({code: act('it-trace').code, trace: true}).steps.some(s => s.g.i?.r === '4' && s.g.wynik?.r === '24'));
  assert.match(out('it-trace'), /5 piosenek można ułożyć na 120 sposobów/);
  assert.equal(val('it-bug', 'silnia(10)'), '3628800');
  assert.equal(val('it-reach', 'dni_do_zasiegu(100, 3, 1000000)'), '9');
  assert.equal(val('it-loan', 'ile_miesiecy(2000, 2, 200)'), '12');
  const stuck = run({code: act('it-loan').solution.split('\n\nprint')[0] + '\nprint(ile_miesiecy(2000, 10, 200))', trace: true, maxSteps: 2000});
  assert.equal(stuck.stop, 'steps', 'przy 10% i racie 200 zł dług stoi w miejscu');
  // 48
  assert.match(out('ln-trace'), /NWD = 6 po 3 krokach/);
  assert.ok(run({code: act('ln-trace').code, trace: true}).steps.some(s => s.g.krok?.r === '1' && s.g.b?.r === '12'));
  assert.equal(out('ln-predict').trim(), '6 4');
  assert.match(out('ln-prime-bug'), /: 168$/m);
  assert.match(out('ln-race'), /1000000 3 → 333335 odejmowań, 2 dzieleń/);
  assert.equal(val('ln-gcd', 'nwd(12, -18)'), '-6');
  assert.match(out('ln-lcm'), /po 36 minutach/);
  assert.equal(val('ln-lcm', 'nww(4, 6)'), '12');
  // 50
  assert.equal(out('fp-predict').trim(), '6\n8\n8 / 6');
  assert.equal(out('fp-float').trim().split('\n').join('|'), '0.8333333333333333|0.30000000000000004|5/6|3/4');
  assert.equal(val('fp-calc', 'kalkulator((3, 4), "*", (3, 2))'), "'9/8'");
});
