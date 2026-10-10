import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { display } from '../styles/classes'

gsap.registerPlugin(ScrollTrigger)

export default function Statement() {
  const root = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const words = root.current.querySelectorAll('[data-statement-word]')
      if (reduced) return

      gsap.fromTo(
        words,
        { yPercent: 40, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        },
      )

      gsap.to(words, {
        x: (i) => (i === 0 ? -80 : i === 1 ? 50 : 90),
        y: (i) => (i === 1 ? -40 : 30),
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'center center',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.fromTo(
        '[data-statement-flash]',
        { opacity: 0 },
        {
          opacity: 0.45,
          yoyo: true,
          repeat: 1,
          duration: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: 'center 55%',
            once: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className="relative grid min-h-screen place-items-center overflow-hidden bg-bg"
      ref={root}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(210,230,255,0.5),transparent_48%)] opacity-0"
        data-statement-flash
        aria-hidden="true"
      />
      <h2 className={`${display} text-center text-[clamp(4.2rem,14vw,13rem)]`}>
        <span className="block" data-statement-word>
          WE TURN
        </span>
        <span className="block" data-statement-word>
          IDEAS INTO
        </span>
        <span className="block" data-statement-word>
          THUNDER.
        </span>
      </h2>
    </section>
  )
}
