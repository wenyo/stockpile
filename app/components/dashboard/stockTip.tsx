import { stockFieldLabel } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Zap, ClipboardPen } from 'lucide-react';

export default function StockTips() {
  const { withinRotationDaysStock, expiringSoonStock, expiredStock, missingInfoStock } = useDashboardStats();
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-md flex gap-2 items-center">
          <span>優先處理</span>
          <Zap strokeWidth={1.5} size={18}/>
        </p>
        <ul>
          {expiredStock.map((stock) => (
            <li key={stock.id}>
              <span>已過期</span>
              <span>{stock.name}</span>
            </li>
          ))}
          {expiringSoonStock.map((stock) => (
            <li key={stock.id}>
              <span>即將到期</span>
              <span>{stock.name}</span>
            </li>
          ))}
          {withinRotationDaysStock.map((stock) => (
            <li key={stock.id}>
              <span>需要輪替</span>
              <span></span>{stock.name}</li>
          ))}
        </ul>
      </div>
      <div className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-md flex gap-2 items-center">
          <span>需要補充資料</span>
          <ClipboardPen strokeWidth={1.5} size={18}/>
        </p>
        <ul>
          {missingInfoStock.map((item) => (
            <li key={item.stock.id}>{item.stock.name} {item.missingFields.map((field) => stockFieldLabel[field]).join(', ')}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}