// Wspólne, deterministyczne dane bazy „Stomatolog” dla lekcji 10–12 (klasa 2).
// Wszystkie osoby, telefony i adresy są FIKCYJNE (domena .example / example.com jest zarezerwowana).
// Id 1–3 to pacjenci z lekcji 05 (Ada Testowa, Jan Przykładowy, Ewa Modelowa).

export const SIM_TODAY='2026-10-06'; // „dziś” w zadaniach; „jutro” = 2026-10-07
export const TOMORROW='2026-10-07';

export const fieldTypes={
 Lekarze:{id_lekarza:'autonumber',imie:'text',nazwisko:'text',specjalizacja:'text'},
 Pacjenci:{id_pacjenta:'autonumber',imie:'text',nazwisko:'text',plec:'text',data_urodzenia:'date',telefon:'text',email:'text',miasto:'text'},
 Wizyty:{id_wizyty:'autonumber',id_pacjenta:'number',id_lekarza:'number',termin:'datetime',cel:'text',koszt:'number'}
};
export const typeLabels={autonumber:'Autonumerowanie',text:'Krótki tekst',number:'Liczba',date:'Data/Godzina',datetime:'Data/Godzina'};
export const tableKeys={Lekarze:'id_lekarza',Pacjenci:'id_pacjenta',Wizyty:'id_wizyty'};
export const tableNames=['Pacjenci','Wizyty','Lekarze'];
// Relacje 1 → wiele (strona „jeden” → strona „wiele”).
export const relations=[
 {one:'Pacjenci',many:'Wizyty',field:'id_pacjenta'},
 {one:'Lekarze',many:'Wizyty',field:'id_lekarza'}
];

export const lekarze=[
 {id_lekarza:1,imie:'Marta',nazwisko:'Zębowska',specjalizacja:'stomatolog zachowawczy'},
 {id_lekarza:2,imie:'Piotr',nazwisko:'Korona',specjalizacja:'ortodonta'}
];

const P=(id_pacjenta,imie,nazwisko,plec,data_urodzenia,telefon,email,miasto)=>({id_pacjenta,imie,nazwisko,plec,data_urodzenia,telefon,email,miasto});
export const pacjenci=[
 P(1,'Ada','Testowa','K','1990-04-12','601234501','ada.testowa@example.com','Wrocław'),
 P(2,'Jan','Przykładowy','M','1985-11-03','602345602','jan.przykladowy@example.com','Oława'),
 P(3,'Ewa','Modelowa','K','2001-06-20','603456703',null,'Oleśnica'),
 P(4,'Kacper','Kowalczyk','M','2010-02-14','604567804','kacper.kowalczyk@example.com','Wrocław'),
 P(5,'Zofia','Kowalczyk','K','2012-09-01','605678905',null,'Wrocław'),
 P(6,'Tomasz','Nowicki','M','1978-03-22','606789006',null,'Trzebnica'),
 P(7,'Karolina','Wiśniewska','K','1995-07-30','607890107','karolina.w@example.com','Wrocław'),
 P(8,'Michał','Krawczyk','M','2003-12-05','608901208','michal.krawczyk@example.com','Oława'),
 P(9,'Natalia','Lis','K','1988-01-17','609012309','natalia.lis@example.com','Wrocław'),
 P(10,'Paweł','Zieliński','M','1969-05-09','510123410','pawel.zielinski@example.com','Oleśnica'),
 P(11,'Julia','Mazur','K','2009-08-11','511234511','julia.mazur@example.com','Wrocław'),
 P(12,'Bartosz','Kamiński','M','1999-10-25','512345612',null,'Trzebnica'),
 P(13,'Agnieszka','Wójcik','K','1982-02-28','513456713','a.wojcik@example.com','Wrocław'),
 P(14,'Filip','Dudek','M','2008-04-03','514567814','filip.dudek@example.com','Oława'),
 P(15,'Oliwia','Kaczmarek','K','1993-09-14','515678915','oliwia.kaczmarek@example.com','Wrocław'),
 P(16,'Szymon','Pawlak','M','2011-06-06','516789016','szymon.pawlak@example.com','Oleśnica'),
 P(17,'Maja','Sikora','K','1997-11-19','517890117','maja.sikora@example.com','Wrocław'),
 P(18,'Krzysztof','Baran','M','1975-12-01','518901218',null,'Oława'),
 P(19,'Wiktoria','Górska','K','2000-03-08','519012319','wiktoria.gorska@example.com','Trzebnica'),
 P(20,'Adam','Jabłoński','M','1987-07-21','520123420','adam.jablonski@example.com','Wrocław')
];

