import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const palette = ['#e76f51','#5bc0be','#f4a261','#e9c46a','#2a9d8f','#c3aed6','#a8dadc','#f1a7c2'];

export default function ThemePie({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;
        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        chartInstance.current.setOption({
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(22,22,38,0.95)',
                borderColor: '#5bc0be',
                textStyle: { color: '#e8dcc8', fontSize: 12 },
                formatter: '{b}: {c} 次 ({d}%)'
            },
            legend: { bottom: 6, textStyle: { color: '#8b7d6b', fontSize: 10 }, itemWidth: 8, itemHeight: 8 },
            series: [{
                type: 'pie',
                radius: ['42%', '75%'],
                center: ['50%', '48%'],
                itemStyle: { borderColor: '#1a1a2e', borderWidth: 3, borderRadius: 4 },
                label: { show: true, position: 'outside', formatter: '{b}\n{d}%', color: '#c0b8a8', fontSize: 11, lineHeight: 16 },
                labelLine: { lineStyle: { color: '#4a4a6a' } },
                emphasis: { scaleSize: 10, label: { fontSize: 14, fontWeight: 'bold' } },
                data: data.map((d, i) => ({ ...d, itemStyle: { color: palette[i] } }))
            }],
            graphic: [
                { type: 'text', left: 'center', top: 'center', style: { text: '主题\n分类', fill: '#5a4a5a', fontSize: 12, textAlign: 'center', lineHeight: 20 } }
            ]
        }, true);

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 600,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '30px 25px 25px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 440 }} />
        </div>
    );
}