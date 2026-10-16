// Lekcje z programem pakietu Office zainstalowanym na komputerze (workspace w danych lekcji).
// name — mianownik, gen — dopełniacz („obok Worda”), loc — miejscownik („w Wordzie”).
export const DESKTOP_APPS={
 'desktop-word':{name:'Word',gen:'Worda',loc:'Wordzie',file:'dokument startowy'},
 'desktop-excel':{name:'Excel',gen:'Excela',loc:'Excelu',file:'skoroszyt startowy'},
 'desktop-powerpoint':{name:'PowerPoint',gen:'PowerPointa',loc:'PowerPoincie',file:'plik startowy prezentacji'}
};
export const desktopApp=workspace=>DESKTOP_APPS[workspace]||null;
