// Testy lekcji 60–64 klasy 1 (specyfikacja, algorytmy, pierwsze programy w Pythonie) i symulatora flowLab.
// Uruchom: node --test tests/sims-g1-python-a.test.mjs
// Zadania pythonLab są wykonywane w prawdziwym Pyodide (node_modules) tym samym RUNNER_PY co w przeglądarce.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPyodide} from 'pyodide';
import * as F from '../content/sims/flowLab.js';
import * as P from '../content/sims/pythonLab.js';
import {lessonScore} from '../content/scoring.js';
import l60 from '../content/lessons/60-problem-specification.js';
import l61 from '../content/lessons/61-algorithms-techniques.js';
import l62 from '../content/lessons/62-python-variables-output.js';
import l63 from '../content/lessons/63-python-conditions.js';
import l64 from '../content/lessons/64-python-validation.js';

const ALL = [l60, l61, l62, l63, l64];
const acts = l => l.sections.flatMap(s => s.activities);
const labs = l => acts(l).filter(a => a.type === 'pythonLab');
const flows = l => acts(l).filter(a => a.type === 'flowLab');
const act = id => ALL.flatMap(acts).find(a => a.id === id);

/* ───────── flowLab: mini-interpreter pseudokodu ───────── */
test('flowLab: wyrażenia, przypisania, wczytywanie i wypisywanie', () => {
  assert.equal(F.evalExpr('2 + 3 * 4'), 14);
  assert.equal(F.evalExpr('(2 + 3) * 4 = 20 i nie 3 > 4'), true);
  assert.equal(F.evalExpr('7 div 2 + 7 mod 2'), 4);
  assert.equal(F.evalExpr('a ≥ 100 lub a < 0', {a: 100}), true);
  assert.equal(F.evalExpr('"Do zapłaty: " + 5'), 'Do zapłaty: 5');
  assert.equal(F.evalExpr('miesiące + 1', {'miesiące': 2}), 3);
  assert.throws(() => F.evalExpr('dostawa ≥ 100', {}), /nie ma jeszcze wartości/);
  assert.throws(() => F.evalExpr('5 / 0'), /zero/);
  assert.throws(() => F.evalExpr('"a" < 3'), /liczb/);
  const r = F.execBlock({kind: 'io'}, 'Wczytaj a, b', {}, {a: 2, b: 3});
  assert.deepEqual(r.vars, {a: 2, b: 3});
  const w = F.execBlock({kind: 'io'}, 'Wypisz "Wynik:", a * b, "zł"', {a: 2, b: 3});
  assert.deepEqual(w.out, ['Wynik: 6 zł']);
  const o = F.execBlock({kind: 'op'}, 'x ← 1\ny ← x + 1', {});
  assert.deepEqual(o.vars, {x: 1, y: 2});
  assert.throws(() => F.execBlock({kind: 'op'}, 'x + 1', {x: 1}), /Przypisanie/);
  assert.equal(F.show(2.5), '2.5'); assert.equal(F.show(1 / 3), '0.33'); assert.equal(F.show(true), 'PRAWDA');
  assert.equal(F.substitute('suma < cena', {suma: 750, cena: 600}), '750 < 600');
  assert.equal(F.substitute('a ≥ 1 i (b = 2)', {a: 5, b: 2}), '5 ≥ 1 i (2 = 2)');
});

