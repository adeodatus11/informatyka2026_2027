// Testy logiki symulatorów lekcji 16 (cipherLab) i 18 (sortLab): node --test tests/sims-g2-concepts.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../content/sims/cipherLab.js';
import * as S from '../content/sims/sortLab.js';
import {lessonScore} from '../content/scoring.js';
import l16 from '../content/lessons/16-substitution-cipher.js';
import l18 from '../content/lessons/18-sorting-algorithms.js';

/* ───────── szyfrowanie ───────── */
test('Cezar: przykłady z podręcznika, polskie znaki, klucze modulo 26', () => {
  assert.equal(C.caesar('ABC XYZ', 3), 'DEF ABC');
  assert.equal(C.caesar('Kartkówka jutro', 3), 'NDUWNRZND MXWUR');
  assert.equal(C.caesar('Zażółć gęślą jaźń', 1), 'ABAPMD HFTMB KBAO');
  assert.equal(C.caesar('ALA', 3), 'DOD');
  assert.equal(C.caesar('Hej, 16!', 26), 'HEJ, 16!');
  assert.equal(C.caesar('HEJ', -1), C.caesar('HEJ', 25));
  for (let k = 0; k < 26; k++) assert.equal(C.caesarDecrypt(C.caesar('Szyfr podstawieniowy 2026', k), k), 'SZYFR PODSTAWIENIOWY 2026');
  assert.equal(C.caesarTable(3)[0].cipher, 'D');
  assert.equal(C.caesarTable(3)[25].cipher, 'C');
  assert.equal(new Set(C.caesarTable(7).map(r => r.cipher)).size, 26, 'podstawienie jest permutacją');
});

test('Cezar: zadania mają poprawne klucze odpowiedzi i wskazówki', () => {
  const [enc, dec, keys] = C.caesarTasks;
  assert.equal(C.caesarExpected(enc), 'NDUWNRZND MXWUR');
  assert.equal(C.caesarTaskCipher(dec), 'WPGGH WV SLRJQHJO');
  assert.ok(C.checkCaesarTask(enc, 'nduwnrznd mxwur').ok, 'wielkość liter i spacje bez znaczenia');
  assert.ok(C.checkCaesarTask(enc, 'NDUWNRZNDMXWUR').ok);
  const bad = C.checkCaesarTask(enc, 'NDUWNRZNB MXWUR');
  assert.equal(bad.ok, false);
  assert.match(bad.message, /9\. litera/);
  assert.match(C.checkCaesarTask(enc, 'NDUW').message, /Masz 4 litery/);
  assert.ok(C.checkCaesarTask(dec, 'Pizza po lekcjach').ok);
  assert.equal(keys.options[keys.correct], '25');
  assert.ok(C.checkCaesarTask(keys, 1).ok);
  assert.equal(C.checkCaesarTask(keys, 0).ok, false);
});

test('GA-DE-RY-PO-LU-KI: szyfrowanie = deszyfrowanie', () => {
  assert.equal(C.gaderypoluki('GADERYPOLUKI'), 'AGEDYROPULIK');
  assert.equal(C.gaderypoluki('Ognisko'), 'PANKSIP');
  for (const t of ['Zbiórka w piątek przy szkole', 'HASLO 123', C.CRACK_PLAIN]) assert.equal(C.gaderypoluki(C.gaderypoluki(t)), C.normalize(t));
  const [word, sentence, same] = C.gaderyTasks;
  assert.equal(word.cipher, 'PANKSIP');
  assert.ok(C.checkGaderyTask(word, 'ognisko').ok);
  assert.equal(C.gaderypoluki(sentence.cipher), 'ZBIORKA W PIATEK PRZY SZKOLE');
  assert.ok(C.checkGaderyTask(sentence, 'Zbiórka w piątek przy szkole').ok);
  assert.equal(same.correct, 1);
});

