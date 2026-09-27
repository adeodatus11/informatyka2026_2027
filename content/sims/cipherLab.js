// Logika symulatora cipherLab (lekcja 16: szyfrowanie podstawieniowe). Bez Reacta i DOM — testy: tests/sims-g2-concepts.test.mjs
export const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PL={'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z'};
export const PL_PAIRS=[['ą','a'],['ć','c'],['ę','e'],['ł','l'],['ń','n'],['ó','o'],['ś','s'],['ź','z'],['ż','z']];

/* ───────── podstawy ───────── */
export const stripPolish=s=>String(s??'').replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,ch=>PL[ch]);
export const normalize=s=>stripPolish(s).toUpperCase();
export const lettersOnly=s=>normalize(s).replace(/[^A-Z]/g,'');
export const letterCount=s=>lettersOnly(s).length;
export const mod26=k=>((Math.round(Number(k)||0)%26)+26)%26;
export const shiftLetter=(ch,k)=>ALPHABET[(ALPHABET.indexOf(ch)+mod26(k))%26];
/** Szyfr Cezara: każdą literę A–Z przesuwa o klucz; spacje, cyfry i znaki interpunkcyjne zostają. Polskie litery najpierw → łacińskie. */
export function caesar(text,key){return normalize(text).replace(/[A-Z]/g,ch=>shiftLetter(ch,key));}
export const caesarDecrypt=(text,key)=>caesar(text,-mod26(key));
export const caesarTable=key=>[...ALPHABET].map(p=>({plain:p,cipher:shiftLetter(p,key)}));

/* GA-DE-RY-PO-LU-KI: litery w parze zamieniają się miejscami, reszta bez zmian. Ta sama operacja szyfruje i deszyfruje. */
export const GADERY_PAIRS=[['G','A'],['D','E'],['R','Y'],['P','O'],['L','U'],['K','I']];
const GMAP=Object.fromEntries(GADERY_PAIRS.flatMap(([a,b])=>[[a,b],[b,a]]));
export function gaderypoluki(text){return normalize(text).replace(/[A-Z]/g,ch=>GMAP[ch]||ch);}

/** Porównanie odpowiedzi: liczą się tylko litery (spacje, przecinki i wielkość liter nie mają znaczenia, ó = o). */
export const sameLetters=(a,b)=>lettersOnly(a)===lettersOnly(b)&&lettersOnly(a).length>0;
/** Wskazówka prowadząca do poprawy: co się nie zgadza. */
export function diffHint(input,expected){
 const a=lettersOnly(input),b=lettersOnly(expected);
 if(!a.length)return 'Wpisz odpowiedź — liczą się tylko litery, spacje możesz pominąć.';
 if(a.length!==b.length)return `Masz ${a.length} ${pl(a.length,'literę','litery','liter')}, a powinno być ${b.length}. Sprawdź, czy nie zgubiłeś litery albo nie dopisałeś zbędnej.`;
 const wrong=[...a].map((c,i)=>c!==b[i]?i:-1).filter(i=>i>=0);
 const first=wrong[0];
 return `Nie zgadza się ${wrong.length} ${pl(wrong.length,'litera','litery','liter')}. Pierwsza pomyłka: ${first+1}. litera (wpisałeś ${a[first]}). Sprawdź ją w tabeli podstawień.`;
}
export function pl(n,one,few,many){const d=n%10,t=n%100;return n===1?one:d>=2&&d<=4&&(t<12||t>14)?few:many;}
/** Punkty za zadanie: pełne za pierwszą próbę, połowa po poprawce. */
export const taskPoints=(solvedAt,full=2)=>!solvedAt?0:solvedAt===1?full:full/2;
/** Zapis próby odpowiedzi (wspólny dla zadań tekstowych i pytań wyboru). */
export function attempt(prev={},ok){const tries=(prev.tries||0)+1;if(prev.solved)return prev;return {...prev,tries,solved:ok,solvedAt:ok?tries:undefined,last:ok?'ok':'bad'};}

