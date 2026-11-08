"""Rebuild only the fictional prom committee starter (Word review lesson)."""
from pathlib import Path
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from lxml import etree
import json, zipfile

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/materials/word/lesson-32-start.docx'

def build():
    d=Document();s=d.sections[0]
    s.page_width=Cm(21);s.page_height=Cm(29.7)
    s.top_margin=s.bottom_margin=Cm(2);s.left_margin=s.right_margin=Cm(2.2)
    for name in ['Normal','Title','Heading 1']:
        st=d.styles[name];st.font.name='Calibri';st.font.color.rgb=RGBColor(0,0,0)
    for border in list(d.styles.element.iter(qn('w:pBdr'))):border.getparent().remove(border)
    d.styles['Normal'].font.size=Pt(11)
    d.styles['Normal'].paragraph_format.space_after=Pt(8)
    d.styles['Normal'].paragraph_format.line_spacing=1.1
    d.styles['Title'].font.size=Pt(25);d.styles['Heading 1'].font.size=Pt(17)
    d.core_properties.title='Studniówka 2027';d.core_properties.author='Komitet ćwiczeniowy'
    d.add_paragraph('Studniówka 2027','Title')
    d.add_paragraph('Dokument roboczy komitetu studniówkowego. Jesteś osobą odpowiedzialną za redakcję komunikatu dla uczestników. Wszystkie nazwy, kwoty i ustalenia są fikcyjne. Nie zbieramy zgłoszeń ani pieniędzy.')
    d.add_paragraph('Potwierdzone ustalenia','Heading 1')
    rows=[('Termin balu','23 stycznia 2027, godzina 19.00'),('Miejsce','Sala Ogrodowa — potwierdzona rezerwacja'),('Cena','490 zł od osoby — aktualna oferta'),('Zaliczka','150 zł od osoby'),('Termin wpłaty','Do 8 grudnia u wychowawcy'),('Transport','Niepotwierdzony; brak zamówienia i ustalonego kosztu'),('Diety','Sposób i termin zgłoszenia wymagają wyjaśnienia')]
    t=d.add_table(rows=1,cols=2);t.autofit=False
    t.columns[0].width=Cm(4.3);t.columns[1].width=Cm(12.3)
    for c,txt in zip(t.rows[0].cells,['Informacja','Potwierdzone ustalenie']):c.text=txt
    for row in rows:
        for c,txt in zip(t.add_row().cells,row):c.text=txt
    for i,row in enumerate(t.rows):
        for j,c in enumerate(row.cells):
            c.width=Cm(4.3 if j==0 else 12.3)
            borders=OxmlElement('w:tcBorders')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge)
                for k,v in [('val','single'),('sz','4'),('color','D9D9D9')]:e.set(qn('w:'+k),v)
                borders.append(e)
            pr=c._tc.get_or_add_tcPr();pr.append(borders)
            shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'DCECF0' if i==0 else 'FFFFFF');pr.append(shade)
            for p in c.paragraphs:
                p.paragraph_format.space_before=Pt(4);p.paragraph_format.space_after=Pt(4)
                for r in p.runs:r.font.size=Pt(10);r.bold=i==0
        if i==0:row._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    d.add_paragraph('Zasady komitetu','Heading 1')
    d.add_paragraph('Pracuj na własnej kopii. Nie zmieniaj tabeli źródłowej. Porównaj komunikat z ustaleniami, skomentuj wątpliwości i popraw treść ze śledzeniem. Gotowe propozycje sali i ceny zachowaj w recenzji; rozstrzygniesz je dopiero w kopii publikacyjnej.')
    d.add_paragraph('Odpowiedź na pytanie o dietę otrzymasz w etapie „Nowa wiadomość” na stronie lekcji. Zachowaj dwa pliki: 32-recenzja.docx oraz 32-publikacja.docx. Word LTSC nie wymaga konta ucznia do komentarzy ani śledzenia zmian.')
    d.add_page_break()
    d.add_paragraph('Komunikat do recenzji','Heading 1')
    d.add_paragraph('Studniówka 2027 odbedzie się 23 stycznia 2027 o godzinie 19.00. Miejsce: Sala Bursztynowa.')
    d.add_paragraph('Cena wynosi 490 zł od osoby. Zaliczka wynosi 200 zł. Wpłatę przekaż do 10 grudnia u wychowawcy.')
    d.add_paragraph('Transport autokarem jest wliczony w cenę.')
    d.add_paragraph('Zgłoś szczególną dietę.')
    d.add_paragraph('W razie pytań skontaktuj się z komitetem studniówkowym. Dziękujemy za terminowe zgłoszenia.')
    d.save(OUT)
    with zipfile.ZipFile(OUT) as z:members={n:z.read(n) for n in z.namelist()}
    root=etree.fromstring(members['word/document.xml']);ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};cid=1
    for old,new in [('Sala Bursztynowa','Sala Ogrodowa'),('490 zł','590 zł')]:
        node=[n for n in root.findall('.//w:t',ns) if old in (n.text or '')][-1]
        run=node.getparent();parent=run.getparent();idx=parent.index(run);a,b=node.text.split(old,1);parent.remove(run)
        for kind,text in [('r',a),('del',old),('ins',new),('r',b)]:
            if not text:continue
            e=etree.Element(qn('w:'+kind));rr=e
            if kind!='r':
                e.set(qn('w:id'),str(cid));cid+=1;e.set(qn('w:author'),'Komitet ćwiczeniowy');e.set(qn('w:date'),'2026-11-08T08:00:00Z');rr=etree.SubElement(e,qn('w:r'))
            tt=etree.SubElement(rr,qn('w:delText' if kind=='del' else 'w:t'));tt.set('{http://www.w3.org/XML/1998/namespace}space','preserve');tt.text=text
            parent.insert(idx,e);idx+=1
    settings=etree.fromstring(members['word/settings.xml']);settings.append(etree.Element(qn('w:trackRevisions')))
    members['word/document.xml']=etree.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True)
    members['word/settings.xml']=etree.tostring(settings,xml_declaration=True,encoding='UTF-8',standalone=True)
    with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED) as z:
        for n,b in members.items():z.writestr(n,b)
    manifest=ROOT/'public/materials/word/manifest.json'
    data=json.loads(manifest.read_text())
    entries=data if isinstance(data,list) else data['fixtures']
    for item in entries:
        if item['lesson']==32:
            item.update(topic='Studniówka 2027',expectedOperations=['Accept venue correction','Reject price increase','Track deposit, deadline and spelling corrections','Comment on missing details','Apply committee response about diets','Save review and clean publication'],truth={'date':'23 stycznia 2027','time':'19.00','venue':'Sala Ogrodowa','price':490,'deposit':150,'deadline':'8 grudnia'},trackedInsertions=2,trackedDeletions=2,initialComments=0)
    manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(OUT)

if __name__=='__main__':build()
