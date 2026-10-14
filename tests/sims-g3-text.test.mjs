// Klasa 3: algorytmy na tekstach i zamiana dwójkowy → dziesiętny (lekcje 51–57).
// Uruchom: node --test tests/sims-g3-text.test.mjs
// Logika textLab (czysty JS) + zadania pythonLab wykonywane w prawdziwym Pyodide (jak tests/sims-python.test.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPyodide} from 'pyodide';
import * as T from '../content/sims/textLab.js';
import * as P from '../content/sims/pythonLab.js';
import {lessonScore} from '../content/scoring.js';

const load = async f => (await import(new URL(`../content/lessons/${f}.js`, import.meta.url))).default;
const L53 = await load('53-text-algorithms');
const PY = await Promise.all(['54-python-strings', '55-compare-count-python', '56-pattern-search-python', '57-binary-to-decimal'].map(load));
const L51 = await load('51-substitution-cipher-g3'), L52 = await load('52-cipher-python-g3');
const B16 = await load('16-substitution-cipher'), B17 = await load('17-cipher-python');
const acts = l => l.sections.flatMap(s => s.activities);
const labs = l => acts(l).filter(a => a.type === 'pythonLab');

const py = await loadPyodide({indexURL: new URL('../node_modules/pyodide/', import.meta.url).pathname});
py.runPython(P.RUNNER_PY);
const runFn = py.globals.get('_pl_run');
const run = req => JSON.parse(runFn(JSON.stringify(req)));

/* ───────── textLab: logika ───────── */
test('textLab: porównanie znak po znaku daje ten sam wynik co < (Python i JS)', () => {
  const words = ['Ala', 'Alicja', 'Ola', 'Olaf', 'adam', 'Zosia', 'Łukasz', 'Marek', '', 'a', 'ala', 'alaska', 'Kasia', 'Kamil'];
  for (const a of words) for (const b of words) {
    const r = T.compareTrace(a, b).result;
    assert.equal(r < 0, a < b, `${a} < ${b}`);
    assert.equal(r === 0, a === b);
  }
  // Te same wyniki daje Python (porównanie kodów znaków).
  const pyRes = run({code: `print([a < b for a in ${JSON.stringify(words)} for b in ${JSON.stringify(words)}])`}).stdout.trim();
  assert.equal(pyRes, `[${words.flatMap(a => words.map(b => (a < b ? 'True' : 'False'))).join(', ')}]`);
  assert.deepEqual(T.compareTrace('Kasia', 'Kamil').comparisons, 3);
  assert.equal(T.compareTrace('Ola', 'Olaf').reason, 'prefix');
  assert.equal(T.compareTrace('adam', 'Zosia').result, 1, 'Z (90) przed a (97)');
  assert.equal(T.compareTrace('Łukasz', 'Marek').result, 1, 'Ł (321) po M (77)');
  assert.deepEqual(T.codeSort(T.CONTACTS), ['Ela', 'Lena', 'Marek', 'Ola', 'Zosia', 'adam', 'Łukasz']);
  assert.deepEqual(T.codeSort(T.CONTACTS), [...T.CONTACTS].sort());
  assert.deepEqual(T.plSort(T.CONTACTS), ['adam', 'Ela', 'Lena', 'Łukasz', 'Marek', 'Ola', 'Zosia']);
  for (const q of T.COMPARE_QUESTIONS) assert.equal(q.options[q.correct], T.compareTrace(q.a, q.b).result <= 0 ? q.a : q.b);
});

