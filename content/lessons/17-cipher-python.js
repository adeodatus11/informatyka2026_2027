import {note, choice} from '../schema.js';

const SZYFRUJ_LITERE = `def szyfruj_litere(litera, klucz):
    if "A" <= litera <= "Z":
        kod = ord(litera) - ord("A")
        nowy = (kod + klucz) % 26
        return chr(nowy + ord("A"))
    return litera
`;

const DESZYFRUJ = `def deszyfruj(tekst, klucz):
    wynik = ""
    for litera in tekst:
        if "A" <= litera <= "Z":
            litera = chr((ord(litera) - ord("A") - klucz) % 26 + ord("A"))
        wynik = wynik + litera
    return wynik
`;

const TAJNA = 'SLDWZ OZ DKLQVT H ACLNZHYT EZ ATYRHTY';

export default {
 id:'17',grade:2,title:'Programowanie algorytmu szyfrowania tekstu metodą podstawieniową',
 subtitle:'Napiszesz program, który szyfruje całą wiadomość w tysięcznej części sekundy — i łamie szyfr Cezara, sprawdzając wszystkie klucze.',
 topic:'Szyfr Cezara w Pythonie',icon:'code',tags:['ord/chr','% 26','pętla for'],duration:45,
 curriculum:'Informatyka – liceum/technikum · algorytmy szyfrowania (podstawieniowe), programowanie rozwiązań w wybranym języku (Python)',
 format:{
  name:'Przykłady rozwiązane z wygaszaniem + programowanie w parach',
  student:'Najpierw przewidujesz i uruchamiasz gotowe programy, potem układasz kod z klocków, a na końcu piszesz szyfrownik sam. W parze: kierowca pisze na swoim komputerze, nawigator czyta testy i pilnuje wcięć — przy każdym zadaniu zamiana. Efekt: działający szyfrownik i złamana tajna wiadomość.',
  teacher:'Schemat „wygaszania”: od przykładu rozwiązanego (etap 3 — śledzisz kod na projektorze i mówisz na głos, co robi każda linia) przez częściowo gotowe rozwiązanie (etap 4 — układanka z linii) do pracy samodzielnej (etap 5 — pusta funkcja i testy). Pary pracują w rolach kierowca–nawigator: kierowca pisze u siebie, nawigator dyktuje, czyta wyniki testów i pilnuje dwukropków i wcięć. Po zaliczeniu zadania nawigator odtwarza rozwiązanie na swoim komputerze i tłumaczy na głos każdą linię — każdy ma własną kartę wyniku. Twoja rola: pilnujesz zamiany ról i zadajesz pytania („co zwraca ta funkcja dla Z?”) zamiast podawać kod.',
  grouping:'Pary kierowca–nawigator, każdy przy swoim komputerze. Role zamieniają się przy każdym zadaniu (etapy 4, 5, 6). Przy nieparzystej liczbie osób — trójka (drugi nawigator pilnuje testów) albo praca samodzielna: wszystkie zadania da się wykonać samemu.',
  methods:[
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Uczenie kooperacyjne (pary kierowca–nawigator)',url:'https://metodyka.covepolska.pl/metoda-uczenie-kooperacyjne.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Uruchamiam program w Pythonie i przewiduję, co wypisze pętla for przechodząca po napisie.','Zamieniam literę na liczbę i z powrotem (ord, chr) i zawijam alfabet działaniem % 26.','Piszę funkcje szyfruj i deszyfruj, które przechodzą testy.','Łamię szyfr Cezara, sprawdzając w pętli wszystkie klucze, i wyjaśniam, dlaczego to słaby szyfr.'],
 materials:['Komputer z aktualną przeglądarką (Chrome, Edge lub Firefox) — jeden na osobę. Python działa w przeglądarce, bez instalacji i bez logowania.','Projektor do pokazania śledzenia kodu w etapie 3','Opcjonalnie: kartka z alfabetem A = 0 … Z = 25 z poprzedniej lekcji'],
 teacherGuide:{
  preparation:'Przed dzwonkiem otwórz lekcję na komputerze z projektorem i wejdź do etapu 2 — przeglądarka pobierze Pythona (ok. 13 MB) i zapamięta go. Na początku lekcji poproś uczniów, żeby od razu otworzyli etap 2: przy słabym łączu 30 komputerów pobiera Pythona kilkadziesiąt sekund, a w tym czasie robicie pytania powtórkowe. Klucz: KOT → NRW; tajna wiadomość ma klucz 11 i hasło PINGWIN („HASLO DO SZAFKI W PRACOWNI TO PINGWIN”). Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe do porównania; uczeń, który utknie, może je odsłonić po wykorzystaniu podpowiedzi (dostaje wtedy ¼ punktów). Ustal pary przed lekcją.',
  summary:'Uczeń uruchamia i przewiduje wynik programu, wyjaśnia rolę ord, chr i % 26, pisze szyfruj/deszyfruj przechodzące 6 testów i łamie szyfr Cezara atakiem siłowym. Na karcie wyniku: pytania powtórkowe, przewidywanie, pierwszy program, śledzenie, układanka, szyfrownik i złamany szyfr (maks. 24 pkt). Pytanie na wyjście: dlaczego szyfru Cezara nie używa się do ochrony prawdziwych danych?'
 },
 sections:[
  {id:'start',label:'Start',title:'Od kartki do programu',grouping:'class',
   intro:'Na poprzedniej lekcji szyfrowałeś ręcznie. Dziś napiszesz program, który zaszyfruje całą wiadomość w 0,001 s — i złamie szyfr Cezara, sprawdzając wszystkie 26 kluczy. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   ...note(4,'Hak: zapytaj, ile trwało ręczne szyfrowanie jednego zdania (zwykle 2–3 minuty). Zapowiedz, że komputer zrobi to w tysięcznej części sekundy, a potem złamie szyfr bez klucza. Dwa pytania powtórkowe bez notatek (retrieval practice) — omów tylko błędne odpowiedzi. Na koniec: wszyscy przechodzą do etapu 2, żeby Python zaczął się ładować.','Ile kluczy musi sprawdzić ktoś, kto chce złamać szyfr Cezara, nie znając klucza?','Najwyżej 25 (26, licząc klucz 0, który nic nie zmienia). To tak mało, że komputer sprawdzi wszystkie w ułamku sekundy.','Uczniowie mylą kierunek: przy odszyfrowaniu też przesuwają litery do przodu. Przypomnij: deszyfrowanie to przesunięcie o klucz w przeciwną stronę.','Zapytaj, gdzie spotykają szyfrowanie (WhatsApp, bankowość, Wi-Fi WPA2/WPA3) i czy jest tam szyfr Cezara. Nie — tam działają nowoczesne szyfry, np. AES, z co najmniej 2¹²⁸ kluczami.'),
   activities:[
    choice('cp-r1','Szyfr Cezara z kluczem 3. Jak zaszyfrujesz słowo KOT?',['NRW','LPU','HLQ','KOT3'],[0],'K → N, O → R, T → W: każda litera przesuwa się o 3 miejsca do przodu w alfabecie.','Wypisz kawałek alfabetu i od każdej litery odlicz 3 w prawo.'),
    choice('cp-r2','Szyfrogram „DOD” powstał z kluczem 3. Jak go odczytasz?',['Przesunę każdą literę o 3 do tyłu','Przesunę każdą literę o 3 do przodu','Zamienię litery parami GA-DE-RY-PO-LU-KI','Bez komputera się nie da'],[0],'Deszyfrowanie to ruch w przeciwną stronę: D → A, O → L, D → A, więc DOD = ALA. W programie zrobimy to tą samą funkcją z kluczem −3.','Szyfrowanie przesunęło litery do przodu. Co je cofnie?')
   ]},
  {id:'first',label:'Pierwszy program',title:'Pierwszy program w 3 minuty',grouping:'solo',
   intro:'Przewidź, co wypisze program, i sprawdź to jednym kliknięciem. Potem dopisz pętlę. Błędów się nie bój — Python pokaże po polsku, co poprawić.',
   reading:{title:'Jak czytać ten kod?',paragraphs:[
    'print(…) wypisuje na ekran to, co jest w nawiasie. Tekst (napis) piszemy w cudzysłowie: "OLA". Zmienna to podpisane pudełko na wartość: imie = "OLA" wkłada napis OLA do pudełka o nazwie imie.',
    'Pętla for litera in imie: powtarza wcięte linie pod nią dla każdej litery po kolei: O, potem L, potem A. Wcięcie (4 spacje, klawisz Tab) mówi Pythonowi, które linie należą do pętli. Dwukropek na końcu linii z for jest obowiązkowy.'
   ],example:{question:'Co wypisze: for znak in "HEJ": print(znak)?',answer:'Trzy linie: H, E i J — print wykonuje się raz dla każdej litery.'}},
   ...note(6,'Pokaż na projektorze, gdzie jest przycisk „Uruchom i porównaj”, i poproś, żeby każdy najpierw wpisał przewidywanie — bez uruchamiania. Po minucie zapytaj, kto miał „Cześć, OLA” w jednej linii. Potem zadanie z pętlą: pierwszy działający program. Chodź po sali i sprawdzaj dwukropek i wcięcie — to 90% błędów na starcie.','Dlaczego „Koniec” wypisało się tylko raz, a litery trzy razy?','Bo print("Koniec") nie ma wcięcia — nie należy do pętli, wykonuje się raz, po niej. Wcięte print(litera) wykonuje się dla każdej litery.','Brak dwukropka po for, brak wcięcia pod for, wpisanie print(slowo) zamiast print(litera) (cały napis 5 razy).','Dla szybkich: zmień program tak, żeby każda litera była wypisana dwa razy obok siebie (print(litera * 2)).'),
   activities:[
    {type:'pythonLab',id:'cp-first',mode:'predict',points:2,file:'powitanie.py',title:'Co wypisze ten program?',
     prompt:'Przeczytaj kod linia po linii. Wpisz, co pojawi się na ekranie — dokładnie, każda linia osobno. Potem uruchom program i porównaj.',
     code:'imie = "OLA"\nprint("Cześć,", imie)\nfor litera in imie:\n    print(litera)\nprint("Koniec")\n',predictRows:5,
     explain:'print z przecinkiem wstawia spację między elementami: „Cześć, OLA”. Pętla for wykonała `print(litera)` trzy razy — po razie dla O, L i A. Linia `print("Koniec")` nie ma wcięcia, więc wykonała się raz, już po pętli.'},
    {type:'pythonLab',id:'cp-loop',mode:'code',points:2,file:'litery.py',title:'Wypisz tajne słowo literka po literce',
     prompt:'Dopisz pętlę `for`, która wypisze każdą literę słowa SZYFR w osobnej linii. Kliknij „Uruchom”, żeby zobaczyć wynik, a potem „Sprawdź”.',
     starter:'slowo = "SZYFR"\n# Dopisz pętlę for, która wypisze każdą literę w osobnej linii:\n\n',
     solution:'slowo = "SZYFR"\nfor litera in slowo:\n    print(litera)\n',
     tests:[{output:'S\nZ\nY\nF\nR',label:'Wypisuje S, Z, Y, F, R — każdą literę w osobnej linii'}],
     sourceChecks:[{pattern:'\\bfor\\b',label:'Kod używa pętli for',hint:'Użyj pętli for zamiast pięciu osobnych print.'}],
     hints:['Zacznij linię od `for litera in slowo:` — z dwukropkiem na końcu.','Pod spodem, z wcięciem (Tab), napisz `print(litera)`.'],
     successText:'Twój pierwszy program działa. Tak zaczynał każdy programista.'}
   ]},
  {id:'example',label:'Przykład',title:'Jak komputer przesuwa literę? ord, chr i % 26',grouping:'class',
   intro:'Komputer nie zna liter — zna liczby. Prześledź przykład rozwiązany krok po kroku: jak H zmienia się w K, a Z w C. Klikaj „Krok dalej” i obserwuj zmienne. Potem odpowiedz na 3 pytania.',
   reading:{title:'Litery to liczby',paragraphs:[
    'ord("A") zwraca numer znaku w tabeli Unicode: 65. Litery A–Z mają kolejne numery od 65 do 90. Po odjęciu ord("A") dostajesz pozycję litery w alfabecie: A = 0, B = 1, …, Z = 25. Funkcja chr() działa odwrotnie: chr(75) to "K".',
    'Działanie % (reszta z dzielenia) zawija alfabet jak tarcza zegara: (25 + 3) % 26 = 2, więc po Z wracamy na początek i wychodzi C. Godziny liczysz tak samo: 22:00 + 5 godzin = 3:00, bo (22 + 5) % 24 = 3.'
   ],example:{question:'Przykład rozwiązany: zaszyfruj Y kluczem 3.',answer:'ord("Y") − ord("A") = 89 − 65 = 24. (24 + 3) % 26 = 27 % 26 = 1. chr(1 + 65) = chr(66) = "B". Wynik: Y → B.'}},
   ...note(7,'Nauczanie jawne na projektorze: klikaj „Krok dalej” i mów na głos, co robi komputer („teraz liczy pozycję H: 72 minus 65 to 7”). Przy literze Z zatrzymaj się i zapytaj klasę, ile wyjdzie bez % 26. Potem uczniowie sami przechodzą kroki u siebie i odpowiadają na 3 pytania. Zwróć uwagę na kolumnę „zmiana” w tabeli zmiennych.','Co by się stało, gdyby w programie nie było % 26 i zaszyfrowalibyśmy Z?','Wyszłoby 28, a chr(28 + 65) = chr(93) to znak „]”, nie litera. % 26 zawija wynik z powrotem do zakresu 0–25.','Uczniowie myślą, że ord("H") to 8 (bo H to 8. litera). Numer Unicode to 72, a pozycja od zera to 7.','Zmień kod (przycisk pod programem), np. klucz = 13 albo napis "XYZ", i sprawdź, co się stanie.'),
   activities:[
    {type:'pythonLab',id:'cp-trace',mode:'trace',points:0,file:'jedna_litera.py',title:'Przykład rozwiązany: H → K i Z → C',
     prompt:'Zmienne w tabeli pokazują stan PRZED wykonaniem podświetlonej linii. Przejdź cały program i odpowiedz na pytania.',
     code:'klucz = 3\nfor litera in "HZ":\n    kod = ord(litera) - ord("A")    # pozycja: A=0 … Z=25\n    nowy = (kod + klucz) % 26       # przesunięcie z zawinięciem\n    wynik = chr(nowy + ord("A"))    # z powrotem na literę\n    print(litera, "->", wynik)\n',
     questions:[
      {q:'Ile wynosi kod dla litery H?',answer:'7',inputLabel:'kod =',explain:'ord("H") − ord("A") = 72 − 65 = 7. H to ósma litera, ale liczymy od zera.',hint:'Klikaj „Krok dalej”, aż podświetli się linia 4 — wtedy zmienna kod ma już wartość dla H.'},
      {q:'Ile wynosi nowy dla litery Z?',options:['28','2','25','3'],correct:[1],explain:'Z to pozycja 25. (25 + 3) % 26 = 28 % 26 = 2, a pozycja 2 to litera C. Bez % 26 wyszłoby 28 — poza alfabetem.',hint:'Znajdź krok, w którym litera = \'Z\', i sprawdź nowy, gdy podświetlona jest linia 5.'},
      {q:'Po co w programie jest % 26?',options:['Żeby po Z wrócić na początek alfabetu','Żeby program działał szybciej','Żeby zamienić małe litery na wielkie','Bo tak się zawsze pisze'],correct:[0],explain:'Reszta z dzielenia przez 26 zawija alfabet w kółko: 26 → 0 (A), 27 → 1 (B), 28 → 2 (C).',hint:'Sprawdź, co wyszłoby dla Z bez tego działania.'}
     ]}
   ]},
  {id:'parsons',label:'Układanka',title:'Ułóż funkcję szyfruj_litere',grouping:'pair',
   intro:'Te same kroki, ale zamknięte w funkcji — kawałku kodu z nazwą, którego użyjesz wiele razy. Ułóż linie we właściwej kolejności i z dobrymi wcięciami. Uwaga: jedna linia to pułapka. W parze: kierowca klika, nawigator czyta testy i pilnuje wcięć.',
   reading:{title:'Funkcja: przepis z nazwą',paragraphs:[
    'def szyfruj_litere(litera, klucz): tworzy funkcję z dwoma parametrami. Wcięte linie pod def to jej treść. return oddaje wynik i kończy funkcję — jak kalkulator, który po „=” pokazuje wynik.',
    'Warunek if "A" <= litera <= "Z": sprawdza, czy znak jest wielką literą. Spacja, cyfra czy „!” nie spełniają warunku i wracają bez zmian — dlatego zaszyfrowana wiadomość zachowuje odstępy.'
   ]},
   ...note(8,'Przykład z wygaszaniem: kod jest już napisany, uczniowie tylko go układają. Pilnuj ról w parach: kierowca klika, nawigator czyta na głos wynik testów („test zawijanie po Z nie przechodzi — sprawdź % 26”). Po zaliczeniu nawigator układa funkcję u siebie i tłumaczy każdą linię, kierowca sprawdza. Linia-pułapka to nowy = kod + klucz (bez % 26).','Która linia jest pułapką i który test ją wykrywa?','nowy = kod + klucz — bez % 26. Wykrywa ją test z literą Z (zawijanie), bo zamiast C wychodzi znak „]”.','Złe wcięcie ostatniego return litera (2 poziomy zamiast 1) — wtedy funkcja dla spacji zwraca None. Druga pułapka: kolejność kod → nowy → return.','Zapytaj: po co osobny return litera na końcu? (Dla znaków, które nie są literami — spacje i cyfry mają zostać bez zmian.)'),
   activities:[
    {type:'pythonLab',id:'cp-parsons',mode:'parsons',points:4,file:'szyfr.py',title:'Układanka: funkcja szyfruj_litere(litera, klucz)',
     prompt:'Ułóż funkcję, która szyfruje jedną literę. Klikaj linie, żeby dodać je do programu, strzałkami ↑ ↓ zmieniaj kolejność, a ← → wcięcie. Testy sprawdzą m.in. literę Z i spację.',
     solution:SZYFRUJ_LITERE,distractors:['nowy = kod + klucz'],
     tests:[
      {call:'szyfruj_litere("A", 3)',expected:"'D'"},
      {call:'szyfruj_litere("H", 3)',expected:"'K'"},
      {call:'szyfruj_litere("Z", 3)',expected:"'C'",label:'Zawijanie po Z'},
      {call:'szyfruj_litere(" ", 3)',expected:"' '",label:'Spacja bez zmian'},
      {call:'szyfruj_litere("!", 5)',expected:"'!'",label:'Znak inny niż litera bez zmian'},
      {call:'szyfruj_litere("C", -3)',expected:"'Z'",label:'Klucz ujemny cofa literę'}
     ],
     hints:['Pierwsza linia to zawsze `def …:` — bez wcięcia. Wszystkie pozostałe są w środku funkcji, więc mają wcięcie.','Kolejność jak w przykładzie z etapu 3: najpierw kod, potem nowy, na końcu `return chr(…)`. Te trzy linie są pod if, więc mają 2 poziomy wcięcia.','Ostatnie `return litera` ma 1 poziom wcięcia — wykona się tylko wtedy, gdy znak NIE jest wielką literą.']}
   ]},
  {id:'cipher',label:'Szyfrownik',title:'Twój szyfrownik: szyfruj i deszyfruj',grouping:'pair',
   intro:'Zamiana ról w parze. Funkcja szyfruj_litere jest gotowa. Teraz napisz szyfruj(tekst, klucz), która zaszyfruje całą wiadomość, i deszyfruj(tekst, klucz). Sześć testów sprawdzi, czy działa.',
   reading:{title:'Budujemy napis litera po literze',paragraphs:[
    'Nowy napis tworzy się, doklejając kolejne kawałki: najpierw wynik = "" (pusty napis), a potem w pętli wynik = wynik + nowa_litera. Po pętli return wynik oddaje gotowy szyfrogram.',
    'Deszyfrowanie nie wymaga nowego algorytmu: przesunięcie o −3 cofa przesunięcie o 3, a dzięki % 26 działa to także dla A: (0 − 3) % 26 = 23, czyli X. Programiści mówią: nie powtarzaj kodu — użyj tego, który już działa.'
   ],example:{question:'Jak zaszyfruje się „AB C” kluczem 1?',answer:'Pętla bierze po kolei A, B, spację i C: wynik = "" → "B" → "BC" → "BC " → "BC D". Spacja przechodzi bez zmian.'}},
   ...note(10,'Praca samodzielna w parach z zamienionymi rolami. Nie podawaj kodu — odsyłaj do testów: „który test nie przechodzi? co było oczekiwane, a co dostałeś?”. Gdy para utknie na deszyfruj, zapytaj: „jak cofnąć przesunięcie o 3?”. Po zaliczeniu nawigator przepisuje rozwiązanie u siebie. Pokaż klasie jedną parę, która napisała deszyfruj jedną linią (return szyfruj(tekst, -klucz)).','Dlaczego deszyfruj może po prostu wywołać szyfruj z kluczem -klucz?','Bo przesunięcie o −k cofa przesunięcie o k, a % 26 poprawnie zawija liczby ujemne (np. A z kluczem −3 daje X).','Return w środku pętli (funkcja kończy się po pierwszej literze), brak wynik = "" przed pętlą, wynik = szyfruj_litere(…) zamiast wynik = wynik + … (zostaje tylko ostatnia litera).','Bonus: niech szyfruj działa też dla małych liter — najprostsza wersja: for litera in tekst.upper():.'),
   activities:[
    {type:'pythonLab',id:'cp-cipher',mode:'code',points:6,file:'szyfrownik.py',title:'Szyfrownik: szyfruj(tekst, klucz) i deszyfruj(tekst, klucz)',
     prompt:'Uzupełnij obie funkcje. Wiadomości piszemy wielkimi literami A–Z; spacje, cyfry i znaki interpunkcyjne zostają bez zmian. Najpierw „Uruchom” (zobaczysz wynik dwóch print na dole), potem „Sprawdź”.',
     starter:SZYFRUJ_LITERE+'\n\ndef szyfruj(tekst, klucz):\n    wynik = ""\n    # Dla każdej litery w tekście dopisz do wyniku zaszyfrowaną literę.\n\n    return wynik\n\n\ndef deszyfruj(tekst, klucz):\n    # Deszyfrowanie to szyfrowanie z kluczem ujemnym.\n    return tekst\n\n\nprint(szyfruj("SPOTKANIE O 18", 3))\nprint(deszyfruj("VSRWNDQLH R 18", 3))\n',
     solution:SZYFRUJ_LITERE+'\n\ndef szyfruj(tekst, klucz):\n    wynik = ""\n    for litera in tekst:\n        wynik = wynik + szyfruj_litere(litera, klucz)\n    return wynik\n\n\ndef deszyfruj(tekst, klucz):\n    return szyfruj(tekst, -klucz)\n\n\nprint(szyfruj("SPOTKANIE O 18", 3))\nprint(deszyfruj("VSRWNDQLH R 18", 3))\n',
     tests:[
      {call:'szyfruj("ALA", 3)',expected:"'DOD'"},
      {call:'szyfruj("XYZ", 3)',expected:"'ABC'",label:'Zawijanie po Z'},
      {call:'szyfruj("SPOTKANIE O 18", 3)',expected:"'VSRWNDQLH R 18'",label:'Spacje i cyfry bez zmian'},
      {call:'szyfruj("HEJ!", 13)',expected:"'URW!'"},
      {call:'deszyfruj("DOD", 3)',expected:"'ALA'"},
      {call:'deszyfruj(szyfruj("TAJNE HASLO", 7), 7)',expected:"'TAJNE HASLO'",label:'deszyfruj cofa szyfruj'}
     ],
     hints:['W miejscu komentarza w funkcji szyfruj napisz pętlę: `for litera in tekst:`','W pętli (wcięcie 8 spacji): `wynik = wynik + szyfruj_litere(litera, klucz)`. Uważaj: `return wynik` ma zostać poza pętlą (4 spacje).','W deszyfruj zamień `return tekst` na `return szyfruj(tekst, -klucz)` — minus odwraca kierunek przesunięcia.'],
     summary:'Szyfrownik działa: {passed}/{total} testów'}
   ]},
  {id:'crack',label:'Złam szyfr',title:'Złam szyfr: 26 kluczy w pół sekundy',grouping:'pair',
   intro:'Przechwyciliście wiadomość, ale nie znacie klucza. Komputer może po prostu sprawdzić wszystkie. Dopiszcie pętlę, uruchomcie program i znajdźcie jedyną linię, która ma sens. Bonus dla szybkich (GA-DE-RY-PO-LU-KI) nie wlicza się do oceny.',
   reading:{title:'Atak siłowy (brute force)',paragraphs:[
    'Szyfr Cezara ma tylko 26 kluczy (w tym klucz 0, który nic nie zmienia). Program sprawdza je wszystkie w ułamku sekundy — człowiekowi zajęłoby to kwadrans. Sprawdzanie wszystkich możliwości po kolei to atak siłowy (ang. brute force).',
    'Dlatego hasło do konta musi być długie: każdy dodatkowy znak mnoży liczbę możliwości. Nowoczesne szyfry (np. AES, używany w komunikatorach i bankowości) mają co najmniej 2¹²⁸ kluczy — sprawdzenie wszystkich trwałoby dłużej, niż istnieje Wszechświat.'
   ]},
   ...note(6,'Znowu zamiana ról. Pierwsza para, która poda hasło, może wypisać je na tablicy (bez podpowiadania innym przez głos). Zwróć uwagę, że program nie „wie”, który tekst jest sensowny — to człowiek czyta 26 linii. Szybsze pary robią bonus GA-DE-RY-PO-LU-KI ze słownikiem.','Jak program mógłby sam rozpoznać właściwy klucz, bez czytania przez człowieka?','Np. sprawdzać, czy w tekście są częste polskie słowa (TO, DO, NIE, JEST) albo czy częstość liter pasuje do języka polskiego — tak działa analiza częstości.','Wypisywanie tylko tekstu bez klucza (trudno potem podać klucz) albo range(25) zamiast range(26) — brakuje ostatniego klucza.','Bonus GA-DE-RY-PO-LU-KI: słownik pary i metoda get. Zapytaj, dlaczego tu szyfrowanie i deszyfrowanie to ta sama funkcja.'),
   activities:[
    {type:'pythonLab',id:'cp-crack',mode:'code',points:3,file:'lamacz.py',title:'Łamacz szyfru Cezara',
     prompt:'Funkcja deszyfruj jest gotowa. Pod zmienną `tajna` dopisz pętlę, która dla każdego klucza od 0 do 25 wypisze klucz i odszyfrowany tekst. Uruchom program, znajdź sensowną linię i odpowiedz na pytania.',
     starter:DESZYFRUJ+`\n\ntajna = "${TAJNA}"\n# Sprawdź wszystkie klucze od 0 do 25.\n# Wypisz w każdej linii: klucz i odszyfrowany tekst.\n\n`,
     solution:DESZYFRUJ+`\n\ntajna = "${TAJNA}"\nfor klucz in range(26):\n    print(klucz, deszyfruj(tajna, klucz))\n`,
     tests:[{contains:['HASLO DO SZAFKI W PRACOWNI TO PINGWIN','TMEXA PA ELMRWU I BDMOAIZU FA BUZSIUZ',TAJNA],label:'Program wypisuje odszyfrowane wersje dla kluczy od 0 do 25'}],
     hints:['Pętla po wszystkich kluczach: `for klucz in range(26):` — range(26) daje liczby 0, 1, …, 25.','W pętli (z wcięciem): `print(klucz, deszyfruj(tajna, klucz))`'],
     questions:[
      {q:'Jakim kluczem zaszyfrowano wiadomość?',answer:'11',inputLabel:'Klucz',explain:'Tylko klucz 11 daje polskie zdanie. Pozostałe 25 linii to bełkot — tak rozpoznajesz właściwy klucz.',hint:'Uruchom program i czytaj linie od góry. Liczba na początku sensownej linii to klucz.'},
      {q:'Jakie hasło do szafki kryje wiadomość?',answer:'PINGWIN',accept:['pingwin'],inputLabel:'Hasło',explain:'„HASLO DO SZAFKI W PRACOWNI TO PINGWIN”. Szyfr złamany bez znajomości klucza — w ułamku sekundy.',hint:'Ostatnie słowo sensownej linii.'}
     ],
     summary:'Złamany szyfr: hasło PINGWIN'},
    {type:'pythonLab',id:'cp-bonus',mode:'code',points:3,file:'gaderypoluki.py',title:'Bonus: GA-DE-RY-PO-LU-KI ze słownikiem',
     prompt:'Słownik `pary` mówi, na co zamienić literę (G↔A, D↔E, R↔Y, P↔O, L↔U, K↔I). Uzupełnij funkcję: jeśli litera jest w słowniku, dopisz jej parę, a jeśli nie — dopisz ją bez zmian. Zadanie dla chętnych, nie wlicza się do oceny.',
     starter:'pary = {"G": "A", "A": "G", "D": "E", "E": "D", "R": "Y", "Y": "R",\n        "P": "O", "O": "P", "L": "U", "U": "L", "K": "I", "I": "K"}\n\n\ndef gaderypoluki(tekst):\n    wynik = ""\n    for litera in tekst:\n        # Jeśli litera jest w słowniku pary, dopisz jej parę; jeśli nie — dopisz ją bez zmian.\n        wynik = wynik + litera\n    return wynik\n\n\nprint(gaderypoluki("KOT I PIES"))\n',
     solution:'pary = {"G": "A", "A": "G", "D": "E", "E": "D", "R": "Y", "Y": "R",\n        "P": "O", "O": "P", "L": "U", "U": "L", "K": "I", "I": "K"}\n\n\ndef gaderypoluki(tekst):\n    wynik = ""\n    for litera in tekst:\n        if litera in pary:\n            wynik = wynik + pary[litera]\n        else:\n            wynik = wynik + litera\n    return wynik\n\n\nprint(gaderypoluki("KOT I PIES"))\n',
     tests:[
      {call:'gaderypoluki("ALA")',expected:"'GUG'"},
      {call:'gaderypoluki("KOT")',expected:"'IPT'"},
      {call:'gaderypoluki("ZZZ")',expected:"'ZZZ'",label:'Litery spoza par bez zmian'},
      {call:'gaderypoluki(gaderypoluki("TAJNE HASLO"))',expected:"'TAJNE HASLO'",label:'Dwa razy = tekst jawny'}
     ],
     hints:['Sprawdź, czy litera jest w słowniku: `if litera in pary:`','Parę odczytasz tak: `pary[litera]`. W części else dopisz literę bez zmian.']}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań, programów, układanki i złamanego szyfru. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Zbierz wnioski: ile trwało złamanie szyfru i dlaczego to zły szyfr do haseł. Zadaj pytanie na wyjście. Uczniowie robią zdjęcie karty lub pokazują ją. Zapowiedz: następnym razem algorytmy porządkowania — bez kodu, a potem napiszemy je w Pythonie.','Dlaczego szyfru Cezara nie używa się do ochrony prawdziwych danych, skoro Twój program łamie go w pół sekundy?','Ma tylko 26 kluczy, więc atak siłowy sprawdza wszystkie. Prawdziwe szyfry mają astronomicznie wiele kluczy (np. 2¹²⁸), a do tego nie zamieniają liter jedna na jedną.','„Wystarczy wymyślić swój szyfr i nikomu nie mówić” — bezpieczeństwo nie może zależeć od ukrycia algorytmu, tylko od klucza.','Zapytaj, jak zmienić program, żeby łamał szyfr sam — np. szukał słowa „TO” w odszyfrowanym tekście.'),
   activities:[{type:'resultCard',id:'result',title:'Szyfrownik w Pythonie — wynik',sources:['cp-r1','cp-r2','cp-first','cp-loop','cp-trace','cp-parsons','cp-cipher','cp-crack'],badges:[
    {min:0,name:'Hello, World!',text:'Pierwszy program za Tobą — a to zawsze najtrudniejszy krok. Następnym razem pójdzie szybciej.'},
    {min:0.5,name:'Programista na próbę',text:'Twój kod już szyfruje. Jeszcze kilka zielonych testów i można puszczać na produkcję.'},
    {min:0.85,name:'Łamacz szyfrów',text:'26 kluczy w pół sekundy. Juliusz Cezar właśnie zmienia hasło.'}
   ]}]}
 ],
 exitTicket:'Umiesz zamienić literę na liczbę (ord), przesunąć ją z zawinięciem (% 26) i wrócić do litery (chr). Twój program szyfruje całe zdania i łamie szyfr Cezara w ułamku sekundy — dlatego prawdziwe dane chroni się dziś dużo silniejszymi szyframi.'
};
