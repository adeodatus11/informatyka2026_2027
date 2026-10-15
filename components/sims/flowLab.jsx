import React, {useMemo, useState} from 'react';
import {Icon} from '../icons.jsx';
import './flowLab.css';
import {orderOptions, optionKey} from './optionOrder.js';
import {SPECS, judgeCase, flowResult, flowMax, runChart, checkFill, blockText, blockBox, chartSize, chartEdges, chartOutline,
  substitute, show} from '../../content/sims/flowLab.js';

const pts = n => String(n).replace('.', ',');
const MODE_LABEL = {tests: 'Projektant testów', trace: 'Schemat krok po kroku', fill: 'Uzupełnij schemat'};
const MODE_ICON = {tests: 'check', trace: 'search', fill: 'list'};

function Rich({text}) {
  if (!text) return null;
  return String(text).split(/\n\n+/).map((para, i) => <p key={i}>{para.split(/(`[^`]+`)/).map((part, j) => part.startsWith('`') && part.endsWith('`') && part.length > 1 ? <code key={j} className="fl-inline">{part.slice(1, -1)}</code> : <React.Fragment key={j}>{part}</React.Fragment>)}</p>);
}

function Feedback({ok, children}) {
  return <div className={`fl-feedback ${ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={ok ? 'check' : 'warning'} size={18}/><div>{children}</div></div>;
}

/* ───────── Pytania po zadaniu (wybór albo krótka odpowiedź) ───────── */
function checkAnswer(q, a) {
  if (q.options) return q.correct.includes(Number(a));
  const norm = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/(zł|mies\.?|miesiące|miesięcy|miesiac|miesiąc)$/, '');
  return norm(a) !== '' && [q.answer, ...(q.accept || [])].map(norm).includes(norm(a));
}
function Questions({data, v, save}) {
  const qs = data.questions || [];
  const [drafts, setDrafts] = useState({});
  if (!qs.length) return null;
  function answer(i, a) {
    const st = v.q?.[i] || {};
    if (st.ok) return;
    const ok = checkAnswer(qs[i], a);
    save({q: {...(v.q || {}), [i]: {sel: a, ok, first: !st.tries && ok, tries: (st.tries || 0) + 1}}});
  }
  return <div className="fl-questions">
    {qs.map((q, i) => {
      const st = v.q?.[i] || {};
      const id = `${data.id}-q${i}`;
      return <fieldset key={i} className={`fl-q ${st.ok ? 'is-ok' : ''}`}>
        <legend><span className="fl-q-num" aria-hidden="true">{st.ok ? '✓' : i + 1}</span><span>{q.q}</span>{st.ok && <em>+{pts(st.first ? 1 : 0.5)} pkt</em>}</legend>
        {q.options ? <div className="fl-q-options">{orderOptions(optionKey('flowLab', `${data.id}:q${i}`, q.options), q.options).map(([j, o], pos) =>
          <button type="button" key={j} data-option={j} className={`choice ${st.sel === j ? 'selected' : ''}`} aria-pressed={st.sel === j} disabled={st.ok && st.sel !== j} onClick={() => answer(i, j)}>
            <span className="choice-letter">{String.fromCharCode(65 + pos)}</span><span>{o}</span></button>)}</div>
          : <form className="fl-q-text" onSubmit={e => { e.preventDefault(); answer(i, drafts[i] ?? ''); }}>
            <label htmlFor={id}>{q.inputLabel || 'Twoja odpowiedź'}</label>
            <input id={id} autoComplete="off" disabled={st.ok} value={drafts[i] ?? (st.ok ? st.sel : '')} onChange={e => setDrafts({...drafts, [i]: e.target.value})}/>
            {!st.ok && <button type="submit" className="btn secondary">Sprawdź</button>}
          </form>}
        {st.tries > 0 && <Feedback ok={st.ok}>{st.ok ? q.explain : `Jeszcze nie. ${q.hint || 'Wróć do schematu i sprawdź jeszcze raz.'}`}</Feedback>}
      </fieldset>;
    })}
  </div>;
}

/* ───────── Rysunek schematu blokowego (SVG) ───────── */
function shape(b, box) {
  const {cx, cy, left, right, top, bottom, h} = box;
  if (b.kind === 'if') return <polygon points={`${cx},${top} ${right},${cy} ${cx},${bottom} ${left},${cy}`}/>;
  if (b.kind === 'io') return <polygon points={`${left + 14},${top} ${right},${top} ${right - 14},${bottom} ${left},${bottom}`}/>;
  if (b.kind === 'start' || b.kind === 'end') return <rect x={left} y={top} width={right - left} height={h} rx={h / 2}/>;
  return <rect x={left} y={top} width={right - left} height={h} rx={5}/>;
}
function Chart({chart, picks = {}, current, prev, visited = new Set(), blankNo = {}, title}) {
  const size = chartSize(chart);
  const edges = useMemo(() => chartEdges(chart), [chart]);
  const outline = chartOutline(chart, picks);
  return <figure className="fl-chart">
    <div className="fl-chart-scroll">
      <svg viewBox={`0 0 ${size.width} ${size.height}`} style={{maxWidth: size.width}} aria-hidden="true" focusable="false">
        <defs>
          <marker id="fl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#4a5f66"/></marker>
          <marker id="fl-arrow-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f4fa3"/></marker>
        </defs>
        {edges.map((e, i) => {
          const hot = prev === e.from && current === e.to;
          const [x0, y0] = e.points[0], [x1, y1] = e.points[1];
          const lx = x1 !== x0 ? x0 + (x1 > x0 ? 8 : -34) : x0 + 6;
          const ly = x1 !== x0 ? y0 - 6 : y0 + 16;
          return <g key={i} className={`fl-edge ${hot ? 'is-hot' : ''}`}>
            <polyline points={e.points.map(p => p.join(',')).join(' ')} markerEnd={`url(#${hot ? 'fl-arrow-hot' : 'fl-arrow'})`}/>
            {e.label && <text x={lx} y={ly} className="fl-edge-label">{e.label}</text>}
          </g>;
        })}
        {chart.blocks.map(b => {
          const box = blockBox(b);
          const text = b.blank ? blockText(b, picks) : b.text;
          const raw = text === null ? `pole ${blankNo[b.id]}` : b.kind === 'if' && !/\?$/.test(text) ? `${text}?` : text;
          const lines = String(raw).split('\n');
          const long = lines.some(l => l.length > (b.kind === 'if' ? 16 : 19));
          const fs = long ? 12 : 14.5;
          const state = current === b.id ? 'is-current' : prev === b.id ? 'is-prev' : visited.has(b.id) ? 'is-visited' : '';
          return <g key={b.id} className={`fl-block fl-k-${b.kind} ${state} ${b.blank ? 'is-blank' : ''} ${b.blank && text === null ? 'is-empty' : ''}`}>
            {shape(b, box)}
            <text x={box.cx} y={box.cy - (lines.length - 1) * fs * 0.6} fontSize={fs}>
              {lines.map((l, i) => <tspan key={i} x={box.cx} dy={i ? fs * 1.2 : 0}>{l}</tspan>)}
            </text>
            {b.blank && <g className="fl-blank-no"><circle cx={box.left + (b.kind === 'if' ? 22 : 4)} cy={box.top + 4} r={11}/><text x={box.left + (b.kind === 'if' ? 22 : 4)} y={box.top + 4}>{blankNo[b.id]}</text></g>}
          </g>;
        })}
      </svg>
    </div>
    <details className="fl-outline">
      <summary>Pokaż schemat jako listę kroków (tekst)</summary>
      <ol>{outline.map((l, i) => <li key={i}>{l.replace(/^\d+\.\s*/, '')}</li>)}</ol>
    </details>
  </figure>;
}

function VarTable({vars, prev}) {
  const names = Object.keys(vars || {});
  return <table className="fl-vars"><caption>Zmienne</caption>
    <thead><tr><th scope="col">Nazwa</th><th scope="col">Wartość</th></tr></thead>
    <tbody>{names.length ? names.map(n => {
      const ch = !prev || !(n in prev) ? 'nowa' : prev[n] !== vars[n] ? 'zmiana' : '';
      return <tr key={n} className={ch ? 'is-changed' : ''}><th scope="row">{n}{ch && <small> {ch}</small>}</th><td>{show(vars[n])}</td></tr>;
    }) : <tr><td colSpan={2} className="fl-muted">jeszcze brak zmiennych</td></tr>}</tbody>
  </table>;
}
function Screen({lines}) {
  return <div className="fl-screen-box"><p className="fl-panel-title"><Icon name="desktop" size={16}/>Ekran — co wypisał algorytm</p>
    <pre className="fl-screen" tabIndex={0} aria-label="Ekran: co wypisał algorytm">{lines?.length ? lines.join('\n') : <span className="fl-muted">(nic jeszcze nie wypisano)</span>}</pre></div>;
}

/* ───────── Tryb „trace”: wykonanie krok po kroku z przewidywaniem decyzji ───────── */
function describe(step, prevVars, block) {
  if (!step) return '';
  if (step.kind === 'start') return 'Start algorytmu.';
  if (step.kind === 'end') return 'Stop — algorytm się zakończył.';
  const t = block.text;
  if (/^wczytaj/i.test(t)) return `Wczytano dane: ${Object.keys(step.vars).filter(k => !(k in (prevVars || {}))).map(k => `${k} = ${show(step.vars[k])}`).join(', ')}.`;
  if (/^wypisz/i.test(t)) return `Na ekranie pojawiło się: ${step.out.at(-1)}`;
  const ch = Object.keys(step.vars).filter(k => !prevVars || prevVars[k] !== step.vars[k]);
  return `Wykonano: ${t.replace(/\n/g, '; ')}. Teraz ${ch.map(k => `${k} = ${show(step.vars[k])}`).join(', ') || 'bez zmian'}.`;
}
function TraceMode({data, v, save}) {
  const chart = data.chart;
  const run = useMemo(() => runChart(chart, data.input), [chart, data.input]);
  const blocks = useMemo(() => Object.fromEntries(chart.blocks.map(b => [b.id, b])), [chart]);
  const steps = run.steps;
  const k = Math.min(v.k || 0, steps.length);
  const cur = steps[k];
  const last = k > 0 ? steps[k - 1] : null;
  const before = k > 1 ? steps[k - 2] : null;
  const vars = last?.vars || {};
  const visited = new Set(steps.slice(0, k).map(s => s.id));
  const [msg, setMsg] = useState(null);
  function step() {
    const nk = k + 1;
    save({k: nk, ...(nk >= steps.length ? {finished: true} : {})});
    setMsg(null);
  }
  function decide(ans) {
    const b = blocks[cur.id];
    if (ans === cur.cond) {
      setMsg({ok: true, text: `${ans ? 'TAK' : 'NIE'} — ${substitute(b.text, vars)} to ${ans ? 'prawda' : 'fałsz'}. Idziemy strzałką ${ans ? 'TAK' : 'NIE'}.`});
      save({k: k + 1});
    } else {
      setMsg({ok: false, text: `Sprawdź jeszcze raz. Podstaw wartości z tabeli zmiennych: ${substitute(b.text, vars)}. Czy to prawda?`});
      save({mistakes: (v.mistakes || 0) + 1});
    }
  }
  const inputText = Object.entries(data.input || {}).map(([n, x]) => `${n} = ${show(x)}`).join(', ');
  return <div className="fl-trace">
    {inputText && <p className="fl-input"><Icon name="idcard" size={18}/><span><b>Dane wejściowe:</b> {inputText}</span></p>}
    <div className="fl-trace-grid">
      <Chart chart={chart} current={cur?.id} prev={last?.id} visited={visited} title={data.title}/>
      <div className="fl-trace-side">
        <div className="fl-step" aria-live="polite">
          <p className="fl-step-no">Krok {Math.min(k + 1, steps.length)} z {steps.length}</p>
          {last && <p className="fl-step-done">{describe(last, before?.vars, blocks[last.id])}</p>}
          {cur && <p className="fl-step-next"><b>Teraz (żółty blok):</b> <code className="fl-inline">{blocks[cur.id].text.replace(/\n/g, '; ')}</code></p>}
          {!cur && <p className="fl-step-end"><Icon name="trophy" size={18}/>Algorytm przeszedł do końca{v.mistakes ? ` (pomyłki przy decyzjach: ${v.mistakes})` : ' bez pomyłki'}. Wynik na ekranie: <b>{run.out.join(' | ') || '—'}</b></p>}
        </div>
        {cur && cur.kind === 'if' ? <div className="fl-decide" role="group" aria-label="Decyzja w rombie">
          <p><b>Romb:</b> <code className="fl-inline">{blocks[cur.id].text}</code> — jaka odpowiedź?</p>
          <div className="fl-decide-buttons">
            <button type="button" className="btn" onClick={() => decide(true)}>TAK</button>
            <button type="button" className="btn" onClick={() => decide(false)}>NIE</button>
          </div>
        </div> : cur && <div className="fl-toolbar">
          <button type="button" className="btn" onClick={step}>{cur.kind === 'end' ? 'Zakończ algorytm' : 'Wykonaj blok'}<Icon name="right" size={18}/></button>
        </div>}
        {msg && <Feedback ok={msg.ok}>{msg.text}</Feedback>}
        <VarTable vars={vars} prev={before?.vars}/>
        <Screen lines={last?.out}/>
        {k > 0 && <button type="button" className="text-button" onClick={() => { save({k: 0}); setMsg(null); }}><Icon name="reset" size={18}/>Prześledź od początku</button>}
      </div>
    </div>
  </div>;
}

/* ───────── Tryb „fill”: puste pola w schemacie + testy ───────── */
function FillMode({data, v, save}) {
  const chart = data.chart;
  const blanks = chart.blocks.filter(b => b.blank);
  const blankNo = Object.fromEntries(blanks.map((b, i) => [b.id, i + 1]));
  const picks = v.picks || {};
  const done = !!v.passedAll;
  const [msg, setMsg] = useState(null);
  const results = v.results;
  function pick(id, k) { save({picks: {...picks, [id]: k === '' ? undefined : Number(k)}, results: null}); setMsg(null); }
  function check() {
    if (blanks.some(b => !Number.isInteger(picks[b.id]))) { setMsg({ok: false, text: 'Wybierz treść każdego pustego pola, zanim sprawdzisz schemat.'}); return; }
    const r = checkFill(chart, picks, data.tests);
    const passed = r.filter(x => x.ok).length;
    if (passed === r.length) { save({passedAll: true, results: r}); setMsg({ok: true, text: `Schemat przechodzi wszystkie testy (${passed}/${r.length}).`}); return; }
    save({fails: (v.fails || 0) + 1, results: r});
    setMsg({ok: false, text: `Zaliczone testy: ${passed}/${r.length}. Spójrz na wiersz z ✗: dla jakich danych schemat liczy źle? ${(v.fails || 0) >= 1 && data.hint ? data.hint : ''}`.trim()});
  }
  return <div className="fl-fill">
    <div className="fl-trace-grid">
      <Chart chart={chart} picks={picks} blankNo={blankNo} title={data.title}/>
      <div className="fl-trace-side">
        <fieldset className="fl-picks" disabled={done}>
          <legend>Uzupełnij puste pola</legend>
          {blanks.map(b => {
            const id = `${data.id}-blank-${b.id}`;
            return <div key={b.id} className="fl-pick">
              <label htmlFor={id}><span className="fl-pick-no" aria-hidden="true">{blankNo[b.id]}</span>Pole {blankNo[b.id]} ({b.kind === 'if' ? 'romb — warunek' : b.kind === 'io' ? 'wejście/wyjście' : 'prostokąt — obliczenie'})</label>
              <select id={id} value={Number.isInteger(picks[b.id]) ? picks[b.id] : ''} onChange={e => pick(b.id, e.target.value)}>
                <option value="">— wybierz —</option>
                {orderOptions(optionKey('flowLab', `${data.id}:${b.id}`, b.blank.options), b.blank.options).map(([i, o]) => <option key={i} value={i}>{o.replace(/\n/g, ' ; ')}</option>)}
              </select>
            </div>;
          })}
        </fieldset>
        {!done && <div className="fl-toolbar"><button type="button" className="btn fl-btn-check" onClick={check}><Icon name="check" size={18}/>Sprawdź na danych testowych ({data.tests.length})</button></div>}
        {msg && <Feedback ok={msg.ok}>{msg.text}</Feedback>}
        <table className="fl-results">
          <caption>Testy schematu</caption>
          <thead><tr><th scope="col">Dane</th><th scope="col">Oczekiwano</th><th scope="col">Wynik schematu</th><th scope="col"><span className="sr-only">Zgodność</span></th></tr></thead>
          <tbody>{data.tests.map((t, i) => {
            const r = results?.[i];
            return <tr key={i} className={r ? (r.ok ? 'is-ok' : 'is-bad') : ''}>
              <td>{Object.entries(t.input).map(([n, x]) => `${n} = ${show(x)}`).join(', ')}</td>
              <td>{t.output}</td>
              <td>{r ? (r.error ? <span className="fl-err">{r.error.message}</span> : r.got || '—') : <span className="fl-muted">?</span>}</td>
              <td className="fl-mark">{r ? (r.ok ? '✓' : '✗') : ''}<span className="sr-only">{r ? (r.ok ? ' zgodne' : ' różne') : ' nie sprawdzono'}</span></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  </div>;
}

/* ───────── Tryb „tests”: projektant przypadków testowych ───────── */
function TestsMode({data, v, save}) {
  const spec = SPECS[data.spec];
  const got = v.got || {};
  const errors = v.errors || {};
  const cases = v.cases || [];
  const per = data.pointsPer || 2;
  const [raw, setRaw] = useState({});
  const [exp, setExp] = useState({});
  const [msg, setMsg] = useState(null);
  const done = spec.categories.every(c => got[c.id]);
  function submit(e) {
    e.preventDefault();
    const j = judgeCase(data.spec, raw, exp, Object.keys(got));
    if (j.status === 'empty' || j.status === 'incomplete') { setMsg({ok: false, text: j.message}); return; }
    if (j.status === 'wrong') {
      save({errors: {...errors, [j.category]: (errors[j.category] || 0) + 1}});
      setMsg({ok: false, text: `${j.message} Popraw oczekiwany wynik i dodaj przypadek jeszcze raz.`});
      return;
    }
    const row = {raw: {...raw}, result: j.correct, category: j.category, isNew: j.status === 'new'};
    const patch = {cases: [...cases, row]};
    if (j.status === 'new') patch.got = {...got, [j.category]: {errors: errors[j.category] || 0}};
    save(patch);
    const left = spec.categories.filter(c => !got[c.id] && c.id !== j.category);
    setMsg({ok: j.status === 'new', text: j.status === 'new' ? `${j.message} +${pts(errors[j.category] ? per / 2 : per)} pkt.${left.length ? ` Brakuje jeszcze: ${left.map(c => c.label.toLowerCase()).join('; ')}.` : ' Masz komplet rodzajów przypadków!'}` : j.message});
    setRaw({}); setExp({});
  }
  const resultText = r => r === 'BŁĄD' ? 'Błędne dane' : spec.result.kind === 'number' ? `${r} ${spec.result.unit || ''}`.trim() : r;
  return <div className="fl-tests">
    <div className="fl-spec">
      <p className="fl-panel-title"><Icon name="file" size={16}/>Specyfikacja zadania</p>
      <h4>{spec.title}</h4>
      <p>{spec.story}</p>
      <dl>
        <dt>Dane wejściowe</dt>
        <dd><ul>{spec.inputs.map(i => <li key={i.name}><code className="fl-inline">{i.name}</code> — {i.label.replace(/\?$/, '')} ({i.range})</li>)}</ul></dd>
        <dt>Wynik</dt><dd>{spec.result.text}</dd>
        <dt>Warunki</dt><dd><ul>{spec.rules.map(r => <li key={r}>{r}</li>)}</ul></dd>
      </dl>
    </div>
    <div className="fl-tests-grid">
      <form className="fl-case-form" onSubmit={submit}>
        <p className="fl-panel-title"><Icon name="idcard" size={16}/>Nowy przypadek testowy</p>
        {spec.inputs.map(i => {
          const id = `${data.id}-in-${i.name}`;
          return <div key={i.name} className="fl-field"><label htmlFor={id}>{i.label}</label>
            <input id={id} autoComplete="off" inputMode="text" value={raw[i.name] ?? ''} onChange={e => setRaw({...raw, [i.name]: e.target.value})}/></div>;
        })}
        <fieldset className="fl-expect">
          <legend>Co według specyfikacji powinien zrobić program?</legend>
          {spec.result.kind === 'yesno' ? <div className="fl-radios">
            {[['yes', 'Odpowie TAK'], ['no', 'Odpowie NIE'], ['error', 'Pokaże „Błędne dane”']].map(([k, l]) =>
              <label key={k} className={exp.kind === k ? 'is-on' : ''}><input type="radio" name={`${data.id}-exp`} checked={exp.kind === k} onChange={() => setExp({kind: k})}/>{l}</label>)}
          </div> : <div className="fl-radios">
            <label className={exp.kind === 'num' ? 'is-on' : ''}><input type="radio" name={`${data.id}-exp`} checked={exp.kind === 'num'} onChange={() => setExp({...exp, kind: 'num'})}/>Poda liczbę miesięcy:</label>
            <input className="fl-exp-num" aria-label="Oczekiwana liczba miesięcy" autoComplete="off" value={exp.value ?? ''} onChange={e => setExp({kind: 'num', value: e.target.value})}/>
            <label className={exp.kind === 'error' ? 'is-on' : ''}><input type="radio" name={`${data.id}-exp`} checked={exp.kind === 'error'} onChange={() => setExp({kind: 'error'})}/>Pokaże „Błędne dane”</label>
          </div>}
        </fieldset>
        <button type="submit" className="btn"><Icon name="check" size={18}/>Dodaj przypadek testowy</button>
        {msg && <Feedback ok={msg.ok}>{msg.text}</Feedback>}
      </form>
      <div className="fl-cats">
        <p className="fl-panel-title"><Icon name="list" size={16}/>Zestaw testów: {spec.categories.filter(c => got[c.id]).length}/{spec.categories.length}</p>
        <ul>{spec.categories.map(c => <li key={c.id} className={got[c.id] ? 'is-ok' : ''}>
          <span className="fl-cat-mark" aria-hidden="true">{got[c.id] ? '✓' : '○'}</span>
          <div><b>{c.label}</b><span className="sr-only">{got[c.id] ? ' — zebrany' : ' — brakuje'}</span>
            {got[c.id] ? <small>+{pts(got[c.id].errors ? per / 2 : per)} pkt</small> : <small>{c.hint}</small>}</div>
        </li>)}</ul>
        {done && data.doneText && <p className="fl-done-text"><Icon name="trophy" size={18}/>{data.doneText}</p>}
      </div>
    </div>
    {cases.length > 0 && <table className="fl-results">
      <caption>Twoje przypadki testowe</caption>
      <thead><tr>{spec.inputs.map(i => <th key={i.name} scope="col">{i.name}</th>)}<th scope="col">Oczekiwany wynik</th><th scope="col">Rodzaj przypadku</th></tr></thead>
      <tbody>{cases.map((c, i) => <tr key={i} className="is-ok">
        {spec.inputs.map(inp => <td key={inp.name}><code>{String(c.raw[inp.name])}</code></td>)}
        <td>{resultText(c.result)}</td>
        <td>{spec.categories.find(x => x.id === c.category)?.label}{!c.isNew && <small className="fl-muted"> (powtórka rodzaju)</small>}</td>
      </tr>)}</tbody>
    </table>}
  </div>;
}

export default function FlowLab({data, value, onChange, answers}) {
  const v = value || {};
  const res = flowResult(data, v);
  const max = flowMax(data);
  function save(patch) {
    const next = {...v, ...patch};
    const r = flowResult(data, next);
    onChange({...next, done: r.done, score: r.score, max: r.max, summary: r.summary});
  }
  const locked = data.requires && !answers?.[data.requires]?.done;
  const Mode = {tests: TestsMode, trace: TraceMode, fill: FillMode}[data.mode] || TraceMode;
  return <section className={`fl ${res.done ? 'is-done' : ''}`} aria-labelledby={`${data.id}-title`}>
    <header className="fl-bar">
      <span className="fl-dots" aria-hidden="true"><i/><i/><i/></span>
      <span className="fl-file"><Icon name={MODE_ICON[data.mode] || 'list'} size={16}/>{data.file || 'algorytm'}</span>
      <span className="fl-mode">{MODE_LABEL[data.mode]}</span>
      <span className="fl-sim">symulacja</span>
      <span className="fl-score" aria-label={`Punkty: ${res.score} z ${max}`}>{res.done && <Icon name="check" size={16}/>}{pts(res.score)}/{max} pkt</span>
    </header>
    <div className="fl-body">
      <h3 id={`${data.id}-title`} className="fl-title">{data.title}</h3>
      {locked ? <p className="fl-locked"><Icon name="lock" size={20}/>To zadanie odblokuje się po zaliczeniu poprzedniego{data.requiresTitle ? ` („${data.requiresTitle}”)` : ''}.</p> : <>
        <div className="fl-prompt"><Rich text={data.prompt}/></div>
        <Mode data={data} v={v} save={save}/>
        {data.questions?.length > 0 && (data.mode !== 'trace' || v.finished) && <Questions data={data} v={v} save={save}/>}
        {data.questions?.length > 0 && data.mode === 'trace' && !v.finished && <p className="fl-muted small">Pytania pojawią się, gdy przejdziesz algorytm do końca.</p>}
      </>}
    </div>
  </section>;
}
