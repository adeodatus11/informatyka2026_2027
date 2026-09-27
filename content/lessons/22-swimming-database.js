import {note, choice, reveal} from '../schema.js';

const sim=(mode,id,points,label,question)=>({type:'zawodyExplorer',id,stateKey:'zawody-lab',mode,points,label,question});

export default {
 id:'22',grade:3,title:'Podstawowe pojęcia i przykład bazy danych – obsługa szkolnych zawodów pływackich',
 subtitle:'Wyniki zawodów, tabela ligi e-sportowej i dziennik elektroniczny działają tak samo: jedna zmiana w jednym miejscu i wszystko się zgadza.',
 topic:'Podstawowe pojęcia i przykład bazy danych – obsługa szkolnych zawodów pływackich',icon:'swim',
 tags:['Tabela','Rekord','Klucz'],duration:45,
 curriculum:'2024 Informatyka – liceum/technikum · bazy danych: tabela, rekord, pole, klucz, relacja, system zarządzania bazą danych',
 format:{
  name:'Problem → pojęcia → zastosowanie',
  student:'Najpierw łapiesz błędy w arkuszu, w którym sędzia prowadził wyniki. Potem poznajesz pojęcia, które te błędy usuwają, i sprawdzasz je w bazie Zawody: klucze, relacje, zwycięzca. Na koniec prowadzisz tablicę wyników, która liczy się sama. Efekt: rozumiesz, jak działa każda „tabela wyników” w sieci.',
  teacher:'Schemat „najpierw zderzenie z problemem, potem pojęcia”. Etap 2: uczniowie sami znajdują w arkuszu literówkę, sprzeczność i trudną aktualizację (symulator daje informację zwrotną). Etap 3: nauczanie jawne — odsłaniasz karty pojęć na projektorze, wiążąc każde z problemem z arkusza, a uczniowie dopasowują pojęcia do elementów bazy. Etapy 4–5: zastosowanie w symulatorze (widok Relacje i tablica wyników). Twoja rola: pytasz „który problem z arkusza tu znika?”, zbierasz przy jednym ekranie osoby, które utknęły na kluczach.',
  grouping:'Samodzielnie przy komputerze; w etapie 4 można pracować w parach (jedna osoba klika w widoku Relacje, druga czyta arkusze danych i podpowiada). Przy nieparzystej liczbie osób jedna trójka albo praca samodzielna — symulator na to pozwala.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Wskazuję w arkuszu problemy powtarzania danych: niespójność, sprzeczność i trudną aktualizację.','Rozpoznaję w bazie tabelę, rekord, pole, typ danych, klucz główny, klucz obcy i relację 1–∞.','Odczytuję informację, przechodząc po relacjach między tabelami (Konkurencje → Wyniki → Zawodnicy).','Wyjaśniam, dlaczego baza odrzuca wynik zawodnika, którego nie ma w tabeli Zawodnicy.'],
 materials:['Przeglądarka z lekcją — najlepiej komputer (widok relacji jest szeroki)','Wbudowany symulator bazy „Zawody” (arkusz, widok Relacje, tablica wyników) — bez instalowania pakietu Office','Dane fikcyjne: 30 zawodników, 8 konkurencji, 61 wyników'],
 teacherGuide:{
  preparation:'Otwórz etap 3 na projektorze (karty pojęć). Baza „Zawody” ma trzy tabele: Zawodnicy (30), Konkurencje (8), Wyniki (61) i dwie relacje 1–∞ przez id_zawodnika i id_konkurencji. Pułapka w zadaniu „Kto wygrał?”: Alicja Kaczmarek ma najlepszy czas 50 m dowolnym dziewcząt (31,02), ale jest zdyskwalifikowana; wygrywa Emilia Pietrzak (32,46). Emilia ma 3 starty — przydaje się przy kluczach i relacjach. Ta sama baza wraca na lekcji o kwerendach.',
  summary:'Sprawdź kartę wyniku (maks. 25 pkt) i zapytaj: „Dlaczego w tabeli Wyniki nie ma nazwiska?” (bo wskazuje je id_zawodnika — nazwisko jest raz, w Zawodnicy). Poproś o wskazanie klucza obcego na ekranie ucznia. Kto skończył wcześniej, może dopisać w tablicy wyników nowego zawodnika z własnej klasy i jego wynik.'
 },
 sections:[
  {id:'start',label:'Start',title:'61 wyników. Kto wygrał 50 m kraulem dziewcząt?',intro:'Szkolne zawody: 30 zawodników, 8 konkurencji, 61 startów. Sędzia ma wszystko w jednym arkuszu. Dyrektor pyta o zwyciężczynię — teraz, przy mikrofonie.',grouping:'class',
   reading:{title:'Arkusz czy baza?',paragraphs:['W arkuszu szukasz nazwiska, kopiujesz, sortujesz i modlisz się, żeby nikt nie zrobił literówki. W bazie danych zadajesz jedno pytanie i dostajesz odpowiedź — także za rok, gdy wyników będzie 600.','Tak działają wyniki zawodów sportowych, tabele lig e-sportowych, sklep internetowy i dziennik elektroniczny: dane są w powiązanych tabelach, a ekran z wynikami liczy się sam.']},
   ...note(5,'Rzuć hak: dyrektor czeka przy mikrofonie, a wyniki są w arkuszu. Uczniowie odpowiadają na pytanie o najszybszą metodę. Drugie pytanie to powtórka z lekcji o systemie dwójkowym — łączy ją z bazą (rozmiar pola Bajt w Accessie).','Gdzie widziałeś tabelę wyników, która aktualizuje się sama?','Wyniki meczów na żywo, tabela ligi w grze, oceny w dzienniku elektronicznym, ranking w aplikacji do biegania.','Przekonanie, że baza to „duży Excel”. Arkusz przechowuje jedną płaską tabelę; baza — kilka powiązanych tabel i reguły, które pilnują danych.','Zapytaj, ile osób w klasie korzystało z e-dziennika dziś rano — to też baza danych.'),
   activities:[
    choice('zw-hook','Wyniki są w jednym arkuszu (61 wierszy, nazwiska wpisane przy każdym starcie). Co najpewniej da poprawną zwyciężczynię 50 m kraulem dziewcząt?',['Przewinąć arkusz i znaleźć najkrótszy czas na oko','Zapytać bazę: konkurencja = 50 m dowolny K, bez dyskwalifikacji, czas rosnąco','Posortować arkusz po nazwisku'],[1],'Pytanie do bazy (kwerenda) sprawdza wszystkie rekordy i warunki naraz — także dyskwalifikacje, o których łatwo zapomnieć. Kraul to styl dowolny.','Sortowanie po nazwisku nie mówi nic o czasie.'),
    choice('zw-byte','Powtórka z systemu dwójkowego: w Accessie pole Liczba o rozmiarze „Bajt” mieści tylko wartości 0–255. Dlaczego?',['Bo 1 bajt = 8 bitów, a 8 bitów daje 2⁸ = 256 kombinacji: od 0 do 255','Bo tak ustalił producent programu','Bo 255 to największa liczba trzycyfrowa'],[0],'8 bitów → 256 różnych układów zer i jedynek. Dlatego rozmiar pola wybierasz do danych: na numer toru (1–8) wystarczy Bajt, na id_zawodnika w dużej szkole — Liczba całkowita długa.','Policz: ile kombinacji dają 3 bity? A 8?')
   ]},
  {id:'problem',label:'Problem',title:'Arkusz sędziego: znajdź 3 problemy.',intro:'To fragment prawdziwego (fikcyjnego) arkusza z zawodów. Każdy wiersz = jeden start, a dane zawodnika są przepisane przy każdym starcie. Klikaj komórki i sprawdzaj.',grouping:'solo',
   reading:{title:'Redundancja — to samo w wielu miejscach',paragraphs:['Redundancja to powtarzanie tych samych danych w wielu miejscach. Wygląda niewinnie, ale każda kopia może się pomylić albo nie zostać poprawiona.','Szukasz trzech skutków: ta sama osoba zapisana inaczej (filtr jej nie znajdzie), sprzeczne informacje (która klasa jest prawdziwa?) i zmiana, którą trzeba zrobić w wielu wierszach.']},
   ...note(7,'Uczniowie pracują samodzielnie w symulatorze. Po 4 minutach zapytaj: „który problem był najtrudniejszy do zauważenia?”. Zapisz na tablicy trzy nazwy: niespójność, sprzeczność, trudna aktualizacja — i nad nimi słowo „redundancja”.','Co by się stało, gdyby arkusz miał 600 wierszy zamiast 12?','Literówek i sprzeczności byłoby więcej, a poprawka klasy wymagałaby przejrzenia całego arkusza.','Zaznaczanie całego wiersza zamiast konkretnych komórek; szukanie „błędu w czasie” zamiast problemu z danymi osoby.','Zapytaj, jak w e-dzienniku zmienia się nazwisko ucznia po ślubie rodziców — w ilu miejscach?'),
   activities:[sim('problem','zw-sheet',6,'Arkusz sędziego: 3 problemy','Znajdź w arkuszu trzy problemy wynikające z powtarzania danych.')]},
  {id:'concepts',label:'Pojęcia',title:'12 pojęć, które naprawiają arkusz.',intro:'Rozwiń karty po kolei. Każde pojęcie ma przykład z bazy Zawody — tej samej, którą za chwilę otworzysz.',grouping:'class',
   reading:{title:'Baza = tabele + relacje + reguły',paragraphs:['Baza danych Zawody ma trzy tabele: Zawodnicy (kto), Konkurencje (w czym) i Wyniki (jaki czas). Dane zawodnika są zapisane raz; wynik wskazuje zawodnika numerem — kluczem obcym.','Programem, który przechowuje tabele, pilnuje kluczy i odpowiada na pytania, jest system zarządzania bazą danych (SZBD), np. Access, MySQL, PostgreSQL.'],example:{question:'Jak baza zapisze drugi start Emilii Pietrzak?',answer:'Jako nowy rekord w Wyniki: id_wyniku (nowy numer), id_zawodnika = 11, id_konkurencji, czas. Imienia i nazwiska nie przepisujemy — są raz w Zawodnicy.'}},
   ...note(8,'Nauczanie jawne: odsłaniaj karty na projektorze, przy każdej wracając do problemu z arkusza („klucz główny = koniec z dwoma Pietrzak/Pietrzek”). Potem uczniowie dopasowują pojęcia samodzielnie i odpowiadają na pytanie o SZBD.','Który problem z arkusza usuwa klucz obcy?','Sprzeczność i trudną aktualizację: klasa zawodnika jest zapisana raz, a wyniki tylko go wskazują numerem.','Mylenie rekordu (wiersz) z polem (kolumna) oraz klucza głównego z obcym.','Poproś o przykład klucza głównego z życia: numer PESEL, numer indeksu, numer zamówienia w sklepie.'),
   activities:[
    reveal('zw-concepts',[
     {title:'Baza danych',icon:'drive',short:'Uporządkowany zbiór powiązanych danych.',text:'Zawody.accdb: trzy tabele, dwie relacje, reguły. Nie tylko przechowuje dane, ale pilnuje, żeby były spójne.'},
     {title:'Tabela',icon:'table',short:'Zbiór obiektów jednego rodzaju.',text:'Zawodnicy, Konkurencje, Wyniki. Jedna tabela = jeden rodzaj „rzeczy”. Nie mieszamy osób z czasami.'},
     {title:'Rekord',icon:'list',short:'Jeden wiersz = jeden obiekt.',text:'11, Emilia, Pietrzak, K, 4A, 2008 — rekord w tabeli Zawodnicy. Jeden start to rekord w Wyniki.'},
     {title:'Pole',icon:'hash',short:'Jedna kolumna = jedna cecha.',text:'imie, klasa, czas, dystans. Każde pole ma nazwę i typ danych.'},
     {title:'Typ danych',icon:'settings',short:'Co wolno wpisać w pole?',text:'czas: Liczba (32,46), klasa: Krótki tekst (4A), rocznik: Liczba (2008). Typ nie wpuści liter do pola liczbowego.'},
     {title:'Klucz główny',icon:'lock',short:'Unikalny identyfikator rekordu.',text:'id_zawodnika w Zawodnicy. Dwie osoby o nazwisku Król mają różne numery — baza ich nie pomyli.'},
     {title:'Klucz obcy',icon:'right',short:'Pole wskazujące rekord w innej tabeli.',text:'id_zawodnika w Wyniki. Może się powtarzać (Emilia ma 3 starty), ale musi wskazywać istniejącego zawodnika.'},
     {title:'Relacja 1–∞',icon:'group',short:'Jeden do wielu.',text:'Jeden zawodnik — wiele wyników; jeden wynik — jeden zawodnik. Tak samo: jedna konkurencja — wiele wyników.'},
     {title:'SZBD',icon:'cpu',short:'System zarządzania bazą danych.',text:'Program, który przechowuje tabele, pilnuje kluczy i wykonuje kwerendy: Access, MySQL, PostgreSQL, SQLite (jest w każdym telefonie).'},
     {title:'Kwerenda',icon:'funnel',short:'Pytanie do bazy.',text:'„Wyniki 50 m dowolnym dziewcząt, bez dyskwalifikacji, od najlepszego” — w sekundę, zawsze aktualne.'},
     {title:'Formularz',icon:'file',short:'Wygodne okno do wpisywania danych.',text:'Formularz „Nowy wynik” ma listy zawodników i konkurencji — sędzia nie musi pamiętać numerów.'},
     {title:'Raport',icon:'printer',short:'Wynik gotowy do druku.',text:'Protokół zawodów albo dyplomy dla podium: dane z kwerendy w ładnym układzie do wydruku lub PDF.'}
    ]),
    {type:'matching',id:'zw-match',question:'Dopasuj element bazy Zawody do pojęcia.',options:['Tabela','Rekord','Pole','Klucz główny','Klucz obcy','Relacja 1–∞'],rows:[
     {label:'Zawodnicy',correct:[0],explanation:'Zbiór wszystkich zawodników — tabela.'},
     {label:'11, Emilia, Pietrzak, K, 4A, 2008',correct:[1],explanation:'Jeden wiersz opisujący jedną osobę — rekord.'},
     {label:'czas w tabeli Wyniki',correct:[2],explanation:'Kolumna opisująca jedną cechę każdego startu — pole.'},
     {label:'Zawodnicy.id_zawodnika',correct:[3],explanation:'Unikalny numer zawodnika — klucz główny.'},
     {label:'Wyniki.id_konkurencji',correct:[4],explanation:'Wskazuje rekord w tabeli Konkurencje i może się powtarzać — klucz obcy.'},
     {label:'Jeden zawodnik ma wiele startów',correct:[5],explanation:'Jeden rekord Zawodnicy ↔ wiele rekordów Wyniki — relacja jeden do wielu.'}
    ]},
    choice('zw-szbd','Access, MySQL i PostgreSQL to…',['arkusze kalkulacyjne','systemy zarządzania bazą danych (SZBD)','języki zapytań'],[1],'SZBD przechowuje tabele, pilnuje kluczy i relacji, wykonuje kwerendy. Język zapytań to SQL — SZBD go rozumie.','Który z nich przechowuje tabele i pilnuje relacji?')
   ]},
  {id:'explore',label:'Relacje',title:'Baza Zawody od środka: klucze i relacje.',intro:'Widok Relacje pokazuje trzy tabele i linie między nimi. Wskaż klucze, ustaw relacje, a potem znajdź zwyciężczynię, idąc po relacjach — tak, jak robi to kwerenda.',grouping:'pair',
   reading:{title:'Idziemy po relacjach',paragraphs:['Wynik nie zna nazwiska. Zna tylko id_zawodnika i id_konkurencji. Żeby odczytać „kto i w czym”, idziesz po liniach relacji: z Wyniki do Zawodnicy i do Konkurencje.','W arkuszu danych kliknij przycisk na początku wiersza. Panel „Rekordy powiązane” pokaże, z czym łączy się ten rekord — jak rozwinięcie „+” w prawdziwym Accessie.']},
   ...note(11,'Pary: jedna osoba klika w widoku Relacje, druga czyta arkusze danych i szuka dowodów („Emilia ma 3 rekordy w Wyniki, więc id_zawodnika się powtarza”). Zamiana ról po 2 zadaniach. W zadaniu 4 nie zdradzaj pułapki — niech symulator powie o dyskwalifikacji.','Dlaczego Wyniki.id_zawodnika nie może być kluczem głównym tabeli Wyniki?','Bo się powtarza — jeden zawodnik ma kilka startów. Klucz główny musi być unikalny.','Zaznaczanie id_zawodnika w obu tabelach jako klucza głównego; wskazanie zwyciężczyni tylko po najkrótszym czasie, bez sprawdzenia dyskwalifikacji.','Zapytaj: jaka będzie druga linia relacji, jeśli dodamy tabelę Tory (numer toru przy każdym starcie)?'),
   activities:[sim('explore','zw-explore',8,'Relacje: klucze i zwyciężczyni','Wskaż klucze i relacje w bazie Zawody i znajdź zwyciężczynię 50 m dowolnym dziewcząt.')]},
  {id:'board',label:'Tablica',title:'Tablica wyników, która liczy się sama.',intro:'Jesteś w komisji sędziowskiej. Dopisujesz spóźniony wynik, poprawiasz klasę i próbujesz wpisać zawodnika-widmo. Patrz na tablicę po każdej zmianie.',grouping:'solo',
   reading:{title:'Jedna zmiana — jedno miejsce',paragraphs:['Tablica to wynik kwerendy: łączy Wyniki z Zawodnicy i Konkurencje, sortuje czas rosnąco i pomija dyskwalifikacje. Dopisujesz tylko rekord w Wyniki — reszta dzieje się sama.','Więzy integralności pilnują relacji: klucz obcy musi wskazywać istniejący rekord. Wynik dla id_zawodnika = 31, gdy takiej osoby nie ma, baza odrzuci — i dobrze.']},
   ...note(9,'Uczniowie pracują samodzielnie. Po zadaniu 1 zapytaj: „Na którym miejscu jest Julia i ile razy wpisywałeś jej nazwisko?” (3. miejsce, zero razy). Przy zadaniu 3 pokaż komunikat Accessa na projektorze i przetłumacz go na ludzki język.','Co zrobiłby arkusz, gdyby ktoś wpisał wynik osoby spoza listy?','Nic — przyjąłby każdy tekst. Baza z relacją odrzuca rekord bez istniejącego zawodnika.','Wpisanie czasu z kropką i jednostką („38.41 s”) albo z minutami; szukanie Julii w złej konkurencji na tablicy.','Dla chętnych: dopisz siebie jako zawodnika i swój wymyślony wynik — sprawdź, na którym miejscu jesteś.'),
   activities:[sim('board','zw-board',6,'Tablica wyników: 3 zadania komisji','Dopisz wynik, popraw klasę i sprawdź, co baza zrobi z zawodnikiem-widmem.')]},
  {id:'result',label:'Wynik',title:'Twój wynik: sędzia czy chaos?',intro:'Karta zbiera punkty z całej lekcji. Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi.',grouping:'solo',
   ...note(5,'Uczniowie odpowiadają na pytanie końcowe i zaznaczają samoocenę. Zapytaj 2–3 osoby: „który problem arkusza usuwa klucz obcy?”. Zapowiedz: na następnych lekcjach sam(a) zaprojektujesz bazę i zadasz jej pytania.','Ile rekordów i w których tabelach dopiszesz, gdy nowa zawodniczka startuje w 2 konkurencjach?','1 rekord w Zawodnicy i 2 w Wyniki; Konkurencje się nie zmieniają.','Dopisywanie nazwiska do tabeli Wyniki „dla wygody” — to wraca do problemów z arkusza.','Zaproponuj bazę dla szkolnego turnieju e-sportowego: jakie tabele i jaki klucz obcy?'),
   activities:[
    choice('zw-exit','Nowa zawodniczka z 1C startuje w 2 konkurencjach. Co dopisujesz do bazy?',['2 rekordy w Wyniki z jej imieniem i nazwiskiem','1 rekord w Zawodnicy i 2 rekordy w Wyniki z jej id_zawodnika','1 rekord w Konkurencje i 2 w Zawodnicy'],[1],'Osoba jest zapisana raz (Zawodnicy), każdy start to osobny rekord w Wyniki, który wskazuje ją kluczem obcym.','Najpierw osoba, potem jej starty.'),
    {type:'resultCard',id:'result',title:'Karta wyniku: baza Zawody',sources:['zw-hook','zw-byte','zw-sheet','zw-match','zw-szbd','zw-explore','zw-board','zw-exit'],badges:[
     {min:0,name:'Kibic z trybun',text:'Na razie oglądasz wyniki z daleka. Wróć do widoku Relacje — tam wszystko się łączy.'},
     {min:0.5,name:'Sędzia pomocniczy',text:'Klucze i relacje ogarniasz. Jeszcze kilka punktów i dostaniesz stoper.'},
     {min:0.85,name:'Sędzia główny',text:'Arkusz rozbity, zwyciężczyni wskazana, zawodnik-widmo zatrzymany na starcie. Tablica wyników jest Twoja.'}
    ]}
   ]}
 ],
 exitTicket:'Wiesz, czym są tabela, rekord, pole, klucz główny i obcy oraz relacja 1–∞ — i po co je wymyślono: żeby dane były zapisane raz i zawsze się zgadzały. Tak działa każda tabela wyników, liga e-sportowa i e-dziennik.'
};
