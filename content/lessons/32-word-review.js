export default {
  "id": "32",
  "grade": 1,
  "title": "Praca w trybie recenzji",
  "topic": "Praca w trybie recenzji",
  "subtitle": "Redakcja dostała zaproszenie z błędami. Popraw treść, zachowaj ślad decyzji i przygotuj wersję do publikacji.",
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
        "name": "Feedback prowadzący do poprawy",
        "url": "https://metodyka.covepolska.pl/metoda-feedback-poprawa.html"
      },
      {
        "name": "Tutoring rówieśniczy",
        "url": "https://metodyka.covepolska.pl/metoda-peer-tutoring.html"
      }
    ],
    "name": "Dyżur redakcyjny: autor → recenzent → poprawa",
    "student": "Porównasz zaproszenie z kartą ustaleń. Zachowasz recenzję, wymienisz konkretną wskazówkę z partnerem i przygotujesz drugą wersję. Każdy oddaje własne dwa pliki.",
    "teacher": "Najpierw pokaż różnicę: komentarz pyta, zmiana proponuje nowy zapis. Uczniowie przeglądają dwie gotowe propozycje, potem tworzą własną recenzję. Partner daje wskazówkę względem kryterium i autor obowiązkowo poprawia tekst. Zachowaj osobny czas na poprawę.",
    "grouping": "Praca indywidualna i dwie krótkie rundy w parze. Recenzent mówi lub dopisuje komentarz przy komputerze autora, bez kont online. Przy braku partnera rolę recenzenta pełni nauczyciel lub uczeń korzysta z ramy pytań i zaznacza samokontrolę."
  },
  "sections": [
    {
      "id": "brief",
      "label": "Zlecenie",
      "title": "Zlecenie — redaktor sprawdza fakty",
      "duration": 5,
      "intro": "W starterze są uzgodnione dane i zaproszenie z usterkami. Dwie propozycje już czekają w trybie śledzenia zmian. Ty jesteś redaktorem odpowiedzialnym za publikację.",
      "activities": [
        {
          "type": "download",
          "id": "w32-download-start.docx",
          "file": "materials/word/lesson-32-start.docx",
          "label": "Pobierz dokument startowy DOCX",
          "description": "Materiał do pracy w zainstalowanym Wordzie. Zapisz kopię w swoim folderze lekcji."
        },
        {
          "type": "choice",
          "id": "w32-q1",
          "question": "Zdanie „Przynieś materiały” jest niejasne, a karta ustaleń nie podaje jakich. Co robisz?",
          "options": [
            "Dopisuję wymyśloną listę",
            "Komentuję: „Jakie materiały i kto je zapewnia? Proszę potwierdzić przed publikacją.”",
            "Usuwam cały dokument"
          ],
          "correct": [
            1
          ],
          "explanation": "Komentarz pozwala poprosić o brakującą informację. Nie uzupełniamy faktów domysłem.",
          "hint": "Czy znasz prawdziwą odpowiedź, czy dopiero musisz o nią zapytać?"
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Uczniowie czytają kartę danych przed edycją. Podkreśl brak obowiązku logowania i współpracy online.",
      "askStudents": "Co jest źródłem rozstrzygnięcia daty i sali?",
      "expectedAnswers": "Tabela uzgodnionych danych w starterze.",
      "commonMistakes": "Redagowanie na podstawie pamięci zamiast danych.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "model",
      "label": "Instruktaż",
      "title": "Instruktaż — trzy różne czynności",
      "duration": 8,
      "intro": "Recenzowanie to propozycja, rozmowa i decyzja. Każda z tych czynności ma własne narzędzie.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w32-model",
          "title": "Zobacz recenzję w Wordzie",
          "steps": [
            {
              "title": "Pokaż pełny zapis",
              "instruction": "Otwórz starter w Wordzie i zapisz jako 32-recenzja.docx. W Recenzja wybierz Wszystkie adiustacje. W Pokaż adiustację zaznacz wstawienia i usunięcia oraz wszystkich recenzentów. Otwórz Okienko recenzowania, jeżeli zmiany są trudne do zauważenia.",
              "check": "Widzisz propozycję sali 21→12 i czasu 60→90 minut.",
              "help": "Nie widzisz zmian? Sprawdź Wszystkie adiustacje oraz filtry autorów. „Bez adiustacji” ukrywa oznaczenia."
            },
            {
              "title": "Komentarz kontra zmiana",
              "instruction": "Zaznacz „Przynieś materiały”, wybierz Recenzja → Nowy komentarz i zapytaj jakie materiały należy przynieść. Jeśli komentarz ma przycisk Wyślij/Opublikuj, kliknij go, aby zapisać komentarz w pliku. Następnie wybierz Recenzja → Śledź zmiany (lub Śledzenie zmian).",
              "check": "Komentarz odnosi się do zaznaczenia, a śledzenie jest włączone.",
              "help": "W nowoczesnych komentarzach użyj przycisku zatwierdzającego lub Ctrl+Enter. Nie musisz używać @wzmianek ani wysyłać wiadomości innym osobom."
            }
          ]
        }
      ],
      "grouping": "class",
      "teacherNotes": "Na kopii pokaż krótkie dopisanie słowa przy włączonym śledzeniu. Przełącz Bez adiustacji i z powrotem. Uczniowie przewidują, czy zmiana zniknęła.",
      "askStudents": "Czy wyłączenie śledzenia usuwa poprzednie propozycje?",
      "expectedAnswers": "Nie, tylko kończy oznaczanie kolejnych edycji.",
      "commonMistakes": "Mylenie wyłączenia śledzenia, ukrycia znaczników i rozstrzygnięcia zmian.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false,
      "reading": {
        "title": "Komentarz nie poprawia zdania",
        "paragraphs": [
          "Śledzenie zmian zachowuje propozycje dodania, usunięcia i zmiany formatowania. Komentarz zapisuje uwagę lub pytanie przy fragmencie. Autor dokumentu podejmuje decyzję: Akceptuj utrwala propozycję, Odrzuć ją cofa. Nie akceptuj automatycznie wszystkich zmian tylko dlatego, że są oznaczone jako recenzja.",
          "Widok Bez adiustacji pokazuje tekst z uwzględnieniem proponowanych zmian, ale nie usuwa śladów recenzji. Oryginał również jest widokiem, nie poleceniem cofnięcia propozycji. Wyłączenie śledzenia nie rozstrzyga już istniejących zmian.",
          "Rozwiązanie wątku komentarza oznacza zakończenie rozmowy, ale komentarz może nadal pozostać w pliku. Do czystej kopii usuń komentarze po wykorzystaniu uwag; wcześniej zachowaj kopię z recenzją."
        ]
      }
    },
    {
      "id": "edit",
      "label": "Recenzja",
      "title": "Recenzja — popraw i uzasadnij",
      "duration": 13,
      "intro": "Zachowaj ślad swojej pracy. Na razie nie akceptuj ani nie odrzucaj propozycji; decyzje zastosujesz w kopii do publikacji.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w32-edit",
          "title": "Pierwsza wersja recenzji",
          "steps": [
            {
              "title": "Sprawdź dwie propozycje",
              "instruction": "Porównaj salę oraz czas z tabelą danych. Przy każdej dopisz komentarz z decyzją i uzasadnieniem: sala 12 — zgodna z ustaleniami; 90 minut — niezgodne, ma zostać 60. Zostaw propozycje nierozstrzygnięte w tym pliku.",
              "check": "Masz decyzje oparte na karcie, nie na kolorze znacznika.",
              "help": "Przy zamianie Word może pokazywać usunięcie i wstawienie jako osobne zmiany. Później rozstrzygnij obie części zamiany."
            },
            {
              "title": "Własne poprawki pod kontrolą",
              "instruction": "Przy włączonym śledzeniu zmień „płatny” na „bezpłatny”, termin zapisów 17 listopada na 16 listopada, „sie” na „się”. Usuń obietnicę niepotwierdzonego certyfikatu. Nie zmieniaj daty warsztatów: 18 listopada 2026, godz. 14.00.",
              "check": "Wszystkie własne poprawki mają ślad recenzji, a daty zgadzają się z tabelą.",
              "help": "Jeśli zmiany nie są oznaczone, cofnij własną ostatnią edycję, włącz śledzenie i powtórz. Nie używaj kolorowania jako zastępstwa recenzji."
            },
            {
              "title": "Komentarz, który pomaga",
              "instruction": "Przy niejasnych materiałach dopisz propozycję bez wymyślania faktu: „Do wyjaśnienia z organizatorem; do tego czasu usuńmy niepotwierdzoną prośbę z wersji publicznej”. Zapisz Ctrl+S.",
              "check": "Odbiorca wie, jaka decyzja jest potrzebna i co zrobić przed publikacją.",
              "help": "„Źle” ani „Popraw” nie mówią autorowi, jak zmienić tekst."
            }
          ]
        }
      ],
      "grouping": "solo",
      "teacherNotes": "Sprawdź po trzech minutach, czy każdy ma włączone śledzenie. Pomagaj pytaniem: „Który wiersz tabeli potwierdza tę decyzję?”.",
      "askStudents": "Czy recenzent zawsze ma rację?",
      "expectedAnswers": "Nie; propozycje trzeba sprawdzić z uzgodnionymi danymi.",
      "commonMistakes": "Przyjmowanie 90 min, bo to nowszy zapis.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "feedback",
      "label": "Poprawa",
      "title": "Poprawa — od uwagi do publikacji",
      "duration": 13,
      "intro": "Przez pierwsze 4 minuty pracujcie w parze (po 2 minuty na osobę). Recenzent wskazuje jeden spełniony warunek i jeden konkretny następny krok. Potem każdy ma 9 minut na zastosowanie uwagi i przygotowanie kopii.",
      "activities": [
        {
          "type": "wordSteps",
          "id": "w32-feedback",
          "title": "Druga wersja z dowodem poprawy",
          "steps": [
            {
              "title": "Wskazówka partnera",
              "instruction": "Pokaż dokument partnerowi. Partner sprawdza zgodność z kartą danych i czytelność komentarza. Dopisz komentarz „Po informacji zwrotnej poprawię…” ze wskazaniem konkretnego miejsca. Popraw to miejsce, nadal przy włączonym śledzeniu. Zapisz 32-recenzja.docx.",
              "check": "Widać wskazówkę i odpowiadającą jej poprawę.",
              "help": "Jeśli wszystko działa, partner proponuje uściślenie jednego zdania bez zmiany uzgodnionych faktów."
            },
            {
              "title": "Osobna kopia do publikacji",
              "instruction": "Plik → Zapisz jako → 32-publikacja.docx. Dopiero w tej kopii w Recenzja przejdź przez zmiany przyciskami Następna/Poprzednia. Zaakceptuj salę 21→12. Odrzuć czas 60→90 (obie części zamiany). Zaakceptuj poprawne własne korekty.",
              "check": "Ostateczny tekst podaje salę 12 i 60 minut, udział bezpłatny i zapisy do 16 listopada.",
              "help": "Jeżeli jedna zamiana składa się z usunięcia i wstawienia, przejrzyj obie. Kontroluj końcowe zdanie po decyzji."
            },
            {
              "title": "Domknij pytania",
              "instruction": "Dopóki organizator nie potwierdzi materiałów, usuń z wersji publicznej niejasną prośbę o ich przyniesienie. Rozstrzygnij także tę zmianę. Wyłącz śledzenie. Wykorzystane komentarze usuń poleceniami Recenzja → Usuń (w grupie Komentarze), nie tylko Rozwiąż.",
              "check": "Kopia publiczna nie zawiera niepotwierdzonych obietnic ani komentarzy.",
              "help": "Nie kasuj całej tabeli danych przed kontrolą faktów; możesz zostawić ją jako załącznik roboczy albo po kontroli usunąć z kopii publikacyjnej."
            },
            {
              "title": "Ostatnia kontrola",
              "instruction": "Ustaw Wszystkie adiustacje i wszystkich recenzentów; sprawdź Okienko recenzowania oraz panel komentarzy. Powinno nie być nierozstrzygniętych zmian ani komentarzy. Przeczytaj cały tekst i zapisz. Zachowaj oba pliki.",
              "check": "Wersja z recenzją zachowała ślad pracy, kopia publikacyjna jest czysta.",
              "help": "Sam brak czerwonych podkreśleń lub widok Bez adiustacji nie jest dowodem czystości."
            }
          ]
        }
      ],
      "grouping": "pair",
      "teacherNotes": "Wymagaj czasu na poprawę: nie kończ na wymianie pochwał. Sprawdź dwa pliki u losowo wybranej pary.",
      "askStudents": "Po czym sprawdzisz, że uwaga została wykorzystana?",
      "expectedAnswers": "Porównam konkretny fragment w recenzji i wersji publicznej.",
      "commonMistakes": "Nadpisanie kopii recenzenckiej czystym plikiem.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    },
    {
      "id": "check",
      "label": "Ocena",
      "title": "Ocena — dwa pliki, jeden proces",
      "duration": 6,
      "intro": "Oddaj oba pliki kanałem ustalonym z nauczycielem. Platforma sprawdza wyłącznie odpowiedzi quizowe, a rubryka jest Twoją samooceną.",
      "activities": [
        {
          "type": "choice",
          "id": "w32-q2",
          "question": "Włączasz Bez adiustacji i zapisujesz dokument. Czy odbiorca może zobaczyć stare propozycje?",
          "options": [
            "Nie, zapis je usunął",
            "Tak, jeśli nie zostały zaakceptowane lub odrzucone",
            "Tylko po zakupie innej wersji Worda"
          ],
          "correct": [
            1
          ],
          "explanation": "Ukryte propozycje pozostają w dokumencie. Trzeba je rozstrzygnąć, a komentarze usunąć z kopii publikacyjnej.",
          "hint": "Widok zmienia wyświetlanie czy zawartość historii zmian?"
        },
        {
          "type": "choice",
          "id": "w32-q3",
          "question": "Karta ustaleń mówi 60 minut, recenzent proponuje 90. Jaka decyzja jest uzasadniona?",
          "options": [
            "Akceptuj, bo recenzent jest ważniejszy",
            "Odrzuć propozycję 90 i sprawdź, czy wróciło 60",
            "Ukryj propozycję, to wystarczy"
          ],
          "correct": [
            1
          ],
          "explanation": "Dane źródłowe są podstawą decyzji; odrzucenie przywraca wcześniejszy zapis.",
          "hint": "Porównaj propozycję z kartą danych."
        },
        {
          "type": "wordRubric",
          "id": "w32-rubric",
          "title": "Kryteria pliku — sprawdź w Wordzie",
          "filename": "32-recenzja.docx + 32-publikacja.docx",
          "criteria": [
            {
              "label": "Zgodność informacji",
              "points": 3,
              "description": "0: co najmniej trzy istotne błędy. 1: dwa błędy. 2: jeden błąd. 3: sala 12, 60 minut, bezpłatny udział, zapisy 16 listopada, warsztaty 18 listopada o 14.00; brak niepotwierdzonego certyfikatu."
            },
            {
              "label": "Widoczna recenzja",
              "points": 3,
              "description": "0: brak wersji z recenzją. 1: tylko komentarz albo tylko śledzone korekty. 2: oba narzędzia są, lecz brak uzasadnienia jednej decyzji. 3: własne śledzone korekty, rzeczowy komentarz i uzasadnione decyzje dotyczące dwóch gotowych propozycji."
            },
            {
              "label": "Wykorzystanie feedbacku",
              "points": 2,
              "description": "0: brak wskazówki i poprawy. 1: jest konkretna uwaga, ale bez widocznego zastosowania. 2: komentarz wskazuje miejsce i działanie, a późniejszy tekst pokazuje odpowiadającą mu poprawę."
            },
            {
              "label": "Kopia publikacyjna",
              "points": 2,
              "description": "0: brak osobnej kopii. 1: kopia istnieje, ale ma nierozstrzygniętą zmianę lub komentarz. 2: osobna kopia bez nierozstrzygniętych zmian i komentarzy; wersja recenzencka zachowana."
            }
          ]
        },
        {
          "type": "text",
          "id": "w32-exit",
          "question": "Bilet wyjścia: podaj jedną decyzję Akceptuj/Odrzuć z jej źródłem oraz jedną zmianę po uwadze partnera. Oceń: samodzielnie / ze wskazówką / potrzebuję próby.",
          "placeholder": "Wpisz konkretny przykład ze swojego dokumentu…",
          "minLength": 12,
          "explanation": "Przykład: odrzuciłem 90 minut, bo karta mówi 60; po uwadze doprecyzowałem komentarz o materiałach. Samoocena służy planowaniu kolejnej próby."
        },
        {
          "type": "resultCard",
          "id": "w32-result",
          "title": "Sprawdzenie wiedzy — quiz",
          "hideGrade": true,
          "sources": [
            "w32-q1",
            "w32-q2",
            "w32-q3"
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
      "teacherNotes": "Nie przeliczaj quizu automatycznie na ocenę produktu. Zbierz krótką refleksję i obejrzyj pliki z recenzją i bez niej.",
      "askStudents": "Dlaczego zachowujemy dwa pliki?",
      "expectedAnswers": "Aby pokazać proces poprawy i osobno gotową publikację.",
      "commonMistakes": "Oddawanie samego zrzutu ekranu zamiast edytowalnych plików.",
      "optionalExtension": "Dla chętnych: wyjaśnij partnerowi przyczynę jednego błędu i pokaż bezpieczną korektę na kopii pliku.",
      "skipIfShortOnTime": false
    }
  ],
  "objectives": [
    "Odróżniam komentarz od proponowanej zmiany treści.",
    "Włączam śledzenie zmian, a następnie świadomie akceptuję lub odrzucam propozycje.",
    "Weryfikuję zaproszenie na podstawie danych w dokumencie, nie według własnego domysłu.",
    "Zachowuję wersję z recenzją i przygotowuję czystą kopię po rozstrzygnięciu zmian."
  ],
  "teacherGuide": {
    "preparation": "Sprawdź wyświetlanie gotowych zmian w starterze: Recenzja → Wszystkie adiustacje, Pokaż adiustację → wstawienia i usunięcia oraz wszyscy recenzenci. Klucz: sala 12 (zaakceptuj propozycję 21→12), czas 60 min (odrzuć propozycję 60→90), bezpłatnie, zapisy do 16 listopada, popraw „sie”, usuń niepotwierdzony certyfikat. Nie dopowiadaj listy materiałów — komentarz ma zapytać organizatora.",
    "summary": "Oceń parę plików 32-recenzja.docx oraz 32-publikacja.docx: poprawność względem tabeli, widoczna praca recenzencka, użycie feedbacku i świadome rozstrzygnięcia. Quiz jest osobną diagnozą. Jeśli uczniowie mylą ukrycie z usunięciem, zacznij następną lekcję od ponownego wyświetlenia adiustacji w kopii."
  },
  "exitTicket": "Recenzja kończy się decyzją i poprawą. Oddaj 32-recenzja.docx oraz 32-publikacja.docx; wynik quizu nie zastępuje oceny tych plików."
};
