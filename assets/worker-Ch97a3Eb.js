(function(){let e=String.raw`
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
`;new Set(`False None True and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield`.split(` `)),new Set(`print input len range int str float list ord chr abs min max sum sorted round type bool enumerate zip append`.split(` `));let t=null,n=null;async function r(r){return t=await(await import(`${r}pyodide.mjs`)).loadPyodide({indexURL:r,stdout:()=>{},stderr:()=>{}}),t.runPython(e),n=t.globals.get(`_pl_run`),t.runPython(`import sys; sys.version.split()[0]`)}self.onmessage=async e=>{let i=e.data||{};if(i.type===`init`){try{let e=await r(i.indexURL);self.postMessage({type:`ready`,python:e,pyodide:t.version})}catch(e){self.postMessage({type:`error`,message:String(e?.message||e)})}return}if(i.type===`run`)try{let e=JSON.parse(n(JSON.stringify(i.req)));self.postMessage({type:`result`,id:i.id,result:e})}catch(e){self.postMessage({type:`result`,id:i.id,result:{stdout:``,error:{type:`InternalError`,message:String(e?.message||e),line:null}}})}}})();