export interface Stock {
  id: string;
  name: string;
  type: string;
  count: string;
  unit: string;
  expirationDate?: string;
  purchaseDate?: string;
  remark?: string;
  totalCalories: string | null;
}

export const initialStock: Stock = {
  id: '',
  name: '',
  type: '',
  count: '',
  unit: '',
  expirationDate: '',
  purchaseDate: '',
  remark: '',
  totalCalories: null,
};