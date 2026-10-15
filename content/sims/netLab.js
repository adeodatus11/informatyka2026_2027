// Logika symulatora netLab (lekcja 58, klasa 1, temat 31 „Sieci komputerowe”).
// Czysta logika: bez Reacta i DOM, testowana w tests/sims-g1-netsec.test.mjs.
// Tryby (wspólny stateKey, wynik w value.modes[mode]):
//  address  — adres IP w domu: prywatny/publiczny, router jako brama (NAT), klasyfikacja adresów;
//  packets  — zdjęcie dzielone na pakiety: różne trasy, zgubiony pakiet, awaria węzła, pakiety w grze;
//  cmd      — wiersz poleceń Windows 11: ipconfig, ping, tracert — uczeń wpisuje odczyty
//             (pomiar własny: sprawdzamy sensowność formatu; tryb zastępczy: przechwycone przykłady);
//  passport — „paszport połączenia”: odczyty ucznia + wniosek (bez punktów).
// Adresy w przykładach pochodzą z pul dokumentacyjnych (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24),
// a domeny są fikcyjne — nie podszywamy się pod żaden prawdziwy serwis.

export const MODES = ['address', 'packets', 'cmd', 'passport'];
export const MAX = {address: 3, packets: 4, cmd: 4, passport: 0};

// ---------- Adresy IPv4 ----------
export function parseIPv4(input) {
 const s = String(input ?? '').trim();
 if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(s)) return null;
 const parts = s.split('.').map(Number);
 if (parts.some(n => n > 255)) return null;
 return parts;
}
// Rodzaj adresu: invalid | private | public | loopback | apipa | special
export function ipKind(input) {
 const p = parseIPv4(input);
 if (!p) return 'invalid';
 const [a, b] = p;
 if (a === 10) return 'private';
 if (a === 172 && b >= 16 && b <= 31) return 'private';
 if (a === 192 && b === 168) return 'private';
 if (a === 127) return 'loopback';
 if (a === 169 && b === 254) return 'apipa';
 if (a === 0 || a >= 224) return 'special';
 return 'public';
}
export const kindLabel = {private: 'prywatny', public: 'publiczny', invalid: 'błędny', loopback: 'adres tego komputera (localhost)', apipa: 'awaryjny (brak adresu z sieci)', special: 'specjalny'};
export const looksLikeMask = s => /^255\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(String(s ?? '').trim());
export const looksLikeIPv6 = s => String(s ?? '').includes(':');
export const IPV4_COUNT = 2 ** 32; // 4 294 967 296

// ---------- Quiz w symulatorze (pełny punkt za 1. próbę, 0,5 po poprawce) ----------
export function answerQuiz(q, state = {}, option) {
 if (state.solved) return state;
 const tries = (state.tries || 0) + 1;
 const ok = q.correct === option;
 return {tries, picked: option, solved: ok, first: state.first ?? ok};
}
export const quizPoints = (state, full = 1) => state?.solved ? (state.tries === 1 ? full : full / 2) : 0;

