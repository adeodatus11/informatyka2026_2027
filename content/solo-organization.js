// Decyzja nauczyciela: bez naprzemiennego odtwarzania zadania na dwóch komputerach.
// Nadpisania są współdzielone przez cienkie lekcje innych klas, bez zmiany zadań i ID.
const ids=new Set(['08','09','13','14','16','17','32','33','35','36','41','51','52','55','59','62','67','72','76','93','97','112','115','119','121']);
const selfReview='Dla chętnych: wyjaśnij własnymi słowami przyczynę jednego błędu i pokaż korektę na kopii swojej pracy.';
export function organizeSolo(original){
 if(!ids.has(original.id))return original;
 const l=structuredClone(original),id=l.id;
 const stage=name=>l.sections.find(s=>s.id===name);
 const setStage=(name,patch)=>Object.assign(stage(name),patch);
 const act=key=>l.sections.flatMap(s=>s.activities).find(a=>a.id===key);
 l.format.grouping='Praca samodzielna przy własnym komputerze. Każdy wykonuje zadania i sprawdza swój wynik; pomoc nauczyciela nie wymaga czekania na drugą osobę.';
 l.format.methods=l.format.methods.filter(m=>!/kooperacyjne|peer-tutoring/.test(m.url));
 if(!l.format.methods.some(m=>m.url.includes('ocenianie-ksztaltujace')))l.format.methods.push({name:'Ocenianie kształtujące i poprawa',url:'https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html'});
 for(const s of l.sections){if(['pair','trio','group'].includes(s.grouping))s.grouping='solo';if(/wyjaśnij partnerowi/.test(s.optionalExtension||''))s.optionalExtension=selfReview;}
 if(id==='08'){
  l.format.student=l.format.student.replace('boss w parach','samodzielna misja finałowa');
  setStage('boss',{title:'Boss: samodzielna misja',intro:'Wybierz jedną z dwóch misji. Zbuduj zapytanie, znajdź wynik i wyjaśnij znaczenie każdego użytego operatora. Druga misja jest rozszerzeniem.',teacherNotes:'Po zaliczeniu wymaganej misji poziomu 2 każdy wybiera własną misję finałową. Uczeń zapisuje zapytanie i uzasadnia operatory. Jeśli nie ma jeszcze dostępu, kończy poprzedni poziom; nie zastępuje tego pracą na komputerze kolegi.',optionalExtension:'Wymyśl własną misję z życia i zapisz zapytanie oraz sposób oceny źródła.'});
  act('boss-explain').question='Zapisz zapytanie, którym pokonałeś bossa, i wyjaśnij znaczenie każdego operatora:';
 }
 if(id==='09'){
  Object.assign(l.format,{name:'Trzy sprawy online — praktyka samodzielna',student:'Samodzielnie przejdziesz trzy sprawy: zdrowie, dojazdy i pieniądze z pracy. Po każdej sprawdź Kartę eksperta, a na końcu odpowiedz na pytania bez podpowiedzi.',teacher:'Krótki pokaz bezpiecznego logowania, następnie samodzielna praca w trzech modułach. Po pierwszej sprawie sprawdź rozumienie jednego kroku. Kolejny etap daje czas na pozostałe moduły i poprawę. Test oraz wynik każdy uzyskuje na swoim komputerze.'});
  l.teacherGuide.preparation='Przygotuj stanowisko dla każdego ucznia. Symulacje korzystają z fikcyjnych danych i nie łączą się z rzeczywistymi e-usługami. Każdy przechodzi moduły A, B i C, korzystając z czasu obu etapów praktyki. Nie przekazuj logowania ani prawdziwych kodów między uczniami.';
  act('l09-time').question='Masz ukończone 18 lat i chcesz zastrzec swój PESEL. Która droga pozwala zrobić to online?';act('l09-time').options[1]='Usługa w mObywatelu lub na gov.pl — bezpłatnie';act('l09-time').explanation='Zastrzeżenie jest dostępne dla osób pełnoletnich. Można zrobić to bezpłatnie online albo w urzędzie; czas zależy od dostępu i przebiegu usługi.';
  stage('expert').reading.paragraphs=stage('expert').reading.paragraphs.map(x=>x.replace('do 26 lat przychody z pracy do 85 528 zł rocznie są zwolnione z PIT (ulga dla młodych). Jeśli pracodawca pobrał zaliczkę, odzyskasz ją w zeznaniu Twój e-PIT — gotowym od 15 lutego, ze zwrotem do 45 dni.','osobom przed 26. urodzinami przysługuje ulga dla młodych dla wskazanych przychodów do 85 528 zł rocznie. Płatnik co do zasady stosuje ją automatycznie. Dane i ulgę trzeba sprawdzić w zeznaniu.'));
  l.teacherGuide.summary+=' Korekta faktów 6.11.2026: zastrzeżenie PESEL dotyczy pełnoletnich; ulga dla młodych co do zasady stosowana przez płatnika, bez ogólnego wymogu oświadczenia. Źródła: podatki.gov.pl/ulgi-i-odliczenia/ulga-dla-mlodych-pit oraz gov.pl/web/cyfryzacja/zastrzez-pesel-i-zabezpiecz-sie-przed-oszustami-nowe-przepisy-od-1-czerwca-br.';
  l.exitTicket='Sprawdzaj prawdziwą domenę usługi. E-recepta: PESEL i kod; nie udostępniaj kodów publicznie. Ulga kolejowa zależy od rodzaju biletu i dokumentu. Sprawdź dane PIT, a po pełnoletności możliwość zastrzeżenia PESEL.';
  act('test-pesel').question='C · Osoba pełnoletnia zastrzega PESEL. Jaki jest cel?';act('test-pesel').options[0]='Ograniczenie ryzyka wybranych wyłudzeń na jej dane';act('test-pesel').explanation='Instytucje sprawdzają status w wymaganych prawem sytuacjach. To ograniczenie ryzyka, nie ochrona przed wszystkimi oszustwami.';
  act('test-pit0').question='C · Przykładowa osoba ma 20 lat i prawo do ulgi dla młodych. Płatnik omyłkowo pobrał 150 zł zaliczki. Co powinna sprawdzić?';act('test-pit0').options[1]='Dane, ulgę i nadpłatę w zeznaniu Twój e-PIT';act('test-pit0').explanation='Ulga jest co do zasady uwzględniana przez płatnika i w Twój e-PIT na podstawie przekazanych danych. Trzeba sprawdzić poprawność zeznania. Kwota jest przykładem ćwiczeniowym.';
  stage('result').expectedAnswers='Uczeń wybiera sprawę odpowiednią do swojego wieku; zastrzeżenie PESEL dotyczy pełnoletnich, a zeznanie osoby niepełnoletniej może wymagać wsparcia opiekuna.';
  stage('start').teacherNotes='Przypomnij bezpieczne wyszukiwanie. Każdy będzie samodzielnie ćwiczyć trzy różne sprawy online. Nie wymagaj podawania prawdziwych danych.';
  Object.assign(act('es-expert'),{requireAll:true,points:12,label:'Trzy sprawy wykonane samodzielnie'});
  setStage('expert',{title:'Załatw pierwszą sprawę',intro:'Wybierz moduł A — Zdrowie, B — Dojazdy lub C — Pieniądze. Przejdź wszystkie kroki pierwszej sprawy i sprawdź Kartę eksperta. Pozostałe dwie wykonasz w następnym etapie.',teacherNotes:'Każdy wykonuje jeden pełny moduł i zapisuje trzy najważniejsze kroki. Pomóż osobom, które utknęły; nie skracaj zadania do zgadywania odpowiedzi.',optionalExtension:'Zacznij drugą sprawę, jeśli masz już pełny wynik pierwszej.'});
  Object.assign(stage('expert'),{title:'Trzy sprawy — pełna praktyka',duration:18,intro:'Samodzielnie przejdź moduły A — Zdrowie, B — Dojazdy i C — Pieniądze. Po każdym sprawdź Kartę eksperta. Zakończenie etapu wymaga wszystkich trzech spraw.',teacherNotes:'Przeznacz około sześciu minut na każdą sprawę. Każdy przechodzi pełne trzy moduły na swoim komputerze; wspieraj pytaniem o konkretny krok. Zapisane wyniki modułów pozwalają sprawdzić komplet.',optionalExtension:'Wyjaśnij z pamięci krok, który początkowo sprawiał najwięcej trudności.'});
  setStage('teach',{label:'Zastosuj',title:'Pozostałe sprawy i samokontrola',intro:'Wróć do symulatora w etapie Ekspert i wykonaj pozostałe dwa moduły. Następnie odpowiedz sobie na pytania o wszystkie trzy sprawy.',reading:{title:'Trzy sprawy bez przekazywania komputera',paragraphs:['Każdą sprawę przechodzisz samodzielnie na swoim komputerze. Zakładki symulatora zachowują postęp podczas tej lekcji. Po module przeczytaj kartę i wyjaśnij najważniejszy krok własnymi słowami.','Przeczytaj pytania poniżej. Jeśli nie umiesz odpowiedzieć, wróć do odpowiedniej sprawy i popraw lukę przed testem.'],example:{question:'Co zrobić, gdy nie pamiętam ulgi?',answer:'Sprawdź moduł Dojazdy, odróżnij rodzaj biletu i dokument uprawniający do ulgi. Potem oblicz cenę jeszcze raz.'}},teacherNotes:'Daj czas na dwa pozostałe moduły. Każdy odpowiada na pytania z trzech kart. Jeśli wielu uczniów myli ten sam krok, pokaż go ponownie i daj krótką samodzielną próbę.',askStudents:'Który krok sprawdziłeś ponownie i jak upewniłeś się, że go rozumiesz?',expectedAnswers:'Uczeń wskazuje konkretny krok w jednej z trzech spraw oraz jego kontrolę.',commonMistakes:'Uczeń kończy tylko jeden moduł. Sprawdź postęp wszystkich trzech przed samooceną.',optionalExtension:'Zapisz własne pytanie sprawdzające do najtrudniejszej sprawy.'});
  Object.assign(act('teach-check'),{items:['Wykonałem moduł Zdrowie','Wykonałem moduł Dojazdy','Wykonałem moduł Pieniądze i praca','Odpowiedziałem na pytania i poprawiłem jedną lukę'],explanation:'To samokontrola. Zaznaczenia nie zastępują wykonania spraw w symulatorze.'});
  Object.assign(stage('teach'),{duration:3,intro:'Sprawdź trzy karty z wykonanych spraw. Odpowiedz na pytania poniżej i wróć do jednego kroku, który wymaga wyjaśnienia.',teacherNotes:'Uczniowie kontrolują trzy wykonane sprawy. Sprawdź jedną najczęstszą pomyłkę i daj krótką poprawkę przed testem.'});
  stage('teach').reading.paragraphs[0]='W poprzednim etapie samodzielnie przechodzisz trzy sprawy. Teraz wróć do ich kart i wyjaśnij po jednym najważniejszym kroku bez czytania odpowiedzi.';
  act('teach-questions').cards.forEach((c,i)=>c.title=['Zdrowie — sprawdź się','Dojazdy — sprawdź się','Pieniądze — sprawdź się'][i]);
  stage('test').intro='Sześć pytań: po dwa z każdej sprawy. Odpowiedz samodzielnie bez podglądania kart. Błąd wykorzystaj jako wskazówkę do poprawy.';
  stage('test').teacherNotes='Każdy odpowiada samodzielnie. Po teście wróć do pytania z największą liczbą błędów i pokaż uzasadnienie.';
  stage('test').expectedAnswers='Z wykonania modułu, Karty eksperta i własnego sprawdzenia decyzji.';
  stage('result').teacherNotes='Uczeń pokazuje wynik oraz wskazuje jedną sprawę, którą potrafi przejść samodzielnie. Omów jeden najczęstszy błąd.';
 }
 if(['13','97'].includes(id)){
  l.format.name='Samodzielny escape room';l.format.student='Poznasz zapis szesnastkowy, rozwiążesz zadania na bitach i otworzysz cztery kłódki serwerowni. Każdą odpowiedź sprawdzasz na swoim urządzeniu.';
  l.format.teacher='Pokaż jeden przykład konwersji. Uczniowie wykonują zadania i samodzielnie otwierają kłódki; po błędzie korzystają ze wskazówki i poprawiają wynik. Szybsi przechodzą do zadania z kolorem. Omów sposób sprawdzenia odpowiedzi.';
  stage('escape').intro='Samodzielnie otwórz cztery kłódki. Kolejna odblokowuje się po poprzedniej. Przed wpisaniem kodu sprawdź obliczenie na kartce.';
  stage('escape').teacherNotes='Każdy wykonuje pełną grę na własnym urządzeniu. Jeśli uczeń utknie, zapytaj o wagę cyfry i sposób sprawdzenia kodu; nie odsyłaj go do wyniku sąsiada.';
  stage('escape').optionalExtension='Zapisz wybrane słowo bez polskich znaków jako bajty ASCII i sprawdź odkodowanie.';
 }
 if(id==='14'){
  l.format.name='Samodzielna obsługa zgłoszeń';l.format.student='Poznasz szkolną sieć i obsłużysz sześć zgłoszeń: wybierzesz pytania, sprawdzisz odpowiedzi i zaproponujesz rozwiązanie.';
  l.format.teacher='Krótki pokaz mapy sieci, następnie każdy sam analizuje awarie i zamyka wszystkie sześć zgłoszeń. Odpowiedzi zgłaszającego podaje symulator po zatwierdzeniu pytań. Po błędzie uczeń poprawia diagnozę. Omów granice uprawnień technika.';
  setStage('helpdesk',{intro:'Jesteś technikiem. Wybierz maksymalnie trzy pytania, przeczytaj odpowiedzi symulatora, zaproponuj rozwiązanie i wyjaśnij je zgłaszającemu. Samodzielnie zamknij wszystkie sześć spraw.',teacherNotes:'Każdy pracuje we własnej kolejce i wykonuje wszystkie zadania. Symulator pokazuje odpowiedzi zgłaszającego, więc nie ma drugiej roli ani oczekiwania na sąsiada. Pytaj o uzasadnienie diagnozy.'});
  for(const a of stage('helpdesk').activities)if(a.type==='helpdesk')a.soloOnly=true;
 }
 if(['16','51'].includes(id)){
  l.format.name='Szyfruj i rozwiązuj — samodzielne laboratorium';l.format.student='Poznasz dwa szyfry, utworzysz własny szyfrogram i samodzielnie rozwiążesz przygotowaną zagadkę. Potem sprawdzisz analizę częstości.';
  l.format.teacher='Pokaż przesunięcie na tarczy i odwracalność podstawienia. Każdy wykonuje zadania, tworzy własny szyfrogram i rozwiązuje niezależną zagadkę z nieznanym kluczem. Czas jest informacją pomocniczą. Na końcu omów ograniczenia szyfru podstawieniowego.';
  setStage('duel',{title:'Twój szyfrogram i niezależna zagadka',intro:'Najpierw przygotuj własną wiadomość w zakładce Szyfrant. Potem przejdź do Zagadki i złam gotowy szyfrogram bez znajomości klucza.',teacherNotes:'Każdy wykonuje obie części u siebie. Do zagadki nie przenosi własnej wiadomości: rozwiązuje przygotowany przypadek z nieznanym kluczem. Po błędzie poprawia rozwiązanie samodzielnie.',commonMistakes:'Literówka w odczytanej wiadomości uniemożliwia zatwierdzenie. Porównaj długość i kolejne słowa z wynikiem dobranego klucza.'});
  for(const a of stage('duel').activities)if(a.type==='cipherLab')a.soloOnly=true;
 }
 if(['17','52'].includes(id)){
  l.format.student='Samodzielnie przewidujesz i uruchamiasz programy, układasz funkcję i piszesz szyfrownik. Testy pomagają znaleźć i poprawić błąd.';
  l.format.teacher='Pokaż jedną decyzję w kodzie, potem każdy wykonuje program na swoim komputerze. Po nieudanym teście uczeń najpierw odczytuje przypadek i wynik, następnie poprawia kod. Zapytaj o uzasadnienie jednej linii; bez przekazywania zadania drugiej osobie.';
  for(const s of l.sections){if(/kierowca|nawigator|ról w parach/i.test(s.teacherNotes))s.teacherNotes='Uczniowie pracują samodzielnie. Po błędzie odczytują test i przewidują poprawny wynik. Nauczyciel pyta o znaczenie jednej linii zamiast podawać cały program.';s.intro=s.intro.replace(/Zamiana ról w parze\. /g,'').replace(/Praca samodzielna w parach z zamienionymi rolami\./g,'Praca samodzielna.').replace(/Znowu zamiana ról\. Pierwsza para, która poda hasło,/g,'Pierwsza osoba, która poda hasło,');}
 }
 if(['32','33'].includes(id)){
  l.format.student='Pracujesz na własnym dokumencie. Sprawdzasz go według karty wymagań, zapisujesz konkretną uwagę i przygotowujesz poprawioną wersję.';
  l.format.teacher='Pokaż jedną kontrolę na przykładzie. Każdy wykonuje własny dokument, sprawdza go według wymagań i zapisuje wskazówkę do poprawy. Nauczyciel może dać jedną uwagę; uczeń sam wprowadza zmianę i pokazuje obie wersje.';
  if(id==='32'){
   setStage('feedback',{intro:'Przez pierwsze cztery minuty sprawdź dokument z kartą ustaleń i kryteriami. Zapisz jedno spełnione kryterium oraz jedną potrzebną poprawkę. Przez pozostałe dziewięć minut popraw dokument i przygotuj kopię do publikacji.'});
   const st=stage('feedback').activities.find(a=>a.type==='wordSteps').steps[0];Object.assign(st,{title:'Własna wskazówka do poprawy',instruction:'Porównaj dokument z kartą ustaleń i sprawdź sens komentarzy. Dopisz komentarz „Po sprawdzeniu poprawię…” ze wskazaniem konkretnego miejsca. Popraw to miejsce przy włączonym śledzeniu i zapisz 32-recenzja.docx.',help:'Jeśli fakty są poprawne, doprecyzuj jedno niejasne zdanie bez zmiany uzgodnionych danych.'});
   const a=stage('check').activities.find(a=>a.type==='text');if(a)a.question='Podaj jedną decyzję Akceptuj/Odrzuć z jej źródłem oraz jedną zmianę po własnej kontroli dokumentu.';
  }else{
   stage('reader').intro='Samodzielnie przetestuj nawigację poradnika: znajdź wskazane informacje przez spisy, sprawdź opisy i popraw jedno utrudnienie.';
   const st=stage('reader').activities.find(a=>a.type==='wordSteps').steps[0];st.instruction='Przejdź do początku poradnika. Znajdź Zasady punktacji przez spis treści (Ctrl+klik), tabelę przez Spis tabel, następnie odczytaj opis wykresu. Zapisz jedno miejsce utrudniające znalezienie informacji i popraw je.';
  }
  for(const s of l.sections){if(/partner|rundy w parze/.test(s.teacherNotes))s.teacherNotes='Uczeń sam sprawdza dokument z listą wymagań, zapisuje jedną uwagę i wprowadza poprawkę. Nauczyciel weryfikuje zmianę w rzeczywistym pliku, nie na podstawie samej checklisty.';}
 }
 if(id==='35'){
  l.materials=l.materials.map(x=>x.replace('kartka do planu strony w parze','kartka do własnego planu strony'));
  const s=stage('hobby');s.teacherNotes='Uczeń zapisuje krótki plan strony: tytuł, rozdział, lista i ilustracja. Potem sam zmienia szablon. Nauczyciel daje jedną wskazówkę do kryterium i czas na poprawę. Szybsi dodają drugi rozdział i pobierają HTML.';
  for(const a of s.activities)if(a.card){a.card.title='Twój plan strony — dwie minuty';a.card.text=a.card.text.replace('odpowiedz na głos (partnerowi albo sobie)','odpowiedz własnymi słowami');}
 }
 if(id==='36'){
  l.format.student='Poznasz znaczniki, naprawisz stronę z błędami, odtworzysz krótki fragment HTML z karty i zbudujesz własną wizytówkę.';
  l.format.teacher='Po pokazie uczeń naprawia stronę. Następnie czyta kartę wzoru, zamyka ją i samodzielnie odtwarza fragment. Porównuje wynik, poprawia błąd i buduje własną wizytówkę według kryteriów.';
  l.materials=l.materials.filter(x=>!x.includes('Pary z sąsiadem'));
  l.teacherGuide.preparation=l.teacherGuide.preparation.replace('Ustal pary do dyktowania.','Przygotuj kartę do samodzielnego odtworzenia kodu.');
  setStage('dyktando',{label:'Odtwórz',title:'HTML z pamięci — sprawdź i popraw',intro:'Przeczytaj kartę z opisem grafiku. Zamknij ją i odtwórz kod na swoim komputerze. Po trzech minutach otwórz kartę, porównaj wynik i popraw brakujące znaczniki.',teacherNotes:'Każdy czyta kartę, zamyka ją i pisze kod z pamięci. Potem porównuje wynik ze wzorem. Po trzech minutach wskaż typowy błąd zamykania znacznika i daj czas na samodzielną poprawę.',askStudents:'Jak sprawdzisz, czy poprawnie zamknąłeś wiersz i komórki tabeli?',expectedAnswers:'Każdy wiersz jest w tr, nagłówki w th, dane w td; porównuję zamknięcia i liczbę komórek z kartą.',commonMistakes:'Uczeń odtwarza same treści bez znaczników lub pomija zamknięcie wiersza. Porównaj kod z opisem.',optionalExtension:'Dodaj trzeci wiersz: Sobota, 10:00, Basen oraz podpis tabeli.'});
  for(const a of stage('dyktando').activities){if(a.html)a.html=a.html.replace('Pisz tutaj to, co dyktuje partner','Odtwórz tutaj kod z karty, a potem sprawdź i popraw');if(a.card){a.card.title='Karta do odtworzenia HTML';a.card.text=a.card.text.replace(/dyktuj[^.]*\./gi,'Przeczytaj fragment, zamknij kartę i odtwórz go samodzielnie.');}}
  const task=stage('dyktando').activities.find(a=>a.type==='htmlLab');task.title='Grafik treningów z karty';task.prompt='Przeczytaj kartę, zamknij ją i odtwórz strukturę. Potem otwórz kartę ponownie i sprawdź treść.';task.card.text=task.card.text.replace('Czytaj powoli i nazywaj znaczniki. Możesz powtarzać, nie pokazuj ekranu.','Przeczytaj opis i nazwij potrzebne znaczniki. Zamknij kartę podczas pisania. Po próbie porównaj wynik z wymaganiami.');task.doneText='Grafik zgodny z kartą — sprawdzenie zakończone.';for(const c of task.checks||[])if(c.hint)c.hint=c.hint.map(x=>x.replace('Poproś dyktującego o powtórzenie wierszy:','Porównaj wiersze z kartą:'));
 }
 if(id==='41')stage('compose').teacherNotes='Uczeń pisze własny e-mail. Po pierwszym sprawdzeniu pokaż najczęstszy błąd i daj czas na poprawę. Kto skończy, czyta swój tekst ponownie z perspektywy adresata i sprawdza, czy wiadomo, kto pisze i o co prosi.';
 if(['55','93'].includes(id))stage('anagram').teacherNotes=stage('anagram').teacherNotes.replace(' — może być w parze (opcjonalnie)',' — wykonywane samodzielnie');
 if(id==='59')stage('audyt').teacherNotes=stage('audyt').teacherNotes.replace(' (opcjonalnie w parze)','');
 if(id==='67')stage('fix').teacherNotes=stage('fix').teacherNotes.replace(/Samodzielnie albo opcjonalnie w parze z kartką \(jedna osoba rozpisuje mecze, druga porównuje z programem\)\./,'Samodzielnie: najpierw rozpisz mecze na kartce, potem porównaj je z programem.');
 if(id==='72'){
  l.format.student='Z danych ze wskazanym źródłem samodzielnie obliczysz wskaźniki, zbudujesz klimatogram i zapiszesz wnioski poparte liczbami.';
  l.format.teacher='Uczeń planuje własny projekt, wykonuje obliczenia i wykres, a następnie kontroluje produkt według kryteriów. Nauczyciel daje jedną uwagę i czas na poprawę. Wnioski wynikają z danych ze wskazanym źródłem.';
  l.curriculum=l.curriculum.replace(', opcjonalnie współpraca w parze','');l.teacherGuide.summary=l.teacherGuide.summary.replace(/ Przy pracy w parze[^.]*\./,'');
  stage('conclude').teacherNotes=stage('conclude').teacherNotes.replace(/ Przy pracy w parze[^.]*\./,'');
 }
 if(id==='76'){const a=stage('rehearse').activities.find(a=>a.type==='checklist');if(a)a.explanation='To Twoja deklaracja. Platforma nie słyszy próby; przeczytaj wystąpienie półgłosem w widoku prezentera i popraw jedną rzecz.';}
 if(['112','115','119','121'].includes(id)){
  const s=stage('improve');s.teacherNotes='Samodzielnie sprawdź wymiary i połączenia według kryteriów. Zapisz jedną potrzebną zmianę, wykonaj poprawkę i porównaj wersje. Nauczyciel może podpowiedzieć pytaniem.';
  for(const a of s.activities)for(const st of a.steps||[])st.instruction=st.instruction.replace(/^W parze pokaż plan[^.]*; solo /,'Samodzielnie ').replace(/^Pokaż partnerowi lub nauczycielowi projekt i wymagania\. Wskażcie jedną zmianę,/,'Porównaj projekt z wymaganiami i wybierz jedną zmianę,').replace(' Bez pary wykonaj kontrolę z listą wymagań.',' Wykonaj kontrolę z listą wymagań.');
  s.reading.paragraphs[0]=s.activities.find(a=>a.steps)?.steps[0].instruction||s.reading.paragraphs[0];
  l.teacherGuide.preparation=l.teacherGuide.preparation.replace(/W parze sąsiad[^.]*\. Solo[^.]*\./,'Uczeń samodzielnie sprawdza model od tyłu oraz wymiary i zapisuje uwagę do poprawy.').replace(/W parze partner[^.]*\./,'Uczeń sam sprawdza kolizje i skalę własnego modelu.').replace('W parze każdy poprawia swój model, wariant solo identyczny.','Każdy samodzielnie poprawia swój model.');
 }
 return l;
}
