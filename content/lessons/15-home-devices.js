import {note, choice, reveal} from '../schema.js';

export default {
 id:'15',grade:3,title:'Urządzenia cyfrowe w domu i inne',
 subtitle:'Policz, ile naprawdę kosztuje konsola, dekoder i router — i sprawdź, czy kamera w domu nie „nadaje” dla obcych.',
 topic:'Urządzenia cyfrowe w domu i inne',icon:'house',tags:['Smart home','kWh → zł','IoT'],duration:43,
 curriculum:'2024 Informatyka – liceum/technikum · urządzenia cyfrowe w otoczeniu ucznia, Internet rzeczy, bezpieczeństwo i ochrona danych',
 format:{
  name:'Projekt w trójkach z oceną koleżeńską',
  student:'W trójce przygotujecie plan „inteligentnego domu” dla rodziny Nowaków: oszczędności na prądzie, zabezpieczenia i automatyzacje. Każdy ma swoją rolę. Na koniec inna trójka oceni Wasz plan: dwie gwiazdy i jedno życzenie.',
  teacher:'Lekcja-projekt z jasnymi kryteriami sukcesu (ocenianie kształtujące). Po krótkim haku i powtórce pokazujesz 4 kryteria i role. Trójki pracują w symulatorze: Energetyk liczy kWh i złotówki, Strażnik robi audyt urządzeń IoT, Automatyk buduje reguły JEŻELI–TO; plan łączy wszystko. Potem krótki etap „nie tylko dom” (samodzielnie). Na koniec trójki zamieniają się stanowiskami, oceniają cudzy plan według kryteriów i zostawiają dwie gwiazdy i życzenie; po powrocie każda trójka wprowadza jedną poprawkę i zapisuje, czego się nauczyła (metapoznanie).',
  grouping:'Trójki z rolami: Energetyk, Strażnik bezpieczeństwa, Automatyk. Najlepiej jedno wspólne urządzenie na plan (lider zakładki klika, reszta liczy i doradza); można też pracować każdy u siebie — wtedy lider dyktuje decyzje ze swojej zakładki. W parze jedna osoba łączy dwie role. Samodzielnie — wszystkie trzy zakładki.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Uczenie kooperacyjne',url:'https://metodyka.covepolska.pl/metoda-uczenie-kooperacyjne.html'},
   {name:'Ocenianie kształtujące',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'},
   {name:'Metapoznanie',url:'https://metodyka.covepolska.pl/metoda-metapoznanie.html'}
  ]
 },
 objectives:['Obliczam roczne zużycie energii (kWh) i jego koszt w złotych na podstawie mocy i czasu pracy.','Wskazuję najważniejsze zagrożenia urządzeń IoT i dobieram zabezpieczenia: hasło, aktualizacje, osobna sieć, 2FA.','Projektuję reguły automatyzacji JEŻELI–TO, które oszczędzają energię i zwiększają bezpieczeństwo, bez ryzykownych skutków.','Rozpoznaję cyfrowe urządzenia poza domem (eCall, licznik zdalnego odczytu, smartwatch) i dane, które zbierają.'],
 materials:['Przeglądarka — najlepiej jedno urządzenie na trójkę do wspólnego planu','Kartka i długopis do obliczeń (opcjonalnie kalkulator)','Opcjonalnie: rachunek za prąd z domu lub etykieta energetyczna urządzenia do pokazania'],
 teacherGuide:{
  preparation:'Założenie cenowe: 1,10 zł za kWh (taryfa G11 z dystrybucją, 2026 r., w przybliżeniu) — powiedz to wprost, ceny się zmieniają. Klucz: dekoder 20 W × 24 h ≈ 193 zł/rok; router 8 W × 24 h ≈ 77 zł/rok. Cel 250 zł osiągną np. listwa na RTV + LED (ok. 279 zł, zwrot w ok. 4 mies.) albo pranie w 40°C + LED + limit FPS. Pojedyncze działanie nie wystarczy. Pułapka: nowa lodówka za 2500 zł zwraca się po ponad 50 latach.',
  summary:'Uczeń pokazuje rachunek W × h × 365 / 1000 × 1,10 zł, uzasadnia wybór działań czasem zwrotu, wymienia 3 zabezpieczenia IoT (hasło zamiast fabrycznego, aktualizacje, osobna sieć) i odrzuca regułę „JEŻELI ktoś dzwoni TO otwórz zamek”. Na karcie wyniku maks. 16 pkt.'
 },
 sections:[
  {id:'start',label:'Start',title:'Dekoder, który nic nie robi — za prawie 200 zł',grouping:'class',
   intro:'Czerwona dioda dekodera świeci całą noc. Zgadnij, ile to kosztuje rocznie. Potem jedno pytanie z poprzedniej lekcji.',
   ...note(4,'Najpierw zgadywanie bez liczenia (głosowanie ręką), potem pokaż rachunek na tablicy: 20 W × 24 h × 365 / 1000 = 175,2 kWh; × 1,10 zł ≈ 193 zł. Podkreśl: dekodery potrafią pobierać w czuwaniu 15–28 W. Potem pytanie powtórkowe o punkt dostępowy.','Skąd wziąć moc urządzenia, jeśli chcecie policzyć to w domu?','Z tabliczki znamionowej lub etykiety energetycznej, instrukcji albo pomiaru watomierzem w gniazdku.','Mylenie W (moc) z kWh (energia). Zapominanie o podzieleniu przez 1000 albo o pomnożeniu przez 365.','Zapytaj, ile kosztuje rok pracy routera (8 W × 24 h ≈ 77 zł) — to wróci w projekcie.'),
   activities:[
    choice('home-decoder','Dekoder TV w czuwaniu pobiera 20 W przez całą dobę. Ile to kosztuje rocznie? (1 kWh = 1,10 zł)',['ok. 20 zł','ok. 190 zł','ok. 1900 zł'],[1],'20 W × 24 h × 365 / 1000 = 175,2 kWh; 175,2 × 1,10 zł ≈ 193 zł. Za urządzenie, które w tym czasie niczego nie pokazuje.','Policz: W × h na dobę × 365 dni, podziel przez 1000 (kWh), pomnóż przez cenę.'),
    choice('home-ap','Powtórka z lekcji o sieci szkoły: co robi punkt dostępowy?',['Łączy szkołę z internetem','Nadaje Wi-Fi i wpuszcza urządzenia bezprzewodowe do sieci','Przechowuje kopie zapasowe','Filtruje strony z grami'],[1],'Punkt dostępowy nadaje Wi-Fi. W domu zwykle siedzi w jednym pudełku z routerem — i to w nim ustawisz osobną sieć dla urządzeń IoT.','Z internetem łączy router; kopie trzyma NAS; filtruje zapora.')
   ]},
  {id:'criteria',label:'Kryteria',title:'Na co zwracamy uwagę',grouping:'class',
   intro:'Tak ocenicie swój plan — i tak oceni go inna trójka. Ustalcie role, zanim otworzycie symulator.',
   ...note(4,'Przeczytaj kryteria na głos i pokaż, jak będą sprawdzane (checklista w etapie oceny koleżeńskiej). Podziel klasę na trójki i przydziel role. Przy nieparzystej liczbie: para łączy role Strażnika i Automatyka.','Po czym poznacie, że plan jest dobry, zanim zobaczycie punkty?','Oszczędność co najmniej 250 zł z rachunkiem, brak fabrycznych haseł i osobna sieć IoT, min. 3 sensowne reguły, każda decyzja z uzasadnieniem.','Uczniowie traktują kryteria jak formalność. Pokaż, że oszczędność bez rachunku i reguły bez uzasadnienia nie spełniają kryteriów.','Poproś trójki o dopisanie własnego, piątego kryterium (np. „plan nie pogarsza wygody rodziny”).'),
   activities:[reveal('home-criteria',[
    {title:'1. Pieniądze',icon:'energy',short:'≥ 250 zł/rok z rachunkiem',text:'Oszczędność co najmniej 250 zł rocznie. Pokazany rachunek: W × h × 365 / 1000 × 1,10 zł. Koszt wdrożenia zwraca się w rozsądnym czasie.'},
    {title:'2. Bezpieczeństwo',icon:'shield',short:'Zero fabrycznych haseł',text:'Żadnych domyślnych haseł, aktualne oprogramowanie, osobna sieć dla urządzeń IoT, 2FA tam, gdzie się da. Żadnych „pułapek”, które osłabiają ochronę.'},
    {title:'3. Automatyzacje',icon:'settings',short:'≥ 3 sensowne reguły',text:'Co najmniej 3 reguły JEŻELI–TO, w tym min. 1 oszczędzająca energię i 1 dla bezpieczeństwa. Zero reguł ryzykownych.'},
    {title:'4. Uzasadnienie',icon:'book',short:'Dlaczego tak?',text:'Najważniejsza decyzja ma 1–2 zdania uzasadnienia, np. „Listwa na RTV, bo dekoder w czuwaniu zjadał prawie 200 zł rocznie”.'},
    {title:'Role w trójce',icon:'group',short:'Energetyk · Strażnik · Automatyk',text:'Energetyk prowadzi zakładkę Energia i liczy rachunek. Strażnik bezpieczeństwa robi audyt urządzeń. Automatyk buduje reguły. Plan składacie razem. Lider zakładki klika, pozostali sprawdzają i doradzają.'}
   ])]},
  {id:'project',label:'Projekt',title:'Projekt: dom Nowaków',grouping:'trio',
   intro:'Rodzina Nowaków: 4 osoby, mieszkanie 60 m². Rachunki rosną, a w domu przybywa „inteligentnych” urządzeń. Przygotujcie plan w trzech zakładkach. Wybierz swoją rolę u góry symulatora.',
   reading:{title:'Dwie rzeczy, które warto wiedzieć przed startem',paragraphs:[
    'Energia to moc × czas. Urządzenie o mocy 8 W pracujące całą dobę zużywa 8 × 24 = 192 Wh dziennie, czyli 70 kWh rocznie. Najwięcej kosztują urządzenia bardzo mocne (czajnik, PC do gier) albo pracujące bez przerwy (router, dekoder w czuwaniu). Ładowarka bez telefonu to grosze — sprawdź sam.',
    'Urządzenia IoT (kamery, gniazdka, odkurzacze) to małe komputery w Twojej sieci. Boty w internecie non stop sprawdzają fabryczne hasła i znane luki. Podstawa: własne hasło, aktualizacje, osobna sieć Wi-Fi dla IoT i weryfikacja dwuetapowa w aplikacji.'
   ],example:{question:'Przykład rozwiązany: ile kosztuje rocznie PC gamingowy (350 W, 3 h dziennie)?',answer:'350 W × 3 h = 1050 Wh na dobę. × 365 = 383 250 Wh = 383,25 kWh. × 1,10 zł ≈ 421,58 zł rocznie (plus trochę za czuwanie). Limit klatek do odświeżania monitora może zmniejszyć pobór np. do 280 W.'}},
   ...note(18,'Trójki pracują w symulatorze; każdy lider prowadzi swoją zakładkę, ale plan jest wspólny. Co 5 minut zapowiadaj czas. Krąż z pytaniami: „Które urządzenie zjada najwięcej za nic?”, „Po ilu miesiącach zwróci się listwa?”, „Czy ta reguła może komuś zaszkodzić?”. Nie mów, które działania wybrać — cel 250 zł wymaga połączenia co najmniej dwóch.','Dlaczego nowa lodówka za 2500 zł nie jest dobrym pomysłem na oszczędność w tym planie?','Oszczędza ok. 44 zł rocznie, więc zwraca się po ponad 50 latach. Taniej i szybciej działają listwa, LED i zmiana nawyków.','Wybieranie wszystkiego jak leci (bez patrzenia na koszt i czas zwrotu). Zaznaczanie pułapek w audycie („wyłącz zaporę”). Reguła „ktoś dzwoni → otwórz zamek”.','Dla szybkich: policzcie, ile kosztuje rocznie Wasza konsola lub komputer w domu, i porównajcie z dekoderem Nowaków.'),
   activities:[{type:'smartHome',id:'home-project',mode:'project',points:12,label:'Projekt: dom Nowaków (energia, bezpieczeństwo, automatyzacje)'}]},
  {id:'other',label:'Nie tylko dom',title:'Nie tylko dom',grouping:'solo',
   intro:'Urządzenia cyfrowe są w aucie, w liczniku prądu, na nadgarstku i w hulajnodze na mieście. Dopasuj — i zastanów się, kto widzi te dane.',
   ...note(6,'Uczniowie pracują samodzielnie (ok. 4 min), potem krótko omów pytanie o prywatność. Podkreśl: dane o zdrowiu to szczególna kategoria danych osobowych; zgody można cofnąć.','Które z tych urządzeń zbiera dane najbardziej osobiste i dlaczego?','Smartwatch lub opaska — tętno, sen, lokalizacja, aktywność to dane o zdrowiu i zwyczajach.','Przekonanie, że dane zostają na urządzeniu. Zwykle trafiają do chmury producenta, a dalej — zgodnie z klikniętymi zgodami.','Zapytaj, czy eCall „śledzi” auto cały czas (nie — uruchamia się przy poważnym wypadku lub po naciśnięciu SOS).'),
   activities:[
    {type:'matching',id:'home-other',question:'Dopasuj urządzenie lub usługę do tego, co robi (i na co uważać).',options:['Po poważnym wypadku samo dzwoni na 112 i przesyła lokalizację auta','Przesyła odczyty zużycia prądu do dostawcy — bez wizyty inkasenta','Mierzy tętno i sen — to dane o zdrowiu, szczególnie chronione','Wypożyczasz pojazd w aplikacji, a firma zna Twoją trasę','Płacisz, zbliżając zegarek do terminala (NFC)','Wspólny standard: urządzenia różnych producentów działają razem'],rows:[
     {label:'Matter',correct:[5],explanation:'Matter to wspólny standard smart home — gniazdko jednej firmy zadziała z aplikacją lub kontrolerem innej.'},
     {label:'eCall w samochodzie',correct:[0],explanation:'eCall jest obowiązkowy w nowych modelach aut w UE od kwietnia 2018 r. Łączy z numerem 112 po poważnym wypadku lub po naciśnięciu SOS.'},
     {label:'Smartwatch lub opaska sportowa',correct:[2],explanation:'Dane o zdrowiu to szczególna kategoria danych osobowych (RODO). Sprawdź, komu aplikacja je udostępnia.'},
     {label:'Płatność zegarkiem',correct:[4],explanation:'Zegarek przekazuje terminalowi zastępczy numer (token), a nie prawdziwy numer karty. Po zgubieniu — zablokuj płatności w aplikacji banku.'},
     {label:'Licznik zdalnego odczytu energii',correct:[1],explanation:'Do końca 2028 r. takie liczniki ma mieć 80% odbiorców w Polsce. Koniec z rachunkami „szacunkowymi”, możliwe taryfy godzinowe.'},
     {label:'Hulajnoga lub rower miejski',correct:[3],explanation:'Wygodne, ale aplikacja zna Twoje trasy i godziny. Czytaj zgody na lokalizację.'}
    ]},
    choice('home-privacy','Twoja opaska sportowa zapisuje tętno i sen. Kto może zobaczyć te dane?',['Nikt — dane zostają na opasce','Producent aplikacji i ci, którym pozwolisz w zgodach (np. partnerzy, ubezpieczyciel)','Tylko lekarz rodzinny','Wszyscy w internecie'],[1],'Dane zwykle trafiają do chmury producenta, a dalej — zależnie od zgód klikniętych przy instalacji. Dane o zdrowiu są szczególnie chronione: możesz cofnąć zgodę i zażądać usunięcia.','Pomyśl, gdzie aplikacja trzyma historię z ostatnich miesięcy.')
   ]},
  {id:'peer',label:'Ocena',title:'Dwie gwiazdy i życzenie',grouping:'trio',
   intro:'Zamieńcie się stanowiskami z inną trójką. Otwórzcie zakładkę Plan w ich symulatorze, sprawdźcie kryteria i zostawcie informację zwrotną na ich urządzeniu. Potem wracacie i wprowadzacie jedną poprawkę.',
   ...note(7,'Trójki zamieniają się miejscami (3 min): oceniający zaznaczają checklistę i wpisują dwie gwiazdy i życzenie na urządzeniu ocenianej trójki. Po powrocie (3 min) każda trójka czyta informację zwrotną, wprowadza jedną poprawkę w symulatorze i zapisuje, co zmieniła. Pilnuj tonu: konkretnie i życzliwie.','Jaka informacja zwrotna najbardziej pomogła Wam poprawić plan?','Konkretna, np. „brakuje reguły bezpieczeństwa”, „kamera ma nadal fabryczne hasło”, „policzcie czas zwrotu”.','Ogólniki („fajne”, „słabe”) zamiast konkretów. Ocenianie osób zamiast planu.','Poproś jedną trójkę o pokazanie planu na projektorze i omówienie poprawki przed klasą.'),
   activities:[
    {type:'checklist',id:'peer-check',items:['Sprawdziliśmy oszczędność i rachunek (cel 250 zł/rok)','Sprawdziliśmy audyt bezpieczeństwa (hasła, sieć IoT, pułapki)','Sprawdziliśmy reguły (min. 3, energia i bezpieczeństwo, zero ryzykownych)','Przeczytaliśmy uzasadnienie najważniejszej decyzji'],explanation:'Dziękujemy za rzetelną ocenę. Teraz wpiszcie dwie gwiazdy i życzenie — konkretnie, o planie, nie o osobach.'},
    {type:'text',id:'peer-stars',question:'Dwie gwiazdy (co jest dobre) i życzenie (co poprawić) — dla ocenianej trójki:',minLength:20,explanation:'Dobra informacja zwrotna jest konkretna: „★ Listwa na RTV — świetny wybór, zwrot w 4 miesiące. ★ Zero pułapek w audycie. Życzenie: dodajcie regułę na wypadek zalania”.'},
    {type:'text',id:'peer-fix',question:'Po powrocie: jaką jedną poprawkę wprowadziliście i czego się dzięki temu nauczyliście?',minLength:15,explanation:'Metapoznanie: zapisanie, co i dlaczego zmieniliście, pomaga zapamiętać zasadę, a nie tylko wynik.'}
   ]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z rozgrzewki, projektu i etapu „nie tylko dom”. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Zapytaj 2–3 trójki o ich oszczędność i najważniejszą decyzję. Przypomnij: moc znajdziecie na etykiecie lub tabliczce znamionowej urządzenia — to realne pieniądze. Uczniowie robią zdjęcie karty.','Które jedno działanie z planu dałoby się wprowadzić w Waszym domu od razu i bez kosztów?','Np. pełne wyłączanie konsoli zamiast trybu spoczynku, pranie w 40°C, zmiana fabrycznego hasła do routera lub kamery.','Uczniowie wybierają działania drogie lub niewygodne, których nikt nie wprowadzi. Najlepsze są te tanie i od razu.','Poproś o policzenie rocznego kosztu jednego urządzenia w sali (np. projektora lub monitora) na podstawie mocy z tabliczki znamionowej.'),
   activities:[{type:'resultCard',id:'result',title:'Dom Nowaków — wynik',sources:['home-decoder','home-ap','home-project','home-other','home-privacy'],badges:[
    {min:0,name:'Rachunek grozy',text:'Rachunek jeszcze straszy. Zacznij od dekodera — zjada najwięcej za nic.'},
    {min:0.5,name:'Domowy inżynier',text:'Liczysz kWh i zabezpieczasz sprzęt. Rodzice mogą Ci zacząć płacić prowizję od oszczędności.'},
    {min:0.85,name:'Minister energii i spokoju',text:'250+ zł rocznie w kieszeni i dom, którego nie przejmie żaden bot. Szacun.'}
   ]}]}
 ],
 exitTicket:'Liczysz koszt prądu (W × h × 365 / 1000 × cena), wiesz, jak zabezpieczyć kamerę i router, i układasz reguły, które oszczędzają i chronią. Moc dekodera jest na jego etykiecie — może właśnie znalazłeś 200 zł.'
};
