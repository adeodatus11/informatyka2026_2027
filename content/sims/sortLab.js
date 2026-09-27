// Logika symulatora sortLab (lekcja 18: algorytmy porządkowania). Bez Reacta i DOM — testy: tests/sims-g2-concepts.test.mjs
// Liczymy dwie operacje: porównanie (czy lewa > prawa?) i zamianę/przesunięcie elementu.

export const isSorted=a=>a.every((x,i)=>i===0||a[i-1]<=x);
/** Liczba inwersji = par (i<j) w złej kolejności = najmniejsza liczba zamian sąsiadów potrzebna do posortowania. */
export function inversions(a){let n=0;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]>a[j])n++;return n;}

/* ───────── sortowanie bąbelkowe (wersja podstawowa: zawsze n − 1 przejść) ───────── */
export function bubbleTrace(input){
 const a=[...input],n=a.length,steps=[];let comparisons=0,swaps=0;
 for(let pass=0;pass<n-1;pass++){
  for(let j=0;j<n-1-pass;j++){
   const before=[...a];comparisons++;const swap=a[j]>a[j+1];
   if(swap){[a[j],a[j+1]]=[a[j+1],a[j]];swaps++;}
   steps.push({before,after:[...a],pair:[j,j+1],swap,pass:pass+1,sortedFrom:n-pass,comparisons,swaps,endOfPass:j===n-2-pass});
  }
 }
 return {steps,comparisons,swaps,result:a};
}
/** Samo liczenie operacji (bez zapisu kroków — szybkie także dla 1000 liczb). */
export function bubbleCount(input){const a=[...input],n=a.length;let comparisons=0,swaps=0;for(let p=0;p<n-1;p++)for(let j=0;j<n-1-p;j++){comparisons++;if(a[j]>a[j+1]){const t=a[j];a[j]=a[j+1];a[j+1]=t;swaps++;}}return {comparisons,swaps};}
export function bubbleAfterPass(input,passes=1){const a=[...input];for(let p=0;p<passes;p++)for(let j=0;j<a.length-1-p;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]];return a;}
/** Wzór na liczbę porównań w wersji podstawowej: (n−1) + (n−2) + … + 1 = n(n−1)/2 */
export const bubbleComparisons=n=>n*(n-1)/2;

/* ───────── sortowanie przez wstawianie (jak karty w ręce) ───────── */
export function insertionTrace(input){
 const a=[...input],n=a.length,steps=[];let comparisons=0,swaps=0;
 for(let i=1;i<n;i++){
  let j=i;
  while(j>0){
   const before=[...a];comparisons++;const swap=a[j-1]>a[j];
   if(swap){[a[j-1],a[j]]=[a[j],a[j-1]];swaps++;}
   steps.push({before,after:[...a],pair:[j-1,j],swap,round:i,hand:i,key:j,comparisons,swaps,endOfRound:!swap||j===1});
   if(!swap)break;j--;
  }
 }
 return {steps,comparisons,swaps,result:a};
}
export function insertionCount(input){const a=[...input];let comparisons=0,swaps=0;for(let i=1;i<a.length;i++){let j=i;while(j>0){comparisons++;if(a[j-1]>a[j]){const t=a[j];a[j]=a[j-1];a[j-1]=t;swaps++;j--;}else break;}}return {comparisons,swaps};}
export function insertionAfter(input,rounds){const a=[...input];for(let i=1;i<=rounds&&i<a.length;i++){let j=i;while(j>0&&a[j-1]>a[j]){[a[j-1],a[j]]=[a[j],a[j-1]];j--;}}return a;}

