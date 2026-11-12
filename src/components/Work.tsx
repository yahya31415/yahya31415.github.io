import { work } from '../content'
import { ArrowRight } from './Icons'
import { WorkViz } from './WorkViz'

const pad = (n: number) => String(n).padStart(2, '0')

export function Work() {
  return (
    <section id="work">
      <div className="pin-wrap">
        <div className="section-head work-head">
          <h2 className="display lg" data-rv>Selected work</h2>
          <div className="work-meta">
            <span className="label" data-sx>03 / Shipped</span>
            <div className="mono work-progress">
              <span><span id="pidx" className="bright">01</span> / {pad(work.length)}</span>
              <span className="progress" aria-hidden="true"><span /></span>
              <span className="pinhint">Keep scrolling <ArrowRight /></span>
            </div>
          </div>
        </div>
        <div className="pin-track">
          {work.map((w, i) => (
            <article key={w.title} className="panel">
              <div className="num out" aria-hidden="true">{pad(i + 1)}</div>
              <div className="panel-text">
                <div className="mono meta acc">{w.meta}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                {w.chips && (
                  <div className="chips mono">{w.chips.map((c) => <span key={c}>{c}</span>)}</div>
                )}
              </div>
              <WorkViz kind={w.viz} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
