import {note, choice, reveal} from '../schema.js';

export default {
 id:'13',grade:3,title:'System szesnastkowy',
 subtitle:'Kolory w grach, adresy kart sieciowych i kody błędów Windowsa — przeczytasz je bez wyszukiwarki.',
 topic:'System szesnastkowy',icon:'hash',tags:['#FF8800','0xDEADBEEF','MAC'],duration:42,
 curriculum:'2024 Informatyka – liceum/technikum · reprezentacja liczb w systemach pozycyjnych (dwójkowy, szesnastkowy)',
 format:{
  name:'Escape room w parach',
  student:'Najpierw krótka rozgrzewka i 4 zadania na przełącznikach bitów. Potem z partnerem uciekacie z serwerowni: 4 kłódki z kodami hex. Efekt: odblokowane drzwi, czas ucieczki i punkty na karcie wyniku.',
  teacher:'Start: retrieval practice z lekcji o systemie dwójkowym, bez notatek (2 min), i szybki hak z kolorami. Potem nauczanie jawne: pokazujesz 2 przykłady na konwerterze (0xA7 → 1010 0111 i 0x2F → 47), uczniowie samodzielnie robią 4 zadania. Główna część to escape room w parach — mastery learning: każda kłódka otwiera się dopiero po poprawnym rozwiązaniu poprzedniej, a błędna próba daje wskazówkę prowadzącą do poprawy. Ty krążysz między parami i zadajesz pytania („jak to sprawdziliście?”), zamiast podawać wynik. Szybkie pary grają w „Trafisz kolor?”, reszta kończy kłódki.',
  grouping:'Pary (dopuszczalna trójka). Każdy wpisuje odpowiedzi na swoim urządzeniu, ale para się naradza. Przy nieparzystej liczbie osób — jedna trójka albo praca samodzielna: symulator działa tak samo.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'},
   {name:'Nauczanie jawne',url:'https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'}
  ]
 },
 objectives:['Zamieniam liczby między systemami dziesiętnym, dwójkowym i szesnastkowym.','Wyjaśniam, dlaczego jedna cyfra szesnastkowa odpowiada czterem bitom, a dwie — bajtowi.','Odczytuję kolor zapisany jako #RRGGBB i rozpoznaję producenta w adresie MAC.','Odszyfrowuję krótki tekst zapisany jako bajty ASCII w hex.'],
 materials:['Przeglądarka (komputer lub telefon) — jedno urządzenie na osobę','Kartka i długopis do obliczeń','Opcjonalnie: kalkulator Windows w trybie programisty do sprawdzenia wyników po lekcji'],
 teacherGuide:{
  preparation:'Wypisz na tablicy wagi 128…1 z poprzedniej lekcji i obok wagi 16 i 1. Klucz do kłódek: 1) C0 FF EE (kod C0FFEE), 2) #FF8800 (±0x10 na kanał) i najciemniejszy #222, 3) intruz PC-12 (OUI 3C:5A:B5 zamiast 3C:5A:B4), MAC = 48 bitów, 4) hasło WOLNOSC. Nie rozdawaj klucza — naprowadzaj pytaniami.',
  summary:'Uczeń zamienia 255 → FF i 0x2F → 47, wyjaśnia „1 cyfra hex = 4 bity”, odczytuje #FF8800 jako R=255, G=136, B=0 i wskazuje OUI jako pierwsze 3 bajty MAC. Na karcie wyniku: punkty z rozgrzewki, konwertera i escape roomu (maks. 19). Pytanie na wyjście: ile kolorów da się zapisać w #RRGGBB i dlaczego?'
 },
 sections:[
  {id:'start',label:'Start',title:'#FF0000 i #00FF00 — co to za liczby?',grouping:'class',
   intro:'Te dziwne kody widzisz w edytorze stron, w Minecrafcie i w ustawieniach RGB klawiatury. To liczby w systemie szesnastkowym. Najpierw rozgrzewka z lekcji o bitach — bez notatek.',
   ...note(5,'Wyświetl dwa kolory: #FF0000 i #00FF00. Zapytaj, co może oznaczać FF i 00. Potem 2 minuty na trzy pytania powtórkowe bez notatek; omów tylko to, co sprawiło kłopot. Na koniec otwórz 2–3 karty „Gdzie spotkasz hex”.','Co może oznaczać FF w #FF0000, skoro jest to kolor czerwony?','FF to maksymalna wartość kanału czerwonego (255), a 00 oznacza brak zielonego i niebieskiego.','Uczniowie traktują FF jak słowo lub skrót, a nie liczbę. Mylą też liczbę układów (256) z największą wartością (255).','Pokaż kod błędu 0x80070005 (odmowa dostępu) i zapytaj, dlaczego informatycy nie piszą go dziesiętnie (2147942405 — trudniej czytać bajty).'),
   activities:[
    choice('hex-r1','Ile wynosi 00101101₂ w systemie dziesiętnym?',['36','45','90'],[1],'Jedynki stoją przy wagach 32, 8, 4 i 1: 32 + 8 + 4 + 1 = 45.','Podpisz wagi od prawej: 1, 2, 4, 8, 16, 32…'),
    choice('hex-r2','Jaki zakres liczb bez znaku zapiszesz na 8 bitach?',['0–8','0–255','0–256','1–256'],[1],'8 bitów daje 2⁸ = 256 układów. Jeden z nich to zero, więc największa liczba to 255.','Policz sumę wszystkich wag: 128 + 64 + … + 1.'),
    choice('hex-r3','Ile bitów mają 3 bajty?',['3','12','24','48'],[2],'1 bajt = 8 bitów, więc 3 × 8 = 24 bity.','Pomnóż liczbę bajtów przez 8.'),
    reveal('hex-where',[
     {title:'Kolory',icon:'palette',short:'#RRGGBB — np. #FF8800',text:'Każda para cyfr to jeden kanał: czerwony, zielony, niebieski, od 00 do FF (0–255). Razem 256 × 256 × 256 = 16 777 216 kolorów. Skrót #FB0 oznacza #FFBB00. Tak zapiszesz kolor w CSS, w Figmie, a od wersji 1.16 także w czacie Minecrafta.'},
     {title:'Adres MAC',icon:'wifi',short:'00:1A:2B:3C:4D:5E',text:'Każda karta sieciowa ma adres z 6 bajtów = 12 cyfr hex = 48 bitów. Pierwsze 3 bajty (OUI) wskazują producenta — przydział prowadzi organizacja IEEE.'},
     {title:'IPv6',icon:'globe',short:'2001:db8::1',text:'Nowe adresy internetowe mają 128 bitów: 8 grup po 4 cyfry hex. Ciąg zer można raz skrócić do „::”.'},
     {title:'Kody błędów',icon:'warning',short:'0x80070005',text:'Windows podaje błędy w hex. 0x80070005 oznacza „odmowa dostępu” — wpisujesz kod w wyszukiwarkę i wiesz, gdzie szukać przyczyny.'},
     {title:'Żarty programistów',icon:'hash',short:'0xDEADBEEF, 0xCAFEBABE',text:'Programiści zapisują w pamięci „magiczne liczby”, które da się przeczytać jak słowa: 0xDEADBEEF od lat oznacza w debugowaniu pamięć „martwą” (niezainicjowaną lub zwolnioną), a każdy plik .class Javy zaczyna się bajtami CA FE BA BE.'},
     {title:'Znaki',icon:'doc',short:'U+0041 = A',text:'Unicode numeruje znaki w hex: U+0041 to „A”. Pierwsze 128 znaków to ASCII — litery A–Z mają kody od 0x41 do 0x5A.'}
    ])
   ]},
  {id:'learn',label:'Dowiedz się',title:'16 cyfr i 4 bity',grouping:'class',
   intro:'Nauczyciel pokaże 2 przykłady na konwerterze. Potem robisz 4 zadania sam — punkty liczą się od pierwszej próby.',
   reading:{title:'Jak działa system szesnastkowy?',paragraphs:[
    'System szesnastkowy (hex) ma 16 cyfr: 0–9 i A, B, C, D, E, F (A = 10, …, F = 15). W liczbie dwucyfrowej lewa cyfra ma wagę 16, a prawa 1. Dlatego 0x2F = 2 · 16 + 15 = 47. Przedrostek 0x lub znak # informuje, że liczba jest szesnastkowa.',
    'Najważniejszy trik: 16 = 2⁴, więc jedna cyfra hex to dokładnie 4 bity (tzw. nibble). Bajt dzielisz na dwie czwórki i każdą zamieniasz osobno: 1010 0111₂ → A i 7 → 0xA7. Nie trzeba liczyć całej sumy 128 + 32 + 4 + 2 + 1.'
   ],example:{question:'Przykład rozwiązany: jak zapisać 200₁₀ w hex i w bitach?',answer:'200 : 16 = 12 reszty 8. 12 = C, więc 200 = 0xC8. Każda cyfra osobno na 4 bity: C = 1100, 8 = 1000 → 1100 1000₂. Sprawdzenie: 128 + 64 + 8 = 200.'}},
   ...note(9,'Nauczanie jawne: najpierw Ty na konwerterze — przykład 1: ustaw 1010 0111 i pokaż, że każda czwórka daje jedną cyfrę (A i 7). Przykład 2: 0x2F → 2 · 16 + 15 = 47. Mów na głos, co myślisz. Potem uczniowie samodzielnie robią 4 zadania; ściąga 0–F jest pod ręką. Po 5 minutach zapytaj, które zadanie było najtrudniejsze.','Dlaczego do zapisu bajtu wystarczą zawsze dwie cyfry hex?','Bo jedna cyfra hex to 4 bity (0000–1111), a bajt ma 8 bitów, czyli dwie czwórki: od 00 do FF.','Czytanie 2F jako 2 · 10 + 15 = 35. Wpisywanie wyniku dziesiętnego zamiast hex (60 zamiast 3C). Pomijanie zera: 192 → C zamiast C0.','Zapytaj: ile to FFFF i ile bitów zajmuje? (65 535, 16 bitów). Albo: jak szybko zamienić 0x80 na binarny? (1000 0000).'),
   activities:[{type:'hexLab',id:'hex-nibble',mode:'nibble',label:'Konwerter czwórek: 4 zadania'}]},
  {id:'escape',label:'Ucieczka',title:'Ucieczka z serwerowni',grouping:'pair',
   intro:'Zamknięci w serwerowni szkoły: 4 kłódki z kodami hex. Kolejna otwiera się dopiero po poprzedniej. Naradzajcie się w parze, ale każdy wpisuje odpowiedzi u siebie. Zegar rusza po kliknięciu Start.',
   ...note(20,'Pary startują jednocześnie — możesz zrobić ranking czasów na tablicy (bez nazwisk, tylko numery par). Krąż po sali. Gdy para utknie, pytaj: „Który bajt się nie zgadza?”, „Jak zamieniłeś 238?”. Nie podawaj kodu — symulator po każdej błędnej próbie daje mocniejszą wskazówkę. Po 15 minutach powiedz, że pary, które skończyły, mogą przejść do gry w kolory.','Po czym poznaliście intruza w sieci, skoro nazwa PC-12 wygląda jak szkolna?','Po pierwszych 3 bajtach MAC (OUI): 3C:5A:B5 nie ma w tabeli producentów — szkolne komputery mają 3C:5A:B4. Nazwę urządzenia każdy może zmienić.','Wpisywanie jednej cyfry zamiast dwóch (C zamiast C0). Mylenie kolejności kanałów (RGB). Porównywanie MAC tylko po nazwie urządzenia. Czytanie bajtów ASCII jako liczb dziesiętnych.','Dla najszybszych: zapisz swoje imię (bez polskich znaków) w bajtach ASCII i daj partnerowi do odszyfrowania.'),
   activities:[{type:'hexLab',id:'hex-escape',mode:'escape',label:'Ucieczka z serwerowni: 4 kłódki'}]},
  {id:'bonus',label:'Bonus',title:'Trafisz kolor?',grouping:'solo',
   intro:'Dla tych, którzy już uciekli. Widzisz kolor — wpisz jego kod hex. 5 rund, maks. 10 punktów. Gra nie wlicza się do oceny, ale rekord zostaje na ekranie. Kto jeszcze nie skończył ucieczki — wróć do kłódek.',
   ...note(4,'Etap dla szybkich par; pozostali kończą escape room. Możesz zrobić mini-turniej: kto ma najlepszy rekord w 5 rundach.','Jak rozpoznać po samym kodzie, że kolor będzie ciemny?','Wszystkie trzy pary cyfr są małe (np. #222222, #1A0F30) — mało światła w każdym kanale.','Uczniowie zaczynają od niebieskiego, bo tak brzmi „RGB” od tyłu. Kolejność to zawsze czerwony, zielony, niebieski.','Zapytaj: jaki kolor to #808080 i dlaczego? (szary — wszystkie kanały po równo, połowa jasności).',true),
   activities:[{type:'hexLab',id:'hex-color',mode:'color',label:'Gra: Trafisz kolor?'}]},
  {id:'result',label:'Wynik',title:'Twój wynik',grouping:'class',
   intro:'Punkty z rozgrzewki, konwertera i escape roomu. Zaznacz samoocenę i pokaż kartę nauczycielowi.',
   ...note(4,'Omów jedną kłódkę, która sprawiła najwięcej kłopotu (zwykle kolor albo MAC). Zadaj pytanie na wyjście: ile kolorów zapiszesz w #RRGGBB? Uczniowie robią zdjęcie karty albo pokazują ją.','Ile kolorów zapiszesz w kodzie #RRGGBB?','256 · 256 · 256 = 16 777 216 — po 256 wartości (00–FF) na każdy z trzech kanałów.','Odpowiedź 3 · 256 = 768 — dodawanie zamiast mnożenia możliwości.','Poproś o zapisanie na kartce jednego miejsca, w którym uczeń spotka hex jeszcze w tym tygodniu.'),
   activities:[{type:'resultCard',id:'result',title:'Ucieczka z serwerowni — wynik',sources:['hex-r1','hex-r2','hex-r3','hex-nibble','hex-escape'],badges:[
    {min:0,name:'Zamknięty w serwerowni',text:'Drzwi jeszcze trzymają. Ściąga 0–F, jedna próba więcej — i wychodzisz.'},
    {min:0.5,name:'Hakier z kartką',text:'Liczysz szesnastkowo, choć kartka jeszcze się przydaje. Uczciwie.'},
    {min:0.85,name:'0xC0DE MASTER',text:'Czytasz hex jak SMS-y. Administrator właśnie dopisał Cię do listy zaufanych.'}
   ]}]}
 ],
 exitTicket:'Umiesz zamienić bajt na dwie cyfry hex, odczytać kolor #RRGGBB i znaleźć producenta w adresie MAC. Następnym razem, gdy Windows pokaże 0x80070005, wiesz, że to liczba — i to całkiem konkretna.'
};
