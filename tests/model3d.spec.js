import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readdir} from 'node:fs/promises';
const files=(await readdir(new URL('../content/lessons/',import.meta.url))).filter(f=>/^(11[0-9]|12[01])-/.test(f));
const lessons=await Promise.all(files.map(async f=>(await import('../content/lessons/'+f)).default));
for(const lesson of lessons)test(`3D ${lesson.id}: quiz, samoocena, nauczyciel i szerokości`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`./lesson/${lesson.id}/`);
 await expect(page.getByRole('heading',{level:1,name:lesson.title,exact:true})).toBeVisible();
 await expect(page.locator('.word-workspace-notice')).toContainText('chmurze Autodesk');
 await page.locator('.independent-study summary').click();
 await expect(page.locator('.independent-study')).not.toContainText('stacjonarnym Tinkercadzie');
 for(const [i,s] of lesson.sections.entries()){
  await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(i).evaluate(e=>e.click());
  await expect(page.getByRole('heading',{level:2,name:s.title,exact:true})).toBeVisible();
  for(const a of s.activities){
   if(a.type==='choice')await page.getByRole('group',{name:a.question,exact:true}).locator(`button[data-option="${a.correct[0]}"]`).click();
   if(a.type==='wordRubric')for(const [j,c]of a.criteria.entries())await page.locator(`#${a.id}-criterion-${j}`).selectOption(String(c.points));
   if(a.type==='text'){await page.locator(`#${a.id}`).fill('Zmieniłem wymiar i sprawdziłem go w drugim widoku modelu.');await page.locator('form').filter({has:page.locator(`#${a.id}`)}).getByRole('button').click();}
  }
  for(const width of [1366,1280,390]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  await page.setViewportSize({width:1366,height:900});
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.locator('.stage-navigation').getByRole('button',{name:i===lesson.sections.length-1?'Zakończ lekcję':'Przejdź dalej',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Lekcja ukończona.',exact:true})).toBeVisible();
 await expect(page.locator('.result-score')).toHaveAttribute('aria-label','Wynik 3 na 3 punktów');
 await expect(page.locator('.result-teacher')).not.toContainText('proponowana ocena');
 if(['110','121'].includes(lesson.id))await page.screenshot({path:`tmp/model3d-${lesson.id}-desktop.png`,fullPage:true});
 await page.goto(`./teacher/lesson/${lesson.id}/`);
 await expect(page.getByRole('heading',{level:1,name:lesson.title,exact:true})).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 expect(errors).toEqual([]);
});
test('3D: błędna odpowiedź daje poprawkę, karta planu jest pobierana',async({page})=>{
 const l=lessons.find(l=>l.id==='110');await page.goto('./lesson/110/');const a=l.sections[0].activities.find(a=>a.type==='choice');
 const g=page.getByRole('group',{name:a.question,exact:true});
 await g.locator(`button[data-option="${(a.correct[0]+1)%a.options.length}"]`).click();
 await g.locator(`button[data-option="${a.correct[0]}"]`).click();
 await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').last().evaluate(e=>e.click());
 await expect(page.locator('.result-score')).toHaveAttribute('aria-label','Wynik 0.5 na 3 punktów');
 const r=await page.request.get('./materials/model3d/karta-projektu.svg');expect(r.status()).toBe(200);expect(await r.text()).toContain('<svg');
});
