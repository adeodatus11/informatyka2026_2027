// Logika symulatora „Anatomia oszustwa” (lekcja 43). Czysty JS, bez Reacta.
// Serwis ogłoszeń „Ogłoszeniowo”, bank, sklep, osoby i domeny (poza incydent.cert.pl) są fikcyjne.
// Nic nie jest sprawdzane w sieci: wynik „Listy Ostrzeżeń” to część fabuły ćwiczenia.

const part=p=>p?.ok?(p.tries===1?1:0.5):0;

// ---------- Tryb 'domains': 5 adresów i Lista Ostrzeżeń ----------
export const domains=[
 {id:'cert',url:'https://incydent.cert.pl/',from:'Wpisany ręcznie, żeby zgłosić oszustwo',safe:true,listed:false,
  why:'Domena to cert.pl (czytasz od końca do pierwszego „/”). To prawdziwy adres formularza CERT Polska do zgłaszania incydentów.'},
 {id:'fake-sub',url:'https://ogloszeniowo.pl.odbior-platnosci.top/karta',from:'Link od „kupującego” na WhatsAppie',safe:false,listed:true,
  why:'Czytaj od końca: domena to odbior-platnosci.top. Początek „ogloszeniowo.pl” to tylko przebranie. Strona prosi o dane karty, żeby „odebrać” pieniądze.'},
 {id:'official',url:'https://ogloszeniowo.pl/moje-ogloszenia',from:'Aplikacja serwisu ogłoszeń z naszej historii',safe:true,listed:false,
  why:'Domena to ogloszeniowo.pl: oficjalny adres fikcyjnego serwisu z naszych historii. Wszedłeś przez aplikację, a nie przez link od obcej osoby.'},
 {id:'shop',url:'https://sneakers-outlet-70.shop/promo',from:'Reklama „-70%, tylko dziś”',safe:false,listed:true,
  why:'Nowa domena z „-70” w nazwie, końcówka .shop, presja czasu i brak danych firmy. Klasyczny fałszywy sklep.'},
 {id:'fresh',url:'https://ogloszeniowo-wyplata.com/odbierz',from:'SMS: „Kupujący opłacił przedmiot. Odbierz 120 zł”',safe:false,listed:false,
  why:'Myślnik zamiast kropki: to zupełnie inna domena niż ogloszeniowo.pl. Założono ją wczoraj, więc nie ma jej jeszcze na Liście Ostrzeżeń. Brak na liście nie znaczy, że strona jest bezpieczna.'}
];
export const domainVerdicts=[{id:'safe',label:'Wchodzę',short:'Adres jest w porządku'},{id:'bad',label:'Nie wchodzę',short:'To pułapka'}];

export function judgeDomain(state={},id,verdict){
 const d=domains.find(x=>x.id===id),cur=state[id];
 if(!d||cur?.ok)return state;
 return {...state,[id]:{choice:verdict,tries:(cur?.tries||0)+1,ok:(verdict==='safe')===d.safe}};
}
export function domainsResult(value={}){
 const st=value.judged||{};
 const score=domains.reduce((s,d)=>s+part(st[d.id]),0);
 const solved=domains.filter(d=>st[d.id]?.ok).length;
 const first=domains.filter(d=>st[d.id]?.ok&&st[d.id].tries===1).length;
 return {done:solved===domains.length,score,max:domains.length,solved,
  summary:solved===domains.length?`Domeny: ${first}/${domains.length} ocenione bez pomyłki`:undefined};
}
// Co pokazałaby przeglądarka u operatora, który korzysta z Listy Ostrzeżeń.
export function listCheck(d){
 if(d.listed)return {blocked:true,text:'Strona zablokowana. Ten adres jest na Liście Ostrzeżeń CERT Polska: może wyłudzać dane lub pieniądze.'};
 if(d.safe)return {blocked:false,text:'Strona otwiera się normalnie. Adresu nie ma na Liście Ostrzeżeń.'};
 return {blocked:false,text:'Strona otwiera się normalnie, bo adresu JESZCZE nie ma na liście. Oszuści zakładają nowe domeny codziennie. Tu chroni Cię tylko czytanie adresu.'};
}

