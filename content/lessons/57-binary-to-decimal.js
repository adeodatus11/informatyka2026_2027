import {note, choice} from '../schema.js';

const HORNER = `def horner(s):
    wynik = 0
    for cyfra in s:
        wynik = wynik * 2 + int(cyfra)
    return wynik
`;

export default {
 id:'57',grade:3,order:23,title:'Programowanie zamiany liczby dwójkowej na dziesiętną',
 subtitle:'Twój program odczyta maskę sieci 255.255.255.0 z bitów, uprawnienia plików „chmod 755” i wyłapie błędne dane, zanim popsują wynik.',
 topic:'Dwójkowy → dziesiętny w Pythonie',icon:'hash',tags:['wagi 2ⁿ','schemat Hornera','int(x, 2)'],duration:45,
 curriculum:'Informatyka – liceum/technikum, zakres podstawowy (PP 2024): I.2.a — zamiana reprezentacji liczb między pozycyjnymi systemami liczbowymi (dwójkowy → dziesiętny); II.1 — pętle, funkcje, warunki, walidacja danych i testy; I.3 — sprawdzanie algorytmu dla przykładowych danych; II.2 — Python w przeglądarce. Nawiązuje do lekcji o systemie dwójkowym i szesnastkowym (bez kodu).',
 format:{
  name:'Dwie metody, jeden wynik',
  student:'Pracujesz sam. Tę samą zamianę zrobisz dwiema metodami: sumą wag (jak na lekcji o bitach) i schematem Hornera (jak wpisywanie cyfr w kalkulator). Potem dopiszesz kontrolę danych i użyjesz funkcji do adresów IP i uprawnień plików. Efekt: konwerter, który odczytuje maskę sieci i chmod, a błędne dane odrzuca.',
  teacher:'Nauczanie jawne z przykładami rozwiązanymi: metodę wag uczniowie znają z lekcji o systemie dwójkowym — tu tylko śledzą ją w kodzie i uzupełniają jedną linię. Schemat Hornera wprowadzasz kontrastem: „znajdź błąd” (wynik + cyfra · 2) → układanka z poprawną wersją. Na projektorze możesz pokazać kalkulator: wpisanie cyfry 5 po 12 daje 125 = 12 · 10 + 5 — dwójkowo to samo z · 2. UDL: kto woli liczyć na kartach 128…1, robi to obok kodu; wymagania merytoryczne są wspólne. Kontrola danych (tylko 0 i 1) to moment, w którym uczniowie przewidują, które dane wywrócą program — wynik porównujesz z int(x, 2).',
  grouping:'Samodzielnie, każdy na swoim komputerze. Bez par. Kto skończy wcześniej, liczy uprawnienia dla własnych przykładów.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Powtórki rozłożone w czasie',url:'https://metodyka.covepolska.pl/metoda-powtorki-rozlozone.html'},
   {name:'UDL',url:'https://metodyka.covepolska.pl/metoda-udl.html'}
  ]
 },
 objectives:['Zamieniam liczbę dwójkową na dziesiętną sumą wag i zapisuję to jako funkcję w Pythonie.','Stosuję schemat Hornera (wynik = wynik · 2 + cyfra) i wyjaśniam, dlaczego daje ten sam wynik.','Sprawdzam poprawność danych (tylko 0 i 1, niepusty napis) i porównuję wynik z int(x, 2).','Odczytuję adres IP, maskę sieci i uprawnienia plików zapisane bitami.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i logowania.','Projektor do śledzenia kodu w etapie 2','Opcjonalnie: karty z wagami 128, 64, 32, 16, 8, 4, 2, 1 z lekcji o systemie dwójkowym'],
 teacherGuide:{
  preparation:'Otwórz przed dzwonkiem etap 2 na komputerze z projektorem (Python pobiera się raz). Klucz: 1101₂ = 13 (potęga na starcie 3, po dwóch cyfrach wynik 12); błędny Horner: „101” → 4 i „111” → 6 (zamiast 5 i 7); int("102", 2) → ValueError; 11111111₂ = 255; 11000000.10101000.00000001.00001010 → 192.168.1.10, maska 255.255.255.0; rwxr-xr-- → 754, rw-r--r-- → 644. Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe.',
  summary:'Uczeń zamienia liczby dwójkowe na dziesiętne metodą wag i schematem Hornera, waliduje dane wejściowe, porównuje wyniki z int(x, 2) i stosuje funkcję do adresów IP oraz uprawnień plików. Pytanie na wyjście: dlaczego Horner nie potrzebuje znać długości liczby ani liczyć potęg?'
 },
 sections:[
  {id:'start',label:'Start',title:'255.255.255.0 i chmod 755 — to są bity',grouping:'class',
   intro:'Router pokazuje maskę 255.255.255.0, a na serwerze plik ma uprawnienia 755. W środku to bity. Na lekcji o systemie dwójkowym zamieniałeś je ręcznie — dziś zrobi to Twój program. Najpierw dwa pytania z wcześniejszych lekcji, bez notatek.',
   reading:{title:'Wagi pozycji',paragraphs:[
    'W liczbie dwójkowej każda cyfra ma wagę: od prawej 1, 2, 4, 8, 16… czyli kolejne potęgi dwójki. Wartość to suma wag tam, gdzie stoi 1: 1101₂ = 8 + 4 + 0 + 1 = 13.',
    'Bajt (8 bitów) ma wagi 128, 64, 32, 16, 8, 4, 2, 1 — razem 255. Dlatego każda z czterech liczb w adresie IPv4 jest z zakresu 0–255: to jeden bajt, zwany oktetem.'
   ],example:{question:'Ile to 11000000₂?',answer:'Jedynki przy wagach 128 i 64: 128 + 64 = 192 — początek domowych adresów 192.168…'}},
   ...note(4,'Hak: pokaż ustawienia sieci w Windows (ipconfig) albo zdjęcie panelu routera z maską 255.255.255.0. Zapytaj, dlaczego nigdy nie ma tam 256. Pytania powtórkowe bez notatek — jedno z lekcji o szyfrze (ord/chr), drugie z lekcji o bitach (powtórka rozłożona w czasie). Wszyscy przechodzą do etapu 2.','Dlaczego w adresie IP nie spotkasz liczby 256?','Bo każda część to jeden bajt — 8 bitów, a największa liczba na 8 bitach to 11111111₂ = 255.','Uczniowie liczą wagi od lewej od 1. Mylą liczbę możliwych wartości (256) z największą wartością (255).','Zapytaj, kto zna swój adres IP w domu i od czego się zaczyna (często 192.168).'),
   activities:[
    choice('pb-r1','Powtórka z szyfru w Pythonie: co wypisze print(chr(ord("A") + 2))?',['C','B','A2','67'],[0],'ord("A") = 65, 65 + 2 = 67, chr(67) = „C”. Tak przesuwał litery szyfr Cezara.','ord zamienia literę na liczbę, chr — liczbę na literę.'),
    choice('pb-r2','Z lekcji o systemie dwójkowym: ile wynosi 1011₂?',['11','1011','13','7'],[0],'Wagi od prawej 1, 2, 4, 8: 8 + 0 + 2 + 1 = 11.','Podpisz wagi od prawej strony.')
   ]},
  {id:'weights',label:'Wagi',title:'Metoda 1: suma wag w kodzie',grouping:'solo',
   intro:'Ta sama metoda co na kartce, tylko zapisana w Pythonie. Prześledź program dla 1101, a potem uzupełnij jedną linię funkcji.',
   reading:{title:'Potęga maleje od lewej',paragraphs:[
    'Pierwsza cyfra od lewej ma największą wagę: 2 do potęgi (długość − 1). Program zaczyna od potega = len(s) − 1 i po każdej cyfrze zmniejsza ją o 1. 2 ** potega to w Pythonie „2 do potęgi”.',
    'Cyfra w napisie to znak "1" albo "0", a nie liczba. int(cyfra) zamienia ją na liczbę 1 albo 0. Bez tego "1" * 8 dałoby napis „11111111”, a nie 8.'
   ],example:{question:'Przykład rozwiązany: „110”',answer:'potega = 2: 1 · 4 = 4; potega = 1: 1 · 2 = 2; potega = 0: 0 · 1 = 0. Suma 6.'}},
   ...note(8,'Śledzenie na projektorze: zatrzymaj się po drugiej cyfrze i zapytaj, ile wynosi wynik (12). Potem uczniowie uzupełniają funkcję sami. Kto woli, liczy na kartach z wagami obok — wynik ma się zgadzać z testem.','Dlaczego potega zaczyna się od len(s) − 1, a nie od len(s)?','Bo najmniejsza waga to 2⁰ = 1. Dla 4 cyfr potęgi to 3, 2, 1, 0 — największa to długość − 1.','Brak int(cyfra) (powtarzanie napisu zamiast mnożenia), potega = len(s) (wynik dwa razy za duży), zmniejszanie potęgi przed dodaniem.','Zapytaj: jak zmienić funkcję, żeby szła od prawej (potęga rośnie od 0)? — przez napis odwrócony s[::-1].'),
   activities:[
    {type:'pythonLab',id:'pb-trace',mode:'trace',points:0,file:'wagi.py',title:'Przykład rozwiązany: 1101₂ = 13',
     prompt:'Klikaj „Krok dalej” i obserwuj potega i wynik. Odpowiedz na pytania.',
     code:'liczba = "1101"\nwynik = 0\npotega = len(liczba) - 1\nfor cyfra in liczba:\n    wynik = wynik + int(cyfra) * 2 ** potega\n    potega = potega - 1\nprint(wynik)\n',
     questions:[
      {q:'Ile wynosi potega przed pierwszym obrotem pętli?',answer:'3',inputLabel:'potega =',explain:'len("1101") − 1 = 3. Pierwsza cyfra ma wagę 2³ = 8.',hint:'Zatrzymaj się na linii 4 i spójrz na tabelę.'},
      {q:'Ile wynosi wynik po przetworzeniu dwóch pierwszych cyfr?',answer:'12',inputLabel:'wynik =',explain:'1 · 8 + 1 · 4 = 12. Potem 0 · 2 i 1 · 1 — razem 13.',hint:'Obserwuj wynik, gdy cyfra zmieni się na trzecią („0”).'}
     ]},
    {type:'pythonLab',id:'pb-weights',mode:'code',points:3,file:'na_dziesietny.py',title:'Funkcja na_dziesietny(s) — metoda wag',
     prompt:'Dopisz w pętli JEDNĄ linię: dodaj do wyniku wartość cyfry razy 2 do potęgi `potega`. Testy sprawdzą m.in. 8 jedynek i zera na początku.',
     starter:'def na_dziesietny(s):\n    wynik = 0\n    potega = len(s) - 1\n    for cyfra in s:\n        # dodaj do wyniku: cyfra (jako liczba) razy 2 do potęgi\n        potega = potega - 1\n    return wynik\n\n\nprint(na_dziesietny("1101"))\n',
     solution:'def na_dziesietny(s):\n    wynik = 0\n    potega = len(s) - 1\n    for cyfra in s:\n        wynik = wynik + int(cyfra) * 2 ** potega\n        potega = potega - 1\n    return wynik\n\n\nprint(na_dziesietny("1101"))\n',
     tests:[
      {call:'na_dziesietny("1101")',expected:'13'},
      {call:'na_dziesietny("0")',expected:'0'},
      {call:'na_dziesietny("1")',expected:'1'},
      {call:'na_dziesietny("10")',expected:'2'},
      {call:'na_dziesietny("11111111")',expected:'255',label:'Pełny bajt'},
      {call:'na_dziesietny("00101")',expected:'5',label:'Zera na początku'},
      {call:'na_dziesietny("11000000")',expected:'192',label:'Pierwszy oktet 192.168…'}
     ],
     hints:['2 do potęgi to w Pythonie `2 ** potega`. Cyfrę zamień na liczbę: `int(cyfra)`.','Linia (8 spacji wcięcia, przed `potega = potega - 1`): `wynik = wynik + int(cyfra) * 2 ** potega`'],
     summary:'Metoda wag: {passed}/{total} testów'}
   ]},
  {id:'horner',label:'Horner',title:'Metoda 2: schemat Hornera',grouping:'solo',
   intro:'Wpisujesz w kalkulator 1, 2, 5: na ekranie 1 → 12 → 125. Każda nowa cyfra mnoży dotychczasowy wynik przez 10 i dodaje się na końcu. W systemie dwójkowym mnożysz przez 2. Najpierw znajdź błąd w cudzym kodzie, potem ułóż poprawny.',
   reading:{title:'wynik = wynik · 2 + cyfra',paragraphs:[
    'Schemat Hornera czyta cyfry od lewej i nie potrzebuje potęg: przy każdej cyfrze wynik = wynik * 2 + int(cyfra). Dla 1101: 0 → 1 → 3 → 6 → 13. Mnożenie przez 2 „przesuwa” wszystkie dotychczasowe bity o jedno miejsce w lewo — jak dopisanie zera.',
    'To samo działa dla każdego systemu: dla dziesiętnego · 10, dla szesnastkowego · 16. Python w int("1101", 2) robi właśnie to. Metoda jest szybsza od sumy wag, bo nie liczy potęg.'
   ],example:{question:'Przykład rozwiązany: Horner dla „1011”',answer:'0 · 2 + 1 = 1; 1 · 2 + 0 = 2; 2 · 2 + 1 = 5; 5 · 2 + 1 = 11. Wynik 11.'}},
   ...note(9,'Pokaż kalkulator: 12 · 10 + 5 = 125. Potem przewidywanie z błędnym kodem — większość wpisze 5 i 7. Po uruchomieniu zapytaj, co jest źle (cyfra mnożona przez 2 zamiast wyniku). Układanka jest krótka — szybki sukces po błędzie.','Dlaczego wynik + cyfra · 2 daje złe wyniki?','Bo podwaja cyfrę, a nie dotychczasowy wynik — wcześniejsze bity nie przesuwają się w lewo. Dla „101”: 2 + 0 + 2 = 4.','Pomylenie kolejności działań (wynik * (2 + cyfra)), brak int(cyfra) — TypeError, start od wynik = 1.','Zapytaj: jak zmienić horner, żeby zamieniał liczby szesnastkowe? (· 16 i wartość cyfry z "0123456789ABCDEF".index(cyfra)) — temat kolejnych lekcji.'),
   activities:[
    {type:'pythonLab',id:'pb-bug',mode:'predict',points:2,file:'blad_horner.py',title:'Znajdź błąd: co wypisze ten program?',
     prompt:'Ktoś napisał schemat Hornera z jednym błędem. Prześledź w głowie, co wypisze program dla „101” i „111”.',
     code:'def zla_zamiana(s):\n    wynik = 0\n    for cyfra in s:\n        wynik = wynik + int(cyfra) * 2\n    return wynik\n\n\nprint(zla_zamiana("101"))\nprint(zla_zamiana("111"))\n',predictRows:2,
     explain:'Program podwaja cyfrę, a nie wynik: dla „101” 0 + 2 = 2, 2 + 0 = 2, 2 + 2 = 4. Dla „111”: 2, 4, 6. Poprawnie byłoby 5 i 7: `wynik = wynik * 2 + int(cyfra)`.'},
    {type:'pythonLab',id:'pb-horner',mode:'parsons',points:3,file:'horner.py',title:'Układanka: horner(s)',
     prompt:'Ułóż poprawny schemat Hornera. Jedna linia to pułapka z poprzedniego zadania.',
     solution:HORNER,distractors:['wynik = wynik + int(cyfra) * 2'],
     tests:[
      {call:'horner("1101")',expected:'13'},
      {call:'horner("101")',expected:'5'},
      {call:'horner("11111111")',expected:'255'},
      {call:'all(horner(s) == int(s, 2) for s in ["0", "1", "10", "1011", "00101", "10000000"])',expected:'True',label:'Te same wyniki co int(s, 2)'}
     ],
     hints:['Kolejność: def, wynik = 0, for, linia z * 2, return.','W pętli: `wynik = wynik * 2 + int(cyfra)` — mnożysz WYNIK, nie cyfrę.']}
   ]},
  {id:'validate',label:'Kontrola',title:'Kontrola danych: tylko 0 i 1',grouping:'solo',
   intro:'Użytkownik wpisze „102”, „1 0” albo nic. Funkcja zamieniająca nie może wtedy udawać, że wszystko gra. Napisz strażnika czy_dwojkowa(s) — zanim wyślesz dane do zamiany.',
   reading:{title:'Najpierw sprawdź, potem licz',paragraphs:[
    'Twój horner dla „102” zwróci 10 — liczbę, która nic nie znaczy. To gorsze niż błąd, bo nikt nie zauważy problemu. Dlatego przed zamianą sprawdzasz dane: napis nie może być pusty, a każdy znak musi być „0” albo „1”.',
    'Wbudowane int("102", 2) zgłasza błąd ValueError — Python odmawia. Twoja funkcja kontrolna zwraca False, a program może wtedy wypisać czytelny komunikat dla użytkownika.'
   ],example:{question:'Czy „” (pusty napis) to poprawna liczba dwójkowa?',answer:'Nie. Pętla po pustym napisie nic nie sprawdzi, więc trzeba to obsłużyć osobnym if na początku funkcji.'}},
   ...note(9,'Zanim uczniowie zaczną, zapytaj: jakie dane wywrócą program? Zapisz propozycje na tablicy (pusty napis, 2, spacja, litery) i porównaj z testami. Uczniowie piszą funkcję samodzielnie; po zaliczeniu pytania o int(x, 2).','Dlaczego cicha zła odpowiedź (horner("102") = 10) jest groźniejsza niż błąd programu?','Bo nikt jej nie zauważy — błędny wynik trafi dalej (np. do konfiguracji sieci). Błąd przynajmniej zatrzymuje program.','Return True wewnątrz pętli (sprawdza tylko pierwszy znak), warunek znak != "0" or znak != "1" (zawsze prawdziwy), brak obsługi pustego napisu.','Dla szybkich: funkcja zamien(s), która zwraca horner(s) albo None, gdy czy_dwojkowa(s) jest False.'),
   activities:[
    {type:'pythonLab',id:'pb-valid',mode:'code',points:4,file:'kontrola.py',title:'czy_dwojkowa(s)',
     prompt:'Uzupełnij funkcję: pusty napis → `False`; jeśli jakikolwiek znak nie jest „0” ani „1” → `False`; w przeciwnym razie `True`.',
     starter:'def czy_dwojkowa(s):\n    # 1) pusty napis → False\n    # 2) pętla po znakach: znak inny niż "0" i "1" → False\n    return True\n\n\nprint(czy_dwojkowa("1010"), czy_dwojkowa("102"))\n',
     solution:'def czy_dwojkowa(s):\n    if s == "":\n        return False\n    for znak in s:\n        if znak != "0" and znak != "1":\n            return False\n    return True\n\n\nprint(czy_dwojkowa("1010"), czy_dwojkowa("102"))\n',
     tests:[
      {call:'czy_dwojkowa("1010")',expected:'True'},
      {call:'czy_dwojkowa("0")',expected:'True',label:'Jedno zero'},
      {call:'czy_dwojkowa("")',expected:'False',label:'Pusty napis'},
      {call:'czy_dwojkowa("102")',expected:'False',label:'Cyfra 2'},
      {call:'czy_dwojkowa("1 0")',expected:'False',label:'Spacja'},
      {call:'czy_dwojkowa("01a")',expected:'False',label:'Litera na końcu'}
     ],
     hints:['Pusty: `if s == "":` i `return False`.','Pętla: `for znak in s:`, a w niej `if znak != "0" and znak != "1":` — uwaga: and, nie or.','`return True` zostaje na końcu, poza pętlą.'],
     questions:[
      {q:'Co zrobi wbudowane int("102", 2)?',options:['Zgłosi błąd ValueError','Zwróci 102','Zwróci 6','Zwróci 10'],correct:[0],explain:'Python odmawia: „2” nie jest cyfrą w systemie dwójkowym. Twoja funkcja kontrolna robi to łagodniej — zwraca False.',hint:'Czy „2” to cyfra dwójkowa?'},
      {q:'Ile zwróci int("11111111", 2)?',answer:'255',inputLabel:'Wynik',explain:'8 jedynek = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 — tak samo jak Twoje funkcje.',hint:'Suma wag pełnego bajtu.'}
     ]}
   ]},
  {id:'apply',label:'IP i chmod',title:'Do roboty: adres IP i uprawnienia plików',grouping:'solo',
   intro:'Dwa prawdziwe zastosowania. Najpierw zamienisz adres IP zapisany bitami na zwykły zapis z kropkami. Potem odczytasz uprawnienia pliku na serwerze — to, co admin wpisuje jako chmod 755.',
   reading:{title:'Oktety i trójki bitów',paragraphs:[
    'Adres IPv4 to 32 bity podzielone na 4 oktety po 8 bitów: 11000000.10101000.00000001.00001010 to 192.168.1.10. Maska 255.255.255.0 to 24 jedynki i 8 zer — mówi, które bity adresu oznaczają sieć.',
    'W systemach Linux (serwery, Android) uprawnienia pliku to trzy trójki bitów: właściciel, grupa, inni. Każda trójka to r (czytanie), w (zapis), x (uruchamianie): rwx = 111 = 7, r-x = 101 = 5, r-- = 100 = 4. Stąd chmod 755 i 644.'
   ],example:{question:'Jaką liczbą zapiszesz uprawnienia rw-?',answer:'rw- = 110₂ = 4 + 2 = 6. Dlatego „rw-r--r--” to 644 — typowe uprawnienia zwykłego pliku.'}},
   ...note(11,'Zadanie z IP: uczeń dopisuje jedną linię — zwróć uwagę na str(), bo join łączy tylko napisy. Potem program z uprawnieniami: uruchomić, odczytać, zmienić listę i odczytać jeszcze raz. Tu wraca replace z lekcji o napisach.','Co oznacza chmod 777 i dlaczego admini go nie lubią?','Wszyscy (także „inni”) mogą czytać, zmieniać i uruchamiać plik — to ryzyko bezpieczeństwa.','Brak str() przy append (join zgłasza TypeError), zamiana horner(zapis) zamiast horner(oktet), mylenie kolejności rwx.','Dla szybkich: zamień kolor #FF8800 na RGB — ale to już system szesnastkowy: int("FF", 16).'),
   activities:[
    {type:'pythonLab',id:'pb-ip',mode:'code',points:4,file:'adres_ip.py',title:'Adres IP z bitów: adres_ip(zapis)',
     prompt:'Funkcja `horner` jest gotowa. Pętla bierze kolejne oktety (napisy z 8 bitami). Dopisz JEDNĄ linię: zamień oktet na liczbę dziesiętną i dopisz ją do listy `wynik` jako napis (`str`).',
     starter:HORNER+'\n\ndef adres_ip(zapis):\n    wynik = []\n    for oktet in zapis.split("."):\n        # dopisz do wyniku: horner(oktet) zamienione na napis\n        pass\n    return ".".join(wynik)\n\n\nprint(adres_ip("11000000.10101000.00000001.00001010"))\nprint(adres_ip("11111111.11111111.11111111.00000000"))\n',
     solution:HORNER+'\n\ndef adres_ip(zapis):\n    wynik = []\n    for oktet in zapis.split("."):\n        wynik.append(str(horner(oktet)))\n    return ".".join(wynik)\n\n\nprint(adres_ip("11000000.10101000.00000001.00001010"))\nprint(adres_ip("11111111.11111111.11111111.00000000"))\n',
     tests:[
      {call:'adres_ip("11000000.10101000.00000001.00001010")',expected:"'192.168.1.10'",label:'Domowy adres'},
      {call:'adres_ip("11111111.11111111.11111111.00000000")',expected:"'255.255.255.0'",label:'Maska /24'},
      {call:'adres_ip("00001010.00000000.00000000.00000001")',expected:"'10.0.0.1'"},
      {call:'adres_ip("01111111.00000000.00000000.00000001")',expected:"'127.0.0.1'",label:'localhost'}
     ],
     hints:['Dopisz do listy: `wynik.append(…)`. W środku: `str(horner(oktet))`.','Cała linia (8 spacji wcięcia, zamiast pass): `wynik.append(str(horner(oktet)))`'],
     summary:'Konwerter IP: {passed}/{total} testów'},
    {type:'pythonLab',id:'pb-chmod',mode:'code',points:1,file:'chmod.py',title:'Uprawnienia plików: rwx → liczba',
     prompt:'Uruchom program: zamienia litery uprawnień na bity (replace) i bity na liczbę (horner). Odczytaj wynik. Potem zmień listę na `["rw-", "r--", "r--"]`, uruchom ponownie i odpowiedz na drugie pytanie.',
     starter:HORNER+'\n\nuprawnienia = ["rwx", "r-x", "r--"]\nfor u in uprawnienia:\n    bity = u.replace("r", "1").replace("w", "1").replace("x", "1").replace("-", "0")\n    print(u, "->", bity, "->", horner(bity))\n',
     questions:[
      {q:'Jaki numer chmod mają uprawnienia rwxr-xr-- (lista w programie)?',answer:'754',inputLabel:'chmod',explain:'rwx = 111 = 7, r-x = 101 = 5, r-- = 100 = 4 → 754. Właściciel może wszystko, grupa czytać i uruchamiać, inni tylko czytać.',hint:'Odczytaj trzy liczby z ostatniej kolumny po kolei.'},
      {q:'A rw-r--r--?',answer:'644',inputLabel:'chmod',explain:'rw- = 110 = 6, r-- = 4, r-- = 4 → 644. To typowe uprawnienia zwykłego pliku, np. strony WWW.',hint:'Zmień listę w programie i uruchom go jeszcze raz.'}
     ]}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań i zadań. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Pytanie na wyjście na forum: dlaczego Horner nie potrzebuje potęg? Zapowiedz: następnym razem odwrotnie — z dziesiętnego na dwójkowy (dzielenie przez 2 z resztą).','Dlaczego schemat Hornera nie potrzebuje znać długości liczby ani liczyć potęg?','Bo każda nowa cyfra mnoży dotychczasowy wynik przez 2 — wcześniejsze cyfry same „dostają” coraz większe wagi, jak przy wpisywaniu cyfr w kalkulator.','„Horner to inna liczba niż suma wag” — nie, to ten sam wynik, policzony w innej kolejności działań.','Zapytaj, gdzie jeszcze widzieli liczby zapisane bitami (kolory, maski, uprawnienia, flagi w grach).'),
   activities:[{type:'resultCard',id:'result',title:'Bity w robocie — wynik',sources:['pb-r1','pb-r2','pb-trace','pb-weights','pb-bug','pb-horner','pb-valid','pb-ip','pb-chmod'],badges:[
    {min:0,name:'0b0',text:'Bity jeszcze się buntują. Wróć do śledzenia 1101 — tam wszystko widać krok po kroku.'},
    {min:0.5,name:'Odczytywacz masek',text:'Wagi i Horner działają. Jeszcze kontrola danych i jesteś gotów na konfigurację routera.'},
    {min:0.85,name:'chmod 777 dla Ciebie',text:'Zamieniasz bity, wyłapujesz złe dane i czytasz IP jak admin. Pełne uprawnienia przyznane.'}
   ]}]}
 ],
 exitTicket:'Liczbę dwójkową zamieniasz na dziesiętną sumą wag (cyfra · 2 do potęgi) albo schematem Hornera (wynik = wynik · 2 + cyfra). Przed zamianą sprawdzasz dane: niepusty napis z samych 0 i 1. Tak program czyta adresy IP, maski i uprawnienia plików.'
};
