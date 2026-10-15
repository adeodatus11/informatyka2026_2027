// Logika symulatora „futureFirm” (lekcja 42): gra strategiczna „Firma 2030”.
// Uczeń prowadzi małą firmę przez 4 lata (2027–2030): kupuje technologie z kart, a potem mierzy się
// ze zdarzeniem roku, które wynika z jego decyzji. Wszystko deterministyczne: stan gry to tylko
// wybrana branża, karty kupione w kolejnych latach i wybrane reakcje — resztę liczy simulate().
// Liczby to uproszczony model małej polskiej firmy (opis założeń: teacherGuide lekcji 42).

export const YEARS = [2027, 2028, 2029, 2030];
export const START = {cash: 10000, clients: 60, security: 35, team: 60};
export const MIN_CASH = -10000;        // limit debetu firmy w banku — niżej kasa nie spada
export const INVEST_SHARE = 0.08;      // co roku na technologie trafia 8% rocznego wyniku
export const SURFACE = 5;              // każdy nowy system bez pakietu bezpieczeństwa: −5 pkt bezpieczeństwa
export const THRESHOLDS = {profitGain: 3000, clients: 75, security: 70, team: 65};
export const EVENT_POINTS = 2;
export const MAX_POINTS = YEARS.length * EVENT_POINTS + 4;
export const QUALITY_POINTS = {best: 2, ok: 1, bad: 0};
export const QUALITY_LABEL = {best: 'Najlepsza reakcja', ok: 'Reakcja do przyjęcia', bad: 'Kosztowna reakcja'};

export const fmt = (x, d = 0) => Number(x).toLocaleString('pl-PL', {minimumFractionDigits: d, maximumFractionDigits: d});
export const signed = x => (x > 0 ? '+' : x < 0 ? '−' : '±') + fmt(Math.abs(x));
const clamp = (x, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, x));
const r100 = x => Math.round(x / 100) * 100;

export const AREAS = {
  firma: 'Rozwój firmy',
  praca: 'Praca',
  bezpieczenstwo: 'Bezpieczeństwo',
  wykluczenie: 'Włączenie i wykluczenie',
  dobrostan: 'Zdrowie, dobrostan i środowisko',
  prawo: 'Prawo',
};
export const LENSES = [
  {id: 'owner', name: 'właściciela', short: 'Właściciel', focus: 'pieniądze i decyzja'},
  {id: 'it', name: 'informatyka', short: 'Informatyk', focus: 'technologia i bezpieczeństwo'},
  {id: 'people', name: 'klientów i pracowników', short: 'Ludzie', focus: 'klienci i zespół'},
];
export const STATS = [
  {id: 'profit', label: 'Wynik finansowy', unit: 'zł/mies.'},
  {id: 'clients', label: 'Zadowolenie klientów', unit: '%'},
  {id: 'security', label: 'Bezpieczeństwo danych', unit: '%'},
  {id: 'team', label: 'Zespół', unit: '%'},
];

/* ───────── Branże ───────── */
export const industries = {
  pizzeria: {id: 'pizzeria', short: 'Pizzeria', name: 'Pizzeria „Pod Piecem”', icon: 'energy', staff: 6, profit: 9000, seniors: 0.15,
    who: 'Uczniowie z pobliskiej szkoły, rodziny z osiedla, trochę emerytów na obiad.', twist: 'Dużo zamówień przez telefon i marnowanie składników.'},
  warsztat: {id: 'warsztat', short: 'Warsztat', name: 'Auto-Serwis „Tłok”', icon: 'settings', staff: 5, profit: 12000, seniors: 0.3,
    who: 'Kierowcy z okolicy, dwie firmy z flotą aut, sporo starszych kierowców.', twist: 'Klienci dzwonią „czy auto gotowe?”, a części zamawia się w biegu.'},
  salon: {id: 'salon', short: 'Salon', name: 'Salon fryzjerski „Grzywka”', icon: 'palette', staff: 4, profit: 7000, seniors: 0.4,
    who: 'Stałe klientki i klienci, wielu seniorów, uczniowie przed studniówką.', twist: 'Klienci nie przychodzą na umówione terminy, a połowa to seniorzy.'},
};
export const industryIds = Object.keys(industries);
export const baseStats = ind => ({profit: industries[ind].profit, clients: START.clients, security: START.security, team: START.team, staff: industries[ind].staff});

