export default {
 "id": "77",
 "grade": 1,
 "order": 49,
 "title": "Funkcje zwracające wartość w języku Python",
 "subtitle": "Rabat policzony raz może działać dla całego koszyka. Dziś zamkniesz obliczenie w funkcji.",
 "topic": "Funkcja bierze dane i oddaje wynik.",
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
  "Definiuję funkcję z parametrem i return.",
  "Odróżniam wyświetlenie wyniku od zwrócenia wartości.",
  "Testuję funkcję dla różnych danych."
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
   "intro": "Rabat policzony raz może działać dla całego koszyka. Dziś zamkniesz obliczenie w funkcji.",
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
     "id": "77-recall",
     "question": "Z lekcji 68: co kończy pętlę while?",
     "options": [
      "Samo słowo while",
      "Fałszywy warunek lub break",
      "Każdy print"
     ],
     "correct": [
      1
     ],
     "explanation": "Warunek jest sprawdzany przed obrotem; break kończy pętlę wcześniej.",
     "hint": "Warunek jest sprawdzany przed obrotem; break kończy pętlę wcześniej."
    }
   ]
  },
  {
   "id": "model",
   "label": "Przewiduj i zmień",
   "title": "Przewiduj i zmień",
   "intro": "Funkcja bierze dane i oddaje wynik.",
   "grouping": "solo",
   "reading": {
    "title": "Jak to działa: Przewiduj i zmień",
    "paragraphs": [
     "def po_rabacie(cena): rozpoczyna definicję. cena jest parametrem, czyli nazwą danych używanych wewnątrz. Wcięte return cena * 0.9 oddaje wynik. Dopiero po_rabacie(100) wywołuje funkcję.",
     "print pokazuje wynik człowiekowi. return oddaje wartość dalszym obliczeniom. Za return funkcja się kończy."
    ]
   },
   "duration": 10,
   "teacherNotes": "W pierwszych trzech minutach tego etapu każdy uruchamia model. Pokaż na głos jedną decyzję, potem uczniowie zmieniają dane. Przy podziale odpowiedzi powtórz tylko trudny krok.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "print pokazuje wynik człowiekowi. return oddaje wartość dalszym obliczeniom. Za return funkcja się kończy.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "pythonLab",
     "id": "77-predict",
     "mode": "predict",
     "points": 2,
     "title": "Przewidź wynik",
     "prompt": "Wpisz wynik, a potem uruchom przykład. Zmień jedną wartość i uruchom ponownie.",
     "code": "def po_rabacie(cena):\n    return cena * 0.9\nprint(po_rabacie(100))\n",
     "predictRows": 4,
     "explain": "Czytaj linie po kolei. Wywołanie funkcji wykonuje jej ciało; return przekazuje wartość, a print pokazuje ją w konsoli."
    },
    {
     "type": "pythonLab",
     "id": "77-change",
     "mode": "code",
     "points": 3,
     "file": "77-change.py",
     "title": "Zmień rabat na 20%",
     "prompt": "Zmień rabat na 20%. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def po_rabacie(cena):\n    return cena * 0.9\n",
     "solution": "def po_rabacie(cena):\n    return cena * 0.8\n",
     "tests": [
      {
       "call": "po_rabacie(100)",
       "expected": "80"
      },
      {
       "call": "po_rabacie(0)",
       "expected": "0"
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
     "print pokazuje wynik człowiekowi. return oddaje wartość dalszym obliczeniom. Za return funkcja się kończy.",
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
     "id": "77-par",
     "mode": "parsons",
     "points": 3,
     "title": "Ułóż działający kod",
     "prompt": "Wybierz linie, kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "def rata(cena, miesiace):\n    return cena / miesiace\n",
     "tests": [
      {
       "call": "rata(600, 3)",
       "expected": "200"
      },
      {
       "call": "rata(0, 2)",
       "expected": "0"
      }
     ],
     "distractors": [
      "    return cena * miesiace"
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
     "Brak return oznacza wynik None. Wtedy nie dodasz cen dwóch biletów. Zamień wypisywanie na zwracanie.",
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
     "id": "77-fix",
     "mode": "code",
     "points": 3,
     "file": "77-fix.py",
     "title": "Napraw None zamiast ceny",
     "prompt": "Napraw None zamiast ceny. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def cena_biletu(wiek):\n    if wiek < 18:\n        print(12)\n    else:\n        print(20)\n",
     "solution": "def cena_biletu(wiek):\n    if wiek < 18:\n        return 12\n    else:\n        return 20\n",
     "tests": [
      {
       "call": "cena_biletu(15)",
       "expected": "12"
      },
      {
       "call": "cena_biletu(18)",
       "expected": "20"
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
     "Funkcja koszt_grupy(osoby, cena) ma oddawać łączną cenę. Przykład: 4 osoby po 12 zł → 48. Nie wypisuj wyniku wewnątrz funkcji.",
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
     "id": "77-own",
     "mode": "code",
     "points": 3,
     "file": "77-own.py",
     "title": "Policz koszt biletów dla grupy",
     "prompt": "Policz koszt biletów dla grupy. Uzupełnij kod. Uruchom go, a potem sprawdź wszystkie przypadki.",
     "starter": "def koszt_grupy(osoby, cena):\n    pass\n",
     "solution": "def koszt_grupy(osoby, cena):\n    return osoby * cena\n",
     "tests": [
      {
       "call": "koszt_grupy(4, 12)",
       "expected": "48"
      },
      {
       "call": "koszt_grupy(0, 12)",
       "expected": "0"
      },
      {
       "call": "koszt_grupy(3, 20)",
       "expected": "60"
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
     "Definiuję funkcję z parametrem i return.",
     "Odróżniam wyświetlenie wyniku od zwrócenia wartości."
    ]
   },
   "duration": 4,
   "teacherNotes": "Zbierz zdanie o poprawce. Zapisz najtrudniejsze pytanie do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Uzasadnij na danych z zadania.",
   "expectedAnswers": "Odróżniam wyświetlenie wyniku od zwrócenia wartości.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne przejście dla zera lub pustych danych.",
   "optionalExtension": "Zmień dane przykładu i przewidź wynik przed uruchomieniem.",
   "skipIfShortOnTime": false,
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Program działa",
     "sources": [
      "77-predict",
      "77-change",
      "77-par",
      "77-fix",
      "77-own"
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
