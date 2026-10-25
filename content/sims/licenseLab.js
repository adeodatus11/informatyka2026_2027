// licenseLab — czysta logika (bez Reacta i DOM). Lekcja 40: zasady rozpowszechniania programów komputerowych.
// Tryby: 'shelf' (półka licencji: program → rodzaj licencji), 'creator' (zlecenia, stopka, karta licencyjna),
// 'check' (czy użycie cudzego zdjęcia jest zgodne z licencją).
// Fakty o licencjach programów: stan na 2026 r. (strony producentów); warto sprawdzić przed lekcją, bo warunki się zmieniają.

export const pts=n=>String(Math.round(n*10)/10).replace('.',',');
const award=(ok,tries)=>ok?(tries===1?1:0.5):0;

// ---------- 1. Półka licencji ----------
export const categories=[
 {id:'oss',label:'Open source',short:'kod otwarty — GPL, MIT, MPL…',text:'Kod źródłowy jest dostępny. Możesz używać, uczyć się z kodu, zmieniać i rozpowszechniać — na warunkach konkretnej licencji (np. GPL każe udostępnić zmiany na tej samej licencji).'},
 {id:'free',label:'Freeware',short:'za darmo, ale kod zamknięty',text:'Używasz bez płacenia, ale nie zobaczysz kodu i nie wolno go zmieniać ani sprzedawać. Warunki są w licencji — czasem „darmowy tylko do użytku domowego”.'},
 {id:'share',label:'Shareware',short:'najpierw próba, potem zapłata',text:'Możesz wypróbować (np. przez 30–40 dni albo z ograniczeniami). Potem licencja wymaga zakupu.'},
 {id:'eula',label:'Komercyjna (EULA)',short:'płacisz za licencję lub subskrypcję',text:'Kupujesz prawo do używania (licencję), a nie program. Umowa licencyjna użytkownika (EULA) mówi, na ilu urządzeniach i do czego wolno go używać.'},
 {id:'pd',label:'Domena publiczna',short:'bez ograniczeń majątkowych',text:'Twórca zrzekł się praw albo minął czas ochrony (w Polsce zwykle 70 lat od śmierci twórcy). Wolno używać do wszystkiego.'}
];
export const programs=[
 {id:'vlc',name:'VLC',what:'odtwarzacz wideo',cat:'oss',hint:'Wejdź w „Pomoc → O programie”: VLC pokazuje treść licencji GNU GPL. Darmowy to za mało — kod też jest otwarty.',fact:'VLC (organizacja non-profit VideoLAN) działa na licencji GNU GPL. Możesz go używać za darmo także w firmie i zobaczyć jego kod.'},
 {id:'zip',name:'7-Zip',what:'archiwizator',cat:'oss',hint:'Twórca publikuje cały kod źródłowy na licencji GNU LGPL. To coś więcej niż „za darmo”.',fact:'7-Zip to open source (głównie GNU LGPL). Legalnie użyjesz go w domu, w szkole i w firmie — bez kluczy i cracków.'},
 {id:'linux',name:'Linux (jądro)',what:'jądro systemu operacyjnego',cat:'oss',hint:'Każdy może pobrać kod jądra Linux i go zmienić, a poprawki muszą zostać otwarte. Która kategoria?',fact:'Jądro Linux jest na licencji GNU GPL v2. Działa w serwerach, routerach i w każdym Androidzie.'},
 {id:'lo',name:'LibreOffice',what:'pakiet biurowy',cat:'oss',hint:'Rozwija go fundacja The Document Foundation, a kod jest publiczny. Pomyśl o otwartym kodzie, nie tylko o cenie.',fact:'LibreOffice jest open source (licencja MPL 2.0). Darmowa i legalna alternatywa dla płatnego pakietu biurowego.'},
 {id:'ps',name:'Adobe Photoshop',what:'edytor grafiki',cat:'eula',hint:'Photoshop działa w płatnej subskrypcji. Wersja „za darmo z linku” to nie inna licencja, tylko piractwo.',fact:'Photoshop: licencja komercyjna w subskrypcji (warunki Adobe). Kopia z „cracka” to naruszenie licencji i ryzyko złośliwego oprogramowania.'},
 {id:'office',name:'Microsoft Office / 365',what:'pakiet biurowy',cat:'eula',hint:'Za Office płaci się jednorazowo albo w subskrypcji. Szkoła może mieć licencję edukacyjną — ale to nadal licencja komercyjna z warunkami.',fact:'Office to oprogramowanie komercyjne (licencja lub subskrypcja Microsoft). Kod jest zamknięty, a warunki użycia określa umowa licencyjna.'},
 {id:'mc',name:'Minecraft',what:'gra',cat:'eula',hint:'Płacisz za grę, a warunki są w EULA Minecrafta. Kupujesz prawo do grania, nie samą grę.',fact:'Minecraft ma płatną licencję i własną EULA. Zasady Mojang pozwalają m.in. publikować filmy z gry, ale nie wolno rozpowszechniać kopii gry.'},
 {id:'rar',name:'WinRAR',what:'archiwizator',cat:'share',hint:'WinRAR po instalacji liczy dni wersji próbnej, a potem prosi o zakup licencji.',fact:'WinRAR to klasyczny shareware: 40 dni próby, potem licencja wymaga zakupu (program przypomina o tym przy uruchomieniu).'},
 {id:'reader',name:'Adobe Acrobat Reader',what:'czytnik PDF',cat:'free',hint:'Czytnik pobierzesz bezpłatnie, ale kodu nie zobaczysz i nie wolno go przerabiać.',fact:'Acrobat Reader to freeware: bezpłatny, ale zamknięty. Nie wolno go zmieniać ani sprzedawać.'},
 {id:'sqlite',name:'SQLite',what:'baza danych w telefonach',cat:'pd',hint:'Autorzy SQLite zrzekli się praw autorskich do kodu. Każdy może go użyć bez warunków.',fact:'SQLite jest w domenie publicznej. Ta baza danych działa w praktycznie każdym smartfonie i w przeglądarkach.'}
];
export function chooseShelf(state={},programId,catId){
 const p=programs.find(x=>x.id===programId);if(!p)return state;
 const cur=state[programId]||{};if(cur.ok)return state;
 const tries=(cur.tries||0)+1;const ok=catId===p.cat;
 return {...state,[programId]:{choice:catId,tries,ok}};
}
export function shelfResult(value={}){
 const s=value.shelf||{};const solved=programs.filter(p=>s[p.id]?.ok).length;
 const score=programs.reduce((sum,p)=>sum+award(s[p.id]?.ok,s[p.id]?.tries),0);
 return {done:solved===programs.length,score,max:programs.length,solved,summary:`Półka licencji: ${solved}/${programs.length} programów`};
}

