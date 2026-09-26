// Logika symulatora „schoolNetwork” (lekcja 14): mapa sieci szkoły i ćwiczenie „Awaria! Co przestaje działać?”.

export const netNodes = {
  ose: {name: 'Internet OSE', icon: 'globe', kind: 'infra', does: 'Ogólnopolska Sieć Edukacyjna (NASK) daje szkole bezpłatny, symetryczny internet (min. 100 Mb/s), filtr treści i ochronę przed atakami.', fails: 'Gdy łącze OSE nie działa, cała szkoła jest bez internetu — ale sieć lokalna (drukarki, NAS, kamery) działa dalej.'},
  cloud: {name: 'E-dziennik (chmura)', icon: 'book', kind: 'end', does: 'E-dziennik nie stoi w szkole — działa na serwerach dostawcy w internecie. Otwierasz go z każdego miejsca z dostępem do sieci.', fails: 'Jeśli w szkole padnie sieć, e-dziennik nadal działa — np. z telefonu przez LTE/5G.'},
  router: {name: 'Router / zapora', icon: 'shield', kind: 'infra', does: 'Łączy sieć szkoły z internetem, kieruje ruch między sieciami i filtruje połączenia (zapora, firewall).', fails: 'Szkoła traci internet. Ruch wewnątrz sieci lokalnej (np. komputer → drukarka) nie przechodzi przez router, więc nadal działa.'},
  core: {name: 'Przełącznik główny', icon: 'settings', kind: 'infra', does: 'Przełącznik (switch) łączy kablami wszystkie części szkolnej sieci i przesyła dane do właściwego urządzenia (po adresie MAC).', fails: 'Wszystko, co jest za nim — pracownia, pokój nauczycielski, Wi-Fi, NAS, kamery — traci sieć.'},
  labsw: {name: 'Przełącznik pracowni', icon: 'settings', kind: 'infra', does: 'Rozdziela sieć na 16 komputerów pracowni i monitor interaktywny.', fails: 'Tylko pracownia traci sieć. Reszta szkoły tego nie zauważy.'},
  labpc: {name: 'Komputery pracowni (16)', icon: 'desktop', kind: 'end', does: 'Stanowiska uczniów podłączone kablem do przełącznika pracowni.', fails: 'Bez sieci: brak internetu, drukowania sieciowego i dostępu do folderów na NAS. Programy lokalne działają.'},
  board: {name: 'Monitor interaktywny (pracownia)', icon: 'board', kind: 'end', does: 'Duży ekran dotykowy z wbudowanym komputerem. Kupiony m.in. z programu „Aktywna Tablica”. Podłączony kablem do przełącznika pracowni.', fails: 'Bez sieci nie otworzy materiałów z internetu, ale pokaże obraz z laptopa podłączonego przez HDMI.'},
  printer: {name: 'Drukarka sieciowa (pokój naucz.)', icon: 'printer', kind: 'end', does: 'Drukarka z własnym adresem IP. Drukuje z każdego komputera w sieci szkoły.', fails: 'Gdy wypadnie z sieci, system pokazuje ją jako „offline”, choć ma prąd i papier.'},
  teacherpc: {name: 'Komputer w pokoju naucz.', icon: 'laptop', kind: 'end', does: 'Komputer nauczycieli, podłączony kablem przez przełącznik główny.', fails: 'Bez sieci nie wydrukuje na drukarce sieciowej i nie otworzy e-dziennika.'},
  ap1: {name: 'Punkt dostępowy — parter', icon: 'wifi', kind: 'infra', does: 'Nadaje Wi-Fi: „Szkoła-Uczniowie” i „Szkoła-Goście” (z portalem logowania kodem dnia). Sieci są od siebie oddzielone.', fails: 'Na parterze znika Wi-Fi. Urządzenia na kablu działają.'},
  guest: {name: 'Laptop gościa (Szkoła-Goście)', icon: 'laptop', kind: 'end', does: 'Laptop prelegenta w sieci dla gości. Widzi tylko internet — nie widzi szkolnych drukarek ani NAS.', fails: 'Gdy padnie punkt dostępowy na parterze, gość traci połączenie.'},
  ap2: {name: 'Punkt dostępowy — 2. piętro', icon: 'wifi', kind: 'infra', does: 'Nadaje Wi-Fi w salach na 2. piętrze.', fails: 'Na 2. piętrze znika Wi-Fi. Reszta szkoły działa.'},
  laptop21: {name: 'Laptop + projektor (sala 21)', icon: 'projector', kind: 'end', does: 'Laptop nauczyciela w sali 21 łączy się przez Wi-Fi 2. piętra. Projektor dostaje obraz kablem HDMI z laptopa.', fails: 'Bez Wi-Fi laptop nie otworzy materiałów online, ale pokaże na projektorze plik zapisany na dysku.'},
  tablets2: {name: 'Tablety do matematyki (2. p.)', icon: 'phone', kind: 'end', does: 'Tablety szkolne (np. z programu „Cyfrowy Uczeń” — sprzęt szkoły, nie na własność) w Wi-Fi 2. piętra.', fails: 'Bez Wi-Fi nie pobiorą zadań.'},
  nas: {name: 'Serwer / NAS', icon: 'drive', kind: 'end', does: 'Dysk sieciowy: kopie zapasowe pracowni, wspólne foldery i nagrania z kamer.', fails: 'Brak kopii i folderów współdzielonych. Kamery nie mają gdzie nagrywać.'},
  cams: {name: 'Kamery (korytarze)', icon: 'camera', kind: 'end', does: 'Kamery IP zasilane i podłączone kablem sieciowym. Nagrywają na NAS.', fails: 'Bez sieci kamery nie nagrywają.'},
  printer3d: {name: 'Drukarka 3D (Lab. Przyszłości)', icon: 'app', kind: 'end', does: 'Drukarka 3D z programu „Laboratoria Przyszłości”. Nie jest w sieci — model wgrywa się z karty SD lub przez USB.', fails: 'Awarie sieci jej nie dotyczą. Dopóki ma prąd i filament, drukuje.'},
};

