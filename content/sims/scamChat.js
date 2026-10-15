// Logika symulatora „Rozmowa z oszustem” (lekcja 43). Czysty JS, bez Reacta.
// Serwisy (Okazjo, Czatik, GraczRaj24, PaczkaTeraz), osoby, numery i domeny są fikcyjne.
// Uczeń wybiera jedną z 3 odpowiedzi. Decyzja bezpieczna: rozmowa idzie dalej (oszust naciska mocniej).
// Decyzja ryzykowna: ekran „Tak by się to skończyło” i cofnięcie do tej decyzji (najwyżej 0,5 pkt).

// Wiadomość: who = 'them' (rozmówca) | 'me' (uczeń) | 'sys' (aplikacja / Twoje sprawdzenie) | 'sms' | 'call' (telefon).
const them=text=>({who:'them',text}),sys=text=>({who:'sys',text}),sms=(from,text)=>({who:'sms',from,text}),call=(from,text)=>({who:'call',from,text});

export const scenarios=[
 {id:'sell',title:'Sprzedaję bluzę za 80 zł',short:'„Kupująca” w serwisie ogłoszeń',icon:'board',
  app:{name:'Okazjo',sub:'czat z kupującym · Bluza z kapturem, rozm. M · 80 zł',theme:'okazjo'},
  contact:{name:'Kasia_K93',note:'na Okazjo od 2 dni · 0 ocen',initials:'K'},
  setup:'Wystawiasz w serwisie ogłoszeń Okazjo bluzę za 80 zł. Po 10 minutach ktoś pisze.',
  start:'s1',
  nodes:{
   s1:{msgs:[them('Dzień dobry, bluza aktualna? Biorę bez targowania 🙂'),them('Zapłacę przez „Kup z wysyłką”, kurier sam odbierze. Tylko tu mi apka wariuje. Napisz na WhatsAppie: +48 7** *** 412, tam szybciej się dogadamy.')],
    flag:{name:'Przeniesienie rozmowy poza serwis',text:'Na WhatsAppie serwis nie widzi rozmowy i nie ostrzeże Cię przed linkiem. Do tego „biorę bez pytań” od konta założonego 2 dni temu.'},
    options:[
     {text:'Odpisuję tutaj: „Aktualna. Rozmawiajmy na czacie Okazjo. Jak chcesz kupić, kliknij »Kup z wysyłką« w ogłoszeniu”.',say:'Aktualna. Rozmawiajmy na czacie Okazjo. Jak chcesz kupić, kliknij „Kup z wysyłką” w ogłoszeniu.',safe:true,reply:[them('Ok, jak wolisz 🙄 Już kupione!')],next:'s2'},
     {text:'Piszę do niej na WhatsAppie. Tam faktycznie szybciej, a 80 zł to 80 zł.',safe:false,
      end:{loss:'1 960 zł',did:'Na WhatsAppie „Kasia” od razu wysyła link „odbierz płatność”. Strona wygląda jak Okazjo, prosi o dane karty i kod z SMS-a. Wpisujesz je i z konta znika 1 960 zł, czyli cała kasa z wakacyjnej pracy.',missed:'Przeniesienie rozmowy poza serwis. Na czacie Okazjo serwis może ostrzec przed linkiem, a na WhatsAppie jesteś z oszustem sam na sam.'}},
     {text:'Odpisuję: „Wolę odbiór osobisty w Krakowie, zapłacisz przy odbiorze”.',say:'Wolę odbiór osobisty w Krakowie, zapłacisz przy odbiorze.',safe:true,reply:[them('Nie dam rady, jestem z Gdańska 😅 Ale spokojnie, już zapłaciłam przez Okazjo!')],next:'s2'}
    ]},
   s2:{msgs:[them('Zapłacone ✅ Żeby odebrać pieniądze, kliknij i potwierdź dane: https://okazjo.pl-wyplata.online/odbior/48213')],
    flag:{name:'Link „odbierz płatność” na obcej domenie',text:'Czytaj adres od końca do pierwszego „/”: to pl-wyplata.online, a nie okazjo.pl. Zapłatę za sprzedaż widzisz w aplikacji serwisu, a nie pod linkiem od kupującego.'},
    options:[
     {text:'Klikam. Adres zaczyna się od „okazjo.pl”, więc to strona serwisu.',safe:false,
      end:{loss:'1 960 zł',did:'Strona ma logo Okazjo i kłódkę. Prosi o numer karty, datę ważności i CVV „do wypłaty”, a potem o kod z SMS-a. Ten kod potwierdzał płatność Twoją kartą: 1 960 zł w sklepie z elektroniką.',missed:'Domenę czyta się od końca: pl-wyplata.online. Początek „okazjo.pl” to tylko przebranie.'}},
     {text:'Nie klikam. Otwieram aplikację Okazjo i sprawdzam w „Moich sprzedażach”, czy ktoś zapłacił.',safe:true,reply:[sys('Aplikacja Okazjo, „Moje sprzedaże”: brak zamówień na tę bluzę.')],next:'s3'},
     {text:'Klikam, ale tylko zobaczę, co tam jest. Niczego nie wpiszę.',safe:false,
      end:{loss:'1 960 zł',did:'Na stronie miga licznik: „Środki wygasną za 04:59”. W pośpiechu wpisujesz dane karty „tylko na chwilę”, potem kod z SMS-a. Strona jest zbudowana po to, żebyś zrobił kolejny krok, i robisz go.',missed:'Link „odbierz płatność” od kupującego. Żeby dostać pieniądze, nie potrzebujesz żadnej strony z linku.'}}
    ]},
   s3:{msgs:[them('KURIER STOI POD TWOIM BLOKIEM 😡 Masz 10 minut, inaczej zamówienie przepada, a Okazjo zablokuje Ci konto!'),them('Napisz do konsultanta Okazjo, on Ci pomoże: wa.me/48712604398')],
    flag:{name:'Presja czasu i fałszywy „konsultant”',text:'Krzyk, odliczanie i groźba blokady mają wyłączyć myślenie. Kurier nie odbierze paczki, której nie nadałeś, a pomoc serwisu nie pisze z prywatnego numeru.'},
    options:[
     {text:'Piszę do „konsultanta Okazjo” na WhatsAppie. Nie chcę blokady konta.',safe:false,
      end:{loss:'1 960 zł',did:'„Konsultant” ma logo Okazjo w zdjęciu profilowym. Prowadzi Cię „krok po kroku przez weryfikację”: dane karty, kod z SMS-a, kliknięcie „Potwierdź” w aplikacji banku. Każdy krok to płatność dla oszusta.',missed:'Presja czasu i „konsultant” na prywatnym numerze. Kontakt do pomocy bierzesz tylko z aplikacji albo strony serwisu wpisanej ręcznie.'}},
     {text:'Dzwonię pod numer „konsultanta” z wiadomości. Rozmowa głosem jest pewniejsza niż czat.',safe:false,
      end:{loss:'1 960 zł',did:'Odbiera miły, spokojny „konsultant”. Prosi o odczytanie kodu z SMS-a „do odblokowania wypłaty”. Głos nie zmienia faktu, że to numer od oszusta.',missed:'Kontakt podany przez oszusta prowadzi do oszusta, nawet jeśli to telefon. Numer pomocy bierz tylko z aplikacji lub strony serwisu.'}},
     {text:'Nie daję się popędzić. Kurier nie zabierze paczki, której nie nadałem. Sprawdzam pomoc w aplikacji Okazjo.',safe:true,reply:[sys('Pomoc Okazjo (w aplikacji): „Nie kontaktujemy się przez WhatsApp. Pieniądze ze sprzedaży trafiają na konto podane w Twoich ustawieniach”.')],next:'s4'}
    ]},
   s4:{msgs:[them('Ok, to inaczej. Podaj numer karty, datę ważności i ten kod z tyłu (CVV), to przeleję Ci 80 zł bezpośrednio + 20 zł za kłopot 🙏')],
    flag:{name:'Prośba o dane karty z CVV',text:'Żeby DOSTAĆ przelew, wystarczy numer konta. Numer karty, data i CVV służą do PŁACENIA. Kto o nie prosi, chce płacić Twoimi pieniędzmi.'},
    options:[
     {text:'Podaję numer karty i datę, ale CVV już nie. Bez CVV nic nie zrobi.',safe:false,
      end:{loss:'897 zł',did:'Niektóre sklepy i serwisy nie pytają o CVV. Oszust płaci Twoją kartą 3 razy po 299 zł za doładowania w grze. Musisz zastrzec kartę i reklamować transakcje w banku.',missed:'Prośba o dane karty. Żeby dostać pieniądze, nie podajesz żadnych danych karty, nawet „tylko numeru”.'}},
     {text:'Odpisuję: „Do przelewu wystarczy numer konta. Danych karty nie podaję nikomu”.',say:'Do przelewu wystarczy numer konta. Danych karty nie podaję nikomu.',safe:true,reply:[them('Ehh, z Tobą to same problemy…')],next:'s5'},
     {text:'Podaję wszystko. Przecież to ona ma zapłacić mnie, a nie ja jej.',safe:false,
      end:{loss:'1 960 zł',did:'Z numerem, datą i CVV oszust od razu płaci w sklepie internetowym. Gdy bank przysyła kod potwierdzenia, „Kasia” pisze: „Przyszedł kod do wpłaty, podaj go”. Podajesz i z konta znika 1 960 zł.',missed:'CVV służy do płacenia, nie do odbierania pieniędzy.'}}
    ]},
   s5:{msgs:[sms('Okazjo','Twój kod logowania: 482 915. Nie podawaj go nikomu, także pracownikom Okazjo.'),them('Sorki, przez pomyłkę wpisałam Twój login zamiast swojego 🙈 Przyszedł Ci SMS z kodem? Prześlij pls, bo nie mogę się zalogować i zapłacić.')],
    flag:{name:'Prośba o kod z SMS-a',text:'Kod z SMS-a to klucz do konta albo pieniędzy. SMS sam mówi: „nie podawaj nikomu”. Kto prosi o kod, chce przejąć konto.'},
    options:[
     {text:'Przepisuję kod. To tylko kod do Okazjo, a nie do banku.',safe:false,
      end:{loss:'konto Okazjo i Twoje dobre imię',did:'Oszust loguje się na Twoje konto, zmienia hasło i wystawia „Twoje” ogłoszenia z tanimi telefonami. Trzy osoby płacą po 1 200 zł. Skargi i pytania policji trafiają do Ciebie, bo konto jest Twoje.',missed:'Prośba o kod z SMS-a. Kod logowania pozwala przejąć konto, a przejęte konto służy do oszukiwania innych.'}},
     {text:'Nie podaję kodu. Klikam „Zgłoś użytkownika” w Okazjo, blokuję rozmowę i robię zrzuty ekranu.',safe:true},
     {text:'Odpisuję „Spadaj, oszuście” i zamykam aplikację. Więcej nic nie robię.',safe:false,
      end:{loss:'0 zł u Ciebie, 1 200 zł u kogoś innego',did:'Ty nic nie tracisz, ale konto „Kasi” działa dalej. Tego samego wieczoru nabiera koleżankę z równoległej klasy na 1 200 zł.',missed:'Oszust nie odpuszcza, tylko idzie do kolejnej osoby. Kliknięcie „Zgłoś” w serwisie zajmuje 20 sekund i może zablokować konto oszusta.'}}
    ]}
  },
  lastChance:'Ostatni moment był przy kodzie z SMS-a (decyzja 5). Najłatwiej było jednak przerwać na samym początku, gdy „Kasia” chciała przenieść rozmowę na WhatsAppa.',
  law:'Gdyby się udało: wyłudzenie pieniędzy przez wprowadzenie w błąd to art. 286 kk (oszustwo), a płacenie Twoją kartą bez zgody to art. 287 kk (oszustwo komputerowe). Wejście na Twoje konto Okazjo dzięki kodowi z SMS-a: art. 267 kk (cudze konto bez uprawnienia).',
  laws:[286,287,267]},

 {id:'blik',title:'Kolega prosi o kod BLIK',short:'Przejęte konto na komunikatorze',icon:'phone',
  app:{name:'Czatik',sub:'komunikator · rozmowa prywatna',theme:'czatik'},
  contact:{name:'Bartek',note:'kolega z klasy · aktywny teraz',initials:'B'},
  setup:'Wtorek, 21:40. Na komunikatorze Czatik nagle pisze do Ciebie Bartek, kolega z klasy.',
  start:'k1',
  nodes:{
   k1:{msgs:[them('siema, jesteś?'),them('mam mega prośbę 🙏 karta mi nie działa w sklepie, a muszę zapłacić 200 zł. wygenerujesz BLIK i wyślesz mi kod? oddam jutro w szkole, przysięgam')],
    flag:{name:'Prośba o kod BLIK przez komunikator',text:'To najczęstszy schemat na przejęte konto. Kod BLIK działa jak gotówka w ręku: kto go ma, ten płaci albo wypłaca z bankomatu.'},
    options:[
     {text:'Odpisuję: „Zaraz do Ciebie zadzwonię”.',say:'Zaraz do Ciebie zadzwonię.',safe:true,reply:[them('nie moge gadac, jestem w sklepie, kolejka 😭 tylko pisz plsss')],next:'k2'},
     {text:'Pytam o coś, co wie tylko prawdziwy Bartek: „Jak się nazywał nasz trener z obozu?”.',say:'Jak się nazywał nasz trener z obozu?',safe:true,reply:[them('co to za quiz xd nie pamietam, szybko bo kolejka')],next:'k2'},
     {text:'Generuję kod i wysyłam. To Bartek, znam go od podstawówki.',safe:false,
      end:{loss:'200 zł (a za chwilę prośba o kolejne 300)',did:'Kod trafia do oszusta, który stoi przy bankomacie. Aplikacja banku pyta o potwierdzenie, klikasz „Zatwierdź” bez czytania. 200 zł wypłacone w innym mieście. Po minucie: „sorki, zabrakło, wyślesz jeszcze jeden?”.',missed:'Prośba o BLIK przez komunikator. Konto znajomego ktoś mógł przejąć, a Ty widzisz tylko jego zdjęcie i imię.'}}
    ]},
   k2:{msgs:[them('no dawaj ten kod, kasjerka już się wkurza, 2 minuty!!')],
    flag:{name:'Odmowa rozmowy i pośpiech',text:'Kolega w kłopocie odbierze telefon albo powie to głosem. „Tylko pisz, szybko” to sygnał, że po drugiej stronie jest ktoś inny.'},
    options:[
     {text:'Wysyłam kod, ale to ma być tylko na 50 zł. Tyle mogę zaryzykować.',safe:false,
      end:{loss:'500 zł',did:'Kod BLIK nie ma kwoty. Kwotę wpisuje ten, kto go używa. Oszust wypłaca 500 zł z bankomatu, a Ty klikasz „Zatwierdź”, bo spieszysz się tak samo jak on.',missed:'Pośpiech i odmowa rozmowy. I jeszcze jedno: kwotę BLIK-a ustala odbiorca, a Ty ją tylko zatwierdzasz, więc czytaj powiadomienie do końca.'}},
     {text:'Dzwonię do Bartka zwykłym telefonem, na numer z moich kontaktów, a nie przez Czatik.',safe:true,reply:[call('Rozmowa z Bartkiem (telefon)','„Jaki BLIK? Siedzę w domu. Nic do Ciebie nie pisałem! Wczoraj logowałem się przez link z jakimś głosowaniem…”')],next:'k3'},
     {text:'Piszę w tym samym czacie: „Na pewno to Ty, Bartek?”. Jak potwierdzi, wysyłam.',safe:false,
      end:{loss:'200 zł',did:'„Bartek” odpisuje: „no pewnie że ja xd”. Wysyłasz kod. Oszust czyta całą Waszą historię rozmów, więc spokojnie odpowie na pytanie w tym samym czacie.',missed:'Sprawdzanie w tym samym kanale nic nie daje. Sprawdzaj INNĄ drogą: telefon na zwykły numer albo osobiście.'}}
    ]},
   k3:{msgs:[them('halo?? dobra, nieważne'),them('to chociaż zagłosuj na moją siostrę w konkursie tańca 🥺 trzeba się zalogować przez Czatik: czatik-glosowanie.online/vote/22')],
    flag:{name:'Link z logowaniem do „głosowania”',text:'Fałszywa strona logowania to sposób, w jaki przejęto konto Bartka. Kto wpisze tam login, hasło i kod, oddaje oszustowi konto i listę znajomych.'},
    options:[
     {text:'Klikam i loguję się. Głosowanie to nic złego, a strona wygląda jak Czatik.',safe:false,
      end:{loss:'Twoje konto w Czatiku',did:'Strona zbiera Twój login, hasło i kod z SMS-a. Po kwadransie z Twojego konta idzie do 120 znajomych ta sama prośba o BLIK. Twoja ciocia wysyła kod na 500 zł.',missed:'Link z logowaniem od przejętego konta. Logujesz się tylko w aplikacji albo na stronie wpisanej ręcznie.'}},
     {text:'Klikam, ale zamiast hasła wpisuję tylko numer telefonu i kod, który przyjdzie SMS-em.',safe:false,
      end:{loss:'Twoje konto w Czatiku',did:'Kod z SMS-a wystarcza, żeby zalogować się na Twoje konto na nowym urządzeniu. Oszust wylogowuje Cię wszędzie i pisze do Twoich znajomych.',missed:'Kod z SMS-a to klucz do konta. Nie wpisuj go na stronie z linku.'}},
     {text:'Nie klikam. Już wiem od Bartka, że jego konto jest przejęte.',safe:true,reply:[them('no weź, jedno kliknięcie…')],next:'k4'}
    ]},
   k4:{msgs:[sys('Grupa klasowa 1TI, Zuza: „Bartek prosi mnie o BLIK, co mu jest?”')],
    flag:{name:'Oszust pisze do całej listy kontaktów',text:'Przejęte konto to dla oszusta setki osób, które ufają temu imieniu i zdjęciu. Im szybciej znajomi się dowiedzą, tym mniej osób straci pieniądze.'},
    options:[
     {text:'Piszę na grupie: „Konto Bartka przejęte, nie wysyłajcie BLIK-a ani nie klikajcie jego linków”. Zgłaszam profil w Czatiku.',safe:true,reply:[sys('Grupa klasowa 1TI, Zuza: „Dzięki, właśnie miałam wysyłać 😳”')],next:'k5'},
     {text:'Nic nie piszę. To sprawa Bartka, on sam ogarnie.',safe:false,
      end:{loss:'400 zł u Zuzy',did:'Zanim Bartek odzyska konto, Zuza wysyła kod BLIK. 400 zł znika z jej konta.',missed:'Oszust pisze do wszystkich. Jedno ostrzeżenie na grupie mogło to zatrzymać.'}},
     {text:'Piszę do oszusta na koncie Bartka: „Wiem, że to nie Ty. Oddaj konto, bo dzwonię na policję”. Czekam, co odpowie.',safe:false,
      end:{loss:'dowody i czas',did:'Oszust odpisuje „xD”, usuwa całą rozmowę i Cię blokuje. W tym czasie pisze do kolejnych 30 osób.',missed:'Nie dyskutuj z oszustem. Ostrzeż znajomych, zrób zrzuty ekranu i zgłoś profil.'}}
    ]},
   k5:{msgs:[sms('Bartek','co mam teraz zrobić? ktoś w komentarzach napisał, że „pomoc techniczna Czatik” odzyska konto, jak im podam hasło i kod')],
    flag:{name:'Fałszywa „pomoc techniczna”',text:'Pod postami o przejętych kontach roi się od fałszywych „pomocników”. Prawdziwy serwis nigdy nie prosi o hasło ani kod z SMS-a.'},
    options:[
     {text:'Odpisuję: „Napisz do tej pomocy, szybciej odzyskasz konto”.',safe:false,
      end:{loss:'konto e-mail Bartka',did:'„Pomoc” bierze hasło i kod, a potem przejmuje też e-mail Bartka. Teraz oszust może resetować hasła do wszystkich jego kont.',missed:'Pomoc techniczna z komentarzy to kolejny oszust. Konto odzyskuje się tylko w oficjalnej aplikacji lub na stronie serwisu.'}},
     {text:'Odpisuję: „Załóż nowe konto i zapomnij o starym”.',safe:false,
      end:{loss:'kolejne ofiary',did:'Stare konto Bartka dalej działa w rękach oszusta. Przez tydzień prosi znajomych o BLIK i rozsyła link z „głosowaniem”.',missed:'Przejęte konto trzeba odzyskać albo zgłosić do serwisu, żeby je zablokował. Porzucone konto pracuje dla oszusta.'}},
     {text:'Odpisuję: „Odzyskaj konto w aplikacji (»Nie pamiętam hasła«), wyloguj wszystkie urządzenia i włącz weryfikację dwuetapową”.',safe:true}
    ]}
  },
  lastChance:'Kluczowy był telefon do Bartka na zwykły numer (decyzja 2). Gdybyś wysłał kod, ostatnią szansą byłoby powiadomienie w aplikacji banku: „Wypłata z bankomatu 200 zł”. Czytaj je do końca.',
  law:'Przejęcie konta Bartka bez uprawnienia: art. 267 kk. Wyłudzanie BLIK-a przez udawanie Bartka: art. 286 kk (oszustwo). Gdyby oszust podszywał się pod Bartka, żeby mu zaszkodzić, np. obraźliwymi postami, dochodzi art. 190a § 2 kk.',
  laws:[267,286]},

 {id:'shop',title:'Konsola z reklamy za pół ceny',short:'Fałszywy sklep internetowy',icon:'globe',
  app:{name:'GraczRaj24',sub:'czat sklepu · konsole-outlet24.shop',theme:'shop'},
  contact:{name:'Marta z obsługi klienta',note:'konsultantka sklepu',initials:'M'},
  setup:'W reklamie widzisz konsolę za 1 499 zł. W znanych sklepach kosztuje ok. 2 600 zł. Wchodzisz na stronę i otwiera się czat.',
  start:'p1',
  nodes:{
   p1:{msgs:[them('Cześć! 🎮 Konsola za 1 499 zł to promocja na otwarcie sklepu. Zostały 2 sztuki!'),sys('Na stronie miga licznik: „Rezerwacja wygasa za 14:58”.')],
    flag:{name:'Za dobra cena i licznik czasu',text:'Prawie 1 100 zł taniej niż wszędzie indziej i odliczanie. Licznik ma Ci zabrać czas na sprawdzenie sklepu.'},
    options:[
     {text:'Klikam „Kup teraz”, zanim ktoś mnie ubiegnie. Taka cena się nie powtórzy.',safe:false,
      end:{loss:'1 499 zł',did:'Jedyna forma płatności to przelew na prywatne konto. Przelewasz oszczędności z urodzin. Paczka nie przychodzi, czat milczy, a po 2 tygodniach sklep znika.',missed:'Cena prawie o połowę niższa niż wszędzie i licznik czasu.'}},
     {text:'Zanim cokolwiek kliknę, sprawdzam sklep: dane firmy, regulamin, opinie poza tą stroną.',safe:true,reply:[them('Szkoda czasu, promocja się kończy! ⏳')],next:'p2'},
     {text:'Pytam na czacie: „Czy to na pewno nie oszustwo?”. Jak odpiszą, że nie, kupuję.',say:'Czy to na pewno nie oszustwo?',safe:false,
      end:{loss:'1 499 zł',did:'„Marta” odpisuje: „Jesteśmy legalnym sklepem, mamy tysiące zadowolonych klientów 😊”. Kupujesz. Pytanie sprzedawcy, czy jest oszustem, niczego nie sprawdza.',missed:'Licznik i za dobra cena. Sklep sprawdzasz poza sklepem, a nie pytając sam sklep.'}}
    ]},
   p2:{msgs:[sys('Twoje sprawdzenie. Zakładka „O nas”: brak nazwy firmy, NIP-u i adresu. Regulamin: w środku nazwa innego sklepu. Domena konsole-outlet24.shop zarejestrowana 9 dni temu.'),them('Dane firmy wyślemy razem z fakturą, to dla bezpieczeństwa 😊')],
    flag:{name:'Brak danych firmy i świeża domena',text:'Prawdziwy sklep musi podać, kim jest: nazwę firmy, adres, NIP. Skopiowany regulamin i domena sprzed tygodnia to znak, że sklep powstał na chwilę.'},
    options:[
     {text:'Strona ma kłódkę i wygląda profesjonalnie. Duże sklepy też nie wszystko pokazują.',safe:false,
      end:{loss:'1 499 zł',did:'Kłódka znaczy tylko, że połączenie jest szyfrowane. Oszust też ją ma, za darmo. Płacisz, konsola nie przychodzi.',missed:'Brak danych firmy i domena sprzed 9 dni. Kłódka nie mówi, kto jest po drugiej stronie.'}},
     {text:'Proszę na czacie o NIP. „Marta” podaje numer, więc wszystko gra.',safe:false,
      end:{loss:'1 499 zł',did:'Nie sprawdzasz numeru w rejestrze firm. NIP należy do piekarni z Radomia, która nie ma pojęcia o sklepie. Płacisz i czekasz na konsolę, która nie przyjdzie.',missed:'Brak danych firmy na stronie. Numer podany przez sprzedawcę trzeba sprawdzić w publicznym rejestrze (CEIDG albo KRS).'}},
     {text:'Bez danych firmy nie kupuję. Wpisuję w wyszukiwarkę nazwę sklepu i słowo „opinie”.',safe:true,reply:[sys('Wyszukiwarka: wątek na forum „konsole-outlet24 nie wysłali konsoli” sprzed 3 dni.')],next:'p3'}
    ]},
   p3:{msgs:[them('Te wpisy na forum pisze konkurencja 🙄 Zobacz nasze opinie na stronie: same piątki!'),them('Dla Ciebie dodatkowe -100 zł, jeśli zapłacisz w 10 minut 🔥')],
    flag:{name:'Same idealne opinie i rabat za pośpiech',text:'Setki piątek z jednego tygodnia, pisanych podobnymi zdaniami, wyglądają na zmyślone. Dodatkowy rabat „tylko teraz” to znowu presja czasu.'},
    options:[
     {text:'Biorę z rabatem. 1 399 zł za konsolę to i tak okazja życia.',safe:false,
      end:{loss:'1 399 zł',did:'Płacisz, dostajesz e-mail „Zamówienie przyjęte” i numer przesyłki, który nigdzie nie działa. Po tygodniu sklep znika.',missed:'Same piątki na stronie sklepu, ostrzeżenie poza nią i rabat za pośpiech.'}},
     {text:'Na forum piszą pewnie zazdrośni. Pozytywnych opinii jest dużo więcej.',safe:false,
      end:{loss:'1 499 zł',did:'Wierzysz liczbom na stronie sklepu, nie ostrzeżeniu z forum. Płacisz i dołączasz do osób z tamtego wątku.',missed:'Same piątki na stronie sklepu są niewiarygodne. Jedna konkretna skarga z zewnątrz waży więcej.'}},
     {text:'Odpisuję: „Nie kupuję w pośpiechu. Zapłacę tylko z ochroną kupującego”.',say:'Nie kupuję w pośpiechu. Zapłacę tylko z ochroną kupującego.',safe:true,next:'p4'}
    ]},
   p4:{msgs:[them('Płatność kartą i BLIK-iem chwilowo nie działa 😕 Zrób przelew na konto naszego księgowego: Jan K., 12 3456 7890 …, tytuł: „prezent”.')],
    flag:{name:'Przedpłata przelewem na prywatne konto',text:'Brak płatności z ochroną (karta, bramka płatności, za pobraniem), prywatne konto i tytuł „prezent”: tak oszust utrudnia odzyskanie pieniędzy.'},
    options:[
     {text:'Rezygnuję. Bez płatności, która chroni kupującego, nie kupuję. Zamykam stronę.',safe:true,next:'p5'},
     {text:'Przelewam, ale w tytule wpisuję „konsola, zamówienie 2214”, żeby mieć dowód.',safe:false,
      end:{loss:'1 499 zł',did:'Tytuł nic nie zmienia: pieniądze trafiają na konto „słupa”, który od razu je wypłaca. Zwykłego przelewu, który sam zleciłeś, bank zwykle już nie cofnie.',missed:'Przedpłata na prywatne konto. Kupuj tylko z płatnością, która chroni kupującego.'}},
     {text:'Proszę mamę, żeby zrobiła przelew ze swojego konta. Ona ma większy limit.',safe:false,
      end:{loss:'1 499 zł z konta mamy',did:'Zmieniasz tylko to, czyje pieniądze znikną. Mama ufa, że sprawdziłeś sklep.',missed:'Przedpłata przelewem na prywatne konto i tytuł „prezent”.'}}
    ]},
   p5:{msgs:[sys('Na czacie sklepu podałeś wcześniej numer telefonu „do powiadomień o promocjach”.'),sms('PaczkaTeraz','Twoja przesyłka czeka na dopłatę 1,99 zł. Opłać w ciągu 24 h: paczkateraz-doplata.top/p/88')],
    flag:{name:'SMS o dopłacie do paczki',text:'Nie czekasz na żadną paczkę, a link prowadzi do świeżej domeny .top. Dopłata 1,99 zł to przynęta: strona chce danych karty.'},
    options:[
     {text:'Klikam, żeby sprawdzić, co to za paczka. Nic nie płacę.',safe:false,
      end:{loss:'1 280 zł',did:'Strona pyta o imię, adres i numer karty „do weryfikacji odbiorcy”. Ciekawość wciąga krok po kroku. Gdy wpisujesz kod z SMS-a, pieniądze znikają.',missed:'SMS o dopłacie do nieznanej paczki. Przesyłki sprawdzasz w aplikacji przewoźnika, a nie z linku.'}},
     {text:'Płacę 1,99 zł kartą. Może to jednak konsola i bez dopłaty przepadnie.',safe:false,
      end:{loss:'1 280 zł',did:'Strona przechwytuje dane karty i kod z SMS-a. Zamiast 1,99 zł bank zatwierdza 1 280 zł w sklepie z elektroniką.',missed:'Dopłata do paczki, której nie zamawiałeś, i dziwna domena.'}},
     {text:'Nie klikam. Przekazuję SMS-a na 8080 i go usuwam.',safe:true}
    ]}
  },
  lastChance:'Ostatni moment był przy płatności (decyzja 4). Przelew na prywatne konto to pieniądze, których bank zwykle już nie odzyska.',
  law:'Sklep, który bierze pieniądze za konsolę i jej nie wysyła: art. 286 kk (oszustwo przez wprowadzenie w błąd). Strona z „dopłatą”, która kradnie dane karty, a potem nią płaci: art. 287 kk (oszustwo komputerowe).',
  laws:[286,287]}
];

