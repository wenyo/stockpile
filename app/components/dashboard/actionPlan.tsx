import { NotepadText } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActionPlan() {
  const { remainingCalories, remainingWater, foodGapDays, gapWaterDays } = useDashboardStats();
  
  return (
    <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
          <span>備戰缺口</span>
          <NotepadText strokeWidth={1.5} size={20}/>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-base font-medium">達標還需補充：</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col p-4 bg-muted/30 rounded-xl border border-border/40 gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base">食物</span>
              <Badge variant={foodGapDays > 0 ? "destructive" : "secondary"} className="opacity-90 text-sm px-2 py-0.5">約 {foodGapDays} 天份</Badge>
            </div>
            <p className="text-sm text-muted-foreground">缺口約 <span className="font-medium text-foreground text-base">{remainingCalories.toLocaleString()}</span> kcal</p>
          </div>
          
          <div className="flex flex-col p-4 bg-muted/30 rounded-xl border border-border/40 gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base">飲用水</span>
              <Badge variant={gapWaterDays > 0 ? "destructive" : "secondary"} className="opacity-90 text-sm px-2 py-0.5">約 {gapWaterDays} 天份</Badge>
            </div>
            <p className="text-sm text-muted-foreground">缺口約 <span className="font-medium text-foreground text-base">{remainingWater.toLocaleString()}</span> ml</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}