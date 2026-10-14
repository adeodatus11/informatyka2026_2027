// Logika symulatora „textLab” (lekcja 53, klasa 3: wybrane algorytmy na tekstach — bez kodu).
// Czysty JS, bez Reacta i DOM. Testy: tests/sims-g3-text.test.mjs
// Liczymy porównania znaków dokładnie tak, jak robią to programy z lekcji 55–56 w Pythonie:
//  • porównanie tekstów: znak po znaku od lewej, stop na pierwszej różnicy;
//  • palindrom: dwa wskaźniki od końców, stop na pierwszej różnicy;
//  • wyszukiwanie wzorca metodą naiwną: każde okno od lewej, stop na pierwszej różnicy w oknie.

export const chars = s => Array.from(String(s ?? ''));
export const code = c => c.codePointAt(0);
export const show = c => (c === ' ' ? '␣' : c);

/* ───────── porównywanie leksykograficzne (kody znaków, jak Python i JS) ───────── */
export function compareTrace(a, b) {
  const A = chars(a), B = chars(b), steps = [];
  let i = 0, comparisons = 0;
  while (i < A.length && i < B.length) {
    comparisons++;
    const eq = A[i] === B[i];
    steps.push({i, ca: A[i], cb: B[i], eq, comparisons});
    if (!eq) break;
    i++;
  }
  const last = steps[steps.length - 1];
  let result, reason;
  if (last && !last.eq) { result = code(last.ca) < code(last.cb) ? -1 : 1; reason = 'diff'; }
  else if (A.length === B.length) { result = 0; reason = 'equal'; }
  else { result = A.length < B.length ? -1 : 1; reason = 'prefix'; }
  return {steps, comparisons, result, reason, at: last && !last.eq ? last.i : i};
}
export const codeSort = list => [...list].sort((x, y) => compareTrace(x, y).result);

/* Alfabet polski (z q, v, x jak w telefonach) — sortowanie „po ludzku”: bez względu na wielkość liter. */
export const PL_ALPHABET = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
export function plKey(c) { const i = PL_ALPHABET.indexOf(c.toLowerCase()); return i >= 0 ? 1000 + i : code(c); }
export function plCompare(a, b) {
  const A = chars(a), B = chars(b);
  for (let i = 0; i < Math.min(A.length, B.length); i++) { const d = plKey(A[i]) - plKey(B[i]); if (d) return d < 0 ? -1 : 1; }
  if (A.length !== B.length) return A.length < B.length ? -1 : 1;
  return compareTrace(a, b).result;
}
export const plSort = list => [...list].sort(plCompare);

/* ───────── zliczanie znaku ───────── */
export function countTrace(text, ch, ignoreCase = false) {
  const T = chars(text), steps = [];
  let count = 0;
  const norm = c => (ignoreCase ? c.toLowerCase() : c);
  T.forEach((c, i) => { const hit = norm(c) === norm(ch); if (hit) count++; steps.push({i, c, hit, count, comparisons: i + 1}); });
  return {steps, count, comparisons: T.length};
}

/* ───────── palindrom: dwa wskaźniki ───────── */
export const normalizeText = t => chars(String(t).toLowerCase()).filter(c => /[\p{L}\p{N}]/u.test(c)).join('');
export function palindromeTrace(text, normalize = false) {
  const t = normalize ? normalizeText(text) : String(text);
  const T = chars(t), steps = [];
  let l = 0, r = T.length - 1, comparisons = 0, ok = true;
  while (l < r) {
    comparisons++;
    const eq = T[l] === T[r];
    steps.push({l, r, cl: T[l], cr: T[r], eq, comparisons});
    if (!eq) { ok = false; break; }
    l++; r--;
  }
  return {text: t, steps, comparisons, ok};
}

/* ───────── anagram: posortuj litery i porównaj ───────── */
export function anagramCheck(a, b) {
  const prep = s => chars(String(s).toLowerCase()).filter(c => c !== ' ').sort((x, y) => plKey(x) - plKey(y));
  const A = prep(a), B = prep(b);
  const cmp = compareTrace(A.join(''), B.join(''));
  return {a: A, b: B, ok: A.length === B.length && cmp.result === 0, cmp};
}