/* ───────── Karty technologii ───────── */
// fx: zmiana wskaźników po wdrożeniu (profit już po odjęciu abonamentu). byInd: różnice między branżami.
// chance — szansa (zawsze widoczna). risk — ryzyko (visible:false = ukryte do raportu).
export const DIGITAL = ['online', 'chatbot', 'payments', 'kiosk', 'monitoring', 'sensors'];
export const cards = [
  {id: 'security', icon: 'shield', name: 'Pakiet bezpieczeństwa', cost: 2500, monthly: 150,
    what: '2FA na wszystkich kontach, kopie zapasowe 3-2-1, automatyczne aktualizacje, menedżer haseł i godzina szkolenia z phishingu.',
    fx: {profit: -150, security: 45},
    chance: {area: 'bezpieczenstwo', text: 'Atak nie zatrzymuje firmy: są kopie, 2FA i ludzie, którzy rozpoznają podróbkę.'},
    risk: {area: 'firma', visible: true, text: 'Nie zarabia ani złotówki — jego wartość widać dopiero, gdy coś się stanie.'},
    hints: {owner: 'Ile kosztowałby tydzień zamknięcia firmy? Porównaj to z 2 500 zł.', it: 'Kupuj to przed innymi systemami — każdy nowy system to kolejne drzwi do pilnowania.', people: 'Kopie zapasowe chronią też dane klientów, za które firma odpowiada.'}},
  {id: 'online', icon: 'globe', name: 'Zamówienia online', cost: 3000, monthly: 200,
    byInd: {pizzeria: {name: 'Zamówienia online z dowozem', fx: {profit: 2000}}, warsztat: {name: 'Rezerwacja terminów online + SMS „auto gotowe”', fx: {profit: 1200}}, salon: {name: 'Rezerwacje online + przypomnienia SMS', fx: {profit: 1500}}},
    what: 'Strona z formularzem i panel dla obsługi. Klient zamawia lub rezerwuje o każdej porze.',
    fx: {profit: 1500, clients: 8, team: 3},
    chance: {area: 'praca', text: 'Mniej odbierania telefonów, więcej zamówień i terminów — także o 23:00.'},
    risk: {area: 'prawo', visible: false, text: 'Powstaje baza danych klientów (imiona, telefony, adresy). Za jej ochronę odpowiada firma (RODO).'},
    hints: {owner: 'Zwraca się szybko — ale kto będzie pilnował bazy klientów?', it: 'Formularz zbiera dane osobowe: zapytaj, gdzie leżą i kto ma do nich hasło.', people: 'Większość klientów woli zamawiać z telefonu; część nadal zadzwoni.'}},
  {id: 'chatbot', icon: 'app', name: 'Chatbot AI na stronie i w komunikatorze', cost: 2000, monthly: 300,
    what: 'Odpowiada klientom na pytania o godziny, ceny i wolne terminy. Działa na modelu językowym.',
    fx: {profit: 700, clients: 4, team: 5},
    chance: {area: 'praca', text: 'Odpowiada 24/7 na powtarzalne pytania, zespół ma czas na klientów na miejscu.'},
    risk: {area: 'prawo', visible: false, text: 'AI potrafi zmyślać (halucynacje), a klient musi wiedzieć, że pisze z botem (AI Act).'},
    hints: {owner: 'Kto odpowiada, gdy bot obieca coś, czego nie ma w cenniku? Firma.', it: 'Model językowy brzmi pewnie także wtedy, gdy się myli. Co bot wie o cenach?', people: 'Czy klient wie, że pisze z maszyną, i jak dojdzie do człowieka?'}},
  {id: 'payments', icon: 'nfc', name: 'Płatności zbliżeniowe, BLIK i telefonem', cost: 600, monthly: 120,
    what: 'Nowy terminal płatniczy i płatność BLIK-iem. Abonament i prowizja od transakcji wliczone.',
    fx: {profit: 700, clients: 6},
    chance: {area: 'wykluczenie', text: 'Zapłaci każdy: kartą, telefonem, BLIK-iem — także turyści i młodzi bez gotówki.'},
    risk: {area: 'bezpieczenstwo', visible: true, text: 'Bez internetu terminal stoi — potrzebny plan awaryjny.'},
    hints: {owner: 'Tani start, a klienci bez gotówki przestaną wychodzić z pustymi rękami.', it: 'Terminal potrzebuje internetu. Co, gdy łącze padnie w piątek wieczorem?', people: 'Zostaw też gotówkę — nie każdy płaci telefonem.'}},
  {id: 'kiosk', icon: 'desktop', name: 'Kiosk samoobsługowy', cost: 10000, monthly: 300,
    byInd: {pizzeria: {name: 'Kiosk samoobsługowy do zamówień'}, warsztat: {name: 'Kiosk do przyjęcia auta i odbioru kluczy'}, salon: {name: 'Kiosk do meldowania się i płatności'}},
    what: 'Ekran dotykowy przy wejściu. Zastępuje jedną osobę przy ladzie.',
    fx: {profit: 2500, clients: 3, team: -15, staff: -1},
    chance: {area: 'firma', text: 'Krótsze kolejki i jedna pensja mniej do wypłacenia co miesiąc.'},
    risk: {area: 'wykluczenie', visible: false, text: 'Część klientów — zwłaszcza starszych — nie poradzi sobie z ekranem. Jedna osoba traci pracę.'},
    hints: {owner: 'Najwyższy zysk w talii. Kto z Twoich klientów nie lubi ekranów?', it: 'Kolejne urządzenie w sieci — trzeba je aktualizować.', people: 'Ilu Twoich klientów to seniorzy? Kto z zespołu straci pracę?'}},
  {id: 'monitoring', icon: 'camera', name: 'Monitoring z AI', cost: 4000, monthly: 200,
    what: 'Kamery z analizą obrazu: liczą klientów, wykrywają kradzieże i „mierzą tempo pracy” pracowników.',
    fx: {profit: 400, security: 5, team: -20},
    chance: {area: 'bezpieczenstwo', text: 'Mniej kradzieży, nagranie przy sporze z klientem.'},
    risk: {area: 'prawo', visible: false, text: 'Pracownicy czują się śledzeni. Monitoring pracowników ma granice w prawie (np. nie w szatni, informacja z wyprzedzeniem).'},
    hints: {owner: '400 zł miesięcznie zysku — czy warto, jeśli ludzie zaczną odchodzić?', it: 'Nagrania to dane osobowe: kto je ogląda, jak długo leżą?', people: 'Jak byś się czuł, gdyby kamera liczyła Twoje przerwy?'}},
  {id: 'social', icon: 'group', name: 'Media społecznościowe i płatna reklama', cost: 1500, monthly: 600,
    what: 'Profil firmy, reklama na okolicę, promocje i odpowiedzi na opinie.',
    fx: {profit: 1100, clients: 6},
    chance: {area: 'firma', text: 'Nowi klienci z okolicy — promocję widzi kilka tysięcy osób.'},
    risk: {area: 'dobrostan', visible: false, text: 'Hejt i fałszywe opinie trafiają prosto do Ciebie i zespołu.'},
    hints: {owner: 'Reklama kosztuje co miesiąc — ale klienci przychodzą od razu.', it: '2FA na koncie firmy, bo przejęty profil to katastrofa wizerunkowa.', people: 'Kto będzie odpowiadał na komentarze i jak, gdy zrobi się nieprzyjemnie?'}},
  {id: 'sensors', icon: 'energy', name: 'Czujniki i automatyczne zamówienia', cost: 3500, monthly: 100,
    byInd: {pizzeria: {what: 'Czujniki w chłodniach i system, który sam zamawia składniki według sprzedaży.', fx: {profit: 1200}},
      warsztat: {what: 'Magazyn części z czytnikiem kodów — system sam zamawia klocki, filtry i oleje.', fx: {profit: 800}},
      salon: {what: 'Licznik zużycia farb i kosmetyków — system zamawia, zanim czegoś zabraknie.', fx: {profit: 500}}},
    what: 'Czujniki i system, który sam zamawia towar, zanim go zabraknie.',
    fx: {profit: 800, clients: 3, team: 5},
    chance: {area: 'dobrostan', text: 'Mniej marnowania (jedzenia, części, kosmetyków) i mniej ręcznego liczenia.'},
    risk: {area: 'bezpieczenstwo', visible: false, text: 'Kolejne urządzenia w sieci; bez internetu zamówienia stają.'},
    hints: {owner: 'Mniej wyrzucanego towaru to czysty zysk co miesiąc.', it: 'Czujniki to małe komputery: zmień fabryczne hasła i aktualizuj.', people: 'Zespół nie liczy ręcznie zapasów po zamknięciu.'}},
  {id: 'aiTraining', icon: 'school', name: 'Szkolenie zespołu z AI', cost: 1200, monthly: 0,
    what: '4 godziny warsztatu: jak sprawdzać odpowiedzi AI, czego nie wpisywać do czatu (dane klientów), jak pisać polecenia.',
    fx: {profit: 300, security: 5, team: 15},
    chance: {area: 'praca', text: 'Zespół pracuje szybciej i nie boi się nowych narzędzi — to umiejętność cenna na rynku pracy.'},
    risk: {area: 'praca', visible: true, text: 'Zabiera dzień pracy; działa tylko, gdy zasady stosuje się potem na co dzień.'},
    hints: {owner: 'Najtańsza karta, a zespół i bezpieczeństwo idą w górę.', it: 'Ludzie, którzy wiedzą, czego nie wklejać do czatu, to najlepsza ochrona danych.', people: 'Kto boi się AI, uczy się go używać — zamiast bać się utraty pracy.'}},
];
const cardById = Object.fromEntries(cards.map(c => [c.id, c]));
export function cardFor(id, ind) {
  const c = cardById[id]; if (!c) return null;
  const o = (c.byInd && c.byInd[ind]) || {};
  return {...c, ...o, fx: {...c.fx, ...(o.fx || {})}};
}