test('flowLab: schemat z pętlą, błąd „brak Stop” i pętla nieskończona', () => {
  const sk = act('al-trace');
  const r = F.runChart(sk.chart, sk.input);
  assert.equal(r.error, null); assert.equal(r.end, true);
  assert.deepEqual(r.out, ['3']);
  assert.deepEqual(r.steps.filter(s => s.kind === 'if').map(s => s.cond), [true, true, true, false]);
  assert.equal(r.steps.filter(s => s.id === 'add').length, 3, 'pytanie 1: trzy dodawania');
  assert.deepEqual(F.runChart(sk.chart, {cena: 500, kwota: 250}).out, ['2'], 'pytanie 2: przypadek brzegowy 500/250');
  assert.deepEqual(F.runChart(sk.chart, {cena: 600, kwota: 200}).out, ['3']);
  // kwota 0 → pętla nieskończona zatrzymana limitem
  const inf = F.runChart(sk.chart, {cena: 100, kwota: 0});
  assert.equal(inf.error.kind, 'steps');
  // brak bloku Stop
  const broken = {blocks: [{id: 's', kind: 'start', text: 'Start', pos: [0, 0], next: 'x'}, {id: 'x', kind: 'op', text: 'a ← 1', pos: [0, 1], next: 'nic'}]};
  assert.equal(F.runChart(broken).error.kind, 'graph');
  // geometria: każda strzałka ma ≥ 2 punkty i mieści się w rysunku
  for (const chart of [sk.chart, act('al-fill').chart]) {
    const size = F.chartSize(chart);
    for (const e of F.chartEdges(chart)) {
      assert.ok(e.points.length >= 2);
      for (const [x, y] of e.points) assert.ok(x >= 0 && x <= size.width && y >= 0 && y <= size.height, `${e.from}→${e.to}`);
    }
    assert.equal(F.chartOutline(chart).length, chart.blocks.length);
    const ifs = chart.blocks.filter(b => b.kind === 'if');
    assert.equal(F.chartEdges(chart).filter(e => e.label).length, ifs.length * 2, 'romb ma strzałki TAK i NIE');
  }
});

test('flowLab „fill”: wzorcowe pola przechodzą testy, każda błędna opcja oblewa przynajmniej jeden', () => {
  for (const a of ALL.flatMap(flows).filter(x => x.mode === 'fill')) {
    const blanks = a.chart.blocks.filter(b => b.blank);
    const good = Object.fromEntries(blanks.map(b => [b.id, b.blank.answer]));
    assert.ok(F.checkFill(a.chart, good, a.tests).every(t => t.ok), a.id);
    for (const b of blanks) for (let k = 0; k < b.blank.options.length; k++) {
      if (k === b.blank.answer) continue;
      const res = F.checkFill(a.chart, {...good, [b.id]: k}, a.tests);
      assert.ok(res.some(t => !t.ok), `${a.id}: opcja „${b.blank.options[k]}” powinna oblać test`);
    }
    // „koszyk > 100” oblewa właśnie granicę 100 zł
    const gt = F.checkFill(a.chart, {...good, if: 1}, a.tests);
    assert.deepEqual(gt.map(t => t.ok), [true, false, true]);
    assert.equal(gt[1].got, '115');
    assert.match(F.checkFill(a.chart, {...good, if: 3}, a.tests)[0].error.message, /dostawa/);
    assert.equal(F.checkFill(a.chart, {}, a.tests)[0].error.kind, 'blank');
  }
});

