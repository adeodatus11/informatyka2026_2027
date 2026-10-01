export default {
  "id": "33",
  "grade": 1,
  "title": "Praktyczny poradnik",
  "topic": "Praktyczny poradnik",
  "subtitle": "Wydaj poradnik dla kolejnego zespołu organizatorów. Czy inna osoba znajdzie w nim informację i bezpiecznie go zaktualizuje?",
  "icon": "doc",
  "tags": [
    "Word na komputerze",
    "Dokument DOCX",
    "Praktyka"
  ],
  "duration": 90,
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
        "name": "Problem, projekt i przypadek",
        "url": "https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html"
      },
      {
        "name": "Metapoznanie",
        "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
      },
      {
        "name": "Feedback prowadzący do poprawy",
        "url": "https://metodyka.covepolska.pl/metoda-feedback-poprawa.html"
      }
    ],
    "name": "Miniprojekt redakcyjny w dwóch lekcjach",
    "student": "Masz gotowy surowy tekst, ilustrację, tabelę i wykres. W ciągu 2 × 45 minut przygotujesz poradnik, którego spisy da się aktualizować. Po pierwszych 45 minutach zapisujesz wersję roboczą; po drugich oddajesz wersję z recenzją, finalny DOCX i PDF.",
    "teacher": "Przed projektem pokaż zależność: style → spis treści; podpisy → spisy obiektów; układ → aktualizacja numerów stron. Uczniowie zapisują własny plan i punkt kontroli. Po pierwszej sesji każdy zapisuje plik. Druga zaczyna się diagnozą, następnie rzeczywisty test czytelnika, konkretna uwaga i poprawa. Nie oceniaj dekoracyjności ani szybkości.",
    "grouping": "Każdy tworzy własny poradnik. W drugiej sesji pary zamieniają się rolą czytelnika i autora po 5 minutach. Bez pary testuje nauczyciel lub uczeń wykonuje zadania czytelnika po krótkiej przerwie i oznacza samokontrolę."
  },
  "sections": [
    {
      "id": "plan",
      "label": "Sesja 1",
      "title": "Sesja 1 — plan wydania",
      "duration": 7,
      "intro": "Odbiorcą jest uczeń, który za miesiąc organizuje szkolne wydarzenie i nie zna Waszych ustaleń. Cel: szybko znaleźć dział, zobaczyć plan, zrozumieć ilustrację i zaktualizować poradnik bez ręcznego przepisywania spisów.",
      "activities": [
        {
          "type": "download",
          "id": "w33-download-start.docx",
          "file": "materials/word/lesson-33-start.docx",
          "label": "Pobierz dokument startowy DOCX",
          "description": "Materiał do pracy w zainstalowanym Wordzie. Zapisz kopię w swoim folderze lekcji."
        },
        {
          "type": "text",
          "id": "w33-plan",
          "question": "Zapisz plan trzech kroków: co przygotujesz najpierw, co z tego wynika i kiedy sprawdzisz działanie spisów?",
          "placeholder": "Wpisz konkretny przykład ze swojego dokumentu…",
          "minLength": 12,
          "explanation": "Przykład: najpierw struktura stylów i podpisy; potem sekcje i automatyczne spisy; na końcu test zmienionego nagłówka i aktualizacja. Plan zachowaj także w lokalnej notatce — odświeżenie platformy zeruje odpowiedzi."
        },
        {
          "type": "choice",
          "id": "w33-q1",
          "question": "Która kolejność ogranicza poprawianie tego samego spisu kilka razy?",
          "options": [
            "Ręcznie wpiszę numery stron, potem tekst",
            "Najpierw style i podpisy, potem spisy, na końcu aktualizacja po zmianie układu",
            "Najpierw kolor wszystkich liter"
          ],
          "correct": [
            1
          ],
          "explanation": "Spisy korzystają ze struktury i podpisów, a numery stron zależą od układu. Kolejność wynika z tych zależności.",
          "hint": "Z czego Word odczytuje wpisy i numery stron?"
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Przedstaw rubrykę. Modeluj 45 sekund planowania na głos, potem każdy pisze własny plan.",
      "askStudents": "Co musi działać, żeby odbiorca mógł aktualizować poradnik?",
      "expectedAnswers": "Style, podpisy i spisy jako pola, nie ręczne imitacje.",
      "commonMistakes": "Zaczynanie od ozdób bez struktury.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "build",
      "label": "Budowa",
      "title": "Budowa — tekst staje się poradnikiem",
      "duration": 28,
      "intro": "Pracuj w zainstalowanym Wordzie. W połowie tego etapu zatrzymaj się na minutę: sprawdź panel Nawigacja oraz pierwszy podpis i zmień plan, jeśli któryś mechanizm nie działa.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w33-build",
          "title": "Warsztat redakcyjny",
          "steps": [
            {
              "title": "Własna kopia i hierarchia",
              "instruction": "Zapisz starter jako 33-poradnik-roboczy.docx. Tytułowi dokumentu nadaj styl Tytuł. Główne działy „Cel wydarzenia”, „Przygotowanie sali”, „Podział zadań”, „Przebieg turnieju”, „Zasady punktacji”, „Podsumowanie i wnioski” oznacz Nagłówek 1. Dopisz dwa rzeczowe śródtytuły do wybranych działów i nadaj im Nagłówek 2. Tekst zwykły ma styl Normalny.",
              "check": "Widok → Okienko nawigacji pokazuje sześć głównych działów i dwa zagnieżdżone pod nimi poddziały.",
              "help": "Samo pogrubienie nie tworzy nagłówka. Tytuł dokumentu nie powinien przypadkowo stać się pierwszym rozdziałem. W razie potrzeby styl zmienisz w Narzędzia główne → Style."
            },
            {
              "title": "Styl wspólny i nagłówek",
              "instruction": "Prawym przyciskiem na stylu Nagłówek 1 → Modyfikuj ustaw czytelny wygląd wszystkich działów jednocześnie. Wstawianie → Nagłówek: PORADNIK ORGANIZATORA. Wstawianie → Numer strony → Dół strony: wstaw automatyczny numer. Zachowaj ciągłość numeracji całego dokumentu.",
              "check": "Nagłówki działów mają jednolity wygląd, a numery stron są polami, nie wpisanymi cyframi.",
              "help": "Numer strony umieść w stopce. Jeżeli nowa sekcja zaczyna numerację od 1, w Formatuj numery stron wybierz Kontynuuj z poprzedniej sekcji."
            },
            {
              "title": "Trzy podpisy",
              "instruction": "Zaznacz ilustrację „Model pracy zespołu” i wybierz Odwołania → Wstaw podpis, etykieta Ilustracja. Dodaj opis. Analogicznie podpisz tabelę jako Tabela, a wykres jako Wykres (Nowa etykieta, gdy brak takiej pozycji). Wstaw podpis tabeli nad nią, pozostałych obiektów pod nimi. Usuń zbędny zwykły podpis zastępowany polem.",
              "check": "Każdy z trzech obiektów ma podpis z automatycznym numerem, np. Ilustracja 1. Model pracy zespołu.",
              "help": "Nie wpisuj numerów ręcznie. Gdy numer jest kodem SEQ, Alt+F9 przełącza wyświetlanie kodów i wyników. Pozostaw obiekty w tekście, aby łatwiej kontrolować układ."
            },
            {
              "title": "Harmonogram poziomo",
              "instruction": "Przed nagłówkiem Harmonogram roboczy i za tabelą wraz z jej podpisem wstaw Układ → Znaki podziału → Podziały sekcji → Następna strona. Kliknij w tę sekcję i ustaw Orientacja → Pozioma. Następną sekcję pozostaw pionową.",
              "check": "Harmonogram wraz z podpisem mieści się poziomo, pozostałe części są pionowe.",
              "help": "Granice mają obejmować także podpis tabeli. Klikaj poza tabelą, w akapicie. W ustawieniach strony sprawdź zakres Ta sekcja."
            },
            {
              "title": "Spis treści i trzy spisy obiektów",
              "instruction": "Na początku, po tytule, utwórz miejsce na spis treści. Wybierz Odwołania → Spis treści → Automatyczny. Na końcu przed źródłami przygotuj osobne akapity „Spis ilustracji”, „Spis tabel”, „Spis wykresów”. Pod każdym wybierz Odwołania → Wstaw spis ilustracji i odpowiednią Etykietę podpisu: Ilustracja, Tabela, Wykres. Każdy spis wstaw w pustym akapicie poza poprzednim polem.",
              "check": "Są cztery działające spisy: jeden rozdziałów i trzy oddzielne listy obiektów, nawet jeśli każda ma jeden wpis.",
              "help": "Komunikat o braku pozycji? Sprawdź styl nagłówka lub etykietę podpisu. Spis tabel również powstaje poleceniem Wstaw spis ilustracji. Nie zastępuj istniejącego spisu, gdy Word zapyta o zamianę."
            }
          ]
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Po 14 minutach przerwij na kontrolę strategii: każdy wskazuje Nagłówek 2 i automatyczny numer podpisu. Uczniowie z trudnością dostają pomoc przy jednym mechanizmie, nie dodatkowe treści.",
      "askStudents": "Co sprawdzisz, gdy spis obiektów jest pusty?",
      "expectedAnswers": "Czy jest podpis z właściwą etykietą, a nie zwykły tekst.",
      "commonMistakes": "Wstawianie kolejnego spisu wewnątrz poprzedniego pola.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false,
      "reading": {
        "title": "Poradnik działa jako system",
        "paragraphs": [
          "Style opisują strukturę, a nie tylko wygląd. Automatyczny spis treści korzysta z poziomów nagłówków; spisy obiektów korzystają z podpisów odpowiedniej kategorii. Zmiana fontu nie zastąpi tych mechanizmów.",
          "Sekcje odpowiadają za różne ustawienia układu. Po zmianach rozmiaru tekstu i orientacji numery stron mogą się przesunąć. Spisy trzeba zaktualizować przed oddaniem.",
          "Gotowe materiały mają fikcyjny kontekst szkolny i autorskie grafiki. Zachowaj końcowe źródła materiałów. Nie potrzebujesz obrazów z wyszukiwarki ani danych prawdziwych uczniów."
        ]
      }
    },
    {
      "id": "save",
      "label": "Punkt zapisu",
      "title": "Punkt zapisu — koniec pierwszych 45 minut",
      "duration": 10,
      "intro": "Sprawdź mechanizmy przed przerwą. Nie musisz uzyskać konkretnej liczby stron — zależy ona od ustawień i wersji Worda.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w33-save",
          "title": "Test kontrolny i bezpieczna przerwa",
          "steps": [
            {
              "title": "Sprawdź zależności",
              "instruction": "Zmień jeden tytuł działu na „Podsumowanie wydarzenia i wnioski”. Kliknij spis treści prawym przyciskiem → Aktualizuj pole → Aktualizuj cały spis. Sprawdź nowy tytuł. Zmień opis jednego podpisu i zaktualizuj odpowiedni spis obiektów (F9 → cały spis).",
              "check": "Nowe brzmienie pojawia się w odpowiednim spisie bez ręcznego przepisywania.",
              "help": "Aktualizowanie tylko numerów stron nie wczytuje nowej treści tytułu. W razie potrzeby użyj Fn+F9 albo menu kontekstowego."
            },
            {
              "title": "Zapisz i zamknij bez utraty pracy",
              "instruction": "Ctrl+S. Zapisz lokalnie w krótkiej notatce: co działa, co wymaga poprawy i ścieżkę pliku. Zamknij i otwórz 33-poradnik-roboczy.docx, aby sprawdzić zapis. To koniec sesji 1 (7 + 28 + 10 = 45 min).",
              "check": "Dokument otwiera się z zapisanymi zmianami, a plan dalszej pracy jest poza stroną internetową.",
              "help": "Stan quizów i zaznaczeń na platformie znika po odświeżeniu. Nie jest kopią Twojego DOCX. Nie zaczynaj sesji 2 od ponownego pobrania startera."
            }
          ]
        },
        {
          "type": "text",
          "id": "w33-monitor",
          "question": "Punkt kontroli: który mechanizm sprawdziłeś, jaki był wynik i co zrobisz na początku następnej lekcji?",
          "placeholder": "Wpisz konkretny przykład ze swojego dokumentu…",
          "minLength": 12,
          "explanation": "Napisz wynik testu, np. po zmianie tytułu zaktualizowałem cały spis i tytuł się zmienił; następnie sprawdzę podpis wykresu. Skopiuj tę notatkę do własnego pliku, zanim zamkniesz przeglądarkę."
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Daj całe ostatnie 3 minuty na zapis i ponowne otwarcie plików. Zanotuj uczniów wymagających wsparcia w sesji 2.",
      "askStudents": "Dlaczego aktualizacja tylko numerów nie wystarczy po zmianie tytułu?",
      "expectedAnswers": "Nie aktualizuje tekstu wpisów.",
      "commonMistakes": "Brak lokalnego zapisu przed przerwą.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "restart",
      "label": "Sesja 2",
      "title": "Sesja 2 — kontrola po przerwie",
      "duration": 6,
      "intro": "Otwórz zapisany dokument roboczy. Przeczytaj własną notatkę i sprawdź pierwszy brakujący element. Ta sesja ma kolejne 45 minut.",
      "activities": [
        {
          "type": "choice",
          "id": "w33-q2",
          "question": "Po dopisaniu tekstu tytuł jest poprawny, ale numery stron w spisie są stare. Co robisz?",
          "options": [
            "Aktualizuję pole spisu i sprawdzam strony",
            "Ręcznie wpisuję nowe numery do spisu",
            "Usuwam wszystkie style"
          ],
          "correct": [
            0
          ],
          "explanation": "Spis przechowuje wynik pola; aktualizacja pobiera bieżące strony. Ręczna poprawa ginie przy następnej aktualizacji.",
          "hint": "Czy spis jest tekstem do ręcznego pisania czy polem korzystającym z dokumentu?"
        },
        {
          "type": "wordSteps",
          "id": "w33-restart",
          "title": "Odtwórz plan",
          "steps": [
            {
              "title": "Napraw jeden mechanizm",
              "instruction": "Sprawdź punkt z notatki. Jeśli wszystkie mechanizmy działają, znajdź za pomocą spisu dział Zasady punktacji i odczytaj go z perspektywy nowego organizatora.",
              "check": "Wiesz, co pozostaje do poprawy przed testem czytelnika.",
              "help": "Gdy zgubiłeś plik, sprawdź Plik → Otwórz → Ostatnie. Nie nadpisuj swojego dokumentu starterem."
            }
          ]
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Zbierz krótki sygnał od wszystkich. Uczniom z niedokończonym spisem daj wsparcie przez pierwsze minuty, pozostali testują odbiorcę.",
      "askStudents": "Który punkt kontroli pozwala Ci wrócić do pracy?",
      "expectedAnswers": "Własna notatka ze sprawdzonym i brakującym mechanizmem.",
      "commonMistakes": "Rozpoczęcie od nowego pustego pliku.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "reader",
      "label": "Test czytelnika",
      "title": "Test czytelnika — feedback i poprawa",
      "duration": 22,
      "intro": "Pierwsze 10 min: po 5 min na dokument każdej osoby. Czytelnik wykonuje trzy zadania, autor obserwuje. Następne 12 min: każdy wprowadza poprawę w swoim pliku.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w33-reader",
          "title": "Czy ktoś inny poradzi sobie z dokumentem?",
          "steps": [
            {
              "title": "Trzy zadania czytelnika",
              "instruction": "Pokaż partnerowi poradnik. Poproś: 1) znajdź Zasady punktacji przez spis treści (Ctrl+klik), 2) znajdź tabelę przez Spis tabel, 3) odczytaj opis wykresu i powiedz jednym zdaniem, co pokazuje. Zapisz jedno miejsce, w którym partner się zatrzymał. Po 5 minutach zmieńcie role.",
              "check": "Obie osoby były czytelnikiem i autorem; jest dowód problemu lub potwierdzenie działania.",
              "help": "Nie prowadź palcem do rozwiązania. Jeśli hiperlinki nie działają, sprawdź ustawienia spisu; odnalezienie wpisu i numeru strony też pozwala zdiagnozować strukturę."
            },
            {
              "title": "Ślad recenzji",
              "instruction": "Zapisz kopię jako 33-poradnik-recenzja.docx. Dodaj dwa konkretne komentarze przy fragmentach wymagających doprecyzowania: Recenzja → Nowy komentarz. Wpisz „Kryterium…, problem…, następny krok…”. Włącz Śledź zmiany i wykonaj co najmniej jedną merytoryczną lub strukturalną poprawę wynikającą z uwagi. Zapisz.",
              "check": "W pliku są dwa konkretne komentarze i co najmniej jedna widoczna poprawa.",
              "help": "Jeżeli test przeszedł bez trudności, doprecyzuj fragment, który kolejny organizator mógłby różnie rozumieć. Nie oceniaj samego koloru lub gustu."
            },
            {
              "title": "Wersja końcowa",
              "instruction": "Zapisz kolejną kopię jako 33-poradnik.docx. Przejrzyj każdą propozycję w Recenzja i rozstrzygnij ją na podstawie sensu tekstu. Wykorzystane komentarze usuń. Wyłącz śledzenie. Ustaw Wszystkie adiustacje i sprawdź, że nie zostały nierozstrzygnięte zmiany.",
              "check": "Kopia recenzencka zachowuje ślad, a końcowa przedstawia ustalone rozwiązanie.",
              "help": "Bez adiustacji nie usuwa propozycji. Jeżeli zmieniłeś tytuł lub podpis, zaktualizuj całe odpowiednie spisy."
            }
          ]
        }
      ],
      "grouping": "pair",
      "teacherNotes": "Pytaj „Które kryterium poprawiła uwaga?”. Dopilnuj 12 minut na wykonanie korekty. Recenzja bez drugiej wersji nie realizuje tej metody.",
      "askStudents": "Jaki dowód pokazuje, że poradnik jest użyteczny?",
      "expectedAnswers": "Czytelnik znajduje informację, a autor usuwa rozpoznaną przeszkodę.",
      "commonMistakes": "Feedback ogólny „ładne”, bez konkretnego działania.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "publish",
      "label": "Wydanie",
      "title": "Wydanie — kontrola jakości i ewaluacja",
      "duration": 17,
      "intro": "Przez 7 minut sprawdź pola i eksport. Przez 7 minut zastosuj rubrykę i pokaż nauczycielowi dowody. Ostatnie 3 minuty to quiz i refleksja. Oddajesz trzy pliki: recenzję, końcowy DOCX i PDF.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w33-publish",
          "title": "Kontrola przed oddaniem",
          "steps": [
            {
              "title": "Zaktualizuj i obejrzyj",
              "instruction": "Zaktualizuj spis treści oraz wszystkie trzy spisy obiektów przez prawy przycisk → Aktualizuj pole lub F9, wybierając całość po zmianie tytułów. Sprawdź nagłówek, ciągłe numery stron, orientację tabeli i czytelność podpisów w Plik → Drukuj. Zapisz DOCX.",
              "check": "Każdy spis ma poprawny tytuł, kategorię i stronę; nie ma przypadkowo pustych stron.",
              "help": "Gdy podpis został sam na stronie, ustaw dla jego akapitu „Razem z następnym”, jeśli podpis jest nad obiektem. Dla podpisu pod obrazem zadbaj, aby akapit obrazu pozostał z następnym podpisem."
            },
            {
              "title": "Eksport i kontrola pliku",
              "instruction": "Plik → Eksportuj → Utwórz dokument PDF/XPS lub Zapisz jako → PDF. Nazwij 33-poradnik.pdf. W opcjach eksportu wybierz dokument bez adiustacji, ale wcześniej rzeczywiście rozstrzygnij zmiany. Otwórz powstały PDF i sprawdź wszystkie strony.",
              "check": "DOCX jest edytowalny; PDF ma kompletną treść, widoczne obiekty i poprawny układ.",
              "help": "Nie zakładaj, że udany eksport oznacza poprawny wygląd. PDF nie zastępuje DOCX przy sprawdzaniu stylów i pól."
            }
          ]
        },
        {
          "type": "wordRubric",
          "id": "w33-rubric",
          "title": "Kryteria pliku — sprawdź w Wordzie",
          "filename": "33-poradnik-recenzja.docx + 33-poradnik.docx + 33-poradnik.pdf",
          "criteria": [
            {
              "label": "Struktura i style",
              "points": 3,
              "description": "0: ręczne formatowanie bez stylów. 1: część działów ma style. 2: sześć działów Nagłówek 1, ale brak dwóch poprawnych Nagłówków 2 lub jednolitości. 3: pełna hierarchia sześciu działów i dwóch poddziałów, spójny styl, tytuł poza numeracją rozdziałów."
            },
            {
              "label": "Nagłówek i numeracja",
              "points": 2,
              "description": "0: brak obu elementów. 1: działa jeden element lub numeracja przeskakuje. 2: nagłówek PORADNIK ORGANIZATORA i ciągła automatyczna numeracja w stopce."
            },
            {
              "label": "Automatyczny spis treści",
              "points": 3,
              "description": "0: brak lub ręczna imitacja. 1: pole z brakami. 2: pełne wpisy, ale stare tytuły/strony. 3: aktualny spis z poprawnymi poziomami; uczeń pokazuje jego aktualizację po zmianie tytułu."
            },
            {
              "label": "Podpisy i spisy obiektów",
              "points": 4,
              "description": "0: brak mechanizmów. 1: jeden poprawny podpis i odpowiadający mu spis. 2: dwa poprawne podpisy i dwa spisy. 3: trzy podpisy i trzy spisy z drobnym błędem etykiety/opisu/aktualizacji. 4: ilustracja, tabela i wykres mają automatyczne podpisy i poprawne osobne spisy."
            },
            {
              "label": "Układ sekcji",
              "points": 2,
              "description": "0: brak wydzielonego harmonogramu. 1: harmonogram poziomo, ale zmiana objęła też resztę lub podpis pozostał poza sekcją. 2: tabela i podpis w sekcji poziomej, reszta pionowo, bez przypadkowych pustych stron."
            },
            {
              "label": "Recenzja prowadząca do poprawy",
              "points": 3,
              "description": "0: brak dowodu. 1: jest komentarz, brak odpowiadającej mu poprawy. 2: jest poprawa, lecz brak zachowanej recenzji lub uzasadnienia. 3: zachowana recenzja, dwa konkretne komentarze względem kryteriów i odpowiadająca jej śledzona poprawa; wersja końcowa bez otwartych zmian i komentarzy."
            },
            {
              "label": "Czytelność i komplet wydania",
              "points": 3,
              "description": "0: brak końcowego pliku. 1: tylko DOCX lub tylko PDF. 2: oba formaty, lecz usterka czytelności lub brak źródeł. 3: czytelny DOCX i sprawdzony PDF, zachowane źródła oraz kompletna treść potrzebna odbiorcy."
            }
          ]
        },
        {
          "type": "choice",
          "id": "w33-q3",
          "question": "PDF wygląda dobrze. Co jeszcze trzeba pokazać nauczycielowi, aby dowieść automatyzacji?",
          "options": [
            "Nic, wygląd wystarczy",
            "Działające style, podpisy i aktualizację spisów w pliku DOCX",
            "Tylko nazwę Worda"
          ],
          "correct": [
            1
          ],
          "explanation": "PDF pokazuje wygląd. To w DOCX sprawdzamy mechanizmy aktualizacji i strukturę dokumentu.",
          "hint": "Czy z wydruku zobaczysz, że numer podpisu jest polem?"
        },
        {
          "type": "text",
          "id": "w33-exit",
          "question": "Ewaluacja: co w Twoim planie zadziałało, co zmieniłeś po teście czytelnika i jaki jeden test wykonasz od razu przy kolejnym dokumencie? Dodaj: samodzielnie / ze wskazówką / do przećwiczenia.",
          "placeholder": "Wpisz konkretny przykład ze swojego dokumentu…",
          "minLength": 12,
          "explanation": "Odwołaj się do widocznego mechanizmu i konkretnej korekty. Np. zacząłem od stylów; po teście zmieniłem niejasny tytuł; następnym razem wcześniej sprawdzę aktualizację całego spisu. Refleksja nie jest automatycznie oceniana."
        },
        {
          "type": "resultCard",
          "id": "w33-result",
          "title": "Sprawdzenie wiedzy — quiz",
          "hideGrade": true,
          "sources": [
            "w33-q1",
            "w33-q2",
            "w33-q3"
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
      "teacherNotes": "Sprawdź próbkę działania pól w DOCX, a nie tylko PDF. Zbierz jeden zaplanowany test od każdej osoby i wykorzystaj go przy kolejnym dłuższym dokumencie.",
      "askStudents": "Co zabierasz do następnego projektu?",
      "expectedAnswers": "Konkretną strategię: strukturę przed spisem i test aktualizacji przed eksportem.",
      "commonMistakes": "Przeliczanie deklaracji w rubryce na ocenę bez obejrzenia plików.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    }
  ],
  "sessions": [
    45,
    45
  ],
  "objectives": [
    "Planuję dokument z myślą o odbiorcy i zależnościach między narzędziami Worda.",
    "Łączę style, nagłówek, numerację, spis treści, podpisy i spisy obiektów.",
    "Wydzielam sekcję poziomą dla harmonogramu i sprawdzam układ całego dokumentu.",
    "Testuję dokument z czytelnikiem, wykorzystuję informację zwrotną i przygotowuję wersję DOCX oraz PDF."
  ],
  "teacherGuide": {
    "preparation": "Projekt wymaga dwóch lekcji po 45 min. Starter 33 jest samodzielny: nie wymaga oddanych wcześniejszych prac. Sprawdź ilustrację Model pracy zespołu, tabelę Harmonogram roboczy, wykres Jak czytać zebrane opinie i końcowe źródła. Przygotuj miejsce bezpiecznego zachowania prac między lekcjami. Kryteria 20 pkt pokaż przed rozpoczęciem.",
    "summary": "Wymagane: 33-poradnik-recenzja.docx (ślad feedbacku), 33-poradnik.docx (działające pola, uporządkowany tekst) i 33-poradnik.pdf (czytelny eksport). Rubryka 20 pkt dotyczy produktu po poprawie, nie quizu. Uczeń pokazuje działanie aktualizacji pola; PDF sam nie dowodzi automatyzacji. Z refleksji wybierz jedną umiejętność do powrotu za 2–4 tygodnie."
  },
  "exitTicket": "Wydanie gotowe, gdy ktoś znajdzie potrzebną informację, a Ty pokażesz działającą aktualizację. Zachowaj recenzję i oddaj końcowy DOCX oraz sprawdzony PDF."
};
