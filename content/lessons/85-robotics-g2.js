export default {
 "id": "85",
 "grade": 2,
 "order": 28,
 "title": "Projekt „Wycisz radio”",
 "subtitle": "Hałas w pokoju rośnie. Radio ma się wyciszyć, ale nie może przełączać się przy każdym głośniejszym słowie.",
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
   {"name":"Problem, przypadek, projekt","url":"https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"},
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
  "Steruję przekaźnikiem na podstawie odczytu.",
  "Stosuję histerezę i STOP.",
  "Odróżniam symulację logiczną od instalacji elektrycznej."
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
   "intro": "Hałas w pokoju rośnie. Radio ma się wyciszyć, ale nie może przełączać się przy każdym głośniejszym słowie.",
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
   "expectedAnswers": "STOP blokuje działanie. Dziś też może natychmiast wyciszyć urządzenie.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r85-recall",
     "question": "Z projektu okna: jaki warunek ma pierwszeństwo przed ruchem serwa?",
     "options": [
      "Ładna pogoda",
      "Wciśnięty STOP",
      "Dowolny dźwięk"
     ],
     "correct": [
      1
     ],
     "explanation": "STOP blokuje działanie. Dziś też może natychmiast wyciszyć urządzenie.",
     "hint": "STOP blokuje działanie. Dziś też może natychmiast wyciszyć urządzenie."
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
     "Przekaźnik jest wyjściem: w modelu True włącza radio. Dioda świeci, gdy radio jest wyciszone. Odczyt hałasu jest w umownych jednostkach; nie jest pomiarem dB.",
     "Początkowo radio gra. Powyżej 70 wycisz, poniżej 50 włącz ponownie. Pomiędzy progami i dokładnie na 50 lub 70 zachowaj stan. STOP wycisza natychmiast."
    ]
   },
   "duration": 7,
   "teacherNotes": "Modelowanie COVE: wypowiedz na głos dane, warunek i działanie. Przy większości poprawnych odpowiedzi przejdź dalej; przy podziale poproś o uzasadnienia, przy większości błędnych pokaż jeden inny przykład.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "60 jest pomiędzy progami. Powrót dźwięku nastąpi dopiero poniżej 50.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r85-model",
     "question": "Radio jest wyciszone, odczyt spada do 60. Co się stanie?",
     "options": [
      "Radio od razu wróci",
      "Przekaźnik się uszkodzi",
      "Zostanie wyciszone"
     ],
     "correct": [
      2
     ],
     "explanation": "60 jest pomiędzy progami. Powrót dźwięku nastąpi dopiero poniżej 50.",
     "hint": "60 jest pomiędzy progami. Powrót dźwięku nastąpi dopiero poniżej 50."
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Uruchom próbę „Hałas i histereza”. Kod startowy gubi stan. Przenieś gra = True przed pętlę i zmieniaj go tylko po przekroczeniu progów albo STOP. Dioda ma pokazywać wyciszenie.",
   "grouping": "solo",
   "reading": {
    "title": "Wskazówki do etapu",
    "paragraphs": [
     "Sprawdź w tabeli moment 71 → 68 → 60 → 50 → 49. Dopiero ostatni odczyt pozwala ponownie włączyć radio. Użyj if i elif, bez końcowego else zmieniającego stan.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 23,
   "teacherNotes": "W pierwszych trzech minutach tego etapu uruchom z uczniami pierwszy przebieg albo podłącz zasilanie i masę. Potem pracują sami. Daj jedną uwagę do konkretnego warunku i co najmniej siedem minut na poprawę. Chętna para może porównać przebiegi, każdy sam tłumaczy decyzję.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Sprawdź w tabeli moment 71 → 68 → 60 → 50 → 49. Dopiero ostatni odczyt pozwala ponownie włączyć radio. Użyj if i elif, bez końcowego else zmieniającego stan.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "r85-lab",
     "title": "Program i próby",
     "mode": "code",
     "points": 8,
     "project": "radio"
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
     "Nie wykonujemy instalacji sieciowej. Przeniesienie kodu wymaga sprawdzenia zestawu, zasilania i instrukcji przez nauczyciela.",
     "Wyjaśnij na jednym odczycie, dlaczego wybrane działanie jest zgodne z kryterium."
    ]
   },
   "duration": 7,
   "teacherNotes": "Zbierz uzasadnienia, nie tylko litery odpowiedzi. Jeśli uczeń wybierze zły wariant, poproś o odczyt wejść po kolei i daj czas na poprawę w laboratorium.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "Nie wykonujemy instalacji sieciowej. Przeniesienie kodu wymaga sprawdzenia zestawu, zasilania i instrukcji przez nauczyciela.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "r85-transfer",
     "question": "Dlaczego w prawdziwej pracowni nie podłączasz przekaźnika do sieci 230 V w ramach tego ćwiczenia?",
     "options": [
      "Bo Python tego nie lubi",
      "Model ćwiczy logikę; pracujemy tylko z bezpiecznym zestawem pod nadzorem",
      "Bo przekaźnik jest czujnikiem"
     ],
     "correct": [
      1
     ],
     "explanation": "Nie wykonujemy instalacji sieciowej. Przeniesienie kodu wymaga sprawdzenia zestawu, zasilania i instrukcji przez nauczyciela.",
     "hint": "Nie wykonujemy instalacji sieciowej. Przeniesienie kodu wymaga sprawdzenia zestawu, zasilania i instrukcji przez nauczyciela."
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
   "expectedAnswers": "Odróżniam symulację logiczną od instalacji elektrycznej.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Układ po testach",
     "sources": [
      "r85-model",
      "r85-lab",
      "r85-transfer"
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
