export const additionalNotes = {
 '05': {
 "start": {
  "title": "Od potrzeb recepcji do projektu bazy",
  "paragraphs": [
   "Recepcja potrzebuje odpowiedzi na trzy pytania: kogo przyjmujemy, kiedy i w jakim celu? Najpierw ustalamy dane wejściowe, oczekiwany wynik i zasady. W tej lekcji tworzymy terminarz dla jednego lekarza i jednego fotela. Nie opisujemy leczenia ani rozliczeń.",
   "Jedna długa lista z nazwiskiem powtórzonym przy każdym terminie utrudnia poprawianie danych. Gdy nazwisko zostanie zmienione tylko w jednym wierszu, pojawią się sprzeczne informacje. Oddzielamy więc osoby od zdarzeń: Pacjenci przechowują osoby, Wizyty — terminy. Wszystkie dane w zadaniu są fikcyjne."
  ],
  "example": {
   "question": "Przykład: Ada wraca na kontrolę",
   "answer": "Ada pozostaje jednym rekordem w Pacjenci. Dopisujemy nowy rekord Wizyty z identyfikatorem Ady. Nie kopiujemy jej nazwiska ani nie nadpisujemy wcześniejszego terminu."
  }
 },
 "model": {
  "title": "Dwie tabele i relacja jeden do wielu",
  "paragraphs": [
   "Tabela porządkuje obiekty jednego rodzaju. Rekord to pojedynczy wiersz, a pole opisuje jedną cechę. W Pacjenci używamy pól id_pacjenta, imie, nazwisko. W Wizyty: id_wizyty, id_pacjenta, termin, cel. Każda komórka zawiera jedną wartość, np. jeden termin, a nie listę wszystkich wizyt.",
   "Klucz główny jednoznacznie identyfikuje rekord. Klucz obcy wskazuje rekord w innej tabeli. Zależność Pacjenci 1 → wiele Wizyty oznacza, że pacjent może mieć zero, jedną lub wiele wizyt, lecz każda wizyta w naszym modelu należy do jednego istniejącego pacjenta.",
   "Typ danych określa, jakie wartości pasują do pola. Identyfikatory są liczbami całkowitymi, imię, nazwisko i cel — tekstem, a termin łączy datę z godziną. W symulatorze dobierasz te typy, a potem tworzysz tabele. Nazwy pól są już przygotowane. Właściwe dane wpiszesz dopiero do utworzonej tabeli."
  ],
  "example": {
   "question": "Czy numer 1 może pojawić się w kilku wizytach?",
   "answer": "Tak, w polu id_pacjenta: oznacza kolejne wizyty tej samej osoby. W polu id_wizyty każda wizyta musi mieć inny identyfikator."
  }
 },
 "check": {
  "title": "Sprawdź model, zanim wpiszesz dane",
  "paragraphs": [
   "Imię i nazwisko opisują osobę. Termin i cel opisują wizytę. Dwie osoby mogą mieć identyczne nazwiska, dlatego wyszukiwanie konkretnego pacjenta powinno wykorzystywać jego identyfikator. Nie zakładamy, że nazwisko jest unikalne.",
   "Symulator sprawdza reguły bazy: pola wymagają wartości, klucze główne nie mogą się powtarzać, a klucz obcy wizyty musi wskazywać istniejącego pacjenta. Próba zapisania wizyty dla osoby 99 zakończy się komunikatem, jeśli takiej osoby nie ma w Pacjenci. Błędny zapis nie zmieni tabeli.",
   "Nie dodajemy do modelu pól tylko dlatego, że mogłyby istnieć w prawdziwym gabinecie. Zadanie dotyczy terminarza. Gdyby potrzebny był numer telefonu, należałoby przechować go jako tekst: może zawierać znak +, zera początkowe i nie służy do obliczeń."
  ]
 },
 "create": {
  "title": "Instrukcja pracy w symulatorze",
  "paragraphs": [
   "1. W zakładce Projekt wybierz typ każdego pola oraz klucz główny osobno dla tabel Pacjenci i Wizyty. Identyfikatory są liczbami całkowitymi, imiona, nazwiska i cel są tekstem, a termin — datą i godziną. Utwórz obie tabele. Kluczem głównym Pacjenci jest id_pacjenta, a Wizyty — id_wizyty.",
   "2. Utwórz relację: klucz obcy Wizyty.id_pacjenta ma wskazywać Pacjenci.id_pacjenta. Przejdź do zakładki Dane. Formularzem wpisz trzy fikcyjne osoby według wzoru nad nim: 1 — Ada Testowa, 2 — Jan Przykładowy, 3 — Ewa Modelowa. Po każdej osobie użyj Dodaj pacjenta.",
   "3. Wczytaj cztery przykładowe wizyty przyciskiem w symulatorze. Obejrzyj tabelę: ta sama osoba może występować przy kilku terminach. Formularzem dodaj piątą wizytę: ID wizyty 5, ID pacjenta 1, data 23.09.2026, godzina 10:00, cel kontrola. Nie dodawaj drugi raz Ady do Pacjenci.",
   "4. Sprawdź rekordy i znaczniki zadań nad symulatorem. Pomyłkę popraw przyciskiem Popraw obok rekordu. Symulator sprawdza faktyczny stan bazy. Projekt, wpisane dane i rozpoczęte formularze zapisują się razem z postępem lekcji w tej przeglądarce. Nie trzeba niczego instalować ani pobierać."
  ],
  "example": {
   "question": "Dlaczego wizyta ma dwa identyfikatory?",
   "answer": "id_wizyty rozróżnia wizyty, a id_pacjenta wskazuje osobę. Wizyta 5 należy do pacjenta 1. To inne obiekty i ich numery nie muszą być takie same."
  }
 },
 "query": {
  "title": "Wybierz filtr i zobacz wynik",
  "paragraphs": [
   "W zakładce Wyszukiwanie wybierz filtr Dzień wizyty, ustaw 21.09.2026 i kolejność Od najwcześniejszej. Kliknij Wyszukaj. Symulator łączy dane z obu tabel przez id_pacjenta, wybiera wizyty z tego dnia i porządkuje je według terminu.",
   "Następnie zmień filtr na Pacjent, wybierz 1 — Ada Testowa i ponownie wyszukaj od najwcześniejszej. Zobaczysz wszystkie jej wizyty, także tę dopisaną samodzielnie. Oba wyszukiwania są zaliczane po przygotowaniu wymaganych rekordów. Wynik zależy od Twoich danych; zmiana rekordów wymaga ponownego wykonania wyszukiwań.",
   "Wyszukiwanie nie zmienia tabel. W rozwijanym przykładzie SQL zobaczysz, jak podobna operacja wygląda w języku zapytań: SELECT wybiera kolumny, JOIN łączy tabele, WHERE filtruje, a ORDER BY sortuje. Obsługujesz formularz; kod jest tylko dodatkowym wyjaśnieniem."
  ],
  "example": {
   "question": "Oczekiwany wynik planu dnia",
   "answer": "Dla pięciu wizyt z zadania: 21.09.2026 09:00 — Ada Testowa; 09:30 — Jan Przykładowy; 10:00 — Ewa Modelowa. Filtr pacjenta 1 pokaże terminy 21, 22 i 23 września. Dodatkowe rekordy wpisane podczas eksperymentów mogą rozszerzyć wyniki."
  }
 },
 "summary": {
  "title": "Notatka do powtórki i kryteria sukcesu",
  "paragraphs": [
   "Baza przechowuje uporządkowane dane. Tabela grupuje obiekty jednego rodzaju, rekord opisuje jeden obiekt, a pole — jedną cechę. Klucz główny rozróżnia rekordy, klucz obcy tworzy powiązanie. JOIN pozwala odczytać razem informacje zapisane w dwóch tabelach.",
   "Rezultat lekcji: w symulatorze są dwie tabele, relacja, trzech wymaganych pacjentów i pięć wymaganych wizyt, w tym samodzielnie dopisana kontrola. Wyszukane zostały plan dnia i wizyty Ady. Program sprawdza te działania na podstawie danych. Pokaż wynik nauczycielowi na ekranie; nie jest do niego automatycznie wysyłany.",
   "To model ćwiczeniowy z formularzami. Kontroluje wymagane wartości, unikalność identyfikatorów, poprawność terminu i powiązania. Nie sprawdza nakładania się wizyt ani nie obsługuje uprawnień pracowników. Przycisk Zacznij bazę od nowa wymaga potwierdzenia; usuwa tylko symulację i jej zaliczenia. Przycisk w stopce strony usuwa cały postęp lekcji."
  ],
  "example": {
   "question": "Sprawdź swoje wyjaśnienie",
   "answer": "Pacjenta zapisujemy raz. Każda nowa wizyta dostaje osobny id_wizyty i istniejący id_pacjenta. Nazwisko widoczne w wyniku pochodzi z Pacjenci, a termin z Wizyty. Relacja pozwala połączyć te dane bez przepisywania nazwiska do każdej wizyty."
  }
 }
},
 '06': {
  start:{title:'Model opisuje funkcje',paragraphs:['Logiczny model komputera upraszcza urządzenie do współpracujących części: wejścia, pamięci, procesora i wyjścia. Pomaga odpowiedzieć, co dzieje się z danymi. Nie jest fotografią wnętrza ani instrukcją montażu.','Gdy wpisujesz 5 + 3, klawiatura dostarcza dane. Program i potrzebne wartości są w pamięci. Procesor wykonuje instrukcje prowadzące do obliczenia sumy. Kolejne działania programu powodują wyświetlenie wyniku 8. W rzeczywistym systemie uczestniczą również system operacyjny i układy obsługujące urządzenia.']},
  model:{title:'Program też jest zapisany w pamięci',paragraphs:['W uproszczonym modelu von Neumanna instrukcje programu i dane znajdują się w pamięci. Procesor pobiera instrukcje i je wykonuje. Ten sam sprzęt może uruchamiać kalkulator, edytor albo grę, bo zmienia się program.','W procesorze jednostka sterująca koordynuje pracę, ALU wykonuje działania arytmetyczne i logiczne, a rejestry przechowują niewielkie porcje bieżących danych. Magistrale umożliwiają wymianę danych, adresów i sygnałów sterujących. Nowoczesne procesory mają dodatkowe mechanizmy, np. pamięci podręczne; tutaj skupiamy się na podstawowych funkcjach.','RAM przechowuje aktualnie używany program i dane oraz traci zawartość po wyłączeniu zasilania. SSD zachowuje zapisane pliki. Załadowanie programu z dysku do RAM i zapisanie wyniku na dysk to inne czynności niż samo wykonanie obliczenia.'],example:{question:'Czy ekran dotykowy jest wejściem czy wyjściem?',answer:'Pełni obie role: warstwa dotykowa przekazuje dane wejściowe, a wyświetlacz prezentuje dane wyjściowe. Role w modelu nie muszą oznaczać osobnych obudów.'}},
  cycle:{title:'Cykl instrukcji krok po kroku',paragraphs:['Pobierz: procesor odczytuje z pamięci instrukcję pod adresem wskazanym przez licznik rozkazów. Zdekoduj: ustala, jaką operację ma wykonać i skąd pobrać argumenty. Wykonaj: realizuje operację, np. dodawanie, przeniesienie danych lub skok. Wynik trafia w miejsce określone przez instrukcję.','Następnie procesor przechodzi do następnej instrukcji. Skok może zmienić kolejność wykonywania programu. To uproszczenie: współczesne procesory mogą nakładać etapy wielu instrukcji, lecz trzy kroki pomagają zrozumieć sens wykonania programu.'],example:{question:'Umowny przykład: dodaj wartości 5 i 3',answer:'Procesor pobiera instrukcję dodawania, rozpoznaje operację i argumenty, a ALU oblicza 8. Wynik może zostać w rejestrze. Nie musi od razu pojawić się na ekranie — wyświetleniem zajmują się dalsze instrukcje programu.'}},
  read:{title:'System pozycyjny o podstawie 2',paragraphs:['W zapisie dziesiętnym pozycje od prawej mają wagi 1, 10, 100… W dwójkowym mają wagi 1, 2, 4, 8, 16, 32, 64, 128… Używamy tylko cyfr 0 i 1. Indeks ₂ oznacza zapis dwójkowy, a ₁₀ — dziesiętny.','Przykład: 00001101₂ = 0·128 + 0·64 + 0·32 + 0·16 + 1·8 + 1·4 + 0·2 + 1·1 = 13₁₀. Praktycznie wystarczy dodać wagi pozycji, na których stoją jedynki. Zera z lewej strony nie zmieniają wartości.','Bit ma dwie możliwe wartości. W układach elektronicznych odpowiadają im rozróżnialne stany fizyczne, np. zakresy napięć. Ciąg bitów może kodować liczbę, znak, kolor lub instrukcję. Znaczenie zależy od sposobu interpretacji; w tej lekcji odczytujemy liczby całkowite bez znaku.'],example:{question:'Prześledź przykład 00101101₂',answer:'Wagi od lewej: 128, 64, 32, 16, 8, 4, 2, 1. Jedynki stoją przy 32, 8, 4 i 1. Dodajemy: 32 + 8 + 4 + 1 = 45₁₀.'}},
  write:{title:'Dwie metody zamiany 26₁₀',paragraphs:['Metoda wag: największa potęga dwójki nieprzekraczająca 26 to 16. Zostaje 10. Wybieramy 8, zostaje 2. Wybieramy 2, zostaje 0. W kolumnach 16, 8 i 2 wpisujemy jedynki, w pozostałych zera: 00011010₂.','Metoda dzielenia całkowitego: 26 : 2 = 13 reszta 0; 13 : 2 = 6 reszta 1; 6 : 2 = 3 reszta 0; 3 : 2 = 1 reszta 1; 1 : 2 = 0 reszta 1. Kończymy, gdy iloraz wynosi 0. Reszty czytamy od ostatniej do pierwszej: 11010₂. Do ośmiu bitów dopisujemy trzy zera z lewej: 00011010₂.','Sprawdzenie: 16 + 8 + 2 = 26. Teraz na kartce zamień 19 i 42, a dopiero potem wybierz odpowiedzi. Zapisuj wagi, żeby sprawdzać własne rozumowanie. Kalkulator może zweryfikować wynik po obliczeniach.'],example:{question:'Dlaczego nie dopisujemy zer z prawej?',answer:'11010₂ to 26, ale 110100₂ to 52. Dopisanie zera z prawej przesuwa jedynki na pozycje o dwukrotnie większych wagach. Zera wiodące z lewej nie zmieniają wartości.'}},
  summary:{title:'Bit, bajt i zakres wartości',paragraphs:['Jeden bajt to 8 bitów. Dwa bity tworzą 2² = 4 układy: 00, 01, 10, 11, czyli wartości 0–3. Osiem bitów daje 2⁸ = 256 układów. Gdy interpretujemy je jako liczby całkowite bez znaku, zakres wynosi od 0 do 255. Ogólnie n bitów daje 2ⁿ układów i zakres od 0 do 2ⁿ − 1.','Liczba 256 ma zapis 100000000₂, więc wymaga dziewięciu bitów. Zakres 0–255 nie opisuje wszystkich możliwych zastosowań bajtu: inne kodowanie może oznaczać liczby ze znakiem albo znaki tekstowe.','Do powtórki: wejście dostarcza dane, pamięć przechowuje dane i instrukcje, procesor wykonuje cykl pobierz – zdekoduj – wykonaj, a wyjście udostępnia wynik. Przy odczytywaniu liczby dwójkowej dodajesz wagi jedynek; przy zapisie sprawdzasz wynik operacją odwrotną.'],example:{question:'Sprawdź się bez notatek',answer:'00101101₂ = 45₁₀; 26₁₀ = 00011010₂; 3 bajty = 24 bity; 11111111₂ = 255₁₀. Jeśli wynik się nie zgadza, wypisz wagi od prawej: 1, 2, 4, 8…'}}
 }
};
