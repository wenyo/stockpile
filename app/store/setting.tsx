import { createContext, useState, type ReactNode } from "react";
import { type HouseholdMember } from "@/interfaces/family";

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
};

const defaultSetting: SettingConfig = {
  targetDays: 30,
  rotationDays: 90,
};
const defaultHouseholdMember: HouseholdMember = {
  id: "sample_1",
  identity: "adult",
  name: "家庭成員 1",
  dailyKcalNeed: 2000,
  dailyMlWater: 2000,
};

export const SettingContext = createContext<SettingContextType>({
  setting: defaultSetting,
  updateSetting: () => {},
  household: [defaultHouseholdMember],
  updateHousehold: () => {},
  addHousehold: () => {},
  removeHousehold: () => {},
  editHousehold: null,
  setEditHousehold: () => {},
  deleteHousehold: null,
  setDeleteHousehold: () => {},
});

export function SettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<SettingConfig>(defaultSetting);
  const [household, setHousehold] = useState<HouseholdMember[]>([defaultHouseholdMember]);
  const [editHousehold, setEditHousehold] = useState<HouseholdMember | null>(null);
  const [deleteHousehold, setDeleteHousehold] = useState<HouseholdMember | null>(null);

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

  return (
    <SettingContext.Provider value={{ setting, updateSetting, household, updateHousehold, addHousehold, removeHousehold, editHousehold, setEditHousehold, deleteHousehold, setDeleteHousehold }}>
      {children}
    </SettingContext.Provider>
  );
}