test('textLab: zliczanie, palindrom i anagram zgadzają się z prostymi definicjami', () => {
  assert.equal(T.countTrace(T.COUNT_TEXT, 'a').count, [...T.COUNT_TEXT].filter(c => c === 'a').length);
  assert.equal(T.countTrace(T.COUNT_TEXT, 'a').count, 5);
  assert.equal(T.countTrace(T.COUNT_TEXT, 'a', true).count, 7);
  assert.equal(T.countTrace('', 'a').count, 0);
  assert.equal(T.palindromeTrace('kajak').comparisons, 2);
  assert.equal(T.palindromeTrace('Kobyła ma mały bok').ok, false);
  const norm = T.palindromeTrace('Kobyła ma mały bok', true);
  assert.equal(norm.text, 'kobyłamamałybok'); assert.equal(norm.ok, true); assert.equal(norm.comparisons, 7);
  for (const w of ['', 'x', 'abba', 'kotek', 'potop', 'Elf układał kufle']) {
    const t = T.normalizeText(w);
    assert.equal(T.palindromeTrace(w, true).ok, t === [...t].reverse().join(''), w);
    assert.equal(T.palindromeTrace(w, true).comparisons <= Math.floor([...t].length / 2), true);
  }
  assert.equal(T.anagramCheck('Klasa', 'skala').ok, true);
  assert.equal(T.anagramCheck('kotek', 'kotka').ok, false);
  assert.equal(T.anagramCheck('arbuz', 'burza').ok, true);
  assert.equal(T.anagramCheck('kot', 'kota').ok, false);
  assert.equal(T.anagramCheck('aab', 'abb').ok, false);
  for (const p of T.DETECTIVE) {
    if (p.options) assert.ok(p.correct >= 0 && p.correct < p.options.length, p.id);
    else assert.ok(T.checkAnswer(p, p.answer), p.id);
    assert.ok(T.detectiveFrames(p).length >= 2, p.id);
  }
  assert.equal(T.DETECTIVE.find(p => p.id === 'd-raw').options[T.DETECTIVE.find(p => p.id === 'd-raw').correct], 'To nie palindrom');
  assert.equal(T.DETECTIVE.find(p => p.id === 'd-klasa').correct, 0);
  assert.equal(T.DETECTIVE.find(p => p.id === 'd-kotek').correct, 1);
});

const naive = (t, p) => { const r = []; for (let i = 0; i + p.length <= t.length && p.length; i++) if (t.slice(i, i + p.length) === p) r.push(i); return r; };
const CASES = [['idę na mecz', 'mecz'], ['ok, jutro ok?', 'ok'], ['hahaha', 'haha'], ['lol xd lol', 'lol'], ['aaaa', 'aa'], ['aaaaaaaaaa', 'aaa'], ['abc', 'abcd'], ['lolo', 'lol'], ['ERROR ok ERROR ERRORERROR', 'ERROR'], ['xd', 'xd']];
test('textLab: wyszukiwanie wzorca — trafienia, okna i liczba porównań', () => {
  for (const [t, p] of CASES) {
    const tr = T.patternTrace(t, p);
    assert.deepEqual(tr.found, naive(t, p), `${t}/${p}`);
    assert.equal(tr.windows, Math.max(0, t.length - p.length + 1));
    assert.equal(tr.steps.length, tr.comparisons);
    assert.ok(tr.comparisons <= tr.windows * p.length && tr.comparisons >= tr.windows);
    const frames = T.patternFrames(t, p);
    assert.equal(frames.length, tr.comparisons + 2);
    for (const f of frames) for (const r of f.rows) assert.equal(r.cells.length, [...t].length);
  }
  assert.deepEqual(T.patternTrace('hahaha', 'haha').found, [0, 2], 'nakładające się');
  assert.equal(T.patternTrace('ok, jutro ok?', 'ok').comparisons, 15);
  assert.equal(T.patternTrace('idę na mecz', 'mecz').comparisons, 11);
  assert.equal(T.patternTrace('hahaha', 'haha').comparisons, 9);
  assert.equal(T.patternTrace('aaaaaaaaab', 'aab').comparisons, 24);
  // Liczba porównań w symulatorze = wynik funkcji ile_porownan z lekcji 56 (rozwiązanie wzorcowe w Pyodide).
  const sol = labs(PY[2]).find(a => a.id === 'pw-count').solution.split('\n\n\nprint')[0];
  const r = run({code: sol, tests: CASES.map(([t, p]) => ({call: `ile_porownan(${JSON.stringify(t)}, ${JSON.stringify(p)})`, expected: String(T.patternTrace(t, p).comparisons)}))});
  assert.ok(r.tests.every(x => x.ok), JSON.stringify(r.tests.filter(x => !x.ok)));
  // znajdz_wszystkie z lekcji 56 = te same trafienia.
  const zw = labs(PY[2]).find(a => a.id === 'pw-parsons').solution;
  const r2 = run({code: zw, tests: CASES.map(([t, p]) => ({call: `znajdz_wszystkie(${JSON.stringify(t)}, ${JSON.stringify(p)})`, expected: JSON.stringify(naive(t, p))}))});
  assert.ok(r2.tests.every(x => x.ok), JSON.stringify(r2.tests.filter(x => !x.ok)));
  for (const q of T.PATTERN_QUESTIONS) assert.ok(q.correct >= 0 && q.correct < q.options.length);
  assert.equal(T.PATTERN_QUESTIONS[0].options[T.PATTERN_QUESTIONS[0].correct], String(T.windowsCount(10, 3)));
});

