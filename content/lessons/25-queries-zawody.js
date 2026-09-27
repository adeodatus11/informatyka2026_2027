import {note, choice, reveal} from '../schema.js';

const lab=(level,label,question,criteria)=>({type:'queryDesigner',id:`zq-l${level}`,stateKey:'query-lab',mode:`l${level}`,level,dataset:'zawody',points:6,label,question,criteria});

export default {
 id:'25',grade:3,title:'Zasady tworzenia kwerend na przykładzie bazy Zawody',
 subtitle:'Sędzia prosi o podium, protokół dyskwalifikacji i rekordy. Jedna kwerenda = wynik w sekundę, bez przepisywania.',
 topic:'Zasady tworzenia kwerend na przykładzie bazy Zawody',icon:'funnel',
 tags:['Kryteria','Sortowanie','Ranking'],duration:45,
 curriculum:'2024 Informatyka – liceum/technikum · bazy danych: kwerendy wybierające, kryteria, sortowanie, łączenie tabel, podsumowania, parametry, odczyt SQL',
 format:{
  name:'Zasady → zlecenia sędziego (mastery)',
  student:'Najpierw poznajesz zasady budowania kwerend i kryteria sukcesu. Potem wykonujesz zlecenia sędziego zawodów na trzech poziomach: listy startowe, oficjalne wyniki, protokół. Kolejny poziom otwiera się po zaliczeniu 2 z 3 zleceń. Efekt: oficjalne wyniki zawodów z bazy, której używałeś/-aś na lekcji o zawodach.',
  teacher:'Nauczanie jawne: w etapie 2 modelujesz na projektorze jedną kwerendę (podium 50 m dowolnym dziewcząt) głośno myśląc — co jest w siatce, skąd tabela, który wiersz to WHERE, dlaczego sortowanie rosnąco — i pokazujesz kryteria sukcesu. Potem mastery: poziom 2 i 3 są zablokowane do zaliczenia 2 z 3 zleceń poziomu niższego. Symulator porównuje wynik kwerendy (kolumny, wiersze, kolejność) i daje konkretną wskazówkę; 2 pkt za pierwsze sprawdzenie, 1 pkt po poprawce. Ocenianie kształtujące: po każdym poziomie pytasz 2–3 osoby, jakie kryterium było kluczowe, i zbierasz przy jednym ekranie osoby z tym samym błędem.',
  grouping:'Praca samodzielna; na poziomie 3 krótkie sprawdzenie z sąsiadem (przewidujecie liczbę wierszy przed „Uruchom”). Przy nieparzystej liczbie osób — trójka albo przewidywanie zapisane na kartce.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Buduję kwerendę wybierającą: pola, kryteria, „Pokaż” i sortowanie (ranking = czas rosnąco).','Używam kryteriów Jak "2*", Między … I …, <> "tak", porównań liczb z setnymi i łączę je przez I oraz LUB.','Łączę trzy powiązane tabele i tworzę kwerendy podsumowujące (Min, Policz, Gdzie).','Tworzę kwerendę parametryczną [Podaj klasę:] i odczytuję jej SQL.'],
 materials:['Przeglądarka z lekcją — komputer (siatka kwerendy jest szeroka)','Wbudowany symulator projektu kwerendy w stylu programu Access — bez instalowania pakietu Office','Baza „Zawody” z lekcji o zawodach pływackich: 30 zawodników, 8 konkurencji, 61 wyników (fikcyjne)'],
 teacherGuide:{
  preparation:'Otwórz etap 2 na projektorze. Symulator to ten sam projektant kwerend co w klasie 2, ale z bazą „Zawody”: Zawodnicy 1–∞ Wyniki ∞–1 Konkurencje. Czas to Liczba w sekundach z setnymi (32,46); dyskwalifikacja to Krótki tekst „tak”/„nie”. Pułapki zleceń: w podium 50 m dowolnym dziewcząt najlepszy czas ma zdyskwalifikowana Alicja Kaczmarek (trzeba <> "tak"); w rekordach konkurencji — Min, nie Maks, i warunek Gdzie na dyskwalifikacji; Dawid Baran jest w 2C, ale ma rocznik 2009.',
  summary:'Karta wyniku: maks. 22 pkt (4 pytania + 3 poziomy po 6 pkt). Poproś ucznia o Widok SQL podium (zlecenie 2A) i wskazanie ORDER BY oraz warunku na dyskwalifikacji. Kto zaliczył poziom 3, pomaga innym jako tutor. Produkt lekcji to „Oficjalne wyniki zawodów” — uczeń pokazuje je na karcie wyniku.'
 },
 sections:[
  {id:'start',label:'Start',title:'Dekoracja za 5 minut. Kto na podium?',intro:'Sędzia zawodów ma 61 wyników w bazie i spiker, który czeka na nazwiska. Zamiast przewijać tabel — zadaj bazie pytanie.',grouping:'class',
   reading:{title:'Kwerenda = pytanie do bazy',paragraphs:['Kwerenda wybierająca niczego nie zmienia w tabelach. Wybiera kolumny i wiersze, które spełniają warunki, łączy tabele po relacjach i układa wynik w zadanej kolejności. Zapisana kwerenda za rok pokaże aktualne dane.','Tak działa ranking w grze, tabela ligi, lista „zamówienia do wysłania dziś” w sklepie i plan lekcji w e-dzienniku.']},
   ...note(4,'Hak: spiker czeka, wyników 61. Dwa pytania powtórkowe z lekcji o zawodach i o projektowaniu bazy — samodzielnie, bez notatek.','Jak ułożyć ranking pływaków: rosnąco czy malejąco po czasie?','Rosnąco — mniejszy czas to lepszy wynik (odwrotnie niż punkty w grze).','Sortowanie malejąco „bo najlepszy ma być na górze” — przy czasach najlepszy jest najmniejszy.','Zapytaj, gdzie jeszcze ranking jest „rosnąco” (golf, czas okrążenia w grze wyścigowej).'),
   activities:[
    choice('zq-sort','Ranking 50 m: najlepszy zawodnik ma być na górze. Jak ustawić Sortuj w kolumnie czas?',['Malejąco — najlepsi na górze','Rosnąco — najkrótszy czas na górze','Bez sortowania — baza sama wie'],[1],'W pływaniu wygrywa najmniejszy czas, więc ranking to czas rosnąco. Przy punktach byłoby odwrotnie.','Czy 26,93 s to lepiej, czy gorzej niż 32,40 s?'),
    choice('zq-fk','Powtórka z lekcji o zawodach: skąd kwerenda wie, kto uzyskał wynik #4?',['Z pola nazwisko w tabeli Wyniki','Z klucza obcego id_zawodnika w Wyniki, połączonego relacją z Zawodnicy','Z kolejności wierszy'],[1],'Wynik wskazuje zawodnika numerem, a relacja łączy go z rekordem w Zawodnicy. Dlatego w kwerendzie potrzebne są obie tabele.','Czy w tabeli Wyniki jest nazwisko?'),
    choice('zq-type','Powtórka z projektowania: jakiego typu jest pole czas, skoro wpisujemy 32,46?',['Krótki tekst','Liczba','Data/Godzina'],[1],'Czas w sekundach z setnymi to Liczba — dzięki temu działa sortowanie, <35 i Min(). Jako tekst „100,5” byłoby „mniejsze” niż „32,4”.','Na czasie liczymy i porównujemy.')
   ]},
  {id:'rules',label:'Zasady',title:'Zasady kwerend: model sędziego krok po kroku.',intro:'Nauczyciel pokazuje jedną kwerendę na głos — podium 50 m dowolnym dziewcząt. Rozwiń karty i dopasuj kryteria. Kryteria sukcesu znajdziesz pod każdym poziomem.',grouping:'class',
   reading:{title:'6 zasad dobrej kwerendy',paragraphs:['1) Dodaj tylko potrzebne tabele (relacje połączą je same). 2) Do siatki wstaw kolumny wyniku i pola z warunkami. 3) Pole tylko do filtrowania — odznacz „Pokaż”. 4) Warunki w jednym wierszu = I, w wierszu „lub” = LUB. 5) Tekst w cudzysłowie, liczba bez jednostek, setne po przecinku. 6) Ranking: Sortuj po czasie rosnąco.','Σ Sumy: „Grupuj według” tworzy grupy (np. konkurencje), Min daje najlepszy czas w grupie, Policz — liczbę startów, a Gdzie — warunek bez pokazywania kolumny.'],example:{question:'Model: jak zbudować podium 50 m dowolnym dziewcząt?',answer:'Tabele: Zawodnicy, Wyniki, Konkurencje. Kolumny: imie, nazwisko, klasa, czas (Sortuj: Rosnąco). Warunki w jednym wierszu (odznaczone Pokaż): styl "dowolny", dystans 50, Konkurencje.plec "K", dyskwalifikacja <> "tak". SQL: … WHERE styl="dowolny" AND dystans=50 AND plec="K" AND dyskwalifikacja<>"tak" ORDER BY czas;'}},
   ...note(7,'Nauczanie jawne: pokaż model na projektorze, myśląc na głos (zadanie 2A — możesz je potem zostawić uczniom, bo znają już drogę). Odsłaniaj karty, potem uczniowie dopasowują kryteria samodzielnie. Pokaż kryteria sukcesu pod poziomem 1.','Co się stanie, gdy "K" wpiszemy w wierszu „lub”, a "dowolny" w wierszu Kryteria?','Dostaniemy wszystkie starty stylem dowolnym LUB wszystkie konkurencje dziewcząt — za dużo wierszy.','Wpisywanie „50 m” zamiast 50 i „s” przy czasie; kropka zamiast przecinka w setnych (symulator przyjmie oba, Access z polskimi ustawieniami — przecinek).','Pokaż w Widoku SQL, jak wiersz „lub” zamienia się w OR.',true),
   activities:[
    reveal('zq-anatomy',[
     {title:'Tabele → FROM / JOIN',icon:'table',short:'Skąd dane?',text:'Zawodnicy + Wyniki + Konkurencje dają INNER JOIN po id_zawodnika i id_konkurencji. Zbędna tabela Wyniki w liście zawodników powieli ich tyle razy, ile mają startów.'},
     {title:'Pole i Pokaż → SELECT',icon:'list',short:'Które kolumny?',text:'Tylko kolumny z zaznaczonym „Pokaż”. Pole z warunkiem może zostać ukryte.'},
     {title:'Kryteria → WHERE',icon:'funnel',short:'Które wiersze?',text:'"K" · 2008 · Jak "2*" · Między 2009 I 2010 · <35 · <> "tak". W jednym wierszu łączy je AND.'},
     {title:'Sortuj → ORDER BY',icon:'sort',short:'W jakiej kolejności?',text:'Ranking pływacki: czas Rosnąco. Alfabet: nazwisko Rosnąco.'},
     {title:'Σ → GROUP BY',icon:'trophy',short:'Policz, znajdź najlepszy.',text:'Grupuj według styl, dystans, plec + Min(czas) = rekord każdej konkurencji. Policz(id_wyniku) = liczba startów.'},
     {title:'[Podaj klasę:] → parametr',icon:'hash',short:'Kwerenda pyta.',text:'Jedna kwerenda dla każdej klasy — Access pokaże okno „Wprowadzanie wartości parametru”.'}
    ]),
    {type:'matching',id:'zq-crit',question:'Dopasuj kryterium do znaczenia (baza Zawody).',options:['klasy 2A, 2B, 2C…','roczniki 2009 i 2010','bez dyskwalifikacji','czas poniżej 35 sekund','Access zapyta o klasę przy uruchomieniu'],rows:[
     {label:'Jak "2*" (w kolumnie klasa)',correct:[0],explanation:'Gwiazdka = dowolne dalsze znaki.'},
     {label:'Między 2009 I 2010 (w kolumnie rocznik)',correct:[1],explanation:'Zakres z oboma końcami.'},
     {label:'<> "tak" (w kolumnie dyskwalifikacja)',correct:[2],explanation:'<> znaczy „różne od”. Działa też "nie".'},
     {label:'<35 (w kolumnie czas)',correct:[3],explanation:'Sama liczba, bez „s”. <=35 dołączyłoby 35,00.'},
     {label:'[Podaj klasę:]',correct:[4],explanation:'Nawias kwadratowy = parametr.'}
    ]}
   ]},
  {id:'l1',label:'Poziom 1',title:'Poziom 1: listy startowe (jedna tabela).',intro:'Trzy zlecenia z tabeli Zawodnicy. Zalicz 2 z 3, żeby otworzyć poziom 2. Za trafienie przy pierwszym sprawdzeniu — 2 pkt.',grouping:'solo',
   reading:{title:'4 ruchy',paragraphs:['1) „Pokaż tabelę” → Zawodnicy. 2) Kliknij pola, żeby trafiły do siatki. 3) Warunek wpisz w kolumnie pola, którego dotyczy (bez „Pokaż”, jeśli sędzia nie chce tej kolumny). 4) Sortuj i „Uruchom (!)”.','„Sprawdź zlecenie” porównuje Twój wynik z oczekiwanym: kolumny, wiersze i — jeśli sędzia o to prosi — kolejność. Komunikat powie, czego jest za dużo lub za mało.']},
   ...note(9,'Uczniowie pracują samodzielnie. Po 5 minutach zbierz osoby bez zaliczenia przy jednym ekranie na 2-minutowy instruktaż (zlecenie 1B: Jak "2*"). Szybsi przechodzą dalej.','Dlaczego w zleceniu z rocznikiem 2008 są dwa warunki w jednym wierszu?','Bo zawodniczka musi spełniać oba naraz: plec "K" I rocznik 2008.','Warunek w kolumnie klasa zamiast rocznik; "2" zamiast Jak "2*"; >2009 zamiast >=2009.','Zadanie dodatkowe: chłopcy z klas pierwszych, alfabetycznie.'),
   activities:[lab(1,'Poziom 1: listy startowe','Wykonaj zlecenia sędziego na tabeli Zawodnicy (zalicz co najmniej 2 z 3).',['Wynik ma dokładnie te kolumny, o które prosi sędzia — pole z warunkiem może zostać z odznaczonym „Pokaż”.','Tekst w cudzysłowie ("K"), liczba bez (2008); wzorzec to Jak "2*".','Dwa warunki naraz = ten sam wiersz Kryteria.'])]},
  {id:'l2',label:'Poziom 2',title:'Poziom 2: oficjalne wyniki (trzy tabele).',intro:'Nazwisko jest w Zawodnicy, czas w Wyniki, styl w Konkurencje. Dodaj właściwe tabele — relacje połączą je same. Pamiętaj o dyskwalifikacjach.',grouping:'solo',
   reading:{title:'Relacje + warunki w jednym wierszu',paragraphs:['Gdy w projekcie są trzy tabele, każdy wynik łączy się ze swoim zawodnikiem i konkurencją (INNER JOIN). Warunki na różnych tabelach wpisujesz w tym samym wierszu Kryteria — to nadal I.','Zdyskwalifikowani nie są klasyfikowani: w oficjalnych wynikach dodaj pole dyskwalifikacja z <> "tak" (bez „Pokaż”).']},
   ...note(10,'Po zaliczeniu 2 z 3 zleceń pary porównują Widok SQL podium (1 minuta): czy mają INNER JOIN i warunek na dyskwalifikacji? Zapytaj klasę, kto „wpadł” na Alicję Kaczmarek.','Dlaczego Alicja Kaczmarek nie może być na podium, choć ma najlepszy czas?','Ma dyskwalifikację (falstart) — nie jest klasyfikowana; warunek <> "tak" ją usuwa.','Brak warunku na dyskwalifikacji; warunki w wierszu „lub”; dystans „50 m”.','Zmień podium na 25 m motylkowym chłopców — ile zmian w siatce?'),
   activities:[lab(2,'Poziom 2: oficjalne wyniki','Wykonaj zlecenia z trzech powiązanych tabel (zalicz co najmniej 2 z 3).',['W projekcie są wszystkie tabele, z których bierzesz pola — i żadnej zbędnej.','Wszystkie warunki jednego zlecenia w tym samym wierszu Kryteria (I).','Ranking = czas Rosnąco; bez dyskwalifikacji = <> "tak".'])]},
  {id:'l3',label:'Poziom 3',title:'Poziom 3: protokół — rekordy, puchar i parametr.',intro:'Sędzia główny chce liczb: najlepszy czas w każdej konkurencji i liczbę startów klas. Wychowawcy — jedną kwerendę dla każdej klasy.',grouping:'pair',
   reading:{title:'Σ Min, Policz, Gdzie i parametr',paragraphs:['Po kliknięciu „Sumy” każda kolumna ma Podsumowanie. Grupuj według styl, dystans i plec tworzy 8 grup (konkurencji), a Min(czas) daje najlepszy czas w każdej. Warunek na polu, którego nie grupujesz, ustawiasz przez Podsumowanie: Gdzie.','Parametr [Podaj klasę:] w kolumnie klasa sprawia, że Access pyta o klasę przy każdym uruchomieniu — jedna kwerenda zamiast dziesięciu.']},
   ...note(10,'Sprawdzenie w parach: zanim uczeń kliknie „Uruchom”, partner czyta Podsumowanie i przewiduje liczbę wierszy („8 — tyle jest konkurencji”, „10 — tyle klas startowało”). Potem zamiana.','Ile wierszy da kwerenda „rekord każdej konkurencji” i dlaczego?','8 — jest 8 konkurencji, a grupujemy po styl, dystans i plec.','Maks zamiast Min; grupowanie także po nazwisku (za dużo wierszy); brak Gdzie na dyskwalifikacji (zły rekord 50 m dowolnym dziewcząt).','Dodaj do rekordów kolumnę Policz — ile startów było w każdej konkurencji?'),
   activities:[lab(3,'Poziom 3: protokół sędziowski','Utwórz kwerendy podsumowujące i parametryczną (zalicz co najmniej 2 z 3).',['Po włączeniu Σ grupujesz tylko po tym, o co pyta zlecenie.','Najlepszy czas = Min; liczba startów = Policz; warunek bez pokazywania = Gdzie.','Parametr to pytanie w nawiasie kwadratowym w kolumnie klasa.'])]},
  {id:'result',label:'Wynik',title:'Oficjalne wyniki zawodów — Twoja karta.',intro:'Karta zbiera punkty z pytań i trzech poziomów, a pod nimi — produkt Twojej pracy. Zaznacz samoocenę i pokaż kartę nauczycielowi.',grouping:'solo',
   ...note(5,'Uczniowie oglądają kartę, zaznaczają samoocenę i odpowiadają na pytanie otwarte. Zapytaj 2–3 osoby, które kryterium było kluczowe w ich najtrudniejszym zleceniu.','Która kwerenda najbardziej przyda się sędziemu i dlaczego?','Podium (dekoracja od razu), rekordy (protokół), „Podaj klasę:” (jedna kwerenda dla wszystkich wychowawców).','Mylenie liczby zaliczonych zleceń z punktami: poprawka daje 1 pkt, pierwsze trafienie 2 pkt.','Zaproponuj kwerendę dla ligi e-sportowej: najlepszy czas okrążenia każdego gracza.'),
   activities:[
    {type:'resultCard',id:'result',title:'Karta wyniku: oficjalne wyniki zawodów',sources:['zq-sort','zq-fk','zq-type','zq-crit','zq-l1','zq-l2','zq-l3'],badges:[
     {min:0,name:'Chłopiec do podawania ręczników',text:'Baza jeszcze Cię nie słucha. Wróć do poziomu 1 — lista startowa to dobry początek.'},
     {min:0.5,name:'Sędzia na torze',text:'Podium i listy robisz w minutę. Jeszcze protokół i przejmujesz stolik sędziowski.'},
     {min:0.85,name:'Sędzia główny zawodów',text:'Rekordy, puchar klas i kwerenda z parametrem. Spiker czyta wyniki z Twojego ekranu.'}
    ]},
    {type:'text',id:'zq-reflect',question:'Która kwerenda najbardziej przyda się sędziemu i dlaczego?',minLength:20,explanation:'Przykład: „Podium — dekoracja może być od razu po konkurencji, a dyskwalifikacje same wypadają z listy”. To samoocena; nauczyciel może poprosić o rozwinięcie.'}
   ]}
 ],
 exitTicket:'Umiesz zadać bazie pytanie: wybrać kolumny i wiersze, połączyć trzy tabele, ułożyć ranking, policzyć starty, znaleźć rekordy i zbudować kwerendę, która sama pyta o klasę.'
};
