const lines = [
  'CPU      Ryzen 5 7600X ............... OK',
  'GPU      RTX 4060 .................... OK',
  'UPTIME   shipping since 2016 ......... OK',
  'COFFEE   specialty ................... OK',
]

export function Boot({ onDone }: { onDone: () => void }) {
  return (
    <div
      className="boot mono"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === 'bootout') onDone()
      }}
    >
      <div className="bl acc" style={{ animationDelay: '.05s' }}>YAL SYSTEM BOARD   POWER-ON SELF TEST</div>
      {lines.map((line, i) => (
        <div key={line} className="bl" style={{ animationDelay: `${0.35 + i * 0.25}s` }}>{line}</div>
      ))}
      <div className="bl bright" style={{ animationDelay: '1.35s' }}>
        LOADING  portfolio<span className="caret">_</span>
      </div>
      <div className="bootbar"><div /></div>
    </div>
  )
}
