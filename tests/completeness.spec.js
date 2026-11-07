import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const lessons=await Promise.all(fs.readdirSync(new URL('../content/lessons/',import.meta.url)).filter(f=>/^\d.*\.js$/.test(f)).map(async f=>(await import('../content/lessons/'+f)).default));
for(const l of lessons.filter(l=>!l.externalUrl))test(`Kompletność ${l.id}: wszystkie etapy mobilne i plan nauczyciela`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(`./lesson/${l.id}/`);expect(response.status()).toBe(200);
 for(const width of [390,768,1280]){
  await page.setViewportSize({width,height:900});
  for(const [i,s]of l.sections.entries()){
   await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(i).evaluate(e=>e.click());
   await expect(page.getByRole('heading',{name:s.title,level:2,exact:true})).toBeVisible();
   await expect(page.getByText('Przygotowuję symulator…')).toHaveCount(0);
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{message:`${l.id}/${s.id}/${width}: układ po załadowaniu CSS symulatora`}).toBe(true);
  }
 }
 await expect(page.locator('.result-card')).toBeVisible();
 await page.goto(`./teacher/lesson/${l.id}/`);
 await expect(page.getByRole('heading',{name:l.title,level:1,exact:true})).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 expect(errors).toEqual([]);
});
test('Wszystkie materiały są pobierane z poprawną sygnaturą formatu',async({request})=>{
 const paths=[...new Set(lessons.flatMap(l=>l.sections.flatMap(s=>s.activities.filter(a=>a.type==='download').map(a=>a.file))))];
 for(const file of paths){const r=await request.get('./'+file);expect(r.status(),file).toBe(200);const b=await r.body();expect(b.length,file).toBeGreaterThan(0);if(/\.(zip|docx|xlsx|pptx)$/.test(file))expect(b.subarray(0,2).toString(),file).toBe('PK');if(file.endsWith('.png'))expect(b.subarray(1,4).toString(),file).toBe('PNG');if(file.endsWith('.svg'))expect(b.toString(),file).toContain('<svg');}
});
test('Usunięte warianty par nie wracają w interfejsach helpdesku, szyfrów i HTML',async({page})=>{
 for(const id of ['14','16','36']){
  const l=lessons.find(l=>l.id===id);const s=l.sections.find(s=>['helpdesk','duel','dyktando'].includes(s.id));
  await page.goto(`./lesson/${id}/`);await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(l.sections.indexOf(s)).evaluate(e=>e.click());
  await expect(page.getByText('Przygotowuję symulator…')).toHaveCount(0);
  await expect(page.locator('.lesson-stage')).not.toContainText('na swoim komputerze łamie');
  if(id==='14'){await expect(page.getByRole('button',{name:'W parze',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Partner odpowiedział — pokaż kontrolę'})).toHaveCount(0);}
  if(id==='16'){await expect(page.getByRole('tab',{name:/Łamacz \(osoba B\)/})).toHaveCount(0);await page.getByRole('tab',{name:/Samodzielna zagadka/}).click();await expect(page.getByRole('tabpanel',{name:'Zagadka'})).toBeVisible();}
  if(id==='36'){await expect(page.locator('.lesson-stage')).not.toContainText('Osoba B');await expect(page.locator('.lesson-stage')).not.toContainText('dyktującego');}
 }
});
