import { useEffect, useState } from 'react'

function readDevice() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isFinePointer: true,
      reducedMotion: false,
    }
  }

  return {
    isMobile: window.matchMedia('(max-width: 767px)').matches,
    isTablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches,
    isFinePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

export function useDevice() {
  const [device, setDevice] = useState(readDevice)

  useEffect(() => {
    const update = () => setDevice(readDevice())
    const mobile = window.matchMedia('(max-width: 767px)')
    const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

    mobile.addEventListener('change', update)
    tablet.addEventListener('change', update)
    pointer.addEventListener('change', update)
    motion.addEventListener('change', update)
    window.addEventListener('resize', update)

    return () => {
      mobile.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
      pointer.removeEventListener('change', update)
      motion.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return device
}
