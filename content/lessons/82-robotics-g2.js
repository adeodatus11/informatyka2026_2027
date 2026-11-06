export default {
 "id": "82",
 "grade": 2,
 "order": 25,
 "title": "Sterowanie nawadnianiem ogrodu – wprowadzenie do robotyki i zadanie projektowe",
 "subtitle": "Rośliny mają wodę, a pompa nie chodzi bez przerwy. Zaprogramujesz prosty układ, który podejmuje decyzję z odczytów.",
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
  "Odróżniam czujnik od elementu wykonawczego.",
  "Piszę pętlę czytaj → decyduj → działaj.",
  "Testuję próg, deszcz, noc i brak wody."
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
   "intro": "Rośliny mają wodę, a pompa nie chodzi bez przerwy. Zaprogramujesz prosty układ, który podejmuje decyzję z odczytów.",
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
   "expectedAnswers": "Test musi obejmować dane, z którymi program sobie nie poradzi. Dziś takim przypadkiem będzie pusty zbiornik.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r82-recall",
     "question": "Z poprzedniej lekcji o ułamkach: dlaczego testowaliśmy mianownik 0?",
     "options": [
      "Żeby sprawdzić dane niedozwolone",
      "Bo każdy ułamek ma mianownik 0",
      "Tylko dla ładnego wyniku"
     ],
     "correct": [
      0
     ],
     "explanation": "Test musi obejmować dane, z którymi program sobie nie poradzi. Dziś takim przypadkiem będzie pusty zbiornik.",
     "hint": "Test musi obejmować dane, z którymi program sobie nie poradzi. Dziś takim przypadkiem będzie pusty zbiornik."
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
     "Czujnik jest wejściem: podaje odczyt, np. wilgotność 20%. Pompa jest wyjściem: dostaje polecenie włącz albo wyłącz. Mikrokontroler powtarza czytaj → decyduj → działaj.",
     "W tym modelu podlewamy przy wilgotności poniżej 30%, tylko w dzień, bez deszczu i z wodą w zbiorniku. To fikcyjne parametry ćwiczenia, nie instrukcja podlewania konkretnych roślin."
    ]
   },
   "duration": 7,
   "teacherNotes": "Modelowanie COVE: wypowiedz na głos dane, warunek i działanie. Przy większości poprawnych odpowiedzi przejdź dalej; przy podziale poproś o uzasadnienia, przy większości błędnych pokaż jeden inny przykład.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "30 < 30 jest fałszem. Granica też wymaga testu.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r82-model",
     "question": "Wilgotność wynosi dokładnie 30%. Warunek to wilgotnosc < 30. Co zrobi pompa?",
     "options": [
      "Włączy się",
      "Wyłączy się",
      "Nie da się sprawdzić"
     ],
     "correct": [
      1
     ],
     "explanation": "30 < 30 jest fałszem. Granica też wymaga testu.",
     "hint": "30 < 30 jest fałszem. Granica też wymaga testu."
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Najpierw uruchom próbę „Sucho → mokro”. Kod działa dla prostego przypadku. Następnie sprawdź wszystkie scenariusze. Dodaj warunki deszczu, nocy i wody. Pompa i dioda muszą działać zgodnie z regułą.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Nie kopiuj od razu całego rozwiązania. Sprawdź w tabeli pierwszy zły wiersz. Do warunku dołącz brak deszczu, dzień i wodę. Po poprawie uruchom cały komplet.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 23,
   "teacherNotes": "W pierwszych trzech minutach tego etapu uruchom z uczniami pierwszy przebieg albo podłącz zasilanie i masę. Potem pracują sami. Daj jedną uwagę do konkretnego warunku i co najmniej siedem minut na poprawę. Chętna para może porównać przebiegi, każdy sam tłumaczy decyzję.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Nie kopiuj od razu całego rozwiązania. Sprawdź w tabeli pierwszy zły wiersz. Do warunku dołącz brak deszczu, dzień i wodę. Po poprawie uruchom cały komplet.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "r82-lab",
     "title": "Program i próby",
     "mode": "code",
     "points": 8,
     "project": "garden"
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
     "Warunek bezpieczeństwa ma pierwszeństwo. Program ma sprawdzać także stan zbiornika.",
     "Wyjaśnij na jednym odczycie, dlaczego wybrane działanie jest zgodne z kryterium."
    ]
   },
   "duration": 7,
   "teacherNotes": "Zbierz uzasadnienia, nie tylko litery odpowiedzi. Jeśli uczeń wybierze zły wariant, poproś o odczyt wejść po kolei i daj czas na poprawę w laboratorium.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Warunek bezpieczeństwa ma pierwszeństwo. Program ma sprawdzać także stan zbiornika.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r82-transfer",
     "question": "Wilgotność 10%, dzień, nie pada, ale zbiornik jest pusty. Co jest ważniejsze?",
     "options": [
      "Próg wilgotności: włącz pompę",
      "Wyłącz pompę, bo nie ma wody",
      "Zwiększ prędkość pompy"
     ],
     "correct": [
      1
     ],
     "explanation": "Warunek bezpieczeństwa ma pierwszeństwo. Program ma sprawdzać także stan zbiornika.",
     "hint": "Warunek bezpieczeństwa ma pierwszeństwo. Program ma sprawdzać także stan zbiornika."
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
   "expectedAnswers": "Testuję próg, deszcz, noc i brak wody.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Układ po testach",
     "sources": [
      "r82-model",
      "r82-lab",
      "r82-transfer"
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
