import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gold-500/10 bg-black/50 py-8 text-center text-[11px] leading-relaxed text-stone-600">
        汉剧剧目知识图谱与叙事结构可视化研究 · 本地数据 · 无后端 · 数字人文展览向界面
      </footer>
    </div>
  )
}
