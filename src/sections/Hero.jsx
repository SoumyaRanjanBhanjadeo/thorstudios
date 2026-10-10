import { useCallback, useEffect, useRef, useState } from "react";
import WakandaLightningCanvas from "../components/WakandaLightningCanvas";
import HeroInteractiveBackground from "../components/HeroInteractiveBackground";

export function MagneticButton({ className, children, href, onClick }) {
  const props = { className };
  if (href) {
    return (
      <a href={href} {...props}>
        <span>{children}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} {...props}>
      <span>{children}</span>
    </button>
  );
}

export default function Hero() {
  const root = useRef(null);
  const hammersRef = useRef(null);

  const [phase, setPhase] = useState("cylinder");
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    setPhase("cylinder");
    setFlashOpacity(0.9);

    const timer = setTimeout(() => {
      setPhase("settled");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleFlash = useCallback((intensity = 0.35) => {
    setFlashOpacity(intensity);
  }, []);

  useEffect(() => {
    if (flashOpacity <= 0.02) return;
    const timer = setTimeout(() => {
      setFlashOpacity((prev) => Math.max(0, prev * 0.76 - 0.03));
    }, 45);
    return () => clearTimeout(timer);
  }, [flashOpacity]);

  // 3D Parallax Tilt for the settled hammers responding smoothly to user pointer
  const handleMouseMove = (e) => {
    if (phase !== "settled") return;
    if (hammersRef.current) {
      const rect = hammersRef.current.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setTilt({ rx: -dy * 10, ry: dx * 12 });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      className="relative z-0 h-screen max-h-screen w-full overflow-hidden text-white select-none bg-[#06020c]"
      id="top"
      ref={root}
      data-hero-pin
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroInteractiveBackground phase={phase} />

      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-75"
        style={{
          opacity: flashOpacity,
          background:
            "radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.75) 0%, rgba(56, 189, 248, 0.5) 40%, rgba(236, 72, 153, 0.35) 75%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      <WakandaLightningCanvas
        phase={phase}
        hammersRef={hammersRef}
        onFlash={handleFlash}
      />

      <div className="relative z-30 mx-auto flex h-screen max-h-screen w-[min(1280px,calc(100%-3rem))] items-center">
        <div className="relative grid h-full w-full items-center lg:grid-cols-12">
          <div
            className={`z-20 flex flex-col justify-center lg:col-span-6 lg:items-start lg:text-left transition-all duration-1000 ease-out ${
              phase === "cylinder"
                ? "pointer-events-none -translate-x-12 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            {/* Clean Professional Workplace Brand Title */}
            <h1 className="m-0 mt-3 font-ui text-[clamp(2.8rem,5.5vw,5.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
              <span className="block text-white">Thor</span>
              <span className="block bg-linear-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                Studios
              </span>
            </h1>

            {/* Minimal, On-Point Subtitle (No fluff) */}
            <p className="mt-5 max-w-[34ch] font-body text-base font-normal leading-relaxed text-purple-100/80 md:text-lg">
              Building next-generation digital products, immersive web
              platforms, and intelligent brand systems.
            </p>

            {/* Minimal, Professional Workplace CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-cyan-400/80 bg-cyan-500/15 px-6 font-ui text-[0.75rem] font-semibold tracking-[0.16em] text-cyan-200 uppercase shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
                href="#about"
              >
                Explore Work
              </MagneticButton>

              <MagneticButton
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 font-ui text-[0.75rem] font-medium tracking-[0.16em] text-white/90 uppercase backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                href="#contact"
              >
                Get in Touch
              </MagneticButton>
            </div>
          </div>

          <div
            ref={hammersRef}
            className={`z-10 hidden sm:flex items-center justify-center lg:col-span-6 lg:justify-end transition-all duration-1000 ease-out ${
              phase === "cylinder"
                ? "pointer-events-none translate-x-12 scale-90 opacity-0"
                : "translate-x-0 scale-100 opacity-100"
            }`}
            style={{
              perspective: "1000px",
            }}
          >
            {/* 3D Container for the Crossed Hammers */}
            <div
              className="relative flex items-center justify-center will-change-transform"
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Electric Plasma Glow behind the transparent crossed hammers */}
              <div
                className="pointer-events-none absolute inset-0 -m-8 rounded-full opacity-70 blur-2xl transition-opacity duration-1000"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56, 189, 248, 0.45) 15%, rgba(168, 85, 247, 0.25) 50%, transparent 75%)",
                }}
              />

              {/* TRUE TRANSPARENT CROSSED HAMMERS (Zero square background, zero halo) */}
              <div className="relative size-72.5 md:size-100 lg:size-117">
                <img
                  src="/images/crossed-hammers-true-transparent.png"
                  alt="Thor Stormbreaker and Mjolnir crossed in X symbol"
                  className="size-full object-contain drop-shadow-[0_0_35px_rgba(56,189,248,0.7)]"
                  draggable={false}
                />
              </div>

              {/* Ambient Electric Energy Ring */}
              <div
                className="pointer-events-none absolute inset-0 size-full rounded-full opacity-35"
                style={{
                  boxShadow: "0 0 50px 8px rgba(56, 189, 248, 0.35)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 right-6 z-30 flex items-center justify-end text-[0.65rem] tracking-wider text-purple-200/40">
        <span className="hidden md:inline">SCROLL TO DISCOVER</span>
      </div>
    </section>
  );
}
