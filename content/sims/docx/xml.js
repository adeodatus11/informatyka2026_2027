// Mały, nie-walidujący parser XML w czystym JS (bez DOMParser), wystarczający dla części OOXML.
// Węzeł: {name, attrs, children}; tekst jako string w children.
// Prefiksy przestrzeni nazw są ujednolicane według URI (np. dowolny prefiks głównej przestrzeni Worda → „w:”),
// bo różne programy zapisują DOCX z różnymi prefiksami.
import {DocxError, ERRORS} from './zip.js';

const NS = {
 'http://schemas.openxmlformats.org/wordprocessingml/2006/main': 'w',
 'http://purl.oclc.org/ooxml/wordprocessingml/main': 'w',
 'http://schemas.openxmlformats.org/officeDocument/2006/relationships': 'r',
 'http://purl.oclc.org/ooxml/officeDocument/relationships': 'r',
 'http://schemas.openxmlformats.org/package/2006/relationships': '',
 'http://schemas.openxmlformats.org/package/2006/content-types': '',
 'http://schemas.openxmlformats.org/drawingml/2006/main': 'a',
 'http://purl.oclc.org/ooxml/drawingml/main': 'a',
 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing': 'wp',
 'http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing': 'wp',
 'http://schemas.openxmlformats.org/drawingml/2006/picture': 'pic',
 'http://schemas.openxmlformats.org/drawingml/2006/chart': 'c',
 'http://schemas.openxmlformats.org/markup-compatibility/2006': 'mc',
 'urn:schemas-microsoft-com:vml': 'v',
 'urn:schemas-microsoft-com:office:office': 'o',
 'http://schemas.microsoft.com/office/word/2010/wordml': 'w14',
 'http://schemas.microsoft.com/office/word/2012/wordml': 'w15',
 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape': 'wps',
 'http://schemas.openxmlformats.org/officeDocument/2006/math': 'm',
 'http://www.w3.org/XML/1998/namespace': 'xml',
};

const ENT = {lt: '<', gt: '>', amp: '&', quot: '"', apos: "'"};
export function decodeEntities(s) {
 if (s.indexOf('&') < 0) return s;
 return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (m, e) => {
  if (e[0] === '#') {
   const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
   try { return String.fromCodePoint(code); } catch { return m; }
  }
  return ENT[e] ?? m;
 });
}

// Elementy, w których zachowujemy tekst złożony z samych spacji.
const KEEP_SPACE = new Set(['w:t', 'w:delText', 'w:instrText', 'w:delInstrText', 'a:t', 'm:t']);
const bad = () => { throw new DocxError('xml', ERRORS.xml); };

