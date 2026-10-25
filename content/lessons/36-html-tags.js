import {note, choice, reveal} from '../schema.js';

// Zepsuta strona: 6 błędów (niezamknięty <strong>, ścieżka do dysku, brak alt, h1→h3, link bez href, tabela bez <th>).
export const BROKEN = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Pizzeria Rondo – menu</title>
</head>
<body>
  <h1>Pizzeria Rondo</h1>
  <p>Pizza z pieca. <strong>Druga pizza -50% we wtorki.</p>
  <img src="C:\\Users\\Kuba\\Pulpit\\pizza.svg">
  <h3>Nasze pizze</h3>
  <ul>
    <li>Margherita – 28 zł</li>
    <li>Pepperoni – 32 zł</li>
    <li>Wiejska – 34 zł</li>
  </ul>
  <h2>Godziny otwarcia</h2>
  <table>
    <tr><td>Dzień</td><td>Godziny</td></tr>
    <tr><td>Pon.–Pt.</td><td>12:00–22:00</td></tr>
    <tr><td>Sob.–Niedz.</td><td>13:00–23:00</td></tr>
  </table>
  <p><a>Zamów online</a> albo zadzwoń.</p>
</body>
</html>
`;

const DICT = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Grafik treningów</title>
</head>
<body>
  <!-- Pisz tutaj to, co dyktuje partner -->

</body>
</html>
`;

export const CARD = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Wizytówka</title>
</head>
<body>
  <!-- 1. <h1>: imię lub pseudonim i kim jesteś, np. Ola – grafik -->
  <!-- 2. Obrazek z folderu strony z opisem alt -->
  <!-- 3. <h2>O mnie</h2> i akapit <p> -->
  <!-- 4. <h2>Umiem</h2> i lista <ul> z min. 3 punktami -->
  <!-- 5. <h2>Kiedy mam czas</h2> i tabela z nagłówkami <th> -->
  <!-- 6. Link <a href="…">, np. mailto:ola@example.com -->

