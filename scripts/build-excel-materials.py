#!/usr/bin/env python3
"""Skoroszyty startowe XLSX do lekcji 69–74 (klasa 1, arkusz kalkulacyjny, Excel stacjonarny).

Tylko biblioteka standardowa Pythona (zipfile + XML), bez openpyxl i bez internetu.
Uruchom z katalogu repozytorium:  python3 scripts/build-excel-materials.py
Wynik: public/materials/excel/lesson-69-start.xlsx … lesson-74-start.xlsx oraz manifest.json.

Kontrakt (docs/excel-desktop.md): pliki mają znane dane, a lekcje pytają o wynik konkretnej komórki
po wykonaniu zadania w Excelu. Oczekiwane wartości z lekcji liczy test tests/sims-g1-excel.test.mjs
bezpośrednio z tych plików. Po zmianie danych uruchom test i popraw liczby w lekcjach.
Starter nie zawiera formuł, które uczeń ma dopiero wpisać (żółte komórki są puste).
"""
from pathlib import Path
from datetime import date
from xml.sax.saxutils import escape
import json, re, zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/materials/excel'
STAMP = (2026, 10, 16, 8, 0, 0)  # stała data w archiwum ZIP → powtarzalny wynik

# ---------- style (indeksy cellXfs) ----------
NORMAL, HEAD, TITLE, NOTE, NUM, TEXT, DATE, MONEY, DEC1, INPUT, BOLD, PCT, WRAPIN, NUMIN = range(14)

STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="dd\\.mm\\.yyyy"/><numFmt numFmtId="165" formatCode="#,##0.00\\ &quot;zł&quot;"/><numFmt numFmtId="166" formatCode="0.0"/></numFmts>
<fonts count="4">
<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>
<font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>
<font><b/><sz val="14"/><color rgb="FF1F3B4D"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>
<font><i/><sz val="10"/><color rgb="FF505A5F"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFA6A6A6"/></left><right style="thin"><color rgb="FFA6A6A6"/></right><top style="thin"><color rgb="FFA6A6A6"/></top><bottom style="thin"><color rgb="FFA6A6A6"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="14">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
<xf numFmtId="49" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="9" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normalny" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>"""


def col_letter(n):
    s = ''
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def ref_split(ref):
    m = re.fullmatch(r'([A-Z]+)(\d+)', ref)
    letters, row = m.groups()
    col = 0
    for ch in letters:
        col = col * 26 + ord(ch) - 64
    return col, int(row)


def serial(d):
    return (d - date(1899, 12, 30)).days


class Sheet:
    def __init__(self, name, widths, freeze=None):
        assert len(name) <= 31
        self.name, self.widths, self.freeze = name, widths, freeze
        self.cells, self.merges, self.heights = {}, [], {}

    def put(self, ref, value, style=NORMAL):
        self.cells[ref_split(ref)] = (value, style)

    def row(self, ref, values, styles):
        col, row = ref_split(ref)
        if not isinstance(styles, list):
            styles = [styles] * len(values)
        for i, (v, s) in enumerate(zip(values, styles)):
            if v is not None or s != NORMAL:
                self.put(f'{col_letter(col + i)}{row}', v, s)

    def xml(self, strings):
        rows = {}
        for (c, r), v in self.cells.items():
            rows.setdefault(r, []).append((c, v))
        out = []
        for r in sorted(rows):
            ht = f' ht="{self.heights[r]}" customHeight="1"' if r in self.heights else ''
            cells = []
            for c, (value, style) in sorted(rows[r]):
                ref = f'{col_letter(c)}{r}'
                s = f' s="{style}"' if style else ''
                if value is None:
                    cells.append(f'<c r="{ref}"{s}/>')
                elif isinstance(value, str):
                    cells.append(f'<c r="{ref}"{s} t="s"><v>{strings.index(value)}</v></c>')
                elif isinstance(value, date):
                    cells.append(f'<c r="{ref}"{s}><v>{serial(value)}</v></c>')
                else:
                    cells.append(f'<c r="{ref}"{s}><v>{repr(float(value)) if isinstance(value, float) else value}</v></c>')
            out.append(f'<row r="{r}"{ht}>{"".join(cells)}</row>')
        maxc = max(c for c, _ in self.cells)
        maxr = max(r for _, r in self.cells)
        pane = ''
        if self.freeze:
            fc, fr = ref_split(self.freeze)
            pane = f'<pane ySplit="{fr - 1}" topLeftCell="{self.freeze}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A{fr}" sqref="A{fr}"/>'
        cols = ''.join(f'<col min="{i + 1}" max="{i + 1}" width="{w}" customWidth="1"/>' for i, w in enumerate(self.widths))
        merges = ''
        if self.merges:
            merges = f'<mergeCells count="{len(self.merges)}">' + ''.join(f'<mergeCell ref="{m}"/>' for m in self.merges) + '</mergeCells>'
        return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
                'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
                f'<dimension ref="A1:{col_letter(maxc)}{maxr}"/>'
                f'<sheetViews><sheetView workbookViewId="0">{pane}</sheetView></sheetViews>'
                '<sheetFormatPr defaultRowHeight="15"/>'
                f'<cols>{cols}</cols><sheetData>{"".join(out)}</sheetData>{merges}'
                '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'
                '</worksheet>')


