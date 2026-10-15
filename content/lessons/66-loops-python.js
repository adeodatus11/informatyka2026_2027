import {note, choice} from '../schema.js';

// Klasa 1, temat 28. Pierwsza pętla: for z range, sumowanie, licznik, średnia, odliczanie.
// Bez funkcji (def) i bez list — dane z input(), testy podają różne dane wejściowe.

const SERIE = `for seria in range(1, 4):
    print("Seria", seria, "- 10 pompek")
print("Koniec treningu!")
`;

const RUNDY = `suma = 0
for runda in range(1, 5):
    punkty = runda * 10
    suma = suma + punkty
    print("Runda", runda, "- razem:", suma)
print("Wynik końcowy:", suma)
`;

const TRENING = `pompki = 10
suma = 0
for dzien in range(1, 8):
    print(f"Dzień {dzien}: {pompki} pompek")
    suma = suma + pompki
    pompki = pompki + 5
print(f"Razem w tygodniu: {suma} pompek")
`;
const TRENING_OUT = 'Dzień 1: 10 pompek\nDzień 2: 15 pompek\nDzień 3: 20 pompek\nDzień 4: 25 pompek\nDzień 5: 30 pompek\nDzień 6: 35 pompek\nDzień 7: 40 pompek\nRazem w tygodniu: 175 pompek';

const SREDNIA_OK = `ile = int(input("Ile masz ocen? "))
suma = 0
for i in range(ile):
    ocena = int(input("Ocena: "))
    suma = suma + ocena
srednia = suma / ile
print(f"Średnia: {srednia:.2f}")    # .2f = 2 miejsca po przecinku
`;
const SREDNIA_BUG = `ile = int(input("Ile masz ocen? "))
for i in range(ile):
    suma = 0
    ocena = int(input("Ocena: "))
    suma = suma + ocena
srednia = suma / ile
print(f"Średnia: {srednia:.2f}")    # .2f = 2 miejsca po przecinku
`;

const ODLICZ_START = `dni = int(input("Ile dni do wakacji? "))
# ← tu pętla for: wypisz „Do wakacji: …” od dni w dół do 1

print("Wakacje!")
`;
const ODLICZ = `dni = int(input("Ile dni do wakacji? "))
for d in range(dni, 0, -1):
    print("Do wakacji:", d)

print("Wakacje!")
`;

const MVP_START = `rundy = int(input("Ile rund? "))
suma = 0
mvp = 0
for r in range(rundy):
    pkt = int(input("Punkty w rundzie: "))
    # ← tu: dodaj pkt do sumy
    # ← tu: jeśli pkt >= 100, zwiększ licznik mvp o 1
print("Suma punktów:", suma)
print("Rundy MVP (100+):", mvp)
`;
const MVP = `rundy = int(input("Ile rund? "))
suma = 0
mvp = 0
for r in range(rundy):
    pkt = int(input("Punkty w rundzie: "))
    suma = suma + pkt
    if pkt >= 100:
        mvp = mvp + 1
print("Suma punktów:", suma)
print("Rundy MVP (100+):", mvp)
`;

