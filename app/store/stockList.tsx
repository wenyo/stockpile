import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Stock } from "@/interfaces/stock";

const defaultStockList: Stock[] = [
    {
        "id": "1",
        "name": "name1",
        "type": "food",
        "count": 10,
        "unit": "pack",
        "expirationDate": "2026-12-31",
        "purchaseDate": "2026-06-05",
        "remark": "",
        "totalCalories": 100,
    }
]

const checkStockIsEmpty = (obj: Stock) => Object.values(obj).every(value => !value)

export type StockListContextType = {
  stockList: Stock[];
  showStockList: String[];
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updatedStock: Stock) => void;
  searchStock: (searchStock: Stock) => void;
};

export const StockListContext = createContext<StockListContextType>({
  stockList: [],
  showStockList: [],
  addStock: () => {},
  removeStock: () => {},
  updateStock: () => {},
  searchStock: () => {},
})

export function StockListProvider({ children }: { children: ReactNode }) {
  const [stockList, setStockList] = useState<Stock[]>(defaultStockList);
  const [isClient, setIsClient] = useState(false);
  const [showStockList, setShowStockList] = useState<String[]>([]);
  const [searchParams, setSearchParams] = useState<Stock | null>(null);

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

  const searchStock = useCallback((searchStock: Stock) => {
    setSearchParams(searchStock);
  }, []);

  // init
  useEffect(() => {
    const localStorageStockList = localStorage.getItem("stockList");
    if (localStorageStockList) {
      setStockList(JSON.parse(localStorageStockList));
      console.log('init', stockList);
    }
    setIsClient(true);
  }, []);

  // save data
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList, isClient]);

  // search
  useEffect(() => {
    if (!searchParams) return;
    
    setShowStockList(stockList.filter((item) => {
      if (checkStockIsEmpty(searchParams)) return true;     

      return (searchParams.name ? item.name.includes(searchParams.name) : true) &&
      (searchParams.type ? item.type === searchParams.type : true) &&
      (searchParams.unit ? item.unit === searchParams.unit : true) &&
      (searchParams.count && item.count ? Number(item.count) <= Number(searchParams.count) : true) &&
      (searchParams.expirationDate && item.expirationDate ? new Date(item.expirationDate) <= new Date(searchParams.expirationDate) : true) &&
      (searchParams.purchaseDate && item.purchaseDate ? new Date(item.purchaseDate) <= new Date(searchParams.purchaseDate) : true) 
    }).map(item => item.id));
  }, [stockList, searchParams]);

  return (
    <StockListContext.Provider value={{ stockList, showStockList, addStock, removeStock, updateStock, searchStock }}>
      {children}
    </StockListContext.Provider>
  );
}
