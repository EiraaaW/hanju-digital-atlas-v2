import { Link } from 'react-router-dom'
import SankeySTH from '@/components/SankeySTH'
import sankeySth from '@/data/sankey_shengqiang_theme_hangdang.json'

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

        <header className="mb-8 flex flex-col gap-4 border-b border-gold-500/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Performance · sankey
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              唱腔与表演
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500">
            桑基图串联「声腔—主题—行当」三类节点，边宽表示样本中的关联频次；数据来自本地{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              sankey_shengqiang_theme_hangdang.json
            </code>
            。
          </p>
        </header>

        <div className="overflow-x-auto pb-4">
          <SankeySTH data={sankeySth} />
        </div>
      </div>
    </div>
  )
}