const W=(id_wizyty,id_pacjenta,id_lekarza,termin,cel,koszt)=>({id_wizyty,id_pacjenta,id_lekarza,termin,cel,koszt});
export const wizyty=[
 W(1,1,1,'2026-10-05 09:00','przegląd',150),
 W(2,4,2,'2026-10-05 10:00','aparat',350),
 W(3,7,1,'2026-10-05 11:30','leczenie',380),
 W(4,10,1,'2026-10-05 13:00','higienizacja',300),
 W(5,2,1,'2026-10-06 08:30','kontrola',100),
 W(6,5,2,'2026-10-06 09:30','kontrola',120),
 W(7,13,1,'2026-10-06 12:00','leczenie',420),
 W(8,16,2,'2026-10-06 14:00','aparat',600),
 W(9,3,1,'2026-10-07 08:00','przegląd',150),
 W(10,8,2,'2026-10-07 09:30','aparat',350),
 W(11,11,1,'2026-10-07 10:15','leczenie',280),
 W(12,14,1,'2026-10-07 11:45','higienizacja',300),
 W(13,17,2,'2026-10-07 13:00','kontrola',120),
 W(14,6,1,'2026-10-07 15:30','leczenie',450),
 W(15,1,1,'2026-10-08 09:00','leczenie',320),
 W(16,9,2,'2026-10-08 10:30','kontrola',120),
 W(17,12,1,'2026-10-08 12:00','przegląd',150),
 W(18,19,1,'2026-10-08 14:00','higienizacja',300),
 W(19,4,2,'2026-10-09 08:30','kontrola',120),
 W(20,15,1,'2026-10-09 10:00','leczenie',390),
 W(21,20,2,'2026-10-09 11:30','aparat',600),
 W(22,18,1,'2026-10-09 13:30','przegląd',150),
 W(23,2,1,'2026-10-12 09:00','leczenie',360),
 W(24,5,2,'2026-10-12 10:00','aparat',350),
 W(25,10,1,'2026-10-12 12:30','kontrola',100),
 W(26,7,1,'2026-10-13 09:30','kontrola',100),
 W(27,13,2,'2026-10-13 11:00','kontrola',120),
 W(28,16,1,'2026-10-13 13:00','higienizacja',300),
 W(29,3,1,'2026-10-13 15:00','leczenie',250),
 W(30,8,2,'2026-10-14 08:30','kontrola',120),
 W(31,11,1,'2026-10-14 10:00','kontrola',100),
 W(32,19,1,'2026-10-14 12:00','leczenie',480),
 W(33,14,1,'2026-10-15 09:00','kontrola',100),
 W(34,17,2,'2026-10-15 10:30','aparat',600),
 W(35,20,1,'2026-10-15 12:00','przegląd',150),
 W(36,9,1,'2026-10-15 14:30','higienizacja',300),
 W(37,12,1,'2026-10-16 09:00','leczenie',340),
 W(38,6,1,'2026-10-16 11:00','kontrola',100),
 W(39,15,2,'2026-10-16 12:30','kontrola',120),
 W(40,1,1,'2026-10-16 14:00','higienizacja',300)
];

export const tables={Pacjenci:pacjenci,Wizyty:wizyty,Lekarze:lekarze};

export const patientById=id=>pacjenci.find(p=>p.id_pacjenta===id);
export const doctorById=id=>lekarze.find(l=>l.id_lekarza===id);
export const doctorName=l=>l?`dr ${l.imie} ${l.nazwisko}`:'';

// Wizyta połączona z pacjentem i lekarzem (jak kwerenda z trzech tabel).
export function joinVisit(v){
 const p=patientById(v.id_pacjenta),l=doctorById(v.id_lekarza);
 return {...v,imie:p.imie,nazwisko:p.nazwisko,plec:p.plec,telefon:p.telefon,email:p.email,miasto:p.miasto,lekarz:`${l.imie} ${l.nazwisko}`,lekarz_nazwisko:l.nazwisko};
}
export const joinedVisits=()=>wizyty.map(joinVisit);
export const visitsOn=day=>joinedVisits().filter(v=>v.termin.startsWith(day+' ')).sort((a,b)=>a.termin.localeCompare(b.termin));

// Dni tygodnia i daty po polsku (bez zależności od strefy czasowej).
export function isValidISODate(s){
 const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));if(!m)return false;
 const d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));
 return d.getUTCFullYear()===+m[1]&&d.getUTCMonth()===+m[2]-1&&d.getUTCDate()===+m[3];
}
export function addDays(iso,n){const [y,m,d]=iso.split('-').map(Number);const t=new Date(Date.UTC(y,m-1,d+n));return t.toISOString().slice(0,10);}
export const plDate=iso=>{const [y,m,d]=iso.slice(0,10).split('-');return `${d}.${m}.${y}`;};