// ---------- Tryb: address ----------
export const home = {
 devices: [
  {id: 'phone', name: 'Telefon Kuby', icon: 'phone', ip: '192.168.1.23'},
  {id: 'console', name: 'Konsola', icon: 'desktop', ip: '192.168.1.30'},
  {id: 'laptop', name: 'Laptop siostry', icon: 'laptop', ip: '192.168.1.24'}
 ],
 routerLan: '192.168.1.1',
 routerWan: '203.0.113.77',
 server: {name: 'Serwer gry (Frankfurt)', ip: '198.51.100.40'}
};
// Przykład rozwiązany: droga zapytania z konsoli do serwera gry i z powrotem (NAT).
export const natSteps = [
 {at: 'console', from: '192.168.1.30', to: '198.51.100.40', text: 'Konsola wysyła pakiet: „ruszam się w lewo”. Serwer gry nie jest w Twoim domu, więc pakiet idzie do bramy — routera.'},
 {at: 'router', from: '203.0.113.77', to: '198.51.100.40', text: 'Router podmienia adres nadawcy: prywatny 192.168.1.30 → publiczny 203.0.113.77 (to NAT). Zapisuje w tabelce, że odpowiedź ma oddać konsoli.'},
 {at: 'server', from: '198.51.100.40', to: '203.0.113.77', text: 'Serwer gry widzi tylko publiczny adres routera. Odsyła odpowiedź na ten adres — o konsoli i telefonie nic nie wie.'},
 {at: 'console', from: '198.51.100.40', to: '192.168.1.30', text: 'Router sprawdza tabelkę i oddaje odpowiedź konsoli. Cała droga tam i z powrotem to właśnie ping.'}
];
export const natQuiz = {
 id: 'nat',
 question: 'Kuba gra na konsoli (192.168.1.30). Jaki adres widzi serwer gry?',
 options: ['192.168.1.30 — adres konsoli', '192.168.1.1 — adres routera od strony domu', '203.0.113.77 — publiczny adres routera od operatora', 'Numer seryjny konsoli'],
 correct: 2,
 explain: 'Serwer w internecie widzi publiczny adres routera. Wszystkie urządzenia w Twoim domu wychodzą do internetu pod tym jednym adresem. Dlatego ban „na IP” w grze może trafić całe mieszkanie.',
 hint: 'Adresy 192.168.x.x działają tylko w domu. Kto „wychodzi” z nimi do internetu?'
};
export const classifyItems = [
 {ip: '192.168.1.30', kind: 'private', why: '192.168.x.x to pula prywatna — typowa w domowych routerach.'},
 {ip: '10.12.0.57', kind: 'private', why: '10.x.x.x to pula prywatna — często w szkołach i firmach.'},
 {ip: '203.0.113.77', kind: 'public', why: 'Nie należy do żadnej puli prywatnej, więc jest publiczny — widać go w internecie.'},
 {ip: '172.20.5.9', kind: 'private', why: '172.16.x.x–172.31.x.x to trzecia pula prywatna. 20 mieści się między 16 a 31.'},
 {ip: '172.40.1.1', kind: 'public', why: '172.40 jest poza pulą 172.16–172.31, więc to adres publiczny.'},
 {ip: '192.168.1.256', kind: 'invalid', why: 'Każda z czterech liczb w IPv4 jest od 0 do 255. 256 się nie mieści.'}
];
export const classifyOptions = [['private', 'Prywatny'], ['public', 'Publiczny'], ['invalid', 'Błędny']];
export function checkClassify(state = {}) {
 const picks = state.picks || {};
 const wrong = classifyItems.map((it, i) => picks[i] === it.kind ? null : i).filter(i => i !== null);
 const missing = classifyItems.filter((_, i) => !picks[i]).length;
 if (missing) return {...state, msg: {ok: false, text: `Wybierz odpowiedź przy każdym adresie (brakuje: ${missing}).`}};
 const checks = (state.checks || 0) + 1;
 const solved = wrong.length === 0;
 return {...state, checks, solved, wrong, solvedAt: solved ? checks : undefined,
  msg: {ok: solved, text: solved ? (checks === 1 ? 'Wszystko dobrze za pierwszym razem.' : 'Teraz wszystko dobrze.') + ' Zapamiętaj trzy pule prywatne: 10.x, 172.16–31.x, 192.168.x.' : `Do poprawy: ${wrong.length}. Przy błędnych adresach jest podpowiedź.`}};
}
export function addressResult(st = {}) {
 const q = quizPoints(st.nat);
 const c = st.classify?.solved ? (st.classify.solvedAt === 1 ? 2 : 1) : 0;
 const done = !!(st.nat?.solved && st.classify?.solved);
 return {done, score: q + c, max: MAX.address, summary: done ? 'Adresy: serwer widzi publiczny adres routera, nie Twój prywatny' : undefined};
}

