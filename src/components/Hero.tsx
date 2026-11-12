import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowDown } from './Icons'

const istTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()) + ' IST'

function Clock() {
  const [time, setTime] = useState(istTime)
  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 20_000)
    return () => clearInterval(id)
  }, [])
  return <span className="acc">{time}</span>
}

const nameLines = [
  { word: 'Yahya', dir: -1, delay: '.1s' },
  { word: 'Ayash', dir: 1, delay: '.24s' },
  { word: 'Luqman', dir: -1, delay: '.38s' },
]

export function Hero() {
  return (
    <header className="hero">
      <canvas data-gl="blob" className="gl" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <nav className="nav mono">
        <a href="#page" className="brand"><span className="dot" />YAL</a>
        <div className="nav-links">
          <a className="mag" href="#now">Now</a>
          <a className="mag" href="#work">Work</a>
          <a className="mag" href="#tinkering">Tinkering</a>
          <a className="mag" href="#contact">Contact</a>
        </div>
        <div className="soft">Bengaluru <Clock /></div>
      </nav>

      <div className="hero-body">
        <div className="late herofade label" style={{ animationDelay: 'calc(var(--d) + .1s)' }}>
          Engineering manager + full-stack developer
        </div>
        <h1 className="name">
          {nameLines.map((l) => (
            <span key={l.word} className="ln" style={{ '--dir': l.dir } as CSSProperties}>
              <span className="word" style={{ animationDelay: `calc(var(--d) + ${l.delay})` }}>{l.word}</span>
            </span>
          ))}
        </h1>
        <div className="late herofade hero-foot" style={{ animationDelay: 'calc(var(--d) + .9s)' }}>
          <p>
            I design, build and ship software products end to end. Ten years of building for the web, mobile and
            everything underneath.
          </p>
          <div className="btns">
            <a className="btn primary mag" href="#work">View work <ArrowDown /></a>
            <a className="btn mag" href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </header>
  )
}
