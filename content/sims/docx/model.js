// Model dokumentu DOCX dla sprawdzeń i podglądu. Czysta logika (bez DOM, bez Reacta) — działa w Node 22 i w przeglądarce.
// Plik czytany jest wyłącznie lokalnie: funkcja dostaje bajty, nic nie wysyła i niczego nie zapisuje.
import {openZip, sniff, fail, DocxError, MAX_FILE_BYTES} from './zip.js';
import {parseXml, kids, kid, textOf, walk, find, isOn} from './xml.js';

// ——— Nazwy stylów ———
// Word zapisuje wbudowane style po angielsku („heading 1”), niezależnie od języka interfejsu, ale inne programy
// (albo starsze wersje) potrafią zapisać nazwę polską („Nagłówek 1”), a identyfikator bywa okrojony („Nagwek1”).
// Dlatego rozpoznajemy styl po nazwie, a dopiero w ostateczności po identyfikatorze.
export const plain = s => String(s ?? '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const KEYS = {
 normal: 'normal', normalny: 'normal', standard: 'normal', 'default paragraph style': 'normal', 'domyslny styl akapitu': 'normal',
 title: 'title', tytul: 'title', subtitle: 'subtitle', podtytul: 'subtitle',
 caption: 'caption', legenda: 'caption',
 'toc heading': 'toc heading', 'naglowek spisu tresci': 'toc heading', nagwekspisutreci: 'toc heading', tocheading: 'toc heading',
 'table of figures': 'table of figures', 'spis ilustracji': 'table of figures', tableoffigures: 'table of figures', spisilustracji: 'table of figures',
 header: 'header', naglowek: 'header', nagwek: 'header', footer: 'footer', stopka: 'footer',
 'list paragraph': 'list paragraph', 'akapit z lista': 'list paragraph', listparagraph: 'list paragraph', akapitzlist: 'list paragraph',
 tytu: 'title', podtytu: 'subtitle',
};
export function styleKey(name, id) {
 for (const raw of [name, id]) {
  const s = plain(raw);
  if (!s) continue;
  let m = s.match(/^(?:heading|naglowek|nagwek|uberschrift)\s*(\d)$/);
  if (m) return 'heading ' + m[1];
  m = s.match(/^(?:toc|spis tresci|spistreci|spistresci)\s*(\d)$/);
  if (m) return 'toc ' + m[1];
  if (KEYS[s]) return KEYS[s];
  // Nazwa własna stylu (np. „Mój rozdział”). Identyfikator sprawdzamy tylko, gdy nazwy brak.
  if (raw === name || !plain(name)) return s;
 }
 return 'normal';
}
const LABELS = {normal: 'Normalny', title: 'Tytuł', subtitle: 'Podtytuł', caption: 'Legenda (podpis)', 'toc heading': 'Nagłówek spisu treści',
 'table of figures': 'Spis ilustracji', header: 'Nagłówek strony', footer: 'Stopka', 'list paragraph': 'Akapit z listą'};
export function styleLabel(key, name) {
 let m = key.match(/^heading (\d)$/); if (m) return 'Nagłówek ' + m[1];
 m = key.match(/^toc (\d)$/); if (m) return 'Spis treści ' + m[1];
 return LABELS[key] || name || key;
}

