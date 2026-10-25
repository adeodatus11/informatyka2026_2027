import {note, choice} from '../schema.js';

export const CLUB = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Klub planszówek „Kostka”</title>
</head>
<body>
  <h1>Klub planszówek „Kostka”</h1>
  <p>Spotykamy się w piątki o 16:00 w sali 12.</p>
  <h2>W co gramy</h2>
  <ul>
    <li>gry kooperacyjne</li>
    <li>szybkie karcianki</li>
    <li>strategie na 2 godziny</li>
  </ul>
</body>
</html>
`;
const CLUB_CSS = `/* Przykład rozwiązany: kolor nagłówków h2 */
h2 {
  color: #7a2299;
}

/* Twoje reguły pisz poniżej */

`;

export const CONCERT = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Koncert „Głośno w sali 12”</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Koncert „Głośno w sali 12”</h1>
  <p>Piątek, 21 listopada, 17:00, aula.</p>
  <p class="bilet">Wstęp: 5 zł na schronisko</p>
  <footer>Samorząd uczniowski</footer>
</body>
</html>
`;
export const CONCERT_CSS = `body {
  background-color: #fffbe6
  font-size: 18px;
}

h1 {
  colour: #1f4fa3;
}

p {
  color: #c8c8c8;
}

footer {
  color: #555555;

.bilet {
  border: 3px dashed #d64545;
  padding: 8px;
}
`;

export const TEAM = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Nocne Sowy – drużyna e-sportowa</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Nocne Sowy</h1>
    <nav>
      <ul>
        <li><a href="#sklad">Skład</a></li>
        <li><a href="#mecze">Mecze</a></li>
        <li><a href="#rekrutacja">Rekrutacja</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h2 id="sklad">Skład</h2>
    <p>Pięć osób z klas 1–3. Trenujemy dwa razy w tygodniu.</p>
    <img src="pad.svg" alt="Pad do gier z kolorowymi przyciskami">
    <h2 id="mecze">Mecze</h2>
    <p>Następny mecz ligi szkolnej: piątek, 18:00.</p>
    <h2 id="rekrutacja">Rekrutacja</h2>
    <p><a class="przycisk" href="#rekrutacja">Dołącz do drużyny</a></p>
  </main>
  <footer>© 2026 Nocne Sowy · strona szkolnej drużyny</footer>
</body>
</html>
`;
const starter = (name, tip) => `/* Motyw ${name}: ten sam HTML, nowy wygląd.
   ${tip} */
body {

}
`;
const flex = {id:'flex',type:'css',sel:['nav ul','nav','header nav ul','header nav'],props:'display',test:'equals',value:['flex','inline-flex','grid'],label:'Menu w jednym rzędzie (display: flex)',hint:['Menu to lista `<ul>` w `<nav>`. Dopisz regułę `nav ul { display: flex; gap: 16px; }`.']};
const contrast = {id:'contrast',type:'contrast',sel:'body',needBg:true,min:4.5,label:'Kontrast tekstu do tła co najmniej 4,5:1',hint:['Kontrast liczy się z koloru tekstu (`color`) i tła (`background-color`) w body. Na ciemnym tle ustaw jasny tekst, na jasnym — ciemny.','Bezpieczne pary: `#f2f2f2` na `#121212` albo `#2b2118` na `#f4ecd8`.']};
const bgDark = {id:'bg',type:'css',sel:'body',props:['background-color','background'],test:'dark',label:'Ciemne tło strony (body)',hint:['`body { background-color: #121212; }` — im mniejsze liczby w kodzie koloru, tym ciemniej.']};

