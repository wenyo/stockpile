import { useContext, useMemo } from "react";
import { StockListContext } from "@/store/stockList";
import { DashboardContext } from "@/store/dashboard";
import { REQUIRED_FIELDS } from "@/interfaces/stock";

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

  const expiredStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    });
  }, [stockList]);

  const missingInfoStock = useMemo(() => {
    return stockList.filter((stock) => {
      const requiredFields = REQUIRED_FIELDS[stock.type];
      return requiredFields && requiredFields.some(requiredField => !stock[requiredField])
    })
  }, [stockList]);

  return {
    config,                  // 讓儀表板元件也能讀到目前的目標設定（如：目標 30 天）
    totalCalories,
    survivalDays,
    expiredStock,
    missingInfoStock,
    stockCount: stockList.length
  };
}