/* ───────── Zdarzenia roku ───────── */
// cond(ctx) — kiedy zdarzenie może wystąpić; triggers — karty, z których wynika (ustala pierwszeństwo:
// karta kupiona w tym roku > karta kupiona wcześniej > zdarzenie ogólne). protect — karta łagodząca skutki.
// Każde zdarzenie ma 3 reakcje: best (2 pkt), ok (1 pkt), bad (0 pkt); pozycja „best” różni się między zdarzeniami.
const has = (ctx, id) => ctx.owned[id] !== undefined;
export const events = [
  {id: 'ransomware', area: 'bezpieczenstwo', title: 'Ransomware: wszystkie pliki zaszyfrowane',
    text: () => 'W poniedziałek rano na ekranie: „Twoje pliki są zaszyfrowane. Zapłać 20 000 zł w kryptowalucie”. Nie działa system zamówień ani lista klientów. Kopii zapasowej brak.',
    triggers: DIGITAL, cond: ctx => !has(ctx, 'security') && DIGITAL.filter(id => has(ctx, id)).length >= 2,
    impact: () => ({cash: -6000, clients: -8, security: -10}), impactNote: 'Trzy dni przestoju.',
    hints: {owner: 'Zapłata okupu nie daje gwarancji odzyskania danych.', it: 'Najpierw odłączyć sprzęt od sieci, żeby atak się nie rozlał.', people: 'Zaszyfrowano dane klientów — czy to tylko nasz problem?'},
    options: [
      {q: 'ok', text: 'Wzywamy informatyka, wyłączamy komputery i stawiamy system od nowa. Nikomu nic nie zgłaszamy, „żeby nie robić szumu”.', fx: {cash: -3000, security: 10},
        feedback: 'Firma wróciła do pracy, ale atak dotknął danych klientów — to naruszenie, które trzeba zgłosić do UODO w ciągu 72 godzin. Zgłoszenie do CERT Polska pomaga też innym firmom.'},
      {q: 'bad', text: 'Płacimy okup — oby oddali dane.', fx: {cash: -20000, security: -5, clients: -3},
        feedback: 'Nie ma gwarancji odzyskania danych, a firma, która płaci, staje się celem kolejnych ataków. Pieniądze trafiają do przestępców.'},
      {q: 'best', text: 'Odłączamy sprzęt od sieci, nie płacimy, zgłaszamy incydent do CERT Polska (incydent.cert.pl), a ponieważ ucierpiały dane klientów — do UODO w 72 h. System stawiamy od nowa i od dziś robimy kopie.', fx: {cash: -3500, security: 20, clients: 3},
        feedback: 'Wzorowo: izolacja, zgłoszenia i odbudowa. Klienci doceniają szczerość. Następnym razem kopia 3-2-1 skróci przestój do godzin.'},
    ]},
  {id: 'leak', area: 'prawo', title: 'Wyciek danych klientów',
    text: () => 'Na forum ktoś wystawił listę 2 300 Waszych klientów: imiona, telefony, adresy. Hasło do panelu zamówień brzmiało „Firma2027” i nie było 2FA.',
    triggers: ['online'], cond: ctx => has(ctx, 'online') && ctx.stats.security < 60,
    impact: () => ({clients: -12, security: -5}),
    hints: {owner: 'Ukrywanie wycieku kosztuje więcej niż przyznanie się.', it: 'Zmiana haseł i 2FA zamykają drzwi, ale nie cofają wycieku.', people: 'Klienci muszą wiedzieć, że ktoś może do nich dzwonić „z firmy”.'},
    options: [
      {q: 'bad', text: 'Udajemy, że nic się nie stało — może nikt się nie dowie.', fx: {clients: -10, cash: -6000},
        feedback: 'Sprawa wyszła w lokalnych mediach. Za niezgłoszenie naruszenia grozi kara, a klienci odbierali telefony od oszustów, nic nie wiedząc.'},
      {q: 'best', text: 'W ciągu 72 h zgłaszamy naruszenie do UODO, informujemy klientów, co wyciekło i na co uważać, zmieniamy hasła i włączamy 2FA.', fx: {cash: -1500, clients: 8, security: 15},
        feedback: 'Tak wygląda odpowiedzialna firma: zgłoszenie w terminie, ostrzeżenie klientów i zamknięcie dziury. Część klientów napisała, że docenia uczciwość.'},
      {q: 'ok', text: 'Zmieniamy hasła, włączamy 2FA i piszemy do klientów. UODO nie zgłaszamy — „to mała firma”.', fx: {cash: -500, clients: 3, security: 10},
        feedback: 'Dziurę zamknięto, klienci wiedzą. Ale wielkość firmy nie zwalnia z obowiązku: naruszenie danych zgłasza się do UODO w 72 h.'},
    ]},
  {id: 'exclusion', area: 'wykluczenie', title: 'Seniorzy nie radzą sobie z kioskiem',
    text: ctx => `Pan Zenon (78 lat) od ${ctx.ind === 'warsztat' ? '20' : '10'} lat jest Waszym klientem. Dziś stał 5 minut przy kiosku i wyszedł. Jego sąsiadki też przestały przychodzić — „bo tam już nie ma z kim porozmawiać”.`,
    triggers: ['kiosk'], cond: ctx => has(ctx, 'kiosk'),
    impact: ctx => ({clients: -Math.round(industries[ctx.ind].seniors * 40), profit: -r100(industries[ctx.ind].seniors * 4000)}),
    impactNote: 'Im więcej starszych klientów, tym większa strata.',
    hints: {owner: 'Ilu klientów odchodzi i ile zostawiali co miesiąc?', it: 'Da się zrobić tryb z dużymi literami i mniejszą liczbą kroków.', people: 'Technologia ma włączać ludzi, a nie wypychać ich za drzwi.'},
    options: [
      {q: 'best', text: 'Kiosk zostaje, ale przy ladzie zawsze jest człowiek. Kiosk dostaje tryb dla seniora (duże litery, mniej kroków), a w godzinach szczytu ktoś pomaga przy ekranie.', fx: ctx => ({profit: r100(industries[ctx.ind].seniors * 4000) - 500, clients: Math.round(industries[ctx.ind].seniors * 40) + 2, team: 8}),
        feedback: 'Seniorzy wrócili, a młodsi dalej korzystają z kiosku. Kosztuje to część oszczędności, ale firma nie traci klientów.'},
      {q: 'bad', text: 'Tylko kiosk — „kto nie umie, niech się nauczy”.', fx: {clients: -5, profit: -300},
        feedback: 'Odeszli kolejni klienci, a ich rodziny opisały sprawę w sieci. Wykluczenie cyfrowe to realny problem — w Polsce wiele dorosłych osób nie ma nawet podstawowych umiejętności cyfrowych.'},
      {q: 'ok', text: 'Wieszamy instrukcję obrazkową przy kiosku.', fx: ctx => ({clients: Math.round(industries[ctx.ind].seniors * 15)}),
        feedback: 'Części osób to pomogło, ale instrukcja nie zastąpi człowieka, który pomoże i porozmawia.'},
    ]},
  {id: 'hallucination', area: 'prawo', title: 'Chatbot obiecał coś, czego nie ma',
    text: ctx => ({pizzeria: 'Chatbot napisał klientowi, że „każda druga pizza do końca roku gratis”. Klient ma zrzut ekranu i przyszedł z kolegami.',
      warsztat: 'Chatbot potwierdził klientce „darmową wymianę klocków w ramach gwarancji”. Takiej gwarancji nie ma.',
      salon: 'Chatbot zaproponował klientce „koloryzację za 50 zł”. Cennik mówi 280 zł.'})[ctx.ind],
    triggers: ['chatbot'], cond: ctx => has(ctx, 'chatbot') && !has(ctx, 'aiTraining'),
    impact: () => ({clients: -4}),
    hints: {owner: 'Klient ma zrzut ekranu — to Wasz bot, Wasza odpowiedzialność.', it: 'Model językowy nie zna cennika, dopóki go nie dostanie. Zmyśla pewnym tonem.', people: 'Klient nie musi wiedzieć, jak działa AI. Wie, co mu obiecano.'},
    options: [
      {q: 'ok', text: 'Wyłączamy chatbota na stałe i wracamy do telefonów.', fx: {profit: -700, team: -5, clients: 2},
        feedback: 'Problem zniknął, ale razem z korzyściami bota. Lepiej naprawić narzędzie i nauczyć ludzi je kontrolować.'},
      {q: 'best', text: 'Przepraszamy i dotrzymujemy tej jednej obietnicy. Bot dostaje cennik i zasady, a pytania o ceny i promocje przekazuje człowiekowi. Zespół uczy się sprawdzać, co bot pisze.', fx: {cash: -800, clients: 8, team: 3},
        feedback: 'Koszt jednej obietnicy jest mały, a klient zostaje. Za to, co pisze firmowy chatbot, odpowiada firma — były już takie wyroki.'},
      {q: 'bad', text: 'Odpisujemy: „To błąd systemu, nic nie obowiązuje”.', fx: {clients: -12, cash: -1500},
        feedback: 'Klient opisał sprawę w sieci i zapowiedział skargę. Firma nie może zrzucić winy na „system”, który sama wdrożyła.'},
    ]},
  {id: 'monitoring', area: 'prawo', title: 'Pracownicy kontra kamery z AI',
    text: () => 'Kamery nagrywają też zaplecze i szatnię, a system co tydzień drukuje ranking „najwolniejszych” pracowników. Dwie osoby mówią, że odejdą, jeśli to się nie zmieni.',
    triggers: ['monitoring'], cond: ctx => has(ctx, 'monitoring'),
    impact: () => ({team: -10}),
    hints: {owner: 'Rekrutacja i wdrożenie nowej osoby kosztują więcej niż kamera.', it: 'Nagrania to dane osobowe — po co je zbieramy i jak długo trzymamy?', people: 'Monitoring nie może naruszać godności: szatnia i pokój socjalny to nie miejsce na kamerę.'},
    options: [
      {q: 'best', text: 'Wyłączamy kamery w szatni i na zapleczu, rezygnujemy z rankingu tempa pracy i informujemy zespół na piśmie, po co i gdzie jest monitoring.', fx: {team: 15, profit: -100},
        feedback: 'Monitoring zostaje tam, gdzie chroni (sala, kasa), a ludzie wiedzą, co jest nagrywane. Prawo pracy wymaga celu, informacji i granic.'},
      {q: 'ok', text: 'Kamery zostają tylko na sali i przy kasie, ale ranking tempa pracy zostaje.', fx: {team: 5},
        feedback: 'Szatnia już bez kamer — dobrze. Ale ranking tworzony przez AI nadal stresuje zespół i psuje atmosferę.'},
      {q: 'bad', text: '„Kto nie ma nic do ukrycia, nie ma się czego bać”.', fx: {team: -15, cash: -3000},
        feedback: 'Dwie osoby odeszły, rekrutacja kosztowała 3 000 zł, a sprawą zainteresowała się inspekcja pracy.'},
    ]},
  {id: 'aiAct', area: 'prawo', title: '„Czy ja piszę z człowiekiem?”',
    text: () => 'Klientka pyta w czacie: „Czy rozmawiam z człowiekiem?”. Bot odpisuje: „Tak, jestem Kasia :)”. Klientka pisze, że czuje się oszukana.',
    triggers: ['chatbot'], cond: ctx => has(ctx, 'chatbot'),
    impact: () => ({clients: -3}),
    hints: {owner: 'Udawanie człowieka może się skończyć skargą.', it: 'Wystarczy zmienić pierwszą wiadomość bota i jego instrukcję.', people: 'Klient ma prawo wiedzieć, że rozmawia z maszyną.'},
    options: [
      {q: 'ok', text: 'Dopisujemy w regulaminie na stronie, że korzystamy z AI.', fx: {clients: 1},
        feedback: 'Lepiej niż nic, ale regulaminu prawie nikt nie czyta. Informacja ma się pojawić w rozmowie, od razu.'},
      {q: 'bad', text: 'Zostawiamy „Kasię” — klienci wolą rozmawiać z człowiekiem.', fx: {clients: -8, cash: -2000},
        feedback: 'Udawanie człowieka łamie zasadę przejrzystości z AI Act i niszczy zaufanie. Klientka złożyła skargę.'},
      {q: 'best', text: 'Bot na starcie pisze: „Jestem asystentem AI. W każdej chwili możesz poprosić o człowieka”.', fx: {clients: 4},
        feedback: 'Tak wymaga AI Act: osoba ma wiedzieć, że rozmawia z AI. A przycisk „człowiek” rozwiązuje trudniejsze sprawy.'},
    ]},
  {id: 'phishing', area: 'bezpieczenstwo', title: 'Pilna faktura od „dostawcy”',
    text: () => 'E-mail od „dostawcy systemu”: „Zaległa faktura 4 860 zł. Zapłać w 24 h przez link, inaczej wyłączymy usługę”. Adres nadawcy różni się jedną literą.',
    triggers: ['payments', 'online'], cond: () => true, protect: 'security',
    impact: () => ({security: -5}), protectedImpact: () => ({}),
    protectNote: 'Po szkoleniu z pakietu bezpieczeństwa pracownik od razu zauważył podejrzany adres.',
    hints: {owner: 'Presja czasu i groźba to klasyczny znak oszustwa.', it: 'Sprawdź adres nadawcy i link — nie klikaj, tylko porównaj z umową.', people: 'Kto w firmie płaci faktury i czy wie, jak wygląda podróbka?'},
    options: [
      {q: 'best', text: 'Nie klikamy. Dzwonimy do dostawcy na numer z umowy, a e-mail zgłaszamy do CERT Polska (incydent.cert.pl).', fx: {security: 5},
        feedback: 'Dostawca potwierdził: to oszustwo. Zgłoszenie pomaga zablokować stronę, zanim nabierze się ktoś inny.'},
      {q: 'ok', text: 'Nie płacimy i kasujemy e-mail.', fx: {},
        feedback: 'Pieniądze bezpieczne. Ale bez zgłoszenia oszust próbuje dalej — u Was i u sąsiadów.'},
      {q: 'bad', text: 'Płacimy przez link — nie chcemy, żeby wyłączyli system.', fx: {cash: -4860, security: -10},
        feedback: 'Pieniądze poszły do oszusta, a strona „płatności” zebrała dane karty. Zawsze sprawdzaj fakturę innym kanałem niż ten, którym przyszła.'},
    ]},
  {id: 'aiPaste', area: 'prawo', title: 'Lista klientów w darmowym czacie AI',
    text: () => 'Pracownica wkleiła do darmowego czatu AI listę 300 klientów z telefonami, żeby „ładnie sformatować SMS-y z promocją”.',
    triggers: ['chatbot'], cond: () => true, protect: 'aiTraining',
    impact: () => ({security: -8}), protectedImpact: () => ({security: -2}),
    protectNote: 'Po szkoleniu z AI wkleiła tylko część listy i od razu zapytała, czy dobrze robi.',
    hints: {owner: 'Zakaz wszystkiego spowolni pracę. Potrzebna jasna zasada.', it: 'Darmowe czaty mogą wykorzystywać wpisane treści. Dane osobowe nie powinny tam trafiać.', people: 'Klienci nie zgadzali się, żeby ich numery trafiały do zewnętrznej firmy.'},
    options: [
      {q: 'bad', text: 'Nic się nie stało — przecież AI nikomu nie powie.', fx: {security: -10},
        feedback: 'Dane klientów trafiły do zewnętrznej usługi bez podstawy prawnej. Nawyk zostaje — i następnym razem wkleją coś gorszego.'},
      {q: 'ok', text: 'Zakazujemy AI w firmie całkowicie.', fx: {team: -5, profit: -200},
        feedback: 'Ryzyko mniejsze, ale zespół pracuje wolniej i część osób i tak korzysta „po cichu”. Lepiej zasady niż zakaz.'},
      {q: 'best', text: 'Zasada: do czatu AI żadnych danych osobowych. Dane zastępujemy np. „[imię]”, a firmowe narzędzie AI wybieramy z umową o ochronie danych. Krótko szkolimy wszystkich.', fx: {security: 10, team: 3},
        feedback: 'AI zostaje jako pomoc, dane zostają w firmie. Jasna, prosta zasada działa lepiej niż zakaz.'},
    ]},
  {id: 'outage', area: 'bezpieczenstwo', title: 'Awaria internetu w piątek wieczorem',
    text: ctx => `Koparka zerwała światłowód: internet nie działa przez 6 godzin, w najlepszym czasie tygodnia. ${dependency(ctx) ? `Stoją: ${dependencyNames(ctx)}.` : 'Na szczęście prawie nic w firmie nie zależy od sieci.'}`,
    triggers: ['online', 'payments', 'kiosk', 'sensors', 'chatbot'], cond: () => true,
    impact: ctx => ({cash: -(400 + 600 * dependency(ctx))}), impactNote: 'Im więcej systemów zależy od internetu, tym większa strata.',
    hints: {owner: 'Ile tracimy za każdą godzinę bez sprzedaży?', it: 'Zapasowe łącze (np. router LTE) kosztuje mniej niż jeden taki wieczór.', people: 'Klienci przyszli — jak ich obsłużyć bez sieci?'},
    options: [
      {q: 'ok', text: 'Wywieszamy kartkę „Tylko gotówka” i czekamy.', fx: {clients: -4},
        feedback: 'Część klientów zapłaciła gotówką, część poszła gdzie indziej. Brakuje planu awaryjnego.'},
      {q: 'bad', text: 'Zamykamy firmę do końca dnia.', fx: {cash: -2500, clients: -6},
        feedback: 'Najdroższe wyjście: zero sprzedaży i rozczarowani klienci.'},
      {q: 'best', text: 'Plan awaryjny: internet z telefonu dla terminala, zamówienia przez telefon, ceny na kartce. Po awarii dokupujemy zapasowe łącze LTE.', fx: {cash: -300, clients: 3},
        feedback: 'Firma działała dalej. Im bardziej zależysz od technologii, tym bardziej potrzebujesz planu B.'},
    ]},
  {id: 'fakeReviews', area: 'dobrostan', title: 'Fala fałszywych opinii i hejtu',
    text: () => 'W jedną noc 30 jednogwiazdkowych opinii z nowych kont bez zdjęć. Pod reklamą komentarze „trucizna”, „oszuści”. Właścicielka nie śpi drugą noc.',
    triggers: ['social'], cond: () => true,
    impact: ctx => ({clients: has(ctx, 'social') ? -8 : -5, team: -3}),
    hints: {owner: 'Kupowanie opinii to nieuczciwa praktyka i ryzyko kary.', it: 'Zrób zrzuty ekranu i zgłoś konta platformie — konta bez historii są podejrzane.', people: 'Hejt boli ludzi w zespole. Nie odpowiadajcie w emocjach.'},
    options: [
      {q: 'bad', text: 'Kupujemy 50 pozytywnych opinii od „agencji”.', fx: {clients: -10, cash: -2000},
        feedback: 'Platforma usunęła kupione opinie i oznaczyła profil. Fałszywe opinie wprowadzają klientów w błąd — to nieuczciwa praktyka.'},
      {q: 'best', text: 'Robimy zrzuty ekranu, zgłaszamy fałszywe opinie i konta do platformy, a na prawdziwe uwagi odpowiadamy spokojnie i rzeczowo. Zespół dostaje wolny wieczór od komentarzy.', fx: {clients: 10, team: 3},
        feedback: 'Fałszywe opinie zniknęły po zgłoszeniu, a spokojne odpowiedzi przekonały nowych klientów. Dbanie o ludzi w zespole to też część reakcji.'},
      {q: 'ok', text: 'Usuwamy komentarze, blokujemy komentujących i nic nie piszemy.', fx: {clients: 2},
        feedback: 'Najgorsze komentarze zniknęły, ale opinie zostały, a milczenie wygląda jak przyznanie się.'},
    ]},
];
const eventById = Object.fromEntries(events.map(e => [e.id, e]));
export const eventFor = id => eventById[id] || null;
export const dependency = ctx => ['online', 'payments', 'kiosk', 'sensors', 'chatbot'].filter(id => has(ctx, id)).length;
export const dependencyNames = ctx => ['online', 'payments', 'kiosk', 'sensors', 'chatbot'].filter(id => has(ctx, id)).map(id => cardFor(id, ctx.ind).name.toLowerCase()).join(', ');
const val = (f, ctx) => (typeof f === 'function' ? f(ctx) : f) || {};

