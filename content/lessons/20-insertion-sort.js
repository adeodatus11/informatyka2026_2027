import {note, choice} from '../schema.js';

const WSTAWIANIE = `def wstawianie(lista):
    for i in range(1, len(lista)):
        karta = lista[i]
        j = i - 1
        while j >= 0 and lista[j] > karta:
            lista[j + 1] = lista[j]
            j -= 1
        lista[j + 1] = karta
    return lista
`;
const bug = (from, to) => WSTAWIANIE.replace(from, to);
const COMPARE = String.raw`import random


def babelkowe(lista):
    porownania = 0
    n = len(lista)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            porownania += 1
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
    return porownania


def wstawianie(lista):
    porownania = 0
    for i in range(1, len(lista)):
        karta = lista[i]
        j = i - 1
        while j >= 0:
            porownania += 1
            if lista[j] <= karta:
                break
            lista[j + 1] = lista[j]
            j -= 1
        lista[j + 1] = karta
    return porownania


random.seed(2026)              # te same „losowe” liczby na każdym komputerze
losowa = [random.randint(1, 1000) for _ in range(100)]
prawie = sorted(losowa)        # posortowana kopia…
prawie[10], prawie[11] = prawie[11], prawie[10]    # …w której zamieniamy
prawie[50], prawie[52] = prawie[52], prawie[50]    # dwie pary liczb

# losowa[:] to kopia listy — każdy algorytm dostaje te same dane
print("lista 100 liczb      bąbelkowe   wstawianie")
print("losowa             ", babelkowe(losowa[:]), "      ", wstawianie(losowa[:]))
print("prawie posortowana ", babelkowe(prawie[:]), "      ", wstawianie(prawie[:]))
`;