// ---------- 2. Kreator licencji ----------
export const questions=[
 {id:'kind',label:'Co wydajecie?',options:[['art','Grafikę, zdjęcie, tekst lub film'],['code','Program, aplikację lub kod']]},
 {id:'audience',label:'Komu dajecie prawa?',options:[['public','Wszystkim — publikujemy w internecie'],['client','Jednemu klientowi, który płaci i chce wyłączności']]},
 {id:'conditions',label:'Czy stawiacie jakiekolwiek warunki?',when:a=>a.kind==='art'&&a.audience==='public',options:[['none','Nie — oddaję bez warunków, nawet bez podpisu'],['some','Tak — przynajmniej podpis autora']]},
 {id:'commercial',label:'Czy inni mogą na tym zarabiać?',when:a=>a.kind==='art'&&a.audience==='public'&&a.conditions==='some',options:[['yes','Tak, także komercyjnie'],['no','Nie — tylko niekomercyjnie']]},
 {id:'changes',label:'Czy wolno przerabiać?',when:a=>a.kind==='art'&&a.audience==='public'&&a.conditions==='some',options:[['yes','Tak, dowolnie'],['sa','Tak, ale przeróbka na tej samej licencji'],['no','Nie — tylko w oryginalnej postaci']]},
 {id:'copyleft',label:'Czy zmienione wersje programu muszą pozostać otwarte?',when:a=>a.kind==='code'&&a.audience==='public',options:[['yes','Tak — kto rozpowszechnia zmiany, musi udostępnić kod'],['no','Nie — wystarczy zachować informację o autorach']]}
];
export const visibleQuestions=a=>questions.filter(q=>!q.when||q.when(a));
const CC='https://creativecommons.org/licenses/';
export const licenses={
 'cc0':{name:'CC0 1.0 (domena publiczna)',url:'https://creativecommons.org/publicdomain/zero/1.0/deed.pl',rights:[['ok','Każdy może kopiować, przerabiać i zarabiać — bez pytania i bez warunków.'],['warn','Podpis autora jest mile widziany, ale nieobowiązkowy.']]},
 'by':{name:'CC BY 4.0',url:CC+'by/4.0/deed.pl',rights:[['ok','Wolno kopiować i udostępniać.'],['ok','Wolno przerabiać i używać komercyjnie.'],['warn','Zawsze trzeba podpisać autora i podać licencję.']]},
 'by-sa':{name:'CC BY-SA 4.0',url:CC+'by-sa/4.0/deed.pl',rights:[['ok','Wolno kopiować, przerabiać i używać komercyjnie.'],['warn','Przeróbkę trzeba udostępnić na tej samej licencji (SA).'],['warn','Zawsze trzeba podpisać autora.']]},
 'by-nc':{name:'CC BY-NC 4.0',url:CC+'by-nc/4.0/deed.pl',rights:[['ok','Wolno kopiować i przerabiać.'],['no','Nie wolno zarabiać bez zgody autora (NC).'],['warn','Zawsze trzeba podpisać autora.']]},
 'by-nc-sa':{name:'CC BY-NC-SA 4.0',url:CC+'by-nc-sa/4.0/deed.pl',rights:[['ok','Wolno kopiować i przerabiać.'],['no','Nie wolno zarabiać bez zgody autora (NC).'],['warn','Przeróbka na tej samej licencji (SA) i z podpisem autora.']]},
 'by-nd':{name:'CC BY-ND 4.0',url:CC+'by-nd/4.0/deed.pl',rights:[['ok','Wolno kopiować i udostępniać, także komercyjnie.'],['no','Nie wolno rozpowszechniać przeróbek (ND).'],['warn','Zawsze trzeba podpisać autora.']]},
 'by-nc-nd':{name:'CC BY-NC-ND 4.0',url:CC+'by-nc-nd/4.0/deed.pl',rights:[['ok','Wolno kopiować i udostępniać w oryginale.'],['no','Nie wolno zarabiać (NC) ani rozpowszechniać przeróbek (ND).'],['warn','Zawsze trzeba podpisać autora.']]},
 'gpl':{name:'GNU GPL v3',url:'https://www.gnu.org/licenses/gpl-3.0.html',rights:[['ok','Każdy może używać, zmieniać i rozpowszechniać program, także za pieniądze.'],['warn','Kto rozpowszechnia zmienioną wersję, musi udostępnić jej kod na GPL (copyleft).']]},
 'mit':{name:'Licencja MIT',url:'https://opensource.org/license/mit',rights:[['ok','Każdy może używać, zmieniać, sprzedawać, także w zamkniętym programie.'],['warn','Trzeba zachować informację o autorach i treść licencji.']]},
 'contract':{name:'Umowa z klientem (licencja wyłączna lub przeniesienie praw)',url:'',rights:[['ok','Klient dostaje prawa opisane w umowie — np. wyłączność na logo.'],['warn','Umowa na piśmie: co wolno, gdzie i jak długo (pola eksploatacji).'],['no','Bez umowy klient nie ma pewności, że może używać pracy, jak chce.']]}
};
export function licenseFrom(a={}){
 if(!a.kind||!a.audience)return null;
 if(a.audience==='client')return 'contract';
 if(a.kind==='code')return a.copyleft==='yes'?'gpl':a.copyleft==='no'?'mit':null;
 if(a.conditions==='none')return 'cc0';
 if(a.conditions!=='some'||!a.commercial||!a.changes)return null;
 return ['by',a.commercial==='no'?'nc':'',a.changes==='sa'?'sa':a.changes==='no'?'nd':''].filter(Boolean).join('-');
}
export const briefs=[
 {id:'portfolio',tag:'Portfolio',icon:'camera',title:'Zdjęcia z miasta w Twoim portfolio',text:'Publikujesz w sieci swoje zdjęcia z miasta. Chcesz, żeby inni mogli je pokazywać i przerabiać (np. na tapety), ale nie zarabiać na nich bez pytania. Przeróbki mają być dostępne na tych samych zasadach.',expect:'by-nc-sa',answers:{kind:'art',audience:'public',conditions:'some',commercial:'no',changes:'sa'},
  hints:{kind:'Zdjęcia to nie program.',audience:'Publikujesz w sieci dla wszystkich, nie dla jednego klienta.',conditions:'Chcesz przynajmniej podpisu — więc warunki są.',commercial:'„Nie zarabiać na nich bez pytania” — to warunek NC.',changes:'„Przeróbki na tych samych zasadach” — to warunek SA.'}},
 {id:'school',tag:'Szkoła',icon:'school',title:'Ikony dla szkolnego wolontariatu',text:'Rysujecie zestaw ikon dla szkolnego wolontariatu. Każdy może ich używać i przerabiać — szkoła, fundacja, a nawet sklep, który drukuje plakaty akcji. Jedyny warunek: podpis autorów.',expect:'by',answers:{kind:'art',audience:'public',conditions:'some',commercial:'yes',changes:'yes'},
  hints:{kind:'Ikony to grafika.',audience:'Z ikon mają korzystać wszyscy, nie jeden klient.',conditions:'Podpis autorów to warunek — nie wybieraj „bez warunków”.',commercial:'Sklep drukujący plakaty działa komercyjnie — musi mu to być wolno.',changes:'Ikony wolno przerabiać — bez dodatkowych warunków.'}},
 {id:'app',tag:'Aplikacja',icon:'code',title:'Klasowa aplikacja „Plan lekcji”',text:'Piszecie aplikację z planem lekcji. Każdy może ją pobrać, poprawić i rozdawać dalej. Chcecie jednak, żeby nikt nie zamknął kodu: poprawione wersje też mają być otwarte.',expect:'gpl',answers:{kind:'code',audience:'public',copyleft:'yes'},
  hints:{kind:'Aplikacja to program — do kodu nie stosuje się licencji CC.',audience:'Aplikację może pobrać każdy.',copyleft:'„Poprawione wersje też mają być otwarte” — to właśnie copyleft (GPL).'}},
 {id:'client',tag:'Klient',icon:'idcard',title:'Logo dla pizzerii „Pod Kafelkiem”',text:'Fikcyjna pizzeria płaci Wam za logo. Właściciel chce mieć je na wyłączność: na szyldzie, w aplikacji i na pudełkach. Nie chce, żeby ktokolwiek inny mógł go użyć.',expect:'contract',answers:{kind:'art',audience:'client'},
  hints:{kind:'Logo to grafika.',audience:'Logo jest dla jednego klienta na wyłączność. Licencja CC daje prawa wszystkim — tu potrzebna jest umowa.'}}
];
export function checkBrief(state={},briefId){
 const b=briefs.find(x=>x.id===briefId);const cur=state[briefId]||{};if(!b||cur.ok)return state;
 const answers=cur.answers||{};const got=licenseFrom(answers);const tries=(cur.tries||0)+1;const ok=got===b.expect;
 const wrongQ=visibleQuestions(answers).find(q=>answers[q.id]!==b.answers[q.id]);
 const msg=ok?`Zgadza się: ${licenses[b.expect].name}.`:!got?'Odpowiedz na wszystkie pytania kreatora.':`Ta licencja nie pasuje do zlecenia. ${wrongQ?b.hints[wrongQ.id]:''}`.trim();
 return {...state,[briefId]:{...cur,tries,ok,msg,got}};
}
export function setBriefAnswer(state={},briefId,qid,val){
 const cur=state[briefId]||{};if(cur.ok)return state;
 const answers={...(cur.answers||{}),[qid]:val};
 // Usuń odpowiedzi na pytania, które zniknęły po zmianie wcześniejszej odpowiedzi.
 const vis=new Set(visibleQuestions(answers).map(q=>q.id));for(const k of Object.keys(answers))if(!vis.has(k))delete answers[k];
 return {...state,[briefId]:{...cur,answers,msg:undefined}};
}

