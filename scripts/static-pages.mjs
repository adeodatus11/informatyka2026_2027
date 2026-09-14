import {readFile,writeFile,mkdir,cp,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
const {readdir}=await import('node:fs/promises');
const files=(await readdir(path.join(root,'content/lessons'))).filter(f=>/^\d.*\.js$/.test(f));
for(const file of files){const {default:lesson}=await import(path.join(root,'content/lessons',file));for(const prefix of ['lesson','teacher/lesson']){const dir=path.join(root,'dist',prefix,lesson.id);await mkdir(dir,{recursive:true});const depth=prefix.split('/').length+1;await writeFile(path.join(dir,'index.html'),html.replace('<head>',`<head><base href="${'../'.repeat(depth)}">`).replace('<title>Informatyka praktycznie</title>',`<title>${lesson.title} | Informatyka praktycznie</title>`));}}
await mkdir(path.join(root,'dist/o-projekcie'),{recursive:true});
await writeFile(path.join(root,'dist/o-projekcie/index.html'),html.replace('<head>','<head><base href="../">').replace('<title>Informatyka praktycznie</title>','<title>O projekcie WIN4SMEs | Informatyka praktycznie</title>'));
await writeFile(path.join(root,'dist/.nojekyll'),'');
// Keep branch-based GitHub Pages working, without requiring a change in hosting settings.
await mkdir(path.join(root,'assets'),{recursive:true});
for(const name of await readdir(path.join(root,'assets'))){
  if(/^(?:index|ComputerExplorer|ComputerScene|PhoneExplorer|computer)-[\w-]+\.(js|css)$/.test(name))await unlink(path.join(root,'assets',name));
}
for(const entry of ['index.html','CNAME','assets','materials','videos','lesson','teacher','branding','o-projekcie']){await cp(path.join(root,'dist',entry),path.join(root,entry),{recursive:true});}
console.log('Built root GitHub Pages files and direct lesson/teacher routes. Archive left untouched.');
