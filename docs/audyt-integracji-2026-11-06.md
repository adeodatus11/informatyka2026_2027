# Audyt integracji 6.11.2026

Zakres: PR #24–#29, połączenie 32 nowych lekcji z main, zachowanie dotychczasowych 76. Trzej agenci niezależnie sprawdzili Python, grafikę oraz robotykę/WWW.

## Potwierdzone wyniki

- Mapa programu: 108 lekcji, klasy 60/23/25, 28 punktów PP.
- Testy treści: 114/114; numeracja: 3/3.
- Nowe testy logiki i rzeczywistego Pythona w Pyodide: 62/62.
- Każda z 32 nowych lekcji: przejście etapów i karta wyniku w Playwright, axe i kontrola konsoli. Rozwiązania programistyczne sprawdzono testami Pyodide; nie deklarujemy ręcznego rozwiązania wszystkich ćwiczeń w przeglądarce.
- Grafika: 72 kombinacje etap/szerokość (1366/390), pobrania HTTP 200, widoki nauczyciela, bez overflow i naruszeń axe.
- Końcowy build: dodatkowa regresja computer/phone/robot-config/word 12/12; lekcja 43 i robot-config niezależnie 4/4.
- Build produkcyjny poprawny; wszystkie 32 pliki lekcji i 12 nowych materiałów zachowane względem gałęzi źródłowych. Obejrzano zrzuty końcowej wersji 1366/390.

## Poprawiony błąd

Końcowa regresja: pełny zestaw dał 107 zaliczonych przypadków przed przerwaniem długiego zbiorczego testu mobile/teacher (13,8 min; zatrzymany podczas axe po PDF). Lekcja 43 trafiła na chwilową przebudowę dist i została powtórzona poprawnie na końcowym buildzie. Osobny ukończony przebieg potwierdził każdy etap wszystkich 107 lekcji wewnętrznych na 390/768 px, brak overflow oraz wszystkie 107 widoków nauczyciela z axe WCAG 2.1 AA i brak błędów JS. Kurs Demagoga jest zewnętrzny. Dwa testy resetu/postępu przeszły 2/2. Nie przedstawiamy przerwanego zbiorczego zestawu jako w całości zielonego; generowania wszystkich PDF-ów nie potwierdzono.

Asynchroniczny wynik robotLab mógł nadpisać kod edytowany podczas obliczeń. Licznik rewizji odrzuca wynik starszego programu, także po edycji i cofnięciu; zapis zachowuje najnowszy scenariusz. Trzy regresje sprawdzają edycję, cofnięcie edycji i import konfiguracji.

## Granice kontroli

Edytory ArtCraft są wersjami alfa; działanie przypiętych wersji na szkolnym Windows i rzeczywiste pliki ucznia wymagają próby w pracowni. Symulator robota nie potwierdza działania fizycznych zestawów. Znany starszy test dental.spec.js:7 oczekuje nieaktualnego przycisku i pozostaje osobnym zadaniem. npm audit zgłasza dwie istniejące podatności high narzędzi budowania; nie aktualizowano zależności w audycie lekcji.

Projekt e-usług klasy 1 pominięty decyzją nauczyciela. Pozostaje 12 tematów grafiki 3D klas 2–3, opisanych w notatce kierunkowej: proste modelowanie online, eksport STL, wybrane modele do wydruku przez nauczyciela.
