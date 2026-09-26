import {note, choice, reveal} from '../schema.js';

export default {
 id:'14',grade:3,title:'Urządzenia cyfrowe w szkole',
 subtitle:'Na praktykach i w pierwszej pracy to Ty będziesz „tym od komputerów”. Poćwicz na sieci szkoły i prawdziwych zgłoszeniach.',
 topic:'Urządzenia cyfrowe w szkole',icon:'board',tags:['Sieć szkoły','Helpdesk','OSE'],duration:40,
 curriculum:'2024 Informatyka – liceum/technikum · urządzenia cyfrowe i sieci komputerowe w otoczeniu ucznia, bezpieczna praca w sieci',
 format:{
  name:'Symulacja helpdesku w parach',
  student:'Poznasz sieć szkoły na mapie i sprawdzisz, co pada przy awarii. Potem w parze obsłużycie 6 zgłoszeń: jedna osoba zgłasza, druga diagnozuje. Efekt: zamknięte zgłoszenia i punkty na karcie wyniku.',
  teacher:'Lekcja opiera się na przypadkach (problem, projekt, przypadek). Najpierw krótki hak i powtórka o adresie MAC. Uczniowie samodzielnie poznają mapę sieci szkoły i analizują 4 awarie. Główna część to helpdesk w parach z tutoringiem rówieśniczym: zgłaszający ma kartę z pełnym opisem sytuacji, technik zadaje pytania i proponuje rozwiązanie; po 3 zgłoszeniach zamiana ról, a na koniec każdy domyka u siebie zgłoszenia, w których był zgłaszającym. Na koniec nauczanie dialogowe: rozmowa o zasadach (czy technik może obejść filtr, gdy prosi nauczyciel?).',
  grouping:'Pary na dwóch urządzeniach (może być telefon + komputer). Przy nieparzystej liczbie osób — jedna trójka (dwóch techników, jeden zgłaszający) albo praca samodzielna w trybie „Sam(a)”: odpowiedzi odsłaniają się automatycznie.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Tutoring rówieśniczy',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'},
   {name:'Nauczanie dialogowe',url:'https://metodyka.covepolska.pl/metoda-nauczanie-dialogowe.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Opisuję rolę routera, przełącznika, punktu dostępowego, zapory i serwera NAS w sieci szkoły.','Przewiduję, które urządzenia stracą sieć przy awarii konkretnego elementu.','Diagnozuję typowe usterki szkolnego sprzętu: zadaję trafne pytania i wybieram rozwiązanie.','Stosuję zasady bezpieczeństwa: nie obchodzę filtra, zgłaszam incydenty, rozmawiam rzeczowo i uprzejmie.'],
 materials:['Dwa urządzenia na parę z przeglądarką (komputer, telefon lub tablet)','Opcjonalnie: projektor lub monitor interaktywny w sali do pokazania źródła wejścia i skrótu Win+P'],
 teacherGuide:{
  preparation:'Sprawdź, jak w Twojej szkole wygląda zgłaszanie usterek (zeszyt, e-mail, formularz) i kto jest administratorem — przyda się w rozmowie o zasadach. Klucz awarii: AP 2. p. → laptop w sali 21 i tablety; przełącznik pracowni → komputery i monitor; przełącznik główny → działają tylko drukarka 3D i e-dziennik w chmurze; router → wydruk idzie przez przełącznik pracowni, przełącznik główny i drukarkę. Poprawne diagnozy: 101 B, 102 D, 103 B, 104 C, 105 D, 106 B.',
  summary:'Uczeń wyjaśnia, dlaczego przy awarii routera drukowanie w sieci lokalnej nadal działa, a internet nie. Zadaje pytania o objawy i połączenia, zanim coś zmieni. Wie, że filtra OSE się nie obchodzi, tylko zgłasza stronę do odblokowania, a podejrzany pendrive oznacza: odłączyć od sieci i zgłosić. Maks. 26 pkt na karcie wyniku.'
 },
 sections:[
  {id:'start',label:'Start',title:'Ile urządzeń jest w tej sali?',grouping:'class',
   intro:'Zgadnij, zanim policzycie. Potem szybka powtórka z lekcji o systemie szesnastkowym — bez notatek.',
   ...note(4,'Najpierw zgadywanie (15 s), potem wspólne liczenie na głos: telefony, słuchawki, zegarki, komputery, projektor, punkt dostępowy, kamera. Zwykle wychodzi dużo więcej, niż myślą. Powiedz: „Ktoś to wszystko podłącza, zabezpiecza i naprawia. Na praktykach — często uczeń technikum”. Potem pytanie powtórkowe o MAC.','Kto w szkole odpowiada za to, żeby te urządzenia działały, i do kogo zgłaszacie usterkę?','Administrator lub informatyk szkolny; zgłoszenie przez nauczyciela, sekretariat lub formularz (zależnie od szkoły).','Uczniowie liczą tylko komputery i projektor, pomijają telefony, słuchawki bezprzewodowe i punkt dostępowy Wi-Fi.','Zapytaj, ile z tych urządzeń ma adres MAC (wszystkie z Wi-Fi, Bluetooth lub gniazdem sieciowym).'),
   activities:[
    choice('dev-count','Ile urządzeń cyfrowych jest teraz w tej sali? Zgadnij, zanim policzycie.',['Mniej niż 10','10–20','Ponad 20'],[2],'Zwykle dużo więcej, niż się wydaje: telefony, smartwatche, słuchawki bezprzewodowe, komputery, projektor lub monitor, punkt dostępowy Wi-Fi, czasem kamera i drukarka. Każde z nich ktoś musi podłączyć, zabezpieczyć i naprawić.','Policz też telefony w kieszeniach, słuchawki i zegarki.'),
    choice('dev-mac','Adres MAC 00:1A:2B:3C:4D:5E — ile ma bajtów i która część wskazuje producenta?',['6 bajtów; pierwsze 3 (00:1A:2B) to producent (OUI)','12 bajtów; ostatnie 2 to producent','4 bajty, jak adres IPv4; producenta nie da się ustalić','6 bajtów; ostatnie 3 (3C:4D:5E) to producent'],[0],'6 par cyfr hex = 6 bajtów = 48 bitów. Pierwsze 3 bajty to OUI producenta, ostatnie 3 — numer konkretnej karty.','Pamiętasz intruza PC-12 z serwerowni? Porównywałeś początek adresu.')
   ]},
  {id:'map',label:'Mapa',title:'Mapa szkolnej sieci',grouping:'solo',
   intro:'Tak (w uproszczeniu) wygląda sieć typowej szkoły. Najpierw poznaj elementy, potem rozwiąż 4 awarie. Zasada: awaria dotyka tego, co jest „pod” zepsutym elementem.',
   reading:{title:'Kto jest kim w sieci szkoły?',paragraphs:[
    'Internet przychodzi do szkoły z OSE — Ogólnopolskiej Sieci Edukacyjnej prowadzonej przez NASK. To bezpłatne, symetryczne łącze (min. 100 Mb/s) z filtrem treści i ochroną przed atakami. Router z zaporą łączy sieć szkoły z internetem, a przełączniki (switche) rozprowadzają sieć kablami do sal. Punkty dostępowe nadają Wi-Fi — osobno dla uczniów i dla gości.',
    'Nie wszystko jest „w szkole”: e-dziennik działa w chmurze dostawcy, więc otworzysz go też z telefonu przez LTE. A nie wszystko jest w sieci: drukarka 3D z programu „Laboratoria Przyszłości” zwykle dostaje model z karty SD lub przez USB.'
   ]},
   ...note(8,'Daj 2 minuty na klikanie elementów mapy, potem uczniowie rozwiązują 4 awarie i dopasowanie. Zwróć uwagę na awarię 3 (odwrotne pytanie) i 4 (droga wydruku). Po 6 minutach zapytaj klasę o awarię routera.','Padł router. Czy nauczyciel wydrukuje test z pracowni na drukarce w pokoju nauczycielskim? Dlaczego?','Tak. Wydruk idzie w sieci lokalnej: komputer → przełącznik pracowni → przełącznik główny → drukarka. Router jest potrzebny tylko do ruchu do internetu.','„Nie ma internetu, więc nic nie działa” — mylenie sieci lokalnej z internetem. Zaznaczanie zepsutego elementu jako „tracącego sieć”.','Zapytaj, dlaczego sieć gości jest oddzielona od sieci uczniów i nauczycieli (goście nie widzą drukarek, NAS ani komputerów szkoły).'),
   activities:[
    {type:'schoolNetwork',id:'net-map',mode:'map',points:4,label:'Mapa sieci: 4 awarie'},
    {type:'matching',id:'net-match',question:'Dopasuj element sieci do jego zadania.',options:['Łączy sieć szkoły z internetem i kieruje ruch między sieciami','Łączy kablami urządzenia w jednej sieci lokalnej','Nadaje Wi-Fi i wpuszcza urządzenia bezprzewodowe do sieci','Blokuje niebezpieczne i niedozwolone strony, chroni przed atakami','Przechowuje kopie zapasowe i wspólne foldery'],rows:[
     {label:'Przełącznik (switch)',correct:[1],explanation:'Przełącznik łączy urządzenia kablami i przesyła dane do właściwego adresata w sieci lokalnej.'},
     {label:'Router',correct:[0],explanation:'Router łączy sieć szkoły z internetem. Bez niego sieć lokalna działa, ale internet — nie.'},
     {label:'Serwer NAS',correct:[4],explanation:'NAS to dysk sieciowy: kopie zapasowe, wspólne foldery, nagrania z kamer.'},
     {label:'Punkt dostępowy (AP)',correct:[2],explanation:'Punkt dostępowy nadaje Wi-Fi. Jedna awaria = brak Wi-Fi w jego zasięgu.'},
     {label:'Zapora i filtr OSE',correct:[3],explanation:'Zapora i filtr treści chronią szkołę przed atakami i niebezpiecznymi stronami.'}
    ]}
   ]},
  {id:'helpdesk',label:'Helpdesk',title:'Helpdesk: 6 zgłoszeń',grouping:'pair',
   intro:'Jedna osoba zgłasza, druga diagnozuje. Technik zadaje maks. 3 pytania, wybiera rozwiązanie i mówi zgłaszającemu, co się stało. Po 3 zgłoszeniach zamiana ról. Punkty: rozwiązanie za 1. razem 2 pkt (po poprawce 1), trafne pytania 1 pkt.',
   reading:{title:'Jak pracuje dobry technik?',paragraphs:[
    'Najpierw pytania, potem działanie. Pytaj o objawy („co dokładnie widać?”), połączenia („do którego gniazda?”) i zakres („czy innym też nie działa?”). Pytanie o kolor pendrive’a nic nie wnosi — a zabiera czas, którego przy „lekcji za 5 minut” nie masz.',
    'Rozwiązanie ma być najprostsze skuteczne i bezpieczne: wybór źródła HDMI zamiast reinstalacji sterowników, zgłoszenie strony do odblokowania zamiast VPN-a. A na koniec krótko i po ludzku: co było, co zrobiłeś, co zrobić następnym razem.'
   ]},
   ...note(17,'Ustaw pary. Każdy wybiera w symulatorze „W parze”; jedna osoba „Technikiem”, druga „Zgłaszającym” — to samo zgłoszenie na obu urządzeniach. Zgłaszający czyta tylko to, o co technik zapyta. Po 3 zgłoszeniach zamiana ról. Na koniec każdy domyka u siebie zgłoszenia, w których był zgłaszającym (idzie szybko — zna sytuację). Krąż i słuchaj pytań technika, nie podpowiadaj rozwiązań.','Które pytanie najszybciej doprowadziło Was do rozwiązania i dlaczego?','Pytania o to, co dokładnie widać na ekranie, o połączenie (gniazdo, sieć) i czy problem dotyczy też innych — zawężają przyczynę.','Technicy od razu wybierają rozwiązanie „radykalne” (reinstalacja, restart routera). Zgłaszający podpowiadają technikowi. Odpowiedzi w żargonie lub z wyższością.','Poproś pary o wymyślenie siódmego zgłoszenia z własnej szkoły (np. „tablica nie reaguje na dotyk”) i odegranie go przed klasą.'),
   activities:[{type:'helpdesk',id:'hd-tickets',mode:'tickets',points:18,label:'Helpdesk: 6 zgłoszeń'}]},
  {id:'rules',label:'Zasady',title:'Zasady, które chronią sprzęt i ludzi',grouping:'class',
   intro:'Krótka rozmowa: czy technik może obejść filtr OSE, jeśli prosi o to nauczyciel? Potem dwie sytuacje i jedno Twoje postanowienie.',
   ...note(7,'Nauczanie dialogowe: zadaj pytanie o obejście filtra i poproś o argumenty obu stron (ok. 3 min). Doprowadź do wniosku: technik nie obchodzi zabezpieczeń, tylko zgłasza wyjątek administratorowi — także na prośbę nauczyciela. Potem dwie sytuacje i krótka deklaracja ucznia. Wspomnij, że sprzęt z programów (Aktywna Tablica, Laboratoria Przyszłości, Cyfrowy Uczeń) jest wspólny — zasady chronią go dla następnych roczników.','Czy technik może obejść filtr OSE, jeśli nauczyciel prosi o to na lekcji?','Nie. Obejście łamie zasady sieci i otwiera drogę zagrożeniom. Technik zgłasza adres administratorowi, który może dodać wyjątek; na lekcję — materiał zapasowy.','„Jeśli nauczyciel pozwolił, to wolno” — zgoda nauczyciela nie zmienia zasad bezpieczeństwa sieci. „Znaleziony pendrive można sprawdzić na własnym laptopie” — też nie.','Zapytaj, co powinno się znaleźć w dobrym zgłoszeniu usterki (gdzie, co widać, od kiedy, co już sprawdzono).'),
   activities:[
    reveal('rules-programs',[
     {title:'Aktywna Tablica',icon:'board',short:'Monitory, projektory, laptopy',text:'Program dofinansowuje do 80% zakupu sprzętu do sal, m.in. monitorów interaktywnych. Nabory trwają w latach 2025–2028.'},
     {title:'Laboratoria Przyszłości',icon:'settings',short:'Drukarki 3D, mikrokontrolery',text:'Sprzęt do pracowni: drukarki 3D, zestawy z mikrokontrolerami i czujnikami, sprzęt audio-wideo.'},
     {title:'Cyfrowy Uczeń',icon:'laptop',short:'Sprzęt szkoły, nie na własność',text:'Program na lata 2025–2029 wyposaża placówki w sprzęt dla uczniów. Sprzęt zostaje w szkole i służy kolejnym rocznikom.'}
    ]),
    choice('rules-usb','Na ławce w pracowni leży pendrive z napisem „Oceny 3TI”. Co robisz?',['Podłączam, żeby sprawdzić, czyj jest','Oddaję nauczycielowi lub w sekretariacie, bez podłączania','Podłączam do swojego laptopa, nie szkolnego — tak bezpieczniej','Wyrzucam do kosza'],[1],'Podrzucony nośnik z kuszącym napisem to klasyczna przynęta atakujących. Nie podłączasz go nigdzie — także do własnego sprzętu. Oddajesz, a administrator sprawdzi go bezpiecznie.','Przypomnij sobie zgłoszenie #106.'),
    choice('rules-password','Nauczyciel ma hasło do e-dziennika na karteczce przyklejonej do monitora. Co mu doradzisz?',['Nic — to jego sprawa','Zrobić zdjęcie karteczki na wszelki wypadek','Zmienić hasło (ktoś mógł je widzieć), zapisać je w menedżerze haseł i włączyć logowanie dwuetapowe','Zmienić hasło na krótsze, żeby łatwiej je zapamiętać'],[2],'Karteczkę widział każdy, kto wszedł do sali, a w e-dzienniku są dane osobowe uczniów. Nowe hasło, menedżer haseł i drugi składnik logowania zamykają temat.','Kto mógł zobaczyć karteczkę przez ostatni miesiąc?'),
    {type:'text',id:'rules-habit',question:'Jedna rzecz, którą zmienię w swoich nawykach przy sprzęcie w szkole lub w domu:',minLength:10,explanation:'Dobre postanowienie jest konkretne, np. „Nie podłączam znalezionych nośników”, „Zanim zrestartuję, pytam, co dokładnie widać”, „Zgłaszam zablokowaną stronę zamiast szukać VPN-a”.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z powtórki, mapy sieci, helpdesku i zasad. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Pokaż najczęstszy błąd z helpdesku (zwykle restart routera albo VPN) i zapytaj, jak brzmiałoby lepsze rozwiązanie. Uczniowie robią zdjęcie karty albo pokazują ją.','Które zgłoszenie było najtrudniejsze i czego zabrakło w pytaniach?','Zwykle #102 (dźwięk) lub #104 (sieć gości) — brakowało pytania o wybrane urządzenie wyjściowe lub o portal logowania.','Uczniowie uważają, że pytania „grzecznościowe” wystarczą; ważne są pytania zawężające przyczynę.','Poproś o zapisanie jednej rzeczy, którą sprawdzą w szkole, zanim zgłoszą usterkę.'),
   activities:[{type:'resultCard',id:'result',title:'Helpdesk szkolny — wynik',sources:['dev-mac','net-map','net-match','hd-tickets','rules-usb','rules-password'],badges:[
    {min:0,name:'Ten, co restartuje',text:'Restart czasem działa. Ale dziś już wiesz, że najpierw się pyta.'},
    {min:0.5,name:'Szkolny helpdesk',text:'Projektor, drukarka, Wi-Fi — ogarniasz. Nauczyciele zaczynają znać Twoje imię.'},
    {min:0.85,name:'Administrator w przebraniu ucznia',text:'Diagnoza, kultura, bezpieczeństwo. Na praktykach nie będziesz „tym nowym”.'}
   ]}]}
 ],
 exitTicket:'Wiesz, co robi router, przełącznik i punkt dostępowy, i umiesz przewidzieć skutki awarii. Przy zgłoszeniu najpierw pytasz, potem działasz — i nie obchodzisz zabezpieczeń.'
};
