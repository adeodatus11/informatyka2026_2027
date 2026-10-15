import {note, choice} from '../schema.js';

// Klasa 1, temat 30. for czy while; while z warunkiem (oszczędzanie, PIN, zgadywanie), pętla nieskończona
// i limit czasu w pythonLab, break w prostym przypadku. Bez funkcji (def) i bez list.

const SKARBONKA = `kasa = 0
tydzien = 0
while kasa < 100:
    kasa = kasa + 30
    tydzien = tydzien + 1
    print("Tydzień", tydzien, "- masz", kasa, "zł")
print("Cel osiągnięty!")
`;

const BATERIA = `bateria = 100
minuty = 0
while bateria > 20:
    bateria = bateria - 15
    minuty = minuty + 10
print(f"Po {minuty} min gry zostało {bateria}% baterii")
`;

const CEL_BUG = `cel = int(input("Ile chcesz uzbierać (zł)? "))
co_tydzien = int(input("Ile odkładasz co tydzień (zł)? "))
kasa = 0
tygodnie = 0
while kasa < cel:
    tygodnie = tygodnie + 1
print(f"Cel osiągniesz po {tygodnie} tygodniach. Będziesz mieć {kasa} zł.")
`;
const CEL = `cel = int(input("Ile chcesz uzbierać (zł)? "))
co_tydzien = int(input("Ile odkładasz co tydzień (zł)? "))
kasa = 0
tygodnie = 0
while kasa < cel:
    tygodnie = tygodnie + 1
    kasa = kasa + co_tydzien
print(f"Cel osiągniesz po {tygodnie} tygodniach. Będziesz mieć {kasa} zł.")
`;

const PIN_START = `PIN = "4821"
proby = 0
while proby < 3:
    wpisany = input("Podaj PIN: ")
    # ← tu: zwiększ licznik prób o 1
    if wpisany == PIN:
        print("Telefon odblokowany")
        # ← tu: zakończ pętlę (break)
    else:
        print("Zły PIN. Zostało prób:", 3 - proby)
if wpisany != PIN:
    print("Telefon zablokowany na 30 sekund")
`;
const PIN = `PIN = "4821"
proby = 0
while proby < 3:
    wpisany = input("Podaj PIN: ")
    proby = proby + 1
    if wpisany == PIN:
        print("Telefon odblokowany")
        break
    else:
        print("Zły PIN. Zostało prób:", 3 - proby)
if wpisany != PIN:
    print("Telefon zablokowany na 30 sekund")
`;

const GRA_START = `tajna = 37    # w prawdziwej grze: import random, a potem tajna = random.randint(1, 100)
proba = int(input("Zgadnij liczbę od 1 do 100: "))
licznik = 1
# ← tu pętla while: dopóki proba jest różna od tajnej:
#     wypisz „Za mało!” albo „Za dużo!”,
#     wczytaj nową próbę (int(input(...))) i zwiększ licznik o 1

print(f"Trafione! Liczba prób: {licznik}")
`;
const GRA = `tajna = 37    # w prawdziwej grze: import random, a potem tajna = random.randint(1, 100)
proba = int(input("Zgadnij liczbę od 1 do 100: "))
licznik = 1
while proba != tajna:
    if proba < tajna:
        print("Za mało!")
    else:
        print("Za dużo!")
    proba = int(input("Spróbuj jeszcze raz: "))
    licznik = licznik + 1

print(f"Trafione! Liczba prób: {licznik}")
`;

