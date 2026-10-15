import {note, choice} from '../schema.js';

const NAIWNY = `cena = int(input("Cena (zł): "))
rabat = int(input("Rabat (%): "))
do_zaplaty = cena - cena * rabat / 100
print(f"Do zapłaty: {do_zaplaty:.2f} zł")
`;

const STRAZNIK = `tekst = "abc"
if tekst.isdigit() and int(tekst) <= 50:
    punkty = int(tekst)
    print("Zapisano:", punkty, "pkt")
else:
    print("Błąd: wpisz liczbę od 0 do 50")
`;

const NAGLOWEK = `# Kalkulator ceny z rabatem
# Autor: (wpisz swoje inicjały)
# Dane: cena w zł (cyframi) i rabat w % (od 0 do 90)
# Wynik: cena po rabacie albo komunikat o błędnych danych

cena_t = input("Cena (zł): ")
rabat_t = input("Rabat (%): ")
`;

const PRODUKT_START = NAGLOWEK + `
# Dopisz warunek: czy cena_t i rabat_t to cyfry i czy rabat <= 90?
cena = int(cena_t)
rabat = int(rabat_t)
do_zaplaty = cena - cena * rabat / 100
print(f"Do zapłaty: {do_zaplaty:.2f} zł")

# Komunikat dla złych danych (użyj go pod else):
# print("Błąd: wpisz cenę i rabat cyframi, rabat od 0 do 90")
`;

const PRODUKT = NAGLOWEK + `
if cena_t.isdigit() and rabat_t.isdigit() and int(rabat_t) <= 90:
    cena = int(cena_t)
    rabat = int(rabat_t)
    do_zaplaty = cena - cena * rabat / 100
    print(f"Do zapłaty: {do_zaplaty:.2f} zł")
else:
    print("Błąd: wpisz cenę i rabat cyframi, rabat od 0 do 90")
`;

const BLAD = 'Błąd: wpisz cenę i rabat cyframi, rabat od 0 do 90';
const io = (c, r, last) => `Cena (zł): ${c}\nRabat (%): ${r}\n${last}`;

