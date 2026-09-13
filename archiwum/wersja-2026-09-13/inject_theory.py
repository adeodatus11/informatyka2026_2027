import os
import re

def get_html(vid, vtitle, article_url, article_title, concepts):
    return f"""
<div class="theory-card card" style="border-left: 4px solid var(--accent-secondary); margin-bottom: 40px;">
  <h3 style="margin-top:0;">🧠 Wiedza w Pigułce</h3>
  <div class="two">
    <div>
      <h4 style="color:var(--text-secondary); margin-bottom:12px;">Kluczowe pojęcia:</h4>
      <ul style="font-size: 15px;">
        {concepts}
      </ul>
    </div>
    <div>
      <h4 style="color:var(--text-secondary); margin-bottom:12px;">Polecane materiały:</h4>
      <ul style="font-size: 15px; list-style:none; padding-left:0;">
        <li style="margin-bottom:16px;">
          <strong>📺 Wideo:</strong> {vtitle}<br>
          <a href="https://www.youtube.com/watch?v={vid}" target="_blank" class="yt-thumb">
            <img src="https://img.youtube.com/vi/{vid}/hqdefault.jpg" alt="Miniaturka wideo">
            <div class="play-btn">▶</div>
          </a>
        </li>
        <li>
          <strong>📖 Artykuł:</strong> <a href="{article_url}" target="_blank">{article_title}</a>
        </li>
      </ul>
    </div>
  </div>
</div>
"""

