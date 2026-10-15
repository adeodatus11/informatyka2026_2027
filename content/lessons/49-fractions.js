import {note, choice} from '../schema.js';

const lab=(mode,id,label)=>({type:'numberLab',id,mode,label});

export default {
 id:'49',grade:2,order:23,title:'Działania na ułamkach zwykłych z wykorzystaniem NWD i NWW',
 subtitle:'Przepis na 4 osoby, a gości 6. Mieszanka 1:50 do kosiarki. Rabat na rabat, który wcale nie daje 45%. Ułamki z NWD i NWW ogarniesz na prawdziwych przykładach.',
 topic:'Skracanie przez NWD, wspólny mianownik przez NWW, dodawanie, odejmowanie i mnożenie ułamków',icon:'hash',tags:['skracanie','wspólny mianownik','proporcje'],duration:45,
 curriculum:'Informatyka – liceum/technikum · I.2.a (działania na ułamkach z wykorzystaniem NWD i NWW), I.1 (kroki rozwiązania problemu), I.3 (sprawdzanie wyniku na przykładowych danych) — algorytm wykonywany krok po kroku, bez programowania; kod na następnej lekcji',
 format:{
  name:'Przypadki z kuchni i warsztatu: przykład → próba → przypadek z zawodu',
  student:'Każde działanie poznajesz na sytuacji z życia: przepis, pizza, rabat w sklepie, mieszanka do kosiarki, farba u fryzjera. Symulator prowadzi algorytm krok po kroku (NWD, NWW, liczniki, wynik) i pokazuje ułamki na paskach — od razu widać, gdy wynik jest absurdalny. Efekt: przeliczony przepis i mieszanki, które naprawdę się zgadzają.',
  teacher:'Rdzeń to przypadki z życia i zawodu (problem, projekt, przypadek): każdy etap zaczyna się od sytuacji, a algorytm (NWD → skrócenie, NWW → rozszerzenie → dodanie → skrócenie) jest narzędziem do jej rozwiązania. Pierwsze zadanie w każdym trybie to przykład rozwiązany w małych krokach, kolejne mają mniej podpowiedzi. Symulator daje feedback prowadzący do poprawy: rozpoznaje typowy błąd 1/2 + 1/3 = 2/5 i pokazuje go na pasku jako mniejszy od 1/2, a wynik nieskrócony przyjmuje dopiero po skróceniu (bez kary). Twoja rola: na starcie każdego etapu 1 minuta rozmowy o sytuacji, potem krążysz i pytasz „ile to części całości?”.',
  grouping:'Samodzielnie, każdy w swoim symulatorze. Para tylko jako opcja przy mieszankach (etap 5) — porównanie wyników przed wpisaniem, ale każdy wpisuje u siebie.',
  methods:[
   {name:'Problem, projekt i przypadek',url:'https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html'},
   {name:'Przykłady rozwiązane',url:'https://metodyka.covepolska.pl/metoda-przyklady-rozwiazane.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Skracam ułamek w jednym kroku, dzieląc licznik i mianownik przez NWD.','Dodaję i odejmuję ułamki, sprowadzając je do wspólnego mianownika równego NWW mianowników.','Mnożę ułamki (przepis, rabat na rabat) i skracam wynik.','Zamieniam proporcję (1:50, 1:1,5) na ułamek całości i liczę ilości składników.'],
 materials:['Komputer z przeglądarką — jeden na osobę. Symulator „Laboratorium liczb” (tryb ułamków) działa bez instalacji i bez logowania.','Opcjonalnie: kartka do rachunków na boku'],
 teacherGuide:{
  preparation:'Klucz: 18/24 = 3/4 (NWD 6), 45/60 = 3/4 (NWD 15), 40/100 = 2/5 (NWD 20); 1/2 + 1/3 = 3/6 + 2/6 = 5/6; 3/4 − 1/6 = 9/12 − 2/12 = 7/12; 1/4 + 1/12 = 4/12 = 1/3; 2/3 · 3/2 = 1 (szklanka mąki dla 6 osób); rabat −1/4 i −1/5: płacisz 3/4 · 4/5 = 3/5, łączny rabat 2/5 = 40%; 1/2 · 2/3 = 1/3; mieszanka 1:50 — olej to 1/51 całości, 100 ml oleju na 5 l benzyny; farba 1 : 1,5 = 2 : 3, farba to 2/5 miski, 60 ml farby + 90 ml utleniacza; 2/3 l + 1/4 l = 11/12 l. Proporcje mieszanek to przykłady — w pracy zawsze obowiązuje instrukcja producenta.',
  summary:'Uczeń wykonuje algorytmy na ułamkach w 4 trybach symulatora (po 6 pkt) i odpowiada na 3 pytania. Karta wyniku: maks. 27 pkt. Pytanie na wyjście: dlaczego 1/2 + 1/3 to nie 2/5? Na następnej lekcji te same kroki zapiszesz w Pythonie jako kalkulator ułamków.'
 },
 sections:[
  {id:'start',label:'Start',title:'1/2 szklanki mleka + 1/3 szklanki wody = ?',grouping:'class',
   intro:'Przepis na naleśniki. Kolega mówi: „1/2 + 1/3 = 2/5, dodajesz górę i dół”. Mama mówi, że wyjdzie prawie pełna szklanka. Kto ma rację? Najpierw dwa pytania z lekcji o algorytmach na liczbach w Pythonie.',
   reading:{title:'Ułamki = części tej samej wielkości',paragraphs:['Dodawać możesz tylko kawałki tej samej wielkości: trzy szóste i dwie szóste to pięć szóstych. Połówki i trzecie trzeba najpierw pociąć na równe kawałki — na szóste. Najmniejszy taki wspólny mianownik to NWW mianowników.','Wynik często da się zapisać prościej: 4/12 to 1/3. Skracasz, dzieląc licznik i mianownik przez NWD. Dziś NWD i NWW z poprzednich lekcji zaczynają pracować w kuchni, w sklepie i w warsztacie.']},
   ...note(4,'Hak: zapytaj, kto ma rację — kolega (2/5) czy mama (prawie szklanka). Głosowanie ręką, bez rozstrzygania — rozstrzygnie symulator w etapie 3. Potem dwa pytania powtórkowe z lekcji o nwd i nww w Pythonie, samodzielnie.','Czy 2/5 szklanki to więcej czy mniej niż 1/2 szklanki?','Mniej: 2/5 = 0,4, a 1/2 = 0,5. Po dodaniu wody płynu nie może być mniej niż samo mleko — więc 2/5 to absurd.','Dodawanie liczników i mianowników osobno; przekonanie, że ułamek z większymi liczbami jest „większy” (2/5 > 1/2).','Zapytaj, gdzie w pracy liczą ułamki: kucharz (porcje), fryzjer (proporcje farby), mechanik (mieszanka paliwa).'),
   activities:[
    choice('nf-r1','Powtórka z Pythona: co zwraca nwd(18, 24)?',['6','2','3','72'],[0],'(18, 24) → (24, 18) → (18, 6) → (6, 0): NWD = 6. Dziś to liczba, przez którą skrócisz 18/24.','Największa liczba, która dzieli i 18, i 24.'),
    choice('nf-r2','Powtórka: nww(4, 6) = 4 · 6 // nwd(4, 6) = ?',['12','24','2','10'],[0],'24 // 2 = 12. Dziś NWW mianowników to wspólny mianownik: czwarte i szóste tniesz na dwunaste.','nwd(4, 6) = 2.')
   ]},
  {id:'simplify',label:'Skracanie',title:'Skracanie przez NWD: jeden krok zamiast kilku',grouping:'solo',
   intro:'Skracanie nie zmienia wartości ułamka — tylko zapis. Podziel licznik i mianownik przez NWD, a od razu dostaniesz najprostszą postać. Pasek pokaże, że to ta sama część całości.',
   reading:{title:'Przez NWD — od razu do końca',paragraphs:['18/24 możesz skracać po kawałku: przez 2 (9/12), potem przez 3 (3/4). Przez NWD(18, 24) = 6 robisz to w jednym kroku. Jeśli skrócisz przez wspólny dzielnik mniejszy od NWD, trzeba będzie skracać jeszcze raz.','Ułamek jest nieskracalny, gdy NWD licznika i mianownika wynosi 1, np. 3/4 albo 2/5.'],example:{question:'Przykład rozwiązany: skróć 12/18.',answer:'NWD(12, 18) = 6. Licznik: 12 : 6 = 2. Mianownik: 18 : 6 = 3. 12/18 = 2/3 — w jednym kroku.'}},
   ...note(7,'Samodzielnie. Pierwsze zadanie prowadzi małymi krokami (przykład rozwiązany), kolejne są takie same w budowie — uczeń widzi wzór. Jeśli ktoś wpisze w NWD wspólny dzielnik mniejszy (2 dla 18 i 24), symulator wyjaśni, dlaczego to nie NWD.','Dlaczego 45 minut to 3/4 godziny?','45/60, NWD = 15, 45 : 15 = 3, 60 : 15 = 4. Trzy kwadranse.','Dzielenie tylko licznika albo tylko mianownika; skracanie przez różne liczby na górze i na dole.','Jaka część doby to Twój sen (np. 8/24)? Skróć.'),
   activities:[lab('simplify','nf-simplify','Laboratorium ułamków · skracanie przez NWD')]},
  {id:'addsub',label:'Dodawanie',title:'Dodawanie i odejmowanie: wspólny mianownik przez NWW',grouping:'solo',
   intro:'Cztery kroki algorytmu: NWW mianowników → rozszerz pierwszy ułamek → rozszerz drugi → dodaj (odejmij) liczniki i skróć. Paski pokażą kawałki tej samej wielkości. Spróbuj wpisać 2/5 przy naleśnikach — zobaczysz, co się stanie.',
   reading:{title:'Algorytm dodawania ułamków',paragraphs:['1) m = NWW(b, d). 2) a/b = (a · m/b)/m. 3) c/d = (c · m/d)/m. 4) Dodaj liczniki, mianownik zostaje m, na końcu skróć przez NWD. Przy odejmowaniu zamiast dodawać — odejmujesz liczniki.','Możesz wziąć za wspólny mianownik zwykły iloczyn b · d (2 · 3 = 6, ale 4 · 12 = 48) — wynik będzie dobry, tylko liczby większe i więcej skracania. NWW daje najmniejsze liczby.'],example:{question:'Przykład rozwiązany: 1/6 + 1/4.',answer:'NWW(6, 4) = 12. 1/6 = 2/12, 1/4 = 3/12. 2/12 + 3/12 = 5/12 (nieskracalny, NWD(5, 12) = 1).'}},
   ...note(12,'Najważniejszy etap. Na start 1 minuta: wróć do sporu z haka (2/5 czy prawie szklanka). Uczniowie robią zadanie 1 — kto wpisze 2/5, zobaczy pasek krótszy od samego mleka. Zapytaj klasę: kto się na to złapał? (bez oceniania). Zadanie 3 (trening) wymaga skrócenia wyniku 4/12.','Dlaczego wspólny mianownik dla 1/4 i 1/12 to 12, a nie 48?','Bo 12 dzieli się i przez 4, i przez 12 — to NWW. 48 też zadziała, ale potem trzeba skracać 16/48.','1/2 + 1/3 = 2/5; rozszerzanie tylko mianownika (1/2 = 1/6); zapominanie o skróceniu wyniku.','Policz: 1/2 + 1/3 + 1/6 (= 1 — pełna szklanka).'),
   activities:[lab('addsub','nf-addsub','Laboratorium ułamków · dodawanie i odejmowanie')]},
  {id:'mul',label:'Mnożenie',title:'Mnożenie: przepis na więcej osób i rabat na rabat',grouping:'solo',
   intro:'Przy mnożeniu nie szukasz wspólnego mianownika: licznik razy licznik, mianownik razy mianownik, potem skróć. „Część z czegoś” to też mnożenie — sprawdzisz, czy sklep nie oszukuje przy podwójnym rabacie.',
   reading:{title:'Licznik · licznik, mianownik · mianownik',paragraphs:['2/3 · 3/2 = (2 · 3)/(3 · 2) = 6/6 = 1. Przepis na 4 osoby przeliczasz na 6 osób, mnożąc każdy składnik przez 6/4 = 3/2.','Rabat −1/4 znaczy: płacisz 3/4 ceny. Drugi rabat −1/5 liczy się od nowej ceny: płacisz 4/5 z 3/4, czyli 3/4 · 4/5 = 3/5. Łączny rabat to 2/5 = 40%, a nie 25% + 20% = 45%.']},
   ...note(8,'Samodzielnie. Przy rabacie zapytaj klasę przed liczeniem: „−25% i potem −20% to razem ile?” — większość powie 45%. Symulator pokaże 40%. To realna wiedza konsumencka (promocje „−20% na wszystko, także na przecenione”).','Dlaczego dwa rabaty −25% i −20% to razem 40%, a nie 45%?','Bo drugi rabat liczy się od już obniżonej ceny: płacisz 3/4 · 4/5 = 3/5 ceny.','Szukanie wspólnego mianownika przy mnożeniu; mnożenie „na krzyż” (jak przy porównywaniu).','Przelicz przepis na 2 osoby (mnożysz przez 1/2): ile mąki?'),
   activities:[lab('mul','nf-mul','Laboratorium ułamków · mnożenie')]},
  {id:'mix',label:'Mieszanki',title:'Mieszanki w zawodach: kosiarka, fryzjer, malarz',grouping:'solo',
   intro:'Proporcja 1:50 to nie to samo co 1/50 całości. Policzysz, ile oleju dolać do benzyny, ile utleniacza do farby i ile farby jest w wiadrze malarza.',
   reading:{title:'Proporcja a ułamek całości',paragraphs:['1:50 znaczy: 1 część oleju na 50 części benzyny. Cała mieszanka ma 51 części, więc olej to 1/51 całości. Ilość oleju liczysz od benzyny: 5000 ml : 50 = 100 ml.','Proporcję z przecinkiem zamień na liczby całkowite, mnożąc obie strony: 1 : 1,5 = 2 : 3. Wtedy farba to 2/5 miski, a utleniacz 3/5. Konkretne proporcje zawsze bierzesz z instrukcji producenta — tu to tylko przykłady.']},
   ...note(8,'Samodzielnie, opcjonalnie para porównuje wyniki przed wpisaniem. Kierunki techniczne: mieszanka 1:50 i 1:25 do pił i kosiarek; fryzjerzy: proporcje farby i utleniacza; budowlanka: farby i zaprawy. Podkreśl: liczby z lekcji to przykład, w pracy — instrukcja producenta.','Jaka część mieszanki 1:50 to olej: 1/50 czy 1/51?','1/51 — cała mieszanka ma 1 + 50 = 51 części. 1/50 to stosunek oleju do benzyny.','Mylenie stosunku części (1:50) z ułamkiem całości (1/51); przy farbie liczenie 60 ml jako 1 części.','Ile oleju na 1 litr benzyny przy mieszance 1:25? (40 ml).'),
   activities:[lab('mix','nf-mix','Laboratorium ułamków · mieszanki w zawodach')]},
  {id:'result',label:'Wynik',title:'Twój wynik: ułamki w praktyce',grouping:'solo',
   intro:'Odpowiedz na pytanie końcowe, zaznacz samoocenę i pokaż kartę nauczycielowi. Na następnej lekcji te same kroki zamienisz w kalkulator ułamków w Pythonie.',
   ...note(6,'Pytanie końcowe wraca do haka. Zapowiedz następną lekcję: kalkulator ułamków w Pythonie z nwd i nww.','Dlaczego 1/2 + 1/3 to nie 2/5?','Bo dodajemy kawałki różnej wielkości. Najpierw tniemy na szóste: 3/6 + 2/6 = 5/6. 2/5 jest nawet mniejsze od samego 1/2.','Uczeń zapamiętuje regułę „dodaj górę i dół” z ułamków dziesiętnych/procentów — warto wrócić do pasków.','Policz, jaką część tygodnia (168 h) spędzasz w szkole — i skróć.'),
   activities:[
    choice('nf-exit','Dlaczego 1/2 + 1/3 ≠ 2/5?',['Bo dodajemy kawałki różnej wielkości — trzeba je najpierw pociąć na wspólne szóste: 3/6 + 2/6 = 5/6','Bo 2/5 trzeba jeszcze skrócić','Bo przy dodawaniu mnożymy mianowniki, a liczniki dodajemy: 2/6','Bo ułamków nie da się dodawać'],[0],'Wspólny mianownik = NWW(2, 3) = 6. 2/5 jest mniejsze od samego 1/2 — po dodaniu czegokolwiek dodatniego wynik nie może zmaleć.','Porównaj pasek 2/5 z paskiem 1/2.'),
    {type:'resultCard',id:'result',title:'Ułamki z NWD i NWW — wynik',sources:['nf-r1','nf-r2','nf-simplify','nf-addsub','nf-mul','nf-mix','nf-exit'],badges:[
     {min:0,name:'Naleśnik z grudkami',text:'Ułamki jeszcze się nie mieszają. Wróć do pasków przy dodawaniu — tam widać każdy kawałek.'},
     {min:0.5,name:'Pomocnik szefa kuchni',text:'Skracasz, dodajesz i przeliczasz przepisy. Jeszcze mieszanki bez pomyłki i stanowisko Twoje.'},
     {min:0.85,name:'Mistrz proporcji',text:'Przepis na 6 osób, 100 ml oleju do kosiarki i rabat, który nie oszuka. Ułamki pracują dla Ciebie.'}
    ]}
   ]}
 ],
 exitTicket:'Skracasz ułamki przez NWD, dodajesz i odejmujesz przez wspólny mianownik = NWW, mnożysz licznik przez licznik i mianownik przez mianownik. Umiesz przeliczyć przepis, sprawdzić podwójny rabat i policzyć mieszankę 1:50.'
};