/* ───────── wyszukiwanie wzorca metodą naiwną ───────── */
// Każdy krok to jedno porównanie t[s + j] z p[j] i akcja, którą algorytm wykona po nim:
//  'next'  — znaki równe, porównaj następny znak w tym oknie,
//  'shift' — znaki różne, przesuń wzorzec o 1 w prawo,
//  'found' — równe i to był ostatni znak wzorca: zapisz pozycję s, przesuń o 1.
export const windowsCount = (n, m) => Math.max(0, n - m + 1);
export function patternTrace(text, pattern) {
  const T = chars(text), P = chars(pattern), steps = [], found = [];
  let comparisons = 0;
  for (let s = 0; s + P.length <= T.length && P.length; s++) {
    for (let j = 0; j < P.length; j++) {
      comparisons++;
      const eq = T[s + j] === P[j];
      const action = !eq ? 'shift' : j === P.length - 1 ? 'found' : 'next';
      if (action === 'found') found.push(s);
      steps.push({s, j, ct: T[s + j], cp: P[j], eq, action, comparisons, found: [...found]});
      if (!eq) break;
    }
  }
  return {steps, comparisons, found, windows: windowsCount(T.length, P.length), n: T.length, m: P.length};
}
export const ACTIONS = [
  {id: 'next', label: 'Równe → porównuję następny znak'},
  {id: 'shift', label: 'Różne → przesuwam wzorzec o 1'},
  {id: 'found', label: 'Równe i to ostatni znak wzorca → trafienie!'},
];

/* ───────── wiersze „taśmy” do wyświetlenia (kratki ze znakami) ───────── */
// Komórka: {ch, idx, mark, tag}; mark: '' | 'cur' | 'eq' | 'ne' | 'hit' | 'dim' | 'gap'; tag = krótki napis nad kratką.
export function patternRows(text, pattern, s, j, {reveal = false, eq = null, found = []} = {}) {
  const T = chars(text), P = chars(pattern);
  const hits = new Set(found.flatMap(f => P.map((_, k) => f + k)));
  const textRow = T.map((c, i) => {
    let mark = hits.has(i) ? 'hit' : '';
    if (s != null && i >= s && i < s + P.length) {
      const k = i - s;
      if (k < j) mark = 'eq'; else if (k === j) mark = reveal ? (eq ? 'eq' : 'ne') : 'cur';
    }
    return {ch: c, idx: i, mark, tag: s != null && i === s + j ? '▼' : ''};
  });
  const patRow = T.map((_, i) => {
    const k = s == null ? -1 : i - s;
    if (k < 0 || k >= P.length) return {ch: null, idx: i, mark: 'gap'};
    let mark = '';
    if (k < j) mark = 'eq'; else if (k === j) mark = reveal ? (eq ? 'eq' : 'ne') : 'cur'; else mark = 'dim';
    return {ch: P[k], idx: k, mark, tag: k === j ? '▲' : ''};
  });
  return [{label: 'tekst', cells: textRow, numbers: true}, {label: 'wzorzec', cells: patRow}];
}

