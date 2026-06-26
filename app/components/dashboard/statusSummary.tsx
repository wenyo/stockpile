import { preparednessLevels } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Progress } from "@/components/ui/progress";
import { Box } from "lucide-react";

export default function SurvivalAnalysis() {
  const { survivalDays, config, totalCalories } = useDashboardStats();

  // 計算進度條 (不大於 100)
  const progressPercent = Math.round(Math.min(100, (survivalDays / config.targetDays) * 100));
  const level = preparednessLevels.find((level) => progressPercent >= level.minPercentage);    
  
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col gap-4">
      <p className="text-(--card-foreground) text-md flex items-center gap-2">
        <span>備戰狀態</span>
        <Box strokeWidth={1.5} size={18}/>
      </p>
      <div className="flex items-end gap-2">
        <p className={`${level?.className} text-6xl font-bold`}>{survivalDays}天</p>
        <p className={`${level?.className} text-lg font-bold tracking-wider`}>{level?.label}</p>
      </div>
      <Progress value={progressPercent} indicatorColor={level?.bgClassName}/>
      <ul className="grid grid-cols-5 gap-2">
        <li className="flex justify-between flex-col bg-muted p-2 rounded-(--radius-sm) text-sm">
          <span className="text-muted-foreground">目標</span>
          <span>{config.targetDays}天</span>
        </li>
        <li className="flex justify-between flex-col bg-muted p-2 rounded-(--radius-sm) text-sm">
          <span className="text-muted-foreground">達成率</span>
          <span>{progressPercent}%</span>
        </li>
        <li className="flex justify-between flex-col bg-muted p-2 rounded-(--radius-sm) text-sm">
          <span className="text-muted-foreground">總熱量</span>
          <span>{totalCalories} kcal</span>
        </li>
        <li className="flex justify-center flex-col bg-muted p-2 rounded-(--radius-sm) text-sm">
          <span className="text-muted-foreground">人數</span>
          <span>{config.people} 人份</span>
        </li>
        <li className="flex justify-center flex-col bg-muted p-2 rounded-(--radius-sm) text-sm">
          <span className="text-muted-foreground">每人每日熱量</span>
          <span>{config.onePersonOneDayCalories} kcal/人/天</span>
        </li>
      </ul>
    </div>
  )
}