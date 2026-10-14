import {note, choice} from '../schema.js';

// Strona fikcyjnego serwisu rowerowego: problemy z SEO (title, opis, h1, lang) i z gotowością do publikacji
// (ścieżka do dysku, brak alt, dane klienta, hasło w komentarzu, pusta stopka, brak viewport).
export const BIKE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Strona główna</title>
</head>
<body>
  <h1>Witamy!</h1>
  <p>Naprawiamy rowery miejskie, górskie i elektryczne. Przegląd w 24 godziny.</p>
  <img src="C:\\Users\\Kuba\\Pulpit\\rower.svg">
  <h2>Cennik</h2>
  <ul>
    <li>Przegląd podstawowy – 60 zł</li>
    <li>Wymiana dętki – 25 zł</li>
    <li>Regulacja hamulców – 30 zł</li>
  </ul>
  <h2>Opinie klientów</h2>
  <p>„Rower jak nowy!” – Marek Nowak, ul. Lipowa 12, Kalisz</p>
  <!-- hasło do panelu sklepu: szprycha123 -->
  <p>Serwis rowerowy Szprycha, Kalisz, ul. Rowerowa 1. Pon.–Pt. 9:00–17:00.</p>
  <footer>Stopka</footer>
</body>
</html>
`;

export default {
 id:'38',grade:1,order:21,title:'Publikowanie i promowanie stron WWW w Internecie',
 subtitle:'Dowiesz się, jak strona trafia do internetu i do wyników wyszukiwania, co wolno na niej pokazać — i przygotujesz stronę serwisu rowerowego tak, żeby klienci ją znaleźli.',
 topic:'Hosting, domena, DNS, SEO i bezpieczna publikacja',icon:'search',tags:['domena i DNS','<title> + opis','RODO i licencje'],duration:45,
 curriculum:'PP 2024 Informatyka – liceum/technikum, zakres podstawowy · II.2, II.3f: przygotowanie strony WWW do publikacji (title, meta description, ścieżki względne); III.4: hosting, domena, DNS; V.1, V.2: prawo autorskie, ochrona wizerunku i danych osobowych przy publikacji',
 format:{
  name:'Przypadek: strona, której nikt nie znajduje',
  student:'Właściciel serwisu rowerowego narzeka: „Mam stronę, a klienci jej nie znajdują”. Najpierw zobaczysz, jak strona trafia do internetu, potem rozstrzygniesz, co wolno opublikować, a na koniec poprawisz jego stronę: wynik w wyszukiwarce i listę kontrolną przed publikacją. Efekt: strona gotowa do wysłania na serwer i podgląd jej wyniku w wyszukiwarce.',
  teacher:'Start: retrieval z lekcji 37 (reguła CSS, kontrast). Nauczanie jawne: schemat publikacji (pliki → hosting → domena → DNS → przeglądarka) z dopasowaniem pojęć. Etap prawny jako krótkie przypadki (wizerunek, licencje, dane osobowe) w parach z rozstrzygnięciem i uzasadnieniem. Główna część to przypadek właściciela serwisu (problem, projekt i przypadek): uczeń poprawia <title>, opis i nagłówek, obserwując symulowany wynik wyszukiwania, a potem przechodzi listę kontrolną przed publikacją sprawdzaną automatycznie. Strona nie jest publikowana — zgodnie z ustaleniem żyje w przeglądarce ucznia, a ocenę robisz przy jego komputerze.',
  grouping:'Etapy 1, 2, 4, 5 samodzielnie. Etap 3 w parach: najpierw każdy rozstrzyga sam, potem para porównuje odpowiedzi i uzasadnia różnice. Bez pary — porównanie z wyjaśnieniami po sprawdzeniu.',
  methods:[
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Nauczanie dialogowe (przypadki prawne w parach)',url:'https://metodyka.covepolska.pl/metoda-nauczanie-dialogowe.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Wyjaśniam, czym są hosting, domena i DNS i co trzeba zrobić, żeby strona była dostępna w internecie.','Piszę <title> i <meta name="description"> tak, żeby wynik w wyszukiwarce mówił, co i gdzie.','Rozstrzygam, co wolno opublikować: wizerunek, dane osobowe, cudze zdjęcia i grafiki na licencji.','Przygotowuję stronę do publikacji według listy kontrolnej: ścieżki, alt, brak prywatnych danych, stopka z licencją.'],
 materials:['Komputer z przeglądarką — jeden na osobę; edytor HTML na platformie, bez instalacji i bez konta (strony nie publikujemy)','Projektor do schematu publikacji','Opcjonalnie: wydruk listy kontrolnej przed publikacją (jest też w edytorze)'],
 teacherGuide:{
  preparation:'Zgodnie z ustaleniem strony uczniów nie są publikowane — temat realizujemy jako przygotowanie do publikacji i omówienie hostingu. Klucz SEO: tytuł 20–60 znaków ze słowem „rower…” i „Kalisz”, opis 70–160 znaków, <h1> zamiast „Witamy!”, <html lang="pl">. Klucz listy kontrolnej: src="rower.svg" z alt, usunięty adres klienta (wystarczy „Marek z Kalisza”), usunięty komentarz z hasłem, stopka z autorem i licencją (np. „© 2026 Szprycha” albo „CC BY 4.0”), <meta name="viewport" content="width=device-width, initial-scale=1">. Przepisy przed lekcją warto sprawdzić u źródła: art. 81 ustawy o prawie autorskim (wizerunek) i opis licencji na creativecommons.pl.',
  summary:'Uczeń opisuje drogę strony do internetu (hosting, domena, DNS), rozstrzyga przypadki publikacji (wizerunek, licencje, dane osobowe), poprawia wynik wyszukiwania (title, description, h1, lang) i przechodzi listę kontrolną przed publikacją. Na karcie wyniku: pytania, dopasowania, przypadki, SEO i lista kontrolna (maks. 17 pkt). Pytanie na wyjście: co sprawdzisz na stronie, zanim wyślesz ją na serwer?'
 },
 sections:[
  {id:'start',label:'Start',title:'„Mam stronę, a nikt jej nie znajduje”',grouping:'class',
   intro:'Pan Tomek z serwisu rowerowego Szprycha ma stronę od roku. Wpisuje w wyszukiwarkę „serwis rowerowy Kalisz” i… widzi konkurencję, a swoją stronę jako „Strona główna”. Dziś to naprawisz. Najpierw dwa pytania z lekcji o CSS, bez notatek.',
   ...note(4,'Hak: opowiedz przypadek pana Tomka (fikcyjny). Zapytaj, co uczniowie wpisują, szukając fryzjera albo pizzy w okolicy, i czy klikają wynik „Strona główna”. Dwa pytania powtórkowe bez notatek; omów tylko błędne.','Co wpisujesz w wyszukiwarkę, gdy szukasz usługi w swoim mieście?','Co i gdzie: „fryzjer Kalisz”, „pizza dowóz Kalisz”. Dlatego tytuł strony powinien zawierać właśnie takie słowa.','Uczniowie myślą, że wystarczy mieć stronę, żeby była na górze wyników, albo że za pozycję zawsze trzeba zapłacić.','Zapytaj, czy ktoś kliknął kiedyś wynik oznaczony jako „Sponsorowane” — to reklama, a nie wynik wyszukiwania.'),
   activities:[
    choice('w38-r1','Chcesz zmienić kolor wszystkich nagłówków <h2> na stronie naraz. Co piszesz w style.css?',['<h2 color="#1f4fa3">','h2 { color: #1f4fa3; }','h2 = #1f4fa3','color: h2 #1f4fa3;'],[1],'Reguła CSS: selektor h2, w klamrach deklaracja color z wartością i średnikiem. Działa na każdy <h2>.','Selektor { właściwość: wartość; }'),
    choice('w38-r2','Jasnoszary tekst #c8c8c8 na białym tle ma kontrast ok. 1,7:1. Co z tym zrobisz?',['Nic — ważne, że wygląda nowocześnie','Przyciemnię tekst, bo zwykły tekst potrzebuje co najmniej 4,5:1','Pogrubię tekst, to wystarczy','Zmienię czcionkę na szeryfową'],[1],'Wytyczne WCAG wymagają dla zwykłego tekstu kontrastu min. 4,5:1. Na projektorze czy w słońcu jasnoszary tekst znika.','Ile wynosiło minimum kontrastu w edytorze na poprzedniej lekcji?')
   ]},
  {id:'hosting',label:'Do sieci',title:'Jak strona trafia do internetu',grouping:'class',
   intro:'Twoja strona to pliki na dysku. Żeby zobaczył ją ktoś inny, pliki muszą trafić na serwer, a serwer musi mieć adres. Odkryj schemat krok po kroku.',
   reading:{title:'Hosting, domena, DNS',paragraphs:[
    'Hosting to wynajęte miejsce na serwerze, który działa całą dobę — tam kopiujesz pliki strony (index.html, style.css, obrazki). Domena to nazwa, którą wpisujesz w przeglądarce, np. szprycha-rowery.pl; wykupuje się ją na rok i odnawia. DNS to „książka telefoniczna internetu”: zamienia nazwę domeny na adres IP serwera. Certyfikat HTTPS daje kłódkę przy adresie i szyfruje połączenie.',
    'Gdy ktoś wpisze samą domenę, serwer pokazuje plik index.html — dlatego strona główna ma właśnie tę nazwę. Wszystkie ścieżki muszą być względne (rower.svg, a nie C:\\Users\\…), bo na serwerze nie ma Twojego dysku. Dziś niczego nie publikujemy — strona zostaje w Twojej przeglądarce — ale przygotujemy ją tak, jakby jutro miała trafić na serwer.'
   ]},
   ...note(8,'Nauczanie jawne: odkrywaj schemat krok po kroku na projektorze i do każdego kroku dodaj analogię (hosting = wynajęte mieszkanie, domena = adres na kopercie, DNS = książka telefoniczna). Potem uczniowie samodzielnie dopasowują pojęcia i odpowiadają na pytanie o file:///. Zaznacz, że w tej klasie strony nie są publikowane — dlatego tak ważny jest pokaz i lista kontrolna.','Co się stanie, gdy wyślesz koledze link file:///C:/Users/Ola/strona/index.html?','Kolega zobaczy błąd: taki adres wskazuje plik na dysku mojego komputera. Żeby inni zobaczyli stronę, pliki muszą być na serwerze (hosting) pod adresem w internecie (domena).','Mylenie domeny z hostingiem („kupiłem domenę, więc mam stronę”) i przeglądarki z serwerem.','Zapytaj, dlaczego firmy kupują kilka domen (np. z literówką albo .com i .pl) — żeby klient trafił, nawet gdy się pomyli, i żeby nikt nie podszył się pod firmę.'),
   activities:[
    {type:'flow',id:'w38-flow',nodes:[
     {title:'Pliki na Twoim dysku',text:'index.html, style.css, obrazki — wszystkie w jednym folderze, ze ścieżkami względnymi.'},
     {title:'Hosting',text:'Kopiujesz folder na serwer firmy hostingowej. Serwer działa 24/7 i odpowiada na prośby przeglądarek.'},
     {title:'Domena',text:'Rejestrujesz nazwę, np. szprycha-rowery.pl, i wskazujesz, na którym serwerze jest strona.'},
     {title:'DNS',text:'Gdy ktoś wpisze domenę, DNS podaje jego przeglądarce adres IP serwera.'},
     {title:'Przeglądarka klienta',text:'Łączy się z serwerem (HTTPS), dostaje index.html i rysuje stronę. Wyszukiwarka robi to samo automatycznie i dopisuje stronę do swoich wyników.'}
    ]},
    {type:'matching',id:'w38-terms',question:'Dopasuj pojęcie do opisu.',options:['Hosting','Domena','DNS','Certyfikat HTTPS','Plik index.html'],rows:[
     {label:'Wynajęte miejsce na serwerze, który działa całą dobę',correct:[0],explanation:'Hosting to „mieszkanie” dla plików strony.'},
     {label:'Nazwa wpisywana w przeglądarce, wykupywana na rok',correct:[1],explanation:'Domena to adres, np. szprycha-rowery.pl.'},
     {label:'Zamienia nazwę domeny na adres IP serwera',correct:[2],explanation:'DNS działa jak książka telefoniczna internetu.'},
     {label:'Kłódka przy adresie: połączenie jest szyfrowane',correct:[3],explanation:'HTTPS chroni dane wpisywane na stronie.'},
     {label:'Strona pokazywana, gdy wpiszesz samą domenę',correct:[4],explanation:'Serwer domyślnie podaje plik index.html.'}
    ]},
    choice('w38-local','Wysyłasz koledze link file:///C:/Users/Ola/strona/index.html. Co zobaczy?',['Twoją stronę, tak jak u Ciebie','Stronę bez obrazków','Błąd — ten plik jest tylko na Twoim dysku','Stronę, ale dopiero po zalogowaniu'],[2],'Adres file:/// wskazuje plik na dysku Twojego komputera. Inni zobaczą stronę dopiero, gdy pliki będą na serwerze pod adresem w internecie.','Gdzie fizycznie leży plik z tego adresu?')
   ]},
  {id:'prawo',label:'Co wolno?',title:'Co wolno pokazać w internecie?',grouping:'pair',
   intro:'Zanim strona trafi do sieci, sprawdź, czy nie łamie czyichś praw. Najpierw rozstrzygnij sam, potem porównaj z partnerem i uzasadnijcie różnice.',
   reading:{title:'Wizerunek, dane osobowe, licencje',paragraphs:[
    'Wizerunek (zdjęcie, na którym da się kogoś rozpoznać) wolno rozpowszechniać za zgodą tej osoby — tak mówi art. 81 ustawy o prawie autorskim. Wyjątki są wąskie: osoba powszechnie znana fotografowana przy pełnieniu funkcji publicznej albo osoba jako szczegół większej całości (tłum na koncercie). Dane osobowe innych ludzi (imię i nazwisko z adresem, telefon) chroni RODO — na stronie firmy nie publikuje się ich bez podstawy.',
    'Każde zdjęcie i grafika mają autora. „Znalezione w internecie” nie znaczy „wolne”. Bezpieczne są własne zdjęcia oraz pliki na wolnych licencjach, np. Creative Commons z Wikimedia Commons: przy CC BY musisz podać autora i licencję, CC0 nie wymaga nawet podpisu. Twoja strona też jest Twoim utworem — w stopce piszesz, kto jest autorem i na jakich zasadach można z niej korzystać.'
   ],example:{question:'Jak podpisać zdjęcie z Wikimedia Commons na licencji CC BY 4.0?',answer:'Pod zdjęciem: „Fot. Jan Przykładowy, CC BY 4.0, Wikimedia Commons” — autor, licencja i źródło. Najlepiej z linkiem do strony zdjęcia.'}},
   ...note(8,'Nauczanie dialogowe: każdy rozstrzyga przypadki sam (2 minuty), potem para porównuje i uzasadnia różnice (2 minuty). Omów z klasą przypadek, który najbardziej podzielił pary. Nie wchodź w szczegóły kar — chodzi o nawyk „zanim opublikuję, sprawdzam”. Przepisy sprawdź przed lekcją u źródła.','Kolega wrzucił na stronę klasy zdjęcie z wycieczki, na którym widać Twoją twarz. Nie pytał. Co możesz zrobić?','Poprosić o usunięcie — rozpowszechnianie mojego wizerunku wymaga mojej zgody (art. 81 prawa autorskiego). Jeśli nie usunie, zgłosić to nauczycielowi albo administratorowi strony.','„Skoro zdjęcie zrobiono w miejscu publicznym, wolno je publikować” — wyjątek dotyczy tłumu i osób publicznych, a nie zdjęcia, na którym jesteś głównym tematem.','Zapytaj, jak sprawdzić licencję zdjęcia w Wikimedia Commons (opis pod plikiem) i co zrobić, gdy licencji nie ma (nie używać albo zapytać autora).'),
   activities:[
    {type:'matching',id:'w38-law',question:'Czy możesz to umieścić na publicznej stronie?',options:['Wolno','Wolno, z podaniem autora i licencji','Nie wolno bez zgody osób lub licencji','Lepiej nie — ułatwia namierzenie i podszycie się'],rows:[
     {label:'Zdjęcie z wycieczki z twarzami pięciu kolegów, bez pytania ich o zgodę',correct:[2],explanation:'Rozpowszechnianie wizerunku wymaga zgody osób na zdjęciu (art. 81 pr. aut.).'},
     {label:'Grafika z wyszukiwarki obrazów, „bo była w internecie”',correct:[2],explanation:'Każda grafika ma autora. Bez licencji lub zgody nie wolno jej publikować.'},
     {label:'Zdjęcie z Wikimedia Commons na licencji CC BY 4.0',correct:[1],explanation:'CC BY pozwala używać zdjęcia pod warunkiem podania autora i licencji.'},
     {label:'Twój numer telefonu i adres domowy na stronie o hobby',correct:[3],explanation:'To Twoje dane, ale publicznie ułatwiają oszustom i obcym namierzenie Cię. Wystarczy e-mail albo formularz.'},
     {label:'Logo drużyny, które sam narysowałeś',correct:[0],explanation:'To Twój utwór — możesz go publikować i sam decydujesz o licencji.'}
    ]},
    choice('w38-copy','Ktoś skopiował całą Twoją stronę i podpisał się jako autor. Co robisz najpierw?',['Nic — co jest w internecie, jest wspólne','Kopiuję jego stronę w odwecie','Piszę do autora kopii lub administratora serwisu z prośbą o usunięcie — mam prawa autorskie, a pliki z datami to potwierdzą','Zgłaszam na policję każdy skopiowany tekst'],[2],'Twoja strona to utwór chroniony prawem autorskim od chwili powstania — bez rejestracji. Pierwszy krok to prośba o usunięcie do autora kopii lub do serwisu, w którym ją opublikowano. Zachowaj dowody (pliki, daty, zrzuty).','Kto ma prawa do strony, którą napisałeś?')
   ]},
  {id:'seo',label:'SEO',title:'SEO po ludzku: wynik w wyszukiwarce',grouping:'solo',
   intro:'Tak wygląda strona pana Tomka w wynikach wyszukiwania (symulacja). Popraw kod w <head> i nagłówek — i obserwuj, jak zmienia się wynik. Ktoś szuka: „serwis rowerowy kalisz”.',
   reading:{title:'Tytuł i opis, które ktoś kliknie',paragraphs:[
    'W wynikach wyszukiwania niebieski tytuł pochodzi zwykle z <title>, a szary opis — z <meta name="description" content="…"> w <head>. Tytuł ma mówić co i gdzie (ok. 50–60 znaków, dłuższy zostanie ucięty „…”), opis — dlaczego warto kliknąć (ok. 120–160 znaków). Bez opisu wyszukiwarka sama wybierze kawałek tekstu ze strony.',
    'SEO (optymalizacja dla wyszukiwarek) „po ludzku” to pisanie dla człowieka: jasny tytuł, nagłówek <h1> mówiący, czym jest strona (nie „Witamy!”), opisy alt i język strony <html lang="pl">. Nie upychaj w tytule dziesięciu słów kluczowych — wyszukiwarki to rozpoznają, a ludzie i tak nie klikną.'
   ],example:{question:'Przykład: dobry tytuł dla pizzerii w Koninie',answer:'„Pizzeria Rondo Konin – pizza z pieca, dowóz do 30 min” (52 znaki): nazwa, miasto, co oferuje i korzyść. Zły: „Strona główna” albo „pizza pizza Konin tania pizza najlepsza pizza”.'}},
   ...note(12,'Pokaż na projektorze wynik „Strona główna” i zapytaj, kto by kliknął. Potem uczniowie samodzielnie poprawiają <title>, dopisują <meta name="description">, zmieniają <h1> i dodają lang="pl". Liczniki znaków pod wynikiem pokazują, czy tekst się zmieści. Krąż i pytaj: „czy z tego tytułu wiem, co to i gdzie?”. Szybsi: wymyślają tytuł i opis dla swojej strony z lekcji 35.','Dlaczego tytuł „Strona główna” to strata klientów?','Bo w wynikach wyszukiwania nie mówi, co to za firma i gdzie jest. Klient wybierze wynik, który od razu odpowiada na jego pytanie: „Serwis rowerowy Szprycha Kalisz – naprawa w 24 h”.','Opis wpisany w <body> zamiast w <head>, brak cudzysłowów w content, tytuł dłuższy niż 60 znaków, upychanie słów kluczowych.','Dla szybkich: tytuł i opis dla własnej strony z lekcji 35 — zapisz je na kartce i porównaj z partnerem.'),
   activities:[
    {type:'htmlLab',id:'w38-serp',stateKey:'w38-page',mode:'serp',points:5,minDone:3,site:'szprycha-rowery',title:'Wynik wyszukiwania serwisu Szprycha',product:'Wynik wyszukiwania',url:'https://www.szprycha-rowery.pl/',query:'serwis rowerowy kalisz',
     prompt:'Popraw `<title>`, dopisz w `<head>` opis: `<meta name="description" content="…">`, zmień `<h1>` i dodaj język strony w `<html lang="pl">`. Zakładka „Wyszukiwarka” pokazuje wynik na żywo.',
     html:BIKE,snippets:false,download:false,
     checks:[
      {id:'tlen',type:'text',sel:'title',min:20,max:60,label:'Tytuł ma 20–60 znaków',hint:['Np. „Serwis rowerowy Szprycha Kalisz – naprawa w 24 h” (49 znaków).']},
      {id:'twords',type:'text',sel:'title',includesAll:['rower','Kalisz'],label:'Tytuł mówi, co i gdzie (słowa „rower…” i „Kalisz”)',hint:['Klient szuka „serwis rowerowy kalisz” — te słowa powinny być w tytule.']},
      {id:'desc',type:'attr',sel:'meta[name=description]',attr:'content',min:70,max:160,label:'Opis <meta name="description"> ma 70–160 znaków',hint:['W `<head>`, pod `<title>`, dopisz: `<meta name="description" content="Naprawa rowerów miejskich, górskich i elektrycznych w Kaliszu. Przegląd w 24 h. Pon.–Pt. 9–17.">`.']},
      {id:'h1',type:'text',sel:'h1',not:['Witamy!','Witamy'],includes:['rower','serwis'],label:'<h1> mówi, czym jest strona (zamiast „Witamy!”)',hint:['Np. `<h1>Serwis rowerowy Szprycha</h1>`.']},
      {id:'lang',type:'attr',sel:'html',attr:'lang',pattern:'^pl',label:'Język strony: <html lang="pl">',hint:['Zamień pierwszy znacznik `<html>` na `<html lang="pl">`. Wyszukiwarka i czytnik ekranu wiedzą wtedy, że strona jest po polsku.']}
     ],doneText:'Wynik wyszukiwania mówi, co i gdzie — teraz klient ma powód, żeby kliknąć.'}
   ]},
  {id:'gotowe',label:'Lista kontrolna',title:'Lista kontrolna przed publikacją',grouping:'solo',
   intro:'Ta sama strona — Twoje poprawki z poprzedniego etapu zostają. Zanim pliki trafią na serwer, sprawdź sześć rzeczy. Część problemów widać tylko w kodzie: każdy może go podejrzeć (Ctrl+U albo F12).',
   ...note(9,'Praca samodzielna z listą kontrolną sprawdzaną automatycznie. Podkreśl dwie rzeczy, które zaskakują uczniów: komentarze w HTML są publiczne (Ctrl+U), a adres klienta w opinii to dane osobowe. Krąż i pytaj: „co tu zobaczy obcy człowiek?”. Na koniec 1 minuta: kto pobiera plik .html, ten otwiera go w przeglądarce i sprawdza, czy obrazek działa.','Dlaczego hasło w komentarzu <!-- … --> to problem, skoro komentarza nie widać na stronie?','Bo komentarz jest w kodzie, który przeglądarka pobiera — każdy zobaczy go przez Ctrl+U albo F12. Na stronę nie wpisuje się haseł ani w treści, ani w komentarzach.','Usuwanie całej opinii klienta zamiast samego adresu (oba warianty są poprawne, ale warto zostawić „Marek z Kalisza”), stopka bez autora, viewport wpisany w <body>.','Dla szybkich: dodaj w stopce link do licencji i podpis zdjęcia w <figure>/<figcaption>.'),
   activities:[
    {type:'htmlLab',id:'w38-ready',stateKey:'w38-page',mode:'tasks',points:6,minDone:4,site:'szprycha-rowery',title:'Gotowe do publikacji? 6 punktów kontroli',product:'Strona Szprychy',criteriaLabel:'Lista kontrolna',
     prompt:'Przejdź listę po prawej. Gdy wszystko będzie zielone, strona mogłaby trafić na serwer. Możesz ją pobrać jako plik .html.',
     html:BIKE,keep:[{sel:'h1',min:1,label:'nagłówka <h1>'},{sel:'li',min:3,label:'cennika'},{sel:'img',min:1,label:'zdjęcia warsztatu'},{sel:'footer',min:1,label:'stopki <footer>'}],
     checks:[
      {id:'local',type:'noLocal',label:'Ścieżki działają po publikacji (żadnych C:\\Users…)',hint:['Obrazek wskazuje pulpit Kuby. Na serwerze tego dysku nie ma — użyj samej nazwy pliku: `src="rower.svg"`.']},
      {id:'img',type:'images',altMin:5,label:'Zdjęcie istnieje w folderze strony i ma opis alt',hint:['`<img src="rower.svg" alt="Rower górski w serwisie">` — plik z folderu i opis słowami.']},
      {id:'rodo',type:'sourceNot',pattern:'Lipow',label:'Bez danych osobowych klienta (adres) — RODO',hint:['W opinii klienta jest jego adres domowy. Zostaw np. „– Marek z Kalisza”.']},
      {id:'secret',type:'sourceNot',pattern:'has[łl]o|szprycha123',label:'W kodzie nie ma hasła (komentarze też widać: Ctrl+U)',hint:['Usuń cały komentarz `<!-- hasło do panelu… -->`. Komentarze są w kodzie, który pobiera każdy.']},
      {id:'footer',type:'text',sel:'footer',includes:['©','CC BY','CC0','licencj','prawa zastrzeżone'],label:'Stopka podaje autora i licencję',hint:['Np. `<footer>© 2026 Serwis rowerowy Szprycha. Wszelkie prawa zastrzeżone.</footer>` albo licencja CC BY 4.0.']},
      {id:'viewport',type:'attr',sel:'meta[name=viewport]',attr:'content',pattern:'width=device-width',label:'Strona jest gotowa na telefon (<meta name="viewport">)',hint:['W `<head>` dopisz: `<meta name="viewport" content="width=device-width, initial-scale=1">`. Bez tego telefon pokaże stronę maleńką, jak na monitorze.']}
     ],doneText:'Strona gotowa do publikacji!'}
   ]},
  {id:'wynik',label:'Wynik',title:'Twój wynik i strona gotowa do publikacji',grouping:'class',
   intro:'Pokaż nauczycielowi stronę serwisu i jej wynik w wyszukiwarce (poniżej) oraz kartę wyniku. Strona zostaje tylko w tej karcie przeglądarki — plik .html możesz pobrać.',
   ...note(4,'Obejrzyj strony przy komputerach: wynik w wyszukiwarce i lista kontrolna pod podglądem. Zadaj pytanie na wyjście. Podsumuj dział: HTML (treść), CSS (wygląd), publikacja (hosting, domena, DNS) i odpowiedzialność za to, co publikujemy.','Co sprawdzisz na stronie, zanim wyślesz ją na serwer?','Ścieżki względne i działające obrazki z alt, tytuł i opis, brak prywatnych danych i haseł w kodzie, prawa do zdjęć (licencja lub zgoda), stopkę z autorem.','„Wystarczy, że wygląda dobrze u mnie” — u mnie działają też ścieżki do mojego dysku, na serwerze już nie.','Poproś, żeby każdy zapisał jeden punkt z listy kontrolnej, o którym wcześniej nie wiedział.'),
   activities:[
    {type:'htmlLab',id:'w38-show',mode:'show',from:'w38-page',fromMode:'tasks',withSerp:true,title:'Strona serwisu — pokaż ją nauczycielowi'},
    {type:'resultCard',id:'result',title:'Publikacja i SEO — wynik',sources:['w38-r1','w38-r2','w38-terms','w38-local','w38-law','w38-copy','w38-serp','w38-ready'],badges:[
     {min:0,name:'Strona główna (bez tytułu)',text:'Na razie wyszukiwarka Cię nie widzi. Tytuł, opis, alt — i będziesz na liście.'},
     {min:0.5,name:'Webmaster na praktykach',text:'Strona prawie gotowa do sieci. Jeszcze lista kontrolna i można dzwonić do klienta.'},
     {min:0.85,name:'Pierwsza strona wyników',text:'Tytuł mówi co i gdzie, kod czysty, prawa w porządku. Pan Tomek stawia Ci kawę.'}
    ]}
   ]}
 ],
 exitTicket:'Wiesz, że strona trafia do internetu przez hosting i domenę, a DNS prowadzi do serwera. Umiesz napisać tytuł i opis, które ktoś kliknie, i sprawdzić stronę przed publikacją: ścieżki, alt, brak prywatnych danych i haseł, licencje i stopka.'
};
