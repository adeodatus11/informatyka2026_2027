# Komputer 3D

Autorski, uproszczony model geometryczny zbudowany w Three.js / React Three Fiber. Nie korzysta z zewnętrznych modeli ani tekstur. To pomoc dydaktyczna, nie instrukcja montażu ani wierny model konkretnego producenta.

- `content/computer.js`: opisy, pozycje złożone i rozłożone, gniazda, zadania i scenariusz współpracy.
- `components/computer/ComputerModel.jsx`: geometria i animowane grupy części.
- `ComputerScene.jsx`: oświetlenie, kamera i OrbitControls.
- `ComputerExplorer.jsx`: panel informacji, lista dostępna klawiaturą, zadanie i prezentacja.

Model można zastąpić licencjonowanym GLB przez adapter GLBPart i metadane computerModelAsset. Każdy podzespół wymaga osobnego węzła o nazwie modelNode i lokalnej geometrii wyśrodkowanej względem położenia części. Przed użyciem trzeba podać źródło i licencję oraz dopasować skalę i położenia. Aktualnie url jest null, używana jest wyłącznie oryginalna geometria.

Mysz: obrót przeciągnięciem, zoom kółkiem, wybór kliknięciem. Dotyk: jeden palec obraca, dwa przybliżają, tap wybiera. Lista udostępnia te same opisy i zadanie klawiaturą, również bez WebGL. Preferencja ograniczenia ruchu wyłącza interpolację. Tryb prezentacji używa pełnego ekranu, z zapasowym widokiem CSS.

Smartfon jest zapowiedzianym kolejnym modułem. Dostępne teraz porównanie wyjaśnia wspólne funkcje PC i telefonu; nie udaje gotowego modelu 3D telefonu.
