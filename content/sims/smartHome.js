// Logika symulatora „smartHome” (lekcja 15): energia (kWh → zł), audyt bezpieczeństwa IoT, reguły automatyzacji, plan.
// Założenie cenowe: 1,10 zł za 1 kWh (taryfa G11 z dystrybucją, 2026 r., w przybliżeniu).

export const PRICE = 1.10;
export const TARGET_SAVINGS = 250;
export const round2 = x => Math.round(x * 100) / 100;
export const kwhFrom = (w, hPerDay, days = 365) => (w * hPerDay * days) / 1000;
export const zl = kwh => round2(kwh * PRICE);
export const fmt = (x, d = 0, maxD = d) => Number(x).toLocaleString('pl-PL', {minimumFractionDigits: d, maximumFractionDigits: Math.max(d, maxD)});

/* ───────── Energia ───────── */
// active/standby: moc [W] i godziny na dobę. perUse: pranie (liczba na tydzień × kWh). perYear: kWh na rok (lodówka).
export const devices = [
  {id: 'tv', name: 'Telewizor', icon: 'desktop', active: {w: 100, h: 4}, standby: {w: 1, h: 20}},
  {id: 'decoder', name: 'Dekoder TV', icon: 'app', active: {w: 25, h: 4}, standby: {w: 20, h: 20}, note: 'W czuwaniu pobiera prawie tyle, co przy oglądaniu!'},
  {id: 'console', name: 'Konsola', icon: 'play', active: {w: 180, h: 2}, standby: {w: 8, h: 22}, note: 'Tryb spoczynku z pobieraniem aktualizacji.'},
  {id: 'pc', name: 'PC gamingowy', icon: 'cpu', active: {w: 350, h: 3}, standby: {w: 1, h: 21}},
  {id: 'router', name: 'Router Wi-Fi', icon: 'wifi', active: {w: 8, h: 24}, standby: {w: 0, h: 0}, note: 'Pracuje 24 h na dobę.'},
  {id: 'chargers', name: 'Ładowarki w gniazdkach (4 szt.)', icon: 'phone', active: {w: 0, h: 0}, standby: {w: 1.2, h: 20}, note: 'Razem ok. 1,2 W bez podłączonego telefonu.'},
  {id: 'kettle', name: 'Czajnik elektryczny', icon: 'energy', active: {w: 2000, h: 0.25}, standby: {w: 0, h: 0}},
  {id: 'washer', name: 'Pralka (5 prań/tydz., 60°C)', icon: 'reset', perUse: {perWeek: 5, kwh: 1.0}},
  {id: 'fridge', name: 'Lodówka', icon: 'memory', perYear: 140},
  {id: 'lights', name: 'Oświetlenie: 2 żarówki halogenowe 42 W', icon: 'energy', active: {w: 84, h: 4}, standby: {w: 0, h: 0}},
];

export const measures = [
  {id: 'strip', name: 'Listwa z wyłącznikiem: TV + dekoder + konsola wyłączane na noc i gdy nikt nie ogląda (ok. 14 h/dobę)', cost: 60,
    apply: d => ['tv', 'decoder', 'console'].includes(d.id) ? {...d, standby: {...d.standby, h: Math.max(0, d.standby.h - 14)}} : d},
  {id: 'rest', name: 'Konsola: zamiast trybu spoczynku — pełne wyłączenie (0,5 W)', cost: 0,
    apply: d => d.id === 'console' ? {...d, standby: {...d.standby, w: 0.5}} : d},
  {id: 'routerNight', name: 'Router: harmonogram — wyłączony 1:00–6:00', cost: 0, warn: 'Nie dla każdego: w nocy nie działa Wi-Fi, kamera ani nocne aktualizacje.',
    apply: d => d.id === 'router' ? {...d, active: {...d.active, h: d.active.h - 5}} : d},
  {id: 'led', name: 'Wymiana 2 żarówek halogenowych na LED 6 W', cost: 30,
    apply: d => d.id === 'lights' ? {...d, name: 'Oświetlenie: 2 żarówki LED 6 W', active: {...d.active, w: 12}} : d},
  {id: 'wash40', name: 'Pranie w 40°C zamiast 60°C (ok. 0,6 kWh zamiast 1,0 kWh)', cost: 0,
    apply: d => d.id === 'washer' ? {...d, perUse: {...d.perUse, kwh: 0.6}} : d},
  {id: 'kettle', name: 'Czajnik: gotuj tylko tyle wody, ile potrzebujesz (−30% czasu)', cost: 0,
    apply: d => d.id === 'kettle' ? {...d, active: {...d.active, h: d.active.h * 0.7}} : d},
  {id: 'fps', name: 'PC: limit klatek (FPS) do częstotliwości monitora — ok. 280 W zamiast 350 W', cost: 0,
    apply: d => d.id === 'pc' ? {...d, active: {...d.active, w: 280}} : d},
  {id: 'chargers', name: 'Wyjmuj ładowarki z gniazdek', cost: 0,
    apply: d => d.id === 'chargers' ? {...d, standby: {...d.standby, h: 0}} : d},
  {id: 'fridge', name: 'Nowa lodówka o wyższej klasie energetycznej (100 kWh/rok)', cost: 2500,
    apply: d => d.id === 'fridge' ? {...d, perYear: 100} : d},
];

