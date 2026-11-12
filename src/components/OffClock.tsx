import { Fragment } from 'react'
import { offClock } from '../content'

type Item = { text: string; outline?: boolean; tone?: 'acc' | 'warm' }

function Row({ items, dir }: { items: Item[]; dir: 1 | -1 }) {
  return (
    <div className="mq mq-off" data-mq={dir} aria-hidden="true">
      <div className="mqt">
        {[0, 1].map((k) => (
          <Fragment key={k}>
            {items.map((it) => (
              <span key={it.text} className={[it.outline ? 'out' : '', it.tone ?? ''].join(' ').trim()}>{it.text}</span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export function OffClock() {
  return (
    <section id="off">
      <div className="label pad-x" data-sx>05 / Off the clock</div>
      {/* The marquees are decorative; this list is what screen readers get. */}
      <ul className="sr-only">{offClock.list.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="off-rows">
        <Row items={offClock.rowA} dir={-1} />
        <Row items={offClock.rowB} dir={1} />
      </div>
    </section>
  )
}
