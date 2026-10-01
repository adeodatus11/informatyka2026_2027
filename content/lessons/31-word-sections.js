export default {
  "id": "31",
  "grade": 1,
  "title": "Dzielenie dokumentu tekstowego",
  "topic": "Dzielenie dokumentu tekstowego",
  "subtitle": "Jedna szeroka tabela nie musi przewracać całego dokumentu. Zostań diagnostą układu stron.",
  "icon": "doc",
  "tags": [
    "Word na komputerze",
    "Dokument DOCX",
    "Praktyka"
  ],
  "duration": 45,
  "workspace": "desktop-word",
  "curriculum": "PP 2024 · zakres podstawowy · II.3.b — opracowanie dokumentów o różnorodnej tematyce; IV.1 — współpraca przy realizacji projektów i wymiana informacji.",
  "materials": [
    "Komputer z Microsoft Word dla Windows 2019/2021/2024 lub Microsoft 365; polecenia mogą mieć nieco inne etykiety w poszczególnych wydaniach.",
    "Przeglądarka z tą lekcją oraz pobrany dokument DOCX. Internet służy pobraniu materiałów; edycja odbywa się w Wordzie na komputerze.",
    "Własny folder roboczy. Zapisuj Ctrl+S; do oddania plików użyj kanału wskazanego przez nauczyciela. Platforma nie przesyła i nie sprawdza plików Word."
  ],
  "format": {
    "methods": [
      {
        "name": "Nauczanie jawne",
        "url": "https://metodyka.covepolska.pl/metoda-nauczanie-jawne.html"
      },
      {
        "name": "Tutoring rówieśniczy",
        "url": "https://metodyka.covepolska.pl/metoda-peer-tutoring.html"
      },
      {
        "name": "Metapoznanie",
        "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
      }
    ],
    "name": "Laboratorium usterek układu",
    "student": "Po krótkim pokazie naprawisz plan wydarzenia. W parze na zmianę obsługujecie Word i pytacie o dowód. Każdy kończy własny plik oraz samodzielny test.",
    "teacher": "Pokaż decyzję: „zmieniam układ części dokumentu, potrzebuję granic sekcji po obu stronach”. Po praktyce kierowanej uruchom tutoring wcześniej pokazanej procedury, zmień role po 6 minutach. Zatrzymaj klasę przy kontroli orientacji i zakończ samodzielnym przypadkiem.",
    "grouping": "Pokaz wspólny, potem pary przy własnych komputerach. Tutor zadaje pytania, nie przejmuje myszy. Samodzielnie: wykonaj obie rundy, odczytując pytania kontrolne."
  },
  "sections": [
    {
      "id": "problem",
      "label": "Problem",
      "title": "Problem — która granica?",
      "duration": 5,
      "intro": "Zlecenie: szeroki harmonogram ma zmieścić się na stronie poziomej, reszta dokumentu ma pozostać pionowa. Zanim klikniesz, przewidź rozwiązanie.",
      "activities": [
        {
          "type": "download",
          "id": "w31-download-start.docx",
          "file": "materials/word/lesson-31-start.docx",
          "label": "Pobierz dokument startowy DOCX",
          "description": "Materiał do pracy w zainstalowanym Wordzie. Zapisz kopię w swoim folderze lekcji."
        },
        {
          "type": "choice",
          "id": "w31-q1",
          "question": "Chcesz tylko zacząć rozdział na nowej stronie, bez zmiany marginesów, nagłówków ani orientacji. Co wybierasz?",
          "options": [
            "Kilka pustych akapitów Enter",
            "Podział strony (Ctrl+Enter)",
            "Zawsze nową sekcję"
          ],
          "correct": [
            1
          ],
          "explanation": "Podział strony przenosi tekst na nową stronę. Sekcja jest potrzebna do niezależnego układu, a puste akapity rozsypują się po dopisaniu tekstu.",
          "hint": "Czy zmieniasz ustawienia układu czy tylko miejsce początku tekstu?"
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Zbierz indywidualne przewidywania, potem wskaż różnicę między nową stroną a nowymi ustawieniami. Uczniowie zapisują kopię jako 31-sekcje.docx.",
      "askStudents": "Dlaczego Enter nie jest narzędziem do dzielenia stron?",
      "expectedAnswers": "Puste akapity przesuwają się po zmianie tekstu; podział strony zachowuje intencję autora.",
      "commonMistakes": "Uczniowie szukają sekcji w Wstawianie zamiast Układ.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "model",
      "label": "Model",
      "title": "Model — strona, sekcja, kolumna",
      "duration": 8,
      "intro": "Obserwuj pokaz i przewiduj wynik przed każdym kliknięciem. Potem znajdź te same narzędzia u siebie.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w31-model",
          "title": "Zobacz granice dokumentu",
          "steps": [
            {
              "title": "Znaki niedrukowane",
              "instruction": "Włącz Narzędzia główne → ¶ albo Ctrl+Shift+8. W pustym akapicie przed nowym fragmentem wstaw Ctrl+Enter, obejrzyj napis „Podział strony”, potem cofnij Ctrl+Z.",
              "check": "Widzisz różnicę między ¶ i podziałem strony.",
              "help": "Znaki ¶ są pomocą w edycji; nie drukują się."
            },
            {
              "title": "Dwa rodzaje sekcji",
              "instruction": "Otwórz Układ → Znaki podziału (w niektórych wersjach: Podziały). Znajdź Podziały sekcji: Następna strona i Ciągły. Nie wybieraj pozycji Strona z grupy Podziały stron.",
              "check": "Potrafisz wskazać oba polecenia sekcji.",
              "help": "Następna strona rozpoczyna sekcję na kolejnej stronie. Ciągły zmienia sekcję bez wymuszania nowej strony; przy zmianie orientacji Word potrzebuje nowej strony."
            }
          ]
        }
      ],
      "grouping": "class",
      "teacherNotes": "Modeluj jeden podział strony oraz dwie granice sekcji przy tabeli. Pytaj wszystkich, co zmieni się po ustawieniu orientacji.",
      "askStudents": "Ile granic trzeba, by środkowy fragment miał inny układ?",
      "expectedAnswers": "Zwykle dwie: przed fragmentem i za nim.",
      "commonMistakes": "Mylenie podziału strony z podziałem sekcji.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false,
      "reading": {
        "title": "Granica to ustawienie, nie ozdoba",
        "paragraphs": [
          "Dokument składa się z akapitów i może zawierać sekcje. Podział strony steruje miejscem rozpoczęcia tekstu, lecz nie tworzy oddzielnych ustawień układu. Sekcja może mieć własną orientację, marginesy, kolumny i nagłówki.",
          "Do pojedynczej strony poziomej użyj sekcji „Następna strona” przed nią i za nią. Do dwóch kolumn na części tej samej strony użyj sekcji ciągłych. Usunięcie granicy sekcji łączy części dokumentu i może zmienić ich układ — przed eksperymentem zapisz kopię.",
          "Nagłówek i stopka mogą być połączone z poprzednią sekcją. Rozłącza się je osobno. Przy włączonych opcjach innej pierwszej strony lub stron parzystych każdy typ nagłówka i stopki ma własne połączenie."
        ]
      }
    },
    {
      "id": "work",
      "label": "Warsztat",
      "title": "Warsztat — plan, który się mieści",
      "duration": 17,
      "intro": "Każdy pracuje w swoim pliku. Runda A (6 min): Ty wykonujesz orientację, partner pyta. Runda B (6 min): zamieńcie role przy drugim pliku. Ostatnie 5 min: każdy robi własny układ kolumn.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w31-work",
          "title": "Ustaw układ w Wordzie",
          "steps": [
            {
              "title": "Kopia i granice tabeli",
              "instruction": "Zapisz starter jako 31-sekcje.docx. Ustaw kursor przed nagłówkiem szerokiego harmonogramu. Wstaw Układ → Znaki podziału → Podziały sekcji → Następna strona. Za tabelą, w akapicie przed następnym tekstem, wstaw drugi taki podział.",
              "check": "W ¶ widzisz granicę przed harmonogramem i granicę za tabelą.",
              "help": "Nie wstawiaj podziału wewnątrz komórki. Kliknij w akapit za tabelą; jeśli go nie ma, przejdź na koniec ostatniej komórki klawiszami kierunkowymi i utwórz akapit poza tabelą."
            },
            {
              "title": "Tylko harmonogram poziomo",
              "instruction": "Kliknij wewnątrz sekcji harmonogramu, bez zaznaczania całego tekstu. Wybierz Układ → Orientacja → Pozioma. W razie potrzeby otwórz okno Ustawienia strony i ustaw „Zastosuj do: Ta sekcja”. Sprawdź poprzednią i następną sekcję; mają być pionowe.",
              "check": "Podgląd Plik → Drukuj pokazuje pion–poziom–pion.",
              "help": "Jeśli reszta też jest pozioma, sprawdź drugą granicę i ustaw sekcję za tabelą na Pionowa. Nie poprawiaj rozmiaru czcionki zamiast orientacji."
            },
            {
              "title": "Dwie kolumny na fragmencie",
              "instruction": "W części „Porady dla organizatorów” po tabeli wybierz wszystkie sześć akapitów wskazówek. Wstaw Ciągły podział sekcji przed pierwszym i po szóstym akapicie, przed „Zamknięcie dokumentu”. Kliknij między granicami, wybierz Układ → Kolumny → Dwie. W sekcji za nimi ustaw Jedna. Nagłówek tej części pozostaw poza kolumnami.",
              "check": "Tylko sześć akapitów porad są w kolumnach; dalszy tekst ma pełną szerokość.",
              "help": "W Układ → Kolumny → Więcej kolumn sprawdź „Zastosuj do: Ta sekcja”. Nie buduj kolumn spacjami lub tabelą."
            },
            {
              "title": "Przystanek tutora",
              "instruction": "Zapytaj partnera: „Gdzie są obie granice?”, „Co potwierdza, że reszta pozostała pionowa?”, „Jaki zakres dotyczy dwóch kolumn?”. Odpowiadaj pokazaniem miejsca w dokumencie.",
              "check": "Każdy potrafi wskazać dowód we własnym pliku.",
              "help": "Tutor pomaga pytaniem, nie wykonuje czynności za autora."
            }
          ]
        }
      ],
      "grouping": "pair",
      "teacherNotes": "Monitoruj trzy pary w każdej rundzie. Zatrzymaj wszystkich przed kolumnami: niech pokażą obie granice sekcji z tabelą. Jeśli brak drugiej granicy, krótki ponowny pokaz.",
      "askStudents": "Po czym wiesz, że zmiana dotyczy jednej sekcji?",
      "expectedAnswers": "Granice w ¶ i podgląd stron po obu stronach tabeli.",
      "commonMistakes": "Zaznaczenie całego dokumentu, brak granicy za tabelą.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "challenge",
      "label": "Wyzwanie",
      "title": "Wyzwanie — niezależny nagłówek",
      "duration": 9,
      "intro": "Teraz samodzielnie: sekcja harmonogramu ma mieć nagłówek „PLAN WYDARZENIA”, pozostałe „PORADNIK ORGANIZATORA”.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w31-header",
          "title": "Rozłącz tylko to, co zmieniasz",
          "steps": [
            {
              "title": "Nagłówek ogólny",
              "instruction": "Kliknij dwukrotnie górny margines pierwszej sekcji i wpisz PORADNIK ORGANIZATORA. Przejdź do nagłówka sekcji harmonogramu.",
              "check": "Widzisz etykietę sekcji w obszarze nagłówka.",
              "help": "Karta Nagłówek i stopka pojawia się podczas edycji nagłówka."
            },
            {
              "title": "Zabezpiecz sekcję następną",
              "instruction": "Najpierw w nagłówku sekcji bezpośrednio ZA harmonogramem wyłącz Połącz z poprzednim. Potem w nagłówku harmonogramu również wyłącz Połącz z poprzednim i wpisz PLAN WYDARZENIA. Zamknij edycję nagłówka.",
              "check": "Zmiana nagłówka harmonogramu nie zmieniła nagłówka przed nim ani za nim.",
              "help": "Gdy zmiana dotknęła kolejnych stron, cofnij tekst, rozłącz nagłówek następnej sekcji i powtórz. Nie wyłączaj stopki, jeśli numeracja ma być wspólna."
            },
            {
              "title": "Dowód jakości",
              "instruction": "W Plik → Drukuj przejrzyj wszystkie strony. Zapisz Ctrl+S. Partnerowi pokaż tylko wynik; sam wskaż dwie granice sekcji i wyjaśnij, dlaczego wybrano taki typ podziału.",
              "check": "Masz zapisany plik i potrafisz uzasadnić jego strukturę.",
              "help": "Pusta strona? Włącz ¶ i sprawdź zbędny podział strony obok podziału sekcji. Nie kasuj w ciemno granic sekcji."
            }
          ]
        },
        {
          "type": "choice",
          "id": "w31-q2",
          "question": "Dwie kolumny mają objąć tylko dwa akapity na tej samej stronie. Wybierasz…",
          "options": [
            "Podziały sekcji ciągłe przed i za nimi",
            "Dwa podziały strony",
            "Dwie serie spacji"
          ],
          "correct": [
            0
          ],
          "explanation": "Ciągłe granice pozwalają wydzielić fragment o innej liczbie kolumn bez wymuszania nowej strony.",
          "hint": "Potrzebujesz nowego układu, ale nie nowej strony."
        },
        {
          "type": "choice",
          "id": "w31-q3",
          "question": "Po zmianie nagłówka środkowej sekcji zmienił się też nagłówek kolejnej. Co sprawdzasz?",
          "options": [
            "Wielkość czcionki",
            "Połącz z poprzednim w nagłówku kolejnej sekcji",
            "Wyłącznie numerację stron"
          ],
          "correct": [
            1
          ],
          "explanation": "Kolejna sekcja mogła nadal dziedziczyć nagłówek. Połączenia dotyczą nagłówków i stopek osobno.",
          "hint": "Sprawdź zależność następnej sekcji od poprzedniej."
        }
      ],
      "grouping": "solo",
      "teacherNotes": "To próba samodzielna. Nie oceniaj szybkości; sprawdź, czy uczeń rozumie kierunek dziedziczenia nagłówka.",
      "askStudents": "Dlaczego rozłączamy także nagłówek za harmonogramem?",
      "expectedAnswers": "Aby następna sekcja nie dziedziczyła nowego nagłówka harmonogramu.",
      "commonMistakes": "Rozłączenie tylko zmienianej sekcji i pominięcie sekcji za nią.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "check",
      "label": "Ocena",
      "title": "Ocena — pokaż dowód",
      "duration": 6,
      "intro": "Rubryka dotyczy rzeczywistego pliku. Zaznaczenia są samooceną; nauczyciel sprawdza DOCX. Quiz nie ocenia poprawności dokumentu.",
      "activities": [
        {
          "type": "wordRubric",
          "id": "w31-rubric",
          "title": "Kryteria pliku — sprawdź w Wordzie",
          "filename": "31-sekcje.docx",
          "criteria": [
            {
              "label": "Granice i orientacja",
              "points": 4,
              "description": "0: brak działającego podziału. 1: jest podział sekcji, ale tabela nadal pionowo. 2: tabela poziomo, ale zmienia się też inna część albo brakuje jednej granicy. 3: orientacja wszystkich części poprawna, ale uczeń nie wskazuje obu granic. 4: tabela w wydzielonej sekcji poziomej, sąsiednie części pionowe, obie granice wskazane."
            },
            {
              "label": "Kolumny",
              "points": 2,
              "description": "0: brak kolumn lub spacje. 1: dwie kolumny obejmują za dużo tekstu. 2: sześć akapitów porad w dwóch kolumnach, reszta w jednej, widoczne granice ciągłe."
            },
            {
              "label": "Nagłówki",
              "points": 2,
              "description": "0: nagłówki jednakowe lub brak. 1: właściwy nagłówek planu, ale błędny w jednej sąsiedniej sekcji. 2: PLAN WYDARZENIA tylko w sekcji planu, PORADNIK ORGANIZATORA przed nią i za nią."
            },
            {
              "label": "Kontrola i uzasadnienie",
              "points": 2,
              "description": "0: brak zapisanego pliku lub uzasadnienia. 1: poprawny zapis albo wyjaśnienie wyboru. 2: zapisany DOCX, sprawdzony podgląd i trafne ustne uzasadnienie strony, sekcji i kolumn."
            }
          ]
        },
        {
          "type": "text",
          "id": "w31-exit",
          "question": "Bilet wyjścia: jaka była jedna usterka, jak ją rozpoznałeś i co zmienisz następnym razem w kolejności pracy?",
          "placeholder": "Wpisz konkretny przykład ze swojego dokumentu…",
          "minLength": 12,
          "explanation": "Przykład: całość była pozioma; brakowało granicy za tabelą. Najpierw utworzę obie granice, potem zmienię orientację. To refleksja, nie automatyczna ocena."
        },
        {
          "type": "resultCard",
          "id": "w31-result",
          "title": "Sprawdzenie wiedzy — quiz",
          "hideGrade": true,
          "sources": [
            "w31-q1",
            "w31-q2",
            "w31-q3"
          ],
          "badges": [
            {
              "min": 0,
              "name": "Wróć do wskazówki",
              "text": "Przeczytaj wyjaśnienia i sprawdź zasadę na swoim pliku."
            },
            {
              "min": 0.6,
              "name": "Rozumiem narzędzia",
              "text": "Pokaż w Wordzie dowód spełnienia kryteriów."
            },
            {
              "min": 1,
              "name": "Decyzje z uzasadnieniem",
              "text": "Wynik dotyczy quizu. Dokument ocenia nauczyciel osobno."
            }
          ]
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Zbierz pliki ustalonym kanałem i jedną trudność od każdego. Przy powtarzającym się błędzie zaplanuj 3-minutową powtórkę.",
      "askStudents": "Czy podział strony wystarczy do nowej orientacji?",
      "expectedAnswers": "Nie — trzeba wydzielić sekcję.",
      "commonMistakes": "Samoocena utożsamiana z potwierdzeniem poprawności pliku.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    }
  ],
  "objectives": [
    "Odróżniam podział strony od podziału sekcji i uzasadniam wybór.",
    "Ustawiam orientację poziomą tylko w jednej sekcji.",
    "Stosuję podziały ciągłe, aby tylko wybrany fragment miał dwie kolumny.",
    "Rozłączam nagłówki sekcji i sprawdzam skutki zmiany w całym dokumencie."
  ],
  "teacherGuide": {
    "preparation": "Pobierz starter 31 i otwórz go w Wordzie. Włącz ¶. Na kopii przygotuj przykład tabeli, która wymaga poziomej strony. Sprawdź działanie Układ → Znaki podziału (lub Podziały). Nie wymagaj takiej samej liczby stron na różnych komputerach.",
    "summary": "Dowód: DOCX z wyodrębnioną sekcją poziomą, dwoma kolumnami ograniczonymi podziałami ciągłymi i niezależnym nagłówkiem. 10 pkt praktycznych według rubryki, quiz osobno. Po lekcji sprawdź ilu uczniów samodzielnie wskazuje obie granice sekcji; jeśli mniej niż 3/4, wróć do modelu na początku kolejnych zajęć."
  },
  "exitTicket": "Potrafisz wybrać granicę do celu: nowa strona, inny układ lub kolumny. Oddaj 31-sekcje.docx i pokaż nauczycielowi dowód spełnienia kryteriów."
};
