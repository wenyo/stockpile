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
};

export const REQUIRED_FIELDS: Record<string, (keyof Stock)[]> = {
  [stockType.food]: [
    "name",
    "count",
    "totalCalories",
    "expirationDate",
  ],
  [stockType.water]: [
    "name",
    "count",
  ],
  [stockType.medical]: [
    "name",
    "count",
    "expirationDate",
  ],
  [stockType.tool]: [
    "name",
    "count",
  ],
  [stockType.other]: [
    "name",
    "count",
  ],
};