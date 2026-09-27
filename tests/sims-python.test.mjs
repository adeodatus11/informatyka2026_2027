// Testy środowiska Python w przeglądarce (pythonLab) i lekcji 17, 19, 20, 21.
// Uruchom: node --test tests/sims-python.test.mjs
// Kod Pythona wykonuje prawdziwe Pyodide (z node_modules) — ten sam RUNNER_PY co Web Worker w przeglądarce.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {loadPyodide} from 'pyodide';
import * as P from '../content/sims/pythonLab.js';
import {lessonScore} from '../content/scoring.js';

const LESSONS = ['17-cipher-python', '19-bubble-sort', '20-insertion-sort', '21-sequences-fibonacci'];
const lessons = [];
for (const f of LESSONS) {
  const url = new URL(`../content/lessons/${f}.js`, import.meta.url);
  if (existsSync(url)) lessons.push((await import(url)).default);
}
const py = await loadPyodide({indexURL: new URL('../node_modules/pyodide/', import.meta.url).pathname});
py.runPython(P.RUNNER_PY);
const runFn = py.globals.get('_pl_run');
const run = req => JSON.parse(runFn(JSON.stringify(req)));
const labs = l => l.sections.flatMap(s => s.activities).filter(a => a.type === 'pythonLab');

test('Pliki Pyodide w public/pyodide są kompletne i zgodne z wersją z npm', () => {
  for (const f of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    const pub = new URL(`../public/pyodide/${f}`, import.meta.url), npm = new URL(`../node_modules/pyodide/${f}`, import.meta.url);
    assert.ok(existsSync(pub), `brak public/pyodide/${f}`);
    if (f.endsWith('.mjs') || f.endsWith('.json')) assert.equal(readFileSync(pub, 'utf8'), readFileSync(npm, 'utf8'), `${f} różni się od node_modules`);
  }
});

test('Runner: print, input z pola danych, brak danych, limit wyjścia, śledzenie', () => {
  let r = run({code: 'x = input("Ile? ")\nprint("Razy dwa:", int(x) * 2)', stdin: ['21']});
  assert.equal(r.stdout, 'Ile? 21\nRazy dwa: 42\n');
  r = run({code: 'x = input()', stdin: []});
  assert.equal(r.stop, 'input');
  r = run({code: 'while True:\n    print("bez końca")'});
  assert.equal(r.stop, 'output');
  r = run({code: 'try:\n    x = input()\nexcept Exception:\n    print("złapane")'});
  assert.equal(r.stop, 'input', 'except Exception nie może połknąć braku danych');
  r = run({code: 'a = [3, 1]\nfor i in range(2):\n    a[i] += 1\nprint(a)', trace: true});
  assert.equal(r.steps.at(-1).ev, 'end');
  assert.deepEqual(r.steps.at(-1).g.a.items, ['4', '2']);
  assert.ok(r.steps.some(s => s.line === 3 && s.g.i?.r === '1'));
  r = run({code: 'i = 0\nwhile True:\n    i += 1', trace: true, maxSteps: 50});
  assert.equal(r.stop, 'steps');
  assert.equal(r.steps.length, 51);
  r = run({code: 'def f(n):\n    return n * 2\nprint(f(4))', trace: true});
  assert.ok(r.steps.some(s => s.ev === 'return' && s.ret === '8' && s.l.n.r === '4'));
});

test('Runner: testy funkcji, testy programu, tolerancja i krotki', () => {
  const r = run({code: 'def dodaj(a, b):\n    return a + b\nprint("ok")', tests: [
    {call: 'dodaj(2, 3)', expected: '5'}, {call: 'dodaj("a", "b")', expected: "'ab'"}, {call: 'dodaj(1, 1)', expected: '3'},
    {call: 'dodaj(0.1, 0.2)', expected: '0.3', tol: 1e-6}, {call: 'dodaj(1)', expected: '1'}, {call: '([1], 2)', expected: '[[1], 2]'},
    {output: 'ok'}, {contains: ['o']}, {output: 'nie'}]});
  assert.deepEqual(r.tests.map(t => t.ok), [true, true, false, true, false, true, true, true, false]);
  assert.equal(r.tests[2].got, '2');
  assert.equal(r.tests[4].error.type, 'TypeError');
});

