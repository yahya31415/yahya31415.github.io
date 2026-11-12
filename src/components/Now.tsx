import { now } from '../content'
import { ArrowOut } from './Icons'

export function Now() {
  return (
    <section id="now" className="section">
      <div className="wrap stack-lg">
        <div className="section-head">
          <h2 className="display xl" data-rv>Now</h2>
          <div className="label" data-sx>02 / What I'm building</div>
        </div>
        <div className="cards">
          {now.map((item, i) => (
            <article key={item.name} className="card now-card" data-rv style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="card-top mono">
                <span>{item.tag}</span>
                <span className={item.warm ? 'status warm' : 'status acc'}>
                  <span className="led" style={{ animationDelay: `${i * 0.4}s` }} />
                  {item.status}
                </span>
              </div>
              <h3 data-sx>{item.name}</h3>
              <p>{item.body}</p>
              {item.link ? (
                <a className="mono card-link" href={item.link.href}>{item.link.label} <ArrowOut /></a>
              ) : (
                <span className="mono card-link muted">{item.note}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
