// Logika ćwiczenia „Krytyk slajdów” (lekcje 75–76): rozpoznawanie błędów na miniaturach slajdów
// i dobór układu slajdu do treści. Czysty JS — bez Reacta i DOM, testowany w Node.
// Miniatury są obrazami SVG (data URL w <img>), bo celowo zły kontrast nie może być tekstem strony.

export const pts=n=>String(n).replace('.',',');

// ---------- katalog problemów ----------
export const issues={
 wall:{label:'Ściana tekstu',short:'Za dużo zdań na jednym slajdzie',notHere:'Tu tekstu jest mało: kilka krótkich haseł. To nie jest ściana tekstu.'},
 small:{label:'Za mała czcionka',short:'Tekst poniżej ok. 24 pt',notHere:'Czcionka jest duża (ok. 28 pt i więcej). Z końca sali da się to przeczytać.'},
 contrast:{label:'Słaby kontrast',short:'Tekst zlewa się z tłem',notHere:'Ciemny tekst na jasnym tle: kontrast jest dobry.'},
 anim:{label:'Za dużo animacji',short:'Efekty odciągają uwagę',notHere:'Okienko animacji jest puste albo ma jeden prosty efekt — to w porządku.'},
 watermark:{label:'Zdjęcie ze znakiem wodnym',short:'Podgląd płatnego zdjęcia, brak licencji',notHere:'Na grafice nie ma napisów fotobanku ani znaku „podgląd”.'},
 nosource:{label:'Brak źródła grafiki lub danych',short:'Nie wiadomo, kto jest autorem',notHere:'Pod grafiką jest pełny podpis: autor, źródło i licencja (albo informacja, że to własna grafika).'},
 fact:{label:'Błąd w faktach',short:'Data lub fakt niezgodny ze źródłem',notHere:'Daty i fakty na tym slajdzie zgadzają się z teczką faktów.'},
 ailabel:{label:'Grafika z AI udaje prawdziwe zdjęcie',short:'Brak oznaczenia AI, fałszywy podpis',notHere:'Grafika jest prawdziwym dziełem z domeny publicznej albo jest uczciwie oznaczona.'},
 ok:{label:'Ten slajd jest w porządku',short:'Nie widzę błędów',notHere:''}
};

