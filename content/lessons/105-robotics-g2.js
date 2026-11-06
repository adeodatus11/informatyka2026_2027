export default {
 "id": "105",
 "grade": 2,
 "order": 30,
 "title": "Budowanie robota – tworzenie oprogramowania",
 "subtitle": "Ten sam Rover-2 ma przejechać trasę, ominąć przeszkodę i reagować na STOP. Teraz połączenia dostaną program.",
 "topic": "Robotyka: czujniki, program i próby",
 "icon": "code",
 "tags": [
  "robotyka",
  "Python",
  "testy"
 ],
 "duration": 45,
 "curriculum": "I.1, I.3, II.1, II.2, IV.1",
 "format": {
  "name": "Mały układ, konkretna próba, poprawa",
  "student": "Pracujesz sam w symulatorze. Przewidujesz wynik, uruchamiasz próbę i poprawiasz układ według danych. Na koniec pokazujesz testy.",
  "teacher": "Modeluj jeden przypadek na głos i zbierz odpowiedzi wszystkich. Następnie uczniowie samodzielnie tworzą rozwiązanie. Po błędzie odwołuj się do jednego kryterium i zostaw czas na poprawę. Przypadek ma zamknięte, fikcyjne dane i mierzalny wynik.",
  "grouping": "Domyślnie samodzielnie. Przy sprawdzaniu scenariuszy można porównać tok rozumowania z sąsiadem; bez sztywnych ról. Osoba bez pary wykonuje te same próby samodzielnie.",
  "methods": [
   {
    "name": "Przypominanie i powroty",
    "url": "https://metodyka.covepolska.pl/metoda-przypominanie-i-powroty.html"
   },
   {
    "name": "Modelowanie",
    "url": "https://metodyka.covepolska.pl/metoda-modelowanie.html"
   },
   {
    "name": "Ocenianie kształtujące i poprawa",
    "url": "https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html"
   },
   {
    "name": "Problem, przypadek, projekt",
    "url": "https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"
   }
  ]
 },
 "objectives": [
  "Programuję ten sam model Rover-2.",
  "Ustalam priorytety STOP, przeszkody i linii.",
  "Testuję granicę 20 cm i analizuję tabelę działań."
 ],
 "materials": [
  "Komputer z przeglądarką; Python i mikrokontroler działają lokalnie, bez konta.",
  "Projektor do krótkiego pokazu decyzji i odczytów."
 ],
 "teacherGuide": {
  "preparation": "Przed dzwonkiem otwórz laboratorium, by załadować Python. Scenariusze i progi są fikcyjne. Metody COVE sprawdzono 25.10.2026. Jeśli szkoła ma zestawy micro:bit lub Arduino z Laboratoriów Przyszłości: DO WERYFIKACJI ze sprzętem w pracowni. Nauczyciel sprawdza zgodność API, zakres napięć, sterownik silników i instrukcję producenta. Uczniowie nie pracują z instalacją 230 V. Symulator nie potwierdza bezpieczeństwa prawdziwego układu.",
  "summary": "Uczeń przechodzi model, samodzielne wykonanie i poprawę na danych. Karta: maks. 10 pkt, bez punktowania samego przypomnienia. Wczytywanie JSON odbywa się lokalnie. Awaryjnie można odtworzyć ten sam model Rover-2. Nauczyciel ocenia umiejętność wyjaśnienia decyzji; karta dotyczy symulacji."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Po co ten układ?",
   "intro": "Ten sam Rover-2 ma przejechać trasę, ominąć przeszkodę i reagować na STOP. Teraz połączenia dostaną program.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Najpierw odpowiedz bez notatek. Po odpowiedzi przeczytaj wyjaśnienie i popraw ewentualny błąd.",
     "Dziś pracujesz na fikcyjnych odczytach, bez prawdziwego zasilania i bez wysyłania danych."
    ]
   },
   "duration": 4,
   "teacherNotes": "Poproś wszystkich o odpowiedź. Omów najczęstszy błąd z poprzedniej lekcji i połącz go z dzisiejszym przypadkiem. Powtórka nie jest kartkówką na stopień.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Sygnał logiczny nie jest zasilaniem silnika. Używamy tego samego Rover-2.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r105-recall",
     "question": "Z lekcji montażu: dlaczego silnik jest podłączony przez sterownik?",
     "options": [
      "Żeby zmienić tytuł projektu",
      "Żeby pominąć zasilanie",
      "Pin mikrokontrolera wysyła sygnał, a sterownik zasila silnik"
     ],
     "correct": [
      2
     ],
     "explanation": "Sygnał logiczny nie jest zasilaniem silnika. Używamy tego samego Rover-2.",
     "hint": "Sygnał logiczny nie jest zasilaniem silnika. Używamy tego samego Rover-2."
    }
   ]
  },
  {
   "id": "model",
   "label": "Model",
   "title": "Wejście → decyzja → wyjście",
   "intro": "Nazwij dane wejściowe i oczekiwane działanie. Najpierw przejdź jeden przykład bez kodu.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Wczytaj plik Rover-2-polaczenia.json z poprzedniej lekcji. Jeśli go nie masz, odtwórz wzorcowy model. Przycisk STOP jest na D2, odległość na A0, linia na A1; D5/D6 sterują silnikami.",
     "Reguły mają kolejność: najpierw STOP, potem przeszkoda <=20 cm, potem brak linii, na końcu jazda prosto. Wartości prędkości są umowne, od 0 do 100; symulator nie oblicza toru jazdy ani dynamiki."
    ]
   },
   "duration": 7,
   "teacherNotes": "Modelowanie COVE: wypowiedz na głos dane, warunek i działanie. Przy większości poprawnych odpowiedzi przejdź dalej; przy podziale poproś o uzasadnienia, przy większości błędnych pokaż jeden inny przykład.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "STOP kończy ruch niezależnie od pozostałych czujników.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r105-model",
     "question": "STOP jest wciśnięty i czujnik widzi przeszkodę 10 cm. Co ma pierwszeństwo?",
     "options": [
      "Skręt w prawo",
      "Oba silniki 0",
      "Jazda wzdłuż linii"
     ],
     "correct": [
      1
     ],
     "explanation": "STOP kończy ruch niezależnie od pozostałych czujników.",
     "hint": "STOP kończy ruch niezależnie od pozostałych czujników."
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Wczytaj lub odtwórz Rover-2. Uruchom próbę „Przeszkoda i wolna droga”. Dodaj warunki w podanej kolejności. Sprawdź także scenariusz „Linia znika”, odległość dokładnie 20 cm i STOP.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Użyj jednej drabinki if/elif/else. Dwie osobne instrukcje if mogą nadpisać polecenie STOP. Najpierw oblicz lewy i prawy, potem ustaw wyjścia i odczekaj 1000 ms.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 23,
   "teacherNotes": "W pierwszych trzech minutach tego etapu uruchom z uczniami pierwszy przebieg albo podłącz zasilanie i masę. Potem pracują sami. Daj jedną uwagę do konkretnego warunku i co najmniej siedem minut na poprawę. Chętna para może porównać przebiegi, każdy sam tłumaczy decyzję.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Użyj jednej drabinki if/elif/else. Dwie osobne instrukcje if mogą nadpisać polecenie STOP. Najpierw oblicz lewy i prawy, potem ustaw wyjścia i odczekaj 1000 ms.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "r105-lab",
     "title": "Program i próby",
     "mode": "code",
     "points": 8,
     "project": "rover",
     "requiresWiring": true
    }
   ]
  },
  {
   "id": "transfer",
   "label": "Nowy przypadek",
   "title": "Sprawdź poza przykładem",
   "intro": "Zmień sytuację. Czy Twoje rozwiązanie nadal zachowuje się właściwie?",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Warunek obejmuje <=20, więc granica wymaga skrętu. Nie pomyl < z <=.",
     "Wyjaśnij na jednym odczycie, dlaczego wybrane działanie jest zgodne z kryterium."
    ]
   },
   "duration": 7,
   "teacherNotes": "Zbierz uzasadnienia, nie tylko litery odpowiedzi. Jeśli uczeń wybierze zły wariant, poproś o odczyt wejść po kolei i daj czas na poprawę w laboratorium.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Warunek obejmuje <=20, więc granica wymaga skrętu. Nie pomyl < z <=.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r105-transfer",
     "question": "Przeszkoda jest dokładnie 20 cm od robota. Jaka decyzja pasuje do specyfikacji?",
     "options": [
      "Jedź prosto",
      "Zignoruj odległość",
      "Skręć: lewy 0, prawy 30"
     ],
     "correct": [
      2
     ],
     "explanation": "Warunek obejmuje <=20, więc granica wymaga skrętu. Nie pomyl < z <=.",
     "hint": "Warunek obejmuje <=20, więc granica wymaga skrętu. Nie pomyl < z <=."
    }
   ]
  },
  {
   "id": "result",
   "label": "Wynik",
   "title": "Pokaż działający układ",
   "intro": "Pokaż sprawdzone scenariusze albo połączenia. Nazwij błąd, który udało Ci się poprawić.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Karta pokazuje punkty z ćwiczeń w symulacji. Nie potwierdza działania prawdziwego sprzętu.",
     "Pomyśl, który warunek lub przewód sprawdzisz najpierw, gdy układ nie zadziała."
    ]
   },
   "duration": 4,
   "teacherNotes": "Poproś o jedną konkretną poprawkę z uzasadnieniem. Zapisz trudny warunek do powtórki na następnej lekcji oraz za tydzień.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Testuję granicę 20 cm i analizuję tabelę działań.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Układ po testach",
     "sources": [
      "r105-model",
      "r105-lab",
      "r105-transfer"
     ],
     "badges": [
      {
       "min": 0,
       "name": "Pierwszy odczyt",
       "text": "Popraw jeden wskazany warunek lub przewód."
      },
      {
       "min": 0.5,
       "name": "Sterowanie nabiera sensu",
       "text": "Część przypadków już działa. Sprawdź granice."
      },
      {
       "min": 0.85,
       "name": "Sprawdzone na brzegu",
       "text": "Potrafisz wyjaśnić decyzje także w nietypowych sytuacjach."
      }
     ]
    }
   ]
  }
 ],
 "exitTicket": "Który odczyt lub przewód ujawnił błąd? Co zmieniłeś i jak sprawdziłeś poprawę?"
};
