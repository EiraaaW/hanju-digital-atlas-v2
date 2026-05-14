import { useMemo, useState } from 'react'
import EChartsMap from '@/components/EChartsMap'
import mapData from '@/data/map_data.json'

const MapApp = () => {
  const [activeLayer, setActiveLayer] = useState('all')
  const [panelData, setPanelData] = useState(null)

  // ========== 数据处理逻辑 (基于原版业务逻辑) ==========
  const { szMapData, qhMapData } = useMemo(() => {
    const { locationDict, playsData } = mapData
    const groupedLocations = {}

    playsData.forEach((play) => {
      const locs = String(play.location ?? '')
        .split(/[；;]/)
        .map((location) => location.trim())
        .filter(Boolean)

      locs.forEach((locName) => {
        if (!groupedLocations[locName]) {
          const fallbackInfo = {
            modern: '位置待考',
            tag: '历史遗迹',
            coords: [104.19, 35.86],
          }
          groupedLocations[locName] = {
            info: locationDict[locName] || fallbackInfo,
            plays: [],
            periods: new Set(),
          }
        }
        groupedLocations[locName].plays.push(play)
        groupedLocations[locName].periods.add(play.period)
      })
    })

    const mergedByCoords = {}
    Object.keys(groupedLocations).forEach(locName => {
      const locData = groupedLocations[locName]
      if (locData.info?.coords?.length) {
        const [lng, lat] = locData.info.coords
        const coordKey = `${lng.toFixed(1)},${lat.toFixed(1)}`

        if (!mergedByCoords[coordKey]) {
          mergedByCoords[coordKey] = {
            coords: locData.info.coords,
            names: [locName],
            plays: [...locData.plays],
            modern: locData.info.modern,
            tag: locData.info.tag,
            periods: new Set(locData.periods),
          }
        } else {
          if (!mergedByCoords[coordKey].names.includes(locName)) {
            mergedByCoords[coordKey].names.push(locName)
          }
          mergedByCoords[coordKey].plays.push(...locData.plays)
          locData.periods.forEach((period) => {
            mergedByCoords[coordKey].periods.add(period)
          })
          if (locData.info.tag && mergedByCoords[coordKey].tag !== locData.info.tag) {
            if (!mergedByCoords[coordKey].tag.includes(locData.info.tag)) {
              mergedByCoords[coordKey].tag += ` / ${locData.info.tag}`
            }
          }
        }
      }
    })

    const szData = []
    const qhData = []

    Object.values(mergedByCoords).forEach((mergedData) => {
      // 去重
      const uniquePlays = Array.from(
        new Set(mergedData.plays.map((play) => play.id)),
      ).map((id) => mergedData.plays.find((play) => play.id === id))
      mergedData.plays = uniquePlays

      const displayName = mergedData.names.join(' / ')
      const point = {
        name: displayName,
        value: mergedData.coords,
        customData: mergedData,
      }
      
      if (mergedData.periods.has('shangzhou')) szData.push(point)
      if (mergedData.periods.has('qinhan')) qhData.push(point)
    })

    return { szMapData: szData, qhMapData: qhData }
  }, [])

  // ========== UI 交互 ==========
  const handlePointClick = (locName, locData) => {
    setPanelData({ locName, locData })
  }

  const closePanel = () => {
    setPanelData(null)
  }

  const handleLayerSwitch = (layer) => {
    setActiveLayer(layer)
    closePanel()
  }

  return (
    <div className="relative w-full h-screen bg-[#0f0f1a] text-slate-50 overflow-hidden font-['PingFang_SC','Noto_Serif_SC','SimSun',serif]">
      {/* CSS 样式 (建议将这些移入你的 index.css 或全局样式中) */}
      <style>{`
        .texture-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.04"/></svg>');
          pointer-events: none; z-index: 2; mix-blend-mode: overlay;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 15, 26, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(120, 53, 15, 0.5); border-radius: 4px; }
      `}</style>

      {/* 标题 */}
      <div className="pointer-events-none absolute left-1/2 top-8 z-[1000] -translate-x-1/2 text-center">
        <h1 className="whitespace-nowrap font-display text-3xl font-bold tracking-[0.24em] text-amber-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] md:text-5xl">
          汉剧 · 戏梦山河
        </h1>
      </div>

      {/* 底部控制栏 */}
      <div className="absolute bottom-6 left-1/2 z-[1000] flex -translate-x-1/2 gap-2 rounded-2xl border border-amber-900/40 bg-[#0f0f1a]/80 p-2 shadow-2xl backdrop-blur-md transition-all md:bottom-10 md:gap-4">
        <button 
          onClick={() => handleLayerSwitch('all')} 
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 md:px-6 md:text-base ${activeLayer === 'all' ? 'bg-amber-900/50 text-amber-200' : 'text-slate-400 hover:bg-amber-900/30 hover:text-amber-200'}`}
        >
          全部纪元
        </button>
        <button 
          onClick={() => handleLayerSwitch('shangzhou')} 
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-300 md:px-6 md:text-base ${activeLayer === 'shangzhou' ? 'bg-amber-900/50 text-amber-200' : 'text-slate-400 hover:bg-amber-900/30 hover:text-amber-200'}`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>商周风云
        </button>
        <button 
          onClick={() => handleLayerSwitch('qinhan')} 
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-300 md:px-6 md:text-base ${activeLayer === 'qinhan' ? 'bg-amber-900/50 text-amber-200' : 'text-slate-400 hover:bg-amber-900/30 hover:text-amber-200'}`}
        >
          <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]"></span>秦汉岁月
        </button>
      </div>

      {/* 地图与纹理图层 */}
      <EChartsMap 
        szData={szMapData} 
        qhData={qhMapData} 
        activeLayer={activeLayer}
        onPointClick={handlePointClick}
      />
      <div className="texture-overlay"></div>

      {/* 信息侧边栏 */}
      <div className={`absolute top-0 right-0 w-full md:w-[400px] h-full bg-[#0f0f1a]/95 backdrop-blur-xl border-l border-amber-900/30 z-[1001] transition-transform duration-500 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col ${panelData ? 'translate-x-0' : 'translate-x-full'}`}>
        {panelData && (
          <>
            <div className="relative border-b border-amber-900/30 p-8 pb-6">
              <button onClick={closePanel} className="absolute right-6 top-6 text-2xl text-slate-500 transition-colors hover:text-amber-400">x</button>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-sm tracking-widest text-amber-600">{panelData.locData.modern}</p>
                {panelData.locData.tag && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-800 bg-amber-900/40 text-amber-500 font-serif line-clamp-1 break-all">
                    {panelData.locData.tag.split(' / ')[0]}
                  </span>
                )}
              </div>
              <h2 className="font-display text-3xl font-bold tracking-wider text-amber-100">{panelData.locName}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 space-y-6">
              {panelData.locData.plays.map((play, index) => (
                <div key={play.id} className="relative border-l-2 border-amber-900/40 pl-5" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="absolute left-[-5px] top-2 h-2 w-2 rounded-full bg-amber-700"></div>
                  <h3 className="mb-1 font-display text-xl text-amber-200">{play.name}</h3>
                  
                  <p className="mb-3 text-xs tracking-widest text-slate-400">
                    {play.era} · <strong className="text-amber-500 font-normal">主角：{play.protagonist}</strong>
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {play.themes?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-500 border border-amber-900/30">{t}</span>
                    ))}
                    {play.shengqiang && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-900/30 text-amber-300 border border-amber-800/60">
                        声腔：{play.shengqiang}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-4 cursor-pointer text-justify text-sm leading-relaxed text-slate-300 transition-all duration-500 hover:line-clamp-none" title="点击或滑动查看全本">
                    {play.synopsis}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MapApp
