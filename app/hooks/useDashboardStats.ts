import { useContext, useMemo } from "react";
import { REQUIRED_FIELDS, type MissingInfoItem } from "@/interfaces/stock";
import { stockType, notRequiredType } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";

export function useDashboardStats() {
  const { stockList } = useContext(StockListContext);
  const { household, setting, feedTags } = useContext(SettingContext);
  
  const currentSetting = setting || { targetDays: 30, rotationDays: 90 };

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
    return household.reduce((acc, member) => {
      return acc + (member.dailyKcalNeed || 0);
    }, 0) * currentSetting.targetDays;
  }, [household, currentSetting.targetDays]);

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
    let dailyRequirement = 0;
    for (const member of household) {
      dailyRequirement += member.dailyMlWater || 0;
      if (member.feedPortions) {
        member.feedPortions.forEach((portion) => {
          if (portion.waterAmount) {
            const freqValue = portion.frequencyValue || 1;
            const dailyWater = portion.frequencyType === "timesPerDay"
              ? portion.waterAmount * freqValue
              : portion.waterAmount / freqValue;
            dailyRequirement += dailyWater;
          }
        });
      }
    }
    return dailyRequirement === 0 ? 0 : Math.floor(dailyRequirement * currentSetting.targetDays);
  }, [household, currentSetting.targetDays]);

  // 剩餘飲水量
  const remainingWater = useMemo(() => {
    return targetWater - currentWater < 0 ? 0 : targetWater - currentWater;
  }, [targetWater, currentWater]);

  // 生存天數
  const survivalFoodDays = useMemo(() => {
    let dailyRequirement = 0;
    for (const member of household) {
      dailyRequirement += member.dailyKcalNeed || 0;
    }
    return dailyRequirement === 0 ? 0 : Math.floor(currentCalories / dailyRequirement);
  }, [currentCalories, household]);

  // 缺口天數
  const foodGapDays = useMemo(() => {
    return currentSetting.targetDays - survivalFoodDays < 0 ? 0 : currentSetting.targetDays - survivalFoodDays;
  }, [currentSetting.targetDays, survivalFoodDays]);

  // 飲水天數
  const survivalWaterDays = useMemo(() => {
    let dailyRequirement = 0;
    for (const member of household) {
      dailyRequirement += member.dailyMlWater || 0;
      if (member.feedPortions) {
        member.feedPortions.forEach((portion) => {
          if (portion.waterAmount) {
            const freqValue = portion.frequencyValue || 1;
            const dailyWater = portion.frequencyType === "timesPerDay"
              ? portion.waterAmount * freqValue
              : portion.waterAmount / freqValue;
            dailyRequirement += dailyWater;
          }
        });
      }
    }
    return dailyRequirement === 0 ? 0 : Math.floor(currentWater / dailyRequirement);
  }, [currentWater, household]);

  // 飲水缺口天數
  const gapWaterDays = useMemo(() => {
    return currentSetting.targetDays - survivalWaterDays < 0 ? 0 : currentSetting.targetDays - survivalWaterDays;
  }, [currentSetting.targetDays, survivalWaterDays]);

  // 在輪替天數內的物資
  const withinRotationDaysStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= currentSetting.rotationDays && days > currentSetting.targetDays;
    });
  }, [stockList, currentSetting.rotationDays, currentSetting.targetDays]);

  // 即將到期物資
  const expiringSoonStock = useMemo(() => {
    return stockList.filter((stock) => {
      if (!stock.expirationDate) return false;
      const today = new Date();
      const expirationDate = new Date(stock.expirationDate);
      const days = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= currentSetting.targetDays && days > 0;
    });
  }, [stockList, currentSetting.targetDays]);

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

  // Feed Tag 統計計算
  const feedTagStats = useMemo(() => {
    const stats: Record<string, { dailyNeed: number, stockTotal: number, days: number, label: string, appliesToStockType?: string }> = {};
    
    // 1. 計算每個 Tag 的每日需求總量
    household.forEach(member => {
      if (member.feedPortions) {
        member.feedPortions.forEach(portion => {
          if (!portion.feedTagId) return;
          if (!stats[portion.feedTagId]) {
            const tag = feedTags.find(t => t.id === portion.feedTagId);
            stats[portion.feedTagId] = { dailyNeed: 0, stockTotal: 0, days: 0, label: tag?.label || '未知標籤', appliesToStockType: tag?.appliesToStockType };
          }
          const freqValue = portion.frequencyValue || 1;
          const dailyAmount = portion.frequencyType === "timesPerDay" 
            ? portion.amount * freqValue 
            : portion.amount / freqValue;
          stats[portion.feedTagId].dailyNeed += dailyAmount;
        });
      }
    });

    // 2. 累加對應的庫存總量
    stockList.forEach(stock => {
      if (stock.feedTagId && stats[stock.feedTagId] && (stock.type === "infantStapleFood" || stock.type === "petStapleFood")) {
        const count = Number(stock.count) || 0;
        // 若沒有 volume 則預設為 1 (避免乘 0)，實際上新增表單已有必填要求
        const vol = Number(stock.volume) || 1;
        stats[stock.feedTagId].stockTotal += (count * vol);
      }
    });

    // 3. 計算可支撐天數
    Object.keys(stats).forEach(tagId => {
      const s = stats[tagId];
      s.days = s.dailyNeed > 0 ? Math.floor(s.stockTotal / s.dailyNeed) : 0;
    });

    return stats;
  }, [household, stockList, feedTags]);

  // 嬰兒與寵物成員個別的瓶頸天數
  const specialMemberStatus = useMemo(() => {
    let infantDays = Infinity;
    let petDays = Infinity;
    let infantBottleneck = '';
    let petBottleneck = '';
    let hasInfant = false;
    let hasPet = false;

    household.forEach(member => {
      if (member.identity === 'infant') {
        hasInfant = true;
        if (member.feedPortions && member.feedPortions.length > 0) {
          member.feedPortions.forEach(portion => {
            if (portion.feedTagId && feedTagStats[portion.feedTagId]) {
              const { days, label } = feedTagStats[portion.feedTagId];
              if (days < infantDays) {
                infantDays = days;
                infantBottleneck = label;
              }
            }
          });
        }
      } else if (member.identity === 'pet') {
        hasPet = true;
        if (member.feedPortions && member.feedPortions.length > 0) {
          member.feedPortions.forEach(portion => {
            if (portion.feedTagId && feedTagStats[portion.feedTagId]) {
              const { days, label } = feedTagStats[portion.feedTagId];
              if (days < petDays) {
                petDays = days;
                petBottleneck = label;
              }
            }
          });
        }
      }
    });

    // 如果都有設定，但找不到天數的情境防呆
    if (infantDays === Infinity) infantDays = 0;
    if (petDays === Infinity) petDays = 0;

    return {
      infant: hasInfant ? { days: infantDays, bottleneck: infantBottleneck || '未設定主食' } : null,
      pet: hasPet ? { days: petDays, bottleneck: petBottleneck || '未設定主食' } : null,
    };
  }, [household, feedTagStats]);

  // 缺乏的物資種類
  const missingTypeStock = useMemo(() => {
    let allTypes = Object.keys(stockType);
    
    if (!specialMemberStatus.infant) {
      allTypes = allTypes.filter(type => type !== 'infantStapleFood');
    }
    if (!specialMemberStatus.pet) {
      allTypes = allTypes.filter(type => type !== 'petStapleFood');
    }
    
    const existingTypes = stockList.map((stock) => stock.type as string);
    return allTypes.filter((type) => !notRequiredType.includes(type) && !existingTypes.includes(type));
  }, [stockList, specialMemberStatus]);

    // 生存天數
  const survivalDays = useMemo(() => {
    const days = [survivalFoodDays, survivalWaterDays];
    if (specialMemberStatus.infant) days.push(specialMemberStatus.infant.days);
    if (specialMemberStatus.pet) days.push(specialMemberStatus.pet.days);
    return Math.min(...days);
  }, [survivalFoodDays, survivalWaterDays, specialMemberStatus]);

  const progressPercent = useMemo(() => {
    return Math.round(Math.min(100, (survivalDays / currentSetting.targetDays) * 100));
  }, [survivalDays, currentSetting.targetDays]);

  return {
    household,
    setting,
    progressPercent,
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
    missingTypeStock,
    feedTagStats,
    specialMemberStatus,
  };
}
