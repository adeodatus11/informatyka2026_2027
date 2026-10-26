// Klasa 1; tytuł wg rozkładu, praktyka w VectorCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Narysujesz układ pudełek z płaskich figur, uporządkujesz warstwy i sprawdzisz przekształcenia.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "W poprzedniej lekcji poprawiałeś pojedynczy punkt ścieżki. Dziś przekształcisz cały obiekt, ale nadal pracujesz w rysunku 2D.",
    "Starter przedstawia pudełko z trzech płaskich ścian. To ilustracja przestrzenna, nie model 3D do pomiarów ani druku 3D."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z lekcji 103: czym różni się przesunięcie punktu od przesunięcia obiektu?",
   "Wybór narzędzia określa zakres zmiany. Dziś skalujesz lub obracasz całą kopię pudełka.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g104-recall",
    "question": "Z lekcji 103: czym różni się przesunięcie punktu od przesunięcia obiektu?",
    "options": [
     "Nie ma różnicy",
     "Punkt zawsze usuwa obrys",
     "Punkt zmienia fragment kształtu, obiekt przenosi całość"
    ],
    "correct": [
     2
    ],
    "explanation": "Wybór narzędzia określa zakres zmiany. Dziś skalujesz lub obracasz całą kopię pudełka.",
    "hint": "Wybór narzędzia określa zakres zmiany. Dziś skalujesz lub obracasz całą kopię pudełka."
   },
   {
    "type": "download",
    "id": "g104-file",
    "file": "materials/grafika/104-przestrzen.svg",
    "label": "Pobierz pudełko z płaskich figur (.svg)",
    "title": "Pobierz pudełko z płaskich figur (.svg)",
    "description": "Trzy ściany w grupie. Zapisz własną kopię w VectorCraft i dodaj własne warstwy."
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
    "Trzy płaskie wielokąty o różnych odcieniach mogą wyglądać jak pudełko. Miejsce styku krawędzi i konsekwentne odcienie pomagają odczytać przestrzeń.",
    "Grupa ułatwia zmianę całego pudełka, warstwa porządkuje większą część kompozycji. Kolejność określa, co zasłania co. Skalowanie z zachowaniem proporcji zmienia rozmiar bez rozciągania."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Pudełko po zmniejszeniu wygląda na rozciągnięte. Co poprawić?",
   "Jednakowa proporcja skali zachowuje kształt. Zmiana formatu nie naprawi rozciągniętej geometrii.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g104-model",
    "question": "Pudełko po zmniejszeniu wygląda na rozciągnięte. Co poprawić?",
    "options": [
     "Skalować szerokość i wysokość w tej samej proporcji",
     "Dodać więcej tekstu",
     "Zapisać JPG zamiast SVG"
    ],
    "correct": [
     0
    ],
    "explanation": "Jednakowa proporcja skali zachowuje kształt. Zmiana formatu nie naprawi rozciągniętej geometrii.",
    "hint": "Jednakowa proporcja skali zachowuje kształt. Zmiana formatu nie naprawi rozciągniętej geometrii."
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
    "Trzy płaskie wielokąty o różnych odcieniach mogą wyglądać jak pudełko. Miejsce styku krawędzi i konsekwentne odcienie pomagają odczytać przestrzeń.",
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
    "id": "g104-build",
    "title": "Wykonaj w VectorCraft",
    "steps": [
     {
      "title": "Kopia, grupa i warstwy",
      "instruction": "Otwórz 104-przestrzen.svg i zapisz lesson-104-nazwisko.vectorcraft. Sprawdź trzy ściany pudełka; zachowaj je jako jedną grupę. Utwórz nazwane warstwy Tło, Pudełka i Opisy. Umieść grupę na Pudełka.",
      "check": "Ukrycie Pudełka usuwa z widoku wszystkie ściany, ale nie tło.",
      "help": "Warstwy twórz po zakończeniu edycji tekstu; w tej wersji zgłoszono problem skrótu Ctrl+L podczas pisania. Korzystaj z panelu lub menu sprawdzonego przez nauczyciela."
     },
     {
      "title": "Kopia i skala",
      "instruction": "Zduplikuj grupę pudełka. Zmniejsz kopię proporcjonalnie do około 70% oryginału i ustaw obok. Zachowaj styk ścian.",
      "check": "Są dwa pudełka o takich samych proporcjach, ale różnych rozmiarach.",
      "help": "Jeśli zmienia się tylko jedna ściana, zaznacz grupę zamiast pojedynczej ścieżki. Cofnij niepełne przekształcenie."
     },
     {
      "title": "Obrót i podpis",
      "instruction": "Zrób kolejną kopię małego pudełka i obróć ją jako całość o niewielki kąt. Na warstwie Opisy wpisz MATERIAŁY DO WYSYŁKI. Nie obracaj tła ani podpisu razem z grupą.",
      "check": "Na rysunku widać oryginał, proporcjonalną kopię i kopię obróconą; podpis pozostaje poziomy.",
      "help": "To obrót ilustracji 2D, nie obracanie kamery wokół bryły. Nie używaj narzędzi 3D."
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
    "Nowy układ wymaga częściowego nakładania pudełek. Zmień ich kolejność i popraw odstępy, zamiast rysować wszystko od początku.",
    "Sprawdź oddzielnie widoczność warstw i grup. Po włączeniu wszystkich elementów żaden podpis nie może zostać zasłonięty."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Chętne pary porównują dwa eksporty według kryterium; bez pary uczeń sprawdza sam, przełączając wersje. Nie wymuszaj ról.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Sprawdź oddzielnie widoczność warstw i grup. Po włączeniu wszystkich elementów żaden podpis nie może zostać zasłonięty.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g104-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Kolejność i kontrola warstw",
      "instruction": "Przesuń jedną kopię tak, aby częściowo zachodziła na większe pudełko. Ustaw świadomie, które pudełko jest z przodu. Wyłącz i włącz po kolei Tło, Pudełka i Opisy.",
      "check": "Warstwy mają czytelne nazwy, a kolejność daje zaplanowane zasłanianie.",
      "help": "Jeśli znika cały rysunek, elementy trafiły na jedną warstwę. Przenieś tylko właściwe obiekty do pozostałych warstw."
     },
     {
      "title": "Poprawiony plik i eksport",
      "instruction": "Po jednej uwadze do układu popraw odstęp albo położenie podpisu. Zapisz .vectorcraft i wyeksportuj SVG oraz PNG. Otwórz oba eksporty.",
      "check": "Układ i kolory zgadzają się z kopią roboczą, a w SVG nie brakuje ścian ani podpisu.",
      "help": "W parze możecie porównać czytelność nakładania. Bez pary sprawdź sam, ukrywając przedni obiekt i przywracając go."
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
   "Czy ten rysunek nadaje się jako gotowy model do drukarki 3D?",
   "Ilustracja 2D nie opisuje objętości bryły. Modele 3D wymagają innego narzędzia i osobnego projektu.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g104-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-104-nazwisko.vectorcraft oraz eksport SVG i PNG",
    "criteria": [
     {
      "label": "Trzy spójne ściany",
      "points": 2,
      "description": "0: brak pudełka; 1: ściany są, ale krawędzie się rozchodzą; 2: stykają się bez luk i zachowują konsekwentne odcienie."
     },
     {
      "label": "Kopie i przekształcenia",
      "points": 2,
      "description": "0: tylko oryginał; 1: jest kopia, ale rozciągnięta albo obrócona częściowo; 2: proporcjonalna kopia i kopia obrócona jako grupa."
     },
     {
      "label": "Warstwy i kolejność",
      "points": 2,
      "description": "0: wszystko na jednej warstwie; 1: część nazw lub elementów źle przypisana; 2: Tło, Pudełka i Opisy działają oddzielnie, a nakładanie jest celowe."
     },
     {
      "label": "Poprawka i eksporty",
      "points": 2,
      "description": "0: brak plików; 1: jeden format lub brak widocznej poprawki; 2: plik roboczy, SVG i PNG otwierają się, uczeń wskazuje poprawiony element."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g104-export",
    "question": "Czy ten rysunek nadaje się jako gotowy model do drukarki 3D?",
    "options": [
     "Tak, bo wygląda przestrzennie",
     "Nie — to płaskie figury tworzące wrażenie przestrzeni",
     "Tak, jeśli zmienisz nazwę SVG na STL"
    ],
    "correct": [
     1
    ],
    "explanation": "Ilustracja 2D nie opisuje objętości bryły. Modele 3D wymagają innego narzędzia i osobnego projektu.",
    "hint": "Ilustracja 2D nie opisuje objętości bryły. Modele 3D wymagają innego narzędzia i osobnego projektu."
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
   "Jaką kolejność obiektów wybrałeś i dlaczego ten rysunek nadal jest grafiką 2D?",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g104-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g104-recall",
     "g104-model",
     "g104-export"
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
    "id": "g104-exit",
    "question": "Jaką kolejność obiektów wybrałeś i dlaczego ten rysunek nadal jest grafiką 2D?",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "104",
 "grade": 1,
 "order": 39,
 "workspace": "desktop-vectorcraft",
 "title": "Rysowanie przestrzenne, przekształcenia i warstwy w programie Inkscape",
 "subtitle": "VectorCraft na komputerze: Narysujesz układ pudełek z płaskich figur, uporządkujesz warstwy i sprawdzisz przekształcenia.",
 "topic": "Rysunek przestrzenny 2D, kopiowanie, skala, obrót, kolejność i warstwy",
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
  "grouping": "Samodzielnie na własnej kopii. Porównanie eksportów w parze jest opcją; bez pary uczeń przełącza obie wersje sam.",
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
    "name": "Problem, przypadek, projekt",
    "url": "https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"
   }
  ]
 },
 "objectives": [
  "Buduję wrażenie przestrzeni z płaskich figur.",
  "Kopiuję, skaluję i obracam obiekt bez utraty edytowalności.",
  "Porządkuję rysunek na nazwanych warstwach i eksportuję SVG."
 ],
 "materials": [
  "VectorCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-104-nazwisko.vectorcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: VectorCraft 0.17.0, alfa. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. Unikamy masek Ctrl+7 (#4120); warstwy dodajemy po zakończeniu edycji tekstu (#4118), a projekty pozostają małe (#4145). DO WERYFIKACJI w pracowni: Inkscape, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Rysowanie przestrzenne realizujemy trzema płaskimi ścianami i przekształceniem grup. Nie wymagamy Revolve, Extrude ani modelowania 3D. Układ warstw z importu SVG nie jest zakładany; uczeń tworzy nazwane warstwy w programie.",
  "summary": "Produkt: lesson-104-nazwisko.vectorcraft oraz SVG i PNG. Rysunek przestrzenny 2D, kopiowanie, skala, obrót, kolejność i warstwy. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Jaką kolejność obiektów wybrałeś i dlaczego ten rysunek nadal jest grafiką 2D?"
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