/** Zdarzenie roku: najpierw skutki kart kupionych w tym roku, potem wcześniejszych, na końcu zdarzenia ogólne. */
export function pickEvent(ctx, used = []) {
  let best = null, bestTier = 9;
  for (const e of events) {
    if (used.includes(e.id) || !e.cond(ctx)) continue;
    const tier = e.triggers.some(id => ctx.owned[id] === ctx.year) ? 0 : e.triggers.some(id => has(ctx, id)) ? 1 : 2;
    if (tier < bestTier) { best = e; bestTier = tier; }
  }
  return best;
}
export function eventImpact(e, ctx) {
  const prot = e.protect && has(ctx, e.protect);
  return {fx: prot ? val(e.protectedImpact, ctx) : val(e.impact, ctx), protected: !!prot};
}
export const optionFx = (opt, ctx) => val(opt.fx, ctx);

/* ───────── Przebieg gry ───────── */
export const newGame = ind => ({ind, years: [{cart: [], confirmed: false, reaction: null}]});

function applyFx(stats, fx, log) {
  const s = {...stats};
  for (const [k, v] of Object.entries(fx || {})) {
    if (!v) continue;
    if (k === 'cash') s.cash = Math.max(MIN_CASH, s.cash + v);
    else if (k === 'profit') s.profit = Math.max(0, s.profit + v);
    else if (k === 'staff') s.staff = Math.max(1, s.staff + v);
    else s[k] = clamp(s[k] + v);
    if (log) log.push([k, v]);
  }
  return s;
}
export const cartOrder = cart => cards.map(c => c.id).filter(id => cart.includes(id));
export const cartCost = (cart, ind) => cart.reduce((s, id) => s + cardFor(id, ind).cost, 0);
export const yearInflow = profit => r100(profit * 12 * INVEST_SHARE);

