// Logika symulatora „helpdesk” (lekcja 14): 6 zgłoszeń, pytania diagnostyczne, rozwiązanie, odpowiedź dla zgłaszającego.
// Punkty za zgłoszenie: rozwiązanie 2 (1 po poprawce) + trafne pytania 1 (min. 2 z 3 kluczowych) = 3; razem 18.

export const tickets = [
  {id: '101', icon: 'projector', title: 'Projektor w sali 12: brak sygnału', from: 'Pani Ewa, historia', urgency: 'Pilne — lekcja za 5 min',
    symptom: '„Projektor w 12 pokazuje brak sygnału, a lekcja za 5 minut! Laptop podłączony, wszystko jak zawsze.”',
    reporter: 'Jesteś nauczycielką historii. Laptop podłączyłaś kablem HDMI (przez przejściówkę USB-C → HDMI) do projektora. Na laptopie prezentacja jest otwarta. Projektor świeci na niebiesko: „Brak sygnału — HDMI 1”. Kabel jest wpięty w gniazdo z napisem HDMI 2. Denerwujesz się, bo zaraz lekcja.',
    questions: [
      {q: 'Jaki dokładnie komunikat widać na projektorze?', a: '„Brak sygnału — HDMI 1”, na niebieskim tle.', key: true},
      {q: 'Kiedy ostatnio był aktualizowany Windows?', a: 'Nie mam pojęcia. Czy to teraz ważne?'},
      {q: 'Do którego gniazda w projektorze wpięty jest kabel?', a: 'Przy gnieździe jest napis HDMI 2.', key: true},
      {q: 'Jakiej marki jest laptop?', a: 'Srebrny… marki nie pamiętam.'},
      {q: 'Czy na ekranie laptopa widać prezentację?', a: 'Tak, prezentacja jest otwarta i działa.', key: true},
      {q: 'Czy działa internet?', a: 'Chyba tak, rano sprawdzałam pocztę.'},
    ],
    solutions: [
      {text: 'Przeinstaluj sterownik karty graficznej w laptopie.', why: 'To potrwa kilkanaście minut i nic nie da: laptop wyświetla obraz, a projektor „słucha” innego wejścia.'},
      {text: 'Przełącz źródło w projektorze na HDMI 2 (przycisk Source/Input), a w razie potrzeby na laptopie Win+P → Duplikuj.', ok: true, why: 'Projektor czekał na sygnał z HDMI 1, a kabel jest w HDMI 2. Wybór źródła i Win+P (Tylko ekran komputera / Duplikuj / Rozszerz / Tylko drugi ekran) rozwiązują większość przypadków „brak sygnału”.'},
      {text: 'Wymień projektor na zapasowy z magazynu.', why: 'Projektor działa — przecież wyświetla komunikat. Wymiana to strata czasu.'},
      {text: 'Zrestartuj szkolny router.', why: 'Obraz z laptopa idzie do projektora kablem HDMI, nie przez sieć. Restart routera odetnie internet całej szkole.'},
    ],
    replies: [
      {text: 'Źródło sygnału miało niezgodny kanał wejściowy, a EDID nie wynegocjował trybu.', why: 'Żargon. Pani Ewa nie wie, co zrobić następnym razem.'},
      {text: 'Projektor był ustawiony na inne wejście. Przełączyłem na HDMI 2 — gdyby znów był brak sygnału, przycisk Source na pilocie.', ok: true, why: 'Konkretnie: co było źle, co zrobiłeś i co zrobić następnym razem.'},
      {text: 'Serio? To podstawa, każdy powinien to umieć.', why: 'Protekcjonalnie. Następnym razem ktoś będzie się bał poprosić o pomoc — i problem urośnie.'},
    ]},
  {id: '102', icon: 'board', title: 'Film na monitorze interaktywnym bez dźwięku', from: 'Pan Tomek, biologia', urgency: 'Trwa lekcja',
    symptom: '„Puszczam film na monitorze interaktywnym w pracowni — obraz jest, dźwięku zero.”',
    reporter: 'Uczysz biologii. Laptop jest podłączony kablem HDMI do monitora interaktywnego. Obraz jest. Z monitora nie leci dźwięk, ale z głośniczków laptopa słychać cicho film. Głośność monitora: 40%, bez wyciszenia. Po kliknięciu ikony głośnika w Windows widać urządzenie „Głośniki (Realtek Audio)”.',
    questions: [
      {q: 'Czy film jest w jakości HD?', a: 'Chyba tak, wygląda dobrze.'},
      {q: 'Czy dźwięk słychać z głośników laptopa?', a: 'Tak, cicho z laptopa. Z monitora nic.', key: true},
      {q: 'Czy ktoś zmieniał hasło do Wi-Fi?', a: 'Nic o tym nie wiem.'},
      {q: 'Jakie urządzenie wyjściowe jest wybrane w ustawieniach dźwięku?', a: 'Po kliknięciu ikony głośnika: „Głośniki (Realtek Audio)”.', key: true},
      {q: 'Ile osób jest dziś w klasie?', a: '28. A co to ma do rzeczy?'},
      {q: 'Czy monitor nie jest wyciszony i jaką ma głośność?', a: 'Głośność monitora 40%, bez wyciszenia.', key: true},
    ],
    solutions: [
      {text: 'Podkręć głośność laptopa do 100%.', why: 'Dźwięk dalej leci do głośników laptopa — będzie tylko głośniej przy biurku.'},
      {text: 'Wymień kabel HDMI na nowy.', why: 'Obraz przechodzi, więc kabel działa. HDMI przesyła też dźwięk — problem jest w wyborze urządzenia wyjściowego.'},
      {text: 'Podłącz głośnik Bluetooth z telefonu ucznia.', why: 'Obejście, nie naprawa — i cudzy sprzęt. Jutro problem wróci.'},
      {text: 'W ustawieniach dźwięku Windows zmień urządzenie wyjściowe na monitor (HDMI).', ok: true, why: 'Windows wysyłał dźwięk do wbudowanych głośników. Wyjście „monitor (HDMI)” kieruje dźwięk tam, gdzie jest obraz.'},
    ],
    replies: [
      {text: 'Dźwięk szedł do głośników laptopa. Przestawiłem wyjście na monitor — to się wybiera po kliknięciu ikony głośnika na pasku.', ok: true, why: 'Jasno i z instrukcją na przyszłość.'},
      {text: 'Trzeba było ogarnąć endpoint audio w mikserze, bo sink był na Realteku.', why: 'Żargon. Pan Tomek nic z tego nie wyniesie.'},
      {text: 'Nie moja wina, że nikt tu nie umie obsługiwać sprzętu.', why: 'Obraźliwie. Kompetencja bez kultury = nikt nie chce z Tobą pracować.'},
    ]},
  {id: '103', icon: 'printer', title: 'Nie drukuje — w kolejce 14 dokumentów', from: 'Pani Kasia, matematyka', urgency: 'Sprawdzian za 10 min',
    symptom: '„Nic nie drukuje! W kolejce wisi 14 dokumentów, a za 10 minut sprawdzian.”',
    reporter: 'Jesteś w pokoju nauczycielskim. Rano ktoś wysłał do drukarki duży plik i coś się zacięło. Pierwszy dokument w kolejce ma status „Błąd — drukowanie”, pozostałe 13 czeka. Drukarka ma papier i toner, na wyświetlaczu: „Gotowa”. Kilka osób klikało „Drukuj” jeszcze raz — stąd 14 dokumentów.',
    questions: [
      {q: 'Jaki status ma pierwszy dokument w kolejce?', a: '„Błąd — drukowanie”. Reszta czeka za nim.', key: true},
      {q: 'W jakim formacie jest sprawdzian?', a: 'W PDF-ie.'},
      {q: 'Co pokazuje wyświetlacz drukarki? Jest papier i toner?', a: '„Gotowa”. Papier jest, toner też.', key: true},
      {q: 'Kto kupował tę drukarkę?', a: 'Nie wiem, stoi tu od lat.'},
      {q: 'Czy komputer ma najnowszą przeglądarkę?', a: 'Nie wiem. Chyba.'},
      {q: 'Czy inni też nie mogą drukować?', a: 'Od rana nikt z pokoju nauczycielskiego.', key: true},
    ],
    solutions: [
      {text: 'Kliknij „Drukuj” jeszcze kilka razy — w końcu przejdzie.', why: 'Każde kliknięcie dokłada zadanie do zablokowanej kolejki. Stąd te 14 dokumentów.'},
      {text: 'Wyczyść kolejkę: zatrzymaj usługę „Bufor wydruku”, usuń zablokowane zadania, uruchom usługę i wydrukuj raz jeszcze.', ok: true, why: 'Pierwsze zadanie zablokowało kolejkę. Po wyczyszczeniu bufora drukarka od razu rusza — i drukujesz jeden egzemplarz, nie 14.'},
      {text: 'Wyłącz drukarkę i zostaw do jutra — samo przejdzie.', why: 'Zablokowana kolejka jest w komputerze, nie w drukarce. Jutro dalej będzie stać, a sprawdzian jest dziś.'},
      {text: 'Odinstaluj pakiet biurowy.', why: 'Problem jest w kolejce wydruku systemu, a nie w programie, z którego drukujesz.'},
    ],
    replies: [
      {text: 'Kto klikał 14 razy? No właśnie.', why: 'Szukanie winnego nie drukuje sprawdzianu. Zostaje tylko zły klimat.'},
      {text: 'Spooler się wysypał, zrestartowałem serwis przez services.msc.', why: 'Żargon. Dla Ciebie jasne, dla pani Kasi — szyfr.'},
      {text: 'Zablokował się pierwszy wydruk i trzymał resztę. Wyczyściłem kolejkę — sprawdzian już się drukuje. Jak coś utknie, proszę nie klikać „Drukuj” kilka razy, tylko dać znać.', ok: true, why: 'Wyjaśnia przyczynę i daje prostą zasadę na przyszłość.'},
    ]},
  {id: '104', icon: 'wifi', title: 'Gość nie może połączyć się z Wi-Fi', from: 'Sekretariat — prelegent z firmy', urgency: 'Prezentacja za 15 min',
    symptom: '„Nasz gość, prelegent z firmy, nie może połączyć się z Wi-Fi. Prezentacja ma być online za kwadrans.”',
    reporter: 'Jesteś prelegentem z firmy. Na laptopie wybrałeś sieć „Szkoła-Goście”. System pokazuje: „Połączono, brak internetu”. Strona logowania się nie otworzyła, przeglądarka jest zamknięta. W sekretariacie dostałeś kartkę z kodem dostępu na dziś.',
    questions: [
      {q: 'Jaki masz model laptopa?', a: 'Służbowy, 14 cali.'},
      {q: 'Z którą siecią się łączysz i co pokazuje system?', a: '„Szkoła-Goście”. Pisze: połączono, brak internetu.', key: true},
      {q: 'Czy masz włączony Bluetooth?', a: 'Chyba tak, mam słuchawki.'},
      {q: 'Czy otworzyła się strona logowania do sieci?', a: 'Nie, nic się nie otworzyło. Przeglądarkę mam zamkniętą.', key: true},
      {q: 'Czy masz kod dostępu dla gości?', a: 'Tak, kartka z sekretariatu z kodem na dziś.', key: true},
      {q: 'Ile masz baterii?', a: '80%.'},
    ],
    solutions: [
      {text: 'Podaj gościowi hasło do sieci „Szkoła-Uczniowie”.', why: 'Goście mają osobną sieć celowo: nie widzą szkolnych drukarek, NAS ani komputerów. Haseł do sieci wewnętrznej się nie rozdaje.'},
      {text: 'Zrestartuj główny router szkoły.', why: 'Cała szkoła straci internet na kilka minut, a problem dotyczy logowania jednego laptopa.'},
      {text: 'Otwórz przeglądarkę, żeby pojawił się portal logowania sieci gości, i wpisz kod z kartki.', ok: true, why: 'Sieć gości ma portal logowania. Dopóki nie wpiszesz kodu, widzisz „połączono, brak internetu”. Portal zwykle wyskakuje sam, a gdy nie — wystarczy otworzyć przeglądarkę.'},
      {text: 'Udostępnij gościowi hotspot ze swojego telefonu.', why: 'Obejście na Twój pakiet danych i Twoją odpowiedzialność. Szkoła ma sieć dla gości — trzeba ją tylko poprawnie uruchomić.'},
    ],
    replies: [
      {text: 'Sieć dla gości wymaga zalogowania kodem. Otworzyliśmy przeglądarkę, wpisaliśmy kod z kartki — działa do końca dnia.', ok: true, why: 'Krótko, rzeczowo, z informacją, jak długo działa dostęp.'},
      {text: 'Captive portal nie zrobił przekierowania, bo nie było żądania HTTP.', why: 'Może i prawda, ale gość nie wie, co ma zrobić jutro.'},
      {text: 'Pan jest z firmy IT i nie umie połączyć się z Wi-Fi?', why: 'Złośliwość wobec gościa szkoły. Na praktykach — pożegnanie z referencjami.'},
    ]},
  {id: '105', icon: 'globe', title: 'Strona do projektu zablokowana „przez szkołę”', from: 'Kuba, klasa 3', urgency: 'Termin projektu w piątek',
    symptom: '„Strona z samouczkiem do mojego projektu jest zablokowana przez szkołę. Bez niej nie skończę projektu.”',
    reporter: 'Jesteś uczniem 3 klasy. Robisz projekt gry na programowanie. Strona z samouczkiem pokazuje: „Strona zablokowana przez filtr sieci szkolnej (OSE). Kategoria: gry”. W domu działa. Kolega mówił, że można to obejść darmowym VPN-em.',
    questions: [
      {q: 'Jaki dokładnie komunikat widzisz?', a: '„Strona zablokowana przez filtr sieci szkolnej (OSE). Kategoria: gry”.', key: true},
      {q: 'Jaki procesor ma ten komputer?', a: 'Nie wiem, szkolny.'},
      {q: 'Do czego potrzebujesz tej strony?', a: 'To samouczek do projektu z programowania gier. Nauczyciel go polecił.', key: true},
      {q: 'Czy lubisz grać w gry?', a: 'No… tak. Ale to jest do projektu!'},
      {q: 'Czy blokada jest na każdym komputerze w szkole?', a: 'Tak, w całej szkole. W domu działa.', key: true},
      {q: 'Jakiej przeglądarki używasz?', a: 'Tej, co jest na pulpicie.'},
    ],
    solutions: [
      {text: 'Zainstaluj darmowy VPN, żeby ominąć filtr.', why: 'Łamie regulamin sieci szkoły, a darmowy VPN z reklamy potrafi zbierać dane. Technik nie obchodzi zabezpieczeń — nawet „na chwilę”.'},
      {text: 'Wyłącz zaporę Windows na tym komputerze.', why: 'Filtr OSE działa w sieci, nie w komputerze. Wyłączona zapora niczego nie odblokuje, za to osłabi ochronę.'},
      {text: 'Zmień serwer DNS w ustawieniach karty sieciowej na publiczny.', why: 'To też obchodzenie zabezpieczeń szkoły. Potrzebną stronę odblokowuje się oficjalnie.'},
      {text: 'Zgłoś adres strony administratorowi (przez nauczyciela) z uzasadnieniem i poproś o odblokowanie; na teraz skorzystaj z materiału zapasowego.', ok: true, why: 'Filtr blokuje całe kategorie i czasem trafia w strony edukacyjne. Administrator może dodać wyjątek. Bezpieczna sieć działa przez zgłoszenia, nie obejścia.'},
    ],
    replies: [
      {text: 'Filtr treści wrzucił stronę do kategorii „gry”. Zgłosiłem adres administratorowi z opisem projektu — do czasu odblokowania masz samouczek w PDF od nauczyciela.', ok: true, why: 'Wyjaśnia, dlaczego zablokowało, co zrobiłeś i jak pracować do czasu odblokowania.'},
      {text: 'Filtr kategoryzuje po adresie i reputacji domeny, a wyjątki dodaje admin w panelu.', why: 'Żargon i brak odpowiedzi na najważniejsze: co Kuba ma teraz zrobić.'},
      {text: 'Pewnie i tak chciałeś grać, a nie się uczyć.', why: 'Oskarżenie bez podstaw. Zgłaszający przestanie zgłaszać — i zainstaluje VPN.'},
    ]},
  {id: '106', icon: 'warning', title: 'Znaleziony pendrive — „coś się instaluje”', from: 'Ola, klasa 2, pracownia 14', urgency: 'Bezpieczeństwo — natychmiast',
    symptom: '„Znalazłam pendrive na korytarzu, podłączyłam, żeby sprawdzić, czyj jest… i coś się samo instaluje.”',
    reporter: 'Jesteś uczennicą. Na korytarzu znalazłaś pendrive bez podpisu. Podłączyłaś go do komputera w pracowni (komputer jest w sieci szkoły, na kablu). Otworzyłaś plik „zdjecia.exe” i teraz widać okno „Instalowanie…” z paskiem postępu. Boisz się, że coś zepsułaś.',
    questions: [
      {q: 'Skąd jest ten pendrive?', a: 'Leżał na korytarzu, bez podpisu.', key: true},
      {q: 'Jakiej pojemności jest pendrive?', a: '64 GB, tak jest napisane.'},
      {q: 'Jakiego koloru jest pendrive?', a: 'Czerwony. Ładny był.'},
      {q: 'Co dokładnie widać na ekranie?', a: 'Okno „Instalowanie…” z paskiem. Wcześniej otworzyłam plik zdjecia.exe.', key: true},
      {q: 'Czy lubisz informatykę?', a: 'Teraz jakby mniej.'},
      {q: 'Czy komputer jest podłączony do sieci szkoły?', a: 'Tak, kablem, jak wszystkie w pracowni.', key: true},
    ],
    solutions: [
      {text: 'Sprawdź pendrive na innym komputerze — może tam się nie instaluje.', why: 'Tak roznosi się złośliwe oprogramowanie. Podejrzany nośnik nie trafia do kolejnego komputera.'},
      {text: 'Odłącz komputer od sieci (kabel), nie klikaj nic więcej, odłóż pendrive i od razu zgłoś administratorowi.', ok: true, why: 'Odcięcie od sieci zatrzymuje rozprzestrzenianie. Administrator sprawdzi ten komputer i pozostałe. Zgłoszenie to nie donos — to ochrona całej szkoły.'},
      {text: 'Wyjmij pendrive i pracuj dalej, jakby nic się nie stało.', why: 'Program mógł już się zainstalować i działać w tle. Bez zgłoszenia nikt tego nie sprawdzi.'},
      {text: 'Uruchom skanowanie antywirusem i nikomu nie mów.', why: 'Antywirus nie wykrywa wszystkiego, a komputer jest w sieci szkoły. Incydent zawsze się zgłasza.'},
    ],
    replies: [
      {text: 'No brawo. Kto podłącza znalezione pendrive’y?', why: 'Ola już wie, że to był błąd. Po takiej odpowiedzi następnym razem nic nie powie — a to najgorszy scenariusz.'},
      {text: 'Dobrze, że od razu powiedziałaś. Odłączyłem komputer od sieci, administrator go sprawdzi. Znalezione pendrive’y oddajemy w sekretariacie, nie podłączamy.', ok: true, why: 'Docenia zgłoszenie, mówi, co się dzieje, i daje zasadę na przyszłość.'},
      {text: 'Pewnie złapałaś trojana z autorunem, trzeba będzie zrobić reimage stacji.', why: 'Żargon i straszenie. Zgłaszający ma wiedzieć, co dalej, a nie się bać.'},
    ]},
];

