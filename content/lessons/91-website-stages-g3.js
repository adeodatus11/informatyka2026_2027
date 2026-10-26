export const SOLUTION_HTML="<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Pracownia po lekcjach</title>\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<main>\n<h1>Pracownia po lekcjach</h1>\n<p>Otwarte zajęcia dla osób, które chcą sprawdzić własny pomysł.</p>\n<h2>Co możesz zrobić</h2>\n<ul><li>przetestować program</li><li>poprawić stronę</li><li>zaprojektować prosty układ</li></ul>\n<h2>Kiedy przyjść</h2>\n<table><tr><th>Dzień</th><th>Godzina</th></tr><tr><td>Wtorek</td><td>15:00</td></tr><tr><td>Czwartek</td><td>15:00</td></tr></table>\n<p><a href=\"#kontakt\">Zobacz sposób kontaktu</a></p>\n<p id=\"kontakt\">Zapytaj nauczyciela w sali 12. Terminy są fikcyjnymi danymi ćwiczenia.</p>\n</main>\n</body>\n</html>\n";
export const SOLUTION_CSS="body { font-family: Arial, sans-serif; font-size: 18px; color: #182f38; background-color: #f7fafc; line-height: 1.6; margin: 0; padding: 16px; }\nmain { max-width: 900px; margin: auto; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { padding: 12px; border-bottom: 1px solid #64748b; text-align: left; }\na { color: #17477a; }\n";
export default {
 "id": "91",
 "grade": 3,
 "order": 31,
 "title": "Etapy tworzenia strony internetowej",
 "subtitle": "Zrobisz prostą stronę pracowni: od celu i makiety do kodu oraz sprawdzonego pliku.",
 "topic": "Planuję stronę pod konkretny cel i odbiorcę. Tworzę nagłówki, listę, tabelę i link w HTML. Oddzielam treść HTML od wyglądu CSS i sprawdzam podgląd.",
 "icon": "globe",
 "tags": [
  "HTML",
  "CSS",
  "strona do pokazania"
 ],
 "duration": 45,
 "curriculum": "I.1, II.2, II.3.f, IV.1 — plan, kod, test i poprawa strony; publikacja tylko omawiana, bez konta i hostingu.",
 "format": {
  "name": "Plan → kod → test → poprawa",
  "student": "Pracujesz sam w edytorze na platformie. Wybierasz zmianę dla odbiorcy, sprawdzasz kryteria i pobierasz gotowy plik.",
  "teacher": "Krótki przykład rozwiązany z głośnym uzasadnieniem. Zbierz odpowiedź wszystkich przed kolejnym krokiem: większość poprawnych — samodzielnie; przy podziale uzasadnienia; większość błędnych — pokaż drugi przykład. Po jednej uwadze według kryterium uczeń ma czas na poprawę i ponowną kontrolę.",
  "grouping": "Samodzielnie. Możesz pokazać sąsiadowi podgląd i zapytać, gdzie szukałby informacji. Osoba bez pary sprawdza te same kryteria samodzielnie.",
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
  "Planuję stronę pod konkretny cel i odbiorcę.",
  "Tworzę nagłówki, listę, tabelę i link w HTML.",
  "Oddzielam treść HTML od wyglądu CSS i sprawdzam podgląd."
 ],
 "materials": [
  "Komputer z przeglądarką i htmlLab na platformie; bez konta, instalacji i hostingu."
 ],
 "teacherGuide": {
  "preparation": "Otwórz podgląd i sprawdź zapis pliku HTML. W tej lekcji nie publikujemy nic w sieci. Ocena kryteriów w htmlLab jest pomocą; obejrzyj rzeczywisty podgląd i odczyt klawiaturą.",
  "summary": "Uczeń planuje zmianę, edytuje kod, sprawdza kryteria, poprawia oraz pobiera samodzielny plik HTML. Publikowanie jest etapem omawianym; nie deklaruj wykonanego wdrożenia."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Strona ma pomóc komuś coś zrobić",
   "intro": "Nowa osoba w szkole chce wiedzieć, co i kiedy można robić w pracowni. Dostanie jedną czytelną stronę.",
   "reading": {
    "title": "Wyjaśnienie: Strona ma pomóc komuś coś zrobić",
    "paragraphs": [
     "Z ostatniego projektu robota pamiętasz: działający przykład to za mało, trzeba sprawdzić różne sytuacje.",
     "Strona też ma odbiorcę i przypadki testowe: mały ekran, klawiatura, znalezienie terminu."
    ]
   },
   "activities": [
    {
     "type": "choice",
     "id": "g3-91-r1",
     "question": "Z projektu107: po co sprawdzasz STOP także wtedy, gdy jest przeszkoda?",
     "options": [
      "Żeby sprawdzić priorytet w trudniejszym przypadku",
      "Żeby zmienić nazwę robota",
      "Nie trzeba tego sprawdzać"
     ],
     "correct": [
      0
     ],
     "explanation": "Dwa warunki naraz mogą ujawnić błąd ukryty w prostym przykładzie. Stronę też testujesz w różnych warunkach.",
     "hint": "Dwa warunki naraz mogą ujawnić błąd ukryty w prostym przykładzie. Stronę też testujesz w różnych warunkach."
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Powtórka bez stopnia z 107. Po odpowiedzi poproś o analogię testu strony w małym oknie. Nie zakładaj wcześniejszych lekcji WWW klasy 1.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Strona też ma odbiorcę i przypadki testowe: mały ekran, klawiatura, znalezienie terminu.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "plan",
   "label": "Plan",
   "title": "Cel, odbiorca i makieta",
   "intro": "Odbiorca: nowy uczeń. Cel: wybrać zajęcie i znaleźć termin w mniej niż minutę.",
   "reading": {
    "title": "Wyjaśnienie: Cel, odbiorca i makieta",
    "paragraphs": [
     "Makieta to plan: na górze nazwa pracowni, potem lista czynności, niżej tabela dni i godzin oraz kontakt. Nie dobierasz jeszcze kolorów.",
     "Treści wpisujesz przed stylowaniem. HTML nadaje im strukturę, CSS wygląd. Ostatni etap to publikacja sprawdzonej wersji na serwerze — dziś tylko pobieramy plik."
    ]
   },
   "activities": [
    {
     "type": "sequence",
     "id": "g3-91-order",
     "question": "Ułóż etapy pracy nad stroną dla pracowni.",
     "options": [
      "Cel i odbiorca",
      "Makieta",
      "Treść",
      "HTML",
      "CSS",
      "Test i poprawa",
      "Publikacja"
     ],
     "correct": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "explanation": "Najpierw ustalasz komu i po co służy strona. Przed opublikowaniem sprawdzasz treść, wygląd i działanie."
    },
    {
     "type": "text",
     "id": "g3-91-plan",
     "question": "Zapisz jedno zdanie: gdzie odbiorca znajdzie termin i po czym to sprawdzisz?",
     "minLength": 20,
     "explanation": "Przykład: terminy będą pod nagłówkiem Kiedy przyjść; sprawdzę, czy znajdę je w małym oknie. To Twój plan, nie automatyczna ocena."
    }
   ],
   "duration": 7,
   "grouping": "solo",
   "teacherNotes": "Pokaż makietę jako cztery nazwy na tablicy. W połowie pracy wróć do pytania, czy terminy widać także przy wąskim oknie. Daj krótką korektę planu.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Treści wpisujesz przed stylowaniem. HTML nadaje im strukturę, CSS wygląd. Ostatni etap to publikacja sprawdzonej wersji na serwerze — dziś tylko pobieramy plik.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "html",
   "label": "HTML",
   "title": "Treść i znaczniki",
   "intro": "Nagłówek h1 jest gotowy. Dopisz resztę według makiety.",
   "reading": {
    "title": "Wyjaśnienie: Treść i znaczniki",
    "paragraphs": [
     "Znacznik <h2>Co możesz zrobić</h2> tworzy nagłówek sekcji. <ul><li>przetestować program</li></ul> tworzy listę. Dla kolejnych czynności dopisujesz li.",
     "Tabela ma wiersze tr, w pierwszym nagłówki th, dalej komórki td. Link a href=\"#kontakt\" prowadzi do elementu id=\"kontakt\". Sprawdź zamykanie znaczników."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-91-html",
     "stateKey": "g3-91-site",
     "mode": "tasks",
     "points": 5,
     "title": "Strona pracowni: treść",
     "site": "pracownia",
     "product": "Strona pracowni",
     "prompt": "Dopisz dwa h2, trzy czynności w li i tabelę: Dzień/Godzina, Wtorek15:00 i Czwartek15:00. Dodaj opisowy link do kontaktu. Dane są fikcyjne. Skorzystaj ze wzoru wyżej i przycisków Wstaw.",
     "html": "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Pracownia po lekcjach</title>\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<main>\n<h1>Pracownia po lekcjach</h1>\n<p>Otwarte zajęcia dla osób, które chcą sprawdzić własny pomysł.</p>\n<!-- Dopisz dwa nagłówki h2, listę i tabelę zgodnie z kartą zadania. -->\n</main>\n</body>\n</html>\n",
     "css": "",
     "cssTab": false,
     "checks": [
      {
       "id": "h2",
       "type": "headings",
       "label": "Jeden h1 i co najmniej dwa nagłówki h2",
       "hint": [
        "Pod h1 dopisz h2: Co możesz zrobić oraz Kiedy przyjść."
       ],
       "minH2": 2
      },
      {
       "id": "list",
       "type": "exists",
       "label": "Lista co najmniej trzech czynności",
       "hint": [
        "W ul dodaj trzy znaczniki li."
       ],
       "sel": "ul li",
       "min": 3
      },
      {
       "id": "table",
       "type": "table",
       "label": "Tabela z nagłówkami i dwoma wierszami",
       "hint": [
        "W pierwszym tr wpisz dwa th, w dwóch następnych po dwa td."
       ],
       "minTh": 2,
       "minRows": 2
      },
      {
       "id": "link",
       "type": "links",
       "label": "Opisowy link do kontaktu",
       "hint": [
        "Użyj a href=\"#kontakt\" i tekstu: Zobacz sposób kontaktu."
       ],
       "min": 1
      },
      {
       "id": "closed",
       "type": "closed",
       "label": "Znaczniki są zamknięte",
       "hint": [
        "Każdy ul,li,table,tr,th,td ma odpowiedni znacznik zamykający."
       ]
      }
     ],
     "download": true
    }
   ],
   "duration": 12,
   "grouping": "solo",
   "teacherNotes": "Pierwszy działający podgląd w trzy minuty. Modeluj jeden nagłówek i li. Dalej uczeń sam tworzy strukturę; nie podawaj całego gotowego rozwiązania.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Tabela ma wiersze tr, w pierwszym nagłówki th, dalej komórki td. Link a href=\"#kontakt\" prowadzi do elementu id=\"kontakt\". Sprawdź zamykanie znaczników.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "css",
   "label": "CSS",
   "title": "Czytelność przed ozdobami",
   "intro": "W zakładce style.css popraw wygląd. Ten sam plik HTML zachowuje Twoje treści.",
   "reading": {
    "title": "Wyjaśnienie: Czytelność przed ozdobami",
    "paragraphs": [
     "Reguła body { font-size:18px; } ustawia wielkość tekstu. color to kolor tekstu, background-color to kolor tła. Każdą deklarację zakończ średnikiem.",
     "Ustaw co najmniej16px i kontrast4,5:1. main { max-width:900px; margin:auto; } ogranicza długość wierszy. Unikaj sztywnej szerokości większej niż okno."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-91-css",
     "stateKey": "g3-91-site",
     "mode": "fix",
     "points": 3,
     "title": "Strona pracowni: czytelność",
     "site": "pracownia",
     "product": "Czytelna strona pracowni",
     "prompt": "Zmieniaj tylko style.css. Dodaj reguły dla body i main. Zachowaj treści z poprzedniego etapu. Wróć do HTML, jeśli jeszcze ich brakuje.",
     "html": "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Pracownia po lekcjach</title>\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<main>\n<h1>Pracownia po lekcjach</h1>\n<p>Otwarte zajęcia dla osób, które chcą sprawdzić własny pomysł.</p>\n<!-- Dopisz dwa nagłówki h2, listę i tabelę zgodnie z kartą zadania. -->\n</main>\n</body>\n</html>\n",
     "css": "",
     "cssTab": true,
     "startTab": "css",
     "lockHtml": true,
     "keep": [
      {
       "sel": "h2",
       "min": 2
      },
      {
       "sel": "li",
       "min": 3
      },
      {
       "sel": "table",
       "min": 1
      }
     ],
     "checks": [
      {
       "id": "size",
       "type": "css",
       "label": "Tekst co najmniej16px",
       "hint": [
        "body { font-size:18px; }"
       ],
       "sel": "body",
       "props": "font-size",
       "test": "minPx",
       "value": 16
      },
      {
       "id": "contrast",
       "type": "contrast",
       "label": "Kontrast body co najmniej4,5:1",
       "hint": [
        "Ustaw ciemny tekst na jasnym tle."
       ],
       "sel": "body",
       "min": 4.5,
       "needBg": true
      },
      {
       "id": "width",
       "type": "css",
       "label": "Treść ma ograniczoną szerokość",
       "hint": [
        "main { max-width:900px; margin:auto; }"
       ],
       "sel": "main",
       "props": "max-width",
       "test": "nonzero",
       "value": null
      }
     ]
    }
   ],
   "duration": 10,
   "grouping": "solo",
   "teacherNotes": "Daj jedną uwagę o czytelności i siedem minut na poprawę. Przy słabym kontraście pokaż jedną bezpieczną parę kolorów, potem uczeń sprawdza swoją.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Ustaw co najmniej16px i kontrast4,5:1. main { max-width:900px; margin:auto; } ogranicza długość wierszy. Unikaj sztywnej szerokości większej niż okno.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "test",
   "label": "Test i zapis",
   "title": "Pokaż wynik, zachowaj plik",
   "intro": "Otwórz podgląd, zmniejsz okno, sprawdź link do kontaktu. Potem pobierz plik HTML.",
   "reading": {
    "title": "Wyjaśnienie: Pokaż wynik, zachowaj plik",
    "paragraphs": [
     "Test: znajdź termin, przejdź Tab do linku, wciśnij Enter. W węższym oknie treść nie powinna wymagać przewijania poziomego.",
     "Pobrany plik zawiera kod i CSS. Otwórz go ponownie lokalnie. Publikacja wymaga umieszczenia pliku na serwerze; nie robimy tego na tej lekcji."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-91-show",
     "mode": "show",
     "from": "g3-91-site",
     "fromMode": "fix",
     "title": "Gotowa strona pracowni",
     "prompt": "Pokaż podgląd. Pobierz plik HTML i otwórz go lokalnie. Jeśli brakuje treści lub kryteriów, wróć do odpowiedniego etapu."
    },
    {
     "type": "choice",
     "id": "g3-91-publish",
     "question": "Co oznacza publikacja strony?",
     "options": [
      "Samo pobranie pliku na komputer",
      "Umieszczenie sprawdzonej strony na serwerze pod adresem dostępnym odbiorcom",
      "Zmiana koloru h1"
     ],
     "correct": [
      1
     ],
     "explanation": "Zapis lokalny zachowuje pracę; publikacja udostępnia ją odbiorcom przez serwer.",
     "hint": "Zapis lokalny zachowuje pracę; publikacja udostępnia ją odbiorcom przez serwer."
    }
   ],
   "duration": 8,
   "grouping": "solo",
   "teacherNotes": "Uczeń pokazuje zapisany plik. Nauczyciel pyta, gdzie jest termin. Jeśli treść się nie mieści, wróć do CSS i pozwól poprawić szerokość.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Pobrany plik zawiera kod i CSS. Otwórz go ponownie lokalnie. Publikacja wymaga umieszczenia pliku na serwerze; nie robimy tego na tej lekcji.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "result",
   "label": "Wynik",
   "title": "Twój wynik",
   "intro": "Pokaż stronę, pobrany plik i jedną poprawkę.",
   "reading": {
    "title": "Wyjaśnienie: Twój wynik",
    "paragraphs": [
     "Punkty opisują kryteria sprawdzone na platformie. Obejrzyj także stronę w podglądzie.",
     "Pobranie pliku zachowuje pracę. Nie oznacza publikacji w internecie."
    ]
   },
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Strona po testach",
     "sources": [
      "g3-91-order",
      "g3-91-html",
      "g3-91-css",
      "g3-91-publish"
     ],
     "badges": [
      {
       "min": 0,
       "name": "Pierwszy szkic",
       "text": "Popraw jedno kryterium i sprawdź ponownie."
      },
      {
       "min": 0.5,
       "name": "Czytelniej",
       "text": "Odbiorca łatwiej odnajduje informacje."
      },
      {
       "min": 0.85,
       "name": "Gotowe do pokazania",
       "text": "Masz sprawdzoną stronę i zapisany wynik."
      }
     ]
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Poproś o konkretny przykład zmiany dla odbiorcy. Zapisz pytanie o różnicę między HTML i CSS do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Pobranie pliku zachowuje pracę. Nie oznacza publikacji w internecie.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  }
 ],
 "exitTicket": "Co poprawiłeś po teście i jak sprawdziłeś, że odbiorca łatwiej skorzysta ze strony?"
};