// ---------- elementy graficzne SVG ----------
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SANS="'Segoe UI',Arial,sans-serif",SERIF="Georgia,'Times New Roman',serif",COMIC="'Comic Sans MS','Comic Neue',cursive";
function lines(arr,{x=60,y=150,size=28,color='#1d2433',font=SANS,gap=1.35,bullet=false,weight=400,anchor='start'}={}){
 return arr.map((t,i)=>`<text x="${x}" y="${y+i*size*gap}" font-family="${esc(font)}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${bullet?'• ':''}${esc(t)}</text>`).join('');
}
function desk(x,y,w,h){
 // Uproszczona ilustracja biurka (ta sama scena co w pliku PowerPointa).
 const sx=w/1200,sy=h/800,s=sx,X=v=>x+v*sx,Y=v=>y+v*sy;
 const r=(a,b,c,d,f)=>`<rect x="${X(a)}" y="${Y(b)}" width="${(c-a)*sx}" height="${(d-b)*sy}" fill="${f}"/>`;
 return `<g>${r(0,0,1200,520,'#dbe5ef')}${r(760,70,1110,380,'#7890aa')}${r(775,85,1095,365,'#a9d1f2')}<circle cx="${X(1020)}" cy="${Y(160)}" r="${38*s}" fill="#ffd666"/>`+
  `${r(90,110,330,300,'#ffffff')}${r(115,140,170,195,'#ffc857')}${r(187,140,242,195,'#82cdaa')}${r(259,140,314,195,'#f7a0a0')}`+
  `${r(0,520,1200,800,'#b08056')}${r(410,250,790,520,'#2c3240')}${r(430,270,770,500,'#246ebe')}${r(455,300,650,318,'#ffffff')}${r(455,400,560,470,'#ffd666')}${r(580,400,745,470,'#82cdaa')}`+
  `<polygon points="${X(380)},${Y(520)} ${X(820)},${Y(520)} ${X(860)},${Y(560)} ${X(340)},${Y(560)}" fill="#3c4250"/>`+
  `${r(900,440,990,560,'#e74c3c')}${r(110,470,230,560,'#5c4033')}<circle cx="${X(170)}" cy="${Y(400)}" r="${60*s}" fill="#3d9160"/><circle cx="${X(120)}" cy="${Y(430)}" r="${45*s}" fill="#3d9160"/><circle cx="${X(220)}" cy="${Y(430)}" r="${45*s}" fill="#3d9160"/></g>`;
}
function wm(x,y,w,h){
 const rows=[];for(let i=-2;i<8;i++)rows.push(`<text x="${x-120+(i%2)*90}" y="${y+i*58}" font-family="${SANS}" font-size="30" font-weight="700" fill="#ffffff" fill-opacity=".55" transform="rotate(-25 ${x+w/2} ${y+h/2})">FOTOBANK-X • PODGLĄD • FOTOBANK-X • PODGLĄD</text>`);
 return `<g clip-path="url(#ph)">${rows.join('')}</g><rect x="${x}" y="${y+h-30}" width="${w}" height="30" fill="#1e1e1e"/><text x="${x+14}" y="${y+h-9}" font-family="${SANS}" font-size="17" fill="#eeeeee">FOTOBANK-X • PODGLĄD • KUP LICENCJĘ</text>`;
}
function portrait(x,y,w,h,ai){
 // Szkic portretu: bez twarzy prawdziwej osoby. ai=true — „gładka” grafika z typowymi błędami AI (np. 6 klawiszy czarnych obok siebie).
 const bg=ai?'#2b2f55':'#d9cdb8';
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/><circle cx="${x+w/2}" cy="${y+h*.36}" r="${w*.17}" fill="${ai?'#f1c9a8':'#a08f78'}"/>`+
  `<path d="M${x+w*.18} ${y+h} Q${x+w/2} ${y+h*.48} ${x+w*.82} ${y+h} Z" fill="${ai?'#121530':'#5a4e40'}"/>`+
  (ai?`<rect x="${x+w*.08}" y="${y+h*.82}" width="${w*.84}" height="${h*.1}" fill="#fff"/>${[0,1,2,3,4,5].map(i=>`<rect x="${x+w*(.12+i*.12)}" y="${y+h*.82}" width="${w*.07}" height="${h*.06}" fill="#111"/>`).join('')}<text x="${x+w/2}" y="${y+h*.12}" font-family="${SANS}" font-size="15" fill="#e8e3ff" text-anchor="middle">CHOPN 1835</text>`:'');
}
function bars(x,y,w,h,vals,labels){
 const max=Math.max(...vals),bw=w/vals.length*.6;
 return `<line x1="${x}" y1="${y+h}" x2="${x+w}" y2="${y+h}" stroke="#55606e" stroke-width="2"/>`+vals.map((v,i)=>{const bh=v/max*(h-30),bx=x+i*w/vals.length+(w/vals.length-bw)/2;return `<rect x="${bx}" y="${y+h-bh}" width="${bw}" height="${bh}" fill="#2f6fdb"/><text x="${bx+bw/2}" y="${y+h-bh-8}" font-family="${SANS}" font-size="22" fill="#1d2433" text-anchor="middle">${v}</text><text x="${bx+bw/2}" y="${y+h+26}" font-family="${SANS}" font-size="20" fill="#1d2433" text-anchor="middle">${esc(labels[i])}</text>`;}).join('');
}
function lock(x,y){return `<rect x="${x}" y="${y+40}" width="110" height="90" rx="12" fill="#1f4fa3"/><path d="M${x+22} ${y+40} V${y+22} a33 33 0 0 1 66 0 V${y+40}" fill="none" stroke="#1f4fa3" stroke-width="14"/><circle cx="${x+55}" cy="${y+82}" r="12" fill="#fff"/>`;}
function qr(x,y,s){
 // Wzór przypominający kod QR (dekoracja, nie prawdziwy kod).
 let out=`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff"/>`;const c=s/11;
 const on=(i,j)=>((i*7+j*3+i*j)%5<2)||(i<3&&j<3)||(i>7&&j<3)||(i<3&&j>7);
 for(let i=0;i<11;i++)for(let j=0;j<11;j++)if(on(i,j))out+=`<rect x="${x+i*c}" y="${y+j*c}" width="${c}" height="${c}" fill="#111"/>`;
 return out;
}

