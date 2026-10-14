// Czysta logika symulatora htmlLab (bez Reacta i bez DOM) — testy: tests/sims-html.test.mjs.
// Parser HTML (z wykrywaniem niezamkniętych znaczników), prosty parser CSS, selektory, kryteria zadań,
// punktacja, podgląd wyniku wyszukiwania, „czytnik ekranu”, kolorowanie składni i bezpieczny podgląd.

/* ───────────── Obrazki w „folderze strony” (lokalne SVG, wbudowywane jako data URI) ───────────── */
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="320" height="240">${body}</svg>`;
export const IMAGES = {
  'pizza.svg': {label: 'pizza', svg: svg('<rect width="160" height="120" fill="#fbe9d0"/><circle cx="80" cy="60" r="46" fill="#e0a548"/><circle cx="80" cy="60" r="39" fill="#d64545"/><circle cx="64" cy="48" r="7" fill="#fff4d6"/><circle cx="95" cy="52" r="7" fill="#fff4d6"/><circle cx="78" cy="77" r="7" fill="#fff4d6"/><circle cx="98" cy="74" r="4" fill="#2e7d32"/><circle cx="60" cy="68" r="4" fill="#2e7d32"/><circle cx="82" cy="40" r="4" fill="#2e7d32"/>')},
  'gitara.svg': {label: 'gitara', svg: svg('<rect width="160" height="120" fill="#e8f0fb"/><rect x="92" y="14" width="10" height="56" rx="3" fill="#6b3b12" transform="rotate(35 97 42)"/><circle cx="66" cy="76" r="24" fill="#b3541e"/><circle cx="84" cy="62" r="17" fill="#b3541e"/><circle cx="70" cy="72" r="7" fill="#3b1f0a"/><rect x="112" y="10" width="16" height="12" rx="3" fill="#3b1f0a" transform="rotate(35 120 16)"/>')},
  'pilka.svg': {label: 'piłka nożna', svg: svg('<rect width="160" height="120" fill="#dff3e6"/><rect y="92" width="160" height="28" fill="#16a36a"/><circle cx="80" cy="58" r="34" fill="#fff" stroke="#182f38" stroke-width="3"/><polygon points="80,44 93,53 88,68 72,68 67,53" fill="#182f38"/><path d="M80 24v20M93 53l20-6M88 68l12 16M72 68l-12 16M67 53l-20-6" stroke="#182f38" stroke-width="3"/>')},
  'pad.svg': {label: 'pad do gier', svg: svg('<rect width="160" height="120" fill="#ece8fb"/><path d="M38 44h84c14 0 22 12 24 30 2 16-10 24-20 14l-12-12H46L34 88c-10 10-22 2-20-14 2-18 10-30 24-30z" fill="#3d2f7a"/><rect x="44" y="58" width="22" height="7" rx="2" fill="#fff"/><rect x="51.5" y="50.5" width="7" height="22" rx="2" fill="#fff"/><circle cx="108" cy="56" r="5" fill="#f0b429"/><circle cx="118" cy="66" r="5" fill="#16a36a"/><circle cx="98" cy="66" r="5" fill="#2f6fdb"/><circle cx="108" cy="76" r="5" fill="#d64545"/>')},
  'rower.svg': {label: 'rower', svg: svg('<rect width="160" height="120" fill="#fdf3e1"/><circle cx="46" cy="78" r="22" fill="none" stroke="#182f38" stroke-width="5"/><circle cx="116" cy="78" r="22" fill="none" stroke="#182f38" stroke-width="5"/><path d="M46 78l24-34h34l12 34M70 44l14 34h-38M100 44l-6-10h-10M70 44l-4-8h-10" fill="none" stroke="#d64545" stroke-width="5" stroke-linejoin="round"/>')},
  'gory.svg': {label: 'góry', svg: svg('<rect width="160" height="120" fill="#cfe6fb"/><circle cx="124" cy="28" r="12" fill="#f0b429"/><polygon points="0,120 52,38 104,120" fill="#4f6d7a"/><polygon points="52,38 64,58 40,58" fill="#fff"/><polygon points="60,120 110,52 160,120" fill="#2f4a56"/><polygon points="110,52 120,66 100,66" fill="#fff"/>')},
  'kot.svg': {label: 'kot', svg: svg('<rect width="160" height="120" fill="#fbeee6"/><ellipse cx="80" cy="84" rx="36" ry="26" fill="#f0a35e"/><circle cx="80" cy="50" r="26" fill="#f0a35e"/><polygon points="58,36 62,12 76,28" fill="#f0a35e"/><polygon points="102,36 98,12 84,28" fill="#f0a35e"/><circle cx="70" cy="48" r="4" fill="#182f38"/><circle cx="90" cy="48" r="4" fill="#182f38"/><path d="M76 58q4 4 8 0M60 56H44M60 61l-14 4M100 56h16M100 61l14 4" stroke="#182f38" stroke-width="2" fill="none"/>')},
  'avatar.svg': {label: 'sylwetka (zamiast zdjęcia twarzy)', svg: svg('<rect width="160" height="120" fill="#e3ecef"/><circle cx="80" cy="46" r="22" fill="#6f8f86"/><path d="M36 120c0-28 20-44 44-44s44 16 44 44z" fill="#6f8f86"/>')},
  'logo.svg': {label: 'logo (fikcyjne)', svg: svg('<rect width="160" height="120" fill="#fff"/><rect x="20" y="30" width="60" height="60" rx="14" fill="#1f4fa3"/><path d="M38 72V48h12a9 9 0 0 1 0 18H38" fill="none" stroke="#fff" stroke-width="6"/><text x="90" y="68" font-family="Arial" font-size="22" font-weight="700" fill="#1f4fa3">LOGO</text>')}
};
export const imageNames = Object.keys(IMAGES);
export const imageDataUri = name => IMAGES[name] ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(IMAGES[name].svg)}` : null;

/* ───────────── Parser HTML ───────────── */
export const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style', 'title', 'textarea']);
const BLOCKS = ['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'];
const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
// Znaczniki, których koniec przeglądarka „dopowiada” sama, gdy zacznie się element z listy.
const IMPLIED_END = {p: new Set(BLOCKS), li: new Set(['li']), td: new Set(['td', 'th', 'tr']), th: new Set(['td', 'th', 'tr']), tr: new Set(['tr']), option: new Set(['option']), dt: new Set(['dt', 'dd']), dd: new Set(['dt', 'dd'])};
const NO_REPORT = new Set(['html', 'head', 'body']);
const ENTITIES = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', reg: '®', hellip: '…', ndash: '–', mdash: '—'};
export const decodeEntities = s => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m; }
  return ENTITIES[e.toLowerCase()] ?? m;
});

function lineAt(src, idx) { let n = 1; for (let i = 0; i < idx && i < src.length; i++) if (src.charCodeAt(i) === 10) n++; return n; }

