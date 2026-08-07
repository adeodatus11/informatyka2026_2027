import os
import pandas as pd
from docx import Document
from PIL import Image, ImageDraw, ImageFont

def make_dirs():
    os.makedirs('pobieralnia', exist_ok=True)

def generate_vulcan():
    cols = [
        "L.p.", "Temat", "Dział", "Liczba godzin", "Elementy podstawy programowej", 
        "Podstawa programowa", "Komentarz", "Zasoby prywatne", "Zasoby publiczne", 
        "Rozszerzenie", "Smartlinki", "Materiały dydaktyczne", "Kolekcja po lekcji", "Aktywna"
    ]
    
    data = [
        [1, "Blok 0: Start", "Klasa I", 2, "III.1, III.3, IV.5", "III.1, III.3, IV.5", "", "", "", "Nie", "", "", "", "Tak"],
        [2, "Blok 1: Ile internet o tobie wie?", "Klasa I", 6, "IV.4, V.1, V.3, V.4, II.4", "IV.4, V.1, V.3, V.4, II.4", "", "", "", "Nie", "", "", "", "Tak"],
        [3, "Blok 2: Napraw to zdjęcie", "Klasa I", 5, "II.3.a, II.4", "II.3.a, II.4", "", "", "", "Nie", "", "", "", "Tak"],
        [4, "Blok 3: Plakat, który wisi w szkole", "Klasa I", 6, "II.3.a, II.4, V.2", "II.3.a, II.4, V.2", "", "", "", "Nie", "", "", "", "Tak"],
        [5, "Blok 4: Dokument, który wygląda jak z firmy", "Klasa I", 8, "II.3.b, IV.1", "II.3.b, IV.1", "", "", "", "Nie", "", "", "", "Tak"],
        [6, "Blok 5: Ile naprawdę cię to kosztuje?", "Klasa I", 10, "I.1, I.3, II.3.c, IV.1", "I.1, I.3, II.3.c, IV.1", "", "", "", "Nie", "", "", "", "Tak"],
        [7, "Blok 6: Kto to napisał — człowiek czy maszyna?", "Klasa I", 5, "II.4, III.1, IV.2, V.2", "II.4, III.1, IV.2, V.2", "", "", "", "Nie", "", "", "", "Tak"],
        [8, "Blok 7: Twoja strona w internecie", "Klasa I", 9, "II.3.f, III.1, III.3, III.4, IV.1, IV.3", "II.3.f, III.1, III.3, III.4, IV.1, IV.3", "", "", "", "Nie", "", "", "", "Tak"],
        [9, "Blok 8: Zaprojektuj swoje miejsce pracy", "Klasa I", 4, "I.1, II.3.a, III.2, IV.1", "I.1, II.3.a, III.2, IV.1", "", "", "", "Nie", "", "", "", "Tak"],
        [10, "Blok 9: Dostań tę pracę", "Klasa I", 5, "II.3.b, IV.1, IV.2, IV.5", "II.3.b, IV.1, IV.2, IV.5", "", "", "", "Nie", "", "", "", "Tak"],
        [11, "Blok 10: Co mówią te dane?", "Klasa II", 9, "I.1, II.3.c, II.3.e, IV.1", "I.1, II.3.c, II.3.e, IV.1", "", "", "", "Nie", "", "", "", "Tak"],
        [12, "Blok 11: Gdzie właściwie są te dane?", "Klasa II", 6, "II.3.d, IV.1, V.1", "II.3.d, IV.1, V.1", "", "", "", "Nie", "", "", "", "Tak"],
        [13, "Blok 12: Każ komputerowi zrobić to za ciebie", "Klasa II", 11, "I.1, I.2.a, I.2.b, I.2.c, I.2.d, I.3, II.1, II.2, IV.1, V.3", "I.1, I.2.a, I.2.b, I.2.c, I.2.d, I.3, II.1, II.2, IV.1, V.3", "", "", "", "Nie", "", "", "", "Tak"],
        [14, "Blok 13: Co potrafisz?", "Klasa II", 4, "II.3.e, II.4, IV.1, IV.2, IV.5, V.2", "II.3.e, II.4, IV.1, IV.2, IV.5, V.2", "", "", "", "Nie", "", "", "", "Tak"],
    ]

    df = pd.DataFrame(data, columns=cols)
    df.to_excel('vulcan_rozklad_2026_2027.xlsx', index=False)

