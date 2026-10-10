import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '../data/site'
import { wrap } from '../styles/classes'

gsap.registerPlugin(ScrollTrigger)

export default function Stats() {
  const root = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      root.current.querySelectorAll('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: reduced ? 0.01 : 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}`
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-bg py-[10vh]" ref={root}>
      <div className={wrap}>
        <div
          className="mb-11 h-px bg-[linear-gradient(90deg,transparent,#3d9eff,#c9a86c,#3d9eff,transparent)] shadow-[0_0_16px_rgba(61,158,255,0.35)]"
          aria-hidden="true"
        />
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <p className="m-0 font-display text-[clamp(3.2rem,6vw,6rem)] leading-[0.85]">
                <span data-count={stat.value}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-3 text-[0.68rem] tracking-[0.16em] text-muted">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
