import {note, choice} from '../schema.js';

export default {
 id:'07',grade:1,title:'Internet jako ocean informacji',
 subtitle:'Nie dasz się nabrać — ani na fake newsa, ani na oszustwo, które kosztuje pieniądze albo konto.',
 topic:'Internet jako ocean informacji',icon:'globe',tags:['SIFT','Fake?','Bańka'],duration:35,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): wyszukiwanie i ocena informacji w sieci, bezpieczeństwo w internecie',
 format:{
  name:'Śledztwo na przypadkach + nauczanie dialogowe',
  student:'Dziś jesteś detektywem. W parze albo trójce rozgryziesz 6 przypadków — od viralowego fake newsa po SMS z „dopłatą 1,99 zł”. Efekt: karta detektywa z punktami i Twoja własna zasada, która ochroni Twoje pieniądze i konto.',
  teacher:'Lekcja zaczyna się od gry w szacowanie skali internetu i krótkiej powtórki. Potem uczniowie samodzielnie porządkują warstwy internetu i sprawdzają na sobie bańkę filtrującą. Główna część to śledztwo w parach: symulator prowadzi przez kroki SIFT, a werdykt wymaga dowodu. Na koniec prowadzisz rozmowę dialogową o przypadku, który najbardziej podzielił klasę — uczniowie uzasadniają, a Ty dopytujesz „skąd to wiesz?” zamiast podawać odpowiedź.',
  grouping:'Etapy 1, 4 i 5 — cała klasa lub samodzielnie. Śledztwo (etap 3) w parach; przy nieparzystej liczbie jedna trójka. Uczeń bez pary pracuje sam: symulator podpowiada mu obie role (adwokat i prokurator).',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Nauczanie dialogowe',url:'https://metodyka.covepolska.pl/metoda-nauczanie-dialogowe.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:[
  'Szacuję skalę internetu i rozumiem, dlaczego widzę tylko mały wycinek treści.',
  'Odróżniam powierzchnię internetu, głęboki internet i dark web oraz wyjaśniam, czym jest bańka filtrująca.',
  'Sprawdzam informację metodą SIFT i czytaniem lateralnym, zanim ją udostępnię.',
  'Rozpoznaję oszustwa (SMS z dopłatą, fałszywy sklep, reklama z deepfake’iem, praca z opłatą) i wiem, gdzie je zgłosić.'
 ],
 materials:['Komputer lub telefon z przeglądarką — w śledztwie wystarczy jedno urządzenie na parę','Projektor do wspólnego rozwiązania pierwszej statystyki (opcjonalnie)'],
 teacherGuide:{
  preparation:'Nic nie drukujesz. Wyświetl etap 1 na projektorze: pierwszą statystykę rozwiążcie razem (głosowanie palcami 1–4), resztę uczniowie robią sami. Zaplanuj pary przed etapem 3. Wszystkie posty, sklepy, numery i domeny w symulatorach są fikcyjne; realne instytucje (CERT Polska, numer 8080, NASK) pojawiają się tylko jako fakty.',
  summary:'Uczeń zatrzymuje się przed udostępnieniem, sprawdza źródło w nowej karcie, porównuje z niezależnymi źródłami i szuka oryginału (SIFT). Rozpoznaje cztery typy oszustw: dopłata SMS, fałszywy sklep, deepfake „inwestycyjny”, praca z opłatą wstępną. Wie, że SMS przekazuje się na 8080, a stronę zgłasza na incydent.cert.pl. Pytanie dodatkowe: dlaczego „zbyt dobre, żeby było prawdziwe” to powód do sprawdzenia, a nie dowód fałszu?'
 },
 sections:[
  {id:'start',label:'Start',title:'Ile internetu powstaje w minutę?',grouping:'class',
   intro:'Twój feed to kropla w oceanie. Zgadnij, jak wielki jest ten ocean — i zastanów się, kto wybiera, którą kroplę widzisz.',
   ...note(5,'Pierwszą statystykę (e-maile) rozwiążcie wspólnie: uczniowie pokazują palcami 1–4, potem odsłaniasz. Resztę robią sami na urządzeniach. Podkreśl, że wszystkie liczby to szacunki z podanym źródłem — przy wyszukiwaniach źródła się różnią. Na koniec szybka powtórka z lekcji o smartfonie.','Skoro w minutę powstają miliony treści, to kto decyduje, co zobaczysz na swoim telefonie?','Algorytm aplikacji — na podstawie tego, co lubisz, oglądasz i pomijasz. Nie widzimy „internetu”, tylko jego wybrany kawałek.','Uczniowie traktują liczby jak pewniki. Przypominaj: „szacunek, źródło, rok”. Mylą też milion z miliardem — pokaż, że to 1000 razy więcej.','Poproś, by uczniowie sprawdzili w ustawieniach telefonu swój czas ekranowy z wczoraj i przeliczyli, ile to „filmów z minuty”.'),
   activities:[
    {type:'internetOcean',id:'ocean-minute',mode:'minute',points:5,label:'Gra: ile internetu w minutę'},
    choice('l07-perm','Powtórka z lekcji o smartfonie: aplikacja „Latarka” prosi o dostęp do kontaktów i lokalizacji. Co robisz?',['Zgadzam się — inaczej nie zadziała','Odmawiam: latarka nie potrzebuje kontaktów ani GPS; jeśli nie działa bez nich — odinstalowuję','Zgadzam się, ale tylko raz'],[1],'Uprawnienia mają pasować do funkcji. Latarka potrzebuje diody, nie Twoich kontaktów. Zbyt szerokie uprawnienia to często sposób na zbieranie danych — o tym dziś dalej.','Pomyśl: do czego latarce Twoja lista kontaktów?')
   ]},
  {id:'zones',label:'Warstwy',title:'Powierzchnia, głębia i bańka',grouping:'solo',
   intro:'Internet ma warstwy — a na powierzchni każdy pływa w swojej bańce. Przyporządkuj przykłady, a potem sprawdź, jak algorytm buduje Twoją bańkę.',
   reading:{title:'Trzy warstwy internetu',paragraphs:['Powierzchnia to strony, które pokazuje wyszukiwarka: portale, sklepy, publiczne filmy. Głęboki internet (deep web) to wszystko za logowaniem: e-dziennik, poczta, bank, konto pacjenta. To nic groźnego — po prostu prywatne dane, których wyszukiwarka nie widzi.','Dark web to strony dostępne tylko przez specjalne oprogramowanie. Pełno tam nielegalnych treści i oszustw, a zero ochrony kupującego. Na powierzchni czeka inna pułapka: bańka filtrująca (Eli Pariser, 2011). Algorytm podsuwa Ci to, co już lubisz — aż zaczynasz myśleć, że „wszyscy tak myślą”.'],example:{question:'Czy Twoje oceny z e-dziennika są w „ciemnej sieci”?',answer:'Nie. Są w głębokim internecie — za logowaniem. Deep web to nie dark web.'}},
   ...note(7,'Daj 2 minuty na przeczytanie i dopasowanie, potem uczniowie przewijają 10 postów w symulatorze. Poproś, żeby reagowali szczerze. Po wykresie zapytaj 2–3 osoby, co dominuje w ich feedzie i czy to samo widzi ich kolega z ławki.','Czy Twój feed pokazuje, co się dzieje na świecie, czy to, co lubisz?','To, co lubię i na co patrzę najdłużej. Algorytm zarabia na moim czasie, więc pokazuje to, co mnie zatrzyma — niekoniecznie to, co ważne i prawdziwe.','Uczniowie mylą deep web z dark webem („e-dziennik to dark web”). Myślą też, że bańka dotyczy tylko polityki — dotyczy też gier, mody i zakupów.','Poproś uczniów o porównanie strony „Dla Ciebie” w jednej aplikacji na dwóch telefonach w ławce.',true),
   activities:[
    {type:'matching',id:'zones-match',question:'Gdzie to znajdziesz? Dopasuj warstwę internetu.',options:['Powierzchnia — pokaże to wyszukiwarka','Głęboki internet — za logowaniem','Dark web — tylko przez specjalne oprogramowanie'],rows:[
     {label:'Artykuł na portalu z wiadomościami',correct:[0],explanation:'Publiczna strona — wyszukiwarka ją widzi.'},
     {label:'Twoje oceny w e-dzienniku',correct:[1],explanation:'Są za logowaniem — to głęboki internet, nie dark web.'},
     {label:'Twoja skrzynka e-mail',correct:[1],explanation:'Prywatne dane za hasłem — głęboki internet.'},
     {label:'Publiczny film na platformie wideo',correct:[0],explanation:'Każdy może go znaleźć w wyszukiwarce.'},
     {label:'„Sklep” z kradzionymi kontami do gier, działający tylko przez specjalną przeglądarkę',correct:[2],explanation:'Dark web: nielegalne treści, oszustwa i brak jakiejkolwiek ochrony kupującego.'}
    ]},
    {type:'internetOcean',id:'ocean-bubble',mode:'bubble',points:1,label:'Symulacja: Twoja bańka'},
    choice('bubble-why','Co zrobił algorytm w symulacji?',['Pokazał wszystkim te same, najważniejsze posty','Podsunął więcej tego, co polubiłeś, i schował resztę — każdy ma inny feed','Wylosował posty przypadkowo'],[1],'Tak działa bańka filtrująca: im więcej lajkujesz jednego tematu, tym mniej widzisz innych. Dwie osoby z tej samej klasy mogą żyć w zupełnie innych „internetach”.','Porównaj dwa wykresy: Twój i osoby, która polubiła co innego.')
   ]},
  {id:'case',label:'Śledztwo',title:'Śledztwo: sprawdź, zanim udostępnisz',grouping:'group',
   intro:'6 przypadków, 4 narzędzia detektywa, 3 możliwe werdykty. Każdy werdykt musisz podeprzeć dowodem. Uwaga: nie wszystko, co brzmi dziwnie, jest fałszem.',
   reading:{title:'SIFT — cztery ruchy detektywa',paragraphs:['S — Stop: zatrzymaj się, zanim klikniesz. I — Investigate: sprawdź źródło, kto to napisał (wystarczy 60 sekund). F — Find: poszukaj, co piszą inni. T — Trace: prześledź cytat, zdjęcie lub liczbę do oryginału. Metodę opracował badacz Mike Caulfield.','Czytanie lateralne to otwieranie nowych kart i sprawdzanie źródła gdzie indziej, zamiast wierzyć stronie „od środka”. Tak pracują zawodowi fact-checkerzy, np. Demagog, Konkret24 czy FakeHunter.'],example:{question:'Oszustwo czy fałsz — jaka różnica?',answer:'Fałsz lub manipulacja przekręca fakty. Oszustwo chce czegoś od Ciebie: pieniędzy, danych karty, loginu. Pytaj zawsze: „czego ta wiadomość ode mnie chce?”.'}},
   ...note(13,'Pary pracują na jednym urządzeniu. Chodź po klasie i pytaj „skąd to wiecie?”, a nie „jaka jest odpowiedź?”. Zanotuj, który przypadek najbardziej podzielił klasę (zwykle przypadek 6 — prawdziwy, albo 1 — manipulacja). Kto skończy wcześniej, niech wróci do przypadków z połową punktów i spróbuje zrozumieć błąd.','Po czym poznajesz, że ktoś chce od Ciebie pieniędzy lub danych, nawet jeśli wiadomość wygląda profesjonalnie?','Presja czasu, obca lub świeża domena, prośba o dane karty/login, opłata z góry, obietnica nierealnego zysku, konto nadawcy inne niż osoba z reklamy.','Uczniowie oceniają po wyglądzie („ładna strona”, „dużo polubień”, „brak błędów”) albo uznają wszystko zaskakujące za fałsz. Kłódka w przeglądarce nie oznacza uczciwej strony.','Poproś pary o znalezienie jednego prawdziwego ostrzeżenia CERT Polska lub artykułu fact-checkingowego i porównanie go z przypadkiem z symulatora.'),
   activities:[
    {type:'factCheck',id:'fact-check',pairMode:true,points:12,label:'Śledztwo SIFT: 6 przypadków'}
   ]},
  {id:'talk',label:'Werdykt',title:'Werdykt klasy',grouping:'class',
   intro:'Który przypadek najbardziej Was podzielił? Pary uzasadniają werdykt dowodem — nie przeczuciem. Potem utrwal kroki SIFT i zapisz swoją zasadę.',
   ...note(6,'Wybierz przypadek, który najbardziej podzielił klasę. Poproś dwie pary o różnych werdyktach, by uzasadniły je dowodem (po 30 s). Dopytuj: „Skąd to wiesz?”, „Co by zmieniło Twoje zdanie?”, „Kto się zgadza i dlaczego?”. Nie rozstrzygaj od razu — niech klasa dojdzie do wniosku. Potem uczniowie sami układają SIFT i odpowiadają na pytanie o SMS.','Co by musiało się stać, żebyś zmienił zdanie o tym przypadku?','Nowy, niezależny dowód: oficjalne źródło, oryginał zdjęcia, informacja z innego serwisu. Nie: liczba polubień ani to, że „wszyscy tak piszą”.','Dyskusja zamienia się w „mnie się wydaje”. Wracaj do dowodów z narzędzi SIFT. Uczniowie myślą, że odpisanie na SMS-a oszusta coś załatwi — to tylko potwierdza, że numer jest aktywny.','Zapiszcie na tablicy klasowy „kodeks detektywa” z najlepszych zasad uczniów.'),
   activities:[
    {type:'factCheck',id:'sift-order',mode:'sift',points:1,label:'Kolejność kroków SIFT',question:'Ułóż kroki SIFT we właściwej kolejności.'},
    choice('sms-first','Dostajesz SMS: „Dopłać 1,99 zł do przesyłki” z linkiem. Co robisz najpierw?',['Klikam — to tylko 1,99 zł','Nie klikam. Status paczki sprawdzam w aplikacji lub na stronie przewoźnika wpisanej ręcznie, a SMS przekazuję na 8080','Odpisuję, że nic nie zamawiałem'],[1],'Tak. 8080 to bezpłatny numer CERT Polska do zgłaszania podejrzanych SMS-ów. Link z SMS-a nigdy nie jest drogą do sprawdzenia paczki.','Czy link z nieznanego SMS-a to bezpieczna droga do sprawdzenia paczki?'),
    {type:'text',id:'my-rule',question:'Moja zasada na przyszłość (1 zdanie):',placeholder:'Np. Zanim udostępnię, sprawdzam w nowej karcie, kto to napisał.',minLength:15,explanation:'Dobra zasada jest konkretna i wykonalna w 60 sekund, np. „Nie klikam linków z SMS-ów o dopłatach — przekazuję je na 8080” albo „Zanim udostępnię, sprawdzam, czy piszą o tym niezależne źródła”. Porównaj ze swoją.'}
   ]},
  {id:'result',label:'Wynik',title:'Twoja karta detektywa',grouping:'solo',
   intro:'Tu widzisz punkty ze wszystkich zadań. Zrób zdjęcie karty albo pokaż ją nauczycielowi.',
   ...note(4,'Poproś uczniów o uzupełnienie samooceny i pokazanie karty. Zwróć uwagę na podsumowanie „Rozpoznane oszustwa: X/4” — to najważniejszy wskaźnik lekcji. Zakończ pytaniem wyjściowym.','Które oszustwo z dzisiejszych przypadków najłatwiej przegapić i dlaczego?','Najczęściej SMS z dopłatą (mała kwota usypia czujność) albo deepfake (twarz znanej osoby budzi zaufanie).','Uczniowie oceniają się tylko po punktach. Pokaż, że liczy się też zasada, którą zapisali, i to, czy rozumieją, gdzie zgłaszać oszustwa.','Poproś 2–3 chętne osoby o 30-sekundowe „ostrzeżenie dla klasy” o jednym typie oszustwa: po czym je poznać i gdzie zgłosić.'),
   activities:[
    {type:'resultCard',id:'result-card',title:'Karta detektywa',sources:['ocean-minute','l07-perm','zones-match','ocean-bubble','bubble-why','fact-check','sift-order','sms-first'],
     badges:[
      {min:0,name:'Turysta na plaży',text:'Moczysz stopy przy brzegu. Wróć do przypadków z połową punktów — każdy następny SMS będzie łatwiejszy do rozszyfrowania.'},
      {min:0.5,name:'Nurek z latarką',text:'Widzisz więcej niż większość scrollujących. Jeszcze kilka dowodów i nikt Cię nie nabierze.'},
      {min:0.8,name:'Detektyw głębin',text:'Stop, źródło, inni, oryginał — masz to w małym palcu. Oszuści mogą się pakować.'}
     ]}
   ]}
 ],
 exitTicket:'Twoja zasada detektywa: STOP → kto to? → co piszą inni? → oryginał. SMS z podejrzanym linkiem przekazujesz na 8080 (bezpłatnie), podejrzaną stronę zgłaszasz na incydent.cert.pl.'
};