export default {
 id:'64',grade:1,order:26,title:'Sprawdzanie poprawności danych i zapisywanie rozwiązania problemu w języku Python',
 subtitle:'Użytkownik wpisze „dziesięć”, −50 albo nic. Twój kalkulator rabatu się nie wysypie — i będzie gotowym programem z opisem, który da się pokazać i zapisać.',
 topic:'Walidacja danych: isdigit(), zakres, pusty tekst; komunikaty dla użytkownika; przypadki brzegowe; komentarz i zapis programu',icon:'shield',tags:['walidacja danych','isdigit()','gotowy program'],duration:45,
 curriculum:'Informatyka – liceum/technikum (PP 2024) · I.1 (od specyfikacji do przetestowanego programu), I.3 (sprawdzanie poprawności dla danych typowych, brzegowych i błędnych), II.1 (wejście/wyjście, wyrażenia logiczne, instrukcja warunkowa), II.2 (środowisko Python, zapis rozwiązania)',
 format:{
  name:'Zepsuj, zanim zepsuje użytkownik',
  student:'Najpierw celowo psujesz naiwny kalkulator złymi danymi. Potem poznajesz strażnika danych (isdigit i zakres) i budujesz z niego kalkulator rabatu, który przechodzi 7 testów: dobre dane, granice i śmieci. Na koniec opisujesz program komentarzem i zapisujesz go. Efekt: skończony mini-program.',
  teacher:'Problem, projekt i przypadek: produktem lekcji jest działający kalkulator ceny z rabatem odporny na złe dane, budowany według podanej specyfikacji (nawiązanie do lekcji o specyfikacji i przypadkach testowych). Ocenianie kształtujące: kryteria gotowego programu są jawne od początku (testy w etapie 4 i lista w etapie 5), a pytania w etapie 2 diagnozują, czy uczeń rozumie, co psuje program. Feedback prowadzący do poprawy: każdy czerwony test mówi, dla jakich danych program działa źle. Powtórki rozłożone: na starcie i w zadaniach wracają warunki z poprzedniej lekcji oraz przypadki brzegowe z lekcji o specyfikacji.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie po zaliczeniu kalkulatora dwie osoby mogą wymienić się miejscami i spróbować „zepsuć” program sąsiada własnymi danymi — każdy poprawia swój kod sam.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Powtórki rozłożone w czasie',url:'https://metodyka.covepolska.pl/metoda-powtorki-rozlozone.html'}
  ]
 },
 objectives:['Wyjaśniam, jakie dane psują program: tekst zamiast liczby, wartość spoza zakresu, pusty tekst.','Sprawdzam dane przed liczeniem: isdigit() i zakres połączone przez and, we właściwej kolejności.','Piszę komunikat, który mówi użytkownikowi, co poprawić.','Kończę program: przechodzi testy typowe, brzegowe i z błędnymi danymi, ma komentarz z opisem i umiem go zapisać.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Opcjonalnie: Notatnik (Windows) do zapisania programu jako plik .py.'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 — przeglądarka pobierze Pythona. Klucz: „dziesięć” → ValueError (int() nie zamieni słowa); 200 zł i rabat 150% → −100.00 zł. isdigit: True, False, False, False. Układanka: najpierw isdigit, potem int — odwrotna kolejność albo or wysypują program na „abc”. Kalkulator: if cena_t.isdigit() and rabat_t.isdigit() and int(rabat_t) <= 90: … else: komunikat. Testy: 200/10 → 180.00, 99/15 → 84.15, 200/90 → 20.00, 200/91 → błąd, abc/10 → błąd, pusta cena → błąd, 200/−5 → błąd. Zapis pliku w Notatniku jest opcjonalny — postęp na platformie znika po odświeżeniu.',
  summary:'Uczeń psuje naiwny program złymi danymi i wyjaśnia skutki, przewiduje wyniki isdigit(), układa strażnika danych we właściwej kolejności i pisze kalkulator rabatu, który przechodzi 7 testów (typowe, brzegowe, błędne), a potem opisuje go komentarzem. Karta wyniku: maks. 19 pkt. Pytanie na wyjście: ile dróg potrzeba, żeby program mówił dokładnie, co jest źle? — to wstęp do elif na następnej lekcji.'
 },
 sections:[
  {id:'start',label:'Start',title:'„Aplikacja przestała działać”',grouping:'class',
   intro:'Ktoś w sklepie internetowym wpisał w polu ceny „sto złotych” — i cała strona pokazała błąd. Dziś zrobisz program, który na takie dane odpowie grzecznym komunikatem. Najpierw dwa pytania z poprzednich lekcji, bez notatek.',
   reading:{title:'Programista nie ufa danym',paragraphs:['Na lekcji o specyfikacji wymyślałeś przypadki testowe: typowe, brzegowe i z błędnymi danymi. Na lekcji o warunkach program wybierał drogę przez if/else. Dziś połączysz jedno z drugim: program sam sprawdzi dane, zanim zacznie liczyć.','Taki program nazywamy odpornym na błędne dane. W prawdziwych aplikacjach to obowiązek: formularz banku, sklepu czy dziennika elektronicznego sprawdza każde pole, zanim cokolwiek zapisze.']},
   ...note(4,'Hak: zapytaj, czy widzieli kiedyś komunikat „Wpisz poprawny numer telefonu” albo czerwone pole w formularzu. Dwa pytania powtórkowe (warunek z or i błędne dane z lekcji o specyfikacji) — samodzielnie, bez notatek; omów błędne. Zaraz potem wszyscy przechodzą do etapu 2.','Jakie dane wpisałbyś, żeby zepsuć kalkulator rabatu?','Tekst zamiast liczby, liczbę ujemną, rabat powyżej 100%, nic (pusty tekst), liczbę z przecinkiem.','Uczniowie myślą, że użytkownik „wpisze normalnie”. Przypomnij: program musi działać dla każdego, także dla kogoś, kto się pomyli.','Zapytaj, co robi formularz w dzienniku elektronicznym albo sklepie, gdy wpiszesz literę w polu „kod pocztowy”.'),
   activities:[
    choice('wd-r1','Powtórka z warunków: kino ma warunek if wiek < 18 or wiek >= 65:. Jaki bilet dostanie osoba w wieku 65 lat?',['Ulgowy — 65 >= 65 to prawda, a przy or wystarczy jedna prawdziwa część','Normalny — 65 nie jest mniejsze od 18','Oba bilety','Program zgłosi błąd'],[0],'Przy or wystarczy jedna prawdziwa część. 65 >= 65 to True, więc bilet ulgowy. 65 to przypadek brzegowy.','Sprawdź każdą część warunku osobno.'),
    choice('wd-r2','Powtórka ze specyfikacji: program zalicza sprawdzian od 30 punktów (0–50). Które dane to przypadek błędnych danych?',['„trzydzieści” albo −5','30','29','50'],[0],'30 i 29 to przypadki brzegowe, 50 — górna granica zakresu. Słowo zamiast liczby i liczba ujemna to błędne dane — dziś nauczysz program je rozpoznawać.','Których danych nie ma w specyfikacji?')
   ]},
  {id:'zepsuj',label:'Zepsuj',title:'Zepsuj program, zanim zrobi to użytkownik',grouping:'solo',
   intro:'Ten kalkulator rabatu działa — dopóki ktoś nie wpisze czegoś dziwnego. Uruchom go z trzema zestawami danych i zobacz, co się dzieje.',
   reading:{title:'Walidacja: sprawdź, zanim policzysz',paragraphs:['Użytkownik wpisze wszystko: „dziesięć”, −50, 12,5 albo nic. Program, który ufa danym, wysypie się albo poda bzdurę. Walidacja to sprawdzenie danych, zanim program zacznie liczyć: czy to liczba, czy mieści się w sensownym zakresie, czy pole nie jest puste.','Dobry komunikat mówi użytkownikowi, co zrobić: „Wpisz cenę cyframi, np. 120”, a nie „Błąd 0x03”. Zapis {do_zaplaty:.2f} w f-stringu wypisuje liczbę z dwoma miejscami po kropce — jak na paragonie.']},
   ...note(7,'Każdy uruchamia program trzy razy, zmieniając dane w polu „Dane wejściowe”. Nie bój się błędu na czerwono — to cel ćwiczenia; platforma tłumaczy ValueError po polsku. Zbierz odpowiedzi na pytanie o −100 zł: program „działa”, ale wynik jest bez sensu — to drugi rodzaj problemu (zakres).','Czym różni się problem z „dziesięć” od problemu z rabatem 150%?','„dziesięć” wysypuje program (błąd typu — int() nie zamieni słowa), a 150% daje wynik bez sensu, chociaż program działa (błąd zakresu).','Uczniowie wpisują obie dane w jednej linii pola danych — każda linia to jedno input().','Szybsi: sprawdź, co się stanie przy cenie 12,5 (z przecinkiem) i przy pustej cenie.'),
   activities:[
    {type:'pythonLab',id:'wd-break',mode:'code',points:0,file:'rabat_naiwny.py',title:'Naiwny kalkulator rabatu',input:true,stdin:['dziesięć','10'],
     prompt:'1) Uruchom z danymi, które już są w polu: „dziesięć” i 10. 2) Zmień dane na 200 i 150 (rabat 150%) i uruchom. 3) Na koniec 200 i 10. Odpowiedz na pytania pod programem.',
     starter:NAIWNY,
     successText:'Program zadziałał bez błędu. Ale czy wynik ma sens? Sprawdź pytania poniżej.',
     questions:[
      {q:'Co się stało przy danych „dziesięć”?',options:['Program się wysypał: int() nie zamieni słowa na liczbę (ValueError)','Program policzył 10 zł','Program wypisał „Do zapłaty: 0.00 zł”','Program poprosił o ponowne wpisanie ceny'],correct:[0],explain:'int("dziesięć") to błąd ValueError — program kończy się w pierwszej linii i użytkownik zostaje z niczym.',hint:'Uruchom program z danymi „dziesięć” i 10 i przeczytaj komunikat.'},
      {q:'Ile wyszło „do zapłaty” przy cenie 200 zł i rabacie 150%?',answer:'-100',accept:['-100.00','-100.0','−100'],inputLabel:'Do zapłaty (zł)',explain:'200 − 200 · 150 / 100 = −100 zł — sklep dopłaca klientowi. Program się nie wysypał, ale wynik jest bez sensu. Zakres też trzeba sprawdzać.',hint:'Wpisz w polu danych 200 i 150 (w dwóch liniach) i uruchom.'},
      {q:'Co uchroni program przed oboma problemami?',options:['Sprawdzenie przed liczeniem: czy wpisano same cyfry i czy rabat jest w zakresie 0–90','Więcej print w programie','Zamiana int na float','Napis „Proszę uważać” w pytaniu'],correct:[0],explain:'To walidacja: najpierw sprawdzasz dane, potem liczysz. W następnym etapie poznasz, jak to zapisać.',hint:'Problemy były dwa: zły typ i zły zakres.'}
     ]}
   ]},
  {id:'straznik',label:'Strażnik',title:'Strażnik danych: isdigit() i zakres',grouping:'solo',
   intro:'Python ma gotowe narzędzie do sprawdzania, czy tekst to same cyfry. Przewidź, co odpowie, a potem ułóż strażnika, który nie wysypie się na „abc”.',
   reading:{title:'isdigit(), zakres i kolejność warunków',paragraphs:['tekst.isdigit() odpowiada True, gdy tekst składa się z samych cyfr: "16" → True, a "-5", "12.5", "abc" i pusty tekst "" → False. Dlatego najpierw sprawdzasz tekst z input(), a dopiero potem zamieniasz go na liczbę przez int().','Warunki łączysz przez and: if tekst.isdigit() and int(tekst) <= 50:. Python czyta od lewej. Gdy lewa część to False, prawej już nie sprawdza — więc int("abc") się nie wykona i program się nie wysypie. Kolejność ma znaczenie!']},
   ...note(9,'Przewidywanie: najwięcej pomyłek przy "-5" (uczniowie myślą, że minus to część liczby) i przy pustym tekście. Układanka: dwie pułapki to odwrócona kolejność warunków i or zamiast and — obie wysypują program na „abc”. Jeśli ktoś ułoży pułapkę, niech przeczyta błąd: „To nie jest liczba całkowita” — i zapyta siebie, dlaczego int() w ogóle się wykonał.','Dlaczego w warunku najpierw isdigit(), a dopiero potem int()?','Bo and przestaje sprawdzać po pierwszym False. Jeśli tekst nie jest liczbą, int() się nie wykona i program się nie wysypie.','Pisanie isdigit bez nawiasów (tekst.isdigit zamiast tekst.isdigit()) — wtedy warunek zawsze jest prawdziwy; sprawdzanie int(tekst).isdigit().','Szybsi: zmień w układance tekst = "abc" na "42", a potem na "70" (w głowie) — który komunikat się wypisze?'),
   activities:[
    {type:'pythonLab',id:'wd-predict',mode:'predict',points:2,file:'isdigit.py',title:'Same cyfry? True czy False',
     prompt:'Każda linia wypisze True albo False. Wpisz cztery odpowiedzi i uruchom.',
     code:'print("16".isdigit())\nprint("-5".isdigit())\nprint("12.5".isdigit())\nprint("".isdigit())\n',predictRows:4,
     explain:'Tylko "16" to same cyfry. Minus i kropka nie są cyframi, a pusty tekst nie ma ani jednej cyfry — dlatego isdigit() od razu odrzuca liczby ujemne, ułamki i puste pole.'},
    {type:'pythonLab',id:'wd-parsons',mode:'parsons',points:4,file:'straznik.py',title:'Układanka: strażnik punktów',
     prompt:'Użytkownik wpisał „abc”. Ułóż program, który zamiast się wysypać, wypisze komunikat o błędzie. Uwaga: dwie linie to pułapki — wyglądają podobnie, ale mają złą kolejność albo zły spójnik.',
     solution:STRAZNIK,distractors:['if int(tekst) <= 50 and tekst.isdigit():','if tekst.isdigit() or int(tekst) <= 50:'],
     tests:[{output:'Błąd: wpisz liczbę od 0 do 50',label:'Dla „abc” program wypisuje komunikat, a nie błąd'}],
     hints:['Pierwsza linia to dane: `tekst = "abc"`. Potem if — z isdigit() NA POCZĄTKU warunku i spójnikiem and.','Pod if (z wcięciem) zamiana na liczbę i print „Zapisano”. Pod else (z wcięciem) komunikat o błędzie.']}
   ]},
  {id:'produkt',label:'Kalkulator',title:'Twój mini-program: kalkulator rabatu odporny na złe dane',grouping:'solo',
   intro:'Specyfikacja jest gotowa, testy też. Dopisz strażnika do kalkulatora z etapu 2 tak, żeby przeszedł wszystkie sprawdzenia: 7 testów danych (dobre dane, granice i śmieci) i użycie isdigit().',
   reading:{title:'Specyfikacja kalkulatora',paragraphs:['Dane wejściowe: cena w złotych (liczba całkowita, cyframi) i rabat w procentach (liczba całkowita od 0 do 90). Wynik: „Do zapłaty: X zł” z dwoma miejscami po kropce. Błędne dane (tekst, minus, ułamek, puste pole, rabat powyżej 90): komunikat „Błąd: wpisz cenę i rabat cyframi, rabat od 0 do 90”.','Cały blok liczenia (4 linie) ma się wykonać tylko dla dobrych danych — dlatego trafia pod if i dostaje wcięcie. Zaznacz kilka linii i naciśnij Tab, a wetną się wszystkie naraz.']},
   ...note(15,'Produkt lekcji. Uczniowie pracują samodzielnie z podpowiedziami stopniowanymi. Kryteria są jawne: 7 testów (pokaż je na projektorze przed startem i zapytaj, które są brzegowe — 90 i 91). Krąż i pytaj: „Który test jest czerwony i jakie dane sprawdza?”. Typowy postęp: najpierw zielone są tylko dobre dane, potem po dodaniu isdigit — śmieci, na końcu po int(rabat_t) <= 90 — granica 91. Kto skończy, próbuje zepsuć program własnymi danymi (np. 0 zł, 00, bardzo duża cena).','Które testy sprawdzają przypadki brzegowe i dlaczego są dwa?','200/90 (rabat dokładnie na granicy — ma się policzyć) i 200/91 (tuż za granicą — ma być błąd). Granicę sprawdza się z obu stron.','Brak wcięcia pod if dla jednej z 4 linii (wtedy liczy się zawsze i wysypuje na „abc”); int(rabat_t) przed isdigit; zmiana tekstu komunikatu (test sprawdza dokładny tekst — najlepiej odkomentować gotową linię).','Bonus (bez punktów): dopisz drugi warunek ceny, np. cena co najwyżej 100 000 zł, i sprawdź go własnym testem.'),
   activities:[
    {type:'pythonLab',id:'wd-product',mode:'code',points:6,file:'rabat.py',title:'Kalkulator ceny z rabatem — wersja odporna',input:true,stdin:['200','10'],
     prompt:'Dodaj nad blokiem liczenia warunek `if …:` (isdigit dla ceny i rabatu oraz rabat ≤ 90), wetnij 4 linie liczenia, a na końcu dodaj `else:` z komunikatem — jest gotowy w komentarzu na dole. Nie zmieniaj linii z input(). Najpierw „Uruchom” z różnymi danymi, potem „Sprawdź”.',
     starter:PRODUKT_START,solution:PRODUKT,timeoutMs:6000,
     tests:[
      {stdin:['200','10'],output:io('200','10','Do zapłaty: 180.00 zł'),label:'200 zł, rabat 10%'},
      {stdin:['99','15'],output:io('99','15','Do zapłaty: 84.15 zł'),label:'99 zł, rabat 15%'},
      {stdin:['200','90'],output:io('200','90','Do zapłaty: 20.00 zł'),label:'Granica: rabat 90%'},
      {stdin:['200','91'],output:io('200','91',BLAD),label:'Tuż za granicą: rabat 91%'},
      {stdin:['abc','10'],output:io('abc','10',BLAD),label:'Tekst zamiast ceny'},
      {stdin:['','10'],output:io('','10',BLAD),label:'Pusta cena'},
      {stdin:['200','-5'],output:io('200','-5',BLAD),label:'Rabat ujemny'}
     ],
     sourceChecks:[{pattern:'isdigit\\(\\)',label:'Program sprawdza dane przez isdigit()',hint:'Sprawdź oba teksty: cena_t.isdigit() i rabat_t.isdigit().'}],
     hints:['Nad linią `cena = int(cena_t)` dopisz `if cena_t.isdigit() and rabat_t.isdigit() and int(rabat_t) <= 90:` — najpierw isdigit, dopiero potem int.','Zaznacz 4 linie liczenia (od `cena = int(cena_t)` do print) i naciśnij Tab — muszą być pod if.','Pod blokiem napisz `else:` (bez wcięcia), a pod nim z wcięciem `print("Błąd: wpisz cenę i rabat cyframi, rabat od 0 do 90")` — usuń # z gotowej linii.'],
     summary:'Kalkulator rabatu odporny na złe dane: 7/7 testów i sprawdzanie isdigit()',successText:'Twój program przeszedł testy typowe, brzegowe i ze śmieciami. Tak wygląda kod gotowy do pokazania.'}
   ]},
  {id:'zapisz',label:'Zapisz',title:'Zapisz rozwiązanie: opis i plik',grouping:'solo',
   intro:'Program jest skończony, gdy działa i gdy ktoś inny zrozumie, co robi. Uzupełnij komentarz na górze kalkulatora i sprawdź, czy Twój program spełnia wszystkie kryteria.',
   reading:{title:'Gotowy program = kod + opis + testy',paragraphs:['Komentarz # na górze mówi: co program robi, jakie dane przyjmuje, co zwraca i kto go napisał. Python komentarzy nie wykonuje — są dla ludzi: dla nauczyciela, dla kolegi z zespołu i dla Ciebie za miesiąc.','Kod na platformie znika po odświeżeniu strony. Jeśli chcesz go zachować, zaznacz cały kod w edytorze (Ctrl+A), skopiuj (Ctrl+C), wklej do Notatnika i zapisz jako rabat.py (typ pliku: Wszystkie pliki). Taki plik otworzysz w każdym środowisku Pythona, np. IDLE albo Thonny.']},
   ...note(5,'Krótkie domknięcie produktu: uczniowie uzupełniają komentarz (inicjały) i zaznaczają listę kontrolną — to deklaracja ucznia, nie automatyczne sprawdzenie. Nauczyciel może obejrzeć program na ekranie ucznia. Zapis pliku w Notatniku jest opcjonalny — zdecyduj, czy w Waszej pracowni ma sens (komputery współdzielone).','Co powinien zawierać komentarz na górze programu?','Co program robi, jakie ma dane wejściowe i wynik, kto go napisał.','Komentarze „dla ozdoby” (# program, # kod) — nic nie mówią. Komentarz ma odpowiadać na pytanie „co to robi i dla jakich danych?”.','Szybsi: dopisz w komentarzu, jakie przypadki testowe sprawdziłeś (np. # Testy: 200/10, 200/90, 200/91, abc).'),
   activities:[
    choice('wd-comment','Który komentarz najlepiej opisuje Twój program?',['# Kalkulator ceny z rabatem: dane — cena w zł i rabat 0–90%, wynik — cena po rabacie albo komunikat o błędzie','# program','# tu jest kod, nie ruszać','# zadanie 4 z lekcji'],[0],'Dobry komentarz odpowiada na pytania: co robi program, jakie dane przyjmuje i co zwraca. Pozostałe nic nie mówią komuś, kto widzi kod pierwszy raz.','Wyobraź sobie, że widzisz ten program za rok. Który komentarz Ci pomoże?'),
    {type:'checklist',id:'wd-save',items:['Wszystkie testy kalkulatora są zielone','Komentarz na górze jest uzupełniony: inicjały i opis danych','Program jest sprawdzony na moich własnych danych (np. 0 zł, rabat 0%, pusty rabat)'],explanation:'To Twoja deklaracja — nauczyciel może poprosić o pokazanie programu na ekranie. Jeśli chcesz zachować kod: Ctrl+A, Ctrl+C, Notatnik, zapisz jako rabat.py.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: program kuloodporny?',grouping:'solo',
   intro:'Ostatnie pytanie — o tym, czego zabrakło w dzisiejszym programie — samoocena i karta wyniku.',
   reading:{title:'Czego jeszcze brakuje?',paragraphs:['Twój kalkulator ma jeden komunikat na wszystkie błędy. Użytkownik nie wie, czy pomylił się w cenie, czy w rabacie, ani czy rabat jest za duży, czy to nie liczba.','if/else ma tylko dwie drogi. Na następnej lekcji poznasz elif i instrukcje zagnieżdżone — program powie dokładnie, co jest źle, a Ty dopiszesz kolejne drogi do tego samego kalkulatora.']},
   ...note(5,'Pytanie wyjściowe prowadzi do następnej lekcji (elif, instrukcje zagnieżdżone). Zbierz 2–3 pomysły uczniów, jakie komunikaty powinien mieć kalkulator. Przypomnij o zapisaniu programu, jeśli ktoś chce go zachować.','Ile różnych komunikatów powinien mieć kalkulator, żeby użytkownik wiedział, co poprawić?','Co najmniej trzy: wynik, „cena/rabat to nie liczba” i „rabat za duży”. if/else daje tylko dwie drogi — potrzebny jest elif.','Uczniowie dopisują drugi if pod pierwszym bez else — wtedy komunikaty mogą się wypisać oba naraz.','Zapytaj, jakie komunikaty błędów w aplikacjach ich irytują, a jakie pomagają.'),
   activities:[
    choice('wd-exit','Na następnej lekcji kalkulator ma mówić dokładnie, co jest źle: wynik, „to nie liczba” albo „rabat za duży”. Ile dróg potrzeba w programie?',['Trzy — if/else ma tylko dwie, więc potrzebny będzie elif','Dwie — if i else wystarczą zawsze','Jedna — wystarczy print','Cztery osobne else'],[0],'Trzy różne reakcje to trzy drogi. if/else daje dwie — trzecią dodaje elif. To temat następnej lekcji.','Policz komunikaty, które chcesz pokazać.'),
    {type:'resultCard',id:'result',title:'Walidacja danych i gotowy program — wynik',sources:['wd-r1','wd-r2','wd-break','wd-predict','wd-parsons','wd-product','wd-comment','wd-exit'],badges:[
     {min:0,name:'Program z dziurą',text:'Na razie wystarczy „abc”, żeby wszystko padło. Wróć do strażnika — najpierw isdigit, potem int.'},
     {min:0.5,name:'Strażnik danych',text:'Twój program już odsiewa śmieci. Jeszcze granica 90/91 i będzie gotowy do pokazania.'},
     {min:0.85,name:'Kuloodporny kod',text:'Dobre dane, granice, tekst, minus i puste pole — Twój kalkulator przetrwa każdego użytkownika.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz zepsuć program złymi danymi i zabezpieczyć go: isdigit() przed int(), zakres w warunku, czytelny komunikat. Twój kalkulator rabatu przechodzi testy typowe, brzegowe i z błędnymi danymi i ma komentarz z opisem. Następnym razem: elif — program powie dokładnie, co jest źle.'
};
