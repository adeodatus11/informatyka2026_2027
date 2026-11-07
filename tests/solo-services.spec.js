import {test,expect} from '@playwright/test';
import {modules,profile} from '../content/sims/eServices.js';
test('E-usługi: jedna osoba wykonuje wszystkie trzy sprawy i dostaje 12/12',async({page})=>{
 await page.goto('./lesson/09/');
 await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(2).click();
 for(const mod of modules){
  await page.locator('.es-module-grid').getByRole('button',{name:new RegExp(mod.title)}).click();
  for(const step of mod.steps){
   await expect(page.locator('.es-task')).toContainText(step.title);
   if(step.kind==='choice')await page.locator(`.es-task button[data-option="${step.correct}"]`).click();
   if(step.kind==='code'||step.kind==='number'){
    await page.locator('.es-task input').fill(String(step.answer).replace('.',','));
    await page.locator('.es-task').getByRole('button',{name:/Sprawdź/}).click();
   }
   if(step.kind==='pharmacy'){await page.getByLabel('PESEL pacjenta',{exact:true}).fill(profile.pesel);await page.getByLabel('Kod recepty (4 cyfry)',{exact:true}).fill('4827');await page.getByRole('button',{name:'Zrealizuj receptę',exact:true}).click();}
   if(step.kind==='referral'){await page.getByLabel('Kod e-skierowania (4 cyfry)',{exact:true}).fill('7315');await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Zapisz się',exact:true}).click();}
   if(step.kind==='toggle'){await page.getByRole('checkbox',{name:/Ulga dla młodych/}).check();await page.getByRole('button',{name:'Przelicz',exact:true}).click();}
  }
  await expect(page.locator('.es-expert')).toBeVisible();
  await page.getByRole('button',{name:'Wróć do wyboru modułów',exact:true}).click();
 }
 await expect(page.locator('.es-score')).toContainText('12/12');
 await page.getByRole('button',{name:'Przejdź dalej',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
});