/** Dzieli źródło HTML na tokeny: start, end, text, comment, doctype. Cudzysłowy w atrybutach działają jak w przeglądarce. */
export function tokenizeHtml(src) {
  src = String(src ?? '');
  const out = [];
  let i = 0;
  const lineOf = idx => lineAt(src, idx);
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) { out.push({type: 'text', raw: src.slice(i), start: i, end: src.length}); break; }
    if (lt > i) out.push({type: 'text', raw: src.slice(i, lt), start: i, end: lt});
    if (src.startsWith('<!--', lt)) {
      const e = src.indexOf('-->', lt + 4);
      const end = e === -1 ? src.length : e + 3;
      out.push({type: 'comment', raw: src.slice(lt, end), start: lt, end, unterminated: e === -1});
      i = end; continue;
    }
    if (src[lt + 1] === '!' || src[lt + 1] === '?') {
      const e = src.indexOf('>', lt);
      const end = e === -1 ? src.length : e + 1;
      out.push({type: 'doctype', raw: src.slice(lt, end), start: lt, end});
      i = end; continue;
    }
    const isEnd = src[lt + 1] === '/';
    const nameStart = lt + (isEnd ? 2 : 1);
    const m = /^[a-zA-Z][a-zA-Z0-9-]*/.exec(src.slice(nameStart, nameStart + 40));
    if (!m) { out.push({type: 'text', raw: '<', start: lt, end: lt + 1}); i = lt + 1; continue; }
    const name = m[0].toLowerCase();
    let j = nameStart + m[0].length;
    const attrs = [];
    let selfClosing = false, closedTag = false;
    while (j < src.length) {
      while (j < src.length && /\s/.test(src[j])) j++;
      if (src[j] === '>') { closedTag = true; j++; break; }
      if (src[j] === '/' && src[j + 1] === '>') { selfClosing = true; closedTag = true; j += 2; break; }
      if (src[j] === '/') { j++; continue; }
      if (src[j] === '<') break; // „<p class="a"<b>” — znacznik nie został domknięty
      const an = /^[^\s"'>/=<]+/.exec(src.slice(j, j + 200));
      if (!an) { j++; continue; }
      const attr = {name: an[0].toLowerCase(), value: '', hasValue: false};
      j += an[0].length;
      let k = j; while (k < src.length && /\s/.test(src[k])) k++;
      if (src[k] === '=') {
        k++; while (k < src.length && /\s/.test(src[k])) k++;
        attr.hasValue = true;
        if (src[k] === '"' || src[k] === "'") {
          const q = src[k];
          const e = src.indexOf(q, k + 1);
          if (e === -1) { attr.value = src.slice(k + 1); attr.unterminated = true; j = src.length; }
          else { attr.value = src.slice(k + 1, e); j = e + 1; }
        } else {
          const uv = /^[^\s>]*/.exec(src.slice(k))[0];
          attr.value = uv; j = k + uv.length;
        }
      }
      attr.value = decodeEntities(attr.value);
      attrs.push(attr);
    }
    const tok = {type: isEnd ? 'end' : 'start', name, attrs, selfClosing, start: lt, end: j, raw: src.slice(lt, j), unterminated: !closedTag};
    out.push(tok);
    i = j;
    if (!isEnd && RAW_TEXT.has(name) && closedTag) {
      const re = new RegExp(`</${name}\\s*>`, 'i');
      const rest = src.slice(i);
      const mm = re.exec(rest);
      const textEnd = mm ? i + mm.index : src.length;
      if (textEnd > i) out.push({type: 'text', raw: src.slice(i, textEnd), start: i, end: textEnd, rawText: name});
      if (mm) { out.push({type: 'end', name, attrs: [], start: textEnd, end: textEnd + mm[0].length, raw: mm[0]}); i = textEnd + mm[0].length; }
      else { i = src.length; }
    }
  }
  for (const t of out) t.line = lineOf(t.start);
  return out;
}

/**
 * Buduje drzewo dokumentu i listę problemów (niezamknięte znaczniki, zbędne znaczniki zamykające).
 * Węzeł elementu: {type:'el', tag, attrs:{}, children:[], line}; tekst: {type:'text', text}.
 */
export function parseHtml(src) {
  const tokens = tokenizeHtml(src);
  const root = {type: 'el', tag: '#document', attrs: {}, children: [], line: 1};
  const stack = [root];
  const issues = [];
  const top = () => stack[stack.length - 1];
  const close = (implied, before) => {
    const el = stack.pop();
    if (!NO_REPORT.has(el.tag)) issues.push({type: 'unclosed', tag: el.tag, line: el.line, implied: !!implied, before});
  };
  for (const t of tokens) {
    if (t.type === 'text') { if (t.raw) top().children.push({type: 'text', text: t.rawText === 'style' || t.rawText === 'script' ? t.raw : decodeEntities(t.raw)}); continue; }
    if (t.type === 'comment') { if (t.unterminated) issues.push({type: 'comment', line: t.line}); continue; }
    if (t.type === 'doctype') { root.doctype = t.raw; continue; }
    if (t.unterminated) issues.push({type: 'bracket', tag: t.name, line: t.line});
    if (t.type === 'start') {
      // Dopowiadane końce (np. </li> przed kolejnym <li>) oraz nagłówek w nagłówku.
      for (;;) {
        const cur = top();
        if (IMPLIED_END[cur.tag]?.has(t.name)) { close(true, t.name); continue; }
        if (HEADINGS.has(cur.tag) && HEADINGS.has(t.name)) { close(true, t.name); continue; }
        break;
      }
      const attrs = {};
      for (const a of t.attrs) if (!(a.name in attrs)) attrs[a.name] = a.value;
      const el = {type: 'el', tag: t.name, attrs, children: [], line: t.line};
      for (const a of t.attrs) if (a.unterminated) issues.push({type: 'quote', tag: t.name, attr: a.name, line: t.line});
      top().children.push(el);
      if (!VOID_TAGS.has(t.name)) stack.push(el);
      continue;
    }
    // znacznik zamykający
    if (VOID_TAGS.has(t.name)) { if (t.name !== 'br') issues.push({type: 'stray', tag: t.name, line: t.line, void: true}); continue; }
    let idx = -1;
    for (let k = stack.length - 1; k > 0; k--) if (stack[k].tag === t.name) { idx = k; break; }
    if (idx === -1) { if (!NO_REPORT.has(t.name)) issues.push({type: 'stray', tag: t.name, line: t.line}); continue; }
    while (stack.length - 1 > idx) {
      const inner = top();
      const implied = !!IMPLIED_END[inner.tag];
      close(implied, t.name);
    }
    stack.pop();
  }
  while (stack.length > 1) {
    const el = top();
    close(!!IMPLIED_END[el.tag], null);
  }
  return {root, issues, tokens};
}

/* ───────────── Drzewo: tekst i selektory ───────────── */
export function textContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text;
  if (node.tag === 'script' || node.tag === 'style') return '';
  return node.children.map(textContent).join('');
}
export const cleanText = s => String(s || '').replace(/\s+/g, ' ').trim();
export const nodeText = node => cleanText(textContent(node));

function parseCompound(s) {
  const out = {tag: null, attrs: []};
  const re = /([a-zA-Z][a-zA-Z0-9-]*|\*)|\.([\w-]+)|#([\w-]+)|\[\s*([\w-]+)\s*(?:([*^$~]?=)\s*["']?([^"'\]]*)["']?)?\s*\]/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1]) out.tag = m[1] === '*' ? null : m[1].toLowerCase();
    else if (m[2]) out.attrs.push({name: 'class', op: '~=', value: m[2]});
    else if (m[3]) out.attrs.push({name: 'id', op: '=', value: m[3]});
    else out.attrs.push({name: m[4].toLowerCase(), op: m[5] || null, value: m[6] ?? ''});
  }
  return out;
}
function matchCompound(el, c) {
  if (el.type !== 'el') return false;
  if (c.tag && el.tag !== c.tag) return false;
  for (const a of c.attrs) {
    if (!(a.name in el.attrs)) return false;
    const v = el.attrs[a.name];
    if (a.op === '=' && v !== a.value) return false;
    if (a.op === '~=' && !v.split(/\s+/).includes(a.value)) return false;
    if (a.op === '^=' && !v.startsWith(a.value)) return false;
    if (a.op === '$=' && !v.endsWith(a.value)) return false;
    if (a.op === '*=' && !v.includes(a.value)) return false;
  }
  return true;
}
/** Prosty querySelectorAll: typ, .klasa, #id, [atrybut], [a=wartość], potomek (spacja), lista po przecinku. */
export function select(root, selector) {
  const found = new Set();
  const result = [];
  for (const part of String(selector).split(',')) {
    const chain = part.trim().split(/\s+/).filter(Boolean).map(parseCompound);
    if (!chain.length) continue;
    const walk = (node, matched) => {
      for (const ch of node.children || []) {
        if (ch.type !== 'el') continue;
        let m = matched;
        if (m < chain.length && matchCompound(ch, chain[m])) {
          if (m === chain.length - 1) { if (!found.has(ch)) { found.add(ch); result.push(ch); } }
          else { walk(ch, m + 1); }
        }
        walk(ch, matched);
      }
    };
    walk(root, 0);
  }
  // kolejność dokumentu
  const order = new Map(); let n = 0;
  const visit = node => { for (const ch of node.children || []) if (ch.type === 'el') { order.set(ch, n++); visit(ch); } };
  visit(root);
  return result.sort((a, b) => order.get(a) - order.get(b));
}
export function headings(root) { return select(root, 'h1, h2, h3, h4, h5, h6').map(h => ({level: Number(h.tag[1]), text: nodeText(h), line: h.line})); }

