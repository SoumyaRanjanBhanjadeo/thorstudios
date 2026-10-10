import { useEffect } from 'react'
import gsap from 'gsap'

export function useMagnetic(ref, { strength = 0.32, radius } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      const relX = event.clientX - (rect.left + rect.width / 2)
      const relY = event.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(relX, relY)
      const limit = radius ?? Math.max(rect.width, rect.height) * 0.9

      if (dist > limit * 1.4) {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' })
        return
      }

      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [ref, strength, radius])
}
