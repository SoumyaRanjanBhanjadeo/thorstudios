import { useState } from 'react'
import { clients } from '../data/site'
import { display, eyebrow, wrap } from '../styles/classes'

export default function Clients() {
  const row = [...clients, ...clients]
  const [paused, setPaused] = useState(false)

  return (
    <section className="relative overflow-hidden bg-bg py-[8vh] pb-[10vh]">
      <div className={wrap}>
        <p className={eyebrow}>ALLIES</p>
        <h2 className={`${display} mb-10 text-[clamp(2.4rem,6vw,5.2rem)]`}>Play Without Limits.</h2>
      </div>
      <div
        className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`flex w-max gap-14 animate-marquee ${paused ? '[animation-play-state:paused]' : ''}`}>
          {row.map((name, i) => (
            <span
              className="relative font-display text-[clamp(1.6rem,3vw,2.4rem)] tracking-[0.08em] text-ink/25 transition-colors hover:text-ink group"
              key={`${name}-${i}`}
            >
              {name}
              <i className="absolute top-1/2 left-[-10%] h-px w-0 bg-[linear-gradient(90deg,transparent,#6ec8ff,transparent)] transition-[width] duration-500 group-hover:w-[120%]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
