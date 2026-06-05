import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Stock } from "../interfaces/stock";

const defaultStockList: Stock[] = [
    {
        "id": "1",
        "name": "name1",
        "type": "food",
        "count": "0",
        "unit": "pack",
        "expirationDate": "2026-12-31",
        "purchaseDate": "2026-06-05",
        "remark": "",
        "totalCalories": null
    }
]

export type StockListContextType = {
  stockList: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updatedStock: Stock) => void;
};

export const StockListContext = createContext<StockListContextType>({
  stockList: [],
  addStock: () => {},
  removeStock: () => {},
  updateStock: () => {},
})

export function StockListProvider({ children }: { children: ReactNode }) {
  const [stockList, setStockList] = useState<Stock[]>(defaultStockList);
  const [isClient, setIsClient] = useState(false);

  // init
  useEffect(() => {
    const localStorageStockList = localStorage.getItem("stockList");
    if (localStorageStockList) {
      setStockList(JSON.parse(localStorageStockList));
    }
    setIsClient(true);
  }, []);

  // save
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList, isClient]);

  const addStock = (stock: Stock) => {
    setStockList((prev) => [...prev, stock]);
  };

  const removeStock = (id: string) => {
    setStockList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStock = (id: string, updatedStock: Stock) => {
    setStockList((prev) =>
      prev.map((item) => (item.id === id ? updatedStock : item))
    );
  };

  return (
    <StockListContext.Provider value={{ stockList, addStock, removeStock, updateStock }}>
      {children}
    </StockListContext.Provider>
  );
}
