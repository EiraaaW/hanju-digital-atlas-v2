// HangdangDumbbell.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function HangdangDumbbell({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const themes = data.hangdang;
        const sw = data['商周'];
        const qh = data['秦汉'];

        const totalSW = Object.values(sw).reduce((a, b) => a + b, 0);
        const totalQH = Object.values(qh).reduce((a, b) => a + b, 0);
        const swPct = themes.map(t => +(sw[t] / totalSW * 100).toFixed(1));
        const qhPct = themes.map(t => +(qh[t] / totalQH * 100).toFixed(1));

        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        chartInstance.current.setOption({
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(22,22,38,0.95)',
                borderColor: '#5bc0be',
                textStyle: { color: '#e8dcc8', fontSize: 12 },
                formatter: function(p) {
                    const i = p.dataIndex;
                    return `<b>${themes[i]}</b><br/>商周：${sw[themes[i]]}次 (${swPct[i]}%)<br/>秦汉：${qh[themes[i]]}次 (${qhPct[i]}%)`;
                }
            },
            legend: { bottom: 8, textStyle: { color: '#8b7d6b', fontSize: 10 } },
            grid: { top: 20, right: 30, bottom: 55, left: 60 },
            xAxis: {
                type: 'value', max: 20,
                axisLabel: { color: '#8b7d6b', fontSize: 10, formatter: '{value}%' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } }
            },
            yAxis: {
                type: 'category', data: themes,
                axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold', margin: 12 },
                axisLine: { lineStyle: { color: '#3a3a5c' } },
                axisTick: { show: false }
            },
            series: [
                {
                    type: 'custom',
                    renderItem: function(params, api) {
                        const y = api.coord([0, params.dataIndex])[1];
                        const x1 = api.coord([swPct[params.dataIndex], 0])[0];
                        const x2 = api.coord([qhPct[params.dataIndex], 0])[0];
                        const gap = Math.abs(swPct[params.dataIndex] - qhPct[params.dataIndex]);
                        return {
                            type: 'line',
                            shape: { x1, y1: y, x2, y2: y },
                            style: { stroke: gap > 5 ? '#e76f51' : '#6b5e5a', lineWidth: gap > 5 ? 3 : 1.5, opacity: 0.55 }
                        };
                    },
                    data: themes.map(() => 0),
                    z: 1
                },
                {
                    type: 'scatter', name: '商周',
                    data: swPct.map((v, i) => [v, i]),
                    symbolSize: 14,
                    itemStyle: { color: '#f4a261', borderColor: '#fff', borderWidth: 2 },
                    label: { show: false },
                    z: 2
                },
                {
                    type: 'scatter', name: '秦汉',
                    data: qhPct.map((v, i) => [v, i]),
                    symbolSize: 14,
                    itemStyle: { color: '#5bc0be', borderColor: '#fff', borderWidth: 2 },
                    label: { show: false },
                    z: 2
                }
            ]
        }, true);

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 860,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '35px 32px 28px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 480 }} />
        </div>
    );
}