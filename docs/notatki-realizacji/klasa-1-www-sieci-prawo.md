# Klasa 1 — notatki do realizacji: strony WWW, sieci i bezpieczeństwo, prawo i projekty

Status: **notatki robocze (12.10.2026)**, przed opracowaniem lekcji. Tematy według `docs/rozklad-2026-2027.md` (cykl 2-letni technikum): WWW 18–21 (I półrocze), sieci i bezpieczeństwo 31–32, prawo/komunikacja/projekty 33–36 i 48 (II półrocze).
**Rzetelność:** kwerenda bez dostępu do stron źródłowych (WebFetch zablokowany) — fakty z wyników wyszukiwania. Pozycje oznaczone **[zweryfikować]** sprawdzić u źródła przed lekcją; narzędzia online przetestować w trybie incognito na komputerze w pracowni.

## Czego nie dublować (już jest)

- Phishing, SMS „dopłata”, 8080, incydent.cert.pl, login.gov.pl, 2FA przy logowaniu — lekcja 09 (e-usługi).
- Fake newsy, SIFT, bańka filtrująca — lekcja 07; kurs Demagoga — 34.
- Sieć szkolna (router, switch, AP, OSE) w formie helpdesku — lekcja 14 (klasa 3); w klasie 1 sieć **od strony pojęć i ruchu danych**, nie diagnostyki sprzętu szkolnego.

## Fakty i liczby do wykorzystania (stan 2026)

- **CERT Polska, raport za 2025** (8.04.2026): 658 320 zgłoszeń (~2 tys. dziennie), 260 783 incydenty (+152% r/r, częściowo lepsza detekcja), 97% to oszustwa komputerowe; phishing ok. 78 tys. **[zweryfikować w PDF]**; najczęstsze podszycia: OLX (28,5 tys.), Allegro (22,5 tys.); 295 tys. zgłoszonych SMS-ów, 244 tys. domen na Liście Ostrzeżeń. https://www.nask.pl/aktualnosci/prawie-2-tys-zgloszen-kazdego-dnia-raport-cert-polska-za-2025-rok ; raport NASK „Nie technologia, a emocje” (oszust gra emocjami).
- **NASK „Nastolatki 2025”** (badanie 2024, N=3665): ok. 5 h dziennie online, 7/10 używa AI (ChatGPT 53%), 48% do nauki; ~26% brało udział w challenge'ach (rodzice: 89% „moje dziecko nie”); cyberprzemoc 28%–„co trzeci”, ok. 47% ofiar nic nie robi **[zweryfikować w PDF]** https://www.nask.pl/media/2025/09/Nastolatki_RAPORT-2.pdf
- **Hasła w Polsce (NordPass 2025):** `admin`, `123456`, `zaq1@WSX`, `12345678`, `zaq12wsx`, `qweqwe123`, `Kocham12` **[kolejność zweryfikować]** — dobre do „zgadnij, dlaczego takie” (wzór z klawiatury).
- **Have I Been Pwned:** ~17,8 mld kont z ~1000 wycieków **[zweryfikować]**; sprawdzanie haseł przez k-anonimowość (wysyła się 5 znaków skrótu SHA-1) — wartościowe do wyjaśnienia „jak bezpiecznie sprawdzić hasło”.
- **Prawo:** pr. aut. art. 23 (dozwolony użytek osobisty — krąg bliskich, nie „cały internet”), art. 35; kk art. 267 (bezprawne uzyskanie informacji), 268a, 269a, 269b (narzędzia i hasła), 287 (oszustwo komputerowe) **[kary zweryfikować na eli.gov.pl]**; odpowiedzialność karna od 17 lat, wcześniej sprawy nieletnich **[zweryfikować]**; RODO — samodzielna zgoda na usługi online od 16 lat w PL **[zweryfikować]**; KSC (wdrożenie NIS2) w życie 3.04.2026 — prawo dla firm i instytucji; **AI Act**: od 2.02.2025 zakazane praktyki i kompetencje AI, od 2.08.2026 obowiązek oznaczania treści AI i deepfake'ów, bot musi się przedstawić.

## Strony WWW (18–21) — decyzja techniczna

Nauczyciel dopuszcza zewnętrzne edytory. Kwerenda: **Glitch nie działa od 07.2025**; Replit 13+ i <18 zgoda rodzica (odradzane); CodePen, JSFiddle, W3Schools Tryit — edycja zwykle bez konta, zapis/pobranie często z kontem **[zweryfikować w incognito]**; Netlify Drop — publikacja bez konta, ale znika po ok. 1 h (dobre na pokaz); Neocities, GitHub Pages, tiiny.host — wymagają konta (13+).
**Propozycja:** własny edytor na platformie (`htmlLab`: HTML/CSS z podglądem na żywo, podpowiedzi, zapis do pliku `.html` na dysk) jako ścieżka główna — bez konta i bez ryzyka blokady filtrów OSE; CodePen/W3Schools Tryit jako alternatywa dla chętnych; plik `.html` otwierany w przeglądarce + Notatnik jako wariant „jak naprawdę”. Publikacja w temacie 21: pokaz Netlify Drop (nauczyciel) lub jedno konto nauczyciela; uczeń dostaje link do strony klasowej.
Powiązanie: klasa 3 ma temat 31–32 (strona o Wyspach Kanaryjskich) — `htmlLab` posłuży obu klasom.