test('Punkty zadań: 2 za pierwszą próbę, 1 po poprawce, wynik nie maleje po sukcesie', () => {
  let st = C.attempt({}, false);
  st = C.attempt(st, true);
  assert.equal(st.solvedAt, 2);
  assert.equal(C.attempt(st, false).solvedAt, 2);
  assert.equal(C.taskPoints(1), 2);
  assert.equal(C.taskPoints(2), 1);
  assert.equal(C.taskPoints(undefined), 0);
  const full = C.caesarResult({tasks: {enc: {solved: true, solvedAt: 1}, dec: {solved: true, solvedAt: 1}, keys: {solved: true, solvedAt: 1}}});
  assert.deepEqual([full.score, full.max, full.done], [6, 6, true]);
  assert.equal(full.summary, 'Szyfr Cezara: NDUWNRZND MXWUR (klucz 3)');
  const part = C.gaderyResult({tasks: {word: {solved: true, solvedAt: 2}}});
  assert.deepEqual([part.score, part.max, part.done], [1, 6, false]);
  assert.equal(C.caesarResult(undefined).score, 0);
});

test('Pojedynek: walidacja wiadomości, dopasowanie klucza, łamanie wszystkich kluczy', () => {
  assert.equal(C.validateMessage('krótko').ok, false);
  assert.equal(C.validateMessage('Spotkajmy się o piątej!').ok, true);
  assert.equal(C.letterCount('Ą, ę! 12 ż'), 3);
  const cipher = C.encryptWith('caesar', 'Spotkajmy się o piątej', 11);
  assert.deepEqual(C.matchCipher(cipher, 'spotkajmy sie o piatej'), {ok: true, method: 'caesar', key: 11});
  assert.equal(C.matchCipher(cipher, 'spotkajmy sie o piatek').ok, false);
  assert.equal(C.matchCipher(C.encryptWith('gadery', 'Wiadomość dla drużyny'), 'Wiadomosc dla druzyny').method, 'gadery');
  const shifts = C.allShifts(cipher);
  assert.equal(shifts.length, 25);
  assert.equal(shifts.find(s => s.key === 11).text, 'SPOTKAJMY SIE O PIATEJ');
  for (const p of C.soloPuzzles) {
    assert.ok(p.key > 0 && p.key < 26);
    assert.equal(C.caesarDecrypt(p.cipher, p.key), C.normalize(p.plain));
    assert.ok(C.letterCount(p.plain) >= C.MIN_LETTERS);
  }
  assert.deepEqual(C.duelResult({}), {done: false, score: 0, max: 6, aPts: 0, bPts: 0, summary: undefined});
  const pair = C.duelResult({a: {locked: true, text: 'Spotkajmy sie o piatej'}, b: {confirmed: true, keyTries: 7, ms: 42000}});
  assert.deepEqual([pair.score, pair.done], [6, true]);
  assert.equal(pair.summary, 'Pojedynek: zaszyfrowano 19 liter, złamano szyfr w 7 próbach (0:42)');
  assert.equal(C.duelResult({a: {locked: true, text: 'x'.repeat(12)}, solo: {solved: true, solvedAt: 2, keyTries: 1, recTries: 1}}).score, 5);
  assert.equal(C.duelResult({b: {confirmed: true, fails: 1}}).score, 3);
});