def generate_pobieralnia():
    # 1. Zepsute zdjecie (Blok 2)
    img = Image.new('RGB', (800, 600), color=(255, 200, 200))
    d = ImageDraw.Draw(img)
    d.text((100, 300), "To zdjecie celowo jest przeswietlone i brzydkie.\\nCzas to naprawic!", fill=(255, 255, 255))
    img.save('pobieralnia/zepsute_zdjecie.jpg', quality=10) # very low quality

    # 2. Logo szkoly PNG i SVG (Blok 3)
    img2 = Image.new('RGBA', (400, 400), color=(0, 0, 0, 0))
    d2 = ImageDraw.Draw(img2)
    d2.ellipse((50, 50, 350, 350), fill=(41, 128, 185))
    d2.text((150, 190), "LOGO", fill=(255, 255, 255))
    img2.save('pobieralnia/logo_szkoly.png')

    with open('pobieralnia/logo_szkoly.svg', 'w') as f:
        f.write('''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="150" fill="#2980b9" />
  <text x="50%" y="50%" font-family="Arial" font-size="30" fill="white" dominant-baseline="middle" text-anchor="middle">LOGO</text>
</svg>''')

    # 3. Baza klientow i szablon (Blok 4)
    df_klienci = pd.DataFrame({
        'Imie': ['Jan', 'Anna', 'Piotr', 'Kasia', 'Marek'],
        'Nazwisko': ['Kowalski', 'Nowak', 'Zalewski', 'Wisniewska', 'Dabrowski'],
        'Firma': ['Januszex', 'IT Solutions', 'B-Corp', 'Sklepik', 'Korpo S.A.'],
        'Adres': ['ul. Prosta 1, Warszawa', 'ul. Krzywa 2, Krakow', 'ul. Jasna 3, Poznan', 'ul. Ciemna 4, Gdansk', 'ul. Dluga 5, Wroclaw']
    })
    df_klienci.to_excel('pobieralnia/baza_klientow.xlsx', index=False)

    doc = Document()
    doc.add_heading('Oferta Wspolpracy', 0)
    doc.add_paragraph('Zarząd firmy składa nową ofertę dla: <<Imie>> <<Nazwisko>> z firmy <<Firma>>.')
    doc.add_paragraph('To jest całkowicie niesformatowany szablon z błędami w układzie (brakuje akapitów, twarde spacje, rozjechany tekst). Uczeń musi to ogarnąć.')
    doc.save('pobieralnia/oferta_szablon.docx')

    # 4. Kalkulator wydatkow (Blok 5)
    df_koszty = pd.DataFrame({
        'Miesiac': ['Styczen', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec'],
        'Jedzenie': [800, 850, 790, 810, 900, 820],
        'Subskrypcje': [150, 150, 150, 200, 150, 150],
        'Zakupy_Impulsywne': [300, 100, 500, 50, 600, 100]
    })
    df_koszty.to_excel('pobieralnia/kalkulator_wydatkow_start.xlsx', index=False)

    # 5. Tekst AI (Blok 6)
    doc_ai = Document()
    doc_ai.add_heading('Rewolucja Technologiczna w Edukacji', 1)
    doc_ai.add_paragraph('Edukacja to kluczowy element ludzkiej egzystencji, który nieustannie ewoluuje. W dobie postępującej transformacji cyfrowej jesteśmy świadkami niespotykanych dotąd zmian, które redefiniują paradygmaty nauczania na całym świecie. Należy zauważyć, że innowacyjne rozwiązania, choć skomplikowane w swej naturze, przynoszą obfite owoce dla całego społeczeństwa. W ujęciu globalnym, ten fenomen stanowi fundament nowej rzeczywistości.')
    doc_ai.add_paragraph('Ten tekst jest celowo napisany tzw. modelem lania wody. Uczeń ma za zadanie wyłapać te puste frazy.')
    doc_ai.save('pobieralnia/tekst_podejrzany.docx')

    # 6. Raport sprzedazy csv (Blok 10)
    import random
    dates = pd.date_range(start='2026-01-01', periods=200, freq='D')
    products = ['Myszka', 'Klawiatura', 'Monitor', 'Sluchawki', 'Laptop']
    regions = ['Polnoc', 'Poludnie', 'Wschod', 'Zachod']
    df_sales = pd.DataFrame({
        'Data': dates,
        'Produkt': [random.choice(products) for _ in range(200)],
        'Region': [random.choice(regions) for _ in range(200)],
        'Ilosc': [random.randint(1, 50) for _ in range(200)],
        'Cena_Jednostkowa': [random.uniform(50, 3000) for _ in range(200)]
    })
    df_sales.to_csv('pobieralnia/raport_sprzedazy_raw.csv', index=False)

    # 7. Skrypt startowy (Blok 12)
    with open('pobieralnia/skrypt_startowy.py', 'w') as f:
        f.write('''# Skrypt startowy: Twój pierwszy bot\nprint("Witaj świecie!")\n\n# WYZWANIE: Napraw poniższy kod. Znajdź błąd w pętli.\nlista = [1, 2, 3, 4, 5]\n# for i in list:\n#    print(i)\n\n# WYZWANIE: Dodaj zmienną i instrukcję warunkową, by sprawdzić, czy liczba jest parzysta.\n''')

if __name__ == '__main__':
    make_dirs()
    generate_vulcan()
    generate_pobieralnia()
    print("Files generated.")