test('textLab: krok ucznia w rundzie — błąd nie przesuwa algorytmu, poprawne kroki kończą rundę', () => {
  const run1 = T.PATTERN_RUNS[0];
  const tr = T.patternTrace(run1.text, run1.pattern);
  let st = T.runStep(run1, {}, 'found');
  assert.equal(st.k, 0); assert.equal(st.errors, 1); assert.equal(st.last.ok, false);
  for (const step of tr.steps) st = T.runStep(run1, st, step.action);
  assert.equal(st.done, true); assert.equal(st.errors, 1);
  assert.equal(T.runResult(run1, st), run1.points - 0.5);
  assert.equal(T.runScore(4, 20), 2, 'najmniej połowa');
  let v = {runs: {}, q: {}};
  for (const r of T.PATTERN_RUNS) { let s = {}; for (const step of T.patternTrace(r.text, r.pattern).steps) s = T.runStep(r, s, step.action); v.runs[r.id] = s; }
  for (const q of T.PATTERN_QUESTIONS) v.q[q.id] = T.attempt({}, true, q.correct);
  const res = T.patternResult(v);
  assert.equal(res.score, res.max); assert.equal(res.done, true); assert.match(res.summary, /błędnych kroków: 0/);
  const c = {q: Object.fromEntries(T.compareQuestions.map(q => [q.id, T.attempt({}, true, q.correct)]))};
  assert.equal(T.compareResult(c).score, T.COMPARE_MAX);
  const d = {q: Object.fromEntries(T.DETECTIVE.map(p => [p.id, T.attempt({}, true)]))};
  assert.equal(T.detectiveResult(d).score, T.DETECTIVE_MAX);
  const wrongThenOk = T.attempt(T.attempt({}, false, 1), true, 0);
  assert.equal(T.taskPoints(wrongThenOk.solvedAt), 1);
  assert.deepEqual(T.compareResult(undefined), {score: 0, max: T.COMPARE_MAX, done: false, summary: undefined});
  assert.ok(T.checkAnswer({answer: '7'}, ' 7 ')); assert.ok(!T.checkAnswer({answer: '7'}, ''));
});

test('53: aktywności textLab deklarują punkty zgodne z symulatorem; karta wyniku = 100% przy komplecie', () => {
  for (const a of acts(L53).filter(a => a.type === 'textLab')) assert.equal(a.points, T.modeMax(a.mode), a.id);
  const card = acts(L53).find(a => a.type === 'resultCard');
  assert.equal(lessonScore(L53, card, {}).score, 0);
  const answers = {};
  for (const a of acts(L53)) {
    if (a.type === 'choice') answers[a.id] = {selected: a.correct[0], done: true, first: true};
    if (a.type === 'matching') answers[a.id] = {done: true};
    if (a.type === 'textLab') answers[a.id] = {score: T.modeMax(a.mode), max: T.modeMax(a.mode), done: true};
  }
  const full = lessonScore(L53, card, answers);
  assert.equal(full.score, full.max);
  assert.equal(L53.sections.reduce((s, x) => s + x.duration, 0), 45);
});

