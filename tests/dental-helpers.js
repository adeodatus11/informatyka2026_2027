export async function createDentalProject(page) {
 for(const [table,fields,key] of [
  ['Pacjenci',{id_pacjenta:'integer',imie:'text',nazwisko:'text'},'id_pacjenta'],
  ['Wizyty',{id_wizyty:'integer',id_pacjenta:'integer',termin:'datetime',cel:'text'},'id_wizyty']
 ]) {
  for(const [field,type] of Object.entries(fields))await page.getByLabel(`Typ ${table}.${field}`,{exact:true}).selectOption(type);
  await page.getByLabel(`Klucz główny ${table}`,{exact:true}).selectOption(key);
  await page.getByRole('button',{name:`Utwórz tabelę ${table}`,exact:true}).click();
 }
 await page.getByLabel('Klucz obcy w Wizyty',{exact:true}).selectOption('id_pacjenta');
 await page.getByLabel('Wskazuje pole w Pacjenci',{exact:true}).selectOption('id_pacjenta');
 await page.getByRole('button',{name:'Połącz tabele',exact:true}).click();
}
export async function fillDentalVisit(page,{id='5',patient='1',day='2026-09-23',time='10:00',purpose='kontrola'}={}) {
 await page.getByLabel('ID wizyty',{exact:true}).fill(id);
 await page.getByLabel('ID pacjenta wizyty',{exact:true}).fill(patient);
 await page.getByLabel('Data wizyty',{exact:true}).fill(day);
 await page.getByLabel('Godzina wizyty',{exact:true}).fill(time);
 await page.getByLabel('Cel wizyty',{exact:true}).fill(purpose);
}
export async function prepareDentalRecords(page) {
 await page.getByRole('button',{name:'2. Dane',exact:true}).click();
 for(const [id,name,surname] of [['1','Ada','Testowa'],['2','Jan','Przykładowy'],['3','Ewa','Modelowa']]) {
  await page.getByLabel('ID pacjenta',{exact:true}).fill(id);
  await page.getByLabel('Imię',{exact:true}).fill(name);
  await page.getByLabel('Nazwisko',{exact:true}).fill(surname);
  await page.getByRole('button',{name:'Dodaj pacjenta',exact:true}).click();
 }
 await page.getByRole('button',{name:'Wczytaj 4 przykładowe wizyty',exact:true}).click();
 await fillDentalVisit(page);
 await page.getByRole('button',{name:'Dodaj wizytę',exact:true}).click();
}
export async function performDentalQueries(page) {
 await page.getByRole('button',{name:'3. Wyszukiwanie',exact:true}).click();
 await page.getByLabel('Filtr',{exact:true}).selectOption('day');
 await page.getByLabel('Dzień wyszukiwania',{exact:true}).fill('2026-09-21');
 await page.getByRole('button',{name:'Wyszukaj',exact:true}).click();
 await page.getByLabel('Filtr',{exact:true}).selectOption('patient');
 await page.getByLabel('Wybierz pacjenta',{exact:true}).selectOption('1');
 await page.getByRole('button',{name:'Wyszukaj',exact:true}).click();
}
