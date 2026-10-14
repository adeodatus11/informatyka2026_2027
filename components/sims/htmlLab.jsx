import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Icon} from '../icons.jsx';
import './htmlLab.css';
import {analyze, lint, runChecks, passMap, labResult, labMax, buildDocument, downloadName, highlight, editKey, applyEdit,
  SNIPPETS, CSS_SNIPPETS, insertSnippet, IMAGES, imageNames, imageDataUri, serpPreview, screenReader, headings, nodeText, select,
  fmtRatio, SERP_TITLE_MAX, SERP_DESC_MAX} from '../../content/sims/htmlLab.js';

const pts = n => String(n).replace('.', ',');
const MODE_LABEL = {free: 'Edytor', tasks: 'Zadanie z kryteriami', fix: 'Napraw stronę', serp: 'Podgląd w wyszukiwarce', theme: 'Motyw CSS', show: 'Produkt do pokazania'};
const hintList = c => [].concat(c.hint || []);

/** Tekst z `kodem` w odwrotnych apostrofach i akapitami rozdzielonymi pustą linią. */
function Rich({text}) {
  if (!text) return null;
  return String(text).split(/\n\n+/).map((para, i) => <p key={i}>{para.split(/(`[^`]+`)/).map((part, j) => part.length > 1 && part.startsWith('`') && part.endsWith('`') ? <code key={j} className="hl-inline">{part.slice(1, -1)}</code> : <React.Fragment key={j}>{part}</React.Fragment>)}</p>);
}

function useDebounced(value, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

/* ───────── Edytor kodu: textarea nad pokolorowaną warstwą ───────── */
function CodeLine({tokens}) {
  if (!tokens.length) return '​';
  return tokens.map((t, i) => t.t === 'txt' ? <React.Fragment key={i}>{t.v}</React.Fragment> : <span key={i} className={`hl-t-${t.t}`}>{t.v}</span>);
}
function Editor({id, value, onChange, lang, label, describedBy, readOnly, marks = {}, taRef}) {
  const own = useRef(null);
  const ta = taRef || own;
  const pendingSel = useRef(null);
  const [escaped, setEscaped] = useState(false);
  const lines = useMemo(() => highlight(value, lang), [value, lang]);
  const longest = Math.max(24, ...value.split('\n').map(l => l.length));
  useLayoutEffect(() => {
    const s = pendingSel.current;
    if (s && ta.current) { ta.current.setSelectionRange(s[0], s[1]); pendingSel.current = null; }
  });
  function onKeyDown(e) {
    if (readOnly) return;
    if (e.key === 'Escape') { setEscaped(true); return; }
    if (e.key === 'Tab' && escaped) { setEscaped(false); return; }
    setEscaped(false);
    if (!['Tab', 'Enter'].includes(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.currentTarget;
    const edit = editKey(el.value, el.selectionStart, el.selectionEnd, e.key, e.shiftKey);
    if (!edit) return;
    e.preventDefault();
    el.setSelectionRange(edit.from, edit.to);
    let ok = false;
    try { ok = document.execCommand('insertText', false, edit.insert); } catch { ok = false; }
    if (ok && el.value === applyEdit(value, edit)) el.setSelectionRange(edit.selStart, edit.selEnd);
    else { pendingSel.current = [edit.selStart, edit.selEnd]; onChange(applyEdit(value, edit)); }
  }
  return <div className={`hl-editor ${readOnly ? 'is-readonly' : ''}`}>
    <div className="hl-gutter" aria-hidden="true">{lines.map((_, i) => <span key={i} className={marks[i + 1] ? `is-${marks[i + 1]}` : ''}>{marks[i + 1] === 'error' ? '⚠ ' : ''}{i + 1}</span>)}</div>
    <div className="hl-editor-scroll">
      <div className="hl-editor-inner" style={{width: `calc(${longest + 2}ch + 28px)`, '--rows': lines.length}}>
        <pre className="hl-hl" aria-hidden="true">{lines.map((l, i) => <div key={i} className={`hl-line ${marks[i + 1] ? `is-${marks[i + 1]}` : ''}`}><CodeLine tokens={l}/></div>)}</pre>
        <textarea ref={ta} id={id} className="hl-textarea" value={value} aria-label={label} aria-describedby={describedBy} readOnly={readOnly}
          spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off"
          onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} onBlur={() => setEscaped(false)}/>
      </div>
    </div>
  </div>;
}
function goToLine(ta, src, line) {
  if (!ta) return;
  const ls = src.split('\n');
  const start = ls.slice(0, line - 1).reduce((s, l) => s + l.length + 1, 0);
  ta.focus();
  ta.setSelectionRange(start, start + (ls[line - 1]?.length || 0));
  const lh = parseFloat(getComputedStyle(ta).lineHeight) || 22;
  const y = ta.getBoundingClientRect().top + (line - 1) * lh;
  if (y < 0 || y > innerHeight - 40) scrollBy({top: y - innerHeight / 3, behavior: 'instant'});
}

/* ───────── Podgląd w izolowanej ramce ───────── */
function Preview({html, css, title, height}) {
  const dh = useDebounced(html), dc = useDebounced(css);
  const doc = useMemo(() => buildDocument(dh, dc), [dh, dc]);
  // sandbox="" — bez skryptów, formularzy, wyskakujących okien i bez dostępu do platformy (patrz content/sims/htmlLab.js)
  return <>
    <iframe className="hl-frame" sandbox="" srcDoc={doc.doc} title={title} style={height ? {height} : undefined}/>
    {doc.removed.scripts > 0 && <p className="hl-note small"><Icon name="shield" size={16}/>Skrypty i atrybuty on… są w tym edytorze wyłączone — dziś uczymy się HTML i CSS.</p>}
  </>;
}

function ScreenReaderView({root}) {
  const items = useMemo(() => screenReader(root), [root]);
  return <ol className="hl-sr-list" aria-label="Co przeczyta czytnik ekranu">{items.map((it, i) => <li key={i} className={`is-${it.kind}`}>
    <span className="hl-sr-kind" aria-hidden="true">{it.kind === 'bad' ? '⚠' : it.kind === 'heading' ? 'H' : it.kind === 'img' ? '▣' : it.kind === 'link' ? '↗' : it.kind === 'list' || it.kind === 'table' ? '≡' : '·'}</span>
    <span>{it.text}</span></li>)}</ol>;
}
function OutlineView({root}) {
  const hs = useMemo(() => headings(root), [root]);
  if (!hs.length) return <p className="small muted hl-pad">Na stronie nie ma żadnego nagłówka &lt;h1&gt;–&lt;h6&gt;. Konspekt (jak okienko nawigacji w Wordzie) jest pusty.</p>;
  return <ol className="hl-outline" aria-label="Konspekt strony z nagłówków">{hs.map((h, i) => {
    const skip = i > 0 && h.level > hs[i - 1].level + 1;
    return <li key={i} style={{'--lvl': h.level - 1}} className={skip ? 'is-skip' : ''}><code>h{h.level}</code> {h.text || <em>(pusty nagłówek)</em>}{skip && <span className="hl-skip"> ⚠ pominięty poziom</span>}</li>;
  })}</ol>;
}

/* ───────── Wynik wyszukiwania (symulacja) ───────── */
function SerpView({root, url, query}) {
  const s = useMemo(() => serpPreview(root, url), [root, url]);
  const stat = (status, len, max, what) => {
    const ok = status === 'ok';
    const txt = status === 'missing' ? `brak — wyszukiwarka sama weźmie ${what === 'title' ? 'nagłówek lub adres' : 'kawałek tekstu ze strony'}`
      : status === 'short' ? 'za krótki — dopisz konkrety' : status === 'long' ? 'za długi — końcówka zostanie ucięta' : 'w sam raz';
    return <li className={ok ? 'is-ok' : 'is-bad'}><span aria-hidden="true">{ok ? '✓' : '✗'}</span><span><b>{what === 'title' ? '<title>' : '<meta name="description">'}</b>: {len}/{max} znaków — {txt}</span></li>;
  };
  return <div className="hl-serp">
    <div className="hl-serp-search" aria-hidden="true"><Icon name="search" size={18}/><span>{query || 'szukana fraza'}</span></div>
    <div className="hl-serp-result" aria-label="Podgląd wyniku wyszukiwania">
      <div className="hl-serp-site"><span className="hl-serp-fav" aria-hidden="true">{(s.site[0] || 'w').toUpperCase()}</span><span><b>{s.site}</b><small>{s.breadcrumb}</small></span></div>
      <p className="hl-serp-title">{s.titleShown}</p>
      <p className="hl-serp-desc">{s.descShown || <em>(brak opisu)</em>}</p>
    </div>
    <ul className="hl-serp-stats">{stat(s.titleStatus, s.titleLen, SERP_TITLE_MAX, 'title')}{stat(s.descStatus, s.descLen, SERP_DESC_MAX, 'desc')}</ul>
    <p className="small muted">Symulacja. Prawdziwe wyszukiwarki same decydują, co pokażą — czasem przepisują tytuł albo wybierają inny fragment strony. Długości są przybliżone (liczą się piksele, nie znaki).</p>
  </div>;
}

/* ───────── Panele: kryteria, walidator, folder ───────── */
function Criteria({checks, results, hints, onHint, mode, done, passedLabel}) {
  const passed = checks.filter(c => results[c.id]?.ok).length;
  const title = mode === 'fix' ? `Błędy naprawione: ${passed}/${checks.length}` : `${passedLabel || 'Kryteria'}: ${passed}/${checks.length}`;
  return <section className="hl-criteria" aria-label={title}>
    <p className="hl-panel-title"><Icon name="check" size={16}/>{title}</p>
    <div className="hl-meter" aria-hidden="true"><span style={{width: `${checks.length ? passed / checks.length * 100 : 0}%`}}/></div>
    <ol>{checks.map(c => {
      const r = results[c.id] || {};
      const used = hints?.[c.id] || 0;
      const hl = hintList(c);
      return <li key={c.id} className={r.ok ? 'is-ok' : 'is-bad'}>
        <span className="hl-mark" aria-hidden="true">{r.ok ? '✓' : mode === 'fix' ? '!' : '○'}</span>
        <div>
          <span className="hl-sr">{r.ok ? 'Spełnione: ' : 'Jeszcze nie: '}</span>
          <b>{c.label}</b>
          {r.info && <span className="hl-info">{r.info}</span>}
          {used > 0 && <ul className="hl-hints">{hl.slice(0, used).map((h, i) => <li key={i}><Icon name="book" size={16}/><span><Rich text={h}/></span></li>)}</ul>}
          {!r.ok && used < hl.length && <button type="button" className="text-button hl-hint-btn" onClick={() => onHint(c.id)}>Podpowiedź{hl.length > 1 ? ` ${used + 1}/${hl.length}` : ''}{!done ? ' (−25% za to kryterium)' : ''}</button>}
        </div>
      </li>;
    })}</ol>
  </section>;
}
function Validator({items, onJump, collapsed}) {
  const errors = items.filter(i => i.sev === 'error').length;
  const list = items.length ? <ul className="hl-lint">{items.map((it, i) => <li key={i} className={`is-${it.sev}`}>
    <span className="hl-lint-sev">{it.sev === 'error' ? 'Błąd' : 'Uwaga'}</span>
    <button type="button" className="hl-lint-line" onClick={() => onJump(it)} aria-label={`Przejdź do linii ${it.line}${it.css ? ' w style.css' : ''}`}>{it.css ? 'style.css ' : ''}linia {it.line}</button>
    <span className="hl-lint-text">{it.text}</span>
  </li>)}</ul> : <p className="hl-lint-ok"><Icon name="check" size={16}/>Walidator nie widzi problemów.</p>;
  const head = <><Icon name="warning" size={16}/>Walidator: {items.length ? `${errors} ${errors === 1 ? 'błąd' : errors > 1 && errors < 5 ? 'błędy' : 'błędów'}, ${items.length - errors} ${items.length - errors === 1 ? 'uwaga' : 'uwag'}` : 'czysto'}</>;
  if (collapsed) return <details className="hl-validator"><summary className="hl-panel-title">{head}<span className="small muted"> — otwórz, jeśli utkniesz</span></summary>{list}</details>;
  return <section className="hl-validator" aria-label="Walidator"><p className="hl-panel-title">{head}</p>{list}</section>;
}
function Folder({cssTab, onInsert, readOnly}) {
  return <details className="hl-folder">
    <summary className="hl-panel-title"><Icon name="folder" size={16}/>Folder strony: index.html{cssTab ? ', style.css' : ''} i {imageNames.length} obrazków</summary>
    <p className="small">Obrazek pokaże się tylko wtedy, gdy plik o tej nazwie leży w folderze strony. Ścieżka <code className="hl-inline">C:\Users\…</code> działa wyłącznie na Twoim komputerze — po wysłaniu strony takiego pliku nie ma.</p>
    <ul className="hl-files">{imageNames.map(n => <li key={n}>
      <img src={imageDataUri(n)} alt="" width="48" height="36"/>
      <span><code>{n}</code><small>{IMAGES[n].label}</small></span>
      {!readOnly && <button type="button" className="text-button" onClick={() => onInsert(`<img src="${n}" alt="">`)} aria-label={`Wstaw obrazek ${n}`}>Wstaw</button>}
    </li>)}</ul>
  </details>;
}

function downloadFile(html, css, name) {
  const {doc} = buildDocument(html, css, {download: true});
  const url = URL.createObjectURL(new Blob([doc], {type: 'text/html;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ───────── Tryb „show”: produkt do pokazania nauczycielowi ───────── */
function ShowMode({data, value, onChange, answers, lesson}) {
  const all = (lesson?.sections || []).flatMap(s => s.activities);
  const src = all.find(a => a.type === 'htmlLab' && (a.id === data.from || a.stateKey === data.from) && (!data.fromMode || a.mode === data.fromMode));
  const sv = answers?.[data.from] || {};
  const mv = src?.stateKey && src?.mode ? sv.modes?.[src.mode] || {} : sv;
  const theme = src?.mode === 'theme' ? (src.themes || []).find(t => t.id === (mv.bestTheme || mv.theme)) || src.themes?.[0] : null;
  const html = sv.html ?? src?.html ?? '';
  const css = theme ? (mv.themes?.[theme.id]?.css ?? theme.css ?? src?.css ?? '') : (sv.css ?? src?.css ?? '');
  const a = useMemo(() => analyze(html, css), [html, css]);
  const checks = theme ? theme.checks : src?.checks || [];
  const results = useMemo(() => runChecks(checks, a, src?.keep), [checks, a, src]);
  const r = src ? labResult(src, mv) : null;
  const serpAct = data.withSerp ? all.find(x => x.type === 'htmlLab' && x.mode === 'serp' && (x.stateKey === data.from || x.id === data.from)) : null;
  const box = useRef(null);
  useEffect(() => { if (!value?.done) onChange({...(value || {}), done: true, score: 0, max: 0}); }, []);
  const h1 = nodeText(select(a.root, 'h1')[0]) || nodeText(select(a.root, 'title')[0]) || 'Moja strona';
  const passed = checks.filter(c => results[c.id]?.ok).length;
  return <section className="hl is-show" aria-labelledby={`${data.id}-title`}>
    <header className="hl-bar"><span className="hl-dots" aria-hidden="true"><i/><i/><i/></span><span className="hl-file"><Icon name="globe" size={16}/>{data.file || 'index.html'}</span><span className="hl-mode">{MODE_LABEL.show}</span><span className="hl-sim">symulacja</span></header>
    <div className="hl-body">
      <h3 id={`${data.id}-title`} className="hl-title">{data.title || 'Twoja strona — pokaż ją nauczycielowi'}</h3>
      <div className="hl-prompt"><Rich text={data.prompt || 'Strona żyje tylko w tej karcie przeglądarki. Pokaż ją nauczycielowi teraz: podgląd, kryteria i wynik są poniżej. Odświeżenie strony usuwa pracę — jeśli chcesz ją zachować, pobierz plik .html.'}/></div>
      {!src || !html.trim() ? <p className="hl-note"><Icon name="warning" size={18}/>Nie ma jeszcze strony do pokazania. Wróć do etapu z edytorem.</p> : <>
        <div className="hl-show-head">
          <p><b>{h1}</b>{theme && <> · motyw „{theme.name}”</>}<br/><span className="small">{r?.summary || `${passed}/${checks.length} kryteriów`}{r && r.max > 0 && <> · {pts(r.score)}/{r.max} pkt</>}</span></p>
          <div className="hl-toolbar">
            <button type="button" className="btn secondary" onClick={() => box.current?.requestFullscreen?.()}><Icon name="projector" size={18}/>Pełny ekran</button>
            <button type="button" className="btn secondary" onClick={() => downloadFile(html, css, downloadName(h1))}><Icon name="download" size={18}/>Pobierz plik .html</button>
          </div>
        </div>
        <div className="hl-show-frame" ref={box}><Preview html={html} css={css} title={`Podgląd strony ucznia: ${h1}`} height="460px"/></div>
        {serpAct && <div className="hl-view"><SerpView root={a.root} url={serpAct.url} query={serpAct.query}/></div>}
        {checks.length > 0 && <ul className="hl-show-checks" aria-label="Kryteria strony">{checks.map(c => <li key={c.id} className={results[c.id]?.ok ? 'is-ok' : 'is-bad'}><span aria-hidden="true">{results[c.id]?.ok ? '✓' : '✗'}</span><span className="hl-sr">{results[c.id]?.ok ? 'Spełnione: ' : 'Niespełnione: '}</span>{c.label}</li>)}</ul>}
      </>}
    </div>
  </section>;
}

/* ───────── Główny komponent ───────── */
export default function HtmlLab(props) {
  if (props.data.mode === 'show') return <ShowMode {...props}/>;
  return <Lab {...props}/>;
}

function Lab({data, value, onChange}) {
  const mode = data.mode || 'free';
  const shared = !!(data.stateKey && data.mode);
  const root = value || {};
  const mv = shared ? root.modes?.[mode] || {} : root;
  const themes = data.themes || [];
  const theme = mode === 'theme' ? themes.find(t => t.id === mv.theme) || themes[0] : null;
  const tv = theme ? mv.themes?.[theme.id] || {} : null;
  const html = mode === 'theme' ? data.html : root.html ?? data.html ?? '';
  const css = theme ? tv.css ?? theme.css ?? data.css ?? '' : root.css ?? data.css ?? '';
  const cssTab = !!(data.cssTab || mode === 'theme');
  const [tab, setTab] = useState(mode === 'theme' || data.startTab === 'css' ? 'css' : 'html');
  const [view, setView] = useState(mode === 'serp' ? 'serp' : 'preview');
  const ta = useRef(null);
  const checks = theme ? theme.checks : data.checks || [];
  const hints = theme ? tv.hints || {} : mv.hints || {};

  const a = useMemo(() => analyze(html, css), [html, css]);
  const results = useMemo(() => runChecks(checks, a, data.keep), [checks, a, data.keep]);
  const issues = useMemo(() => lint(a, {cssTab}), [a, cssTab]);
  const res = passMap(results);
  const h1 = nodeText(select(a.root, 'h1')[0]);
  const title = nodeText(select(a.root, 'title')[0]);
  const ratio = Object.values(results).find(r => r.ratio)?.ratio;
  const edited = mode === 'free' ? html.replace(/\s+/g, ' ').trim() !== (data.html || '').replace(/\s+/g, ' ').trim() : undefined;

  function commit(next) {
    const nh = next.html ?? html, nc = next.css ?? css;
    let m = {...mv};
    if (next.theme) m.theme = next.theme;
    if (mode === 'theme') {
      const th = themes.find(t => t.id === (next.theme || m.theme)) || themes[0];
      const cur = m.themes?.[th.id] || {};
      const c = next.css ?? cur.css ?? th.css ?? data.css ?? '';
      const ra = runChecks(th.checks, analyze(nh, c), data.keep);
      m.themes = {...(m.themes || {}), [th.id]: {...cur, css: c, res: passMap(ra), hints: {...(cur.hints || {}), ...(next.hint ? {[next.hint]: (cur.hints?.[next.hint] || 0) + 1} : {})}, ratio: Object.values(ra).find(r => r.ratio)?.ratio}};
      m.theme = th.id;
    } else {
      const an = analyze(nh, nc);
      m.res = passMap(runChecks(checks, an, data.keep));
      if (next.hint) m.hints = {...(m.hints || {}), [next.hint]: (m.hints?.[next.hint] || 0) + 1};
      m.h1 = nodeText(select(an.root, 'h1')[0]);
      m.title = nodeText(select(an.root, 'title')[0]);
      if (mode === 'free') m.edited = m.edited || nh.replace(/\s+/g, ' ').trim() !== (data.html || '').replace(/\s+/g, ' ').trim();
    }
    const r = labResult(data, m);
    const out = {done: r.done, score: r.score, max: r.max, summary: r.summary};
    if (mode === 'theme') out.bestTheme = r.bestTheme;
    if (shared) onChange({...root, ...(mode !== 'theme' ? {html: nh, css: nc} : {}), modes: {...(root.modes || {}), [mode]: {...m, ...out}}});
    else onChange({...root, ...m, ...(mode !== 'theme' ? {html: nh, css: nc} : {}), ...out});
  }
  // Stan zapisany zawsze odpowiada temu, co widać (np. po powrocie do etapu ze wspólnym stateKey).
  const stored = theme ? tv.res : mv.res;
  useEffect(() => {
    if (!value && mode !== 'theme' && !Object.values(res).some(Boolean)) return;
    if (theme && !tv.res && !Object.values(res).some(Boolean)) return;
    if (JSON.stringify(stored || {}) !== JSON.stringify(res)) commit({});
  }, [JSON.stringify(res)]);

  const r = labResult(data, mv);
  const max = labMax(data);
  const setCode = v => commit(tab === 'css' ? {css: v} : {html: v});
  function insert(code) {
    const el = ta.current;
    const src = tab === 'css' ? css : html;
    const pos = el ? el.selectionStart : src.length;
    const out = insertSnippet(src, pos, code);
    setCode(out.value);
    requestAnimationFrame(() => { if (ta.current) { ta.current.focus(); ta.current.setSelectionRange(out.caret, out.caret); } });
  }
  function jump(it) {
    const toCss = !!it.css;
    if (toCss !== (tab === 'css')) setTab(toCss ? 'css' : 'html');
    requestAnimationFrame(() => goToLine(ta.current, toCss ? css : html, it.line));
  }
  const marks = {};
  for (const it of issues) if (!!it.css === (tab === 'css') && (!marks[it.line] || it.sev === 'error')) marks[it.line] = it.sev === 'error' ? 'error' : 'warn';
  const readOnly = tab === 'html' && (mode === 'theme' || data.lockHtml);
  const snippets = tab === 'css' ? CSS_SNIPPETS : SNIPPETS;
  const showSnippets = data.snippets !== false && !readOnly && mode !== 'fix';
  const done = r.done;
  const fileName = tab === 'css' ? 'style.css' : 'index.html';
  const keysId = `${data.id}-keys`;

  return <section className={`hl ${done ? 'is-done' : ''}`} aria-labelledby={`${data.id}-title`}>
    <header className="hl-bar">
      <span className="hl-dots" aria-hidden="true"><i/><i/><i/></span>
      <span className="hl-file"><Icon name="code" size={16}/>{data.site || 'moja-strona'}/{fileName}</span>
      <span className="hl-mode">{MODE_LABEL[mode]}</span>
      <span className="hl-sim">symulacja</span>
      {max > 0 && <span className="hl-score" aria-label={`Punkty: ${r.score} z ${max}`}>{done && <Icon name="check" size={16}/>}{pts(r.score)}/{max} pkt</span>}
    </header>
    <div className="hl-body">
      <h3 id={`${data.id}-title`} className="hl-title">{data.title}</h3>
      {data.prompt && <div className="hl-prompt"><Rich text={data.prompt}/></div>}
      {data.card && <details className="hl-card"><summary><Icon name="idcard" size={18}/>{data.card.title || 'Karta zadania'}</summary><Rich text={data.card.text}/></details>}
      {mode === 'theme' && <fieldset className="hl-themes"><legend>Wybierz motyw (możesz wypróbować kilka — liczy się najlepszy)</legend>
        <div className="hl-theme-list">{themes.map(t => {
          const st = mv.themes?.[t.id];
          const p = st?.res ? t.checks.filter(c => st.res[c.id]).length : 0;
          return <button type="button" key={t.id} className={`hl-theme ${theme.id === t.id ? 'is-on' : ''}`} aria-pressed={theme.id === t.id} onClick={() => commit({theme: t.id})}>
            <span className="hl-swatch" aria-hidden="true">{(t.swatch || []).map((c, i) => <i key={i} style={{background: c}}/>)}</span>
            <b>{t.name}</b><small>{t.desc}</small><small className="hl-theme-score">{p}/{t.checks.length} kryteriów</small>
          </button>;
        })}</div>
      </fieldset>}
      <div className="hl-grid">
        <div className="hl-col">
          <div className="hl-tabs" role="group" aria-label="Pliki strony">
            <button type="button" aria-pressed={tab === 'html'} className={tab === 'html' ? 'is-on' : ''} onClick={() => setTab('html')}><Icon name="code" size={16}/>index.html{readOnly || (mode === 'theme') ? ' (tylko do odczytu)' : ''}</button>
            {cssTab && <button type="button" aria-pressed={tab === 'css'} className={tab === 'css' ? 'is-on' : ''} onClick={() => setTab('css')}><Icon name="palette" size={16}/>style.css</button>}
          </div>
          {showSnippets && <div className="hl-snippets" role="group" aria-label={tab === 'css' ? 'Wstaw regułę CSS' : 'Wstaw znacznik'}>
            <span className="small">Wstaw:</span>{snippets.map(s => <button type="button" key={s.label} title={s.title} onClick={() => insert(s.code)}>{tab === 'css' ? s.label : `<${s.label}>`}</button>)}
          </div>}
          <Editor key={tab} id={`${data.id}-${tab}`} taRef={ta} value={tab === 'css' ? css : html} lang={tab} onChange={setCode} readOnly={readOnly}
            label={`${fileName} — edytor kodu${readOnly ? ' (tylko do odczytu)' : ''}: ${data.title}`} describedBy={keysId} marks={marks}/>
          <p className="hl-keys" id={keysId}>Tab — wcięcie · Shift+Tab — cofnij wcięcie · Ctrl+Z — cofnij · Esc, potem Tab — wyjście z edytora</p>
          <div className="hl-toolbar">
            {!readOnly && <button type="button" className="text-button" onClick={() => {
              const start = tab === 'css' ? (theme ? theme.css ?? data.css ?? '' : data.css ?? '') : data.html ?? '';
              if ((tab === 'css' ? css : html) === start || window.confirm('Przywrócić kod startowy? Twoje zmiany w tym pliku znikną.')) setCode(start);
            }}><Icon name="reset" size={18}/>Kod startowy</button>}
            {data.download !== false && <button type="button" className="text-button" onClick={() => downloadFile(html, css, downloadName(h1 || title || data.product))}><Icon name="download" size={18}/>Pobierz plik .html</button>}
          </div>
        </div>
        <div className="hl-col">
          <div className="hl-tabs" role="group" aria-label="Widok strony">
            {mode === 'serp' && <button type="button" aria-pressed={view === 'serp'} className={view === 'serp' ? 'is-on' : ''} onClick={() => setView('serp')}><Icon name="search" size={16}/>Wyszukiwarka</button>}
            <button type="button" aria-pressed={view === 'preview'} className={view === 'preview' ? 'is-on' : ''} onClick={() => setView('preview')}><Icon name="globe" size={16}/>Podgląd</button>
            <button type="button" aria-pressed={view === 'reader'} className={view === 'reader' ? 'is-on' : ''} onClick={() => setView('reader')}><Icon name="headphones" size={16}/>Czytnik ekranu</button>
            <button type="button" aria-pressed={view === 'outline'} className={view === 'outline' ? 'is-on' : ''} onClick={() => setView('outline')}><Icon name="list" size={16}/>Konspekt</button>
          </div>
          <div className="hl-view">
            {view === 'preview' && <div className="hl-browser">
              <div className="hl-browser-bar" aria-hidden="true"><span className="hl-browser-tab">{title || 'Bez tytułu'}</span><span className="hl-browser-url">{(data.site || 'moja-strona')}/index.html</span></div>
              <Preview html={html} css={cssTab ? css : ''} title={`Podgląd na żywo: ${data.title}`}/>
            </div>}
            {view === 'reader' && <div className="hl-reader"><p className="small hl-pad">Symulacja czytnika ekranu: tak niewidoma osoba „usłyszy” stronę od góry do dołu.</p><ScreenReaderView root={a.root}/></div>}
            {view === 'outline' && <div className="hl-reader"><p className="small hl-pad">Konspekt z nagłówków — jak okienko nawigacji w Wordzie. Wyszukiwarki i czytniki ekranu korzystają z niego tak samo.</p><OutlineView root={a.root}/></div>}
            {view === 'serp' && <SerpView root={a.root} url={data.url} query={data.query}/>}
          </div>
          {mode !== 'free' && checks.length > 0 && <Criteria checks={checks} results={results} hints={hints} mode={mode} done={done} passedLabel={data.criteriaLabel} onHint={id => commit({hint: id})}/>}
          {mode === 'free' && <p className={`hl-feedback ${edited || mv.edited ? 'is-ok' : ''}`} role="status"><Icon name={edited || mv.edited ? 'check' : 'code'} size={18}/>{edited || mv.edited ? (data.doneText || 'Zmieniono kod — podgląd od razu pokazuje efekt.') : (data.waitText || 'Zmień coś w kodzie po lewej i patrz na podgląd.')}</p>}
        </div>
      </div>
      <Validator items={issues} onJump={jump} collapsed={mode === 'fix'}/>
      <Folder cssTab={cssTab} onInsert={insert} readOnly={readOnly || mode === 'fix'}/>
      {mode !== 'free' && <p className={`hl-feedback ${done ? 'is-ok' : ''}`} role="status">
        <Icon name={done ? 'trophy' : 'right'} size={18}/>
        {done ? `${data.doneText || 'Zadanie zaliczone!'} ${r.summary || ''}` : `${mode === 'fix' ? 'Do naprawy' : 'Do spełnienia'} zostało: ${checks.length - checks.filter(c => results[c.id]?.ok).length}.${data.minDone && data.minDone < checks.length ? ` Etap zaliczysz od ${data.minDone}/${checks.length}.` : ''}`}
        {ratio ? ` Kontrast: ${fmtRatio(ratio)}.` : ''}
      </p>}
    </div>
  </section>;
}