/* ───────────── CSS ───────────── */
export const KNOWN_CSS = new Set(('align-content align-items align-self animation background background-attachment background-color background-image background-position background-repeat background-size border border-bottom border-collapse border-color border-left border-radius border-right border-spacing border-style border-top border-width bottom box-shadow box-sizing clear color column-gap columns content cursor display flex flex-basis flex-direction flex-grow flex-shrink flex-wrap float font font-family font-size font-style font-variant font-weight gap grid grid-area grid-column grid-gap grid-row grid-template-areas grid-template-columns grid-template-rows height justify-content justify-items left letter-spacing line-height list-style list-style-type margin margin-bottom margin-left margin-right margin-top max-height max-width min-height min-width object-fit opacity order outline outline-color outline-offset outline-style outline-width overflow overflow-x overflow-y padding padding-bottom padding-left padding-right padding-top position right row-gap text-align text-decoration text-decoration-color text-indent text-shadow text-transform top transform transition vertical-align visibility white-space width word-spacing word-wrap z-index accent-color aspect-ratio border-top-left-radius border-top-right-radius border-bottom-left-radius border-bottom-right-radius caret-color filter inset place-items scroll-behavior text-underline-offset').split(' '));
const CSS_TYPOS = {colour: 'color', 'background-colour': 'background-color', backround: 'background', 'backround-color': 'background-color', 'font-color': 'color', 'text-color': 'color', 'text-size': 'font-size', 'font-colour': 'color', 'border-radious': 'border-radius', alignment: 'text-align', 'align-text': 'text-align', 'text-allign': 'text-align', 'font-famili': 'font-family', 'font-wieght': 'font-weight', colr: 'color', 'backgroud-color': 'background-color'};

/** Reguły CSS: [{selectors:[…], decls:[{prop,value,line}], line}] i problemy (literówki, brak średnika, klamry). */
export function parseCss(src) {
  src = String(src ?? '');
  const rules = [];
  const issues = [];
  // usuń komentarze, zachowując numerację linii
  const text = src.replace(/\/\*[\s\S]*?(\*\/|$)/g, m => m.replace(/[^\n]/g, ' '));
  const parseBlock = (start, endLimit) => {
    let pos = start;
    while (pos < endLimit) {
      const rest = text.slice(pos, endLimit);
      const oi = rest.indexOf('{'), ci = rest.indexOf('}');
      if (ci !== -1 && (oi === -1 || ci < oi)) { issues.push({type: 'css-brace', line: lineAt(text, pos + ci), extra: true}); pos += ci + 1; continue; }
      if (oi === -1) { if (rest.trim()) issues.push({type: 'css-junk', line: lineAt(text, pos + rest.search(/\S/))}); return; }
      const open = pos + oi;
      const head = text.slice(pos, open).trim();
      const headLine = lineAt(text, pos + text.slice(pos, open).search(/\S|$/));
      if (head.includes(';')) issues.push({type: 'css-junk', line: headLine});
      let depth = 1, k = open + 1;
      for (; k < endLimit && depth > 0; k++) { if (text[k] === '{') depth++; else if (text[k] === '}') depth--; }
      const close = depth === 0 ? k - 1 : endLimit;
      if (depth !== 0) issues.push({type: 'css-brace', line: headLine, selector: head});
      if (head.startsWith('@media') || head.startsWith('@supports')) parseBlock(open + 1, close);
      else if (head.startsWith('@')) { /* @font-face, @keyframes, @import — pomijamy */ }
      else {
        const body = text.slice(open + 1, close);
        const decls = [];
        let off = open + 1;
        for (const part of body.split(';')) {
          const partStart = off; off += part.length + 1;
          if (!part.trim()) continue;
          const line = lineAt(text, partStart + part.search(/\S/));
          // reguła „wpadła” do poprzedniej (brak klamry — zgłoszone wyżej jako css-brace) albo sama klamra
          if (/[{}]/.test(part)) continue;
          const c = part.indexOf(':');
          if (c === -1) { issues.push({type: 'css-colon', line, text: part.trim().slice(0, 40)}); continue; }
          const prop = part.slice(0, c).trim().toLowerCase();
          let value = part.slice(c + 1).trim();
          const missing = /\n\s*[a-z-]+\s*:/i.exec(value.replace(/url\([^)]*\)/gi, m => m.replace(/:/g, ' ')));
          if (missing) { issues.push({type: 'css-semicolon', line, prop}); value = value.slice(0, missing.index).trim(); }
          if (!value) issues.push({type: 'css-empty', line, prop});
          if (!prop.startsWith('--') && !KNOWN_CSS.has(prop)) issues.push({type: 'css-prop', line, prop, suggestion: CSS_TYPOS[prop]});
          decls.push({prop, value, line});
        }
        rules.push({selectors: head.replace(/^[^;]*;/, '').split(',').map(normSel).filter(Boolean), decls, line: headLine});
      }
      pos = close + 1;
    }
  };
  parseBlock(0, text.length);
  return {rules, issues};
}
const normSel = s => s.trim().replace(/\s+/g, ' ').replace(/\s*>\s*/g, ' > ').toLowerCase();
/** Wartość właściwości ustawionej w CSS dla dokładnie tego selektora (ostatnia wygrywa) albo null. */
export function cssValue(rules, selector, props) {
  const sels = [].concat(selector).map(normSel);
  const ps = [].concat(props).map(p => p.toLowerCase());
  let val = null;
  for (const r of rules) if (r.selectors.some(s => sels.includes(s))) for (const d of r.decls) if (ps.includes(d.prop) && d.value) val = d.value;
  return val;
}

/* ───────────── Kolory i kontrast ───────────── */
const NAMED = {black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 128, 0], blue: [0, 0, 255], yellow: [255, 255, 0], gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192], navy: [0, 0, 128], orange: [255, 165, 0], purple: [128, 0, 128], lime: [0, 255, 0], aqua: [0, 255, 255], cyan: [0, 255, 255], magenta: [255, 0, 255], fuchsia: [255, 0, 255], maroon: [128, 0, 0], olive: [128, 128, 0], teal: [0, 128, 128], pink: [255, 192, 203], gold: [255, 215, 0], darkblue: [0, 0, 139], darkgreen: [0, 100, 0], lightgray: [211, 211, 211], lightgrey: [211, 211, 211], darkgray: [169, 169, 169], hotpink: [255, 105, 180], beige: [245, 245, 220], brown: [165, 42, 42]};
export function parseColor(s) {
  s = String(s || '').trim().toLowerCase();
  if (!s) return null;
  if (s === 'transparent') return {r: 0, g: 0, b: 0, a: 0};
  if (NAMED[s]) { const [r, g, b] = NAMED[s]; return {r, g, b, a: 1}; }
  let m = /^#([0-9a-f]{3,8})$/.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    return {r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1};
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/.exec(s);
  if (m) { const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]); return {r: +m[1], g: +m[2], b: +m[3], a}; }
  return null;
}
export function luminance(c) {
  const ch = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}
export function contrastRatio(a, b) {
  const ca = typeof a === 'string' ? parseColor(a) : a, cb = typeof b === 'string' ? parseColor(b) : b;
  if (!ca || !cb) return null;
  const [l1, l2] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}
export function saturation(c) {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return 0;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}
export const fmtRatio = r => r == null ? '—' : `${String(Math.round(r * 10) / 10).replace('.', ',')}:1`;

