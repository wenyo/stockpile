import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { type HouseholdMember } from "@/interfaces/family";
import { type Tag, type Stock } from "@/interfaces/stock";

import { sampleHouseholdData, sampleFeedTags } from "@/constant/sampleData";
import { StockListContext } from "@/store/stockList";

export type SettingConfig = {
  targetDays: number;
  rotationDays: number;
};

type SettingContextType = {
  setting: SettingConfig | null;
  updateSetting: (newSetting: Partial<SettingConfig>) => void;
  household: HouseholdMember[];
  updateHousehold: (newHousehold: Partial<HouseholdMember>) => void;
  addHousehold: (newMember: HouseholdMember) => void;
  removeHousehold: (id: string) => void;
  editHousehold: HouseholdMember | null;
  setEditHousehold: (newHousehold: HouseholdMember | null) => void;
  deleteHousehold: HouseholdMember | null;
  setDeleteHousehold: (newHousehold: HouseholdMember | null) => void;
  stockTags:Tag[];
  addStockTag: (newTag: Pick<Tag, "label" | "appliesToStockType"> & { unit?: string }) => string;
  replaceSetting: (newSetting: SettingConfig) => void;
  replaceHousehold: (newHousehold: HouseholdMember[]) => void;
  replaceStockTags: (newTags:Tag[]) => void;
};

export function migrateTagsWithUnits(
  tags: Tag[],
  household: HouseholdMember[],
  stockList: Stock[]
): { migratedTags: Tag[]; hasChanged: boolean } {
  let hasChanged = false;

  const migratedTags = tags.map((tag) => {
    if (tag.unit) return tag;

    let foundUnit: string | undefined;

    // 1. 查找 household
    for (const member of household) {
      const portion = member.feedPortions?.find((p) => p.feedTagId === tag.id);
      if (portion?.unit) {
        foundUnit = portion.unit;
        break;
      }
      const need = member.medicineNeeds?.find((n) => n.medicineTagId === tag.id);
      if (need?.unit) {
        foundUnit = need.unit;
        break;
      }
    }

    // 2. 查找 stockList
    if (!foundUnit) {
      const stock = stockList.find(
        (s) => s.feedTagId === tag.id || s.medicineTagId === tag.id
      );
      if (stock) {
        foundUnit = stock.volumeUnit;
      }
    }

    // 3. 預設 Fallback
    if (!foundUnit) {
      foundUnit = tag.appliesToStockType === "medicine" ? "tablet" : "g";
    }

    hasChanged = true;
    return { ...tag, unit: foundUnit };
  });

  return { migratedTags, hasChanged };
}

const defaultSetting: SettingConfig = {
  targetDays: 30,
  rotationDays: 90,
};

export const SettingContext = createContext<SettingContextType>({
  setting: null,
  updateSetting: () => {},
  household: [],
  updateHousehold: () => {},
  addHousehold: () => {},
  removeHousehold: () => {},
  editHousehold: null,
  setEditHousehold: () => {},
  deleteHousehold: null,
  setDeleteHousehold: () => {},
  stockTags: [],
  addStockTag: () => "",
  replaceSetting: () => {},
  replaceHousehold: () => {},
  replaceStockTags: () => {},
});

