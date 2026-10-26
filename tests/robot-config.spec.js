import {test,expect} from '@playwright/test';
import {readdirSync} from 'node:fs';
import {PROJECTS,ROBOT_MODEL,correctWiring} from '../content/sims/robotLab.js';
const files=readdirSync(new URL('../content/lessons/',import.meta.url));
const id=files.some(f=>f.startsWith('107-'))?'107':'105';
test('Import połączeń nie nadpisuje programu wpisanego podczas odczytu pliku',async({page})=>{
 await page.goto(`./lesson/${id}/`);
 await page.getByRole('navigation',{name:'Etapy lekcji'}).getByRole('button').nth(2).click();
 const editor=page.locator('#r105-lab-editor');
 await page.locator('#r105-lab-config').setInputFiles({name:'Rover-2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({model:ROBOT_MODEL,version:1,wiring:correctWiring()}))});
 await editor.fill(PROJECTS.rover.solution);
 await expect(page.getByText('Połączenia gotowe.',{exact:true})).toBeVisible();
 await expect(editor).toHaveValue(PROJECTS.rover.solution);
 await page.getByRole('button',{name:'Sprawdź wszystkie scenariusze',exact:true}).click();
 await expect(page.locator('.robotLab-header')).toContainText('8/8 pkt',{timeout:30000});
});
