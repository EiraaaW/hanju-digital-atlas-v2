import { ChartPlaceholder } from '@/components/ChartPlaceholder'
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
              Visualization lab
            </p>
            <h2 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              可视化预览
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-stone-500">
            基于 Apache ECharts 的叙事结构指标示意；面板样式对齐展览现场大屏可读性。
          </p>
        </header>
        <ChartPlaceholder />
      </section>
    </div>
  )
}
