import { useContext } from "react";
import { Box, Info, PawPrint, Baby, AlertTriangle, Clock, Pill, ChevronRight } from "lucide-react";
import { identityConstants } from "@/constant/family";
import { preparednessLevels } from "@/constant/stock";
import { modalTypeConstant } from "@/interfaces/modal";
import { ModalContext } from "@/store/modal";
import { SettingContext } from "@/store/setting";
import { StockListContext } from "@/store/stockList";
import { useDashboardStats, type CategoryTagSummary } from "@/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";

export default function SurvivalAnalysis() {
  const { survivalDays, currentCalories, progressPercent, specialNeedsStatus } = useDashboardStats();
  const { openModal } = useContext(ModalContext);
  const { setting, household } = useContext(SettingContext);
  const { relativeTime, stockList } = useContext(StockListContext);

  const level = preparednessLevels.find((level) => progressPercent >= level.minPercentage);    
  const targetDays = setting?.targetDays || 30;
  
  const renderSpecialStatus = (
    title: string,
    status: CategoryTagSummary | null,
    icon: React.ReactNode,
    theme: {
      accentColor: string;
      iconBg: string;
    }
  ) => {
    if (!status) return null;
    const isCrisis = status.days === 0;
    const tagList = Object.values(status.tags);

    return (
      <Card
        className={`flex flex-col border transition-all duration-200 ${
          isCrisis
            ? "border-danger/40 bg-danger/[0.04] shadow-sm shadow-danger/5"
            : "border-border/50 bg-card/40 backdrop-blur-sm hover:border-border/80"
        }`}
      >
        <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${theme.iconBg} ${theme.accentColor}`}>
                {icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-foreground truncate">
                  {title}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {isCrisis ? "⚠️ 庫存耗盡需補充" : `短板：${status.bottleneck || "充足"}`}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1 shrink-0 ml-3">
              <span className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${isCrisis ? "text-danger" : "text-foreground"}`}>
                {status.days}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">天</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4 pt-3 flex flex-col gap-2">
          {tagList.length > 0 ? (
            <div>
              <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                各標籤庫存狀態
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tagList.map((tag, idx) => {
                  const isTagZero = tag.days === 0;
                  return (
                    <li
                      key={idx}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
                        isTagZero
                          ? "bg-danger/10 border-danger/20 text-danger font-semibold"
                          : "bg-muted/20 border-border/40 text-foreground/90 hover:bg-muted/30"
                      }`}
                    >
                      <span className="truncate mr-2 font-medium" title={tag.label}>
                        {tag.label}
                      </span>
                      <span className={`font-bold shrink-0 tabular-nums ${isTagZero ? "text-danger" : "text-foreground"}`}>
                        {tag.days} 天
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-muted-foreground">
              尚未設定具體品項
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const hasInfant = !!specialNeedsStatus?.infant;
  const hasPet = !!specialNeedsStatus?.pet;
  const hasMedicine = !!specialNeedsStatus?.medicine;
  const hasSpecial = hasInfant || hasPet || hasMedicine;

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
      {stockList.length > 0 && (
        <>
          {relativeTime?.status && (relativeTime.status === 'warning' || relativeTime.status === 'danger') && (
            <NavLink to="/stock-list" className="block group">
              <div className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all hover:opacity-95 ${
                relativeTime.status === 'danger'
                  ? 'bg-danger/10 border-danger/25 text-danger'
                  : 'bg-warning/10 border-warning/25 text-warning'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <AlertTriangle className="shrink-0" size={22} />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-sm sm:text-base">
                      庫存可能已變動
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-foreground/80 truncate">
                      上次確認是 {relativeTime.timeFormat}，建議再次確認。
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button variant="outline" size="sm" className="bg-background shadow-sm hover:bg-muted/50 hidden sm:flex border-border/60 text-foreground">
                    前往確認
                  </Button>
                  <ChevronRight size={18} className="text-muted-foreground sm:hidden" />
                </div>
              </div>
            </NavLink>
          )}

          {!relativeTime?.status && (
            <NavLink to="/stock-list" className="block group">
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border bg-warning/10 border-warning/25 text-warning transition-all hover:opacity-95">
                <div className="flex items-center gap-3 min-w-0">
                  <AlertTriangle className="shrink-0" size={22} />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-sm sm:text-base">尚未確認庫存</span>
                    <span className="text-xs sm:text-sm font-medium text-foreground/80 truncate">
                      為確保備戰狀態準確，建議確認目前庫存。
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button variant="outline" size="sm" className="bg-background shadow-sm hover:bg-muted/50 hidden sm:flex border-border/60 text-foreground">
                    前往確認
                  </Button>
                  <ChevronRight size={18} className="text-muted-foreground sm:hidden" />
                </div>
              </div>
            </NavLink>
          )}
        </>
      )}

      <Card className="flex flex-col h-full border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-muted-foreground text-base sm:text-lg font-semibold flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-foreground">
              <span>備戰狀態</span>
              <Box strokeWidth={1.8} size={20} className="text-primary" />
            </div>

            {stockList.length > 0 && (
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:opacity-85 transition-opacity active:scale-95 outline-none"
                onClick={() => openModal(modalTypeConstant.INVENTORY_CONFIRM)}
              >
                {relativeTime?.status ? (
                  relativeTime.status === 'success' ? (
                    <span className="flex items-center gap-1.5 bg-muted/50 text-muted-foreground px-2.5 py-1.5 rounded-lg border border-border/40">
                      <Clock size={13} className="text-primary" />
                      <span className="hidden sm:inline">上次確認:</span>
                      <span className="text-foreground">{relativeTime.timeFormat}</span>
                    </span>
                  ) : (
                    <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
                      relativeTime.status === 'danger'
                        ? 'bg-danger/10 text-danger border-danger/20'
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      <AlertTriangle size={13} />
                      <span className="hidden sm:inline">已 {relativeTime.timeFormat} 未確認</span>
                      <span className="sm:hidden">{relativeTime.timeFormat}未確認</span>
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1.5 bg-warning/10 text-warning px-2.5 py-1.5 rounded-lg border border-warning/20">
                    <AlertTriangle size={13} />
                    <span>尚未確認</span>
                  </span>
                )}
              </button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 sm:pt-0">
          <div className="flex flex-col md:flex-row md:items-stretch gap-6 lg:gap-8">
            
            {/* Left Hero Column: Survival Days & Level Gauge */}
            <div className="flex-1 flex flex-col justify-between gap-4 sm:gap-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`${level?.className} text-8xl sm:text-9xl lg:text-[10rem] font-black tracking-tighter leading-none select-none drop-shadow-sm`}>
                    {survivalDays}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold text-muted-foreground/80">
                    天
                  </span>
                </div>
              </div>

              {/* Preparedness Level Badge & Progress Bar */}
              <div className="flex flex-col gap-2 pt-1 sm:pt-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => openModal(modalTypeConstant.STATUS_INFO)}
                    className="group flex items-center gap-1.5 text-sm sm:text-base font-bold transition-opacity hover:opacity-80"
                  >
                    <span className={`${level?.className} flex items-center gap-1.5`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${level?.progressClass} animate-pulse`} />
                      {level?.label}
                    </span>
                    <Info size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                  
                  <div className="flex items-baseline gap-1 text-xs sm:text-sm font-semibold text-muted-foreground">
                    <span>達成率</span>
                    <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">{progressPercent}%</span>
                  </div>
                </div>

                <div className="relative">
                  <Progress
                    value={progressPercent}
                    indicatorColor={level?.progressClass}
                    className={`h-3 w-full bg-muted/60 ${level?.progressBgClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Hairline Divider on desktop */}
            <div className="hidden md:block w-px bg-border/40 my-1 shrink-0" />

            {/* Right Column: Key Metrics Grid */}
            <div className="flex-1">
              <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 h-full">
                <li className="flex flex-col justify-between p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/40 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground">目標天數</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                      {targetDays}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">天</span>
                  </div>
                </li>

                <li className="flex flex-col justify-between p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/40 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground">
                    {survivalDays >= targetDays ? "超越目標" : "距離目標"}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className={`text-xl sm:text-2xl font-bold tabular-nums ${survivalDays >= targetDays ? "text-success" : "text-warning"}`}>
                      {Math.abs(survivalDays - targetDays)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">天</span>
                  </div>
                </li>

                <li className="flex flex-col justify-between p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/40 transition-colors">
                  <span className="text-xs font-medium text-muted-foreground">總儲備熱量</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                      {currentCalories.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">kcal</span>
                  </div>
                </li>

                <li className="flex flex-col justify-between p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/40 transition-colors relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">家庭成員</span>
                    {breakdownText && <Info size={13} className="text-muted-foreground/60" />}
                  </div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                      {household.length}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">人/寵</span>
                  </div>
                  {breakdownText && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover text-popover-foreground border border-border shadow-lg rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-all z-50">
                      {breakdownText}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-border" />
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Needs Status Cards (Infant / Pet / Medicine) */}
      {hasSpecial && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {hasInfant && (
            <div>
              {renderSpecialStatus(
                `${identityConstants.infant}主食狀態`,
                specialNeedsStatus?.infant || null,
                <Baby strokeWidth={1.8} size={20} />,
                {
                  accentColor: "text-primary",
                  iconBg: "bg-primary/10",
                }
              )}
            </div>
          )}
          {hasPet && (
            <div>
              {renderSpecialStatus(
                `${identityConstants.pet}主食狀態`,
                specialNeedsStatus?.pet || null,
                <PawPrint strokeWidth={1.8} size={20} />,
                {
                  accentColor: "text-amber-500",
                  iconBg: "bg-amber-500/10",
                }
              )}
            </div>
          )}
          {hasMedicine && (
            <div>
              {renderSpecialStatus(
                "指定用藥狀態",
                specialNeedsStatus?.medicine || null,
                <Pill strokeWidth={1.8} size={20} />,
                {
                  accentColor: "text-rose-500",
                  iconBg: "bg-rose-500/10",
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}