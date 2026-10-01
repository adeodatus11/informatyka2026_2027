import {compareLessons} from '../lesson-order.js';
const modules = import.meta.glob('./[0-9]*.js', {eager:true, import:'default'});
export const lessons = Object.values(modules).sort(compareLessons);