/** Klatki odtwarzacza dla każdego algorytmu: {rows, say, hud:[[nazwa, wartość]]}. */
export function patternFrames(text, pattern) {
  const tr = patternTrace(text, pattern);
  const frames = [{rows: patternRows(text, pattern, tr.windows ? 0 : null, 0, {}), say: tr.windows ? `Start: wzorzec „${pattern}” przykładam do początku tekstu (okno 0). Porównuję pierwszy znak.` : 'Wzorzec jest dłuższy niż tekst — nie ma żadnego okna do sprawdzenia.', hud: [['Okno', tr.windows ? 0 : '—'], ['Porównania', 0], ['Trafienia', '—']]}];
  tr.steps.forEach(st => {
    const say = st.action === 'next' ? `Okno ${st.s}: „${show(st.ct)}” = „${show(st.cp)}” — równe, porównuję następny znak.`
      : st.action === 'found' ? `Okno ${st.s}: „${show(st.ct)}” = „${show(st.cp)}” i to ostatni znak wzorca — trafienie na pozycji ${st.s}! Przesuwam o 1.`
        : `Okno ${st.s}: „${show(st.ct)}” ≠ „${show(st.cp)}” — różne, przesuwam wzorzec o 1 w prawo.`;
    frames.push({rows: patternRows(text, pattern, st.s, st.j, {reveal: true, eq: st.eq, found: st.found}), say,
      hud: [['Okno', st.s], ['Porównania', st.comparisons], ['Trafienia', st.found.length ? st.found.join(', ') : '—']]});
  });
  frames.push({rows: patternRows(text, pattern, null, 0, {found: tr.found}), say: `Koniec: kolejne okno nie mieści się w tekście. ${tr.windows} okien, ${tr.comparisons} porównań, trafienia: ${tr.found.length ? tr.found.join(', ') : 'brak'}.`,
    hud: [['Okna', tr.windows], ['Porównania', tr.comparisons], ['Trafienia', tr.found.length ? tr.found.join(', ') : '—']]});
  return frames;
}

export function compareFrames(a, b) {
  const tr = compareTrace(a, b), A = chars(a), B = chars(b);
  const row = (S, label, upto, cur, eq) => ({label, numbers: label === a, cells: S.map((c, i) => ({ch: c, idx: i, mark: i < upto ? 'eq' : i === cur ? (eq ? 'eq' : 'ne') : '', tag: i === cur ? '▼' : ''}))});
  const frames = [{rows: [row(A, a, 0, -1), row(B, b, 0, -1)], say: `Porównuję „${a}” i „${b}” znak po znaku od lewej.`, hud: [['Porównania', 0]]}];
  tr.steps.forEach(st => frames.push({rows: [row(A, a, st.i, st.i, st.eq), row(B, b, st.i, st.i, st.eq)],
    say: st.eq ? `Pozycja ${st.i}: „${show(st.ca)}” = „${show(st.cb)}” — idę dalej.` : `Pozycja ${st.i}: „${show(st.ca)}” (kod ${code(st.ca)}) ≠ „${show(st.cb)}” (kod ${code(st.cb)}). Mniejszy kod wygrywa.`,
    hud: [['Porównania', st.comparisons]]}));
  frames.push({rows: frames[frames.length - 1].rows, say: compareVerdict(a, b), hud: [['Porównania', tr.comparisons]]});
  return frames;
}
export function compareVerdict(a, b) {
  const tr = compareTrace(a, b);
  const first = tr.result <= 0 ? a : b;
  if (tr.reason === 'diff') { const st = tr.steps[tr.steps.length - 1]; return `Pierwsza różnica na pozycji ${st.i}: „${st.ca}” ma kod ${code(st.ca)}, a „${st.cb}” — ${code(st.cb)}. Wyżej jest „${first}”. Porównań: ${tr.comparisons}.`; }
  if (tr.reason === 'prefix') return `Pierwsze ${tr.comparisons} znaki są takie same, ale „${first}” już się skończyło — krótszy tekst wygrywa. Wyżej jest „${first}”. Porównań: ${tr.comparisons}.`;
  return `Teksty są identyczne. Porównań: ${tr.comparisons}.`;
}

export function countFrames(text, ch, ignoreCase = false) {
  const tr = countTrace(text, ch, ignoreCase), T = chars(text);
  const rows = upto => [{label: 'tekst', numbers: true, cells: T.map((c, i) => ({ch: c, idx: i, mark: i < upto ? (tr.steps[i].hit ? 'hit' : 'dim') : i === upto ? 'cur' : '', tag: i === upto ? '▼' : ''}))}];
  const frames = [{rows: rows(-1), say: `Szukam znaku „${ch}”${ignoreCase ? ' (bez względu na wielkość liter)' : ''}. Licznik = 0.`, hud: [['Porównania', 0], ['Licznik', 0]]}];
  tr.steps.forEach(st => frames.push({rows: rows(st.i).map(r => ({...r, cells: r.cells.map((c, i) => i === st.i ? {...c, mark: st.hit ? 'hit' : 'ne'} : c)})),
    say: st.hit ? `Pozycja ${st.i}: „${show(st.c)}” pasuje — licznik = ${st.count}.` : `Pozycja ${st.i}: „${show(st.c)}” nie pasuje.`, hud: [['Porównania', st.comparisons], ['Licznik', st.count]]}));
  frames.push({rows: rows(T.length), say: `Koniec tekstu. Wynik: ${tr.count}. Każdy znak porównany raz — ${tr.comparisons} porównań.`, hud: [['Porównania', tr.comparisons], ['Licznik', tr.count]]});
  return frames;
}

