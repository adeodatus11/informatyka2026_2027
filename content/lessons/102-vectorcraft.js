// Klasa 1; tytuł wg rozkładu, praktyka w VectorCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Zbudujesz prostą ikonę klubu i zobaczysz, dlaczego wektor pozostaje czytelny po powiększeniu.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "W projekcie o rozwoju IT (lekcja 42) oceniałeś przydatność narzędzia do konkretnego celu. Dziś wybierzesz sposób zapisu ikony, która ma działać w małym i dużym rozmiarze.",
    "Wektor opisuje figury i ścieżki. Raster zapisuje siatkę pikseli. Sama końcówka .svg nie zmieni fotografii w zestaw edytowalnych krzywych."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z projektu o rozwoju IT: co jest lepszym uzasadnieniem wyboru narzędzia?",
   "Wybierasz narzędzie dla odbiorcy i sprawdzasz efekt. Dziś cel to czytelna ikona w kilku rozmiarach.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g102-recall",
    "question": "Z projektu o rozwoju IT: co jest lepszym uzasadnieniem wyboru narzędzia?",
    "options": [
     "Jest modne",
     "Wszyscy go używają",
     "Spełnia cel zadania i ma sprawdzony wynik"
    ],
    "correct": [
     2
    ],
    "explanation": "Wybierasz narzędzie dla odbiorcy i sprawdzasz efekt. Dziś cel to czytelna ikona w kilku rozmiarach.",
    "hint": "Wybierasz narzędzie dla odbiorcy i sprawdzasz efekt. Dziś cel to czytelna ikona w kilku rozmiarach."
   },
   {
    "type": "download",
    "id": "g102-file",
    "file": "materials/grafika/102-figury.svg",
    "label": "Pobierz starter ikony (.svg)",
    "title": "Pobierz starter ikony (.svg)",
    "description": "900 × 600; trzy figury na jasnym tle. Otwórz w VectorCraft i zapisz kopię .vectorcraft."
   },
   {
    "type": "download",
    "id": "g102-vector",
    "file": "materials/grafika/102-ikona.svg",
    "label": "Pobierz małą ikonę wektorową (.svg)",
    "title": "Pobierz małą ikonę wektorową (.svg)",
    "description": "Otwórz obok wersji PNG i porównaj po dużym powiększeniu."
   },
   {
    "type": "download",
    "id": "g102-raster",
    "file": "materials/grafika/102-ikona.png",
    "label": "Pobierz tę samą ikonę rastrową (.png)",
    "title": "Pobierz tę samą ikonę rastrową (.png)",
    "description": "64 × 64 px; przy mocnym powiększeniu zobaczysz granice pikseli."
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
    "Prostokąt i koło mają opis kształtu. Możesz zmienić ich rozmiar, a program obliczy nowy rysunek. W rastrze powiększasz istniejące próbki — piksele.",
    "Wypełnienie to środek figury, obrys to jej krawędź. Najprostsza ikona powinna działać bez małych szczegółów, których nie widać w miniaturze."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Ikona ma być na małym przycisku i dużej tablicy. Który plik zachowa opisy figur?",
   "Natywny dokument zachowuje edytowalność. SVG potrafi przechować wektorowe figury; sam zrzut ekranu jest rastrem.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g102-model",
    "question": "Ikona ma być na małym przycisku i dużej tablicy. Który plik zachowa opisy figur?",
    "options": [
     "Natywny wektor i SVG",
     "Dowolny PNG przemianowany na SVG",
     "Zrzut ekranu 64 × 64"
    ],
    "correct": [
     0
    ],
    "explanation": "Natywny dokument zachowuje edytowalność. SVG potrafi przechować wektorowe figury; sam zrzut ekranu jest rastrem.",
    "hint": "Natywny dokument zachowuje edytowalność. SVG potrafi przechować wektorowe figury; sam zrzut ekranu jest rastrem."
   }
  ]
 },
 {
  "id": "build",
  "label": "Zrób wersję 1",
  "title": "Praca w VectorCraft — pierwsza wersja",
  "intro": "Wykonaj kroki. Po każdym porównaj swój plik z opisem efektu.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Praca w VectorCraft — pierwsza wersja",
   "paragraphs": [
    "Prostokąt i koło mają opis kształtu. Możesz zmienić ich rozmiar, a program obliczy nowy rysunek. W rastrze powiększasz istniejące próbki — piksele.",
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
    "id": "g102-build",
    "title": "Wykonaj w VectorCraft",
    "steps": [
     {
      "title": "Porównaj dwa zapisy",
      "instruction": "Otwórz 102-ikona.svg i 102-ikona.png w VectorCraft lub podglądzie. Powiększ oba do około 800%. Wskaż różnicę krawędzi.",
      "check": "PNG ujawnia siatkę próbek, SVG przerysowuje kształt.",
      "help": "Porównujesz dokładnie tę samą ikonę, nie dwa różne obrazki. PNG ma tylko 64 × 64 px."
     },
     {
      "title": "Kopia i oddzielne figury",
      "instruction": "Otwórz 102-figury.svg, zapisz lesson-102-nazwisko.vectorcraft. Zaznacz osobno prostokąt, koło i wąski prostokąt. Zmień kolory wypełnienia; zachowaj kontrast.",
      "check": "Trzy elementy dają się osobno przesunąć i zmienić.",
      "help": "Jeśli zaznacza się cały zestaw, rozwiń grupę w panelu obiektów albo rozgrupuj kopię. Nie rasteryzuj dokumentu."
     },
     {
      "title": "Własny znak z figur",
      "instruction": "Dodaj poziomy prostokąt, aby wraz z pionowym stworzyć znak plus w kole. Dopasuj grubość, położenie i kontrast. Ustaw jeden celowy obrys albo usuń przypadkowy.",
      "check": "Plus jest wyśrodkowany i czytelny. Elementy pozostają figurami.",
      "help": "Mniej detali pomaga przy małym rozmiarze. Nie dodawaj małych napisów do środka ikony."
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
    "Nowy odbiorca potrzebuje wersji jednobarwnej. Zrób kopię ikony i zmień ją na dwa odcienie o mocnym kontraście.",
    "Sprawdź miniaturę 64 px i większy widok. Wektor ma zachować kształt, ale decyzja o prostocie należy do Ciebie."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Każdy poprawia sam; sąsiad może podpowiedzieć pytaniem, bez przejmowania klawiatury.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Sprawdź miniaturę 64 px i większy widok. Wektor ma zachować kształt, ale decyzja o prostocie należy do Ciebie.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g102-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Wariant do małego rozmiaru",
      "instruction": "Zrób kopię znaku obok i uprość ją do jasnego oraz ciemnego koloru. Obejrzyj całą ikonę w miniaturze.",
      "check": "Znaku plus nie trzeba zgadywać, a obrys nie zjada wypełnienia.",
      "help": "Jeśli detale znikają, usuń je lub zwiększ ich grubość, zamiast tylko powiększać cały dokument."
     },
     {
      "title": "Zapis i dwa eksporty",
      "instruction": "Zapisz plik .vectorcraft. Wyeksportuj lesson-102-nazwisko.svg i lesson-102-nazwisko.png. Otwórz SVG w przeglądarce, PNG w podglądzie.",
      "check": "SVG otwiera się bez brakujących elementów; PNG pokazuje tę samą kompozycję.",
      "help": "Eksport SVG ma zawierać figury, nie sam osadzony zrzut. Pokaż nauczycielowi oddzielne obiekty w pliku roboczym."
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
   "Po powiększeniu PNG widać piksele. Czy zmiana nazwy pliku na .svg naprawi kształt?",
   "Rozszerzenie nie przelicza rastra na krzywe. W tej lekcji źródłem są prawdziwe figury wektorowe.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g102-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-102-nazwisko.vectorcraft oraz eksport SVG i PNG",
    "criteria": [
     {
      "label": "Porównanie rastra i wektora",
      "points": 2,
      "description": "0: brak porównania; 1: widoczna różnica bez wyjaśnienia; 2: wskazana różnica krawędzi i związek z pikselami/figurami."
     },
     {
      "label": "Osobne figury",
      "points": 2,
      "description": "0: tylko spłaszczony obraz; 1: część elementów oddzielna; 2: koło, tło znaku i oba prostokąty plusa są osobno edytowalne."
     },
     {
      "label": "Dwa czytelne warianty",
      "points": 2,
      "description": "0: brak własnej zmiany; 1: zmiana kolorów, ale znak ginie; 2: podstawowy i uproszczony wariant czytelne także w miniaturze."
     },
     {
      "label": "Dokument i eksporty",
      "points": 2,
      "description": "0: brak plików; 1: sam dokument lub jeden eksport; 2: .vectorcraft, SVG i PNG otwierają się i przedstawiają tę samą kompozycję."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g102-export",
    "question": "Po powiększeniu PNG widać piksele. Czy zmiana nazwy pliku na .svg naprawi kształt?",
    "options": [
     "Tak, zawsze",
     "Nie, trzeba zachować lub odtworzyć wektorowe figury",
     "Tak, gdy dopiszesz więcej zer w rozmiarze"
    ],
    "correct": [
     1
    ],
    "explanation": "Rozszerzenie nie przelicza rastra na krzywe. W tej lekcji źródłem są prawdziwe figury wektorowe.",
    "hint": "Rozszerzenie nie przelicza rastra na krzywe. W tej lekcji źródłem są prawdziwe figury wektorowe."
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
   "Który fragment Twojej ikony uprościłeś i co pokazało porównanie PNG z SVG?",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g102-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g102-recall",
     "g102-model",
     "g102-export"
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
    "id": "g102-exit",
    "question": "Który fragment Twojej ikony uprościłeś i co pokazało porównanie PNG z SVG?",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "102",
 "grade": 1,
 "order": 37,
 "workspace": "desktop-vectorcraft",
 "title": "Tworzenie rysunków w grafice wektorowej",
 "subtitle": "VectorCraft na komputerze: Zbudujesz prostą ikonę klubu i zobaczysz, dlaczego wektor pozostaje czytelny po powiększeniu.",
 "topic": "Raster i wektor, figury, wypełnienie, obrys i SVG",
 "icon": "palette",
 "tags": [
  "VectorCraft",
  "plik roboczy",
  "SVG i PNG"
 ],
 "duration": 45,
 "curriculum": "PP 2024, liceum/technikum, zakres podstawowy: II.2 — dobór aplikacji i pracy lokalnej; II.3.a — tworzenie i przekształcanie grafiki 2D oraz dobór formatu. Modele 3D nie są realizowane w tej lekcji.",
 "format": {
  "name": "Krótki pokaz, własny plik i poprawa według kryterium",
  "student": "Pracujesz w zainstalowanym VectorCraft; tytuł z GIMP/Inkscape pozostaje tytułem szkolnego rozkładu. Platforma daje instrukcję, pliki i pytania. Efektem jest własny plik roboczy oraz eksport, pokazane nauczycielowi.",
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
  "Odróżniam raster od wektora na powiększeniu.",
  "Tworzę ikonę z oddzielnych figur.",
  "Zapisuję edytowalny wektor i eksport SVG/PNG."
 ],
 "materials": [
  "VectorCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-102-nazwisko.vectorcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: VectorCraft 0.17.0, alfa. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. Unikamy masek Ctrl+7 (#4120); warstwy dodajemy po zakończeniu edycji tekstu (#4118), a projekty pozostają małe (#4145). DO WERYFIKACJI w pracowni: Inkscape, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Nie wymagamy masek ani funkcji AI. W starterze tło jest zwykłym prostokątem, a znak składa się z oddzielnych figur. Po otwarciu sprawdź, czy import zachowuje obiekty.",
  "summary": "Produkt: lesson-102-nazwisko.vectorcraft oraz SVG i PNG. Raster i wektor, figury, wypełnienie, obrys i SVG. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Który fragment Twojej ikony uprościłeś i co pokazało porównanie PNG z SVG?"
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
