import React, {useLayoutEffect, useRef, useState} from 'react';
import {editorKey, applyEdit, tokenizeLine} from '../../../content/sims/pythonLab.js';

/** Pokolorowana linia kodu. */
export function CodeLine({line}) {
  if (!line) return '​';
  return tokenizeLine(line).map((t, i) => t.t === 'txt' || t.t === 'id' ? <React.Fragment key={i}>{t.v}</React.Fragment> : <span key={i} className={`pl-t-${t.t}`}>{t.v}</span>);
}

/**
 * Edytor kodu: textarea nad pokolorowaną warstwą <pre>. Tab = 4 spacje, Shift+Tab = cofnij wcięcie,
 * Enter = automatyczne wcięcie (po „:” +4), Backspace w wcięciu usuwa 4 spacje.
 * Esc, a potem Tab → wyjście z edytora (dostępność klawiatury).
 */
export function CodeEditor({id, value, onChange, errorLine, label, describedBy, onRun}) {
  const ta = useRef(null);
  const pendingSel = useRef(null);
  const [escaped, setEscaped] = useState(false);
  const lines = value.split('\n');
  const longest = Math.max(20, ...lines.map(l => l.length));

  useLayoutEffect(() => {
    const s = pendingSel.current;
    if (s && ta.current) { ta.current.setSelectionRange(s[0], s[1]); pendingSel.current = null; }
  });

  function onKeyDown(e) {
    if (e.key === 'Escape') { setEscaped(true); return; }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); onRun?.(); return; }
    if (e.key === 'Tab' && escaped) { setEscaped(false); return; }
    setEscaped(false);
    if (!['Tab', 'Enter', 'Backspace'].includes(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.currentTarget;
    const edit = editorKey(el.value, el.selectionStart, el.selectionEnd, e.key, e.shiftKey);
    if (!edit) return;
    e.preventDefault();
    // execCommand zachowuje historię Ctrl+Z; gdy niedostępne — zwykła zmiana stanu.
    el.setSelectionRange(edit.from, edit.to);
    let ok = false;
    try { ok = edit.insert === '' && edit.to > edit.from ? document.execCommand('delete') : document.execCommand('insertText', false, edit.insert); } catch { ok = false; }
    if (ok && el.value === applyEdit(value, edit)) {
      el.setSelectionRange(edit.selStart, edit.selEnd);
    } else {
      pendingSel.current = [edit.selStart, edit.selEnd];
      onChange(applyEdit(value, edit));
    }
  }

  return <div className="pl-editor">
    <div className="pl-gutter" aria-hidden="true">{lines.map((_, i) => <span key={i} className={errorLine === i + 1 ? 'is-error' : ''}>{errorLine === i + 1 ? '⚠ ' : ''}{i + 1}</span>)}</div>
    <div className="pl-editor-scroll">
      <div className="pl-editor-inner" style={{width: `calc(${longest + 2}ch + 28px)`, '--rows': lines.length}}>
        <pre className="pl-hl" aria-hidden="true">{lines.map((l, i) => <div key={i} className={errorLine === i + 1 ? 'pl-line is-error' : 'pl-line'}><CodeLine line={l}/></div>)}</pre>
        <textarea ref={ta} id={id} className="pl-textarea" value={value} aria-label={label} aria-describedby={describedBy}
          spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off"
          onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} onBlur={() => setEscaped(false)}/>
      </div>
    </div>
  </div>;
}

/** Kod tylko do odczytu z numeracją, bieżącą linią (➜), poprzednią (✓) i linią błędu (⚠). */
export function CodeView({code, current, previous, errorLine, label}) {
  const lines = code.replace(/\n+$/, '').split('\n');
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current?.querySelector('.is-current');
    const box = ref.current;
    if (el && box && box.scrollHeight > box.clientHeight) {
      const top = el.offsetTop - box.clientHeight / 2;
      box.scrollTop = Math.max(0, top);
    }
  }, [current]);
  return <div className="pl-view" ref={ref} role="region" aria-label={label || 'Kod programu'} tabIndex={0}>
    <ol className="pl-view-lines">{lines.map((l, i) => {
      const n = i + 1;
      const cls = n === errorLine ? 'is-error' : n === current ? 'is-current' : n === previous ? 'is-previous' : '';
      const mark = n === errorLine ? '⚠' : n === current ? '➜' : n === previous ? '✓' : '';
      return <li key={i} className={cls}><span className="pl-view-num" aria-hidden="true"><b>{mark}</b>{n}</span><code><CodeLine line={l}/></code>{n === current && <span className="pl-sr">(ta linia wykona się teraz)</span>}</li>;
    })}</ol>
  </div>;
}