test('Błędy Pythona dostają polski tytuł i wskazówkę', () => {
  const cases = [
    ['for i in range(3)\n    print(i)', 'SyntaxError', /dwukropka/],
    ['for i in range(3):\nprint(i)', 'IndentationError', /wcięcia/i],
    ['x = 1\n    y = 2', 'IndentationError', /wcięcie/i],
    ['wynik = 5\nprint(wyniki)', 'NameError', /wyniki/],
    ['wiek = 16\nprint("Masz " + wiek)', 'TypeError', /Tekst \+ liczba/],
    ['x = input()\nprint(x + 1)', 'TypeError', /Tekst \+ liczba/],
    ['a = [1, 2]\nprint(a[2])', 'IndexError', /poza zakresem/],
    ['print(5 / 0)', 'ZeroDivisionError', /zero/],
    ['if x = 3:\n    pass', 'SyntaxError', /==/],
    ['print("a"', 'SyntaxError', /nawias/i],
    ['print "a"', 'SyntaxError', /nawias/],
    ['int("abc")', 'ValueError', /liczba/],
    ['ord("AB")', 'TypeError', /ord/],
    ['def f(n):\n    return f(n + 1)\nf(1)', 'RecursionError', /samą siebie/],
  ];
  for (const [code, type, re] of cases) {
    const r = run({code, stdin: ['7']});
    assert.equal(r.error?.type, type, code);
    const e = P.explainError(r.error, code);
    assert.match(`${e.title} ${e.hint}`, re, code);
    assert.notEqual(e.title, 'Błąd w programie', code);
    assert.ok(e.line >= 1, 'numer linii');
  }
  assert.match(P.STOP_MESSAGES.timeout.title, /za długo/);
});

test('Edytor: Tab, Shift+Tab, Enter z auto-wcięciem, Backspace w wcięciu', () => {
  let e = P.editorKey('x', 0, 0, 'Tab');
  assert.equal(P.applyEdit('x', e), '    x');
  e = P.editorKey('for i in a:', 11, 11, 'Enter');
  assert.equal(e.insert, '\n    ');
  e = P.editorKey('    if x:  # komentarz', 22, 22, 'Enter');
  assert.equal(e.insert, '\n        ');
  e = P.editorKey('        return x', 16, 16, 'Enter');
  assert.equal(e.insert, '\n    ');
  e = P.editorKey('        ', 8, 8, 'Backspace');
  assert.equal(P.applyEdit('        ', e), '    ');
  const t = 'a\n    b\nc';
  e = P.editorKey(t, 0, t.length, 'Tab');
  assert.equal(P.applyEdit(t, e), '    a\n        b\n    c');
  e = P.editorKey('    a\n    b', 0, 11, 'Tab', true);
  assert.equal(P.applyEdit('    a\n    b', e), 'a\nb');
  assert.equal(P.editorKey('ab', 1, 1, 'Backspace'), null);
});

test('Porównanie przewidywania ignoruje spacje przy przecinkach i nawiasach', () => {
  assert.ok(P.compareOutput('[1,4, 2,5,8]\n', '[1, 4, 2, 5, 8]\n').ok);
  assert.ok(P.compareOutput('Cześć,OLA\nO', 'Cześć, OLA\nO\n').ok);
  const c = P.compareOutput('O\nL', 'O\nL\nA\n');
  assert.equal(c.ok, false); assert.equal(c.matched, 2); assert.equal(c.total, 3);
});

