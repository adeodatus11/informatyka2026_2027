// Wspólne, deterministyczne dane bazy „Zawody” (szkolne zawody pływackie) dla lekcji 22 i 25 (klasa 3).
// Wszystkie osoby są FIKCYJNE. Rocznik zgodny z klasą w roku szkolnym 2026/27 (klasa 1 → 2011 … klasa 4 → 2008);
// Dawid Baran (2C, rocznik 2009) powtarza klasę — rocznik i klasa to dwie różne informacje.

export const EVENT_NAME='Szkolne zawody pływackie 2026';

export const fieldTypes={
 Zawodnicy:{id_zawodnika:'autonumber',imie:'text',nazwisko:'text',plec:'text',klasa:'text',rocznik:'number'},
 Wyniki:{id_wyniku:'autonumber',id_zawodnika:'number',id_konkurencji:'number',czas:'number',dyskwalifikacja:'text'},
 Konkurencje:{id_konkurencji:'autonumber',styl:'text',dystans:'number',plec:'text'}
};
export const typeLabels={autonumber:'Autonumerowanie',text:'Krótki tekst',number:'Liczba'};
export const tableKeys={Zawodnicy:'id_zawodnika',Wyniki:'id_wyniku',Konkurencje:'id_konkurencji'};
export const tableNames=['Zawodnicy','Wyniki','Konkurencje'];
// Relacje 1 → wiele (strona „jeden” → strona „wiele”).
export const relations=[
 {one:'Zawodnicy',many:'Wyniki',field:'id_zawodnika'},
 {one:'Konkurencje',many:'Wyniki',field:'id_konkurencji'}
];

const Z=(id_zawodnika,imie,nazwisko,plec,klasa,rocznik)=>({id_zawodnika,imie,nazwisko,plec,klasa,rocznik});
export const zawodnicy=[
 Z(1,'Zuzanna','Nowak','K','1A',2011),
 Z(2,'Lena','Wójcik','K','1B',2011),
 Z(3,'Hanna','Kowalska','K','2A',2010),
 Z(4,'Amelia','Lewandowska','K','2B',2010),
 Z(5,'Oliwia','Zając','K','2B',2010),
 Z(6,'Maja','Król','K','2C',2010),
 Z(7,'Julia','Wieczorek','K','3A',2009),
 Z(8,'Natalia','Jankowska','K','3B',2009),
 Z(9,'Wiktoria','Mazur','K','3C',2009),
 Z(10,'Alicja','Kaczmarek','K','4A',2008),
 Z(11,'Emilia','Pietrzak','K','4A',2008),
 Z(12,'Laura','Grabowska','K','4B',2008),
 Z(13,'Nikola','Dąbrowska','K','1A',2011),
 Z(14,'Kinga','Sadowska','K','3A',2009),
 Z(15,'Martyna','Czarnecka','K','4B',2008),
 Z(16,'Jakub','Wiśniewski','M','1A',2011),
 Z(17,'Szymon','Kamiński','M','1B',2011),
 Z(18,'Antoni','Zieliński','M','2A',2010),
 Z(19,'Filip','Szymański','M','2A',2010),
 Z(20,'Kacper','Woźniak','M','2B',2010),
 Z(21,'Mikołaj','Kozłowski','M','2C',2010),
 Z(22,'Aleksander','Jabłoński','M','3A',2009),
 Z(23,'Franciszek','Wróbel','M','3B',2009),
 Z(24,'Wojciech','Nowicki','M','3C',2009),
 Z(25,'Igor','Pawlak','M','4A',2008),
 Z(26,'Bartosz','Michalski','M','4B',2008),
 Z(27,'Oskar','Adamczyk','M','1B',2011),
 Z(28,'Tymon','Król','M','3C',2009),
 Z(29,'Stanisław','Sikora','M','4A',2008),
 Z(30,'Dawid','Baran','M','2C',2009)
];

const K=(id_konkurencji,styl,dystans,plec)=>({id_konkurencji,styl,dystans,plec});
export const konkurencje=[
 K(1,'dowolny',50,'K'),
 K(2,'dowolny',50,'M'),
 K(3,'grzbietowy',50,'K'),
 K(4,'grzbietowy',50,'M'),
 K(5,'klasyczny',50,'K'),
 K(6,'klasyczny',50,'M'),
 K(7,'motylkowy',25,'K'),
 K(8,'motylkowy',25,'M')
];

