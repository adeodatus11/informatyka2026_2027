import {note, choice} from '../schema.js';

const ZLICZ = `def zlicz(tekst, znak):
    licznik = 0
    for z in tekst:
        if z == znak:
            licznik = licznik + 1
    return licznik
`;

const PALINDROM = `def czy_palindrom(t):
    i = 0
    j = len(t) - 1
    while i < j:
        if t[i] != t[j]:
            return False
        i = i + 1
        j = j - 1
    return True
`;

export default {
 id:'55',grade:3,order:19,title:'Programowanie algorytmów na tekstach w języku Python – porównywanie tekstów i zliczanie znaku w tekście',
 subtitle:'Napiszesz od zera to, co robią count, == i < — i sprawdzisz testami, czy Twoje funkcje nie wywracają się na pustym tekście, wielkich literach i polskich znakach.',
 topic:'Własne funkcje na tekstach',icon:'code',tags:['zlicz','palindrom','anagram'],duration:45,
 curriculum:'Informatyka – liceum/technikum, zakres podstawowy (PP 2024): I.2.b — porównywanie tekstów (leksykograficzne, palindrom, anagram) i zliczanie znaku; II.1 — funkcje z parametrami, pętle, warunki, testowanie programu dla różnych danych; I.3 — przypadki brzegowe; II.2 — Python w przeglądarce.',
 format:{
  name:'Poziomy do zaliczenia: pokonaj bibliotekę',
  student:'Pracujesz sam. Każdy poziom to funkcja, którą Python ma już wbudowaną (count, ==, <) — piszesz ją od zera i porównujesz z oryginałem. Kolejny poziom w etapie odblokowuje się po zaliczeniu poprzedniego. Przed sprawdzeniem zgadujesz, który test brzegowy wywróci Twój kod. Efekt: biblioteka czterech funkcji, które przechodzą wszystkie testy.',
  teacher:'Mastery learning: zadania w etapach są ułożone poziomami, trudniejszy odblokowuje się po zaliczeniu łatwiejszego (requires), a każde nieudane sprawdzenie daje konkretną informację z testu. Metapoznanie: przed pisaniem uczeń przewiduje, który przypadek brzegowy (pusty tekst, wielkość liter, spacje, polskie znaki) będzie problemem, a po zaliczeniu porównuje swoją funkcję z wbudowaną. Etap „znajdź błąd” (licznik zerowany w pętli) pokazuje typowy błąd zanim uczeń sam go popełni. Twoja rola: zatrzymaj klasę po etapie 2 i zapytaj, kto zgadł, który test będzie trudny — to rozmowa o planowaniu testów, nie o kodzie.',
  grouping:'Samodzielnie, każdy na swoim komputerze. Para tylko jako opcja przy zadaniu bonusowym (anagram) — wtedy każdy i tak wpisuje kod u siebie.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Piszę funkcję zliczającą znak w pętli i porównuję jej wynik z metodą count.','Programuję porównanie leksykograficzne znak po znaku i wyjaśniam wynik dla wielkich liter i polskich znaków.','Sprawdzam palindrom dwoma wskaźnikami, także dla zdań (bez spacji i wielkości liter).','Dobieram testy brzegowe: pusty tekst, brak znaku, wielkość liter, spacje, polskie znaki.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Python działa w przeglądarce, bez instalacji i logowania.','Projektor do omówienia „znajdź błąd” i porównania z wbudowanymi funkcjami'],
 teacherGuide:{
  preparation:'Otwórz przed dzwonkiem etap 2 na komputerze z projektorem (Python pobiera się raz). Klucz: zlicz("Ala ma kota", "a") = 3, a z lower() 4; błędny program z licznikiem zerowanym w pętli wypisuje 1 dla „banan” i znaku „n” (liczy się tylko ostatnia litera). mniejszy("Łukasz", "Marek") = False, bo ord("Ł") = 321 > 77. Palindromy zdaniowe: „Kobyła ma mały bok”, „Elf układał kufle”, „Może jutro ta dama da tortu jeżom”. Każde zadanie po zaliczeniu pokazuje rozwiązanie wzorcowe.',
  summary:'Uczeń pisze zlicz, mniejszy, czy_palindrom (także zdaniowy) i czy_anagram bez gotowych metod, testuje je na przypadkach brzegowych i porównuje z count, < i ==. Pytanie na wyjście: który test brzegowy najczęściej wywraca funkcje na tekstach i dlaczego?'
 },
 sections:[
  {id:'start',label:'Start',title:'Pokonaj bibliotekę',grouping:'class',
   intro:'Python ma gotowe count, == i <. Po co pisać je samemu? Bo na rozmowie o pracę i na maturze każą Ci to zrobić — i bo dopiero wtedy wiesz, co robią z wielkimi literami, pustym tekstem i polskimi znakami. Najpierw dwa pytania z poprzedniej lekcji, bez notatek.',
   reading:{title:'Test brzegowy',paragraphs:[
    'Program, który działa na „Ala ma kota”, może się wywrócić na pustym tekście, na „ALA” albo na „Łukasz”. Takie nietypowe dane to przypadki brzegowe. Programiści piszą testy najpierw dla nich — bo tam siedzą błędy.',
    'W tej lekcji każda funkcja ma testy brzegowe. Zanim klikniesz „Sprawdź”, zgadnij, który test nie przejdzie. Jeśli trafisz — umiesz myśleć jak tester. Jeśli nie — wiesz, czego pilnować następnym razem.'
   ],example:{question:'Jakie testy brzegowe dobrać do funkcji zliczającej znak?',answer:'Pusty tekst (wynik 0), znak, którego nie ma (0), sam znak powtórzony („aaaa” → 4), wielka litera zamiast małej (A to nie a).'}},
   ...note(4,'Hak: zapytaj, ile wyjdzie z "Ala".count("a") — większość powie 2, a Python mówi 1. To wprowadzenie do przypadków brzegowych. Potem pytania powtórkowe bez notatek; omów pytanie o find, jeśli są błędy. Wszyscy otwierają etap 2 (ładowanie Pythona).','Ile zwróci "Ala".count("a") i dlaczego nie 2?','1 — wielkie A to inny znak (kod 65) niż małe a (97).','Przekonanie, że count ignoruje wielkość liter. Uczniowie nie pamiętają, że find zwraca −1.','Zapytaj, kto miał kiedyś błąd w aplikacji przez wielkie litery (np. login nie działał, bo był wpisany z wielkiej litery).'),
   activities:[
    choice('pc-r1','Powtórka z poprzedniej lekcji: co wypisze print("informatyka"[2:6])?',['form','forma','nfor','orma'],[0],'Indeksy 2, 3, 4, 5 — litery f, o, r, m. Koniec wycinka (6) nie wchodzi.','Licz od 0: i=0, n=1, f=2…'),
    choice('pc-r2','Co zwróci "kot".find("x")?',['-1','0','None','Błąd programu'],[0],'find zwraca −1, gdy fragmentu nie ma. Dziś też będziesz wracać z funkcji ze specjalną odpowiedzią.','To wartość, która nie może być prawdziwym indeksem od lewej.')
   ]},
  {id:'count',label:'Zliczanie',title:'Poziom 1: zlicz bez count',grouping:'solo',
   intro:'Najpierw znajdź błąd w cudzym kodzie — przewidź, co wypisze. Potem napisz własną funkcję zlicz(tekst, znak) i porównaj ją z count.',
   reading:{title:'Licznik zawsze PRZED pętlą',paragraphs:[
    'Schemat zliczania: licznik = 0 przed pętlą, w pętli warunek i licznik = licznik + 1, return po pętli. Każda z tych trzech linii ma swoje miejsce — przesunięta o jedno wcięcie zmienia wynik.',
    'Metoda tekst.count(znak) robi to samo. Twoja funkcja i count muszą dawać identyczne wyniki dla tych samych danych — to najprostszy test, czy algorytm jest dobry.'
   ],example:{question:'Przykład rozwiązany: zlicz("kajak", "k")',answer:'licznik: k → 1, a → 1, j → 1, a → 1, k → 2. Wynik 2, tak samo jak "kajak".count("k").'}},
   ...note(10,'Najpierw przewidywanie (2 min) — większość wpisze 2, a program wypisze 1. Zapytaj, kto wie dlaczego, zanim pokażesz wyjaśnienie. Potem funkcja zlicz. Po zaliczeniu uczniowie odpowiadają na pytanie o „Ala ma kota”: tu wraca wielkość liter.','Dlaczego błędny program wypisał 1 dla „banan”?','licznik = 0 jest w pętli, więc przy każdym znaku licznik się zeruje. Zostaje tylko wynik ostatniego znaku — n, więc 1.','return w środku pętli (koniec po pierwszym znaku), licznik + 1 bez przypisania, porównanie z nazwą zmiennej zamiast z parametrem znak.','Dla szybkich: zlicz_bez_wielkosci(tekst, znak) — dopisz lower() po obu stronach porównania.'),
   activities:[
    {type:'pythonLab',id:'pc-bug',mode:'predict',points:2,file:'blad.py',title:'Znajdź błąd: co wypisze ten program?',
     prompt:'Ktoś chciał policzyć litery „n” w słowie „banan”. Przeczytaj kod uważnie — jedna linia jest w złym miejscu. Co naprawdę wypisze program?',
     code:'tekst = "banan"\nfor z in tekst:\n    licznik = 0\n    if z == "n":\n        licznik = licznik + 1\nprint(licznik)\n',predictRows:1,
     explain:'`licznik = 0` jest WEWNĄTRZ pętli, więc licznik zeruje się przy każdej literze. Po pętli zostaje wynik tylko dla ostatniej litery „n”: 1. Poprawka: przenieś `licznik = 0` przed pętlę.'},
    {type:'pythonLab',id:'pc-zlicz',mode:'code',points:3,file:'zlicz.py',title:'Poziom 1: zlicz(tekst, znak)',
     prompt:'Napisz funkcję, która zwraca, ile razy `znak` występuje w `tekst`. Bez `count` — pętla i licznik. Testy sprawdzą też pusty tekst i wielkie litery.',
     starter:'def zlicz(tekst, znak):\n    # licznik przed pętlą, w pętli warunek, return po pętli\n    return 0\n\n\nprint(zlicz("banan", "n"), "banan".count("n"))\n',
     solution:ZLICZ+'\n\nprint(zlicz("banan", "n"), "banan".count("n"))\n',
     tests:[
      {call:'zlicz("banan", "n")',expected:'2'},
      {call:'zlicz("", "a")',expected:'0',label:'Pusty tekst'},
      {call:'zlicz("kot", "x")',expected:'0',label:'Znaku nie ma'},
      {call:'zlicz("Ala ma kota", "a")',expected:'3',label:'Wielkie A się nie liczy'},
      {call:'zlicz("żółw żuje", "ż")',expected:'2',label:'Polska litera'},
      {call:'all(zlicz(t, z) == t.count(z) for t, z in [("aaaa", "a"), ("Mississippi", "s"), ("", "x")])',expected:'True',label:'Te same wyniki co str.count'}
     ],
     sourceChecks:[{pattern:'\\.count\\(',absent:true,label:'Funkcja nie używa gotowego count',hint:'Usuń count z funkcji zlicz — napisz pętlę z licznikiem. (W print poniżej funkcji count może zostać.)'}],
     hints:['Przed pętlą: `licznik = 0`. Pętla: `for z in tekst:`','W pętli: `if z == znak:` i pod spodem (8 spacji) `licznik = licznik + 1`.','Na końcu, poza pętlą (4 spacje): `return licznik`.'],
     questions:[{q:'Ile zwróci zlicz("Ala ma kota", "a")?',answer:'3',inputLabel:'Wynik',explain:'Trzy małe „a”: Al-a, m-a, kot-a. Wielkie A na początku to inny znak. Jeśli chcesz liczyć oba, porównuj z.lower() == znak.',hint:'Policz tylko małe a.'}]}
   ]},
  {id:'compare',label:'Porównanie',title:'Poziom 2: mniejszy(a, b) — Twoje własne <',grouping:'solo',
   intro:'Lista kontaktów, ranking graczy, sortowanie plików — wszędzie działa porównanie tekstów. Ułóż z klocków funkcję, która robi to samo co a < b. Testy porównają ją z prawdziwym <.',
   reading:{title:'Do pierwszej różnicy',paragraphs:[
    'Pętla while idzie po indeksach i, dopóki oba teksty mają znak na pozycji i. Na pierwszej różnicy funkcja od razu zwraca a[i] < b[i] — porównanie dwóch znaków (kodów). Jeśli pętla dojdzie do końca krótszego tekstu bez różnicy, wygrywa krótszy: return len(a) < len(b).',
    'Dla takich samych tekstów oba warunki dają False — „ala” nie jest mniejsza od „ala”. Dokładnie tak działa a < b w Pythonie, łącznie z pułapką: polskie litery mają duże kody, więc „Łukasz” jest „większy” niż „Zosia”.'
   ],example:{question:'Przykład rozwiązany: mniejszy("ala", "alaska")',answer:'i = 0, 1, 2: znaki równe. Przy i = 3 tekst „ala” się kończy, pętla staje. len("ala") < len("alaska") → True.'}},
   ...note(11,'Układanka jest dla wszystkich; nie podpowiadaj od razu, którą linią jest pułapka. Po zaliczeniu zadaj pytanie o „Łukasz” i „Marek” na forum — i zapytaj, jak to naprawić (porównywać według alfabetu polskiego — w Pythonie robi to moduł locale, czego dziś nie robimy).','Dlaczego funkcja zwraca od razu a[i] < b[i], a nie sprawdza dalszych znaków?','Bo pierwsza różnica rozstrzyga kolejność — dalsze znaki nie mogą tego zmienić.','Pętla bez warunku i < len(b) (IndexError dla „alaska”, „ala”), return True/False na stałe zamiast porównania znaków, zła kolejność warunków.','Zapytaj, jak przerobić funkcję, żeby nie rozróżniała wielkości liter (lower() na początku).'),
   activities:[
    {type:'pythonLab',id:'pc-less',mode:'parsons',points:4,file:'porownaj.py',title:'Układanka: mniejszy(a, b)',
     prompt:'Ułóż funkcję, która zwraca True, gdy tekst `a` powinien stać przed `b`. Jedna linia to pułapka. Testy porównają wynik z wbudowanym operatorem <.',
     solution:'def mniejszy(a, b):\n    i = 0\n    while i < len(a) and i < len(b):\n        if a[i] != b[i]:\n            return a[i] < b[i]\n        i = i + 1\n    return len(a) < len(b)\n',
     distractors:['return len(a) > len(b)'],
     tests:[
      {call:'mniejszy("abc", "abd")',expected:'True'},
      {call:'mniejszy("abd", "abc")',expected:'False'},
      {call:'mniejszy("ala", "alaska")',expected:'True',label:'Krótszy początek wygrywa'},
      {call:'mniejszy("alaska", "ala")',expected:'False'},
      {call:'mniejszy("ala", "ala")',expected:'False',label:'Takie same'},
      {call:'mniejszy("", "a")',expected:'True',label:'Pusty tekst'},
      {call:'all(mniejszy(a, b) == (a < b) for a in ["Zosia", "adam", "Łukasz", "Ola", "Olaf"] for b in ["Zosia", "adam", "Łukasz", "Ola", "Olaf"])',expected:'True',label:'Te same wyniki co <'}
     ],
     hints:['Kolejność: def, i = 0, while, if, return a[i] < b[i], i = i + 1, return len…','`i = i + 1` jest w pętli, ale NIE pod if (2 poziomy wcięcia, tak jak if). Ostatni return jest poza pętlą (1 poziom).']},
    {type:'pythonLab',id:'pc-less-q',mode:'code',points:1,file:'kontakty.py',title:'Sprawdź: kontakty po kodach',
     requires:'pc-less',requiresTitle:'Układanka: mniejszy(a, b)',
     prompt:'Uruchom program — sortuje kontakty wbudowanym `sorted`, czyli tym samym porównaniem co Twoja funkcja. Odpowiedz na pytanie.',
     starter:'kontakty = ["Marek", "Łukasz", "adam", "Zosia", "Ela"]\nprint(sorted(kontakty))\nprint(ord("Ł"), ord("M"), ord("Z"), ord("a"))\n',
     questions:[{q:'Dlaczego „Łukasz” jest na końcu listy?',options:['Bo „Ł” ma kod 321 — większy niż kod każdej litery bez ogonka','Bo Łukasz jest najdłuższym imieniem','Bo sorted sortuje od końca','Bo Python nie obsługuje polskich liter'],correct:[0],explain:'Porównanie kodów stawia „Ł” (321) za „Z” (90) i za „a” (97). Telefon używa reguł języka polskiego; w Pythonie robi się to osobnym kluczem sortowania.',hint:'Spójrz na drugą linię wyniku: kody liter.'}]}
   ]},
  {id:'palindrome',label:'Palindrom',title:'Poziom 3: palindrom — słowa i zdania',grouping:'solo',
   intro:'Dwa wskaźniki: i od lewej, j od prawej. Dopisz brakujący warunek, a potem odblokuj wersję zdaniową: „Kobyła ma mały bok”.',
   reading:{title:'Dwa wskaźniki',paragraphs:[
    'i = 0 wskazuje pierwszy znak, j = len(t) − 1 — ostatni. Dopóki i < j: jeśli znaki są różne, od razu return False. Jeśli równe — i idzie w prawo, j w lewo. Gdy się spotkają, wszystkie pary były równe: return True. Pusty tekst i jedna litera to też palindromy — pętla nie wykona się ani razu.',
    'Zdania trzeba najpierw przygotować: zamienić na małe litery i usunąć spacje (t.lower().replace(" ", "")). Dopiero potem sprawdzasz palindrom tą samą funkcją. Rozdzielenie „przygotuj” i „sprawdź” to dobry nawyk — każdą część testujesz osobno.'
   ],example:{question:'Przykład rozwiązany: „Elf układał kufle”',answer:'lower + bez spacji → „elfukładałkufle”. e = e, l = l, f = f, u = u, k = k, ł = ł, a = a, środkowe d zostaje. Palindrom.'}},
   ...note(9,'Poziom 3a jest krótki (jeden if). Poziom 3b odblokowuje się po 3a. Zapytaj przed sprawdzeniem: który test wywróci funkcję zdaniową, jeśli zapomnisz lower()? (Kobyła — K i k).','Dlaczego czy_palindrom("") zwraca True i czy to rozsądne?','Pętla while 0 < -1 się nie wykona, więc funkcja zwraca True. To umowa: pusty tekst czyta się tak samo od tyłu. Ważne, żeby funkcja się nie wywróciła.','return True wewnątrz pętli (sprawdza tylko pierwszą parę), brak j = j − 1 (pętla nieskończona — środowisko przerwie po 3 s), replace bez przypisania.','Dla szybkich: usuń też przecinki i znaki zapytania (kolejne replace albo pętla z isalpha).'),
   activities:[
    {type:'pythonLab',id:'pc-pal',mode:'code',points:3,file:'palindrom.py',title:'Poziom 3a: czy_palindrom(t)',
     prompt:'Dopisz w pętli warunek: jeśli `t[i]` różni się od `t[j]`, funkcja ma zwrócić `False`. Resztę już masz.',
     starter:'def czy_palindrom(t):\n    i = 0\n    j = len(t) - 1\n    while i < j:\n        # jeśli znaki na pozycjach i oraz j są różne → return False\n        i = i + 1\n        j = j - 1\n    return True\n\n\nprint(czy_palindrom("kajak"), czy_palindrom("kotek"))\n',
     solution:PALINDROM+'\n\nprint(czy_palindrom("kajak"), czy_palindrom("kotek"))\n',
     tests:[
      {call:'czy_palindrom("kajak")',expected:'True'},
      {call:'czy_palindrom("kotek")',expected:'False'},
      {call:'czy_palindrom("abba")',expected:'True',label:'Parzysta liczba liter'},
      {call:'czy_palindrom("")',expected:'True',label:'Pusty tekst'},
      {call:'czy_palindrom("x")',expected:'True',label:'Jedna litera'},
      {call:'czy_palindrom("Kajak")',expected:'False',label:'K ≠ k — wielkość liter się liczy'}
     ],
     hints:['Warunek: `if t[i] != t[j]:` — z dwukropkiem, w pętli (8 spacji wcięcia).','Pod warunkiem (12 spacji): `return False`.']},
    {type:'pythonLab',id:'pc-pal2',mode:'code',points:3,file:'palindrom_zdanie.py',title:'Poziom 3b: palindrom zdaniowy',
     requires:'pc-pal',requiresTitle:'Poziom 3a: czy_palindrom(t)',
     prompt:'Uzupełnij `czy_palindrom_zdanie(zdanie)`: najpierw zamień tekst na małe litery i usuń spacje, potem wywołaj gotową `czy_palindrom`.',
     starter:PALINDROM+'\n\ndef czy_palindrom_zdanie(zdanie):\n    t = zdanie\n    # przygotuj t: małe litery i bez spacji\n\n    return czy_palindrom(t)\n\n\nprint(czy_palindrom_zdanie("Kobyła ma mały bok"))\n',
     solution:PALINDROM+'\n\ndef czy_palindrom_zdanie(zdanie):\n    t = zdanie.lower().replace(" ", "")\n    return czy_palindrom(t)\n\n\nprint(czy_palindrom_zdanie("Kobyła ma mały bok"))\n',
     tests:[
      {call:'czy_palindrom_zdanie("Kobyła ma mały bok")',expected:'True'},
      {call:'czy_palindrom_zdanie("Elf układał kufle")',expected:'True'},
      {call:'czy_palindrom_zdanie("Może jutro ta dama da tortu jeżom")',expected:'True',label:'Polskie litery'},
      {call:'czy_palindrom_zdanie("Ala ma kota")',expected:'False'},
      {call:'czy_palindrom_zdanie("Kajak")',expected:'True',label:'Wielka litera na początku'}
     ],
     hints:['Małe litery: `zdanie.lower()`. Bez spacji: `.replace(" ", "")`.','Połącz w jednej linii: `t = zdanie.lower().replace(" ", "")`'],
     summary:'Palindromy zdaniowe: {passed}/{total} testów'}
   ]},
  {id:'anagram',label:'Anagram',title:'Poziom 4: anagram z Twoim zlicz',grouping:'solo',
   intro:'„arbuz” i „burza” mają te same litery. Użyj swojej funkcji zlicz: dwa słowa są anagramami, gdy mają tę samą długość i każda litera występuje w nich tyle samo razy.',
   reading:{title:'Licz, zamiast sortować',paragraphs:[
    'Na lekcji bez kodu sortowaliśmy litery jak karty. W kodzie można też liczyć: dla każdej litery z pierwszego słowa sprawdź, czy zlicz(a, litera) == zlicz(b, litera). Pierwsza różnica — return False. Wcześniej sprawdź długości: „kot” i „kota” odpadają od razu.',
    'Sprawdzanie samej obecności liter nie wystarczy: „aab” i „abb” mają te same litery, ale w innej liczbie. Dlatego porównujesz liczby wystąpień, a nie tylko „czy litera jest”.'
   ],example:{question:'Czy „kotek” i „kotka” to anagramy?',answer:'Długości równe (5). Litera e: w „kotek” 1, w „kotka” 0 — różnica, więc nie.'}},
   ...note(7,'Zadanie zamykające — może być w parze (opcjonalnie). Jeśli brakuje czasu, pomiń i potraktuj jako zadanie dla chętnych przy kolejnej lekcji. Zwróć uwagę na test „aab”/„abb” — wywraca rozwiązania sprawdzające tylko „czy litera jest w słowie”.','Dlaczego test „aab” i „abb” jest potrzebny?','Bo obie wersje mają litery a i b — funkcja sprawdzająca tylko obecność liter uznałaby je za anagramy. Liczby wystąpień się różnią.','Pominięcie sprawdzenia długości („kot”/„kota”), return True wewnątrz pętli, porównywanie liter bez lower().','Dla szybkich: wersja z sortowaniem — sorted(a) == sorted(b) — i porównanie, która jest krótsza w zapisie.',true),
   activities:[
    {type:'pythonLab',id:'pc-anagram',mode:'code',points:4,file:'anagram.py',title:'Poziom 4: czy_anagram(a, b)',
     prompt:'Funkcja `zlicz` jest gotowa, a słowa są już zamienione na małe litery. Dopisz: jeśli długości są różne → `False`; potem pętla po literach `a` — jeśli liczba wystąpień w `a` i `b` jest różna → `False`. Na końcu `True`.',
     starter:ZLICZ+'\n\ndef czy_anagram(a, b):\n    a = a.lower()\n    b = b.lower()\n    # 1) różne długości → False\n    # 2) dla każdej litery z a: różna liczba wystąpień w a i b → False\n    return True\n\n\nprint(czy_anagram("arbuz", "burza"), czy_anagram("kotek", "kotka"))\n',
     solution:ZLICZ+'\n\ndef czy_anagram(a, b):\n    a = a.lower()\n    b = b.lower()\n    if len(a) != len(b):\n        return False\n    for litera in a:\n        if zlicz(a, litera) != zlicz(b, litera):\n            return False\n    return True\n\n\nprint(czy_anagram("arbuz", "burza"), czy_anagram("kotek", "kotka"))\n',
     tests:[
      {call:'czy_anagram("arbuz", "burza")',expected:'True'},
      {call:'czy_anagram("Klasa", "skala")',expected:'True',label:'Wielka litera'},
      {call:'czy_anagram("kotek", "kotka")',expected:'False'},
      {call:'czy_anagram("kot", "kota")',expected:'False',label:'Różna długość'},
      {call:'czy_anagram("aab", "abb")',expected:'False',label:'Te same litery, inna liczba'},
      {call:'czy_anagram("", "")',expected:'True',label:'Dwa puste teksty'}
     ],
     hints:['Długości: `if len(a) != len(b):` i `return False`.','Pętla: `for litera in a:`, w niej `if zlicz(a, litera) != zlicz(b, litera):` i `return False`.']}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z poziomów. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Zapytaj: który test brzegowy wywrócił najwięcej funkcji? (zwykle wielkość liter albo pusty tekst). Pytanie na wyjście. Zapowiedz: następnym razem wyszukiwanie wzorca — Ctrl+F w Twoim kodzie i licznik porównań.','Który test brzegowy najczęściej wywraca funkcje na tekstach i dlaczego?','Wielkość liter (A ≠ a, inne kody) i pusty tekst (pętla się nie wykonuje albo indeks wychodzi poza tekst).','„Działa dla mojego przykładu, więc działa” — jeden przykład to nie test.','Zapytaj, jakie testy dopisaliby do walidatora nicku z poprzedniej lekcji.'),
   activities:[{type:'resultCard',id:'result',title:'Pokonaj bibliotekę — wynik',sources:['pc-r1','pc-r2','pc-bug','pc-zlicz','pc-less','pc-less-q','pc-pal','pc-pal2','pc-anagram'],badges:[
    {min:0,name:'Tester na stażu',text:'Pierwsze funkcje są. Wróć do testów z ✗ — każdy mówi, co poprawić.'},
    {min:0.5,name:'Autor własnego count',text:'Twoje funkcje robią to co biblioteka. Jeszcze kilka przypadków brzegowych i będą kuloodporne.'},
    {min:0.85,name:'Kobyła ma mały bok',text:'Palindromy, anagramy i porównania — od zera i z testami. Biblioteka pokonana.'}
   ]}]}
 ],
 exitTicket:'Zliczanie to licznik przed pętlą i warunek w pętli. Porównanie tekstów kończy się na pierwszej różnicy, a przy zgodnym początku wygrywa krótszy. Palindrom sprawdzasz dwoma wskaźnikami, a zdania najpierw przygotowujesz (lower, bez spacji). Zawsze testujesz pusty tekst, wielkość liter i polskie znaki.'
};
