import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { COLOR_MAP, getRoleCharacteristics } from '@/data/hanjuData.js'

export default function HanjuGraph({ csvUrl }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  // 简化 CSV 解析
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim())
    const result = []
    
    if (lines.length < 2) return result
    
    const headers = lines[0].split(',').map(h => h.trim())
    
    for (let i = 1; i < lines.length; i++) {
      const values = []
      let current = ''
      let inQuotes = false
      
      for (let j = 0; j < lines[i].length; j++) {
        const c = lines[i][j]
        if (c === '"' || c === '“' || c === '”') {
          inQuotes = !inQuotes
        } else if (c === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += c
        }
      }
      values.push(current.trim())
      
      const row = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })
      result.push(row)
    }
    return result
  }

  // 获取行当主类别
  const getPrimaryHangdang = (hangdang) => {
    if (!hangdang) return '杂'
    const map = {
      '生': '生', '三生': '生', '七小': '生', '小生': '生', '老生': '生',
      '旦': '旦', '四旦': '旦', '八贴': '旦', '贴': '旦', '花旦': '旦', '青衣': '旦', '正旦': '旦', '跷旦': '旦', '九夫': '旦', '老旦': '旦',
      '净': '净', '二净': '净', '大花脸': '净',
      '末': '末', '一末': '末',
      '丑': '丑', '五丑': '丑',
      '杂': '杂', '十杂': '杂',
      '外': '外', '六外': '外'
    }
    for (const [key, val] of Object.entries(map)) {
      if (hangdang.includes(key)) return val
    }
    return '杂'
  }

  const getCategoryIndex = (primary) => {
    const cats = ['生', '旦', '净', '末', '丑', '杂', '外', '贴']
    const idx = cats.indexOf(primary)
    return idx >= 0 ? idx : 5
  }

  useEffect(() => {
    let cleanup = false

    const init = async () => {
      try {
        console.log('加载:', csvUrl)
        const response = await fetch(csvUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        let csvText = await response.text()
        console.log('CSV 大小:', csvText.length)
        
        // 移除 UTF-8 BOM（如果存在）
        if (csvText.charCodeAt(0) === 0xFEFF) {
          csvText = csvText.slice(1)
          console.log('已移除 UTF-8 BOM')
        }
        
        const csvData = parseCSV(csvText)
        console.log('解析行数:', csvData.length)
        
        // 构建节点和链接
        const nodeMap = new Map()
        const linkMap = new Map()
        
        csvData.forEach((row, idx) => {
          const playName = row['剧目名称'] || `剧本${idx}`
          const roleMapping = row['角色-行当映射'] || ''
          const protagonists = (row['主角'] || '').split('；').filter(s => s.trim())
          
          // 解析角色
          const roles = []
          roleMapping.split('；').forEach(part => {
            const match = part.match(/(.+?)（(.+?)）/)
            if (match && match[1] && match[2]) {
              const name = match[1].trim()
              const hang = match[2].trim()
              roles.push({ name, hang })
              
              if (!nodeMap.has(name)) {
                nodeMap.set(name, {
                  name,
                  hangdang: hang,
                  isProtagonist: protagonists.includes(name),
                  count: 0,
                  plays: []
                })
              }
              const node = nodeMap.get(name)
              node.count++
              if (!node.plays.includes(playName)) {
                node.plays.push(playName)
              }
            }
          })
          
          // 建立链接
          for (let i = 0; i < roles.length; i++) {
            for (let j = i + 1; j < roles.length; j++) {
              const key = [roles[i].name, roles[j].name].sort().join('|')
              if (!linkMap.has(key)) {
                linkMap.set(key, {
                  source: roles[i].name,
                  target: roles[j].name,
                  value: 0,
                  plays: []
                })
              }
              const link = linkMap.get(key)
              link.value++
              if (!link.plays.includes(playName)) {
                link.plays.push(playName)
              }
            }
          }
        })

        // 转换节点数组
        const nodes = Array.from(nodeMap.values()).map(node => {
          const primary = getPrimaryHangdang(node.hangdang)
          return {
            name: node.name,
            symbolSize: Math.max(20, Math.min(60, node.count * 8 + 12)),
            category: getCategoryIndex(primary),
            itemStyle: {
              color: COLOR_MAP[primary] || '#64748b',
              borderColor: node.isProtagonist ? '#fbbf24' : 'transparent',
              borderWidth: node.isProtagonist ? 3 : 0,
              shadowBlur: 15
            },
            hangdang: node.hangdang,
            isProtagonist: node.isProtagonist,
            plays: node.plays.slice(0, 5),
            count: node.count
          }
        })
        
        const links = Array.from(linkMap.values()).map(link => ({
          source: link.source,
          target: link.target,
          value: link.value,
          lineStyle: {
            width: Math.max(0.5, Math.min(10, link.value * 1.5)),
            curveness: 0.2
          },
          plays: link.plays.slice(0, 3)
        }))
        
        const categories = [
          { name: '生行', itemStyle: { color: '#f59e0b' } },
          { name: '旦行', itemStyle: { color: '#fbbf24' } },
          { name: '净行', itemStyle: { color: '#dc2626' } },
          { name: '末行', itemStyle: { color: '#b45309' } },
          { name: '丑行', itemStyle: { color: '#10b981' } },
          { name: '杂行', itemStyle: { color: '#64748b' } },
          { name: '外行', itemStyle: { color: '#8b5cf6' } },
          { name: '贴行', itemStyle: { color: '#f472b6' } }
        ]
        
        console.log('节点数:', nodes.length, '链接数:', links.length)
        
        if (cleanup || !chartRef.current) return
        
        // 初始化图表
        chartInstance.current = echarts.init(chartRef.current)
        
        chartInstance.current.on('click', (params) => {
          if (params.dataType === 'node') {
            setSelectedNode(params.data)
          }
        })
        
        chartInstance.current.setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 15, 26, 0.95)',
            borderColor: 'rgba(120, 53, 15, 0.5)',
            formatter: (params) => {
              if (params.dataType === 'node') {
                const traits = getRoleCharacteristics(params.data.hangdang)
                return `
                  <div style="max-width:280px;color:#fef3c7;">
                    <div style="font-size:16px;font-weight:700;">${params.data.name}</div>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                      <span style="background:${params.data.itemStyle.color};color:#0f0f1a;padding:2px 8px;border-radius:4px;font-size:12px;">${params.data.hangdang}</span>
                      ${params.data.isProtagonist ? '<span style="background:#fbbf24;color:#0f0f1a;padding:2px 8px;border-radius:4px;font-size:12px;">主角</span>' : ''}
                    </div>
                    <div style="color:#d97706;font-size:12px;margin-top:8px;">出场 ${params.data.count} 部剧目</div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:4px;">代表剧目：${params.data.plays.join('、')}</div>
                  </div>
                `
              }
              return ''
            }
          },
          legend: {
            data: categories.map(c => c.name),
            bottom: 10,
            left: 'center',
            textStyle: { color: '#9ca3af', fontSize: 12 }
          },
          series: [{
            name: '戏缘浮生',
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            categories,
            roam: true,
            draggable: true,
            force: {
              repulsion: 400,
              gravity: 0.1,
              edgeLength: [80, 200]
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: { width: 8 }
            },
            lineStyle: { color: 'rgba(120, 53, 15, 0.3)', curveness: 0.2 }
          }]
        })
        
        const ro = new ResizeObserver(() => chartInstance.current?.resize())
        ro.observe(chartRef.current)
        
        chartInstance.current._ro = ro
        
        setLoading(false)
      } catch (err) {
        console.error('加载出错:', err)
        setError(err.message || '加载失败')
        setLoading(false)
      }
    }
    
    init()
    
    return () => {
      cleanup = true
      if (chartInstance.current?._ro) {
        chartInstance.current._ro.disconnect()
      }
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [csvUrl])

  return (
    <div className="relative">
      {loading ? (
        <div className="flex h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500" />
            <p className="text-sm text-stone-500">正在加载人物关系网络...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-[500px] items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">加载失败</p>
            <p className="text-xs text-stone-500 mt-2">{error}</p>
          </div>
        </div>
      ) : (
        <div ref={chartRef} className="h-[500px] w-full" />
      )}
      
      {selectedNode && (
        <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-gold-500/15 bg-[#0f0f1a]/95 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-gold-200">{selectedNode.name}</span>
                <span 
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: selectedNode.itemStyle.color, color: '#0f0f1a' }}
                >
                  {selectedNode.hangdang}
                </span>
                {selectedNode.isProtagonist && (
                  <span className="rounded-md bg-yellow-500 px-2 py-0.5 text-xs font-medium text-stone-950">
                    主角
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-stone-400">
                出场 <span className="text-gold-400">{selectedNode.count}</span> 部剧目
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-400 transition hover:border-gold-500/30 hover:text-gold-200"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
