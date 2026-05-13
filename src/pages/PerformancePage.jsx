import { Link } from 'react-router-dom'
import ChangfaBar from '@/components/ChangfaBar'
import ChangfaBarRace from '@/components/ChangfaBarRace'
import HangdangBanshiStack from '@/components/HangdangBanshiStack'
import SankeySTH from '@/components/SankeySTH'
import changfaByDynasty from '@/data/changfa_by_dynasty.json'
import changfaDistribution from '@/data/changfa_distribution.json'
import hangdangBanshiChord from '@/data/hangdang_banshi_chord.json'
import sankeySth from '@/data/sankey_shengqiang_theme_hangdang.json'

const blockTitleClass =
  'font-display text-lg tracking-wide text-gold-200 md:text-xl'

export function PerformancePage() {
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

        <header className="mb-10 flex flex-col gap-4 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Performance · changfa
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              唱腔与表演
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500">
            本页包含声腔—主题—行当桑基、各行当板式占比堆叠、板式出现频次与商周 / 秦汉板式竞速。数据分别来自{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              sankey_shengqiang_theme_hangdang.json
            </code>
            、
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              hangdang_banshi_chord.json
            </code>
            、
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              changfa_distribution.json
            </code>
            与{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              changfa_by_dynasty.json
            </code>
            。
          </p>
        </header>

        <section className="space-y-4" aria-labelledby="perf-sankey-title">
          <div>
            <h3 id="perf-sankey-title" className={blockTitleClass}>
              声腔 · 主题 · 行当关联
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
              桑基图串联三类节点，边宽对应该关联在样本中的出现次数。
            </p>
          </div>
          <div className="overflow-x-auto pb-4">
            <SankeySTH data={sankeySth} />
          </div>
        </section>

        <section
          className="mt-14 space-y-4 border-t border-gold-500/15 pt-12"
          aria-labelledby="perf-hangdang-banshi-title"
        >
          <div>
            <h3 id="perf-hangdang-banshi-title" className={blockTitleClass}>
              行当 · 板式占比
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
              按行当聚合各板式出现次数，堆叠柱展示每个行当内部板式结构（占该行当板式总和的百分比）；数据来自{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[11px] text-gold-200/90">
                hangdang_banshi_chord.json
              </code>
              。
            </p>
          </div>
          <div className="overflow-x-auto pb-4">
            <HangdangBanshiStack data={hangdangBanshiChord} />
          </div>
        </section>

        <section
          className="mt-14 space-y-4 border-t border-gold-500/15 pt-12"
          aria-labelledby="perf-changfa-bar-title"
        >
          <div>
            <h3 id="perf-changfa-bar-title" className={blockTitleClass}>
              板式出现频次
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-500 sm:text-sm">
              全样本中各板式（念、诗、引等）的累计出现次数；数据来自{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[11px] text-gold-200/90">
                changfa_distribution.json
              </code>
              。
            </p>
          </div>
          <div className="overflow-x-auto pb-4">
            <ChangfaBar data={changfaDistribution} />
          </div>
        </section>

        <section
          className="mt-14 space-y-4 border-t border-gold-500/15 pt-12"
          aria-labelledby="perf-changfa-race-title"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 shrink-0">
              <h3 id="perf-changfa-race-title" className={blockTitleClass}>
                板式与朝代对比
              </h3>
              <h4 className="mt-2 text-sm font-medium text-stone-400">
                条形竞速
              </h4>
            </div>
            <div className="max-w-xl space-y-3 text-sm leading-relaxed text-stone-500">
              <p>
                柱状图在商周与秦汉两个切片之间自动轮播；数据来自本地{' '}
                <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
                  changfa_by_dynasty.json
                </code>
                。
              </p>
              <p className="rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-stone-400">
                动态排序 | 百分比 = 该唱法出现次数 ÷ 本朝剧本总数
              </p>
            </div>
          </div>
          <div className="overflow-x-auto pb-4">
            <ChangfaBarRace data={changfaByDynasty} />
          </div>
        </section>
      </div>
    </div>
  )
}
