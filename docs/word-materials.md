# Pakiet materiałów do Worda

Pliki w `public/materials/word/` są samodzielnymi dokumentami DOCX do pobrania ze strony lekcji i pracy w stacjonarnym Wordzie. Nie wymagają konta w chmurze. Tekst, dane i grafiki są autorskimi materiałami ćwiczeniowymi; dane wydarzeń i ankiet są fikcyjne. Grafiki można ponownie wykorzystywać w ramach materiałów tego repozytorium.

Generator: `scripts/build-word-materials.py` (Python, python-docx, Pillow, lxml; font Arial dostępny na macOS). Uruchom go z bibliotekami środowiska dokumentów. Nie uruchamia sam Worda i nie wymaga internetu. Pliki źródłowe grafik są w `public/materials/word/assets/`. Manifest `manifest.json` opisuje stan początkowy i oczekiwane operacje ucznia. Nie generuj w starterze gotowych pól, które uczeń ma dopiero wstawić.

| Lekcja | Plik i zawartość | Cel pracy |
|---|---|---|
| 28 | `lesson-28-start.docx`, Szkolny klub gier | Tytuły działów są pogrubionymi akapitami Normalny. Nadaj Nagłówek 1 działom Po co zakładamy klub, Zasady współpracy i Jak sprawdzimy efekty, a Nagłówek 2 podrozdziałom Pierwsze spotkanie, Role w zespole i Co przygotować. Dodaj nagłówek, stopkę z polem PAGE i zmodyfikuj styl Normalny. |
| 29 | `lesson-29-start.docx`, Organizacja szkolnego turnieju | Są już style Nagłówek 1 i 2. Zastąp tekst Miejsce na automatyczny spis treści rzeczywistym spisem. Sprawdź aktualizację całego spisu po zmianie tytułu i liczby stron. |
| 30 | `lesson-30-start.docx`, Strefa nauki w naszej szkole | Dwie oryginalne ilustracje, dwie rzeczywiste tabele Worda i dwa wykresy jako obrazy. Brak podpisów SEQ. Dodaj po dwa podpisy etykiet Ilustracja, Tabela i Wykres; następnie trzy spisy z odpowiednim filtrem etykiety. Ostatnia strona przeznaczona na spisy. |
| 31 | `lesson-31-start.docx`, Plan szkolnego wydarzenia | Początkowo jedna sekcja pionowa. Wyodrębnij Harmonogram do sekcji poziomej podziałami Następna strona. Po tabeli wróć do pionu. Porady dla organizatorów ustaw w dwóch kolumnach, po nich przywróć jedną kolumnę podziałem Ciągły. |
| 32 | `lesson-32-start.docx`, Studniówka 2027 | Dwie strony: potwierdzone ustalenia i komunikat. Dwie gotowe pary usunięcie/wstawienie: Sala Bursztynowa→Ogrodowa (przyjmij), cena 490→590 zł (odrzuć). Samodzielne komentarze i własne śledzone korekty; dwa pliki końcowe. Generator izolowany: `scripts/build-word32-material.py`. |
| 33 | `lesson-33-start.docx`, Poradnik organizacji szkolnego wydarzenia | Rozwinięte treści, ilustracja, tabela harmonogramu i wykres. Uczeń przygotowuje poradnik 4–6 stron: spis, podpisy i spisy obiektów, nagłówek/stopkę, sekcję poziomą, recenzję koleżeńską oraz końcowe sprawdzenie. |

## Klucz recenzji do lekcji 32

Aktualizacja 8.11.2026: starter studniówkowy wyrenderowano i obejrzano na obu stronach. Ma 2 rzeczywiste wstawienia i 2 usunięcia oraz włączone śledzenie, bez początkowych komentarzy. Testy plików rozwiązanych obejmują 4 komentarze i 13 zmian w recenzji oraz czystą kopię z samym komunikatem. Nie wykonano interaktywnej próby w Windows LTSC 2024.

Ustalenia studniówki: 23 stycznia 2027 o 19.00, Sala Ogrodowa, 490 zł od osoby, zaliczka 150 zł do 8 grudnia. Brak potwierdzonego transportu. Odpowiedź w lekcji uściśla dietę: do 8 grudnia u wychowawcy. Uczeń poprawia „odbedzie”, zaliczkę 200→150 zł i termin 10→8 grudnia; usuwa obietnicę transportu i doprecyzowuje dietę ze śledzeniem. Cztery komentarze dotyczą transportu, sali, ceny i diety. Recenzja zachowuje historię, a osobna kopia dla uczestników jest czysta.

Przed udostępnieniem nowej wersji uruchom renderowanie wszystkich sześciu plików narzędziem `render_docx.py` z umiejętności documents i obejrzyj wszystkie strony PNG. Obrazy renderowania i PDF pozostają poza repozytorium. Kontrola XML powinna potwierdzić 2 wstawienia i 2 usunięcia w lekcji 32, brak TOC w lekcji 29 oraz brak SEQ w lekcji 30.

## Weryfikacja wydania z 30 września 2026

Wszystkie sześć plików przeszło renderowanie dostarczonym LibreOffice i kontrolę wizualną każdej z 16 stron: lekcja 28 — 3 strony, 29 — 3, 30 — 4, 31 — 2, 32 — 1, 33 — 3. To liczba stron plików startowych; po wstawieniu spisów i sekcji zmienia się. Puste miejsca na spisy w lekcjach 29 i 30 są zamierzone. Lekcja 33 zaczyna się od 3 stron materiału, a docelowy poradnik z sekcjami i spisami ma mieć 4–6 stron. Nie stwierdzono obcięcia tekstu, nakładania elementów ani brakujących polskich znaków. Zmiany recenzyjne są widoczne w renderze. Kontrola archiwów ZIP i XML potwierdziła oczekiwane obiekty, dwie pary rzeczywistych zmian w lekcji 32 oraz brak gotowych pól spisów i podpisów w zadaniach 29–30. Renderowanie nie zastępuje interaktywnego testu w zainstalowanym Microsoft Word.