export default {
 id:'20',grade:2,title:'Programowanie algorytmów porządkowania przez wstawianie',
 subtitle:'Układasz karty w ręce dokładnie tak, jak ten algorytm. Nauczysz się go pisać — i naprawiać, gdy się psuje.',
 topic:'Sortowanie przez wstawianie w Pythonie',icon:'sort',tags:['while','przesuwanie','karty'],duration:45,
 curriculum:'Informatyka – liceum/technikum · algorytmy porządkowania (sortowanie przez wstawianie), programowanie i testowanie rozwiązań w wybranym języku (Python)',
 format:{
  name:'Mastery learning z debugowaniem: napraw kod',
  student:'Najpierw śledzisz, jak komputer wstawia karty na miejsce, i układasz algorytm z klocków. Główna część to warsztat naprawczy: trzy wersje programu z celowo zasianymi błędami — każdą musisz naprawić, żeby odblokować następną. Na końcu porównujesz wstawianie z sortowaniem bąbelkowym na prawdziwych liczbach.',
  teacher:'Mastery learning z informacją zwrotną prowadzącą do poprawy: każdy poziom „Napraw kod” odblokowuje się dopiero po zaliczeniu poprzedniego, a testy i komunikaty błędów (po polsku) mówią, co jest źle, ale nie jak to poprawić. Uczeń może wziąć stopniowane podpowiedzi. Błąd 2 celowo zawiesza program (pętla nieskończona) — środowisko zatrzyma go po 3 s; to dobry moment, żeby na forum omówić, dlaczego while musi zmieniać zmienną z warunku. Twoja rola: pytasz „co mówi test?”, „jaka jest wartość j w tym momencie?” i odsyłasz do śledzenia.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Szybsi uczniowie mogą pomagać sąsiadom wyłącznie pytaniami (tutoring rówieśniczy), bez dyktowania kodu.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Tutoring rówieśniczy',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'}
  ]
 },
 objectives:['Śledzę sortowanie przez wstawianie i wyjaśniam je na przykładzie kart w ręce.','Piszę pętlę while z dwoma warunkami i wiem, dlaczego zmienna z warunku musi się zmieniać.','Znajduję i naprawiam błędy w kodzie, korzystając z testów i komunikatów Pythona.','Porównuję liczbę operacji sortowania bąbelkowego i przez wstawianie i wskazuję, kiedy wstawianie wygrywa.'],
 materials:['Komputer z aktualną przeglądarką (Chrome, Edge lub Firefox) — jeden na osobę. Python działa w przeglądarce, bez instalacji.','Projektor do śledzenia w etapie 2','Opcjonalnie: talia kart lub 4 kartki z liczbami 7, 3, 5, 1 do pokazania wstawiania „w ręce”'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz lekcję na komputerze z projektorem i wejdź do etapu 2 — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: lista po wstawieniu 3 to [3, 7, 5, 1]; przy wstawianiu 1 są 3 przesunięcia. Błąd 1: while j > 0 → j >= 0. Błąd 2: brak j -= 1 (pętla nieskończona — program zatrzyma się po 3 s). Błąd 3: lista[j] = karta → lista[j + 1] = karta. Porównanie (100 liczb): bąbelkowe 4950 porównań na obu listach, wstawianie 2612 na losowej i 103 na prawie posortowanej.',
  summary:'Uczeń wyjaśnia wstawianie analogią kart, układa algorytm, naprawia trzy typowe błędy (zły warunek, pętla nieskończona, wstawienie w złe miejsce) i na podstawie pomiaru wskazuje, że wstawianie jest bardzo szybkie dla danych prawie posortowanych. Na karcie wyniku maks. 25 pkt. Pytanie na wyjście: dlaczego wstawianie przydaje się, gdy do posortowanego rankingu dochodzi jeden nowy wynik?'
 },
 sections:[
  {id:'start',label:'Start',title:'Karty w ręce',grouping:'class',
   intro:'Grając w karty, bierzesz nową kartę i wsuwasz ją w odpowiednie miejsce między te, które już trzymasz. To jest sortowanie przez wstawianie — i dziś je zaprogramujesz. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   ...note(4,'Hak: pokaż (lub poproś ucznia) układanie 4 kart w ręce — każdą nową kartę wsuwa się w odpowiednie miejsce, przesuwając większe w prawo. Dwa pytania powtórkowe z lekcji o sortowaniu bąbelkowym, bez notatek. Potem wszyscy przechodzą do etapu 2.','Czym różni się układanie kart w ręce od sortowania bąbelkowego?','Bąbelkowe wielokrotnie porównuje i zamienia sąsiadów w całej liście. Przy kartach bierzesz jedną nową kartę i od razu wsuwasz ją na właściwe miejsce w już ułożonej części.','Uczniowie myślą, że a, b = b, a kopiuje wartości zamiast je zamieniać.','Zapytaj, kto układa karty od lewej, a kto od prawej — algorytm działa w obu wersjach.'),
   activities:[
    choice('ci-r1','Co robi linia a, b = b, a?',['Zamienia wartości a i b miejscami','Kopiuje a do b','Porównuje a i b','Tworzy listę [b, a]'],[0],'Python najpierw oblicza prawą stronę (stare b i stare a), a potem wpisuje je naraz do a i b — to zamiana.','Przypomnij sobie zadanie z cenami w sklepie.'),
    choice('ci-r2','Dlaczego w sortowaniu bąbelkowym wewnętrzna pętla to range(n - 1 - i)?',['Bo ostatnie i liczb jest już na swoich miejscach','Bo pętla musi zawsze wykonać się n razy','Żeby sortować malejąco','Bo tak wymaga Python'],[0],'Po każdym przejściu kolejna największa liczba stoi na końcu, więc nie trzeba jej już porównywać.','Co wiesz o końcu listy po każdym przejściu?')
   ]},
  {id:'cards',label:'Karty',title:'Wstawianie krok po kroku',grouping:'class',
   intro:'Prześledź sortowanie listy [7, 3, 5, 1]. Zmienna karta to karta wzięta do ręki, i wskazuje jej pozycję, a j cofa się w lewo, przesuwając większe karty. Przejdź kroki i odpowiedz na pytania.',
   reading:{title:'Jak działa wstawianie?',paragraphs:[
    'Lewa część listy jest zawsze posortowana (na początku to tylko pierwsza karta). W każdym obrocie pętli for bierzemy kolejną kartę: karta = lista[i]. Pętla while przesuwa w prawo wszystkie większe karty z lewej części, a potem wkładamy kartę w powstałą lukę: lista[j + 1] = karta.',
    'Pętla while ma dwa warunki połączone słowem and: j >= 0 (nie wychodzimy przed początek listy) i lista[j] > karta (karta po lewej jest większa). Gdy którykolwiek przestaje być prawdziwy, pętla się kończy. Ważne: w środku j -= 1, inaczej pętla nigdy by się nie skończyła.'
   ],example:{question:'Przykład rozwiązany: wstaw 2 do posortowanej części [1, 4, 6].',answer:'Porównaj 2 z 6 — większe, przesuń. Z 4 — większe, przesuń. Z 1 — mniejsze, stop. Wstaw 2 za 1: [1, 2, 4, 6]. Dwa przesunięcia.'}},
   ...note(8,'Na projektorze przejdź pierwszy obrót (wstawienie 3) i mów na głos: „biorę 3 do ręki, 7 jest większe, przesuwam je w prawo, j = −1, koniec, wkładam 3 na początek”. Pokaż na liście niebieskie pola i oraz j. Potem uczniowie przechodzą sami i odpowiadają na pytania. Wróć do analogii z kartami, gdy ktoś się zgubi.','Dlaczego przez chwilę lista wygląda jak [7, 7, 5, 1] — czy karta 3 zniknęła?','Nie — 3 jest zapamiętana w zmiennej karta („w ręce”). 7 zostało skopiowane w prawo, a luka zostanie wypełniona trójką.','Uczniowie myślą, że wstawianie zamienia sąsiadów jak bąbelkowe. Tu karty są przesuwane (kopiowane w prawo), a wstawiona karta trafia na miejsce jeden raz.','Zmień listę na [1, 2, 3, 4] i policz, ile razy wykona się przesunięcie (0 — lista już posortowana).'),
   activities:[
    {type:'pythonLab',id:'ci-trace',mode:'trace',points:0,file:'karty.py',title:'Wstawianie kart [7, 3, 5, 1]',
     prompt:'Klikaj „Krok dalej”. Na liście zobaczysz, gdzie są i oraz j. Tabela pokazuje zmienne w tej chwili — przed wykonaniem podświetlonej linii.',
     code:'karty = [7, 3, 5, 1]\nfor i in range(1, len(karty)):\n    karta = karty[i]                # biorę kartę do ręki\n    j = i - 1\n    while j >= 0 and karty[j] > karta:\n        karty[j + 1] = karty[j]     # większą kartę przesuwam w prawo\n        j -= 1\n    karty[j + 1] = karta            # wkładam kartę w lukę\nprint(karty)\n',
     listVars:['karty'],pointers:[{var:'i'},{var:'j'}],
     questions:[
      {q:'Jak wygląda lista po wstawieniu karty 3 (koniec obrotu dla i = 1)?',options:['`[3, 7, 5, 1]`','`[7, 3, 5, 1]`','`[3, 5, 7, 1]`','`[1, 3, 5, 7]`'],correct:[0],explain:'3 jest mniejsze od 7, więc 7 przesuwa się w prawo, a 3 trafia na początek: [3, 7, 5, 1]. Reszta listy jeszcze czeka.',hint:'Idź krokami, aż i zmieni się na 2 — wtedy spójrz na listę.'},
      {q:'Ile razy wykona się przesunięcie karty[j + 1] = karty[j] przy wstawianiu ostatniej karty (1)?',answer:'3',inputLabel:'Liczba przesunięć',explain:'1 jest mniejsze od 7, 5 i 3 — wszystkie trzy przesuwają się w prawo, a 1 trafia na początek.',hint:'Najmniejsza karta musi przejść na sam początek. Ile kart stoi przed nią?'},
      {q:'Po co w warunku while jest j >= 0?',options:['Żeby nie wyjść przed początek listy, gdy wstawiana karta jest najmniejsza','Żeby program działał szybciej','Żeby sortować malejąco','Nie jest potrzebny — bez niego działa tak samo'],correct:[0],explain:'Gdy wstawiamy najmniejszą kartę, j schodzi do −1. W Pythonie karty[-1] to ostatni element listy — bez tego warunku program porównywałby kartę z końcem listy i psuł wynik.',hint:'Jaką wartość ma j po przesunięciu wszystkich kart przy wstawianiu 1?'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Ułóż sortowanie przez wstawianie',grouping:'solo',
   intro:'Ułóż z linii funkcję wstawianie(lista). Pilnuj wcięć: for → while → dwie linie w środku while. Jedna linia to pułapka.',
   ...note(8,'Samodzielna praca. Najczęstszy błąd to wcięcie lista[j + 1] = karta — musi być w pętli for, ale POZA while. Pułapka: lista[j] = karta (wstawia o jedno miejsce za daleko w lewo). Gdy ktoś utknie, zapytaj: „kiedy wkładasz kartę — po każdym przesunięciu, czy raz, na końcu?”.','Dlaczego lista[j + 1] = karta jest poza pętlą while?','Bo kartę wkładamy raz, gdy while się skończy i znamy już lukę. W środku while przesuwamy tylko większe karty.','Zamiana kolejności lista[j + 1] = lista[j] i j -= 1 (przesunięcie złej karty) oraz return lista wcięty w pętli.','Zapytaj: czy linie karta = lista[i] i j = i - 1 można zamienić miejscami? (Tak — nie zależą od siebie. Testy to potwierdzą.)'),
   activities:[
    {type:'pythonLab',id:'ci-parsons',mode:'parsons',points:4,file:'wstawianie.py',title:'Układanka: wstawianie(lista)',
     prompt:'Ułóż funkcję sortującą rosnąco przez wstawianie. ↑ ↓ zmieniają kolejność, ← → wcięcie.',
     solution:WSTAWIANIE,distractors:['lista[j] = karta'],
     tests:[
      {call:'wstawianie([7, 3, 5, 1])',expected:'[1, 3, 5, 7]'},
      {call:'wstawianie([2, 1])',expected:'[1, 2]'},
      {call:'wstawianie([5, 5, 1])',expected:'[1, 5, 5]',label:'Powtórzone liczby'},
      {call:'wstawianie([1, 2, 3, 4])',expected:'[1, 2, 3, 4]',label:'Już posortowane'},
      {call:'wstawianie([])',expected:'[]',label:'Pusta lista'},
      {call:'wstawianie([9, 8, 7, 6, 5])',expected:'[5, 6, 7, 8, 9]',label:'Odwrotna kolejność'}
     ],
     hints:['Po `def` jest pętla `for i in range(1, len(lista)):` — zaczynamy od 1, bo pierwsza karta już „leży” na miejscu.','W for: najpierw `karta = …` i `j = …`, potem `while …:`. W while dwie linie: przesunięcie i `j -= 1`.','`lista[j + 1] = karta` ma to samo wcięcie co `while` (2 poziomy), a `return lista` — 1 poziom.']}
   ]},
  {id:'debug',label:'Napraw kod',title:'Warsztat: napraw zepsute sortowanie',grouping:'solo',
   intro:'Trzy wersje programu, każda z jednym błędem, jaki robi prawie każdy programista. Uruchom, przeczytaj testy i komunikaty, znajdź błąd i popraw jedną linię. Kolejny poziom odblokuje się po naprawieniu poprzedniego.',
   reading:{title:'Jak szukać błędu?',paragraphs:[
    'Najpierw uruchom i porównaj wynik z oczekiwanym. Test mówi, dla jakich danych program się myli — wybierz najkrótszy nieudany test i policz go w pamięci (albo na kartce), linia po linii.',
    'Pętla nieskończona to program, który nigdy się nie kończy — najczęściej w while zmienna z warunku się nie zmienia. Tu środowisko zatrzyma program po 3 sekundach. W prawdziwej aplikacji taki błąd zawiesza program albo „zjada” baterię telefonu.'
   ]},
   ...note(12,'Mastery learning z feedbackiem: uczniowie pracują w swoim tempie, poziomy odblokowują się po kolei. Po ok. 5 minutach zatrzymaj klasę przy błędzie 2 (pętla nieskończona): „co się stało, gdy kliknęliście Uruchom?” — zbierz wniosek, że while bez zmiany j się nie kończy. Szybsi uczniowie pomagają innym tylko pytaniami („jaką wartość ma j w tej chwili?”).','Który z trzech błędów był najtrudniejszy do znalezienia i jak go znalazłeś?','Zwykle błąd 1 (j > 0) — program działa prawie dobrze, psuje się tylko wtedy, gdy karta ma trafić na sam początek listy. Pomaga test z liczbą, która musi przejść na początek.','Poprawianie kilku linii naraz „na chybił trafił”, zamiast jednej. Dopisanie j -= 1 poza pętlą while (nadal pętla nieskończona).','Poproś szybkich uczniów, żeby zasiali w kodzie własny błąd i dali go sąsiadowi do znalezienia.'),
   activities:[
    {type:'pythonLab',id:'ci-bug1',mode:'code',points:3,file:'bug1.py',title:'Błąd 1: najmniejsza liczba nie chce na początek',
     prompt:'Program sortuje prawie dobrze, ale nie zawsze. Uruchom go i porównaj wynik z komentarzem. Który warunek blokuje przesunięcie na sam początek listy?',
     starter:bug('while j >= 0','while j > 0')+'\n\nprint(wstawianie([3, 1, 2]))    # powinno być [1, 2, 3]\n',
     solution:WSTAWIANIE+'\n\nprint(wstawianie([3, 1, 2]))    # powinno być [1, 2, 3]\n',
     tests:[
      {call:'wstawianie([3, 1, 2])',expected:'[1, 2, 3]'},
      {call:'wstawianie([2, 1])',expected:'[1, 2]',label:'Mniejsza liczba musi przejść na początek'},
      {call:'wstawianie([5, 4, 3, 2, 1])',expected:'[1, 2, 3, 4, 5]'},
      {call:'wstawianie([1, 2, 3])',expected:'[1, 2, 3]'}
     ],
     hints:['Najprostszy nieudany test: [2, 1]. Dla i = 1 zmienna j = 0. Czy warunek while jest wtedy spełniony?','Pierwszy element listy ma indeks 0. Warunek musi dopuszczać j równe 0.','Popraw `while j > 0` na `while j >= 0`.']},
    {type:'pythonLab',id:'ci-bug2',mode:'code',points:3,file:'bug2.py',title:'Błąd 2: program się zawiesza',loops:true,requires:'ci-bug1',requiresTitle:'Błąd 1',
     prompt:'Uruchom program. Nie działa w nieskończoność tylko dlatego, że środowisko zatrzyma go po 3 sekundach. Dlaczego pętla while nigdy się nie kończy?',
     starter:bug('            j -= 1\n','')+'\n\nprint(wstawianie([4, 2, 3]))    # powinno być [2, 3, 4]\n',
     solution:WSTAWIANIE+'\n\nprint(wstawianie([4, 2, 3]))    # powinno być [2, 3, 4]\n',
     tests:[
      {call:'wstawianie([4, 2, 3])',expected:'[2, 3, 4]'},
      {call:'wstawianie([2, 1])',expected:'[1, 2]'},
      {call:'wstawianie([6, 5, 4, 3])',expected:'[3, 4, 5, 6]'}
     ],
     hints:['W warunku while są j i lista[j]. Czy któraś z tych rzeczy zmienia się w środku pętli?','Po przesunięciu karty trzeba cofnąć się o jedno miejsce w lewo.','Pod linią `lista[j + 1] = lista[j]`, z tym samym wcięciem, dopisz `j -= 1`.'],
     questions:[
      {q:'Dlaczego program się zawiesił?',options:['Zmienna j się nie zmieniała, więc warunek while był zawsze prawdziwy','Lista była za długa dla Pythona','Komputer był za wolny','Zabrakło return na końcu funkcji'],correct:[0],explain:'Warunek while sprawdza j i lista[j]. Skoro j stało w miejscu, a lista[j] zostawało większe od karty, pętla kręciła się bez końca.',hint:'Co musi się zmieniać, żeby warunek pętli kiedyś stał się fałszywy?'}
     ]},
    {type:'pythonLab',id:'ci-bug3',mode:'code',points:3,file:'bug3.py',title:'Błąd 3: karta ląduje w złym miejscu',requires:'ci-bug2',requiresTitle:'Błąd 2',
     prompt:'Tym razem program kończy się szybko, ale wynik jest dziwny — niektóre liczby się powtarzają, a inne znikają. Prześledź na kartce najkrótszy nieudany test.',
     starter:bug('        lista[j + 1] = karta','        lista[j] = karta')+'\n\nprint(wstawianie([7, 3, 5, 1]))    # powinno być [1, 3, 5, 7]\n',
     solution:WSTAWIANIE+'\n\nprint(wstawianie([7, 3, 5, 1]))    # powinno być [1, 3, 5, 7]\n',
     tests:[
      {call:'wstawianie([7, 3, 5, 1])',expected:'[1, 3, 5, 7]'},
      {call:'wstawianie([2, 1])',expected:'[1, 2]'},
      {call:'wstawianie([1, 3, 2])',expected:'[1, 2, 3]'},
      {call:'wstawianie([1, 2])',expected:'[1, 2]',label:'Już posortowane'}
     ],
     hints:['Po pętli while j wskazuje kartę, która jest MNIEJSZA od wstawianej (albo j = −1). Czy karta ma trafić na miejsce j?','Luka po przesunięciach jest o jedno miejsce na prawo od j.','Popraw `lista[j] = karta` na `lista[j + 1] = karta`.'],
     summary:'Naprawione: wszystkie 3 błędy'}
   ]},
  {id:'compare',label:'Porównanie',title:'Wyścig: wstawianie kontra bąbelkowe',grouping:'solo',
   intro:'Który algorytm jest szybszy? Program liczy porównania obu algorytmów na 100 liczbach: losowych i prawie posortowanych. Uruchom go, przepisz wyniki do tabelki i wyciągnij wniosek.',
   reading:{title:'Mierzymy, zamiast zgadywać',paragraphs:[
    'Czas działania zależy od komputera, dlatego informatycy liczą operacje — tu porównania dwóch liczb. Dla 100 liczb sortowanie bąbelkowe zawsze robi 99 + 98 + … + 1 = 4950 porównań.',
    'Wstawianie przesuwa kartę tylko tak daleko, jak trzeba. Gdy lista jest prawie posortowana, prawie każda karta od razu zostaje na miejscu. Tak jest np. w rankingu, do którego dochodzi jeden nowy wynik — dlatego wstawianie jest częścią algorytmu Timsort, którego używa sorted() w Pythonie.'
   ]},
   ...note(9,'Uczniowie uruchamiają gotowy program (nie muszą go rozumieć w całości — wskaż tylko liczniki porownania += 1) i wpisują wyniki. Na koniec zbierz wniosek na forum. Dane są „losowe”, ale z ustalonym ziarnem (seed), więc każdy ma te same liczby — łatwo sprawdzić odpowiedzi.','Dlaczego sortowanie bąbelkowe zrobiło tyle samo porównań na obu listach?','Bo zawsze porównuje wszystkie pary: 99 + 98 + … + 1 = 4950 — niezależnie od danych (wersja bez flagi).','Uczniowie wpisują liczby z niewłaściwej kolumny. Poproś, żeby czytali nagłówek tabeli.','Zmień 100 na 1000 w kodzie (range(1000)) i porównaj: bąbelkowe rośnie ok. 100 razy (n²), wstawianie na prawie posortowanej — ok. 10 razy.',true),
   activities:[
    {type:'pythonLab',id:'ci-compare',mode:'code',points:1,file:'wyscig.py',title:'Licznik porównań: 100 liczb',timeoutMs:6000,
     prompt:'Kliknij „Uruchom” i odczytaj tabelkę na konsoli. Potem odpowiedz na pytania.',
     starter:COMPARE,successText:'Wyniki są na konsoli poniżej — przepisz je do pytań.',
     questions:[
      {q:'Ile porównań wykonało sortowanie przez wstawianie na liście prawie posortowanej?',answer:'103',inputLabel:'Porównania',explain:'Tylko 103 — prawie każda karta od razu zostaje na miejscu (jedno porównanie), a kilka przesuwa się o jedno pole.',hint:'Wiersz „prawie posortowana”, kolumna „wstawianie”.'},
      {q:'Ile porównań wykonało sortowanie bąbelkowe na liście prawie posortowanej?',answer:'4950',inputLabel:'Porównania',explain:'4950 = 99 + 98 + … + 1 — bąbelkowe bez flagi zawsze porównuje wszystkie pary.',hint:'Wiersz „prawie posortowana”, kolumna „bąbelkowe”.'},
      {q:'Wniosek: kiedy sortowanie przez wstawianie wygrywa najbardziej?',options:['Gdy dane są prawie posortowane, np. do rankingu dochodzi jeden nowy wynik','Gdy dane są zupełnie losowe','Nigdy — oba algorytmy zawsze robią tyle samo','Tylko dla list krótszych niż 5 liczb'],correct:[0],explain:'Na prawie posortowanych danych wstawianie zrobiło ok. 48 razy mniej porównań (103 zamiast 4950). Na losowych też wygrało (2612), ale już nie tak wyraźnie.',hint:'Porównaj oba wiersze tabeli.'}
     ],
     summary:'Wyścig: wstawianie 103, bąbelkowe 4950 porównań'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań, śledzenia, układanki, naprawionych błędów i wyścigu algorytmów. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Zbierz wnioski: wstawianie = karty w ręce, while musi zmieniać zmienną z warunku, prawie posortowane dane → wstawianie. Zadaj pytanie na wyjście. Zapowiedź: następna lekcja — ciągi liczb i Fibonacci, czyli ile uzbierasz, odkładając co miesiąc.','Dlaczego wstawianie przydaje się, gdy do posortowanego rankingu dochodzi jeden nowy wynik?','Bo reszta listy jest już posortowana — nowy wynik wystarczy przesunąć w lewo na swoje miejsce, zamiast sortować wszystko od nowa.','„Wstawianie jest zawsze szybsze” — dla losowych, dużych danych oba są wolne (n²); stosuje się wtedy szybsze metody, np. sortowanie przez scalanie.','Zapytaj: jak zmienić jeden znak, żeby wstawianie sortowało malejąco? (lista[j] < karta).'),
   activities:[{type:'resultCard',id:'result',title:'Wstawianie i debugowanie — wynik',sources:['ci-r1','ci-r2','ci-trace','ci-parsons','ci-bug1','ci-bug2','ci-bug3','ci-compare'],badges:[
    {min:0,name:'Tasuje, ale jeszcze nie układa',text:'Karty w ręce masz, algorytm się jeszcze układa. Wróć do śledzenia — krok po kroku widać wszystko.'},
    {min:0.5,name:'Łowca bugów',text:'Błędy same się nie naprawiły — Ty to zrobiłeś. Tak wygląda prawdziwa praca programisty.'},
    {min:0.85,name:'Debugger w ludzkiej postaci',text:'Pętla nieskończona? Nie z Tobą. Kod działa, a Ty wiesz dlaczego.'}
   ]}]}
 ],
 exitTicket:'Umiesz napisać sortowanie przez wstawianie, znajdujesz błędy dzięki testom i wiesz, że pętla while musi zmieniać zmienną z warunku. Wiesz też, kiedy wstawianie wygrywa: gdy dane są prawie posortowane.'
};
