import { useCallback, useMemo, useState } from 'react'
import EChartsMap from '@/components/EChartsMap'
import mapData from '@/data/map_data.json'
import { buildMapScatterSeries } from '@/lib/mapScatterFromPlays'
import { DataOverview } from '@/components/home/DataOverview'
import { ProjectIntro } from '@/components/home/ProjectIntro'
import { ResearchHero } from '@/components/home/ResearchHero'
import { ThemeNavigation } from '@/components/home/ThemeNavigation'
import { useScrollToHash } from '@/hooks/useScrollToHash'

const MAP_LAYERS = [
  { id: 'all', label: '全部' },
  { id: 'shangzhou', label: '商周' },
  { id: 'qinhan', label: '秦汉' },
]

export function Home() {
  useScrollToHash()

  const { locationDict, playsData } = mapData

  const szData = useMemo(
    () => buildMapScatterSeries(locationDict, playsData, 'shangzhou'),
    [locationDict, playsData],
  )

  const qhData = useMemo(
    () => buildMapScatterSeries(locationDict, playsData, 'qinhan'),
    [locationDict, playsData],
  )

  const [mapLayer, setMapLayer] = useState('all')
  const [mapPick, setMapPick] = useState(null)

  const onMapPointClick = useCallback((name, customData) => {
    setMapPick({ name, ...customData })
  }, [])

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

        <div className="mb-4 flex flex-wrap gap-2">
          {MAP_LAYERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMapLayer(t.id)}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                mapLayer === t.id
                  ? 'bg-gold-500 text-stone-950 shadow-sm ring-1 ring-gold-400/70 hover:bg-gold-400'
                  : 'border border-white/10 bg-white/[0.04] text-stone-400 hover:border-gold-500/35 hover:bg-red-950/25 hover:text-gold-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold-500/15 bg-[#07080f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="h-[min(72vh,560px)] w-full min-h-[360px]">
            <EChartsMap
              szData={szData}
              qhData={qhData}
              activeLayer={mapLayer}
              onPointClick={onMapPointClick}
            />
          </div>
        </div>

        {mapPick ? (
          <div className="mt-6 rounded-2xl border border-gold-500/15 bg-black/40 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gold-500/80">
                  选中地点
                </p>
                <p className="mt-1 font-display text-lg text-gold-100">
                  {mapPick.name}
                </p>
                {mapPick.tag ? (
                  <p className="mt-1 text-xs text-stone-500">{mapPick.tag}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMapPick(null)}
                className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-400 transition hover:border-gold-500/30 hover:text-gold-200"
              >
                关闭
              </button>
            </div>
            <ul className="mt-3 max-h-48 list-disc space-y-1 overflow-y-auto pl-5 text-sm text-stone-400">
              {mapPick.plays?.map((p) => (
                <li key={p.id}>
                  <span className="text-stone-200">{p.name}</span>
                  <span className="text-stone-600"> · {p.era}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  )
}
