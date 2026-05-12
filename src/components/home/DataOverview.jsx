import { Link } from 'react-router-dom'
import hangdangByDynasty from '@/data/hangdang_by_dynasty.json'
import projectHome from '@/data/project-home.json'

function StatCard({ label, value, suffix, to }) {
  const body = (
    <>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-900/25 blur-2xl"
        aria-hidden
      />
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 flex items-baseline gap-1 font-display">
        <span className="text-4xl tabular-nums text-gold-400 md:text-5xl">
          {value}
        </span>
        {suffix ? (
          <span className="text-sm font-sans text-stone-500">{suffix}</span>
        ) : null}
      </p>
    </>
  )

  const shell =
    'relative overflow-hidden rounded-2xl border border-gold-500/15 bg-[linear-gradient(145deg,rgba(24,6,10,0.92)_0%,rgba(7,8,12,0.96)_100%)] p-6 shadow-panel transition hover:border-gold-400/30'

  if (to) {
    return (
      <Link
        to={to}
        className={`${shell} block outline-none ring-gold-500/0 transition hover:ring-2 focus-visible:ring-gold-500/40`}
      >
        {body}
      </Link>
    )
  }

  return <div className={shell}>{body}</div>
}

export function DataOverview() {
  const { stats } = projectHome

  const items = [
    { label: '剧目总数', value: stats.plays, suffix: '部' },
    { label: '人物数量', value: stats.characters, suffix: '位' },
    {
      label: '行当种类',
      value: hangdangByDynasty.hangdang.length,
      suffix: '类',
      to: '/data/hangdang',
    },
    { label: '唱腔数量', value: stats.singingStyles, suffix: '种' },
  ]

  return (
    <section
      id="overview"
      className="relative border-y border-white/[0.06] bg-black/35 py-16 backdrop-blur-[2px] sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(185,28,28,0.12),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Data overview
            </p>
            <h2 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              数据概览
            </h2>
          </div>
          <p className="max-w-md text-sm text-stone-500">
            指标为研究样本规模的示意统计，可在后端管线就绪后替换为实时聚合。
          </p>
        </header>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
