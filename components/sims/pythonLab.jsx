import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Icon} from '../icons.jsx';
import './pythonLab.css';
import {CodeEditor, CodeView, CodeLine} from './python/CodeEditor.jsx';
import {ensurePython, runPython, subscribe, pythonState} from './python/runtime.js';
import {labResult, labMax, codeScore, parsonsScore, explainError, STOP_MESSAGES, compareOutput, checkQuestion,
  parsonsBlocks, parsonsPool, parsonsCode, parsonsReview, sourceChecks, MAX_TRACE_STEPS} from '../../content/sims/pythonLab.js';

const pts = n => String(n).replace('.', ',');
const MODE_LABEL = {code: 'Programujesz', parsons: 'Układanka z kodu', trace: 'Śledzenie krok po kroku', predict: 'Przewidź wynik'};
const MODE_ICON = {code: 'code', parsons: 'list', trace: 'search', predict: 'idcard'};

/** Tekst z `kodem` w odwrotnych apostrofach i akapitami rozdzielonymi pustą linią. */
function Rich({text}) {
  if (!text) return null;
  return String(text).split(/\n\n+/).map((para, i) => <p key={i}>{para.split(/(`[^`]+`)/).map((part, j) => part.startsWith('`') && part.endsWith('`') && part.length > 1 ? <code key={j} className="pl-inline">{part.slice(1, -1)}</code> : <React.Fragment key={j}>{part}</React.Fragment>)}</p>);
}

function usePython(base) {
  const [st, setSt] = useState(pythonState());
  useEffect(() => {
    const off = subscribe(setSt);
    ensurePython(base ? `${base}pyodide/` : undefined).catch(() => {});
    return off;
  }, [base]);
  return st;
}

function PyStatus({st}) {
  if (st.status === 'ready') return <p className="pl-status is-ready"><Icon name="check" size={16}/>Python {st.python} działa w Twojej przeglądarce — nic nie jest wysyłane do internetu.</p>;
  if (st.status === 'error') return <p className="pl-status is-error" role="alert"><Icon name="warning" size={16}/>{st.error}</p>;
  const text = st.status === 'restarting' ? 'Restartuję Pythona po zatrzymaniu programu…' : 'Uruchamiam Pythona… (pierwszy raz może potrwać kilkanaście sekund)';
  return <p className="pl-status is-loading" role="status"><span className="pl-spinner" aria-hidden="true"/>{text}</p>;
}

/** Wynik uruchomienia: błąd po polsku, limit czasu, brak danych. */
function Outcome({r, code}) {
  if (!r) return null;
  let box = null;
  if (r.fatal) box = {title: 'Python nie wystartował', hint: r.fatal};
  else if (r.timeout) box = STOP_MESSAGES.timeout;
  else if (r.error) box = explainError(r.error, code);
  else if (r.stop && r.stop !== 'steps') box = STOP_MESSAGES[r.stop];
  if (!box) return null;
  return <div className="pl-error" role="alert">
    <Icon name="warning" size={22}/>
    <div>
      <strong>{box.title}</strong>
      {box.line && <p className="pl-error-line">Linia {box.line}{box.lineText && <>: <code><CodeLine line={box.lineText}/></code></>}</p>}
      <p>{box.hint}</p>
      {box.short && <details><summary>Komunikat Pythona (po angielsku)</summary><pre>{box.short}</pre></details>}
    </div>
  </div>;
}

function Console({text, label = 'Konsola — to wypisał program', empty = '(program nic nie wypisał)'}) {
  return <div className="pl-console-box">
    <p className="pl-panel-title"><Icon name="desktop" size={16}/>{label}</p>
    <pre className="pl-console" tabIndex={0} aria-label={label}>{text ? text : <span className="pl-console-empty">{empty}</span>}</pre>
  </div>;
}

function TestList({tests, count}) {
  if (!tests) return <div className="pl-tests-box"><p className="pl-panel-title"><Icon name="check" size={16}/>Testy ({count})</p><p className="small muted pl-tests-empty">Kliknij „Sprawdź”, a Python uruchomi {count} {count === 1 ? 'test' : count < 5 ? 'testy' : 'testów'} Twojego kodu.</p></div>;
  const ok = tests.filter(t => t.ok).length;
  return <div className="pl-tests-box">
    <p className="pl-panel-title"><Icon name="check" size={16}/>Testy: {ok}/{tests.length} zaliczonych</p>
    <ol className="pl-tests">{tests.map((t, i) => {
      const err = t.error ? explainError(t.error) : t.stop ? STOP_MESSAGES[t.stop] : null;
      return <li key={i} className={t.ok ? 'is-ok' : 'is-bad'}>
        <span className="pl-test-mark" aria-hidden="true">{t.ok ? '✓' : '✗'}</span>
        <div>
          <span className="pl-sr">{t.ok ? 'Zaliczony: ' : 'Niezaliczony: '}</span>
          {t.label && <b className="pl-test-label">{t.label}</b>}
          {t.call && <code className="pl-test-call">{t.call}</code>}
          {t.stdin?.length > 0 && <span className="pl-test-io">dane: <code>{t.stdin.join(' ⏎ ')}</code></span>}
          {t.source ? (!t.ok && t.hint && <span className="pl-test-io">{t.hint}</span>) : <span className="pl-test-io">
            {t.expected !== undefined && <>oczekiwano <code>{String(t.expected).replace(/\n/g, ' ⏎ ')}</code></>}
            {err ? <> · <em>{err.title}</em>{t.error?.message ? <> (<code>{t.error.type}: {t.error.message}</code>)</> : null}</> : t.got !== undefined && !t.stdin && <> · otrzymano <code>{t.got}</code></>}
          </span>}
        </div>
      </li>;
    })}</ol>
  </div>;
}

function Hints({data, v, save, done}) {
  const hints = data.hints || [];
  if (!hints.length) return null;
  const used = v.hints || 0;
  return <div className="pl-hints">
    {used > 0 && <ol className="pl-hint-list">{hints.slice(0, used).map((h, i) => <li key={i}><Icon name="book" size={18}/><div><b>Podpowiedź {i + 1}:</b> <Rich text={h}/></div></li>)}</ol>}
    {used < hints.length && <button type="button" className="text-button" onClick={() => save({hints: used + 1})}><Icon name="book" size={18}/>Podpowiedź {used + 1} z {hints.length}{!done && data.points ? ' (trochę mniej punktów)' : ''}</button>}
  </div>;
}

function Questions({data, v, save}) {
  const qs = data.questions || [];
  const [drafts, setDrafts] = useState({});
  if (!qs.length) return null;
  function answer(i, ans) {
    const q = v.q?.[i] || {};
    if (q.ok) return;
    const ok = checkQuestion(qs[i], ans);
    save({q: {...(v.q || {}), [i]: {sel: ans, ok, first: !q.tries && ok, tries: (q.tries || 0) + 1}}});
  }
  return <div className="pl-questions">
    {qs.map((qq, i) => {
      const st = v.q?.[i] || {};
      const id = `${data.id}-q${i}`;
      return <fieldset key={i} className={`pl-q ${st.ok ? 'is-ok' : ''}`}>
        <legend><span className="pl-q-num">{st.ok ? '✓' : i + 1}</span><span>{qq.q}</span>{st.ok && <em>+{pts(st.first ? 1 : 0.5)} pkt</em>}</legend>
        {qq.options ? <div className="pl-q-options">{qq.options.map((o, j) => <button type="button" key={j} className={`choice ${st.sel === j ? 'selected' : ''}`} aria-pressed={st.sel === j} disabled={st.ok && st.sel !== j} onClick={() => answer(i, j)}><span className="choice-letter">{String.fromCharCode(65 + j)}</span><span><CodeOr text={o}/></span></button>)}</div>
          : <form className="pl-q-text" onSubmit={e => { e.preventDefault(); answer(i, drafts[i] ?? ''); }}>
            <label htmlFor={id}>{qq.inputLabel || 'Twoja odpowiedź'}</label>
            <input id={id} autoComplete="off" spellCheck={false} disabled={st.ok} value={drafts[i] ?? (st.ok ? st.sel : '')} onChange={e => setDrafts({...drafts, [i]: e.target.value})}/>
            {!st.ok && <button className="btn secondary" type="submit">Sprawdź</button>}
          </form>}
        {st.tries > 0 && <div className={`pl-feedback ${st.ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={st.ok ? 'check' : 'warning'} size={18}/><span>{st.ok ? qq.explain : `Jeszcze nie. ${qq.hint || 'Wróć do programu i sprawdź jeszcze raz.'}`}</span></div>}
      </fieldset>;
    })}
  </div>;
}
function CodeOr({text}) { return /^`.*`$/.test(text) ? <code className="pl-inline">{text.slice(1, -1)}</code> : <Rich text={text}/>; }

