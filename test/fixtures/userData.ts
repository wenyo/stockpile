import type { HouseholdMember } from "@/interfaces/family";
import type { Stock, Tag } from "@/interfaces/stock";
import type { SettingConfig } from "@/store/setting";

// 使用者真實資料的最小假資料

export const userHousehold: HouseholdMember[] = [
  {
    id: "user_member_1",
    identity: "adult",
    name: "測試爸爸",
    dailyKcalNeed: 2000,
    dailyMlWater: 2000,
  },
];

export const userStockTags: Tag[] = [
  {
    id: "user_tag_1",
    label: "測試乾糧",
    appliesToStockType: "petStapleFood",
    unit: "g",
  },
];

export const userStockList: Stock[] = [
  {
    id: "user_stock_1",
    name: "測試罐頭",
    type: "food",
    count: 3,
    unit: "can",
    expirationDate: "2030-12-31",
    purchaseDate: "",
    remark: "",
    volume: 0,
    totalCalories: 500,
  },
];

export const userSetting: SettingConfig = {
  targetDays: 45,
  rotationDays: 120,
};
