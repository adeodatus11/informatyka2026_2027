export default {
 "id": "88",
 "grade": 3,
 "order": 25,
 "title": "Zamiana liczb między systemami pozycyjnymi",
 "subtitle": "Zrobisz konwerter podstaw 2–16 i odczytasz kolor zapisany szesnastkowo.",
 "topic": "Uogólniam dzielenie z resztą dla podstaw 2–16. Odrzucam cyfry niedozwolone w wybranej podstawie. Zamieniam zapis hex na trzy składowe RGB.",
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
  "teacher": "Najpierw przypomnienie bez notatek i korekta. Modelujesz jedną decyzję na głos, potem zdejmujesz podpowiedzi. Jeśli większość odpowiedzi jest poprawna — zadanie samodzielne; przy podziale zbierz uzasadnienia; przy przewadze błędów pokaż inny przykład. Po teście daj jedną wskazówkę i czas na poprawę. Przed RGB uczeń zapisuje plan trzech wycinków, w połowie dopisuje kontrolę nowej informacji: kod może zawierać G, na końcu uzasadnia zmianę planu.",
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
   },
   {
    "name": "Metapoznanie",
    "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
   }
  ]
 },
 "objectives": [
  "Uogólniam dzielenie z resztą dla podstaw 2–16.",
  "Odrzucam cyfry niedozwolone w wybranej podstawie.",
  "Zamieniam zapis hex na trzy składowe RGB."
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
   "title": "Jedna wartość, różne zapisy",
   "intro": "Na stronie widzisz kolor FF8800. To trzy liczby zapisane w hex. Zacznij od pytań z lekcji 87.",
   "reading": {
    "title": "Wyjaśnienie: Jedna wartość, różne zapisy",
    "paragraphs": [
     "Przy zapisie używaliśmy dzielenia przez 2. Teraz podstawimy inną podstawę, np. 16.",
     "Wartość cyfry A wynosi 10, a F wynosi 15."
    ]
   },
   "activities": [
    {
     "type": "choice",
     "id": "g3-88-r1",
     "question": "Z lekcji 87: dlaczego dopisujesz resztę z lewej?",
     "options": [
      "Reszty powstają od najmłodszej pozycji",
      "Python zawsze odwraca napisy",
      "Aby zaokrąglić liczbę"
     ],
     "correct": [
      0
     ],
     "explanation": "Pierwsza reszta ma najmniejszą wagę i musi znaleźć się na końcu zapisu.",
     "hint": "Pierwsza reszta ma najmniejszą wagę i musi znaleźć się na końcu zapisu."
    },
    {
     "type": "choice",
     "id": "g3-88-r2",
     "question": "Co na_dwojkowy(0) ma zwrócić?",
     "options": [
      "Pusty napis",
      "0 jako liczbę",
      "Napis \"0\""
     ],
     "correct": [
      2
     ],
     "explanation": "Konwerter zwraca zapis, czyli napis; zero wymaga osobnej obsługi.",
     "hint": "Konwerter zwraca zapis, czyli napis; zero wymaga osobnej obsługi."
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Powtórka bez notatek. Po korekcie wróć do reszt w przykładzie 255. Nie zaliczaj samego kliknięcia jako zrozumienia.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Wartość cyfry A wynosi 10, a F wynosi 15.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "model",
   "label": "Podstawa",
   "title": "Dlaczego 255 to FF?",
   "intro": "Przewidź działanie, potem zmień podstawę na 8.",
   "reading": {
    "title": "Wyjaśnienie: Dlaczego 255 to FF?",
    "paragraphs": [
     "255 % 16 = 15, czyli F. Potem 15 % 16 = 15, znów F. Zapis to FF.",
     "Tablica cyfr \"0123456789ABCDEF\" zamienia resztę od 0 do 15 na odpowiedni znak."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-88-predict",
     "mode": "predict",
     "points": 2,
     "file": "g3-88-predict.py",
     "title": "Przewidź przed uruchomieniem",
     "prompt": "Przeczytaj kod i wpisz wynik linia po linii. Potem uruchom i porównaj.",
     "code": "cyfry = \"0123456789ABCDEF\"\nprint(cyfry[10])\nprint(255 % 16)\nprint(255 // 16)\n",
     "predictRows": 4,
     "explain": "Indeks 10 daje A. Reszta 15 daje F, iloraz całkowity wynosi 15."
    }
   ],
   "duration": 8,
   "grouping": "solo",
   "teacherNotes": "Modeluj na głos 255. Poproś wszystkich o wskazanie następnej reszty. Przy błędzie wróć do rozdzielenia ilorazu i reszty.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Tablica cyfr \"0123456789ABCDEF\" zamienia resztę od 0 do 15 na odpowiedni znak.",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "write",
   "label": "Zapis",
   "title": "Konwerter na_system(n, p)",
   "intro": "Uzupełnij algorytm dla całkowitych n >= 0 oraz podstaw od 2 do 16.",
   "reading": {
    "title": "Wyjaśnienie: Konwerter na_system(n, p)",
    "paragraphs": [
     "Ten sam schemat działa z dowolną dozwoloną podstawą. Warunek p < 2 or p > 16 chroni przed niepoprawną podstawą.",
     "Użyj cyfry[n % p], a potem n = n // p. Do testów kontrolnych służą format(n,\"X\") i int(zapis,p)."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-88-to",
     "mode": "code",
     "points": 4,
     "file": "g3-88-to.py",
     "title": "na_system(n, p)",
     "prompt": "Dopisz składanie wyniku i zmniejszanie n. Zostaw walidację. Zwracaj litery A–F wielkie.",
     "starter": "def na_system(n, p):\n    if p < 2 or p > 16 or n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    cyfry = \"0123456789ABCDEF\"\n    wynik = \"\"\n    while n > 0:\n        # dopisz resztę z lewej i wykonaj dzielenie całkowite\n        break\n    return wynik\n",
     "solution": "def na_system(n, p):\n    if p < 2 or p > 16 or n < 0:\n        return None\n    if n == 0:\n        return \"0\"\n    cyfry = \"0123456789ABCDEF\"\n    wynik = \"\"\n    while n > 0:\n        wynik = cyfry[n % p] + wynik\n        n = n // p\n    return wynik\n",
     "tests": [
      {
       "call": "na_system(255,16)",
       "expected": "'FF'"
      },
      {
       "call": "na_system(255,8)",
       "expected": "'377'"
      },
      {
       "call": "na_system(255,2)",
       "expected": "'11111111'"
      },
      {
       "call": "na_system(0,16)",
       "expected": "'0'"
      },
      {
       "call": "na_system(16,16)",
       "expected": "'10'"
      },
      {
       "call": "na_system(9,1)",
       "expected": "None"
      },
      {
       "call": "na_system(9,17)",
       "expected": "None"
      },
      {
       "call": "na_system(-1,10)",
       "expected": "None"
      }
     ],
     "hints": [
      "Resztę zamień na znak tablicą cyfry.",
      "W pętli: wynik = cyfry[n % p] + wynik; następnie n = n // p."
     ],
     "summary": "na_system(n, p): {passed}/{total} testów"
    }
   ],
   "duration": 8,
   "grouping": "solo",
   "teacherNotes": "Uczniowie najpierw przewidują 255 w bazie 8, potem sprawdzają. Brak F w tablicy wykrywa test255 w hex.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Użyj cyfry[n % p], a potem n = n // p. Do testów kontrolnych służą format(n,\"X\") i int(zapis,p).",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "read",
   "label": "Odczyt",
   "title": "Nie każda cyfra pasuje",
   "intro": "Ułóż funkcję odczytującą zapis. Pułapka akceptuje cyfrę równą podstawie.",
   "reading": {
    "title": "Wyjaśnienie: Nie każda cyfra pasuje",
    "paragraphs": [
     "Schemat Hornera z lekcji 57: wynik = wynik * p + cyfra. Przed dodaniem sprawdź cyfrę.",
     "find zwraca -1, gdy znaku brak. Odrzuć zarówno -1, jak i wartość >= p. Małe litery zamień upper()."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-88-from",
     "mode": "parsons",
     "points": 3,
     "file": "g3-88-from.py",
     "title": "z_systemu(s, p)",
     "prompt": "Wybierz linie, ustaw kolejność i wcięcia. Zostaw pułapkę poza programem.",
     "solution": "def z_systemu(s, p):\n    if p < 2 or p > 16 or s == \"\":\n        return None\n    cyfry = \"0123456789ABCDEF\"\n    wynik = 0\n    for znak in s.upper():\n        cyfra = cyfry.find(znak)\n        if cyfra < 0 or cyfra >= p:\n            return None\n        wynik = wynik * p + cyfra\n    return wynik\n",
     "tests": [
      {
       "call": "z_systemu(\"ff\",16)",
       "expected": "255"
      },
      {
       "call": "z_systemu(\"00101\",2)",
       "expected": "5"
      },
      {
       "call": "z_systemu(\"377\",8)",
       "expected": "255"
      },
      {
       "call": "z_systemu(\"0\",10)",
       "expected": "0"
      },
      {
       "call": "z_systemu(\"\",2)",
       "expected": "None"
      },
      {
       "call": "z_systemu(\"G\",16)",
       "expected": "None"
      },
      {
       "call": "z_systemu(\"2\",2)",
       "expected": "None"
      },
      {
       "call": "z_systemu(\"9\",8)",
       "expected": "None"
      },
      {
       "call": "z_systemu(\"10\",1)",
       "expected": "None"
      },
      {
       "call": "z_systemu(\"10\",17)",
       "expected": "None"
      }
     ],
     "distractors": [
      "        if cyfra < 0 or cyfra > p:"
     ],
     "hints": [
      "Funkcję zaczyna def. Wewnątrz while muszą zmieniać się liczba i wynik."
     ]
    }
   ],
   "duration": 10,
   "grouping": "solo",
   "teacherNotes": "Pytanie diagnostyczne: czy 2 jest dozwolone w bazie 2? Przy podziale pokaż0 i1. Po błędzie w układance pozostaw czas na poprawę warunku.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "find zwraca -1, gdy znaku brak. Odrzuć zarówno -1, jak i wartość >= p. Małe litery zamień upper().",
   "commonMistakes": "Uczeń pomija przypadek brzegowy. Poproś o ręczne sprawdzenie zera lub niepoprawnych danych.",
   "optionalExtension": "Sprawdź ten sam algorytm dla zmienionych danych i uzasadnij wynik.",
   "skipIfShortOnTime": false
  },
  {
   "id": "project",
   "label": "Kolor RGB",
   "title": "Rozbij sześć cyfr na trzy liczby",
   "intro": "Napisz rgb(kod). Dla FF8800 oczekujesz (255, 136, 0). Kod podaj bez znaku #.",
   "reading": {
    "title": "Wyjaśnienie: Rozbij sześć cyfr na trzy liczby",
    "paragraphs": [
     "Dwa znaki opisują każdą składową: [0:2], [2:4], [4:6]. Każdą parę odczytujesz w bazie 16.",
     "Najpierw sprawdź długość6. Jeśli choć jedna para jest niepoprawna, zwróć None. Wynik to krotka (r,g,b)."
    ]
   },
   "activities": [
    {
     "type": "pythonLab",
     "id": "g3-88-rgb",
     "mode": "code",
     "points": 4,
     "file": "g3-88-rgb.py",
     "title": "rgb(kod)",
     "prompt": "Gotowa funkcja z_systemu jest wyżej. Dopisz sprawdzenie długości i zamianę trzech par. Małe litery także mają działać.",
     "starter": "def z_systemu(s, p):\n    if p < 2 or p > 16 or s == \"\":\n        return None\n    cyfry = \"0123456789ABCDEF\"\n    wynik = 0\n    for znak in s.upper():\n        cyfra = cyfry.find(znak)\n        if cyfra < 0 or cyfra >= p:\n            return None\n        wynik = wynik * p + cyfra\n    return wynik\n\ndef rgb(kod):\n    pass\n",
     "solution": "def z_systemu(s, p):\n    if p < 2 or p > 16 or s == \"\":\n        return None\n    cyfry = \"0123456789ABCDEF\"\n    wynik = 0\n    for znak in s.upper():\n        cyfra = cyfry.find(znak)\n        if cyfra < 0 or cyfra >= p:\n            return None\n        wynik = wynik * p + cyfra\n    return wynik\n\ndef rgb(kod):\n    if len(kod) != 6:\n        return None\n    r = z_systemu(kod[0:2], 16)\n    g = z_systemu(kod[2:4], 16)\n    b = z_systemu(kod[4:6], 16)\n    if r is None or g is None or b is None:\n        return None\n    return (r, g, b)\n",
     "tests": [
      {
       "call": "rgb(\"FF8800\")",
       "expected": "(255,136,0)"
      },
      {
       "call": "rgb(\"00ff00\")",
       "expected": "(0,255,0)"
      },
      {
       "call": "rgb(\"000000\")",
       "expected": "(0,0,0)"
      },
      {
       "call": "rgb(\"GG0000\")",
       "expected": "None"
      },
      {
       "call": "rgb(\"FFF\")",
       "expected": "None"
      }
     ],
     "hints": [
      "Podziel napis wycinkami po dwa znaki.",
      "Pamiętaj o None z walidatora; nie zamieniaj błędu na kolor0."
     ],
     "summary": "rgb(kod): {passed}/{total} testów"
    }
   ],
   "duration": 11,
   "grouping": "solo",
   "teacherNotes": "Nowy przypadek ma wymusić transfer. Po siedmiu minutach uczeń wybiera jeden niepoprawny kod i przewiduje rezultat. Nie wymagaj budowy interfejsu kolorów.",
   "askStudents": "Który krok decyduje o wyniku? Wyjaśnij go na danych z zadania.",
   "expectedAnswers": "Najpierw sprawdź długość6. Jeśli choć jedna para jest niepoprawna, zwróć None. Wynik to krotka (r,g,b).",
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
      "g3-88-r1",
      "g3-88-r2",
      "g3-88-predict",
      "g3-88-to",
      "g3-88-from",
      "g3-88-rgb"
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
