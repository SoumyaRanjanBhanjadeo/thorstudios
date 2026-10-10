import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectVisual from './ProjectVisual'
import { eyebrow } from '../styles/classes'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-55 grid place-items-center bg-[rgba(4,6,12,0.78)] p-5 backdrop-blur-[10px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-[min(980px,100%)] overflow-hidden border border-ink/10 bg-[#0b1018]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 z-2 border border-ink/10 bg-bg/55 px-3 py-2 text-[0.68rem] tracking-[0.16em]"
          onClick={onClose}
          data-cursor="button"
          data-cursor-label="CLOSE"
        >
          CLOSE
        </button>
        <div className="h-70">
          <ProjectVisual theme={project.theme} title={project.title} />
        </div>
        <div className="px-7 pt-6 pb-8">
          <p className={eyebrow}>
            {project.category} - {project.year}
          </p>
          <h2 id="project-title" className="mb-3 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.9]">
            {project.title}
          </h2>
          <p>{project.long}</p>
          <dl className="mt-5 flex gap-10">
            <div>
              <dt className="text-[0.68rem] tracking-[0.2em] text-gold">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] tracking-[0.2em] text-gold">Year</dt>
              <dd className="mt-1">{project.year}</dd>
            </div>
          </dl>
        </div>
      </motion.div>
    </motion.div>
  )
}