// Stopka (uznanie autorstwa) dla cudzego zdjęcia — zasada TASL: Tytuł, Autor, Źródło, Licencja (+ zmiany).
export const photo={title:'Rower na bulwarach',author:'Marta Zielińska',source:'galeria-cc.example/rower-na-bulwarach',license:'CC BY-SA 4.0',change:'Na zdjęciu dodaliście napis z nazwą Waszej aplikacji.'};
export const footerParts=[
 {id:'title',text:'„Rower na bulwarach”',required:true,why:'Tytuł (T) — wskazuje, o które dzieło chodzi.'},
 {id:'author',text:'aut. Marta Zielińska',required:true,why:'Autor (A) — BY wymaga podpisu autora.'},
 {id:'source',text:'źródło: galeria-cc.example/rower-na-bulwarach',required:true,why:'Źródło (S) — link do oryginału, żeby każdy mógł sprawdzić licencję.'},
 {id:'license',text:'licencja CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0/deed.pl)',required:true,why:'Licencja (L) — nazwa i link do treści licencji.'},
 {id:'change',text:'Zmiany: dodano napis.',required:true,why:'Przerobiliście zdjęcie — licencje CC 4.0 wymagają zaznaczenia zmian.'},
 {id:'sa',text:'Przerobiona grafika jest dostępna na licencji CC BY-SA 4.0.',required:true,why:'SA: przeróbkę udostępniacie na tej samej licencji.'},
 {id:'google',text:'Źródło: Google Grafika',required:false,why:'Wyszukiwarka to nie źródło. Podaj stronę, na której zdjęcie opublikował autor.'},
 {id:'nci',text:'No copyright infringement intended',required:false,why:'Ten popularny dopisek nic nie znaczy prawnie. Liczy się spełnienie warunków licencji.'},
 {id:'arr',text:'© Wszystkie prawa zastrzeżone — autorzy projektu',required:false,why:'To nie Wasze zdjęcie, a SA zabrania zastrzegania wszystkich praw do przeróbki.'},
 {id:'free',text:'Licencja: darmowe',required:false,why:'„Darmowe” to nie nazwa licencji. Darmowe ≠ wolno wszystko.'}
];
const sentenceParts=new Set(['change','sa']);
export function footerPreview(sel=[]){
 const chosen=footerParts.filter(p=>sel.includes(p.id));
 const list=chosen.filter(p=>!sentenceParts.has(p.id)).map(p=>p.text);
 return [list.length?list.join(', ')+'.':'',...chosen.filter(p=>sentenceParts.has(p.id)).map(p=>p.text)].filter(Boolean).join(' ');
}
export function checkFooter(cur={}){
 if(cur.ok)return cur;const sel=cur.sel||[];const tries=(cur.tries||0)+1;
 const missing=footerParts.filter(p=>p.required&&!sel.includes(p.id));const wrong=footerParts.filter(p=>!p.required&&sel.includes(p.id));
 const ok=!missing.length&&!wrong.length;
 return {...cur,tries,ok,missing:missing.map(p=>p.id),wrong:wrong.map(p=>p.id)};
}
export const footerPoints=f=>f?.ok?(f.tries===1?2:1):0;

