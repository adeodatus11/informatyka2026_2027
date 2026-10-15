// Testy lekcji 65–68 klasy 1 (Python: elif i if w if, pętla for, pętla w pętli, for i while).
// Uruchom: node --test tests/sims-g1-python-b.test.mjs
// Zadania pythonLab są wykonywane w prawdziwym Pyodide (node_modules) tym samym RUNNER_PY co w przeglądarce.
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPyodide} from 'pyodide';
import * as P from '../content/sims/pythonLab.js';
import {lessonScore} from '../content/scoring.js';
import l65 from '../content/lessons/65-elif-nested-python.js';
import l66 from '../content/lessons/66-loops-python.js';
import l67 from '../content/lessons/67-nested-loops-python.js';
import l68 from '../content/lessons/68-for-while-python.js';

const ALL = [l65, l66, l67, l68];
const acts = l => l.sections.flatMap(s => s.activities);
const labs = l => acts(l).filter(a => a.type === 'pythonLab');
const allLabs = ALL.flatMap(labs);
const lab = id => allLabs.find(a => a.id === id);

/* ───────── Lekcje: rozkład, czasy, organizacja, karta wyniku ───────── */
const ROZKLAD = {
  '65': [27, 'Instrukcje warunkowe zagnieżdżone i z klauzulą elif w języku Python'],
  '66': [28, 'Algorytmy iteracyjne w języku Python'],
  '67': [29, 'Instrukcje iteracyjne zagnieżdżone w języku Python'],
  '68': [30, 'Stosowanie instrukcji iteracyjnych for i while w języku Python']
};

test('Lekcje 65–68: klasa 1, numer i tytuł z rozkładu, 45 minut, 4–7 etapów, metody COVE, bez pracy domowej', () => {
  for (const l of ALL) {
    const [order, title] = ROZKLAD[l.id];
    assert.equal(l.grade, 1); assert.equal(l.order, order); assert.equal(l.title, title);
    assert.equal(l.duration, 45); assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45, l.id);
    assert.ok(l.sections.length >= 4 && l.sections.length <= 7, l.id);
    assert.ok(l.format.methods.length >= 3);
    for (const m of l.format.methods) assert.match(m.url, /^https:\/\/metodyka\.covepolska\.pl\/metoda-[a-z-]+\.html$/);
    assert.ok(!/w domu|prac[ay] domow|przed lekcją/i.test(JSON.stringify(l.sections)), `${l.id}: bez pracy domowej`);
    assert.equal(l.sections[0].id, 'start');
    assert.ok(l.sections[0].activities.filter(a => a.type === 'choice').length >= 2, `${l.id}: retrieval na starcie`);
    assert.ok(l.sections.every(s => !['pair', 'trio', 'group'].includes(s.grouping)), `${l.id}: domyślnie praca samodzielna`);
    assert.ok(l.sections.at(-1).activities.some(a => a.type === 'resultCard'), `${l.id}: karta wyniku na końcu`);
    for (const s of l.sections) for (const k of ['teacherNotes', 'askStudents', 'expectedAnswers', 'commonMistakes', 'optionalExtension']) assert.ok(s[k]?.length > 10, `${l.id}/${s.id} ${k}`);
    const ids = acts(l).map(a => a.id); assert.equal(new Set(ids).size, ids.length, `${l.id}: unikalne id`);
    for (const a of acts(l).filter(a => a.type === 'sequence' || a.type === 'choice')) assert.ok(a.hint, `${a.id}: własna wskazówka`);
  }
  // różne zestawy metod w kolejnych lekcjach
  const sets = ALL.map(l => l.format.methods.map(m => m.name).sort().join('|'));
  assert.equal(new Set(sets).size, sets.length);
  // ciągłość: id unikalne w całym bloku
  const every = ALL.flatMap(acts).filter(a => a.type !== 'resultCard').map(a => a.id);
  assert.equal(new Set(every).size, every.length);
});

