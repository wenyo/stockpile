import { useContext } from "react";
import { Box, Info, PawPrint, Baby, AlertTriangle, Clock } from "lucide-react";
import { identityConstants } from "@/constant/family";
import { preparednessLevels, stockFieldLabel } from "@/constant/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
import { StockListContext } from "@/store/stockList";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";

export default function SurvivalAnalysis() {
  const { survivalDays, currentCalories, progressPercent, specialMemberStatus, feedTagStats } = useDashboardStats();
  const { openModal } = useContext(ModalContext);
  const { setting, household } = useContext(SettingContext);
  const { relativeTime, stockList } = useContext(StockListContext);

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

  const breakdown = household.reduce((acc, curr) => {
    acc[curr.identity] = (acc[curr.identity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const breakdownText = [
    breakdown.adult ? `${breakdown.adult}${identityConstants.adult}` : '',
    breakdown.child ? `${breakdown.child}${identityConstants.child}` : '',
    breakdown.infant ? `${breakdown.infant}${identityConstants.infant}` : '',
    breakdown.pet ? `${breakdown.pet}${identityConstants.pet}` : '',
  ].filter(Boolean).join('、');

  return (
    <div className="flex flex-col gap-4">
      {
        stockList.length > 0 && (
          <>
            {relativeTime?.status && (relativeTime.status === 'warning' || relativeTime.status === 'danger') && (
              <div className={`flex items-center justify-between p-3 md:p-4 rounded-xl border ${relativeTime.status === 'danger' ? 'bg-danger/10 border-danger/20' : 'bg-warning/10 border-warning/20'}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={relativeTime.status === 'danger' ? 'text-danger' : 'text-warning'} size={24} />
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${relativeTime.status === 'danger' ? 'text-danger' : 'text-warning'}`}>
                      庫存可能已變動
                    </span>
                    <span className="text-sm font-medium text-foreground/80">
                      上次確認是 {relativeTime.timeFormat}，建議再次確認。
                    </span>
                  </div>
                </div>
                <NavLink to="/stock-list">
                  <Button variant="outline" size="sm" className="bg-background shadow-sm hover:bg-muted/50 hidden sm:flex border-border/60">
                    前往確認
                  </Button>
                </NavLink>
              </div>
            )}
            {!relativeTime?.status && (
              <div className="flex items-center justify-between p-3 md:p-4 rounded-xl border bg-warning/10 border-warning/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-warning" size={24} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-warning">尚未確認庫存</span>
                    <span className="text-sm font-medium text-foreground/80">
                      為確保備戰狀態準確，建議確認目前庫存。
                    </span>
                  </div>
                </div>
                <NavLink to="/stock-list">
                  <Button variant="outline" size="sm" className="bg-background shadow-sm hover:bg-muted/50 hidden sm:flex border-border/60">
                    前往確認
                  </Button>
                </NavLink>
              </div>
            )}
          </>
        )
      }


      <div className={`grid grid-cols-1 ${hasSpecial ? 'xl:grid-cols-3' : ''} gap-3 md:gap-4`}>
        <Card className={`flex flex-col h-full border-border/50 bg-card/40 backdrop-blur-sm ${hasSpecial ? 'xl:col-span-2' : ''}`}>
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span>備戰狀態</span>
            <Box strokeWidth={1.5} size={20}/>
          </div>
          
          {
            stockList.length > 0 && (
              <div 
                className="flex items-center gap-1.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => openModal(modalTypeConstant.INVENTORY_CONFIRM)}
              >
                {relativeTime?.status ? (
                relativeTime.status === 'success' ? (
                  <span className="flex items-center gap-1.5 bg-muted/40 text-muted-foreground px-2.5 py-1.5 rounded-md border border-border/40">
                    <Clock size={13} className="text-primary/70" />
                    <span className="hidden sm:inline">上次確認:</span>
                    <span className="text-foreground/80">{relativeTime.timeFormat}</span>
                  </span>
                ) : (
                  <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${relativeTime.status === 'danger' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                    <AlertTriangle size={13} />
                    <span className="hidden sm:inline">已 {relativeTime.timeFormat} 未確認</span>
                    <span className="sm:hidden">{relativeTime.timeFormat}未確認</span>
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1.5 bg-warning/10 text-warning px-2.5 py-1.5 rounded-md border border-warning/20">
                  <AlertTriangle size={13} />
                  <span>尚未確認</span>
                </span>
              )}
            </div>
            )
          }
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
            <span className="font-semibold text-base md:text-lg">{setting?.targetDays || 30} 天</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">達成率</span>
            <span className="font-semibold text-base md:text-lg">{progressPercent}%</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50 xl:col-span-1 lg:col-span-1">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">{stockFieldLabel.totalCalories}</span>
            <span className="font-semibold text-base md:text-lg">{currentCalories.toLocaleString()} kcal</span>
          </li>
          <li className="flex justify-between flex-col bg-muted/50 p-3 md:p-4 rounded-xl text-sm md:text-base border border-border/50">
            <span className="text-muted-foreground text-xs md:text-sm font-medium mb-1">家庭成員數</span>
            <div className="group relative flex items-center gap-1.5 cursor-pointer w-max outline-none" tabIndex={0}>
              <span className="font-semibold text-base md:text-lg leading-none">{household.length}</span>
              <Info size={14} className="text-muted-foreground opacity-60" />
              
              {breakdownText && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover text-popover-foreground border border-border shadow-md rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all pointer-events-none z-50">
                  {breakdownText}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-border"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-popover -mt-[1px]"></div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>

    {hasSpecial && (
      <div className="flex flex-col gap-3 md:gap-4 h-full xl:col-span-1">
        <div className={hasInfant ? "flex-1" : "hidden"}>
          {renderSpecialStatus(`${identityConstants.infant}主食狀態`, specialMemberStatus?.infant || null, "infantStapleFood")}
        </div>
        <div className={hasPet ? "flex-1" : "hidden"}>
          {renderSpecialStatus(`${identityConstants.pet}主食狀態`, specialMemberStatus?.pet || null, "petStapleFood")}
        </div>
      </div>
    )}
      </div>
    </div>
  )
}