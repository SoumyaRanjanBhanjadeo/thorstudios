import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LogoMark } from "./LogoMark";
import { navLinks, site } from "../data/site";

export default function Navbar({ ready }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = useRef(null);
  const items = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!overlay.current) return undefined;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (open) {
      gsap.set(overlay.current, { display: "flex" });
      gsap.fromTo(
        overlay.current,
        { opacity: 0 },
        { opacity: 1, duration: reduced ? 0.01 : 0.4, ease: "power2.out" },
      );
      gsap.fromTo(
        items.current,
        { y: reduced ? 0 : 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0.01 : 0.7,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.08,
        },
      );
    } else {
      gsap.to(overlay.current, {
        opacity: 0,
        duration: reduced ? 0.01 : 0.28,
        onComplete: () => {
          if (overlay.current) overlay.current.style.display = "none";
        },
      });
    }
    return undefined;
  }, [open]);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-60 transition-all duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        } ${
          open
            ? "bg-transparent py-1 text-black"
            : scrolled
              ? "bg-bg/85 py-0 shadow-sm backdrop-blur-md text-ink"
              : "bg-transparent py-1 text-white"
        }`}
      >
        <div className="mx-auto flex h-19 w-[min(1280px,calc(100%-1.5rem))] items-center justify-between gap-6 md:w-[min(1280px,calc(100%-3rem))]">
          <a
            href="#top"
            className={`shrink-0 transition-colors ${
              open
                ? "text-black"
                : scrolled
                  ? "text-ink"
                  : "text-purple-200 hover:text-cyan-300"
            }`}
            aria-label={`${site.name} home`}
            onClick={() => setOpen(false)}
          >
            <LogoMark
              variant="seal"
              className={
                open ? "text-black" : scrolled ? "" : "text-purple-200"
              }
            />
          </a>

          <div className="flex shrink-0 items-center gap-6 md:gap-8">
            <a
              href="#contact"
              className={`hidden font-ui text-[0.68rem] font-semibold tracking-[0.2em] cursor-pointer uppercase transition-colors md:inline ${
                open
                  ? "text-black/80 hover:text-black"
                  : scrolled
                    ? "text-ink/80 hover:text-ink"
                    : "text-purple-200/90 hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              }`}
              onClick={() => setOpen(false)}
            >
              Book a visit
            </a>
            <button
              type="button"
              className={`border-0 bg-transparent p-0 font-ui text-[0.72rem] font-bold tracking-[0.22em] cursor-pointer uppercase transition-colors ${
                open
                  ? "text-black hover:opacity-70"
                  : scrolled
                    ? "text-ink"
                    : "text-purple-100 hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              }`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className="fixed inset-0 z-59 hidden h-dvh max-h-dvh flex-col justify-between overflow-hidden bg-bg px-6 pt-24 pb-8 md:px-12 md:pt-26 md:pb-10"
        ref={overlay}
        aria-hidden={!open}
      >
        <nav
          className="relative flex flex-1 flex-col justify-center gap-4 py-2 sm:gap-5 md:gap-6 lg:gap-7"
          aria-label="Primary"
        >
          {navLinks.map((link, i) => (
            <button
              key={link.id}
              type="button"
              className="group flex items-baseline gap-4 border-0 bg-transparent text-left font-brand text-[clamp(2.2rem,6.2vh,4.2rem)] font-bold leading-[1.04] tracking-[-0.03em] text-black transition-transform duration-200 hover:translate-x-2 cursor-pointer"
              ref={(el) => {
                items.current[i] = el;
              }}
              onClick={() => go(link.id)}
            >
              <span className="font-ui text-xs tracking-[0.2em] text-muted sm:text-sm font-semibold">
                0{i + 1}
              </span>
              <span className="transition-colors group-hover:text-purple-900">
                {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
              </span>
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
          <a
            href="#contact"
            className="font-ui text-[0.76rem] font-bold tracking-[0.18em] text-black uppercase transition-opacity hover:opacity-70"
            onClick={() => setOpen(false)}
          >
            Start a project
          </a>
          <a
            href={`mailto:${site.email}`}
            className="font-ui text-sm font-medium text-muted transition-colors hover:text-black"
          >
            {site.email}
          </a>
        </div>
      </div>
    </>
  );
}
