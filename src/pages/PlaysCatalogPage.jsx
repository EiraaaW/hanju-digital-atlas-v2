import { Link } from 'react-router-dom'
import PlayScriptCard from '@/components/PlayScriptCard'
import hanjuPlays from '@/data/hanju.json'

export function PlaysCatalogPage() {
  return (
    <div className="relative min-h-screen pb-24 pt-8 sm:pt-10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6">
          <Link
            to="/#overview"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-gold-300"
          >
            <span aria-hidden>←</span>
            返回数据概览
          </Link>
        </p>

        <header className="mb-10 border-b border-gold-500/15 pb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-500/80">
            Repertoire · scripts
          </p>
          <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
            剧目剧本目录
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
            共 <span className="tabular-nums text-gold-400">{hanjuPlays.length}</span>{' '}
            部样本剧目卡片；数据来自{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              hanju.json
            </code>
            。PDF 置于{' '}
            <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[12px] text-gold-200/90">
              /public/pdfs/
            </code>
            ，点击「查看 PDF」后按需加载预览。
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hanjuPlays.map((play) => (
            <PlayScriptCard key={play.id} play={play} />
          ))}
        </div>
      </div>
    </div>
  )
}
