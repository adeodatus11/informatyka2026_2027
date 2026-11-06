export const SOLUTION_CSS="body { font-family: Arial, sans-serif; font-size:18px; line-height:1.6; background-color:#f3f6f8; color:#182f38; margin:0; padding:20px; }\nheader, main, footer { max-width:1100px; margin:0 auto; }\nmain { width:auto; }\nnav ul { display:flex; flex-wrap:wrap; gap:16px; list-style:none; padding:0; }\na { color:#17477a; }\na:focus-visible { outline:3px solid #17477a; outline-offset:3px; }\n.wyspy { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:24px; }\narticle { background-color:#ffffff; padding:20px; border-radius:12px; }\nfigure { margin:0; }\nsvg { width:100%; max-width:100%; height:auto; }\nfigcaption { font-size:14px; color:#344b56; }\nh1 { font-size:36px; line-height:1.2; }\nh2 { color:#17477a; }\n";
export default {
 "id": "108",
 "grade": 3,
 "order": 32,
 "title": "Nowy wygląd strony internetowej o Wyspach Kanaryjskich",
 "subtitle": "Zachowasz gotową treść o Wyspach Kanaryjskich i zmienisz ją w czytelną stronę samym CSS.",
 "topic": "Oddzielam treść od wyglądu strony. Poprawiam typografię, kontrast i odstępy. Układam karty w grid lub flex i testuję wąskie okno.",
 "icon": "globe",
 "tags": [
  "HTML",
  "CSS",
  "strona do pokazania"
 ],
 "duration": 45,
 "curriculum": "I.1, II.2, II.3.f, IV.1 — plan, kod, test i poprawa strony; publikacja tylko omawiana, bez konta i hostingu.",
 "format": {
  "name": "Plan → kod → test → poprawa",
  "student": "Pracujesz sam w edytorze na platformie. Wybierasz zmianę dla odbiorcy, sprawdzasz kryteria i pobierasz gotowy plik.",
  "teacher": "Krótki przykład rozwiązany z głośnym uzasadnieniem. Zbierz odpowiedź wszystkich przed kolejnym krokiem: większość poprawnych — samodzielnie; przy podziale uzasadnienia; większość błędnych — pokaż drugi przykład. Po jednej uwadze według kryterium uczeń ma czas na poprawę i ponowną kontrolę. Przed układem uczeń wybiera grid albo flex. W połowie dostaje warunek390px i sprawdza, czy trzeba zmienić strategię; na końcu nazywa konkretną zmianę.",
  "grouping": "Samodzielnie. Możesz pokazać sąsiadowi podgląd i zapytać, gdzie szukałby informacji. Osoba bez pary sprawdza te same kryteria samodzielnie.",
  "methods": [
   {
    "name": "Przypominanie i powroty",
    "url": "https://metodyka.covepolska.pl/metoda-przypominanie-i-powroty.html"
   },
   {
    "name": "Modelowanie",
    "url": "https://metodyka.covepolska.pl/metoda-modelowanie.html"
   },
   {
    "name": "Ocenianie kształtujące i poprawa",
    "url": "https://metodyka.covepolska.pl/metoda-ocenianie-ksztaltujace.html"
   },
   {
    "name": "Metapoznanie",
    "url": "https://metodyka.covepolska.pl/metoda-metapoznanie.html"
   }
  ]
 },
 "objectives": [
  "Oddzielam treść od wyglądu strony.",
  "Poprawiam typografię, kontrast i odstępy.",
  "Układam karty w grid lub flex i testuję wąskie okno."
 ],
 "materials": [
  "Komputer z przeglądarką i htmlLab na platformie; bez konta, instalacji i hostingu."
 ],
 "teacherGuide": {
  "preparation": "Otwórz podgląd i sprawdź zapis pliku HTML. W tej lekcji nie publikujemy nic w sieci. Ocena kryteriów w htmlLab jest pomocą; obejrzyj rzeczywisty podgląd i odczyt klawiaturą. Fakty geograficzne sprawdzono 26.10.2026 na https://www.spain.info/en/region/canary-islands/. Tekst i wszystkie SVG są autorskie, nie kopiowane z portalu. Podpisy wskazują ilustracyjny charakter.",
  "summary": "Uczeń planuje zmianę, edytuje kod, sprawdza kryteria, poprawia oraz pobiera samodzielny plik HTML. Publikowanie jest etapem omawianym; nie deklaruj wykonanego wdrożenia."
 },
 "sections": [
  {
   "id": "start",
   "label": "Start",
   "title": "Treść jest gotowa, wygląd przeszkadza",
   "intro": "Mały tekst, blade kolory i szeroka strona utrudniają czytanie. Poprawisz to bez zmiany HTML.",
   "reading": {
    "title": "Wyjaśnienie: Treść jest gotowa, wygląd przeszkadza",
    "paragraphs": [
     "Z lekcji 91 pamiętasz:HTML porządkuje treść, a CSS zmienia wygląd.",
     "Odbiorca chce przeczytać trzy krótkie opisy wysp i łatwo przejść między sekcjami."
    ]
   },
   "activities": [
    {
     "type": "choice",
     "id": "g3-108-r1",
     "question": "Z lekcji 91: gdzie zmienisz kolor i odstępy wszystkich kart?",
     "options": [
      "W każdym akapicie osobno",
      "W arkuszu CSS",
      "W tytule pliku"
     ],
     "correct": [
      1
     ],
     "explanation": "Jedna reguła CSS zmienia wszystkie elementy wybrane selektorem.",
     "hint": "Jedna reguła CSS zmienia wszystkie elementy wybrane selektorem."
    },
    {
     "type": "choice",
     "id": "g3-108-r2",
     "question": "Co sprawdzasz przed publikacją?",
     "options": [
      "Tylko własny duży ekran",
      "Wyłącznie nazwę pliku",
      "Treść, linki, czytelność i różne szerokości"
     ],
     "correct": [
      2
     ],
     "explanation": "Podgląd jednej szerokości może ukryć problemy z układem.",
     "hint": "Podgląd jednej szerokości może ukryć problemy z układem."
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Przypomnienie bez notatek. Po korekcie poproś każdego o wskazanie jednej przeszkody w gotowej stronie.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Odbiorca chce przeczytać trzy krótkie opisy wysp i łatwo przejść między sekcjami.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "model",
   "label": "Selektory",
   "title": "Jedna reguła, wiele kart",
   "intro": "Przeczytaj gotowy HTML w zakładce tylko do odczytu. Nazwy klas pomogą Ci wybrać elementy.",
   "reading": {
    "title": "Wyjaśnienie: Jedna reguła, wiele kart",
    "paragraphs": [
     "body obejmuje stronę, article pojedynczą kartę, .wyspy kontener kart, svg ilustracje. Kropka oznacza klasę: .wyspy wybiera class=\"wyspy\".",
     "Reguła article { padding:20px; } daje przestrzeń wewnątrz każdej karty. gap w kontenerze ustawia odstęp pomiędzy kartami. To różne rzeczy."
    ]
   },
   "activities": [
    {
     "type": "choice",
     "id": "g3-108-select",
     "question": "Chcesz odstęp wewnątrz każdej karty. Co ustawisz?",
     "options": [
      "article { padding:20px; }",
      ".wyspy { color:red; }",
      "h1 { width:1200px; }"
     ],
     "correct": [
      0
     ],
     "explanation": "padding oddziela treść od krawędzi elementu. gap dotyczy odstępów pomiędzy elementami układu.",
     "hint": "padding oddziela treść od krawędzi elementu. gap dotyczy odstępów pomiędzy elementami układu."
    }
   ],
   "duration": 7,
   "grouping": "solo",
   "teacherNotes": "Modeluj tylko jedną regułę na tablicy: wybrany element, właściwość i skutek. Zbierz przewidywania wszystkich, nie pokazuj gotowego całego motywu.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Reguła article { padding:20px; } daje przestrzeń wewnątrz każdej karty. gap w kontenerze ustawia odstęp pomiędzy kartami. To różne rzeczy.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "type",
   "label": "Czytelność",
   "title": "Najpierw tekst i kontrast",
   "intro": "Popraw tekst przed układaniem kart. Dodaj reguły w style.css.",
   "reading": {
    "title": "Wyjaśnienie: Najpierw tekst i kontrast",
    "paragraphs": [
     "Zacznij od body:font-size18px, line-height1.6, ciemny tekst i jasne tło. Sprawdź liczony kontrast.",
     "HTML jest zablokowany: treści i podpisy ilustracji pozostają. Zmieniasz tylko arkusz."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-108-type",
     "stateKey": "g3-108-site",
     "mode": "fix",
     "points": 3,
     "title": "Wyspy: czytelny tekst",
     "site": "wyspy-kanaryjskie",
     "product": "Typografia miniatlasu",
     "prompt": "W style.css popraw trzy kryteria. Dobierz własne kolory o kontraście co najmniej4,5:1. Treść HTML jest gotowa i zablokowana.",
     "html": "<!DOCTYPE html>\n<html lang=\"pl\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Wyspy Kanaryjskie — trzy spojrzenia</title><link rel=\"stylesheet\" href=\"style.css\"></head>\n<body>\n<header><p>Miniatlas klasy 3</p><h1>Wyspy Kanaryjskie</h1><p>Trzy pomysły na poznanie archipelagu na Atlantyku. Materiał do ćwiczenia CSS, nie oferta podróży.</p><nav aria-label=\"Sekcje\"><ul><li><a href=\"#teneryfa\">Teneryfa</a></li><li><a href=\"#lanzarote\">Lanzarote</a></li><li><a href=\"#grancanaria\">Gran Canaria</a></li></ul></nav></header>\n<main class=\"wyspy\">\n<article id=\"teneryfa\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: góra\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#6d7565\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Góra i ocean — autorska ilustracja SVG do ćwiczenia, nie fotografia miejsca.</figcaption></figure><h2>Teneryfa</h2><p>Na tej wyspie znajduje się park narodowy Teide. W naszym miniatlasie zaczynamy od krajobrazu górskiego.</p><ul><li>Przeczytaj podpis ilustracji.</li><li>Porównaj wygląd tej karty z kolejną.</li></ul></article>\n<article id=\"lanzarote\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: wulkan\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#7b4f39\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Krajobraz wulkaniczny — autorska ilustracja SVG do ćwiczenia.</figcaption></figure><h2>Lanzarote</h2><p>Park narodowy Timanfaya pokazuje wulkaniczny charakter wyspy. W tej karcie ważna jest czytelna relacja obrazu i tekstu.</p><ul><li>Zwróć uwagę na odstępy.</li><li>Sprawdź kontrast nagłówka.</li></ul></article>\n<article id=\"grancanaria\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: wybrzeże\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#6d7565\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Wybrzeże — autorska ilustracja SVG do ćwiczenia, bez odwzorowania konkretnej plaży.</figcaption></figure><h2>Gran Canaria</h2><p>Wyspa należy do archipelagu Wysp Kanaryjskich. Ta karta domyka prosty przegląd trzech wysp.</p><ul><li>Sprawdź układ na małym ekranie.</li><li>Wróć linkiem na górę.</li></ul></article>\n</main><footer><p>Tekst i ilustracje: autorskie materiały platformy, 2026. Fakty geograficzne: oficjalny portal turystyczny Hiszpanii, spain.info/en/region/canary-islands/ (sprawdzono 26.10.2026).</p><p><a href=\"#\">Na górę strony</a></p></footer>\n</body></html>",
     "css": "body { font-family: \"Times New Roman\", serif; font-size:10px; background-color:#fff477; color:#c8c8c8; margin:0; }\nmain { width:1200px; }\n.wyspy { display:block; }\narticle { margin:0; padding:0; }\nsvg { width:640px; }\na { color:#b5b5b5; }\n",
     "cssTab": true,
     "lockHtml": true,
     "startTab": "css",
     "checks": [
      {
       "id": "font",
       "type": "css",
       "label": "Tekst ma co najmniej16px",
       "hint": [
        "body { font-size:18px; }"
       ],
       "sel": "body",
       "props": "font-size",
       "test": "minPx",
       "value": 16
      },
      {
       "id": "line",
       "type": "css",
       "label": "Czytelna interlinia",
       "hint": [
        "body { line-height:1.6; }"
       ],
       "sel": "body",
       "props": "line-height",
       "test": "minPx",
       "value": 1.4
      },
      {
       "id": "contrast",
       "type": "contrast",
       "label": "Kontrast treści co najmniej4,5:1",
       "hint": [
        "W body ustaw color:#182f38 i background-color:#f3f6f8."
       ],
       "sel": "body",
       "min": 4.5,
       "needBg": true
      }
     ]
    }
   ],
   "duration": 10,
   "grouping": "solo",
   "teacherNotes": "Daj informację o jednym kryterium i siedem minut na zmianę. Przy braku kontrastu pokaż jedną parę kolorów. Uczeń poprawia własny arkusz i sprawdza wynik.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "HTML jest zablokowany: treści i podpisy ilustracji pozostają. Zmieniasz tylko arkusz.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "layout",
   "label": "Układ kart",
   "title": "Daj treści miejsce",
   "intro": "Zachowaj swoje kolory. Ustaw układ kart, odstępy i ilustracje mieszczące się w karcie.",
   "reading": {
    "title": "Wyjaśnienie: Daj treści miejsce",
    "paragraphs": [
     "Wariant grid: .wyspy { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:24px; }. auto-fit dobiera liczbę kolumn do miejsca.",
     "Wariant flex: .wyspy { display:flex; flex-wrap:wrap; gap:24px; }, article { flex:1 1 240px; }. Zmień main width na auto. Ilustracjom svg daj width i max-width100%, height:auto."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-108-layout",
     "stateKey": "g3-108-site",
     "mode": "tasks",
     "points": 8,
     "title": "Wyspy: własny układ CSS",
     "site": "wyspy-kanaryjskie",
     "product": "Miniatlas Wysp Kanaryjskich",
     "prompt": "Zmieniasz wyłącznie CSS. Zrób grid albo flex, zachowaj czytelność. Oprócz automatycznych kryteriów sprawdź ręcznie wąskie okno: karty mają przejść do jednego rzędu pionowego, bez przewijania poziomego.",
     "html": "<!DOCTYPE html>\n<html lang=\"pl\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Wyspy Kanaryjskie — trzy spojrzenia</title><link rel=\"stylesheet\" href=\"style.css\"></head>\n<body>\n<header><p>Miniatlas klasy 3</p><h1>Wyspy Kanaryjskie</h1><p>Trzy pomysły na poznanie archipelagu na Atlantyku. Materiał do ćwiczenia CSS, nie oferta podróży.</p><nav aria-label=\"Sekcje\"><ul><li><a href=\"#teneryfa\">Teneryfa</a></li><li><a href=\"#lanzarote\">Lanzarote</a></li><li><a href=\"#grancanaria\">Gran Canaria</a></li></ul></nav></header>\n<main class=\"wyspy\">\n<article id=\"teneryfa\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: góra\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#6d7565\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Góra i ocean — autorska ilustracja SVG do ćwiczenia, nie fotografia miejsca.</figcaption></figure><h2>Teneryfa</h2><p>Na tej wyspie znajduje się park narodowy Teide. W naszym miniatlasie zaczynamy od krajobrazu górskiego.</p><ul><li>Przeczytaj podpis ilustracji.</li><li>Porównaj wygląd tej karty z kolejną.</li></ul></article>\n<article id=\"lanzarote\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: wulkan\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#7b4f39\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Krajobraz wulkaniczny — autorska ilustracja SVG do ćwiczenia.</figcaption></figure><h2>Lanzarote</h2><p>Park narodowy Timanfaya pokazuje wulkaniczny charakter wyspy. W tej karcie ważna jest czytelna relacja obrazu i tekstu.</p><ul><li>Zwróć uwagę na odstępy.</li><li>Sprawdź kontrast nagłówka.</li></ul></article>\n<article id=\"grancanaria\"><figure><svg xmlns=\"http://www.w 3.org/2000/svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"Autorska ilustracja krajobrazu: wybrzeże\"><rect width=\"640\" height=\"360\" fill=\"#cae4ef\"></rect><circle cx=\"500\" cy=\"80\" r=\"38\" fill=\"#e9a63b\"></circle><rect y=\"240\" width=\"640\" height=\"120\" fill=\"#206583\"></rect><path d=\"M0 270 L210 80 L400 270 Z\" fill=\"#6d7565\"></path><path d=\"M200 360 Q360 220 640 270 L640 360 Z\" fill=\"#dabd83\"></path></svg><figcaption>Wybrzeże — autorska ilustracja SVG do ćwiczenia, bez odwzorowania konkretnej plaży.</figcaption></figure><h2>Gran Canaria</h2><p>Wyspa należy do archipelagu Wysp Kanaryjskich. Ta karta domyka prosty przegląd trzech wysp.</p><ul><li>Sprawdź układ na małym ekranie.</li><li>Wróć linkiem na górę.</li></ul></article>\n</main><footer><p>Tekst i ilustracje: autorskie materiały platformy, 2026. Fakty geograficzne: oficjalny portal turystyczny Hiszpanii, spain.info/en/region/canary-islands/ (sprawdzono 26.10.2026).</p><p><a href=\"#\">Na górę strony</a></p></footer>\n</body></html>",
     "css": "body { font-family: \"Times New Roman\", serif; font-size:10px; background-color:#fff477; color:#c8c8c8; margin:0; }\nmain { width:1200px; }\n.wyspy { display:block; }\narticle { margin:0; padding:0; }\nsvg { width:640px; }\na { color:#b5b5b5; }\n",
     "cssTab": true,
     "lockHtml": true,
     "startTab": "css",
     "checks": [
      {
       "id": "font",
       "type": "css",
       "label": "Tekst ma co najmniej16px",
       "hint": [
        "body { font-size:18px; }"
       ],
       "sel": "body",
       "props": "font-size",
       "test": "minPx",
       "value": 16
      },
      {
       "id": "line",
       "type": "css",
       "label": "Czytelna interlinia",
       "hint": [
        "body { line-height:1.6; }"
       ],
       "sel": "body",
       "props": "line-height",
       "test": "minPx",
       "value": 1.4
      },
      {
       "id": "contrast",
       "type": "contrast",
       "label": "Kontrast treści co najmniej4,5:1",
       "hint": [
        "W body ustaw color:#182f38 i background-color:#f3f6f8."
       ],
       "sel": "body",
       "min": 4.5,
       "needBg": true
      },
      {
       "id": "grid",
       "type": "css",
       "label": "Karty w układzie grid lub flex",
       "hint": [
        "Ustaw .wyspy { display:grid; }. Dla grid dopisz kolumny auto-fit, a dla flex zawijanie."
       ],
       "sel": ".wyspy",
       "props": "display",
       "test": "equals",
       "value": [
        "grid",
        "flex"
       ]
      },
      {
       "id": "gap",
       "type": "css",
       "label": "Odstęp między kartami co najmniej16px",
       "hint": [
        "Dopisz gap:24px w .wyspy."
       ],
       "sel": ".wyspy",
       "props": "gap",
       "test": "minPx",
       "value": 16
      },
      {
       "id": "padding",
       "type": "css",
       "label": "Wewnętrzny odstęp kart co najmniej16px",
       "hint": [
        "article { padding:20px; }"
       ],
       "sel": "article",
       "props": "padding",
       "test": "minPx",
       "value": 16
      },
      {
       "id": "image",
       "type": "css",
       "label": "Ilustracje nie przekraczają szerokości karty",
       "hint": [
        "svg { max-width:100%; width:100%; height:auto; }"
       ],
       "sel": "svg",
       "props": "max-width",
       "test": "equals",
       "value": "100%"
      },
      {
       "id": "width",
       "type": "css",
       "label": "Usuń sztywną szerokość1200px",
       "hint": [
        "Zmień main { width:1200px; } na width:auto. Podgląd wąskiego okna sprawdź ręcznie."
       ],
       "sel": "main",
       "props": "width",
       "test": "equals",
       "value": [
        "auto",
        "100%"
       ]
      }
     ]
    }
   ],
   "duration": 16,
   "grouping": "solo",
   "teacherNotes": "Samodzielny transfer z typografii do układu. Po ośmiu minutach wprowadź nową informację: odbiorca ma okno390px. Uczeń kontroluje plan i poprawia sztywną szerokość oraz zawijanie. Automat nie ocenia całej responsywności.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Wariant flex: .wyspy { display:flex; flex-wrap:wrap; gap:24px; }, article { flex:1 1 240px; }. Zmień main width na auto. Ilustracjom svg daj width i max-width100%, height:auto.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "test",
   "label": "Podgląd i zapis",
   "title": "Sprawdź odbiorcę, nie tylko punkty",
   "intro": "Pokaż podgląd, zmniejsz okno i pobierz plik HTML.",
   "reading": {
    "title": "Wyjaśnienie: Sprawdź odbiorcę, nie tylko punkty",
    "paragraphs": [
     "Sprawdź linki nawigacji klawiszemTab. Zobacz, czy podpisy ilustracji są czytelne i czy karty zawijają się przy wąskim oknie.",
     "Automat sprawdza zapis reguł i wybrane kolory. Rzeczywisty układ oraz kontrast linków i podpisów obejrzyj osobno. Zapis pliku nie publikuje strony."
    ]
   },
   "activities": [
    {
     "type": "htmlLab",
     "id": "g3-108-show",
     "mode": "show",
     "from": "g3-108-site",
     "fromMode": "tasks",
     "title": "Miniatlas po zmianie CSS",
     "prompt": "Pokaż nauczycielowi duże i wąskie okno. Pobierz HTML z osadzonym CSS i autorskimi ilustracjami SVG. Otwórz plik lokalnie."
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Obejrzyj rzeczywisty układ kart w wąskim podglądzie i plik po pobraniu. Nie nazywaj kompletu punktów automatycznym audytemWCAG ani potwierdzeniem publikacji.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Automat sprawdza zapis reguł i wybrane kolory. Rzeczywisty układ oraz kontrast linków i podpisów obejrzyj osobno. Zapis pliku nie publikuje strony.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  },
  {
   "id": "result",
   "label": "Wynik",
   "title": "Twój wynik",
   "intro": "Pokaż stronę, pobrany plik i jedną poprawkę.",
   "reading": {
    "title": "Wyjaśnienie: Twój wynik",
    "paragraphs": [
     "Punkty opisują kryteria sprawdzone na platformie. Obejrzyj także stronę w podglądzie.",
     "Pobranie pliku zachowuje pracę. Nie oznacza publikacji w internecie."
    ]
   },
   "activities": [
    {
     "type": "resultCard",
     "id": "result",
     "title": "Strona po testach",
     "sources": [
      "g3-108-select",
      "g3-108-type",
      "g3-108-layout"
     ],
     "badges": [
      {
       "min": 0,
       "name": "Pierwszy szkic",
       "text": "Popraw jedno kryterium i sprawdź ponownie."
      },
      {
       "min": 0.5,
       "name": "Czytelniej",
       "text": "Odbiorca łatwiej odnajduje informacje."
      },
      {
       "min": 0.85,
       "name": "Gotowe do pokazania",
       "text": "Masz sprawdzoną stronę i zapisany wynik."
      }
     ]
    }
   ],
   "duration": 4,
   "grouping": "solo",
   "teacherNotes": "Poproś o konkretny przykład zmiany dla odbiorcy. Zapisz pytanie o różnicę między HTML i CSS do powrotu na następnej lekcji i za tydzień.",
   "askStudents": "Po czym poznasz, że zmiana pomaga odbiorcy strony?",
   "expectedAnswers": "Pobranie pliku zachowuje pracę. Nie oznacza publikacji w internecie.",
   "commonMistakes": "Uczeń ocenia tylko wygląd dużego podglądu. Poproś o kontrolę czytelności, nagłówków i wąskiego okna.",
   "optionalExtension": "Dodaj jeden własny szczegół i sprawdź, czy nadal spełniasz kryteria.",
   "skipIfShortOnTime": false
  }
 ],
 "exitTicket": "Co poprawiłeś po teście i jak sprawdziłeś, że odbiorca łatwiej skorzysta ze strony?"
};
