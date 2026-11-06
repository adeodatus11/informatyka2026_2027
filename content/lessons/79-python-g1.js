export default {
 "id": "79",
 "grade": 1,
 "order": 51,
 "title": "Definiowanie i stosowanie listy w języku Python",
 "subtitle": "Trzy oceny to trzy zmienne? Lista pozwoli zebrać je pod jedną nazwą.",
 "topic": "Lista przechowuje wiele elementów.",
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
   },
   {
    "name": "Ocenianie kształtujące i poprawa",
    "url": "https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html"
   }
  ]
 },
 "objectives": [
  "Tworzę listę i dopisuję element.",
  "Odczytuję indeks, długość i wycinek.",
  "Sprawdzam obecność elementu przez in."
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
   "intro": "Trzy oceny to trzy zmienne? Lista pozwoli zebrać je pod jedną nazwą.",
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
     "id": "79-recall",
     "question": "Z lekcji 78: jak wywołasz funkcję baner bez parametrów?",
     "options": [
      "baner[]",
      "baner()",
      "def baner"
     ],
     "correct": [
      1
     ],
     "explanation": "Nawiasy () wywołują funkcję, nawet bez parametrów.",
     "hint": "Nawiasy () wywołują funkcję, nawet bez parametrów."
    }
   ]
  },
  {
   "id": "model",
   "label": "Przewiduj i zmień",
   "title": "Przewiduj i zmień",
   "intro": "Lista przechowuje wiele elementów.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Przewiduj i zmień",
    "paragraphs": [
     "oceny = [3, 4, 5] tworzy listę. len(oceny) to 3, oceny[0] to 3, oceny[-1] to 5. append(6) dopisuje element.",
     "Ostatni indeks to len(lista) - 1. Dla pustej listy nie ma nawet indeksu 0. Wycinek lista[0:2] bierze dwa pierwsze elementy, bez indeksu 2."
    ]
   },
   "duration": 10,
   "teacherNotes": "W pierwszych trzech minutach tego etapu każdy uruchamia model. Pokaż na głos jedną decyzję, potem uczniowie zmieniają dane. Przy podziale odpowiedzi powtórz tylko trudny krok.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Ostatni indeks to len(lista) - 1. Dla pustej listy nie ma nawet indeksu 0. Wycinek lista[0:2] bierze dwa pierwsze elementy, bez indeksu 2.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "79-predict",
     "mode": "predict",
     "points": 2,
     "title": "Przewidź wynik",
     "prompt": "Wpisz wynik, a potem uruchom przykład. Zmień jedną wartość i uruchom ponownie.",
     "code": "oceny = [3, 4, 5]\noceny.append(6)\nprint(len(oceny))\nprint(oceny[0])\n",
     "predictRows": 4,
     "explain": "Czytaj linie po kolei. Wywołanie funkcji wykonuje jej ciało; return przekazuje wartość, a print pokazuje ją w konsoli."
    },
    {
     "type": "pythonLab",
     "id": "79-change",
     "mode": "code",
     "points": 3,
     "file": "79-change.py",
     "title": "Dopisz chleb do zakupów",
     "prompt": "Dopisz chleb do zakupów. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "zakupy = [\"mleko\"]\n# dopisz chleb\n",
     "solution": "zakupy = [\"mleko\"]\nzakupy.append(\"chleb\")\n",
     "tests": [
      {
       "call": "zakupy",
       "expected": "[\"mleko\", \"chleb\"]"
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
     "Ostatni indeks to len(lista) - 1. Dla pustej listy nie ma nawet indeksu 0. Wycinek lista[0:2] bierze dwa pierwsze elementy, bez indeksu 2.",
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
     "id": "79-par",
     "mode": "parsons",
     "points": 3,
     "title": "Ułóż działający kod",
     "prompt": "Wybierz linie, kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "oceny = [3, 4, 5]\nsrednia = sum(oceny) / len(oceny)\nprint(srednia)\n",
     "tests": [
      {
       "output": "4.0"
      }
     ],
     "distractors": [
      "srednia = sum(oceny) * len(oceny)"
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
     "Długość wynosi 3, ale indeksy to 0, 1, 2. Użyj -1 albo len(lista)-1.",
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
     "id": "79-fix",
     "mode": "code",
     "points": 3,
     "file": "79-fix.py",
     "title": "Napraw indeks poza zakresem",
     "prompt": "Napraw indeks poza zakresem. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "lista = [\"A\", \"B\", \"C\"]\nostatni = lista[len(lista)]\n",
     "solution": "lista = [\"A\", \"B\", \"C\"]\nostatni = lista[-1]\n",
     "tests": [
      {
       "call": "ostatni",
       "expected": "\"C\""
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
     "Operator in sprawdza obecność elementu. Funkcja jest_na_liscie ma zwrócić True albo False. Sprawdź także pustą listę.",
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
     "id": "79-own",
     "mode": "code",
     "points": 3,
     "file": "79-own.py",
     "title": "Sprawdź czy produkt jest na liście",
     "prompt": "Sprawdź czy produkt jest na liście. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def jest_na_liscie(lista, produkt):\n    pass\n",
     "solution": "def jest_na_liscie(lista, produkt):\n    return produkt in lista\n",
     "tests": [
      {
       "call": "jest_na_liscie([\"mleko\", \"chleb\"], \"chleb\")",
       "expected": "True"
      },
      {
       "call": "jest_na_liscie([], \"chleb\")",
       "expected": "False"
      },
      {
       "call": "jest_na_liscie([\"mleko\"], \"sok\")",
       "expected": "False"
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
     "Tworzę listę i dopisuję element.",
     "Odczytuję indeks, długość i wycinek."
    ]
   },
   "duration": 4,
   "teacherNotes": "Zbierz zdanie o poprawce. Zapisz najtrudniejsze pytanie do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Odczytuję indeks, długość i wycinek.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Program działa",
     "sources": [
      "79-predict",
      "79-change",
      "79-par",
      "79-fix",
      "79-own"
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