/* ───────── dane deterministyczne (każdy uczeń widzi to samo) ───────── */
export function rng(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function randomArray(n,seed=7){const r=rng(seed);return Array.from({length:n},()=>1+Math.floor(r()*999));}
/** Prawie posortowane: posortowana lista + kilka zamian sąsiadów (ok. 3% elementów), np. ranking po dopisaniu kilku nowych wyników. */
export function nearlySorted(n,seed=11){const r=rng(seed);const a=randomArray(n,seed).sort((x,y)=>x-y);const k=Math.max(1,Math.round(n*0.03));for(let t=0;t<k;t++){const i=Math.floor(r()*(n-1));[a[i],a[i+1]]=[a[i+1],a[i]];}return a;}
export const RACE_SIZES=[10,100,1000];
export const RACE_KINDS=[{id:'random',label:'Losowe'},{id:'nearly',label:'Prawie posortowane'}];
export function raceData(n,kind){return kind==='nearly'?nearlySorted(n,11+n):randomArray(n,7+n);}
export function raceRun(n,kind){const a=raceData(n,kind);return {n,kind,bubble:bubbleCount(a),insertion:insertionCount(a)};}
export const raceTable=()=>RACE_KINDS.flatMap(k=>RACE_SIZES.map(n=>raceRun(n,k.id)));
export const fmtNum=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
/** Czas pracy człowieka, gdyby jedno porównanie trwało 1 sekundę. */
export function humanTime(ops){const s=Math.round(ops);if(s<60)return `${s} s`;const m=Math.floor(s/60);if(m<60)return `${m} min ${s%60} s`;const h=Math.floor(m/60);if(h<48)return `${h} h ${m%60} min`;const d=Math.round(h/24*10)/10;return `${String(d).replace('.',',')} dnia`;}

/* ───────── pytania z przewidywaniem (2 pkt za pierwszą próbę, 1 pkt po poprawce) ───────── */
export const taskPoints=(solvedAt,full=2)=>!solvedAt?0:solvedAt===1?full:full/2;
export function attempt(prev={},ok){if(prev.solved)return prev;const tries=(prev.tries||0)+1;return {...prev,tries,solved:ok,solvedAt:ok?tries:undefined,last:ok?'ok':'bad'};}
const L=a=>a.join(', ');
export const WORKED=[34,12,51,8,27,19];
const Q5=[40,25,60,10,35];
export const bubbleQuestions=[
 {id:'pass1',prompt:`Lista: ${L(Q5)}. Jak wygląda po 1. przejściu sortowania bąbelkowego?`,options:[L([10,25,35,40,60]),L(bubbleAfterPass(Q5,1)),L([25,40,60,10,35])],correct:1,
  explain:'Po 1. przejściu największa liczba (60) „wypływa” na koniec, ale reszta nie musi być jeszcze ułożona: 25, 40, 10, 35, 60.',tip:'Idź parami od lewej: 40 i 25 — zamiana; 40 i 60 — bez zmian; 60 i 10 — zamiana; 60 i 35 — zamiana. Całość po jednym przejściu rzadko jest gotowa.'},
 {id:'cmp1',prompt:'Ile porównań wykona sortowanie bąbelkowe w 1. przejściu dla 6 liczb?',options:['5','6','15','36'],correct:0,
  explain:'6 liczb to 5 par sąsiadów: (1,2), (2,3), (3,4), (4,5), (5,6). Każda para = 1 porównanie.',tip:'Policz pary sąsiadów, a nie liczby. Między 6 kartami jest 5 „szczelin”.'},
 {id:'cmpAll',prompt:'A ile porównań łącznie wykona wersja podstawowa dla 6 liczb (5 przejść, każde o jedną parę krótsze)?',options:['5','15','21','36'],correct:1,
  explain:'5 + 4 + 3 + 2 + 1 = 15. Ogólnie: n(n − 1)/2. Dla 6 liczb 15, dla 100 liczb już 4950.',tip:'W 1. przejściu 5 porównań, w 2. — 4 (ostatnia liczba już jest na miejscu), potem 3, 2, 1. Dodaj.'}
];
const HAND=[12,34,51],Q5b=[50,20,40,10,30];
export const insertionQuestions=[
 {id:'hand',prompt:`W ręce masz posortowane karty ${L(HAND)}. Bierzesz kartę 27 i porównujesz ją od prawej. Ile porównań wykonasz, zanim ją wstawisz?`,options:['1','2','3','4'],correct:2,
  explain:'27 < 51 → przesuń, 27 < 34 → przesuń, 27 > 12 → stop, wstaw za 12. Razem 3 porównania i 2 przesunięcia: 12, 27, 34, 51.',tip:'Porównuj po kolei z 51, potem z 34, potem z 12. Zatrzymujesz się, gdy trafisz na mniejszą.'},
 {id:'step2',prompt:`Lista: ${L(Q5b)}. Jak wygląda po wstawieniu drugiej i trzeciej karty (pierwsze trzy karty są już w ręce)?`,options:[L([10,20,30,40,50]),L([20,50,40,10,30]),L(insertionAfter(Q5b,2))],correct:2,
  explain:'Najpierw 20 przed 50: 20, 50. Potem 40 między nimi: 20, 40, 50. Reszta (10, 30) jeszcze leży na stole: 20, 40, 50, 10, 30.',tip:'Wstawianie porządkuje tylko karty w ręce. Karty 10 i 30 jeszcze nie były ruszane.'},
 {id:'sorted',prompt:'Lista jest już posortowana: 1, 2, 3, 4, 5, 6. Ile porównań wykona sortowanie przez wstawianie?',options:['0','5','15','36'],correct:1,
  explain:'Każdą kolejną kartę porównujesz raz z sąsiadem, widzisz, że jest większa, i od razu zostawiasz. 5 kart × 1 porównanie = 5. Bąbelkowe (wersja podstawowa) i tak zrobi 15.',tip:'Weź kartę 2: jedno porównanie z 1 i już wiesz, że stoi dobrze. Tak samo z każdą następną.'}
];
export const raceQuestions=[
 {id:'grow',prompt:'Bąbelkowe: 10 liczb → 45 porównań, 100 liczb → 4950. Ile porównań dla 1000 liczb?',options:['około 49 500 (10 razy więcej)','około 500 000 (100 razy więcej)','około 5 000 000 (1000 razy więcej)'],correct:1,
  explain:`Dokładnie ${fmtNum(bubbleComparisons(1000))}. Liczba porównań rośnie jak n²: 10 razy więcej danych ≈ 100 razy więcej pracy.`,tip:'Wzór to n(n − 1)/2. Podstaw n = 1000 albo uruchom wyścig dla 1000 liczb i odczytaj licznik.'},
 {id:'nearly',prompt:'Ranking w grze jest prawie posortowany — dopisano kilka nowych wyników. Która metoda wygra?',options:['Bąbelkowe','Przez wstawianie','Remis — obie wykonają tyle samo porównań'],correct:1,
  explain:'Wstawianie: prawie każda karta od razu „pasuje”, więc wystarczy ok. 1 porównanie na element. Bąbelkowe w wersji podstawowej zawsze robi n(n − 1)/2 porównań.',tip:'Uruchom wyścig z danymi „Prawie posortowane” i porównaj liczniki.'},
 {id:'shop',prompt:'Sklep internetowy sortuje 1 000 000 produktów po cenie. Dlaczego nie używa sortowania bąbelkowego?',options:['Bo bąbelkowe nie działa dla cen z groszami','Bo to ok. 500 miliardów porównań — sklepy używają szybszych metod (np. sortowanie przez scalanie, quicksort, wbudowane sort()), którym wystarczy ok. 20 milionów','Bo komputer i tak sortuje każdą listę natychmiast — metoda nie ma znaczenia'],correct:1,
  explain:'1 000 000 · 999 999 / 2 ≈ 500 mld porównań. Szybkie metody potrzebują ok. n · log₂ n ≈ 20 mln — 25 000 razy mniej. Dlatego programiści korzystają z gotowego sort() w swoim języku.',tip:'Policz n(n − 1)/2 dla miliona. Metoda ma znaczenie, gdy danych jest dużo.'}
];
export function questionsResult(qs,state={},label){
 const solved=qs.filter(q=>state[q.id]?.solved);const score=solved.reduce((s,q)=>s+taskPoints(state[q.id].solvedAt),0);
 return {done:solved.length===qs.length,score,max:qs.length*2,summary:solved.length?`${label}: ${solved.length}/${qs.length} przewidywań`:undefined};
}
export const bubbleResult=v=>questionsResult(bubbleQuestions,v?.q,'Bąbelkowe');
export const insertionResult=v=>questionsResult(insertionQuestions,v?.q,'Przez wstawianie');
export function raceResult(v={}){const r=questionsResult(raceQuestions,v.q,'Wyścig');if(r.done)r.summary='Wniosek z wyścigu: 10× więcej danych ≈ 100× więcej porównań (n²)';return r;}

/* ───────── tryb 'manual' — pokonaj algorytm ───────── */
export const MANUAL_ROUNDS=[
 {id:'open',hidden:false,title:'Runda 1: widzisz liczby',values:[42,7,93,15,68,3,81,29]},
 {id:'blind',hidden:true,title:'Runda 2: jak komputer — liczby zakryte',values:[55,12,90,34,71,5,48,26]}
];
export const CARD_IDS='ABCDEFGH';
export const roundCards=r=>r.values.map((v,i)=>({id:CARD_IDS[i],v}));
export const orderValues=(round,order)=>order.map(id=>round.values[CARD_IDS.indexOf(id)]);
export const startOrder=round=>[...CARD_IDS.slice(0,round.values.length)];
export function roundBench(round){return {bubble:bubbleCount(round.values),insertion:insertionCount(round.values),minSwaps:inversions(round.values)};}
/** Zamiana dwóch sąsiednich kart (pozycje i, i+1). */
export function swapAdjacent(order,i,j){const [x,y]=[Math.min(i,j),Math.max(i,j)];if(y-x!==1)throw new Error('Zamieniać można tylko sąsiednie karty.');const o=[...order];[o[x],o[y]]=[o[y],o[x]];return o;}
export function compareCards(round,a,b){const va=round.values[CARD_IDS.indexOf(a)],vb=round.values[CARD_IDS.indexOf(b)];return va<vb?'<':va>vb?'>':'=';}
/** Sprawdzenie całej listy kosztuje n − 1 porównań (tyle par sąsiadów trzeba obejrzeć). */
export const CHECK_COST=7;
export function roundScore(round,st={}){
 if(!st.sorted)return 0;const b=roundBench(round);
 if(!round.hidden)return 2+(st.swaps===b.minSwaps?1:0);
 return 2+(st.comparisons<b.bubble.comparisons?1:0);
}
export function manualResult(v={}){
 const [r1,r2]=MANUAL_ROUNDS;const s1=v.rounds?.open||{},s2=v.rounds?.blind||{};
 const score=roundScore(r1,s1)+roundScore(r2,s2);
 const b2=roundBench(r2);
 return {done:!!(s1.sorted&&s2.sorted),score,max:6,summary:s2.sorted?`Ty vs algorytm (runda 2): ${s2.comparisons} porównań · bąbelkowe ${b2.bubble.comparisons} · wstawianie ${b2.insertion.comparisons}`:s1.sorted?`Runda 1: ${s1.swaps} zamian (minimum ${roundBench(r1).minSwaps})`:undefined};
}

/* ───────── tryb 'pseudocode' ───────── */
export const PSEUDO_STEPS=[
 {id:'rep',text:'Powtórz n − 1 razy (to są przejścia):',indent:0},
 {id:'pairs',text:'Idź od lewej do prawej po parach sąsiadów:',indent:1},
 {id:'cmp',text:'Porównaj lewą liczbę z prawą.',indent:2},
 {id:'swap',text:'Jeśli lewa jest większa — zamień je miejscami.',indent:2},
 {id:'end',text:'Koniec: lista jest ułożona rosnąco.',indent:0}
];
export const PSEUDO_SHUFFLED=['swap','end','pairs','rep','cmp'];
export function checkPseudo(order){
 const wrong=order.map((id,i)=>id!==PSEUDO_STEPS[i].id?i:-1).filter(i=>i>=0);
 const ok=order.length===PSEUDO_STEPS.length&&wrong.length===0;
 const tips={rep:'Na zewnątrz jest pętla przejść — ona obejmuje wszystko inne.',pairs:'W każdym przejściu idziesz po parach sąsiadów.',cmp:'Zanim zamienisz, musisz porównać.',swap:'Zamiana jest warunkowa i następuje po porównaniu.',end:'Koniec jest na samym dole, po wszystkich przejściach.'};
 return {ok,wrong,message:ok?'Tak wygląda sortowanie bąbelkowe. Zauważ wcięcia: pętla w pętli — stąd n · n, czyli n². Na lekcji 19 zapiszesz to w Pythonie.':`Złe pozycje: ${wrong.map(i=>i+1).join(', ')}. ${tips[PSEUDO_STEPS[wrong[0]].id]}`};
}
export function pseudoResult(v={}){const score=v.solved?(v.solvedAt===1?2:1):0;return {done:!!v.solved,score,max:2,summary:v.solved?'Pseudokod bąbelkowego ułożony':undefined};}