/** Odtwarza całą grę z decyzji. Zwraca stan bieżący, historię lat i punkty. */
export function simulate(game) {
  if (!game || !industries[game.ind]) return null;
  const ind = game.ind;
  let stats = {...baseStats(ind), cash: START.cash};
  const owned = {}, used = [], history = [];
  const snapshots = [{label: 'Start', ...stats}];
  let phase = 'shop', points = 0;
  const yrs = (game.years || []).slice(0, YEARS.length);
  yrs.forEach((y, i) => {
    const rec = {year: YEARS[i], index: i, start: {...stats}, bought: [], cart: cartOrder(y.cart || []), confirmed: !!y.confirmed};
    history.push(rec);
    if (!y.confirmed) { phase = 'shop'; return; }
    for (const id of rec.cart) {
      const c = cardFor(id, ind);
      if (owned[id] !== undefined || c.cost > stats.cash) continue;   // zakup niemożliwy — pomijamy (stan z zewnątrz)
      const log = [];
      stats = applyFx(stats, {cash: -c.cost}, null);
      stats = applyFx(stats, c.fx, log);
      if (DIGITAL.includes(id) && owned.security === undefined) stats = applyFx(stats, {security: -SURFACE}, log);
      owned[id] = i;
      rec.bought.push({id, fx: log});
    }
    rec.afterShop = {...stats};
    const ctx = {ind, owned: {...owned}, year: i, stats};
    const e = pickEvent(ctx, used);
    used.push(e.id);
    const imp = eventImpact(e, ctx);
    rec.event = e.id; rec.eventText = e.text(ctx); rec.impact = []; rec.protected = imp.protected;
    stats = applyFx(stats, imp.fx, rec.impact);
    rec.afterImpact = {...stats};
    if (y.reaction === null || y.reaction === undefined || !e.options[y.reaction]) { phase = 'event'; return; }
    const opt = e.options[y.reaction];
    rec.reaction = y.reaction; rec.quality = opt.q; rec.points = QUALITY_POINTS[opt.q]; rec.reactionFx = [];
    points += rec.points;
    stats = applyFx(stats, optionFx(opt, ctx), rec.reactionFx);
    rec.afterReaction = {...stats};
    rec.inflow = yearInflow(stats.profit);
    stats = applyFx(stats, {cash: rec.inflow}, null);
    rec.end = {...stats};
    snapshots.push({label: String(YEARS[i]), ...stats});
    phase = 'outcome';
  });
  const finished = history.length === YEARS.length && history.at(-1).reaction !== undefined;
  const base = industries[ind].profit;
  const goals = [
    {id: 'profit', ok: stats.profit >= base + THRESHOLDS.profitGain, text: `Wynik co najmniej ${fmt(base + THRESHOLDS.profitGain)} zł/mies. (+${fmt(THRESHOLDS.profitGain)} zł)`},
    {id: 'clients', ok: stats.clients >= THRESHOLDS.clients, text: `Klienci co najmniej ${THRESHOLDS.clients}%`},
    {id: 'security', ok: stats.security >= THRESHOLDS.security, text: `Bezpieczeństwo co najmniej ${THRESHOLDS.security}%`},
    {id: 'team', ok: stats.team >= THRESHOLDS.team, text: `Zespół co najmniej ${THRESHOLDS.team}%`},
  ];
  const goalPoints = finished ? goals.filter(g => g.ok).length : 0;
  return {ind, stats, owned, history, snapshots, phase, finished, eventPoints: points, goals, goalPoints,
    points: points + goalPoints, yearIndex: Math.max(0, history.length - 1)};
}

