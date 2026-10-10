import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/site'
import ProjectVisual from '../components/ProjectVisual'
import ProjectModal from '../components/ProjectModal'
import { display, eyebrow, wrap } from '../styles/classes'

gsap.registerPlugin(ScrollTrigger)

export default function Portfolio() {
  const root = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const ctx = gsap.context(() => {
      if (mobile || reduced) return

      const cards = gsap.utils.toArray('[data-project-card]')
      const total = cards.reduce((w, el) => w + el.offsetWidth + 32, 0)
      const distance = total - window.innerWidth + 160

      gsap.to(track.current, {
        x: () => -Math.max(0, distance),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'left center',
          end: 'right center',
          onEnter: () => card.classList.add('scale-[1.03]'),
          onLeave: () => card.classList.remove('scale-[1.03]'),
          onEnterBack: () => card.classList.add('scale-[1.03]'),
          onLeaveBack: () => card.classList.remove('scale-[1.03]'),
        })
        gsap.fromTo(
          card.querySelector('[data-project-visual]'),
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${distance}`,
              scrub: true,
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-bg pt-[8vh]" id="work" ref={root}>
      <div className={`${wrap} mb-10`}>
        <p className={eyebrow}>SELECTED WORK</p>
        <h2 className={display}>
          FORGED IN
          <br />
          DIGITAL FIRE.
        </h2>
      </div>
      <div className="overflow-hidden pb-[8vh]">
        <div
          className="flex w-max gap-8 pl-[max(0.8rem,calc((100%-1280px)/2))] max-md:w-auto max-md:flex-col max-md:px-3 max-md:!translate-x-0"
          ref={track}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="w-[min(72vw,860px)] shrink-0 transition-transform duration-500 max-md:w-full"
              data-project-card
              data-cursor="project"
              data-cursor-label="VIEW CASE STUDY"
            >
              <button type="button" className="group block w-full border-0 bg-transparent p-0 text-left" onClick={() => setActive(project)}>
                <div
                  className="relative h-[min(58vh,520px)] overflow-hidden border border-ink/10 bg-[#0b1220] group-hover:border-blue/45 max-md:h-[46vh] hover:border-blue/45"
                  data-project-visual
                >
                  <ProjectVisual theme={project.theme} title={project.title} />
                  <div className="project-grain pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.45)),radial-gradient(circle_at_80%_0%,rgba(61,158,255,0.22),transparent_42%)]" />
                </div>
                <div className="flex justify-between gap-6 pt-5 max-md:flex-col">
                  <div>
                    <h3 className="m-0 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.9]">{project.title}</h3>
                    <p className="mt-1 text-[0.9rem] text-muted">
                      {project.category} - {project.year}
                    </p>
                  </div>
                  <p className="mt-1 max-w-xs text-[0.9rem] text-muted">{project.description}</p>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  )
}
