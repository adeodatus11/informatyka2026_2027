// Logika symulatora „Skrzynka pocztowa” (lekcja 41). Czysty JS, bez Reacta.
// Firma, adresy i osoby są fikcyjne. Nic nie jest wysyłane.

export const offer={
 company:'BitSerwis sp. z o.o. (fikcyjna firma)',
 city:'Zielonkowo',
 contact:'Anna Zielińska',
 email:'rekrutacja@bitserwis-przyklad.pl',
 text:'Serwis komputerowy przyjmie uczniów technikum na praktyki zawodowe w maju i czerwcu 2027 r. Zgłoszenia z CV prosimy przesyłać e-mailem do p. Anny Zielińskiej.'
};

// ---------- Tryb 'spot': znajdź błędy w e-mailu (przykład do analizy) ----------
export const badMail=[
 {id:'from',area:'Od',text:'kr0l_imprez_2009@poczta-przyklad.pl',bad:true,why:'Adres nadawcy wygląda niepoważnie. Do szkoły i pracodawcy pisz z adresu z imieniem i nazwiskiem.'},
 {id:'to',area:'Do',text:'rekrutacja@bitserwis-przyklad.pl',bad:false,why:'Adres odbiorcy jest dokładnie taki jak w ogłoszeniu. Tu nie ma błędu.'},
 {id:'subject',area:'Temat',text:'(brak tematu)',bad:true,why:'Bez tematu wiadomość ginie wśród innych albo trafia do spamu. Temat mówi, czego dotyczy e-mail.'},
 {id:'hello',area:'Treść',text:'siema',bad:true,why:'„Siema” pasuje do kolegi, nie do pracodawcy. Zacznij od „Dzień dobry” albo „Szanowna Pani”.'},
 {id:'who',area:'Treść',text:'Jestem uczniem 1 klasy technikum informatycznego w Zielonkowie.',bad:false,why:'To dobre zdanie: mówi, kim jesteś. Zostaw je.'},
 {id:'shout',area:'Treść',text:'SZUKAM PRAKTYK NA MAJ!!! odpiszcie szybko',bad:true,why:'Wielkie litery w sieci oznaczają krzyk, a „odpiszcie szybko” brzmi jak żądanie. Napisz spokojnie i poproś o odpowiedź.'},
 {id:'skills',area:'Treść',text:'Znam podstawy Worda i lubię naprawiać komputery.',bad:false,why:'Konkret o umiejętnościach to plus. Tu wszystko gra.'},
 {id:'sign',area:'Podpis',text:'nara 😎',bad:true,why:'Brak podpisu z imieniem i nazwiskiem, a „nara” i emotka nie pasują do oficjalnej wiadomości.'},
 {id:'file',area:'Załącznik',text:'IMG_2041.jpg (zdjęcie CV telefonem, 6 MB)',bad:true,why:'Zdjęcie kartki jest nieczytelne i ciężkie. Wyślij CV jako PDF z imieniem i nazwiskiem w nazwie pliku.'}
];
export const badCount=badMail.filter(f=>f.bad).length;

// state: {marked:[ids], checks:n, found:{id:checkNo}, last:{wrong:[ids], missing:n}}
export function toggleMark(state={},id){
 if(spotSolved(state))return state;
 const marked=state.marked||[];
 return {...state,marked:marked.includes(id)?marked.filter(x=>x!==id):[...marked,id]};
}
export function checkSpot(state={}){
 const marked=state.marked||[],checks=(state.checks||0)+1,found={...(state.found||{})};
 for(const f of badMail)if(f.bad&&marked.includes(f.id)&&!found[f.id])found[f.id]=checks;
 const wrong=marked.filter(id=>!badMail.find(f=>f.id===id)?.bad);
 const missing=badMail.filter(f=>f.bad&&!marked.includes(f.id)).length;
 return {...state,checks,found,last:{wrong,missing},dirty:false};
}
export function spotSolved(state={}){return !!state.last&&state.last.wrong.length===0&&state.last.missing===0;}
export function spotResult(state={}){
 const found=state.found||{};
 const score=badMail.filter(f=>f.bad).reduce((s,f)=>s+(found[f.id]===1?1:found[f.id]?0.5:0),0);
 const done=spotSolved(state);
 return {done,score,max:badCount,summary:done?`Znalezione błędy w e-mailu: ${badCount}/${badCount}`:undefined};
}

