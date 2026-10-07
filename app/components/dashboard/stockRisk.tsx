import React from 'react';
import {
  Droplet,
  Soup,
  Activity,
  AlertTriangle,
  Baby,
  PawPrint,
  HeartPulse,
  Flame,
  Zap,
  PackageOpen,
  Wrench,
  BriefcaseMedical,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { stockType } from "@/constant/stock";
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// 物資類別圖示對應
const typeIconMap: Record<string, React.ReactNode> = {
  water: <Droplet strokeWidth={1.8} size={18} />,
  food: <Soup strokeWidth={1.8} size={18} />,
  medical: <HeartPulse strokeWidth={1.8} size={18} />,
  light: <Flame strokeWidth={1.8} size={18} />,
  communication: <Zap strokeWidth={1.8} size={18} />,
  tool: <Wrench strokeWidth={1.8} size={18} />,
  infantStapleFood: <Baby strokeWidth={1.8} size={18} />,
  petStapleFood: <PawPrint strokeWidth={1.8} size={18} />,
  medicine: <BriefcaseMedical strokeWidth={1.8} size={18} />,
};

const getIcon = (type: string) => typeIconMap[type] || <PackageOpen strokeWidth={1.8} size={18} />;

export default function StockRisk() {
  const { missingTypeStock, survivalFoodDays, survivalWaterDays, specialNeedsStatus, setting } = useDashboardStats();

  const targetDays = setting?.targetDays || 30;

  const rawPillarSetting = {
    water: {
      key: 'water',
      label: stockType.water,
      icon: typeIconMap.water,
      days: survivalWaterDays,
    },
    food: {
      key: 'food',
      label: stockType.food,
      icon: typeIconMap.food,
      days: survivalFoodDays,
    },
    infant: {
      key: 'infant',
      label: stockType.infantStapleFood,
      icon: typeIconMap.infant,
      days: specialNeedsStatus?.infant?.days || 0,
    },
    pet: {
      key: 'pet',
      label: stockType.petStapleFood,
      icon: typeIconMap.pet,
      days: specialNeedsStatus?.pet?.days || 0,
    },
    medicine: {
      key: 'medicine',
      label: stockType.medicine,
      icon: typeIconMap.medicine,
      days: specialNeedsStatus?.medicine?.days || 0,
    },
  }

  // 基礎支柱資料
  type RawPillarsType = (typeof rawPillarSetting)[keyof typeof rawPillarSetting];
  const rawPillars: RawPillarsType[] = [ rawPillarSetting.water, rawPillarSetting.food ];
  if (specialNeedsStatus?.infant) rawPillars.push(rawPillarSetting.infant);
  if (specialNeedsStatus?.pet) rawPillars.push(rawPillarSetting.pet);
  if (specialNeedsStatus?.medicine) rawPillars.push(rawPillarSetting.medicine);

  // 排序：最短天數排在最前（短板優先）
  const survivalPillars = [...rawPillars].sort((a, b) => a.days - b.days);
  const bottleneck = survivalPillars[0];
  const isAllAchieved = bottleneck ? bottleneck.days >= targetDays : false;

  // 致命物資分類
  const criticalTypes = ['water', 'food', 'infantStapleFood', 'petStapleFood', 'medicine', 'medical'];
  const sortedMissingTypes = [...missingTypeStock].sort((a, b) => {
    const isACritical = criticalTypes.includes(a);
    const isBCritical = criticalTypes.includes(b);
    return isACritical === isBCritical ? 0 : isACritical ? -1 : 1;
  });

  // 系統語意健康度色彩計算（依照 preparednessLevels 體系）
  const getPillarStatus = (days: number, isBottleneck: boolean) => {
    const percent = Math.min(100, Math.round((days / targetDays) * 100));

    if (days >= targetDays) {
      return {
        percent,
        badgeText: "已達標",
        textColor: "text-success",
        barColor: "bg-success",
        badgeClass: "bg-success/10 text-success border-success/20",
      };
    }

    if (percent >= 50) {
      return {
        percent,
        badgeText: `${percent}%`,
        textColor: "text-info",
        barColor: "bg-info",
        badgeClass: "bg-info/10 text-info border-info/20",
      };
    }

    if (percent >= 25) {
      return {
        percent,
        badgeText: `${percent}%`,
        textColor: isBottleneck ? "text-danger" : "text-warning",
        barColor: isBottleneck ? "bg-danger" : "bg-warning",
        badgeClass: isBottleneck
          ? "bg-danger/10 text-danger border-danger/25"
          : "bg-warning/10 text-warning border-warning/20",
      };
    }

    return {
      percent,
      badgeText: `${percent}%`,
      textColor: "text-danger",
      barColor: "bg-danger",
      badgeClass: "bg-danger/10 text-danger border-danger/25",
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
      {/* Card 1: 資源瓶頸分析 */}
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-base sm:text-lg font-semibold flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-foreground">
              <span>資源瓶頸分析</span>
              <Activity strokeWidth={1.8} size={20} className="text-primary" />
            </div>
            <span className="text-xs font-normal text-muted-foreground">
              目標基準：{targetDays} 天
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4 flex flex-col gap-4">
          {/* 家庭最短板精煉 Banner */}
          {bottleneck && (
            <div
              className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                isAllAchieved
                  ? "bg-success/10 border-success/25 text-success"
                  : "bg-danger/10 border-danger/25 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {isAllAchieved ? (
                    <CheckCircle2 size={16} className="text-success shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-danger shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isAllAchieved ? "text-success" : "text-danger"
                    }`}
                  >
                    {isAllAchieved ? "關鍵物資全數達標" : "家庭生存最短板"}
                  </span>
                </div>
                {!isAllAchieved && (
                  <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-danger text-white shrink-0">
                    差 {Math.max(0, targetDays - bottleneck.days)} 天
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isAllAchieved ? (
                  <>
                    所有關鍵生存物資皆已達標（最低可支撐{" "}
                    <strong className="text-foreground">{bottleneck.days}</strong> 天），備戰儲備十分充足。
                  </>
                ) : (
                  <>
                    限制生存天數的主因為{" "}
                    <strong className="text-foreground font-semibold">{bottleneck.label}</strong>
                    （可支撐 <strong className="text-danger font-bold">{bottleneck.days}</strong> 天），建議優先補充。
                  </>
                )}
              </p>
            </div>
          )}

          {/* 五大支柱緊湊整合儀表清單 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1 pb-1">
              <span>關鍵物資維度</span>
              <span>儲備天數 / 達成狀態</span>
            </div>

            <div className="flex flex-col gap-2">
              {survivalPillars.map((pillar) => {
                const isBottleneck = !isAllAchieved && pillar.key === bottleneck.key;
                const status = getPillarStatus(pillar.days, isBottleneck);

                return (
                  <div
                    key={pillar.key}
                    className={`flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl border transition-all ${
                      isBottleneck
                        ? "bg-danger/[0.04] border-danger/30 shadow-xs"
                        : "bg-muted/20 border-border/40 hover:bg-muted/30"
                    }`}
                  >
                    {/* Row 1: Icon, Label, Days & Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isBottleneck
                              ? "bg-danger/10 text-danger"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {pillar.icon}
                        </div>
                        <span className="text-sm font-semibold text-foreground truncate">
                          {pillar.label}
                        </span>
                        {isBottleneck && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-danger/10 text-danger border border-danger/20 shrink-0">
                            最短板
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-base sm:text-lg font-bold tabular-nums text-foreground">
                            {pillar.days}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">天</span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border tabular-nums ${status.badgeClass}`}
                        >
                          {status.badgeText}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Progress Bar */}
                    <div className="w-full pt-0.5">
                      <Progress
                        value={status.percent}
                        indicatorColor={status.barColor}
                        className="h-2 w-full bg-muted/60"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: 物資缺失風險 */}
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-base sm:text-lg font-semibold flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-foreground">
              <span>物資缺失風險</span>
              <AlertTriangle strokeWidth={1.8} size={20} className={sortedMissingTypes.length > 0 ? "text-danger" : "text-success"} />
            </div>
            {sortedMissingTypes.length > 0 ? (
              <span className="text-xs font-bold text-danger px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20">
                {sortedMissingTypes.length} 類物資未儲備
              </span>
            ) : (
              <span className="text-xs font-bold text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                品類齊全
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4 flex flex-col justify-between flex-1">
          {sortedMissingTypes.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground px-1 pb-1">
                尚未建立任何庫存的類別
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedMissingTypes.map((type) => {
                  const isCritical = criticalTypes.includes(type);
                  const localizedTitle = stockType[type as keyof typeof stockType] || type;

                  return (
                    <div
                      key={type}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                        isCritical
                          ? "bg-danger/[0.06] border-danger/30 text-danger hover:bg-danger/[0.09]"
                          : "bg-warning/[0.06] border-warning/30 text-warning hover:bg-warning/[0.09]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isCritical ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                          }`}
                        >
                          {getIcon(type)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold truncate text-foreground">
                          {localizedTitle}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isCritical
                            ? "bg-danger text-white shadow-xs"
                            : "bg-warning text-black font-semibold shadow-xs"
                        }`}
                      >
                        {isCritical ? "致命缺失" : "次要缺失"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center my-auto">
              <div className="p-3.5 rounded-2xl bg-success/10 text-success mb-3 shadow-xs">
                <ShieldCheck size={36} strokeWidth={2} />
              </div>
              <h4 className="text-base font-bold text-foreground">所有核心生存物資皆已準備</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs">
                目前沒有任何生存類別完全零庫存，請定期巡檢到期日與輪替需求。
              </p>
            </div>
          )}

          {sortedMissingTypes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>⚠️ 標註「致命缺失」之物資為生存不可或缺項目</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}