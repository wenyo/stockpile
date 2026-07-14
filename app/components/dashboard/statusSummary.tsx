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
  const { setting, household } = useContext(SettingContext);

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
      <Card className="flex flex-col border-border/50 bg-card/40 backdrop-blur-sm h-full">
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
        <CardContent className="pt-3 md:pt-4 flex flex-col gap-2 md:gap-3">
          {relevantTags.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground mb-1.5 block">各標籤庫存狀態</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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

  const hasInfant = !!specialMemberStatus?.infant;
  const hasPet = !!specialMemberStatus?.pet;
  const hasSpecial = hasInfant || hasPet;

  return (
    <div className={`grid grid-cols-1 ${hasSpecial ? 'xl:grid-cols-3' : ''} gap-3 md:gap-4`}>
      <Card className={`flex flex-col h-full border-border/50 bg-card/40 backdrop-blur-sm ${hasSpecial ? 'xl:col-span-2' : ''}`}>
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
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 md:gap-3 mt-3 md:mt-4">
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">目標</span>
            <span className="font-semibold text-base md:text-lg">{setting.targetDays} 天</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">達成率</span>
            <span className="font-semibold text-base md:text-lg">{progressPercent}%</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50 xl:col-span-1 md:col-span-3 lg:col-span-1">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">{stockFieldLabel.totalCalories}</span>
            <span className="font-semibold text-base md:text-lg">{currentCalories.toLocaleString()} kcal</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">家聽成員數</span>
            <span className="font-semibold text-lg">{household.length}</span>
          </li>
          {/* <li className="flex justify-between flex-col bg-muted/50 p-4 rounded-xl text-base border border-border/50">
            <span className="text-muted-foreground text-sm font-medium mb-1">每日每人熱量</span>
            <span className="font-semibold text-lg">{household.onePersonOneDayCalories} kcal</span>
          </li> */}
        </ul>
      </CardContent>
    </Card>

    {hasSpecial && (
      <div className="flex flex-col gap-3 md:gap-4 h-full xl:col-span-1">
        <div className={hasInfant ? "flex-1" : "hidden"}>
          {renderSpecialStatus("嬰幼兒主食狀態", specialMemberStatus?.infant || null, "infantStapleFood")}
        </div>
        <div className={hasPet ? "flex-1" : "hidden"}>
          {renderSpecialStatus("寵物主食狀態", specialMemberStatus?.pet || null, "petStapleFood")}
        </div>
      </div>
    )}
  </div>
  )
}