// ---------- zestawy slajdów ----------
// el: lista funkcji rysujących; issues: poprawny zestaw problemów ([] = slajd dobry).
export const sets={
 basics:{
  title:'Pięć slajdów z prawdziwych prezentacji szkolnych (odtworzonych, dane fikcyjne)',
  offer:['wall','small','contrast','anim','watermark','nosource','ok'],
  slides:[
   {id:'wifi',name:'Slajd A',bg:'#ffffff',
    draw:()=>lines(['Jak działa Wi-Fi w naszej szkole'],{y:62,size:30,weight:700})+lines([
     'Sieć Wi-Fi w szkole działa dzięki punktom dostępowym, które są zamontowane na korytarzach',
     'i w salach. Każdy punkt dostępowy jest podłączony kablem do przełącznika w serwerowni,',
     'a przełącznik łączy się z routerem, który ma dostęp do internetu od dostawcy. Uczniowie',
     'logują się do sieci uczniowskiej, a nauczyciele do sieci nauczycielskiej, która jest',
     'oddzielona od sieci uczniów. Hasło do sieci zmienia się co miesiąc i podaje je',
     'wychowawca. Nie wolno udostępniać hasła osobom spoza szkoły. W sieci szkolnej działa',
     'filtr stron, który blokuje strony z grami i niebezpieczne strony. Jeśli sieć nie działa,',
     'trzeba zgłosić to w sekretariacie albo nauczycielowi informatyki, podając numer sali.',
     'Prędkość sieci zależy od liczby osób połączonych w tym samym czasie z punktem dostępowym.',
     'Dlatego na przerwie internet może działać wolniej niż w czasie lekcji. Warto pobierać',
     'duże pliki w domu, a w szkole korzystać z sieci tylko do nauki.'],{y:112,size:15,gap:1.5,color:'#333'}),
    issues:['wall','small'],
    alt:'Slajd A: tytuł „Jak działa Wi-Fi w naszej szkole” i pod nim 11 długich linii ciągłego tekstu, czcionka ok. 15 pt.',
    why:{wall:'11 linii pełnych zdań. Słuchacz czyta zamiast słuchać, a Ty nie masz już nic do powiedzenia.',small:'Ok. 15 pt — z trzeciej ławki to szare paski. Treść slajdu: min. ok. 24 pt.'},
    fix:'Zostaw 3 hasła (np. „Punkty dostępowe → przełącznik → router”, „Dwie sieci: uczniowie / nauczyciele”, „Awaria? Zgłoś numer sali”), resztę przenieś do notatek prelegenta.'},
   {id:'bike',name:'Slajd B',bg:'#ffffff',anim:['Wirowanie: Tytuł 1','Wlatywanie: Symbol zastępczy 2','Odbijanie: Gwiazda 3','Zanikanie: Gwiazda 4','Wymazywanie: Strzałka 5'],
    draw:()=>lines(['Praktyki w serwisie rowerowym „Szprycha”'],{y:70,size:34,weight:700,color:'#f7e463'})+lines(['Naprawa przerzutek i hamulców','Kontakt z klientem przy ladzie','Zamawianie części w hurtowni'],{y:170,size:30,gap:1.6,bullet:true,color:'#f3e88c'})+
     `<polygon points="820,190 838,240 892,240 848,270 865,322 820,292 775,322 792,270 748,240 802,240" fill="#ff2020"/><polygon points="840,350 853,385 890,385 860,407 872,442 840,421 808,442 820,407 790,385 827,385" fill="#18b050"/>`+
     `<text x="60" y="470" font-family="${SANS}" font-size="16" fill="#9aa3ad">(firma fikcyjna)</text>`,
    issues:['contrast','anim'],
    alt:'Slajd B: jasnożółty tytuł i jasnożółte punkty na białym tle, dwie kolorowe gwiazdki. Okienko animacji pokazuje 5 efektów.',
    why:{contrast:'Jasnożółty na białym: na projektorze w jasnej sali tekst znika. Wybierz ciemny tekst na jasnym tle albo odwrotnie.',anim:'5 efektów na jednym slajdzie: wirujący tytuł i odbijające się gwiazdki zabierają uwagę słuchacza. Wystarczy 0–1 prosty efekt.'},
    fix:'Animacje → Okienko animacji → zaznacz efekty → Delete. Tekst: Resetuj slajd i kolor z motywu (ciemny na jasnym). Gwiazdki usuń.'},
   {id:'desk',name:'Slajd C',bg:'#ffffff',
    draw:()=>lines(['Moje stanowisko na praktykach'],{y:62,size:32,weight:700})+`<clipPath id="ph"><rect x="120" y="95" width="720" height="400"/></clipPath>`+desk(120,95,720,400)+wm(120,95,720,400),
    issues:['watermark','nosource'],
    alt:'Slajd C: tytuł „Moje stanowisko na praktykach” i duże zdjęcie biurka z laptopem. Na zdjęciu ukośne napisy „FOTOBANK-X • PODGLĄD” i pasek „KUP LICENCJĘ”. Pod zdjęciem brak podpisu.',
    why:{watermark:'Napis „PODGLĄD — KUP LICENCJĘ” oznacza płatne zdjęcie, za które nikt nie zapłacił. Tego nie wolno wstawić do prezentacji.',nosource:'Pod zdjęciem nie ma podpisu: kto jest autorem, skąd jest i na jakiej licencji.'},
    fix:'Usuń zdjęcie. Wstaw własne zdjęcie albo grafikę z domeny publicznej / CC i podpisz ją: tytuł – autor – źródło – licencja.'},
   {id:'pass',name:'Slajd D',bg:'#ffffff',
    draw:()=>lines(['3 zasady silnego hasła'],{y:70,size:38,weight:700})+lines(['Minimum 12 znaków','Inne hasło do każdego konta','Włącz logowanie dwuetapowe'],{y:180,size:32,gap:1.7,bullet:true})+lock(760,170)+
     lines(['Ikona: własny rysunek autora prezentacji'],{x:60,y:500,size:16,color:'#4a5563'}),
    issues:[],
    alt:'Slajd D: ciemny tytuł „3 zasady silnego hasła”, trzy krótkie punkty ok. 32 pt na białym tle, niebieska ikona kłódki i podpis „Ikona: własny rysunek autora prezentacji”. Brak animacji.',
    why:{},
    fix:'Nic nie zmieniaj. Ten slajd ma jedną myśl, 3 hasła, duży tekst, dobry kontrast i podpisaną grafikę.'},
   {id:'chart',name:'Slajd E',bg:'#ffffff',
    draw:()=>lines(['Ile godzin dziennie spędzamy w sieci?'],{y:62,size:32,weight:700})+bars(120,110,600,320,[2,4,6],['13 lat','15 lat','17 lat'])+
     lines(['Liczba godzin dziennie (średnio)'],{x:120,y:500,size:18,color:'#4a5563'})+lines(['Źródło: internet'],{x:760,y:500,size:18,color:'#4a5563'}),
    issues:['nosource'],
    alt:'Slajd E: tytuł „Ile godzin dziennie spędzamy w sieci?”, czytelny wykres słupkowy z trzema wartościami 2, 4 i 6 godzin, podpis „Źródło: internet”.',
    why:{nosource:'„Źródło: internet” to nie jest źródło. Nie wiadomo, kto zbierał dane i kiedy. Podaj nazwę badania lub strony, autora i rok — albo napisz „dane fikcyjne”.'},
    fix:'Podpis pod wykresem: „Źródło: [nazwa badania], [autor/instytucja], [rok]”. Bez znanego źródła nie pokazuj liczb jako faktów.'}
  ]
 },
 chopin:{
  title:'Szkic prezentacji Kuby (fikcyjny uczeń) — sprawdź, zanim cokolwiek skopiujesz',
  offer:['fact','ailabel','wall','small','nosource','contrast','ok'],
  slides:[
   {id:'title',name:'Slajd 1',bg:'#f7f2e8',
    draw:()=>lines(['Fryderyk Chopin (1810–1894)'],{y:90,size:40,font:SERIF,color:'#1e2a4a'})+portrait(620,140,260,300,true)+lines(['Zdjęcie Chopina z 1835 roku'],{x:600,y:480,size:18,color:'#4a5563'}),
    issues:['fact','ailabel'],
    alt:'Slajd 1: tytuł „Fryderyk Chopin (1810–1894)” i gładka ilustracja postaci przy fortepianie z napisem „CHOPN 1835” i błędnie narysowanymi klawiszami, podpisana „Zdjęcie Chopina z 1835 roku”.',
    why:{fact:'Chopin zmarł w 1849 r., nie w 1894. Sprawdź w teczce faktów — takie przestawienie cyfr zdarza się często.',ailabel:'To nie jest zdjęcie: zniekształcony napis i dziwne klawisze to typowe ślady grafiki z AI. Prawdziwe zdjęcie Chopina powstało dopiero pod koniec jego życia. Grafikę z AI podpisz „Grafika wygenerowana przez AI”, a portret weź z domeny publicznej.'},
    fix:'Popraw datę na 1810–1849. Wstaw portret z domeny publicznej (np. z Wikimedia Commons) z podpisem albo oznacz grafikę z AI i nie udawaj, że to zdjęcie.'},
   {id:'life',name:'Slajd 2',bg:'#f7f2e8',
    draw:()=>lines(['Życie'],{y:70,size:36,font:SERIF,color:'#1e2a4a'})+lines([
     'Fryderyk Chopin urodził się w 1810 roku w Żelazowej Woli koło Sochaczewa. Jego ojciec',
     'Mikołaj był Francuzem, a matka Justyna Polką. Rodzina wkrótce przeprowadziła się do',
     'Warszawy, gdzie ojciec uczył francuskiego. Fryderyk bardzo wcześnie zaczął grać i',
     'komponować, a pierwszy utwór wydano, gdy miał 7 lat. Uczył się w Szkole Głównej Muzyki',
     'u Józefa Elsnera. W 1830 roku wyjechał z Polski i już nigdy do niej nie wrócił. Od 1831',
     'roku mieszkał w Paryżu, gdzie uczył gry na fortepianie i występował w salonach.',
     'Zmarł w Paryżu w 1849 roku. Jego serce przewieziono do Warszawy.'],{y:120,size:16,gap:1.55,color:'#2a2f3a'}),
    issues:['wall','small'],
    alt:'Slajd 2: tytuł „Życie” i pod nim 7 długich linii ciągłego tekstu biografii, czcionka ok. 16 pt.',
    why:{wall:'Cała biografia w jednym akapicie. Będziesz to czytać na głos, a klasa przeczyta szybciej od Ciebie.',small:'Ok. 16 pt — za mało do sali. Treść slajdu: min. ok. 24 pt.'},
    fix:'Zostaw 3 fakty: „1810 — Żelazowa Wola”, „1830 — wyjazd, od 1831 Paryż”, „1849 — śmierć w Paryżu”. Resztę do notatek prelegenta.'},
   {id:'music',name:'Slajd 3',bg:'#f7f2e8',
    draw:()=>lines(['Posłuchaj 20 sekund'],{y:80,size:38,font:SERIF,color:'#1e2a4a'})+lines(['Nokturn Es-dur op. 9 nr 2','Zeskanuj kod telefonem'],{y:180,size:30,gap:1.6,bullet:true})+qr(650,140,220)+
     lines(['Kod QR: link do nagrania na Wikimedia Commons; licencja podana na stronie pliku'],{x:60,y:470,size:16,color:'#4a5563'}),
    issues:[],
    alt:'Slajd 3: tytuł „Posłuchaj 20 sekund”, dwa krótkie punkty ok. 30 pt, kod QR i podpis: link do nagrania na Wikimedia Commons, licencja podana na stronie pliku.',
    why:{},
    fix:'Nic nie zmieniaj. Link lub kod QR to nie kopia nagrania, a podpis mówi, skąd jest nagranie.'},
   {id:'heart',name:'Slajd 4',bg:'#1e2a4a',
    draw:()=>lines(['Ciekawostka'],{y:80,size:38,font:SERIF,color:'#f7f2e8'})+lines(['Serce Chopina jest w Warszawie,','w kościele Świętego Krzyża'],{y:200,size:34,gap:1.5,color:'#f7f2e8'})+
     lines(['Źródło: Google'],{x:60,y:470,size:18,color:'#c9cfdb'}),
    issues:['nosource'],
    alt:'Slajd 4: jasny tekst na granatowym tle: „Ciekawostka. Serce Chopina jest w Warszawie, w kościele Świętego Krzyża”, podpis „Źródło: Google”.',
    why:{nosource:'Google to wyszukiwarka, nie źródło. Podaj stronę, na której to przeczytałeś (np. instytucji, encyklopedii).'},
    fix:'Podpis: „Źródło: [nazwa strony lub instytucji]”. Fakt jest prawdziwy, ale bez źródła nie da się go sprawdzić.'}
  ]
 }
};