export function palindromeFrames(text, normalize = false) {
  const tr = palindromeTrace(text, normalize), T = chars(tr.text);
  const rows = (l, r, reveal, eq, doneUpTo) => [{label: normalize ? 'po przygotowaniu' : 'tekst', numbers: true, cells: T.map((c, i) => {
    let mark = '';
    if (i < doneUpTo || i > T.length - 1 - doneUpTo) mark = 'eq';
    if (i === l || i === r) mark = reveal ? (eq ? 'eq' : 'ne') : 'cur';
    return {ch: c, idx: i, mark, tag: i === l && i === r ? '' : i === l ? 'L' : i === r ? 'P' : ''};
  })}];
  const frames = [{rows: rows(-1, -1, false, null, 0), say: normalize ? `Najpierw przygotowanie: małe litery, bez spacji i znaków interpunkcyjnych → „${tr.text}”. Wskaźnik L na początku, P na końcu.` : 'Wskaźnik L na pierwszym znaku, P na ostatnim. Porównuję dokładnie — wielkość liter i spacje się liczą.', hud: [['Porównania', 0]]}];
  tr.steps.forEach((st, k) => frames.push({rows: rows(st.l, st.r, true, st.eq, k), say: st.eq ? `„${show(st.cl)}” = „${show(st.cr)}” — przesuwam L w prawo, P w lewo.` : `„${show(st.cl)}” ≠ „${show(st.cr)}” — to NIE jest palindrom. Koniec.`, hud: [['Porównania', st.comparisons]]}));
  if (tr.ok) frames.push({rows: rows(-1, -1, false, null, tr.steps.length), say: `Wskaźniki się spotkały — wszystkie pary równe. To palindrom! Porównań: ${tr.comparisons}.`, hud: [['Porównania', tr.comparisons]]});
  return frames;
}

export function anagramFrames(a, b) {
  const an = anagramCheck(a, b);
  const sortedRow = (S, label, cur, upto, eq) => ({label, cells: S.map((c, i) => ({ch: c, idx: i, mark: i < upto ? 'eq' : i === cur ? (eq ? 'eq' : 'ne') : '', tag: i === cur ? '▼' : ''}))});
  const plain = (S, label) => ({label, cells: chars(S).map((c, i) => ({ch: c, idx: i, mark: 'dim'}))});
  const frames = [{rows: [plain(a, a), plain(b, b)], say: `Czy „${a}” i „${b}” to anagramy? Krok 1: małe litery i ułożenie liter alfabetycznie — jak karty.`, hud: [['Porównania', 0]]}];
  frames.push({rows: [sortedRow(an.a, 'posortowane 1', -1, 0), sortedRow(an.b, 'posortowane 2', -1, 0)], say: `Po posortowaniu: „${an.a.join('')}” i „${an.b.join('')}”. Krok 2: porównuję je znak po znaku.`, hud: [['Porównania', 0]]});
  an.cmp.steps.forEach(st => frames.push({rows: [sortedRow(an.a, 'posortowane 1', st.i, st.i, st.eq), sortedRow(an.b, 'posortowane 2', st.i, st.i, st.eq)], say: st.eq ? `„${st.ca}” = „${st.cb}”.` : `„${st.ca}” ≠ „${st.cb}” — inne litery, to nie są anagramy.`, hud: [['Porównania', st.comparisons]]}));
  frames.push({rows: frames[frames.length - 1].rows, say: an.ok ? 'Te same litery w tej samej liczbie — to anagramy!' : an.a.length !== an.b.length && an.cmp.reason !== 'diff' ? 'Różna liczba liter — to nie są anagramy.' : 'Zestawy liter się różnią — to nie są anagramy.', hud: [['Porównania', an.cmp.comparisons]]});
  return frames;
}

