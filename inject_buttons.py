import os
import re

injections = {
    'blok-02.html': '<div style="margin: 20px 0;"><a href="pobieralnia/zepsute_zdjecie.jpg" class="btn-download" download>Pobierz zdjęcie startowe</a></div>',
    
    'blok-03.html': '<div style="margin: 20px 0; display:flex; gap:16px; flex-wrap:wrap;"><a href="pobieralnia/logo_szkoly.png" class="btn-download" download>Pobierz Logo (PNG)</a><a href="pobieralnia/logo_szkoly.svg" class="btn-download" download>Pobierz Logo (SVG)</a></div>',
    
    'blok-04.html': '<div style="margin: 20px 0; display:flex; gap:16px; flex-wrap:wrap;"><a href="pobieralnia/baza_klientow.xlsx" class="btn-download" download>Pobierz bazę klientów</a><a href="pobieralnia/oferta_szablon.docx" class="btn-download" download>Pobierz szablon oferty</a></div>',
    
    'blok-05.html': '<div style="margin: 20px 0;"><a href="pobieralnia/kalkulator_wydatkow_start.xlsx" class="btn-download" download>Pobierz budżet startowy</a></div>',
    
    'blok-06.html': '<div style="margin: 20px 0;"><a href="pobieralnia/tekst_podejrzany.docx" class="btn-download" download>Pobierz tekst do analizy</a></div>',
    
    'blok-10.html': '<div style="margin: 20px 0;"><a href="pobieralnia/raport_sprzedazy_raw.csv" class="btn-download" download>Pobierz surowy raport (CSV)</a></div>',
    
    'blok-12.html': '<div style="margin: 20px 0;"><a href="pobieralnia/skrypt_startowy.py" class="btn-download" download>Pobierz skrypt startowy (.py)</a></div>',
}

for filename, snippet in injections.items():
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inject right after <p class="lead">
        new_content = re.sub(r'(<p class="lead">.*?</p>)', r'\1\n' + snippet, content, flags=re.DOTALL)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected into {filename}")
