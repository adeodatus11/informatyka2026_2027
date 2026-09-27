// Logika symulatora „pythonLab” (lekcje 17, 19, 20, 21 — programowanie w Pythonie).
// Czysty JS: działa w przeglądarce (komponent i Web Worker) oraz w Node (testy).
// Kod Pythona uruchamia Pyodide w Web Workerze (components/sims/python/worker.js),
// który wykonuje poniższy RUNNER_PY i woła _pl_run(json) → json.

export const USER_FILE = 'twoj_kod.py';
export const DEFAULT_TIMEOUT_MS = 3000;
export const MAX_TRACE_STEPS = 400;

/* ───────────── Program w Pythonie uruchamiany w Pyodide ───────────── */
// Uwaga: bez znaków ` i ${ — to zwykły szablon JS.
export const RUNNER_PY = String.raw`
import sys, json, builtins, traceback, math, ast, time

_PL_FILE = 'twoj_kod.py'

class _PLStop(BaseException):
    def __init__(self, kind):
        BaseException.__init__(self, kind)
        self.kind = kind

class _PLOut:
    def __init__(self, limit=20000):
        self.parts = []
        self.size = 0
        self.limit = limit
    def write(self, s):
        s = str(s)
        self.parts.append(s)
        self.size += len(s)
        if self.size > self.limit:
            raise _PLStop('output')
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False
    def getvalue(self):
        return ''.join(self.parts)

def _pl_repr(v, limit=80):
    try:
        r = repr(v)
    except BaseException:
        r = '<?>'
    if len(r) > limit:
        r = r[:limit - 1] + '…'
    return r

def _pl_small(x):
    return isinstance(x, (int, float, str)) and not isinstance(x, bool) and len(repr(x)) <= 10

def _pl_vars(d):
    res = {}
    for k, v in list(d.items()):
        if k.startswith('_') or k == 'input':
            continue
        if callable(v) or type(v).__name__ == 'module':
            continue
        item = {'r': _pl_repr(v), 't': type(v).__name__}
        if isinstance(v, (list, tuple)) and 0 < len(v) <= 16 and all(_pl_small(x) for x in v):
            item['items'] = [_pl_repr(x, 10) for x in v]
        res[k] = item
    return res

def _pl_error(e):
    info = {'type': type(e).__name__}
    if isinstance(e, SyntaxError):
        info['message'] = e.msg or ''
        info['line'] = e.lineno if e.filename == _PL_FILE else None
        info['col'] = e.offset
        info['frames'] = []
        return info
    info['message'] = str(e)
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == _PL_FILE]
    info['line'] = frames[-1].lineno if frames else None
    info['frames'] = [{'line': f.lineno, 'fn': f.name} for f in frames[-4:]]
    info['depth'] = len(frames)
    return info

class _PLTracer:
    def __init__(self, out, max_steps):
        self.steps = []
        self.out = out
        self.max = max_steps
    def snap(self, frame, event, ret=None):
        if len(self.steps) >= self.max:
            raise _PLStop('steps')
        fn = frame.f_code.co_name
        depth = 0
        f = frame
        while f is not None:
            if f.f_code.co_filename == _PL_FILE:
                depth += 1
            f = f.f_back
        st = {'line': frame.f_lineno, 'fn': fn, 'ev': event, 'out': self.out.size, 'depth': depth,
              'g': _pl_vars(frame.f_globals)}
        if fn != '<module>':
            st['l'] = _pl_vars(frame.f_locals)
        if event == 'return':
            st['ret'] = _pl_repr(ret)
        self.steps.append(st)
    def __call__(self, frame, event, arg):
        if frame.f_code.co_filename != _PL_FILE:
            return None
        if event == 'line':
            self.snap(frame, 'line')
        elif event == 'return' and frame.f_code.co_name != '<module>':
            self.snap(frame, 'return', arg)
        return self

def _pl_exec(code, stdin, out, tracer=None):
    lines = [str(x) for x in (stdin or [])]
    def _input(prompt=''):
        out.write(str(prompt))
        if not lines:
            raise _PLStop('input')
        v = lines.pop(0)
        out.write(v + '\n')
        return v
    g = {'__name__': '__main__', '__builtins__': builtins, 'input': _input}
    old = (sys.stdout, sys.stderr)
    err = None
    stop = None
    sys.stdout = out
    sys.stderr = out
    try:
        obj = compile(code, _PL_FILE, 'exec')
        if tracer is not None:
            sys.settrace(tracer)
        try:
            exec(obj, g)
        finally:
            sys.settrace(None)
    except _PLStop as s:
        stop = s.kind
    except SystemExit:
        pass
    except BaseException as e:
        err = _pl_error(e)
    finally:
        sys.stdout, sys.stderr = old
    return g, err, stop

def _pl_equal(a, b, tol):
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) == type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if isinstance(a, float) or isinstance(b, float):
            return math.isclose(a, b, rel_tol=0, abs_tol=tol)
        return a == b
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(_pl_equal(x, y, tol) for x, y in zip(a, b))
    return a == b

def _pl_norm_out(s):
    return '\n'.join(l.rstrip() for l in s.strip('\n').split('\n')).strip()

def _pl_tests(code, g, tests):
    results = []
    for t in tests:
        r = {'label': t.get('label')}
        if 'call' in t:
            r['call'] = t['call']
            exp = ast.literal_eval(t['expected'])
            r['expected'] = _pl_repr(exp, 160)
            out = _PLOut(5000)
            old = sys.stdout
            sys.stdout = out
            try:
                got = eval(t['call'], g)
                r['got'] = _pl_repr(got, 160)
                r['ok'] = _pl_equal(got, exp, t.get('tol', 1e-9))
            except _PLStop as s:
                r['ok'] = False
                r['stop'] = s.kind
            except BaseException as e:
                r['ok'] = False
                r['error'] = _pl_error(e)
            finally:
                sys.stdout = old
        else:
            stdin = t.get('stdin') or []
            r['stdin'] = stdin
            out = _PLOut(20000)
            g2, err, stop = _pl_exec(code, stdin, out)
            text = out.getvalue()
            r['got'] = text[-600:]
            if err:
                r['ok'] = False
                r['error'] = err
            elif stop:
                r['ok'] = False
                r['stop'] = stop
            elif 'output' in t:
                r['expected'] = t['output']
                r['ok'] = _pl_norm_out(text) == _pl_norm_out(t['output'])
            else:
                need = t.get('contains') or []
                if isinstance(need, str):
                    need = [need]
                r['expected'] = ' … '.join(need)
                r['ok'] = all(n in text for n in need)
        results.append(r)
    return results

def _pl_run(req_json):
    req = json.loads(req_json)
    t0 = time.time()
    code = req.get('code', '')
    out = _PLOut(req.get('outLimit', 20000))
    tracer = _PLTracer(out, req.get('maxSteps', 400)) if req.get('trace') else None
    g, err, stop = _pl_exec(code, req.get('stdin') or [], out, tracer)
    res = {'stdout': out.getvalue(), 'error': err, 'stop': stop}
    if tracer is not None:
        tracer.steps.append({'line': None, 'fn': '<module>', 'ev': 'end', 'out': out.size, 'depth': 0, 'g': _pl_vars(g)})
        res['steps'] = tracer.steps
    tests = req.get('tests')
    if tests and err is None and stop in (None, 'input'):
        res['tests'] = _pl_tests(code, g, tests)
    res['ms'] = int((time.time() - t0) * 1000)
    return json.dumps(res, ensure_ascii=False)
`;