test('Analiza częstości: szyfrogram, klucz, rozkład liter i hasło', () => {
  assert.equal(new Set(C.CRACK_KEY).size, 26);
  assert.ok([...C.ALPHABET].every((ch, i) => C.CRACK_KEY[i] !== ch), 'żadna litera nie przechodzi w siebie');
  assert.ok(C.letterCount(C.CRACK_PLAIN) > 250, 'tekst dość długi, by częstość działała');
  assert.ok(C.crackCipher.startsWith('EMTLE. '));
  assert.ok(C.lettersOnly(C.CRACK_PLAIN).endsWith(C.CRACK_PASSWORD));
  // rozszyfrowanie pełnym kluczem daje tekst jawny
  assert.equal(C.guessText(C.crackCipher, C.crackSolution), C.normalize(C.CRACK_PLAIN));
  // najczęstsze litery tekstu to A i E — jak w typowym polskim tekście
  const top = C.crackFreq.slice(0, 2).map(f => C.crackSolution[f.letter]);
  assert.deepEqual(top, ['A', 'E']);
  assert.ok(Math.abs(C.PL_FREQ.reduce((s, [, p]) => s + p, 0) - 100) < 3, 'częstości sumują się ok. do 100%');
  assert.equal(C.guessText('AB C', {A: 'X'}), 'X· ·');
  assert.deepEqual(C.duplicates({Q: 'A', T: 'A', O: 'I'}), {A: ['Q', 'T']});
  const h = C.hintLetter({});
  assert.equal(h.cipher, C.crackFreq[0].letter);
  assert.equal(C.hintLetter({[h.cipher]: h.plain}).cipher, C.crackFreq[1].letter);
  assert.equal(C.crackProgress(C.crackSolution).correct, C.crackFreq.length);
  assert.ok(C.checkPassword('rejewski').ok);
  assert.equal(C.checkPassword('enigma').ok, false);
  assert.deepEqual([C.crackResult({solved: true}).score, C.crackResult({solved: true, hints: 2, wrong: 1}).score, C.crackResult({solved: true, hints: 9}).score, C.crackResult({}).score], [8, 5, 3, 0]);
  assert.equal(C.crackResult({solved: true}).summary, 'Złamany szyfr: REJEWSKI — bez odkrywania liter');
});

/* ───────── sortowanie ───────── */
test('Bąbelkowe: n(n−1)/2 porównań, zamiany = inwersje, poprawny wynik', () => {
  const t = S.bubbleTrace(S.WORKED);
  assert.deepEqual(t.result, [8, 12, 19, 27, 34, 51]);
  assert.equal(t.comparisons, 15);
  assert.equal(t.swaps, S.inversions(S.WORKED));
  assert.equal(t.swaps, 9);
  assert.equal(t.steps.length, 15);
  assert.equal(t.steps.filter(s => s.pass === 1).length, 5);
  assert.equal(t.steps.filter(s => s.pass === 1).at(-1).after.at(-1), 51, 'po 1. przejściu największa na końcu');
  assert.deepEqual(S.bubbleAfterPass([40, 25, 60, 10, 35], 1), [25, 40, 10, 35, 60]);
  for (const n of [2, 6, 10, 100]) assert.equal(S.bubbleCount(S.randomArray(n, n)).comparisons, S.bubbleComparisons(n));
  assert.equal(S.bubbleComparisons(1000), 499500);
});

test('Wstawianie: porównania i przesunięcia, najlepszy przypadek n−1', () => {
  const t = S.insertionTrace(S.WORKED);
  assert.deepEqual(t.result, [8, 12, 19, 27, 34, 51]);
  assert.equal(t.swaps, 9);
  assert.equal(t.comparisons, 12);
  assert.equal(S.insertionCount([1, 2, 3, 4, 5, 6]).comparisons, 5);
  assert.equal(S.insertionCount([6, 5, 4, 3, 2, 1]).comparisons, 15);
  assert.deepEqual(S.insertionAfter([50, 20, 40, 10, 30], 2), [20, 40, 50, 10, 30]);
  // wstawianie 27 do 12, 34, 51 → 3 porównania
  assert.equal(S.insertionCount([12, 34, 51, 27]).comparisons - S.insertionCount([12, 34, 51]).comparisons, 3);
  for (const a of [S.WORKED, [5, 1, 4, 2, 8, 3], S.randomArray(40, 5)]) {
    assert.deepEqual(S.insertionCount(a), (({comparisons, swaps}) => ({comparisons, swaps}))(S.insertionTrace(a)));
    assert.deepEqual(S.bubbleCount(a), (({comparisons, swaps}) => ({comparisons, swaps}))(S.bubbleTrace(a)));
  }
  for (const n of [5, 50, 300]) { const a = S.randomArray(n, 3 * n); assert.deepEqual(S.insertionTrace(a).result, [...a].sort((x, y) => x - y)); assert.equal(S.insertionCount(a).swaps, S.inversions(a)); }
});