def write_book(path, title, sheets):
    strings = []
    for sh in sheets:
        for value, _ in sh.cells.values():
            if isinstance(value, str) and value not in strings:
                strings.append(value)
    n = len(sheets)
    ct = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
          '<Default Extension="xml" ContentType="application/xml"/>'
          '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
          + ''.join(f'<Override PartName="/xl/worksheets/sheet{i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' for i in range(n)) +
          '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
          '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
          '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
          '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
          '</Types>')
    rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
            '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
            '</Relationships>')
    wb = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
          '<workbookPr defaultThemeVersion="164011"/><bookViews><workbookView activeTab="0"/></bookViews><sheets>'
          + ''.join(f'<sheet name="{escape(s.name)}" sheetId="{i + 1}" r:id="rId{i + 1}"/>' for i, s in enumerate(sheets)) +
          '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>')
    wbrels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
              '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
              + ''.join(f'<Relationship Id="rId{i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i + 1}.xml"/>' for i in range(n)) +
              f'<Relationship Id="rId{n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
              f'<Relationship Id="rId{n + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
              '</Relationships>')
    sst = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
           f'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="{len(strings)}" uniqueCount="{len(strings)}">'
           + ''.join((f'<si><t xml:space="preserve">{escape(s)}</t></si>' if s != s.strip() else f'<si><t>{escape(s)}</t></si>') for s in strings) + '</sst>')
    core = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            f'<dc:title>{escape(title)}</dc:title><dc:creator>Pracownia informatyczna</dc:creator><dc:language>pl-PL</dc:language>'
            '<dcterms:created xsi:type="dcterms:W3CDTF">2026-10-16T08:00:00Z</dcterms:created></cp:coreProperties>')
    app = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
           '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Excel</Application></Properties>')
    parts = [('[Content_Types].xml', ct), ('_rels/.rels', rels), ('docProps/core.xml', core), ('docProps/app.xml', app),
             ('xl/workbook.xml', wb), ('xl/_rels/workbook.xml.rels', wbrels), ('xl/styles.xml', STYLES), ('xl/sharedStrings.xml', sst)]
    parts += [(f'xl/worksheets/sheet{i + 1}.xml', s.xml(strings)) for i, s in enumerate(sheets)]
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, text in parts:
            info = zipfile.ZipInfo(name, STAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, text.encode('utf-8'))


DAYS = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']


