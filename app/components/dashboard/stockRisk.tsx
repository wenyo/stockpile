import { Droplet, Soup, Activity, AlertTriangle, Baby, PawPrint, HeartPulse, Flame, Zap, PackageOpen, Wrench, ShieldAlert, BriefcaseMedical } from 'lucide-react';
import { stockType } from "@/constant/stock";
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// 對應 icon mapping
const typeIconMap: Record<string, React.ReactNode> = {
  water: <Droplet strokeWidth={1.5} size={20} />,
  food: <Soup strokeWidth={1.5} size={20} />,
  medical: <HeartPulse strokeWidth={1.5} size={20} />,
  light: <Flame strokeWidth={1.5} size={20} />,
  communication: <Zap strokeWidth={1.5} size={20} />,
  tool: <Wrench strokeWidth={1.5} size={20} />,
  infantStapleFood: <Baby strokeWidth={1.5} size={20} />,
  petStapleFood: <PawPrint strokeWidth={1.5} size={20} />,
};

const getIcon = (type: string) => typeIconMap[type] || <PackageOpen strokeWidth={1.5} size={20} />;

export default function StockRisk() {
  const { missingTypeStock, survivalFoodDays, survivalWaterDays, specialNeedsStatus, setting } = useDashboardStats();

  const targetDays = setting?.targetDays || 30;

  const progressDomAry = {
    water: { label: stockType.water, icon: <Droplet strokeWidth={1.5} size={18} />, days: survivalWaterDays, barColor: "bg-info", textColor: "text-info" },
    food: { label: stockType.food, icon: <Soup strokeWidth={1.5} size={18} />, days: survivalFoodDays, barColor: "bg-warning", textColor: "text-warning" },
    infant: { label: stockType.infantStapleFood, icon: <Baby strokeWidth={1.5} size={18} />, days: specialNeedsStatus?.infant?.days || 0, barColor: "bg-primary", textColor: "text-primary" },
    pet: { label: stockType.petStapleFood, icon: <PawPrint strokeWidth={1.5} size={18} />, days: specialNeedsStatus?.pet?.days || 0, barColor: "bg-amber-600", textColor: "text-amber-600" },
    medicine: { label: stockType.medicine, icon: <BriefcaseMedical strokeWidth={1.5} size={18} />, days: specialNeedsStatus?.medicine?.days || 0, barColor: "bg-rose-500", textColor: "text-rose-500" }
  };

  type SurvivalPillar = (typeof progressDomAry)[keyof typeof progressDomAry];
  let survivalPillars: SurvivalPillar[] = [progressDomAry.water, progressDomAry.food];
  if (specialNeedsStatus?.infant) survivalPillars.push(progressDomAry.infant);
  if (specialNeedsStatus?.pet) survivalPillars.push(progressDomAry.pet);
  if (specialNeedsStatus?.medicine) survivalPillars.push(progressDomAry.medicine);

  // 排序：最短天數排前面以抓出瓶頸
  survivalPillars = [...survivalPillars].sort((a, b) => a.days - b.days);
  const bottleneck = survivalPillars[0];

  // 判斷風險層級
  const criticalTypes = ['water', 'food', 'infantStapleFood', 'petStapleFood', 'medicine', 'medical'];
  const sortedMissingTypes = [...missingTypeStock].sort((a, b) => {
    const isACritical = criticalTypes.includes(a);
    const isBCritical = criticalTypes.includes(b);
    return isACritical === isBCritical ? 0 : isACritical ? -1 : 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3 md:pb-4 border-b border-border/30">
          <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
            <span>資源瓶頸分析</span>
            <Activity strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4">
          
          <div className="flex items-start gap-4 p-4 bg-danger/10 border border-danger/20 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px]">
              <ShieldAlert size={60} className="text-danger" />
            </div>
            <div className="z-10">
              <h4 className="text-sm font-semibold text-danger mb-1 flex items-center gap-1.5"><AlertTriangle size={16} />家庭最短板</h4>
              <p className="text-foreground text-base">
                目前限制家庭生存天數的主因是 <span className={`font-bold ${bottleneck.textColor} underline underline-offset-4 decoration-2 px-1`}>{bottleneck.label}</span>
                <span className="text-muted-foreground ml-1">僅可支撐 <strong>{bottleneck.days}</strong> 天，距離目標 {targetDays} 天還差 <strong>{Math.max(0, targetDays - bottleneck.days)}</strong> 天。</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {survivalPillars.map((pillar, idx) => {
              const percent = Math.min(100, Math.round((pillar.days / targetDays) * 100));
              const isBottleneck = pillar.label === bottleneck.label;
              return (
                <div key={idx} className={`flex flex-col gap-1.5 p-3 rounded-lg border ${isBottleneck ? 'bg-muted/50 border-border/60 shadow-sm' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${pillar.textColor}`}>{pillar.icon}</div>
                      <span className="text-sm font-semibold text-foreground">{pillar.label}</span>
                    </div>
                    <span className="text-sm font-medium"><span className="font-bold text-base mr-1">{pillar.days}</span>天</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={percent} indicatorColor={pillar.barColor} className="h-2.5 flex-1 opacity-90" />
                    <span className="text-xs font-semibold text-muted-foreground min-w-[36px] text-right">{percent >= 100 ? '已達標' : `${percent}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3 md:pb-4 border-b border-border/30">
          <CardTitle className="text-danger opacity-90 text-lg font-semibold flex items-center gap-2">
            <span>物資缺失風險</span>
            <AlertTriangle strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className='flex flex-col gap-2.5'>
            {sortedMissingTypes.length > 0 ? (
              sortedMissingTypes.map((type) => {
                const isCritical = criticalTypes.includes(type);
                const bgClass = isCritical ? 'bg-danger/10 border-danger/20' : 'bg-warning/10 border-warning/20';
                const textClass = isCritical ? 'text-danger' : 'text-warning';
                
                return (
                  <div key={type} className={`flex items-center justify-between p-3 md:p-3.5 rounded-xl border ${bgClass}`}>
                    <div className="flex items-center gap-3">
                      <div className={textClass}>
                        {getIcon(type)}
                      </div>
                      <span className={`text-sm md:text-base font-semibold ${textClass}`}>
                        完全沒有 {stockType[type as keyof typeof stockType]}
                      </span>
                    </div>
                    {isCritical ? (
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-danger text-white px-2 py-0.5 rounded-full">致命</span>
                    ) : (
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-warning text-white px-2 py-0.5 rounded-full">次要</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <ShieldAlert size={40} className="mb-2 opacity-20" />
                <p className="text-base font-medium">六大類生存物資皆已準備齊全</p>
                <p className="text-sm mt-1">目前無任何種類缺失的情形</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}