export const MAX_QUESTIONS = 3;
export const HELPDESK_MAX = tickets.length * 3;
export const keyCount = (t, asked = []) => asked.filter(i => t.questions[i]?.key).length;

export function questionFeedback(t, asked = []) {
  const k = keyCount(t, asked);
  const weak = asked.filter(i => !t.questions[i].key).map(i => `„${t.questions[i].q}”`);
  const good = k >= 2;
  return {ok: good, points: good ? 1 : 0,
    message: `Kluczowe pytania: ${k}/3.${weak.length ? ` Mało przydatne: ${weak.join(', ')} — nie przybliża do przyczyny.` : ''}${good ? ' Dobra diagnoza zaczyna się od dobrych pytań.' : ' Pytaj o objawy, połączenia i to, co widać na ekranie.'}`};
}
export function checkSolution(t, i) { const s = t.solutions[i]; return {ok: !!s?.ok, message: s ? (s.ok ? `Dobrze. ${s.why}` : `Nie tędy. ${s.why}`) : 'Wybierz rozwiązanie.'}; }
export function checkReply(t, i) { const r = t.replies[i]; return {ok: !!r?.ok, message: r ? (r.ok ? `Tak. ${r.why}` : `Spróbuj inaczej. ${r.why}`) : 'Wybierz odpowiedź.'}; }

export function ticketResult(t, st = {}) {
  const q = st.askedLocked && keyCount(t, st.asked) >= 2 ? 1 : 0;
  const s = st.solved ? (st.solAttempts === 1 ? 2 : 1) : 0;
  return {q, s, score: q + s, max: 3, closed: !!(st.solved && st.replyOk)};
}
export function helpdeskResult(state = {}) {
  const tk = state.tickets || {};
  const rows = tickets.map(t => ticketResult(t, tk[t.id]));
  const score = rows.reduce((a, r) => a + r.score, 0);
  const closed = rows.filter(r => r.closed).length;
  const firstTry = tickets.filter(t => tk[t.id]?.solved && tk[t.id].solAttempts === 1).length;
  return {score, max: HELPDESK_MAX, closed, firstTry, done: closed === tickets.length,
    summary: closed ? `Rozwiązane zgłoszenia: ${closed}/6 · trafna diagnoza za 1. razem: ${firstTry}` : undefined};
}
