import { useEffect, useRef } from 'react'

export default function WakandaLightningCanvas({
  phase, // 'cylinder' | 'settled'
  hammersRef,
  onFlash,
}) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const activeBolts = useRef([])
  const sparks = useRef([])
  const shockwaves = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = 1

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Midpoint displacement lightning generator
    const generateBolt = (x1, y1, x2, y2, displace = 65, minDisplace = 4, branchProb = 0.55) => {
      const segments = []

      function subdivide(ax, ay, bx, by, d, depth) {
        if (d < minDisplace || depth > 5) {
          segments.push({ x1: ax, y1: ay, x2: bx, y2: by, depth })
          return
        }

        const midX = (ax + bx) / 2
        const midY = (ay + by) / 2
        const dx = bx - ax
        const dy = by - ay
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const nx = -dy / len
        const ny = dx / len

        const offset = (Math.random() - 0.5) * d * 2.2
        const cx = midX + nx * offset
        const cy = midY + ny * offset

        subdivide(ax, ay, cx, cy, d * 0.52, depth + 1)
        subdivide(cx, cy, bx, by, d * 0.52, depth + 1)

        if (Math.random() < branchProb && depth < 3) {
          const branchAngle = (Math.random() - 0.5) * 1.3
          const branchLen = len * (0.35 + Math.random() * 0.4)
          const bDirX = (dx * Math.cos(branchAngle) - dy * Math.sin(branchAngle)) / len
          const bDirY = (dx * Math.sin(branchAngle) + dy * Math.cos(branchAngle)) / len
          const bTargetX = cx + bDirX * branchLen
          const bTargetY = cy + bDirY * branchLen
          subdivide(cx, cy, bTargetX, bTargetY, d * 0.42, depth + 1)
        }
      }

      subdivide(x1, y1, x2, y2, displace, 0)
      return segments
    }

    // Add rainbow spark particles on ground impact
    const rainbowColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#c084fc']
    const addSparks = (x, y, count = 20) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 4 + Math.random() * 11
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          life: 1.0,
          decay: 0.018 + Math.random() * 0.035,
          size: 1.5 + Math.random() * 3,
          color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        })
      }
    }

    let descentY = 0
    let descentVelocity = 0
    let lastBoltTime = 0
    let hasImpacted = false

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)

      const targetX = width * 0.5
      const topX = width * 0.52 // slight cinematic angle matching Wakanda shot
      const cylinderTopW = Math.min(width * 0.16, 130)
      const cylinderBotW = Math.min(width * 0.22, 180)
      const groundY = height * 0.88

      // =========================================================================
      // 1. 3D RAINBOW BIFROST CYLINDER (Authentic Infinity War Wakanda Entry)
      // =========================================================================
      if (phase === 'cylinder') {
        if (descentY < groundY) {
          descentVelocity += 4.5
          descentY = Math.min(groundY, descentY + descentVelocity * 5)

          if (descentY >= groundY && !hasImpacted) {
            hasImpacted = true
            // Ground impact shockwaves
            shockwaves.current.push({ x: targetX, y: groundY, r: 15, maxR: 340, alpha: 1.0, color: '#facc15' })
            shockwaves.current.push({ x: targetX, y: groundY, r: 35, maxR: 440, alpha: 0.8, color: '#38bdf8' })
            addSparks(targetX, groundY, 45)
            if (onFlash) onFlash(0.95)
          }
        }

        const currentBottom = descentY
        const progress = currentBottom / groundY
        const currentBotW = cylinderTopW + (cylinderBotW - cylinderTopW) * progress

        ctx.save()

        // -----------------------------------------------------------------------
        // A. Multi-Color Outer Atmospheric Bifrost Corona Glow
        // -----------------------------------------------------------------------
        const outerAura = ctx.createLinearGradient(
          targetX - currentBotW * 1.8, 0,
          targetX + currentBotW * 1.8, 0
        )
        outerAura.addColorStop(0, 'rgba(236, 72, 153, 0)')
        outerAura.addColorStop(0.2, 'rgba(236, 72, 153, 0.35)') // Pink
        outerAura.addColorStop(0.4, 'rgba(249, 115, 22, 0.4)')  // Orange
        outerAura.addColorStop(0.6, 'rgba(34, 197, 94, 0.4)')   // Green
        outerAura.addColorStop(0.8, 'rgba(56, 189, 248, 0.45)') // Cyan/Blue
        outerAura.addColorStop(1, 'rgba(168, 85, 247, 0)')      // Violet

        ctx.fillStyle = outerAura
        ctx.fillRect(targetX - currentBotW * 1.8, 0, currentBotW * 3.6, currentBottom)

        // -----------------------------------------------------------------------
        // B. 3D Volumetric Cylinder with True Rainbow Spectral Bands
        // -----------------------------------------------------------------------
        const rainbowGrad = ctx.createLinearGradient(
          topX - cylinderTopW / 2, 0,
          topX + cylinderTopW / 2, 0
        )
        rainbowGrad.addColorStop(0.00, 'rgba(244, 63, 94, 0.55)')   // Rose/Red
        rainbowGrad.addColorStop(0.14, 'rgba(249, 115, 22, 0.75)')  // Orange
        rainbowGrad.addColorStop(0.28, 'rgba(250, 204, 21, 0.9)')   // Gold Yellow
        rainbowGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.98)') // Blinding White Core
        rainbowGrad.addColorStop(0.58, 'rgba(255, 255, 255, 0.98)') // Blinding White Core
        rainbowGrad.addColorStop(0.72, 'rgba(34, 197, 94, 0.85)')   // Emerald Green
        rainbowGrad.addColorStop(0.86, 'rgba(6, 182, 212, 0.85)')   // Cyan
        rainbowGrad.addColorStop(1.00, 'rgba(168, 85, 247, 0.65)')  // Violet

        // Draw 3D tapered cylinder path
        ctx.beginPath()
        ctx.moveTo(topX - cylinderTopW / 2, 0)
        ctx.lineTo(topX + cylinderTopW / 2, 0)
        ctx.lineTo(targetX + currentBotW / 2, currentBottom)
        ctx.lineTo(targetX - currentBotW / 2, currentBottom)
        ctx.closePath()
        ctx.fillStyle = rainbowGrad
        ctx.fill()

        // -----------------------------------------------------------------------
        // C. Internal Vertical Prismatic Light Streaks (Streaming downward)
        // -----------------------------------------------------------------------
        const bandColors = ['#f43f5e', '#fb923c', '#facc15', '#ffffff', '#4ade80', '#38bdf8', '#c084fc']
        const numBands = bandColors.length
        for (let b = 0; b < numBands; b++) {
          const ratio = (b / (numBands - 1)) - 0.5
          const bxTop = topX + ratio * (cylinderTopW * 0.85)
          const bxBot = targetX + ratio * (currentBotW * 0.85)

          ctx.beginPath()
          ctx.moveTo(bxTop, 0)
          ctx.lineTo(bxBot, currentBottom)
          ctx.strokeStyle = bandColors[b]
          ctx.lineWidth = 3.5
          ctx.shadowColor = bandColors[b]
          ctx.shadowBlur = 12
          ctx.stroke()
        }

        // -----------------------------------------------------------------------
        // D. 3D Elliptical Rings Wrapping Around the Cylinder (Cylindrical depth)
        // -----------------------------------------------------------------------
        const ringSpacing = 36
        const totalRings = Math.floor(currentBottom / ringSpacing)
        for (let r = 0; r < totalRings; r++) {
          const ry = (r * ringSpacing + (time * 0.3) % ringSpacing) % currentBottom
          const yRatio = ry / currentBottom
          const rxAtY = (cylinderTopW + (currentBotW - cylinderTopW) * yRatio) * 0.55
          const ringColor = bandColors[r % bandColors.length]

          ctx.beginPath()
          // 3D tilted ellipse
          ctx.ellipse(topX + (targetX - topX) * yRatio, ry, rxAtY, 12, 0, 0, Math.PI * 2)
          ctx.strokeStyle = ringColor
          ctx.lineWidth = 2
          ctx.globalAlpha = 0.55 + Math.sin(r + time * 0.008) * 0.35
          ctx.stroke()
        }
        ctx.globalAlpha = 1.0

        // -----------------------------------------------------------------------
        // E. Massive Ground Impact Blast (As seen in the Wakanda screenshot)
        // -----------------------------------------------------------------------
        if (currentBottom >= groundY * 0.85) {
          const blastGlow = ctx.createRadialGradient(
            targetX, groundY, 10,
            targetX, groundY, currentBotW * 1.6
          )
          blastGlow.addColorStop(0, 'rgba(255, 255, 255, 1)')
          blastGlow.addColorStop(0.3, 'rgba(254, 240, 138, 0.9)')
          blastGlow.addColorStop(0.6, 'rgba(249, 115, 22, 0.65)')
          blastGlow.addColorStop(0.85, 'rgba(236, 72, 153, 0.3)')
          blastGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.beginPath()
          ctx.ellipse(targetX, groundY, currentBotW * 1.5, currentBotW * 0.55, 0, 0, Math.PI * 2)
          ctx.fillStyle = blastGlow
          ctx.fill()
        }

        ctx.restore()

        // -----------------------------------------------------------------------
        // F. Branching Lightning Tendrils bursting off the Rainbow Beam
        // -----------------------------------------------------------------------
        if (time - lastBoltTime > 55) {
          lastBoltTime = time
          const burstCount = 2 + Math.floor(Math.random() * 3)
          for (let b = 0; b < burstCount; b++) {
            const side = Math.random() > 0.5 ? 1 : -1
            const srcY = Math.random() * currentBottom
            const yRatio = srcY / (currentBottom || 1)
            const wAtY = cylinderTopW + (currentBotW - cylinderTopW) * yRatio
            const srcX = (topX + (targetX - topX) * yRatio) + side * (wAtY * 0.45)
            const tgtX = side > 0 ? width * (0.65 + Math.random() * 0.35) : width * (Math.random() * 0.35)
            const tgtY = srcY + (Math.random() - 0.45) * height * 0.55

            const segs = generateBolt(srcX, srcY, tgtX, tgtY, 80, 5, 0.65)
            activeBolts.current.push({
              segments: segs,
              alpha: 1.0,
              decay: 0.08,
              glowColor: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
            })
          }

          if (Math.random() < 0.35 && onFlash) {
            onFlash(0.6)
          }
        }
      } else {
        // =========================================================================
        // 2. SETTLED STATE: Ambient Lightning from Crossed Hammers on Right
        // =========================================================================
        descentY = 0
        descentVelocity = 0
        hasImpacted = false

        let originX = width * 0.72
        let originY = height * 0.5

        if (hammersRef?.current) {
          const rect = hammersRef.current.getBoundingClientRect()
          const parentRect = canvas.parentElement
            ? canvas.parentElement.getBoundingClientRect()
            : { left: 0, top: 0 }
          originX = rect.left - parentRect.left + rect.width * 0.5
          originY = rect.top - parentRect.top + rect.height * 0.5
        }

        if (time - lastBoltTime > 230) {
          lastBoltTime = time
          const angle = Math.random() * Math.PI * 2
          const distance = Math.min(width, height) * (0.3 + Math.random() * 0.45)
          const tgtX = originX + Math.cos(angle) * distance
          const tgtY = originY + Math.sin(angle) * distance

          const segs = generateBolt(originX, originY, tgtX, tgtY, 60, 5, 0.55)
          activeBolts.current.push({
            segments: segs,
            alpha: 0.9,
            decay: 0.07,
            glowColor: Math.random() > 0.3 ? '#38bdf8' : '#c084fc',
          })

          if (onFlash && Math.random() < 0.25) onFlash(0.2)
        }
      }

      // =========================================================================
      // 3. DRAW ALL BRANCHING LIGHTNING BOLTS
      // =========================================================================
      for (let i = activeBolts.current.length - 1; i >= 0; i--) {
        const bolt = activeBolts.current[i]
        if (bolt.alpha <= 0.02) {
          activeBolts.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Outer glow in rainbow/cyan tint
        ctx.beginPath()
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${bolt.alpha * 0.5})`
        ctx.lineWidth = 8
        ctx.shadowColor = bolt.glowColor
        ctx.shadowBlur = 18
        ctx.stroke()

        // Core cyan/white
        ctx.beginPath()
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha})`
        ctx.lineWidth = 2.0
        ctx.stroke()

        ctx.restore()
        bolt.alpha -= bolt.decay
      }

      // =========================================================================
      // 4. DRAW GROUND IMPACT SHOCKWAVES & PARTICLES
      // =========================================================================
      for (let w = shockwaves.current.length - 1; w >= 0; w--) {
        const sw = shockwaves.current[w]
        sw.r += 10
        sw.alpha -= 0.035
        if (sw.alpha <= 0) {
          shockwaves.current.splice(w, 1)
          continue
        }
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(sw.x, sw.y, sw.r, sw.r * 0.32, 0, 0, Math.PI * 2)
        ctx.strokeStyle = sw.color
        ctx.lineWidth = 3.5
        ctx.shadowColor = sw.color
        ctx.shadowBlur = 16
        ctx.globalAlpha = sw.alpha
        ctx.stroke()
        ctx.restore()
      }

      for (let p = sparks.current.length - 1; p >= 0; p--) {
        const sp = sparks.current[p]
        sp.x += sp.vx
        sp.y += sp.vy
        sp.vy += 0.22
        sp.life -= sp.decay
        if (sp.life <= 0) {
          sparks.current.splice(p, 1)
          continue
        }
        ctx.save()
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2)
        ctx.fillStyle = sp.color
        ctx.globalAlpha = sp.life
        ctx.fill()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [phase, hammersRef, onFlash])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 size-full"
      aria-hidden="true"
    />
  )
}