// ——— Style ———
const halfPt = el => { const v = Number(el?.attrs['w:val']); return Number.isFinite(v) && v > 0 ? v / 2 : null; };
function runProps(rPr) {
 if (!rPr) return {};
 const o = {};
 const sz = kid(rPr, 'w:sz'); if (sz) o.size = halfPt(sz);
 const c = kid(rPr, 'w:color'); if (c && c.attrs['w:val']) o.color = c.attrs['w:val'];
 const b = kid(rPr, 'w:b'); if (b) o.bold = isOn(b);
 const i = kid(rPr, 'w:i'); if (i) o.italic = isOn(i);
 const u = kid(rPr, 'w:u'); if (u) o.underline = isOn(u);
 const caps = kid(rPr, 'w:caps'); if (caps) o.caps = isOn(caps);
 const st = kid(rPr, 'w:rStyle'); if (st) o.rStyle = st.attrs['w:val'];
 const v = kid(rPr, 'w:vanish'); if (v) o.hidden = isOn(v);
 return o;
}
export function parseStyles(root) {
 const byId = {}; let defaultPara = null;
 const dd = root ? find(root, 'w:docDefaults') : null;
 const defaults = runProps(dd ? find(dd, 'w:rPr') : null);
 for (const s of kids(root, 'w:style')) {
  const id = s.attrs['w:styleId']; if (!id) continue;
  const name = kid(s, 'w:name')?.attrs['w:val'] || '';
  const pPr = kid(s, 'w:pPr');
  const ol = kid(pPr, 'w:outlineLvl');
  const st = {id, name, type: s.attrs['w:type'] || 'paragraph', key: styleKey(name, id), basedOn: kid(s, 'w:basedOn')?.attrs['w:val'] || null,
   rPr: runProps(kid(s, 'w:rPr')), outline: ol ? Number(ol.attrs['w:val']) : null, numId: kid(kid(pPr, 'w:numPr'), 'w:numId')?.attrs['w:val'] || null};
  st.label = styleLabel(st.key, name);
  byId[id] = st;
  if (st.type === 'paragraph' && isOn({attrs: {'w:val': s.attrs['w:default'] ?? '0'}})) defaultPara = id;
 }
 return {byId, defaultPara, defaults};
}
// Właściwość z łańcucha basedOn (z ochroną przed pętlą), na końcu domyślne ustawienia dokumentu.
export function styleProp(styles, id, prop) {
 const seen = new Set();
 for (let s = styles.byId[id]; s && !seen.has(s.id); s = styles.byId[s.basedOn]) {
  seen.add(s.id);
  if (s.rPr[prop] !== undefined) return s.rPr[prop];
 }
 return styles.defaults[prop] ?? (prop === 'size' ? 10 : undefined);
}
function styleOutline(styles, id) {
 const seen = new Set();
 for (let s = styles.byId[id]; s && !seen.has(s.id); s = styles.byId[s.basedOn]) { seen.add(s.id); if (s.outline !== null) return s.outline; }
 return null;
}
export function findStyle(styles, key) { return Object.values(styles.byId).find(s => s.type === 'paragraph' && s.key === key) || null; }

// ——— Numeracja list (tylko do podglądu) ———
function parseNumbering(root) {
 const abstract = {}, nums = {};
 for (const a of kids(root, 'w:abstractNum')) {
  const levels = {};
  for (const l of kids(a, 'w:lvl')) levels[l.attrs['w:ilvl']] = {fmt: kid(l, 'w:numFmt')?.attrs['w:val'] || 'decimal', text: kid(l, 'w:lvlText')?.attrs['w:val'] ?? '', start: Number(kid(l, 'w:start')?.attrs['w:val'] ?? 1)};
  abstract[a.attrs['w:abstractNumId']] = levels;
 }
 for (const nEl of kids(root, 'w:num')) nums[nEl.attrs['w:numId']] = kid(nEl, 'w:abstractNumId')?.attrs['w:val'];
 return {abstract, nums, counters: {}};
}
const ROMAN = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
function fmtNum(n, fmt) {
 if (fmt === 'lowerLetter' || fmt === 'upperLetter') { const s = String.fromCharCode(97 + ((n - 1) % 26)); return fmt === 'upperLetter' ? s.toUpperCase() : s; }
 if (fmt === 'lowerRoman' || fmt === 'upperRoman') { let r = '', x = n; for (const [v, s] of ROMAN) while (x >= v) { r += s; x -= v; } return fmt === 'upperRoman' ? r.toUpperCase() : r; }
 return String(n);
}
function listLabel(numbering, numId, ilvl) {
 if (!numbering || !numId || numId === '0') return null;
 const levels = numbering.abstract[numbering.nums[numId]];
 if (!levels) return null;
 const lvl = levels[ilvl] || levels['0'];
 if (!lvl || lvl.fmt === 'none') return null;
 if (lvl.fmt === 'bullet') return '•';
 const c = numbering.counters[numId] ||= {};
 const i = Number(ilvl);
 c[i] = (c[i] ?? ((levels[i]?.start ?? 1) - 1)) + 1;
 for (const k of Object.keys(c)) if (Number(k) > i) delete c[k];
 return lvl.text.replace(/%(\d)/g, (m, k) => { const li = Number(k) - 1; return fmtNum(c[li] ?? levels[li]?.start ?? 1, levels[li]?.fmt); });
}

