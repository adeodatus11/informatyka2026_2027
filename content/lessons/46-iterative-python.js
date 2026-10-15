import {note, choice} from '../schema.js';

const POTEGA = `def potega(podstawa, wykladnik):
    wynik = 1
    for i in range(wykladnik):
        wynik = wynik * podstawa
    return wynik
`;
const SILNIA = `def silnia(n):
    wynik = 1
    for i in range(1, n + 1):
        wynik = wynik * i
    return wynik
`;
const RATY = `def ile_miesiecy(dlug, procent, rata):
    miesiace = 0
    while dlug > 0:
        dlug = dlug + dlug * procent / 100   # co miesiąc dochodzą odsetki
        dlug = dlug - rata
        miesiace = miesiace + 1
    return miesiace


print(ile_miesiecy(2400, 0, 200))    # telefon na raty 0%: 12 miesięcy
`;

export default {
 id:'46',grade:2,order:20,title:'Programowanie algorytmów iteracyjnych',
 subtitle:'Ile kombinacji ma PIN, ile miesięcy spłacasz telefon na raty i po ilu dniach post dobije do miliona wyświetleń? Pętla policzy to za Ciebie.',
 topic:'Pętle for i while w Pythonie: potęga, silnia, raty, licznik powtórzeń',icon:'code',tags:['for i while','licznik','raty'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.2.d (algorytmy iteracyjne), I.3 (sprawdzanie poprawności dla przykładowych danych), II.1 (pętle for/while, funkcje z parametrami, testowanie), II.2 (Python w przeglądarce)',
 format:{
  name:'Przewiduj → uruchom → zbadaj → zmień → napisz',
  student:'Najpierw przewidujesz, co zrobi gotowy program, i sprawdzasz się. Potem badasz go krok po kroku, układasz pętlę z rozsypanych linii, naprawiasz cudzy błąd i dopiero na końcu piszesz własne pętle. Efekt: funkcje, które liczą kombinacje PIN-u, czas spłaty raty i zasięg posta — wszystkie z zielonymi testami.',
  teacher:'Schemat w duchu PRIMM: każdy nowy kawałek kodu uczeń najpierw czyta i przewiduje (zaznacza też pewność — to moment metapoznania), dopiero potem uruchamia, bada śledzeniem, zmienia gotowy kod i pisze swój. Etap 3 to feedback prowadzący do poprawy: testy pokazują, dla jakich danych silnia się myli, a uczeń poprawia jedną linię. Etap 4 to realny problem (raty), w którym pętla while bez spadku długu zamienia się w pętlę nieskończoną — zatrzymaj klasę na 1 minutę przy tym przypadku. Twoja rola: przed każdym „Uruchom” pytasz „co Twoim zdaniem wypisze?”.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Para jest tylko opcją przy śledzeniu (etap 2): można wspólnie przewidywać, ale odpowiedzi każdy wpisuje u siebie.',
  methods:[
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Przewiduję, co wypisze pętla, i sprawdzam przewidywanie, uruchamiając program.','Piszę pętlę for, która mnoży: potęga (PIN, hasło) i silnia (kolejności).','Piszę pętlę while z licznikiem powtórzeń, gdy nie wiem z góry, ile razy powtórzyć (raty, zasięg posta, cyfry liczby).','Rozpoznaję typowe błędy pętli: zły start (0 zamiast 1), brak zmiany zmiennej w warunku, pętla nieskończona.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Tablica: zapis „wynik = 1, potem wynik = wynik · …”'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz etap 2 na komputerze z projektorem — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: zasięg 3, 9, 27, 81; 5! = 120, 10! = 3 628 800; 10⁴ = 10 000 PIN-ów, 62⁸ = 218 340 105 584 896 haseł; raty: 2400 zł / 200 zł przy 0% = 12 mies., 2000 zł przy 2% mies. i racie 200 zł = 12 mies.; przy 10% mies. i racie 200 zł dług nigdy nie spada; zasięg 100 → ponad 1 000 000 przy ×3 dziennie: 9 dni; suma cyfr 2026 = 10, 123456789 → 45. Oprocentowania to przykłady do obliczeń, nie oferty.',
  summary:'Uczeń przewiduje i śledzi pętle, układa potęgę, naprawia silnię, pisze trzy pętle while z licznikiem (raty, zasięg, suma cyfr). Karta wyniku: maks. 30 pkt. Pytanie na wyjście: kiedy wybierasz while, a kiedy for? Kto skończył wcześniej, sprawdza w ile_miesiecy własny przykład (np. telefon, który chce kupić).'
 },
 sections:[
  {id:'start',label:'Start',title:'Ile kombinacji ma Twój PIN?',grouping:'class',
   intro:'4 cyfry, każda od 0 do 9. Ile jest wszystkich PIN-ów? 10 · 10 · 10 · 10 = 10 000. A hasło z 8 znaków (małe i wielkie litery, cyfry)? Tu bez pętli się nie obejdzie. Najpierw dwa pytania z lekcji o Fibonaccim — bez notatek.',
   reading:{title:'Iteracja = powtarzanie jednego kroku',paragraphs:['Na poprzedniej lekcji pętla liczyła kolejne wyrazy ciągu: skarbonkę, lokatę, Fibonacciego. Dziś ten sam pomysł w innych sytuacjach: mnożenie w pętli (potęga, silnia) i powtarzanie, dopóki coś nie nastąpi (spłata raty, zasięg posta).','for wybierasz, gdy wiesz, ile razy powtórzyć (4 cyfry PIN-u). while — gdy nie wiesz i czekasz na warunek („dopóki dług > 0”). Wtedy liczysz obroty osobną zmienną: licznikiem.']},
   ...note(4,'Hak: zapytaj, ile kombinacji ma PIN do telefonu i jak długo zgadywałby go złodziej (10 000 prób). Potem dwa pytania powtórkowe z lekcji 19. tematu (Fibonacci) — samodzielnie, bez notatek; omów tylko te, z którymi było najwięcej problemów.','Dlaczego 4-cyfrowy PIN ma 10 000 kombinacji, a nie 4 · 10 = 40?','Bo każda cyfra mnoży liczbę możliwości przez 10: 10 · 10 · 10 · 10. Dodawanie byłoby dobre, gdyby cyfry się wykluczały.','Liczenie 4 · 10 albo 9 · 9 · 9 · 9 (zapominanie o zerze).','Zapytaj: ile kombinacji ma PIN 6-cyfrowy? (milion — 100 razy więcej niż 4-cyfrowy).'),
   activities:[
    choice('it-r1','Powtórka: co robi linia a, b = b, a + b w programie Fibonacciego?',['Przesuwa się o jeden wyraz: nowe a to stare b, nowe b to suma starych a i b','Zamienia a i b miejscami','Dodaje a do b i nic więcej','Wypisuje dwa kolejne wyrazy'],[0],'Prawa strona liczy się ze starych wartości, potem obie zmienne dostają nowe wartości naraz — ciąg przesuwa się o jeden wyraz.','Przypomnij sobie podchwytliwą wersję z dwiema osobnymi liniami.'),
    choice('it-r2','Powtórka: lokata 1000 zł, 5% rocznie. Jaką regułę powtarza pętla co rok?',['kapital = kapital * 1.05','kapital = kapital + 5','kapital = 1000 * 5','kapital = kapital + 50 (zawsze tyle samo)'],[0],'Co rok kapitał rośnie o 5% tego, co już jest — mnożymy przez 1,05. Stała kwota (+50) to skarbonka, nie lokata.','Procent liczy się od bieżącej kwoty, nie od początkowej.')
   ]},
  {id:'predict',label:'Przewiduj',title:'Przewiduj, potem uruchom: zasięg posta i silnia',grouping:'solo',
   intro:'Dwa gotowe programy. W pierwszym wpisz, co wypisze, i zaznacz, jak bardzo jesteś pewna/pewny. W drugim przejdź krok po kroku i odpowiedz na pytania.',
   reading:{title:'Mnożenie w pętli: zaczynamy od 1',paragraphs:['Post widzą 3 osoby, każda udostępnia go 3 kolejnym — każdego dnia zasięg mnoży się przez 3. W pętli to jedna linia: zasieg = zasieg * 3.','Silnia 5! = 1 · 2 · 3 · 4 · 5 = 120 to liczba sposobów ułożenia 5 piosenek na playliście. Wynik zaczynamy od 1, bo 1 nie zmienia iloczynu. Start od 0 dałby 0 — zero razy cokolwiek to zero.'],example:{question:'Przykład rozwiązany: ile kolejności mają 3 piosenki A, B, C?',answer:'Na pierwsze miejsce 3 możliwości, na drugie 2, na trzecie 1: 3 · 2 · 1 = 6 (ABC, ACB, BAC, BCA, CAB, CBA). W pętli: wynik = 1, potem · 1, · 2, · 3.'}},
   ...note(8,'Przewidywanie: niech wszyscy wpiszą odpowiedź, zanim ktokolwiek uruchomi. Zapytaj, kto był „bardzo pewny” i się pomylił — to cenna informacja, nie porażka. Najczęstszy błąd: brak numeru dnia albo wypisanie 1 3 9 27 (przesunięcie). Przy śledzeniu silni pokaż na projektorze pierwszy obrót i powiedz na głos: „i = 1, wynik = 1 · 1”.','Dlaczego w silni wynik zaczyna się od 1, a nie od 0?','Bo zaczynamy mnożyć, a 1 jest „neutralne” dla mnożenia. 0 wyzerowałoby wynik na zawsze.','Mylenie range(1, n + 1) z range(n) — przy range(n) pierwsze i = 0 zeruje wynik.','Zmień w śledzeniu n = 5 na n = 10 (przycisk „Zmień kod”) — ile kolejności ma playlista z 10 piosenek?'),
   activities:[
    {type:'pythonLab',id:'it-predict',mode:'predict',points:2,file:'zasieg.py',title:'Zasięg posta rośnie 3 razy dziennie',
     prompt:'Co wypisze ten program? `print(dzien, zasieg)` wypisuje dwie liczby w jednej linii, oddzielone spacją.',
     code:'zasieg = 1\nfor dzien in range(1, 5):\n    zasieg = zasieg * 3\n    print(dzien, zasieg)\n',predictRows:4,
     explain:'`range(1, 5)` daje dni 1, 2, 3, 4 (bez 5!). W każdym dniu najpierw mnożymy, potem wypisujemy: 3, 9, 27, 81. To potęgi trójki: po 4 dniach 3⁴ = 81.'},
    {type:'pythonLab',id:'it-trace',mode:'trace',points:0,file:'playlista.py',title:'Silnia krok po kroku: playlista z 5 piosenek',
     prompt:'Przejdź program krokami. Obserwuj w tabeli, jak zmieniają się `i` i `wynik`.',
     code:'n = 5\nwynik = 1\nfor i in range(1, n + 1):\n    wynik = wynik * i\nprint(n, "piosenek można ułożyć na", wynik, "sposobów")\n',
     questions:[
      {q:'Ile wynosi wynik po obrocie pętli, w którym i = 4?',answer:'24',inputLabel:'wynik =',explain:'1 · 2 · 3 · 4 = 24. Następny obrót pomnoży przez 5 i da 120.',hint:'Idź krokami, aż i = 4 i linia 4 się wykona — wtedy odczytaj wynik.'},
      {q:'Ile razy wykona się linia wynik = wynik * i dla n = 5?',answer:'5',inputLabel:'Liczba obrotów',explain:'range(1, 6) to 1, 2, 3, 4, 5 — pięć obrotów.',hint:'Policz liczby, które daje range(1, n + 1).'},
      {q:'Co by się stało, gdyby druga linia brzmiała wynik = 0?',options:['Wynik zawsze byłby 0','Wynik byłby o 1 mniejszy','Program zgłosiłby błąd','Nic by się nie zmieniło'],correct:[0],explain:'0 · 1 · 2 · … = 0. Przy mnożeniu startujemy od 1, przy dodawaniu (skarbonka) od 0.',hint:'Ile to 0 razy cokolwiek?'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Ułóż potęgę, napraw silnię',grouping:'solo',
   intro:'Najpierw ułożysz z rozsypanych linii funkcję potega — policzy kombinacje PIN-u i hasła. Potem dostaniesz silnię z jednym błędem: testy pokażą, gdzie szukać.',
   reading:{title:'Wzorzec „akumulator”',paragraphs:['Zmienna wynik zbiera (akumuluje) efekt pętli. Trzy linie wracają w każdym takim programie: start przed pętlą (wynik = 1), zmiana w pętli (wynik = wynik * coś) i return po pętli — z mniejszym wcięciem.','Hasło z 8 znaków, gdy każdy znak to jedna z 62 możliwości (26 małych liter, 26 wielkich, 10 cyfr): 62⁸ ≈ 218 bilionów kombinacji. Przy miliardzie prób na sekundę to ok. 2,5 dnia. Każdy dodatkowy znak mnoży ten czas przez 62.']},
   ...note(9,'Samodzielnie. Pułapki w układance: wynik = 0 i wynik = wynik + podstawa (dodawanie zamiast mnożenia). Przy silni nie mów, gdzie jest błąd — każ uruchomić testy i spojrzeć, co zwraca silnia(5). Pytanie dla klasy po 5 minutach: „który test was naprowadził?”.','Czym różni się potęga od silni w kodzie?','Potęga mnoży ciągle przez tę samą liczbę (podstawa), silnia przez kolejne liczby (i). Pętla i akumulator są takie same.','return z wcięciem 8 spacji (wewnątrz pętli) — funkcja kończy się po pierwszym obrocie.','Policz w Pythonie, ile razy więcej kombinacji ma hasło z 10 znaków niż z 8 (62² = 3844).'),
   activities:[
    {type:'pythonLab',id:'it-parsons',mode:'parsons',points:4,file:'potega.py',title:'Układanka: potega(podstawa, wykladnik)',
     prompt:'Ułóż funkcję, która mnoży `podstawa` przez siebie `wykladnik` razy. ↑ ↓ zmieniają kolejność, ← → wcięcie. Dwie linie to pułapki.',
     solution:POTEGA,distractors:['wynik = 0','wynik = wynik + podstawa'],
     tests:[
      {call:'potega(10, 4)',expected:'10000',label:'PIN z 4 cyfr'},
      {call:'potega(2, 10)',expected:'1024'},
      {call:'potega(5, 0)',expected:'1',label:'Wykładnik 0 → 1'},
      {call:'potega(7, 1)',expected:'7'},
      {call:'potega(62, 8)',expected:'218340105584896',label:'Hasło z 8 znaków (62 możliwości)'}
     ],
     hints:['Zacznij od `def`, potem `wynik = 1` (wcięcie 1 poziom).','W pętli `for` jest jedna linia: mnożenie (2 poziomy wcięcia).','`return wynik` ma wcięcie jak `for` — poza pętlą.']},
    {type:'pythonLab',id:'it-bug',mode:'code',points:3,file:'silnia.py',title:'Znajdź błąd: silnia zawsze daje 0',requires:'it-parsons',requiresTitle:'Układanka: potega',
     prompt:'Ta silnia ma jeden błąd. Uruchom, spójrz na testy i popraw jedną linię.',
     starter:SILNIA.replace('wynik = 1','wynik = 0')+'\n\nprint(silnia(5))    # powinno być 120\n',
     solution:SILNIA+'\n\nprint(silnia(5))    # powinno być 120\n',
     tests:[
      {call:'silnia(5)',expected:'120',label:'5 piosenek'},
      {call:'silnia(1)',expected:'1'},
      {call:'silnia(0)',expected:'1',label:'0! = 1 (umowa matematyków)'},
      {call:'silnia(10)',expected:'3628800',label:'10 piosenek'}
     ],
     hints:['Wszystkie testy dają 0. Która linia ustala wartość, od której zaczyna się mnożenie?','Popraw `wynik = 0` na `wynik = 1`.'],
     questions:[
      {q:'Na ile sposobów ułożysz playlistę z 10 piosenek? (wpisz liczbę)',answer:'3628800',accept:['3 628 800'],inputLabel:'Liczba kolejności',explain:'10! = 3 628 800 — ponad 3,6 miliona kolejności.',hint:'Wynik testu silnia(10) albo zmień ostatnią linię na print(silnia(10)).'}
     ]}
   ]},
  {id:'loan',label:'Raty',title:'Telefon na raty: ile miesięcy spłacasz?',grouping:'solo',
   intro:'Nie wiesz z góry, ile będzie rat — dlatego pętla while i licznik miesięcy. Co miesiąc do długu dochodzą odsetki, a potem odejmujesz ratę. Pętla kręci się, dopóki dług jest większy od zera.',
   reading:{title:'while + licznik',paragraphs:['Licznik to zmienna, która zaczyna od 0 i w każdym obrocie rośnie o 1: miesiace = miesiace + 1. Po pętli mówi, ile razy się obróciła.','Uwaga na pułapkę z życia: jeśli rata jest mniejsza niż odsetki, dług rośnie albo stoi w miejscu i nigdy się nie spłaci. W programie to pętla nieskończona — środowisko zatrzyma ją po 3 sekundach. W życiu to spirala zadłużenia.'],example:{question:'Przykład rozwiązany: 500 zł długu, 0%, rata 200 zł.',answer:'Miesiąc 1: 500 − 200 = 300. Miesiąc 2: 100. Miesiąc 3: 100 − 200 = −100 ≤ 0 — koniec. 3 miesiące (ostatnia rata niepełna).'}},
   ...note(9,'Pierwsze „Uruchom” zawiesi program (pętla nieskończona — dług się nie zmienia, brakuje dwóch linii). To celowe: zapytaj, co się stało i dlaczego. Potem uczniowie dopisują dwie linie. Po zaliczeniu zatrzymaj klasę na pytaniu o 10% miesięcznie: to realny mechanizm „chwilówek” i zadłużenia na karcie.','Dlaczego ile_miesiecy(2000, 10, 200) nigdy się nie kończy?','Odsetki to 10% z 2000 = 200 zł, czyli tyle, ile rata. Dług po każdym miesiącu znów wynosi 2000 zł — warunek dlug > 0 jest zawsze prawdziwy.','Licznik zwiększany poza pętlą (wynik 1) albo odsetki dodawane jako procent zamiast procent / 100.','Dopisz do programu wydruk, ile łącznie zapłacisz (suma rat) — porównaj z ceną telefonu.'),
   activities:[
    {type:'pythonLab',id:'it-loan',mode:'code',points:4,file:'raty.py',title:'ile_miesiecy(dlug, procent, rata)',loops:true,
     prompt:'Dopisz w pętli dwie linie: odejmij ratę od długu i zwiększ licznik miesięcy o 1. Uwaga: zanim to zrobisz, program się zawiesza — sprawdź dlaczego.',
     starter:'def ile_miesiecy(dlug, procent, rata):\n    miesiace = 0\n    while dlug > 0:\n        dlug = dlug + dlug * procent / 100   # co miesiąc dochodzą odsetki\n        # ← tu: odejmij ratę od długu\n        # ← tu: zwiększ licznik miesięcy o 1\n    return miesiace\n\n\nprint(ile_miesiecy(2400, 0, 200))    # telefon na raty 0%: 12 miesięcy\n',
     solution:RATY,
     tests:[
      {call:'ile_miesiecy(2400, 0, 200)',expected:'12',label:'Telefon 2400 zł, 0%, rata 200 zł'},
      {call:'ile_miesiecy(1000, 0, 300)',expected:'4',label:'Ostatnia rata niepełna'},
      {call:'ile_miesiecy(2000, 2, 200)',expected:'12',label:'2000 zł, 2% miesięcznie'},
      {call:'ile_miesiecy(0, 5, 100)',expected:'0',label:'Brak długu'}
     ],
     hints:['Pętla kręci się bez końca, bo dlug nigdy nie maleje. Pod linią z odsetkami dopisz `dlug = dlug - rata` (to samo wcięcie).','Licznik: `miesiace = miesiace + 1` — też w pętli, z tym samym wcięciem.'],
     questions:[
      {q:'Co się stanie przy ile_miesiecy(2000, 10, 200)?',options:['Pętla nigdy się nie skończy — odsetki (200 zł) zjadają całą ratę','Spłacisz w 10 miesięcy','Spłacisz w 20 miesięcy','Program zwróci 0'],correct:[0],explain:'10% z 2000 zł = 200 zł odsetek co miesiąc, rata 200 zł — dług stoi w miejscu. Tak działa pułapka „minimalnej raty”: płacisz i nic nie ubywa.',hint:'Policz pierwszy miesiąc: 2000 + 10% − 200 = ?'},
      {q:'Przy 2% miesięcznie spłata 2000 zł trwa tyle samo miesięcy co telefon za 2400 zł bez odsetek. Ile zapłacisz łącznie w 12 ratach po 200 zł (górna granica)?',answer:'2400',accept:['2400zł'],inputLabel:'Kwota (zł)',explain:'12 · 200 = 2400 zł (ostatnia rata jest niepełna, więc trochę mniej). Za 2000 zł pożyczki oddajesz prawie 400 zł więcej.',hint:'Pomnóż liczbę rat przez ratę.'}
     ]}
   ]},
  {id:'counter',label:'Licznik',title:'Zasięg posta i suma cyfr: pętla while od zera',grouping:'solo',
   intro:'Dwa zadania z licznikiem. Pierwsze: po ilu dniach post przekroczy cel wyświetleń? Drugie (odblokuje się po pierwszym): suma cyfr liczby — pętla „odcina” ostatnią cyfrę, aż liczba się skończy.',
   reading:{title:'Dwa nowe działania: % i //',paragraphs:['n % 10 to reszta z dzielenia przez 10, czyli ostatnia cyfra: 2026 % 10 = 6. n // 10 to dzielenie bez reszty, które „odcina” ostatnią cyfrę: 2026 // 10 = 202.','Pętla while n > 0 powtarza: dodaj ostatnią cyfrę do sumy, odetnij ją. Gdy n dojdzie do 0, cyfry się skończyły. Sztuczka z matematyki: liczba dzieli się przez 3, gdy suma jej cyfr dzieli się przez 3.']},
   ...note(10,'Samodzielnie, w swoim tempie. Drugie zadanie odblokowuje się po pierwszym (mastery). Zwróć uwagę na kolejność w zasięgu: najpierw mnożenie, potem licznik — obie linie w pętli. Kto skończy wcześniej, liczy w pytaniu, po ilu dniach post przekroczy milion.','Co się stanie w suma_cyfr, jeśli zapomnisz o n = n // 10?','Pętla nigdy się nie skończy: n się nie zmienia, warunek n > 0 zawsze prawdziwy.','Wpisanie warunku zasieg <= cel (o jeden dzień za dużo, gdy zasięg trafi dokładnie w cel) albo n / 10 zamiast n // 10 (liczba zmiennoprzecinkowa, pętla kręci się bardzo długo).','Zmodyfikuj suma_cyfr na ile_cyfr(n) — zamiast dodawać cyfrę, zwiększaj licznik.'),
   activities:[
    {type:'pythonLab',id:'it-reach',mode:'code',points:3,file:'zasieg.py',title:'dni_do_zasiegu(start, mnoznik, cel)',
     prompt:'Napisz pętlę `while`: dopóki zasięg jest mniejszy niż cel, pomnóż zasięg przez mnożnik i zwiększ licznik dni.',
     starter:'def dni_do_zasiegu(start, mnoznik, cel):\n    zasieg = start\n    dni = 0\n    # Dopóki zasieg < cel: zasieg = zasieg * mnoznik, dni = dni + 1\n\n    return dni\n\n\nprint(dni_do_zasiegu(100, 3, 10000))\n',
     solution:'def dni_do_zasiegu(start, mnoznik, cel):\n    zasieg = start\n    dni = 0\n    while zasieg < cel:\n        zasieg = zasieg * mnoznik\n        dni = dni + 1\n    return dni\n\n\nprint(dni_do_zasiegu(100, 3, 10000))\n',
     tests:[
      {call:'dni_do_zasiegu(100, 3, 10000)',expected:'5',label:'100 → 10 000 wyświetleń, ×3 dziennie'},
      {call:'dni_do_zasiegu(50, 2, 50)',expected:'0',label:'Cel już osiągnięty'},
      {call:'dni_do_zasiegu(1, 2, 1000)',expected:'10'},
      {call:'dni_do_zasiegu(100, 3, 101)',expected:'1'}
     ],
     hints:['Pierwsza linia pętli: `while zasieg < cel:`','W pętli (wcięcie 8 spacji) dwie linie: `zasieg = zasieg * mnoznik` i `dni = dni + 1`.'],
     questions:[
      {q:'Post ma 100 wyświetleń, a zasięg rośnie 3 razy dziennie. Po ilu dniach przekroczy 1 000 000?',answer:'9',inputLabel:'Dni',explain:'100 · 3⁹ = 1 968 300, a po 8 dniach 656 100. Wzrost wykładniczy: z 100 do miliona w 9 dni.',hint:'Zmień ostatnią linię na print(dni_do_zasiegu(100, 3, 1000000)).'}
     ]},
    {type:'pythonLab',id:'it-digits',mode:'code',points:3,file:'cyfry.py',title:'suma_cyfr(n)',requires:'it-reach',requiresTitle:'dni_do_zasiegu',
     prompt:'Dopisz jedną linię w pętli: dodaj ostatnią cyfrę do sumy. Reszta już jest.',
     starter:'def suma_cyfr(n):\n    suma = 0\n    while n > 0:\n        ostatnia = n % 10      # ostatnia cyfra, np. 2026 % 10 = 6\n        # ← tu: dodaj ostatnią cyfrę do sumy\n        n = n // 10            # odetnij ostatnią cyfrę: 2026 // 10 = 202\n    return suma\n\n\nprint(suma_cyfr(2026))    # powinno być 10\n',
     solution:'def suma_cyfr(n):\n    suma = 0\n    while n > 0:\n        ostatnia = n % 10      # ostatnia cyfra, np. 2026 % 10 = 6\n        suma = suma + ostatnia\n        n = n // 10            # odetnij ostatnią cyfrę: 2026 // 10 = 202\n    return suma\n\n\nprint(suma_cyfr(2026))    # powinno być 10\n',
     tests:[
      {call:'suma_cyfr(2026)',expected:'10'},
      {call:'suma_cyfr(7)',expected:'7',label:'Jedna cyfra'},
      {call:'suma_cyfr(0)',expected:'0',label:'Zero'},
      {call:'suma_cyfr(999)',expected:'27'},
      {call:'suma_cyfr(123456789)',expected:'45'}
     ],
     hints:['Suma rośnie o ostatnią cyfrę: `suma = suma + ostatnia` (wcięcie jak linie obok).'],
     questions:[
      {q:'Czy 123456789 dzieli się przez 3? (suma cyfr = 45)',options:['Tak — 45 dzieli się przez 3','Nie — liczba jest nieparzysta','Nie da się tego sprawdzić bez dzielenia'],correct:[0],explain:'45 = 3 · 15, więc 123456789 też dzieli się przez 3 (= 3 · 41152263).',hint:'Czy 45 dzieli się przez 3?'}
     ],
     summary:'Pętle while z licznikiem: zasięg i suma cyfr działają'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik: pętla pod kontrolą?',grouping:'solo',
   intro:'Odpowiedz na ostatnie pytanie, zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(5,'Pytanie końcowe: for czy while. Zbierz 2–3 przykłady z życia uczniów (for: 12 rat stałych, 30 dni challenge; while: dopóki nie uzbierasz, dopóki bateria > 0). Przypomnij o pułapce z ratami.','Kiedy wybierasz while, a kiedy for?','for — gdy znasz liczbę powtórzeń (4 cyfry, 10 piosenek). while — gdy powtarzasz, dopóki nie spełni się warunek (spłata długu, cel zasięgu).','„while jest lepsze, bo umie wszystko” — umie, ale łatwiej o pętlę nieskończoną; tam, gdzie znasz liczbę powtórzeń, for jest bezpieczniejsze.','Napisz w pythonLab pętlę liczącą, ile lat trzeba odkładać 50 zł miesięcznie na prawo jazdy za 4000 zł.'),
   activities:[
    choice('it-exit','Chcesz policzyć, po ilu miesiącach uzbierasz na prawo jazdy. Jaka pętla?',['while — powtarzam, dopóki nie uzbieram; liczę miesiące licznikiem','for — zawsze 12 obrotów','Żadna — to się liczy jednym mnożeniem bez pętli','for i in range(0) — pętla, która nic nie robi'],[0],'Nie wiesz z góry, ile będzie miesięcy — powtarzasz, dopóki stan < cel, i liczysz obroty. Gdy wpłata jest stała, da się to też policzyć dzieleniem, ale pętla zadziała także, gdy wpłaty się zmieniają.','Czy wiesz z góry, ile razy pętla ma się obrócić?'),
    {type:'resultCard',id:'result',title:'Pętle iteracyjne — wynik',sources:['it-r1','it-r2','it-predict','it-trace','it-parsons','it-bug','it-loan','it-reach','it-digits','it-exit'],badges:[
     {min:0,name:'Pętla w budowie',text:'Program jeszcze się kręci w kółko. Wróć do śledzenia silni — tam widać każdy obrót.'},
     {min:0.5,name:'Kontroler pętli',text:'Liczysz PIN-y, raty i zasięgi. Jeszcze kilka zielonych testów i żadna pętla Cię nie zawiesi.'},
     {min:0.85,name:'Pogromca rat',text:'Wiesz, ile miesięcy spłacasz, ile kombinacji ma hasło i kiedy post wybuchnie. Bank by Cię zatrudnił.'}
    ]}
   ]}
 ],
 exitTicket:'Umiesz liczyć w pętli: potęgę (PIN, hasło), silnię (kolejności), spłatę rat i zasięg z licznikiem powtórzeń oraz sumę cyfr. Wiesz, kiedy for, kiedy while — i dlaczego rata mniejsza od odsetek to pętla nieskończona także w życiu.'
};
