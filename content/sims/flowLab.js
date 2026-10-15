// Logika symulatora „flowLab” (klasa 1, lekcje 60–61: specyfikacja, przypadki testowe, schemat blokowy).
// Czysty JS — działa w przeglądarce i w Node (tests/sims-g1-python-a.test.mjs).
//
// Tryby:
//  - 'tests'  — projektant przypadków testowych do gotowej specyfikacji (SPECS); wynik liczy specyfikacja.
//  - 'trace'  — wykonanie schematu blokowego krok po kroku; przy rombie uczeń przewiduje TAK/NIE.
//  - 'fill'   — uzupełnianie pustych bloków schematu; poprawność sprawdza uruchomienie na danych testowych.
//
// Bloki schematu: {id, kind:'start'|'io'|'op'|'if'|'end', text, pos:[kolumna, wiersz], next, yes, no, blank?}
// Język bloków (pseudokod): „Wczytaj a, b”, „Wypisz wyrażenie, "tekst"”, „x ← wyrażenie” (kilka linii = kilka
// przypisań), warunek „a < b?”. Działania: + - * / div mod, porównania < > ≤ ≥ = ≠, spójniki i/oraz, lub, nie.

export const MAX_STEPS = 200;

/* ───────────── Mini-interpreter pseudokodu ───────────── */
const OPS2 = ['<=', '>=', '!=', '=='];
const OPS1 = ['+', '-', '*', '·', '/', '%', '(', ')', '<', '>', '=', '≤', '≥', '≠', ',', '←'];
const WORD_OPS = {div: 'div', mod: 'mod', i: 'and', oraz: 'and', lub: 'or', nie: 'not', prawda: 'true', 'fałsz': 'false'};

export class FlowError extends Error {
  constructor(message, kind = 'syntax') { super(message); this.kind = kind; }
}

export function tokenize(src) {
  const out = [];
  const s = String(src);
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      if (s[j] === '.' && /[0-9]/.test(s[j + 1] || '')) { j++; while (j < s.length && /[0-9]/.test(s[j])) j++; }
      out.push({t: 'num', v: Number(s.slice(i, j))});
      i = j; continue;
    }
    if (c === '"' || c === '„' || c === '”') {
      const close = c === '„' ? '”' : c;
      const j = s.indexOf(close, i + 1);
      if (j < 0) throw new FlowError('Tekst bez cudzysłowu na końcu.');
      out.push({t: 'str', v: s.slice(i + 1, j)});
      i = j + 1; continue;
    }
    if (/[\p{L}_]/u.test(c)) {
      let j = i;
      while (j < s.length && /[\p{L}\p{N}_]/u.test(s[j])) j++;
      const w = s.slice(i, j);
      const low = w.toLowerCase();
      if (WORD_OPS[low]) out.push({t: 'op', v: WORD_OPS[low]});
      else out.push({t: 'id', v: w});
      i = j; continue;
    }
    const two = s.slice(i, i + 2);
    if (OPS2.includes(two)) { out.push({t: 'op', v: two}); i += 2; continue; }
    if (OPS1.includes(c)) { out.push({t: 'op', v: c}); i++; continue; }
    if (c === '?') { i++; continue; }
    throw new FlowError(`Nieznany znak „${c}”.`);
  }
  return out;
}

const CMP = {'<': (a, b) => a < b, '>': (a, b) => a > b, '<=': (a, b) => a <= b, '≤': (a, b) => a <= b, '>=': (a, b) => a >= b, '≥': (a, b) => a >= b,
  '=': (a, b) => a === b, '==': (a, b) => a === b, '!=': (a, b) => a !== b, '≠': (a, b) => a !== b};

