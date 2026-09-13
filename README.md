# Informatyka praktycznie

Interaktywne materiały dla klasy 1 technikum. Cztery tematy i cele wskazane przez nauczyciela:

1. **Komputer**: ocenić parametry komputera i dobrać sprzęt do potrzeb.
2. **System i oprogramowanie**: sprawnie zarządzać plikami, folderami i aplikacjami.
3. **Urządzenia w szkole**: podłączyć urządzenie i wykonać podstawową diagnostykę.
4. **Urządzenia w domu**: rozumieć, jak urządzenia komunikują się i wykorzystują dane.

Każda lekcja ma sześć etapów, około 30 minut pracy, interaktywne zadania z informacją zwrotną, postęp lokalny, panel prowadzącego oraz plan do druku. Klasy 2 i 3 są przygotowane na kolejne materiały.

## Uruchomienie

Wymagany Node.js zgodny z Vite (budowę sprawdzono z Node 24).

```sh
npm ci
npm run dev
```

## Budowanie i podgląd

```sh
npm run build
npm run serve
```

Podgląd produkcyjny: `http://127.0.0.1:4174/informatyka2026_2027/`.

Vite tworzy `dist/`. Skrypt budowy kopiuje gotowy serwis do katalogu głównego repozytorium, zachowując dotychczasową konfigurację GitHub Pages. Tworzy też bezpośrednie strony `lesson/01/` oraz `teacher/lesson/01/` i odpowiedniki dla pozostałych lekcji. Wszystkie zasoby działają w podkatalogu projektu. Samo budowanie nie publikuje zmian na GitHub.

Publiczny adres projektu: https://informatyka.szkolamistrzow.info/

Publikacja odbywa się przez dotychczasowy mechanizm GitHub Pages po wysłaniu zmian do odpowiedniej gałęzi repozytorium. Domena własna jest utrzymywana w `public/CNAME`; GitHub Pages publikuje gałąź `main`, katalog główny.

## Układ plików

- `app/`: aplikacja React i CSS.
- `components/`: wspólne komponenty ćwiczeń i widoki nauczyciela.
- `content/lessons/`: pliki treści lekcji, automatycznie wykrywane podczas budowy.
- `public/materials/lesson-02-files.zip`: 10 prawidłowych plików testowych.
- `public/videos/`: miejsce na przyszłe nagrania.
- `docs/video-storyboards/`: sześć scenariuszy mikrofilmów.
- `docs/content-guide.md`: instrukcja dodawania tematów i opis danych.
- `docs/visual-assets.md`: inwentarz ikon, schematów i dalszych materiałów.
- `archiwum/wersja-2026-09-13/`: pełna poprzednia strona, materiały, prezentacje i skrypty, także wcześniejsze lokalne zmiany.

Archiwum nie jest podlinkowane w interfejsie. Pozostaje częścią repozytorium i może być dostępne przez znany adres po publikacji; nie jest prywatnym magazynem.

## Testy

```sh
npm test
npm run build
npm run test:e2e
```

Testy przeglądarkowe używają zainstalowanego Chrome. Sprawdzają pełne przejście przez cztery lekcje, ponowne otwarcie, reset, błędną odpowiedź, pominięty etap, przeciąganie i alternatywę klikaniem, widoki 390/768 px, bezpośrednie adresy, pobieranie ZIP i automatyczne reguły dostępności axe. Nie zastępują oceny dydaktycznej w klasie ani ręcznego audytu wszystkich technologii wspomagających.

## Dane ucznia i ograniczenia

Brak kont i trackerów. Odpowiedzi nie są wysyłane do serwera. Stan jest zapisywany w `localStorage`; przy blokadzie pamięci lokalnej działa do odświeżenia strony. Przycisk w stopce czyści postęp po potwierdzeniu.

Teksty otwarte i ćwiczenia poza stroną są jawnie oznaczoną samooceną. Plik MP4 w paczce jest dwusekundową planszą testową, a obrazy są planszami. Nie są to zdjęcia wydarzeń ani planowane filmy instruktażowe. Specyfikacje laptopów i ceny są fikcyjnymi przykładami do lekcji.

## Komputer 3D

Lekcja 1 zawiera autorski model geometryczny, rozkładanie, opisy dziewięciu elementów, gniazda płyty głównej, przepływ danych i cztery zadania wskazywania części. Moduł Three.js jest ładowany dopiero w odpowiednim etapie. Szczegóły: `docs/computer-explorer.md`.
