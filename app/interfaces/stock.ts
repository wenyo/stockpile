import { stockType, stockUnit } from "@/constant/stock";

export interface Stock {
  id: string;
  name: string;
  type: keyof typeof stockType;
  count: number | undefined;
  unit: keyof typeof stockUnit;
  expirationDate?: string;
  purchaseDate?: string;
  remark?: string;
  totalCalories: number | undefined;
  volume: number | undefined;
}

export const initialStock: Stock = {
  id: '',
  name: '',
  type: '' as keyof typeof stockType,
  count: undefined,
  unit: '' as keyof typeof stockUnit,
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
  babyMilk: [
    "name",
    "count",
    "expirationDate",
  ],
  petFood: [
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