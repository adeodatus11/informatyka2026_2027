// Klasa 1; tytuł wg rozkładu, praktyka w PhotoCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Przygotujesz miniaturę klubu gier. Tło, pad i tytuł zachowasz na osobnych warstwach.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "Z lekcji 33 o poradniku pamiętasz, że plik roboczy i wersja do oglądania mają inne zadania. Teraz tę samą zasadę wykorzystasz w grafice.",
    "Materiały są autorskimi ilustracjami fikcyjnego klubu, bez cudzych znaków firmowych. Zacznij od własnej kopii."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z lekcji o poradniku: po co zachować plik roboczy obok wersji do oglądania?",
   "Plik roboczy zachowuje strukturę do dalszej edycji. Eksport służy do oglądania i udostępniania.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g99-recall",
    "question": "Z lekcji o poradniku: po co zachować plik roboczy obok wersji do oglądania?",
    "options": [
     "Żeby móc później poprawić elementy pracy",
     "Żeby plik ważył dwa razy więcej",
     "Żeby ukryć autora"
    ],
    "correct": [
     0
    ],
    "explanation": "Plik roboczy zachowuje strukturę do dalszej edycji. Eksport służy do oglądania i udostępniania.",
    "hint": "Plik roboczy zachowuje strukturę do dalszej edycji. Eksport służy do oglądania i udostępniania."
   },
   {
    "type": "download",
    "id": "g99-bg",
    "file": "materials/grafika/99-tlo.png",
    "label": "Pobierz tło miniatury (.png)",
    "title": "Pobierz tło miniatury (.png)",
    "description": "1200 × 675 px; otwórz w PhotoCraft i od razu zapisz własną kopię roboczą."
   },
   {
    "type": "download",
    "id": "g99-object",
    "file": "materials/grafika/99-pad.png",
    "label": "Pobierz ilustrację pada (.png)",
    "title": "Pobierz ilustrację pada (.png)",
    "description": "500 × 500 px, przezroczyste tło. Wstaw jako osobną warstwę; to autorski fikcyjny kontroler."
   }
  ]
 },
 {
  "id": "model",
  "label": "Zobacz decyzję",
  "title": "Jedna decyzja na przykładzie",
  "intro": "Nauczyciel pokazuje jedną zmianę na kopii. Potem podejmij własną decyzję.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Jedna decyzja na przykładzie",
   "paragraphs": [
    "Warstwy działają jak przezroczyste kartki. Tło jest najniżej, obiekt nad nim, a tekst na wierzchu. Ukrycie warstwy zmienia podgląd, ale nie usuwa jej zawartości.",
    "PNG może zachować przezroczystość, ale zwykły eksport PNG spłaszcza kompozycję. Edytowalne warstwy zachowaj osobno w pliku .pcraft albo PSD."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Tytuł zniknął pod ilustracją pada. Co sprawdzisz najpierw?",
   "Przesuń warstwę tekstu nad pad i włącz jej widoczność. Nie trzeba wpisywać tytułu ponownie.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g99-model",
    "question": "Tytuł zniknął pod ilustracją pada. Co sprawdzisz najpierw?",
    "options": [
     "Rozdzielczość monitora",
     "Kolejność i widoczność warstwy tekstu",
     "Nazwę folderu"
    ],
    "correct": [
     1
    ],
    "explanation": "Przesuń warstwę tekstu nad pad i włącz jej widoczność. Nie trzeba wpisywać tytułu ponownie.",
    "hint": "Przesuń warstwę tekstu nad pad i włącz jej widoczność. Nie trzeba wpisywać tytułu ponownie."
   }
  ]
 },
 {
  "id": "build",
  "label": "Zrób wersję 1",
  "title": "Praca w PhotoCraft — pierwsza wersja",
  "intro": "Wykonaj kroki. Po każdym porównaj swój plik z opisem efektu.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Praca w PhotoCraft — pierwsza wersja",
   "paragraphs": [
    "Warstwy działają jak przezroczyste kartki. Tło jest najniżej, obiekt nad nim, a tekst na wierzchu. Ukrycie warstwy zmienia podgląd, ale nie usuwa jej zawartości.",
    "Zapisuj kopię roboczą skrótem Ctrl+S. Jeżeli polecenie zachowuje się inaczej niż w opisie, skorzystaj z pomocy nauczyciela; to program w fazie alfa."
   ]
  },
  "time": 14,
  "notes": [
   "Uczniowie wykonują własny plik. Sprawdź po trzech minutach pierwszy widoczny efekt. Pomagaj pytaniem o aktywny obiekt i sprawdzenie efektu. Nie przejmuj pracy ucznia. Wariant awaryjny i wersje są w przygotowaniu nauczyciela.",
   "Co musi zostać edytowalne w pliku roboczym?",
   "Warstwy, obiekty lub ścieżki objęte zadaniem. Eksport jest osobną kopią do oglądania.",
   "Zapis samego eksportu zamiast pliku roboczego uniemożliwia późniejszą poprawę warstw lub obiektów.",
   "Wykonaj drugą wersję kolorystyczną bez ruszania wersji pierwszej.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g99-build",
    "title": "Wykonaj w PhotoCraft",
    "steps": [
     {
      "title": "Otwórz tło i zapisz kopię",
      "instruction": "Otwórz 99-tlo.png w PhotoCraft. Zapisz jako lesson-99-nazwisko.pcraft (albo PSD, jeśli tę wersję sprawdzono w pracowni). Nazwij warstwę Tło.",
      "check": "Dokument ma 1200 × 675 px, a plik roboczy własną nazwę.",
      "help": "Jeśli otwieranie kończy się awarią, zgłoś to nauczycielowi. Wersja 0.16.0 ma takie zgłoszenie; nie powtarzaj w kółko tej samej próby."
     },
     {
      "title": "Pad na osobnej warstwie",
      "instruction": "Otwórz 99-pad.png, zaznacz cały obraz, skopiuj i wklej do tła jako nową warstwę. Nazwij ją Pad. Narzędziem przenoszenia ustaw go po prawej, a przekształceniem zmniejsz z zachowaniem proporcji.",
      "check": "W panelu masz Tło i Pad. Ukrycie Pada zostawia samo tło.",
      "help": "Jeśli zaznacza się Tło, wskaż warstwę Pad. Jeżeli po przekształceniu pad jest rozciągnięty, cofnij i zachowaj proporcje."
     },
     {
      "title": "Tytuł na trzeciej warstwie",
      "instruction": "Narzędziem tekstowym wpisz KLUB GIER po lewej. Nazwij warstwę Tytuł, ustaw czytelny kolor i wielkość. Zapisz kopię roboczą.",
      "check": "Tło, Pad i Tytuł są trzema osobnymi, nazwanymi warstwami. Tekst nie zasłania pada.",
      "help": "Nie maluj napisu pędzlem. Tekst ma pozostać możliwy do poprawienia."
     }
    ]
   }
  ]
 },
 {
  "id": "improve",
  "label": "Popraw i przenieś",
  "title": "Nowy przypadek i poprawiony eksport",
  "intro": "Zmień jeden warunek zadania. Zastosuj tę samą zasadę i sprawdź wynik.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Nowy przypadek i poprawiony eksport",
   "paragraphs": [
    "Klub zmienia nazwę na GRAMY PO LEKCJACH. Popraw tylko warstwę tekstową i dopasuj jej wielkość.",
    "Wynik sprawdzasz w małym podglądzie: tytuł ma być czytelny, pad proporcjonalny, a tło nie może zakrywać obu elementów."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Każdy poprawia sam; sąsiad może podpowiedzieć pytaniem, bez przejmowania klawiatury.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Wynik sprawdzasz w małym podglądzie: tytuł ma być czytelny, pad proporcjonalny, a tło nie może zakrywać obu elementów.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g99-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Sprawdź kolejność i widoczność",
      "instruction": "Wyłącz po kolei Pad i Tytuł, potem włącz obie warstwy. Zmień napis na GRAMY PO LEKCJACH. Przesuń tekst nad Pad, jeśli jest zasłonięty.",
      "check": "Każdy element można ukryć i poprawić oddzielnie.",
      "help": "Jeżeli po ukryciu znika wszystko, prawdopodobnie pracujesz na spłaszczonym eksporcie. Wróć do pliku roboczego."
     },
     {
      "title": "Eksport i ponowne otwarcie",
      "instruction": "Wyeksportuj całą kompozycję do lesson-99-nazwisko.png. Otwórz PNG w podglądzie obrazów i obejrzyj przy 25% wielkości. Zachowaj także plik roboczy.",
      "check": "Eksport ma 1200 × 675 px i czytelny tytuł; w pliku roboczym nadal są trzy warstwy.",
      "help": "Jeśli zapisujesz PNG zamiast .pcraft, użyj eksportu lub zapisu kopii, aby nie stracić pliku z warstwami."
     }
    ]
   }
  ]
 },
 {
  "id": "review",
  "label": "Obejrzyj plik",
  "title": "Samoocena produktu i kontrola pojęć",
  "intro": "Otwórz plik roboczy i eksport. W rubryce wybierz rzeczywisty stan, także 0 pkt.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Samoocena produktu i kontrola pojęć",
   "paragraphs": [
    "Rubryka to Twoja samoocena. Strona nie czyta obrazu, warstw ani pliku SVG. Nauczyciel ocenia produkt, otwierając go na Twoim komputerze.",
    "Zaznaczenie wszystkich kryteriów nie jest automatyczną weryfikacją. Quiz poniżej sprawdza pojęcia, a nie wygląd pliku."
   ]
  },
  "time": 6,
  "notes": [
   "Obejrzyj plik roboczy i eksport. Poproś o wskazanie konkretnej warstwy, punktu ścieżki lub rozmiaru w pikselach. Jeśli uczeń deklaruje komplet, ale nie umie pokazać efektu, wraca do kryterium. Nie oceniaj grafiki na podstawie punktów z quizu.",
   "Które dwa pliki pokażesz nauczycielowi?",
   "Plik roboczy pokazuje edytowalność warstw, PNG — wygląd gotowej miniatury.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g99-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-99-nazwisko.pcraft oraz eksport PNG",
    "criteria": [
     {
      "label": "Trzy nazwane warstwy",
      "points": 2,
      "description": "0: jedna spłaszczona warstwa; 1: dwa oddzielne elementy; 2: Tło, Pad i Tytuł można osobno wskazać i ukryć."
     },
     {
      "label": "Czytelny tytuł i proporcje",
      "points": 2,
      "description": "0: tytułu nie da się odczytać lub pad jest zniekształcony; 1: jeden problem został; 2: tytuł czytelny przy 25%, pad proporcjonalny."
     },
     {
      "label": "Poprawiona wersja",
      "points": 2,
      "description": "0: brak zmiany; 1: nowy napis jest, ale źle mieści się w kadrze; 2: nowy napis dopasowany bez przebudowy pozostałych warstw."
     },
     {
      "label": "Plik roboczy oraz PNG",
      "points": 2,
      "description": "0: brak zapisanych plików; 1: jest tylko jeden z nich; 2: oba otwierają się poprawnie, PNG ma 1200 × 675 px."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g99-export",
    "question": "Które dwa pliki pokażesz nauczycielowi?",
    "options": [
     "Tylko PNG",
     "Tylko zrzut punktów z quizu",
     "Plik z warstwami i osobny PNG"
    ],
    "correct": [
     2
    ],
    "explanation": "Plik roboczy pokazuje edytowalność warstw, PNG — wygląd gotowej miniatury.",
    "hint": "Plik roboczy pokazuje edytowalność warstw, PNG — wygląd gotowej miniatury."
   }
  ]
 },
 {
  "id": "result",
  "label": "Twój wynik",
  "title": "Pokaż produkt i nazwij poprawkę",
  "intro": "Zapisz plik, pokaż nauczycielowi wynik i odpowiedz na pytanie na wyjście.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Pokaż produkt i nazwij poprawkę",
   "paragraphs": [
    "Wynik quizu dotyczy trzech pytań na platformie. Nie jest oceną Twojej grafiki.",
    "Na komputerze pozostaje zapisany plik. Odpowiedzi i samoocena znikną po odświeżeniu; strona niczego nie wysyła."
   ]
  },
  "time": 4,
  "notes": [
   "Zbierz krótkie wyjaśnienie decyzji i potwierdź produkt w programie. Najczęstszy błąd zapisz do pytania rozpoczynającego kolejną lekcję.",
   "Którą warstwę poprawiłeś po zmianie nazwy klubu i jak sprawdziłeś jej czytelność?",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g99-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g99-recall",
     "g99-model",
     "g99-export"
    ],
    "badges": [
     {
      "min": 0,
      "name": "Pierwsza wersja",
      "text": "Wróć do wyjaśnienia i popraw jeden wybór."
     },
     {
      "min": 0.5,
      "name": "Decyzje mają sens",
      "text": "Pokaż teraz efekt w prawdziwym pliku."
     },
     {
      "min": 0.85,
      "name": "Gotowe do pokazania",
      "text": "Rozumiesz pojęcia. Produkt obejrzy nauczyciel."
     }
    ]
   },
   {
    "type": "text",
    "id": "g99-exit",
    "question": "Którą warstwę poprawiłeś po zmianie nazwy klubu i jak sprawdziłeś jej czytelność?",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "99",
 "grade": 1,
 "order": 15,
 "workspace": "desktop-photocraft",
 "title": "Tworzenie obrazu i praca z warstwami w programie GIMP",
 "subtitle": "PhotoCraft na komputerze: Przygotujesz miniaturę klubu gier. Tło, pad i tytuł zachowasz na osobnych warstwach.",
 "topic": "Warstwy rastra, kolejność, widoczność, tekst i eksport PNG",
 "icon": "palette",
 "tags": [
  "PhotoCraft",
  "plik roboczy",
  "PNG"
 ],
 "duration": 45,
 "curriculum": "PP 2024, liceum/technikum, zakres podstawowy: II.2 — dobór aplikacji i pracy lokalnej; II.3.a — tworzenie i przekształcanie grafiki 2D oraz dobór formatu. Modele 3D nie są realizowane w tej lekcji.",
 "format": {
  "name": "Krótki pokaz, własny plik i poprawa według kryterium",
  "student": "Pracujesz w zainstalowanym PhotoCraft; tytuł z GIMP/Inkscape pozostaje tytułem szkolnego rozkładu. Platforma daje instrukcję, pliki i pytania. Efektem jest własny plik roboczy oraz eksport, pokazane nauczycielowi.",
  "teacher": "Powtórka bez notatek, pokaz jednej decyzji na innym przykładzie, pierwsza wersja ucznia i jedna uwaga do kryterium. Następnie uczeń ma wydzielony czas na poprawę i ponowne otwarcie eksportu. Reaguj na rozkład odpowiedzi, nie tylko na głos chętnych. Nie przedstawiaj quizu ani rubryki jako odczytu obrazu.",
  "grouping": "Samodzielnie na własnej kopii. Pomoc sąsiada pytaniem jest opcją, bez przejmowania myszki.",
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
  "Tworzę kompozycję z co najmniej trzech nazwanych warstw.",
  "Zmieniam kolejność i widoczność bez kasowania treści.",
  "Zapisuję edytowalną kopię i osobny eksport PNG."
 ],
 "materials": [
  "PhotoCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-99-nazwisko.pcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: PhotoCraft 0.16.0, early alpha. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. PhotoCraft #9508 zgłasza crash 0.16.0 przy otwieraniu plików; jeśli próba nie przechodzi, wybierz sprawdzoną starszą wersję lub GIMP. DO WERYFIKACJI w pracowni: GIMP, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Pokazuj na innym tytule niż zadanie ucznia. Odmiany poleceń i skróty sprawdź w wersji pracowni; alternatywny zapis roboczy to PSD, eksport zawsze PNG.",
  "summary": "Produkt: lesson-99-nazwisko.pcraft oraz PNG. Warstwy rastra, kolejność, widoczność, tekst i eksport PNG. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Którą warstwę poprawiłeś po zmianie nazwy klubu i jak sprawdziłeś jej czytelność?"
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
