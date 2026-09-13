import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
const root=path.resolve('dist');const prefix='/informatyka2026_2027/';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.zip':'application/zip','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.vtt':'text/vtt; charset=utf-8'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.writeHead(302,{Location:prefix});return res.end();}if(!url.pathname.startsWith(prefix)){res.writeHead(404);return res.end('Not found');}let file=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length)));if(!file.startsWith(root+path.sep)&&file!==root)throw Error('Bad path');if((await stat(file)).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(4174,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4174'+prefix));
