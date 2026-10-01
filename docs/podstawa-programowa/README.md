# Stały punkt odniesienia: informatyka PP 2024 + Python

**Zakres podstawowy, liceum i technikum; źródła prawne sprawdzono 30 września 2026, mapę uaktualniono 1 października 2026.** Mapa obejmuje 33 lekcje: 13 w klasie 1, 10 w klasie 2, 10 w klasie 3. Audyt 27 istniejących lekcji oparto na GitHub `main`, commit `91bffa3`; następnie dodano sześć lekcji Worda (ID 28–33).

## Zawartość

- [Podstawa 2024 — wymagania szczegółowe](podstawa-2024.md): pełne brzmienie zakresu podstawowego, z numerami do mapowania.
- [Tekst urzędowy — cały dział Informatyka](tekst-urzedowy-2024.txt): cele ogólne, oba zakresy i warunki realizacji; wyciąg z PDF Dziennika Ustaw, strony 341–351.
- [Mapa wszystkich 33 lekcji](mapa-lekcji.md): numer w klasie, stałe ID, wymagania, dowody w ćwiczeniach i ograniczenia.
- [Pokrycie wymagań i dalsza ścieżka Pythona](pokrycie-i-python.md): co już jest, czego brakuje, czego nie należy zaliczać na wyrost.
- [Materiały Migry](migra.md): konkretne programy i rozkłady, wersje z Pythonem oraz sposób wykorzystania.
- [Wymagania JSON](wymagania.json), [mapowanie JSON](mapowanie.json), [rejestr źródeł](zrodla.json): dane do dalszego rozwijania repozytorium.

Nowy dział Worda zakłada pracę w programie stacjonarnym i weryfikację rzeczywistych plików DOCX. Zobacz [zasady pracy i oceny](../word-desktop.md), [materiały do pobrania](../word-materials.md) oraz [obowiązkowy zasób metod COVE](../metodyka-cove.md).

## Status prawny i zakres

Źródłem nadrzędnym jest [rozporządzenie MEN z 28.06.2024, Dz.U. 2024 poz. 1019](https://eli.gov.pl/eli/DU/2024/1019/ogl), załącznik nr 1 dotyczący liceum i technikum. Zmienia ono [rozporządzenie z 30.01.2018, Dz.U. poz. 467](https://eli.gov.pl/eli/DU/2018/467/ogl). Wersję 2024 stosuje się od roku szkolnego 2024/2025 (§ 2), a rozporządzenie weszło w życie 1.09.2024 (§ 7).

Sprawdzono późniejsze akty zmieniające wykazane w [metadanych ELI aktu z 2018](https://api.sejm.gov.pl/eli/acts/DU/2018/467): [2025 poz. 382](https://eli.gov.pl/eli/DU/2025/382/ogl) dotyczy edukacji obywatelskiej i zdrowotnej, [2025 poz. 1035](https://eli.gov.pl/eli/DU/2025/1035/ogl) wychowania fizycznego, a [2026 poz. 947](https://eli.gov.pl/eli/DU/2026/947/ogl) edukacji zdrowotnej. Nie zmieniają wymagań działu Informatyka. Dla tego działu punktem odniesienia pozostaje zatem brzmienie z 2024 r. Data sprawdzenia nie oznacza automatycznej aktualizacji w przyszłości.

Ten katalog **nie mapuje branżowej szkoły I ani II stopnia**. Nie należy przenosić do nich numeracji wymagań LO/technikum. Nie ustala też wymiaru godzin ani planu dla konkretnego rocznika — to wymaga szkolnego planu nauczania. Warianty rozkładu wydawcy dla cyklu dwuletniego i trzyletniego są oddzielone w katalogu Migry.

**Python to przyjęty język realizacji**, nie nazwa osobnej podstawy programowej. Uczeń powinien sam rozwiązywać problemy, pisać i testować programy. Podstawa obejmuje także aplikacje użytkowe, urządzenia, współpracę, prawo i bezpieczeństwo.

## Hierarchia źródeł

1. Tekst ogłoszony w Dzienniku Ustaw i późniejsze zmiany — obowiązujące wymagania.
2. Materiały Migry — opracowania dydaktyczne, program i propozycje rozkładu.
3. Nasza mapa — autorska ocena istniejących ćwiczeń, aktualizowana wraz z lekcjami.

Opracowanie Migry z zaznaczonymi usunięciami nie jest czystym tekstem aktualnej podstawy: kopiowanie samej warstwy tekstowej PDF może przywrócić treści przekreślone. Numerację mapy sprawdzono bezpośrednio w urzędowym PDF. [ZPE](https://zpe.gov.pl/podstawa-programowa/szkola-ponadpodstawowa/informatyka) jest pomocniczym punktem dostępu; przy rozbieżności rozstrzyga Dziennik Ustaw.

Starsze `archiwum/wersja-2026-09-13/podstawa.html` jest materiałem historycznym, nie źródłem aktualnej mapy. Nie utożsamiać archiwalnych bloków z obecnymi lekcjami `content/lessons/`.

## Zasada dalszej pracy

Przed tworzeniem lekcji sprawdź wymaganie i istniejące pokrycie. Po zmianie aktualizuj mapę wraz z ograniczeniami. Zachowuj stałe ID; numery widoczne dla ucznia zaczynają się od 1 w każdej klasie. Używaj słów „częściowo” i „brak” tam, gdzie nie ma dowodów pełnego zakresu. Nie wyliczaj procentowej realizacji PP z liczby tematów lub ekranów.

Walidacja: `node scripts/check-curriculum.mjs` (z katalogu głównego repozytorium).