test('Pytania przewidujące mają klucze zgodne z algorytmami', () => {
  const [p1, c1, call] = S.bubbleQuestions;
  assert.equal(p1.options[p1.correct], '25, 40, 10, 35, 60');
  assert.equal(Number(c1.options[c1.correct]), 5);
  assert.equal(Number(call.options[call.correct]), S.bubbleComparisons(6));
  const [hand, step2, sorted] = S.insertionQuestions;
  assert.equal(Number(hand.options[hand.correct]), 3);
  assert.equal(step2.options[step2.correct], '20, 40, 50, 10, 30');
  assert.equal(Number(sorted.options[sorted.correct]), S.insertionCount([1, 2, 3, 4, 5, 6]).comparisons);
  for (const q of [...S.bubbleQuestions, ...S.insertionQuestions, ...S.raceQuestions]) assert.equal(new Set(q.options).size, q.options.length, q.id);
  const r = S.bubbleResult({q: {pass1: {solved: true, solvedAt: 1}, cmp1: {solved: true, solvedAt: 2}, cmpAll: {solved: true, solvedAt: 1}}});
  assert.deepEqual([r.score, r.max, r.done], [5, 6, true]);
});

test('Wyścig: n² dla bąbelkowego, wstawianie wygrywa na prawie posortowanych', () => {
  const rows = S.raceTable();
  assert.equal(rows.length, 6);
  const get = (n, k) => rows.find(r => r.n === n && r.kind === k);
  assert.deepEqual([10, 100, 1000].map(n => get(n, 'random').bubble.comparisons), [45, 4950, 499500]);
  const ratio = get(1000, 'random').bubble.comparisons / get(100, 'random').bubble.comparisons;
  assert.ok(ratio > 95 && ratio < 105, '10× danych ≈ 100× porównań');
  const ir = get(1000, 'random').insertion.comparisons / get(100, 'random').insertion.comparisons;
  assert.ok(ir > 80 && ir < 125, 'wstawianie też rośnie jak n² na losowych');
  for (const n of S.RACE_SIZES) {
    const nr = get(n, 'nearly');
    assert.ok(nr.insertion.comparisons < 1.2 * n + 5, 'prawie posortowane: ok. n porównań');
    assert.ok(nr.insertion.comparisons < nr.bubble.comparisons);
    assert.equal(nr.bubble.swaps, nr.insertion.swaps, 'obie metody robią tyle samo zamian');
  }
  assert.equal(S.raceQuestions[0].options[S.raceQuestions[0].correct].includes('500 000'), true);
  assert.equal(S.humanTime(45), '45 s');
  assert.equal(S.humanTime(4950), '1 h 22 min');
  assert.equal(S.humanTime(499500), '5,8 dnia');
  assert.equal(S.fmtNum(499500), '499 500');
  assert.deepEqual(S.randomArray(10), S.randomArray(10), 'dane deterministyczne');
});

