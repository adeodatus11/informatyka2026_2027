-- LEKCJA 05. SQLite. Wszystkie osoby i terminy są fikcyjne.
-- A. W nowej, pustej bazie gabinet.db uruchom TYLKO część A (do COMMIT).
-- Nie uruchamiaj części A drugi raz w tej samej bazie.
PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE Pacjenci (
    id_pacjenta INTEGER PRIMARY KEY,
    imie TEXT NOT NULL,
    nazwisko TEXT NOT NULL
);
CREATE TABLE Wizyty (
    id_wizyty INTEGER PRIMARY KEY,
    id_pacjenta INTEGER NOT NULL,
    termin TEXT NOT NULL,
    cel TEXT NOT NULL,
    FOREIGN KEY (id_pacjenta) REFERENCES Pacjenci(id_pacjenta)
);
INSERT INTO Pacjenci (id_pacjenta, imie, nazwisko) VALUES
    (1, 'Ada', 'Testowa'),
    (2, 'Jan', 'Przykładowy'),
    (3, 'Ewa', 'Modelowa');
INSERT INTO Wizyty (id_wizyty, id_pacjenta, termin, cel) VALUES
    (1, 1, '2026-09-21 09:00', 'przegląd'),
    (2, 2, '2026-09-21 09:30', 'kontrola'),
    (3, 1, '2026-09-22 11:00', 'kontrola'),
    (4, 3, '2026-09-21 10:00', 'przegląd');
COMMIT;

-- B. ZADANIE. Napisz własne polecenie INSERT INTO Wizyty, wzorując się
-- na części A. Dodaj: id_wizyty 5, id_pacjenta 1,
-- termin '2026-09-23 10:00', cel 'kontrola'.
-- Uruchom tylko własne polecenie. Zapisz zmiany w edytorze.
-- Po ponownym otwarciu bazy włącz PRAGMA foreign_keys = ON;
-- To ustawienie dotyczy połączenia, nie jest zapisywane na stałe w pliku.

-- C. Uruchamiaj każde zapytanie osobno, zaznaczając je w edytorze.
SELECT COUNT(*) AS liczba_pacjentow FROM Pacjenci;
SELECT COUNT(*) AS liczba_wizyt FROM Wizyty;
-- Oczekiwane liczby: 3 pacjentów i 5 wizyt po części B (4 przed nią).

SELECT w.termin, p.imie, p.nazwisko, w.cel
FROM Wizyty AS w
JOIN Pacjenci AS p ON w.id_pacjenta = p.id_pacjenta
WHERE w.termin >= '2026-09-21 00:00' AND w.termin < '2026-09-22 00:00'
ORDER BY w.termin;
-- Wynik: 09:00 Ada Testowa; 09:30 Jan Przykładowy; 10:00 Ewa Modelowa.
-- Zmień cały warunek WHERE na p.id_pacjenta = 1.
-- Wynik po części B: trzy wizyty Ady, 21, 22 i 23 września.

-- Model ćwiczeniowy: nie sprawdza poprawności dat, czasu trwania,
-- nakładania się wizyt ani uprawnień pracowników.
