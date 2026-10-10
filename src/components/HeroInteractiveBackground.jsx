import { useEffect, useRef } from "react";

/**
 * HeroInteractiveBackground
 * High-craft, living, interactive background for Thor Studios Hero section.
 * Features:
 * - Fluid pointer-tracking spotlight with buttery lerp physics
 * - Subtle cursor-revealed technical blueprint grid (Linear/Apple studio aesthetic)
 * - Living multi-layered ambient aurora nebulae with organic continuous drift
 * - Interactive reactive cosmic stardust/ion particles with proximity physics
 */
export default function HeroInteractiveBackground({ phase }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);
  const gridMaskRef = useRef(null);
  const parallaxOrbsRef = useRef(null);

  // Smooth lerp coordinates for pointer
  const posRef = useRef({
    targetX: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    targetY: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    currentX: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    currentY: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    normX: 0,
    normY: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // Center initial position
    const rect = container.getBoundingClientRect();
    posRef.current.targetX = rect.width / 2;
    posRef.current.targetY = rect.height / 2;
    posRef.current.currentX = rect.width / 2;
    posRef.current.currentY = rect.height / 2;

    const handlePointerMove = (e) => {
      const b = container.getBoundingClientRect();
      const x = e.clientX - b.left;
      const y = e.clientY - b.top;
      posRef.current.targetX = x;
      posRef.current.targetY = y;
      posRef.current.normX = (x / b.width) * 2 - 1; // -1 to 1
      posRef.current.normY = (y / b.height) * 2 - 1; // -1 to 1
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Canvas interactive cosmic particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle pool (cosmic stardust & ion embers)
    const particleCount = 45;
    const colors = [
      { r: 56, g: 189, b: 248 }, // Cyan
      { r: 168, g: 85, b: 247 }, // Purple
      { r: 251, g: 191, b: 36 }, // Subtle Gold
      { r: 224, g: 231, b: 255 }, // Silver White
    ];

    const particles = Array.from({ length: particleCount }, () => {
      const c = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6,
        baseVx: (Math.random() - 0.5) * 0.25,
        baseVy: -(Math.random() * 0.45 + 0.2), // gentle upward drift
        vx: 0,
        vy: 0,
        baseAlpha: Math.random() * 0.45 + 0.15,
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
        color: c,
      };
    });

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth pointer position lerp
      const pos = posRef.current;
      pos.currentX += (pos.targetX - pos.currentX) * 0.08;
      pos.currentY += (pos.targetY - pos.currentY) * 0.08;

      // Update CSS spotlight & grid mask
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${pos.currentX}px, ${pos.currentY}px, 0)`;
      }

      if (gridMaskRef.current) {
        const maskVal = `radial-gradient(circle 460px at ${pos.currentX}px ${pos.currentY}px, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 80%)`;
        gridMaskRef.current.style.maskImage = maskVal;
        gridMaskRef.current.style.webkitMaskImage = maskVal;
      }

      if (parallaxOrbsRef.current) {
        // Subtle optical depth shift opposite to cursor
        const px = -pos.normX * 18;
        const py = -pos.normY * 18;
        parallaxOrbsRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }

      // Draw canvas particles
      ctx.clearRect(0, 0, width, height);

      const mx = pos.currentX;
      const my = pos.currentY;

      // Particle proximity constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 55 * 55) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 55) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update & render individual particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic pulse
        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle) * 0.2;
        p.alpha = Math.max(0.1, Math.min(0.9, p.baseAlpha + pulse));

        // Interactive cursor repulsion / reaction
        const cdx = p.x - mx;
        const cdy = p.y - my;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < 140 && cdist > 1) {
          const force = (1 - cdist / 140) * 1.8;
          p.vx += (cdx / cdist) * force * 12 * dt;
          p.vy += (cdy / cdist) * force * 12 * dt;
          p.alpha = Math.min(0.95, p.alpha + (1 - cdist / 140) * 0.4);
        }

        // Apply friction to interactive velocity
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Position update
        p.x += (p.baseVx + p.vx) * (dt * 60);
        p.y += (p.baseVy + p.vy) * (dt * 60);

        // Screen boundary wrapping
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
        }

        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        // Draw glowing particle
        const currentSize = p.size * (1 + (p.alpha - p.baseAlpha) * 0.6);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft outer glow for larger embers
        if (currentSize > 1.4) {
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* 1. Deep Multi-Stop Foundation Mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 80% at 50% 20%, rgba(30, 27, 75, 0.5) 0%, rgba(13, 4, 28, 0.8) 55%, #06020c 100%),
            linear-gradient(135deg, rgba(88, 28, 135, 0.35) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(4, 30, 48, 0.45) 80%, #05010a 100%)
          `,
        }}
      />

      {/* 2. Living Ambient Aurora Nebulae with Parallax Container */}
      <div
        ref={parallaxOrbsRef}
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
      >
        {/* Living Aurora Orb 1: Upper-Left Cosmic Amethyst */}
        <div
          className="animate-aurora-1 absolute -top-24 left-[10%] h-160 w-160 rounded-full blur-[130px] opacity-60 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(126, 34, 206, 0.22) 50%, transparent 75%)",
          }}
        />

        {/* Living Aurora Orb 2: Center-Right Celestial Electric Cyan */}
        <div
          className={`animate-aurora-2 absolute top-1/3 -right-20 h-175 w-175 rounded-full blur-[140px] mix-blend-screen transition-opacity duration-1000 ${
            phase === "settled" ? "opacity-70" : "opacity-35"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(59, 130, 246, 0.24) 45%, rgba(147, 51, 234, 0.15) 70%, transparent 85%)",
          }}
        />

        {/* Living Aurora Orb 3: Bottom-Center Prismatic Rose & Amber Wash */}
        <div
          className="animate-aurora-3 absolute -bottom-36 left-1/3 h-140 w-150 rounded-full blur-[125px] opacity-45 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.2) 45%, transparent 75%)",
          }}
        />

        {/* Diagonal Prismatic Rainbow Horizon Sheen */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-color-dodge"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, rgba(236, 72, 153, 0.18) 22%, rgba(168, 85, 247, 0.25) 42%, rgba(56, 189, 248, 0.22) 65%, rgba(45, 212, 191, 0.16) 82%, transparent 100%)",
          }}
        />
      </div>

      {/* 3. Interactive Precision Blueprint Grid (Linear/Studio style - softly revealed under cursor) */}
      <div
        ref={gridMaskRef}
        className="absolute inset-0 opacity-35 will-change-[mask-image]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* 4. Interactive Fluid Pointer Spotlight Aura */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -top-60 -left-60 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-65 blur-3xl mix-blend-screen will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.14) 40%, rgba(236, 72, 153, 0.06) 65%, transparent 80%)",
        }}
      />

      {/* 5. Interactive Cosmic Stardust & Ion Embers Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
      />

      {/* 6. Cinematic Studio Edge Vignette (Guarantees impeccable contrast & typography clarity) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(6, 2, 12, 0.5) 75%, rgba(5, 1, 10, 0.85) 100%)",
        }}
      />
    </div>
  );
}