/* ───────── tryb 'caesar' ───────── */
export const caesarTasks=[
 {id:'enc',kind:'encrypt',plain:'Kartkówka jutro',key:3,prompt:'Zaszyfruj kluczem 3 wiadomość „Kartkówka jutro”.',tip:'Polską literę ó najpierw zamień na o. Potem każdą literę przesuń o 3 w prawo: K → N, A → D…'},
 {id:'dec',kind:'decrypt',plain:'Pizza po lekcjach',key:7,prompt:'Kolega przysłał szyfrogram. Wiesz, że klucz to 7. Odszyfruj go.',tip:'Deszyfrowanie to przesunięcie w lewo o klucz. Ustaw w narzędziu „Deszyfruj” i klucz 7 albo cofaj się o 7 liter w tabeli.'},
 {id:'keys',kind:'choice',prompt:'Ile różnych kluczy, które naprawdę zmieniają tekst, ma szyfr Cezara na alfabecie 26 liter?',options:['3','25','26 · 26 = 676','nieskończenie wiele'],correct:1,
  explain:'Klucz 0 nic nie zmienia, a klucz 26 to znów obrót o pełne koło, czyli to samo co 0. Zostaje 25 kluczy — łamacz sprawdzi je wszystkie w kilka minut, komputer w ułamek sekundy.',
  tip:'Pokręć tarczą: co się dzieje z kluczem 26? I czy klucz 0 cokolwiek szyfruje?'}
];
export const caesarTaskCipher=t=>t.kind==='decrypt'?caesar(t.plain,t.key):null;
export const caesarExpected=t=>t.kind==='encrypt'?caesar(t.plain,t.key):t.kind==='decrypt'?normalize(t.plain):null;
export function checkCaesarTask(task,input){
 if(task.kind==='choice'){const ok=Number(input)===task.correct;return {ok,message:ok?task.explain:`Jeszcze nie. ${task.tip}`};}
 const exp=caesarExpected(task);const ok=sameLetters(input,exp);
 return {ok,message:ok?(task.kind==='encrypt'?`Dobrze: ${exp}. Zauważ, że ó zamieniło się w o, zanim przesunęliśmy litery.`:`Dobrze: ${exp}. Deszyfrowanie = przesunięcie o klucz w przeciwną stronę.`):`${diffHint(input,exp)} ${task.tip}`};
}
export function tasksResult(tasks,state={},full=2,label){
 const solved=tasks.filter(t=>state[t.id]?.solved);
 const score=solved.reduce((s,t)=>s+taskPoints(state[t.id].solvedAt,full),0);
 return {done:solved.length===tasks.length,score,max:tasks.length*full,solvedCount:solved.length,summary:solved.length?`${label}: ${solved.length}/${tasks.length} zadań`:undefined};
}
export const caesarResult=v=>{const r=tasksResult(caesarTasks,v?.tasks,2,'Szyfr Cezara');if(r.done)r.summary=`Szyfr Cezara: ${caesarExpected(caesarTasks[0])} (klucz 3)`;return r;};

/* ───────── tryb 'gaderypoluki' ───────── */
export const gaderyTasks=[
 {id:'word',kind:'decrypt',cipher:gaderypoluki('Ognisko'),plain:'Ognisko',hand:true,prompt:'Najpierw ręcznie, jak harcerze: odszyfruj słowo z kartki.',tip:'Każdą literę z pary zamień na tę drugą: G ↔ A, D ↔ E, R ↔ Y, P ↔ O, L ↔ U, K ↔ I. Litery spoza par zostają.'},
 {id:'sentence',kind:'decrypt',cipher:gaderypoluki('Zbiórka w piątek przy szkole'),plain:'Zbiórka w piątek przy szkole',prompt:'Maszyna odblokowana. Odszyfruj wiadomość drużynowego.',tip:'Wpisz szyfrogram do maszyny i przeczytaj wynik. Nie ma osobnego przycisku „deszyfruj” — i to jest wskazówka.'},
 {id:'same',kind:'choice',prompt:'Wpisałeś szyfrogram do maszyny, która SZYFRUJE — i wyszedł tekst jawny. Dlaczego?',options:['Maszyna ma ukryty tryb deszyfrowania','Zamiana par jest odwracalna sama przez siebie: G → A, a potem A → G. Szyfrowanie i deszyfrowanie to ta sama operacja','To przypadek — zadziałało tylko dla tej wiadomości'],correct:1,
  explain:'Właśnie tak. Zamiana w parach działa jak przełącznik: dwa razy to samo = powrót do startu. W Cezarze jest inaczej — deszyfrujesz przesunięciem w drugą stronę.',
  tip:'Zaszyfruj jedno słowo dwa razy pod rząd. Co dostajesz?'}
];
export function checkGaderyTask(task,input){
 if(task.kind==='choice'){const ok=Number(input)===task.correct;return {ok,message:ok?task.explain:`Jeszcze nie. ${task.tip}`};}
 const exp=normalize(task.plain);const ok=sameLetters(input,exp);
 return {ok,message:ok?`Dobrze: ${exp}.`:`${diffHint(input,exp)} ${task.tip}`};
}
export const gaderyResult=v=>{const r=tasksResult(gaderyTasks,v?.tasks,2,'GA-DE-RY-PO-LU-KI');if(r.done)r.summary=`GA-DE-RY-PO-LU-KI: odczytano „${normalize(gaderyTasks[1].plain)}”`;return r;};