export function deviceKwh(d) {
  if (d.perYear !== undefined) return d.perYear;
  if (d.perUse) return d.perUse.perWeek * 52 * d.perUse.kwh;
  return kwhFrom(d.active.w, d.active.h) + kwhFrom(d.standby.w, d.standby.h);
}
export function formula(d) {
  if (d.perYear !== undefined) return `${fmt(d.perYear)} kWh/rok (z etykiety)`;
  if (d.perUse) return `${d.perUse.perWeek} × 52 tyg. × ${fmt(d.perUse.kwh, 1)} kWh`;
  const parts = [];
  if (d.active.w && d.active.h) parts.push(`${fmt(d.active.w, 0, 1)} W × ${fmt(d.active.h, 0, 3)} h`);
  if (d.standby.w && d.standby.h) parts.push(`${fmt(d.standby.w, 0, 1)} W × ${fmt(d.standby.h)} h`);
  return parts.length ? `(${parts.join(' + ')}) × 365 / 1000` : '0';
}
export const applyMeasures = (chosen = []) => devices.map(d => measures.filter(m => chosen.includes(m.id)).reduce((x, m) => m.apply(x), d));
export function energyPlan(chosen = []) {
  const before = devices.map(d => ({id: d.id, kwh: deviceKwh(d)}));
  const afterDevs = applyMeasures(chosen);
  const after = afterDevs.map(d => ({id: d.id, kwh: deviceKwh(d)}));
  const kwhBefore = before.reduce((s, x) => s + x.kwh, 0), kwhAfter = after.reduce((s, x) => s + x.kwh, 0);
  const cost = measures.filter(m => chosen.includes(m.id)).reduce((s, m) => s + m.cost, 0);
  const savings = round2((kwhBefore - kwhAfter) * PRICE);
  const payback = savings > 0 ? cost / (savings / 12) : Infinity;
  return {kwhBefore: round2(kwhBefore), kwhAfter: round2(kwhAfter), zlBefore: zl(kwhBefore), zlAfter: zl(kwhAfter), savings, cost, payback, afterDevs};
}
export const measureSaving = id => energyPlan([id]).savings;

/** Pytanie rachunkowe: roczny koszt routera 8 W × 24 h. */
export const routerQuestion = {w: 8, h: 24, answer: zl(kwhFrom(8, 24)), tolerance: 1.5};
export function checkRouterCost(input, attempt = 1) {
  const n = Number(String(input ?? '').replace(',', '.').replace(/[^\d.]/g, ''));
  if (!String(input ?? '').trim() || Number.isNaN(n)) return {ok: false, message: 'Wpisz liczbę złotych, np. 45,50.'};
  if (Math.abs(n - routerQuestion.answer) <= routerQuestion.tolerance) return {ok: true, message: `Tak: 8 W × 24 h × 365 / 1000 = 70,08 kWh; × 1,10 zł = ok. ${fmt(routerQuestion.answer, 2)} zł rocznie.`};
  if (Math.abs(n - 70.08) <= 1) return {ok: false, message: 'To wynik w kWh. Pomnóż jeszcze przez cenę 1,10 zł/kWh.'};
  if (Math.abs(n - 0.21) <= 0.05 || Math.abs(n - 192) <= 2) return {ok: false, message: 'To zużycie na dobę. Pomnóż przez 365 dni.'};
  return {ok: false, message: attempt >= 2 ? 'Krok po kroku: 8 × 24 = 192 Wh na dobę; × 365 = 70 080 Wh = 70,08 kWh; × 1,10 zł = ?' : 'Liczysz: W × h × 365 / 1000 = kWh, a potem kWh × 1,10 zł.'};
}
export function energyScore(state = {}) {
  const p = energyPlan(state.measures || []);
  let pts = p.savings >= TARGET_SAVINGS ? 2 : p.savings >= TARGET_SAVINGS / 2 ? 1 : 0;
  if (p.savings > 0 && p.payback <= 12) pts += 1;
  const q = state.routerQ || {};
  if (q.solved) pts += q.solvedAt === 1 ? 1 : 0.5;
  return {score: pts, max: 4, done: p.savings >= TARGET_SAVINGS, plan: p};
}

