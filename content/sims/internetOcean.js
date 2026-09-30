// Logika symulatora „Ocean internetu” (lekcja 07). Czysty JS — bez Reacta i DOM.
// Tryb 'minute': gra w szacowanie rzędów wielkości. Tryb 'bubble': jak polubienia kształtują feed.

// Każda statystyka ma 4 odpowiedzi różniące się rzędem wielkości (×10). correct = indeks prawdziwej wartości.
export const minuteStats=[
 {id:'mail',scope:'Świat · co minutę',question:'Ile e-maili wysyła się na świecie w ciągu jednej minuty?',options:['ok. 25 mln','ok. 250 mln','ok. 2,5 mld','ok. 25 mld'],correct:1,value:'ok. 251 milionów e-maili',comment:'Większość to newslettery, powiadomienia i… spam. Twoja skrzynka to kropla w tym oceanie.',source:'Domo, „Data Never Sleeps 12.0” (2025) — szacunek'},
 {id:'yt',scope:'Świat · co minutę',question:'Ile razy w ciągu minuty ktoś zaczyna oglądać film na YouTube?',options:['ok. 3,4 tys.','ok. 34 tys.','ok. 340 tys.','ok. 3,4 mln'],correct:3,value:'ok. 3,4 mln wyświetleń',comment:'Zanim skończysz czytać to zdanie, na YouTube padnie kilkaset tysięcy wyświetleń.',source:'Domo 2025, cytowane przez Forbes (2025) — szacunek'},
 {id:'netflix',scope:'Świat · co minutę',question:'Ile godzin filmów i seriali ogląda się na Netfliksie w ciągu minuty?',options:['ok. 360 tys. godzin','ok. 3,6 mln godzin','ok. 36 mln godzin','ok. 360 mln godzin'],correct:0,value:'ok. 362 tys. godzin',comment:'To ponad 41 lat oglądania — w jedną minutę.',source:'Domo, „Data Never Sleeps 12.0” (2025) — szacunek'},
 {id:'pl',scope:'Polska · 2026',question:'Ile osób w Polsce korzysta z internetu?',options:['ok. 341 tys.','ok. 3,4 mln','ok. 34 mln','ok. 341 mln'],correct:2,value:'ok. 34,1 mln osób (89,8% mieszkańców)',comment:'Prawie 9 na 10 osób w Polsce jest online — więc oszuści też tu są.',source:'DataReportal, „Digital 2026: Poland”'},
 {id:'search',scope:'Świat · na dobę',question:'Ile wyszukiwań dziennie obsługuje najpopularniejsza wyszukiwarka świata?',options:['ok. 850 mln','ok. 8,5 mld','ok. 85 mld','ok. 850 mld'],correct:1,value:'ok. 8,5 mld wyszukiwań na dobę',comment:'Uwaga: różne źródła podają różne liczby, bo firma nie publikuje dokładnych danych. To szacunek — zawsze sprawdzaj, skąd jest liczba.',source:'Szacunki serwisów statystycznych (2025) — źródła się różnią'}
];

// 1 pkt za trafiony rząd wielkości, 0,5 pkt za pomyłkę o jeden rząd („prawie”).
export function guessPoints(stat,guess){if(guess===undefined||guess===null)return 0;const d=Math.abs(guess-stat.correct);return d===0?1:d===1?0.5:0;}
export function guessVerdict(stat,guess){const d=guess-stat.correct;if(d===0)return {ok:true,text:'Trafione! Dobry rząd wielkości.'};if(Math.abs(d)===1)return {ok:false,text:d<0?'Blisko, ale za mało — o jedno zero. +0,5 pkt.':'Blisko, ale za dużo — o jedno zero. +0,5 pkt.'};return {ok:false,text:d<0?'Dużo za mało! Internet jest większy, niż się wydaje.':'Przesadziłeś o kilka zer — ale lepiej przeszacować niż nie docenić.'};}

export function minuteResult(guesses={}){
 const answered=minuteStats.filter(s=>guesses[s.id]!==undefined);
 const score=minuteStats.reduce((sum,s)=>sum+guessPoints(s,guesses[s.id]),0);
 const hits=minuteStats.filter(s=>guesses[s.id]===s.correct).length;
 const done=answered.length===minuteStats.length;
 return {done,score,max:minuteStats.length,summary:answered.length?`Szacowanie: ${hits}/${minuteStats.length} trafionych rzędów wielkości`:undefined};
}

