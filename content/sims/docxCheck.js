// Sprawdzarka pliku DOCX ucznia (lekcje Worda 28–33). Czysta logika — bez Reacta i DOM, testowalna w Node 22.
// Plik czyta wyłącznie przeglądarka (lokalnie); do stanu lekcji trafiają tylko wyniki sprawdzeń, nazwa pliku i data.
//
// Aktywność: {type:'docxCheck', id, title, points, filename?, expect?:[teksty z pliku startowego], checks:[
//   {id, label, points, kind, ...parametry, hint?}  ]}
// Rodzaje (kind) — opis parametrów przy każdej funkcji w KINDS poniżej oraz w docs/word-desktop.md.
import {readDocx, styleProp, findStyle, styleLabel, plain} from './docx/model.js';
export {DocxError} from './docx/zip.js';

// ——— Tekst ———
export const norm = s => String(s ?? '').toLocaleLowerCase('pl').replace(/[   ]/g, ' ').replace(/[‐‑‒–—―]/g, '-')
 .replace(/[„”“"]/g, '"').replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim();
// Wzorzec: tekst (fragment, bez wielkości liter) | {word:'sie'} (całe słowo) | {any:[…]} (dowolny z wariantów)
export function has(text, needle) {
 const t = norm(text);
 if (needle && typeof needle === 'object') {
  if (needle.any) return needle.any.some(n => has(text, n));
  if (needle.word) return new RegExp(`(?<![\\p{L}\\p{N}])${norm(needle.word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u').test(t);
 }
 return t.includes(norm(needle));
}
const show = n => n && typeof n === 'object' ? (n.label || n.word || (n.any || []).join(' / ')) : String(n);
const q = s => `„${String(s).length > 70 ? String(s).slice(0, 67) + '…' : s}”`;
const list = arr => arr.map(q).join(', ');
const plural = (n, one, few, many) => `${n} ${n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many}`;

// ——— Pomocnicze widoki modelu ———
function cache(model, key, fn) { model._c ||= {}; return model._c[key] ??= fn(); }
const bodyParas = model => model.paragraphs;
export function tocs(model) {
 return cache(model, 'tocs', () => model.fields.filter(f => f.type === 'TOC').map(f => {
  const label = typeof f.sw.c === 'string' ? f.sw.c : typeof f.sw.a === 'string' ? f.sw.a : null;
  const entries = [];
  for (const pid of f.paras) {
   const p = model.byId[pid];
   if (!p || p.kind !== 'p') continue;
   let s = '';
   for (const g of p.segs) {
    if (g.t !== 'text' || g.del || !g.fids.includes(f.id)) continue;
    if (g.fids.some(id => id !== f.id && model.fieldById[id]?.type === 'PAGEREF')) continue;
    s += g.v;
   }
   const t = (s.includes('\t') ? s.slice(0, s.lastIndexOf('\t')) : s).replace(/\t/g, ' ').trim();
   if (!t) continue;
   const lv = p.styleKey.match(/^toc (\d)$/);
   entries.push({text: t, level: lv ? Number(lv[1]) : 1, paraId: pid});
  }
  const empty = entries.length === 1 && /nie znaleziono|no table of contents|brak (pozycji|wpis)|no table of figures/i.test(entries[0].text);
  return {field: f, figures: !!label || f.sw.c === true, label, entries: empty ? [] : entries, emptyMessage: empty, paraIds: new Set(f.paras)};
 }));
}
const inAnyToc = (model, id) => tocs(model).some(t => t.paraIds.has(id));
// Konspekt jak okienko nawigacji Worda: akapity z poziomem konspektu (style nagłówków lub poziom w stylu).
export function outline(model) {
 return cache(model, 'outline', () => bodyParas(model).filter(p => p.level > 0 && !p.inBox && p.text.trim() && !inAnyToc(model, p.id)).map(p => ({id: p.id, level: p.level, text: p.text.trim(), style: p.styleName})));
}
function blockText(model, b) {
 if (b.kind === 'p') return b.text + ' ' + b.segs.filter(g => g.t === 'box').flatMap(g => g.ids.map(id => model.byId[id]?.text || '')).join(' ');
 return b.rows.flatMap(r => r.flatMap(c => c.blocks.map(x => blockText(model, x)))).join(' ');
}
export function sectionOf(model, needle) {
 const b = model.blocks.find(x => !(x.kind === 'p' && inAnyToc(model, x.id)) && has(blockText(model, x), needle));
 return b ? b.section : -1;
}
const findPara = (model, needle) => { const ps = bodyParas(model).filter(p => !inAnyToc(model, p.id)); return ps.find(p => p.level > 0 && has(p.text, needle)) || ps.find(p => has(p.text, needle)); };
const partText = (model, path) => (path && model.parts[path]?.text) || '';
const partFields = (model, path) => (path && model.parts[path]?.fields) || [];
const secName = (model, i) => model.sections.length > 1 ? `sekcja ${i + 1}` : 'dokument';
const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
// „sekcja 2 (pierwsza strona): …” albo sam opis, gdy dokument ma jedną sekcję i jeden wariant.
const where = (m, i, type, msg) => { const w = [m.sections.length > 1 ? `sekcja ${i + 1}` : '', TYPE_PL[type]].filter(Boolean).join(' '); return w ? `${w}: ${msg}` : msg; };
// Nagłówki/stopki faktycznie używane w sekcji (z dziedziczeniem „Połącz z poprzednim”).
function usedParts(model, sec, kind) {
 const out = [{type: 'default', path: sec.eff[kind].default}];
 if (sec.titlePg) out.push({type: 'first', path: sec.eff[kind].first});
 if (model.evenAndOdd) out.push({type: 'even', path: sec.eff[kind].even});
 return out;
}
const TYPE_PL = {default: '', first: '(pierwsza strona — włączone „Inna pierwsza strona”)', even: '(strony parzyste)'};
function containerIndex(model) {
 return cache(model, 'siblings', () => {
  const map = {};
  const reg = list => list.forEach((b, i) => { map[b.id] = {list, i}; if (b.kind === 'table') b.rows.forEach(r => r.forEach(c => reg(c.blocks))); });
  reg(model.blocks);
  return map;
 });
}
const isEmptyBlock = b => b.kind === 'p' && !b.text.trim() && !b.hasImage && !b.segs.some(g => g.t === 'box');
function neighbour(model, id, dir) {
 const pos = containerIndex(model)[id];
 if (!pos) return null;
 for (let i = pos.i + dir; i >= 0 && i < pos.list.length; i += dir) { const b = pos.list[i]; if (!isEmptyBlock(b)) return b; }
 return null;
}
function captionsOf(model, label) {
 const seen = new Set(), out = [];
 for (const f of model.fields) {
  if (f.type !== 'SEQ' || plain(f.args[0]) !== plain(label)) continue;
  const p = f.paras.map(id => model.byId[id]).find(x => x?.kind === 'p');
  if (!p || seen.has(p.id)) continue;
  seen.add(p.id);
  out.push({para: p, num: f.result.trim(), field: f});
 }
 return out;
}
const captionCore = (text, label) => norm(text).replace(new RegExp('^' + norm(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[\\divxlc]*[\\s.:)\\-]*', 'i'), '').trim();
const stripNum = s => norm(s).replace(/^(\d+[.)]?)+(\s|$)/, '').replace(/^\d+(\.\d+)*\.?\s+/, '').trim();
function bodyText(model, view, from) {
 let ps = bodyParas(model);
 if (from) { const i = ps.findIndex(p => has(p.text, from)); ps = i >= 0 ? ps.slice(i) : []; }
 return ps.map(p => view === 'original' ? p.original : p.text).join('\n');
}
// Pary „brakujące / nieaktualne” między oczekiwanymi wpisami a tym, co jest w spisie.
function compareLists(want, got, key) {
 const used = new Set(), missing = [], matched = [];
 for (const w of want) {
  const k = key(w.text);
  const j = got.findIndex((g, i) => !used.has(i) && key(g.text) === k);
  if (j < 0) missing.push(w); else { used.add(j); matched.push([w, got[j], j]); }
 }
 const stale = got.filter((g, i) => !used.has(i));
 const order = matched.some(([, , j], i) => i > 0 && j < matched[i - 1][2]);
 const levels = matched.filter(([w, g]) => w.level && g.level && w.level !== g.level);
 return {missing, stale, order, levels};
}
function describeDiff(d, what) {
 const parts = [];
 if (d.stale.length) parts.push(`W ${what} jest nieaktualny wpis: ${list(d.stale.map(x => x.text))}.`);
 if (d.missing.length) parts.push(`Brakuje w ${what}: ${list(d.missing.map(x => x.text))}.`);
 if (d.levels.length) parts.push(`Inny poziom niż w treści: ${list(d.levels.map(([w]) => w.text))}.`);
 if (!parts.length && d.order) parts.push(`Wpisy w ${what} są w innej kolejności niż w dokumencie.`);
 return parts.join(' ');
}

// ——— Rodzaje sprawdzeń ———
// Każdy: {run(model, c) → {ok, detail, targets?:[id]}, hint(c) → domyślna wskazówka (gdy brak c.hint)}
export const KINDS = {
 // {style:'heading 1', min?, max?, texts?:[…]} — liczba niepustych akapitów w stylu (nazwa jak w Wordzie po angielsku albo polsku)
 styleCount: {
  run(m, c) {
   const label = styleLabel(c.style);
   const ps = bodyParas(m).filter(p => p.styleKey === c.style && p.text.trim() && !p.inBox && !inAnyToc(m, p.id));
   const missing = (c.texts || []).filter(t => !ps.some(p => has(p.text, t)));
   const n = ps.length, min = c.min ?? (c.texts?.length || 1);
   const out = [];
   let targets = [];
   if (n < min) out.push(`Masz ${plural(n, 'akapit', 'akapity', 'akapitów')} w stylu ${label} (wymagane: co najmniej ${min}).`);
   if (c.max !== undefined && n > c.max) {
    out.push(`Za dużo akapitów w stylu ${label}: ${n} (najwyżej ${c.max}). Zwykłe akapity treści mają mieć styl Normalny.`);
    targets = ps.filter(p => !(c.texts || []).some(t => has(p.text, t))).map(p => p.id);
   }
   if (missing.length) {
    out.push('Bez stylu ' + label + ': ' + missing.map(t => { const p = findPara(m, t); return p ? `${q(p.text.trim())} — ma styl ${p.styleName}` : `${q(show(t))} — nie ma takiego tekstu w dokumencie`; }).join('; ') + '.');
    targets.push(...missing.map(t => findPara(m, t)?.id).filter(Boolean));
   }
   const ok = !out.length;
   return {ok, detail: ok ? `${label}: ${list(ps.map(p => p.text.trim()).slice(0, 8))}${ps.length > 8 ? '…' : ''}.` : out.join(' '), targets: ok ? ps.map(p => p.id) : targets};
  },
  hint: c => `Kliknij w akapit (bez zaznaczania całej strony) → Narzędzia główne → Style → ${styleLabel(c.style)}. Sprawdź w Widok → Okienko nawigacji.`,
 },
 // {style, size?:pkt, color?:'dark'|'RRGGBB', bold?:bool} — właściwość definicji stylu (z dziedziczeniem) i brak ręcznych nadpisań w akapitach tego stylu
 styleProp: {
  run(m, c) {
   const label = styleLabel(c.style);
   const st = findStyle(m.styles, c.style);
   if (!st) return {ok: false, detail: `W dokumencie nie ma stylu ${label} — żaden akapit go nie używa.`};
   const ps = bodyParas(m).filter(p => p.styleKey === c.style && p.text.trim());
   const errs = [], found = [];
   if (c.size !== undefined) {
    const sz = styleProp(m.styles, st.id, 'size');
    found.push(`rozmiar ${String(sz).replace('.', ',')} pkt`);
    const direct = ps.filter(p => p.segs.some(g => g.t === 'text' && !g.del && g.v.trim() && g.size !== undefined && Math.abs(g.size - c.size) > 0.01));
    if (Math.abs(sz - c.size) > 0.01) {
     const manual = ps.length && ps.every(p => p.segs.filter(g => g.t === 'text' && g.v.trim()).every(g => g.size !== undefined && Math.abs(g.size - c.size) < 0.01));
     errs.push(manual ? `Akapity wyglądają na ${c.size} pkt, ale to ręczne formatowanie — sam styl ${label} ma ${String(sz).replace('.', ',')} pkt.` : `Styl ${label} ma ${String(sz).replace('.', ',')} pkt, a ma mieć ${c.size} pkt.`);
    } else if (direct.length) errs.push(`Styl ma ${c.size} pkt, ale ${plural(direct.length, 'akapit ma', 'akapity mają', 'akapitów ma')} ręcznie zmieniony rozmiar: ${list(direct.map(p => p.text.trim()))}.`);
    if (errs.length) errs.targets = direct.map(p => p.id);
   }
   if (c.color) {
    const col = styleProp(m.styles, st.id, 'color');
    const hex = /^[0-9a-f]{6}$/i.test(col || '') ? col : '000000';
    const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (c.color === 'dark' ? lum > 0.45 : hex.toLowerCase() !== c.color.toLowerCase()) errs.push(`Kolor stylu (#${hex}) jest za jasny — tekst będzie słabo czytelny.`);
   }
   if (c.bold !== undefined && !!styleProp(m.styles, st.id, 'bold') !== c.bold) errs.push(c.bold ? `Styl ${label} nie jest pogrubiony.` : `Styl ${label} jest pogrubiony.`);
   const ok = !errs.length;
   return {ok, detail: ok ? `Styl ${label}: ${found.join(', ') || 'zgodny'}.` : errs.join(' '), targets: errs.targets || []};
  },
  hint: c => `Narzędzia główne → Style → prawy przycisk na „${styleLabel(c.style)}” → Modyfikuj${c.size ? ` → rozmiar ${c.size} pkt` : ''} → OK. Ręcznie zmieniony tytuł: zaznacz go i naciśnij Ctrl+Spacja.`,
 },
 // {text} — napis w nagłówku strony na każdej stronie (każda sekcja; także pierwsza strona i parzyste, jeśli są osobne)
 headerText: {
  run(m, c) {
   const bad = [];
   m.sections.forEach((s, i) => usedParts(m, s, 'header').forEach(u => { if (!has(partText(m, u.path), c.text)) bad.push(where(m, i, u.type, u.path ? 'nagłówek bez tego napisu' : 'brak nagłówka')); }));
   if (!bad.length) return {ok: true, detail: `Napis ${q(c.text)} jest w nagłówku strony${m.sections.length > 1 ? ' we wszystkich sekcjach' : ''}.`, targets: ['header']};
   const inBody = bodyParas(m).find(p => has(p.text, c.text) && !p.level && p.styleKey !== 'title');
   return {ok: false, detail: `Brak napisu ${q(c.text)} — ${bad.join('; ')}.${inBody ? ' Taki tekst jest w treści dokumentu, a ma być w obszarze nagłówka strony.' : ''}`, targets: inBody ? [inBody.id, 'header'] : ['header']};
  },
  hint: c => `Wstawianie → Nagłówek → Pusty, wpisz „${c.text}” i kliknij Zamknij nagłówek i stopkę. Gdy brakuje go na 1. stronie, wyłącz „Inna pierwsza strona”.`,
 },
 // {text?} — pole PAGE w stopce każdej strony (+ opcjonalny tekst); wykrywa ręcznie wpisane cyfry
 footerPage: {
  run(m, c) {
   const bad = [], manual = [];
   m.sections.forEach((s, i) => usedParts(m, s, 'footer').forEach(u => {
    const hasPage = partFields(m, u.path).some(f => f.type === 'PAGE');
    const txt = partText(m, u.path);
    const why = [];
    if (!hasPage) { why.push(u.path ? 'stopka bez pola numeru strony' : 'brak stopki'); if (/\d/.test(txt)) manual.push(txt.trim()); }
    if (c.text && !has(txt, c.text)) why.push(`brak tekstu ${q(c.text)}`);
    if (why.length) bad.push(where(m, i, u.type, why.join(', ')));
   }));
   if (!bad.length) return {ok: true, detail: `Stopka ma automatyczne pole numeru strony${c.text ? ` i tekst ${q(c.text)}` : ''}.`, targets: ['footer']};
   const inHeader = Object.values(m.parts).some(p => p.kind === 'header' && p.fields.some(f => f.type === 'PAGE'));
   const inBody = m.fields.some(f => f.type === 'PAGE');
   let extra = '';
   if (manual.length) extra += ` W stopce wpisano ręcznie ${q(manual[0])} — taki numer nie zmieni się na kolejnych stronach.`;
   if (inHeader) extra += ' Pole numeru jest w nagłówku, a ma być w stopce.';
   if (inBody) extra += ' Pole numeru wstawiono w treść dokumentu zamiast do stopki.';
   return {ok: false, detail: cap1(bad.join('; ')) + '.' + extra, targets: ['footer']};
  },
  hint: c => `Kliknij dwukrotnie dół strony${c.text ? `, wpisz „${c.text}”` : ''} → Wstawianie → Numer strony → Bieżące położenie → Zwykły numer. Nie wpisuj cyfry z klawiatury.`,
 },
 // {levels?:[1,2]} — automatyczny spis treści (pole TOC bez \c) z wpisami; levels: poziomy, które spis musi obejmować
 toc: {
  run(m, c) {
   const t = tocs(m).filter(x => !x.figures);
   if (!t.length) {
    const fake = bodyParas(m).find(p => /spis tre/i.test(p.text) && p.level === 0);
    return {ok: false, detail: 'W dokumencie nie ma pola spisu treści.' + (has(m.paragraphs.map(p => p.text).join(' '), 'Miejsce na automatyczny spis') ? ' Nadal jest tekst zastępczy „Miejsce na automatyczny spis treści”.' : ''), targets: fake ? [fake.id] : []};
   }
   const toc = t[0];
   if (!toc.entries.length) return {ok: false, detail: toc.emptyMessage ? 'Spis jest wstawiony, ale Word nie znalazł pozycji — tytuły nie mają stylów nagłówków.' : 'Pole spisu treści jest puste.', targets: [...toc.paraIds]};
   const notes = [];
   const lv = String(toc.field.sw.o || '1-9').match(/(\d)\s*-\s*(\d)/);
   const range = lv ? [Number(lv[1]), Number(lv[2])] : [1, 9];
   const missingLv = (c.levels || []).filter(l => l < range[0] || l > range[1] || (outline(m).some(h => h.level === l) && !toc.entries.some(e => e.level === l)));
   if (missingLv.length) notes.push(`Spis nie obejmuje poziomu ${missingLv.join(', ')} (np. podrozdziałów w stylu Nagłówek ${missingLv[0]}).`);
   const ok = !notes.length;
   return {ok, detail: ok ? `Automatyczny spis treści: ${plural(toc.entries.length, 'wpis', 'wpisy', 'wpisów')}${toc.field.sw.h ? ', z hiperłączami (Ctrl+klik)' : ''}.` : notes.join(' '), targets: [...toc.paraIds]};
  },
  hint: () => 'Ustaw kursor w pustym akapicie, w którym ma być spis → Odwołania → Spis treści → Spis automatyczny. Nie przepisuj tytułów ręcznie.',
 },
 // {} — aktualność spisu: wpisy w wyniku pola TOC = bieżące nagłówki (tekst, poziom, kolejność). Numerów stron nie da się sprawdzić bez składu stron.
 tocCurrent: {
  run(m) {
   const toc = tocs(m).find(x => !x.figures);
   if (!toc) return {ok: false, detail: 'Brak pola spisu treści — nie ma czego aktualizować.'};
   const sw = toc.field.sw;
   const lv = String(sw.o || (sw.t ? '0-0' : '1-9')).match(/(\d)\s*-\s*(\d)/);
   const [a, b] = lv ? [Number(lv[1]), Number(lv[2])] : [1, 9];
   const custom = {};
   if (typeof sw.t === 'string') { const p = sw.t.split(/[;,]/); for (let i = 0; i + 1 < p.length; i += 2) custom[plain(p[i])] = Number(p[i + 1]); }
   const want = bodyParas(m).filter(p => p.text.trim() && !p.inBox && !toc.paraIds.has(p.id)).map(p => {
    const byStyle = custom[plain(p.styleName)] ?? custom[plain(m.styles.byId[p.styleId]?.name)];
    const level = byStyle || (p.level && (!p.styleOutline || sw.u) ? p.level : 0);
    return level >= a && level <= b && level > 0 || byStyle ? {text: p.text.trim(), level, id: p.id} : null;
   }).filter(Boolean);
   const d = compareLists(want, toc.entries, stripNum);
   const ok = !d.missing.length && !d.stale.length && !d.order && !d.levels.length;
   return {ok, detail: ok ? `Spis zgadza się z ${plural(want.length, 'nagłówkiem', 'nagłówkami', 'nagłówkami')} w treści.` : describeDiff(d, 'spisie'),
    targets: ok ? [] : [...d.stale.map(x => x.paraId), ...d.missing.map(x => x.id)]};
  },
  hint: () => 'Kliknij spis prawym przyciskiem → Aktualizuj pole → Aktualizuj cały spis → OK. Nie poprawiaj wpisów ręcznie w spisie — zmieniaj tytuł w treści. Potem Ctrl+S.',
 },
 // {seq:'Ilustracja', min, position?:'above'|'below', texts?:[…]} — podpisy z polem SEQ danej etykiety, z opisem, przy obiekcie
 captions: {
  run(m, c) {
   const caps = captionsOf(m, c.seq);
   const errs = [];
   const typed = bodyParas(m).filter(p => new RegExp('^' + c.seq + '\\s+\\d', 'i').test(p.text.trim()) && !caps.some(x => x.para.id === p.id) && !inAnyToc(m, p.id));
   if (caps.length < c.min) errs.push(`Podpisy z etykietą ${q(c.seq)}: ${caps.length} z ${c.min}.` + (typed.length ? ` ${list(typed.map(p => p.text.trim()))} ma numer wpisany ręcznie — to zwykły tekst, nie podpis.` : ''));
   const noDesc = caps.filter(x => captionCore(x.para.text, c.seq).replace(/[\s.:\-]/g, '').length < 3);
   if (noDesc.length) errs.push(`Bez opisu: ${list(noDesc.map(x => x.para.text.trim()))}.`);
   const wrongPos = [];
   if (c.position) for (const x of caps) {
    if (x.para.inBox) continue;
    if (c.position === 'above') { const nx = neighbour(m, x.para.id, 1); if (!nx || nx.kind !== 'table') wrongPos.push(x); }
    else {
     const before = x.para.segs.findIndex(g => g.t === 'img' || g.t === 'box') > -1;
     const pv = neighbour(m, x.para.id, -1);
     if (!before && !(pv && pv.kind === 'p' && (pv.hasImage || pv.segs.some(g => g.t === 'box')))) wrongPos.push(x);
    }
   }
   if (wrongPos.length) errs.push(`${list(wrongPos.map(x => x.para.text.trim()))} — podpis ma być ${c.position === 'above' ? 'bezpośrednio nad tabelą' : 'bezpośrednio pod obiektem'}.`);
   const missingTexts = (c.texts || []).filter(t => !caps.some(x => has(x.para.text, t)));
   if (missingTexts.length) errs.push(`Żaden podpis ${q(c.seq)} nie zawiera tekstu ${list(missingTexts.map(show))}.`);
   const ok = !errs.length;
   return {ok, detail: ok ? `Podpisy: ${list(caps.map(x => x.para.text.trim()))}.` : errs.join(' '), targets: ok ? caps.map(x => x.para.id) : [...new Set([...noDesc, ...wrongPos].map(x => x.para.id).concat(typed.map(p => p.id)))]};
  },
  hint: c => `Kliknij ${c.seq === 'Tabela' ? 'tabelę' : 'obiekt'} → Odwołania → Wstaw podpis → Etykieta: ${c.seq} (brak? Nowa etykieta) → Położenie: ${c.position === 'above' ? 'powyżej' : 'poniżej'} zaznaczonego elementu. Dopisz krótki opis po numerze.`,
 },
 // {seq:'Ilustracja', min?} — spis ilustracji: pole TOC \c "etykieta" z wpisami zgodnymi z bieżącymi podpisami (aktualność opisów)
 figureList: {
  run(m, c) {
   const t = tocs(m).find(x => x.figures && plain(x.label) === plain(c.seq));
   const caps = captionsOf(m, c.seq);
   if (!t) {
    const other = tocs(m).filter(x => x.figures).map(x => x.label);
    return {ok: false, detail: `Brak spisu z etykietą ${q(c.seq)}.${other.length ? ` Są spisy dla: ${list(other)}.` : ''}`};
   }
   if (!t.entries.length) return {ok: false, detail: `Spis ${q(c.seq)} jest pusty — Word nie znalazł podpisów z tą etykietą.`, targets: [...t.paraIds]};
   const d = compareLists(caps.map(x => ({text: x.para.text.trim(), id: x.para.id})), t.entries, s => captionCore(s, c.seq));
   const ok = !d.missing.length && !d.stale.length && !d.order && (c.min === undefined || t.entries.length >= c.min);
   return {ok, detail: ok ? `Spis ${q(c.seq)}: ${plural(t.entries.length, 'wpis', 'wpisy', 'wpisów')}, zgodny z podpisami.` : (describeDiff(d, `spisie ${q(c.seq)}`) || `Za mało wpisów w spisie: ${t.entries.length} z ${c.min}.`),
    targets: ok ? [] : [...d.stale.map(x => x.paraId), ...d.missing.map(x => x.id)]};
  },
  hint: c => `Kursor w pustym akapicie → Odwołania → Wstaw spis ilustracji → Etykieta podpisu: ${c.seq} → OK. Po zmianie opisu: prawy przycisk na spisie → Aktualizuj pole → Aktualizuj cały spis.`,
 },
 // {min, text?} — odsyłacze (pola REF) do istniejących zakładek, bez komunikatu błędu
 ref: {
  run(m, c) {
   // „REF _Ref123 \h” albo skrót „_Ref123 \h” (sama nazwa zakładki)
   const target = f => f.type === 'REF' ? f.args[0] : f.instr.trim().split(/\s+/)[0];
   const refs = m.fields.filter(f => f.type === 'REF' || /^_REF/.test(f.type));
   const broken = refs.filter(f => !m.bookmarks.has(target(f)) || /błąd|error/i.test(f.result));
   const good = refs.filter(f => !broken.includes(f) && (!c.text || has(f.result, c.text)));
   const ok = good.length >= (c.min ?? 1);
   return {ok, detail: ok ? `Odsyłacze: ${list(good.map(f => f.result.trim()))}.` : `Działające odsyłacze: ${good.length} z ${c.min ?? 1}.${broken.length ? ` Uszkodzone: ${broken.length} (element, do którego prowadzą, usunięto).` : ''}`,
    targets: [...broken, ...good].flatMap(f => f.paras)};
  },
  hint: () => 'Odwołania → Odsyłacz → Typ odwołania (np. Tabela) → Wstaw odwołanie do: Cała legenda / Tylko etykieta i numer → wybierz element → Wstaw.',
 },
 // {min, max?} — liczba sekcji
 sections: {
  run(m, c) {
   const n = m.sections.length;
   const ok = n >= (c.min ?? 2) && (c.max === undefined || n <= c.max);
   const desc = m.sections.map((s, i) => `${i + 1}: ${s.landscape ? 'pozioma' : 'pionowa'}${s.cols > 1 ? `, ${s.cols} kolumny` : ''}`).join('; ');
   return {ok, detail: `${plural(n, 'sekcja', 'sekcje', 'sekcji')} (${desc}).${!ok && n < (c.min ?? 2) ? ' Podział strony (Ctrl+Enter) nie tworzy nowej sekcji.' : ''}`, targets: ['sections']};
  },
  hint: () => 'Układ → Znaki podziału → Podziały sekcji → Następna strona (nowa orientacja) albo Ciągły (kolumny na tej samej stronie). Włącz ¶, aby widzieć granice.',
 },
 // {contains, only?:true} — sekcja zawierająca tekst jest pozioma; only: pozostałe są pionowe
 landscapeSection: {
  run(m, c) {
   const i = sectionOf(m, c.contains);
   if (i < 0) return {ok: false, detail: `Nie znaleziono w dokumencie tekstu ${q(c.contains)}.`};
   const s = m.sections[i], name = c.name || c.contains;
   const others = m.sections.map((x, k) => k !== i && x.landscape ? k : -1).filter(k => k >= 0);
   const errs = [];
   if (!s.landscape) errs.push(m.sections.length > 1 ? `${cap1(name)} jest w sekcji ${i + 1}, a ta sekcja jest pionowa.` : `${cap1(name)} jest pionowo — dokument ma jedną, pionową sekcję.`);
   if (c.only !== false && others.length) errs.push(m.sections.length === 1 ? 'Cały dokument jest poziomy — najpierw wydziel fragment podziałami sekcji.' : `Poziome są też inne części: ${others.map(k => `sekcja ${k + 1}`).join(', ')}.`);
   const ok = !errs.length;
   return {ok, detail: ok ? `${cap1(name)}: sekcja ${i + 1}, pozioma; pozostałe sekcje pionowe.` : errs.join(' '), targets: ['section-' + i]};
  },
  hint: () => 'Wstaw podziały sekcji Następna strona przed fragmentem i za nim. Kliknij w środek fragmentu → Układ → Orientacja → Pozioma (Ustawienia strony: Zastosuj do „Ta sekcja”).',
 },
 // {contains, cols:2, outside?:[teksty w 1 kolumnie], continuous?:true} — wybrany fragment w kolumnach, granice Ciągłe
 columnsSection: {
  run(m, c) {
   const i = sectionOf(m, c.contains);
   if (i < 0) return {ok: false, detail: `Nie znaleziono w dokumencie tekstu ${q(c.contains)}.`};
   const s = m.sections[i], errs = [], name = c.name || c.contains;
   const cols = c.cols ?? 2;
   if (s.cols < cols) errs.push(`${cap1(name)}: ${plural(s.cols, 'kolumna', 'kolumny', 'kolumn')} zamiast ${cols}.`);
   const wide = (c.outside || []).filter(t => { const k = sectionOf(m, t); return k >= 0 && m.sections[k].cols > 1; });
   if (wide.length) errs.push(`W kolumnach jest też ${list(wide)} — granica sekcji jest w złym miejscu.`);
   if (c.continuous !== false && s.cols >= cols) {
    if (s.start !== 'continuous') errs.push('Sekcja z kolumnami zaczyna się od nowej strony — użyj podziału Ciągły.');
    const next = m.sections[i + 1];
    if (next && next.start !== 'continuous') errs.push('Tekst za kolumnami zaczyna się od nowej strony — za kolumnami wstaw podział Ciągły.');
   }
   const ok = !errs.length;
   return {ok, detail: ok ? `${cap1(name)}: ${cols} kolumny w sekcji ${i + 1}, granice ciągłe.` : errs.join(' '), targets: ['section-' + i]};
  },
  hint: () => 'Wstaw Układ → Znaki podziału → Ciągły przed pierwszym i za ostatnim akapitem fragmentu. Kliknij między granicami → Układ → Kolumny → Dwie; poza nimi zostaw Jedna.',
 },
 // {contains, text, othersText} — inny nagłówek strony tylko w sekcji z danym tekstem
 sectionHeaders: {
  run(m, c) {
   const i = sectionOf(m, c.contains);
   if (i < 0) return {ok: false, detail: `Nie znaleziono w dokumencie tekstu ${q(c.contains)}.`};
   if (m.sections.length < 2) return {ok: false, detail: 'Dokument ma jedną sekcję, więc wszystkie strony mają ten sam nagłówek.'};
   const errs = [];
   m.sections.forEach((s, k) => {
    const t = partText(m, s.eff.header.default);
    if (k === i) { if (!has(t, c.text) || has(t, c.othersText)) errs.push(`sekcja ${k + 1} (${c.name || q(c.contains)}) ma nagłówek ${t.trim() ? q(t.trim()) : '— pusty'}, a ma ${q(c.text)}`); }
    else if (!has(t, c.othersText) || has(t, c.text)) errs.push(`sekcja ${k + 1} ma nagłówek ${t.trim() ? q(t.trim()) : '— pusty'}, a ma ${q(c.othersText)}`);
   });
   const ok = !errs.length;
   return {ok, detail: ok ? `${q(c.text)} tylko w sekcji ${i + 1}; w pozostałych ${q(c.othersText)}.` : cap1(errs.join('; ')) + '.', targets: ['header']};
  },
  hint: c => `Najpierw w nagłówku sekcji ZA fragmentem wyłącz Połącz z poprzednim. Potem w nagłówku tej sekcji też wyłącz Połącz z poprzednim i wpisz „${c.text}”.`,
 },
 // {min, anchor?} — komentarze z treścią; anchor: przynajmniej jeden zaczepiony przy danym tekście
 comments: {
  run(m, c) {
   const valid = m.comments.filter(x => x.text.replace(/\s/g, '').length >= 3);
   const errs = [];
   if (valid.length < (c.min ?? 1)) errs.push(`Komentarze: ${valid.length} z ${c.min ?? 1}.${m.comments.length > valid.length ? ' Puste komentarze się nie liczą.' : ''}`);
   if (c.anchor && !valid.some(x => has(x.anchor, c.anchor))) errs.push(`Brak komentarza przy fragmencie ${q(show(c.anchor))}.`);
   const ok = !errs.length;
   return {ok, detail: ok ? `${plural(valid.length, 'komentarz', 'komentarze', 'komentarzy')}${c.anchor ? `, w tym przy ${q(show(c.anchor))}` : ''}.` : errs.join(' '), targets: ['comments']};
  },
  hint: c => `Zaznacz fragment${c.anchor ? ` „${show(c.anchor)}”` : ''} → Recenzja → Nowy komentarz → wpisz uwagę (kliknij Opublikuj/Wyślij, jeśli jest). Zapisz plik.`,
 },
 // {min} — liczba zmian śledzonych (wstawienia, usunięcia, przeniesienia, zmiany formatu)
 trackedChanges: {
  run(m, c) {
   const r = m.revisions;
   const ins = r.filter(x => x.kind === 'ins').length, del = r.filter(x => x.kind === 'del').length;
   const ok = r.length >= (c.min ?? 1);
   return {ok, detail: `Zmiany śledzone: ${r.length} (wstawienia ${ins}, usunięcia ${del}${r.length - ins - del ? `, formatowanie ${r.length - ins - del}` : ''}).${!ok && m.trackRevisions === false ? ' Śledzenie zmian jest wyłączone.' : ''}`, targets: ['revisions']};
  },
  hint: () => 'Recenzja → Śledź zmiany (przycisk ma być podświetlony) i dopiero wtedy poprawiaj tekst. Zmian wprowadzonych wcześniej Word nie oznaczy.',
 },
 // {edits:[{before?, after?, label?}], from?} — poprawka wprowadzona ZE ŚLEDZENIEM: w wersji pierwotnej jest before, w wersji po zmianach after
 trackedEdit: {
  run(m, c) {
   const fin = bodyText(m, 'final', c.from), orig = bodyText(m, 'original', c.from);
   const errs = [], good = [];
   for (const e of c.edits || [c]) {
    const name = e.label || (e.after ? show(e.after) : `usunięcie: ${show(e.before)}`);
    if (e.after) {
     if (!has(fin, e.after)) errs.push(`${q(name)}: brak poprawki w tekście`);
     else if (has(orig, e.after)) errs.push(`${q(name)}: poprawka jest, ale bez śledzenia zmian`);
     else if (e.before && has(fin, e.before)) errs.push(`${q(name)}: stary tekst ${q(show(e.before))} nadal jest`);
     else good.push(name);
    } else if (e.before) {
     if (has(fin, e.before)) errs.push(`${q(show(e.before))}: nadal jest w tekście`);
     else if (!has(orig, e.before)) errs.push(`${q(show(e.before))}: usunięto bez śledzenia zmian`);
     else good.push(name);
    }
   }
   const ok = !errs.length;
   return {ok, detail: ok ? `Śledzone poprawki: ${list(good)}.` : errs.join('; ') + '.', targets: ['revisions']};
  },
  hint: () => 'Włącz Recenzja → Śledź zmiany. Zaznacz błędny fragment i wpisz poprawny — Word pokaże usunięcie (przekreślenie) i wstawienie (podkreślenie).',
 },
 // {} — kopia publikacyjna: brak komentarzy i nierozstrzygniętych zmian (także w nagłówkach i stopkach)
 cleanCopy: {
  run(m) {
   const r = m.revisions, cm = m.comments;
   const ok = !r.length && !cm.length;
   const samples = r.filter(x => x.text.trim()).slice(0, 3).map(x => (x.kind === 'ins' ? 'wstawienie ' : 'usunięcie ') + q(x.text.trim()));
   return {ok, detail: ok ? 'Brak komentarzy i zmian śledzonych — plik nadaje się do publikacji.' : `Zostały: ${plural(cm.length, 'komentarz', 'komentarze', 'komentarzy')}, ${plural(r.length, 'zmiana śledzona', 'zmiany śledzone', 'zmian śledzonych')}${samples.length ? ` (np. ${samples.join(', ')})` : ''}.${m.trackRevisions ? ' Śledzenie zmian jest nadal włączone.' : ''}`,
    targets: ['revisions', 'comments']};
  },
  hint: () => 'W kopii publikacyjnej: Recenzja → Następna → Akceptuj/Odrzuć każdą zmianę; Recenzja → Usuń → Usuń wszystkie komentarze w dokumencie; wyłącz Śledź zmiany; ustaw Wszystkie adiustacje i sprawdź. Ctrl+S.',
 },
 // {} — brak ręcznie wpisanych numerów stron (w nagłówkach, stopkach i w treści)
 noManualPageNumbers: {
  run(m) {
   const found = [];
   const typed = p => p.segs.filter(g => g.t === 'text' && !g.del && !g.fids.length).map(g => g.v).join('');
   for (const part of Object.values(m.parts)) for (const p of part.paragraphs) {
    const t = typed(p);
    if (/(^|\s)(strona|str\.?|s\.|page)\s*\d+/i.test(t) || (/^[\s\-–—|/]*\d{1,3}[\s\-–—|/]*$/.test(t) && !p.segs.some(g => g.fids?.length))) found.push({id: part.kind, text: p.text.trim()});
   }
   for (const p of bodyParas(m)) {
    if (p.inTable || p.numbered || inAnyToc(m, p.id)) continue;
    const t = typed(p).trim();
    if (/^(strona|str\.?)\s*\d+(\s*(z|\/)\s*\d+)?$/i.test(t) || /^[-–—]?\s*\d{1,3}\s*[-–—]?$/.test(t)) found.push({id: p.id, text: t});
   }
   const ok = !found.length;
   return {ok, detail: ok ? 'Nie znaleziono ręcznie wpisanych numerów stron.' : `Ręcznie wpisany numer: ${list(found.map(x => x.text))} — nie zmieni się po dodaniu strony.`, targets: found.map(x => x.id)};
  },
  hint: () => 'Usuń wpisane cyfry. Kliknij dwukrotnie stopkę → Wstawianie → Numer strony → Bieżące położenie → Zwykły numer.',
 },
 // {} — brak „udawanych nagłówków”: krótkich akapitów Normalny pogrubionych albo powiększonych ręcznie
 noFakeHeadings: {
  run(m) {
   const SKIP = new Set(['title', 'subtitle', 'caption', 'toc heading', 'table of figures', 'header', 'footer']);
   const normalSize = styleProp(m.styles, findStyle(m.styles, 'normal')?.id, 'size') || 11;
   const ps = bodyParas(m), fake = [];
   ps.forEach((p, i) => {
    if (p.inTable || p.inBox || p.level > 0 || SKIP.has(p.styleKey) || /^toc /.test(p.styleKey) || inAnyToc(m, p.id)) return;
    const text = p.text.trim();
    if (text.length < 2 || text.length > 90 || /[.!?:;,]$/.test(text) || /^spis\s/i.test(text)) return;
    const segs = p.segs.filter(g => g.t === 'text' && !g.del && g.v.trim());
    if (!segs.length) return;
    const bold = segs.every(g => g.bold ?? !!styleProp(m.styles, p.styleId, 'bold'));
    const big = segs.every(g => (g.size ?? styleProp(m.styles, p.styleId, 'size')) >= Math.max(14, normalSize + 2));
    const next = ps.slice(i + 1).find(x => x.text.trim());
    if ((bold || big) && next && !next.inTable) fake.push(p);
   });
   const ok = !fake.length;
   return {ok, detail: ok ? 'Tytuły rozdziałów mają style nagłówków, nie ręczne pogrubienie.' : `Wyglądają na tytuły, ale mają styl ${fake[0].styleName}${fake.length > 1 ? ' i in.' : ''}: ${list(fake.map(p => p.text.trim()))}. Nie trafią do nawigacji ani spisu treści.`, targets: fake.map(p => p.id)};
  },
  hint: () => 'Kliknij w taki tytuł → Narzędzia główne → Style → Nagłówek 1 (rozdział) lub Nagłówek 2 (podrozdział). Ręczne pogrubienie usuniesz Ctrl+Spacja.',
 },
 // {contains?:[…], absent?:[…], from?} — tekst dokumentu (widok po zmianach); from: sprawdzaj od akapitu z tym tekstem
 text: {
  run(m, c) {
   if (c.from && !bodyParas(m).some(p => has(p.text, c.from))) return {ok: false, detail: `Nie znaleziono fragmentu ${q(c.from)} — sprawdź, czy wgrywasz właściwy plik i czy nie usunięto tego tytułu.`};
   const t = bodyText(m, 'final', c.from);
   const miss = (c.contains || []).filter(x => !has(t, x)), extra = (c.absent || []).filter(x => has(t, x));
   const errs = [];
   if (miss.length) errs.push(`Brakuje: ${list(miss.map(show))}.`);
   if (extra.length) errs.push(`Nadal jest: ${list(extra.map(show))}.`);
   const ok = !errs.length;
   const ids = ok ? [] : bodyParas(m).filter(p => extra.some(x => has(p.text, x))).map(p => p.id);
   return {ok, detail: ok ? 'Tekst zgodny z ustaleniami.' : errs.join(' '), targets: ids};
  },
  hint: () => 'Porównaj tekst z danymi w dokumencie i popraw różnice.',
 },
 // {text, style} — akapit zawierający tekst ma dany styl
 paragraphStyle: {
  run(m, c) {
   const p = bodyParas(m).find(x => has(x.text, c.text) && !inAnyToc(m, x.id));
   if (!p) return {ok: false, detail: `Nie ma akapitu z tekstem ${q(show(c.text))}.`};
   const ok = p.styleKey === c.style;
   return {ok, detail: ok ? `${q(p.text.trim())} ma styl ${p.styleName}.` : `${q(p.text.trim())} ma styl ${p.styleName}, a ma mieć ${styleLabel(c.style)}.`, targets: [p.id]};
  },
  hint: c => `Kliknij w akapit → Narzędzia główne → Style → ${styleLabel(c.style)}.`,
 },
 // {text} — tytuł zaczyna się na nowej stronie (podział strony, „Podział strony przed” albo podział sekcji Następna strona)
 breakBefore: {
  run(m, c) {
   const p = findPara(m, c.text);
   if (!p) return {ok: false, detail: `Nie ma akapitu z tekstem ${q(show(c.text))}.`};
   const pageBr = g => g.t === 'br' && g.kind === 'page' && !g.del;
   let ok = !!p.pageBreakBefore;
   const firstText = p.segs.findIndex(g => g.t === 'text' && g.v.trim());
   if (!ok && p.segs.slice(0, firstText < 0 ? undefined : firstText).some(pageBr)) ok = true;
   const idx = m.blocks.indexOf(p);
   for (let i = idx - 1; !ok && i >= 0; i--) {
    const b = m.blocks[i];
    if (b.section !== p.section && m.sections[p.section].start !== 'continuous') { ok = true; break; }
    if (b.kind !== 'p') break;
    const lastText = b.segs.map(g => g.t === 'text' && g.v.trim()).lastIndexOf(true);
    if (b.segs.slice(lastText + 1).some(pageBr)) { ok = true; break; }
    if (b.text.trim() || b.hasImage) break;
   }
   return {ok, detail: ok ? `${q(p.text.trim())} zaczyna się od nowej strony.` : `Przed ${q(p.text.trim())} nie ma podziału strony.`, targets: [p.id]};
  },
  hint: () => 'Ustaw kursor tuż przed pierwszą literą tytułu → Wstawianie → Podział strony (Ctrl+Enter). Nie wstawiaj pustych akapitów Enterem.',
 },
};

// ——— Ocena ———
export const docxMax = data => (data.checks || []).reduce((s, c) => s + (Number(c.points) || 0), 0);

export function evaluate(model, checks) {
 return (checks || []).map(c => {
  const kind = KINDS[c.kind];
  let r;
  try { r = kind ? kind.run(model, c) : {ok: false, detail: `Nieznany rodzaj sprawdzenia: ${c.kind}.`}; }
  catch { r = {ok: false, detail: 'Tego elementu nie udało się sprawdzić w tym pliku.'}; }
  return {id: c.id, label: c.label, points: Number(c.points) || 0, ok: !!r.ok, detail: r.detail || '', hint: c.hint || kind?.hint(c) || '', targets: r.targets || []};
 });
}

// Czy to plik z tej lekcji (pierwsze ostrzeżenie zamiast punktów za cudzy dokument).
export function expectWarning(model, data) {
 if (!data.expect?.length) return '';
 const t = model.paragraphs.map(p => p.text).join('\n');
 return data.expect.some(x => has(t, x)) ? '' : `Ten plik nie wygląda na dokument z tej lekcji (brak tekstu ${q(show(data.expect[0]))}). Sprawdź, czy wgrywasz właściwy plik.`;
}

export async function checkDocx(bytes, data, fileName = '') {
 const model = await readDocx(bytes, {fileName});
 const results = evaluate(model, data.checks);
 return {model, results, score: results.reduce((s, r) => s + (r.ok ? r.points : 0), 0), max: docxMax(data), warning: expectWarning(model, data)};
}

const fmt = n => String(Math.round(n * 10) / 10).replace('.', ',');
// Stan do zapisu przez onChange: tylko wyniki (zaliczone/nie), nazwa pliku, data, liczba prób. Bez treści dokumentu.
export function resultValue(data, check, fileName, date = new Date(), prev = {}) {
 const score = check.score, max = docxMax(data);
 return {fileName: String(fileName).split(/[\\/]/).pop().slice(0, 120), checkedAt: date.toISOString(), attempts: (prev.attempts || 0) + 1,
  results: Object.fromEntries(check.results.map(r => [r.id, r.ok])), score, max, done: true, summary: `Plik ${String(fileName).split(/[\\/]/).pop()}: ${fmt(score)}/${max} pkt`};
}
// Wyniki do pokazania po odświeżeniu (bez pliku): etykiety i wskazówki z danych lekcji, zaliczenie z zapisanego stanu.
export function savedResults(data, value) {
 if (!value?.results) return null;
 return (data.checks || []).map(c => ({id: c.id, label: c.label, points: Number(c.points) || 0, ok: !!value.results[c.id], detail: '', hint: c.hint || KINDS[c.kind]?.hint(c) || '', targets: []}));
}
