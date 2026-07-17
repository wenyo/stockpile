import { stockType, stockItemUnit, stockUnit } from "@/constant/stock";

export interface Stock {
  id: string;
  name: string;
  type: keyof typeof stockType;
  count: number | undefined;
  unit: keyof typeof stockItemUnit;
  expirationDate?: string;
  purchaseDate?: string;
  remark?: string;
  totalCalories: number | undefined;
  volume: number | undefined;
  volumeUnit?: keyof typeof stockUnit;
  feedTagId?: string; // 只有 type 為 petFood/babyFood/babyMilk 時才會用到
}

export const initialStock: Stock = {
  id: '',
  name: '',
  type: '' as keyof typeof stockType,
  count: undefined,
  unit: '' as keyof typeof stockItemUnit,
  expirationDate: '',
  purchaseDate: '',
  remark: '',
  totalCalories: undefined,
  volume: undefined,
  volumeUnit: undefined,
  feedTagId: undefined,
};

type StockField = keyof Stock;
type StockTypeField = keyof typeof stockType;

export const REQUIRED_FIELDS: Record<StockTypeField, StockField[]> = {
  food: [
    "name",
    "count",
    "totalCalories",
    "expirationDate",
  ],
  infantStapleFood: [
    "name",
    "count",
    "expirationDate",
    "unit",
    "volume",
    "volumeUnit",
    "feedTagId",
  ],
  infantNonStapleFood: [
    "name",
    "count",
    "expirationDate",
  ],
  petStapleFood: [
    "name",
    "count",
    "unit",
    "volume",
    "volumeUnit",
    "expirationDate",
    "feedTagId",
  ],
  petNonStapleFood: [
    "name",
    "count",
    "expirationDate",
  ],
  water: [
    "name",
    "count",
    "volume",
  ],
  medical: [
    "name",
    "count",
    "expirationDate",
  ],
  tool: [
    "name",
    "count",
  ],
  light: [
    "name",
    "count",
  ],
  communication: [
    "name",
    "count",
  ],
  other: [
    "name",
    "count",
  ],
};

export type MissingInfoItem = {
  stock: Stock;
  missingFields: StockField[];
};

export type StockStatus = {
  isExpired: boolean;
  isExpiringSoon: boolean;
  isLowStock: boolean;
};

export type FeedTag = {
  id: string;
  label: string; // 使用者自訂，如「乾糧」「罐頭」「凍乾乳鼠」
  appliesToStockType: "infantStapleFood" | "petStapleFood"; // 這個 tag 屬於哪個 stockType 底下
};

export type FeedPortion = {
  feedTagId: string;
  amount: number;
  unit: "g" | "ml" | "unit"; // 克 / 毫升 / 份或隻
  waterAmount?: number; // 單次搭配水量 ml (主要給嬰兒泡奶用)
  frequencyType: "timesPerDay" | "daysPerTime"; // 一天幾次 / 幾天一次
  frequencyValue: number; // 頻率數值
};