// ——— Pola ———
export function parseInstr(instr) {
 const tokens = [...String(instr).matchAll(/"([^"]*)"|“([^”]*)”|(\S+)/g)].map(m => ({v: m[1] ?? m[2] ?? m[3], quoted: m[1] !== undefined || m[2] !== undefined}));
 const type = (tokens[0]?.v || '').toUpperCase();
 const args = [], sw = {};
 for (let i = 1; i < tokens.length; i++) {
  const t = tokens[i];
  if (!t.quoted && t.v.startsWith('\\') && t.v.length > 1) {
   const key = t.v.slice(1, 2).toLowerCase() + (t.v.length > 2 ? t.v.slice(2) : '');
   const next = tokens[i + 1];
   if (next && (next.quoted || !next.v.startsWith('\\'))) { sw[key] = next.v; i++; } else sw[key] = true;
  } else if (!Object.keys(sw).length) args.push(t.v);
 }
 return {type, args, sw};
}

// ——— Ścieżki i relacje ———
function resolvePath(dir, target) {
 if (target.startsWith('/')) return target.slice(1);
 const out = [];
 for (const p of (dir + target).split('/')) { if (p === '..') out.pop(); else if (p && p !== '.') out.push(p); }
 return out.join('/');
}
async function readRels(zip, partPath) {
 const cut = partPath.lastIndexOf('/') + 1;
 const dir = partPath.slice(0, cut);
 const xml = await zip.text(dir + '_rels/' + partPath.slice(cut) + '.rels');
 const map = {};
 if (!xml) return map;
 for (const r of kids(parseXml(xml), 'Relationship')) {
  const type = String(r.attrs.Type || '').split('/').pop();
  const external = r.attrs.TargetMode === 'External';
  map[r.attrs.Id] = {type, external, target: external ? r.attrs.Target : resolvePath(dir, r.attrs.Target || '')};
 }
 return map;
}
const relOfType = (rels, type) => Object.values(rels).find(r => r.type === type && !r.external)?.target || null;

