// EraThemeHeatmap.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EraThemeHeatmap({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;
        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        const maxVal = Math.max(...data.data.flat());

        chartInstance.current.setOption({
            tooltip: {
                backgroundColor: 'rgba(22,22,38,0.96)',
                borderColor: '#5bc0be',
                textStyle: { color: '#e8dcc8', fontSize: 12 },
                formatter: function(p) {
                    const era = data.eras[p.value[1]];
                    const theme = data.themes[p.value[0]];
                    const count = p.value[2];
                    const names = data.names[era][theme];
                    const nameStr = names.length > 0 ? names.slice(0, 8).join('、') + (names.length > 8 ? `等${names.length}部` : '') : '无';
                    return `<b>${theme}</b> × <b>${era}</b><br/>出现次数：${count}<br/><span style="color:#aaa;font-size:11px;">${nameStr}</span>`;
                }
            },
            grid: { top: 40, right: 50, bottom: 40, left: 70 },
            xAxis: {
                type: 'category', data: data.themes, position: 'top',
                axisLabel: { color: '#c0b8a8', fontSize: 12, fontWeight: 'bold', margin: 8 },
                axisLine: { show: false }, axisTick: { show: false }
            },
            yAxis: {
                type: 'category', data: data.eras,
                axisLabel: { color: '#c0b8a8', fontSize: 13, fontWeight: 'bold' },
                axisLine: { show: false }, axisTick: { show: false }
            },
            visualMap: {
                min: 0, max: maxVal, calculable: false, orient: 'vertical',
                right: 10, top: 'center', itemWidth: 12, itemHeight: 140,
                textStyle: { color: '#8b7d6b', fontSize: 10 },
                inRange: { color: ['#1a1a2e','#3a2e24','#5a4030','#7a5438','#9a6840','#ba7c48','#da9050','#f4a458'] }
            },
            series: [{
                type: 'heatmap',
                data: data.data.flatMap((row, y) => row.map((v, x) => [x, y, v])),
                label: { show: true, color: '#e8dcc8', fontSize: 13, fontWeight: 'bold' },
                emphasis: { itemStyle: { shadowBlur: 10 } },
                itemStyle: { borderColor: '#1a1a2e', borderWidth: 3, borderRadius: 4 }
            }]
        }, true);

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 780,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '36px 28px 28px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 480 }} />
        </div>
    );
}