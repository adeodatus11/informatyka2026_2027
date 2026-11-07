import React from 'react';
import {additionalCourses} from '../content/additional-courses.js';
import {Icon} from './icons.jsx';

export function AdditionalLessons(){
  return <main id="main" tabIndex={-1} className="home additional-lessons">
    <header className="additional-heading">
      <p className="eyebrow">Pozaplanowe · dla uczniów wszystkich klas</p>
      <h1>Lekcje dodatkowe</h1>
      <p className="lead">Kursy do samodzielnego odkrywania poza planem lekcji. Wybierz temat, który Cię interesuje.</p>
      <p className="muted">Materiały są dostępne na platformie OSE IT Szkoła. Każdy kurs otwiera się w nowej karcie.</p>
    </header>
    <section className="additional-grid" aria-label="Dodatkowe kursy dla uczniów">
      {additionalCourses.map(course=><a key={course.id} className="lesson-card" href={course.url} target="_blank" rel="noopener noreferrer">
        <div className="card-content">
          <div className="card-meta"><span>Lekcja dodatkowa · pozaplanowa</span></div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <div className="card-bottom"><span>Otwórz kurs dla uczniów</span><Icon name="right" size={20}/></div>
          <small className="additional-provider">OSE IT Szkoła · nowa karta ↗</small>
        </div>
      </a>)}
    </section>
  </main>;
}
