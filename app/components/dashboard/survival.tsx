import { Progress } from "@/components/ui/progress"

export default function SurvivalAnalysis() {
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm)">
      <p className="text-(--card-foreground) text-md">生存能力分析</p>
      <div >
        <Progress value={60}/>
        <ul>
          <li className="text-(--card-foreground-2) text-sm">目標：30天</li>
          <li className="text-(--card-foreground-2) text-sm">目前：21天</li>
          <li className="text-(--card-foreground-2) text-sm">缺少：9天</li>
        </ul>
      </div>
    </div>
  )
}