test('Pokonaj algorytm: zamiany sąsiadów, porównania kart i punktacja rund', () => {
  const [r1, r2] = S.MANUAL_ROUNDS;
  assert.equal(S.roundBench(r1).bubble.comparisons, 28);
  assert.equal(S.roundBench(r2).bubble.comparisons, 28);
  assert.ok(S.roundBench(r2).insertion.comparisons < 28);
  assert.throws(() => S.swapAdjacent(S.startOrder(r1), 0, 2), /sąsiednie/);
  assert.deepEqual(S.swapAdjacent(['A', 'B', 'C'], 1, 0), ['B', 'A', 'C']);
  assert.equal(S.compareCards(r2, 'A', 'B'), '>');
  // symulacja ucznia: sortuje zamianami sąsiadów tylko par w złej kolejności → minimum zamian
  let order = S.startOrder(r1), swaps = 0;
  for (let changed = true; changed;) { changed = false; for (let i = 0; i < 7; i++) { const v = S.orderValues(r1, order); if (v[i] > v[i + 1]) { order = S.swapAdjacent(order, i, i + 1); swaps++; changed = true; } } }
  assert.ok(S.isSorted(S.orderValues(r1, order)));
  assert.equal(swaps, S.roundBench(r1).minSwaps);
  assert.equal(S.roundScore(r1, {sorted: true, swaps}), 3);
  assert.equal(S.roundScore(r1, {sorted: true, swaps: swaps + 2}), 2);
  assert.equal(S.roundScore(r2, {sorted: true, comparisons: 20}), 3);
  assert.equal(S.roundScore(r2, {sorted: true, comparisons: 28}), 2);
  assert.equal(S.roundScore(r2, {comparisons: 3}), 0);
  const res = S.manualResult({rounds: {open: {sorted: true, swaps: 14}, blind: {sorted: true, comparisons: 21}}});
  assert.deepEqual([res.score, res.max, res.done], [6, 6, true]);
  assert.equal(res.summary, 'Ty vs algorytm (runda 2): 21 porównań · bąbelkowe 28 · wstawianie 22');
});

test('Pseudokod: kolejność kroków i wskazówki', () => {
  assert.equal(S.checkPseudo(S.PSEUDO_STEPS.map(s => s.id)).ok, true);
  const bad = S.checkPseudo(S.PSEUDO_SHUFFLED);
  assert.equal(bad.ok, false);
  assert.ok(bad.wrong.length > 0);
  assert.equal(S.pseudoResult({solved: true, solvedAt: 1}).score, 2);
  assert.equal(S.pseudoResult({solved: true, solvedAt: 3}).score, 1);
});

/* ───────── lekcje ───────── */
for (const [lesson, maxPts, sims] of [[l16, 29, ['cipherLab']], [l18, 28, ['sortLab']]]) {
  test(`lekcja ${lesson.id}: struktura, czas, karta wyniku ze stałym maksimum`, () => {
    assert.equal(lesson.grade, 2);
    assert.ok(lesson.sections.length >= 4 && lesson.sections.length <= 7);
    assert.equal(lesson.sections.reduce((s, x) => s + x.duration, 0), lesson.duration);
    assert.equal(lesson.duration, 45);
    assert.equal(lesson.tags.length, 3);
    assert.ok(lesson.format.methods.length >= 3);
    const card = lesson.sections.at(-1).activities.find(a => a.type === 'resultCard');
    assert.ok(card);
    const empty = lessonScore(lesson, card, {});
    assert.equal(empty.max, maxPts);
    assert.equal(empty.score, 0);
    assert.equal(card.badges.length, 3);
    const all = lesson.sections.flatMap(s => s.activities);
    const ids = all.map(a => a.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const a of all) {
      if (a.options) assert.equal(new Set(a.options).size, a.options.length, a.id);
      if (sims.includes(a.type)) { assert.ok(a.label && a.points > 1 && card.sources.includes(a.id), a.id); }
    }
    assert.doesNotMatch(JSON.stringify(lesson), /prac[ay] domow|zadanie domowe|przed lekcją|w domu/i);
  });
}

test('Maksima punktów w lekcjach zgadzają się z maksimami symulatorów', () => {
  const max = {caesar: C.caesarResult().max, gaderypoluki: C.gaderyResult().max, duel: C.duelResult().max, crack: C.crackResult().max,
    manual: S.manualResult().max, bubble: S.bubbleResult().max, insertion: S.insertionResult().max, race: S.raceResult().max, pseudocode: S.pseudoResult().max};
  for (const l of [l16, l18]) for (const a of l.sections.flatMap(s => s.activities).filter(a => a.mode)) assert.equal(a.points, max[a.mode], `${l.id} ${a.id}`);
});