// Karta licencyjna — produkt pary (albo ucznia pracującego samodzielnie).
export function cardComplete(card={}){return (card.name||'').trim().length>=3&&(card.team||'').trim().length>=2&&(card.reason||'').trim().length>=15&&!!licenseFrom(card.answers||{});}
export function cardFooter(card={},year=new Date().getFullYear()){
 const id=licenseFrom(card.answers||{});if(!id)return '';const l=licenses[id];const name=(card.name||'').trim()||'Nasz projekt';const team=(card.team||'').trim()||'nasz zespół';
 if(id==='contract')return `„${name}” — autorzy: ${team}, ${year}. Autorskie prawa majątkowe przeniesione na klienta umową z dnia … (pola eksploatacji i wyłączność opisane w umowie).`;
 if(id==='cc0')return `„${name}”, ${team}, ${year}. Przekazane do domeny publicznej: ${l.name} — ${l.url}`;
 return `© ${year} ${team}. „${name}” jest udostępniony na licencji ${l.name} — ${l.url}`;
}
// Pełny tekst karty licencyjnej (do skopiowania, np. do Worda).
export function cardText(card={},footerOk=false,year=new Date().getFullYear()){
 const id=licenseFrom(card.answers||{});if(!id)return '';const l=licenses[id];
 const mark={ok:'WOLNO',no:'NIE WOLNO',warn:'WARUNEK'};
 return ['KARTA LICENCYJNA PROJEKTU',`Projekt: ${(card.name||'').trim()}`,`Autorzy: ${(card.team||'').trim()}`,`Licencja: ${l.name}${l.url?' — '+l.url:''}`,'',...l.rights.map(([k,t])=>`${mark[k]}: ${t}`),'',`Dlaczego ta licencja: ${(card.reason||'').trim()}`,'',`Stopka do projektu: ${cardFooter(card,year)}`,...(footerOk?['',`Wykorzystane cudze materiały: ${footerPreview(footerParts.filter(p=>p.required).map(p=>p.id))}`]:[])].join('\n');
}
// Gdzie szukać grafik na licencjach CC — tylko wskazówki (platforma nie łączy się z tymi serwisami).
export const galleries=[
 {name:'Wikimedia Commons',url:'https://commons.wikimedia.org/',tip:'Miliony zdjęć i grafik na wolnych licencjach. Na stronie pliku sprawdzisz autora i licencję, a przycisk do ponownego użycia podpowiada gotowe uznanie autorstwa.'},
 {name:'Openverse',url:'https://openverse.org/',tip:'Wyszukiwarka utworów na licencjach CC i z domeny publicznej. Filtrami zawęzisz wyniki np. do użycia komercyjnego lub takich, które wolno przerabiać.'}
];
export function creatorResult(value={}){
 const b=value.briefs||{};const briefScore=briefs.reduce((s,x)=>s+award(b[x.id]?.ok,b[x.id]?.tries),0);
 const solved=briefs.filter(x=>b[x.id]?.ok).length;const fp=footerPoints(value.footer);const card=value.card||{};const lic=licenseFrom(card.answers||{});
 const done=solved===briefs.length&&!!value.footer?.ok&&cardComplete(card);
 return {done,score:briefScore+fp,max:briefs.length+2,solved,summary:cardComplete(card)?`Karta licencyjna: „${card.name.trim()}” — ${licenses[lic].name}`:`Zlecenia: ${solved}/${briefs.length}${value.footer?.ok?' · stopka gotowa':''}`};
}