export const REQUIRED=2;           // obowiązkowe rozmowy (dowolne 2 z 3; trzecia bonus)
export const DECISIONS=5;          // decyzji w każdej rozmowie (na każdej ścieżce)
export const chatMax=REQUIRED*DECISIONS;

export const scenarioById=id=>scenarios.find(s=>s.id===id);
export const freshScenario=sc=>({node:sc.start,res:{},path:[],fail:null,done:false});

// Wybór rozmowy (aktywna karta). Stan rozmowy tworzy się przy pierwszym wejściu.
export function openScenario(value={},id){
 const sc=scenarioById(id);if(!sc)return value;
 const scen=value.scen||{};
 return {...value,active:id,scen:scen[id]?scen:{...scen,[id]:freshScenario(sc)}};
}
export function currentNode(sc,st){return st&&!st.done?sc.nodes[st.node]:null;}

// Decyzja ucznia (opt = indeks oryginalny opcji).
export function choose(sc,st,opt){
 if(!st||st.done||st.fail)return st;
 const node=sc.nodes[st.node],o=node?.options[opt];if(!o)return st;
 const r=st.res[st.node]||{tries:0,wrong:[]};
 if(r.wrong.includes(opt))return st;
 const tries=r.tries+1;
 if(!o.safe)return {...st,res:{...st.res,[st.node]:{...r,tries,wrong:[...r.wrong,opt]}},fail:{node:st.node,opt}};
 const res={...st.res,[st.node]:{...r,tries,ok:true,opt}},path=[...st.path,{node:st.node,opt}];
 return o.next?{...st,res,path,node:o.next}:{...st,res,path,done:true};
}
// „Cofnij do tej decyzji”: wracasz do tego samego pytania, ryzykowna odpowiedź zostaje wykluczona.
export function undo(st){return st?.fail?{...st,fail:null}:st;}

