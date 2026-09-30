// Logika symulatora „hexLab” (lekcja 13: system szesnastkowy). Czysty JS — działa w przeglądarce i w Node.

export const HEX_DIGITS = '0123456789ABCDEF';

/** Usuwa przedrostki 0x, #, przyrostek h, spacje i dwukropki; zamienia na wielkie litery. */
export function normHex(s) {
  return String(s ?? '').trim().toUpperCase().replace(/^0X/, '').replace(/^#/, '').replace(/H$/, '').replace(/[\s:_.-]/g, '');
}
export const isHex = s => { const n = normHex(s); return n.length > 0 && /^[0-9A-F]+$/.test(n); };
export const hexToDec = s => (isHex(s) ? parseInt(normHex(s), 16) : NaN);
export const decToHex = (n, width = 0) => Math.trunc(n).toString(16).toUpperCase().padStart(width, '0');
export const decToBin = (n, width = 8) => Math.trunc(n).toString(2).padStart(width, '0');
export const binToDec = s => { const b = String(s ?? '').replace(/\s/g, ''); return /^[01]+$/.test(b) ? parseInt(b, 2) : NaN; };
/** bits[0] = najstarszy bit (waga 128). */
export const bitsToByte = bits => bits.reduce((v, b) => v * 2 + (b ? 1 : 0), 0);
export const byteToBits = n => Array.from({length: 8}, (_, i) => ((n >> (7 - i)) & 1));
export const nibbles = n => [(n >> 4) & 15, n & 15];
export const groupBin = n => { const b = decToBin(n, 8); return `${b.slice(0, 4)} ${b.slice(4)}`; };
/** Tabela 0–F: dziesiętnie, dwójkowo (4 bity), szesnastkowo. */
export const hexTable = Array.from({length: 16}, (_, i) => ({dec: i, bin: decToBin(i, 4), hex: HEX_DIGITS[i]}));

export function parseDec(s) { const t = String(s ?? '').trim(); return /^\d{1,6}$/.test(t) ? Number(t) : NaN; }

/** Kolor #RGB lub #RRGGBB → {r,g,b}. #FB0 = #FFBB00. */
export function parseColor(s) {
  const n = normHex(s);
  if (!/^[0-9A-F]+$/.test(n)) return null;
  const full = n.length === 3 ? n.split('').map(c => c + c).join('') : n;
  if (full.length !== 6) return null;
  return {r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16)};
}
export const colorToHex = ({r, g, b}) => `#${decToHex(r, 2)}${decToHex(g, 2)}${decToHex(b, 2)}`;
export const colorDistance = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
/** Jasność względna (0–255) — do pytania o najciemniejszy kolor. */
export const luminance = ({r, g, b}) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Punkty kłódki: 3 za 1. próbę, 2 za 2.–3., 1 później. `attempt` = numer udanej próby (od 1). */
export const lockPoints = attempt => (attempt <= 1 ? 3 : attempt <= 3 ? 2 : 1);
/** Punkty zadania w konwerterze: 1 za pierwszą próbę, 0,5 po poprawce. */
export const taskPoints = attempt => (attempt <= 1 ? 1 : 0.5);
const hintFor = (hints, attempt) => hints[Math.min(Math.max(attempt, 1), hints.length) - 1];