# ---------- 69: formuły, formaty, formatowanie ----------
def lesson69():
    s = Sheet('Wypłata', [14, 14, 11, 14, 15, 3, 36, 14])
    s.put('A1', 'Moja praca wakacyjna — lipiec 2026 (dane fikcyjne)', TITLE)
    s.put('A2', 'Żółte komórki są puste — tam wpiszesz formuły. Kolumna Data na razie pokazuje liczby zamiast dat.', NOTE)
    s.row('A4', ['Data', 'Dzień', 'Godziny', 'Stawka [zł/h]', 'Zarobek [zł]'], HEAD)
    shifts = [(1, 6), (2, 8), (3, 5), (4, 8), (6, 6), (8, 7), (10, 4), (11, 8), (13, 6), (15, 5)]
    for i, (d, h) in enumerate(shifts):
        r = 5 + i
        day = date(2026, 7, d)
        rate = 36 if day.weekday() == 5 else 31.4
        s.put(f'A{r}', serial(day), NUM)  # celowo format Ogólny: uczeń ustawia format daty
        s.put(f'B{r}', DAYS[day.weekday()], TEXT)
        s.put(f'C{r}', str(h) if r == 13 else h, TEXT if r == 13 else NUM)  # C13: liczba zapisana jako tekst
        s.put(f'D{r}', rate, NUM)
        s.put(f'E{r}', None, INPUT)
    s.put('A15', 'Razem', BOLD)
    s.put('C15', None, INPUT)
    s.put('E15', None, INPUT)
    s.row('G4', ['Mój plan', 'Kwota [zł]'], HEAD)
    s.row('G5', ['Wypłata za lipiec', None], [TEXT, INPUT])
    s.row('G6', ['Wydatki (telefon, wyjścia, ubrania)', 780], [TEXT, NUM])
    s.row('G7', ['Zostaje', None], [TEXT, INPUT])
    s.row('G8', ['Zostaje jako % wypłaty', None], [TEXT, INPUT])
    s.put('G10', 'Stawka 31,40 zł/h w dni robocze i 36 zł/h w soboty — przykład do ćwiczenia.', NOTE)
    return [s]


# ---------- 70: funkcje i adresowanie bezwzględne ----------
def lesson70():
    t = Sheet('Turniej', [14, 9, 9, 9, 9, 9, 10, 16, 3, 40, 10])
    t.put('A1', 'Turniej klasowy w grę piłkarską — punkty graczy (dane fikcyjne)', TITLE)
    t.put('A2', 'Puste pole = gracz nie grał w tym meczu. 0 = grał, ale nie zdobył punktów. Awans: co najmniej 20 punktów.', NOTE)
    t.row('A4', ['Gracz', 'Mecz 1', 'Mecz 2', 'Mecz 3', 'Mecz 4', 'Suma', 'Średnia', 'Awans (min. 20 pkt)'], HEAD)
    players = [('Bartek_07', [8, 6, 9, 7]), ('Zuza', [5, 7, None, 8]), ('Mati', [9, 9, 8, 10]), ('Ola_K', [4, 5, 6, 3]),
               ('Kuba', [7, None, None, 8]), ('Nikola', [6, 8, 7, 9]), ('Szymon', [3, 4, 5, 2]), ('Wiktor', [10, 7, 8, 6]),
               ('Lena', [7, 7, 7, 7]), ('Igor', [0, 5, 6, 4])]
    for i, (name, pts) in enumerate(players):
        r = 5 + i
        t.put(f'A{r}', name, TEXT)
        for j, p in enumerate(pts):
            t.put(f'{"BCDE"[j]}{r}', p, NUM)
        for c in 'FGH':
            t.put(f'{c}{r}', None, INPUT)
    t.row('J4', ['Statystyka drużyny', 'Wynik'], HEAD)
    for i, label in enumerate(['Najwięcej punktów jednego gracza (MAX z kolumny Suma)', 'Najmniej punktów jednego gracza (MIN z kolumny Suma)',
                               'Liczba rozegranych meczów (ILE.LICZB)', 'Gracze z awansem (LICZ.JEŻELI)', 'Średnia punktów za mecz (ZAOKR do 0,1)']):
        t.row(f'J{5 + i}', [label, None], [TEXT, INPUT])
    p = Sheet('Prąd', [26, 10, 16, 20, 18])
    p.put('A1', 'Ile kosztuje prąd moich urządzeń? (szacunek na miesiąc)', TITLE)
    p.put('A2', 'Cena przybliżona: energia + dystrybucja dla domu, 2026. Na rachunku w domu może być inna — wpisz ją w B4.', NOTE)
    p.row('A4', ['Cena 1 kWh [zł]', 1.1], [BOLD, NUMIN])
    p.row('A6', ['Urządzenie', 'Moc [W]', 'Godziny dziennie', 'kWh w miesiącu (30 dni)', 'Koszt w miesiącu [zł]'], HEAD)
    for i, (name, w, h) in enumerate([('Konsola do gier', 160, 3), ('Telewizor', 100, 3), ('Komputer do gier', 350, 2),
                                       ('Ładowarka telefonu', 10, 2), ('Router Wi-Fi', 10, 24)]):
        r = 7 + i
        p.row(f'A{r}', [name, w, h, None, None], [TEXT, NUM, NUM, INPUT, INPUT])
    p.row('A12', ['Razem', None, None, None, None], [BOLD, NORMAL, NORMAL, INPUT, INPUT])
    return [t, p]