test('Każda lekcja ma przewidywanie, śledzenie lub układankę, „napraw błąd” i pisanie samodzielne', () => {
  for (const l of [l66, l67, l68]) assert.ok(labs(l).some(a => a.mode === 'parsons'), `${l.id}: układanka`);
  assert.ok(acts(l65).some(a => a.type === 'sequence'), '65: układanka kolejności warunków');
  for (const l of ALL) {
    assert.ok(labs(l).some(a => a.mode === 'predict'), `${l.id}: przewidywanie`);
    assert.ok(labs(l).filter(a => a.mode === 'code').length >= 2, `${l.id}: napraw + napisz`);
  }
  for (const l of [l65, l66, l67]) assert.ok(labs(l).some(a => a.mode === 'trace'), `${l.id}: śledzenie`);
});

test('Klasa 1 nie zna jeszcze funkcji: brak def; input() tylko w zadaniach z polem „Dane wejściowe”', () => {
  for (const a of allLabs) {
    for (const src of [a.code, a.starter, a.solution, ...(a.distractors || [])].filter(Boolean)) assert.ok(!/^\s*def\s/m.test(src), `${a.id}: bez def`);
    const usesInput = /\binput\(/.test(P.stripComments(a.code || a.solution || a.starter || ''));
    if (usesInput) { assert.equal(a.mode, 'code', `${a.id}: input() tylko w trybie code`); assert.equal(a.input, true, `${a.id}: pole danych`); assert.ok(a.stdin?.length, `${a.id}: dane domyślne`); }
  }
});

test('Karty wyniku: pełne odpowiedzi = 100% i najwyższa odznaka; pusto = 0', () => {
  for (const l of ALL) {
    const card = acts(l).find(a => a.type === 'resultCard');
    assert.equal(lessonScore(l, card, {}).score, 0);
    const answers = {};
    for (const a of acts(l)) {
      if (a.type === 'choice') answers[a.id] = {selected: a.correct[0], done: true, first: true};
      else if (a.type === 'matching' || a.type === 'sequence') answers[a.id] = {done: true};
      else if (a.type === 'pythonLab') {
        const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
        const v = {q, passedAll: true, solvedScore: a.points, ranOk: true, visitedEnd: true, bestPassed: a.tests?.length, predict: {checked: true, ok: true}};
        answers[a.id] = {...v, ...P.labResult(a, v)};
      }
    }
    const r = lessonScore(l, card, answers);
    assert.equal(r.score, r.max, l.id); assert.ok(r.max >= 20, `${l.id}: max ${r.max}`);
    assert.equal(r.badge.name, [...card.badges].sort((a, b) => b.min - a.min)[0].name);
    // każda aktywność punktowana jest w karcie
    for (const a of acts(l).filter(a => ['choice', 'sequence', 'matching', 'pythonLab'].includes(a.type))) assert.ok(card.sources.includes(a.id), `${l.id}: ${a.id} w karcie`);
    // maksimum deklarowane w podsumowaniu dla nauczyciela
    assert.match(l.teacherGuide.summary, new RegExp(`maks\\. ${r.max} pkt`), `${l.id}: maks. ${r.max} pkt`);
  }
});

/* ───────── Zadania pythonLab w prawdziwym Pythonie ───────── */
const py = await loadPyodide({indexURL: new URL('../node_modules/pyodide/', import.meta.url).pathname});
py.runPython(P.RUNNER_PY);
const runFn = py.globals.get('_pl_run');
const run = req => JSON.parse(runFn(JSON.stringify(req)));
const passes = (a, code) => {
  const r = run({code, stdin: a.stdin || [], tests: a.tests});
  const pyOk = !r.error && (!r.stop || r.stop === 'input');
  return pyOk && r.tests?.length === a.tests.length && r.tests.every(t => t.ok) && P.sourceChecks(code, a.sourceChecks).every(t => t.ok);
};

for (const lesson of ALL) {
  test(`${lesson.id}: rozwiązania wzorcowe przechodzą testy, kod startowy nie, pułapki i złe wcięcia w układankach psują testy`, () => {
    for (const a of labs(lesson)) {
      assert.ok(['code', 'parsons', 'trace', 'predict'].includes(a.mode) && a.title && a.prompt, a.id);
      if (a.mode === 'code') {
        assert.ok(a.tests?.length >= 3, `${a.id}: co najmniej 3 testy`);
        const r = run({code: a.solution, stdin: a.stdin || [], tests: a.tests});
        assert.equal(r.error, null, `${a.id}: rozwiązanie bez błędu ${JSON.stringify(r.error)}`);
        assert.equal(r.stop, null, `${a.id}: rozwiązanie działa dla danych domyślnych`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: ${JSON.stringify(r.tests.filter(t => !t.ok))}`);
        assert.ok(P.sourceChecks(a.solution, a.sourceChecks).every(t => t.ok), `${a.id}: sprawdzenia kodu`);
        assert.ok(!passes(a, a.starter), `${a.id}: kod startowy nie może przechodzić testów`);
        if (a.loops) {
          const s = run({code: a.starter, stdin: a.stdin || [], trace: true, maxSteps: 3000});
          assert.equal(s.stop, 'steps', `${a.id}: kod startowy ma pętlę nieskończoną`);
        } else {
          const s = run({code: a.starter, stdin: a.stdin || [], trace: true, maxSteps: 3000});
          assert.notEqual(s.stop, 'steps', `${a.id}: kod startowy kończy się sam`);
        }
        assert.ok(a.hints?.length >= 2, `${a.id}: stopniowane podpowiedzi`);
      }
      if (a.mode === 'parsons') {
        const blocks = P.parsonsBlocks(a).filter(b => !b.distractor);
        const good = blocks.map(b => ({id: b.id, indent: b.indent}));
        const r = run({code: P.parsonsCode(a, good), tests: a.tests});
        assert.equal(r.error, null, a.id); assert.equal(r.stop, null, a.id); assert.ok(r.tests.every(t => t.ok), a.id);
        assert.equal(a.distractors.length, 2, `${a.id}: dwie pułapki`);
        for (const [i, d] of a.distractors.entries()) {
          const similar = blocks.findIndex(b => b.text.split(/[ (=]/)[0] === d.split(/[ (=]/)[0]);
          assert.ok(similar >= 0, `${a.id}: pułapka „${d}” ma podobną linię`);
          const prog = good.map(x => ({...x}));
          prog[similar] = {id: `d${i}`, indent: blocks[similar].indent};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests, trace: true, maxSteps: 5000});
          assert.ok(rr.error || rr.stop || rr.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” powinna oblać testy`);
          // pułapka w miejscu linii, którą naprawdę udaje (ta sama pierwsza część), też psuje testy
          for (const [k, b] of blocks.entries()) {
            if (k === similar || b.text.split(/[ (=]/)[0] !== d.split(/[ (=]/)[0]) continue;
            const p2 = good.map(x => ({...x})); p2[k] = {id: `d${i}`, indent: b.indent};
            const r2 = run({code: P.parsonsCode(a, p2), tests: a.tests, trace: true, maxSteps: 5000});
            assert.ok(r2.error || r2.stop || r2.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” zamiast „${b.text}”`);
          }
        }
        // każda linia z wcięciem przesuniętym o jeden poziom psuje program
        for (const [k, b] of blocks.entries()) for (const delta of [-1, 1]) {
          const ind = b.indent + delta; if (ind < 0) continue;
          const prog = good.map(x => ({...x})); prog[k] = {id: b.id, indent: ind};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests, trace: true, maxSteps: 5000});
          assert.ok(rr.error || rr.stop || rr.tests?.some(t => !t.ok), `${a.id}: wcięcie ${ind} dla „${b.text}” powinno oblać testy`);
        }
        assert.ok(a.hints?.length >= 2);
      }
      if (a.mode === 'predict') {
        const r = run({code: a.code});
        assert.equal(r.error, null); assert.equal(r.stop, null);
        assert.ok(P.outputLines(r.stdout).length <= (a.predictRows || 3), `${a.id}: wynik mieści się w polu przewidywania`);
        assert.ok(a.explain, a.id);
      }
      if (a.mode === 'trace') {
        const r = run({code: a.code, trace: true, maxSteps: P.MAX_TRACE_STEPS});
        assert.equal(r.error, null); assert.equal(r.stop, null, `${a.id}: w limicie kroków`);
      }
      for (const q of a.questions || []) {
        assert.ok(q.q && q.explain && q.hint, `${a.id}: pytanie z wyjaśnieniem i wskazówką`);
        if (q.options) assert.ok(q.correct.every(i => i >= 0 && i < q.options.length)); else assert.ok(P.checkQuestion(q, q.answer));
      }
      if (a.requires) {
        const idx = labs(lesson).findIndex(b => b.id === a.requires);
        assert.ok(idx >= 0 && idx < labs(lesson).findIndex(b => b.id === a.id), `${a.id}: requires wskazuje wcześniejsze zadanie`);
      }
      if (a.summary) assert.match(a.summary, /\{passed\}\/\{total\}/);
    }
  });
}

/* ───────── Przewidywania i odpowiedzi zgadzają się z tym, co naprawdę robi program ───────── */
const out = (id, stdin = []) => { const a = lab(id); const r = run({code: a.solution || a.code, stdin}); assert.equal(r.error, null, id); return r.stdout; };
const tail = s => s.trim().split('\n').at(-1);

test('65: przewidywanie, śledzenie baterii i odpowiedzi do pytań', () => {
  assert.equal(out('el-predict').trim(), 'Ocena 5\nOcena 4\nOcena 3\nKoniec');
  const tr = run({code: lab('el-trace').code, trace: true});
  assert.match(tr.stdout, /^Podłącz ładowarkę\n/);
  const condLines = new Set([2, 4, 6]);
  assert.equal(tr.steps.filter(s => s.ev === 'line' && condLines.has(s.line)).length, 3, 'trzy sprawdzone warunki');
  assert.equal(run({code: lab('el-trace').code.replace('bateria = 15', 'bateria = 80')}).stdout.split('\n')[0], 'Pełna — graj dalej');
  // kolejność biletów: poprawna drabinka i ta z pytania o 10-latka
  const ticket = order => w => run({code: `wiek = ${w}\n` + order}).stdout.trim();
  const good = ticket('if wiek < 7:\n    print(0)\nelif wiek < 18:\n    print(15)\nelif wiek < 65:\n    print(25)\nelse:\n    print(15)\n');
  assert.deepEqual([6, 7, 17, 18, 64, 65].map(good), ['0', '15', '15', '25', '25', '15']);
  const bad = ticket('if wiek < 65:\n    print(25)\nelif wiek < 18:\n    print(15)\nelif wiek < 7:\n    print(0)\nelse:\n    print(15)\n');
  assert.equal(bad(10), '25');
  // ocena dla 95 w kodzie startowym (opis w poleceniu)
  assert.match(run({code: lab('el-fix-grades').starter, stdin: ['95']}).stdout, /Ocena: 2/);
  // błędy w kodach rabatowych są tłumaczone po polsku: najpierw =, potem wcięcie
  const e1 = run({code: lab('el-fix-code').starter, stdin: ['LATO10']}).error;
  assert.equal(P.explainError(e1).title, 'Pojedyncze = w warunku'); assert.equal(e1.line, 3);
  const e2 = run({code: lab('el-fix-code').starter.replace('if kod = ', 'if kod == '), stdin: ['LATO10']}).error;
  assert.equal(P.explainError(e2).title, 'Brakuje wcięcia'); assert.equal(e2.line, 6);
  assert.match(out('el-fix-code', ['KLASA1']), /Do zapłaty: 100 zł/);
  assert.match(out('el-fix-code', ['LATO10']), /Do zapłaty: 108 zł/);
  // klub: koszyk 95 zł vs 100 zł z rabatem
  assert.match(out('el-club', ['tak', '95']), /Do zapłaty: 95 zł\. Dobierz za 5 zł/);
  assert.match(out('el-club', ['tak', '100']), /Do zapłaty: 85 zł/);
  // wersja z and zamiast if w if przechodzi testy, ale nie sprawdzenie kodu (zadanie ćwiczy zagnieżdżenie)
  const viaAnd = 'karta = input()\nkwota = int(input())\nif karta == "tak" and kwota >= 100:\n    print(f"Do zapłaty: {kwota - 15} zł")\nelif karta == "tak":\n    print(f"Do zapłaty: {kwota} zł. Dobierz za {100 - kwota} zł")\nelse:\n    print(f"Do zapłaty: {kwota} zł")\n';
  assert.ok(run({code: viaAnd, stdin: ['tak', '120'], tests: lab('el-club').tests}).tests.every(t => t.ok));
  assert.equal(P.sourceChecks(viaAnd, lab('el-club').sourceChecks)[0].ok, false);
  // pytanie końcowe: kolejność rang XP
  const rank = xp => run({code: `xp = ${xp}\nif xp >= 1000:\n    print("L")\nelif xp >= 500:\n    print("W")\nelif xp >= 100:\n    print("G")\nelse:\n    print("N")\n`}).stdout.trim();
  assert.deepEqual([0, 99, 100, 500, 999, 1000].map(rank), ['N', 'N', 'G', 'W', 'W', 'L']);
});

test('66: serie, suma rund, plan treningu, średnia, odliczanie i MVP', () => {
  assert.equal(out('lp-predict').trim(), 'Seria 1 - 10 pompek\nSeria 2 - 10 pompek\nSeria 3 - 10 pompek\nKoniec treningu!');
  const tr = run({code: lab('lp-trace').code, trace: true});
  assert.ok(tr.steps.some(s => s.g.runda?.r === '3' && s.g.suma?.r === '60'));
  assert.equal(tr.steps.filter(s => s.ev === 'line' && s.line === 4).length, 4);
  assert.equal(tail(tr.stdout), 'Wynik końcowy: 100');
  const inside = lab('lp-trace').code.replace('suma = 0\nfor runda in range(1, 5):\n', 'for runda in range(1, 5):\n    suma = 0\n');
  assert.equal(tail(run({code: inside}).stdout), 'Wynik końcowy: 40');
  assert.equal(tail(run({code: lab('lp-parsons').solution.replace('+ 5', '+ 10')}).stdout), 'Razem w tygodniu: 280 pompek');
  assert.match(run({code: lab('lp-fix-avg').starter, stdin: ['3', '5', '4', '3']}).stdout, /Średnia: 1\.00/);
  assert.match(out('lp-fix-avg', ['4', '4', '4', '5', '3']), /Średnia: 4\.00/);
  assert.equal(tail(out('lp-countdown', ['3'])), 'Wakacje!');
  const mvp = out('lp-mvp', ['5', '100', '100', '50', '200', '0']);
  assert.match(mvp, /Suma punktów: 450/); assert.match(mvp, /Rundy MVP \(100\+\): 3/);
});

test('67: kratka, tabliczka krok po kroku, schody, turniej i liczby wykonań', () => {
  assert.equal(out('nl-predict').trim(), '****\n****\n****');
  const tr = run({code: lab('nl-trace').code, trace: true});
  assert.ok(tr.stdout.split('\n').includes('2 x 3 = 6'));
  assert.equal(tail(tr.stdout), 'Wewnętrzna pętla wykonała się 9 razy');
  assert.ok(tr.steps.some(s => s.g.a?.r === '2' && s.g.b?.r === '3'));
  const wide = run({code: lab('nl-trace').code.replace('for b in range(1, 4)', 'for b in range(1, 11)')}).stdout;
  assert.equal(wide.split('\n').filter(x => / x /.test(x)).length, 30);
  const bad = run({code: lab('nl-fix-tour').starter, stdin: ['3']}).stdout;
  assert.match(bad, /Drużyna 1 vs Drużyna 1/); assert.match(bad, /Liczba meczów: 9/);
  assert.match(out('nl-fix-tour', ['8']), /Liczba meczów: 28/);
  const t10 = out('nl-table', ['10']).trim().split('\n').slice(1);
  assert.equal(t10.length, 10); assert.equal(t10.flatMap(x => x.trim().split(' ')).length, 100);
  // pytanie końcowe: 5 rzędów po 7 miejsc
  assert.equal(run({code: 'n = 0\nfor r in range(5):\n    for m in range(7):\n        n = n + 1\nprint(n)\n'}).stdout.trim(), '35');
  // powtórka w lekcji 68: 4 × 6 gwiazdek
  assert.equal(run({code: 'for w in range(4):\n    for k in range(6):\n        print("*", end="")\n'}).stdout.length, 24);
});

test('68: skarbonka, bateria, pętla nieskończona w kalkulatorze, PIN i gra', () => {
  assert.equal(out('fw-predict').trim(), 'Tydzień 1 - masz 30 zł\nTydzień 2 - masz 60 zł\nTydzień 3 - masz 90 zł\nTydzień 4 - masz 120 zł\nCel osiągnięty!');
  assert.equal(out('fw-parsons').trim(), 'Po 60 min gry zostało 10% baterii');
  assert.equal(run({code: lab('fw-parsons').solution.replace('- 15', '- 12')}).stdout.trim(), 'Po 70 min gry zostało 16% baterii');
  // pułapka „bateria = bateria + 15” w pętli → pętla nieskończona (zatrzymana limitem)
  const up = run({code: lab('fw-parsons').solution.replace('bateria = bateria - 15', 'bateria = bateria + 15'), trace: true, maxSteps: 3000});
  assert.equal(up.stop, 'steps');
  // kalkulator: 0 zł tygodniowo → pętla nieskończona
  assert.equal(run({code: lab('fw-goal').solution, stdin: ['100', '0'], trace: true, maxSteps: 3000}).stop, 'steps');
  assert.match(out('fw-goal', ['600', '50']), /po 12 tygodniach\. Będziesz mieć 600 zł/);
  // PIN bez break pyta dalej (kończy się brakiem danych), bez licznika — w nieskończoność pyta o PIN
  const noBreak = lab('fw-pin').solution.replace('        break\n', '');
  assert.equal(run({code: noBreak, stdin: ['4821']}).stop, 'input');
  const noCount = lab('fw-pin').solution.replace('    proby = proby + 1\n', '');
  assert.equal(run({code: noCount, stdin: ['1', '2', '3']}).stop, 'input');
  assert.equal(run({code: lab('fw-pin').starter, stdin: ['4821']}).stop, 'input');
  // gra: wyszukiwanie binarne zgaduje każdą liczbę 1–100 w najwyżej 7 próbach
  let worst = 0;
  for (let secret = 1; secret <= 100; secret++) {
    let lo = 1, hi = 100, tries = 0;
    for (;;) { const g = Math.floor((lo + hi) / 2); tries++; if (g === secret) break; if (g < secret) lo = g + 1; else hi = g - 1; }
    worst = Math.max(worst, tries);
  }
  assert.equal(worst, 7);
  const game = out('fw-game', ['50', '25', '37']);
  assert.match(game, /Za dużo!\n.*Za mało!/s); assert.match(game, /Trafione! Liczba prób: 3/);
  // gra bez nowego input w pętli → zatrzymana (za dużo tekstu)
  const stuck = run({code: lab('fw-game').solution.replace('    proba = int(input("Spróbuj jeszcze raz: "))\n', ''), stdin: ['50']});
  assert.equal(stuck.stop, 'output');
  // pytanie końcowe: tylko pierwsza pętla jest nieskończona
  assert.equal(run({code: 'x = 1\nwhile x > 0:\n    x = x + 1\n', trace: true, maxSteps: 2000}).stop, 'steps');
  for (const c of ['x = 10\nwhile x > 0:\n    x = x - 1\n', 'x = 0\nwhile x < 5:\n    x = x + 1\n']) assert.equal(run({code: c, trace: true, maxSteps: 2000}).stop, null);
  // powtórka: range(5, 0, -1)
  assert.equal(run({code: 'print(list(range(5, 0, -1)))'}).stdout.trim(), '[5, 4, 3, 2, 1]');
});
