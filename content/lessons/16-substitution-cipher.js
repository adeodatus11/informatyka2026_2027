import {note, choice, reveal} from '../schema.js';

export default {
 id:'16',grade:2,title:'Szyfrowanie tekstu metodą podstawieniową',
 subtitle:'Zaszyfrujesz wiadomość dla kumpla, złamiesz cudzą bez klucza — i zrozumiesz, czemu Twojego WhatsAppa nie da się złamać tak samo.',
 topic:'Szyfrowanie tekstu metodą podstawieniową',icon:'lock',tags:['Cezar','GA-DE-RY-PO-LU-KI','Częstość liter'],duration:45,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): algorytmy na tekstach — szyfrowanie i deszyfrowanie tekstu metodą podstawieniową (szyfr Cezara); wprowadzenie do lekcji 17 (program szyfrujący w Pythonie)',
 format:{
  name:'Gra w parach „szyfrant i łamacz” + nauczanie dialogowe',
  student:'Najpierw poznajesz dwa szyfry na tarczy i w maszynie harcerskiej. Potem pojedynek w parze: jedna osoba szyfruje, druga łamie — na czas. Na koniec łamiesz szyfr, przy którym 25 kluczy już nie wystarczy. Efekt: złamane hasło i punkty na karcie wyniku.',
  teacher:'Start: hak (harcerze, Cezar, WhatsApp) i dwa pytania powtórkowe bez notatek. Etap Cezara to nauczanie jawne: pokazujesz na projektorze tarczę (klucz 3, słowo KOT → NRW), uczniowie robią 3 zadania sami. GA-DE-RY-PO-LU-KI to szybkie odkrycie „szyfrowanie = deszyfrowanie”. Główna część to pojedynek w parach (uczenie kooperacyjne): role szyfranta i łamacza, zamiana ról, ranking czasów łamania na tablicy. Potem łamanie szyfru analizą częstości z podpowiedziami stopniowanymi. Kończysz rozmową dialogową: dlaczego szyfr podstawieniowy nie chroni haseł — uczniowie uzasadniają na podstawie tego, co sami złamali.',
  grouping:'Etapy 1–3 i 5: samodzielnie (sąsiedzi mogą się naradzać). Etap 4: pary z rolami szyfrant/łamacz i zamianą ról. Przy nieparzystej liczbie osób jedna trójka (dwóch łamaczy ściga się na tym samym szyfrogramie) albo praca solo — symulator generuje wtedy zagadkę do złamania.',
  methods:[
   {name:'Uczenie kooperacyjne',url:'https://metodyka.covepolska.pl/metoda-uczenie-kooperacyjne.html'},
   {name:'Nauczanie dialogowe',url:'https://metodyka.covepolska.pl/metoda-nauczanie-dialogowe.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:[
  'Szyfruję i odszyfrowuję tekst szyfrem Cezara, używając klucza i tabeli podstawień.',
  'Wyjaśniam, dlaczego w GA-DE-RY-PO-LU-KI szyfrowanie i deszyfrowanie to ta sama operacja.',
  'Łamię szyfr Cezara, sprawdzając klucze, a szyfr podstawieniowy — analizą częstości liter.',
  'Uzasadniam, dlaczego szyfrów podstawieniowych nie używa się do ochrony prawdziwych danych.'
 ],
 materials:['Przeglądarka — jedno urządzenie na osobę (w pojedynku para siedzi obok siebie albo naprzeciw)','Projektor do pokazania tarczy Cezara','Kartka i długopis do ręcznego odszyfrowania w etapie 3 i do notatek przy łamaniu'],
 teacherGuide:{
  preparation:'Wyświetl etap 2 na projektorze. Klucze: Cezar — „Kartkówka jutro”, klucz 3 → NDUWNRZND MXWUR; szyfrogram WPGGH WV SLRJQHJO, klucz 7 → PIZZA PO LEKCJACH; kluczy zmieniających tekst jest 25. GA-DE-RY-PO-LU-KI: PANKSIP → OGNISKO. Zagadki solo w pojedynku mają klucze 9, 17 i 4. Analiza częstości: hasło końcowe REJEWSKI, klucz to rząd liter klawiatury QWERTY (A→Q, B→W, C→E…). Na tablicy przygotuj tabelkę „Ranking łamaczy: para — liczba prób — czas”.',
  summary:'Uczeń szyfruje i deszyfruje Cezarem (także z polskimi znakami zamienionymi na łacińskie), wie, że kluczy jest 25, rozumie, że GA-DE-RY-PO-LU-KI działa w obie strony tą samą zamianą, i łamie szyfr bez klucza: Cezara przez sprawdzenie kluczy, dowolne podstawienie przez częstość liter. Na karcie wyniku: maks. 29 pkt, produkt „Złamany szyfr: REJEWSKI”. Pytanie na wyjście: dlaczego bezpieczeństwo nie może zależeć od tajności metody (zasada Kerckhoffsa)?'
 },
 sections:[
  {id:'start',label:'Start',title:'Szyfr harcerzy, Cezara i WhatsAppa',grouping:'class',
   intro:'Harcerze szyfrowali GA-DE-RY-PO-LU-KI, Juliusz Cezar przesuwał litery o 3. Dziś zaszyfrujesz wiadomość dla kolegi — i złamiesz cudzą, nie znając klucza. Najpierw dwa pytania bez notatek.',
   reading:{title:'Po co Ci to dziś?',paragraphs:[
    'Szyfrujesz codziennie, nawet o tym nie wiedząc: WhatsApp i Signal szyfrują wiadomości „end-to-end” — tylko Ty i odbiorca macie klucze. Kłódka w przeglądarce oznacza, że połączenie ze stroną jest szyfrowane.',
    'Dzisiejsze szyfry są stare i słabe: złamiesz je w kilka minut. Właśnie dlatego to dobra lekcja — zobaczysz, jak myśli łamacz. I zrozumiesz, dlaczego do prawdziwych danych nie wymyśla się własnych „sprytnych” szyfrów.'
   ],example:{question:'Szyfrowanie czy ukrywanie?',answer:'Plik schowany w ukrytym folderze da się otworzyć, gdy ktoś go znajdzie. Zaszyfrowany — nie da się przeczytać bez klucza, nawet jeśli leży na pulpicie.'}},
   ...note(4,'Rzuć hak: zapytaj, kto był w harcerstwie albo słyszał o GA-DE-RY-PO-LU-KI. Potem 2 minuty na dwa pytania powtórkowe bez notatek (retrieval practice). Omów tylko pytanie, na którym klasa się podzieliła. Karty „Gdzie spotkasz szyfr” zostaw chętnym.','Co musi mieć odbiorca, żeby odczytać zaszyfrowaną wiadomość?','Klucz (i znajomość metody). Bez klucza szyfrogram powinien być nieczytelny.','Mylenie szyfrowania z ukrywaniem pliku, kompresją ZIP albo zmianą nazwy pliku. Przekonanie, że „szyfr” to tajna metoda — ważniejszy jest klucz.','Zapytaj, czy ktoś widział w telefonie komunikat „Wiadomości są szyfrowane end-to-end” i co on oznacza.'),
   activities:[
    choice('l16-r1','Powtórka z lekcji 12: co łączy korespondencja seryjna?',['Dokument główny z polami ze źródłem danych (np. kwerendą albo arkuszem)','Dwa dokumenty Worda w jeden długi plik','Bazę danych z pocztą — Access sam wysyła e-maile'],[0],'Szablon z polami «imie», «termin» + źródło danych = tyle dokumentów, ile rekordów. Dziś też będziemy zamieniać — ale litery, według klucza.','Pomyśl o przypomnieniach dla pacjentów: skąd Word brał imiona?'),
    choice('l16-r2','Co to znaczy zaszyfrować wiadomość?',['Zamienić ją tak, żeby bez klucza nie dało się jej przeczytać, a z kluczem dało się ją odtworzyć','Spakować ją do ZIP, żeby zajmowała mniej miejsca','Schować plik w ukrytym folderze'],[0],'Szyfrowanie jest odwracalne, ale tylko z kluczem. Kompresja zmniejsza plik (każdy go rozpakuje), a ukrycie folderu nie chroni treści.','Która odpowiedź mówi coś o kluczu?'),
    reveal('l16-where',[
     {title:'Komunikatory',icon:'phone',short:'end-to-end',text:'WhatsApp i Signal szyfrują wiadomości na Twoim telefonie i odszyfrowują dopiero na telefonie odbiorcy. Serwer po drodze widzi tylko szyfrogram.'},
     {title:'Kłódka w przeglądarce',icon:'lock',short:'https://',text:'Połączenie ze stroną jest szyfrowane — nikt w tej samej sieci Wi-Fi nie podejrzy hasła, które wpisujesz. Kłódka nie oznacza jednak, że strona jest uczciwa.'},
     {title:'Hasła w serwisach',icon:'shield',short:'skrót, nie szyfr',text:'Porządne serwisy nie przechowują Twojego hasła, tylko jego „skrót” (hash), którego nie da się odwrócić jak szyfru. Dlatego przy resecie dostajesz link do ustawienia nowego hasła, a nie stare hasło.'},
     {title:'Enigma',icon:'trophy',short:'Polacy, 1932',text:'Niemiecka maszyna szyfrująca z czasów II wojny światowej. Jej szyfr pierwszy złamał Polak, Marian Rejewski, pod koniec 1932 roku — dzięki matematyce.'}
    ])
   ]},
  {id:'caesar',label:'Cezar',title:'Tarcza Cezara: klucz = przesunięcie',grouping:'solo',
   intro:'Nauczyciel pokaże jeden przykład na tarczy. Potem 3 zadania samodzielnie. Pełne punkty za pierwszą próbę — ale po błędzie dostajesz wskazówkę i możesz poprawić.',
   reading:{title:'Jak działa szyfr Cezara?',paragraphs:[
    'Każdą literę zastępujesz literą leżącą o k miejsc dalej w alfabecie. Liczba k to klucz. Przy kluczu 3: A → D, B → E, …, X → A, Y → B, Z → C — alfabet zawija się jak tarcza zegara. Deszyfrujesz, cofając się o k.',
    'Używamy 26 liter A–Z (tak samo zrobisz w Pythonie na lekcji 17). Polskie litery najpierw zamieniasz na łacińskie: ą → a, ć → c, ę → e, ł → l, ń → n, ó → o, ś → s, ź i ż → z. Spacje i znaki interpunkcyjne zostają bez zmian.'
   ],example:{question:'Przykład rozwiązany: zaszyfruj KOT kluczem 3.',answer:'Odliczasz 3 litery dalej. K: L, M, N → N. O: P, Q, R → R (uwaga: Q też się liczy!). T: U, V, W → W. Wynik: NRW. Sprawdź na tarczy: pod K stoi N.'}},
   ...note(8,'Nauczanie jawne: na projektorze ustaw klucz 3 i pokaż, że tarcza „obraca” wewnętrzny pierścień. Wpisz KOT → NRW i przełącz na Deszyfruj. Zwróć uwagę na zawijanie (X → A) i na polskie znaki. Potem uczniowie robią 3 zadania sami, ty krążysz. Kto skończy — niech zaszyfruje swoje imię i porówna z sąsiadem.','Co się stanie, jeśli ustawisz klucz 26?','Nic — tarcza obróci się o pełne koło i każda litera przejdzie w siebie, tak jak przy kluczu 0.','Liczenie z pominięciem Q, V, X (bo nie ma ich w polskim alfabecie) — w szyfrze używamy pełnego alfabetu łacińskiego 26 liter. Deszyfrowanie przez przesunięcie w tę samą stronę zamiast w przeciwną.','Zapytaj: jaki klucz odszyfruje wiadomość zaszyfrowaną kluczem 3, jeśli maszyna umie tylko szyfrować? (23, bo 3 + 23 = 26).'),
   activities:[{type:'cipherLab',id:'cipher-caesar',mode:'caesar',points:6,label:'Szyfr Cezara: 3 zadania'}]},
  {id:'gadery',label:'Harcerski',title:'GA-DE-RY-PO-LU-KI: jedna operacja w dwie strony',grouping:'solo',
   intro:'Szyfr harcerzy: litery w parach zamieniają się miejscami. Najpierw jedno słowo ręcznie (maszyna jest zablokowana), potem maszyna i pytanie: co tu jest dziwnego?',
   ...note(5,'Etap szybki: pierwsze słowo uczniowie odszyfrowują na kartce (PANKSIP → OGNISKO). Po odblokowaniu maszyny poproś, żeby wpisali szyfrogram do maszyny szyfrującej — i zapytaj, dlaczego wyszedł tekst jawny. Odpowiedź niech padnie od uczniów.','Dlaczego w GA-DE-RY-PO-LU-KI nie potrzeba osobnej instrukcji deszyfrowania?','Bo zamiana w parze działa jak przełącznik: G → A, a A → G. Wykonana dwa razy wraca do punktu wyjścia.','Zamienianie liter tylko w jedną stronę (G → A, ale A zostaje). Traktowanie liter spoza par jako błędu.','Zapytaj, czy szyfr Cezara z jakimś kluczem też jest „sam dla siebie odwrotnością” (tak: klucz 13, tzw. ROT13 — 13 + 13 = 26).',true),
   activities:[{type:'cipherLab',id:'cipher-gadery',mode:'gaderypoluki',points:6,label:'GA-DE-RY-PO-LU-KI: 3 zadania'}]},
  {id:'duel',label:'Pojedynek',title:'Pojedynek: szyfrant kontra łamacz',grouping:'pair',
   intro:'Osoba A szyfruje krótką wiadomość i dyktuje szyfrogram. Osoba B na swoim komputerze łamie go bez klucza — na czas. Potem zamiana ról. Bez pary? Wybierz „Gram sam” i złam zagadkę.',
   reading:{title:'Jak łamie się szyfr Cezara?',paragraphs:[
    'Atak siłowy (brute force): sprawdzasz po kolei wszystkie klucze, aż tekst będzie miał sens. W Cezarze jest ich tylko 25 — człowiek zrobi to w kilka minut, komputer w ułamek sekundy.',
    'Jeśli metoda jest znana i ma jeden, stały klucz (jak GA-DE-RY-PO-LU-KI), łamacz nie musi nawet szukać. Dlatego w kryptografii obowiązuje zasada Kerckhoffsa (1883): szyfr ma być bezpieczny, nawet gdy wróg zna metodę — tajny jest tylko klucz.'
   ]},
   ...note(9,'Ustal pary i role. Szyfrant ma 2 minuty na wiadomość (min. 12 liter, bez wulgaryzmów), potem dyktuje szyfrogram albo pokazuje ekran. Łamacz przepisuje i klika strzałki; stoper rusza sam. Po potwierdzeniu partnera zamiana ról. Zapisuj na tablicy ranking: liczba prób i czas. Na koniec zapytaj zwycięzców, jak szybko rozpoznali właściwy klucz.','Po czym łamacz poznaje, że trafił na właściwy klucz, skoro go nie zna?','Po tym, że tekst nagle ma sens — powstają polskie słowa. Przy złym kluczu wychodzi bełkot, np. same spółgłoski.','Łamacz przepisuje szyfrogram z błędem i żaden klucz nie daje sensu — niech porówna z ekranem partnera. Szyfrant wybiera klucz 0 albo 26 (symulator na to nie pozwala — klucz 1–25).','Dla szybkich par: szyfrant szyfruje tę samą wiadomość dwa razy (np. klucz 5, a potem 8). Czy to jest mocniejsze? (Nie — to zwykły Cezar z kluczem 13).'),
   activities:[{type:'cipherLab',id:'cipher-duel',mode:'duel',points:6,label:'Pojedynek szyfrant–łamacz'}]},
  {id:'crack',label:'Łamanie',title:'Łamanie bez klucza: analiza częstości',grouping:'solo',
   intro:'Tym razem litery nie są przesunięte, tylko pomieszane dowolnie. Kluczy jest więcej niż ziaren piasku na Ziemi — ale tekst po polsku ma swoje „odciski palców”. Na końcu wiadomości czeka hasło.',
   reading:{title:'Statystyka zdradza szyfr',paragraphs:[
    'W polskich tekstach najczęściej występują A, E, O, I i Z. Szyfr podstawieniowy zmienia wygląd liter, ale nie ich liczbę: jeśli A zamieniono na Q, to Q będzie w szyfrogramie tak samo częste, jak A w tekście jawnym.',
    'Łamacz porównuje dwa wykresy częstości, zgaduje kilka najczęstszych liter, a potem szuka krótkich słów (a, i, w, z) i znanych fragmentów. Każda trafna litera odsłania kolejne słowa — jak w krzyżówce.'
   ],example:{question:'W szyfrogramie najczęstsza jest litera Q (ok. 11%). Co zakładasz?',answer:'Że Q to A albo E — to najczęstsze litery po polsku. Przypisujesz Q → A i patrzysz, czy w tekście pojawiają się sensowne fragmenty. Jeśli nie — próbujesz E.'}},
   ...note(12,'Pokaż na projektorze oba wykresy i przypisz razem jedną literę (najczęstszą). Resztę uczniowie robią sami; wolno naradzać się z sąsiadem. Podpowiedzi są stopniowane: 4 darmowe wskazówki, potem odkrywanie liter za −1 pkt. Po 8 minutach powiedz, że wiadomość zaczyna się od CZESC (to wskazówka 3 — ściąga). Kto skończy, niech sprawdzi, co wspólnego ma klucz z klawiaturą.','Dlaczego analiza częstości nie zadziałałaby na szyfrogram z 10 liter?','Bo w krótkim tekście częstości są przypadkowe — statystyka działa dopiero na dłuższym tekście (setki liter).','Przypisywanie tej samej litery tekstu jawnego do dwóch liter szyfrogramu (symulator zaznacza konflikt). Trzymanie się ślepo kolejności z wykresu — w krótkim tekście E i O mogą zamienić się miejscami.','Zapytaj: jak zabezpieczyć się przed analizą częstości? (np. szyfry, w których ta sama litera za każdym razem zmienia zamiennik — tak działała Enigma).'),
   activities:[{type:'cipherLab',id:'cipher-crack',mode:'crack',points:8,label:'Analiza częstości: hasło końcowe'}]},
  {id:'result',label:'Wynik',title:'Czy taki szyfr ochroni Twoje hasło?',grouping:'class',
   intro:'Rozmowa w klasie: złamaliście dziś dwa szyfry. Odpowiedz na pytanie, uzasadnij na forum — potem Twoja karta wyniku.',
   ...note(7,'Nauczanie dialogowe: zadaj pytanie „Czy szyfr podstawieniowy nadaje się do ochrony haseł?” i poproś 2–3 osoby o uzasadnienie na podstawie tego, co same złamały. Dopytuj: „Ile trwało złamanie?”, „Co by pomogło łamaczowi jeszcze bardziej?”, „Kto się nie zgadza?”. Na koniec uczniowie odpowiadają w systemie i wypełniają samoocenę (metapoznanie).','Dlaczego bezpieczeństwo szyfru nie może zależeć od tego, że nikt nie zna metody?','Bo metody wyciekają, są opisane w książkach i internecie (jak GA-DE-RY-PO-LU-KI). Tajny musi być klucz, a kluczy musi być tak dużo, żeby nie dało się ich sprawdzić.','„Wymyślę własny szyfr, to nikt go nie złamie” — dzisiejsza lekcja pokazuje, że proste szyfry łamie się statystyką w minuty. Mylenie szyfrowania haseł z ich „skrótem” (hash).','Poproś o jedno zdanie do zeszytu: „Do prawdziwych danych używam…” (sprawdzonych narzędzi: menedżera haseł, komunikatora z szyfrowaniem end-to-end, stron z https).'),
   activities:[
    choice('l16-why','Dlaczego szyfr podstawieniowy nie nadaje się do ochrony haseł i danych?',['Bo każda litera ma zawsze ten sam zamiennik — statystyka liter zdradza tekst, a Cezara łamie się, sprawdzając 25 kluczy','Bo nie da się nim zapisać cyfr','Nadaje się — wystarczy, że nikt nie zna metody'],[0],'Tak. Stały zamiennik zostawia „odciski palców” języka. Nowoczesne szyfry (np. AES w komunikatorach) mają tak wiele kluczy, że nawet wszystkie komputery świata ich nie sprawdzą — i są bezpieczne, choć ich metoda jest publiczna (zasada Kerckhoffsa).','Przypomnij sobie, jak złamałeś szyfr w etapie 5. Co Ci pomogło?'),
    {type:'resultCard',id:'result-card',title:'Karta łamacza szyfrów',sources:['l16-r1','l16-r2','cipher-caesar','cipher-gadery','cipher-duel','cipher-crack','l16-why'],badges:[
     {min:0,name:'Szyfrant w stopniu młodzika',text:'Tarcza się kręci, klucz jeszcze się wymyka. Wróć do Cezara — trzy zadania i łapiesz rytm.'},
     {min:0.5,name:'Łamacz z ławki',text:'Cezara łamiesz szybciej niż kolega pisze wiadomość. Następnym razem statystyka też padnie.'},
     {min:0.85,name:'Następca Rejewskiego',text:'Częstość liter, ściąga, brute force — masz cały warsztat. Biuro Szyfrów by Cię przyjęło.'}
    ]}
   ]}
 ],
 exitTicket:'Szyfr podstawieniowy zamienia każdą literę zawsze tak samo — dlatego łamie się go w minuty: Cezara przez sprawdzenie 25 kluczy, dowolne podstawienie przez częstość liter. Do prawdziwych danych używasz sprawdzonych narzędzi, a nie własnych szyfrów. Na lekcji 17 napiszesz szyfrator Cezara w Pythonie.'
};
