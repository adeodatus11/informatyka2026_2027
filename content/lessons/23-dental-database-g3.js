// Klasa 3: ponowne użycie lekcji 05 (klasa 2) — ta sama treść i ten sam symulator gabinetu.
// Pliku 05 nie zmieniamy: kopiujemy sekcje, dodajemy schemat pracy, pytanie powtórkowe z lekcji
// o zawodach pływackich, wyjaśnienia (z notatek lekcji 05) i kartę wyniku.
import base from './05-dental-database.js';
import {additionalNotes} from '../notes-grades-2-3.js';
import {choice} from '../schema.js';

const notes=additionalNotes['05']||{};
const recall=choice('db-g3-recall','Powtórka z bazy Zawody: w tabeli Wyniki pole id_zawodnika to…',['klucz główny tabeli Wyniki','klucz obcy — wskazuje rekord w tabeli Zawodnicy','zwykłe pole tekstowe z nazwiskiem'],[1],'id_zawodnika w Wyniki może się powtarzać (jeden zawodnik — wiele startów) i wskazuje zawodnika. Dziś tak samo: id_pacjenta w Wizyty wskazuje pacjenta.','Czy jeden zawodnik może mieć kilka rekordów w Wyniki?');

const sections=base.sections.map(s=>{
 const copy={...s,activities:[...s.activities],grouping:s.grouping||({start:'class',model:'class',check:'solo',create:'solo',query:'solo',summary:'solo'})[s.id]};
 if(notes[s.id])copy.reading=notes[s.id];
 if(s.id==='start'){copy.activities=[recall,...copy.activities];copy.teacherNotes=s.teacherNotes+' Najpierw pytanie powtórkowe z lekcji o zawodach pływackich (klucz obcy), potem pytanie o gabinet.';}
 if(s.id==='summary')copy.activities=[...copy.activities,{type:'resultCard',id:'result',title:'Karta wyniku: baza gabinetu',sources:['db-g3-recall','db-problem','db-fields','db-result','db-relation','db-exit'],badges:[
  {min:0,name:'Recepcja na zastępstwie',text:'Pacjenci się mieszają z terminami. Wróć do etapu „Sprawdź” — tam się rozdzielają.'},
  {min:0.5,name:'Rejestratorka/rejestrator',text:'Tabele i relacja działają. Jeszcze pewność przy kluczach i gabinet jest Twój.'},
  {min:0.85,name:'Szef recepcji',text:'Pacjent raz, wizyty wiele razy, relacja pilnuje porządku. Poniedziałkowy plan w sekundę.'}
 ],selfCheck:base.objectives}];
 return copy;
});

export default {
 ...base,
 id:'23',grade:3,
 tags:['Tabele','Klucze','Relacje'],
 format:{
  name:'Symulacja pracy recepcji',
  student:'Wcielasz się w osobę, która stawia bazę dla gabinetu stomatologicznego: projektujesz dwie tabele, łączysz je relacją, wpisujesz pacjentów i wizyty, a potem szukasz terminów tak, jak robi to recepcja. Efekt: działająca baza z planem dnia.',
  teacher:'Model → sprawdzenie → praca w symulatorze. Etap 2: nauczanie jawne — karty pojęć i relacja Pacjenci 1–∞ Wizyty narysowana na tablicy (uczniowie znają te pojęcia z bazy Zawody, więc tempo może być szybsze). Etap 3: dopasowanie pól do ról z informacją zwrotną. Etapy 4–5: symulator sprawdza strukturę, dane i wyszukiwania; błędy (zły klucz, pacjent 99, zła data) są odrzucane z komunikatem, a uczeń poprawia rekord. Karta wyniku liczy pytania i dopasowanie; wykonanie w symulatorze oceniasz na ekranie ucznia.',
  grouping:'Samodzielnie przy komputerze. Uczniowie, którzy skończą etap „Zrób” wcześniej, mogą pomóc sąsiadowi jako tutor (bez klikania za niego).',
  methods:[
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 sections
};
