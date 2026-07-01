import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Stock } from "@/interfaces/stock";
import { sampleStockData } from "@/constant/sampleData";

const checkStockIsEmpty = (obj: Stock) => Object.values(obj).every(value => !value)

export type StockListContextType = {
  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;
  deleteStock: Stock | null;
  setDeleteStock: (stock: Stock | null) => void;
  editStock: Stock | null;
  setEditStock: (stock: Stock | null) => void;
  stockList: Stock[];
  showStockList: String[];
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updatedStock: Stock) => void;
  searchStock: (searchStock: Stock) => void;
  startFromClearingData: () => void;
  startFromDemoData: () => void;
};

export const StockListContext = createContext<StockListContextType>({
  isDemo: false,
  setIsDemo: () => {},
  deleteStock: null,
  setDeleteStock: () => {},
  editStock: null,
  setEditStock: () => {},
  stockList: [],
  showStockList: [],
  addStock: () => {},
  removeStock: () => {},
  updateStock: () => {},
  searchStock: () => {},
  startFromClearingData: () => {},
  startFromDemoData: () => {},
})

export function StockListProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [deleteStock, setDeleteStock] = useState<Stock | null>(null);
  const [editStock, setEditStock] = useState<Stock | null>(null);
  const [stockList, setStockList] = useState<Stock[]>([]);
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

  // start from clearing data
  const startFromClearingData = () => {
    setStockList([]);
    setIsDemo(false);
  }

  // start from using demo data
  const startFromDemoData = () => {
    setIsDemo(false);
    setStockList(sampleStockData);
  }

  // demo init
  useEffect(() => {
    if(isDemo) {
      setStockList(sampleStockData);
    }
  }, [isDemo]);

  // init
  useEffect(() => {
    if(isDemo) {
      return;
    }
    const localStorageStockList = localStorage.getItem("stockList");
    if (localStorageStockList) {
      setStockList(JSON.parse(localStorageStockList));
    }
  }, []);

  // save data
  useEffect(() => {    
    if (!isDemo && stockList.length > 0) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList, isDemo]);

  // search
  useEffect(() => {
    if (!searchParams) return;
    
    setShowStockList(stockList.filter((item) => {
      if (checkStockIsEmpty(searchParams)) return true;     

      return (searchParams.name ? item.name.includes(searchParams.name) : true) &&
      (searchParams.type && searchParams.type !== "all" ? item.type === searchParams.type : true) &&
      (searchParams.unit && searchParams.unit !== "all" ? item.unit === searchParams.unit : true) &&
      (searchParams.count && item.count ? Number(item.count) <= Number(searchParams.count) : true) &&
      (searchParams.expirationDate && item.expirationDate ? new Date(item.expirationDate) <= new Date(searchParams.expirationDate) : true) &&
      (searchParams.purchaseDate && item.purchaseDate ? new Date(item.purchaseDate) <= new Date(searchParams.purchaseDate) : true) 
    }).map(item => item.id));
  }, [stockList, searchParams]);

  return (
    <StockListContext.Provider value={{ isDemo, setIsDemo, deleteStock, setDeleteStock, stockList, showStockList, addStock, removeStock, updateStock, searchStock, editStock, setEditStock, startFromDemoData, startFromClearingData }}>
      {children}
    </StockListContext.Provider>
  );
}
