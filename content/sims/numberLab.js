// Logika symulatora „numberLab” (lekcje 47 i 49 klasy 2: algorytmy na liczbach i ułamki — bez kodu).
// Czysty JS, bez Reacta i DOM. Testy: node --test tests/sims-g2-numbers.test.mjs
// Uczeń przewiduje KAŻDY następny krok algorytmu; symulator liczy kroki, sprawdza odpowiedź
// i podpowiada, co poprawić. Odpowiedzi wzorcowe są liczone przez funkcje poniżej, nie wpisane ręcznie.

/* ───────────── Algorytmy ───────────── */
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a, b) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);

/** Euklides z odejmowaniem (a, b > 0): dopóki a ≠ b, od większej odejmij mniejszą. */
export function gcdSubSteps(a, b) {
  const steps = [];
  while (a !== b) {
    if (a > b) { steps.push({a, b, big: a, small: b, result: a - b}); a -= b; }
    else { steps.push({a, b, big: b, small: a, result: b - a}); b -= a; }
  }
  return {gcd: a, steps};
}
/** Szybkie liczenie odejmowań (także dla 1 000 000 i 3) — ten sam wynik co gcdSubSteps(a, b).steps.length. */
export function gcdSubCount(a, b) {
  if (!(a > 0 && b > 0)) return null;
  let n = 0;
  while (a !== b) {
    if (a < b) [a, b] = [b, a];
    const q = Math.floor(a / b), r = a % b;
    if (r === 0) { n += q - 1; a = b; } else { n += q; a = r; }
  }
  return n;
}
/** Euklides z resztą: dopóki b ≠ 0: (a, b) → (b, a mod b). */
export function gcdModSteps(a, b) {
  const steps = [];
  while (b !== 0) { steps.push({a, b, q: Math.floor(a / b), r: a % b}); [a, b] = [b, a % b]; }
  return {gcd: a, steps};
}
export const smallestDivisor = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
export const isPrime = n => Number.isInteger(n) && n >= 2 && smallestDivisor(n) === n;
/** Sprawdzanie pierwszości: kandydaci d = 2, 3, … dopóki d · d ≤ n; stop na pierwszym dzielniku. */
export function primeSteps(n) {
  const steps = [];
  for (let d = 2; d * d <= n; d++) { steps.push({d, rem: n % d, divides: n % d === 0}); if (n % d === 0) break; }
  const last = steps.at(-1);
  return {steps, prime: n >= 2 && !(last && last.divides), divisor: last?.divides ? last.d : null};
}
/** Rozkład na czynniki pierwsze „słupkiem”: zawsze najmniejszy dzielnik. */
export function factorSteps(n) {
  const steps = [];
  while (n > 1) { const p = smallestDivisor(n); steps.push({n, p}); n /= p; }
  return steps;
}
const SUP = {0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹'};
export const sup = k => String(k).split('').map(c => SUP[c]).join('');
export function factorString(n) {
  const counts = new Map();
  for (const {p} of factorSteps(n)) counts.set(p, (counts.get(p) || 0) + 1);
  return [...counts].map(([p, k]) => (k > 1 ? `${p}${sup(k)}` : `${p}`)).join(' · ');
}

/** Geometria Euklidesa na prostokącie: kwadraty odcinane w kolejnych krokach algorytmu. */
export function rectCuts(a, b, method) {
  let x = 0, y = 0, w = a, h = b;
  const groups = [];
  const cut = () => { if (w >= h) { const sq = {x, y, s: h}; x += h; w -= h; return sq; } const sq = {x, y, s: w}; y += w; h -= w; return sq; };
  if (method === 'sub') {
    for (let k = gcdSubSteps(a, b).steps.length; k > 0; k--) groups.push({squares: [cut()], rest: {x, y, w, h}});
  } else {
    for (const st of gcdModSteps(Math.max(a, b), Math.min(a, b)).steps) {
      const squares = [];
      for (let q = 0; q < st.q; q++) squares.push(cut());
      groups.push({squares, rest: {x, y, w, h}});
    }
  }
  return groups;
}

/* ───────────── Ułamki: para [licznik, mianownik] ───────────── */
export function simplify(l, m) {
  if (m === 0) return null;
  if (m < 0) { l = -l; m = -m; }
  const g = gcd(l, m) || 1;
  return [l / g, m / g];
}
export const addF = ([a, b], [c, d]) => { const m = lcm(b, d); return simplify(a * (m / b) + c * (m / d), m); };
export const subF = ([a, b], [c, d]) => addF([a, b], [-c, d]);
export const mulF = ([a, b], [c, d]) => simplify(a * c, b * d);
export const sameF = (x, y) => !!x && !!y && x[0] * y[1] === y[0] * x[1];
export const fracText = ([l, m]) => (m === 1 ? `${l}` : `${l}/${m}`);

/* ───────────── Sprawdzanie odpowiedzi ───────────── */
export function parseNum(s) {
  const t = String(s ?? '').trim().replace(/\s+/g, '').replace(',', '.').replace(/(cm|ml|min|zł|dni|dnia|l)$/i, '');
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  return Number(t);
}
/**
 * input: num → tekst; choice/yesno → indeks; frac → [licznik, mianownik] (teksty).
 * Zwraca {ok, invalid?, near?, text}. invalid i near nie liczą się jako błąd.
 */
export function checkStep(step, input) {
  if (step.kind === 'num') {
    const v = parseNum(input);
    if (v === null) return {ok: false, invalid: true, text: 'Wpisz samą liczbę (cyframi).'};
    if (v === step.answer) return {ok: true, text: step.after || 'Dobrze.'};
    const custom = step.wrong?.(v);
    return {ok: false, text: custom || step.hint};
  }
  if (step.kind === 'choice' || step.kind === 'yesno') {
    const i = Number(input);
    if (!Number.isInteger(i) || i < 0 || i >= step.options.length) return {ok: false, invalid: true, text: 'Wybierz odpowiedź.'};
    if (i === step.answer) return {ok: true, text: step.after || 'Dobrze.'};
    return {ok: false, text: step.wrongText?.[i] || step.hint};
  }
  if (step.kind === 'frac') {
    const l = parseNum(input?.[0]), m = parseNum(input?.[1]);
    if (l === null || m === null) return {ok: false, invalid: true, text: 'Wpisz licznik i mianownik (liczby całkowite).'};
    if (m === 0) return {ok: false, text: 'Mianownik nie może być zerem — nie da się podzielić całości na 0 części.'};
    const [al, am] = step.answer;
    if (l === al && m === am) return {ok: true, text: step.after || 'Dobrze.'};
    if (sameF([l, m], step.answer)) {
      if (step.reduced === false) return {ok: true, text: step.after || 'Dobrze.'};
      return {ok: false, near: true, text: `Wartość się zgadza, ale ułamek nie jest skrócony. NWD(${Math.abs(l)}, ${Math.abs(m)}) = ${gcd(l, m)} — podziel przez nie licznik i mianownik.`};
    }
    const custom = step.wrong?.([l, m]);
    return {ok: false, text: custom || step.hint, frac: [l, m]};
  }
  return {ok: false, invalid: true, text: 'Nieznany typ kroku.'};
}

/* ───────────── Kroki zadań ───────────── */
const num = (prompt, answer, hint, extra = {}) => ({kind: 'num', prompt, answer, hint, ...extra});
const pick = (prompt, options, answer, hint, extra = {}) => ({kind: 'choice', prompt, options, answer, hint, ...extra});
const yesno = (prompt, yes, hint, extra = {}) => ({kind: 'yesno', prompt, options: ['Tak, dzieli', 'Nie dzieli'], answer: yes ? 0 : 1, hint, ...extra});
const frac = (prompt, answer, hint, extra = {}) => ({kind: 'frac', prompt, answer, hint, ...extra});
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function divHint(n, d) {
  if (d === 2) return `Liczba dzieli się przez 2, gdy jest parzysta (ostatnia cyfra 0, 2, 4, 6, 8). ${n} kończy się na ${n % 10}.`;
  if (d === 3) return `Przez 3 dzieli się liczba, której suma cyfr dzieli się przez 3. Suma cyfr ${n}: ${String(n).split('').join(' + ')} = ${String(n).split('').reduce((s, c) => s + Number(c), 0)}.`;
  if (d === 5) return `Przez 5 dzielą się liczby zakończone na 0 lub 5. ${n} kończy się na ${n % 10}.`;
  if (d === 4 || d === 6 || d === 8) return `${d} jest parzysta. Skoro 2 nie dzieli ${n}, to ${d} też nie może.`;
  if (d === 9) return `Skoro 3 nie dzieli ${n}, to 9 (= 3 · 3) też nie.`;
  return `Podziel pisemnie albo na kalkulatorze: ${n} : ${d} = ? Czy wychodzi bez reszty?`;
}

function primeTask(id, n, {title, story, points = 2, extra = []}) {
  const {steps, prime, divisor} = primeSteps(n);
  const s = steps.map(({d, rem, divides}) => yesno(`Czy ${d} dzieli ${n} bez reszty?`, divides, divHint(n, d), {
    algo: true, after: divides ? `Tak: ${n} : ${d} = ${n / d}, reszta 0. Mamy dzielnik — dalej nie trzeba sprawdzać.` : `Nie: ${n} : ${d} = ${Math.floor(n / d)} reszta ${rem}.`}));
  if (divisor) s.push(num(`${n} = ${divisor} · ?`, n / divisor, `Podziel ${n} przez ${divisor}.`));
  s.push(...extra);
  s.push(pick(`Liczba ${n} jest…`, ['pierwsza — ma tylko dwa dzielniki: 1 i samą siebie', `złożona — ma dzielnik inny niż 1 i ${n}`], prime ? 0 : 1,
    prime ? `Żaden kandydat do ${steps.at(-1).d} nie podzielił ${n}.` : `Znalazłeś dzielnik ${divisor}, więc ${n} nie jest pierwsza.`,
    {after: prime ? `${n} jest pierwsza. Sprawdziłeś ${steps.length} dzielników zamiast ${n - 2}.` : `${n} = ${divisor} · ${n / divisor} — złożona, choć „wygląda” na pierwszą.`}));
  return {id, title, story, points, visual: {kind: 'divisors', n, steps}, steps: s};
}

function factorTask(id, n, {title, story, points = 2, final}) {
  const fs = factorSteps(n);
  const s = fs.map(({n: m, p}) => num(`Najmniejszy dzielnik liczby ${fmt(m)} (większy od 1)?`, p, `Sprawdzaj po kolei: 2, 3, 5, 7, 11, 13… Pierwsza liczba, przez którą ${fmt(m)} dzieli się bez reszty, to szukany dzielnik.`, {
    algo: true, after: `${fmt(m)} : ${p} = ${fmt(m / p)}${m / p === 1 ? ' — koniec, doszliśmy do 1.' : ''}`,
    wrong: x => {
      if (!Number.isInteger(x) || x < 2) return 'Dzielnik w rozkładzie musi być liczbą całkowitą większą od 1.';
      if (m % x !== 0) return `${fmt(m)} : ${x} = ${fmt(Math.floor(m / x))} reszta ${m % x} — ${x} nie dzieli ${fmt(m)}. ${x === 2 || x === 3 || x === 5 ? divHint(m, x) : ''}`;
      if (x > p) return `${x} dzieli ${fmt(m)}, ale jest mniejszy dzielnik. ${isPrime(x) ? '' : `Poza tym ${x} nie jest pierwsza — rozłożyłbyś ją jeszcze raz. `}Zacznij od 2, potem 3, 5, 7…`;
      return null;
    }}));
  s.push(final || pick(`Zapis rozkładu: ${fmt(n)} = …`, [factorString(n), fs.map(x => x.p).join(' + '), fs.map(x => x.n).slice(0, 3).join(' · ')], 0, 'Rozkład to iloczyn (mnożenie) liczb z prawej kolumny. Te same czynniki zapisujesz potęgą.', {after: `${fmt(n)} = ${factorString(n)}.`}));
  return {id, title, story, points, visual: {kind: 'factor', n, steps: fs}, steps: s};
}

function euclidTask(id, a, b, method, {title, story, points = 2, tiles = true, guided = true}) {
  const s = [];
  let g;
  if (method === 'sub') {
    const r = gcdSubSteps(a, b); g = r.gcd;
    r.steps.forEach(st => s.push(num(guided ? `Odcinasz kwadrat ${st.small} × ${st.small}. Ile zostaje z dłuższego boku? ${st.big} − ${st.small} = ?` : `${st.big} − ${st.small} = ?`, st.result,
      `Od dłuższego boku (${st.big}) odejmij krótszy (${st.small}).`, {algo: true, unit: 'cm', after: `Zostaje prostokąt ${Math.max(st.result, st.small)} × ${Math.min(st.result, st.small)}.`,
        wrong: x => (x === st.big + st.small ? 'To dodawanie — odcinamy kwadrat, więc odejmujemy.' : null)})));
  } else {
    const r = gcdModSteps(a, b); g = r.gcd;
    r.steps.forEach(st => s.push(num(`${st.a} : ${st.b} = ${st.q} reszta ?`, st.r,
      `${st.q} · ${st.b} = ${st.q * st.b}. Reszta to ${st.a} − ${st.q * st.b}.`, {algo: true, unit: 'cm', after: st.r === 0 ? 'Reszta 0 — prostokąt rozpadł się na same kwadraty. Koniec.' : `Odcinasz naraz ${st.q} ${st.q === 1 ? 'kwadrat' : st.q < 5 ? 'kwadraty' : 'kwadratów'} ${st.b} × ${st.b}. Zostaje ${st.b} × ${st.r}.`,
        wrong: x => (x === st.q ? `${st.q} to iloraz (ile razy ${st.b} mieści się w ${st.a}). Pytamy o resztę: ${st.a} − ${st.q} · ${st.b}.` : null)})));
  }
  s.push(num(`NWD(${a}, ${b}) = ?`, g, method === 'sub' ? 'Został kwadrat — jego bok to NWD.' : 'NWD to ostatni dzielnik, przy którym reszta wyszła 0.', {unit: 'cm', after: `NWD(${a}, ${b}) = ${g}. To bok największej płytki bez docinania.`}));
  if (tiles) s.push(num(`Ile płytek ${g} × ${g} cm pokryje całe ${a} × ${b} cm?`, (a / g) * (b / g), `W rzędzie: ${a} : ${g} = ${a / g} płytek. Rzędów: ${b} : ${g} = ${b / g}. Pomnóż.`, {after: `${a / g} · ${b / g} = ${(a / g) * (b / g)} płytek, zero docinania.`}));
  return {id, title, story, points, visual: {kind: 'rect', a, b, method}, steps: s, method};
}

function lcmTask(id, a, b, {title, story, points = 2, unit = 'min', timeline = true, extra = []}) {
  const g = gcd(a, b), l = lcm(a, b);
  const s = [];
  if (timeline) s.push(num(`Pierwszy wspólny czas na liście wielokrotności (pomijamy 0)?`, l, `Szukaj liczby, która jest w obu wierszach. Nie musi to być ${a} · ${b} = ${a * b}.`, {algo: true, unit,
    after: `${l} jest w obu wierszach — to NWW(${a}, ${b}).`, wrong: x => (x === a * b ? `${a * b} też jest wspólna, ale nie pierwsza. Szukaj wcześniej.` : x % a || x % b ? `${x} nie jest w ${x % a ? 'pierwszym' : 'drugim'} wierszu.` : null)}));
  s.push(num(`NWD(${a}, ${b}) = ?`, g, `Największa liczba, która dzieli i ${a}, i ${b}. Możesz użyć Euklidesa: ${Math.max(a, b)} : ${Math.min(a, b)} daje resztę ${Math.max(a, b) % Math.min(a, b)}.`, {after: `NWD = ${g}.`}));
  s.push(num(`NWW = ${a} · ${b} : NWD = ${a * b} : ${g} = ?`, l, `Podziel ${a * b} przez ${g}.`, {algo: !timeline, unit, after: `NWW(${a}, ${b}) = ${l}. Wzór: NWW = a · b : NWD(a, b).`}));
  s.push(...extra);
  return {id, title, story, points, visual: {kind: 'timeline', a, b, limit: Math.min(Math.max(l * 2, 4 * Math.max(a, b)), 100 * Math.max(a, b)), unit}, steps: s};
}

/* ───────────── Zadania w trybach ───────────── */
const RACE_PAIRS = [[240, 180], [100, 7], [1000000, 3]];
export const raceRow = (a, b) => ({a, b, gcd: gcd(a, b), sub: gcdSubCount(a, b), mod: gcdModSteps(a, b).steps.length});
const opts4 = (right, ...wrong) => [String(right), ...wrong.map(String)];

export const MODES = {
  prime: {
    title: 'Pierwsza czy złożona?', icon: 'hash',
    tasks: [
      primeTask('p91', 91, {title: '91 — podejrzanie „pierwsza”',
        story: 'Kod do szafki w szatni ma być liczbą pierwszą. Kolega proponuje 91. Sprawdź kandydatów na dzielnik po kolei: 2, 3, 4… Przewiduj przed kliknięciem.'}),
      {id: 'pairs', title: 'Dzielniki chodzą parami', points: 2,
        story: 'Dzielniki liczby 36 łączą się w pary, których iloczyn to 36. Popatrz na pary i zdecyduj, kiedy wolno przestać sprawdzać.',
        visual: {kind: 'pairs', n: 36},
        steps: [
          num('Do jakiej liczby wystarczy sprawdzać dzielniki 36, żeby znaleźć każdą parę?', 6, 'Spójrz na pary: mniejsza liczba z pary nigdy nie przekracza pewnej wartości. Ile to 6 · 6?', {after: '6 · 6 = 36. Mniejszy dzielnik z pary jest zawsze ≤ 6, więc większych kandydatów nie trzeba sprawdzać. Ogólnie: sprawdzamy d, dopóki d · d ≤ n.'}),
          pick('Czy 1 jest liczbą pierwszą?', ['Nie — ma tylko jeden dzielnik, a liczba pierwsza ma dokładnie dwa', 'Tak — dzieli się tylko przez 1 i przez siebie', 'Tak — jest najmniejszą liczbą'], 0, 'Policz dzielniki liczby 1. Liczba pierwsza ma dokładnie dwa różne dzielniki.', {after: '1 ma jeden dzielnik. Pierwsze są 2, 3, 5, 7, 11, 13…'}),
          pick('Ile jest parzystych liczb pierwszych?', ['Jedna: 2', 'Żadnej', 'Nieskończenie wiele'], 0, 'Każda parzysta liczba dzieli się przez 2. Która nie ma innych dzielników?', {after: '2 to jedyna parzysta liczba pierwsza — każda większa parzysta dzieli się przez 2.'})
        ]},
      primeTask('p97', 97, {title: '97 — sprawdź do pierwiastka',
        story: 'Nowy kandydat na kod: 97. Sprawdzaj dzielniki, dopóki d · d ≤ 97. Symulator liczy kroki.',
        extra: [pick('Czy trzeba jeszcze sprawdzić 10?', ['Nie: 10 · 10 = 100 > 97, większy dzielnik musiałby mieć parę mniejszą od 10 — a takich już nie ma', 'Tak, trzeba sprawdzić wszystko do 96', 'Tak, do połowy: do 48'], 0, 'Przypomnij sobie pary dzielników 36.', {after: 'Wystarczyło 8 sprawdzeń zamiast 95.'})]})
    ],
    summary: () => '91 = 7 · 13 (złożona), 97 — pierwsza, sprawdzona w 8 krokach'
  },
  factor: {
    title: 'Rozkład na czynniki', icon: 'hash',
    tasks: [
      factorTask('f360', 360, {title: '360 — słupek', story: 'Dziel zawsze przez najmniejszy możliwy dzielnik i zapisuj wynik pod spodem. Kończysz, gdy dojdziesz do 1.'}),
      factorTask('f1001', 1001, {title: '1001 — trudniejszy start', story: '1001 nie dzieli się ani przez 2, ani przez 3, ani przez 5. Ciekawostka: abc · 1001 = abcabc (np. 123 · 1001 = 123123).'}),
      factorTask('f221', 221, {title: '221 — klucz szyfru', story: 'Szyfry (np. w bankowości) opierają się na tym, że łatwo pomnożyć dwie liczby pierwsze, a trudno odgadnąć je z iloczynu. Tu iloczyn jest mały: złam „klucz” 221.',
        final: pick('Dlaczego prawdziwe klucze używają liczb pierwszych mających setki cyfr?', ['Bo pomnożenie ich jest szybkie, a znalezienie czynników z iloczynu trwałoby lata', 'Bo duże liczby lepiej wyglądają', 'Bo komputer nie umie mnożyć dużych liczb'], 0, 'Ile prób potrzebowałeś dla 221? A gdyby liczba miała 600 cyfr?', {after: '221 = 13 · 17. Dla 600 cyfr prób byłoby więcej niż atomów we Wszechświecie.'})})
    ],
    summary: () => '360 = 2³ · 3² · 5 · 1001 = 7 · 11 · 13 · 221 = 13 · 17'
  },
  euclid: {
    title: 'Euklides na płytkach', icon: 'table',
    tasks: [
      euclidTask('e-sub', 240, 180, 'sub', {title: 'Łazienka 240 × 180: odejmowanie', story: 'Ściana 240 × 180 cm. Szukasz największej kwadratowej płytki bez docinania. Odcinaj od prostokąta największy kwadrat, aż zostanie sam kwadrat.'}),
      euclidTask('e-mod', 240, 180, 'mod', {title: 'Ta sama ściana: reszta z dzielenia', story: 'Zamiast odcinać kwadraty po jednym, odcinasz od razu tyle, ile się zmieści. Ile zostaje? To reszta z dzielenia (modulo).', tiles: false}),
      euclidTask('e-new', 84, 36, 'mod', {title: 'Blat 84 × 36: samodzielnie', story: 'Ścianka nad blatem kuchennym ma 84 × 36 cm. Ta sama metoda z resztą — tym razem bez prowadzenia za rękę.'}),
      {id: 'race', title: 'Wyścig: odejmowanie kontra reszta', points: 2,
        story: 'Ten sam NWD, dwie wersje algorytmu. Licznik pokazuje, ile kroków zrobi każda. Kliknij gotowe pary albo wpisz własne liczby.',
        visual: {kind: 'race', pairs: RACE_PAIRS},
        steps: [
          pick('Ile odejmowań potrzebuje wersja z odejmowaniem dla NWD(100, 7)?', opts4(raceRow(100, 7).sub, 3, 7, 100), 0, 'Kliknij parę 100 i 7 w liczniku.', {after: `${raceRow(100, 7).sub} odejmowań, a wersja z resztą: ${raceRow(100, 7).mod} kroki.`}),
          pick('Ile kroków potrzebuje wersja z resztą dla NWD(1 000 000, 3)?', ['2', '3', fmt(raceRow(1000000, 3).sub), '1 000 000'], 0, 'Kliknij parę 1 000 000 i 3.', {after: `2 kroki zamiast ${fmt(raceRow(1000000, 3).sub)} odejmowań.`}),
          pick('Dlaczego wersja z resztą jest szybsza?', ['Jedno dzielenie z resztą zastępuje wiele odejmowań tej samej liczby', 'Bo dzielenie daje inny wynik NWD', 'Bo komputer szybciej dzieli niż odejmuje'], 0, 'Porównaj obrazki odcinania kwadratów w obu wersjach.', {after: 'Reszta z dzielenia = „odejmij tyle razy, ile się da” w jednym kroku. Wynik NWD jest ten sam.'})
        ]}
    ],
    summary: () => 'Kafelkarz: ściana 240 × 180 → płytka 60 × 60 cm, 12 sztuk'
  },
  lcm: {
    title: 'NWW: kiedy znowu razem?', icon: 'clock',
    tasks: [
      lcmTask('bus', 12, 18, {title: 'Dwa autobusy', story: 'Linia A odjeżdża co 12 minut, linia B co 18 minut. O 7:00 odjechały razem. Kiedy znowu odjadą razem?',
        extra: [pick('O której znowu odjadą razem?', ['7:36', '7:30', '10:36'], 0, 'Dodaj NWW minut do 7:00.', {after: '7:00 + 36 min = 7:36.'})]}),
      lcmTask('shift', 4, 6, {title: 'Grafik zmian', unit: 'dni', story: 'Na praktykach pracujesz na nocnej zmianie co 4 dni, Twój kumpel co 6 dni. Dziś macie zmianę razem. Za ile dni znowu?'}),
      lcmTask('tile', 30, 20, {title: 'Kwadrat z płytek', unit: 'cm', timeline: false, story: 'Płytki 30 × 20 cm. Jaki najmniejszy kwadrat ułożysz z całych płytek (wszystkie leżą tak samo)?',
        extra: [num('Ile płytek 30 × 20 potrzeba na ten kwadrat?', (60 / 30) * (60 / 20), 'W rzędzie: 60 : 30, rzędów: 60 : 20. Pomnóż.', {after: '2 · 3 = 6 płytek.'})]})
    ],
    summary: () => 'Autobusy razem o 7:36 · zmiana razem co 12 dni'
  },
  /* ── Ułamki (lekcja 49) ── */
  simplify: {
    title: 'Skracanie przez NWD', icon: 'hash',
    tasks: [
      simplifyTask('s18', [18, 24], {title: '18 z 24', story: 'W klasie 18 z 24 osób ma prawo jazdy na skuter. Jaka to część klasy, w najprostszym zapisie?'}),
      simplifyTask('s45', [45, 60], {title: '45 minut', story: 'Lekcja trwa 45 minut. Jaka to część godziny (60 minut)?'}),
      simplifyTask('s40', [40, 100], {title: 'Rabat 40%', story: '40% to 40/100. Skróć — zobaczysz, jaką część ceny odejmuje sklep.'})
    ],
    summary: () => '18/24 = 3/4 · 45/60 = 3/4 · 40/100 = 2/5'
  },
  addsub: {
    title: 'Dodawanie i odejmowanie', icon: 'hash',
    tasks: [
      addTask('a-recipe', [1, 2], [1, 3], '+', {title: 'Naleśniki: mleko + woda', story: 'Przepis: 1/2 szklanki mleka i 1/3 szklanki wody. Ile płynu razem? Czy zmieści się w jednej szklance?', labels: ['mleko', 'woda']}),
      addTask('a-pizza', [3, 4], [1, 6], '−', {title: 'Pizza na spółkę', story: 'Zostało 3/4 pizzy. Zjadasz 1/6 całej pizzy. Ile zostaje?', labels: ['zostało', 'zjadasz']}),
      addTask('a-train', [1, 4], [1, 12], '+', {title: 'Trening', story: 'Rozgrzewka trwa 1/4 godziny, rozciąganie 1/12 godziny (5 minut). Jaka to razem część godziny?', labels: ['rozgrzewka', 'rozciąganie']})
    ],
    summary: () => 'Przepis: 1/2 + 1/3 = 5/6 szklanki'
  },
  mul: {
    title: 'Mnożenie: przepisy i rabaty', icon: 'hash',
    tasks: [
      {id: 'm-recipe', title: 'Przepis na 6 osób', points: 2,
        story: 'Przepis na 4 osoby: 2/3 szklanki mąki. Gości jest 6. Ile mąki?',
        visual: {kind: 'bars', items: [[2, 3], [3, 2]], op: '·', result: [1, 1], labels: ['mąka na 4 osoby', 'ile razy więcej (6/4)']},
        steps: [
          frac('6 osób zamiast 4 to 6/4 porcji. Skróć 6/4.', [3, 2], 'NWD(6, 4) = 2. Podziel licznik i mianownik przez 2.', {algo: true}),
          num('2/3 · 3/2: licznik = 2 · 3 = ?', 6, 'Liczniki mnożymy przez siebie.'),
          num('Mianownik = 3 · 2 = ?', 6, 'Mianowniki mnożymy przez siebie.'),
          frac('Wynik 6/6 po skróceniu (wpisz jako ułamek, np. 1/1 = jedna całość):', [1, 1], '6 : 6 = 1. Licznik i mianownik dzielisz przez NWD = 6.', {after: 'Dokładnie 1 szklanka mąki. Przy mnożeniu nie szukamy wspólnego mianownika!'})
        ]},
      {id: 'm-discount', title: 'Rabat na rabat', points: 2,
        story: 'Bluza: −1/4 ceny, a przy kasie jeszcze −1/5 od nowej ceny. Sklep krzyczy „razem 45%”. Sprawdź.',
        visual: {kind: 'bars', items: [[3, 4], [4, 5]], op: '·', result: [3, 5], labels: ['po rabacie −1/4', 'po rabacie −1/5']},
        steps: [
          frac('Po pierwszym rabacie płacisz jaką część ceny?', [3, 4], '1 − 1/4. Cała cena to 4/4.', {wrong: f => (sameF(f, [1, 4]) ? '1/4 to rabat. Płacisz resztę: 4/4 − 1/4.' : null)}),
          frac('Z nowej ceny przy kasie płacisz jaką część?', [4, 5], '1 − 1/5 = 5/5 − 1/5.', {wrong: f => (sameF(f, [1, 5]) ? '1/5 to rabat. Płacisz resztę.' : null)}),
          frac('Razem płacisz 3/4 · 4/5 = ? (skróć)', [3, 5], 'Pomnóż liczniki i mianowniki: 12/20, potem skróć przez NWD(12, 20).', {algo: true}),
          pick('Ile wynosi łączny rabat?', ['40% (2/5 ceny)', '45%', '20%'], 0, 'Płacisz 3/5 ceny, czyli 60%. Ile procent ceny odpada?', {after: '1 − 3/5 = 2/5 = 40%, a nie 45%. Rabatów nie dodaje się wprost — drugi liczy się od już obniżonej ceny.'})
        ]},
      {id: 'm-half', title: 'Pół z dwóch trzecich', points: 2,
        story: 'Zostało 2/3 pizzy. Bierzesz połowę tego, co zostało. Jaką część całej pizzy zjesz?',
        visual: {kind: 'bars', items: [[2, 3], [1, 2]], op: '·', result: [1, 3], labels: ['zostało', 'bierzesz połowę']},
        steps: [
          pick('„Połowa z 2/3” to działanie…', ['1/2 · 2/3', '1/2 + 2/3', '2/3 − 1/2'], 0, '„Część z czegoś” to mnożenie.', {after: '„z” = razy.'}),
          frac('1/2 · 2/3 = ? (skróć)', [1, 3], 'Liczniki: 1 · 2, mianowniki: 2 · 3. Potem skróć przez NWD.', {algo: true, after: '2/6 = 1/3 pizzy.'})
        ]}
    ],
    summary: () => 'Rabat −1/4 i −1/5 to razem 40%, nie 45%'
  },
  mix: {
    title: 'Mieszanki w zawodach', icon: 'energy',
    tasks: [
      {id: 'x-fuel', title: 'Paliwo do kosiarki 1:50', points: 2,
        story: 'Silnik dwusuwowy kosiarki: mieszanka oleju z benzyną w proporcji 1:50 (1 część oleju na 50 części benzyny). Masz kanister 5 litrów benzyny.',
        visual: {kind: 'ratio', parts: [{n: 1, label: 'olej'}, {n: 50, label: 'benzyna'}]},
        steps: [
          num('Ile części ma cała mieszanka 1:50?', 51, 'Dodaj części: 1 część oleju + 50 części benzyny.'),
          frac('Jaką część całej mieszanki stanowi olej?', [1, 51], 'Olej to 1 część z wszystkich części mieszanki.', {algo: true, wrong: f => (sameF(f, [1, 50]) ? '1/50 to stosunek oleju do benzyny. Część CAŁEJ mieszanki liczy się z 51 części.' : null)}),
          num('5 l = 5000 ml benzyny. Ile ml oleju dolać (5000 : 50)?', 100, 'Na każde 50 ml benzyny przypada 1 ml oleju.', {unit: 'ml', after: '100 ml oleju na 5 l benzyny.'})
        ]},
      {id: 'x-hair', title: 'Fryzjer: farba i utleniacz', points: 2,
        story: 'Producent farby podaje proporcję farba : utleniacz = 1 : 1,5 (przykład — zawsze czytaj instrukcję). Liczby z przecinkiem są niewygodne.',
        visual: {kind: 'ratio', parts: [{n: 2, label: 'farba'}, {n: 3, label: 'utleniacz'}]},
        steps: [
          pick('1 : 1,5 w liczbach całkowitych to…', ['2 : 3', '1 : 2', '3 : 2'], 0, 'Pomnóż obie liczby przez 2.', {after: '1 · 2 : 1,5 · 2 = 2 : 3.'}),
          frac('Jaką część miski stanowi farba?', [2, 5], 'Wszystkich części jest 2 + 3.', {algo: true, wrong: f => (sameF(f, [2, 3]) ? '2/3 to stosunek farby do utleniacza, nie część całości.' : null)}),
          num('Tubka ma 60 ml farby. Ile ml utleniacza?', 90, '60 ml to 2 części, więc 1 część = 30 ml. Utleniacz to 3 części.', {unit: 'ml', after: '3 · 30 = 90 ml utleniacza, razem 150 ml.'})
        ]},
      {id: 'x-paint', title: 'Malarz: dwie puszki', points: 2,
        story: 'Na ścianę zmieszano 2/3 litra białej farby i 1/4 litra niebieskiej. Ile farby jest w wiadrze?',
        visual: {kind: 'bars', items: [[2, 3], [1, 4]], op: '+', result: [11, 12], common: 12, labels: ['biała', 'niebieska']},
        steps: [
          num('NWW(3, 4) = ?', 12, 'Najmniejsza liczba, która dzieli się przez 3 i przez 4.', {algo: true}),
          frac('2/3 + 1/4 = ? (litra)', [11, 12], '2/3 = 8/12, 1/4 = 3/12. Dodaj liczniki.', {wrong: f => (sameF(f, [3, 7]) ? 'Liczników i mianowników nie dodaje się osobno. Sprowadź do dwunastych.' : null)})
        ]}
    ],
    summary: () => 'Kosiarka: 100 ml oleju na 5 l · fryzjer: 60 ml farby + 90 ml utleniacza'
  }
};

function simplifyTask(id, [l, m], {title, story, points = 2}) {
  const g = gcd(l, m), r = simplify(l, m);
  return {id, title, story, points, visual: {kind: 'bars', items: [[l, m]], op: null, result: r, labels: ['przed skróceniem']},
    steps: [
      num(`NWD(${l}, ${m}) = ?`, g, `Największa liczba, która dzieli ${l} i ${m}. Euklides: ${m} : ${l} daje resztę ${m % l}…`, {algo: true,
        wrong: x => (l % x === 0 && m % x === 0 ? `${x} dzieli obie liczby, ale nie jest NWD — jest większy wspólny dzielnik. Skracając przez ${x}, musiałbyś skracać jeszcze raz.` : null)}),
      num(`Licznik: ${l} : ${g} = ?`, l / g, `Podziel ${l} przez ${g}.`),
      num(`Mianownik: ${m} : ${g} = ?`, m / g, `Podziel ${m} przez ${g}.`),
      frac(`${l}/${m} po skróceniu =`, r, 'Wpisz wyniki dwóch poprzednich kroków.', {after: `${l}/${m} = ${fracText(r)} — ta sama część, mniejsze liczby. Skracanie przez NWD to jeden krok zamiast kilku.`})
    ]};
}

function addTask(id, x, y, op, {title, story, points = 2, labels}) {
  const m = lcm(x[1], y[1]), lx = x[0] * (m / x[1]), ly = y[0] * (m / y[1]);
  const raw = op === '+' ? lx + ly : lx - ly;
  const r = simplify(raw, m);
  const steps = [
    num(`Wspólny mianownik: NWW(${x[1]}, ${y[1]}) = ?`, m, `Najmniejsza liczba, która dzieli się przez ${x[1]} i przez ${y[1]}. Wypisz wielokrotności większej: ${Math.max(x[1], y[1])}, ${2 * Math.max(x[1], y[1])}, …`, {algo: true,
      wrong: v => (v === x[1] * y[1] && v !== m ? `${v} też działa, ale NWW jest mniejsza — mniejsze liczby, mniej skracania.` : null)}),
    num(`${x[0]}/${x[1]} = ?/${m}`, lx, `${m} : ${x[1]} = ${m / x[1]}. Pomnóż licznik ${x[0]} przez ${m / x[1]}.`),
    num(`${y[0]}/${y[1]} = ?/${m}`, ly, `${m} : ${y[1]} = ${m / y[1]}. Pomnóż licznik ${y[0]} przez ${m / y[1]}.`),
    frac(`${x[0]}/${x[1]} ${op} ${y[0]}/${y[1]} = ? ${r[1] !== m ? '(skróć wynik)' : ''}`.trim(), r, `${lx}/${m} ${op} ${ly}/${m}: ${op === '+' ? 'dodaj' : 'odejmij'} liczniki, mianownik zostaje ${m}.${r[1] !== m ? ' Potem skróć.' : ''}`, {
      wrong: f => {
        const naive = op === '+' ? [x[0] + y[0], x[1] + y[1]] : null;
        if (naive && sameF(f, naive)) return `${fracText(naive)} to dodanie liczników i mianowników osobno. Zobacz pasek: wynik wyszedłby MNIEJSZY niż samo ${x[0]}/${x[1]} — absurd. Dodawaj części tej samej wielkości: najpierw wspólny mianownik.`;
        return null;
      }})
  ];
  if (op === '+' && r[0] > r[1]) steps.push(pick('Wynik jest…', ['większy od 1', 'mniejszy od 1'], 0, 'Porównaj licznik z mianownikiem.'));
  if (id === 'a-recipe') steps.push(pick('Czy mleko z wodą zmieszczą się w jednej szklance?', ['Tak — 5/6 to mniej niż cała szklanka', 'Nie — wyjdzie ponad szklankę', 'Tak, równo pełna'], 0, '5/6 < 6/6.', {after: 'Zostaje 1/6 szklanki wolnego miejsca.'}));
  return {id, title, story, points, visual: {kind: 'bars', items: [x, y], op: op === '+' ? '+' : '−', result: r, common: m, labels}, steps};
}

/* ───────────── Stan i punktacja ───────────── */
export const roundHalf = x => Math.round(x * 2) / 2;
export const modeTasks = mode => MODES[mode]?.tasks || [];
export const modeMax = mode => modeTasks(mode).reduce((s, t) => s + t.points, 0);
export function taskScore(task, st) {
  if (!st?.done) return 0;
  return roundHalf(task.points * Math.max(0.5, 1 - 0.25 * (st.errors || 0)));
}
/** Liczba kroków algorytmu pokazanych na obrazku (po zaliczonych krokach z flagą algo). */
export const shownAlgo = (task, st) => task.steps.slice(0, st?.step || 0).filter(s => s.algo).length;
/** Odpowiedź na bieżący krok zadania → nowy stan zadania i komunikat. */
export function answerStep(task, st = {}, input) {
  const i = st.step || 0;
  if (st.done || i >= task.steps.length) return {st, fb: null};
  const step = task.steps[i];
  const res = checkStep(step, input);
  const penalty = !res.ok && !res.invalid && !res.near;
  const errors = (st.errors || 0) + (penalty ? 1 : 0);
  const stepErrors = {...(st.stepErrors || {}), [i]: ((st.stepErrors || {})[i] || 0) + (penalty ? 1 : 0)};
  const log = res.ok ? [...(st.log || []), {i, input, firstTry: !stepErrors[i]}] : (st.log || []);
  const next = {...st, errors, stepErrors, log, step: res.ok ? i + 1 : i, wrongFrac: res.frac || null};
  if (res.ok && i + 1 >= task.steps.length) next.done = true;
  return {st: next, fb: {ok: res.ok, near: !!res.near, invalid: !!res.invalid, text: res.text, step: i}};
}
export function modeResult(mode, value = {}) {
  const tasks = modeTasks(mode), ts = value?.tasks || {};
  const score = roundHalf(tasks.reduce((s, t) => s + taskScore(t, ts[t.id]), 0));
  const done = tasks.length > 0 && tasks.every(t => ts[t.id]?.done);
  return {done, score, max: modeMax(mode), summary: done ? MODES[mode].summary(value) : undefined};
}
/** Zadanie odblokowane, gdy poprzednie jest zrobione (mastery). */
export const taskUnlocked = (mode, value, idx) => idx === 0 || !!value?.tasks?.[modeTasks(mode)[idx - 1].id]?.done;
/** Pomocniczo do testów: rozwiązuje wszystkie zadania trybu wzorcowo. */
export function solveMode(mode, withErrors = 0) {
  let value = {tasks: {}};
  for (const t of modeTasks(mode)) {
    let st = {};
    for (let k = 0; k < withErrors && k < 1; k++) st = answerStep(t, st, t.steps[0].kind === 'frac' ? ['999', '998'] : t.steps[0].kind === 'num' ? '99999' : (t.steps[0].answer + 1) % t.steps[0].options.length).st;
    for (const s of t.steps) st = answerStep(t, st, s.kind === 'frac' ? s.answer.map(String) : s.kind === 'num' ? String(s.answer) : s.answer).st;
    value = {...value, tasks: {...value.tasks, [t.id]: st}};
  }
  return {...value, ...modeResult(mode, value)};
}
