// Logika symulatora securityCheck (lekcja 59, klasa 1, temat 32 „Bezpieczeństwo i ochrona danych…”).
// Czysta logika: bez Reacta i DOM, testowana w tests/sims-g1-netsec.test.mjs.
// Tryby (wspólny stateKey, wynik w value.modes[mode]):
//  password — miernik siły hasła (tylko przykładowe hasła i fraza wymyślona na lekcję; wpisanego tekstu NIE zapisujemy),
//             jak sprawdzić wyciek hasła bez ujawniania go (k-anonimowość: 5 znaków skrótu SHA-1);
//  audit    — audyt fikcyjnego telefonu, kont, laptopa i routera nastolatka: każda poprawka zmienia poziom ryzyka;
//  plan     — „5 rzeczy, które dziś włączę/sprawdzę” — samoocena, bez punktów.

export const MAX = {password: 3, audit: 12, plan: 0};

// ---------- Miernik siły hasła ----------
// Model celowo ostrożny (raczej zaniża niż zawyża siłę): atak po wycieku bazy haseł, 10 mld prób na sekundę,
// atakujący zna listy popularnych haseł, słowniki, wzory z klawiatury, lata i zamiany liter na znaki (@ za a).
export const RATE = 1e10;
export const ASSUMPTIONS = [
 'Atak po wycieku bazy haseł: komputer z mocnymi kartami graficznymi, 10 mld prób na sekundę, serwis słabo zabezpieczył hasła.',
 'Atakujący zaczyna od list popularnych haseł, słowników (także polskich słów i imion), wzorów z klawiatury, lat i zamian typu @ za a.',
 'Czas to sprawdzenie wszystkich możliwości — wynik to rząd wielkości, nie stoper. Hasło, które wyciekło, pada od razu niezależnie od długości.'
];
// Przykładowa lista popularnych haseł (na potrzeby symulacji, bez kolejności rankingu).
export const COMMON = ['123456', 'admin', '12345678', '123456789', '12345', '1234567890', 'qwerty', 'qwerty123', 'qwertyuiop', 'zaq12wsx', 'zaq1@wsx', '1qaz2wsx', 'qweqwe123', 'kocham12', 'kocham', 'polska', 'polska1', 'haslo', 'haslo123', 'password', 'password1', '111111', '000000', '123123', 'abc123', 'iloveyou', 'misiek', 'misiek1', 'marcin1', 'zaq1zaq1', 'monika', 'agnieszka', 'mateusz1', 'lol123', 'qazwsx', 'asdfgh', 'samsung', 'minecraft', 'pokemon', 'legia'];
// Mały słownik bardzo popularnych słów i imion (atakujący ma dużo większy — patrz BIG_DICT).
export const DICT = ['kocham', 'haslo', 'polska', 'legia', 'lech', 'kasia', 'ola', 'ala', 'kuba', 'mama', 'tata', 'pies', 'kot', 'kotek', 'misiek', 'rower', 'kubek', 'chmura', 'sanki', 'lato', 'zima', 'wiosna', 'jesien', 'pizza', 'ananas', 'szkola', 'minecraft', 'fortnite', 'roblox', 'pilka', 'gol', 'mecz', 'dragon', 'smok', 'monkey', 'love', 'admin', 'password', 'qwerty', 'slonce', 'dom', 'auto', 'gra', 'gracz', 'mistrz', 'krol', 'krolowa', 'motyl', 'kwiat', 'morze', 'gory', 'las', 'niebo', 'telefon', 'komputer', 'internet', 'wakacje', 'kolega', 'super', 'master', 'gamer', 'anna', 'maria', 'julia', 'zuzia', 'zuzanna', 'wiktoria', 'maja', 'lena', 'jan', 'kacper', 'szymon', 'jakub', 'filip', 'antoni', 'bartek', 'marcin', 'tomek', 'adam', 'piotr', 'michal', 'oliwia', 'natalia', 'monika', 'agnieszka', 'mateusz', 'kamil', 'dawid', 'patryk', 'karolina', 'samsung', 'iphone', 'pokemon', 'barcelona', 'real', 'madrid', 'messi', 'ronaldo', 'lewandowski'];
export const DICT_GUESSES = 1e4;  // słowo z listy bardzo popularnych
export const BIG_DICT = 2e5;      // dowolne słowo z dużego słownika (pułap ostrożności dla ciągu liter)
const KEYBOARD = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', '0987654321', 'abcdefghijklmnopqrstuvwxyz', 'zaq1xsw2cde3vfr4', '1qaz2wsx3edc4rfv', 'zaq12wsx', 'zaq1@wsx', 'qazwsxedc', 'qweqwe', 'asdasd'];
const POLISH = 'ąćęłńóśźż';
const deaccent = s => s.replace(/[ąćęłńóśźż]/g, c => 'acelnoszz'['ąćęłńóśźż'.indexOf(c)]);
const LEET = {'@': 'a', '4': 'a', '0': 'o', '3': 'e', '$': 's', '5': 's', '7': 't', '!': 'i'};
const deleet = (s, one) => s.split('').map(c => c === '1' ? one : (LEET[c] || c)).join('');
const classOf = c => /[a-ząćęłńóśźż]/.test(c) ? 'lower' : /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(c) ? 'upper' : /[0-9]/.test(c) ? 'digit' : 'symbol';
function charset(str) {
 const cls = new Set([...str].map(classOf));
 let n = 0;
 if (cls.has('lower')) n += 26 + ([...str].some(c => POLISH.includes(c)) ? 9 : 0);
 if (cls.has('upper')) n += 26 + ([...str].some(c => POLISH.toUpperCase().includes(c)) ? 9 : 0);
 if (cls.has('digit')) n += 10;
 if (cls.has('symbol')) n += 33;
 return n;
}
function caseFactor(str) {
 const letters = [...str].filter(c => /\p{L}/u.test(c));
 const up = letters.filter(c => c !== c.toLowerCase()).length;
 if (up === 0) return 1;
 if (up === letters.length || (up === 1 && letters[0] !== letters[0].toLowerCase())) return 2;
 return 2 ** Math.min(up, 20);
}
// Najtańsza dla atakującego interpretacja fragmentu [i, j) jako wzorca (słowo, klawiatura, rok…), bez brute force.
const looksLikeWord = w => w.length <= 12 && /[aeiouyąęó]/i.test(w) && !/[^aeiouyąęó]{5}/i.test(w);
function pattern(pw, i, j) {
 const raw = pw.slice(i, j), low = raw.toLowerCase(), len = j - i;
 let best = Infinity, why = null;
 const take = (g, w) => { if (g < best) { best = g; why = w; } };
 if (len >= 3) {
  const plain = deaccent(low);
  for (const one of ['i', 'l']) {
   const d = deleet(plain, one);
   if (DICT.includes(d)) take(DICT_GUESSES * caseFactor(raw) * (d !== plain ? 4 : 1), {type: 'word', text: raw, word: d, leet: d !== plain});
  }
  if (/^\p{L}+$/u.test(raw) && looksLikeWord(raw)) take(Math.min(26 ** len, BIG_DICT) * caseFactor(raw), {type: 'bigword', text: raw});
 }
 if (len >= 4 && KEYBOARD.some(k => k.includes(low))) take(1e3 * (raw === low ? 1 : 2), {type: 'keyboard', text: raw});
 if (len === 4 && /^(19[5-9]\d|20[0-3]\d)$/.test(raw)) take(100, {type: 'year', text: raw});
 if (len >= 3 && /^(.)\1+$/.test(raw)) take(100, {type: 'repeat', text: raw});
 if (len === 1 && /[-_. ]/.test(raw)) take(4, {type: 'sep', text: raw});
 return why ? {guesses: best, info: why} : null;
}
// Brute force: cały ciąg znaków bez wzorca — zbiór znaków to suma klas występujących w ciągu.
const brute = (pw, i, j) => charset(pw.slice(i, j)) ** (j - i);
export function analyzePassword(input) {
 const pw = String(input ?? '');
 const n = pw.length;
 if (!n) return {length: 0, guesses: 0, seconds: 0, level: 0, label: 'Wpisz hasło', time: '—', findings: []};
 const norm = deaccent(pw.toLowerCase());
 const findings = [];
 let guesses;
 const commonIdx = [norm, deleet(norm, 'i'), deleet(norm, 'l')].map(x => COMMON.indexOf(x)).find(i => i >= 0);
 if (commonIdx !== undefined) {
  guesses = commonIdx + 1;
  findings.push({type: 'common', text: 'Jest na liście najpopularniejszych haseł — atakujący sprawdza je jako pierwsze.'});
 } else {
  // best[j][b]: najmniej prób dla pw[0..j), b = 1 gdy ostatni fragment to brute force (dwa brute force nie mogą stać obok siebie).
  const best = Array.from({length: n + 1}, () => [Infinity, Infinity]), from = Array.from({length: n + 1}, () => [null, null]);
  best[0][0] = 1;
  for (let j = 1; j <= n; j++) for (let i = Math.max(0, j - 40); i < j; i++) {
   const prev = Math.min(best[i][0], best[i][1]);
   if (prev < Infinity) {
    const m = pattern(pw, i, j);
    if (m && prev * m.guesses < best[j][0]) { best[j][0] = prev * m.guesses; from[j][0] = {i, b: best[i][0] <= best[i][1] ? 0 : 1, info: m.info}; }
   }
   if (best[i][0] < Infinity) {
    const g = best[i][0] * brute(pw, i, j);
    if (g < best[j][1]) { best[j][1] = g; from[j][1] = {i, b: 0, info: null}; }
   }
  }
  let b = best[n][0] <= best[n][1] ? 0 : 1;
  guesses = best[n][b];
  for (let j = n; j > 0;) { const f = from[j][b]; if (f.info) findings.unshift(f.info); j = f.i; b = f.b; }
  for (let j = n; j > 0; j = from[j].i) if (from[j].info) findings.unshift(from[j].info);
 }
 const seconds = guesses / RATE;
 const level = seconds < 1 ? 0 : seconds < 3600 ? 1 : seconds < 365 * 86400 ? 2 : seconds < 1000 * 365 * 86400 ? 3 : 4;
 const notes = [];
 for (const f of findings) {
  if (f.type === 'common') notes.push(f.text);
  if (f.type === 'word') notes.push(`Popularne słowo lub imię: „${f.text}”${f.leet ? ' — zamiana liter na cyfry/znaki nic nie daje, atakujący sprawdza ją automatycznie' : ''}.`);
  if (f.type === 'keyboard') notes.push(`Wzór z klawiatury: „${f.text}” — jest w każdym słowniku do łamania haseł.`);
  if (f.type === 'year') notes.push(`Rok: „${f.text}” — atakujący dopisuje lata 1950–2039 do słów.`);
  if (f.type === 'repeat') notes.push(`Powtórzony znak: „${f.text}”.`);
 }
 if (n < 12) notes.push(`Tylko ${n} ${znaki(n)}. Każdy dodatkowy znak mnoży czas łamania — długość działa mocniej niż znaki specjalne.`);
 return {length: n, guesses, seconds, level, label: LEVELS[level], time: humanTime(seconds), findings: notes};
}
export const LEVELS = ['bardzo słabe', 'słabe', 'średnie', 'mocne', 'bardzo mocne'];
const round2 = x => x >= 100 ? Math.round(x / 10 ** (Math.floor(Math.log10(x)) - 1)) * 10 ** (Math.floor(Math.log10(x)) - 1) : Math.round(x);
export const znaki = n => n === 1 ? 'znak' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'znaki' : 'znaków';
const nf = x => String(round2(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export function humanTime(s) {
 const Y = 365 * 86400;
 if (s < 1) return 'natychmiast (poniżej sekundy)';
 if (s < 60) return `ok. ${nf(s)} s`;
 if (s < 3600) return `ok. ${nf(s / 60)} min`;
 if (s < 86400) return `ok. ${nf(s / 3600)} godz.`;
 if (s < 60 * 86400) return `ok. ${nf(s / 86400)} dni`;
 if (s < Y) return `ok. ${nf(s / (30 * 86400))} mies.`;
 if (s < 1e6 * Y) return `ok. ${nf(s / Y)} lat`;
 return 'ponad milion lat';
}

// Zadanie 1: które hasło jest najmocniejsze?
export const samples = ['Kocham12', 'P@ssw0rd!', 'zaq1@WSX', 'Xk9#mP2q', 'rower-kubek-chmura-sanki'];
export const STRONGEST = 4;
// Zadanie 2: własna fraza na lekcję — cel: co najmniej „mocne” i min. 16 znaków.
export const PHRASE_MIN_LEN = 16, PHRASE_MIN_LEVEL = 3;
export function checkPhrase(input) {
 const pw = String(input ?? '');
 const a = analyzePassword(pw);
 if (samples.includes(pw)) return {ok: false, a, text: 'To hasło z przykładów. Wymyśl własną frazę — tylko na tę lekcję.'};
 if (a.length < PHRASE_MIN_LEN) return {ok: false, a, text: `Za krótko: ${a.length} ${znaki(a.length)}, cel to min. ${PHRASE_MIN_LEN}. Dopisz jeszcze jedno słowo.`};
 if (a.level < PHRASE_MIN_LEVEL) return {ok: false, a, text: `Długie, ale przewidywalne (${a.label}). Unikaj popularnych słów, imion, lat i wzorów z klawiatury — weź 4 słowa, które do siebie nie pasują.`};
 return {ok: true, a, text: `Cel osiągnięty: ${a.length} ${znaki(a.length)}, ${a.label}, w modelu ${a.time}. Nie używaj tej frazy nigdzie — to był trening.`};
}
export const kanonQuiz = {id: 'kanon', question: 'Sprawdzasz w serwisie z wyciekami, czy hasło „Kocham12” wyciekło. Co dostaje serwis od Twojego komputera?',
 options: ['Całe hasło, ale szyfrowanym połączeniem', 'Cały skrót SHA-1 hasła', 'Tylko 5 pierwszych znaków skrótu — pasują do setek różnych haseł', 'Login i hasło do konta'],
 correct: 2,
 explain: 'Komputer liczy skrót hasła i wysyła tylko jego początek. Serwis odsyła setki pasujących końcówek, a porównanie robi Twój komputer. Serwis nie wie, które hasło sprawdzałeś. Tak działa sprawdzanie haseł np. w Have I Been Pwned (k-anonimowość).',
 hint: 'Spójrz na krok 2 — co dokładnie wychodzi z komputera?'};

// SHA-1 (do demonstracji kroku 1 — liczone lokalnie, nic nie jest wysyłane).
export function sha1(str) {
 const bytes = new TextEncoder().encode(String(str));
 const l = bytes.length, words = [];
 for (let i = 0; i < l; i++) words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
 words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
 const nWords = (((l + 8) >> 6) + 1) * 16;
 for (let i = 0; i < nWords; i++) words[i] = words[i] | 0;
 words[nWords - 1] = l * 8;
 let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
 const w = new Array(80);
 const rol = (x, n) => (x << n) | (x >>> (32 - n));
 for (let b = 0; b < nWords; b += 16) {
  for (let t = 0; t < 80; t++) w[t] = t < 16 ? words[b + t] : rol(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
  let a = h0, bb = h1, c = h2, d = h3, e = h4;
  for (let t = 0; t < 80; t++) {
   const f = t < 20 ? (bb & c) | (~bb & d) : t < 40 ? bb ^ c ^ d : t < 60 ? (bb & c) | (bb & d) | (c & d) : bb ^ c ^ d;
   const k = t < 20 ? 0x5A827999 : t < 40 ? 0x6ED9EBA1 : t < 60 ? 0x8F1BBCDC : 0xCA62C1D6;
   const tmp = (rol(a, 5) + f + e + k + w[t]) | 0;
   e = d; d = c; c = rol(bb, 30); bb = a; a = tmp;
  }
  h0 = (h0 + a) | 0; h1 = (h1 + bb) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
 }
 return [h0, h1, h2, h3, h4].map(x => (x >>> 0).toString(16).padStart(8, '0')).join('').toUpperCase();
}
// Symulowana odpowiedź serwisu: kilka z setek końcówek o tym samym początku (deterministyczne, przykładowe).
export function kanonDemo(password) {
 const hash = sha1(password), prefix = hash.slice(0, 5), suffix = hash.slice(5);
 const fake = [];
 let seed = sha1(prefix + 'x');
 for (let i = 0; i < 5; i++) { seed = sha1(seed); fake.push(seed.slice(0, 35)); }
 const list = [...fake.slice(0, 3), suffix, ...fake.slice(3)];
 return {hash, prefix, suffix, list, matchIndex: 3};
}
export function passwordResult(st = {}) {
 const strongest = st.strongest?.solved ? (st.strongest.tries === 1 ? 1 : 0.5) : 0;
 const phrase = st.phrase?.ok ? (st.phrase.tries === 1 ? 1 : 0.5) : 0;
 const kanon = st.kanon?.solved ? (st.kanon.tries === 1 ? 1 : 0.5) : 0;
 const done = !!(st.strongest?.solved && st.phrase?.ok && st.kanon?.solved);
 return {done, score: strongest + phrase + kanon, max: MAX.password,
  summary: st.phrase?.ok ? `Fraza treningowa: ${st.phrase.length} ${znaki(st.phrase.length)}, w modelu ${st.phrase.time} (fraza nie została zapisana)` : undefined};
}
export function answerQuiz(state = {}, option, correct) {
 if (state.solved) return state;
 const tries = (state.tries || 0) + 1;
 return {tries, picked: option, solved: option === correct};
}

// ---------- Audyt ----------
// verdict: best (naprawione), ok (naprawione, drobna uwaga), weak (lepiej, ale luka zostaje), bad (stan wyjściowy), trap (pułapka).
export const devices = [
 {id: 'phone', name: 'Telefon Kuby', icon: 'phone', note: 'Android, 16 lat, 4 200 zdjęć'},
 {id: 'accounts', name: 'Konta Kuby', icon: 'idcard', note: 'mail, gra, Instagram, TikTok'},
 {id: 'laptop', name: 'Laptop Kuby', icon: 'laptop', note: 'Windows 11, jeździ w plecaku'},
 {id: 'router', name: 'Router w domu', icon: 'wifi', note: 'od operatora, 2019 r.'}
];
export const rows = [
 {id: 'lock', device: 'phone', label: 'Blokada ekranu', options: [
  {id: 'none', text: 'Brak — przesunięcie palcem', verdict: 'bad', risk: 12, fb: 'Bez blokady każdy, kto weźmie telefon, ma Twoje czaty, zdjęcia i zalogowane konta.'},
  {id: 'pattern', text: 'Wzór: litera L', verdict: 'weak', risk: 7, fb: 'Lepiej niż nic, ale wzór L odgadnie każdy, kto zerknął Ci przez ramię albo widzi smugę na ekranie.'},
  {id: 'pin', text: 'PIN z 6 cyfr + odcisk palca albo twarz', verdict: 'best', risk: 0, fb: 'Dobrze. Blokada ekranu włącza też pełną ochronę szyfrowania danych w telefonie: złodziej nie odczyta zdjęć ani czatów.'}]},
 {id: 'osupdate', device: 'phone', label: 'Aktualizacje systemu', options: [
  {id: 'paused', text: 'Wstrzymane — ostatnia 14 miesięcy temu', verdict: 'bad', risk: 9, fb: 'Stary system ma dziury, które przestępcy już znają — opisy są publiczne, a narzędzia gotowe.'},
  {id: 'skip', text: 'Zostaw — telefon działa, a aktualizacja zabiera miejsce', verdict: 'trap', risk: 9, fb: 'Pułapka. „Działa” nie znaczy „bezpieczny”. Aktualizacja łata dziury, zanim ktoś ich użyje.'},
  {id: 'auto', text: 'Zainstaluj teraz i włącz automatyczne aktualizacje przez Wi-Fi', verdict: 'best', risk: 0, fb: 'Dobrze. Aktualizacje zamykają dziury, zanim ktoś ich użyje. Automatyczne — bo nikt nie pamięta.'}]},
 {id: 'apk', device: 'phone', label: 'Aplikacja „Darmowe Skiny PRO” (plik APK spoza sklepu). Uprawnienia: SMS, ułatwienia dostępu, wyświetlanie nad innymi aplikacjami', options: [
  {id: 'keep', text: 'Zostaw — skiny jeszcze nie przyszły', verdict: 'bad', risk: 12, fb: 'Takie uprawnienia pozwalają czytać kody z SMS-ów i klikać za Ciebie. Skinów nie będzie.'},
  {id: 'mute', text: 'Zostaw, tylko wyłącz jej powiadomienia', verdict: 'trap', risk: 12, fb: 'Pułapka. Powiadomienia to nie problem. Aplikacja dalej czyta SMS-y z kodami i może klikać za Ciebie.'},
  {id: 'remove', text: 'Odinstaluj ją i zmień hasła do kont, na które logowałeś się w tym czasie', verdict: 'best', risk: 0, fb: 'Dobrze. „Darmowe skiny” to klasyczna przynęta na malware. Zmiana haseł zamyka drzwi, jeśli coś już wyciekło.'}]},
 {id: 'sources', device: 'phone', label: 'Instalowanie aplikacji z nieznanych źródeł', options: [
  {id: 'on', text: 'Dozwolone dla przeglądarki i komunikatora', verdict: 'bad', risk: 5, fb: 'Każdy link z czatu może zainstalować aplikację spoza sklepu.'},
  {id: 'chat', text: 'Dozwolone tylko dla komunikatora — pliki od znajomych są OK', verdict: 'trap', risk: 5, fb: 'Pułapka. Przejęte konto znajomego wysyła właśnie takie pliki — „zobacz, to Ty na filmiku?”.'},
  {id: 'off', text: 'Wyłączone — aplikacje tylko z oficjalnego sklepu', verdict: 'best', risk: 0, fb: 'Dobrze. Oficjalny sklep też nie jest idealny, ale sprawdza aplikacje i szybciej je usuwa.'}]},
 {id: 'backup', device: 'phone', label: 'Kopia zdjęć', options: [
  {id: 'off', text: 'Wyłączona — zdjęcia są tylko w telefonie', verdict: 'bad', risk: 8, fb: 'Zgubiony, zalany albo zablokowany telefon = 4 200 zdjęć znika na zawsze.'},
  {id: 'yearly', text: 'Raz w roku zgram część zdjęć na pendrive', verdict: 'weak', risk: 5, fb: 'Lepiej niż nic, ale zdjęcia z ostatnich miesięcy przepadną. Kopia ma się robić sama.'},
  {id: 'auto', text: 'Automatyczna kopia w chmurze przez Wi-Fi (konto z logowaniem dwuetapowym)', verdict: 'best', risk: 0, fb: 'Dobrze. Kopia robi się sama. Ważne zdjęcia możesz mieć dodatkowo na komputerze — wtedy są w dwóch miejscach.'}]},
 {id: 'reuse', device: 'accounts', label: 'Hasła do maila, gry i Instagrama', options: [
  {id: 'same', text: 'To samo wszędzie: Kuba2009!', verdict: 'bad', risk: 11, fb: 'Wyciek z jednego serwisu (np. forum gry) otwiera wszystkie konta — atakujący próbują tej samej pary e-mail + hasło wszędzie.'},
  {id: 'suffix', text: 'To samo, tylko z nazwą serwisu na końcu: Kuba2009!insta', verdict: 'trap', risk: 10, fb: 'Pułapka. Po pierwszym wycieku wzór jest widoczny i resztę haseł łatwo zgadnąć.'},
  {id: 'note', text: 'Różne, zapisane w notatce „hasla” w telefonie', verdict: 'weak', risk: 6, fb: 'Różne hasła — dobrze. Ale zwykła notatka nie jest zaszyfrowana, a złośliwa aplikacja albo ktoś z telefonem w ręku przeczyta ją w sekundę.'},
  {id: 'manager', text: 'Różne, długie hasła w menedżerze haseł; pamiętam tylko jedno mocne hasło główne', verdict: 'best', risk: 0, fb: 'Dobrze. Menedżer haseł generuje i pamięta różne hasła. Wybierz wbudowany w system lub przeglądarkę albo znany, z oficjalnego sklepu — nigdy z reklamy.'}]},
 {id: 'mfa', device: 'accounts', label: 'Logowanie dwuetapowe na mailu', options: [
  {id: 'off', text: 'Wyłączone', verdict: 'bad', risk: 8, fb: 'Mail to klucz do resetu haseł wszystkich innych kont. Samo hasło to za mało.'},
  {id: 'on', text: 'Włączone: kod z aplikacji albo SMS', verdict: 'best', risk: 0, fb: 'Dobrze (lekcja o e-usługach). Nawet gdy hasło wycieknie, bez drugiego składnika nikt nie wejdzie.'}]},
 {id: 'crack', device: 'laptop', label: 'Gra z „crackiem” z forum; antywirus wyłączony, bo „crack nie działał”', options: [
  {id: 'keep', text: 'Zostaw — gra działa', verdict: 'bad', risk: 12, fb: 'Crack, który wymaga wyłączenia antywirusa, to idealne opakowanie na koparkę kryptowalut albo złodzieja haseł z przeglądarki.'},
  {id: 'exclude', text: 'Dodaj folder z crackiem do wyjątków i włącz antywirusa', verdict: 'trap', risk: 12, fb: 'Pułapka. Wyjątek znaczy: antywirus celowo nie patrzy tam, gdzie siedzi zagrożenie.'},
  {id: 'clean', text: 'Usuń cracka, włącz antywirusa, zrób pełne skanowanie i zmień hasła', verdict: 'best', risk: 0, fb: 'Dobrze. Zmień hasła z innego, czystego urządzenia — złodziej haseł mógł je już wysłać.'}]},
 {id: 'winupdate', device: 'laptop', label: 'Windows Update', options: [
  {id: 'paused', text: 'Wstrzymany na 5 tygodni', verdict: 'bad', risk: 6, fb: 'Wstrzymane aktualizacje to otwarte dziury przez ponad miesiąc.'},
  {id: 'disable', text: 'Wyłącz na stałe, bo restartuje komputer w trakcie gry', verdict: 'trap', risk: 8, fb: 'Pułapka. Lepiej ustawić godziny aktywne — Windows nie zrestartuje się wtedy, gdy grasz.'},
  {id: 'active', text: 'Wznów aktualizacje i ustaw godziny aktywne (bez restartów w trakcie gry)', verdict: 'best', risk: 0, fb: 'Dobrze. Aktualizacje są, a restart przyjdzie wtedy, kiedy Ci nie przeszkadza.'}]},
 {id: 'disk', device: 'laptop', label: 'Szyfrowanie dysku', options: [
  {id: 'off', text: 'Wyłączone', verdict: 'bad', risk: 6, fb: 'Skradziony laptop = wszystkie pliki do odczytu po podłączeniu dysku do innego komputera.'},
  {id: 'pass', text: 'Wystarczy hasło do Windowsa', verdict: 'weak', risk: 6, fb: 'Hasło do konta nie chroni dysku: po wyjęciu dysku pliki da się odczytać na innym komputerze.'},
  {id: 'on', text: 'Włącz szyfrowanie urządzenia (BitLocker) i zapisz klucz odzyskiwania w bezpiecznym miejscu', verdict: 'best', risk: 0, fb: 'Dobrze. Bez hasła dysk to szum. Klucz odzyskiwania przechowuj poza laptopem — bez niego możesz stracić dostęp sam.'}]},
 {id: 'wifi', device: 'router', label: 'Zabezpieczenie Wi-Fi', options: [
  {id: 'old', text: 'WPA2, hasło 12345678 od 2019 r.', verdict: 'bad', risk: 8, fb: 'Hasło z listy najpopularniejszych. Ktoś pod blokiem jest w Twojej sieci lokalnej — obok Twoich urządzeń.'},
  {id: 'open', text: 'Otwarta sieć — sąsiedzi i tak nie umieją się włamać', verdict: 'trap', risk: 12, fb: 'Pułapka. Otwarta sieć to zaproszenie dla każdego. Działania z Twojego publicznego adresu IP idą „na Ciebie”.'},
  {id: 'wep', text: 'WEP z nowym hasłem', verdict: 'trap', risk: 10, fb: 'Pułapka. WEP to przestarzałe szyfrowanie — łamie się je w kilka minut.'},
  {id: 'wpa2', text: 'WPA2 z nowym, długim hasłem (frazą)', verdict: 'ok', risk: 1, fb: 'Dobrze. Jeśli router i urządzenia obsługują WPA3 (albo tryb WPA2/WPA3) — to jeszcze lepszy wybór.'},
  {id: 'wpa3', text: 'WPA3 (albo tryb WPA2/WPA3) z nowym, długim hasłem (frazą)', verdict: 'best', risk: 0, fb: 'Dobrze. WPA3 to najnowszy standard szyfrowania Wi-Fi. Długa fraza chroni przed zgadywaniem hasła.'}]},
 {id: 'admin', device: 'router', label: 'Hasło do panelu routera', options: [
  {id: 'default', text: 'admin / admin (fabryczne)', verdict: 'bad', risk: 7, fb: 'Fabryczne hasła są w instrukcjach w internecie. Kto je zna, zmieni ustawienia całej sieci.'},
  {id: 'hide', text: 'Zostaw admin/admin, ale ukryj nazwę sieci (SSID)', verdict: 'trap', risk: 7, fb: 'Pułapka. Ukrytą sieć i tak widać w programach do skanowania, a fabryczne hasło zna każdy.'},
  {id: 'own', text: 'Zmień na własne, długie hasło (inne niż do Wi-Fi) i zaktualizuj oprogramowanie routera', verdict: 'best', risk: 0, fb: 'Dobrze. Router to brama całego domu do internetu — panel i oprogramowanie muszą być zabezpieczone.'}]}
];
// Ustawienia, które są w porządku (nie są luką) — zmiana na gorsze zwiększa ryzyko.
export const fineRows = [
 {id: 'bt', device: 'phone', label: 'Bluetooth', options: [
  {id: 'on', text: 'Włączony — słuchawki', verdict: 'fine', risk: 0, fb: 'To nie jest luka. Bluetooth z aktualnym systemem jest w porządku.'},
  {id: 'off', text: 'Wyłącz na zawsze — hakerzy!', verdict: 'fine', risk: 0, fb: 'Niepotrzebne. Bluetooth sam w sobie nie jest dziurą — ważne są aktualizacje. Słuchawki będą działać, jak wcześniej.'}]},
 {id: 'firewall', device: 'laptop', label: 'Zapora sieciowa Windows', options: [
  {id: 'on', text: 'Włączona', verdict: 'fine', risk: 0, fb: 'To jest w porządku — zapora blokuje niechciane połączenia z sieci.'},
  {id: 'off', text: 'Wyłącz, bo gra wolniej się łączy', verdict: 'trap', risk: 6, fb: 'Pułapka. Zapora nie spowalnia gry. Jeśli gra potrzebuje dostępu, Windows zapyta o zgodę dla tej jednej gry.'}]}
];
export const allRows = [...rows, ...fineRows];
const START_RISK = rows.reduce((s, r) => s + r.options[0].risk, 0);
export const startRisk = () => START_RISK;
export const optionOf = (row, sel) => row.options.find(o => o.id === sel) || row.options[0];
export function riskOf(sel = {}) {
 const sum = allRows.reduce((s, r) => s + optionOf(r, sel[r.id]).risk, 0);
 return Math.min(100, Math.round(100 * sum / START_RISK));
}
export const riskLevel = r => r <= 10 ? 'niskie' : r <= 40 ? 'średnie' : 'wysokie';
export const resolved = (row, sel) => ['best', 'ok'].includes(optionOf(row, sel).verdict);
// Każda zmiana ustawienia: pierwsza zmiana na poprawną = 1 pkt, później 0,5.
export function setOption(st = {}, rowId, optionId) {
 const row = allRows.find(r => r.id === rowId);
 if (!row || !row.options.some(o => o.id === optionId)) return st;
 const sel = {...(st.sel || {}), [rowId]: optionId};
 const changes = {...(st.changes || {})};
 const first = {...(st.first || {})};
 if (rows.includes(row)) {
  changes[rowId] = (changes[rowId] || 0) + 1;
  if (first[rowId] === undefined) first[rowId] = resolved(row, optionId);
 }
 return {...st, sel, changes, first, last: rowId};
}
export function auditResult(st = {}) {
 const sel = st.sel || {};
 const fixed = rows.filter(r => resolved(r, sel[r.id]));
 const score = fixed.reduce((s, r) => s + (st.first?.[r.id] ? 1 : 0.5), 0);
 const risk = riskOf(sel);
 const done = fixed.length === rows.length;
 return {done, score, max: MAX.audit, risk, fixed: fixed.length,
  summary: fixed.length ? `Audyt Kuby: ryzyko 100 → ${risk}/100 (${riskLevel(risk)}), naprawione ${fixed.length}/${rows.length}` : undefined};
}

// ---------- Plan „5 rzeczy na dziś” (samoocena, bez punktów) ----------
export const PLAN_SIZE = 5;
export const planItems = [
 {id: 'lock', text: 'Blokada ekranu: PIN z 6 cyfr + odcisk palca lub twarz', where: 'Telefon: Ustawienia → Zabezpieczenia (lub Face ID i kod) → Blokada ekranu'},
 {id: 'osupdate', text: 'Aktualizacje telefonu: zainstalowane i automatyczne', where: 'Telefon: Ustawienia → System → Aktualizacja oprogramowania'},
 {id: 'backup', text: 'Automatyczna kopia zdjęć', where: 'Telefon: aplikacja Zdjęcia/Galeria → Kopia zapasowa (przez Wi-Fi)'},
 {id: 'mfa', text: 'Logowanie dwuetapowe na mailu, Instagramie, TikToku', where: 'W każdej aplikacji: Ustawienia → Bezpieczeństwo → Weryfikacja dwuetapowa'},
 {id: 'manager', text: 'Menedżer haseł i różne hasła do ważnych kont', where: 'Wbudowany w telefon lub przeglądarkę: Ustawienia → Hasła'},
 {id: 'phrase', text: 'Nowe hasło-fraza do maila (najważniejsze konto)', where: 'Ustawienia konta pocztowego → Hasło'},
 {id: 'apps', text: 'Przegląd aplikacji: usunąć te spoza sklepu i z dziwnymi uprawnieniami', where: 'Telefon: Ustawienia → Aplikacje → Uprawnienia (SMS, ułatwienia dostępu)'},
 {id: 'sources', text: 'Wyłączone instalowanie z nieznanych źródeł', where: 'Android: Ustawienia → Aplikacje → Specjalny dostęp → Instalowanie nieznanych aplikacji'},
 {id: 'find', text: 'Włączone lokalizowanie zgubionego telefonu', where: 'Telefon: Ustawienia → Zabezpieczenia → Znajdź urządzenie (Znajdź mój)'},
 {id: 'wifi', text: 'Wi-Fi w domu: WPA2/WPA3 i hasło inne niż 12345678 (z osobą, która zarządza routerem)', where: 'Naklejka na routerze albo panel routera — zawsze za zgodą właściciela'},
 {id: 'winupdate', text: 'Windows Update włączony + godziny aktywne', where: 'Windows: Ustawienia → Windows Update → Opcje zaawansowane → Godziny aktywne'},
 {id: 'disk', text: 'Szyfrowanie dysku w laptopie', where: 'Windows: Ustawienia → Prywatność i zabezpieczenia → Szyfrowanie urządzenia'}
];
export function setPlan(st = {}, id, status) {
 const marks = {...(st.marks || {})};
 if (marks[id] === status || !status) delete marks[id];
 else {
  if (status === 'today' && Object.values(marks).filter(v => v === 'today').length >= PLAN_SIZE) return {...st, msg: `Masz już ${PLAN_SIZE} rzeczy na dziś. Odznacz którąś, żeby dodać inną.`};
  marks[id] = status;
 }
 return {...st, marks, msg: null};
}
export function planResult(st = {}) {
 const marks = st.marks || {};
 const today = planItems.filter(i => marks[i.id] === 'today');
 const have = planItems.filter(i => marks[i.id] === 'have');
 const need = Math.min(PLAN_SIZE, planItems.length - have.length);
 const done = today.length >= need && today.length > 0;
 return {done, score: 0, max: 0, today, have, need,
  summary: done ? `Mój plan na dziś: ${today.map(i => i.text.split(':')[0].toLowerCase()).join('; ')}` : undefined};
}

export function secResult(value = {}) {
 return {password: passwordResult(value.password), audit: auditResult(value.audit), plan: planResult(value.plan)};
}