/** Oblicza wyrażenie. vars: obiekt zmiennych. Zwraca liczbę, tekst albo wartość logiczną. */
export function evalExpr(src, vars = {}) {
  const toks = Array.isArray(src) ? src : tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = v => peek()?.t === 'op' && peek().v === v;
  const num = (x, op) => {
    if (typeof x !== 'number') throw new FlowError(`Działanie „${op}” potrzebuje liczb.`, 'type');
    return x;
  };
  function atom() {
    const tk = toks[p++];
    if (!tk) throw new FlowError('Wyrażenie urywa się w połowie.');
    if (tk.t === 'num' || tk.t === 'str') return tk.v;
    if (tk.t === 'op' && tk.v === 'true') return true;
    if (tk.t === 'op' && tk.v === 'false') return false;
    if (tk.t === 'id') {
      if (!(tk.v in vars)) throw new FlowError(`Zmienna „${tk.v}” nie ma jeszcze wartości — algorytm używa jej, zanim ją ustawi.`, 'name');
      return vars[tk.v];
    }
    if (tk.t === 'op' && tk.v === '(') {
      const v = orExpr();
      if (!isOp(')')) throw new FlowError('Brakuje nawiasu zamykającego.');
      p++; return v;
    }
    throw new FlowError(`Nie rozumiem „${tk.v}” w tym miejscu.`);
  }
  function unary() {
    if (isOp('-')) { p++; return -num(unary(), '-'); }
    return atom();
  }
  function term() {
    let v = unary();
    while (peek()?.t === 'op' && ['*', '·', '/', '%', 'div', 'mod'].includes(peek().v)) {
      const op = toks[p++].v;
      const r = num(unary(), op);
      num(v, op);
      if ((op === '/' || op === 'div' || op === '%' || op === 'mod') && r === 0) throw new FlowError('Dzielenie przez zero.', 'zero');
      if (op === '*' || op === '·') v = v * r;
      else if (op === '/') v = v / r;
      else if (op === 'div') v = Math.floor(v / r);
      else v = ((v % r) + r) % r;
    }
    return v;
  }
  function sum() {
    let v = term();
    while (isOp('+') || isOp('-')) {
      const op = toks[p++].v;
      const r = term();
      if (op === '+' && (typeof v === 'string' || typeof r === 'string')) v = String(v) + String(r);
      else v = op === '+' ? num(v, op) + num(r, op) : num(v, op) - num(r, op);
    }
    return v;
  }
  function cmp() {
    const v = sum();
    if (peek()?.t === 'op' && CMP[peek().v]) {
      const op = toks[p++].v;
      const r = sum();
      if (!['=', '==', '!=', '≠'].includes(op) && (typeof v !== 'number' || typeof r !== 'number')) throw new FlowError(`Porównanie „${op}” potrzebuje liczb.`, 'type');
      return CMP[op](v, r);
    }
    return v;
  }
  function notExpr() { if (isOp('not')) { p++; return !notExpr(); } return cmp(); }
  function andExpr() { let v = notExpr(); while (isOp('and')) { p++; const r = notExpr(); v = Boolean(v) && Boolean(r); } return v; }
  function orExpr() { let v = andExpr(); while (isOp('or')) { p++; const r = andExpr(); v = Boolean(v) || Boolean(r); } return v; }
  const v = orExpr();
  if (p < toks.length) throw new FlowError(`Nadmiarowy fragment „${toks[p].v}”.`);
  return v;
}

/** Dzieli listę tokenów po przecinkach najwyższego poziomu. */
function splitArgs(toks) {
  const parts = [[]];
  let depth = 0;
  for (const tk of toks) {
    if (tk.t === 'op' && tk.v === '(') depth++;
    if (tk.t === 'op' && tk.v === ')') depth--;
    if (tk.t === 'op' && tk.v === ',' && depth === 0) parts.push([]);
    else parts.at(-1).push(tk);
  }
  return parts.filter(x => x.length);
}

/** Wartość do wypisania: liczby bez zbędnych zer, maks. 2 miejsca po kropce. */
export function show(v) {
  if (typeof v === 'boolean') return v ? 'PRAWDA' : 'FAŁSZ';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
  return String(v);
}

/** Tekst bloku po wybraniu opcji w pustych polach (tryb fill). */
export function blockText(block, picks = {}) {
  if (block.blank) {
    const k = picks[block.id];
    return Number.isInteger(k) ? block.blank.options[k] : null;
  }
  return block.text;
}

