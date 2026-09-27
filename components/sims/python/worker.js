// Web Worker z Pyodide (CPython w WebAssembly). Ładuje pliki z public/pyodide/ (samo-hostowane, bez CDN).
// Protokół: {type:'init', indexURL} → {type:'ready', python} | {type:'error', message}
//           {type:'run', id, req} → {type:'result', id, result}
import {RUNNER_PY} from '../../../content/sims/pythonLab.js';

let pyodide = null;
let runFn = null;

async function init(indexURL) {
  const mod = await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`);
  pyodide = await mod.loadPyodide({indexURL, stdout: () => {}, stderr: () => {}});
  pyodide.runPython(RUNNER_PY);
  runFn = pyodide.globals.get('_pl_run');
  return pyodide.runPython('import sys; sys.version.split()[0]');
}

self.onmessage = async e => {
  const msg = e.data || {};
  if (msg.type === 'init') {
    try {
      const python = await init(msg.indexURL);
      self.postMessage({type: 'ready', python, pyodide: pyodide.version});
    } catch (err) {
      self.postMessage({type: 'error', message: String(err?.message || err)});
    }
    return;
  }
  if (msg.type === 'run') {
    try {
      const result = JSON.parse(runFn(JSON.stringify(msg.req)));
      self.postMessage({type: 'result', id: msg.id, result});
    } catch (err) {
      self.postMessage({type: 'result', id: msg.id, result: {stdout: '', error: {type: 'InternalError', message: String(err?.message || err), line: null}}});
    }
  }
};