/* ───────────── Porównywanie wyjścia (tryb „przewidź”) ───────────── */
/** Normalizuje linię: przycina, zwija spacje, ignoruje spacje przy przecinkach i nawiasach. */
export function normLine(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim().replace(/\s*([,()[\]{}:])\s*/g, '$1');
}
export function outputLines(s) {
  const lines = String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, ''));
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  while (lines.length && !lines[0].trim()) lines.shift();
  return lines;
}
/** Porównuje przewidywanie z faktycznym wyjściem linia po linii. */
export function compareOutput(predicted, actual) {
  const p = outputLines(predicted), a = outputLines(actual);
  const n = Math.max(p.length, a.length);
  const lines = Array.from({length: n}, (_, i) => ({mine: p[i] ?? '', real: a[i] ?? '', ok: i < p.length && i < a.length && normLine(p[i]) === normLine(a[i])}));
  return {ok: lines.every(l => l.ok), matched: lines.filter(l => l.ok).length, total: a.length, lines};
}

/* ───────────── Tłumaczenie błędów na polski ───────────── */
const kw = {for: 'for', if: 'if', while: 'while', else: 'else', elif: 'elif', 'function definition': 'def', def: 'def', try: 'try', with: 'with', class: 'class', except: 'except'};
const q = s => `„${s}”`;
const rules = [
  // Wcięcia
  [/IndentationError/, /expected an indented block after (?:'(\w+)' statement|(function definition)) on line (\d+)/, m => ({
    title: 'Brakuje wcięcia',
    hint: `Linia ${m[3]} (${kw[m[1] || m[2]] || m[1] || 'def'} … :) kończy się dwukropkiem, więc pod nią musi być blok przesunięty o 4 spacje. Kliknij na początku linii pod spodem i naciśnij Tab.`})],
  [/IndentationError/, /unexpected indent/, () => ({title: 'Niepotrzebne wcięcie', hint: 'Ta linia jest przesunięta w prawo, a nic tego nie wymaga. Wyrównaj ją do linii powyżej (Shift+Tab usuwa wcięcie).'})],
  [/IndentationError/, /unindent does not match/, () => ({title: 'Wcięcia się nie zgadzają', hint: 'Ta linia ma inną liczbę spacji niż linie nad nią. Wcięcia robimy zawsze po 4 spacje: 4, 8, 12… Wyrównaj ją do bloku, do którego należy.'})],
  [/TabError/, /./, () => ({title: 'Tabulatory i spacje razem', hint: 'W tej linii wcięcie jest zrobione tabulatorem, a w innych spacjami. Usuń wcięcie i wstaw je ponownie klawiszem Tab w edytorze (wstawia 4 spacje).'})],
  [/IndentationError/, /expected an indented block/, () => ({title: 'Brakuje wcięcia', hint: 'Po linii zakończonej dwukropkiem kolejne linie muszą być przesunięte o 4 spacje (Tab).'})],
  // Składnia
  [/SyntaxError/, /expected ':'/, () => ({title: 'Brakuje dwukropka', hint: 'Na końcu tej linii brakuje znaku „:”. Linie z for, if, else, while i def zawsze kończą się dwukropkiem.'})],
  [/SyntaxError/, /Missing parentheses in call to 'print'/, () => ({title: 'print potrzebuje nawiasów', hint: 'W Pythonie 3 print to funkcja: print("Cześć") — tekst w nawiasie.'})],
  [/SyntaxError/, /Maybe you meant '==' or ':=' instead of '='/, () => ({title: 'Pojedyncze = w warunku', hint: 'W warunku porównujesz dwoma znakami ==, np. if x == 3:. Pojedyncze = oznacza „wpisz wartość do zmiennej”.'})],
  [/SyntaxError/, /'(.)' was never closed/, m => ({title: 'Niezamknięty nawias', hint: `Nawias ${q(m[1])} otwarto, ale nie zamknięto. Policz nawiasy otwierające i zamykające w tej linii.`})],
  [/SyntaxError/, /unmatched '(.)'/, m => ({title: 'Nawias bez pary', hint: `Nawias ${q(m[1])} nie ma pary — jest o jeden zamykający za dużo albo brakuje otwierającego.`})],
  [/SyntaxError/, /closing parenthesis '(.)' does not match opening parenthesis '(.)'/, m => ({title: 'Pomieszane nawiasy', hint: `Otwierasz ${q(m[2])}, a zamykasz ${q(m[1])}. Nawiasy muszą być tego samego rodzaju: ( ), [ ], { }.`})],
  [/SyntaxError/, /unterminated (?:triple-quoted )?string literal/, () => ({title: 'Tekst bez cudzysłowu na końcu', hint: 'Napis zaczyna się cudzysłowem, ale się nim nie kończy. Dopisz " (lub \') na końcu tekstu.'})],
  [/SyntaxError/, /invalid character '(.)'/, m => ({title: 'Nietypowy znak w kodzie', hint: `Znak ${q(m[1])} nie jest dozwolony w kodzie (często to „ ” skopiowane z Worda albo polska litera w nazwie). Wpisz go ponownie z klawiatury: " zamiast „ ”.`})],
  [/SyntaxError/, /Perhaps you forgot a comma/, () => ({title: 'Brakuje przecinka', hint: 'Między elementami (w liście, w print albo w argumentach funkcji) potrzebny jest przecinek.'})],
  [/SyntaxError/, /'return' outside function/, () => ({title: 'return poza funkcją', hint: 'return może stać tylko w środku funkcji — w bloku pod def, z wcięciem.'})],
  [/SyntaxError/, /'break' outside loop|'continue' not properly in loop/, () => ({title: 'break/continue poza pętlą', hint: 'Te polecenia działają tylko wewnątrz pętli for lub while (z wcięciem).'})],
  [/SyntaxError/, /cannot assign to|cannot be assigned|Maybe you meant '=='/, () => ({title: 'Nie można tu przypisać', hint: 'Po lewej stronie znaku = musi stać nazwa zmiennej (np. wynik = 5). Jeśli chcesz porównać, użyj ==.'})],
  [/SyntaxError/, /invalid decimal literal/, () => ({title: 'Liczba sklejona z literami', hint: 'Nazwa zmiennej nie może zaczynać się od cyfry, a liczba nie może mieć liter. W liczbach dziesiętnych używaj kropki: 5.5, nie 5,5.'})],
  [/SyntaxError/, /expected 'in'/, () => ({title: 'Brakuje słowa in', hint: 'Pętla for ma postać: for element in kolekcja:'})],
  [/SyntaxError/, /./, () => ({title: 'Python nie rozumie tej linii', hint: 'Sprawdź po kolei: dwukropek na końcu, pary nawiasów, cudzysłowy na początku i końcu tekstu, == w warunkach.'})],
  // Błędy w czasie działania
  [/UnboundLocalError/, /local variable '(\w+)'/, m => ({title: 'Zmienna bez wartości', hint: `Zmienna ${q(m[1])} jest używana w funkcji, zanim cokolwiek do niej wpisano. Nadaj jej wartość początkową na początku funkcji.`})],
  [/NameError/, /name '(\w+)' is not defined(?:\. Did you mean: '(\w+)'\?)?/, m => ({title: `Python nie zna nazwy ${q(m[1])}`, hint: m[2] ? `Literówka? Może chodziło o ${q(m[2])}. Wielkość liter ma znaczenie.` : `Zmienną trzeba najpierw utworzyć (${m[1]} = …), a funkcję zdefiniować przez def. Sprawdź literówki i wielkość liter. Jeśli to miał być tekst, weź go w cudzysłów: "${m[1]}".`})],
  [/TypeError/, /can only concatenate str \(not "(\w+)"\) to str/, m => ({title: 'Tekst + liczba', hint: `Nie da się dodać tekstu i ${m[1] === 'int' ? 'liczby' : m[1]}. Zamień liczbę na tekst: str(liczba), albo w print użyj przecinka: print("Wynik:", x).`})],
  [/TypeError/, /unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/, m => ({title: 'Działanie na złych typach', hint: (m[2] === 'str' || m[3] === 'str') ? `Działanie ${q(m[1].trim())} łączy tekst (str) z liczbą. Tekst z input() zamień na liczbę: int(tekst) albo float(tekst).` : `Działania ${q(m[1].trim())} nie da się wykonać na typach ${m[2]} i ${m[3]}. ${m[2] === 'NoneType' || m[3] === 'NoneType' ? 'None często oznacza, że funkcji brakuje return.' : ''}`.trim()})],
  [/TypeError/, /missing (\d+) required positional argument/, m => ({title: 'Za mało argumentów', hint: `Funkcji brakuje ${m[1]} argumentu (wartości w nawiasie). Porównaj wywołanie z linią def — ile nazw jest w nawiasie?`})],
  [/TypeError/, /takes (\d+) positional arguments? but (\d+) (?:was|were) given/, m => ({title: 'Za dużo argumentów', hint: `Funkcja przyjmuje ${m[1]}, a dostała ${m[2]}. Porównaj wywołanie z linią def.`})],
  [/TypeError/, /'(\w+)' object cannot be interpreted as an integer/, m => ({title: 'Potrzebna liczba całkowita', hint: `range() i indeksy wymagają liczby całkowitej (int), a dostały ${m[1]}. ${m[1] === 'str' ? 'Zamień tekst: int(tekst).' : 'Dzielenie / daje float — użyj //.'}`})],
  [/TypeError/, /(?:list|string|tuple) indices must be integers/, () => ({title: 'Indeks musi być liczbą całkowitą', hint: 'W nawiasie [ ] podajesz numer elementu: 0, 1, 2… Dzielenie / daje ułamek — użyj //.'})],
  [/TypeError/, /ord\(\) expected a character, but string of length (\d+) found/, m => ({title: 'ord() dostało za dużo znaków', hint: `ord() zamienia na liczbę jeden znak, a dostało napis o długości ${m[1]}. Wywołuj ord() dla jednej litery, np. w pętli for litera in tekst.`})],
  [/TypeError/, /'str' object does not support item assignment/, () => ({title: 'Napisu nie zmienisz literka po literce', hint: 'Napis (str) jest niezmienny. Zbuduj nowy: wynik = wynik + nowa_litera.'})],
  [/TypeError/, /'NoneType' object is not (?:subscriptable|iterable)/, () => ({title: 'Wartość None', hint: 'Coś ma wartość None — najczęściej funkcja nie ma return i nic nie zwraca.'})],
  [/TypeError/, /'(\w+)' object is not callable/, m => ({title: 'To nie jest funkcja', hint: `Nawiasy ( ) stoją za czymś typu ${m[1]}, a nie za funkcją. Może nazwa zmiennej zasłoniła funkcję (np. zmienna o nazwie print lub len)?`})],
  [/TypeError/, /'(\w+)' object is not subscriptable/, m => ({title: 'Nawias [ ] przy złym typie', hint: `Indeks [ ] działa dla list i napisów, a tu jest ${m[1]}.`})],
  [/TypeError/, /can't multiply sequence by non-int/, () => ({title: 'Mnożenie tekstu', hint: 'Mnożysz tekst lub listę przez coś, co nie jest liczbą całkowitą. Jeśli to liczba z input(), zamień ją: float(tekst).'})],
  [/TypeError/, /'(<|>|<=|>=)' not supported between instances of '(\w+)' and '(\w+)'/, m => ({title: 'Porównanie różnych typów', hint: `Nie da się porównać ${m[2]} z ${m[3]}. Tekst z input() zamień na liczbę: int(tekst).`})],
  [/IndexError/, /(list|string|tuple) index out of range/, m => ({title: 'Indeks poza zakresem', hint: `Sięgasz po element ${m[1] === 'string' ? 'napisu' : 'listy'}, którego nie ma. Indeksy idą od 0 do len(…) - 1. Jeśli w pętli używasz [j + 1], pętla musi kończyć się wcześniej, np. range(n - 1).`})],
  [/ZeroDivisionError/, /./, () => ({title: 'Dzielenie przez zero', hint: 'Program dzieli przez 0. Sprawdź, czy dzielnik nie jest zerem, zanim podzielisz (if x != 0:).'})],
  [/ValueError/, /invalid literal for int\(\) with base 10: (.*)/, m => ({title: 'To nie jest liczba całkowita', hint: `int() dostało ${m[1]}, a to nie jest liczba całkowita. Sprawdź pole „Dane wejściowe” — każda linia to jedna wartość, bez spacji i liter. Liczby z przecinkiem wczytuj przez float() i pisz z kropką.`})],
  [/ValueError/, /could not convert string to float: (.*)/, m => ({title: 'To nie jest liczba', hint: `float() dostało ${m[1]}. Użyj kropki zamiast przecinka (12.5) i sprawdź pole „Dane wejściowe”.`})],
  [/ValueError/, /chr\(\) arg not in range/, () => ({title: 'chr() poza zakresem', hint: 'chr() przyjmuje numer znaku (np. 65 → "A"). Sprawdź obliczenia — czy nie zapomniałeś dodać ord("A") lub użyć % 26?'})],
  [/OverflowError/, /./, () => ({title: 'Za duża liczba', hint: 'Wynik jest za duży dla liczby zmiennoprzecinkowej. Sprawdź, czy pętla nie liczy za długo.'})],
  [/RecursionError/, /./, () => ({title: 'Funkcja wywołuje samą siebie bez końca', hint: 'Brakuje warunku zakończenia (np. if n < 2: return n) albo argument nie maleje przy kolejnym wywołaniu.'})],
  [/KeyError/, /(.*)/, m => ({title: 'Brak klucza w słowniku', hint: `W słowniku nie ma klucza ${m[1]}. Sprawdź pisownię albo użyj slownik.get(klucz, domyślna).`})],
  [/AttributeError/, /'(\w+)' object has no attribute '(\w+)'/, m => ({title: 'Nieznana metoda', hint: `Typ ${m[1]} nie ma ${q(m[2])}. Literówka? ${m[1] === 'NoneType' ? 'None często oznacza brak return w funkcji.' : ''}`.trim()})],
];

/** Zamienia błąd z Pythona na polski tytuł i wskazówkę. err = {type, message, line}. */
export function explainError(err, code = '') {
  if (!err) return null;
  const type = err.type || 'Error', message = err.message || '';
  let res = null;
  for (const [t, re, fn] of rules) {
    if (!t.test(type)) continue;
    const m = message.match(re);
    if (m) { res = fn(m); break; }
  }
  if (!res) res = {title: 'Błąd w programie', hint: 'Przeczytaj komunikat i sprawdź wskazaną linię. Porównaj ją z przykładem powyżej.'};
  const lines = String(code).split('\n');
  const line = Number.isInteger(err.line) ? err.line : null;
  return {...res, type, message, line, lineText: line ? (lines[line - 1] ?? '').trim() : '',
    short: `${line ? `Linia ${line}: ` : ''}${type}: ${message}`};
}

export const STOP_MESSAGES = {
  timeout: {title: 'Program działa za długo — może pętla się nie kończy?', hint: 'Zatrzymałem go po kilku sekundach. Sprawdź warunek pętli while: czy zmienna w warunku zmienia się w środku pętli (np. j -= 1)?'},
  input: {title: 'Program czeka na dane', hint: 'Program wywołał input(), ale pole „Dane wejściowe” jest puste albo skończyły się w nim linie. Wpisz wartości — każda linia to jedno input().'},
  output: {title: 'Program wypisał za dużo tekstu', hint: 'Zatrzymałem go po 20 000 znaków. To często znak, że pętla się nie kończy.'},
  steps: {title: 'Pokazuję pierwsze kroki programu', hint: `Śledzenie zatrzymuje się po ${MAX_TRACE_STEPS} krokach. Zmniejsz dane albo liczbę powtórzeń pętli.`},
};

/* ───────────── Punktacja ───────────── */
export const roundHalf = x => Math.round(x * 2) / 2;
export const floorHalf = x => Math.floor(x * 2 + 1e-9) / 2;
/** Punkty za zadanie z kodem: pełne bez podpowiedzi i poprawek, mniej po podpowiedziach i nieudanych sprawdzeniach. */
export function codeScore(points, {hints = 0, fails = 0, solutionShown = false} = {}) {
  if (!points) return 0;
  if (solutionShown) return floorHalf(points * 0.25);
  const f = Math.max(0.4, 1 - 0.2 * hints - 0.1 * Math.max(0, fails - 1));
  return roundHalf(points * f);
}
/** Częściowe punkty, gdy nie wszystkie testy przechodzą: połowa punktów proporcjonalnie do testów. */
export const partialScore = (points, passed, total) => (total ? floorHalf(points * 0.5 * passed / total) : 0);
/** Układanka: 1. sprawdzenie pełne punkty, potem 75%, potem 50%. */
export const parsonsScore = (points, fails = 0, hints = 0) => roundHalf(points * Math.max(0.5, 1 - 0.25 * fails - 0.15 * hints));
export const predictScore = (points, ok) => (ok ? points : roundHalf(points * 0.5));
export const questionScore = st => (st?.ok ? (st.first ? 1 : 0.5) : 0);

export function checkQuestion(question, answer) {
  if (question.options) return question.correct.includes(Number(answer));
  const norm = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/zł$/, '');
  const accepted = [question.answer, ...(question.accept || [])].map(norm);
  return norm(answer) !== '' && accepted.includes(norm(answer));
}

