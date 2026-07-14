import { useContext } from "react";
import { Box, Info, PawPrint, Baby } from "lucide-react";
import { preparednessLevels, stockFieldLabel } from "@/constant/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SurvivalAnalysis() {
  const { survivalDays, currentCalories, progressPercent, specialMemberStatus, feedTagStats } = useDashboardStats();
  const { openModal } = useContext(ModalContext);
  const { setting } = useContext(SettingContext);

  const level = preparednessLevels.find((level) => progressPercent >= level.minPercentage);    
  
  const renderSpecialStatus = (
    title: string,
    status: { days: number, bottleneck: string } | null,
    targetType: string
  ) => {
    if (!status) return null;
    const isCrisis = status.days === 0;

    const relevantTags = Object.values(feedTagStats).filter(t => t.appliesToStockType === targetType);

    return (
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-2 md:pb-4 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-base font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              {title}
              {targetType === "petStapleFood" ? <PawPrint strokeWidth={1.5} size={20} /> : <Baby strokeWidth={1.5} size={20} />}
            </span>
            <span className={`text-xl font-bold ${isCrisis ? "text-danger" : "text-foreground"}`}>
              {status.days} 天
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-3">
          {relevantTags.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground mb-2 block">各標籤庫存狀態</span>
              <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {relevantTags.map((tag, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 rounded-md bg-muted/10 border border-border/40 text-sm">
                    <span className="text-muted-foreground truncate mr-2" title={tag.label}>{tag.label}</span>
                    <span className={`font-semibold shrink-0 ${tag.days === 0 ? "text-danger" : ""}`}>{tag.days} 天</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
            <span className="text-muted-foreground text-sm font-medium mb-1">{stockFieldLabel.totalCalories}</span>
            <span className="font-semibold text-lg">{currentCalories.toLocaleString()} kcal</span>
          </li>
          {/* <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">人數</span>
            <span className="font-semibold text-lg">{household.people} 人份</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">每日每人熱量</span>
            <span className="font-semibold text-lg">{household.onePersonOneDayCalories} kcal</span>
          </li> */}
        </ul>
      </CardContent>
    </Card>

    {specialMemberStatus && (specialMemberStatus.infant || specialMemberStatus.pet) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSpecialStatus("嬰幼兒主食狀態", specialMemberStatus.infant, "infantStapleFood")}
        {renderSpecialStatus("寵物主食狀態", specialMemberStatus.pet, "petStapleFood")}
      </div>
    )}
  </div>
  )
}