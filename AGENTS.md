# Praca nad platformą Informatyka praktycznie

## Punkt odniesienia i aktualny stan

- Przed liczeniem i planowaniem lekcji sprawdź aktualny stan GitHuba (`git fetch origin`, porównanie z `origin/main`). Nie zakładaj, że lokalna kopia jest aktualna. Zachowaj cudze zmiany.
- Źródłem aktualnych lekcji jest `content/lessons/`. Archiwum i stare `blok-*.html` nie są aktywnym kursem.
- Czytaj `docs/podstawa-programowa/README.md`, mapę lekcji i luki. Zakres: PP 2024, liceum/technikum, podstawowy; język realizacji Python. Nie utożsamiaj go z podstawą szkoły branżowej.
- Po zmianie zakresu zajęć aktualizuj `docs/podstawa-programowa/mapowanie.json`, mapę czytelną i macierz pokrycia. Sprawdzaj konkretne czynności ucznia, nie sam tytuł tematu.

## Obowiązkowy zasób metodyczny

**Przy projektowaniu lub istotnej zmianie lekcji korzystaj z https://metodyka.covepolska.pl/.** Przeczytaj strony wybranych metod, a następnie przełóż je na realne czynności w scenariuszu. Sam link albo nazwa metody nie wystarczy.

- Najpierw przeczytaj `docs/metodyka-cove.md` i `docs/lesson-blueprint.md`.
- Dobieraj metody do celu i potrzeb uczniów. Różnorodność służy uczeniu się, nie ozdobie.
- Wpisz sprawdzone linki do `format.methods`, opisz organizację w `format`, a przebieg i reakcje nauczyciela w etapach.
- Jeżeli serwis jest niedostępny, korzystaj z zapisanej syntezy i jawnie odnotuj brak ponownej weryfikacji; nie wymyślaj zawartości stron ani dowodów skuteczności.

## Wykonanie i weryfikacja

- Zachowuj istniejącą aplikację React, nawigację etapów, widok nauczyciela i typy aktywności. Nie projektuj od zera layoutu kolejnej lekcji. Wspólne elementy rozszerzaj raz; zasady są w `docs/lesson-blueprint.md`.
- Stałe `id` jest unikalne w całym serwisie, natomiast numer wyświetlany zaczyna się od 1 w każdej klasie. Nie zmieniaj istniejących ID.
- Lekcje Worda zakładają **stacjonarny Word zainstalowany na komputerze**, nie symulator ani Word Online. Instrukcje, wyjaśnienia i testy są na platformie, produkt ucznia powstaje w DOCX. Szczegóły w `docs/word-desktop.md`.
- Samoocena, quiz i ocena rzeczywistego pliku to trzy różne rzeczy. Nie przedstawiaj zaznaczonej checklisty jako automatycznej weryfikacji dokumentu. Nie wysyłaj prac ani korespondencji bez odrębnego polecenia użytkownika.
- Materiały do pobrania twórz w `public/materials/`; uruchomienie build kopiuje je do katalogu publikacji. Pliki powinny być samodzielne i zawierać fikcyjne dane. Sprawdzaj strukturę DOCX oraz wygląd po renderowaniu.
- Walidacja: `node scripts/check-curriculum.mjs`, `npm test`, testy dotyczące zmienianych komponentów i `npm run build`. Sprawdź w przeglądarce nowy przebieg, telefon, pobranie plików i widok nauczyciela.
- GitHub Pages publikuje `main` z katalogu głównego, więc do publikacji muszą trafić także wyniki budowy, a nie tylko pliki `content/`.