export default {
 id:'68',grade:1,order:30,title:'Stosowanie instrukcji iteracyjnych for i while w języku Python',
 subtitle:'PIN z trzema próbami, kalkulator „ile tygodni do celu” i gra w zgadywanie liczby. Na koniec lekcji masz działający program, który sam pyta i sam odpowiada.',
 topic:'for czy while, pętla while z warunkiem, licznik prób, break, pętla nieskończona',icon:'lock',tags:['while','PIN i break','mini-gra'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.1 (dobór pętli do problemu, warunek zakończenia), I.3 (sprawdzanie poprawności dla przykładowych danych, rozpoznanie pętli nieskończonej), II.1 (pętle for i while, instrukcja break, wejście/wyjście), II.2 (Python w przeglądarce)',
 format:{
  name:'Warsztat: od pętli nieskończonej do działającej gry',
  student:'Najpierw decydujesz, kiedy for, a kiedy while, i zgadujesz, co zrobi pętla ze skarbonką. Potem świadomie zawieszasz program (pętla nieskończona!) i naprawiasz go — tak powstaje kalkulator „ile tygodni do celu”. Na koniec PIN z trzema próbami i Twoja gra w zgadywanie liczby.',
  teacher:'Problem, projekt i przypadek: lekcja prowadzi do produktu — kalkulatora oszczędzania i mini-gry, które uczeń może pokazać. Pętla nieskończona jest tu przypadkiem do zbadania, nie wpadką: kod startowy kalkulatora zawiesza się, środowisko zatrzymuje go po 3 s, a uczeń szuka zmiennej, która „nie rusza się” w warunku. Feedback prowadzący do poprawy dają testy z różnymi danymi (PIN dobry, dobry za drugim razem, trzy złe). Powtórki rozłożone: start wraca do pętli w pętli (temat 29) i range w dół (temat 28), a PIN i gra wymagają if/else z tematu 27. Metapoznanie: przed każdym „Uruchom” uczeń odpowiada sobie, kiedy ta pętla się skończy.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie para przy grze (etap 6): gdy obie osoby mają działającą grę, zmieniają tajną liczbę i zgadują u siebie nawzajem.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Powtórki rozłożone w czasie',url:'https://metodyka.covepolska.pl/metoda-powtorki-rozlozone.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:['Wybieram for, gdy znam liczbę powtórzeń, i while, gdy powtarzam, dopóki warunek jest prawdziwy.','Rozpoznaję pętlę nieskończoną (zmienna w warunku się nie zmienia) i ją naprawiam.','Piszę while z licznikiem prób i kończę pętlę wcześniej przez break (PIN).','Piszę grę w zgadywanie liczby z input() i podpowiedziami „za mało / za dużo”.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor — pokaz pętli nieskończonej i zatrzymania programu po 3 s (etap 4).'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: skarbonka — tygodnie 1–4 (30, 60, 90, 120 zł) i „Cel osiągnięty!”; bateria — 60 min, zostaje 10%; cel 600 zł po 50 zł → 12 tygodni, 100 zł po 30 zł → 4 tygodnie i 120 zł, 0 zł tygodniowo → pętla nieskończona; PIN 4821; gra — tajna liczba 37, przy strzałach w środek przedziału wystarczy najwyżej 7 prób dla 1–100. Pętla nieskończona w środowisku: po 3 s komunikat „Program działa za długo…” i restart Pythona (2–3 s) — to normalne. W zwykłym terminalu program przerywa się klawiszami Ctrl+C.',
  summary:'Uczeń dobiera for/while, przewiduje skarbonkę, układa pętlę baterii, naprawia pętlę nieskończoną (kalkulator celu), uzupełnia PIN o licznik i break oraz pisze grę w zgadywanie. Karta wyniku: maks. 25 pkt. Pytanie na wyjście: po czym poznać, że pętla while się nie skończy?'
 },
 sections:[
  {id:'start',label:'Start',title:'Trzy złe PIN-y i blokada',grouping:'class',
   intro:'Telefon pyta o PIN. Ile razy? Nie wiadomo — może trafisz za pierwszym razem, a może po trzech złych próbach telefon się zablokuje. Tego nie zrobisz pętlą „10 razy”. Dziś while. Najpierw dwa pytania z poprzednich lekcji, bez notatek.',
   reading:{title:'for czy while?',paragraphs:['for — gdy wiesz, ile razy powtórzyć: 7 dni treningu, 10 wierszy tabliczki, każda z 3 ocen. while — gdy powtarzasz, DOPÓKI warunek jest prawdziwy: dopóki kasa < cel, dopóki PIN jest zły, dopóki nie zgadniesz.','while sam nie liczy obrotów. Coś w środku pętli musi zmieniać zmienną z warunku (kasa rośnie, próby rosną). Jeśli nic jej nie zmienia — pętla kręci się w nieskończoność.']},
   ...note(4,'Hak: zapytaj, ile razy telefon pozwala wpisać zły PIN, zanim się zablokuje, i skąd wie, kiedy przestać pytać. Dwa pytania powtórkowe: pętla w pętli (temat 29) i range w dół (temat 28) — samodzielnie. Omów to, które sprawiło więcej kłopotu.','Skąd telefon „wie”, kiedy przestać pytać o PIN?','Sprawdza warunek: PIN poprawny albo wykorzystane 3 próby. Dopóki żadne z tych się nie stało — pyta dalej.','Uczniowie mylą liczbę wierszy z liczbą wszystkich znaków w pętli w pętli.','Zapytaj: jakie inne urządzenia „pytają, dopóki…”? (bankomat, logowanie, budzik z drzemką).'),
   activities:[
    choice('fw-r1','Powtórka z lekcji o pętli w pętli: for w in range(4): for k in range(6): print("*", end="") — ile gwiazdek narysuje program?',['24','10','6','4'],[0],'4 obroty zewnętrznej pętli × 6 obrotów wewnętrznej = 24 gwiazdki. Liczby obrotów się mnoży.','Pętla w pętli: mnożysz czy dodajesz?'),
    choice('fw-r2','Powtórka z lekcji o pętli for: co daje range(5, 0, -1)?',['5, 4, 3, 2, 1','5, 4, 3, 2, 1, 0','0, 1, 2, 3, 4, 5','1, 2, 3, 4, 5'],[0],'Start 5, krok −1, stop 0 — a stop nie wchodzi do wyniku. Tak liczyło odliczanie do wakacji.','Pamiętaj: druga liczba w range (stop) nie wchodzi do wyniku.')
   ]},
  {id:'choose',label:'for czy while',title:'Wybierz pętlę i przewiduj skarbonkę',grouping:'solo',
   intro:'Do każdej sytuacji dobierz pętlę. Potem zgadnij, co wypisze pętla while ze skarbonką — i zaznacz, jak jesteś pewna/pewny.',
   reading:{title:'Jak czytać while',paragraphs:['while kasa < 100: czytasz „dopóki kasa jest mniejsza od 100, powtarzaj”. Python sprawdza warunek PRZED każdym obrotem. Gdy warunek jest fałszywy — wychodzi z pętli i idzie do linii bez wcięcia.','Warunek sprawdza się tylko na początku obrotu. Dlatego skarbonka może „przeskoczyć” cel: 90 zł < 100, więc jeszcze jeden obrót i masz 120 zł.'],example:{question:'Przykład rozwiązany: kasa = 0, co obrót +40 zł, while kasa < 100. Ile obrotów?',answer:'0 < 100 → 40. 40 < 100 → 80. 80 < 100 → 120. 120 < 100? Nie — koniec. 3 obroty, w skarbonce 120 zł.'}},
   ...note(7,'Najpierw dopasowanie (samodzielnie, 2 min), potem przewidywanie. Zapytaj, kto był „Na pewno” i dostał inny wynik — najczęściej ktoś kończy na 90 zł, bo myśli, że pętla „zatrzyma się w połowie”. Pokaż na tablicy: warunek sprawdzany tylko na początku obrotu.','Dlaczego skarbonka kończy na 120 zł, a nie na 100 zł?','Bo co tydzień przybywa 30 zł: 90 < 100, więc jest jeszcze jeden obrót i 90 + 30 = 120. Warunek sprawdza się dopiero przed kolejnym obrotem.','Przewidywanie 3 tygodni (90 zł) albo wypisanie „Cel osiągnięty!” po każdym tygodniu.','Zapytaj: co trzeba zmienić, żeby skarbonka kończyła się dokładnie na 100 zł? (odkładać 25 zł albo 20 zł).'),
   activities:[
    {type:'matching',id:'fw-match',question:'Dobierz pętlę do sytuacji.',options:['for — wiem, ile razy powtórzyć','while — powtarzam, dopóki warunek jest prawdziwy'],rows:[
     {label:'Wypisz 10 serii pompek',correct:[0],explanation:'Liczba powtórzeń jest znana: 10. for seria in range(1, 11).'},
     {label:'Pytaj o PIN, dopóki nie będzie dobry (najwyżej 3 razy)',correct:[1],explanation:'Nie wiesz z góry, kiedy ktoś trafi. while proby < 3 (i break po dobrym PIN-ie).'},
     {label:'Odkładaj co tydzień 50 zł, aż uzbierasz na słuchawki',correct:[1],explanation:'Powtarzasz, dopóki kasa < cel. Liczbę tygodni dopiero policzysz.'},
     {label:'Narysuj tabliczkę mnożenia 10 × 10',correct:[0],explanation:'10 wierszy i 10 kolumn — znane z góry. Dwie pętle for.'},
     {label:'Gra: zgaduj liczbę, aż trafisz',correct:[1],explanation:'Nikt nie wie, ile prób będzie potrzeba. while proba != tajna.'}
    ]},
    {type:'pythonLab',id:'fw-predict',mode:'predict',points:2,file:'skarbonka.py',title:'Skarbonka: 30 zł co tydzień',
     prompt:'Co wypisze ten program? Uważaj na ostatni obrót pętli.',
     code:SKARBONKA,predictRows:5,
     explain:'Warunek sprawdza się przed każdym obrotem: 0, 30, 60 i 90 są mniejsze od 100 — cztery obroty. Po czwartym kasa = 120, warunek `120 < 100` jest fałszywy i pętla się kończy.'}
   ]},
  {id:'parsons',label:'Układanka',title:'Ile minut pogram na baterii?',grouping:'solo',
   intro:'Telefon ma 100% baterii. Co 10 minut gry ubywa 15%. Grasz, dopóki bateria jest powyżej 20%. Ułóż program, który policzy, ile minut zagrasz.',
   reading:{title:'Zmienna w warunku musi się zmieniać',paragraphs:['W warunku while bateria > 20 jest zmienna bateria. W pętli musi maleć, inaczej warunek zawsze będzie prawdziwy.','Jedna z pułapek dodaje baterię zamiast odejmować — wtedy pętla nigdy się nie skończy. Jeśli tak ułożysz, środowisko zatrzyma program po 3 sekundach. Przeczytaj komunikat i popraw.']},
   ...note(6,'Samodzielnie. Dwie pułapki: while bateria > 0 (grasz do zera — wynik inny niż w teście) i bateria = bateria + 15 (pętla nieskończona). Jeśli ktoś trafi na zawieszenie, to dobra okazja: zapytaj „która zmienna w warunku nie maleje?”.','Ile obrotów zrobi pętla i dlaczego kończy się przy 10%?','6 obrotów: 100 → 85 → 70 → 55 → 40 → 25 → 10. Przy 25 warunek 25 > 20 jest jeszcze prawdziwy, więc jest szósty obrót.','Uczniowie oczekują, że pętla zatrzyma się „równo” na 20%.','Zmień zużycie na 12% co 10 minut. Ile minut zagrasz?'),
   activities:[
    {type:'pythonLab',id:'fw-parsons',mode:'parsons',points:4,file:'bateria.py',title:'Układanka: minuty gry na baterii',
     prompt:'Ułóż program z linii. ↑ ↓ zmieniają kolejność, ← → wcięcie. Dwie linie to pułapki — jedna z nich zawiesi program.',
     solution:BATERIA,distractors:['while bateria > 0:','bateria = bateria + 15'],
     tests:[{output:'Po 60 min gry zostało 10% baterii',label:'Wynik: 60 minut, 10% baterii'}],
     hints:['Na górze dwie linie bez wcięcia: `bateria = 100` i `minuty = 0`. Potem `while bateria > 20:`.','W pętli (1 poziom wcięcia): `bateria = bateria - 15` i `minuty = minuty + 10`. print bez wcięcia — po pętli.']}
   ]},
  {id:'infinite',label:'Pętla nieskończona',title:'Kalkulator: ile tygodni do celu?',grouping:'solo',
   intro:'Chcesz kupić słuchawki za 600 zł i odkładasz 50 zł tygodniowo. Ile tygodni? Ten kalkulator ma błąd: po uruchomieniu kręci się w nieskończoność. Zobacz, co zrobi środowisko, i napraw program.',
   reading:{title:'Pętla nieskończona: jak ją rozpoznać',paragraphs:['Objaw: program nic nie wypisuje i „myśli” bez końca. Tu środowisko zatrzyma go po 3 sekundach i pokaże komunikat „Program działa za długo — może pętla się nie kończy?”. W zwykłym terminalu przerywasz program klawiszami Ctrl+C.','Przyczyna prawie zawsze ta sama: zmienna z warunku while nie zmienia się w pętli. Sprawdź warunek (kasa < cel) i poszukaj w pętli linii, która zmienia kasę.']},
   ...note(8,'Pokaż to na projektorze: uruchom kod startowy, odczekaj 3 s, przeczytaj komunikat na głos. Powiedz wprost: to nie awaria komputera — tak programiści codziennie wpadają w pętlę nieskończoną. Potem uczniowie szukają przyczyny sami. Restart Pythona po zatrzymaniu trwa 2–3 s — uprzedź, żeby nie klikali wiele razy.','Która zmienna w warunku while kasa < cel się nie zmieniała?','kasa — w pętli rosły tylko tygodnie. Trzeba dopisać kasa = kasa + co_tydzien.','Dopisanie linii bez wcięcia (po pętli) — pętla dalej się nie kończy; wielokrotne klikanie „Uruchom” w czasie restartu.','Dopisz walidację z lekcji o sprawdzaniu danych: jeśli co_tydzien <= 0, wypisz „Tak nigdy nie uzbierasz” i nie uruchamiaj pętli.'),
   activities:[
    {type:'pythonLab',id:'fw-goal',mode:'code',points:4,file:'cel.py',title:'Napraw: kalkulator „ile tygodni do celu”',input:true,stdin:['600','50'],loops:true,
     prompt:'Kliknij „Uruchom” i poczekaj 3 sekundy — program się zawiesi. Znajdź zmienną z warunku `while`, która nigdy się nie zmienia, dopisz jedną linię w pętli i kliknij „Sprawdź”.',
     starter:CEL_BUG,solution:CEL,
     tests:[
      {stdin:['600','50'],contains:['po 12 tygodniach','600 zł'],label:'Słuchawki: 600 zł po 50 zł'},
      {stdin:['100','30'],contains:['po 4 tygodniach','120 zł'],label:'100 zł po 30 zł'},
      {stdin:['1000','75'],contains:['po 14 tygodniach','1050 zł'],label:'1000 zł po 75 zł'},
      {stdin:['0','20'],contains:['po 0 tygodniach','0 zł'],label:'Cel 0 zł'}
     ],
     hints:['W warunku jest `kasa < cel`. Czy w pętli jest linia, która zmienia `kasa`? Nie ma — dlatego kasa wiecznie wynosi 0.','Dopisz w pętli (wcięcie 4 spacje, pod `tygodnie = …`): `kasa = kasa + co_tydzien`.'],
     questions:[
      {q:'Co się stanie, jeśli ktoś wpisze, że odkłada 0 zł tygodniowo?',options:['Pętla nigdy się nie skończy — kasa zostanie na 0','Program wypisze 0 tygodni','Program wypisze 1 tydzień','Python zgłosi błąd dzielenia przez zero'],correct:[0],explain:'kasa = 0 + 0 = 0 w każdym obrocie, więc warunek kasa < cel jest zawsze prawdziwy. Takie dane trzeba odrzucić walidacją, zanim program wejdzie do pętli.',hint:'Ile wynosi kasa po każdym obrocie, gdy co tydzień dochodzi 0 zł?'}
     ],
     summary:'Kalkulator „ile tygodni do celu” działa: {passed}/{total} testów',successText:'Twój kalkulator oszczędzania działa. Wpisz własny cel i sprawdź, ile tygodni potrzebujesz.'}
   ]},
  {id:'pin',label:'PIN',title:'PIN z trzema próbami',grouping:'solo',
   intro:'Telefon daje 3 próby. Dobry PIN — odblokowany i koniec pytania. Trzy złe — blokada. Program prawie działa: brakuje licznika prób i polecenia, które kończy pętlę po dobrym PIN-ie.',
   reading:{title:'break: wyjdź z pętli teraz',paragraphs:['break natychmiast kończy pętlę — Python przeskakuje do pierwszej linii po pętli. Przydaje się, gdy cel jest osiągnięty wcześniej: dobry PIN za pierwszym razem, nie ma po co pytać dalej.','Licznik prób zwiększasz od razu po wpisaniu PIN-u. Wtedy 3 - proby to liczba prób, które zostały.']},
   ...note(8,'Samodzielnie. Najpierw niech uczniowie uruchomią kod startowy z dobrym PIN-em w polu „Dane wejściowe”: telefon się odblokuje, ale pyta dalej i kończy się komunikatem „Program czeka na dane”. Zapytaj: czego brakuje? Testy sprawdzają trzy historie: dobry PIN od razu, za drugim razem i trzy złe.','Co by się stało bez break, gdy PIN jest dobry za pierwszym razem?','Pętla pytałaby dalej o PIN (aż do 3 prób), choć telefon jest już odblokowany.','proby = proby + 1 na końcu pętli zamiast pod input — wtedy „Zostało prób” pokazuje o jedną za dużo; break z wcięciem jak if (poza blokiem).','Zmień liczbę prób na 5 — w ilu miejscach trzeba zmienić 3? (dwóch) Zapisz ją w zmiennej LIMIT.'),
   activities:[
    {type:'pythonLab',id:'fw-pin',mode:'code',points:4,file:'pin.py',title:'Uzupełnij: licznik prób i break',input:true,stdin:['1111','4821'],
     prompt:'Dopisz dwie linie w miejscach oznaczonych `# ← tu`. PIN to 4821. W polu „Dane wejściowe” każda linia to jedna próba.',
     starter:PIN_START,solution:PIN,
     tests:[
      {stdin:['4821'],output:'Podaj PIN: 4821\nTelefon odblokowany',label:'Dobry PIN od razu'},
      {stdin:['1111','4821'],output:'Podaj PIN: 1111\nZły PIN. Zostało prób: 2\nPodaj PIN: 4821\nTelefon odblokowany',label:'Dobry za drugim razem'},
      {stdin:['0000','9999','4821'],contains:['Zostało prób: 1','Telefon odblokowany'],label:'Dobry za trzecim razem'},
      {stdin:['1111','2222','3333'],output:'Podaj PIN: 1111\nZły PIN. Zostało prób: 2\nPodaj PIN: 2222\nZły PIN. Zostało prób: 1\nPodaj PIN: 3333\nZły PIN. Zostało prób: 0\nTelefon zablokowany na 30 sekund',label:'Trzy złe próby'}
     ],
     hints:['Pod `wpisany = input(...)` (wcięcie 4 spacje): `proby = proby + 1`.','Pod `print("Telefon odblokowany")` (wcięcie 8 spacji, jak print): `break`.'],
     questions:[
      {q:'Co robi break w tym programie?',options:['Kończy pętlę od razu po dobrym PIN-ie','Blokuje telefon','Zeruje licznik prób','Wraca na początek pętli'],correct:[0],explain:'break przerywa pętlę while — Python przechodzi do linii po pętli. Bez niego program pytałby o PIN, choć telefon jest już odblokowany.',hint:'Usuń na chwilę break i uruchom z dobrym PIN-em — co się dzieje?'}
     ],
     successText:'PIN działa jak w prawdziwym telefonie: 3 próby i blokada.'}
   ]},
  {id:'game',label:'Gra',title:'Twoja gra: zgadnij liczbę',grouping:'solo',
   intro:'Ostatni program to gra. Komputer ma tajną liczbę, a gracz zgaduje. Po każdej próbie gra mówi „Za mało!” albo „Za dużo!”, aż do trafienia. Na końcu pokazuje liczbę prób.',
   reading:{title:'while z warunkiem „różne od”',paragraphs:['while proba != tajna: czytasz „dopóki próba jest RÓŻNA od tajnej liczby”. != znaczy „różne od”. Gdy gracz trafi, warunek jest fałszywy i pętla się kończy.','W pętli trzy rzeczy: podpowiedź (if/else z lekcji o warunkach), nowa próba przez int(input(...)) i licznik + 1. Bez nowej próby pętla kręciłaby się bez końca.'],example:{question:'Przykład rozwiązany: tajna = 37, gracz wpisuje 50, potem 25, potem 37. Co wypisze gra?',answer:'50 → „Za dużo!”, 25 → „Za mało!”, 37 → pętla się kończy, „Trafione! Liczba prób: 3”.'}},
   ...note(8,'Samodzielnie. To produkt lekcji — kto ma zielone testy, może zmienić tajną liczbę i dać zagrać koledze (opcjonalnie para). Jeśli zabraknie czasu, ten etap można pominąć: kalkulator z etapu 4 też jest działającym produktem. Najczęstszy problem: brak nowego input w pętli → program wypisuje „Za mało!” bez końca i środowisko go zatrzymuje.','Dlaczego w pętli musi być nowe input()?','Bo inaczej proba się nie zmienia, warunek proba != tajna jest zawsze prawdziwy i gra wypisuje podpowiedź bez końca.','Licznik zwiększany poza pętlą; input bez int() — porównanie tekstu z liczbą (proba != tajna zawsze prawdziwe).','Prawdziwe losowanie: na początku import random i tajna = random.randint(1, 100). Testy wtedy nie zadziałają (inna liczba za każdym razem) — dlatego w zadaniu jest 37.',true),
   activities:[
    {type:'pythonLab',id:'fw-game',mode:'code',points:4,file:'zgadnij.py',title:'Gra: zgadnij liczbę',input:true,stdin:['50','25','37'],requires:'fw-pin',requiresTitle:'PIN z trzema próbami',
     prompt:'Dopisz pętlę `while` w miejscu komentarza. W polu „Dane wejściowe” są próby gracza: 50, 25, 37. Kliknij „Uruchom”, a potem „Sprawdź”.',
     starter:GRA_START,solution:GRA,
     tests:[
      {stdin:['37'],contains:['Trafione! Liczba prób: 1'],label:'Trafienie za pierwszym razem'},
      {stdin:['50','25','37'],contains:['Za dużo!','Za mało!','Trafione! Liczba prób: 3'],label:'50, 25, 37'},
      {stdin:['1','99','36','38','37'],contains:['Trafione! Liczba prób: 5'],label:'Pięć prób'}
     ],
     sourceChecks:[{pattern:'\\bwhile\\b',label:'Kod używa pętli while',hint:'Gra ma pytać, dopóki gracz nie trafi: `while proba != tajna:`.'}],
     hints:['Pierwsza linia pętli (bez wcięcia): `while proba != tajna:`.','W pętli (wcięcie 4): `if proba < tajna:` → print("Za mało!") (wcięcie 8), `else:` → print("Za dużo!").','Na końcu pętli (wcięcie 4): `proba = int(input("Spróbuj jeszcze raz: "))` i `licznik = licznik + 1`.'],
     questions:[
      {q:'Liczby od 1 do 100. Strzelasz zawsze w środek tego, co zostało (50, potem 25 albo 75…). Ile prób wystarczy w najgorszym przypadku?',options:['7','10','50','100'],correct:[0],explain:'Każda próba odcina połowę możliwości: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1. Po 7 próbach zostaje jedna liczba. Tak samo działa szukanie w posortowanej liście (wyszukiwanie binarne).',hint:'Ile razy możesz dzielić 100 na pół, zanim zostanie 1?'}
     ],
     summary:'Gra „zgadnij liczbę” działa: {passed}/{total} testów',successText:'Twoja gra działa! Zmień tajną liczbę i daj komuś zagrać.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: for, while i pętla pod kontrolą?',grouping:'solo',
   intro:'Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi — razem z działającym kalkulatorem albo grą.',
   ...note(4,'Pytanie końcowe: rozpoznanie pętli nieskończonej. Poproś 2–3 osoby o pokazanie gry albo kalkulatora z własnym celem (np. ile tygodni do nowego telefonu). Podsumuj blok programowania: zmienne, input, warunki, elif, for, pętla w pętli, while.','Po czym poznać, że pętla while się nie skończy?','Zmienna z warunku nie zmienia się w pętli albo zmienia się w złą stronę (bateria rośnie, kasa stoi).','„Pętla nieskończona to błąd komputera” — to błąd w programie: warunek zawsze prawdziwy.','Połącz PIN z grą: gracz ma tylko 7 prób na zgadnięcie liczby (while z dwoma warunkami albo break).'),
   activities:[
    choice('fw-exit','Która pętla nigdy się nie skończy?',['x = 1; while x > 0: x = x + 1','x = 10; while x > 0: x = x - 1','x = 0; while x < 5: x = x + 1','for i in range(1000): print(i)'],[0],'x zaczyna od 1 i ciągle rośnie, więc x > 0 zawsze jest prawdą. W pozostałych zmienna zmierza do końca warunku, a for z range zawsze się kończy.','Szukaj zmiennej, która oddala się od końca warunku zamiast się do niego zbliżać.'),
    {type:'resultCard',id:'result',title:'Pętle for i while — wynik',sources:['fw-r1','fw-r2','fw-match','fw-predict','fw-parsons','fw-goal','fw-pin','fw-game','fw-exit'],badges:[
     {min:0,name:'Pętla się kręci',text:'Część programów jeszcze się zawiesza. Wróć do kalkulatora celu: która zmienna w warunku stoi w miejscu?'},
     {min:0.5,name:'Strażnik PIN-u',text:'Kalkulator liczy, PIN blokuje po 3 próbach. Jeszcze gra i masz komplet.'},
     {min:0.85,name:'Twórca gier',text:'for, while, break — i działająca gra, w którą można zagrać. Pętla nieskończona Ci nie straszna.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz wybrać pętlę: for, gdy znasz liczbę powtórzeń, while, gdy czekasz na warunek. Rozpoznajesz pętlę nieskończoną po zmiennej, która nie zmienia się w warunku, kończysz pętlę przez break i masz działający kalkulator oszczędzania oraz grę.'
};
