export default {
 "id": "86",
 "grade": 2,
 "order": 29,
 "title": "Budowanie robota – przygotowanie pomocy i montowanie układu",
 "subtitle": "Robot nie reaguje mimo dobrego programu? Najpierw sprawdzisz zasilanie, wspólną masę i właściwe piny.",
 "topic": "Robotyka: czujniki, program i próby",
 "icon": "code",
 "tags": [
  "robotyka",
  "połączenia",
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
    "name": "Problem, przypadek, projekt",
    "url": "https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"
   }
  ]
 },
 "objectives": [
  "Rozróżniam zasilanie, masę i sygnał.",
  "Łączę czujniki i sterownik według schematu.",
  "Diagnozuję błędy i zapisuję konfigurację Rover-2."
 ],
 "materials": [
  "Komputer z przeglądarką; Python i mikrokontroler działają lokalnie, bez konta.",
  "Projektor do krótkiego pokazu decyzji i odczytów."
 ],
 "teacherGuide": {
  "preparation": "Przed dzwonkiem otwórz laboratorium, by załadować Python. Scenariusze i progi są fikcyjne. Metody COVE sprawdzono 25.10.2026. Jeśli szkoła ma zestawy micro:bit lub Arduino z Laboratoriów Przyszłości: DO WERYFIKACJI ze sprzętem w pracowni. Nauczyciel sprawdza zgodność API, zakres napięć, sterownik silników i instrukcję producenta. Uczniowie nie pracują z instalacją 230 V. Symulator nie potwierdza bezpieczeństwa prawdziwego układu.",
  "summary": "Uczeń przechodzi model, samodzielne wykonanie i poprawę na danych. Karta: maks. 10 pkt, bez punktowania samego przypomnienia. Zapisz konfigurację Rover-2-polaczenia.json lokalnie; na następnej lekcji wczytaj ją do programu. Nauczyciel ocenia umiejętność wyjaśnienia decyzji; karta dotyczy symulacji."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Po co ten układ?",
   "intro": "Robot nie reaguje mimo dobrego programu? Najpierw sprawdzisz zasilanie, wspólną masę i właściwe piny.",
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
   "expectedAnswers": "Przekaźnik wykonuje polecenie sterownika. Silniki robota też są wyjściami, ale potrzebują sterownika.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r86-recall",
     "question": "Z lekcji o radiu: przekaźnik jest…",
     "options": [
      "Czujnikiem hałasu",
      "Elementem wykonawczym",
      "Zmienną przechowującą próg"
     ],
     "correct": [
      1
     ],
     "explanation": "Przekaźnik wykonuje polecenie sterownika. Silniki robota też są wyjściami, ale potrzebują sterownika.",
     "hint": "Przekaźnik wykonuje polecenie sterownika. Silniki robota też są wyjściami, ale potrzebują sterownika."
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
     "Model Rover-2 ma dwa silniki przez sterownik, czujnik odległości, czujnik linii i przycisk STOP. Piny A0/A1 odczytują czujniki, D5/D6 sterują wejściami sterownika silników.",
     "Zasilanie, masa i sygnał to osobne połączenia. Czujniki modelu mają zasilanie 3V3, sterownik 5V i wspólną masę GND. Nie zasilaj silnika z pinu sygnałowego mikrokontrolera."
    ]
   },
   "duration": 7,
   "teacherNotes": "Modelowanie COVE: wypowiedz na głos dane, warunek i działanie. Przy większości poprawnych odpowiedzi przejdź dalej; przy podziale poproś o uzasadnienia, przy większości błędnych pokaż jeden inny przykład.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Odczyt wymaga właściwego zasilania i odniesienia do wspólnej masy. Kod tego nie naprawi.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r86-model",
     "question": "Sygnał czujnika jest podłączony do A0, ale brakuje wspólnej masy. Co zrobisz najpierw?",
     "options": [
      "Połącz GND zgodnie z modelem",
      "Zwiększ próg w Pythonie",
      "Włącz najwyższe napięcie"
     ],
     "correct": [
      0
     ],
     "explanation": "Odczyt wymaga właściwego zasilania i odniesienia do wspólnej masy. Kod tego nie naprawi.",
     "hint": "Odczyt wymaga właściwego zasilania i odniesienia do wspólnej masy. Kod tego nie naprawi."
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Rozwiń tabelę modelu. Wybierz połączenia zasilania, masy i sygnałów dla Rover-2. Sprawdź układ i popraw każdy wskazany błąd. Na końcu zapisz konfigurację JSON na następną lekcję.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Jeśli brakuje masy, zacznij od GND. Jeśli napięcie jest złe, wróć do tabeli modelu. Piny sygnałowe porównaj z nazwą wejścia i wyjścia, nie z kolorem przewodu.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 23,
   "teacherNotes": "W pierwszych trzech minutach tego etapu uruchom z uczniami pierwszy przebieg albo podłącz zasilanie i masę. Potem pracują sami. Daj jedną uwagę do konkretnego warunku i co najmniej siedem minut na poprawę. Chętna para może porównać przebiegi, każdy sam tłumaczy decyzję.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Jeśli brakuje masy, zacznij od GND. Jeśli napięcie jest złe, wróć do tabeli modelu. Piny sygnałowe porównaj z nazwą wejścia i wyjścia, nie z kolorem przewodu.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "r86-lab",
     "title": "Połączenia Rover-2",
     "mode": "wire",
     "points": 8
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
     "Plik zapisuje model i mapę połączeń lokalnie. Następnie wczytasz go do zadania z kodem.",
     "Wyjaśnij na jednym odczycie, dlaczego wybrane działanie jest zgodne z kryterium."
    ]
   },
   "duration": 7,
   "teacherNotes": "Zbierz uzasadnienia, nie tylko litery odpowiedzi. Jeśli uczeń wybierze zły wariant, poproś o odczyt wejść po kolei i daj czas na poprawę w laboratorium.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Plik zapisuje model i mapę połączeń lokalnie. Następnie wczytasz go do zadania z kodem.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r86-transfer",
     "question": "Po co zachowujesz konfigurację Rover-2?",
     "options": [
      "Żeby na kolejnej lekcji programować ten sam model",
      "Żeby wysłać ją do internetu",
      "Żeby zasilić robota plikiem"
     ],
     "correct": [
      0
     ],
     "explanation": "Plik zapisuje model i mapę połączeń lokalnie. Następnie wczytasz go do zadania z kodem.",
     "hint": "Plik zapisuje model i mapę połączeń lokalnie. Następnie wczytasz go do zadania z kodem."
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
   "expectedAnswers": "Diagnozuję błędy i zapisuję konfigurację Rover-2.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Układ po testach",
     "sources": [
      "r86-model",
      "r86-lab",
      "r86-transfer"
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
