export default {
 "id": "87",
 "grade": 3,
 "order": 24,
 "title": "Programowanie zamiany liczby dziesiętnej na dwójkową",
 "subtitle": "Zapiszesz liczbę bitami i sprawdzisz, czy mieści się w jednym bajcie.",
 "topic": "Zamieniam liczbę dziesiętną na dwójkową przez dzielenie z resztą. Obsługuję zero i odwróconą kolejność reszt. Sprawdzam zakres bajtu i porównuję wynik z format.",
 "icon": "code",
 "tags": [
  "Python",
  "testy",
  "własny algorytm"
 ],
 "duration": 45,
 "curriculum": "I.1, I.2.a, I.3, II.1, II.2 — algorytm, implementacja i testy.",
 "format": {
  "name": "Od przykładu do własnego konwertera",
  "student": "Pracujesz sam: przewidujesz, uruchamiasz, zmieniasz i naprawiasz kod. Na końcu masz własny konwerter.",
  "teacher": "Najpierw przypomnienie bez notatek i korekta. Modelujesz jedną decyzję na głos, potem zdejmujesz podpowiedzi. Jeśli większość odpowiedzi jest poprawna — zadanie samodzielne; przy podziale zbierz uzasadnienia; przy przewadze błędów pokaż inny przykład. Po teście daj jedną wskazówkę i czas na poprawę.",
  "grouping": "Samodzielnie przy komputerze; pytanie do sąsiada jest opcją, bez przejmowania klawiatury.",
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
  "Zamieniam liczbę dziesiętną na dwójkową przez dzielenie z resztą.",
  "Obsługuję zero i odwróconą kolejność reszt.",
  "Sprawdzam zakres bajtu i porównuję wynik z format."
 ],
 "materials": [
  "Przeglądarka z pythonLab; bez konta i instalacji Pythona.",
  "Kartka do zapisania reszt i prób kontrolnych."
 ],
 "teacherGuide": {
  "preparation": "Otwórz etap z Pythonem przed dzwonkiem. Dane są przykładami szkolnymi. Umówiony zakres: liczby całkowite bez znaku; błędne dane odrzucamy jako None.",
  "summary": "Uczeń tworzy algorytm, porównuje z biblioteką i sprawdza dane brzegowe. Wynik odnosi się do zadań wymienionych na karcie."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Odwrotnie niż na poprzedniej lekcji",
   "intro": "Masz wynik 13. Jak zapisać go zerami i jedynkami? Najpierw dwa pytania z lekcji 57, bez notatek.",
   "reading": {
    "title": "Wyjaśnienie: Odwrotnie niż na poprzedniej lekcji",
    "paragraphs": [
     "W poprzednim konwerterze czytaliśmy bity od lewej. Teraz zaczniemy od całej liczby.",
     "To ta sama wartość, zmienia się tylko jej zapis."
    ]
   },
   "activities": [
    {
     "type": "choice",
     "id": "g3-87-r1",
     "question": "Z lekcji 57: Horner dla 101 to:",
     "options": [
      "5",
      "101",
      "4"
     ],
     "correct": [
      0
     ],
     "explanation": "0→1→2→5, za każdym razem wynik * 2 + cyfra.",
     "hint": "0→1→2→5, za każdym razem wynik * 2 + cyfra."
    },
    {
     "type": "choice",
     "id": "g3-87-r2",
     "question": "Jak poprzednio odrzucaliśmy zapis 102 jako dwójkowy?",
     "options": [
      "Usuwaliśmy cyfrę 2",
      "Sprawdzaliśmy każdą cyfrę przed zamianą",
      "Zaokrąglaliśmy wynik"
     ],
     "correct": [
      1
     ],
     "explanation": "Nie wolno po cichu poprawiać danych. Cyfra 2 nie należy do systemu dwójkowego.",
     "hint": "Nie wolno po cichu poprawiać danych. Cyfra 2 nie należy do systemu dwójkowego."
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Nie oceniaj powtórki stopniem. Po odpowiedzi uczeń czyta wyjaśnienie i poprawia. Najczęstsze pytanie wróci w konwerterze.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "To ta sama wartość, zmienia się tylko jej zapis.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "model",
   "label": "Reszty",
   "title": "13 dzielone przez 2",
   "intro": "Najpierw przewidź reszty. Potem uruchom i zmień 13 na 10.",
   "reading": {
    "title": "Wyjaśnienie: 13 dzielone przez 2",
    "paragraphs": [
     "13 // 2 = 6, reszta 1. Potem 6→3 reszta 0, 3→1 reszta 1, 1→0 reszta 1. Czytasz reszty od końca: 1101.",
     "W Pythonie // oznacza iloraz całkowity, a % resztę. / daje ułamek i nie nadaje się do tego kroku."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-87-predict",
     "mode": "predict",
     "points": 2,
     "file": "g3-87-predict.py",
     "title": "Przewidź przed uruchomieniem",
     "prompt": "Przeczytaj kod i wpisz wynik linia po linii. Potem uruchom i porównaj.",
     "code": "n = 13\nwhile n > 0:\n    print(n % 2)\n    n = n // 2\n",
     "predictRows": 4,
     "explain": "Reszty 1, 0, 1, 1 powstają od najmłodszego bitu. Zapis liczby czytasz od dołu."
    },
    {
     "type": "pythonLab",
     "id": "g3-87-change",
     "mode": "code",
     "points": 4,
     "file": "g3-87-change.py",
     "title": "Zmień liczbę na 10",
     "prompt": "Zmień tylko wartość n. Po uruchomieniu reszty mają być 0, 1, 0, 1 — zapis 1010 czytasz od końca.",
     "starter": "n = 13\nwhile n > 0:\n    print(n % 2)\n    n = n // 2\n",
     "solution": "n = 10\nwhile n > 0:\n    print(n % 2)\n    n = n // 2\n",
     "tests": [
      {
       "output": "0\n1\n0\n1"
      }
     ],
     "hints": [
      "Zamień 13 na 10, zachowaj dzielenie całkowite."
     ],
     "summary": "Zmień liczbę na 10: {passed}/{total} testów"
    }
   ],
   "duration": 8,
   "grouping": "solo",
   "teacherNotes": "Pierwsze uruchomienie w trzy minuty etapu. Pokaż głośno myślenie: skąd reszta i dlaczego odwracamy kolejność. Potem każdy zmienia dane sam.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "W Pythonie // oznacza iloraz całkowity, a % resztę. / daje ułamek i nie nadaje się do tego kroku.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "parsons",
   "label": "Układanka",
   "title": "Reszta trafia z lewej",
   "intro": "Ułóż funkcję zwracającą napis. Pętla ma skończyć się przy n = 0.",
   "reading": {
    "title": "Wyjaśnienie: Reszta trafia z lewej",
    "paragraphs": [
     "wynik = str(n % 2) + wynik dopisuje nową resztę z lewej. Odwraca w ten sposób kolejność powstawania reszt.",
     "Zero obsłuż osobno, bo pętla dla n = 0 nie ruszy. Ujemne n są poza zakresem zadania."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-87-parsons",
     "mode": "parsons",
     "points": 3,
     "file": "g3-87-parsons.py",
     "title": "na_dwojkowy(n)",
     "prompt": "Wybierz linie, ustaw kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "def na_dwojkowy(n):\n    if n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n",
     "tests": [
      {
       "call": "na_dwojkowy(0)",
       "expected": "'0'",
       "label": "Zero — pętla nie wykona się"
      },
      {
       "call": "na_dwojkowy(1)",
       "expected": "'1'"
      },
      {
       "call": "na_dwojkowy(2)",
       "expected": "'10'"
      },
      {
       "call": "na_dwojkowy(13)",
       "expected": "'1101'"
      },
      {
       "call": "na_dwojkowy(255)",
       "expected": "'11111111'"
      },
      {
       "call": "na_dwojkowy(256)",
       "expected": "'100000000'"
      },
      {
       "call": "na_dwojkowy(-1)",
       "expected": "None",
       "label": "Poza zakresem"
      }
     ],
     "distractors": [
      "        wynik = wynik + str(n % 2)"
     ],
     "hints": [
      "Funkcję zaczyna def. Wewnątrz while muszą zmieniać się liczba i wynik."
     ]
    }
   ],
   "duration": 8,
   "grouping": "solo",
   "teacherNotes": "Zakryj przykład. Po złej kolejności reszt porównaj n=13 i n=10; wynik dla palindromicznych bitów mógłby ukryć błąd.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Zero obsłuż osobno, bo pętla dla n = 0 nie ruszy. Ujemne n są poza zakresem zadania.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "fix",
   "label": "Napraw",
   "title": "Zero nie jest pustym napisem",
   "intro": "Napraw konwerter, który działa dla 13, lecz dla zera oddaje pusty napis.",
   "reading": {
    "title": "Wyjaśnienie: Zero nie jest pustym napisem",
    "paragraphs": [
     "Pętla while n > 0 nie wykona się dla zera. Pusty napis nie jest poprawnym zapisem zera.",
     "Dodaj warunek dla n == 0 przed pętlą. Potem uruchom także test 256 i odrzucenie liczby ujemnej."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-87-fix",
     "mode": "code",
     "points": 4,
     "file": "g3-87-fix.py",
     "title": "Nie zgub zera",
     "prompt": "Dodaj brakujący przypadek zerowy. Nie zastępuj algorytmu funkcją bin.",
     "starter": "def na_dwojkowy(n):\n    if n < 0:\n        return None\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n",
     "solution": "def na_dwojkowy(n):\n    if n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n",
     "tests": [
      {
       "call": "na_dwojkowy(0)",
       "expected": "'0'",
       "label": "Zero — pętla nie wykona się"
      },
      {
       "call": "na_dwojkowy(1)",
       "expected": "'1'"
      },
      {
       "call": "na_dwojkowy(2)",
       "expected": "'10'"
      },
      {
       "call": "na_dwojkowy(13)",
       "expected": "'1101'"
      },
      {
       "call": "na_dwojkowy(255)",
       "expected": "'11111111'"
      },
      {
       "call": "na_dwojkowy(256)",
       "expected": "'100000000'"
      },
      {
       "call": "na_dwojkowy(-1)",
       "expected": "None",
       "label": "Poza zakresem"
      }
     ],
     "hints": [
      "Sprawdź, co zostaje w zmiennej wynik, gdy while nie wykona żadnego obrotu.",
      "Przed wynik = \"\" dodaj if n == 0: return \"0\"."
     ],
     "summary": "Nie zgub zera: {passed}/{total} testów"
    }
   ],
   "duration": 10,
   "grouping": "solo",
   "teacherNotes": "Zbierz wynik testu zerowego. Daj jedną wskazówkę do przypadku brzegowego oraz siedem minut na poprawę i sprawdzenie wszystkich testów.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Dodaj warunek dla n == 0 przed pętlą. Potem uruchom także test 256 i odrzucenie liczby ujemnej.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "project",
   "label": "Twój bajt",
   "title": "Czy wynik mieści się w ośmiu bitach?",
   "intro": "Napisz funkcję bajt(n). Przykład: 5 → 00000101, 256 → None.",
   "reading": {
    "title": "Wyjaśnienie: Czy wynik mieści się w ośmiu bitach?",
    "paragraphs": [
     "Jeden bajt mieści wartości 0–255. zfill(8) dopisuje zera z lewej, ale nie skraca za długiego napisu.",
     "Najpierw sprawdź zakres. Dopiero potem użyj na_dwojkowy(n).zfill(8). Porównaj z format(n, \"08b\")."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-87-byte",
     "mode": "code",
     "points": 4,
     "file": "g3-87-byte.py",
     "title": "bajt(n)",
     "prompt": "Gotowa na_dwojkowy jest wyżej. Dopisz funkcję bajt: zakres 0–255, napis z ośmioma bitami, poza zakresem None.",
     "starter": "def na_dwojkowy(n):\n    if n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n\ndef bajt(n):\n    pass\n",
     "solution": "def na_dwojkowy(n):\n    if n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    wynik = \"\"\n    while n > 0:\n        wynik = str(n % 2) + wynik\n        n = n // 2\n    return wynik\n\ndef bajt(n):\n    if n < 0 or n > 255:\n        return None\n    return na_dwojkowy(n).zfill(8)\n",
     "tests": [
      {
       "call": "bajt(0)",
       "expected": "'00000000'"
      },
      {
       "call": "bajt(5)",
       "expected": "'00000101'"
      },
      {
       "call": "bajt(255)",
       "expected": "'11111111'"
      },
      {
       "call": "bajt(256)",
       "expected": "None"
      },
      {
       "call": "bajt(-1)",
       "expected": "None"
      },
      {
       "call": "all(bajt(n) == format(n, \"08b\") for n in range(256))",
       "expected": "True",
       "label": "Wszystkie wartości bajtu"
      }
     ],
     "hints": [
      "Najpierw if n < 0 or n > 255: return None.",
      "Dla poprawnych danych return na_dwojkowy(n).zfill(8)."
     ],
     "summary": "bajt(n): {passed}/{total} testów"
    }
   ],
   "duration": 11,
   "grouping": "solo",
   "teacherNotes": "Samodzielny transfer: uczeń ma wyjaśnić, dlaczego zfill nie jest kontrolą zakresu. Szybsi porównują wszystkie 256 wartości z biblioteką.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Najpierw sprawdź zakres. Dopiero potem użyj na_dwojkowy(n).zfill(8). Porównaj z format(n, \"08b\").",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "result",
   "label": "Wynik",
   "title": "Twój wynik",
   "intro": "Pokaż rezultat i wyjaśnij jedną poprawkę.",
   "reading": {
    "title": "Wyjaśnienie: Twój wynik",
    "paragraphs": [
     "Wynik pokazuje wykonane zadania na tej stronie.",
     "Zaznacz samoocenę celów i wskaż przypadek, który sprawdziłeś dodatkowo."
    ]
   },
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Sprawdzone rozwiązanie",
     "sources": [
      "g3-87-r1",
      "g3-87-r2",
      "g3-87-predict",
      "g3-87-change",
      "g3-87-parsons",
      "g3-87-fix",
      "g3-87-byte"
     ],
     "badges": [
      {
       "min": 0,
       "name": "Pierwsza próba",
       "text": "Wybierz jeden test i popraw przyczynę błędu."
      },
      {
       "min": 0.5,
       "name": "Coraz mniej zgadywania",
       "text": "Masz działające części programu."
      },
      {
       "min": 0.85,
       "name": "Działa na brzegu",
       "text": "Sprawdzasz także przypadki nietypowe."
      }
     ]
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Zapytaj o konkretny błąd i przyczynę poprawy. Zapisz najtrudniejsze pytanie do powrotu na kolejnej lekcji i za tydzień.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Zaznacz samoocenę celów i wskaż przypadek, który sprawdziłeś dodatkowo.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  }
 ],
 "exitTicket": "Pokaż test dla zera oraz jeden test, który wykrył błędny algorytm."
};
