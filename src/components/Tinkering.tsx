import type { ReactNode } from 'react'
import { tinkering, type TinkerIcon } from '../content'

const icons: Record<TinkerIcon, ReactNode> = {
  fan: (
    <svg className="fan-svg" aria-hidden="true" width="190" height="190" viewBox="0 0 150 150" fill="none">
      <rect x="3" y="3" width="144" height="144" rx="14" stroke="#4A525D" strokeWidth="2" />
      {[[14, 14], [136, 14], [14, 136], [136, 136]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#4A525D" />
      ))}
      <circle cx="75" cy="75" r="60" stroke="#232830" strokeWidth="2" />
      <g id="fan" className="fan">
        <circle cx="75" cy="75" r="58" fill="none" />
        <path d="M75 75C70 50 82 28 100 22C104 44 96 64 75 75Z" fill="var(--acc)" />
        <path d="M75 75C100 70 122 82 128 100C106 104 86 96 75 75Z" fill="var(--acc)" opacity=".8" />
        <path d="M75 75C80 100 68 122 50 128C46 106 54 86 75 75Z" fill="var(--acc)" />
        <path d="M75 75C50 80 28 68 22 50C44 46 64 54 75 75Z" fill="var(--acc)" opacity=".8" />
      </g>
      <circle cx="75" cy="75" r="11" fill="#0B0D10" stroke="var(--acc)" strokeWidth="2" />
    </svg>
  ),
  rack: (
    <svg aria-hidden="true" width="120" height="84" viewBox="0 0 120 84" fill="none">
      {[1, 31, 61].map((y) => (
        <rect key={y} x="1" y={y} width="118" height="22" stroke="#4A525D" strokeWidth="2" />
      ))}
      <circle className="led" cx="14" cy="12" r="4" fill="var(--acc)" />
      <circle className="led" cx="28" cy="12" r="4" fill="var(--acc)" style={{ animationDelay: '.5s' }} />
      <circle className="led" cx="14" cy="42" r="4" fill="var(--acc)" style={{ animationDelay: '.9s' }} />
      <circle className="led" cx="28" cy="42" r="4" fill="#FF8A4C" style={{ animationDelay: '.2s' }} />
      <circle className="led" cx="14" cy="72" r="4" fill="var(--acc)" style={{ animationDelay: '.3s' }} />
      <circle className="led" cx="28" cy="72" r="4" fill="var(--acc)" style={{ animationDelay: '1.1s' }} />
      <path d="M50 12h56M50 42h56M50 72h56" stroke="#232830" strokeWidth="6" />
    </svg>
  ),
  terminal: (
    <div className="term mono" aria-hidden="true">
      <div>$ run model --local</div>
      <div className="acc">thinking<span className="caret">_</span></div>
    </div>
  ),
  home: (
    <svg aria-hidden="true" width="84" height="84" viewBox="0 0 84 84" fill="none">
      <circle className="ring" cx="42" cy="42" r="40" stroke="var(--acc)" strokeWidth="2" />
      <circle className="ring" cx="42" cy="42" r="40" stroke="var(--acc)" strokeWidth="2" style={{ animationDelay: '1.2s' }} />
      <path d="M26 44L42 30l16 14v14H26z" stroke="#ECEFF2" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  pad: (
    <svg className="bob" aria-hidden="true" width="132" height="84" viewBox="0 0 132 84" fill="none">
      <path d="M34 12h64c16 0 26 18 30 44c2 14-10 22-20 12L96 56H36L24 68C14 78 2 70 4 56C8 30 18 12 34 12z" stroke="#4A525D" strokeWidth="2" />
      <path d="M34 28v20M24 38h20" stroke="#ECEFF2" strokeWidth="5" />
      <circle className="led" cx="98" cy="30" r="5" fill="var(--acc)" />
      <circle className="led" cx="110" cy="40" r="5" fill="#FF8A4C" style={{ animationDelay: '.35s' }} />
      <circle className="led" cx="86" cy="40" r="5" fill="var(--acc)" style={{ animationDelay: '.7s' }} />
      <circle className="led" cx="98" cy="50" r="5" fill="#ECEFF2" style={{ animationDelay: '1.05s' }} />
    </svg>
  ),
}

export function Tinkering() {
  return (
    <section id="tinkering" className="section">
      <div className="wrap stack-lg">
        <div className="section-head end">
          <div className="stack-sm">
            <h2 className="display lg" data-rv>The tinkering</h2>
            <p className="muted-p" data-rv>I like knowing how the whole machine works, not just the code on top.</p>
          </div>
          <div className="label" data-sx>04 / After hours</div>
        </div>
        <div className="cards">
          {tinkering.map((t, i) => (
            <article key={t.title} className={`card tile${t.wide ? ' wide' : ''}`} data-rv style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
              {icons[t.icon]}
              <div className="tile-text">
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                {t.chips && <div className="chips mono">{t.chips.map((c) => <span key={c}>{c}</span>)}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
