# Dodawanie lekcji

Treści znajdują się w `content/lessons/`. Każdy plik eksportuje jedną lekcję. Numer, klasa, tytuł, cel, materiały, etapy i wskazówki nauczyciela pozostają danymi, niezależnie od komponentów.

1. Skopiuj plik podobnej lekcji i nadaj mu nazwę zaczynającą się od numeru, np. `05-internet.js`.
2. Nadaj unikalne `id` lekcji i ustaw `grade` na 1, 2 lub 3. W całym serwisie numery lekcji muszą być unikalne.
3. Uzupełnij `title`, `subtitle`, `topic`, `objectives`, `materials`, `teacherGuide`, `exitTicket` i sześć elementów `sections`.
4. Każdy etap ma unikalne `id`, etykietę, tytuł, wstęp, czas w minutach, wskazówki nauczyciela i listę aktywności. Identyfikatory aktywności muszą być unikalne w obrębie lekcji.
5. Dodaj materiały do `public/materials/`, a filmy do `public/videos/`. Ścieżki w treści są względne, np. `materials/lesson-05.zip`.
6. Uruchom `npm run build`. Nowa lekcja zostanie znaleziona automatycznie, a strony bezpośrednie utworzone podczas budowy.

Komponenty działają również z kolejnymi klasami. Klasy 2 i 3 pokazują stan oczekiwania, dopóki nie pojawią się dla nich dane.

## Typy aktywności

| Typ | Zastosowanie |
| --- | --- |
| `choice` | Jedna odpowiedź, `correct` jest tablicą indeksów dopuszczalnych odpowiedzi |
| `multi` | Wielokrotny wybór; `min`, `max`, opcjonalny klucz `correct` |
| `matching` | Pary z wyborem odpowiedzi; każda para ma własne dopuszczalne indeksy |
| `sort` | Przeciąganie plików lub wybór plik → folder |
| `reveal` | Rozwijane karty z minimum wiedzy |
| `hardware` | Porównywanie specyfikacji sprzętu |
| `scenarios` | Zestaw przypadków diagnostycznych |
| `ports` | Porównywanie złączy |
| `sequence` | Układanie kolejności przez klikanie |
| `text` | Samoocena tekstu; opcjonalna walidacja nazwy pliku |
| `checklist` | Potwierdzanie czynności poza stroną, bez weryfikacji plików ucznia |
| `flow` | Odkrywanie etapów procesu |
| `appNeeds` | Uzasadniony wybór danych do funkcji aplikacji |
| `video` | MicroVideo, na razie jawny stan „Film w przygotowaniu” |
| `download` | Link do pliku ćwiczeniowego |
| `fileCloud`, `filename`, `connection`, `diagram`, `phone` | Wizualne wprowadzenia i schematy dydaktyczne |

Etap jest zaznaczany jako ukończony po wykonaniu ocenianych aktywności i przejściu dalej. Otwarte odpowiedzi i działania poza stroną są samooceną. Można pominąć etap i wrócić do niego później, ale nie zostanie oznaczony jako ukończony.

## Filmy

`MicroVideo` przyjmuje `title`, `file`, `poster`, `captions` (ścieżka WebVTT), `transcript` (tekst) i `duration`. Po dodaniu rzeczywistego filmu uzupełnij napisy i transkrypcję. Sześć storyboardów znajduje się w `docs/video-storyboards/`. Nie są nagraniami.

## Prywatność

Brak kont i żądań wysyłających odpowiedzi do serwera. Stan znajduje się w `localStorage` pod kluczem `informatyka-praktycznie-v1`. Przycisk w stopce usuwa cały stan aplikacji po potwierdzeniu. Na współdzielonym stanowisku warto wyczyścić go po lekcji. Przy zablokowanym zapisie strona działa w pamięci do odświeżenia.

## Zakres zgodności treści

Cztery nazwy i cele pochodzą bezpośrednio od nauczyciela. Ćwiczenia są autorskim opracowaniem dostarczonego briefu, nie kopią podręcznika. Nie deklarujemy pełnego pokrycia rozdziałów podręcznika ani podstawy programowej na podstawie samych nazw tematów.

Weryfikacja kontekstu i technicznych zastrzeżeń:
- [MIGRA, Informatyka 1–3, warianty rozkładu dla technikum](https://sklep.migra.pl/informatyka-1-3.-podrecznik-dla-szkol-ponadpodstawowych.-zakres-podstawowy/)
- [Microsoft: port USB-C może nie obsługiwać obrazu](https://support.microsoft.com/en-us/surface/surface-dock/use-the-surface-usb-c-travel-hub)

Podane ceny i ogólne klasy procesorów to dane fikcyjnego zadania, nie aktualne oferty. Ocena aplikacji zależy od funkcji, uprawnień i konfiguracji. Schematy celowo upraszczają rzeczywiste systemy.
