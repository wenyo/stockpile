import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryTable() {
  const { expiredStock, missingInfoStock, expiringSoonStock, withinRotationDaysStock } = useDashboardStats();
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 border-border/50">
      <Card className="bg-card/40 backdrop-blur-sm shadow-none">
        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full gap-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">已過期</p>
          <p className={`text-4xl md:text-5xl font-bold tracking-tighter ${expiredStock.length > 0 ? 'text-danger' : 'text-muted-foreground'}`}>{expiredStock.length} <span className="text-base font-normal text-muted-foreground ml-1">項</span></p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/40 backdrop-blur-sm shadow-none">
        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full gap-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">即將到期</p>
          <p className="text-warning text-4xl md:text-5xl font-bold tracking-tighter">{expiringSoonStock.length} <span className="text-base font-normal text-muted-foreground ml-1">項</span></p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/40 backdrop-blur-sm shadow-none">
        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full gap-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">需要輪替</p>
          <p className="text-info text-4xl md:text-5xl font-bold tracking-tighter">{withinRotationDaysStock.length} <span className="text-base font-normal text-muted-foreground ml-1">項</span></p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/40 backdrop-blur-sm shadow-none">
        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full gap-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">待補資料</p>
          <p className="text-foreground text-4xl md:text-5xl font-bold tracking-tighter">{missingInfoStock.length} <span className="text-base font-normal text-muted-foreground ml-1">項</span></p>
        </CardContent>
      </Card>
    </div>
  )
}