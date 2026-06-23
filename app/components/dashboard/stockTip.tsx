import { stockFieldLabel } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function StockTips() {
  const { expiringSoonStock, missingInfoStock } = useDashboardStats();
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col test">
      <p className="text-(--card-foreground) text-lg">物資提醒</p>
      <div className="grid grid-cols-2 gap-2 mt-2 text-(--card-foreground)">
        <div>
          <p className="text-md">有 {expiringSoonStock.length} 項即將到期物資</p>
          <ul>
            {expiringSoonStock.map((stock) => (
              <li key={stock.id}>{stock.name} {stock.count}{stock.unit} {stock.expirationDate}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-(--card-foreground) text-md">有 {missingInfoStock.length} 項物資需要補充資料</p>
          <ul>
            {missingInfoStock.map((item) => (
              <li key={item.stock.id}>{item.stock.name} {item.missingFields.map((field) => stockFieldLabel[field]).join(', ')}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}