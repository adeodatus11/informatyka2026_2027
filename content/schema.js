export const note = (duration, teacherNotes, askStudents, expectedAnswers, commonMistakes, optionalExtension, skipIfShortOnTime = false) => ({duration, teacherNotes, askStudents, expectedAnswers, commonMistakes, optionalExtension, skipIfShortOnTime});
export const choice = (id, question, options, correct, explanation, hint) => ({type:'choice', id, question, options, correct, explanation, hint: hint || 'Wróć do sytuacji z pytania i wybierz najprostsze uzasadnienie.'});
export const reveal = (id, cards) => ({type:'reveal', id, cards});
const quickGuides={
 video02:['Rozpakuj ZIP przed pracą. Utwórz trzy foldery i przenieś do nich pliki według rozszerzeń.','Nadaj opisowe nazwy, spakuj folder ponownie i otwórz nowy ZIP, aby sprawdzić strukturę.'],
 video03:['Sprawdź zasilanie projektora i wybrane wejście. Upewnij się, że kabel jest prawidłowo podłączony.','W Windows sprawdź Win+P. Przy adapterze USB-C potwierdź w specyfikacji obsługę obrazu przez port.'],
 video04:['Sprawdź wyciszenie i głośność w systemie oraz w odtwarzaczu.','Wybierz właściwe urządzenie wyjściowe. Przy HDMI dźwięk może być kierowany do projektora zamiast głośników laptopa.'],
 video05:['Sprawdź wybraną drukarkę, zasilanie, papier i komunikat urządzenia.','Sprawdź kolejkę wydruku. Nie wysyłaj wielu kopii; błąd połączenia lub zacięcie zgłoś nauczycielowi.'],
 video06:['Telefon ustala lub przyjmuje miejsce odbioru i wysyła zamówienie przez internet do serwera usługi.','Serwer przekazuje zgłoszenie do aplikacji kierowcy. Sama lokalizacja GPS nie wysyła zamówienia.']
};
export const video = (id, title) => ({type:'reveal',id,cards:[{title:'Krótka instrukcja: '+title,icon:'book',short:'Wykonaj i sprawdź',text:(quickGuides[id]||['Przeczytaj instrukcję w tym etapie i sprawdź efekt na swoim urządzeniu.']).join(' ')}]});
