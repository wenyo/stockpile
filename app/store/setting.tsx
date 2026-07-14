import { createContext, useState, useEffect, type ReactNode } from "react";
import { type HouseholdMember } from "@/interfaces/family";
import { type FeedTag } from "@/interfaces/stock";

import { sampleHouseholdData, sampleFeedTags } from "@/constant/sampleData";

export type SettingConfig = {
  targetDays: number;
  rotationDays: number;
};

type SettingContextType = {
  setting: SettingConfig;
  updateSetting: (newSetting: Partial<SettingConfig>) => void;
  household: HouseholdMember[];
  updateHousehold: (newHousehold: Partial<HouseholdMember>) => void;
  addHousehold: (newMember: HouseholdMember) => void;
  removeHousehold: (id: string) => void;
  editHousehold: HouseholdMember | null;
  setEditHousehold: (newHousehold: HouseholdMember | null) => void;
  deleteHousehold: HouseholdMember | null;
  setDeleteHousehold: (newHousehold: HouseholdMember | null) => void;
  feedTags: FeedTag[];
  addFeedTag: (newTag: Pick<FeedTag, "label" | "appliesToStockType">) => string;
};

const defaultSetting: SettingConfig = {
  targetDays: 30,
  rotationDays: 90,
};

export const SettingContext = createContext<SettingContextType>({
  setting: defaultSetting,
  updateSetting: () => {},
  household: sampleHouseholdData,
  updateHousehold: () => {},
  addHousehold: () => {},
  removeHousehold: () => {},
  editHousehold: null,
  setEditHousehold: () => {},
  deleteHousehold: null,
  setDeleteHousehold: () => {},
  feedTags: [],
  addFeedTag: () => "",
});

export function SettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<SettingConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stockpile_setting");
      if (saved) return JSON.parse(saved);
    }
    return defaultSetting;
  });
  
  const [household, setHousehold] = useState<HouseholdMember[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stockpile_household");
      if (saved) return JSON.parse(saved);
    }
    return sampleHouseholdData;
  });
  
  const [feedTags, setFeedTags] = useState<FeedTag[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stockpile_feedTags");
      if (saved) return JSON.parse(saved);
    }
    return sampleFeedTags;
  });

  const [editHousehold, setEditHousehold] = useState<HouseholdMember | null>(null);
  const [deleteHousehold, setDeleteHousehold] = useState<HouseholdMember | null>(null);

  useEffect(() => {
    localStorage.setItem("stockpile_setting", JSON.stringify(setting));
  }, [setting]);

  useEffect(() => {
    localStorage.setItem("stockpile_household", JSON.stringify(household));
  }, [household]);

  useEffect(() => {
    localStorage.setItem("stockpile_feedTags", JSON.stringify(feedTags));
  }, [feedTags]);

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
      id: new Date().getTime().toString(),
    }
    setHousehold((prevHousehold) => [...prevHousehold, addHouseholdInfo]);
  };

  const removeHousehold = (id: string) => {
    setHousehold((prevHousehold) => prevHousehold.filter((member) => member.id !== id));
  };

  const addFeedTag = (newTag: Pick<FeedTag, "label" | "appliesToStockType">) => {
    const id = `tag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setFeedTags((prev) => [...prev, { ...newTag, id }]);
    return id;
  };

  return (
    <SettingContext.Provider value={{ setting, updateSetting, household, updateHousehold, addHousehold, removeHousehold, editHousehold, setEditHousehold, deleteHousehold, setDeleteHousehold, feedTags, addFeedTag }}>
      {children}
    </SettingContext.Provider>
  );
}