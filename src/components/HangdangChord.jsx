import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const palette = ['#e8a87c','#e76f51','#f4a261','#e9c46a','#2a9d8f','#5bc0be','#a8dadc','#f1a7c2','#c3aed6','#d4a373'];
const displayCount = 8;

export default function HangdangChord({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        const hangdang = data.hangdang;
        const matrix = data.matrix;
        const roles = data.roles;

        const displayRoles = {};
        hangdang.forEach(hd => {
            const list = roles[hd] || [];
            displayRoles[hd] = list.slice(0, displayCount);
        });

        const roleCounts = hangdang.map(hd => (roles[hd] || []).length);
        const minRoles = Math.min(...roleCounts);
        const maxRoles = Math.max(...roleCounts);
        const minSize = 30;
        const maxSize = 55;
        const r = 260;

        const nodes = [];
        const links = [];

        hangdang.forEach((hd, i) => {
            const angle = (i / hangdang.length) * Math.PI * 2 - Math.PI / 2;
            const size = minSize + ((roleCounts[i] - minRoles) / (maxRoles - minRoles)) * (maxSize - minSize);
            nodes.push({
                name: hd,
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r,
                fixed: true,
                symbolSize: size,
                itemStyle: { color: palette[i], borderColor: '#fff', borderWidth: 2, shadowBlur: 14, shadowColor: palette[i] },
                label: { show: true, color: '#fff', fontSize: 13, fontWeight: 'bold', textShadowBlur: 4, textShadowColor: '#000', position: 'top', distance: 12 }
            });
        });

        const maxVal = Math.max(...matrix.flat());
        for (let i = 0; i < hangdang.length; i++) {
            for (let j = i + 1; j < hangdang.length; j++) {
                if (matrix[i][j] > 0) {
                    const w = 1 + (matrix[i][j] / maxVal) * 12;
                    links.push({
                        source: hangdang[i],
                        target: hangdang[j],
                        value: matrix[i][j],
                        lineStyle: { width: w, opacity: 0.35, color: '#c0b8a8', curveness: 0.15 }
                    });
                }
            }
        }

        if (!chartInstance.current) chartInstance.current = echarts.init(chartRef.current);

        chartInstance.current.setOption({
            tooltip: {
                backgroundColor: 'rgba(22,22,38,0.96)',
                borderColor: '#5bc0be',
                textStyle: { color: '#e8dcc8', fontSize: 12 },
                formatter: function(p) {
                    if (p.dataType === 'node') {
                        const hd = p.name;
                        const fullList = roles[hd] || [];
                        const topList = displayRoles[hd] || [];
                        const show = topList.join('、');
                        return `<b style="font-size:14px;">${hd}</b><br/>共 ${fullList.length} 个角色<br/><span style="color:#ccc;font-size:11px;">${show}等</span>`;
                    }
                    if (p.dataType === 'edge') {
                        return `${p.data.source} ↔ ${p.data.target}<br/>共现次数：<b>${p.data.value}</b>`;
                    }
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                force: { repulsion: 0, gravity: 0, edgeLength: 0 },
                roam: false,
                draggable: false,
                data: nodes,
                links: links,
                emphasis: { focus: 'adjacency', lineStyle: { width: 14, opacity: 0.7 } }
            }],
            graphic: [
                { type: 'text', left: 'center', top: 'center', style: { text: '行 当\n共 现', fill: '#3a3040', fontSize: 14, textAlign: 'center', lineHeight: 22 } }
            ]
        }, true);

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 800,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '35px 30px 30px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 620 }} />
        </div>
    );
}