/** Maksymalna liczba punktów aktywności pythonLab. */
export const labMax = data => (data.points || 0) + (data.questions?.length || 0);

/** Wynik aktywności: {done, score, max, summary}. value = stan zapisany przez komponent. */
export function labResult(data, value = {}) {
  const v = value || {};
  const max = labMax(data);
  const qs = data.questions || [];
  const qScore = qs.reduce((s, _, i) => s + questionScore(v.q?.[i]), 0);
  const qDone = qs.every((_, i) => v.q?.[i]?.ok);
  let main = 0, mainDone = false;
  const P = data.points || 0;
  if (data.mode === 'code') {
    if (data.tests?.length) {
      mainDone = !!v.passedAll;
      main = mainDone ? (v.solvedScore ?? codeScore(P, v)) : partialScore(P, v.bestPassed || 0, data.tests.length);
    } else { mainDone = !!v.ranOk; main = mainDone ? P : 0; }
  } else if (data.mode === 'parsons') {
    mainDone = !!v.passedAll;
    main = mainDone ? (v.solvedScore ?? parsonsScore(P, v.fails || 0, v.hints || 0)) : 0;
  } else if (data.mode === 'predict') {
    mainDone = !!v.predict?.checked;
    main = mainDone ? predictScore(P, v.predict.ok) : 0;
  } else if (data.mode === 'trace') {
    mainDone = qs.length ? true : !!v.visitedEnd;
    main = P && (v.visitedEnd || qDone) ? P : 0;
  }
  const score = Math.min(max, Math.round((main + qScore) * 10) / 10);
  const done = mainDone && qDone;
  let summary;
  if (data.summary && done) summary = data.summary.replace('{passed}', v.bestPassed ?? '').replace('{total}', data.tests?.length ?? '');
  return {done, score, max, summary};
}

