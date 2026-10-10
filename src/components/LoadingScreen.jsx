import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LogoMark } from "./LogoMark";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const root = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const obj = { v: 0 };
    let loaded = document.readyState === "complete";

    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const tween = gsap.to(obj, {
      v: 100,
      duration: reduced ? 0.5 : 1.8,
      ease: reduced ? "none" : "power2.inOut",
      onUpdate: () => {
        const shown = loaded ? obj.v : Math.min(obj.v, 92);
        setProgress(Math.round(shown));
      },
      onComplete: () => {
        const finish = () => {
          if (done.current) return;
          setProgress(100);
          gsap.to(root.current, {
            opacity: 0,
            duration: reduced ? 0.2 : 0.55,
            ease: "power2.inOut",
            onComplete: () => {
              done.current = true;
              onComplete();
            },
          });
        };

        if (loaded) gsap.delayedCall(0.25, finish);
        else window.addEventListener("load", finish, { once: true });
      },
    });

    return () => {
      tween.kill();
      window.removeEventListener("load", onLoad);
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-70 grid place-items-center bg-bg"
      role="status"
      aria-live="polite"
      aria-label="Loading experience"
    >
      <div className="text-center">
        <LogoMark variant="wordmark" className="items-center" />
        <p className="mt-5 font-ui text-[0.68rem] font-medium tracking-[0.3em] text-muted uppercase">
          Entering
        </p>
      </div>
      <div className="absolute right-8 bottom-8 text-right">
        <span className="font-brand text-[clamp(3.5rem,9vw,7rem)] font-light leading-none tracking-tighter tabular-nums text-ink">
          {String(progress).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