# ---------- 71: wykresy ----------
def lesson71():
    a = Sheet('Abonamenty', [12, 18, 18, 14, 20])
    a.put('A1', 'Który abonament wyjdzie najtaniej przez 2 lata? (oferty fikcyjne)', TITLE)
    a.put('A2', 'Umowa na 24 miesiące. Opłata na start to jednorazowa opłata aktywacyjna.', NOTE)
    a.row('A4', ['Oferta', 'Cena miesięczna [zł]', 'Opłata na start [zł]', 'Internet [GB]', 'Koszt 24 mies. [zł]'], HEAD)
    for i, (n, c, st, gb) in enumerate([('Fala', 49, 0, 50), ('Zasięg', 45, 144, 40), ('Pikseł', 54, 0, 100)]):
        a.row(f'A{5 + i}', [n, c, st, gb, None], [TEXT, NUM, NUM, NUM, INPUT])
    a.row('A9', ['Różnica: najdroższa − najtańsza oferta [zł]', None], [BOLD, INPUT])
    a.merges.append('A9:D9')
    a.put('E9', None, INPUT)
    a.cells.pop(ref_split('B9'))
    w = Sheet('Wydatki', [26, 12])
    w.put('A1', 'Na co idzie moje kieszonkowe — wrzesień (dane fikcyjne)', TITLE)
    w.put('A2', 'Kwoty w złotych. Wykres kołowy pokaże, jaką część całości zajmuje każda kategoria.', NOTE)
    w.row('A4', ['Kategoria', 'Kwota [zł]'], HEAD)
    for i, (k, v) in enumerate([('Jedzenie na mieście', 120), ('Telefon i internet', 40), ('Gry i subskrypcje', 60),
                                ('Ubrania', 80), ('Transport', 40), ('Oszczędności', 60)]):
        w.row(f'A{5 + i}', [k, v], [TEXT, NUM])
    w.row('A11', ['Razem', None], [BOLD, INPUT])
    k = Sheet('Kanał', [12, 14])
    k.put('A1', 'Obserwujący mój kanał z poradami o grach (dane fikcyjne)', TITLE)
    k.put('A2', 'Liczba obserwujących na koniec miesiąca, 2026.', NOTE)
    k.row('A4', ['Miesiąc', 'Obserwujący'], HEAD)
    for i, (m, v) in enumerate([('styczeń', 120), ('luty', 180), ('marzec', 260), ('kwiecień', 250), ('maj', 400), ('czerwiec', 610)]):
        k.row(f'A{5 + i}', [m, v], [TEXT, NUM])
    return [a, w, k]


# ---------- 72: projekt z geografii (dane publiczne, wartości przybliżone — DO WERYFIKACJI w teacherGuide) ----------
CLIMATE = [('styczeń', -1.8, 35), ('luty', -0.6, 31), ('marzec', 2.8, 34), ('kwiecień', 8.7, 34), ('maj', 14.0, 59), ('czerwiec', 17.5, 66),
           ('lipiec', 19.4, 81), ('sierpień', 18.7, 61), ('wrzesień', 13.7, 50), ('październik', 8.3, 39), ('listopad', 3.6, 36), ('grudzień', -0.4, 38)]
