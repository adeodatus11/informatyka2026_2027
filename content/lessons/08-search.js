import {note, choice, reveal} from '../schema.js';

export default {
 id:'08',grade:1,title:'Przykłady wyszukiwania informacji',
 subtitle:'Znajdziesz w minutę to, czego inni szukają kwadrans — tani bilet, regulamin praktyk, instrukcję, pracę na wakacje.',
 topic:'Przykłady wyszukiwania informacji',icon:'search',tags:['"…"','site:','filetype:'],duration:43,
 curriculum:'Podstawa programowa informatyki (liceum/technikum): wyszukiwanie informacji w sieci, ocena wiarygodności źródeł',
 format:{
  name:'Nauczanie jawne + mastery learning',
  student:'Najpierw patrzysz, jak szuka ekspert, potem sam przechodzisz misje w wyszukiwarce „Szukajka”. Poziom 2 odblokujesz po zaliczeniu 2 misji z poziomu 1. Na koniec boss w parach. Efekt: znajdujesz konkretną informację 1–2 zapytaniami zamiast dziesięciu.',
  teacher:'Schemat „patrz → razem → sam”. W etapie „Patrz” pokazujesz na projektorze przykłady rozwiązane: słabe zapytanie, wyniki, komentarz, poprawione zapytanie; ostatni przykład z luką uzupełniają uczniowie. Potem uczniowie pracują samodzielnie na poziomach — poziom 2 odblokowuje się dopiero po 2 zaliczonych misjach poziomu 1 (mastery). Twoja rola: krążyć, czytać historię zapytań uczniów i pytać „co zmieniłeś i dlaczego?”. Kto utknie, dostaje podpowiedź w symulatorze, a po 3 zapytaniach — przykład.',
  grouping:'Etapy 1–4 samodzielnie. Boss (etap 5) w parach: każdy robi inną misję, potem tłumaczy partnerowi swoje zapytanie. Uczeń bez pary robi obie misje, druga daje bonus.',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:[
  'Używam cudzysłowu i minusa, żeby znaleźć dokładną frazę bez śmieci w wynikach.',
  'Ograniczam wyniki do właściwego źródła i typu pliku: site:, filetype:, OR.',
  'Rozpoznaję w wynikach reklamy, clickbait, stare wersje i podróbki domen .gov.pl.',
  'Sprawdzam odpowiedź AI w źródle i poprawiam swoje zapytanie na podstawie wyników.'
 ],
 materials:['Komputer lub telefon z przeglądarką — każdy uczeń swój (w bossie może być jeden na parę)','Projektor do etapu „Patrz, jak szukam”'],
 teacherGuide:{
  preparation:'Nic nie drukujesz. Wyszukiwarka „Szukajka” działa w symulatorze bez internetu — wszystkie strony i domeny są wymyślone, więc wyniki są takie same u wszystkich. Otwórz etap 2 na projektorze. Przypomnij, że liczba zapytań jest punktowana: mniej, ale mądrzej.',
  summary:'Uczeń buduje zapytanie z operatorami: "dokładna fraza", -słowo, site:gov.pl lub site:szkoła.edu.pl, filetype:pdf, "fraza A" OR "fraza B". Sprawdza datę i domenę wyniku, pomija reklamy i clickbait, a odpowiedź AI weryfikuje w źródle (w misji o ulgach AI podaje 51% zamiast 37%). Pytanie dodatkowe: dlaczego site:gov.pl nie przepuści strony „przejazdy-info-gov.pl”?'
 },
 sections:[
  {id:'start',label:'Start',title:'Wpisujesz „praktyki” i dostajesz 4 mln wyników. Co teraz?',grouping:'class',
   intro:'Większość ludzi przewija pierwszą stronę wyników i się poddaje. Ty dziś nauczysz się zadawać wyszukiwarce pytania jak zawodowiec. Najpierw szybka powtórka.',
   ...note(4,'Zapytaj klasę, ile razy ostatnio poprawiali zapytanie, zanim coś znaleźli. Uczniowie odpowiadają na dwa pytania — pierwsze to powtórka z lekcji o fake newsach (czytanie lateralne), drugie sprawdza, co już wiedzą o cudzysłowie.','Co robisz, kiedy na pierwszej stronie wyników nie ma tego, czego szukasz?','Większość: przewija dalej albo zmienia jedno słowo. Lepiej: doprecyzować — dodać frazę w cudzysłowie, wykluczyć śmieci, wskazać stronę lub typ pliku.','Uczniowie myślą, że więcej słów zawsze pomaga. Czasem pomaga mniej słów, ale właściwych (np. fachowe „młodociani” zamiast „nastolatek”).','Zapytaj, kto używał kiedyś cudzysłowu lub minusa w wyszukiwarce i po co.'),
   activities:[
    choice('l08-sift','Powtórka: jak zawodowy fact-checker sprawdza nieznaną stronę?',['Czyta ją dokładnie od góry do dołu','Otwiera nowe karty i sprawdza, co inni piszą o stronie i jej autorze (czytanie lateralne)','Ocenia, czy strona ładnie wygląda i ma kłódkę'],[1],'Tak — czytanie lateralne: zamiast wierzyć stronie „od środka”, sprawdzasz ją gdzie indziej. Dziś nauczysz się robić to szybciej dzięki operatorom.','Przypomnij sobie literę F w SIFT.'),
    choice('l08-exact','Które zapytanie znajdzie strony z dokładnie tym zdaniem: praca sezonowa dla 16-latka?',['praca sezonowa dla 16-latka','"praca sezonowa dla 16-latka"','+praca +sezonowa +16-latka'],[1],'Cudzysłów wymusza dokładną frazę w tej kolejności. Plus (+) nie działa w wyszukiwarkach od 2011 roku.','Który znak mówi wyszukiwarce „dokładnie tak”?')
   ]},
  {id:'model',label:'Patrz',title:'Patrz, jak szukam',grouping:'class',
   intro:'Trzy przykłady rozwiązane: słabe zapytanie → wyniki → dlaczego źle → poprawione zapytanie. W trzecim przykładzie Ty uzupełniasz lukę.',
   reading:{title:'Jak myśli wyszukiwarka',paragraphs:['Wyszukiwarka nie rozumie pytania jak człowiek. Dopasowuje słowa i wysoko pokazuje popularne strony — także sklepy, reklamy i clickbait. Twoje zadanie: powiedzieć precyzyjnie, czego chcesz, a czego nie.','Operatory to komendy w zapytaniu: cudzysłów wymusza frazę, minus wyklucza słowo, site: ogranicza do strony, filetype: do typu pliku. Odpowiedź AI nad wynikami (w Polsce od marca 2025 r.) bywa pomocna, ale potrafi zmyślać — w badaniu BBC i EBU z 2025 r. 45% odpowiedzi asystentów AI miało istotny błąd. Zawsze klikaj źródło.'],example:{question:'Czy wynik na pierwszym miejscu jest najlepszy?',answer:'Nie zawsze. Pierwsze miejsca zajmują często reklamy („Sponsorowane”) i strony, które dobrze się pozycjonują, a nie te najbardziej rzetelne.'}},
   ...note(8,'Na projektorze klikaj „Następny krok” i przy każdym kroku pytaj: „co tu jest nie tak?”. Nazwij głośno swój tok myślenia (nauczanie jawne): „szukam oficjalnego źródła, więc dodaję site:gov.pl”. Luka w przykładzie 3 — uczniowie wybierają na swoich urządzeniach. Pokaż ściągę operatorów i powiedz wprost, że + i ~ już nie działają.','Dlaczego w przykładzie 2 pierwszy wynik z forum jest niebezpieczny, choć jest na górze?','Bo forum podaje błędną informację (np. że 16-latek może pracować w nocy), a jest popularne. Popularne nie znaczy prawdziwe — potrzebne jest oficjalne źródło.','Uczniowie wpisują całe pytania („ile godzin może pracować 16 latek”) i klikają pierwszy wynik. Mylą site: z wpisaniem nazwy strony jako zwykłego słowa.','Pokaż, jak w prawdziwej wyszukiwarce zadziała site:gov.pl dla hasła „ulga dla młodych”.'),
   activities:[
    {type:'searchLab',id:'search-demo',mode:'demo',points:1,label:'Przykłady rozwiązane + luka'},
    reveal('operators-cheat',[
     {title:'"dokładna fraza"',icon:'search',short:'Tylko to zdanie, w tej kolejności.',text:'Przykład: "czucie i wiara silniej mówi do mnie". Świetne do cytatów, komunikatów błędów i nazw modeli.'},
     {title:'-słowo',icon:'close',short:'Wyklucz śmieci.',text:'Przykład: słuchawki bluetooth nie łączą się -sklep -cena. Uwaga: nie wykluczaj słowa, które może być w dobrym wyniku!'},
     {title:'site:',icon:'globe',short:'Szukaj na jednej stronie lub w domenie.',text:'Przykład: site:gov.pl (strony instytucji publicznych), site:zs-przyklad.edu.pl (strona szkoły).'},
     {title:'filetype:',icon:'pdf',short:'Tylko dany typ pliku.',text:'Przykład: regulamin praktyk filetype:pdf. Regulaminy, instrukcje i formularze często są w PDF.'},
     {title:'OR',icon:'funnel',short:'Jedno albo drugie.',text:'Przykład: "praca wakacyjna" OR "praca sezonowa". Pisz OR wielkimi literami.'},
     {title:'Nie działają',icon:'warning',short:'+słowo, ~słowo, cache:',text:'Plus wycofano w 2011 r. (użyj cudzysłowu), tyldę w 2013 r., cache: w 2024 r. Działają za to intitle: (słowo w tytule) oraz before:/after: (data).'}
    ])
   ]},
  {id:'level1',label:'Poziom 1',title:'Poziom 1: dokładnie to, bez śmieci',grouping:'solo',
   intro:'Trzy misje na cudzysłów i minus. Liczy się liczba zapytań: zmieść się w „par”, a dostaniesz 3 punkty. Zalicz 2 z 3 misji, żeby odblokować poziom 2.',
   ...note(9,'Uczniowie pracują samodzielnie. Krąż po klasie i czytaj historie zapytań na ekranach — chwal zmiany typu „dodałem minus”, a nie liczbę prób. Uczniom, którzy utknęli, wskaż przycisk „Podpowiedź”. Pułapka w misji z burrito: -mięso usuwa też przepis „bez mięsa” — to dobry moment, by zapytać „dlaczego zniknął dobry wynik?”.','Co zmieniłeś w zapytaniu i jak to zmieniło wyniki?','Np. „wziąłem cytat w cudzysłów i zostały tylko strony z tym zdaniem”, „dodałem -sklep -cena i zniknęły sklepy”.','Wykluczanie zbyt ogólnego słowa (-mięso), które usuwa też dobre wyniki. Klikanie reklamy lub forum, bo jest na górze.','Szybsi uczniowie: niech spróbują zaliczyć misję jednym zapytaniem mniej niż par i opiszą swoje zapytanie sąsiadowi.'),
   activities:[
    {type:'searchLab',id:'search-l1',mode:'missions',levels:[1],points:9,label:'Poziom 1: "fraza" i -minus'}
   ]},
  {id:'level2',label:'Poziom 2',title:'Poziom 2: właściwe źródło',grouping:'solo',
   intro:'site:, filetype: i OR. Tu nie wystarczy znaleźć — trzeba znaleźć oficjalne i aktualne. W jednej misji odpowiedź AI zawiera błąd. Złapiesz go?',
   reading:{title:'Oficjalne i aktualne',paragraphs:['Strony instytucji publicznych w Polsce kończą się na .gov.pl, a szkół często na .edu.pl. Uważaj na podróbki: „-gov.pl” z myślnikiem to zwykła domena .pl, którą może kupić każdy — także oszust.','Sprawdzaj datę! Regulamin z 2019 roku albo oferta sprzed roku to informacja nieaktualna. filetype:pdf przydaje się do regulaminów, instrukcji i formularzy, bo szkoły i urzędy publikują je właśnie w PDF.'],example:{question:'Która domena należy do instytucji publicznej: przejazdy-info.gov.pl czy przejazdy-info-gov.pl?',answer:'Pierwsza. Czytaj od końca: „.gov.pl”. Druga kończy się na „-gov.pl”, czyli to zwykła domena „przejazdy-info-gov” w końcówce .pl.'}},
   ...note(10,'Poziom odblokowuje się po 2 misjach poziomu 1 — to celowe (mastery). Uczniom, którzy czekają, pomóż dokończyć poziom 1, zamiast odblokowywać. W misji o ulgach zatrzymaj klasę na 30 s: „Kto zauważył, że AI podało 51%? Skąd AI to wzięło?” — źródłem odpowiedzi AI jest forum.','Skąd wiesz, że znaleziona strona jest oficjalna i aktualna?','Domena kończy się na .gov.pl lub jest stroną mojej szkoły, data jest z tego roku, informacja zgadza się z innymi oficjalnymi źródłami.','Ufanie odpowiedzi AI bez klikania źródła. Wybór regulaminu z 2019 r., bo jest na tej samej stronie. Pisanie „or” małymi literami.','Porównaj wyniki: ulga uczeń pociąg site:gov.pl oraz to samo bez site:. Ile śmieci znika?'),
   activities:[
    {type:'searchLab',id:'search-l2',mode:'missions',levels:[2],requires:{id:'search-l1',min:2},points:9,label:'Poziom 2: site:, filetype:, OR + pułapka AI'}
   ]},
  {id:'boss',label:'Boss',title:'Boss: wyścig w parach',grouping:'pair',
   intro:'Dwie misje łączące kilka operatorów naraz. Każda osoba z pary bierze inną misję. Kto pierwszy? Potem wytłumacz partnerowi swoje zapytanie — jakbyś uczył kogoś młodszego.',
   ...note(8,'Ogłoś start wyścigu. Boss odblokowuje się po zaliczeniu co najmniej jednej misji poziomu 2. Po misji każdy tłumaczy partnerowi swoje zapytanie operator po operatorze i zapisuje je w polu poniżej. Przy parze, w której ktoś jeszcze nie ma dostępu, niech obie osoby pracują nad jedną misją na jednym urządzeniu.','Który operator w Twoim zapytaniu zrobił największą różnicę i dlaczego?','Np. site:voltino.pl odciął sklepy i podejrzane pliki, after:2026-09-01 zostawił tylko świeże oferty, filetype:pdf zostawił tylko instrukcje.','Uczniowie klikają plik PDF z nieznanej domeny .xyz, bo „też jest instrukcją”. Pomijają datę i miasto w ofercie praktyk.','Wymyślcie w parze własną misję z życia (np. rozkład jazdy, regulamin konkursu) i zapiszcie wzorcowe zapytanie.',true),
   activities:[
    {type:'searchLab',id:'search-boss',mode:'missions',levels:['boss'],requires:{id:'search-l2',min:1},points:3,label:'Boss: łączenie operatorów'},
    {type:'text',id:'boss-explain',question:'Zapisz zapytanie, którym pokonałeś bossa, i wyjaśnij partnerowi każdy operator:',placeholder:'Np. "voltino s3" instrukcja site:voltino.pl filetype:pdf — bo…',minLength:15,explanation:'Porównaj: dobre zapytanie łączy frazę w cudzysłowie (dokładny model lub zawód), site: (zaufane źródło) i filetype: albo after: (właściwy format lub data). Jeśli potrafisz wyjaśnić każdy element — umiesz to naprawdę.'}
   ]},
  {id:'result',label:'Wynik',title:'Twoja karta wyszukiwacza',grouping:'solo',
   intro:'Punkty z pytań, przykładu z luką i misji. Pod wynikiem zobaczysz, ilu zapytań średnio potrzebowałeś.',
   ...note(4,'Uczniowie uzupełniają samoocenę i pokazują kartę. Zapytaj o jedną zmianę, którą wprowadzą w swoim wyszukiwaniu od dziś. Zwróć uwagę na średnią liczbę zapytań w podsumowaniu — to miara efektywności, nie tylko punktów.','Jakie zapytanie z dzisiejszej lekcji przyda Ci się jeszcze w tym tygodniu?','Np. regulamin praktyk site:(strona szkoły) filetype:pdf, "praca wakacyjna" OR "praca sezonowa" (miasto), site:gov.pl przy sprawach urzędowych.','Uczniowie oceniają się tylko po punktach z misji, a pomijają to, czy rozumieją operatory. Samoocena ma to wychwycić.','Poproś o wymyślenie jednej misji dla kolegów na następną lekcję (zapytanie + cel), do sprawdzenia w klasie.'),
   activities:[
    {type:'resultCard',id:'result-card',title:'Karta wyszukiwacza',sources:['l08-sift','l08-exact','search-demo','search-l1','search-l2','search-boss'],
     badges:[
      {min:0,name:'Klikacz',text:'Klikasz, co jest na górze. Wróć do poziomu 1 — jeden cudzysłów i jeden minus robią różnicę.'},
      {min:0.5,name:'Tropiciel',text:'Wiesz, jak zawęzić wyniki. Jeszcze trochę site: i filetype:, a sklepy przestaną Cię zaczepiać.'},
      {min:0.85,name:'Snajper wyszukiwania',text:'Jedno zapytanie, jeden strzał, właściwe źródło. Reszta klasy jeszcze przewija drugą stronę wyników.'}
     ]}
   ]}
 ],
 exitTicket:'Twoja ściąga: "dokładna fraza", -śmieci, site:gov.pl lub strona szkoły, filetype:pdf, "A" OR "B". Zawsze sprawdź domenę i datę, a odpowiedź AI — w źródle.'
};
