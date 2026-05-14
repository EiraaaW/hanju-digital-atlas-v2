// EChartsMap.jsx — 中国底图通过 /public/geo/china.json 注册
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

let chinaGeoJsonPromise = null
function loadChinaGeoJson() {
  chinaGeoJsonPromise ??= fetch('/geo/china.json').then((r) => {
    if (!r.ok) throw new Error(`china geo: ${r.status}`)
    return r.json()
  })
  return chinaGeoJsonPromise
}

export default function EChartsMap({ szData, qhData, activeLayer, onPointClick }) {
  const mapRef = useRef(null)
  const chartInstance = useRef(null)
  const onPointClickRef = useRef(onPointClick)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    onPointClickRef.current = onPointClick
  }, [onPointClick])

  useEffect(() => {
    let disposed = false
    let resizeObserver = null

    loadChinaGeoJson()
      .then((geoJson) => {
        if (disposed || !mapRef.current) return
        echarts.registerMap('china', geoJson)
        chartInstance.current = echarts.init(mapRef.current)

        chartInstance.current.on('click', (params) => {
          if (params.componentType === 'series' && params.data?.customData) {
            onPointClickRef.current?.(params.name, params.data.customData)
          }
        })

        resizeObserver = new ResizeObserver(() => {
          chartInstance.current?.resize()
        })
        resizeObserver.observe(mapRef.current)
        setMapReady(true)
      })
      .catch(() => {
        if (!disposed) setMapReady(false)
      })

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !chartInstance.current) return

    const activeSz =
      activeLayer === 'all' || activeLayer === 'shangzhou' ? szData : []
    const activeQh =
      activeLayer === 'all' || activeLayer === 'qinhan' ? qhData : []

    chartInstance.current.setOption(
      {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 15, 26, 0.95)',
          borderColor: 'rgba(120, 53, 15, 0.5)',
          borderWidth: 1,
          padding: [8, 12],
          textStyle: {
            color: '#fef3c7',
            fontFamily: "'Noto Serif SC', serif",
            letterSpacing: '1px',
          },
          formatter(params) {
            if (params.componentType === 'series') {
              const tag = params.data.customData.tag
                ? String(params.data.customData.tag).split(' / ')[0]
                : ''
              const tagHtml = tag
                ? `<span style="font-size:10px;background:rgba(120,53,15,0.55);color:#fcd34d;padding:2px 6px;border-radius:4px;border:1px solid rgba(180,83,9,0.5);margin-left:6px;">${tag}</span>`
                : ''
              return `
              <div style="max-width:220px;white-space:normal;padding:2px 0;">
                <div style="font-size:16px;font-weight:700;">${params.name} ${tagHtml}</div>
                <div style="font-size:12px;color:#d97706;margin-top:6px;">含 ${params.data.customData.plays.length} 部戏文，点击查看 &gt;&gt;</div>
              </div>`
            }
            return ''
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 1, max: 20 },
          center: [112.45, 34.61],
          zoom: 4.5,
          itemStyle: {
            areaColor: '#161623',
            borderColor: 'rgba(120, 53, 15, 0.4)',
            borderWidth: 1.2,
          },
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: '#1e1e2d' },
          },
        },
        series: [
          {
            name: 'shangzhou',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: activeSz,
            symbolSize(val, params) {
              return Math.min(
                10 + params.data.customData.plays.length * 2,
                25,
              )
            },
            showEffectOn: 'render',
            rippleEffect: { brushType: 'stroke', scale: 3 },
            label: { show: false },
            emphasis: {
              focus: 'self',
              blurScope: 'coordinateSystem',
              label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#fef3c7',
                fontFamily: "'Noto Serif SC', serif",
                textBorderColor: '#0f0f1a',
                textBorderWidth: 3,
                fontSize: 16,
              },
            },
            itemStyle: {
              color: '#f59e0b',
              shadowBlur: 10,
              shadowColor: '#f59e0b',
            },
          },
          {
            name: 'qinhan',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: activeQh,
            symbolSize(val, params) {
              return Math.min(
                10 + params.data.customData.plays.length * 2,
                25,
              )
            },
            showEffectOn: 'render',
            rippleEffect: { brushType: 'stroke', scale: 3 },
            label: { show: false },
            emphasis: {
              focus: 'self',
              blurScope: 'coordinateSystem',
              label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#fef3c7',
                fontFamily: "'Noto Serif SC', serif",
                textBorderColor: '#0f0f1a',
                textBorderWidth: 3,
                fontSize: 16,
              },
            },
            itemStyle: {
              color: '#dc2626',
              shadowBlur: 10,
              shadowColor: '#dc2626',
            },
          },
        ],
      },
      true,
    )
  }, [mapReady, activeLayer, szData, qhData])

  return <div ref={mapRef} className="z-10 h-full w-full bg-transparent" />
}