/* ───────── Bezpieczeństwo ───────── */
export const fixes = {
  pass: 'Ustaw długie, unikalne hasło (zamiast fabrycznego lub słabego)',
  update: 'Zaktualizuj oprogramowanie (firmware) i włącz automatyczne aktualizacje',
  iot: 'Przenieś do osobnej sieci Wi-Fi dla urządzeń IoT',
  wps: 'Wyłącz WPS i UPnP',
  mfa: 'Włącz weryfikację dwuetapową (2FA) w aplikacji',
  remote: 'Wyłącz zbędny dostęp z internetu (zamknij przekierowanie portu)',
  firewall: 'Wyłącz zaporę w routerze, żeby wszystko działało szybciej',
  noupdate: 'Wyłącz aktualizacje — „jak działa, to nie ruszaj”',
};
export const traps = {firewall: 'Zapora to pierwsza linia obrony. Wyłączona = każde urządzenie wystawione na ataki.', noupdate: 'Aktualizacje łatają dziury, przez które wchodzą boty. Bez nich urządzenie z roku na rok jest łatwiejszym celem.'};
export const iotDevices = [
  {id: 'cam', name: 'Kamera IP w salonie', icon: 'camera', issues: [
    {fix: 'pass', text: 'Login i hasło: admin / admin (fabryczne)', hint: 'Takie hasło boty sprawdzają w pierwszej kolejności.'},
    {fix: 'remote', text: 'Podgląd wystawiony do internetu przez przekierowanie portu', hint: 'Każdy w internecie może „zapukać” do kamery.'},
    {fix: 'iot', text: 'Działa w tej samej sieci co laptopy', hint: 'Przejęta kamera nie powinna widzieć komputerów.'}],
    options: ['pass', 'firewall', 'remote', 'iot', 'wps']},
  {id: 'router', name: 'Router Wi-Fi', icon: 'wifi', issues: [
    {fix: 'pass', text: 'Hasło do panelu: fabryczne, z naklejki', hint: 'Kto zna hasło do panelu, zmienia wszystko w sieci.'},
    {fix: 'wps', text: 'WPS i UPnP włączone', hint: 'WPS da się złamać, a UPnP pozwala urządzeniom samym otwierać porty.'},
    {fix: 'update', text: 'Firmware sprzed 3 lat', hint: 'Stary firmware = znane i opisane w sieci luki.'}],
    options: ['wps', 'noupdate', 'update', 'pass', 'firewall']},
  {id: 'tv', name: 'Smart TV', icon: 'desktop', issues: [
    {fix: 'update', text: 'Brak aktualizacji od 2 lat', hint: 'Telewizor to komputer z przeglądarką — też potrzebuje łatek.'},
    {fix: 'iot', text: 'W sieci głównej, obok laptopów', hint: 'Telewizor nie musi widzieć komputerów domowników.'}],
    options: ['update', 'iot', 'noupdate', 'wps']},
  {id: 'robot', name: 'Odkurzacz robot (mapa mieszkania w chmurze)', icon: 'app', issues: [
    {fix: 'mfa', text: 'Konto w aplikacji bez weryfikacji dwuetapowej', hint: 'Ktoś z Twoim hasłem zobaczy mapę mieszkania.'},
    {fix: 'iot', text: 'W sieci głównej', hint: 'Robot nie potrzebuje dostępu do laptopów.'}],
    options: ['firewall', 'mfa', 'iot', 'remote']},
  {id: 'lock', name: 'Inteligentny zamek (mostek Wi-Fi)', icon: 'shield', issues: [
    {fix: 'pass', text: 'Konto w aplikacji z hasłem „nowak123”', hint: 'Nazwisko + cyfry to jedno z pierwszych haseł, jakie ktoś sprawdzi.'},
    {fix: 'mfa', text: 'Brak weryfikacji dwuetapowej', hint: 'Zamek do drzwi bez 2FA to proszenie się o kłopoty.'},
    {fix: 'iot', text: 'Mostek zamka w sieci głównej', hint: 'Oddziel urządzenia IoT od komputerów.'}],
    options: ['mfa', 'noupdate', 'pass', 'iot']},
  {id: 'plug', name: 'Gniazdko smart (listwa RTV)', icon: 'energy', issues: [
    {fix: 'update', text: 'Oprogramowanie w fabrycznej wersji 1.0', hint: 'Tanie gniazdka często mają luki łatane dopiero w aktualizacjach.'},
    {fix: 'iot', text: 'W sieci głównej, obok laptopów', hint: 'Najtańsze urządzenie w sieci nie może być furtką do komputerów.'}],
    options: ['iot', 'firewall', 'update', 'mfa']},
];
export const SEC_ISSUES = iotDevices.reduce((s, d) => s + d.issues.length, 0);
export function securityAudit(sel = {}) {
  let fixed = 0, trapCount = 0;
  const perDevice = iotDevices.map(d => {
    const chosen = sel[d.id] || [];
    const missing = d.issues.filter(i => !chosen.includes(i.fix));
    const trapsHere = chosen.filter(f => traps[f]);
    fixed += d.issues.length - missing.length; trapCount += trapsHere.length;
    return {id: d.id, name: d.name, missing, traps: trapsHere, ok: !missing.length && !trapsHere.length};
  });
  const pct = Math.max(0, Math.round(100 * fixed / SEC_ISSUES) - 20 * trapCount);
  return {pct, fixed, traps: trapCount, perDevice};
}
export function securityPoints(check) {
  if (!check) return 0;
  let p = check.pct >= 100 ? 3 : check.pct >= 70 ? 2 : check.pct >= 40 ? 1 : 0;
  if (check.traps === 0 && check.pct >= 40) p += 1;
  return check.attempts > 1 ? Math.min(p, 3) : p;
}
export function securityScore(state = {}) {
  const c = state.secCheck;
  return {score: securityPoints(c), max: 4, done: !!c && c.pct >= 70 && c.traps === 0, pct: c ? c.pct : null};
}

