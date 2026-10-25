import {note, choice, reveal} from '../schema.js';

// Lekcja 75 (klasa 1, temat 46): zasady prezentacji — diagnoza błędów na platformie, naprawa złej prezentacji w PowerPoincie.
// Materiały: public/materials/powerpoint/ (generator scripts/build-powerpoint-materials.py, opis docs/powerpoint-desktop.md).
export default {
 id:'75',grade:1,order:46,workspace:'desktop-powerpoint',
 title:'Zasady tworzenia prezentacji multimedialnej',
 subtitle:'Prezentacja na praktykach, w szkole albo na rozmowie: naprawisz najgorszą prezentację świata i nauczysz się mówić, a nie czytać ze slajdów.',
 topic:'Zasady tworzenia prezentacji multimedialnej',icon:'projector',tags:['PowerPoint','Slajdy','Wystąpienie'],duration:45,
 curriculum:'PP 2024 · zakres podstawowy · II.3.e — tworzenie prezentacji, w tym z wykorzystaniem technik multimedialnych; II.2 — dobór aplikacji i zasobów (motyw, układy, wzorzec slajdów, legalne grafiki); nawiązanie do V.2 — prawo autorskie przy grafikach.',
 format:{
  name:'Diagnoza i naprawa: od najgorszej prezentacji do czytelnej',
  student:'Najpierw na platformie wyłapiesz błędy na pięciu slajdach. Potem pobierzesz celowo złą prezentację o praktykach i naprawisz ją w PowerPoincie według kryteriów. Na koniec przeniesiesz tekst do notatek prelegenta, żeby mówić, a nie czytać. Efekt: plik lesson-75-nazwisko.pptx.',
  teacher:'Start: dwa pytania powtórkowe (wykres na slajd, licencja CC) i hak. Krytyk slajdów to diagnoza — po 9 minutach sprawdź licznik i omów najczęściej pomijany błąd (zwykle brak źródła na slajdzie E). Krótko modelujesz na projektorze jedno kliknięcie „Resetuj” na zaznaczonych slajdach: to przykład rozwiązany, po którym uczniowie naprawiają resztę sami. Naprawa pliku to poprawa pierwszej wersji według jawnych kryteriów; obchodząc salę, dajesz jedną uwagę związaną z kryterium. Kończy samoocena pliku i bilet wyjścia.',
  grouping:'Każdy pracuje sam na swoim komputerze i swoim pliku. Para tylko opcjonalnie w etapie „Mów, nie czytaj”: 30-sekundowa próba przed osobą obok. Bez pary — próba półgłosem z widokiem prezentera.',
  methods:[
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:[
  'Rozpoznaję typowe błędy slajdów: ściana tekstu, mała czcionka, słaby kontrast, za dużo animacji, grafika bez licencji lub źródła.',
  'Stosuję zasadę 1 slajd = 1 myśl i dobieram układ slajdu do treści.',
  'Poprawiam prezentację w PowerPoincie motywem, układami i wzorcem slajdów zamiast ręcznego formatowania.',
  'Przenoszę szczegóły do notatek prelegenta i podpisuję grafiki: tytuł, autor, źródło, licencja.'
 ],
 materials:[
  'PowerPoint na komputerze (Windows: 2019/2021/2024 lub Microsoft 365); nazwy poleceń mogą się nieznacznie różnić między wersjami',
  'Plik lesson-75-start.pptx i ilustracja lesson-75-grafika.png z tej strony; przeglądarka obok PowerPointa',
  'Folder ucznia na zapis pliku. Bez konta w chmurze. Opcjonalnie: telefon jako stoper w etapie próby'
 ],
 teacherGuide:{
  preparation:'Przed lekcją otwórz lesson-75-start.pptx w szkolnym PowerPoincie: sprawdź widok chroniony (Włącz edytowanie), działanie Narzędzia główne → Resetuj na kilku zaznaczonych slajdach, Projektowanie → Formatuj tło → Resetuj tło oraz Widok → Wzorzec slajdów → Czcionki. Starter ma 6 slajdów z celowymi błędami: ręczne formatowanie w symbolach zastępczych (Impact, Comic Sans, Times New Roman, kolory), ręczne tła slajdów 1 i 6, ścianę tekstu 16 pt na slajdzie 2, jasnożółty tekst i 5 animacji na slajdzie 3, rozciągnięte zdjęcie fikcyjnego fotobanku ze znakiem wodnym i bez źródła na slajdzie 4, tabelę 8×4 w 11 pt na slajdzie 5, czerwony na zielonym na slajdzie 6, efektowne przejścia, brak notatek i brak slajdu Źródła. Czcionek Impact, Comic Sans MS i Monotype Corsiva może nie być na komputerze — wtedy PowerPoint podstawi inne; ćwiczenie działa tak samo. Ilustracja lesson-75-grafika.png jest autorska (materiał lekcji, CC0) — to legalny zamiennik zdjęcia ze znakiem wodnym. Pokaz na projektorze: zaznacz miniatury Ctrl+A i kliknij Resetuj — to jest jedyny moment modelowania.',
  summary:'Produkt: lesson-75-nazwisko.pptx. Sprawdź plik, nie wynik quizu: jednolite czcionki i kolory z motywu (po kliknięciu w tytuł nie ma ręcznego kroju), tła bez ręcznych zmian, slajd 2 z 3 hasłami i zdaniami w notatkach, 0–1 animacja na slajd, grafika bez znaku wodnego z podpisem TASL, slajd Źródła, notatki na co najmniej 3 slajdach. Rubryka 0–10 jest samooceną, nie automatycznym sprawdzeniem pliku. Karta quizu (bez oceny) zlicza tylko pytania i ćwiczenia na stronie. Najczęstszy błąd do omówienia na początku lekcji 47: „Źródło: internet / Google” to nie jest źródło.'
 },
 sections:[
  {id:'start',label:'Start',title:'Klasa ziewa po drugim slajdzie',grouping:'solo',
   intro:'Za tydzień pokazujesz projekt w szkole, firmę na praktykach albo siebie na rozmowie o staż. Większość ludzi przegrywa nie treścią, tylko slajdami: czyta je na głos i gubi słuchaczy. Najpierw dwa szybkie pytania z poprzednich lekcji.',
   ...note(5,'Odczytaj hak i zapytaj: kto widział prezentację, na której ktoś czytał ze slajdów? Uczniowie odpowiadają sami, bez notatek (retrieval: wykresy z arkusza i licencje z lekcji o rozpowszechnianiu programów). Omów odpowiedzi w 1 minucie. Jeśli wielu wybiera „bez podpisu, bo to szkoła” — zapowiedz, że dziś to naprawimy w pliku.','Po czym poznajesz nudną prezentację w pierwszych 10 sekundach?','Dużo tekstu, mała czcionka, prezenter czyta i stoi tyłem do sali, kolorowe animacje zamiast treści.','Przekonanie, że w szkole wolno wziąć każdą grafikę z internetu, bo „to nie na sprzedaż”.','Zapytaj, kto będzie miał prezentację na praktykach lub w innym przedmiocie w tym semestrze — niech zapamiętają dzisiejsze 3 zasady.'),
   activities:[
    choice('p75-chart','Powtórka z wykresów: na slajd masz wyniki ankiety — 60% wybiera praktyki w firmie, 30% w szkole, 10% nie wie. Co pokażesz?',['Prosty wykres kołowy albo słupkowy z trzema podpisanymi wartościami','Całą tabelę z arkusza: 50 wierszy odpowiedzi','Wykres 3D z cieniem, 12 kolorami i legendą w 8 pt','Wszystkie liczby w jednym długim zdaniu'],[0],'Słuchacz ma na slajd kilka sekund. Trzy wartości → prosty wykres z podpisami. Tabela 50 wierszy i efekty 3D zasłaniają wniosek.','Ile sekund słuchacz patrzy na slajd? Co zrozumie najszybciej?'),
    choice('p75-license','Powtórka z licencji: zdjęcie na Wikimedia Commons ma licencję CC BY-SA 4.0. Czy wolno go użyć w prezentacji na lekcji?',['Tak, z podpisem: tytuł, autor, źródło, licencja','Tak, bez podpisu — to tylko szkoła','Nie, licencje CC zawsze zabraniają użycia','Tak, ale trzeba wyciąć nazwisko autora'],[0],'CC BY wymaga uznania autorstwa, SA — tej samej licencji dla przeróbek. W szkole też podpisujesz grafiki (TASL: tytuł, autor, źródło, licencja). Dziś zrobisz to w PowerPoincie.','Litery BY w nazwie licencji oznaczają…?')
   ]},
  {id:'diagnose',label:'Diagnoza',title:'Krytyk slajdów: znajdź wszystkie błędy',grouping:'solo',
   intro:'Pięć slajdów, a na niektórych po dwa błędy. Jeden slajd jest dobry — też trzeba to umieć rozpoznać. Patrz na tekst, kolory, grafikę i okienko animacji.',
   reading:{title:'Sześć grzechów slajdów',paragraphs:[
    'Slajd ma pomagać słuchaczowi, a nie zastępować prezentera. Ściana tekstu i czcionka poniżej ok. 24 pt sprawiają, że sala czyta, zamiast słuchać. Słaby kontrast (jasnożółty na białym, czerwony na zielonym) znika na projektorze w jasnej sali.',
    'Animacje i efektowne przejścia odciągają uwagę od treści — wystarczy 0–1 prosty efekt. Zdjęcie ze znakiem wodnym („podgląd”, nazwa fotobanku) to płatne zdjęcie bez licencji. Każda cudza grafika i liczba potrzebuje źródła; „internet” i „Google” nie są źródłem.'],
    example:{question:'Na slajdzie jest 6 linijek tekstu w 28 pt, ciemny tekst na jasnym tle i zdjęcie podpisane „Źródło: Google Grafika”. Co poprawisz?',answer:'Tylko podpis zdjęcia: Google to wyszukiwarka. Trzeba wejść na stronę, gdzie zdjęcie opublikował autor, i wpisać tytuł, autora, źródło i licencję — albo wymienić zdjęcie.'}},
   ...note(9,'Uczniowie pracują sami. Po ok. 6 minutach zerknij na liczniki: kto ma mniej niż 3 slajdy, dostaje podpowiedź „patrz na podpis pod grafiką i do okienka animacji”. Pytanie diagnostyczne do klasy: „Dlaczego slajd D jest dobry?”. Jeśli ponad 1/3 klasy zaznacza błąd na slajdzie D, wyjaśnij kryteria jeszcze raz na tym jednym slajdzie, zanim przejdziecie dalej.','Dlaczego „Źródło: internet” na slajdzie E nie wystarcza?','Nie wiadomo, kto zebrał dane, kiedy i gdzie je opublikował — nie da się tego sprawdzić.','Uczniowie zaznaczają wszystko „na wszelki wypadek” albo pomijają brak źródła, bo slajd wygląda ładnie.','Dla szybkich: na każdym błędnym slajdzie powiedz, jak naprawić go jednym poleceniem PowerPointa.'),
   activities:[
    {type:'slideCritic',id:'p75-critic',mode:'errors',set:'basics',points:10}
   ]},
  {id:'rules',label:'Zasady',title:'1 slajd = 1 myśl i układ do treści',grouping:'class',
   intro:'Ładny slajd nie powstaje przez przesuwanie pól myszką. PowerPoint ma motywy, układy i wzorzec slajdów — jak style w Wordzie. Kliknij karty, potem dobierz układy.',
   reading:{title:'Motyw, układ, wzorzec',paragraphs:[
    'Jeden slajd = jedna myśl: tytuł mówi wniosek, a pod nim 3–4 hasła, wykres albo jedno zdjęcie. Szczegóły i pełne zdania idą do notatek prelegenta — widzisz je tylko Ty.',
    'Motyw (Projektowanie) ustala kolory, czcionki i tło całej prezentacji. Układ (Narzędzia główne → Układ) to gotowe pola na tytuł, tekst, zdjęcie. Wzorzec slajdów (Widok → Wzorzec slajdów) to „styl” dla wszystkich slajdów: zmieniasz czcionkę raz, a zmienia się wszędzie. Ręczne formatowanie psuje ten mechanizm — przycisk Resetuj je usuwa.']},
   ...note(6,'Pokaż na projektorze galerię Narzędzia główne → Układ i wzorzec slajdów (30 sekund). Zapytaj o porównanie z lekcją o stylach w Wordzie. Potem uczniowie dobierają układy sami. Jeśli wielu myli „Porównanie” z „Dwie zawartości”, pokaż różnicę na miniaturach: nagłówki nad kolumnami.','Co ma wspólnego wzorzec slajdów ze stylem Nagłówek 1 w Wordzie?','Jedna zmiana definicji zmienia wygląd wszystkich elementów tej roli w całym pliku.','Uczniowie rysują własne pola tekstowe na układzie Pusty zamiast wybrać układ z polami.','Dla chętnych: na kartce narysuj układ slajdu, którego brakuje w galerii, i opisz, do jakiej treści by służył.'),
   activities:[
    reveal('p75-cards',[
     {title:'Motyw',icon:'palette',short:'Kolory, czcionki i tło całej prezentacji',text:'Projektowanie → Motywy. Wybierz jasne tło i ciemny tekst (albo odwrotnie). Zmiana motywu działa tylko tam, gdzie nie ma ręcznego formatowania.'},
     {title:'Układ slajdu',icon:'board',short:'Gotowe pola na tytuł, tekst i obraz',text:'Narzędzia główne → Układ. Zmieniasz rozmieszczenie jednym kliknięciem, a tekst trafia do właściwych pól. Resetuj przywraca położenie i wygląd pól.'},
     {title:'Wzorzec slajdów',icon:'settings',short:'„Styl” dla wszystkich slajdów',text:'Widok → Wzorzec slajdów → kliknij największą miniaturę u góry. Zmień np. czcionki — zmienią się na wszystkich slajdach. Zamknij widok wzorca.'},
     {title:'Notatki prelegenta',icon:'list',short:'Ściąga widoczna tylko dla Ciebie',text:'Widok → Notatki albo przycisk Notatki na pasku stanu. W pokazie z widokiem prezentera widzisz notatki, zegar i następny slajd; widownia widzi tylko slajd.'}
    ]),
    {type:'slideCritic',id:'p75-layout',mode:'layout',points:6},
    choice('p75-master','We wszystkich 12 tytułach slajdów chcesz zmienić czcionkę. Co jest najszybsze i nie psuje spójności?',['Widok → Wzorzec slajdów → zmieniam czcionkę tytułu we wzorcu','Klikam każdy tytuł i zmieniam czcionkę ręcznie','Kopiuję jeden tytuł i wklejam go na każdy slajd','Zmieniam czcionkę tylko na pierwszym slajdzie'],[0],'Wzorzec slajdów działa jak styl w Wordzie: jedna zmiana trafia na wszystkie slajdy z tym układem. Ręczne zmiany trzeba by powtarzać 12 razy i łatwo o różnice.','Jak w Wordzie zmieniłeś wygląd wszystkich rozdziałów jednocześnie?')
   ]},
  {id:'repair',label:'Naprawa',title:'Napraw najgorszą prezentację świata',grouping:'solo',
   intro:'Pobierz prezentację o praktykach i ilustrację. Pracuj w PowerPoincie na komputerze. Zacznij od kroków, które naprawiają wszystko naraz — to szybki sukces.',
   ...note(14,'Na projektorze pokaż tylko krok 2 (Ctrl+A na miniaturach → Resetuj → Resetuj tło) — reszta to samodzielna poprawa według kryteriów. Obchodząc salę, dawaj jedną uwagę na osobę, powiązaną z kryterium („Slajd 3: w okienku animacji masz jeszcze 4 efekty”). Po 8 minutach poproś, żeby każdy kliknął F5 i obejrzał 2 slajdy — to kontrola w trakcie.','Dlaczego po kliknięciu Resetuj gwiazdki na slajdzie 3 nadal są kolorowe?','To osobne kształty, nie symbole zastępcze z układu. Resetuj naprawia tylko pola układu, kształty trzeba usunąć.','Uczniowie formatują każdy slajd osobno zamiast zresetować wszystkie; rozciągają grafikę za krawędź zamiast za róg; zostawiają podpis „zdjęcie z internetu”.','Dla szybkich: krok 6 (tabela → wniosek albo wykres) i spójne przejście „Zanikanie” na wszystkich slajdach.'),
   activities:[
    {type:'download',id:'p75-file',file:'materials/powerpoint/lesson-75-start.pptx',label:'Pobierz złą prezentację (.pptx)',title:'Plik startowy — praktyki zawodowe',description:'6 slajdów z celowymi błędami. Otwórz w PowerPoincie na komputerze. Jeśli pojawi się widok chroniony, kliknij Włącz edytowanie. Od razu Plik → Zapisz jako → lesson-75-nazwisko.pptx.'},
    {type:'download',id:'p75-image',file:'materials/powerpoint/lesson-75-grafika.png',label:'Pobierz legalną ilustrację (.png)',title:'Ilustracja do slajdu 4',description:'Autorska ilustracja stanowiska pracy z materiałów lekcji, bez znaku wodnego. Licencja CC0 (domena publiczna). Podpis znajdziesz w kroku 5.'},
    {type:'wordSteps',id:'p75-steps',title:'Naprawa w PowerPoincie',steps:[
     {title:'Własna kopia',instruction:'Plik → Zapisz jako → folder ucznia → nazwa lesson-75-nazwisko.pptx. Pracuj tylko na tej kopii.',check:'Na pasku tytułu PowerPointa widzisz nazwę lesson-75-nazwisko.',help:'Plik otwiera się tylko do odczytu? Kliknij Włącz edytowanie na żółtym pasku i zapisz kopię jeszcze raz.'},
     {title:'Jedno kliknięcie zamiast trzydziestu',instruction:'Kliknij pierwszą miniaturę po lewej i naciśnij Ctrl+A (zaznaczasz wszystkie slajdy). Narzędzia główne → Resetuj. Nie odznaczając slajdów: Projektowanie → Formatuj tło → Resetuj tło. Zamknij okienko tła.',check:'Tytuły i teksty mają jednolitą czcionkę i kolor, tła slajdów 1 i 6 są białe, pola wróciły na swoje miejsca.',help:'Coś nadal wygląda dziwnie? To osobny kształt albo pole tekstowe, nie pole układu — Resetuj go nie zmienia. Zaznacz tekst i naciśnij Ctrl+Spacja albo usuń kształt.'},
     {title:'Motyw i wzorzec',instruction:'Projektowanie → wybierz motyw z jasnym tłem i ciemnym tekstem. Widok → Wzorzec slajdów → kliknij największą miniaturę u góry → Czcionki → wybierz czytelną parę (np. Calibri lub Arial). Zamknij widok wzorca.',check:'Zmiana czcionki we wzorcu zmienia tytuły na wszystkich slajdach naraz.',help:'Któryś tytuł się nie zmienił? Ma ręczne formatowanie — zaznacz go i kliknij Resetuj na tym slajdzie.'},
     {title:'Animacje, przejścia i ozdobniki',instruction:'Slajd 3: zaznacz gwiazdki i strzałkę, naciśnij Delete. Animacje → Okienko animacji → zaznacz wszystkie efekty → Delete (możesz zostawić najwyżej jeden prosty, np. Zanikanie). Przejścia → Brak → Zastosuj do wszystkich.',check:'Okienko animacji na slajdzie 3 jest puste albo ma jeden efekt. Pokaz (F5) nie ma kręcących się kół i szachownic.',help:'Nie widzisz okienka? Animacje → Okienko animacji otwiera je po prawej. Efekty usuniesz też przyciskiem Brak w galerii Animacje.'},
     {title:'Grafika legalnie i z podpisem',instruction:'Slajd 4: usuń zdjęcie ze znakiem wodnym i pole „zdjęcie z internetu”. Wstawianie → Obrazy → To urządzenie → lesson-75-grafika.png. Zmieniaj rozmiar tylko za róg. Pod grafiką: Wstawianie → Pole tekstowe → „Ilustracja: Stanowisko pracy, autor: materiały lekcji Informatyka praktycznie, licencja CC0”.',check:'Na slajdzie nie ma znaku wodnego, grafika nie jest rozciągnięta, podpis ma tytuł, autora, źródło i licencję.',help:'Wolisz własne zdjęcie z telefonu albo grafikę z Wikimedia Commons? Też dobrze — podpisz: tytuł – autor – źródło – licencja. Grafika z AI: „Grafika wygenerowana przez AI (narzędzie, data)”.'},
     {title:'Tabela → jeden wniosek (opcjonalnie)',instruction:'Slajd 5: zmień tytuł na wniosek, np. „Najczęściej boimy się, że nie damy rady (38%)”. Usuń wiersze od „Że będę się nudzić” do „Inne” (Układ tabeli → Usuń → Usuń wiersze) i kolumnę Uwagi. Powiększ tekst tabeli do min. 24 pt. Pod tabelą dodaj pole tekstowe „Ankieta: 50 uczniów, dane fikcyjne”. Dla chętnych: zamiast tabeli Wstawianie → Wykres → Słupkowy.',check:'Tytuł mówi wniosek, tabela ma najwyżej 4 wiersze i da się ją przeczytać z ostatniej ławki. Pod tabelą jest informacja o danych.',help:'Nie widzisz karty Układ tabeli? Kliknij w środek tabeli — karty tabeli pojawią się na wstążce.'},
     {title:'Slajd Źródła',instruction:'Kliknij miniaturę slajdu 5. Narzędzia główne → Nowy slajd → Tytuł i zawartość. Tytuł: „Źródła”. Wpisz: podpis ilustracji ze slajdu 4 oraz „Ankieta: dane fikcyjne (materiał lekcji)”. Ctrl+S.',check:'Przedostatni slajd to Źródła z podpisem grafiki i danych. Plik zapisany.',help:'Nowy slajd pojawił się w złym miejscu? Przeciągnij jego miniaturę w panelu po lewej.'}
    ]}
   ]},
  {id:'speak',label:'Mów',title:'Mów, nie czytaj: notatki prelegenta',grouping:'solo',
   intro:'Slajd 2 to ściana tekstu. Zdania nie znikają — przenosisz je do notatek, a na slajdzie zostają hasła. Najpierw zdecyduj, co gdzie trafia.',
   reading:{title:'Slajd jest dla widowni, notatki dla Ciebie',paragraphs:[
    'Na slajdzie zostaw krótkie hasła (do ok. 6 słów), które słuchacz zrozumie w 3 sekundy. Pełne zdania, liczby do zapamiętania i przykłady wpisz do notatek prelegenta. W widoku prezentera (Pokaz slajdów → Użyj widoku prezentera) widzisz je na swoim ekranie.',
    'Mów do ludzi: patrz na salę, zacznij od przykładu albo pytania, a na slajd spoglądaj tylko na chwilę. Jeden slajd to zwykle 30–60 sekund mówienia.']},
   ...note(7,'Najpierw dopasowanie na platformie (2 minuty), potem krok w PowerPoincie. Opcjonalnie para: uczeń mówi przez 30 sekund o slajdzie 2 do osoby obok, która mówi tylko jedno: „patrzyłeś na mnie / czytałeś”. Bez pary — półgłosem z widokiem prezentera. Nie oceniaj publicznie.','Co powiesz przy haśle „Opiekun: zadania + ocena”, żeby nie czytać?','Np. „Na praktykach masz swojego szefa — opiekuna. To on daje zadania i to on wystawia ocenę, która trafia do szkoły.”','Uczniowie usuwają zdania zamiast przenieść je do notatek albo przepisują całe zdania jako hasła.','Dla chętnych: dopisz do notatek pytanie do sali, którym zaczniesz slajd.'),
   activities:[
    {type:'matching',id:'p75-notes',question:'Slajd 2 po naprawie: co zostaje na slajdzie, a co idzie do notatek prelegenta?',options:['Na slajd — hasło','Do notatek prelegenta'],rows:[
     {label:'Praktyki = nauka w prawdziwej firmie',correct:[0],explanation:'Krótkie hasło, słuchacz zrozumie je w 3 sekundy.'},
     {label:'Praktyki zawodowe to część nauki w technikum, która odbywa się w prawdziwej firmie albo instytucji, a nie w szkole.',correct:[1],explanation:'Pełne zdanie do powiedzenia — w notatkach.'},
     {label:'Opiekun: zadania + ocena',correct:[0],explanation:'Hasło streszcza całe zdanie o opiekunie.'},
     {label:'Uczeń prowadzi dzienniczek praktyk i wpisuje do niego wykonane zadania.',correct:[1],explanation:'Szczegół, który powiesz, ale nie musi wisieć na slajdzie.'},
     {label:'Szansa na pracę po szkole',correct:[0],explanation:'Krótka korzyść — dobra na koniec slajdu.'},
     {label:'Telefon w czasie pracy odkładamy, chyba że opiekun pozwoli inaczej, bo w wielu firmach obowiązują zasady dotyczące zdjęć i nagrywania.',correct:[1],explanation:'Długie zdanie z uzasadnieniem — do notatek.'}
    ]},
    choice('p75-talk','Na slajdzie jest hasło „Praktyki = nauka w prawdziwej firmie”. Które otwarcie działa najlepiej?',['Patrzę na klasę: „Wyobraźcie sobie poniedziałek, 7.30 — nie idziecie do szkoły, tylko do serwisu, gdzie czeka na was prawdziwa naprawa.”','Odwracam się do ekranu i czytam hasło na głos','Czytam z notatek wszystkie zdania po kolei, nie podnosząc wzroku','Mówię: „Tu wszystko jest napisane, przeczytajcie sami”'],[0],'Przykład z życia i kontakt wzrokowy przyciągają uwagę. Hasło na slajdzie tylko przypomina, o czym mówisz. Czytanie — ze slajdu albo z notatek — gubi słuchaczy.','Co sprawia, że słuchasz kogoś na YouTube, a nie przewijasz?'),
    {type:'wordSteps',id:'p75-notes-steps',title:'Notatki w PowerPoincie',steps:[
     {title:'Zdania do notatek',instruction:'Slajd 2: kliknij przycisk Notatki na pasku stanu na dole (albo Widok → Notatki). Zaznacz w polu treści wszystkie zdania, Ctrl+X, kliknij w pole notatek, Ctrl+V. W polu treści wpisz 3 hasła z ćwiczenia powyżej. Zmień tytuł na krótki, np. „Praktyki w 3 hasłach”.',check:'Slajd 2 ma 3 hasła w czcionce min. 24 pt, a pod slajdem, w notatkach, są pełne zdania.',help:'Pole notatek jest bardzo wąskie? Przeciągnij jego górną krawędź w górę.'},
     {title:'Próba 30 sekund',instruction:'Na slajdach 2 i 3 dopisz w notatkach 2–3 hasła, co powiesz. Pokaz slajdów → zaznacz Użyj widoku prezentera → Od początku (F5). Powiedz półgłosem 30 sekund o slajdzie 2, patrząc ponad monitor. Esc kończy pokaz. Ctrl+S.',check:'Masz notatki na co najmniej 3 slajdach i mówiłeś o slajdzie 2 bez czytania zdań w całości.',help:'Na jednym monitorze widok prezentera nie pojawia się? W trakcie pokazu kliknij prawym przyciskiem → Pokaż widok prezentera.'}
    ]}
   ]},
  {id:'finish',label:'Oceń',title:'Sprawdź plik i odpowiedz bez instrukcji',grouping:'solo',
   intro:'Zapisz plik i pokaż go nauczycielowi lub oddaj tak, jak ustaliliście. Najpierw oceń swój plik według kryteriów — strona nie widzi Twojego PowerPointa.',
   ...note(4,'Obejrzyj kilka plików: kliknij w tytuł (czy ma krój z motywu), otwórz okienko animacji na slajdzie 3, sprawdź podpis grafiki i notatki. Zbierz bilety wyjścia. Jeśli ponad 1/3 nie wymienia źródeł grafik, zacznij od tego lekcję 47.','Jaką jedną zasadę zastosujesz w swojej następnej prezentacji?','Np. 1 slajd = 1 myśl, tekst do notatek, podpis grafiki, min. 24 pt.','Samoocena 10/10 bez otwarcia pliku albo uznanie wyniku quizu za ocenę prezentacji.','Na następnej lekcji wykorzystasz te zasady w projekcie o Chopinie.'),
   activities:[
    {type:'wordRubric',id:'p75-rubric',title:'Samoocena prezentacji: 0–10',filename:'lesson-75-nazwisko.pptx',criteria:[
     {label:'Motyw, układy i wzorzec',points:2,description:'0: ręczne kroje i kolory zostały na większości slajdów; 1: zresetowana część slajdów albo tła nadal ręczne; 2: wszystkie slajdy mają czcionki i kolory z motywu lub wzorca, tła bez ręcznych zmian.'},
     {label:'Czytelność: kontrast i wielkość',points:2,description:'0: jasny tekst na jasnym tle albo treść poniżej 20 pt; 1: jeden slajd nadal trudny do odczytania; 2: na każdym slajdzie ciemny tekst na jasnym tle (lub odwrotnie) i treść min. ok. 24 pt.'},
     {label:'1 slajd = 1 myśl',points:2,description:'0: slajd 2 nadal jest ścianą tekstu; 1: slajd 2 skrócony, ale ma ponad 4 punkty albo pełne zdania; 2: slajd 2 ma 3–4 hasła, a tytuły mówią, o czym jest slajd.'},
     {label:'Animacje i przejścia',points:1,description:'0: zostały wirujące efekty lub kilka animacji na slajdzie; 1: najwyżej jeden prosty efekt na slajd i spokojne przejścia albo brak.'},
     {label:'Grafika i źródła',points:2,description:'0: zostało zdjęcie ze znakiem wodnym albo grafika bez podpisu; 1: legalna grafika, ale niepełny podpis lub brak slajdu Źródła; 2: grafika bez znaku wodnego, nierozciągnięta, z podpisem TASL i slajd Źródła.'},
     {label:'Notatki prelegenta',points:1,description:'0: brak notatek; 1: notatki na co najmniej 3 slajdach, w tym pełne zdania ze slajdu 2.'}
    ]},
    {type:'resultCard',id:'p75-result',title:'Sprawdzenie wiedzy na stronie',hideGrade:true,sources:['p75-chart','p75-license','p75-critic','p75-layout','p75-master','p75-notes','p75-talk'],badges:[
     {min:0,name:'Slajdy w budowie',text:'Wróć do Krytyka slajdów i sprawdź, co pominąłeś. Plik i tak oceniasz osobno.'},
     {min:0.6,name:'Oko do slajdów',text:'Widzisz większość błędów. Teraz pokaż to w swoim PPTX.'},
     {min:0.85,name:'Nikt nie ziewa',text:'Klasa nie zaśnie na Twojej prezentacji. Sprawdź jeszcze plik według kryteriów.'}
    ]},
    {type:'text',id:'p75-exit',question:'Bilet wyjścia: wymień 3 błędy, które naprawiłeś w pliku, i jedną zasadę, którą zastosujesz w następnej prezentacji. Dopisz: samodzielnie / z pomocą / potrzebuję powtórki.',placeholder:'Naprawiłem: … Zasada na następny raz: …',minLength:30,explanation:'Pokaż odpowiedź nauczycielowi — nie jest wysyłana automatycznie. Porównaj z kryteriami powyżej: czy Twoje 3 błędy to te, za które są punkty?'}
   ]}
 ],
 exitTicket:'Oddajesz lesson-75-nazwisko.pptx: motyw i wzorzec zamiast ręcznego formatowania, 1 slajd = 1 myśl, czytelny kontrast, legalna grafika z podpisem, slajd Źródła i notatki prelegenta.'
};