// ---------- Tryb: packets ----------
export const nodes = [
 {id: 'me', label: 'Ty', sub: 'telefon', x: 40, y: 110},
 {id: 'router', label: 'Router', sub: 'w domu', x: 150, y: 110},
 {id: 'isp', label: 'Operator', sub: 'Kraków', x: 265, y: 110},
 {id: 'waw', label: 'Warszawa', sub: 'węzeł', x: 390, y: 34},
 {id: 'lodz', label: 'Łódź', sub: 'węzeł', x: 390, y: 110},
 {id: 'poz', label: 'Poznań', sub: 'węzeł', x: 390, y: 186},
 {id: 'srv', label: 'Serwer', sub: 'komunikatora', x: 515, y: 110},
 {id: 'friend', label: 'Kolega', sub: 'Gdańsk', x: 630, y: 110}
];
export const edges = [['me', 'router'], ['router', 'isp'], ['isp', 'waw'], ['isp', 'lodz'], ['isp', 'poz'], ['waw', 'srv'], ['lodz', 'srv'], ['poz', 'srv'], ['srv', 'friend']];
const via = mid => ['me', 'router', 'isp', mid, 'srv', 'friend'];
// Runda 1: zator w Łodzi — pakiet 5 ginie, pakiet 3 dociera późno.
export const round1 = [
 {n: 1, route: via('waw'), ms: 38},
 {n: 2, route: via('poz'), ms: 31},
 {n: 3, route: via('lodz'), ms: 64},
 {n: 4, route: via('waw'), ms: 41},
 {n: 5, route: via('lodz'), ms: null, lost: 'Zator w węźle Łódź: kolejka pełna, router odrzucił pakiet.'},
 {n: 6, route: via('poz'), ms: 44}
];
export const resend = {n: 5, route: via('waw'), ms: 39};
// Runda 2: węzeł Łódź nie działa (przecięty kabel) — routery omijają go.
export const round2 = [
 {n: 1, route: via('poz'), ms: 33},
 {n: 2, route: via('waw'), ms: 37},
 {n: 3, route: via('poz'), ms: 35},
 {n: 4, route: via('waw'), ms: 40},
 {n: 5, route: via('poz'), ms: 36},
 {n: 6, route: via('waw'), ms: 42}
];
export const arrivalOrder = round => round.filter(p => !p.lost).sort((a, b) => a.ms - b.ms).map(p => p.n);
export const lostPackets = round => round.filter(p => p.lost).map(p => p.n);
export const routeText = route => route.map(id => nodes.find(n => n.id === id).label).join(' → ');
export const packetQuizzes = {
 order: {id: 'order', question: 'Pakiet 2 dotarł przed pakietem 1, choć wysłano go później. Dlaczego?',
  options: ['Poszedł inną trasą (przez Poznań), która w tej chwili była szybsza', 'Pakiety zawsze docierają w losowej kolejności i nic tego nie zmienia', 'Pakiet 1 był większy, bo zawierał początek zdjęcia', 'Telefon kolegi przestawił kolejność pakietów'],
  correct: 0,
  explain: 'Każdy pakiet szuka drogi osobno. Różne trasy mają różne opóźnienia, więc kolejność się miesza. Każdy pakiet ma numer — telefon kolegi i tak złoży zdjęcie we właściwej kolejności.',
  hint: 'Spójrz w tabeli na trasy pakietów 1 i 2.'},
 reroute: {id: 'reroute', question: 'Węzeł w Łodzi przestał działać, a zdjęcie i tak dotarło w całości. Co się stało?',
  options: ['Routery wysłały pakiety innymi trasami — sieć omija awarię', 'Serwer poczekał, aż ktoś naprawi kabel w Łodzi', 'Zdjęcie wysłano w całości jednym dużym pakietem', 'Operator na chwilę wyłączył internet w całej Polsce'],
  correct: 0,
  explain: 'Internet ma wiele połączeń między węzłami. Gdy jeden padnie, routery wybierają inną drogę. Dlatego awaria jednego kabla zwykle nie wyłącza internetu — co najwyżej rośnie ping.',
  hint: 'Porównaj trasy w tabeli: przez które miasta poszły pakiety?'},
 game: {id: 'game', question: 'W grze online zginął pakiet z Twoją pozycją sprzed 50 ms. Co zwykle robi gra?',
  options: ['Nie wysyła go ponownie — za chwilę leci nowsza pozycja; przy dużej utracie pakietów postać „teleportuje się”', 'Zatrzymuje grę, aż pakiet dotrze', 'Wysyła ponownie całą rozgrywkę od początku', 'Zgubione pakiety w grach nie zdarzają się'],
  correct: 0,
  explain: 'Plik (zdjęcie) musi dojść w całości, więc brakujący pakiet wysyła się ponownie. W grze i rozmowie wideo liczy się „teraz” — stara pozycja jest bez sensu. Utrata pakietów w grze to przeskoki postaci i „gumowe” ruchy.',
  hint: 'Czy pozycja sprzed chwili jest jeszcze komuś potrzebna?'}
};
export const missingQuiz = {id: 'missing', question: 'Którego pakietu brakuje? Poproś o ponowne wysłanie właśnie jego.', options: ['1', '2', '3', '4', '5', '6'], correct: 4,
 explain: 'Brakowało pakietu 5. Telefon kolegi prosi tylko o niego — nie trzeba wysyłać całego zdjęcia od nowa.',
 hint: 'Sprawdź w tabeli, który pakiet ma status „zgubiony”.'};