/* ───────── punktacja: 2 pkt za pierwszą próbę, 1 pkt po poprawce ───────── */
export const taskPoints = (solvedAt, full = 2) => (!solvedAt ? 0 : solvedAt === 1 ? full : full / 2);
export function attempt(prev = {}, ok, pick) {
  if (prev.solved) return prev;
  const tries = (prev.tries || 0) + 1;
  return {...prev, tries, pick, solved: ok, solvedAt: ok ? tries : undefined, last: ok ? 'ok' : 'bad'};
}
const normNum = s => String(s ?? '').trim().replace(/\s+/g, '').replace(',', '.');
export function checkAnswer(q, answer) {
  if (q.options) return Number(answer) === q.correct;
  return normNum(answer) !== '' && normNum(answer) === normNum(q.answer);
}
/** Punkty za samodzielne przejście algorytmu: pełne bez błędów, −0,5 za każdy błąd, najmniej połowa. */
export const runScore = (points, errors = 0) => Math.max(points / 2, points - 0.5 * errors);

/* ───────── TREŚĆ: porównywanie (lista kontaktów) ───────── */
export const COMPARE_DEMO = ['Kasia', 'Kamil'];
const pair = (id, a, b, tip) => {
  const tr = compareTrace(a, b);
  return {id, a, b, prompt: `„${a}” czy „${b}” — kto będzie wyżej na liście posortowanej przez komputer (porównanie kodów znaków, jak w Pythonie)?`, options: [a, b], correct: tr.result <= 0 ? 0 : 1, explain: compareVerdict(a, b), tip};
};
export const COMPARE_QUESTIONS = [
  pair('c-ali', 'Alicja', 'Ala', 'Porównuj od lewej: A = A, l = l, a kontra i. Która litera jest wcześniej w alfabecie?'),
  pair('c-ola', 'Olaf', 'Ola', 'Pierwsze trzy znaki są równe. Co się dzieje, gdy jeden z tekstów się skończy?'),
  pair('c-case', 'adam', 'Zosia', 'Komputer nie patrzy na alfabet, tylko na kody: wielkie litery A–Z mają kody 65–90, małe a–z — 97–122.'),
  pair('c-pl', 'Łukasz', 'Marek', 'Polskie litery nie leżą w tabeli kodów między L i M. „Ł” ma kod 321, a „M” — 77.'),
];
export const CONTACTS = ['Marek', 'Łukasz', 'adam', 'Zosia', 'Ela', 'Ola', 'Lena'];
export const CONTACTS_QUESTION = {
  id: 'c-fix', prompt: 'Program posortował kontakty kodami znaków (lewa kolumna). „adam” i „Łukasz” wylądowali na końcu. Jak to naprawić?',
  options: ['Porównywać litery według polskiego alfabetu i bez względu na wielkość liter — tak robi telefon', 'Zamienić wszystkie litery na wielkie — to w zupełności wystarczy', 'Usunąć z listy kontakty z polskimi znakami', 'Sortować listę od końca'],
  correct: 0,
  explain: 'Telefon porównuje według reguł języka (tzw. collation): „a” = „A”, a „Ł” stoi między „L” i „M”. Same wielkie litery nie wystarczą — „Ł” (kod 321) nadal byłoby za „Z” (90).',
  tip: 'Sprawdź obie przyczyny: wielkość liter (adam) i polską literę (Łukasz). Która odpowiedź naprawia obie?',
};
export const compareQuestions = [...COMPARE_QUESTIONS, CONTACTS_QUESTION];

