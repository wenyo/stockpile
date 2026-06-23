import { stockUnit } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function RecentStock() {
  const { recentStock } = useDashboardStats();
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col">
      <p className="text-(--card-foreground) text-lg">最近新增物資</p>
      <ul className="text-(--card-foreground)">
        {recentStock.map((stock) => (
          <li key={stock.id}>{stock.name} {stock.count}{stockUnit[stock.unit]}</li>
        ))}
      </ul>
    </div>
  )
}