/* ───────────── Analiza strony ───────────── */
/** Czy w HTML jest podłączony arkusz style.css. */
export function linksStylesheet(root) { return select(root, 'link').some(l => /stylesheet/i.test(l.attrs.rel || '') && /^(\.\/)?style\.css$/i.test((l.attrs.href || '').trim())); }
/** Cały CSS działający na stronie: zawartość <style> i — gdy podłączony — zakładka style.css. */
export function pageCss(root, css) {
  const inline = select(root, 'style').map(textContent).join('\n');
  return (linksStylesheet(root) && css ? css + '\n' : '') + inline;
}
const imgName = src => String(src || '').trim().replace(/^\.\//, '');
export const imageExists = src => Object.prototype.hasOwnProperty.call(IMAGES, imgName(src));
export const isLocalPath = v => /^(file:|[a-z]:[\\/]|\\\\|\/(users|home)\/)|localhost|127\.0\.0\.1/i.test(String(v || '').trim());
export const isExternal = v => /^(https?:)?\/\//i.test(String(v || '').trim());

/** Pełna analiza: drzewo (z parsera albo przekazane z DOMParser), problemy, CSS. */
export function analyze(html, css = '', tree = null) {
  const parsed = parseHtml(html);
  const root = tree || parsed.root;
  const cssText = pageCss(root, css);
  const cssParsed = parseCss(cssText);
  const tabCss = css ? parseCss(css) : {rules: [], issues: []};
  return {root, issues: parsed.issues, css: cssParsed, tabRules: tabCss.rules, tabCssIssues: tabCss.issues, cssLinked: linksStylesheet(root), html: String(html ?? '')};
}

/** Problemy do panelu „Walidator” — po polsku, z numerem linii. */
export function lint(a, {cssTab = false} = {}) {
  const out = [];
  for (const i of a.issues) {
    if (i.type === 'unclosed') out.push({line: i.line, sev: i.implied ? 'warn' : 'error', tag: i.tag, text: i.implied ? `<${i.tag}> nie ma znacznika zamykającego </${i.tag}>. Przeglądarka zgadła, gdzie się kończy — zamknij go sam.` : `Niezamknięty znacznik <${i.tag}>. Dopisz </${i.tag}> tam, gdzie element ma się kończyć.`});
    else if (i.type === 'stray') out.push({line: i.line, sev: 'error', tag: i.tag, text: i.void ? `<${i.tag}> nie ma znacznika zamykającego — usuń </${i.tag}>.` : `Zbędny znacznik </${i.tag}> — nic tu nie zostało otwarte jako <${i.tag}>. Sprawdź pisownię albo kolejność.`});
    else if (i.type === 'bracket') out.push({line: i.line, sev: 'error', tag: i.tag, text: `Znacznik <${i.tag} nie kończy się znakiem „>”.`});
    else if (i.type === 'quote') out.push({line: i.line, sev: 'error', tag: i.tag, text: `W <${i.tag}> atrybut ${i.attr}= ma otwarty cudzysłów bez zamknięcia — reszta strony „wpadła” do atrybutu.`});
    else if (i.type === 'comment') out.push({line: i.line, sev: 'error', text: 'Komentarz <!-- nie jest zamknięty znakami -->. Cała dalsza część strony jest ukryta.'});
  }
  for (const img of select(a.root, 'img')) {
    const src = img.attrs.src;
    if (!('alt' in img.attrs)) out.push({line: img.line, sev: 'warn', tag: 'img', text: `Obrazek ${src ? `„${src}” ` : ''}nie ma atrybutu alt — czytnik ekranu i wyszukiwarka nie wiedzą, co przedstawia.`});
    if (!src) out.push({line: img.line, sev: 'error', tag: 'img', text: 'Obrazek nie ma atrybutu src — przeglądarka nie wie, jaki plik pokazać.'});
    else if (isLocalPath(src)) out.push({line: img.line, sev: 'error', tag: 'img', text: `Ścieżka „${src}” prowadzi do Twojego dysku. Na innym komputerze (i w internecie) tego pliku nie ma. Użyj ścieżki względnej, np. pizza.svg.`});
    else if (isExternal(src)) out.push({line: img.line, sev: 'warn', tag: 'img', text: `Obrazek z internetu („${src.slice(0, 40)}…”) jest w podglądzie zablokowany. Użyj pliku z folderu strony.`});
    else if (!imageExists(src)) out.push({line: img.line, sev: 'error', tag: 'img', text: `Pliku „${src}” nie ma w folderze strony. Sprawdź nazwę (wielkość liter, rozszerzenie) — pliki są wypisane pod podglądem.`});
  }
  for (const link of select(a.root, 'a')) {
    if (!('href' in link.attrs) || !link.attrs.href.trim()) out.push({line: link.line, sev: 'warn', tag: 'a', text: `Link „${nodeText(link).slice(0, 30)}” nie ma adresu href — nie da się go kliknąć.`});
    else if (isLocalPath(link.attrs.href)) out.push({line: link.line, sev: 'error', tag: 'a', text: `Link prowadzi do Twojego dysku („${link.attrs.href.slice(0, 40)}”). Po publikacji nie zadziała.`});
  }
  const hs = headings(a.root);
  hs.forEach((h, k) => { if (k > 0 && h.level > hs[k - 1].level + 1) out.push({line: h.line, sev: 'warn', tag: `h${h.level}`, text: `Po <h${hs[k - 1].level}> od razu <h${h.level}> — pominięty poziom nagłówka. Jak w Wordzie: po Nagłówku 1 przychodzi Nagłówek 2.`}); });
  if (!select(a.root, 'title').length || !nodeText(select(a.root, 'title')[0])) out.push({line: 1, sev: 'warn', tag: 'title', text: 'Brak tytułu <title> w <head> — karta przeglądarki i wynik wyszukiwania pokażą sam adres.'});
  if (cssTab && !a.cssLinked) out.push({line: 1, sev: 'error', tag: 'link', text: 'Arkusz style.css nie jest podłączony: w <head> dopisz <link rel="stylesheet" href="style.css">.', css: false});
  for (const i of a.tabCssIssues || []) out.push(cssIssue(i));
  return out.sort((x, y) => (x.css ? 1 : 0) - (y.css ? 1 : 0) || x.line - y.line);
}
function cssIssue(i) {
  const base = {line: i.line, css: true, sev: 'error'};
  if (i.type === 'css-prop') return {...base, sev: 'warn', text: i.suggestion ? `Nieznana właściwość „${i.prop}” — chodziło o „${i.suggestion}”?` : `Nieznana właściwość „${i.prop}”. Sprawdź pisownię (CSS używa angielskich nazw).`};
  if (i.type === 'css-semicolon') return {...base, text: `Brak średnika po „${i.prop}: …”. Każdą deklarację kończ znakiem ;`};
  if (i.type === 'css-colon') return {...base, text: `„${i.text}” — brakuje dwukropka między właściwością a wartością.`};
  if (i.type === 'css-empty') return {...base, sev: 'warn', text: `Właściwość „${i.prop}” nie ma wartości.`};
  if (i.type === 'css-brace') return {...base, text: i.extra ? 'Zbędna klamra „}”.' : `Reguła „${i.selector || ''}” nie ma zamykającej klamry „}”.`};
  return {...base, sev: 'warn', text: 'Tekst poza regułą CSS — przeglądarka go pominie.'};
}

/* ───────────── Kryteria zadań ───────────── */
const lc = s => String(s || '').toLowerCase();
const matchesAny = (text, list) => [].concat(list || []).some(p => p instanceof RegExp ? p.test(text) : lc(text).includes(lc(p)));
const re = p => p instanceof RegExp ? p : new RegExp(p, 'i');
const plural = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? few : many;

/** Elementy spełniające filtry kryterium (tekst min/max, wyłączenia, „zawiera element”). */
function filtered(root, c) {
  return select(root, c.sel).filter(el => {
    const t = nodeText(el);
    if (c.textMin && t.length < c.textMin) return false;
    if (c.not && [].concat(c.not).some(n => lc(n) === lc(t))) return false;
    if (c.notPattern && re(c.notPattern).test(t)) return false;
    if (c.includes && !matchesAny(t, c.includes)) return false;
    if (c.has && !select(el, c.has).length) return false;
    return true;
  });
}

/** Sprawdza jedno kryterium. ctx = wynik analyze(): drzewo, problemy parsera, reguły CSS, źródło. */
export function runCheck(c, ctx) {
  const {root} = ctx;
  switch (c.type) {
    case 'exists': {
      const n = filtered(root, c).length;
      const min = c.min ?? 1;
      const ok = n >= min && (c.max == null || n <= c.max);
      const all = select(root, c.sel).length;
      const extra = !ok && all > n ? ` (${all - n} to jeszcze tekst z szablonu${c.textMin ? ' albo za krótki' : ''})` : '';
      return {ok, info: c.max != null && n > c.max ? `Za dużo: ${n} (maks. ${c.max}).` : `Znaleziono: ${n} z ${min}${extra}.`};
    }
    case 'text': {
      const els = select(root, c.sel);
      if (!els.length) return {ok: false, info: `Brak elementu ${c.sel}.`};
      const el = els[0];
      const t = nodeText(el);
      if (c.not && [].concat(c.not).some(n => lc(n) === lc(t))) return {ok: false, info: `Nadal tekst z szablonu: „${t}”.`};
      if (c.notPattern && re(c.notPattern).test(t)) return {ok: false, info: `Nadal tekst z szablonu: „${t.slice(0, 40)}”.`};
      if (c.min && t.length < c.min) return {ok: false, info: `Za krótko: ${t.length} ${plural(t.length, 'znak', 'znaki', 'znaków')} (min. ${c.min}).`};
      if (c.max && t.length > c.max) return {ok: false, info: `Za długo: ${t.length} ${plural(t.length, 'znak', 'znaki', 'znaków')} (maks. ${c.max}).`};
      if (c.includes && !matchesAny(t, c.includes)) return {ok: false, info: `Brakuje słowa: ${[].concat(c.includes).map(String).join(' / ')}.`};
      if (c.includesAll) for (const w of c.includesAll) if (!matchesAny(t, [w])) return {ok: false, info: `Brakuje słowa „${w}”.`};
      if (c.pattern && !re(c.pattern).test(t)) return {ok: false, info: c.patternInfo || 'Tekst nie ma oczekiwanej postaci.'};
      return {ok: true, info: `„${t.slice(0, 50)}${t.length > 50 ? '…' : ''}” (${t.length} zn.)`};
    }
    case 'attr': {
      const els = select(root, c.sel);
      if (els.length < (c.atLeast ?? 1)) return {ok: false, info: `Brak elementu ${c.sel}.`};
      const bad = els.filter(el => {
        const v = (el.attrs[c.attr] ?? '').trim();
        if (!(c.attr in el.attrs)) return true;
        if ((c.min ?? 1) > 0 && v.length < (c.min ?? 1)) return true;
        if (c.max && v.length > c.max) return true;
        if (c.pattern && !re(c.pattern).test(v)) return true;
        return false;
      });
      if (bad.length) {
        const v = (bad[0].attrs[c.attr] ?? '').trim();
        const why = !(c.attr in bad[0].attrs) ? `brak ${c.attr}` : c.max && v.length > c.max ? `${v.length} zn., maks. ${c.max}` : v.length < (c.min ?? 1) ? `${v.length} zn., min. ${c.min ?? 1}` : 'zła wartość';
        return {ok: false, info: `Do poprawy: ${bad.length} z ${els.length} (linia ${bad[0].line}: ${why}).`};
      }
      const v = (els[0].attrs[c.attr] ?? '').trim();
      return {ok: true, info: els.length === 1 ? `${c.attr}: „${v.slice(0, 60)}${v.length > 60 ? '…' : ''}” (${v.length} zn.)` : `Wszystkie ${els.length} w porządku.`};
    }
    case 'images': {
      const imgs = select(root, 'img');
      if (imgs.length < (c.min ?? 1)) return {ok: false, info: `Obrazków: ${imgs.length} (min. ${c.min ?? 1}).`};
      if (c.exist !== false) { const bad = imgs.find(i => !imageExists(i.attrs.src)); if (bad) return {ok: false, info: `Linia ${bad.line}: pliku „${bad.attrs.src || '(brak src)'}” nie ma w folderze strony.`}; }
      if (c.alt !== false) { const bad = imgs.find(i => !(i.attrs.alt || '').trim() || (c.altMin && i.attrs.alt.trim().length < c.altMin)); if (bad) return {ok: false, info: `Linia ${bad.line}: obrazek bez opisu alt.`}; }
      return {ok: true, info: `Obrazki: ${imgs.length}, wszystkie w porządku.`};
    }
    case 'closed': {
      if (c.minElements && select(root, 'body *').length < c.minElements) return {ok: false, info: 'Strona jest jeszcze prawie pusta — najpierw dopisz treść.'};
      const tags = c.tags ? new Set(c.tags) : null;
      const bad = ctx.issues.filter(i => ['unclosed', 'stray', 'bracket', 'quote', 'comment'].includes(i.type) && (!tags || tags.has(i.tag)));
      return bad.length ? {ok: false, info: `Problemy ze znacznikami: ${bad.length} (pierwszy w linii ${bad[0].line}).`} : {ok: true, info: 'Wszystkie znaczniki zamknięte.'};
    }
    case 'headings': {
      const hs = headings(root);
      const h1 = hs.filter(h => h.level === 1).length;
      if (h1 !== 1) return {ok: false, info: h1 ? `Nagłówków <h1>: ${h1} — na stronie ma być jeden.` : 'Brak nagłówka <h1>.'};
      if (hs[0].level !== 1) return {ok: false, info: 'Pierwszy nagłówek powinien być <h1>.'};
      const k = hs.findIndex((h, j) => j > 0 && h.level > hs[j - 1].level + 1);
      if (k > 0) return {ok: false, info: `Linia ${hs[k].line}: po <h${hs[k - 1].level}> od razu <h${hs[k].level}>.`};
      const h2 = hs.filter(h => h.level === 2).length;
      if (c.minH2 && h2 < c.minH2) return {ok: false, info: `Nagłówków <h2>: ${h2} (min. ${c.minH2}).`};
      return {ok: true, info: `Nagłówki: ${hs.map(h => 'h' + h.level).join(' → ')}`};
    }
    case 'table': {
      const tables = select(root, 'table');
      if (!tables.length) return {ok: false, info: 'Brak tabeli <table>.'};
      const stat = tables.map(t => ({th: select(t, 'th').length, rows: select(t, 'tr').filter(tr => select(tr, 'td').length > 0).length}));
      const best = stat.find(s => s.th >= (c.minTh ?? 2) && s.rows >= (c.minRows ?? 2));
      if (best) return {ok: true, info: `Tabela: ${best.th} nagłówki <th>, ${best.rows} wiersze danych.`};
      const s0 = stat[0];
      return {ok: false, info: s0.th < (c.minTh ?? 2) ? `Nagłówków kolumn <th>: ${s0.th} (min. ${c.minTh ?? 2}).` : `Wierszy z danymi <td>: ${s0.rows} (min. ${c.minRows ?? 2}).`};
    }
    case 'links': {
      const as = select(root, 'a');
      if (as.length < (c.min ?? 1)) return {ok: false, info: `Linków: ${as.length} (min. ${c.min ?? 1}).`};
      const bad = as.find(a => !(a.attrs.href || '').trim() || isLocalPath(a.attrs.href) || (c.pattern && !re(c.pattern).test(a.attrs.href)));
      if (bad) return {ok: false, info: `Linia ${bad.line}: ${!(bad.attrs.href || '').trim() ? 'link bez href' : isLocalPath(bad.attrs.href) ? 'link do Twojego dysku' : 'nieprawidłowy adres'}.`};
      return {ok: true, info: `Linki: ${as.length}, wszystkie z adresem.`};
    }
    case 'noLocal': {
      const bad = select(root, '[src], [href]').find(el => isLocalPath(el.attrs.src) || isLocalPath(el.attrs.href));
      return bad ? {ok: false, info: `Linia ${bad.line}: ścieżka do Twojego dysku.`} : {ok: true, info: 'Ścieżki względne — zadziałają po publikacji.'};
    }
    case 'sourceNot': {
      const lines = ctx.html.split('\n');
      const k = lines.findIndex(l => re(c.pattern).test(l));
      return k >= 0 ? {ok: false, info: `Linia ${k + 1} — to zobaczy każdy, kto otworzy źródło strony (Ctrl+U).`} : {ok: true, info: 'Kod nie zdradza prywatnych informacji.'};
    }
    case 'linked': return ctx.cssLinked ? {ok: true, info: 'style.css podłączony.'} : {ok: false, info: 'Brak <link rel="stylesheet" href="style.css">.'};
    case 'css': {
      const sels = [].concat(c.sel), props = [].concat(c.props || c.prop);
      const v = cssValue(ctx.css.rules, sels, props);
      if (!v && ctx.tabRules && !ctx.cssLinked && cssValue(ctx.tabRules, sels, props)) return {ok: false, info: 'Reguła jest w style.css, ale arkusz nie jest podłączony w <head> — przeglądarka go nie widzi.'};
      if (!v) return {ok: false, info: `Brak reguły ${sels[0]} { ${props[0]}: …; }`};
      return cssTest(c, v, `${sels[0]} { ${props[0]}: ${v} }`);
    }
    case 'cssAny': {
      const props = [].concat(c.props || c.prop);
      let last = null;
      for (const r of ctx.css.rules) for (const d of r.decls) if (props.includes(d.prop) && d.value) { const t = cssTest(c, d.value, ''); if (t.ok) return {ok: true, info: `${r.selectors.join(', ')} { ${d.prop}: ${d.value} }`}; last = d; }
      return {ok: false, info: last ? `Jest ${last.prop}: ${last.value}, ale ta wartość nie spełnia warunku.` : `Żadna reguła nie ustawia ${props[0]}.`};
    }
    case 'contrast': {
      const {fg, bg} = resolvedColors(ctx.css.rules, c.sel, c.inherit);
      if (c.needBg && bg.dflt) return {ok: false, info: 'Najpierw ustaw kolor tła (background-color) — kontrast liczy się dla Twoich kolorów.'};
      const r = contrastRatio(fg.c, bg.c);
      const min = c.min ?? 4.5;
      return {ok: r != null && r >= min, ratio: r, info: `Tekst ${fg.raw} na tle ${bg.raw}: kontrast ${fmtRatio(r)} (min. ${String(min).replace('.', ',')}:1).`};
    }
    default: return {ok: false, info: `Nieznane kryterium: ${c.type}`};
  }
}
const toPx = v => { const m = /(-?\d*\.?\d+)\s*(px|rem|em|pt|%)?/.exec(String(v)); if (!m) return NaN; const n = parseFloat(m[1]); return m[2] === 'rem' || m[2] === 'em' ? n * 16 : m[2] === 'pt' ? n * 4 / 3 : m[2] === '%' ? n * 0.16 : n; };
/** Test wartości CSS: color, dark, light, colorful, minPx, nonzero, equals, includes, notIn, pattern (domyślnie: dowolna wartość). */
function cssTest(c, v, where) {
  const col = colorIn(v)?.c;
  const lv = lc(v).trim();
  let ok = true;
  switch (c.test) {
    case 'color': ok = !!col && col.a > 0; break;
    case 'dark': ok = !!col && col.a > 0 && luminance(col) < (c.max ?? 0.2); break;
    case 'light': ok = !!col && col.a > 0 && luminance(col) > (c.min ?? 0.5); break;
    case 'notWhite': ok = !!col && col.a > 0 && luminance(col) < 0.9; break;
    case 'colorful': ok = !!col && col.a > 0 && saturation(col) >= (c.min ?? 0.5) && luminance(col) >= 0.08; break;
    case 'minPx': ok = toPx(v) >= c.value; break;
    case 'nonzero': ok = toPx(v) > 0; break;
    case 'equals': ok = [].concat(c.value).some(x => lv === lc(x) || lv.split(/\s+/).includes(lc(x))); break;
    case 'includes': ok = matchesAny(v, c.value); break;
    case 'notIn': ok = ![].concat(c.value).includes(lv); break;
    default: ok = true;
  }
  if (ok && c.pattern && !re(c.pattern).test(v)) ok = false;
  const why = ok ? '' : c.test === 'dark' ? ' — za jasny' : c.test === 'light' ? ' — za ciemny' : c.test === 'colorful' ? ' — kolor zbyt szary albo za ciemny' : c.test === 'minPx' ? ` — za mało (min. ${c.value}px)` : (c.test === 'color' || c.test === 'notWhite') && !col ? ' — to nie jest kolor' : '';
  return {ok, info: where ? `Teraz: ${where}${why}` : `Teraz: ${v}${why}`};
}
/** Pierwszy kolor w wartości CSS (też w skrócie background: #000 url(…)). */
export function colorIn(value) {
  for (const m of String(value || '').match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|[a-z]+/gi) || []) { const c = parseColor(m); if (c) return {c, raw: m}; }
  return null;
}
/**
 * Kolor tekstu i tła elementu wyliczony z arkusza (bez przeglądarki): reguła dla selektora,
 * potem przodkowie z listy inherit, potem body i html; domyślnie czarny tekst na białym tle.
 */
