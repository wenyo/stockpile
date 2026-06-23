import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function SummaryTable() {
  const { survivalDays, totalCalories, stockCount } = useDashboardStats();
  return (
    <ul className="grid grid-cols-4 gap-2">
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">可支撐天數</p>
        <p className="text-(--text-primary) text-2xl font-bold">{survivalDays} 天</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">到期警示</p>
        <p className="text-(--text-primary) text-2xl font-bold">3 項</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">總熱量</p>
        <p className="text-(--text-secondary) text-2xl font-bold">{totalCalories}</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">物資數量</p>
        <p className="text-(--text-secondary) text-2xl font-bold">{stockCount} 項</p>
      </li>
    </ul>
  )
}