export function formatTime(ms) {
  const s = Math.max(0, Math.floor((ms || 0) / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* ───────────── Etap 2: konwerter „nibble” ───────────── */
export const nibbleTasks = [
  {id: 'set', kind: 'bits', prompt: 'Ustaw przełącznikami liczbę 0xA7.', target: 0xA7,
    hints: ['Każda cyfra hex to osobna czwórka bitów. Zacznij od lewej: A = 10.', '10 = 8 + 2, więc lewa czwórka to 1010. Prawa: 7 = 4 + 2 + 1.', 'Ustaw: 1010 0111. Lewa czwórka → A, prawa → 7.']},
  {id: 'read', kind: 'hex', prompt: 'Odczytaj 0011 1100₂ jako liczbę szesnastkową.', answer: '3C',
    hints: ['Czytaj każdą czwórkę osobno: 0011 i 1100.', '0011 = 2 + 1 = 3. 1100 = 8 + 4 = 12, a 12 w hex to…', '12 = C (A=10, B=11, C=12). Wynik: 3C.']},
  {id: 'ff', kind: 'hex', prompt: 'Zamień 255₁₀ na zapis szesnastkowy.', answer: 'FF',
    hints: ['Podziel 255 przez 16: ile pełnych szesnastek i ile reszty?', '255 = 15 · 16 + 15. Jaka cyfra hex oznacza 15?', '15 = F, więc 255 = FF (i to jest 1111 1111₂ — pełny bajt).']},
  {id: 'dec', kind: 'dec', prompt: 'Zamień 0x2F na zapis dziesiętny.', answer: 47,
    hints: ['Pierwsza cyfra (od lewej) ma wagę 16, druga — wagę 1.', '2 · 16 + F · 1, a F = 15.', '2 · 16 = 32, 32 + 15 = 47.']},
];

export function checkNibbleTask(task, input, attempt = 1) {
  const hint = hintFor(task.hints, attempt);
  if (task.kind === 'bits') {
    const v = Number(input);
    if (v === task.target) return {ok: true, message: `Tak! ${groupBin(v)}₂ = 0x${decToHex(v, 2)} = ${v}₁₀.`};
    const [h, l] = nibbles(v), [th, tl] = nibbles(task.target);
    const parts = [];
    if (h !== th) parts.push(`lewa czwórka daje ${HEX_DIGITS[h]}, a ma być ${HEX_DIGITS[th]}`);
    if (l !== tl) parts.push(`prawa czwórka daje ${HEX_DIGITS[l]}, a ma być ${HEX_DIGITS[tl]}`);
    return {ok: false, message: `Jeszcze nie: ${parts.join('; ')}. ${hint}`};
  }
  if (task.kind === 'hex') {
    if (!isHex(input)) return {ok: false, message: `W zapisie szesnastkowym używasz cyfr 0–9 i liter A–F. ${hint}`};
    const n = normHex(input);
    if (n === task.answer) return {ok: true, message: `Dobrze: ${task.answer}.`};
    const target = parseInt(task.answer, 16);
    if (n === String(target)) return {ok: false, message: `${n} to wartość dziesiętna. Potrzebny jest zapis szesnastkowy. ${hint}`};
    return {ok: false, message: `${n} to nie to. ${hint}`};
  }
  const d = parseDec(input);
  if (Number.isNaN(d)) return {ok: false, message: `Wpisz liczbę dziesiętną (same cyfry 0–9). ${hint}`};
  if (d === task.answer) return {ok: true, message: `Dobrze: 0x2F = 2 · 16 + 15 = 47.`};
  if (d === 35) return {ok: false, message: `Liczysz, jakby pierwsza cyfra miała wagę 10. W hex waga to 16. ${hint}`};
  return {ok: false, message: `${d} to nie to. ${hint}`};
}

/* ───────────── Etap 3: escape room ───────────── */
export const powerFields = [
  {id: 'a', label: '192₁₀', from: 'dec', answer: 'C0', hints: ['192 : 16 = 12 reszty 0.', '12 = C, reszta 0 → dwie cyfry: C0. Bajt zawsze zapisujesz dwiema cyframi.']},
  {id: 'b', label: '1111 1111₂', from: 'bin', answer: 'FF', hints: ['Czytaj czwórkami: 1111 i 1111.', '1111 = 8 + 4 + 2 + 1 = 15 = F.']},
  {id: 'c', label: '238₁₀', from: 'dec', answer: 'EE', hints: ['238 : 16 = 14 reszty 14.', '14 = E. Wynik: EE.']},
];
export const powerCode = powerFields.map(f => f.answer).join('');

export function checkPower(inputs = {}, attempt = 1) {
  const fields = {};
  for (const f of powerFields) {
    const raw = inputs[f.id] ?? '';
    const hint = hintFor(f.hints, attempt);
    if (!isHex(raw)) { fields[f.id] = {ok: false, message: `Wpisz cyfry hex (0–9, A–F). ${hint}`}; continue; }
    const n = normHex(raw);
    if (n === f.answer) fields[f.id] = {ok: true, message: 'OK'};
    else if (f.answer.endsWith('0') && n === f.answer[0]) fields[f.id] = {ok: false, message: `Brakuje zera: bajt ma dwie cyfry hex. ${hint}`};
    else if (n === String(parseInt(f.answer, 16))) fields[f.id] = {ok: false, message: `To zapis dziesiętny, a panel chce hex. ${hint}`};
    else fields[f.id] = {ok: false, message: `${n} się nie zgadza. ${hint}`};
  }
  const ok = powerFields.every(f => fields[f.id].ok);
  return {ok, fields, message: ok ? `Kod ${powerCode} przyjęty. 0xC0FFEE — admin bez kawy nie działa.` : `Poprawne pola: ${powerFields.filter(f => fields[f.id].ok).length}/3. Popraw zaznaczone.`};
}

export const colorLock = {
  target: {r: 255, g: 136, b: 0}, tolerance: 16,
  darkest: {options: ['#FB0', '#222', '#0F0', '#CCC'], correct: 1},
};
const channelNames = {r: 'czerwony (R)', g: 'zielony (G)', b: 'niebieski (B)'};
export function checkColor({r, g, b, darkest} = {}, attempt = 1) {
  const t = colorLock.target, tol = colorLock.tolerance, problems = [];
  const vals = {r, g, b};
  for (const k of ['r', 'g', 'b']) {
    const raw = vals[k] ?? '';
    if (!isHex(raw) || normHex(raw).length > 2) { problems.push(`${channelNames[k]}: wpisz 1–2 cyfry hex`); continue; }
    const v = hexToDec(raw), diff = v - t[k];
    if (Math.abs(diff) > tol) problems.push(`${channelNames[k]}: ${diff > 0 ? 'za dużo' : 'za mało'}${attempt >= 2 ? ` (czujnik podaje ${t[k]}₁₀)` : ''}`);
  }
  const darkOk = Number(darkest) === colorLock.darkest.correct;
  if (darkest === undefined || darkest === null || darkest === '') problems.push('wybierz najciemniejszy kod');
  else if (!darkOk) problems.push(attempt >= 2 ? 'najciemniejszy kod: rozwiń skróty (#FB0 = #FFBB00) i szukaj najmniejszych wartości' : 'najciemniejszy kod: to nie ten — ciemny = małe liczby we wszystkich kanałach');
  const ok = problems.length === 0;
  const hint = attempt >= 3 ? ' Podpowiedź: 255 = FF, 136 = 8 · 16 + 8 = 88, 0 = 00.' : attempt >= 2 ? ' Zamień każdą liczbę z czujnika osobno: podziel przez 16, iloraz i reszta to dwie cyfry hex.' : '';
  return {ok, message: ok ? 'Kolor alarmu ustawiony (#FF8800). Najciemniejszy był #222 = #222222. Zauważ: #FB0 to skrót #FFBB00.' : `Do poprawy: ${problems.join('; ')}.${hint}`};
}

export const macLock = {
  sticker: {device: 'Drukarka w pokoju nauczycielskim', mac: '00:1B:44:A0:33:9C'},
  ouis: [
    {oui: '3C:5A:B4', maker: 'ZielonyPC', what: 'komputery'},
    {oui: '00:1B:44', maker: 'DrukTech', what: 'drukarki'},
    {oui: 'F0:9F:C2', maker: 'AirNode', what: 'punkty dostępowe Wi-Fi'},
  ],
  maker: 1,
  bits: {options: ['6', '12', '24', '48'], correct: 3},
};
export const ouiOf = mac => mac.split(':').slice(0, 3).join(':');
export function checkMac({maker, bits} = {}, attempt = 1) {
  const problems = [];
  if (maker === undefined || maker === null || maker === '') problems.push('wybierz producenta');
  else if (Number(maker) !== macLock.maker) problems.push(attempt >= 2
    ? `producent: pierwsze 3 pary z naklejki to ${ouiOf(macLock.sticker.mac)} — znajdź dokładnie ten zapis w kolumnie OUI`
    : 'producent się nie zgadza — porównaj PIERWSZE 3 pary cyfr z naklejki z kolumną OUI');
  if (bits === undefined || bits === null || bits === '') problems.push('odpowiedz, ile bitów ma adres MAC');
  else if (Number(bits) !== macLock.bits.correct) problems.push(attempt >= 2 ? 'bity: par jest 6, a każda para to 8 bitów, więc 6 · 8 = ?' : 'liczba bitów się nie zgadza — policz pary cyfr i pomnóż przez 8');
  const ok = problems.length === 0;
  return {ok, message: ok ? 'Zgadza się: 00:1B:44 to DrukTech, czyli drukarka. MAC = 6 par = 6 bajtów = 48 bitów. Administrator sieci po samym początku adresu widzi, jakiego producenta jest urządzenie — i od razu zauważa obcy sprzęt.' : `Do poprawy: ${problems.join('; ')}.`};
}

export const asciiLock = {bytes: ['57', '4F', '4C', '4E', '4F', '53', '43'], answer: 'WOLNOSC'};
export const asciiTable = [{hex: '20', ch: '␣ (spacja)'}, ...Array.from({length: 26}, (_, i) => ({hex: decToHex(0x41 + i, 2), ch: String.fromCharCode(0x41 + i)}))];
export const decodeAscii = bytes => bytes.map(h => String.fromCharCode(parseInt(h, 16))).join('');
const plain = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toUpperCase().replace(/\s+/g, ' ').trim();
export function checkAscii(text, attempt = 1) {
  const got = plain(text), want = asciiLock.answer;
  if (got === want) return {ok: true, message: `57 4F 4C 4E 4F 53 43 = ${want}. Drzwi serwerowni otwarte!`};
  if (!got) return {ok: false, message: 'Wpisz odszyfrowane hasło.'};
  let i = 0; while (i < got.length && i < want.length && got[i] === want[i]) i++;
  const hint = attempt >= 3 ? ` Bajt ${asciiLock.bytes[i] ?? ''} → znajdź go w tabeli (0x41 = A, każda kolejna litera to +1).` : attempt >= 2 ? ' Każdy bajt (para cyfr) to jedna litera. Hasło ma 7 znaków.' : '';
  if (i >= want.length) return {ok: false, message: `Pierwsze ${want.length} znaków się zgadza, ale masz coś za dużo.${hint}`};
  return {ok: false, message: `${i ? `Pierwsze ${i} ${i === 1 ? 'znak się zgadza' : i < 5 ? 'znaki się zgadzają' : 'znaków się zgadza'}, ` : ''}${i + 1}. znak jest błędny (bajt ${asciiLock.bytes[i]}).${hint}`};
}

export const escapeLocks = [
  {id: 'power', title: 'Panel zasilania'},
  {id: 'color', title: 'Kolor alarmu'},
  {id: 'mac', title: 'Naklejka z adresem MAC'},
  {id: 'ascii', title: 'Wiadomość z serwera'},
];
export const ESCAPE_MAX = 12;
export function escapeResult(state = {}) {
  const locks = state.locks || {};
  const opened = escapeLocks.filter(l => locks[l.id]?.solved).length;
  const score = escapeLocks.reduce((s, l) => s + (locks[l.id]?.solved ? lockPoints(locks[l.id].solvedAt || 1) : 0), 0);
  const time = state.startedAt ? formatTime((state.finishedAt || Date.now()) - state.startedAt) : '00:00';
  return {opened, score, max: ESCAPE_MAX, done: opened === escapeLocks.length,
    summary: opened ? `Ucieczka z serwerowni: ${opened}/4 kłódek${opened === 4 && state.finishedAt ? `, czas ${time}` : ''}` : undefined};
}
export const lockOpen = (state, i) => i === 0 || !!state?.locks?.[escapeLocks[i - 1].id]?.solved;

/* ───────────── Etap 4: gra „Trafisz kolor?” ───────────── */
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/** Deterministyczny kolor rundy: kanały z krokiem 0x11 (00, 11, 22 … FF), żeby dało się je trafić. */
export function colorRound(game, round) {
  const rnd = mulberry32(1000 * (game + 1) + round * 7919);
  const ch = () => 17 * Math.floor(rnd() * 16);
  let c = {r: ch(), g: ch(), b: ch()};
  // unikamy szarości — ma być widać, który kanał dominuje
  if (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) < 0x44) c = {...c, [['r', 'g', 'b'][round % 3]]: 255 - c[['r', 'g', 'b'][round % 3]]};
  return c;
}
export const COLOR_ROUNDS = 5;
export const roundPointsFor = dist => (dist <= 96 ? 2 : dist <= 192 ? 1 : 0);
export function colorGameResult(state = {}) {
  const games = state.games || [];
  const totals = games.map(g => (g.rounds || []).reduce((s, r) => s + (r.points || 0), 0));
  const finished = games.filter(g => (g.rounds || []).length >= COLOR_ROUNDS);
  const best = finished.length ? Math.max(...finished.map(g => g.rounds.reduce((s, r) => s + r.points, 0))) : 0;
  return {best, done: finished.length > 0, score: best, max: 10, totals, summary: finished.length ? `Najlepszy wynik w grze kolorów: ${best}/10` : undefined};
}
