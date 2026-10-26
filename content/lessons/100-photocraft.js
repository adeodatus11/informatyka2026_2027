// Klasa 1; tytuł wg rozkładu, praktyka w PhotoCraft. Bez edytora na platformie.
import {note} from '../schema.js';
const plan = [
 {
  "id": "start",
  "label": "Start",
  "title": "Cel i własna kopia",
  "intro": "Wytniesz fikcyjną paczkę z tła i zrobisz oznaczony fotomontaż, zachowując możliwość poprawy krawędzi.",
  "grouping": "solo",
  "reading": {
   "title": "Zasada: Cel i własna kopia",
   "paragraphs": [
    "Na poprzedniej lekcji Tło, Pad i Tytuł były oddzielnymi warstwami. Teraz ukryjesz część jednej warstwy, zachowując jej piksele.",
    "Pracujesz na autorskiej ilustracji paczki. Fotomontaż może zmieniać odbiór obrazu; oznaczysz zmianę zamiast przedstawiać ją jako zdjęcie prawdziwego zdarzenia."
   ]
  },
  "time": 4,
  "notes": [
   "Zadaj pytanie z poprzedniej lekcji bez notatek. Po odpowiedzi uczniowie czytają wyjaśnienie. Sprawdź, czy każdy ma własną kopię pliku; nie uruchamiaj instalacji w czasie zajęć.",
   "Z lekcji 99: co robi wyłączenie widoczności warstwy?",
   "Widoczność zmienia podgląd, nie usuwa zawartości. Maska działa podobnie na fragment warstwy.",
   "Uczeń zmienia oryginał albo myli podgląd pliku z edytorem. Poproś o pokazanie nazwy i folderu kopii.",
   "Szybsi opisują, komu przyda się gotowy obraz.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g100-recall",
    "question": "Z lekcji 99: co robi wyłączenie widoczności warstwy?",
    "options": [
     "Usuwa warstwę na zawsze",
     "Ukrywa ją, ale zachowuje treść",
     "Zapisuje PNG"
    ],
    "correct": [
     1
    ],
    "explanation": "Widoczność zmienia podgląd, nie usuwa zawartości. Maska działa podobnie na fragment warstwy.",
    "hint": "Widoczność zmienia podgląd, nie usuwa zawartości. Maska działa podobnie na fragment warstwy."
   },
   {
    "type": "download",
    "id": "g100-object",
    "file": "materials/grafika/100-paczka.png",
    "label": "Pobierz paczkę na tle (.png)",
    "title": "Pobierz paczkę na tle (.png)",
    "description": "900 × 600 px; otwórz kopię w PhotoCraft. Obiekt ma prosty wielokątny obrys."
   },
   {
    "type": "download",
    "id": "g100-bg",
    "file": "materials/grafika/100-tlo.png",
    "label": "Pobierz nowe tło (.png)",
    "title": "Pobierz nowe tło (.png)",
    "description": "900 × 600 px; wklej jako warstwę pod paczką."
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
    "Selekcja wskazuje obszar, na którym ma działać operacja. Prostokąt pasuje do prostokąta, elipsa do koła, a lasso wielokątne do prostego obrysu paczki.",
    "Maska warstwy steruje widocznością: biały obszar pokazuje, czarny ukrywa. Nie jest gumką. Zaznaczenie można wykorzystać do utworzenia maski; w tym zadaniu nie używamy masek filtrów ani automatycznego usuwania tła."
   ]
  },
  "time": 7,
  "notes": [
   "Modelowanie: mów na głos, dlaczego wybierasz warstwę, narzędzie lub format. Po pokazie zakryj wzór. Zbierz odpowiedź wszystkich na pytanie: ponad 70% dobrze — praca własna; 30–70% — dwa uzasadnienia i ponowna próba; poniżej 30% — powtórz tylko trudny krok na innych danych.",
   "Chcesz móc poprawić krawędź paczki po zmianie tła. Co wybrać?",
   "Maska pozwala odzyskać ukryty fragment bez odtwarzania oryginalnych pikseli.",
   "Uczeń kopiuje ruchy myszki bez sprawdzenia, jaki obiekt lub warstwa są aktywne. Poproś o wskazanie celu zmiany.",
   "Przed kolejnym kliknięciem przewidź widoczny efekt.",
   false
  ],
  "activities": [
   {
    "type": "choice",
    "id": "g100-model",
    "question": "Chcesz móc poprawić krawędź paczki po zmianie tła. Co wybrać?",
    "options": [
     "Kasowanie tła i nadpisanie oryginału",
     "Spłaszczenie przed selekcją",
     "Maskę warstwy na kopii"
    ],
    "correct": [
     2
    ],
    "explanation": "Maska pozwala odzyskać ukryty fragment bez odtwarzania oryginalnych pikseli.",
    "hint": "Maska pozwala odzyskać ukryty fragment bez odtwarzania oryginalnych pikseli."
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
    "Selekcja wskazuje obszar, na którym ma działać operacja. Prostokąt pasuje do prostokąta, elipsa do koła, a lasso wielokątne do prostego obrysu paczki.",
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
    "id": "g100-build",
    "title": "Wykonaj w PhotoCraft",
    "steps": [
     {
      "title": "Kopia i selekcja",
      "instruction": "Otwórz 100-paczka.png, zapisz lesson-100-nazwisko.pcraft. Nazwij warstwę Paczka. Lassem wielokątnym obrysuj zewnętrzne narożniki paczki i zamknij zaznaczenie w punkcie startu.",
      "check": "Zaznaczenie obejmuje cały obiekt, a nie całe tło.",
      "help": "Powiększ obraz przed wskazywaniem narożników. Po pomyłce cofnij ostatni punkt zamiast kasować piksele."
     },
     {
      "title": "Zaznaczenie staje się maską",
      "instruction": "Dla warstwy Paczka utwórz maskę pokazującą zaznaczenie. Obejrzyj rezultat na przezroczystości. Zachowaj oryginalną zawartość warstwy.",
      "check": "Przy warstwie widać miniaturę maski. Po ukryciu tła przezroczysty jest obszar poza paczką.",
      "help": "Jeśli znika paczka, maska pokazuje tło: odwróć zaznaczenie lub maskę zgodnie z pokazem nauczyciela. Nie usuwaj warstwy."
     },
     {
      "title": "Nowe tło pod obiektem",
      "instruction": "Otwórz 100-tlo.png, skopiuj obraz i wklej jako osobną warstwę pod Paczką. Nazwij ją Nowe tło. Dodaj osobną warstwę tekstową: FOTOMONTAŻ — ZMIENIONE TŁO.",
      "check": "Paczka jest na zielonym tle, a podpis wyjaśnia zmianę.",
      "help": "Jeżeli nowe tło zasłania obiekt, przesuń jego warstwę poniżej Paczki."
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
    "Nowe tło ujawnia jasną obwódkę, której nie było widać na oryginale. Popraw maskę, a nie kształt samej paczki.",
    "Po ukryciu Nowego tła eksport PNG ma przezroczyste otoczenie. Po włączeniu tła drugi PNG pokazuje podpisany fotomontaż."
   ]
  },
  "time": 10,
  "notes": [
   "Zostaw co najmniej siedem minut na poprawę. Podaj każdemu jedną uwagę do jawnego kryterium, np. K2: brzeg albo K3: czytelność. Uczeń poprawia plik i porównuje eksporty. Każdy poprawia sam; sąsiad może podpowiedzieć pytaniem, bez przejmowania klawiatury.",
   "Która zmiana poprawiła wynik i jak to sprawdziłeś?",
   "Po ukryciu Nowego tła eksport PNG ma przezroczyste otoczenie. Po włączeniu tła drugi PNG pokazuje podpisany fotomontaż.",
   "Uczeń zaczyna od nowa zamiast poprawić wskazany fragment. Wskaż jedno kryterium i daj czas na drugą próbę.",
   "Dla chętnych: wyeksportuj dodatkowy rozmiar i porównaj czytelność.",
   false
  ],
  "activities": [
   {
    "type": "wordSteps",
    "id": "g100-improve",
    "title": "Popraw, wyeksportuj i otwórz wynik",
    "steps": [
     {
      "title": "Popraw jeden brzeg",
      "instruction": "Powiększ do około 200%. Wskaż miniaturę maski warstwy Paczka. Małym pędzlem usuń z maski pozostałość tła; bielą odzyskaj fragment obiektu, jeśli schowałeś za dużo.",
      "check": "Brzeg jest ciągły, bez dużej jasnej obwódki i bez obciętych narożników.",
      "help": "Jeśli malujesz kolor po paczce, aktywna jest zawartość warstwy zamiast miniatury maski. Cofnij i wybierz maskę."
     },
     {
      "title": "Dwa eksporty",
      "instruction": "Zapisz kopię roboczą. Wyłącz warstwę Nowe tło i podpis, wyeksportuj lesson-100-obiekt.png z przezroczystością. Włącz je i wyeksportuj lesson-100-montaz.png. Otwórz oba w podglądzie.",
      "check": "Pierwszy PNG ma przezroczyste otoczenie; drugi ma nowe tło i czytelny podpis.",
      "help": "JPEG nie przechowuje przezroczystości. Dla wyciętego obiektu wybierz PNG i włącz eksport przezroczystości."
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
   "Dlaczego trzeba oznaczyć zmianę tła?",
   "Technicznie poprawny montaż może wprowadzać w błąd. Oznaczenie mówi odbiorcy, co zmieniono — to most do lekcji o fake newsach.",
   "Uczeń ocenia sam wygląd miniatury, nie otwiera pliku roboczego albo myli deklarację z weryfikacją.",
   "Sprawdź, czy wynik wygląda równie czytelnie w mniejszym podglądzie.",
   false
  ],
  "activities": [
   {
    "type": "wordRubric",
    "id": "g100-rubric",
    "title": "Samoocena pliku — 0–8 pkt",
    "filename": "lesson-100-nazwisko.pcraft oraz eksport PNG",
    "criteria": [
     {
      "label": "Selekcja obiektu",
      "points": 2,
      "description": "0: brak lub zaznaczone samo tło; 1: obiekt częściowo obcięty; 2: obrys obejmuje paczkę z zachowaniem wszystkich narożników."
     },
     {
      "label": "Maska i poprawiony brzeg",
      "points": 2,
      "description": "0: tylko skasowane piksele; 1: maska jest, ale pozostała duża obwódka lub ubytek; 2: maska zachowana, brzeg poprawiony przy powiększeniu."
     },
     {
      "label": "Uczciwy fotomontaż",
      "points": 2,
      "description": "0: brak nowego tła lub oznaczenia; 1: nowe tło jest, ale podpis trudno odczytać; 2: podpis FOTOMONTAŻ — ZMIENIONE TŁO wyjaśnia ingerencję."
     },
     {
      "label": "Kopia i dwa eksporty",
      "points": 2,
      "description": "0: brak zapisu; 1: tylko kopia lub jeden eksport; 2: plik z maską, przezroczysty PNG i podpisany montaż otwierają się poprawnie."
     }
    ]
   },
   {
    "type": "choice",
    "id": "g100-export",
    "question": "Dlaczego trzeba oznaczyć zmianę tła?",
    "options": [
     "Bo montaż może sugerować miejsce lub sytuację, których nie było",
     "Bo bez podpisu PNG nie działa",
     "Bo maska automatycznie potwierdza prawdziwość obrazu"
    ],
    "correct": [
     0
    ],
    "explanation": "Technicznie poprawny montaż może wprowadzać w błąd. Oznaczenie mówi odbiorcy, co zmieniono — to most do lekcji o fake newsach.",
    "hint": "Technicznie poprawny montaż może wprowadzać w błąd. Oznaczenie mówi odbiorcy, co zmieniono — to most do lekcji o fake newsach."
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
   "Co poprawiłeś w masce i dlaczego zmiana tła wymaga oznaczenia?",
   "Uczeń wskazuje jedną konkretną zmianę i test, którym potwierdził poprawę.",
   "Uczeń pokazuje tylko punkty quizu. Poproś o otwarcie eksportu i edytowalnej kopii.",
   "Wróć do jednego pytania, które było najtrudniejsze na początku.",
   false
  ],
  "activities": [
   {
    "type": "resultCard",
    "id": "g100-result",
    "title": "Wynik pytań na platformie",
    "hideGrade": true,
    "sources": [
     "g100-recall",
     "g100-model",
     "g100-export"
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
    "id": "g100-exit",
    "question": "Co poprawiłeś w masce i dlaczego zmiana tła wymaga oznaczenia?",
    "minLength": 20,
    "placeholder": "Zmieniłem…, ponieważ… Sprawdziłem…",
    "explanation": "Nazwij narzędzie lub ustawienie i widoczny efekt. Pokaż odpowiedź oraz plik nauczycielowi; strona niczego nie wysyła."
   }
  ]
 }
];
export default {...{
 "id": "100",
 "grade": 1,
 "order": 16,
 "workspace": "desktop-photocraft",
 "title": "Stosowanie narzędzi selekcji w programie GIMP",
 "subtitle": "PhotoCraft na komputerze: Wytniesz fikcyjną paczkę z tła i zrobisz oznaczony fotomontaż, zachowując możliwość poprawy krawędzi.",
 "topic": "Selekcja, maska warstwy, brzeg obiektu i uczciwe oznaczenie fotomontażu",
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
   },
   {
    "name": "Problem, przypadek, projekt",
    "url": "https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"
   }
  ]
 },
 "objectives": [
  "Dobieram selekcję do prostego obiektu.",
  "Tworzę maskę warstwy zamiast kasować oryginał.",
  "Poprawiam brzeg i oznaczam zmienione tło."
 ],
 "materials": [
  "PhotoCraft stacjonarny dla Windows, zainstalowany i sprawdzony przez administratora.",
  "Pliki z etapu Start; wszystko lokalnie, bez konta i subskrypcji.",
  "Folder ucznia na kopię roboczą lesson-100-nazwisko.pcraft i eksport."
 ],
 "teacherGuide": {
  "preparation": "Weryfikacja źródeł 25.10.2026: PhotoCraft 0.16.0, early alpha. Szczegóły: docs/artcraft-desktop.md. Wersji nie sprawdzono na Windows 11 pracowni. Przed zajęciami administrator sprawdza otwieranie materiałów, zapis kopii i eksport na zwykłym koncie ucznia. PhotoCraft #9508 zgłasza crash 0.16.0 przy otwieraniu plików; jeśli próba nie przechodzi, wybierz sprawdzoną starszą wersję lub GIMP. DO WERYFIKACJI w pracowni: GIMP, jeśli zainstalowany. Pokaż odpowiednik narzędzia i zachowaj produkt/kryteria. Bez działającego edytora przełóż praktykę; quiz jej nie zastępuje. Wybierz maskę zwykłej warstwy, nie Smart Filter. Automatyczna segmentacja, AI i skomplikowane włosy nie należą do zadania. Paczka ma sześć prostych wierzchołków obrysu.",
  "summary": "Produkt: lesson-100-nazwisko.pcraft oraz PNG. Selekcja, maska warstwy, brzeg obiektu i uczciwe oznaczenie fotomontażu. Ocenę ustal po obejrzeniu pliku; rubryka 0–8 to samoocena, a karta z 3 pkt dotyczy wyłącznie pytań. Źródła obrazów: public/materials/grafika/README.md; wszystkie materiały są autorskie (CC0)."
 },
 "exitTicket": "Co poprawiłeś w masce i dlaczego zmiana tła wymaga oznaczenia?"
},
 sections:plan.map(({time,notes,...section})=>({...section,...note(time,...notes)}))
};
