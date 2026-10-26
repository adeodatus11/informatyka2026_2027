export default {
 "id": "80",
 "grade": 1,
 "order": 52,
 "title": "Wykonywanie operacji na elementach listy w języku Python",
 "subtitle": "Z rankingu gry wyciągniesz najlepszy wynik i policzysz średnią bez ręcznego przepisywania.",
 "topic": "Operacje na liście i pętla po elementach.",
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
  "Liczę sumę, minimum, maksimum i średnią.",
  "Sortuję listę bez zmiany oryginału.",
  "Filtruję listę pętlą i warunkiem."
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
   "intro": "Z rankingu gry wyciągniesz najlepszy wynik i policzysz średnią bez ręcznego przepisywania.",
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
     "id": "80-recall",
     "question": "Z lekcji 79: jaki indeks ma pierwszy element listy?",
     "options": [
      "1",
      "-1",
      "0"
     ],
     "correct": [
      2
     ],
     "explanation": "Indeksy zaczynają się od 0; -1 oznacza ostatni element.",
     "hint": "Indeksy zaczynają się od 0; -1 oznacza ostatni element."
    }
   ]
  },
  {
   "id": "model",
   "label": "Przewiduj i zmień",
   "title": "Przewiduj i zmień",
   "intro": "Operacje na liście i pętla po elementach.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Przewiduj i zmień",
    "paragraphs": [
     "sum liczy sumę, min najmniejszy, max największy. sorted(lista) daje nową listę rosnąco; sorted(lista, reverse=True) malejąco. Oryginał zostaje.",
     "for wynik in wyniki: bierze po jednym elemencie. Średnia to sum(wyniki)/len(wyniki), ale najpierw sprawdź, czy lista nie jest pusta."
    ]
   },
   "duration": 10,
   "teacherNotes": "W pierwszych trzech minutach tego etapu każdy uruchamia model. Pokaż na głos jedną decyzję, potem uczniowie zmieniają dane. Przy podziale odpowiedzi powtórz tylko trudny krok.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "for wynik in wyniki: bierze po jednym elemencie. Średnia to sum(wyniki)/len(wyniki), ale najpierw sprawdź, czy lista nie jest pusta.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "80-predict",
     "mode": "predict",
     "points": 2,
     "title": "Przewidź wynik",
     "prompt": "Wpisz wynik, a potem uruchom przykład. Zmień jedną wartość i uruchom ponownie.",
     "code": "wyniki = [20, 5, 10]\nprint(sorted(wyniki))\nprint(max(wyniki))\nprint(min(wyniki))\n",
     "predictRows": 4,
     "explain": "Czytaj linie po kolei. Wywołanie funkcji wykonuje jej ciało; return przekazuje wartość, a print pokazuje ją w konsoli."
    },
    {
     "type": "pythonLab",
     "id": "80-change",
     "mode": "code",
     "points": 3,
     "file": "80-change.py",
     "title": "Zrób ranking malejąco",
     "prompt": "Zrób ranking malejąco. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "wyniki = [20, 5, 10]\nranking = sorted(wyniki)\n",
     "solution": "wyniki = [20, 5, 10]\nranking = sorted(wyniki, reverse=True)\n",
     "tests": [
      {
       "call": "ranking",
       "expected": "[20, 10, 5]"
      },
      {
       "call": "wyniki",
       "expected": "[20, 5, 10]"
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
     "for wynik in wyniki: bierze po jednym elemencie. Średnia to sum(wyniki)/len(wyniki), ale najpierw sprawdź, czy lista nie jest pusta.",
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
     "id": "80-par",
     "mode": "parsons",
     "points": 3,
     "title": "Ułóż działający kod",
     "prompt": "Wybierz linie, kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "wyniki = [20, 5, 10]\nsuma = 0\nfor wynik in wyniki:\n    suma = suma + wynik\nprint(suma)\n",
     "tests": [
      {
       "output": "35"
      }
     ],
     "distractors": [
      "    suma = wynik"
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
     "Pusta lista daje dzielenie przez zero. Przyjmujemy regułę zadania: dla pustej listy funkcja zwraca 0.",
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
     "id": "80-fix",
     "mode": "code",
     "points": 3,
     "file": "80-fix.py",
     "title": "Średnia także dla pustej listy",
     "prompt": "Średnia także dla pustej listy. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def srednia(lista):\n    return sum(lista) / len(lista)\n",
     "solution": "def srednia(lista):\n    if len(lista) == 0:\n        return 0\n    return sum(lista) / len(lista)\n",
     "tests": [
      {
       "call": "srednia([])",
       "expected": "0"
      },
      {
       "call": "srednia([3, 4, 5])",
       "expected": "4"
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
     "Funkcja awans bierze listę i próg. Oddaje nową listę wyników co najmniej równych progowi, w kolejności wejścia. Zbuduj pustą listę, przejdź pętlą i użyj append.",
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
     "id": "80-own",
     "mode": "code",
     "points": 3,
     "file": "80-own.py",
     "title": "Wybierz wyniki od progu",
     "prompt": "Wybierz wyniki od progu. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def awans(wyniki, prog):\n    pass\n",
     "solution": "def awans(wyniki, prog):\n    wybrane = []\n    for wynik in wyniki:\n        if wynik >= prog:\n            wybrane.append(wynik)\n    return wybrane\n",
     "tests": [
      {
       "call": "awans([5, 20, 10], 10)",
       "expected": "[20, 10]"
      },
      {
       "call": "awans([], 10)",
       "expected": "[]"
      },
      {
       "call": "awans([9], 10)",
       "expected": "[]"
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
     "Liczę sumę, minimum, maksimum i średnią.",
     "Sortuję listę bez zmiany oryginału."
    ]
   },
   "duration": 4,
   "teacherNotes": "Zbierz zdanie o poprawce. Zapisz najtrudniejsze pytanie do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Sortuję listę bez zmiany oryginału.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Program działa",
     "sources": [
      "80-predict",
      "80-change",
      "80-par",
      "80-fix",
      "80-own"
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
