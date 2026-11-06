import config from './playwright.config.js';
export default {...config,use:{...config.use,baseURL:'http://127.0.0.1:4281/informatyka2026_2027/'},webServer:{command:"sed 's/listen(4174/listen(4281/' scripts/serve.mjs | node --input-type=module",url:'http://127.0.0.1:4281/informatyka2026_2027/',reuseExistingServer:false}};