test('flowLab „tests”: specyfikacje liczą wynik, rozpoznają rodzaj przypadku i błędne dane', () => {
  const j = (s, raw, exp, have) => F.judgeCase(s, raw, exp, have);
  assert.equal(j('autobus', {odjazd: '10', dojscie: '5'}, {kind: 'yes'}).status, 'new');
  assert.equal(j('autobus', {odjazd: '5', dojscie: '10'}, {kind: 'no'}).category, 'nie');
  const edge = j('autobus', {odjazd: '10', dojscie: '10'}, {kind: 'no'});
  assert.equal(edge.status, 'wrong'); assert.equal(edge.category, 'rowne'); assert.equal(edge.correct, 'TAK');
  for (const raw of [{odjazd: '-3', dojscie: '5'}, {odjazd: 'abc', dojscie: '5'}, {odjazd: '10', dojscie: '0'}, {odjazd: '12,5', dojscie: '3'}, {odjazd: '121', dojscie: '3'}])
    assert.equal(j('autobus', raw, {kind: 'error'}).category, 'bledne', JSON.stringify(raw));
  assert.equal(j('autobus', {odjazd: '-3', dojscie: '5'}, {kind: 'yes'}).status, 'wrong');
  assert.equal(j('autobus', {odjazd: '10', dojscie: '5'}, {kind: 'yes'}, ['tak']).status, 'dup');
  assert.equal(j('autobus', {odjazd: '', dojscie: '5'}, {kind: 'yes'}).status, 'empty');
  assert.equal(j('autobus', {odjazd: '1', dojscie: '5'}, {}).status, 'incomplete');
  assert.equal(j('telefon', {cena: '1200', kwota: '100'}, {kind: 'num', value: '12'}).category, 'rowno');
  assert.equal(j('telefon', {cena: '1000', kwota: '300'}, {kind: 'num', value: '4'}).category, 'reszta');
  assert.equal(j('telefon', {cena: '1000', kwota: '300'}, {kind: 'num', value: '3'}).status, 'wrong');
  assert.equal(j('telefon', {cena: '1000', kwota: '150'}, {kind: 'num', value: '7 mies.'}).status, 'new', 'przykład z lekcji: 7 miesięcy');
  assert.equal(j('telefon', {cena: '500', kwota: '800'}, {kind: 'num', value: '1'}).category, 'jeden');
  assert.equal(j('telefon', {cena: '500', kwota: '0'}, {kind: 'error'}).category, 'bledne');
  assert.equal(j('telefon', {cena: '500', kwota: '0'}, {kind: 'num', value: '0'}).status, 'wrong');
  // każda kategoria jest osiągalna
  const samples = {autobus: [[{odjazd: '10', dojscie: '5'}, {kind: 'yes'}], [{odjazd: '5', dojscie: '10'}, {kind: 'no'}], [{odjazd: '10', dojscie: '10'}, {kind: 'yes'}], [{odjazd: 'x', dojscie: '1'}, {kind: 'error'}]],
    telefon: [[{cena: '1200', kwota: '100'}, {kind: 'num', value: '12'}], [{cena: '1000', kwota: '300'}, {kind: 'num', value: '4'}], [{cena: '500', kwota: '500'}, {kind: 'num', value: '1'}], [{cena: '500', kwota: '0'}, {kind: 'error'}]]};
  for (const [id, list] of Object.entries(samples)) {
    const cats = list.map(([raw, exp]) => j(id, raw, exp));
    assert.ok(cats.every(c => c.status === 'new'), id);
    assert.deepEqual(cats.map(c => c.category).sort(), F.SPECS[id].categories.map(c => c.id).sort(), id);
  }
});

test('flowLab: punktacja — pełne punkty, pomyłki obniżają, ale nie zerują', () => {
  const bus = act('sp-bus');
  assert.deepEqual(F.flowResult(bus, undefined), {done: false, score: 0, max: 8, summary: undefined});
  const all = {got: {tak: {errors: 0}, nie: {errors: 0}, rowne: {errors: 1}, bledne: {errors: 0}}};
  assert.equal(F.flowResult(bus, all).score, 7); assert.equal(F.flowResult(bus, all).done, true);
  assert.match(F.flowResult(bus, all).summary, /4\/4/);
  const tr = act('al-trace');
  const q = {0: {ok: true, first: true}, 1: {ok: true, first: false}, 2: {ok: true, first: true}};
  assert.equal(F.flowResult(tr, {finished: true, mistakes: 0, q}).score, 5.5);
  assert.equal(F.flowResult(tr, {finished: true, mistakes: 9, q}).score, 1.5 + 2.5);
  assert.equal(F.flowResult(tr, {finished: true, mistakes: 0}).done, false, 'pytania też trzeba zaliczyć');
  const fill = act('al-fill');
  assert.equal(F.flowResult(fill, {passedAll: true, fails: 0}).score, 4);
  assert.equal(F.flowResult(fill, {passedAll: true, fails: 1}).score, 3);
  assert.equal(F.flowResult(fill, {passedAll: true, fails: 5}).score, 2);
});

