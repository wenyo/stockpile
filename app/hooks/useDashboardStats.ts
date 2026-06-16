import { useContext, useMemo } from "react";
import { StockListContext } from "@/store/stockList";
import { DashboardContext } from "@/store/dashboard";

export function useDashboardStats() {
  const { stockList } = useContext(StockListContext);
  const { config } = useContext(DashboardContext);

  // 1. 計算總熱量 (根據每一項庫存數與熱量)
  const totalCalories = useMemo(() => {
    return stockList.reduce((acc, stock) => {
       const count = Number(stock.count) || 0;
       const cals = Number(stock.totalCalories) || 0;
       return acc + (count * cals);
    }, 0);
  }, [stockList]);

  // 2. 計算生存天數
  const survivalDays = useMemo(() => {
    const dailyRequirement = config.people * config.onePersonOneDayCalories;
    return dailyRequirement === 0 ? 0 : Math.floor(totalCalories / dailyRequirement);
  }, [totalCalories, config]);

  // 你甚至可以在這計算過期數量、即將過期項目等...

  return {
    config,                  // 讓儀表板元件也能讀到目前的目標設定（如：目標 30 天）
    totalCalories,
    survivalDays,
    stockCount: stockList.length
  };
}
