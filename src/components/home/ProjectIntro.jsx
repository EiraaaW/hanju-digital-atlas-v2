import projectHome from '@/data/project-home.json'

const blocks = [
  { key: 'researchObject', label: '研究对象', accent: 'border-l-red-700' },
  { key: 'dataSource', label: '数据来源', accent: 'border-l-gold-500' },
  { key: 'researchGoals', label: '研究目标', accent: 'border-l-red-600' },
  { key: 'technicalMethods', label: '技术方法', accent: 'border-l-gold-400' },
]

export function ProjectIntro() {
  const { intro } = projectHome

  return (
    <section
      id="intro"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="mb-10 flex flex-col gap-2 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
            Project introduction
          </p>
          <h2 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
            项目简介
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-stone-500">
          面向戏曲文献与叙事计算交叉议题，强调数据可追溯与图谱可阐释。
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {blocks.map((b) => (
          <article
            key={b.key}
            className={`group rounded-2xl border border-white/5 border-l-4 bg-gradient-to-br from-[#0f0a0c]/90 to-black/80 p-6 shadow-[0_0_0_1px_rgba(201,162,77,0.08)] backdrop-blur-sm transition hover:border-gold-500/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:p-7 ${b.accent}`}
          >
            <h3 className="font-display text-lg text-gold-300">{b.label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-400 transition group-hover:text-stone-300">
              {intro[b.key]}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
