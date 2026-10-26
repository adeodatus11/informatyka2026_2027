// Ten sam robotLab i Rover-2 co w zadaniu B; osobny zwięzły projekt klasy 3.
export default {
 "id": "107",
 "grade": 3,
 "order": 30,
 "title": "Budowanie robota i inne zadania projektowe",
 "subtitle": "Połącz Rover-2 i popraw program, aby STOP zawsze zatrzymywał oba silniki.",
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
  "Dobieram piny zasilania, masy i sygnałów.",
  "Przenoszę konfigurację tego samego modelu do programu.",
  "Sprawdzam pierwszeństwo STOP i granicę20 cm."
 ],
 "materials": [
  "Komputer z przeglądarką; Python i mikrokontroler działają lokalnie, bez konta.",
  "Projektor do krótkiego pokazu decyzji i odczytów."
 ],
 "teacherGuide": {
  "preparation": "Przed dzwonkiem otwórz laboratorium, by załadować Python. Scenariusze i progi są fikcyjne. Metody COVE sprawdzono 25.10.2026. Jeśli szkoła ma zestawy micro:bit lub Arduino z Laboratoriów Przyszłości: DO WERYFIKACJI ze sprzętem w pracowni. Nauczyciel sprawdza zgodność API, zakres napięć, sterownik silników i instrukcję producenta. Uczniowie nie pracują z instalacją 230 V. Symulator nie potwierdza bezpieczeństwa prawdziwego układu.",
  "summary": "Jedna lekcja klasy 3 łączy montaż i programowanie. Kod startowy ma działającą obsługę trasy, uczeń sam dodaje priorytet STOP. Karta: montaż8 pkt, program8 pkt, transfer1 pkt; razem17 pkt. Zapis JSON lokalnie, bez wysyłania. Przed dzwonkiem otwórz laboratorium, by załadować Python. Scenariusze i progi są fikcyjne. Metody COVE sprawdzono 25.10.2026. Jeśli szkoła ma zestawy micro:bit lub Arduino z Laboratoriów Przyszłości: DO WERYFIKACJI ze sprzętem w pracowni. Nauczyciel sprawdza zgodność API, zakres napięć, sterownik silników i instrukcję producenta. Uczniowie nie pracują z instalacją 230 V. Symulator nie potwierdza bezpieczeństwa prawdziwego układu."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Po co ten układ?",
   "intro": "Robot ma jechać, ominąć przeszkodę i zatrzymać się po STOP. Najpierw złożysz wirtualny układ, potem poprawisz jego program.",
   "grouping": "solo",
   "reading": {
    "title": "Wyjaśnienie: Po co ten układ?",
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
     "id": "g3-107-recall",
     "question": "Z lekcji 106: dlaczego pompa ma dwa różne progi?",
     "options": [
      "Żeby zmieniała stan co próbkę",
      "Żeby ograniczyć przełączanie blisko jednej wartości",
      "Żeby pominąć brak wody"
     ],
     "correct": [
      1
     ],
     "explanation": "Histereza zachowuje stan między progami. W robocie też trzeba ustalić kolejność decyzji i sprawdzić granice.",
     "hint": "Wróć do sytuacji z pytania i wybierz najprostsze uzasadnienie."
    }
   ]
  },
  {
   "id": "model",
   "label": "Model",
   "title": "Zmontuj Rover-2",
   "intro": "Wybierz piny zgodne ze schematem. Sprawdź połączenia i zapisz konfigurację JSON lokalnie. Będzie potrzebna w następnym etapie.",
   "grouping": "solo",
   "reading": {
    "title": "Wyjaśnienie: Sygnał to nie zasilanie",
    "paragraphs": [
     "Przycisk STOP:D2, czujnik odległości:A0, linii:A1. D5/D6 wysyłają sygnały do sterownika silników. Zasilanie3V3 i wspólna masa GND to osobne przewody. Dokładną tabelę połączeń widzisz w symulatorze.",
     "Silnika nie zasilamy z pinu sygnałowego. To schemat logiczny ćwiczenia; prawdziwy zestaw wymaga sprawdzenia instrukcji, napięć i sterownika przez nauczyciela."
    ]
   },
   "duration": 13,
   "teacherNotes": "Modeluj jedną parę: pin sygnału i zasilanie to różne połączenia. Uczeń podłącza resztę, sprawdza i zapisuje JSON. Osoba bez pary robi identyczny układ samodzielnie.",
   "askStudents": "Co zmienisz i na jakim odczycie to sprawdzisz?",
   "expectedAnswers": "STOP kończy ruch niezależnie od pozostałych czujników.",
   "commonMistakes": "Pomylenie odczytu czujnika z poleceniem dla elementu wykonawczego. Poproś o wskazanie wejścia i wyjścia.",
   "optionalExtension": "Zmień jeden próg i przewidź, który przypadek będzie wymagał nowego wyniku.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "robotLab",
     "id": "g3-107-wire",
     "mode": "wire",
     "points": 8,
     "title": "Rover-2: montaż układu"
    }
   ]
  },
  {
   "id": "lab",
   "label": "Laboratorium",
   "title": "Zbuduj i przetestuj",
   "intro": "Wczytaj swój JSON albo odtwórz ten sam Rover-2. W kodzie popraw kolejność: STOP, przeszkoda, zgubiona linia, jazda. Uruchom próbę, potem sprawdź komplet scenariuszy.",
   "grouping": "solo",
   "reading": {
    "title": "Wyjaśnienie: Zbuduj i przetestuj",
    "paragraphs": [
     "Użyj jednej drabinki if/elif/else. Dwie osobne instrukcje if mogą nadpisać polecenie STOP. Najpierw oblicz lewy i prawy, potem ustaw wyjścia i odczekaj 1000 ms.",
     "Najpierw wypróbuj jedną zmianę, potem sprawdź całość. Nie zgaduj: wróć do wiersza tabeli, który pokazuje problem."
    ]
   },
   "duration": 17,
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
     "requiresWiring": true,
     "starter": "for _ in range(liczba_prob()):\n    # TODO: STOP ma pierwszeństwo przed skrętem i jazdą\n    if read(\"odleglosc\") <= 20:\n        lewy, prawy = 0, 30\n    elif not read(\"linia\"):\n        lewy, prawy = 20, 0\n    else:\n        lewy, prawy = 30, 30\n    write(\"lewy\", lewy)\n    write(\"prawy\", prawy)\n    write(\"dioda\", bool(read(\"stop\")))\n    sleep_ms(1000)\n"
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
    "title": "Wyjaśnienie: Sprawdź poza przykładem",
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
    "title": "Wyjaśnienie: Pokaż działający układ",
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
      "r105-lab",
      "r105-transfer",
      "g3-107-wire"
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
 "exitTicket": "Pokaż własne połączenia i test STOP razem z przeszkodą. Dlaczego jedna drabinka if/elif/else jest tu potrzebna?"
};
