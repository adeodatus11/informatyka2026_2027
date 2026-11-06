// Numer tematu pochodzi z rozkładu szkoły, nie z pozycji w aktualnym katalogu.
// Stałe id nadal służy do adresów i zapisu odpowiedzi. Kursy dodatkowe nie zajmują numeru.
export function lessonTopicNumber(lesson) {
  return !lesson.externalUrl && Number.isInteger(lesson.order) && lesson.order > 0
    ? lesson.order
    : null;
}

export function lessonTopicLabel(lesson) {
  const number = lessonTopicNumber(lesson);
  return number === null ? 'Materiał dodatkowy' : `Temat ${number}`;
}
