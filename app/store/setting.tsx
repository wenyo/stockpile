import { createContext, useState, type ReactNode } from "react";

export type SettingConfig = {
  people: number;
  targetDays: number;
  rotationDays: number;
  onePersonOneDayCalories: number;
  waterMlPerPersonPerDay: number;
};

type SettingContextType = {
  config: SettingConfig;
  updateConfig: (newConfig: Partial<SettingConfig>) => void;
};

const defaultSetting: SettingConfig = {
  people: 1,
  targetDays: 30,
  rotationDays: 90,
  onePersonOneDayCalories: 2000,
  waterMlPerPersonPerDay: 2000,
};

export const SettingContext = createContext<SettingContextType>({
  config: defaultSetting,
  updateConfig: () => {},
});

export function SettingProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SettingConfig>(defaultSetting);
  // 一樣可以在這裡做 localStorage 的初始化與儲存...
  const updateConfig = (newConfig: Partial<SettingConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };
  return (
    <SettingContext.Provider value={{ config, updateConfig }}>
      {children}
    </SettingContext.Provider>
  );
}