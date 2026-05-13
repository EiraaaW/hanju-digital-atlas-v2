// ThemeBarRacePlayCount.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const themeColor = {
    "权斗": "#c98f5e", "孝义": "#d4a373", "征战": "#deb887",
    "复仇": "#e8c89e", "求贤": "#eed9b4", "神魔": "#f4e4ca",
    "讽世": "#faf0e0", "情爱": "#fdf6ee"
};
const dynasties = ["商周", "秦汉"];
const totals = [55, 44];

export default function ThemeBarRacePlayCount({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const themes = data.themes;
        const raw = [data['商周'], data['秦汉']];
        const dataByDynasty = raw.map((obj, idx) =>
            themes.map(t => +((obj[t] || 0) / totals[idx] * 100).toFixed(1))
        );

        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        let currentIndex = 0;

        function getOption(index) {
            const values = dataByDynasty[index];
            const sorted = themes.map((name, i) => ({ name, value: values[i] })).sort((a, b) => b.value - a.value);

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
                grid: { top: 10, right: 50, bottom: 20, left: 60 },
                xAxis: { type: 'value', max: 80, axisLabel: { color: '#8b7d6b', fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } } },
                yAxis: { type: 'category', data: sorted.map(d => d.name), axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold' }, axisTick: { show: false }, axisLine: { show: false } },
                series: [{
                    type: 'bar',
                    data: sorted.map(d => ({ value: d.value, itemStyle: { color: themeColor[d.name], borderRadius: [0, 4, 4, 0] } })),
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