export function resolvedColors(rules, sel, inherit = []) {
  const chain = [...[].concat(sel), ...[].concat(inherit), 'body', 'html'];
  let fg = null, bg = null;
  for (const s of chain) {
    if (!fg) { const v = cssValue(rules, s, 'color'); const c = colorIn(v); if (c && c.c.a > 0) fg = c; }
    if (!bg) { const v = cssValue(rules, s, ['background-color', 'background']); const c = colorIn(v); if (c && c.c.a > 0) bg = c; }
  }
  return {fg: fg || {c: parseColor('#000000'), raw: 'czarny (domyślny)', dflt: true}, bg: bg || {c: parseColor('#ffffff'), raw: 'białym (domyślnym)', dflt: true}};
}
/**
 * Wszystkie kryteria naraz. keep = [{sel, min, label}] — „strażnik” w trybie naprawy: gdy uczeń usunie treść,
 * zamiast ją naprawić, żadne kryterium nie jest zaliczone.
 */
export function runChecks(checks, ctx, keep = null) {
  const lost = (keep || []).find(k => select(ctx.root, k.sel).length < (k.min ?? 1));
  return Object.fromEntries((checks || []).map(c => [c.id, lost ? {ok: false, info: `Brakuje ${lost.label || lost.sel} — nie usuwaj treści strony, tylko ją napraw.`} : runCheck(c, ctx)]));
}
/** Mapa {id: true/false} do zapisania w stanie. */
export const passMap = results => Object.fromEntries(Object.entries(results).map(([k, r]) => [k, !!r.ok]));