export function packetsResult(st = {}) {
 const q = ['order', 'missing', 'reroute', 'game'];
 const score = q.reduce((s, k) => s + quizPoints(st[k]), 0);
 const done = q.every(k => st[k]?.solved);
 return {done, score, max: MAX.packets, summary: done ? 'Pakiety: 6 części zdjęcia, 1 zgubiona i wysłana ponownie, awaria ominięta' : undefined};
}

// ---------- Tryb: cmd (wiersz poleceń Windows 11) ----------
export const sample = {
 ipv4: '192.168.10.57', gateway: '192.168.10.1', mask: '255.255.255.0',
 pingTarget: 'przyklad-gry.pl', pingIp: '203.0.113.25', pingAvg: 12, pingMin: 11, pingMax: 14, ttl: 57,
 hops: 8,
 far: {target: 'us.przyklad-gry.com', avg: 118}
};
export const sampleOutputs = {
 ipconfig: `C:\\Users\\uczen>ipconfig

Konfiguracja IP systemu Windows


Karta Ethernet Ethernet:

   Sufiks DNS konkretnego połączenia : pracownia.local
   Adres IPv6 połączenia lokalnego . : fe80::5d2a:91c4:7b3e:1f08%12
   Adres IPv4. . . . . . . . . . . . : 192.168.10.57
   Maska podsieci. . . . . . . . . . : 255.255.255.0
   Brama domyślna. . . . . . . . . . : 192.168.10.1

Karta bezprzewodowej sieci LAN Wi-Fi:

   Stan nośnika. . . . . . . . . . . : Nośnik odłączony
   Sufiks DNS konkretnego połączenia :`,
 ping: `C:\\Users\\uczen>ping przyklad-gry.pl

Badanie przyklad-gry.pl [203.0.113.25] z 32 bajtami danych:
Odpowiedź z 203.0.113.25: bajtów=32 czas=11ms TTL=57
Odpowiedź z 203.0.113.25: bajtów=32 czas=12ms TTL=57
Odpowiedź z 203.0.113.25: bajtów=32 czas=14ms TTL=57
Odpowiedź z 203.0.113.25: bajtów=32 czas=11ms TTL=57

Statystyka badania ping dla 203.0.113.25:
    Pakiety: Wysłane = 4, Odebrane = 4, Utracone = 0
             (0% straty),
Szacunkowy czas błądzenia pakietów w millisekundach:
    Minimum = 11ms, Maksimum = 14ms, Czas średni = 12ms`,
 tracert: `C:\\Users\\uczen>tracert przyklad-gry.pl

Śledzenie trasy do przyklad-gry.pl [203.0.113.25]
przez maksymalnie 30 przeskoków:

  1    <1 ms    <1 ms    <1 ms  192.168.10.1
  2     2 ms     1 ms     1 ms  10.0.0.1
  3     6 ms     5 ms     6 ms  198.51.100.1
  4     *        *        *     Upłynął limit czasu żądania.
  5     9 ms     8 ms     9 ms  198.51.100.66
  6    10 ms    10 ms    11 ms  203.0.113.129
  7    11 ms    12 ms    11 ms  203.0.113.2
  8    12 ms    11 ms    12 ms  203.0.113.25

Śledzenie zakończone.`
};
// Linia, w której jest odpowiedź — do podświetlenia po zaliczeniu w trybie zastępczym.
export const answerLines = {ipv4: 'Adres IPv4', gateway: 'Brama domyślna', ping: 'Czas średni', hops: '  8    12 ms'};

