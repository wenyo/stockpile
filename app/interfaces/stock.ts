import { stockType, stockItemUnit } from "@/constant/stock";

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
    "expirationDate",
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

type FeedTag = {
  id: string;
  label: string; // 使用者自訂，如「乾糧」「罐頭」「凍乾乳鼠」
  appliesToStockType: "petFood" | "babyFood" | "babyMilk"; // 這個 tag 屬於哪個 stockType 底下
};

type FeedPortion = {
  feedTagId: string;
  amount: number;
  unit: "g" | "ml" | "unit"; // 克 / 毫升 / 份或隻
  frequencyDays: number; // 每幾天餵食一次，預設 1（天天）
};

type HouseholdMember = {
  id: string;
  identity: "adult" | "child" | "elderly" | "infant" | "pet";
  label?: string; // 使用者自訂名稱，如「大寶」「Momo」
  dailyNeed?: number; // 成人/兒童/長者用，選填，不填用系統預設值
  dailyMilkNeed?: number; // 嬰兒奶量，必填，家長自行輸入，不做估算
  feedPortions?: FeedPortion[]; // 嬰兒（副食品可另計）/寵物的飲食組成，支援多品項混食
};