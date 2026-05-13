import { useState } from 'react'

const SUMMARY_CHAR_LIMIT = 100

const btnPrimary =
  'rounded-lg border border-transparent bg-gold-500 px-3 py-1.5 text-sm font-medium text-stone-950 shadow-sm transition hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400'

const btnGhost =
  'rounded-lg border border-[#7d6a58]/35 bg-[#ebe3d6] px-3 py-1.5 text-sm font-medium text-[#3d3229] transition hover:border-gold-600/40 hover:bg-[#f2ecdf] hover:text-[#2a2218] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500/60'

/**
 * @param {{ play: Record<string, unknown> }} props
 * `play` 需含：title, era, location, summary, themeCategory, hangdang, pdfUrl（与 hanju.json 一致）
 */
export default function PlayScriptCard({ play }) {
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)

  if (!play || typeof play !== 'object') return null

  const title = String(play.title ?? '')
  const era = String(play.era ?? '—')
  const location = String(play.location ?? '—')
  const summary = String(play.summary ?? '')
  const themeCategory = String(play.themeCategory ?? '—')
  const hangdang = String(play.hangdang ?? '—')
  const pdfUrl = typeof play.pdfUrl === 'string' ? play.pdfUrl : ''

  const needsSummaryToggle = summary.length > SUMMARY_CHAR_LIMIT
  const summaryDisplay =
    needsSummaryToggle && !summaryExpanded
      ? summary.slice(0, SUMMARY_CHAR_LIMIT)
      : summary

  return (
    <article className="flex flex-col rounded-lg border border-[#7d6a58]/40 bg-[#dcd0be] p-3 shadow-sm">
      <h3 className="font-brush text-[1.35rem] leading-snug text-[#2a2218] md:text-2xl">
        {title}
      </h3>

      <dl className="mt-3 flex flex-1 flex-col gap-2.5 font-sans text-sm text-[#3d3229]">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#5c4d3f]">
            时代背景
          </dt>
          <dd className="mt-0.5 leading-relaxed">{era}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#5c4d3f]">
            故事地点
          </dt>
          <dd className="mt-0.5 leading-relaxed">{location}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#5c4d3f]">
            剧情简介
          </dt>
          <dd className="mt-0.5 leading-relaxed text-[#3d3229]">
            {summaryDisplay}
            {needsSummaryToggle && !summaryExpanded ? '…' : null}
          </dd>
          {needsSummaryToggle ? (
            <button
              type="button"
              className={`${btnGhost} mt-1.5`}
              onClick={() => setSummaryExpanded((v) => !v)}
              aria-expanded={summaryExpanded}
            >
              {summaryExpanded ? '收起' : '更多'}
            </button>
          ) : null}
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#5c4d3f]">
            主题分类
          </dt>
          <dd className="mt-0.5 leading-relaxed">{themeCategory}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#5c4d3f]">
            主要行当
          </dt>
          <dd className="mt-0.5 leading-relaxed">{hangdang}</dd>
        </div>
      </dl>

      <div className="mt-3 border-t border-[#7d6a58]/30 pt-3">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setPdfOpen((v) => !v)}
          aria-expanded={pdfOpen}
        >
          {pdfOpen ? '收起 PDF' : '查看 PDF'}
        </button>
        {pdfOpen && pdfUrl ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-[#7d6a58]/30 bg-[#ebe3d6]">
            <iframe
              title={`${title} PDF 预览`}
              src={pdfUrl}
              className="h-[min(70vh,520px)] w-full min-h-[320px]"
            />
          </div>
        ) : null}
        {pdfOpen && !pdfUrl ? (
          <p className="mt-2 text-xs text-[#5c4d3f]">暂无 PDF 链接。</p>
        ) : null}
      </div>
    </article>
  )
}
