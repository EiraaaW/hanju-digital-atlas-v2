// ChangfaBarRace.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const palette = ['#c98f5e','#d4a373','#deb887','#e8c89e','#eed9b4','#f4e4ca','#faf0e0','#ddd'];
const changfas = ["念","诗","引","叫头","哭头","导板","赞子","其他"];
const dynasties = ["商周", "秦汉"];
const totals = [55, 44];

export default function ChangfaBarRace({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const raw = [data['商周'], data['秦汉']];
        const dataByDynasty = raw.map((obj, idx) =>
            changfas.map(c => +((obj[c] || 0) / totals[idx] * 100).toFixed(1))
        );

        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        let currentIndex = 0;

        function getOption(index) {
            const values = dataByDynasty[index];
            const unsorted = changfas.map((name, i) => ({ name, value: values[i], color: palette[i] }));
            const sorted = [...unsorted].sort((a, b) => b.value - a.value);
            const sortedNames = sorted.map(d => d.name);

            return {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(22,22,38,0.95)',
                    borderColor: '#5bc0be',
                    textStyle: { color: '#e8dcc8', fontSize: 12 },
                    formatter: function(params) {
                        const c = params[0].name;
                        const sw = raw[0][c] || 0;
                        const qh = raw[1][c] || 0;
                        return `<b>${c}</b><br/>商周：${sw}/55 (${(sw/55*100).toFixed(1)}%)<br/>秦汉：${qh}/44 (${(qh/44*100).toFixed(1)}%)`;
                    }
                },
                grid: { top: 20, right: 40, bottom: 30, left: 55 },
                xAxis: { type: 'category', data: sortedNames, axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold' }, axisTick: { show: false }, axisLine: { lineStyle: { color: '#3a3a5c' } } },
                yAxis: { type: 'value', max: 100, axisLabel: { color: '#8b7d6b', fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } } },
                series: [{
                    type: 'bar',
                    data: sorted.map(d => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [4, 4, 0, 0] } })),
                    barWidth: '55%',
                    label: { show: true, position: 'top', color: '#c0b8a8', fontSize: 10, fontWeight: 'bold', formatter: '{c}%' },
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
            chartInstance.current?.setOption(getOption(currentIndex), true);
        }, 2500);

        const chartEl = chartRef.current;
        const ro = new ResizeObserver(() => chartInstance.current?.resize());
        ro.observe(chartEl);

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
            ro.disconnect();
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 700,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '35px 32px 28px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 460 }} />
        </div>
    );
}