/* ───────── tryb 'duel' ───────── */
export const MIN_LETTERS=12;
export function encryptWith(method,text,key){return method==='gadery'?gaderypoluki(text):caesar(text,key);}
export function validateMessage(text){
 const n=letterCount(text);
 if(n<MIN_LETTERS)return {ok:false,message:`Za krótko: ${n} ${pl(n,'litera','litery','liter')}. Potrzeba co najmniej ${MIN_LETTERS} — krótkie wiadomości łamie się zbyt łatwo, a za długie trudno podyktować.`};
 if(n>60)return {ok:false,message:'Za długo — maksymalnie 60 liter, żeby partner zdążył przepisać.'};
 return {ok:true,message:`${n} liter — w sam raz.`};
}
/** Czy odczytany tekst pasuje do szyfrogramu przy jakimś kluczu Cezara albo GA-DE-RY-PO-LU-KI? */
export function matchCipher(cipher,plain){
 const c=lettersOnly(cipher),p=lettersOnly(plain);
 if(!c.length||c.length!==p.length)return {ok:false};
 for(let k=0;k<26;k++)if(lettersOnly(caesar(p,k))===c)return {ok:true,method:'caesar',key:k};
 if(lettersOnly(gaderypoluki(p))===c)return {ok:true,method:'gadery'};
 return {ok:false};
}
export const allShifts=cipher=>Array.from({length:25},(_,i)=>({key:i+1,text:caesarDecrypt(cipher,i+1)}));
export const soloPuzzles=[
 {plain:'Jutro kartkówki nie będzie',key:9},
 {plain:'Kod do szafki to siedem jeden dwa',key:17},
 {plain:'Spotkanie przy boisku po lekcjach',key:4}
].map(p=>({...p,cipher:caesar(p.plain,p.key)}));
export function formatTime(ms){const s=Math.max(0,Math.round((ms||0)/1000));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
export function duelResult(v={}){
 const a=v.a||{},b=v.b||{},s=v.solo||{};
 const aPts=a.locked?2:0;
 const pairPts=b.confirmed?(b.fails?3:4):0;
 const soloPts=s.solved?(s.solvedAt===1?4:3):0;
 const bPts=Math.max(pairPts,soloPts);
 const src=pairPts>=soloPts&&b.confirmed?b:s.solved?s:null;
 const parts=[];if(a.locked)parts.push(`zaszyfrowano ${letterCount(a.text)} liter`);
 if(src){const t=src.recTries??src.keyTries??0,ms=src.recMs??src.ms;parts.push(`złamano szyfr w ${t} ${pl(t,'próbie','próbach','próbach')}${ms?` (${formatTime(ms)})`:''}`);}
 return {done:aPts>0&&bPts>0,score:aPts+bPts,max:6,aPts,bPts,summary:parts.length?`Pojedynek: ${parts.join(', ')}`:undefined};
}

/* ───────── tryb 'crack' — analiza częstości ───────── */
// Klucz: kolejne litery klawiatury QWERTY (A→Q, B→W, C→E…). Żadna litera nie przechodzi sama w siebie.
export const CRACK_KEY='QWERTYUIOPASDFGHJKLZXCVBNM';
export const CRACK_PLAIN='Cześć. Jeśli to czytasz, szyfr jest złamany bez znajomości klucza. Pomogła analiza częstości: w dłuższym tekście po polsku najczęściej widać te same litery, a szyfr podstawieniowy tego nie ukrywa. Każda litera ma zawsze ten sam zamiennik, więc wystarczy policzyć znaki i zgadywać słowa. Tę metodę opisał już w dziewiątym wieku arabski uczony al-Kindi. Hasło końcowe to Rejewski';
export const CRACK_PASSWORD='REJEWSKI';
export function monoEncrypt(text,key){return normalize(text).replace(/[A-Z]/g,ch=>key[ALPHABET.indexOf(ch)]);}
export const crackCipher=monoEncrypt(CRACK_PLAIN,CRACK_KEY);
/** Prawidłowe odwzorowanie: litera szyfrogramu → litera tekstu jawnego. */
export const crackSolution=Object.fromEntries([...ALPHABET].map((p,i)=>[CRACK_KEY[i],p]));
/** Przybliżona częstość liter w polskich tekstach (%), po zamianie ą→a, ę→e, ż/ź→z itd. Źródło: zestawienia korpusowe; wartości zaokrąglone. */
export const PL_FREQ=[['A',9.9],['E',8.8],['O',8.6],['I',8.2],['Z',6.5],['N',5.7],['S',5.0],['R',4.7],['W',4.7],['C',4.4],['T',4.0],['L',3.9],['Y',3.8],['K',3.5],['D',3.3],['P',3.1],['M',2.8],['U',2.5],['J',2.3],['B',1.5],['G',1.4],['H',1.1]];
export function letterFreq(text){
 const l=lettersOnly(text);const c={};for(const ch of l)c[ch]=(c[ch]||0)+1;
 return Object.entries(c).map(([letter,count])=>({letter,count,pct:Math.round(count/l.length*1000)/10})).sort((a,b)=>b.count-a.count||a.letter.localeCompare(b.letter));
}
export const crackFreq=letterFreq(crackCipher);
/** Tekst po podstawieniu przypuszczeń: [{ch, plain|null, letter:bool}] */
export function applyGuess(cipher,guess={}){return [...cipher].map(ch=>/[A-Z]/.test(ch)?{ch,plain:guess[ch]||null,letter:true}:{ch,plain:ch,letter:false});}
export function guessText(cipher,guess={}){return applyGuess(cipher,guess).map(x=>x.letter?(x.plain||'·'):x.ch).join('');}
/** Litery tekstu jawnego przypisane więcej niż jednej literze szyfrogramu (błąd — w szyfrze podstawieniowym zamiennik jest jeden). */
export function duplicates(guess={}){const seen={};for(const [c,p] of Object.entries(guess))if(p)(seen[p]=seen[p]||[]).push(c);return Object.fromEntries(Object.entries(seen).filter(([,l])=>l.length>1));}
export function crackProgress(guess={}){const letters=crackFreq.map(f=>f.letter);const correct=letters.filter(c=>guess[c]===crackSolution[c]).length;return {correct,total:letters.length,assigned:letters.filter(c=>guess[c]).length};}
/** Podpowiedź płatna: najczęstsza litera szyfrogramu, która nie ma jeszcze poprawnego przypisania. */
export function hintLetter(guess={}){const f=crackFreq.find(x=>guess[x.letter]!==crackSolution[x.letter]);return f?{cipher:f.letter,plain:crackSolution[f.letter]}:null;}
export const FREE_TIPS=[
 'Najczęstsza litera szyfrogramu to prawie na pewno A, E, O albo I. Porównaj oba wykresy.',
 'Jednoliterowe słowa po polsku to zwykle: a, i, o, u, w, z. W tym tekście jest ich kilka — znajdź je.',
 'Znany fragment: wiadomość zaczyna się od słowa „Cześć”, pisanego bez polskich znaków — CZESC. Kryptolodzy nazywają to „ściągą”.',
 'Końcówki słów: po polsku często -A, -E, -Y, -I, -EGO, -OWY. Szukaj też powtarzających się słów, np. SZYFR.'
];
export function checkPassword(input){const ok=lettersOnly(input)===CRACK_PASSWORD;return {ok,message:ok?'Hasło przyjęte: REJEWSKI. Marian Rejewski w grudniu 1932 r. złamał szyfr niemieckiej maszyny Enigma — dzięki matematyce, nie zgadywaniu. Razem z Jerzym Różyckim i Henrykiem Zygalskim, absolwentami Uniwersytetu Poznańskiego, pracował w Biurze Szyfrów w Warszawie.':(lettersOnly(input).length?'To nie to hasło. Hasło to ostatnie słowo wiadomości — dokończ przypisywanie liter, aż cały tekst będzie miał sens.':'Wpisz hasło końcowe — ostatnie słowo odszyfrowanej wiadomości.')};}
export function crackResult(v={}){
 const hints=v.hints||0,wrong=v.wrong||0;
 const score=v.solved?Math.max(3,8-hints-wrong):0;
 return {done:!!v.solved,score,max:8,summary:v.solved?`Złamany szyfr: ${CRACK_PASSWORD}${hints?` (podpowiedzi: ${hints})`:' — bez odkrywania liter'}`:undefined};
}
