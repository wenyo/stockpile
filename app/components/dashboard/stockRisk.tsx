import { Droplet, Soup } from 'lucide-react';
import { stockType } from "@/constant/stock";
import { useDashboardStats } from '@/hooks/useDashboardStats';


export default function StockRisk() {
  const { foodGapDays, gapWaterDays, missingTypeStock } = useDashboardStats();
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col">
        <p>資源瓶頸分析</p>
        <div className='mt-4'>
          <p className='flex items-center'><Droplet strokeWidth={1.5} size={18}/>水: {gapWaterDays}天</p>
          <p className='flex items-center'><Soup strokeWidth={1.5} size={18}/>食物: {foodGapDays}天</p>
          <p>目前限制生存天數的主因：{gapWaterDays > foodGapDays ? '水' : '食物'} 不足</p>
        </div>
      </div>
      <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col">
        <p>風險提醒</p>
        <div className='mt-4'>
          {missingTypeStock.map((type) => (
            <p key={type}>缺少{stockType[type]}</p>
          ))}
        </div>
      </div>
    </div>
  )
}