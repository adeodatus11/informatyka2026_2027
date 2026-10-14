// Logika symulatora „Sąd klasowy” (lekcja 39). Czysty JS, bez Reacta.
// Wszystkie osoby i sytuacje są fikcyjne. Przepisy opisane „po ludzku” — bez wysokości kar
// (te nauczyciel sprawdza w aktualnym tekście ustawy, patrz teacherGuide lekcji).

export const verdicts=[
 {id:'legal',label:'Legalne',short:'Prawo na to pozwala'},
 {id:'illegal',label:'Nielegalne',short:'Łamie prawo'},
 {id:'depends',label:'Zależy',short:'Decyduje zgoda, licencja lub regulamin'}
];
export const roles=['Sędzia','Prokurator','Obrońca'];
// Role w trójce przesuwają się z każdą sprawą: osoba 1, 2, 3.
export function rolesFor(index){return [0,1,2].map(p=>roles[(p+index)%3]);}

export const cases=[
 {id:'meme',title:'Mem ze screena',icon:'image',
  story:'Natalia ogląda serial w legalnym serwisie. Robi zrzut ekranu ze sceny, dopisuje śmieszny podpis i wysyła mema na prywatny czat z siostrą i dwiema przyjaciółkami.',
  prosecutor:'Czy Natalia korzysta z cudzego utworu bez zgody twórcy?',
  defense:'Komu pokazała mema: całemu internetowi czy bliskim osobom?',
  verdict:'legal',
  verdictHint:'Sprawdź, komu Natalia pokazała mema. Prawo autorskie pozwala na korzystanie z utworów w gronie bliskich.',
  laws:[
   {text:'Prawo autorskie, art. 23: dozwolony użytek osobisty, czyli korzystanie z rozpowszechnionego utworu w gronie rodziny i znajomych',ok:true},
   {text:'Kodeks karny, art. 267: nielegalny dostęp do informacji',why:'Natalia nigdzie się nie włamała. Ogląda serial legalnie, na własnym koncie.'},
   {text:'Prawo autorskie, art. 81: ochrona wizerunku',why:'Wizerunek to problem przy publikowaniu zdjęcia prywatnej osoby. Tu chodzi o fragment serialu i prywatny czat.'}],
  reasons:[
   {text:'Serial jest już rozpowszechniony, a Natalia dzieli się kadrem tylko z bliskimi, nie z całym internetem.',ok:true},
   {text:'Wszystko, co jest w internecie, jest darmowe i można to wrzucać wszędzie.',why:'Nie. Dozwolony użytek ma granicę: krąg bliskich osób. Publiczny profil z tysiącami obserwujących to już coś innego.'},
   {text:'To legalne, bo to tylko jeden obrazek.',why:'Rozmiar nie decyduje. Liczy się, komu go pokazujesz i czy nie szkodzisz twórcy (art. 35).'}],
  explain:'Dozwolony użytek osobisty (art. 23) obejmuje rodzinę i znajomych. Art. 35 dodaje granicę: nie możesz w ten sposób zastępować twórcy, np. wrzucić do sieci całego odcinka.',
  action:'Memy w prywatnym gronie są w porządku. Na publiczny profil wrzucaj krótki fragment z podanym źródłem albo własny materiał.'},
 {id:'code',title:'Kod z repozytorium',icon:'code',
  story:'Bartek kopiuje funkcję z publicznego repozytorium kodu do swojej gry. Grę chce wrzucić na platformę z grami niezależnymi i dać ją do pobrania za darmo.',
  prosecutor:'Czy ten kod ma autora i czy Bartek ma jego zgodę?',
  defense:'Czy repozytorium ma licencję, która pozwala kopiować kod?',
  verdict:'depends',
  verdictHint:'Publiczne repozytorium nie znaczy „bez praw”, ale nie znaczy też „zakazane”. Od czego to zależy?',
  laws:[
   {text:'Prawo autorskie, art. 74 i 77: program jest utworem, nie ma do niego dozwolonego użytku osobistego, a o tym, co wolno, decyduje licencja',ok:true},
   {text:'Kodeks karny, art. 269b: narzędzia do włamań i cudze hasła',why:'Funkcja do gry nie jest narzędziem do włamań. Ten przepis tu nie pasuje.'},
   {text:'Żaden: kod z internetu jest wspólny',why:'Kod ma autora. Sprawdź plik LICENSE w repozytorium, bo to on mówi, co wolno.'}],
  reasons:[
   {text:'Zależy od licencji. Np. MIT pozwala kopiować, jeśli zostawisz informację o autorze. Bez licencji nie wolno, a podpisanie się jako autor to plagiat.',ok:true},
   {text:'Zawsze legalne, bo repozytorium jest publiczne.',why:'Publiczne znaczy tylko, że każdy może je zobaczyć. Do kopiowania potrzebna jest licencja.'},
   {text:'Zawsze nielegalne, bo z cudzego kodu nie wolno korzystać.',why:'Open source istnieje po to, żeby z niego korzystać, ale na warunkach licencji.'}],
  explain:'Program komputerowy chroni się jak utwór (art. 74), a dozwolonego użytku osobistego nie stosuje się do programów (art. 77). Dlatego decyduje licencja autora.',
  action:'Zajrzyj do pliku LICENSE. W kodzie zostaw komentarz z autorem i linkiem. W pracy na ocenę zaznacz, który fragment jest cudzy.'},
 {id:'photo',title:'Zdjęcie z wycieczki',icon:'camera',
  story:'Ola wrzuca na swój publiczny profil zdjęcie Kuby, który śpi w autobusie z otwartymi ustami. Podpis: „nasz śpiący królewicz 😂”. Kuba prosi o usunięcie, a Ola odpisuje: „wyluzuj, to żart”.',
  prosecutor:'Czy Kuba zgodził się, żeby jego twarz trafiła do internetu?',
  defense:'Czy Kuba jest tylko przypadkową osobą w tłumie, czy głównym tematem zdjęcia?',
  verdict:'illegal',
  verdictHint:'Kuba nie wyraził zgody i prosi o usunięcie. Kto decyduje o publikacji jego wizerunku?',
  laws:[
   {text:'Prawo autorskie, art. 81: rozpowszechnianie czyjegoś wizerunku wymaga jego zgody',ok:true},
   {text:'Prawo autorskie, art. 23: dozwolony użytek osobisty',why:'Dozwolony użytek dotyczy korzystania z utworów w gronie bliskich, a nie publikowania cudzej twarzy na publicznym profilu.'},
   {text:'Kodeks karny, art. 287: oszustwo komputerowe',why:'Nikt tu nie wyłudza pieniędzy ani nie zmienia danych w systemie.'}],
  reasons:[
   {text:'Kuba jest głównym tematem zdjęcia, nie przypadkową osobą w tłumie, i nie zgodził się na publikację.',ok:true},
   {text:'Zdjęcie zrobiła Ola, więc może z nim robić, co chce.',why:'Ola jest autorką zdjęcia, ale wizerunek należy do Kuby. Bez jego zgody nie może go publikować.'},
   {text:'To nielegalne dopiero wtedy, gdy zdjęcie ma ponad 100 polubień.',why:'Liczba polubień nie ma znaczenia. Liczy się brak zgody Kuby.'}],
  explain:'Wizerunek możesz rozpowszechniać tylko za zgodą osoby na zdjęciu (art. 81). Wyjątki to m.in. osoba jako szczegół tłumu albo osoba publiczna przy pełnieniu funkcji. Wizerunek to również dane osobowe chronione przez RODO.',
  action:'Gdy ktoś prosi o usunięcie, usuń. Kuba może zgłosić zdjęcie w serwisie jako naruszenie prywatności, a gdy ktoś go ośmiesza, porozmawiać z wychowawcą lub pedagogiem.'},
 {id:'diary',title:'„Pożyczone” hasło do dziennika',icon:'lock',
  story:'Michał (16 lat) podejrzał, jak nauczycielka wpisuje hasło do e-dziennika. Wieczorem loguje się na jej konto, żeby zobaczyć oceny z poprawy przed ogłoszeniem. Niczego nie zmienia.',
  prosecutor:'Czy Michał miał prawo wejść na to konto?',
  defense:'Czy to, że niczego nie zmienił, coś zmienia?',
  verdict:'illegal',
  verdictHint:'Do przestępstwa nie trzeba niczego zmieniać. Wystarczy wejść tam, gdzie nie masz uprawnień.',
  laws:[
   {text:'Kodeks karny, art. 267: dostęp do cudzego konta lub systemu bez uprawnienia',ok:true},
   {text:'Kodeks karny, art. 268a: niszczenie lub zmiana cudzych danych',why:'Ten przepis zadziałałby, gdyby Michał zmienił albo skasował oceny. Tu wystarczy samo wejście na konto.'},
   {text:'Tylko regulamin szkoły, więc najwyżej uwaga',why:'To nie tylko sprawa regulaminu. Wejście na cudze konto bez zgody jest przestępstwem.'}],
  reasons:[
   {text:'Michał nie miał uprawnień do konta. Samo zalogowanie cudzym hasłem jest przestępstwem, nawet jeśli nic nie zmienił.',ok:true},
   {text:'To legalne, bo hasło samo mu się pokazało.',why:'Podejrzane hasło nie daje uprawnień. Decyduje zgoda właściciela konta.'},
   {text:'Nielegalne byłoby dopiero zmienienie ocen.',why:'Zmiana ocen byłaby dodatkowym przestępstwem (art. 268a). Ale już samo wejście łamie art. 267.'}],
  explain:'Art. 267 kk chroni przed wchodzeniem do cudzych kont i systemów bez uprawnienia. Michał ma 16 lat, więc nie trafi do sądu karnego, tylko do sądu rodzinnego jako nieletni.',
  action:'Podejrzałeś hasło? Nie używaj go. Widzisz czyjeś zalogowane konto? Wyloguj je i powiedz właścicielowi.'},
 {id:'premium',title:'Konto premium od kolegi',icon:'play',
  story:'Zuza ogląda seriale na koncie premium Kamila z klasy. Kamil sam dał jej login i hasło. W regulaminie serwisu stoi, że z konta może korzystać tylko jedno gospodarstwo domowe, a Zuza mieszka gdzie indziej.',
  prosecutor:'Czy Zuza łamie zasady, na które zgodził się właściciel konta?',
  defense:'Czy Zuza weszła na konto bez zgody, czy dostała login od właściciela?',
  verdict:'depends',
  verdictHint:'Zuza ma zgodę właściciela konta, więc to nie jest włamanie. Ale co mówi umowa z serwisem?',
  laws:[
   {text:'Regulamin serwisu, czyli umowa klienta z firmą (prawo cywilne, nie kodeks karny)',ok:true},
   {text:'Kodeks karny, art. 267: nielegalny dostęp do konta',why:'Zuza ma zgodę właściciela, więc to nie jest włamanie. Gdyby zgadła hasło, wtedy tak.'},
   {text:'Prawo autorskie, art. 23: dozwolony użytek osobisty',why:'Dostęp do serwisu reguluje umowa z firmą, a nie dozwolony użytek.'}],
  reasons:[
   {text:'Zależy od regulaminu: jeśli zabrania dzielenia konta poza domem, Kamil łamie umowę i serwis może zablokować konto. Przestępstwem to nie jest, bo jest zgoda właściciela.',ok:true},
   {text:'To zawsze przestępstwo i grozi za nie więzienie.',why:'Złamanie regulaminu to sprawa między klientem a firmą: blokada konta albo dopłata, a nie sąd karny.'},
   {text:'To zawsze legalne, bo Kamil płaci.',why:'Płacenie nie znosi regulaminu. Kamil zgodził się na zasady serwisu.'}],
  explain:'Regulamin to umowa. Jego złamanie grozi konsekwencjami od firmy (np. blokadą), a nie karą z kodeksu karnego. Uwaga na tanie „konta premium” z Discorda czy forów: to często przejęte cudze konta. Kupując je, korzystasz z cudzej kradzieży i dajesz oszustowi swoje dane.',
  action:'Dzielenie konta: sprawdź regulamin (często są tańsze plany rodzinne). „Konto premium za 5 zł” od obcych: nie kupuj.'},
 {id:'hate',title:'Hejt pod filmikiem',icon:'warning',
  story:'Pod filmikiem Igi z zawodów tanecznych ktoś z klasy od dwóch tygodni codziennie pisze z fejkowego konta obelgi i „zniknij, wszyscy cię nienawidzą”. Iga boi się iść do szkoły.',
  prosecutor:'Czy komentarze się powtarzają i czy Iga czuje się zagrożona?',
  defense:'Czy to jednorazowa kłótnia, czy uporczywe nękanie?',
  verdict:'illegal',
  verdictHint:'Obelgi są codziennie przez dwa tygodnie, a Iga się boi. Wolność słowa nie obejmuje nękania.',
  laws:[
   {text:'Kodeks karny, art. 190a: uporczywe nękanie (a obelgi to dodatkowo art. 216: znieważenie)',ok:true},
   {text:'Prawo autorskie, art. 81: ochrona wizerunku',why:'Filmik wrzuciła sama Iga. Problemem są komentarze, które ją nękają.'},
   {text:'Wolność słowa, bo każdy może pisać, co chce',why:'Wolność słowa nie obejmuje obrażania i nękania. Za to odpowiada się karnie.'}],
  reasons:[
   {text:'Nękanie jest uporczywe i wywołuje u Igi strach. Fejkowe konto nie daje anonimowości, bo serwis i policja mogą ustalić sprawcę.',ok:true},
   {text:'To legalne, bo konto jest anonimowe.',why:'Anonimowość w sieci jest pozorna. Serwis przechowuje dane logowania, a policja może je uzyskać.'},
   {text:'To nielegalne dopiero wtedy, gdy Iga odpisze.',why:'Odpowiedź Igi nic nie zmienia. Odpowiada ten, kto nęka.'}],
  explain:'Uporczywe nękanie (art. 190a kk) to powtarzające się zachowanie, które wywołuje strach lub poczucie poniżenia. Obelgi to znieważenie (art. 216 kk).',
  action:'Iga robi zrzuty ekranu z datą i linkiem, zgłasza komentarze w serwisie i mówi dorosłemu: wychowawcy, pedagogowi, rodzicowi. Przy groźbach zgłasza sprawę na policję. Bezpłatna pomoc dla młodzieży: telefon zaufania 116 111.'},
 {id:'deepfake',title:'Deepfake kolegi',icon:'video',
  story:'Dawid w aplikacji AI robi film, na którym Kacper „mówi” wulgarne rzeczy o wychowawczyni. Wrzuca go na grupę klasową (28 osób) z podpisem „Kacper odleciał 😂”. Nigdzie nie zaznacza, że to AI.',
  prosecutor:'Czy Kacper naprawdę to powiedział i czy film może mu zaszkodzić?',
  defense:'Czy to, że film zrobiła AI, a Dawid „tylko żartował”, coś zmienia?',
  verdict:'illegal',
  verdictHint:'Kacper nie powiedział tych słów, a 28 osób może w nie uwierzyć. Czyj wizerunek i dobre imię są tu naruszone?',
  laws:[
   {text:'Ochrona wizerunku i dobrego imienia (prawo autorskie, art. 81; kodeks karny, art. 212: zniesławienie)',ok:true},
   {text:'AI Act: wystarczy dopisać „wygenerowane przez AI” i wszystko jest legalne',why:'Oznaczenie AI nie daje prawa do ośmieszania kolegi. Bez jego zgody to nadal naruszenie.'},
   {text:'Prawo autorskie, art. 23: dozwolony użytek osobisty',why:'Grupa klasowa to nie krąg bliskich. Poza tym film nie jest cudzym utworem, tylko fałszywką o prawdziwej osobie.'}],
  reasons:[
   {text:'Kacper nie powiedział tych słów, a film może go ośmieszyć i narobić mu kłopotów w szkole. To narusza jego wizerunek i dobre imię, nawet jeśli film zrobiła AI.',ok:true},
   {text:'To legalne, bo to tylko żart i każdy wie, że to AI.',why:'Nie każdy wie i właśnie dlatego deepfake działa. Żart, który krzywdzi, nadal jest naruszeniem.'},
   {text:'Odpowiada aplikacja AI, a nie Dawid.',why:'Odpowiada ten, kto stworzył film i go rozpowszechnił.'}],
  explain:'Od 2 sierpnia 2026 r. AI Act wymaga, by firmy i osoby korzystające z AI zawodowo wyraźnie oznaczały deepfake’i, a chatbot musi się przedstawić jako bot. Prywatny „żart” Dawida AI Act raczej nie obejmuje, ale i tak narusza prawa Kacpra.',
  action:'Nie przesyłaj dalej. Kacper (lub ktoś z klasy) zgłasza film w aplikacji i mówi wychowawcy. Dawid powinien film usunąć i przeprosić.'}
];

