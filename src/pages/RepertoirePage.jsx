import { Link } from 'react-router-dom'
import EraBar from '@/components/EraBar'
import EraThemeHeatmap from '@/components/EraThemeHeatmap'
import ThemeBarRacePlayCount from '@/components/ThemeBarRacePlayCount'
import ThemeDumbbellPlayCount from '@/components/ThemeDumbbellPlayCount'
import ThemePie from '@/components/ThemePie'
import eraDistribution from '@/data/era_distribution.json'
import eraThemeHeatmap from '@/data/era_theme_heatmap.json'
import themeByDynasty from '@/data/theme_by_dynasty.json'
import themeDistribution from '@/data/theme_distribution.json'

export function RepertoirePage() {
  return (
    <div className="relative min-h-screen pb-24 pt-8 sm:pt-10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6">
          <Link
            to="/#themes"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-gold-300"
          >
            <span aria-hidden>←</span>
            返回研究主题
          </Link>
        </p>

        <header className="mb-8 flex flex-col gap-4 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Repertoire · themes
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              剧目整体概览
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500">
            环形图汇总主题类型频次；柱状图按历史朝代统计样本剧目数量；条形竞速与哑铃图以各朝样本剧目部数为分母，对比主题在商周、秦汉的占比。
          </p>
        </header>

        <div className="overflow-x-auto pb-4">
          <ThemePie data={themeDistribution} />
        </div>

        <div className="mt-14 border-t border-gold-500/15 pt-12">
          <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
                Era · distribution
              </p>
              <h2 className="mt-2 font-display text-xl text-stone-50 md:text-2xl">
                剧本朝代分布统计
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-stone-500">
              数据来自本地{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
                era_distribution.json
              </code>
              ，按朝代标签聚合样本中的剧目部数。
            </p>
          </header>
          <div className="overflow-x-auto pb-4">
            <EraBar data={eraDistribution} />
          </div>
        </div>

        <div className="mt-14 border-t border-gold-500/15 pt-12">
          <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
                Theme · dynasty slice
              </p>
              <h2 className="mt-2 font-display text-xl text-stone-50 md:text-2xl">
                主题与朝代对比
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-stone-500">
              数据来自{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
                theme_by_dynasty.json
              </code>{' '}
              与{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
                era_theme_heatmap.json
              </code>
              。条形竞速与哑铃图以商周 55、秦汉 44 部样本剧目为分母计算主题占比；热力图展示各历史朝代与叙事主题的交叉强度及代表剧目。
            </p>
          </header>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8 lg:items-start">
            <ThemeBarRacePlayCount data={themeByDynasty} />
            <ThemeDumbbellPlayCount data={themeByDynasty} />
          </div>
          <div className="mt-12 overflow-x-auto pb-2">
            <EraThemeHeatmap data={eraThemeHeatmap} />
          </div>
        </div>
      </div>
    </div>
  )
}
