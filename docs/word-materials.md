# Pakiet materiałów do Worda

Pliki w `public/materials/word/` są samodzielnymi dokumentami DOCX do pobrania ze strony lekcji i pracy w stacjonarnym Wordzie. Nie wymagają konta w chmurze. Tekst, dane i grafiki są autorskimi materiałami ćwiczeniowymi; dane wydarzeń i ankiet są fikcyjne. Grafiki można ponownie wykorzystywać w ramach materiałów tego repozytorium.

Generator: `scripts/build-word-materials.py` (Python, python-docx, Pillow, lxml; font Arial dostępny na macOS). Uruchom go z bibliotekami środowiska dokumentów. Nie uruchamia sam Worda i nie wymaga internetu. Pliki źródłowe grafik są w `public/materials/word/assets/`. Manifest `manifest.json` opisuje stan początkowy i oczekiwane operacje ucznia. Nie generuj w starterze gotowych pól, które uczeń ma dopiero wstawić.

| Lekcja | Plik i zawartość | Cel pracy |
|---|---|---|
| 28 | `lesson-28-start.docx`, Szkolny klub gier | Tytuły działów są pogrubionymi akapitami Normalny. Nadaj Nagłówek 1 działom Po co zakładamy klub, Zasady współpracy i Jak sprawdzimy efekty, a Nagłówek 2 podrozdziałom Pierwsze spotkanie, Role w zespole i Co przygotować. Dodaj nagłówek, stopkę z polem PAGE i zmodyfikuj styl Normalny. |
| 29 | `lesson-29-start.docx`, Organizacja szkolnego turnieju | Są już style Nagłówek 1 i 2. Zastąp tekst Miejsce na automatyczny spis treści rzeczywistym spisem. Sprawdź aktualizację całego spisu po zmianie tytułu i liczby stron. |
| 30 | `lesson-30-start.docx`, Strefa nauki w naszej szkole | Dwie oryginalne ilustracje, dwie rzeczywiste tabele Worda i dwa wykresy jako obrazy. Brak podpisów SEQ. Dodaj po dwa podpisy etykiet Ilustracja, Tabela i Wykres; następnie trzy spisy z odpowiednim filtrem etykiety. Ostatnia strona przeznaczona na spisy. |
| 31 | `lesson-31-start.docx`, Plan szkolnego wydarzenia | Początkowo jedna sekcja pionowa. Wyodrębnij Harmonogram do sekcji poziomej podziałami Następna strona. Po tabeli wróć do pionu. Porady dla organizatorów ustaw w dwóch kolumnach, po nich przywróć jedną kolumnę podziałem Ciągły. |
| 32 | `lesson-32-start.docx`, Zaproszenie na warsztaty | Brief zawiera dane odniesienia. Tekst zaproszenia ma dwie istniejące pary zmian usunięcie/wstawienie, śledzenie jest włączone. Poprawną zmianę sali 21→12 należy zaakceptować, zmianę 60→90 minut odrzucić. Pozostałe korekty uczeń wykonuje sam. |
| 33 | `lesson-33-start.docx`, Poradnik organizacji szkolnego wydarzenia | Rozwinięte treści, ilustracja, tabela harmonogramu i wykres. Uczeń przygotowuje poradnik 4–6 stron: spis, podpisy i spisy obiektów, nagłówek/stopkę, sekcję poziomą, recenzję koleżeńską oraz końcowe sprawdzenie. |

## Klucz recenzji do lekcji 32

Uzgodnione dane: 18 listopada 2026, godzina 14.00, sala 12, 60 minut, udział bezpłatny, zapisy do 16 listopada u opiekuna koła, uczniowie klas pierwszych. Zaakceptuj zmianę sali. Odrzuć wydłużenie do 90 minut. Ze śledzeniem popraw „płatny” na „bezpłatny”, 17 na 16 listopada i „sie” na „się”. Usuń lub zakwestionuj obietnicę certyfikatu, której nie ma w briefie. Do „Przynieś materiały” dodaj komentarz z prośbą o konkretne informacje. Starter nie zawiera gotowych komentarzy, aby uczeń utworzył własny.

Przed udostępnieniem nowej wersji uruchom renderowanie wszystkich sześciu plików narzędziem `render_docx.py` z umiejętności documents i obejrzyj wszystkie strony PNG. Obrazy renderowania i PDF pozostają poza repozytorium. Kontrola XML powinna potwierdzić 2 wstawienia i 2 usunięcia w lekcji 32, brak TOC w lekcji 29 oraz brak SEQ w lekcji 30.

## Weryfikacja wydania z 30 września 2026

Wszystkie sześć plików przeszło renderowanie dostarczonym LibreOffice i kontrolę wizualną każdej z 16 stron: lekcja 28 — 3 strony, 29 — 3, 30 — 4, 31 — 2, 32 — 1, 33 — 3. To liczba stron plików startowych; po wstawieniu spisów i sekcji zmienia się. Puste miejsca na spisy w lekcjach 29 i 30 są zamierzone. Lekcja 33 zaczyna się od 3 stron materiału, a docelowy poradnik z sekcjami i spisami ma mieć 4–6 stron. Nie stwierdzono obcięcia tekstu, nakładania elementów ani brakujących polskich znaków. Zmiany recenzyjne są widoczne w renderze. Kontrola archiwów ZIP i XML potwierdziła oczekiwane obiekty, dwie pary rzeczywistych zmian w lekcji 32 oraz brak gotowych pól spisów i podpisów w zadaniach 29–30. Renderowanie nie zastępuje interaktywnego testu w zainstalowanym Microsoft Word.