function part(p){return p?.ok?(p.tries===1?1:0.5):0;}
export function caseScore(st){return part(st?.verdict)+part(st?.law)+part(st?.reason);}
export function caseSolved(st){return !!(st?.verdict?.ok&&st?.law?.ok&&st?.reason?.ok);}
export const caseMax=3;

// Kolejne kroki: werdykt → przepis → uzasadnienie. Po trafieniu krok jest zamknięty.
export function chooseVerdict(c,st={},choice){
 if(st.verdict?.ok)return st;
 return {...st,verdict:{choice,tries:(st.verdict?.tries||0)+1,ok:choice===c.verdict}};
}
export function chooseLaw(c,st={},index){
 if(!st.verdict?.ok||st.law?.ok)return st;
 return {...st,law:{choice:index,tries:(st.law?.tries||0)+1,ok:!!c.laws[index]?.ok}};
}
export function chooseReason(c,st={},index){
 if(!st.law?.ok||st.reason?.ok)return st;
 return {...st,reason:{choice:index,tries:(st.reason?.tries||0)+1,ok:!!c.reasons[index]?.ok}};
}
export function verdictFeedback(c,choice){
 if(choice===c.verdict)return 'Trafny werdykt. Teraz prokurator wskazuje przepis.';
 const hints={
  'legal>illegal':'Sąd nie znalazł złamanego przepisu. Sprawdź, czy zachowanie nie mieści się w dozwolonym użytku.',
  'legal>depends':'Tu nie ma żadnego „ale”: wszystkie warunki są spełnione.',
  'illegal>legal':'Prokurator ma mocny argument: ktoś nie dał zgody albo nie miał uprawnień.',
  'illegal>depends':'Tu nie ma okoliczności, która by to usprawiedliwiała.',
  'depends>legal':'Za szybko. Brakuje informacji, która przesądza sprawę: licencji, zgody albo regulaminu.',
  'depends>illegal':'Za szybko. W pewnych warunkach to jest dozwolone. Czego brakuje w aktach?'
 };
 return `${hints[`${c.verdict}>${choice}`]||''} ${c.verdictHint}`.trim();
}

export function courtResult(state={}){
 const cs=state.cases||{};
 const score=cases.reduce((s,c)=>s+caseScore(cs[c.id]),0);
 const solved=cases.filter(c=>caseSolved(cs[c.id])).length;
 const first=cases.filter(c=>cs[c.id]?.verdict?.ok&&cs[c.id].verdict.tries===1).length;
 return {done:solved>=5,score,max:cases.length*caseMax,solved,
  summary:solved?`Sąd klasowy: ${solved}/${cases.length} spraw rozstrzygniętych, ${first} werdyktów trafionych za pierwszym razem`:undefined};
}
