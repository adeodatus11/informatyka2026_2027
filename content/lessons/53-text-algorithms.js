import {note, choice} from '../schema.js';
import {COMPARE_MAX, DETECTIVE_MAX, PATTERN_MAX} from '../sims/textLab.js';

export default {
 id:'53',grade:3,order:17,title:'Wybrane algorytmy na tekstach',
 subtitle:'Dowiesz się, jak działa Ctrl+F, dlaczego „adam” ląduje na końcu listy kontaktów i jak filtr nicków może odrzucić niewinny „badminton”.',
 topic:'Algorytmy na tekstach bez kodu',icon:'search',tags:['Ctrl+F','palindrom','wzorzec'],duration:45,
 curriculum:'Informatyka – liceum/technikum, zakres podstawowy (PP 2024): I.2.b — algorytmy na tekstach: porównywanie tekstów, wyszukiwanie wzorca metodą naiwną; I.1, I.3 — kroki rozwiązania i sprawdzanie algorytmu na przykładowych danych. Lekcja bez programowania — przygotowuje tematy 18–20 w Pythonie.',
 format:{
  name:'Śledztwo krok po kroku: przewiduj, potem sprawdź',
  student:'Pracujesz sam, we własnym tempie. Przy każdym algorytmie najpierw przewidujesz wynik, a potem oglądasz, jak liczy komputer — znak po znaku, z licznikiem porównań. W wyszukiwaniu wzorca sam jesteś algorytmem: przy każdym porównaniu wybierasz następny krok. Efekt: punkty na karcie wyniku i liczba porównań, którą umiesz uzasadnić.',
  teacher:'Rdzeń to nauczanie jawne: na projektorze pokazujesz przykład rozwiązany w symulatorze (porównanie Kasia–Kamil, wyszukiwanie „mecz” w SMS-ie) i mówisz na głos, jaką decyzję podejmuje algorytm. Potem uczniowie przewidują wynik przed obejrzeniem kroków — błędne przewidywania to informacja diagnostyczna (ocenianie kształtujące): po każdym etapie sprawdź licznik punktów w kilku miejscach sali i omów na forum pytanie, które sprawiło najwięcej kłopotu. W etapie wzorca uczeń wykonuje algorytm sam; symulator nie przepuszcza złego kroku i tłumaczy, dlaczego. Kod pojawi się dopiero w kolejnych lekcjach — dziś chodzi o to, żeby uczeń umiał opisać algorytm słowami i policzyć porównania.',
  grouping:'Samodzielnie, każdy na swoim komputerze. Sąsiedzi mogą porównać przewidywania przed sprawdzeniem (opcjonalnie). Nie ma ról ani zadań wymagających pary.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Porównuję dwa teksty znak po znaku i wyjaśniam, dlaczego komputer stawia „Zosia” przed „adam”.','Przewiduję wynik zliczania znaku, sprawdzania palindromu i anagramu dla podanych słów.','Wykonuję krok po kroku wyszukiwanie wzorca metodą naiwną i liczę okna oraz porównania.','Rozpoznaję, który algorytm na tekstach działa w Ctrl+F, filtrze nicków i liście kontaktów.'],
 materials:['Komputer z przeglądarką — jeden na osobę, bez logowania','Projektor do pokazania przykładów rozwiązanych','Opcjonalnie: pasek papieru z napisem „mecz” do pokazania przesuwania wzorca nad tekstem na tablicy'],
 teacherGuide:{
  preparation:'Nic nie trzeba instalować. Klucz: Ala przed Alicja (a < i), Ola przed Olaf (krótszy wygrywa), Zosia przed adam (Z = 90 < a = 97), Marek przed Łukasz (Ł = 321). Zliczanie „a”: 5, bez względu na wielkość liter 7; kajak: 2 porównania; „Kobyła ma mały bok” bez przygotowania — nie palindrom, po przygotowaniu 7 porównań; Klasa/skala — anagramy, kotek/kotka — nie. Wzorzec: „mecz” w „idę na mecz” → pozycja 7, 8 okien, 11 porównań; „ok” w „ok, jutro ok?” → 0 i 10, 15 porównań; „haha” w „hahaha” → 0 i 2 (nakładające się), 9 porównań. 10 znaków i wzorzec 3 → 8 okien.',
  summary:`Uczeń porównuje teksty kodami znaków, zlicza znak, sprawdza palindrom dwoma wskaźnikami i anagram przez sortowanie liter, a wyszukiwanie wzorca wykonuje sam krok po kroku. Karta wyniku: pytania powtórkowe, porównywanie (${COMPARE_MAX}), detektyw (${DETECTIVE_MAX}), wzorzec (${PATTERN_MAX}) i zastosowania (maks. ${2+COMPARE_MAX+DETECTIVE_MAX+PATTERN_MAX+2} pkt). Pytanie na wyjście: ile porównań wykona algorytm naiwny dla „aaaa” i wzorca „aa” i ile znajdzie wystąpień?`
 },
 sections:[
  {id:'start',label:'Start',title:'Ctrl+F, kontakty i nicki',grouping:'class',
   intro:'Codziennie korzystasz z algorytmów na tekstach: Ctrl+F w regulaminie, lista kontaktów, wyszukiwarka w czacie, gra, która odrzuca Twój nick. Dziś zobaczysz, co robią w środku — bez pisania kodu. Najpierw dwa pytania z wcześniejszych lekcji, bez notatek.',
   reading:{title:'Tekst to ciąg kodów',paragraphs:[
    'Dla komputera tekst to ciąg znaków, a każdy znak ma numer (kod Unicode). Wielkie A to 65, małe a to 97, a polskie Ł to 321. Wszystkie algorytmy na tekstach porównują właśnie te numery — znak po znaku.',
    'Dlatego liczymy porównania. Ile ich jest, tyle pracy ma komputer. Dla jednego SMS-a to nic, ale dla logów serwera z milionem linii różnica między sprytnym a niesprytnym algorytmem to sekundy kontra godziny.'
   ],example:{question:'Ile znaków ma tekst „ok, jutro”?',answer:'9: o, k, przecinek, spacja, j, u, t, r, o. Spacja i przecinek to też znaki — komputer je porównuje tak samo jak litery.'}},
   ...note(4,'Hak: wyświetl pytanie „Czy »Kobyła ma mały bok« to palindrom — dla człowieka i dla komputera?” i zbierz szybkie głosy (zostaw bez odpowiedzi, wróci w etapie 3). Potem 2 minuty na pytania powtórkowe bez notatek (retrieval practice); omów tylko to, w którym klasa się podzieliła.','Skoro litera A ma kod 65, to jaki kod ma B? A jakie małe a?','B to 66 (kolejne litery mają kolejne kody), małe a to 97 — wielkie i małe litery to różne znaki.','Uczniowie myślą, że komputer zna alfabet i „wie”, że A i a to ta sama litera. Nie wie — porównuje kody.','Zapytaj, czy ktoś miał odrzucony nick w grze albo na Discordzie i z jakiego powodu.'),
   activities:[
    choice('ta-r1','Powtórka z korespondencji seryjnej: co Word wstawia w miejsce pola «imie» w każdym liście?',['Wartość pola imie z kolejnego rekordu źródła danych','Zawsze to samo imię wpisane w szablonie','Losowe imię z listy Worda'],[0],'Szablon ma pola, a źródło danych — rekordy. Każdy list dostaje wartości z innego rekordu. Dziś też będziemy przechodzić po kolejnych elementach — ale po znakach tekstu.','Skąd Word bierze imiona do kolejnych listów?'),
    choice('ta-r2','Z lekcji o systemie szesnastkowym: litera A ma kod 0x41. Ile to dziesiętnie?',['41','65','97','16'],[1],'0x41 = 4 · 16 + 1 = 65. To ten sam kod, który komputer porównuje, gdy sortuje teksty.','Pierwsza cyfra hex ma wagę 16, druga — 1.')
   ]},
  {id:'compare',label:'Porównywanie',title:'Lista kontaktów: kto pierwszy?',grouping:'solo',
   intro:'Telefon sortuje kontakty, gra sprawdza, czy nick jest zajęty, a logowanie — czy hasło się zgadza. Wszędzie działa porównywanie tekstów. Obejrzyj przykład, a potem przewiduj: kto będzie wyżej na liście?',
   reading:{title:'Porównanie leksykograficzne',paragraphs:[
    'Komputer idzie od lewej i porównuje znaki na tych samych pozycjach. Na pierwszej różnicy kończy: wyżej jest tekst z mniejszym kodem znaku. Jeśli jeden tekst jest początkiem drugiego (Ola i Olaf), wyżej jest krótszy. Tak działa porządek w słowniku — stąd nazwa leksykograficzny.',
    'Pułapka: kody to nie alfabet. Wszystkie wielkie litery (65–90) są przed małymi (97–122), a polskie litery mają kody powyżej 200. Program, który sortuje po samych kodach, postawi „Zosia” przed „adam”, a „Łukasza” na samym końcu. Telefon porównuje według reguł języka polskiego.'
   ],example:{question:'Przykład rozwiązany: „kot” i „koc”.',answer:'k = k, o = o, t kontra c: c ma mniejszy kod (99 < 116), więc „koc” jest wyżej. 3 porównania.'}},
   ...note(10,'Nauczanie jawne: pokaż na projektorze odtwarzacz Kasia–Kamil i mów na głos przy każdym kroku („K równe K, idę dalej… s kontra m: m jest wcześniej, koniec”). Podkreśl, że po pierwszej różnicy reszta liter nie ma znaczenia. Potem uczniowie przewidują sami. Po 6 minutach sprawdź, kto ma błąd w parze adam–Zosia — to sygnał do krótkiego wyjaśnienia kodów wielkich i małych liter dla całej klasy.','Dlaczego po pierwszej różnicy komputer nie porównuje dalszych liter?','Bo już wie, który tekst jest wcześniej — dalsze litery nie mogą tego zmienić. To oszczędza porównania.','„Dłuższe słowo jest zawsze dalej” — nie, decyduje pierwsza różnica (Alicja jest za Ala, ale „Ab” jest przed „B”). Mylenie alfabetu z kodami.','Zapytaj: jak posortuje się „10” i „9” jako teksty? („10” przed „9”, bo znak 1 < 9) — stąd pliki „zdjecie10.jpg” przed „zdjecie9.jpg”.'),
   activities:[{type:'textLab',id:'tl-compare',mode:'compare',points:COMPARE_MAX,label:'Porównywanie tekstów (kontakty)'}]},
  {id:'detective',label:'Detektyw',title:'Detektyw tekstów: zliczanie, palindrom, anagram',grouping:'solo',
   intro:'Trzy algorytmy, siedem zagadek. Zliczanie liter przydaje się w sile hasła, palindromy w grach słownych (i w DNA), anagramy w zagadkach i kryptografii. Przewiduj, potem oglądaj krok po kroku.',
   reading:{title:'Trzy proste algorytmy',paragraphs:[
    'Zliczanie: idziesz przez tekst od lewej i przy każdym trafieniu zwiększasz licznik. Każdy znak porównujesz raz. Palindrom (kajak, potop): wskaźnik L zaczyna od lewej, P od prawej; porównujesz ich znaki i przesuwasz je do środka. Pierwsza różnica = nie palindrom.',
    'Anagram (arbuz – burza): te same litery w innej kolejności. Najprostszy sposób: ułóż litery obu słów alfabetycznie, jak karty w ręce, i porównaj. Zanim porównasz zdania, przygotuj tekst: zamień litery na małe i usuń spacje — inaczej komputer potraktuje „K” i „k” jako różne znaki.'
   ],example:{question:'Czy „potop” to palindrom? Ile porównań?',answer:'p = p, o = o, środkowe t zostaje samo. Tak, palindrom — 2 porównania.'}},
   ...note(10,'Uczniowie pracują samodzielnie. Zagadki są ułożone parami: najpierw wersja „surowa”, potem z przygotowaniem tekstu (wielkość liter, spacje). Krąż i pytaj o liczbę porównań: „dlaczego 7, a nie 8?”. Po zakończeniu wróć do haka z etapu 1: komputer bez przygotowania tekstu mówi, że to NIE palindrom.','Dlaczego przy palindromie o 15 znakach porównań jest 7, a nie 15?','Bo każde porównanie sprawdza parę (znak z lewej i z prawej), a środkowy znak nie ma pary: (15 − 1) / 2 = 7.','Liczenie wielkiego „A” jako „a”; wliczanie środkowej litery jako porównania; przekonanie, że te same litery w słowach o tej samej długości wystarczą (kotek/kotka).','Dla szybkich: wymyśl palindrom zdaniowy po polsku i sprawdź go w głowie dwoma wskaźnikami (np. „Elf układał kufle”).'),
   activities:[{type:'textLab',id:'tl-detective',mode:'detective',points:DETECTIVE_MAX,label:'Detektyw tekstów: 7 zagadek'}]},
  {id:'pattern',label:'Wzorzec',title:'Jak działa Ctrl+F? Wyszukiwanie wzorca',grouping:'solo',
   intro:'Ctrl+F, wyszukiwarka SMS-ów, filtr słów w czacie — wszystkie szukają wzorca w tekście. Najprostszy sposób to metoda naiwna: przykładasz wzorzec do każdego miejsca w tekście po kolei. Obejrzyj przykład, a potem sam bądź algorytmem.',
   reading:{title:'Metoda naiwna',paragraphs:[
    'Przykładasz wzorzec do początku tekstu (okno 0) i porównujesz znaki od lewej. Różnica — przesuwasz wzorzec o jedno miejsce w prawo i zaczynasz porównywać od początku wzorca. Wszystkie znaki zgodne — trafienie: zapisujesz pozycję i też przesuwasz o 1. Kończysz, gdy wzorzec przestaje się mieścić w tekście.',
    'Dla tekstu o długości n i wzorca o długości m okien jest n − m + 1. W każdym oknie robisz od 1 do m porównań. Wystąpienia mogą na siebie zachodzić: w „hahaha” wzorzec „haha” zaczyna się na pozycji 0 i 2.'
   ],example:{question:'Tekst „kotek”, wzorzec „ek”. Ile okien?',answer:'5 − 2 + 1 = 4 okna: pozycje 0, 1, 2, 3. Trafienie na pozycji 3.'}},
   ...note(13,'Na projektorze przejdź przykład „mecz” klawiszem Dalej i pokaż licznik porównań. Przypnij na tablicy pasek papieru z „mecz” i przesuwaj go nad napisanym tekstem — dla wielu uczniów to łatwiejsze niż ekran. Potem rundy: symulator nie przepuszcza złego kroku i od razu tłumaczy, co jest źle. Najczęstszy błąd pojawia się po trafieniu: uczniowie „przeskakują” o długość wzorca, a algorytm naiwny przesuwa o 1 — dlatego znajduje nakładające się „haha”.','Dlaczego po trafieniu algorytm przesuwa wzorzec tylko o 1, a nie o całą długość?','Bo kolejne wystąpienie może zaczynać się w środku poprzedniego (hahaha). Algorytm naiwny sprawdza każde możliwe okno.','Mylenie „równe, porównuję dalej” z „trafienie” przed ostatnim znakiem; liczenie okien jako n zamiast n − m + 1; myślenie, że po różnicy przesuwa się o tyle znaków, ile było zgodnych.','Zapytaj: ile porównań w najgorszym razie dla tekstu „aaaaaaaaab” i wzorca „aab”? (8 okien, w każdym 3 porównania = 24).'),
   activities:[{type:'textLab',id:'tl-pattern',mode:'pattern',points:PATTERN_MAX,label:'Wyszukiwanie wzorca: 2 rundy i koszt'}]},
  {id:'apply',label:'Gdzie to działa',title:'Który algorytm tu pracuje?',grouping:'solo',
   intro:'Te same proste algorytmy siedzą w aplikacjach, których używasz. Dopasuj sytuację do algorytmu i rozwiąż przypadek z filtrem nicków.',
   reading:{title:'Algorytm to nie wszystko — liczą się też reguły',paragraphs:[
    'Filtr nicków szuka zakazanych słów (wyszukiwanie wzorca), zwykle bez względu na wielkość liter. Ale prosty filtr nie rozumie słów: „admin” jest wzorcem także w „badminton”. To znany problem filtrów treści — dlatego dobre systemy mają listę wyjątków albo sprawdzają całe słowa.',
    'Wyszukiwarka w telefonie często nie znajdzie „szkoła”, gdy wpiszesz „szkola” — „ł” i „l” to różne kody. Lepsze wyszukiwarki najpierw sprowadzają tekst do jednej postaci (małe litery, bez polskich znaków), a dopiero potem porównują.'
   ]},
   ...note(4,'Szybkie zadania na transfer. Omów przypadek „badminton”: algorytm zadziałał poprawnie, a mimo to wynik jest zły dla człowieka — to dobry moment, żeby powiedzieć, że testy dobiera się z myślą o nietypowych danych.','Jak poprawić filtr, żeby przepuścił „badminton_pro”, a dalej blokował „Admin_Official”?','Np. sprawdzać, czy zakazane słowo stoi na początku nicku lub jako osobne słowo, albo mieć listę wyjątków. Każda reguła ma swoje wady — trzeba ją przetestować.','Uczniowie łączą „siła hasła” z palindromem albo „lista kontaktów” z wyszukiwaniem — warto dopytać, co dokładnie robi aplikacja.','Zapytaj o inne przykłady z życia: autokorekta, wykrywanie plagiatu, wyszukiwanie w PDF.'),
   activities:[
    {type:'matching',id:'ta-match',question:'Dopasuj sytuację do algorytmu, który wykonuje najważniejszą pracę.',options:['Porównywanie tekstów','Zliczanie znaku','Wyszukiwanie wzorca','Sprawdzanie palindromu'],rows:[
     {label:'Telefon układa listę kontaktów od A do Ż',correct:[0],explanation:'Sortowanie to wiele porównań par tekstów.'},
     {label:'Formularz sprawdza, czy hasło ma co najmniej 2 cyfry',correct:[1],explanation:'Liczy znaki spełniające warunek — to zliczanie.'},
     {label:'Ctrl+F podświetla słowo „zwrot” w regulaminie',correct:[2],explanation:'Szuka wszystkich okien, w których pasuje wzorzec.'},
     {label:'Gra słowna daje bonus za słowo czytane tak samo od tyłu',correct:[3],explanation:'Dwa wskaźniki od końców — palindrom.'},
     {label:'Logowanie sprawdza, czy wpisany login zgadza się z zapisanym',correct:[0],explanation:'Porównanie dwóch tekstów — czy są identyczne.'}
    ]},
    choice('ta-badminton','Gra odrzuca każdy nick, w którym występuje słowo „admin” (bez względu na wielkość liter). Który nick zostanie odrzucony, choć nikt się pod admina nie podszywa?',['badminton_pro','Kot_Filemon','xX_Ola_Xx','Ninja2009'],[0],'„b-ADMIN-ton”: wzorzec „admin” pasuje od pozycji 1. Algorytm wyszukiwania wzorca działa poprawnie, ale reguła jest zbyt prosta — to klasyczny problem filtrów treści.','Poszukaj ciągu a-d-m-i-n w środku nicków.')
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z pytań powtórkowych, trzech symulatorów i zastosowań. Zaznacz samoocenę i pokaż kartę nauczycielowi. Na następnej lekcji te same algorytmy zapiszesz w Pythonie.',
   ...note(4,'Pytanie na wyjście (na forum): „aaaa” i wzorzec „aa” — ile okien, ile porównań, ile wystąpień? (3 okna, 6 porównań, 3 wystąpienia: 0, 1, 2). Zapowiedz: następnym razem Python i napisy — pierwszy program w 3 minuty. Uczniowie fotografują kartę albo pokazują ją.','Ile wystąpień „aa” znajdzie algorytm naiwny w „aaaa”?','3 — na pozycjach 0, 1 i 2, bo wystąpienia mogą się nakładać, a po trafieniu przesuwamy wzorzec o 1.','Odpowiedź „2” (liczenie bez nakładania). Warto zostawić to jako zagadkę — w lekcji o Pythonie okaże się, że str.count też powie 2.','Zapytaj, kto chciałby zobaczyć te algorytmy w kodzie — i zapowiedz, że w Pythonie zajmą po kilka linii.'),
   activities:[{type:'resultCard',id:'result',title:'Detektyw tekstów — wynik',sources:['ta-r1','ta-r2','tl-compare','tl-detective','tl-pattern','ta-match','ta-badminton'],badges:[
    {min:0,name:'Ctrl+F w trybie demo',text:'Algorytmy jeszcze się ładują. Wróć do odtwarzacza i przejdź przykład krok po kroku — to naprawdę pomaga.'},
    {min:0.5,name:'Detektyw z licencją',text:'Porównujesz, liczysz i szukasz jak komputer. Jeszcze trochę pewności przy oknach i porównaniach.'},
    {min:0.85,name:'Człowiek-algorytm',text:'Kody znaków, dwa wskaźniki, okno wzorca — robisz to szybciej niż Ctrl+F w starym Wordzie.'}
   ]}]}
 ],
 exitTicket:'Komputer porównuje teksty znak po znaku według kodów, a nie alfabetu. Zliczanie, palindrom i anagram to proste pętle po znakach. Metoda naiwna sprawdza każde z n − m + 1 okien i znajduje także wystąpienia, które na siebie zachodzą.'
};
