import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createDentalProject,prepareDentalRecords,fillDentalVisit,performDentalQueries} from './dental-helpers.js';
const stage=(page,i)=>page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(i).click();
const saved=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('informatyka-praktycznie-v1'))['05'].answers['db-simulator']);

test('Dental simulation checks real data, persists across stages and invalidates reset progress',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./lesson/05/');await stage(page,3);
 await page.getByRole('button',{name:'Utwórz tabelę Pacjenci',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('klucz');
 await createDentalProject(page);await prepareDentalRecords(page);
 expect((await saved(page)).visits).toHaveLength(5);
 await page.getByLabel('ID pacjenta',{exact:true}).fill('1');
 await page.getByLabel('Imię',{exact:true}).fill('Inna');
 await page.getByLabel('Nazwisko',{exact:true}).fill('Osoba');
 await page.getByRole('button',{name:'Dodaj pacjenta',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Klucz główny musi być unikalny');
 expect((await saved(page)).patients).toHaveLength(3);
 await fillDentalVisit(page,{id:'6',patient:'99'});
 await page.getByRole('button',{name:'Dodaj wizytę',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Nie ma pacjenta o ID 99');
 expect((await saved(page)).visits).toHaveLength(5);
 await page.reload();await page.getByRole('button',{name:'2. Dane',exact:true}).click();
 await expect(page.getByLabel('ID pacjenta wizyty',{exact:true})).toHaveValue('99');
 await expect(page.getByRole('region',{name:'Wizyty',exact:true})).toContainText('5 rekordów');
 await page.getByRole('button',{name:'Przejdź dalej',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 await page.getByLabel('Dzień wyszukiwania',{exact:true}).fill('2026-09-25');
 await page.getByRole('button',{name:'Wyszukaj',exact:true}).click();
 await expect(page.getByText('Brak wizyt spełniających warunek.',{exact:false})).toBeVisible();
 expect((await saved(page)).solved.day).not.toBe(true);
 await performDentalQueries(page);
 const result=page.getByRole('region',{name:'Wynik wyszukiwania',exact:true});
 await expect(result.locator('tbody tr')).toHaveCount(3);
 await expect(result.locator('tbody tr').first()).toContainText('2026-09-21 09:00');
 await expect(result.locator('tbody tr').last()).toContainText('2026-09-23 10:00');
 await page.getByLabel('Kolejność',{exact:true}).selectOption('desc');
 await page.getByRole('button',{name:'Wyszukaj',exact:true}).click();
 await expect(result.locator('tbody tr').first()).toContainText('2026-09-23 10:00');
 await page.getByRole('button',{name:/Jan Przykładowy/}).click();
 await page.getByRole('button',{name:/Odrzucić zapis naruszający relację/}).click();
 await page.getByRole('button',{name:'Przejdź dalej',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');
 await stage(page,3);await page.getByRole('button',{name:'Zacznij bazę od nowa',exact:true}).click();
 await page.getByRole('button',{name:'Zachowaj bazę',exact:true}).click();
 expect((await saved(page)).visits).toHaveLength(5);
 await page.getByRole('button',{name:'Zacznij bazę od nowa',exact:true}).click();
 await page.getByRole('button',{name:'Tak, wyczyść bazę',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 expect((await saved(page)).visits).toHaveLength(0);
 await page.reload();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 expect(errors).toEqual([]);
});

test('Dental simulator forms, populated tables and queries fit mobile and are accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('./lesson/05/');await stage(page,3);
 await createDentalProject(page);await prepareDentalRecords(page);await performDentalQueries(page);
 for(const tab of ['1. Projekt','2. Dane','3. Wyszukiwanie']) {
  await page.getByRole('button',{name:tab,exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
 }
 await page.screenshot({path:'tmp/dental-search-mobile.png',fullPage:true});
 await page.setViewportSize({width:1360,height:1000});
 await page.getByRole('button',{name:'2. Dane',exact:true}).click();
 await page.screenshot({path:'tmp/dental-records-desktop.png',fullPage:true});
 // Editing preserves the relation; queries show the changed patient data.
 await page.getByRole('button',{name:'Popraw pacjenta 1',exact:true}).click();
 await page.getByLabel('Nazwisko',{exact:true}).fill('Zmieniona');
 await page.getByRole('button',{name:'Zapisz pacjenta',exact:true}).click();
 await page.getByRole('button',{name:'3. Wyszukiwanie',exact:true}).click();
 await page.getByRole('button',{name:'Wyszukaj',exact:true}).click();
 await expect(page.getByRole('region',{name:'Wynik wyszukiwania',exact:true})).toContainText('Zmieniona');
 expect((await saved(page)).solved).toEqual({});
});
