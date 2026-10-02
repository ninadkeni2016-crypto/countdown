import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Countdown target: 4 October, 00:00 (viewer's local time). Change month (0-based) / day here.
const MONTH = 9, DAY = 4
const ease = [0.22, 1, 0.36, 1]
const rnd = (a, b) => a + Math.random() * (b - a)

function getTarget() {
  const now = new Date()
  let t = new Date(now.getFullYear(), MONTH, DAY)
  if (now - t > 864e5) t = new Date(now.getFullYear() + 1, MONTH, DAY)
  return t
}

function useCountdown() {
  const target = useMemo(getTarget, [])
  const calc = () => Math.max(0, target - new Date())
  const [ms, setMs] = useState(calc)
  useEffect(() => { const i = setInterval(() => setMs(calc()), 1000); return () => clearInterval(i) }, [])
  return {
    done: ms <= 0,
    parts: [
      ['Days', Math.floor(ms / 864e5)], ['Hours', Math.floor(ms / 36e5) % 24],
      ['Minutes', Math.floor(ms / 6e4) % 60], ['Seconds', Math.floor(ms / 1e3) % 60],
    ],
  }
}

function Petals() {
  const petals = useMemo(() => Array.from({ length: 14 }, () => ({
    x: rnd(0, 100), s: rnd(10, 22), d: rnd(16, 28), de: rnd(0, 12), r: rnd(0, 360), sw: rnd(20, 60) })), [])
  const dots = useMemo(() => Array.from({ length: 18 }, () => ({
    x: rnd(0, 100), y: rnd(0, 100), s: rnd(3, 7), d: rnd(4, 8), de: rnd(0, 4) })), [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((p, i) => (
        <motion.span key={'d' + i} className="absolute rounded-full bg-softpink"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, boxShadow: '0 0 18px 6px rgba(244,166,184,.45)' }}
          animate={{ opacity: [0, 0.7, 0], y: [0, -24] }}
          transition={{ duration: p.d, delay: p.de, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
      {petals.map((p, i) => (
        <motion.span key={i} className="absolute -top-8 block"
          style={{ left: `${p.x}%`, width: p.s, height: p.s * 1.3, borderRadius: '100% 0 100% 0', opacity: 0.55,
            background: 'linear-gradient(135deg,#FCE4EC,#F4A6B8)' }}
          initial={{ y: 0, rotate: p.r }}
          animate={{ y: '110vh', x: [0, p.sw, -p.sw, 0], rotate: p.r + 240 }}
          transition={{ duration: p.d, delay: p.de, repeat: Infinity, ease: 'linear' }} />
      ))}
    </div>
  )
}

const Mask = ({ children, delay = 0, className = '' }) => (
  <span className={`inline-block overflow-hidden pb-2 align-bottom ${className}`}>
    <motion.span className="inline-block" initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ duration: 1.3, delay, ease }}>{children}</motion.span>
  </span>
)

const fade = (delay) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, delay, ease } })

function Unit({ label, value, i }) {
  const v = String(value).padStart(2, '0')
  return (
    <motion.div {...fade(2 + i * 0.12)} className="rounded-[1.4rem] border border-softpink/40 bg-white/75 px-1 pb-4 pt-5 shadow-[0_24px_50px_-26px_rgba(217,107,136,.55)] backdrop-blur-md">
      <div className="relative mx-auto h-[1.1em] overflow-hidden font-serif text-[2.6rem] font-light tabular-nums leading-[1.1] sm:text-7xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={v} className="block" initial={{ y: '90%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-90%', opacity: 0 }} transition={{ duration: 0.7, ease }}>{v}</motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-2 pl-[0.3em] text-[9.5px] font-light uppercase tracking-[0.3em] text-rose sm:text-[11px]">{label}</p>
    </motion.div>
  )
}

export default function App() {
  const { done, parts } = useCountdown()
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-14 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #FCE4EC 0%, #FFF9FA 72%)' }}>
      <Petals />
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <motion.p {...fade(0.2)} className="text-[11px] font-light uppercase tracking-[0.38em] text-rose">Something beautiful is coming</motion.p>
        <h1 className="mt-7 font-serif text-[2.4rem] font-light leading-none sm:text-6xl">
          {(done ? ['It’s', 'today'] : ['Counting', 'down', 'to']).map((w, i) => <Mask key={w} delay={0.5 + i * 0.15} className="mr-3 last:mr-0">{w}</Mask>)}
        </h1>
        <motion.div initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, delay: 1, ease }} className="font-script text-[5.5rem] leading-[1.1] text-rose sm:text-[9rem]">
          Shreya <span className="font-serif text-[0.35em] text-softpink">♡</span>
        </motion.div>
        <motion.p {...fade(1.5)} className="mb-10 mt-3 font-serif text-lg italic text-wine/70 sm:text-2xl">
          {done ? 'Your surprise is ready.' : 'A little surprise is waiting for you.'}
        </motion.p>
        {!done && (
          <>
            <div className="grid w-full grid-cols-4 gap-2.5 sm:gap-4">
              {parts.map(([l, v], i) => <Unit key={l} label={l} value={v} i={i} />)}
            </div>
            <motion.p {...fade(2.6)} className="mt-10 flex items-center gap-4 font-serif text-xl italic text-rose">
              <span className="h-px w-9 bg-softpink/70" />4 October<span className="h-px w-9 bg-softpink/70" />
            </motion.p>
          </>
        )}
      </div>
    </main>
  )
}