// ---- Bańka filtrująca ----
export const topics=[
 {id:'sport',label:'Sport'},{id:'gry',label:'Gry'},{id:'moda',label:'Moda'},{id:'moto',label:'Motoryzacja'},
 {id:'miasto',label:'Sprawy miasta'},{id:'nauka',label:'Nauka'},{id:'muzyka',label:'Muzyka'},{id:'memy',label:'Memy'}
];
export const feedPosts=[
 {id:'p1',topic:'gry',author:'@PatchNotesPL',text:'Nowa aktualizacja „Kosmicznych Farm”: skiny tańsze o połowę, a traktor w końcu nie wjeżdża w ściany.'},
 {id:'p2',topic:'sport',author:'@KoszZielonkowo',text:'Rzut za 3 w ostatniej sekundzie! Juniorzy KS Orliki wygrywają derby miasta 71:70.'},
 {id:'p3',topic:'moda',author:'@StylNaCodzien',text:'Szerokie spodnie wracają. Znowu. Twoja mama miała rację w 2003 roku.'},
 {id:'p4',topic:'moto',author:'@SkuterTest',text:'Skuter 50 cm³ w mieście: ile realnie pali i ile kosztuje ubezpieczenie dla 16-latka? Liczymy.'},
 {id:'p5',topic:'miasto',author:'@RadaZielonkowa',text:'Nowa ścieżka rowerowa przy technikum. Mieszkańcy mogą zgłaszać uwagi do końca miesiąca.'},
 {id:'p6',topic:'nauka',author:'@NaukaWMinute',text:'Ośmiornica ma trzy serca i niebieską krew. Dwa serca pompują krew przez skrzela, trzecie — przez resztę ciała.'},
 {id:'p7',topic:'muzyka',author:'@ScenaLokalna',text:'Raper z naszego technikum nagrał EP-kę w szkolnej pracowni. Mikrofon za 80 zł, 40 tys. odsłuchów.'},
 {id:'p8',topic:'memy',author:'@MemyOdRana',text:'Ja o 7:59: „zdążę”. Autobus o 7:58: „nie zdążysz”.'},
 {id:'p9',topic:'gry',author:'@TurniejSzkolny',text:'Szkolny turniej e-sportowy: zapisy drużyn 5-osobowych do piątku. Nagroda: klawiatury i sława.'},
 {id:'p10',topic:'sport',author:'@BiegamyRazem',text:'Wspólne bieganie w parku miejskim w każdą sobotę o 9:00. 5 km, za darmo, można iść marszem.'}
];

// Uproszczony model algorytmu: temat startuje z wagą 1, polubienie +3, pominięcie −0,5 (min. 0,2).
export function topicWeights(reactions={}){
 const w=Object.fromEntries(topics.map(t=>[t.id,1]));
 for(const p of feedPosts){const r=reactions[p.id];if(r==='like')w[p.topic]+=3;else if(r==='skip')w[p.topic]=Math.max(0.2,w[p.topic]-0.5);}
 return w;
}
// Udziały procentowe (suma dokładnie 100, metoda największych reszt).
export function feedShares(reactions={}){
 const w=topicWeights(reactions),total=Object.values(w).reduce((a,b)=>a+b,0);
 const raw=topics.map(t=>({id:t.id,label:t.label,exact:w[t.id]/total*100}));
 const rows=raw.map(r=>({...r,share:Math.floor(r.exact)}));let rest=100-rows.reduce((s,r)=>s+r.share,0);
 [...rows].sort((a,b)=>(b.exact-b.share)-(a.exact-a.share)||topics.findIndex(t=>t.id===a.id)-topics.findIndex(t=>t.id===b.id)).forEach(r=>{if(rest>0){r.share++;rest--;}});
 return rows.map(({id,label,share})=>({id,label,share}));
}
// Osoba „z drugiej strony”: polubiła to, co Ty pominąłeś, i pominęła to, co polubiłeś.
export function oppositeReactions(reactions={}){return Object.fromEntries(Object.entries(reactions).map(([k,v])=>[k,v==='like'?'skip':v==='skip'?'like':v]));}
export function topTopics(shares,n=2){return [...shares].sort((a,b)=>b.share-a.share).slice(0,n);}
// Ile tematów prawie znika z feedu (< 5%)
export function hiddenTopics(shares){return shares.filter(s=>s.share<5);}
export function bubbleResult(reactions={}){
 const count=feedPosts.filter(p=>reactions[p.id]).length,done=count===feedPosts.length;
 const shares=feedShares(reactions),top=topTopics(shares,2);const topSum=top.reduce((s,t)=>s+t.share,0);
 return {done,score:done?1:0,max:1,summary:done?`Bańka: ${top.map(t=>t.label).join(' + ')} = ${topSum}% Twojego feedu`:undefined};
}
