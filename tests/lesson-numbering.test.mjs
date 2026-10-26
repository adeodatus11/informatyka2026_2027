import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {lessonTopicNumber, lessonTopicLabel} from '../content/lesson-numbering.js';
import {compareLessons} from '../content/lesson-order.js';

const lessons = await Promise.all(readdirSync(new URL('../content/lessons/', import.meta.url))
  .filter(file => /^\d.*\.js$/.test(file))
  .map(async file => (await import(new URL(`../content/lessons/${file}`, import.meta.url))).default));
const rows = JSON.parse(readFileSync(new URL('../docs/rozklad-2026-2027.json', import.meta.url), 'utf8'));

test('Numer tematu pozostaje zgodny z rozkładem mimo luk w katalogu', () => {
  for (const row of rows.filter(row => row.status === 'jest')) {
    for (const id of row.ids) {
      const lesson = lessons.find(lesson => lesson.id === id);
      assert.ok(lesson, `Brak lekcji ${id}`);
      assert.equal(lesson.grade, row.klasa, `${id}: klasa`);
      assert.equal(lessonTopicNumber(lesson), row.lp, `${id}: numer tematu`);
      assert.equal(lessonTopicLabel(lesson), `Temat ${row.lp}`);
    }
  }
  for (const [id, number] of [['09', 7], ['35', 18], ['44', 8], ['53', 17]]) {
    assert.equal(lessonTopicNumber(lessons.find(lesson => lesson.id === id)), number);
  }
});

test('Materiał dodatkowy nie zajmuje ani nie przesuwa numeru tematu', () => {
  const course = lessons.find(lesson => lesson.id === '34');
  assert.equal(lessonTopicNumber(course), null);
  assert.equal(lessonTopicLabel(course), 'Materiał dodatkowy');
  for (const lesson of [
    {id: 'extra', grade: 1, order: 6.5},
    {id: 'extra', grade: 1, order: 7, externalUrl: 'https://example.com/'},
    {id: 'extra', grade: 1}, {id: 'extra', grade: 1, order: 0}
  ]) assert.equal(lessonTopicLabel(lesson), 'Materiał dodatkowy');
  const chosen = lessons.filter(lesson => ['08', '34', '09'].includes(lesson.id)).sort(compareLessons);
  assert.deepEqual(chosen.map(lesson => lessonTopicLabel(lesson)), ['Temat 6', 'Materiał dodatkowy', 'Temat 7']);
});

test('Każda klasa ma jednoznaczne numery tematów; sortowanie i trwałe ID są niezależne', () => {
  for (const grade of [1, 2, 3]) {
    const items = lessons.filter(lesson => lesson.grade === grade).sort(compareLessons);
    const numbers = items.map(lessonTopicNumber).filter(number => number !== null);
    assert.equal(new Set(numbers).size, numbers.length, `Powtórzone tematy w klasie ${grade}`);
    assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b));
  }
  const snapshot = structuredClone(lessons.map(({id, grade, order}) => ({id, grade, order})));
  for (const lesson of lessons) lessonTopicLabel(lesson);
  assert.deepEqual(lessons.map(({id, grade, order}) => ({id, grade, order})), snapshot);
});
