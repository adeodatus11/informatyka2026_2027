// Trzy warstwy strony (HTML, CSS, JavaScript) — uczeń wyłącza je po kolei i widzi, co znika.
export const LAYERS=[
 {id:'html',name:'HTML',file:'menu.html',role:'treść',
  off:'Bez HTML strona jest pusta. CSS nie ma czego pokolorować, a JavaScript nie ma czego uruchomić — obie warstwy działają na elementach z HTML.',
  task:'Wyłącz HTML. Co zostało na stronie?',
  code:`<h1>Pizzeria u Bartka</h1>
<p>Na wynos i na miejscu.</p>
<ul>
  <li>Margherita – 28 zł <button>Dodaj</button></li>
  <li>Pepperoni – 34 zł <button>Dodaj</button></li>
  <li>Wege – 31 zł <button>Dodaj</button></li>
</ul>
<p id="koszyk">Koszyk: 0 zł</p>`},
 {id:'css',name:'CSS',file:'style.css',role:'wygląd',
  off:'Bez CSS treść jest ta sama: nagłówek, lista, ceny, przyciski. Zniknął tylko wygląd — kolory, czcionki, odstępy, zaokrąglenia. Tak wygląda „goły” HTML.',
  task:'Wyłącz CSS. Czego brakuje, a co zostało?',
  code:`h1 { color: white; background: #b3261e; }
body { font-family: Arial, sans-serif; }
li { padding: 8px; border-bottom: 1px solid #ddd; }
button { background: #b3261e; color: white;
         border-radius: 999px; }`},
 {id:'js',name:'JavaScript',file:'skrypt.js',role:'zachowanie',
  off:'Bez JavaScriptu strona wygląda tak samo, ale przyciski nic nie robią: koszyk się nie przelicza. JavaScript to zachowanie — reakcja na kliknięcie.',
  task:'Wyłącz JavaScript i kliknij „Dodaj”. Co się stało?',
  code:`let suma = 0;
for (const przycisk of document.querySelectorAll('button')) {
  przycisk.onclick = () => {
    suma += Number(przycisk.dataset.cena);
    koszyk.textContent = 'Koszyk: ' + suma + ' zł';
  };
}`}
];
export const MENU=[{name:'Margherita',price:28},{name:'Pepperoni',price:34},{name:'Wege',price:31}];
export const initial=()=>({on:{html:true,css:true,js:true},seen:{},cart:0,clicks:0});
// Odkrycie warstwy: html i css — po wyłączeniu; js — po kliknięciu „Dodaj” przy wyłączonym JS.
export function discovered(state){const s=state?.seen||{};return LAYERS.filter(l=>s[l.id]).length;}
export function result(state){const n=discovered(state);return {done:n===LAYERS.length,summary:`Odkryte warstwy: ${n}/${LAYERS.length}`};}
export function toggle(state,id){
 const st=state||initial();const on={...st.on,[id]:!st.on[id]};
 const seen={...st.seen};if(!on[id]&&id!=='js')seen[id]=true;
 return {...st,on,seen};
}
export function add(state,price){
 const st=state||initial();
 if(!st.on.html)return st;
 if(!st.on.js)return {...st,clicks:st.clicks+1,seen:{...st.seen,js:true},deadClick:true};
 return {...st,clicks:st.clicks+1,cart:st.cart+price,deadClick:false};
}
