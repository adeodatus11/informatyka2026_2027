import test from 'node:test';
import assert from 'node:assert/strict';
import {parseHtml, select, nodeText, parseCss, cssValue, contrastRatio, resolvedColors, analyze, lint, runChecks, passMap,
  labResult, labMax, checksScore, hintFactor, buildDocument, serpPreview, screenReader, highlight, editKey, insertSnippet,
  downloadName, imageExists, previewImageSrc, IMAGES} from '../content/sims/htmlLab.js';
import l35, {HOBBY} from '../content/lessons/35-www-basics.js';
import l36, {BROKEN, CARD} from '../content/lessons/36-html-tags.js';
import l37, {CLUB, CONCERT, CONCERT_CSS, TEAM} from '../content/lessons/37-css.js';
import l38, {BIKE} from '../content/lessons/38-publishing.js';

const acts = l => l.sections.flatMap(s => s.activities);
const act = (l, id) => acts(l).find(a => a.id === id);
const check = (a, html, css = '', checks = a.checks) => runChecks(checks, analyze(html, css), a.keep);
const allOk = r => Object.values(r).every(x => x.ok);
const noneOk = r => Object.values(r).every(x => !x.ok);

test('Parser HTML: drzewo, selektory i wykrywanie niezamkniętych znaczników', () => {
  const {root, issues} = parseHtml('<ul><li>A<li>B</ul><p>Tekst <strong>ważny</p><div class="x y" id="k"><a href="#">L</a></div>');
  assert.equal(select(root, 'li').length, 2);
  assert.equal(select(root, '.y a').length, 1);
  assert.equal(select(root, '#k').length, 1);
  assert.equal(nodeText(select(root, 'p')[0]), 'Tekst ważny');
  assert.ok(issues.some(i => i.type === 'unclosed' && i.tag === 'strong' && !i.implied));
  assert.ok(issues.some(i => i.type === 'unclosed' && i.tag === 'li' && i.implied));
  assert.ok(parseHtml('<p>a</span></p>').issues.some(i => i.type === 'stray' && i.tag === 'span'));
  assert.ok(parseHtml('<img src="a.svg" alt="x>').issues.some(i => i.type === 'quote'));
});

test('Walidator: alt, ścieżka do dysku, brak pliku, pominięty nagłówek, link bez href', () => {
  const items = lint(analyze('<h1>A</h1><h3>B</h3><img src="C:\\Users\\Ola\\kot.svg"><img src="pies.jpg" alt="Pies"><a>x</a>'));
  const t = items.map(i => i.text).join('\n');
  assert.match(t, /nie ma atrybutu alt/);
  assert.match(t, /prowadzi do Twojego dysku/);
  assert.match(t, /Pliku „pies\.jpg” nie ma w folderze/);
  assert.match(t, /pominięty poziom/);
  assert.match(t, /nie ma adresu href/);
  assert.equal(lint(analyze('<!DOCTYPE html><html lang="pl"><head><title>Tytuł strony</title></head><body><h1>A</h1><h2>B</h2><img src="kot.svg" alt="Kot"></body></html>')).length, 0);
});

test('CSS: reguły, ostatnia wygrywa, literówka, brak średnika i klamry', () => {
  const {rules, issues} = parseCss('body { color: red; }\nh1, h2 { color: #123456 }\nbody { color: navy; }');
  assert.equal(cssValue(rules, 'body', 'color'), 'navy');
  assert.equal(cssValue(rules, 'h2', 'color'), '#123456');
  assert.equal(issues.length, 0);
  const bad = parseCss(CONCERT_CSS);
  const types = bad.issues.map(i => i.type);
  assert.ok(types.includes('css-semicolon') && types.includes('css-prop') && types.includes('css-brace'));
  assert.equal(bad.issues.find(i => i.type === 'css-prop').suggestion, 'color');
  assert.equal(cssValue(bad.rules, 'body', 'font-size'), null, 'brak średnika „połyka” font-size');
});

