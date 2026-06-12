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