// ---------- Tryb 'comic': kreator komiksu „anatomia oszustwa” ----------
// panels: w kolejności poprawnej; stop:true = w tym kadrze jest sygnał ostrzegawczy (punkt przerwania).
export const scenarios=[
 {id:'olx',title:'Fałszywy kupujący w serwisie ogłoszeń',short:'„Odbierz płatność” za bluzę',icon:'board',
  hero:'Maja (16 l.) sprzedaje bluzę za 120 zł w serwisie Ogłoszeniowo.',
  panels:[
   {id:'o1',text:'Maja wystawia bluzę za 120 zł w serwisie ogłoszeń.',stop:false,why:'Wystawienie ogłoszenia to nic podejrzanego.'},
   {id:'o2',text:'„Kupujący” od razu pisze na WhatsAppie, poza serwisem: „Biorę bez oglądania! Zapłacę przez dostawę serwisu”.',stop:true,why:'Przeniesienie rozmowy poza serwis i „biorę bez pytań” to sygnał ostrzegawczy: tracisz ochronę serwisu.'},
   {id:'o3',text:'Przysyła link „odbierz płatność”: ogloszeniowo.pl.odbior-platnosci.top.',stop:true,why:'Link od kupującego, a domena czytana od końca to odbior-platnosci.top, nie ogloszeniowo.pl.'},
   {id:'o4',text:'Strona wygląda jak serwis i prosi o numer karty, datę ważności i kod CVV, „żeby przelać 120 zł”.',stop:true,why:'Żeby DOSTAĆ pieniądze, nigdy nie podajesz CVV ani kodów. Wystarczy numer konta.'},
   {id:'o5',text:'Przychodzi SMS z banku: „Kod 482915 potwierdza płatność 2 400 zł”. Maja przepisuje kod na stronie.',stop:true,why:'Przeczytaj SMS z banku do końca: to potwierdzenie WYDANIA 2 400 zł, a nie odbioru 120 zł.'},
   {id:'o6',text:'Z konta znika 2 400 zł. „Kupujący” usuwa konto.',stop:false,why:'To już skutek oszustwa. Teraz liczy się szybka reakcja: bank, policja, zgłoszenie.'}
  ],
  law:'art. 287 kk (oszustwo komputerowe: oszust bez upoważnienia wprowadza dane karty Mai do systemu płatności) oraz art. 286 kk (wprowadzenie w błąd, żeby ktoś stracił pieniądze)'},
 {id:'blik',title:'„Pożycz BLIK-a” od przyjaciółki',short:'Przejęte konto na komunikatorze',icon:'phone',
  hero:'Kuba (17 l.) dostaje wiadomość od przyjaciółki Oli na komunikatorze.',
  panels:[
   {id:'b1',text:'„Ola” pisze wieczorem: „Hej, masz chwilę? Mam mały problem”.',stop:false,why:'Samo „hej, masz chwilę?” jeszcze niczego nie przesądza.'},
   {id:'b2',text:'„Pilnie potrzebuję 300 zł, w sklepie nie działa mi karta. Wyślesz kod BLIK? Oddam jutro”.',stop:true,why:'Prośba o kod BLIK przez komunikator to klasyczny sygnał oszustwa „na znajomego”.'},
   {id:'b3',text:'Kuba proponuje: „Zadzwonię”. „Ola”: „Nie mogę gadać, tylko pisz, szybko!”.',stop:true,why:'Odmowa rozmowy głosowej i pośpiech. Zadzwoń do Oli na zwykły numer albo zapytaj o coś, co wie tylko ona.'},
   {id:'b4',text:'Kuba generuje kod BLIK i wysyła go „Oli”.',stop:false,why:'Tu nie pojawia się nowy sygnał. To decyzja podjęta pod presją z poprzednich kadrów.'},
   {id:'b5',text:'Aplikacja banku pyta: „Potwierdź WYPŁATĘ GOTÓWKI 300 zł z bankomatu”. Kuba klika „Potwierdź”.',stop:true,why:'Ostatnia szansa: aplikacja mówi „wypłata z bankomatu”, a nie „zakupy w sklepie”. Czytaj, co zatwierdzasz.'},
   {id:'b6',text:'Pieniądze wypłaca ktoś w innym mieście. Prawdziwa Ola o niczym nie wie: ktoś przejął jej konto.',stop:false,why:'To skutek. Teraz Kuba dzwoni do banku, a Ola odzyskuje konto i ostrzega znajomych.'}
  ],
  law:'art. 267 kk (przejęcie konta Oli bez uprawnienia) oraz art. 286 kk (wyłudzenie pieniędzy przez wprowadzenie w błąd)'},
 {id:'shop',title:'Sklep z butami za 30%',short:'Fałszywy sklep z reklamy',icon:'globe',
  hero:'Natalia (15 l.) szuka sneakersów na urodziny.',
  panels:[
   {id:'s1',text:'Reklama: „Sneakersy -70%! Tylko dziś, zostały 3 pary!”.',stop:true,why:'Cena zbyt dobra, żeby była prawdziwa, i presja czasu. Zatrzymaj się.'},
   {id:'s2',text:'Sklep sneakers-outlet-70.shop: brak nazwy firmy, adresu i NIP-u, regulamin skopiowany z innej strony.',stop:true,why:'Sprawdź, kto sprzedaje: dane firmy, opinie POZA sklepem, wiek domeny.'},
   {id:'s3',text:'Przy kasie jedyna opcja: przelew na prywatne konto „bo system płatności ma awarię”.',stop:true,why:'Brak płatności z ochroną kupującego (karta, szybki przelew przez bramkę, płatność przy odbiorze) to sygnał alarmowy.'},
   {id:'s4',text:'Natalia przelewa 189 zł oszczędności.',stop:false,why:'To decyzja po zignorowaniu sygnałów. Nowego sygnału tu nie ma.'},
   {id:'s5',text:'Paczka nie przychodzi. E-mail sklepu nie odpowiada.',stop:false,why:'To już skutek. Czas na reakcję: bank, policja, zgłoszenie strony.'},
   {id:'s6',text:'Tydzień później ten sam sklep działa pod inną nazwą.',stop:false,why:'Oszuści zmieniają domeny. Dlatego zgłoszenie do CERT pomaga innym.'}
  ],
  law:'art. 286 kk (oszustwo: sklep wprowadza w błąd, że wyśle buty, i bierze pieniądze)'}
];
export const reactions=[
 {id:'bank',text:'Od razu dzwonię do banku (numer z karty lub aplikacji) i blokuję kartę lub płatności',ok:true},
 {id:'proof',text:'Robię zrzuty ekranu: rozmowy, adres strony, SMS-y, potwierdzenie przelewu',ok:true},
 {id:'police',text:'Z rodzicem lub opiekunem zgłaszam sprawę na policji',ok:true},
 {id:'cert',text:'Zgłaszam stronę na incydent.cert.pl, a podejrzany SMS przekazuję na 8080',ok:true},
 {id:'write',text:'Piszę do oszusta, że wiem, kim jest, i że ma oddać pieniądze',ok:false,why:'Rozmowa z oszustem nic nie da, a może dać mu kolejne informacje. Zostaw to bankowi i policji.'},
 {id:'delete',text:'Usuwam całą rozmowę i SMS-y, żeby nikt się nie dowiedział',ok:false,why:'Kasujesz dowody. Wstyd nie jest Twoją winą. Winny jest oszust, a dowody pomagają odzyskać pieniądze.'},
 {id:'wait',text:'Czekam kilka dni, może pieniądze same wrócą',ok:false,why:'Liczą się minuty: bank może zatrzymać przelew lub wypłatę tylko wtedy, gdy zareagujesz szybko.'}
];
export const comicRoles=[
 {id:'story',name:'Scenarzysta',task:'Układa kadry w kolejności i pilnuje, żeby historia miała sens.'},
 {id:'guard',name:'Strażnik',task:'Szuka sygnałów ostrzegawczych i pisze dymki „STOP”.'},
 {id:'rescue',name:'Ratownik',task:'Wybiera, co zrobić po oszustwie, i nadaje plakatowi tytuł.'}
];
export const comicMax=7; // kolejność 2 + punkty przerwania 3 + reakcja 2
export const bubbleMin=12;

