import {note, choice} from '../schema.js';

const order=(n,label,question,criteria)=>({type:'schemaDesigner',id:`sd-z${n}`,stateKey:'schema-lab',mode:`z${n}`,points:4,label,question,criteria});

export default {
 id:'24',grade:3,title:'Tworzenie bazy danych – zadania',
 subtitle:'Trzy zlecenia z prawdziwych firm: wypożyczalnia, warsztat, biblioteka. Projektujesz bazę, a symulator sprawdza ją jak szef na praktykach.',
 topic:'Tworzenie bazy danych – zadania',icon:'table',
 tags:['Projekt','Klucze','Relacje'],duration:45,
 curriculum:'2024 Informatyka – liceum/technikum · projektowanie relacyjnej bazy danych: tabele, typy danych, klucze, relacje, więzy integralności',
 format:{
  name:'Stacje zleceń w parach (mastery)',
  student:'Dostajesz trzy zlecenia od klientów — coraz trudniejsze. W parze: jedna osoba projektuje bazę, druga sprawdza ją z listą kontrolną, zanim klikniecie „Sprawdź projekt”. Przy każdym zleceniu zamiana ról. Następne zlecenie otwiera się po zaliczeniu poprzedniego na 70%.',
  teacher:'Mastery learning: zlecenie 2 jest zablokowane do zaliczenia zlecenia 1 (≥70% kontroli i każda z 6 grup reguł spełniona co najmniej w połowie — np. bez relacji nie ma zaliczenia), zlecenie 3 — do zaliczenia 2. Symulator ocenia projekt według 6 grup reguł (tabele, klucze główne, pola, typy, klucze obce i relacje, brak redundancji) i mówi, co poprawić. Tutoring rówieśniczy: projektant klika, sprawdzający czyta listę kontrolną i zadaje pytania („gdzie jest klucz obcy?”) — przed kliknięciem „Sprawdź”. Po każdym zleceniu zamiana ról. Twoja rola: obchodzisz pary, pytasz o uzasadnienie („dlaczego wiek to pułapka?”), a pary z 100% zapraszasz do bonusu w zleceniu 3.',
  grouping:'Pary przy jednym komputerze z rolami projektant / sprawdzający, zamiana ról przy każdym zleceniu. Przy nieparzystej liczbie osób jedna trójka (dwóch sprawdzających) albo praca samodzielna — lista kontrolna jest w symulatorze.',
  methods:[
   {name:'Mastery learning',url:'https://metodyka.covepolska.pl/metoda-mastery-learning.html'},
   {name:'Tutoring rówieśniczy',url:'https://metodyka.covepolska.pl/metoda-peer-tutoring.html'},
   {name:'Feedback prowadzący do poprawy',url:'https://metodyka.covepolska.pl/metoda-feedback-poprawa.html'},
   {name:'Retrieval practice',url:'https://metodyka.covepolska.pl/metoda-retrieval-practice.html'}
  ]
 },
 objectives:['Dzielę dane ze zlecenia na tabele tak, żeby nic się nie powtarzało.','Dobieram typy danych: Liczba, Krótki tekst, Data/Godzina, Waluta, Tak/Nie, Autonumerowanie.','Ustalam klucze główne i obce oraz tworzę relacje 1–∞, także dwie relacje „w łańcuchu”.','Sprawdzam, że baza odrzuca rekord, który narusza relację.'],
 materials:['Przeglądarka z lekcją — komputer (projekt tabel jest szeroki), jeden na parę','Wbudowany symulator projektu bazy w stylu programu Access — bez instalowania pakietu Office','Trzy fikcyjne zlecenia z przykładowymi danymi od klienta'],
 teacherGuide:{
  preparation:'Ustal pary. Wyświetl etap 2 (zasady i przykład Zawody) na projektorze. W symulatorze: „Utwórz tabelę” (nazwy z listy, jest wśród nich tabela-pułapka „jedna na wszystko”), pula pól (są w niej pola-pułapki: wiek, nazwisko w tabeli zdarzeń, pola wyliczane), przycisk 🔑, typ danych i panel Relacje. Rozwiązania: Wypożyczalnia — Klienci, Sprzęt, Wypożyczenia (id_klienta, id_sprzetu); Warsztat — Klienci 1–∞ Samochody (id_klienta), Samochody 1–∞ Naprawy (id_samochodu); Biblioteka — Uczniowie, Książki, Wypożyczenia (+ bonus Pracownicy, id_pracownika).',
  summary:'Karta wyniku: maks. 15 pkt (3 pytania + 3 zlecenia po 4 pkt). Minimalny sukces: zlecenia 1 i 2 zaliczone na 70%. Poproś parę o pokazanie relacji w warsztacie i odpowiedź: „dlaczego w Naprawy nie ma id_klienta?”. Pary, które skończyły, robią bonus (Pracownicy) albo pomagają innym jako sprawdzający.'
 },
 sections:[
  {id:'start',label:'Start',title:'Klient płaci za bazę, która się nie sypie.',intro:'Na praktykach usłyszysz: „zrób nam prostą bazę”. Dziś trzy takie zlecenia. Najpierw rozgrzewka z poprzednich lekcji.',grouping:'class',
   reading:{title:'Projekt przed klikaniem',paragraphs:['Zła baza działa… do pierwszej zmiany. Potem nazwiska się rozjeżdżają, raporty kłamią, a ktoś po godzinach poprawia dane ręcznie. Dobry projekt robisz raz, na początku — to 10 minut myślenia zamiast tygodni łatania.','Projektant bazy to realny zawód (i częste zadanie na praktykach w biurze, serwisie czy sklepie). Dziś sprawdzisz się w trzech branżach.']},
   ...note(4,'Krótki hak o „prostej bazie” i dwa pytania powtórkowe z lekcji o gabinecie (klucz obcy, relacja). Uczniowie odpowiadają samodzielnie, potem ustalasz pary i role.','Co się dzieje, gdy w bazie gabinetu przy każdej wizycie wpisujemy nazwisko pacjenta?','Nazwiska się powtarzają, powstają literówki, a zmiana nazwiska wymaga poprawek w wielu rekordach.','Mylenie klucza obcego z głównym; przekonanie, że klucz obcy musi być unikalny.','Zapytaj, kto z klasy robił coś „na zlecenie” (strona, grafika, naprawa) — jakie pytania zadał klientowi?'),
   activities:[
    choice('sd-hook','Powtórka: nowa wizyta Ady Testowej (id_pacjenta = 1). Co jest poprawne?',['Nowy rekord w Pacjenci z tym samym id_pacjenta','Nowy rekord w Wizyty z id_pacjenta = 1 (klucz obcy)','Dopisanie terminu do pola nazwisko w Pacjenci'],[1],'Osoba jest zapisana raz. Każde zdarzenie (wizyta, wypożyczenie, naprawa) to nowy rekord, który wskazuje osobę kluczem obcym.','Nowe zdarzenie ≠ nowa osoba.'),
    choice('sd-recall','Która tabela jest po stronie „wiele” (∞) w relacji Pacjenci — Wizyty?',['Pacjenci','Wizyty','Obie'],[1],'Jeden pacjent ma wiele wizyt, każda wizyta ma jednego pacjenta. Po stronie ∞ stoi tabela z kluczem obcym.','Gdzie jest klucz obcy id_pacjenta?')
   ]},
  {id:'rules',label:'Zasady',title:'5 zasad dobrego projektu (przykład: Zawody).',intro:'Zanim zaczniesz: przykład rozwiązany na znanej bazie i ściąga z typów danych. Na końcu etapu dopasuj typy.',grouping:'class',
   reading:{title:'Przepis na bazę w 5 krokach',paragraphs:['1) Znajdź „rzeczy” ze zlecenia: osoby, przedmioty i zdarzenia — każda to tabela. 2) Każdej tabeli daj klucz główny id_… (Autonumerowanie). 3) Każde pole wstaw do tabeli, którą opisuje. 4) Tabela zdarzeń dostaje klucze obce (Liczba) i relacje 1–∞. 5) Wyrzuć pola, które się powtarzają albo dają się policzyć (wiek, suma, liczba dni).','Typy: tekst → Krótki tekst (także telefon i numer rejestracyjny), liczba → Liczba, data → Data/Godzina, pieniądze → Waluta, odpowiedź tak/nie → Tak/Nie, numer rekordu nadawany automatycznie → Autonumerowanie.'],example:{question:'Przykład rozwiązany: jak zaprojektowano bazę Zawody?',answer:'Osoby: Zawodnicy (id_zawodnika, imie, nazwisko, plec, klasa, rocznik). Przedmioty/kategorie: Konkurencje (id_konkurencji, styl, dystans, plec). Zdarzenia: Wyniki (id_wyniku, id_zawodnika → Zawodnicy, id_konkurencji → Konkurencje, czas, dyskwalifikacja). Nie ma pola „wiek” (liczy się z rocznika) ani nazwiska w Wyniki.'}},
   ...note(6,'Przykład rozwiązany na projektorze: przejdź 5 kroków na bazie Zawody z lekcji o zawodach. Pokaż w symulatorze (zlecenie 1) gdzie jest pula pól, 🔑, typ i panel Relacje — bez rozwiązywania. Potem uczniowie dopasowują typy.','Dlaczego telefon to Krótki tekst, a nie Liczba?','Bo ma spacje, +48, zero na początku i nic na nim nie liczymy; Liczba zgubiłaby zera i znaki.','Waluta mylona z Liczbą; data zapisywana jako tekst („5 lipca”), przez co nie da się sortować ani liczyć dni.','Zapytaj o typ pola „kod pocztowy” (Krótki tekst — myślnik i zero na początku).'),
   activities:[
    {type:'matching',id:'sd-types',question:'Dopasuj pole do typu danych.',options:['Krótki tekst','Liczba','Data/Godzina','Waluta','Tak/Nie','Autonumerowanie'],rows:[
     {label:'telefon (602 300 400)',correct:[0],explanation:'Spacje, +48, zero na początku — tekst. Na telefonie nic nie liczymy.'},
     {label:'rok_produkcji (2015)',correct:[1],explanation:'Rok to liczba — da się sortować i policzyć wiek auta.'},
     {label:'data_wypozyczenia',correct:[2],explanation:'Data/Godzina pozwala sortować i liczyć dni.'},
     {label:'cena_za_dobe (60,00 zł)',correct:[3],explanation:'Pieniądze = Waluta: dokładne grosze i format zł.'},
     {label:'zwrocono',correct:[4],explanation:'Odpowiedź tak albo nie — pole wyboru Tak/Nie.'},
     {label:'id_klienta w tabeli Klienci (klucz główny)',correct:[5],explanation:'Access sam nada kolejny numer. W tabeli z kluczem obcym to samo pole ma typ Liczba.'}
    ]}
   ]},
  {id:'z1',label:'Zlecenie 1',title:'Zlecenie 1: wypożyczalnia „Na Fali”.',intro:'Trzy tabele, dwie relacje, kilka pułapek w puli pól. Projektant klika, sprawdzający czyta listę kontrolną. Cel: co najmniej 70%, najlepiej 100% i test relacji.',grouping:'pair',
   reading:{title:'Jak pracujemy w parze',paragraphs:['Projektant: tworzy tabele, wstawia pola, ustawia 🔑 i typy, tworzy relacje. Sprawdzający: przed „Sprawdź projekt” czyta na głos listę kontrolną i zadaje pytania („czy telefon to tekst?”). Każdy komunikat symulatora mówi, co poprawić.','Po 100% otwiera się „Wypróbuj”: wpiszcie 2 rekordy i spróbujcie złamać relację (np. wypożyczenie dla klienta nr 99). Baza powinna odmówić.']},
   ...note(10,'Pary pracują samodzielnie. Po 5 minutach zapytaj, kto ma już 70%. Parom z niskim wynikiem podpowiedz tylko: „przeczytajcie pierwszy czerwony punkt raportu”. Pilnuj ról.','Które pola z puli zostawiliście i dlaczego?','wiek (zmienia się i nie jest potrzebny), nazwisko_klienta (redundancja), wartosc_wypozyczenia (da się policzyć).','Wszystkie pola w jednej tabeli „Zeszyt”; brak kluczy obcych w Wypożyczenia; Autonumerowanie w kluczu obcym.','Zapytaj: jak dodać do bazy kaucję za sprzęt? (Waluta w Wypożyczenia albo w Sprzęt — zależy, od czego zależy).'),
   activities:[order(1,'Zlecenie 1: wypożyczalnia','Zaprojektuj bazę wypożyczalni: klienci, sprzęt, wypożyczenia.',['Trzy tabele: osoby, sprzęt, zdarzenia (wypożyczenia).','Każda tabela ma 🔑 id_…, a Wypożyczenia — dwa klucze obce (Liczba) i dwie relacje 1–∞.','Żadnych pól powtarzanych ani wyliczanych.'])]},
  {id:'z2',label:'Zlecenie 2',title:'Zlecenie 2: warsztat „Tłok” — relacje w łańcuchu.',intro:'Zamiana ról! Tu klient ma samochody, a samochód ma naprawy. Dwie relacje, ale nie „gwiazda”, tylko łańcuch.',grouping:'pair',
   reading:{title:'Łańcuch: Klienci → Samochody → Naprawy',paragraphs:['Klient może mieć kilka aut, auto wraca na kilka napraw. Klucz obcy id_klienta stoi więc w Samochody, a id_samochodu — w Naprawy.','Pokusa: dopisać id_klienta także do Naprawy „dla wygody”. To redundancja — właściciela znajdziesz przez samochód, a po sprzedaży auta skrót pokazałby złą osobę.']},
   ...note(11,'Zamiana ról w parach. Gdy para utknie na relacjach, narysuj na tablicy trzy prostokąty w rzędzie i zapytaj: „czego dotyczy naprawa — klienta czy auta?”.','Dlaczego w Naprawy nie ma id_klienta?','Naprawa dotyczy samochodu, a samochód wskazuje właściciela. Druga droga do klienta mogłaby się rozjechać.','id_klienta w Naprawy; wiek_auta zamiast rok_produkcji; numer rejestracyjny jako Liczba.','Dla chętnych: jak zapisać, który mechanik robił naprawę? (tabela Mechanicy + id_mechanika w Naprawy).'),
   activities:[order(2,'Zlecenie 2: warsztat','Zaprojektuj bazę warsztatu: klienci, samochody, naprawy (dwie relacje w łańcuchu).',['Klienci 1–∞ Samochody (id_klienta) i Samochody 1–∞ Naprawy (id_samochodu).','Rok produkcji zamiast wieku auta; koszt jako Waluta, opłacono jako Tak/Nie.','Właściciela naprawy znajdziesz przez samochód — bez skrótów.'])]},
  {id:'z3',label:'Zlecenie 3',title:'Zlecenie 3: biblioteka szkolna (+ bonus).',intro:'Najtrudniejsze: typ ISBN, pola wyliczane i bonus — kto wydał książkę. Zamiana ról jeszcze raz.',grouping:'pair',
   reading:{title:'Samodzielnie, bez podpowiedzi',paragraphs:['To zlecenie robicie bez modelu — tylko lista kontrolna i komunikaty symulatora. Pułapka typu: ISBN wygląda jak liczba, ale ma myślniki i czasem literę X.','Bonus: dodaj tabelę Pracownicy (id_pracownika, imie, nazwisko) i klucz obcy id_pracownika w Wypożyczenia. Bonus nie zmienia punktów — ale pokazuje, że umiesz rozbudować bazę.']},
   ...note(9,'Pary pracują samodzielnie. Kto skończy wcześniej: bonus albo rola „sprawdzającego” u sąsiedniej pary (tutoring). Nie podawaj rozwiązań — odsyłaj do raportu.','Dlaczego dni_spoznienia nie zapisujemy w tabeli?','Bo wyliczy je kwerenda z terminu zwrotu i dzisiejszej daty; zapisane dane zestarzałyby się następnego dnia.','ISBN jako Liczba; klasa_ucznia w Wypożyczenia; brak klucza głównego w Książki.','Bonus: Pracownicy + relacja z Wypożyczenia.'),
   activities:[order(3,'Zlecenie 3: biblioteka','Zaprojektuj bazę biblioteki: uczniowie, książki, wypożyczenia (bonus: pracownicy).',['Trzy tabele i dwie relacje z Wypożyczenia; ISBN jako Krótki tekst.','Bez pól wyliczanych (dni spóźnienia) i bez klasy ucznia w wypożyczeniu.','Bonus: Pracownicy 1–∞ Wypożyczenia (id_pracownika).'])]},
  {id:'result',label:'Wynik',title:'Twój wynik: ile firm by Cię zatrudniło?',intro:'Karta zbiera punkty ze wszystkich zleceń. Każdy wypełnia samoocenę sam — nawet jeśli pracowaliście w parze.',grouping:'solo',
   ...note(5,'Każdy uczeń indywidualnie zaznacza samoocenę i odpowiada na pytanie o najczęstszy błąd. Zbierz 2–3 odpowiedzi: jaka pułapka złapała najwięcej osób?','Który błąd popełniłeś/-aś najczęściej i jak go teraz rozpoznasz?','Pola w złej tabeli, brak relacji, Autonumerowanie w kluczu obcym, pola wyliczane.','Traktowanie 70% jako „wystarczy” — w pracy baza z 1 błędem w relacji psuje raporty.','Zaproponuj bazę dla szkolnego sklepiku lub turnieju e-sportowego: tabele i relacje na kartce.'),
   activities:[
    {type:'resultCard',id:'result',title:'Karta wyniku: projektant baz',sources:['sd-hook','sd-recall','sd-types','sd-z1','sd-z2','sd-z3'],badges:[
     {min:0,name:'Stażysta z zeszytem',text:'Na razie wszystko ląduje w jednej tabeli. Wróć do zlecenia 1 — raport powie Ci, od czego zacząć.'},
     {min:0.5,name:'Junior projektant',text:'Tabele i klucze ogarnięte. Jeszcze relacje w łańcuchu i możesz brać zlecenia.'},
     {min:0.85,name:'Architekt baz',text:'Wypożyczalnia, warsztat i biblioteka działają. Klient płaci, a baza się nie sypie.'}
    ]},
    {type:'text',id:'sd-reflect',question:'Który błąd popełniłeś/-aś najczęściej i po czym go teraz rozpoznasz?',minLength:15,explanation:'Przykład: „Wstawiałem nazwisko do tabeli wypożyczeń. Teraz pytam: czy to pole opisuje zdarzenie, czy osobę?”. To samoocena — nauczyciel może poprosić o rozwinięcie.'}
   ]}
 ],
 exitTicket:'Umiesz zamienić opis klienta w bazę: tabele bez powtórzeń, klucze, typy i relacje — także w łańcuchu. Tak zaczyna się każda aplikacja: sklep, rezerwacje, e-dziennik.'
};
