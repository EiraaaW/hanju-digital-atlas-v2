// ChangfaBar.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const palette = ['#c98f5e','#d4a373','#deb887','#e8c89e','#eed9b4','#f4e4ca','#faf0e0','#ddd'];

export default function ChangfaBar({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;
        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        chartInstance.current.setOption({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22,22,38,0.95)',
                borderColor: '#5bc0be',
                textStyle: { color: '#e8dcc8', fontSize: 12 },
                formatter: '{b}: {c} 次'
            },
            grid: { top: 20, right: 40, bottom: 45, left: 55 },
            xAxis: {
                type: 'category',
                data: data.map(d => d.name),
                axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold' },
                axisLine: { lineStyle: { color: '#3a3a5c' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value', name: '',
                axisLabel: { color: '#8b7d6b', fontSize: 10 },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } }
            },
            series: [{
                type: 'bar',
                data: data.map((d, i) => ({ value: d.value, itemStyle: { color: palette[i % palette.length], borderRadius: [4, 4, 0, 0] } })),
                barWidth: '55%',
                label: { show: true, position: 'top', color: '#c0b8a8', fontSize: 11, fontWeight: 'bold' }
            }],
            graphic: [
                { type: 'text', left: 10, top: 'center', style: { text: '出\n现\n次\n数', fill: '#8b7d6b', fontSize: 10, lineHeight: 16 } }
            ]
        }, true);

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
        <div style={{
            width: '100%', maxWidth: 680,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '36px 28px 28px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 440 }} />
        </div>
    );
}