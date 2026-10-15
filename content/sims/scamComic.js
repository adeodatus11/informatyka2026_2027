// Logika sprawdzarki adresów (lekcja 43, tryb 'domains'). Czysty JS, bez Reacta.
// Serwis ogłoszeń „Okazjo” (ten sam co w symulatorze scamChat), sklep i domeny (poza incydent.cert.pl) są fikcyjne.
// Nic nie jest sprawdzane w sieci: wynik „Listy Ostrzeżeń” to część fabuły ćwiczenia.

const part=p=>p?.ok?(p.tries===1?1:0.5):0;

// ---------- Tryb 'domains': 5 adresów i Lista Ostrzeżeń ----------
export const domains=[
 {id:'cert',url:'https://incydent.cert.pl/',from:'Wpisany ręcznie, żeby zgłosić oszustwo',safe:true,listed:false,
  why:'Domena to cert.pl (czytasz od końca do pierwszego „/”). To prawdziwy adres formularza CERT Polska do zgłaszania incydentów.'},
 {id:'fake-sub',url:'https://okazjo.pl.odbior-platnosci.top/karta',from:'Link od „kupującego” na WhatsAppie',safe:false,listed:true,
  why:'Czytaj od końca: domena to odbior-platnosci.top. Początek „okazjo.pl” to tylko przebranie. Strona prosi o dane karty, żeby „odebrać” pieniądze.'},
 {id:'official',url:'https://okazjo.pl/moje-ogloszenia',from:'Aplikacja serwisu ogłoszeń z rozmowy z oszustem',safe:true,listed:false,
  why:'Domena to okazjo.pl: oficjalny adres fikcyjnego serwisu z rozmowy z oszustem. Wszedłeś przez aplikację, a nie przez link od obcej osoby.'},
 {id:'shop',url:'https://sneakers-outlet-70.shop/promo',from:'Reklama „-70%, tylko dziś”',safe:false,listed:true,
  why:'Nowa domena z „-70” w nazwie, końcówka .shop, presja czasu i brak danych firmy. Klasyczny fałszywy sklep.'},
 {id:'fresh',url:'https://okazjo-wyplata.com/odbierz',from:'SMS: „Kupujący opłacił przedmiot. Odbierz 80 zł”',safe:false,listed:false,
  why:'Myślnik zamiast kropki: to zupełnie inna domena niż okazjo.pl. Założono ją wczoraj, więc nie ma jej jeszcze na Liście Ostrzeżeń. Brak na liście nie znaczy, że strona jest bezpieczna.'}
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
