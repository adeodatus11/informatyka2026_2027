export const note = (duration, teacherNotes, askStudents, expectedAnswers, commonMistakes, optionalExtension, skipIfShortOnTime = false) => ({duration, teacherNotes, askStudents, expectedAnswers, commonMistakes, optionalExtension, skipIfShortOnTime});
export const choice = (id, question, options, correct, explanation, hint) => ({type:'choice', id, question, options, correct, explanation, hint: hint || 'Wróć do sytuacji z pytania i wybierz najprostsze uzasadnienie.'});
export const reveal = (id, cards) => ({type:'reveal', id, cards});
export const video = (id, title, duration) => ({type:'video', id, title, duration, file:null, poster:null, captions:null, transcript:null});
