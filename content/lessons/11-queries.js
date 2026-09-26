import {note, choice, reveal} from '../schema.js';

const lab=(level,label,question,criteria)=>({type:'queryDesigner',id:`q-l${level}`,stateKey:'query-lab',mode:`l${level}`,level,points:6,label,question,criteria});

export default {
 id:'11',grade:2,title:'Przygotowanie kwerend w bazie Stomatolog',
 subtitle:'Jedno pytanie do bazy i recepcja ma listę do SMS-ów, dzienny utarg i pacjentów bez e-maila.',
 topic:'Przygotowanie kwerend w bazie Stomatolog',icon:'funnel',
 tags:['Kryteria','Sumy','Parametr'],duration:44,
 format:{
  name:'Mastery learning z ocenianiem kształtującym',
  student:'Wykonujesz prawdziwe zlecenia recepcji na trzech poziomach. Kolejny poziom otwiera się, gdy zaliczysz 2 z 3 zleceń. Kryteria sukcesu widzisz od początku, a symulator mówi, co poprawić. Efekt: 9 kwerend, których gabinet używałby codziennie.',
  teacher:'Mastery learning: poziom 2 i 3 są zablokowane, dopóki uczeń nie zaliczy 2 z 3 zleceń na poziomie niższym. Kryteria sukcesu (NaCoBeZu) są wypisane pod każdym poziomem. Symulator sprawdza wynik kwerendy (kolumny, wiersze, kolejność) i daje konkretną informację zwrotną; 2 pkt za zaliczenie przy pierwszym sprawdzeniu, 1 pkt po poprawce. Po poziomie 2 pary porównują widok SQL (1 min), a na poziomie 3 partner czyta kryteria na głos i przewiduje wynik przed „Uruchom”. Twoja rola: obserwujesz tablicę postępów (kto utknął na poziomie 1), zbierasz 2–3 osoby z tym samym błędem na mini-instruktaż przy jednym ekranie, a szybszych prosisz o pomoc innym.',
  grouping:'Praca samodzielna przy komputerze + krótkie sprawdzenia w parach z sąsiadem. Przy nieparzystej liczbie osób jedna trójka; kto pracuje sam, czyta kryteria na głos sobie i zapisuje przewidywany wynik przed uruchomieniem.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Tutoring rówieśniczy',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Buduję kwerendę wybierającą w widoku projektu: pola, sortowanie, „Pokaż”, kryteria.','Łączę kryteria (I w jednym wierszu, LUB w wierszu „lub”) i używam Między, Jak, Jest Null.','Tworzę kwerendę z kilku powiązanych tabel i kwerendę podsumowującą (Σ: Grupuj według, Policz, Suma).','Tworzę kwerendę parametryczną i czytam jej odpowiednik w SQL.'],
 materials:['Przeglądarka z lekcją — najlepiej komputer (siatka kwerendy jest szeroka)','Wbudowany symulator projektu kwerendy programu Access — bez instalowania pakietu Office','Dane „Stomatolog”: 20 pacjentów, 40 wizyt, 2 lekarzy (fikcyjne)'],
 teacherGuide:{
  preparation:'Otwórz etap 2 na projektorze. Symulator odwzorowuje polski widok projektu kwerendy: „Pokaż tabelę”, siatka (Pole, Tabela, Sortuj, Pokaż, Kryteria, lub), „Sumy (Σ)” z wierszem Podsumowanie, „Uruchom (!)”, „Widok SQL” oraz okno „Wprowadzanie wartości parametru”. „Dziś” w symulacji to 2026-10-06, więc jutro = 2026-10-07 (6 wizyt). Uproszczenie: w polu termin kryterium daty porównuje samą datę (w prawdziwym Accessie #2026-10-09# oznacza północ — powiedz o tym przy zadaniu 2B).',
  summary:'Ocena opiera się na punktach z trzech poziomów (maks. 18) i quizie. Poproś ucznia o pokazanie Widoku SQL dla zlecenia 2A i wskazanie, która część siatki odpowiada WHERE. Kto zaliczył poziom 3, może pomagać innym jako tutor. Odpowiedź otwarta w karcie wyniku to materiał do rozmowy, nie do punktacji.'
 },
 sections:[
  {id:'start',label:'Start',title:'Jutro 6 pacjentów. Kto dostaje SMS?',intro:'W tabeli Wizyty jest 40 rekordów. Recepcja potrzebuje sześciu — z telefonami. Przewijać i przepisywać? Nie: zadać bazie pytanie.',grouping:'class',
   reading:{title:'Kwerenda = pytanie do bazy',paragraphs:['Kwerenda wybierająca nie zmienia danych. Wybiera z tabel kolumny i wiersze, które spełniają warunki, i pokazuje je jako arkusz danych. Zapisana kwerenda działa zawsze na aktualnych danych — jutro pokaże jutrzejsze wizyty.','Tak działa każdy sklep, przychodnia i firma kurierska: „zamówienia do wysłania dziś”, „paczki do doręczenia w Oławie”, „klienci bez zgody na e-mail”.']},
   ...note(4,'Rzuć hak: 40 wizyt, 6 jutro, SMS-y do wysłania. Uczniowie odpowiadają na pytanie o najszybszą metodę, potem dwa pytania powtórkowe (import z lekcji 10 i relacja z lekcji 05).','Ile czasu zajmie ręczne wypisanie jutrzejszych wizyt z 40 rekordów, a ile kwerenda?','Ręcznie kilka minut i ryzyko pominięcia; kwerenda — sekundy i zawsze aktualny wynik.','Mylenie sortowania z filtrowaniem: sortowanie zmienia kolejność, ale nie ukrywa wierszy.','Zapytaj, gdzie w szkole przydałaby się kwerenda (np. uczniowie bez zgody na wyjście).'),
   activities:[
    choice('q-hook','Recepcja ma 40 wizyt w tabeli. Jak najszybciej i bez pomyłki wybrać jutrzejsze?',['Przewinąć tabelę i wypisać na kartkę','Kwerenda z kryterium daty w polu termin','Posortować tabelę po nazwisku'],[1],'Kwerenda wybierze dokładnie wizyty z 7 października i zadziała tak samo jutro, pojutrze i za rok.','Sortowanie tylko zmienia kolejność — nie ukrywa innych dni.'),
    choice('q-append','Powtórka z lekcji 10: co robi opcja „Dołącz kopię rekordów do tabeli”?',['Tworzy nową tabelę z danymi z pliku','Dopisuje wiersze z pliku do istniejącej tabeli; późniejsze zmiany w pliku nie zmieniają bazy','Łączy bazę z plikiem, który musi zostać na dysku'],[1],'To import do istniejącej tabeli — nowi pacjenci trafili do Pacjenci i mogą mieć wizyty. Połączenie to trzecia opcja.','Kopia = dane są już w bazie.'),
    choice('q-rel','Relacja Pacjenci 1 → ∞ Wizyty oznacza, że…',['każda wizyta ma wielu pacjentów','jeden pacjent może mieć wiele wizyt, a każda wizyta dotyczy jednego pacjenta','pacjent i wizyta to ten sam rekord'],[1],'Dlatego kwerenda z tabel Pacjenci i Wizyty pokazuje pacjenta tyle razy, ile ma wizyt.','„1” stoi po stronie Pacjenci, „∞” po stronie Wizyty.')
   ]},
  {id:'model',label:'Anatomia',title:'Anatomia kwerendy: siatka ↔ SQL.',intro:'Siatka w widoku projektu to „formularz” do pisania SQL. Każdy wiersz siatki ma swoje miejsce w zapytaniu.',grouping:'class',
   reading:{title:'Kryteria: I oraz LUB',paragraphs:['Warunki wpisane w tym samym wierszu „Kryteria” muszą być spełnione jednocześnie (I). Warunek w wierszu „lub” to alternatywa (LUB). Tekst piszesz w cudzysłowie, datę w znakach #, a liczbę bez jednostek.','Access zapisuje SQL po angielsku: Między → Between, Jak → Like, Jest Null → Is Null. Gwiazdka w Access to dowolne znaki (w standardowym SQL jej odpowiednikiem jest %).'],example:{question:'Jak zapisać „pacjenci z Wrocławia LUB z Oławy”?',answer:'W kolumnie miasto: "Wrocław" w wierszu Kryteria i "Oława" w wierszu lub — albo w jednej komórce: "Wrocław" Lub "Oława". SQL: WHERE miasto="Wrocław" OR miasto="Oława".'}},
   ...note(6,'Rozwiń karty po kolei na projektorze, pokazując odpowiadające elementy siatki. Potem uczniowie dopasowują kryteria do znaczeń. Podkreśl różnicę I / LUB.','Co się stanie, gdy „Korona” i zakres dat wpiszemy w dwóch różnych wierszach?','Dostaniemy wizyty dr. Korony z każdego dnia LUB wszystkie wizyty z tego zakresu — za dużo wierszy.','Wpisywanie tekstu bez cudzysłowu z spacją w środku oraz „zł” przy liczbie — Access zgłasza błąd typu.','Pokaż w Widoku SQL, jak wiersz „lub” zamienia się w OR.',true),
   activities:[
    reveal('q-anatomy',[
     {title:'Pole → SELECT',icon:'list',short:'Które kolumny?',text:'Pola dodane do siatki z zaznaczonym „Pokaż” trafiają do SELECT. Pole z kryterium może być w siatce bez „Pokaż” — filtruje, ale go nie widać.'},
     {title:'Tabela → FROM / JOIN',icon:'table',short:'Skąd dane?',text:'Tabele z „Pokaż tabelę”. Dwie powiązane tabele dają INNER JOIN … ON Pacjenci.id_pacjenta = Wizyty.id_pacjenta.'},
     {title:'Kryteria → WHERE',icon:'funnel',short:'Które wiersze?',text:'="Wrocław", >300, Między … I …, Jak "K*", Jest Null. Warunki w jednym wierszu łączy AND.'},
     {title:'lub → OR',icon:'hash',short:'Albo, albo.',text:'Każdy wiersz „lub” to osobny zestaw warunków połączony z pozostałymi przez OR.'},
     {title:'Sortuj → ORDER BY',icon:'right',short:'W jakiej kolejności?',text:'Rosnąco (A–Z, od najwcześniejszego) albo Malejąco. Kilka kolumn z sortowaniem — ważniejsza jest ta bardziej na lewo.'},
     {title:'Podsumowanie (Σ) → GROUP BY',icon:'trophy',short:'Policz, zsumuj.',text:'Po włączeniu „Sumy” każda kolumna ma Podsumowanie: Grupuj według, Suma, Średnia, Min, Maks, Policz, Gdzie.'}
    ]),
    {type:'matching',id:'q-crit',question:'Dopasuj kryterium do znaczenia.',options:['wizyty od 5 do 9 października (włącznie)','nazwiska zaczynające się na K','pacjenci bez e-maila','wizyty droższe niż 300 zł','Access zapyta o nazwisko przy uruchomieniu'],rows:[
     {label:'Między #2026-10-05# I #2026-10-09#',correct:[0],explanation:'Między … I … to zakres z oboma końcami.'},
     {label:'Jak "K*"',correct:[1],explanation:'* oznacza dowolne dalsze znaki, ? — dokładnie jeden znak.'},
     {label:'Jest Null',correct:[2],explanation:'Null = brak wartości w polu.'},
     {label:'>300',correct:[3],explanation:'Samo 300 by nie przeszło; >= dołączyłoby 300 zł.'},
     {label:'[Podaj nazwisko:]',correct:[4],explanation:'Nawias kwadratowy z tekstem to parametr — okno „Wprowadzanie wartości parametru”.'}
    ]}
   ]},
  {id:'l1',label:'Poziom 1',title:'Poziom 1: jedna tabela.',intro:'Trzy zlecenia z tabeli Pacjenci. Zalicz 2 z 3, żeby otworzyć poziom 2. Za trafienie przy pierwszym sprawdzeniu — 2 pkt.',grouping:'solo',
   reading:{title:'Jak zbudować kwerendę w 4 ruchach',paragraphs:['1) „Pokaż tabelę” → Pacjenci. 2) Kliknij potrzebne pola, żeby trafiły do siatki. 3) Wpisz kryterium w kolumnie pola, którego dotyczy warunek (jeśli tej kolumny nie ma w wyniku — odznacz „Pokaż”). 4) Ustaw Sortuj i kliknij „Uruchom (!)”.','„Sprawdź zlecenie” porównuje Twój wynik z oczekiwanym: kolumny, wiersze i — jeśli recepcja o to prosi — kolejność. Komunikat powie, czego jest za dużo lub za mało.']},
   ...note(9,'Uczniowie pracują samodzielnie. Po 5 minutach sprawdź, kto nie ma jeszcze żadnego zaliczenia, i zbierz tę grupę przy jednym ekranie na 2-minutowy instruktaż (zlecenie 1A). Szybcy mogą już przejść dalej.','Dlaczego kolumna miasto ma odznaczone „Pokaż”?','Bo recepcja chce tylko imię, nazwisko i telefon; miasto służy tylko do filtrowania.','Kryterium wpisane w złej kolumnie (np. "Wrocław" pod nazwiskiem) albo "K" zamiast Jak "K*".','Zadanie dodatkowe: pacjenci z Wrocławia LUB Oławy, bez e-maila.'),
   activities:[lab(1,'Poziom 1: jedna tabela','Wykonaj zlecenia recepcji na tabeli Pacjenci (zalicz co najmniej 2 z 3).',['Wynik ma dokładnie te kolumny, o które prosi recepcja — pole z kryterium może zostać w siatce z odznaczonym „Pokaż”.','Tekst w kryterium piszesz w cudzysłowie ("Wrocław"), a puste pole to Jest Null.','Kolejność ustawiasz w wierszu Sortuj.'])]},
  {id:'l2',label:'Poziom 2',title:'Poziom 2: łączymy tabele.',intro:'Dane pacjenta są w Pacjenci, termin w Wizyty, lekarz w Lekarze. Dodaj właściwe tabele — relacje połączą je same.',grouping:'solo',
   reading:{title:'Relacje robią robotę',paragraphs:['Gdy w projekcie są Pacjenci i Wizyty, Access łączy każdą wizytę z jej pacjentem po id_pacjenta (INNER JOIN). Dodaj tylko potrzebne tabele: zbędna tabela Wizyty w kwerendzie o pacjentach powieli ich tyle razy, ile mają wizyt.','Nazwisko lekarza jest w tabeli Lekarze. Możesz wpisać "Korona" w Lekarze.nazwisko albo 2 w Wizyty.id_lekarza — oba sposoby dają ten sam wynik.']},
   ...note(10,'Po zaliczeniu 2 z 3 zleceń uczniowie w parach porównują Widok SQL zlecenia 2A (1 minuta): czy mają INNER JOIN i to samo WHERE? Przy 2B wspomnij o pułapce daty z godziną w prawdziwym Accessie.','Czym różni się SQL kwerendy 2A od 1A?','Ma INNER JOIN Pacjenci–Wizyty i kryterium na polu Wizyty.termin; sortuje po terminie.','Brak tabeli Lekarze przy kryterium "Korona" w polu Pacjenci.nazwisko — wynik pusty; oraz dwa warunki w różnych wierszach (LUB zamiast I).','Zmień 2A tak, by działała każdego dnia: kryterium Date()+1.'),
   activities:[lab(2,'Poziom 2: łączymy tabele','Wykonaj zlecenia z kilku powiązanych tabel (zalicz co najmniej 2 z 3).',['W projekcie są wszystkie tabele, z których bierzesz pola — i żadnej zbędnej.','Kryteria w jednym wierszu = I (oba warunki naraz), w wierszu lub = LUB.','Datę wpisujesz w znakach #, np. #2026-10-07#.'])]},
  {id:'l3',label:'Poziom 3',title:'Poziom 3: policz i zapytaj.',intro:'Kierowniczka pyta o liczby: ile wizyt, ile złotych. A recepcja chce jedną kwerendę na każde nazwisko.',grouping:'pair',
   reading:{title:'Σ Sumy i parametry',paragraphs:['Po kliknięciu „Sumy” pojawia się wiersz Podsumowanie. „Grupuj według” tworzy grupy (np. po nazwisku lekarza), a „Policz” / „Suma” liczy coś w każdej grupie. Każda kolumna z „Grupuj według” dzieli wynik na drobniejsze grupy — dodaj tylko te, o które pyta zlecenie.','Kwerenda parametryczna ma w kryterium pytanie w nawiasie kwadratowym, np. [Podaj nazwisko pacjenta:]. Po uruchomieniu Access pokazuje okno „Wprowadzanie wartości parametru” — jedna kwerenda zamiast osobnej dla każdego pacjenta.']},
   ...note(10,'Sprawdzenie w parach: zanim uczeń kliknie „Uruchom”, partner czyta kryteria i Podsumowanie na głos i przewiduje liczbę wierszy (np. „2 wiersze — dwóch lekarzy”). Potem zamiana. Kto pracuje sam, zapisuje przewidywanie na kartce.','Ile wierszy da kwerenda „liczba wizyt każdego lekarza” i dlaczego?','Dwa — jest dwóch lekarzy, a grupujemy tylko po nazwisku lekarza.','Policz zamiast Suma przy utargu (liczba wizyt zamiast złotówek) oraz grupowanie po dodatkowej kolumnie.','Dodaj do 3B kolumnę Średnia z kosztu i porównaj z Sumą.'),
   activities:[lab(3,'Poziom 3: policz i zapytaj','Utwórz kwerendy podsumowujące i parametryczną (zalicz co najmniej 2 z 3).',['Po włączeniu Σ grupujesz tylko po tym, o co pyta zlecenie.','Policz liczy wiersze, Suma dodaje wartości (złotówki).','Parametr to pytanie w nawiasie kwadratowym — kwerenda działa dla każdego nazwiska.'])]},
  {id:'result',label:'Wynik',title:'Twój wynik: ile zleceń recepcji ogarniesz?',intro:'Karta zbiera punkty z quizów i trzech poziomów. Odpowiedz na pytanie pod kartą i pokaż wynik nauczycielowi.',grouping:'solo',
   ...note(5,'Uczniowie zaznaczają samoocenę i odpowiadają na pytanie otwarte. Poproś 2–3 osoby o uzasadnienie wyboru „najbardziej przydatnej kwerendy”.','Która kwerenda najbardziej przyda się recepcji i dlaczego?','Najczęściej 2A (SMS-y na jutro — codziennie) albo 3C (jedna kwerenda na każde nazwisko).','Uczeń myli liczbę zaliczonych zleceń z punktami: zaliczenie po poprawce daje 1 pkt, przy pierwszym sprawdzeniu 2 pkt.','Zaproponuj własną kwerendę dla szkolnego sekretariatu i zapisz ją w siatce na kartce.'),
   activities:[
    {type:'resultCard',id:'result',title:'Karta wyniku: kwerendy',sources:['q-hook','q-append','q-rel','q-crit','q-l1','q-l2','q-l3'],badges:[
     {min:0,name:'Stażysta recepcji',text:'Baza jeszcze Cię nie słucha, ale pierwsze pytania już zadajesz. Wróć do poziomu 1 — tam się zaczyna.'},
     {min:0.5,name:'Kierownik zmiany',text:'Listy do SMS-ów i telefonów robisz w minutę. Recepcja może iść na kawę.'},
     {min:0.85,name:'Mózg gabinetu',text:'Liczysz utarg, łączysz tabele i zadajesz bazie pytania z parametrem. Tak wygląda analityk danych na starcie.'}
    ]},
    {type:'text',id:'q-reflect',question:'Która kwerenda najbardziej przyda się recepcji i dlaczego?',minLength:20,explanation:'Przykład: „Przypomnienia SMS na jutro — recepcja używa jej codziennie, a zapisana kwerenda zawsze pokazuje aktualne dane”. To samoocena; nauczyciel może poprosić o rozwinięcie.'}
   ]}
 ],
 exitTicket:'Umiesz zadać bazie pytanie: wybrać kolumny i wiersze, połączyć tabele, policzyć i zsumować, a nawet zbudować kwerendę, która sama pyta o nazwisko. Tak pracują recepcje, sklepy i działy sprzedaży.'
};
