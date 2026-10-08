import { useContext, useMemo } from "react";
import { REQUIRED_FIELDS, type MissingInfoItem, frequencyType, type FeedPortion, type MedicineNeed } from "@/interfaces/stock";
import { stockType, notRequiredType, tagAllowedType } from "@/constant/stock";
import { StockListContext } from "@/store/stockList";
import { SettingContext } from "@/store/setting";

export type TagStats = {
  dailyNeed: number;
  stockTotal: number;
  days: number;
  label: string;
  appliesToStockType?: string;
};

export type CategoryTagSummary = {
  hasRequirement: boolean;
  days: number;
  bottleneck: string;
  tags: Record<string, TagStats>;
};

export type SpecialNeedsStatus = {
  infant: CategoryTagSummary | null;
  pet: CategoryTagSummary | null;
  medicine: CategoryTagSummary | null;
};

export function useDashboardStats() {
  const { stockList } = useContext(StockListContext);
  const { household, setting, stockTags } = useContext(SettingContext);
  
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
            const dailyWater = portion.frequencyType === frequencyType.TIMES_PER_DAY
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
            const dailyWater = portion.frequencyType === frequencyType.TIMES_PER_DAY
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

  // 計算個別分類標籤統計與瓶頸
  const computeCategorySummary = (params: {
    category: "infant" | "pet" | "medicine";
    stockTypeTarget: "infantStapleFood" | "petStapleFood" | "medicine";
    idName: "feedTagId" | "medicineTagId";
    fallbackBottleneck: string;
  }): CategoryTagSummary | null => {
    const { category, stockTypeTarget, idName, fallbackBottleneck } = params;

    let hasRequirement = false;
    if (category === "infant") {
      hasRequirement = household.some((m) => m.identity === "infant");
    } else if (category === "pet") {
      hasRequirement = household.some((m) => m.identity === "pet");
    } else if (category === "medicine") {
      hasRequirement = household.some((m) => m.medicineNeeds && m.medicineNeeds.some((n) => !!n.medicineTagId));
    }

    if (!hasRequirement) {
      return null;
    }

    const tags: Record<string, TagStats> = {};

    // 1. 累加需求量
    household.forEach((member) => {
      if (category === "infant" && member.identity !== "infant") return;
      if (category === "pet" && member.identity !== "pet") return;

      const portions = (category === "medicine" ? member.medicineNeeds : member.feedPortions) || [];
      (portions as any[]).forEach((portion) => {
        const idValue = portion[idName] as string;
        if (!idValue) return;

        if (!tags[idValue]) {
          const tag = stockTags.find((t) => t.id === idValue);
          tags[idValue] = {
            dailyNeed: 0,
            stockTotal: 0,
            days: 0,
            label: tag?.label || "未知標籤",
            appliesToStockType: tag?.appliesToStockType,
          };
        }

        const freqValue = portion.frequencyValue || 1;
        const dailyAmount =
          portion.frequencyType === frequencyType.TIMES_PER_DAY
            ? portion.amount * freqValue
            : portion.amount / freqValue;
        tags[idValue].dailyNeed += dailyAmount;
      });
    });

    // 2. 累加庫存量
    stockList.forEach((stock) => {
      const tagId = stock[idName];
      if (stock.type === stockTypeTarget && tagId && tags[tagId]) {
        const count = stock.type === "medicine"
          ? (stock.count !== undefined && stock.count !== null ? Number(stock.count) : 1)
          : (Number(stock.count) || 0);
        const vol = Number(stock.volume) || 1;
        tags[tagId].stockTotal += count * vol;
      }
    });

    // 3. 計算各標籤天數與瓶頸
    const tagEntries = Object.values(tags);
    let categoryDays = Infinity;
    let bottleneckLabel = "";

    if (tagEntries.length === 0) {
      categoryDays = 0;
      bottleneckLabel = fallbackBottleneck;
    } else {
      tagEntries.forEach((s) => {
        s.days = s.dailyNeed > 0 ? Math.floor(s.stockTotal / s.dailyNeed) : 0;
        if (s.days < categoryDays) {
          categoryDays = s.days;
          bottleneckLabel = s.label;
        }
      });
    }

    if (categoryDays === Infinity) categoryDays = 0;

    return {
      hasRequirement: true,
      days: categoryDays,
      bottleneck: bottleneckLabel || fallbackBottleneck,
      tags,
    };
  };

  // 三大特殊需求狀態：嬰兒主食、寵物主食、必要用藥
  const specialNeedsStatus = useMemo<SpecialNeedsStatus>(() => {
    return {
      infant: computeCategorySummary({
        category: "infant",
        stockTypeTarget: "infantStapleFood",
        idName: "feedTagId",
        fallbackBottleneck: "未設定主食",
      }),
      pet: computeCategorySummary({
        category: "pet",
        stockTypeTarget: "petStapleFood",
        idName: "feedTagId",
        fallbackBottleneck: "未設定主食",
      }),
      medicine: computeCategorySummary({
        category: "medicine",
        stockTypeTarget: "medicine",
        idName: "medicineTagId",
        fallbackBottleneck: "未設定藥品",
      }),
    };
  }, [household, stockList, stockTags]);

  // 各自獨立的 Tag 統計
  const infantTagStats = useMemo(() => specialNeedsStatus.infant?.tags || {}, [specialNeedsStatus]);
  const petTagStats = useMemo(() => specialNeedsStatus.pet?.tags || {}, [specialNeedsStatus]);
  const medicineTagStats = useMemo(() => specialNeedsStatus.medicine?.tags || {}, [specialNeedsStatus]);

  // 向後相容：合併嬰兒與寵物 tag 的 feedTagStats
  const feedTagStats = useMemo(() => {
    return { ...infantTagStats, ...petTagStats };
  }, [infantTagStats, petTagStats]);

  // 缺乏的物資種類
  const missingTypeStock = useMemo(() => {
    let allTypes = Object.keys(stockType) as Array<keyof typeof stockType>;
    
    if (!specialNeedsStatus.infant) {
      allTypes = allTypes.filter(type => type !== 'infantStapleFood');
    }
    if (!specialNeedsStatus.pet) {
      allTypes = allTypes.filter(type => type !== 'petStapleFood');
    }
    if (!specialNeedsStatus.medicine) {
      allTypes = allTypes.filter(type => type !== 'medicine');
    }
    
    const existingTypes = stockList.map((stock) => stock.type as string);
    return allTypes.filter((type) => !notRequiredType.includes(type) && !existingTypes.includes(type));
  }, [stockList, specialNeedsStatus]);

  // 生存天數 (五大維度共同取最小值)
  const survivalDays = useMemo(() => {
    const days = [survivalFoodDays, survivalWaterDays];
    if (specialNeedsStatus.infant) days.push(specialNeedsStatus.infant.days);
    if (specialNeedsStatus.pet) days.push(specialNeedsStatus.pet.days);
    if (specialNeedsStatus.medicine) days.push(specialNeedsStatus.medicine.days);
    return Math.min(...days);
  }, [survivalFoodDays, survivalWaterDays, specialNeedsStatus]);

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
    // special needs status
    specialNeedsStatus,
    infantTagStats,
    petTagStats,
    medicineTagStats,
    // backward compatibility
    feedTagStats,
  };
}
