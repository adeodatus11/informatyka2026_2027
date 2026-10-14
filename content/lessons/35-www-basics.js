import {note, choice} from '../schema.js';

// Strona „gazety” do haka: uczeń podmienia nagłówek i widzi, że zrzut ekranu niczego nie dowodzi.
const FAKE = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Gazeta Szkolna Online</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f2f2f2; }
    header { background: #a8231b; color: #ffffff; padding: 10px 16px; font-weight: bold; }
    main { background: #ffffff; margin: 12px; padding: 4px 16px 12px; }
    .data { color: #555555; font-size: 14px; }
  </style>
</head>
<body>
  <header>GAZETA SZKOLNA ONLINE · wiadomości</header>
  <main>
    <p class="data">14.10.2026, 7:45 · Redakcja</p>
    <h1>Jutro lekcje normalnie, od 8:00</h1>
    <p>Dyrekcja przypomina: plan lekcji bez zmian.</p>
  </main>
</body>
</html>
`;

// Poradnik z „udawanymi nagłówkami” — ten sam błąd co ręczne pogrubianie tytułów w Wordzie.
const GUIDE = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Dokument bez nazwy</title>
</head>
<body>
  <p><b>Pierwszy dzień na praktykach</b></p>
  <p>Krótki poradnik dla uczniów pierwszej klasy.</p>
  <p><b>Zanim wyjdziesz z domu</b></p>
  <p>Sprawdź godzinę i adres. Weź legitymację.</p>
  <p><b>Pierwsza godzina w firmie</b></p>
  <p>Przedstaw się opiekunowi praktyk.</p>
  <p><b>Gdy czegoś nie wiesz</b></p>
  <p>Pytaj. Lepiej zapytać dwa razy niż zepsuć raz.</p>
</body>
</html>
`;

export const HOBBY = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Moja strona</title>
</head>
<body>
  <h1>Tu wpisz temat strony</h1>
  <img src="kot.svg" alt="">
  <p>Napisz tu 2–3 zdania: o czym jest strona i dlaczego to lubisz.</p>
  <h2>Tytuł sekcji</h2>
  <ul>
    <li>Pierwszy punkt</li>
    <li>Drugi punkt</li>
  </ul>
  <p>Strona zrobiona na lekcji informatyki.</p>
</body>
</html>
`;

export default {
 id:'35',grade:1,order:18,title:'Tworzenie stron WWW – podstawowe informacje',
 subtitle:'Zajrzysz za kulisy każdej strony, przestaniesz wierzyć w „screeny jako dowód” i w 15 minut zrobisz własną stronę.',
 topic:'Jak działa strona WWW i pierwsza strona w HTML',icon:'globe',tags:['F12','<h1>…</h1>','klient–serwer'],duration:45,
 curriculum:'PP 2024 Informatyka – liceum/technikum, zakres podstawowy · II.2, II.3f: tworzenie prostej strony WWW w języku HTML; III.4: działanie internetu (klient–serwer, adres URL, HTTP/HTTPS)',
 format:{
  name:'Za kulisami strony: od podglądania do własnej strony',
  student:'Najpierw podejrzysz kod strony i podmienisz nagłówek „gazety” — zobaczysz, dlaczego screenshot nie jest dowodem. Potem poznasz drogę strony do Twojej przeglądarki i zbudujesz własną stronę z szablonu. Efekt: działająca strona, którą pokażesz nauczycielowi na ekranie.',
  teacher:'Start: retrieval practice z bloku Worda (style i spis treści), bo nagłówki w HTML działają jak style Nagłówek 1–3. Hak: F12 na stronie lekcji i podmiana nagłówka w edytorze — uczniowie sami dochodzą do wniosku „HTML to tylko tekst”. Nauczanie jawne: krótki schemat klient–serwer i przykład rozwiązany na poradniku z „udawanymi nagłówkami” (ten sam błąd co ręczne pogrubianie w Wordzie). Na koniec mini-projekt: strona o hobby z szablonu, sprawdzana automatycznie według 6 jawnych kryteriów; nauczyciel ogląda gotowe strony przy komputerach uczniów.',
  grouping:'Praca samodzielna przy własnym komputerze. W etapie 5 opcjonalnie 2 minuty planowania w parze (każdy planuje swoją stronę, partner zadaje pytania). Bez pary — plan robisz sam według karty w edytorze.',
  methods:[
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Wyjaśniam, co robi przeglądarka, a co serwer, gdy wpisuję adres strony.','Rozróżniam rolę HTML, CSS i JavaScriptu i wiem, dlaczego zrzut ekranu strony nie jest dowodem.','Zapisuję tytuł i rozdziały strony jako nagłówki <h1>–<h2>, tak jak style nagłówków w Wordzie.','Tworzę prostą stronę z nagłówkiem, akapitem, listą i obrazkiem z opisem alt.'],
 materials:['Komputer z przeglądarką (Chrome, Edge lub Firefox) — jeden na osobę; edytor HTML działa na platformie, bez instalacji i bez konta','Projektor do pokazania F12 i przykładu rozwiązanego','Opcjonalnie: kartka do planu strony w parze'],
 teacherGuide:{
  preparation:'Sprawdź na komputerze z projektorem, czy działa F12 (narzędzia deweloperskie) — na niektórych komputerach szkolnych administrator je blokuje; wtedy hak pokazujesz tylko w edytorze na platformie. Strony uczniów istnieją tylko w ich przeglądarkach do odświeżenia — ocenę robisz przy komputerze ucznia w etapie 6 (widok „Twoja strona”). Pobranie pliku .html jest opcjonalne.',
  summary:'Uczeń opisuje drogę strony (adres → DNS → serwer → HTML → przeglądarka), rozróżnia HTML/CSS/JS, zamienia „udawane nagłówki” na <h1>/<h2> i buduje stronę o hobby spełniającą 6 kryteriów. Na karcie wyniku: pytania, podmiana nagłówka, kolejność, dopasowania, poradnik i strona (maks. 17 pkt). Pytanie na wyjście: dlaczego screenshot strony nie jest dowodem?'
 },
 sections:[
  {id:'start',label:'Start',title:'Screenshot to dowód?',grouping:'class',
   intro:'Ktoś wrzuca na grupę klasy screena: „Jutro odwołane lekcje!”. Wygląda jak strona szkoły. Za 10 minut sam zrobisz taki obrazek — i zrozumiesz, dlaczego to żaden dowód. Najpierw dwa pytania z lekcji o Wordzie, bez notatek.',
   ...note(4,'Pokaż (albo opowiedz) screen z „odwołanymi lekcjami” i zapytaj, kto by uwierzył. Nie rozstrzygaj — wrócimy do tego w etapie 2. Dwa pytania powtórkowe z Worda bez notatek (retrieval practice); omów tylko błędne odpowiedzi. Podkreśl: nagłówki z Worda za chwilę spotkamy w HTML.','Skąd Word wie, co wstawić do spisu treści?','Z akapitów oznaczonych stylami Nagłówek 1, Nagłówek 2 itd. Ręcznie pogrubiony tekst nie jest nagłówkiem, więc go w spisie nie ma.','Uczniowie myślą, że wystarczy duża, pogrubiona czcionka. Word (i przeglądarka) patrzy na znaczenie akapitu, nie na wygląd.','Zapytaj, kto spotkał się z fałszywym screenem (np. „potwierdzenie przelewu” na OLX). To ten sam mechanizm.'),
   activities:[
    choice('w35-r1','W Wordzie spis treści zrobił się sam. Z czego Word go zbudował?',['Z akapitów oznaczonych stylami Nagłówek 1 i Nagłówek 2','Z pogrubionych, większych linijek tekstu','Z pierwszych słów każdej strony','Z tekstu wpisanego w nagłówku i stopce strony'],[0],'Spis treści zbiera akapity ze stylami nagłówków. Dlatego w HTML też oznaczysz tytuły jako nagłówki <h1>, <h2> — wtedy przeglądarka i wyszukiwarka wiedzą, co jest tytułem.','Przypomnij sobie kartę Narzędzia główne → Style.'),
    choice('w35-r2','Kolega zrobił tytuły rozdziałów ręcznie: pogrubienie i rozmiar 16. Co się stanie po kliknięciu „Aktualizuj spis treści”?',['Spis treści zaktualizuje się normalnie','Tych tytułów nie będzie w spisie — Word nie wie, że to nagłówki','Word sam zamieni je na Nagłówek 1','Spis treści zniknie z dokumentu'],[1],'Wygląd to nie znaczenie. Word bierze do spisu tylko akapity ze stylem nagłówka. Na stronach WWW jest identycznie: pogrubiony akapit to nie nagłówek.','Czy pogrubienie mówi Wordowi, że to tytuł rozdziału?')
   ]},
  {id:'kulisy',label:'Za kulisami',title:'HTML to tylko tekst',grouping:'solo',
   intro:'Każda strona to plik tekstowy z instrukcjami dla przeglądarki. Możesz go podejrzeć i zmienić — u siebie. Sprawdź to w dwóch miejscach: na tej stronie (F12) i w edytorze poniżej.',
   reading:{title:'Co widzisz po naciśnięciu F12?',paragraphs:[
    'Strona, którą oglądasz, przyszła z serwera jako tekst w języku HTML. Przeglądarka czyta ten tekst i rysuje z niego nagłówki, akapity i obrazki. Klawisz F12 (albo prawy przycisk myszy → Zbadaj) pokazuje ten kod. Spróbuj: kliknij prawym przyciskiem tytuł tej lekcji, wybierz Zbadaj, kliknij dwa razy tekst w kodzie i wpisz inny. Po odświeżeniu (F5) wszystko wraca.',
    'Zmieniasz tylko kopię w swojej przeglądarce — serwer o niczym nie wie. Dlatego zrzut ekranu strony niczego nie dowodzi: „potwierdzenie przelewu”, „wyniki konkursu” czy „ogłoszenie dyrekcji” podmienisz w 10 sekund. Prawdę sprawdzasz u źródła: sam wchodzisz na stronę, sam logujesz się do banku.'
   ],example:{question:'Jak sprawdzić, czy screen „Jutro wolne” jest prawdziwy?',answer:'Samemu wejść na stronę szkoły albo do dziennika elektronicznego i poszukać ogłoszenia. Screen może być podmieniony — strona u źródła nie.'}},
   ...note(7,'Pokaż na projektorze F12 na stronie lekcji: zmień tytuł lekcji na „Dziś bez sprawdzianu”, zrób zrzut, odśwież. Potem uczniowie zmieniają nagłówek „gazety” w edytorze — podgląd zmienia się od razu. Zapytaj: czy dyrekcja zobaczy ten nagłówek? Jeśli F12 jest zablokowane w pracowni, wystarczy edytor.','Dlaczego po odświeżeniu strony Twoja zmiana z F12 znika?','Bo zmieniłem tylko kopię strony w swojej przeglądarce. Odświeżenie pobiera z serwera oryginalny plik HTML.','Uczniowie myślą, że „zhakowali” stronę. Podkreśl: zmiana jest lokalna, nikt inny jej nie widzi — ale zrzut ekranu wygląda wiarygodnie.','Zapytaj, jak oszuści wykorzystują ten trik (fałszywe potwierdzenia przelewu na OLX/Vinted) i co robi sprzedający (sprawdza saldo w swoim banku).'),
   activities:[
    {type:'htmlLab',id:'w35-fake',mode:'free',points:1,site:'gazeta-szkolna',title:'Podmień nagłówek „gazety”',product:'Fałszywy nagłówek',
     prompt:'Znajdź w kodzie linię z `<h1>` i zmień tekst między `<h1>` a `</h1>`, np. na „Jutro wolne dla wszystkich!”. Patrz na podgląd po prawej. Taki obrazek można by sfotografować i rozesłać — i nadal byłby fałszywy.',
     html:FAKE,doneText:'Gotowe — „gazeta” mówi teraz to, co chcesz. Na prawdziwym serwerze nic się nie zmieniło. Screenshot to nie dowód.'},
    choice('w35-proof','Kolega przysyła screena ze strony szkoły: „Jutro odwołane lekcje!”. Co wiesz na pewno?',['Jest prawdziwy, bo widać logo szkoły','Nic — taki obraz da się zrobić w 10 sekund. Sprawdzę na stronie szkoły lub w dzienniku','Jest prawdziwy, bo widać adres strony','Jest prawdziwy, jeśli zrzut jest ostry i ma godzinę'],[1],'Logo, adres i godzina też są częścią obrazu, który można podmienić. Wiarygodne jest tylko źródło: strona szkoły albo dziennik, do którego wchodzisz sam.','Przypomnij sobie, co przed chwilą zrobiłeś w edytorze.')
   ]},
  {id:'droga',label:'Droga strony',title:'Co się dzieje po wpisaniu adresu?',grouping:'class',
   intro:'Wpisujesz adres i po pół sekundy widzisz stronę. Po drodze dzieje się kilka rzeczy — i każda ma swój zawód w IT.',
   reading:{title:'Klient, serwer i trzy języki strony',paragraphs:[
    'Twoja przeglądarka to klient: prosi o stronę. Serwer to komputer, który przez całą dobę czeka na takie prośby i odsyła pliki. Adres URL (np. https://www.example.pl/menu.html) mówi, jakim sposobem (https), do jakiego serwera (www.example.pl) i po jaki plik (menu.html) iść. HTTPS oznacza połączenie szyfrowane — nikt po drodze nie podejrzy, co wpisujesz.',
    'Strona składa się z trzech warstw. HTML to treść i jej znaczenie: nagłówki, akapity, listy, obrazki. CSS to wygląd: kolory, czcionki, odstępy. JavaScript to zachowanie: menu, które się rozwija, koszyk, który liczy cenę. Dziś piszemy HTML, na trzeciej lekcji dojdzie CSS.'
   ]},
   ...note(7,'Nauczanie jawne: przejdź z klasą schemat krok po kroku (przycisk „Odkryj kolejny krok”), przy DNS powiedz „książka telefoniczna internetu”. Potem uczniowie sami układają kolejność i dopasowują warstwy oraz zawody. Omów jedno pytanie, w którym było najwięcej błędów.','Co robi serwer, a co przeglądarka, gdy otwierasz stronę?','Serwer odsyła pliki (HTML, CSS, obrazki). Przeglądarka je pobiera i rysuje z nich stronę na moim ekranie.','Uczniowie mylą przeglądarkę z wyszukiwarką (Chrome ≠ Google) i myślą, że strona „mieszka” w przeglądarce.','Zapytaj, który zawód z dopasowania wydaje się najciekawszy i czego by się trzeba nauczyć po technikum.'),
   activities:[
    {type:'flow',id:'w35-flow',nodes:[
     {title:'Wpisujesz adres',text:'Np. https://www.example.pl/menu.html. Przeglądarka rozkłada go na: protokół (https), nazwę serwera i nazwę pliku.'},
     {title:'DNS zamienia nazwę na numer',text:'Komputery łączą się po adresach IP (np. 93.184.215.14). DNS to „książka telefoniczna”: podaje numer IP dla nazwy domeny.'},
     {title:'Prośba do serwera (HTTP/HTTPS)',text:'Przeglądarka łączy się z serwerem i prosi: „daj menu.html”. Przy HTTPS połączenie jest szyfrowane.'},
     {title:'Serwer odsyła pliki',text:'Najpierw HTML, a potem to, co w nim wskazano: arkusz CSS, obrazki, skrypty.'},
     {title:'Przeglądarka rysuje stronę',text:'Czyta HTML od góry do dołu, nakłada wygląd z CSS i pokazuje gotową stronę. Kod podejrzysz klawiszem F12.'}
    ]},
    {type:'sequence',id:'w35-seq',question:'Ułóż kroki w kolejności: od wpisania adresu do zobaczenia strony.',options:['DNS podaje adres IP serwera','Wpisujesz adres strony w pasku przeglądarki','Przeglądarka rysuje stronę z HTML i CSS','Serwer odsyła plik HTML','Przeglądarka prosi serwer o plik (HTTPS)'],correct:[1,0,4,3,2],explanation:'Adres → DNS (numer IP) → prośba do serwera → serwer odsyła HTML → przeglądarka rysuje stronę.',hint:'Zanim przeglądarka zapyta serwer, musi znać jego numer IP.'},
    {type:'matching',id:'w35-roles',question:'Która warstwa strony za to odpowiada?',options:['HTML','CSS','JavaScript'],rows:[
     {label:'Nagłówek „Menu”, lista pizz i zdjęcie',correct:[0],explanation:'Treść i jej znaczenie to HTML.'},
     {label:'Czerwone tło, zaokrąglone przyciski, czcionka',correct:[1],explanation:'Wygląd to CSS.'},
     {label:'Koszyk, który sam przelicza cenę po kliknięciu',correct:[2],explanation:'Zachowanie i obliczenia na stronie to JavaScript.'}
    ]},
    {type:'matching',id:'w35-jobs',question:'Kto to robi w firmie, która tworzy strony?',options:['Front-end developer','Back-end developer','UX designer'],rows:[
     {label:'Rysuje makiety i sprawdza z ludźmi, czy łatwo zamówić pizzę w 3 kliknięciach',correct:[2],explanation:'UX (user experience) to projektowanie wygody użytkownika.'},
     {label:'Pisze HTML, CSS i JavaScript — wszystko, co działa w przeglądarce',correct:[0],explanation:'Front-end to „przód” strony: to, co widzisz.'},
     {label:'Programuje serwer: zapis zamówień w bazie, logowanie, płatności',correct:[1],explanation:'Back-end to „zaplecze” — część na serwerze.'}
    ]}
   ]},
  {id:'anatomia',label:'Anatomia',title:'Znaczniki: style z Worda w wersji HTML',grouping:'class',
   intro:'HTML opisuje znaczenie tekstu za pomocą znaczników w nawiasach ostrych. Najpierw przykład rozwiązany, potem poprawisz poradnik, który ma „udawane nagłówki” — dokładnie ten błąd, który w Wordzie psuje spis treści.',
   reading:{title:'Element, znacznik, atrybut',paragraphs:[
    'Element to znacznik otwierający, treść i znacznik zamykający: <h1>Menu</h1>. Ukośnik w </h1> oznacza koniec. Niektóre elementy nie mają treści ani zamknięcia, np. obrazek <img src="pizza.svg" alt="Pizza z oliwkami">. Dodatkowe informacje zapisuje się w atrybutach: src mówi, który plik pokazać, alt opisuje obrazek słowami.',
    'Szkielet każdej strony: <!DOCTYPE html>, potem <html lang="pl">, w nim <head> (informacje o stronie, m.in. <title> — tekst na karcie przeglądarki) i <body> (to, co widać). Nagłówki <h1>–<h6> działają jak style Nagłówek 1–6 w Wordzie: <h1> to tytuł strony (jeden), <h2> to rozdziały, <h3> podrozdziały. Z nich powstaje konspekt — jak okienko nawigacji w Wordzie.'
   ],example:{question:'Przykład rozwiązany: jak zapisać tytuł rozdziału „Ceny”?',answer:'Nie tak: <p><b>Ceny</b></p> (to tylko pogrubiony akapit, jak ręczne pogrubienie w Wordzie). Tylko tak: <h2>Ceny</h2>. Wygląd ustawimy później w CSS — HTML mówi, czym tekst JEST.'}},
   ...note(8,'Przykład rozwiązany na projektorze: zamień pierwszy „udawany nagłówek” na <h1> i pokaż zakładkę „Konspekt” — porównaj z okienkiem nawigacji w Wordzie. Potem uczniowie sami poprawiają resztę (3 rozdziały → <h2>) i wpisują <title>. Pilnuj, żeby zamykali tym samym znacznikiem, którym otworzyli.','Dlaczego <p><b>Ceny</b></p> to nie nagłówek, choć wygląda podobnie?','Bo to akapit z pogrubieniem — mówi tylko, jak tekst wygląda. Nagłówek <h2> mówi, czym tekst jest; z niego korzystają konspekt, wyszukiwarki i czytniki ekranu.','Zamykanie innym znacznikiem (<h2>…</h1>), zostawienie <b> w środku nagłówka, zmiana wszystkich tytułów na <h1>.','Zapytaj, co pokaże zakładka „Czytnik ekranu” przed i po poprawce — czytnik ogłasza „nagłówek poziomu 2”.'),
   activities:[
    {type:'htmlLab',id:'w35-headings',mode:'tasks',points:4,minDone:3,site:'poradnik-praktyki',title:'Popraw poradnik: prawdziwe nagłówki zamiast pogrubień',product:'Poradnik',
     prompt:'Zamień każdy akapit `<p><b>…</b></p>` na nagłówek: tytuł poradnika na `<h1>…</h1>`, a trzy tytuły rozdziałów na `<h2>…</h2>`. Wpisz też sensowny `<title>`. Zajrzyj do zakładki „Konspekt”.',
     html:GUIDE,keep:[{sel:'p',min:4,label:'akapitów z treścią poradnika'}],snippets:false,download:false,
     checks:[
      {id:'h1',type:'text',sel:'h1',includes:['praktyk'],label:'Tytuł poradnika jest nagłówkiem <h1>',hint:['Pierwsza linia w <body> to tytuł. Zamień `<p><b>` na `<h1>`, a `</b></p>` na `</h1>`.']},
      {id:'h2',type:'exists',sel:'h2',min:3,label:'Trzy tytuły rozdziałów są nagłówkami <h2>',hint:['Rozdziały to: „Zanim wyjdziesz z domu”, „Pierwsza godzina w firmie”, „Gdy czegoś nie wiesz”. Każdy zapisz jako `<h2>…</h2>`.']},
      {id:'fake',type:'exists',sel:'p b',min:0,max:0,label:'Nie ma już „udawanych nagłówków” <p><b>…</b></p>',hint:['Zakładka „Walidator” pod edytorem nic tu nie podpowie — szukaj w kodzie `<b>`. Każde `<p><b>` zamień na nagłówek.']},
      {id:'title',type:'text',sel:'title',not:['Dokument bez nazwy'],min:10,label:'Karta przeglądarki ma opisowy <title>',hint:['W `<head>` zamień „Dokument bez nazwy” np. na „Pierwszy dzień na praktykach – poradnik”.']}
     ],doneText:'Poradnik ma prawdziwe nagłówki — konspekt wygląda jak spis treści w Wordzie.'}
   ]},
  {id:'hobby',label:'Twoja strona',title:'Twoja strona w 15 minut',grouping:'solo',
   intro:'Czas na własną stronę: o Twoim hobby albo „na zlecenie” (pizzeria, drużyna e-sportowa, klasa). Szablon już jest — zmieniasz treść. Kryteria po prawej sprawdzają się same, gdy piszesz.',
   reading:{title:'Lista, obrazek i opis alt',paragraphs:[
    'Lista punktowana to <ul> (unordered list), a każdy punkt to <li>…</li>. Lista numerowana to <ol>. Obrazek wstawiasz znacznikiem <img src="nazwa-pliku" alt="opis">. Plik musi leżeć w folderze strony — w edytorze masz gotowe obrazki (rozwiń „Folder strony”).',
    'Atrybut alt to opis obrazka słowami. Czytnik ekranu przeczyta go osobie niewidomej, a wyszukiwarka dowie się z niego, co jest na zdjęciu. Dobry alt mówi, co widać: „Rower górski na leśnej ścieżce”, a nie „obrazek1”.'
   ]},
   ...note(15,'Problem/projekt w małej skali: uczeń wybiera temat i zmienia szablon. Opcjonalnie 2 minuty planu w parze (karta w edytorze): każdy mówi partnerowi, co będzie w h1, h2 i na liście; partner zadaje jedno pytanie. Potem praca samodzielna. Krąż i dawaj jedną konkretną uwagę związaną z kryterium (feedback prowadzący do poprawy), np. „alt mówi «kot», a co kot robi?”. Szybsi: druga sekcja <h2>, lista numerowana <ol>, pobranie pliku .html i otwarcie go w przeglądarce.','Po co obrazkowi atrybut alt, skoro obrazek i tak widać?','Nie każdy go widzi: czytnik ekranu czyta alt osobie niewidomej, a wyszukiwarka dowiaduje się z niego, co jest na zdjęciu. Gdy plik się nie wczyta, pokaże się alt.','Pisanie treści poza znacznikami, kasowanie znaczników razem z tekstem szablonu, wpisanie nazwy pliku, którego nie ma w folderze (np. pies.jpg).','Dla szybkich: dodaj drugą sekcję <h2> z listą numerowaną <ol> („Mój plan na weekend”) i pobierz plik .html — otwórz go dwuklikiem w przeglądarce.'),
   activities:[
    {type:'htmlLab',id:'w35-hobby',mode:'tasks',points:6,minDone:4,site:'moja-strona',title:'Moja pierwsza strona',product:'Strona o hobby',
     prompt:'Zmień tekst szablonu na swój. Obrazek wybierz z folderu strony (np. `rower.svg`, `gitara.svg`, `pad.svg`, `pilka.svg`, `pizza.svg`, `gory.svg`) i opisz go w `alt`. Listę uzupełnij do co najmniej 3 punktów. Nie wpisuj nazwiska, adresu ani telefonu — wystarczy imię albo pseudonim.',
     card:{title:'Karta planu (w parze lub sam, 2 minuty)',text:'Zanim zaczniesz pisać, odpowiedz na głos (partnerowi albo sobie):\n\n1. O czym jest strona? → to będzie `<h1>` i `<title>`.\n\n2. Jaki jest jeden rozdział? → `<h2>`, np. „Mój sprzęt”, „Ulubione mapy”, „Nasze pizze”.\n\n3. Jakie 3 rzeczy wypiszesz na liście? → `<li>`.\n\n4. Który obrazek pasuje i co na nim widać? → `alt`.'},
     html:HOBBY,
     checks:[
      {id:'title',type:'text',sel:'title',not:['Moja strona'],min:10,label:'<title> opisuje stronę (min. 10 znaków)',hint:['Tekst w `<title>` widać na karcie przeglądarki. Np. „Rower górski – moje trasy”.']},
      {id:'h1',type:'text',sel:'h1',not:['Tu wpisz temat strony'],min:3,label:'<h1> ma Twój temat',hint:['Zmień tekst między `<h1>` a `</h1>`. Znaczniki zostają!']},
      {id:'p',type:'exists',sel:'p',textMin:60,notPattern:'Napisz tu',label:'Akapit z Twoim opisem (min. 60 znaków)',hint:['Zamień zdanie „Napisz tu…” na 2–3 własne zdania. 60 znaków to mniej więcej jedno dłuższe zdanie.']},
      {id:'h2',type:'exists',sel:'h2',not:['Tytuł sekcji'],min:1,label:'Rozdział <h2> ma własny tytuł',hint:['Zmień „Tytuł sekcji” np. na „Mój sprzęt” albo „Dlaczego to lubię”.']},
      {id:'list',type:'exists',sel:'li',not:['Pierwszy punkt','Drugi punkt','Trzeci punkt'],min:3,label:'Lista ma co najmniej 3 własne punkty <li>',hint:['Zmień teksty punktów na swoje i dopisz trzeci: `<li>…</li>` w środku `<ul>`.','Nowy punkt wstawisz przyciskiem `<ul>` nad edytorem albo kopiując linię `<li>…</li>`.']},
      {id:'img',type:'images',altMin:5,label:'Obrazek z folderu strony ma opis alt',hint:['W `alt=""` wpisz między cudzysłowy, co widać na obrazku, np. `alt="Śpiący rudy kot"`.','Jeśli zmieniasz obrazek, nazwa w `src` musi dokładnie pasować do pliku z folderu (np. `rower.svg`).']}
     ],doneText:'Twoja strona działa i spełnia kryteria!'}
   ]},
  {id:'wynik',label:'Wynik',title:'Twój wynik i Twoja strona',grouping:'class',
   intro:'Pokaż nauczycielowi swoją stronę (podgląd poniżej) i kartę wyniku. Strona żyje tylko w tej karcie przeglądarki — jeśli chcesz ją zachować, pobierz plik .html.',
   ...note(4,'Obejrzyj strony przy komputerach (tryb „Pełny ekran” pomaga). Oceń według kryteriów widocznych pod podglądem: brak / częściowo / w pełni. Zadaj pytanie na wyjście. Zapowiedz: następnym razem więcej znaczników — tabele, linki i naprawianie zepsutej strony.','Dlaczego screenshot strony nie jest dowodem?','Bo HTML to tekst, który każdy może zmienić u siebie w przeglądarce (F12 albo edytor) i zrobić zrzut. Dowodem jest źródło: strona otwarta samodzielnie.','„Screen z adresem strony jest pewny” — adres na zrzucie też jest tylko obrazem.','Poproś o nazwanie jednej strony, której kod uczeń chciałby podejrzeć w domu przez F12, i jednej rzeczy, którą chce na niej znaleźć.'),
   activities:[
    {type:'htmlLab',id:'w35-show',mode:'show',from:'w35-hobby',title:'Twoja strona — pokaż ją nauczycielowi'},
    {type:'resultCard',id:'result',title:'Pierwsza strona WWW — wynik',sources:['w35-r1','w35-r2','w35-fake','w35-proof','w35-seq','w35-roles','w35-jobs','w35-headings','w35-hobby'],badges:[
     {min:0,name:'Hello, World Wide Web',text:'Pierwszy krok za kulisy zrobiony. Następnym razem szablon pójdzie szybciej.'},
     {min:0.5,name:'Podglądacz kodu',text:'Wiesz, co siedzi pod spodem strony — i już nie dasz się nabrać na screena.'},
     {min:0.85,name:'Front-end na start',text:'Strona stoi, nagłówki jak w Wordzie, alt na miejscu. Portfolio właśnie dostało pierwszą pozycję.'}
    ]}
   ]}
 ],
 exitTicket:'Wiesz, że strona to tekst w HTML, który serwer wysyła, a przeglądarka rysuje. Umiesz zapisać tytuł i rozdziały jako <h1> i <h2>, dodać listę i obrazek z opisem alt — i wiesz, że zrzut ekranu strony niczego nie dowodzi.'
};
