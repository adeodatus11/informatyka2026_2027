# Tinkercad i lokalny wydruk na Bambu Lab H2C

Stan źródeł: 6.11.2026. Dotyczy bloku modelowania klas 2 i 3. Uczeń tworzy model w przeglądarce i pokazuje jego poprawioną wersję; wybrane prace nauczyciel może wydrukować lokalnie. Wydruk nie jest warunkiem ukończenia lekcji.

## Przygotowanie pracowni

Tinkercad jest zewnętrzną usługą internetową. Nauczyciel potrzebuje konta i przygotowanego Classroom. Uczniom nadaje pseudonimy, przekazuje link lub kod klasy i sprawdza wejście na stanowisku ucznia przed zajęciami. Autodesk dopuszcza dołączenie pseudonimem bez indywidualnej rejestracji konta ucznia. To nie oznacza pracy lokalnej: projekty i dane usługi są przetwarzane w chmurze. Pozostaw Safe Mode włączony; w pracach używamy fikcyjnych nazw i kodów projektu, bez danych osobowych. Podstawa: [Autodesk, sekcje 4–5](https://www.autodesk.com/company/legal-notices-trademarks/privacy-statement/childrens-privacy-statement).

Przed pierwszą lekcją sprawdź na szkolnym koncie ucznia: wejście do klasy, utworzenie projektu, zmianę wymiarów bryły, grupowanie bryły i otworu, pobranie STL oraz powrót do projektu. Przygotuj nazwę klasy i pseudonimy poza publicznym repozytorium. Na końcu lekcji uczeń eksportuje swoją wersję i wylogowuje się z Tinkercad na współdzielonym komputerze. Platforma szkolna nie przejmuje logowania, nie osadza edytora ani nie przesyła modeli do usługi.

Jeśli Tinkercad nie działa w sieci szkolnej, uczniowie mogą przygotować plan i omówić kryteria na karcie, ale samo modelowanie należy dokończyć na zajęciach po przywróceniu dostępu. Papierowy plan lub quiz nie są dowodem wykonania modelu 3D. Nie wymagamy pracy domowej ani zakładania prywatnych kont na lekcji.

## Pliki i skala

| Etap | Co zachować | Co sprawdzić |
|---|---|---|
| Projekt w Tinkercad | Edytowalny projekt pod kodem ucznia | Bryły można poprawiać; nazwa i wymiary są czytelne. |
| Oddanie modelu | Eksport `.stl` i karta z wymiarami w mm | Wyeksportowany właściwy obiekt; geometria i otwory odpowiadają projektowi. |
| Przygotowanie przez nauczyciela | Projekt Bambu Studio `.3mf` | Właściwy profil H2C, dysza, materiał, płyta, orientacja i podgląd warstw. |

W Tinkercad ustawiamy milimetry. STL opisuje geometrię powierzchni; nie zachowuje kolorów z edytora ani ustawień wydruku. Sam STL nie zapisuje jednostki, dlatego po imporcie trzeba porównać wymiary z kartą. Nie poprawiaj błędu skali przypadkowym powiększaniem „na oko”. Informację o jednostkach potwierdza [Autodesk](https://help.autodesk.com/cloudhelp/2016/ENU/Alias-Reference/files/GUID-B7BF855B-724D-46E4-8FE3-185737BB9D31.htm), a zakres STL opisuje [glosariusz Tinkercad](https://ibles-content.tinkercad.com/FBX/OHOS/J8AGQTIY/FBXOHOSJ8AGQTIY.pdf).

Uczeń korzysta z Export/Eksport i wybiera STL. Sprawdza zakres eksportu: całość projektu albo świadomie zaznaczone bryły. Zachowuje edytowalny projekt, bo ponownie zaimportowany STL nie odtwarza pierwotnego podziału na bryły i operacje. Nazwy poleceń mogą się różnić w wersji językowej; działanie sprawdź podczas próby stanowiska.

3MF jest również formatem modeli, ale w tym bloku **projekt Bambu Studio 3MF** oznacza zapis modelu razem z ustawieniami przygotowania wydruku. Nie utożsamiamy każdego 3MF z gotowym poleceniem dla tej konkretnej drukarki. Przy otwieraniu cudzego projektu trzeba ponownie sprawdzić profil i parametry. Oficjalne [Bambu Studio](https://github.com/bambulab/BambuStudio) opisuje pracę projektową i podgląd G-code, a [dokumentacja CLI](https://github.com/bambulab/BambuStudio/wiki/Command-Line-Usage) rozróżnia modele wejściowe, ustawienia i eksport projektu 3MF.

## H2C: właściwa przestrzeń robocza

[Oficjalna karta H2C](https://store.bblcdn.com/s7/default/d741f5a073c94245885065ff89a0b2da/H2C_Spec.pdf) podaje różne wielkości zależnie od użycia dysz:

| Tryb według producenta | Szerokość × głębokość × wysokość |
|---|---|
| Druk jedną dyszą | 305 × 320 × 325 mm |
| Druk dwiema dyszami | 300 × 320 × 325 mm |
| Łączny obszar dla dwóch dysz | 330 × 320 × 325 mm |

Łączny obszar nie oznacza, że każda dysza może drukować w całym tym zakresie. Profil H2C w używanej wersji Bambu Studio i wybrany tryb rozstrzygają, gdzie można umieścić obiekt. Nie zastępuj profilu H2C podobnym profilem H2D/H2S.

**Limit dydaktyczny bloku: 120 × 120 × 60 mm.** To ograniczenie czasu modelowania, kosztu i rozmiaru szkolnych prac, nie granica możliwości H2C. Większość pierwszych produktów jest znacznie mniejsza. Nauczyciel może zmniejszyć ten limit przed zajęciami, jeśli planowany czas lub zużycie materiału są za duże.

## Przebieg przygotowania wydruku — nauczyciel

1. Otwórz nowy projekt w Bambu Studio. Wybierz **H2C** i konfigurację zgodną z rzeczywistą dyszą, płytą i materiałem. Weryfikujemy sprzęt na miejscu, nie wyprowadzamy tych ustawień z samej nazwy drukarki.
2. Zaimportuj STL. Porównaj trzy wymiary z kartą ucznia. Sprawdź, czy nie wyeksportował dodatkowych brył, otworów pomocniczych albo przypadkowego fragmentu sceny.
3. Obejrzyj model z góry, z boku i od spodu. Oceń podstawę, połączenia brył, cienkie elementy i nawisy. Kolor w Tinkercad nie potwierdza połączenia geometrii. Przy zamierzonych częściach osobnych ustal sposób ich wydruku i łączenia.
4. Ustaw orientację i właściwy profil procesu. Decyzję o podporach, obrysie/brimie, ścianach i innych parametrach podejmij dla rzeczywistego modelu i materiału. W bloku nie ma jednej uniwersalnej temperatury, grubości ściany ani wysokości warstwy.
5. Wykonaj cięcie i obejrzyj warstwy od pierwszej do ostatniej. Czy otwór pozostał otworem? Czy cienka część w ogóle pojawia się w ścieżkach? Czy element ma oparcie? Sprawdź oszacowany czas i zużycie. Szacunki slicera nie są pomiarem rzeczywistego wydruku.
6. Jeśli model wymaga zmiany geometrii, wróć z jednym kryterium do ucznia, np. „K2: połącz stopkę z podstawą”. Uczeń poprawia projekt i eksportuje wersję `v2`. Ponownie wykonaj kontrolę.
7. Zapisz projekt 3MF po zatwierdzeniu ustawień. Uruchomienie i nadzór drukowania wykonuje nauczyciel zgodnie z instrukcją urządzenia. Nie publikujemy uczniom gotowego G-code ani nie wymagamy łączenia z drukarką przez sieć.

Na start wybieramy małe, płaskie modele o prostych połączeniach i małej liczbie szczegółów. Wielokolorowość jest rozszerzeniem dla nauczyciela po sprawdzeniu konfiguracji H2C; nie wymaga jej żadne kryterium ucznia. Nazwa drukarki nie potwierdza posiadania dodatkowych podajników ani konkretnego wyposażenia.

## Ocena i metodyka

Karta projektu jest pomocą do planowania rzutu i wymiarów. Quiz sprawdza pojęcia, rubryka zbiera samoocenę, a nauczyciel ocenia rzeczywisty model i poprawkę. Wynik quizu nie potwierdza poprawności STL ani gotowości do druku. Zajęcia realizują modelowanie 2D/3D w II.3.a oraz dobór narzędzia w II.2; nie deklarujemy całego wymagania II.3.a wyłącznie na podstawie wydruku.

W [modelowaniu COVE](https://metodyka.covepolska.pl/metoda-modelowanie.html) nauczyciel pokazuje jedną decyzję z uzasadnieniem, uczniowie próbują z podpowiedzią i przechodzą do zmienionego przykładu. W [ocenianiu kształtującym](https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html) zbiera odpowiedzi wszystkich i daje jedną uwagę do kryterium wraz z czasem na poprawę. Odczytano całe strony metod przez bezpośredni HTTP 6.11.2026; narzędzie wyszukiwarki nie udostępniało ich odczytu.

## Granice weryfikacji

Sprawdzono źródła producentów i strukturę materiału. Nie wykonano druku na lokalnej H2C ani testu konta nauczyciela w szkole. Próba stanowiska, poprawny import i podgląd warstw są obowiązkowym przygotowaniem prowadzącego. Poprawność pliku i geometrii oceniamy oddzielnie od działania platformy.