/* ───────── TREŚĆ: detektyw tekstów (zliczanie, palindrom, anagram) ───────── */
export const COUNT_TEXT = 'Ala ma kota, a kot ma Alę.';
export const DETECTIVE = [
  {id: 'd-count', group: 'Zliczanie znaku', kind: 'count', text: COUNT_TEXT, ch: 'a', ignoreCase: false,
    prompt: 'Algorytm porównuje każdy znak z małym „a” i zwiększa licznik przy trafieniu. Ile wyjdzie?', answer: String(countTrace(COUNT_TEXT, 'a').count), inputLabel: 'Licznik',
    explain: `Wielkie „A” to inny znak niż „a” (kod 65 zamiast 97) — nie liczy się. Wynik: ${countTrace(COUNT_TEXT, 'a').count}.`, tip: 'Policz tylko małe „a”. Wielkie „A” ma inny kod, więc się nie liczy.'},
  {id: 'd-count-ci', group: 'Zliczanie znaku', kind: 'count', text: COUNT_TEXT, ch: 'a', ignoreCase: true,
    prompt: 'A jeśli przed porównaniem każdy znak zamienimy na małą literę (tak liczy wyszukiwarka)?', answer: String(countTrace(COUNT_TEXT, 'a', true).count), inputLabel: 'Licznik',
    explain: `Teraz „A” też pasuje: ${countTrace(COUNT_TEXT, 'a').count} małych + 2 wielkie = ${countTrace(COUNT_TEXT, 'a', true).count}. „ę” to osobna litera — nie liczy się jako „a”.`, tip: 'Dodaj do poprzedniego wyniku wielkie „A”. Czy „ę” jest literą „a”?'},
  {id: 'd-kajak', group: 'Palindrom', kind: 'pal', text: 'kajak', normalize: false,
    prompt: 'Słowo „kajak”. Wskaźnik L idzie od lewej, P od prawej. Ile par liter porówna algorytm, zanim odpowie „palindrom”?', answer: String(palindromeTrace('kajak').comparisons), inputLabel: 'Liczba porównań',
    explain: 'k = k, a = a, a środkowe „j” zostaje samo — nie ma z czym go porównać. 2 porównania.', tip: 'Pary to (k, k), (a, a)… Czy środkowa litera potrzebuje pary?'},
  {id: 'd-raw', group: 'Palindrom', kind: 'pal', text: 'Kobyła ma mały bok', normalize: false,
    prompt: '„Kobyła ma mały bok”. Algorytm porównuje znaki dokładnie: wielkość liter i spacje się liczą. Co odpowie?', options: ['To palindrom', 'To nie palindrom'], correct: palindromeTrace('Kobyła ma mały bok').ok ? 0 : 1,
    explain: 'Już pierwsza para: „K” ≠ „k” (kody 75 i 107). Komputer nie wie, że dla człowieka to ta sama litera.', tip: 'Porównaj pierwszy i ostatni znak dokładnie, z wielkością liter.'},
  {id: 'd-norm', group: 'Palindrom', kind: 'pal', text: 'Kobyła ma mały bok', normalize: true,
    prompt: 'Teraz najpierw przygotowanie: małe litery, bez spacji → „kobyłamamałybok” (15 znaków). Ile par porówna algorytm?', answer: String(palindromeTrace('Kobyła ma mały bok', true).comparisons), inputLabel: 'Liczba porównań',
    explain: `15 znaków: 7 par i środkowe „m” bez pary. Wszystkie pary równe — to palindrom. Porównań: ${palindromeTrace('Kobyła ma mały bok', true).comparisons}.`, tip: 'Przy 15 znakach jeden zostaje w środku. Ile par zostaje z pozostałych 14?'},
  {id: 'd-klasa', group: 'Anagram', kind: 'anagram', a: 'Klasa', b: 'skala',
    prompt: '„Klasa” i „skala”: zamieniamy na małe litery i układamy litery alfabetycznie. Czy to anagramy?', options: ['Tak', 'Nie'], correct: anagramCheck('Klasa', 'skala').ok ? 0 : 1,
    explain: `Po posortowaniu oba słowa to „${anagramCheck('Klasa', 'skala').a.join('')}” — te same litery w tej samej liczbie, więc anagramy.`, tip: 'Ułóż litery obu słów od a do z, jak karty w ręce, i porównaj.'},
  {id: 'd-kotek', group: 'Anagram', kind: 'anagram', a: 'kotek', b: 'kotka',
    prompt: '„kotek” i „kotka” mają po 5 liter i prawie te same. Czy to anagramy?', options: ['Tak', 'Nie'], correct: anagramCheck('kotek', 'kotka').ok ? 0 : 1,
    explain: `Posortowane: „${anagramCheck('kotek', 'kotka').a.join('')}” i „${anagramCheck('kotek', 'kotka').b.join('')}”. Już pierwsza litera się różni (a kontra e) — to nie są anagramy. Ta sama długość nie wystarcza.`, tip: 'Ułóż litery alfabetycznie. Czy w obu słowach jest „e”?'},
];
export function detectiveFrames(p) {
  if (p.kind === 'count') return countFrames(p.text, p.ch, p.ignoreCase);
  if (p.kind === 'pal') return palindromeFrames(p.text, p.normalize);
  return anagramFrames(p.a, p.b);
}

