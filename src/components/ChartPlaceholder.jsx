import { useEffect, useRef } from 'react'
import { echarts } from '@/lib/echartsTheme'

export function ChartPlaceholder() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const chart = echarts.init(el, 'hanju-dark', { renderer: 'canvas' })
    chart.setOption({
      title: {
        text: '叙事结构 · 示例面板',
        subtext: '场次权重 / 情感指数（示意）',
        left: 'center',
        top: 12,
        textStyle: { fontSize: 15, fontWeight: 600 },
        subtextStyle: { fontSize: 11, color: '#a8a29e' },
      },
      legend: {
        bottom: 8,
        data: ['场次权重', '情感指数'],
        textStyle: { fontSize: 11 },
      },
      grid: { left: 52, right: 28, top: 88, bottom: 52 },
      xAxis: {
        type: 'category',
        data: ['起', '承', '转', '合', '尾声'],
        axisLine: { lineStyle: { color: '#44403c' } },
        axisLabel: { color: '#a8a29e', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#292524', type: 'dashed' } },
        axisLabel: { color: '#a8a29e', fontSize: 11 },
      },
      series: [
        {
          name: '场次权重',
          type: 'bar',
          data: [32, 48, 56, 44, 28],
          barWidth: '34%',
          itemStyle: {
            color: 'rgba(201, 162, 77, 0.85)',
            borderRadius: [6, 6, 0, 0],
          },
        },
        {
          name: '情感指数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          data: [22, 38, 62, 48, 36],
          lineStyle: { width: 2, color: '#d46363' },
          itemStyle: {
            color: '#f87171',
            borderWidth: 1,
            borderColor: '#fecaca',
          },
          areaStyle: {
            color: 'rgba(185, 28, 28, 0.22)',
          },
        },
      ],
    })

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [])

  return (
    <div
      ref={ref}
      className="h-[340px] w-full rounded-2xl border border-gold-500/15 bg-[linear-gradient(180deg,rgba(18,10,14,0.92)_0%,rgba(7,8,12,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:h-[380px]"
      role="img"
      aria-label="叙事结构示例图表"
    />
  )
}
