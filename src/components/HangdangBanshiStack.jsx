// HangdangBanshiStack.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

/** 青绿同一色相带内由深到浅递进，与展览中 5bc0be / 2a9d8f 等主色呼应 */
const stackPalette = [
  '#0f2f32',
  '#143d40',
  '#1a4d52',
  '#226368',
  '#2a7a82',
  '#3a9499',
  '#5bc0be',
  '#7fd4cf',
  '#a8e8e2',
];

export default function HangdangBanshiStack({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const hd = data.hangdang;
    const banshi = data.banshi;
    const matrix = data.matrix;
    if (!Array.isArray(hd) || !Array.isArray(banshi) || !Array.isArray(matrix)) return;

    const pctMatrix = matrix.map((row) => {
      const total = row.reduce((a, b) => a + b, 0);
      if (!total) return row.map(() => 0);
      return row.map((v) => +((v / total) * 100).toFixed(1));
    });

    if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

    chartInstance.current.setOption(
      {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(22,22,38,0.95)',
          borderColor: '#5bc0be',
          textStyle: { color: '#e8dcc8', fontSize: 12 },
          formatter(params) {
            let html = `<b>${params[0].axisValue}</b><br/>`;
            params.forEach((p) => {
              html += `${p.marker} ${p.seriesName}: ${p.value}%<br/>`;
            });
            return html;
          },
        },
        legend: {
          data: banshi,
          bottom: 6,
          type: 'scroll',
          textStyle: { color: '#b7a78a', fontSize: 10 },
          pageIconColor: '#c9a227',
          pageTextStyle: { color: '#8b7d6b' },
        },
        grid: { top: 20, right: 30, bottom: 56, left: 50 },
        xAxis: {
          type: 'category',
          data: hd,
          axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold' },
          axisLine: { lineStyle: { color: '#3a3a5c' } },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: { color: '#8b7d6b', fontSize: 10, formatter: '{value}%' },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        },
        series: banshi.map((b, i) => ({
          name: b,
          type: 'bar',
          stack: 'total',
          data: pctMatrix.map((row) => row[i]),
          itemStyle: {
            color: stackPalette[i % stackPalette.length],
            borderColor: 'rgba(15,20,35,0.92)',
            borderWidth: 1,
            borderRadius: i === banshi.length - 1 ? [2, 2, 0, 0] : 0,
          },
          barWidth: '55%',
          emphasis: { focus: 'series' },
        })),
      },
      true,
    );

    const chartEl = chartRef.current;
    const ro = new ResizeObserver(() => chartInstance.current?.resize());
    ro.observe(chartEl);

    return () => {
      ro.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 780,
        background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
        borderRadius: 20,
        padding: '30px 28px 24px',
        boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
        margin: '0 auto',
      }}
    >
      <div ref={chartRef} style={{ width: '100%', height: 480 }} />
    </div>
  );
}
