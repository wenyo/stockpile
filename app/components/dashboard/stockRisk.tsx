import { Droplet, Soup, Activity, AlertTriangle } from 'lucide-react';
import { stockType } from "@/constant/stock";
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function StockRisk() {
  const { foodGapDays, gapWaterDays, missingTypeStock, survivalFoodDays, survivalWaterDays } = useDashboardStats();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
            <span>資源瓶頸分析</span>
            <Activity strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-xl border border-border/40">
               <div className="flex items-center gap-2 md:gap-3">
                 <Droplet strokeWidth={1.5} size={20} className="text-info"/>
                 <span className="text-base font-semibold">水</span>
               </div>
               <span className="text-base">可支撐 <span className="font-bold text-foreground text-lg">{survivalWaterDays}</span> 天</span>
            </div>
            <div className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-xl border border-border/40">
               <div className="flex items-center gap-2 md:gap-3">
                 <Soup strokeWidth={1.5} size={20} className="text-warning"/>
                 <span className="text-base font-semibold">食物</span>
               </div>
               <span className="text-base">可支撐 <span className="font-bold text-foreground text-lg">{survivalFoodDays}</span> 天</span>
            </div>
          </div>
          <div className="mt-2 text-base text-muted-foreground bg-muted/50 p-4 rounded-xl border border-border/50">
            目前限制生存天數的主因： 
            <span className="font-bold text-foreground ml-1">{gapWaterDays > foodGapDays ? '水' : '食物'}</span> 不足
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-danger opacity-90 text-lg font-semibold flex items-center gap-2">
            <span>風險提醒</span>
            <AlertTriangle strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3'>
            {missingTypeStock.length > 0 ? (
              missingTypeStock.map((type) => (
                <div key={type} className="flex items-center gap-3 p-3 md:p-4 bg-danger/10 text-danger rounded-xl border border-danger/20">
                  <AlertTriangle strokeWidth={1.5} size={20} />
                  <span className="text-base font-semibold">缺少 {stockType[type as keyof typeof stockType]}</span>
                </div>
              ))
            ) : (
              <p className="text-base text-muted-foreground p-4 text-center">目前無重大風險</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}