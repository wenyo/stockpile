import { useContext } from "react";
import { Box, Info } from "lucide-react";
import { preparednessLevels } from "@/constant/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SurvivalAnalysis() {
  const { survivalDays, config, currentCalories, progressPercent } = useDashboardStats();
  const { openModal } = useContext(ModalContext);
  const { setting } = useContext(SettingContext);

  const level = preparednessLevels.find((level) => progressPercent >= level.minPercentage);    
  
  return (
    <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
          <span>備戰狀態</span>
          <Box strokeWidth={1.5} size={20}/>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
          <p className={`${level?.className} flex items-end gap-2 text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter`}>{survivalDays}<span className="mb-2 text-3xl md:text-5xl lg:text-6xl font-medium tracking-normal text-muted-foreground">天</span></p>
          <p className={`${level?.className} flex items-center gap-2 text-xl md:text-2xl font-bold tracking-wider mb-1`}>{level?.label}<Info className="text-muted-foreground cursor-pointer" size={16} onClick={() => openModal(modalTypeConstant.STATUS_INFO)} /></p>
        </div>
        <Progress value={progressPercent} indicatorColor={level?.bgClassName} className="mt-2 h-3 md:h-4 w-full" />
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mt-4">
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">目標</span>
            <span className="font-semibold text-lg">{setting.targetDays} 天</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">達成率</span>
            <span className="font-semibold text-lg">{progressPercent}%</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50 xl:col-span-1 md:col-span-3 lg:col-span-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">總熱量</span>
            <span className="font-semibold text-lg">{currentCalories.toLocaleString()} kcal</span>
          </li>
          {/* <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">人數</span>
            <span className="font-semibold text-lg">{config.people} 人份</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">每日每人熱量</span>
            <span className="font-semibold text-lg">{config.onePersonOneDayCalories} kcal</span>
          </li> */}
        </ul>
      </CardContent>
    </Card>
  )
}