export const scenarioById=id=>scenarios.find(s=>s.id===id);
export function chooseScenario(state={},id){
 if(state.scenario===id||!scenarioById(id))return state;
 return {scenario:id,title:state.title||''}; // zmiana historii zaczyna komiks od nowa
}
// Kolejność: uczeń klika kadry po kolei (order = lista id).
export function togglePanel(state={},id){
 if(state.orderCheck?.ok)return state;
 const order=state.order||[];
 return {...state,order:order.includes(id)?order.filter(x=>x!==id):[...order,id],orderCheck:state.orderCheck?{...state.orderCheck,stale:true}:undefined};
}
export function checkOrder(state={}){
 const sc=scenarioById(state.scenario);if(!sc)return state;
 const order=state.order||[],tries=(state.orderCheck?.tries||0)+1;
 if(order.length!==sc.panels.length)return state;
 const wrong=order.map((id,i)=>id===sc.panels[i].id?null:i).filter(i=>i!==null);
 return {...state,orderCheck:{tries,ok:wrong.length===0,wrong}};
}
export function resetOrder(state={}){if(state.orderCheck?.ok)return state;return {...state,order:[],orderCheck:state.orderCheck?{...state.orderCheck,stale:true}:undefined};}

// Punkty przerwania: zaznaczanie STOP na kadrach (po ułożeniu kolejności).
export function toggleStop(state={},id){
 if(!state.orderCheck?.ok||stopsSolved(state))return state;
 const stops=state.stops||[];
 return {...state,stops:stops.includes(id)?stops.filter(x=>x!==id):[...stops,id],stopCheck:state.stopCheck?{...state.stopCheck,stale:true}:undefined};
}
export function checkStops(state={}){
 const sc=scenarioById(state.scenario);if(!sc||!state.orderCheck?.ok)return state;
 const stops=state.stops||[],tries=(state.stopCheck?.tries||0)+1,found={...(state.stopCheck?.found||{})};
 for(const p of sc.panels)if(p.stop&&stops.includes(p.id)&&!found[p.id])found[p.id]=tries;
 const wrong=stops.filter(id=>!sc.panels.find(p=>p.id===id)?.stop);
 const missing=sc.panels.filter(p=>p.stop&&!stops.includes(p.id)).map(p=>p.id);
 return {...state,stopCheck:{tries,found,wrong,missing,penalty:!!(state.stopCheck?.penalty||wrong.length)}};
}
export function stopsSolved(state={}){const c=state.stopCheck;return !!c&&!c.stale&&c.wrong.length===0&&c.missing.length===0;}
export function setBubble(state={},id,text){return {...state,bubbles:{...(state.bubbles||{}),[id]:String(text).slice(0,160)}};}
export function bubblesDone(state={}){
 const sc=scenarioById(state.scenario);if(!sc||!stopsSolved(state))return false;
 return sc.panels.filter(p=>p.stop).every(p=>(state.bubbles?.[p.id]||'').trim().length>=bubbleMin);
}
export function toggleReaction(state={},id){
 if(state.reactCheck?.ok)return state;
 const r=state.reactions||[];
 return {...state,reactions:r.includes(id)?r.filter(x=>x!==id):[...r,id],reactCheck:state.reactCheck?{...state.reactCheck,stale:true}:undefined};
}
export function checkReactions(state={}){
 const r=state.reactions||[],tries=(state.reactCheck?.tries||0)+1;
 const wrong=r.filter(id=>!reactions.find(x=>x.id===id)?.ok);
 const missing=reactions.filter(x=>x.ok&&!r.includes(x.id)).map(x=>x.id);
 return {...state,reactCheck:{tries,ok:!wrong.length&&!missing.length,wrong,missing}};
}
export const titleOk=state=>(state.title||'').trim().length>=5;

