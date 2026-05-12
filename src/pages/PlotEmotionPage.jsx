import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import NarrativeCard from '@/components/NarrativeCard'
import playsData from '@/data/plays_data.json'

const PLAY_IDS = Object.keys(playsData)

export function PlotEmotionPage() {
  const [selectedPlayId, setSelectedPlayId] = useState(
    () => PLAY_IDS[0] ?? '',
  )

  const plotPlaySample = useMemo(
    () => ({
      _name: selectedPlayId,
      ...playsData[selectedPlayId],
    }),
    [selectedPlayId],
  )

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

        <header className="mb-8 flex flex-col gap-4 border-b border-gold-500/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
              Plot · emotion
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              情节与情感
            </h1>
          </div>
          <div className="flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:max-w-none">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm text-stone-500">
              <span className="text-[11px] uppercase tracking-wider text-stone-600">
                选择剧目
              </span>
              <select
                value={selectedPlayId}
                onChange={(e) => setSelectedPlayId(e.target.value)}
                className="w-full min-w-[12rem] rounded-xl border border-white/[0.08] bg-[#141018]/95 px-3 py-2.5 font-medium text-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none ring-gold-500/30 transition focus:border-gold-500/35 focus:ring-2"
              >
                {PLAY_IDS.map((id) => (
                  <option key={id} value={id}>
                    《{id}》
                  </option>
                ))}
              </select>
            </label>
            <p className="flex-1 text-sm leading-relaxed text-stone-500 sm:min-w-[14rem]">
              以场次占比为横轴、情绪强度为纵轴，标注节奏分区与高潮位置；数据来自本地{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
                plays_data.json
              </code>
              。
            </p>
          </div>
        </header>

        <div className="overflow-x-auto pb-4">
          <NarrativeCard playData={plotPlaySample} />
        </div>
      </div>
    </div>
  )
}
