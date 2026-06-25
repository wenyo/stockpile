import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function SummaryTable() {
  const { expiredStock, missingInfoStock, expiringSoonStock, withinRotationDaysStock } = useDashboardStats();
  return (
    <ul className="grid grid-cols-4 gap-2">
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-muted-foreground text-sm">已過期</p>
        <p className={`text-2xl font-bold ${expiredStock.length > 0 ? 'text-danger opacity-80' : 'text-muted-foreground'}`}>{expiredStock.length} 項</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-muted-foreground text-sm">即將到期</p>
        <p className="text-(--text-primary) text-2xl font-bold text-warning opacity-80">{ expiringSoonStock.length } 項</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-muted-foreground text-sm">需要輪替</p>
        <p className="text-(--text-primary) text-2xl font-bold"> {withinRotationDaysStock.length} 項</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-muted-foreground text-sm">待補資料</p>
        <p className="text-(--text-secondary) text-2xl font-bold">{ missingInfoStock.length  } 項</p>
      </li>
    </ul>
  )
}