const R = (ok, text, extra = {}) => ({ok, text, ...extra});
export function checkIPv4(input, source = 'live') {
 const s = String(input ?? '').trim();
 if (!s) return R(false, 'Wpisz adres z linii „Adres IPv4”.', {noCount: true});
 if (looksLikeIPv6(s)) return R(false, 'To adres IPv6 (ma dwukropki). Poszukaj linii „Adres IPv4” — cztery liczby oddzielone kropkami.');
 if (looksLikeMask(s)) return R(false, 'To maska podsieci (zaczyna się od 255). Adres IPv4 jest linijkę wyżej.');
 if (!parseIPv4(s)) return R(false, 'Adres IPv4 to cztery liczby od 0 do 255 oddzielone kropkami, np. 192.168.0.15. Sprawdź, czy nie zgubiłeś kropki albo cyfry.');
 if (source === 'sample') {
  if (s === sample.ipv4) return R(true, 'Dobrze. 192.168.10.57 to adres prywatny (pula 192.168.x.x) — widać go tylko w sieci pracowni.', {kind: 'private'});
  if (s === sample.gateway) return R(false, 'To brama domyślna (router). Szukasz adresu tego komputera — linia „Adres IPv4”.');
  return R(false, 'Ten adres nie występuje w linii „Adres IPv4” karty Ethernet. Przepisz go dokładnie.');
 }
 const kind = ipKind(s);
 if (kind === 'loopback') return R(false, '127.x.x.x to adres „sam do siebie” (localhost). Szukaj linii „Adres IPv4” przy karcie Ethernet albo Wi-Fi, która jest połączona.');
 if (kind === 'apipa') return R(false, 'Adres 169.254.x.x znaczy, że komputer nie dostał adresu z sieci (nie działa połączenie). Powiedz nauczycielowi albo przełącz ten krok na przykład.');
 if (kind === 'special') return R(false, 'To adres specjalny, nie adres komputera. Sprawdź linię „Adres IPv4” przy połączonej karcie.');
 if (kind === 'public') return R(true, 'Format poprawny. To adres publiczny — w pracowni to rzadkie. Upewnij się, że przepisałeś linię „Adres IPv4”, a nie inną.', {kind});
 return R(true, `Format poprawny. To adres prywatny (pule 10.x, 172.16–31.x, 192.168.x) — widać go tylko w sieci szkoły, nie w internecie.`, {kind});
}
export function checkGateway(input, ipv4, source = 'live') {
 const s = String(input ?? '').trim();
 if (!s) return R(false, 'Wpisz adres z linii „Brama domyślna”.', {noCount: true});
 if (looksLikeIPv6(s)) return R(false, 'To adres IPv6. Jeśli przy bramie są dwa adresy, przepisz ten z kropkami.');
 if (looksLikeMask(s)) return R(false, 'To maska podsieci (255…). Brama domyślna jest linijkę niżej.');
 if (!parseIPv4(s)) return R(false, 'Brama to też adres IPv4: cztery liczby od 0 do 255 oddzielone kropkami.');
 if (source === 'sample') {
  if (s === sample.gateway) return R(true, 'Dobrze. 192.168.10.1 to router pracowni — brama, przez którą wychodzi wszystko, co nie jest w sieci lokalnej.');
  if (s === sample.ipv4) return R(false, 'To adres komputera. Brama domyślna to osobna linia — zwykle kończy się na .1 albo .254.');
  return R(false, 'Przepisz dokładnie adres z linii „Brama domyślna”.');
 }
 const me = String(ipv4 ?? '').trim();
 if (s === me) return R(false, 'To Twój adres, nie brama. Brama domyślna to osobna linia — zwykle kończy się na .1 albo .254.');
 const a = parseIPv4(s), b = parseIPv4(me);
 if (b && a[0] !== b[0]) return R(false, 'Brama musi być w tej samej sieci co komputer — zwykle zaczyna się tak samo jak Twój adres IPv4. Sprawdź, czy przepisujesz z tej samej karty sieciowej.');
 if (b && (a[1] !== b[1] || a[2] !== b[2])) return R(true, 'Format poprawny. Brama różni się od Twojego adresu bardziej niż zwykle — to możliwe w dużej sieci szkolnej.');
 return R(true, 'Format poprawny. To router sieci — brama, przez którą wychodzi wszystko, co nie jest w tej sieci lokalnej.');
}
export function parseMs(input) {
 const s = String(input ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/ms$/, '').replace(',', '.');
 if (/^<1$/.test(s)) return 0.5;
 if (!/^\d+(\.\d+)?$/.test(s)) return null;
 return Number(s);
}
export const validTarget = t => /^(?=.{4,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/i.test(String(t ?? '').trim()) || !!parseIPv4(t);
export function checkPing(input, target, source = 'live') {
 if (source === 'sample') {
  const v = parseMs(input);
  if (v === null) return R(false, 'Wpisz samą liczbę milisekund, np. 25.');
  if (v === sample.pingAvg) return R(true, 'Dobrze: czas średni 12 ms. Tyle trwa droga pakietu do serwera i z powrotem.');
  if (v === 32) return R(false, '32 to liczba bajtów w każdym pakiecie, nie czas. Szukaj „Czas średni”.');
  if (v === sample.ttl) return R(false, 'TTL to licznik przeskoków, które pakiet jeszcze może zrobić, a nie czas. Szukaj „Czas średni”.');
  if (v === sample.pingMin || v === sample.pingMax) return R(false, 'To minimum albo maksimum. W paszporcie zapisujemy czas średni — ostatnia liczba w statystyce.');
  return R(false, 'Ta liczba nie pasuje. Szukaj w statystyce na dole: „Czas średni = … ms”.');
 }
 if (!validTarget(target)) return R(false, 'Najpierw wpisz, do czego robisz ping — adres strony (np. nazwa.pl) albo adres IP.', {noCount: true});
 const v = parseMs(input);
 if (v === null) return R(false, 'Wpisz samą liczbę milisekund z „Czas średni”, np. 25.');
 if (v < 1) return R(false, 'Mniej niż 1 ms to ping do urządzenia w tej samej sieci (np. do bramy). Zrób ping do strony w internecie.');
 if (v > 3000) return R(false, 'To za dużo jak na czas — Windows czeka na odpowiedź ok. 4 s. Czy to nie liczba bajtów albo TTL? Szukaj „Czas średni”.');
 const note = v <= 40 ? 'Szybko: serwer jest blisko (Polska albo pobliski kraj).' : v <= 90 ? 'Średnio: serwer jest dalej albo sieć jest obciążona.' : 'Dużo: serwer jest daleko (np. inny kontynent) albo coś po drodze spowalnia.';
 return R(true, `Zapisano: ${v} ms. ${note}`);
}
export function checkHops(input, source = 'live') {
 const s = String(input ?? '').trim();
 if (!/^\d{1,2}$/.test(s)) return R(false, 'Wpisz numer ostatniego wiersza trasy — jedną liczbę, np. 9.');
 const v = Number(s);
 if (source === 'sample') {
  if (v === sample.hops) return R(true, 'Dobrze: 8 przeskoków. Wiersz 4 z gwiazdkami to router, który nie odpowiedział na pytanie — ale pakiety poszły przez niego dalej.');
  if (v === 30) return R(false, '30 to maksimum, które tracert sprawdza, a nie wynik. Policz wiersze z numerami.');
  if (v === 7) return R(false, 'Wiersz z gwiazdkami też się liczy — to router, który nie odpowiedział, ale był na trasie.');
  return R(false, 'Policz wiersze z numerami od 1 do ostatniego, w którym pojawia się adres serwera.');
 }
 if (v < 1 || v > 30) return R(false, 'Liczba przeskoków w tracert jest od 1 do 30.');
 if (v === 1) return R(false, 'Jeden przeskok to tylko brama. Jeśli dalej są same gwiazdki, zapora szkoły zatrzymuje tracert — przełącz ten krok na przykład.');
 if (v === 30) return R(false, '30 to limit: trasa nie doszła do celu (pewnie zapora). Przełącz ten krok na przykład.');
 return R(true, `Zapisano: ${v} przeskoków. Każdy przeskok to router, który przekazał Twój pakiet dalej.`);
}
export const CMD_FIELDS = ['ipv4', 'gateway', 'ping', 'hops'];
const fieldSource = (st, f) => (st.src?.[f === 'gateway' ? 'ipv4' : f]) || st.mode || 'live';
export {fieldSource};
export function checkField(st = {}, field) {
 const src = fieldSource(st, field);
 const inp = st.inputs || {};
 const r = field === 'ipv4' ? checkIPv4(inp.ipv4, src)
  : field === 'gateway' ? (st.checks?.ipv4?.ok ? checkGateway(inp.gateway, inp.ipv4, src) : R(false, 'Najpierw zapisz poprawny adres IPv4.', {noCount: true}))
  : field === 'ping' ? checkPing(inp.ping, inp.pingTarget, src)
  : checkHops(inp.hops, src);
 const prev = st.checks?.[field] || {};
 if (prev.ok && prev.value === inp[field] && prev.src === src) return st;
 const counted = !r.noCount && String(inp[field] ?? '').trim() !== '';
 const tries = (prev.tries || 0) + (counted ? 1 : 0);
 const ok = r.ok;
 return {...st, checks: {...st.checks, [field]: {ok, text: r.text, tries, src, value: inp[field], target: field === 'ping' ? (src === 'sample' ? sample.pingTarget : String(inp.pingTarget || '').trim()) : undefined,
  pts: ok ? (prev.pts ?? (tries === 1 ? 1 : 0.5)) : prev.pts}}};
}
export function cmdResult(st = {}) {
 const c = st.checks || {};
 const score = CMD_FIELDS.reduce((s, f) => s + (c[f]?.ok ? (c[f].pts ?? 1) : 0), 0);
 const done = CMD_FIELDS.every(f => c[f]?.ok);
 return {done, score, max: MAX.cmd, summary: done ? passportLine(st) : undefined};
}
export function passport(st = {}) {
 const c = st.checks || {};
 const val = f => c[f]?.ok ? c[f].value : null;
 const ip = val('ipv4');
 const isSample = f => c[f]?.src === 'sample';
 return {
  ipv4: ip ? String(ip).trim() : null, ipKind: ip ? ipKind(ip) : null, gateway: val('gateway') ? String(val('gateway')).trim() : null,
  ping: c.ping?.ok ? parseMs(c.ping.value) : null, pingTarget: c.ping?.ok ? c.ping.target : null, hops: c.hops?.ok ? Number(c.hops.value) : null,
  prediction: parseMs(st.inputs?.prediction),
  sample: {ipv4: isSample('ipv4'), ping: isSample('ping'), hops: isSample('hops')}
 };
}
export function passportLine(st = {}) {
 const p = passport(st);
 const mark = k => p.sample[k] ? ' (przykład)' : '';
 const ms = p.ping === 0.5 ? '<1' : p.ping;
 return `Paszport połączenia: IPv4 ${p.ipv4} (${kindLabel[p.ipKind] || '?'})${mark('ipv4')} · brama ${p.gateway} · ping ${p.pingTarget} ${ms} ms${mark('ping')} · tracert ${p.hops} przeskoków${mark('hops')}`;
}
export const CONCLUSION_MIN = 20;
export function passportResult(cmdState = {}, st = {}) {
 const ok = cmdResult(cmdState).done;
 const text = String(st.conclusion || '').trim();
 return {done: ok && text.length >= CONCLUSION_MIN, score: 0, max: 0, summary: ok && text.length >= CONCLUSION_MIN ? `Wniosek: ${text.slice(0, 140)}` : undefined};
}
// Fizyka „laga”: światło w światłowodzie pokonuje ok. 200 km w 1 ms (ok. 2/3 prędkości w próżni).
export const FIBER_KM_PER_MS = 200;
export const minPingMs = km => Math.round(2 * km / FIBER_KM_PER_MS);

// ---------- Wynik zbiorczy (zapisywany w value.modes) ----------
export function netResult(value = {}) {
 return {
  address: addressResult(value.address),
  packets: packetsResult(value.packets),
  cmd: cmdResult(value.cmd),
  passport: passportResult(value.cmd, value.passport)
 };
}