/** Wykonuje jeden blok (bez rombu). Zwraca {vars, out:[...]} — nowe obiekty. */
export function execBlock(block, text, vars, input = {}) {
  const v = {...vars};
  const out = [];
  if (block.kind === 'start' || block.kind === 'end') return {vars: v, out};
  for (const line of String(text).split('\n').map(l => l.trim()).filter(Boolean)) {
    const m = line.match(/^(wczytaj|wypisz)\s+(.*)$/i);
    if (m && m[1].toLowerCase() === 'wczytaj') {
      for (const name of m[2].split(',').map(x => x.trim()).filter(Boolean)) {
        if (!(name in input)) throw new FlowError(`Brak danej wejściowej „${name}”.`, 'input');
        v[name] = input[name];
      }
    } else if (m) {
      out.push(splitArgs(tokenize(m[2])).map(part => show(evalExpr(part, v))).join(' '));
    } else {
      const toks = tokenize(line);
      const at = toks.findIndex(tk => tk.t === 'op' && tk.v === '←');
      if (at !== 1 || toks[0].t !== 'id') throw new FlowError(`Nie rozumiem polecenia „${line}”. Przypisanie wygląda tak: zmienna ← wyrażenie.`);
      v[toks[0].v] = evalExpr(toks.slice(2), v);
    }
  }
  return {vars: v, out};
}

const byId = chart => Object.fromEntries(chart.blocks.map(b => [b.id, b]));

/**
 * Wykonuje cały schemat dla danych wejściowych.
 * Zwraca {steps:[{id, kind, vars, out, cond?}], out:[linie], error:null|{message, kind, id}, end:bool}.
 * Krok = wykonany blok; vars/out — stan PO jego wykonaniu.
 */
export function runChart(chart, input = {}, picks = {}, maxSteps = MAX_STEPS) {
  const blocks = byId(chart);
  const start = chart.blocks.find(b => b.kind === 'start');
  let cur = start;
  let vars = {};
  const out = [];
  const steps = [];
  try {
    while (cur) {
      if (steps.length >= maxSteps) throw new FlowError(`Algorytm się nie kończy — wykonał już ${maxSteps} kroków. Sprawdź, czy warunek pętli kiedyś przestanie być spełniony.`, 'steps');
      const text = blockText(cur, picks);
      if (text === null) throw new FlowError('W schemacie jest puste pole — wybierz jego treść.', 'blank');
      if (cur.kind === 'if') {
        const c = evalExpr(text, vars);
        if (typeof c !== 'boolean') throw new FlowError('W rombie musi być warunek (porównanie), na który odpowiedź to TAK albo NIE.', 'type');
        steps.push({id: cur.id, kind: 'if', vars, out: [...out], cond: c});
        cur = blocks[c ? cur.yes : cur.no];
        continue;
      }
      const r = execBlock(cur, text, vars, input);
      vars = r.vars;
      out.push(...r.out);
      steps.push({id: cur.id, kind: cur.kind, vars, out: [...out]});
      if (cur.kind === 'end') return {steps, out, error: null, end: true};
      cur = blocks[cur.next];
    }
    throw new FlowError('Strzałka prowadzi donikąd — brakuje bloku „Stop”.', 'graph');
  } catch (e) {
    if (!(e instanceof FlowError)) throw e;
    return {steps, out, error: {message: e.message, kind: e.kind, id: cur?.id}, end: false};
  }
}

/** Warunek z podstawionymi wartościami: „suma < cena” → „250 < 600”. */
export function substitute(text, vars) {
  return tokenize(text).map(tk => tk.t === 'id' && tk.v in vars ? show(vars[tk.v]) : tk.t === 'str' ? `"${tk.v}"` : tk.t === 'op' ? ({and: 'i', or: 'lub', not: 'nie', true: 'prawda', false: 'fałsz'}[tk.v] || tk.v) : show(tk.v)).join(' ')
    .replace(/\( /g, '(').replace(/ \)/g, ')');
}

/** Sprawdza schemat z wybranymi polami na wszystkich testach. */
export function checkFill(chart, picks, tests = []) {
  return tests.map(t => {
    const r = runChart(chart, t.input, picks);
    const got = r.out.join('\n');
    return {input: t.input, expected: t.output, got, error: r.error, ok: !r.error && r.end && got === t.output};
  });
}

/* ───────────── Rysunek schematu: geometria (czysta funkcja, testowalna) ───────────── */
export const GEO = {colW: 236, rowH: 92, w: 196, h: 50, pad: 34, lane: 18};

export function blockBox(b) {
  const [c, r] = b.pos;
  const cx = GEO.pad + GEO.lane + c * GEO.colW + GEO.colW / 2;
  const cy = GEO.pad + r * GEO.rowH + GEO.h / 2;
  const w = b.kind === 'if' ? GEO.w + 16 : b.kind === 'start' || b.kind === 'end' ? 120 : GEO.w;
  const h = b.kind === 'if' ? GEO.h + 22 : GEO.h;
  return {cx, cy, w, h, top: cy - h / 2, bottom: cy + h / 2, left: cx - w / 2, right: cx + w / 2};
}

