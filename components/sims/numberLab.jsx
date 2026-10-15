import React, {useEffect, useRef, useState} from 'react';
import {Icon} from '../icons.jsx';
import './numberLab.css';
import {orderOptions, optionKey} from './optionOrder.js';
import {MODES, modeTasks, modeResult, answerStep, taskScore, taskUnlocked, shownAlgo, rectCuts, raceRow, gcd, lcm,
  factorString, fracText} from '../../content/sims/numberLab.js';

const pts = n => String(n).replace('.', ',');
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* ───────── Ułamek zapisany „piętrowo” ───────── */
function Frac({f, className = ''}) {
  if (!f) return null;
  if (f[1] === 1) return <span className={`nl-int ${className}`}>{f[0]}</span>;
  return <span className={`nl-frac ${className}`}><span aria-hidden="true">{f[0]}</span><span aria-hidden="true">{f[1]}</span><span className="sr-only">{f[0]}/{f[1]}</span></span>;
}

/* ───────── Obrazki: każdy pokazuje tylko to, co uczeń już odkrył ───────── */
function Divisors({v, shown, done}) {
  const {n, steps} = v;
  const next = steps[shown];
  return <div className="nl-vis nl-div">
    <p className="nl-big" aria-label={`Badana liczba ${n}`}>{n}</p>
    <ol className="nl-cands" aria-label="Sprawdzeni kandydaci na dzielnik">
      {steps.slice(0, shown).map(s => <li key={s.d} className={s.divides ? 'is-yes' : 'is-no'}>
        <b>{s.d}</b><span>{s.divides ? '✓ dzieli' : `✗ reszta ${s.rem}`}</span></li>)}
      {next && <li className="is-now"><b>{next.d}</b><span>?</span></li>}
    </ol>
    {next ? <p className="nl-note">Kandydat {next.d}: {next.d} · {next.d} = {next.d * next.d} ≤ {n}, więc sprawdzamy.</p>
      : <p className="nl-note">{steps.at(-1)?.divides ? `Znaleziony dzielnik: ${steps.at(-1).d}.` : `Następny kandydat ${steps.at(-1).d + 1}: ${steps.at(-1).d + 1} · ${steps.at(-1).d + 1} = ${(steps.at(-1).d + 1) ** 2} > ${n} — koniec sprawdzania.`}</p>}
    <p className="nl-counter">Sprawdzone dzielniki: <b>{shown}</b>{done && <> · zamiast <b>{n - 2}</b> „na piechotę”</>}</p>
  </div>;
}
function Pairs({v}) {
  const pairs = [];
  for (let d = 1; d * d <= v.n; d++) if (v.n % d === 0) pairs.push([d, v.n / d]);
  return <div className="nl-vis">
    <p className="nl-note"><b>Pary dzielników liczby {v.n}</b> (iloczyn w każdej parze = {v.n}):</p>
    <ul className="nl-pairs">{pairs.map(([a, b]) => <li key={a}><b>{a}</b><span aria-hidden="true">·</span><span className="sr-only">razy</span><b>{b}</b></li>)}</ul>
    <p className="nl-note small">Lewe liczby rosną, prawe maleją. Spotykają się w środku.</p>
  </div>;
}
function Factor({v, shown}) {
  const rows = v.steps.slice(0, shown);
  const cur = v.steps[shown];
  const finished = shown >= v.steps.length;
  return <div className="nl-vis">
    <table className="nl-factor">
      <caption className="sr-only">Rozkład liczby {v.n} na czynniki pierwsze</caption>
      <thead><tr><th scope="col">liczba</th><th scope="col">dzielnik</th></tr></thead>
      <tbody>
        {rows.map((r, i) => <tr key={i}><td>{fmt(r.n)}</td><td>{r.p}</td></tr>)}
        {cur && <tr className="is-now"><td>{fmt(cur.n)}</td><td>?</td></tr>}
        {finished && <tr className="is-end"><td>1</td><td></td></tr>}
      </tbody>
    </table>
    {finished && <p className="nl-result">{fmt(v.n)} = {factorString(v.n)}</p>}
  </div>;
}
const COLORS = ['#9fc3a8', '#a9bfe6', '#f2cf7a', '#e5a9a0', '#c7b3e6', '#8fd3d1'];
function Rect({v, shown, done}) {
  const {a, b, method} = v;
  const groups = rectCuts(a, b, method);
  const g = gcd(a, b);
  const vis = groups.slice(0, shown);
  const rest = vis.length ? vis.at(-1).rest : {x: 0, y: 0, w: a, h: b};
  const fs = Math.max(a, b) * 0.055;
  const desc = `Prostokąt ${a} na ${b}. Odcięto ${vis.reduce((s, x) => s + x.squares.length, 0)} kwadratów.${rest.w && rest.h ? ` Zostaje ${rest.w} na ${rest.h}.` : ''}`;
  return <div className="nl-vis">
    <svg className="nl-rect" viewBox={`${-fs * 0.2} ${-fs * 0.2} ${a + fs * 0.4} ${b + fs * 0.4}`} role="img" aria-label={desc}>
      <rect x="0" y="0" width={a} height={b} className="nl-rect-bg"/>
      {vis.map((grp, k) => grp.squares.map((s, j) => <g key={`${k}-${j}`}>
        <rect x={s.x} y={s.y} width={s.s} height={s.s} fill={COLORS[k % COLORS.length]} className="nl-sq"/>
        <text x={s.x + s.s / 2} y={s.y + s.s / 2} fontSize={Math.min(fs, s.s * 0.32)} className="nl-sq-t">{s.s}</text>
      </g>))}
      {done && Array.from({length: a / g - 1}, (_, i) => <line key={`v${i}`} x1={(i + 1) * g} y1="0" x2={(i + 1) * g} y2={b} className="nl-grid"/>)}
      {done && Array.from({length: b / g - 1}, (_, i) => <line key={`h${i}`} x1="0" y1={(i + 1) * g} x2={a} y2={(i + 1) * g} className="nl-grid"/>)}
      {rest.w > 0 && rest.h > 0 && <rect x={rest.x} y={rest.y} width={rest.w} height={rest.h} className={`nl-rest ${rest.w === rest.h ? 'is-square' : ''}`}/>}
      {rest.w > 0 && rest.h > 0 && <text x={rest.x + rest.w / 2} y={rest.y + rest.h / 2} fontSize={Math.min(fs, rest.w * 0.25, rest.h * 0.4)} className="nl-rest-t">{rest.w === rest.h ? `${rest.w}` : `${rest.w}×${rest.h}`}</text>}
    </svg>
    <p className="nl-counter">{method === 'sub' ? 'Odejmowania' : 'Dzielenia z resztą'}: <b>{shown}</b>
      {done && <> · płytka <b>{g} × {g}</b>, sztuk: <b>{(a / g) * (b / g)}</b></>}</p>
  </div>;
}
function Timeline({v, shown, done}) {
  const {a, b, limit, unit} = v;
  const l = lcm(a, b);
  const reveal = shown > 0 || done;
  const row = (k, label) => {
    const items = [];
    for (let t = k; t <= limit; t += k) items.push(t);
    return <div className="nl-tl-row"><span className="nl-tl-label">{label}</span>
      <ol className="nl-tl">{items.map(t => <li key={t} className={reveal && t % l === 0 ? 'is-common' : ''}>{t}{reveal && t % l === 0 && <span className="sr-only"> (wspólne)</span>}</li>)}</ol></div>;
  };
  return <div className="nl-vis">
    <p className="nl-note small">Wielokrotności ({unit}), od 0:</p>
    {row(a, `co ${a}`)}{row(b, `co ${b}`)}
    {reveal && <p className="nl-counter">Wspólne: <b>{l}</b>, {2 * l <= limit ? <b>{2 * l}</b> : null}{2 * l <= limit ? '… ' : ''}— co NWW = {l} {unit}</p>}
  </div>;
}
function Race({v}) {
  const [a, setA] = useState('240'), [b, setB] = useState('180');
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  function run(x, y) {
    if (!(Number.isInteger(x) && Number.isInteger(y) && x > 0 && y > 0 && x <= 1e12 && y <= 1e12)) { setErr('Wpisz dwie liczby całkowite od 1 do 1 000 000 000 000.'); return; }
    setErr(''); setA(String(x)); setB(String(y));
    setRows(r => [raceRow(x, y), ...r.filter(q => !(q.a === x && q.b === y))].slice(0, 5));
  }
  const last = rows[0];
  const mx = last ? Math.max(last.sub, last.mod, 1) : 1;
  return <div className="nl-vis nl-race">
    <div className="nl-presets" role="group" aria-label="Gotowe pary liczb">
      {v.pairs.map(([x, y]) => <button type="button" key={x} className="btn secondary nl-small" onClick={() => run(x, y)}>{fmt(x)} i {fmt(y)}</button>)}
    </div>
    <form className="nl-race-form" onSubmit={e => { e.preventDefault(); run(Number(a.replace(/\s/g, '')), Number(b.replace(/\s/g, ''))); }}>
      <label>a <input inputMode="numeric" value={a} onChange={e => setA(e.target.value)}/></label>
      <label>b <input inputMode="numeric" value={b} onChange={e => setB(e.target.value)}/></label>
      <button type="submit" className="btn nl-small"><Icon name="play" size={16}/>Policz kroki</button>
    </form>
    {err && <p className="nl-fb is-retry" role="status">{err}</p>}
    {last && <div className="nl-race-bars" aria-live="polite">
      <p className="nl-note"><b>NWD({fmt(last.a)}, {fmt(last.b)}) = {fmt(last.gcd)}</b></p>
      <div className="nl-rbar"><span>odejmowanie</span><i style={{width: `${Math.max(1.5, 100 * last.sub / mx)}%`}} className="is-sub"/><b>{fmt(last.sub)}</b></div>
      <div className="nl-rbar"><span>z resztą</span><i style={{width: `${Math.max(1.5, 100 * last.mod / mx)}%`}} className="is-mod"/><b>{fmt(last.mod)}</b></div>
    </div>}
    {rows.length > 1 && <table className="nl-race-table"><caption className="sr-only">Poprzednie porównania</caption>
      <thead><tr><th scope="col">para</th><th scope="col">odejmowania</th><th scope="col">z resztą</th></tr></thead>
      <tbody>{rows.slice(1).map(r => <tr key={`${r.a}-${r.b}`}><td>{fmt(r.a)}, {fmt(r.b)}</td><td>{fmt(r.sub)}</td><td>{fmt(r.mod)}</td></tr>)}</tbody></table>}
  </div>;
}
function Bar({f, label, tone = 'a', sub}) {
  const [l, m] = f;
  const wholes = Math.max(1, Math.ceil(Math.abs(l) / m));
  const k = sub && sub % m === 0 ? sub / m : 1;
  return <div className="nl-bar-row">
    {label && <span className="nl-bar-label">{label}</span>}
    <span className="nl-bar-wrap" role="img" aria-label={`${label ? `${label}: ` : ''}${l} z ${m} części${k > 1 ? `, czyli ${l * k} z ${m * k}` : ''}`}>
      {Array.from({length: wholes}, (_, w) => <span key={w} className="nl-bar" style={{'--n': m * k}}>
        {Array.from({length: m * k}, (_, i) => <i key={i} className={`${w * m * k + i < l * k ? `is-on t-${tone}` : ''} ${(i + 1) % k === 0 ? 'is-major' : ''}`}/>)}
      </span>)}
    </span>
    <Frac f={k > 1 ? [l * k, m * k] : f} className="nl-bar-frac"/>
  </div>;
}
function Bars({v, shown, done, wrong}) {
  const common = shown > 0 && v.common ? v.common : null;
  return <div className="nl-vis nl-bars">
    {v.items.map((f, i) => <React.Fragment key={i}>
      {i > 0 && v.op && <p className="nl-op" aria-hidden="true">{v.op}</p>}
      <Bar f={f} label={v.labels?.[i] || (i === 0 ? 'pierwszy' : 'drugi')} tone={i ? 'b' : 'a'} sub={common}/>
    </React.Fragment>)}
    {wrong && v.op === '+' && <><p className="nl-op" aria-hidden="true">≠</p><Bar f={wrong} label="Twoja odpowiedź" tone="bad"/></>}
    {done && <><p className="nl-op" aria-hidden="true">=</p><Bar f={v.result} label="wynik" tone="ok"/></>}
  </div>;
}
function Ratio({v, shown}) {
  const total = v.parts.reduce((s, p) => s + p.n, 0);
  return <div className="nl-vis">
    <div className="nl-ratio" role="img" aria-label={v.parts.map(p => `${p.label}: ${p.n} ${p.n === 1 ? 'część' : 'części'}`).join(', ')}>
      {v.parts.map((p, i) => <span key={i} style={{flexGrow: p.n}} className={`t-${i ? 'b' : 'a'}`}><b>{p.n}</b> {p.label}</span>)}
    </div>
    <p className="nl-counter">Wszystkich części: {shown > 0 ? <b>{total}</b> : <b>?</b>}{shown > 0 && <> · {v.parts[0].label} to <Frac f={[v.parts[0].n, total]}/> całości</>}</p>
  </div>;
}
function Visual({task, st}) {
  const v = task.visual, shown = shownAlgo(task, st), done = !!st?.done;
  if (v.kind === 'divisors') return <Divisors v={v} shown={shown} done={done}/>;
  if (v.kind === 'pairs') return <Pairs v={v}/>;
  if (v.kind === 'factor') return <Factor v={v} shown={shown}/>;
  if (v.kind === 'rect') return <Rect v={v} shown={shown} done={done}/>;
  if (v.kind === 'timeline') return <Timeline v={v} shown={shown} done={done}/>;
  if (v.kind === 'race') return <Race v={v}/>;
  if (v.kind === 'bars') return <Bars v={v} shown={shown} done={done} wrong={st?.wrongFrac}/>;
  if (v.kind === 'ratio') return <Ratio v={v} shown={shown}/>;
  return null;
}