/* ───────────── Testy w kodzie źródłowym (bez uruchamiania) ───────────── */
export function sourceChecks(code, checks = []) {
  return checks.map(c => {
    const re = new RegExp(c.pattern, c.flags || 'm');
    const found = re.test(stripComments(code));
    return {label: c.label, ok: c.absent ? !found : found, source: true, hint: c.hint};
  });
}
export function stripComments(code) {
  return String(code).split('\n').map(l => { const t = tokenizeLine(l); return t.filter(x => x.t !== 'com').map(x => x.v).join(''); }).join('\n');
}

/* ───────────── Układanka Parsonsa ───────────── */
/** Deterministyczne tasowanie (to samo dla wszystkich uczniów danego zadania). */
export function seededShuffle(arr, seedText) {
  let h = 2166136261;
  for (const ch of String(seedText)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  // Nie zostawiaj rozwiązania w oryginalnej kolejności.
  if (a.length > 2 && a.every((x, i) => x === arr[i])) a.push(a.shift());
  return a;
}
/** Bloki układanki: {id, text, indent (poziom w rozwiązaniu), distractor}. */
export function parsonsBlocks(data) {
  const sol = String(data.solution || '').split('\n').filter(l => l.trim());
  const blocks = sol.map((l, i) => ({id: `b${i}`, text: l.trim(), indent: Math.round((l.length - l.trimStart().length) / 4)}));
  (data.distractors || []).forEach((l, i) => blocks.push({id: `d${i}`, text: l.trim(), indent: null, distractor: true}));
  return blocks;
}
export function parsonsPool(data) { return seededShuffle(parsonsBlocks(data).map(b => b.id), data.id || 'parsons'); }
/** Składa kod z programu [{id, indent}]. */
export function parsonsCode(data, program = []) {
  const blocks = Object.fromEntries(parsonsBlocks(data).map(b => [b.id, b]));
  return program.filter(p => blocks[p.id]).map(p => '    '.repeat(p.indent || 0) + blocks[p.id].text).join('\n') + '\n';
}
/** Wstępna ocena ułożenia: brakujące linie, pułapki, pierwsza linia różna od wzorca. */
export function parsonsReview(data, program = []) {
  const blocks = parsonsBlocks(data);
  const need = blocks.filter(b => !b.distractor);
  const used = new Set(program.map(p => p.id));
  const distractors = program.filter(p => p.id.startsWith('d')).length;
  const missing = need.filter(b => !used.has(b.id)).length;
  const byId = Object.fromEntries(blocks.map(b => [b.id, b]));
  let firstDiff = -1;
  for (let i = 0; i < Math.max(program.length, need.length); i++) {
    const p = program[i], b = need[i], pb = p && byId[p.id];
    if (!pb || !b || pb.text !== b.text || (p.indent || 0) !== b.indent) { firstDiff = i; break; }
  }
  return {missing, distractors, firstDiff, matches: firstDiff === -1, needed: need.length};
}

/* ───────────── Edytor: obsługa klawiszy (czysta funkcja) ───────────── */
const lineStartOf = (text, pos) => text.lastIndexOf('\n', pos - 1) + 1;
/**
 * Zwraca zmianę {from, to, insert, selStart, selEnd} albo null, gdy klawisz ma działać domyślnie.
 * key: 'Tab' | 'Enter' | 'Backspace'; shift: bool.
 */
export function editorKey(text, start, end, key, shift = false) {
  if (key === 'Tab') {
    const ls = lineStartOf(text, start);
    const multi = text.slice(start, end).includes('\n');
    if (!shift && !multi) {
      const col = start - ls;
      const n = 4 - (col % 4);
      return {from: start, to: end, insert: ' '.repeat(n), selStart: start + n, selEnd: start + n};
    }
    // Wcięcie / cofnięcie wcięcia zaznaczonych linii.
    const le = end > start && text[end - 1] === '\n' ? end - 1 : end;
    const blockEnd = text.indexOf('\n', le) === -1 ? text.length : text.indexOf('\n', le);
    const lines = text.slice(ls, blockEnd).split('\n');
    let firstDelta = 0, total = 0;
    const out = lines.map((l, i) => {
      if (!shift) { const d = l.trim() || lines.length === 1 ? 4 : 0; if (i === 0) firstDelta = d; total += d; return ' '.repeat(d) + l; }
      const sp = l.length - l.trimStart().length;
      const d = Math.min(sp, sp % 4 || 4);
      if (i === 0) firstDelta = -d; total -= d;
      return l.slice(d);
    });
    const insert = out.join('\n');
    const ns = Math.max(ls, start + firstDelta);
    return {from: ls, to: blockEnd, insert, selStart: multi ? ls : ns, selEnd: multi ? ls + insert.length : Math.max(ls, end + firstDelta)};
  }
  if (key === 'Enter' && !shift) {
    const ls = lineStartOf(text, start);
    const before = text.slice(ls, start);
    let indent = before.length - before.trimStart().length;
    if (!before.trim()) indent = before.length;
    const trimmed = before.replace(/#.*$/, '').trimEnd();
    if (trimmed.endsWith(':')) indent += 4;
    else if (/^\s*(return\b|pass\s*$|break\s*$|continue\s*$)/.test(before)) indent = Math.max(0, indent - 4);
    const insert = '\n' + ' '.repeat(indent);
    return {from: start, to: end, insert, selStart: start + insert.length, selEnd: start + insert.length};
  }
  if (key === 'Backspace' && start === end && start > 0) {
    const ls = lineStartOf(text, start);
    const before = text.slice(ls, start);
    if (before.length && !before.trim()) {
      const n = before.length % 4 || 4;
      return {from: start - n, to: start, insert: '', selStart: start - n, selEnd: start - n};
    }
  }
  return null;
}
export function applyEdit(text, e) { return text.slice(0, e.from) + e.insert + text.slice(e.to); }

/* ───────────── Kolorowanie składni (jedna linia) ───────────── */
const KEYWORDS = new Set('False None True and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const BUILTINS = new Set('print input len range int str float list ord chr abs min max sum sorted round type bool enumerate zip append'.split(' '));
export function tokenizeLine(line) {
  const out = [];
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_ĄĆĘŁŃÓŚŹŻąćęłńóśźż][\wĄĆĘŁŃÓŚŹŻąćęłńóśźż]*)|(\s+)|([^\sA-Za-z_\d"'#]+)/gy;
  let m, last = 0;
  while (last < line.length) {
    re.lastIndex = last;
    m = re.exec(line);
    if (!m || m[0] === '') { out.push({t: 'txt', v: line.slice(last)}); break; }
    const v = m[0];
    let t = 'txt';
    if (m[1]) t = 'com'; else if (m[2]) t = 'str'; else if (m[3]) t = 'num';
    else if (m[4]) t = KEYWORDS.has(v) ? 'kw' : BUILTINS.has(v) ? 'fn' : 'id';
    else if (m[6]) t = 'op';
    const prev = out[out.length - 1];
    if (prev && prev.t === t && (t === 'txt' || t === 'op')) prev.v += v; else out.push({t, v});
    last = re.lastIndex;
  }
  return out;
}
