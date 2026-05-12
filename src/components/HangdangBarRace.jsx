// HangdangBarRace.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const palette = ['#c98f5e','#d4a373','#deb887','#e8c89e','#eed9b4','#f4e4ca','#faf0e0','#fdf6ee','#fefbf8','#ffffff'];

export default function HangdangBarRace({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const hangdang = data.hangdang;
        const dynasties = ['商周', '秦汉'];
        const raw = [data['商周'], data['秦汉']];
        const dataByDynasty = raw.map(obj => {
            const total = Object.values(obj).reduce((a, b) => a + b, 0);
            return hangdang.map(hd => +(obj[hd] / total * 100).toFixed(1));
        });

        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        let currentIndex = 0;

        function getOption(index) {
            const values = dataByDynasty[index];
            const sorted = hangdang.map((name, i) => ({ name, value: values[i] })).sort((a, b) => b.value - a.value);

            return {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(22,22,38,0.95)',
                    borderColor: '#5bc0be',
                    textStyle: { color: '#e8dcc8', fontSize: 12 },
                    formatter: '{b}: {c}%'
                },
                grid: { top: 10, right: 50, bottom: 20, left: 60 },
                xAxis: { type: 'value', max: 20, axisLabel: { color: '#8b7d6b', fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } } },
                yAxis: { type: 'category', data: sorted.map(d => d.name), axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold' }, axisTick: { show: false }, axisLine: { show: false } },
                series: [{
                    type: 'bar',
                    data: sorted.map((d, i) => ({ value: d.value, itemStyle: { color: palette[i], borderRadius: [0, 4, 4, 0] } })),
                    barWidth: '55%',
                    label: { show: true, position: 'right', color: '#c0b8a8', fontSize: 10, fontWeight: 'bold', formatter: '{c}%' },
                    animationDuration: 800,
                    animationEasing: 'cubicInOut'
                }],
                graphic: [
                    { type: 'text', right: 10, top: 10, style: { text: dynasties[index], fill: '#c98f5e', fontSize: 14, fontWeight: 'bold' } }
                ]
            };
        }

        chartInstance.current.setOption(getOption(0));

        timerRef.current = setInterval(() => {
            currentIndex = (currentIndex + 1) % dynasties.length;
            chartInstance.current.setOption(getOption(currentIndex), true);
        }, 2500);

        return () => {
            clearInterval(timerRef.current);
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 760,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '35px 32px 28px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 480 }} />
        </div>
    );
}