import { Pie, PieChart, Tooltip, Legend, type TooltipIndex } from 'recharts';
import { useContext, useState, useEffect } from 'react';
import { StockListContext } from '@/store/stockList';
import { stockType } from '@/constant/stock';

type SummaryItem = { name: string; value: number; fill?: string };

// 提供一組簡單的色系讓不同類別呈現不同顏色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF2', '#F28C8C'];

export default function TwoLevelPieChart({
  isAnimationActive,
  defaultIndex,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
  const { stockList } = useContext(StockListContext);
  const [stockTypeSummary, setStockTypeSummary] = useState<SummaryItem[]>([]);

  useEffect(() => {
    const summary = stockList.reduce<SummaryItem[]>((acc, stock) => {
      const typeKey = stock.type || 'other';
      const localizedName = stockType[typeKey] || typeKey;
      
      const existingType = acc.find((item) => item.name === localizedName);
      const count = Number(stock.count) || 0;
      
      if (existingType) {
        existingType.value += count;
      } else {
        acc.push({ name: localizedName, value: count });
      }
      return acc;
    }, []);
    
    const summaryWithFill = summary.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));

    setStockTypeSummary(summaryWithFill);
  }, [stockList]);

  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col">
      <p className="text-(--card-foreground) text-md">物資分類分布</p>
      <PieChart
        style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
        responsive
      >
        <Pie
          data={stockTypeSummary}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="50%"
          isAnimationActive={isAnimationActive}
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        />
        <Tooltip defaultIndex={defaultIndex} />
        <Legend />
      </PieChart>
    </div>
  );
}