/* ───────── Lekcje: rozkład, czasy, metody, karty wyniku ───────── */
const ROZKLAD = JSON.parse(readFileSync(new URL('../docs/rozklad-2026-2027.json', import.meta.url), 'utf8'));
test('Lekcje 60–64: klasa 1, numer i tytuł z rozkładu, 45 minut, 4–7 etapów, retrieval, metody COVE, bez pracy domowej', () => {
  const orders = {'60': 22, '61': 23, '62': 24, '63': 25, '64': 26};
  for (const l of ALL) {
    const row = ROZKLAD.find(r => r.klasa === 1 && r.lp === orders[l.id]);
    assert.equal(l.grade, 1); assert.equal(l.order, orders[l.id]); assert.equal(l.title, row.temat, l.id);
    assert.equal(l.duration, 45); assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
    assert.ok(l.sections.length >= 4 && l.sections.length <= 7);
    assert.ok(l.format.methods.length >= 3);
    for (const m of l.format.methods) assert.match(m.url, /^https:\/\/metodyka\.covepolska\.pl\/metoda-[a-z-]+\.html$/);
    assert.ok(!/w domu|praca domowa|przed lekcją|zadanie domowe/i.test(JSON.stringify(l.sections.map(s => [s.intro, s.title, s.reading]))), l.id);
    assert.equal(l.sections[0].id, 'start');
    assert.ok(l.sections[0].activities.filter(a => a.type === 'choice').length >= 2, `${l.id}: retrieval na starcie`);
    assert.ok(l.sections.every(s => !['pair', 'trio', 'group'].includes(s.grouping)), `${l.id}: domyślnie praca samodzielna`);
    assert.equal(l.sections.at(-1).activities.at(-1).type, 'resultCard');
    const ids = acts(l).map(a => a.id);
    assert.equal(new Set(ids).size, ids.length, `${l.id}: unikalne id`);
    for (const s of l.sections) for (const p of s.reading?.paragraphs || []) assert.ok(p.length < 520, `${l.id}/${s.id}: akapit za długi`);
    for (const a of acts(l)) if (a.requires) assert.ok(ids.includes(a.requires) && ids.indexOf(a.requires) < ids.indexOf(a.id), `${a.id}: requires`);
  }
  const sets = ALL.map(l => l.format.methods.map(m => m.name).sort().join('|'));
  assert.equal(new Set(sets).size, sets.length, 'różne zestawy metod');
  // 60 i 61 prawie bez kodu: Python dopiero na końcu 61
  assert.equal(labs(l60).length, 0);
  assert.ok(l61.sections.findIndex(s => s.activities.some(a => a.type === 'pythonLab')) >= l61.sections.length - 2);
});

function perfect(a) {
  if (a.type === 'choice') return {selected: a.correct[0], done: true, first: true};
  if (a.type === 'pythonLab') {
    const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
    const v = {q, passedAll: true, solvedScore: a.points, ranOk: true, visitedEnd: true, bestPassed: a.tests?.length, predict: {checked: true, ok: true}};
    return {...v, ...P.labResult(a, v)};
  }
  if (a.type === 'flowLab') {
    const q = Object.fromEntries((a.questions || []).map((_, i) => [i, {ok: true, first: true}]));
    const got = a.mode === 'tests' ? Object.fromEntries(F.SPECS[a.spec].categories.map(c => [c.id, {errors: 0}])) : undefined;
    const v = {q, got, finished: true, mistakes: 0, passedAll: true, fails: 0};
    return {...v, ...F.flowResult(a, v)};
  }
  return {done: true};
}
test('Karty wyniku: komplet = 100% i najwyższa odznaka, pusto = 0, źródła istnieją', () => {
  const maxes = {};
  for (const l of ALL) {
    const card = acts(l).find(a => a.type === 'resultCard');
    assert.equal(lessonScore(l, card, {}).score, 0);
    const answers = Object.fromEntries(acts(l).filter(a => a.type !== 'resultCard').map(a => [a.id, perfect(a)]));
    const r = lessonScore(l, card, answers);
    assert.equal(r.score, r.max, l.id); assert.ok(r.max >= 15, l.id);
    assert.equal(r.badge.name, [...card.badges].sort((a, b) => b.min - a.min)[0].name);
    for (const id of card.sources) assert.ok(acts(l).some(a => a.id === id), `${l.id}: ${id}`);
    // wszystkie oceniane zadania są w karcie
    for (const a of acts(l)) if (['choice', 'pythonLab', 'flowLab', 'matching', 'multi', 'sequence'].includes(a.type)) assert.ok(card.sources.includes(a.id), `${l.id}: ${a.id} poza kartą`);
    maxes[l.id] = r.max;
    assert.match(l.teacherGuide.summary, new RegExp(`maks\\. ${r.max} pkt`), `${l.id}: maks. w przewodniku = ${r.max}`);
  }
});

