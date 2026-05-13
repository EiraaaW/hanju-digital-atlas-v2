// SankeySTH.jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const cleanName = n => n.replace('声腔:', '').replace('主题:', '');

const nodeColors = {
    '声腔': '#e76f51',
    '主题': '#f4a261',
    '行当': '#5bc0be'
};
function getCategory(name) {
    if (name.startsWith('声腔:')) return '声腔';
    if (name.startsWith('主题:')) return '主题';
    return '行当';
}

export default function SankeySTH({ data }) {
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
                formatter: function(p) {
                    if (p.dataType === 'edge') {
                        return `${cleanName(p.data.source)} → ${cleanName(p.data.target)}<br/>关联次数：<b>${p.data.value}</b>`;
                    }
                    return `<b>${cleanName(p.data.name)}</b>`;
                }
            },
            series: [{
                type: 'sankey',
                layout: 'none',
                emphasis: { focus: 'adjacency' },
                nodeAlign: 'justify',
                layoutIterations: 32,
                nodeWidth: 18,
                nodeGap: 14,
                data: data.nodes.map(n => ({
                    name: n.name,
                    itemStyle: {
                        color: nodeColors[getCategory(n.name)] || '#888',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1
                    },
                    label: {
                        color: '#e8dcc8',
                        fontSize: 12,
                        formatter: () => cleanName(n.name)
                    }
                })),
                links: data.links.map(l => ({
                    source: l.source,
                    target: l.target,
                    value: l.value,
                    lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 }
                })),
                label: { position: 'right', fontSize: 12 },
                lineStyle: { color: 'gradient', curveness: 0.5 }
            }]
        }, true);

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return (
        <div style={{
            width: '100%', maxWidth: 1100,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e 50%, #0f3460)',
            borderRadius: 20, padding: '30px 20px 24px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.7)',
            margin: '0 auto'
        }}>
            <div ref={chartRef} style={{ width: '100%', height: 650 }} />
        </div>
    );
}