test('Kontrast liczony z arkusza (wzór WCAG) bez odczytu z podglądu', () => {
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.ok(contrastRatio('#c8c8c8', '#ffffff') < 2);
  const {rules} = parseCss('body { background: #121212 url(gory.svg); color: #f2f2f2; } p { color: #777; }');
  const c = resolvedColors(rules, 'p');
  assert.equal(c.fg.raw, '#777');
  assert.equal(c.bg.raw, '#121212');
  assert.equal(resolvedColors(parseCss('').rules, 'body').bg.dflt, true);
});

test('Podgląd jest bezpieczny: bez skryptów, zdarzeń, zasobów z sieci; obrazki z folderu jako data URI', () => {
  const html = '<html><head><link rel="icon" href="https://e.pl/f.ico"><link rel="stylesheet" href="style.css"><meta http-equiv="refresh" content="0;url=https://e.pl"></head>' +
    '<body onload="alert(1)"><script>alert(1)</script><iframe src="https://e.pl"></iframe><a href="https://e.pl" onclick="x()">L</a><a href="#s">K</a>' +
    '<a href="javascript:alert(1)">J</a><img src="kot.svg" alt="Kot"><img src="https://e.pl/a.png" alt="x"><img src="C:\\x\\pies.jpg"><video src="https://e.pl/v.mp4"></video>' +
    '<div style="background:url(https://e.pl/b.png)"></div></body></html>';
  const {doc, removed} = buildDocument(html, 'body{background:url(gory.svg)} @import url(https://e.pl/x.css);');
  assert.match(doc, /Content-Security-Policy/);
  assert.doesNotMatch(doc, /<script|<iframe|onload|onclick|javascript:|https?:\/\/e\.pl\/(a\.png|v\.mp4|b\.png|f\.ico|x\.css)|http-equiv="refresh"/i);
  assert.match(doc, /href="#" data-href="https:\/\/e\.pl"/);
  assert.match(doc, /href="#s"/);
  assert.match(doc, /url\("data:image\/svg\+xml/);
  assert.ok(removed.scripts >= 3);
  assert.equal((doc.match(/src="data:image\/svg\+xml/g) || []).length, 3, 'kot.svg + 2 zastępcze obrazki');
  // plik do pobrania: prawdziwe linki, wbudowane obrazki i arkusz, nadal bez skryptów
  const dl = buildDocument(html, 'h1{color:red}', {download: true}).doc;
  assert.match(dl, /href="https:\/\/e\.pl"/);
  assert.match(dl, /<style>\nh1\{color:red\}/);
  assert.doesNotMatch(dl, /<script|onload/);
  assert.ok(previewImageSrc('nie-ma.png').startsWith('data:image/svg+xml'));
  assert.ok(imageExists('./rower.svg') && !imageExists('Rower.svg'));
  for (const k of Object.keys(IMAGES)) assert.match(IMAGES[k].svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
});

test('Podgląd wyniku wyszukiwania: długości, ucięcie i braki', () => {
  const s = serpPreview(parseHtml(BIKE).root, 'https://www.szprycha-rowery.pl/');
  assert.equal(s.titleStatus, 'short');
  assert.equal(s.descStatus, 'missing');
  assert.equal(s.descFromPage, true);
  const long = serpPreview(parseHtml(`<title>${'Serwis rowerowy '.repeat(6)}</title><meta name="description" content="${'Naprawa rowerów w Kaliszu. '.repeat(8)}">`).root);
  assert.equal(long.titleCut, true);
  assert.equal(long.descCut, true);
  assert.ok(long.titleShown.length <= 62 && long.titleShown.endsWith('…'));
});

test('Czytnik ekranu ogłasza obrazki bez alt i tabele bez <th>', () => {
  const said = screenReader(parseHtml(BROKEN).root);
  assert.ok(said.some(x => x.kind === 'bad' && /obraz bez opisu/i.test(x.text)));
  assert.ok(said.some(x => x.kind === 'bad' && /bez nagłówków/.test(x.text)));
  assert.ok(said.some(x => x.kind === 'heading' && /poziomu 3: Nasze pizze/.test(x.text)));
});

test('Edytor: wcięcia, kolorowanie składni, wstawki i nazwa pliku', () => {
  const ed = editKey('<ul>', 4, 4, 'Enter', false);
  assert.equal(ed.insert, '\n  ');
  assert.equal(editKey('a', 0, 0, 'Tab', false).insert, '  ');
  assert.equal(editKey('x', 0, 0, 'a', false), null);
  const lines = highlight('<p class="a">x</p>\n<!-- k -->');
  assert.equal(lines.length, 2);
  assert.ok(lines[0].some(t => t.t === 'attr' && t.v === 'class'));
  assert.ok(highlight('h1 { color: red; }', 'css')[0].some(t => t.t === 'prop' && t.v === 'color'));
  assert.equal(insertSnippet('  x', 2, '<ul>\n<li></li>').value, '  <ul>\n  <li></li>x');
  assert.equal(downloadName('Żółta łódź — Kraków!'), 'zolta-lodz-krakow.html');
});

test('Punkty: pełne bez podpowiedzi, mniej po podpowiedziach (min. połowa), done od minDone', () => {
  const checks = [{id: 'a'}, {id: 'b'}, {id: 'c'}, {id: 'd'}];
  assert.deepEqual(checksScore(checks, {a: true, b: true, c: true, d: true}), {score: 4, passed: 4, total: 4});
  assert.equal(checksScore(checks, {a: true, b: true, c: true, d: true}, {a: 1, b: 5}).score, 3.5);
  assert.equal(hintFactor(10), 0.5);
  const data = {mode: 'tasks', points: 4, minDone: 3, checks, product: 'Wizytówka'};
  const r = labResult(data, {res: {a: true, b: true, c: true, d: false}, h1: 'Ola'});
  assert.equal(r.done, true); assert.equal(r.score, 3); assert.equal(r.max, 4);
  assert.equal(r.summary, 'Wizytówka: 3/4 kryteriów — „Ola”');
  assert.equal(labResult(data, {}).done, false);
  assert.equal(labResult({...data, mode: 'fix', product: 'Pizzeria'}, {res: {a: true}}).summary, 'Pizzeria: naprawione błędy 1/4');
  assert.equal(labMax({mode: 'free', points: 1}), 1);
  const theme = {mode: 'theme', points: 5, minDone: 3, product: 'Strona', themes: [{id: 'x', name: 'Dark', checks: checks.slice(0, 2)}, {id: 'y', name: 'Retro', checks}]};
  const t = labResult(theme, {themes: {x: {res: {a: true}}, y: {res: {a: true, b: true, c: true}, ratio: 7.3}}});
  assert.equal(t.bestTheme, 'y'); assert.equal(t.done, true); assert.equal(t.score, 4);
  assert.match(t.summary, /motyw „Retro” — 3\/4 kryteriów, kontrast 7,3:1/);
});

test('Lekcje 35–38: metadane, punkty aktywności zgodne z labMax, karty wyniku i źródła „show”', () => {
  for (const [l, id, order] of [[l35, '35', 18], [l36, '36', 19], [l37, '37', 20], [l38, '38', 21]]) {
    assert.equal(l.id, id); assert.equal(l.grade, 1); assert.equal(l.order, order); assert.equal(l.duration, 45);
    assert.equal(l.sections.reduce((s, x) => s + x.duration, 0), 45);
    for (const a of acts(l).filter(a => a.type === 'htmlLab')) {
      if (a.mode === 'show') { assert.ok(acts(l).some(x => x.id === a.from || x.stateKey === a.from), a.id); continue; }
      assert.equal(a.points, labMax(a), `${a.id}: points = max`);
      const ids = (a.themes ? a.themes.flatMap(t => t.checks) : a.checks || []).map(c => c.id);
      assert.ok(a.mode === 'free' || ids.length > 0);
      for (const c of a.themes ? a.themes.flatMap(t => t.checks) : a.checks || []) assert.ok(c.label && [].concat(c.hint || []).length, `${a.id}.${c.id}: etykieta i podpowiedź`);
    }
  }
  assert.deepEqual(l35.title, 'Tworzenie stron WWW – podstawowe informacje');
  assert.deepEqual(l36.title, 'Stosowanie wybranych znaczników języka HTML');
  assert.deepEqual(l37.title, 'Kaskadowe arkusze stylów CSS');
  assert.deepEqual(l38.title, 'Publikowanie i promowanie stron WWW w Internecie');
});

test('Szablony startowe nie spełniają żadnego kryterium (brak darmowych punktów)', () => {
  for (const l of [l35, l36, l37, l38]) for (const a of acts(l).filter(a => a.type === 'htmlLab' && a.mode !== 'show' && a.mode !== 'free')) {
    for (const t of a.themes || [{checks: a.checks, css: a.css}]) assert.ok(noneOk(check(a, a.html, t.css ?? a.css ?? '', t.checks)), `${a.id}`);
  }
});

/* Rozwiązania wzorcowe (te same wykorzystuje skrypt przeglądarkowy) */
export const SOLUTIONS = {
  'w35-headings': {html: `<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <meta charset="utf-8">\n  <title>Pierwszy dzień na praktykach – poradnik</title>\n</head>\n<body>\n  <h1>Pierwszy dzień na praktykach</h1>\n  <p>Krótki poradnik dla uczniów pierwszej klasy.</p>\n  <h2>Zanim wyjdziesz z domu</h2>\n  <p>Sprawdź godzinę i adres. Weź legitymację.</p>\n  <h2>Pierwsza godzina w firmie</h2>\n  <p>Przedstaw się opiekunowi praktyk.</p>\n  <h2>Gdy czegoś nie wiesz</h2>\n  <p>Pytaj. Lepiej zapytać dwa razy niż zepsuć raz.</p>\n</body>\n</html>\n`},
  'w35-hobby': {html: HOBBY.replace('<title>Moja strona</title>', '<title>Rower górski – moje trasy</title>').replace('Tu wpisz temat strony', 'Rower górski').replace('<img src="kot.svg" alt="">', '<img src="rower.svg" alt="Czerwony rower górski">')
    .replace('Napisz tu 2–3 zdania: o czym jest strona i dlaczego to lubisz.', 'Jeżdżę po lasach koło miasta od trzech lat. Najbardziej lubię zjazdy po deszczu.')
    .replace('Tytuł sekcji', 'Moje ulubione trasy').replace('<li>Pierwszy punkt</li>\n    <li>Drugi punkt</li>', '<li>Leśna pętla</li>\n    <li>Zjazd przy wieży</li>\n    <li>Szlak nad rzeką</li>')},
  'w36-fix': {html: BROKEN.replace('we wtorki.</p>', 'we wtorki.</strong></p>').replace('<img src="C:\\Users\\Kuba\\Pulpit\\pizza.svg">', '<img src="pizza.svg" alt="Pizza margherita z bazylią">')
    .replace('<h3>Nasze pizze</h3>', '<h2>Nasze pizze</h2>').replace('<a>Zamów', '<a href="zamowienia.html">Zamów').replace('<tr><td>Dzień</td><td>Godziny</td></tr>', '<tr><th>Dzień</th><th>Godziny</th></tr>')},
  'w36-dict': {html: `<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <meta charset="utf-8">\n  <title>Grafik treningów</title>\n</head>\n<body>\n  <h2>Grafik treningów</h2>\n  <table>\n    <tr><th>Dzień</th><th>Godzina</th><th>Miejsce</th></tr>\n    <tr><td>Wtorek</td><td>16:00</td><td>Hala sportowa</td></tr>\n    <tr><td>Czwartek</td><td>17:30</td><td>Boisko</td></tr>\n  </table>\n  <p><a href="regulamin.html">Regulamin klubu</a></p>\n</body>\n</html>\n`},
  'w36-card': {html: CARD.replace('<title>Wizytówka</title>', '<title>Ola – grafik i plakaty</title>').replace('\n\n</body>', `\n  <h1>Ola – grafik</h1>\n  <img src="avatar.svg" alt="Sylwetka zamiast zdjęcia">\n  <h2>O mnie</h2>\n  <p>Robię plakaty na szkolne wydarzenia.</p>\n  <h2>Umiem</h2>\n  <ul>\n    <li>plakaty</li>\n    <li>logo</li>\n    <li>zdjęcia</li>\n  </ul>\n  <h2>Kiedy mam czas</h2>\n  <table>\n    <tr><th>Dzień</th><th>Godziny</th></tr>\n    <tr><td>Wtorek</td><td>16–18</td></tr>\n    <tr><td>Sobota</td><td>10–14</td></tr>\n  </table>\n  <p><a href="mailto:ola@example.com">Napisz do mnie</a></p>\n</body>`)},
  'w37-rules': {html: CLUB.replace('</title>', '</title>\n  <link rel="stylesheet" href="style.css">'), css: 'h2 {\n  color: #7a2299;\n}\nbody {\n  background-color: #fdf6e3;\n}\nh1 {\n  color: #1f4fa3;\n}\np {\n  font-size: 18px;\n}\n'},
  'w37-fixcss': {html: CONCERT, css: 'body {\n  background-color: #fffbe6;\n  font-size: 18px;\n}\n\nh1 {\n  color: #1f4fa3;\n}\n\np {\n  color: #333333;\n}\n\nfooter {\n  color: #555555;\n}\n\n.bilet {\n  border: 3px dashed #d64545;\n  padding: 8px;\n}\n'},
  'w37-theme': {theme: 'gaming', css: 'body {\n  background-color: #0b0f1a;\n  color: #f2f2f2;\n  font-family: Arial, sans-serif;\n}\nh1 {\n  color: #39ff14;\n  text-transform: uppercase;\n}\nnav ul {\n  display: flex;\n  gap: 16px;\n}\na {\n  color: #4fc3f7;\n}\n.przycisk {\n  border-radius: 12px;\n  padding: 8px 16px;\n  background-color: #ff2bd6;\n  color: #0b0f1a;\n}\n'},
  'w38-serp': {html: BIKE.replace('<html>', '<html lang="pl">').replace('<title>Strona główna</title>', '<title>Serwis rowerowy Szprycha Kalisz – naprawa w 24 h</title>\n  <meta name="description" content="Naprawa rowerów miejskich, górskich i elektrycznych w Kaliszu. Przegląd w 24 h. Pon.–Pt. 9–17.">').replace('<h1>Witamy!</h1>', '<h1>Serwis rowerowy Szprycha</h1>')}
};
SOLUTIONS['w38-ready'] = {html: SOLUTIONS['w38-serp'].html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">')
  .replace('<img src="C:\\Users\\Kuba\\Pulpit\\rower.svg">', '<img src="rower.svg" alt="Rower górski w serwisie">').replace('Marek Nowak, ul. Lipowa 12, Kalisz', 'Marek z Kalisza')
  .replace('  <!-- hasło do panelu sklepu: szprycha123 -->\n', '').replace('<footer>Stopka</footer>', '<footer>© 2026 Serwis rowerowy Szprycha. Wszelkie prawa zastrzeżone.</footer>')};

test('Rozwiązania wzorcowe spełniają wszystkie kryteria, a usunięcie treści w trybie naprawy nic nie daje', () => {
  for (const l of [l35, l36, l37, l38]) for (const a of acts(l).filter(a => a.type === 'htmlLab' && a.mode !== 'show' && a.mode !== 'free')) {
    const s = SOLUTIONS[a.id];
    assert.ok(s, `brak rozwiązania ${a.id}`);
    const checks = a.themes ? a.themes.find(t => t.id === s.theme).checks : a.checks;
    const r = check(a, s.html ?? a.html, s.css ?? a.css ?? '', checks);
    assert.ok(allOk(r), `${a.id}: ${JSON.stringify(r)}`);
    const lab = labResult(a, a.themes ? {themes: {[s.theme]: {res: passMap(r)}}} : {res: passMap(r)});
    assert.equal(lab.score, a.points); assert.equal(lab.done, true);
  }
  const fix = act(l36, 'w36-fix');
  const gutted = check(fix, '<h1>Pizzeria</h1><p>x</p>');
  assert.ok(noneOk(gutted));
  assert.match(gutted.bold.info, /nie usuwaj treści/);
  // trzy motywy mają osobne kryteria; ciemne tło bez jasnego tekstu nie przechodzi kontrastu
  const theme = act(l37, 'w37-theme');
  const dark = theme.themes.find(t => t.id === 'dark');
  const r = check(theme, TEAM, 'body { background-color: #121212; }', dark.checks);
  assert.equal(r.bg.ok, true); assert.equal(r.contrast.ok, false);
  // arkusz niepodłączony: reguła istnieje, ale komunikat mówi o <link>
  assert.match(check(act(l37, 'w37-rules'), CLUB, 'body { background-color: #eee; }').bg.info, /nie jest podłączony/);
});
