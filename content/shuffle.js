// Losowa kolejność odpowiedzi. Ustalana raz na wczytanie strony (dla danego klucza),
// więc nie skacze przy przełączaniu etapów, a po odświeżeniu lub „Wyczyść” losuje się od nowa.
const orders=new Map();
export function shuffledOrder(key,n){
 let order=orders.get(key);
 if(!order||order.length!==n){
  order=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  orders.set(key,order);
 }
 return order;
}
// Wygodny wariant: zwraca pary [indeksOryginalny, element] w wylosowanej kolejności.
export function shuffled(key,items){return shuffledOrder(key,items.length).map(i=>[i,items[i]]);}
