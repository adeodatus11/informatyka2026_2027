import React from 'react';
import {Icon} from './icons.jsx';
// Ilustracje krok po kroku: przekazanie podejrzanego SMS-a na 8080 i zgłoszenie strony na incydent.cert.pl.
// To uproszczone rysunki (wygląd zależy od telefonu i może się zmieniać), a nie zrzuty ekranu.
const sms='Twoj mDowod w mObywatelu wygasa DZIS. Odnow go teraz: https://m0bywatel.pl/odnow';
function Phone({step,title,children}){return <figure className="rg-phone"><figcaption><b>{step}</b> {title}</figcaption><div className="rg-screen">{children}</div></figure>;}
export function ReportGuide({data}){
 return <section className="report-guide activity" aria-labelledby={`${data.id}-title`}>
  <h3 id={`${data.id}-title`}>{data.title||'Jak zgłosić oszustwo — krok po kroku'}</h3>
  <h4><Icon name="phone" size={20}/> Podejrzany SMS → przekaż na <b>8080</b> (CERT Polska, bezpłatnie)</h4>
  <div className="rg-phones">
   <Phone step="1." title="Przytrzymaj palec na wiadomości"><div className="rg-head">mObywatel</div><div className="rg-bubble rg-hold">{sms}<span className="rg-finger" aria-hidden="true">👆</span></div><p className="rg-tip">Nie klikaj linku!</p></Phone>
   <Phone step="2." title="Wybierz „Przekaż”"><div className="rg-head">mObywatel</div><div className="rg-bubble rg-dim">{sms}</div><ul className="rg-menu"><li>Kopiuj</li><li className="rg-pick">Przekaż</li><li>Usuń</li></ul></Phone>
   <Phone step="3." title="Wpisz odbiorcę 8080 i wyślij"><div className="rg-to">Do: <b>8080</b></div><div className="rg-bubble rg-out">{sms}</div><div className="rg-send"><span>Wiadomość</span><b>Wyślij ➤</b></div></Phone>
   <Phone step="4." title="Usuń SMS-a"><div className="rg-head">8080</div><div className="rg-bubble rg-out rg-small">{sms}</div><p className="rg-ok"><Icon name="check" size={18}/> Wysłane. CERT Polska sprawdzi link i może zablokować stronę. Możesz dostać odpowiedź zwrotną.</p></Phone>
  </div>
  <p className="rg-note">W niektórych telefonach opcja nazywa się „Prześlij dalej”. Nie ma jej? Skopiuj całą treść SMS-a (razem z nazwą nadawcy) i wyślij ją jako nową wiadomość na 8080.</p>
  <h4><Icon name="globe" size={20}/> Podejrzana strona lub e-mail → zgłoś na <a href="https://incydent.cert.pl/" target="_blank" rel="noopener">incydent.cert.pl</a></h4>
  <div className="rg-browser" role="img" aria-label="Ilustracja formularza zgłoszenia incydentu: wybór rodzaju zgłoszenia, adres podejrzanej strony, opis i przycisk wysłania">
   <div className="rg-bar"><Icon name="lock" size={14}/> https://incydent.cert.pl</div>
   <div className="rg-form">
    <p className="rg-form-title">Zgłoś incydent</p>
    <p className="rg-label">1. Co zgłaszasz?</p>
    <div className="rg-radios"><span className="rg-on">podejrzaną stronę</span><span>SMS</span><span>e-mail</span><span>inne</span></div>
    <p className="rg-label">2. Adres podejrzanej strony</p>
    <div className="rg-input">https://login.gov.pl.login-check.xyz/logowanie</div>
    <p className="rg-label">3. Krótki opis (co się stało)</p>
    <div className="rg-input rg-area">Strona podszywa się pod login.gov.pl i prosi o hasło i kod SMS.</div>
    <div className="rg-submit">4. Wyślij zgłoszenie</div>
   </div>
  </div>
  <p className="rg-note"><b>Ilustracja uproszczona</b> — prawdziwy formularz może wyglądać trochę inaczej. Podejrzany e-mail możesz też przesłać na <b>cert@cert.pl</b>. Zgłoszenie jest bezpłatne i nie musisz podawać danych osobowych.</p>
 </section>;
}