export function canAdd(game, id) {
  const sim = simulate(game); if (!sim) return 'Najpierw wybierz branżę.';
  const y = game.years.at(-1); const c = cardFor(id, game.ind);
  if (!c) return 'Nie ma takiej karty.';
  if (sim.phase !== 'shop') return 'Zakupy w tym roku są zamknięte.';
  if (sim.owned[id] !== undefined) return 'Ta technologia już działa w firmie.';
  if (y.cart.includes(id)) return null;
  const left = sim.stats.cash - cartCost(y.cart, game.ind);
  if (c.cost > left) return `Brakuje ${fmt(c.cost - Math.max(0, left))} zł. Zrezygnuj z czegoś albo poczekaj do przyszłego roku.`;
  return null;
}
const withLast = (game, patch) => ({...game, years: [...game.years.slice(0, -1), {...game.years.at(-1), ...patch}]});
export function toggleCard(game, id) {
  const y = game.years.at(-1);
  if (y.cart.includes(id)) return simulate(game).phase === 'shop' ? withLast(game, {cart: y.cart.filter(x => x !== id)}) : game;
  return canAdd(game, id) ? game : withLast(game, {cart: [...y.cart, id]});
}
export const confirmYear = game => (simulate(game)?.phase === 'shop' ? withLast(game, {confirmed: true}) : game);
export function react(game, optionIndex) {
  const sim = simulate(game);
  if (sim?.phase !== 'event' || ![0, 1, 2].includes(optionIndex)) return game;
  return withLast(game, {reaction: optionIndex});
}
export function nextYear(game) {
  const sim = simulate(game);
  if (sim?.phase !== 'outcome' || sim.finished) return game;
  return {...game, years: [...game.years, {cart: [], confirmed: false, reaction: null}]};
}

