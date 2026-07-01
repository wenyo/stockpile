import { stockType } from "@/constant/stock";

export interface Stock {
  id: string;
  name: string;
  type: string;
  count: number | undefined;
  unit: string;
  expirationDate?: string;
  purchaseDate?: string;
  remark?: string;
  totalCalories: number | undefined;
  volume: number | undefined;
}

export const initialStock: Stock = {
  id: '',
  name: '',
  type: '',
  count: undefined,
  unit: '',
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