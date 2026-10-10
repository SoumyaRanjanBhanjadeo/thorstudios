export const wrap =
  "mx-auto w-[min(1280px,calc(100%-1.6rem))] md:w-[min(1280px,calc(100%-3rem))]";

export const eyebrow =
  "mb-5 font-ui text-[0.72rem] font-medium uppercase tracking-[0.22em] text-gold";

export const display =
  "m-0 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.02em] text-ink";

export const btnBase =
  "inline-flex min-h-[48px] items-center justify-center border px-6 font-ui text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink transition-[border-color,background-color,color] duration-300 max-md:w-full [&>span]:pointer-events-none";

export const btnPrimary = `${btnBase} border-ink/20 bg-black text-bg hover:bg-transparent hover:text-black`;

export const btnGhost = `${btnBase} border-black/20 bg-transparent hover:bg-black hover:text-bg`;

export const field =
  "w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-2.5 outline-none focus:border-black";
