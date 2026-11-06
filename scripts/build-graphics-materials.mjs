// Autorskie materiały graficzne do lekcji 99–104; bez sieci i generatora AI.
// Uruchom: node scripts/build-graphics-materials.mjs (wymaga Chrome zainstalowanego do testów).
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
const folder=new URL('../public/materials/grafika/',import.meta.url);
await mkdir(folder,{recursive:true});
const svg=(w,h,label,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>`;
const cube=`<polygon points="450,110 660,230 450,350 240,230" fill="#edba63"/><polygon points="240,230 450,350 450,520 240,400" fill="#bc7443"/><polygon points="450,350 660,230 660,400 450,520" fill="#855338"/><path d="M345 170L555 290 555 460 510 486 510 316 300 196Z" fill="#f6d9a2"/>`;
const items=[
 {name:'99-tlo.png',w:1200,h:675,label:'Tło miniatury klubu gier — autorska ilustracja',body:'<rect width="1200" height="675" fill="#e3edf6"/><path d="M0 550L1200 240V675H0Z" fill="#c3d5e8"/><circle cx="1050" cy="90" r="170" fill="#f3c069"/>'},
 {name:'99-pad.png',w:500,h:500,label:'Fikcyjny kontroler gry, przezroczyste tło',body:'<path d="M130 170Q80 170 65 240L40 350Q35 400 80 405Q110 410 140 360L165 330H335L360 360Q390 410 420 405Q465 400 460 350L435 240Q420 170 370 170Z" fill="#223447"/><path d="M130 200H370Q390 200 398 230L410 280H90L102 230Q110 200 130 200Z" fill="#38536e"/><rect x="110" y="225" width="75" height="25" rx="4" fill="#f8f0e1"/><rect x="135" y="200" width="25" height="75" rx="4" fill="#f8f0e1"/><circle cx="335" cy="220" r="15" fill="#f0bd68"/><circle cx="375" cy="255" r="15" fill="#9ad2c0"/><circle cx="295" cy="255" r="15" fill="#dc8e94"/><circle cx="335" cy="290" r="15" fill="#9ab8df"/><circle cx="215" cy="310" r="24" fill="#101c29"/><circle cx="285" cy="310" r="24" fill="#101c29"/>'},
 {name:'100-paczka.png',w:900,h:600,label:'Fikcyjna paczka na jednolitym tle — ćwiczenie selekcji',body:'<rect width="900" height="600" fill="#f1eee7"/>'+cube},
 {name:'100-tlo.png',w:900,h:600,label:'Nowe tło fotomontażu — autorska ilustracja',body:'<rect width="900" height="600" fill="#d9e8e5"/><circle cx="820" cy="50" r="220" fill="#c3d8d3"/><path d="M0 500L900 260V600H0Z" fill="#b4cbc5"/>'},
 {name:'101-produkt.png',w:1500,h:1000,label:'Autorska studyjna ilustracja fikcyjnego głośnika — materiał do edycji rastra',body:'<defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="#c8c7c4"/><stop offset="1" stop-color="#eeece6"/></linearGradient><pattern id="g" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2" fill="#647278"/></pattern></defs><rect width="1500" height="1000" fill="url(#s)"/><path d="M0 720H1500V1000H0Z" fill="#c1c0ba"/><ellipse cx="780" cy="795" rx="300" ry="38" fill="#9e9d98"/><rect x="550" y="190" width="410" height="580" rx="60" fill="#34444b"/><rect x="580" y="235" width="350" height="480" rx="30" fill="url(#g)"/><circle cx="755" cy="230" r="9" fill="#e8bf77"/><rect x="685" y="740" width="140" height="8" rx="4" fill="#d0b47b"/><circle cx="285" cy="800" r="16" fill="#83847f"/>'},
 {name:'102-figury.svg',w:900,h:600,label:'Starter ikony klubu — trzy osobne figury',body:'<rect width="900" height="600" fill="#f5f1e9"/><rect x="300" y="140" width="300" height="300" rx="28" fill="#203d57"/><circle cx="450" cy="290" r="100" fill="#f0c36e"/><rect x="425" y="220" width="50" height="140" fill="#203d57"/>'},
 {name:'103-sciezka.svg',w:900,h:600,label:'Starter ścieżek — otwarta i zamknięta łamana',body:'<rect width="900" height="600" fill="#f5f1e9"/><path d="M160 180L340 180L340 360L160 360" fill="none" stroke="#31556c" stroke-width="16"/><path d="M560 180L740 180L740 360L560 360Z" fill="#f0c36e" stroke="#31556c" stroke-width="16"/>'},
 {name:'104-przestrzen.svg',w:900,h:600,label:'Starter rysunku przestrzennego — trzy płaskie ściany pudełka',body:'<rect width="900" height="600" fill="#f5f1e9"/><g id="pudelko"><path d="M270 190L450 90L630 190L450 290Z" fill="#f0c36e"/><path d="M270 190L450 290V490L270 390Z" fill="#ca8b49"/><path d="M450 290L630 190V390L450 490Z" fill="#875c39"/></g>'},
 {name:'102-ikona.svg',w:64,h:64,label:'Ikona do porównania rastra z wektorem',body:'<rect x="2" y="2" width="60" height="60" rx="10" fill="#203d57"/><circle cx="32" cy="32" r="19" fill="#f0c36e"/><path d="M19 32H45M32 19V45" stroke="#203d57" stroke-width="6"/>'},
 {name:'102-ikona.png',w:64,h:64,label:'Ta sama ikona w rastrze 64 na 64 piksele',body:'<rect x="2" y="2" width="60" height="60" rx="10" fill="#203d57"/><circle cx="32" cy="32" r="19" fill="#f0c36e"/><path d="M19 32H45M32 19V45" stroke="#203d57" stroke-width="6"/>'}
];
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const manifest=[];
try{for(const item of items){const source=svg(item.w,item.h,item.label,item.body);let bytes;
 if(item.name.endsWith('.svg'))bytes=Buffer.from(source);
 else {await page.setContent('<canvas></canvas>');const data=await page.evaluate(async({source,w,h})=>{const image=new Image();image.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(source)));await image.decode();const canvas=document.querySelector('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(image,0,0);return canvas.toDataURL('image/png').split(',')[1];},{source,w:item.w,h:item.h});bytes=Buffer.from(data,'base64');}
 await writeFile(new URL(item.name,folder),bytes);manifest.push({file:item.name,width:item.w,height:item.h,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),license:'CC0-1.0',author:'Informatyka praktycznie — autorska grafika przygotowana do lekcji'});
}}finally{await browser.close();}
await writeFile(new URL('manifest.json',folder),JSON.stringify(manifest,null,2)+'\n');
console.log('Utworzono '+manifest.length+' autorskich plików PNG/SVG.');
