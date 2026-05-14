/**
 * 将 map_data 中的 plays 按地点聚合为 ECharts geo effectScatter 数据项
 * @param {Record<string, { modern?: string; tag?: string; coords?: number[] }>} locationDict
 * @param {Array<{ period: string; location?: string; [k: string]: unknown }>} plays
 * @param {'shangzhou' | 'qinhan'} period
 */
export function buildMapScatterSeries(locationDict, plays, period) {
  const buckets = new Map()

  for (const play of plays) {
    if (play.period !== period) continue
    const parts = String(play.location ?? '')
      .split(/[；;]/)
      .map((s) => s.trim())
      .filter(Boolean)

    for (const loc of parts) {
      const info = locationDict[loc]
      if (!info?.coords?.length) continue

      let bucket = buckets.get(loc)
      if (!bucket) {
        bucket = {
          name: loc,
          coords: info.coords,
          tag: info.tag ?? '',
          plays: [],
        }
        buckets.set(loc, bucket)
      }
      bucket.plays.push(play)
    }
  }

  return [...buckets.values()].map((b) => ({
    name: b.name,
    value: [...b.coords],
    customData: {
      tag: b.tag,
      plays: b.plays,
    },
  }))
}
