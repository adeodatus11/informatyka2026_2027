import {note, choice} from '../schema.js';

const BILET = `wiek = 15
if wiek < 18:
    cena = 15
    print("Bilet ulgowy")
else:
    cena = 25
    print("Bilet normalny")
print("Do zapłaty:", cena, "zł")
`;

const KASA = `kasa = 120
cena = 149
if kasa >= cena:
    print("Kupuję!")
    kasa = kasa - cena
else:
    print("Brakuje", cena - kasa, "zł")
print("Zostaje:", kasa, "zł")
`;

const MECZ_OK = `nasze = int(input("Nasze gole: "))
ich = int(input("Ich gole: "))
if nasze > ich:
    print("Wygrana! +3 pkt")
else:
    print("Bez wygranej")
`;

const DOSTAWA_OK = `koszyk = int(input("Wartość koszyka (zł): "))
if koszyk >= 100:
    dostawa = 0
    print("Dostawa gratis!")
else:
    dostawa = 15
print(f"Do zapłaty: {koszyk + dostawa} zł")
`;

const KINO_START = `wiek = int(input("Wiek: "))
# Ulgowy (18 zł), gdy wiek < 18 albo wiek >= 65. Pozostali: normalny (26 zł).

`;

export default {
 id:'63',grade:1,order:25,title:'Algorytmy z warunkami w języku Python',
 subtitle:'Bilet ulgowy czy normalny, stać mnie czy nie, zaliczone czy poprawka — program sam podejmie decyzję. I nie pomyli się na granicy.',
 topic:'Porównania, True/False, if/else, and/or; błędy składni w warunkach; przypadki brzegowe',icon:'code',tags:['if/else','porównania','and/or'],duration:45,
 curriculum:'Informatyka – liceum/technikum (PP 2024) · I.1 (algorytm z warunkiem), I.3 (testy na granicy warunku), II.1 (wyrażenia logiczne, instrukcja warunkowa if/else, wejście/wyjście), II.2 (środowisko Python)',
 format:{
  name:'Poziomy jak w grze',
  student:'Najpierw sprawdzasz, jak Python odpowiada na pytania (True/False) i jak if wybiera drogę. Potem układasz program z klocków i naprawiasz błędy. Na końcu przechodzisz trzy poziomy: każdy kolejny odblokowuje się po zaliczeniu poprzedniego. Efekt: trzy programy, które same podejmują decyzje — i przechodzą testy na granicy.',
  teacher:'Główna metoda: mastery learning — poziomy w etapie 5 odblokowują się kolejno, a każdy ma testy z przypadkiem brzegowym. Przed tym przykład rozwiązany ze śledzeniem (bilet ulgowy) i układanka (czy stać mnie). Etap 4 to feedback prowadzący do poprawy: program ma trzy błędy składni, Python pokazuje je po kolei, a platforma tłumaczy po polsku — uczeń poprawia jeden, uruchamia, poprawia następny. Twoja rola: pytasz „co ma się stać dokładnie na granicy?”, zamiast podawać kod.',
  grouping:'Samodzielnie, każdy przy swoim komputerze, każdy we własnym tempie przez poziomy. Opcjonalnie szybsza osoba może pomóc sąsiadowi pytaniem (nie klawiaturą): „który test nie przechodzi?”.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Zapisuję porównania w Pythonie (>, <, >=, <=, ==, !=) i przewiduję, czy dają True, czy False.','Piszę instrukcję if/else z dwukropkiem i wcięciami i wiem, które linie się wykonają.','Łączę dwa warunki przez and albo or w prostych przypadkach.','Poprawiam błędy w warunkach i sprawdzam program na granicy (np. dokładnie 100 zł, 18 lat).'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 — przeglądarka pobierze Pythona. Klucz: przewidywanie False, True, True, False. kasa >= 100 to „co najmniej 100 zł”. Bilet: dla 15 lat nie wykonują się linie 6–7; dla 18 lat bilet normalny 25 zł. Układanka: „Brakuje 29 zł”, „Zostaje: 120 zł”. Mecz — Python pokazuje błędy w kolejności: brak cudzysłowu (linia 6), brak dwukropka (linia 3), brak wcięcia (linia 4). Poziom 1: > zamień na >= (30 punktów zalicza). Poziom 2: if koszyk >= 100 / else, dostawa 15 zł. Poziom 3: if wiek < 18 or wiek >= 65. Kino, sklep i turniej są fikcyjne.',
  summary:'Uczeń przewiduje wyniki porównań, śledzi if/else, układa program „czy stać mnie”, naprawia trzy błędy składni i pisze trzy programy z warunkami (zaliczenie, dostawa, bilet z or), które przechodzą testy na granicy. Karta wyniku: maks. 28 pkt. Pytanie na wyjście: co się stanie z linią bez wcięcia pod if? Następna lekcja: sprawdzanie poprawności danych (program odporny na „abc”).'
 },
 sections:[
  {id:'start',label:'Start',title:'Bilet ulgowy czy normalny?',grouping:'class',
   intro:'Kasa w kinie, automat z biletami, sklep z darmową dostawą — wszędzie program podejmuje decyzję: jeśli…, to…, w przeciwnym razie… Dziś nauczysz Pythona takich decyzji. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Romb ze schematu w Pythonie',paragraphs:['Na lekcji o algorytmach romb w schemacie miał dwie strzałki: TAK i NIE. W Pythonie romb to if, strzałka NIE to else. Python sprawdza warunek i wykonuje tylko jedną z dwóch dróg.','Warunek to pytanie, na które odpowiedź brzmi True (prawda) albo False (fałsz): czy wiek < 18? czy koszyk >= 100? Najwięcej błędów w takich programach jest na granicy — dlatego testy zawsze sprawdzają przypadek brzegowy.']},
   ...note(4,'Hak: zapytaj, ile kosztuje bilet ulgowy w kinie, do którego chodzą, i od kiedy przestaje przysługiwać. Dwa pytania powtórkowe z lekcji o zmiennych — samodzielnie, bez notatek; omów błędne. Zaraz potem wszyscy przechodzą do etapu 2 (ładowanie Pythona).','Co oznacza „do 18 lat” — czy 18-latek ma ulgę?','To zależy od regulaminu — i właśnie dlatego programista musi to ustalić w specyfikacji, a potem sprawdzić testem.','Uczniowie nie widzą różnicy między „do 18” a „poniżej 18”. To ta sama dziura co w lekcji o specyfikacji.','Zapytaj o inne decyzje w aplikacjach: czy hasło ma 8 znaków, czy masz 13 lat, żeby założyć konto, czy bateria < 20%.'),
   activities:[
    choice('wa-r1','Powtórka: co wypisze print("5" + "3")?',['53','8','5 + 3','Błąd'],[0],'"5" i "3" to teksty, a + dla tekstów skleja je w „53”. Liczby dodałby dopiero print(5 + 3).','Czy w nawiasie są liczby, czy teksty w cudzysłowie?'),
    choice('wa-r2','Powtórka: wiek = input("Wiek: "). Użytkownik wpisuje 15. Jakiego typu jest wiek?',['str — tekst "15"','int — liczba 15','float — liczba 15.0','Zależy od tego, co wpisze użytkownik'],[0],'input() zawsze daje tekst. Dlatego dziś każdy program z warunkiem zaczyna się od int(input(…)) — inaczej porównanie wiek < 18 skończy się błędem.','Co zawsze zwraca input()?')
   ]},
  {id:'porownania',label:'Porównania',title:'Porównania: prawda czy fałsz?',grouping:'solo',
   intro:'Każdy warunek to pytanie z odpowiedzią True albo False. Przewidź, co odpowie Python, a potem uruchom i porównaj.',
   reading:{title:'Sześć znaków porównania',paragraphs:['> większe, < mniejsze, >= większe lub równe, <= mniejsze lub równe, == równe, != różne. Znaki ≥ i ≤ z matematyki zapisujesz w Pythonie jako >= i <= (najpierw znak większości, potem =).','Uwaga na pułapkę: jedno = wpisuje wartość do zmiennej (wiek = 16), a dwa == pytają, czy wartości są równe (wiek == 16). W warunku if zawsze ==.']},
   ...note(7,'Przewidywanie z zaznaczeniem pewności. Po porównaniu zapytaj, kto pomylił się przy wiek != 16. Potem pytanie o „co najmniej 100 zł” — omów, dlaczego > 100 pominie dokładnie 100 zł (granica).','Jak zapisać „co najmniej 100 zł”?','kasa >= 100 — „co najmniej” obejmuje też samo 100.','Pisanie => albo =< (Python ich nie zna), mylenie = z ==, odpowiedź „16” zamiast True dla wiek == 16.','Szybsi: dopisz w przewidywaniu (w głowie) print(wiek > 15 and wiek < 18) — co wyjdzie?'),
   activities:[
    {type:'pythonLab',id:'wa-predict',mode:'predict',points:2,file:'porownania.py',title:'True czy False?',
     prompt:'Każda linia wypisze True albo False. Wpisz cztery odpowiedzi, każdą w osobnej linii, i uruchom.',
     code:'wiek = 16\nprint(wiek >= 18)\nprint(wiek < 18)\nprint(wiek == 16)\nprint(wiek != 16)\n',predictRows:4,
     explain:'16 >= 18 → False. 16 < 18 → True. 16 == 16 → True. 16 != 16 („czy 16 jest różne od 16?”) → False. Python pisze True i False wielką literą.'},
    choice('wa-cmp','Który warunek sprawdza, czy masz co najmniej 100 zł (zmienna kasa)?',['kasa >= 100','kasa > 100','kasa = 100','kasa =< 100'],[0],'„Co najmniej 100” to 100 albo więcej, czyli >=. kasa > 100 pominie dokładnie 100 zł (granica!), kasa = 100 to przypisanie, a =< Python nie zna.','Czy przy dokładnie 100 zł warunek ma być spełniony?')
   ]},
  {id:'ifelse',label:'if/else',title:'if/else: program wybiera drogę',grouping:'solo',
   intro:'Przykład rozwiązany: bilet ulgowy. Prześledź program krok po kroku i zobacz, które linie Python pomija. Potem ułóż z klocków program „czy stać mnie na grę?”.',
   reading:{title:'Składnia if/else',paragraphs:['if warunek: — jeśli warunek jest prawdziwy, Python wykonuje wcięte linie pod spodem. else: — w przeciwnym razie wykonuje linie pod else. Dwukropek na końcu i wcięcie 4 spacjami (klawisz Tab) są obowiązkowe.','Linie bez wcięcia po bloku if/else wykonują się zawsze, niezależnie od warunku. Jak w schemacie blokowym: dwie strzałki z rombu łączą się z powrotem w jedną.'],
    example:{question:'Przykład rozwiązany: bilet ulgowy dla osób poniżej 18 lat, wiek = 15.',answer:'15 < 18 to True → Python wykonuje linie pod if (cena = 15, „Bilet ulgowy”), pomija linie pod else i na końcu zawsze wypisuje cenę. Dla wiek = 18: 18 < 18 to False → wykonują się linie pod else.'}},
   ...note(9,'Śledzenie: na projektorze pokaż moment, w którym Python „przeskakuje” z linii 4 do linii 8 — linie pod else są pomijane. Potem uczniowie zmieniają wiek na 18 (przycisk „Zmień kod”) i śledzą sami. Układanka: pułapki to if kasa <= cena (odwrócony warunek) i else bez dwukropka.','Które linie wykonują się zawsze, niezależnie od warunku?','Te bez wcięcia przed i po bloku if/else — tu pierwsza linia (wiek = 15) i ostatnia (print z ceną).','Wcięcie ostatniego print pod else — wtedy cena wypisze się tylko dla biletu normalnego.','Szybsi: w śledzeniu wpisz wiek = 17, a potem 19 — przewidź przed kliknięciem, którą drogą pójdzie Python.'),
   activities:[
    {type:'pythonLab',id:'wa-trace',mode:'trace',points:0,file:'bilet.py',title:'Przykład rozwiązany: bilet ulgowy krok po kroku',
     prompt:'Klikaj „Krok dalej” i patrz, które linie podświetlają się po kolei. Potem kliknij „Zmień kod i sprawdź, co się stanie”, wpisz wiek = 18 i prześledź jeszcze raz.',
     code:BILET,
     questions:[
      {q:'Które linie NIE wykonały się dla wiek = 15?',options:['Linie 6 i 7 (pod else)','Linie 3 i 4 (pod if)','Linia 8 (ostatni print)','Wykonały się wszystkie'],correct:[0],explain:'Warunek 15 < 18 był prawdziwy, więc Python wykonał linie pod if i przeskoczył całe else. Linia 8 nie ma wcięcia — wykonuje się zawsze.',hint:'Zobacz, którędy przeszło ➜ po linii 4.'},
      {q:'Zmień kod na wiek = 18 i prześledź. Jaki bilet?',options:['Bilet normalny, 25 zł','Bilet ulgowy, 15 zł','Oba bilety','Program zgłosi błąd'],correct:[0],explain:'18 < 18 to False — to przypadek brzegowy. Python idzie do else: bilet normalny, 25 zł.',hint:'Czy 18 jest mniejsze od 18?'}
     ]},
    {type:'pythonLab',id:'wa-parsons',mode:'parsons',points:4,file:'czy_stac_mnie.py',title:'Układanka: czy stać mnie na grę?',
     prompt:'Masz 120 zł, gra kosztuje 149 zł. Ułóż program, który wypisze „Kupuję!” albo ile brakuje, a na końcu ile zostaje. ← → zmieniają wcięcie. Dwie linie to pułapki.',
     solution:KASA,distractors:['if kasa <= cena:','else'],
     tests:[{output:'Brakuje 29 zł\nZostaje: 120 zł',label:'120 zł, gra za 149 zł: brakuje 29 zł'}],
     hints:['Na początku zmienne kasa i cena (bez wcięcia), potem if.','Pod if (z wcięciem) dwie linie: „Kupuję!” i odjęcie ceny. else: bez wcięcia, a pod nim print z brakującą kwotą.','Ostatni print („Zostaje”) ma się wykonać zawsze — bez wcięcia.']}
   ]},
  {id:'bledy',label:'Błędy',title:'Błędy, które robi każdy: napraw w minutę',grouping:'solo',
   intro:'Ten program ma trzy błędy. Python pokazuje jeden naraz — platforma wyjaśni go po polsku. Popraw, uruchom, popraw następny.',
   reading:{title:'Trzy najczęstsze błędy w if',paragraphs:['Brak dwukropka po if albo else, brak wcięcia pod if i niezamknięty cudzysłów. Python pokazuje jeden błąd naraz, z numerem linii — nie zawsze ten, który stoi najwyżej. Komunikat po angielsku znajdziesz pod polskim wyjaśnieniem.','Poprawiaj jeden błąd naraz i uruchamiaj po każdej poprawce. Programiści robią tak codziennie: komunikat o błędzie to wskazówka, a nie ocena.']},
   ...note(6,'Feedback prowadzący do poprawy: uczniowie sami czytają polskie wyjaśnienie błędu i poprawiają. Nie poprawiaj za nich — zapytaj „co mówi komunikat? która linia?”. Po zaliczeniu pytanie o remis i porażkę: to zapowiedź elif (lekcja o instrukcjach zagnieżdżonych).','Po co uruchamiać program po każdej poprawce, a nie poprawiać wszystkiego naraz?','Bo Python pokazuje jeden błąd naraz. Po poprawce pojawia się następny — łatwiej go znaleźć, gdy poprawiasz po kolei.','Dodawanie dwukropka w złym miejscu (po print), wcięcie else razem z print.','Szybsi: dopisz osobny komunikat „Przegrana” — zastanów się, czy da się to zrobić samym if/else (wrócimy do tego przy elif).'),
   activities:[
    {type:'pythonLab',id:'wa-fix',mode:'code',points:3,file:'mecz.py',title:'Napraw: wynik meczu',input:true,stdin:['3','1'],
     prompt:'Program ma wypisać „Wygrana! +3 pkt”, gdy strzelimy więcej goli, a w przeciwnym razie „Bez wygranej”. Uruchom, przeczytaj błąd, popraw. Powtarzaj, aż program zadziała, i kliknij „Sprawdź”.',
     starter:'nasze = int(input("Nasze gole: "))\nich = int(input("Ich gole: "))\nif nasze > ich\nprint("Wygrana! +3 pkt")\nelse:\n    print("Bez wygranej)\n',
     solution:MECZ_OK,
     tests:[{stdin:['3','1'],output:'Nasze gole: 3\nIch gole: 1\nWygrana! +3 pkt',label:'3:1'},{stdin:['1','1'],output:'Nasze gole: 1\nIch gole: 1\nBez wygranej',label:'Remis 1:1'},{stdin:['0','2'],output:'Nasze gole: 0\nIch gole: 2\nBez wygranej',label:'0:2'}],
     hints:['Python najpierw czyta cały tekst programu, więc pierwszy pokaże błąd z linii 6: tekst „Bez wygranej” musi mieć cudzysłów także na końcu.','Linia 3: na końcu linii z if brakuje dwukropka „:”.','Linia 4: print pod if musi mieć wcięcie (kliknij na początku linii i naciśnij Tab).'],
     questions:[{q:'Remis 1:1 i porażka 0:2 dają ten sam komunikat. Co pozwoliłoby je rozróżnić?',options:['Trzecia droga: osobny warunek na remis (elif — poznasz go niedługo)','Drugi print pod else','Usunięcie else','Zamiana > na >='],correct:[0],explain:'if/else ma tylko dwie drogi. Na trzy komunikaty (wygrana, remis, porażka) potrzebny jest elif — to temat jednej z następnych lekcji.',hint:'Ile różnych komunikatów chcesz? Ile dróg daje if/else?'}]}
   ]},
  {id:'poziomy',label:'Poziomy',title:'Poziomy: napisz warunek sam',grouping:'solo',
   intro:'Trzy poziomy, każdy odblokowuje się po zaliczeniu poprzedniego. Testy zawsze sprawdzają granicę — zanim klikniesz „Sprawdź”, pomyśl, co ma się stać dokładnie na niej.',
   reading:{title:'and i or: dwa warunki naraz',paragraphs:['and (i) — oba warunki muszą być prawdziwe: wiek >= 15 and zgoda == "tak". or (lub) — wystarczy jeden: wiek < 18 or wiek >= 65. Każdą część warunku piszesz w całości: wiek < 18 or wiek >= 65, a nie wiek < 18 or >= 65.','Przypadek brzegowy to dane dokładnie na granicy: 30 punktów przy progu 30, 100 zł przy darmowej dostawie od 100 zł, 65 lat przy uldze od 65. Testy na platformie zawsze go sprawdzają — jak w projektancie testów.']},
   ...note(14,'Mastery learning: każdy idzie we własnym tempie. Poziom 1 to poprawka granicy (> na >=), poziom 2 — if/else od zera według komentarzy, poziom 3 — warunek z or. Krąż i zadawaj jedno pytanie: „Co ma się stać dokładnie na granicy?”. Kto skończy poziom 3, odpowiada na pytanie o and (turniej). Słabszym wystarczą poziomy 1–2 — karta wyniku i tak pokaże postęp.','Czym różni się and od or?','and — muszą być spełnione oba warunki, or — wystarczy jeden.','Pisanie wiek < 18 or >= 65 (niepełny warunek), zmiana tekstów w print (testy sprawdzają dokładne komunikaty), brak wcięcia pod else.','Bonus: dopisz do kina zniżkę „we wtorki wszyscy płacą 15 zł” — zastanów się, czego brakuje w danych wejściowych.'),
   activities:[
    {type:'pythonLab',id:'wa-pass',mode:'code',points:3,file:'sprawdzian.py',title:'Poziom 1: zaliczone czy poprawka?',input:true,stdin:['30'],
     prompt:'Sprawdzian zalicza się od 30 punktów — 30 też zalicza. Program ma błąd dokładnie na granicy. Uruchom testy, znajdź go i popraw jeden znak.',
     starter:'punkty = int(input("Punkty ze sprawdzianu: "))\nif punkty > 30:\n    print("Zaliczone")\nelse:\n    print("Poprawka")\n',
     solution:'punkty = int(input("Punkty ze sprawdzianu: "))\nif punkty >= 30:\n    print("Zaliczone")\nelse:\n    print("Poprawka")\n',
     tests:[{stdin:['45'],output:'Punkty ze sprawdzianu: 45\nZaliczone',label:'45 punktów'},{stdin:['30'],output:'Punkty ze sprawdzianu: 30\nZaliczone',label:'Granica: dokładnie 30 punktów'},{stdin:['29'],output:'Punkty ze sprawdzianu: 29\nPoprawka',label:'29 punktów'}],
     hints:['Który test nie przechodzi? 30 punktów. Czy 30 > 30?','Zamień `>` na `>=`.']},
    {type:'pythonLab',id:'wa-delivery',mode:'code',points:4,file:'dostawa.py',title:'Poziom 2: darmowa dostawa od 100 zł',input:true,stdin:['80'],requires:'wa-pass',requiresTitle:'Poziom 1',
     prompt:'Fikcyjny sklep: dostawa kosztuje 15 zł, a od 100 zł jest darmowa — wtedy program wypisuje też „Dostawa gratis!”. Dopisz if/else w miejscu komentarzy. Ostatnia linia jest gotowa.',
     starter:'koszyk = int(input("Wartość koszyka (zł): "))\n# Jeśli koszyk >= 100: dostawa = 0 i wypisz "Dostawa gratis!"\n# W przeciwnym razie: dostawa = 15\n\nprint(f"Do zapłaty: {koszyk + dostawa} zł")\n',
     solution:DOSTAWA_OK,
     tests:[{stdin:['80'],output:'Wartość koszyka (zł): 80\nDo zapłaty: 95 zł',label:'80 zł → 95 zł'},{stdin:['100'],output:'Wartość koszyka (zł): 100\nDostawa gratis!\nDo zapłaty: 100 zł',label:'Granica: dokładnie 100 zł'},{stdin:['250'],output:'Wartość koszyka (zł): 250\nDostawa gratis!\nDo zapłaty: 250 zł',label:'250 zł'}],
     hints:['Zacznij od `if koszyk >= 100:` (z dwukropkiem). Pod nim, z wcięciem: `dostawa = 0` i `print("Dostawa gratis!")`.','Potem `else:` bez wcięcia, a pod nim z wcięciem `dostawa = 15`. Ostatni print zostaw bez wcięcia.']},
    {type:'pythonLab',id:'wa-ticket',mode:'code',points:4,file:'kino.py',title:'Poziom 3: kasa kina z ulgą (or)',input:true,stdin:['15'],requires:'wa-delivery',requiresTitle:'Poziom 2',
     prompt:'Fikcyjne kino Promyk: bilet ulgowy (18 zł) dla osób poniżej 18 lat albo od 65 lat. Pozostali płacą 26 zł. Program wypisuje dokładnie `Ulgowy: 18 zł` albo `Normalny: 26 zł`.',
     starter:KINO_START,
     solution:KINO_START+'if wiek < 18 or wiek >= 65:\n    print("Ulgowy: 18 zł")\nelse:\n    print("Normalny: 26 zł")\n',
     tests:[{stdin:['15'],output:'Wiek: 15\nUlgowy: 18 zł',label:'15 lat'},{stdin:['30'],output:'Wiek: 30\nNormalny: 26 zł',label:'30 lat'},{stdin:['18'],output:'Wiek: 18\nNormalny: 26 zł',label:'Granica: 18 lat'},{stdin:['65'],output:'Wiek: 65\nUlgowy: 18 zł',label:'Granica: 65 lat'},{stdin:['64'],output:'Wiek: 64\nNormalny: 26 zł',label:'64 lata'}],
     hints:['Warunek z dwiema częściami: `if wiek < 18 or wiek >= 65:`','Pod if: `print("Ulgowy: 18 zł")`, potem `else:` i pod nim `print("Normalny: 26 zł")` — oba print z wcięciem.'],
     questions:[{q:'Fikcyjny turniej e-sportowy: grać może osoba, która ma co najmniej 15 lat I ma zgodę rodzica (zgoda == "tak"). Który warunek?',options:['`wiek >= 15 and zgoda == "tak"`','`wiek >= 15 or zgoda == "tak"`','`wiek > 15 and zgoda = "tak"`','`wiek >= 15 and "tak"`'],correct:[0],explain:'Muszą być spełnione oba warunki, więc and. Przy or wystarczyłaby sama zgoda — nawet dla 10-latka. W trzeciej opcji są dwa błędy: > pomija 15 lat, a = to przypisanie.',hint:'Czy wystarczy jeden warunek, czy potrzebne są oba?'}],
     summary:'Kasa kina z ulgą: {passed}/{total} testów',successText:'Trzy poziomy zaliczone — Twoje programy podejmują decyzje.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: warunki pod kontrolą?',grouping:'solo',
   intro:'Ostatnie pytanie, samoocena i karta wyniku do pokazania nauczycielowi.',
   ...note(5,'Pytanie wyjściowe sprawdza najczęstszy błąd: linia bez wcięcia i bez else wykonuje się zawsze. Zapowiedź: na następnej lekcji użytkownik wpisze „abc” albo −5 — a Twój program się nie wysypie.','Co się stanie z print bez wcięcia pod blokiem if?','Wykona się zawsze, niezależnie od warunku — nie należy do if.','Uczniowie myślą, że Python „wie”, że druga linia to przeciwieństwo pierwszej, bez słowa else.','Zapytaj, co się stanie w programie kina, jeśli ktoś wpisze „piętnaście” — sprawdźcie to na następnej lekcji.'),
   activities:[
    choice('wa-exit','Program: if punkty >= 30: → pod spodem z wcięciem print("Zaliczone"), a dalej BEZ wcięcia i bez else print("Poprawka"). Co wypisze dla 45 punktów?',['Zaliczone i Poprawka — druga linia nie należy do if, więc wykonuje się zawsze','Tylko Zaliczone','Tylko Poprawka','Program zgłosi błąd'],[0],'Bez else i bez wcięcia print("Poprawka") nie jest częścią warunku — Python wykona go zawsze. Dlatego druga droga musi być pod else:.','Które linie należą do if? Te z wcięciem.'),
    {type:'resultCard',id:'result',title:'Warunki w Pythonie — wynik',sources:['wa-r1','wa-r2','wa-predict','wa-cmp','wa-trace','wa-parsons','wa-fix','wa-pass','wa-delivery','wa-ticket','wa-exit'],badges:[
     {min:0,name:'If bez dwukropka',text:'Warunki jeszcze się sypią — to normalne na początku. Wróć do śledzenia biletu i zobacz, którą drogą idzie Python.'},
     {min:0.5,name:'Decydent',text:'Twoje programy wybierają drogę. Jeszcze kilka granic i żaden test Cię nie zaskoczy.'},
     {min:0.85,name:'Bramkarz warunków',text:'if, else, and, or i granice pod kontrolą. Bez biletu ulgowego nikt się przez Ciebie nie prześlizgnie.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz zapisać porównanie, napisać if/else z dwukropkiem i wcięciami, połączyć warunki przez and/or i sprawdzić program na granicy. Następnym razem: program, który nie wysypie się na złych danych.'
};
