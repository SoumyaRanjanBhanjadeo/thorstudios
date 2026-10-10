const themes = {
  nexus: 'bg-[radial-gradient(circle_at_30%_20%,rgba(61,158,255,0.28),transparent_32%),linear-gradient(160deg,#0b1424,#07090f_60%)]',
  aether: 'bg-[radial-gradient(circle_at_70%_40%,rgba(201,168,108,0.28),transparent_36%),linear-gradient(160deg,#16110c,#07090f_62%)]',
  volt: 'bg-[radial-gradient(circle_at_50%_80%,rgba(110,200,255,0.3),transparent_40%),linear-gradient(200deg,#07131f,#05060a)]',
  odin: 'bg-[radial-gradient(circle_at_20%_50%,rgba(139,124,255,0.32),transparent_36%),linear-gradient(140deg,#0c0b18,#05060a)]',
}

const orbs = {
  nexus: 'right-[12%] top-[18%] bg-[radial-gradient(circle,#9ad4ff_0%,#3d9eff_28%,transparent_68%)]',
  aether: 'left-[18%] right-auto top-[18%] bg-[radial-gradient(circle,#f0e0b4_0%,#c9a86c_30%,transparent_68%)]',
  volt: 'right-[12%] top-[18%] bg-[radial-gradient(circle,#9ad4ff_0%,#3d9eff_28%,transparent_68%)]',
  odin: 'right-[12%] top-[18%] bg-[radial-gradient(circle,#c9c0ff_0%,#6d63d8_30%,transparent_68%)]',
}

export default function ProjectVisual({ theme, title }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.06] ${themes[theme] || themes.nexus}`}
      role="img"
      aria-label={`${title} visual`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[42px_42px] mask-[radial-gradient(circle_at_50%_50%,#000,transparent_78%)]" />
      <div className={`absolute size-55 rounded-full opacity-85 blur-1.5 ${orbs[theme] || orbs.nexus}`} />
      <div className="absolute top-[12%] right-[8%] size-70 rounded-full border border-gold/55 shadow-[0_0_40px_rgba(61,158,255,0.15)]" />
      <div className="absolute top-[38%] left-[16%] h-2.5 w-17.5 rotate-32 bg-[linear-gradient(180deg,#d7c08a,#7a6240)] shadow-[0_0_12px_rgba(201,168,108,0.4)]" />
      <div className="absolute top-[58%] left-[22%] h-2.5 w-27.5 rotate-[-18deg] bg-[linear-gradient(180deg,#d7c08a,#7a6240)] shadow-[0_0_12px_rgba(201,168,108,0.4)]" />
      <div className="absolute bottom-[18%] left-[14%] size-18 rotate-45 border border-white/22" />
      <span className="absolute bottom-5 left-5 font-display text-4xl tracking-[0.12em] opacity-90">{title}</span>
    </div>
  )
}
