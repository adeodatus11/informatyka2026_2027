// Minimalny czytnik ZIP dla plików Office (DOCX). Czysty JS, bez zależności.
// Czyta katalog centralny, obsługuje metody 0 (bez kompresji) i 8 (deflate).
// Deflate rozpakowuje natywny DecompressionStream('deflate-raw') — jest w przeglądarkach i w Node 22.

export class DocxError extends Error {
 constructor(code, message) { super(message); this.name = 'DocxError'; this.code = code; }
}

export const MAX_FILE_BYTES = 25 * 1024 * 1024;     // większy DOCX w szkole to zwykle wklejone zdjęcia z telefonu
const MAX_PART_BYTES = 80 * 1024 * 1024;           // ochrona przed „bombą ZIP”

const u16 = (b, o) => b[o] | (b[o + 1] << 8);
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;

export const ERRORS = {
 empty: 'Plik jest pusty (0 bajtów). Zapisz dokument w Wordzie (Ctrl+S) i wybierz go jeszcze raz.',
 tooBig: 'Plik ma ponad 25 MB. Zwykle powodem są duże zdjęcia: w Wordzie kliknij obraz → Formatowanie obrazu → Kompresuj obrazy, zapisz i wgraj ponownie.',
 doc: 'To plik w starym formacie .doc albo dokument zabezpieczony hasłem. W Wordzie wybierz Plik → Zapisz jako → typ „Dokument programu Word (*.docx)” (bez hasła) i wgraj nowy plik.',
 pdf: 'To plik PDF, a nie dokument Worda. PDF nie zawiera stylów ani pól, które tu sprawdzamy — wgraj plik .docx.',
 rtf: 'To plik RTF. W Wordzie wybierz Plik → Zapisz jako → „Dokument programu Word (*.docx)” i wgraj nowy plik.',
 odt: 'To dokument OpenDocument (.odt). Otwórz go w Wordzie i zapisz jako „Dokument programu Word (*.docx)”.',
 xlsx: 'To plik Excela (.xlsx), a nie dokument Worda. Wybierz plik .docx z tej lekcji.',
 pptx: 'To prezentacja PowerPointa (.pptx), a nie dokument Worda. Wybierz plik .docx z tej lekcji.',
 lock: 'To plik tymczasowy Worda (nazwa zaczyna się od ~$). Powstaje, gdy dokument jest otwarty. Wybierz właściwy plik — bez ~$ na początku nazwy.',
 notZip: 'Nie rozpoznaję tego pliku jako dokumentu Worda (.docx). Sprawdź, czy wybierasz plik zapisany w Wordzie z rozszerzeniem .docx.',
 corrupt: 'Plik .docx jest uszkodzony albo niekompletny (np. zapis lub pobieranie się nie dokończyły). Otwórz go w Wordzie, zapisz ponownie (Ctrl+S) i wgraj jeszcze raz.',
 notWord: 'To archiwum ZIP, ale nie dokument Worda (brak treści dokumentu). Wybierz plik .docx zapisany w Wordzie.',
 xml: 'Nie udało się odczytać treści dokumentu — plik jest uszkodzony. Otwórz go w Wordzie, zapisz ponownie (Ctrl+S) i wgraj jeszcze raz.',
 unsupported: 'Ten plik używa rzadkiego sposobu kompresji, którego przeglądarka nie odczyta. Otwórz go w Wordzie i zapisz ponownie jako .docx.',
 noInflate: 'Ta przeglądarka nie potrafi rozpakować pliku DOCX (brak DecompressionStream). Użyj aktualnej przeglądarki Chrome, Edge lub Firefox.',
};
export const fail = code => { throw new DocxError(code, ERRORS[code] || ERRORS.corrupt); };

// Rozpoznanie typu po pierwszych bajtach, zanim potraktujemy plik jak ZIP.
export function sniff(bytes) {
 if (!bytes || !bytes.length) return 'empty';
 const b = bytes;
 if (b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5 || b[2] === 7)) return 'zip';
 if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return 'doc';
 const head = String.fromCharCode(...b.subarray(0, 8));
 if (head.startsWith('%PDF')) return 'pdf';
 if (head.startsWith('{\\rtf')) return 'rtf';
 return 'notZip';
}

async function inflateRaw(data) {
 if (typeof DecompressionStream === 'undefined') fail('noInflate');
 try {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
 } catch { return fail('corrupt'); }
}

const decoder = new TextDecoder('utf-8');

// Zwraca obiekt {names, has(name), bytes(name), text(name)}; nazwy porównywane bez wielkości liter (jak w OOXML).
export function openZip(bytes) {
 if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
 const n = bytes.length;
 if (n < 22) fail('corrupt');
 // Koniec katalogu centralnego: szukamy od końca (komentarz archiwum może mieć do 64 KB).
 let eocd = -1;
 for (let i = n - 22; i >= Math.max(0, n - 22 - 65535); i--) {
  if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 5 && bytes[i + 3] === 6) { eocd = i; break; }
 }
 if (eocd < 0) fail('corrupt');
 const count = u16(bytes, eocd + 10);
 const cdOffset = u32(bytes, eocd + 16);
 if (cdOffset === 0xffffffff || count === 0xffff) fail('unsupported');
 if (cdOffset >= n) fail('corrupt');
 const entries = new Map();
 let p = cdOffset;
 for (let k = 0; k < count; k++) {
  if (p + 46 > n || u32(bytes, p) !== 0x02014b50) fail('corrupt');
  const flags = u16(bytes, p + 8), method = u16(bytes, p + 10);
  const compSize = u32(bytes, p + 20), size = u32(bytes, p + 24);
  const nameLen = u16(bytes, p + 28), extraLen = u16(bytes, p + 30), commentLen = u16(bytes, p + 32);
  const local = u32(bytes, p + 42);
  const raw = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));
  const name = raw.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!name.endsWith('/')) entries.set(name.toLowerCase(), {name, flags, method, compSize, size, local});
  p += 46 + nameLen + extraLen + commentLen;
 }
 const cache = new Map();
 async function read(name) {
  const e = entries.get(String(name).replace(/^\/+/, '').toLowerCase());
  if (!e) return null;
  if (cache.has(e.name)) return cache.get(e.name);
  if (e.flags & 1) fail('doc'); // zaszyfrowany wpis
  if (e.size > MAX_PART_BYTES) fail('tooBig');
  const o = e.local;
  if (o + 30 > n || u32(bytes, o) !== 0x04034b50) fail('corrupt');
  const start = o + 30 + u16(bytes, o + 26) + u16(bytes, o + 28);
  if (start + e.compSize > n) fail('corrupt');
  const data = bytes.subarray(start, start + e.compSize);
  let out;
  if (e.method === 0) out = data;
  else if (e.method === 8) out = await inflateRaw(data);
  else fail('unsupported');
  if (out.length !== e.size) fail('corrupt');
  cache.set(e.name, out);
  return out;
 }
 return {
  names: [...entries.values()].map(e => e.name),
  has: name => entries.has(String(name).replace(/^\/+/, '').toLowerCase()),
  bytes: read,
  async text(name) {
   const b = await read(name);
   if (!b) return null;
   // UTF-16 z BOM zdarza się rzadko w częściach XML
   if (b[0] === 0xff && b[1] === 0xfe) return new TextDecoder('utf-16le').decode(b.subarray(2));
   if (b[0] === 0xfe && b[1] === 0xff) return new TextDecoder('utf-16be').decode(b.subarray(2));
   return decoder.decode(b).replace(/^﻿/, '');
  },
 };
}