// ---------- Tryb 'compose': napisz e-mail o praktyki ----------
export const senders=[
 {id:'pro',text:'jan.kowalski.2010@poczta-przyklad.pl',ok:true},
 {id:'nick',text:'xX_sniper_Xx@poczta-przyklad.pl',ok:false},
 {id:'school',text:'kowalski.jan@uczen.zs-zielonkowo.pl (konto szkolne)',ok:true}
];
export const attachments=[
 {id:'none',text:'Bez załącznika',ok:false,why:'Ogłoszenie prosi o CV. Dodaj je jako załącznik.'},
 {id:'cv-pdf',text:'CV_Jan_Kowalski.pdf (1 strona, 90 KB)',ok:true},
 {id:'cv-docx',text:'cv final FINAL (2).docx',ok:false,why:'Nazwa pliku wygląda chaotycznie, a DOCX może się rozjechać u odbiorcy. Wybierz PDF z imieniem i nazwiskiem w nazwie.'},
 {id:'photo',text:'IMG_2041.jpg (zdjęcie CV telefonem, 6 MB)',ok:false,why:'Zdjęcie kartki jest nieczytelne i ciężkie. Wybierz CV w PDF.'}
];
export const skeleton='Dzień dobry,\n\n[Kim jesteś: klasa, szkoła]\n[O co prosisz: praktyki, w jakim terminie]\n[Dlaczego ta firma / co umiesz]\n\nZ poważaniem\n[Imię i nazwisko, klasa]';

const norm=s=>String(s||'').trim();
const lines=s=>norm(s).split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
const emoji=/\p{Extended_Pictographic}/u;
// Granice słów z polskimi literami: \b w JS działa tylko dla ASCII.
const W=(src,flags='iu')=>new RegExp(`(?<!\\p{L})(?:${src})(?!\\p{L})`,flags);
const slang=W('siema|elo|nara|spoko|mega|xd+|plz|pls|thx|ziom\\p{L}*|sory|sorki|hejka|cze|yo');
const shouting=s=>/!!|\?\?/.test(s)||(String(s).match(/(?<!\p{L})\p{Lu}{4,}(?!\p{L})/gu)||[]).filter(w=>!['HTML','DOCX','BLIK','RODO','NASK','CERT','IT','TI'].includes(w)).length>0;
const greetingOk=/^(dzień dobry|dzien dobry|szanown[aiey]|witam)/i;
const greetingBad=new RegExp('^(?:hej|siema|elo|cześć|czesc|yo|hejka|witajcie|siemka|cze)(?!\\p{L})','iu');
const closingRe=/(z poważaniem|z powazaniem|pozdrawiam|z wyrazami szacunku|łączę wyrazy szacunku|z pozdrowieniami|z wyrazami uszanowania)/i;
const nameRe=/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:-[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?/;
const placeholder=/\[[^\]]*\]/;

export const criteria=[
 {id:'address',label:'Adresy',goal:'Poważny adres nadawcy i dokładny adres z ogłoszenia'},
 {id:'subject',label:'Temat',goal:'Konkretny temat o praktykach, bez krzyku'},
 {id:'greeting',label:'Powitanie',goal:'„Dzień dobry” albo „Szanowna Pani”'},
 {id:'body',label:'Treść',goal:'Kim jesteś, o co prosisz, w jakim terminie'},
 {id:'tone',label:'Ton',goal:'Uprzejmie, bez slangu, emotek i wielkich liter'},
 {id:'signature',label:'Podpis',goal:'Zwrot grzecznościowy oraz imię i nazwisko'},
 {id:'attachment',label:'Załącznik',goal:'CV w PDF i wzmianka o nim w treści'}
];