export function SettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<SettingConfig>(defaultSetting);
  const [household, setHousehold] = useState<HouseholdMember[]>([]);
  const [stockTags, setFeedTags] = useState<Tag[]>([]);
  const [editHousehold, setEditHousehold] = useState<HouseholdMember | null>(null);
  const [deleteHousehold, setDeleteHousehold] = useState<HouseholdMember | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { isDemo } = useContext(StockListContext);

  // init
  useEffect(() => {    
    if(isDemo) {
      return;
    }

    const localStorageSetting = localStorage.getItem("stockpile_setting");
    if (localStorageSetting) {
      setSetting(JSON.parse(localStorageSetting));
    }

    const localStorageHousehold = localStorage.getItem("stockpile_household");
    let initialHousehold: HouseholdMember[] = [];
    if (localStorageHousehold) {
      initialHousehold = JSON.parse(localStorageHousehold);
      setHousehold(initialHousehold);
    }

    let savedTags = localStorage.getItem("stockpile_stockTags");
    if (!savedTags) {
      const oldTags = localStorage.getItem("stockpile_feedTags");
      if (oldTags) {
        savedTags = oldTags;
        localStorage.setItem("stockpile_stockTags", oldTags);
      }
    }
    let initialTags: Tag[] = [];
    if (savedTags) {
      initialTags = JSON.parse(savedTags);
    }

    let initialStocks: Stock[] = [];
    const localStorageStockList = localStorage.getItem("stockList");
    if (localStorageStockList) {
      try {
        initialStocks = JSON.parse(localStorageStockList);
      } catch (e) {
        // ignore parse error
      }
    }

    const { migratedTags, hasChanged } = migrateTagsWithUnits(
      initialTags,
      initialHousehold,
      initialStocks
    );

    if (hasChanged) {
      localStorage.setItem("stockpile_stockTags", JSON.stringify(migratedTags));
    }
    setFeedTags(migratedTags);

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isDemo) {
      setSetting(defaultSetting);
      setHousehold(sampleHouseholdData);
      setFeedTags(sampleFeedTags);
    } else {
      setSetting(defaultSetting);
      setHousehold([]);
      setFeedTags([]);
    }
  }, [isDemo]);

  useEffect(() => {
    if (isInitialized && !isDemo) {
      localStorage.setItem("stockpile_setting", JSON.stringify(setting));
    }
  }, [setting, isDemo]);

  useEffect(() => {
    if (isInitialized && !isDemo) {
      localStorage.setItem("stockpile_household", JSON.stringify(household));
    }
  }, [household, isDemo]);

  useEffect(() => {
    if (isInitialized && !isDemo) {
      localStorage.setItem("stockpile_stockTags", JSON.stringify(stockTags));
    }
  }, [stockTags, isDemo]);

  const updateSetting = (newSetting: Partial<SettingConfig>) => {
    setSetting((prevSetting) => ({ ...prevSetting, ...newSetting }));
  };

  const updateHousehold = (newHousehold: Partial<HouseholdMember>) => {
    setHousehold((prevHousehold) => prevHousehold.map((member) => member.id === newHousehold.id ? { ...member, ...newHousehold } : member));
    setEditHousehold(null);
  };

  const addHousehold = (newMember: HouseholdMember) => {
    const addHouseholdInfo = {
      ...newMember,
      id: newMember.id || new Date().getTime().toString(),
    }
    setHousehold((prevHousehold) => [...prevHousehold, addHouseholdInfo]);
  };

  const removeHousehold = (id: string) => {
    setHousehold((prevHousehold) => prevHousehold.filter((member) => member.id !== id));
  };

  const addStockTag = (newTag: Pick<Tag, "label" | "appliesToStockType"> & { unit?: string }) => {
    const id = `tag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const unit = newTag.unit || (newTag.appliesToStockType === "medicine" ? "tablet" : "g");
    setFeedTags((prev) => [...prev, { ...newTag, id, unit }]);
    return id;
  };

  const replaceSetting = (newSetting: SettingConfig) => setSetting(newSetting);
  const replaceHousehold = (newHousehold: HouseholdMember[]) => setHousehold(newHousehold);
  const replaceStockTags = (newTags:Tag[]) => setFeedTags(newTags);

  return (
    <SettingContext.Provider value={{ setting, updateSetting, household, updateHousehold, addHousehold, removeHousehold, editHousehold, setEditHousehold, deleteHousehold, setDeleteHousehold, stockTags, addStockTag, replaceSetting, replaceHousehold, replaceStockTags }}>
      {children}
    </SettingContext.Provider>
  );
}