export function comicResult(state={}){
 const sc=scenarioById(state.scenario);
 const o=state.orderCheck,r=state.reactCheck;
 const orderPts=o?.ok?(o.tries===1?2:1):0;
 let stopPts=0;
 if(sc&&state.stopCheck){const need=sc.panels.filter(p=>p.stop),f=state.stopCheck.found||{};
  stopPts=Math.round(need.reduce((s,p)=>s+(f[p.id]===1?1:f[p.id]?0.5:0),0)/need.length*3*2)/2;
  if(state.stopCheck.penalty)stopPts=Math.max(0,stopPts-0.5);
  if(!stopsSolved(state))stopPts=Math.min(stopPts,2.5);}
 const reactPts=r?.ok?(r.tries===1?2:1):0;
 const done=!!(sc&&o?.ok&&stopsSolved(state)&&bubblesDone(state)&&r?.ok&&titleOk(state));
 return {done,score:orderPts+stopPts+reactPts,max:comicMax,
  summary:done?`Plakat „${state.title.trim()}”: ${sc.panels.length} kadrów, ${sc.panels.filter(p=>p.stop).length} punkty przerwania`:undefined};
}

// ---------- Tryb 'peer': ocena koleżeńska plakatu (nie liczy się do punktów) ----------
export const peerCriteria=[
 {id:'order',label:'Historia',levels:['Kadry bez ładu, nie wiadomo, co się stało','Da się zrozumieć, ale brakuje kroku','Każdy krok oszustwa jasny i po kolei']},
 {id:'stops',label:'Punkty przerwania',levels:['Brak dymków STOP','Dymki ogólne („uważaj”)','Każdy dymek mówi, CO konkretnie zrobić']},
 {id:'law',label:'Przepis',levels:['Brak przepisu','Przepis bez wyjaśnienia','Przepis wyjaśniony po ludzku']},
 {id:'help',label:'Reakcja i zgłoszenie',levels:['Brak','Jedno miejsce zgłoszenia','Bank, dowody, policja i CERT w dobrej kolejności']}
];
export function ratePeer(state={},id,level){return {...state,ratings:{...(state.ratings||{}),[id]:level}};}
export function peerResult(state={}){
 const r=state.ratings||{};
 const rated=peerCriteria.filter(c=>Number.isInteger(r[c.id])).length;
 const total=peerCriteria.reduce((s,c)=>s+(Number.isInteger(r[c.id])?r[c.id]:0),0);
 const commentOk=(state.tip||'').trim().length>=15;
 const done=rated===peerCriteria.length&&commentOk&&!!state.fixed;
 return {done,rated,total,top:peerCriteria.length*2,summary:done?`Ocena koleżeńska: ${total}/${peerCriteria.length*2}, poprawka wprowadzona`:undefined};
}