/* ───────── Automatyzacje ───────── */
export const triggers = {time23: 'jest godz. 23:00', away: 'nikt nie jest w domu', flood: 'czujnik zalania wykrył wodę', window: 'okno jest otwarte', sunset: 'zachodzi słońce', motionAway: 'wykryto ruch, gdy nikogo nie ma', cold: 'w pokoju jest poniżej 19°C', doorbell: 'ktoś dzwoni do drzwi'};
export const conditions = {none: '(bez warunku)', home: 'ktoś jest w domu', nobody: 'nikogo nie ma w domu', night: 'jest noc (23–6)', weekday: 'jest dzień roboczy'};
export const actions = {strip: 'wyłącz gniazdka listwy RTV', valve: 'zamknij zawór wody', notify: 'wyślij powiadomienie na telefon', light: 'włącz światło', heatDown: 'obniż ogrzewanie', heatUp: 'podnieś ogrzewanie', unlock: 'otwórz zamek w drzwiach'};
const table = {
  'time23:strip': ['energy', 'Na noc RTV bez prądu — koniec z czuwaniem dekodera.'],
  'away:strip': ['energy', 'Nikogo nie ma — RTV nie czuwa na darmo.'],
  'away:heatDown': ['energy', 'Pusty dom nie potrzebuje 22°C. Każdy stopień mniej to kilka procent mniej za ogrzewanie.'],
  'window:heatDown': ['energy', 'Wietrzysz — grzejnik skręcony. Nie grzejesz ulicy.'],
  'time23:heatDown': ['energy', 'Chłodniejsza noc: taniej i lepiej się śpi.'],
  'flood:valve': ['safety', 'Najlepsza reguła w domu: woda zakręcona, zanim zaleje sąsiadów.'],
  'flood:notify': ['safety', 'Wiesz o zalaniu od razu, nawet w szkole.'],
  'flood:strip': ['safety', 'Woda i prąd się nie lubią — odcięcie gniazdek to dobry dodatek.'],
  'motionAway:notify': ['safety', 'Ruch w pustym domu = natychmiastowe powiadomienie.'],
  'motionAway:light': ['safety', 'Światło odstrasza, a nagranie z kamery będzie wyraźniejsze.'],
  'away:valve': ['safety', 'Wyjście z domu = zakręcona woda. Mniejsze ryzyko zalania.'],
  'window:notify': ['safety', 'Otwarte okno? Dostaniesz sygnał i zdążysz zareagować.'],
  'sunset:light': ['comfort', 'Wygoda: światło po zmroku.'],
  'cold:heatUp': ['comfort', 'Ciepło, gdy robi się zimno.'],
  'cold:notify': ['comfort', 'Przypomnienie, że w pokoju robi się zimno.'],
  'doorbell:notify': ['comfort', 'Wiesz, że ktoś dzwoni, nawet w słuchawkach.'],
  'doorbell:light': ['comfort', 'Światło przy drzwiach, gdy ktoś dzwoni.'],
};
export function classifyRule({trigger, condition = 'none', action} = {}) {
  if (!triggers[trigger] || !actions[action] || !conditions[condition]) return {kind: 'invalid', message: 'Wybierz wyzwalacz i akcję.'};
  if (action === 'unlock') return {kind: 'risky', message: 'Automatyczne otwieranie drzwi to zaproszenie dla włamywacza. Zamek otwiera człowiek, który widzi, kto stoi za drzwiami.'};
  if (trigger === 'window' && action === 'heatUp') return {kind: 'risky', message: 'Grzejesz ulicę: przy otwartym oknie podnoszenie ogrzewania to spalone pieniądze.'};
  if ((trigger === 'away' || trigger === 'motionAway') && condition === 'home') return {kind: 'weak', message: 'Warunek przeczy wyzwalaczowi — ta reguła nigdy się nie uruchomi.'};
  if (trigger === 'cold' && action === 'heatUp' && condition === 'nobody') return {kind: 'weak', message: 'Grzejesz pusty dom. Lepiej: podnieś ogrzewanie, gdy ktoś jest w domu.'};
  if (trigger === 'sunset' && action === 'light' && condition === 'nobody') return {kind: 'safety', message: 'Symulacja obecności: dom po zmroku nie wygląda na pusty.'};
  const hit = table[`${trigger}:${action}`];
  if (hit) return {kind: hit[0], message: hit[1]};
  return {kind: 'weak', message: 'Ta reguła nie ma jasnego sensu — nie liczy się do celu. Zastanów się, co ma dać: oszczędność, bezpieczeństwo czy wygodę?'};
}
export const ruleText = r => `JEŻELI ${triggers[r.trigger]}${r.condition && r.condition !== 'none' ? ` I ${conditions[r.condition]}` : ''} TO ${actions[r.action]}`;
export const sameRule = (a, b) => a.trigger === b.trigger && (a.condition || 'none') === (b.condition || 'none') && a.action === b.action;
export const MAX_RULES = 8;
export function rulesScore(rules = []) {
  const kinds = rules.map(r => classifyRule(r).kind);
  const sensible = kinds.filter(k => k === 'energy' || k === 'safety' || k === 'comfort').length;
  const energy = kinds.filter(k => k === 'energy').length, safety = kinds.filter(k => k === 'safety').length, risky = kinds.filter(k => k === 'risky').length;
  const score = (sensible >= 3 ? 1 : 0) + (energy >= 1 ? 1 : 0) + (safety >= 1 ? 1 : 0) + (rules.length && !risky ? 1 : 0);
  return {score, max: 4, sensible, energy, safety, risky, done: sensible >= 3 && energy >= 1 && safety >= 1 && risky === 0};
}

/* ───────── Plan i wynik całości ───────── */
export const rulesWord = n => (n === 1 ? 'reguła' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'reguły' : 'reguł');
export function smartHomeResult(state = {}) {
  const e = energyScore(state), s = securityScore(state), a = rulesScore(state.rules || []);
  const score = e.score + s.score + a.score;
  const rules = (state.rules || []).filter(r => ['energy', 'safety', 'comfort'].includes(classifyRule(r).kind)).length;
  const started = (state.measures || []).length || state.secCheck || (state.rules || []).length;
  return {score, max: 12, done: e.done && s.done && a.done, energy: e, security: s, auto: a,
    summary: started ? `Plan dla Nowaków: −${fmt(e.plan.savings)} zł/rok, bezpieczeństwo ${s.pct ?? 0}%, ${rules} ${rulesWord(rules)}` : undefined};
}
