import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  PRIVACY_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "../lib/privacy";

const OUTER =
  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)";
const INNER =
  "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)";

/* Era split-char hidden: translate(0%, 25%) translate3d(-0.4em, 0, 0) rotateY(90deg); opacity: 0 */
const HIDDEN = { opacity: 0, yPercent: 25, x: "-0.4em", rotateY: 90 };
const VISIBLE = { opacity: 1, yPercent: 0, x: 0, rotateY: 0 };

function NotchedFrame() {
  return (
    <div
      className="pointer-events-none absolute inset-1.75 text-[#17233b]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-current"
        style={{ clipPath: OUTER }}
      />
      <div
        className="absolute inset-px bg-[#f3f3ec]"
        style={{ clipPath: INNER }}
      />
    </div>
  );
}

/** Split-char 3D flip - exit L→R, then enter L→R */
function CookieAction({ children, onClick }) {
  const btnRef = useRef(null);
  const label = String(children);
  const chars = [...label];

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const outs = gsap.utils.toArray(
      btn.querySelectorAll('[data-layer="out"] .split-char'),
    );
    const ins = gsap.utils.toArray(
      btn.querySelectorAll('[data-layer="in"] .split-char'),
    );

    gsap.set(outs, { ...VISIBLE, force3D: true, transformOrigin: "50% 50%" });
    gsap.set(ins, { ...HIDDEN, force3D: true, transformOrigin: "50% 50%" });

    const stagger = 0.04;
    let tl;

    const onEnter = () => {
      tl?.kill();
      tl = gsap.timeline({ defaults: { ease: "power2.inOut", force3D: true } });
      tl.to(outs, { ...HIDDEN, duration: 0.42, stagger }).fromTo(
        ins,
        { ...HIDDEN },
        { ...VISIBLE, duration: 0.42, stagger, ease: "power2.out" },
        outs.length * stagger * 0.45,
      );
    };

    const onLeave = () => {
      tl?.kill();
      tl = gsap.timeline({ defaults: { ease: "power2.inOut", force3D: true } });
      tl.to(ins, { ...HIDDEN, duration: 0.35, stagger }).to(
        outs,
        { ...VISIBLE, duration: 0.35, stagger, ease: "power2.out" },
        ins.length * stagger * 0.4,
      );
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      tl?.kill();
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, [label]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative cursor-pointer border-0 bg-transparent p-0 font-didone text-[0.95rem] font-normal tracking-[0.04em] text-[#17233b] uppercase"
      style={{ perspective: "480px" }}
    >
      <span className="relative inline-grid pb-1.25" aria-hidden="true">
        <span
          data-layer="out"
          className="split-word col-start-1 row-start-1 inline-flex"
          style={{ transformStyle: "preserve-3d" }}
        >
          {chars.map((ch, i) => (
            <span
              key={`out-${i}`}
              className="split-char inline-block leading-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span
          data-layer="in"
          className="split-word col-start-1 row-start-1 inline-flex"
          style={{ transformStyle: "preserve-3d" }}
        >
          {chars.map((ch, i) => (
            <span
              key={`in-${i}`}
              className="split-char inline-block leading-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-px bg-[#17233b]/75"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

export default function CookieBanner() {
  const [banner, setBanner] = useState(() => !readCookieConsent());
  const [policy, setPolicy] = useState(false);

  useEffect(() => {
    const onPrivacy = () => setPolicy(true);
    window.addEventListener(PRIVACY_EVENT, onPrivacy);
    return () => window.removeEventListener(PRIVACY_EVENT, onPrivacy);
  }, []);

  const choose = (value) => {
    writeCookieConsent(value);
    setBanner(false);
  };

  return (
    <>
      {banner && (
        <div
          className="pointer-events-auto fixed right-3 bottom-3 z-200 flex w-[min(200px,calc(100%-1.5rem))] aspect-17/21 flex-col justify-between overflow-hidden rounded-sm bg-[#f3f3ec] px-3.5 pt-3.5 pb-4 shadow-[0_9px_20px_rgba(0,0,0,0.08),0_36px_36px_rgba(0,0,0,0.07)] md:right-6 md:bottom-6"
          role="dialog"
          aria-label="Cookie consent"
          data-lenis-prevent
        >
          <NotchedFrame />

          <div className="relative z-1 h-17 overflow-hidden">
            <p
              className="absolute top-2 left-[42%] m-0 -translate-x-1/2 -rotate-12 whitespace-nowrap font-script text-[4.35rem] leading-none text-[#17233b] select-none"
              aria-hidden="true"
            >
              Cookies
            </p>
            <span className="sr-only">Cookies</span>
          </div>

          <div className="relative z-1 flex flex-col items-center gap-4 pb-0.5">
            <p className="m-0 text-center font-ui text-[0.5rem] leading-[1.75] font-medium tracking-[0.14em] text-[#17233b] uppercase">
              This website uses cookies
              <br />
              to ensure you get the best
              <br />
              experience on website.
            </p>

            <div className="flex items-baseline justify-center gap-1.5">
              <CookieAction onClick={() => choose("accepted")}>
                Accept
              </CookieAction>
              <span
                className="font-didone text-[0.9rem] leading-none text-[#17233b]"
                aria-hidden="true"
              >
                /
              </span>
              <CookieAction onClick={() => choose("declined")}>
                Decline
              </CookieAction>
            </div>
          </div>
        </div>
      )}

      {policy && (
        <div
          className="pointer-events-auto fixed inset-0 z-210 flex items-end justify-center bg-ink/40 p-4 md:items-center"
          data-lenis-prevent
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto border border-ink/10 bg-bg p-6 text-ink md:p-8"
            role="dialog"
            aria-labelledby="privacy-title"
          >
            <p
              id="privacy-title"
              className="m-0 font-display text-3xl font-medium"
            >
              Privacy policy
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Thor Studios uses essential cookies to remember this choice, and
              optional analytics cookies to understand how the site performs so
              we can make it better. We do not sell personal data.
            </p>
            <button
              type="button"
              className="mt-6 min-h-10 cursor-pointer border border-ink/20 bg-transparent px-5 font-ui text-[0.68rem] font-medium tracking-[0.14em] uppercase"
              onClick={() => setPolicy(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
