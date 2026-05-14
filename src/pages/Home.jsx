import MapApp from '@/components/MapApp'
import { DataOverview } from '@/components/home/DataOverview'
import { ProjectIntro } from '@/components/home/ProjectIntro'
import { ResearchHero } from '@/components/home/ResearchHero'
import { ThemeNavigation } from '@/components/home/ThemeNavigation'
import { useScrollToHash } from '@/hooks/useScrollToHash'

export function Home() {
  useScrollToHash()

  return (
    <div className="relative min-h-screen">
      <ResearchHero />
      <ProjectIntro />
      <DataOverview />
      <ThemeNavigation />

      <section
        id="viz"
        className="relative mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-28"
      >
        <header className="mb-8 flex flex-col gap-2 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Dream · rivers & mountains
            </p>
            <h2 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              戏梦山河
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-stone-500">
            剧本故事地在今中国版图上的分布示意：琥珀点为商周样本，朱红点为秦汉样本；数据来自{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              map_data.json
            </code>
            ，底图加载自{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              /geo/china.json
            </code>
            。
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-gold-500/15 bg-[#07080f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <MapApp />
        </div>
      </section>
    </div>
  )
}
