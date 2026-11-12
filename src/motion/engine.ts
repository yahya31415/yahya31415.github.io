// One requestAnimationFrame loop drives every scroll- and pointer-linked effect.
// It only writes CSS custom properties; styles.css decides what they do.
//
// Hooks it looks for inside the page element:
//   canvas[data-gl="blob|terrain"]  shader backgrounds
//   [data-rv]       fade/slide in when scrolled into view
//   [data-sx]       text decodes from scrambled characters on entry
//   [data-fill]     text lights up left to right with scroll progress
//   [data-mq="±1"]  marquee whose speed, skew and direction follow scroll
//   .card           3D tilt and glow under the pointer
//   .mag            magnetic pull toward the pointer
//   #work           pinned horizontal section (.pin-track, .panel, #pidx)
//   #fan, #cur, #bar

import { drawLayer, hexToRgb, makeLayer, type Layer, type LayerKind, type RGB } from './gl'

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const SCRAMBLE = '<>-_/[]=+*#01XA'
const WARM: RGB = [1, 0.541, 0.298]

type Marquee = { track: HTMLElement; dir: number; x: number; half: number }

export function startEngine(page: HTMLElement): () => void {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const q = <T extends Element = HTMLElement>(s: string) => page.querySelector<T>(s)
  const qa = <T extends Element = HTMLElement>(s: string) => Array.from(page.querySelectorAll<T>(s))

  let alive = true
  let raf = 0
  const t0 = performance.now()
  const accent = hexToRgb(getComputedStyle(page).getPropertyValue('--acc'), [0.776, 0.949, 0.306])

  // Shaders
  const layers: Layer[] = []
  for (const canvas of qa<HTMLCanvasElement>('canvas[data-gl]')) {
    const layer = makeLayer(canvas, canvas.dataset.gl as LayerKind)
    if (layer) layers.push(layer)
  }

  // Elements
  const marquees: Marquee[] = qa('[data-mq]').flatMap((el) => {
    const track = el.firstElementChild as HTMLElement | null
    return track ? [{ track, dir: Number(el.dataset.mq) || 1, x: 0, half: 0 }] : []
  })
  const fills = qa('[data-fill]').map((el) => ({ el, p: -1 }))
  const mags = qa('.mag')
  const panels = qa('.panel').map((el) => ({ el, o: 2 }))
  const fan = q<SVGGElement>('#fan')
  const cursor = q('#cur')
  const bar = q('#bar')
  const section = q('#work')
  const track = q('.pin-track')
  const counter = q('#pidx')

  // State
  let px = 0, py = 0, hasPointer = false, overTarget = false
  let cx = -100, cy = -100
  let lastY: number | null = null
  let vel = 0, dirn = 1, hp = 0, rot = 0, frame = 0
  let pinDist = 0, pinCur = 0, bestPanel = -1
  let tilted: HTMLElement | null = null

  // Observers
  const visIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const layer = layers.find((l) => l.canvas === e.target)
      if (layer) layer.visible = e.isIntersecting
    }
  })
  layers.forEach((l) => visIO.observe(l.canvas))

  const revealIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.setAttribute('data-in', '')
        revealIO.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  page.setAttribute('data-armed', '')
  qa('[data-rv]').forEach((el) => revealIO.observe(el))

  const scramble = (el: Element) => {
    const node = el.firstChild
    if (still || !node || node.nodeType !== Node.TEXT_NODE || el.childNodes.length !== 1) return
    const final = node.nodeValue ?? ''
    const start = performance.now()
    const step = () => {
      const k = (performance.now() - start) / 800
      if (!alive || k >= 1) {
        node.nodeValue = final
        return
      }
      const lim = Math.floor(k * final.length)
      let out = ''
      for (let i = 0; i < final.length; i++) {
        const ch = final[i]
        out += i < lim || ch === ' ' ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }
      node.nodeValue = out
      requestAnimationFrame(step)
    }
    step()
  }
  const scrambleIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        scrambleIO.unobserve(e.target)
        scramble(e.target)
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  )
  qa('[data-sx]').forEach((el) => scrambleIO.observe(el))

  // Pinned horizontal section: only on wide screens with motion allowed.
  const layout = () => {
    if (!section || !track) return
    if (!still && window.innerWidth >= 900) {
      section.setAttribute('data-pin', '')
      const dist = track.scrollWidth - track.clientWidth
      if (dist > 60) {
        pinDist = dist
        section.style.height = `${window.innerHeight + dist}px`
        return
      }
    }
    pinDist = 0
    section.removeAttribute('data-pin')
    section.style.height = ''
    track.style.removeProperty('--tx')
    section.style.removeProperty('--pp')
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || still) return
    px = e.clientX
    py = e.clientY
    hasPointer = true
    const target = e.target instanceof Element ? e.target : null
    const card = target?.closest<HTMLElement>('.card') ?? null
    if (tilted && tilted !== card) {
      tilted.style.setProperty('--rx', '0deg')
      tilted.style.setProperty('--ry', '0deg')
      tilted.style.setProperty('--gx', '-600px')
      tilted.style.setProperty('--gy', '-600px')
    }
    tilted = card
    if (card) {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--rx', `${((0.5 - (py - r.top) / r.height) * 9).toFixed(2)}deg`)
      card.style.setProperty('--ry', `${(((px - r.left) / r.width - 0.5) * 11).toFixed(2)}deg`)
      card.style.setProperty('--gx', `${px - r.left}px`)
      card.style.setProperty('--gy', `${py - r.top}px`)
    }
    overTarget = !!target?.closest('a, button, .card')
    for (const m of mags) {
      const r = m.getBoundingClientRect()
      const dx = px - (r.left + r.width / 2)
      const dy = py - (r.top + r.height / 2)
      const reach = Math.max(r.width, r.height) / 2 + 50
      const near = Math.abs(dx) < reach && Math.abs(dy) < reach
      m.style.setProperty('--mx', near ? `${(dx * 0.28).toFixed(1)}px` : '0px')
      m.style.setProperty('--my', near ? `${(dy * 0.28).toFixed(1)}px` : '0px')
    }
  }

  const tick = () => {
    if (!alive) return
    raf = requestAnimationFrame(tick)
    frame++
    if (frame % 120 === 0) layout()

    const ih = window.innerHeight
    const iw = window.innerWidth
    const rect = page.getBoundingClientRect()
    const y = -rect.top
    const dy = lastY === null ? 0 : y - lastY
    lastY = y
    if (dy > 0.5) dirn = 1
    else if (dy < -0.5) dirn = -1
    vel += (dy - vel) * 0.18
    const speed = Math.min(Math.abs(vel), 80)

    // Hero: 0 at the top, 1 after one viewport of scroll.
    hp += ((still ? 0 : clamp(y / ih)) - hp) * 0.14
    page.style.setProperty('--hp', hp.toFixed(4))

    const total = rect.height - ih
    bar?.style.setProperty('--sp', total > 0 ? clamp(y / total).toFixed(4) : '0')

    if (!still) {
      const skew = clamp(vel * 0.35, -14, 14)
      for (const m of marquees) {
        if (!m.half || frame % 120 === 1) m.half = m.track.scrollWidth / 2
        m.x += m.dir * dirn * (1.1 + speed * 0.55)
        if (m.half > 0) m.x = ((m.x % m.half) + m.half) % m.half
        m.track.style.setProperty('--x', `${(-m.x).toFixed(1)}px`)
        m.track.style.setProperty('--sk', `${(m.dir * skew).toFixed(2)}deg`)
      }
      rot = (rot + 3 + speed * 1.6) % 360
      fan?.style.setProperty('--rot', `${rot.toFixed(1)}deg`)
    }

    for (const f of fills) {
      const r = (f.el.parentElement ?? f.el).getBoundingClientRect()
      const target = still ? 1 : clamp((ih * 0.82 - r.top) / (r.height + ih * 0.3))
      f.p = f.p < 0 ? target : f.p + (target - f.p) * 0.16
      f.el.style.setProperty('--p', `${(f.p * 100).toFixed(2)}%`)
    }

    if (pinDist && section && track) {
      const pp = clamp(-section.getBoundingClientRect().top / pinDist)
      pinCur += (pp - pinCur) * 0.12
      track.style.setProperty('--tx', `${(-pinCur * pinDist).toFixed(1)}px`)
      section.style.setProperty('--pp', pinCur.toFixed(4))
    }

    // Each panel knows how far it is from the centre of the screen (-1..1).
    let best = 0
    let bestDist = 9
    panels.forEach((p, i) => {
      let o = 0
      if (!still) {
        const r = p.el.getBoundingClientRect()
        o = clamp((r.left + r.width / 2 - iw / 2) / iw, -1, 1)
      }
      if (Math.abs(o) < bestDist) {
        bestDist = Math.abs(o)
        best = i
      }
      if (p.o !== o) {
        p.o = o
        p.el.style.setProperty('--o', o.toFixed(4))
        p.el.style.setProperty('--oa', Math.abs(o).toFixed(4))
      }
    })
    if (counter && best !== bestPanel) {
      bestPanel = best
      counter.textContent = String(best + 1).padStart(2, '0')
    }

    if (cursor && hasPointer) {
      cx += (px - cx) * 0.22
      cy += (py - cy) * 0.22
      cursor.style.opacity = '1'
      cursor.style.setProperty('--cx', `${cx.toFixed(1)}px`)
      cursor.style.setProperty('--cy', `${cy.toFixed(1)}px`)
      cursor.style.setProperty('--cs', overTarget ? '3.6' : '1')
    }

    const time = still ? 40 : (performance.now() - t0) / 1000 + 40
    for (const l of layers) {
      drawLayer(l, {
        time,
        color: l.kind === 'blob' ? accent : WARM,
        scroll: hp,
        pointerX: px,
        pointerY: py,
        hasPointer,
        still,
      })
    }
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('resize', layout)
  layout()
  tick()

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', layout)
    visIO.disconnect()
    revealIO.disconnect()
    scrambleIO.disconnect()
    page.removeAttribute('data-armed')
    section?.removeAttribute('data-pin')
    if (section) section.style.height = ''
  }
}
