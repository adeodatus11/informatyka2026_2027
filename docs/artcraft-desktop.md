# Grafika 2D: PhotoCraft i VectorCraft na komputerach pracowni

Weryfikacja źródeł: **25.10.2026**. Dotyczy samodzielnych programów desktopowych, nie aplikacji ArtCraft do generowania obrazów przez AI. Funkcje poniżej potwierdzono w dokumentacji projektu i wydaniach; **nie wykonano testu na szkolnym Windows 11**. Przygotowane lekcje wymagają próby nauczyciela na konkretnym komputerze przed zajęciami.

## Wersje i właściwe instalatory

| Program | Najnowsze wydanie wskazane przez API GitHuba | Wydano (UTC) | Instalator Windows Intel/AMD 64-bit | Status projektu |
|---|---|---|---|---|
| PhotoCraft | **0.16.0** | 25.10.2026, 14:17 | `photocraft-0.16.0-windows-x64.msi` (ok. 75 MB) | early alpha |
| VectorCraft | **0.17.0** | 25.10.2026, 14:01 | `vectorcraft-0.17.0-windows-x64.msi` (ok. 107 MB) | aktywnie rozwijana alfa |

Źródła: [PhotoCraft 0.16.0 — pliki i zmiany](https://github.com/storytold/photocraft/releases/tag/v0.16.0), [VectorCraft 0.17.0 — pliki i zmiany](https://github.com/storytold/vectorcraft/releases/tag/v0.17.0), API wydań [PhotoCraft](https://api.github.com/repos/storytold/photocraft/releases/latest) i [VectorCraft](https://api.github.com/repos/storytold/vectorcraft/releases/latest).

**Uwaga na rozbieżność źródeł:** w czasie sprawdzania strony [PhotoCraft](https://getartcraft.com/apps/photocraft) i [VectorCraft](https://getartcraft.com/apps/vectorcraft) wyświetlały starsze wersje 0.10.0 i 0.13.1. Najnowsze numery i nazwy plików sprawdzono bezpośrednio w Releases. Oba repozytoria udostępniają licencję **MIT lub Apache-2.0**. Samodzielne programy służą do pracy lokalnej. PhotoCraft wprost opisuje selekcje działające bez konta i chmury; podstawowe ćwiczenia obu programów nie używają usług AI.

Nie pobieraj do tych lekcji programu ze strony [ArtCraft Download](https://getartcraft.com/download): jej procedura obejmuje konto i generowanie obrazów. To inny produkt. Nie zakładamy uczniom kont, nie wymagamy Discorda, launchera, płatnej subskrypcji ani integracji z agentem.

## Co można wykorzystać w lekcjach

### PhotoCraft — lekcje 99–101

[README wydania 0.16.0](https://github.com/storytold/photocraft/blob/v0.16.0/README.md) dokumentuje warstwy, tekst, podstawowe zaznaczenia, maski, kadrowanie i korekty obrazu. [Mierzona lista funkcji](https://github.com/storytold/photocraft/blob/v0.16.0/docs/scorecard.md) odróżnia funkcję dostępną od częściowej. Nie traktujemy samej obecności pozycji menu jako dowodu poprawnego działania.

| Obszar | Zakres ćwiczenia | Zapis i kontrola |
|---|---|---|
| Warstwy | Nowa warstwa, nazwa, kolejność, widoczność, krycie; tło, ilustracja i tekst | Zapis roboczy z warstwami do `.pcraft` lub PSD; zamknij kopię i otwórz ponownie |
| Selekcje | Prostokąt, elipsa, lasso wielokątne; zaznaczenie prostego obiektu na jednolitym tle | Obejrzyj brzeg przy powiększeniu; nie wymagamy automatycznej segmentacji |
| Maski | Zaznaczenie jako maska warstwy; ukrycie fragmentu bez kasowania oryginału | Sprawdź miniaturę maski i możliwość odzyskania ukrytego fragmentu |
| Korekty | Kadrowanie, rozmiar obrazu, prosta jasność/kontrast albo warstwa dopasowania | Porównanie kopii przed i po; nie wymagamy RAW, profilu drukarni ani profesjonalnego soft proofingu |
| Eksport | PNG z przezroczystością; JPEG dla obrazu z pełnym tłem | Otwórz eksport w innym podglądzie, sprawdź rozmiar w pikselach i wagę |
| SVG | Import jest dostępny, ale część obiektów może zostać zrasteryzowana | **Nie wymagamy eksportu SVG z PhotoCraft**; właściwy program wektorowy to VectorCraft |

Nie utożsamiamy **maski warstwy** z maską Smart Filter. Malowanie maski Smart Filter jest oznaczone jako brakujące w scorecard; nie jest zadaniem ucznia. Korekty i maski zwykłej warstwy mają osobne mechanizmy. Zaawansowanego obiegu PSD nie obiecujemy: część filtrów i ustawień nie zachowuje pełnej zgodności przy wymianie plików.

### VectorCraft — lekcje 102–104

[README wydania 0.17.0](https://github.com/storytold/vectorcraft/blob/v0.17.0/README.md) oraz [ocena funkcji](https://github.com/storytold/vectorcraft/blob/v0.17.0/docs/target-app-parity.md) opisują figury, pióro, punkty ścieżek, wypełnienie i obrys, warstwy, przekształcenia i otwarte formaty. [Lista luk](https://github.com/storytold/vectorcraft/blob/v0.17.0/docs/gaps.md) pozostaje istotna także przy nowszym numerze wydania.

| Obszar | Zakres ćwiczenia | Zapis i kontrola |
|---|---|---|
| Figury | Prostokąt, elipsa, wypełnienie i obrys; ikona z kilku kształtów | Powiększ grafikę, porównaj z rastrem; obiekty pozostają osobno edytowalne |
| Ścieżki | Prosta zamknięta ścieżka piórem, przesunięcie punktu, ewentualne uchwyty krzywej | Sprawdź zamknięcie obrysu i możliwość poprawy pojedynczego punktu |
| Przekształcenia i warstwy | Kopiowanie, skalowanie, obrót, kolejność obiektów, osobne warstwy | Prosty rysunek przestrzenny tworzymy z płaskich figur; nie jest to model CAD ani geometria 3D |
| Maski | Projekt ma maski przycinania, ale są otwarte zgłoszenia dotyczące obsługi | **Nie są wymagane w lekcjach 102–104** |
| Eksport | SVG, PNG i JPEG; natywny plik `.vectorcraft` | Zachowaj natywną kopię i SVG. Otwórz SVG w przeglądarce; PNG służy do porównania, nie zastępuje edytowalnego wektora |

Nie wymagamy wymiany `.ai`, efektów 3D, siatek gradientowych ani złożonej typografii. Dokumentacja producenta nadal opisuje luki zgodności i zachowania narzędzi; nie przedstawiamy programu jako pełnego zamiennika Illustratora.

## Znane ryzyka i wariant awaryjny

Stan zgłoszeń sprawdzony 25.10.2026; zgłoszenie użytkownika nie oznacza błędu na każdym komputerze.

- [PhotoCraft #9508](https://github.com/storytold/photocraft/issues/9508): zgłoszony crash wersji 0.16.0 podczas otwierania plików PSD/JPG. **Nowość wydania nie oznacza rekomendacji natychmiastowego wdrożenia**. Jeżeli próba otwierania i ponownego zapisu nie przejdzie, użyj sprawdzonej starszej wersji lub szkolnego GIMP-a.
- [PhotoCraft #209](https://github.com/storytold/photocraft/issues/209): dokumentowane problemy wydajności, szczególnie przy dużych obrazach i licznych warstwach. Materiały lekcji mają mały rozmiar; nie importuj zdjęć 20 MP tylko do miniatury.
- [VectorCraft #4120](https://github.com/storytold/vectorcraft/issues/4120): zgłoszona niesprawność skrótu maski przycinania Ctrl+7. Nie wymagamy masek.
- [VectorCraft #4118](https://github.com/storytold/vectorcraft/issues/4118): Ctrl+L w czasie edycji tekstu może wywołać dodawanie warstwy dwukrotnie. Zakończ edycję tekstu i korzystaj z menu/panelu.
- [VectorCraft #4145](https://github.com/storytold/vectorcraft/issues/4145): zgłoszony skok użycia RAM przy otwieraniu projektu. Stosujemy kilka prostych obiektów i zapisujemy kolejne kopie.

**DO WERYFIKACJI w pracowni:** GIMP dla 99–101 i Inkscape dla 102–104, jeżeli są zainstalowane i przeszły próbę na materiałach. Cel, produkt i kryteria zostają te same; nauczyciel pokazuje odpowiednie narzędzie zastępcze. Nie każ uczniowi instalować programu w czasie 45 minut. Jeżeli żaden edytor nie działa, nie zaliczaj samego quizu jako wykonanej grafiki; przełóż część praktyczną.

## Instalacja i próba administratora pracowni

1. Sprawdź Windows 11 oraz architekturę urządzeń. Dla Intel/AMD wybierz **x64 MSI**, dla ARM istnieje osobna paczka. Pobierz konkretne wydanie z podlinkowanych Releases, razem z `SHA256SUMS.txt`. Zapisz numer wersji w dokumentacji pracowni.
2. Porównaj SHA-256 pobranego MSI z plikiem sum kontrolnych (np. `Get-FileHash` w PowerShell). Sprawdź podpis we właściwościach pliku. Instalację wykonuje administrator zgodnie z zasadami szkoły; nie wyłączamy kontroli aplikacji na komputerach uczniów.
3. Zainstaluj na jednym stanowisku. Uruchom ze zwykłego konta ucznia, bez logowania do ArtCraft. Nie konfiguruj AI, usług chmurowych ani serwera MCP. Sprawdź również pracę bez połączenia z internetem po instalacji.
4. Otwórz materiały lekcji 99–104. W PhotoCraft sprawdź: nową warstwę, tekst, zaznaczenie, maskę warstwy, kadrowanie i eksport PNG/JPEG. W VectorCraft: figurę, pióro, punkt ścieżki, obrót, warstwę oraz zapis SVG. Ponownie otwórz zapis roboczy i plik eksportowany. **To próba odbiorcza, a nie czynność już wykonana przez autora lekcji.**
5. Sprawdź zapis w folderze dostępnym uczniowi oraz polskie znaki w podpisie. Współdzielone stanowisko nie może zapisywać pracy w cudzym katalogu. Oryginały materiałów pozostają nietknięte; uczeń zaczyna od kopii z własną nazwą.
6. Przy problemie z pustym/czarnym oknem sprawdź sterownik grafiki i wymagania backendu opisane w dokumentacji [PhotoCraft](https://github.com/storytold/photocraft/blob/v0.16.0/docs/development.md) oraz [VectorCraft](https://github.com/storytold/vectorcraft/blob/v0.17.0/docs/development.md). Brak wspólnie opublikowanego, wiarygodnego minimum RAM/GPU dla obu tych wydań — nie przenosimy wymagań osobnego programu ArtCraft AI na PhotoCraft/VectorCraft.
7. Po pozytywnej próbie rozprowadź tę samą wersję na pozostałe stanowiska. Zachowaj sprawdzone instalatory i wersję awaryjną. Nie aktualizuj całej sali bez ponownego otwarcia materiałów i sprawdzenia eksportu.

## Ocenianie i przebieg lekcji

Platforma prowadzi instrukcją `wordSteps`, udostępnia pliki i pokazuje kryteria `wordRubric`. Uczeń przedstawia nauczycielowi **plik roboczy oraz eksport**. Checklista jest samooceną, a quiz sprawdza pojęcia; żaden z nich nie analizuje automatycznie obrazu ani warstw. Karta wyniku ma `hideGrade:true`. Stopień ustala nauczyciel po obejrzeniu rzeczywistego produktu.

Metody COVE odczytane 25.10.2026: [modelowanie](https://metodyka.covepolska.pl/metoda-modelowanie.html), [ocenianie kształtujące i poprawa](https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html), [przypominanie i powroty](https://metodyka.covepolska.pl/metoda-przypominanie-i-powroty.html), [problem, przypadek, projekt](https://metodyka.covepolska.pl/metoda-problem-projekt-przypadek.html). Praktyka: najpierw krótki pokaz decyzji na innym pliku, potem własna próba, jedno jawne kryterium do poprawy i wydzielony czas na poprawiony eksport. Powtórki z poprzedniej lekcji nie zastępują produktu.
