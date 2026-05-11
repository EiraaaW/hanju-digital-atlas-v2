import { Link } from 'react-router-dom'
import projectHome from '@/data/project-home.json'

export function ThemeNavigation() {
  const { themes } = projectHome

  return (
    <section
      id="themes"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="mb-10 flex flex-col gap-2 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
            Research themes
          </p>
          <h2 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
            研究主题导航
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-stone-500">
          下列主题为后续独立页面 / 可视化模块预留入口，可在路由层逐项接通。
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {themes.map((t, i) => (
          <li
            key={t.id}
            {...(t.hash !== 'theme-plot-content' ? { id: t.hash } : {})}
            className="scroll-mt-28"
          >
            <Link
              to={{ pathname: '/', hash: t.hash }}
              className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#141018]/95 to-black/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-gold-500/35 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            >
              <span className="font-mono text-[10px] text-red-400/90">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-lg text-gold-200 transition group-hover:text-gold-100">
                {t.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500 transition group-hover:text-stone-400">
                {t.description}
              </p>
              <span className="mt-5 inline-flex items-center text-xs font-medium text-red-400/90 group-hover:text-red-300">
                进入主题
                <span
                  className="ml-1 transition group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