export function chartSize(chart) {
  const cols = Math.max(...chart.blocks.map(b => b.pos[0])) + 1;
  const rows = Math.max(...chart.blocks.map(b => b.pos[1])) + 1;
  return {width: GEO.pad * 2 + GEO.lane + cols * GEO.colW, height: GEO.pad * 2 + (rows - 1) * GEO.rowH + GEO.h + 12};
}

/** Strzałki: [{from, to, label, points:[[x,y],…]}]. */
export function chartEdges(chart) {
  const blocks = byId(chart);
  const edges = [];
  for (const b of chart.blocks) {
    const links = b.kind === 'if' ? [[b.yes, 'TAK'], [b.no, 'NIE']] : b.next ? [[b.next, '']] : [];
    for (const [to, label] of links) {
      const t = blocks[to];
      if (!t) continue;
      const s = blockBox(b), d = blockBox(t);
      let pts;
      if (t.pos[1] > b.pos[1]) {
        if (t.pos[0] === b.pos[0]) pts = [[s.cx, s.bottom], [d.cx, d.top]];
        else if (b.kind === 'if') {
          const sx = t.pos[0] > b.pos[0] ? s.right : s.left;
          pts = [[sx, s.cy], [d.cx, s.cy], [d.cx, d.top]];
        } else {
          const midY = d.top - (GEO.rowH - GEO.h) / 2;
          pts = [[s.cx, s.bottom], [s.cx, midY], [d.cx, midY], [d.cx, d.top]];
        }
      } else {
        // Powrót w górę (pętla): na lewy tor i do lewego boku celu.
        const laneX = GEO.pad / 2 + t.pos[0] * GEO.colW;
        const y = s.bottom + (GEO.rowH - GEO.h) / 3;
        pts = [[s.cx, s.bottom], [s.cx, y], [laneX, y], [laneX, d.cy], [d.left, d.cy]];
      }
      edges.push({from: b.id, to, label, points: pts});
    }
  }
  return edges;
}

/** Opis schematu dla czytnika ekranu / widoku tekstowego. */
export function chartOutline(chart, picks = {}) {
  const blocks = byId(chart);
  const num = Object.fromEntries(chart.blocks.map((b, i) => [b.id, i + 1]));
  const kindName = {start: 'Start', end: 'Stop', io: 'Wejście/wyjście', op: 'Operacja', if: 'Warunek'};
  return chart.blocks.map(b => {
    const text = b.blank ? (blockText(b, picks) ?? '(puste pole)') : b.text;
    let go = '';
    if (b.kind === 'if') go = ` TAK → blok ${num[b.yes]}, NIE → blok ${num[b.no]}.`;
    else if (b.next && blocks[b.next]) go = ` Dalej → blok ${num[b.next]}.`;
    return `${num[b.id]}. ${kindName[b.kind]}: ${text.replace(/\n/g, '; ')}.${go}`;
  });
}

/* ───────────── Specyfikacje do trybu „tests” (lekcja 60) ───────────── */
const parseNum = raw => {
  const s = String(raw ?? '').trim().replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
};
const isInt = x => x !== null && Number.isInteger(x);