// Zwraca {id: {ok, msg}} dla jednego szkicu e-maila.
export function evaluateMail(m={}){
 const r={};
 const sender=senders.find(s=>s.id===m.from);
 const to=norm(m.to).toLowerCase();
 if(!sender)r.address={ok:false,msg:'Wybierz adres nadawcy.'};
 else if(!sender.ok)r.address={ok:false,msg:'Adres „xX_sniper_Xx” nie budzi zaufania. Wybierz adres z imieniem i nazwiskiem albo konto szkolne.'};
 else if(to!==offer.email)r.address={ok:false,msg:to?`Sprawdź adres odbiorcy znak po znaku. W ogłoszeniu jest: ${offer.email}.`:'Wpisz adres odbiorcy z ogłoszenia.'};
 else r.address={ok:true,msg:'Adresy są w porządku.'};

 const subj=norm(m.subject);
 if(!subj)r.subject={ok:false,msg:'Brak tematu. Wpisz np. „Zgłoszenie na praktyki zawodowe — Jan Kowalski, kl. 1”.'};
 else if(shouting(subj)||/pilne/i.test(subj))r.subject={ok:false,msg:'Temat krzyczy (wielkie litery, „!!” albo „PILNE”). Napisz go spokojnie.'};
 else if(!/praktyk/i.test(subj))r.subject={ok:false,msg:'Z tematu nie wynika, że chodzi o praktyki. Dodaj słowo „praktyki”.'};
 else if(subj.length<15)r.subject={ok:false,msg:'Temat jest za krótki. Dodaj, kto pisze, np. imię, nazwisko i klasę.'};
 else r.subject={ok:true,msg:'Temat od razu mówi, o co chodzi.'};

 const ls=lines(m.body);const first=ls[0]||'';
 if(!first)r.greeting={ok:false,msg:'Treść jest pusta. Zacznij od powitania.'};
 else if(greetingBad.test(first))r.greeting={ok:false,msg:`„${first.split(/[\s,!]/)[0]}” pasuje do kolegi. Do firmy napisz „Dzień dobry” albo „Szanowna Pani”.`};
 else if(!greetingOk.test(first))r.greeting={ok:false,msg:'Pierwsza linijka to powitanie, np. „Dzień dobry,” albo „Szanowna Pani,”.'};
 else r.greeting={ok:true,msg:/^witam/i.test(first)?'Powitanie jest. Wskazówka: „Witam” część osób uważa za zbyt poufałe, „Dzień dobry” jest bezpieczniejsze.':'Powitanie jest uprzejme.'};

 const body=norm(m.body);
 const who=/(uczeń|uczniem|uczennic|uczę się|ucze sie|klas[ayie]|kl\.|technikum|szkoł)/i.test(body);
 const what=/praktyk/i.test(body);
 const when=/(maj|czerw|lip|sierp|wrze|termin|tygodni|miesiąc|\b\d{1,2}[.\-/]\d{1,2}\b|20\d\d)/i.test(body);
 const missing=[!who&&'kim jesteś (klasa, szkoła)',!what&&'że prosisz o praktyki',!when&&'w jakim terminie (np. maj–czerwiec 2027)'].filter(Boolean);
 if(placeholder.test(body))r.body={ok:false,msg:'W treści zostały nawiasy kwadratowe ze szkieletu. Zastąp je własnymi zdaniami.'};
 else if(missing.length)r.body={ok:false,msg:`Brakuje informacji: ${missing.join(', ')}.`};
 else if(body.length<140)r.body={ok:false,msg:'Treść jest bardzo krótka. Dopisz 1–2 zdania: dlaczego ta firma albo co już umiesz.'};
 else r.body={ok:true,msg:'Treść odpowiada na pytania: kto, co i kiedy.'};

 const all=`${subj}\n${body}`;
 if(emoji.test(all))r.tone={ok:false,msg:'Usuń emotki. W oficjalnej wiadomości ich nie używamy.'};
 else if(slang.test(all))r.tone={ok:false,msg:`Zamień słowo „${all.match(slang)[0].toLowerCase()}” na zwykłe, uprzejme słowa.`};
 else if(shouting(body))r.tone={ok:false,msg:'Wielkie litery albo „!!” w sieci oznaczają krzyk. Napisz normalnie.'};
 else if(/(odpiszcie|odpisz)\s+(szybko|natychmiast)|asap/i.test(all))r.tone={ok:false,msg:'„Odpiszcie szybko” brzmi jak żądanie. Napisz: „Będę wdzięczny za odpowiedź”.'};
 else if(!/(dziękuj|proszę|prosze|uprzejmie|będę wdzięczn|bede wdzieczn|chciał(a|bym)|chciałbym|chciałabym)/i.test(body))r.tone={ok:false,msg:'Dodaj uprzejmą formę: „proszę”, „chciałbym/chciałabym” albo „dziękuję”.'};
 else r.tone={ok:true,msg:'Ton jest uprzejmy i rzeczowy.'};

 const closeIdx=ls.findIndex(l=>closingRe.test(l));
 const after=closeIdx>=0?ls.slice(closeIdx).join(' ').replace(closingRe,'').replace(/^[\s,.]+/,''):'';
 if(closeIdx<0||closeIdx<ls.length-4)r.signature={ok:false,msg:'Na końcu dodaj zwrot grzecznościowy, np. „Z poważaniem” lub „Pozdrawiam”, a pod nim imię i nazwisko.'};
 else if(placeholder.test(after)||!nameRe.test(after))r.signature={ok:false,msg:'Pod zwrotem grzecznościowym wpisz imię i nazwisko wielkimi literami na początku (np. Jan Kowalski). Możesz użyć wymyślonego.'};
 else r.signature={ok:true,msg:'Podpis jest kompletny.'};

 const att=attachments.find(a=>a.id===m.attachment)||attachments[0];
 if(!att.ok)r.attachment={ok:false,msg:att.why};
 else if(!/(załącz|zalacz|cv|życiorys)/i.test(body))r.attachment={ok:false,msg:'Plik jest dobry, ale wspomnij o nim w treści, np. „W załączniku przesyłam CV”.'};
 else r.attachment={ok:true,msg:'CV w PDF, opisane w treści.'};
 return r;
}

