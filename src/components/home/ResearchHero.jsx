export function ResearchHero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-gold-500/10"
    >
      <div className="pointer-events-none absolute inset-0 bg-black" aria-hidden />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[120%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(127,29,29,0.45)_0%,transparent_68%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[90%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(69,10,10,0.55)_0%,transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[rgba(201,162,77,0.08)] via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='w'%3E%3CfeTurbulence baseFrequency='0.02' numOctaves='4'/%3E%3CfeColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.92 0 0 0 0 0.85 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent, transparent 2px, rgba(201,162,77,0.06) 2px, rgba(201,162,77,0.06) 3px)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-black/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-400/95 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.65)]" />
            数字人文 · 展览式学术界面
          </p>
          <h1 className="font-display text-balance text-2xl font-semibold leading-snug tracking-wide text-[#f5f0e8] sm:text-3xl md:text-4xl lg:text-[2.65rem] lg:leading-tight">
            汉剧剧目知识图谱与叙事结构可视化研究
          </h1>
          <p className="mx-auto mt-6 max-w-3xl font-sans text-[13px] leading-relaxed tracking-[0.06em] text-stone-400 sm:text-sm md:text-[15px]">
            A Study on the Knowledge Graph and Narrative Structure Visualization
            of Han Opera Repertoires
          </p>
          <div className="mx-auto mt-10 h-px max-w-md bg-gradient-to-r from-transparent via-gold-500/45 to-transparent" />
        </div>
      </div>
    </section>
  )
}