// [id_zawodnika, czas w sekundach, dyskwalifikacja?] w kolejności startów w każdej konkurencji.
const starts={
 1:[[7,33.87],[10,31.02,1],[4,34.51],[11,32.46],[1,38.90],[6,36.12],[12,33.05],[14,40.33]],
 2:[[16,32.40],[18,29.85],[19,28.97],[20,30.62],[22,27.84],[25,26.93],[26,29.11],[30,31.75]],
 3:[[3,41.20],[5,39.84],[8,43.66],[9,38.75],[10,37.90],[13,45.12],[15,40.08],[11,38.20]],
 4:[[17,37.42],[21,34.18],[23,33.56],[24,35.90,1],[29,32.87],[28,36.64],[27,38.25]],
 5:[[2,47.35],[3,44.80],[5,46.02],[8,45.57],[9,43.91],[15,42.66],[13,49.70],[14,48.14]],
 6:[[16,41.73],[18,39.26],[20,40.58,1],[21,38.11],[23,37.45],[24,36.94],[26,37.80],[28,42.35]],
 7:[[1,19.84,1],[2,18.93],[4,17.62],[6,18.20],[7,16.95],[11,17.38],[12,16.71]],
 8:[[17,16.02],[19,14.88],[22,14.21],[25,13.64],[27,17.15],[29,15.37],[30,15.96]]
};
let nextId=1;
export const wyniki=Object.entries(starts).flatMap(([k,list])=>list.map(([z,czas,dq])=>({id_wyniku:nextId++,id_zawodnika:z,id_konkurencji:Number(k),czas,dyskwalifikacja:dq?'tak':'nie'})));

export const tables={Zawodnicy:zawodnicy,Wyniki:wyniki,Konkurencje:konkurencje};

export const swimmerById=(id,list=zawodnicy)=>list.find(z=>z.id_zawodnika===Number(id));
export const eventById=id=>konkurencje.find(k=>k.id_konkurencji===Number(id));
export const fullName=z=>z?`${z.imie} ${z.nazwisko}`:'';
const styleInstr={dowolny:'dowolnym',grzbietowy:'grzbietowym',klasyczny:'klasycznym',motylkowy:'motylkowym'};
export const eventLabel=k=>k?`${k.dystans} m ${styleInstr[k.styl]||k.styl} ${k.plec==='K'?'dziewcząt':'chłopców'}`:'';
export const eventShort=k=>k?`${k.dystans} m ${k.styl} ${k.plec}`:'';

// Czas z setnymi po polsku: 32.4 → „32,40”.
export const fmtTime=t=>t==null||t===''?'':Number(t).toFixed(2).replace('.',',');
// Wpisany czas („38,41”, „38.41”) → liczba albo null.
export function parseTime(s){
 const v=String(s??'').trim().replace(',','.');
 if(!/^\d{1,3}(\.\d{1,2})?$/.test(v))return null;
 const n=Number(v);return n>0&&n<600?Math.round(n*100)/100:null;
}

// Połączenie wyniku z zawodnikiem i konkurencją (jak kwerenda z trzech tabel).
export function joinResult(w,list=zawodnicy){
 const z=swimmerById(w.id_zawodnika,list),k=eventById(w.id_konkurencji);
 return {...w,imie:z?.imie,nazwisko:z?.nazwisko,klasa:z?.klasa,plec:k?.plec,styl:k?.styl,dystans:k?.dystans};
}
// Ranking konkurencji: sklasyfikowani rosnąco po czasie (miejsca), zdyskwalifikowani na końcu bez miejsca.
export function ranking(eventId,results=wyniki,list=zawodnicy){
 const rows=results.filter(w=>w.id_konkurencji===Number(eventId)).map(w=>joinResult(w,list));
 const ok=rows.filter(r=>r.dyskwalifikacja!=='tak').sort((a,b)=>a.czas-b.czas||a.id_wyniku-b.id_wyniku);
 let place=0,prev=null;
 const ranked=ok.map((r,i)=>{if(r.czas!==prev)place=i+1;prev=r.czas;return {...r,miejsce:place};});
 return [...ranked,...rows.filter(r=>r.dyskwalifikacja==='tak').map(r=>({...r,miejsce:null}))];
}
export const winner=(eventId,results=wyniki,list=zawodnicy)=>ranking(eventId,results,list).find(r=>r.miejsce===1)||null;
