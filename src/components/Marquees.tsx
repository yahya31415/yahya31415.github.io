import { Fragment } from 'react'
import { stack } from '../content'

// Content is rendered twice so the track can loop seamlessly.
const twice = [0, 1]

export function Marquees() {
  return (
    <div aria-hidden="true">
      <div className="mq mq-big" data-mq="1">
        <div className="mqt">
          {twice.map((k) => (
            <Fragment key={k}>
              <span className="out">Design</span>
              <span className="acc">Build</span>
              <span className="out">Ship</span>
              <span>Repeat</span>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mq mq-stack mono" data-mq="-1">
        <div className="mqt">
          {twice.map((k) =>
            stack.map((s) => (
              <Fragment key={`${k}-${s}`}>
                <span>{s}</span>
                <span className="acc">/</span>
              </Fragment>
            )),
          )}
        </div>
      </div>
    </div>
  )
}
