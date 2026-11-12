import { timeline } from '../content'

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap about">
        <div className="label" data-sx>01 / About</div>
        <p className="lede">
          <span className="fill" data-fill>
            I've been building software professionally since 2016. Today I lead the tech team at National Group, a
            76-year-old Karnataka conglomerate, and head Kote, its technology consultancy.
          </span>
        </p>
        <div className="about-cols">
          <p className="muted-p" data-rv>
            I work across the whole stack: Go, React, Svelte, Flutter, Swift, Laravel, PostgreSQL, and the servers they
            run on. Originally from Kozhikode, Kerala.
          </p>
          <ol className="timeline">
            {timeline.map((t, i) => (
              <li key={t.org} data-rv style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className={`mono years${i === 0 ? ' acc' : ''}`}>{t.years}</span>
                <span>
                  <strong>{t.org}</strong>
                  <em>{t.role}</em>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
