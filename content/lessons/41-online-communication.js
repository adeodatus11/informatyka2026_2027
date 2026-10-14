import {note, choice} from '../schema.js';

export default {
 id:'41',grade:1,order:35,title:'Komunikacja i wymiana informacji w Internecie',
 subtitle:'Jeden e-mail może dać Ci praktyki albo trafić do kosza. Napiszesz taki, na który pracodawca odpisze, i ogarniesz kłótnię na grupie bez dramy.',
 topic:'Komunikacja w sieci: dobór kanału, profesjonalny e-mail, netykieta i asertywność',icon:'mail',tags:['E-mail o praktyki','Netykieta','Asertywnie'],duration:45,
 curriculum:'Podstawa programowa informatyki (liceum/technikum), zakres podstawowy: IV.2, IV.3, V.1 (komunikacja i współpraca w sieci, odpowiedzialne korzystanie z TIK)',
 format:{
  name:'Przykład rozwiązany → własna wersja → feedback i poprawa',
  student:'Najpierw rozbierasz na części fatalny e-mail ucznia do firmy. Potem piszesz własny e-mail o praktyki, a skrzynka sprawdza go przed wysłaniem: co poprawić i dlaczego. Na koniec gasisz kłótnię na grupie klasowej. Efekt: e-mail, który możesz wysłać naprawdę.',
  teacher:'Lekcja idzie od przykładu do samodzielnej pracy. Uczniowie najpierw szukają błędów w złym e-mailu, a po rozwiązaniu widzą poprawioną wersję z opisem części (przykład rozwiązany). Potem piszą własny e-mail w symulatorze skrzynki: przycisk „Sprawdź przed wysłaniem” daje konkretną uwagę do każdego z 7 kryteriów, a uczeń poprawia i sprawdza ponownie (feedback prowadzący do poprawy; pełne punkty za kryterium spełnione od razu, połowa po poprawce). Twoja rola: po pierwszym sprawdzeniu zebrać najczęstszy błąd klasy i pokazać jego poprawę na projektorze. Etap netykiety przekłada te same zasady na konflikt na grupie.',
  grouping:'Indywidualnie, każdy pisze własny e-mail. Opcjonalnie w parach po napisaniu: partner czyta e-mail na głos „jako pani Zielińska” i mówi, co by poczuł; potem zamiana. Uczeń bez pary czyta swój e-mail na głos sam sobie.',
  methods:[
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:[
  'Dobieram kanał do sprawy: komunikator, e-mail, forum albo wideorozmowę.',
  'Piszę profesjonalny e-mail do pracodawcy lub szkoły: temat, powitanie, treść, podpis, załącznik i ton.',
  'Zamieniam agresywną wiadomość w asertywną: bez obelg, z komunikatem „ja” i konkretną prośbą.',
  'Sprawdzam łańcuszki i „pilne” wiadomości u źródła, zanim przekażę je dalej.'
 ],
 materials:['Komputer z przeglądarką, każdy uczeń swój (pisanie e-maila na telefonie jest możliwe, ale wolniejsze)','Projektor do pokazania jednego poprawionego błędu klasy (opcjonalnie)'],
 teacherGuide:{
  preparation:'Nic nie drukujesz. Firma BitSerwis, adresy e-mail, osoby i czat klasowy są fikcyjne; nic nie jest wysyłane. Skrzynka sprawdza e-mail prostymi regułami (słowa kluczowe, struktura, emotki, wielkie litery), więc nie zastąpi Twojej oceny stylu. Jeśli uczeń ma poprawny e-mail, a reguła się myli (np. nietypowe powitanie), uznaj jego wersję i zgłoś przypadek do poprawy symulatora. Dezinformacji nie omawiamy od nowa: to temat lekcji „Internet jako ocean informacji” (SIFT) i kursu Demagoga; tu tylko jedno zadanie z odesłaniem.',
  summary:'Uczeń dobiera kanał (pracodawca i sprawy wymagające śladu na piśmie: e-mail; szybkie ustalenia: komunikator; problem techniczny, który ktoś już miał: forum; rozmowa z widzeniem się: wideorozmowa), stosuje UDW przy wielu odbiorcach, znajduje 6 błędów w złym e-mailu, pisze własny e-mail o praktyki spełniający 7 kryteriów (adresy, temat, powitanie, treść kto/co/kiedy, ton, podpis, CV w PDF) i przerabia agresywną wiadomość na asertywną (bez obelg i uogólnień, komunikat „ja”, prośba z terminem). Pytanie dodatkowe: dlaczego krytykujemy prywatnie, a chwalimy publicznie?'
 },
 sections:[
  {id:'start',label:'Start',title:'Siema, chcę praktyki',grouping:'class',
   intro:'Pani z działu kadr dostaje dziennie kilkadziesiąt e-maili. Twój ma 5 sekund, żeby nie wylądować w koszu. Najpierw szybka powtórka z poprzednich lekcji.',
   ...note(4,'Wyświetl na projektorze temat i pierwsze zdanie: „(brak tematu) — siema, szukam praktyk odpiszcie szybko”. Zapytaj: „Odpisalibyście?”. Potem dwa pytania powtórkowe bez notatek: PDF z bloku Worda i fałszywy link z lekcji o e-usługach.','Po czym pracodawca w 5 sekund ocenia e-mail od ucznia?','Po adresie nadawcy, temacie, powitaniu i tym, czy od razu wiadomo, kto pisze i w jakiej sprawie.','Uczniowie uważają, że forma nie ma znaczenia, „liczy się, co umiem”. Pokaż, że forma decyduje, czy ktoś w ogóle przeczyta, co umiesz.','Zapytaj, kto już szukał praktyk albo pracy wakacyjnej i jak się kontaktował z firmą.'),
   activities:[
    choice('l41-pdf','Powtórka z bloku Worda: wysyłasz CV do firmy. W jakiej postaci najlepiej je dołączyć?',['Jako PDF wyeksportowany z Worda (Plik → Eksportuj → PDF), z imieniem i nazwiskiem w nazwie pliku','Jako zdjęcie wydruku zrobione telefonem','Jako link do pliku na moim prywatnym dysku bez dostępu'],[0],'PDF wygląda u odbiorcy tak samo jak u Ciebie i nie da się go przypadkiem zmienić. Nazwa „CV_Jan_Kowalski.pdf” od razu mówi, czyje to.','W lekcji o poradniku oddawałeś końcowy plik w dwóch formatach. Który wygląda wszędzie tak samo?'),
    choice('l41-link','Powtórka z lekcji o e-usługach: e-mail „od szkoły” prosi o zalogowanie się przez link, bo „konto zostanie usunięte”. Co sprawdzasz najpierw?',['Czy w e-mailu jest logo szkoły','Adres nadawcy i domenę linku czytaną od końca do pierwszego „/”. W razie wątpliwości wchodzę na stronę, wpisując adres sam','Czy e-mail ma kłódkę'],[1],'Logo łatwo skopiować. Liczy się domena nadawcy i linku. Podejrzany e-mail zgłosisz na incydent.cert.pl; więcej o tym w lekcji o e-usługach.','Pomyśl, co oszust może łatwo podrobić, a czego nie.')
   ]},
  {id:'channels',label:'Kanały',title:'Co do czego?',grouping:'solo',
   intro:'Komunikator, e-mail, forum, wideorozmowa. Każde narzędzie ma swoją robotę. Źle dobrany kanał to połowa nieporozumień.',
   reading:{title:'Szybko, na piśmie czy twarzą w twarz?',paragraphs:['Komunikator jest do szybkich, krótkich ustaleń między osobami, które się znają. E-mail jest do spraw oficjalnych i takich, które mają zostać na piśmie: firma, szkoła, urząd. Do szkoły piszesz też przez wiadomości w e-dzienniku.','Forum (i grupy tematyczne) to miejsce, gdzie ktoś już miał Twój problem, a odpowiedzi zostają dla innych. Wideorozmowa jest wtedy, gdy trzeba się zobaczyć albo coś pokazać, np. rozmowa o praktykach zdalnie. Pisząc do wielu osób naraz, wpisz adresy w polu UDW (ukryte do wiadomości), żeby nie ujawniać ich wszystkim.']},
   ...note(5,'Uczniowie pracują sami. Po 3 minutach omów wiersz o forum (najrzadziej używane przez uczniów) i pytanie o UDW: pokaż to pole w dowolnym programie pocztowym na projektorze.','Kiedy lepiej zadzwonić albo porozmawiać na wideo niż pisać?','Gdy sprawa jest trudna albo emocjonalna, gdy wymiana wiadomości się przeciąga, gdy trzeba coś pokazać albo gdy rozmówca chce nas zobaczyć (rozmowa o pracę).','Uczniowie piszą do pracodawcy przez komunikator albo na prywatny profil w serwisie społecznościowym. Nie znają pola UDW i ujawniają adresy wszystkich odbiorców.','Szybsi: wymyśl sytuację, w której ten sam komunikat wysłany złym kanałem wywoła kłopot.'),
   activities:[
    {type:'matching',id:'channel-match',question:'Wybierz najlepszy kanał do sprawy.',options:['Komunikator','E-mail (lub wiadomość w e-dzienniku)','Forum lub grupa tematyczna','Wideorozmowa'],rows:[
     {label:'Wysyłasz CV do firmy z prośbą o praktyki.',correct:[1],explanation:'Sprawa oficjalna, z załącznikiem, ma zostać na piśmie.'},
     {label:'Umawiasz się z kolegą, że za 10 minut czekasz pod szkołą.',correct:[0],explanation:'Szybkie, krótkie ustalenie między znajomymi.'},
     {label:'Laptop po aktualizacji nie widzi Wi-Fi. Pewnie ktoś miał już ten problem.',correct:[2],explanation:'Na forum są odpowiedzi dla wielu osób z tym samym problemem, często sprzed lat.'},
     {label:'Firma proponuje rozmowę o praktykach, ale jest w innym mieście.',correct:[3],explanation:'Rozmowa, w której trzeba się zobaczyć i porozmawiać na żywo.'},
     {label:'Prosisz wychowawczynię o termin poprawy sprawdzianu.',correct:[1],explanation:'Sprawa szkolna, która powinna zostać na piśmie: e-mail lub e-dziennik.'},
     {label:'Grupa projektowa szybko ustala, kto robi które slajdy.',correct:[0],explanation:'Szybka koordynacja w małej grupie.'}
    ]},
    choice('bcc','Wysyłasz to samo zapytanie o praktyki do 20 firm naraz. Gdzie wpisujesz ich adresy?',['W polu „Do”, żeby każda firma widziała, że jest konkurencja','W polu „UDW” (ukryte do wiadomości), a najlepiej piszesz do każdej firmy osobno, z jej nazwą','W polu „DW”, bo to „do wiadomości”'],[1],'UDW ukrywa adresy przed innymi odbiorcami. Ale e-mail „do wszystkich” wygląda jak spam: osobna wiadomość z nazwą firmy i jej ofertą ma dużo większą szansę na odpowiedź.','Które pole ma w nazwie słowo „ukryte”?')
   ]},
  {id:'spot',label:'Rozbiór',title:'Rozbiór złego e-maila',grouping:'solo',
   intro:'Ten e-mail naprawdę mógłby trafić do firmy. Znajdź wszystko, co trzeba poprawić. Uwaga: kilka fragmentów jest w porządku. Po rozwiązaniu zobaczysz wersję poprawioną z opisem każdej części.',
   ...note(7,'Uczniowie pracują sami. Gdy większość rozwiąże zadanie, wyświetl wzór na projektorze i przeczytaj go na głos z nazwami części (powitanie, kim jestem, o co proszę, dlaczego ja, załącznik, podpis). To przykład rozwiązany, z którego zaraz skorzystają. Uczniowie, którzy zaznaczyli poprawne zdania jako błędy, czytają wyjaśnienie pod fragmentem.','Które zdanie z tego e-maila można zostawić bez zmian i dlaczego?','„Jestem uczniem 1 klasy technikum…” i „Znam podstawy Worda…”: mówią, kim jestem i co umiem.','Uczeń zaznacza wszystko jak leci. Zwracaj uwagę, że zła odpowiedź też ma wyjaśnienie i trzeba ją odznaczyć.','Szybsi: zapisz w zeszycie jedno zdanie „dlaczego ja”, które pasuje do Twojego kierunku.'),
   activities:[
    {type:'proMail',id:'mail-spot',mode:'spot',points:6,label:'Błędy w e-mailu o praktyki'}
   ]},
  {id:'compose',label:'Mój e-mail',title:'Twój e-mail o praktyki',grouping:'solo',
   intro:'Napisz e-mail do firmy z ogłoszenia. Możesz użyć wymyślonego imienia i nazwiska. Skrzynka sprawdzi 7 kryteriów i powie, co poprawić. Poprawiaj, aż „Wyślij” się odblokuje. Nic nie wychodzi z tego komputera.',
   reading:{title:'Szkielet, który działa',paragraphs:['Temat: kto i w jakiej sprawie („Zgłoszenie na praktyki zawodowe, Jan Kowalski, kl. 1”). Powitanie: „Dzień dobry” albo „Szanowna Pani”. Treść w trzech zdaniach: kim jestem, o co proszę i w jakim terminie, dlaczego ja.','Na końcu: wzmianka o załączniku („W załączniku przesyłam CV”), zwrot grzecznościowy („Z poważaniem”) i podpis z imieniem i nazwiskiem. Bez emotek, slangu i wielkich liter, bo w sieci oznaczają krzyk.']},
   ...note(13,'Uczniowie piszą samodzielnie. Po pierwszym sprawdzeniu u większości zatrzymaj klasę na 1 minutę: pokaż najczęstszy czerwony punkt (zwykle temat bez słowa „praktyki”, brak terminu albo brak podpisu pod zwrotem grzecznościowym) i jego poprawkę na projektorze. Potem uczniowie poprawiają swoje wersje. Uczniom z trudnością w pisaniu wskaż przycisk „wstaw szkielet” i wzór z poprzedniego etapu. Kto skończy, czyta e-mail partnerowi „jako pani Zielińska”.','Która uwaga skrzynki była dla Ciebie najbardziej zaskakująca?','Np. że „Witam” bywa odbierane jako poufałe, że trzeba wspomnieć o załączniku w treści, że temat musi mówić, kto pisze.','Przepisanie wzoru słowo w słowo bez zmiany szczegółów. Skrzynka tego nie wykryje, więc zapytaj: „Co w tym e-mailu jest o Tobie?”. Ignorowanie uwag i klikanie „Sprawdź” bez zmian.','Chętni: dopisz jedno zdanie, które pasuje do Twojego kierunku kształcenia (np. „Interesuję się sieciami komputerowymi”).'),
   activities:[
    {type:'proMail',id:'mail-compose',mode:'compose',points:7,label:'Mój e-mail o praktyki (7 kryteriów)'}
   ]},
  {id:'tone',label:'Netykieta',title:'Kłótnia na grupie klasowej',grouping:'solo',
   intro:'Jutro oddajecie prezentację, slajdów 5–8 nie ma, a Marek właśnie wybuchł na grupie. Zrób z tego rozmowę, która coś załatwi.',
   reading:{title:'Asertywnie, czyli jasno i z szacunkiem',paragraphs:['Netykieta to zasady kultury w sieci. Najważniejsza przy konflikcie: krytykuj prywatnie, chwal publicznie. Publiczne zbiorowe „jechanie” po kimś to prosta droga do cyberprzemocy, a zrzut ekranu zostaje na zawsze.','Wiadomość asertywna ma trzy części: fakt bez oceny („slajdów 5–8 jeszcze nie ma”), komunikat „ja” („martwię się, bo jutro oddajemy”) i konkretną prośbę z terminem („Czy możesz wysłać je dziś do 20:00?”). Bez „zawsze”, „znowu” i „jak zwykle”, bo to oskarżenia.']},
   ...note(8,'Uczniowie pracują sami. Gdy kilka osób rozwiąże zadanie, poproś jedną (za zgodą) o przeczytanie swojej wiadomości. Zapytaj klasę: „Co poczuje Bartek po tej wiadomości, a co po wiadomości Marka?”. Jeśli w klasie jest bieżący konflikt na grupie, nie odwołuj się do niego wprost.','Dlaczego „Bartek, znowu nic nie zrobiłeś” nie zadziała, nawet bez przekleństw?','„Znowu” to uogólnienie i oskarżenie. Bartek zacznie się bronić, a nie robić slajdy. Lepiej mówić o tej jednej sprawie i poprosić o konkret.','Uczniowie mylą asertywność z uległością („Nie szkodzi, zrobię za ciebie”) albo z „grzeczną” agresją. Szukają słów, które przejdą przez sprawdzanie, zamiast pisać do człowieka.','Szybsi: napisz krótką wiadomość na grupę, która uspokoi sytuację i nikogo nie wskaże palcem.'),
   activities:[
    {type:'proMail',id:'mail-tone',mode:'tone',points:5,label:'Z agresji w asertywność'}
   ]},
  {id:'forward',label:'Przekaż?',title:'Zanim przekażesz dalej',grouping:'solo',
   intro:'Na grupie klasowej krąży „pilna” wiadomość. Sprawdzanie informacji ćwiczyłeś w lekcji o oceanie informacji (SIFT) i w kursie Demagoga. Tu tylko jedna decyzja.',
   ...note(3,'Krótko: jedno pytanie i odesłanie do lekcji 07 (SIFT) oraz kursu Demagoga dla chętnych. Nie rozwijaj tematu dezinformacji, tylko przypomnij zasadę: źródło, nie liczba przekazań.','Jak sprawdzisz, czy jutro naprawdę nie ma lekcji?','W oficjalnym źródle: e-dziennik, strona szkoły, wychowawca. Nie u „kuzyna kolegi”.','Przekazywanie dalej „na wszelki wypadek”. Każde przekazanie dodaje wiadomości wiarygodności w oczach innych.','Chętni: przejdź jeden moduł kursu Demagoga „Uodpornij się na fake news” (lekcja-odsyłacz w serwisie).',true),
   activities:[
    choice('chain','Na grupie: „PILNE!!! Jutro nie ma lekcji, dyrekcja ogłosiła, PRZEKAŻ DALEJ, zanim usuną!”. Co robisz?',['Przekazuję na wszystkie grupy, lepiej, żeby wszyscy wiedzieli','Sprawdzam w e-dzienniku lub na stronie szkoły i dopiero wtedy odpisuję; nie przekazuję niesprawdzonej wiadomości','Odpisuję „xD” i idę spać'],[1],'Wielkie litery, „pilne” i „przekaż, zanim usuną” to typowe cechy łańcuszka. Sprawdzasz u źródła (S i I z metody SIFT), a nie u autora wiadomości.','Gdzie szkoła naprawdę ogłasza odwołane lekcje?')
   ]},
  {id:'result',label:'Wynik',title:'Twoja karta komunikacji',grouping:'solo',
   intro:'Punkty z powtórki, kanałów, rozbioru e-maila, Twojego e-maila i netykiety. Twój e-mail możesz przepisać i naprawdę wysłać do firmy, gdy będziesz szukać praktyk.',
   ...note(5,'Uczniowie uzupełniają samoocenę i pokazują kartę. Zwróć uwagę na podsumowanie „E-mail o praktyki: 7/7 kryteriów”. Przypomnij, że prawdziwy e-mail uczeń wysyła sam, ze swojej skrzynki, kiedy będzie szukał praktyk. Zakończ pytaniem wyjściowym.','Co jedno zmienisz od jutra w tym, jak piszesz do nauczycieli lub firm?','Temat wiadomości, „Dzień dobry” zamiast „siema”, podpis z imieniem i nazwiskiem, CV w PDF.','Uczniowie myślą, że zasady dotyczą tylko pracodawców. Te same zasady działają w e-dzienniku i przy reklamacji w sklepie.','Chętni: przygotuj własne CV w Wordzie (blok Worda) i wyeksportuj je do PDF.'),
   activities:[
    {type:'resultCard',id:'result-card',title:'Karta komunikacji',sources:['l41-pdf','l41-link','channel-match','bcc','mail-spot','mail-compose','mail-tone','chain'],
     badges:[
      {min:0,name:'Siema, odpiszcie',text:'Na razie pani z kadr kliknęłaby „usuń”. Wróć do uwag skrzynki: każda poprawka to większa szansa na praktyki.'},
      {min:0.5,name:'Kulturalny korespondent',text:'Temat, powitanie i podpis są na miejscu. Jeszcze kilka szlifów i Twój e-mail wyląduje na górze listy.'},
      {min:0.85,name:'Dyplomata z grupy klasowej',text:'Piszesz tak, że firmy odpisują, a kłótnie gasną. Rzadka umiejętność, także wśród dorosłych.'}
     ]}
   ]}
 ],
 exitTicket:'Pracodawca i szkoła: e-mail z tematem, „Dzień dobry”, kto/co/kiedy, CV w PDF, „Z poważaniem” i imię z nazwiskiem. Konflikt: prywatnie, fakt bez oceny, komunikat „ja”, prośba z terminem. Pilne łańcuszki: najpierw źródło, potem ewentualnie przekaż.'
};
