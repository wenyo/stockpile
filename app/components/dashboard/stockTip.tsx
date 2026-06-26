import { stockFieldLabel } from "@/constant/stock";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Zap, ClipboardPen } from 'lucide-react';

export default function StockTips() {
  const { withinRotationDaysStock, expiringSoonStock, expiredStock, missingInfoStock } = useDashboardStats();

  const showCount = 4;
  const priorityItemsCommonClassName = 'bg-muted p-4 rounded-sm flex flex-col gap-1';
  const priorityItems = [
    ...expiredStock.map((stock) => (
      <li key={`expired-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm text-danger">已過期</span>
      </li>
    )),
    ...expiringSoonStock.map((stock) => (
      <li key={`expiring-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm text-warning">即將到期</span>
      </li>
    )),
    ...withinRotationDaysStock.map((stock) => (
      <li key={`rotation-${stock.id}`} className={`${priorityItemsCommonClassName}`}>
        <span className="overflow-hidden-ellipsis">{stock.name}</span>
        <span className="text-sm text-info">需要輪替</span>
      </li>
    )),
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-card p-4 rounded-sm">
        <p className="text-md flex gap-2 items-center mb-4">
          <span>優先處理</span>
          <Zap strokeWidth={1.5} size={18}/>
        </p>
        <ul className={`grid grid-cols-${showCount} gap-2`}>
          {priorityItems.slice(0, showCount)}
        </ul>
      </div>
      <div className="bg-card p-4 rounded-sm">
        <p className="text-md flex gap-2 items-center mb-4">
          <span>需要補充資料</span>
          <ClipboardPen strokeWidth={1.5} size={18}/>
        </p>
        <ul className={`grid grid-cols-${showCount} gap-2`}>
          {missingInfoStock.slice(0, showCount).map((item) => (
            <li key={item.stock.id} className={`${priorityItemsCommonClassName}`}>
              <span className="overflow-hidden-ellipsis">{item.stock.name}</span>
              <span className="text-sm overflow-hidden-ellipsis">{item.missingFields.map((field) => stockFieldLabel[field]).join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}