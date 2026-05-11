import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const rhythmColor = { '慢': '#5bc0be', '中': '#f4a261', '快': '#e76f51' };
const rhythmBg = { '慢': 'rgba(91,192,190,0.18)', '中': 'rgba(244,162,97,0.18)', '快': 'rgba(231,111,81,0.22)' };
const rhythmLabel = { '慢': '慢 · 抒情铺垫', '中': '中 · 对话推进', '快': '快 · 高潮爆发' };

export default function NarrativeCard({ playData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { meta, segments } = playData || {};

  useEffect(() => {
    if (!segments || !chartRef.current) return;

    let centers = [], cum = 0;
    segments.forEach(s => { centers.push(cum + s.ratio / 2); cum += s.ratio; });

    let markAreas = [], start = 0;
    segments.forEach(s => {
      markAreas.push([
        { xAxis: start, yAxis: 0 },
        { xAxis: start + s.ratio, yAxis: 10, itemStyle: { color: rhythmBg[s.rhythm], borderColor: 'transparent' } }
      ]);
      start += s.ratio;
    });

    let markLines = [], boundary = 0;
    for (let i = 0; i < segments.length - 1; i++) {
      boundary += segments[i].ratio;
      markLines.push({
        xAxis: boundary,
        lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed', width: 1 },
        label: { show: true, position: 'start', offset: [0, 8], formatter: boundary.toString(), color: '#8b7d6b', fontSize: 11 }
      });
    }

    let climaxIdx = 0, maxEmotion = 0;
    segments.forEach((s, i) => { if (s.emotion > maxEmotion) { maxEmotion = s.emotion; climaxIdx = i; } });
    let climaxX = 0;
    for (let i = 0; i < climaxIdx; i++) climaxX += segments[i].ratio;
    climaxX += segments[climaxIdx].ratio / 2;
    markLines.push({
      xAxis: climaxX,
      lineStyle: { color: '#e76f51', type: 'dashed', width: 2.2, opacity: 0.9 },
      label: { show: true, position: 'start', offset: [0, 20], formatter: '▲ 高潮', color: '#e76f51', fontSize: 12, fontWeight: 'bold', backgroundColor: 'rgba(15,15,26,0.85)', padding: [3,10,3,10], borderRadius: 12 },
      symbol: 'none'
    });

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chartEl = chartRef.current;

    chartInstance.current.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(22,22,38,0.96)',
        borderColor: '#5bc0be',
        textStyle: { color: '#e8dcc8', fontSize: 13 },
        formatter: function(params) {
          if (!params || params.length === 0) return '';
          const idx = params[0].dataIndex;
          if (idx === undefined || !segments[idx]) return '';
          const seg = segments[idx];
          let html = `<b style="font-size:15px;">${seg.name}</b><br/>`;
          if (seg.field && seg.field !== '不分场') {
            html += `对应场次：${seg.field}<br/>`;
          }
          if (seg.summary) {
            html += `<span style="color:#ccc;font-size:12px;">${seg.summary}</span><br/>`;
          }
          html += `情绪强度：<b style="font-size:18px;">${seg.emotion}</b>/10<br/>
                   节奏：${rhythmLabel[seg.rhythm]}<br/>
                   占比：<b>${seg.ratio}%</b>`;
          return html;
        }
      },
      grid: { top: 45, right: 55, bottom: 130, left: 55 },
      xAxis: {
        type: 'value', min: 0, max: 100,
        axisLabel: { show: false },
        axisLine: { lineStyle: { color: '#4a4a6a', width: 1.2 } },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', min: 0, max: 10, interval: 2,
        name: '情绪强度',
        nameTextStyle: { color: '#8b7d6b', fontSize: 11, fontStyle: 'italic' },
        axisLabel: { color: '#8b7d6b', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } }
      },
      series: [
        {
          name: '段落标签',
          type: 'scatter',
          data: centers.map((x) => [x, 0]),
          symbolSize: 0,
          label: {
            show: true, position: 'bottom', distance: 55,
            formatter: p => `${segments[p.dataIndex].name}\n${segments[p.dataIndex].ratio}%`,
            color: '#d4cdbc', fontSize: 12, fontWeight: '500', lineHeight: 20,
            backgroundColor: 'rgba(18,18,32,0.85)', padding: [6,14,6,14],
            borderRadius: 20, borderColor: 'rgba(255,255,200,0.3)', borderWidth: 0.8
          },
          z: 2, animation: false
        },
        {
          name: '情绪曲线',
          type: 'line',
          data: centers.map((x, i) => [x, segments[i].emotion]),
          smooth: 0.4,
          symbol: 'circle', symbolSize: 15,
          lineStyle: { color: '#e8dcc8', width: 3.2, shadowBlur: 12, shadowColor: 'rgba(232,220,200,0.45)' },
          itemStyle: {
            color: p => rhythmColor[segments[p.dataIndex].rhythm],
            borderColor: '#fff', borderWidth: 2.2,
            shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.5)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(232,220,200,0.32)' },
              { offset: 1, color: 'rgba(232,220,200,0.01)' }
            ])
          },
          label: {
            show: true, position: 'top', distance: 16,
            color: '#fff', fontSize: 13, fontWeight: 'bold',
            formatter: p => p.value[1],
            textShadowBlur: 4, textShadowColor: '#000'
          },
          markArea: { silent: true, data: markAreas, label: { show: false } },
          markLine: { silent: true, symbol: 'none', data: markLines },
          z: 10
        }
      ]
    });

    const ro = new ResizeObserver(() => chartInstance.current?.resize());
    ro.observe(chartEl);

    const onWinResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', onWinResize);

    return () => {
      window.removeEventListener('resize', onWinResize);
      ro.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [segments]);

  if (!playData) return null;

  const metaRight = meta.isZhezixi === '是' && meta.quanben
    ? `折子戏 · 出自《${meta.quanben}》`
    : meta.isZhezixi === '是'
    ? '折子戏'
    : meta.quanben
    ? `出自《${meta.quanben}》`
    : '';

  return (
    <div style={{
      width: '1100px', maxWidth: '100%',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: 24, padding: '45px 40px 30px',
      boxShadow: '0 35px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,215,150,0.08)',
      position: 'relative', margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10, flexWrap: 'wrap', gap: 15 }}>
        <div>
          <div style={{ color: '#e8dcc8', fontSize: 28, fontWeight: 600, letterSpacing: 6, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            {playData._name || ''}
          </div>
          <div style={{ color: '#9b8c7c', fontSize: 13, marginTop: 8, fontStyle: 'italic', letterSpacing: 0.8 }}>
            {meta.era} · {meta.location} | {meta.hangdang} | {meta.shengqiang} · {meta.banshi}
          </div>
        </div>
        {metaRight && (
          <div style={{ color: '#b7a78a', fontSize: 13, textAlign: 'right', lineHeight: 1.7, background: 'rgba(10,10,20,0.45)', padding: '8px 18px', borderRadius: 40 }}>
            {metaRight}
          </div>
        )}
      </div>

      {/* 图表 */}
      <div ref={chartRef} style={{ width: '100%', height: 580, marginTop: 5 }} />

      {/* 图例 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 35, padding: '10px 20px' }}>
        {Object.entries(rhythmLabel).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#b7aa92', fontSize: 12, fontWeight: 500 }}>
            <div style={{ width: 16, height: 9, borderRadius: 2, backgroundColor: rhythmColor[key], boxShadow: `0 0 6px ${rhythmColor[key]}` }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* 情节推进 */}
      <div style={{ position: 'absolute', right: 60, bottom: 70, color: '#8b7d6b', fontSize: 11, fontStyle: 'italic', pointerEvents: 'none' }}>
        情节推进 →
      </div>
    </div>
  );
}