/* ───────── pythonLab w lekcjach 54–57 ───────── */
for (const lesson of PY) {
  test(`${lesson.id}: zadania pythonLab — rozwiązania wzorcowe przechodzą testy, kod startowy nie`, () => {
    const ids = new Set();
    for (const a of labs(lesson)) {
      assert.ok(['code', 'parsons', 'trace', 'predict'].includes(a.mode), `${a.id}: tryb`);
      assert.ok(a.title && a.prompt, `${a.id}: tytuł i polecenie`);
      assert.ok(!ids.has(a.id)); ids.add(a.id);
      if (a.mode === 'code' && a.tests?.length) {
        const r = run({code: a.solution, stdin: a.stdin || [], tests: a.tests});
        assert.equal(r.error, null, `${a.id}: rozwiązanie bez błędów ${JSON.stringify(r.error)}`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: rozwiązanie przechodzi testy ${JSON.stringify(r.tests.filter(t => !t.ok))}`);
        assert.ok(P.sourceChecks(a.solution, a.sourceChecks).every(t => t.ok), `${a.id}: sprawdzenia kodu`);
        const s = run({code: a.starter, stdin: a.stdin || [], tests: a.tests});
        const starterPasses = !s.error && !s.stop && s.tests?.every(t => t.ok) && P.sourceChecks(a.starter, a.sourceChecks).every(t => t.ok);
        assert.ok(!starterPasses, `${a.id}: kod startowy nie może od razu przechodzić testów`);
        assert.equal(s.error, null, `${a.id}: kod startowy uruchamia się bez błędu (uczeń widzi wynik)`);
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
          const similar = blocks.findIndex(b => b.text.split(/[ (=]/)[0] === d.split(/[ (=]/)[0]);
          assert.ok(similar >= 0, `${a.id}: pułapka ma podobną linię`);
          const prog = blocks.map(b => ({id: b.id, indent: b.indent}));
          prog[similar] = {id: `d${i}`, indent: blocks[similar].indent};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests});
          assert.ok(rr.error || rr.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” powinna oblać testy`);
        }
      }
      if (a.mode === 'predict') {
        const r = run({code: a.code, stdin: a.stdin || []});
        assert.equal(r.error, null, `${a.id}: program do przewidzenia działa`);
        assert.ok(P.outputLines(r.stdout).length <= (a.predictRows || 3), `${a.id}: pole przewidywania mieści wynik`);
      }
      if (a.mode === 'trace') {
        const r = run({code: a.code, trace: true, maxSteps: P.MAX_TRACE_STEPS});
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
    const card = acts(lesson).find(a => a.type === 'resultCard');
    assert.equal(lessonScore(lesson, card, {}).score, 0);
    const answers = {};
    for (const a of acts(lesson)) {
      if (a.type === 'choice') answers[a.id] = {selected: a.correct[0], done: true, first: true};
      if (a.type === 'pythonLab') {
        const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
        const v = {q, passedAll: true, solvedScore: a.points, ranOk: true, visitedEnd: true, bestPassed: a.tests?.length, predict: {checked: true, ok: true}};
        answers[a.id] = {...v, ...P.labResult(a, v)};
        assert.equal(answers[a.id].score, P.labMax(a), a.id);
      }
    }
    const full = lessonScore(lesson, card, answers);
    assert.equal(full.score, full.max);
    assert.ok(full.max >= 15, `wystarczająco punktów (${full.max})`);
    for (const id of card.sources) assert.ok(acts(lesson).some(a => a.id === id), id);
    assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), 45);
  });
}

