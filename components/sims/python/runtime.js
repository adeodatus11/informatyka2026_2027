// Menedżer Pythona w przeglądarce: jeden Web Worker na stronę, ładowany dopiero w lekcjach z Pythonem.
// Limit czasu → worker.terminate() i nowy worker (pętla nieskończona nie zawiesza strony).
import {DEFAULT_TIMEOUT_MS} from '../../../content/sims/pythonLab.js';

let worker = null;
let ready = null;
let indexURL = null;
let seq = 0;
let queue = Promise.resolve();
const pending = new Map();
const listeners = new Set();
let state = {status: 'idle', restarts: 0, python: '', error: ''};

function set(patch) { state = {...state, ...patch}; for (const fn of listeners) fn(state); }
export function subscribe(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); }
export function pythonState() { return state; }

function start() {
  set({status: state.restarts ? 'restarting' : 'loading', error: ''});
  const w = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
  worker = w;
  ready = new Promise((resolve, reject) => {
    w.onmessage = e => {
      const m = e.data || {};
      if (m.type === 'ready') { set({status: 'ready', python: m.python}); resolve(); }
      else if (m.type === 'error') { fail(`Nie udało się uruchomić Pythona: ${m.message}`); reject(new Error(m.message)); }
      else if (m.type === 'result') { const p = pending.get(m.id); if (p) { pending.delete(m.id); p(m.result); } }
    };
    w.onerror = ev => { ev.preventDefault?.(); fail('Nie udało się uruchomić Pythona w tej przeglądarce. Odśwież stronę albo użyj aktualnego Chrome, Edge lub Firefoksa.'); reject(new Error('worker error')); };
  });
  ready.catch(() => {});
  w.postMessage({type: 'init', indexURL});
}
function fail(error) {
  set({status: 'error', error});
  try { worker?.terminate(); } catch { /* już zamknięty */ }
  worker = null; ready = null;
}

/** Rozpoczyna ładowanie Pyodide (idempotentne). url = adres katalogu z plikami Pyodide. */
export function ensurePython(url) {
  if (url && !indexURL) indexURL = url;
  if (!indexURL) indexURL = new URL('pyodide/', document.baseURI).href;
  if (!ready) start();
  return ready;
}

/**
 * Uruchamia kod. req = {code, stdin, tests, trace, maxSteps}. Zwraca wynik z workera
 * albo {timeout:true} po przekroczeniu limitu czasu, albo {fatal:'…'} gdy Python się nie załadował.
 */
export function runPython(req, {timeoutMs = DEFAULT_TIMEOUT_MS} = {}) {
  const job = queue.then(async () => {
    try { await ensurePython(); } catch { return {fatal: state.error || 'Python nie jest dostępny.'}; }
    const id = ++seq;
    set({running: true});
    const result = await new Promise(resolve => {
      const timer = setTimeout(() => {
        pending.delete(id);
        try { worker.terminate(); } catch { /* już zamknięty */ }
        worker = null; ready = null;
        set({restarts: state.restarts + 1});
        start();
        resolve({timeout: true, stdout: ''});
      }, timeoutMs);
      pending.set(id, r => { clearTimeout(timer); resolve(r); });
      worker.postMessage({type: 'run', id, req});
    });
    set({running: false});
    return result;
  });
  queue = job.catch(() => {});
  return job;
}