VOIVODESHIPS = [('dolnośląskie', 2880, 19947), ('kujawsko-pomorskie', 2010, 17971), ('lubelskie', 2030, 25123), ('lubuskie', 980, 13988),
                ('łódzkie', 2390, 18219), ('małopolskie', 3430, 15183), ('mazowieckie', 5510, 35559), ('opolskie', 950, 9412),
                ('podkarpackie', 2070, 17846), ('podlaskie', 1150, 20187), ('pomorskie', 2360, 18323), ('śląskie', 4350, 12333),
                ('świętokrzyskie', 1180, 11711), ('warmińsko-mazurskie', 1370, 24173), ('wielkopolskie', 3490, 29826), ('zachodniopomorskie', 1640, 22905)]


def lesson72():
    k = Sheet('Klimat', [44, 17, 13])
    k.put('A1', 'Klimat Warszawy — średnie miesięczne wartości (normy 1991–2020)', TITLE)
    k.put('A2', 'Źródło: IMGW-PIB, normy klimatyczne 1991–2020, stacja Warszawa-Okęcie. Wartości zaokrąglone do celów ćwiczenia.', NOTE)
    k.row('A4', ['Miesiąc', 'Temperatura [°C]', 'Opady [mm]'], HEAD)
    for i, (m, t, o) in enumerate(CLIMATE):
        k.row(f'A{5 + i}', [m, t, o], [TEXT, DEC1, NUM])
    for i, label in enumerate(['Roczna suma opadów [mm]', 'Średnia roczna temperatura [°C] (ZAOKR do 0,1)',
                               'Amplituda temperatury [°C] (MAX − MIN)', 'Liczba miesięcy ze średnią poniżej 0 °C']):
        k.row(f'A{18 + i}', [label, None], [TEXT, INPUT])
    k.put('A23', 'Moje wnioski (2–3 zdania z liczbami):', BOLD)
    for r in (24, 25, 26):
        k.put(f'A{r}', None, WRAPIN)
        k.put(f'B{r}', None, WRAPIN)
        k.put(f'C{r}', None, WRAPIN)
        k.merges.append(f'A{r}:C{r}')
        k.heights[r] = 32
    v = Sheet('Województwa', [24, 15, 18, 20])
    v.put('A1', 'Ludność i powierzchnia województw (wariant dla chętnych)', TITLE)
    v.put('A2', 'Źródło: GUS, Bank Danych Lokalnych — ludność stan na 31.12.2023 (zaokrąglona do tys.), powierzchnia w km². Sprawdź aktualne dane w BDL.', NOTE)
    v.row('A4', ['Województwo', 'Ludność [tys.]', 'Powierzchnia [km²]', 'Gęstość [osób/km²]'], HEAD)
    for i, (n, p, a) in enumerate(VOIVODESHIPS):
        v.row(f'A{5 + i}', [n, p, a, None], [TEXT, NUM, NUM, INPUT])
    v.put('A22', 'Gęstość = ludność [tys.] × 1000 / powierzchnia. Zaokrąglij do liczby całkowitej.', NOTE)
    return [k, v]


# ---------- 73: filtry, tabela, tabela i wykres przestawny ----------
PRODUCTS = [('Kabel USB-C 1 m', 'Akcesoria', 25), ('Ładowarka 20 W', 'Akcesoria', 59), ('Etui na telefon', 'Akcesoria', 35),
            ('Szkło ochronne', 'Akcesoria', 29), ('Pad bezprzewodowy', 'Gaming', 219), ('Słuchawki gamingowe', 'Gaming', 189),
            ('Mysz gamingowa', 'Gaming', 129), ('Podkładka XL', 'Gaming', 49), ('Pendrive 64 GB', 'Komputery', 39),
            ('Dysk SSD 1 TB', 'Komputery', 299), ('Klawiatura', 'Komputery', 149), ('Kamerka internetowa', 'Komputery', 169)]
