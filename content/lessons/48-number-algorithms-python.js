import {note, choice} from '../schema.js';

const CZY_PIERWSZA = `def czy_pierwsza(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True
`;
const LICZ = `

ile = 0
for k in range(1000):
    if czy_pierwsza(k):
        ile = ile + 1
print("Liczb pierwszych mniejszych od 1000:", ile)
`;
const NWD_ODEJM = `def nwd_odejmowanie(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a
`;
const NWD = `def nwd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
`;
const GCD_ALL = 'all(nwd(x, y) == __import__("math").gcd(x, y) for x in range(30) for y in range(30))';
const LCM_ALL = 'all(nww(x, y) == __import__("math").lcm(x, y) for x in range(30) for y in range(30))';

export default {
 id:'48',grade:2,order:22,title:'Programowanie wybranych algorytmów na liczbach',
 subtitle:'Python ma gotowe math.gcd. Napiszesz własne nwd, czy_pierwsza, rozklad i nww — i udowodnisz testami, że liczą tak samo jak biblioteka.',
 topic:'czy_pierwsza, nwd (dwie wersje), rozklad i nww w Pythonie',icon:'code',tags:['Pokonaj bibliotekę','testy brzegowe','math.gcd'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.2.a (badanie pierwszości, NWD i NWW), I.3 (sprawdzanie poprawności dla danych brzegowych: 0, 1, 2, duże liczby), II.1 (pętle, warunki, funkcje, testowanie), II.2 (Python w przeglądarce, moduł math)',
 format:{
  name:'Pokonaj bibliotekę: poziomy z testami (mastery)',
  student:'Każdy poziom to jedna funkcja, którą Python już ma w bibliotece math. Piszesz własną wersję, a testy porównują ją z biblioteką i sprawdzają przypadki brzegowe (0, 1, 2, wielkie liczby). Kolejne zadanie odblokuje się po zaliczeniu poprzedniego. Efekt: Twoja mini-biblioteka liczb, zgodna z math.gcd i math.lcm dla 900 par liczb.',
  teacher:'Mastery learning: poziomy (pierwszość → NWD → rozkład i NWW) odblokowują się po zaliczeniu poprzedniego zadania. Zaczynamy od przykładu rozwiązanego (śledzenie Euklidesa i przewidywanie wersji z odejmowaniem), potem wygaszamy podpowiedzi: układanka → naprawa błędu → kod z komentarzami → kod od szkieletu. Feedback prowadzący do poprawy daje lista testów: uczeń widzi, dla jakich danych funkcja się myli (np. 0 i 1). Twoja rola: co kilka minut pytasz „który test jeszcze czerwony i co on sprawdza?”, a uczniów, którzy utknęli na tym samym teście, zbierasz przy jednym ekranie.',
  grouping:'Samodzielnie, każdy w swoim tempie. Kto skończy poziom 3, może dopisywać własne testy brzegowe albo — jeśli chce — podpowiedzieć sąsiadowi pytaniem, nie klawiaturą.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Programuję czy_pierwsza(n), sprawdzając dzielniki, dopóki d · d ≤ n, i obsługuję 0, 1 i 2.','Programuję nwd(a, b) z resztą z dzielenia i porównuję jej wynik oraz liczbę kroków z wersją z odejmowaniem.','Programuję rozklad(n) i nww(a, b) = a · b // nwd(a, b).','Sprawdzam własny wynik testami brzegowymi i porównaniem z math.gcd / math.lcm.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Wyniki z poprzedniej lekcji (NWD na płytkach) — przydadzą się do sprawdzania'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na projektorze (pobranie Pythona ok. 13 MB). Klucz: NWD(48, 18) = 6 w 3 krokach z resztą, w 4 odejmowaniach (wydruk „6 4”); liczb pierwszych < 1000: 168; 2 147 483 647 jest pierwsza (sprawdzenie do 46 341 trwa ułamek sekundy); NWD(1 000 000, 3) — 333 335 odejmowań i 2 dzielenia; rozklad(360) = [2, 2, 2, 3, 3, 5]; NWW(12, 18) = 36. Test „900 par” porównuje funkcję ucznia z math.gcd / math.lcm dla wszystkich par 0–29.',
  summary:'Uczeń buduje mini-bibliotekę: czy_pierwsza, nwd, rozklad, nww, zgodną z biblioteką math. Karta wyniku: maks. 30 pkt. Pytanie na wyjście: po co pisać własne nwd, skoro jest math.gcd? (rozumiesz algorytm, umiesz go sprawdzić i przenieść do innego języka; testy porównawcze to sposób pracy programistów).'
 },
 sections:[
  {id:'start',label:'Start',title:'Python ma math.gcd. Po co pisać własne?',grouping:'class',
   intro:'Bo dopiero gdy sam napiszesz algorytm, wiesz, kiedy się myli — i umiesz to sprawdzić. Dziś „pokonasz bibliotekę”: Twoje funkcje mają dać ten sam wynik co math.gcd dla setek par liczb. Najpierw dwa pytania z lekcji o algorytmach na liczbach.',
   reading:{title:'Test porównawczy',paragraphs:['Programiści często sprawdzają nowy kod, porównując go z wersją, której ufają: dla wielu danych wynik musi być identyczny. Tak samo zrobisz Ty — test policzy NWD dla 900 par liczb Twoją funkcją i funkcją math.gcd.','Najwięcej błędów kryje się w przypadkach brzegowych: 0, 1, 2, liczby równe, bardzo duże. Dlatego testy zawsze je sprawdzają, nawet jeśli „normalne” liczby działają.']},
   ...note(4,'Hak: pokaż na projektorze w pythonLab print(math.gcd(240, 180)) — wynik 60 od razu. Zapytaj: „skąd wiemy, że biblioteka liczy dobrze?” i „co, jeśli piszesz w języku bez takiej funkcji?”. Dwa pytania powtórkowe z poprzedniej lekcji — samodzielnie.','Jakie liczby sprawdziłbyś najpierw, testując czy_pierwsza?','0, 1 (nie są pierwsze), 2 (jedyna parzysta pierwsza), mały kwadrat (4, 9, 25) i dużą liczbę pierwszą.','Testowanie tylko „ładnych” przykładów (7, 13) — błąd z 0, 1 albo kwadratami się nie ujawni.','Zapytaj, jakie dane brzegowe mają aplikacje, z których korzystają (pusty koszyk, 0 zł, data 29 lutego).'),
   activities:[
    choice('ln-r1','Powtórka: NWD(48, 18) z resztą. 48 : 18 = 2 reszta 12. Jaka para jest następna?',['(18, 12)','(30, 18)','(48, 12)','(2, 12)'],[0],'Parę (a, b) zamieniamy na (b, reszta z a : b) — (18, 12). Potem (12, 6), potem (6, 0) → NWD = 6.','Druga liczba przechodzi na pierwsze miejsce, a na drugie wchodzi reszta.'),
    choice('ln-r2','Powtórka: do jakiej liczby wystarczy sprawdzać dzielniki, żeby zbadać, czy 101 jest pierwsza?',['Do 10, bo 11 · 11 = 121 > 101','Do 50, czyli do połowy','Do 100','Tylko 2, 3 i 5'],[0],'Sprawdzamy d, dopóki d · d ≤ n. 10 · 10 = 100 ≤ 101, 11 · 11 = 121 > 101. Żaden z 2…10 nie dzieli 101, więc jest pierwsza.','Pary dzielników: mniejsza liczba z pary nie przekracza pierwiastka.')
   ]},
  {id:'worked',label:'Przykład',title:'Przykład rozwiązany: Euklides w Pythonie',grouping:'solo',
   intro:'Najpierw prześledzisz gotową wersję z resztą — krok po kroku. Potem przewidzisz, co wypisze wersja z odejmowaniem dla tych samych liczb.',
   reading:{title:'a, b = b, a % b',paragraphs:['Wersja z resztą to trzy linie: while b != 0: — dopóki druga liczba nie jest zerem; a, b = b, a % b — zamień parę; po pętli NWD jest w a. Tak samo jak na płytkach: (48, 18) → (18, 12) → (12, 6) → (6, 0).','Wersja z odejmowaniem: while a != b: — od większej odejmij mniejszą. Daje ten sam wynik, ale potrzebuje więcej obrotów pętli. Licznik krok pokaże, ile dokładnie.']},
   ...note(7,'Pokaż na projektorze pierwszy obrót śledzenia i mów na głos: „b nie jest zerem, więc a dostaje 18, b dostaje 48 % 18 = 12”. Potem uczniowie przechodzą sami i odpowiadają. Przewidywanie wersji z odejmowaniem robią bez uruchamiania — na kartce można rozpisać pary.','Dlaczego w a, b = b, a % b obie zmienne zmieniają się naraz?','Bo Python najpierw liczy prawą stronę ze starych wartości (18 i 12), a potem wpisuje obie. Osobno a = b; b = a % b dałoby złą resztę.','Przewidywanie „6 3” dla wersji z odejmowaniem (pomylenie z liczbą kroków wersji z resztą).','Zmień w śledzeniu liczby na 1071 i 462 — ile kroków?'),
   activities:[
    {type:'pythonLab',id:'ln-trace',mode:'trace',points:0,file:'euklides.py',title:'NWD(48, 18) z resztą — krok po kroku',
     prompt:'Przejdź program krokami. Obserwuj pary (a, b) i licznik krok.',
     code:'a, b = 48, 18\nkrok = 0\nwhile b != 0:\n    a, b = b, a % b\n    krok = krok + 1\nprint("NWD =", a, "po", krok, "krokach")\n',
     questions:[
      {q:'Ile wynosi b po pierwszym obrocie pętli?',answer:'12',inputLabel:'b =',explain:'48 % 18 = 12 (48 = 2 · 18 + 12). Para to teraz (18, 12).',hint:'Idź krokami, aż krok = 1, i odczytaj b.'},
      {q:'Po ilu krokach program kończy pracę?',answer:'3',inputLabel:'Liczba kroków',explain:'(48, 18) → (18, 12) → (12, 6) → (6, 0). Trzy obroty pętli, NWD = 6.',hint:'Przejdź do końca i odczytaj wydruk.'}
     ]},
    {type:'pythonLab',id:'ln-predict',mode:'predict',points:2,file:'odejmowanie.py',title:'Przewidź: wersja z odejmowaniem',
     prompt:'Ten program liczy NWD(48, 18) odejmowaniem i liczy kroki. Co wypisze? (dwie liczby oddzielone spacją)',
     code:'a, b = 48, 18\nkrok = 0\nwhile a != b:\n    if a > b:\n        a = a - b\n    else:\n        b = b - a\n    krok = krok + 1\nprint(a, krok)\n',predictRows:1,
     explain:'(48, 18) → (30, 18) → (12, 18) → (12, 6) → (6, 6). NWD = 6 po 4 odejmowaniach — o jeden krok więcej niż wersja z resztą. Przy liczbach bardzo różnej wielkości różnica rośnie lawinowo.'}
   ]},
  {id:'prime',label:'Poziom 1',title:'Poziom 1: czy_pierwsza(n)',grouping:'solo',
   intro:'Ułóż funkcję z rozsypanych linii (dwie to pułapki), a potem napraw cudzą wersję, która „za szybko” ogłasza wynik. Na końcu policzysz, ile jest liczb pierwszych mniejszych od 1000.',
   reading:{title:'return kończy funkcję od razu',paragraphs:['Gdy znajdziesz dzielnik, wiesz już, że liczba nie jest pierwsza — return False kończy funkcję. Ale „nie dzieli przez 2” nie znaczy jeszcze „pierwsza”: return True może stać dopiero po pętli, gdy sprawdzisz wszystkich kandydatów.','Na początku osobny warunek: liczby mniejsze od 2 (0, 1, ujemne) nie są pierwsze. Bez niego funkcja uznałaby 0 i 1 za pierwsze, bo pętla nie wykona się ani razu.']},
   ...note(9,'Układanka: pułapki to while d <= n (sprawdza także samo n, więc każda liczba wychodzi złożona) oraz d = 1 (każda liczba dzieli się przez 1). Naprawa błędu: else: return True w środku pętli — test z 15 i 9 to pokaże. Po naprawie uczniowie odczytują 168.','Dlaczego return True nie może stać w else wewnątrz pętli?','Bo wtedy funkcja kończy się po sprawdzeniu tylko 2: każda liczba nieparzysta wyszłaby pierwsza (15, 9, 21).','Wcięcie return True na poziomie if (w pętli) albo brak warunku n < 2.','Policz, ile liczb pierwszych jest mniejszych od 10 000 (1229) — zmień 1000 w programie.'),
   activities:[
    {type:'pythonLab',id:'ln-prime',mode:'parsons',points:4,file:'pierwsza.py',title:'Układanka: czy_pierwsza(n)',
     prompt:'Ułóż funkcję. ↑ ↓ zmieniają kolejność, ← → wcięcie. Dwie linie to pułapki.',
     solution:CZY_PIERWSZA,distractors:['while d <= n:','d = 1'],
     tests:[
      {call:'czy_pierwsza(2)',expected:'True',label:'2 — jedyna parzysta pierwsza'},
      {call:'czy_pierwsza(17)',expected:'True'},
      {call:'czy_pierwsza(1)',expected:'False',label:'1 nie jest pierwsza'},
      {call:'czy_pierwsza(0)',expected:'False',label:'0 nie jest pierwsza'},
      {call:'czy_pierwsza(91)',expected:'False',label:'91 = 7 · 13'},
      {call:'czy_pierwsza(25)',expected:'False',label:'Kwadrat liczby pierwszej'},
      {call:'czy_pierwsza(2147483647)',expected:'True',label:'Duża liczba: 2 147 483 647'}
     ],
     hints:['Kolejność: def → warunek n < 2 → d = 2 → pętla while → po pętli return True.','W pętli: `if n % d == 0:` z `return False` pod spodem, a potem `d = d + 1` (to samo wcięcie co if).','Pętla sprawdza kandydatów, dopóki `d * d <= n`.']},
    {type:'pythonLab',id:'ln-prime-bug',mode:'code',points:3,file:'pierwsze_1000.py',title:'Znajdź błąd: każda nieparzysta jest „pierwsza”',requires:'ln-prime',requiresTitle:'Układanka: czy_pierwsza',
     prompt:'Ta wersja myli się dla 9, 15, 21… Uruchom, porównaj liczbę liczb pierwszych z testami i usuń błąd (wystarczy skasować dwie linie).',
     starter:CZY_PIERWSZA.replace('            return False\n        d = d + 1','            return False\n        else:\n            return True\n        d = d + 1')+LICZ,
     solution:CZY_PIERWSZA+LICZ,
     tests:[
      {call:'czy_pierwsza(15)',expected:'False',label:'15 = 3 · 5'},
      {call:'czy_pierwsza(9)',expected:'False',label:'9 = 3 · 3'},
      {call:'czy_pierwsza(49)',expected:'False'},
      {call:'czy_pierwsza(13)',expected:'True'},
      {call:'czy_pierwsza(2)',expected:'True'},
      {contains:['Liczb pierwszych mniejszych od 1000: 168'],label:'Program liczy 168 liczb pierwszych'}
     ],
     hints:['Dla 15: d = 2, 15 % 2 nie jest 0… i co robi teraz funkcja?','`else: return True` kończy funkcję po pierwszym kandydacie. Usuń `else:` i `return True` z pętli — `return True` po pętli już jest.'],
     questions:[
      {q:'Ile jest liczb pierwszych mniejszych od 1000?',answer:'168',inputLabel:'Liczba',explain:'168. Program sprawdził 1000 liczb w ułamku sekundy — dzięki warunkowi d · d <= n.',hint:'Odczytaj ostatnią linię wydruku po naprawie.'}
     ]}
   ]},
  {id:'gcd',label:'Poziom 2',title:'Poziom 2: nwd(a, b) kontra math.gcd',grouping:'solo',
   intro:'Wersję z odejmowaniem dostajesz gotową (przykład). Twoja kolej: wersja z resztą. Testy sprawdzą przypadki brzegowe (0) i porównają Twoją funkcję z math.gcd dla 900 par liczb. Potem wyścig kroków.',
   reading:{title:'Zero to też liczba',paragraphs:['NWD(5, 0) = 5, bo 0 dzieli się przez każdą liczbę. NWD(0, 0) umownie = 0 (tak liczy math.gcd). Wersja z resztą obsługuje to sama: gdy b = 0, pętla się nie wykona i funkcja zwróci a.','Wersja z odejmowaniem dla (5, 0) zawiesiłaby się: 5 − 0 = 5 w nieskończoność. To kolejny powód, żeby wybrać resztę z dzielenia.']},
   ...note(10,'Samodzielnie. Najczęstsze problemy: return w pętli, osobne a = b; b = a % b (zła reszta) i brak testu z zerem. Test „900 par” jest „bossem” — jeśli przechodzą pojedyncze, a ten nie, pytaj o 0. Wyścig kroków odblokowuje się po nwd. Zatrzymaj klasę przy liczbie 333 335.','Co zwraca Twoja nwd dla (0, 0) i dlaczego to dobrze?','0 — tak samo jak math.gcd. Pętla się nie wykona, a = 0.','Zamiana a, b = a % b, b (odwrócona kolejność) — pętla może się nie kończyć.','Sprawdź math.gcd(12, -18) i swoją nwd(12, -18). Dlaczego różnią się znakiem? Jak to naprawić (abs)?'),
   activities:[
    {type:'pythonLab',id:'ln-gcd',mode:'code',points:4,file:'nwd.py',title:'nwd(a, b) — wersja z resztą',
     prompt:'Uzupełnij `nwd(a, b)`: dopóki `b` nie jest zerem, zamień parę na `(b, a % b)`. Wersja z odejmowaniem jest wyżej jako przykład.',
     starter:NWD_ODEJM+'\n\ndef nwd(a, b):\n    # Dopóki b != 0: a, b = b, a % b\n    return a\n\n\nprint(nwd_odejmowanie(240, 180), nwd(240, 180))\n',
     solution:NWD_ODEJM+'\n\n'+NWD+'\n\nprint(nwd_odejmowanie(240, 180), nwd(240, 180))\n',
     tests:[
      {call:'nwd(48, 18)',expected:'6'},
      {call:'nwd(18, 48)',expected:'6',label:'Odwrotna kolejność'},
      {call:'nwd(17, 5)',expected:'1',label:'Liczby względnie pierwsze'},
      {call:'nwd(5, 0)',expected:'5',label:'Zero jako druga liczba'},
      {call:'nwd(0, 5)',expected:'5',label:'Zero jako pierwsza liczba'},
      {call:'nwd(0, 0)',expected:'0',label:'Dwa zera'},
      {call:'nwd(1000000, 3)',expected:'1',label:'Duże liczby'},
      {call:GCD_ALL,expected:'True',label:'Boss: 900 par liczb zgodnych z math.gcd'}
     ],
     sourceChecks:[{pattern:'def nwd\\(a, b\\):[\\s\\S]*%',label:'nwd używa reszty z dzielenia (%)',hint:'W nwd użyj `a % b`, nie odejmowania.'}],
     hints:['Pętla: `while b != 0:`','W pętli jedna linia: `a, b = b, a % b`. `return a` zostaje po pętli.'],
     questions:[
      {q:'math.gcd(12, -18) daje 6, a Twoja nwd(12, -18) daje -6. Jak najprościej to naprawić?',options:['Zwrócić abs(a) zamiast a','Dodać 12 do wyniku','Zamienić % na //','Nie da się'],correct:[0],explain:'NWD jest zawsze nieujemny. abs(a) usuwa minus, a dla liczb dodatnich niczego nie zmienia.',hint:'Która funkcja Pythona usuwa minus?'}
     ],
     summary:'nwd zgodna z math.gcd: {passed}/{total} testów'},
    {type:'pythonLab',id:'ln-race',mode:'code',points:1,file:'wyscig.py',title:'Wyścig: odejmowania kontra dzielenia',requires:'ln-gcd',requiresTitle:'nwd(a, b)',timeoutMs:8000,
     prompt:'Uruchom program. Dwie funkcje liczą kroki obu wersji Euklidesa dla trzech par liczb.',
     starter:'def kroki_odejmowanie(a, b):\n    kroki = 0\n    while a != b:\n        if a > b:\n            a = a - b\n        else:\n            b = b - a\n        kroki = kroki + 1\n    return kroki\n\n\ndef kroki_reszta(a, b):\n    kroki = 0\n    while b != 0:\n        a, b = b, a % b\n        kroki = kroki + 1\n    return kroki\n\n\nfor a, b in [(48, 18), (100, 7), (1000000, 3)]:\n    print(a, b, "→", kroki_odejmowanie(a, b), "odejmowań,", kroki_reszta(a, b), "dzieleń")\n',
     questions:[
      {q:'Ile odejmowań potrzeba dla pary 1 000 000 i 3?',answer:'333335',accept:['333 335'],inputLabel:'Odejmowania',explain:'333 335 odejmowań, a dzieleń z resztą tylko 2. Ten sam wynik, 166 tysięcy razy mniej pracy.',hint:'Odczytaj ostatnią linię wydruku.'}
     ]}
   ]},
  {id:'factor',label:'Poziom 3',title:'Poziom 3: rozklad(n) i nww(a, b)',grouping:'solo',
   intro:'Ostatni poziom: rozkład na czynniki (słupek z poprzedniej lekcji jako pętla) i NWW ze wzoru. Test sprawdzi, czy iloczyn Twoich czynników daje z powrotem liczbę, a nww porówna z math.lcm.',
   reading:{title:'Słupek jako pętla',paragraphs:['Zaczynasz od d = 2. Dopóki n > 1: jeśli d dzieli n — dopisz d do listy i podziel n przez d (n = n // d), d zostaje (może podzielić jeszcze raz). Jeśli nie dzieli — weź następnego kandydata (d = d + 1).','NWW(a, b) = a · b // NWD(a, b). Używasz // (dzielenie bez reszty), żeby wynik był liczbą całkowitą. Gdy któraś liczba to 0, NWW = 0 — tak liczy math.lcm.']},
   ...note(10,'Samodzielnie, w swoim tempie. rozklad wymaga napisania całej pętli według komentarzy — kto utknie, niech otworzy podpowiedzi. nww jest krótkie, ale ma przypadek brzegowy (0) — bez if dzielenie przez nwd(0, 0) = 0 da błąd ZeroDivisionError. Szybsi: sprawdzają w nww autobusy (12, 18).','Dlaczego w rozkładzie po znalezieniu dzielnika NIE zwiększamy d?','Bo ten sam czynnik może wystąpić kilka razy: 360 dzieli się przez 2 trzy razy.','n / d zamiast n // d (liczby zmiennoprzecinkowe, lista [2, 2, 2.0…]); d = d + 1 w obu gałęziach (gubi powtórzone czynniki).','Napisz kalkulator kafelkarza: dla ściany a × b wypisz bok płytki (nwd) i liczbę płytek.'),
   activities:[
    {type:'pythonLab',id:'ln-factor',mode:'code',points:4,file:'rozklad.py',title:'rozklad(n)',requires:'ln-gcd',requiresTitle:'nwd(a, b)',
     prompt:'Napisz pętlę według komentarzy. Funkcja zwraca listę czynników pierwszych w kolejności rosnącej.',
     starter:'def rozklad(n):\n    czynniki = []\n    d = 2\n    # Dopóki n > 1:\n    #     jeśli d dzieli n: dopisz d (czynniki.append(d)) i podziel n przez d (n = n // d)\n    #     w przeciwnym razie: d = d + 1\n    return czynniki\n\n\nprint(rozklad(360))\n',
     solution:'def rozklad(n):\n    czynniki = []\n    d = 2\n    while n > 1:\n        if n % d == 0:\n            czynniki.append(d)\n            n = n // d\n        else:\n            d = d + 1\n    return czynniki\n\n\nprint(rozklad(360))\n',
     tests:[
      {call:'rozklad(360)',expected:'[2, 2, 2, 3, 3, 5]'},
      {call:'rozklad(97)',expected:'[97]',label:'Liczba pierwsza'},
      {call:'rozklad(1)',expected:'[]',label:'1 nie ma czynników pierwszych'},
      {call:'rozklad(221)',expected:'[13, 17]',label:'„Klucz szyfru” 221'},
      {call:'rozklad(1024)',expected:'[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]',label:'2¹⁰'},
      {call:'all(__import__("math").prod(rozklad(k)) == k for k in range(2, 500))',expected:'True',label:'Iloczyn czynników = liczba (2…499)'}
     ],
     hints:['Pętla: `while n > 1:` (wcięcie 4), w niej `if n % d == 0:` (wcięcie 8).','Pod if: `czynniki.append(d)` i `n = n // d` (wcięcie 12). Potem `else:` (8) i `d = d + 1` (12).'],
     questions:[]},
    {type:'pythonLab',id:'ln-lcm',mode:'code',points:3,file:'nww.py',title:'nww(a, b) kontra math.lcm',requires:'ln-factor',requiresTitle:'rozklad(n)',
     prompt:'Popraw `nww`: dla zera zwróć 0, w pozostałych przypadkach `a * b // nwd(a, b)`. `nwd` masz z poziomu 2.',
     starter:NWD+'\n\ndef nww(a, b):\n    # Jeśli a == 0 albo b == 0: zwróć 0\n    # W przeciwnym razie: a * b // nwd(a, b)\n    return 0\n\n\nprint("Autobusy co 12 i 18 minut spotkają się po", nww(12, 18), "minutach")\n',
     solution:NWD+'\n\ndef nww(a, b):\n    if a == 0 or b == 0:\n        return 0\n    return a * b // nwd(a, b)\n\n\nprint("Autobusy co 12 i 18 minut spotkają się po", nww(12, 18), "minutach")\n',
     tests:[
      {call:'nww(12, 18)',expected:'36',label:'Autobusy 12 i 18 min'},
      {call:'nww(4, 6)',expected:'12'},
      {call:'nww(30, 20)',expected:'60',label:'Kwadrat z płytek 30 × 20'},
      {call:'nww(7, 5)',expected:'35',label:'Względnie pierwsze'},
      {call:'nww(5, 5)',expected:'5'},
      {call:'nww(0, 5)',expected:'0',label:'Zero'},
      {call:LCM_ALL,expected:'True',label:'Boss: 900 par zgodnych z math.lcm'}
     ],
     hints:['Najpierw `if a == 0 or b == 0:` i pod nim `return 0`.','Na końcu `return a * b // nwd(a, b)`.'],
     questions:[
      {q:'Na praktykach masz zmianę co 4 dni, kumpel co 6. Po ilu dniach znowu razem? (użyj nww)',answer:'12',inputLabel:'Dni',explain:'nww(4, 6) = 4 · 6 // 2 = 12.',hint:'Zmień ostatnią linię albo odczytaj test nww(4, 6).'}
     ],
     summary:'Mini-biblioteka liczb zgodna z math: {passed}/{total} testów nww'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: biblioteka pokonana?',grouping:'solo',
   intro:'Odpowiedz na pytanie końcowe, zaznacz samoocenę i pokaż kartę nauczycielowi. Funkcje nwd i nww wrócą na lekcji o ułamkach.',
   ...note(5,'Pytanie końcowe o sens testów porównawczych. Zapowiedz: za dwie lekcje użyjecie nwd i nww do kalkulatora ułamków.','Po co pisać własne nwd, skoro jest math.gcd?','Żeby rozumieć, co liczy, umieć sprawdzić wynik, napisać go w innym języku i znaleźć błąd. Testy porównawcze to codzienność programisty.','„Skoro testy przechodzą dla 3 przykładów, to działa” — dlatego dopisaliśmy 0, 1 i 900 par.','Napisz funkcję czy_wzglednie_pierwsze(a, b) w jednej linii (nwd(a, b) == 1).'),
   activities:[
    choice('ln-exit','Twoja nwd przechodzi testy dla 48 i 18, 17 i 5, 240 i 180. Co jeszcze warto przetestować przed oddaniem?',['Przypadki brzegowe: 0, liczby równe, kolejność argumentów, bardzo duże liczby — i porównanie z math.gcd','Nic — trzy testy wystarczą','Tylko jeszcze jedną parę „zwykłych” liczb','Tylko czy kod ładnie wygląda'],[0],'Błędy kryją się na brzegach: nwd(5, 0), nwd(0, 0), nwd(7, 7). Porównanie z biblioteką dla setek par wyłapie resztę.','Przypomnij sobie testy z zerem.'),
    {type:'resultCard',id:'result',title:'Algorytmy na liczbach w Pythonie — wynik',sources:['ln-r1','ln-r2','ln-trace','ln-predict','ln-prime','ln-prime-bug','ln-gcd','ln-race','ln-factor','ln-lcm','ln-exit'],badges:[
     {min:0,name:'Biblioteka wygrywa',text:'Na razie math.gcd prowadzi. Wróć do przykładu rozwiązanego — trzy linie i jesteś w grze.'},
     {min:0.5,name:'Tester z ambicjami',text:'Twoje funkcje przechodzą większość testów. Jeszcze zera i duże liczby — i remis z biblioteką.'},
     {min:0.85,name:'Pogromca biblioteki',text:'900 par zgodnych z math.gcd. Euklides i Python w jednej drużynie — Twojej.'}
    ]}
   ]}
 ],
 exitTicket:'Masz własną mini-bibliotekę: czy_pierwsza, nwd (dwie wersje), rozklad i nww — sprawdzoną testami brzegowymi i porównaniem z math.gcd i math.lcm. Wiesz, dlaczego reszta z dzielenia wygrywa z odejmowaniem.'
};
