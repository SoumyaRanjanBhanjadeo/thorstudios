import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { services } from '../data/site'
import { display, eyebrow, wrap } from '../styles/classes'

export default function Services() {
  const root = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const ctx = gsap.context(() => {
      gsap.from('[data-service]', {
        y: reduced ? 0 : 40,
        opacity: 0,
        stagger: 0.08,
        duration: reduced ? 0.01 : 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      })
    }, root)

    if (reduced || coarse) {
      return () => ctx.revert()
    }

    const cleanups = []
    root.current.querySelectorAll('[data-service]').forEach((item) => {
      const extra = item.querySelector('[data-service-extra]')
      const bolt = item.querySelector('[data-service-bolt]')
      const obj = item.querySelector('[data-service-object]')

      const enter = () => {
        gsap.to(item, { backgroundColor: 'rgba(61, 158, 255, 0.06)', duration: 0.35 })
        gsap.to(extra, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out' })
        gsap.fromTo(bolt, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out' })
        gsap.to(obj, { opacity: 1, rotate: 25, scale: 1, duration: 0.5, ease: 'power3.out' })
      }
      const leave = () => {
        gsap.to(item, { backgroundColor: 'transparent', duration: 0.35 })
        gsap.to(extra, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' })
        gsap.to(bolt, { scaleX: 0, duration: 0.3 })
        gsap.to(obj, { opacity: 0, rotate: 0, scale: 0.6, duration: 0.35 })
      }

      item.addEventListener('mouseenter', enter)
      item.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        item.removeEventListener('mouseenter', enter)
        item.removeEventListener('mouseleave', leave)
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])

  return (
    <section className="relative bg-bg py-[10vh] pb-[12vh]" id="services" ref={root}>
      <div className={wrap}>
        <p className={eyebrow}>CAPABILITIES</p>
        <h2 className={display}>
          OUR
          <br />
          POWERS
        </h2>
        <ul className="mt-12 list-none p-0">
          {services.map((service) => (
            <li
              key={service.id}
              className="relative overflow-hidden border-t border-ink/10 px-1.5 py-6 last:border-b"
              data-service
              data-cursor="button"
              data-cursor-label="VIEW"
            >
              <div
                className="absolute right-0 bottom-0 left-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#6ec8ff,#c9a86c,transparent)]"
                data-service-bolt
              />
              <div className="grid grid-cols-[2.6rem_1fr] items-center gap-4 md:grid-cols-[4.2rem_1fr_auto]">
                <span className="font-serif tracking-[0.18em] text-gold">{service.id}</span>
                <h3 className="m-0 font-display text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[0.95] tracking-[0.04em]">
                  {service.title}
                </h3>
                <div
                  className="hidden size-10.5 rotate-45 scale-[0.6] border border-gold opacity-0 shadow-[inset_0_0_18px_rgba(61,158,255,0.35)] md:block"
                  aria-hidden="true"
                  data-service-object
                />
              </div>
              <div className="h-0 overflow-hidden opacity-0 max-md:h-auto max-md:opacity-100" data-service-extra>
                <p className="mt-3.5 mb-1 max-w-2xl ml-[2.6rem] text-muted md:ml-[5.2rem]">{service.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