const stepPts=r=>r?.ok?(r.tries===1?1:0.5):0;
export function scenarioScore(sc,st){
 const path=st?.path||[];
 const score=path.reduce((s,p)=>s+stepPts(st.res[p.node]),0);
 const flags=path.filter(p=>st.res[p.node]?.tries===1).length;
 return {score,max:DECISIONS,flags,resolved:path.length,done:!!st?.done};
}

// Wynik całego symulatora: liczą się 2 najlepsze rozmowy (trzecia jest bonusem / drugą szansą).
export function chatResult(value={}){
 const rows=scenarios.map(sc=>({id:sc.id,...scenarioScore(sc,value.scen?.[sc.id])}));
 const best=[...rows].sort((a,b)=>b.score-a.score).slice(0,REQUIRED);
 const score=best.reduce((s,r)=>s+r.score,0);
 const finished=rows.filter(r=>r.done);
 const flagsFound=rows.reduce((s,r)=>s+r.flags,0),flagsSeen=rows.reduce((s,r)=>s+r.resolved,0);
 const doneFlags=finished.reduce((s,r)=>s+r.flags,0),doneTotal=finished.length*DECISIONS;
 const started=scenarios.filter(sc=>value.scen?.[sc.id]).length;
 const flagsTotal=DECISIONS*Math.max(REQUIRED,started); // licznik „Wykryte flagi: X/Y”
 const done=finished.length>=REQUIRED;
 return {done,score,max:chatMax,finished:finished.length,flagsFound,flagsSeen,flagsTotal,
  summary:finished.length?`Rozmowy z oszustem: ${Math.min(finished.length,REQUIRED)}/${REQUIRED} przerwane${finished.length>REQUIRED?' + bonus':''}, flagi ${doneFlags}/${doneTotal}`:undefined};
}