export function parseXml(str) {
 if (typeof str !== 'string') bad();
 const root = {name: '#document', attrs: {}, children: []};
 const stack = [root];
 let scopes = [{xml: 'http://www.w3.org/XML/1998/namespace'}];
 const n = str.length;
 let i = 0;
 const resolve = (qname, scope, isAttr) => {
  const c = qname.indexOf(':');
  const prefix = c < 0 ? '' : qname.slice(0, c), local = c < 0 ? qname : qname.slice(c + 1);
  if (isAttr && c < 0) return qname; // atrybuty bez prefiksu nie należą do przestrzeni nazw
  const uri = scope[prefix];
  if (uri === undefined) return qname;
  const canon = NS[uri];
  if (canon === undefined) return qname;
  return canon ? canon + ':' + local : local;
 };
 while (i < n) {
  const lt = str.indexOf('<', i);
  if (lt < 0) { addText(str.slice(i)); break; }
  if (lt > i) addText(str.slice(i, lt));
  const c1 = str[lt + 1];
  if (c1 === '?') { const e = str.indexOf('?>', lt + 2); if (e < 0) bad(); i = e + 2; continue; }
  if (c1 === '!') {
   if (str.startsWith('<!--', lt)) { const e = str.indexOf('-->', lt + 4); if (e < 0) bad(); i = e + 3; continue; }
   if (str.startsWith('<![CDATA[', lt)) {
    const e = str.indexOf(']]>', lt + 9); if (e < 0) bad();
    stack[stack.length - 1].children.push(str.slice(lt + 9, e)); i = e + 3; continue;
   }
   // DOCTYPE (z ewentualnym podzbiorem wewnętrznym […]) — pomijamy
   let j = lt + 2, depth = 0;
   for (; j < n; j++) { const ch = str[j]; if (ch === '[') depth++; else if (ch === ']') depth--; else if (ch === '>' && depth <= 0) break; }
   if (j >= n) bad();
   i = j + 1; continue;
  }
  if (c1 === '/') {
   const gt = str.indexOf('>', lt + 2); if (gt < 0) bad();
   if (stack.length < 2) bad();
   stack.pop(); scopes.pop();
   i = gt + 1; continue;
  }
  // Znacznik otwierający: nazwa, atrybuty w cudzysłowach, ewentualnie „/>”.
  let j = lt + 1;
  while (j < n && !/[\s/>]/.test(str[j])) j++;
  const rawName = str.slice(lt + 1, j);
  if (!rawName) bad();
  const rawAttrs = [];
  let selfClose = false;
  for (;;) {
   while (j < n && /\s/.test(str[j])) j++;
   if (j >= n) bad();
   const ch = str[j];
   if (ch === '>') { j++; break; }
   if (ch === '/') { if (str[j + 1] !== '>') bad(); selfClose = true; j += 2; break; }
   let k = j;
   while (k < n && !/[\s=/>]/.test(str[k])) k++;
   const an = str.slice(j, k);
   while (k < n && /\s/.test(str[k])) k++;
   if (str[k] !== '=') bad();
   k++;
   while (k < n && /\s/.test(str[k])) k++;
   const q = str[k];
   if (q !== '"' && q !== "'") bad();
   const e = str.indexOf(q, k + 1); if (e < 0) bad();
   rawAttrs.push([an, decodeEntities(str.slice(k + 1, e))]);
   j = e + 1;
  }
  const parentScope = scopes[scopes.length - 1];
  let scope = parentScope;
  for (const [an, v] of rawAttrs) {
   if (an === 'xmlns' || an.startsWith('xmlns:')) {
    if (scope === parentScope) scope = {...parentScope};
    scope[an === 'xmlns' ? '' : an.slice(6)] = v;
   }
  }
  const attrs = {};
  for (const [an, v] of rawAttrs) if (an !== 'xmlns' && !an.startsWith('xmlns:')) attrs[resolve(an, scope, true)] = v;
  const node = {name: resolve(rawName, scope, false), attrs, children: []};
  stack[stack.length - 1].children.push(node);
  if (!selfClose) { stack.push(node); scopes.push(scope); }
  i = j;
 }
 if (stack.length !== 1) bad();
 const top = root.children.find(c => typeof c === 'object');
 if (!top) bad();
 return top;

 function addText(raw) {
  const parent = stack[stack.length - 1];
  if (!KEEP_SPACE.has(parent.name) && !/\S/.test(raw)) return;
  parent.children.push(decodeEntities(raw));
 }
}

// Pomocnicze funkcje do poruszania się po drzewie.
export const kids = (el, name) => (el?.children || []).filter(c => typeof c === 'object' && (!name || c.name === name));
export const kid = (el, name) => (el?.children || []).find(c => typeof c === 'object' && c.name === name) || null;
export const textOf = el => (el?.children || []).map(c => typeof c === 'string' ? c : textOf(c)).join('');
export function* walk(el) {
 if (!el || typeof el !== 'object') return;
 yield el;
 for (const c of el.children) if (typeof c === 'object') yield* walk(c);
}
export function find(el, name) { for (const x of walk(el)) if (x.name === name) return x; return null; }
export function findAll(el, name) { const out = []; for (const x of walk(el)) if (x.name === name) out.push(x); return out; }
// Wartość przełącznika (w:b, w:titlePg…): brak atrybutu = włączony; „0”, „false”, „off” = wyłączony.
export const isOn = el => !!el && !['0', 'false', 'off', 'none'].includes(String(el.attrs['w:val'] ?? 'true').toLowerCase());