/* ───────── Krok do przewidzenia ───────── */
function StepInput({task, step, idx, onAnswer, focusRef}) {
  const [val, setVal] = useState('');
  const [fr, setFr] = useState(['', '']);
  const id = `${task.id}-s${idx}`;
  if (step.kind === 'num') return <form className="nl-step-form" onSubmit={e => { e.preventDefault(); onAnswer(val); }}>
    <label htmlFor={id} className="nl-prompt">{step.prompt}</label>
    <div className="nl-inline"><input id={id} ref={focusRef} inputMode="numeric" autoComplete="off" value={val} onChange={e => setVal(e.target.value)}/>
      {step.unit && <span className="nl-unit">{step.unit}</span>}
      <button type="submit" className="btn nl-small"><Icon name="check" size={16}/>Sprawdź</button></div>
  </form>;
  if (step.kind === 'frac') return <form className="nl-step-form" onSubmit={e => { e.preventDefault(); onAnswer(fr); }}>
    <p className="nl-prompt" id={`${id}-p`}>{step.prompt}</p>
    <div className="nl-inline">
      <span className="nl-frac-in" role="group" aria-labelledby={`${id}-p`}>
        <label className="sr-only" htmlFor={`${id}-l`}>Licznik</label>
        <input id={`${id}-l`} ref={focusRef} inputMode="numeric" autoComplete="off" value={fr[0]} onChange={e => setFr([e.target.value, fr[1]])} placeholder="licznik"/>
        <label className="sr-only" htmlFor={`${id}-m`}>Mianownik</label>
        <input id={`${id}-m`} inputMode="numeric" autoComplete="off" value={fr[1]} onChange={e => setFr([fr[0], e.target.value])} placeholder="mianownik"/>
      </span>
      <button type="submit" className="btn nl-small"><Icon name="check" size={16}/>Sprawdź</button></div>
  </form>;
  const opts = step.kind === 'yesno' ? step.options.map((o, i) => [i, o]) : orderOptions(optionKey('numberLab', id, step.options), step.options);
  return <fieldset className="nl-step-form">
    <legend className="nl-prompt">{step.prompt}</legend>
    <div className={`nl-opts ${step.kind === 'yesno' ? 'is-yesno' : ''}`}>
      {opts.map(([i, o], pos) => <button type="button" key={i} data-option={i} ref={pos === 0 ? focusRef : undefined} className="choice" onClick={() => onAnswer(i)}>
        {step.kind !== 'yesno' && <span className="choice-letter">{String.fromCharCode(65 + pos)}</span>}<span>{o}</span></button>)}
    </div>
  </fieldset>;
}
const answerText = (step, input) => step.kind === 'frac' ? fracText(input.map(Number)) : step.kind === 'num' ? String(input).trim() : step.options[input];

