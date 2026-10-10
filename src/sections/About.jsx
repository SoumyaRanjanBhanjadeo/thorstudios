import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../data/site";
import { display, eyebrow, wrap } from "../styles/classes";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll("[data-about-line]");
      const words = root.current.querySelectorAll("[data-about-word]");

      gsap.from(lines, {
        yPercent: reduced ? 0 : 40,
        opacity: 0,
        stagger: 0.12,
        duration: reduced ? 0.01 : 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      if (!reduced) {
        gsap.to(words, {
          y: (i) => (i % 2 === 0 ? -30 : 40),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      gsap.from("[data-about-body], [data-about-aside]", {
        y: reduced ? 0 : 30,
        opacity: 0,
        duration: reduced ? 0.01 : 0.9,
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-about-grid]", start: "top 80%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const heading = ["WE DON'T FOLLOW", "THE STORM.", "WE CREATE IT."];

  return (
    <section
      className="relative bg-bg py-[8vh] pb-[14vh]"
      id="about"
      ref={root}
    >
      <div className={wrap}>
        <p className={eyebrow}>THE STUDIO</p>
        <h2 className={`${display} max-w-[14ch]`}>
          {heading.map((line) => (
            <span className="block" data-about-line key={line}>
              {line.split(" ").map((word, i) => (
                <span
                  className="mr-[0.28em] inline-block"
                  data-about-word
                  key={`${line}-${i}`}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <div
          className="mt-14 grid items-start gap-16 max-lg:grid-cols-1 max-lg:gap-8 lg:grid-cols-[1.4fr_0.8fr]"
          data-about-grid
        >
          <p
            className="m-0 text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.45] text-[#6e737d]"
            data-cursor="text"
            data-about-body
          >
            {site.description} We treat every interface as an environment -
            charged, precise, and built to be remembered.
          </p>
          <aside
            className="border-l border-gold/30 pl-6 text-muted"
            data-about-aside
          >
            <p>
              Cinematic product worlds. Intelligent systems. Brands that feel
              like weather systems of their own.
            </p>
            <ul className="mt-5 list-none p-0">
              {["Experience Design", "Realtime 3D", "Creative Engineering"].map(
                (item) => (
                  <li
                    key={item}
                    className="border-b border-ink/10 py-1.5 font-ui text-xs tracking-[0.14em]"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
