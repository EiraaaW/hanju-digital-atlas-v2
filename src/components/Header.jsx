import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: '首页', to: '/', hash: '', end: true },
  { label: '简介', to: '/', hash: 'intro' },
  { label: '概览', to: '/', hash: 'overview' },
  { label: '主题', to: '/', hash: 'themes' },
  { label: '可视化', to: '/', hash: 'viz' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/20 bg-black/80 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex max-w-xl flex-col gap-0.5 transition hover:opacity-95"
        >
          <span className="font-display text-[15px] leading-snug tracking-wide text-gold-400 sm:text-lg">
            汉剧剧目知识图谱与叙事结构可视化研究
          </span>
          <span className="text-[11px] text-stone-500">
            Knowledge graph · Narrative structure · DH exhibition
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-1 sm:gap-1.5"
          aria-label="主导航"
        >
          {navItems.map((item) => {
            if (item.hash) {
              return (
                <Link
                  key={item.label}
                  to={{ pathname: '/', hash: item.hash }}
                  className="rounded-lg px-3 py-2 text-[13px] text-stone-400 transition hover:bg-red-950/40 hover:text-gold-200"
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-[13px] transition',
                    isActive
                      ? 'bg-gradient-to-r from-red-950/80 to-black text-gold-200 ring-1 ring-gold-500/30'
                      : 'text-stone-400 hover:bg-red-950/35 hover:text-stone-200',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