/* ───────────── Punkty ───────────── */
export const hintFactor = level => Math.max(0.5, 1 - 0.25 * (level || 0));
const half = x => Math.round(x * 2) / 2;
/** Punkty za kryteria: każde warte points/liczba kryteriów; każda użyta podpowiedź do kryterium odejmuje 25% (min. połowa). */
export function checksScore(checks, res = {}, hints = {}, points = checks.length) {
  const total = checks.length;
  if (!total) return {score: 0, passed: 0, total: 0};
  const share = points / total;
  let s = 0, passed = 0;
  for (const c of checks) if (res[c.id]) { passed++; s += share * hintFactor(hints[c.id]); }
  return {score: half(s), passed, total};
}
export const labMax = data => data.mode === 'show' ? 0 : data.mode === 'free' ? (data.points || 0) : (data.points ?? (data.mode === 'theme' ? Math.max(...(data.themes || []).map(t => t.checks.length), 0) : (data.checks || []).length));
export const themeById = (data, id) => (data.themes || []).find(t => t.id === id) || null;

/** Wynik aktywności (do onChange i karty wyniku). v.res = {idKryterium: true/false}. */
export function labResult(data, v = {}) {
  const max = labMax(data);
  const product = data.product || 'Strona';
  if (data.mode === 'show') return {done: !!v.done, score: 0, max: 0};
  if (data.mode === 'free') { const done = !!v.edited; return {done, score: done ? max : 0, max, summary: done ? `${product}: gotowa${v.h1 ? ` — „${v.h1}”` : ''}` : undefined}; }
  if (data.mode === 'theme') {
    let best = null;
    for (const t of data.themes || []) {
      const st = v.themes?.[t.id];
      if (!st?.res) continue;
      const r = checksScore(t.checks, st.res, st.hints, max);
      if (!best || r.score > best.score || (r.score === best.score && t.id === v.theme)) best = {...r, theme: t, ratio: st.ratio};
    }
    if (!best) return {done: false, score: 0, max, passed: 0, total: (themeById(data, v.theme) || data.themes?.[0])?.checks.length || 0};
    const done = best.passed >= (data.minDone ?? best.total);
    return {done, score: best.score, max, passed: best.passed, total: best.total, bestTheme: best.theme.id,
      summary: `${product}: motyw „${best.theme.name}” — ${best.passed}/${best.total} kryteriów${best.ratio ? `, kontrast ${fmtRatio(best.ratio)}` : ''}`};
  }
  const checks = data.checks || [];
  const r = checksScore(checks, v.res || {}, v.hints || {}, max);
  const done = !!v.res && r.passed >= (data.minDone ?? r.total);
  const word = data.mode === 'fix' ? `naprawione błędy ${r.passed}/${r.total}` : `${r.passed}/${r.total} kryteriów`;
  const name = data.mode === 'serp' ? v.title : v.h1;
  return {done, score: r.score, max, passed: r.passed, total: r.total, summary: v.res ? `${product}: ${word}${name ? ` — „${name.slice(0, 48)}${name.length > 48 ? '…' : ''}”` : ''}` : undefined};
}

