export default {
 "id": "98",
 "grade": 1,
 "order": 60,
 "title": "Programowanie zamiany reprezentacji liczb między pozycyjnymi systemami liczbowymi",
 "subtitle": "Sprawdzisz, czy 11111111, 255 i FF oznaczają tę samą wartość — i napiszesz konwerter.",
 "topic": "Podstawa zmienia zapis, nie wartość.",
 "icon": "code",
 "tags": [
  "Python",
  "testy",
  "własny program"
 ],
 "duration": 45,
 "curriculum": "I.1, I.3, II.1, II.2, I.2.a",
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
  "Odczytuję liczbę metodą mnożenia i dodawania.",
  "Tworzę zapis z reszt dzielenia.",
  "Sprawdzam zero, błędną cyfrę i podstawę."
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
   "intro": "Sprawdzisz, czy 11111111, 255 i FF oznaczają tę samą wartość — i napiszesz konwerter.",
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
     "id": "98-recall",
     "question": "Z lekcji 97: ile wynosi FF szesnastkowo?",
     "options": [
      "255",
      "16",
      "100"
     ],
     "correct": [
      0
     ],
     "explanation": "F to 15, więc 15 · 16 + 15 = 255.",
     "hint": "F to 15, więc 15 · 16 + 15 = 255."
    }
   ]
  },
  {
   "id": "model",
   "label": "Przewiduj i zmień",
   "title": "Przewiduj i zmień",
   "intro": "Podstawa zmienia zapis, nie wartość.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Przewiduj i zmień",
    "paragraphs": [
     "int(\"FF\", 16) czyta hex jako liczbę, format(255, \"b\") daje zapis dwójkowy, format(255, \"X\") daje hex. To wzorce kontroli. % daje resztę, // iloraz całkowity.",
     "Własny algorytm: czytając cyfry, licz wynik = wynik * podstawa + cyfra. Przy zapisie dziel liczbę przez podstawę i dopisuj reszty z lewej. Zero wymaga osobnej obsługi."
    ]
   },
   "duration": 10,
   "teacherNotes": "W pierwszych trzech minutach tego etapu każdy uruchamia model. Pokaż na głos jedną decyzję, potem uczniowie zmieniają dane. Przy podziale odpowiedzi powtórz tylko trudny krok.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Własny algorytm: czytając cyfry, licz wynik = wynik * podstawa + cyfra. Przy zapisie dziel liczbę przez podstawę i dopisuj reszty z lewej. Zero wymaga osobnej obsługi.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "98-predict",
     "mode": "predict",
     "points": 2,
     "title": "Przewidź wynik",
     "prompt": "Wpisz wynik, a potem uruchom przykład. Zmień jedną wartość i uruchom ponownie.",
     "code": "print(int(\"FF\", 16))\nprint(format(10, \"b\"))\nprint(format(10, \"X\"))\n",
     "predictRows": 4,
     "explain": "Czytaj linie po kolei. Wywołanie funkcji wykonuje jej ciało; return przekazuje wartość, a print pokazuje ją w konsoli."
    },
    {
     "type": "pythonLab",
     "id": "98-change",
     "mode": "code",
     "points": 3,
     "file": "98-change.py",
     "title": "Odczytaj zapis o podstawie 2, 10 lub 16",
     "prompt": "Odczytaj zapis o podstawie 2, 10 lub 16. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def odczyt(s, p):\n    return 0\n",
     "solution": "def odczyt(s, p):\n    if p not in [2, 10, 16] or s == \"\":\n        return None\n    cyfry = \"0123456789ABCDEF\"\n    wynik = 0\n    for znak in s.upper():\n        cyfra = cyfry.find(znak)\n        if cyfra < 0 or cyfra >= p:\n            return None\n        wynik = wynik * p + cyfra\n    return wynik\n",
     "tests": [
      {
       "call": "odczyt(\"FF\", 16)",
       "expected": "255"
      },
      {
       "call": "odczyt(\"101\", 2)",
       "expected": "5"
      },
      {
       "call": "odczyt(\"25\", 10)",
       "expected": "25"
      },
      {
       "call": "odczyt(\"2\", 2)",
       "expected": "None"
      },
      {
       "call": "odczyt(\"\", 2)",
       "expected": "None"
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
     "Własny algorytm: czytając cyfry, licz wynik = wynik * podstawa + cyfra. Przy zapisie dziel liczbę przez podstawę i dopisuj reszty z lewej. Zero wymaga osobnej obsługi.",
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
     "id": "98-par",
     "mode": "parsons",
     "points": 3,
     "title": "Ułóż działający kod",
     "prompt": "Wybierz linie, kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "n = 13\nwynik = \"\"\nwhile n > 0:\n    wynik = str(n % 2) + wynik\n    n = n // 2\nprint(wynik)\n",
     "tests": [
      {
       "output": "1101"
      }
     ],
     "distractors": [
      "    wynik = wynik + str(n % 2)"
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
     "Dla zera pętla nie wykona się ani razu. Umówiony zakres: całkowite n >= 0. Dodaj osobny wynik \"0\".",
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
     "id": "98-fix",
     "mode": "code",
     "points": 3,
     "file": "98-fix.py",
     "title": "Napraw zero w zapisie dwójkowym",
     "prompt": "Napraw zero w zapisie dwójkowym. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def bity(n):\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n",
     "solution": "def bity(n):\n    if n == 0:\n        return \"0\"\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n",
     "tests": [
      {
       "call": "bity(0)",
       "expected": "\"0\""
      },
      {
       "call": "bity(8)",
       "expected": "\"1000\""
      },
      {
       "call": "bity(13)",
       "expected": "\"1101\""
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
     "Napisz zapis(n, p) dla całkowitego n >= 0 i podstawy 2, 10 lub 16. Dla złego zakresu oddaj None. Cyfrę reszty pobierz z \"0123456789ABCDEF\". Na końcu połącz zapis(odczyt(\"ff\", 16), 2): oczekujesz 11111111.",
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
     "id": "98-own",
     "mode": "code",
     "points": 3,
     "file": "98-own.py",
     "title": "Zapisz liczbę w wybranym systemie",
     "prompt": "Zapisz liczbę w wybranym systemie. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def zapis(n, p):\n    cyfry = \"0123456789ABCDEF\"\n    # sprawdź zakres, potem dziel przez p\n",
     "solution": "def zapis(n, p):\n    if p not in [2, 10, 16] or n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    cyfry = \"0123456789ABCDEF\"\n    wynik = \"\"\n    while n > 0:\n        wynik = cyfry[n % p] + wynik\n        n = n // p\n    return wynik\n",
     "tests": [
      {
       "call": "zapis(255, 16)",
       "expected": "\"FF\""
      },
      {
       "call": "zapis(5, 2)",
       "expected": "\"101\""
      },
      {
       "call": "zapis(25, 10)",
       "expected": "\"25\""
      },
      {
       "call": "zapis(0, 16)",
       "expected": "\"0\""
      },
      {
       "call": "zapis(-1, 2)",
       "expected": "None"
      },
      {
       "call": "zapis(1, 3)",
       "expected": "None"
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
     "Odczytuję liczbę metodą mnożenia i dodawania.",
     "Tworzę zapis z reszt dzielenia."
    ]
   },
   "duration": 4,
   "teacherNotes": "Zbierz zdanie o poprawce. Zapisz najtrudniejsze pytanie do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Tworzę zapis z reszt dzielenia.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Program działa",
     "sources": [
      "98-predict",
      "98-change",
      "98-par",
      "98-fix",
      "98-own"
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
