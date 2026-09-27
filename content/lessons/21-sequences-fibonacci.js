import {note, choice} from '../schema.js';

export default {
 id:'21',grade:2,title:'Obliczanie wartości elementów ciągu metodą iteracyjną, w tym wartości elementów ciągu Fibonacciego',
 subtitle:'Ile uzbierasz, odkładając 50 zł miesięcznie? Ile da lokata po 10 latach? Napiszesz kalkulator, który to policzy — a przy okazji odkryjesz ciąg Fibonacciego.',
 topic:'Ciągi i Fibonacci w Pythonie',icon:'code',tags:['iteracja','Fibonacci','φ ≈ 1,618'],duration:45,
 curriculum:'Informatyka – liceum/technikum · algorytmy iteracyjne: obliczanie wyrazów ciągów (w tym ciągu Fibonacciego), iteracja a rekurencja, programowanie w wybranym języku (Python)',
 format:{
  name:'Problem → model → program',
  student:'Zaczynasz od prawdziwego problemu: ile pieniędzy uzbierasz. Zapisujesz go jako regułę „następny = poprzedni + coś” (model), a potem jako pętlę w Pythonie (program). Tak samo rozgryziesz ciąg Fibonacciego. Efekt: Twój kalkulator oszczędności i funkcja fib(n), która liczy 50. wyraz w ułamku sekundy.',
  teacher:'Każdy blok ma ten sam rytm: problem z życia ucznia → model (reguła rekurencyjna: aₙ = aₙ₋₁ + 50, kₙ = kₙ₋₁ · 1,05, Fₙ = Fₙ₋₁ + Fₙ₋₂) → program iteracyjny (pętla aktualizuje zmienne). Na starcie retrieval practice z lekcji o sortowaniu. Twoja rola: przy każdym problemie najpierw pytasz „co się zmienia z miesiąca na miesiąc?” i zapisujesz regułę na tablicy, zanim uczniowie zaczną pisać kod. Bonus (rekurencja) pokazuje, dlaczego iteracja jest szybsza — licznik wywołań rośnie lawinowo.',
  grouping:'Samodzielnie, każdy przy swoim komputerze. Etap Fibonacciego (model) można robić w parach przy jednym zadaniu, ale odpowiedzi każdy wpisuje u siebie.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:['Zapisuję sytuację z życia (oszczędzanie, lokata) jako regułę „następny wyraz = poprzedni + / · coś”.','Obliczam wyrazy ciągu w pętli, aktualizując zmienne (metoda iteracyjna).','Piszę funkcję fib(n) i listę pierwszych n wyrazów ciągu Fibonacciego.','Wyjaśniam, dlaczego iteracja jest szybsza od prostej rekurencji dla Fibonacciego.'],
 materials:['Komputer z aktualną przeglądarką (Chrome, Edge lub Firefox) — jeden na osobę. Python działa w przeglądarce, bez instalacji.','Tablica do zapisania reguł ciągów','Opcjonalnie: zdjęcie tarczy słonecznika lub szyszki (spirale)'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz lekcję na komputerze z projektorem i wejdź do etapu 2 — przeglądarka pobierze Pythona (ok. 13 MB). Klucz: skarbonka 50 zł × 18 mies. = 900 zł; lokata 1000 zł na 5% przez 10 lat = 1628,89 zł (zysk 628,89 zł przed podatkiem); przewidywanie „0 1 2 4 8 16”; fib(10) = 55, fib(50) = 12586269025; stosunek → 1,618; fib_rek(20) = 21891 wywołań. Oprocentowanie 5% to przykład do obliczeń — nie aktualna oferta banków.',
  summary:'Uczeń modeluje oszczędzanie ciągiem arytmetycznym, lokatę ciągiem geometrycznym, pisze kalkulator oszczędności z input(), funkcje fib i fib_lista oraz obserwuje zbieżność do złotej proporcji. Na karcie wyniku maks. 25 pkt. Pytanie na wyjście: czym różni się reguła skarbonki od reguły lokaty i dlaczego lokata po wielu latach rośnie coraz szybciej?'
 },
 sections:[
  {id:'start',label:'Start',title:'Ile uzbierasz do wakacji?',grouping:'class',
   intro:'Odkładasz 50 zł miesięcznie. Ile będziesz mieć po roku? A po 3 latach, jeśli pieniądze leżą na lokacie? Dziś napiszesz program, który to policzy. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   ...note(4,'Hak: zapytaj, na co uczniowie odkładają (wakacje, telefon, prawo jazdy) i ile miesięcznie. Zapisz na tablicy jeden przykład — przyda się do kalkulatora. Dwa pytania powtórkowe o sortowaniu przez wstawianie, bez notatek. Potem wszyscy przechodzą do etapu 2.','Ile uzbierasz w rok, odkładając 50 zł miesięcznie — i jak to policzyłeś?','600 zł. Większość mnoży 12 · 50, ale można też dodawać co miesiąc: 50, 100, 150… — tak liczy komputer w pętli.','Mylenie liczby miesięcy z liczbą wpłat (np. od stycznia do grudnia włącznie to 12 wpłat, nie 11).','Zapytaj, czy ktoś ma konto oszczędnościowe albo lokatę i wie, ile daje procent rocznie.'),
   activities:[
    choice('cf-r1','Kiedy sortowanie przez wstawianie jest wyjątkowo szybkie?',['Gdy lista jest prawie posortowana','Gdy lista jest zupełnie losowa','Gdy lista jest posortowana odwrotnie','Zawsze działa tak samo szybko'],[0],'Na prawie posortowanej liście prawie każda karta zostaje na miejscu po jednym porównaniu — w wyścigu było 103 porównań zamiast 4950.','Przypomnij sobie wyścig algorytmów na 100 liczbach.'),
    choice('cf-r2','Co się stanie, gdy w pętli while zapomnisz zmieniać zmiennej z warunku (np. j -= 1)?',['Pętla nigdy się nie skończy','Python sam zmniejszy zmienną','Pętla wykona się dokładnie raz','Python zgłosi błąd składni przed uruchomieniem'],[0],'Warunek cały czas jest prawdziwy, więc pętla kręci się bez końca — to pętla nieskończona. Python nie wykryje tego przed uruchomieniem.','Przypomnij sobie błąd 2 z warsztatu „napraw kod”.')
   ]},
  {id:'money',label:'Pieniądze',title:'Skarbonka i lokata: od reguły do pętli',grouping:'solo',
   intro:'Dwa problemy, jedna metoda. W skarbonce co miesiąc dochodzi tyle samo. Na lokacie co rok dochodzi procent od tego, co już masz. Zapisz regułę w pętli — komputer policzy każdy kolejny wyraz.',
   reading:{title:'Ciąg, czyli kolejne stany',paragraphs:[
    'Skarbonka: 0, 50, 100, 150… Każdy wyraz to poprzedni + 50 — to ciąg arytmetyczny. Lokata 5% rocznie: 1000, 1050, 1102,50… Każdy wyraz to poprzedni · 1,05 — to ciąg geometryczny. Zysk rośnie coraz szybciej, bo procent liczy się też od wcześniejszych odsetek (procent składany).',
    'Metoda iteracyjna: jedna zmienna przechowuje bieżący wyraz, a pętla powtarza regułę: stan = stan + wplata albo kapital = kapital * (1 + procent / 100). W Polsce od zysku z lokaty płaci się 19% podatku (tzw. podatek Belki) — w zadaniu go pomijamy.'
   ],example:{question:'Przykład rozwiązany: 200 zł na lokacie 10% rocznie przez 2 lata.',answer:'Rok 1: 200 · 1,1 = 220 zł. Rok 2: 220 · 1,1 = 242 zł. Zysk 42 zł — więcej niż 2 · 20 zł, bo w drugim roku procent liczy się też od odsetek z pierwszego.'}},
   ...note(10,'Zanim uczniowie zaczną pisać, zapisz na tablicy dwie reguły: stan → stan + 50 oraz kapitał → kapitał · 1,05. Zapytaj, która szybciej rośnie po 30 latach (lokata — rośnie coraz szybciej). Uczniowie robią dwa zadania samodzielnie; krąż i pytaj „co robi pętla w każdym obrocie?”.','Dlaczego zysk z lokaty po 10 latach (628,89 zł) jest większy niż 10 · 50 zł?','Bo od drugiego roku procent liczy się także od wcześniejszych odsetek — to procent składany. Każdy rok dokłada trochę więcej niż poprzedni.','Pisanie 5 zamiast 5 / 100 (kapitał rośnie 6 razy co rok) albo kapital * procent / 100 bez dodania kapitału (zostają same odsetki).','Zmień lokatę na 30 lat i porównaj ze skarbonką o tej samej sumie wpłat — to argument, żeby zaczynać oszczędzać wcześnie.'),
   activities:[
    {type:'pythonLab',id:'cf-save',mode:'code',points:3,file:'skarbonka.py',title:'Skarbonka: ciąg arytmetyczny',
     prompt:'Uzupełnij funkcję: co miesiąc stan skarbonki rośnie o wpłatę. Funkcja zwraca stan po podanej liczbie miesięcy.',
     starter:'def skarbonka(wplata, miesiace):\n    stan = 0\n    for miesiac in range(miesiace):\n        pass  # ← zamiast pass: stan rośnie o wpłatę\n    return stan\n\n\nprint(skarbonka(50, 12))\n',
     solution:'def skarbonka(wplata, miesiace):\n    stan = 0\n    for miesiac in range(miesiace):\n        stan = stan + wplata\n    return stan\n\n\nprint(skarbonka(50, 12))\n',
     tests:[
      {call:'skarbonka(50, 12)',expected:'600',label:'50 zł przez rok'},
      {call:'skarbonka(50, 0)',expected:'0',label:'0 miesięcy'},
      {call:'skarbonka(120, 10)',expected:'1200'},
      {call:'skarbonka(35.5, 4)',expected:'142.0',tol:0.001}
     ],
     hints:['W każdym obrocie pętli: nowy stan = stary stan + wpłata.','Zamiast `pass` napisz `stan = stan + wplata` (albo krócej: `stan += wplata`).'],
     questions:[
      {q:'Odkładasz 50 zł miesięcznie. Ile uzbierasz przez 18 miesięcy?',answer:'900',accept:['900.0','900zł'],inputLabel:'Kwota (zł)',explain:'skarbonka(50, 18) = 900. Możesz to sprawdzić, zmieniając ostatnią linię programu.',hint:'Zmień w ostatniej linii 12 na 18 i uruchom.'}
     ]},
    {type:'pythonLab',id:'cf-deposit',mode:'code',points:3,file:'lokata.py',title:'Lokata: ciąg geometryczny',
     prompt:'Co rok kapitał rośnie o podany procent. Uzupełnij pętlę. Wynik jest zaokrąglany do groszy.',
     starter:'def lokata(kapital, procent, lata):\n    for rok in range(lata):\n        pass  # ← zamiast pass: kapitał rośnie o procent\n    return round(kapital, 2)\n\n\nprint(lokata(1000, 5, 10))\n',
     solution:'def lokata(kapital, procent, lata):\n    for rok in range(lata):\n        kapital = kapital * (1 + procent / 100)\n    return round(kapital, 2)\n\n\nprint(lokata(1000, 5, 10))\n',
     tests:[
      {call:'lokata(1000, 5, 10)',expected:'1628.89',tol:0.011,label:'1000 zł, 5%, 10 lat'},
      {call:'lokata(1000, 5, 0)',expected:'1000',label:'0 lat — bez zmian'},
      {call:'lokata(500, 10, 2)',expected:'605.0',tol:0.011},
      {call:'lokata(2000, 3, 1)',expected:'2060.0',tol:0.011}
     ],
     hints:['5% to 5 / 100 = 0,05. Po roku masz kapitał + 5% kapitału, czyli kapitał · 1,05.','W pętli: `kapital = kapital * (1 + procent / 100)`'],
     questions:[
      {q:'Ile wynosi sam zysk (bez podatku) z lokaty 1000 zł na 5% przez 10 lat?',answer:'628.89',accept:['628.9'],inputLabel:'Zysk (zł)',explain:'1628,89 − 1000 = 628,89 zł. Gdyby procent liczył się tylko od 1000 zł, byłoby 500 zł — reszta to „procent od procentu”.',hint:'Odejmij wpłacone 1000 zł od wyniku lokata(1000, 5, 10).'}
     ]}
   ]},
  {id:'calc',label:'Kalkulator',title:'Twój kalkulator: ile miesięcy do celu?',grouping:'solo',
   intro:'Program pyta o wpłatę i cel, a potem liczy, po ilu miesiącach go osiągniesz. Wpisz swoje dane w pole „Dane wejściowe” — każda linia to jedna odpowiedź na input().',
   reading:{title:'Pętla while: powtarzaj, dopóki…',paragraphs:[
    'Nie wiemy z góry, ile razy trzeba dodać wpłatę — dlatego zamiast for używamy while stan < cel:. Pętla dodaje wpłatę i zwiększa licznik miesięcy, dopóki cel nie jest osiągnięty.',
    'input() zawsze zwraca tekst. float(input(…)) zamienia go na liczbę, np. "50" → 50.0. Bez tego Python próbowałby dodać tekst do liczby i zgłosiłby błąd.'
   ]},
   ...note(5,'Krótkie zadanie z input() — pokaż pole „Dane wejściowe” na projektorze. Niech każdy wpisze własny cel (np. 1500 zł na wakacje). Zapytaj, kto ma najkrótszy i najdłuższy czas.','Co się stanie, gdy wpłata będzie równa 0?','Pętla while nigdy się nie skończy (stan zawsze 0 < cel) — środowisko zatrzyma program po 3 s. W prawdziwym programie trzeba to sprawdzić wcześniej (if wplata <= 0).','Brak miesiac = miesiac + 1 w pętli (wynik zawsze 0) albo wpisanie liczb z przecinkiem (12,5) w polu danych — potrzebna kropka.','Dopisz sprawdzenie: jeśli wpłata <= 0, wypisz „Z taką wpłatą nigdy nie osiągniesz celu”.'),
   activities:[
    {type:'pythonLab',id:'cf-calc',mode:'code',points:3,file:'kalkulator.py',title:'Kalkulator oszczędności',input:true,stdin:['50','1000'],
     prompt:'Uzupełnij pętlę `while`: dopóki stan jest mniejszy niż cel, dodaj wpłatę i zwiększ licznik miesięcy. Wpisz własne dane i kliknij „Uruchom”, potem „Sprawdź”.',
     starter:'wplata = float(input("Ile odkładasz miesięcznie (zł)? "))\ncel = float(input("Ile chcesz uzbierać (zł)? "))\n\nstan = 0\nmiesiac = 0\n# Dopóki stan < cel: dodaj wpłatę do stanu i zwiększ miesiac o 1.\n\nprint("Cel osiągniesz po", miesiac, "miesiącach. Będziesz mieć", stan, "zł.")\n',
     solution:'wplata = float(input("Ile odkładasz miesięcznie (zł)? "))\ncel = float(input("Ile chcesz uzbierać (zł)? "))\n\nstan = 0\nmiesiac = 0\nwhile stan < cel:\n    stan = stan + wplata\n    miesiac = miesiac + 1\n\nprint("Cel osiągniesz po", miesiac, "miesiącach. Będziesz mieć", stan, "zł.")\n',
     tests:[
      {stdin:['50','600'],contains:['po 12 miesiącach'],label:'50 zł/mies., cel 600 zł → 12 miesięcy'},
      {stdin:['100','250'],contains:['po 3 miesiącach','300.0 zł'],label:'100 zł/mies., cel 250 zł → 3 miesiące, 300 zł'},
      {stdin:['40','0'],contains:['po 0 miesiącach'],label:'Cel 0 zł → już osiągnięty'}
     ],
     hints:['Pętla: `while stan < cel:` (z dwukropkiem).','W pętli dwie linie z wcięciem: `stan = stan + wplata` i `miesiac = miesiac + 1`.'],
     summary:'Kalkulator oszczędności działa: {passed}/{total} testów'}
   ]},
  {id:'fibmodel',label:'Fibonacci',title:'Króliki, słoneczniki i ciąg Fibonacciego',grouping:'pair',
   intro:'W 1202 roku Fibonacci zapytał: ile par królików będzie po roku, jeśli każda dorosła para co miesiąc rodzi nową? Wychodzi ciąg 0, 1, 1, 2, 3, 5, 8… — każdy wyraz to suma dwóch poprzednich. Prześledź program, a potem przewidź wynik podchwytliwej wersji.',
   reading:{title:'Dwa poprzednie wyrazy',paragraphs:[
    'Ciąg Fibonacciego: F₀ = 0, F₁ = 1, a każdy kolejny to suma dwóch poprzednich: Fₙ = Fₙ₋₁ + Fₙ₋₂. Program pamięta tylko dwa ostatnie wyrazy: a i b. W każdym kroku przesuwa je o jeden: nowe a to stare b, nowe b to stare a + b.',
    'Liczby Fibonacciego naprawdę pojawiają się w przyrodzie: pestki w tarczy słonecznika układają się w spirale, których liczba to zwykle dwie sąsiednie liczby Fibonacciego (np. 34 i 55). Podobnie łuski szyszek i ananasa.'
   ]},
   ...note(7,'Pary mogą pracować przy jednym ekranie, ale każdy wpisuje odpowiedzi u siebie. Najpierw śledzenie (3 min), potem przewidywanie — to kluczowy moment: większość wpisze 0 1 1 2 3 5. Po uruchomieniu zapytaj, skąd się wzięły potęgi dwójki. Wyjaśnij zamianę jednoczesną: Python liczy całą prawą stronę, zanim cokolwiek przypisze.','Dlaczego wersja z dwiema osobnymi liniami a = b i b = a + b daje 0 1 2 4 8 16?','Bo po a = b stara wartość a przepada. b = a + b to wtedy b + b — liczba się podwaja. W wersji a, b = b, a + b prawa strona jest liczona ze starych wartości.','Uczniowie liczą Fibonacciego od 1, 1 (też spotykane), a w programie start to 0, 1 — to tylko przesunięcie numeracji.','Zapytaj o przykład z przyrody i o to, czy „złota proporcja” jest wszędzie — wiele przykładów z internetu (np. Mona Lisa) to mity, ale spirale słonecznika są faktem.'),
   activities:[
    {type:'pythonLab',id:'cf-fib-trace',mode:'trace',points:0,file:'fibonacci.py',title:'Fibonacci krok po kroku',
     prompt:'Przejdź program kroki. Obserwuj, jak a i b „przesuwają się” po ciągu.',
     code:'a, b = 0, 1\nfor n in range(8):\n    print(a)\n    a, b = b, a + b    # nowe a = stare b, nowe b = stare a + b\n',
     questions:[
      {q:'Ile wynosi b w chwili, gdy program wypisuje 5 (podświetlona linia 3, a = 5)?',answer:'8',inputLabel:'b =',explain:'b zawsze wyprzedza a o jeden wyraz: gdy a = 5, to b = 8.',hint:'Idź krokami, aż w tabeli a = 5 i podświetlona jest linia 3.'},
      {q:'Jaka liczba byłaby następna po 13, gdyby pętla działała dłużej?',answer:'21',inputLabel:'Następny wyraz',explain:'8 + 13 = 21 — suma dwóch poprzednich wyrazów.',hint:'Dodaj dwa ostatnie wypisane wyrazy.'}
     ]},
    {type:'pythonLab',id:'cf-predict',mode:'predict',points:2,file:'podchwytliwy.py',title:'Podchwytliwe: dwie linie zamiast jednej',
     prompt:'Ten program różni się jedną rzeczą: przypisanie jest w dwóch liniach. `print(a, end=" ")` wypisuje liczby w jednej linii, oddzielone spacją. Co pojawi się na ekranie?',
     code:'a, b = 0, 1\nfor n in range(6):\n    print(a, end=" ")\n    a = b\n    b = a + b\n',predictRows:1,
     explain:'To nie Fibonacci! Po `a = b` stara wartość a przepada, więc `b = a + b` to w praktyce b + b — liczby się podwajają. Dlatego piszemy `a, b = b, a + b`: Python najpierw liczy prawą stronę ze starych wartości, a potem wpisuje obie naraz.'}
   ]},
  {id:'fibprog',label:'fib(n)',title:'Program: fib(n) i złota proporcja',grouping:'solo',
   intro:'Teraz sam: funkcja fib(n) zwraca n-ty wyraz, a fib_lista(n) — listę pierwszych n wyrazów. Potem sprawdzisz, do jakiej liczby zbliża się stosunek dwóch kolejnych wyrazów.',
   reading:{title:'Iteracja: pętla zamiast wzoru',paragraphs:[
    'fib(n) powtarza n razy przesunięcie a, b = b, a + b i zwraca a. Dla n = 50 to tylko 50 obrotów pętli, a wynik ma 11 cyfr: 12 586 269 025. Python liczy duże liczby całkowite dokładnie, bez zaokrągleń.',
    'Stosunek kolejnych wyrazów (8 / 5, 13 / 8, 21 / 13…) zbliża się do liczby φ ≈ 1,618 — złotej proporcji. To granica ciągu: im dalej, tym bliżej, choć nigdy dokładnie.'
   ]},
   ...note(9,'Samodzielnie. Zwróć uwagę na miejsce return — po pętli. W fib_lista append musi być PRZED przesunięciem a, b (inaczej lista zaczyna się od 1). Szybcy uczniowie przechodzą do złotej proporcji i bonusu.','Dlaczego fib(50) liczy się błyskawicznie, choć wynik ma 11 cyfr?','Bo pętla wykonuje tylko 50 obrotów — każdy wyraz jest liczony raz, na podstawie dwóch poprzednich.','fib_lista(n) zwraca listę przesuniętą o jeden (append po przesunięciu) albo return wewnątrz pętli.','Zapytaj, dlaczego stosunek nigdy nie będzie dokładnie 1,618… (φ jest liczbą niewymierną).'),
   activities:[
    {type:'pythonLab',id:'cf-fib',mode:'code',points:5,file:'fib.py',title:'fib(n) i fib_lista(n)',
     prompt:'Uzupełnij obie funkcje w miejscach z komentarzami. Metoda: pętla, która n razy przesuwa `a, b = b, a + b`.',
     starter:'def fib(n):\n    a, b = 0, 1\n    # Powtórz n razy przesunięcie a, b = b, a + b.\n\n    return a\n\n\ndef fib_lista(n):\n    wynik = []\n    a, b = 0, 1\n    # n razy: dopisz a do listy (wynik.append(a)), potem przesuń a, b.\n\n    return wynik\n\n\nprint(fib(10))\nprint(fib_lista(10))\n',
     solution:'def fib(n):\n    a, b = 0, 1\n    for i in range(n):\n        a, b = b, a + b\n    return a\n\n\ndef fib_lista(n):\n    wynik = []\n    a, b = 0, 1\n    for i in range(n):\n        wynik.append(a)\n        a, b = b, a + b\n    return wynik\n\n\nprint(fib(10))\nprint(fib_lista(10))\n',
     tests:[
      {call:'fib(0)',expected:'0'},
      {call:'fib(1)',expected:'1'},
      {call:'fib(2)',expected:'1'},
      {call:'fib(10)',expected:'55'},
      {call:'fib(50)',expected:'12586269025',label:'50. wyraz — 11 cyfr'},
      {call:'fib_lista(8)',expected:'[0, 1, 1, 2, 3, 5, 8, 13]'},
      {call:'fib_lista(1)',expected:'[0]'}
     ],
     hints:['W fib: `for i in range(n):` i w środku (wcięcie) `a, b = b, a + b`.','W fib_lista ta sama pętla, ale przed przesunięciem dopisz `wynik.append(a)`.','Oba `return` zostają poza pętlą (4 spacje wcięcia).'],
     summary:'fib(50) = 12 586 269 025 — policzone w ułamku sekundy'},
    {type:'pythonLab',id:'cf-golden',mode:'code',points:1,file:'zlota.py',title:'Złota proporcja: stosunek kolejnych wyrazów',
     prompt:'Uruchom program. Wypisuje dzielenie każdego wyrazu przez poprzedni. Obserwuj ostatnią kolumnę.',
     starter:'a, b = 1, 1\nfor krok in range(15):\n    a, b = b, a + b\n    print(b, "/", a, "=", round(b / a, 6))\n',
     questions:[
      {q:'Do jakiej liczby zbliża się stosunek kolejnych wyrazów? Podaj 3 cyfry po przecinku.',answer:'1.618',accept:['1.6180','1.61803','1.618034'],inputLabel:'φ ≈',explain:'φ = (1 + √5) / 2 ≈ 1,618034 — złota proporcja. Ostatnie linie różnią się dopiero na 6. miejscu po przecinku.',hint:'Odczytaj ostatnią liczbę w ostatniej linii i zaokrąglij do 3 miejsc.'},
      {q:'Gdzie w przyrodzie naprawdę spotkasz liczby Fibonacciego?',options:['W liczbie spiral pestek w tarczy słonecznika (np. 34 i 55)','W liczbie dni w roku','W każdym logo znanej firmy','W ludzkim DNA jako kod genetyczny'],correct:[0],explain:'Spirale w słoneczniku, szyszkach i ananasie to zwykle dwie sąsiednie liczby Fibonacciego. Za to wiele „złotych proporcji” w logo i obrazach z internetu to mity.',hint:'Wróć do wyjaśnienia z poprzedniego etapu.'}
     ]}
   ]},
  {id:'bonus',label:'Bonus',title:'Bonus: rekurencja kontra iteracja',grouping:'solo',
   intro:'Fibonacciego da się zapisać „wprost z definicji”: funkcja wywołuje samą siebie dla n − 1 i n − 2 (rekurencja). Wygląda elegancko — ale uruchom i zobacz, ile razy funkcja się wywołuje. Zadanie dla chętnych, nie wlicza się do oceny.',
   reading:{title:'Lawina wywołań',paragraphs:[
    'fib_rek(5) woła fib_rek(4) i fib_rek(3). fib_rek(4) znów woła fib_rek(3) — liczy go drugi raz. Te same wyrazy są liczone wiele razy, a liczba wywołań rośnie prawie tak szybko jak sam ciąg.',
    'Wersja iteracyjna liczy każdy wyraz dokładnie raz: fib(25) to 25 obrotów pętli, a fib_rek(25) — ponad 240 tysięcy wywołań. To różnica między aplikacją, która odpowiada od razu, a taką, która się „wiesza”.'
   ]},
   ...note(6,'Dla szybszych uczniów; pozostali kończą fib(n). Uruchomienie trwa ułamek sekundy — ale pokaż, że dla n = 35 program przekroczyłby limit czasu (ok. 30 milionów wywołań).','Dlaczego wersja rekurencyjna jest tak wolna?','Bo liczy te same wyrazy wiele razy: fib_rek(3) jest liczone przy fib_rek(5) dwa razy, fib_rek(2) trzy razy itd. Iteracja liczy każdy raz.','„Rekurencja zawsze jest wolna” — nie, problemem jest powtarzanie tych samych obliczeń; da się je zapamiętać (memoizacja).','Zapytaj: jak przyspieszyć rekurencję? (zapamiętywać policzone wyniki w słowniku — memoizacja).',true),
   activities:[
    {type:'pythonLab',id:'cf-rec',mode:'code',points:1,file:'rekurencja.py',title:'Licznik wywołań fib_rek(n)',timeoutMs:8000,
     prompt:'Uruchom program i porównaj liczbę wywołań dla n = 10, 20 i 25.',
     starter:'wywolania = 0\n\n\ndef fib_rek(n):\n    global wywolania       # licznik wspólny dla wszystkich wywołań\n    wywolania += 1\n    if n < 2:\n        return n\n    return fib_rek(n - 1) + fib_rek(n - 2)\n\n\nfor n in [10, 20, 25]:\n    wywolania = 0\n    wynik = fib_rek(n)\n    print("fib(", n, ") =", wynik, "   wywołań funkcji:", wywolania)\n',
     questions:[
      {q:'Ile wywołań potrzebowała wersja rekurencyjna dla n = 20?',answer:'21891',accept:['21 891'],inputLabel:'Wywołania',explain:'21 891 wywołań, a pętla w wersji iteracyjnej wykonuje tylko 20 obrotów.',hint:'Odczytaj drugą linię wyniku.'},
      {q:'Dlaczego wersja iteracyjna (z pętlą) jest dużo szybsza?',options:['Liczy każdy wyraz tylko raz, a rekurencja liczy te same wyrazy wiele razy','Bo pętla for działa na karcie graficznej','Bo rekurencja nie umie dodawać dużych liczb','Nie ma różnicy w szybkości'],correct:[0],explain:'Rekurencja „z definicji” powtarza te same obliczenia. Iteracja przesuwa a i b raz na krok.',hint:'Porównaj liczbę wywołań z liczbą obrotów pętli.'}
     ]}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań, skarbonki, lokaty, kalkulatora i Fibonacciego. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Podsumuj rytm lekcji: problem → reguła (model) → pętla (program). Zadaj pytanie na wyjście. Zachęć, żeby każdy wpisał w kalkulator swój prawdziwy cel i zapamiętał wynik.','Czym różni się reguła skarbonki od reguły lokaty i dlaczego lokata po wielu latach rośnie coraz szybciej?','Skarbonka: następny = poprzedni + stała kwota (ciąg arytmetyczny). Lokata: następny = poprzedni · 1,05 (ciąg geometryczny) — odsetki liczą się od coraz większej kwoty.','Uczniowie myślą, że 5% przez 10 lat to zawsze dokładnie 50% zysku — pomijają procent składany.','Zapytaj: ile lat trzeba trzymać 1000 zł na 5%, żeby się podwoiło? (15 lat — można to policzyć pętlą while).'),
   activities:[{type:'resultCard',id:'result',title:'Ciągi i Fibonacci — wynik',sources:['cf-r1','cf-r2','cf-save','cf-deposit','cf-calc','cf-fib-trace','cf-predict','cf-fib','cf-golden'],badges:[
    {min:0,name:'Skarbonka w budowie',text:'Pierwsze wpłaty zrobione. Kolejna pętla i zacznie się zgadzać co do grosza.'},
    {min:0.5,name:'Doradca finansowy (junior)',text:'Liczysz oszczędności i lokaty szybciej niż aplikacja banku. Prawie.'},
    {min:0.85,name:'Złota proporcja',text:'1,618 — tyle razy lepiej od przeciętnej. Fibonacci byłby dumny.'}
   ]}]}
 ],
 exitTicket:'Umiesz zamienić problem z życia na regułę ciągu i policzyć kolejne wyrazy w pętli: skarbonkę, lokatę z procentem składanym i ciąg Fibonacciego. Wiesz też, dlaczego iteracja liczy fib(50) w ułamku sekundy, a prosta rekurencja by się zadławiła.'
};
