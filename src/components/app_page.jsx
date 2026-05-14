import HanjuGraph from '@/components/hanjuGraph.jsx'

/**
 * 「戏缘浮生」人物网络区块：供「角色与人物」二级页嵌入。
 * 元数据来自 public/data/hanju_metadata_all.csv；行当推演等来自 @/data/hanjuData.js。
 */
export default function AppPage() {
  return (
    <div className="w-full">
      <HanjuGraph key="hanju-metadata" csvUrl="/data/hanju_metadata_all.csv" />
    </div>
  )
}