test('Punktacja: podpowiedzi i poprawki obniżają punkty, ale nigdy do zera', () => {
  assert.equal(P.codeScore(6, {}), 6);
  assert.equal(P.codeScore(6, {fails: 1}), 6);
  assert.equal(P.codeScore(6, {hints: 1}), 5);
  assert.equal(P.codeScore(6, {hints: 5, fails: 9}), 2.5);
  assert.equal(P.codeScore(6, {solutionShown: true}), 1.5);
  assert.equal(P.parsonsScore(4, 0), 4); assert.equal(P.parsonsScore(4, 1), 3); assert.equal(P.parsonsScore(4, 9), 2);
  const data = {mode: 'code', points: 4, tests: [{}, {}, {}, {}], questions: [{q: 'a', answer: '1'}]};
  assert.deepEqual(P.labResult(data, {}), {done: false, score: 0, max: 5, summary: undefined});
  assert.equal(P.labResult(data, {bestPassed: 2}).score, 1);
  assert.equal(P.labResult(data, {passedAll: true, solvedScore: 4, q: {0: {ok: true, first: false}}}).score, 4.5);
  assert.equal(P.labResult(data, {passedAll: true, solvedScore: 4, q: {0: {ok: true, first: true}}}).done, true);
  assert.equal(P.labResult({mode: 'predict', points: 2}, {predict: {checked: true, ok: false}}).score, 1);
  assert.equal(P.labResult({mode: 'trace', points: 0}, {visitedEnd: true}).done, true);
  assert.ok(P.checkQuestion({answer: '1.618'}, ' 1,618 '));
  assert.ok(P.checkQuestion({answer: '600'}, '600 zł'));
});

test('Układanka: tasowanie deterministyczne, składanie kodu i recenzja', () => {
  const data = {id: 'x', solution: 'def f(a):\n    if a:\n        return 1\n    return 0\n', distractors: ['return 2']};
  const pool = P.parsonsPool(data);
  assert.deepEqual(pool, P.parsonsPool(data));
  assert.notDeepEqual(pool, ['b0', 'b1', 'b2', 'b3', 'd0']);
  const blocks = P.parsonsBlocks(data).filter(b => !b.distractor);
  const program = blocks.map(b => ({id: b.id, indent: b.indent}));
  assert.equal(P.parsonsCode(data, program), data.solution);
  assert.equal(P.parsonsReview(data, program).matches, true);
  const wrong = program.map((p, i) => i === 3 ? {...p, indent: 2} : p);
  assert.equal(P.parsonsReview(data, wrong).firstDiff, 3);
  assert.equal(P.parsonsReview(data, program.slice(0, 2)).missing, 2);
});

