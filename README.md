# Informatyka praktycznie

Interaktywne materiały dla klas 1–3 technikum: **34 lekcje — 14 w klasie 1, 10 w klasie 2 i 10 w klasie 3**. Aktualny katalog powstaje automatycznie z `content/lessons/`; numeracja na stronie jest osobna dla każdej klasy.

Nowy dział Worda (klasa 1, tematy 9–14) obejmuje style, nagłówki i stopki, spisy treści i obiektów, sekcje, recenzję oraz projekt poradnika. Instrukcje, sprawdzenie wiedzy i samoocena są na platformie, a uczniowie pracują w stacjonarnym Wordzie na sześciu przygotowanych plikach DOCX. Pięć lekcji trwa po 45 minut, projekt końcowy 2 × 45 minut. Każda ma plan nauczyciela, kryteria produktu i ewaluację.

Lekcja 7 klasy 1 prowadzi bezpośrednio do kursu Demagoga w nowej karcie (około 120 minut za cały kurs, praca na komputerze). Kolejność kontroluje `order` niezależnie od trwałego ID.

## Zasoby do projektowania lekcji

- [Podstawa programowa 2024, źródła i opracowania Migra](docs/podstawa-programowa/README.md) — tekst urzędowy, wymagania, mapowanie wszystkich lekcji i jawne luki; Python jako język realizacji.
- [Metody COVE Polska](docs/metodyka-cove.md) — obowiązkowy punkt odniesienia dla kolejnych scenariuszy.
- [Wspólny schemat lekcji](docs/lesson-blueprint.md) i [zasady pracy agentów](AGENTS.md) — wykorzystanie istniejącego layoutu i komponentów.
- [Scenariusze Word 28–30](docs/scenarios/word-28-30.md), [Word 31–33](docs/scenarios/word-31-33.md), [materiały i generator DOCX](docs/word-materials.md).

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
node --test tests/word-content.test.mjs
node scripts/check-curriculum.mjs
npm run build
npm run test:e2e
```

Testy przeglądarkowe używają zainstalowanego Chrome. Sprawdzają pełne przejście przez cztery lekcje, ponowne otwarcie, reset, błędną odpowiedź, pominięty etap, przeciąganie i alternatywę klikaniem, widoki 390/768 px, bezpośrednie adresy, pobieranie ZIP i automatyczne reguły dostępności axe. Nie zastępują oceny dydaktycznej w klasie ani ręcznego audytu wszystkich technologii wspomagających.

## Dane ucznia i ograniczenia

Brak kont i trackerów. Odpowiedzi nie są wysyłane do serwera. Odpowiedzi i postęp ćwiczeń są dostępne w bieżącej sesji strony i znikają po odświeżeniu. Prace DOCX uczeń zapisuje oddzielnie na komputerze.

Teksty otwarte i ćwiczenia poza stroną są jawnie oznaczoną samooceną. Plik MP4 w paczce jest dwusekundową planszą testową, a obrazy są planszami. Nie są to zdjęcia wydarzeń ani planowane filmy instruktażowe. Specyfikacje laptopów i ceny są fikcyjnymi przykładami do lekcji.

## Komputer 3D

Lekcja 1 zawiera autorski model geometryczny, rozkładanie, opisy dziewięciu elementów, gniazda płyty głównej, przepływ danych i cztery zadania wskazywania części. Moduł Three.js jest ładowany dopiero w odpowiednim etapie. Szczegóły: `docs/computer-explorer.md`.