/** Układ mapy: warstwy i strefy (kto jest podłączony do czego). */
export const netLayout = {
  top: ['ose', 'cloud'],
  chain: ['router', 'core'],
  zones: [
    {id: 'lab', title: 'Pracownia 14', nodes: ['labsw', 'labpc', 'board']},
    {id: 'staff', title: 'Pokój nauczycielski', nodes: ['teacherpc', 'printer']},
    {id: 'wifi1', title: 'Wi-Fi parter', nodes: ['ap1', 'guest']},
    {id: 'wifi2', title: 'Wi-Fi 2. piętro', nodes: ['ap2', 'laptop21', 'tablets2']},
    {id: 'server', title: 'Serwerownia i korytarze', nodes: ['nas', 'cams']},
  ],
  offline: ['printer3d'],
};

/** Połączenia: dziecko → rodzic (skąd ma sieć). null = poza siecią szkoły. */
export const uplink = {
  cloud: 'ose', router: 'ose', core: 'router', labsw: 'core', labpc: 'labsw', board: 'labsw', teacherpc: 'core', printer: 'core',
  ap1: 'core', guest: 'ap1', ap2: 'core', laptop21: 'ap2', tablets2: 'ap2', nas: 'core', cams: 'core', printer3d: null, ose: null,
};
/** Czy węzeł `id` traci połączenie z siecią szkoły, gdy pada `broken`? (e-dziennik i drukarka 3D nie zależą od sieci szkoły). */
export function losesNetwork(id, broken) {
  if (id === broken || id === 'cloud' || id === 'ose') return false;
  let p = uplink[id];
  while (p) { if (p === broken) return true; p = uplink[p]; }
  return false;
}
/** Droga danych między dwoma urządzeniami w sieci lokalnej (bez wspólnego przodka „w górę”). */
export function pathBetween(a, b) {
  const up = x => { const r = [x]; while (uplink[r[r.length - 1]]) r.push(uplink[r[r.length - 1]]); return r; };
  const pa = up(a), pb = up(b);
  const common = pa.find(x => pb.includes(x));
  return [...pa.slice(0, pa.indexOf(common) + 1), ...pb.slice(0, pb.indexOf(common)).reverse()];
}