function SolutionBox({data, v, save, done, onInsert}) {
  if (!data.solution) return null;
  const hintsUsed = (v.hints || 0) >= (data.hints?.length || 0);
  if (done || v.solutionShown) return <details className="pl-solution" open={v.solutionShown && !done ? true : undefined}>
    <summary><Icon name="book" size={18}/>{done ? 'Porównaj z rozwiązaniem wzorcowym' : 'Rozwiązanie wzorcowe'}</summary>
    <CodeView code={data.solution} label="Rozwiązanie wzorcowe"/>
    {!done && onInsert && <button type="button" className="btn secondary" onClick={onInsert}>Wstaw do edytora i sprawdź sam</button>}
    {done && <p className="small muted">Twój kod może wyglądać inaczej — liczy się, że przechodzi testy.</p>}
  </details>;
  if (!(hintsUsed && (v.fails || 0) >= 2)) return null;
  return <p className="pl-solution-offer">Nie wychodzi? <button type="button" className="text-button" onClick={() => save({solutionShown: true})}>Pokaż rozwiązanie wzorcowe</button> <span className="small muted">(zadanie da wtedy najwyżej ¼ punktów)</span></p>;
}

/* ───────── Tryb „code”: edytor + Uruchom + Sprawdź ───────── */
function CodeMode({data, v, save, py}) {
  const code = v.code ?? data.starter ?? '';
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);
  const tests = data.tests || [];
  const hasTests = tests.length > 0 || data.sourceChecks?.length > 0;
  const stdinText = v.stdin ?? (data.stdin || []).join('\n');
  const stdin = stdinText === '' ? [] : stdinText.replace(/\r/g, '').split('\n');
  const total = tests.length + (data.sourceChecks?.length || 0);
  const errLine = result?.error?.line || null;

  async function run() {
    if (busy) return;
    setBusy('run'); setMsg(null);
    const r = await runPython({code, stdin}, {timeoutMs: data.timeoutMs});
    setResult(r); setBusy('');
    const clean = !r.fatal && !r.timeout && !r.error && !r.stop;
    if (!hasTests && clean && !v.ranOk) save({ranOk: true});
    if (!hasTests && clean) setMsg({ok: true, text: data.successText || 'Program zadziałał bez błędów.'});
  }
  async function check() {
    if (busy) return;
    setBusy('check'); setMsg(null);
    const src = sourceChecks(code, data.sourceChecks);
    const r = await runPython({code, stdin, tests}, {timeoutMs: data.timeoutMs});
    setResult(r); setBusy('');
    const ranTests = (r.tests || []).length === tests.length;
    const all = [...(r.tests || []), ...src];
    const passed = all.filter(t => t.ok).length;
    const pyOk = !r.fatal && !r.timeout && !r.error && (!r.stop || r.stop === 'input');
    const lastTests = pyOk && ranTests ? all : null;
    if (pyOk && ranTests && passed === total) {
      if (v.passedAll) { save({lastTests}); setMsg({ok: true, text: 'Nadal wszystko działa. 👍'}); return; }
      const solvedScore = codeScore(data.points || 0, v);
      save({passedAll: true, solvedScore, bestPassed: total, lastTests});
      setMsg({ok: true, text: `Wszystkie testy zaliczone (${total}/${total})! +${pts(solvedScore)} pkt. ${data.successText || ''}`.trim()});
      return;
    }
    if (!pyOk) { save({lastTests: null}); setMsg({ok: false, text: 'Testy nie ruszyły, bo program zatrzymał się na błędzie. Popraw go (opis niżej) i kliknij „Sprawdź” ponownie. Takie próby nie odejmują punktów.'}); return; }
    save({fails: v.passedAll ? v.fails : (v.fails || 0) + 1, bestPassed: Math.max(v.bestPassed || 0, passed), lastTests});
    setMsg({ok: false, text: `Zaliczone testy: ${passed}/${total}. Spójrz na testy z ✗: co było oczekiwane, a co zwrócił Twój kod?${(v.fails || 0) >= 1 && data.hints?.length && (v.hints || 0) < data.hints.length ? ' Możesz wziąć podpowiedź.' : ''}`});
  }

  return <div className="pl-code">
    <div className="pl-toolbar">
      <button type="button" className="btn" onClick={run} disabled={!!busy}><Icon name="play" size={18}/>{busy === 'run' ? (py.status === 'ready' ? 'Działa…' : 'Czekam na Pythona…') : 'Uruchom'}</button>
      {hasTests && <button type="button" className="btn pl-btn-check" onClick={check} disabled={!!busy}><Icon name="check" size={18}/>{busy === 'check' ? 'Sprawdzam…' : `Sprawdź (${total} ${total === 1 ? 'test' : total < 5 ? 'testy' : 'testów'})`}</button>}
      <button type="button" className="text-button pl-reset" onClick={() => { if (code === (data.starter || '') || window.confirm('Przywrócić kod startowy? Twoje zmiany znikną.')) { save({code: data.starter || ''}); setResult(null); setMsg(null); } }}><Icon name="reset" size={18}/>Kod startowy</button>
    </div>
    <CodeEditor id={`${data.id}-editor`} value={code} onChange={c => save({code: c})} errorLine={errLine} label={`Edytor kodu: ${data.title}`} describedBy={`${data.id}-keys`} onRun={run}/>
    <p className="pl-keys" id={`${data.id}-keys`}>Tab — wcięcie · Shift+Tab — cofnij wcięcie · Ctrl+Enter — uruchom · Esc, potem Tab — wyjście z edytora</p>
    {data.input && <label className="pl-stdin"><span><Icon name="idcard" size={16}/>Dane wejściowe — każda linia to jedno <code className="pl-inline">input()</code></span>
      <textarea rows={Math.max(2, stdin.length)} value={stdinText} spellCheck={false} onChange={e => save({stdin: e.target.value})}/></label>}
    {msg && <div className={`pl-feedback ${msg.ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={msg.ok ? 'trophy' : 'warning'} size={20}/><span>{msg.text}</span></div>}
    <Outcome r={result} code={code}/>
    <div className={`pl-panels ${hasTests ? '' : 'is-single'}`}>
      <Console text={result?.stdout || ''} empty={result ? '(program nic nie wypisał)' : '(kliknij „Uruchom”)'}/>
      {hasTests && <TestList tests={v.lastTests} count={total}/>}
    </div>
    <Hints data={data} v={v} save={save} done={v.passedAll}/>
    <SolutionBox data={data} v={v} save={save} done={v.passedAll} onInsert={() => save({code: data.solution})}/>
  </div>;
}

/* ───────── Tryb „parsons”: układanka z linii kodu ───────── */
function ParsonsMode({data, v, save}) {
  const blocks = useMemo(() => Object.fromEntries(parsonsBlocks(data).map(b => [b.id, b])), [data]);
  const order = useMemo(() => parsonsPool(data), [data]);
  const program = v.program || [];
  const used = new Set(program.map(p => p.id));
  const pool = order.filter(id => !used.has(id));
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [focusKey, setFocusKey] = useState(null);
  const listRef = useRef(null);
  useEffect(() => {
    if (!focusKey || !listRef.current) return;
    listRef.current.querySelector(`[data-focus="${focusKey}"]`)?.focus();
    setFocusKey(null);
  }, [focusKey]);
  const done = !!v.passedAll;
  const setProgram = p => save({program: p});
  const add = id => setProgram([...program, {id, indent: program.length ? Math.min(program[program.length - 1].indent + (blocks[program[program.length - 1].id].text.endsWith(':') ? 1 : 0), 4) : 0}]);
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= program.length) return; const p = [...program]; [p[i], p[j]] = [p[j], p[i]]; setProgram(p); setFocusKey(`${p[j].id}-${d < 0 ? 'up' : 'down'}`); };
  const indent = (i, d) => { const p = [...program]; p[i] = {...p[i], indent: Math.max(0, Math.min(5, (p[i].indent || 0) + d))}; setProgram(p); };
  const remove = i => setProgram(program.filter((_, k) => k !== i));

  async function check() {
    if (busy || done) return;
    const review = parsonsReview(data, program);
    if (!program.length) { setMsg({ok: false, text: 'Program jest pusty. Klikaj linie z górnej ramki, żeby dodać je do programu.'}); return; }
    if (review.missing > 0) { setMsg({ok: false, text: review.distractors ? 'W programie jest linia-pułapka, a w ramce „Rozsypane linie” została linia, której brakuje. Porównaj je i zamień (✕ usuwa linię z programu).' : `Brakuje jeszcze ${review.missing} ${review.missing === 1 ? 'linii' : 'linii'} — przenieś je z ramki „Rozsypane linie”.${data.distractors?.length ? ' Uwaga: jedna linia w ramce to pułapka i nie jest potrzebna.' : ''}`}); return; }
    setBusy(true);
    const code = parsonsCode(data, program);
    const r = await runPython({code, tests: data.tests || []}, {timeoutMs: data.timeoutMs});
    setBusy(false); setResult(r);
    const tests = r.tests || [];
    const all = !r.error && !r.timeout && !r.fatal && tests.length === (data.tests || []).length && tests.every(t => t.ok);
    if (all) {
      const solvedScore = parsonsScore(data.points || 0, v.fails || 0, v.hints || 0);
      save({passedAll: true, solvedScore, lastTests: tests});
      setMsg({ok: true, text: `Układanka ułożona i przechodzi testy (${tests.length}/${tests.length})! +${pts(solvedScore)} pkt. ${data.successText || ''}`.trim()});
      return;
    }
    const fails = (v.fails || 0) + 1;
    save({fails, lastTests: tests.length ? tests : null});
    const where = review.firstDiff >= 0 ? review.firstDiff : null;
    let text = review.distractors ? 'W programie jest linia-pułapka. Która linia spowoduje błąd lub zły wynik? Zamień ją na właściwą.' : 'Program jeszcze nie działa poprawnie.';
    if (where !== null && fails >= 1) {
      const b = parsonsBlocks(data).filter(x => !x.distractor)[where];
      const p = program[where];
      if (fails >= 2 && b && p && blocks[p.id]?.text === b.text) text += ` Linia ${where + 1} stoi dobrze, ale ma złe wcięcie — powinna mieć ${b.indent} ${b.indent === 1 ? 'poziom' : 'poziomy'} wcięcia.`;
      else if (fails >= 2 && b) text += ` Na pozycji ${where + 1} powinna stać linia: ${b.text}`;
      else text += ` Pierwsza linia do sprawdzenia: nr ${where + 1} (kolejność albo wcięcie).`;
    }
    setMsg({ok: false, text});
  }

  return <div className="pl-parsons">
    <div className="pl-pool-box">
      <p className="pl-panel-title"><Icon name="list" size={16}/>Rozsypane linie — kliknij, aby dodać na koniec programu</p>
      {pool.length ? <ul className="pl-pool">{pool.map(id => <li key={id}><button type="button" disabled={done} onClick={() => add(id)} aria-label={`Dodaj linię: ${blocks[id].text}`}><Icon name="right" size={16}/><code><CodeLine line={blocks[id].text}/></code></button></li>)}</ul>
        : <p className="small muted">Wszystkie linie są w programie.</p>}
    </div>
    <div className="pl-program-box">
      <p className="pl-panel-title"><Icon name="code" size={16}/>Twój program — ustaw kolejność (↑ ↓) i wcięcia (← →)</p>
      {program.length === 0 && <p className="pl-program-empty">Tu pojawią się linie, które wybierzesz. Zacznij od linii, która nie ma wcięcia.</p>}
      <ol className="pl-program" ref={listRef}>{program.map((p, i) => {
        const b = blocks[p.id];
        return <li key={p.id} className={result?.error?.line === i + 1 ? 'is-error' : ''}>
          <span className="pl-program-num" aria-hidden="true">{i + 1}</span>
          <code className="pl-program-code" style={{'--indent': p.indent || 0}}>{Array.from({length: p.indent || 0}, (_, k) => <i key={k} className="pl-guide" aria-hidden="true"/>)}<span className="pl-program-text"><CodeLine line={b.text}/></span></code>
          {!done && <span className="pl-program-tools">
            <button type="button" onClick={() => indent(i, -1)} disabled={!p.indent} aria-label={`Zmniejsz wcięcie linii ${i + 1}`} title="Zmniejsz wcięcie">←</button>
            <button type="button" onClick={() => indent(i, 1)} disabled={(p.indent || 0) >= 5} aria-label={`Zwiększ wcięcie linii ${i + 1}`} title="Zwiększ wcięcie">→</button>
            <button type="button" data-focus={`${p.id}-up`} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Przesuń linię ${i + 1} w górę`} title="W górę">↑</button>
            <button type="button" data-focus={`${p.id}-down`} onClick={() => move(i, 1)} disabled={i === program.length - 1} aria-label={`Przesuń linię ${i + 1} w dół`} title="W dół">↓</button>
            <button type="button" onClick={() => remove(i)} aria-label={`Usuń linię ${i + 1} z programu`} title="Usuń z programu">✕</button>
          </span>}
        </li>;
      })}</ol>
      {!done && <div className="pl-toolbar">
        <button type="button" className="btn pl-btn-check" onClick={check} disabled={busy}><Icon name="check" size={18}/>{busy ? 'Sprawdzam…' : 'Sprawdź układankę'}</button>
        {program.length > 0 && <button type="button" className="text-button" onClick={() => { setProgram([]); setResult(null); setMsg(null); }}><Icon name="reset" size={18}/>Wyczyść program</button>}
      </div>}
    </div>
    {msg && <div className={`pl-feedback ${msg.ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={msg.ok ? 'trophy' : 'warning'} size={20}/><span>{msg.text}</span></div>}
    <Outcome r={result} code={parsonsCode(data, program)}/>
    {(v.lastTests || result?.stdout) && <div className="pl-panels">{result?.stdout ? <Console text={result.stdout}/> : null}<TestList tests={v.lastTests} count={(data.tests || []).length}/></div>}
    <Hints data={data} v={v} save={save} done={done}/>
  </div>;
}

/* ───────── Tryb „trace”: śledzenie wykonania ───────── */
function VarTable({title, vars, prev}) {
  const names = Object.keys(vars || {});
  if (!names.length) return null;
  return <table className="pl-vars"><caption>{title}</caption><thead><tr><th scope="col">Zmienna</th><th scope="col">Wartość</th></tr></thead>
    <tbody>{names.map(n => {
      const changed = !prev || !prev[n] ? 'new' : prev[n].r !== vars[n].r ? 'changed' : '';
      return <tr key={n} className={changed ? `is-${changed}` : ''}><th scope="row">{n}{changed && <small>{changed === 'new' ? ' nowa' : ' zmiana'}</small>}</th><td><code>{vars[n].r}</code></td></tr>;
    })}</tbody></table>;
}
function ListViz({name, item, vars, pointers}) {
  const marks = {};
  for (const p of pointers || []) {
    const val = vars[p.var];
    const n = val && val.t === 'int' ? Number(val.r) : NaN;
    if (!Number.isInteger(n)) continue;
    for (let k = 0; k < (p.span || 1); k++) { const idx = n + k; if (idx >= 0 && idx < item.items.length) (marks[idx] ||= []).push(k ? `${p.var}+${k}` : p.var); }
  }
  return <figure className="pl-list">
    <figcaption><code>{name}</code></figcaption>
    <ol>{item.items.map((x, i) => <li key={i} className={marks[i] ? 'is-marked' : ''}><b>{x}</b><small>[{i}]</small>{marks[i] && <em>{marks[i].join(', ')}</em>}</li>)}</ol>
  </figure>;
}
function TraceMode({data, v, save, py}) {
  const [code, setCode] = useState(v.code ?? data.code ?? data.starter ?? '');
  const [editing, setEditing] = useState(false);
  const [res, setRes] = useState(null);
  const [k, setK] = useState(0);
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  async function trace(src = code) {
    setBusy(true);
    const r = await runPython({code: src, trace: true, maxSteps: data.maxSteps || MAX_TRACE_STEPS}, {timeoutMs: data.timeoutMs || 4000});
    setBusy(false); setRes(r); setK(0);
  }
  useEffect(() => { if (py.status === 'ready' && !started.current) { started.current = true; trace(); } }, [py.status]);
  const steps = res?.steps || [];
  const n = steps.length;
  const step = steps[Math.min(k, n - 1)];
  const prevStep = k > 0 ? steps[k - 1] : null;
  useEffect(() => { if (n && k === n - 1 && !v.visitedEnd) save({visitedEnd: true}); }, [k, n]);
  const go = i => setK(Math.max(0, Math.min(n - 1, i)));
  const allVars = step ? {...step.g, ...(step.l || {})} : {};
  const lists = Object.entries(allVars).filter(([name, it]) => it.items && (!data.listVars || data.listVars.includes(name)));
  let caption = '';
  if (step) {
    if (step.ev === 'end') caption = res.error ? 'Program zatrzymał się na błędzie.' : 'Koniec programu. Tak wyglądają zmienne na końcu.';
    else if (step.ev === 'return') caption = `Funkcja ${step.fn}() kończy się i zwraca ${step.ret}.`;
    else caption = `Teraz wykona się linia ${step.line}${step.fn !== '<module>' ? ` (w funkcji ${step.fn})` : ''}. Zmienne pokazują stan PRZED jej wykonaniem.`;
  }
  return <div className="pl-trace">
    <div className="pl-toolbar pl-trace-controls" role="group" aria-label="Sterowanie śledzeniem">
      <button type="button" className="btn secondary" onClick={() => go(0)} disabled={!n || k === 0} aria-label="Początek">⏮<span className="pl-hide-sm"> Start</span></button>
      <button type="button" className="btn secondary" onClick={() => go(k - 1)} disabled={!n || k === 0}><Icon name="left" size={18}/>Wstecz</button>
      <button type="button" className="btn" onClick={() => go(k + 1)} disabled={!n || k >= n - 1}>Krok dalej<Icon name="right" size={18}/></button>
      <button type="button" className="btn secondary" onClick={() => go(n - 1)} disabled={!n || k >= n - 1} aria-label="Koniec"><span className="pl-hide-sm">Koniec </span>⏭</button>
      <label className="pl-slider"><span>Krok {n ? k + 1 : 0} / {n}</span><input type="range" min={0} max={Math.max(0, n - 1)} value={Math.min(k, Math.max(0, n - 1))} disabled={!n} onChange={e => go(Number(e.target.value))}/></label>
    </div>
    <p className="pl-trace-caption" aria-live="polite">{busy ? 'Śledzę program…' : n ? caption : py.status === 'ready' ? '' : 'Czekam na Pythona…'}</p>
    <div className="pl-trace-grid">
      <div className="pl-trace-code">
        {editing ? <>
          <CodeEditor id={`${data.id}-editor`} value={code} onChange={setCode} label="Edytuj kod do śledzenia"/>
          <div className="pl-toolbar"><button type="button" className="btn" onClick={() => { setEditing(false); save({code}); trace(code); }} disabled={busy}><Icon name="play" size={18}/>Prześledź ten kod</button>
            <button type="button" className="text-button" onClick={() => { const c = data.code ?? data.starter ?? ''; setCode(c); setEditing(false); save({code: c}); trace(c); }}><Icon name="reset" size={18}/>Przywróć przykład</button></div>
        </> : <>
          <CodeView code={code} current={step?.ev !== 'end' ? step?.line : null} previous={prevStep?.ev === 'line' ? prevStep.line : null} errorLine={step?.ev === 'end' ? res?.error?.line : null}/>
          <p className="pl-legend small muted"><b>➜</b> wykona się teraz · <b>✓</b> wykonana przed chwilą{data.editable !== false && <> · <button type="button" className="text-button" onClick={() => setEditing(true)}>Zmień kod i sprawdź, co się stanie</button></>}</p>
        </>}
      </div>
      <div className="pl-trace-state">
        {lists.map(([name, it]) => <ListViz key={name} name={name} item={it} vars={allVars} pointers={data.pointers}/>)}
        {step?.l && <VarTable title={`Zmienne w funkcji ${step.fn}()`} vars={step.l} prev={prevStep?.fn === step.fn ? prevStep.l : null}/>}
        <VarTable title={step?.l ? 'Zmienne globalne' : 'Zmienne'} vars={step?.g} prev={prevStep?.g}/>
        {step && !Object.keys(allVars).length && <p className="small muted">Jeszcze nie ma żadnych zmiennych.</p>}
        <Console text={step ? (res.stdout || '').slice(0, step.out) : ''} label="Konsola do tego kroku" empty="(nic jeszcze nie wypisano)"/>
      </div>
    </div>
    {res?.stop === 'steps' && <p className="small muted">{STOP_MESSAGES.steps.hint}</p>}
    <Outcome r={res && (res.error || res.timeout || res.fatal) ? res : null} code={code}/>
  </div>;
}

/* ───────── Tryb „predict”: przewidź, potem uruchom ───────── */
const CONFIDENCE = [['sure', 'Na pewno'], ['think', 'Chyba tak'], ['guess', 'Strzelam']];
function PredictMode({data, v, save}) {
  const code = data.code ?? data.starter ?? '';
  const p = v.predict || {};
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const id = `${data.id}-predict`;
  async function runAndCompare() {
    if (!p.text?.trim() || busy) return;
    setBusy(true);
    const r = await runPython({code, stdin: data.stdin || []}, {timeoutMs: data.timeoutMs});
    setBusy(false); setResult(r);
    if (r.fatal || r.timeout) return;
    const cmp = compareOutput(p.text, r.stdout);
    save({predict: {...p, checked: true, ok: cmp.ok, real: r.stdout}});
  }
  const real = p.checked ? (p.real ?? result?.stdout ?? '') : null;
  const cmp = p.checked ? compareOutput(p.text, real) : null;
  const meta = p.checked ? (cmp.ok ? (p.confidence === 'guess' ? 'Strzał w dziesiątkę — ale następnym razem spróbuj to wyliczyć linia po linii, a nie zgadywać.' : 'Trafione. Umiesz czytać kod jak komputer.')
    : (p.confidence === 'sure' ? 'Pewność była duża, a wynik jest inny — to najcenniejszy moment lekcji. Znajdź linię, która Cię zaskoczyła.' : 'Nie szkodzi — porównaj linie z ✗ i znajdź w kodzie miejsce, które je tworzy.')) : '';
  return <div className="pl-predict">
    <CodeView code={code} label="Program do przewidzenia"/>
    {!p.checked ? <div className="pl-predict-form">
      <label htmlFor={id} className="pl-predict-label">Co pojawi się na ekranie? Wpisz dokładnie, linia po linii.</label>
      <textarea id={id} rows={data.predictRows || 3} spellCheck={false} value={p.text || ''} onChange={e => save({predict: {...p, text: e.target.value}})} placeholder="Twoje przewidywanie…"/>
      <fieldset className="pl-confidence"><legend>Jak bardzo jesteś pewna/pewny?</legend>
        {CONFIDENCE.map(([k, l]) => <button type="button" key={k} aria-pressed={p.confidence === k} className={p.confidence === k ? 'is-on' : ''} onClick={() => save({predict: {...p, confidence: k}})}>{l}</button>)}
      </fieldset>
      <button type="button" className="btn" disabled={!p.text?.trim() || busy} onClick={runAndCompare}><Icon name="play" size={18}/>{busy ? 'Uruchamiam…' : 'Uruchom i porównaj'}</button>
      {!p.text?.trim() && <p className="small muted">Najpierw wpisz przewidywanie — dopiero wtedy uruchomisz program.</p>}
    </div> : <div className="pl-compare">
      <div className={`pl-feedback ${cmp.ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={cmp.ok ? 'trophy' : 'search'} size={20}/><span><b>{cmp.ok ? `Dokładnie tak! +${pts(data.points || 0)} pkt.` : `Zgodne linie: ${cmp.matched}/${cmp.total}. +${pts(Math.round((data.points || 0) * 0.5 * 2) / 2)} pkt za porównanie.`}</b> {meta}</span></div>
      <table className="pl-compare-table"><caption className="pl-sr">Porównanie przewidywania z wynikiem programu</caption><thead><tr><th scope="col">#</th><th scope="col">Twoje przewidywanie</th><th scope="col">Wynik programu</th><th scope="col"><span className="pl-sr">Zgodność</span></th></tr></thead>
        <tbody>{cmp.lines.map((l, i) => <tr key={i} className={l.ok ? 'is-ok' : 'is-bad'}><td>{i + 1}</td><td><code>{l.mine || '—'}</code></td><td><code>{l.real || '—'}</code></td><td>{l.ok ? '✓' : '✗'}<span className="pl-sr">{l.ok ? ' zgodne' : ' różne'}</span></td></tr>)}</tbody></table>
      {data.explain && <div className="pl-explain"><Icon name="book" size={18}/><div><Rich text={data.explain}/></div></div>}
    </div>}
    <Outcome r={result} code={code}/>
  </div>;
}

export default function PythonLab({data, value, onChange, answers, base}) {
  const v = value || {};
  const py = usePython(base);
  const res = labResult(data, v);
  const max = labMax(data);
  function save(patch) {
    const next = {...v, ...patch};
    const r = labResult(data, next);
    onChange({...next, done: r.done, score: r.score, max: r.max, summary: r.summary});
  }
  const req = data.requires ? answers?.[data.requires] : null;
  const locked = data.requires && !req?.done;
  const Mode = {code: CodeMode, parsons: ParsonsMode, trace: TraceMode, predict: PredictMode}[data.mode] || CodeMode;
  return <section className={`pl ${res.done ? 'is-done' : ''}`} aria-labelledby={`${data.id}-title`}>
    <header className="pl-bar">
      <span className="pl-dots" aria-hidden="true"><i/><i/><i/></span>
      <span className="pl-file"><Icon name={MODE_ICON[data.mode] || 'code'} size={16}/>{data.file || 'program.py'}</span>
      <span className="pl-mode">{MODE_LABEL[data.mode] || 'Python'}</span>
      {max > 0 && <span className="pl-score" aria-label={`Punkty: ${res.score} z ${max}`}>{res.done && <Icon name="check" size={16}/>}{pts(res.score)}/{max} pkt</span>}
    </header>
    <div className="pl-body">
      <h3 id={`${data.id}-title`} className="pl-title">{data.title}</h3>
      {locked ? <p className="pl-locked"><Icon name="lock" size={20}/>Ten poziom odblokuje się po zaliczeniu poprzedniego zadania{data.requiresTitle ? ` („${data.requiresTitle}”)` : ''}.</p> : <>
        <div className="pl-prompt"><Rich text={data.prompt}/></div>
        <PyStatus st={py}/>
        <Mode data={data} v={v} save={save} py={py}/>
        {data.questions?.length > 0 && <Questions data={data} v={v} save={save}/>}
        {res.done && data.doneText && <div className="pl-feedback is-ok pl-done" role="status"><Icon name="trophy" size={20}/><span>{data.doneText}</span></div>}
      </>}
    </div>
  </section>;
}
