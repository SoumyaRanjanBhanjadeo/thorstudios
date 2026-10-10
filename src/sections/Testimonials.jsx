import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { testimonials } from "../data/site";
import { display, eyebrow, wrap } from "../styles/classes";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const quote = useRef(null);
  const animating = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gsap.fromTo(
      quote.current,
      { y: reduced ? 0 : 28, opacity: 0 },
      { y: 0, opacity: 1, duration: reduced ? 0.01 : 0.5, ease: "power3.out" },
    );
  }, [index]);

  const go = (next) => {
    if (animating.current) return;
    const wrapped = (next + testimonials.length) % testimonials.length;
    if (wrapped === index) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setIndex(wrapped);
      return;
    }
    animating.current = true;
    gsap.to(quote.current, {
      y: -24,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setIndex(wrapped);
        animating.current = false;
      },
    });
  };

  const item = testimonials[index];

  return (
    <section className="relative bg-bg py-[12vh]" id="testimonials">
      <div className={wrap}>
        <p className={eyebrow}>TESTIMONIALS</p>
        <h2 className={display}>
          VOICES FROM
          <br />
          THE OTHER SIDE.
        </h2>
        <div className="mt-8 max-w-3xl" ref={quote} aria-live="polite">
          <blockquote
            className="m-0 text-[clamp(1.5rem,3.2vw,2.2rem)] leading-tight font-light"
            data-cursor="text"
          >
            “{item.quote}”
          </blockquote>
          <p className="text-[0.78rem] tracking-[0.16em]">
            - {item.name.toUpperCase()}
            <span className="mt-1.5 block tracking-[0.08em] text-muted">
              {item.role}
            </span>
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[0.68rem] uppercase tracking-[0.18em] text-muted hover:text-black cursor-pointer"
            onClick={() => go(index - 1)}
            data-cursor="button"
            data-cursor-label="PREV"
          >
            Previous
          </button>
          <ol className="m-0 flex list-none gap-1.5 p-0">
            {testimonials.map((t, i) => (
              <li key={t.name}>
                <button
                  type="button"
                  className={`h-0.75 w-1.75 border-0 p-0 ${i === index ? "bg-gray-400" : "bg-white/40"}`}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[0.68rem] uppercase tracking-[0.18em] text-muted hover:text-black cursor-pointer"
            onClick={() => go(index + 1)}
            data-cursor="button"
            data-cursor-label="NEXT"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