export const incidents = [
  {id: 'ap2', broken: 'ap2', title: 'Padł punkt dostępowy na 2. piętrze',
    ask: 'Kliknij urządzenia, które tracą połączenie z siecią.',
    correct: ['laptop21', 'tablets2'],
    why: 'Wi-Fi 2. piętra obsługuje tylko laptop w sali 21 i tablety. Parter i urządzenia na kablu działają normalnie.'},
  {id: 'labsw', broken: 'labsw', title: 'Padł przełącznik w pracowni',
    ask: 'Kliknij urządzenia, które tracą połączenie z siecią.',
    correct: ['labpc', 'board'],
    why: 'Przełącznik pracowni zasila siecią tylko pracownię: 16 komputerów i monitor interaktywny. Reszta szkoły nie zauważy awarii.'},
  {id: 'core', broken: 'core', title: 'Padł przełącznik główny',
    ask: 'Tym razem odwrotnie: kliknij te urządzenia i usługi, które DZIAŁAJĄ DALEJ bez przeszkód.',
    invert: true,
    correct: ['cloud', 'printer3d'],
    why: 'Przełącznik główny łączy całą szkołę, więc prawie wszystko traci sieć. Działa drukarka 3D (nie jest w sieci) i e-dziennik w chmurze (np. z telefonu przez LTE).'},
  {id: 'router', broken: 'router', title: 'Padł router — szkoła bez internetu',
    ask: 'Nauczyciel drukuje test z komputera w pracowni na drukarce w pokoju nauczycielskim. Kliknij elementy, przez które przejdzie wydruk (poza samym komputerem).',
    correct: ['labsw', 'core', 'printer'],
    why: 'Droga: komputer → przełącznik pracowni → przełącznik główny → drukarka. Router nie leży na tej drodze, więc wydruk przejdzie mimo braku internetu. E-dziennik i strony WWW — już nie.'},
];

/** Sprawdza zaznaczenie w incydencie. Zwraca brakujące i nadmiarowe elementy z wyjaśnieniem. */
export function checkIncident(incident, selected = []) {
  const sel = new Set(selected), want = new Set(incident.correct);
  const missing = incident.correct.filter(x => !sel.has(x));
  const extra = [...sel].filter(x => !want.has(x));
  const ok = missing.length === 0 && extra.length === 0;
  const name = id => netNodes[id]?.name || id;
  const notes = [];
  for (const x of extra) {
    if (x === incident.broken) notes.push(`${name(x)} to element, który się zepsuł — nie zaznaczaj go`);
    else if (incident.invert) notes.push(`${name(x)} traci sieć, bo prowadzi do niej droga przez ${name(incident.broken)}`);
    else if (incident.id === 'router') notes.push(`${name(x)} nie leży na drodze komputer → drukarka`);
    else notes.push(`${name(x)} ma połączenie inną drogą`);
  }
  if (missing.length) notes.push(`brakuje ${missing.length} ${missing.length === 1 ? 'elementu' : 'elementów'} — prześledź linie od zepsutego elementu w dół mapy`);
  return {ok, missing, extra, message: ok ? `Dobrze! ${incident.why}` : `Jeszcze nie: ${notes.join('; ')}.`};
}
export const incidentPoints = attempt => (attempt <= 1 ? 1 : 0.5);
export function mapResult(state = {}) {
  const inc = state.incidents || {};
  const solved = incidents.filter(i => inc[i.id]?.solved);
  const score = solved.reduce((s, i) => s + incidentPoints(inc[i.id].solvedAt), 0);
  return {score, max: incidents.length, done: solved.length === incidents.length, solved: solved.length,
    summary: solved.length ? `Awarie sieci przeanalizowane: ${solved.length}/${incidents.length}` : undefined};
}