/* ───────── TREŚĆ: wyszukiwanie wzorca ───────── */
export const PATTERN_DEMO = {text: 'idę na mecz', pattern: 'mecz', context: 'Wyszukiwarka SMS-ów: szukasz wiadomości o meczu.'};
export const PATTERN_RUNS = [
  {id: 'run-ok', text: 'ok, jutro ok?', pattern: 'ok', points: 4, title: 'Runda 1: Ctrl+F „ok” w wiadomości', context: 'Komunikator podświetla każde „ok” w wiadomości. Ty jesteś algorytmem: przy każdym porównaniu wybierz, co robisz dalej.'},
  {id: 'run-haha', text: 'hahaha', pattern: 'haha', points: 4, title: 'Runda 2: „haha” w „hahaha”', context: 'Filtr reakcji liczy, ile razy w wiadomości jest „haha”. Uważaj — wystąpienia mogą na siebie zachodzić.', requires: 'run-ok'},
];
export const PATTERN_QUESTIONS = [
  {id: 'p-windows', prompt: 'Tekst ma 10 znaków, wzorzec — 3. Ile okien (pozycji startowych wzorca) sprawdzi algorytm naiwny?', options: ['3', '7', '8', '10'], correct: 2,
    explain: `Okna zaczynają się na pozycjach 0, 1, …, 7 — to 10 − 3 + 1 = ${windowsCount(10, 3)}. Okno na pozycji 8 nie zmieściłoby wzorca.`, tip: 'Ostatnie okno musi się zmieścić w tekście: wzorzec 3-znakowy kończy się na pozycji 9. Gdzie się zaczyna?'},
  {id: 'p-cost', prompt: 'Regulamin sklepu ma 20 000 znaków. Szukasz słowa „zwrot” (5 liter). Ile porównań wykona algorytm naiwny w najgorszym razie?', options: ['około 20 000', 'około 100 000', 'około 400 000 000', 'dokładnie 5'], correct: 1,
    explain: `Okien jest 20 000 − 5 + 1 = ${windowsCount(20000, 5).toLocaleString('pl-PL')}, w każdym najwyżej 5 porównań: ${(windowsCount(20000, 5) * 5).toLocaleString('pl-PL')} ≈ 100 000. Dla komputera to ułamek sekundy.`, tip: 'Policz: liczba okien × długość wzorca.'},
  {id: 'p-real', prompt: 'W prawdziwym tekście algorytm naiwny zwykle robi znacznie mniej porównań niż w najgorszym razie. Dlaczego?', options: ['Bo w większości okien różnica wychodzi już na pierwszym znaku i od razu przesuwa wzorzec', 'Bo komputer pomija co drugie okno', 'Bo porównuje tylko pierwsze litery słów', 'Bo zapamiętuje cały tekst na pamięć'], correct: 0,
    explain: 'W rundzie 1 większość okien odpadła po jednym porównaniu. Najgorszy przypadek to teksty typu „aaaaaaab” — tam prawie każde okno pasuje do końca.', tip: 'Przypomnij sobie rundę 1: ile porównań miała większość okien?'},
];

