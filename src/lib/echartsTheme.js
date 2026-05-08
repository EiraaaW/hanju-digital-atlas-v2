import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

export { echarts }

export function registerHanjuTheme() {
  echarts.registerTheme('hanju-dark', {
    color: ['#c9a24d', '#c94a4a', '#6b8f71', '#7eb8da'],
    backgroundColor: 'transparent',
    textStyle: { color: '#e7e5e4' },
    title: {
      textStyle: { color: '#fafaf9' },
      subtextStyle: { color: '#a8a29e' },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: '#57534e' } },
      axisLabel: { color: '#a8a29e' },
    },
    valueAxis: {
      splitLine: { lineStyle: { color: '#292524', type: 'dashed' } },
      axisLabel: { color: '#a8a29e' },
    },
    legend: { textStyle: { color: '#d6d3d1' } },
    tooltip: {
      backgroundColor: 'rgba(12, 14, 20, 0.94)',
      borderColor: 'rgba(201, 162, 77, 0.35)',
      textStyle: { color: '#fafaf9' },
    },
  })
}
