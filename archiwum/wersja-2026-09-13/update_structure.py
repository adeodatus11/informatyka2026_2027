import os
import re

directory = '/Users/maciejnajwer/Library/CloudStorage/OneDrive-ZESPÓŁSZKÓŁZAWODOWYCHNR5/informatyka 2026_2027/strona_www/'

new_brand = '''<a class="brand" href="index.html">
    <img src="assets/logo.jpg" alt="Logo" style="height: 28px; width: auto; border-radius: 4px;">
    Informatyka 2026/2027
</a>'''

new_footer = '''<footer>
  <div class="footer-inner">
    <div class="footer-logos">
      <a href="https://win4smes.eu/" target="_blank" rel="noopener noreferrer" title="WIN4SMEs">
        <img src="assets/Logo-2025.png" alt="WIN4SMEs" class="logo-win">
      </a>
      <div class="footer-logos-secondary">
        <a href="https://covepolska.pl/" target="_blank" rel="noopener noreferrer" title="COVE Polska">
          <img src="assets/COVE Polska bez tła.png" alt="COVE Polska">
        </a>
        <img src="assets/PL_Co-fundedbytheEU_RGB_POS.png" alt="Co-funded by the European Union">
      </div>
    </div>
    <div class="footer-right-col">
      <div class="footer-text">
        <strong>Informatyka 2026/2027 · Metodologia WIN4SMEs (WP3.A5)</strong><br>
        Rozkład materiału bazuje na innowacyjnych modelach edukacyjnych (Flipped Classroom, Blended Learning).<br>
        Współfinansowane przez Unię Europejską. Wyrażone poglądy i opinie są wyłącznie poglądami autora(-ów) i niekoniecznie odzwierciedlają poglądy Unii Europejskiej.
      </div>
    </div>
  </div>
</footer>'''

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace brand
        content = re.sub(r'<a class="brand" href="index\.html">Informatyka 2026/2027</a>', new_brand, content)
        
        # Replace footer
        content = re.sub(r'<footer>.*?</footer>', new_footer, content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated structure for {filename}')