export function slideSvg(slide){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540"><rect width="960" height="540" fill="${slide.bg}"/>${slide.draw()}</svg>`;
}
export const slideDataUrl=slide=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(slideSvg(slide));

// ---------- zaznaczanie i sprawdzanie ----------
export function toggleIssue(sel=[],id){
 if(id==='ok')return sel.includes('ok')?[]:['ok'];
 const s=sel.filter(x=>x!=='ok');
 return s.includes(id)?s.filter(x=>x!==id):[...s,id];
}
export function diagnose(slide,sel=[]){
 const want=slide.issues.length?slide.issues:['ok'];
 const missing=want.filter(i=>!sel.includes(i)),extra=sel.filter(i=>!want.includes(i));
 return {ok:!missing.length&&!extra.length,missing,extra};
}
export function checkSlide(st={},slide){
 if(st.ok)return st;
 const d=diagnose(slide,st.sel||[]);
 return {...st,tries:(st.tries||0)+1,checked:true,...d};
}
export const slidePoints=st=>st?.ok?(st.tries===1?2:1):0;
// Podpowiedź do pierwszego brakującego lub zbędnego problemu.
export function feedbackFor(slide,st){
 if(!st?.checked||st.ok)return [];
 const out=[];
 if(st.missing.includes('ok'))out.push('Ten slajd jest dobry. Odznacz problemy, których nie ma, i wybierz „Ten slajd jest w porządku”.');
 for(const i of st.extra){if(i==='ok')out.push('Na tym slajdzie jest co najmniej jeden błąd. Przyjrzyj się tekstowi, kolorom i grafice.');else out.push(`„${issues[i].label}” — ${slide.fine?.[i]||issues[i].notHere}`);}
 const miss=st.missing.filter(i=>i!=='ok');
 if(miss.length)out.push(`Brakuje jeszcze ${miss.length===1?'jednego problemu':`${miss.length} problemów`}. Podpowiedź: ${hint(miss[0])}`);
 return out;
}
const hints={wall:'policz zdania — ile musiałbyś przeczytać na głos?',small:'czy przeczytasz to z ostatniej ławki?',contrast:'czy tekst wyraźnie odcina się od tła?',anim:'zajrzyj do okienka animacji pod slajdem.',watermark:'przyjrzyj się napisom na samym zdjęciu.',nosource:'czy wiesz, kto jest autorem grafiki lub danych i skąd pochodzą?',fact:'porównaj daty z teczką faktów.',ailabel:'czy to naprawdę może być zdjęcie? Spójrz na napis i klawisze.'};
const hint=i=>hints[i]||'obejrzyj slajd jeszcze raz.';

