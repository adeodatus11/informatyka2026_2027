# Komputer 3D

Autorski, uproszczony model geometryczny zbudowany w Three.js / React Three Fiber. Nie korzysta z zewnętrznych modeli ani tekstur. To pomoc dydaktyczna, nie instrukcja montażu ani wierny model konkretnego producenta.

- `content/computer.js`: opisy, pozycje złożone i rozłożone, gniazda, zadania i scenariusz współpracy.
- `components/computer/ComputerModel.jsx`: geometria i animowane grupy części.
- `ComputerScene.jsx`: oświetlenie, kamera i OrbitControls.
- `ComputerExplorer.jsx`: panel informacji, lista dostępna klawiaturą, zadanie i prezentacja.

Model można zastąpić licencjonowanym GLB przez adapter GLBPart i metadane computerModelAsset. Każdy podzespół wymaga osobnego węzła o nazwie modelNode i lokalnej geometrii wyśrodkowanej względem położenia części. Przed użyciem trzeba podać źródło i licencję oraz dopasować skalę i położenia. Aktualnie url jest null, używana jest wyłącznie oryginalna geometria.

Mysz: obrót przeciągnięciem, zoom kółkiem, wybór kliknięciem. Dotyk: jeden palec obraca, dwa przybliżają, tap wybiera. Lista udostępnia te same opisy i zadanie klawiaturą, również bez WebGL. Preferencja ograniczenia ruchu wyłącza interpolację. Tryb prezentacji używa pełnego ekranu, z zapasowym widokiem CSS.

## iPhone jako komputer

Pod modelem PC przycisk „Porównaj z iPhonem” ładuje osobny moduł PhoneExplorer. Dziesięć elementów obejmuje ekran, obudowę, płytę, SoC, RAM, flash, akumulator, aparaty, warstwę cieplną i moduł audio/port. Model jest autorską geometrią, inspirowaną ogólną konstrukcją iPhone’a, bez deklarowania zgodności z konkretną generacją. Dane i pozycje: content/phone.js; geometria: PhoneModel.jsx. Animacja, kamera i obsługa dotyku współdzielone z komputerem. Rozsunięcie układów jest wyłącznie dydaktyczne.

Źródła do porównania funkcji i konstrukcji:
- https://support.apple.com/en-gb/104900 (instrukcja iPhone 15, widok wnętrza)
- https://support.apple.com/en-jo/121031 (CPU i GPU jako części A18 Pro)

Wariant bez WebGL udostępnia listę, nazwy i komplet opisów. Brak modeli i tekstur pobranych z zewnętrznych bibliotek.
