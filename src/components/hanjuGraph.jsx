import { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import Papa from 'papaparse'
import {
  COLOR_MAP,
  SPECIAL_ROLES,
  getRoleCharacteristics,
  inferRelationship,
} from '@/data/hanjuData.js'

const DEFAULT_CSV_URL = '/data/hanju_metadata_all.csv'

function getRoleColor(roleType) {
  const role = roleType || ''
  for (const [key, color] of Object.entries(COLOR_MAP)) {
    if (role.includes(key)) return color
  }
  return '#8b7d6b'
}

function normalizePlayName(row, fallbackIndex) {
  const fromTitle = String(row['剧目名称'] || '').trim()
  if (fromTitle) return fromTitle

  const fromFile = String(row['剧本文件名'] || '').trim()
  if (fromFile) return fromFile.replace(/\.pdf$/i, '')

  return `剧本${fallbackIndex + 1}`
}

export default function HanjuGraph({ csvUrl = DEFAULT_CSV_URL }) {
  const mainChartRef = useRef(null)
  const egoChartRef = useRef(null)
  const chartInstance = useRef(null)
  const egoChartInstance = useRef(null)
  const characterMap = useRef(new Map())

  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('正在加载人物关系数据...')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarActive, setSidebarActive] = useState(false)
  const [egoActive, setEgoActive] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [egoDesc, setEgoDesc] = useState(
    '鼠标悬浮连线或节点查看具体人物关系...',
  )

  const renderEgoGraph = useCallback((centerName, centerInfo) => {
    if (!egoChartInstance.current && egoChartRef.current) {
      egoChartInstance.current = echarts.init(egoChartRef.current)
    }
    if (!egoChartInstance.current) return

    const centerColor = getRoleColor(centerInfo.primaryRole)
    const egoNodes = [
      {
        name: centerName,
        symbolSize: 48,
        itemStyle: {
          color: centerColor,
          shadowBlur: 20,
          shadowColor: centerColor,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'Noto Serif SC',
          textBorderColor: '#000',
          textBorderWidth: 3,
        },
      },
    ]
    const egoLinks = []

    const topRelations = Array.from(centerInfo.relations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    topRelations.forEach(([targetName, count]) => {
      const targetInfo = characterMap.current.get(targetName)
      if (!targetInfo) return

      const targetColor = getRoleColor(targetInfo.primaryRole)
      egoNodes.push({
        name: targetName,
        symbolSize: Math.max(targetInfo.degree * 2, 18),
        itemStyle: {
          color: targetColor,
          borderColor: '#fde68a',
          borderWidth: 1,
        },
        label: {
          show: true,
          fontSize: 13,
          color: '#f8fafc',
          fontWeight: 'bold',
          textBorderColor: '#0f0f1a',
          textBorderWidth: 2,
        },
      })

      egoLinks.push({
        source: centerName,
        target: targetName,
        value: count,
        relationLabel: inferRelationship(
          centerInfo.primaryRole,
          targetInfo.primaryRole,
        ),
        lineStyle: {
          width: Math.min(count + 1, 6),
          color: 'rgba(251, 191, 36, 0.4)',
          curveness: 0.2,
        },
        label: { show: false },
      })
    })

    egoChartInstance.current.setOption({
      backgroundColor: 'transparent',
      tooltip: { show: false },
      animationDurationUpdate: 800,
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: { repulsion: 400, edgeLength: 100, gravity: 0.1 },
          data: egoNodes,
          links: egoLinks,
          roam: true,
          edgeSymbol: ['none', 'none'],
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 5, color: '#fbbf24', opacity: 1 },
            label: { show: true, fontSize: 15 },
          },
        },
      ],
    })
    egoChartInstance.current.resize()

    egoChartInstance.current.off('mouseover')
    egoChartInstance.current.on('mouseover', (params) => {
      if (params.dataType === 'edge') {
        setEgoDesc(
          `关联: ${params.data.source} -> ${params.data.target} | 推演关系: ${params.data.relationLabel} | 共演 ${params.data.value} 次`,
        )
      } else if (params.dataType === 'node' && params.data.name !== centerName) {
        const edge = egoLinks.find(
          (link) =>
            (link.source === centerName && link.target === params.data.name) ||
            (link.target === centerName && link.source === params.data.name),
        )
        if (edge) {
          setEgoDesc(
            `关联: ${edge.source} -> ${edge.target} | 推演关系: ${edge.relationLabel} | 共演 ${edge.value} 次`,
          )
        }
      }
    })

    egoChartInstance.current.off('mouseout')
    egoChartInstance.current.on('mouseout', () => {
      setEgoDesc('鼠标悬浮连线或节点查看具体人物关系...')
    })
  }, [])

  const showDetail = useCallback(
    (name) => {
      const info = characterMap.current.get(name)
      if (!info) return

      setSelectedCharacter({ name, info })
      setSidebarActive(true)
      setEgoActive(true)
      window.setTimeout(() => renderEgoGraph(name, info), 80)
    },
    [renderEgoGraph],
  )

  const renderGraph = useCallback((nodes, links) => {
    if (!chartInstance.current) return

    chartInstance.current.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 15, 26, 0.95)',
        borderColor: 'rgba(251, 191, 36, 0.4)',
        borderWidth: 1,
        textStyle: { color: '#f8fafc', fontFamily: 'Noto Serif SC' },
        formatter(params) {
          if (params.dataType === 'node') {
            const info = characterMap.current.get(params.data.name)
            return `
              <div style="font-weight:bold;font-size:16px;margin-bottom:6px;color:#fbbf24;">${params.data.name}</div>
              行当：<span style="color:#cbd5e1;">${info?.primaryRole || '未知'}</span><br/>
              出场剧目数：<span style="color:#f59e0b;font-weight:bold;">${params.data.value}</span>
            `
          }
          if (params.dataType === 'edge') {
            return `
              <div style="font-weight:bold;color:#fde68a;margin-bottom:4px;">${params.data.source} -> ${params.data.target}</div>
              共演次数：${params.data.value}
            `
          }
          return ''
        },
      },
      series: [
        {
          name: '戏缘浮生',
          type: 'graph',
          layout: 'force',
          data: nodes,
          links,
          roam: true,
          draggable: true,
          label: { position: 'right', formatter: '{b}' },
          force: { repulsion: 150, edgeLength: [50, 150], gravity: 0.1 },
          lineStyle: {
            color: 'rgba(251, 191, 36, 0.4)',
            curveness: 0.2,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 5, color: '#fbbf24', opacity: 1 },
          },
        },
      ],
    })
  }, [])

  const processRows = useCallback(
    (rows) => {
      const edgeMap = new Map()
      characterMap.current.clear()

      rows.forEach((row, rowIndex) => {
        const playName = normalizePlayName(row, rowIndex)
        const roleMappingStr = String(row['角色-行当映射'] || '').trim()
        if (!roleMappingStr) return

        const roles = roleMappingStr
          .split(/[；;]/)
          .map((item) => item.trim())
          .filter(Boolean)
        const charsInPlay = []

        roles.forEach((roleStr) => {
          const match = roleStr.match(/(.+?)[(（](.+?)[)）]/)
          const charName = (match ? match[1] : roleStr).trim()
          const roleType = (match ? match[2] : '未知行当').trim()
          if (!charName) return

          charsInPlay.push(charName)

          if (!characterMap.current.has(charName)) {
            characterMap.current.set(charName, {
              plays: [],
              degree: 0,
              relations: new Map(),
              primaryRole: roleType,
            })
          }

          const character = characterMap.current.get(charName)
          character.plays.push({ playName, roleType })
          character.degree += 1
        })

        for (let i = 0; i < charsInPlay.length; i += 1) {
          for (let j = i + 1; j < charsInPlay.length; j += 1) {
            const c1 = charsInPlay[i]
            const c2 = charsInPlay[j]
            const pair = [c1, c2].sort()
            const key = `${pair[0]}|${pair[1]}`

            edgeMap.set(key, (edgeMap.get(key) || 0) + 1)

            const c1Data = characterMap.current.get(c1)
            const c2Data = characterMap.current.get(c2)
            c1Data.relations.set(c2, (c1Data.relations.get(c2) || 0) + 1)
            c2Data.relations.set(c1, (c2Data.relations.get(c1) || 0) + 1)
          }
        }
      })

      const nodes = Array.from(characterMap.current.entries()).map(
        ([name, info]) => {
          const primaryColor = getRoleColor(info.primaryRole)
          return {
            name,
            value: info.degree,
            symbolSize: Math.min(Math.max(info.degree * 3 + 10, 12), 45),
            itemStyle: {
              color: primaryColor,
              borderColor: '#fde68a',
              borderWidth: info.degree > 5 ? 2 : 0.5,
              shadowBlur: info.degree > 5 ? 10 : 0,
              shadowColor: primaryColor,
            },
            label: {
              show: info.degree > 2,
              color: '#e2e8f0',
              fontFamily: 'Noto Serif SC',
              textBorderColor: '#0f0f1a',
              textBorderWidth: 2,
            },
          }
        },
      )

      const links = Array.from(edgeMap.entries()).map(([key, weight]) => {
        const [source, target] = key.split('|')
        return {
          source,
          target,
          value: weight,
          lineStyle: {
            width: Math.min(weight * 0.8, 8),
            opacity: 0.3 + Math.min(weight * 0.1, 0.5),
          },
        }
      })

      setGraphData({ nodes, links })
      renderGraph(nodes, links)
      setStatusMsg(`已生成 ${nodes.length} 位人物、${links.length} 条共演关系`)
    },
    [renderGraph],
  )

  const focusCharacter = useCallback(
    (name) => {
      const nodeIndex = graphData.nodes.findIndex((node) => node.name === name)
      if (nodeIndex !== -1) {
        chartInstance.current?.dispatchAction({ type: 'downplay' })
        chartInstance.current?.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: nodeIndex,
        })
        chartInstance.current?.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: nodeIndex,
        })
      }
      setSearchQuery(name)
      showDetail(name)
    },
    [graphData.nodes, showDetail],
  )

  const searchCharacter = useCallback(() => {
    const query = searchQuery.trim()
    if (!query) return

    let targetName = characterMap.current.has(query) ? query : ''
    if (!targetName) {
      targetName =
        Array.from(characterMap.current.keys()).find((name) =>
          name.includes(query),
        ) || ''
    }

    if (targetName) {
      focusCharacter(targetName)
    } else {
      setStatusMsg(`未找到「${query}」，请尝试其他人物名`)
    }
  }, [focusCharacter, searchQuery])

  useEffect(() => {
    if (!mainChartRef.current) return undefined

    chartInstance.current = echarts.init(mainChartRef.current)
    chartInstance.current.on('click', (params) => {
      if (params.dataType === 'node') showDetail(params.data.name)
    })

    const handleResize = () => {
      chartInstance.current?.resize()
      egoChartInstance.current?.resize()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mainChartRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      egoChartInstance.current?.dispose()
      chartInstance.current = null
      egoChartInstance.current = null
    }
  }, [showDetail])

  useEffect(() => {
    let cancelled = false

    async function loadCsv() {
      try {
        setLoading(true)
        setError('')
        setStatusMsg('正在加载人物关系数据...')

        const response = await fetch(csvUrl)
        if (!response.ok) throw new Error(`CSV 加载失败：HTTP ${response.status}`)
        const csvText = await response.text()

        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        })

        if (parsed.errors?.length) {
          throw new Error(parsed.errors[0].message || 'CSV 解析失败')
        }

        if (!cancelled) {
          processRows(parsed.data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || '人物关系网络加载失败')
          setLoading(false)
        }
      }
    }

    loadCsv()

    return () => {
      cancelled = true
    }
  }, [csvUrl, processRows])

  return (
    <div className="relative h-[min(78vh,760px)] min-h-[620px] w-full overflow-hidden rounded-xl bg-[#0f0f1a] font-serif text-slate-50">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_50%_50%,rgba(30,27,75,0.4)_0%,rgba(10,10,15,0.8)_100%)]"
        aria-hidden
      />

      <div className="pointer-events-none absolute left-0 top-0 z-20 flex w-full items-start justify-between p-4 sm:p-6">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="pointer-events-auto rounded-xl border border-amber-500/20 bg-[#0f0f1a]/75 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <h3 className="font-display text-2xl font-bold tracking-widest text-amber-500 drop-shadow-md">
              戏缘浮生
            </h3>
            <p className="mb-4 mt-1 text-xs tracking-wider text-slate-400">
              汉剧人物关系共现网络图谱
            </p>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') searchCharacter()
                }}
                placeholder="检索人物，如刘邦、韩信"
                className="block w-full rounded-lg border border-amber-900/50 bg-slate-900/60 p-2.5 pr-11 text-sm text-amber-100 outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="button"
                onClick={searchCharacter}
                className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-amber-500 transition hover:text-amber-300"
                aria-label="搜索人物"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {statusMsg}
            </p>
          </div>
        </div>
      </div>

      <div ref={mainChartRef} className="absolute inset-0 z-10 h-full w-full" />

      {(loading || error) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl border border-amber-500/20 bg-[#0f0f1a]/80 p-8 text-center shadow-2xl">
            {error ? (
              <>
                <h3 className="text-xl font-bold text-red-300">加载失败</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {error}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
                <h3 className="mt-4 text-xl font-bold text-amber-500">
                  编织戏缘浮生
                </h3>
                <p className="mt-2 text-sm text-slate-400">{statusMsg}</p>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className={[
          'absolute bottom-5 left-5 z-40 flex h-[340px] w-[min(420px,calc(100%-2.5rem))] flex-col rounded-2xl border border-amber-500/20 bg-[#0f0f1a]/75 shadow-2xl backdrop-blur-md transition-all duration-300',
          egoActive
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-5 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="flex items-center justify-between rounded-t-2xl border-b border-amber-900/40 bg-slate-900/30 p-4">
          <h3 className="min-w-0 truncate text-lg font-bold tracking-wide text-amber-400">
            【{selectedCharacter?.name}】的核心圈
          </h3>
          <button
            type="button"
            onClick={() => setEgoActive(false)}
            className="shrink-0 text-slate-400 transition hover:text-amber-400"
            aria-label="关闭核心圈"
          >
            x
          </button>
        </div>
        <div className="relative min-h-0 flex-1">
          <div ref={egoChartRef} className="h-full w-full" />
          <div className="pointer-events-none absolute bottom-4 left-1/2 max-w-[92%] -translate-x-1/2 truncate rounded-full border border-amber-900/50 bg-slate-900/90 px-4 py-2 text-xs text-slate-300 shadow-lg">
            {egoDesc}
          </div>
        </div>
      </div>

      <aside
        className={[
          'absolute bottom-4 top-4 z-50 flex w-[min(400px,calc(100%-2rem))] flex-col rounded-l-xl border border-amber-500/20 bg-[#0f0f1a]/85 shadow-2xl backdrop-blur-md transition-all duration-300',
          sidebarActive ? 'right-0' : '-right-[430px]',
        ].join(' ')}
      >
        <div className="relative border-b border-amber-900/40 bg-slate-900/30 p-6">
          <button
            type="button"
            onClick={() => {
              setSidebarActive(false)
              setEgoActive(false)
              chartInstance.current?.dispatchAction({ type: 'downplay' })
            }}
            className="absolute right-5 top-5 text-slate-400 transition hover:text-amber-400"
            aria-label="关闭人物详情"
          >
            x
          </button>
          <h2 className="pr-8 text-3xl font-bold text-amber-200">
            {selectedCharacter?.name}
          </h2>
          <span className="text-sm text-amber-500">
            共参演 {selectedCharacter?.info.degree} 部剧
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <section className="mb-8">
            <h3 className="mb-4 border-l-2 border-amber-600 pl-2 text-sm text-slate-400">
              参演剧目及形象
            </h3>
            <div className="space-y-3">
              {selectedCharacter?.info.plays.map((play, index) => {
                let traits = getRoleCharacteristics(play.roleType)
                if (
                  SPECIAL_ROLES[selectedCharacter.name] &&
                  SPECIAL_ROLES[selectedCharacter.name][play.playName]
                ) {
                  traits = SPECIAL_ROLES[selectedCharacter.name][play.playName]
                }

                return (
                  <article
                    key={`${play.playName}-${index}`}
                    className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 transition hover:border-amber-900/80"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-amber-900/30 pb-2">
                      <span className="font-bold text-amber-300">
                        《{play.playName}》
                      </span>
                      <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        饰：
                        <span className="text-amber-500">{play.roleType}</span>
                      </span>
                    </div>
                    <div className="space-y-2 text-xs leading-relaxed text-slate-400">
                      <p>
                        <span className="font-medium text-slate-500">
                          性格侧重：
                        </span>
                        {traits.charTrait}
                      </p>
                      <p>
                        <span className="font-medium text-slate-500">
                          表演风格：
                        </span>
                        {traits.actStyle}
                      </p>
                      <p>
                        <span className="font-medium text-slate-500">
                          脸谱扮相：
                        </span>
                        {traits.makeup}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-4 border-l-2 border-amber-600 pl-2 text-sm text-slate-400">
              紧密关联（共演）
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCharacter &&
                Array.from(selectedCharacter.info.relations.entries())
                  .sort((a, b) => b[1] - a[1])
                  .map(([relName, count]) => (
                    <button
                      key={relName}
                      type="button"
                      onClick={() => focusCharacter(relName)}
                      className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-amber-900/40 hover:text-amber-200"
                    >
                      {relName}
                      <span className="ml-1 text-slate-500">({count})</span>
                    </button>
                  ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