export function errorsResult(setId,value={}){
 const set=sets[setId],st=value.slides||{};
 const solved=set.slides.filter(s=>st[s.id]?.ok).length,max=set.slides.length*2;
 const score=set.slides.reduce((n,s)=>n+slidePoints(st[s.id]),0);
 const found=set.slides.filter(s=>st[s.id]?.ok).reduce((n,s)=>n+s.issues.length,0),all=set.slides.reduce((n,s)=>n+s.issues.length,0);
 return {score,max,solved,done:solved===set.slides.length,summary:`Zdiagnozowane slajdy: ${solved}/${set.slides.length}; wykryte błędy: ${found}/${all}`};
}

// ---------- dobór układu slajdu ----------
export const layouts=[
 {id:'title',name:'Slajd tytułowy'},
 {id:'obj',name:'Tytuł i zawartość'},
 {id:'twoObj',name:'Dwie zawartości'},
 {id:'comparison',name:'Porównanie'},
 {id:'secHead',name:'Nagłówek sekcji'},
 {id:'picTx',name:'Obraz z podpisem'}
];
export const layoutTasks=[
 {id:'start',text:'Pierwszy slajd: „Praktyki bez stresu” i Twoje imię pod spodem.',answer:'title',why:'Slajd tytułowy ma duży tytuł i podtytuł na środku — dokładnie to, czego potrzebujesz na start.'},
 {id:'firms',text:'Dwie firmy praktyk obok siebie: nad każdą kolumną nazwa firmy, pod nią plusy.',answer:'comparison',why:'Porównanie ma dwie kolumny i nad każdą osobny nagłówek. „Dwie zawartości” nie mają nagłówków kolumn.'},
 {id:'photo',text:'Jedno zdjęcie stanowiska pracy i krótki opis z podpisem źródła.',answer:'picTx',why:'Obraz z podpisem ma duże miejsce na zdjęcie i obok pole na opis oraz źródło.'},
 {id:'part',text:'Przejście do nowej części: „Część 2. Pierwszy dzień”.',answer:'secHead',why:'Nagłówek sekcji oddziela części prezentacji. Słuchacz wie, że zaczyna się nowy temat.'},
 {id:'bring',text:'Trzy krótkie hasła: co zabrać pierwszego dnia.',answer:'obj',why:'Tytuł i zawartość to podstawowy układ na tytuł i kilka punktów.'},
 {id:'two',text:'Dwa zdjęcia obok siebie: stanowisko „przed” i „po” sprzątaniu, bez nagłówków.',answer:'twoObj',why:'Dwie zawartości to dwa równe pola obok siebie — bez osobnych nagłówków nad kolumnami.'}
];
export function chooseLayout(value={},taskId,layoutId){
 const t=layoutTasks.find(x=>x.id===taskId),prev=(value.tasks||{})[taskId]||{};
 if(!t||prev.ok)return value;
 const ok=t.answer===layoutId;
 return {...value,tasks:{...(value.tasks||{}),[taskId]:{choice:layoutId,tries:(prev.tries||0)+1,ok}}};
}
export function layoutResult(value={}){
 const st=value.tasks||{};const max=layoutTasks.length;
 const solved=layoutTasks.filter(t=>st[t.id]?.ok).length;
 const score=layoutTasks.reduce((n,t)=>n+(st[t.id]?.ok?(st[t.id].tries===1?1:0.5):0),0);
 return {score,max,solved,done:solved===max,summary:`Dobrane układy: ${solved}/${max}`};
}
export const layoutFeedback=(taskId,layoutId)=>{
 const t=layoutTasks.find(x=>x.id===taskId),l=layouts.find(x=>x.id===layoutId);
 if(t.answer===layoutId)return t.why;
 const tips={title:'Slajd tytułowy jest tylko na początek prezentacji.',obj:'Tytuł i zawartość ma jedno pole — zastanów się, czy treść nie potrzebuje dwóch kolumn albo miejsca na zdjęcie.',twoObj:'Dwie zawartości nie mają nagłówków nad kolumnami.',comparison:'Porównanie ma nagłówki nad dwiema kolumnami — tu nie są potrzebne.',secHead:'Nagłówek sekcji to tylko przejście między częściami, bez treści.',picTx:'Obraz z podpisem ma jedno miejsce na zdjęcie.'};
 return `„${l.name}” nie pasuje. ${tips[layoutId]}`;
};
