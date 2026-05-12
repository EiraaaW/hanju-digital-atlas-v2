import { Link } from 'react-router-dom'
import HangdangChord from '@/components/HangdangChord'
import hangdangChord from '@/data/hangdang_chord.json'

export function CharactersPage() {
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
              Characters · hangdang
            </p>
            <h1 className="mt-2 font-display text-2xl text-stone-50 md:text-3xl">
              角色人物
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-stone-500">
            基于样本剧目中角色与行当的标注，以弦图形式呈现十大行当之间的共现强度；悬停可查看各行当下的代表角色（节选展示）。
          </p>
        </header>

        <div className="overflow-x-auto pb-4">
          <HangdangChord data={hangdangChord} />
        </div>
      </div>
    </div>
  )
}
