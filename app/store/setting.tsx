import { createContext, useState, type ReactNode } from "react";
import { type HouseholdMember } from "@/constant/family";

export type SettingConfig = {
  targetDays: number;
  rotationDays: number;
};

type SettingContextType = {
  setting: SettingConfig;
  updateSetting: (newSetting: Partial<SettingConfig>) => void;
  config: HouseholdMember[];
  updateConfig: (newConfig: Partial<HouseholdMember>) => void;
  addMember: (newMember: HouseholdMember) => void;
  removeMember: (id: string) => void;
};

const defaultSetting: SettingConfig = {
  targetDays: 30,
  rotationDays: 90,
};
const defaultHouseholdMember: HouseholdMember = {
  id: "sample_1",
  identity: "adult",
  label: "家庭成員 1",
  dailyKcalNeed: 2000,
  dailyMlWater: 2000,
};

export const SettingContext = createContext<SettingContextType>({
  setting: defaultSetting,
  updateSetting: () => {},
  config: [defaultHouseholdMember],
  updateConfig: () => {},
  addMember: () => {},
  removeMember: () => {},
});

export function SettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<SettingConfig>(defaultSetting);
  const [config, setConfig] = useState<HouseholdMember[]>([defaultHouseholdMember]);

  const updateSetting = (newSetting: Partial<SettingConfig>) => {
    setSetting((prevSetting) => ({ ...prevSetting, ...newSetting }));
  };

  const updateConfig = (newConfig: Partial<HouseholdMember>) => {
    setConfig((prevConfig) => prevConfig.map((member) => member.id === newConfig.id ? { ...member, ...newConfig } : member));
  };

  const addMember = (newMember: HouseholdMember) => {
    setConfig((prevConfig) => [...prevConfig, newMember]);
  };

  const removeMember = (id: string) => {
    setConfig((prevConfig) => prevConfig.filter((member) => member.id !== id));
  };

  return (
    <SettingContext.Provider value={{ setting, updateSetting, config, updateConfig, addMember, removeMember }}>
      {children}
    </SettingContext.Provider>
  );
}