export default {
 "id": "78",
 "grade": 1,
 "order": 50,
 "title": "Funkcje niezwracające wartości w języku Python",
 "subtitle": "Powitanie na ekranie gry nie musi zwracać liczby. Zbudujesz funkcję, która wykonuje czynność.",
 "topic": "Funkcja może wykonywać czynność.",
 "icon": "code",
 "tags": [
  "Python",
  "testy",
  "własny program"
 ],
 "duration": 45,
 "curriculum": "I.1, I.3, II.1, II.2",
 "format": {
  "name": "Przewiduj → zmień → ułóż → napraw → napisz",
  "student": "Pracujesz sam. Najpierw uruchamiasz przykład, potem stopniowo tworzysz własny program.",
  "teacher": "Modeluj jedną decyzję, zdejmuj podpowiedzi. Po pytaniu diagnostycznym: większość poprawnych — dalej; podział — poproś o uzasadnienia; większość błędnych — pokaż inny przykład. Zostaw czas na poprawę po teście.",
  "grouping": "Samodzielnie przy komputerze. Możesz poprosić sąsiada o wyjaśnienie błędu, bez przejmowania klawiatury.",
  "methods": [
   {
    "name": "Przypominanie i powroty",
    "url": "https://metodyka.covepolska.pl/metoda-przypominanie-i-powroty.html"
   },
   {
    "name": "Modelowanie",
    "url": "https://metodyka.covepolska.pl/metoda-modelowanie.html"
   }
  ]
 },
 "objectives": [
  "Definiuję funkcję bez parametrów.",
  "Wywołuję funkcję wykonującą czynność.",
  "Wyjaśniam skąd bierze się None."
 ],
 "materials": [
  "Komputer z przeglądarką; bez konta i instalacji Pythona."
 ],
 "teacherGuide": {
  "preparation": "Przed dzwonkiem uruchom etap z Pythonem. Dane liczbowe to fikcyjne reguły zadania, nie aktualny cennik.",
  "summary": "Uczeń przewiduje, zmienia przykład, układa kod, naprawia błąd i przechodzi testy własnego programu."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Start",
   "intro": "Powitanie na ekranie gry nie musi zwracać liczby. Zbudujesz funkcję, która wykonuje czynność.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Start",
    "paragraphs": [
     "Najpierw odpowiedz bez notatek. Potem sprawdź wyjaśnienie.",
     "To ćwiczenie przypominania, bez stopnia. Wrócisz do tej umiejętności w swoim programie."
    ]
   },
   "duration": 2,
   "teacherNotes": "Zbierz odpowiedzi wszystkich. Wróć do najczęstszego błędu na jednym przykładzie; nie oceniaj stopniem powtórki.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "To ćwiczenie przypominania, bez stopnia. Wrócisz do tej umiejętności w swoim programie.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "choice",
     "id": "78-recall",
     "question": "Z poprzedniej lekcji: co robi return 5?",
     "options": [
      "Wyświetla 5",
      "Powtarza 5 razy",
      "Oddaje 5 wywołującemu"
     ],
     "correct": [
      2
     ],
     "explanation": "return oddaje wynik; print go wyświetla.",
     "hint": "return oddaje wynik; print go wyświetla."
    }
   ]
  },
  {
   "id": "model",
   "label": "Przewiduj i zmień",
   "title": "Przewiduj i zmień",
   "intro": "Funkcja może wykonywać czynność.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Przewiduj i zmień",
    "paragraphs": [
     "def baner(): definiuje funkcję bez parametrów. W środku wpisz print(\"Start gry\"). Wywołaj baner() bez print wokół.",
     "Funkcja bez jawnego return zwraca None. To normalne przy czynności, np. pokazaniu komunikatu."
    ]
   },
   "duration": 10,
   "teacherNotes": "W pierwszych trzech minutach tego etapu każdy uruchamia model. Pokaż na głos jedną decyzję, potem uczniowie zmieniają dane. Przy podziale odpowiedzi powtórz tylko trudny krok.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Funkcja bez jawnego return zwraca None. To normalne przy czynności, np. pokazaniu komunikatu.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "78-predict",
     "mode": "predict",
     "points": 2,
     "title": "Przewidź wynik",
     "prompt": "Wpisz wynik, a potem uruchom przykład. Zmień jedną wartość i uruchom ponownie.",
     "code": "def baner():\n    print(\"Start gry\")\nbaner()\n",
     "predictRows": 4,
     "explain": "Czytaj linie po kolei. Wywołanie funkcji wykonuje jej ciało; return przekazuje wartość, a print pokazuje ją w konsoli."
    },
    {
     "type": "pythonLab",
     "id": "78-change",
     "mode": "code",
     "points": 3,
     "file": "78-change.py",
     "title": "Zmień komunikat na Gotowe",
     "prompt": "Zmień komunikat na Gotowe. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def baner():\n    print(\"Start gry\")\n",
     "solution": "def baner():\n    print(\"Gotowe\")\nbaner()\n",
     "tests": [
      {
       "output": "Gotowe"
      }
     ],
     "hints": [
      "Przeczytaj przykład nad edytorem i porównaj wcięcia.",
      "Sprawdź przypadek zerowy i wynik zwracany przez funkcję."
     ]
    }
   ]
  },
  {
   "id": "arrange",
   "label": "Ułóż program",
   "title": "Ułóż program",
   "intro": "Złóż działający program z linii. Przy każdej linii sprawdź wcięcie.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Ułóż program",
    "paragraphs": [
     "Funkcja bez jawnego return zwraca None. To normalne przy czynności, np. pokazaniu komunikatu.",
     "Najpierw wybierz linie, potem ustal ich kolejność i wcięcia. Linie pułapki zostaw poza programem."
    ]
   },
   "duration": 8,
   "teacherNotes": "Zasłoń pełny model. Sprawdź, kto potrafi wyjaśnić kolejność. Jeśli większość myli tę samą linię, pokaż ją jeszcze raz na innych danych.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Najpierw wybierz linie, potem ustal ich kolejność i wcięcia. Linie pułapki zostaw poza programem.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "78-par",
     "mode": "parsons",
     "points": 3,
     "title": "Ułóż działający kod",
     "prompt": "Wybierz linie, kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "def pokaz(nick):\n    print(\"Cześć\", nick)\npokaz(\"Ola\")\n",
     "tests": [
      {
       "output": "Cześć Ola"
      }
     ],
     "distractors": [
      "pokaz"
     ]
    }
   ]
  },
  {
   "id": "repair",
   "label": "Napraw błąd",
   "title": "Napraw błąd",
   "intro": "Program wygląda rozsądnie, ale testy wykryją błąd. Znajdź go i popraw.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Napraw błąd",
    "paragraphs": [
     "print(start()) najpierw wykona start, a potem wypisze jej wynik None. Wywołaj samą funkcję.",
     "Po zmianie sprawdź wszystkie przypadki. Nie wystarczy, że jeden wynik jest dobry."
    ]
   },
   "duration": 10,
   "teacherNotes": "Daj jedną wskazówkę do konkretnego kryterium i co najmniej siedem minut na poprawę. Poproś ucznia o wyjaśnienie, dlaczego zmiana naprawia także inne dane.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Po zmianie sprawdź wszystkie przypadki. Nie wystarczy, że jeden wynik jest dobry.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "78-fix",
     "mode": "code",
     "points": 3,
     "file": "78-fix.py",
     "title": "Usuń niepotrzebne None",
     "prompt": "Usuń niepotrzebne None. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def start():\n    print(\"Gra\")\nprint(start())\n",
     "solution": "def start():\n    print(\"Gra\")\nstart()\n",
     "tests": [
      {
       "output": "Gra"
      }
     ],
     "hints": [
      "Przeczytaj przykład nad edytorem i porównaj wcięcia.",
      "Sprawdź przypadek zerowy i wynik zwracany przez funkcję."
     ]
    }
   ]
  },
  {
   "id": "project",
   "label": "Napisz sam",
   "title": "Napisz sam",
   "intro": "Teraz nowy przypadek. Napisz program, który możesz pokazać na koniec lekcji.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Napisz sam",
    "paragraphs": [
     "Napisz komunikat(nick, punkty), który wypisuje np. Ola: 7 pkt. Funkcja wykonuje czynność i nie ma jawnego return.",
     "Dane i ceny w tej lekcji są fikcyjne. Testy sprawdzają umówione reguły zadania."
    ]
   },
   "duration": 11,
   "teacherNotes": "Uczeń pracuje bez pełnego wzoru. Pomagaj pytaniem o wejście, wynik i przypadek brzegowy. Szybsi zmieniają dane, pozostali kończą obowiązkowy program.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Dane i ceny w tej lekcji są fikcyjne. Testy sprawdzają umówione reguły zadania.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "78-own",
     "mode": "code",
     "points": 3,
     "file": "78-own.py",
     "title": "Komunikat dla gracza",
     "prompt": "Komunikat dla gracza. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def komunikat(nick, punkty):\n    pass\n",
     "solution": "def komunikat(nick, punkty):\n    print(f\"{nick}: {punkty} pkt\")\n",
     "tests": [
      {
       "call": "(komunikat(\"Ola\", 7), __import__('sys').stdout.getvalue())",
       "expected": "(None, \"Ola: 7 pkt\\n\")"
      },
      {
       "call": "(komunikat(\"Jan\", 0), __import__('sys').stdout.getvalue())",
       "expected": "(None, \"Jan: 0 pkt\\n\")"
      }
     ],
     "hints": [
      "Przeczytaj przykład nad edytorem i porównaj wcięcia.",
      "Sprawdź przypadek zerowy i wynik zwracany przez funkcję."
     ]
    }
   ]
  },
  {
   "id": "result",
   "label": "Twój wynik",
   "title": "Twój wynik",
   "intro": "Pokaż działający program i nazwij jedną poprawkę.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Twój wynik",
    "paragraphs": [
     "Definiuję funkcję bez parametrów.",
     "Wywołuję funkcję wykonującą czynność."
    ]
   },
   "duration": 4,
   "teacherNotes": "Zbierz zdanie o poprawce. Zapisz najtrudniejsze pytanie do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Wywołuję funkcję wykonującą czynność.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Program działa",
     "sources": [
      "78-predict",
      "78-change",
      "78-par",
      "78-fix",
      "78-own"
     ],
     "badges": [
      {
       "min": 0,
       "name": "Pierwszy krok",
       "text": "Wróć do jednej wskazówki i popraw program."
      },
      {
       "min": 0.5,
       "name": "Kod nabiera sensu",
       "text": "Masz działające części rozwiązania."
      },
      {
       "min": 0.85,
       "name": "Działa także na brzegu",
       "text": "Potrafisz sprawdzić nietypowe dane."
      }
     ]
    }
   ]
  }
 ],
 "exitTicket": "Która próba ujawniła błąd i co zmieniłeś? Pokaż wynik testów."
};
