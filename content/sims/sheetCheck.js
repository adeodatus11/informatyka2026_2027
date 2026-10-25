// Kontrola wyniku z arkusza (lekcje Excela 69–74). Czysta logika, bez Reacta.
// Uczeń wykonuje zadanie w Excelu na znanym pliku startowym i wpisuje na platformie wynik
// z konkretnej komórki (albo przewiduje wynik formuły przed Excelem). Platforma porównuje
// z wartością oczekiwaną i daje podpowiedź, co sprawdzić w formule. Pliku nie odczytuje.
//
// Zadanie: {id, prompt, cell?, kind:'number'|'formula'|'text', answer, tol?, alt?:[{value,tol}],
//   accept?:[…] (formula/text), unit?, traps?:[{value|formula|text, tol?, feedback}], hint, explain}
// Punkty: 1 za pierwszą poprawną próbę, 0,5 po poprawce, 0 po „Pokaż rozwiązanie”.

export const REVEAL_AFTER = 2; // po tylu błędnych próbach można odsłonić rozwiązanie

export function sheetCheck(id, opts) {
 return {type:'sheetCheck', id, points:opts.tasks.length, ...opts};
}

// "1 234,50 zł" → 1234.5; "62%" → 62; "−1,8" → -1.8; "abc" → null
export function parseNumber(raw) {
 if (raw === null || raw === undefined) return null;
 let s = String(raw).trim().toLowerCase()
  .replace(/[−–—]/g, '-')
  .replace(/zł|zl|pln|°c|kwh|mm|%|osób\/km²|os\.\/km²|szt\.?|pkt/g, '')
  .replace(/[\s  ]/g, '');
 if (!s) return null;
 if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
 else s = s.replace(',', '.');
 if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
 const n = Number(s);
 return Number.isFinite(n) ? n : null;
}

const near = (a, b, tol) => Math.abs(a - b) <= tol + 1e-9;

// Formuła do porównania: wielkie litery, bez spacji, ; zamiast , (separator w polskim Excelu), proste cudzysłowy.
export function normFormula(raw) {
 let s = String(raw ?? '').trim().replace(/[“”„″]/g, '"').replace(/\s+/g, '');
 s = s.toLocaleUpperCase('pl');
 return s.replace(/,/g, ';');
}

export function normText(raw) {
 return String(raw ?? '').trim().toLocaleLowerCase('pl').replace(/\s+/g, ' ').replace(/[.!]$/, '');
}

const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

export function formatNumber(n) {
 const [int, frac] = Math.abs(n).toString().split('.');
 const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
 return (n < 0 ? '−' : '') + grouped + (frac ? ',' + frac : '');
}

export function answerText(task) {
 if (task.kind === 'formula' || task.kind === 'text') return task.answer;
 return formatNumber(task.answer) + (task.unit ? (task.unit === '%' ? '%' : ' ' + task.unit) : '');
}

// Ocena jednej odpowiedzi. kind: 'ok' | 'trap' (znany błąd z diagnozą) | 'wrong' | 'invalid' (nie da się porównać)
export function evaluate(task, raw) {
 const input = String(raw ?? '').trim();
 if (!input) return {kind:'invalid', message:'Najpierw wpisz odpowiedź.'};
 if (task.kind === 'formula') {
  if (!input.startsWith('=')) return {kind:'invalid', message:'Formuła w Excelu zawsze zaczyna się od znaku =. Bez niego Excel potraktuje wpis jak zwykły tekst.'};
  const f = normFormula(input);
  const accepted = [task.answer, ...(task.accept || [])].map(normFormula);
  if (accepted.includes(f)) {
   const comma = /,/.test(input.replace(/"[^"]*"/g, ''));
   return {kind:'ok', message:comma ? 'Dobrze. Uwaga: w polskim Excelu argumenty funkcji oddzielasz średnikiem (;), a przecinek jest separatorem dziesiętnym.' : ''};
  }
  const trap = (task.traps || []).find(t => t.formula && normFormula(t.formula) === f);
  if (trap) return {kind:'trap', message:trap.feedback};
  return {kind:'wrong', message:task.wrong || 'To nie ta formuła. Sprawdź adresy komórek i znaki $.'};
 }
 if (task.kind === 'text') {
  const t = strip(normText(input));
  const accepted = [task.answer, ...(task.accept || [])].map(a => strip(normText(a)));
  if (accepted.includes(t)) return {kind:'ok', message:''};
  const trap = (task.traps || []).find(x => x.text !== undefined && [].concat(x.text).map(a => strip(normText(a))).includes(t));
  if (trap) return {kind:'trap', message:trap.feedback};
  return {kind:'wrong', message:task.wrong || 'To nie ta odpowiedź. Spójrz jeszcze raz na dane lub wykres.'};
 }
 const n = parseNumber(input);
 if (n === null) return {kind:'invalid', message:'Wpisz samą liczbę, np. 1234,5. Możesz użyć przecinka. Jednostki nie są potrzebne.'};
 const tol = task.tol ?? 0.005;
 if (near(n, task.answer, tol) || (task.alt || []).some(a => near(n, a.value, a.tol ?? tol))) return {kind:'ok', message:''};
 const trap = (task.traps || []).find(t => t.value !== undefined && [].concat(t.value).some(v => near(n, v, t.tol ?? tol)));
 if (trap) return {kind:'trap', message:trap.feedback};
 return {kind:'wrong', message:task.wrong || 'To nie ta wartość. Sprawdź formułę w komórce i zakres, który zaznaczasz.'};
}

// Stan zadania: {input, tries, solved, first, revealed, last:{kind,message}}
export function answerTask(prev = {}, task, raw) {
 if (prev.solved || prev.revealed) return prev;
 const res = evaluate(task, raw);
 if (res.kind === 'invalid') return {...prev, input:raw, last:res};
 const tries = (prev.tries || 0) + 1;
 if (res.kind === 'ok') return {...prev, input:raw, tries, solved:true, first:tries === 1, last:res};
 return {...prev, input:raw, tries, last:res};
}

export function revealTask(prev = {}) {
 if (prev.solved || prev.revealed || (prev.tries || 0) < REVEAL_AFTER) return prev;
 return {...prev, revealed:true};
}

export function taskPoints(st = {}) {
 return st.solved ? (st.first ? 1 : 0.5) : 0;
}

export function sheetResult(data, value = {}) {
 const tasks = value.tasks || {};
 const max = data.tasks.length;
 const score = data.tasks.reduce((s, t) => s + taskPoints(tasks[t.id]), 0);
 const closed = data.tasks.filter(t => tasks[t.id]?.solved || tasks[t.id]?.revealed).length;
 const solved = data.tasks.filter(t => tasks[t.id]?.solved).length;
 const label = data.summaryLabel || (data.phase === 'predict' ? 'Przewidywania' : 'Wyniki z pliku');
 return {done:closed === max, score, max, summary:`${label}: ${solved}/${max} poprawnie`};
}

export function setTask(data, value = {}, taskId, next) {
 const tasks = {...(value.tasks || {}), [taskId]:next};
 return {...value, tasks, ...sheetResult(data, {...value, tasks})};
}