export default {
 id:'37',grade:1,order:20,title:'Kaskadowe arkusze stylów CSS',
 subtitle:'Ten sam HTML, trzy zupełnie różne strony: „przebierzesz” stronę drużyny w retro, dark mode albo gaming — i nauczysz się, dlaczego kontrast to nie fanaberia.',
 topic:'CSS: reguły, selektory, kolory, kontrast i prosty układ',icon:'palette',tags:['selektor { }','kontrast 4,5:1','dark mode'],duration:45,
 curriculum:'PP 2024 Informatyka – liceum/technikum, zakres podstawowy · II.2, II.3f: formatowanie strony WWW za pomocą kaskadowych arkuszy stylów (selektory, właściwości, kolory, czcionki, odstępy, prosty układ)',
 format:{
  name:'Przebieranki: jeden HTML, trzy motywy',
  student:'Poznasz budowę reguły CSS na przykładzie, naprawisz zepsuty arkusz, a potem „przebierzesz” stronę drużyny e-sportowej w wybrany motyw. Na koniec krótki pokaz kilku motywów na projektorze i jedna poprawka u siebie. Efekt: Twój motyw na ekranie i kontrast policzony przez edytor.',
  teacher:'Start: retrieval z lekcji 36 i pomost do Worda: styl w Wordzie = reguła CSS (zmieniasz raz, zmienia się wszędzie). Nauczanie jawne na przykładzie rozwiązanym (reguła h2 w arkuszu), potem samodzielnie 4 reguły z automatycznym sprawdzaniem. Naprawa zepsutego arkusza ćwiczy czytanie błędów (średnik, literówka, klamra, kontrast). Główna część to zadanie z wyborem (UDL: trzy motywy, ta sama poprzeczka — 5 jawnych kryteriów, w tym kontrast). Na koniec pokazujesz na projektorze 2–3 motywy chętnych osób i komentujesz je jedną uwagą związaną z kryterium (kontrast, czytelność); każdy sprawdza swój motyw według tych samych kryteriów i ma minutę na jedną poprawkę (feedback prowadzący do poprawy). Głosowanie na najlepszy motyw, jeśli je robisz, nie wpływa na ocenę.',
  grouping:'Praca samodzielna. Etap 5: pokaz kilku motywów na projektorze dla całej klasy, potem każdy poprawia jedną rzecz u siebie. Zerknięcie na motyw sąsiada jest dozwolone, ale nie organizujemy oceniania się nawzajem.',
  methods:[
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'UDL — wybór motywu przy wspólnych kryteriach',url:'https://metodyka.covepolska.pl/metoda-udl.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'}
  ]
 },
 objectives:['Zapisuję regułę CSS: selektor { właściwość: wartość; } i podłączam arkusz style.css do strony.','Ustawiam kolory tła i tekstu, czcionkę, wielkość pisma, ramkę i zaokrąglenie.','Sprawdzam kontrast tekstu do tła (min. 4,5:1) i poprawiam nieczytelne kolory.','Znajduję błędy w arkuszu: brak średnika, literówkę we właściwości, brak klamry.'],
 materials:['Komputer z przeglądarką — jeden na osobę; edytor HTML/CSS na platformie, bez instalacji i bez konta','Projektor do przykładu rozwiązanego','Opcjonalnie: karteczki do głosowania na najlepszy motyw (bez wpływu na ocenę)'],
 teacherGuide:{
  preparation:'Klucz do zepsutego arkusza: 1) średnik po #fffbe6, 2) colour → color, 3) kolor akapitów ciemniejszy (np. #333333, kontrast ≥ 4,5:1), 4) klamra } po regule footer. Motywy sprawdzają się automatycznie (5 kryteriów, liczy się najlepszy motyw). Kontrast edytor liczy z kolorów w arkuszu (wzór WCAG), bez odczytu z podglądu. Przygotuj karteczki do głosowania, jeśli chcesz je zrobić.',
  summary:'Uczeń podłącza style.css, pisze reguły dla body, h1 i p, naprawia 4 błędy arkusza i tworzy motyw spełniający kryteria (w tym kontrast ≥ 4,5:1). Na karcie wyniku: pytania, reguły, naprawa i motyw (maks. 16 pkt). Pytanie na wyjście: dlaczego zmiana jednej reguły h2 zmienia wszystkie nagłówki?'
 },
 sections:[
  {id:'start',label:'Start',title:'Ta sama strona, inne ubranie',grouping:'class',
   intro:'Twoja wizytówka z poprzedniej lekcji działa, ale wygląda jak z 1995 roku. Za wygląd odpowiada CSS — i działa jak style w Wordzie. Najpierw trzy pytania bez notatek.',
   ...note(4,'Hak: pokaż na projektorze stronę drużyny z etapu 4 bez stylów, a potem przełącz motyw (możesz wcześniej przygotować jeden). Trzy pytania powtórkowe bez notatek; omów tylko błędne. Przy pytaniu o Worda zatrzymaj się: „styl Nagłówek 1 = reguła h1 w CSS”.','Co się dzieje w Wordzie, gdy zmienisz wygląd stylu Nagłówek 1?','Zmieniają się naraz wszystkie nagłówki oznaczone tym stylem. Reguła h1 w CSS działa tak samo dla wszystkich <h1> na stronie.','Uczniowie mylą treść z wyglądem: chcą zmieniać kolor w HTML zamiast w CSS albo uważają, że <h3> to „mniejsza czcionka”.','Zapytaj, kto ma w telefonie dark mode i dlaczego — to też tylko inny arkusz stylów.'),
   activities:[
    choice('w37-r1','Który obrazek zadziała na każdym komputerze i opisze się czytnikowi ekranu?',['<img src="C:\\Users\\Ola\\kot.svg" alt="kot">','<img src="kot.svg">','<img src="kot.svg" alt="Rudy kot śpi na parapecie">','<img alt="Rudy kot śpi">'],[2],'Ścieżka względna (plik z folderu strony) i opis w alt. Ścieżka C:\\Users… działa tylko u Oli, a bez src nie ma czego pokazać.','Potrzebujesz dwóch rzeczy: pliku, który istnieje w folderze strony, i opisu słowami.'),
    choice('w37-r2','Na stronie jest <h1>, a pod nim od razu <h3>. Co jest nie tak?',['Nic — cyfra oznacza tylko wielkość czcionki','Pominięty poziom: po <h1> powinien przyjść <h2>','<h3> musi stać przed <h1>','Na stronie może być tylko jeden nagłówek'],[1],'Nagłówki tworzą konspekt jak w Wordzie: 1 → 2 → 3. Wielkość czcionki ustawisz w CSS, nie cyfrą w nagłówku.','Pomyśl o konspekcie (okienku nawigacji w Wordzie).'),
    choice('w37-r3','W Wordzie zmieniasz raz wygląd stylu „Nagłówek 1” na niebieski. Co się dzieje?',['Zmienia się tylko zaznaczony nagłówek','Niebieskie robią się wszystkie nagłówki ze stylem Nagłówek 1','Word pyta przy każdym nagłówku osobno','Zmienia się cały tekst dokumentu'],[1],'Tak samo działa CSS: reguła h1 { color: blue; } zmienia wszystkie <h1> na stronie naraz. To oszczędza godziny poprawek.','Po co w ogóle są style, zamiast ręcznego formatowania?')
   ]},
  {id:'regula',label:'Reguła CSS',title:'Anatomia reguły CSS',grouping:'solo',
   intro:'Najpierw przykład rozwiązany w arkuszu (reguła dla h2). Potem napiszesz cztery reguły sam. Kryteria sprawdzają się na bieżąco.',
   reading:{title:'Selektor, właściwość, wartość',paragraphs:[
    'Reguła CSS to: selektor { właściwość: wartość; }. Selektor mówi, czego dotyczy reguła (h1 — wszystkie nagłówki h1, body — cała strona, .bilet — elementy z class="bilet"). W klamrach wypisujesz deklaracje, każdą zakończoną średnikiem: color: #1f4fa3; background-color: #fdf6e3; font-size: 18px; font-family: Georgia, serif;.',
    'Arkusz to osobny plik style.css. Podłączasz go w <head>: <link rel="stylesheet" href="style.css">. „Kaskadowe”, bo reguły spływają w dół: kolor ustawiony dla body dziedziczą akapity w środku, a gdy dwie reguły się kłócą, wygrywa ta bardziej szczegółowa albo późniejsza. Kolory zapisujesz nazwą (navy) albo kodem #RRGGBB.'
   ],example:{question:'Przykład rozwiązany: jak pokolorować wszystkie nagłówki h2 na fioletowo?',answer:'h2 { color: #7a2299; } — selektor h2, właściwość color, wartość #7a2299, średnik na końcu deklaracji. Działa dla każdego <h2> na stronie.'}},
   ...note(9,'Nauczanie jawne: pokaż zakładkę style.css z gotową regułą h2 i przeczytaj ją na głos. Zapytaj, dlaczego nic się nie zmienia w podglądzie (arkusz nie jest podłączony!) — dopisz <link> razem z klasą. Potem uczniowie sami piszą reguły dla body, h1 i p. Przyciski „Wstaw” nad edytorem dają wzór reguły.','Dlaczego reguła h2 w style.css na początku nic nie zmienia na stronie?','Bo arkusz nie jest podłączony: w <head> brakuje <link rel="stylesheet" href="style.css">. Przeglądarka nie wie, że ma go wczytać.','Brak średnika między deklaracjami, polskie lub brytyjskie nazwy właściwości (kolor, colour), dwukropek zamiast klamry, reguły wpisane w HTML zamiast w style.css.','Pokaż kaskadę: dopisz p { color: red; } pod body { color: navy; } i zapytaj, który kolor wygra dla akapitów i dlaczego.'),
   activities:[
    {type:'htmlLab',id:'w37-rules',mode:'tasks',points:4,minDone:3,cssTab:true,site:'klub-kostka',title:'Cztery reguły dla klubu planszówek',product:'Klub planszówek',
     prompt:'1) W `index.html` podłącz arkusz: w `<head>` dopisz `<link rel="stylesheet" href="style.css">`. 2) W zakładce `style.css` dopisz reguły: tło dla `body`, kolor dla `h1` i wielkość pisma akapitów (`p`) co najmniej 16px.',
     html:CLUB,css:CLUB_CSS,download:false,
     checks:[
      {id:'link',type:'linked',label:'Arkusz style.css jest podłączony w <head>',hint:['W `<head>`, pod `<title>`, dopisz: `<link rel="stylesheet" href="style.css">`.']},
      {id:'bg',type:'css',sel:'body',props:['background-color','background'],test:'color',label:'body ma kolor tła',hint:['W style.css: `body { background-color: #fdf6e3; }`.']},
      {id:'h1',type:'css',sel:'h1',props:'color',test:'color',label:'h1 ma własny kolor',hint:['`h1 { color: #1f4fa3; }` — wzór masz w regule h2 na górze arkusza.']},
      {id:'p',type:'css',sel:['p','body'],props:'font-size',test:'minPx',value:16,label:'Tekst akapitów ma co najmniej 16 px',hint:['`p { font-size: 18px; }` — bez spacji między liczbą a px.']}
     ],doneText:'Reguły działają — klub ma swój wygląd.'}
   ]},
  {id:'napraw',label:'Napraw CSS',title:'Napraw arkusz plakatu koncertu',grouping:'solo',
   intro:'Ktoś napisał arkusz w pośpiechu: tekst jest mały, nagłówek nie ma koloru, akapity prawie znikają, a bilet nie ma ramki. Lista po prawej to objawy. Przyczyny są w style.css (HTML jest zablokowany).',
   reading:{title:'Kontrast: czy da się to przeczytać?',paragraphs:[
    'Kontrast to stosunek jasności tekstu i tła — od 1:1 (biały na białym) do 21:1 (czarny na białym). Wytyczne dostępności WCAG wymagają dla zwykłego tekstu co najmniej 4,5:1. Jasnoszary #c8c8c8 na kremowym tle ma ok. 1,6:1 — na projektorze albo w słońcu na telefonie tekst znika.',
    'Przeglądarka po cichu pomija to, czego nie rozumie. Brak średnika „skleja” dwie deklaracje w jedną, literówka we właściwości (colour) sprawia, że cała deklaracja jest ignorowana, a brak klamry „połyka” następną regułę. Walidator pod edytorem pokazuje takie miejsca z numerem linii.'
   ]},
   ...note(7,'Pokaż pierwszy objaw i głośno pomyśl: „font-size jest wpisany — dlaczego nie działa? co jest w linii wyżej?”. Dalej uczniowie samodzielnie, z walidatorem i stopniowanymi podpowiedziami. Przy kontraście powiedz: liczba 4,5:1 to standard, nie gust.','Dlaczego font-size: 18px nie działa, choć jest wpisany poprawnie?','Bo w linii wyżej brakuje średnika — przeglądarka czyta „#fffbe6 font-size: 18px” jako jedną, błędną wartość i pomija rozmiar.','Szukanie błędu w linii, którą wskazuje objaw, a nie wyżej; zmiana koloru tła zamiast tekstu przy kontraście; dopisanie klamry w złym miejscu.','Zapytaj, jaki kontrast ma Twój ulubiony serwis w dark mode i jak to sprawdzić (narzędzia F12 pokazują kontrast przy kolorze tekstu).'),
   activities:[
    {type:'htmlLab',id:'w37-fixcss',mode:'fix',points:4,minDone:3,cssTab:true,lockHtml:true,startTab:'css',site:'koncert-sala-12',title:'Zepsuty arkusz: 4 błędy',product:'Plakat koncertu',
     prompt:'Popraw `style.css`. Podgląd zmienia się na żywo.',
     html:CONCERT,css:CONCERT_CSS,download:false,
     checks:[
      {id:'semi',type:'css',sel:'body',props:'font-size',test:'minPx',value:16,label:'Tekst jest mały, choć w CSS wpisano 18px',hint:['Spójrz na regułę body. Czym musi się kończyć każda deklaracja?','Po `background-color: #fffbe6` brakuje średnika `;`.']},
      {id:'typo',type:'css',sel:'h1',props:'color',test:'color',label:'Nagłówek miał być niebieski, a jest czarny',hint:['Przeglądarka nie zna właściwości o tej nazwie. Sprawdź pisownię.','CSS używa pisowni amerykańskiej: `color`, nie `colour`.']},
      {id:'contrast',type:'contrast',sel:'p',min:4.5,label:'Akapity prawie znikają na tle',hint:['Kontrast musi wynosić co najmniej 4,5:1. Zmień kolor tekstu w regule `p`.','Wpisz ciemniejszy kolor, np. `color: #333333;`.']},
      {id:'brace',type:'css',sel:'.bilet',props:['border','border-style'],test:'nonzero',label:'Bilet miał mieć czerwoną ramkę — nie ma jej',hint:['Reguła `.bilet` wygląda dobrze. A czy reguła nad nią się zamyka?','Po `color: #555555;` w regule footer brakuje klamry `}`.']}
     ],doneText:'Arkusz naprawiony!'}
   ]},
  {id:'motyw',label:'Przebierz stronę',title:'Przebierz stronę drużyny: retro, dark albo gaming',grouping:'solo',
   intro:'HTML strony drużyny „Nocne Sowy” jest gotowy i zablokowany. Wybierz motyw i napisz dla niego arkusz. Każdy motyw ma 5 kryteriów — możesz spróbować kilku, liczy się najlepszy. Kontrast musi być co najmniej 4,5:1.',
   reading:{title:'Ściąga: właściwości do motywu',paragraphs:[
    'Kolory: background-color (tło), color (tekst). Pismo: font-family: Georgia, serif; (szeryfowe), "Courier New", monospace; (maszynowe), font-size, font-weight: bold;, text-transform: uppercase; (WIELKIE LITERY). Ramki i rogi: border: 3px solid #333;, border-bottom: …, border-radius: 12px;. Odstępy: padding (w środku), margin (na zewnątrz).',
    'Menu w jednym rzędzie: nav ul { display: flex; gap: 16px; list-style: none; }. Elementy z klasą wybierasz kropką: .przycisk { … } zmieni tylko link z class="przycisk". Selektor z odstępem, np. nav a, oznacza „linki wewnątrz nav”.'
   ]},
   ...note(16,'Zadanie z wyborem (UDL): trzy motywy, wspólna poprzeczka (5 kryteriów i kontrast). Pokaż przełączanie motywów — każdy ma osobny arkusz, więc można próbować bez kasowania pracy. Krąż i pytaj o kryteria, nie o gust („jaki masz kontrast? co musisz zmienić?”). Szybsi: drugi motyw albo dodatki (hover, cień, odstępy). Po 14 minutach zapowiedz pokaz motywów.','Masz ciemne tło i kontrast 1,3:1. Co zmieniasz?','Kolor tekstu w body na jasny (np. #f2f2f2) — domyślny tekst jest czarny, a czarny na ciemnym tle jest nieczytelny.','Pisanie właściwości po polsku, brak klamry, ustawianie koloru tylko dla h1 i zostawienie czarnego tekstu na ciemnym tle, selektor przycisk bez kropki.','Dla szybkich: a:hover { … } (zmiana koloru po najechaniu), box-shadow na przycisku, max-width i margin: auto dla main.'),
   activities:[
    {type:'htmlLab',id:'w37-theme',mode:'theme',points:5,minDone:3,site:'nocne-sowy',title:'Motyw dla drużyny „Nocne Sowy”',product:'Strona drużyny',
     prompt:'Kliknij motyw, a potem pisz w `style.css`. Przyciski „Wstaw” dają wzory reguł. HTML możesz czytać (zakładka `index.html`), ale nie zmieniasz go — na tym polega ćwiczenie.',
     html:TEAM,
     themes:[
      {id:'retro',name:'Retro',desc:'Jak gazeta z lat 80.: jasne, ciepłe tło, czcionka szeryfowa albo maszynowa, ramki.',swatch:['#f4ecd8','#2b2118','#8b2e16'],css:starter('RETRO','Zacznij od body: jasne, ciepłe tło (np. #f4ecd8), ciemny tekst i czcionka Georgia, serif.'),checks:[
       {id:'bg',type:'css',sel:'body',props:['background-color','background'],test:'light',label:'Jasne tło strony (body)',hint:['`body { background-color: #f4ecd8; }` — kremowy, jak stary papier.']},
       {id:'font',type:'css',sel:['body','h1','header h1'],props:'font-family',pattern:'(^|[\\s,"\'])(serif|georgia|garamond|times|courier|monospace|palatino)',label:'Czcionka szeryfowa albo maszynowa',hint:['`font-family: Georgia, serif;` albo `font-family: "Courier New", monospace;` w body.']},
       {id:'border',type:'css',sel:['h1','header','header h1'],props:['border','border-bottom','border-top'],test:'nonzero',label:'Ramka przy nagłówku albo w header',hint:['`header { border-bottom: 4px double #2b2118; }`']},
       contrast,flex]},
      {id:'dark',name:'Dark mode',desc:'Ciemne tło, jasny tekst, wyraziste linki — dla oczu wieczorem.',swatch:['#121212','#f2f2f2','#4fc3f7'],css:starter('DARK MODE','Zacznij od body: ciemne tło (np. #121212) i jasny tekst (np. #f2f2f2).'),checks:[
       bgDark,
       {id:'text',type:'css',sel:'body',props:'color',test:'light',label:'Jasny kolor tekstu (body)',hint:['`body { color: #f2f2f2; }` — bez tego tekst zostanie czarny na czarnym.']},
       contrast,
       {id:'links',type:'css',sel:['a','nav a','main a'],props:'color',test:'colorful',label:'Linki w wyrazistym kolorze',hint:['`a { color: #4fc3f7; }` — jasny błękit dobrze widać na ciemnym tle.']},
       flex]},
      {id:'gaming',name:'Gaming',desc:'Neon na ciemnym tle, WIELKIE LITERY, zaokrąglony przycisk.',swatch:['#0b0f1a','#39ff14','#ff2bd6'],css:starter('GAMING','Zacznij od body: bardzo ciemne tło (np. #0b0f1a) i jasny tekst. Potem neonowy h1.'),checks:[
       bgDark,
       {id:'neon',type:'css',sel:['h1','header h1'],props:'color',test:'colorful',label:'Neonowy kolor nagłówka h1',hint:['`h1 { color: #39ff14; }` — jaskrawa zieleń; spróbuj też #ff2bd6.']},
       {id:'upper',type:'css',sel:['h1','header h1'],props:'text-transform',test:'equals',value:['uppercase'],label:'Nagłówek h1 WIELKIMI LITERAMI',hint:['`text-transform: uppercase;` w regule h1. Treść w HTML zostaje bez zmian!']},
       {id:'radius',type:'css',sel:['.przycisk','a.przycisk','main .przycisk'],props:'border-radius',test:'nonzero',label:'Przycisk .przycisk ma zaokrąglone rogi',hint:['`.przycisk { border-radius: 12px; padding: 8px 16px; background-color: #ff2bd6; color: #0b0f1a; }`']},
       contrast]}
     ],doneText:'Motyw spełnia kryteria!'}
   ]},
  {id:'galeria',label:'Galeria',title:'Pokaz motywów i jedna poprawka',grouping:'class',
   intro:'Nauczyciel pokaże na projektorze kilka motywów i powie przy każdym jedną konkretną uwagę związaną z kryterium (np. „linki są za ciemne na tym tle”). Sprawdź tę samą rzecz u siebie i popraw jedną rzecz w swoim motywie.',
   ...note(5,'Pokaz: 2–3 motywy chętnych osób na projektorze (2–3 minuty), przy każdym jedna uwaga związana z kryterium, potem 1–2 minuty na poprawkę u siebie. Uwagi dotyczą kryteriów (kontrast, czytelność, spójność kolorów), a nie gustu. Jeśli robisz głosowanie na najlepszy baner, zbierz karteczki — bez wpływu na ocenę. Checklista to deklaracja ucznia, nie automatyczne sprawdzenie.','Jak brzmi dobra uwaga do cudzego motywu?','Konkretnie i z kryterium: „tekst w stopce ma za słaby kontrast — przyciemnij tło albo rozjaśnij tekst”. Nie „brzydkie” ani „spoko”.','Uwagi o gustach („nie lubię różowego”), brak czasu na własną poprawkę, poprawka „na oko” bez sprawdzenia kontrastu w edytorze.','Zapytaj klasę, który motyw najlepiej sprawdziłby się na projektorze i dlaczego (kontrast, wielkość pisma).',true),
   activities:[
    {type:'checklist',id:'w37-gallery',items:['Obejrzałem/obejrzałam pokazane motywy i uwagi nauczyciela','Sprawdziłem/sprawdziłam swój motyw według tych samych kryteriów (kontrast, czytelność, spójność)','Poprawiłem/poprawiłam jedną rzecz w swoim motywie i sprawdziłem/sprawdziłam kontrast w edytorze'],explanation:'To Twoja deklaracja — nauczyciel może poprosić, żebyś pokazał, co poprawiłeś.'}
   ]},
  {id:'wynik',label:'Wynik',title:'Twój wynik i Twój motyw',grouping:'class',
   intro:'Pokaż nauczycielowi swój najlepszy motyw (podgląd poniżej) i kartę wyniku.',
   ...note(4,'Obejrzyj motywy przy komputerach według kryteriów pod podglądem. Zadaj pytanie na wyjście. Zapowiedz: na ostatniej lekcji z WWW przygotujemy stronę do publikacji — tytuł, opis w Google i to, co wolno pokazać w internecie.','Dlaczego zmiana jednej reguły h2 zmienia wszystkie nagłówki na stronie?','Bo selektor h2 wybiera każdy element <h2>. Reguła działa jak styl w Wordzie — zmieniasz raz, zmienia się wszędzie.','„Trzeba zmienić każdy nagłówek osobno” — to właśnie robi się bez CSS (jak ręczne formatowanie w Wordzie).','Poproś, żeby uczeń zapisał kod koloru tła i tekstu ze swojego motywu oraz kontrast.'),
   activities:[
    {type:'htmlLab',id:'w37-show',mode:'show',from:'w37-theme',title:'Twój motyw — pokaż go nauczycielowi'},
    {type:'resultCard',id:'result',title:'CSS — wynik',sources:['w37-r1','w37-r2','w37-r3','w37-rules','w37-fixcss','w37-theme'],badges:[
     {min:0,name:'Czarne na czarnym',text:'Strona jeszcze się ukrywa. Kontrast, średnik, klamra — i będzie widać.'},
     {min:0.5,name:'Stylista stron',text:'Twoja strona ma już styl. Jeszcze kilka kryteriów i można ją wypuścić w świat.'},
     {min:0.85,name:'Dark mode legend',text:'Jeden HTML, Twój styl, kontrast jak z podręcznika. Graficy z agencji nerwowo zerkają.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz podłączyć arkusz style.css, napisać regułę selektor { właściwość: wartość; }, naprawić brakujący średnik lub klamrę i dobrać kolory z kontrastem co najmniej 4,5:1. Ten sam HTML może wyglądać na sto sposobów.'
};
