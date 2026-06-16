import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Progress } from "@/components/ui/progress";

export default function SurvivalAnalysis() {
  const { survivalDays, config } = useDashboardStats();

  // 計算進度條 (不大於 100)
  const progressPercent = Math.min(100, (survivalDays / config.targetDays) * 100);
  
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm)">
      <p className="text-(--card-foreground) text-md">生存能力分析</p>
      <div >
        <Progress value={progressPercent}/>
        <ul>
          <li className="text-(--card-foreground-2) text-sm">目標：{config.targetDays}天</li>
          <li className="text-(--card-foreground-2) text-sm">目前：{survivalDays}天</li>
          <li className="text-(--card-foreground-2) text-sm">缺少：{config.targetDays - survivalDays}天</li>
        </ul>
      </div>
    </div>
  )
}