/** „240 − 180 = ?” → „240 − 180 = 60”; inne pytania → „pytanie → odpowiedź”. */
function logLine(step, ans) {
  const pr = step.prompt.trim();
  if (pr.includes('=') && / \?$/.test(pr)) return <>{pr.slice(0, -1)}<b>{ans}</b></>;
  if (pr.includes('= ?')) { const [x, ...rest] = pr.split('= ?'); return <>{x}= <b>{ans}</b>{rest.join('= ?')}</>; }
  return <>{pr.replace(/\s*\?$/, '')} <b>→ {ans}</b></>;
}

function Task({task, st, onAnswer, onNext, hasNext}) {
  const i = st?.step || 0;
  const step = task.steps[i];
  const focusRef = useRef(null);
  const wantFocus = useRef(false);
  useEffect(() => { if (wantFocus.current) { focusRef.current?.focus(); wantFocus.current = false; } }, [i]);
  const fb = st?.fb;
  return <div className="nl-task">
    <p className="nl-story">{task.story}</p>
    <div className="nl-grid">
      <Visual task={task} st={st}/>
      <div className="nl-steps">
        <p className="nl-hud"><span>Krok <b>{Math.min(i + 1, task.steps.length)}</b> / {task.steps.length}</span><span>Pomyłki: <b>{st?.errors || 0}</b></span>
          {st?.done && <span className="nl-hud-pts">+{pts(taskScore(task, st))}/{task.points} pkt</span>}</p>
        {(st?.log || []).length > 0 && <ol className="nl-log" aria-label="Wykonane kroki">
          {st.log.map(e => <li key={e.i}><span className="nl-log-mark" aria-hidden="true">✓</span><span>{logLine(task.steps[e.i], answerText(task.steps[e.i], e.input))}</span></li>)}
        </ol>}
        {step && <StepInput key={`${task.id}-${i}`} task={task} step={step} idx={i} focusRef={focusRef} onAnswer={x => { wantFocus.current = true; onAnswer(x); }}/>}
        {fb && <div className={`nl-fb ${fb.ok ? 'is-ok' : 'is-retry'}`} role="status"><Icon name={fb.ok ? 'check' : 'warning'} size={18}/><span>{fb.ok ? '' : fb.invalid || fb.near ? '' : 'Jeszcze nie. '}{fb.text}</span></div>}
        {st?.done && <div className="nl-done" role="status"><Icon name="trophy" size={20}/><span>Zadanie zrobione: {pts(taskScore(task, st))}/{task.points} pkt{st.errors ? ` (pomyłki: ${st.errors})` : ' — bez pomyłki!'}</span>
          {hasNext && <button type="button" className="btn nl-small" onClick={onNext}>Następne zadanie<Icon name="right" size={16}/></button>}</div>}
      </div>
    </div>
  </div>;
}