// Samodzielny plik HTML z plakatem (do zapisania na dysku). Tekst ucznia jest escapowany.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
export function posterHtml(state={}){
 const sc=scenarioById(state.scenario);if(!sc)return '';
 const panels=sc.panels.map((p,i)=>`<div class="p${p.stop?' s':''}"><b>${i+1}</b><p>${esc(p.text)}</p>${p.stop?`<div class="b">STOP: ${esc(state.bubbles?.[p.id]||'')}</div>`:''}</div>`).join('');
 const acts=reactions.filter(r=>r.ok).map(r=>`<li>${esc(r.text)}</li>`).join('');
 return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(state.title)}</title><style>body{font-family:system-ui,sans-serif;margin:24px;color:#14213d;background:#fff}h1{margin:0 0 4px}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.p{border:2px solid #14213d;border-radius:10px;padding:10px}.p b{display:inline-block;background:#14213d;color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px}.s{border-color:#b42318}.b{background:#fff1f0;border:2px solid #b42318;border-radius:12px;padding:6px 8px;font-weight:700}.l{border:2px solid #1f4fa3;border-radius:10px;padding:10px;margin-top:12px}@media print{.g{grid-template-columns:repeat(3,1fr)}}</style></head><body><h1>${esc(state.title)}</h1><p>${esc(sc.title)}. ${esc(sc.hero)} (Historia fikcyjna.)</p><div class="g">${panels}</div><div class="l"><b>Przepis:</b> ${esc(sc.law)}</div><div class="l"><b>Gdy to już się stało:</b><ol>${acts}</ol></div></body></html>`;
}
