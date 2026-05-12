import { Link } from 'react-router-dom'
import HangdangBarRace from '@/components/HangdangBarRace'
import HangdangDumbbell from '@/components/HangdangDumbbell'
import hangdangByDynasty from '@/data/hangdang_by_dynasty.json'

export function HangdangPage() {
  return (
    <div className="relative min-h-screen border-y border-white/[0.06] bg-black/35 py-12 backdrop-blur-[2px] sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(185,28,28,0.12),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8">
          <Link
            to="/#overview"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-gold-300"
          >
            <span aria-hidden>←</span>
            返回数据概览
          </Link>
        </p>

        <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Hangdang · dynasty slice
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              行当种类
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500">
            按朝代切片统计汉剧十大行当在样本中的占比结构：条形竞速对比商周与秦汉两段的分布差异，哑铃图展示同一行当在两段之间的位移。
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8 lg:items-start">
          <HangdangBarRace data={hangdangByDynasty} />
          <HangdangDumbbell data={hangdangByDynasty} />
        </div>
      </div>
    </div>
  )
}
