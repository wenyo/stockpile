import { useContext, useMemo } from "react";
import { REQUIRED_FIELDS, type MissingInfoItem } from "@/interfaces/stock";
import { stockType } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { DashboardContext } from "@/store/dashboard";

export function useDashboardStats() {
  const { stockList } = useContext(StockListContext);
  const { config } = useContext(DashboardContext);

  // 總熱量 (根據每一項庫存數與熱量)
  const currentCalories = useMemo(() => {
    return stockList.reduce((acc, stock) => {
       const count = Number(stock.count) || 0;
       const cals = Number(stock.totalCalories) || 0;
       return acc + (count * cals);
    }, 0);
  }, [stockList]);

  // 目標熱量
  const targetCalories = useMemo(() => {
    return config.people * config.targetDays * config.onePersonOneDayCalories;
  }, [config]);

  // 剩餘熱量
  const remainingCalories = useMemo(() => {
    return targetCalories - currentCalories < 0 ? 0 : targetCalories - currentCalories;
  }, [targetCalories, currentCalories]);

  // 目前飲水量
  const currentWater = useMemo(() => {
    return stockList.reduce((acc, stock) => {
      if (stock.type === "water") {
        const count = Number(stock.count) || 0;
        // 如果使用者舊資料是選擇 ml 當作單位，且未填寫 volume，則將其視為 1ml / 件的基礎單位
        const fallbackVolume = stock.unit === "ml" ? 1 : 0;
        const vol = Number(stock.volume) || fallbackVolume;
        return acc + (count * vol);
      }
      return acc;
    }, 0);
  }, [stockList]);

  // 目標飲水量
  const targetWater = useMemo(() => {
    return config.people * config.targetDays * config.waterMlPerPersonPerDay;
  }, [config]);

  // 剩餘飲水量
  const remainingWater = useMemo(() => {
    return targetWater - currentWater < 0 ? 0 : targetWater - currentWater;
  }, [targetWater, currentWater]);

  // 生存天數
  const survivalFoodDays = useMemo(() => {
    const dailyRequirement = config.people * config.onePersonOneDayCalories;
    return dailyRequirement === 0 ? 0 : Math.floor(currentCalories / dailyRequirement);
  }, [currentCalories, config]);

  // 缺口天數
  const foodGapDays = useMemo(() => {
    return config.targetDays - survivalFoodDays < 0 ? 0 : config.targetDays - survivalFoodDays;
  }, [config, survivalFoodDays]);

  // 飲水天數
  const survivalWaterDays = useMemo(() => {
    const dailyRequirement = config.people * config.waterMlPerPersonPerDay;
    return dailyRequirement === 0 ? 0 : Math.floor(currentWater / dailyRequirement);
  }, [currentWater, config]);

  // 飲水缺口天數
  const gapWaterDays = useMemo(() => {
    return config.targetDays - survivalWaterDays < 0 ? 0 : config.targetDays - survivalWaterDays;
  }, [config, survivalWaterDays]);

  // 生存天數
  const survivalDays = useMemo(() => {
    return Math.min(survivalFoodDays, survivalWaterDays);
  }, [survivalFoodDays, survivalWaterDays]);

  // 在輪替天數內的物資
  const withinRotationDaysStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= config.rotationDays && days > config.targetDays;
    });
  }, [stockList]);

  // 即將到期物資
  const expiringSoonStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= config.targetDays && days > 0;
    });
  }, [stockList]);

  // 已過期物資
  const expiredStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days < 0;
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

  // 缺乏的物資種類
  const missingTypeStock = useMemo(() => {
    const allTypes = Object.keys(stockType);
    const existingTypes = stockList.map((stock) => stock.type);
    return allTypes.filter((type) => !existingTypes.includes(type) && type !== 'other');
  }, [stockList]);

  return {
    config,
    // kcal
    currentCalories,
    targetCalories,
    remainingCalories,
    // day
    survivalDays,
    survivalFoodDays,
    foodGapDays,
    survivalWaterDays,
    gapWaterDays,
    // water
    currentWater,
    targetWater,
    remainingWater,
    // stock
    withinRotationDaysStock,
    expiringSoonStock,
    expiredStock,
    missingInfoStock,
    stockCount: stockList.length,
    missingTypeStock
  };
}