// state: {mail:{from,to,subject,body,attachment}, checks:n, passedAt:{id:checkNo}, report, sent}
export function checkMail(state={}){
 const checks=(state.checks||0)+1,report=evaluateMail(state.mail),passedAt={...(state.passedAt||{})};
 for(const c of criteria)if(report[c.id].ok&&!passedAt[c.id])passedAt[c.id]=checks;
 return {...state,checks,report,passedAt,dirty:false};
}
export function mailReady(state={}){return !!state.report&&!state.dirty&&criteria.every(c=>state.report[c.id]?.ok);}
export function composeResult(state={}){
 const p=state.passedAt||{};
 const score=criteria.reduce((s,c)=>s+(p[c.id]===1?1:p[c.id]?0.5:0),0);
 const ok=state.report?criteria.filter(c=>state.report[c.id]?.ok).length:0;
 const done=!!state.sent;
 return {done,score,max:criteria.length,summary:done?`E-mail o praktyki: ${ok}/${criteria.length} kryteriów, ${state.checks} ${state.checks===1?'sprawdzenie':'sprawdzenia'} przed wysłaniem`:undefined};
}

// ---------- Tryb 'tone': konflikt na grupie klasowej ----------
export const chat=[
 {who:'Ola',text:'Kto robi slajdy 5–8? Jutro o 8:00 oddajemy prezentację.'},
 {who:'Marek',text:'BARTEK ZNOWU OLAŁEŚ PREZENTACJĘ, TY LENIU. PRZEZ CIEBIE WSZYSCY DOSTANIEMY PAŁĘ!!!',angry:true},
 {who:'Kuba',text:'😂😂😂'},
 {who:'Wiki',text:'typowy Bartek xD'}
];
export const firstMove=[
 {text:'Dopisuję na grupie „no serio, Bartek jak zawsze”, żeby wiedział, że wszyscy są źli.',ok:false,why:'To dokładanie się do publicznego ośmieszania. Bartek się zablokuje, a slajdów dalej nie będzie.'},
 {text:'Nic nie robię i wyciszam grupę. Sami się dogadają.',ok:false,why:'Bierność nie rozwiąże problemu, a jutro cała grupa odda niepełną prezentację.'},
 {text:'Piszę do Bartka prywatnie, spokojnie, z konkretną prośbą i terminem. Na grupie tylko: „Ogarniamy slajdy 5–8, dam znać”.',ok:true}
];
export function chooseMove(state={},i){if(state.move?.ok)return state;return {...state,move:{choice:i,tries:(state.move?.tries||0)+1,ok:!!firstMove[i]?.ok}};}