/* ───────── wyniki trybów ───────── */
const qPoints = (qs, state = {}) => qs.reduce((s, q) => s + taskPoints(state[q.id]?.solvedAt), 0);
const allSolved = (qs, state = {}) => qs.every(q => state[q.id]?.solved);
export const COMPARE_MAX = compareQuestions.length * 2;
export function compareResult(v = {}) {
  const q = v?.q || {};
  const score = qPoints(compareQuestions, q), done = allSolved(compareQuestions, q);
  return {score, max: COMPARE_MAX, done, summary: done ? `Porównywanie tekstów: ${score}/${COMPARE_MAX} pkt` : undefined};
}
export const DETECTIVE_MAX = DETECTIVE.length * 2;
export function detectiveResult(v = {}) {
  const q = v?.q || {};
  const score = qPoints(DETECTIVE, q), solved = DETECTIVE.filter(p => q[p.id]?.solved).length, done = solved === DETECTIVE.length;
  return {score, max: DETECTIVE_MAX, done, summary: done ? `Detektyw tekstów: ${solved}/${DETECTIVE.length} zagadek` : undefined};
}
export const PATTERN_MAX = PATTERN_RUNS.reduce((s, r) => s + r.points, 0) + PATTERN_QUESTIONS.length * 2;
export function runResult(run, st = {}) { return st?.done ? runScore(run.points, st.errors || 0) : 0; }
export function patternResult(v = {}) {
  const runs = v?.runs || {}, q = v?.q || {};
  const score = PATTERN_RUNS.reduce((s, r) => s + runResult(r, runs[r.id]), 0) + qPoints(PATTERN_QUESTIONS, q);
  const done = PATTERN_RUNS.every(r => runs[r.id]?.done) && allSolved(PATTERN_QUESTIONS, q);
  const errors = PATTERN_RUNS.reduce((s, r) => s + (runs[r.id]?.errors || 0), 0);
  return {score, max: PATTERN_MAX, done, summary: done ? `Algorytm naiwny przejęty: ${PATTERN_RUNS.length} rundy, błędnych kroków: ${errors}` : undefined};
}
/** Stan rundy po kliknięciu akcji: {k (numer kroku), errors, done, last:{ok, text}}. */
export function runStep(run, st = {}, action) {
  const tr = patternTrace(run.text, run.pattern);
  const k = st.k || 0;
  if (st.done || k >= tr.steps.length) return st;
  const step = tr.steps[k];
  const label = ACTIONS.find(a => a.id === step.action).label;
  if (action !== step.action) {
    const why = step.eq ? (step.action === 'found' ? `„${show(step.ct)}” = „${show(step.cp)}” i to ostatni znak wzorca — cały wzorzec pasuje.` : `„${show(step.ct)}” = „${show(step.cp)}”, ale to jeszcze nie koniec wzorca.`) : `„${show(step.ct)}” ≠ „${show(step.cp)}”.`;
    return {...st, k, errors: (st.errors || 0) + 1, last: {ok: false, text: `Nie tym razem: ${why} Właściwy ruch: „${label}”.`}};
  }
  const next = k + 1, done = next >= tr.steps.length;
  const text = step.action === 'found' ? `Trafienie na pozycji ${step.s}!` : step.action === 'shift' ? 'Dobrze — przesuwasz wzorzec.' : 'Dobrze — porównujesz następny znak.';
  return {...st, k: next, errors: st.errors || 0, done, last: {ok: true, text: done ? `${text} Kolejne okno nie mieści się w tekście — koniec. Porównań: ${tr.comparisons}, trafienia: ${tr.found.join(', ')}.` : text}};
}
export const modeMax = mode => ({compare: COMPARE_MAX, detective: DETECTIVE_MAX, pattern: PATTERN_MAX})[mode];
export function textLabResult(mode, v) { return mode === 'compare' ? compareResult(v) : mode === 'detective' ? detectiveResult(v) : patternResult(v); }