// ——— Przechodzenie treści ———
const REV_EL = new Set(['w:ins', 'w:del', 'w:moveFrom', 'w:moveTo', 'w:cellIns', 'w:cellDel', 'w:cellMerge', 'w:rPrChange', 'w:pPrChange', 'w:sectPrChange', 'w:tblPrChange', 'w:trPrChange', 'w:tcPrChange', 'w:tblGridChange', 'w:numberingChange', 'w:tblPrExChange']);
const IMG_EXT = {png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', svg: 'image/svg+xml', webp: 'image/webp'};

function newCtx(shared, part, rels) {
 return {shared, part, rels, paragraphs: [], fields: [], stack: [], inTable: 0, inBox: 0, tables: []};
}

function addSeg(ctx, para, seg, st) {
 const s = shared(ctx);
 // Tekst wewnątrz kodu pola (np. zagnieżdżone pole w instrukcji) nie jest widoczny w dokumencie.
 const hidden = ctx.stack.some(f => f.phase === 'instr');
 if (hidden) { if (seg.t === 'text') { const f = [...ctx.stack].reverse().find(x => x.phase === 'instr'); f.instr += seg.v; } return; }
 seg.fids = ctx.stack.map(f => f.id);
 if (st.ins) seg.ins = true;
 if (st.del) seg.del = true;
 if (s.activeComments.size) seg.cm = [...s.activeComments];
 para.segs.push(seg);
 if (seg.t === 'text') {
  if (!st.del) for (const f of ctx.stack) { f.result += seg.v; f.paras.add(para.id); }
  else for (const f of ctx.stack) f.paras.add(para.id);
  if (!st.del) for (const id of s.activeComments) s.anchors[id] = (s.anchors[id] || '') + seg.v;
 } else for (const f of ctx.stack) f.paras.add(para.id);
}
const shared = ctx => ctx.shared;

function startField(ctx, instr, phase, del) {
 const f = {id: ++ctx.shared.fieldSeq, instr, phase, result: '', paras: new Set(), part: ctx.part, del: !!del};
 ctx.stack.push(f);
 ctx.shared.fieldById[f.id] = f;
 return f;
}
function endField(ctx) {
 const f = ctx.stack.pop();
 if (!f) return;
 const p = parseInstr(f.instr);
 f.type = p.type; f.args = p.args; f.sw = p.sw; f.paras = [...f.paras];
 ctx.fields.push(f);
}

function drawingSeg(ctx, el) {
 const s = ctx.shared;
 const box = find(el, 'w:txbxContent');
 if (box) {
  const ids = [];
  ctx.inBox++;
  for (const p of kids(box, 'w:p')) ids.push(processParagraph(ctx, p).id);
  ctx.inBox--;
  return {t: 'box', ids};
 }
 const gd = find(el, 'a:graphicData');
 const uri = gd?.attrs.uri || '';
 const docPr = find(el, 'wp:docPr');
 const alt = docPr?.attrs.descr || docPr?.attrs.title || '';
 const ext = find(el, 'wp:extent');
 const w = ext ? Number(ext.attrs.cx) / 360000 : null, h = ext ? Number(ext.attrs.cy) / 360000 : null;
 const floating = !!find(el, 'wp:anchor');
 if (/chart/i.test(uri)) return {t: 'img', chart: true, alt, w, h, floating};
 const blip = find(el, 'a:blip') || find(el, 'v:imagedata');
 const rid = blip?.attrs['r:embed'] || blip?.attrs['r:link'] || blip?.attrs['r:id'];
 const rel = rid ? ctx.rels[rid] : null;
 if (rel && !rel.external) { s.mediaTargets.add(rel.target); return {t: 'img', target: rel.target, alt, w, h, floating}; }
 if (rid || /picture/i.test(uri)) return {t: 'img', missing: true, alt, w, h, floating};
 return null; // kształt bez tekstu
}

function processRunChildren(ctx, para, nodes, st, rp) {
 for (const c of nodes) {
  if (typeof c !== 'object') continue;
  switch (c.name) {
   case 'w:t': case 'w:delText': { const v = textOf(c); if (v) addSeg(ctx, para, {t: 'text', v, ...rp}, st); break; }
   case 'w:tab': case 'w:ptab': addSeg(ctx, para, {t: 'text', v: '\t', ...rp}, st); break;
   case 'w:noBreakHyphen': addSeg(ctx, para, {t: 'text', v: '-', ...rp}, st); break;
   case 'w:sym': addSeg(ctx, para, {t: 'text', v: '•', ...rp}, st); break;
   case 'w:br': case 'w:cr': {
    const type = c.attrs['w:type'] || 'textWrapping';
    addSeg(ctx, para, {t: 'br', kind: type === 'page' ? 'page' : type === 'column' ? 'column' : 'line'}, st); break;
   }
   case 'w:fldChar': {
    const type = c.attrs['w:fldCharType'];
    if (type === 'begin') startField(ctx, '', 'instr', st.del);
    else if (type === 'separate') { const f = ctx.stack[ctx.stack.length - 1]; if (f) f.phase = 'result'; }
    else if (type === 'end') endField(ctx);
    break;
   }
   case 'w:instrText': case 'w:delInstrText': { const f = ctx.stack[ctx.stack.length - 1]; if (f && f.phase === 'instr') f.instr += textOf(c); break; }
   case 'w:drawing': case 'w:pict': { const seg = drawingSeg(ctx, c); if (seg) addSeg(ctx, para, seg, st); break; }
   case 'w:object': addSeg(ctx, para, {t: 'img', object: true, alt: 'Obiekt osadzony'}, st); break;
   case 'mc:AlternateContent': { const pick = kid(c, 'mc:Choice') || kid(c, 'mc:Fallback'); if (pick) processRunChildren(ctx, para, pick.children, st, rp); break; }
   case 'w:commentReference': addSeg(ctx, para, {t: 'cref', id: c.attrs['w:id']}, st); break;
   case 'w:footnoteReference': case 'w:endnoteReference': addSeg(ctx, para, {t: 'text', v: '*', note: true}, st); break;
   case 'w:lastRenderedPageBreak': para.rendered = (para.rendered || 0) + 1; break;
   default: break;
  }
 }
}

function processInline(ctx, para, nodes, st) {
 const s = ctx.shared;
 for (const c of nodes) {
  if (typeof c !== 'object') continue;
  switch (c.name) {
   case 'w:pPr': break;
   case 'w:r': {
    const rp = runProps(kid(c, 'w:rPr'));
    if (rp.rStyle) { const cs = s.styles.byId[rp.rStyle]; if (cs?.rPr.bold && rp.bold === undefined) rp.bold = true; }
    processRunChildren(ctx, para, c.children, st, rp);
    break;
   }
   case 'w:ins': case 'w:moveTo': processInline(ctx, para, c.children, {...st, ins: true}); break;
   case 'w:del': case 'w:moveFrom': processInline(ctx, para, c.children, {...st, del: true}); break;
   case 'w:fldSimple': {
    startField(ctx, c.attrs['w:instr'] || '', 'result', st.del);
    processInline(ctx, para, c.children, st);
    endField(ctx);
    break;
   }
   case 'w:hyperlink': case 'w:smartTag': case 'w:customXml': case 'w:dir': case 'w:bdo': processInline(ctx, para, c.children, st); break;
   case 'w:sdt': processInline(ctx, para, kid(c, 'w:sdtContent')?.children || [], st); break;
   case 'w:bookmarkStart': { const n = c.attrs['w:name']; if (n) { para.bookmarks.push(n); s.bookmarks.add(n); } break; }
   case 'w:commentRangeStart': s.activeComments.add(c.attrs['w:id']); break;
   case 'w:commentRangeEnd': s.activeComments.delete(c.attrs['w:id']); break;
   case 'mc:AlternateContent': { const pick = kid(c, 'mc:Choice') || kid(c, 'mc:Fallback'); if (pick) processInline(ctx, para, pick.children, st); break; }
   case 'm:oMath': case 'm:oMathPara': addSeg(ctx, para, {t: 'text', v: '[wzór]'}, st); break;
   default: break;
  }
 }
}

function processParagraph(ctx, el) {
 const s = ctx.shared;
 const pPr = kid(el, 'w:pPr');
 const styleId = kid(pPr, 'w:pStyle')?.attrs['w:val'] || s.styles.defaultPara;
 const style = s.styles.byId[styleId];
 const key = style ? style.key : styleKey(null, styleId);
 const para = {kind: 'p', id: ++s.seq, part: ctx.part, styleId, styleKey: key, styleName: style ? style.label : styleLabel(key, styleId),
  segs: [], bookmarks: [], inTable: ctx.inTable > 0, inBox: ctx.inBox > 0};
 let level = 0;
 const hm = key.match(/^heading (\d)$/);
 const direct = kid(pPr, 'w:outlineLvl');
 const so = styleOutline(s.styles, styleId);
 if (hm) level = Number(hm[1]);
 else if (direct && Number(direct.attrs['w:val']) < 9) level = Number(direct.attrs['w:val']) + 1;
 else if (so !== null && so < 9) level = so + 1;
 para.level = level;
 para.styleOutline = !hm && level > 0;
 if (isOn(kid(pPr, 'w:pageBreakBefore'))) para.pageBreakBefore = true;
 const sect = kid(pPr, 'w:sectPr');
 if (sect) para.sectPr = sect;
 const numPr = kid(pPr, 'w:numPr');
 const numId = kid(numPr, 'w:numId')?.attrs['w:val'] || (style?.numId ?? null);
 if (numId) { para.list = listLabel(s.numbering, numId, kid(numPr, 'w:ilvl')?.attrs['w:val'] || '0'); para.numbered = true; }
 const jc = kid(pPr, 'w:jc')?.attrs['w:val']; if (jc) para.align = jc;
 processInline(ctx, para, el.children, {});
 // Teksty: widok końcowy (wszystkie zmiany przyjęte) i oryginalny (wszystkie odrzucone).
 let fin = '', orig = '';
 for (const g of para.segs) if (g.t === 'text') { if (!g.del) fin += g.v; if (!g.ins) orig += g.v; }
 para.text = fin; para.original = orig;
 para.hasImage = para.segs.some(g => g.t === 'img');
 // Paragraf otwarty w polu złożonym: zapamiętaj, w jakich polach jest (także gdy jest pusty).
 for (const f of ctx.stack) if (f.phase === 'result') f.paras.add(para.id);
 ctx.paragraphs.push(para);
 s.paraById[para.id] = para;
 return para;
}

function processTable(ctx, el) {
 const s = ctx.shared;
 const table = {kind: 'table', id: ++s.seq, part: ctx.part, rows: []};
 ctx.inTable++;
 for (const tr of kids(el, 'w:tr')) {
  const row = [];
  for (const tc of kids(tr, 'w:tc')) {
   const blocks = [];
   processBlocks(ctx, tc.children, blocks);
   const span = Number(kid(kid(tc, 'w:tcPr'), 'w:gridSpan')?.attrs['w:val'] || 1);
   row.push({blocks, span});
  }
  table.rows.push(row);
 }
 ctx.inTable--;
 ctx.tables.push(table);
 s.paraById[table.id] = table;
 return table;
}

function processBlocks(ctx, nodes, out) {
 const s = ctx.shared;
 for (const c of nodes) {
  if (typeof c !== 'object') continue;
  switch (c.name) {
   case 'w:p': out.push(processParagraph(ctx, c)); break;
   case 'w:tbl': out.push(processTable(ctx, c)); break;
   case 'w:sdt': {
    const gallery = find(kid(c, 'w:sdtPr'), 'w:docPartGallery')?.attrs['w:val'] || '';
    const start = out.length;
    processBlocks(ctx, kid(c, 'w:sdtContent')?.children || [], out);
    if (gallery) for (let i = start; i < out.length; i++) out[i].gallery = gallery;
    break;
   }
   case 'w:customXml': case 'w:ins': case 'w:del': case 'w:moveTo': case 'w:moveFrom': processBlocks(ctx, c.children, out); break;
   case 'mc:AlternateContent': { const pick = kid(c, 'mc:Choice') || kid(c, 'mc:Fallback'); if (pick) processBlocks(ctx, pick.children, out); break; }
   case 'w:bookmarkStart': if (c.attrs['w:name']) s.bookmarks.add(c.attrs['w:name']); break;
   case 'w:commentRangeStart': s.activeComments.add(c.attrs['w:id']); break;
   case 'w:commentRangeEnd': s.activeComments.delete(c.attrs['w:id']); break;
   case 'w:sectPr': ctx.finalSect = c; break;
   case 'w:altChunk': ctx.altChunk = true; break;
   default: break;
  }
 }
 return out;
}

function parseSect(el, rels) {
 const pg = kid(el, 'w:pgSz');
 const w = Number(pg?.attrs['w:w'] || 11906), h = Number(pg?.attrs['w:h'] || 16838);
 const orient = pg?.attrs['w:orient'] || (w > h ? 'landscape' : 'portrait');
 const cols = kid(el, 'w:cols');
 const colCount = Math.max(1, Number(cols?.attrs['w:num'] || (cols ? kids(cols, 'w:col').length : 0) || 1));
 const refs = {header: {}, footer: {}};
 for (const kind of ['header', 'footer']) for (const r of kids(el, `w:${kind}Reference`)) {
  const rel = rels[r.attrs['r:id']];
  if (rel && !rel.external) refs[kind][r.attrs['w:type'] || 'default'] = rel.target;
 }
 return {landscape: orient === 'landscape' || w > h, w, h, cols: colCount, start: kid(el, 'w:type')?.attrs['w:val'] || 'nextPage', titlePg: isOn(kid(el, 'w:titlePg')), refs};
}

function countRevisions(root, part, list) {
 for (const el of walk(root)) if (REV_EL.has(el.name)) {
  const kind = el.name === 'w:ins' || el.name === 'w:moveTo' || el.name === 'w:cellIns' ? 'ins' : el.name === 'w:del' || el.name === 'w:moveFrom' || el.name === 'w:cellDel' ? 'del' : 'format';
  let text = '';
  if (kind !== 'format') for (const t of walk(el)) if (t.name === 'w:t' || t.name === 'w:delText') text += textOf(t);
  list.push({kind, part, author: el.attrs['w:author'] || '', text});
 }
}

// Główna funkcja: bajty pliku → model dokumentu. Rzuca DocxError z polskim komunikatem.
export async function readDocx(input, {fileName = '', loadMedia = true} = {}) {
 const base = String(fileName).split(/[\\/]/).pop();
 if (/^~\$/.test(base)) fail('lock');
 const bytes = input instanceof Uint8Array ? input : new Uint8Array(input || []);
 if (!bytes.length) fail('empty');
 if (bytes.length > MAX_FILE_BYTES) fail('tooBig');
 const kind = sniff(bytes);
 if (kind !== 'zip') fail(kind);
 try {
  return await build(openZip(bytes), {fileName: base, loadMedia, size: bytes.length});
 } catch (e) {
  if (e instanceof DocxError) throw e;
  throw new DocxError('corrupt', 'Nie udało się odczytać pliku: jest uszkodzony albo ma nietypową budowę. Otwórz go w Wordzie, zapisz ponownie (Ctrl+S) jako .docx i wgraj jeszcze raz.');
 }
}

async function build(zip, {fileName, loadMedia, size}) {
 if (zip.has('mimetype')) { const m = await zip.text('mimetype'); if (/opendocument/.test(m || '')) fail('odt'); }
 if (zip.has('xl/workbook.xml')) fail('xlsx');
 if (zip.has('ppt/presentation.xml')) fail('pptx');
 const rootRels = await readRels(zip, '.rels').catch(() => ({}));
 let main = relOfType(rootRels, 'officeDocument');
 if (!main || !zip.has(main)) main = 'word/document.xml';
 if (!zip.has(main)) fail('notWord');
 const doc = parseXml(await zip.text(main));
 const body = find(doc, 'w:body');
 if (!body) fail('notWord');
 const rels = await readRels(zip, main);
 const part = async type => { const t = relOfType(rels, type); return t && zip.has(t) ? parseXml(await zip.text(t)) : null; };
 const stylesRoot = await part('styles');
 const styles = parseStyles(stylesRoot);
 const numberingRoot = await part('numbering');
 const settings = await part('settings');
 const commentsRoot = await part('comments');
 const shared = {seq: 0, fieldSeq: 0, styles, numbering: numberingRoot ? parseNumbering(numberingRoot) : null,
  bookmarks: new Set(), activeComments: new Set(), anchors: {}, mediaTargets: new Set(), fieldById: {}, paraById: {}};

 // Treść główna
 const ctx = newCtx(shared, 'body', rels);
 const blocks = processBlocks(ctx, body.children, []);
 while (ctx.stack.length) endField(ctx); // niezamknięte pole w uszkodzonym pliku

 // Sekcje: sectPr w akapicie kończy sekcję; ostatnia jest w w:body.
 const sections = [];
 let cur = [];
 for (const b of blocks) {
  b.section = sections.length; cur.push(b.id);
  if (b.kind === 'p' && b.sectPr) { sections.push({...parseSect(b.sectPr, rels), blocks: cur}); cur = []; }
 }
 sections.push({...parseSect(ctx.finalSect || {name: 'w:sectPr', attrs: {}, children: []}, rels), blocks: cur});
 for (const b of blocks) if (b.kind === 'p') delete b.sectPr;

 // Nagłówki i stopki: brak odwołania danego typu = „Połącz z poprzednim” (dziedziczenie).
 const parts = {};
 const readPart = async target => {
  if (!target || parts[target] !== undefined) return;
  parts[target] = null;
  if (!zip.has(target)) return;
  const root = parseXml(await zip.text(target));
  const pctx = newCtx(shared, target, await readRels(zip, target));
  const pblocks = processBlocks(pctx, root.children, []);
  while (pctx.stack.length) endField(pctx);
  const revs = [];
  countRevisions(root, target, revs);
  parts[target] = {path: target, kind: /footer/i.test(target) ? 'footer' : 'header', blocks: pblocks, paragraphs: pctx.paragraphs, fields: pctx.fields,
   text: pctx.paragraphs.map(p => p.text).join('\n'), revisions: revs};
 };
 const prev = {header: {}, footer: {}};
 for (const sec of sections) {
  sec.eff = {header: {}, footer: {}};
  for (const k of ['header', 'footer']) for (const t of ['default', 'first', 'even']) {
   const own = sec.refs[k][t];
   sec.eff[k][t] = own || prev[k][t] || null;
   if (own) prev[k][t] = own;
   sec.linked = sec.linked || {header: {}, footer: {}};
   sec.linked[k][t] = !own;
   await readPart(sec.eff[k][t]);
  }
 }

 // Komentarze
 const comments = [];
 for (const c of kids(commentsRoot, 'w:comment')) {
  const id = c.attrs['w:id'];
  const text = kids(c, 'w:p').map(p => { let t = ''; for (const x of walk(p)) if (x.name === 'w:t') t += textOf(x); return t; }).join('\n').trim();
  comments.push({id, author: c.attrs['w:author'] || '', initials: c.attrs['w:initials'] || '', date: c.attrs['w:date'] || '', text, anchor: (shared.anchors[id] || '').trim()});
 }

 // Zmiany śledzone (w treści, nagłówkach i stopkach)
 const revisions = [];
 countRevisions(body, 'body', revisions);
 for (const p of Object.values(parts)) if (p) revisions.push(...p.revisions);

 // Obrazy do podglądu
 const media = {};
 if (loadMedia) for (const t of shared.mediaTargets) {
  const ext = t.split('.').pop().toLowerCase();
  if (!IMG_EXT[ext]) continue;
  const b = await zip.bytes(t).catch(() => null);
  if (b && b.length < 15 * 1024 * 1024) media[t] = {bytes: b, type: IMG_EXT[ext]};
 }

 const allFields = [...ctx.fields, ...Object.values(parts).flatMap(p => p ? p.fields : [])];
 return {
  fileName, size, blocks, paragraphs: ctx.paragraphs, tables: ctx.tables, sections, parts: Object.fromEntries(Object.entries(parts).filter(([, v]) => v)),
  fields: ctx.fields, allFields, fieldById: shared.fieldById, byId: shared.paraById, styles, comments, revisions, bookmarks: shared.bookmarks, media,
  trackRevisions: isOn(kid(settings, 'w:trackRevisions')), evenAndOdd: isOn(kid(settings, 'w:evenAndOddHeaders')), altChunk: !!ctx.altChunk,
 };
}
