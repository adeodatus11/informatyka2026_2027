// Klasa 1; tytuł wg rozkładu, praktyka w VectorCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Narysujesz własny znak kierunku z figur i ścieżki, a potem poprawisz go jednym punktem.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "W lekcji 102 zbudowałeś ikonę z gotowych figur. Ścieżka pozwoli zrobić kształt, którego nie ma w zestawie prostokątów i kół.",
    "Starter pokazuje dwie łamane: jedną otwartą i jedną zamkniętą. Nie musisz mieć pliku z poprzednich zajęć."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z lekcji 102: czym jest obrys figury?",
   "Obrys biegnie po krawędzi, a wypełnienie leży wewnątrz kształtu.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g103-recall",
    "question": "Z lekcji 102: czym jest obrys figury?",
    "options": [
     "Jej krawędzią",
     "Nazwą folderu",
     "Zawsze wypełnieniem wnętrza"
    ],
    "correct": [
     0
    ],
    "explanation": "Obrys biegnie po krawędzi, a wypełnienie leży wewnątrz kształtu.",
    "hint": "Obrys biegnie po krawędzi, a wypełnienie leży wewnątrz kształtu."
   },
   {
    "type": "download",
    "id": "g103-file",
    "file": "materials/grafika/103-sciezka.svg",
    "label": "Pobierz starter ścieżek (.svg)",
    "title": "Pobierz starter ścieżek (.svg)",
    "description": "Otwartą łamaną porównasz z zamkniętą. Potem utworzysz własny znak obok lub na nowym obszarze dokumentu."
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
    "Ścieżka łączy punkty odcinkami lub krzywymi. Zaznaczanie bezpośrednie pozwala poprawić pojedynczy punkt, a nie przesuwać cały obiekt.",
    "Zamknięcie ścieżki łączy koniec z początkiem. Przy własnym znaku dobierz celowo wypełnienie i obrys; przypadkowe otwarcie może dać inną krawędź, niż planowałeś."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Chcesz wydłużyć tylko czubek strzałki. Co wybierzesz?",
   "Przesunięcie jednego punktu zmienia lokalny fragment. Przenoszenie całego obiektu nie zmieni jego proporcji.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g103-model",
    "question": "Chcesz wydłużyć tylko czubek strzałki. Co wybierzesz?",
    "options": [
     "Cały dokument",
     "Pojedynczy punkt ścieżki narzędziem zaznaczania bezpośredniego",
     "Eksport JPEG"
    ],
    "correct": [
     1
    ],
    "explanation": "Przesunięcie jednego punktu zmienia lokalny fragment. Przenoszenie całego obiektu nie zmieni jego proporcji.",
    "hint": "Przesunięcie jednego punktu zmienia lokalny fragment. Przenoszenie całego obiektu nie zmieni jego proporcji."
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
    "Ścieżka łączy punkty odcinkami lub krzywymi. Zaznaczanie bezpośrednie pozwala poprawić pojedynczy punkt, a nie przesuwać cały obiekt.",
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
    "id": "g103-build",
    "title": "Wykonaj w VectorCraft",
    "steps": [
     {
      "title": "Otwórz i sprawdź dwa przykłady",
      "instruction": "Otwórz 103-sciezka.svg, zapisz lesson-103-nazwisko.vectorcraft. Wskaż końce lewej otwartej łamanej i zamknięty obrys po prawej.",
      "check": "Umiesz wskazać brakujący odcinek, a nie tylko różnicę koloru.",
      "help": "Wypełnienie może wizualnie sugerować zamknięcie. Obejrzyj punkty i obrys ścieżki."
     },
     {
      "title": "Narysuj własną strzałkę",
      "instruction": "Obok przykładów lub na nowym obszarze narysuj piórem zamkniętą strzałkę w prawo z co najmniej pięciu punktów. Kliknięciem punktu początkowego zamknij obrys. Ustaw wypełnienie i kontrastowy obrys.",
      "check": "Strzałka jest jednym zamkniętym kształtem, a nie kilkoma niezłączonymi kreskami.",
      "help": "Na pierwszy raz wystarczą odcinki proste. Nie musisz od razu sterować uchwytami krzywych."
     },
     {
      "title": "Dodaj figurę tła",
      "instruction": "Narysuj prostokąt jako tabliczkę. Przesuń go za strzałkę. Dopasuj margines wokół znaku, nie ściskając strzałki.",
      "check": "Strzałka i prostokąt są oddzielnymi obiektami; znak nie dotyka krawędzi tła.",
      "help": "Jeśli tło zasłania strzałkę, popraw kolejność obiektów zamiast rysować znak drugi raz."
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
    "Odbiorca mówi: „kierunek widać, ale czubek jest za krótki”. Zrób poprawkę na kopii znaku, zmieniając punkt ścieżki.",
    "Pokaż różnicę przed i po. Obrys ma pozostać zamknięty i nie może sam się przecinać."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Każdy poprawia sam; sąsiad może podpowiedzieć pytaniem, bez przejmowania klawiatury.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Pokaż różnicę przed i po. Obrys ma pozostać zamknięty i nie może sam się przecinać.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g103-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Popraw konkretny punkt",
      "instruction": "Zduplikuj znak obok. Narzędziem zaznaczania bezpośredniego wybierz sam punkt czubka i przesuń go w prawo. Jeśli trzeba, dopasuj sąsiednie punkty.",
      "check": "Zmienia się kształt czubka, a nie położenie całej strzałki.",
      "help": "Jeśli porusza się wszystko, aktywne jest zwykłe zaznaczanie. Wybierz narzędzie do punktów."
     },
     {
      "title": "Kontrola i eksport",
      "instruction": "Sprawdź zamknięcie, margines, wypełnienie i obrys. Zapisz .vectorcraft. Wyeksportuj SVG i PNG, otwórz je i sprawdź czubek przy większym powiększeniu.",
      "check": "Własna strzałka pozostaje ścieżką w pliku roboczym; eksport ma kompletny obrys.",
      "help": "Jeżeli eksport zawiera tylko przykłady ze startera, ustaw właściwy obszar eksportu lub usuń przykłady z kopii przeznaczonej do publikacji."
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
   "Co jest lepszym dowodem, że strzałka jest edytowalną ścieżką?",
   "Nazwa i deklaracja nie pokazują budowy obiektu. Punkty i lokalna poprawka pozwalają ją obejrzeć.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g103-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-103-nazwisko.vectorcraft oraz eksport SVG i PNG",
    "criteria": [
     {
      "label": "Zamknięta własna ścieżka",
      "points": 2,
      "description": "0: brak własnej strzałki; 1: kształt jest, ale otwarty lub z osobnych kresek; 2: jedna zamknięta ścieżka z co najmniej pięcioma punktami."
     },
     {
      "label": "Poprawa punktu",
      "points": 2,
      "description": "0: tylko przesunięcie całości; 1: punkt zmieniony, ale obrys uszkodzony; 2: poprawiony sam czubek, obrys zamknięty bez samoprzecięcia."
     },
     {
      "label": "Figury i czytelność",
      "points": 2,
      "description": "0: brak tła lub kierunku; 1: znak czytelny, ale zły margines/obrys; 2: osobny prostokąt pod strzałką, czytelny kierunek i równy margines."
     },
     {
      "label": "Plik i eksport",
      "points": 2,
      "description": "0: brak zapisu; 1: tylko jeden format lub eksport złego obszaru; 2: natywny plik, SVG i PNG z własnym znakiem otwierają się poprawnie."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g103-export",
    "question": "Co jest lepszym dowodem, że strzałka jest edytowalną ścieżką?",
    "options": [
     "Nazwanie pliku strzalka.svg",
     "Pokazanie punktów i przesunięcie jednego z nich w pliku roboczym",
     "Zaznaczenie checklisty"
    ],
    "correct": [
     1
    ],
    "explanation": "Nazwa i deklaracja nie pokazują budowy obiektu. Punkty i lokalna poprawka pozwalają ją obejrzeć.",
    "hint": "Nazwa i deklaracja nie pokazują budowy obiektu. Punkty i lokalna poprawka pozwalają ją obejrzeć."
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
   "Który punkt zmieniłeś i po czym poznajesz, że ścieżka nadal jest zamknięta?",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g103-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g103-recall",
     "g103-model",
     "g103-export"
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
    "id": "g103-exit",
    "question": "Który punkt zmieniłeś i po czym poznajesz, że ścieżka nadal jest zamknięta?",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "103",
 "grade": 1,
 "order": 38,
 "workspace": "desktop-vectorcraft",
 "title": "Rysowanie figur i ścieżek w programie Inkscape",
 "subtitle": "VectorCraft na komputerze: Narysujesz własny znak kierunku z figur i ścieżki, a potem poprawisz go jednym punktem.",
 "topic": "Figury, zamknięta ścieżka, punkty, wypełnienie i obrys",
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
   },
   {
    "name": "Metapoznanie",
    "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
   }
  ]
 },
 "objectives": [
  "Odróżniam figurę od otwartej i zamkniętej ścieżki.",
  "Rysuję zamkniętą ścieżkę i poprawiam jej punkt.",
  "Łączę ścieżkę z figurą w czytelny znak."
 ],
 "materials": [
  "VectorCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-103-nazwisko.vectorcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: VectorCraft 0.17.0, alfa. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. Unikamy masek Ctrl+7 (#4120); warstwy dodajemy po zakończeniu edycji tekstu (#4118), a projekty pozostają małe (#4145). DO WERYFIKACJI w pracowni: Inkscape, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Nie wymagamy operacji logicznych, efektów 3D ani automatycznego trasowania. Demonstracja nauczyciela może dotyczyć prostego trójkąta; uczeń buduje inny kształt — strzałkę.",
  "summary": "Produkt: lesson-103-nazwisko.vectorcraft oraz SVG i PNG. Figury, zamknięta ścieżka, punkty, wypełnienie i obrys. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Który punkt zmieniłeś i po czym poznajesz, że ścieżka nadal jest zamknięta?"
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
