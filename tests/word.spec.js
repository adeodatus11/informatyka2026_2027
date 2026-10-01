import {test,expect} from '@playwright/test';
import {readdir} from 'node:fs/promises';
const files=(await readdir(new URL('../content/lessons/',import.meta.url))).filter(f=>/^\d.*\.js$/.test(f));
const lessons=(await Promise.all(files.map(async f=>(await import(new URL('../content/lessons/'+f,import.meta.url))).default))).filter(l=>l.workspace==='desktop-word');
test('Word: wszystkie etapy, materiały do pobrania i plany nauczyciela',async({page,request})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const l of lessons){
  await page.goto(`lesson/${l.id}/`);await expect(page.getByRole('heading',{level:1,name:l.title})).toBeVisible();
  await expect(page.getByText('Przeglądarka obok Worda',{exact:true})).toBeVisible();
  for(let i=0;i<l.sections.length;i++){
   await expect(page.getByRole('heading',{level:2,name:l.sections[i].title,exact:true})).toBeVisible();
   for(const a of l.sections[i].activities.filter(a=>a.type==='download')){
    const link=page.getByRole('link',{name:a.label,exact:true});await expect(link).toHaveAttribute('download','');
    const r=await request.get(a.file);expect(r.ok()).toBeTruthy();expect((await r.body()).subarray(0,2).toString()).toBe('PK');
   }
   for(const a of l.sections[i].activities.filter(a=>a.type==='wordRubric')){
    const rubric=page.locator('.word-rubric').filter({has:page.getByRole('heading',{name:a.title,exact:true})});
    const selects=rubric.getByRole('combobox');expect(await selects.count()).toBe(a.criteria.length);
    for(let j=0;j<a.criteria.length;j++)await selects.nth(j).selectOption(String(a.criteria[j].points));
    await expect(rubric.getByRole('status')).toContainText('Twoja samoocena:');
    await selects.first().selectOption('0');await expect(rubric.getByRole('status')).toContainText(`Twoja samoocena: ${a.criteria.reduce((sum,c)=>sum+c.points,0)-a.criteria[0].points}/`);
   }
   if(i<l.sections.length-1)await page.getByRole('button',{name:'Przejdź dalej',exact:true}).click();
  }
  await expect(page.locator('.result-teacher')).not.toContainText('proponowana ocena');
  await page.goto(`teacher/lesson/${l.id}/`);await expect(page.getByRole('heading',{name:'Pliki, instrukcje i kryteria pracy w Wordzie',exact:true})).toBeVisible();
 }
 expect(errors).toEqual([]);
});
test('Word: pobranie DOCX działa i layout mieści się w ekranie telefonu',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const l=lessons[0];await page.goto(`lesson/${l.id}/`);
 for(let i=0;i<l.sections.length;i++){
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
  const download=l.sections[i].activities.find(a=>a.type==='download');
  if(download){const event=page.waitForEvent('download');await page.getByRole('link',{name:download.label,exact:true}).click();const file=await event;expect(file.suggestedFilename()).toBe(download.file.split('/').at(-1));expect(await file.failure()).toBeNull();}
  if(i<l.sections.length-1)await page.getByRole('button',{name:'Przejdź dalej',exact:true}).click();
 }
});
test('Word: poprawa błędu, komplet aktywności i samoocena nie zmieniają wyniku quizu',async({page})=>{
 const lesson=lessons[0];await page.goto(`lesson/${lesson.id}/`);
 for(const [i,s] of lesson.sections.entries()){
  for(const a of s.activities){
   if(a.type==='choice'){
    const g=page.getByRole('group',{name:a.question,exact:true});
    if(i===0){await g.locator('button[data-option="0"]').click();await expect(g).toContainText('Spróbuj jeszcze raz');}
    await g.locator(`button[data-option="${a.correct[0]}"]`).click();
   }
   if(a.type==='checklist')for(const item of a.items)await page.getByRole('checkbox',{name:item,exact:true}).check();
   if(a.type==='wordRubric'){
    const before=await page.locator('.result-score').innerText();
    for(const select of await page.locator('.word-rubric select').all())await select.selectOption('0');
    await expect(page.locator('.word-rubric [role=status]')).toContainText('Twoja samoocena: 0/10');
    expect(await page.locator('.result-score').innerText()).toBe(before);
   }
   if(a.type==='text'){
    const form=page.locator('form').filter({has:page.getByText(a.question,{exact:true})});
    await form.getByRole('textbox').fill('Nagłówek strony powtarza się na stronach, a Nagłówek 1 oznacza rozdział. Potrzebuję powtórki modyfikacji stylu.');
    await form.getByRole('button').click();
   }
  }
  await page.getByRole('button',{name:i===lesson.sections.length-1?'Zakończ lekcję':'Przejdź dalej',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Lekcja ukończona.',exact:true})).toBeVisible();
 await page.reload();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
});
