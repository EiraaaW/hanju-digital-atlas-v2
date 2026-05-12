import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { CharactersPage } from '@/pages/CharactersPage'
import { HangdangPage } from '@/pages/HangdangPage'
import { Home } from '@/pages/Home'
import { PlotEmotionPage } from '@/pages/PlotEmotionPage'
import { RepertoirePage } from '@/pages/RepertoirePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/themes/repertoire" element={<RepertoirePage />} />
          <Route path="/themes/plot-emotion" element={<PlotEmotionPage />} />
          <Route path="/themes/characters" element={<CharactersPage />} />
          <Route path="/data/hangdang" element={<HangdangPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}