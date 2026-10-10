import { useId } from "react";

export function LogoMark({ className = "", variant = "mark" }) {
  const uid = useId().replace(/:/g, "");
  const pathId = `thor-seal-${uid}`;

  if (variant === "seal") {
    return (
      <span
        className={`relative inline-grid size-15 place-items-center md:size-18 ${className}`}
      >
        <svg
          className="animate-spin-slow absolute inset-0 size-full text-current"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <path
              id={pathId}
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text
            className="font-ui fill-current uppercase font-medium"
            style={{ fontSize: "7.2px", letterSpacing: "0.24em" }}
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              Play without limits · Play without limits ·
            </textPath>
          </text>
        </svg>
        <span className="relative z-1 grid size-9 place-items-center md:size-11">
          <img
            src="/images/thor-logo-creative.png"
            alt="Thor Studios"
            width={44}
            height={44}
            className="size-[92%] object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform hover:scale-105"
            draggable={false}
          />
        </span>
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={`inline-flex items-center gap-3.5 ${className}`}>
        <img
          src="/images/thor-logo-creative.png"
          alt="Thor Studios"
          width={40}
          height={40}
          className="size-9 object-contain md:size-10 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-transform hover:scale-105"
          draggable={false}
        />
        <span className="inline-flex flex-col leading-[0.92]">
          <span className="font-brand text-[1.28rem] font-bold tracking-[-0.03em] text-current md:text-[1.48rem]">
            Thor
          </span>
          <span className="font-brand text-[1.28rem] font-bold tracking-[-0.03em] text-current md:text-[1.48rem]">
            Studios
          </span>
        </span>
      </span>
    );
  }

  return (
    <img
      src="/images/thor-logo-creative.png"
      alt="Thor Studios"
      width={40}
      height={40}
      className={`object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.4)] transition-transform hover:scale-105 ${className || "size-9"}`}
      draggable={false}
    />
  );
}

export function LightningGlyph({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.2 2.5 L6.8 13.2 H11.1 L9.4 21.5 L18.4 9.6 H13.8 L13.2 2.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}