/* ───────────── Wynik wyszukiwania (SERP) ───────────── */
export const SERP_TITLE_MAX = 60;
export const SERP_DESC_MAX = 155;
function cut(text, max) {
  if (text.length <= max) return {text, cut: false};
  const sp = text.lastIndexOf(' ', max - 1);
  return {text: text.slice(0, sp > max * 0.6 ? sp : max - 1).replace(/[\s,.;:–-]+$/, '') + ' …', cut: true};
}
/** Jak strona mogłaby wyglądać w wynikach wyszukiwania (przybliżenie — wyszukiwarki same decydują). */
export function serpPreview(root, url = 'https://www.example.pl/') {
  const title = nodeText(select(root, 'title')[0]);
  const metaEl = select(root, 'meta[name=description]')[0];
  const desc = cleanText(metaEl?.attrs.content);
  const h1 = nodeText(select(root, 'h1')[0]);
  const firstP = nodeText(select(root, 'p')[0]);
  const shownTitle = title || h1 || url.replace(/^https?:\/\//, '');
  const snippet = desc || firstP || '';
  const t = cut(shownTitle, SERP_TITLE_MAX), d = cut(snippet, SERP_DESC_MAX);
  const u = url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/');
  return {
    title, desc, titleShown: t.text, titleCut: t.cut, titleFromPage: !title, descShown: d.text, descCut: d.cut, descFromPage: !desc,
    titleLen: title.length, descLen: desc.length, breadcrumb: u.join(' › '), site: u[0].replace(/^www\./, ''),
    titleStatus: !title ? 'missing' : title.length < 20 ? 'short' : title.length > SERP_TITLE_MAX ? 'long' : 'ok',
    descStatus: !desc ? 'missing' : desc.length < 70 ? 'short' : desc.length > 160 ? 'long' : 'ok'
  };
}

/* ───────────── „Czytnik ekranu” (symulacja) ───────────── */
const INLINE = new Set(['a', 'strong', 'b', 'em', 'i', 'span', 'small', 'mark', 'code', 'br', 'img', 'abbr', 'time', 'sub', 'sup', 'u', 's', 'label']);
function inlineSpeech(node) {
  if (node.type === 'text') return node.text;
  if (node.tag === 'img') return imgSpeech(node, true);
  if (node.tag === 'br') return ' ';
  if (node.tag === 'a') { const t = cleanText(node.children.map(inlineSpeech).join('')); return ` [link${node.attrs.href ? '' : ' bez adresu'}: ${t || 'bez nazwy'}] `; }
  if (node.tag === 'script' || node.tag === 'style') return '';
  return node.children.map(inlineSpeech).join('');
}
function imgSpeech(img, inline) {
  if (!('alt' in img.attrs)) return `${inline ? ' [' : ''}obraz bez opisu: ${img.attrs.src || 'nieznany plik'}${inline ? '] ' : ''}`;
  if (!img.attrs.alt.trim()) return '';
  return `${inline ? ' [' : ''}obraz: ${img.attrs.alt.trim()}${inline ? '] ' : ''}`;
}
/** Kolejne „wypowiedzi” czytnika ekranu — jak czytnik przejdzie stronę od góry. */
export function screenReader(root) {
  const out = [];
  const title = nodeText(select(root, 'title')[0]);
  out.push({kind: 'page', text: title ? `Strona: ${title}` : 'Strona bez tytułu'});
  const say = (kind, text) => { text = cleanText(text); if (text) out.push({kind, text}); };
  const walk = node => {
    for (const ch of node.children || []) {
      if (ch.type === 'text') { say('text', ch.text); continue; }
      const tag = ch.tag;
      if (['head', 'script', 'style', 'title', 'meta', 'link'].includes(tag)) continue;
      if (/^h[1-6]$/.test(tag)) say('heading', `Nagłówek poziomu ${tag[1]}: ${inlineSpeech(ch)}`);
      else if (tag === 'img') { const s = imgSpeech(ch, false); if (s) say(('alt' in ch.attrs) ? 'img' : 'bad', s.charAt(0).toUpperCase() + s.slice(1)); }
      else if (tag === 'ul' || tag === 'ol') { const items = ch.children.filter(c => c.type === 'el' && c.tag === 'li'); say('list', `Lista, ${items.length} ${plural(items.length, 'element', 'elementy', 'elementów')}`); items.forEach((li, k) => say('item', `${k + 1}. ${inlineSpeech(li)}`)); }
      else if (tag === 'table') {
        const rows = select(ch, 'tr');
        const cols = Math.max(0, ...rows.map(r => r.children.filter(c => c.type === 'el' && (c.tag === 'td' || c.tag === 'th')).length));
        say('table', `Tabela: ${rows.length} ${plural(rows.length, 'wiersz', 'wiersze', 'wierszy')}, ${cols} ${plural(cols, 'kolumna', 'kolumny', 'kolumn')}`);
        const ths = select(ch, 'th').map(nodeText);
        if (ths.length) say('item', `Nagłówki kolumn: ${ths.join(', ')}`); else say('bad', 'Tabela bez nagłówków <th> — czytnik nie powie, co oznaczają kolumny.');
      }
      else if (tag === 'a') say('link', inlineSpeech(ch));
      else if (tag === 'button') say('link', `Przycisk: ${inlineSpeech(ch)}`);
      else if (['p', 'li', 'td', 'th', 'figcaption', 'blockquote', 'dt', 'dd', 'label'].includes(tag) || INLINE.has(tag)) say('text', inlineSpeech(ch));
      else if (tag === 'nav') { say('region', 'Nawigacja'); walk(ch); }
      else walk(ch);
    }
  };
  walk(root);
  return out;
}

/* ───────────── Bezpieczny podgląd i plik do pobrania ───────────── */
// Podgląd działa w <iframe sandbox="" srcdoc>: pusty sandbox = bez skryptów, formularzy, wyskakujących okien
// i bez dostępu do strony platformy (unikalne „puste” pochodzenie). Dodatkowo CSP w dokumencie blokuje
// każdy zasób spoza dokumentu (obrazki tylko jako data:), a buildDocument usuwa skrypty, ramki i odnośniki do sieci.
export const PREVIEW_CSP = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:";
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const placeholderSvg = (line1, line2) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120"><rect x="1" y="1" width="238" height="118" fill="#fff4f4" stroke="#b03535" stroke-width="2" stroke-dasharray="6 4"/><path d="M20 22l16 16M36 22L20 38" stroke="#b03535" stroke-width="4"/><text x="120" y="64" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#8a1c1c" text-anchor="middle">${line1.replace(/[<&"]/g, '')}</text><text x="120" y="86" font-family="Arial,sans-serif" font-size="12" fill="#5c1f1f" text-anchor="middle">${line2.replace(/[<&"]/g, '').slice(0, 34)}</text></svg>`)}`;
/** Co pokaże podgląd w miejscu obrazka o danym src. */
export function previewImageSrc(src) {
  const v = String(src ?? '').trim();
  if (imageExists(v)) return imageDataUri(imgName(v));
  if (/^data:image\//i.test(v)) return v;
  if (!v) return placeholderSvg('Brak src', 'nie wiadomo, jaki plik pokazać');
  if (isExternal(v)) return placeholderSvg('Obrazek z internetu', 'zablokowany w podglądzie');
  return placeholderSvg('Nie ma takiego pliku', v.split(/[\\/]/).pop());
}
const ATTR_RE = /(\s)([^\s"'>/=]+)(\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
const unq = v => v == null ? '' : v.replace(/^["']|["']$/g, '');
/**
 * Dokument do <iframe sandbox srcdoc>: bez skryptów, ramek, przekierowań i zasobów z sieci; style.css wstawiony
 * w miejsce <link>, obrazki z folderu strony jako data URI. download:true — plik do zapisania na dysku
 * (linki zostają prawdziwe, obrazki wbudowane, więc plik działa po otwarciu na każdym komputerze).
 */
export function buildDocument(html, css = '', {download = false} = {}) {
  let src = String(html ?? '');
  const removed = {scripts: 0, other: 0};
  src = src.replace(/<script\b[\s\S]*?(<\/script\s*>|$)/gi, () => { removed.scripts++; return ''; });
  src = src.replace(/<(iframe|object|frameset|noscript|template)\b[\s\S]*?(<\/\1\s*>|$)/gi, () => { removed.other++; return ''; });
  src = src.replace(/<(base|embed|frame|portal)\b[^>]*>/gi, () => { removed.other++; return ''; });
  src = src.replace(/<meta\b[^>]*http-equiv[^>]*>/gi, () => { removed.other++; return ''; });
  const cssInline = String(css ?? '').replace(/<\/style/gi, '<\\/style');
  src = src.replace(/<link\b[^>]*>/gi, tag => {
    if (/rel\s*=\s*["']?stylesheet/i.test(tag) && /href\s*=\s*["']?(\.\/)?style\.css["'\s/>]/i.test(tag)) return `<style>\n${cssInline}\n</style>`;
    removed.other++; return '';
  });
  // atrybuty: zdarzenia (on…) zawsze precz; w podglądzie także linki do sieci i zasoby spoza folderu strony
  src = src.replace(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^<>]*?)?(\/?)>/g, (m, name, attrs = '', slash) => {
    const tag = name.toLowerCase();
    let out = (attrs || '').replace(ATTR_RE, (am, sp, an, eqPart, val) => {
      const a = an.toLowerCase();
      if (/^on/.test(a)) { removed.scripts++; return ''; }
      if (/^(src|href|action|formaction|xlink:href)$/.test(a) && /^\s*javascript:/i.test(unq(val))) { removed.scripts++; return ''; }
      if (tag === 'img' && a === 'src') return `${sp}src="${download && !imageExists(unq(val)) ? escAttr(unq(val)) : previewImageSrc(unq(val))}"`;
      if (download) return am;
      if (tag === 'a' && a === 'href') { const h = unq(val).trim(); return h.startsWith('#') ? am : `${sp}href="#" data-href="${escAttr(h)}"`; }
      if (a === 'srcset' || a === 'poster' || a === 'background' || a === 'ping' || (a === 'src' && tag !== 'img') || (a === 'href' && tag !== 'a')) { removed.other++; return ''; }
      return am;
    });
    if (tag === 'img' && !/\ssrc\s*=/i.test(out) && !download) out += ` src="${previewImageSrc('')}"`;
    return `<${name}${out}${slash}>`;
  });
  // CSS: @import i url() spoza folderu strony
  src = src.replace(/@import[^;\n]*;?/gi, () => { removed.other++; return ''; });
  src = src.replace(/url\(\s*(["']?)([^"')]*)\1\s*\)/gi, (m, q, val) => {
    if (imageExists(val)) return `url("${imageDataUri(imgName(val))}")`;
    if (/^data:/i.test(val.trim())) return m;
    if (download) return m;
    removed.other++; return 'none';
  });
  const doctype = /^\s*<!doctype[^>]*>/i.exec(src);
  const body = doctype ? src.slice(doctype[0].length) : src;
  const head = download
    ? '<!DOCTYPE html>\n<!-- Zapisano z edytora htmlLab (platforma Informatyka praktycznie). Arkusz style.css i obrazki z folderu strony są wbudowane w ten plik. -->\n'
    : `<!DOCTYPE html><meta http-equiv="Content-Security-Policy" content="${escAttr(PREVIEW_CSP)}">`;
  return {doc: head + body.replace(/^\s*\n/, ''), removed};
}
/** Nazwa pliku do pobrania: małe litery, bez polskich znaków i spacji. */
export function downloadName(text, fallback = 'moja-strona') {
  const base = String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return `${base || fallback}.html`;
}

/* ───────────── Edytor: klawisze i kolorowanie składni ───────────── */
const INDENT = '  ';
/** Tab/Shift+Tab/Enter w edytorze. Zwraca {from,to,insert,selStart,selEnd} albo null (zwykłe działanie klawisza). */
export function editKey(value, s, e, key, shift) {
  const lineStart = value.lastIndexOf('\n', s - 1) + 1;
  if (key === 'Tab') {
    if (s === e && !shift) return {from: s, to: e, insert: INDENT, selStart: s + 2, selEnd: s + 2};
    const blockEnd = value.indexOf('\n', Math.max(s, e - 1)); const end = blockEnd === -1 ? value.length : blockEnd;
    const lines = value.slice(lineStart, end).split('\n');
    const changed = lines.map(l => shift ? l.replace(/^ {1,2}/, '') : INDENT + l);
    const insert = changed.join('\n');
    const firstDelta = changed[0].length - lines[0].length;
    return {from: lineStart, to: end, insert, selStart: Math.max(lineStart, s + firstDelta), selEnd: e + (insert.length - (end - lineStart))};
  }
  if (key === 'Enter') {
    const line = value.slice(lineStart, s);
    let ind = /^\s*/.exec(line)[0];
    const opened = /<([a-z][a-z0-9]*)\b[^<>]*>\s*$/i.exec(line);
    if ((opened && !VOID_TAGS.has(opened[1].toLowerCase()) && !new RegExp(`</${opened[1]}\\s*>`, 'i').test(line.slice(opened.index))) || /\{\s*$/.test(line)) ind += INDENT;
    const insert = '\n' + ind;
    return {from: s, to: e, insert, selStart: s + insert.length, selEnd: s + insert.length};
  }
  return null;
}
export const applyEdit = (v, ed) => v.slice(0, ed.from) + ed.insert + v.slice(ed.to);

function cssTokens(src, out) {
  const re = /(\/\*[\s\S]*?(?:\*\/|$))|(@[a-z-]+)|([{}])|([;:,])|("[^"\n]*"?|'[^'\n]*'?)|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|deg)?)|([^\s{}:;,"'/]+|\/)|(\s+)/g;
  let m, inBlock = false, afterColon = false;
  while ((m = re.exec(src))) {
    const v = m[0];
    if (m[1]) out.push({t: 'com', v});
    else if (m[2]) out.push({t: 'at', v});
    else if (m[3]) { inBlock = v === '{'; afterColon = false; out.push({t: 'punc', v}); }
    else if (m[4]) { if (v === ':' && inBlock) afterColon = true; if (v === ';') afterColon = false; out.push({t: 'punc', v}); }
    else if (m[5]) out.push({t: 'str', v});
    else if (m[6]) out.push({t: inBlock && afterColon ? 'num' : inBlock ? 'prop' : 'sel', v});
    else if (m[7]) out.push({t: !inBlock ? 'sel' : afterColon ? 'val' : 'prop', v});
    else out.push({t: 'txt', v});
  }
}
function tagTokens(raw, out) {
  const m = /^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/.exec(raw);
  if (!m) { out.push({t: 'txt', v: raw}); return; }
  out.push({t: 'tag', v: m[0]});
  let rest = raw.slice(m[0].length);
  const re = /(\s+)|([^\s=>"'/]+)|(=)|("[^"]*"?|'[^']*'?)|(\/?>)|(\/)/g;
  let mm, prevEq = false;
  while ((mm = re.exec(rest))) {
    if (mm[1]) out.push({t: 'txt', v: mm[1]});
    else if (mm[2]) { out.push({t: prevEq ? 'val' : 'attr', v: mm[2]}); prevEq = false; continue; }
    else if (mm[3]) { out.push({t: 'punc', v: '='}); prevEq = true; continue; }
    else if (mm[4]) out.push({t: 'val', v: mm[4]});
    else if (mm[5] || mm[6]) out.push({t: 'tag', v: mm[0]});
    prevEq = false;
  }
}
/** Kolorowanie składni: zwraca linie, każda to lista {t, v} (t: tag, attr, val, com, doc, txt, ent, sel, prop, num, punc, at, str). */
export function highlight(src, lang = 'html') {
  src = String(src ?? '');
  const flat = [];
  if (lang === 'css') cssTokens(src, flat);
  else {
    for (const t of tokenizeHtml(src)) {
      if (t.type === 'comment') flat.push({t: 'com', v: t.raw});
      else if (t.type === 'doctype') flat.push({t: 'doc', v: t.raw});
      else if (t.type === 'start' || t.type === 'end') tagTokens(t.raw, flat);
      else if (t.rawText === 'style') cssTokens(t.raw, flat);
      else for (const part of t.raw.split(/(&[#a-z0-9]+;)/i)) if (part) flat.push({t: /^&[#a-z0-9]+;$/i.test(part) ? 'ent' : 'txt', v: part});
    }
  }
  const lines = [[]];
  for (const tok of flat) {
    const parts = tok.v.split('\n');
    parts.forEach((p, k) => { if (k > 0) lines.push([]); if (p) lines[lines.length - 1].push({t: tok.t, v: p}); });
  }
  return lines;
}

/* ───────────── Ściąga znaczników (wstawianie w miejscu kursora) ───────────── */
export const SNIPPETS = [
  {label: 'h2', title: 'Nagłówek sekcji', code: '<h2>Tytuł sekcji</h2>'},
  {label: 'p', title: 'Akapit', code: '<p>Tekst akapitu.</p>'},
  {label: 'strong', title: 'Pogrubienie (ważne słowo)', code: '<strong>ważne</strong>'},
  {label: 'ul', title: 'Lista punktowana', code: '<ul>\n  <li>Pierwszy</li>\n  <li>Drugi</li>\n  <li>Trzeci</li>\n</ul>'},
  {label: 'a', title: 'Link', code: '<a href="https://www.example.pl">Opis linku</a>'},
  {label: 'img', title: 'Obrazek z folderu', code: '<img src="pizza.svg" alt="Opis tego, co widać">'},
  {label: 'table', title: 'Tabela z nagłówkiem', code: '<table>\n  <tr><th>Dzień</th><th>Godziny</th></tr>\n  <tr><td>Poniedziałek</td><td>15:00–18:00</td></tr>\n</table>'},
  {label: 'figure', title: 'Obrazek z podpisem', code: '<figure>\n  <img src="gory.svg" alt="Opis tego, co widać">\n  <figcaption>Podpis pod obrazkiem</figcaption>\n</figure>'}
];
export const CSS_SNIPPETS = [
  {label: 'tło strony', title: 'Kolor tła całej strony', code: 'body {\n  background-color: #fdf6e3;\n}'},
  {label: 'kolor h1', title: 'Kolor nagłówka', code: 'h1 {\n  color: #1f4fa3;\n}'},
  {label: 'czcionka', title: 'Krój i wielkość pisma', code: 'body {\n  font-family: Georgia, serif;\n  font-size: 18px;\n}'},
  {label: 'odstępy', title: 'Margines wewnętrzny i ramka', code: 'header {\n  padding: 16px;\n  border: 3px solid #333333;\n}'},
  {label: 'zaokrąglenie', title: 'Zaokrąglone rogi', code: 'a {\n  border-radius: 8px;\n}'},
  {label: 'flex', title: 'Elementy obok siebie (menu)', code: 'nav ul {\n  display: flex;\n  gap: 12px;\n}'}
];
export function insertSnippet(value, pos, code) {
  const lineStart = value.lastIndexOf('\n', pos - 1) + 1;
  const ind = /^\s*/.exec(value.slice(lineStart, pos))[0];
  const text = code.replace(/\n/g, '\n' + ind);
  return {value: value.slice(0, pos) + text + value.slice(pos), caret: pos + text.length};
}
