#!/usr/bin/env python3
"""Pliki startowe PowerPointa do lekcji 75 i 76 (klasa 1, tematy 46-47).

Bez zależności zewnętrznych: PPTX powstaje z XML (PresentationML) i zipfile, a ilustracja PNG
z prostego rastra w czystym Pythonie (zlib). Uruchom: python3 scripts/build-powerpoint-materials.py
Wynik: public/materials/powerpoint/{lesson-75-start.pptx, lesson-75-grafika.png, lesson-76-start.pptx, manifest.json}
Pliki są deterministyczne (stała data w ZIP i w metadanych), więc ponowne uruchomienie nie zmienia bajtów.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json, math, struct, zipfile, zlib

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/materials/powerpoint'
OUT.mkdir(parents=True, exist_ok=True)
STAMP = (2026, 10, 16, 12, 0, 0)
CREATED = '2026-10-16T12:00:00Z'

NS_A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
NS_P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
NSDECL = f'xmlns:a="{NS_A}" xmlns:r="{NS_R}" xmlns:p="{NS_P}"'
REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/'
CT = 'application/vnd.openxmlformats-officedocument.presentationml.'
HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'


def px(v):
    """Piksele slajdu 1280x720 -> EMU (1 px = 9525 EMU)."""
    return int(round(v * 9525))


def x(text):
    return escape(text, {'"': '&quot;'})


# ---------------------------------------------------------------- grafika PNG (bez Pillow)
class Canvas:
    def __init__(self, w, h, bg):
        self.w, self.h = w, h
        self.px = bytearray(bytes(bg) * (w * h))

    def hline(self, y, x0, x1, col):
        if y < 0 or y >= self.h:
            return
        x0, x1 = max(0, int(x0)), min(self.w, int(x1))
        if x1 > x0:
            i = (y * self.w + x0) * 3
            self.px[i:i + (x1 - x0) * 3] = bytes(col) * (x1 - x0)

    def rect(self, x0, y0, x1, y1, col):
        for y in range(max(0, int(y0)), min(self.h, int(y1))):
            self.hline(y, x0, x1, col)

    def vgrad(self, x0, y0, x1, y1, c0, c1):
        for y in range(int(y0), int(y1)):
            t = (y - y0) / max(1, (y1 - y0 - 1))
            self.hline(y, x0, x1, tuple(int(a + (b - a) * t) for a, b in zip(c0, c1)))

    def ellipse(self, cx, cy, rx, ry, col):
        for y in range(int(cy - ry), int(cy + ry) + 1):
            d = 1 - ((y - cy) / ry) ** 2
            if d >= 0:
                w = rx * math.sqrt(d)
                self.hline(y, cx - w, cx + w, col)

    def rrect(self, x0, y0, x1, y1, r, col):
        for y in range(int(y0), int(y1)):
            dy = max(y0 + r - y, y - (y1 - r), 0)
            w = r - math.sqrt(max(0, r * r - dy * dy)) if dy else 0
            self.hline(y, x0 + w, x1 - w, col)

    def poly(self, pts, col):
        ys = [p[1] for p in pts]
        for y in range(int(min(ys)), int(max(ys)) + 1):
            xs = []
            for (ax, ay), (bx, by) in zip(pts, pts[1:] + pts[:1]):
                if (ay <= y < by) or (by <= y < ay):
                    xs.append(ax + (y - ay) * (bx - ax) / (by - ay))
            xs.sort()
            for a, b in zip(xs[::2], xs[1::2]):
                self.hline(y, a, b, col)

    def blend(self, x0, y0, col, alpha):
        i = (y0 * self.w + x0) * 3
        for k in range(3):
            self.px[i + k] = int(self.px[i + k] * (1 - alpha) + col[k] * alpha)

    def png(self):
        raw = b''.join(b'\x00' + bytes(self.px[y * self.w * 3:(y + 1) * self.w * 3]) for y in range(self.h))
        def chunk(t, d):
            return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
        return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', self.w, self.h, 8, 2, 0, 0, 0))
                + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


# Czcionka bitmapowa 5x7 tylko dla znaku wodnego fikcyjnego fotobanku.
GLYPHS = {
    'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    'D': ['11100', '10010', '10001', '10001', '10001', '10010', '11100'],
    'G': ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
    'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
    'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
    'X': ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
    '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
    ' ': ['00000'] * 7,
    '*': ['00000', '00100', '10101', '01110', '10101', '00100', '00000'],
    'I': ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
    'C': ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
    'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    'J': ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
    'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    'Ą': ['01110', '10001', '10001', '11111', '10001', '10001', '10001', '00011'],
    'Ę': ['11111', '10000', '10000', '11110', '10000', '10000', '11111', '00011'],
}
GLYPHS = {k: (v + ['00000'])[:8] for k, v in GLYPHS.items()}  # 8. wiersz: ogonek


def draw_text(cv, text, x0, y0, scale, col):
    for n, ch in enumerate(text):
        for r, row in enumerate(GLYPHS[ch]):
            for c, bit in enumerate(row):
                if bit == '1':
                    cv.rect(x0 + (n * 6 + c) * scale, y0 + r * scale, x0 + (n * 6 + c + 1) * scale, y0 + (r + 1) * scale, col)


def watermark(cv, text='FOTOBANK-X * PODGLĄD * ', scale=7, angle=-28, alpha=0.42):
    rows = ['' for _ in range(8)]
    for ch in text:
        for r in range(8):
            rows[r] += GLYPHS[ch][r] + '0'
    tw, th = len(rows[0]) * scale, 8 * scale * 3  # odstęp między wierszami napisu
    ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    for y in range(cv.h):
        for xx in range(cv.w):
            u = xx * ca - y * sa
            v = xx * sa + y * ca
            row = int(v) % th
            if row >= 8 * scale:
                continue
            col = int(u + (int(v) // th) * scale * 9) % tw
            if rows[row // scale][col // scale] == '1':
                cv.blend(xx, y, (255, 255, 255), alpha)


def desk_scene(w=1200, h=800):
    """Autorska ilustracja: stanowisko praktykanta (biurko, laptop, kubek, roślina)."""
    cv = Canvas(w, h, (226, 232, 240))
    cv.vgrad(0, 0, w, 520, (214, 226, 238), (236, 240, 246))
    cv.rect(760, 70, 1110, 380, (120, 144, 170))           # okno
    cv.vgrad(775, 85, 1095, 365, (130, 184, 232), (196, 226, 248))
    cv.rect(930, 85, 942, 365, (120, 144, 170))
    cv.ellipse(1020, 160, 38, 38, (255, 214, 102))
    cv.rect(90, 110, 330, 300, (255, 255, 255))           # tablica z kartkami
    for i, c in enumerate([(255, 200, 87), (130, 205, 170), (247, 160, 160)]):
        cv.rect(115 + i * 72, 140, 170 + i * 72, 195, c)
    cv.rect(115, 220, 300, 232, (176, 190, 205)); cv.rect(115, 248, 260, 260, (176, 190, 205))
    cv.rect(0, 520, w, h, (176, 128, 86))                  # blat
    cv.rect(0, 520, w, 540, (150, 104, 66))
    cv.poly([(380, 520), (820, 520), (860, 560), (340, 560)], (60, 66, 80))   # laptop - podstawa
    cv.rrect(410, 250, 790, 520, 14, (44, 50, 64))         # ekran
    cv.rect(430, 270, 770, 500, (36, 110, 190))
    cv.rect(455, 300, 650, 318, (255, 255, 255)); cv.rect(455, 335, 720, 347, (170, 205, 240))
    cv.rect(455, 362, 690, 374, (170, 205, 240)); cv.rect(455, 400, 560, 470, (255, 214, 102))
    cv.rect(580, 400, 745, 470, (130, 205, 170))
    cv.rrect(900, 440, 990, 560, 12, (231, 76, 60))        # kubek
    cv.ellipse(1000, 495, 26, 32, (231, 76, 60)); cv.ellipse(1000, 495, 13, 19, (176, 128, 86))
    cv.rrect(110, 470, 230, 560, 10, (92, 64, 51))         # doniczka
    for cx, cy, r in [(170, 400, 60), (120, 430, 45), (220, 430, 45), (170, 340, 40)]:
        cv.ellipse(cx, cy, r, r, (61, 145, 96))
    cv.rect(250, 600, 520, 640, (245, 245, 245)); cv.rect(250, 600, 520, 606, (200, 200, 200))  # notes
    return cv


# ---------------------------------------------------------------- XML: elementy wspólne
def rpr(sz=None, b=False, i=False, color=None, font=None, scheme=None, tag='a:rPr'):
    attrs = ' lang="pl-PL"' + (f' sz="{sz}"' if sz else '') + (' b="1"' if b else '') + (' i="1"' if i else '')
    inner = ''
    if color:
        inner += f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
    elif scheme:
        inner += f'<a:solidFill><a:schemeClr val="{scheme}"/></a:solidFill>'
    if font:
        inner += f'<a:latin typeface="{x(font)}"/><a:cs typeface="{x(font)}"/>'
    return f'<{tag}{attrs} dirty="0">{inner}</{tag}>' if inner else f'<{tag}{attrs} dirty="0"/>'


def para(text='', algn=None, lvl=0, bullet=None, **fmt):
    ppr_attrs = (f' lvl="{lvl}"' if lvl else '') + (f' algn="{algn}"' if algn else '')
    ppr_inner = '<a:buNone/>' if bullet is False else ''
    ppr = f'<a:pPr{ppr_attrs}>{ppr_inner}</a:pPr>' if (ppr_attrs or ppr_inner) else ''
    if not text:
        return f'<a:p>{ppr}{rpr(tag="a:endParaRPr", **fmt)}</a:p>'
    return f'<a:p>{ppr}<a:r>{rpr(**fmt)}<a:t>{x(text)}</a:t></a:r></a:p>'


def xfrm(x0, y0, w, h, tag='a:xfrm'):
    return f'<{tag}><a:off x="{px(x0)}" y="{px(y0)}"/><a:ext cx="{px(w)}" cy="{px(h)}"/></{tag}>'


def ph_sp(sid, name, ph, paras=None, box=None, lst='', body_attrs='', prompt=False):
    """Symbol zastępczy. ph: atrybuty p:ph, np. 'type="title"' albo 'idx="1"'."""
    sppr = f'<p:spPr>{xfrm(*box)}</p:spPr>' if box else '<p:spPr/>'
    custom = ' hasCustomPrompt="1"' if prompt else ''
    paras = paras or [para()]
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{x(name)}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
            f'<p:nvPr><p:ph {ph}{custom}/></p:nvPr></p:nvSpPr>{sppr}'
            f'<p:txBody><a:bodyPr{body_attrs}/><a:lstStyle>{lst}</a:lstStyle>{"".join(paras)}</p:txBody></p:sp>')


def text_sp(sid, name, box, paras, fill=None, geom='rect', line=None, anchor='t', descr=None, wrap=True):
    f = f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>' if fill else '<a:noFill/>'
    ln = f'<a:ln w="19050"><a:solidFill><a:srgbClr val="{line}"/></a:solidFill></a:ln>' if line else ''
    d = f' descr="{x(descr)}"' if descr else ''
    tb = ' txBox="1"' if geom == 'rect' and not fill else ''
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{x(name)}"{d}/><p:cNvSpPr{tb}/><p:nvPr/></p:nvSpPr>'
            f'<p:spPr>{xfrm(*box)}<a:prstGeom prst="{geom}"><a:avLst/></a:prstGeom>{f}{ln}</p:spPr>'
            f'<p:txBody><a:bodyPr wrap="{"square" if wrap else "none"}" anchor="{anchor}" rtlCol="0"><a:normAutofit/></a:bodyPr><a:lstStyle/>{"".join(paras)}</p:txBody></p:sp>')


def deco_sp(sid, name, box, fill, geom='rect'):
    return (f'<p:sp><p:nvSpPr><p:cNvPr id="{sid}" name="{x(name)}"/><p:cNvSpPr/><p:nvPr userDrawn="1"/></p:nvSpPr>'
            f'<p:spPr>{xfrm(*box)}<a:prstGeom prst="{geom}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr>'
            f'<p:txBody><a:bodyPr rtlCol="0" anchor="ctr"/><a:lstStyle/>{para()}</p:txBody></p:sp>')


def pic_sp(sid, name, rid, box, descr):
    return (f'<p:pic><p:nvPicPr><p:cNvPr id="{sid}" name="{x(name)}" descr="{x(descr)}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>'
            f'<p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
            f'<p:spPr>{xfrm(*box)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>')


def table_frame(sid, name, box, cols, rows, sz=1100):
    x0, y0, w, h = box
    widths = [px(w * c) for c in cols]
    widths[-1] = px(w) - sum(widths[:-1])
    rh = px(h / len(rows))
    grid = ''.join(f'<a:gridCol w="{cw}"/>' for cw in widths)
    trs = ''
    for r in rows:
        tcs = ''.join(f'<a:tc><a:txBody><a:bodyPr/><a:lstStyle/>{para(c, sz=sz)}</a:txBody><a:tcPr/></a:tc>' for c in r)
        trs += f'<a:tr h="{rh}">{tcs}</a:tr>'
    return (f'<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="{sid}" name="{x(name)}"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>'
            f'{xfrm(*box, tag="p:xfrm")}<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">'
            f'<a:tbl><a:tblPr firstRow="1" bandRow="1"><a:tableStyleId>{{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}}</a:tableStyleId></a:tblPr>'
            f'<a:tblGrid>{grid}</a:tblGrid>{trs}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>')


def sp_tree(shapes):
    return ('<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
            '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
            + ''.join(shapes) + '</p:spTree>')


def bg_solid(color=None, scheme=None):
    fill = f'<a:srgbClr val="{color}"/>' if color else f'<a:schemeClr val="{scheme}"/>'
    return f'<p:bg><p:bgPr><a:solidFill>{fill}</a:solidFill><a:effectLst/></p:bgPr></p:bg>'


def bg_grad(c0, c1):
    return (f'<p:bg><p:bgPr><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="{c0}"/></a:gs>'
            f'<a:gs pos="100000"><a:srgbClr val="{c1}"/></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:effectLst/></p:bgPr></p:bg>')


def rels(items):
    body = ''.join(f'<Relationship Id="{i}" Type="{t}" Target="{x(tg)}"/>' for i, t, tg in items)
    return HEAD + f'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{body}</Relationships>'


def theme(name, colors, major, minor):
    names = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink']
    clr = ''
    for n, c in zip(names, colors):
        clr += f'<a:{n}><a:srgbClr val="{c}"/></a:{n}>'
    def font(t):
        return f'<a:latin typeface="{t}" panose="00000000000000000000"/><a:ea typeface=""/><a:cs typeface=""/>'
    solid = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
    grad = ('<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="67000"/></a:schemeClr></a:gs>'
            '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="80000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>')
    lns = ''.join(f'<a:ln w="{w}" cap="flat" cmpd="sng" algn="ctr">{solid}<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>' for w in (6350, 12700, 19050))
    eff = '<a:effectStyle><a:effectLst/></a:effectStyle>' * 3
    return (HEAD + f'<a:theme xmlns:a="{NS_A}" name="{x(name)}"><a:themeElements>'
            f'<a:clrScheme name="{x(name)}">{clr}</a:clrScheme>'
            f'<a:fontScheme name="{x(name)}"><a:majorFont>{font(major)}</a:majorFont><a:minorFont>{font(minor)}</a:minorFont></a:fontScheme>'
            f'<a:fmtScheme name="{x(name)}"><a:fillStyleLst>{solid}{grad}{grad}</a:fillStyleLst>'
            f'<a:lnStyleLst>{lns}</a:lnStyleLst><a:effectStyleLst>{eff}</a:effectStyleLst>'
            f'<a:bgFillStyleLst>{solid}{solid}{grad}</a:bgFillStyleLst></a:fmtScheme>'
            '</a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>')


def levels(sizes, color='tx1', font='+mn-lt', bullets=True, bullet_color=None, title=False):
    out = ''
    for i in range(9):
        sz = sizes[min(i, len(sizes) - 1)]
        if title:
            out += (f'<a:lvl{i + 1}pPr algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">'
                    f'<a:lnSpc><a:spcPct val="90000"/></a:lnSpc><a:spcBef><a:spcPct val="0"/></a:spcBef><a:buNone/>'
                    f'<a:defRPr sz="{sz}" kern="1200"><a:solidFill><a:schemeClr val="{color}"/></a:solidFill>'
                    f'<a:latin typeface="{font}"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl{i + 1}pPr>')
            continue
        mar = 228600 + i * 457200
        bu = ''
        if bullets:
            bc = f'<a:buClr><a:schemeClr val="{bullet_color}"/></a:buClr>' if bullet_color else ''
            bu = f'{bc}<a:buFont typeface="Arial" panose="020B0604020202020204"/><a:buChar char="•"/>'
        else:
            bu = '<a:buNone/>'
        out += (f'<a:lvl{i + 1}pPr marL="{mar if bullets else i * 457200}" indent="{-228600 if bullets else 0}" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">'
                f'<a:lnSpc><a:spcPct val="100000"/></a:lnSpc><a:spcBef><a:spcPts val="{1000 if i == 0 else 500}"/></a:spcBef>{bu}'
                f'<a:defRPr sz="{sz}" kern="1200"><a:solidFill><a:schemeClr val="{color}"/></a:solidFill>'
                f'<a:latin typeface="{font}"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl{i + 1}pPr>')
    return out


# ---------------------------------------------------------------- układy slajdów
GEO = {
    'title': (64, 36, 1152, 110), 'body': (64, 170, 1152, 470),
    'dt': (64, 664, 300, 38), 'ftr': (420, 664, 440, 38), 'sldNum': (916, 664, 300, 38),
}
TITLE_PROMPT = 'Kliknij, aby edytować styl wzorca tytułu'
BODY_PROMPT = ['Kliknij, aby edytować style wzorca tekstu', 'Drugi poziom', 'Trzeci poziom']


def body_paras(lines):
    return [para(t, lvl=i if len(lines) == 3 and lines == BODY_PROMPT else 0) for i, t in enumerate(lines)]


def std_layouts():
    """Standardowe układy (nazwy jak w polskim PowerPoincie)."""
    t = lambda sid=2: ph_sp(sid, 'Tytuł 1', 'type="title"', [para(TITLE_PROMPT)])
    return [
        ('Slajd tytułowy', 'title', [
            ph_sp(2, 'Tytuł 1', 'type="ctrTitle"', [para(TITLE_PROMPT)], (160, 190, 960, 200), lst='<a:lvl1pPr algn="ctr"><a:defRPr sz="5400"/></a:lvl1pPr>', body_attrs=' anchor="b"'),
            ph_sp(3, 'Podtytuł 2', 'type="subTitle" idx="1"', [para('Kliknij, aby edytować styl wzorca podtytułu')], (160, 410, 960, 120),
                  lst='<a:lvl1pPr marL="0" indent="0" algn="ctr"><a:buNone/><a:defRPr sz="2400"/></a:lvl1pPr>')]),
        ('Tytuł i zawartość', 'obj', [t(), ph_sp(3, 'Symbol zastępczy zawartości 2', 'idx="1"', body_paras(BODY_PROMPT))]),
        ('Nagłówek sekcji', 'secHead', [
            ph_sp(2, 'Tytuł 1', 'type="title"', [para(TITLE_PROMPT)], (88, 180, 1104, 250), lst='<a:lvl1pPr><a:defRPr sz="5400"/></a:lvl1pPr>', body_attrs=' anchor="b"'),
            ph_sp(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', [para('Kliknij, aby edytować style wzorca tekstu')], (88, 450, 1104, 110),
                  lst='<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2400"/></a:lvl1pPr>')]),
        ('Dwie zawartości', 'twoObj', [t(),
            ph_sp(3, 'Symbol zastępczy zawartości 2', 'sz="half" idx="1"', body_paras(BODY_PROMPT), (64, 170, 560, 470)),
            ph_sp(4, 'Symbol zastępczy zawartości 3', 'sz="half" idx="2"', body_paras(BODY_PROMPT), (656, 170, 560, 470))]),
        ('Porównanie', 'twoTxTwoObj', [t(),
            ph_sp(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', [para('Kliknij, aby edytować style wzorca tekstu', b=True)], (64, 170, 560, 64), lst='<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2400" b="1"/></a:lvl1pPr>', body_attrs=' anchor="b"'),
            ph_sp(4, 'Symbol zastępczy zawartości 3', 'sz="half" idx="2"', body_paras(BODY_PROMPT), (64, 244, 560, 396)),
            ph_sp(5, 'Symbol zastępczy tekstu 4', 'type="body" sz="quarter" idx="3"', [para('Kliknij, aby edytować style wzorca tekstu', b=True)], (656, 170, 560, 64), lst='<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2400" b="1"/></a:lvl1pPr>', body_attrs=' anchor="b"'),
            ph_sp(6, 'Symbol zastępczy zawartości 5', 'sz="quarter" idx="4"', body_paras(BODY_PROMPT), (656, 244, 560, 396))]),
        ('Tylko tytuł', 'titleOnly', [t()]),
        ('Pusty', 'blank', []),
        ('Obraz z podpisem', 'picTx', [
            ph_sp(2, 'Tytuł 1', 'type="title"', [para(TITLE_PROMPT)], (88, 48, 430, 160), lst='<a:lvl1pPr><a:defRPr sz="3200"/></a:lvl1pPr>', body_attrs=' anchor="b"'),
            ph_sp(3, 'Symbol zastępczy obrazu 2', 'type="pic" idx="1"', [para()], (560, 48, 650, 600), lst='<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2800"/></a:lvl1pPr>'),
            ph_sp(4, 'Symbol zastępczy tekstu 3', 'type="body" sz="half" idx="2"', [para('Kliknij, aby edytować style wzorca tekstu')], (88, 220, 430, 428),
                  lst='<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="1800"/></a:lvl1pPr>')]),
    ]


def master_xml(layout_ids, title_sizes, body_sizes, title_color, body_color, bullet_color, bg, deco=()):
    shapes = [
        ph_sp(2, 'Symbol zastępczy tytułu 1', 'type="title"', [para(TITLE_PROMPT)], GEO['title'], body_attrs=' vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"'),
        ph_sp(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', body_paras(BODY_PROMPT), GEO['body'], body_attrs=' vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"'),
        ph_sp(4, 'Symbol zastępczy daty 3', 'type="dt" sz="half" idx="2"', [para()], GEO['dt'], lst='<a:lvl1pPr algn="l"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr>'),
        ph_sp(5, 'Symbol zastępczy stopki 4', 'type="ftr" sz="quarter" idx="3"', [para()], GEO['ftr'], lst='<a:lvl1pPr algn="ctr"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr>'),
        ph_sp(6, 'Symbol zastępczy numeru slajdu 5', 'type="sldNum" sz="quarter" idx="4"',
              ['<a:p><a:fld id="{B6F15528-21DE-4FAA-801E-634DDDAF4B2B}" type="slidenum"><a:rPr lang="pl-PL"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="pl-PL"/></a:p>'],
              GEO['sldNum'], lst='<a:lvl1pPr algn="r"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"><a:tint val="75000"/></a:schemeClr></a:solidFill></a:defRPr></a:lvl1pPr>'),
    ] + list(deco)
    ids = ''.join(f'<p:sldLayoutId id="{i}" r:id="rId{n + 1}"/>' for n, i in enumerate(layout_ids))
    return (HEAD + f'<p:sldMaster {NSDECL}><p:cSld>{bg}{sp_tree(shapes)}</p:cSld>'
            '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
            f'<p:sldLayoutIdLst>{ids}</p:sldLayoutIdLst>'
            f'<p:txStyles><p:titleStyle>{levels(title_sizes, title_color, "+mj-lt", title=True)}</p:titleStyle>'
            f'<p:bodyStyle>{levels(body_sizes, body_color, bullet_color=bullet_color)}</p:bodyStyle>'
            f'<p:otherStyle><a:defPPr><a:defRPr lang="pl-PL"/></a:defPPr>{levels([1800], "tx1", bullets=False)}</p:otherStyle></p:txStyles></p:sldMaster>')


def layout_xml(name, ltype, shapes):
    return (HEAD + f'<p:sldLayout {NSDECL} type="{ltype}" preserve="1"><p:cSld name="{x(name)}">{sp_tree(shapes)}</p:cSld>'
            '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>')


def notes_master_xml():
    shapes = [
        ph_sp(2, 'Symbol zastępczy nagłówka 1', 'type="hdr" sz="quarter"', [para()], (0, 0, 2971800 / 9525, 458788 / 9525)),
        ph_sp(3, 'Symbol zastępczy obrazu slajdu 2', 'type="sldImg" idx="2"', [para()], (381000 / 9525, 685800 / 9525, 6096000 / 9525, 3429000 / 9525)),
        ph_sp(4, 'Symbol zastępczy notatek 3', 'type="body" sz="quarter" idx="3"', [para('Kliknij, aby edytować style wzorca tekstu')], (685800 / 9525, 4400550 / 9525, 5486400 / 9525, 3600450 / 9525)),
        ph_sp(5, 'Symbol zastępczy numeru slajdu 4', 'type="sldNum" sz="quarter" idx="5"',
              ['<a:p><a:fld id="{0F1C4A7B-2A7E-4D5C-9E0B-1B2C3D4E5F60}" type="slidenum"><a:rPr lang="pl-PL"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="pl-PL"/></a:p>'],
              (3884613 / 9525, 8685213 / 9525, 2971800 / 9525, 458787 / 9525)),
    ]
    style = ''.join(f'<a:lvl{i + 1}pPr marL="{i * 457200}" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl{i + 1}pPr>' for i in range(9))
    return (HEAD + f'<p:notesMaster {NSDECL}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>{sp_tree(shapes)}</p:cSld>'
            '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>'
            f'<p:notesStyle>{style}</p:notesStyle></p:notesMaster>')


def notes_xml(lines):
    shapes = [
        '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Symbol zastępczy obrazu slajdu 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp>',
        ph_sp(3, 'Symbol zastępczy notatek 2', 'type="body" idx="1"', [para(t) for t in lines]),
    ]
    return (HEAD + f'<p:notes {NSDECL}><p:cSld>{sp_tree(shapes)}</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>')


# ---------------------------------------------------------------- animacje (lekcja 75: celowo za dużo)
def effect(ctn, spid, kind, click):
    """Zwraca (xml, następny id). kind: appear, fade, fly, wipe, spin."""
    start = ctn
    node = 'clickEffect' if click else 'afterEffect'
    c = lambda: (f'<p:cBhvr><p:cTn id="{{id}}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                 f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>')
    ids = iter(range(ctn + 1, ctn + 10))
    setvis = lambda: '<p:set>' + c().replace('{id}', str(next(ids))) + '<p:to><p:strVal val="visible"/></p:to></p:set>'
    tgt = f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
    if kind == 'appear':
        preset, cls, sub, inner = 1, 'entr', 0, setvis()
    elif kind == 'fade':
        preset, cls, sub = 10, 'entr', 0
        inner = setvis() + f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="500"/>{tgt}</p:cBhvr></p:animEffect>'
    elif kind == 'wipe':
        preset, cls, sub = 22, 'entr', 4
        inner = setvis() + f'<p:animEffect transition="in" filter="wipe(down)"><p:cBhvr><p:cTn id="{next(ids)}" dur="500"/>{tgt}</p:cBhvr></p:animEffect>'
    elif kind == 'fly':
        preset, cls, sub = 2, 'entr', 4
        anim = lambda attr, v0, v1: (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{next(ids)}" dur="500" fill="hold"/>{tgt}'
                                     f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>'
                                     f'<p:tav tm="0"><p:val><p:strVal val="{v0}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="{v1}"/></p:val></p:tav></p:tavLst></p:anim>')
        inner = setvis() + anim('ppt_x', '#ppt_x', '#ppt_x') + anim('ppt_y', '1+#ppt_h/2', '#ppt_y')
    elif kind == 'spin':
        preset, cls, sub = 8, 'emph', 0
        inner = (f'<p:animRot by="21600000"><p:cBhvr><p:cTn id="{next(ids)}" dur="2000" fill="hold"/>{tgt}'
                 '<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot>')
    used = next(ids)  # pierwszy wolny
    return (f'<p:par><p:cTn id="{start}" presetID="{preset}" presetClass="{cls}" presetSubtype="{sub}" fill="hold" grpId="0" nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'), used


def timing(effects):
    """effects: lista (spid, kind). Każdy efekt uruchamiany kliknięciem."""
    nid = 3
    pars = ''
    for spid, kind in effects:
        outer, mid = nid, nid + 1
        xml, nid = effect(nid + 2, spid, kind, True)
        pars += (f'<p:par><p:cTn id="{outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
                 f'<p:par><p:cTn id="{mid}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{xml}</p:childTnLst></p:cTn></p:par>'
                 '</p:childTnLst></p:cTn></p:par>')
    bld = ''.join(f'<p:bldP spid="{s}" grpId="0" animBg="1"/>' for s in dict.fromkeys(s for s, k in effects if k != 'spin'))
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{pars}</p:childTnLst></p:cTn>'
            '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            f'</p:childTnLst></p:cTn></p:par></p:tnLst>{"<p:bldLst>" + bld + "</p:bldLst>" if bld else ""}</p:timing>')


def slide_xml(shapes, bg='', transition='', anim=''):
    return (HEAD + f'<p:sld {NSDECL}><p:cSld>{bg}{sp_tree(shapes)}</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>{transition}{anim}</p:sld>')


# ---------------------------------------------------------------- pakiet
def build_pptx(path, *, title, theme_xml, master, layouts, slides, media=()):
    """layouts: [(name,type,shapes)], slides: [{layout:int, xml:str, notes:[...]|None, rels:[(rid,type,target)]}]"""
    files = {}
    n_l, n_s = len(layouts), len(slides)
    ct = ['<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
          '<Default Extension="xml" ContentType="application/xml"/>',
          '<Default Extension="png" ContentType="image/png"/>',
          f'<Override PartName="/ppt/presentation.xml" ContentType="{CT}presentation.main+xml"/>',
          f'<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="{CT}slideMaster+xml"/>',
          f'<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="{CT}notesMaster+xml"/>',
          '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
          '<Override PartName="/ppt/theme/theme2.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
          f'<Override PartName="/ppt/presProps.xml" ContentType="{CT}presProps+xml"/>',
          f'<Override PartName="/ppt/viewProps.xml" ContentType="{CT}viewProps+xml"/>',
          f'<Override PartName="/ppt/tableStyles.xml" ContentType="{CT}tableStyles+xml"/>',
          '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
          '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>']
    ct += [f'<Override PartName="/ppt/slideLayouts/slideLayout{i + 1}.xml" ContentType="{CT}slideLayout+xml"/>' for i in range(n_l)]
    ct += [f'<Override PartName="/ppt/slides/slide{i + 1}.xml" ContentType="{CT}slide+xml"/>' for i in range(n_s)]
    ct += [f'<Override PartName="/ppt/notesSlides/notesSlide{i + 1}.xml" ContentType="{CT}notesSlide+xml"/>' for i, s in enumerate(slides) if s.get('notes')]
    files['[Content_Types].xml'] = HEAD + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' + ''.join(ct) + '</Types>'
    files['_rels/.rels'] = rels([('rId1', REL + 'officeDocument', 'ppt/presentation.xml'),
                                 ('rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'),
                                 ('rId3', REL + 'extended-properties', 'docProps/app.xml')])
    files['docProps/core.xml'] = (HEAD + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
                                  'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
                                  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
                                  f'<dc:title>{x(title)}</dc:title><dc:creator>Informatyka praktycznie – materiały lekcji</dc:creator><dc:language>pl-PL</dc:language>'
                                  f'<dcterms:created xsi:type="dcterms:W3CDTF">{CREATED}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">{CREATED}</dcterms:modified>'
                                  '</cp:coreProperties>')
    files['docProps/app.xml'] = (HEAD + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
                                 'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
                                 f'<PresentationFormat>Panoramiczny</PresentationFormat><Slides>{n_s}</Slides><Notes>{sum(1 for s in slides if s.get("notes"))}</Notes>'
                                 '<Application>Informatyka praktycznie (generator PPTX)</Application></Properties>')
    pres_rels = [('rId1', REL + 'slideMaster', 'slideMasters/slideMaster1.xml')]
    pres_rels += [(f'rId{i + 2}', REL + 'slide', f'slides/slide{i + 1}.xml') for i in range(n_s)]
    k = n_s + 2
    pres_rels += [(f'rId{k}', REL + 'notesMaster', 'notesMasters/notesMaster1.xml'), (f'rId{k + 1}', REL + 'presProps', 'presProps.xml'),
                  (f'rId{k + 2}', REL + 'viewProps', 'viewProps.xml'), (f'rId{k + 3}', REL + 'theme', 'theme/theme1.xml'),
                  (f'rId{k + 4}', REL + 'tableStyles', 'tableStyles.xml')]
    files['ppt/_rels/presentation.xml.rels'] = rels(pres_rels)
    dts = levels([1800], 'tx1', bullets=False).replace('marL="0" indent="0" ', 'marL="0" ').replace('<a:buNone/>', '')
    sld_ids = ''.join(f'<p:sldId id="{256 + i}" r:id="rId{i + 2}"/>' for i in range(n_s))
    files['ppt/presentation.xml'] = (HEAD + f'<p:presentation {NSDECL} saveSubsetFonts="1">'
                                     '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>'
                                     f'<p:notesMasterIdLst><p:notesMasterId r:id="rId{k}"/></p:notesMasterIdLst>'
                                     f'<p:sldIdLst>{sld_ids}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/>'
                                     f'<p:defaultTextStyle><a:defPPr><a:defRPr lang="pl-PL"/></a:defPPr>{dts}</p:defaultTextStyle></p:presentation>')
    files['ppt/presProps.xml'] = HEAD + f'<p:presentationPr {NSDECL}/>'
    files['ppt/viewProps.xml'] = (HEAD + f'<p:viewPr {NSDECL}><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="80000"/></p:normalViewPr>'
                                  '<p:slideViewPr><p:cSldViewPr snapToGrid="0"><p:cViewPr varScale="1"><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr><p:guideLst/></p:cSldViewPr></p:slideViewPr>'
                                  '<p:notesTextViewPr><p:cViewPr><p:scale><a:sx n="1" d="1"/><a:sy n="1" d="1"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx="72008" cy="72008"/></p:viewPr>')
    files['ppt/tableStyles.xml'] = HEAD + f'<a:tblStyleLst xmlns:a="{NS_A}" def="{{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}}"/>'
    files['ppt/theme/theme1.xml'] = theme_xml
    files['ppt/theme/theme2.xml'] = theme('Notatki', ['000000', 'FFFFFF', '1F2A44', 'EEF1F5', '1F4FA3', 'C0504D', '16A36A', '8064A2', '4BACC6', 'F79646', '1F4FA3', '6B4E9B'], 'Calibri Light', 'Calibri')
    files['ppt/slideMasters/slideMaster1.xml'] = master([2147483649 + i for i in range(n_l)])
    files['ppt/slideMasters/_rels/slideMaster1.xml.rels'] = rels([(f'rId{i + 1}', REL + 'slideLayout', f'../slideLayouts/slideLayout{i + 1}.xml') for i in range(n_l)]
                                                                 + [(f'rId{n_l + 1}', REL + 'theme', '../theme/theme1.xml')])
    for i, (name, ltype, shapes) in enumerate(layouts):
        files[f'ppt/slideLayouts/slideLayout{i + 1}.xml'] = layout_xml(name, ltype, shapes)
        files[f'ppt/slideLayouts/_rels/slideLayout{i + 1}.xml.rels'] = rels([('rId1', REL + 'slideMaster', '../slideMasters/slideMaster1.xml')])
    files['ppt/notesMasters/notesMaster1.xml'] = notes_master_xml()
    files['ppt/notesMasters/_rels/notesMaster1.xml.rels'] = rels([('rId1', REL + 'theme', '../theme/theme2.xml')])
    nn = 0
    for i, s in enumerate(slides):
        r = [('rId1', REL + 'slideLayout', f'../slideLayouts/slideLayout{s["layout"] + 1}.xml')] + s.get('rels', [])
        if s.get('notes'):
            nn += 1
            r.append((f'rId{len(r) + 1}', REL + 'notesSlide', f'../notesSlides/notesSlide{nn}.xml'))
            files[f'ppt/notesSlides/notesSlide{nn}.xml'] = notes_xml(s['notes'])
            files[f'ppt/notesSlides/_rels/notesSlide{nn}.xml.rels'] = rels([('rId1', REL + 'notesMaster', '../notesMasters/notesMaster1.xml'),
                                                                             ('rId2', REL + 'slide', f'../slides/slide{i + 1}.xml')])
        files[f'ppt/slides/slide{i + 1}.xml'] = s['xml']
        files[f'ppt/slides/_rels/slide{i + 1}.xml.rels'] = rels(r)
    for name, data in media:
        files[f'ppt/media/{name}'] = data
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for name in ['[Content_Types].xml'] + sorted(n for n in files if n != '[Content_Types].xml'):
            info = zipfile.ZipInfo(name, STAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            data = files[name]
            z.writestr(info, data.encode('utf-8') if isinstance(data, str) else data)


# ---------------------------------------------------------------- lekcja 75: zła prezentacja do naprawy
def lesson75():
    clean = desk_scene()
    (OUT / 'lesson-75-grafika.png').write_bytes(clean.png())
    stock = desk_scene()
    watermark(stock)
    stock.rect(0, 736, 1200, 800, (30, 30, 30))
    draw_text(stock, 'FOTOBANK-X * PODGLĄD * KUP LICENCJĘ', 30, 748, 5, (235, 235, 235))
    stock_png = stock.png()

    office = theme('Pakiet Office (lekcja 75)', ['000000', 'FFFFFF', '44546A', 'E7E6E6', '4472C4', 'ED7D31', 'A5A5A5', 'FFC000', '5B9BD5', '70AD47', '0563C1', '954F72'],
                   'Calibri Light', 'Calibri')
    master = lambda ids: master_xml(ids, [4400], [2800, 2400, 2000], 'tx1', 'tx1', None, bg_solid(scheme='bg1'))
    L = {name: i for i, (name, _, _) in enumerate(std_layouts())}
    s = []
    # 1. Tytuł: ręczne formatowanie, gradient, słaby kontrast podtytułu
    s.append({'layout': L['Slajd tytułowy'], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="ctrTitle"', [para('PRAKTYKI ZAWODOWE!!!', sz=6600, b=True, color='FF2D2D', font='Impact')], (60, 120, 1160, 230)),
        ph_sp(3, 'Podtytuł 2', 'type="subTitle" idx="1"', [para('Poradnik dla klas pierwszych – wszystko, co musisz wiedzieć, zanim pójdziesz do firmy', sz=2000, i=True, color='D9D2E9', font='Times New Roman')], (160, 400, 960, 120)),
    ], bg=bg_grad('FFE3F1', 'C6F1FF'), transition='<p:transition spd="slow"><p:wheel spokes="8"/></p:transition>')})
    # 2. Ściana tekstu, mała czcionka, ręcznie przesunięte pole
    wall = ['Praktyki zawodowe to część nauki w technikum, która odbywa się w prawdziwej firmie albo instytucji, a nie w szkole.',
            'Podczas praktyk uczeń poznaje codzienną pracę w zawodzie i wykonuje zadania pod opieką opiekuna praktyk.',
            'Opiekun praktyk to pracownik firmy, który przydziela zadania i ocenia ucznia.',
            'Praktyki trwają zwykle kilka tygodni i mają określone godziny pracy, których trzeba przestrzegać.',
            'Na praktykach obowiązuje regulamin firmy, zasady BHP i tajemnica firmy.',
            'Uczeń prowadzi dzienniczek praktyk i wpisuje do niego wykonane zadania.',
            'Na koniec opiekun wystawia ocenę, która trafia do szkoły.',
            'Dobre praktyki mogą skończyć się propozycją pracy wakacyjnej albo pracy po szkole.',
            'Warto zapisywać pytania, które pojawiają się w trakcie dnia, i zadawać je opiekunowi w spokojnym momencie, a nie w trakcie ważnego zadania.',
            'Telefon w czasie pracy odkładamy, chyba że opiekun pozwoli inaczej, bo w wielu firmach obowiązują zasady dotyczące zdjęć i nagrywania.']
    s.append({'layout': L['Tytuł i zawartość'], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="title"', [para('Czym są praktyki zawodowe i jak wyglądają w praktyce w firmie?', sz=2400, b=True, color='7030A0', font='Comic Sans MS')], (30, 10, 1220, 80)),
        ph_sp(3, 'Symbol zastępczy zawartości 2', 'idx="1"', [para(t, sz=1600, font='Times New Roman', color='404040') for t in wall], (30, 95, 1220, 610)),
    ], transition='<p:transition spd="med"><p:checker/></p:transition>')})
    # 3. Słaby kontrast, ozdobniki i 5 animacji
    s.append({'layout': L['Tytuł i zawartość'], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="title"', [para('Co zabrać pierwszego dnia?', sz=4000, b=True, color='FFE14D', font='Arial Black')]),
        ph_sp(3, 'Symbol zastępczy zawartości 2', 'idx="1"', [para(t, sz=2800, color='F5E68A', font='Arial') for t in
            ['Dowód osobisty albo legitymację', 'Skierowanie na praktyki ze szkoły', 'Dzienniczek praktyk', 'Wygodne buty i coś do jedzenia']], (64, 170, 820, 470)),
        text_sp(4, 'Gwiazda 3', (930, 170, 230, 210), [para('WAŻNE!', algn='ctr', sz=1600, b=True, color='FFFF00', font='Comic Sans MS')], fill='FF0000', geom='star5', anchor='ctr'),
        text_sp(5, 'Gwiazda 4', (980, 400, 200, 190), [para('!!!', algn='ctr', sz=2400, b=True, color='FFFFFF', font='Impact')], fill='00B050', geom='star5', anchor='ctr'),
        text_sp(6, 'Strzałka 5', (900, 610, 300, 80), [para('nie zapomnij', algn='ctr', sz=1400, color='FFFFFF', font='Comic Sans MS')], fill='7030A0', geom='rightArrow', anchor='ctr'),
    ], transition='<p:transition spd="slow"><p:split orient="vert" dir="in"/></p:transition>',
        anim=timing([(2, 'spin'), (3, 'fly'), (4, 'wipe'), (5, 'fade'), (6, 'appear')]))})
    # 4. Zdjęcie ze znakiem wodnym, rozciągnięte, bez źródła
    s.append({'layout': L['Tylko tytuł'], 'rels': [('rId2', REL + 'image', '../media/image1.png')], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="title"', [para('Twoje stanowisko pracy', sz=4000, color='C00000', font='Monotype Corsiva')]),
        pic_sp(3, 'Obraz 2', 'rId2', (64, 160, 1150, 420), 'Zdjęcie biurka z laptopem, kubkiem i rośliną, z widocznym znakiem wodnym fotobanku'),
        text_sp(4, 'Pole tekstowe 3', (64, 590, 1150, 60), [para('zdjęcie z internetu. Dbaj o porządek na stanowisku i nie jedz przy komputerze firmy!', sz=1200, color='A6A6A6', font='Arial')]),
    ], transition='<p:transition spd="slow"><p:wheel spokes="4"/></p:transition>')})
    # 5. Tabela danych zamiast jednej myśli lub wykresu (dane fikcyjne)
    rows = [['Odpowiedź', 'Liczba osób', 'Procent', 'Uwagi'],
            ['Że nie poradzę sobie z zadaniami', '19', '38%', 'najczęściej klasy 1'],
            ['Nowych ludzi w pracy', '12', '24%', ''],
            ['Dojazdu do firmy', '7', '14%', 'dojazd > 30 min'],
            ['Że będę się nudzić', '6', '12%', ''],
            ['Opiekuna praktyk', '4', '8%', ''],
            ['Inne', '2', '4%', 'np. stroju'],
            ['Razem', '50', '100%', 'ankieta, dane fikcyjne']]
    s.append({'layout': L['Tylko tytuł'], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="title"', [para('Wyniki ankiety: czego najbardziej boją się uczniowie przed pierwszymi praktykami zawodowymi?', sz=2000, b=True, color='2F5597', font='Verdana')]),
        table_frame(3, 'Tabela 2', (64, 170, 1150, 440), [0.42, 0.16, 0.14, 0.28], rows, sz=1100),
    ])})
    # 6. Koniec: czerwony na zielonym, brak slajdu ze źródłami
    s.append({'layout': L['Tytuł i zawartość'], 'xml': slide_xml([
        ph_sp(2, 'Tytuł 1', 'type="title"', [para('DZIĘKUJĘ ZA UWAGĘ!!!', algn='ctr', sz=5400, b=True, color='FF0000', font='Comic Sans MS')], (64, 180, 1152, 200)),
        ph_sp(3, 'Symbol zastępczy zawartości 2', 'idx="1"', [para('PYTANIA???', algn='ctr', bullet=False, sz=4400, color='C00000', font='Comic Sans MS')], (64, 400, 1152, 140)),
    ], bg=bg_solid('00B050'), transition='<p:transition spd="slow"><p:wheel spokes="8"/></p:transition>')})
    build_pptx(OUT / 'lesson-75-start.pptx', title='Praktyki zawodowe – prezentacja do naprawy (lekcja 46)', theme_xml=office,
               master=master, layouts=std_layouts(), slides=s, media=[('image1.png', stock_png)])
    return len(s)


# ---------------------------------------------------------------- lekcja 76: starter projektu o Chopinie
def lesson76():
    chopin = theme('Chopin (lekcja 47)', ['1E2235', 'FFFFFF', '1E2A4A', 'F7F2E8', '8C1C13', '1F4FA3', '3C7A5A', 'B07D12', '6B4E9B', '4A5A6B', '1F4FA3', '6B4E9B'],
                   'Georgia', 'Calibri')
    keys = [deco_sp(20 + i, f'Klawisz {i + 1}', (64 + i * 30, 704, 22, 14), '1E2A4A') for i in range(8)]
    master = lambda ids: master_xml(ids, [4000], [2800, 2400, 2000], 'tx2', 'tx1', 'accent1', bg_solid(scheme='bg2'),
                                    deco=keys)
    bar = deco_sp(10, 'Pasek akcentu', (64, 150, 120, 6), '8C1C13')
    std = std_layouts()
    pr = lambda sid, name, ph, lines, box=None, lst='', attrs='': ph_sp(sid, name, ph, [para(t) for t in lines], box, lst=lst, body_attrs=attrs, prompt=True)
    nob = '<a:lvl1pPr marL="0" indent="0"><a:buNone/>{}</a:lvl1pPr>'
    custom = [
        ('Chopin – tytuł', 'title', [
            pr(2, 'Tytuł 1', 'type="ctrTitle"', ['Tytuł prezentacji, np. Chopin w 5 minut'], (120, 180, 1040, 220), '<a:lvl1pPr algn="ctr"><a:defRPr sz="5400"/></a:lvl1pPr>', ' anchor="b"'),
            pr(3, 'Podtytuł 2', 'type="subTitle" idx="1"', ['Imię i nazwisko · klasa · dla kogo jest ta prezentacja'], (120, 420, 1040, 100), '<a:lvl1pPr marL="0" indent="0" algn="ctr"><a:buNone/><a:defRPr sz="2400"/></a:lvl1pPr>')]),
        ('Chopin – hak', 'cust', [
            pr(2, 'Tytuł 1', 'type="title"', ['Hak: jedno pytanie albo jedna liczba, która zaciekawi odbiorcę'], (120, 160, 1040, 280), '<a:lvl1pPr algn="ctr"><a:defRPr sz="4800"/></a:lvl1pPr>', ' anchor="ctr"'),
            pr(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', ['Krótki dopisek (opcjonalnie) – możesz usunąć to pole'], (120, 470, 1040, 90), '<a:lvl1pPr marL="0" indent="0" algn="ctr"><a:buNone/><a:defRPr sz="2400"/></a:lvl1pPr>')]),
        ('Chopin – 3 fakty', 'obj', [bar, 
            pr(2, 'Tytuł 1', 'type="title"', ['Życie w 3 faktach']),
            pr(3, 'Symbol zastępczy zawartości 2', 'idx="1"', ['Fakt 1: gdzie i kiedy się urodził (krótko, bez zdań z podręcznika)', 'Fakt 2: kiedy wyjechał i dokąd', 'Fakt 3: kiedy i gdzie zmarł'])]),
        ('Chopin – dwa miejsca', 'twoTxTwoObj', [bar, 
            pr(2, 'Tytuł 1', 'type="title"', ['Dwa miasta: Warszawa i Paryż']),
            pr(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', ['Warszawa'], (64, 170, 560, 64), '<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2400" b="1"/></a:lvl1pPr>', ' anchor="b"'),
            pr(4, 'Symbol zastępczy zawartości 3', 'sz="half" idx="2"', ['1–2 hasła: co tu robił?'], (64, 244, 560, 396)),
            pr(5, 'Symbol zastępczy tekstu 4', 'type="body" sz="quarter" idx="3"', ['Paryż'], (656, 170, 560, 64), '<a:lvl1pPr marL="0" indent="0"><a:buNone/><a:defRPr sz="2400" b="1"/></a:lvl1pPr>', ' anchor="b"'),
            pr(6, 'Symbol zastępczy zawartości 5', 'sz="quarter" idx="4"', ['1–2 hasła: co tu robił?'], (656, 244, 560, 396))]),
        ('Chopin – muzyka', 'picTx', [
            pr(2, 'Tytuł 1', 'type="title"', ['Posłuchaj: tytuł utworu'], (88, 48, 430, 160), '<a:lvl1pPr><a:defRPr sz="3200"/></a:lvl1pPr>', ' anchor="b"'),
            pr(3, 'Symbol zastępczy obrazu 2', 'type="pic" idx="1"', ['Opcjonalnie: kod QR do nagrania albo grafika z podpisem źródła'], (560, 48, 650, 600), nob.format('<a:defRPr sz="2000"/>')),
            pr(4, 'Symbol zastępczy tekstu 3', 'type="body" sz="half" idx="2"', ['Utwór (np. mazurek, polonez, nokturn)', 'Wykonawca i źródło nagrania', 'Licencja nagrania albo sam link'], (88, 220, 430, 428), nob.format('<a:defRPr sz="2000"/>'))]),
        ('Chopin – ciekawostka', 'secHead', [
            pr(2, 'Tytuł 1', 'type="title"', ['Ciekawostka w jednym zdaniu'], (88, 180, 1104, 250), '<a:lvl1pPr><a:defRPr sz="4800"/></a:lvl1pPr>', ' anchor="b"'),
            pr(3, 'Symbol zastępczy tekstu 2', 'type="body" idx="1"', ['Skąd to wiesz? (krótko: źródło)'], (88, 450, 1104, 110), nob.format('<a:defRPr sz="2400"/>'))]),
        ('Chopin – dziś (opcjonalny)', 'obj', [bar, 
            pr(2, 'Tytuł 1', 'type="title"', ['Chopin dziś (slajd opcjonalny)']),
            pr(3, 'Symbol zastępczy zawartości 2', 'idx="1"', ['Np. Konkurs Chopinowski, lotnisko, ławeczki z muzyką', 'Masz już 7 slajdów? Usuń ten slajd']) ]),
        ('Chopin – źródła', 'obj', [bar, 
            pr(2, 'Tytuł 1', 'type="title"', ['Źródła']),
            pr(3, 'Symbol zastępczy zawartości 2', 'idx="1"', ['Fakty: nazwa strony lub książki (np. teczka faktów z lekcji)', 'Grafika: tytuł – autor – źródło – licencja', 'Grafika z AI: „Grafika wygenerowana przez AI (narzędzie, data)”', 'Nagranie: wykonawca – źródło – licencja albo link'],
               lst='<a:lvl1pPr><a:defRPr sz="2000"/></a:lvl1pPr>')]),
    ]
    layouts = custom + [l for l in std if l[0] != 'Slajd tytułowy']
    notes = [
        ['Notatki prelegenta widzisz tylko Ty (Widok prezentera: Alt+F5).', 'Zastąp ten tekst: jak się przedstawisz i dla kogo mówisz – 1 zdanie.'],
        ['Zadaj pytanie z haka i odczekaj 3 sekundy. Dopiero potem podaj odpowiedź.', 'Tu wpisz odpowiedź na swoje pytanie (hasłem, nie zdaniem do czytania).'],
        ['Na slajdzie 3 krótkie hasła. Szczegóły (np. imiona rodziców) zapisz tutaj, w notatkach.'],
        ['Powiedz, dlaczego wyjechał i co znaczył dla niego Paryż. Na slajdzie zostaw tylko hasła.'],
        ['Jeśli puszczasz nagranie: wystarczy 15–20 sekund. Sprawdź głośność przed pokazem.', 'Link to nie kopia – link wolno podać. Plik nagrania wstawiasz tylko z licencją, która na to pozwala.'],
        ['Ciekawostkę opowiedz jak historię: kto, gdzie, co się stało. Sprawdź ją w dwóch źródłach.'],
        ['Slajd opcjonalny. Jeśli zostaje – jedno hasło na każdy punkt, nie więcej niż trzy punkty.'],
        ['Źródła pokaż przez 2–3 sekundy i powiedz: „Wszystkie grafiki mają podpisy”.'],
    ]
    slides = []
    for li, (name, _, shapes) in enumerate(custom):
        sl = []
        for sp in (sp for sp in shapes if '<p:ph ' in sp):
            ph = sp.split('<p:ph ')[1].split('/>')[0].replace(' hasCustomPrompt="1"', '')
            nm = sp.split('name="')[1].split('"')[0]
            sid = sp.split('id="')[1].split('"')[0]
            sl.append(ph_sp(int(sid), nm, ph))
        slides.append({'layout': li, 'xml': slide_xml(sl), 'notes': notes[li]})
    build_pptx(OUT / 'lesson-76-start.pptx', title='Fryderyk Chopin – plik startowy projektu (lekcja 47)', theme_xml=chopin,
               master=master, layouts=layouts, slides=slides)
    return len(slides), len(layouts)


if __name__ == '__main__':
    n75 = lesson75()
    n76, l76 = lesson76()
    manifest = {
        'version': 1,
        'target': 'Microsoft PowerPoint na komputerze (Windows), 16:9',
        'generator': 'scripts/build-powerpoint-materials.py (tylko biblioteka standardowa Pythona)',
        'fixtures': [
            {'lesson': 75, 'filename': 'lesson-75-start.pptx', 'topic': 'Praktyki zawodowe – celowo zła prezentacja', 'slides': n75, 'layouts': 8,
             'deliberateProblems': ['ręczne formatowanie w symbolach zastępczych (Comic Sans, Impact, Times New Roman, kolory)', 'ręcznie zmienione tła slajdów 1 i 6',
                                    'ściana tekstu 14 pt na slajdzie 2', 'jasnożółty tekst na białym tle i 5 animacji na slajdzie 3', 'zdjęcie ze znakiem wodnym fotobanku, rozciągnięte, bez źródła na slajdzie 4',
                                    'tabela 8×4 w 11 pt zamiast jednej myśli lub wykresu na slajdzie 5', 'czerwony tekst na zielonym tle na slajdzie 6', 'brak notatek prelegenta i slajdu ze źródłami',
                                    'efektowne przejścia (koło, szachownica, podział)'],
             'expectedOperations': ['Zapisz jako lesson-75-nazwisko.pptx', 'Resetuj slajdy i tła', 'Wzorzec slajdów: wspólna czcionka tytułów', 'Podziel slajd 2, resztę przenieś do notatek',
                                    'Usuń ozdobniki i zbędne animacje', 'Zamień zdjęcie na lesson-75-grafika.png z podpisem', 'Dodaj slajd Źródła i notatki']},
            {'lesson': 75, 'filename': 'lesson-75-grafika.png', 'topic': 'Autorska ilustracja stanowiska pracy (bez znaku wodnego) do podmiany; podpis: Ilustracja „Stanowisko pracy”, materiały lekcji Informatyka praktycznie, CC0'},
            {'lesson': 76, 'filename': 'lesson-76-start.pptx', 'topic': 'Fryderyk Chopin – starter projektu', 'slides': n76, 'layouts': l76,
             'structure': ['tytuł', 'hak', 'życie w 3 faktach', 'Warszawa i Paryż', 'muzyka (link/QR opcjonalnie)', 'ciekawostka', 'Chopin dziś (opcjonalny)', 'źródła'],
             'notes': 'każdy slajd ma notatkę prelegenta z podpowiedzią', 'prompts': 'puste symbole zastępcze z własnym tekstem podpowiedzi (hasCustomPrompt) w układach „Chopin – …”'},
        ],
    }
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'lesson-75-start.pptx: {n75} slajdów; lesson-76-start.pptx: {n76} slajdów, {l76} układów')