/* ───────── Zadania pythonLab w prawdziwym Pythonie ───────── */
const py = await loadPyodide({indexURL: new URL('../node_modules/pyodide/', import.meta.url).pathname});
py.runPython(P.RUNNER_PY);
const runFn = py.globals.get('_pl_run');
const run = req => JSON.parse(runFn(JSON.stringify(req)));
const firstWord = s => s.trim().split(/[ (=:]/)[0];

for (const lesson of [l61, l62, l63, l64]) {
  test(`${lesson.id}: rozwiązania wzorcowe przechodzą testy, kod startowy nie, pułapki układanek psują testy`, () => {
    for (const a of labs(lesson)) {
      assert.ok(['code', 'parsons', 'trace', 'predict'].includes(a.mode) && a.title && a.prompt, a.id);
      if (a.mode === 'code' && a.tests?.length) {
        const r = run({code: a.solution, stdin: a.stdin || [], tests: a.tests});
        assert.equal(r.error, null, `${a.id}: rozwiązanie bez błędu ${JSON.stringify(r.error)}`);
        assert.equal(r.stop, null, `${a.id}: rozwiązanie nie czeka na dane`);
        assert.ok(r.tests.every(t => t.ok), `${a.id}: ${JSON.stringify(r.tests.filter(t => !t.ok))}`);
        assert.ok(P.sourceChecks(a.solution, a.sourceChecks).every(t => t.ok), `${a.id}: sprawdzenia kodu`);
        const s = run({code: a.starter, stdin: a.stdin || [], tests: a.tests});
        const passes = !s.error && !s.stop && s.tests?.every(t => t.ok) && P.sourceChecks(a.starter, a.sourceChecks).every(t => t.ok);
        assert.ok(!passes, `${a.id}: kod startowy nie może przechodzić testów`);
        assert.ok(a.hints?.length >= 1, `${a.id}: podpowiedzi`);
        if (a.input) assert.ok(a.stdin?.length, `${a.id}: domyślne dane wejściowe`);
      } else if (a.mode === 'code') {
        assert.ok(a.questions?.length, `${a.id}: zadanie bez testów ma pytania`);
      }
      if (a.mode === 'parsons') {
        const blocks = P.parsonsBlocks(a).filter(b => !b.distractor);
        const r = run({code: P.parsonsCode(a, blocks.map(b => ({id: b.id, indent: b.indent}))), tests: a.tests});
        assert.equal(r.error, null, a.id); assert.equal(r.stop, null, `${a.id}: układanka bez input()`);
        assert.ok(r.tests.every(t => t.ok), a.id);
        assert.ok(a.distractors?.length >= 1);
        for (const [i, d] of a.distractors.entries()) {
          const similar = blocks.findIndex(b => firstWord(b.text) === firstWord(d));
          assert.ok(similar >= 0, `${a.id}: pułapka „${d}” ma podobną linię`);
          const prog = blocks.map(b => ({id: b.id, indent: b.indent}));
          prog[similar] = {id: `d${i}`, indent: blocks[similar].indent};
          const rr = run({code: P.parsonsCode(a, prog), tests: a.tests});
          assert.ok(rr.error || rr.tests?.some(t => !t.ok), `${a.id}: pułapka „${d}” powinna oblać testy`);
        }
      }
      if (a.mode === 'predict') {
        const r = run({code: a.code, stdin: a.stdin || []});
        assert.equal(r.error, null); assert.ok(P.outputLines(r.stdout).length <= (a.predictRows || 3) + 1, a.id);
        assert.ok(a.explain);
      }
      if (a.mode === 'trace') {
        const r = run({code: a.code, trace: true, maxSteps: P.MAX_TRACE_STEPS});
        assert.equal(r.error, null); assert.equal(r.stop, null, `${a.id}: w limicie kroków`);
      }
      for (const q of a.questions || []) {
        assert.ok(q.q && q.explain && q.hint, `${a.id}: pytanie z wyjaśnieniem i wskazówką`);
        if (q.options) assert.ok(q.correct.every(i => i >= 0 && i < q.options.length)); else assert.ok(P.checkQuestion(q, q.answer));
      }
    }
  });
}

test('Przewidywania i odpowiedzi do pytań zgadzają się z tym, co naprawdę robi Python', () => {
  const out = (code, stdin = []) => run({code, stdin}).stdout;
  const PRED = {'al-predict': 'Do zapłaty: 95 zł', 'py-quotes': '2 + 3\n5\nWynik: 5\n23', 'wa-predict': 'False\nTrue\nTrue\nFalse', 'wd-predict': 'True\nFalse\nFalse\nFalse'};
  for (const [id, exp] of Object.entries(PRED)) assert.ok(P.compareOutput(exp, out(act(id).code)).ok, `${id}: ${out(act(id).code)}`);
  // 61: pierwszy program
  assert.equal(out(act('al-run').solution).trim(), 'Do zapłaty: 120 zł');
  assert.equal(out(act('al-run').starter).trim(), 'Do zapłaty: 95 zł');
  // 62: śledzenie gracza, kino dla 5 osób, godziny, kieszonkowe na rok
  const tr = run({code: act('py-trace').code, trace: true});
  const end = tr.steps.at(-1).g;
  assert.equal(end.poziom.r, '13'); assert.equal(end.zloto.t, 'float');
  assert.equal(tr.stdout.trim(), act('py-trace').questions[2].options[0]);
  assert.equal(out(act('py-cinema').solution.replace('osoby = 4', 'osoby = 5')).trim(), 'Bilety do kina: 110 zł');
  assert.match(out(act('py-hours').starter, ['2']), new RegExp(`2 h to ${'2'.repeat(60)} minut`), '„2” * 60 skleja dwójki');
  assert.match(out(act('py-pocket').solution, ['35', '52']), /uzbierasz 1820 zł/);
  assert.ok(out(act('py-card').solution).includes('Nick: Kot_Bonifacy'));
  // 63: bilet krok po kroku — linie 6–7 nie wykonują się dla 15 lat, a dla 18 lat bilet normalny
  const bilet = run({code: act('wa-trace').code, trace: true});
  const lines = new Set(bilet.steps.map(s => s.line));
  assert.ok(lines.has(3) && lines.has(4) && !lines.has(6) && !lines.has(7) && lines.has(8));
  assert.equal(out(act('wa-trace').code.replace('wiek = 15', 'wiek = 18')).trim(), 'Bilet normalny\nDo zapłaty: 25 zł');
  // 63: mecz — trzy błędy pokazują się po kolei, po polsku
  let code = act('wa-fix').starter;
  const titles = [];
  for (const fix of [c => c.replace('"Bez wygranej)', '"Bez wygranej")'), c => c.replace('if nasze > ich\n', 'if nasze > ich:\n'), c => c.replace('\nprint("Wygrana', '\n    print("Wygrana')]) {
    const r = run({code, stdin: ['3', '1']});
    titles.push(P.explainError(r.error, code).title);
    code = fix(code);
  }
  assert.deepEqual(titles, ['Tekst bez cudzysłowu na końcu', 'Brakuje dwukropka', 'Brakuje wcięcia'], 'kolejność zgodna z podpowiedziami');
  assert.equal(code, act('wa-fix').solution);
  // 64: naiwny kalkulator — „dziesięć” wysypuje, 150% daje −100.00
  const naive = act('wd-break');
  const bad = run({code: naive.starter, stdin: naive.stdin});
  assert.equal(bad.error.type, 'ValueError'); assert.equal(P.explainError(bad.error).title, 'To nie jest liczba całkowita');
  const neg = out(naive.starter, ['200', '150']);
  assert.match(neg, /Do zapłaty: -100\.00 zł/);
  assert.ok(P.checkQuestion(naive.questions[1], '-100.00') && P.checkQuestion(naive.questions[1], '-100'));
  const ok = run({code: naive.starter, stdin: ['200', '10']});
  assert.equal(ok.error, null); assert.equal(ok.stop, null);
  // 64: pułapki strażnika wysypują program właśnie na int("abc")
  for (const [i] of act('wd-parsons').distractors.entries()) {
    const a = act('wd-parsons');
    const blocks = P.parsonsBlocks(a).filter(b => !b.distractor);
    const prog = blocks.map(b => ({id: b.id, indent: b.indent}));
    prog[1] = {id: `d${i}`, indent: 0};
    assert.equal(run({code: P.parsonsCode(a, prog)}).error?.type, 'ValueError');
  }
  // 64: kalkulator — dodatkowe dane spoza testów
  const prod = act('wd-product').solution;
  assert.match(out(prod, ['0', '50']), /Do zapłaty: 0\.00 zł/);
  assert.match(out(prod, ['12,5', '10']), /Błąd/);
  assert.match(out(prod, ['200', '']), /Błąd/);
});
