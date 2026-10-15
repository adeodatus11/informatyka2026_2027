import {note, choice} from '../schema.js';

const KARTA = `print("=== KARTA GRACZA ===")
print("Nick:", "ShadowFox")
print("Poziom:", 12)
print("Ulubiona gra:", "wyścigi")
`;

const KIESZONKOWE_START = `# Kalkulator kieszonkowego
# 1. Wczytaj, ile dostajesz na tydzień (liczba całkowita):
tygodniowo = int(input("Kieszonkowe na tydzień (zł): "))
# 2. Wczytaj, przez ile tygodni odkładasz:

# 3. Policz sumę:

# 4. Wypisz, np.: Przez 4 tyg. uzbierasz 140 zł

`;

export default {
 id:'62',grade:1,order:24,title:'Środowisko programistyczne języka Python, stosowanie zmiennych i wyprowadzanie wyników',
 subtitle:'Pierwszy własny program w 3 minuty: karta gracza, bilety do kina, godziny gry w minutach i kalkulator kieszonkowego.',
 topic:'Środowisko Pythona; print; zmienne; typy int, float, str; input(), int(), float(); f-stringi; typowe błędy',icon:'code',tags:['print i zmienne','input()','f-string'],duration:45,
 curriculum:'Informatyka – liceum/technikum (PP 2024) · I.1 (od algorytmu do programu), I.3 (sprawdzanie programu na danych testowych), II.1 (instrukcje wejścia/wyjścia, zmienne, wyrażenia arytmetyczne), II.2 (środowisko programistyczne Python)',
 format:{
  name:'Przewiduj → uruchom → zmień → ułóż → napisz',
  student:'Każdą nową rzecz najpierw zobaczysz w gotowym programie: przewidzisz wynik, uruchomisz, zmienisz jedną linię. Potem ułożysz program z klocków, naprawisz cudzy błąd, a na końcu napiszesz własny kalkulator kieszonkowego. Błędy są tu normalne — Python powie po polsku, co poprawić.',
  teacher:'Schemat w duchu PRIMM (przewiduj, uruchom, zbadaj, zmień, stwórz). Nauczanie jawne: w etapie 2 pokazujesz na projektorze edytor, przycisk „Uruchom” i konsolę, a potem każdy uruchamia gotową kartę gracza i zmienia nick — pierwszy sukces w 3 minuty. Przewidywanie z zaznaczeniem pewności to moment metapoznania: zapytaj, kto był pewny i się pomylił. W etapie 4 program celowo „mnoży tekst” (2 · 60 = 222…) — feedback prowadzący do poprawy: uczeń widzi skutek, testy pokazują, czego oczekiwano, a poprawka to jedna funkcja int(). Etap 5 to praca samodzielna z podpowiedziami krok po kroku.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie przy kalkulatorze kieszonkowego dwie osoby mogą pracować jako kierowca i nawigator (jedna pisze, druga czyta testy) — ale każda oddaje działający program u siebie.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Uruchamiam program w środowisku Pythona i odczytuję wynik w konsoli.','Używam print, zmiennych i typów int, float, str — wiem, kiedy cudzysłów, a kiedy nie.','Wczytuję dane przez input() i zamieniam je na liczbę int() albo float().','Wypisuję wynik czytelnie f-stringiem i poprawiam typowe błędy („5” + 3, brak cudzysłowu).'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor: pokaz edytora, przycisku „Uruchom” i konsoli (etap 2).'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB). Na początku lekcji uczniowie od razu wchodzą do etapu 2, a w tym czasie robicie pytania powtórkowe. Klucz: przewidywanie — 2 + 3 / 5 / Wynik: 5 / 23. Śledzenie: poziom 13, zloto 150.5 (float). Kino: razem = cena_biletu * osoby → 88 zł, dla 5 osób 110 zł. Godziny: int(input(…)) → 2 h to 120 minut. Kieszonkowe: 35 zł · 4 tyg. = 140 zł, rok (52 tyg.) = 1820 zł. W domu można używać darmowego środowiska, np. IDLE albo Thonny — to tylko informacja, nie zadanie.',
  summary:'Uczeń uruchamia i zmienia gotowy program, przewiduje wynik print, śledzi zmiany zmiennych, układa program z f-stringiem, naprawia błąd tekstu z input() i pisze kalkulator kieszonkowego z testami. Karta wyniku: maks. 27 pkt. Pytanie na wyjście: dlaczego wynik input() trzeba zamienić na liczbę? Następna lekcja: program podejmuje decyzje (if/else).'
 },
 sections:[
  {id:'start',label:'Start',title:'Twój nick na ekranie',grouping:'class',
   intro:'Dziś program wypisze Twoją kartę gracza, policzy bilety do kina i Twoje kieszonkowe. Python już się ładuje w etapie 2 — przejdź tam zaraz po dwóch pytaniach z poprzedniej lekcji.',
   reading:{title:'Algorytm → program',paragraphs:['Na poprzedniej lekcji schemat „Wczytaj → oblicz → Wypisz” zamieniłeś na gotowy program w Pythonie. Dziś poznasz klocki, z których się składał: print (wypisz), zmienne (pudełka na dane) i input (wczytaj).','Program to tekst, który Python czyta linia po linii, od góry do dołu. Literówka, brak cudzysłowu albo nawiasu zatrzymuje program — platforma pokaże wtedy linię i wyjaśni błąd po polsku. To normalne, każdy programista widzi takie komunikaty codziennie.']},
   ...note(4,'Hak: „Program wypisze waszą kartę gracza z nickiem”. Dwa pytania powtórkowe z lekcji o algorytmach — samodzielnie, bez notatek; omów tylko błędne. Zaraz potem wszyscy przechodzą do etapu 2 (Python się ładuje). Powiedz wprost: błąd w programie to nie porażka, tylko wskazówka.','Co w Pythonie odpowiada strzałce ← ze schematu blokowego?','Znak =, np. dostawa = 15 — wpisuje wartość do zmiennej.','Uczniowie myślą, że = w Pythonie znaczy „równa się” jak w matematyce. Podkreśl: = to „wpisz do pudełka”.','Zapytaj, gdzie spotkali programy, które o coś pytają i coś liczą (kalkulator raty, aplikacja do biegania, sklep internetowy).'),
   activities:[
    choice('py-r1','Powtórka: który kształt w schemacie blokowym oznacza wczytanie danych albo wypisanie wyniku?',['Równoległobok','Romb','Owal','Prostokąt'],[0],'Równoległobok to wejście i wyjście. Dziś w Pythonie: input() to „wczytaj”, a print() to „wypisz”.','Romb ma dwie strzałki TAK/NIE — to nie on.'),
    choice('py-r2','Powtórka: w Pythonie dostawa = 15. Co robi znak =?',['Wpisuje 15 do zmiennej dostawa (jak strzałka ← w schemacie)','Sprawdza, czy dostawa jest równa 15','Wypisuje 15 na ekranie','Dodaje 15 do dostawy'],[0],'Pojedyncze = to przypisanie: „włóż 15 do pudełka dostawa”. Porównanie zapisuje się dwoma znakami: ==.','Przypomnij sobie strzałkę ← w prostokątach schematu.')
   ]},
  {id:'pierwszy',label:'Pierwszy program',title:'Pierwszy własny program w 3 minuty',grouping:'solo',
   intro:'Karta gracza już działa — uruchom ją. Potem wpisz swój nick i uruchom jeszcze raz. Na koniec przewidź, co wypisze program z liczbami w cudzysłowach i bez.',
   reading:{title:'Środowisko programistyczne i print',paragraphs:['Środowisko programistyczne to edytor, w którym piszesz kod, przycisk „Uruchom” i konsola, w której program wypisuje wyniki. Tu działa ono w przeglądarce. Na komputerze z zainstalowanym Pythonem wygląda podobnie (np. IDLE albo Thonny).','print("…") wypisuje na ekran to, co jest w nawiasie. Tekst bierzemy w cudzysłów: "Nick:". Liczb nie: 12. Kilka rzeczy w jednym print oddzielasz przecinkami — Python wstawi między nie spacje.']},
   ...note(8,'Nauczanie jawne: na projektorze pokaż edytor, „Uruchom”, konsolę i „Sprawdź”. Potem każdy uruchamia kartę gracza i zmienia nick. Najczęstszy błąd: skasowany cudzysłów — platforma pokaże „Tekst bez cudzysłowu na końcu”; pokaż ten komunikat na projektorze jako przykład, że błąd to wskazówka. Przy przewidywaniu: niech wszyscy wpiszą odpowiedź przed uruchomieniem, a potem zapytaj, kto był „na pewno” i się pomylił.','Dlaczego print("2 + 3") i print(2 + 3) wypisują co innego?','Tekst w cudzysłowie wypisuje się dosłownie, a wyrażenie bez cudzysłowu Python najpierw liczy.','Nick bez cudzysłowu (Python szuka zmiennej o tej nazwie: „Python nie zna nazwy…”); przewidywanie „5” dla "2" + "3".','Szybsi: dopisz do karty jedną linię, np. print("Ranga:", "Diament").'),
   activities:[
    {type:'pythonLab',id:'py-card',mode:'code',points:2,file:'karta_gracza.py',title:'Karta gracza: uruchom i wpisz swój nick',
     prompt:'Kliknij „Uruchom” — program już działa. Potem wpisz swój nick zamiast `ShadowFox` (zostaw cudzysłowy!), zmień poziom i grę. Uruchom jeszcze raz i kliknij „Sprawdź”.',
     starter:KARTA,solution:KARTA.replace('ShadowFox','Kot_Bonifacy').replace('12','27'),
     tests:[{contains:['KARTA GRACZA','Nick:','Poziom:'],label:'Program wypisuje kartę gracza'}],
     sourceChecks:[{pattern:'ShadowFox',absent:true,label:'Wpisano własny nick',hint:'Zamień ShadowFox na swój nick — między cudzysłowami.'}],
     hints:['Zmień tylko tekst między cudzysłowami: `"ShadowFox"` → `"TwójNick"`.','Jeśli Python pisze „Tekst bez cudzysłowu na końcu”, sprawdź, czy nick ma znak " z obu stron.'],
     successText:'Twój pierwszy własny program działa.'},
    {type:'pythonLab',id:'py-quotes',mode:'predict',points:2,file:'cudzyslowy.py',title:'Cudzysłów czy nie? Przewidź wynik',
     prompt:'Cztery linie, cztery print. Wpisz, co pojawi się na ekranie — każda linia osobno. Potem uruchom i porównaj.',
     code:'print("2 + 3")\nprint(2 + 3)\nprint("Wynik:", 2 + 3)\nprint("2" + "3")\n',predictRows:4,
     explain:'Linia 1: tekst w cudzysłowie wypisuje się dosłownie — „2 + 3”. Linia 2: bez cudzysłowu Python liczy — 5. Linia 3: tekst, potem wynik działania, oddzielone spacją. Linia 4: "2" i "3" to teksty, a + dla tekstów skleja je w „23”. Ta pułapka wróci przy input().'}
   ]},
  {id:'zmienne',label:'Zmienne',title:'Zmienne i typy: pudełka z nazwą',grouping:'solo',
   intro:'Prześledź program gracza krok po kroku i obserwuj, jak zmieniają się pudełka-zmienne. Potem popraw program, który liczy bilety do kina.',
   reading:{title:'Zmienna i typy int, float, str',paragraphs:['Zmienna to pudełko z nazwą: poziom = 12 wkłada 12 do pudełka poziom. Linia poziom = poziom + 1 bierze starą wartość, dodaje 1 i wkłada wynik z powrotem. Nazwy piszemy bez spacji, najlepiej bez polskich liter: zloto, cena_biletu.','Każda wartość ma typ. int to liczba całkowita (12), float — liczba z częścią dziesiętną, pisana z kropką (250.5), str — tekst w cudzysłowie ("Kot"). Typ decyduje, co można zrobić: liczby się dodaje i mnoży, a teksty skleja.']},
   ...note(9,'Śledzenie: uczniowie klikają „Krok dalej” i patrzą na kolumnę „zmiana”. Zatrzymaj klasę przy linii poziom = poziom + 1 — w matematyce to równanie bez rozwiązania, w Pythonie zwykła aktualizacja. Kino: nie mów, jak policzyć — testy pokażą, że razem = 0. Zwróć uwagę na sprawdzenie, czy uczeń nie wpisał 88 „na sztywno”.','Dlaczego razem = 88 jest gorsze niż razem = cena_biletu * osoby?','Bo przy innej liczbie osób albo cenie trzeba by liczyć ręcznie. Wyrażenie ze zmiennymi liczy się samo.','Mnożenie znakiem x albo · zamiast * („Python nie zna nazwy x”); liczba z przecinkiem (12,5) zamiast kropki.','Szybsi: dodaj zmienną popcorn = 18 i policz razem z popcornem dla każdej osoby.'),
   activities:[
    {type:'pythonLab',id:'py-trace',mode:'trace',points:0,file:'gracz.py',title:'Gracz zdobywa poziom: krok po kroku',
     prompt:'Klikaj „Krok dalej”. Tabela pokazuje zmienne PRZED wykonaniem podświetlonej linii — „nowa” i „zmiana” mówią, co się właśnie stało.',
     code:'nick = "Kot_Bonifacy"\npoziom = 12\nzloto = 250.5\npoziom = poziom + 1\nzloto = zloto - 100\nprint(nick, "ma poziom", poziom, "i", zloto, "złota")\n',
     questions:[
      {q:'Jaką wartość ma poziom na końcu programu?',answer:'13',inputLabel:'poziom =',explain:'Linia 4 wzięła starą wartość 12, dodała 1 i wpisała 13 z powrotem do zmiennej poziom.',hint:'Przejdź za linię 4 i odczytaj wartość w tabeli.'},
      {q:'Jakiego typu jest zmienna zloto?',options:['float — liczba z kropką','int — liczba całkowita','str — tekst','To nie jest zmienna'],correct:[0],explain:'250.5 ma część dziesiętną, więc to float. Po odjęciu 100 dalej jest float: 150.5.',hint:'Czy ta liczba ma kropkę?'},
      {q:'Co wypisze ostatnia linia?',options:['Kot_Bonifacy ma poziom 13 i 150.5 złota','nick ma poziom poziom i zloto złota','Kot_Bonifacy ma poziom 12 i 250.5 złota','"Kot_Bonifacy" ma poziom 13 i 150.5 złota'],correct:[0],explain:'Zmienne bez cudzysłowu wypisują się swoją wartością (już po zmianach), a tekst w cudzysłowie — dosłownie, ale bez samych cudzysłowów.',hint:'Przejdź do końca programu i spójrz na konsolę.'}
     ]},
    {type:'pythonLab',id:'py-cinema',mode:'code',points:3,file:'kino.py',title:'Bilety do kina: popraw jedną linię',
     prompt:'Program ma policzyć, ile kosztują bilety dla całej paczki. Teraz wypisuje 0 zł. Popraw linię z `razem`, uruchom i kliknij „Sprawdź”.',
     starter:'cena_biletu = 22\nosoby = 4\nrazem = 0    # ← popraw: policz cena_biletu razy osoby\nprint("Bilety do kina:", razem, "zł")\n',
     solution:'cena_biletu = 22\nosoby = 4\nrazem = cena_biletu * osoby\nprint("Bilety do kina:", razem, "zł")\n',
     tests:[{call:'razem',expected:'88',label:'4 bilety po 22 zł = 88 zł'},{output:'Bilety do kina: 88 zł',label:'Program wypisuje „Bilety do kina: 88 zł”'}],
     sourceChecks:[{pattern:'cena_biletu\\s*\\*\\s*osoby|osoby\\s*\\*\\s*cena_biletu',label:'Liczysz ze zmiennych, a nie wpisujesz 88',hint:'Użyj zmiennych: razem = cena_biletu * osoby. Wtedy program zadziała też dla 5 osób.'}],
     hints:['Mnożenie w Pythonie to gwiazdka: `*`.','Linia ma wyglądać tak: `razem = cena_biletu * osoby`'],
     questions:[{q:'Zmień osoby = 4 na osoby = 5 i uruchom. Ile zapłacicie?',answer:'110',inputLabel:'Kwota (zł)',explain:'22 · 5 = 110 zł. Zmieniasz jedną liczbę, a program sam liczy resztę — po to są zmienne.',hint:'Zmień liczbę w drugiej linii i kliknij „Uruchom”.'}]}
   ]},
  {id:'input',label:'input i f-string',title:'f-string i input(): program pyta, Ty odpowiadasz',grouping:'solo',
   intro:'Najpierw ułóż z klocków wizytówkę meczów z f-stringiem. Potem napraw program, który zamiast 120 minut wypisuje sześćdziesiąt dwójek.',
   reading:{title:'f-string i input() — tekst to nie liczba',paragraphs:['f-string, czyli tekst z literą f przed cudzysłowem, wstawia wartości zmiennych w nawiasy klamrowe: f"{nick} ma {poziom} poziom". To wygodniejsze niż wiele przecinków w print. input("Ile godzin gry? ") wyświetla pytanie i czeka na odpowiedź — tutaj wpisujesz ją wcześniej w pole „Dane wejściowe” (każda linia to jedno input()).','input() zawsze oddaje tekst (str), nawet gdy wpiszesz cyfry. Tekst "2" razy 60 to sześćdziesiąt sklejonych dwójek, a "5" + 3 kończy się błędem. Dlatego tekst zamieniasz na liczbę: int(…) dla liczb całkowitych, float(…) dla liczb z kropką.'],
    example:{question:'Przykład rozwiązany: wiek = input("Wiek: "), użytkownik wpisuje 15. Jak policzyć wiek za rok?',answer:'wiek to tekst "15", więc wiek + 1 kończy się błędem „Tekst + liczba”. Poprawnie: wiek = int(input("Wiek: ")), a potem wiek + 1 → 16.'}},
   ...note(10,'Układanka: pułapki to print bez litery f (wypisze dosłownie {nick}) i procent w cudzysłowie (tekst zamiast działania). Potem naprawa godzin: niech każdy najpierw uruchomi program i zobaczy 222… — to moment „aha”. Zapytaj klasę, skąd tyle dwójek, zanim ktoś poprawi. Feedback: testy mówią, czego oczekiwano, poprawka to jedna funkcja int().','Dlaczego "2" * 60 daje 222…, a nie 120?','Bo input() dało tekst "2", a tekst razy liczba to powtórzenie tekstu. Po int() mamy liczbę 2 i zwykłe mnożenie.','Zamiana na liczbę w złym miejscu: int(godziny) w osobnej linii bez przypisania (godziny = int(godziny)); float tam, gdzie wynik ma być bez .0.','Szybsi: zmień program tak, żeby przeliczał minuty do końca lekcji: ile minut zostało, jeśli lekcja trwa 45 minut, a minęło X minut (input).'),
   activities:[
    {type:'pythonLab',id:'py-parsons',mode:'parsons',points:3,file:'mecze.py',title:'Układanka: wizytówka meczów z f-stringiem',
     prompt:'Ułóż program, który wypisze dwie linie: wynik meczów i skuteczność w procentach. Klikaj linie, żeby dodać je do programu; ↑ ↓ zmieniają kolejność. Dwie linie to pułapki.',
     solution:'nick = "Kot_Bonifacy"\nwygrane = 18\nmecze = 24\nprocent = wygrane / mecze * 100\nprint(f"{nick}: {wygrane} wygranych na {mecze} meczów")\nprint(f"Skuteczność: {procent} %")\n',
     distractors:['print("{nick}: {wygrane} wygranych na {mecze} meczów")','procent = "wygrane / mecze * 100"'],
     tests:[{output:'Kot_Bonifacy: 18 wygranych na 24 meczów\nSkuteczność: 75.0 %',label:'Program wypisuje wizytówkę i skuteczność 75.0 %'}],
     hints:['Najpierw zmienne (nick, wygrane, mecze), potem procent — Python musi znać wartości, zanim ich użyje.','Pułapki: print bez litery f wypisze dosłownie {nick}, a działanie w cudzysłowie to tylko tekst.']},
    {type:'pythonLab',id:'py-hours',mode:'code',points:3,file:'godziny.py',title:'Napraw: godziny gry na minuty',input:true,stdin:['2'],
     prompt:'Program ma przeliczyć godziny na minuty. Uruchom go z danymi 2 — zobaczysz dziwny wynik. Popraw jedną linię, żeby wyszło „2 h to 120 minut”, i kliknij „Sprawdź”.',
     starter:'godziny = input("Ile godzin gry? ")\nminuty = godziny * 60\nprint(f"{godziny} h to {minuty} minut")\n',
     solution:'godziny = int(input("Ile godzin gry? "))\nminuty = godziny * 60\nprint(f"{godziny} h to {minuty} minut")\n',
     tests:[{stdin:['2'],contains:['2 h to 120 minut'],label:'2 godziny'},{stdin:['5'],contains:['5 h to 300 minut'],label:'5 godzin'},{stdin:['0'],contains:['0 h to 0 minut'],label:'0 godzin'}],
     hints:['Spójrz na wynik: 222222… To znaczy, że godziny to tekst, a tekst razy 60 to sześćdziesiąt sklejonych kopii.','Zamień tekst na liczbę w pierwszej linii: `godziny = int(input("Ile godzin gry? "))`'],
     questions:[{q:'Dlaczego przed poprawką wyszło 222222…?',options:['input() dało tekst "2", a tekst razy 60 to sześćdziesiąt sklejonych dwójek','Python źle mnoży duże liczby','Bo 60 to za dużo','Bo brakuje print'],correct:[0],explain:'Tekst razy liczba powtarza tekst: "ha" * 3 = "hahaha". int() zamienia tekst "2" na liczbę 2 i mnożenie działa normalnie.',hint:'Jakiego typu jest wynik input()?'}]}
   ]},
  {id:'napisz',label:'Napisz sam',title:'Napisz sam: kalkulator kieszonkowego',grouping:'solo',
   intro:'Teraz od pustych linii. Program ma zapytać, ile dostajesz kieszonkowego na tydzień i przez ile tygodni odkładasz, a potem wypisać, ile uzbierasz. Pierwsza linia jest gotowa — reszta to Twoja robota.',
   reading:{title:'Plan programu w 3 krokach',paragraphs:['Każdy prosty program ma ten sam szkielet: wczytaj dane (input i zamiana na liczbę), policz (działanie na zmiennych), wypisz wynik (print z f-stringiem). To dokładnie schemat „Wczytaj → oblicz → Wypisz” z lekcji o algorytmach.','Nie musisz pisać wszystkiego naraz. Dopisz jedną linię, uruchom, sprawdź, dopisz kolejną. W polu „Dane wejściowe” są już dwie odpowiedzi: 35 i 4 — każda linia trafia do kolejnego input().']},
   ...note(9,'Praca samodzielna z podpowiedziami stopniowanymi (każda kosztuje trochę punktów). Krąż i pytaj: „Który krok z komentarzy już masz?”. Uczniowie, którzy skończą, odpowiadają na pytanie o rok odkładania i mogą dopisać bonus (np. ile zostanie po kupnie gry za 90 zł). Kto utknie po wszystkich podpowiedziach i dwóch próbach — może odsłonić rozwiązanie (dostaje wtedy ¼ punktów).','Ile input() jest w Twoim programie i skąd każde bierze odpowiedź?','Dwa: pierwsze bierze pierwszą linię z pola „Dane wejściowe” (35), drugie — drugą (4).','Brak int() przy drugim input (wynik 35353535); inne słowa w print niż w poleceniu — testy sprawdzają dokładny tekst „Przez 4 tyg. uzbierasz 140 zł”.','Bonus: dodaj trzecie input — cena gry — i wypisz, ile zostanie albo ile brakuje (sama różnica, bez if).'),
   activities:[
    {type:'pythonLab',id:'py-pocket',mode:'code',points:5,file:'kieszonkowe.py',title:'Kalkulator kieszonkowego',input:true,stdin:['35','4'],
     prompt:'Uzupełnij kroki 2, 3 i 4 z komentarzy. Wynik ma wyglądać dokładnie tak: `Przez 4 tyg. uzbierasz 140 zł` (liczby zależą od danych).',
     starter:KIESZONKOWE_START,
     solution:KIESZONKOWE_START.replace('odkładasz:\n','odkładasz:\ntygodnie = int(input("Ile tygodni? "))\n').replace('sumę:\n','sumę:\nsuma = tygodniowo * tygodnie\n').replace('140 zł\n','140 zł\nprint(f"Przez {tygodnie} tyg. uzbierasz {suma} zł")\n'),
     tests:[{stdin:['35','4'],contains:['Przez 4 tyg. uzbierasz 140 zł'],label:'35 zł przez 4 tygodnie'},{stdin:['50','10'],contains:['Przez 10 tyg. uzbierasz 500 zł'],label:'50 zł przez 10 tygodni'},{stdin:['20','1'],contains:['Przez 1 tyg. uzbierasz 20 zł'],label:'20 zł przez 1 tydzień'}],
     hints:['Krok 2 wygląda jak krok 1: `tygodnie = int(input("Ile tygodni? "))`','Krok 3: `suma = tygodniowo * tygodnie`','Krok 4: `print(f"Przez {tygodnie} tyg. uzbierasz {suma} zł")` — dokładnie te słowa, bo sprawdzają je testy.'],
     questions:[{q:'Ile uzbierasz, odkładając 35 zł tygodniowo przez cały rok (52 tygodnie)?',answer:'1820',accept:['1 820'],inputLabel:'Kwota (zł)',explain:'35 · 52 = 1820 zł. Wpisz w polu danych 35 i 52, a program policzy to za Ciebie.',hint:'Zmień drugą linię w polu „Dane wejściowe” na 52 i uruchom.'}],
     summary:'Kalkulator kieszonkowego: {passed}/{total} testów',successText:'Twój pierwszy program od zera działa!'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: Python odpalony?',grouping:'solo',
   intro:'Ostatnie pytanie, samoocena i karta wyniku do pokazania nauczycielowi.',
   ...note(5,'Pytanie wyjściowe o input(). Zbierz odpowiedzi na pytanie, dlaczego trzeba int(). Zapowiedź: na następnej lekcji program zacznie podejmować decyzje — bilet ulgowy czy normalny, stać mnie czy nie (if/else).','Dlaczego wynik input() trzeba zamienić na liczbę?','Bo input() zawsze daje tekst. Żeby liczyć, trzeba go zamienić: int() albo float().','Uczniowie myślą, że Python „sam zgadnie”, że to liczba, bo wpisano cyfry.','Zapytaj, jak program powinien zareagować, gdy ktoś wpisze „dużo” zamiast liczby — wrócimy do tego za dwie lekcje (sprawdzanie danych).'),
   activities:[
    choice('py-exit','wiek = input("Wiek: "). Chcesz wypisać wiek za rok. Co robisz?',['Piszę wiek = int(input("Wiek: ")) i potem liczę wiek + 1','Piszę od razu wiek + 1 — input daje liczbę','Piszę "wiek" + 1','Piszę print(wiek) + 1'],[0],'input() daje tekst. int() zamienia go na liczbę, dopiero wtedy + 1 dodaje, a nie skleja (albo zgłasza błąd).','Jakiego typu jest wynik input()?'),
    {type:'resultCard',id:'result',title:'Pierwsze programy w Pythonie — wynik',sources:['py-r1','py-r2','py-card','py-quotes','py-trace','py-cinema','py-parsons','py-hours','py-pocket','py-exit'],badges:[
     {min:0,name:'Print w budowie',text:'Python już Cię zna, ale jeszcze się dogadujecie. Wróć do karty gracza i przewidywania — tam wszystko się zaczyna.'},
     {min:0.5,name:'Gracz z kodem',text:'Zmienne, print i input działają. Jeszcze kilka zielonych testów i kieszonkowe policzy się samo.'},
     {min:0.85,name:'Programista z kieszonkowym',text:'Program pyta, liczy i ładnie wypisuje. Tak wygląda początek każdej aplikacji.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz uruchomić program w Pythonie, wypisać tekst i liczby przez print, przechowywać dane w zmiennych (int, float, str), wczytać je przez input() z zamianą na liczbę i ładnie wypisać wynik f-stringiem. Następnym razem: program podejmuje decyzje.'
};
