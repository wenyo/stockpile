import { NotepadText } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export default function ActionPlan() {
  const { remainingCalories, remainingWater, foodGapDays, gapWaterDays } = useDashboardStats();
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col">
      <p className="text-(--card-foreground) text-md flex items-center gap-2">
        <span>行動計劃</span>
        <NotepadText strokeWidth={1.5} size={18}/>
      </p>
      <div className="flex flex-col gap-2 mt-4">
        <p className="">還需補充：</p>
        <p className="">
          <span>{foodGapDays}天份食物</span>
          <span>{remainingCalories} kcal</span>
        </p>
        <p className="">
          <span>{gapWaterDays}天份飲用水</span>
          <span>{remainingWater} ml 飲用水</span>
        </p>
      </div>
    </div>
  )
}