/* ───────── Raport ───────── */
// Które zdarzenia „ujawniają” ryzyko danej karty.
export const RISK_EVENTS = {online: ['leak', 'ransomware'], chatbot: ['hallucination', 'aiAct', 'aiPaste'], payments: ['outage'], kiosk: ['exclusion', 'ransomware'], monitoring: ['monitoring'], social: ['fakeReviews'], sensors: ['outage', 'ransomware'], security: [], aiTraining: []};
// Oś czasu: co było szansą, a co zagrożeniem (z obszarem), oraz czy ukryte ryzyko się ujawniło.
export function timeline(sim) {
  if (!sim) return [];
  const happened = new Set(sim.history.map(h => h.event).filter(Boolean));
  return sim.history.map(h => ({
    year: h.year,
    cards: h.bought.map(b => {
      const c = cardFor(b.id, sim.ind);
      const hit = (RISK_EVENTS[b.id] || []).filter(id => happened.has(id));
      return {id: b.id, name: c.name, chance: c.chance, risk: c.risk, revealedBy: hit.map(id => eventFor(id).title)};
    }),
    event: h.event ? {id: h.event, title: eventFor(h.event).title, area: eventFor(h.event).area, quality: h.quality, points: h.points} : null,
  }));
}
export function summaryText(sim) {
  if (!sim) return undefined;
  const s = sim.stats, base = industries[sim.ind].profit;
  return `${industries[sim.ind].short} ${YEARS.at(-1)}: ${fmt(s.profit)} zł/mies. (${signed(s.profit - base)} zł), klienci ${s.clients}%, bezpieczeństwo ${s.security}%, zespół ${s.team}%`;
}

export const REFLECTION_MIN = 20;
/** Wynik do karty: punkty z pierwszej gry; done = gra skończona + odpowiedź metapoznawcza. */
export function futureFirmResult(state = {}) {
  const sim = simulate(state.game);
  const reflected = (state.reflection || '').trim().length >= REFLECTION_MIN;
  return {done: !!sim?.finished && reflected, score: sim ? sim.points : 0, max: MAX_POINTS,
    summary: sim?.finished ? summaryText(sim) : undefined};
}

/** Najlepsza znana strategia (do testów i podpowiedzi dla nauczyciela). */
export const BEST_PLAN = [['security', 'online', 'payments', 'social'], ['chatbot', 'aiTraining', 'sensors'], [], []];