test('Odpowiedzi do pytań i przewidywań wynikają z tego, co naprawdę wypisuje program', () => {
  const all = PY.flatMap(labs);
  const act = id => all.find(a => a.id === id);
  const out = id => { const a = act(id); return run({code: a.code || a.solution || a.starter}).stdout; };
  const steps = id => run({code: act(id).code, trace: true}).steps;
  assert.equal(out('ps-predict1').trim(), '11\nK\nKOT_FILEMON');
  assert.equal(out('ps-predict2').trim(), 'i a\nform\ninka\nakytamrofni');
  assert.equal(run({code: 'print("informatyka"[4:], "kot".find("x"))'}).stdout.trim(), 'rmatyka -1');
  assert.match(out('ps-trace'), /Cyfr: 2\n65 97 B/);
  assert.equal(steps('ps-trace').filter(s => s.line === 5).length, 2);
  assert.equal(out('pc-bug').trim(), '1');
  assert.match(out('pc-less-q'), /'Łukasz'\]\n321 77 90 97/);
  assert.equal(run({code: act('pc-zlicz').solution, tests: [{call: 'zlicz("Ala ma kota", "a")', expected: '3'}]}).tests[0].ok, true);
  assert.match(out('pw-trace'), /znaleziono na pozycji 0\nznaleziono na pozycji 7/);
  assert.equal(out('pw-builtin').trim(), '0\n4\n-1\n2');
  assert.equal(run({code: act('pw-count').solution, tests: [{call: 'ile_porownan("a" * 20, "aaaa")', expected: '68'}]}).tests[0].ok, true);
  assert.equal(out('pw-chat').trim().split('\n').length, 3);
  assert.equal(out('pb-trace').trim(), '13');
  assert.ok(steps('pb-trace').some(s => s.line === 4 && s.g.potega?.r === '3' && s.g.wynik?.r === '0'));
  assert.ok(steps('pb-trace').some(s => s.g.cyfra?.r === "'0'" && s.line === 5 && s.g.wynik?.r === '12'));
  assert.equal(out('pb-bug').trim(), '4\n6');
  assert.match(out('pb-chmod'), /rwx -> 111 -> 7\nr-x -> 101 -> 5\nr-- -> 100 -> 4/);
  const chmod2 = run({code: act('pb-chmod').starter.replace('["rwx", "r-x", "r--"]', '["rw-", "r--", "r--"]')}).stdout;
  assert.match(chmod2, /-> 6\n.*-> 4\n.*-> 4/);
  const r = run({code: 'try:\n    int("102", 2)\nexcept ValueError:\n    print("ValueError")\nprint(int("11111111", 2))'});
  assert.equal(r.stdout.trim(), 'ValueError\n255');
});

/* ───────── wrappery 51 i 52 ───────── */
test('51 i 52: cienkie wrappery lekcji 16 i 17 dla klasy 3 (tytuł, kolejność, powtórka, praca samodzielna)', () => {
  assert.deepEqual([L51.id, L51.grade, L51.order], ['51', 3, 21]);
  assert.equal(L51.title, 'Podstawowe pojęcia dotyczące szyfrowania i szyfrowanie tekstu metodą podstawieniową');
  assert.deepEqual([L52.id, L52.grade, L52.order], ['52', 3, 22]);
  assert.equal(L52.title, 'Programowanie algorytmu szyfrowania podstawieniowego');
  assert.equal(L51.sections.length, B16.sections.length); assert.equal(L52.sections.length, B17.sections.length);
  assert.equal(L51.duration, B16.duration); assert.equal(L52.duration, B17.duration);
  assert.ok(acts(L51).some(a => a.id === 'l51-r1') && !acts(L51).some(a => a.id === 'l16-r1'));
  const card51 = acts(L51).find(a => a.type === 'resultCard');
  for (const id of card51.sources) assert.ok(acts(L51).some(a => a.id === id), id);
  const txt52 = JSON.stringify([L52.format, L52.teacherGuide, L52.sections.map(s => [s.intro, s.teacherNotes, s.grouping])]);
  assert.doesNotMatch(txt52, /kierowc|nawigator|Ustal pary|Zamiana ról|"pair"|algorytmy porządkowania/);
  assert.doesNotMatch(JSON.stringify(L51.sections.map(s => s.teacherNotes)), /Ustal pary i role/);
  assert.equal(B16.id, '16'); assert.equal(B17.id, '17');
  // Python w 52 działa tak jak w 17 (te same zadania).
  for (const a of labs(L52).filter(a => a.mode === 'code' && a.tests?.length)) assert.ok(run({code: a.solution, tests: a.tests}).tests.every(t => t.ok), a.id);
});