### 18. Tworzenie stron WWW – podstawowe informacje
- **Hak:** F12 na ulubionej stronie → zmień tekst nagłówka i zrób „fałszywy screen” → „HTML to tylko tekst; screenshot nie jest dowodem” (most do lekcji 07).
- **Treść:** klient–serwer, adres URL, HTTP/HTTPS, przeglądarka renderuje HTML; HTML = treść, CSS = wygląd, JS = zachowanie; zawody: front-end, back-end, UX (krótki dopasowywacz ról).
- **Zadanie:** „strona o mnie/o moim hobby w 10 minut” — gotowy szablon w `htmlLab`, uczeń zmienia treść; plan strony na kartce w parach (zlecenie: pizzeria, drużyna e-sportu, klasa).
- **Produkt:** pierwsza strona zapisana jako plik `.html`.
### 19. Stosowanie wybranych znaczników HTML
- **Zadania:** „napraw zepsutą stronę” (licznik błędów: niezamknięty `<p>`, brak `alt`, zła hierarchia nagłówków, zła ścieżka obrazka) — walidator w `htmlLab` liczy i podpowiada; wizytówka/CV/ulotka z listą, tabelą (grafik), linkami; `<figure>`/`<figcaption>`.
- **Para:** „dyktowanie z kartki” (jedna osoba dyktuje znaczniki, druga pisze; zamiana co 3 min).
- **Dostępność:** po co `alt` (demo czytnika ekranu), nagłówki jako spis treści.
- **Produkt:** wizytówka spełniająca listę kryteriów (sprawdzaną automatycznie).
### 20. Kaskadowe arkusze stylów CSS
- **Zadania:** „przebierz stronę” — ten sam HTML, trzy motywy (retro, dark, gaming) — uczeń zmienia tylko CSS; selektory, kolory, czcionki, odstępy, prosty układ (flex); kontrast i czytelność.
- **Rozgrzewka/bonus:** Flexbox Froggy, CSS Diner **[zweryfikować dostępność]**; inspiracja CSS Zen Garden.
- **Produkt:** własny motyw + głosowanie klasy na najlepszy baner/przycisk (bez oceniania).
### 21. Publikowanie i promowanie stron WWW
- **Treść:** hosting, domena, DNS (most do 31), `<title>`, `<meta description>`, SEO „po ludzku” (jak strona wygląda w wynikach wyszukiwania — podgląd w `htmlLab`).
- **Bezpieczeństwo publikacji:** co wolno umieścić (imię, zdjęcie, adres, szkoła) — RODO i wizerunek; licencje obrazów (most do 34).
- **Zadanie:** przygotowanie strony do publikacji (lista kontrolna), pokaz publikacji (Netlify Drop/konto nauczyciela); „co zrobić, gdy ktoś skopiuje moją stronę?”.
- **Produkt:** strona z poprawnym tytułem, opisem, licencją w stopce, gotowa do wysłania nauczycielowi jako plik.

## Sieci i bezpieczeństwo (31–32)

### 31. Sieci komputerowe
- **Hak:** „Wysyłasz zdjęcie na Snapa — ile krajów odwiedzi po drodze?” → `tracert` do wybranej strony w CMD i trasa na mapie.
- **Pomysły:** CS Unplugged „Routing and Deadlock” (pakiety na kartkach, uczniowie jako routery) https://classic.csunplugged.org/activities/routing-and-deadlock/ ; komendy w CMD na komputerze w pracowni: `ipconfig`, `ping`, `nslookup`, `tracert` (zadanie: „znajdź IP strony szkoły”); symulator na platformie (`netLab`): pakiety dzielone i składane, utrata pakietu, DNS jako „książka telefoniczna”, LAN/WAN, adres prywatny vs publiczny; test prędkości (np. speed.cloudflare.com **[zweryfikować]**). Wideo Code.org „How the Internet Works” **[zweryfikować]**.
- **Unikać dublowania:** topologii i klient–serwer/P2P (usunięte z PP), sprzętu szkolnego (lekcja 14).
- **Produkt:** „paszport pakietu” — trasa, IP, czas ping, wnioski.
### 32. Bezpieczeństwo i ochrona danych
- **Pomysły:** ranking najpopularniejszych haseł → „dlaczego takie?” → siła hasła (długość, menedżer haseł, fraza); jak działa sprawdzanie w haveibeenpwned bez ujawniania hasła (k-anonimowość); kopie zapasowe 3-2-1; aktualizacje; ransomware (case szpitala/szkoły), malware w „crackach” (most do 34); szyfrowanie (HTTPS, Wi-Fi WPA2/3, dysk); 2FA na koncie, którego uczeń naprawdę używa. Gotowe scenariusze: **Cyberlekcje 3.0** (Min. Cyfryzacji + NASK, ZPE) https://zpe.gov.pl/a/cyberlekcje-30/D59PlYj9b ; https://www.gov.pl/web/baza-wiedzy/cyberlekcje-30---siedem-nowych-scenariuszy ; Google Phishing Quiz (EN) **[zweryfikować]**.
- **Symulator:** „atak na fikcyjną firmę” — wybór zabezpieczeń przy ograniczonym budżecie, symulacja zdarzeń (kradzież laptopa, ransomware, wyciek haseł) → co ocalało. Most do kalkulatora PIN-ów z klasy 2 (liczba kombinacji).
- **Produkt:** osobisty plan „5 kroków bezpieczeństwa” + wynik symulacji.

