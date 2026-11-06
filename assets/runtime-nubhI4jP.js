import{R as e,V as t,i as n}from"./index-D1g0ZD6L.js";var r=t(e(),1),i=3e3;String.raw`
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
`;function a(e){return String(e??``).replace(/\s+/g,` `).trim().replace(/\s*([,()[\]{}:])\s*/g,`$1`)}function o(e){let t=String(e??``).replace(/\r/g,``).split(`
`).map(e=>e.replace(/\s+$/,``));for(;t.length&&!t[t.length-1].trim();)t.pop();for(;t.length&&!t[0].trim();)t.shift();return t}function s(e,t){let n=o(e),r=o(t),i=Math.max(n.length,r.length),s=Array.from({length:i},(e,t)=>({mine:n[t]??``,real:r[t]??``,ok:t<n.length&&t<r.length&&a(n[t])===a(r[t])}));return{ok:s.every(e=>e.ok),matched:s.filter(e=>e.ok).length,total:r.length,lines:s}}var c={for:`for`,if:`if`,while:`while`,else:`else`,elif:`elif`,"function definition":`def`,def:`def`,try:`try`,with:`with`,class:`class`,except:`except`},l=e=>`„${e}”`,u=[[/IndentationError/,/expected an indented block after (?:'(\w+)' statement|(function definition)) on line (\d+)/,e=>({title:`Brakuje wcięcia`,hint:`Linia ${e[3]} (${c[e[1]||e[2]]||e[1]||`def`} … :) kończy się dwukropkiem, więc pod nią musi być blok przesunięty o 4 spacje. Kliknij na początku linii pod spodem i naciśnij Tab.`})],[/IndentationError/,/unexpected indent/,()=>({title:`Niepotrzebne wcięcie`,hint:`Ta linia jest przesunięta w prawo, a nic tego nie wymaga. Wyrównaj ją do linii powyżej (Shift+Tab usuwa wcięcie).`})],[/IndentationError/,/unindent does not match/,()=>({title:`Wcięcia się nie zgadzają`,hint:`Ta linia ma inną liczbę spacji niż linie nad nią. Wcięcia robimy zawsze po 4 spacje: 4, 8, 12… Wyrównaj ją do bloku, do którego należy.`})],[/TabError/,/./,()=>({title:`Tabulatory i spacje razem`,hint:`W tej linii wcięcie jest zrobione tabulatorem, a w innych spacjami. Usuń wcięcie i wstaw je ponownie klawiszem Tab w edytorze (wstawia 4 spacje).`})],[/IndentationError/,/expected an indented block/,()=>({title:`Brakuje wcięcia`,hint:`Po linii zakończonej dwukropkiem kolejne linie muszą być przesunięte o 4 spacje (Tab).`})],[/SyntaxError/,/expected ':'/,()=>({title:`Brakuje dwukropka`,hint:`Na końcu tej linii brakuje znaku „:”. Linie z for, if, else, while i def zawsze kończą się dwukropkiem.`})],[/SyntaxError/,/Missing parentheses in call to 'print'/,()=>({title:`print potrzebuje nawiasów`,hint:`W Pythonie 3 print to funkcja: print("Cześć") — tekst w nawiasie.`})],[/SyntaxError/,/Maybe you meant '==' or ':=' instead of '='/,()=>({title:`Pojedyncze = w warunku`,hint:`W warunku porównujesz dwoma znakami ==, np. if x == 3:. Pojedyncze = oznacza „wpisz wartość do zmiennej”.`})],[/SyntaxError/,/'(.)' was never closed/,e=>({title:`Niezamknięty nawias`,hint:`Nawias ${l(e[1])} otwarto, ale nie zamknięto. Policz nawiasy otwierające i zamykające w tej linii.`})],[/SyntaxError/,/unmatched '(.)'/,e=>({title:`Nawias bez pary`,hint:`Nawias ${l(e[1])} nie ma pary — jest o jeden zamykający za dużo albo brakuje otwierającego.`})],[/SyntaxError/,/closing parenthesis '(.)' does not match opening parenthesis '(.)'/,e=>({title:`Pomieszane nawiasy`,hint:`Otwierasz ${l(e[2])}, a zamykasz ${l(e[1])}. Nawiasy muszą być tego samego rodzaju: ( ), [ ], { }.`})],[/SyntaxError/,/unterminated (?:triple-quoted )?string literal/,()=>({title:`Tekst bez cudzysłowu na końcu`,hint:`Napis zaczyna się cudzysłowem, ale się nim nie kończy. Dopisz " (lub ') na końcu tekstu.`})],[/SyntaxError/,/invalid character '(.)'/,e=>({title:`Nietypowy znak w kodzie`,hint:`Znak ${l(e[1])} nie jest dozwolony w kodzie (często to „ ” skopiowane z Worda albo polska litera w nazwie). Wpisz go ponownie z klawiatury: " zamiast „ ”.`})],[/SyntaxError/,/Perhaps you forgot a comma/,()=>({title:`Brakuje przecinka`,hint:`Między elementami (w liście, w print albo w argumentach funkcji) potrzebny jest przecinek.`})],[/SyntaxError/,/'return' outside function/,()=>({title:`return poza funkcją`,hint:`return może stać tylko w środku funkcji — w bloku pod def, z wcięciem.`})],[/SyntaxError/,/'break' outside loop|'continue' not properly in loop/,()=>({title:`break/continue poza pętlą`,hint:`Te polecenia działają tylko wewnątrz pętli for lub while (z wcięciem).`})],[/SyntaxError/,/cannot assign to|cannot be assigned|Maybe you meant '=='/,()=>({title:`Nie można tu przypisać`,hint:`Po lewej stronie znaku = musi stać nazwa zmiennej (np. wynik = 5). Jeśli chcesz porównać, użyj ==.`})],[/SyntaxError/,/invalid decimal literal/,()=>({title:`Liczba sklejona z literami`,hint:`Nazwa zmiennej nie może zaczynać się od cyfry, a liczba nie może mieć liter. W liczbach dziesiętnych używaj kropki: 5.5, nie 5,5.`})],[/SyntaxError/,/expected 'in'/,()=>({title:`Brakuje słowa in`,hint:`Pętla for ma postać: for element in kolekcja:`})],[/SyntaxError/,/./,()=>({title:`Python nie rozumie tej linii`,hint:`Sprawdź po kolei: dwukropek na końcu, pary nawiasów, cudzysłowy na początku i końcu tekstu, == w warunkach.`})],[/UnboundLocalError/,/local variable '(\w+)'/,e=>({title:`Zmienna bez wartości`,hint:`Zmienna ${l(e[1])} jest używana w funkcji, zanim cokolwiek do niej wpisano. Nadaj jej wartość początkową na początku funkcji.`})],[/NameError/,/name '(\w+)' is not defined(?:\. Did you mean: '(\w+)'\?)?/,e=>({title:`Python nie zna nazwy ${l(e[1])}`,hint:e[2]?`Literówka? Może chodziło o ${l(e[2])}. Wielkość liter ma znaczenie.`:`Zmienną trzeba najpierw utworzyć (${e[1]} = …), a funkcję zdefiniować przez def. Sprawdź literówki i wielkość liter. Jeśli to miał być tekst, weź go w cudzysłów: "${e[1]}".`})],[/TypeError/,/can only concatenate str \(not "(\w+)"\) to str/,e=>({title:`Tekst + liczba`,hint:`Nie da się dodać tekstu i ${e[1]===`int`?`liczby`:e[1]}. Zamień liczbę na tekst: str(liczba), albo w print użyj przecinka: print("Wynik:", x).`})],[/TypeError/,/unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/,e=>({title:`Działanie na złych typach`,hint:e[2]===`str`||e[3]===`str`?`Działanie ${l(e[1].trim())} łączy tekst (str) z liczbą. Tekst z input() zamień na liczbę: int(tekst) albo float(tekst).`:`Działania ${l(e[1].trim())} nie da się wykonać na typach ${e[2]} i ${e[3]}. ${e[2]===`NoneType`||e[3]===`NoneType`?`None często oznacza, że funkcji brakuje return.`:``}`.trim()})],[/TypeError/,/missing (\d+) required positional argument/,e=>({title:`Za mało argumentów`,hint:`Funkcji brakuje ${e[1]} argumentu (wartości w nawiasie). Porównaj wywołanie z linią def — ile nazw jest w nawiasie?`})],[/TypeError/,/takes (\d+) positional arguments? but (\d+) (?:was|were) given/,e=>({title:`Za dużo argumentów`,hint:`Funkcja przyjmuje ${e[1]}, a dostała ${e[2]}. Porównaj wywołanie z linią def.`})],[/TypeError/,/'(\w+)' object cannot be interpreted as an integer/,e=>({title:`Potrzebna liczba całkowita`,hint:`range() i indeksy wymagają liczby całkowitej (int), a dostały ${e[1]}. ${e[1]===`str`?`Zamień tekst: int(tekst).`:`Dzielenie / daje float — użyj //.`}`})],[/TypeError/,/(?:list|string|tuple) indices must be integers/,()=>({title:`Indeks musi być liczbą całkowitą`,hint:`W nawiasie [ ] podajesz numer elementu: 0, 1, 2… Dzielenie / daje ułamek — użyj //.`})],[/TypeError/,/ord\(\) expected a character, but string of length (\d+) found/,e=>({title:`ord() dostało za dużo znaków`,hint:`ord() zamienia na liczbę jeden znak, a dostało napis o długości ${e[1]}. Wywołuj ord() dla jednej litery, np. w pętli for litera in tekst.`})],[/TypeError/,/'str' object does not support item assignment/,()=>({title:`Napisu nie zmienisz literka po literce`,hint:`Napis (str) jest niezmienny. Zbuduj nowy: wynik = wynik + nowa_litera.`})],[/TypeError/,/'NoneType' object is not (?:subscriptable|iterable)/,()=>({title:`Wartość None`,hint:`Coś ma wartość None — najczęściej funkcja nie ma return i nic nie zwraca.`})],[/TypeError/,/'(\w+)' object is not callable/,e=>({title:`To nie jest funkcja`,hint:`Nawiasy ( ) stoją za czymś typu ${e[1]}, a nie za funkcją. Może nazwa zmiennej zasłoniła funkcję (np. zmienna o nazwie print lub len)?`})],[/TypeError/,/'(\w+)' object is not subscriptable/,e=>({title:`Nawias [ ] przy złym typie`,hint:`Indeks [ ] działa dla list i napisów, a tu jest ${e[1]}.`})],[/TypeError/,/can't multiply sequence by non-int/,()=>({title:`Mnożenie tekstu`,hint:`Mnożysz tekst lub listę przez coś, co nie jest liczbą całkowitą. Jeśli to liczba z input(), zamień ją: float(tekst).`})],[/TypeError/,/'(<|>|<=|>=)' not supported between instances of '(\w+)' and '(\w+)'/,e=>({title:`Porównanie różnych typów`,hint:`Nie da się porównać ${e[2]} z ${e[3]}. Tekst z input() zamień na liczbę: int(tekst).`})],[/IndexError/,/(list|string|tuple) index out of range/,e=>({title:`Indeks poza zakresem`,hint:`Sięgasz po element ${e[1]===`string`?`napisu`:`listy`}, którego nie ma. Indeksy idą od 0 do len(…) - 1. Jeśli w pętli używasz [j + 1], pętla musi kończyć się wcześniej, np. range(n - 1).`})],[/ZeroDivisionError/,/./,()=>({title:`Dzielenie przez zero`,hint:`Program dzieli przez 0. Sprawdź, czy dzielnik nie jest zerem, zanim podzielisz (if x != 0:).`})],[/ValueError/,/invalid literal for int\(\) with base 10: (.*)/,e=>({title:`To nie jest liczba całkowita`,hint:`int() dostało ${e[1]}, a to nie jest liczba całkowita. Sprawdź pole „Dane wejściowe” — każda linia to jedna wartość, bez spacji i liter. Liczby z przecinkiem wczytuj przez float() i pisz z kropką.`})],[/ValueError/,/could not convert string to float: (.*)/,e=>({title:`To nie jest liczba`,hint:`float() dostało ${e[1]}. Użyj kropki zamiast przecinka (12.5) i sprawdź pole „Dane wejściowe”.`})],[/ValueError/,/chr\(\) arg not in range/,()=>({title:`chr() poza zakresem`,hint:`chr() przyjmuje numer znaku (np. 65 → "A"). Sprawdź obliczenia — czy dodano ord("A") i użyto % 26?`})],[/OverflowError/,/./,()=>({title:`Za duża liczba`,hint:`Wynik jest za duży dla liczby zmiennoprzecinkowej. Sprawdź, czy pętla nie liczy za długo.`})],[/RecursionError/,/./,()=>({title:`Funkcja wywołuje samą siebie bez końca`,hint:`Brakuje warunku zakończenia (np. if n < 2: return n) albo argument nie maleje przy kolejnym wywołaniu.`})],[/KeyError/,/(.*)/,e=>({title:`Brak klucza w słowniku`,hint:`W słowniku nie ma klucza ${e[1]}. Sprawdź pisownię albo użyj slownik.get(klucz, domyślna).`})],[/AttributeError/,/'(\w+)' object has no attribute '(\w+)'/,e=>({title:`Nieznana metoda`,hint:`Typ ${e[1]} nie ma ${l(e[2])}. Literówka? ${e[1]===`NoneType`?`None często oznacza brak return w funkcji.`:``}`.trim()})]];function d(e,t=``){if(!e)return null;let n=e.type||`Error`,r=e.message||``,i=null;for(let[e,t,a]of u){if(!e.test(n))continue;let o=r.match(t);if(o){i=a(o);break}}i||={title:`Błąd w programie`,hint:`Przeczytaj komunikat i sprawdź wskazaną linię. Porównaj ją z przykładem powyżej.`};let a=String(t).split(`
`),o=Number.isInteger(e.line)?e.line:null;return{...i,type:n,message:r,line:o,lineText:o?(a[o-1]??``).trim():``,short:`${o?`Linia ${o}: `:``}${n}: ${r}`}}var f={timeout:{title:`Program działa za długo — może pętla się nie kończy?`,hint:`Środowisko zatrzymało go po kilku sekundach. Sprawdź warunek pętli while: czy zmienna z warunku zmienia się w środku pętli (np. licznik += 1 albo j -= 1)? Jeśli nie, warunek nigdy nie stanie się fałszywy.`},input:{title:`Program czeka na dane`,hint:`Program wywołał input(), ale pole „Dane wejściowe” jest puste albo skończyły się w nim linie. Wpisz wartości — każda linia to jedno input().`},output:{title:`Program wypisał za dużo tekstu`,hint:`Środowisko zatrzymało go po 20 000 znaków. To często znak, że pętla się nie kończy.`},steps:{title:`Pokazuję pierwsze kroki programu`,hint:`Śledzenie zatrzymuje się po 400 krokach. Zmniejsz dane albo liczbę powtórzeń pętli.`}},p=e=>Math.round(e*2)/2,m=e=>Math.floor(e*2+1e-9)/2;function h(e,{hints:t=0,fails:n=0,solutionShown:r=!1}={}){return e?r?m(e*.25):p(e*Math.max(.4,1-.2*t-.1*Math.max(0,n-1))):0}var g=(e,t,n)=>n?m(e*.5*t/n):0,_=(e,t=0,n=0)=>p(e*Math.max(.5,1-.25*t-.15*n)),v=(e,t)=>t?e:p(e*.5),y=e=>e?.ok?e.first?1:.5:0;function b(e,t){if(e.options)return e.correct.includes(Number(t));let n=e=>String(e??``).trim().toLowerCase().replace(/\s+/g,``).replace(/,/g,`.`).replace(/zł$/,``),r=[e.answer,...e.accept||[]].map(n);return n(t)!==``&&r.includes(n(t))}var x=e=>(e.points||0)+(e.questions?.length||0);function S(e,t={}){let n=t||{},r=x(e),i=e.questions||[],a=i.reduce((e,t,r)=>e+y(n.q?.[r]),0),o=i.every((e,t)=>n.q?.[t]?.ok),s=0,c=!1,l=e.points||0;e.mode===`code`?e.tests?.length?(c=!!n.passedAll,s=c?n.solvedScore??h(l,n):g(l,n.bestPassed||0,e.tests.length)):(c=!!n.ranOk,s=c?l:0):e.mode===`parsons`?(c=!!n.passedAll,s=c?n.solvedScore??_(l,n.fails||0,n.hints||0):0):e.mode===`predict`?(c=!!n.predict?.checked,s=c?v(l,n.predict.ok):0):e.mode===`trace`&&(c=i.length?!0:!!n.visitedEnd,s=l&&(n.visitedEnd||o)?l:0);let u=Math.min(r,Math.round((s+a)*10)/10),d=c&&o,f;return e.summary&&d&&(f=e.summary.replace(`{passed}`,n.bestPassed??``).replace(`{total}`,(e.tests?.length||0)+(e.sourceChecks?.length||0))),{done:d,score:u,max:r,summary:f}}function C(e,t=[]){return t.map(t=>{let n=new RegExp(t.pattern,t.flags||`m`).test(w(e));return{label:t.label,ok:t.absent?!n:n,source:!0,hint:t.hint}})}function w(e){return String(e).split(`
`).map(e=>F(e).filter(e=>e.t!==`com`).map(e=>e.v).join(``)).join(`
`)}function T(e,t){let n=2166136261;for(let e of String(t))n^=e.charCodeAt(0),n=Math.imul(n,16777619)>>>0;let r=()=>(n^=n<<13,n>>>=0,n^=n>>>17,n^=n<<5,n>>>=0,n/4294967296),i=[...e];for(let e=i.length-1;e>0;e--){let t=Math.floor(r()*(e+1));[i[e],i[t]]=[i[t],i[e]]}return i.length>2&&i.every((t,n)=>t===e[n])&&i.push(i.shift()),i}function E(e){let t=String(e.solution||``).split(`
`).filter(e=>e.trim()).map((e,t)=>({id:`b${t}`,text:e.trim(),indent:Math.round((e.length-e.trimStart().length)/4)}));return(e.distractors||[]).forEach((e,n)=>t.push({id:`d${n}`,text:e.trim(),indent:null,distractor:!0})),t}function D(e){return T(E(e).map(e=>e.id),e.id||`parsons`)}function O(e,t=[]){let n=Object.fromEntries(E(e).map(e=>[e.id,e]));return t.filter(e=>n[e.id]).map(e=>`    `.repeat(e.indent||0)+n[e.id].text).join(`
`)+`
`}function k(e,t=[]){let n=E(e),r=n.filter(e=>!e.distractor),i=new Set(t.map(e=>e.id)),a=t.filter(e=>e.id.startsWith(`d`)).length,o=r.filter(e=>!i.has(e.id)).length,s=Object.fromEntries(n.map(e=>[e.id,e])),c=-1;for(let e=0;e<Math.max(t.length,r.length);e++){let n=t[e],i=r[e],a=n&&s[n.id];if(!a||!i||a.text!==i.text||(n.indent||0)!==i.indent){c=e;break}}return{missing:o,distractors:a,firstDiff:c,matches:c===-1,needed:r.length}}var A=(e,t)=>e.lastIndexOf(`
`,t-1)+1;function j(e,t,n,r,i=!1){if(r===`Tab`){let r=A(e,t),a=e.slice(t,n).includes(`
`);if(!i&&!a){let e=4-(t-r)%4;return{from:t,to:n,insert:` `.repeat(e),selStart:t+e,selEnd:t+e}}let o=n>t&&e[n-1]===`
`?n-1:n,s=e.indexOf(`
`,o)===-1?e.length:e.indexOf(`
`,o),c=e.slice(r,s).split(`
`),l=0,u=0,d=c.map((e,t)=>{if(!i){let n=e.trim()||c.length===1?4:0;return t===0&&(l=n),u+=n,` `.repeat(n)+e}let n=e.length-e.trimStart().length,r=Math.min(n,n%4||4);return t===0&&(l=-r),u-=r,e.slice(r)}).join(`
`),f=Math.max(r,t+l);return{from:r,to:s,insert:d,selStart:a?r:f,selEnd:a?r+d.length:Math.max(r,n+l)}}if(r===`Enter`&&!i){let r=A(e,t),i=e.slice(r,t),a=i.length-i.trimStart().length;i.trim()||(a=i.length),i.replace(/#.*$/,``).trimEnd().endsWith(`:`)?a+=4:/^\s*(return\b|pass\s*$|break\s*$|continue\s*$)/.test(i)&&(a=Math.max(0,a-4));let o=`
`+` `.repeat(a);return{from:t,to:n,insert:o,selStart:t+o.length,selEnd:t+o.length}}if(r===`Backspace`&&t===n&&t>0){let n=A(e,t),r=e.slice(n,t);if(r.length&&!r.trim()){let e=r.length%4||4;return{from:t-e,to:t,insert:``,selStart:t-e,selEnd:t-e}}}return null}function M(e,t){return e.slice(0,t.from)+t.insert+e.slice(t.to)}var N=new Set(`False None True and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield`.split(` `)),P=new Set(`print input len range int str float list ord chr abs min max sum sorted round type bool enumerate zip append`.split(` `));function F(e){let t=[],n=/(#.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_ĄĆĘŁŃÓŚŹŻąćęłńóśźż][\wĄĆĘŁŃÓŚŹŻąćęłńóśźż]*)|(\s+)|([^\sA-Za-z_\d"'#]+)/gy,r,i=0;for(;i<e.length;){if(n.lastIndex=i,r=n.exec(e),!r||r[0]===``){t.push({t:`txt`,v:e.slice(i)});break}let a=r[0],o=`txt`;r[1]?o=`com`:r[2]?o=`str`:r[3]?o=`num`:r[4]?o=N.has(a)?`kw`:P.has(a)?`fn`:`id`:r[6]&&(o=`op`);let s=t[t.length-1];s&&s.t===o&&(o===`txt`||o===`op`)?s.v+=a:t.push({t:o,v:a}),i=n.lastIndex}return t}var I=n();function L({line:e}){return e?F(e).map((e,t)=>e.t===`txt`||e.t===`id`?(0,I.jsx)(r.Fragment,{children:e.v},t):(0,I.jsx)(`span`,{className:`pl-t-${e.t}`,children:e.v},t)):`​`}function R({id:e,value:t,onChange:n,errorLine:i,label:a,describedBy:o,onRun:s}){let c=(0,r.useRef)(null),l=(0,r.useRef)(null),[u,d]=(0,r.useState)(!1),f=t.split(`
`),p=Math.max(20,...f.map(e=>e.length));(0,r.useLayoutEffect)(()=>{let e=l.current;e&&c.current&&(c.current.setSelectionRange(e[0],e[1]),l.current=null)});function m(e){if(e.key===`Escape`){d(!0);return}if(e.key===`Enter`&&(e.ctrlKey||e.metaKey)){e.preventDefault(),s?.();return}if(e.key===`Tab`&&u){d(!1);return}if(d(!1),![`Tab`,`Enter`,`Backspace`].includes(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;let r=e.currentTarget,i=j(r.value,r.selectionStart,r.selectionEnd,e.key,e.shiftKey);if(!i)return;e.preventDefault(),r.setSelectionRange(i.from,i.to);let a=!1;try{a=i.insert===``&&i.to>i.from?document.execCommand(`delete`):document.execCommand(`insertText`,!1,i.insert)}catch{a=!1}a&&r.value===M(t,i)?r.setSelectionRange(i.selStart,i.selEnd):(l.current=[i.selStart,i.selEnd],n(M(t,i)))}return(0,I.jsxs)(`div`,{className:`pl-editor`,children:[(0,I.jsx)(`div`,{className:`pl-gutter`,"aria-hidden":`true`,children:f.map((e,t)=>(0,I.jsxs)(`span`,{className:i===t+1?`is-error`:``,children:[i===t+1?`⚠ `:``,t+1]},t))}),(0,I.jsx)(`div`,{className:`pl-editor-scroll`,children:(0,I.jsxs)(`div`,{className:`pl-editor-inner`,style:{width:`calc(${p+2}ch + 28px)`,"--rows":f.length},children:[(0,I.jsx)(`pre`,{className:`pl-hl`,"aria-hidden":`true`,children:f.map((e,t)=>(0,I.jsx)(`div`,{className:i===t+1?`pl-line is-error`:`pl-line`,children:(0,I.jsx)(L,{line:e})},t))}),(0,I.jsx)(`textarea`,{ref:c,id:e,className:`pl-textarea`,value:t,"aria-label":a,"aria-describedby":o,spellCheck:!1,autoCapitalize:`off`,autoComplete:`off`,autoCorrect:`off`,wrap:`off`,onChange:e=>n(e.target.value),onKeyDown:m,onBlur:()=>d(!1)})]})})]})}function z({code:e,current:t,previous:n,errorLine:i,label:a}){let o=e.replace(/\n+$/,``).split(`
`),s=(0,r.useRef)(null);return(0,r.useLayoutEffect)(()=>{let e=s.current?.querySelector(`.is-current`),t=s.current;if(e&&t&&t.scrollHeight>t.clientHeight){let n=e.offsetTop-t.clientHeight/2;t.scrollTop=Math.max(0,n)}},[t]),(0,I.jsx)(`div`,{className:`pl-view`,ref:s,role:`region`,"aria-label":a||`Kod programu`,tabIndex:0,children:(0,I.jsx)(`ol`,{className:`pl-view-lines`,children:o.map((e,r)=>{let a=r+1;return(0,I.jsxs)(`li`,{className:a===i?`is-error`:a===t?`is-current`:a===n?`is-previous`:``,children:[(0,I.jsxs)(`span`,{className:`pl-view-num`,"aria-hidden":`true`,children:[(0,I.jsx)(`b`,{children:a===i?`⚠`:a===t?`➜`:a===n?`✓`:``}),a]}),(0,I.jsx)(`code`,{children:(0,I.jsx)(L,{line:e})}),a===t&&(0,I.jsx)(`span`,{className:`pl-sr`,children:`(ta linia wykona się teraz)`})]},r)})})})}var B=null,V=null,H=null,U=0,W=Promise.resolve(),G=new Map,K=new Set,q={status:`idle`,restarts:0,python:``,error:``};function J(e){q={...q,...e};for(let e of K)e(q)}function Y(e){return K.add(e),e(q),()=>K.delete(e)}function X(){return q}function Z(){J({status:q.restarts?`restarting`:`loading`,error:``});let e=new Worker(new URL(new URL(`worker-Ch97a3Eb.js`,import.meta.url).href,``+import.meta.url),{type:`module`});B=e,V=new Promise((t,n)=>{e.onmessage=e=>{let r=e.data||{};if(r.type===`ready`)J({status:`ready`,python:r.python}),t();else if(r.type===`error`)Q(`Nie udało się uruchomić Pythona: ${r.message}`),n(Error(r.message));else if(r.type===`result`){let e=G.get(r.id);e&&(G.delete(r.id),e(r.result))}},e.onerror=e=>{e.preventDefault?.(),Q(`Nie udało się uruchomić Pythona w tej przeglądarce. Odśwież stronę albo użyj aktualnego Chrome, Edge lub Firefoksa.`),n(Error(`worker error`))}}),V.catch(()=>{}),e.postMessage({type:`init`,indexURL:H})}function Q(e){J({status:`error`,error:e});try{B?.terminate()}catch{}B=null,V=null}function $(e){return e&&!H&&(H=e),H||=new URL(`pyodide/`,document.baseURI).href,V||Z(),V}function ee(e,{timeoutMs:t=i}={}){let n=W.then(async()=>{try{await $()}catch{return{fatal:q.error||`Python nie jest dostępny.`}}let n=++U;J({running:!0});let r=await new Promise(r=>{let i=setTimeout(()=>{G.delete(n);try{B.terminate()}catch{}B=null,V=null,J({restarts:q.restarts+1}),Z(),r({timeout:!0,stdout:``})},t);G.set(n,e=>{clearTimeout(i),r(e)}),B.postMessage({type:`run`,id:n,req:e})});return J({running:!1}),r});return W=n.catch(()=>{}),n}export{D as _,R as a,C as b,f as c,s as d,d as f,O as g,E as h,Y as i,b as l,S as m,X as n,L as o,x as p,ee as r,z as s,$ as t,h as u,k as v,_ as y};