for (const lesson of lessons) {
  test(`${lesson.id}: każde zadanie pythonLab ma poprawne rozwiązanie wzorcowe i działa w Pyodide`, () => {
    const ids = new Set();
    for (const a of labs(lesson)) {
      assert.ok(['code', 'parsons', 'trace', 'predict'].includes(a.mode), `${a.id}: tryb`);
      assert.ok(a.title && a.prompt, `${a.id}: tytuł i polecenie`);
      assert.ok(!ids.has(a.id)); ids.add(a.id);
      if (a.mode === 'code' && a.tests?.length) {
        const r = run({code: a.solution, stdin: a.stdin || [], tests: a.tests});
        assert.equal(r.error, null, `${a.id}: rozwiązanie bez błędów`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: rozwiązanie przechodzi testy ${JSON.stringify(r.tests.filter(t => !t.ok))}`);
        assert.ok(P.sourceChecks(a.solution, a.sourceChecks).every(t => t.ok), `${a.id}: sprawdzenia kodu`);
        const s = a.loops ? run({code: a.starter, trace: true, maxSteps: 3000}) : run({code: a.starter, stdin: a.stdin || [], tests: a.tests});
        if (a.loops) assert.equal(s.stop, 'steps', `${a.id}: kod startowy ma pętlę nieskończoną`);
        const starterPasses = !s.error && !s.stop && s.tests?.every(t => t.ok) && P.sourceChecks(a.starter, a.sourceChecks).every(t => t.ok);
        assert.ok(!starterPasses, `${a.id}: kod startowy nie może od razu przechodzić testów`);
        assert.ok(a.hints?.length >= 1, `${a.id}: podpowiedzi`);
      } else if (a.mode === 'code') {
        const r = run({code: a.starter, stdin: a.stdin || []});
        assert.equal(r.error, null, `${a.id}: kod bez testów musi się uruchamiać`);
        assert.equal(r.stop, null, `${a.id}`);
      }
      if (a.mode === 'parsons') {
        const blocks = P.parsonsBlocks(a).filter(b => !b.distractor);
        const code = P.parsonsCode(a, blocks.map(b => ({id: b.id, indent: b.indent})));
        const r = run({code, tests: a.tests});
        assert.equal(r.error, null, `${a.id}: układanka bez błędów`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: ułożone rozwiązanie przechodzi testy`);
        for (const [i, d] of (a.distractors || []).entries()) {
          // Każda pułapka wstawiona zamiast podobnej linii musi oblać testy.
          const similar = blocks.findIndex(b => b.text.split(/[ (=]/)[0] === d.split(/[ (=]/)[0]);
          if (similar < 0) continue;
          const prog = blocks.map(b => ({id: b.id, indent: b.indent}));
          prog[similar] = {id: `d${i}`, indent: blocks[similar].indent};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests});
          assert.ok(rr.error || rr.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” powinna oblać testy`);
        }
      }
      if (a.mode === 'predict') {
        const r = run({code: a.code, stdin: a.stdin || []});
        assert.equal(r.error, null, `${a.id}: program do przewidzenia działa`);
        assert.ok(r.stdout.trim().length > 0);
        assert.ok(P.outputLines(r.stdout).length <= (a.predictRows || 3) + 3, `${a.id}: rozsądna liczba linii`);
      }
      if (a.mode === 'trace') {
        const r = run({code: a.code, trace: true, maxSteps: a.maxSteps || P.MAX_TRACE_STEPS});
        assert.equal(r.error, null, `${a.id}: śledzony program działa`);
        assert.equal(r.stop, null, `${a.id}: mieści się w limicie kroków (${r.steps.length})`);
      }
      for (const q of a.questions || []) {
        assert.ok(q.q && q.explain, `${a.id}: pytanie z wyjaśnieniem`);
        if (q.options) assert.ok(q.correct.every(i => i >= 0 && i < q.options.length));
        else assert.ok(P.checkQuestion(q, q.answer));
      }
      if (a.requires) assert.ok(labs(lesson).some(b => b.id === a.requires), `${a.id}: requires`);
    }
  });
  test(`${lesson.id}: karta wyniku liczy punkty z zadań i pytań; komplet = 100%`, () => {
    const card = lesson.sections.flatMap(s => s.activities).find(a => a.type === 'resultCard');
    const empty = lessonScore(lesson, card, {});
    assert.equal(empty.score, 0);
    const answers = {};
    for (const a of lesson.sections.flatMap(s => s.activities)) {
      if (a.type === 'choice') answers[a.id] = {selected: a.correct[0], done: true, first: true};
      if (a.type === 'pythonLab') {
        const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
        const v = {q, passedAll: true, solvedScore: a.points, ranOk: true, visitedEnd: true, bestPassed: a.tests?.length, predict: {checked: true, ok: true}};
        answers[a.id] = {...v, ...P.labResult(a, v)};
        assert.equal(answers[a.id].score, P.labMax(a), a.id);
        assert.equal(answers[a.id].done, true, a.id);
      }
    }
    const full = lessonScore(lesson, card, answers);
    assert.equal(full.score, full.max);
    assert.ok(full.max >= 15, 'wystarczająco punktów');
    assert.equal(full.badge.name, card.badges.find(b => b.min === Math.max(...card.badges.map(x => x.min))).name);
    for (const id of card.sources) assert.ok(lesson.sections.flatMap(s => s.activities).some(a => a.id === id), id);
  });
}
