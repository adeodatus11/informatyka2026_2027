import {note, choice, reveal} from '../schema.js';

export default {
 id:'18',grade:2,title:'Algorytmy porządkowania liczb',
 subtitle:'Ranking w grze, ceny od najtańszej, playlista od najnowszej — sprawdź, czy posortujesz szybciej niż komputer.',
 topic:'Algorytmy porządkowania liczb',icon:'sort',tags:['Porównanie','Zamiana','n²'],duration:45,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): algorytmy porządkowania ciągu liczb — metoda bąbelkowa i przez wstawianie, porównanie liczby operacji; wprowadzenie do lekcji 19–20 (sortowanie w Pythonie)',
 format:{
  name:'Najpierw sam, potem algorytm + wyzwanie „pokonaj algorytm”',
  student:'Najpierw sortujesz 8 kart po swojemu i próbujesz pokonać komputer. Potem oglądasz krok po kroku, jak robią to dwa algorytmy, i przewidujesz ich ruchy. Na koniec wyścig na 1000 liczb. Efekt: Twój wynik kontra algorytm i punkty na karcie.',
  teacher:'Schemat odkrywania: uczniowie najpierw mierzą się z problemem sami (runda z odkrytymi kartami, potem z zakrytymi — tylko porównania i zamiany, jak komputer), dopiero potem poznają algorytmy. Bąbelkowe i wstawianie to nauczanie jawne z przykładem rozwiązanym krok po kroku (odtwarzacz), po którym uczniowie przewidują stan listy na innych danych. W wyścigu odkrywają n² i przewagę wstawiania na danych prawie posortowanych. Pseudokod na końcu to pomost do Pythona. Twoja rola: prowadzisz ranking „pokonaj algorytm” na tablicy i dopytujesz „skąd wiesz?”.',
  grouping:'Całość samodzielnie, każdy na swoim urządzeniu — wyniki porównujecie na tablicy. Sąsiedzi mogą się naradzać przy pytaniach. Nie ma pracy w parach, więc nieparzysta liczba osób nie jest problemem.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:[
  'Porządkuję listę liczb, używając tylko porównań i zamian, i liczę wykonane operacje.',
  'Opisuję krok po kroku sortowanie bąbelkowe i przez wstawianie oraz przewiduję stan listy po kolejnym kroku.',
  'Wyjaśniam, dlaczego 10 razy więcej danych to około 100 razy więcej porównań (n²) i kiedy wstawianie wygrywa.',
  'Układam pseudokod sortowania bąbelkowego.'
 ],
 materials:['Przeglądarka — jedno urządzenie na osobę','Projektor do pokazania odtwarzacza krok po kroku','Tablica na ranking „pokonaj algorytm” (liczba porównań w rundzie 2)','Opcjonalnie: talia kart do gry do pokazania wstawiania na żywo'],
 teacherGuide:{
  preparation:'Narysuj na tablicy tabelkę „Pokonaj algorytm: imię — porównania w rundzie 2”, obok wpisz: bąbelkowe 28, wstawianie 22. Klucz: runda 1 — minimum 14 zamian; bąbelkowe na 6 liczbach z przykładu: 15 porównań, 9 zamian; wstawianie: 12 porównań, 9 przesunięć. Przewidywania: po 1. przejściu 25, 40, 10, 35, 60; 5 porównań w 1. przejściu dla 6 liczb; 15 łącznie; wstawienie 27 do 12, 34, 51 — 3 porównania; lista 50, 20, 40, 10, 30 po dwóch krokach: 20, 40, 50, 10, 30; posortowana lista 6 liczb — 5 porównań. Wyścig: 45 → 4950 → 499 500 porównań bąbelkowego.',
  summary:'Uczeń sortuje karty samymi porównaniami i zamianami, przewiduje przebieg bąbelkowego (największa wypływa na koniec przejścia) i wstawiania (karty w ręce), liczy porównania n(n − 1)/2 i wie, że wstawianie jest bardzo szybkie na danych prawie posortowanych. Karta wyniku: maks. 28 pkt i produkt „Ty vs algorytm”. Pytanie na wyjście: ile porównań zrobi bąbelkowe dla 20 liczb? (190).'
 },
 sections:[
  {id:'start',label:'Start',title:'Kto posortuje szybciej: Ty czy komputer?',grouping:'class',
   intro:'Ranking w grze, ceny od najtańszej, playlista od najnowszej — za każdym sortowaniem stoi algorytm. Za chwilę posortujesz 8 kart i sprawdzisz, czy zrobisz to mniejszą liczbą ruchów niż komputer. Najpierw dwa pytania bez notatek.',
   reading:{title:'Co robi komputer, gdy sortuje?',paragraphs:[
    'Komputer nie „widzi” całej listy naraz, jak Ty kart na stole. Umie tylko dwie rzeczy: porównać dwie liczby (która większa?) i zamienić je miejscami. Algorytm sortowania to przepis, w jakiej kolejności to robić.',
    'Dobry przepis oszczędza czas: dla miliona produktów w sklepie różnica między słabym a dobrym algorytmem to sekundy albo… dni. Dziś policzysz to sam.'
   ]},
   ...note(4,'Hak: zapytaj, ile razy dziś coś posortowali (ranking, ceny, wiadomości od najnowszej). Potem 2 minuty na dwa pytania powtórkowe bez notatek; omów szybko pytanie o Accessa — to most do dzisiejszego tematu: Access sortował za nas, dziś zobaczymy jak.','Co musi umieć komputer, żeby ułożyć liczby od najmniejszej?','Porównać dwie liczby i zamienić je miejscami — i mieć przepis, w jakiej kolejności to robić.','Uczniowie myślą, że komputer „od razu widzi” najmniejszą liczbę. Musi ją znaleźć porównaniami.','Zapytaj, ile porównań trzeba, żeby znaleźć najmniejszą z 8 kart (7 — każda kolejna karta porównana z dotychczasowym minimum).'),
   activities:[
    choice('l18-r1','Powtórka z lekcji 16: jak zaszyfrujesz słowo ALA szyfrem Cezara z kluczem 3?',['DOD','BMB','XIX'],[0],'A + 3 = D, L + 3 = O. ALA → DOD. Szyfr też był algorytmem: ten sam przepis dla każdej litery.','Przesuń każdą literę o 3 w prawo: A → B, C, D.'),
    choice('l18-r2','Powtórka z lekcji 11: w kwerendzie ustawiasz „Sortuj: Rosnąco” w polu nazwisko. Co zrobi Access?',['Pokaże rekordy od A do Z według nazwiska','Usunie rekordy bez nazwiska','Pokaże tylko pierwsze nazwisko z listy'],[0],'Access posortuje wynik rosnąco. Robi to algorytm sortowania — dziś zobaczysz, jak takie algorytmy działają w środku.','Sortowanie zmienia kolejność, nie usuwa danych.'),
    reveal('l18-where',[
     {title:'Ranking w grze',icon:'trophy',short:'od najlepszego',text:'Po każdym meczu kilka wyników się zmienia, a reszta rankingu stoi w miejscu. To dane „prawie posortowane” — zapamiętaj, przydadzą się w wyścigu.'},
     {title:'Sklep internetowy',icon:'search',short:'cena rosnąco',text:'Kliknięcie „od najtańszych” sortuje tysiące produktów w ułamku sekundy. Bez dobrego algorytmu czekałbyś na wynik jak na autobus.'},
     {title:'Arkusz i baza',icon:'table',short:'A→Z',text:'Przycisk „Sortuj od A do Z” w Excelu i „Sortuj” w kwerendzie Accessa to gotowe algorytmy. Programista też ich nie pisze od zera — ale musi rozumieć, ile kosztują.'}
    ])
   ]},
  {id:'manual',label:'Pokonaj algorytm',title:'Pokonaj algorytm: 8 kart',grouping:'solo',
   intro:'Runda 1: widzisz liczby — ułóż je samymi zamianami sąsiadów. Runda 2: karty są zakryte, jak dla komputera. Możesz je tylko porównywać na „wadze” i zamieniać. Algorytm bąbelkowy potrzebuje 28 porównań. Dasz radę mniej?',
   ...note(10,'Runda 1 trwa ok. 2 minuty — uczniowie odkrywają, że zamian nie da się zrobić mniej niż 14 (tyle par stoi w złej kolejności). Runda 2 to sedno: bez widoku liczb trzeba planować porównania i zapisywać wyniki (symulator pokazuje notatki z wagi). Wpisuj na tablicy wyniki rundy 2. Po 8 minutach zapytaj 2–3 osoby z najlepszymi wynikami, jaką miały strategię — często odkrywają wstawianie („brałem kolejną kartę i szukałem jej miejsca”).','Jaką strategię miała osoba, która zrobiła najmniej porównań?','Zwykle: układanie kart po kolei od lewej i wstawianie każdej nowej w odpowiednie miejsce wśród już ułożonych — to właśnie sortowanie przez wstawianie.','Porównywanie kart, które nie są sąsiadami, a potem próba zamiany (można zamieniać tylko sąsiednie). Zapominanie wyników porównań i porównywanie tej samej pary kilka razy. Klikanie „Sprawdź” na ślepo — każde nieudane sprawdzenie kosztuje 7 porównań.','Dla najszybszych: czy istnieje sposób, który ZAWSZE posortuje 8 kart w mniej niż 16 porównaniach? (Nie — 8 kart można ułożyć na 40 320 sposobów, a 15 porównań typu tak/nie rozróżnia najwyżej 2¹⁵ = 32 768 przypadków).'),
   activities:[{type:'sortLab',id:'sort-manual',mode:'manual',points:6,label:'Pokonaj algorytm: 2 rundy'}]},
  {id:'bubble',label:'Bąbelkowe',title:'Sortowanie bąbelkowe: największa wypływa na koniec',grouping:'solo',
   intro:'Obejrzyj przykład krok po kroku — nauczyciel pokaże pierwsze przejście. Potem przewiduj, co algorytm zrobi z innymi liczbami.',
   reading:{title:'Jak działa sortowanie bąbelkowe?',paragraphs:[
    'Idziesz od lewej do prawej i porównujesz sąsiadów. Jeśli lewa liczba jest większa, zamieniasz je. Po jednym przejściu największa liczba jest na końcu. Następne przejście może być o jedną parę krótsze.',
    'Dla n liczb wersja podstawowa robi n − 1 przejść i (n − 1) + (n − 2) + … + 1 = n(n − 1)/2 porównań. Dla 6 liczb: 15. Liczba zamian zależy od tego, jak bardzo lista jest „pomieszana”.'
   ],example:{question:'Przykład rozwiązany: 1. przejście dla 34, 12, 51, 8.',answer:'34 > 12 → zamiana: 12, 34, 51, 8. 34 < 51 → bez zmian. 51 > 8 → zamiana: 12, 34, 8, 51. Po 3 porównaniach największa (51) jest na końcu.'}},
   ...note(9,'Nauczanie jawne: na projektorze przeklikaj z klasą pierwsze przejście (5 kroków), komentując na głos: „porównuję, zamieniam, idę dalej”. Zatrzymaj się na końcu przejścia i zapytaj, co jest pewne (największa na końcu). Resztę uczniowie mogą puścić w trybie Auto. Potem 3 pytania przewidujące na innych liczbach — najpierw sami, bez odtwarzacza.','Po ilu przejściach bąbelkowe na pewno skończy dla 6 liczb i dlaczego?','Po 5 (n − 1): każde przejście ustawia na końcu jedną kolejną największą liczbę, a ostatnia sama jest już na miejscu.','Przekonanie, że po jednym przejściu lista jest posortowana. Liczenie porównań jako liczby elementów (6) zamiast par sąsiadów (5).','Zapytaj: jak przyspieszyć bąbelkowe, gdy w całym przejściu nie było żadnej zamiany? (Można zakończyć — lista jest już posortowana. Taką ulepszoną wersję napiszesz w Pythonie).'),
   activities:[{type:'sortLab',id:'sort-bubble',mode:'bubble',points:6,label:'Bąbelkowe: 3 przewidywania'}]},
  {id:'insertion',label:'Wstawianie',title:'Sortowanie przez wstawianie: karty w ręce',grouping:'solo',
   intro:'Tak układasz karty w grze: bierzesz następną i wsuwasz ją na miejsce wśród tych, które już trzymasz. Obejrzyj przykład na tych samych liczbach i przewiduj.',
   reading:{title:'Jak działa sortowanie przez wstawianie?',paragraphs:[
    'Lewa część listy to „karty w ręce” — zawsze posortowane. Bierzesz pierwszą kartę ze stołu i porównujesz ją z kartami w ręce od prawej. Dopóki jest mniejsza, przesuwasz ją w lewo. Gdy trafisz na mniejszą — zostawiasz.',
    'Jeśli lista jest już prawie posortowana, prawie każda karta od razu „pasuje” — wystarczy 1 porównanie. Dlatego wstawianie świetnie radzi sobie z rankingiem, do którego dopisano kilka wyników.'
   ],example:{question:'Przykład rozwiązany: w ręce 12, 34, 51, bierzesz 8.',answer:'8 < 51 → przesuń, 8 < 34 → przesuń, 8 < 12 → przesuń. Doszła na początek: 8, 12, 34, 51. 3 porównania, 3 przesunięcia.'}},
   ...note(8,'Jeśli masz talię kart, pokaż wstawianie na żywo na 5 kartach. Potem odtwarzacz na tych samych liczbach co w bąbelkowym — zwróć uwagę na liczniki: 12 porównań zamiast 15, zamian tyle samo (9). Uczniowie odpowiadają na 3 pytania; ostatnie (lista już posortowana) jest kluczem do wyścigu.','Dlaczego na tych samych danych wstawianie zrobiło mniej porównań niż bąbelkowe, choć zamian było tyle samo?','Bo wstawianie przerywa porównywanie, gdy karta trafi na mniejszą. Bąbelkowe w wersji podstawowej zawsze sprawdza wszystkie pary w każdym przejściu.','Mylenie etapów: uczniowie myślą, że wstawianie porządkuje od razu całą listę, a nie tylko karty w ręce. Porównywanie nowej karty od lewej zamiast od prawej (też działa, ale nie tak liczymy).','Zapytaj: jaka lista jest najgorsza dla wstawiania? (Odwrotnie posortowana — każda karta wędruje na sam początek; wtedy też 15 porównań dla 6 liczb).'),
   activities:[{type:'sortLab',id:'sort-insertion',mode:'insertion',points:6,label:'Wstawianie: 3 przewidywania'}]},
  {id:'race',label:'Wyścig',title:'Wyścig na 1000 liczb i pseudokod',grouping:'solo',
   intro:'Na 8 kartach różnica jest mała. A na tysiącu liczb? Uruchom wyścig, wyciągnij wnioski, a na koniec ułóż algorytm bąbelkowy w pseudokodzie — na lekcji 19 zamienisz go w program.',
   reading:{title:'Dlaczego n² boli?',paragraphs:[
    'Bąbelkowe dla n liczb robi n(n − 1)/2 porównań — w przybliżeniu n²/2. Gdy danych jest 10 razy więcej, porównań jest mniej więcej 100 razy więcej. Mówimy, że algorytm ma złożoność kwadratową.',
    'Dla milionów danych używa się szybszych metod: sortowania przez scalanie (merge sort) albo quicksort. W praktyce programista korzysta z gotowej funkcji sort() swojego języka — ale musi wiedzieć, ile kosztuje sortowanie.'
   ]},
   ...note(9,'Poproś, by każdy uruchomił wyścig co najmniej dla 10, 100 i 1000 liczb losowych i dla 1000 prawie posortowanych. Zanim uruchomią 1000, zapytaj klasę: „ile porównań przewidujecie?” — niech zapiszą liczbę na kartce. Potem pytania z wnioskami i pseudokod. Jeśli brakuje czasu, pseudokod pokaż na projektorze i ułóżcie go wspólnie.','Ile porównań zrobi bąbelkowe dla 20 liczb i jak to policzyć bez komputera?','20 · 19 / 2 = 190. Albo: 19 + 18 + … + 1.','Myślenie liniowe: „10 razy więcej danych = 10 razy dłużej”. Przekonanie, że komputer jest tak szybki, że metoda nie ma znaczenia — przy milionie danych ma.','Zapytaj: ile czasu zajęłoby bąbelkowe dla miliona liczb, gdyby komputer robił miliard porównań na sekundę? (ok. 500 s, ponad 8 minut — a szybka metoda: kilka setnych sekundy).'),
   activities:[
    {type:'sortLab',id:'sort-race',mode:'race',points:6,label:'Wyścig: 3 wnioski'},
    {type:'sortLab',id:'sort-pseudo',mode:'pseudocode',points:2,label:'Pseudokod bąbelkowego'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: Ty kontra algorytm',grouping:'class',
   intro:'Punkty z całej lekcji i Twój pojedynek z algorytmem. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(5,'Pokaż na tablicy najlepsze wyniki rundy 2 i pogratuluj osobom, które pokonały bąbelkowe. Zadaj pytanie na wyjście o 20 liczb. Uczniowie wypełniają samoocenę i robią zdjęcie karty.','Która metoda wygra na rankingu w grze po dopisaniu 3 nowych wyników i dlaczego?','Wstawianie — dane są prawie posortowane, więc prawie każdy element wymaga tylko jednego porównania.','Uczniowie oceniają się tylko po wygranej z algorytmem. Podkreśl, że liczy się też umiejętność przewidzenia kroków i policzenia porównań.','Poproś chętnych o wyjaśnienie w 30 sekund sortowania bąbelkowego koledze, który był nieobecny (tutoring rówieśniczy).'),
   activities:[
    {type:'resultCard',id:'result-card',title:'Ty kontra algorytm — wynik',sources:['l18-r1','l18-r2','sort-manual','sort-bubble','sort-insertion','sort-race','sort-pseudo'],badges:[
     {min:0,name:'Karty w rozsypce',text:'Talia jeszcze nie słucha. Wróć do odtwarzacza i przeklikaj jedno przejście — potem pójdzie z górki.'},
     {min:0.5,name:'Bąbel w natarciu',text:'Porównujesz, zamieniasz, liczysz. Algorytm czuje Twój oddech na plecach.'},
     {min:0.85,name:'Pogromca n²',text:'Wiesz, ile kosztuje każde porównanie i kiedy wstawianie miażdży bąbelkowe. Python na lekcji 19 to dla Ciebie formalność.'}
    ]}
   ]}
 ],
 exitTicket:'Sortowanie to porównania i zamiany. Bąbelkowe robi n(n − 1)/2 porównań — 10 razy więcej danych to około 100 razy więcej pracy. Wstawianie jest świetne dla danych prawie posortowanych. Na lekcji 19 zapiszesz bąbelkowe w Pythonie.'
};
