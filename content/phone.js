const part=(id,name,position,explodedPosition,description,equivalent)=>({id,name,shortName:name,modelNode:id,position,explodedPosition,description,equivalent,focusDistance:({shell:9,display:9,thermal:8,board:7,battery:7})[id]||3.5});
export const phoneParts=[
 part('shell','Obudowa',[0,0,-.2],[-1.8,0,-.9],'Rama i tylna osłona chronią wnętrze oraz utrzymują podzespoły na miejscu.','Obudowa komputera'),
 part('display','Ekran dotykowy',[0,0,.3],[-2.4,0,1.5],'Wyświetla obraz i odczytuje dotyk. Łączy funkcję ekranu oraz urządzenia wejściowego.','Monitor + mysz lub panel dotykowy'),
 part('board','Płyta główna',[.61,.4,-.05],[.65,.4,.2],'Na małej płytce znajdują się układy i połączenia. Wiele części jest wlutowanych; nie ma dużych gniazd jak w komputerze stacjonarnym.','Płyta główna'),
 part('soc','Układ SoC: CPU i GPU',[.61,.65,.05],[1.7,1.45,1],'CPU wykonuje instrukcje, a GPU tworzy grafikę. W iPhonie są częścią jednego układu SoC, razem z innymi blokami obliczeniowymi. To nie oddzielna karta graficzna.','Procesor + układ graficzny'),
 part('ram','Pamięć RAM',[.61,.65,.12],[2.55,.55,1.4],'Przechowuje dane aplikacji używane teraz. Jest bardzo blisko układu SoC; pokazujemy ją osobno, aby wyjaśnić funkcję, a nie jako moduł do wyjęcia.','Pamięć RAM — bez wymiennych kości DIMM'),
 part('flash','Pamięć na pliki',[.61,-.35,.05],[2.25,-.6,1],'Pamięć flash zachowuje zdjęcia, aplikacje i system po wyłączeniu telefonu. Nie jest dyskiem SSD M.2 wkładanym do gniazda.','Rola podobna do SSD: trwały zapis danych'),
 part('battery','Akumulator',[-.35,-.35,.02],[-.35,-.55,1.65],'Magazynuje energię. Układy zarządzania zasilaniem dostarczają ją podzespołom. Sam akumulator nie jest odpowiednikiem całego zasilacza sieciowego.','Bateria laptopa + układy zasilania'),
 part('cameras','Aparaty',[-.42,1.45,.02],[-.55,2.6,.8],'Obiektywy kierują światło na matryce, które przekształcają je w dane obrazu. Układy telefonu dalej przetwarzają zdjęcie.','Kamera internetowa; urządzenie wejściowe'),
 part('thermal','Warstwa odprowadzająca ciepło',[0,.2,.2],[.1,.4,-1.25],'Ciepło z układów jest rozprowadzane przez warstwy przewodzące i konstrukcję telefonu. Ten schemat pokazuje chłodzenie pasywne, bez wentylatora.','Funkcja chłodzenia procesora'),
 part('audio','Głośnik i port ładowania',[0,-1.95,.02],[.15,-2.6,.65],'Głośnik zamienia sygnał w dźwięk. Port służy do podłączenia przewodu do ładowania i przesyłania danych.','Głośniki + port USB')
];
