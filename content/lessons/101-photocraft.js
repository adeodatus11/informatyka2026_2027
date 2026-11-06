// Klasa 1; tytuł wg rozkładu, praktyka w PhotoCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Przygotujesz obraz produktu do internetu i małego wydruku: kadr, drobny retusz i kontrolowany eksport.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "Z lekcji 100 pamiętasz, że poprawki warto robić tak, aby zachować oryginał. Dziś pracujesz na samodzielnym pliku, bez konieczności posiadania poprzedniej pracy.",
    "Plik startowy to autorska studyjna ilustracja fikcyjnego głośnika, nie fotografia prawdziwego produktu. Ćwiczysz operacje używane przy zdjęciach; nie przedstawiaj ilustracji jako dowodu realnego wyglądu sprzętu."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z lekcji 100: po co zachować oryginał i robić poprawki na kopii?",
   "Kopia pozwala ocenić zakres zmiany i odzyskać szczegóły, których nie da się odtworzyć z mocno skompresowanego eksportu.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g101-recall",
    "question": "Z lekcji 100: po co zachować oryginał i robić poprawki na kopii?",
    "options": [
     "Żeby porównać zmianę i móc wrócić do źródła",
     "Żeby zawsze powiększyć obraz",
     "Żeby usunąć informację o autorze"
    ],
    "correct": [
     0
    ],
    "explanation": "Kopia pozwala ocenić zakres zmiany i odzyskać szczegóły, których nie da się odtworzyć z mocno skompresowanego eksportu.",
    "hint": "Kopia pozwala ocenić zakres zmiany i odzyskać szczegóły, których nie da się odtworzyć z mocno skompresowanego eksportu."
   },
   {
    "type": "download",
    "id": "g101-file",
    "file": "materials/grafika/101-produkt.png",
    "label": "Pobierz obraz produktu (.png)",
    "title": "Pobierz obraz produktu (.png)",
    "description": "1500 × 1000 px; autorska ilustracja. Mała plamka na podłodze jest celowym elementem do retuszu; nie usuwaj elementów głośnika."
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
    "Kadrowanie wybiera fragment obrazu. Zmiana rozmiaru przelicza liczbę pikseli. PPI opisuje gęstość wydruku: samo wpisanie większego PPI nie doda szczegółów.",
    "PNG zachowuje bezstratnie obraz i przezroczystość. JPEG kompresuje stratnie i nie zapisuje przezroczystości. Wielkość pliku zależy od treści i ustawień — JPEG nie zawsze musi być mniejszy od PNG."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Obraz ma 900 × 600 px. Zmieniasz tylko PPI, bez przeliczania pikseli. Co się stanie?",
   "PPI wiąże piksele z rozmiarem na papierze. Nie odtwarza szczegółów, których nie ma w pliku.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g101-model",
    "question": "Obraz ma 900 × 600 px. Zmieniasz tylko PPI, bez przeliczania pikseli. Co się stanie?",
    "options": [
     "Przybędzie szczegółów",
     "Liczba pikseli zostanie ta sama, zmieni się planowany rozmiar wydruku",
     "Powstanie grafika wektorowa"
    ],
    "correct": [
     1
    ],
    "explanation": "PPI wiąże piksele z rozmiarem na papierze. Nie odtwarza szczegółów, których nie ma w pliku.",
    "hint": "PPI wiąże piksele z rozmiarem na papierze. Nie odtwarza szczegółów, których nie ma w pliku."
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
    "Kadrowanie wybiera fragment obrazu. Zmiana rozmiaru przelicza liczbę pikseli. PPI opisuje gęstość wydruku: samo wpisanie większego PPI nie doda szczegółów.",
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
    "id": "g101-build",
    "title": "Wykonaj w PhotoCraft",
    "steps": [
     {
      "title": "Zachowaj źródło i ustaw kadr",
      "instruction": "Otwórz 101-produkt.png i zapisz lesson-101-nazwisko.pcraft. Zrób kopię warstwy, nazwij Oryginał i Korekta. Narzędziem kadrowania wybierz kadr w proporcji 3:2, zostawiając cały głośnik i mały margines.",
      "check": "Źródło nadal jest zapisane osobno, a produkt nie dotyka krawędzi kadru.",
      "help": "Nie powiększaj małego kadru do ogromnej liczby pikseli. Oryginał ma 1500 × 1000 px; po kadrowaniu zachowaj co najmniej 1200 × 800 px."
     },
     {
      "title": "Drobny retusz, bez zmiany produktu",
      "instruction": "Na warstwie Korekta usuń tylko małą okrągłą plamkę po lewej na podłodze narzędziem stempla klonującego. Wskaż czysty fragment podłogi jako źródło zgodnie z pokazem i podpowiedzią narzędzia.",
      "check": "Znika plamka, ale nie zmieniają się kształt, kolor i wyposażenie głośnika.",
      "help": "Mały pędzel i źródło blisko plamki ograniczają widoczną łatę. Jeżeli retusz zaczął zmieniać głośnik, cofnij go."
     },
     {
      "title": "Umiarkowana korekta",
      "instruction": "Dodaj prostą korektę jasności/kontrastu lub warstwę dopasowania. Porównuj z Oryginałem. Zapisz kopię roboczą.",
      "check": "Widać fakturę obudowy i granicę produktu; jasne miejsca nie znikają w bieli.",
      "help": "Jeśli cień stał się czarną plamą, zmniejsz kontrast. Nie wybieraj filtra tylko dlatego, że daje mocny efekt."
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
    "Przygotuj wersję internetową 900 × 600 px oraz większą kopię do wydruku. Zmniejszaj wyłącznie eksport; nie nadpisuj edytowalnego źródła.",
    "Wersja do małego wydruku: kadr 1200 × 800 px przy 300 PPI daje około 10,2 × 6,8 cm. To umowny cel ćwiczenia, nie wymaganie każdej drukarni. Porównaj oba eksporty na ekranie przy 100%."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Chętne pary porównują dwa eksporty według kryterium; bez pary uczeń sprawdza sam, przełączając wersje. Nie wymuszaj ról.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Wersja do małego wydruku: kadr 1200 × 800 px przy 300 PPI daje około 10,2 × 6,8 cm. To umowny cel ćwiczenia, nie wymaganie każdej drukarni. Porównaj oba eksporty na ekranie przy 100%.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g101-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Dwa formaty do internetu",
      "instruction": "Wyeksportuj kopie 900 × 600 px: lesson-101-www.png oraz lesson-101-www.jpg. Dla JPEG wybierz średnią lub wysoką jakość, potem obejrzyj krawędzie przy 100% i odczytaj wagę obu plików z ich właściwości.",
      "check": "Oba pliki mają 900 × 600 px. Wybierasz mniejszy tylko wtedy, gdy nie psuje widocznych detali.",
      "help": "Nie zakładaj z góry, że JPG będzie mniejszy; ilustracje o płaskich polach potrafią dobrze kompresować się w PNG."
     },
     {
      "title": "Kopia do małego wydruku",
      "instruction": "Z większej wersji roboczej wyeksportuj PNG 1200 × 800 px; nazwij lesson-101-druk.png. Dla planowania wydruku przyjmij 300 PPI. Obok zapisz notatkę: około 10,2 × 6,8 cm.",
      "check": "Masz większy plik do wydruku i mniejszy do WWW. Nie powiększasz pliku 900 px, aby odzyskać 1200 px.",
      "help": "Jeśli kadr ma mniej niż 1200 × 800 px, wróć do źródła i wybierz szerszy kadr. Samo zwiększenie PPI nie odzyska pikseli."
     },
     {
      "title": "Popraw po oględzinach",
      "instruction": "Porównaj wersję roboczą z eksportem i popraw jeden zauważony problem: obcięty brzeg, zbyt mocny kontrast albo artefakty JPEG. Zapisz ponownie.",
      "check": "Potrafisz wskazać konkretną różnicę przed i po poprawce.",
      "help": "Chcesz porównania w parze? Pokaż tylko dwa eksporty i poproś o wskazanie czytelniejszego detalu. Sam sprawdzisz to, przełączając obrazy."
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
   "JPEG jest mniejszy, ale wokół krawędzi widać kwadraty i poświatę. Co zrobisz?",
   "Liczą się czytelne detale i rozsądna waga. Samo przemianowanie rozszerzenia nie zmienia formatu.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g101-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-101-nazwisko.pcraft oraz eksport PNG",
    "criteria": [
     {
      "label": "Kadr i zachowany oryginał",
      "points": 2,
      "description": "0: oryginał nadpisany lub produkt ucięty; 1: kopia jest, ale kadr zostawia problem; 2: źródło zachowane, cały produkt w kadrze 3:2 z marginesem."
     },
     {
      "label": "Retusz i umiarkowana korekta",
      "points": 2,
      "description": "0: brak poprawy albo zmieniony produkt; 1: jedna operacja poprawna; 2: usunięta tylko plamka, korekta zachowuje szczegóły."
     },
     {
      "label": "Wersje WWW",
      "points": 2,
      "description": "0: brak eksportów; 1: jeden format lub zły rozmiar; 2: PNG i JPG 900 × 600 px, porównane wagi i krawędzie przy 100%."
     },
     {
      "label": "Kopia do wydruku i poprawa",
      "points": 2,
      "description": "0: brak większego pliku; 1: plik jest, ale powiększony z małej kopii albo bez kontroli; 2: 1200 × 800 px z większego źródła, wyjaśnione PPI i wskazana poprawka."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g101-export",
    "question": "JPEG jest mniejszy, ale wokół krawędzi widać kwadraty i poświatę. Co zrobisz?",
    "options": [
     "Wyślesz go, bo waga jest jedynym kryterium",
     "Zmienisz rozszerzenie na .png bez eksportu",
     "Zwiększysz jakość albo wybierzesz PNG i ponownie obejrzysz wynik"
    ],
    "correct": [
     2
    ],
    "explanation": "Liczą się czytelne detale i rozsądna waga. Samo przemianowanie rozszerzenia nie zmienia formatu.",
    "hint": "Liczą się czytelne detale i rozsądna waga. Samo przemianowanie rozszerzenia nie zmienia formatu."
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
   "Dlaczego wybrany format nadaje się do Twojego obrazu? Podaj porównanie detalu i wagi pliku.",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g101-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g101-recall",
     "g101-model",
     "g101-export"
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
    "id": "g101-exit",
    "question": "Dlaczego wybrany format nadaje się do Twojego obrazu? Podaj porównanie detalu i wagi pliku.",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "101",
 "grade": 1,
 "order": 17,
 "workspace": "desktop-photocraft",
 "title": "Edycja zdjęć w programie GIMP",
 "subtitle": "PhotoCraft na komputerze: Przygotujesz obraz produktu do internetu i małego wydruku: kadr, drobny retusz i kontrolowany eksport.",
 "topic": "Kadrowanie, retusz kopii, jasność/kontrast, piksele, PPI i PNG/JPEG",
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
    "name": "Metapoznanie",
    "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
   }
  ]
 },
 "objectives": [
  "Kadruję i poprawiam obraz na kopii.",
  "Rozróżniam rozmiar w pikselach, PPI i wagę pliku.",
  "Porównuję eksport PNG i JPEG przed wyborem wersji."
 ],
 "materials": [
  "PhotoCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-101-nazwisko.pcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: PhotoCraft 0.16.0, early alpha. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. PhotoCraft #9508 zgłasza crash 0.16.0 przy otwieraniu plików; jeśli próba nie przechodzi, wybierz sprawdzoną starszą wersję lub GIMP. DO WERYFIKACJI w pracowni: GIMP, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Sprawdź stempel i korektę na małym materiale. Obraz źródłowy jest ilustracją, nie udawanym zdjęciem. Nauczyciel może dodatkowo pokazać własną fotografię przedmiotu bez danych osobowych. Wartości rozmiaru wydruku policzono: 1200/300 × 2,54 = 10,16 cm; 800/300 × 2,54 ≈ 6,77 cm.",
  "summary": "Produkt: lesson-101-nazwisko.pcraft oraz PNG. Kadrowanie, retusz kopii, jasność/kontrast, piksele, PPI i PNG/JPEG. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Dlaczego wybrany format nadaje się do Twojego obrazu? Podaj porównanie detalu i wagi pliku."
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