theory = {
    'blok-00.html': get_html(
        'kYvO3L0f6m0', 'Jak organizować pliki i foldery?', 'https://niebezpiecznik.pl/', 'Dlaczego ukrywanie rozszerzeń to zagrożenie',
        '<li><strong>Rozszerzenie pliku:</strong> Końcówka nazwy pliku (np. <code>.docx</code>), mówiąca systemowi, jakim programem go otworzyć.</li><li><strong>Chmura:</strong> Dysk na serwerach gigantów (Google, Microsoft), a nie na Twoim fizycznym komputerze.</li><li><strong>Drzewo katalogów:</strong> Hierarchiczna struktura folderów. Porządkuje dane.</li>'
    ),
    'blok-01.html': get_html(
        'hXFGu1qEvi4', 'Jak działają Menedżery Haseł?', 'https://zaufanatrzeciastrona.pl/', 'Przewodnik po bezpiecznych hasłach',
        '<li><strong>2FA / MFA:</strong> Hasło to za mało. Wymaga drugiego dowodu tożsamości (np. z aplikacji).</li><li><strong>Phishing:</strong> Oszustwo polegające na podszywaniu się pod zaufaną firmę, byś sam podał hasło.</li><li><strong>Menedżer haseł:</strong> Cyfrowy sejf, pamiętający setki trudnych haseł za Ciebie.</li>'
    ),
    'blok-02.html': get_html(
        'Fq_aY0WbU0Y', 'Czym się różni JPG od PNG i WEBP?', 'https://web.dev/fast/', 'Optymalizacja obrazów pod kątem ładowania',
        '<li><strong>Grafika rastrowa:</strong> Obraz zbudowany z pikseli. Przy powiększaniu "pikseluje się".</li><li><strong>Kompresja stratna (JPG):</strong> Zmniejszanie wagi przez usunięcie detali. Idealne do sieci.</li><li><strong>WEBP vs PNG:</strong> Obydwa mają przezroczystość, ale WEBP waży ułamek tego co PNG.</li>'
    ),
    'blok-03.html': get_html(
        'G3cib4-2G40', 'Raster vs Wektor - podstawy projektowania', 'https://creativecommons.pl/poznaj-licencje/', 'Przewodnik po licencjach Creative Commons',
        '<li><strong>Grafika wektorowa:</strong> Obraz zapisany matematycznie (ścieżki). Można powiększać w nieskończoność.</li><li><strong>SVG:</strong> Główny format wektorowy w sieci, w rzeczywistości to kod tekstowy.</li><li><strong>Creative Commons:</strong> Legalne używanie czyichś prac. CC0 (Domena Publiczna), CC BY (Uznanie autorstwa).</li>'
    ),
    'blok-04.html': get_html(
        '4dO883n9E3E', 'MS Word: style i spisy treści w 5 minut', 'https://support.microsoft.com/', 'Oficjalny poradnik dotyczący Korespondencji',
        '<li><strong>Style nagłówkowe:</strong> Budują strukturę dokumentu, generują spis treści.</li><li><strong>Korespondencja seryjna:</strong> Magiczne narzędzie łączące bazę (Excel) z szablonem (Word).</li><li><strong>PDF:</strong> Format blokujący edycję. Zawsze wygląda tak samo, na każdym sprzęcie.</li>'
    ),
    'blok-05.html': get_html(
        '8L1OVkw2ZQ8', 'Adresowanie względne i bezwzględne', 'https://excelova.pl/', 'Dlaczego Excel jest najważniejszym programem w korporacji?',
        '<li><strong>Formuły:</strong> Komórki arkusza "same liczą" używając znaku <code>=</code> (np. <code>=SUMA()</code>).</li><li><strong>Adresowanie bezwzględne ($):</strong> Znak dolara (np. <code>$A$1</code>) "zamraża" komórkę przy przeciąganiu.</li><li><strong>Formatowanie warunkowe:</strong> Arkusz sam koloruje komórki na podstawie ich zawartości.</li>'
    ),
    'blok-06.html': get_html(
        'zjkBMFhNj_g', 'Jak pisać lepsze prompty do AI?', 'https://openai.com/blog', 'Ograniczenia i ryzyka modeli językowych',
        '<li><strong>Generative AI:</strong> Model AI przewidujący "najbardziej prawdopodobne słowo". To asystent, nie wyrocznia.</li><li><strong>Halucynacje:</strong> Bot zmyśla fakty, bo "chce Cię zadowolić". Zawsze weryfikuj dane!</li><li><strong>Prompt Engineering:</strong> Sztuka precyzyjnego pisania poleceń (kontekst + cel + format).</li>'
    ),
    'blok-07.html': get_html(
        'MDLn5-zSQQI', 'Czym różni się HTML od CSS?', 'https://developer.mozilla.org/pl/docs/Learn/HTML', 'MDN Web Docs - Najlepszy podręcznik kodowania',
        '<li><strong>HTML:</strong> Szkielet strony, w którym używasz tagów (np. <code>&lt;h1&gt;</code>).</li><li><strong>CSS:</strong> Kaskadowe Arkusze Stylów. Nadają stronie wygląd i kolory.</li><li><strong>Responsywność (RWD):</strong> Strona sama dopasowuje się do ekranu komputera i telefonu.</li>'
    ),
    'blok-08.html': get_html(
        'D-w-w707R_Q', 'Ergonomia przed komputerem', 'https://www.tinkercad.com/', 'Samouczki i galeria projektów 3D Tinkercad',
        '<li><strong>Modelowanie 3D (CAD):</strong> Tworzenie modeli gotowych m.in. do wydruku na drukarce 3D.</li><li><strong>Oś Z:</strong> Świat 3D ma szerokość (X), długość (Y) i głębię/wysokość (Z).</li><li><strong>Ergonomia pracy:</strong> np. górna krawędź monitora musi być na wysokości oczu.</li>'
    ),
    'blok-09.html': get_html(
        'u6XAPnuFjJc', 'Jak rekruterzy patrzą na Twoje CV?', 'https://pracuj.pl/', 'Czym jest system ATS i jak go pokonać?',
        '<li><strong>ATS:</strong> Robot skanujący Twoje CV przed człowiekiem. Odrzuci Cię, jeśli zrobisz np. formatowanie ze złą tabelą.</li><li><strong>Umiejętności twarde:</strong> Certyfikaty, znajomość programów. Zawsze weryfikowalne.</li><li><strong>Umiejętności miękkie:</strong> Praca w zespole, rozwiązywanie problemów, komunikacja.</li>'
    ),
    'blok-10.html': get_html(
        'mD0iQczi8L4', 'Tabele Przestawne od zera', 'https://excelova.pl/', 'Złote zasady robienia wykresów',
        '<li><strong>Tabela przestawna:</strong> Narzędzie podsumowujące tysiące wierszy w 3 kliknięcia.</li><li><strong>Wizualizacja danych:</strong> Wykresy i grafy. Mózg szybciej trawi obraz niż tabelki.</li><li><strong>Plik CSV:</strong> Czysty tekst oddzielony przecinkami. Uniwersalny sposób przesyłu baz danych.</li>'
    ),
    'blok-11.html': get_html(
        'zsjvFFKOm3c', 'Czym właściwie jest relacyjna baza danych?', 'https://www.w3schools.com/sql/', 'Szybki start z zapytaniami SQL',
        '<li><strong>Baza danych:</strong> Cyfrowy magazyn zaprojektowany do błyskawicznego przeszukiwania i łączenia milionów informacji.</li><li><strong>Klucz główny:</strong> Unikalny identyfikator wpisu w tabeli (np. PESEL).</li><li><strong>Kwerenda (SQL):</strong> Formułowane pytanie do bazy danych (np. "Wyświetl klientów z grudnia").</li>'
    ),
    'blok-12.html': get_html(
        'kqtD5dpn9C8', 'Python w 100 sekund (Fireship)', 'https://python101.readthedocs.io/pl/latest/', 'Polski przewodnik po podstawach Pythona',
        '<li><strong>Algorytm:</strong> Precyzyjny przepis na rozwiązanie problemu krok po kroku.</li><li><strong>Pętla (for/while):</strong> Powtarzanie jednej czynności tysiące razy w ułamku sekundy.</li><li><strong>Instrukcja warunkowa (If/Else):</strong> Cyfrowe rozwidlenie. "Jeśli prawda to A, inaczej B".</li>'
    ),
    'blok-13.html': get_html(
        'Lb0Yz_5ZYzI', 'Jak stworzyć portfolio bez doświadczenia?', 'https://nofluffjobs.com/', 'Rynek Pracy IT - trendy na przyszłe lata',
        '<li><strong>Portfolio kompetencji:</strong> Zbiór praktycznych projektów. Mówi więcej niż szóstka na świadectwie.</li><li><strong>Elevator Pitch:</strong> Błyskawiczne (60 sekund) streszczenie Twojego doświadczenia lub genialnego pomysłu.</li><li><strong>Samoocena:</strong> Umiejętność krytycznego spojrzenia na to, co zrobiłem dobrze, a co zawaliłem.</li>'
    )
}

# The previous script might have already injected theory. Let's run a cleanup first if needed, 
# or just do a naive replace if we find old theory-card.
for filename, html_snippet in theory.items():
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # If there's an existing theory card, we replace it.
        # The previous theory card started with <div class="theory-card card" ...> and ended before <ol class="zad">.
        # But wait, my previous script injected it, so I can just replace the old block if it exists.
        if '<div class="theory-card' in content:
            # We need to remove the old theory card.
            content = re.sub(r'<div class="theory-card.*?</ol>', '<ol', content, flags=re.DOTALL)
            # Re-inject properly.
            content = content.replace('<ol class="zad">', html_snippet + '\n<ol class="zad">', 1)
        else:
            # Inject just before the first <ol class="zad">
            content = re.sub(r'(<ol class="zad">)', html_snippet + r'\n\1', content, count=1)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated theory with thumbnails in {filename}")