export default {
 id:'66',grade:1,order:28,title:'Algorytmy iteracyjne w języku Python',
 subtitle:'Średnia ocen, punkty w grze, odliczanie do wakacji: jedna pętla zrobi to, na co trzeba by stu linii z print.',
 topic:'Pętla for z range: powtarzanie, suma, licznik, średnia, odliczanie',icon:'reset',tags:['pętla for','suma i licznik','średnia ocen'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.1 (algorytm z powtarzaniem kroków), I.3 (sprawdzanie poprawności dla przykładowych danych, śledzenie zmiennych), II.1 (pętla for, wyrażenia arytmetyczne, wejście/wyjście), II.2 (Python w przeglądarce)',
 format:{
  name:'Zobacz → prześledź → ułóż → napraw → napisz',
  student:'Najpierw zgadujesz, co wypisze krótka pętla, i oglądasz ją krok po kroku. Potem układasz plan treningu z rozsypanych linii, naprawiasz kalkulator średniej i piszesz dwa własne programy: odliczanie do wakacji i licznik rund MVP.',
  teacher:'Nauczanie jawne: na projektorze modelujesz jedną pętlę i mówisz na głos, co dzieje się w każdym obrocie („runda = 1, punkty = 10, suma = 0 + 10…”). Potem uczniowie śledzą ten sam program sami i odpowiadają na pytania. Przy przewidywaniu zaznaczają pewność — po porównaniu zapytaj, kto był pewny i się pomylił (metapoznanie: co mnie zmyliło?). Dalej wsparcie maleje: układanka (linie gotowe), poprawka jednej linii, a na końcu pisanie z komentarzem w kodzie. Feedback daje Python: testy pokazują, dla jakich ocen średnia wychodzi źle.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Opcjonalnie para przy śledzeniu (etap 2): wspólnie przewidujecie, ale odpowiedzi każdy wpisuje u siebie.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Przewiduję, ile razy wykona się pętla for z range i co wypisze.','Liczę w pętli sumę i średnią: zmienna suma zaczyna od 0 PRZED pętlą.','Używam licznika: zmiennej, która rośnie o 1, gdy coś się zdarzy.','Piszę odliczanie z range(start, stop, -1).'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor do modelowania pętli (etap 2).','Tablica: range(1, 4) → 1, 2, 3 (bez 4!); range(3) → 0, 1, 2.'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: przewidywanie — Seria 1/2/3 - 10 pompek i „Koniec treningu!”; śledzenie — suma po rundzie 3 = 60, linia z sumą 4 razy, suma = 0 w pętli → wynik 40; trening — 10, 15 … 40 pompek, razem 175; średnia 5, 4, 3 → 4.00, z błędem 1.00; 2, 3, 5, 4 → 3.50; odliczanie 3 → 3, 2, 1, Wakacje!; MVP 120, 80, 100, 30 → suma 330, 2 rundy.',
  summary:'Uczeń przewiduje i śledzi pętlę, układa plan treningu, naprawia średnią i pisze odliczanie oraz licznik MVP. Karta wyniku: maks. 24 pkt. Pytanie na wyjście: gdzie stawiasz suma = 0 i dlaczego?'
 },
 sections:[
  {id:'start',label:'Start',title:'Sto pompek, sto linii kodu?',grouping:'class',
   intro:'Plan treningu: 7 dni, codziennie o 5 pompek więcej. Można napisać 7 linii z print. A plan na 100 dni? Komputer jest od tego, żeby powtarzać. Najpierw dwa pytania z lekcji o elif, bez notatek.',
   reading:{title:'Pętla = powtarzanie',paragraphs:['Pętla for powtarza linie z wcięciem tyle razy, ile wartości daje range. range(1, 4) daje 1, 2, 3 — bez 4. range(3) daje 0, 1, 2.','Zmienna za słowem for (np. seria, dzien) w każdym obrocie ma kolejną wartość. Dzięki temu jedna linia print wypisze „Seria 1”, „Seria 2”, „Seria 3”.']},
   ...note(5,'Hak: zapytaj, kto prowadzi plan treningu albo liczy średnią przed końcem semestru. Dwa pytania powtórkowe z lekcji o elif (temat 27) — samodzielnie. Omów to, które sprawiło więcej kłopotu.','Co zrobiłby program z samymi if dla 92 punktów, a co program z elif?','Z samymi if — wypisze 3 oceny, bo trzy warunki są prawdziwe. Z elif — tylko pierwszą prawdziwą (5).','Uczniowie myślą, że range(1, 4) daje też 4.','Zapytaj: ile liczb daje range(1, 101)? (100).'),
   activities:[
    choice('lp-r1','Powtórka z lekcji o elif: punkty = 80; if punkty >= 90: print("5") elif punkty >= 75: print("4") elif punkty >= 50: print("3"). Co pojawi się na ekranie?',['Tylko 4','4 i 3','5, 4 i 3','Nic'],[0],'80 ≥ 90? Nie. 80 ≥ 75? Tak → „4”. elif zatrzymuje się na pierwszym prawdziwym warunku, więc 3 już się nie wypisze.','Python idzie od góry i staje na pierwszym prawdziwym warunku.'),
    choice('lp-r2','Powtórka: dlaczego if kod = "LATO10": daje błąd?',['W warunku porównujemy przez ==, a = oznacza wpisanie wartości','Kod rabatowy musi być liczbą','Brakuje else','Tekst musi być bez cudzysłowów'],[0],'Pojedyncze = wpisuje wartość do zmiennej. W warunku porównujesz: if kod == "LATO10":.','Czym różni się wpisanie wartości od sprawdzenia?')
   ]},
  {id:'trace',label:'Zobacz pętlę',title:'Przewiduj i prześledź: serie i rundy',grouping:'solo',
   intro:'Dwa krótkie programy. W pierwszym wpisz, co wypisze, i zaznacz, jak jesteś pewna/pewny. W drugim przejdź pętlę krok po kroku — tak samo jak nauczyciel na projektorze.',
   reading:{title:'Suma w pętli: zaczynasz od 0',paragraphs:['Żeby zsumować punkty z rund, potrzebujesz zmiennej suma. Przed pętlą ustawiasz suma = 0, a w pętli dokładasz: suma = suma + punkty.','Linie z wcięciem pod for wykonują się w każdym obrocie. Linia bez wcięcia (print po pętli) wykona się raz, na końcu.'],example:{question:'Przykład rozwiązany: suma = 0, potem trzy obroty, w których dodajesz 10, 20 i 30. Ile wynosi suma?',answer:'Obrót 1: 0 + 10 = 10. Obrót 2: 10 + 20 = 30. Obrót 3: 30 + 30 = 60. Suma = 60.'}},
   ...note(10,'Modelowanie (nauczanie jawne): pokaż na projektorze pierwsze dwa obroty pętli z rundami i mów na głos: „runda = 1, punkty = 10, suma = 0 + 10 = 10”. Potem uczniowie przechodzą sami i odpowiadają na pytania. Przy przewidywaniu zapytaj, kto był „Na pewno” i się pomylił — co go zmyliło?','Ile razy wykona się print w pętli for seria in range(1, 4)?','3 razy — dla seria = 1, 2, 3. print po pętli (bez wcięcia) — raz.','Przewidywanie „Seria 4” albo wypisanie „Koniec treningu!” po każdej serii.','W śledzeniu kliknij „Zmień kod” i zmień range(1, 5) na range(1, 11). Ile wynosi wynik końcowy?'),
   activities:[
    {type:'pythonLab',id:'lp-predict',mode:'predict',points:2,file:'serie.py',title:'Trzy serie pompek',
     prompt:'Co wypisze ten program? `print` z przecinkami wstawia spacje między elementami.',
     code:SERIE,predictRows:4,
     explain:'`range(1, 4)` daje 1, 2, 3 — bez 4! print z wcięciem wykona się 3 razy. „Koniec treningu!” nie ma wcięcia, więc wypisze się raz, po pętli.'},
    {type:'pythonLab',id:'lp-trace',mode:'trace',points:0,file:'rundy.py',title:'Suma punktów krok po kroku',
     prompt:'Klikaj „Krok dalej” i obserwuj w tabeli, jak zmieniają się `runda`, `punkty` i `suma`.',
     code:RUNDY,
     questions:[
      {q:'Ile wynosi suma po rundzie 3?',answer:'60',inputLabel:'suma =',explain:'10 + 20 + 30 = 60. W rundzie 4 dojdzie 40 i wynik końcowy to 100.',hint:'Idź krokami, aż konsola pokaże „Runda 3”, i odczytaj sumę.'},
      {q:'Ile razy wykona się linia suma = suma + punkty?',answer:'4',inputLabel:'Liczba obrotów',explain:'range(1, 5) to 1, 2, 3, 4 — cztery obroty, cztery dodawania.',hint:'Policz liczby, które daje range(1, 5).'},
      {q:'Co by się stało, gdyby suma = 0 stało w pętli (z wcięciem, pod for)?',options:['Wynik końcowy byłby 40 — suma zerowałaby się w każdym obrocie','Wynik byłby taki sam: 100','Program zgłosiłby błąd','Wynik byłby 0'],correct:[0],explain:'W każdym obrocie suma wracałaby do 0, więc na końcu zostałyby tylko punkty z ostatniej rundy: 40. Dlatego start sumy stoi PRZED pętlą.',hint:'Możesz to sprawdzić: „Zmień kod”, przenieś suma = 0 pod for i prześledź.'}
     ]}
   ]},
  {id:'build',label:'Ułóż i napraw',title:'Ułóż plan treningu, napraw średnią',grouping:'solo',
   intro:'Najpierw ułożysz z rozsypanych linii plan treningu na tydzień. Potem dostaniesz kalkulator średniej ocen z jednym błędem — testy pokażą, gdzie szukać.',
   reading:{title:'Trzy części każdej pętli z sumą',paragraphs:['1. Start PRZED pętlą: suma = 0. 2. Zmiana W pętli (z wcięciem): suma = suma + coś. 3. Wynik PO pętli (bez wcięcia): print albo średnia.','Średnia = suma ocen podzielona przez ich liczbę. Oceny 5, 4 i 3: suma 12, średnia 12 / 3 = 4.']},
   ...note(11,'Samodzielnie. W układance dwie linie to pułapki: range(1, 7) (6 dni zamiast 7) i suma = pompki (nadpisanie zamiast dodawania). Przy średniej nie mów, gdzie jest błąd — niech uruchomią testy i porównają „oczekiwano” z wynikiem. Po 5 minutach zapytaj: który test was naprowadził?','Dlaczego kalkulator dawał średnią 1.00 dla ocen 5, 4, 3?','Bo suma = 0 stało w pętli. Przed ostatnią oceną suma się zerowała, więc zostawała tylko ostatnia ocena (3): 3 / 3 = 1.','Przesunięcie suma = 0 za pętlę (wtedy średnia zawsze 0) albo dzielenie przez 3 zamiast przez ile.','W układance zmień „+ 5” na „+ 10”. Ile pompek będzie razem?'),
   activities:[
    {type:'pythonLab',id:'lp-parsons',mode:'parsons',points:4,file:'trening.py',title:'Układanka: plan treningu na 7 dni',
     prompt:'Ułóż program: dzień 1 — 10 pompek, każdego dnia o 5 więcej, na końcu suma z całego tygodnia. ↑ ↓ zmieniają kolejność, ← → wcięcie. Dwie linie to pułapki.',
     solution:TRENING,distractors:['for dzien in range(1, 7):','suma = pompki'],
     tests:[{output:TRENING_OUT,label:'Plan na 7 dni i suma 175 pompek'}],
     hints:['Na górze dwie linie bez wcięcia: `pompki = 10` i `suma = 0`. Potem `for dzien in range(1, 8):` — 7 dni.','W pętli (1 poziom wcięcia) trzy linie: najpierw print, potem dodanie do sumy, potem `pompki = pompki + 5`.','Ostatni print (suma) nie ma wcięcia — wykona się raz, po pętli.']},
    {type:'pythonLab',id:'lp-fix-avg',mode:'code',points:3,file:'srednia.py',title:'Napraw: średnia ocen wychodzi za niska',input:true,stdin:['3','5','4','3'],requires:'lp-parsons',requiresTitle:'Układanka: plan treningu',
     prompt:'Kalkulator pyta, ile masz ocen, a potem o każdą ocenę. Dla 5, 4, 3 średnia to 4.00, a program pokazuje 1.00. Jedna linia jest w złym miejscu. Przenieś ją i kliknij „Sprawdź”.',
     starter:SREDNIA_BUG,solution:SREDNIA_OK,
     tests:[
      {stdin:['3','5','4','3'],contains:['Średnia: 4.00'],label:'Oceny 5, 4, 3'},
      {stdin:['4','2','3','5','4'],contains:['Średnia: 3.50'],label:'Oceny 2, 3, 5, 4'},
      {stdin:['2','6','5'],contains:['Średnia: 5.50'],label:'Oceny 6, 5'},
      {stdin:['1','4'],contains:['Średnia: 4.00'],label:'Jedna ocena'}
     ],
     hints:['Prześledź w głowie: co się dzieje z sumą na początku każdego obrotu pętli?','Linia `suma = 0` musi stać PRZED pętlą (bez wcięcia, nad `for`). Wytnij ją z pętli i wklej nad `for`.'],
     questions:[
      {q:'Masz oceny 4, 4, 5, 3. Jaka jest średnia? (wpisz z kropką, np. 4.25)',answer:'4.00',accept:['4','4.0','4,00'],inputLabel:'Średnia',explain:'4 + 4 + 5 + 3 = 16, a 16 / 4 = 4.00.',hint:'W polu „Dane wejściowe” wpisz w osobnych liniach: 4, 4, 4, 5, 3 (najpierw liczba ocen!) i uruchom.'}
     ],
     successText:'Średnia liczy się poprawnie dla dowolnej liczby ocen.'}
   ]},
  {id:'write',label:'Napisz',title:'Twoje pętle: odliczanie i rundy MVP',grouping:'solo',
   intro:'Dwa programy do napisania. Pierwszy: odliczanie dni do wakacji. Drugi (odblokuje się po pierwszym): suma punktów z rund i licznik rund, w których zdobyłeś co najmniej 100 punktów.',
   reading:{title:'Odliczanie i licznik',paragraphs:['range może liczyć w dół: range(3, 0, -1) daje 3, 2, 1. Trzecia liczba to krok: −1 znaczy „o jeden mniej”. Stop (0) nie wchodzi do wyniku.','Licznik to zmienna, która zaczyna od 0 i rośnie o 1, gdy coś się zdarzy: if pkt >= 100: mvp = mvp + 1. To ten sam if co na poprzedniej lekcji — tylko w środku pętli.']},
   ...note(14,'Samodzielnie, w swoim tempie. Pierwsze zadanie jest krótkie (szybki sukces). Drugie łączy pętlę z if z poprzedniej lekcji — zwróć uwagę na wcięcia: if ma 4 spacje, mvp = mvp + 1 — 8. Kto skończy wcześniej: w odliczaniu dopisuje osobny komunikat dla ostatniego dnia („Jutro wakacje!”).','Co daje range(5, 0, -1)?','5, 4, 3, 2, 1 — od 5 w dół, bez 0.','range(dni, 0) bez -1 — pętla nie wykona się ani razu; licznik mvp zwiększany bez if (liczy wszystkie rundy).','Dopisz do programu MVP średnią punktów na rundę (suma / rundy).'),
   activities:[
    {type:'pythonLab',id:'lp-countdown',mode:'code',points:3,file:'wakacje.py',title:'Odliczanie do wakacji',input:true,stdin:['3'],
     prompt:'Dopisz pętlę `for`, która wypisze `Do wakacji: 3`, `Do wakacji: 2`, `Do wakacji: 1` (dla 3 dni), a potem program wypisze „Wakacje!”.',
     starter:ODLICZ_START,solution:ODLICZ,
     tests:[
      {stdin:['3'],output:'Ile dni do wakacji? 3\nDo wakacji: 3\nDo wakacji: 2\nDo wakacji: 1\nWakacje!',label:'3 dni'},
      {stdin:['5'],contains:['Do wakacji: 5\nDo wakacji: 4\nDo wakacji: 3\nDo wakacji: 2\nDo wakacji: 1\nWakacje!'],label:'5 dni'},
      {stdin:['1'],output:'Ile dni do wakacji? 1\nDo wakacji: 1\nWakacje!',label:'1 dzień'}
     ],
     hints:['Pętla w dół: `for d in range(dni, 0, -1):` — od dni do 1.','W pętli (wcięcie 4 spacje): `print("Do wakacji:", d)`.'],
     successText:'Odliczanie działa dla każdej liczby dni.'},
    {type:'pythonLab',id:'lp-mvp',mode:'code',points:4,file:'rundy_mvp.py',title:'Suma punktów i rundy MVP',input:true,stdin:['4','120','80','100','30'],requires:'lp-countdown',requiresTitle:'Odliczanie do wakacji',
     prompt:'Program pyta o liczbę rund, a potem o punkty z każdej rundy. Dopisz w pętli dwie rzeczy: dodaj punkty do sumy i — jeśli w rundzie było co najmniej 100 punktów — zwiększ licznik `mvp` o 1.',
     starter:MVP_START,solution:MVP,
     tests:[
      {stdin:['4','120','80','100','30'],contains:['Suma punktów: 330','Rundy MVP (100+): 2'],label:'120, 80, 100, 30'},
      {stdin:['3','10','20','30'],contains:['Suma punktów: 60','Rundy MVP (100+): 0'],label:'Bez MVP'},
      {stdin:['2','150','99'],contains:['Suma punktów: 249','Rundy MVP (100+): 1'],label:'Granica: 99 to jeszcze nie MVP'},
      {stdin:['0'],contains:['Suma punktów: 0','Rundy MVP (100+): 0'],label:'0 rund'}
     ],
     hints:['Suma: `suma = suma + pkt` (wcięcie 4 spacje, pod input).','Licznik: `if pkt >= 100:`, a pod nim (8 spacji) `mvp = mvp + 1`.'],
     questions:[
      {q:'Zagrałeś 5 rund: 100, 100, 50, 200, 0. Ile rund MVP?',answer:'3',inputLabel:'Rundy MVP',explain:'100, 100 i 200 — trzy rundy z wynikiem ≥ 100. Suma: 450.',hint:'Wpisz w „Dane wejściowe”: 5, a pod spodem pięć wyników — i uruchom.'}
     ],
     summary:'Pętle z sumą i licznikiem: {passed}/{total} testów',successText:'Twój licznik MVP działa — także na granicy 99/100.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: pętla pod kontrolą?',grouping:'solo',
   intro:'Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(5,'Pytanie końcowe: gdzie stoi suma = 0. Zbierz od uczniów 2–3 przykłady powtarzania z życia (serie na siłowni, raty, odcinki serialu). Zapowiedz: na następnej lekcji pętla w pętli — tabliczka i wzorki z gwiazdek.','Gdzie stawiasz suma = 0 i dlaczego?','Przed pętlą — raz, na początku. W pętli zerowałaby się w każdym obrocie.','„Wszystko, co dotyczy sumy, wkładam do pętli”.','Napisz program, który liczy, ile ocen z podanych jest niedostatecznych (1).'),
   activities:[
    choice('lp-exit','Chcesz policzyć łączny czas 10 odcinków serialu. Który układ jest dobry?',['czas = 0 przed pętlą, w pętli czas = czas + dlugosc, print po pętli','czas = 0 w pętli, print w pętli','print przed pętlą, czas = 0 po pętli','czas = dlugosc w pętli, bez startu'],[0],'Start przed pętlą, dodawanie w pętli, wynik po pętli — trzy części każdej pętli z sumą.','Przypomnij sobie kalkulator średniej: gdzie była zła linia?'),
    {type:'resultCard',id:'result',title:'Pętla for — wynik',sources:['lp-r1','lp-r2','lp-predict','lp-trace','lp-parsons','lp-fix-avg','lp-countdown','lp-mvp','lp-exit'],badges:[
     {min:0,name:'Pierwszy obrót',text:'Pętla jeszcze się rozkręca. Wróć do śledzenia rund — tam widać każdy obrót.'},
     {min:0.5,name:'Trener pętli',text:'Serie, średnia i odliczanie działają. Jeszcze kilka zielonych testów i pętla zrobi za Ciebie każdą nudną robotę.'},
     {min:0.85,name:'Maszyna do powtórek',text:'Sumujesz, liczysz i odliczasz bez pomyłki. Sto linii print? Wystarczą Ci trzy.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz napisać pętlę for z range: sumujesz (start 0 przed pętlą), liczysz średnią, odliczasz w dół z krokiem -1 i liczysz zdarzenia licznikiem z if w środku pętli.'
};
