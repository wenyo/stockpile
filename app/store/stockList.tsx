import { createContext, useState, useEffect, useCallback, type ReactNode, useMemo } from "react";
import type { Stock } from "@/interfaces/stock";
import { sampleStockData } from "@/constant/sampleData";

const checkStockIsEmpty = (obj: Stock) => Object.values(obj).every(value => !value)
const rtf1 = new Intl.RelativeTimeFormat("cn", { style: "short" });

export type StockListContextType = {
  relativeTime: {timeFormat: string, status: string} | null;
  updateLastInventoryConfirmedAt: () => void;
  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;
  isInitialized: boolean;
  deleteStock: Stock | null;
  setDeleteStock: (stock: Stock | null) => void;
  editStock: Stock | null;
  setEditStock: (stock: Stock | null) => void;
  stockList: Stock[];
  showStockList: string[];
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updatedStock: Stock) => void;
  searchStock: (searchStock: Stock) => void;
  startFromClearingData: () => void;
  startFromDemoData: () => void;
  hasSeenTour: boolean;
  markTourAsSeen: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  replaceStockList: (newList: Stock[]) => void;
};

export const StockListContext = createContext<StockListContextType>({
  relativeTime: {timeFormat: "", status: ""},
  updateLastInventoryConfirmedAt: () => {},
  isDemo: false,
  setIsDemo: () => {},
  isInitialized: false,
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
  hasSeenTour: false,
  markTourAsSeen: () => {},
  activeTab: "priority",
  setActiveTab: () => {},
  replaceStockList: () => {},
})

export function StockListProvider({ children }: { children: ReactNode }) {
  const [lastInventoryConfirmedAt, setLastInventoryConfirmedAt] = useState<Date | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [deleteStock, setDeleteStock] = useState<Stock | null>(null);
  const [editStock, setEditStock] = useState<Stock | null>(null);
  const [stockList, setStockList] = useState<Stock[]>([]);
  const [showStockList, setShowStockList] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<Stock | null>(null);
  const [activeTab, setActiveTab] = useState("priority");
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const updateLastInventoryConfirmedAt = () => {
    setLastInventoryConfirmedAt(new Date());
  }

  const addStock = (stock: Stock) => {
    const newStock = {...stock, updatedAt: new Date().toISOString()};
    setStockList((prev) => [...prev, newStock]);
  };

  const removeStock = (id: string) => {
    setStockList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStock = (id: string, updatedStock: Stock) => {
    const newStock = {...updatedStock, updatedAt: new Date().toISOString()};
    setStockList((prev) =>
      prev.map((item) => (item.id === id ? newStock : item))
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
    const stored = localStorage.getItem("has-seen-tour");
    if (stored === "true") {
      setHasSeenTour(true);
    }

    if(isDemo) {
      return;
    }

    const localStorageLastInventoryConfirmedAt = localStorage.getItem("lastInventoryConfirmedAt");
    if (localStorageLastInventoryConfirmedAt) {
      setLastInventoryConfirmedAt(new Date(localStorageLastInventoryConfirmedAt));
    }

    const localStorageStockList = localStorage.getItem("stockList");
    if (localStorageStockList) {
      setStockList(JSON.parse(localStorageStockList));
    }
    setIsInitialized(true); // 標記為已載入
  }, []);

  // save stock list
  useEffect(() => {
    if (isInitialized && !isDemo) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList, isDemo]);

  // save last inventory confirmed at
  useEffect(() => {
    if (isInitialized && !isDemo && lastInventoryConfirmedAt) {
      localStorage.setItem("lastInventoryConfirmedAt", lastInventoryConfirmedAt.toISOString());
    }
  }, [lastInventoryConfirmedAt, isDemo]);

  // search
  useEffect(() => {
    if (!searchParams) {
      setShowStockList(stockList.map(item => item.id)); 
      return;
    }
    
    setShowStockList(stockList.filter((item) => {
      if (checkStockIsEmpty(searchParams)) return true;     

      return (searchParams.name ? item.name.includes(searchParams.name) : true) &&
      (searchParams.type && (searchParams.type as string) !== "all" ? item.type === searchParams.type : true) &&
      (searchParams.unit && (searchParams.unit as string) !== "all" ? item.unit === searchParams.unit : true) &&
      (searchParams.count && item.count ? Number(item.count) <= Number(searchParams.count) : true) &&
      (searchParams.expirationDate && item.expirationDate ? new Date(item.expirationDate) <= new Date(searchParams.expirationDate) : true) &&
      (searchParams.purchaseDate && item.purchaseDate ? new Date(item.purchaseDate) <= new Date(searchParams.purchaseDate) : true) &&
      (searchParams.feedTagId && (searchParams.feedTagId as string) !== "all" ? item.feedTagId === searchParams.feedTagId : true) 
    }).map(item => item.id));
  }, [stockList, searchParams]);


  const relativeTime = useMemo(() => {
    let result = {timeFormat: "", status: ""};
    if(!lastInventoryConfirmedAt) return result;
    const dayDiff = Math.floor((Date.now() - lastInventoryConfirmedAt.getTime()) / 86400000);

    if(dayDiff === 0) {
      result = {timeFormat: "今天", status: "success"};
    } else if(dayDiff > 0 && dayDiff < 30) {
      result = {timeFormat: rtf1.format(-dayDiff, "day"), status: "success"};
    } else if(dayDiff > 0 && dayDiff < 365) {
      const monthDiff = Math.floor(dayDiff / 30);
      const status = monthDiff < 3 ? "success" : "warning";
      result = {timeFormat: rtf1.format(-monthDiff, "month"), status};
    } else {
      const yearDiff = Math.floor(dayDiff / 365);
      result = {timeFormat: rtf1.format(-yearDiff, "year"), status: "danger"};
    }

    return result;
  }, [lastInventoryConfirmedAt]);

  const replaceStockList = (newList: Stock[]) => setStockList(newList);

  const markTourAsSeen = () => {
    setHasSeenTour(true);
    localStorage.setItem("has-seen-tour", "true");
  };

  return (
    <StockListContext.Provider value={{ relativeTime, updateLastInventoryConfirmedAt, isDemo, setIsDemo, isInitialized, deleteStock, setDeleteStock, stockList, showStockList, addStock, removeStock, updateStock, searchStock, editStock, setEditStock, startFromDemoData, startFromClearingData, hasSeenTour, markTourAsSeen, activeTab, setActiveTab, replaceStockList }}>
      {children}
    </StockListContext.Provider>
  );
}
