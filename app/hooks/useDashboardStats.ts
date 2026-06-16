import { useContext, useMemo } from "react";
import { REQUIRED_FIELDS, type MissingInfoItem } from "@/interfaces/stock";
import { StockListContext } from "@/store/stockList";
import { DashboardContext } from "@/store/dashboard";

export function useDashboardStats() {
  const { stockList } = useContext(StockListContext);
  const { config } = useContext(DashboardContext);

  // 總熱量 (根據每一項庫存數與熱量)
  const totalCalories = useMemo(() => {
    return stockList.reduce((acc, stock) => {
       const count = Number(stock.count) || 0;
       const cals = Number(stock.totalCalories) || 0;
       return acc + (count * cals);
    }, 0);
  }, [stockList]);

  // 生存天數
  const survivalDays = useMemo(() => {
    const dailyRequirement = config.people * config.onePersonOneDayCalories;
    return dailyRequirement === 0 ? 0 : Math.floor(totalCalories / dailyRequirement);
  }, [totalCalories, config]);

  // 即將到期物資
  const expiringSoonStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= 30;
    });
  }, [stockList]);

  // 缺少資訊物資
  const missingInfoStock: MissingInfoItem[] = useMemo(() => {
    let result:MissingInfoItem[] = []
    stockList.forEach((stock) => {
      const requiredFields = REQUIRED_FIELDS[stock.type];
      const missingFields = requiredFields.filter(field => !stock[field]);
      if (missingFields.length > 0) {
        result.push({ stock, missingFields });
      }
    })
    return result;
  }, [stockList]);

  // 最近新增的三項物資
  const recentStock = useMemo(() => {
    return stockList.slice(0, 3);
  }, [stockList]);

  return {
    config,                  // 讓儀表板元件也能讀到目前的目標設定（如：目標 30 天）
    totalCalories,
    survivalDays,
    expiringSoonStock,
    missingInfoStock,
    recentStock,
    stockCount: stockList.length
  };
}