## Prawo, komunikacja i projekty (33–36, 48)

Bloki projektowe (34, 36, 48) — praca w trójkach z rolami, jawne kryteria i ocena koleżeńska; produkt w Wordzie (most do bloku 28–33) lub jako strona z `htmlLab`.
### 33. Wybrane przepisy prawa dotyczące TIK
- **„Sąd klasowy”:** 5 przypadków (skopiowany cudzy kod, zdjęcie kolegi bez zgody, „pożyczone” hasło do dziennika, konto premium „od kolegi”, hejt w komentarzach, deepfake kolegi) → legalne / nielegalne / zależy + właściwy przepis. Tabela dozwolonego użytku (pobranie, streaming, screenshot, cytat, link). RODO: 3 zaskakujące rzeczy z polityki prywatności aplikacji (TikTok/Discord). AI Act: obowiązek oznaczania treści AI.
- Źródła: ZPE prawa autorskie https://zpe.gov.pl/a/samodzielne-korzystanie-z-wyszukanych-informacji-z-uwzglednieniem-poszanowania-praw-autorskich/D1r10s0PB ; UODO „Twoje Dane – Twoja Sprawa”.
### 34. Zasady rozpowszechniania programów komputerowych – projekt
- Karty licencji (freeware, shareware, open source, GPL, MIT, CC, EULA) dopasowywane do znanych programów (VLC, 7-Zip, Photoshop, Minecraft, Linux, Office); wybór licencji dla własnej strony z 19–21 (stopka z CC); wyszukiwanie grafik CC (Wikimedia Commons, Openverse); „freelancer negocjuje licencję z klientem”; pirackie oprogramowanie = ryzyko malware.
- Źródła: creativecommons.pl, otwartezasoby.pl, PARP o licencjach CC.
### 35. Komunikacja i wymiana informacji w Internecie
- Tabela „co do czego” (komunikator, e-mail, forum, wideorozmowa); **profesjonalny e-mail** do pracodawcy/szkoły (temat, powitanie, podpis — korzyść: praktyki zawodowe); netykieta i konflikt na grupie klasowej (skrót scenariusza ZPE „Cyberprzemoc”); gra **Bad News** (EN, techniki dezinformacji) **[zweryfikować]**; Demagog — sprawdź jedną wiadomość w 3 minuty.
### 36. Szanse i zagrożenia rozwoju informatyki i TIK – projekt
- Debata o AI w szkole (dane NASK: 7/10 nastolatków używa AI); „Mój dzień online” — własny czas przed ekranem vs średnia 5 h; mapa zawodów IT po technikum; dobrostan cyfrowy (anonimowa sonda). Produkt: plakat/infografika lub strona.
### 48. Przestępczość komputerowa – projekt
- Komiks/plakat „Anatomia oszustwa na BLIK/OLX” — gdzie można było przerwać; karty przepisów kk „po ludzku” dopasowane do scenek; ocena 5 domen z Listą Ostrzeżeń CERT; ćwiczenie zgłoszenia (8080, incydent.cert.pl, bank — instrukcja jest w lekcji 09); opcjonalnie spotkanie z NASK/policją (Cyberprofilaktyka.pl). Bez ćwiczeń „hakowania” cudzych systemów.

## Do rozstrzygnięcia przed budową

1. `htmlLab` na platformie jako ścieżka główna — czy wystarczy, czy nauczyciel chce pracy w konkretnym zewnętrznym edytorze (wtedy sprawdzić go w pracowni, w tym filtr OSE).
2. Publikacja stron uczniów (21): pokaz czy konto nauczyciela (Neocities/GitHub Pages) — RODO i wiek.
3. CMD w pracowni (`ping`, `tracert`, `nslookup`) — czy uczniowie mają dostęp do wiersza poleceń.