export default function NumberLab({data, value, onChange}) {
  const mode = data.mode;
  const meta = MODES[mode];
  if (!meta) return <p role="alert">Nieznany tryb symulatora: {mode}</p>;
  const tasks = modeTasks(mode);
  const v = value || {};
  const res = modeResult(mode, v);
  const firstOpen = Math.max(0, tasks.findIndex(t => !v.tasks?.[t.id]?.done));
  const cur = Math.min(v.cur ?? firstOpen, tasks.length - 1);
  const task = tasks[cur];
  const st = v.tasks?.[task.id];
  const save = next => onChange({...next, ...modeResult(mode, next)});
  function answer(input) {
    const r = answerStep(task, st || {}, input);
    save({...v, cur, tasks: {...(v.tasks || {}), [task.id]: {...r.st, fb: r.fb}}});
  }
  return <section className="nl" aria-labelledby={`${data.id}-title`}>
    <header className="nl-bar-top">
      <span className="nl-dots" aria-hidden="true"><i/><i/><i/></span>
      <Icon name={meta.icon} size={18}/><strong id={`${data.id}-title`}>{data.label || meta.title}</strong><span className="nl-sim">symulacja</span>
      <span className="nl-score" aria-label={`Punkty: ${res.score} na ${res.max}`}><Icon name="trophy" size={16}/>{pts(res.score)}/{res.max} pkt</span>
    </header>
    <div className="nl-body">
      <nav className="nl-tabs" aria-label="Zadania w symulatorze">
        {tasks.map((t, k) => {
          const open = taskUnlocked(mode, v, k), tst = v.tasks?.[t.id];
          return <button type="button" key={t.id} aria-current={k === cur ? 'step' : undefined} className={k === cur ? 'is-on' : ''} disabled={!open} onClick={() => save({...v, cur: k})}>
            <b>{!open && <Icon name="lock" size={14}/>}{tst?.done && <Icon name="check" size={14}/>}{k + 1}. {t.title}</b>
            <small>{tst?.done ? `${pts(taskScore(t, tst))}/${t.points} pkt` : open ? `${t.points} pkt do zdobycia` : 'po poprzednim zadaniu'}</small>
          </button>;
        })}
      </nav>
      <Task key={task.id} task={task} st={st} onAnswer={answer} hasNext={cur < tasks.length - 1} onNext={() => save({...v, cur: cur + 1})}/>
      {res.done && <p className="nl-all" role="status"><Icon name="trophy" size={20}/>Wszystkie zadania: {pts(res.score)}/{res.max} pkt. {res.summary}</p>}
    </div>
  </section>;
}
