import { Zap, ClipboardPen } from 'lucide-react';
import { stockFieldLabel } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockTips() {
  const { stockCount, withinRotationDaysStock, expiringSoonStock, expiredStock, missingInfoStock } = useDashboardStats();

  const showCount = 4;
  const priorityItemsCommonClassName = 'bg-muted/30 p-4 rounded-xl border border-border/40 flex flex-col gap-2 transition-colors hover:bg-muted/50';
  const priorityItems = [
    ...expiredStock.map((stock) => (
      <li key={`expired-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="font-semibold text-base overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm font-bold text-danger">已過期</span>
      </li>
    )),
    ...expiringSoonStock.map((stock) => (
      <li key={`expiring-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="font-semibold text-base overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm font-bold text-warning">即將到期</span>
      </li>
    )),
    ...withinRotationDaysStock.map((stock) => (
      <li key={`rotation-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="font-semibold text-base overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm font-bold text-info">需要輪替</span>
      </li>
    )),
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
      <Card className="bg-card/40 backdrop-blur-sm shadow-none border-border/50">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
            <span>優先處理</span>
            <Zap strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4`}>
            {priorityItems.length > 0 ? priorityItems.slice(0, showCount) : (
               <li className="col-span-full py-4 text-center text-base text-muted-foreground">目前無待處理項目</li>
            )}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="bg-card/40 backdrop-blur-sm shadow-none border-border/50">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-muted-foreground text-lg font-semibold flex items-center gap-2">
            <span>需要補充資料</span>
            <ClipboardPen strokeWidth={1.5} size={20}/>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4`}>
            {
              stockCount === 0 ? (
                <li className="col-span-full py-4 text-center text-base text-muted-foreground">目前無庫存</li>
              ) : missingInfoStock.length > 0 ? missingInfoStock.slice(0, showCount).map((item) => (
                <li key={item.stock.id} className={`${priorityItemsCommonClassName}`}>
                  <span className="font-semibold text-base overflow-hidden-ellipsis">{item.stock.name}</span>
                  <span className="text-sm text-muted-foreground overflow-hidden-ellipsis">{item.missingFields.map((field) => stockFieldLabel[field]).join(', ')}</span>
                </li>
              )) : (
                <li className="col-span-full py-4 text-center text-base text-muted-foreground">所有資料皆已完善</li>
              )
            }
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}