export const SPECS = {
  autobus: {
    title: 'Czy zdążę na autobus?',
    story: 'Aplikacja na przystanku ma odpowiedzieć jednym słowem: zdążysz czy nie.',
    inputs: [
      {name: 'odjazd', label: 'Za ile minut odjeżdża autobus?', range: 'liczba całkowita od 0 do 120'},
      {name: 'dojscie', label: 'Ile minut idziesz na przystanek?', range: 'liczba całkowita od 1 do 60'}
    ],
    result: {kind: 'yesno', text: 'TAK, gdy czas dojścia jest mniejszy od czasu do odjazdu albo mu równy. W przeciwnym razie NIE.'},
    rules: ['Dane spoza zakresu albo niebędące liczbą całkowitą → komunikat „Błędne dane”.', 'Równe czasy = zdążysz na styk (TAK).'],
    categories: [
      {id: 'tak', label: 'Typowy przypadek: zdążysz', hint: 'Wpisz dane, przy których idziesz krócej, niż zostało do odjazdu.'},
      {id: 'nie', label: 'Typowy przypadek: nie zdążysz', hint: 'Wpisz dane, przy których idziesz dłużej, niż zostało do odjazdu.'},
      {id: 'rowne', label: 'Przypadek brzegowy: czasy równe (na styk)', hint: 'Przypadek brzegowy leży dokładnie na granicy warunku. Jaka para liczb leży na granicy „dojście ≤ odjazd”?'},
      {id: 'bledne', label: 'Błędne dane: program nie może liczyć', hint: 'Wpisz coś, czego nie ma w specyfikacji: liczbę ujemną, za dużą albo tekst zamiast liczby.'}
    ],
    evaluate(raw) {
      const o = parseNum(raw.odjazd), d = parseNum(raw.dojscie);
      const valid = isInt(o) && isInt(d) && o >= 0 && o <= 120 && d >= 1 && d <= 60;
      if (!valid) return {valid, result: 'BŁĄD', category: 'bledne', why: 'Te dane łamią specyfikację (zakres albo liczba całkowita), więc program ma pokazać „Błędne dane”.'};
      const ok = d <= o;
      return {valid, result: ok ? 'TAK' : 'NIE', category: d === o ? 'rowne' : ok ? 'tak' : 'nie',
        why: `Porównaj: dojście ${d} min i do odjazdu ${o} min. Czy ${d} ≤ ${o}? ${ok ? 'Tak' : 'Nie'}.`};
    }
  },
  telefon: {
    title: 'Ile miesięcy odkładam na telefon?',
    story: 'Program ma powiedzieć, po ilu miesiącach uzbierasz na telefon, jeśli co miesiąc odkładasz tę samą kwotę.',
    inputs: [
      {name: 'cena', label: 'Cena telefonu (zł)', range: 'liczba całkowita od 1 do 10 000'},
      {name: 'kwota', label: 'Ile odkładasz co miesiąc (zł)?', range: 'liczba całkowita od 1 do 5 000'}
    ],
    result: {kind: 'number', unit: 'mies.', text: 'Liczba pełnych miesięcy: cena podzielona przez kwotę, zaokrąglona W GÓRĘ (8,2 miesiąca to 9 miesięcy — w 8. miesiącu jeszcze brakuje).'},
    rules: ['Dane spoza zakresu albo niebędące liczbą całkowitą → komunikat „Błędne dane”.', 'Kwota 0 zł jest błędna — nigdy nie uzbierasz.'],
    categories: [
      {id: 'rowno', label: 'Dzieli się bez reszty', hint: 'Wybierz liczby, które dzielą się bez reszty, np. cena 1200 i kwota 100.'},
      {id: 'reszta', label: 'Z resztą — trzeba zaokrąglić w górę', hint: 'Wybierz liczby, które NIE dzielą się bez reszty, np. 1000 i 300.'},
      {id: 'jeden', label: 'Przypadek brzegowy: odkładasz od razu całą cenę lub więcej', hint: 'Co, jeśli miesięcznie odkładasz tyle, ile kosztuje telefon, albo więcej?'},
      {id: 'bledne', label: 'Błędne dane: program nie może liczyć', hint: 'Wpisz coś spoza specyfikacji: kwotę 0, liczbę ujemną albo tekst.'}
    ],
    evaluate(raw) {
      const c = parseNum(raw.cena), k = parseNum(raw.kwota);
      const valid = isInt(c) && isInt(k) && c >= 1 && c <= 10000 && k >= 1 && k <= 5000;
      if (!valid) return {valid, result: 'BŁĄD', category: 'bledne', why: 'Te dane łamią specyfikację, więc program ma pokazać „Błędne dane”.'};
      const m = Math.ceil(c / k);
      const exact = c % k === 0;
      return {valid, result: m, category: k >= c ? 'jeden' : exact ? 'rowno' : 'reszta',
        why: exact ? `${c} : ${k} = ${c / k} — dzieli się bez reszty.` : `${c} : ${k} ≈ ${(Math.round(c / k * 100) / 100).toString().replace('.', ',')} — zaokrąglij w górę do pełnych miesięcy.`};
    }
  }
};

