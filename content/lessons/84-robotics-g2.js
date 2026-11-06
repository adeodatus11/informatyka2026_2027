export default {
 "id": "84",
 "grade": 2,
 "order": 27,
 "title": "Projekt „Zamknij okno”",
 "subtitle": "Burza zaczyna się, gdy nikogo nie ma przy oknie. Napiszesz sterowanie, które reaguje na dwa czujniki i przycisk STOP.",
 "topic": "Robotyka: czujniki, program i próby",
 "icon": "code",
 "tags": [
  "robotyka",
  "Python",
  "testy"
 ],
 "duration": 45,
 "curriculum": "I.1, I.3, II.1, II.2",
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
   }
  ]
 },
 "objectives": [
  "Łączę odczyty deszczu i kontaktronu.",
  "Steruję serwem i buzzerem.",
  "Testuję STOP i zamknięte okno."
 ],
 "materials": [
  "Komputer z przeglądarką; Python i mikrokontroler działają lokalnie, bez konta.",
  "Projektor do krótkiego pokazu decyzji i odczytów."
 ],
 "teacherGuide": {
  "preparation": "Przed dzwonkiem otwórz laboratorium, by załadować Python. Scenariusze i progi są fikcyjne. Metody COVE sprawdzono 25.10.2026. Jeśli szkoła ma zestawy micro:bit lub Arduino z Laboratoriów Przyszłości: DO WERYFIKACJI ze sprzętem w pracowni. Nauczyciel sprawdza zgodność API, zakres napięć, sterownik silników i instrukcję producenta. Uczniowie nie pracują z instalacją 230 V. Symulator nie potwierdza bezpieczeństwa prawdziwego układu.",
  "summary": "Uczeń przechodzi model, samodzielne wykonanie i poprawę na danych. Karta: maks. 10 pkt, bez punktowania samego przypomnienia. Nauczyciel ocenia umiejętność wyjaśnienia decyzji; karta dotyczy symulacji."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Po co ten układ?",
   "intro": "Burza zaczyna się, gdy nikogo nie ma przy oknie. Napiszesz sterowanie, które reaguje na dwa czujniki i przycisk STOP.",
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
   "expectedAnswers": "Dwa różne progi ograniczają przełączanie. Dziś warunki bezpieczeństwa zastosujesz do serwa.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r84-recall",
     "question": "Z lekcji 83: co robi histereza?",
     "options": [
      "Zmienia jednostkę odczytu",
      "Usuwa wszystkie czujniki",
      "Zachowuje stan między dwoma progami"
     ],
     "correct": [
      2
     ],
     "explanation": "Dwa różne progi ograniczają przełączanie. Dziś warunki bezpieczeństwa zastosujesz do serwa.",
     "hint": "Dwa różne progi ograniczają przełączanie. Dziś warunki bezpieczeństwa zastosujesz do serwa."
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
     "Kontaktron wykrywa stan okna. W modelu okno=1 oznacza otwarte. Czujnik deszczu daje 1, gdy pada. Serwo dostaje 90° jako polecenie zamknięcia albo 0° jako brak ruchu.",
     "Zamykaj tylko przy deszczu i otwartym oknie. STOP natychmiast blokuje ruch. Buzzer ma sygnalizować ruch. Model pokazuje polecenie sterownika; nie oblicza siły ani położenia prawdziwego okna."
    ]
   },
   "duration": 7,
   "teacherNotes": "Modelowanie COVE: wypowiedz na głos dane, warunek i działanie. Przy większości poprawnych odpowiedzi przejdź dalej; przy podziale poproś o uzasadnienia, przy większości błędnych pokaż jeden inny przykład.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Nie wymuszaj ruchu zamkniętego okna. W modelu brak ruchu to 0°.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r84-model",
     "question": "Pada, ale kontaktron zgłasza zamknięte okno. Jakie polecenie jest właściwe?",
     "options": [
      "Serwo 90° bez końca",
      "Serwo 0°, bez buzzera",
      "Zignoruj kontaktron"
     ],
     "correct": [
      1
     ],
     "explanation": "Nie wymuszaj ruchu zamkniętego okna. W modelu brak ruchu to 0°.",
     "hint": "Nie wymuszaj ruchu zamkniętego okna. W modelu brak ruchu to 0°."
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Uruchom próbę „Otwarte okno i deszcz”. Kod startowy porusza serwem zawsze. Utwórz warunek zamykaj, sprawdź kontaktron i STOP. Buzzer ma działać tylko razem z poleceniem ruchu.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Wypisz trzy warunki osobno: pada, okno otwarte, STOP niewciśnięty. Połącz je przez and. Sprawdź także moment, w którym kontaktron zgłasza już zamknięcie.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 23,
   "teacherNotes": "W pierwszych trzech minutach tego etapu uruchom z uczniami pierwszy przebieg albo podłącz zasilanie i masę. Potem pracują sami. Daj jedną uwagę do konkretnego warunku i co najmniej siedem minut na poprawę. Chętna para może porównać przebiegi, każdy sam tłumaczy decyzję.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Wypisz trzy warunki osobno: pada, okno otwarte, STOP niewciśnięty. Połącz je przez and. Sprawdź także moment, w którym kontaktron zgłasza już zamknięcie.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "r84-lab",
     "title": "Program i próby",
     "mode": "code",
     "points": 8,
     "project": "window"
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
     "STOP blokuje ruch i sygnał ruchu. Sam deszcz nie może go ominąć.",
     "Wyjaśnij na jednym odczycie, dlaczego wybrane działanie jest zgodne z kryterium."
    ]
   },
   "duration": 7,
   "teacherNotes": "Zbierz uzasadnienia, nie tylko litery odpowiedzi. Jeśli uczeń wybierze zły wariant, poproś o odczyt wejść po kolei i daj czas na poprawę w laboratorium.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "STOP blokuje ruch i sygnał ruchu. Sam deszcz nie może go ominąć.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r84-transfer",
     "question": "Pada i okno jest otwarte, ale ktoś nacisnął STOP. Co wyślesz?",
     "options": [
      "Serwo 90°",
      "Serwo 0° i buzzer wyłączony",
      "Tylko buzzer włączony"
     ],
     "correct": [
      1
     ],
     "explanation": "STOP blokuje ruch i sygnał ruchu. Sam deszcz nie może go ominąć.",
     "hint": "STOP blokuje ruch i sygnał ruchu. Sam deszcz nie może go ominąć."
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
   "expectedAnswers": "Testuję STOP i zamknięte okno.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Układ po testach",
     "sources": [
      "r84-model",
      "r84-lab",
      "r84-transfer"
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
