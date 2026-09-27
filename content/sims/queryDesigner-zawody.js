// Zbiór danych „Zawody” dla symulatora projektu kwerendy (lekcja 25, klasa 3):
// tabele, relacje, ściąga i 9 zleceń sędziego zawodów w trzech poziomach (mastery).
// Moduł nie importuje queryDesigner.js (brak zależności cyklicznej) — pomocnicze col/crit są lokalne.
import {tables,fieldTypes,relations,fmtTime} from './zawody-data.js';

const CRIT_ROWS=3;
const col=(field,extra={})=>({field,sort:'',show:true,crit:Array(CRIT_ROWS).fill(''),total:'group',...extra});
const crit=(first,...rest)=>[first,...rest,'',''].slice(0,CRIT_ROWS);
const Z='zawody';

export const zawodyTasks=[
 {dataset:Z,id:'z1a',level:1,title:'Rocznik 2008: dziewczęta',brief:'Sędzia układa listę startową kategorii „rocznik 2008”. Potrzebuje zawodniczek (plec = K) z rocznika 2008: imie, nazwisko, klasa — alfabetycznie po nazwisku.',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Zawodnicy.klasa',label:'klasa'}],order:'Zawodnicy.nazwisko',
  hints:{tooMany:'Potrzebne są DWA warunki w tym samym wierszu Kryteria: "K" w kolumnie plec i 2008 w kolumnie rocznik (odznacz w nich Pokaż). Warunek w wierszu lub to LUB — da za dużo osób.',tooFew:'Sprawdź wartości: płeć to tekst "K", a rocznik to liczba 2008 (bez cudzysłowu).',wrong:'Kryteria: "K" w kolumnie plec, 2008 w kolumnie rocznik — nie w kolumnie klasa.',order:'W kolumnie nazwisko ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Zawodnicy'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko',{sort:'asc'}),col('Zawodnicy.klasa'),col('Zawodnicy.plec',{show:false,crit:crit('"K"')}),col('Zawodnicy.rocznik',{show:false,crit:crit('2008')})]}},
 {dataset:Z,id:'z1b',level:1,title:'Klasy drugie A–Z',brief:'Wychowawcy klas drugich chcą listę swoich zawodników: imie, nazwisko, klasa — wszyscy z 2A, 2B, 2C…, alfabetycznie po nazwisku. Jedno kryterium zamiast trzech!',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Zawodnicy.klasa',label:'klasa'}],order:'Zawodnicy.nazwisko',
  hints:{tooMany:'Użyj wzorca Jak "2*" w kolumnie klasa — gwiazdka to dowolne dalsze znaki.',tooFew:'Samo "2" szuka klasy o nazwie „2”. Potrzebny wzorzec: Jak "2*".',wrong:'Wzorzec Jak "2*" wpisz w kolumnie klasa (nie rocznik — Dawid Baran jest w 2C, choć ma rocznik 2009).',order:'W kolumnie nazwisko ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Zawodnicy'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko',{sort:'asc'}),col('Zawodnicy.klasa',{crit:crit('Jak "2*"')})]}},
 {dataset:Z,id:'z1c',level:1,title:'Kategoria junior 2009–2010',brief:'Do kategorii „junior” wchodzą roczniki od 2009 do 2010 włącznie. Sędzia potrzebuje: imie, nazwisko, rocznik.',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Zawodnicy.rocznik',label:'rocznik'}],
  hints:{tooMany:'Zakres wpisz w kolumnie rocznik: Między 2009 I 2010.',tooFew:'Między … I … obejmuje oba końce. Znak >2009 pominie rocznik 2009 — użyj Między 2009 I 2010 albo >=2009 I <=2010.',wrong:'Kryterium wpisz w kolumnie rocznik (nie klasa).'},
  solution:{tables:['Zawodnicy'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko'),col('Zawodnicy.rocznik',{crit:crit('Między 2009 I 2010')})]}},
 {dataset:Z,id:'z2a',level:2,title:'Podium: 50 m dowolnym dziewcząt',brief:'Dekoracja za 5 minut! Wyniki konkurencji 50 m stylem dowolnym dziewcząt od najlepszego: imie, nazwisko, klasa, czas. Zdyskwalifikowane nie są klasyfikowane — nie mogą być na liście.',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Zawodnicy.klasa',label:'klasa'},{key:'Wyniki.czas',label:'czas'}],order:'Wyniki.czas',
  hints:{tooMany:'Wszystkie warunki w JEDNYM wierszu Kryteria: styl "dowolny", dystans 50, plec "K" (tabela Konkurencje) i dyskwalifikacja <> "tak" (tabela Wyniki).',tooFew:'Czy nie odrzucasz za dużo? Dystans to liczba 50 (bez „m”), a bez dyskwalifikacji to <> "tak" albo "nie".',wrong:'Konkurencję wybierasz w tabeli Konkurencje: "dowolny", 50, "K".',order:'Najlepszy = najkrótszy czas: w kolumnie czas ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Zawodnicy','Wyniki','Konkurencje'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko'),col('Zawodnicy.klasa'),col('Wyniki.czas',{sort:'asc'}),col('Konkurencje.styl',{show:false,crit:crit('"dowolny"')}),col('Konkurencje.dystans',{show:false,crit:crit('50')}),col('Konkurencje.plec',{show:false,crit:crit('"K"')}),col('Wyniki.dyskwalifikacja',{show:false,crit:crit('<> "tak"')})]}},
 {dataset:Z,id:'z2b',level:2,title:'Protokół: dyskwalifikacje',brief:'Do protokołu sędziowskiego: wszystkie dyskwalifikacje — imie i nazwisko zawodnika oraz styl i dystans konkurencji.',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Konkurencje.styl',label:'styl'},{key:'Konkurencje.dystans',label:'dystans'}],
  hints:{tooMany:'W kolumnie dyskwalifikacja (tabela Wyniki) wpisz "tak" i odznacz Pokaż.',tooFew:'Sprawdź pisownię: "tak" w kolumnie dyskwalifikacja.',wrong:'Kryterium "tak" wpisz w kolumnie dyskwalifikacja.'},
  solution:{tables:['Zawodnicy','Wyniki','Konkurencje'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko'),col('Konkurencje.styl'),col('Konkurencje.dystans'),col('Wyniki.dyskwalifikacja',{show:false,crit:crit('"tak"')})]}},
 {dataset:Z,id:'z2c',level:2,title:'Kandydaci do reprezentacji',brief:'Nauczyciel WF-u szuka kandydatów do reprezentacji szkoły: starty na 50 m z czasem poniżej 35 s, bez dyskwalifikacji. Potrzebne: nazwisko, styl, czas — od najlepszego czasu.',
  need:[{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Konkurencje.styl',label:'styl'},{key:'Wyniki.czas',label:'czas'}],order:'Wyniki.czas',
  hints:{tooMany:'Trzy warunki w jednym wierszu: dystans 50, czas <35 i dyskwalifikacja <> "tak". Bez dystansu wpadną wszystkie starty na 25 m.',tooFew:'„Poniżej 35 s” to <35 — sama liczba, bez „s”. Dystans to 50.',wrong:'Czas i dyskwalifikacja są w tabeli Wyniki, dystans w Konkurencje.',order:'W kolumnie czas ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Zawodnicy','Wyniki','Konkurencje'],totals:false,cols:[col('Zawodnicy.nazwisko'),col('Konkurencje.styl'),col('Wyniki.czas',{sort:'asc',crit:crit('<35')}),col('Konkurencje.dystans',{show:false,crit:crit('50')}),col('Wyniki.dyskwalifikacja',{show:false,crit:crit('<> "tak"')})]}},
 {dataset:Z,id:'z3a',level:3,title:'Rekord każdej konkurencji',brief:'Do protokołu: najlepszy czas w każdej konkurencji (bez zdyskwalifikowanych). Potrzebne: styl, dystans i plec konkurencji oraz najlepszy czas.',
  need:[{key:'Konkurencje.styl',label:'styl (Grupuj według)'},{key:'Konkurencje.dystans',label:'dystans (Grupuj według)'},{key:'Konkurencje.plec',label:'plec konkurencji (Grupuj według)'},{key:'min:Wyniki.czas',label:'najlepszy czas (Min)'}],
  hints:{tooMany:'Grupuj tylko według styl, dystans i plec z tabeli Konkurencje — nie według nazwiska ani czasu.',tooFew:'Grupuj według wszystkich trzech pól konkurencji — bez plec dziewczęta i chłopcy wpadną do jednej grupy.',wrong:'Najlepszy = najkrótszy, więc Min (nie Maks). I wyklucz dyskwalifikacje: pole dyskwalifikacja z Podsumowanie: Gdzie i kryterium <> "tak".'},
  solution:{tables:['Wyniki','Konkurencje'],totals:true,cols:[col('Konkurencje.styl'),col('Konkurencje.dystans'),col('Konkurencje.plec'),col('Wyniki.czas',{total:'min'}),col('Wyniki.dyskwalifikacja',{total:'where',show:false,crit:crit('<> "tak"')})]}},
 {dataset:Z,id:'z3b',level:3,title:'Puchar najaktywniejszej klasy',brief:'Puchar dla klasy, która startowała najczęściej! Policz starty każdej klasy: klasa i liczba startów.',
  need:[{key:'Zawodnicy.klasa',label:'klasa (Grupuj według)'},{key:'count:*',label:'liczba startów (Policz)'}],
  hints:{tooMany:'Grupuj tylko według klasy. Każda dodatkowa kolumna z „Grupuj według” dzieli grupy na mniejsze.',tooFew:'Usuń kryteria — liczymy wszystkie starty.',wrong:'Liczymy starty, nie zawodników: w projekcie musi być tabela Wyniki. Zawodnicy.klasa: Grupuj według, Wyniki.id_wyniku: Policz.'},
  solution:{tables:['Zawodnicy','Wyniki'],totals:true,cols:[col('Zawodnicy.klasa'),col('Wyniki.id_wyniku',{total:'count'})]}},
 {dataset:Z,id:'z3c',level:3,title:'Kwerenda „Podaj klasę:”',brief:'Wychowawcy co chwilę pytają: „Jak poszło mojej klasie?”. Zrób jedną kwerendę, która pyta „Podaj klasę:” i pokazuje imie, nazwisko, styl, dystans i czas zawodników tej klasy. Sprawdzimy ją dla 2B (i drugiej, tajnej klasy).',
  need:[{key:'Zawodnicy.imie',label:'imie'},{key:'Zawodnicy.nazwisko',label:'nazwisko'},{key:'Konkurencje.styl',label:'styl'},{key:'Konkurencje.dystans',label:'dystans'},{key:'Wyniki.czas',label:'czas'}],param:'2B',altParam:'3C',
  hints:{tooMany:'Parametr wpisz jako kryterium w kolumnie klasa: [Podaj klasę:].',tooFew:'Parametr musi stać w kolumnie klasa (tabela Zawodnicy), a nie w innej.',wrong:'Parametr wpisz jako kryterium w kolumnie klasa: [Podaj klasę:].'},
  solution:{tables:['Zawodnicy','Wyniki','Konkurencje'],totals:false,cols:[col('Zawodnicy.imie'),col('Zawodnicy.nazwisko'),col('Zawodnicy.klasa',{show:false,crit:crit('[Podaj klasę:]')}),col('Konkurencje.styl'),col('Konkurencje.dystans'),col('Wyniki.czas')]}}
];

const numberExample={czas:'<35 albo <=32,5 (setne po przecinku, bez „s” i bez cudzysłowu)',rocznik:'2008 albo Między 2009 I 2010 (bez cudzysłowu)',dystans:'50 (bez „m” i bez cudzysłowu)'};
export const zawodyQueries={
 title:'Zawody',tables,fieldTypes,order:['Zawodnicy','Wyniki','Konkurencje'],relations,today:null,tasks:zawodyTasks,levels:3,
 labels:{tasks:'Zlecenia sędziego',brief:'Zlecenie od sędziego zawodów',client:'sędzia',clientCap:'Sędzia',tablesHint:'przy wyniku z nazwiskiem i konkurencją potrzebne są trzy tabele',
  paramMissing:{msg:'To ma być kwerenda parametryczna — Access ma zapytać o klasę.',hint:'W kolumnie klasa, w wierszu Kryteria, wpisz pytanie w nawiasie kwadratowym: [Podaj klasę:].'},
  paramOne:'Zostaw jeden parametr w kolumnie klasa.',altWord:'klasy'},
 manyNotes:{Wyniki:' W projekcie jest tabela Wyniki — każdy zawodnik pojawia się tyle razy, ile ma startów. Usuń zbędną tabelę (×).'},
 numberHint:field=>`Pole ${field} jest liczbą — wpisz samą liczbę, np. ${numberExample[field]||'50 (bez cudzysłowu)'}.`,
 // Czas pokazujemy z dwoma miejscami po przecinku (32,40), jak pole Liczba z formatem „Standardowy”.
 format:(key,v)=>v==null?v:/(^|:)Wyniki\.czas$/.test(key)&&typeof v==='number'?fmtTime(v):typeof v==='number'?String(v).replace('.',','):v,
 // Produkt pracy na karcie wyniku: „Oficjalne wyniki zawodów”.
 levelSummary:(level,n)=>[`Listy startowe: ${n}/3`,`Oficjalne wyniki zawodów: ${n}/3 zestawień`,`Protokół sędziowski: ${n}/3 (rekordy, puchar klas, kwerenda „Podaj klasę:”)`][level-1],
 cheat:[['"K" · "2B" · 2008','równe tekstowi lub liczbie (tekst w cudzysłowie, liczba bez)'],['Jak "2*"','wzorzec: klasy 2A, 2B, 2C…'],['<35 · <=32,5 · >2009','porównania liczb (setne po przecinku)'],['Między 2009 I 2010','zakres (z końcami)'],['<> "tak" · "nie"','bez dyskwalifikacji'],['[Podaj klasę:]','parametr — Access zapyta przy uruchomieniu'],['Σ → Min · Policz · Gdzie','najlepszy czas · liczba startów · warunek bez pokazywania']],
 cheatNote:'Czas zapisujemy w sekundach z setnymi (32,46 s). Mniejszy czas = lepszy wynik: ranking to Sortuj: Rosnąco, a najlepszy czas w grupie to Min. Pole dyskwalifikacja to Krótki tekst z wartościami „tak”/„nie”.'
};