// Zapis rozmowy do wyświetlenia: wiadomości, odpowiedzi ucznia, flagi po każdej decyzji.
export function transcript(sc,st){
 if(!st)return [];
 const out=[];let k=0;
 const meItem=o=>o.say?{who:'me',text:o.say}:{who:'act',text:o.text};
 for(const p of st.path){
  const node=sc.nodes[p.node],o=node.options[p.opt],r=st.res[p.node];
  for(const m of node.msgs)out.push({...m,key:`${p.node}-m${k++}`});
  out.push({...meItem(o),key:`${p.node}-me`});
  out.push({who:'flag',flag:node.flag,first:r.tries===1,pts:stepPts(r),key:`${p.node}-flag`});
  for(const m of o.reply||[])out.push({...m,key:`${p.node}-r${k++}`});
 }
 if(!st.done){const node=sc.nodes[st.node];for(const m of node.msgs)out.push({...m,key:`${st.node}-m${k++}`});
  if(st.fail){out.push({...meItem(node.options[st.fail.opt]),key:`${st.node}-fail`});}}
 return out;
}

// Wszystkie ścieżki od startu (do testów: każda ma DECISIONS decyzji i kończy się bezpiecznie).
export function paths(sc){
 const res=[];
 const walk=(id,acc)=>{const n=sc.nodes[id];
  for(const [i,o] of n.options.entries())if(o.safe){const next=[...acc,{node:id,opt:i}];o.next?walk(o.next,next):res.push(next);}};
 walk(sc.start,[]);return res;
}