/** Odczytuje oczekiwany wynik wpisany przez ucznia: 'TAK'/'NIE'/'BŁĄD' albo liczba. */
export function parseExpected(spec, exp) {
  if (!exp || !exp.kind) return null;
  if (exp.kind === 'error') return 'BŁĄD';
  if (spec.result.kind === 'yesno') return exp.kind === 'yes' ? 'TAK' : exp.kind === 'no' ? 'NIE' : null;
  const m = String(exp.value ?? '').trim().replace(',', '.').match(/^-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

/**
 * Ocena jednego przypadku testowego ucznia.
 * Zwraca {status:'empty'|'incomplete'|'wrong'|'dup'|'new', category, correct, why, message}.
 */
export function judgeCase(specId, raw, exp, have = []) {
  const spec = SPECS[specId];
  if (spec.inputs.some(i => String(raw?.[i.name] ?? '').trim() === '')) return {status: 'empty', message: 'Uzupełnij wszystkie dane wejściowe — przypadek testowy to komplet danych.'};
  const mine = parseExpected(spec, exp);
  if (mine === null) return {status: 'incomplete', message: spec.result.kind === 'number' ? 'Wybierz, co ma zrobić program: podać liczbę miesięcy (wpisz ją) albo zgłosić błędne dane.' : 'Zaznacz, co według specyfikacji ma odpowiedzieć program.'};
  const ev = spec.evaluate(raw);
  const cat = spec.categories.find(c => c.id === ev.category);
  if (mine !== ev.result) {
    const msg = ev.result === 'BŁĄD' ? 'Według specyfikacji te dane są błędne — program nie może dla nich liczyć wyniku. Sprawdź zakresy przy danych wejściowych.'
      : mine === 'BŁĄD' ? 'Te dane mieszczą się w specyfikacji, więc program ma podać wynik, a nie błąd.'
      : `Według specyfikacji wynik jest inny. ${ev.why}`;
    return {status: 'wrong', category: ev.category, correct: ev.result, why: ev.why, message: msg};
  }
  if (have.includes(ev.category)) return {status: 'dup', category: ev.category, correct: ev.result, message: `Dobrze policzone, ale taki rodzaj przypadku już masz (${cat.label}). Dobry zestaw testów sprawdza różne sytuacje — wybierz dane z innej grupy.`};
  return {status: 'new', category: ev.category, correct: ev.result, message: `Dobrze! Nowy rodzaj przypadku: ${cat.label}.`};
}

/* ───────────── Punktacja ───────────── */
export const roundHalf = x => Math.round(x * 2) / 2;

export function flowMax(data) {
  const q = data.questions?.length || 0;
  if (data.mode === 'tests') return SPECS[data.spec].categories.length * (data.pointsPer || 2) + q;
  return (data.points || 0) + q;
}

export function questionScore(st) { return st?.ok ? (st.first ? 1 : 0.5) : 0; }

/** Wynik aktywności flowLab: {done, score, max, summary}. */
export function flowResult(data, value = {}) {
  const v = value || {};
  const max = flowMax(data);
  const qs = data.questions || [];
  const qScore = qs.reduce((s, _, i) => s + questionScore(v.q?.[i]), 0);
  const qDone = qs.every((_, i) => v.q?.[i]?.ok);
  let main = 0, mainDone = false, summary;
  if (data.mode === 'tests') {
    const spec = SPECS[data.spec];
    const per = data.pointsPer || 2;
    const got = v.got || {};
    main = spec.categories.reduce((s, c) => s + (got[c.id] ? (got[c.id].errors ? per / 2 : per) : 0), 0);
    mainDone = spec.categories.every(c => got[c.id]);
    const n = spec.categories.filter(c => got[c.id]).length;
    if (mainDone) summary = data.summary ? data.summary.replace('{n}', n) : undefined;
  } else if (data.mode === 'trace') {
    mainDone = !!v.finished;
    main = mainDone ? roundHalf(Math.max((data.points || 0) / 2, (data.points || 0) - 0.5 * (v.mistakes || 0))) : 0;
  } else if (data.mode === 'fill') {
    mainDone = !!v.passedAll;
    main = mainDone ? roundHalf((data.points || 0) * Math.max(0.5, 1 - 0.25 * (v.fails || 0))) : 0;
    if (mainDone && data.summary) summary = data.summary;
  }
  const score = Math.min(max, Math.round((main + qScore) * 10) / 10);
  return {done: mainDone && qDone, score, max, summary: mainDone && qDone ? summary : undefined};
}
