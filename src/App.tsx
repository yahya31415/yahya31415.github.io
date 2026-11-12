import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { startEngine } from './motion/engine'
import { Boot } from './components/Boot'
import { Hero } from './components/Hero'
import { Marquees } from './components/Marquees'
import { About } from './components/About'
import { Now } from './components/Now'
import { Work } from './components/Work'
import { Tinkering } from './components/Tinkering'
import { OffClock } from './components/OffClock'
import { Contact } from './components/Contact'

const BOOT_KEY = 'yal-booted'

// The boot screen plays once per browser session, and never with reduced motion.
function shouldBoot() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(BOOT_KEY) === null
  } catch {
    return true
  }
}

export default function App() {
  const page = useRef<HTMLDivElement>(null)
  const [booting, setBooting] = useState(shouldBoot)
  // Hero entrance waits for the boot screen to clear.
  const [delay] = useState(() => (booting ? '2.45s' : '.1s'))

  useEffect(() => {
    if (page.current) return startEngine(page.current)
  }, [])

  const bootDone = () => {
    setBooting(false)
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* private mode: just replay next time */
    }
  }

  return (
    <div id="page" ref={page} style={{ '--d': delay } as CSSProperties}>
      {booting && <Boot onDone={bootDone} />}
      <div id="bar" aria-hidden="true" />
      <div id="cur" aria-hidden="true" />
      <Hero />
      <Marquees />
      <main>
        <About />
        <Now />
        <Work />
        <Tinkering />
        <OffClock />
      </main>
      <Contact />
    </div>
  )
}
