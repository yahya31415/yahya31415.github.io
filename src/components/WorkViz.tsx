import type { WorkViz as Kind } from '../content'

const bars = [60, 80, 50, 70, 90, 54, 74, 42, 82, 62, 46, 78, 58, 86, 50, 66]
const delays = [0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.6, 1, 0.4, 0.8, 0.15, 0.55, 0.95, 0.35, 0.75, 0.25]

function Calls() {
  return (
    <div className="pviz viz-box mono">
      <div className="viz-row"><span>Call audio</span><span className="acc"><span className="led-dot">●</span> Live</span></div>
      <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none" fill="var(--acc)">
        {bars.map((h, i) => (
          <rect key={i} className="wv" x={4 + i * 20} y={(90 - h) / 2} width="8" height={h} style={{ animationDelay: `-${delays[i]}s` }} />
        ))}
      </svg>
      <div>Transcript</div>
      <div className="viz-lines">
        <span className="ty" style={{ width: '92%' }} />
        <span className="ty" style={{ width: '74%', animationDelay: '.5s' }} />
        <span className="ty warm-bg" style={{ width: '58%', animationDelay: '1s' }} />
      </div>
    </div>
  )
}

function Phone() {
  return (
    <div className="pviz viz-center">
      <svg width="230" height="400" viewBox="0 0 230 400" fill="none">
        <rect x="2" y="2" width="226" height="396" rx="34" fill="#0B0D10" stroke="#4A525D" strokeWidth="2" />
        <rect x="84" y="14" width="62" height="10" rx="5" fill="#232830" />
        <rect x="18" y="40" width="194" height="230" rx="16" fill="#12151A" stroke="#232830" strokeWidth="2" />
        <circle cx="115" cy="128" r="34" stroke="#ECEFF2" strokeWidth="2" />
        <path d="M55 250c0-36 26-58 60-58s60 22 60 58" stroke="#ECEFF2" strokeWidth="2" />
        <circle className="ring" cx="115" cy="128" r="60" stroke="var(--acc)" strokeWidth="2" />
        <rect x="150" y="196" width="52" height="64" rx="8" fill="#0B0D10" stroke="var(--acc)" strokeWidth="2" />
        <circle cx="176" cy="220" r="9" stroke="var(--acc)" strokeWidth="2" />
        <path d="M160 252c0-10 7-16 16-16s16 6 16 16" stroke="var(--acc)" strokeWidth="2" />
        <path d="M18 300h40l10-18 14 36 12-26 8 8h110" stroke="#232830" strokeWidth="2" />
        <path className="ecg" d="M18 300h40l10-18 14 36 12-26 8 8h110" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="352" r="20" stroke="#4A525D" strokeWidth="2" />
        <circle cx="115" cy="352" r="20" fill="#FF8A4C" />
        <path d="M105 354c6-6 14-6 20 0" stroke="#0B0D10" strokeWidth="3" strokeLinecap="round" />
        <circle cx="160" cy="352" r="20" stroke="#4A525D" strokeWidth="2" />
      </svg>
    </div>
  )
}

function Mirror() {
  const lines = (
    <span className="wire-lines"><span /><span /><span /></span>
  )
  return (
    <div className="pviz viz-mirror mono">
      <div className="wire slideL"><span className="wire-img acc-bg" />{lines}<span>LTR</span></div>
      <svg className="flip acc" width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 12h22M22 6l6 6-6 6M28 22H6M12 16l-6 6 6 6" />
      </svg>
      <div className="wire rtl slideR"><span className="wire-img warm-bg" />{lines}<span>RTL</span></div>
    </div>
  )
}

function Furniture() {
  return (
    <div className="pviz viz-center">
      <svg width="100%" height="300" viewBox="0 0 340 300" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ maxWidth: 380 }}>
        <path className="draw" pathLength="1" d="M20 262H320" stroke="#4A525D" strokeWidth="2" />
        <path className="draw" pathLength="1" d="M52 262V96c0-10 6-16 14-16s14 6 14 16v84h70v82M80 180v82M52 150h28" stroke="var(--acc)" strokeWidth="3" />
        <path className="draw" pathLength="1" d="M176 150H312M190 150V262M298 150V262M190 196H298" stroke="#ECEFF2" strokeWidth="3" />
        <path className="draw" pathLength="1" d="M232 150c-8-14-8-30 4-40c-2-16 6-30 18-36c2 14 10 22 8 38c10 10 8 26 0 38" stroke="#FF8A4C" strokeWidth="3" />
        <path className="draw" pathLength="1" d="M176 284H312M176 278v12M312 278v12" stroke="#9AA3AD" strokeWidth="1.5" />
        <path className="draw" pathLength="1" d="M30 80V262M24 80h12M24 262h12" stroke="#9AA3AD" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

const map = { calls: Calls, phone: Phone, mirror: Mirror, furniture: Furniture }

export function WorkViz({ kind }: { kind: Kind }) {
  const Viz = map[kind]
  return (
    <div className="viz-slot" aria-hidden="true">
      <Viz />
    </div>
  )
}