// ---------- 3. Czy to zgodne z licencją? ----------
export const keys=[
 {id:'by',label:'BY — podpis autora'},
 {id:'nc',label:'NC — tylko niekomercyjnie'},
 {id:'nd',label:'ND — bez przeróbek'},
 {id:'sa',label:'SA — te same warunki'},
 {id:'cc0',label:'CC0 — bez warunków'},
 {id:'none',label:'Brak licencji — wszystkie prawa zastrzeżone'}
];
export const cases=[
 {id:'club',license:'CC BY 4.0',who:'Klub e-sportowy',usage:'Klub wrzuca na swój profil zdjęcie z turnieju znalezione w galerii CC. Bez podpisu, „bo i tak każdy wie, skąd jest”.',verdict:'bad',key:'by',explain:'CC BY pozwala prawie na wszystko, ale podpis autora jest obowiązkowy. Wystarczy dopisać stopkę TASL — i będzie zgodnie z licencją.'},
 {id:'nails',license:'CC BY-NC 4.0',who:'Salon paznokci',usage:'Właścicielka salonu używa zdjęcia dłoni (z podpisem autora) w płatnej reklamie swojego salonu na Instagramie.',verdict:'bad',key:'nc',explain:'Reklama salonu to użycie komercyjne. NC tego zabrania — potrzebna jest osobna zgoda autora (np. płatna licencja).'},
 {id:'school',license:'CC BY-NC 4.0',who:'Uczeń na lekcji',usage:'Uczeń wstawia to samo zdjęcie do szkolnej prezentacji, z pełnym podpisem autora i licencji.',verdict:'ok',key:'nc',explain:'Prezentacja na lekcji to użycie niekomercyjne, podpis jest. Ta sama licencja — inna sytuacja, inny werdykt.'},
 {id:'meme',license:'CC BY-ND 4.0',who:'Fanpage z memami',usage:'Admin dodaje do zdjęcia napis i zmienia kolory, a mema publikuje z podpisem autora.',verdict:'bad',key:'nd',explain:'ND zabrania rozpowszechniania przeróbek. Napis i zmiana kolorów to przeróbka — podpis tego nie ratuje.'},
 {id:'remix',license:'CC BY-SA 4.0',who:'Trójka z Twojej klasy',usage:'Uczniowie przerabiają grafikę na plakat, podpisują autora, zaznaczają zmiany i publikują plakat na CC BY-SA 4.0.',verdict:'ok',key:'sa',explain:'Wszystko gra: przeróbka jest dozwolona, a SA wymaga udostępnienia jej na tej samej licencji — i tak zrobili.'},
 {id:'google',license:'brak informacji',who:'Gazetka szkolna online',usage:'Redakcja bierze zdjęcie z wyników wyszukiwania grafik, „bo było w internecie za darmo”, i ilustruje nim artykuł.',verdict:'bad',key:'none',explain:'Brak licencji nie oznacza „wolno”. Domyślnie autor ma wszystkie prawa. Szukaj grafik z filtrem licencji CC albo poproś autora o zgodę.'},
 {id:'shirt',license:'CC0 1.0',who:'Mała firma',usage:'Firma drukuje grafikę na koszulkach na sprzedaż. Nie podpisuje autora.',verdict:'ok',key:'cc0',explain:'CC0 to domena publiczna: wolno wszystko, także zarabiać bez podpisu. Podpis byłby miłym gestem, ale nie jest obowiązkowy.'}
];
export function setCase(state={},caseId,field,val){const cur=state[caseId]||{};if(cur.ok)return state;return {...state,[caseId]:{...cur,[field]:val,msg:undefined}};}
export function checkCase(state={},caseId){
 const c=cases.find(x=>x.id===caseId);const cur=state[caseId]||{};if(!c||cur.ok||!cur.verdict||!cur.key)return state;
 const tries=(cur.tries||0)+1;const vOk=cur.verdict===c.verdict,kOk=cur.key===c.key;const ok=vOk&&kOk;
 const msg=ok?c.explain:!vOk?(c.verdict==='ok'?'Werdykt nie pasuje. Sprawdź jeszcze raz warunki tej licencji — może wszystkie są spełnione?':'Werdykt nie pasuje. Przeczytaj opis jeszcze raz: który warunek licencji nie został spełniony?'):'Werdykt dobry, ale rozstrzyga inny element licencji. Który warunek dotyczy tej sytuacji?';
 return {...state,[caseId]:{...cur,tries,ok,msg}};
}
export function checkResult(value={}){
 const s=value.cases||{};const solved=cases.filter(c=>s[c.id]?.ok).length;
 const score=cases.reduce((sum,c)=>sum+award(s[c.id]?.ok,s[c.id]?.tries),0);
 return {done:solved>=5,score,max:cases.length,solved,summary:`Audyt licencji: ${solved}/${cases.length} przypadków`};
}