</body>
</html>
`;

export default {
 id:'36',grade:1,order:19,title:'Stosowanie wybranych znaczników języka HTML',
 subtitle:'Naprawisz zepsutą stronę pizzerii i zbudujesz własną wizytówkę z listą, tabelą i linkiem — taką, którą przeczyta też czytnik ekranu.',
 topic:'Znaczniki HTML: listy, tabele, linki, obrazki i dostępność',icon:'code',tags:['<table>','alt','napraw stronę'],duration:45,
 curriculum:'PP 2024 Informatyka – liceum/technikum, zakres podstawowy · II.2, II.3f: tworzenie strony WWW z użyciem znaczników HTML (nagłówki, listy, tabele, odnośniki, grafika); dostępność treści',
 format:{
  name:'Warsztat: napraw → podyktuj → zbuduj',
  student:'Najpierw poznasz najważniejsze znaczniki i naprawisz stronę pizzerii z 6 błędami. Potem w parze dyktujecie sobie kod, a na koniec budujesz wizytówkę sprawdzaną automatycznie według 7 kryteriów. Efekt: Twoja wizytówka na ekranie, gotowa do pokazania.',
  teacher:'Start: retrieval practice z lekcji 35 (title, poprawne zamykanie). Krótko nauczanie jawne: karty znaczników i dopasowanie. Potem „napraw zepsutą stronę” — uczeń widzi objawy (pogrubiona połowa strony, brak zdjęcia), szuka przyczyn w kodzie, a walidator i stopniowane podpowiedzi prowadzą do poprawy (feedback prowadzący do poprawy). Dyktowanie w parach to tutoring rówieśniczy z rolami: dyktujący czyta kartę, piszący nie widzi karty; zamiana po 3 minutach. Wizytówka to zadanie samodzielne z jawnymi kryteriami; ocenę produktu robisz przy komputerze ucznia w etapie 6.',
  grouping:'Etapy 1–3 i 5 samodzielnie. Etap 4 w parach (dyktujący i piszący, zamiana ról po 3 minutach, każdy pisze u siebie). Bez pary (nieparzysta liczba osób albo ktoś woli sam): uczeń czyta kartę, zamyka ją i pisze kod z pamięci — zadanie i punkty są te same.',
  methods:[
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Tutoring rówieśniczy (dyktowanie w parach)',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'},
   {name:'UDL — dostępność treści',url:'https://metodyka.covepolska.pl/metoda-udl.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'}
  ]
 },
 objectives:['Stosuję znaczniki list (<ul>, <ol>, <li>), tabeli (<table>, <tr>, <th>, <td>), odnośnika (<a href>) i obrazka (<img src alt>).','Znajduję i poprawiam typowe błędy: niezamknięty znacznik, złą ścieżkę obrazka, brak alt, pominięty poziom nagłówka.','Wyjaśniam, jak czytnik ekranu korzysta z alt, nagłówków i nagłówków tabeli.','Buduję wizytówkę, która spełnia jawne kryteria.'],
 materials:['Komputer z przeglądarką — jeden na osobę; edytor HTML na platformie, bez instalacji i bez konta','Projektor do pokazania kart znaczników i pierwszego błędu','Pary z sąsiadem z ławki przed etapem 4 (osoba bez pary pracuje sama)'],
 teacherGuide:{
  preparation:'Klucz do zepsutej strony: 1) </strong> po „we wtorki.”, 2) src="pizza.svg" zamiast ścieżki C:\\Users\\…, 3) alt z opisem pizzy, 4) <h3>Nasze pizze</h3> → <h2>, 5) <a href="…"> przy „Zamów online”, 6) pierwszy wiersz tabeli <th> zamiast <td>. Usunięcie treści nie zalicza błędu (symulator pilnuje, żeby akapity, menu, zdjęcie, tabela i link zostały). Ustal pary do dyktowania. Wizytówka: uczeń używa imienia lub pseudonimu i fikcyjnego e-maila — bez adresu i telefonu.',
  summary:'Uczeń stosuje listy, tabelę z <th>, link z href i obrazek z alt, naprawia 6 błędów zepsutej strony i buduje wizytówkę spełniającą 7 kryteriów. Na karcie wyniku: pytania, dopasowanie, naprawa, dyktando i wizytówka (maks. 20 pkt). Pytanie na wyjście: co usłyszy niewidomy użytkownik przy obrazku bez alt?'
 },
 sections:[
  {id:'start',label:'Start',title:'„Obraz, obraz, link, link”',grouping:'class',
   intro:'Tak brzmi wiele stron dla osoby, która korzysta z czytnika ekranu: bez opisów, bez nagłówków. Dziś zrobisz stronę, która „mówi” po ludzku. Najpierw dwa pytania z poprzedniej lekcji — bez notatek.',
   ...note(4,'Hak: jeśli masz możliwość, włącz na 20 sekund Narratora w Windows (Ctrl+Win+Enter) na dowolnej stronie bez alt — albo opisz, jak to brzmi. Potem dwa pytania powtórkowe bez notatek (retrieval practice); omów tylko błędne odpowiedzi.','Gdzie w kodzie jest tekst, który widać na karcie przeglądarki?','W znaczniku <title> w sekcji <head>.','Mylenie <title> (karta przeglądarki) z <h1> (tytuł na stronie) i zamykanie innym znacznikiem niż otwierającym.','Zapytaj, kto zna kogoś, kto korzysta z powiększenia ekranu, czytnika albo napisów — dostępność dotyczy wielu ludzi, nie tylko niewidomych.'),
   activities:[
    choice('w36-r1','Gdzie w kodzie trafia tekst widoczny na karcie przeglądarki (np. „Pizzeria Rondo – menu”)?',['Do <h1> w <body>','Do znacznika <title> w <head>','Do pierwszego akapitu <p>','Do nazwy pliku index.html'],[1],'<title> w <head> to tekst karty przeglądarki i tytuł w wynikach wyszukiwania. <h1> to tytuł widoczny na samej stronie.','Przypomnij sobie szkielet strony: co jest w <head>, a co w <body>?'),
    choice('w36-r2','Który zapis nagłówka jest poprawny?',['<h1>Menu<h1>','<h1>Menu</h2>','<h1>Menu</h1>','</h1>Menu<h1>'],[2],'Znacznik zamykający ma ukośnik i tę samą nazwę co otwierający: <h1>…</h1>.','Szukaj pary: ta sama nazwa, ukośnik tylko w zamykającym.')
   ]},
  {id:'znaczniki',label:'Znaczniki',title:'Sześć znaczników, które robią 90% strony',grouping:'class',
   intro:'Otwórz karty i zobacz, jak wygląda każdy znacznik w kodzie. Potem dopasuj znacznik do zadania.',
   reading:{title:'Atrybuty, które mają znaczenie',paragraphs:[
    'Link to <a href="adres">tekst linku</a>. Bez href napis wygląda zwyczajnie i nic się nie dzieje po kliknięciu. Adres może prowadzić do innej strony (https://…), do pliku w folderze strony (regulamin.html) albo do e-maila (mailto:ola@example.com).',
    'Tabela to <table>, wiersz to <tr>, komórka z danymi to <td>, a komórka nagłówka kolumny to <th>. Czytnik ekranu przy każdej komórce przeczyta nagłówek kolumny („Godziny: 12:00–22:00”) — ale tylko wtedy, gdy użyjesz <th>.'
   ],example:{question:'Jak zapisać link „Regulamin” do pliku regulamin.html?',answer:'<a href="regulamin.html">Regulamin</a> — adres w cudzysłowie w href, a tekst do kliknięcia między znacznikami.'}},
   ...note(7,'Nauczanie jawne: otwórz na projektorze 2–3 karty i przeczytaj kod na głos („a, href równa się…”). Zwróć uwagę na pary znaczników i atrybuty w cudzysłowie. Potem uczniowie sami dopasowują. Omów pozycję, która sprawiła najwięcej kłopotu.','Czym różni się <th> od <td>?','<th> to komórka nagłówka kolumny lub wiersza (np. „Dzień”), <td> to zwykła komórka z danymi. Czytnik ekranu korzysta z <th>, żeby powiedzieć, czego dotyczy komórka.','Pisanie <li> bez <ul>, alt w złym miejscu (poza <img>), href bez cudzysłowu z polskimi znakami i spacjami.','Pokaż <ol> zamiast <ul> i zapytaj, kiedy lista numerowana ma sens (przepis, instrukcja, ranking).'),
   activities:[
    reveal('w36-cards',[
     {title:'Lista',icon:'list',short:'<ul> <li>',text:'<ul> to lista punktowana, <ol> numerowana. Każdy punkt: <li>Margherita</li>. Wszystkie <li> muszą być w środku <ul> lub <ol>.'},
     {title:'Tabela',icon:'table',short:'<table> <tr> <th> <td>',text:'<table><tr><th>Dzień</th><th>Godziny</th></tr><tr><td>Pon.</td><td>12–22</td></tr></table>. Pierwszy wiersz z <th> to nagłówki kolumn.'},
     {title:'Link',icon:'globe',short:'<a href="…">',text:'<a href="menu.html">Zobacz menu</a>. Tekst linku mówi, dokąd prowadzi — „kliknij tutaj” niczego nie mówi czytnikowi ekranu.'},
     {title:'Obrazek',icon:'image',short:'<img src alt>',text:'<img src="pizza.svg" alt="Pizza z bazylią">. src to nazwa pliku z folderu strony, alt to opis słowami. Element nie ma znacznika zamykającego.'},
     {title:'Obrazek z podpisem',icon:'camera',short:'<figure> <figcaption>',text:'<figure><img src="gory.svg" alt="Szczyty w śniegu"><figcaption>Tatry, luty</figcaption></figure>. Podpis widzą wszyscy, alt — ci, którzy obrazka nie widzą.'},
     {title:'Wyróżnienie',icon:'warning',short:'<strong> <em>',text:'<strong> to coś ważnego (czytnik może to zaakcentować), <em> to akcent w zdaniu. Każde trzeba zamknąć — inaczej wyróżni się pół strony.'}
    ]),
    {type:'matching',id:'w36-match',question:'Który znacznik wybierzesz?',options:['<ul> i <li>','<table> i <th>','<a href="…">','<img alt="…">','<strong>'],rows:[
     {label:'Składniki pizzy wypisane w punktach',correct:[0],explanation:'Lista punktowana: <ul> z elementami <li>.'},
     {label:'Grafik dyżurów: dni w kolumnach, godziny w wierszach',correct:[1],explanation:'Dane w wierszach i kolumnach to tabela; nagłówki kolumn w <th>.'},
     {label:'Przejście do strony z regulaminem promocji',correct:[2],explanation:'Odnośnik <a> z adresem w href.'},
     {label:'Zdjęcie, które czytnik ekranu opisze słowami',correct:[3],explanation:'Obrazek z opisem w atrybucie alt.'},
     {label:'Słowo „GRATIS” jako ważna informacja',correct:[4],explanation:'<strong> oznacza ważny fragment tekstu.'}
    ]}
   ]},
  {id:'napraw',label:'Napraw',title:'Napraw stronę pizzerii',grouping:'solo',
   intro:'Kolega zrobił stronę pizzerii i „coś się rozjechało”. Lista po prawej opisuje objawy, nie przyczyny. Znajdź w kodzie, co je powoduje, i popraw. Podpowiedzi są stopniowane — każda zabiera trochę punktów za dany błąd.',
   ...note(10,'Pokaż pierwszy objaw (pogrubiona połowa strony) i głośno pomyśl: „pogrubienie robi <strong> — gdzie się zaczyna, gdzie powinno skończyć?”. Dalej uczniowie samodzielnie. Walidator (zwinięty pod edytorem) wskazuje linie — zachęcaj, żeby najpierw spróbowali sami, a dopiero potem go otworzyli. Krąż i pytaj o przyczynę, nie podawaj poprawki. Po 8 minutach zbierz: który błąd był najtrudniejszy?','Dlaczego ścieżka C:\\Users\\Kuba\\Pulpit\\pizza.svg nie działa na Twoim komputerze?','Bo prowadzi do pulpitu Kuby na jego dysku. Na innym komputerze (i w internecie) takiego pliku nie ma. Strona musi używać ścieżek względnych do plików z folderu strony, np. pizza.svg.','Usuwanie fragmentów zamiast naprawy (symulator tego nie zaliczy), zamknięcie <strong> w złym miejscu, zmiana <h1> zamiast <h3>, wpisanie alt="pizza.svg".','Szybsi: dodaj pod zdjęciem podpis <figure>/<figcaption> i drugi link „Regulamin promocji”.'),
   activities:[
    {type:'htmlLab',id:'w36-fix',mode:'fix',points:6,minDone:4,site:'pizzeria-rondo',title:'Zepsuta strona: 6 błędów',product:'Pizzeria Rondo',
     prompt:'Patrz na podgląd i zakładki „Czytnik ekranu” oraz „Konspekt”. Każdy objaw na liście ma jedną przyczynę w kodzie. Nie usuwaj treści — napraw ją.',
     html:BROKEN,keep:[{sel:'p',min:2,label:'akapitów'},{sel:'li',min:3,label:'pozycji menu'},{sel:'img',min:1,label:'zdjęcia pizzy'},{sel:'tr',min:3,label:'wierszy tabeli'},{sel:'a',min:1,label:'linku „Zamów online”'}],
     checks:[
      {id:'bold',type:'closed',tags:['strong'],label:'Od połowy strony wszystko jest pogrubione',hint:['Pogrubienie robi znacznik `<strong>`. Gdzie się otwiera i gdzie się zamyka?','Po „we wtorki.” dopisz `</strong>` — przed `</p>`.']},
      {id:'path',type:'images',alt:false,label:'Zdjęcie pizzy się nie wyświetla',hint:['Spójrz na `src`. Gdzie leży ten plik? Na pulpicie Kuby — u Ciebie go nie ma.','Zostaw samą nazwę pliku z folderu strony: `src="pizza.svg"`.']},
      {id:'alt',type:'images',exist:false,altMin:5,label:'Czytnik ekranu nie wie, co jest na zdjęciu',hint:['Otwórz zakładkę „Czytnik ekranu”. Co mówi przy obrazku?','Dopisz w `<img …>` atrybut z opisem, np. `alt="Pizza margherita z bazylią"`.']},
      {id:'head',type:'headings',label:'Konspekt przeskakuje z <h1> od razu na <h3>',hint:['Otwórz zakładkę „Konspekt”. Który nagłówek ma zły poziom?','„Nasze pizze” to rozdział, tak jak „Godziny otwarcia”. Zmień `<h3>` i `</h3>` na `<h2>` i `</h2>`.']},
      {id:'link',type:'links',label:'Napisu „Zamów online” nie da się kliknąć',hint:['Link bez adresu to zwykły tekst. Czego brakuje w `<a>`?','Dopisz adres: `<a href="zamowienia.html">Zamów online</a>`.']},
      {id:'th',type:'table',minTh:2,minRows:2,label:'Tabela godzin nie ma nagłówków kolumn',hint:['Pierwszy wiersz to opisy kolumn: „Dzień” i „Godziny”. Do tego służy `<th>`.','W pierwszym wierszu zamień oba `<td>` na `<th>` (i `</td>` na `</th>`).']}
     ],doneText:'Strona naprawiona!'}
   ]},
  {id:'dyktando',label:'Dyktando',title:'Dyktowanie HTML w parach',grouping:'pair',
   intro:'Osoba A otwiera kartę dyktującego i czyta ją na głos, nazywając znaczniki. Osoba B pisze kod u siebie, nie patrząc na kartę. Po 3 minutach zamiana: B dyktuje, A pisze na swoim komputerze. Każdy ma zaliczyć zadanie u siebie.',
   ...note(6,'Tutoring rówieśniczy z rolami: dyktujący nie dotyka klawiatury partnera i nie pokazuje karty — może tylko powtarzać i podpowiadać nazwami znaczników („teraz zamknij wiersz”). Daj sygnał zamiany po 3 minutach. Bez pary: uczeń czyta kartę sam, zamyka ją i pisze z pamięci.','Jak podyktować wiersz tabeli, żeby partner go dobrze zapisał?','Np.: „otwórz tr, komórka td Wtorek zamknij td, td 16:00, td Hala sportowa, zamknij tr”. Dyktujący nazywa znaczniki i pilnuje zamknięć.','Dyktowanie samej treści bez znaczników, zapominanie o </tr>, link bez href, nagłówki kolumn jako <td>.','Dla szybkich par: dodajcie trzeci wiersz (Sobota, 10:00, Basen) i podpis tabeli <caption>Grafik</caption>.'),
   activities:[
    {type:'htmlLab',id:'w36-dict',mode:'tasks',points:4,minDone:3,site:'klub-sportowy',title:'Grafik treningów z dyktanda',product:'Grafik treningów',
     prompt:'Piszesz to, co słyszysz. Dyktujący otwiera kartę poniżej — piszący jej nie czyta.',
     card:{title:'Karta dyktującego (osoba pisząca nie zagląda)',text:'Czytaj powoli i nazywaj znaczniki. Możesz powtarzać, nie pokazuj ekranu.\n\n1. Nagłówek drugiego stopnia: „Grafik treningów”.\n\n2. Tabela. Pierwszy wiersz to nagłówki kolumn: Dzień, Godzina, Miejsce.\n\n3. Wiersz: Wtorek, 16:00, Hala sportowa.\n\n4. Wiersz: Czwartek, 17:30, Boisko.\n\n5. Pod tabelą akapit z linkiem „Regulamin klubu” prowadzącym do pliku regulamin.html.'},
     html:DICT,
     checks:[
      {id:'h2',type:'text',sel:'h2',includes:['Grafik'],label:'Nagłówek <h2> „Grafik treningów”',hint:['`<h2>Grafik treningów</h2>`']},
      {id:'table',type:'table',minTh:3,minRows:2,label:'Tabela: 3 nagłówki <th> i 2 wiersze danych',hint:['Pierwszy wiersz: `<tr><th>Dzień</th><th>Godzina</th><th>Miejsce</th></tr>`.','Potem dwa wiersze z `<td>`, każdy w `<tr>…</tr>`.']},
      {id:'data',type:'exists',sel:'td',includes:['Wtorek','Czwartek','Hala','Boisko'],min:4,label:'Dni i miejsca zgadzają się z kartą',hint:['Poproś dyktującego o powtórzenie wierszy: Wtorek, 16:00, Hala sportowa oraz Czwartek, 17:30, Boisko.']},
      {id:'link',type:'attr',sel:'a',attr:'href',pattern:'regulamin\\.html',label:'Link „Regulamin klubu” prowadzi do regulamin.html',hint:['`<p><a href="regulamin.html">Regulamin klubu</a></p>`']}
     ],doneText:'Grafik zgodny z kartą — dyktando zaliczone.'}
   ]},
  {id:'wizytowka',label:'Wizytówka',title:'Twoja wizytówka (mini-CV)',grouping:'solo',
   intro:'Strona-wizytówka to coś, co możesz kiedyś wysłać pracodawcy przy praktykach albo pierwszej pracy. Zbuduj ją według komentarzy w kodzie. Kryteria sprawdzają się na bieżąco.',
   reading:{title:'Co wolno wpisać na wizytówkę?',paragraphs:[
    'Na stronie, którą może zobaczyć każdy, nie wpisuj adresu domowego, numeru telefonu, PESEL ani nazwy szkoły z klasą. Wystarczy imię albo pseudonim i kontakt przez e-mail — dziś fikcyjny, np. mailto:ola@example.com.',
    'W tabeli pokaż, kiedy masz czas (np. dni i godziny dla klientów albo trenera), w liście — co umiesz. Obrazek: zamiast swojego zdjęcia możesz użyć sylwetki (avatar.svg) albo obrazka z hobby.'
   ]},
   ...note(14,'Zadanie samodzielne z jawnymi kryteriami (ocenianie kształtujące). Przypomnij o danych osobowych: imię lub pseudonim, fikcyjny e-mail, bez adresu i telefonu. Krąż i dawaj jedną uwagę związaną z kryterium. Uczniowie, którzy skończą, pobierają plik .html i otwierają go w przeglądarce. Po 12 minutach poproś o sprawdzenie zakładki „Czytnik ekranu”: czy strona brzmi sensownie?','Co usłyszy osoba niewidoma przy Twojej tabeli, jeśli użyjesz <th>?','Czytnik powie, ile tabela ma wierszy i kolumn, i przy komórkach przeczyta nagłówki kolumn, np. „Dzień: wtorek, Godziny: 16–18”.','Wszystkie nagłówki jako <h1>, tabela bez <tr>, link bez href albo z adresem do dysku, wpisywanie prawdziwego telefonu.','Dla szybkich: <figure> z <figcaption> pod obrazkiem, lista numerowana „Moje cele na ten rok”, pobranie pliku i otwarcie go w przeglądarce.'),
   activities:[
    {type:'htmlLab',id:'w36-card',mode:'tasks',points:7,minDone:5,site:'wizytowka',title:'Wizytówka: 7 kryteriów',product:'Wizytówka',
     prompt:'Komentarze `<!-- … -->` w kodzie to plan strony (nie widać ich w podglądzie). Pod nimi wpisz kod. Używaj przycisków „Wstaw” nad edytorem, jeśli nie pamiętasz zapisu.',
     html:CARD,
     checks:[
      {id:'title',type:'text',sel:'title',not:['Wizytówka'],min:10,label:'<title> z imieniem/pseudonimem (min. 10 znaków)',hint:['Np. `<title>Ola – grafik i plakaty</title>`.']},
      {id:'head',type:'headings',minH2:2,label:'Jeden <h1> i co najmniej dwa rozdziały <h2> w dobrej kolejności',hint:['Na górze `<h1>` z imieniem, niżej rozdziały `<h2>`: „O mnie”, „Umiem”, „Kiedy mam czas”.']},
      {id:'list',type:'exists',sel:'li',min:3,label:'Lista z co najmniej 3 punktami <li>',hint:['`<ul>` i w środku trzy razy `<li>…</li>`. Przycisk „<ul>” wstawi gotowy wzór.']},
      {id:'table',type:'table',minTh:2,minRows:2,label:'Tabela z nagłówkami <th> i min. 2 wierszami danych',hint:['Pierwszy wiersz z `<th>` (np. Dzień, Godziny), potem co najmniej 2 wiersze z `<td>`.']},
      {id:'link',type:'links',label:'Link ma adres href',hint:['Np. `<a href="mailto:ola@example.com">Napisz do mnie</a>`.']},
      {id:'img',type:'images',altMin:5,label:'Obrazek z folderu strony z opisem alt',hint:['Rozwiń „Folder strony” pod edytorem i kliknij „Wstaw” przy obrazku. Potem uzupełnij `alt`.']},
      {id:'closed',type:'closed',minElements:8,label:'Wszystkie znaczniki są zamknięte',hint:['Otwórz „Walidator” pod edytorem — pokaże linię z niezamkniętym znacznikiem.']}
     ],doneText:'Wizytówka gotowa!'}
   ]},
  {id:'wynik',label:'Wynik',title:'Twój wynik i Twoja wizytówka',grouping:'class',
   intro:'Pokaż nauczycielowi wizytówkę (podgląd poniżej, przycisk „Pełny ekran”) i kartę wyniku. Jeśli chcesz zachować stronę, pobierz plik .html — po odświeżeniu edytor zaczyna od nowa.',
   ...note(4,'Obejrzyj wizytówki przy komputerach według kryteriów pod podglądem (brak / częściowo / w pełni). Zadaj pytanie na wyjście. Zapowiedz: następnym razem „przebierzemy” stronę — ten sam HTML, trzy różne wyglądy dzięki CSS.','Co usłyszy niewidomy użytkownik przy obrazku bez alt?','Nazwę pliku albo samo „obraz” — nie dowie się, co przedstawia. Z alt usłyszy opis, np. „Rower górski na leśnej ścieżce”.','„Alt to podpis pod zdjęciem” — alt nie jest widoczny na stronie, od podpisu jest <figcaption>.','Poproś, żeby uczeń zapisał jeden błąd z dzisiejszej naprawy, który sam też kiedyś zrobił.'),
   activities:[
    {type:'htmlLab',id:'w36-show',mode:'show',from:'w36-card',title:'Twoja wizytówka — pokaż ją nauczycielowi'},
    {type:'resultCard',id:'result',title:'Znaczniki HTML — wynik',sources:['w36-r1','w36-r2','w36-match','w36-fix','w36-dict','w36-card'],badges:[
     {min:0,name:'Pogrubiona połowa strony',text:'Bywa. Jeden niezamknięty znacznik i świat się rozjeżdża — następnym razem zamkniesz.'},
     {min:0.5,name:'Mechanik od HTML',text:'Naprawiasz cudze strony i budujesz swoje. Walidator może iść na przerwę.'},
     {min:0.85,name:'Strona, która mówi',text:'Alt, nagłówki, <th> — Twoją stronę przeczyta każdy, także czytnik ekranu. Klasa A.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz zbudować stronę z listą, tabelą, linkiem i obrazkiem z alt, a w zepsutym kodzie znajdziesz niezamknięty znacznik, złą ścieżkę i pominięty poziom nagłówka. Twoja strona jest czytelna także dla czytnika ekranu.'
};