CITIES = ['Kraków', 'Tarnów', 'Nowy Sącz', 'Rzeszów']
DELIVERY = ['Kurier', 'Automat paczkowy', 'Odbiór osobisty']


def orders73():
    x = 73
    def rnd(n):
        nonlocal x
        x = (1103515245 * x + 12345) % 2 ** 31
        return (x >> 8) % n
    rows = []
    for i in range(40):
        name, cat, price = PRODUCTS[rnd(len(PRODUCTS))]
        qty = [1, 1, 1, 2, 1, 3, 1, 2][rnd(8)]
        rows.append({'nr': f'Z-{901 + i}', 'date': date(2026, 9, 1 + i * 29 // 39), 'product': name, 'category': cat,
                     'qty': qty, 'price': price, 'value': qty * price, 'city': CITIES[rnd(4)], 'delivery': DELIVERY[rnd(3)]})
    return rows


def lesson73():
    s = Sheet('Zamówienia', [10, 12, 22, 13, 8, 14, 13, 13, 18], freeze='A5')
    s.put('A1', 'Sklep internetowy TechKąt — zamówienia, wrzesień 2026 (dane fikcyjne, praktyki zawodowe)', TITLE)
    s.put('A2', 'Jeden wiersz = jedno zamówienie. Wartość = Ilość × Cena. Nie zmieniaj danych — pracuj filtrami i tabelą przestawną.', NOTE)
    s.row('A4', ['Nr', 'Data', 'Produkt', 'Kategoria', 'Ilość', 'Cena [zł]', 'Wartość [zł]', 'Miasto', 'Dostawa'], HEAD)
    for i, o in enumerate(orders73()):
        s.row(f'A{5 + i}', [o['nr'], o['date'], o['product'], o['category'], o['qty'], o['price'], o['value'], o['city'], o['delivery']],
              [TEXT, DATE, TEXT, TEXT, NUM, NUM, NUM, TEXT, TEXT])
    return [s]


# ---------- 74: filtr w tabeli przestawnej i poradnik ----------
TRIP = [('piątek', 'Transport', 'Bilety kolejowe tam (grupowe)', 'Wychowawczyni', 2160), ('piątek', 'Jedzenie', 'Woda i przekąski', 'Ania (skarbnik)', 96),
        ('piątek', 'Jedzenie', 'Obiad w barze', 'Ania (skarbnik)', 744), ('piątek', 'Atrakcje', 'Bilety do muzeum', 'Ania (skarbnik)', 480),
        ('piątek', 'Nocleg', 'Hostel — noc 1', 'Wychowawczyni', 1680), ('piątek', 'Jedzenie', 'Kolacja — pizza', 'Kuba', 552),
        ('sobota', 'Jedzenie', 'Obiad', 'Ania (skarbnik)', 816), ('sobota', 'Atrakcje', 'Rejs statkiem', 'Wychowawczyni', 960),
        ('sobota', 'Transport', 'Bilety komunikacji miejskiej', 'Kuba', 192), ('sobota', 'Atrakcje', 'Park trampolin', 'Ania (skarbnik)', 720),
        ('sobota', 'Atrakcje', 'Przewodnik po Starym Mieście', 'Zosia', 350), ('sobota', 'Jedzenie', 'Kolacja', 'Zosia', 600),
        ('sobota', 'Nocleg', 'Hostel — noc 2', 'Wychowawczyni', 1680), ('niedziela', 'Jedzenie', 'Śniadanie na wynos', 'Kuba', 312),
        ('niedziela', 'Atrakcje', 'Planetarium', 'Ania (skarbnik)', 408), ('niedziela', 'Jedzenie', 'Obiad', 'Zosia', 720),
        ('niedziela', 'Jedzenie', 'Prowiant na drogę', 'Kuba', 216), ('niedziela', 'Transport', 'Bus na dworzec', 'Zosia', 150),
        ('niedziela', 'Transport', 'Bilety kolejowe powrót (grupowe)', 'Wychowawczyni', 2160)]
TRIP_PEOPLE = 24


def lesson74():
    w = Sheet('Wydatki', [6, 12, 13, 32, 18, 12], freeze='A5')
    w.put('A1', 'Wyjazd klasy 1B nad morze — kto ile zapłacił (dane fikcyjne)', TITLE)
    w.put('A2', 'Każdy wiersz to jeden rachunek. Koszt dzielimy po równo na 24 uczniów. Nie zmieniaj danych — użyj tabeli przestawnej.', NOTE)
    w.row('A4', ['Lp.', 'Dzień', 'Kategoria', 'Za co', 'Kto zapłacił', 'Kwota [zł]'], HEAD)
    for i, (d, k, opis, kto, kw) in enumerate(TRIP):
        w.row(f'A{5 + i}', [i + 1, d, k, opis, kto, kw], [NUM, TEXT, TEXT, TEXT, TEXT, NUM])
    p = Sheet('Poradnik', [8, 70])
    p.put('A1', 'Poradnik dla skarbnika klasy: rozliczenie wyjazdu w 5 krokach', TITLE)
    p.put('A2', 'Napisz kroki tak, żeby osoba, która nie była dziś na lekcji, zrobiła to sama. Nazwy poleceń pisz tak, jak w Excelu.', NOTE)
    p.row('A4', ['Krok', 'Co robię w Excelu (polecenie i po co)'], HEAD)
    for i in range(5):
        p.row(f'A{5 + i}', [i + 1, None], [NUM, WRAPIN])
        p.heights[5 + i] = 32
    p.row('A11', ['Uczestników', TRIP_PEOPLE], [BOLD, NUMIN])
    p.row('A12', ['Koszt na osobę [zł]', None], [BOLD, INPUT])
    p.put('A14', 'Wnioski dla klasy (2–3 zdania z liczbami z tabeli przestawnej):', BOLD)
    for r in (15, 16, 17):
        p.row(f'A{r}', [None, None], [WRAPIN, WRAPIN])
        p.merges.append(f'A{r}:B{r}')
        p.heights[r] = 32
    return [w, p]


BOOKS = {
    '69': ('Formuły i formaty — praca wakacyjna', lesson69, 'Wypłata: formuły =C*D, kopiowanie, Autosumowanie, liczba zapisana jako tekst w C13, formaty daty, waluty i procentu.'),
    '70': ('Funkcje — turniej i rachunek za prąd', lesson70, 'Turniej: SUMA, ŚREDNIA (puste ≠ 0), ZAOKR, JEŻELI, MAX, MIN, ILE.LICZB, LICZ.JEŻELI. Prąd: adres bezwzględny $B$4.'),
    '71': ('Wykresy — abonamenty, wydatki, kanał', lesson71, 'Abonamenty: koszt 24 mies. i wykres kolumnowy (oś od zera i oś od 1100). Wydatki: wykres kołowy z %. Kanał: wykres liniowy.'),
    '72': ('Projekt z geografii — klimatogram', lesson72, 'Klimat: klimatogram (kolumny opadów + linia temperatury), suma, średnia, amplituda, wnioski. Województwa: wariant dla chętnych (gęstość).'),
    '73': ('Filtry i tabela przestawna — sklep TechKąt', lesson73, 'Zamówienia (40 wierszy): Formatuj jako tabelę + wiersz sumy, filtry, tabela przestawna Kategoria × Suma z Wartość, liczba zamówień wg miasta, wykres przestawny.'),
    '74': ('Filtr w tabeli przestawnej — wyjazd klasowy', lesson74, 'Wydatki (19 rachunków): tabela przestawna, pole w obszarze Filtry, fragmentator, koszt na osobę. Poradnik: 5 kroków i wnioski.'),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {'generator': 'scripts/build-excel-materials.py', 'files': []}
    for lid, (title, build, purpose) in BOOKS.items():
        sheets = build()
        name = f'lesson-{lid}-start.xlsx'
        write_book(OUT / name, title, sheets)
        manifest['files'].append({'lesson': lid, 'file': f'materials/excel/{name}', 'title': title,
                                  'sheets': [s.name for s in sheets], 'purpose': purpose})
        print('zapisano', name)
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