export const toneCriteria=[
 {id:'calm',label:'Bez obelg i krzyku',goal:'Żadnych wyzwisk, wielkich liter i „!!!”'},
 {id:'general',label:'Bez uogólnień',goal:'Zamiast „znowu”, „zawsze”, „jak zwykle” mówisz o tej jednej sprawie'},
 {id:'me',label:'Komunikat „ja”',goal:'Mówisz o sobie lub o grupie: „martwię się”, „potrzebujemy”, „zależy mi”'},
 {id:'ask',label:'Prośba z terminem',goal:'Konkretna prośba i termin, np. „Czy możesz wysłać slajdy do 20:00?”'}
];
const insults=/(?<!\p{L})(?:leni|leń|debil|idiot|frajer|głup|glup|kretyn|ofiaro|żałos|zalos|dzban|matoł|matol|baran|cwel|kurw|chuj|jeb|pojeb|pierd|spierd)/iu;
export function evaluateTone(text=''){
 const t=norm(text),r={};
 if(t.length<25)return Object.fromEntries(toneCriteria.map(c=>[c.id,{ok:false,msg:'Napisz pełną wiadomość: co najmniej jedno–dwa zdania.'}]));
 if(insults.test(t))r.calm={ok:false,msg:`Usuń obraźliwe słowo („${t.match(insults)[0].toLowerCase()}…”). Krytykuj sprawę, nie osobę.`};
 else if(shouting(t))r.calm={ok:false,msg:'Wielkie litery i „!!!” to krzyk. Napisz normalnie.'};
 else if(emoji.test(t)&&/😂|🤣|🙄|🤡|💀/u.test(t))r.calm={ok:false,msg:'Emotki śmiechu czy przewracania oczami brzmią jak drwina. Usuń je.'};
 else r.calm={ok:true,msg:'Spokojnie i bez obrażania.'};
 const g=t.match(W('znowu|zawsze|nigdy|jak zwykle|wiecznie|typowy|typowe'));
 r.general=g?{ok:false,msg:`„${g[0].toLowerCase()}” to uogólnienie, które brzmi jak oskarżenie. Mów o tej jednej prezentacji.`}:{ok:true,msg:'Mówisz o konkretnej sprawie.'};
 r.me=W('martwię|martwie|potrzebuj\\p{L}*|zależy (?:mi|nam)|zalezy (?:mi|nam)|czuję|czuje|stresuj\\p{L}*|boję|boje|mam problem|wolał\\p{L}*|chcę|chce|chcemy').test(t)?{ok:true,msg:'Mówisz o swoich potrzebach, a nie o „winie” Bartka.'}:{ok:false,msg:'Dodaj komunikat „ja”, np. „Martwię się o jutro” albo „Potrzebujemy slajdów 5–8”.'};
 const ask=/(czy możesz|czy mozesz|czy dasz radę|czy dasz rade|możesz|mozesz|proszę|prosze|daj znać|daj znac|zrobisz|ustalmy|pomóc|pomoc|wyślesz|wyslesz)/i.test(t);
 const when=/(jutr|dziś|dzis|dzisiaj|wieczor|rano|godz|do \d|\d{1,2}[:.]\d{2}|północ|polnoc|poniedział|wtor|środ|srod|czwart|piąt|piat|sobot|niedziel)/i.test(t);
 r.ask=ask&&when?{ok:true,msg:'Jest konkretna prośba i termin.'}:{ok:false,msg:ask?'Prośba jest, dodaj termin, np. „do 20:00” albo „dziś wieczorem”.':'Dodaj prośbę, np. „Czy możesz wysłać slajdy 5–8 dziś do 20:00?”.'};
 return r;
}
export function checkTone(state={}){
 const checks=(state.checks||0)+1,report=evaluateTone(state.text),passedAt={...(state.passedAt||{})};
 for(const c of toneCriteria)if(report[c.id].ok&&!passedAt[c.id])passedAt[c.id]=checks;
 return {...state,checks,report,passedAt,dirty:false};
}
export function toneSolved(state={}){return !!state.report&&!state.dirty&&toneCriteria.every(c=>state.report[c.id]?.ok);}
export function toneResult(state={}){
 const p=state.passedAt||{},m=state.move;
 const score=(m?.ok?(m.tries===1?1:0.5):0)+toneCriteria.reduce((s,c)=>s+(p[c.id]===1?1:p[c.id]?0.5:0),0);
 const done=!!m?.ok&&toneSolved(state);
 return {done,score,max:1+toneCriteria.length,summary:done?'Agresywna wiadomość przerobiona na asertywną: 4/4 kryteria':undefined};
}
